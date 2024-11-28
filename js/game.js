import AFRAME from 'aframe';
import 'aframe-extras';

// Componente para movimiento vertical de la orca
AFRAME.registerComponent('orca-motion', {
  schema: {
    speed: { type: 'number', default: 1 }, // Velocidad de desplazamiento
    waveHeight: { type: 'number', default: 2 }, // Amplitud del movimiento vertical
    waveFrequency: { type: 'number', default: 0.5 }, // Frecuencia del movimiento
    range: { type: 'number', default: 20 }, // Distancia máxima antes de girar
    rotationOffset: { type: 'number', default: 90 }, // Compensación de rotación inicial en grados
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
    const currentRotation = this.el.object3D.rotation.y * (180 / Math.PI); // Rotación actual en grados
    const rotationStep = 2; // Velocidad de rotación
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




// Componente para movimiento horizontal del delfín
AFRAME.registerComponent('dolphin-motion', {
  schema: {
    speed: { type: 'number', default: 2 }, // Velocidad del movimiento
    range: { type: 'number', default: 15 }, // Distancia máxima del desplazamiento
  },
  init: function () {
    this.direction = 1; // Dirección inicial (1 = hacia adelante, -1 = hacia atrás)
    this.originalPosition = this.el.object3D.position.clone(); // Guardar la posición inicial
    this.isRotating = false; // Bandera para saber si está rotando
    this.targetRotation = 0; // Rotación deseada

    // Corregir la orientación inicial del modelo (rotarlo para mirar hacia adelante)
    this.el.setAttribute('rotation', { x: 0, y: 180, z: 0 }); // Ajusta el eje Y
  },
  tick: function (time, timeDelta) {
    const { speed, range } = this.data;
    const delta = (speed * timeDelta) / 1000;
    const position = this.el.object3D.position;

    if (this.isRotating) {
      const currentRotation = this.el.object3D.rotation.y * (180 / Math.PI); // Convertimos a grados
      const rotationStep = delta * 100;
      const diff = this.targetRotation - currentRotation;

      if (Math.abs(diff) < rotationStep) {
        this.el.setAttribute('rotation', { x: 0, y: this.targetRotation, z: 0 });
        this.isRotating = false;
      } else {
        const newRotation =
          currentRotation + Math.sign(diff) * rotationStep;
        this.el.setAttribute('rotation', { x: 0, y: newRotation, z: 0 });
      }
      return;
    }

    position.x += this.direction * delta;

    if (Math.abs(position.x - this.originalPosition.x) >= range) {
      this.direction *= -1;
      this.targetRotation = this.direction === 1 ? 180 : 0; // Ajustar rotación para mirar hacia la nueva dirección
      this.isRotating = true;
    }

    this.el.object3D.position.copy(position);
  },
});

// Componente para movimiento en "S" del tiburón
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
