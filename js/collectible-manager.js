// collectible-manager.js - Handles spawning and collecting game items

class Collectible {
    constructor(scene, sprite, type, x, y, value) {
        this.scene = scene;
        this.sprite = sprite;
        this.type = type;
        this.value = value;
        this.collected = false;
        
        // Set initial position
        this.sprite.position.set(x, y, 0);
        this.scene.add(this.sprite);
        
        // Animation properties
        this.floatAmplitude = 0.1;
        this.floatSpeed = 2;
        this.initialY = y;
        this.time = Math.random() * Math.PI * 2; // Random starting phase
    }
    
    update(delta) {
        if (this.collected) return;
        
        // Floating animation
        this.time += delta * this.floatSpeed;
        this.sprite.position.y = this.initialY + Math.sin(this.time) * this.floatAmplitude;
        
        // Simple rotation
        this.sprite.material.rotation += delta;
    }
    
    collect() {
        if (this.collected) return 0;
        
        this.collected = true;
        this.scene.remove(this.sprite);
        return this.value;
    }
    
    isInRange(character, range) {
        if (this.collected) return false;
        
        const dx = character.sprite.position.x - this.sprite.position.x;
        const dy = character.sprite.position.y - this.sprite.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance <= range;
    }
}

class CollectibleManager {
    constructor(sceneSetup, assetsLoader) {
        this.sceneSetup = sceneSetup;
        this.assetsLoader = assetsLoader;
        this.collectibles = [];
        this.orbCount = 0;
        this.movingPlatformOrbs = new Set(); // Track orbs on moving platform
        this.platformCount = 0; // Track total number of platforms created
        this.lastPlatformCount = 0; // Track last known platform count
    }
    
    platformRemoved() {
        // When a platform is removed, we need to adjust our counts
        this.lastPlatformCount = this.sceneSetup.elevatedPlatforms.length;
        console.log('Platform removed. Adjusted lastPlatformCount to:', this.lastPlatformCount);
    }
    
    spawnOrb(x, y, isOnMovingPlatform = false) {
        const orbSprite = this.assetsLoader.createSprite('orbSprite', 'fireOrb', 0.5, 0.5);
        if (!orbSprite) {
            console.error('Failed to create fire orb sprite');
            return;
        }
        orbSprite.position.set(x, y, 0);
        this.sceneSetup.scene.add(orbSprite);
        
        const collectible = {
            sprite: orbSprite,
            collected: false,
            isOnMovingPlatform: isOnMovingPlatform
        };
        
        this.collectibles.push(collectible);
        if (isOnMovingPlatform) {
            this.movingPlatformOrbs.add(collectible);
        }
    }
    
    spawnOrbsOnPlatforms() {
        // Get the current platform count
        const currentPlatformCount = this.sceneSetup.elevatedPlatforms.length;
        
        console.log('Checking platforms for orb spawning:');
        console.log('Current platform count:', currentPlatformCount);
        console.log('Last platform count:', this.lastPlatformCount);
        console.log('Total platforms tracked:', this.platformCount);
        
        // Only spawn orbs if we have new platforms
        if (currentPlatformCount > this.lastPlatformCount) {
            // Get the new platforms (the ones that weren't there before)
            const newPlatforms = this.sceneSetup.elevatedPlatforms.slice(this.lastPlatformCount);
            console.log('New platforms to process:', newPlatforms.length);
            
            // Spawn orbs on new platforms
            newPlatforms.forEach((platform, index) => {
                // Calculate the absolute platform number (1-based)
                const absolutePlatformNumber = this.platformCount + index + 1;
                console.log('Processing platform:', absolutePlatformNumber, 'is odd:', absolutePlatformNumber % 2 === 1);
                
                // Spawn orb on odd-numbered platforms (1st, 3rd, 5th, etc.)
                if (absolutePlatformNumber % 2 === 1) {
                    const x = platform.x + (Math.random() - 0.5) * (platform.width - 1);
                    // Check if this is the moving platform (last platform in the array)
                    const isOnMovingPlatform = (this.lastPlatformCount + index) === this.sceneSetup.elevatedPlatforms.length - 1;
                    console.log('Spawning orb on platform', absolutePlatformNumber, 'at position:', x, platform.y + 0.5);
                    this.spawnOrb(x, platform.y + 0.5, isOnMovingPlatform);
                }
            });
            
            // Update the platform count
            this.platformCount += newPlatforms.length;
            this.lastPlatformCount = currentPlatformCount;
            console.log('Updated platform counts - Total:', this.platformCount, 'Last:', this.lastPlatformCount);
        } else {
            console.log('No new platforms to process');
        }
    }
    
    update(delta, player) {
        // Update orbs on moving platform
        this.movingPlatformOrbs.forEach(collectible => {
            if (!collectible.collected) {
                collectible.sprite.position.x -= this.sceneSetup.platformSpeed * delta;
                
                // Remove orb if it goes off screen
                if (collectible.sprite.position.x < -10) {
                    this.sceneSetup.scene.remove(collectible.sprite);
                    this.movingPlatformOrbs.delete(collectible);
                    collectible.collected = true;
                }
            }
        });
        
        // Check for new platforms and spawn orbs
        this.spawnOrbsOnPlatforms();
        
        // Rotate orbs
        this.collectibles.forEach(collectible => {
            if (!collectible.collected) {
                collectible.sprite.rotation.z += delta * 2;
            }
        });
        
        // Check for collection
        this.checkCollection(player);
    }
    
    checkCollection(player) {
        if (!player) return;
        
        const playerPosition = player.sprite.position;
        const playerWidth = player.width;
        const playerHeight = player.height;
        
        this.collectibles.forEach(collectible => {
            if (collectible.collected) return;
            
            const orbPosition = collectible.sprite.position;
            const orbWidth = 0.5;
            const orbHeight = 0.5;
            
            // Check collision
            if (Math.abs(playerPosition.x - orbPosition.x) < (playerWidth + orbWidth) / 2 &&
                Math.abs(playerPosition.y - orbPosition.y) < (playerHeight + orbHeight) / 2) {
                
                // Collect the orb
                this.sceneSetup.scene.remove(collectible.sprite);
                collectible.collected = true;
                if (collectible.isOnMovingPlatform) {
                    this.movingPlatformOrbs.delete(collectible);
                }
                this.orbCount++;
                
                // Update UI
                if (window.game && window.game.uiManager) {
                    window.game.uiManager.updateOrbCounter(this.orbCount);
                    window.game.uiManager.refillFireballs();
                    window.game.uiManager.showGameMessage('Fireballs refilled!', 1000);
                }
            }
        });
    }
}

// Export the class
window.CollectibleManager = CollectibleManager;