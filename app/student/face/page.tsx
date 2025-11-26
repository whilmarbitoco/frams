"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WebcamCapture } from "@/components/webcam-capture";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Student Face Registration</CardTitle>
          <CardDescription>Enter your Student ID and look at the camera.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Student ID</label>
            <Input 
              placeholder="Enter Student ID" 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)}
              disabled={isCapturing || isUploading || status === "success"}
            />
          </div>

          {studentId && status !== "success" && (
            <div className="flex flex-col items-center gap-4">
              <WebcamCapture onCapture={handleCapture} isCapturing={isCapturing} />
              
              {!isCapturing && !isUploading && (
                <Button onClick={() => setIsCapturing(true)} disabled={!studentId}>
                  Start Capture
                </Button>
              )}

              {isUploading && (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Images...
                </Button>
              )}
            </div>
          )}

          {status === "success" && (
            <div className="text-center text-green-600 p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-lg">Registration Complete!</h3>
              <p>Your face data has been securely saved.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                  setStatus("idle");
                  setStudentId("");
                  setIsCapturing(false);
              }}>
                  Register Another
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center text-red-600">
              <p>Something went wrong. Please try again.</p>
              <Button variant="outline" className="mt-2" onClick={() => setStatus("idle")}>Retry</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
