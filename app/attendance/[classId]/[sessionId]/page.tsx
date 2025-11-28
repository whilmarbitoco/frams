"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { markAttendance } from "@/actions/attendance";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import * as tmImage from "@teachablemachine/image";
import { FilesetResolver, FaceDetector } from "@mediapipe/tasks-vision";

export default function AttendanceMarkingPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [tmModel, setTmModel] = useState<any>(null);
  const [faceDetector, setFaceDetector] = useState<FaceDetector | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "scanning" | "success" | "error"
  >("loading");
  const [recognizedStudent, setRecognizedStudent] = useState<string | null>(
    null
  );
  const isPredicting = useRef(false);

  const params = useParams();
  const router = useRouter();
  const classId = parseInt(params.classId as string, 10);
  const sessionId = params.sessionId as string;
  const TM_URL = "/model/";

  // -----------------------------
  // LOAD TEACHABLE MACHINE + MEDIAPIPE FACE DETECTOR
  // -----------------------------
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading models...");
        // Load TM model
        const loadedTM = await tmImage.load(
          TM_URL + "model.json",
          TM_URL + "metadata.json"
        );
        setTmModel(loadedTM);
        console.log("Teachable Machine model loaded.");

        // Load MediaPipe FaceDetector
        const fileset = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const detector = await FaceDetector.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
        });

        setFaceDetector(detector);
        console.log("Face Detector loaded.");

        setStatus("ready");
      } catch (err) {
        console.error("Failed to load models:", err);
        setStatus("error");
      }
    };

    loadModels();
  }, []);

  // -----------------------------
  // DETECTION LOOP
  // -----------------------------
  useEffect(() => {
    let animationFrameId: number;

    const detect = async () => {
      if (!faceDetector || !webcamRef.current?.video || !tmModel) {
        animationFrameId = requestAnimationFrame(detect);
        return;
      }

      const video = webcamRef.current.video;
      if (video.readyState !== 4) {
         animationFrameId = requestAnimationFrame(detect);
         return;
      }

      try {
          const startTimeMs = performance.now();
          const results = faceDetector.detectForVideo(video, startTimeMs);
          drawBoundingBoxes(results);

          if ((status === "ready" || status === "scanning") && !isPredicting.current) {
            // Only predict if a face is detected
            if (results.detections.length > 0) {
                 predict();
            }
          }
      } catch (error) {
          console.error("Detection error:", error);
      }

      animationFrameId = requestAnimationFrame(detect);
    };

    if (status === "ready" && faceDetector && tmModel) {
        detect();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [status, faceDetector, tmModel]);

  // -----------------------------
  // DRAW BOUNDING BOXES
  // -----------------------------
  const drawBoundingBoxes = (results: any) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results?.detections) return;

    results.detections.forEach((det: any) => {
      const box = det.boundingBox;
      ctx.strokeStyle = "#FFC107";
      ctx.lineWidth = 3;
      ctx.strokeRect(box.originX, box.originY, box.width, box.height);
    });
  };

  // -----------------------------
  // PREDICTION (TEACHABLE MACHINE)
  // -----------------------------
  const predict = async () => {
    if (!tmModel || !webcamRef.current?.video || status === "success" || isPredicting.current) return;

    isPredicting.current = true;
    if (status === "ready") setStatus("scanning");

    try {
        const predictions = await tmModel.predict(webcamRef.current.video);

        let bestPrediction = null;
        let highestProb = 0;

        for (const p of predictions) {
            if (p.probability > highestProb) {
                highestProb = p.probability;
                bestPrediction = p;
            }
        }

        if (bestPrediction && bestPrediction.probability > 0.95) {
            // Ensure it's not the "Class 2" or background class if you have one, usually index 0 or last
            // Assuming valid classes are student IDs/names
            console.log("Recognized:", bestPrediction.className);
            setRecognizedStudent(bestPrediction.className);
            setStatus("success");

            await markAttendance(bestPrediction.className, classId, sessionId);
            setTimeout(() => router.push("/"), 3000);
        }
    } catch (error) {
        console.error("Prediction error:", error);
    } finally {
        isPredicting.current = false;
    }
  };

  const statusMessages = {
    loading: {
      icon: <Loader2 className="animate-spin" />,
      text: "Loading Models...",
    },
    ready: {
      icon: <InfoCircledIcon className="text-blue-500" />,
      text: "Ready. Look at the camera.",
    },
    scanning: {
      icon: <Loader2 className="animate-spin" />,
      text: "Scanning...",
    },
    success: {
      icon: <CheckCircle className="text-green-500" />,
      text: `Welcome, ${recognizedStudent}!`,
    },
    error: {
      icon: <XCircle className="text-red-500" />,
      text: "Model load failed.",
    },
  };

  const currentStatus = statusMessages[status];

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl p-4">
        <CardContent className="flex flex-col items-center gap-4">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-md">
            <Webcam
              ref={webcamRef}
              videoConstraints={{
                facingMode: "user",
                width: 1280,
                height: 720,
              }}
              className="absolute inset-0 w-full h-full object-cover z-10 transform scale-x-[-1]"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
              width={1280}
              height={720}
            />
          </div>
          <div className="flex items-center justify-center h-8 text-lg font-medium text-muted-foreground z-30">
            {currentStatus.icon && (
              <span className="mr-2 h-6 w-6 flex items-center">
                {currentStatus.icon}
              </span>
            )}
            <p>{currentStatus.text}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
