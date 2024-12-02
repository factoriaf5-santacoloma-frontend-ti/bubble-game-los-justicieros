// import AFRAME from 'aframe';

let score = 0; // Contador global de burbujas explotadas

// Crear una posición aleatoria dentro de un rango, ajustando para aparecer más arriba
function createRandomPosition(range = { x: 400, y: 300, z: 400 }, coralHeight = -70) {
  return {
    x: (Math.random() - 0.5) * range.x,
    y: coralHeight + Math.random() * range.y + 50, // Ajusta para que estén más arriba
    z: (Math.random() - 0.5) * range.z,
  };
}

// Generar burbujas en la escena
function generateBubbles(scene, count = 200) {
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('a-sphere');
    const position = createRandomPosition();

    // Establecer atributos de posición y apariencia
    bubble.setAttribute('position', position);
    bubble.setAttribute('radius', '3.2'); // Tamaño aumentado
    bubble.setAttribute(
      'material',
      'color: #FFFFFF; opacity: 0.5; transparent: true; metalness: 0.3; roughness: 0.2'
    );
    bubble.setAttribute('class', 'shootable');
    bubble.setAttribute('random-move', 'speed: 3; range: 200 100 200');
    bubble.setAttribute('sound', 'src: https://factoriaf5-santacoloma-frontend-ti.github.io/bubble-game-los-justicieros/imagenes/sounds/bubble.mp3; on: click; volume: 70');

    // Evento al hacer clic
    bubble.addEventListener('click', () => {
      bubble.setAttribute('animation', {
        property: 'scale',
        to: '3 3 3',
        dur: 300,
        easing: 'easeOutQuad',
      });

      setTimeout(() => {
        bubble.parentNode.removeChild(bubble); // Eliminar burbuja
      }, 300);

      // Actualizar contador
      score++;
      const scoreText = document.querySelector('#score-text');
      if (scoreText) {
        scoreText.setAttribute('value', `Score: ${score}`);
      }
    });

    scene.appendChild(bubble);
  }
}

// Componente para movimiento aleatorio y evitar suelo
AFRAME.registerComponent('random-move', {
  schema: {
    speed: { type: 'number', default: 2 },
    range: { type: 'vec3', default: { x: 200, y: 100, z: 200 } },
    coralHeight: { type: 'number', default: -70 },
  },
  init: function () {
    this.direction = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random() * 2 - 1,
    };
  },
  tick: function (time, timeDelta) {
    const delta = (this.data.speed * timeDelta) / 1000;
    const position = this.el.object3D.position;

    position.x += this.direction.x * delta;
    position.y += this.direction.y * delta;
    position.z += this.direction.z * delta;

    const { x, y, z } = this.data.range;
    const coralHeight = this.data.coralHeight;

    if (position.x > x / 2 || position.x < -x / 2) this.direction.x *= -1;
    if (position.y > y / 2 || position.y < coralHeight + 10) this.direction.y *= -1; // Evitar que caigan debajo del coral
    if (position.z > z / 2 || position.z < -z / 2) this.direction.z *= -1;

    this.el.object3D.position.copy(position);
  },
});

// Componente para inicializar las burbujas y marcador
AFRAME.registerComponent('bubble-generator', {
  schema: {
    count: { type: 'number', default: 200 },
    range: { type: 'vec3', default: { x: 200, y: 100, z: 200 } },
    coralHeight: { type: 'number', default: -70 },
  },
  init: function () {
    const scene = this.el.sceneEl;
    generateBubbles(scene, this.data.count);
  },
});
