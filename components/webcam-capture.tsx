"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { Loader2, VideoOff } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (images: string[]) => void;
  isCapturing: boolean;
}

export function WebcamCapture({ onCapture, isCapturing }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [webcamReady, setWebcamReady] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const capturedImagesRef = useRef<string[]>([]); // Ref to hold latest captured images

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prev) => {
        const newImages = [...prev, imageSrc];
        capturedImagesRef.current = newImages; // Update ref with latest images
        return newImages;
      });
    }
  }, [webcamRef]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    let timeout: NodeJS.Timeout | undefined;

    if (isCapturing) {
      setCapturedImages([]); // Reset images when capture starts
      capturedImagesRef.current = []; // Reset ref as well

      interval = setInterval(captureImage, 200); // Capture 5 images per second

      timeout = setTimeout(() => {
        clearInterval(interval);
        if (capturedImagesRef.current.length > 0) { // Use ref for the latest state
          onCapture(capturedImagesRef.current);
        } else {
          console.warn("No images captured within 5 seconds.");
          // Optionally call onCapture with empty array or handle no-image scenario
          onCapture([]);
        }
      }, 5000); // Stop after 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [isCapturing, captureImage, onCapture]); // capturedImages is no longer a dependency here

  const handleUserMedia = () => setWebcamReady(true);
  const handleUserMediaError = (err: string | DOMException) => {
    console.error("Webcam error:", err);
    setWebcamReady(false);
    setWebcamError(typeof err === "string" ? err : err.message);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-border flex items-center justify-center bg-muted">
        {!webcamReady && !webcamError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            Loading webcam...
          </div>
        )}

        {webcamError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-destructive bg-muted/50 p-4 text-center">
            <VideoOff className="w-8 h-8 mb-2" />
            <p className="font-semibold">Webcam Error</p>
            <p className="text-sm">{webcamError}</p>
          </div>
        )}

        {/* This is the Webcam component itself */}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          height={720}
          videoConstraints={{ facingMode: "user", width: 1280, height: 720 }}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          className={`absolute inset-0 w-full h-full object-cover ${webcamReady ? '' : 'hidden'}`}
        />

        {/* Display image count only when actively capturing and webcam is ready */}
        {isCapturing && webcamReady && (
          <div className="absolute top-4 right-4 z-20 px-2 py-1 text-sm rounded bg-primary text-primary-foreground animate-pulse">
            Recording... {capturedImages.length}
          </div>
        )}
      </div>
    </div>
  );
}