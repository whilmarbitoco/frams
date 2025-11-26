"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";

interface WebcamCaptureProps {
  onCapture: (images: string[]) => void;
  isCapturing: boolean;
}

export function WebcamCapture({ onCapture, isCapturing }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [capturing, setCapturing] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prev) => [...prev, imageSrc]);
    }
  }, [webcamRef]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCapturing && !capturing) {
      setCapturing(true);
      setCapturedImages([]);
      // Capture 5 images per second (every 200ms)
      interval = setInterval(() => {
        capture();
      }, 200);

      // Stop after 5 seconds
      setTimeout(() => {
        clearInterval(interval);
        setCapturing(false);
      }, 5000);
    } else if (!isCapturing && capturing) {
        // If stopped externally
        setCapturing(false);
    }
    
    return () => clearInterval(interval);
  }, [isCapturing, capture, capturing]);

  React.useEffect(() => {
      if (!capturing && capturedImages.length > 0 && isCapturing) {
          // Finished capturing batch
          onCapture(capturedImages);
      }
  }, [capturing, capturedImages, onCapture, isCapturing]);


  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative rounded-lg overflow-hidden border-2 border-primary">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
          videoConstraints={{ facingMode: "user" }}
        />
        {capturing && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded animate-pulse">
                Recording... {capturedImages.length}
            </div>
        )}
      </div>
    </div>
  );
}
