AFRAME.registerComponent('random-move', {
    init: function () {
      this.el.setAttribute('animation__1', {
        property: 'position',
        to: `${Math.random() * 2 - 1} ${Math.random() * 3 + 1.5} ${Math.random() * 2 - 4}`,
        dur: 4000 + Math.random() * 2000,
        loop: true,
        dir: 'alternate',
        easing: 'easeInOutSine',
      });
    }
  });

  function moveBubbles() {
    const bubbles = document.querySelectorAll('a-sphere[random-move]');
    bubbles.forEach(bubble => {
        // Lógica para mover las burbujas
        const currentPosition = bubble.getAttribute('position');
        // Cambiar la posición, por ejemplo, agregar un pequeño movimiento en el eje Y
        bubble.setAttribute('position', {
            x: currentPosition.x,
            y: currentPosition.y + Math.sin(Date.now() * 0.001) * 0.01, // Movimiento oscilante
            z: currentPosition.z
        });
    });
}

function animate() {
    moveBubbles();
    requestAnimationFrame(animate);
}

animate(); // Inicia el bucle de animación

document.addEventListener('DOMContentLoaded', () => {
    animate(); // Inicia el bucle de animación
});