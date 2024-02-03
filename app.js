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

async function setupCamera() {
  video.width = 1280;
  video.height = 960;

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

  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Flip the context horizontally
  context.save(); // Save the current state
  context.scale(-1, 1); // Flip context horizontally
  context.translate(-canvas.width, 0); // Move context back after flip

  predictions.forEach(prediction => {
    const keypoints = prediction.keypoints;

    // Define connections as before
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
  });

  // Restore the context to its original state
  context.restore();

  requestAnimationFrame(detectHands);
}


async function main() {
  await setupCamera();
  video.play();

  detector = await handPoseDetection.createDetector(model, detectorConfig);
  detectHands();
}

main();
