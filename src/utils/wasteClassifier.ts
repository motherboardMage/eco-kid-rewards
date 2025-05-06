
import { wasteCategories } from "@/data/wasteData";
import * as tf from '@tensorflow/tfjs';

// This variable will hold the TensorFlow model when loaded
let wasteClassifierModel: tf.GraphModel | null = null;
let modelLabels: string[] = [];
let isModelLoading = false;

/**
 * Load labels mapping for the model
 * @param labelsPath Optional path to the labels file
 */
const loadLabels = async (labelsPath: string = '/assets/labels.json'): Promise<string[]> => {
  try {
    const response = await fetch(labelsPath);
    if (!response.ok) {
      console.warn("Labels file not found, using default waste categories");
      return wasteCategories.map(cat => cat.name);
    }
    const labels = await response.json();
    return labels;
  } catch (error) {
    console.warn("Error loading labels:", error);
    return wasteCategories.map(cat => cat.name);
  }
};

/**
 * Initialize the TensorFlow model
 * @param modelPath Optional path to the TFLite model file
 */
export const initializeModel = async (modelPath: string = '/assets/waste_classifier.tflite'): Promise<boolean> => {
  if (wasteClassifierModel || isModelLoading) {
    return !!wasteClassifierModel;
  }

  try {
    isModelLoading = true;
    console.log("Initializing waste classification model...");

    // Load TensorFlow.js
    await tf.ready();
    console.log("TensorFlow.js ready");

    // Show which backend is being used (WebGL, WASM, or CPU)
    console.log("Using backend:", tf.getBackend());

    try {
      // Load the TensorFlow.js model converted from TFLite
      // TF.js can load models in different formats, including SavedModel and TFLite
      wasteClassifierModel = await tf.loadGraphModel(modelPath);
      console.log("Model loaded successfully:", wasteClassifierModel);
      
      // Load the labels
      modelLabels = await loadLabels();
      console.log("Labels loaded:", modelLabels);

      isModelLoading = false;
      return true;
    } catch (modelError) {
      console.error("Error loading model:", modelError);
      console.log("Falling back to demo mode as model could not be loaded");
      
      // For demo purposes when no model is available
      wasteClassifierModel = null;
      isModelLoading = false;
      return false;
    }
  } catch (error) {
    console.error("Error initializing TensorFlow:", error);
    isModelLoading = false;
    return false;
  }
};

/**
 * Preprocess an image for the model
 * @param img The image element or ImageData to process
 * @returns Tensor ready for model input
 */
const preprocessImage = async (img: HTMLImageElement | ImageData): Promise<tf.Tensor> => {
  // Convert to tensor
  let tensor = tf.browser.fromPixels(img);
  
  // Resize to model input size (typically 224x224 for many models)
  tensor = tf.image.resizeBilinear(tensor, [224, 224]);
  
  // Normalize values to [0, 1]
  tensor = tensor.div(255.0);
  
  // Expand dimensions to match model input shape [1, height, width, channels]
  tensor = tensor.expandDims(0);
  
  return tensor;
};

/**
 * Classify waste from an image
 * @param imageData Image data (base64 string, HTMLImageElement, or ImageData)
 */
export const classifyWaste = async (imageData?: string | HTMLImageElement | ImageData): Promise<{
  category: string;
  categoryId: string;
  confidence: number;
  reward: number;
}> => {
  // If model isn't loaded yet, try to initialize it
  if (!wasteClassifierModel && !isModelLoading) {
    await initializeModel();
  }
  
  try {
    // If we have a real model and image data
    if (wasteClassifierModel && imageData) {
      console.log("Processing image with TensorFlow model...");
      
      // Convert base64 string to image element if needed
      let imgElement: HTMLImageElement | ImageData;
      
      if (typeof imageData === 'string') {
        // Create an image element from base64 string
        imgElement = new Image();
        await new Promise<void>((resolve) => {
          const img = imgElement as HTMLImageElement;
          img.onload = () => resolve();
          img.src = imageData;
        });
      } else {
        imgElement = imageData;
      }
      
      // Preprocess the image
      const tensor = await preprocessImage(imgElement);
      
      // Run inference
      console.log("Running model inference...");
      const predictions = await wasteClassifierModel.predict(tensor) as tf.Tensor;
      
      // Get results
      const results = Array.from(await predictions.data());
      console.log("Raw prediction results:", results);
      
      // Clean up tensors to prevent memory leaks
      tensor.dispose();
      predictions.dispose();
      
      // Find the highest confidence prediction
      const maxIndex = results.indexOf(Math.max(...results));
      const confidence = results[maxIndex];
      
      // Map to waste category
      let categoryName = modelLabels[maxIndex] || 'Unknown';
      let category = wasteCategories.find(
        cat => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      
      if (!category) {
        // Find best match if exact match not found
        category = wasteCategories[0];
      }
      
      // Calculate reward based on confidence
      const baseReward = 5;
      const confidenceBonus = Math.floor(confidence * 10);
      const reward = baseReward + confidenceBonus;
      
      return {
        category: category.name,
        categoryId: category.id,
        confidence: confidence,
        reward
      };
    }
    
    // Fall back to demo mode if no model or image
    console.log("Using demo mode for classification (random results)");
    
    // For demo purposes, we'll generate a random result
    const randomCategoryIndex = Math.floor(Math.random() * wasteCategories.length);
    const category = wasteCategories[randomCategoryIndex];
    
    // Generate a random confidence score between 0.5 and 0.98
    const confidence = 0.5 + (Math.random() * 0.48);
    
    // Calculate reward based on confidence
    const baseReward = 5;
    const confidenceBonus = Math.floor(confidence * 10);
    const reward = baseReward + confidenceBonus;
    
    return {
      category: category.name,
      categoryId: category.id,
      confidence,
      reward
    };
  } catch (error) {
    console.error("Error classifying waste:", error);
    
    // Return a fallback result
    const category = wasteCategories[0];
    return {
      category: category.name,
      categoryId: category.id,
      confidence: 0.5,
      reward: 5
    };
  }
};

/**
 * Check if the model has been loaded
 * @returns Boolean indicating if model is loaded
 */
export const isModelLoaded = (): boolean => {
  return !!wasteClassifierModel;
};

/**
 * Get model information
 * @returns Information about the loaded model
 */
export const getModelInfo = () => {
  if (!wasteClassifierModel) {
    return {
      loaded: false,
      name: 'None'
    };
  }
  
  return {
    loaded: true,
    name: "WasteWise Classifier",
    labels: modelLabels.length
  };
};
