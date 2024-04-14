// hands.js
import { displayCoordinates } from './ui.js';
//import { compareLandmarksToTemplateDetailed } from './matchingLogic.js';

function normalizeLandmarks(landmarks) {
  // Calculate means
  const meanX = landmarks.reduce((acc, val) => acc + val.x, 0) / landmarks.length;
  const meanY = landmarks.reduce((acc, val) => acc + val.y, 0) / landmarks.length;

  // Calculate standard deviations
  const stdDevX = Math.sqrt(landmarks.reduce((acc, val) => acc + Math.pow(val.x - meanX, 2), 0) / landmarks.length);
  const stdDevY = Math.sqrt(landmarks.reduce((acc, val) => acc + Math.pow(val.y - meanY, 2), 0) / landmarks.length);

  // Normalize landmarks
  return landmarks.map(landmark => ({
    x: (landmark.x - meanX) / stdDevX,
    y: (landmark.y - meanY) / stdDevY
  }));
}

function onResultsHands(results, canvasCtx3, out3, currentLetter, aslStaticAlphabet, currentWord, currentLetterIndex) {
  document.body.classList.add('loaded');

  canvasCtx3.save();
  canvasCtx3.clearRect(0, 0, out3.width, out3.height);
  canvasCtx3.drawImage(results.image, 0, 0, out3.width, out3.height);
  if (results.multiHandLandmarks && results.multiHandedness) {
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      const classification = results.multiHandedness[index];
      let isRightHand = classification.label === 'Right';
      if (localStorage.getItem('preferredHand') === 'Left') {
        isRightHand = classification.label === 'Left';
      }
      const landmarks = results.multiHandLandmarks[index];

      const normalizedLandmarks = normalizeLandmarks(landmarks);

      displayCoordinates(normalizedLandmarks, currentWord, currentLetterIndex);

      drawConnectors(
        canvasCtx3, landmarks, HAND_CONNECTIONS,
        { color: '#949494' }
      );
      landmarks.forEach((landmark, i) => {
        const fillColor = '#00FF00';
        drawLandmarks(canvasCtx3, [landmark], {
          //color: isRightHand ? 'green' : 'blue',
          color: fillColor,
          fillColor: fillColor,
          radius: 2
        });
      });
    }
  }
  canvasCtx3.restore();
}

export { onResultsHands };
