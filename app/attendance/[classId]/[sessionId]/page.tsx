"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { markAttendance } from "@/actions/attendance";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createCamera } from "@/lib/utils";
import { motion } from "@/components/motion";

declare global {
  interface Window {
    tmImage: any;
    tf: any;
    mpFaceMesh: any;
  }
}

export default function AttendanceMarkingPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tmModel, setTmModel] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "scanning" | "success" | "error">("loading");
  const [recognizedStudent, setRecognizedStudent] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();
  const classId = parseInt(params.classId as string, 10);
  const sessionId = params.sessionId as string;

  const TM_URL = "https://teachablemachine.withgoogle.com/models/CbC1vH2pE/";

  useEffect(() => {
    const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });

    const loadModels = async () => {
      try {
        await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8.5/dist/teachablemachine-image.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js");
        const loadedModel = await window.tmImage.load(TM_URL + "model.json", TM_URL + "metadata.json");
        setTmModel(loadedModel);
        setStatus("ready");
      } catch (err) {
        console.error("Failed to load models:", err);
        setStatus("error");
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!webcamRef.current?.video || status !== "ready") return;

    const video = webcamRef.current.video;
    const faceMesh = new window.mpFaceMesh.FaceMesh({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMesh.setOptions({ maxNumFaces: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
    faceMesh.onResults(onResults);

    const camera = createCamera(video, faceMesh);
    camera.start();

    return () => camera.stop();
  }, [status]);

  const onResults = (results: any) => {
    const canvas = canvasRef.current;
    if (!canvas || !results.multiFaceLandmarks) return;

    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const landmarks of results.multiFaceLandmarks) {
      const x = landmarks[0].x * canvas.width;
      const y = landmarks[0].y * canvas.height;
      const w = (landmarks[200].x - landmarks[0].x) * canvas.width;
      const h = (landmarks[400].y - landmarks[0].y) * canvas.height;
      ctx.strokeStyle = "#FFC107";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
    }
    ctx.restore();

    if (status === "ready" || status === "scanning") predict();
  };

  const predict = async () => {
    if (!tmModel || !webcamRef.current?.video || status === "success") return;
    
    if (status === "ready") setStatus("scanning");

    const predictions = await tmModel.predict(webcamRef.current.video);

    for (const p of predictions) {
      if (p.probability > 0.9) { // Increased confidence threshold
        setRecognizedStudent(p.className);
        setStatus("success");
        await markAttendance(p.className, classId, sessionId);
        setTimeout(() => router.push("/"), 3000); // Redirect after 3s
        return;
      }
    }
  };

  const statusMessages = {
    loading: { icon: <Loader2 className="animate-spin" />, text: "Loading Model..." },
    ready: { text: "Ready to scan. Please look at the camera." },
    scanning: { icon: <Loader2 className="animate-spin" />, text: "Scanning for face..." },
    success: { icon: <CheckCircle className="text-green-500" />, text: `Welcome, ${recognizedStudent}!` },
    error: { icon: <XCircle className="text-red-500" />, text: "Failed to load model." },
  };

  const currentStatus = statusMessages[status];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full max-w-2xl p-4">
        <CardContent className="flex flex-col items-center gap-4">
          <motion.div className="relative w-full aspect-video" variants={itemVariants}>
            <Webcam
              ref={webcamRef}
              videoConstraints={{ facingMode: "user", width: 1280, height: 720 }}
              className="rounded-lg w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              width={1280}
              height={720}
            />
          </motion.div>
          <motion.div className="flex items-center justify-center h-8 text-lg font-medium text-muted-foreground" variants={itemVariants}>
            {currentStatus.icon && <span className="mr-2 h-6 w-6">{currentStatus.icon}</span>}
            <p>{currentStatus.text}</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
