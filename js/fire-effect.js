// fire-effect.js - Handles fire particle effects

class FireEffect {
    constructor(scene, position) {
        this.scene = scene;
        this.position = position.clone();
        this.particles = [];
        this.isActive = false;
        this.duration = 1.0; // Duration in seconds
        this.elapsed = 0;
        
        // Create fire texture
        this.fireTexture = this.createFireTexture();
        
        // Create particles
        this.createParticles();
    }
    
    createFireTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Create radial gradient for fire
        const gradient = ctx.createRadialGradient(
            32, 32, 0,
            32, 32, 32
        );
        
        // Add color stops for fire effect
        gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)'); // Yellow center
        gradient.addColorStop(0.3, 'rgba(255, 100, 0, 0.6)'); // Orange middle
        gradient.addColorStop(0.6, 'rgba(255, 0, 0, 0.4)'); // Red outer
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent edge
        
        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        return texture;
    }
    
    createParticles() {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 0.5 + 0.5; // Random size between 0.5 and 1
            const geometry = new THREE.PlaneGeometry(size, size);
            const material = new THREE.MeshBasicMaterial({
                map: this.fireTexture,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                depthTest: false // Disable depth testing to ensure particles are always visible
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Random position around the center
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.5;
            particle.position.set(
                this.position.x + Math.cos(angle) * radius,
                this.position.y + Math.sin(angle) * radius,
                this.position.z + 0.1 // Slightly above the character
            );
            
            // Random velocity
            particle.velocity = new THREE.Vector2(
                (Math.random() - 0.5) * 0.1,
                Math.random() * 0.1 + 0.05 // Upward bias
            );
            
            // Random rotation
            particle.rotation.z = Math.random() * Math.PI * 2;
            
            // Store initial scale and opacity
            particle.userData.initialScale = size;
            particle.userData.initialOpacity = Math.random() * 0.5 + 0.5;
            
            this.particles.push(particle);
            this.scene.add(particle);
        }
    }
    
    start() {
        this.isActive = true;
        this.elapsed = 0;
    }
    
    update(delta) {
        if (!this.isActive) return;
        
        this.elapsed += delta;
        
        if (this.elapsed >= this.duration) {
            this.isActive = false;
            return;
        }
        
        const progress = this.elapsed / this.duration;
        
        // Update each particle
        this.particles.forEach(particle => {
            // Update position
            particle.position.x += particle.velocity.x;
            particle.position.y += particle.velocity.y;
            
            // Fade out and scale down
            const scaleFactor = 1 - progress;
            particle.scale.set(scaleFactor, scaleFactor, 1);
            
            // Flicker effect
            const flicker = Math.sin(progress * Math.PI * 10) * 0.1 + 0.9;
            particle.material.opacity = particle.userData.initialOpacity * scaleFactor * flicker;
            
            // Rotate
            particle.rotation.z += delta * 2;
        });
    }
    
    cleanup() {
        this.particles.forEach(particle => {
            this.scene.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
        });
        this.particles = [];
        this.fireTexture.dispose();
    }
}

// Export the class
window.FireEffect = FireEffect; 