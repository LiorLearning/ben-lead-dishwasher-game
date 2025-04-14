import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATE } from './constants.js';

class VictoryScreen {
    constructor(game) {
        this.game = game;
        this.visible = false;
        this.embers = [];
        this.initEmbers();
        
        // Button properties with pixel-art styling
        this.replayButton = {
            x: CANVAS_WIDTH / 2 - 120,
            y: CANVAS_HEIGHT * 0.75,
            width: 100,
            height: 40,
            text: "⏩ REPLAY",
            hovered: false
        };
        
        this.menuButton = {
            x: CANVAS_WIDTH / 2 + 20,
            y: CANVAS_HEIGHT * 0.75,
            width: 100,
            height: 40,
            text: "📋 MENU",
            hovered: false
        };

        this.setupListeners();
        this.startTime = Date.now();
    }

    initEmbers() {
        // Create initial pool of floating ember particles
        this.embers = Array.from({ length: 30 }, () => ({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            size: 1 + Math.random() * 2,
            speedX: -0.5 + Math.random(),
            speedY: -0.2 - Math.random() * 0.5,
            life: 200 + Math.random() * 200
        }));
    }

    updateEmbers() {
        for (let i = this.embers.length - 1; i >= 0; i--) {
            const ember = this.embers[i];
            ember.x += ember.speedX;
            ember.y += ember.speedY;
            ember.life--;

            if (ember.life <= 0 || ember.y < 0 || ember.x < 0 || ember.x > CANVAS_WIDTH) {
                this.embers[i] = {
                    x: Math.random() * CANVAS_WIDTH,
                    y: CANVAS_HEIGHT,
                    size: 1 + Math.random() * 2,
                    speedX: -0.5 + Math.random(),
                    speedY: -0.2 - Math.random() * 0.5,
                    life: 200 + Math.random() * 200
                };
            }
        }
    }

    setupListeners() {
        this.mouseMoveHandler = this.handleMouseMove.bind(this);
        this.clickHandler = this.handleClick.bind(this);
        this.touchHandler = this.handleTouch.bind(this);
        
        this.game.canvas.addEventListener('mousemove', this.mouseMoveHandler);
        this.game.canvas.addEventListener('click', this.clickHandler);
        this.game.canvas.addEventListener('touchstart', this.touchHandler);
    }

    removeListeners() {
        this.game.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        this.game.canvas.removeEventListener('click', this.clickHandler);
        this.game.canvas.removeEventListener('touchstart', this.touchHandler);
    }

    handleMouseMove(event) {
        if (!this.visible) return;
        const rect = this.game.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);
        
        this.replayButton.hovered = this.isPointInButton(mouseX, mouseY, this.replayButton);
        this.menuButton.hovered = this.isPointInButton(mouseX, mouseY, this.menuButton);
    }

    handleClick(event) {
        if (!this.visible) return;
        const rect = this.game.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);

        if (this.isPointInButton(mouseX, mouseY, this.replayButton)) {
            this.restartGame();
        } else if (this.isPointInButton(mouseX, mouseY, this.menuButton)) {
            this.returnToMenu();
        }
    }

    handleTouch(event) {
        if (!this.visible) return;
        event.preventDefault();
        const rect = this.game.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const touchX = (touch.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const touchY = (touch.clientY - rect.top) * (this.game.canvas.height / rect.height);

        if (this.isPointInButton(touchX, touchY, this.replayButton)) {
            this.restartGame();
        } else if (this.isPointInButton(touchX, touchY, this.menuButton)) {
            this.returnToMenu();
        }
    }

    isPointInButton(x, y, button) {
        return x >= button.x && x <= button.x + button.width &&
               y >= button.y && y <= button.y + button.height;
    }

    show() {
        this.visible = true;
        this.startTime = Date.now();
    }

    hide() {
        this.visible = false;
    }

    restartGame() {
        this.hide();
        this.game.resources = {
            sticks: 0,
            strings: 0,
            flint: 0,
            feather: 0,
            goldNuggets: 0
        };
        this.game.player.x = 100;
        this.game.player.y = 375;
        this.game.player.hasGoldenBoots = false;
        this.game.cameraOffset = 0;
        this.game.craftingPanel.updateResources(this.game.resources);
        this.game.gameState = GAME_STATE.PLAYING;
    }

    returnToMenu() {
        this.hide();
        this.game.gameState = GAME_STATE.WELCOME;
    }

    renderPixelButton(ctx, button) {
        ctx.save();

        // Button background with pixel border
        const gradient = ctx.createLinearGradient(button.x, button.y, button.x, button.y + button.height);
        if (button.hovered) {
            gradient.addColorStop(0, '#ff4400');
            gradient.addColorStop(1, '#cc3300');
            ctx.shadowColor = '#ff6622';
            ctx.shadowBlur = 15;
        } else {
            gradient.addColorStop(0, '#441111');
            gradient.addColorStop(1, '#330000');
            ctx.shadowColor = '#ff4400';
            ctx.shadowBlur = 5;
        }

        // Pixel-style border
        ctx.fillStyle = gradient;
        ctx.fillRect(button.x, button.y, button.width, button.height);
        
        // Pixel corners
        ctx.fillStyle = button.hovered ? '#ff6622' : '#551111';
        ctx.fillRect(button.x - 2, button.y - 2, 4, 4);
        ctx.fillRect(button.x + button.width - 2, button.y - 2, 4, 4);
        ctx.fillRect(button.x - 2, button.y + button.height - 2, 4, 4);
        ctx.fillRect(button.x + button.width - 2, button.y + button.height - 2, 4, 4);

        // Button text
        ctx.fillStyle = button.hovered ? '#ffffff' : '#cccccc';
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);

        ctx.restore();
    }

    render(ctx) {
        if (!this.visible) return;

        const time = Date.now() / 1000;
        const elapsedTime = Date.now() - this.startTime;
        const fadeIn = Math.min(1, elapsedTime / 1000);

        // Update and render embers
        this.updateEmbers();

        // Dark Nether background with animated gradient
        const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        bgGradient.addColorStop(0, `rgba(26, 15, 15, ${fadeIn})`);
        bgGradient.addColorStop(0.5 + Math.sin(time) * 0.1, `rgba(45, 18, 18, ${fadeIn})`);
        bgGradient.addColorStop(1, `rgba(20, 10, 10, ${fadeIn})`);
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Render lava cracks
        this.renderLavaCracks(ctx, time);

        // Render floating embers
        this.renderEmbers(ctx);

        // Main title with fire effect
        ctx.save();
        const titleY = CANVAS_HEIGHT * 0.25;
        
        // Fire glow
        ctx.shadowColor = '#ff4400';
        ctx.shadowBlur = 20 + Math.sin(time * 2) * 5;
        ctx.fillStyle = '#ff6622';
        ctx.font = 'bold 48px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('🔥 Level 2 Complete! 🔥', CANVAS_WIDTH / 2, titleY);

        // Story text with fade-in and floating effect
        const storyY = CANVAS_HEIGHT * 0.45;
        const floatOffset = Math.sin(time * 2) * 3;
        
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#cccccc';
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.fillText('Steve crafted the boots.', CANVAS_WIDTH / 2, storyY + floatOffset);
        ctx.fillText('The Piglins retreated.', CANVAS_WIDTH / 2, storyY + 30 + floatOffset);
        ctx.fillText('The Nether trembled beneath his feet.', CANVAS_WIDTH / 2, storyY + 60 + floatOffset);

        // Next level text with glowing blue outline
        const nextLevelY = CANVAS_HEIGHT * 0.65;
        ctx.strokeStyle = '#4444ff';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#0000ff';
        ctx.shadowBlur = 15 + Math.sin(time * 3) * 5;
        ctx.font = 'bold 24px "Press Start 2P", monospace';
        ctx.strokeText('⚔️ Level 3: To Be Designed by Sandro ⚔️', CANVAS_WIDTH / 2, nextLevelY);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('⚔️ Level 3: To Be Designed by Sandro ⚔️', CANVAS_WIDTH / 2, nextLevelY);

        ctx.restore();

        // Render buttons
        this.renderPixelButton(ctx, this.replayButton);
        this.renderPixelButton(ctx, this.menuButton);
    }

    renderLavaCracks(ctx, time) {
        // Draw animated lava cracks
        for (let i = 0; i < 10; i++) {
            const x = (CANVAS_WIDTH / 10) * i + Math.sin(time + i) * 20;
            const y = CANVAS_HEIGHT * 0.8 + Math.cos(time + i) * 10;
            
            const gradient = ctx.createLinearGradient(x, y, x, y + 40);
            gradient.addColorStop(0, '#ff4400');
            gradient.addColorStop(1, 'rgba(255, 68, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 5, y + 20);
            ctx.lineTo(x - 5, y + 40);
            ctx.closePath();
            ctx.fill();
        }
    }

    renderEmbers(ctx) {
        this.embers.forEach(ember => {
            // Create glowing ember effect
            const gradient = ctx.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, ember.size * 2);
            gradient.addColorStop(0, '#ff7f50');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.globalCompositeOperation = 'lighter';
            
            ctx.beginPath();
            ctx.arc(ember.x, ember.y, ember.size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Core of the ember
            ctx.fillStyle = '#ff4500';
            ctx.beginPath();
            ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalCompositeOperation = 'source-over';
        });
    }
}

export { VictoryScreen as default };
