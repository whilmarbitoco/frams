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

  const handleCapture = async (images: string[]) => {
    console.log(`handleCapture called with ${images.length} images`);
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

  console.log("Render state:", { studentId, isCapturing, isUploading, status });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Face Registration</CardTitle>
          <CardDescription>Enter your Student ID to begin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "idle" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={isCapturing || isUploading}
                />
              </div>

              {studentId && (
                <div className="space-y-4">
                  {/* Webcam section */}
                  <div className="w-full">
                    <WebcamCapture
                      onCapture={handleCapture}
                      isCapturing={isCapturing}
                    />
                  </div>

                  {/* Button section - always visible for testing */}
                  <div className="flex flex-col items-center gap-2 w-full bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-blue-500">
                    <p className="text-sm font-bold text-red-500">DEBUG: Button container (should be visible)</p>
                    
                    {!isCapturing && !isUploading ? (
                      <>
                        <Button
                          onClick={() => {
                            console.log("Start Capture button clicked!");
                            setIsCapturing(true);
                          }}
                          disabled={!studentId}
                          size="lg"
                          className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Start Capture
                        </Button>
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                          We'll capture 15-25 images over 5 seconds
                        </p>
                      </>
                    ) : null}

                    {isUploading && (
                      <Button disabled className="w-full max-w-xs">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </Button>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      isCapturing: {isCapturing.toString()} | isUploading: {isUploading.toString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h3 className="font-bold text-lg">Registration Complete!</h3>
              <p className="text-muted-foreground">
                Your face has been securely saved.
              </p>
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
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-red-500" />
              <h3 className="font-bold text-lg">Registration Failed</h3>
              <p className="text-muted-foreground">
                Something went wrong. Please try again.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStatus("idle")}
              >
                Retry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Link
        href="/"
        className="mt-4 text-sm text-muted-foreground hover:underline"
      >
        Back to Home
      </Link>
    </div>
  );
}
