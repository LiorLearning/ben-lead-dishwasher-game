import { GAME_STATE, CANVAS_WIDTH } from './constants.js';

export class HealthPanel {
    constructor(game) {
        this.game = game;
        // Center the health bar at the top of the screen
        this.heartSize = 30;
        this.heartSpacing = 5;
        this.totalWidth = (this.heartSize * 5) + (this.heartSpacing * 4);
        this.x = (CANVAS_WIDTH - this.totalWidth) / 2; // Center horizontally
        this.y = 20; // Position at top of screen
        
        // Position for retry counter (previous health bar position)
        this.retryX = 20;
        this.retryY = 80;
    }

    render(ctx) {
        // Only render health panel during gameplay
        if (this.game.gameState !== GAME_STATE.PLAYING) {
            return;
        }

        // Draw background panel for health bar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(this.x - 10, this.y - 10, 
            this.totalWidth + 20, 
            this.heartSize + 20);

        // Draw retry counter in its own background panel
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(this.retryX - 10, this.retryY - 10, 150, 40);
        
        // Draw retry counter
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Retries: ${this.game.retryCounter}`, this.retryX, this.retryY + 15);

        // Draw hearts
        for (let i = 0; i < 5; i++) {
            const heartX = this.x + (i * (this.heartSize + this.heartSpacing));
            const heartY = this.y;
            
            // Draw heart outline
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(heartX + this.heartSize/2, heartY + this.heartSize/4);
            ctx.bezierCurveTo(
                heartX + this.heartSize/2, heartY,
                heartX + this.heartSize, heartY,
                heartX + this.heartSize, heartY + this.heartSize/4
            );
            ctx.bezierCurveTo(
                heartX + this.heartSize, heartY + this.heartSize/2,
                heartX + this.heartSize/2, heartY + this.heartSize,
                heartX + this.heartSize/2, heartY + this.heartSize
            );
            ctx.bezierCurveTo(
                heartX + this.heartSize/2, heartY + this.heartSize,
                heartX, heartY + this.heartSize/2,
                heartX, heartY + this.heartSize/4
            );
            ctx.bezierCurveTo(
                heartX, heartY,
                heartX + this.heartSize/2, heartY,
                heartX + this.heartSize/2, heartY + this.heartSize/4
            );
            ctx.stroke();

            // Fill heart if player has that health point
            if (i < this.game.player.health) {
                ctx.fillStyle = '#ff0000';
                ctx.fill();
            }
        }
    }
} 