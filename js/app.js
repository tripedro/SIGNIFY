// app.js in the superdirectory js/
import { saveCoordinates } from './modules/ui.js';
import { onResultsHands } from './modules/hands.js';
import { initializeCamera } from './modules/camera.js';

const video3 = document.getElementsByClassName('input_video3')[0];
const out3 = document.getElementsByClassName('output3')[0];
const controlsElement3 = document.getElementsByClassName('control3')[0];
const canvasCtx3 = out3.getContext('2d');

// Define `hands` at the top of your script to ensure it's accessible globally within this module
let hands;


document.addEventListener("DOMContentLoaded", (event) => {
    // Now initialize hands within a DOMContentLoaded event listener or after defining all necessary components
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
        new Slider({title: 'Min Detection Confidence', field: 'minDetectionConfidence', range: [0.5, 0.7], step: 0.01}),
        new Slider({title: 'Min Tracking Confidence', field: 'minTrackingConfidence', range: [0.5, 0.7], step: 0.01}),
    ])
    .on(options => {
        video3.classList.toggle('selfie', options.selfieMode);
        hands.setOptions(options);
    });

    document.getElementById('saveBtn').addEventListener('click', saveCoordinates);
});
