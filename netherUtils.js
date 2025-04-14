// Helper methods for Nether environment
import { CANVAS_WIDTH, GROUND_LEVEL } from './constants.js';
export function createLavaParticle() {
    return {
        x: Math.random() * CANVAS_WIDTH,
        y: GROUND_LEVEL + 25,
        size: 2 + Math.random() * 3,
        speed: 0.5 + Math.random() * 1.5,
        life: 100 + Math.random() * 100
    };
}
export function createEmber() {
    return {
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT * 0.7,
        size: 1 + Math.random() * 2,
        speedX: -0.5 + Math.random(),
        speedY: -0.2 - Math.random() * 0.5,
        life: 200 + Math.random() * 200
    };
}
export function drawBasaltPillar(ctx, x, height) {
    var width = 30;
    ctx.fillStyle = '#3A3A3A';
    ctx.beginPath();
    ctx.moveTo(x, GROUND_LEVEL + 30);
    ctx.lineTo(x + width, GROUND_LEVEL + 30);
    ctx.lineTo(x + width + 10, GROUND_LEVEL + 30 - height);
    ctx.lineTo(x + 10, GROUND_LEVEL + 30 - height);
    ctx.closePath();
    ctx.fill();
    // Add cracks
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineWidth = 1;
    for(var i = 0; i < 3; i++){
        var crackX = x + 5 + Math.random() * (width - 10);
        ctx.beginPath();
        ctx.moveTo(crackX, GROUND_LEVEL + 30);
        ctx.lineTo(crackX + (Math.random() - 0.5) * 5, GROUND_LEVEL + 30 - height * (0.2 + Math.random() * 0.6));
        ctx.stroke();
    }
}
