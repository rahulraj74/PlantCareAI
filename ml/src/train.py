"""
PlantCare AI - Model Training Pipeline
Trains a MobileNetV2 transfer learning model on tomato leaf diseases.
"""

import os
import json
import argparse
import tensorflow as tf
from tensorflow.keras import layers, models, callbacks
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

def build_transfer_model(num_classes: int) -> tf.keras.Model:
    """
    Builds MobileNetV2 architecture with frozen base and custom classification head.
    """
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights="imagenet"
    )
    base_model.trainable = False

    # Data augmentation layers for training
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.15),
        layers.RandomZoom(0.1),
        layers.RandomContrast(0.1),
    ], name="augmentation")

    inputs = tf.keras.Input(shape=(224, 224, 3))
    x = data_augmentation(inputs)
    # Apply official MobileNetV2 preprocessing: [-1, 1]
    x = preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.35)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = models.Model(inputs, outputs, name="PlantCare_MobileNetV2")
    return model

def train_model(data_dir: str, artifacts_dir: str, epochs: int = 15):
    os.makedirs(artifacts_dir, exist_ok=True)
    train_dir = os.path.join(data_dir, "train")
    val_dir = os.path.join(data_dir, "val")

    print(f"Loading datasets from {data_dir}...")
    train_ds = tf.keras.utils.image_dataset_from_directory(
        train_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=True,
        seed=42
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        val_dir,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        label_mode="categorical",
        shuffle=False
    )

    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"Detected {num_classes} classes: {class_names}")

    # Save exact class mapping
    class_mapping = {i: name for i, name in enumerate(class_names)}
    mapping_path = os.path.join(artifacts_dir, "class_indices.json")
    with open(mapping_path, "w", encoding="utf-8") as f:
        json.dump(class_mapping, f, indent=2)
    print(f"Saved class index mapping to {mapping_path}")

    # Prefetch optimization
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)

    model = build_transfer_model(num_classes)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy", tf.keras.metrics.TopKCategoricalAccuracy(k=3, name="top_3_accuracy")]
    )

    model_save_path = os.path.join(artifacts_dir, "plantcare_mobilenetv2_model.keras")

    training_callbacks = [
        callbacks.ModelCheckpoint(
            filepath=model_save_path,
            monitor="val_accuracy",
            save_best_only=True,
            verbose=1
        ),
        callbacks.EarlyStopping(
            monitor="val_loss",
            patience=4,
            restore_best_weights=True,
            verbose=1
        ),
        callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.2,
            patience=2,
            min_lr=1e-6,
            verbose=1
        )
    ]

    print("Beginning MobileNetV2 transfer learning training...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs,
        callbacks=training_callbacks
    )

    print(f"Training completed. Best model saved to: {model_save_path}")
    return history

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train MobileNetV2 on PlantVillage tomato subset.")
    parser.add_argument("--data_dir", type=str, default="../data/processed", help="Path to processed train/val dataset")
    parser.add_argument("--artifacts_dir", type=str, default="../artifacts", help="Directory to save model and mappings")
    parser.add_argument("--epochs", type=int, default=15, help="Number of training epochs")
    args = parser.parse_args()

    train_model(args.data_dir, args.artifacts_dir, args.epochs)
