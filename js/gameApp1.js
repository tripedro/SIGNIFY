// app.js in the superdirectory js/
import { saveCoordinates, displayWordWithHighlight, getLatestCoordinates, toggleRecording } from './modules/ui.js';
import { onResultsHands } from './modules/hands.js';
import { initializeCamera } from './modules/camera.js';
import aslStaticAlphabetLeft from './modules/aslStaticAlphabet-left.js';
import aslStaticAlphabetRight from './modules/aslStaticAlphabet-right.js';
import aslDynamicSignsLeft from './modules/aslDynamic-left.js';
import aslDynamicSignsRight from './modules/aslDynamicSigns-right.js';
import { compareLandmarksToTemplates } from './modules/matchingLogic.js';

// Game State Variables
let currentWordIndex = 0;
let currentLetterIndex = 0;
const wordsToSpell = ["ABLE", "BABY", "WAVY", "LOSE"]; // Be sure to have all capital letters
let matchedLetters = [];
let guessedWords = 0;
const word = wordsToSpell[Math.floor(Math.random() * wordsToSpell.length)];
initializeWordDisplay(word);

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

    // Assuming 'Hands' and 'ControlPanel' are properly defined or imported
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

    await initializeCamera(video3, hands);

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

    setInterval(checkLetterMatch, 1000); // Check every second
}

function initializeWordDisplay(word) {
    // Select the element where the word will be displayed
    const wordInProgressElement = document.getElementById("wordInProgress");

    // Create a string with an underscore for each letter in the word
    let displayString = "";
    for (let i = 0; i < word.length; i++) {
        displayString += "_ ";
    }

    // Update the content of the element to show the underscores
    wordInProgressElement.textContent = displayString.trim();
}

function updateWord(currentWord, matchedLetters) {
    // Convert the current word to uppercase to match the case of guessed letters
    currentWord = currentWord.toUpperCase();

    // Initialize an array to hold the display characters (letters or underscores)
    let displayCharacters = [];

    // Loop through each letter in the current word
    for (let letter of currentWord) {
        // If the letter has been guessed, add it to the display array
        // Otherwise, add an underscore as a placeholder
        if (matchedLetters.includes(letter)) {
            displayCharacters.push(letter);
        } else {
            displayCharacters.push('_');
        }
    }

    // Join the array into a string, with spaces between characters for readability
    let displayString = displayCharacters.join(' ');

    // Find the element where the word is displayed and update its text content
    let wordInProgressElement = document.getElementById('wordInProgress');
    wordInProgressElement.textContent = displayString;
}

function checkLetterMatch() {
    if (currentWordIndex >= wordsToSpell.length) {
        console.log('Congratulations! All words spelled.');
        return; // Game completed
    }

    const currentWord = wordsToSpell[currentWordIndex];
    const currentLetter = currentWord[currentLetterIndex].toUpperCase();
    const letterTemplate = aslStaticAlphabet[currentLetter];

    if (!letterTemplate) {
        console.error(`No template found for letter ${currentLetter}`);
        return;
    }

    const landmarks = getLatestCoordinates();
    const isMatch = compareLandmarksToTemplates(landmarks, aslStaticAlphabet);

    if (isMatch.success) {
        if (!matchedLetters.includes(isMatch.letter)) {
            matchedLetters.push(isMatch.letter);
        }
        updateWord(currentWord, matchedLetters); // Assuming this updates the display

        // Check if all letters in the current word have been guessed
        const allLettersGuessed = currentWord.split('').every(letter => matchedLetters.includes(letter));

        if (allLettersGuessed) {
            console.log(`Word completed: ${currentWord}`);
            currentWordIndex++; // Move to the next word
            matchedLetters = []; // Reset matched letters for the new word
            ++guessedWords;

            // Check if there are more words to spell
            if (currentWordIndex < wordsToSpell.length) {
                console.log(`Next word: ${wordsToSpell[currentWordIndex]}`);
                document.getElementById('Score').innerHTML = "You Have Guessed " + guessedWords + " Words!";
                // Update the game display for the new word here
                updateWord(wordsToSpell[currentWordIndex], matchedLetters);
            } else {
                console.log('Congratulations! All words spelled.');
                document.getElementById('Score').innerHTML = "You Have Guessed " + guessedWords + " Words! That's all we Have Now!";
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    setupAndStart().catch(console.error);

    document.getElementById('saveBtn').addEventListener('click', function () {
        saveCoordinates(getLatestCoordinates(), true);
    });

    document.getElementById('toggleRecordingBtn').addEventListener('click', toggleRecording);
});
