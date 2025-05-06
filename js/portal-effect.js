// portal-effect.js - Handles portal visual effects

class PortalEffect {
    constructor(scene, position) {
        this.scene = scene;
        this.position = position.clone();
        this.isActive = true;
        
        // Create portal texture
        this.portalTexture = new THREE.TextureLoader().load('assets/portal.png');
        
        // Create glow texture
        this.glowTexture = this.createGlowTexture();
        
        // Create the main portal sprite
        this.createPortalSprite();
    }
    
    createGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Create radial gradient for glow
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(127, 0, 255, 0.9)'); // Purple center
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.6)'); // Cyan middle
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent edge
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    createPortalSprite() {
        // Create the main portal sprite
        const portalMaterial = new THREE.SpriteMaterial({
            map: this.portalTexture,
            transparent: true,
            opacity: 1.0
        });
        
        this.portalSprite = new THREE.Sprite(portalMaterial);
        this.portalSprite.scale.set(6.0, 6.0, 1);
        this.portalSprite.position.copy(this.position);
        this.portalSprite.position.z = -0.2; // Move portal behind tiger
        this.scene.add(this.portalSprite);
        
        // Create glow sprite
        const glowMaterial = new THREE.SpriteMaterial({
            map: this.glowTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 0.8
        });
        
        this.glowSprite = new THREE.Sprite(glowMaterial);
        this.glowSprite.scale.set(7.0, 7.0, 1);
        this.glowSprite.position.copy(this.position);
        this.glowSprite.position.z = -0.3; // Move glow behind portal
        this.scene.add(this.glowSprite);
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        // Update glow opacity
        const time = Date.now() * 0.001;
        this.glowSprite.material.opacity = 0.6 + Math.sin(time) * 0.2;
    }
    
    cleanup() {
        this.isActive = false;
        
        // Remove portal sprite
        if (this.portalSprite) {
            this.scene.remove(this.portalSprite);
            this.portalSprite.material.dispose();
        }
        
        // Remove glow sprite
        if (this.glowSprite) {
            this.scene.remove(this.glowSprite);
            this.glowSprite.material.dispose();
        }
    }
} 