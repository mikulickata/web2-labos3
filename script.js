// Dohvat canvas elementa, konteksta i gumba za ponovno pokretanje
const canvas = document.getElementById("gameCanvas"); // Dohvaća canvas element iz HTML-a na temelju ID-a
const ctx = canvas.getContext("2d"); // Dobiva 2D kontekst za crtanje na canvasu
const restartButton = document.getElementById("restartButton"); // Dohvaća gumb za ponovno pokretanje igre iz HTML-a

// Postavljanje dimenzija canvas-a na fiksnu veličinu
canvas.width = 790; // Postavlja širinu canvas-a na 790 piksela
canvas.height = 860; // Postavlja visinu canvas-a na 860 piksela

// Inicijalne postavke igre
const ballRadius = 10; // Postavlja polumjer lopte na 10 piksela
let ballX = canvas.width / 2; // Postavlja početnu X poziciju lopte u sredinu canvas-a
let ballY = canvas.height - 30; // Postavlja početnu Y poziciju lopte blizu dna canvas-a
let ballSpeedX = 3 + 3 * (Math.random() * 2 - 1); // Nasumično generira početnu brzinu lopte u X smjeru između -3 i 3
let ballSpeedY = -3 * (2 + Math.random() * 2 -1); // Nasumično generira početnu brzinu lopte u Y smjeru, uvijek negativna za početno kretanje prema gore

const paddleHeight = 15; // Postavlja visinu platforme (igračevog kontrolnog objekta) na 15 piksela
const paddleWidth = 180; // Postavlja širinu platforme na 180 piksela
let paddleX = (canvas.width - paddleWidth) / 2; // Postavlja početnu X poziciju platforme u sredinu canvas-a
let rightPressed = false; // Varijabla koja označava da li je desni smjer pritisnut
let leftPressed = false; // Varijabla koja označava da li je lijevi smjer pritisnut

// Postavke dimenzija cigli
const brickHeight = 15; // Visina jedne cigle
const brickPadding = 10; // Razmak između cigli
const brickOffsetTop = 30; // Razmak od vrha canvas-a do prve linije cigli
const brickOffsetLeft = 10; // Razmak s lijeve strane canvas-a do prve kolone cigli
const brickColumnCount = 10; // Broj cigli u svakoj koloni
const brickWidth = Math.floor((canvas.width - brickOffsetLeft * 2 - (brickColumnCount - 1) * brickPadding) / brickColumnCount); // Izračunava širinu cigle na temelju ukupne širine canvas-a i željenog broja cigli
const brickRowCount = 5; // Broj redova cigli

// Kreiranje cigli kao niz objekata
let bricks = []; // Niz koji će sadržavati sve cigle
for (let c = 0; c < brickColumnCount; c++) { // Petlja kroz sve kolone cigli
    bricks[c] = []; // Kreira praznu podlistu za svaku kolonu
    for (let r = 0; r < brickRowCount; r++) { // Petlja kroz sve redove cigli
        bricks[c][r] = { x: 0, y: 0, status: 1 }; // Svakoj cigli dodaje inicijalne koordinate i status 1 (zdrav)
    }
}

let score = 0; // Početni rezultat je 0
let highScore = localStorage.getItem("highScore") || 0; // Dohvaća najbolji rezultat iz localStorage-a ili postavlja na 0 ako ne postoji
let gameOver = false; // Inicijalno postavlja stanje igre na 'nije završena'

// Funkcija za prikaz bodova
function drawScore() {
    ctx.font = "16px Arial"; // Postavlja font za tekst bodova
    ctx.fillStyle = "#ffffff"; // Postavlja boju teksta na bijelu
    ctx.textAlign = "right"; // Poravnava tekst na desnu stranu
    ctx.fillText("Bodovi: " + score, canvas.width - 220, 20); // Ispisuje trenutni broj bodova na ekranu, 220 piksela od desnog ruba
    ctx.fillText("Najbolji rezultat: " + highScore, canvas.width - 20, 20); // Ispisuje najbolji rezultat na ekranu, 20 piksela od desnog ruba
}

// Funkcija za crtanje lopte s dodanim sjenčanjem
function drawBall() {
    // Kreiranje radijalnog gradijenta za loptu
    let gradient = ctx.createRadialGradient(
        ballX - ballRadius / 3, // Manji pomak prema gornjem lijevom kutu za svjetliju boju
        ballY - ballRadius / 3,
        ballRadius / 6, // Manji unutarnji polumjer
        ballX,
        ballY,
        ballRadius // Vanjski polumjer gradijenta
    );

    // Definiranje boja gradijenta
    gradient.addColorStop(0, "#9dff9d");    // Svjetlija boja u središtu lopte
    gradient.addColorStop(0.4, "#00ff00");  // Glavna boja (zelena)
    gradient.addColorStop(1, "#009d00");    // Tamnija boja na rubovima lopte

    // Crtanje lopte
    ctx.beginPath(); // Počinje crtanje
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2); // Crta krug za loptu
    ctx.fillStyle = gradient; // Primjena gradijenta na loptu
    ctx.fill(); // Ispunjava oblik loptice
    ctx.closePath(); // Zatvara putanju (krug)
}

// Funkcija za crtanje palice (igrače kontrole)
function drawPaddle() {
    // Dimenzije i koordinate vrhova palice
    let x = paddleX;
    let y = canvas.height - paddleHeight;
    let width = paddleWidth;
    let height = paddleHeight;

    // Definiraj boje za palicu
    const darkerColor = "#bf0000"; // Tamnija crvena
    const lighterColor = "#ff5959"; // Svjetlija crvena
    const mainColor = "#ff0000"; // Glavna crvena boja

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
    ctx.fillRect(x + 5, y + 5, width - 10, height - 10); // Crta srednji dio palice s glavnom crvenom bojom
}

// Funkcija za crtanje cigli s dodanim sjenčanjem
function drawBricks() {
    // Iteracija kroz sve cigle u mreži
    for (let c = 0; c < brickColumnCount; c++) { // Petlja kroz kolone cigli
        for (let r = 0; r < brickRowCount; r++) { // Petlja kroz redove cigli
            if (bricks[c][r].status === 1) { // Provjerava da li je cigla aktivna (nije uništena)
                // Izračunava poziciju cigle na temelju kolone i reda
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX; // Spremanje pozicije X
                bricks[c][r].y = brickY; // Spremanje pozicije Y

                // Definiraj boje za cigle
                const darkerColor = "#006fa6"; // Tamnija plava
                const lighterColor = "#00b0f0"; // Svjetlija plava
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

                // Glavna boja cigle
                ctx.fillStyle = mainColor;
                ctx.fillRect(brickX + 5, brickY + 5, brickWidth - 10, brickHeight - 10); // Crta sredinu cigle s glavnom plavom bojom

                // Dodaj sjenčanje cigli (daje efekt 3D)
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)"; // Definira boju sjenke
                ctx.shadowOffsetX = 3; // Pomak sjenke u X smjeru
                ctx.shadowOffsetY = 3; // Pomak sjenke u Y smjeru
                ctx.shadowBlur = 5; // Zamagljivanje sjenke

                ctx.closePath(); // Zatvara putanju za ciglu
            }
        }
    }
}




// Funkcija za detekciju sudara između lopte i cigli
function collisionDetection() {
    // Petlja kroz sve cigle na ekranu
    for (let c = 0; c < brickColumnCount; c++) { // Iteracija kroz kolone cigli
        for (let r = 0; r < brickRowCount; r++) { // Iteracija kroz redove cigli
            let b = bricks[c][r]; // Dohvaća ciglu iz mreže cigli
            if (b.status === 1) { // Provjera je li cigla aktivna (nije uništena)
                // Definiranje granica cigle (lijevi, desni, gornji i donji rub)
                const brickLeft = b.x;
                const brickRight = b.x + brickWidth;
                const brickTop = b.y;
                const brickBottom = b.y + brickHeight;

                // Provjera je li lopta u kontaktu s ciglom
                if (ballX + ballRadius > brickLeft && ballX - ballRadius < brickRight &&
                    ballY + ballRadius > brickTop && ballY - ballRadius < brickBottom) {

                    // Provjera je li lopta udarila iz određenog smjera
                    const ballFromLeft = ballX < brickLeft && ballSpeedX > 0; // Lopta dolazi s lijeve strane
                    const ballFromRight = ballX > brickRight && ballSpeedX < 0; // Lopta dolazi s desne strane
                    const ballFromTop = ballY < brickTop && ballSpeedY > 0; // Lopta dolazi s gornje strane
                    const ballFromBottom = ballY > brickBottom && ballSpeedY < 0; // Lopta dolazi s donje strane

                    // Slučaj kada lopta udari iz lijevog ili desnog smjera
                    if (ballFromLeft || ballFromRight) {
                        ballSpeedX = -ballSpeedX; // Invertira smjer lopte po X osi
                    } 
                    // Slučaj kada lopta udari iz gornje ili donje strane
                    else if (ballFromTop || ballFromBottom) {
                        ballSpeedY = -ballSpeedY; // Invertira smjer lopte po Y osi
                    } else {
                        // Ako lopta dođe iz dijagonale ili direktnog sudara, možeš dodatno podesiti smjer
                        if (ballY + ballRadius > brickTop && ballY - ballRadius < brickBottom) {
                            ballSpeedY = -ballSpeedY; // Promjena smjera lopte po Y osi
                        } 
                        if (ballX + ballRadius > brickLeft && ballX - ballRadius < brickRight) {
                            ballSpeedX = -ballSpeedX; // Promjena smjera lopte po X osi
                        }
                    }

                    // Označava ciglu kao uništenu
                    b.status = 0; // Postavlja status cigle na 0, označava je kao uništenu
                    score++; // Povećava broj bodova

                    // Provjera je li igrač uništio sve cigle (kraj igre s pobjedom)
                    if (score === brickRowCount * brickColumnCount) {
                        endGame("YOU WIN!"); // Ako su sve cigle uništene, igra je završena s pobjedom
                    }
                }
            }
        }
    }
}


// Funkcija za povećanje brzine lopte tijekom igre
function increaseBallSpeed() {
    const maxSpeed = 4; // Postavljanje maksimalne brzine lopte
    if (Math.abs(ballSpeedX) < maxSpeed) ballSpeedX *= 1.05; // Povećava brzinu lopte po X osi (ako nije dostigla maksimalnu brzinu)
    if (Math.abs(ballSpeedY) < maxSpeed) ballSpeedY *= 1.05; // Povećava brzinu lopte po Y osi (ako nije dostigla maksimalnu brzinu)
}

// Funkcija za rukovanje pritiscima tipki (desno i lijevo)
function keyDownHandler(e) {
    // Ako je pritisnuta desna tipka (ili strelica desno), označi kao aktivnu
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    // Ako je pritisnuta lijeva tipka (ili strelica lijevo), označi kao aktivnu
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

// Funkcija za rukovanje otpuštanjem tipki
function keyUpHandler(e) {
    // Ako je otpuštena desna tipka (ili strelica desno), označi kao neaktivnu
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    // Ako je otpuštena lijeva tipka (ili strelica lijevo), označi kao neaktivnu
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

// Funkcija za ažuriranje pozicije palice (kontroliranje pomicanja lijevo/desno)
function updatePaddlePosition() {
    // Ako je desna tipka pritisnuta i palica se ne nalazi na desnom rubu ekrana
    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 6; 
    // Ako je lijeva tipka pritisnuta i palica se ne nalazi na lijevom rubu ekrana
    else if (leftPressed && paddleX > 0) paddleX -= 6; 
}

// Funkcija za ažuriranje pozicije lopte
function updateBallPosition() {
    // Provjera je li lopta udarila desni ili lijevi rub ekrana
    if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
        ballSpeedX = -ballSpeedX; // Promjena smjera lopte po X osi
    }
    // Provjera je li lopta udarila gornji rub ekrana
    if (ballY + ballSpeedY < ballRadius) {
        ballSpeedY = -ballSpeedY; // Promjena smjera lopte po Y osi
    }
    // Provjera je li lopta prošla donji rub ekrana (ispod palice)
    if (ballY + ballSpeedY > canvas.height - ballRadius - paddleHeight) {
        // Provjera kolizije s palicom (lopta mora biti unutar širine palice)
        const paddleY = canvas.height - paddleHeight - 20; // Pozicija palice (donji rub)
        if (ballX > paddleX && ballX < paddleX + paddleWidth /*&& ballY + ballRadius > paddleY*/) {
            // Prilagodba smjera lopte nakon udarca o palicu
            let distFromCenter = ballX - (paddleX + paddleWidth / 2); // Izračunaj udaljenost od centra palice
            let angle = distFromCenter / (paddleWidth / 2); // Izračunaj kut na temelju udaljenosti od centra palice
            let speed = Math.sqrt(ballSpeedX ** 2 + ballSpeedY ** 2); // Izračunaj brzinu lopte

            ballSpeedX = angle * speed; // Ažurira smjer brzine po X osi
            ballSpeedY = -Math.abs(ballSpeedY); // Lopta uvijek ide prema gore nakon udarca o palicu

            increaseBallSpeed(); // Povećava brzinu lopte
        } else {
            endGame("GAME OVER"); // Ako lopta nije pogodila palicu, igra je gotova (gubitak)
        }
    }

    // Ažurira poziciju lopte
    ballX += ballSpeedX; // Pomak lopte po X osi
    ballY += ballSpeedY; // Pomak lopte po Y osi
}


// Funkcija za završetak igre
function endGame(message) {
    gameOver = true; // Postavlja varijablu 'gameOver' na true, označavajući da je igra završena
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Briše cijeli ekran, čisti platno

    // Povećana veličina fonta za 'GAME OVER' poruku
    ctx.fillStyle = "white"; // Postavlja boju teksta na bijelu
    ctx.font = "40px Arial";  // Postavlja font i veličinu teksta na 40px, tip fonta je Arial
    ctx.textAlign = "center"; // Postavlja poravnavanje teksta na centar
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 50); // Prikazuje tekst poruke u centru platna, pomaknutog za 50 piksela prema gore

    // Spremanje najvišeg rezultata
    highScore = Math.max(score, highScore); // Spremanje najvećeg rezultata (ako je trenutni rezultat veći od prethodnog najvišeg, ažurira se)
    localStorage.setItem("highScore", highScore); // Spremanje najvišeg rezultata u lokalnu pohranu

    // Prikazivanje gumba za ponovno pokretanje igre
    restartButton.style.display = "block"; // Prikazuje gumb za ponovno pokretanje igre
    restartButton.style.top = "60%";  // Postavlja gumb na 60% visine ekrana, pomičući ga prema dolje
}


// Funkcija za ponovno pokretanje igre
function restartGame() {
    // Inicijalizacija početnih postavki igre
    ballX = canvas.width / 2; // Pozicionira loptu u sredinu ekrana po X osi
    ballY = canvas.height - 30; // Pozicionira loptu na donji rub ekrana (iznad palice)
    ballSpeedX = 2.5 * (Math.random() * 2 - 1); // Generira nasumičnu brzinu lopte po X osi
    ballSpeedY = -2.5; // Postavlja brzinu lopte po Y osi prema gore
    paddleX = (canvas.width - paddleWidth) / 2; // Pozicionira palicu u sredinu ekrana po X osi
    score = 0; // Resetira rezultat na 0
    gameOver = false; // Postavlja varijablu 'gameOver' na false, označavajući da igra nije završena
    bricks = []; // Briše sve cigle

    // Ponovno stvara sve cigle u početnom stanju (aktivne)
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 }; // Inicijalizira cigle sa statusom 1 (aktivne)
        }
    }
    
    // Sakriva gumb za ponovno pokretanje
    restartButton.style.display = "none";
    
    // Pokreće crtanje početnog stanja igre
    draw();
}

// Glavna funkcija za crtanje
function draw() {
    if (gameOver) return; // Ako je igra završena, prekida crtanje

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Briše cijeli ekran
    drawBricks(); // Crta cigle
    drawBall(); // Crta loptu
    drawPaddle(); // Crta palicu
    drawScore(); // Crta rezultat
    collisionDetection(); // Provodi detekciju sudara između lopte i cigli
    updatePaddlePosition(); // Ažurira poziciju palice
    updateBallPosition(); // Ažurira poziciju lopte

    requestAnimationFrame(draw); // Poziva funkciju draw za sljedeći okvir (animacija)
}

// Event listeneri za tipke
document.addEventListener("keydown", keyDownHandler, false); // Sluša pritisak tipke (na početku igre)
document.addEventListener("keyup", keyUpHandler, false); // Sluša otpuštanje tipke (na početku igre)

// Klik za ponovno pokretanje igre
restartButton.addEventListener("click", restartGame); // Sluša klik na gumb za ponovno pokretanje igre

// Početno crtanje
draw(); // Poziva funkciju draw za početno crtanje igre na ekranu
