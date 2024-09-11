// Crear el objeto de audio
const audio = new Audio('intro.wav');

// Configuración del ciclo y desvanecimiento
const fadeDuration = 2000; // Duración del desvanecimiento en milisegundos (2 segundos)
const fadeInterval = 50; // Intervalo de actualización del volumen en milisegundos
const fadeStep = fadeInterval / fadeDuration; // Cantidad de cambio de volumen por intervalo

function fadeIn(audio, duration) {
    let volume = 0;
    audio.volume = volume;
    audio.play();

    const interval = setInterval(() => {
        volume += fadeStep;
        if (volume >= 1) {
            volume = 1;
            clearInterval(interval);
        }
        audio.volume = volume;
    }, fadeInterval);
}

function fadeOut(audio, duration, callback) {
    let volume = audio.volume;
    const interval = setInterval(() => {
        volume -= fadeStep;
        if (volume <= 0) {
            volume = 0;
            clearInterval(interval);
            audio.pause();
            audio.currentTime = 0; // Reiniciar el tiempo de reproducción
            if (callback) callback(); // Llamar al callback después de detenerse
        }
        audio.volume = volume;
    }, fadeInterval);
}

function cycleAudio() {
    fadeIn(audio, fadeDuration);
    setTimeout(() => {
        fadeOut(audio, fadeDuration, cycleAudio); // Reiniciar el ciclo después del fade out
    }, audio.duration * 1000 - fadeDuration); // Descontar el tiempo del fade out
}

// Agregar la funcionalidad para comenzar el juego
document.querySelector('.start-button').addEventListener('click', function () {
    window.location.href = 'game.html';  // Cambia a la página del juego
});

// Iniciar el ciclo de audio al cargar la página
window.addEventListener('load ', function() {
    cycleAudio();
});