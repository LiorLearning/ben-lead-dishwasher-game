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
import { MINING_REQUIRED_CLICKS } from './constants.js';
var MiningSpot = /*#__PURE__*/ function() {
    "use strict";
    function MiningSpot(x, y, type) {
        _class_call_check(this, MiningSpot);
        this.x = x;
        this.y = y;
        this.width = 45; // Adjusted to be more square like iron ore block
        this.height = 45; // Adjusted to be more square like iron ore block
        this.type = type; // The resource type this spot produces
        this.clickCount = 0;
        this.mined = false;
        this.active = true;
        this.quizCompleted = false;
        this.resourceSpawned = false;
        this.id = "mining-".concat(Math.random().toString(36).substr(2, 9));
        this.respawnTimer = 0;
        this.respawnDuration = 10000; // 10 seconds to respawn
        this.isRespawning = false;
    }
    _create_class(MiningSpot, [
        {
            key: "increaseClickCount",
            value: function increaseClickCount() {
                if (this.mined || !this.active) return false;
                this.clickCount++;
                if (this.clickCount >= MINING_REQUIRED_CLICKS) {
                    this.mined = true;
                    this.startRespawnTimer(); // Start respawn timer when mining is complete
                    return true; // Mining complete
                }
                return false; // Still mining
            }
        },
        {
            key: "reset",
            value: function reset() {
                this.clickCount = 0;
                this.mined = false;
                this.resourceSpawned = false;
                this.isRespawning = false;
                this.respawnTimer = 0;
            }
        },
        {
            key: "startRespawnTimer",
            value: function startRespawnTimer() {
                this.isRespawning = true;
                this.respawnTimer = this.respawnDuration;
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
                // Handle respawning logic
                if (this.isRespawning && this.respawnTimer > 0) {
                    this.respawnTimer -= deltaTime;
                    if (this.respawnTimer <= 0) {
                        this.reset(); // Reset the mining spot when respawn timer finishes
                    }
                }
            }
        },
        {
            key: "render",
            value: function render(ctx, cameraOffset, assetLoader) {
                if (!this.active) return;
                var screenX = this.x - cameraOffset;
                // Skip rendering if offscreen
                if (screenX < -this.width || screenX > ctx.canvas.width) {
                    return;
                }
                // Get mining block texture
                var greyCubeTexture = assetLoader === null || assetLoader === void 0 ? void 0 : assetLoader.getAsset('greyCubeBlock');
                var ironOreTexture = assetLoader === null || assetLoader === void 0 ? void 0 : assetLoader.getAsset('ironOre'); // Keep for fallback
                // Draw mining spot
                if (this.isRespawning) {
                    // Show respawning indicator
                    var respawnProgress = this.respawnTimer / this.respawnDuration;
                    // Base box with darker color (fallback if image not available)
                    if (!greyCubeTexture && !ironOreTexture) {
                        ctx.fillStyle = '#5D4037'; // Darker brown for respawning
                        ctx.fillRect(screenX, this.y, this.width, this.height);
                    } else {
                        // Draw faded iron ore texture when respawning
                        ctx.globalAlpha = 0.4;
                        // Use grey cube texture if available, otherwise fall back to iron ore
                        if (greyCubeTexture) {
                            ctx.drawImage(greyCubeTexture, screenX, this.y, this.width, this.height);
                        } else if (ironOreTexture) {
                            ctx.drawImage(ironOreTexture, screenX, this.y, this.width, this.height);
                        }
                        ctx.globalAlpha = 1.0;
                    }
                    // Draw progress bar for respawn
                    var barWidth = this.width - 6;
                    var barHeight = 6;
                    var barX = screenX + 3;
                    var barY = this.y + this.height + 5;
                    // Background of progress bar
                    ctx.fillStyle = '#444';
                    ctx.fillRect(barX, barY, barWidth, barHeight);
                    // Progress indication
                    ctx.fillStyle = '#8BC34A'; // Green progress
                    ctx.fillRect(barX, barY, barWidth * (1 - respawnProgress), barHeight);
                    // Text indication
                    ctx.fillStyle = 'white';
                    ctx.font = '10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Respawning...', screenX + this.width / 2, barY + barHeight + 12);
                } else if (!this.mined) {
                    if (greyCubeTexture || ironOreTexture) {
                        // Draw grey cube texture (preferred) or fall back to iron ore texture
                        if (greyCubeTexture) {
                            ctx.drawImage(greyCubeTexture, screenX, this.y, this.width, this.height);
                        } else if (ironOreTexture) {
                            ctx.drawImage(ironOreTexture, screenX, this.y, this.width, this.height);
                        }
                        // Add 2D mining progress animation when mining
                        if (this.clickCount > 0) {
                            // Add darker overlay to show damage
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                            ctx.fillRect(screenX, this.y, this.width, this.height);
                            // Draw mining progress as a grid of breaking blocks
                            var gridSize = 3; // 3x3 grid
                            var cellWidth = this.width / gridSize;
                            var cellHeight = this.height / gridSize;
                            var progress = this.clickCount / MINING_REQUIRED_CLICKS;
                            // Calculate how many cells to break based on progress
                            var totalCells = gridSize * gridSize;
                            var cellsToBroken = Math.ceil(progress * totalCells);
                            // Draw broken cell pattern
                            for(var i = 0; i < cellsToBroken; i++){
                                // Determine cell position (in a fixed pattern for consistency)
                                // We break the block in a specific pattern rather than randomly
                                var row = Math.floor(i / gridSize);
                                var col = i % gridSize;
                                var cellX = screenX + col * cellWidth;
                                var cellY = this.y + row * cellHeight;
                                // Create a dark gap to show the cell is broken
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                                ctx.fillRect(cellX + 1, cellY + 1, cellWidth - 2, cellHeight - 2);
                                // Add some debris particles for the broken cell
                                ctx.fillStyle = 'rgba(128, 128, 128, 0.8)';
                                for(var j = 0; j < 4; j++){
                                    var debrisSize = 1 + Math.random() * 2;
                                    var offsetX = Math.random() * cellWidth;
                                    var offsetY = Math.random() * cellHeight;
                                    ctx.fillRect(cellX + offsetX, cellY + offsetY, debrisSize, debrisSize);
                                }
                            }
                            // Add a clean 2D progress bar above the mining spot
                            var progressBarWidth = this.width;
                            var progressBarHeight = 8;
                            var progressBarX = screenX;
                            var progressBarY = this.y - progressBarHeight - 5;
                            // Progress bar background
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                            ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
                            // Progress bar fill - we use green to yellow to red gradient as mining progresses
                            // Reuse the existing progress variable defined earlier
                            // Create horizontal progress fill
                            var fillWidth = progressBarWidth * progress;
                            // Create gradient from green to red based on progress
                            var gradient = ctx.createLinearGradient(progressBarX, 0, progressBarX + progressBarWidth, 0);
                            gradient.addColorStop(0, '#4CAF50'); // Green
                            gradient.addColorStop(0.5, '#FFEB3B'); // Yellow
                            gradient.addColorStop(1, '#F44336'); // Red
                            ctx.fillStyle = gradient;
                            ctx.fillRect(progressBarX, progressBarY, fillWidth, progressBarHeight);
                            // Add border to progress bar
                            ctx.strokeStyle = 'white';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
                            // Add flying debris particles for visual effect
                            ctx.fillStyle = 'rgba(150, 150, 150, 0.7)';
                            var debrisCount = Math.floor(this.clickCount * 3);
                            for(var i1 = 0; i1 < debrisCount; i1++){
                                var size = 1 + Math.random() * 3;
                                // Particles disperse in a more 2D pattern (less random)
                                var angle = Math.random() * Math.PI * 2;
                                var distance = 5 + Math.random() * 15;
                                var debrisX = screenX + this.width / 2 + Math.cos(angle) * distance;
                                var debrisY = this.y + this.height / 2 + Math.sin(angle) * distance - Math.random() * 10; // Slightly upward bias
                                ctx.beginPath();
                                ctx.arc(debrisX, debrisY, size, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        }
                    } else {
                        // Fallback if texture isn't loaded
                        ctx.fillStyle = '#8B4513'; // Brown
                        ctx.fillRect(screenX, this.y, this.width, this.height);
                        // Improved mining animation with dirt texture
                        if (this.clickCount > 0) {
                            // Add texture to the unmined portion
                            for(var i2 = 0; i2 < 10; i2++){
                                ctx.fillStyle = '#7D5A38'; // Darker specks
                                var dotX = screenX + Math.random() * this.width;
                                var dotY = this.y + Math.random() * this.height;
                                var dotSize = 1 + Math.random() * 3;
                                ctx.fillRect(dotX, dotY, dotSize, dotSize);
                            }
                            // Show mining progress with visual chunks being removed
                            for(var i3 = 0; i3 < this.clickCount; i3++){
                                var chunkX = screenX + this.width / MINING_REQUIRED_CLICKS * i3;
                                var chunkWidth = this.width / MINING_REQUIRED_CLICKS;
                                // Make the mined area look more natural with irregular shapes
                                var irregularTop = 2 + Math.random() * 4;
                                var irregularHeight = this.height - irregularTop - Math.random() * 4;
                                ctx.fillStyle = '#A52A2A'; // Darker brown for mined portion
                                ctx.fillRect(chunkX, this.y + irregularTop, chunkWidth, irregularHeight);
                            }
                        }
                    }
                    // "Press E" indicator with animated text for better visibility
                    ctx.fillStyle = 'white';
                    ctx.font = '14px Arial';
                    ctx.textAlign = 'center';
                    // Animate the text with a slight bounce based on time
                    var bounceAmount = Math.sin(Date.now() / 300) * 2;
                    ctx.fillText('Press E to mine', screenX + this.width / 2, this.y - 15 + bounceAmount);
                    // Add small shovel icon
                    this.drawShovelIcon(ctx, screenX + this.width / 2 - 30, this.y - 15);
                    // Add subtle glow around unmined blocks to make them more noticeable
                    if (!this.isRespawning && !this.mined && this.clickCount === 0) {
                        var gradient1 = ctx.createRadialGradient(screenX + this.width / 2, this.y + this.height / 2, this.width / 3, screenX + this.width / 2, this.y + this.height / 2, this.width);
                        gradient1.addColorStop(0, 'rgba(255, 255, 255, 0)');
                        gradient1.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
                        ctx.fillStyle = gradient1;
                        ctx.fillRect(screenX - 10, this.y - 10, this.width + 20, this.height + 20);
                    }
                } else if (this.resourceSpawned) {
                    // Draw an outline to show this spot has been mined
                    ctx.strokeStyle = '#555';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(screenX, this.y, this.width, this.height);
                    // Draw text to indicate resource was found
                    ctx.fillStyle = '#AAA';
                    ctx.font = '10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Mined', screenX + this.width / 2, this.y + this.height / 2);
                    // Start respawn timer after resource is spawned and collected
                    if (!this.isRespawning) {
                        this.startRespawnTimer();
                    }
                }
            }
        },
        {
            key: "drawShovelIcon",
            value: function drawShovelIcon(ctx, x, y) {
                // Draw shovel handle
                ctx.fillStyle = '#8B4513'; // Brown handle
                ctx.fillRect(x, y, 15, 3);
                // Draw shovel head
                ctx.fillStyle = '#A9A9A9'; // Gray shovel head
                ctx.fillRect(x + 15, y - 3, 8, 8);
            }
        }
    ]);
    return MiningSpot;
}();
export { MiningSpot as default };
