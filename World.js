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
import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_LEVEL } from './constants.js';
import { isColliding } from './utils.js';
import Platform from './Platform.js';
import Zombie from './Zombie.js';
import MiningSpot from './MiningSpot.js';
import { RESOURCE_TYPES } from './constants.js';
var World = /*#__PURE__*/ function() {
    "use strict";
    function World(assetLoader, game) {
        _class_call_check(this, World);
        this.assetLoader = assetLoader;
        this.game = game;
        this.levelWidth = 4000; // Extended level width for more platforming
        this.items = [];
        this.platforms = [];
        this.toasters = []; // Array to hold toaster enemies
        this.miningSpots = []; // Array to hold mining spots
        this.cameraOffset = 0; // Add camera offset property
        this.generateLevel();
    }
    _create_class(World, [
        {
            // Method to set camera offset from Game class
            key: "setCameraOffset",
            value: function setCameraOffset(offset) {
                this.cameraOffset = offset;
            }
        },
        {
            key: "generateLevel",
            value: function generateLevel() {
                // Generate platforms
                this.generatePlatforms();
                // Generate resources
                this.generateResources();
                // Generate toasters
                this.generateToasters();
                this.generateLavaPits();
            }
        },
        {
            key: "generatePlatforms",
            value: function generatePlatforms() {
                var _this = this;
                // Ground platform (immovable base)
                this.platforms.push(new Platform(0, GROUND_LEVEL + 30, this.levelWidth, 50, false, this.assetLoader));
                // Add floating platforms (some with quizzes)
                var platformPositions = [
                    // First stack (2 platforms)
                    {
                        x: 300,
                        y: 300,
                        hasQuiz: false
                    },
                    {
                        x: 300,
                        y: 180,
                        hasQuiz: true
                    },
                    // Second stack (2 platforms)
                    {
                        x: 750,
                        y: 280,
                        hasQuiz: false
                    },
                    {
                        x: 750,
                        y: 160,
                        hasQuiz: true
                    },
                    // Third stack (2 platforms)
                    {
                        x: 1200,
                        y: 320,
                        hasQuiz: false
                    },
                    {
                        x: 1200,
                        y: 200,
                        hasQuiz: true
                    },
                    // Fourth stack 
                    {
                        x: 1650,
                        y: 290,
                        hasQuiz: false
                    },
                    {
                        x: 1650,
                        y: 170,
                        hasQuiz: true
                    },
                    // Fifth stack
                    {
                        x: 2100,
                        y: 310,
                        hasQuiz: false
                    },
                    {
                        x: 2100,
                        y: 190,
                        hasQuiz: true
                    },
                    // Sixth stack  
                    {
                        x: 2550,
                        y: 300,
                        hasQuiz: false
                    },
                    {
                        x: 2550,
                        y: 180,
                        hasQuiz: true
                    },
                    // Seventh stack
                    {
                        x: 3000,
                        y: 320,
                        hasQuiz: false
                    },
                    {
                        x: 3000,
                        y: 200,
                        hasQuiz: true
                    }
                ];
                platformPositions.forEach(function(param) {
                    var x = param.x, y = param.y, hasQuiz = param.hasQuiz;
                    _this.platforms.push(new Platform(x, y, undefined, undefined, hasQuiz, _this.assetLoader));
                });
            }
        },
        {
            key: "generateResources",
            value: function generateResources() {
                // Add mining spots instead of resources
                this.generateMiningSpots();
            }
        },
        {
            key: "generateMiningSpots",
            value: function generateMiningSpots() {
                // Place mining spots on platforms
                this.platforms.forEach((platform, index) => {
                    // Skip the ground platform (index 0)
                    if (index === 0) return;

                    // Define possible resource types
                    const resourceTypes = ['wood', 'metal', 'blueFlame'];
                    
                    // Randomly select a resource type
                    const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];

                    // Position mining spot near the platform
                    const miningSpot = new MiningSpot(
                        platform.x + platform.width / 2 - 20,
                        platform.y - 55,
                        resourceType
                    );
                    this.miningSpots.push(miningSpot);

                    // Add a toaster to guard this mining spot if it doesn't already have one
                    let hasGuard = false;
                    for (const toaster of this.toasters) {
                        if (toaster.platform === platform) {
                            hasGuard = true;
                            break;
                        }
                    }

                    // If no guard exists, add one
                    if (!hasGuard) {
                        const patrolStart = platform.x + 20;
                        const patrolEnd = platform.x + platform.width - 20;
                        const toaster = new Zombie(
                            platform.x + platform.width / 2,
                            patrolStart,
                            patrolEnd,
                            this.game,
                            platform
                        );
                        toaster.y = platform.y - toaster.height; // Position toaster on top of platform
                        this.toasters.push(toaster);
                    }
                });
            }
        },
        {
            key: "generateToasters",
            value: function generateToasters() {
                // Add toasters at different locations along the level
                const toasterPositions = [
                    {
                        x: 400,
                        patrolStart: 300,
                        patrolEnd: 600
                    },
                    {
                        x: 900,
                        patrolStart: 800,
                        patrolEnd: 1100
                    },
                    {
                        x: 1500,
                        patrolStart: 1400,
                        patrolEnd: 1750
                    },
                    {
                        x: 2200,
                        patrolStart: 2050,
                        patrolEnd: 2350
                    },
                    {
                        x: 2800,
                        patrolStart: 2650,
                        patrolEnd: 3000
                    },
                    {
                        x: 3400,
                        patrolStart: 3250,
                        patrolEnd: 3550
                    }
                ];

                // Create toaster instances on ground level
                toasterPositions.forEach(({ x, patrolStart, patrolEnd }) => {
                    this.toasters.push(new Zombie(x, patrolStart, patrolEnd, this.game));
                });

                // Add toasters on platforms
                const platformToasters = [
                    {
                        platformIndex: 1,  // First platform
                        patrolOffset: 20
                    },
                    {
                        platformIndex: 3,  // Second platform
                        patrolOffset: 20
                    },
                    {
                        platformIndex: 5,  // Third platform
                        patrolOffset: 20
                    },
                    {
                        platformIndex: 7,  // Fourth platform
                        patrolOffset: 20
                    },
                    {
                        platformIndex: 9,  // Fifth platform
                        patrolOffset: 20
                    }
                ];

                platformToasters.forEach(({ platformIndex, patrolOffset }) => {
                    if (platformIndex < this.platforms.length) {
                        const platform = this.platforms[platformIndex];
                        const x = platform.x + platform.width / 2;
                        const patrolStart = platform.x + patrolOffset;
                        const patrolEnd = platform.x + platform.width - patrolOffset;
                        const toaster = new Zombie(x, patrolStart, patrolEnd, this.game, platform);
                        toaster.y = platform.y - toaster.height; // Position toaster on top of platform
                        this.toasters.push(toaster);
                    }
                });
            }
        },
        {
            key: "checkCollision",
            value: function checkCollision(player) {
                var playerBounds = player.getBounds();
                var playerX = player.x;
                var screenWidth = CANVAS_WIDTH;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Only check items within the visible area plus a small buffer
                    for(var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var item = _step.value;
                        // Skip items that are too far from the player (broad phase)
                        if (Math.abs(item.x - playerX) > screenWidth) continue;
                        // Detailed collision check only for nearby items (narrow phase)
                        if (isColliding(playerBounds, item)) {
                            return item;
                        }
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
                return null;
            }
        },
        {
            key: "checkToasterCollisions",
            value: function checkToasterCollisions(player) {
                var playerBounds = player.getBounds();
                var playerX = player.x;
                var visibilityThreshold = CANVAS_WIDTH * 1.5; // Slightly larger than screen
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Only check toasters that are close to the player
                    for(var _iterator = this.toasters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var toaster = _step.value;
                        // Skip toasters that are too far away (broad phase)
                        if (Math.abs(toaster.x - playerX) > visibilityThreshold) continue;
                        // Only do precise collision checks for nearby toasters (narrow phase)
                        if (toaster.checkCollision(player)) {
                            return toaster;
                        }
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
                return null;
            }
        },
        {
            // Check for platform collisions
            key: "checkPlatformCollisions",
            value: function checkPlatformCollisions(player) {
                var onPlatform = false;
                var quizTriggered = false;
                var playerX = player.x;
                var platformCheckDistance = CANVAS_WIDTH; // Only check platforms within this distance
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Skip platforms that are too far from the player
                    for(var _iterator = this.platforms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var platform = _step.value;
                        // Broad phase - distance-based culling
                        if (Math.abs(platform.x - playerX) > platformCheckDistance && Math.abs(platform.x + platform.width - playerX) > platformCheckDistance) {
                            continue;
                        }
                        // Narrow phase - detailed collision check
                        if (platform.isPlayerOn(player)) {
                            onPlatform = true;
                            player.y = platform.y - player.height; // Position player on top of platform
                            player.velocityY = 0;
                            player.isJumping = false;
                            // Check if this platform triggers a quiz
                            if (platform.update(player)) {
                                quizTriggered = true;
                            }
                        }
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
                return {
                    onPlatform: onPlatform,
                    quizTriggered: quizTriggered
                };
            }
        },
        {
            key: "removeItem",
            value: function removeItem(item) {
                this.items = this.items.filter(function(i) {
                    return i.id !== item.id;
                });
            }
        },
        {
            key: "updateToasters",
            value: function updateToasters(deltaTime) {
                this.toasters.forEach(toaster => {
                    toaster.update(deltaTime);
                });
            }
        },
        {
            key: "increaseToasterSpeed",
            value: function increaseToasterSpeed(amount) {
                this.toasters.forEach(toaster => {
                    toaster.speed += amount;
                });
            }
        },
        {
            key: "updateMiningSpots",
            value: function updateMiningSpots(deltaTime) {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Update all mining spots
                    for(var _iterator = this.miningSpots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var miningSpot = _step.value;
                        miningSpot.update(deltaTime);
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
            }
        },
        {
            key: "render",
            value: function render(ctx) {
                // Use the stored camera offset
                var cameraOffset = this.cameraOffset;
                // Draw trees in the background
                for(var i = 0; i < 15; i++){
                    this.drawTree(ctx, 100 + i * 300 - cameraOffset, 335);
                }
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Draw platforms
                    for(var _iterator = this.platforms[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var platform = _step.value;
                        platform.render(ctx, cameraOffset);
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
                var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                try {
                    // Draw mining spots
                    for(var _iterator1 = this.miningSpots[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                        var miningSpot = _step1.value;
                        miningSpot.render(ctx, cameraOffset, this.assetLoader);
                    }
                } catch (err) {
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                            _iterator1.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                }
                var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                try {
                    // Draw enhanced lava pits
                    for(var _iterator2 = this.lavaPits[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                        var pit = _step2.value;
                        var screenX = pit.x - cameraOffset;
                        if (screenX < -pit.width || screenX > CANVAS_WIDTH) continue;
                        // Save context for transformations
                        ctx.save();
                        ctx.translate(screenX, pit.y);
                        // Draw lava pit texture if available
                        var img = this.assetLoader.getAsset('lava pit');
                        if (img) {
                            ctx.drawImage(img, 0, 0, pit.width, pit.height);
                        } else {
                            // Simple fallback gradient
                            var gradient = ctx.createLinearGradient(0, 0, 0, pit.height);
                            gradient.addColorStop(0, '#FF5500');
                            gradient.addColorStop(1, '#8B0000');
                            ctx.fillStyle = gradient;
                            ctx.fillRect(0, 0, pit.width, pit.height);
                        }
                        ctx.restore();
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                            _iterator2.return();
                        }
                    } finally{
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
                var _iteratorNormalCompletion3 = true, _didIteratorError3 = false, _iteratorError3 = undefined;
                try {
                    // Draw mining spots with resources
                    for(var _iterator3 = this.items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true){
                        var item = _step3.value;
                        var screenX1 = item.x - cameraOffset;
                        // Only draw if visible on screen
                        if (screenX1 > -item.width && screenX1 < CANVAS_WIDTH) {
                            if (item.image) {
                                // Draw the resource image
                                ctx.drawImage(item.image, screenX1, item.y, item.width, item.height);
                                
                                // Add a subtle glow effect
                                ctx.save();
                                ctx.globalAlpha = 0.3;
                                ctx.shadowColor = this.getResourceGlowColor(item.type);
                                ctx.shadowBlur = 10;
                                ctx.drawImage(item.image, screenX1, item.y, item.width, item.height);
                                ctx.restore();
                            } else {
                                // Fallback if image isn't loaded
                                ctx.fillStyle = this.getResourceColor(item.type);
                                ctx.fillRect(screenX1, item.y, item.width, item.height);
                                
                                // Add shading for 3D effect
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                                ctx.fillRect(screenX1, item.y, item.width, 5);
                                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                                ctx.fillRect(screenX1, item.y + 5, 5, item.height - 5);
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                            _iterator3.return();
                        }
                    } finally{
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
                var _iteratorNormalCompletion4 = true, _didIteratorError4 = false, _iteratorError4 = undefined;
                try {
                    // Render toasters
                    for(var _iterator4 = this.toasters[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true){
                        var toaster = _step4.value;
                        toaster.render(ctx, cameraOffset, this.assetLoader);
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                            _iterator4.return();
                        }
                    } finally{
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            }
        },
        {
            key: "drawTree",
            value: function drawTree(ctx, x, y) {
                var _this_assetLoader;
                var minecraftTexture = (_this_assetLoader = this.assetLoader) === null || _this_assetLoader === void 0 ? void 0 : _this_assetLoader.getAsset('minecraft');
                if (minecraftTexture) {
                    // Draw tree trunk using wood texture from minecraft.png
                    // The wood texture is typically in the bottom half of the image
                    ctx.fillStyle = '#8B4513'; // Base color
                    ctx.fillRect(x, y - 65, 20, 70);
                    // Draw tree leaves using green texture
                    ctx.fillStyle = '#006400'; // Base color
                    ctx.fillRect(x - 20, y - 115, 60, 50);
                    // Add some pixel-like detail to match Minecraft aesthetic
                    ctx.fillStyle = '#005400'; // Darker green for texture
                    for(var i = 0; i < 12; i++){
                        var leafX = x - 20 + Math.floor(Math.random() * 60);
                        var leafY = y - 115 + Math.floor(Math.random() * 50);
                        ctx.fillRect(leafX, leafY, 5, 5);
                    }
                } else {
                    // Fallback if texture isn't loaded
                    // Tree trunk
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(x, y - 65, 20, 70);
                    // Tree leaves
                    ctx.fillStyle = '#006400';
                    ctx.fillRect(x - 20, y - 115, 60, 50);
                }
            }
        },
        {
            key: "drawSticks",
            value: function drawSticks(ctx, x, y) {
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x, y, 35, 10);
                ctx.fillRect(x + 15, y + 10, 10, 20);
            }
        },
        {
            key: "drawStrings",
            value: function drawStrings(ctx, x, y) {
                ctx.strokeStyle = '#DDDDDD';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 30, y + 35);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x + 10, y);
                ctx.lineTo(x + 20, y + 35);
                ctx.stroke();
            }
        },
        {
            key: "drawFlint",
            value: function drawFlint(ctx, x, y) {
                ctx.fillStyle = '#777777';
                ctx.beginPath();
                ctx.moveTo(x, y + 15);
                ctx.lineTo(x + 15, y);
                ctx.lineTo(x + 25, y + 10);
                ctx.lineTo(x + 20, y + 25);
                ctx.fill();
            }
        },
        {
            key: "drawFeather",
            value: function drawFeather(ctx, x, y) {
                ctx.fillStyle = '#F5F5F5';
                ctx.beginPath();
                ctx.moveTo(x, y + 40);
                ctx.lineTo(x + 10, y);
                ctx.lineTo(x + 20, y + 40);
                ctx.fill();
                // Feather stem
                ctx.fillStyle = '#DDD';
                ctx.fillRect(x + 9, y + 5, 2, 30);
            }
        },
        {
            key: "drawGoldNugget",
            value: function drawGoldNugget(ctx, x, y) {
                const nuggetSize = 20;
                const goldTexture = this.assetLoader.getAsset('gold nugget');
                
                if (goldTexture) {
                    ctx.drawImage(goldTexture, x, y, nuggetSize, nuggetSize);
                    
                    // Add a subtle glow effect
                    ctx.save();
                    ctx.globalAlpha = 0.3;
                    ctx.shadowColor = '#FFD700';
                    ctx.shadowBlur = 10;
                    ctx.drawImage(goldTexture, x, y, nuggetSize, nuggetSize);
                    ctx.restore();
                } else {
                    // Fallback if texture isn't loaded
                    ctx.fillStyle = '#FFD700';
                    ctx.fillRect(x, y, nuggetSize, nuggetSize);
                    
                    // Add shading for 3D effect
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect(x, y, nuggetSize, 5);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.fillRect(x, y + 5, 5, nuggetSize - 5);
                }
            }
        },
        {
            key: "generateLavaPits",
            value: function generateLavaPits() {
                this.lavaPits = [];
                var pitCount = 8; // Fewer but more prominent pits
                var minGap = 300;
                var maxGap = 500;
                var currentX = 400;
                // Generate more natural looking lava rivers
                for(var i = 0; i < pitCount; i++){
                    var width = 100 + Math.random() * 100; // Wider pits
                    var height = 40; // Deeper
                    var gap = minGap + Math.random() * (maxGap - minGap);
                    var yVariation = 5 + Math.random() * 10; // Vary height slightly
                    this.lavaPits.push({
                        x: currentX + gap,
                        y: GROUND_LEVEL + 30,
                        width: width,
                        height: height + 30 // Deeper pit
                    });
                    currentX += gap + width;
                }
                // Add one large lava lake at the end
                this.lavaPits.push({
                    x: currentX + 200,
                    y: GROUND_LEVEL + 30,
                    width: 300,
                    height: 90 // Deeper pit
                });
            }
        },
        {
            key: "_drawLavaSmoke",
            value: function _drawLavaSmoke(ctx, x, y, width) {
                ctx.save();
                ctx.translate(x, y + 5);
                var time = Date.now() * 0.0015;
                var gradientStops = [
                    {
                        color: '#FF4500',
                        pos: 0
                    },
                    {
                        color: '#FF8C00',
                        pos: 0.3
                    },
                    {
                        color: '#FF0000',
                        pos: 0.6
                    },
                    {
                        color: '#8B0000',
                        pos: 1
                    } // Dark red
                ];
                var particleCount = 24;
                ctx.globalCompositeOperation = 'lighter';
                for(var i = 0; i < particleCount; i++){
                    var seed = i * 0.2 + time;
                    var noise = Math.sin(seed) * 0.5 + 0.5;
                    // Position with organic movement
                    var offsetX = noise * width % width;
                    var offsetY = -15 - time * (35 + noise * 15) % 80;
                    // Size with pulsing effect
                    var sizePulse = 0.8 + Math.sin(time * 2 + i) * 0.4;
                    var size = 1.5 + noise * 2.5 * sizePulse;
                    // Color with gradient
                    var colorPos = Math.min(1, Math.max(0, noise));
                    var color = this._getGradientColor(gradientStops, colorPos);
                    var alpha = 0.6 + Math.sin(time * 4 + i) * 0.2;
                    ctx.fillStyle = "rgba(".concat(color.r, ", ").concat(color.g, ", ").concat(color.b, ", ").concat(alpha, ")");
                    // Draw with distortion
                    ctx.beginPath();
                    var distortion = 0.5 + Math.sin(time * 3 + i * 0.5) * 0.5;
                    var sides = 5 + Math.floor(distortion * 4);
                    var radius = size * (0.8 + distortion * 0.4);
                    for(var a = 0; a < Math.PI * 2; a += Math.PI * 2 / sides){
                        ctx.lineTo(offsetX + Math.cos(a) * radius, offsetY + Math.sin(a) * radius * (1 + distortion * 0.3));
                    }
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.globalCompositeOperation = 'source-over';
                ctx.restore();
            }
        },
        {
            key: "_getGradientColor",
            value: function _getGradientColor(stops, position) {
                // Find the two stops surrounding the position
                var start = stops[0];
                var end = stops[stops.length - 1];
                for(var i = 0; i < stops.length - 1; i++){
                    if (position >= stops[i].pos && position <= stops[i + 1].pos) {
                        start = stops[i];
                        end = stops[i + 1];
                        break;
                    }
                }
                // Calculate the color between the two stops
                var range = end.pos - start.pos;
                var percent = (position - start.pos) / range;
                // Parse hex colors
                var col1 = this._hexToRgb(start.color);
                var col2 = this._hexToRgb(end.color);
                return {
                    r: Math.round(col1.r + (col2.r - col1.r) * percent),
                    g: Math.round(col1.g + (col2.g - col1.g) * percent),
                    b: Math.round(col1.b + (col2.b - col1.b) * percent)
                };
            }
        },
        {
            key: "_hexToRgb",
            value: function _hexToRgb(hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : {
                    r: 0,
                    g: 0,
                    b: 0
                };
            }
        },
        {
            key: "_updateEmbers",
            value: function _updateEmbers() {
                if (!this._embers) {
                    this._embers = [];
                    for(var i = 0; i < 30; i++){
                        this._createRandomEmber();
                    }
                }
                for(var i1 = this._embers.length - 1; i1 >= 0; i1--){
                    var ember = this._embers[i1];
                    ember.x += ember.speedX;
                    ember.y += ember.speedY;
                    ember.life--;
                    if (ember.life <= 0) {
                        this._embers.splice(i1, 1);
                        this._createRandomEmber();
                    }
                }
            }
        },
        {
            key: "_createRandomEmber",
            value: function _createRandomEmber() {
                this._embers.push({
                    x: Math.random() * this.levelWidth,
                    y: GROUND_LEVEL - 30 - Math.random() * 100,
                    size: 1 + Math.random() * 2,
                    speedX: -0.5 + Math.random(),
                    speedY: -0.2 - Math.random() * 0.5,
                    life: 200 + Math.random() * 200
                });
            }
        },
        {
            key: "_renderEmbers",
            value: function _renderEmbers(ctx) {
                if (!ctx || !this._embers) return;
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._embers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var ember = _step.value;
                        var screenX = ember.x - this.cameraOffset;
                        if (screenX < -ember.size * 2 || screenX > ctx.canvas.width) continue;
                        var gradient = ctx.createRadialGradient(screenX, ember.y, 0, screenX, ember.y, ember.size * 2);
                        gradient.addColorStop(0, 'rgba(255, 100, 30, 0.8)');
                        gradient.addColorStop(1, 'transparent');
                        ctx.fillStyle = gradient;
                        ctx.beginPath();
                        ctx.arc(screenX, ember.y, ember.size * 2, 0, Math.PI * 2);
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
        },
        {
            key: "checkLavaPitCollision",
            value: function checkLavaPitCollision(player) {
                // Player's feet position
                const playerX = player.x;
                const playerY = player.y + player.height;
                const playerWidth = player.width;
                
                // Check collision with any lava pit
                for (const pit of this.lavaPits) {
                    // Check if player's feet overlap with the lava pit
                    if (
                        playerX + playerWidth * 0.1 < pit.x + pit.width &&
                        playerX + playerWidth * 0.9 > pit.x &&
                        playerY >= pit.y &&
                        playerY <= pit.y + 15 // Only check the top portion of the lava
                    ) {
                        return true;
                    }
                }
                
                return false;
            }
        },
        {
            key: "drawResource",
            value: function drawResource(ctx, x, y, type) {
                const resourceSize = 20;
                const texture = this.assetLoader.getAsset(type);
                
                if (texture) {
                    ctx.drawImage(texture, x, y, resourceSize, resourceSize);
                    
                    // Add a subtle glow effect
                    ctx.save();
                    ctx.globalAlpha = 0.3;
                    ctx.shadowColor = this.getResourceGlowColor(type);
                    ctx.shadowBlur = 10;
                    ctx.drawImage(texture, x, y, resourceSize, resourceSize);
                    ctx.restore();
                } else {
                    // Fallback if texture isn't loaded
                    ctx.fillStyle = this.getResourceColor(type);
                    ctx.fillRect(x, y, resourceSize, resourceSize);
                    
                    // Add shading for 3D effect
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect(x, y, resourceSize, 5);
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.fillRect(x, y + 5, 5, resourceSize - 5);
                }
            }
        },
        {
            key: "getResourceGlowColor",
            value: function getResourceGlowColor(type) {
                const glowColors = {
                    wood: '#8B4513',    // Brown
                    metal: '#A9A9A9',   // Gray
                    blueFlame: '#00BFFF' // Deep Sky Blue
                };
                return glowColors[type] || '#FFFFFF';
            }
        },
        {
            key: "getResourceColor",
            value: function getResourceColor(type) {
                const colors = {
                    wood: '#8B4513',    // Brown
                    metal: '#A9A9A9',   // Gray
                    blueFlame: '#00BFFF' // Deep Sky Blue
                };
                return colors[type] || '#FFFFFF';
            }
        }
    ]);
    return World;
}();
export { World as default };
