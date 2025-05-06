// fire-trail.js - Handles the fiery trail effect behind the tiger

class FireTrail {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.maxParticles = 20; // Maximum number of particles in the trail
        this.particleLifetime = 0.5; // How long each particle lives (in seconds)
        this.trailLength = 0.5; // How far back the trail extends (in world units)
        this.particleSize = 0.2; // Size of each particle
        
        // Create particle material
        this.createParticleMaterial();
    }
    
    createParticleMaterial() {
        // Create a canvas for the particle texture
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Create gradient for fire effect
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.2, 'rgba(255, 200, 0, 0.6)');
        gradient.addColorStop(0.4, 'rgba(255, 100, 0, 0.4)');
        gradient.addColorStop(0.6, 'rgba(255, 50, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        // Create texture from canvas
        this.particleTexture = new THREE.CanvasTexture(canvas);
    }
    
    createParticle(x, y) {
        // Create particle sprite
        const material = new THREE.SpriteMaterial({
            map: this.particleTexture,
            color: new THREE.Color(1, 0.5, 0),
            transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 0.8
        });
        
        const particle = new THREE.Sprite(material);
        particle.scale.set(this.particleSize, this.particleSize, 1);
        particle.position.set(x, y, 0);
        this.scene.add(particle);
        
        return {
            mesh: particle,
            lifetime: this.particleLifetime,
            elapsed: 0,
            startScale: this.particleSize,
            startOpacity: 0.8
        };
    }
    
    update(delta, tigerPosition, tigerVelocity) {
        // Remove dead particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.elapsed += delta;
            
            if (particle.elapsed >= particle.lifetime) {
                this.scene.remove(particle.mesh);
                this.particles.splice(i, 1);
                continue;
            }
            
            // Update particle properties
            const progress = particle.elapsed / particle.lifetime;
            
            // Fade out
            particle.mesh.material.opacity = particle.startOpacity * (1 - progress);
            
            // Shrink
            const scale = particle.startScale * (1 - progress);
            particle.mesh.scale.set(scale, scale, 1);
            
            // Move particle slightly based on velocity
            if (tigerVelocity) {
                particle.mesh.position.x -= tigerVelocity.x * delta * 0.5;
                particle.mesh.position.y -= tigerVelocity.y * delta * 0.5;
            }
        }
        
        // Add new particles if needed
        if (this.particles.length < this.maxParticles) {
            // Calculate position slightly behind the tiger
            const offsetX = -tigerVelocity.x * this.trailLength;
            const offsetY = -tigerVelocity.y * this.trailLength;
            
            const particle = this.createParticle(
                tigerPosition.x + offsetX,
                tigerPosition.y + offsetY
            );
            this.particles.push(particle);
        }
    }
    
    cleanup() {
        // Remove all particles from the scene
        this.particles.forEach(particle => {
            this.scene.remove(particle.mesh);
        });
        this.particles = [];
    }
} 