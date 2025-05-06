
import { Button } from "@/components/ui/button";
import { Camera, RefreshCcw } from "lucide-react";

interface CameraControlsProps {
  cameraActive: boolean;
  processing: boolean;
  modelReady: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCapture: () => void;
}

const CameraControls = ({
  cameraActive,
  processing,
  modelReady,
  onStartCamera,
  onStopCamera,
  onCapture
}: CameraControlsProps) => {
  return (
    <div className="flex gap-4">
      {!cameraActive ? (
        <Button 
          className="button-primary flex-1"
          onClick={onStartCamera}
          disabled={!modelReady}
        >
          <Camera size={20} className="mr-2" /> Start Camera
        </Button>
      ) : (
        <>
          <Button
            className="button-secondary flex-1"
            variant="outline" 
            onClick={onStopCamera}
            disabled={processing}
          >
            Stop
          </Button>
          <Button 
            className="button-primary flex-1"
            onClick={onCapture}
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
  );
};

export default CameraControls;
