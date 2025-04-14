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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
import { GRAVITY, GROUND_LEVEL } from './constants.js';
var Player = /*#__PURE__*/ function() {
    "use strict";
    function Player(x, y) {
        _class_call_check(this, Player);
        _define_property(this, "game", void 0 // Reference to game object for asset loader access
        );
        this.x = x;
        this.y = y;
        this.width = 25; // Slightly wider to match Dave sprite
        this.height = 45; // Taller to match Dave sprite
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = -12;
        this.isJumping = false;
        this.hasDoubleJumped = false; // Track if double jump has been used
        this.facingRight = true;
        this.isHit = false;
        this.hitTimer = 0;
        this.hitDuration = 500; // Duration of hit effect in milliseconds
        this.flashInterval = 100; // Flash interval in milliseconds
        this.flashTimer = 0;
        this.showFlash = false;
        this.isImmune = false;
        this.immunityDuration = 1500; // 1.5 seconds of immunity after being hit
        this.immunityTimer = 0;
        this.hasShovel = true; // Player starts with a shovel
        this.hasGoldenBoots = false; // Track golden boots status
    }
    _create_class(Player, [
        {
            key: "moveLeft",
            value: function moveLeft() {
                this.velocityX = -this.speed;
                this.facingRight = false;
            }
        },
        {
            key: "moveRight",
            value: function moveRight() {
                this.velocityX = this.speed;
                this.facingRight = true;
            }
        },
        {
            key: "stop",
            value: function stop() {
                this.velocityX = 0;
            }
        },
        {
            key: "jump",
            value: function jump() {
                // First jump from ground
                if (!this.isJumping) {
                    this.velocityY = this.jumpForce;
                    this.isJumping = true;
                    this.hasDoubleJumped = false;
                } else if (this.isJumping && !this.hasDoubleJumped) {
                    this.velocityY = this.jumpForce * 0.8; // Slightly weaker second jump
                    this.hasDoubleJumped = true;
                }
            }
        },
        {
            key: "update",
            value: function update(deltaTime, world) {
                // Store previous position for platform collision detection
                var prevY = this.y;
                // Apply gravity
                this.velocityY += GRAVITY;
                // Update position
                this.x += this.velocityX;
                this.y += this.velocityY;
                // Update hit effect if active
                if (this.isHit) {
                    this.hitTimer += deltaTime;
                    this.flashTimer += deltaTime;
                    // Toggle flash effect
                    if (this.flashTimer >= this.flashInterval) {
                        this.showFlash = !this.showFlash;
                        this.flashTimer = 0;
                    }
                    // End hit effect when duration is over
                    if (this.hitTimer >= this.hitDuration) {
                        this.isHit = false;
                        this.hitTimer = 0;
                        this.showFlash = false;
                    }
                }
                // Update immunity period
                if (this.isImmune) {
                    this.immunityTimer += deltaTime;
                    if (this.immunityTimer >= this.immunityDuration) {
                        this.isImmune = false;
                        this.immunityTimer = 0;
                    }
                }
                // Keep player within canvas bounds
                if (this.x < 0) this.x = 0;
                if (this.x > world.levelWidth - this.width) this.x = world.levelWidth - this.width;
                // Check platform collisions
                var onPlatform = world.checkPlatformCollisions(this).onPlatform;
                // Only check ground collision if not on a platform
                if (!onPlatform) {
                    if (this.y >= GROUND_LEVEL) {
                        this.y = GROUND_LEVEL;
                        this.velocityY = 0;
                        this.isJumping = false;
                        this.hasDoubleJumped = false; // Reset double jump when touching ground
                    }
                } else {
                    // Reset jump state when landing on a platform
                    this.isJumping = false;
                    this.hasDoubleJumped = false;
                }
            }
        },
        {
            key: "getBounds",
            value: function getBounds() {
                // Create optimized hitbox that matches the Dave Minecraft sprite's visual appearance
                return {
                    x: this.x + 5,
                    y: this.y + 5,
                    width: this.width - 10,
                    height: this.height - 10 // Reduce height slightly for better collision feel
                };
            }
        },
        {
            key: "render",
            value: function render(ctx, screenX) {
                var _this_game_assetLoader, _this_game;
                // Get Dave texture
                var daveTexture = (_this_game = this.game) === null || _this_game === void 0 ? void 0 : (_this_game_assetLoader = _this_game.assetLoader) === null || _this_game_assetLoader === void 0 ? void 0 : _this_game_assetLoader.getAsset('dave minecraft');
                // Determine if we should show hit flash or immunity flash
                var showHitEffect = this.isHit && this.showFlash;
                var showImmuneEffect = this.isImmune && Math.floor(Date.now() / 150) % 2 === 0;
                // Apply hit effect - red overlay or color change
                if (showHitEffect || showImmuneEffect) {
                    ctx.globalAlpha = showHitEffect ? 0.7 : 0.5;
                }
                if (daveTexture) {
                    this.renderDaveSprite(ctx, screenX, daveTexture);
                } else {
                    this.renderFallbackCharacter(ctx, screenX, showHitEffect);
                }
                // Reset alpha
                if (showHitEffect || showImmuneEffect) {
                    ctx.globalAlpha = 1.0;
                }
                // Visual indicator for double jump availability
                if (this.isJumping && !this.hasDoubleJumped) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.beginPath();
                    ctx.arc(screenX + this.width / 2, this.y + this.height / 2, 8, 0, Math.PI * 2);
                    ctx.fill();
                }
                // Draw shovel when the player has one
                if (this.hasShovel) {
                    this.renderShovel(ctx, screenX);
                }
            }
        },
        {
            key: "renderDaveSprite",
            value: function renderDaveSprite(ctx, screenX, daveTexture) {
                var _this_game_assetLoader, _this_game;
                var daveWidth = this.width * 1.5;
                var daveHeight = this.height * 1.8;
                // Calculate Dave position (centered)
                var daveX = screenX - (daveWidth - this.width) / 2;
                var daveY = this.y - (daveHeight - this.height) + 5; // Adjust position to match feet
                // Save context for transformations
                ctx.save();
                // Center point for transformations
                var centerX = daveX + daveWidth / 2;
                var centerY = daveY + daveHeight / 2;
                // Apply transformations from center
                ctx.translate(centerX, centerY);
                // Flip horizontally based on facing direction
                if (!this.facingRight) {
                    ctx.scale(-1, 1);
                }
                // Add slight bob when moving
                if (Math.abs(this.velocityX) > 0.1) {
                    var bobAmount = Math.sin(Date.now() / 150) * 1.5;
                    ctx.translate(0, bobAmount);
                }
                // Apply jumping/falling animation
                if (this.isJumping) {
                    // Lean forward slightly when jumping
                    var jumpRotation = 0.1 * (this.facingRight ? 1 : -1);
                    ctx.rotate(jumpRotation);
                    if (this.velocityY > 0) {
                        // Falling down animation
                        var fallRotation = Math.min(this.velocityY * 0.01, 0.2) * (this.facingRight ? 1 : -1);
                        ctx.rotate(fallRotation);
                    }
                }
                // Draw player image - use golden boots version if equipped
                var playerTexture = this.hasGoldenBoots ? (_this_game = this.game) === null || _this_game === void 0 ? void 0 : (_this_game_assetLoader = _this_game.assetLoader) === null || _this_game_assetLoader === void 0 ? void 0 : _this_game_assetLoader.getAsset('steve minecraft with golden boots') : daveTexture;
                ctx.drawImage(playerTexture || daveTexture, -daveWidth / 2, -daveHeight / 2, daveWidth, daveHeight);
                // Add golden boots effect if equipped
                if (this.hasGoldenBoots) {
                    var _this_game_assetLoader1, _this_game1;
                    var bootsTexture = (_this_game1 = this.game) === null || _this_game1 === void 0 ? void 0 : (_this_game_assetLoader1 = _this_game1.assetLoader) === null || _this_game_assetLoader1 === void 0 ? void 0 : _this_game_assetLoader1.getAsset('steve minecraft with golden boots');
                    if (bootsTexture) {
                        // Draw boots overlay
                        ctx.drawImage(bootsTexture, -daveWidth / 2, -daveHeight / 2, daveWidth, daveHeight);
                    } else {
                        // Fallback gold color effect on feet
                        ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
                        ctx.fillRect(-daveWidth / 2, daveHeight / 2 - 10, daveWidth, 20);
                    }
                    // Add golden glow effect
                    var glowGradient = ctx.createRadialGradient(0, 0, daveWidth * 0.2, 0, 0, daveWidth * 0.5);
                    glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.1)');
                    glowGradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = glowGradient;
                    ctx.globalCompositeOperation = 'lighter';
                    ctx.fillRect(-daveWidth / 2, -daveHeight / 2, daveWidth, daveHeight);
                    ctx.globalCompositeOperation = 'source-over';
                }
                ctx.restore();
            }
        },
        {
            key: "renderFallbackCharacter",
            value: function renderFallbackCharacter(ctx, screenX, showHitEffect) {
                // Body
                ctx.fillStyle = showHitEffect ? '#FF5252' : '#5D9CEC';
                ctx.fillRect(screenX, this.y, this.width, this.height - 15);
                // Head
                ctx.fillStyle = showHitEffect ? '#FFCDD2' : '#F5D76E';
                ctx.fillRect(screenX, this.y - 15, this.width, 15);
                // Legs
                ctx.fillStyle = showHitEffect ? '#D32F2F' : '#656D78';
                ctx.fillRect(screenX, this.y + this.height - 15, this.width / 2 - 1, 15);
                ctx.fillRect(screenX + this.width / 2 + 1, this.y + this.height - 15, this.width / 2 - 1, 15);
                // Eyes 
                ctx.fillStyle = 'black';
                if (this.facingRight) {
                    ctx.fillRect(screenX + this.width - 7, this.y - 10, 3, showHitEffect ? 1 : 3);
                } else {
                    ctx.fillRect(screenX + 4, this.y - 10, 3, showHitEffect ? 1 : 3);
                }
                // Add pained expression when hit
                if (showHitEffect) {
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(screenX + this.width / 2, this.y - 5, 3, 0, Math.PI, false);
                    ctx.stroke();
                }
            }
        },
        {
            key: "renderShovel",
            value: function renderShovel(ctx, screenX) {
                // Determine shovel position based on facing direction
                var shovelX = this.facingRight ? screenX + this.width - 5 : screenX - 10;
                // Draw shovel handle
                ctx.fillStyle = '#8B4513'; // Brown handle
                ctx.fillRect(shovelX, this.y + 10, 3, 15);
                // Draw shovel head
                ctx.fillStyle = '#A9A9A9'; // Gray shovel head
                ctx.fillRect(shovelX - 3 + (this.facingRight ? 3 : 0), this.y + 5, 6, 8);
            }
        }
    ]);
    return Player;
}();
export { Player as default };
