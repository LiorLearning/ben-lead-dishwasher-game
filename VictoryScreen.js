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
                // Semi-transparent overlay
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                // Victory background panel
                ctx.fillStyle = '#2E7D32';
                ctx.fillRect(CANVAS_WIDTH / 2 - 250, CANVAS_HEIGHT / 2 - 150, 500, 300);
                // Panel border
                ctx.strokeStyle = '#8BC34A';
                ctx.lineWidth = 4;
                ctx.strokeRect(CANVAS_WIDTH / 2 - 250, CANVAS_HEIGHT / 2 - 150, 500, 300);
                // Victory title
                ctx.fillStyle = '#FFEB3B';
                ctx.font = 'bold 36px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('VICTORY!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100);
                // Victory message
                ctx.fillStyle = 'white';
                ctx.font = '20px Arial';
                ctx.fillText('You found the portal with your Golden Boots!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
                ctx.fillText('Level 3 to be designed by Sandro', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
                // Draw restart button
                ctx.fillStyle = this.restartButton.hovered ? '#4CAF50' : '#388E3C';
                ctx.fillRect(this.restartButton.x, this.restartButton.y, this.restartButton.width, this.restartButton.height);
                // Button border
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.restartButton.x, this.restartButton.y, this.restartButton.width, this.restartButton.height);
                // Button text
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.restartButton.text, this.restartButton.x + this.restartButton.width / 2, this.restartButton.y + this.restartButton.height / 2);
            }
        }
    ]);
    return VictoryScreen;
}();
export { VictoryScreen as default };
