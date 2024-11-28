import AFRAME from 'aframe';

document.addEventListener("DOMContentLoaded", function() {
  for (let i = 0; i < 10; i++) {
   const bubblesGroup = document.createElement('a-entity');

   // Establece la posición aleatoria para bubblesGroup
   const randomX = Math.random() * 200 - 100; // Rango de -100 a 100
   const randomY = Math.random() * 20 + 5; // Rango de 5 a 25 (altura)
   const randomZ = Math.random() * 200 - 100; // Rango de -100 a 100
   bubblesGroup.setAttribute('position', `${randomX} ${randomY} ${randomZ}`);
   
   bubblesGroup.setAttribute('random-move', '');
   
   for (let j = 0; j < 10; j++) {
     const bubbles = document.createElement('a-sphere');
     bubbles.object3D.position.set(Math.random() * 100 * j - 100, -4, Math.random() * 2 - j);
     bubbles.setAttribute('radius', '0.8');
     bubbles.setAttribute('color', '#89cff0');
     bubbles.setAttribute('opacity', '0.5');
     bubblesGroup.appendChild(bubbles);
   }
   document.querySelector('a-scene').appendChild(bubblesGroup);
 }
});



// document.addEventListener("DOMContentLoaded", function() {
//    for (let i = 0; i < 10; i++) {
//     const bubblesGroup = document.createElement('a-entity');
//     bubblesGroup.setAttribute('position', 'i -4 -i');
//     bubblesGroup.setAttribute('random-move', '');
    
//     for (let j = 0; j < 10; j++) {
//   const bubbles = document.createElement('a-sphere');

//   // bubbles.setAttribute('position', '0 -4 0');
//   bubbles.object3D.position.set(Math.random() *100* j -100, -4, Math.random() * 2 -j);
//   bubbles.setAttribute('radius', '0.8');
//   bubbles.setAttribute('color', '#89cff0');
//   bubbles.setAttribute('opacity', '0.5');

//   // bubbles.setAttribute('random-move', '');
//   bubblesGroup.appendChild(bubbles);
// }
// document.querySelector('a-scene').appendChild(bubblesGroup);
//   }
// });

AFRAME.registerComponent('random-move', {
  init: function () {
    this.el.setAttribute('animation', {
      property: 'position',
      to: `${Math.random() * 2 - 1} ${Math.random() * 3 + 1.5} ${Math.random() * 2 - 4}`,
      dur: 10000 + Math.random() * 2000,
      loop: true,
      // dir: '',
      easing: 'easeInOutSine',
    });
  }
});

// Posición aleatoria en el cielo
// Agregar el random-move a todas las burbujas
// decir que la burbuja es hija de a-scene

// function positionBubbles() {
//   // for (let i = 0; i < 10; i++) {
//     const bubble = document.createElement('a-sphere');
    
//     const randomX = Math.random() * 10; 
//     const randomY = Math.random() * -40 ; 
//     const randomZ = Math.random() * 0 - 10;

//     bubble.setAttribute("color",'red')
//     bubble.setAttribute('position', `${0} ${0} ${0}`);

    
//     // bubble.setAttribute('random-move', '');

    
//     document.querySelector('a-scene').appendChild(bubble);
//   // }
// }

// Llama a la función para posicionar las burbujas

// window.addEventListener(["DOMContentLoaded", ()=> {
//   positionBubbles();
// }]);




//   function moveBubbles() {
//     const bubbles = document.querySelectorAll('a-sphere[random-move]');
//     bubbles.forEach(bubble => {
//         // Lógica para mover las burbujas
//         const currentPosition = bubble.getAttribute('position');
//         // Cambiar la posición, por ejemplo, agregar un pequeño movimiento en el eje Y
//         bubble.setAttribute('position', {
//             x: currentPosition.x,
//             y: currentPosition.y + Math.sin(Date.now() * 0.001) * 0.01, // Movimiento oscilante
//             z: currentPosition.z
//         });
//     });
// }

// function animate() {
//     moveBubbles();
//     requestAnimationFrame(animate);
// }

// animate(); // Inicia el bucle de animación

// document.addEventListener('DOMContentLoaded', () => {
//     animate(); // Inicia el bucle de animación
// });

