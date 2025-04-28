// ui-manager.js - Handles UI elements and HUD

class UIManager {
    constructor() {
        this.playerHealthElement = document.getElementById('playerHealth');
        this.enemyHealthElement = document.getElementById('enemyHealth');
        this.orbCounterElement = document.getElementById('orbCounter');
        this.specialAttackElement = document.getElementById('specialAttack');
        this.gameMessageElement = document.getElementById('gameMessage');
        this.fireballAmmoElement = document.getElementById('fireballAmmo');
        
        this.specialAttackCharge = 0;
        this.maxSpecialAttack = 100;
        this.fireballAmmo = 6;
        this.maxFireballAmmo = 6;
    }
    
    updatePlayerHealth(current, max) {
        this.playerHealthElement.textContent = `Player Health: ${current}/${max}`;
    }
    
    updateEnemyHealth(current, max) {
        this.enemyHealthElement.textContent = `Enemy Health: ${current}/${max}`;
    }
    
    updateOrbCounter(count) {
        this.orbCounterElement.textContent = `Orbs: ${count}`;
    }
    
    updateSpecialAttack(charge) {
        this.specialAttackCharge = Math.min(charge, this.maxSpecialAttack);
        const percentage = Math.round((this.specialAttackCharge / this.maxSpecialAttack) * 100);
        this.specialAttackElement.textContent = `Special Attack: ${percentage}%`;
    }
    
    increaseSpecialAttack(amount) {
        this.updateSpecialAttack(this.specialAttackCharge + amount);
    }
    
    resetSpecialAttack() {
        this.updateSpecialAttack(0);
    }
    
    showGameMessage(message, duration = 2000) {
        this.gameMessageElement.textContent = message;
        this.gameMessageElement.style.display = 'block';
        
        setTimeout(() => {
            this.gameMessageElement.style.display = 'none';
        }, duration);
    }
    
    updateFireballAmmo(count) {
        this.fireballAmmo = Math.min(count, this.maxFireballAmmo);
        this.fireballAmmoElement.textContent = `Fireballs: ${this.fireballAmmo}/${this.maxFireballAmmo}`;
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
    }
}

// Export the class
window.UIManager = UIManager;