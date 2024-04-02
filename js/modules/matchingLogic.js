// matchingLogic.js
import aslStaticAlphabet from './aslStaticAlphabet.js';

// Helper function to calculate Euclidean distance between two points
function euclideanDistance(point1, point2) {
  const xDiff = point1.x - point2.x;
  const yDiff = point1.y - point2.y;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

function checkDynamicLetter(landmarks, template) {
  // DTW
  return true;
}

// Function to calculate the total distance difference between all corresponding points
function calculateTotalDistanceDifference(landmarks1, landmarks2) {
  return landmarks1.reduce((acc, curr, index) => {
      return acc + euclideanDistance(curr, landmarks2[index]);
  }, 0);
}

export function compareLandmarksToTemplate(landmarks, template) {
  // Ensure landmarks and template are arrays of points {x, y}
  if (!landmarks || !template || landmarks.length !== template.length) {
      console.error("Landmarks and template are not compatible.");
      return false;
  }
  if (isDynamic) {
    return checkDynamicLetter(landmarks, template);
  } else {
    // Existing logic for static letter comparison
    const difference = calculateTotalDistanceDifference(landmarks, template);
    const threshold = 3;
    console.log(difference)
    console.log(difference < threshold)
    return difference < threshold;
  }
}

