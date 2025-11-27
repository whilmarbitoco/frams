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

  const handleCapture = async (images: string[]) => {
    setIsCapturing(false);
    setIsUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, images }),
      });

      if (!response.ok) throw new Error("Upload failed");

      setStatus("success");
    } catch (error) {
      console.error(error);
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
      className="flex flex-col items-center justify-center min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full max-w-md">
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
                <motion.div className="flex flex-col items-center gap-4" variants={containerVariants}>
                  <WebcamCapture
                    onCapture={handleCapture}
                    isCapturing={isCapturing}
                  />

                  {!isCapturing && !isUploading && (
                    <motion.div variants={itemVariants}>
                      <Button
                        onClick={() => setIsCapturing(true)}
                        disabled={!studentId}
                      >
                        Start Capture
                      </Button>
                    </motion.div>
                  )}

                  {isUploading && (
                    <motion.div variants={itemVariants}>
                      <Button disabled className="w-full">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
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
                Your face has been securely saved.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setStatus("idle");
                    setStudentId("");
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
                Something went wrong. Please try again.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStatus("idle")}
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
