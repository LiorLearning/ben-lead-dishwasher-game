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
import { PLATFORM_WIDTH, PLATFORM_HEIGHT } from './constants.js';
var Platform = /*#__PURE__*/ function() {
    "use strict";
    function Platform(x, y) {
        var width = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : PLATFORM_WIDTH, height = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : PLATFORM_HEIGHT, hasQuiz = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false, assetLoader = arguments.length > 5 ? arguments[5] : void 0;
        _class_call_check(this, Platform);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hasQuiz = hasQuiz; // Whether this platform triggers a quiz
        this.quizActive = false; // Whether quiz is currently triggered
        this.obsidianColor = '#191970'; // Deep obsidian color
        this.glowColor = '#8A2BE2'; // Purple glow
        this.assetLoader = assetLoader;
        this.jumpPadding = 0.8; // Additional spacing buffer for jumps
    }
    _create_class(Platform, [
        {
            // Check if the player is on this platform
            key: "isPlayerOn",
            value: function isPlayerOn(player) {
                // Player's feet position
                var playerBottom = player.y + player.height;
                var playerLastBottom = player.y - player.velocityY + player.height; // Position before velocity was applied
                // Player position relative to platform
                var isOverlappingPlatform = player.x + player.width > this.x && player.x < this.x + this.width;
                // Check if player was above platform in previous frame and is now at or below platform level
                var wasAbovePlatform = playerLastBottom <= this.y;
                var isAtOrBelowPlatform = playerBottom >= this.y - this.jumpPadding;
                // Detect when player falls onto a platform or is standing on it
                return isOverlappingPlatform && (wasAbovePlatform && isAtOrBelowPlatform || Math.abs(playerBottom - this.y) < 5 + this.jumpPadding); // Adjusted tolerance with jump padding
            }
        },
        {
            // Update platform state
            key: "update",
            value: function update(player) {
                // If the platform has a quiz and player is on it, activate the quiz
                if (this.hasQuiz && this.isPlayerOn(player) && !this.quizActive) {
                    this.quizActive = true;
                    return true; // Signal that a quiz should start
                }
                return false;
            }
        },
        {
            // Render the platform
            key: "render",
            value: function render(ctx, cameraOffset) {
                var _this_assetLoader;
                var screenX = this.x - cameraOffset;
                // Only render if visible on screen
                if (screenX < -this.width || screenX > ctx.canvas.width) {
                    return;
                }
                // Draw platform using Platform_v2 texture if available
                var platformTexture = (_this_assetLoader = this.assetLoader) === null || _this_assetLoader === void 0 ? void 0 : _this_assetLoader.getAsset('Platform_v2');
                if (platformTexture) {
                    // Calculate how many times to tile the texture horizontally
                    var tileCount = Math.ceil(this.width / platformTexture.width);
                    for(var i = 0; i < tileCount; i++){
                        ctx.drawImage(platformTexture, screenX + i * platformTexture.width, this.y, Math.min(platformTexture.width, this.width - i * platformTexture.width), this.height);
                    }
                } else {
                    // Fallback to solid color if texture not loaded
                    ctx.fillStyle = this.obsidianColor;
                    ctx.fillRect(screenX, this.y, this.width, this.height);
                }
                // Add glow edges
                var glowGradient = ctx.createLinearGradient(0, 0, 0, 10);
                glowGradient.addColorStop(0, this.glowColor);
                glowGradient.addColorStop(1, 'transparent');
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = glowGradient;
                ctx.fillRect(screenX, this.y, this.width, 8);
                ctx.globalCompositeOperation = 'source-over';
            }
        }
    ]);
    return Platform;
}();
export { Platform as default };
