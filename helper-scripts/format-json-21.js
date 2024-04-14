// Assuming you are using Node.js to read the JSON file
const fs = require('fs');

// Function to read and process JSON file
function processJsonFile(filePath) {
  // Read the file synchronously
  const rawData = fs.readFileSync(filePath);
  const jsonData = JSON.parse(rawData);

  // // Process the data to match the desired format
  // const formattedData = jsonData.map(templateSequence => {
  //   return templateSequence.map(point => {
  //     return { x: point.x, y: point.y };
  //   });
  // });

  // Removed the outer map function call
  const formattedData = jsonData.map(point => {
    return { x: parseFloat(point.x), y: parseFloat(point.y) };
  });

  return formattedData;
}
console.log(`Current directory: ${process.cwd()}`);
// pass json
const filePath = 'templates/static-left/y.json';
const processedData = processJsonFile(filePath);
console.log(processedData);

