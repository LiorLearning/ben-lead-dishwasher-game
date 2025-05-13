// fizz-effect.js - Handles the electric fizz effect for toasts

class FizzEffect {
    constructor(scene, position) {
        this.scene = scene;
        this.position = position.clone();
        this.particles = [];
        this.isActive = true;
        this.duration = 0.5; // Duration of the effect in seconds
        this.startTime = performance.now() / 1000;
        
        // Create particles
        this.createParticles();
    }
    
    createParticles() {
        const particleCount = 8;
        const colors = [0x00FFFF, 0xFFFFFF, 0x00FF00]; // Cyan, white, and green for electric effect
        
        for (let i = 0; i < particleCount; i++) {
            const size = 0.1 + Math.random() * 0.2;
            const geometry = new THREE.CircleGeometry(size, 8);
            const material = new THREE.MeshBasicMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            
            const particle = new THREE.Mesh(geometry, material);
            particle.position.copy(this.position);
            particle.position.z = 0.1; // Slightly in front of toast
            
            // Random initial velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            particle.velocity = new THREE.Vector2(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            this.scene.add(particle);
            this.particles.push(particle);
        }
    }
    
    update(delta) {
        if (!this.isActive) return;
        
        const currentTime = performance.now() / 1000;
        const elapsed = currentTime - this.startTime;
        
        if (elapsed >= this.duration) {
            this.cleanup();
            return;
        }
        
        // Update particles
        this.particles.forEach(particle => {
            // Move particles
            particle.position.x += particle.velocity.x * delta;
            particle.position.y += particle.velocity.y * delta;
            
            // Fade out
            const progress = elapsed / this.duration;
            particle.material.opacity = 0.8 * (1 - progress);
            
            // Shrink
            const scale = 1 - progress;
            particle.scale.set(scale, scale, 1);
        });
    }
    
    cleanup() {
        this.particles.forEach(particle => {
            this.scene.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
        });
        this.particles = [];
        this.isActive = false;
    }
}

// Export the class
window.FizzEffect = FizzEffect; 