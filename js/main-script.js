// main.js - Entry point for the game application

class Game {
    constructor() {
        try {
            // Initialize game components
            this.sceneSetup = new SceneSetup();
            this.assetsLoader = new AssetsLoader();
            this.characterController = null;
            this.collectibleManager = null;
            this.uiManager = new UIManager();
            
            // Game state
            this.lastTime = 0;
            this.isGameRunning = false;
            this.isLoading = true;
            
            // Start the game initialization
            this.init();
        } catch (error) {
            console.error('Error initializing game:', error);
            this.showError('Failed to initialize game. Please refresh the page.');
        }
    }
    
    async init() {
        console.log('Game initializing...');
        
        // Show loading message
        this.uiManager.showGameMessage('Loading game assets...', 10000);
        
        try {
            // Load all assets
            await this.assetsLoader.loadGameAssets();
            
            // Set up game world
            this.setupGameWorld();
            
            // Spawn initial orbs after everything is set up
            this.collectibleManager.spawnOrbsOnPlatforms();
            
            // Remove loading message
            this.isLoading = false;
            this.uiManager.showGameMessage('Game Ready!', 2000);
            
            // Start the game loop
            this.isGameRunning = true;
            requestAnimationFrame(this.gameLoop.bind(this));
            
        } catch (error) {
            console.error('Error initializing game:', error);
            this.uiManager.showGameMessage('Error loading game!', 5000);
            this.isLoading = false;
        }
    }
    
    setupGameWorld() {
        try {
            // Set up the background
            this.sceneSetup.setBackground('assets/looping-background.png');
            
            // Create the initial moving platform
            this.sceneSetup.createMovingPlatform();
            
            // Set up character controller
            this.characterController = new CharacterController(this.sceneSetup, this.assetsLoader);
            
            // Create the player character (tiger) - positioned more to the left
            const player = this.characterController.createPlayerCharacter(-6, -2);
            if (!player) {
                throw new Error('Failed to create player character');
            }
            
            // Create the enemy character (dishwasher) - positioned at the far right
            const enemy = this.characterController.createEnemyCharacter(8, -2);
            if (!enemy) {
                throw new Error('Failed to create enemy character');
            }
            
            // Set up collectible manager
            this.collectibleManager = new CollectibleManager(this.sceneSetup, this.assetsLoader);
            
            // Initialize UI elements
            this.uiManager.updatePlayerHealth(player.health, player.maxHealth);
            this.uiManager.updateEnemyHealth(enemy.health, enemy.maxHealth);
            this.uiManager.updateOrbCounter(0);
            this.uiManager.updateSpecialAttack(0);
            
        } catch (error) {
            console.error('Error setting up game world:', error);
            this.uiManager.showGameMessage('Error setting up game world!', 5000);
        }
    }
    
    gameLoop(currentTime) {
        if (!this.isGameRunning) return;
        
        try {
            // Calculate delta time in seconds
            const delta = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;
            
            // Update background scrolling
            this.sceneSetup.updateBackground(delta);
            
            // Update moving platform
            this.sceneSetup.updateMovingPlatform(delta);
            
            // Update game components
            if (this.characterController) {
                this.characterController.update(delta);
                
                // Update UI based on character states
                const player = this.characterController.characters.player;
                const enemy = this.characterController.characters.enemy;
                
                if (player) {
                    this.uiManager.updatePlayerHealth(player.health, player.maxHealth);
                }
                
                if (enemy) {
                    this.uiManager.updateEnemyHealth(enemy.health, enemy.maxHealth);
                }
            }
            
            if (this.collectibleManager) {
                this.collectibleManager.update(delta, this.characterController.characters.player);
            }
            
            // Render the scene
            this.sceneSetup.render();
            
            // Continue the game loop
            requestAnimationFrame(this.gameLoop.bind(this));
            
        } catch (error) {
            console.error('Error in game loop:', error);
            this.isGameRunning = false;
            this.uiManager.showGameMessage('Game error! Please refresh.', 5000);
        }
    }
    
    // Battle system functions
    applyDamageToPlayer(amount) {
        try {
            const player = this.characterController.characters.player;
            if (player) {
                player.takeDamage(amount);
                this.uiManager.updatePlayerHealth(player.health, player.maxHealth);
            }
        } catch (error) {
            console.error('Error applying damage to player:', error);
        }
    }
    
    applyDamageToEnemy(amount) {
        try {
            const enemy = this.characterController.characters.enemy;
            if (enemy) {
                enemy.takeDamage(amount);
                this.uiManager.updateEnemyHealth(enemy.health, enemy.maxHealth);
                // Show player attack effect
                this.characterController.performPlayerAttack();
                // Show damage effect on enemy
                this.characterController.attackEffects.createDamageEffect(
                    enemy.sprite.position.x,
                    enemy.sprite.position.y
                );
            }
        } catch (error) {
            console.error('Error applying damage to enemy:', error);
        }
    }
    
    useSpecialAttack() {
        try {
            if (this.uiManager.specialAttackCharge >= 100) {
                const enemy = this.characterController.characters.enemy;
                if (enemy) {
                    enemy.takeDamage(50);
                    this.uiManager.updateEnemyHealth(enemy.health, enemy.maxHealth);
                    this.uiManager.resetSpecialAttack();
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error using special attack:', error);
            return false;
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '50%';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translate(-50%, -50%)';
        errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '20px';
        errorDiv.style.borderRadius = '10px';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.zIndex = '1000';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
    }
    
    cleanup() {
        this.isGameRunning = false;
        
        // Clean up character controller
        if (this.characterController) {
            this.characterController.cleanup();
        }
        
        // Clean up Three.js resources
        if (this.sceneSetup) {
            this.sceneSetup.renderer.dispose();
        }
    }
}

// Initialize the game when the page is loaded
window.addEventListener('load', () => {
    try {
        // Create the game instance
        window.game = new Game();
        
        // Add event listeners for testing battles
        window.addEventListener('keydown', (event) => {
            if (!window.game) return;
            
            if (event.key === 'e' || event.key === 'E') {
                // E key for player attack
                window.game.characterController.keys.attack = true;
            }
        });
        
        window.addEventListener('keyup', (event) => {
            if (!window.game) return;
            
            if (event.key === 'e' || event.key === 'E') {
                window.game.characterController.keys.attack = false;
            }
        });
        
        console.log('Game loaded and running!');
        
    } catch (error) {
        console.error('Error starting game:', error);
        alert('Failed to start game. Please refresh the page.');
    }
});

// Clean up when the page is unloaded
window.addEventListener('unload', () => {
    if (window.game) {
        window.game.cleanup();
    }
});