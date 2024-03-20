// camera.js
import { onResultsHands } from './hands.js';

function initializeCamera(videoElement, hands) {
  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: 480,
    height: 480
  });
  camera.start();
}

export { initializeCamera };
