"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";

interface WebcamCaptureProps {
  onCapture: (images: string[]) => void;
  isCapturing: boolean;
}

export function WebcamCapture({ onCapture, isCapturing }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const capturedImagesRef = useRef<string[]>([]); // Ref to hold latest captured images

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prev) => {
        const newImages = [...prev, imageSrc];
        capturedImagesRef.current = newImages; // Update ref with latest images
        console.log(`Captured image ${newImages.length}`);
        return newImages;
      });
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    let timeout: NodeJS.Timeout | undefined;

    if (isCapturing) {
      console.log("Starting capture...");
      setCapturedImages([]); // Reset images when capture starts
      capturedImagesRef.current = []; // Reset ref as well

      interval = setInterval(captureImage, 200); // Capture 5 images per second

      timeout = setTimeout(() => {
        clearInterval(interval);
        console.log(`Capture complete. Total images: ${capturedImagesRef.current.length}`);
        if (capturedImagesRef.current.length > 0) {
          onCapture(capturedImagesRef.current);
        } else {
          console.warn("No images captured within 5 seconds.");
          onCapture([]);
        }
      }, 5000); // Stop after 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [isCapturing, captureImage, onCapture]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-sm font-bold text-green-600">DEBUG: Webcam Component Rendered</p>
      <div 
        className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
        style={{ 
          border: '4px solid red',
          minHeight: '400px'
        }}
      >
        <p className="absolute top-2 left-2 z-50 text-xs bg-yellow-300 text-black p-1 rounded">
          Webcam Container
        </p>
        
        {/* Webcam - always rendered, similar to attendance page */}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }}
          className="w-full h-full object-cover"
          style={{
            display: 'block',
            width: '100%',
            height: '100%'
          }}
        />

        {/* Display capture indicator and count */}
        {isCapturing && (
          <div className="absolute top-4 right-4 z-20 px-3 py-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground shadow-lg animate-pulse">
            📸 {capturedImages.length > 0 ? `Captured: ${capturedImages.length}` : 'Recording...'}
          </div>
        )}
      </div>
    </div>
  );
}