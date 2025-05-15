import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as tf from '@tensorflow/tfjs';

const modelPath = '/assets/model.json';

async function loadModel() {
  try {
    const model = await tf.loadGraphModel(modelPath);
    console.log('Model loaded successfully!');
    return model;
  } catch (error) {
    console.error('Error loading the model:', error);
  }
}

async function predict(imageElement: HTMLImageElement) {
  const model = await loadModel();
  if (!model) return;

  // Preprocess the image
  const tensor = tf.browser.fromPixels(imageElement)
    .resizeNearestNeighbor([224, 224]) // Resize to 224x224
    .toFloat()
    .expandDims(); // Add batch dimension

  // Make predictions
  const predictions = await model.predict(tensor) as tf.Tensor;
  predictions.print(); // Log predictions
}

// Example usage: Pass an image element to the predict function
// const imageElement = document.getElementById('your-image-id') as HTMLImageElement;
// predict(imageElement);

createRoot(document.getElementById("root")!).render(<App />);
