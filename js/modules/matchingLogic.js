// matchingLogic.js
/**
 * Contains logic for comparing landmarks to predefined templates to identify gestures.
 * - Functions are provided to calculate Euclidean distances and assess if landmarks match certain gesture templates.
 * - This supports both detailed comparison and overall gesture recognition based on predefined thresholds.
 */

// Helper function to calculate Euclidean distance between two points
function euclideanDistance(point1, point2) {
  const xDiff = point1.x - point2.x;
  const yDiff = point1.y - point2.y;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
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
  else {
    // Existing logic for static letter comparison
    const difference = calculateTotalDistanceDifference(landmarks, template);
    const threshold = 10;
    console.log(difference)
    console.log(difference < threshold)
    return difference < threshold;
  }
}

function compareLandmarksToTemplateDetailed(landmarks, template) {
  const landmarkCorrectness = landmarks.map((landmark, index) => {
    const distance = euclideanDistance(landmark, template[index]);
    const threshold = 1.5;
    //console.log(index, distance)
    //console.log(index, distance < threshold)
    return distance < threshold;
  });
  return landmarkCorrectness;
}

export function compareLandmarksToTemplates(landmarks, templates) {
  // Ensure landmarks is an array of points {x, y}
  if (!landmarks || !templates || Object.keys(templates).length === 0) {
    console.error("Landmarks or templates are not properly defined.");
    return { success: false, letter: null };
  }

  const threshold = 10; // Define the threshold for a match

  // Iterate through each template (letter) in the templates object
  for (const letter in templates) {
    const template = templates[letter]; // Access the array of points for the current letter

    if (landmarks.length !== template.length) {
      continue; // Skip to the next template if the sizes don't match
    }

    const difference = calculateTotalDistanceDifference(landmarks, template);

    // Check if the difference is within the acceptable threshold
    if (difference < threshold) {
      console.log(`Template match found for letter ${letter} with a difference of ${difference}`);
      return { success: true, letter: letter }; // Match found, exit the function
    }
  }

  // If no templates match
  console.log("No template matches found.");
  return { success: false, letter: null };
}

export { compareLandmarksToTemplateDetailed };