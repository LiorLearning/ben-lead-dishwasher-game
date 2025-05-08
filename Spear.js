import { isColliding } from './utils.js';

class Spear {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = 8;
        this.width = 40;
        this.height = 8;
        this.active = true;
        console.log('Spear created:', { x, y, direction, width: this.width, height: this.height });
    }

    update() {
        if (!this.active) return;
        const oldX = this.x;
        this.x += this.speed * this.direction;
        console.log('Spear moved:', { 
            oldX, 
            newX: this.x, 
            distance: this.x - oldX,
            direction: this.direction 
        });
    }

    render(ctx, cameraOffset) {
        if (!this.active) return;
        
        const screenX = this.x - cameraOffset;
        ctx.save();
        
        // Draw spear
        ctx.fillStyle = '#8B4513'; // Brown color for spear
        ctx.fillRect(screenX, this.y, this.width, this.height);
        
        // Draw spear tip
        ctx.beginPath();
        if (this.direction > 0) {
            ctx.moveTo(screenX + this.width, this.y);
            ctx.lineTo(screenX + this.width + 10, this.y + this.height / 2);
            ctx.lineTo(screenX + this.width, this.y + this.height);
        } else {
            ctx.moveTo(screenX, this.y);
            ctx.lineTo(screenX - 10, this.y + this.height / 2);
            ctx.lineTo(screenX, this.y + this.height);
        }
        ctx.fillStyle = '#696969'; // Gray color for spear tip
        ctx.fill();
        
        ctx.restore();
    }

    getBounds() {
        // Make hitbox slightly larger to ensure collision detection
        const tipWidth = 10;
        const bounds = {
            x: this.direction > 0 ? this.x : this.x - tipWidth,
            y: this.y - 2, // Slightly taller hitbox
            width: this.width + tipWidth,
            height: this.height + 4 // Slightly taller hitbox
        };
        console.log('Spear bounds:', bounds);
        return bounds;
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

        console.log('Collision check details:', {
            spear: {
                position: { x: this.x, y: this.y },
                bounds: spearBounds,
                direction: this.direction
            },
            toaster: {
                position: { x: toaster.x, y: toaster.y },
                bounds: toasterBounds
            },
            distance: {
                x: Math.abs(spearBounds.x - toasterBounds.x),
                y: Math.abs(spearBounds.y - toasterBounds.y)
            }
        });

        const isColliding = this.isColliding(spearBounds, toasterBounds);
        console.log('Collision result:', isColliding);
        return isColliding;
    }

    isColliding(rect1, rect2) {
        const collision = rect1.x < rect2.x + rect2.width &&
                         rect1.x + rect1.width > rect2.x &&
                         rect1.y < rect2.y + rect2.height &&
                         rect1.y + rect1.height > rect2.y;
        
        console.log('Collision calculation:', {
            rect1: rect1,
            rect2: rect2,
            result: collision,
            conditions: {
                left: rect1.x < rect2.x + rect2.width,
                right: rect1.x + rect1.width > rect2.x,
                top: rect1.y < rect2.y + rect2.height,
                bottom: rect1.y + rect1.height > rect2.y
            }
        });
        
        return collision;
    }

    deactivate() {
        this.active = false;
    }
}

export default Spear; 