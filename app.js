var boxes = document.querySelectorAll(".box");
var resetBtn = document.querySelector("#reset");
var playAgainBtn = document.querySelector("#playAgain");
var infoSpan = document.querySelector(".info");
var startGameBtn = document.querySelector("#startGame");
var fullscreenOverlay = document.querySelector(".fullscreen-overlay");
var gameContainer = document.querySelector(".gameContainer");
var turnO = true; // Track whose turn it is
var count = 0; // Track the number of moves
var turnMusic = new Audio("music/ting.mp3"); // Music for each turn
var gameOver = new Audio("music/gameover.mp3"); // Music when the game ends
var bgMusic = new Audio("music/music.mp3"); // Background music
var gameActive = true; // Flag to track if the game is active

// Play background music in a loop
bgMusic.loop = true;

// Function to toggle background music
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        localStorage.setItem("bgMusicPlaying", "true");
    } else {
        bgMusic.pause();
        localStorage.setItem("bgMusicPlaying", "false");
    }
}

// Function to start background music with a user interaction
function startMusic() {
    if (localStorage.getItem("bgMusicPlaying") === "true") {
        bgMusic.play().catch(function(error) {
            console.log("Autoplay was prevented, music will start on interaction.");
        });
    }
}

// Function to reset the game
function resetGame() {
    turnO = true;
    count = 0;
    gameActive = true; // Reset game status to active
    enableBoxes();
    infoSpan.innerText = "Turn for X";
    clearAnimations();
}

// Function to disable all boxes
function disableBoxes() {
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].disabled = true;
    }
}

// Function to enable all boxes and clear their text
function enableBoxes() {
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].disabled = false;
        boxes[i].innerText = "";
        boxes[i].classList.remove('winAnimation', 'drawAnimation');
    }
}

// Function to display the winner and disable all boxes
function showWinner(winner) {
    Swal.fire({
        title: `Congratulations, Winner is ${winner}`,
        imageUrl: "images/excited.gif",
        imageHeight: 100,
        imageAlt: "A tall image"
    }).then(function() {
        if (gameActive) {
            gameOver.play(); // Play the game over sound if the game is active
        }
        gameActive = false; // Set game status to inactive
        disableBoxes(); // Disable all boxes
    });
}

// Function to handle a draw and disable all boxes
function gameDraw() {
    Swal.fire(infoSpan.innerText = "Game was Draw.");
    if (gameActive) {
        gameOver.play(); // Play the game over sound if the game is active
    }
    gameActive = false; // Set game status to inactive
    disableBoxes(); // Disable all boxes
    animateDraw(); // Add draw animation
   
}

// Function to check for a winner
function checkWinner() {
    var winnerPattern = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8]
    ];
    for (var i = 0; i < winnerPattern.length; i++) {
        var pattern = winnerPattern[i];
        var posval1 = boxes[pattern[0]].innerText;
        var posval2 = boxes[pattern[1]].innerText;
        var posval3 = boxes[pattern[2]].innerText;
        if (posval1 !== "" && posval1 === posval2 && posval2 === posval3) {
            showWinner(posval1);
            highlightWinningBoxes(pattern); // Highlight the winning pattern
            return true; // Return true when a winner is found
        }
    }
    return false; // Return false if no winner is found
}

// Function to highlight the winning boxes
function highlightWinningBoxes(pattern) {
    for (var i = 0; i < pattern.length; i++) {
        boxes[pattern[i]].classList.add('winAnimation');
    }
}

// Function to animate draw
function animateDraw() {
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].classList.add('drawAnimation');
    }
}

// Function to clear animations
function clearAnimations() {
    for (var i = 0; i < boxes.length; i++) {
        boxes[i].classList.remove('winAnimation', 'drawAnimation');
    }
}

// Add event listeners to each box
for (var i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('click', function () {
        if (this.innerText === "" && gameActive) { // Check if the box is empty and the game is active
            if (turnO) {
                this.innerText = "O";
                infoSpan.innerText = "Turn for X";
                turnO = false; // Change turn
            } else {
                this.innerText = "X";
                infoSpan.innerText = "Turn for O";
                turnO = true; // Change turn
            }
            this.disabled = true; // Disable the clicked box
            count++;
            turnMusic.play(); // Play turn sound
            
            // Check for a winner or a draw
            if (checkWinner()) {
                // Winner already handled in checkWinner
            } else if (count === 9) {
                gameDraw(); // Call gameDraw if the board is full and no winner
            }
        }
    });
}

// Add event listener to reset button
resetBtn.addEventListener('click', resetGame);

// Add event listener to play again button
playAgainBtn.addEventListener('click', resetGame);

// Add event listener to start game button
startGameBtn.addEventListener('click', function() {
    fullscreenOverlay.style.display = 'none'; // Hide the overlay
    gameContainer.style.display = 'flex'; // Show the game container
    bgMusic.play().catch(function(error) {
        console.log("Background music could not be played:", error);
    });
});

// Start the music with user interaction
document.addEventListener("click", startMusic, { once: true });

// Initialize the game
resetGame();
