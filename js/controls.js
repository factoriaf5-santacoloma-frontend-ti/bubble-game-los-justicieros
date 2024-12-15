AFRAME.registerComponent('underwater-jump', {
  schema: {
    ascentSpeed: { type: 'number', default: 1 },
    descentSpeed: { type: 'number', default: 0.5 },
    maxHeight: { type: 'number', default: 20 },
    minHeight: { type: 'number', default: 1 },
    groundEntity: { type: 'selector', default: null },
  },
  init: function () {
    this.isJumping = false;
    this.velocity = 0;
    this.onGround = false;

    // Listeners para detectar presiones de teclas
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.onGround) {
        this.isJumping = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isJumping = false;
      }
    });
  },
  tick: function (time, timeDelta) {
    const delta = timeDelta / 1000;
    const position = this.el.object3D.position;
    const { ascentSpeed, descentSpeed, maxHeight, minHeight, groundEntity } = this.data;

    // Verificar colisión con el suelo
    if (groundEntity) {
      const playerBox = new THREE.Box3().setFromObject(this.el.object3D);
      const groundBox = new THREE.Box3().setFromObject(groundEntity.object3D);
      this.onGround = playerBox.intersectsBox(groundBox);
    }

    // Control del salto
    if (this.isJumping) {
      this.velocity = Math.min(this.velocity + ascentSpeed * delta, ascentSpeed);
    } else if (!this.onGround) {
      this.velocity = Math.max(this.velocity - descentSpeed * delta, -descentSpeed);
    } else {
      this.velocity = 0;
    }

    // Actualizar posición en el eje Y
    position.y += this.velocity;

    // Rebote en el límite superior
    if (position.y > maxHeight) {
      position.y = maxHeight;
      this.velocity = -descentSpeed; // Rebota hacia abajo con velocidad de descenso
    }

    // Limitar altura mínima
    if (position.y < minHeight) {
      position.y = minHeight;
      this.velocity = 0; // Detiene el movimiento si toca el suelo
    }

    // Aplicar nueva posición
    this.el.object3D.position.copy(position);
  },
});


AFRAME.registerComponent('underwater-jump', {
  schema: {
    ascentSpeed: { type: 'number', default: 0.4 }, // Velocidad de ascenso
    descentSpeed: { type: 'number', default: 0.4 }, // Velocidad de descenso
    maxHeight: { type: 'number', default: 300 }, // Límite superior (techo)
    minHeight: { type: 'number', default: -80 }, // Límite inferior (suelo)
    bounds: { type: 'vec3', default: { x: 400, y: 300, z: 400 } }, // Límites del mapa
  },
  init: function () {
    this.isJumping = false; // Indica si el usuario está saltando
    this.velocity = 0; // Velocidad vertical

    // Listeners de entrada del teclado
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.isJumping = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isJumping = false;
      }
    });
  },
  tick: function (time, timeDelta) {
    const delta = timeDelta / 1000; // Tiempo transcurrido en segundos
    const position = this.el.object3D.position;
    const { ascentSpeed, descentSpeed, maxHeight, minHeight, bounds } = this.data;

    // Control del salto
    if (this.isJumping && position.y < maxHeight) {
      this.velocity = Math.min(this.velocity + ascentSpeed * delta, ascentSpeed);
    } else if (!this.isJumping || position.y >= maxHeight) {
      this.velocity = Math.max(this.velocity - descentSpeed * delta, -descentSpeed);
    }

    // Actualizar posición vertical
    position.y += this.velocity;

    // Limitar altura mínima y máxima
    if (position.y > maxHeight) {
      position.y = maxHeight;
      this.velocity = 0;
    }
    if (position.y < minHeight) {
      position.y = minHeight;
      this.velocity = 0;
    }

    // Limitar movimiento horizontal y profundidad
    position.x = Math.max(-bounds.x / 2, Math.min(bounds.x / 2, position.x));
    position.z = Math.max(-bounds.z / 2, Math.min(bounds.z / 2, position.z));

    // Aplicar la posición restringida
    this.el.object3D.position.copy(position);
  },
});
AFRAME.registerComponent('universal-controls', {
  schema: {
    ascentSpeed: { type: 'number', default: 1 }, // Velocidad de ascenso
    descentSpeed: { type: 'number', default: 0.5 }, // Velocidad de descenso
    maxHeight: { type: 'number', default: 20 }, // Altura máxima
    minHeight: { type: 'number', default: 1 }, // Altura mínima
    groundEntity: { type: 'selector', default: null }, // Suelo
  },
  init: function () {
    this.isJumping = false;
    this.velocity = 0;
    this.onGround = true;

    this.isVR = false;

    // Detectar si está en VR
    this.el.sceneEl.addEventListener('enter-vr', () => {
      this.isVR = true;
    });
    this.el.sceneEl.addEventListener('exit-vr', () => {
      this.isVR = false;
    });

    // Controles de escritorio (teclado)
    window.addEventListener('keydown', (e) => {
      if (!this.isVR) {
        if (e.code === 'Space' && this.onGround) {
          this.isJumping = true;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (!this.isVR && e.code === 'Space') {
        this.isJumping = false;
      }
    });

    // Controles de VR (thumbstick y botones)
    this.el.addEventListener('thumbstickmoved', (e) => {
      if (this.isVR && e.detail.y < -0.95) {
        this.isJumping = true; // Pulgar hacia arriba
      } else {
        this.isJumping = false;
      }
    });

    this.el.addEventListener('buttondown', (e) => {
      if (this.isVR && e.detail.id === 1) {
        this.isJumping = true; // Botón derecho superior
      }
    });

    this.el.addEventListener('buttonup', (e) => {
      if (this.isVR && e.detail.id === 1) {
        this.isJumping = false;
      }
    });
  },
  tick: function (time, timeDelta) {
    const delta = timeDelta / 1000;
    const position = this.el.object3D.position;
    const { ascentSpeed, descentSpeed, maxHeight, minHeight, groundEntity } = this.data;

    // Detectar colisión con el suelo
    if (groundEntity) {
      const playerBox = new THREE.Box3().setFromObject(this.el.object3D);
      const groundBox = new THREE.Box3().setFromObject(groundEntity.object3D);
      this.onGround = playerBox.intersectsBox(groundBox);
    }

    // Control del salto/elevación
    if (this.isJumping && position.y < maxHeight) {
      this.velocity = Math.min(this.velocity + ascentSpeed * delta, ascentSpeed);
    } else if (!this.isJumping || position.y >= maxHeight) {
      this.velocity = Math.max(this.velocity - descentSpeed * delta, -descentSpeed);
    } else if (this.onGround) {
      this.velocity = 0;
    }

    // Actualizar posición vertical
    position.y += this.velocity;

    // Limitar la altura máxima y mínima
    if (position.y > maxHeight) {
      position.y = maxHeight;
      this.velocity = 0;
    }
    if (position.y < minHeight) {
      position.y = minHeight;
      this.velocity = 0;
    }

    this.el.object3D.position.copy(position);
  },
});
