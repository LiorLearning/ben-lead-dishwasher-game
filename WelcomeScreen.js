function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATE } from './constants.js';
var WelcomeScreen = /*#__PURE__*/ function() {
    "use strict";
    function WelcomeScreen(game, assetLoader) {
        _class_call_check(this, WelcomeScreen);
        this.assetLoader = assetLoader;
        this.game = game;
        this.title = "CRAFT & SURVIVE: DAVE'S ESCAPE";
        this.subtitle = "LEVEL 1";
        // Start button properties
        this.startButton = {
            x: CANVAS_WIDTH / 2 - 100,
            y: CANVAS_HEIGHT / 2 + 80,
            width: 200,
            height: 60,
            text: "START GAME",
            hovered: false
        };
        this.setupListeners();
        this.isMobile = this.detectMobile();
    }
    _create_class(WelcomeScreen, [
        {
            key: "detectMobile",
            value: function detectMobile() {
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 800;
            }
        },
        {
            key: "setupListeners",
            value: function setupListeners() {
                // Mouse events for button hover and click
                this.game.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
                this.game.canvas.addEventListener('click', this.handleClick.bind(this));
                // Touch events for mobile
                this.game.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
            }
        },
        {
            key: "handleMouseMove",
            value: function handleMouseMove(event) {
                if (!this.game.isGameActive) {
                    var rect = this.game.canvas.getBoundingClientRect();
                    var mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
                    var mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);
                    this.startButton.hovered = this.isPointInButton(mouseX, mouseY, this.startButton);
                }
            }
        },
        {
            key: "handleClick",
            value: function handleClick(event) {
                if (!this.game.isGameActive) {
                    var rect = this.game.canvas.getBoundingClientRect();
                    var mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
                    var mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);
                    if (this.isPointInButton(mouseX, mouseY, this.startButton)) {
                        this.startGame();
                    }
                }
            }
        },
        {
            key: "handleTouch",
            value: function handleTouch(event) {
                if (!this.game.isGameActive) {
                    event.preventDefault();
                    var rect = this.game.canvas.getBoundingClientRect();
                    var touch = event.touches[0];
                    var touchX = (touch.clientX - rect.left) * (this.game.canvas.width / rect.width);
                    var touchY = (touch.clientY - rect.top) * (this.game.canvas.height / rect.height);
                    if (this.isPointInButton(touchX, touchY, this.startButton)) {
                        this.startGame();
                    }
                }
            }
        },
        {
            key: "isPointInButton",
            value: function isPointInButton(x, y, button) {
                return x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height;
            }
        },
        {
            key: "startGame",
            value: function startGame() {
                this.game.gameState = GAME_STATE.PLAYING;
                this.game.isGameActive = true;
                // Remove event listeners specific to welcome screen to prevent memory leaks
                this.game.canvas.removeEventListener('mousemove', this.handleMouseMove);
                this.game.canvas.removeEventListener('click', this.handleClick);
                this.game.canvas.removeEventListener('touchstart', this.handleTouch);
            }
        },
        {
            key: "render",
            value: function render(ctx) {
                if (this.game.isGameActive) return;
                
                // Background overlay with minecraft texture
                const minecraftTexture = this.assetLoader.getAsset('minecraft');
                if (minecraftTexture) {
                    // Create a parallax effect by using two layers of the texture
                    ctx.globalAlpha = 0.2;
                    const pattern = ctx.createPattern(minecraftTexture, 'repeat');
                    ctx.fillStyle = pattern;
                    
                    // Slightly offset second layer for parallax effect
                    const time = Date.now() / 10000; // Very slow movement
                    const offsetX = Math.sin(time) * 5;
                    const offsetY = Math.cos(time) * 5;
                    
                    ctx.save();
                    ctx.translate(offsetX, offsetY);
                    ctx.fillRect(-offsetX, -offsetY, CANVAS_WIDTH + offsetX*2, CANVAS_HEIGHT + offsetY*2);
                    ctx.restore();
                    
                    // Reset alpha
                    ctx.globalAlpha = 1.0;
                    
                    // Gradient overlay for depth
                    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
                    gradient.addColorStop(0, 'rgba(15, 15, 50, 0.85)');
                    gradient.addColorStop(0.5, 'rgba(25, 25, 70, 0.8)');
                    gradient.addColorStop(1, 'rgba(15, 15, 40, 0.9)');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                } else {
                    // Fallback if texture isn't loaded
                    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
                    gradient.addColorStop(0, 'rgba(25, 25, 60, 0.9)');
                    gradient.addColorStop(1, 'rgba(20, 20, 40, 0.95)');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                }
                
                // Draw enhanced pixelated border (Minecraft-style)
                const borderWidth = 20;
                
                // Create a wood-like color gradient
                const woodGradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                woodGradient.addColorStop(0, '#8B4513'); // Standard wood
                woodGradient.addColorStop(0.3, '#A0522D'); // Lighter wood
                woodGradient.addColorStop(0.6, '#8B4513'); // Back to standard
                woodGradient.addColorStop(1, '#6B3E26'); // Darker wood
                ctx.fillStyle = woodGradient;
                
                // Top border with enhanced pixel effect
                for (let x = 0; x < CANVAS_WIDTH; x += borderWidth) {
                    const height = borderWidth + Math.floor(Math.random() * 15) - 7;
                    const width = borderWidth + Math.floor(Math.random() * 10) - 5;
                    // Add some randomness to color
                    const colorVariation = Math.random() * 20 - 10;
                    ctx.fillStyle = `rgb(${139 + colorVariation}, ${69 + colorVariation}, ${19 + colorVariation})`;
                    ctx.fillRect(x, 0, width, height);
                }
                
                // Bottom border with enhanced pixel effect
                for (let x = 0; x < CANVAS_WIDTH; x += borderWidth) {
                    const height = borderWidth + Math.floor(Math.random() * 15) - 7;
                    const width = borderWidth + Math.floor(Math.random() * 10) - 5;
                    const colorVariation = Math.random() * 20 - 10;
                    ctx.fillStyle = `rgb(${139 + colorVariation}, ${69 + colorVariation}, ${19 + colorVariation})`;
                    ctx.fillRect(x, CANVAS_HEIGHT - height, width, height);
                }
                
                // Left border with enhanced pixel effect
                for (let y = 0; y < CANVAS_HEIGHT; y += borderWidth) {
                    const width = borderWidth + Math.floor(Math.random() * 15) - 7;
                    const height = borderWidth + Math.floor(Math.random() * 10) - 5;
                    const colorVariation = Math.random() * 20 - 10;
                    ctx.fillStyle = `rgb(${139 + colorVariation}, ${69 + colorVariation}, ${19 + colorVariation})`;
                    ctx.fillRect(0, y, width, height);
                }
                
                // Right border with enhanced pixel effect
                for (let y = 0; y < CANVAS_HEIGHT; y += borderWidth) {
                    const width = borderWidth + Math.floor(Math.random() * 15) - 7;
                    const height = borderWidth + Math.floor(Math.random() * 10) - 5;
                    const colorVariation = Math.random() * 20 - 10;
                    ctx.fillStyle = `rgb(${139 + colorVariation}, ${69 + colorVariation}, ${19 + colorVariation})`;
                    ctx.fillRect(CANVAS_WIDTH - width, y, width, height);
                }
                
                // Title
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '48px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(this.title, CANVAS_WIDTH / 2, 100);
                
                // Subtitle
                ctx.fillStyle = '#EEEEEE';
                ctx.font = '24px Arial';
                ctx.fillText(this.subtitle, CANVAS_WIDTH / 2, 140);
                
                // Instructions box
                var boxWidth = 500;
                var boxHeight = 220;
                var boxX = CANVAS_WIDTH / 2 - boxWidth / 2;
                var boxY = 170;
                
                // Box background
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
                
                // Box border
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 4;
                ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
                
                // Instructions text
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Welcome to Bow Builder Quest!', CANVAS_WIDTH / 2, boxY + 40);
                ctx.font = '16px Arial';
                var instructions = [
                    'Help Dave escape the zombie-infested forest:',
                    '• Jump on platforms and answer quiz questions',
                    '• Each correct answer gives you crafting materials',
                    '• Collect 10 Sticks, 5 Strings, 5 Flint, and 5 Feathers',
                    '• Watch out for zombies! You can jump over them',
                    '• Craft your bow to defeat zombies and escape',
                    '• Use arrow keys (or WASD) to move and SPACE to jump'
                ];
                instructions.forEach(function(line, index) {
                    ctx.fillText(line, CANVAS_WIDTH / 2, boxY + 80 + index * 25);
                });
                
                // Start button
                ctx.fillStyle = this.startButton.hovered ? '#5D9CEC' : '#4A89DC';
                ctx.fillRect(this.startButton.x, this.startButton.y, this.startButton.width, this.startButton.height);
                
                // Button border
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.startButton.x, this.startButton.y, this.startButton.width, this.startButton.height);
                
                // Button text
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.startButton.text, this.startButton.x + this.startButton.width / 2, this.startButton.y + this.startButton.height / 2);
            }
        }
    ]);
    return WelcomeScreen;
}();
export { WelcomeScreen as default };
