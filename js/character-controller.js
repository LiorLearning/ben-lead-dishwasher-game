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
    }
    
    update(delta, sceneSetup) {
        if (!sceneSetup) {
            console.error('SceneSetup is required for character update');
            return;
        }
        
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
        
        // Prevent character from going outside the screen bounds
        if (this.sprite.position.x < -this.leftMargin) {
            this.sprite.position.x = -this.leftMargin;
            this.velocity.x = 0;
        } else if (this.sprite.position.x > this.rightMargin) {
            this.sprite.position.x = this.rightMargin;
            this.velocity.x = 0;
        }
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
    
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        return this.health;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        return this.health;
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
        
        // Enemy attack timing
        this.enemyAttackTimer = 0;
        this.enemyAttackInterval = 2.0;
        
        // Enemy following properties
        this.minSafeDistance = 5; // Minimum safe distance from player
        this.maxSafeDistance = 10; // Maximum safe distance from player
        this.currentTargetDistance = this.getRandomSafeDistance();
        this.distanceChangeTimer = 0;
        this.distanceChangeInterval = 3.0; // Change distance every 3 seconds
        
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
                    console.log('Jump key pressed');
                    this.keys.jump = true;
                    if (this.characters.player) {
                        this.characters.player.jump();
                    }
                }
                break;
            case 'Enter':
                if (!this.keys.attack && this.characters.player) {
                    console.log('Attack key pressed');
                    this.keys.attack = true;
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
                console.log('Jump key released');
                this.keys.jump = false;
                break;
            case 'Enter':
                console.log('Attack key released');
                this.keys.attack = false;
                break;
        }
    }
    
    createPlayerCharacter(x, y) {
        try {
            const tigerSprite = this.assetsLoader.createSprite('playerSprite', 'tiger', 1.5, 1.5);
            const player = new Character(this.sceneSetup.scene, tigerSprite, 'Fireheart', x, y, 1.5, 1.5);
            player.isPlayer = true;
            player.leftMargin = 6;
            player.rightMargin = 10;

            // Set movement/jump properties for chasing
            player.moveSpeed = 7.5;    // Maintained for fast movement
            player.jumpForce = 17;     // Reduced from 20 to 12 for lower jump
            player.gravity = 20;       // Increased from 20 to 24 for faster fall
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

            // Set movement/jump properties for being chased
            enemy.moveSpeed = 0;      // No additional movement speed needed
            enemy.jumpForce = 25;     // Maintained for enemy's higher jumps
            enemy.gravity = 20;       // Maintained for enemy's slower falls
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
        
        // Update characters
        if (this.characters.player) {
            this.characters.player.update(delta, this.sceneSetup);
            
            // Handle player movement
            if (this.keys.left) {
                this.characters.player.moveLeft();
            } else if (this.keys.right) {
                this.characters.player.moveRight();
            } else {
                this.characters.player.stop();
            }
            
            if (this.keys.jump) {
                this.characters.player.jump();
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
            
            // Apply smooth vertical following with time lag
            const verticalLag = 0.1; // Time lag factor (higher = more lag)
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
        
        const playerBounds = {
            x: player.sprite.position.x,
            y: player.sprite.position.y,
            width: player.width,
            height: player.height
        };
        
        const enemyBounds = {
            x: enemy.sprite.position.x,
            y: enemy.sprite.position.y,
            width: enemy.width,
            height: enemy.height
        };
        
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
                // Dish can move left or right, so check both cases
                if (
                    dishDirection === (enemy.sprite.rotation.y === 0 ? 1 : -1) &&
                    enemyFacingPlayer &&
                    playerIsInFront &&
                    Math.abs(projectilePos.x - playerBounds.x) < (playerBounds.width/2 + projectileRadius) &&
                    Math.abs(projectilePos.y - playerBounds.y) < (playerBounds.height/2 + projectileRadius)
                ) {
                    // Player got hit - take damage
                    const newHealth = player.takeDamage(5);
                    this.attackEffects.createDamageEffect(playerBounds.x, playerBounds.y);
                    if (window.game && window.game.uiManager) {
                        window.game.uiManager.updatePlayerHealth(newHealth, player.maxHealth);
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
                const enemyLeft   = enemyBounds.x - enemyBounds.width / 2;
                const enemyRight  = enemyBounds.x + enemyBounds.width / 2;
                const enemyTop    = enemyBounds.y + enemyBounds.height / 2;
                const enemyBottom = enemyBounds.y - enemyBounds.height / 2;
                const overlapX = fireballRight > enemyLeft && fireballLeft < enemyRight;
                const overlapY = fireballTop > enemyBottom && fireballBottom < enemyTop;
                // Require tiger and dishwasher to be at the same vertical position
                const samePlatform = Math.abs(player.sprite.position.y - enemy.sprite.position.y) < 0.2;
                if (
                    fireballMovingRight &&
                    playerFacingEnemy &&
                    enemyIsInFront &&
                    overlapX &&
                    overlapY &&
                    samePlatform
                ) {
                    // Enemy got hit
                    const newHealth = enemy.takeDamage(10);
                    this.attackEffects.createDamageEffect(enemyBounds.x, enemyBounds.y);
                    if (window.game && window.game.uiManager) {
                        window.game.uiManager.updateEnemyHealth(newHealth, enemy.maxHealth);
                    }
                    this.sceneSetup.scene.remove(effect.mesh);
                    this.attackEffects.effects.splice(i, 1);
                }
            }
        }
    }
    
    performEnemyAttack() {
        if (this.characters.enemy) {
            const enemy = this.characters.enemy;
            const player = this.characters.player;
            // Determine direction: -1 for left, 1 for right
            const direction = (enemy.sprite.rotation.y === 0) ? 1 : -1;
            // Spawn projectile in front of enemy
            const startX = enemy.sprite.position.x + direction * (enemy.width / 2 + 0.3);
            const startY = enemy.sprite.position.y;
            this.attackEffects.createEnemyAttackEffect(startX, startY, direction);
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
        }
    }
    
    cleanup() {
        window.removeEventListener('keydown', this.keydownHandler);
        window.removeEventListener('keyup', this.keyupHandler);
        this.attackEffects.cleanup();
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