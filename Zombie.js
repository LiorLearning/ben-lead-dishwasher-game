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
import { GROUND_LEVEL } from './constants.js';
import { isColliding } from './utils.js';
import { Toast } from './Toast.js';

var Zombie = /*#__PURE__*/ function() {
    "use strict";
    function Zombie(x, patrolStart, patrolEnd, game) {
        var platform = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : null;
        _class_call_check(this, Zombie);
        this.x = x;
        this.y = platform ? platform.y - 50 : GROUND_LEVEL - 10; // Adjusted to match visual position of zombie
        this.width = 30; // Slightly wider to match zombie image
        this.height = 50; // Taller to match zombie image
        this.baseSpeed = 0.8; // Increased from 0.5 to 0.8 for faster movement
        this.speed = this.baseSpeed;
        this.direction = 1; // 1 for right, -1 for left
        this.goldNuggetsCollected = 0;
        // Health system
        this.health = 2;
        this.isHit = false;
        this.hitTimer = 0;
        this.hitDuration = 500;
        this.showFlash = false;
        // Patrol zone
        this.patrolStart = patrolStart || x - 150;
        this.patrolEnd = patrolEnd || x + 150;
        // Platform the zombie is on (if any)
        this.platform = platform;
        // Falling animation properties
        this.isFalling = false;
        this.fallVelocity = 0;
        // Animation
        this.frameCount = 0;
        this.animationSpeed = 10;
        this.currentFrame = 0;
        this.totalFrames = 4; // 4 frame simple animation
        this.game = game;
        this.active = true;
        this.throwCooldown = 0;
        this.throwRange = 150; // Reduced from 200 to 100 pixels
        this.throwCooldownTime = 250; // 3 seconds at 60fps
    }
    _create_class(Zombie, [
        {
            key: "update",
            value: function update(deltaTime) {
                if (!this.active) return;

                // Update hit effect if active
                if (this.isHit) {
                    this.hitTimer += deltaTime;
                    // Toggle flash effect
                    if (this.hitTimer >= 100) {
                        this.showFlash = !this.showFlash;
                        this.hitTimer = 0;
                    }
                    // End hit effect when duration is over
                    if (this.hitTimer >= this.hitDuration) {
                        this.isHit = false;
                        this.hitTimer = 0;
                        this.showFlash = false;
                    }
                }

                // Check if player is in range
                const dx = this.game.player.x - this.x;
                const distance = Math.abs(dx);
                
                if (distance <= this.throwRange) {
                    // Face the player
                    this.direction = dx > 0 ? 1 : -1;
                    
                    // Throw toast if cooldown is ready
                    if (this.throwCooldown <= 0) {
                        this.throwToast();
                        this.throwCooldown = 90; // Reduced from 120 to 90 frames (1.5 seconds at 60fps)
                    }
                } else {
                    // Normal movement
                    this.x += this.speed * this.direction;
                    
                    // Check for wall collision
                    if (this.x <= 0 || this.x >= this.game.world.levelWidth - this.width) {
                        this.direction *= -1;
                    }
                }

                // Update cooldown
                if (this.throwCooldown > 0) {
                    this.throwCooldown--;
                }

                // Add falling state and velocity for animation
                this.isFalling = false;
                this.fallVelocity = this.fallVelocity || 0;
                // Check if zombie is about to walk off platform edge
                if (this.platform) {
                    var onPlatform = this.x + this.width > this.platform.x && this.x < this.platform.x + this.platform.width;
                    if (!onPlatform) {
                        // Zombie walked off the platform edge, start falling animation
                        this.isFalling = true;
                        this.platform = null;
                        this.fallVelocity = 0; // Initialize fall velocity
                    } else {
                        // Stay on platform
                        this.y = this.platform.y - this.height;
                    }
                }
                // Handle falling animation
                if (this.isFalling) {
                    // Apply gravity to falling velocity
                    this.fallVelocity += 0.4;
                    this.y += this.fallVelocity;
                    // Check if zombie reached ground level
                    if (this.y >= GROUND_LEVEL - 5) {
                        this.y = GROUND_LEVEL - 5;
                        this.isFalling = false;
                        this.fallVelocity = 0;
                    }
                } else if (!this.platform) {
                    // If on ground, stay at ground level
                    this.y = GROUND_LEVEL - 5;
                }
                // Change direction if reaching patrol boundary
                if (this.x <= this.patrolStart) {
                    this.direction = 1; // Move right
                } else if (this.x >= this.patrolEnd) {
                    this.direction = -1; // Move left
                }
                // Update animation frame
                this.frameCount++;
                if (this.frameCount >= this.animationSpeed) {
                    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                    this.frameCount = 0;
                }
            }
        },
        {
            key: "updateSpeed",
            value: function updateSpeed(resources) {
                // Calculate total resources collected
                const totalResources = (resources.wood || 0) + (resources.metal || 0) + (resources.blueFlame || 0);
                // Increase speed by 0.1 for each resource collected
                this.speed = Math.min(this.baseSpeed + totalResources * 0.1, 1.2); // Cap speed at 1.2
            }
        },
        {
            key: "checkCollision",
            value: function checkCollision(player) {
                // Create optimized collision bounds to match the visual appearance of the zombie sprite
                // The full body zombie image has some transparent space around it, so adjust collision accordingly
                var zombieBounds = {
                    x: this.x + 7,
                    y: this.y + 10,
                    width: this.width - 14,
                    height: this.height - 12 // Reduce height to match the actual body in the sprite
                };
                // Also check if player is jumping over the zombie - higher jump = better chance to clear
                var playerBounds = player.getBounds();
                // If player is moving upward quickly, give additional leeway for jumping over zombies
                if (player.velocityY < -4) {
                    // Player is jumping upward strongly, increase their chance to clear the zombie
                    zombieBounds.height -= 10; // Further reduce collision height
                }
                return isColliding(playerBounds, zombieBounds);
            }
        },
        {
            key: "handleSpearHit",
            value: function handleSpearHit() {
                this.health--;
                this.isHit = true;
                this.hitTimer = 0;
                this.showFlash = true;
                return this.health <= 0;
            }
        },
        {
            key: "render",
            value: function render(ctx, cameraOffset, assetLoader) {
                if (!this.active) return;

                const screenX = this.x - cameraOffset;
                
                // Don't render if off screen
                if (screenX < -this.width || screenX > ctx.canvas.width) {
                    return;
                }

                // Save context for rotation during falling
                ctx.save();
                // Apply visual effects for falling zombie
                if (this.isFalling) {
                    // Center of zombie for rotation
                    var centerX = screenX + this.width / 2;
                    var centerY = this.y + this.height / 2;
                    // Rotate zombie slightly based on falling velocity
                    var rotationAngle = Math.min(this.fallVelocity * 0.05, 0.3);
                    ctx.translate(centerX, centerY);
                    ctx.rotate(rotationAngle * this.direction); // Direction affects rotation side
                    ctx.translate(-centerX, -centerY);
                }
                // Get zombie texture if available
                var piglinTexture = assetLoader === null || assetLoader === void 0 ? void 0 : assetLoader.getAsset('piglin');
                if (piglinTexture) {
                    // Draw the piglin image instead of rendering shapes
                    var piglinWidth = this.width * 1.5;
                    var piglinHeight = this.height * 1.6;
                    // Calculate piglin position (centered)
                    var piglinX = screenX - (piglinWidth - this.width) / 2;
                    var piglinY = this.y - (piglinHeight - this.height);
                    // Apply scaling and flipping based on direction and animation
                    ctx.save();
                    // Center of piglin for transformations
                    var centerX1 = piglinX + piglinWidth / 2;
                    var centerY1 = piglinY + piglinHeight / 2;
                    // Apply transformations relative to the center
                    ctx.translate(centerX1, centerY1);
                    // Flip horizontally based on direction
                    if (this.direction < 0) {
                        ctx.scale(-1, 1);
                    }
                    // Add slight wobble based on animation frame
                    var wobbleAngle = Math.sin(this.currentFrame * (Math.PI / 2)) * 0.05;
                    ctx.rotate(wobbleAngle);
                    // When falling, apply additional rotation
                    if (this.isFalling) {
                        var fallRotation = Math.min(this.fallVelocity * 0.05, 0.3) * this.direction;
                        ctx.rotate(fallRotation);
                    }
                    // Apply flash effect if hit
                    if (this.showFlash) {
                        ctx.globalAlpha = 0.5;
                    }
                    // Draw piglin image centered at origin (after transformations)
                    ctx.drawImage(piglinTexture, -piglinWidth / 2, -piglinHeight / 2, piglinWidth, piglinHeight);
                    ctx.restore();
                } else {
                    // Fallback if texture isn't loaded - draw simple zombie shape
                    ctx.fillStyle = '#F5C242'; // Piglin gold color
                    ctx.fillRect(screenX, this.y, this.width, this.height);
                }
                // Render health bar
                if (this.health > 0) {
                    var healthBarWidth = 30;
                    var healthBarHeight = 4;
                    var healthBarX = screenX + (this.width - healthBarWidth) / 2;
                    var healthBarY = this.y - 10;
                    // Background
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
                    // Health
                    ctx.fillStyle = this.health === 2 ? '#00FF00' : '#FF0000';
                    ctx.fillRect(healthBarX, healthBarY, healthBarWidth * (this.health / 2), healthBarHeight);
                }
                // Add "falling" text above zombie if it's falling
                if (this.isFalling) {
                    ctx.fillStyle = 'white';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText("Oink!", screenX + this.width / 2, this.y - 25);
                    // Add falling dust particles if falling
                    if (this.isFalling && this.fallVelocity > 2) {
                        ctx.fillStyle = 'rgba(150, 150, 150, 0.5)';
                        for(var i = 0; i < 3; i++){
                            var particleSize = 2 + Math.random() * 3;
                            ctx.fillRect(screenX + Math.random() * this.width, this.y + this.height - 5 + Math.random() * 10, particleSize, particleSize);
                        }
                    }
                }
                // Restore context after rotation
                ctx.restore();
            }
        },
        {
            key: "throwToast",
            value: function throwToast() {
                const toast = new Toast(
                    this.x + (this.direction > 0 ? this.width : 0),
                    this.y + this.height / 2,
                    this.direction,
                    this.game
                );
                this.game.activeToasts.push(toast);
            }
        }
    ]);
    return Zombie;
}();

export { Zombie as default };
