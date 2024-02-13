import * as tf from '@tensorflow/tfjs';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

const video = document.getElementById('video');
const canvas = document.getElementById('output');
const context = canvas.getContext('2d');
context.fillStyle = "red";

// Load the MediaPipe handpose model.
const model = handPoseDetection.SupportedModels.MediaPipeHands;
const detectorConfig = {
  runtime: 'tfjs',
};
let detector;

// Global variable to store the latest predictions
let latestPredictions = [];

// Global variable to store captured and normalized hand poses
let capturedPoses = [];

async function setupCamera() {
  video.width = 800;
  video.height = 600;

  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: video.width,
      height: video.height,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function detectHands() {
  const predictions = await detector.estimateHands(video, true);
  latestPredictions = predictions; // Update the latest predictions

  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Flip the context horizontally
  context.save(); // Save the current state
  context.scale(-1, 1); // Flip context horizontally
  context.translate(-canvas.width, 0); // Move context back after flip

  predictions.forEach(prediction => {
    const keypoints = prediction.keypoints;

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],  // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8],  // Index Finger
      [0, 9], [9, 10], [10, 11], [11, 12],  // Middle Finger
      [0, 13], [13, 14], [14, 15], [15, 16],  // Ring Finger
      [0, 17], [17, 18], [18, 19], [19, 20]  // Pinky
    ];

    // Draw connections
    connections.forEach(([startIdx, endIdx]) => {
      const start = keypoints[startIdx];
      const end = keypoints[endIdx];

      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    });

    // Draw keypoints
    keypoints.forEach(point => {
      const {x, y} = point;
      context.beginPath();
      context.arc(x, y, 5, 0, 2 * Math.PI);
      context.fill();
    });

    // Display coordinates
    if(predictions.length > 0) {
      let coordinatesHtml = '';

      predictions.forEach((prediction, index) => {
          const keypoints = prediction.keypoints;
          coordinatesHtml += `<strong>Live Hand ${index + 1}:</strong><br>`;

          keypoints.forEach((point, idx) => {
              coordinatesHtml += `Point ${idx}: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})<br>`;
          });

          coordinatesHtml += `<br>`; // Add space between hands
      });

      document.getElementById('handCoordinates').innerHTML = coordinatesHtml;
    }    
  });

  // Restore the context to its original state
  context.restore();

  requestAnimationFrame(detectHands);
}

function normalizePose(keypoints) {
  const referencePoint = keypoints[0]; // Assuming the wrist is the first point

  const translatedPoints = keypoints.map(point => ({
      x: point.x - referencePoint.x,
      y: point.y - referencePoint.y,
  }));

  const scaleReferencePoint = keypoints[12]; // tip of middle finger
  const distance = Math.sqrt(Math.pow(scaleReferencePoint.x - referencePoint.x, 2) + Math.pow(scaleReferencePoint.y - referencePoint.y, 2));
  const scaleFactor = 100 / distance; // Normalize the distance to 100 units

  const normalizedPoints = translatedPoints.map(point => ({
      x: point.x * scaleFactor,
      y: point.y * scaleFactor,
  }));

  return normalizedPoints;
}

function plotNormalizedPoints() {
  // Get the new canvas and its context
  const plotCanvas = document.getElementById('plotCanvas');
  const plotContext = plotCanvas.getContext('2d');

  // do we have a pose
  if (capturedPoses.length > 0) {
    const keypoints = capturedPoses[capturedPoses.length - 1]; // Using the latest captured pose

    plotContext.clearRect(0, 0, plotCanvas.width, plotCanvas.height); // Clear canvas

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],  // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8],  // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20]  // Pinky
    ];

    // Draw connections
    connections.forEach(([startIdx, endIdx]) => {
      const start = keypoints[startIdx];
      const end = keypoints[endIdx];

      plotContext.beginPath();
      plotContext.moveTo(start.x + plotCanvas.width / 2, start.y + plotCanvas.height / 2);
      plotContext.lineTo(end.x + plotCanvas.width / 2, end.y + plotCanvas.height / 2);
      plotContext.strokeStyle = 'black';
      plotContext.lineWidth = 2;
      plotContext.stroke();
    });

    // Draw keypoints
    keypoints.forEach(point => {
      plotContext.beginPath();
      plotContext.arc(point.x + plotCanvas.width / 2, point.y + plotCanvas.height / 2, 5, 0, 2 * Math.PI);
      plotContext.fillStyle = "red";
      plotContext.fill();
    });
  } else {
    console.log('No captured poses to plot.');
  }
}

function displayLastCapturedPoints() {
  // Check if there are any captured poses
  if (capturedPoses.length > 0) {
      const lastPose = capturedPoses[capturedPoses.length - 1]; // Get the last captured pose
      let coordinatesHtml = '<div class="captured-points"><strong>Captured & Normalized to Wrist Points:</strong><br>';

      // Format the keypoints of the last pose
      lastPose.forEach((point, idx) => {
          coordinatesHtml += `Point ${idx}: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})<br>`;
      });

      coordinatesHtml += '</div>';

      // Update the `loadedHandCoordinates` div with the formatted points
      document.getElementById('loadedHandCoordinates').innerHTML = coordinatesHtml;
  } else {
      // Optionally handle the case where no poses have been captured
      console.log('No poses have been captured yet.');
  }
}

async function main() {
  await setupCamera();
  video.play();

  detector = await handPoseDetection.createDetector(model, detectorConfig);
  detectHands();

  // button for capturing points
  document.getElementById('captureBtn').addEventListener('click', () => {
    if (latestPredictions && latestPredictions.length > 0) {
        const predictions = latestPredictions[0].keypoints; // first detected hand
        const normalizedPose = normalizePose(predictions);
        capturedPoses.push(normalizedPose); // Store the normalized pose for future use
        console.log('Captured and normalized hand pose:', normalizedPose);
    }
  });

  // button for loading and plotting normalized points
  document.getElementById('loadAndPlotBtn').addEventListener('click', () => {
    plotNormalizedPoints();
    displayLastCapturedPoints(); 
});
}

main();
