"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { WebcamCapture } from "@/components/webcam-capture";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "@/components/motion";

export default function StudentFaceRegistration() {
  const [studentId, setStudentId] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleCapture = async (images: string[]) => {
    console.log(`handleCapture called with ${images.length} images`);
    setIsCapturing(false);
    setIsUploading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, images }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Upload failed");
      }

      setUploadedCount(data.imageCount || images.length);
      setStatus("success");
      console.log("Upload successful:", data);
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
      setStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

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
      className="flex flex-col items-center justify-center min-h-screen bg-background p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <motion.div variants={itemVariants}>
            <CardTitle className="text-2xl">Face Registration</CardTitle>
            <CardDescription>Enter your Student ID to begin.</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "idle" && (
            <>
              <motion.div className="space-y-2" variants={itemVariants}>
                <Input
                  placeholder="Enter Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={isCapturing || isUploading}
                />
              </motion.div>

              {studentId && (
                <>
                  <motion.div variants={itemVariants}>
                    <WebcamCapture
                      onCapture={handleCapture}
                      isCapturing={isCapturing}
                    />
                  </motion.div>

                  {!isCapturing && !isUploading && (
                    <motion.div className="flex flex-col items-center gap-2 w-full" variants={itemVariants}>
                      <Button
                        onClick={() => setIsCapturing(true)}
                        disabled={!studentId}
                        size="lg"
                        className="w-full max-w-xs"
                      >
                        Start Capture
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        We'll capture 15-25 images over 5 seconds
                      </p>
                    </motion.div>
                  )}

                  {isUploading && (
                    <motion.div variants={itemVariants} className="flex justify-center">
                      <Button disabled className="w-full max-w-xs">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </>
          )}

          {status === "success" && (
            <motion.div className="flex flex-col items-center text-center space-y-4" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <CheckCircle className="w-16 h-16 text-green-500" />
              </motion.div>
              <motion.h3 className="font-bold text-lg" variants={itemVariants}>Registration Complete!</motion.h3>
              <motion.p className="text-muted-foreground" variants={itemVariants}>
                Successfully uploaded {uploadedCount} images for student ID: {studentId}
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setStatus("idle");
                    setStudentId("");
                    setUploadedCount(0);
                  }}
                >
                  Register Another Student
                </Button>
              </motion.div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div className="flex flex-col items-center text-center space-y-4" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <AlertCircle className="w-16 h-16 text-red-500" />
              </motion.div>
              <motion.h3 className="font-bold text-lg" variants={itemVariants}>Registration Failed</motion.h3>
              <motion.p className="text-muted-foreground" variants={itemVariants}>
                {errorMessage || "Something went wrong. Please try again."}
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setStatus("idle");
                    setErrorMessage("");
                  }}
                >
                  Retry
                </Button>
              </motion.div>
            </motion.div>
          )}
        </CardContent>
      </Card>
      <motion.div variants={itemVariants}>
        <Link
          href="/"
          className="mt-4 text-sm text-muted-foreground hover:underline"
        >
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}
