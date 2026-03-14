let video;
let pointColors = [];
let osc = [];
let bodyPose;
let poses = [];
let parts = ["left_wrist", "right_wrist", "left_elbow", "right_elbow"];
let activeIndices = [false, false, false, false];
let message = "Show your body";
let playhead = 0; // Playback head position
let historyPoints = []; // Storage for visual notes

function preload() {
    bodyPose = ml5.bodyPose();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    // Global Pastel Color Palette
    pointColors = [
        color(255, 182, 193), // 0: Left Wrist (Pink)
        color(173, 216, 230), // 1: Right Wrist (Blue)
        color(152, 251, 152), // 2: Left Elbow (Green)
        color(255, 253, 208)  // 3: Right Elbow (Yellow)
    ];

    // Initialize Pose Detection
    bodyPose.detectStart(video, results => { poses = results; });

    // Initialize Oscillators for 4 body parts
    let waveTypes = ['square', 'sine', 'triangle', 'sawtooth'];
    for (let i = 0; i < 4; i++) {
        let newOsc = new p5.Oscillator(waveTypes[i]);
        newOsc.amp(0);
        newOsc.start();
        osc.push(newOsc);
    }
}

function draw() {
    background(0);

    // 1. Calculate Scaling factors
    let scaleX = width / video.width;
    let scaleY = height / video.height;

    // 2. Draw Video background with white semi-transparent overlay
    image(video, 0, 0, width, height);
    fill(255, 200);
    noStroke();
    rect(0, 0, width, height);

    // 3. Process Pose Detection and Logic
    if (poses.length > 0) {
        message = "Performing...";
        push();
        scale(scaleX, scaleY); // Align coordinates to video resolution

        updateInstruments();
        drawBodyPoints();

        pop();
    } else {
        stopAllSounds();
        message = "Show your body";
    }

    drawStaff(); // Draw musical staff lines
    drawNotes(); // Draw floating notes
    drawUI();    // Draw status bar
}

function updateInstruments() {
    activeIndices = [false, false, false, false];

    // Chromatic Scale Frequencies (C4 to C5)
    let chromaticNotes = [
        261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 370.00, 392.00, 415.30, 440.00, 466.16, 493.88, 523.25
    ];
    // Vertical offsets for natural and sharp notes on the staff
    let staffOffsets = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7];

    for (let j = 0; j < parts.length; j++) {
        let targetName = parts[j];
        let point = poses[0].keypoints.find(k => k.name === targetName);

        if (point && point.confidence > 0.1) {
            // Map Y position to chromatic index
            let index = floor(map(point.y, 0, 480, chromaticNotes.length - 1, 0));
            index = constrain(index, 0, chromaticNotes.length - 1);

            osc[j].freq(chromaticNotes[index]);

            let side = (j % 2 === 0) ? "left" : "right";
            let shoulder = poses[0].keypoints.find(k => k.name === side + "_shoulder");

            // Trigger sound if part is higher than the shoulder
            if (shoulder && point.y < shoulder.y) {
                osc[j].amp(0.5, 0.05);
                activeIndices[j] = true;

                // Visual Staff Logic
                let padding = 100;
                let sectionHeight = height / 4;
                let centerY = (sectionHeight * j + sectionHeight / 2) / (height / 480); // Adjusting for scale
                let lineSpacing = 15;

                let offset = staffOffsets[index];
                // Precise Y calculation: lineSpacing/2 represents one semitone step
                let noteY = centerY + (2 - offset) * (lineSpacing / 2);

                historyPoints.push({
                    x: padding + playhead,
                    y: noteY * (height / 480), // Map back to screen space
                    color: pointColors[j],
                    alpha: 255
                });
            }
        }
    }

    // Silence inactive parts
    for (let i = 0; i < 4; i++) {
        if (!activeIndices[i]) osc[i].amp(0, 0.1);
    }
}

function stopAllSounds() {
    osc.forEach(o => o.amp(0, 0.1));
}

function drawBodyPoints() {
    for (let j = 0; j < parts.length; j++) {
        let point = poses[0]?.keypoints.find(k => k.name === parts[j]);
        if (point && point.confidence > 0.1) {
            if (activeIndices[j]) {
                fill(pointColors[j]);
                noStroke();
                circle(point.x, point.y, 15);
            } else {
                fill(200, 100);
                noStroke();
                circle(point.x, point.y, 5);
            }
        }
    }
}

function drawStaff() {
    stroke(100, 150);
    strokeWeight(1);

    let padding = 100;
    let lineSpacing = 15;
    let sectionHeight = height / 4;

    for (let i = 0; i < 4; i++) {
        let centerY = sectionHeight * i + sectionHeight / 2;
        let startY = centerY - (lineSpacing * 2);

        for (let lineNum = 0; lineNum < 5; lineNum++) {
            let y = startY + (lineNum * lineSpacing);
            line(padding, y, width - padding, y);
        }
    }
}

function drawNotes() {
    let padding = 100;

    // Move the playback head
    playhead += 3;
    if (playhead > width - padding * 2) {
        playhead = 0;
    }

    // Render and update historical notes
    for (let i = historyPoints.length - 1; i >= 0; i--) {
        let p = historyPoints[i];

        fill(red(p.color), green(p.color), blue(p.color), p.alpha);
        noStroke();
        circle(p.x, p.y, 12);

        p.alpha -= 3; // Fade out speed

        if (p.alpha <= 0) {
            historyPoints.splice(i, 1);
        }
    }
}

function drawUI() {
    fill(0, 150);
    rect(0, height - 40, width, 40);
    fill(255);
    textSize(14);
    textAlign(LEFT, CENTER);
    text(message, 20, height - 20);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}