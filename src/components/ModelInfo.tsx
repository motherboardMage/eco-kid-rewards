
import { useEffect, useState } from 'react';
import { getModelInfo, isModelLoaded } from '@/utils/wasteClassifier';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface ModelInfoProps {
  showDetails?: boolean;
}

const ModelInfo = ({ showDetails = false }: ModelInfoProps) => {
  const [modelState, setModelState] = useState({
    loaded: false,
    name: 'None'
  });

  useEffect(() => {
    // Get initial model state
    setModelState(getModelInfo());
    
    // Check model status every second
    const intervalId = setInterval(() => {
      setModelState(getModelInfo());
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (!showDetails) {
    return (
      <div className="flex items-center">
        <div 
          className={`w-2 h-2 rounded-full mr-2 ${
            modelState.loaded ? 'bg-green-500' : 'bg-amber-500'
          }`}
        />
        <span className="text-xs">
          {modelState.loaded ? 'Model Ready' : 'Demo Mode'}
        </span>
      </div>
    );
  }

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm">
      <h3 className="text-sm font-semibold flex items-center mb-1">
        <Trophy size={16} className="text-eco-orange mr-1" />
        Model Status
      </h3>
      <div className="text-xs space-y-1">
        <div className="flex items-center">
          <div 
            className={`w-2 h-2 rounded-full mr-2 ${
              modelState.loaded ? 'bg-green-500' : 'bg-amber-500'
            }`}
          />
          <span>{modelState.loaded ? 'Model Ready' : 'Using Demo Mode'}</span>
        </div>
        {modelState.loaded && (
          <div>
            <span className="opacity-70">Model: </span>
            <span>{modelState.name}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ModelInfo;
