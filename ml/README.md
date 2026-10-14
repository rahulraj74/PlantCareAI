# PlantCare AI - Machine Learning Pipeline

This module implements a transfer learning pipeline using **MobileNetV2** for classifying tomato leaf diseases from the public **PlantVillage** dataset.

## Supported Classes (PlantVillage Tomato Subset)
The model currently supports 10 distinct classes:
1. `Tomato___Bacterial_spot`
2. `Tomato___Early_blight`
3. `Tomato___Late_blight`
4. `Tomato___Leaf_Mold`
5. `Tomato___Septoria_leaf_spot`
6. `Tomato___Spider_mites Two-spotted_spider_mite`
7. `Tomato___Target_Spot`
8. `Tomato___Tomato_Yellow_Leaf_Curl_Virus`
9. `Tomato___Tomato_mosaic_virus`
10. `Tomato___healthy`

## Model Architecture
- **Base Model**: MobileNetV2 pretrained on ImageNet (weights frozen initially for transfer learning).
- **Pre-processing**: Native MobileNetV2 normalization (`[-1, 1]`) and bilinear resize to $224 \times 224 \times 3$.
- **Augmentation (Training only)**: Random flip (horizontal/vertical), small random rotations ($\pm 15^\circ$), zoom ($\pm 10\%$), contrast jitter.
- **Top Classifier Head**:
  - GlobalAveragePooling2D
  - BatchNormalization
  - Dense(256, activation='relu') + Dropout(0.35)
  - Dense(10, activation='softmax')

## Pipeline Workflow
1. `prepare_data.py`: Downloads or verifies the PlantVillage tomato dataset, creates stratified Train (70%), Validation (15%), and Test (15%) splits, preventing data leakage.
2. `train.py`: Trains the top classification head, monitors validation categorical accuracy and loss with EarlyStopping and ReduceLROnPlateau. Saves best weights to `artifacts/plantcare_mobilenetv2_model.keras`.
3. `evaluate.py`: Generates the final test evaluation:
   - Overall Accuracy
   - Per-class Precision, Recall, and F1-Score
   - Confusion Matrix (saved as PNG)
   - Classification Report (saved to `artifacts/evaluation_metrics.json`)
4. `predict.py`: Handles single-image and batch inference, applying the exact preprocessing and returning predicted class, probability distribution, and reliability assessment.
