
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Camera, RefreshCcw } from "lucide-react";
import { classifyWaste, initializeModel, isModelLoaded, getModelInfo } from "@/utils/wasteClassifier";
import { useUserStore } from "@/stores/userStore";
import Confetti from "@/components/Confetti";
import { Progress } from "@/components/ui/progress";

const CameraPage = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);
  const [resultItem, setResultItem] = useState<null | {
    category: string;
    confidence: number;
    reward: number;
  }>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addCoins, incrementTotalScanned } = useUserStore();
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Load TensorFlow model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Start progress animation
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 5;
          if (progress > 95) clearInterval(progressInterval);
          setModelLoadingProgress(progress);
        }, 100);
        
        // Actually load the model
        const isLoaded = await initializeModel();
        
        // Clear interval and set final state
        clearInterval(progressInterval);
        setModelLoadingProgress(100);
        
        if (isLoaded) {
          setModelLoaded(true);
          toast("Model loaded", {
            description: "Waste detection model is ready!",
          });
        } else {
          toast("Model not found", {
            description: "Using demo mode with random results.",
          });
          // Still allow usage in demo mode
          setModelLoaded(true);
        }
      } catch (err) {
        console.error("Error loading model:", err);
        setModelLoadingProgress(100);
        toast("Model Error", {
          description: "Could not load the waste detection model. Using demo mode.",
        });
        // Still allow usage in demo mode
        setModelLoaded(true);
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
    if (!videoRef.current || !canvasRef.current || !modelLoaded) return;
    
    try {
      setProcessing(true);
      
      const context = canvasRef.current.getContext("2d");
      if (!context) {
        toast("Processing Error", {
          description: "Could not access canvas context.",
        });
        setProcessing(false);
        return;
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
      
      // Process the image with TensorFlow
      processWasteImage();
    } catch (error) {
      console.error("Error capturing image:", error);
      toast("Capture Error", {
        description: "Failed to capture image from camera feed.",
      });
      setProcessing(false);
    }
  };

  const processWasteImage = async () => {
    try {
      if (!canvasRef.current) {
        setProcessing(false);
        return;
      }
      
      // Get the image data from canvas for TensorFlow processing
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      
      console.log("Processing captured image...");
      // We pass the image data to our classifier
      const result = await classifyWaste(imageData);
      
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
          incrementTotalScanned(result.categoryId);
          
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
            <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-100">
              <Camera size={48} className="text-eco-green mb-4" />
              {modelLoadingProgress < 100 ? (
                <>
                  <p className="text-center text-gray-600 mb-4">
                    Loading waste detection model...
                  </p>
                  <Progress value={modelLoadingProgress} className="w-3/4 h-2" />
                </>
              ) : cameraError ? (
                <>
                  <p className="text-center text-red-600 mb-2">Camera Error:</p>
                  <p className="text-center text-gray-600">{cameraError}</p>
                </>
              ) : (
                <p className="text-center text-gray-600">
                  Tap the button below to activate the camera and scan waste items
                </p>
              )}
            </div>
          )}
          
          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          {resultItem && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4">
              <h3 className="text-lg font-bold flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                {resultItem.category} Waste
              </h3>
              <div className="mt-1">
                <Progress value={Math.round(resultItem.confidence * 100)} className="h-2" />
              </div>
              <div className="flex justify-between items-center mt-1">
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
              disabled={modelLoadingProgress < 100}
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
