// ui.js
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
  spinner.style.display = 'none';
};

let latestCoordinates = []; // Store the latest raw coordinates
let isRecording = false;
let recordedCoordinates = []; // List to store the coordinates

function toggleRecording() {
  isRecording = !isRecording;
  const toggleBtn = document.getElementById('toggleRecordingBtn'); // button in html

  if (isRecording) {
      console.log("Recording started");
      toggleBtn.textContent = 'Stop Recording'; // Change button text to "Stop Recording"
      recordedCoordinates = []; // Clear previous recordings
  } else {
      console.log("Recording stopped");
      toggleBtn.textContent = 'Start Recording'; // Change button text back to "Start Recording"
      saveCoordinates(recordedCoordinates); // Save the recorded data
  }
}

function recordCoordinates(handLandmarks) {
  if (!isRecording) return;
  
  const frameCoordinates = handLandmarks.map(landmark => ({ x: landmark.x, y: landmark.y }));
  recordedCoordinates.push(frameCoordinates); // Append the current frame's coordinates

  // Only record the pointer finger tip (index tip 8) (pinky tip 20)
  // if(handLandmarks.length > 8) {
  //     const tipOfPointerFinger = { x: handLandmarks[20].x, y: handLandmarks[20].y };
  //     recordedCoordinates.push(tipOfPointerFinger);
  // }
}

function displayCoordinates(handLandmarks) {
  // comments remove printed coords
  //const coordinatesDiv = document.getElementById('coordinates');
  //coordinatesDiv.innerHTML = ''; // Clear previous coordinates
  //const coordinatesDiv = document.getElementById('coordinates');
  //coordinatesDiv.innerHTML = ''; // Clear previous coordinates

  handLandmarks.forEach((landmark, index) => {
    //coordinatesDiv.innerHTML += `Point ${index}: (${landmark.x.toFixed(2)}, ${landmark.y.toFixed(2)})<br>`;
    //coordinatesDiv.innerHTML += `Point ${index}: (${landmark.x.toFixed(2)}, ${landmark.y.toFixed(2)})<br>`;
    latestCoordinates[index] = { x: landmark.x.toFixed(2), y: landmark.y.toFixed(2) }; // Update the latest raw coordinates
  });

  recordCoordinates(handLandmarks); // record landmarks, 
}

function saveCoordinates(coordinates, currentFrameOnly = false) {
  let dataToSave = coordinates;

  if (currentFrameOnly) {
    //dataToSave = latestCoordinates;
    dataToSave = [{ x: latestCoordinates[8].x, y: latestCoordinates[8].y }];
  }

  const jsonStr = JSON.stringify(dataToSave);
  let blob = new Blob([jsonStr], { type: 'application/json' });
  let url = URL.createObjectURL(blob);
  let link = document.createElement('a');

  // Setting the file name based on the context
  link.download = currentFrameOnly ? 'current_hand_coordinates.json' : 'recorded_hand_coordinates.json';
  link.href = url;
  link.click();
}

function displayWordWithHighlight(word, currentLetterIndex) {
  const wordDisplay = document.getElementById('wordDisplay'); // Ensure this element exists in your HTML
  wordDisplay.innerHTML = ''; // Clear previous word
  [...word].forEach((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter;
    if (index === currentLetterIndex) {
      span.style.color = 'red'; // Highlight the current letter
      span.style.fontWeight = 'bold';
    }
    wordDisplay.appendChild(span);
  });
}

function getLatestCoordinates() {
  return latestCoordinates;
}

export { displayCoordinates, saveCoordinates, displayWordWithHighlight, getLatestCoordinates, toggleRecording };
