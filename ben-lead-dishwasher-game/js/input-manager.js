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