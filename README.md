# **Distributed-choir**

**Date:** March 14, 2026

**Author:** Yu Ting Liao

**Project Type:** WCC2 Workshop 4 \- Technical Proof of Concept

# **🎼 Body Orchestra: AI Generative Staff**

An interactive audiovisual installation that transforms human body movements into a dynamic musical performance. By using **ML5.js BodyPose**, your wrists and elbows become "living notes" on a virtual musical staff.

## **✨ Project Overview**

**Body Orchestra** is a creative coding project built with **p5.js** and **ml5.js**. It creates a bridge between physical dance and digital music composition. The system tracks four key points of the user's body to generate complex harmonies and visual notation in real-time.

### **🎨 Visual Language**

* **Soft Aesthetics**: A semi-transparent white overlay creates a "frosted glass" effect on the camera feed.  
* **Color Coding**:  
  * 🌸 **Pink**: Left Wrist (Oscillator: Square)  
  * 🧊 **Blue**: Right Wrist (Oscillator: Sine)  
  * 🌿 **Green**: Left Elbow (Oscillator: Triangle)  
  * 🍦 **Yellow**: Right Elbow (Oscillator: Sawtooth)  
* **Precision Notation**: A chromatic 12-note system where "sharps" (semitones) are accurately rendered in between the standard staff lines.

## **🚀 Installation & Running**

### **1\. Prerequisites**

Before running the sketch, ensure you have:

* A computer with a **Webcam**.  
* **Internet Connection** (Required to load the ML5.js BodyPose model weights from the cloud).  
* **VS Code** with the **Live Server** extension installed.

### **2\. Standalone File Structure**

To run this without a Node.js server, organize your folder as follows:

04\_WORKSHOP/  
├── index.html      \# Main webpage structure  
├── sketch.js       \# Core logic (AI, Sound, Graphics)  
├── style.css       \# Basic layout styling  
└── README.md       \# Project documentation (this file)

### **3\. Step-by-Step Launch**

1. **Open Folder**: Open the 04\_WORKSHOP folder in VS Code.  
2. **Start Server**: Click the **"Go Live"** button at the bottom right corner of VS Code.  
3. **Permissions**: When the browser opens, grant permission to use your **Camera**.  
4. **Wait for Model**: The UI will display "Show your body". Once the AI model is loaded and detects you, it will change to "Performing...".

## **🎹 Interaction & Logic**

### **Sound Trigger (Height Threshold)**

Sound is activated only when a tracked part (wrist or elbow) is lifted **above the shoulder** level of the same side. This mimics the action of reaching out to play an invisible instrument.

### **Chromatic Scale & Visual Mapping**

The system uses a **12-tone Chromatic Scale (C4 to C5)**:

* **Quantization**: Every movement is snapped to the nearest semitone: C, C\#, D, D\#, E, F, F\#, G, G\#, A, A\#, B, C.  
* **Visual Accuracy**:  
  * Standard notes sit on lines or in spaces.  
  * Semitones (Sharps) are rendered at lineSpacing / 2 offsets, appearing precisely between the natural notes.

### **Dynamic Notation**

As the **Playback Head** (vertical line) moves across the screen, it records your performance:

* **Note Trails**: Circles are drawn at the exact time and pitch of the trigger.  
* **Fade Effect**: Notes slowly disappear over time, creating a fleeting visual memory of the music.

## **📜 Technical Maintenance**

* **Coordinate Scaling**: Uses scale(scaleX, scaleY) to ensure the 640x480 detection coordinates perfectly overlay on any screen resolution.  
* **Memory Management**: The historyPoints array is automatically cleaned as notes reach alpha \= 0, ensuring the browser doesn't slow down during long sessions.  
* **Offline Note**: To make this 100% offline, you must host the ML5 model weights locally and update the ml5.bodyPose() path in sketch.js.

## **⚖️ License**

This project is for educational and creative purposes. Feel free to modify the waveforms or scales to create your own unique "Body Orchestra".