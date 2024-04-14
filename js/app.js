// app.js in the superdirectory js/
import { saveCoordinates, displayWordWithHighlight, getLatestCoordinates, toggleRecording, displayCoordinates, getRecordedCoordinates } from './modules/ui.js';
import { onResultsHands } from './modules/hands.js';
import { initializeCamera } from './modules/camera.js';
import aslStaticAlphabetLeft from './modules/aslStaticAlphabet-left.js';
import aslStaticAlphabetRight from './modules/aslStaticAlphabet-right.js';
import { compareLandmarksToTemplate } from './modules/matchingLogic.js';
import { scoreGesture } from './modules/dynamic_score.js';
import aslDynamicSignsRight from './modules/aslDynamicSigns-right.js';

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Words to be spelt based on game difficulty
var selectedLevel = localStorage.getItem('selectedLevel');
console.log(selectedLevel)
// Define word lists mapped by level
// const wordsByLevel = {
//   // easy
//   '1': ['ABLE', 'BUY', 'WAVY', "SUE", "TEA", "COST", "TIN", "ICE", "MUTE", "MINUTE", 
//   "MEN", "STONE", "SON", "NET", "MAT", "SUN", "CUSTOM", "BAT", "SIT", "BEAST", "MINCE", 
//   "CAT", "SUMO", "COMET", "TAME", "EAT", "STEAM", "SEAT", "NUT", "NEST", "BOAT", "SET", 
//   "TAN", "MINT", "SILENT", "INSECT", "MAN"],

//   // slightly harder
//   '2': ['BASH', 'FLEX', 'JUMP', 'QUIRK', 'TWIRL', 'GLYPH', 'KNACK', 'PLUMB', 'QUERY', 'VEXED',
//   'WITCH', 'JINX', 'CRISP', 'FLUKE', 'SMACK'],

//   // hard + dynamic
//   '3': ['JINX', 'QUIZ', 'FJORD', 'BLAZE', 'JOKES', 'ZEBRA', 'QUAKE', 'ZESTY', 'JUMBO',
//   'JOUST', 'ZILCH', 'JUNKY', 'VEXED', 'SMACK']
// };

const wordsByLevel = {
  // easy
  '1': ['ABLE'],

  // slightly harder
  '2': ['BASH'],

  // hard + dynamic
  '3': ['ZJ'],
};
// Get words to spell based on the selected level, default to the simplest if undefined
let wordsToSpell = wordsByLevel[selectedLevel] || ['Able', 'Buy'];

let currentWordIndex = 0;
let currentLetterIndex = 0;
const latestCoordinates = getLatestCoordinates();
let lastDetectionTime = 0; // This will store the timestamp of the last detection
const detectionDelay = 500; // Delay in milliseconds

var preferredHand = localStorage.getItem('preferredHand');
let aslStaticAlphabet;
let aslDynamicSigns;
if (preferredHand === 'Right') {
  aslStaticAlphabet = aslStaticAlphabetRight;
  aslDynamicSigns = aslDynamicSignsRight;
} else {
  aslStaticAlphabet = aslStaticAlphabetLeft;
  aslDynamicSigns = aslDynamicSignsRight;
}

async function setupAndStart() {
  const video3 = document.getElementsByClassName('input_video3')[0];
  const out3 = document.getElementsByClassName('output3')[0];
  const controlsElement3 = document.getElementsByClassName('control3')[0];
  const canvasCtx3 = out3.getContext('2d');

  // Initialize hands with the locateFile function
  let hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`
  });

  hands.onResults(results => {
    // Dynamically get the current letter based on the current word and letter indices
    const currentWord = wordsToSpell[currentWordIndex];
    let currentLetter = currentWord && currentWord.length > currentLetterIndex ? currentWord[currentLetterIndex].toUpperCase() : '';
    // Identify if the current letter is dynamic
    const isDynamicLetter = currentLetter === 'Z' || currentLetter === 'J';

    onResultsHands(results, canvasCtx3, out3, currentLetter, aslStaticAlphabet, currentWord, currentLetterIndex, isDynamicLetter);
  });

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
  const currentTime = Date.now();
  if (currentTime < lastDetectionTime + detectionDelay) {
    return; // Skip the check if the delay has not passed
  }

  const currentWord = wordsToSpell[currentWordIndex];
  const currentLetter = currentWord[currentLetterIndex].toUpperCase();
  const landmarks = getLatestCoordinates();
  var preferredHand = localStorage.getItem('preferredHand');

  if (preferredHand === 'Right') {
    changeImage("../pictures/" + currentLetter + "Right.png");
  }
  else {
    changeImage("../pictures/" + currentLetter + "Left.png");
  }
  
  // Identify if the current letter is dynamic
  const isDynamicLetter = currentLetter === 'Z' || currentLetter === 'J';

  // Process dynamic gestures using Dynamic Time Warping
  if (isDynamicLetter) {
    // Assume we have a function getDynamicGestureTemplate that returns the correct template
    const gestureTemplate = aslDynamicSigns[currentLetter]; // Dynamic templates for 'J' and 'Z'
    const recordedCoordinates = getRecordedCoordinates();
    console.log("Recorded Coordinates", recordedCoordinates)
    if (recordedCoordinates.length >= 75){
    const currentGesture = recordedCoordinates.slice(-100); // Use last 100 recorded coordinates

    // Use the scoreGesture function defined in dynamic_score.js
    const gestureScore = scoreGesture(currentGesture, gestureTemplate);
    console.log("dynamic gesture score", gestureScore)
    // Assume a threshold for a successful gesture match
    if (gestureScore < 89) { // threshold
      console.log("You matched!")
      if (currentLetterIndex < currentWord.length - 1) {
        currentLetterIndex++;
      } else {
        currentWordIndex++;
        currentLetterIndex = 0;
        if (currentWordIndex >= wordsToSpell.length) {
          console.log('Great job! All words spelled.');
          if (selectedLevel === '3') {  // Check if the last difficulty level is completed
            alert("Moving to the Game!");
            window.location.href = "../game/gameHome.html"; // Redirect to the game section
          } else {
            selectedLevel = (parseInt(selectedLevel) + 1).toString();  // Move to the next difficulty level
            wordsToSpell = wordsByLevel[selectedLevel];
            currentWordIndex = 0;  // Reset word index for new level
            alert("Moving to next difficulty!");
          }
        }
      }
    }
  }
  } else {
    // Static letter comparison as before
    const isMatch = compareLandmarksToTemplate(landmarks, aslStaticAlphabet[currentLetter]);
    if (isMatch) {
      if (currentLetterIndex < currentWord.length - 1) {
        currentLetterIndex++;
      } else {
        currentWordIndex++;
        currentLetterIndex = 0;
        if (currentWordIndex >= wordsToSpell.length) {
          console.log('Great job! All words spelled.');
          if (selectedLevel === '3') {  // Check if the last difficulty level is completed
            window.location.href = "../game/gameHome.html"; // Redirect to the game section
            alert("Moving to the Game!");
          } else {
            selectedLevel = (parseInt(selectedLevel) + 1).toString();  // Move to the next difficulty level
            wordsToSpell = wordsByLevel[selectedLevel];
            currentWordIndex = 0;  // Reset word index for new level
            alert("Moving to next difficulty!");
          }
        }
      }
    }
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