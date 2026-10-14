"""
PlantCare AI - Standalone Leaf Inference CLI
Runs prediction on single leaf image using MobileNetV2 and reports
confidence, threshold reliability, and top-3 differential candidates.
"""

import os
import json
import argparse
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

IMG_SIZE = (224, 224)

def run_single_prediction(image_path: str, model_path: str, mapping_path: str, threshold: float = 0.60):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at {image_path}")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at {model_path}")
    if not os.path.exists(mapping_path):
        raise FileNotFoundError(f"Class mapping not found at {mapping_path}")

    with open(mapping_path, "r", encoding="utf-8") as f:
        class_mapping = {int(k): v for k, v in json.load(f).items()}

    model = tf.keras.models.load_model(model_path)

    # Preprocessing
    img = Image.open(image_path).convert("RGB")
    img = img.resize(IMG_SIZE, Image.Resampling.BILINEAR)
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    preprocessed = preprocess_input(img_array)

    # Inference
    preds = model.predict(preprocessed, verbose=0)[0]
    top_idx = int(np.argmax(preds))
    confidence = float(preds[top_idx])
    class_id = class_mapping.get(top_idx, "Unknown")
    is_reliable = confidence >= threshold

    # Sort alternatives
    sorted_indices = np.argsort(preds)[::-1]
    alternatives = []
    for idx in sorted_indices[1:4]:
        alternatives.append({
            "class": class_mapping.get(int(idx)),
            "confidence": round(float(preds[idx]), 4)
        })

    print("\n========= PLANTCARE AI PREDICTION =========")
    print(f"Target Image:        {image_path}")
    print(f"Predicted Class:     {class_id}")
    print(f"Softmax Confidence:  {confidence * 100:.2f}%")
    print(f"Reliability Status:  {'RELIABLE' if is_reliable else 'UNCERTAIN (< ' + str(int(threshold*100)) + '%)'}")
    print("\nTop Differential Candidates:")
    for alt in alternatives:
        print(f" - {alt['class']}: {alt['confidence'] * 100:.2f}%")
    print("===========================================\n")

    return {
        "class_id": class_id,
        "confidence": confidence,
        "is_reliable": is_reliable,
        "alternatives": alternatives
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run MobileNetV2 leaf disease classification.")
    parser.add_argument("--image", type=str, required=True, help="Path to leaf image file")
    parser.add_argument("--model", type=str, default="../artifacts/plantcare_mobilenetv2_model.keras", help="Path to trained model")
    parser.add_argument("--mapping", type=str, default="../artifacts/class_indices.json", help="Path to class mapping")
    parser.add_argument("--threshold", type=float, default=0.60, help="Reliability confidence threshold")
    args = parser.parse_args()

    run_single_prediction(args.image, args.model, args.mapping, args.threshold)
