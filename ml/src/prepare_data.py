"""
PlantCare AI - Data Preparation Pipeline
Prepares and partitions the PlantVillage tomato disease dataset into
Train (70%), Validation (15%), and Test (15%) splits with zero data leakage.
"""

import os
import shutil
import random
from pathlib import Path
from typing import Dict, List, Tuple

# Supported Tomato Classes
SUPPORTED_TOMATO_CLASSES = [
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

def split_dataset(
    source_dir: str,
    output_dir: str,
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
    seed: int = 42
) -> Dict[str, Dict[str, int]]:
    """
    Splits images from source_dir into stratified train, val, and test partitions.
    """
    assert abs(train_ratio + val_ratio + test_ratio - 1.0) < 1e-5, "Ratios must sum to 1.0"
    random.seed(seed)

    source_path = Path(source_dir)
    out_path = Path(output_dir)

    for split in ["train", "val", "test"]:
        os.makedirs(out_path / split, exist_ok=True)

    summary = {"train": {}, "val": {}, "test": {}}

    for class_name in SUPPORTED_TOMATO_CLASSES:
        class_folder = source_path / class_name
        if not class_folder.exists():
            print(f"Skipping class '{class_name}' (folder not found in {source_dir})")
            continue

        images = [
            f for f in class_folder.iterdir()
            if f.is_file() and f.suffix.lower() in [".jpg", ".jpeg", ".png", ".webp"]
        ]
        random.shuffle(images)

        total_count = len(images)
        train_end = int(total_count * train_ratio)
        val_end = train_end + int(total_count * val_ratio)

        splits = {
            "train": images[:train_end],
            "val": images[train_end:val_end],
            "test": images[val_end:]
        }

        for split_name, file_list in splits.items():
            dest_folder = out_path / split_name / class_name
            os.makedirs(dest_folder, exist_ok=True)
            for img_file in file_list:
                shutil.copy2(img_file, dest_folder / img_file.name)
            summary[split_name][class_name] = len(file_list)

        print(f"Class '{class_name}': {len(splits['train'])} train, {len(splits['val'])} val, {len(splits['test'])} test")

    return summary

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Partition PlantVillage tomato data into train/val/test splits.")
    parser.add_argument("--source", type=str, required=True, help="Path to raw PlantVillage tomato folders")
    parser.add_argument("--output", type=str, default="../data/processed", help="Destination directory for splits")
    args = parser.parse_args()

    split_dataset(args.source, args.output)
