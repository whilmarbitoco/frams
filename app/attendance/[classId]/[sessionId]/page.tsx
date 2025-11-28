"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { markAttendance } from "@/actions/attendance";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import * as tmImage from "@teachablemachine/image";
import { FilesetResolver, FaceDetector } from "@mediapipe/tasks-vision";
import { Button } from "@/components/ui/button"; // Added import for Button

export default function AttendanceMarkingPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [tmModel, setTmModel] = useState<any>(null);
  const [faceDetector, setFaceDetector] = useState<FaceDetector | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "scanning" | "success" | "already_marked" | "error"
  >("loading");
  const [recognizedStudent, setRecognizedStudent] = useState<string | null>(
    null
  );
  const isPredicting = useRef(false);
  const lastPredictionTime = useRef(0);

  const params = useParams();
  const router = useRouter();
  const classId = parseInt(params.classId as string, 10);
  const sessionId = params.sessionId as string;
  const TM_URL = "/model/";

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
        console.log("Failed to load models:", err);
        setStatus("error");
      }
    };

    loadModels();
  }, []);

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

        if (
          (status === "ready" || status === "scanning") &&
          !isPredicting.current
        ) {
          const now = performance.now();
          if (
            results.detections.length > 0 &&
            now - lastPredictionTime.current > 500
          ) {
            predict();
            lastPredictionTime.current = now;
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
      // Mirror the X coordinate because the video is mirrored
      const mirroredX = canvas.width - box.originX - box.width;
      ctx.strokeRect(mirroredX, box.originY, box.width, box.height);
    });
  };

  const predict = async () => {
    if (
      !tmModel ||
      !webcamRef.current?.video ||
      status === "success" ||
      status === "already_marked" ||
      isPredicting.current
    )
      return;

    isPredicting.current = true;

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
        console.log("Recognized:", bestPrediction.className);

        setStatus("scanning");

        try {
          const result = await markAttendance(
            bestPrediction.className,
            classId,
            sessionId
          );

          if (result.success) {
            setRecognizedStudent(bestPrediction.className);
            setStatus("success");
            setTimeout(() => {
              setStatus("ready");
              setRecognizedStudent(null);
            }, 3000);
          } else if (
            result.error === "Attendance already marked for this session."
          ) {
            setRecognizedStudent(bestPrediction.className);
            setStatus("already_marked");
            setTimeout(() => {
              setStatus("ready");
              setRecognizedStudent(null);
            }, 3000);
          } else {
            console.error("Attendance error:", result.error);
            setStatus("error");
            setTimeout(() => setStatus("ready"), 3000);
          }
        } catch (serverError) {
          console.error("Server action error:", serverError);
          setStatus("error");
          setTimeout(() => setStatus("ready"), 3000);
        }
      }
    } catch (error) {
      console.error("Prediction error:", error);
      if (status === "scanning") {
        setStatus("error");
        setTimeout(() => setStatus("ready"), 3000);
      }
    } finally {
      isPredicting.current = false;
    }
  };

  const statusMessages = {
    loading: {
      icon: <Loader2 className="animate-spin" />,
      text: "Loading Models...",
      color: "text-muted-foreground",
    },
    ready: {
      icon: <InfoCircledIcon className="text-blue-500" />,
      text: "Ready. Look at the camera.",
      color: "text-blue-500",
    },
    scanning: {
      icon: <Loader2 className="animate-spin" />,
      text: "Verifying...",
      color: "text-yellow-500",
    },
    success: {
      icon: <CheckCircle className="text-green-500" />,
      text: `Welcome, ${recognizedStudent}!`,
      color: "text-green-500",
    },
    already_marked: {
      icon: <CheckCircle className="text-yellow-500" />,
      text: `Welcome back, ${recognizedStudent}! (Already marked)`,
      color: "text-yellow-500",
    },
    error: {
      icon: <XCircle className="text-red-500" />,
      text: "Verification failed. Retrying...",
      color: "text-red-500",
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
          <div className="flex flex-col items-center justify-center h-16 text-lg font-medium text-muted-foreground z-30 gap-2">
            <div className={`flex items-center ${currentStatus.color}`}>
              {currentStatus.icon && (
                <span className="mr-2 h-6 w-6 flex items-center">
                  {currentStatus.icon}
                </span>
              )}
              <p>{currentStatus.text}</p>
            </div>
            {status === "error" || status === "scanning" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatus("ready");
                  isPredicting.current = false;
                }}
              >
                Reset
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
