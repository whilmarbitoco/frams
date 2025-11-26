"use client";

import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function AttendanceMarkingPage() {
  const params = useParams();
  const classId = params.classId as string;
  const sessionId = params.sessionId as string;

  const webcamRef = useRef<Webcam>(null);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "scanning" | "success" | "error">("loading");
  const [recognizedStudent, setRecognizedStudent] = useState<string | null>(null);

  // Placeholder model URL - in a real app, this would be fetched from DB/Settings
  // Admin would train model on Teachable Machine and provide this URL
  const URL = "https://teachablemachine.withgoogle.com/models/CbC1vH2pE/"; 

  useEffect(() => {
    async function loadModel() {
      try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
        setStatus("ready");
      } catch (error) {
        console.error("Failed to load model:", error);
        setStatus("error");
      }
    }
    loadModel();
  }, []);

  const predict = async () => {
    if (!model || !webcamRef.current?.video) return;

    setStatus("scanning");
    const prediction = await model.predict(webcamRef.current.video as HTMLVideoElement);
    
    // Find the class with the highest probability
    let highestProb = 0;
    let bestClass = "";

    prediction.forEach((p) => {
      if (p.probability > highestProb) {
        highestProb = p.probability;
        bestClass = p.className;
      }
    });

    if (highestProb > 0.85) {
      setRecognizedStudent(bestClass);
      await markAttendance(bestClass);
    } else {
      setStatus("ready"); // Retry
      alert("Face not recognized or low confidence. Please try again.");
    }
  };

  const markAttendance = async (studentId: string) => {
    try {
      const response = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, sessionId, studentId }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        throw new Error("Failed to mark attendance");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>Look at the camera to mark your attendance.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative rounded-lg overflow-hidden border-2 border-primary">
             <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={480}
                height={480}
                videoConstraints={{ facingMode: "user" }}
              />
          </div>

          {status === "loading" && <p>Loading model...</p>}
          {status === "ready" && (
            <Button onClick={predict} size="lg">Mark Attendance</Button>
          )}
          {status === "scanning" && <p>Scanning...</p>}
          {status === "success" && (
            <div className="text-green-600 text-center">
              <h3 className="text-xl font-bold">Attendance Marked!</h3>
              <p>Welcome, {recognizedStudent}.</p>
            </div>
          )}
          {status === "error" && <p className="text-red-600">Error. Please try again.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
