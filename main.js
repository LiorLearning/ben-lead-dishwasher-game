import Game from './Game.js';
// Get renderDiv and set it to fill the viewport
var renderDiv = document.getElementById('renderDiv');
renderDiv.style.width = '100%';
renderDiv.style.height = '100%';
renderDiv.style.position = 'fixed';
renderDiv.style.top = '0';
renderDiv.style.left = '0';
renderDiv.style.overflow = 'hidden';
// Initialize and start the game
new Game(renderDiv).start();
