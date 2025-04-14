import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

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

    handleClick(e) {
        const rect = this.game.canvas.getBoundingClientRect();
        
        // Calculate scale factors
        const scaleX = this.game.canvas.width / rect.width;
        const scaleY = this.game.canvas.height / rect.height;
        
        // Apply scaling to mouse coordinates
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        // Get button bounds (same as in drawCraftButton)
        const buttonWidth = 120;
        const buttonHeight = 30;
        const buttonX = this.x + (this.width - buttonWidth) / 2;
        const buttonY = this.y + 110;

        // Add some tolerance for easier clicking
        const tolerance = 10;
        const isInButton = mouseX >= buttonX - tolerance &&
                          mouseX <= buttonX + buttonWidth + tolerance &&
                          mouseY >= buttonY - tolerance &&
                          mouseY <= buttonY + buttonHeight + tolerance;

        console.log('Click detected!');
        console.log('Raw mouse position:', { x: e.clientX - rect.left, y: e.clientY - rect.top });
        console.log('Scaled mouse position:', { x: mouseX, y: mouseY });
        console.log('Button position:', { x: buttonX, y: buttonY });
        console.log('Is click in button area:', isInButton);

        if (isInButton) {
            console.log('Click is within button bounds!');
            
            // Check if we have enough gold
            if (this.resources.goldNuggets >= 36) {
                console.log('Starting crafting process...');
                
                // Update resources
                this.resources.goldNuggets -= 36;
                this.game.resources.goldNuggets -= 36;
                
                // Update player
                this.game.player.hasGoldenBoots = true;
                
                // Force immediate visual update
                if (this.game.player.render && this.game.ctx) {
                    this.game.player.render(this.game.ctx);
                }
                
                // Trigger game update
                if (this.game.update) {
                    this.game.update(Date.now());
                }

                // Force redraw
                requestAnimationFrame(() => {
                    if (this.game.draw) {
                        this.game.draw();
                    }
                });
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

        // Draw gold count
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Gold Nuggets:', this.x + 15, this.y + 50);
        ctx.textAlign = 'right';
        ctx.fillText(`${this.resources.goldNuggets || 0}/36`, this.x + this.width - 15, this.y + 50);

        // Draw boots info
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'left';
        ctx.fillText('Golden Boots:', this.x + 15, this.y + 80);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'right';
        ctx.fillText('36 gold', this.x + this.width - 15, this.y + 80);

        // Draw craft button
        const buttonWidth = 120;
        const buttonHeight = 30;
        const buttonX = this.x + (this.width - buttonWidth) / 2;
        const buttonY = this.y + 110;

        // Button background
        const canCraft = (this.resources.goldNuggets || 0) >= 36;
        
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
        ctx.fillText(canCraft ? 'Craft' : 'Need 36 Gold', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
    }

    cleanup() {
        this.game.canvas.removeEventListener('click', this.handleClick);
    }
}
