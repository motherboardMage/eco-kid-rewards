
import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

interface UseCameraReturn {
  cameraActive: boolean;
  processing: boolean;
  cameraError: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  stream: MediaStream | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => HTMLCanvasElement | null;
}

export const useCamera = (): UseCameraReturn => {
  const [cameraActive, setCameraActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      if (cameraActive && stream) {
        return; // Camera is already active
      }
      
      setCameraError(null);
      
      const constraints = {
        video: {
          facingMode: "environment", 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Make sure we handle the loadedmetadata event properly
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            console.log("Video metadata loaded, playing video");
            videoRef.current.play()
              .then(() => {
                console.log("Camera feed started successfully");
                setCameraActive(true);
              })
              .catch(playErr => {
                console.error("Error playing video:", playErr);
                toast("Camera Error", {
                  description: "Could not start video playback.",
                });
              });
          }
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown camera error";
      setCameraError(errorMessage);
      
      toast("Camera Error", {
        description: "Could not access camera. Please check permissions.",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    try {
      setProcessing(true);
      
      const context = canvasRef.current.getContext("2d");
      if (!context) {
        toast("Processing Error", {
          description: "Could not access canvas context.",
        });
        setProcessing(false);
        return null;
      }
      
      // Set canvas dimensions to match the video frame
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      
      // Draw the current video frame to the canvas
      context.drawImage(
        videoRef.current,
        0, 0,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      );
      
      return canvasRef.current;
    } catch (error) {
      console.error("Error capturing image:", error);
      toast("Capture Error", {
        description: "Failed to capture image from camera feed.",
      });
      setProcessing(false);
      return null;
    }
  };

  return {
    cameraActive,
    processing,
    cameraError,
    videoRef,
    canvasRef,
    stream,
    startCamera,
    stopCamera,
    captureImage,
    setProcessing: (value: boolean) => setProcessing(value)
  };
};
