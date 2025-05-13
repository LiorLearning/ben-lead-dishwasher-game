class InputManager {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            // Prevent spacebar from affecting pause state
            if (e.key === ' ' && window.game && window.game.uiManager.isPaused) {
                return;
            }
            
            // Handle mute toggle
            if (e.key.toLowerCase() === 'm' && window.game && window.game.audioManager) {
                const isMuted = window.game.audioManager.toggleMute();
                console.log(`Game sounds ${isMuted ? 'muted' : 'unmuted'}`);
            }
            
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] === true;
    }
}

// Export the class
window.InputManager = InputManager; 