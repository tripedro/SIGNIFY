// camera.js
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