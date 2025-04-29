// character-controller.js - Handles character movement and physics

class Character {
    constructor(scene, sprite, name, x, y, width, height) {
        this.scene = scene;
        this.sprite = sprite;
        this.name = name;
        this.width = width;
        this.height = height;
        
        // Set initial position
        this.sprite.position.set(x, y, 0);
        this.scene.add(this.sprite);
        
        // Physics properties
        this.velocity = new THREE.Vector2(0, 0);
        this.acceleration = new THREE.Vector2(0, 0);
        this.isGrounded = false;
        
        // Game properties
        this.health = 100;
        this.maxHealth = 100;
        this.isPlayer = false;
        
        // Movement properties
        this.moveSpeed = 5;
        this.jumpForce = 12;
        this.gravity = 12;
        this.airResistance = 0.95;
        this.airControl = 0.8;
        
        // Double jump properties
        this.jumpCount = 0;
        this.maxJumps = 2;
        this.lastJumpHeight = 0;
        this.currentHeight = 0;
        
        // Screen bounds
        this.leftMargin = 0;
        this.rightMargin = 0;
        
        // Shake effect properties
        this.isShaking = false;
        this.shakeDuration = 0.5; // Duration in seconds
        this.shakeElapsed = 0;
        this.shakeIntensity = 2; // Default intensity
        this.originalPosition = new THREE.Vector3();
        
        // Fire effect
        this.fireEffect = null;
        
        // Create shadow
        this.createShadow();
    }
    
    createShadow() {
        const shadowGeometry = new THREE.CircleGeometry(0.8, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.5,
            depthWrite: false
        });
        this.shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        this.shadow.position.set(this.sprite.position.x, this.sprite.position.y - 0.8, -0.5);
        this.shadow.rotation.x = -Math.PI / 2; // Rotate to lay flat on the ground
        this.scene.add(this.shadow);
    }
    
    updateShadow() {
        if (this.shadow) {
            // Update shadow position
            this.shadow.position.x = this.sprite.position.x;
            this.shadow.position.y = this.sprite.position.y - 0.8;

            // Update shadow size based on vertical velocity
            if (this.isGrounded) {
                this.shadow.scale.set(1, 1, 1);
            } else {
                // Shrink shadow based on vertical velocity
                const scale = Math.max(0.5, 1 - (Math.abs(this.velocity.y) * 0.1));
                this.shadow.scale.set(scale, scale, 1);
            }
        }
    }
    
    update(delta, sceneSetup) {
        if (!sceneSetup) {
            console.error('SceneSetup is required for character update');
            return;
        }
        
        // Update shake effect
        this.updateShake(delta);
        
        // Track height changes
        this.currentHeight = this.sprite.position.y;
        
        // Apply gravity
        this.velocity.y -= this.gravity * delta;
        
        // Apply air resistance when in air
        if (!this.isGrounded) {
            this.velocity.x *= this.airResistance;
        }
        
        // Apply velocity
        this.sprite.position.x += this.velocity.x * delta;
        this.sprite.position.y += this.velocity.y * delta;
        
        // Update shadow
        this.updateShadow();
        
        // Move character with the background (except for the dishwasher)
        if (!this.isPlayer) {
            // For dishwasher, counteract background movement to maintain position
            this.sprite.position.x += sceneSetup.backgroundSpeed * delta;
        } else {
            // For player, move with background
            this.sprite.position.x -= sceneSetup.backgroundSpeed * delta;
        }
        
        // Check for ground collision
        const platformY = sceneSetup.getPlatformYAt(
            this.sprite.position.x,
            this.sprite.position.y,
            this.width,
            this.velocity.y
        );
        
        if (platformY !== null && 
            this.sprite.position.y - this.height/2 <= platformY && 
            this.velocity.y <= 0) {
            this.sprite.position.y = platformY + this.height/2;
            this.velocity.y = 0;
            this.isGrounded = true;
            this.jumpCount = 0;
        } else {
            this.isGrounded = false;
        }
        
        // Screen boundary collision with bounce back
        const screenLeft = -8; // Left screen boundary
        const screenRight = 8; // Right screen boundary
        const screenTop = 4; // Top screen boundary
        const screenBottom = -4; // Bottom screen boundary
        
        // Horizontal boundary collision
        if (this.sprite.position.x - this.width/2 < screenLeft) {
            // Hit left boundary
            this.sprite.position.x = screenLeft + this.width/2;
            this.velocity.x = Math.abs(this.velocity.x) * 0.5; // Bounce back with reduced speed
        } else if (this.sprite.position.x + this.width/2 > screenRight) {
            // Hit right boundary
            this.sprite.position.x = screenRight - this.width/2;
            this.velocity.x = -Math.abs(this.velocity.x) * 0.5; // Bounce back with reduced speed
        }
        
        // Vertical boundary collision
        if (this.sprite.position.y + this.height/2 > screenTop) {
            // Hit top boundary
            this.sprite.position.y = screenTop - this.height/2;
            this.velocity.y = -Math.abs(this.velocity.y) * 0.5; // Bounce down with reduced speed
        } else if (this.sprite.position.y - this.height/2 < screenBottom) {
            // Hit bottom boundary
            this.sprite.position.y = screenBottom + this.height/2;
            this.velocity.y = Math.abs(this.velocity.y) * 0.5; // Bounce up with reduced speed
        }
        
        // Update effects
        this.updateShake(delta);
        this.updateFireEffect(delta);
    }
    
    jump() {
        if (this.jumpCount < this.maxJumps) {
            if (this.jumpCount === 0) {
                // First jump - full force
                this.velocity.y = this.jumpForce;
                this.lastJumpHeight = this.currentHeight;
            } else {
                // Second jump - reset velocity and apply jump force
                this.velocity.y = 0; // Reset vertical velocity
                this.velocity.y = this.jumpForce * 0.8; // Apply second jump force
                this.lastJumpHeight = this.currentHeight;
            }
            this.jumpCount++;
            this.isGrounded = false;
            
            // Play jump sound
            if (this.isPlayer && window.game && window.game.audioManager) {
                window.game.audioManager.playSound('jump');
            }
        }
    }
    
    moveLeft() {
        if (this.isGrounded) {
            this.velocity.x = -this.moveSpeed;
        } else {
            // Allow some control in air, but reduced
            this.velocity.x = -this.moveSpeed * this.airControl;
        }
    }
    
    moveRight() {
        if (this.isGrounded) {
            this.velocity.x = this.moveSpeed;
        } else {
            // Allow some control in air, but reduced
            this.velocity.x = this.moveSpeed * this.airControl;
        }
    }
    
    stop() {
        this.velocity.x = 0;
    }
    
    takeDamage(amount, isFireDamage = false) {
        this.health = Math.max(0, this.health - amount);
        
        // Trigger effects based on character type and damage type
        if (!this.isPlayer && isFireDamage) {
            // Strong shake and fire effect for dishwasher when hit by fire
            this.triggerShake(5); // Increased intensity
            this.triggerFireEffect();
        } else if (this.isPlayer) {
            // Screen shake and red outline for tiger
            if (window.game && window.game.sceneSetup) {
                window.game.sceneSetup.triggerScreenShake();
                window.game.sceneSetup.triggerRedOutline();
            }
        }
        
        // Play hit sound
        if (window.game && window.game.audioManager) {
            window.game.audioManager.playSound('hit');
        }
        
        return this.health;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        return this.health;
    }
    
    cleanup() {
        // Remove shadow
        if (this.shadow) {
            this.scene.remove(this.shadow);
        }
        
        // Cleanup fire effect
        if (this.fireEffect) {
            this.fireEffect.cleanup();
            this.fireEffect = null;
        }
    }
    
    triggerShake(intensity = 2) {
        if (!this.isShaking) {
            this.isShaking = true;
            this.shakeElapsed = 0;
            this.shakeIntensity = intensity;
            this.originalPosition.copy(this.sprite.position);
        }
    }
    
    updateShake(delta) {
        if (this.isShaking) {
            this.shakeElapsed += delta;
            
            if (this.shakeElapsed >= this.shakeDuration) {
                // Reset position when shake is complete
                this.sprite.position.copy(this.originalPosition);
                this.isShaking = false;
            } else {
                // Calculate shake progress (0 to 1)
                const progress = this.shakeElapsed / this.shakeDuration;
                // Ease-out effect (1 - progress^2)
                const intensity = this.shakeIntensity * (1 - progress * progress);
                
                // More controlled but intense shake
                const shakeFrequency = 20; // Higher frequency for more rapid shaking
                const time = this.shakeElapsed * shakeFrequency;
                
                // Use sine waves for more controlled movement
                const offsetX = Math.sin(time * 2) * intensity * 0.15; // Further reduced radius
                const offsetY = Math.sin(time * 3) * intensity * 0.15; // Further reduced radius
                
                // Add a small random component for extra intensity
                const randomX = (Math.random() - 0.5) * intensity * 0.05; // Reduced random component
                const randomY = (Math.random() - 0.5) * intensity * 0.05; // Reduced random component
                
                // Apply shake offset
                this.sprite.position.x = this.originalPosition.x + offsetX + randomX;
                this.sprite.position.y = this.originalPosition.y + offsetY + randomY;
            }
        }
    }
    
    triggerFireEffect() {
        if (!this.fireEffect) {
            this.fireEffect = new FireEffect(this.scene, this.sprite.position);
        }
        this.fireEffect.start();
    }
    
    updateFireEffect(delta) {
        if (this.fireEffect) {
            this.fireEffect.update(delta);
            if (!this.fireEffect.isActive) {
                this.fireEffect.cleanup();
                this.fireEffect = null;
            }
        }
    }
}

class CharacterController {
    constructor(sceneSetup, assetsLoader) {
        if (!sceneSetup || !assetsLoader) {
            throw new Error('SceneSetup and AssetsLoader are required for CharacterController');
        }
        
        this.sceneSetup = sceneSetup;
        this.assetsLoader = assetsLoader;
        this.characters = {
            player: null,
            enemy: null
        };
        
        // Input handling
        this.keys = {
            left: false,
            right: false,
            jump: false,
            attack: false
        };
        
        // Attack cooldown
        this.attackCooldown = 0;
        this.attackCooldownDuration = 0.5; // 0.5 seconds cooldown
        
        // Attack effects
        this.attackEffects = new AttackEffects(sceneSetup.scene);
        this.fireTrail = new FireTrail(sceneSetup.scene);
        
        // Enemy attack timing
        this.enemyAttackTimer = 0;
        this.enemyAttackInterval = 2.0;
        
        // Enemy following properties
        this.minSafeDistance = 5; // Minimum safe distance from player
        this.maxSafeDistance = 10; // Maximum safe distance from player
        this.currentTargetDistance = this.getRandomSafeDistance();
        this.distanceChangeTimer = 0;
        this.distanceChangeInterval = 3.0; // Change distance every 3 seconds
        
        // Enemy jump tracking
        this.enemyJumpCooldown = 0;
        this.enemyJumpDelay = 0.3; // Base delay before enemy jumps after player
        this.playerLastJumpTime = 0;
        this.enemyLastJumpTime = 0;
        this.enemyJumpMinInterval = 0.5; // Minimum time between enemy jumps
        this.enemyJumpChance = 0.7; // 70% chance to jump when conditions are met
        this.enemyJumpDelayVariation = 0.2; // ±0.2 seconds variation in jump delay
        
        // Plate functionality removed
        this.platesReturned = 0;
        this.maxPlates = 0;
        
        // Add attack cooldown properties
        this.enemyAttackCooldown = 0;
        this.enemyAttackCooldownDuration = 1.5; // 1.5 seconds between attacks
        
        this.setupInputHandlers();
    }
    
    setupInputHandlers() {
        this.keydownHandler = this.handleKeyDown.bind(this);
        this.keyupHandler = this.handleKeyUp.bind(this);
        
        window.addEventListener('keydown', this.keydownHandler);
        window.addEventListener('keyup', this.keyupHandler);
    }
    
    handleKeyDown(event) {
        switch(event.key) {
            case 'ArrowLeft':
                this.keys.left = true;
                break;
            case 'ArrowRight':
                this.keys.right = true;
                break;
            case ' ': // Spacebar
            case 'ArrowUp':
                if (!this.keys.jump) { // Only trigger jump on initial press
                    // console.log('Jump key pressed');
                    this.keys.jump = true;
                    if (this.characters.player) {
                        this.characters.player.jump();
                        this.playerLastJumpTime = performance.now() / 1000; // Record player jump time
                    }
                }
                break;
            case 'Enter':
                if (!this.keys.attack && this.characters.player) {
                    // console.log('Attack key pressed');
                    this.keys.attack = true;
                    if (this.attackCooldown <= 0) {
                        this.performPlayerAttack();
                        this.attackCooldown = this.attackCooldownDuration;
                    }
                }
                break;
        }
    }
    
    handleKeyUp(event) {
        switch(event.key) {
            case 'ArrowLeft':
                this.keys.left = false;
                if (!this.keys.right && this.characters.player) {
                    this.characters.player.stop();
                }
                break;
            case 'ArrowRight':
                this.keys.right = false;
                if (!this.keys.left && this.characters.player) {
                    this.characters.player.stop();
                }
                break;
            case ' ': // Spacebar
            case 'ArrowUp':
                // console.log('Jump key released');
                this.keys.jump = false;
                break;
            case 'Enter':
                // console.log('Attack key released');
                this.keys.attack = false;
                break;
        }
    }
    
    createPlayerCharacter(x, y) {
        try {
            // Visual size (sprite size)
            const visualSize = 2.8125;
            const tigerSprite = this.assetsLoader.createSprite('playerSprite', 'tiger', visualSize, visualSize);
            
            // Collision size (smaller than visual size)
            const collisionSize = visualSize * 0.6; // 60% of visual size
            
            const player = new Character(this.sceneSetup.scene, tigerSprite, 'Fireheart', x, y, collisionSize, collisionSize);
            player.isPlayer = true;
            
            // Adjustable margins (in world units)
            player.leftMargin = 4;  // Reduced from 6
            player.rightMargin = 6; // Reduced from 10

            // Create shadow for player
            const shadowGeometry = new THREE.CircleGeometry(0.8, 32);
            const shadowMaterial = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.5, // Increased opacity
                depthWrite: false
            });
            const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
            shadow.position.set(x, y - 0.8, -0.5); // Position between background and character
            shadow.rotation.x = -Math.PI / 2; // Rotate to lay flat on the ground
            this.sceneSetup.scene.add(shadow);
            player.shadow = shadow; // Store reference to shadow

            // Set movement/jump properties for chasing
            player.moveSpeed = 7.5;
            player.jumpForce = 17;
            player.gravity = 20;
            player.airResistance = 0.95;
            player.airControl = 0.8;
            player.maxJumps = 2;

            this.characters.player = player;
            return player;
        } catch (error) {
            console.error('Error creating player character:', error);
            return null;
        }
    }
    
    createEnemyCharacter(x, y) {
        try {
            const dishwasherSprite = this.assetsLoader.createSprite('enemySprite', 'dishwasher', 1.8, 1.8);
            const enemy = new Character(this.sceneSetup.scene, dishwasherSprite, 'Grimejaw', x, y, 1.8, 1.8);
            enemy.leftMargin = 12;
            enemy.rightMargin = 4;

            // Create shadow for enemy
            const shadowGeometry = new THREE.CircleGeometry(1.0, 32);
            const shadowMaterial = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.5, // Increased opacity
                depthWrite: false
            });
            const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
            shadow.position.set(x, y - 0.9, -0.5); // Position between background and character
            shadow.rotation.x = -Math.PI / 2; // Rotate to lay flat on the ground
            this.sceneSetup.scene.add(shadow);
            enemy.shadow = shadow; // Store reference to shadow

            // Set movement/jump properties for being chased
            enemy.moveSpeed = 0;
            enemy.jumpForce = 10;
            enemy.gravity = 20;
            enemy.airResistance = 0.95;
            enemy.airControl = 0.8;
            enemy.maxJumps = 2;

            this.characters.enemy = enemy;
            return enemy;
        } catch (error) {
            console.error('Error creating enemy character:', error);
            return null;
        }
    }
    
    getRandomSafeDistance() {
        return this.minSafeDistance + Math.random() * (this.maxSafeDistance - this.minSafeDistance);
    }
    
    update(delta) {
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }
        
        // Update enemy attack cooldown
        if (this.enemyAttackCooldown > 0) {
            this.enemyAttackCooldown -= delta;
        }
        
        // Update enemy jump cooldown
        if (this.enemyJumpCooldown > 0) {
            this.enemyJumpCooldown -= delta;
        }
        
        // Update characters
        if (this.characters.player) {
            const player = this.characters.player;
            const previousPosition = player.sprite.position.clone();
            
            // Update player movement
            player.update(delta, this.sceneSetup);
            
            // Calculate velocity for fire trail
            const velocity = {
                x: (player.sprite.position.x - previousPosition.x) / delta,
                y: (player.sprite.position.y - previousPosition.y) / delta
            };
            
            // Update fire trail
            this.fireTrail.update(delta, player.sprite.position, velocity);
            
            // Handle player movement
            if (this.keys.left) {
                player.moveLeft();
            } else if (this.keys.right) {
                player.moveRight();
            } else {
                player.stop();
            }
            
            if (this.keys.jump) {
                player.jump();
                this.keys.jump = false;
            }
            
            // Handle attack
            if (this.keys.attack && this.attackCooldown <= 0) {
                this.performPlayerAttack();
                this.attackCooldown = this.attackCooldownDuration;
                this.keys.attack = false;
            }
        }
        
        if (this.characters.enemy) {
            // Update enemy position to follow player with time lag
            const player = this.characters.player;
            const enemy = this.characters.enemy;
            
            // Update target distance periodically
            this.distanceChangeTimer += delta;
            if (this.distanceChangeTimer >= this.distanceChangeInterval) {
                this.currentTargetDistance = this.getRandomSafeDistance();
                this.distanceChangeTimer = 0;
            }
            
            // Calculate target position with random but safe distance
            const targetX = player.sprite.position.x + this.currentTargetDistance;
            const targetY = player.sprite.position.y; // Target same height as player
            
            // Check if we should make the enemy jump
            const currentTime = performance.now() / 1000;
            const timeSincePlayerJump = currentTime - this.playerLastJumpTime;
            const timeSinceEnemyJump = currentTime - this.enemyLastJumpTime;
            
            // Calculate random delay for this jump attempt
            const randomDelay = this.enemyJumpDelay + 
                (Math.random() * 2 - 1) * this.enemyJumpDelayVariation;
            
            // Only attempt jump if:
            // 1. Enough time has passed since player's jump
            // 2. Enough time has passed since enemy's last jump
            // 3. Enemy is not on cooldown
            // 4. Random chance succeeds
            if (timeSincePlayerJump >= randomDelay && 
                timeSinceEnemyJump >= this.enemyJumpMinInterval && 
                this.enemyJumpCooldown <= 0 &&
                Math.random() < this.enemyJumpChance) {
                
                // Only jump if not already in the air
                if (enemy.isGrounded) {
                    enemy.jump();
                    this.enemyLastJumpTime = currentTime;
                    this.enemyJumpCooldown = this.enemyJumpMinInterval;
                }
            }
            
            // Apply smooth vertical following with time lag
            const verticalLag = enemy.isGrounded ? 0.1 : 0.05; // Less lag when in air
            enemy.sprite.position.y += (targetY - enemy.sprite.position.y) * verticalLag;
            
            // Move enemy horizontally to maintain random distance
            const horizontalSpeed = 3; // Speed of horizontal movement
            if (Math.abs(enemy.sprite.position.x - targetX) > 0.1) {
                const direction = targetX > enemy.sprite.position.x ? 1 : -1;
                enemy.sprite.position.x += direction * horizontalSpeed * delta;
            }
            
            // Make characters face each other
            const playerToEnemyX = enemy.sprite.position.x - player.sprite.position.x;
            
            // Rotate player sprite to face enemy
            if (playerToEnemyX > 0) {
                player.sprite.rotation.y = 0; // Face right
            } else {
                player.sprite.rotation.y = Math.PI; // Face left
            }
            
            // Rotate enemy sprite to face player
            if (playerToEnemyX > 0) {
                enemy.sprite.rotation.y = Math.PI; // Face left
            } else {
                enemy.sprite.rotation.y = 0; // Face right
            }
            
            // Update enemy physics
            enemy.update(delta, this.sceneSetup);
            
            // Handle automatic enemy attacks
            this.enemyAttackTimer += delta;
            if (this.enemyAttackTimer >= this.enemyAttackInterval) {
                this.enemyAttackTimer = 0;
                this.performEnemyAttack();
            }
        }
        
        // Update attack effects and check for collisions
        this.attackEffects.update(delta);
        this.checkProjectileCollisions();
    }
    
    checkProjectileCollisions() {
        if (!this.characters.player || !this.characters.enemy) return;
        
        const player = this.characters.player;
        const enemy = this.characters.enemy;
        
        // Get player bounds
        const playerBounds = {
            x: player.sprite.position.x,
            y: player.sprite.position.y,
            width: player.width,
            height: player.height
        };
        
        // Get enemy bounds
        const enemyBounds = {
            x: enemy.sprite.position.x,
            y: enemy.sprite.position.y,
            width: enemy.width,
            height: enemy.height
        };
        
        // Plate return functionality removed
        
        // Check each projectile
        for (let i = this.attackEffects.effects.length - 1; i >= 0; i--) {
            const effect = this.attackEffects.effects[i];
            const projectilePos = effect.mesh.position;
            const projectileRadius = 0.2;
            
            if (effect.isDish) {
                // Check if dish hits player and enemy is facing player
                const dishDirection = Math.sign(effect.velocity.x);
                const enemyFacingPlayer = this.isFacing(enemy, player);
                const playerIsInFront = (enemy.sprite.rotation.y === 0 && player.sprite.position.x > enemy.sprite.position.x) ||
                                        (enemy.sprite.rotation.y === Math.PI && player.sprite.position.x < enemy.sprite.position.x);
                
                // Plate return functionality removed
                
                // Check if dish hits player
                if (dishDirection === (enemy.sprite.rotation.y === 0 ? 1 : -1) &&
                    enemyFacingPlayer &&
                    playerIsInFront &&
                    Math.abs(projectilePos.x - playerBounds.x) < (playerBounds.width/2 + projectileRadius) &&
                    Math.abs(projectilePos.y - playerBounds.y) < (playerBounds.height/2 + projectileRadius)) {
                    // Player got hit - take damage
                    const newHealth = player.takeDamage(5);
                    this.attackEffects.createDamageEffect(playerBounds.x, playerBounds.y);
                    if (window.game && window.game.uiManager) {
                        window.game.uiManager.updateTigerHealth(newHealth, player.maxHealth);
                    }
                    this.sceneSetup.scene.remove(effect.mesh);
                    this.attackEffects.effects.splice(i, 1);
                }
            } else if (effect.isFireball) {
                // Check if fireball hits enemy and player is facing enemy
                const fireballMovingRight = effect.velocity.x > 0;
                const playerFacingEnemy = this.isFacing(player, enemy);
                const enemyIsInFront = (player.sprite.rotation.y === 0 && enemy.sprite.position.x > player.sprite.position.x) ||
                                       (player.sprite.rotation.y === Math.PI && enemy.sprite.position.x < player.sprite.position.x);
                // Bounding box overlap (AABB)
                const fireballLeft   = projectilePos.x - projectileRadius;
                const fireballRight  = projectilePos.x + projectileRadius;
                const fireballTop    = projectilePos.y + projectileRadius;
                const fireballBottom = projectilePos.y - projectileRadius;
                
                const enemyLeft   = enemyBounds.x - enemyBounds.width/2;
                const enemyRight  = enemyBounds.x + enemyBounds.width/2;
                const enemyTop    = enemyBounds.y + enemyBounds.height/2;
                const enemyBottom = enemyBounds.y - enemyBounds.height/2;
                
                if (
                    fireballMovingRight === playerFacingEnemy &&
                    enemyIsInFront &&
                    fireballRight > enemyLeft &&
                    fireballLeft < enemyRight &&
                    fireballBottom < enemyTop &&
                    fireballTop > enemyBottom
                ) {
                    // Enemy got hit - take damage
                    const newHealth = enemy.takeDamage(10, true);
                    this.attackEffects.createDamageEffect(enemyBounds.x, enemyBounds.y);
                    if (window.game && window.game.uiManager) {
                        window.game.uiManager.updateDishwasherHealth(newHealth, enemy.maxHealth);
                    }
                    this.sceneSetup.scene.remove(effect.mesh);
                    this.attackEffects.effects.splice(i, 1);
                }
            }
        }
    }
    
    performEnemyAttack() {
        if (this.characters.enemy && this.enemyAttackCooldown <= 0) {
            const enemy = this.characters.enemy;
            const player = this.characters.player;
            // Determine direction: -1 for left, 1 for right
            const direction = (enemy.sprite.rotation.y === 0) ? 1 : -1;
            // Spawn projectile in front of enemy
            const startX = enemy.sprite.position.x + direction * (enemy.width / 2 + 0.3);
            const startY = enemy.sprite.position.y;
            this.attackEffects.createEnemyAttackEffect(startX, startY, direction);
            
            // Set cooldown
            this.enemyAttackCooldown = this.enemyAttackCooldownDuration;
        }
    }
    
    performPlayerAttack() {
        if (this.characters.player) {
            const player = this.characters.player;
            const enemy = this.characters.enemy;
            
            // Check if player has fireball ammo
            if (window.game && window.game.uiManager) {
                if (!window.game.uiManager.useFireball()) {
                    window.game.uiManager.showGameMessage('No fireballs left!', 1000);
                    return;
                }
            }
            
            // Determine direction: 1 for right, -1 for left
            const direction = (player.sprite.rotation.y === 0) ? 1 : -1;
            // Spawn projectile in front of player
            const startX = player.sprite.position.x + direction * (player.width / 2 + 0.3);
            const startY = player.sprite.position.y;
            this.attackEffects.createPlayerAttackEffect(startX, startY, direction);
            
            // Play hit sound instead of attack sound
            if (window.game && window.game.audioManager) {
                window.game.audioManager.playSound('hit');
            }
        }
    }
    
    cleanup() {
        window.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('keyup', this.keyupHandler);
        this.attackEffects.cleanup();
        
        // Remove shadow
        if (this.characters.player && this.characters.player.shadow) {
            this.sceneSetup.scene.remove(this.characters.player.shadow);
        }
        if (this.characters.enemy && this.characters.enemy.shadow) {
            this.sceneSetup.scene.remove(this.characters.enemy.shadow);
        }
    }
    
    // Helper: returns true if attacker is facing target
    isFacing(attacker, target) {
        // If attacker is facing right (rotation.y == 0), target must be to the right
        // If attacker is facing left (rotation.y == Math.PI), target must be to the left
        if (attacker.sprite.rotation.y === 0) {
            return target.sprite.position.x > attacker.sprite.position.x;
        } else {
            return target.sprite.position.x < attacker.sprite.position.x;
        }
    }
}

// Export the classes
window.Character = Character;
window.CharacterController = CharacterController;