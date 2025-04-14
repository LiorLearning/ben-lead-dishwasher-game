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
var VictoryScreen = /*#__PURE__*/ function() {
    "use strict";
    function VictoryScreen(game) {
        _class_call_check(this, VictoryScreen);
        this.game = game;
        this.visible = false;
        // Button properties
        this.restartButton = {
            x: CANVAS_WIDTH / 2 - 100,
            y: CANVAS_HEIGHT / 2 + 50,
            width: 200,
            height: 60,
            text: "PLAY AGAIN",
            hovered: false
        };
        // Setup event listeners
        this.setupListeners();
    }
    _create_class(VictoryScreen, [
        {
            key: "setupListeners",
            value: function setupListeners() {
                this.mouseMoveHandler = this.handleMouseMove.bind(this);
                this.clickHandler = this.handleClick.bind(this);
                this.touchHandler = this.handleTouch.bind(this);
                this.game.canvas.addEventListener('mousemove', this.mouseMoveHandler);
                this.game.canvas.addEventListener('click', this.clickHandler);
                this.game.canvas.addEventListener('touchstart', this.touchHandler);
            }
        },
        {
            key: "removeListeners",
            value: function removeListeners() {
                this.game.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
                this.game.canvas.removeEventListener('click', this.clickHandler);
                this.game.canvas.removeEventListener('touchstart', this.touchHandler);
            }
        },
        {
            key: "handleMouseMove",
            value: function handleMouseMove(event) {
                if (!this.visible) return;
                var rect = this.game.canvas.getBoundingClientRect();
                var mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
                var mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);
                this.restartButton.hovered = this.isPointInButton(mouseX, mouseY, this.restartButton);
            }
        },
        {
            key: "handleClick",
            value: function handleClick(event) {
                if (!this.visible) return;
                var rect = this.game.canvas.getBoundingClientRect();
                var mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
                var mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);
                if (this.isPointInButton(mouseX, mouseY, this.restartButton)) {
                    this.restartGame();
                }
            }
        },
        {
            key: "handleTouch",
            value: function handleTouch(event) {
                if (!this.visible) return;
                event.preventDefault();
                var rect = this.game.canvas.getBoundingClientRect();
                var touch = event.touches[0];
                var touchX = (touch.clientX - rect.left) * (this.game.canvas.width / rect.width);
                var touchY = (touch.clientY - rect.top) * (this.game.canvas.height / rect.height);
                if (this.isPointInButton(touchX, touchY, this.restartButton)) {
                    this.restartGame();
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
            key: "show",
            value: function show() {
                this.visible = true;
            }
        },
        {
            key: "hide",
            value: function hide() {
                this.visible = false;
            }
        },
        {
            key: "restartGame",
            value: function restartGame() {
                this.hide();
                // Reset game state
                this.game.resources = {
                    sticks: 0,
                    strings: 0,
                    flint: 0,
                    feather: 0
                };
                // Reset player position
                this.game.player.x = 100;
                this.game.player.y = 375; // GROUND_LEVEL
                // Create a new world
                this.game.world = new World(this.game.assetLoader);
                // Reset camera
                this.game.cameraOffset = 0;
                // Update crafting panel with reset resources
                this.game.craftingPanel.updateResources(this.game.resources);
                // Switch back to playing state
                this.game.gameState = GAME_STATE.PLAYING;
            }
        },
        {
            key: "render",
            value: function render(ctx) {
                if (!this.visible) return;

                // Semi-transparent overlay with animated gradient
                const time = Date.now() / 1000;
                const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
                gradient.addColorStop(0.5 + Math.sin(time) * 0.1, 'rgba(0, 0, 0, 0.85)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                // Victory panel with glowing border
                ctx.fillStyle = '#2E7D32';
                const panelWidth = 500;
                const panelHeight = 300;
                const panelX = CANVAS_WIDTH / 2 - panelWidth / 2;
                const panelY = CANVAS_HEIGHT / 2 - panelHeight / 2;
                
                // Panel shadow
                ctx.shadowColor = 'rgba(46, 125, 50, 0.5)';
                ctx.shadowBlur = 20;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
                
                // Animated border glow
                ctx.shadowColor = '#8BC34A';
                ctx.shadowBlur = 10 + Math.sin(time * 2) * 5;
                ctx.strokeStyle = '#8BC34A';
                ctx.lineWidth = 4;
                ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

                // Reset shadow
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;

                // Victory title with glow effect
                ctx.fillStyle = '#FFEB3B';
                ctx.font = 'bold 64px Arial';
                ctx.textAlign = 'center';
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 15 + Math.sin(time * 3) * 5;
                ctx.fillText('VICTORY!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

                // Reset shadow for other text
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;

                // Victory messages with subtle animation
                ctx.fillStyle = 'white';
                ctx.font = '28px Arial';
                const yOffset = Math.sin(time * 2) * 3;
                ctx.fillText('Level 2 Complete!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + yOffset);
                ctx.fillText('Level 3 to be designed by Sandro', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40 - yOffset);

                // Animated play again button
                const buttonHoverScale = this.restartButton.hovered ? 1.1 : 1;
                const buttonWidth = this.restartButton.width * buttonHoverScale;
                const buttonHeight = this.restartButton.height * buttonHoverScale;
                const buttonX = CANVAS_WIDTH / 2 - buttonWidth / 2;
                const buttonY = this.restartButton.y;

                // Button glow effect
                ctx.shadowColor = this.restartButton.hovered ? '#4CAF50' : '#388E3C';
                ctx.shadowBlur = this.restartButton.hovered ? 20 : 10;
                
                // Button background with gradient
                const buttonGradient = ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
                buttonGradient.addColorStop(0, this.restartButton.hovered ? '#4CAF50' : '#388E3C');
                buttonGradient.addColorStop(1, this.restartButton.hovered ? '#45A049' : '#2E7D32');
                ctx.fillStyle = buttonGradient;
                
                // Draw button with rounded corners
                ctx.beginPath();
                ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
                ctx.fill();

                // Button border
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Button text with shadow
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 5;
                ctx.fillText(
                    this.restartButton.text,
                    CANVAS_WIDTH / 2,
                    buttonY + buttonHeight / 2
                );

                // Reset shadow
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            }
        }
    ]);
    return VictoryScreen;
}();
export { VictoryScreen as default };
