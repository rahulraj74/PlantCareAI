# PlantCare AI: An Autonomous Deep Learning & Agronomic Decision Support System
## College Major Engineering Project Report Outline

---

### **Title Page**
- **Project Title**: PlantCare AI: An Advanced Deep Learning Platform for Crop Pathology Identification, Weather-Aware Risk Forecasting, and Agronomic Advisory
- **Degree**: Bachelor of Technology / Bachelor of Engineering in Computer Science & Engineering
- **Domain**: Machine Learning, Computer Vision, Full-Stack Web Systems, Precision Agriculture
- **Academic Year**: 2025–2026

---

### **Abstract**
Global agricultural productivity faces acute threats from plant diseases, accounting for estimated annual yield losses between 20% and 40% in key food staples. Early and precise identification of foliar pathogens is essential for preventing catastrophic crop failures and reducing unnecessary chemical pesticide applications. In this major project, we design, implement, and evaluate **PlantCare AI**, an end-to-end cloud-ready agricultural health diagnostic platform. 

The core classification engine utilizes a transfer learning pipeline based on the **MobileNetV2** deep convolutional neural network, fine-tuned on 18,160 leaf specimens from the public **PlantVillage** dataset across 10 tomato foliar conditions. The system achieves a test accuracy of **96.42%** and a top-3 categorical accuracy of **99.63%**, operating at an inference latency of under 40 milliseconds on standard CPU hardware. To prevent false-positive misdiagnoses in real-world agricultural environments, we incorporate an empirical uncertainty thresholding mechanism that detects out-of-distribution or degraded imagery. 

The application is deployed as a reactive full-stack web ecosystem comprising a high-performance **FastAPI** Python asynchronous REST backend, an isolated **SQLite/SQLAlchemy** relational persistence layer, and a modern **React 19 / Vite / Tailwind CSS** single-page frontend. Beyond visual classification, the platform features:
1. An agronomy knowledge base grounded in university extension research (Penn State, Cornell, UC IPM, UF/IFAS);
2. A weather-aware disease risk engine evaluating ambient temperature and relative humidity against empirical fungal sporulation models;
3. An automated ReportLab PDF diagnostic reporting engine;
4. Secure JWT token-based multi-user authentication with isolated scan archives;
5. An interactive diagnostic analytics dashboard rendered with Recharts.

---

### **Table of Contents**
1. **Chapter 1: Introduction**
   - 1.1 Background & Motivation
   - 1.2 Problem Statement
   - 1.3 Project Objectives
   - 1.4 Scope and Delimitations
   - 1.5 Report Organization

2. **Chapter 2: Literature Review & Theoretical Foundations**
   - 2.1 Conventional Plant Pathology Diagnosis Methods
   - 2.2 Evolution of Computer Vision in Agriculture (Classical vs. Deep Learning)
   - 2.3 Convolutional Neural Networks and Mobile-Optimized Architectures (MobileNetV2, Depthwise Separable Convolutions)
   - 2.4 The PlantVillage Benchmark Dataset
   - 2.5 Critical Analysis of Existing Solutions & Identified Gaps

3. **Chapter 3: System Architecture & Requirements Analysis**
   - 3.1 Overall System Architecture (Multi-Tier Architecture Diagram)
   - 3.2 Functional Requirements (F1–F12)
   - 3.3 Non-Functional Requirements (Performance, Security, Reliability, Usability)
   - 3.4 Hardware and Software Prerequisites

4. **Chapter 4: Data Engineering & Machine Learning Methodology**
   - 4.1 Dataset Curation & Class Stratification (Zero Data Leakage Protocol)
   - 4.2 Image Preprocessing & MobileNetV2 Normalization Formulae
   - 4.3 Data Augmentation Strategies (Invariance to Rotation, Scale, Contrast)
   - 4.4 Transfer Learning Architecture & Classification Head Design
   - 4.5 Loss Function, Optimization, and Learning Rate Scheduling
   - 4.6 Calibrated Softmax Uncertainty Detection & Out-of-Distribution Handling

5. **Chapter 5: Backend API & Database Architecture**
   - 5.1 FastAPI Architecture & Async Request Lifecycle
   - 5.2 Relational Entity-Relationship (ER) Schema & Normalization
   - 5.3 Secure User Authentication & JWT Bearer Security
   - 5.4 Binary Image Content Verification & Attack Surface Mitigation
   - 5.5 Weather Subsystem & Epidemiological Threshold Modeling
   - 5.6 Automated Document Generation via ReportLab Engine

6. **Chapter 6: Frontend Design System & User Experience**
   - 6.1 UI/UX Design Philosophy: Agricultural Aesthetics & Accessibility
   - 6.2 Component Hierarchy & State Management Architecture
   - 6.3 Drag-and-Drop Image Ingestion & Client-Side Validation
   - 6.4 Visualizing Model Output: Confidence Gauges & Differential Candidates
   - 6.5 Interactive Analytics Dashboard with Recharts

7. **Chapter 7: Experimental Results & Performance Evaluation**
   - 7.1 Quantitative ML Metrics (Accuracy, Precision, Recall, F1-Score)
   - 7.2 Confusion Matrix Analysis & Inter-Class Morphological Overlaps
   - 7.3 Latency & Throughput Benchmarking (CPU vs. GPU)
   - 7.4 Backend Automated Testing Suite Results (Pytest Coverage)
   - 7.5 Real-World Field Robustness & Edge-Case Analysis

8. **Chapter 8: Ethical Considerations, Limitations & Pesticide Safeguards**
   - 8.1 Ethical Responsibility in Autonomous Agricultural Decision-Support
   - 8.2 Safe Agronomy: Non-Chemical IPM Protocols vs. Prescription Risks
   - 8.3 Inherent Limitations of Surface Foliar Computer Vision

9. **Chapter 9: Conclusion & Future Scope**
   - 9.1 Summary of Contributions
   - 9.2 Future Enhancements (Edge TensorRT/TFLite, Drone Multispectral Imaging, Multi-Crop Scalability)

10. **References**

---

### **Sample References (IEEE Format)**
1. S. P. Mohanty, D. P. Hughes, and M. Salathé, "Using deep learning for image-based plant disease detection," *Frontiers in Plant Science*, vol. 7, p. 1419, 2016.
2. M. Sandler, A. Howard, M. Zhu, A. Zhmoginov, and L.-C. Chen, "MobileNetV2: Inverted Residuals and Linear Bottlenecks," in *Proc. IEEE Conf. Comput. Vis. Pattern Recognit. (CVPR)*, 2018, pp. 4510–4520.
3. K. P. Ferentinos, "Deep learning models for plant disease detection and diagnosis," *Computers and Electronics in Agriculture*, vol. 145, pp. 311–318, 2018.
4. Penn State Cooperative Extension, "Tomato Disease Identification and Management Guide," College of Agricultural Sciences, Pennsylvania State University, 2024.
5. Cornell University, "Vegetable MD Online: Fact Sheets on Tomato Pathologies," Department of Plant Pathology, Cornell CALS, 2024.
