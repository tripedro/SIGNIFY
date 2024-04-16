# SIGNIFY: Sign Language Guide & Interactive Framework

## Overview
SIGNIFY is a web-based learning tool designed to make learning American Sign Language (ASL) fingerspelling both efficient and engaging. Whether you're a beginner or have some familiarity with ASL, SIGNIFY offers structured learning and interactive gameplay to enhance your skills.

## Prerequisites
Ensure you have the latest version of [Node.js](https://nodejs.org/) installed on your computer. This project uses `npm` (Node Package Manager) to manage its dependencies.

## Getting Started
To get SIGNIFY running on your local machine, follow these steps:

### Step 1: Clone the Repository
Clone the project repository to your local machine using the following commands:
```bash
git clone https://your-repository-url.git
cd your-repository-name
```

### Step 2: Install Dependencies

Install all the necessary dependencies by running:
```bash
npm install
```
This command installs all the local dependencies listed in the package.json file.

### Step 3: Start the Development Server

Launch the development server by executing:
```bash
npm run start
```
This command compiles the application and serves it on a local web server. By default, the server runs at [http://127.0.0.1:8080](http://127.0.0.1:8080). Open this URL in your web browser to access the application.

### Step 4: Navigate the Application
Here’s how to get started with SIGNIFY once the application is running:

#### Initial Setup
- **Choose Your Preferred Hand:** Upon opening, a pop-up will ask which hand you prefer to use for fingerspelling. This customization enhances your learning experience.
- **Learning or Gaming:** Choose between learning mode and gaming mode. Learning mode is structured into three difficulty levels:
  - **Level 1:** Basic ASL alphabet fingerspelling
  - **Level 2:** More advanced fingerspelling techniques
  - **Level 3:** Includes dynamic signs like 'J' and 'Z'

#### Learning Mode
- **Webcam Access:** You will be prompted to allow webcam access. This is strictly for real-time gesture recognition and is not recorded or stored.
- **Interactive Learning:** Your webcam will display your image alongside a reference image for ASL signs. Spell out words shown on the screen by mimicking the gestures in the reference image. This real-time feedback helps you learn and correct your signs as you go.

#### Game Mode
- **Word Guessing Game:** After learning, test your skills with a word guessing game. This mode challenges you to use the letters you've learned to spell out words correctly. Currently, the game focuses on recognition of correct answers without penalization for wrong guesses.

### Repository Structure
Below is an outline and description of the main directories and files within the SIGNIFY project, designed to help you navigate and understand the setup:

- `/js` - Contains all JavaScript files necessary for the application logic and UI interaction.
  - `app.js` - Orchestrates the learning application logic, handling UI interactions and module coordination.
  - `gameApp1.js` - Manages the game aspect of the application, handling UI interactions and module coordination.
  - `/modules` - Modular JavaScript files for specific functionality:
    - `camera.js` - Manages webcam integration and video feed manipulation.
    - `dynamic_score.js` - Includes functions for scoring gestures using Dynamic Time Warping (DTW).
    - `ui.js` - Functions to manage user interface elements like displaying coordinates and managing recordings.
    - `hands.js` - Processes hand detection results and manages the rendering of hand landmarks on the UI.
    - `matchingLogic.js` - Contains functions to compare detected hand landmarks against known ASL sign templates.
    - `dynamic-time-warping.mjs` - Implements the DTW algorithm for gesture comparison.
- `/learn` - HTML files for the Learning section of the application, providing the user interface for the ASL learning module.
- `/game` - HTML files for the Game section of the application, where users can test their ASL knowledge in a fun and interactive way.
- `/pictures` - This directory contains visual aids for ASL learning:
  - Images showing left and right hand signs which are used as references in the learning module.
- `/templates` - JSON formatted templates for each ASL alphabet letter, accommodating both left and right-hand orientations.
- `/notebooks` - Jupyter notebooks used for developing and testing algorithms:
  - Includes notebooks for Dynamic Time Warping evaluation and coordinate analysis which are critical for enhancing gesture recognition accuracy.
- `/helper-scripts` - Scripts that assist in processing and setting up templates for the application:
  - These scripts are used for generating and refining gesture templates and are essential during the development phase of the project.

Feel free to explore these directories to better understand how SIGNIFY works.
