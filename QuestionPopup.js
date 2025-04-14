import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

class QuestionPopup {
    constructor(game) {
        this.game = game;
        this.visible = false;
        this.fadeIn = 0;
        this.lastTime = Date.now();
        
        // Panel dimensions
        this.width = 360;
        this.height = 280;
        this.x = (CANVAS_WIDTH - this.width) / 2;
        this.y = (CANVAS_HEIGHT - this.height) / 2;
        
        // Button properties
        this.buttons = [
            { text: '1. 54', value: 54 },
            { text: '2. 56', value: 56 },
            { text: '3. 63', value: 63 },
            { text: '4. 64', value: 64 }
        ].map((btn, index) => ({
            ...btn,
            x: this.x + 30,
            y: this.y + 120 + (index * 32),
            width: this.width - 60,
            height: 24,
            hovered: false,
            animation: 0
        }));

        this.setupListeners();
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
        
        this.buttons.forEach(button => {
            button.hovered = this.isPointInButton(mouseX, mouseY, button);
        });
    }

    handleClick(event) {
        if (!this.visible) return;
        const rect = this.game.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);

        this.buttons.forEach(button => {
            if (this.isPointInButton(mouseX, mouseY, button)) {
                this.onAnswerSelected(button.value);
            }
        });
    }

    handleTouch(event) {
        if (!this.visible) return;
        event.preventDefault();
        const rect = this.game.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const touchX = (touch.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const touchY = (touch.clientY - rect.top) * (this.game.canvas.height / rect.height);

        this.buttons.forEach(button => {
            if (this.isPointInButton(touchX, touchY, button)) {
                this.onAnswerSelected(button.value);
            }
        });
    }

    isPointInButton(x, y, button) {
        return x >= button.x && x <= button.x + button.width &&
               y >= button.y && y <= button.y + button.height;
    }

    show() {
        this.visible = true;
        this.fadeIn = 0;
        this.lastTime = Date.now();
    }

    hide() {
        this.visible = false;
    }

    onAnswerSelected(value) {
        // To be implemented by the game logic
        console.log('Selected answer:', value);
        this.hide();
    }

    drawPixelBorder(ctx, x, y, width, height, color) {
        // Top border
        ctx.fillRect(x + 2, y, width - 4, 2);
        // Bottom border
        ctx.fillRect(x + 2, y + height - 2, width - 4, 2);
        // Left border
        ctx.fillRect(x, y + 2, 2, height - 4);
        // Right border
        ctx.fillRect(x + width - 2, y + 2, 2, height - 4);
        // Corners
        ctx.fillRect(x + 1, y + 1, 2, 2);
        ctx.fillRect(x + width - 3, y + 1, 2, 2);
        ctx.fillRect(x + 1, y + height - 3, 2, 2);
        ctx.fillRect(x + width - 3, y + height - 3, 2, 2);
    }

    renderButton(ctx, button, time) {
        ctx.save();

        // Update button animation
        if (button.hovered && button.animation < 1) {
            button.animation = Math.min(1, button.animation + 0.1);
        } else if (!button.hovered && button.animation > 0) {
            button.animation = Math.max(0, button.animation - 0.1);
        }

        // Button shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(button.x + 2, button.y + 2, button.width, button.height);

        // Button background
        const baseColor = button.hovered ? '#3F3F3F' : '#2A2A2A';
        ctx.fillStyle = baseColor;
        ctx.fillRect(button.x, button.y, button.width, button.height);

        // Pixel border
        ctx.fillStyle = button.hovered ? '#FF6B45' : '#4A4A4A';
        this.drawPixelBorder(ctx, button.x, button.y, button.width, button.height, ctx.fillStyle);

        // Button text with pixel shadow
        const textY = button.y + button.height/2;
        const bounceOffset = button.animation * Math.sin(time * 8) * 1.5;
        
        // Text shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(button.text, button.x + 13, textY + 1 + bounceOffset);

        // Main text
        ctx.fillStyle = button.hovered ? '#FFFFFF' : '#BBBBBB';
        ctx.fillText(button.text, button.x + 12, textY + bounceOffset);

        ctx.restore();
    }

    render(ctx) {
        if (!this.visible) return;

        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Update fade in
        this.fadeIn = Math.min(1, this.fadeIn + deltaTime * 2);

        const time = currentTime / 1000;

        ctx.save();

        // Semi-transparent overlay with fade
        ctx.fillStyle = `rgba(0, 0, 0, ${0.5 * this.fadeIn})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Panel shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(this.x + 4, this.y + 4, this.width, this.height);

        // Panel background
        ctx.fillStyle = `rgba(28, 28, 28, ${0.95 * this.fadeIn})`;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Panel border
        ctx.fillStyle = '#B84015';
        this.drawPixelBorder(ctx, this.x, this.y, this.width, this.height, '#B84015');

        // Inner panel accent
        ctx.fillStyle = '#B84015';
        ctx.fillRect(this.x + 12, this.y + 70, this.width - 24, 2);

        // Title with pixel shadow
        ctx.font = 'bold 20px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillText('Question', this.x + this.width/2 + 1, this.y + 41);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Question', this.x + this.width/2, this.y + 40);

        // Question text with pixel shadow
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillText('What is 9 × 6?', this.x + this.width/2 + 1, this.y + 91);
        ctx.fillStyle = '#E0E0E0';
        ctx.fillText('What is 9 × 6?', this.x + this.width/2, this.y + 90);

        // Render buttons
        this.buttons.forEach(button => this.renderButton(ctx, button, time));

        ctx.restore();
    }
}

export default QuestionPopup; 