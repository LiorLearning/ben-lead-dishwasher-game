import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATE } from './constants.js';

export class CraftingPanel {
    constructor(resources, game) {
        this.resources = resources;
        this.game = game;
        this.width = 200;
        this.height = 150;
        this.x = CANVAS_WIDTH - this.width - 10;
        this.y = 10;

        // Bind click handler
        this.handleClick = this.handleClick.bind(this);
        this.game.canvas.addEventListener('click', this.handleClick);
    }

    updateResources(resources) {
        this.resources = resources;
    }

    highlightResource(resourceType) {
        // This method would typically highlight a resource
        // It's referenced in the codebase but not implemented
    }

    handleClick(event) {
        // Get click coordinates relative to canvas
        const rect = this.game.canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const y = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);

        // Check if click is within panel bounds
        if (x >= this.x && x <= this.x + this.width &&
            y >= this.y && y <= this.y + this.height) {
            
            // Check if click is within craft button bounds
            const buttonWidth = 120;
            const buttonHeight = 30;
            const buttonX = this.x + (this.width - buttonWidth) / 2;
            const buttonY = this.y + 110;
            
            const isInButton = x >= buttonX && x <= buttonX + buttonWidth &&
                              y >= buttonY && y <= buttonY + buttonHeight;

            if (isInButton) {
                console.log('Craft Spear button clicked!');
                
                // Update player
                this.game.player.hasMightySpear = true;
                
                // Show victory screen
                this.game.gameState = GAME_STATE.VICTORY;
                this.game.victoryScreen.show();
                
                // Force redraw
                if (this.game.draw) {
                    this.game.draw();
                }
            }
        }
    }

    render(ctx) {
        // Draw panel background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw title
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Crafting', this.x + this.width / 2, this.y + 25);

        // Draw resource counts with images
        ctx.textAlign = 'left';
        
        // Wood
        const woodImage = this.game.assetLoader.getAsset('wood');
        if (woodImage) {
            ctx.drawImage(woodImage, this.x + 15, this.y + 40, 20, 20);
        }
        ctx.fillStyle = '#8B4513';
        ctx.fillText('Wood:', this.x + 40, this.y + 55);
        ctx.textAlign = 'right';
        ctx.fillText(`${this.resources.wood || 0}/5`, this.x + this.width - 15, this.y + 55);
        
        // Metal
        ctx.textAlign = 'left';
        const metalImage = this.game.assetLoader.getAsset('metal');
        if (metalImage) {
            ctx.drawImage(metalImage, this.x + 15, this.y + 65, 20, 20);
        }
        ctx.fillStyle = '#A9A9A9';
        ctx.fillText('Metal:', this.x + 40, this.y + 80);
        ctx.textAlign = 'right';
        ctx.fillText(`${this.resources.metal || 0}/3`, this.x + this.width - 15, this.y + 80);
        
        // Blue Flame
        ctx.textAlign = 'left';
        const flameImage = this.game.assetLoader.getAsset('flame');
        if (flameImage) {
            ctx.drawImage(flameImage, this.x + 15, this.y + 90, 20, 20);
        }
        ctx.fillStyle = '#00BFFF';
        ctx.fillText('Blue Flame:', this.x + 40, this.y + 105);
        ctx.textAlign = 'right';
        ctx.fillText(`${this.resources.blueFlame || 0}/2`, this.x + this.width - 15, this.y + 105);

        // Draw craft button
        const buttonWidth = 120;
        const buttonHeight = 30;
        const buttonX = this.x + (this.width - buttonWidth) / 2;
        const buttonY = this.y + 110;

        // Button background
        const canCraft = (this.resources.wood || 0) >= 5 && 
                        (this.resources.metal || 0) >= 3 && 
                        (this.resources.blueFlame || 0) >= 2;
        
        // Draw button hitbox for debugging
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX - 10, buttonY - 10, buttonWidth + 20, buttonHeight + 20);
        
        // Draw actual button
        ctx.fillStyle = canCraft ? '#4CAF50' : '#555555';
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Button text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Craft Spear', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
    }

    cleanup() {
        this.game.canvas.removeEventListener('click', this.handleClick);
    }
}
