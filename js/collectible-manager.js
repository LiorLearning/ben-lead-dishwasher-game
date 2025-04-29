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
        this.movingPlatformOrbs = new Set(); // Track orbs on moving platform
        this.platformCount = 0; // Track total number of platforms created
        this.lastPlatformCount = 0; // Track last known platform count
        this.orbSize = 0.75; // Base size for fire orbs (1.5x the original 0.5)
    }
    
    platformRemoved() {
        // When a platform is removed, we need to adjust our counts
        this.lastPlatformCount = this.sceneSetup.elevatedPlatforms.length;
        console.log('Platform removed. Adjusted lastPlatformCount to:', this.lastPlatformCount);
    }
    
    spawnOrb(x, y, isOnMovingPlatform = false) {
        // Create the main orb sprite with increased size
        const orbSprite = this.assetsLoader.createSprite('orbSprite', 'fireOrb', this.orbSize, this.orbSize);
        if (!orbSprite) {
            console.error('Failed to create fire orb sprite');
            return;
        }
        orbSprite.position.set(x, y, 0);
        
        // Create glow effect
        const glowTexture = this.createGlowTexture();
        const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xFFD700,
            transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 0.6
        });
        const glowSprite = new THREE.Sprite(glowMaterial);
        glowSprite.scale.set(this.orbSize * 1.5, this.orbSize * 1.5, 1);
        glowSprite.position.set(x, y, -0.1); // Slightly behind the orb
        
        // Add both sprites to the scene
        this.sceneSetup.scene.add(orbSprite);
        this.sceneSetup.scene.add(glowSprite);
        
        // Create particle system
        const particleCount = 10;
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.CircleGeometry(0.05, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFA500,
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(x, y, 0);
            this.sceneSetup.scene.add(particle);
            particles.push(particle);
        }
        
        const collectible = {
            sprite: orbSprite,
            glowSprite: glowSprite,
            particles: particles,
            collected: false,
            isOnMovingPlatform: isOnMovingPlatform,
            initialY: y,
            time: Math.random() * Math.PI * 2,
            pulseTime: 0,
            particleTime: 0
        };
        
        this.collectibles.push(collectible);
        if (isOnMovingPlatform) {
            this.movingPlatformOrbs.add(collectible);
        }
    }
    
    createGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Create radial gradient for glow
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
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
                    // Check if this is the moving platform (last platform in the array)
                    const isOnMovingPlatform = (this.lastPlatformCount + index) === this.sceneSetup.elevatedPlatforms.length - 1;
                    
                    // Debug platform dimensions
                    console.log('Platform dimensions:', {
                        x: platform.x,
                        width: platform.width,
                        isMoving: isOnMovingPlatform
                    });
                    
                    // Calculate x position - center of the platform
                    // For moving platform, adjust the center calculation
                    const x = isOnMovingPlatform 
                        ? platform.x + (platform.width / 2) - 1.5  // Increased leftward offset for moving platform
                        : platform.x + (platform.width / 2);
                    
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
                collectible.glowSprite.position.x = collectible.sprite.position.x;
                collectible.particles.forEach(particle => {
                    particle.position.x = collectible.sprite.position.x;
                });
                
                // Remove orb if it goes off screen
                if (collectible.sprite.position.x < -10) {
                    this.sceneSetup.scene.remove(collectible.sprite);
                    this.sceneSetup.scene.remove(collectible.glowSprite);
                    collectible.particles.forEach(particle => {
                        this.sceneSetup.scene.remove(particle);
                    });
                    this.movingPlatformOrbs.delete(collectible);
                    collectible.collected = true;
                }
            }
        });
        
        // Check for new platforms and spawn orbs
        this.spawnOrbsOnPlatforms();
        
        // Update all collectibles
        this.collectibles.forEach(collectible => {
            if (!collectible.collected) {
                // Update time for animations
                collectible.time += delta * 2; // Bounce speed
                collectible.pulseTime += delta * 4; // Pulse speed
                collectible.particleTime += delta * 3; // Particle speed
                
                // Bounce animation
                const bounceOffset = Math.sin(collectible.time) * 0.1;
                collectible.sprite.position.y = collectible.initialY + bounceOffset;
                collectible.glowSprite.position.y = collectible.sprite.position.y;
                
                // Pulse animation
                const pulseScale = 1 + Math.sin(collectible.pulseTime) * 0.25;
                collectible.sprite.scale.set(this.orbSize * pulseScale, this.orbSize * pulseScale, 1);
                collectible.glowSprite.scale.set(this.orbSize * 1.5 * pulseScale, this.orbSize * 1.5 * pulseScale, 1);
                
                // Rotate orb
                collectible.sprite.rotation.z += delta * 2;
                
                // Update particles
                collectible.particles.forEach((particle, index) => {
                    const angle = (index / collectible.particles.length) * Math.PI * 2 + collectible.particleTime;
                    const radius = 0.2 + Math.sin(collectible.particleTime + index) * 0.05;
                    particle.position.x = collectible.sprite.position.x + Math.cos(angle) * radius;
                    particle.position.y = collectible.sprite.position.y + Math.sin(angle) * radius;
                    particle.material.opacity = 0.4 + Math.sin(collectible.particleTime + index) * 0.2;
                });
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
            const orbWidth = this.orbSize;
            const orbHeight = this.orbSize;
            
            // Check collision
            if (Math.abs(playerPosition.x - orbPosition.x) < (playerWidth + orbWidth) / 2 &&
                Math.abs(playerPosition.y - orbPosition.y) < (playerHeight + orbHeight) / 2) {
                
                // Collect the orb
                this.sceneSetup.scene.remove(collectible.sprite);
                this.sceneSetup.scene.remove(collectible.glowSprite);
                collectible.particles.forEach(particle => {
                    this.sceneSetup.scene.remove(particle);
                });
                collectible.collected = true;
                if (collectible.isOnMovingPlatform) {
                    this.movingPlatformOrbs.delete(collectible);
                }
                
                // Show quiz panel
                if (window.game) {
                    window.game.freezeGameLoop();
                    window.game.quizManager.showQuiz();
                }
            }
        });
    }
}

// Export the class
window.CollectibleManager = CollectibleManager;