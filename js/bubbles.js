import AFRAME from 'aframe';

document.addEventListener("DOMContentLoaded", function() {
  for (let i = 0; i < 10; i++) {
   const bubblesGroup = document.createElement('a-entity');

   
   const randomX = Math.random() * 200 - 100; 
   const randomY = Math.random() * 20 + 5; 
   const randomZ = Math.random() * 200 - 100; 
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


AFRAME.registerComponent('random-move', {
  init: function () {
    const initialPosition = this.el.getAttribute('position');

    this.el.setAttribute('animation', {
      property: 'position',
      from: `${initialPosition.x} -10 ${initialPosition.z}`, 
      to: `${initialPosition.x} ${initialPosition.y + 20} ${initialPosition.z}`, 
      dur: 10000 + Math.random() * 5000, 
      easing: 'linear', 
      loop: true 
    });
  }
});