
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import Confetti from "@/components/Confetti";
import CameraView from "@/components/camera/CameraView";
import CameraControls from "@/components/camera/CameraControls";
import { useCamera } from "@/hooks/useCamera";
import { useWasteModel } from "@/hooks/useWasteModel";

const CameraPage = () => {
  const { 
    cameraActive, 
    processing, 
    cameraError, 
    videoRef, 
    canvasRef, 
    startCamera, 
    stopCamera, 
    captureImage,
    setProcessing
  } = useCamera();

  const {
    modelLoadingProgress,
    resultItem,
    showConfetti,
    processWasteImage
  } = useWasteModel();

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setProcessing(true);
    
    const canvas = captureImage();
    if (!canvas) {
      setProcessing(false);
      return;
    }
    
    // Process the image with TensorFlow
    const imageData = canvas.toDataURL('image/jpeg');
    await processWasteImage(imageData);
    
    setProcessing(false);
  };

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold text-center mb-6">Waste Scanner</h1>
        
        <CameraView 
          cameraActive={cameraActive}
          cameraError={cameraError}
          videoRef={videoRef}
          canvasRef={canvasRef}
          modelLoadingProgress={modelLoadingProgress}
          resultItem={resultItem}
        />

        <CameraControls 
          cameraActive={cameraActive}
          processing={processing}
          modelReady={modelLoadingProgress === 100}
          onStartCamera={startCamera}
          onStopCamera={stopCamera}
          onCapture={handleCapture}
        />
      </div>
    </>
  );
};

export default CameraPage;
