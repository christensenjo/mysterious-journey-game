//--------Canvas setup--------
const canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .80;
const ctx = canvas.getContext("2d");

//--------Game objects--------
const playerAvatar = new Image();
playerAvatar.src = "assets/avatar1.png";

const player = {
    x: 100,
    y: canvas.height / 2,
    width: 50,
    height: 100,
    draw: function() {
        ctx.drawImage(playerAvatar, this.x, this.y, this.width, this.height); // Use the player avatar image
    },
    update: function() {
        if (!gameStarted || gameOver) return;
        
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
        }
    },
};


const background = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    speed: 2, // Set to 0 to pause manually, 2 for normal speed
    draw: function() {
        ctx.drawImage(backgroundImage, this.x1, this.y, this.width, this.height);
        ctx.drawImage(backgroundImage, this.x2, this.y, this.width, this.height);
    },
    update: function() {
        if (!gameStarted || gameOver) return;

        this.x1 -= this.speed;
        this.x2 -= this.speed;

        if (this.x1 <= -canvas.width) {
            this.x1 = canvas.width;
        }

        if (this.x2 <= -canvas.width) {
            this.x2 = canvas.width;
        }
    }
};
const backgroundImage = new Image();
backgroundImage.src = "assets/background1.png";

//--------Obstacles--------
let obstacles = [];
const obstacleImage = new Image();
obstacleImage.src = "assets/spirit1.png";

function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 100) + 50, // Random position between 50 and canvas.height - 50
        width: 60,
        height: 100,
        speed: 2, // Set to 0 to pause manually, 2 for normal speed
        draw: function() {
            ctx.drawImage(obstacleImage, this.x, this.y, this.width, this.height); // Use the obstacle image
        },
        update: function() {
            if (!gameStarted || gameOver) return;

            this.x -= this.speed;
        }
    };

    obstacles.push(obstacle);
}


//--------Game Object Logic--------
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function checkCollisions() {
    for (const obstacle of obstacles) {
        if (isColliding(player, obstacle)) {
            // Handle collision, e.g., stop the game or restart it
            console.log("Game Over");
            gameOver = true;
        }
    }
}

function removeOffscreenObstacles() {
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function updateObstacles() {
    if (!gameStarted) return;
    for (const obstacle of obstacles) {
        obstacle.update();
    }
}

function drawObstacles() {
    for (const obstacle of obstacles) {
        obstacle.draw();
    }
}


//--------Game Updates and Rendering--------
function updateGameState() {
    background.update();
    player.update();
    updateObstacles();
    removeOffscreenObstacles();
    checkCollisions();
}

function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw();
    player.draw();
    drawObstacles();
}

function gameLoop() {
    updateGameState();
    renderGame();
    if (!gameStarted || gameOver) {
        drawMenu();
    }
    requestId = requestAnimationFrame(gameLoop);
}

function resetGameState() {
    // Reset gameOver flag
    gameOver = false;

    // Reset player position
    player.y = canvas.height / 2;

    // Clear obstacles
    obstacles = [];

    // Cancel the previous game loop
    cancelAnimationFrame(requestId);

    // Restart the game loop
    gameLoop();
}


//--------Menu--------
function drawMenu() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "48px Arial";
    ctx.fillStyle = "#FCFCFF";
    ctx.textAlign = "center";
    ctx.fillText("Mysterious Journey", canvas.width / 2, canvas.height / 3);

    ctx.font = "24px Arial";
    ctx.fillText("Press Enter to Start", canvas.width / 2, canvas.height / 2);

    ctx.font = "16px Arial";
    ctx.fillStyle = "#FCFCFF";
    ctx.fillText("Use arrow keys to move up and down. Don't get hit!", canvas.width / 2, canvas.height * 2 / 3);

    ctx.font = "16px Arial";
    ctx.fillStyle = "#FCFCFF";
    ctx.fillText("Built by Joel Christensen with GPT-4", canvas.width / 2, canvas.height * 3 / 4);
}

//--------Event Listeners--------
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "w") {
        // Move the player up
        player.y -= 15;
    }
    if (e.key === "ArrowDown" || e.key === "s") {
        // Move the player down
        player.y += 15;
    }

    if (e.key === "Enter") {
        if (!gameStarted) {
            // Start the game
            gameStarted = true;
        } else if (gameOver) {
            // Restart the game
            resetGameState();
        }
    }
});

canvas.addEventListener("click", (e) => {
    if (!gameStarted) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const textX = canvas.width / 2;
        const textY = canvas.height * 3 / 4;

        if (x >= textX - 120 && x <= textX + 120 && y >= textY - 20 && y <= textY + 10) {
            window.open("http://joelbc-design.web.app", "_blank");
        }
    }
});

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const textX = canvas.width / 2;
    const textY = canvas.height * 3 / 4;

    if (!gameStarted && x >= textX - 120 && x <= textX + 120 && y >= textY - 20 && y <= textY + 10) {
        canvas.style.cursor = "pointer";
    } else {
        canvas.style.cursor = "default";
    }
});

window.addEventListener("keyup", (e) => {
    // You can add additional logic here if needed, like stopping the player's movement
});


//--------Game Initialization--------
let gameOver = false;
let gameStarted = false;
let speedMultiplier = 1;
// Create obstacles at regular intervals
setInterval(createObstacle, 3000);
// Run the game
gameLoop();