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
var Piglin = /*#__PURE__*/ function() {
    "use strict";
    function Piglin(x, patrolStart, patrolEnd) {
        var platform = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
        _class_call_check(this, Piglin);
        this.x = x;
        this.y = platform ? platform.y - 50 : GROUND_LEVEL - 10;
        this.width = 30;
        this.height = 50;
        this.baseSpeed = 0.5;
        this.speed = this.baseSpeed;
        this.direction = 1;
        this.patrolStart = patrolStart || x - 150;
        this.patrolEnd = patrolEnd || x + 150;
        this.platform = platform;
        this.isFalling = false;
        this.fallVelocity = 0;
        this.frameCount = 0;
        this.animationSpeed = 10;
        this.currentFrame = 0;
        this.totalFrames = 4;
        this.particles = []; // Array to store gold particles
        this.goldNuggetsCollected = 0;
    }
    _create_class(Piglin, [
        {
            key: "updateSpeed",
            value: function updateSpeed(goldNuggets) {
                this.goldNuggetsCollected = goldNuggets;
                var speedIncreases = Math.floor(this.goldNuggetsCollected / 6);
                this.speed = this.baseSpeed + speedIncreases * 0.15;
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
                this.x += this.speed * this.direction;
                if (this.platform) {
                    var onPlatform = this.x + this.width > this.platform.x && this.x < this.platform.x + this.platform.width;
                    if (!onPlatform) {
                        this.isFalling = true;
                        this.platform = null;
                        this.fallVelocity = 0;
                    } else {
                        this.y = this.platform.y - this.height;
                    }
                }
                if (this.isFalling) {
                    this.fallVelocity += 0.4;
                    this.y += this.fallVelocity;
                    if (this.y >= GROUND_LEVEL - 5) {
                        this.y = GROUND_LEVEL - 5;
                        this.isFalling = false;
                        this.fallVelocity = 0;
                        // Create gold particles when landing
                        this._createGoldParticles();
                    }
                } else if (!this.platform) {
                    this.y = GROUND_LEVEL - 5;
                }
                if (this.x <= this.patrolStart) {
                    this.direction = 1;
                } else if (this.x >= this.patrolEnd) {
                    this.direction = -1;
                }
                this._updateParticles();
                this.frameCount++;
                if (this.frameCount >= this.animationSpeed) {
                    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                    this.frameCount = 0;
                }
            }
        },
        {
            key: "checkCollision",
            value: function checkCollision(player) {
                var piglinBounds = {
                    x: this.x + 7,
                    y: this.y + 10,
                    width: this.width - 14,
                    height: this.height - 12
                };
                var playerBounds = player.getBounds();
                if (player.velocityY < -4) {
                    piglinBounds.height -= 10;
                }
                return isColliding(playerBounds, piglinBounds);
            }
        },
        {
            key: "render",
            value: function render(ctx, cameraOffset, assetLoader) {
                var screenX = this.x - cameraOffset;
                if (screenX < -this.width || screenX > ctx.canvas.width) {
                    return;
                }
                ctx.save();
                if (this.isFalling) {
                    var centerX = screenX + this.width / 2;
                    var centerY = this.y + this.height / 2;
                    var rotationAngle = Math.min(this.fallVelocity * 0.05, 0.3);
                    ctx.translate(centerX, centerY);
                    ctx.rotate(rotationAngle * this.direction);
                    ctx.translate(-centerX, -centerY);
                }
                var piglinTexture = assetLoader === null || assetLoader === void 0 ? void 0 : assetLoader.getAsset('piglin');
                if (piglinTexture) {
                    // Use original dimensions and scale down proportionally
                    var scale = 0.3; // Scale factor to make it fit in the game
                    var piglinWidth = piglinTexture.width * scale;
                    var piglinHeight = piglinTexture.height * scale;
                    
                    var piglinX = screenX - (piglinWidth - this.width) / 2;
                    var piglinY = this.y - (piglinHeight - this.height);
                    ctx.save();
                    var centerX1 = piglinX + piglinWidth / 2;
                    var centerY1 = piglinY + piglinHeight / 2;
                    ctx.translate(centerX1, centerY1);
                    if (this.direction < 0) {
                        ctx.scale(-1, 1);
                    }
                    var wobbleAngle = Math.sin(this.currentFrame * (Math.PI / 2)) * 0.05;
                    ctx.rotate(wobbleAngle);
                    if (this.isFalling) {
                        var fallRotation = Math.min(this.fallVelocity * 0.05, 0.3) * this.direction;
                        ctx.rotate(fallRotation);
                    }
                    ctx.drawImage(piglinTexture, -piglinWidth / 2, -piglinHeight / 2, piglinWidth, piglinHeight);
                    ctx.restore();
                } else {
                    ctx.fillStyle = '#F5C242'; // Piglin gold color
                    ctx.fillRect(screenX, this.y, this.width, this.height);
                }
                if (this.isFalling) {
                    ctx.fillStyle = 'white';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText("Oink!", screenX + this.width / 2, this.y - 25);
                }
                ctx.restore();
                this._renderParticles(ctx, cameraOffset);
            }
        },
        {
            key: "_createGoldParticles",
            value: function _createGoldParticles() {
                // Create 5-8 gold particles when piglin lands
                var particleCount = 5 + Math.floor(Math.random() * 4);
                for(var i = 0; i < particleCount; i++){
                    this.particles.push({
                        x: this.x + this.width / 2,
                        y: this.y + this.height,
                        size: 2 + Math.random() * 3,
                        speedX: -2 + Math.random() * 4,
                        speedY: -1 - Math.random() * 3,
                        life: 30 + Math.random() * 30
                    });
                }
            }
        },
        {
            key: "_updateParticles",
            value: function _updateParticles() {
                for(var i = this.particles.length - 1; i >= 0; i--){
                    var p = this.particles[i];
                    p.x += p.speedX;
                    p.y += p.speedY;
                    p.speedY += 0.1; // Gravity
                    p.life--;
                    if (p.life <= 0) {
                        this.particles.splice(i, 1);
                    }
                }
            }
        },
        {
            key: "_renderParticles",
            value: function _renderParticles(ctx, cameraOffset) {
                var screenX = this.x - cameraOffset;
                ctx.save();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.particles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var p = _step.value;
                        var alpha = Math.min(1, p.life / 20);
                        ctx.fillStyle = "rgba(255, 215, 0, ".concat(alpha, ")"); // Gold color
                        ctx.beginPath();
                        ctx.arc(p.x - cameraOffset, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                ctx.restore();
            }
        }
    ]);
    return Piglin;
}();
export { Piglin as default };
