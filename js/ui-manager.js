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
        this.createSoundControls();
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
        // console.log('Showing status message:', message, 'Type:', type, 'Show play again:', showPlayAgain);
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
        // console.log('Hiding status message');
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
        // console.log('Showing dishwasher weakened message');
        this.showStatusMessage('Dishwasher weakened! Fill it with plates to override!', 'dishwasher-weakened');
    }

    showPlatesLoaded() {
        // console.log('Showing plates loaded message');
        this.showStatusMessage('Plates loaded! Now finish the dishwasher!', 'plates-loaded');
    }

    showVictory() {
        // console.log('Showing victory message');
        // Pause the game
        if (window.game) {
            window.game.isGameRunning = false;
        }
        
        // Show victory message with play again button
        this.showStatusMessage('YOU WIN!', 'victory', true);
        
        // Play victory sound if available
        if (window.game && window.game.audioManager) {
            window.game.audioManager.playVictorySound();
        }
    }

    showDefeat() {
        // console.log('Showing defeat message');
        // Pause the game
        if (window.game) {
            window.game.isGameRunning = false;
        }
        
        // Show defeat message with play again button
        this.showStatusMessage('You were defeated! Try again?', 'defeat', true);
        
        // Play defeat sound if available
        if (window.game && window.game.audioManager) {
            window.game.audioManager.playDefeatSound();
        }
    }

    createSoundControls() {
        // Create sound control container
        const soundControlContainer = document.createElement('div');
        soundControlContainer.id = 'soundControls';
        soundControlContainer.className = 'sound-controls';
        
        // Create sound button
        const soundButton = document.createElement('button');
        soundButton.id = 'soundToggle';
        soundButton.className = 'sound-toggle';
        soundButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        soundButton.setAttribute('title', 'Toggle Sound');
        
        // Add click event
        soundButton.addEventListener('click', () => {
            this.toggleSound(soundButton);
        });
        
        // Append to container
        soundControlContainer.appendChild(soundButton);
        
        // Append to game UI
        document.body.appendChild(soundControlContainer);
        
        // Add Font Awesome for icons if not already present
        if (!document.getElementById('font-awesome')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.id = 'font-awesome';
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }
        
        // Add CSS for sound controls
        this.addSoundControlStyles();
    }
    
    toggleSound(button) {
        if (window.game && window.game.audioManager) {
            const isMuted = window.game.audioManager.toggleMute();
            
            // Update button icon
            if (isMuted) {
                button.innerHTML = '<i class="fas fa-volume-mute"></i>';
                button.setAttribute('title', 'Unmute Sound');
            } else {
                button.innerHTML = '<i class="fas fa-volume-up"></i>';
                button.setAttribute('title', 'Mute Sound');
            }
        }
    }
    
    addSoundControlStyles() {
        // Check if styles already exist
        if (document.getElementById('sound-control-styles')) {
            return;
        }
        
        // Create style element
        const style = document.createElement('style');
        style.id = 'sound-control-styles';
        style.textContent = `
            .sound-controls {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            }
            
            .sound-toggle {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: rgba(0, 0, 0, 0.6);
                border: 2px solid #fff;
                color: #fff;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .sound-toggle:hover {
                background-color: rgba(0, 0, 0, 0.8);
                transform: scale(1.1);
            }
        `;
        
        // Append to head
        document.head.appendChild(style);
    }
}

// Export the class
window.UIManager = UIManager;