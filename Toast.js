import { isColliding } from './utils.js';

export class Toast {
    constructor(x, y, direction, game) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 4;
        this.direction = direction; // 1 for right, -1 for left
        this.game = game;
        this.active = true;
        this.rotation = 0;
        this.rotationSpeed = 0.2;
    }

    update() {
        if (!this.active) return;
        
        // Move toast
        this.x += this.speed * this.direction;
        
        // Update rotation
        this.rotation += this.rotationSpeed * this.direction;
        
        // Check if toast is off screen
        if (this.x < 0 || this.x > this.game.world.levelWidth) {
            this.active = false;
        }

        // Check collision with player
        if (isColliding(this.getBounds(), this.game.player.getBounds())) {
            this.active = false;
            // Handle player hit
            this.game.handleToasterCollision();
        }
    }

    render(ctx, screenX) {
        if (!this.active) return;

        // Save context for rotation
        ctx.save();
        
        // Translate to center of toast
        ctx.translate(screenX + this.width/2, this.y + this.height/2);
        
        // Rotate the toast
        ctx.rotate(this.rotation);
        
        // Get toast texture
        const toastTexture = this.game.assetLoader.getAsset('toast');
        
        if (toastTexture) {
            // Draw toast centered at origin
            ctx.drawImage(toastTexture, -this.width/2, -this.height/2, this.width, this.height);
        } else {
            // Fallback if texture isn't loaded
            ctx.fillStyle = '#D2B48C'; // Toast color
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        }
        
        // Restore context
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
} 