// toast-shower.js - Handles the toast shower effect

class ToastShower {
    constructor(scene, assetsLoader) {
        this.scene = scene;
        this.assetsLoader = assetsLoader;
        this.toasts = [];
        this.fizzEffects = [];
        this.isActive = false;
        this.toastSizes = [0.45, 0.75, 1.05]; // 1.5x larger sizes
        this.toastSpeed = 8;
        this.toastSpawnInterval = 0.1;
        this.lastSpawnTime = 0;
        this.showerDuration = 3;
        this.showerStartTime = 0;
        this.screenWidth = 12; // Increased from 10 to 12
        this.screenHeight = 8;
        this.groundY = -4; // Ground position (adjust this value to change ground height: higher = more negative, lower = more positive)
        
        // Toaster properties
        this.toaster = null;
        this.toasterSpeed = 3;
        this.toasterDirection = 1; // 1 for right, -1 for left
        this.toasterY = 3; // Adjust this value to change toaster height (higher = more positive, lower = more negative)
        this.toasterSize = 1.8; // Increased from 1.2 to 1.8 (1.5x larger)
        this.toasterX = -this.screenWidth/2; // Initial X position
        this.electricTrail = new ElectricTrail(scene);

        // Automatic shower properties
        this.showerInterval = 15; // Changed from 20 to 15 seconds
        this.timeUntilNextShower = this.showerInterval;
        this.lastShowerTime = 0;
        this.countdownElement = null;
        this.initializeCountdownDisplay();

        // Shield properties
        this.isShieldActive = false;
        this.shieldTimeRemaining = 0;
        this.shieldElement = null;
        this.initializeShieldDisplay();

        // Quiz state
        this.isQuizActive = false;
    }

    initializeCountdownDisplay() {
        // Create countdown display element
        this.countdownElement = document.createElement('div');
        this.countdownElement.style.position = 'absolute';
        this.countdownElement.style.top = '80px';
        this.countdownElement.style.left = '50%';
        this.countdownElement.style.transform = 'translateX(-50%)';
        this.countdownElement.style.color = '#FFD700';
        this.countdownElement.style.fontFamily = "'Press Start 2P', cursive";
        this.countdownElement.style.fontSize = '24px';
        this.countdownElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        this.countdownElement.style.zIndex = '1000';
        document.body.appendChild(this.countdownElement);
    }

    updateCountdownDisplay() {
        if (this.countdownElement) {
            const seconds = Math.ceil(this.timeUntilNextShower);
            this.countdownElement.textContent = `Next Toast Shower: ${seconds}s`;
            
            // Add warning effect when close to shower
            if (seconds <= 3) {
                this.countdownElement.style.color = '#FF0000';
                this.countdownElement.style.animation = 'pulse 1s infinite';
            } else {
                this.countdownElement.style.color = '#FFD700';
                this.countdownElement.style.animation = 'none';
            }
        }
    }

    initializeShieldDisplay() {
        // Create shield display element
        this.shieldElement = document.createElement('div');
        this.shieldElement.style.position = 'absolute';
        this.shieldElement.style.top = '120px';
        this.shieldElement.style.left = '50%';
        this.shieldElement.style.transform = 'translateX(-50%)';
        this.shieldElement.style.color = '#00FFFF';
        this.shieldElement.style.fontFamily = "'Press Start 2P', cursive";
        this.shieldElement.style.fontSize = '24px';
        this.shieldElement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        this.shieldElement.style.zIndex = '1000';
        this.shieldElement.style.display = 'none';
        document.body.appendChild(this.shieldElement);
    }

    updateShieldDisplay() {
        if (this.shieldElement) {
            if (this.isShieldActive) {
                const seconds = Math.ceil(this.shieldTimeRemaining);
                this.shieldElement.textContent = `Shield Active: ${seconds}s`;
                this.shieldElement.style.display = 'block';
            } else {
                this.shieldElement.style.display = 'none';
            }
        }
    }

    activateShield(duration) {
        // If shield is already active, first restore the original texture
        if (this.isShieldActive && window.game && window.game.characterController && window.game.characterController.characters.player) {
            const tiger = window.game.characterController.characters.player;
            if (tiger.sprite.userData && tiger.sprite.userData.originalTexture) {
                tiger.sprite.material.map = tiger.sprite.userData.originalTexture;
                tiger.sprite.material.needsUpdate = true;
            }
        }

        this.isShieldActive = true;
        this.shieldTimeRemaining = duration;
        this.updateShieldDisplay();
        
        // Play shield sound
        if (window.game && window.game.audioManager) {
            window.game.audioManager.playShieldSound();
        }
        
        // Change tiger sprite to shield version
        if (window.game && window.game.characterController && window.game.characterController.characters.player) {
            const tiger = window.game.characterController.characters.player;
            const originalTexture = tiger.sprite.material.map;
            tiger.sprite.material.map = this.assetsLoader.assets.textures['tigerShield'];
            tiger.sprite.material.needsUpdate = true;
            
            // Initialize userData if it doesn't exist
            if (!tiger.sprite.userData) {
                tiger.sprite.userData = {};
            }
            tiger.sprite.userData.originalTexture = originalTexture;
        }
    }

    startShower() {
        this.isActive = true;
        this.showerStartTime = performance.now() / 1000;
        this.lastSpawnTime = this.showerStartTime;
        this.electricTrail.start();
        
        // Play shower sound
        if (window.game && window.game.audioManager) {
            window.game.audioManager.playShowerSound();
        }
        
        // Create toaster if it doesn't exist
        if (!this.toaster) {
            this.toaster = this.assetsLoader.createSprite('toasterSprite', 'toaster', this.toasterSize, this.toasterSize);
            if (this.toaster) {
                this.toaster.position.set(this.toasterX, this.toasterY, 0);
                this.scene.add(this.toaster);
            } else {
                console.error('Failed to create toaster sprite');
                this.isActive = false;
                return;
            }
        }
    }

    // Add new method to check if any quiz is active
    isAnyQuizActive() {
        const quizPanel = document.getElementById('quiz-panel-root');
        const isActive = quizPanel && quizPanel.style.display === 'flex';
        
        // If quiz state changed, update our stored state
        if (isActive !== this.isQuizActive) {
            this.isQuizActive = isActive;
            if (!isActive) {
                // Quiz just ended - reset the timer
                this.timeUntilNextShower = this.showerInterval;
                this.lastShowerTime = performance.now() / 1000;
            }
        }
        return isActive;
    }

    update(delta) {
        const currentTime = performance.now() / 1000;

        // Update shield timer
        if (this.isShieldActive) {
            this.shieldTimeRemaining = Math.max(0, this.shieldTimeRemaining - delta);
            this.updateShieldDisplay();
            if (this.shieldTimeRemaining <= 0) {
                this.isShieldActive = false;
                this.updateShieldDisplay();
                
                // Change tiger sprite back to original
                if (window.game && window.game.characterController && window.game.characterController.characters.player) {
                    const tiger = window.game.characterController.characters.player;
                    if (tiger.sprite.userData && tiger.sprite.userData.originalTexture) {
                        tiger.sprite.material.map = tiger.sprite.userData.originalTexture;
                        tiger.sprite.material.needsUpdate = true;
                        // Clean up the stored texture reference
                        delete tiger.sprite.userData.originalTexture;
                    } else {
                        // If original texture is not found, fallback to the default tiger texture
                        tiger.sprite.material.map = this.assetsLoader.assets.textures['tiger'];
                        tiger.sprite.material.needsUpdate = true;
                    }
                }
            }
        }

        // Check quiz state first
        const isQuizActive = this.isAnyQuizActive();

        // Update countdown timer only if no quiz is active
        if (!this.isActive && !isQuizActive) {
            this.timeUntilNextShower = Math.max(0, this.showerInterval - (currentTime - this.lastShowerTime));
            this.updateCountdownDisplay();

            // Start new shower when timer reaches 0
            if (this.timeUntilNextShower <= 0) {
                this.startShower();
                this.lastShowerTime = currentTime;
            }
        } else if (isQuizActive) {
            // While quiz is active, keep displaying the time that was remaining before quiz started
            this.updateCountdownDisplay();
        }

        // If any quiz is active, pause the toaster
        if (isQuizActive) {
            return;
        }

        if (!this.isActive || !this.toaster) return;

        // Check if shower duration has elapsed
        if (currentTime - this.showerStartTime >= this.showerDuration) {
            this.cleanup(); // Clean up all toasts when shower is complete
            this.isActive = false;
            this.electricTrail.stop();
            return;
        }

        // Update toaster position
        this.toaster.position.x += this.toasterSpeed * this.toasterDirection * delta;
        
        // Reverse direction when hitting screen edges
        if (this.toaster.position.x > this.screenWidth/2) {
            this.toasterDirection = -1;
        } else if (this.toaster.position.x < -this.screenWidth/2) {
            this.toasterDirection = 1;
        }

        // Update electric trail with toaster position
        this.electricTrail.update(delta, this.toaster.position);

        // Spawn new toasts
        if (currentTime - this.lastSpawnTime >= this.toastSpawnInterval) {
            // Spawn toasts from toaster position
            for (let i = 0; i < 4; i++) {
                this.spawnToast();
            }
            this.lastSpawnTime = currentTime;
        }

        // Update existing toasts
        for (let i = this.toasts.length - 1; i >= 0; i--) {
            const toast = this.toasts[i];
            
            // Update position using velocity
            toast.position.x += toast.userData.velocityX * delta;
            toast.position.y += toast.userData.velocityY * delta;
            
            // Add some rotation based on movement
            toast.rotation.z += delta * 3;

            // Check for collision with tiger
            if (this.checkTigerCollision(toast)) {
                // Create fizz effect at collision position
                const fizzEffect = new FizzEffect(this.scene, new THREE.Vector3(toast.position.x, toast.position.y, 0));
                this.fizzEffects.push(fizzEffect);
                
                // Remove the toast
                this.scene.remove(toast);
                this.toasts.splice(i, 1);
                continue;
            }

            // Check if toast has hit the ground
            if (toast.position.y <= this.groundY) {
                // Create fizz effect at ground position
                const fizzEffect = new FizzEffect(this.scene, new THREE.Vector3(toast.position.x, this.groundY, 0));
                this.fizzEffects.push(fizzEffect);
                
                // Remove the toast
                this.scene.remove(toast);
                this.toasts.splice(i, 1);
            }
        }

        // Update fizz effects
        for (let i = this.fizzEffects.length - 1; i >= 0; i--) {
            const effect = this.fizzEffects[i];
            effect.update(delta);
            
            // Remove completed effects
            if (!effect.isActive) {
                this.fizzEffects.splice(i, 1);
            }
        }
    }

    checkTigerCollision(toast) {
        if (!window.game || !window.game.characterController || !window.game.characterController.characters.player) {
            return false;
        }

        const tiger = window.game.characterController.characters.player;
        const tigerBounds = {
            x: tiger.sprite.position.x,
            y: tiger.sprite.position.y,
            width: tiger.width,
            height: tiger.height
        };

        // Get toast bounds (using scale as size since it's a sprite)
        const toastBounds = {
            x: toast.position.x,
            y: toast.position.y,
            width: toast.scale.x,
            height: toast.scale.y
        };

        // Check for collision
        const collision = Math.abs(toastBounds.x - tigerBounds.x) < (tigerBounds.width/2 + toastBounds.width/2) &&
                         Math.abs(toastBounds.y - tigerBounds.y) < (tigerBounds.height/2 + toastBounds.height/2);

        if (collision) {
            // Only apply damage if shield is not active
            if (!this.isShieldActive) {
                const newHealth = tiger.takeDamage(0.3);
                if (window.game && window.game.uiManager) {
                    window.game.uiManager.updateTigerHealth(newHealth, tiger.maxHealth);
                }
            }
            return true;
        }

        return false;
    }

    spawnToast() {
        if (!this.toaster) return;

        const size = this.toastSizes[Math.floor(Math.random() * this.toastSizes.length)];
        const toastSprite = this.assetsLoader.createSprite('toastSprite', 'toast', size, size);
        if (!toastSprite) {
            console.error('Failed to create toast sprite');
            return;
        }

        // Spawn toast from toaster position with slight random offset
        const x = this.toaster.position.x + (Math.random() - 0.5) * 0.5;
        const y = this.toaster.position.y - 0.5;
        
        toastSprite.position.set(x, y, 0);

        // Calculate direction towards tiger
        let targetX = 0;
        let targetY = -3; // Default target if tiger not found
        
        if (window.game && window.game.characterController && window.game.characterController.characters.player) {
            const tiger = window.game.characterController.characters.player;
            targetX = tiger.sprite.position.x;
            targetY = tiger.sprite.position.y;
        }

        // Calculate direction vector
        const dx = targetX - x;
        const dy = targetY - y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize and scale by speed
        const velocityX = (dx / length) * this.toastSpeed;
        const velocityY = (dy / length) * this.toastSpeed;

        // Add some randomness to the velocity
        const randomFactor = 0.3; // Adjust this value to control spread
        const finalVelocityX = velocityX + (Math.random() - 0.5) * randomFactor * this.toastSpeed;
        const finalVelocityY = velocityY + (Math.random() - 0.5) * randomFactor * this.toastSpeed;

        // Store velocity in the toast sprite
        toastSprite.userData = {
            velocityX: finalVelocityX,
            velocityY: finalVelocityY
        };

        this.scene.add(toastSprite);
        this.toasts.push(toastSprite);
    }

    cleanup() {
        // Remove all toasts from the scene
        this.toasts.forEach(toast => {
            this.scene.remove(toast);
        });
        this.toasts = [];
        
        // Clean up any remaining fizz effects
        this.fizzEffects.forEach(effect => {
            effect.cleanup();
        });
        this.fizzEffects = [];
        
        // Remove toaster
        if (this.toaster) {
            this.scene.remove(this.toaster);
            this.toaster = null;
        }
        
        // Stop shower sound
        if (window.game && window.game.audioManager) {
            window.game.audioManager.stopShowerSound();
        }
        
        this.isActive = false;
    }

    // Add CSS for the pulse animation
    static addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: translateX(-50%) scale(1); }
                50% { transform: translateX(-50%) scale(1.1); }
                100% { transform: translateX(-50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add styles when the class is loaded
ToastShower.addStyles();

// Export the class
window.ToastShower = ToastShower; 