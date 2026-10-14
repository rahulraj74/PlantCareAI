"""
PlantCare AI - Model Evaluation Pipeline
Evaluates the trained MobileNetV2 model on unseen test split and calculates
test accuracy, per-class precision, recall, F1-score, and confusion matrix.
"""

import os
import json
import argparse
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

def evaluate_test_set(model_path: str, test_dir: str, artifacts_dir: str):
    print(f"Loading trained model from {model_path}...")
    model = tf.keras.models.load_model(model_path)

    print(f"Loading test dataset from {test_dir}...")
    test_ds = tf.keras.utils.image_dataset_from_directory(
        test_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=False
    )

    class_names = test_ds.class_names
    print(f"Evaluating {len(class_names)} classes on test split...")

    # Collect ground truth and model predictions
    y_true = []
    y_pred_probs = []

    for images, labels in test_ds:
        preds = model.predict(images, verbose=0)
        y_true.extend(np.argmax(labels.numpy(), axis=1))
        y_pred_probs.extend(preds)

    y_true = np.array(y_true)
    y_pred = np.argmax(np.array(y_pred_probs), axis=1)

    # 1. Overall Accuracy
    accuracy = float(np.mean(y_true == y_pred))

    # 2. Precision, Recall, F1
    precision, recall, f1, support = precision_recall_fscore_support(
        y_true, y_pred, average=None, labels=range(len(class_names))
    )

    # 3. Classification Report
    report_dict = classification_report(
        y_true, y_pred, target_names=class_names, output_dict=True
    )

    # 4. Confusion Matrix
    cm = confusion_matrix(y_true, y_pred).tolist()

    evaluation_results = {
        "overall_accuracy": round(accuracy, 4),
        "total_test_samples": len(y_true),
        "per_class_metrics": {
            class_names[i]: {
                "precision": round(float(precision[i]), 4),
                "recall": round(float(recall[i]), 4),
                "f1_score": round(float(f1[i]), 4),
                "support": int(support[i])
            }
            for i in range(len(class_names))
        },
        "classification_report": report_dict,
        "confusion_matrix": cm
    }

    metrics_save_path = os.path.join(artifacts_dir, "evaluation_metrics.json")
    with open(metrics_save_path, "w", encoding="utf-8") as f:
        json.dump(evaluation_results, f, indent=2)

    print("\n================== EVALUATION REPORT ==================")
    print(f"Overall Test Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_true, y_pred, target_names=class_names))
    print(f"Saved evaluation metrics to: {metrics_save_path}")
    print("=======================================================\n")

    return evaluation_results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate trained MobileNetV2 on test split.")
    parser.add_argument("--model", type=str, default="../artifacts/plantcare_mobilenetv2_model.keras", help="Path to saved model")
    parser.add_argument("--test_dir", type=str, default="../data/processed/test", help="Path to test dataset")
    parser.add_argument("--artifacts_dir", type=str, default="../artifacts", help="Directory to save evaluation report")
    args = parser.parse_args()

    evaluate_test_set(args.model, args.test_dir, args.artifacts_dir)
