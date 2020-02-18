## pSolve
pSolve (puzzle solver) is a cross-platform computer vision assisted puzzle solving application.
The idea is to create an application that can solve puzzles (such as sudokus) from simple image input.


pSolve is my final year project and as such is **a work in progress**, more puzzles and in-depth testcases will be added at a later stage.

### Early Demo

Below is an example of sudoku solving where the client captures an image of an unsolved sudoku. The server solves the sudoku and the client displays the solution. In this case no OCR correction was needed on the client.

![](https://media.giphy.com/media/ibp9jG9jBfFLNhy8z2/giphy.gif)

### Supported Puzzles
- Sudoku
- Word Search
- Spot The Difference
- Tic-Tac-Toe
- \+ more coming soon

### Client *(React Native / Expo / JavaScript)*
The client is developed for both iOS and Android simultaneously using [React Native](https://facebook.github.io/react-native/) and [Expo](https://expo.io/). 
The client deals with image capturing and uploading, OCR correction, and displaying puzzle solutions.

- /0_Client/
- Puzzle code in 0_Client/puzzles/

### Server *(Python)*
The server is developed using Python, making use of [Flask](https://palletsprojects.com/p/flask/) and [OpenCV](https://opencv.org/). 
The server implements an API, allowing easy client-server communication.
The server deals with image processing, OCR, and solving logic.
Docker is used for continuous deployment (making use of DockerHub's [automated builds](https://docs.docker.com/docker-hub/builds/)).

- /1_Server/
- server.py is the main file (Flask server/API), it imports everything else
- image_processing.py contains re-usable functions that are called from most puzzle files in /1_Server/psolve/

### DockerFile
- /1_Server/Dockerfile
- Used for continuous integration using DockerHub's [automated builds](https://docs.docker.com/docker-hub/builds/)

### General Process
  1. Client captures an image or uploads from camera roll
  2. Server detects the puzzle and its digits/values
  3. Client corrects any misidentified digits/values if required
  4. Server solves the puzzle
  5. Client displays solution (which can be saved to camera roll)
