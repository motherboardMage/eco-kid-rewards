import React from "react";
import { Camera } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CameraViewProps {
  cameraActive: boolean;
  cameraError: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  modelLoadingProgress: number;
  resultItem: {
    category: string;
    confidence: number;
    reward: number;
  } | null;
}

const CameraView = ({
  cameraActive,
  cameraError,
  videoRef,
  canvasRef,
  modelLoadingProgress,
  resultItem
}: CameraViewProps) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden mb-6 aspect-[3/4] flex items-stretch">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${cameraActive ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{
          background: "#000"
        }}
      />
      {!cameraActive && (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-100 w-full">
          <Camera size={48} className="text-eco-green mb-4" />
          <p className="text-center text-gray-600 mb-4">
            {modelLoadingProgress < 100 ? (
              <>Loading waste detection model...</>
            ) : cameraError ? (
              <>
                Camera Error:{" "}
                <span className="text-red-600">{cameraError}</span>
              </>
            ) : (
              <>Tap the button below to activate the camera and scan waste items</>
            )}
          </p>
          <Progress value={modelLoadingProgress} className="w-3/4 h-2" />
        </div>
      )}

      {resultItem && <ResultOverlay resultItem={resultItem} />}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

interface ResultOverlayProps {
  resultItem: {
    category: string;
    confidence: number;
    reward: number;
  };
}

const ResultOverlay: React.FC<ResultOverlayProps> = ({ resultItem }) => (
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
      <span className="text-eco-orange font-bold">
        +{resultItem.reward} coins
      </span>
    </div>
  </div>
);

export default CameraView;
