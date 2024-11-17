// Dohvat canvas elementa, konteksta i gumba za ponovno pokretanje
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");

// Postavljanje dimenzija canvas-a na fiksnu veličinu
canvas.width = 790;
canvas.height = 860;

// Inicijalne postavke igre
const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 3 + 3 * (Math.random() * 2 - 1); // Nasumična brzina X
let ballSpeedY = -3 * (2 + Math.random() * 2 -1); // Početna brzina Y

const paddleHeight = 15;
const paddleWidth = 180;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Postavke dimenzija cigli
const brickHeight = 15;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 10;
const brickColumnCount = 10;
const brickWidth = Math.floor((canvas.width - brickOffsetLeft * 2 - (brickColumnCount - 1) * brickPadding) / brickColumnCount);
const brickRowCount = 5;

// Kreiranje cigli kao niz objekata
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver = false;

// Funkcija za prikaz bodova
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "right";
    ctx.fillText("Bodovi: " + score, canvas.width - 220, 20);
    ctx.fillText("Najbolji rezultat: " + highScore, canvas.width - 20, 20);
}

// Funkcija za crtanje lopte s dodanim sjenčanjem
function drawBall() {
    // Kreiranje radijalnog gradijenta
    let gradient = ctx.createRadialGradient(
        ballX - ballRadius / 3, // Manji pomak prema gornjem lijevom kutu za svjetliju boju
        ballY - ballRadius / 3,
        ballRadius / 6, // Manji unutarnji polumjer
        ballX,
        ballY,
        ballRadius // Vanjski polumjer gradijenta
    );

    // Definiraj boje gradijenta
    gradient.addColorStop(0, "#9dff9d");    // Svjetlija boja u središtu
    gradient.addColorStop(0.4, "#00ff00");  // Glavna crvena boja
    gradient.addColorStop(1, "#009d00");    // Tamnija boja na rubovima

    // Crtanje loptice
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient; // Primjena gradijenta
    ctx.fill();
    ctx.closePath();
}


function drawPaddle() {
    // Dimenzije i koordinate vrhova palice
    let x = paddleX;
    let y = canvas.height - paddleHeight;
    let width = paddleWidth;
    let height = paddleHeight;

    // Boje za bojanje palice
    const darkerColor = "#bf0000"; // Tamnija crvena
    const lighterColor = "#ff5959"; // Svjetlija crvena
    const mainColor = "#ff0000"; // Glavna boja

    // Tamnija strana (desna i donja)
    ctx.fillStyle = darkerColor;
    ctx.beginPath();
    ctx.moveTo(x, y + height); 
    ctx.lineTo(x + width, y + height); 
    ctx.lineTo(x + width, y); 
    ctx.lineTo(x + width - 5, y + 5); 
    ctx.lineTo(x + width - 5, y + height - 5); 
    ctx.lineTo(x + 5, y + height - 5); 
    ctx.closePath();
    ctx.fill();

    // Svjetlija strana (gornja i lijeva)
    ctx.fillStyle = lighterColor;
    ctx.beginPath();
    ctx.moveTo(x, y); 
    ctx.lineTo(x + width, y); 
    ctx.lineTo(x + width - 5, y + 5); 
    ctx.lineTo(x + 5, y + 5); 
    ctx.lineTo(x + 5, y + height - 5); 
    ctx.lineTo(x, y + height);  
    ctx.closePath();
    ctx.fill();

    // Glavna boja sredine palice
    ctx.fillStyle = mainColor;
    ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
}


// Funkcija za crtanje cigli s dodanim sjenčanjem
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                // Definiraj boje
                const darkerColor = "#006fa6"; // Tamnija plava boja
                const lighterColor = "#00b0f0"; // Svjetlija plava boja
                const mainColor = "#0095DD"; // Glavna plava boja

                // Tamnija strana (desna i donja)
                ctx.fillStyle = darkerColor;
                ctx.beginPath();
                ctx.moveTo(brickX, brickY + brickHeight); 
                ctx.lineTo(brickX + brickWidth, brickY + brickHeight); 
                ctx.lineTo(brickX + brickWidth, brickY); 
                ctx.lineTo(brickX + brickWidth - 5, brickY + 5); 
                ctx.lineTo(brickX + brickWidth - 5, brickY + brickHeight - 5); 
                ctx.lineTo(brickX + 5, brickY + brickHeight - 5); 
                ctx.closePath();
                ctx.fill();

                // Svjetlija strana (gornja i lijeva)
                ctx.fillStyle = lighterColor;
                ctx.beginPath();
                ctx.moveTo(brickX, brickY); 
                ctx.lineTo(brickX + brickWidth, brickY); 
                ctx.lineTo(brickX + brickWidth - 5, brickY + 5); 
                ctx.lineTo(brickX + 5, brickY + 5); 
                ctx.lineTo(brickX + 5, brickY + brickHeight - 5); 
                ctx.lineTo(brickX, brickY + brickHeight);  
                ctx.closePath();
                ctx.fill();

                // Glavna boja sredine cigle
                ctx.fillStyle = mainColor;
                ctx.fillRect(brickX + 5, brickY + 5, brickWidth - 10, brickHeight - 10);

                // Dodaj sjenčanje cigli
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;
                ctx.shadowBlur = 5;

                ctx.closePath();
            }
        }
    }
}



function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                const brickLeft = b.x;
                const brickRight = b.x + brickWidth;
                const brickTop = b.y;
                const brickBottom = b.y + brickHeight;

                // Provjera je li lopta u kontaktu s ciglom
                if (ballX + ballRadius > brickLeft && ballX - ballRadius < brickRight &&
                    ballY + ballRadius > brickTop && ballY - ballRadius < brickBottom) {

                    // Provjera je li lopta udarila iz određenog smjera
                    const ballFromLeft = ballX < brickLeft && ballSpeedX > 0;
                    const ballFromRight = ballX > brickRight && ballSpeedX < 0;
                    const ballFromTop = ballY < brickTop && ballSpeedY > 0;
                    const ballFromBottom = ballY > brickBottom && ballSpeedY < 0;

                    // Slučaj kada lopta udari iz lijevog ili desnog smjera
                    if (ballFromLeft || ballFromRight) {
                        ballSpeedX = -ballSpeedX; // Promjena smjera po X osi
                    } 
                    // Slučaj kada lopta udari iz gornje ili donje strane
                    else if (ballFromTop || ballFromBottom) {
                        ballSpeedY = -ballSpeedY; // Promjena smjera po Y osi
                    } else {
                        // Ako lopta dođe iz dijagonale ili izravan sudar, možeš dodatno podesiti smjer
                        if (ballY + ballRadius > brickTop && ballY - ballRadius < brickBottom) {
                            ballSpeedY = -ballSpeedY;
                        } 
                        if (ballX + ballRadius > brickLeft && ballX - ballRadius < brickRight) {
                            ballSpeedX = -ballSpeedX;
                        }
                    }

                    // Oznaka cigle kao uništene
                    b.status = 0;
                    score++;

                    if (score === brickRowCount * brickColumnCount) {
                        endGame("YOU WIN!");
                    }
                }
            }
        }
    }
}


// Funkcija za povećanje brzine lopte
function increaseBallSpeed() {
    const maxSpeed = 4;
    if (Math.abs(ballSpeedX) < maxSpeed) ballSpeedX *= 1.05;
    if (Math.abs(ballSpeedY) < maxSpeed) ballSpeedY *= 1.05;
}

// Funkcije za pritiske tipki
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

// Ažuriranje pozicija palice
function updatePaddlePosition() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 6;
    else if (leftPressed && paddleX > 0) paddleX -= 6;
}

// Funkcija za ažuriranje pozicije lopte
function updateBallPosition() {
    if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballSpeedY < ballRadius) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY + ballSpeedY > canvas.height - ballRadius - paddleHeight) {
        // Provjera kolizije s palicom (sada s ispravnim pomakom)
        const paddleY = canvas.height - paddleHeight - 20;
        if (ballX > paddleX && ballX < paddleX + paddleWidth /*&& ballY + ballRadius > paddleY*/) {
            // Prilagodba smjera lopte nakon udarca o palicu
            let distFromCenter = ballX - (paddleX + paddleWidth / 2);
            let angle = distFromCenter / (paddleWidth / 2);
            let speed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2);

            ballSpeedX = angle * speed;
            ballSpeedY = -Math.abs(ballSpeedY);

            increaseBallSpeed();
        } else {
            endGame("GAME OVER");
        }
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

// Funkcija za završetak igre
function endGame(message) {
    gameOver = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Povećana veličina fonta za 'GAME OVER' poruku
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";  // Veći font za 'GAME OVER'
    ctx.textAlign = "center"; // Centrirano poravnavanje
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 50); // Pomaknite 'GAME OVER' poruku prema gore

    highScore = Math.max(score, highScore);
    localStorage.setItem("highScore", highScore);
    
    // Prikazivanje gumba za ponovno pokretanje i pomicanje prema dolje
    restartButton.style.display = "block";
    restartButton.style.top = "60%";  // Spustite gumb niže
}


// Funkcija za ponovno pokretanje igre
function restartGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballSpeedX = 2.5 * (Math.random() * 2 - 1);
    ballSpeedY = -2.5;
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
    gameOver = false;
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    restartButton.style.display = "none";
    draw();
}

// Glavna funkcija za crtanje
function draw() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
    updatePaddlePosition();
    updateBallPosition();

    requestAnimationFrame(draw);
}

// Event listeneri za tipke
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Klik za ponovno pokretanje igre
restartButton.addEventListener("click", restartGame);

// Početno crtanje
draw();
