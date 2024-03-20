// hands.js
import { displayCoordinates } from './ui.js';

function onResultsHands(results, canvasCtx3, out3) {
  document.body.classList.add('loaded');

  canvasCtx3.save();
  canvasCtx3.clearRect(0, 0, out3.width, out3.height);
  canvasCtx3.drawImage(results.image, 0, 0, out3.width, out3.height);
  if (results.multiHandLandmarks && results.multiHandedness) {
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      const classification = results.multiHandedness[index];
      const isRightHand = classification.label === 'Right';
      const landmarks = results.multiHandLandmarks[index];

      displayCoordinates(landmarks);

      drawConnectors(
        canvasCtx3, landmarks, HAND_CONNECTIONS,
        { color: '#949494' }
      );
      drawLandmarks(canvasCtx3, landmarks, {
        color: isRightHand ? '#00FF00' : '#FF0000',
        fillColor: '#00FF00',
        radius: 2
      });
    }
  }
  canvasCtx3.restore();
}

export { onResultsHands };
