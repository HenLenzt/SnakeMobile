// script.js

// Einstellungen
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

// Steuerungselemente
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

let canvasSize = Math.min(window.innerWidth * 0.9, 400);
canvas.width = canvasSize;
canvas.height = canvasSize;

const grid = canvas.width / 20; // 20x20 Grid
let snake = {
    x: grid * 8,
    y: grid * 8,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};
let apple = {
    x: grid * 16,
    y: grid * 16
};
let score = 0;

// Zufällige Position für den Apfel generieren
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Spiel-Schleife
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Schlange bewegen
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Schlange kann durch den Bildschirm gehen
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // Schlange-Array aktualisieren
    snake.cells.unshift({x: snake.x, y: snake.y});

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Apfel zeichnen
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Schlange zeichnen
    ctx.fillStyle = 'green';
    snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // Kollision mit sich selbst
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                gameOver();
            }
        }

        // Apfel fressen
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score += 10;
            scoreElement.textContent = score;
            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;

            // Geschwindigkeit erhöhen (optional)
            increaseSpeed();
        }
    });
}

// Spiel beenden
function gameOver() {
    gameOverElement.style.display = 'block';
    clearInterval(gameLoop); // Stoppt das Spiel
    // Optional: Spiel zurücksetzen oder Seite neu laden
}

// Tastensteuerung
document.addEventListener('keydown', function(e) {
    handleDirectionChange(e.key);
});

// On-Screen-Buttons Steuerung
upBtn.addEventListener('click', () => handleDirectionChange('ArrowUp'));
downBtn.addEventListener('click', () => handleDirectionChange('ArrowDown'));
leftBtn.addEventListener('click', () => handleDirectionChange('ArrowLeft'));
rightBtn.addEventListener('click', () => handleDirectionChange('ArrowRight'));

// Funktion zur Richtungsänderung
function handleDirectionChange(key) {
    if (key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
}

// Spiel zurücksetzen
function resetGame() {
    snake.x = grid * 8;
    snake.y = grid * 8;
    snake.dx = grid;
    snake.dy = 0;
    snake.cells = [];
    snake.maxCells = 4;

    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;

    score = 0;
    scoreElement.textContent = score;

    gameOverElement.style.display = 'none';

    gameLoop = setInterval(loop, gameSpeed);
}

// Ereignis zum Neustarten des Spiels mit Enter-Taste
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && gameOverElement.style.display === 'block') {
        resetGame();
    }
});

// Setze die Spielgeschwindigkeit
let gameSpeed = 100; // in Millisekunden (z.B. 100 ms = 10 Bewegungen pro Sekunde)
let gameLoop = setInterval(loop, gameSpeed);

// Funktion zur Geschwindigkeitserhöhung (optional)
function increaseSpeed() {
    if (gameSpeed > 50) { // Mindestgeschwindigkeit: 50 ms
        gameSpeed -= 5; // Erhöhe die Geschwindigkeit
        clearInterval(gameLoop);
        gameLoop = setInterval(loop, gameSpeed);
        console.log(`Geschwindigkeit erhöht: ${gameSpeed} ms`);
    }
}