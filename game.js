// Variables del juego
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let score = 0;
let gameOver = false;
let gameSpeed = 2;  // Velocidad inicial del juego
let spawnRate = 0.02;  // Tasa inicial de aparición de corazones y obstáculos

// Cargar imágenes
const carImage = new Image();
carImage.src = 'car.png'; // Imagen del coche

const heartImage = new Image();
heartImage.src = 'heart.png'; // Imagen del corazón

// Cargar sonidos
const pickupSound = new Audio('pickup.mp3');  // Sonido al recoger corazón
const crashSound = new Audio('crash.mp3');    // Sonido de choque

// Vehículo (jugador)
const car = {
    x: canvasWidth / 2 - 20,
    y: canvasHeight - 80,
    width: 40,
    height: 80,
    speed: 5,
    moveLeft: false,
    moveRight: false,
    draw() {
        ctx.drawImage(carImage, this.x, this.y, this.width, this.height); // Dibujar el coche
    },
    update() {
        if (this.moveLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.moveRight && this.x + this.width < canvasWidth) {
            this.x += this.speed;
        }
    }
};

// Corazones
class Heart {
    constructor() {
        this.x = Math.random() * (canvasWidth - 20);
        this.y = -20;
        this.size = 40;
        this.speed = gameSpeed;  // Velocidad se basa en la dificultad
    }

    draw() {
        ctx.drawImage(heartImage, this.x, this.y, this.size, this.size); // Dibujar el corazón
    }

    update() {
        this.y += this.speed;
    }
}

// Obstáculos (opcional: puedes usar una imagen o mantener el rectángulo)
class Obstacle {
    constructor() {
        this.x = Math.random() * (canvasWidth - 40);
        this.y = -40;
        this.width = 40;
        this.height = 40;
        this.speed = gameSpeed;
    }

    draw() {
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }
}

// Arrays para los objetos del juego
let hearts = [];
let obstacles = [];

// Añadir eventos de teclado
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") car.moveLeft = true;
    if (event.key === "ArrowRight") car.moveRight = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") car.moveLeft = false;
    if (event.key === "ArrowRight") car.moveRight = false;
});

// Controles touch para móviles
canvas.addEventListener('touchstart', function(e) {
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;  // Ajuste para obtener la posición relativa al canvas

    if (touchX < canvasWidth / 2) {
        car.moveLeft = true;
        car.moveRight = false;  // Asegúrate de que no se mueva en ambas direcciones
    } else {
        car.moveRight = true;
        car.moveLeft = false;  // Asegúrate de que no se mueva en ambas direcciones
    }
});

canvas.addEventListener('touchend', function(e) {
    // Detener el movimiento cuando se suelta el toque
    car.moveLeft = false;
    car.moveRight = false;
});


// Detección de colisiones
function detectCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Función para actualizar el juego
function updateGame() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Dibujar y actualizar el coche
        car.draw();
        car.update();

        // Dibujar y actualizar corazones
        hearts.forEach((heart, index) => {
            heart.draw();
            heart.update();

            // Detectar colisión con corazones
            if (detectCollision(car, {x: heart.x, y: heart.y, width: heart.size, height: heart.size})) {
                score++;
                hearts.splice(index, 1); // Elimina el corazón después de la colisión
            }

            // Eliminar corazones fuera de la pantalla
            if (heart.y > canvasHeight) {
                hearts.splice(index, 1);
            }
        });

        // Dibujar y actualizar obstáculos
        obstacles.forEach((obstacle, index) => {
            obstacle.draw();
            obstacle.update();

            // Detectar colisión con obstáculos
            if (detectCollision(car, obstacle)) {
                gameOver = true;
            }

            // Eliminar obstáculos fuera de la pantalla
            if (obstacle.y > canvasHeight) {
                obstacles.splice(index, 1);
            }
        });

        // Mostrar puntuación
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(`Puntuación: ${score}`, 10, 30);

        // Generar nuevos corazones y obstáculos
        if (Math.random() < spawnRate) hearts.push(new Heart());
        if (Math.random() < spawnRate) obstacles.push(new Obstacle());

        // Aumentar la dificultad con el tiempo
        if (score % 10 === 0 && score !== 0) {
            gameSpeed += 0.03;  // Incrementar la velocidad de los objetos
            //spawnRate += 0.005;  // Incrementar la frecuencia de aparición
        }

        // Seguir actualizando el juego
        requestAnimationFrame(updateGame);
    } else {
        ctx.fillStyle = "#FF0000";
        ctx.font = "40px Arial";
        ctx.fillText("¡Juego Terminado!", 50, canvasHeight / 2);
        ctx.font = "20px Arial";
        ctx.fillText(`Puntuación Final: ${score}`, 100, canvasHeight / 2 + 50);
    }
}

// Iniciar el juego
updateGame();
