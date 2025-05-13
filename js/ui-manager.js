// ui-manager.js - Handles UI elements and HUD

class UIManager {
    constructor() {
        this.tigerHealthBar = document.getElementById('tigerHealthBar').querySelector('.health-bar-fill');
        this.dishwasherHealthBar = document.getElementById('dishwasherHealthBar').querySelector('.health-bar-fill');
        this.fireballIconsContainer = document.getElementById('fireballIcons');
        this.gameMessageElement = document.getElementById('gameMessage');
        this.pauseButton = document.getElementById('pauseButton');
        
        // Loading screen elements
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingProgressBar = document.querySelector('.loading-progress-bar');
        this.loadingMessage = document.querySelector('.loading-message');
        
        this.maxFireballAmmo = 3;
        this.fireballAmmo = this.maxFireballAmmo;
        this.maxTigerHealth = 100;
        this.maxDishwasherHealth = 100;
        this.isPaused = false;
        
        this.initializeFireballIcons();
        this.initializePauseButton();
    }
    
    updateTigerHealth(current, max) {
        const percentage = (current / max) * 100;
        this.tigerHealthBar.style.width = `${percentage}%`;
    }
    
    updateDishwasherHealth(current, max) {
        const percentage = (current / max) * 100;
        this.dishwasherHealthBar.style.width = `${percentage}%`;
    }
    
    initializeFireballIcons() {
        this.fireballIconsContainer.innerHTML = '';
        const title = document.createElement('div');
        title.className = 'ammo-title';
        title.textContent = 'Tridents';
        title.style.color = '#FFFFFF';
        title.style.fontFamily = "'Press Start 2P', cursive";
        title.style.fontSize = '14px';
        title.style.marginBottom = '5px';
        this.fireballIconsContainer.appendChild(title);

        const iconsContainer = document.createElement('div');
        iconsContainer.className = 'trident-icons-container';
        iconsContainer.style.display = 'flex';
        iconsContainer.style.gap = '10px';
        this.fireballIconsContainer.appendChild(iconsContainer);

        for (let i = 0; i < this.maxFireballAmmo; i++) {
            const icon = document.createElement('div');
            icon.className = 'fireball-icon';
            icon.style.backgroundImage = 'url(assets/trident-logo.png)';
            icon.style.width = '40px';
            icon.style.height = '40px';
            icon.style.backgroundSize = 'contain';
            icon.style.backgroundRepeat = 'no-repeat';
            icon.style.backgroundPosition = 'center';
            icon.style.filter = 'brightness(1.2)';
            iconsContainer.appendChild(icon);
        }
    }
    
    updateFireballAmmo(count) {
        this.fireballAmmo = Math.min(count, this.maxFireballAmmo);
        const icons = this.fireballIconsContainer.querySelectorAll('.fireball-icon');
        
        icons.forEach((icon, index) => {
            if (index < this.fireballAmmo) {
                icon.style.opacity = '1';
            } else {
                icon.style.opacity = '0.3';
            }
        });
    }
    
    useFireball() {
        if (this.fireballAmmo > 0) {
            this.updateFireballAmmo(this.fireballAmmo - 1);
            return true;
        }
        return false;
    }
    
    refillFireballs() {
        this.updateFireballAmmo(this.maxFireballAmmo);
        this.showGameMessage('Tridents Refilled!', 1500);
    }
    
    showGameMessage(message, duration = 3000) {
        this.gameMessageElement.textContent = message;
        this.gameMessageElement.style.display = 'block';
        
        setTimeout(() => {
            this.gameMessageElement.style.display = 'none';
        }, duration);
    }
    
    showLevelCompleteDialog() {
        // Create dialog container
        const dialog = document.createElement('div');
        dialog.style.position = 'absolute';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '10px';
        dialog.style.border = '2px solid #FFD700';
        dialog.style.color = '#FFFFFF';
        dialog.style.fontFamily = "'Press Start 2P', cursive";
        dialog.style.textAlign = 'center';
        dialog.style.zIndex = '1000';
        
        // Create message
        const message = document.createElement('div');
        message.textContent = 'Golden Dishwasher was defeated, but the toaster got away. Continue designing the next level.';
        message.style.marginBottom = '20px';
        
        // Create play again button
        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = 'Play Again';
        playAgainButton.style.backgroundColor = '#FFD700';
        playAgainButton.style.color = '#000000';
        playAgainButton.style.border = 'none';
        playAgainButton.style.padding = '10px 20px';
        playAgainButton.style.borderRadius = '5px';
        playAgainButton.style.fontFamily = "'Press Start 2P', cursive";
        playAgainButton.style.cursor = 'pointer';
        playAgainButton.style.fontSize = '16px';
        playAgainButton.style.marginTop = '10px';
        playAgainButton.style.transition = 'all 0.3s ease';
        
        // Add hover effect
        playAgainButton.addEventListener('mouseover', () => {
            playAgainButton.style.transform = 'scale(1.05)';
            playAgainButton.style.boxShadow = '0 0 10px #FFD700';
        });
        
        playAgainButton.addEventListener('mouseout', () => {
            playAgainButton.style.transform = 'scale(1)';
            playAgainButton.style.boxShadow = 'none';
        });
        
        // Add click handler
        playAgainButton.addEventListener('click', () => {
            window.location.reload();
        });
        
        // Add elements to dialog
        dialog.appendChild(message);
        dialog.appendChild(playAgainButton);
        document.body.appendChild(dialog);
        
        // Pause the game
        if (window.game) {
            window.game.isGameRunning = false;
        }
    }
    
    // Handle window resize for responsive design
    handleResize() {
        const healthBars = document.getElementById('healthBars');
        const gameWidth = window.innerWidth;
        
        if (gameWidth < 768) {
            healthBars.style.padding = '0 10px';
        } else {
            healthBars.style.padding = '0 20px';
        }
    }

    // Game status message methods
    showStatusMessage(message, type, showPlayAgain = false) {
        console.log('Showing status message:', message, 'Type:', type, 'Show play again:', showPlayAgain);
        const statusPanel = document.getElementById('game-status-panel');
        if (!statusPanel) {
            console.error('Game status panel not found!');
            return;
        }
        statusPanel.innerHTML = '';

        const messageElement = document.createElement('div');
        messageElement.className = `status-message ${type}`;
        messageElement.textContent = message;
        statusPanel.appendChild(messageElement);

        // Show the message with animation
        setTimeout(() => {
            messageElement.classList.add('visible');
        }, 50);

        if (showPlayAgain) {
            const playAgainButton = document.createElement('button');
            playAgainButton.className = 'play-again-button';
            playAgainButton.textContent = 'Play Again';
            playAgainButton.onclick = () => {
                // Pause the game first
                if (window.game) {
                    window.game.pauseGame();
                    // Reset game state
                    window.game.isGameRunning = false;
                    window.game.isPaused = true;
                }
                
                // Show intro screen
                const introScreen = document.getElementById('intro-screen');
                introScreen.style.display = 'flex';
                introScreen.style.opacity = '1';
                
                // Hide status panel
                statusPanel.innerHTML = '';
            };
            statusPanel.appendChild(playAgainButton);

            setTimeout(() => {
                playAgainButton.classList.add('visible');
            }, 50);
        }

        // Auto-hide non-game-ending messages after 3 seconds
        if (!showPlayAgain) {
            setTimeout(() => {
                this.hideStatusMessage();
            }, 3000);
        }
    }

    hideStatusMessage() {
        console.log('Hiding status message');
        const statusPanel = document.getElementById('game-status-panel');
        if (!statusPanel) {
            console.error('Game status panel not found when trying to hide message!');
            return;
        }
        const messageElement = statusPanel.querySelector('.status-message');
        const playAgainButton = statusPanel.querySelector('.play-again-button');

        if (messageElement) {
            messageElement.classList.remove('visible');
        }
        if (playAgainButton) {
            playAgainButton.classList.remove('visible');
        }

        // Remove elements after animation completes
        setTimeout(() => {
            statusPanel.innerHTML = '';
        }, 500);
    }

    // Specific status message methods
    showDishwasherWeakened() {
        console.log('Showing dishwasher weakened message');
        this.showStatusMessage('Dishwasher weakened! Fill it with plates to override!', 'dishwasher-weakened');
    }

    showPlatesLoaded() {
        console.log('Showing plates loaded message');
        this.showStatusMessage('Plates loaded! Now finish the dishwasher!', 'plates-loaded');
    }

    showVictory() {
        console.log('Showing victory message');
        // Pause the game
        if (window.game) {
            window.game.pauseGame();
        }
        
        // Show victory message with play again button
        this.showStatusMessage('You have defeated Golden Dishwasher, but the toaster got away. Continue designing the next level.', 'victory', true);
        
        // Play victory sound if available
        if (window.game && window.game.audioManager) {
            window.game.audioManager.playVictorySound();
        }
    }

    showDefeat() {
        console.log('Showing defeat message');
        // Pause the game
        if (window.game) {
            window.game.pauseGame();
        }
        
        this.showStatusMessage('You were defeated! Try again?', 'defeat', true);
    }

    initializePauseButton() {
        if (!this.pauseButton) {
            console.error('Pause button not found!');
            return;
        }
        
        this.pauseButton.textContent = 'PAUSE';
        this.pauseButton.addEventListener('click', () => {
            this.togglePause();
        });
        
        // Set initial state
        this.isPaused = false;
        this.pauseButton.classList.remove('paused');
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseButton.textContent = this.isPaused ? 'PLAY' : 'PAUSE';
        this.pauseButton.classList.toggle('paused', this.isPaused);
        
        if (window.game) {
            if (this.isPaused) {
                window.game.freezeGameLoop();
            } else {
                window.game.unfreezeGameLoop();
            }
        }
    }

    // Loading screen methods
    updateLoadingProgress(progress, message) {
        if (this.loadingProgressBar) {
            this.loadingProgressBar.style.width = `${progress}%`;
        }
        if (this.loadingMessage && message) {
            this.loadingMessage.textContent = message;
        }
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }
}

// Export the class
window.UIManager = UIManager;