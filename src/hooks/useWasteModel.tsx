
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { classifyWaste, initializeModel, isModelLoaded } from "@/utils/wasteClassifier";
import { useUserStore } from "@/stores/userStore";

interface WasteResult {
  category: string;
  categoryId: string;
  confidence: number;
  reward: number;
}

export const useWasteModel = () => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);
  const [resultItem, setResultItem] = useState<null | {
    category: string;
    confidence: number;
    reward: number;
    categoryId: string;
  }>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { addCoins, incrementTotalScanned } = useUserStore();

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
  }, []);

  const processWasteImage = async (imageData: string) => {
    try {
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
      
      return result;
    } catch (error) {
      console.error("Error processing waste image:", error);
      toast("Processing Error", {
        description: "There was a problem analyzing the image.",
      });
      return null;
    }
  };

  return {
    modelLoaded,
    modelLoadingProgress,
    resultItem,
    showConfetti,
    setResultItem,
    setShowConfetti,
    processWasteImage
  };
};
