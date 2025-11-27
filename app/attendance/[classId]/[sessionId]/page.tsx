"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { markAttendance } from "@/actions/attendance";
import { useParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export default function AttendanceMarkingPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<any>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "scanning" | "success" | "error"
  >("loading");
  const [recognizedStudent, setRecognizedStudent] = useState<string | null>(
    null
  );
  const params = useParams();
  const classId = parseInt(params.classId as string, 10);
  const sessionId = params.sessionId as string;

  const URL = "https://teachablemachine.withgoogle.com/models/CbC1vH2pE/";

  useEffect(() => {
    // Dynamically load scripts
    const tfScript = document.createElement("script");
    tfScript.src =
      "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";
    tfScript.async = true;
    document.body.appendChild(tfScript);

    const tmScript = document.createElement("script");
    tmScript.src =
      "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";
    tmScript.async = true;
    document.body.appendChild(tmScript);

    tmScript.onload = async () => {
      try {
        const loadedModel = await (window as any).tmImage.load(
          URL + "model.json",
          URL + "metadata.json"
        );
        setModel(loadedModel);
        setStatus("ready");
      } catch (err) {
        console.error("Failed to load model:", err);
        setStatus("error");
      }
    };
  }, []);

  useEffect(() => {
    if (status === "ready" && webcamRef.current?.video) {
      const faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults(onResults);

      const camera = new Camera(webcamRef.current.video!, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current!.video! });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, [status]);

  const onResults = (results: any) => {
    const canvas = canvasRef.current;
    if (canvas && results.multiFaceLandmarks) {
      const canvasCtx = canvas.getContext("2d")!;
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      for (const landmarks of results.multiFaceLandmarks) {
        // Draw bounding box (simplified)
        const x = landmarks[0].x * canvas.width;
        const y = landmarks[0].y * canvas.height;
        const w = (landmarks[200].x - landmarks[0].x) * canvas.width;
        const h = (landmarks[400].y - landmarks[0].y) * canvas.height;
        canvasCtx.strokeStyle = "#FFC107";
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeRect(x, y, w, h);
      }
      canvasCtx.restore();

      // Predict if not already successful
      if (status !== "success") {
        predict();
      }
    }
  };

  const predict = async () => {
    if (!model || !webcamRef.current?.video || status === "scanning") return;

    setStatus("scanning");
    const prediction = await model.predict(
      webcamRef.current.video as HTMLVideoElement
    );

    for (const p of prediction) {
      if (p.probability > 0.85) {
        setRecognizedStudent(p.className);
        setStatus("success");
        await markAttendance(p.className, classId, sessionId);
        break;
      }
    }

    if (status !== "success") {
      setStatus("ready"); // Reset if no confident prediction
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Webcam
        ref={webcamRef}
        width={640}
        height={480}
        videoConstraints={{ facingMode: "user" }}
        className="rounded-lg"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        width={640}
        height={480}
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        {status === "loading" && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading Model...
          </Button>
        )}
        {status === "ready" && (
          <Button onClick={predict}>Mark Attendance</Button>
        )}
        {status === "scanning" && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scanning...
          </Button>
        )}
        {status === "success" && (
          <Button variant="default" className="bg-green-500 text-white">
            <CheckCircle className="mr-2 h-4 w-4" />
            Welcome, {recognizedStudent}!
          </Button>
        )}
        {status === "error" && (
          <Button variant="destructive">
            <XCircle className="mr-2 h-4 w-4" />
            Failed to load model
          </Button>
        )}
      </div>
    </div>
  );
}
