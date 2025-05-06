import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Camera, RefreshCcw } from "lucide-react";
import { classifyWaste } from "@/utils/wasteClassifier";
import { useUserStore } from "@/stores/userStore";
import Confetti from "@/components/Confetti";

const CameraPage = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultItem, setResultItem] = useState<null | {
    category: string;
    confidence: number;
    reward: number;
  }>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addCoins } = useUserStore();
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast("Camera Error", {
        description: "Could not access camera. Please check permissions.",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setProcessing(true);
    
    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(
      videoRef.current,
      0, 0,
      videoRef.current.videoWidth,
      videoRef.current.videoHeight
    );
    
    // In a real app, we would send this image to TensorFlow Lite for processing
    // For now, we'll use our mock classifier
    setTimeout(() => {
      processWasteImage();
    }, 1500);
  };

  const processWasteImage = async () => {
    try {
      // In a real app, we'd use the canvas image with TensorFlow
      // const imageData = canvasRef.current?.toDataURL('image/jpeg');
      
      // Using our mock classifier for demo purposes
      const result = await classifyWaste();
      
      if (result) {
        setResultItem(result);
        if (result.confidence > 0.7) {
          addCoins(result.reward);
          setShowConfetti(true);
          toast(`Great job! +${result.reward} coins`, {
            description: `You correctly identified ${result.category} waste!`,
          });
          
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          toast("Not quite sure", {
            description: `I think this might be ${result.category} waste, but I'm not certain.`,
          });
        }
      }
      
      setProcessing(false);
    } catch (error) {
      console.error("Error processing waste image:", error);
      toast("Processing Error", {
        description: "There was a problem analyzing the image.",
      });
      setProcessing(false);
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold text-center mb-6">Waste Scanner</h1>
        
        <div className="relative bg-white rounded-2xl shadow-md overflow-hidden mb-6 aspect-[3/4]">
          {cameraActive ? (
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <Camera size={48} className="text-eco-green mb-4" />
              <p className="text-center text-gray-600">
                Tap the button below to activate the camera and scan waste items
              </p>
            </div>
          )}
          
          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          {resultItem && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4">
              <h3 className="text-lg font-bold">
                {resultItem.category} Waste
              </h3>
              <div className="flex justify-between items-center">
                <span>Confidence: {Math.round(resultItem.confidence * 100)}%</span>
                <span className="text-eco-orange font-bold">+{resultItem.reward} coins</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {!cameraActive ? (
            <Button 
              className="button-primary flex-1"
              onClick={startCamera}
            >
              <Camera size={20} className="mr-2" /> Start Camera
            </Button>
          ) : (
            <>
              <Button
                className="button-secondary flex-1"
                variant="outline" 
                onClick={stopCamera}
                disabled={processing}
              >
                Stop
              </Button>
              <Button 
                className="button-primary flex-1"
                onClick={captureImage}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <RefreshCcw size={20} className="mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Capture & Analyze"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CameraPage;
