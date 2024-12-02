import AFRAME from 'aframe';
import 'aframe-extras';

///// ORCA MOVIMIENTOS //////
AFRAME.registerComponent('orca-motion', {
  schema: {
    speed: { type: 'number', default: 1 }, // Velocidad de desplazamiento
    waveHeight: { type: 'number', default: 2 }, // Amplitud del movimiento vertical
    waveFrequency: { type: 'number', default: 0.5 }, // Frecuencia del movimiento
    range: { type: 'number', default: 20 }, // Distancia máxima antes de girar
    rotationOffset: { type: 'number', default: 90 }, // Compensación de rotación inicial en grados
    rotationSpeed: { type: 'number', default: 0.5 }, // Velocidad de rotación (grados por segundo)
  },
  init: function () {
    this.direction = 1; // Dirección inicial (1 = hacia adelante, -1 = hacia atrás)
    this.originalPosition = this.el.object3D.position.clone(); // Guardar la posición inicial
    this.t = 0; // Contador para la onda
    this.targetRotation = this.data.rotationOffset; // Rotación inicial
    this.isRotating = false; // Bandera para saber si está rotando

    // Aplicar la compensación inicial de rotación
    this.el.setAttribute('rotation', { x: 0, y: this.data.rotationOffset, z: 0 });
  },
  tick: function (time, timeDelta) {
    const { speed, waveHeight, waveFrequency, range } = this.data;
    const delta = (speed * timeDelta) / 1000; // Calcular desplazamiento basado en tiempo
    const position = this.el.object3D.position;

    if (this.isRotating) {
      this.handleRotation(delta);
      return; // Salir mientras rota
    }

    // Movimiento hacia adelante en el eje Z
    position.z += this.direction * delta;

    // Movimiento ondulado en el eje Y
    this.t += delta * waveFrequency;
    position.y = this.originalPosition.y + waveHeight * Math.sin(this.t * Math.PI * 2);

    // Verificar límites para cambiar dirección
    if (Math.abs(position.z - this.originalPosition.z) >= range) {
      this.startRotation(); // Iniciar rotación al alcanzar los límites
    }

    // Actualizar la posición del modelo
    this.el.object3D.position.copy(position);
  },
  startRotation: function () {
    this.isRotating = true;

    // Cambiar la dirección y calcular la rotación deseada
    this.direction *= -1;
    this.targetRotation = this.direction === 1
      ? this.data.rotationOffset
      : this.data.rotationOffset + 180; // Ajustar con compensación
  },
  handleRotation: function (delta) {
    const { rotationSpeed } = this.data;
    const currentRotation = this.el.object3D.rotation.y * (180 / Math.PI); // Rotación actual en grados
    const rotationStep = rotationSpeed * delta; // Calcular paso de rotación
    const diff = this.targetRotation - currentRotation;

    if (Math.abs(diff) < rotationStep) {
      // Rotación completada
      this.el.setAttribute('rotation', { x: 0, y: this.targetRotation, z: 0 });
      this.isRotating = false;
    } else {
      // Continuar rotando hacia el objetivo
      const newRotation = currentRotation + Math.sign(diff) * rotationStep;
      this.el.setAttribute('rotation', { x: 0, y: newRotation, z: 0 });
    }
  },
});

// TIBURON MOVIMIENTOS ///
AFRAME.registerComponent('shark-motion', {
  schema: {
    speed: { type: 'number', default: 2 }, // Velocidad de desplazamiento
    amplitude: { type: 'number', default: 5 }, // Amplitud de la oscilación en Z
    frequency: { type: 'number', default: 0.5 }, // Frecuencia del movimiento en "S"
    range: { type: 'number', default: 20 }, // Distancia en X antes de devolverse
  },
  init: function () {
    this.direction = 1; // Dirección inicial (1 = hacia adelante, -1 = hacia atrás)
    this.originalPosition = this.el.object3D.position.clone(); // Guardar la posición inicial
    this.t = 0; // Contador para el movimiento en "S"
  },
  tick: function (time, timeDelta) {
    const { speed, amplitude, frequency, range } = this.data;
    const delta = (speed * timeDelta) / 1000; // Calcular desplazamiento basado en tiempo
    const position = this.el.object3D.position;

    // Movimiento en el eje X
    position.x += this.direction * delta;

    // Movimiento oscilante en el eje Z (forma de "S")
    this.t += frequency * (timeDelta / 1000);
    position.z = this.originalPosition.z + amplitude * Math.sin(this.t * Math.PI * 2);

    // Verificar si alcanza los límites del rango
    if (this.direction === 1 && position.x >= this.originalPosition.x + range) {
      this.direction = -1; // Cambiar dirección hacia atrás
      this.el.setAttribute('rotation', { x: 0, y: 180, z: 0 }); // Rotar hacia atrás
    } else if (this.direction === -1 && position.x <= this.originalPosition.x - range) {
      this.direction = 1; // Cambiar dirección hacia adelante
      this.el.setAttribute('rotation', { x: 0, y: 0, z: 0 }); // Rotar hacia adelante
    }

    // Actualizar la posición del modelo
    this.el.object3D.position.copy(position);
  },
});

////GRUPO DE PECES 1 NEMO ///

AFRAME.registerComponent('fish-school', {
  schema: {
    model: { type: 'string', default: '' }, // Ruta del modelo GLTF
    count: { type: 'number', default: 5 }, // Número de peces
    range: { type: 'vec3', default: { x: 50, y: 20, z: 50 } }, // Rango de movimiento
    speed: { type: 'number', default: 0.5 }, // Velocidad de los peces
  },
  init: function () {
    this.fishes = []; // Array para almacenar los peces

    // Crear los peces
    for (let i = 0; i < this.data.count; i++) {
      const fish = document.createElement('a-entity');
      fish.setAttribute('gltf-model', this.data.model);
      fish.setAttribute('animation-mixer', '');
      fish.setAttribute('position', {
        x: (Math.random() - 0.5) * this.data.range.x,
        y: (Math.random() - 0.5) * this.data.range.y,
        z: (Math.random() - 0.5) * this.data.range.z,
      });
      this.el.appendChild(fish);
      this.fishes.push({
        element: fish,
        direction: {
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1,
          z: Math.random() * 2 - 1,
        },
      });
    }
  },
  tick: function (time, timeDelta) {
    const delta = this.data.speed * (timeDelta / 1000);

    this.fishes.forEach((fishData) => {
      const fish = fishData.element;
      const position = fish.object3D.position;
      const direction = fishData.direction;

      // Actualizar la posición del pez
      position.x += direction.x * delta;
      position.y += direction.y * delta;
      position.z += direction.z * delta;

      // Cambiar dirección si el pez alcanza los límites del rango
      const { x, y, z } = this.data.range;
      if (position.x > x / 2 || position.x < -x / 2) direction.x *= -1;
      if (position.y > y / 2 || position.y < -y / 2) direction.y *= -1;
      if (position.z > z / 2 || position.z < -z / 2) direction.z *= -1;

      // Aplicar la nueva posición
      fish.setAttribute('position', { x: position.x, y: position.y, z: position.z });

      // Hacer que el pez mire hacia la dirección en la que se mueve
      const rotationY = (Math.atan2(direction.z, direction.x) * 180) / Math.PI;
      fish.setAttribute('rotation', { x: 0, y: rotationY, z: 0 });
    });
  },
});

/// GRUPO DE PECES 2 ///

AFRAME.registerComponent('fish-school2', {
  schema: {
    model: { type: 'string', default: '' }, // Ruta del modelo GLTF
    count: { type: 'number', default: 5 }, // Número de peces
    range: { type: 'vec3', default: { x: 50, y: 20, z: 50 } }, // Rango de movimiento
    speed: { type: 'number', default: 0.5 }, // Velocidad de los peces
  },
  init: function () {
    this.fishes = []; // Almacenar información de cada pez

    // Crear los peces
    for (let i = 0; i < this.data.count; i++) {
      const fish = document.createElement('a-entity');
      fish.setAttribute('gltf-model', this.data.model);
      fish.setAttribute('animation-mixer', '');
      fish.setAttribute('scale', '0.5 0.5 0.5');

      // Posición inicial aleatoria
      const position = {
        x: (Math.random() - 0.5) * this.data.range.x,
        y: (Math.random() - 0.5) * this.data.range.y,
        z: (Math.random() - 0.5) * this.data.range.z,
      };
      fish.setAttribute('position', position);

      // Insertar pez en la escena
      this.el.appendChild(fish);

      // Almacenar pez y su información de movimiento
      this.fishes.push({
        element: fish,
        direction: {
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1,
          z: Math.random() * 2 - 1,
        },
        position: position,
      });
    }
  },
  tick: function (time, timeDelta) {
    const delta = this.data.speed * (timeDelta / 1000);

    this.fishes.forEach((fishData) => {
      const fish = fishData.element;
      const position = fishData.position;
      const direction = fishData.direction;

      // Actualizar posición
      position.x += direction.x * delta;
      position.y += direction.y * delta;
      position.z += direction.z * delta;

      // Verificar límites del rango y ajustar dirección
      const { x, y, z } = this.data.range;
      if (position.x > x / 2 || position.x < -x / 2) direction.x *= -1;
      if (position.y > y / 2 || position.y < -y / 2) direction.y *= -1;
      if (position.z > z / 2 || position.z < -z / 2) direction.z *= -1;

      // Actualizar posición y rotación
      fish.setAttribute('position', position);
      const rotationY = (Math.atan2(direction.z, direction.x) * 180) / Math.PI;
      fish.setAttribute('rotation', { x: 0, y: rotationY, z: 0 });
    });
  },
});


//LA MEDUSA//

AFRAME.registerComponent('jellyfish-school', {
  schema: {
    model: { type: 'string', default: '' }, // Ruta del modelo GLB/GLTF
    count: { type: 'number', default: 10 }, // Número de medusas
    range: { type: 'vec3', default: { x: 50, y: 30, z: 50 } }, // Rango de movimiento
    speed: { type: 'number', default: 0.2 }, // Velocidad de las medusas
  },
  init: function () {
    this.jellyfishes = []; // Array para almacenar las medusas

    // Crear las medusas
    for (let i = 0; i < this.data.count; i++) {
      const jellyfish = document.createElement('a-entity');
      jellyfish.setAttribute('gltf-model', this.data.model);
      jellyfish.setAttribute('animation-mixer', 'timeScale: 0.5');
      jellyfish.setAttribute('scale', '0.8 0.8 0.8');

      // Posición inicial aleatoria dentro del rango
      const position = {
        x: (Math.random() - 0.5) * this.data.range.x,
        y: (Math.random() - 0.5) * this.data.range.y,
        z: (Math.random() - 0.5) * this.data.range.z,
      };
      jellyfish.setAttribute('position', position);

      // Agregar la medusa a la escena
      this.el.appendChild(jellyfish);

      // Almacenar la medusa con su dirección de movimiento
      this.jellyfishes.push({
        element: jellyfish,
        position: position,
        direction: {
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1,
          z: Math.random() * 2 - 1,
        },
      });
    }
  },
  tick: function (time, timeDelta) {
    const delta = this.data.speed * (timeDelta / 1000);

    this.jellyfishes.forEach((jellyfishData) => {
      const jellyfish = jellyfishData.element;
      const position = jellyfishData.position;
      const direction = jellyfishData.direction;

      // Actualizar la posición de la medusa
      position.x += direction.x * delta;
      position.y += direction.y * delta;
      position.z += direction.z * delta;

      // Cambiar dirección si la medusa alcanza los límites del rango
      const { x, y, z } = this.data.range;
      if (position.x > x / 2 || position.x < -x / 2) direction.x *= -1;
      if (position.y > y / 2 || position.y < -y / 2) direction.y *= -1;
      if (position.z > z / 2 || position.z < -z / 2) direction.z *= -1;

      // Actualizar la posición de la medusa en la escena
      jellyfish.setAttribute('position', position);
    });
  },
});

