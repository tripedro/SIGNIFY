// camera.js
/**
 * This module provides the functionality to initialize the camera and start the video feed.
 * It utilizes the Camera class to set up video parameters and handle frame updates.
 * - The initializeCamera function sets up the camera with specific configurations like resolution.
 * - It returns a promise that resolves when the camera successfully starts, using the provided video element.
 */

import { onResultsHands } from './hands.js';

function initializeCamera(videoElement, hands) {
  return new Promise((resolve, reject) => { // Add Promise
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 480,
      height: 480
    });
    camera.start().then(resolve).catch(reject); // Resolve the promise once the camera starts
  });
}

export { initializeCamera };