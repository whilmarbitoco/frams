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
        setErrorMessage(data.message || data.error || "Upload failed");
        setStatus("error");
        return; // Exit early
      }

      setUploadedCount(data.imageCount || images.length);
      setStatus("success");
      console.log("Upload successful:", data);
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div>
            <CardTitle className="text-2xl">Face Registration</CardTitle>
            <CardDescription>Enter your Student ID to begin.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "idle" && (
            <>
              <div className="space-y-2">
                <Input
                  placeholder="Enter Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={isCapturing || isUploading}
                />
              </div>

              {studentId && (
                <>
                  <WebcamCapture
                    onCapture={handleCapture}
                    isCapturing={isCapturing}
                  />

                  {!isCapturing && !isUploading && (
                    <div className="flex flex-col items-center gap-2 w-full z-20">
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
                    </div>
                  )}

                  {isUploading && (
                    <div className="flex justify-center z-20">
                      <Button disabled className="w-full max-w-xs">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div>
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="font-bold text-lg">Registration Complete!</h3>
              <p className="text-muted-foreground">
                Successfully uploaded {uploadedCount} images for student ID:{" "}
                {studentId}
              </p>
              <div>
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
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div>
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>
              <h3 className="font-bold text-lg">Registration Failed</h3>
              <p className="text-muted-foreground">
                {errorMessage || "Something went wrong. Please try again."}
              </p>
              <div>
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div>
        <Link
          href="/"
          className="mt-4 text-sm text-muted-foreground hover:underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
