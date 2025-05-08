import { isColliding } from './utils.js';

class Spear {
    constructor(x, y, direction, game) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 8;
        this.width = 60;
        this.height = 12;
        this.active = true;
        this.game = game; // Store reference to game for asset access
        console.log('Spear created at:', x, y, 'direction:', direction);
    }

    update() {
        if (!this.active) return;
        // Move the spear based on its direction
        this.x += this.speed * this.direction;
    }

    render(ctx, cameraOffset) {
        if (!this.active) return;
        
        const screenX = this.x - cameraOffset;
        const spearImage = this.game?.assetLoader?.getAsset('spear');
        
        if (!spearImage) {
            console.log('Spear image not loaded!');
            return;
        }
        
        // Don't render if off screen
        if (screenX < -this.width || screenX > ctx.canvas.width) {
            return;
        }
        
        console.log('Rendering spear at:', screenX, this.y, 'direction:', this.direction);
        
        ctx.save();
        
        // Calculate center point for rotation
        const centerX = screenX + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // Move to center point for rotation
        ctx.translate(centerX, centerY);
        
        // Rotate based on direction
        if (this.direction > 0) {
            ctx.rotate(0); // Spear pointing right
        } else {
            ctx.rotate(Math.PI); // Spear pointing left
        }
        
        // Draw spear image centered
        ctx.drawImage(spearImage, -this.width / 2, -this.height / 2, this.width, this.height);
        
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

    checkCollision(toaster) {
        if (!this.active) return false;
        
        const spearBounds = this.getBounds();
        const toasterBounds = {
            x: toaster.x + 7,
            y: toaster.y + 10,
            width: toaster.width - 14,
            height: toaster.height - 12
        };

        return this.isColliding(spearBounds, toasterBounds);
    }

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    deactivate() {
        this.active = false;
    }
}

export default Spear; 