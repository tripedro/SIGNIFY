// app.js in the superdirectory js/
import { saveCoordinates, displayWordWithHighlight, getLatestCoordinates} from './modules/ui.js';
import { onResultsHands } from './modules/hands.js';
import { initializeCamera } from './modules/camera.js';
import aslStaticAlphabet from './modules/aslStaticAlphabet.js';

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define the words to be spelled and the current state
const wordsToSpell = ['Able', 'Buy', 'Wavy'];
let currentWordIndex = 0;
let currentLetterIndex = 0;
const latestCoordinates = getLatestCoordinates();

function checkLetterMatch() {
    const currentWord = wordsToSpell[currentWordIndex];
    const currentLetter = currentWord[currentLetterIndex].toUpperCase();
    const landmarks = latestCoordinates; // Make sure this is accessible, may need to export/import
  
    // Logic to check if landmarks match currentLetter's template
    // This is a placeholder for the actual comparison logic
    const isMatch = compareLandmarksToTemplate(landmarks, aslStaticAlphabet[currentLetter]);
  
    if (isMatch) {
      if (currentLetterIndex < currentWord.length - 1) {
        // Move to the next letter in the current word
        currentLetterIndex++;
      } else {
        // Word completed, move to the next word
        currentWordIndex++;
        currentLetterIndex = 0;
        if (currentWordIndex >= wordsToSpell.length) {
          // All words completed
          console.log('Great job! All words spelled.');
          return;
        }
      }
      // Update UI for next letter
      displayWordWithHighlight(currentWord, currentLetterIndex);
    }
  }
  
  // Placeholder for the function comparing landmarks to template
  // You will need to implement this based on your matching logic
  function compareLandmarksToTemplate(landmarks, template) {
    // Implement comparison logic here
    // Return true if the landmarks match the template closely enough
    return false; // Placeholder return
  }
  
  // Initialize the UI with the first word and letter
  displayWordWithHighlight(wordsToSpell[0], 0);
  
  // Call checkLetterMatch periodically or trigger it via a specific event
  setInterval(checkLetterMatch, 1000); // Example: check every second

////////////////////////////////////////////////////////////////////////////////////////////////////////////

const video3 = document.getElementsByClassName('input_video3')[0];
const out3 = document.getElementsByClassName('output3')[0];
const controlsElement3 = document.getElementsByClassName('control3')[0];
const canvasCtx3 = out3.getContext('2d');
let hands;

document.addEventListener("DOMContentLoaded", (event) => {
    hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`
    });
    hands.onResults(results => onResultsHands(results, canvasCtx3, out3));

    // Ensure the camera is initialized after hands has been defined
    initializeCamera(video3, hands);

    // Setup control panel after hands initialization
    new ControlPanel(controlsElement3, {
        selfieMode: true,
        maxNumHands: 2,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    })
    .add([
        new StaticText({title: 'MediaPipe Hands'}),
        new Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
        new Slider({title: 'Max Number of Hands', field: 'maxNumHands', range: [1, 4], step: 1}),
        new Slider({title: 'Min Detection Confidence', field: 'minDetectionConfidence', range: [0.7, 0.9], step: 0.01}),
        new Slider({title: 'Min Tracking Confidence', field: 'minTrackingConfidence', range: [0.7, 0.9], step: 0.01}),
    ])
    .on(options => {
        video3.classList.toggle('selfie', options.selfieMode);
        hands.setOptions(options);
    });

    document.getElementById('saveBtn').addEventListener('click', saveCoordinates);
});
