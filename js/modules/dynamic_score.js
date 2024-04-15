/**
 * This module defines functions to score gestures using the Dynamic Time Warping algorithm.
 * - It includes utilities to normalize gesture data and calculate distances between gestures.
 * - The main function, scoreGesture, computes a similarity score between two gesture sequences to support gesture recognition.
 */

import DynamicTimeWarping from './dynamic-time-warping.mjs';

// Distence function 
function euclideanDistance(vector1, vector2) {
  if (vector1.length !== vector2.length) {
      throw new Error('Vectors must have the same dimension');
  }

  let sum = 0;
  for (let i = 0; i < vector1.length; i++) {
      sum += Math.pow(vector1[i] - vector2[i], 2);
  }
  return Math.sqrt(sum);
}

// Normalize data 
// function prepareSignature(data) {
//   var xMean = 0;
//   var yMean = 0;
//   var diffData = [];
//   for (var i = 0; i < data.length; i++) {
//       xMean = xMean + data[i][0];
//       yMean = yMean + data[i][1];
//   }
//   xMean = xMean / data.length;
//   yMean = yMean / data.length;
//   for (var i = 0; i < data.length; i++) {
//       diffData[i] = [data[i][0] - xMean, data[i][1] - yMean];
//   }
//   return diffData;
// }

function prepareSignature(data) {
  var xMean = 0;
  var yMean = 0;
  var diffData = [];

  if (data.length === 0) {
      return diffData; // Return empty array if no data
  }

  data.forEach(point => {
      xMean += point.x;
      yMean += point.y;
  });
  xMean /= data.length;
  yMean /= data.length;


  data.forEach(point => {
      const normalizedX = point.x - xMean;
      const normalizedY = point.y - yMean;

      // Check if the normalized values are NaN and exclude them if so
      if (!isNaN(normalizedX) && !isNaN(normalizedY)) {
        diffData.push([normalizedX, normalizedY]);
      }
  });
  return diffData;
}

// Use this function to check gestures 
// Start by picking some key point i.e. index finger for Z 
// Index_Finger_Tip (8)
// Pinky Tip (20)
function scoreGesture(target_seq, stream_seq){
  var norm_target_seq = prepareSignature(target_seq)
  var norm_stream_seq = prepareSignature(stream_seq)

  var dtw = new DynamicTimeWarping(norm_target_seq, norm_stream_seq, euclideanDistance);

  return dtw.getDistance(); // I suggest trying dist < 30 -> pass

}

// Read JSON data and calculate the gesture score
function processGestureData(file1, file2) {
  const data1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
  const data2 = JSON.parse(fs.readFileSync(file2, 'utf8'));
  
  const score = scoreGesture(data1, data2);
  console.log(`Gesture Score: ${score}`);
}

// // Tests
// const rand_file1 = path.join(__dirname, '../../templates/dynamic-right/random1.json');
// const rand_file2 = path.join(__dirname, '../../templates/dynamic-right/random2.json');

// // Z test with two Z templates
// const z_file1 = path.join(__dirname, '../../templates/dynamic-right/Z-index1.json');
// const z_file2 = path.join(__dirname, '../../templates/dynamic-right/Z-index2.json');
// console.log("Z template Match")
// processGestureData(z_file1, z_file2);

// // Z tests with two random templates
// console.log("randoms for Z")
// processGestureData(z_file1, rand_file1)
// processGestureData(z_file2, rand_file1)
// processGestureData(z_file1, rand_file2)
// processGestureData(z_file2, rand_file2)


// // J test with two J templates
// const j_file1 = path.join(__dirname, '../../templates/dynamic-right/J-pinky1.json');
// const j_file2 = path.join(__dirname, '../../templates/dynamic-right/J-pinky2.json');
// console.log("J Template MAtch")
// processGestureData(j_file1, j_file2);

// // J tests with random templates
// console.log("randoms for J")
// processGestureData(j_file1, rand_file1);
// processGestureData(j_file2, rand_file1);
// processGestureData(j_file1, rand_file2);
// processGestureData(j_file2, rand_file2);

// // J to Z
// console.log("J to Z")
// processGestureData(z_file1, j_file1)
// processGestureData(z_file2, j_file1)
// processGestureData(z_file1, j_file2)
// processGestureData(z_file2, j_file2)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// node js\modules\dynamic_score.js
// demo data 
// col -> time

// // f(x) = x^2
// var ser1 = [ [-1.  , -0.98, -0.96, -0.94, -0.92, -0.9 , -0.88, -0.86, -0.84,
//               -0.82, -0.8 , -0.78, -0.76, -0.74, -0.72, -0.7 , -0.68, -0.66,
//               -0.64, -0.62, -0.6 , -0.58, -0.56, -0.54, -0.52, -0.49, -0.47,
//               -0.45, -0.43, -0.41, -0.39, -0.37, -0.35, -0.33, -0.31, -0.29,
//               -0.27, -0.25, -0.23, -0.21, -0.19, -0.17, -0.15, -0.13, -0.11,
//               -0.09, -0.07, -0.05, -0.03, -0.01,  0.01,  0.03,  0.05,  0.07,
//               0.09,  0.11,  0.13,  0.15,  0.17,  0.19,  0.21,  0.23,  0.25,
//               0.27,  0.29,  0.31,  0.33,  0.35,  0.37,  0.39,  0.41,  0.43,
//               0.45,  0.47,  0.49,  0.52,  0.54,  0.56,  0.58,  0.6 ,  0.62,
//               0.64,  0.66,  0.68,  0.7 ,  0.72,  0.74,  0.76,  0.78,  0.8 ,
//               0.82,  0.84,  0.86,  0.88,  0.9 ,  0.92,  0.94,  0.96,  0.98,
//               1.  ],
//               [1.  , 0.96, 0.92, 0.88, 0.84, 0.81, 0.77, 0.74, 0.7 , 0.67, 0.64,
//                 0.6 , 0.57, 0.54, 0.51, 0.49, 0.46, 0.43, 0.4 , 0.38, 0.36, 0.33,
//                 0.31, 0.29, 0.27, 0.24, 0.23, 0.21, 0.19, 0.17, 0.16, 0.14, 0.12,
//                 0.11, 0.1 , 0.09, 0.07, 0.06, 0.05, 0.04, 0.04, 0.03, 0.02, 0.02,
//                 0.01, 0.01, 0.  , 0.  , 0.  , 0.  , 0.  , 0.  , 0.  , 0.  , 0.01,
//                 0.01, 0.02, 0.02, 0.03, 0.04, 0.04, 0.05, 0.06, 0.07, 0.09, 0.1 ,
//                 0.11, 0.12, 0.14, 0.16, 0.17, 0.19, 0.21, 0.23, 0.24, 0.27, 0.29,
//                 0.31, 0.33, 0.36, 0.38, 0.4 , 0.43, 0.46, 0.49, 0.51, 0.54, 0.57,
//                 0.6 , 0.64, 0.67, 0.7 , 0.74, 0.77, 0.81, 0.84, 0.88, 0.92, 0.96,
//                 1.  ] ];

// // f(x) = (x^2 + 0.5) / 2 
// var ser2 = [ [-1.  , -0.98, -0.96, -0.94, -0.92, -0.9 , -0.88, -0.86, -0.84,
//               -0.82, -0.8 , -0.78, -0.76, -0.74, -0.72, -0.7 , -0.68, -0.66,
//               -0.64, -0.62, -0.6 , -0.58, -0.56, -0.54, -0.52, -0.49, -0.47,
//               -0.45, -0.43, -0.41, -0.39, -0.37, -0.35, -0.33, -0.31, -0.29,
//               -0.27, -0.25, -0.23, -0.21, -0.19, -0.17, -0.15, -0.13, -0.11,
//               -0.09, -0.07, -0.05, -0.03, -0.01,  0.01,  0.03,  0.05,  0.07,
//               0.09,  0.11,  0.13,  0.15,  0.17,  0.19,  0.21,  0.23,  0.25,
//               0.27,  0.29,  0.31,  0.33,  0.35,  0.37,  0.39,  0.41,  0.43,
//               0.45,  0.47,  0.49,  0.52,  0.54,  0.56,  0.58,  0.6 ,  0.62,
//               0.64,  0.66,  0.68,  0.7 ,  0.72,  0.74,  0.76,  0.78,  0.8 ,
//               0.82,  0.84,  0.86,  0.88,  0.9 ,  0.92,  0.94,  0.96,  0.98,
//               1.  ],
//              [0.75, 0.73, 0.71, 0.69, 0.67, 0.65, 0.64, 0.62, 0.6 , 0.58, 0.57,
//               0.55, 0.54, 0.52, 0.51, 0.49, 0.48, 0.47, 0.45, 0.44, 0.43, 0.42,
//               0.4 , 0.39, 0.38, 0.37, 0.36, 0.35, 0.34, 0.34, 0.33, 0.32, 0.31,
//               0.31, 0.3 , 0.29, 0.29, 0.28, 0.28, 0.27, 0.27, 0.26, 0.26, 0.26,
//               0.26, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25,
//               0.26, 0.26, 0.26, 0.26, 0.27, 0.27, 0.28, 0.28, 0.29, 0.29, 0.3 ,
//               0.31, 0.31, 0.32, 0.33, 0.34, 0.34, 0.35, 0.36, 0.37, 0.38, 0.39,
//               0.4 , 0.42, 0.43, 0.44, 0.45, 0.47, 0.48, 0.49, 0.51, 0.52, 0.54,
//               0.55, 0.57, 0.58, 0.6 , 0.62, 0.64, 0.65, 0.67, 0.69, 0.71, 0.73,
//               0.75] ];

// var norm_ser1 = prepareSignature(ser1)
// var norm_ser2 = prepareSignature(ser2)

// var dtw = new DynamicTimeWarping(norm_ser1, norm_ser2, euclideanDistance);

// // 108
// var dist = dtw.getDistance();
// console.log(dist)

export { scoreGesture, euclideanDistance, prepareSignature };