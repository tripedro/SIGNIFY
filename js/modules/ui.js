// ui.js
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
  spinner.style.display = 'none';
};

let latestCoordinates = []; // Store the latest raw coordinates

function displayCoordinates(handLandmarks) {
  const coordinatesDiv = document.getElementById('coordinates');
  coordinatesDiv.innerHTML = ''; // Clear previous coordinates

  handLandmarks.forEach((landmark, index) => {
    coordinatesDiv.innerHTML += `Point ${index}: (${landmark.x.toFixed(2)}, ${landmark.y.toFixed(2)})<br>`;
    latestCoordinates[index] = { x: landmark.x.toFixed(2), y: landmark.y.toFixed(2) }; // Update the latest raw coordinates
  });
}

function saveCoordinates() {
  if (latestCoordinates.length > 0) {
    let dataStr = latestCoordinates.map(point => `(${point.x}, ${point.y})`).join('\n');
    let blob = new Blob([dataStr], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.download = 'hand_coordinates.txt';
    link.href = url;
    link.click();
  } else {
    console.log('No coordinates to save.');
  }
}

export { displayCoordinates, saveCoordinates };
