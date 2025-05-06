
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Camera, RefreshCcw } from "lucide-react";
import { classifyWaste, initializeModel } from "@/utils/wasteClassifier";
import { useUserStore } from "@/stores/userStore";
import Confetti from "@/components/Confetti";

const CameraPage = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [resultItem, setResultItem] = useState<null | {
    category: string;
    confidence: number;
    reward: number;
  }>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addCoins, incrementTotalScanned } = useUserStore();
  
  // Load TensorFlow model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const isLoaded = await initializeModel();
        if (isLoaded) {
          setModelLoaded(true);
          toast("Model loaded", {
            description: "Waste detection model is ready!",
          });
        }
      } catch (err) {
        console.error("Error loading model:", err);
        toast("Model Error", {
          description: "Could not load the waste detection model.",
        });
      }
    };
    
    loadModel();
    
    // Clean up on unmount
    return () => {
      stopCamera();
    };
  }, []);
  
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .catch(err => console.error("Error playing video:", err));
          }
        };
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
    if (!videoRef.current || !canvasRef.current || !modelLoaded) return;
    
    setProcessing(true);
    
    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    
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
    
    // Process the image with TensorFlow Lite
    processWasteImage();
  };

  const processWasteImage = async () => {
    try {
      // Get the image data from canvas for TensorFlow processing
      const imageData = canvasRef.current?.toDataURL('image/jpeg');
      
      // In a real implementation, we would pass the image data to the TensorFlow model
      // For now, we're using our mock classifier
      const result = await classifyWaste();
      
      if (result) {
        setResultItem(result);
        
        // Provide feedback based on confidence level
        if (result.confidence > 0.85) {
          // Excellent detection
          addCoins(result.reward + 2);
          incrementTotalScanned(result.categoryId);
          setShowConfetti(true);
          
          toast(`Amazing! +${result.reward + 2} coins`, {
            description: `Perfect! That's definitely ${result.category} waste!`,
          });
        } else if (result.confidence > 0.7) {
          // Good detection
          addCoins(result.reward);
          incrementTotalScanned(result.categoryId);
          setShowConfetti(true);
          
          toast(`Great job! +${result.reward} coins`, {
            description: `You correctly identified ${result.category} waste!`,
          });
        } else if (result.confidence > 0.5) {
          // Uncertain detection
          addCoins(Math.floor(result.reward / 2));
          
          toast("Good try!", {
            description: `I think this might be ${result.category} waste, but I'm not entirely sure.`,
          });
        } else {
          // Poor detection
          toast("Try again", {
            description: "I couldn't identify that clearly. Try a different angle or better lighting.",
          });
        }
        
        setTimeout(() => setShowConfetti(false), 3000);
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
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <Camera size={48} className="text-eco-green mb-4" />
              <p className="text-center text-gray-600">
                {modelLoaded ? 
                  "Tap the button below to activate the camera and scan waste items" :
                  "Loading waste detection model..."}
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
              disabled={!modelLoaded}
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
