import { FaceMesh } from "@mediapipe/face_mesh";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createCamera(video: HTMLVideoElement, faceMesh: FaceMesh) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Camera = require("@mediapipe/camera_utils").default;
  return new Camera(video, {
    onFrame: async () => {
      await faceMesh.send({ image: video });
    },
    width: 640,
    height: 480,
  });
}
