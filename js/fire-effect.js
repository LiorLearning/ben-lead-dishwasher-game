// fire-effect.js - Handles fire particle effects

class FireEffect {
    constructor(scene, position) {
        this.scene = scene;
        this.position = position;
        this.particles = [];
        this.isActive = false;
        this.lifetime = 1.0;
        this.elapsed = 0;
        
        // Create particle texture
        this.createParticleTexture();
    }
    
    createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        // Create gradient
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 200, 0, 0.8)');
        gradient.addColorStop(0.4, 'rgba(255, 100, 0, 0.6)');
        gradient.addColorStop(0.6, 'rgba(255, 50, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        
        this.texture = new THREE.CanvasTexture(canvas);
    }
    
    start() {
        this.isActive = true;
        this.elapsed = 0;
        
        // Create initial particles
        for (let i = 0; i < 10; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const size = 0.5 + Math.random() * 0.5;
        const material = new THREE.SpriteMaterial({
            map: this.texture,
            color: new THREE.Color(1, 0.5, 0),
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particle = new THREE.Sprite(material);
        particle.scale.set(size, size, 1);
        
        // Random position around the center
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.5;
        particle.position.set(
            this.position.x + Math.cos(angle) * radius,
            this.position.y + Math.sin(angle) * radius,
            0
        );
        
        this.scene.add(particle);
        this.particles.push({
            mesh: particle,
            velocity: new THREE.Vector2(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ),
            lifetime: 0.5 + Math.random() * 0.5,
            elapsed: 0
        });
    }
    
    update(delta) {
        if (!this.isActive) return;
        
        this.elapsed += delta;
        
        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.elapsed += delta;
            
            // Update position
            particle.mesh.position.x += particle.velocity.x * delta;
            particle.mesh.position.y += particle.velocity.y * delta;
            
            // Update appearance
            const progress = particle.elapsed / particle.lifetime;
            particle.mesh.material.opacity = 0.8 * (1 - progress);
            const scale = particle.mesh.scale.x * (1 - progress * 0.5);
            particle.mesh.scale.set(scale, scale, 1);
            
            // Remove expired particles
            if (particle.elapsed >= particle.lifetime) {
                this.scene.remove(particle.mesh);
                this.particles.splice(i, 1);
            }
        }
        
        // Create new particles
        if (this.elapsed < this.lifetime) {
            if (Math.random() < 0.3) {
                this.createParticle();
            }
        } else if (this.particles.length === 0) {
            this.isActive = false;
        }
    }
    
    cleanup() {
        this.isActive = false;
        for (const particle of this.particles) {
            this.scene.remove(particle.mesh);
        }
        this.particles = [];
    }
}

// Export the class
window.FireEffect = FireEffect; 