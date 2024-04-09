// app.js in the superdirectory js/
import { saveCoordinates, displayWordWithHighlight, getLatestCoordinates, toggleRecording } from './modules/ui.js';
import { onResultsHands } from './modules/hands.js';
import { initializeCamera } from './modules/camera.js';
import aslStaticAlphabet from './modules/aslStaticAlphabet.js';
import { compareLandmarksToTemplate } from './modules/matchingLogic.js';

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define the words to be spelled and the current state
const wordsToSpell = ['Able', 'Buy', 'Wavy', 'ZJ'];
let currentWordIndex = 0;
let currentLetterIndex = 0;
const latestCoordinates = getLatestCoordinates();
let lastDetectionTime = 0; // This will store the timestamp of the last detection
const detectionDelay = 1000; // Delay in milliseconds

async function setupAndStart() {
  const video3 = document.getElementsByClassName('input_video3')[0];
  const out3 = document.getElementsByClassName('output3')[0];
  const controlsElement3 = document.getElementsByClassName('control3')[0];
  const canvasCtx3 = out3.getContext('2d');

  // Initialize hands with the locateFile function
  let hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`
  });

  // Setup the onResults callback for when results are received
  hands.onResults(results => onResultsHands(results, canvasCtx3, out3));

  // Initialize the camera after 'hands' is defined
  await initializeCamera(video3, hands);

  // Setup the control panel
  new ControlPanel(controlsElement3, {
    selfieMode: true,
    maxNumHands: 2,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  }).add([
    new StaticText({ title: 'MediaPipe Hands' }),
    new Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
    new Slider({ title: 'Max Number of Hands', field: 'maxNumHands', range: [1, 4], step: 1 }),
    new Slider({ title: 'Min Detection Confidence', field: 'minDetectionConfidence', range: [0.7, 0.9], step: 0.01 }),
    new Slider({ title: 'Min Tracking Confidence', field: 'minTrackingConfidence', range: [0.7, 0.9], step: 0.01 }),
  ]).on(options => {
    video3.classList.toggle('selfie', options.selfieMode);
    hands.setOptions(options);
  });

  // Start checking for letter matches
  setInterval(checkLetterMatch, 1500); // Check every second
}

function checkLetterMatch() {
  const currentWord = wordsToSpell[currentWordIndex];
  const currentLetter = currentWord[currentLetterIndex].toUpperCase();
  const landmarks = latestCoordinates;

  changeImage("../pictures/" + currentLetter + ".png");
  // Identify if the current letter is dynamic
  //const isDynamicLetter = currentLetter === 'Z' || currentLetter === 'J';

  // Call the comparison function with the dynamic flag as needed
  const isMatch = compareLandmarksToTemplate(landmarks, aslStaticAlphabet[currentLetter]);

  if (isMatch) {
    // Existing logic for processing the match
    setTimeout(() => {
      if (currentLetterIndex < currentWord.length - 1) {
        currentLetterIndex++;
      } else {
        currentWordIndex++;
        currentLetterIndex = 0;
        if (currentWordIndex >= wordsToSpell.length) {
          console.log('Great job! All words spelled.');
          return;
        }
      }
      displayWordWithHighlight(currentWord, currentLetterIndex);
    }, 1000);
  }
  displayWordWithHighlight(currentWord, currentLetterIndex);
}

function changeImage(newSrc) {
  document.getElementById('dynamicPicture').src = newSrc;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", (event) => {
  setupAndStart().catch(console.error);

  document.getElementById('saveBtn').addEventListener('click', function () {
    // Retrieve the current frame's coordinates
    const currentFrameCoordinates = getLatestCoordinates();

    // Call `saveCoordinates` with the current frame's coordinates and the flag set to true
    saveCoordinates(currentFrameCoordinates, true);
  });

  document.getElementById('toggleRecordingBtn').addEventListener('click', toggleRecording);
});