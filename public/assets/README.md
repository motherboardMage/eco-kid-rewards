
# Model Assets Directory

Place your TensorFlow Lite model files in this directory.

## Expected Files
- `waste_classifier.tflite` - The main TFLite model file for waste classification
- `labels.json` - Optional labels mapping file if needed

## Model Requirements
- Input: 224x224 RGB image (3 channels)
- Output: Class probabilities matching waste categories in the app
