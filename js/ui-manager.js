// ui-manager.js - Handles UI elements and HUD

class UIManager {
    constructor() {
        this.tigerHealthBar = document.getElementById('tigerHealthBar').querySelector('.health-bar-fill');
        this.dishwasherHealthBar = document.getElementById('dishwasherHealthBar').querySelector('.health-bar-fill');
        this.fireballIconsContainer = document.getElementById('fireballIcons');
        this.plateIconsContainer = document.getElementById('plateIcons');
        this.gameMessageElement = document.getElementById('gameMessage');
        
        this.maxFireballAmmo = 6;
        this.fireballAmmo = this.maxFireballAmmo;
        this.maxTigerHealth = 100;
        this.maxDishwasherHealth = 100;
        this.maxPlates = 5;
        this.platesCollected = 0;
        
        this.initializeFireballIcons();
        this.initializePlateIcons();
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
        for (let i = 0; i < this.maxFireballAmmo; i++) {
            const icon = document.createElement('div');
            icon.className = 'fireball-icon';
            this.fireballIconsContainer.appendChild(icon);
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
        this.showGameMessage('Fireballs Refilled!', 1500);
    }
    
    showGameMessage(message, duration = 2000) {
        this.gameMessageElement.textContent = message;
        this.gameMessageElement.style.display = 'block';
        
        setTimeout(() => {
            this.gameMessageElement.style.display = 'none';
        }, duration);
    }
    
    initializePlateIcons() {
        this.plateIconsContainer.innerHTML = '';
        for (let i = 0; i < this.maxPlates; i++) {
            const icon = document.createElement('div');
            icon.className = 'plate-icon';
            icon.style.opacity = i < this.platesCollected ? '1' : '0.3';
            this.plateIconsContainer.appendChild(icon);
        }
    }
    
    updatePlates(count) {
        this.platesCollected = Math.min(count, this.maxPlates);
        const icons = this.plateIconsContainer.querySelectorAll('.plate-icon');
        icons.forEach((icon, index) => {
            icon.style.opacity = index < this.platesCollected ? '1' : '0.3';
        });
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
                window.location.reload();
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
            window.game.isGameRunning = false;
        }
        
        // Show victory message with play again button
        this.showStatusMessage('VICTORY! You overpowered the Dishwasher!', 'victory', true);
        
        // Play victory sound if available
        if (window.game && window.game.audioManager) {
            window.game.audioManager.playVictorySound();
        }
    }

    showDefeat() {
        console.log('Showing defeat message');
        this.showStatusMessage('You were defeated! Try again?', 'defeat', true);
    }
}

// Export the class
window.UIManager = UIManager;