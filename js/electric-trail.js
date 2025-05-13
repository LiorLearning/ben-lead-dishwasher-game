// electric-trail.js - Handles the electric trail effect behind the toaster

class ElectricTrail {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.maxParticles = 20;
        this.particleLifetime = 0.5; // seconds
        this.trailLength = 2; // units
        this.isActive = false;
    }

    start() {
        this.isActive = true;
    }

    stop() {
        this.isActive = false;
        this.cleanup();
    }

    update(delta, position) {
        if (!this.isActive) return;

        // Add new particles at the current position
        if (this.particles.length < this.maxParticles) {
            this.createParticle(position);
        }

        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.lifetime -= delta;

            if (particle.lifetime <= 0) {
                // Remove dead particles
                this.scene.remove(particle.mesh);
                this.particles.splice(i, 1);
            } else {
                // Update particle properties
                const progress = particle.lifetime / this.particleLifetime;
                particle.mesh.material.opacity = progress * 0.5; // Fade out
                particle.mesh.scale.setScalar(1 - progress * 0.5); // Shrink
            }
        }
    }

    createParticle(position) {
        // Create particle geometry
        const geometry = new THREE.CircleGeometry(0.2, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff, // Cyan color
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.position.z = 0.1; // Slightly in front of toaster

        // Add some random offset
        mesh.position.x += (Math.random() - 0.5) * 0.3;
        mesh.position.y += (Math.random() - 0.5) * 0.3;

        this.scene.add(mesh);

        this.particles.push({
            mesh: mesh,
            lifetime: this.particleLifetime
        });
    }

    cleanup() {
        // Remove all particles
        this.particles.forEach(particle => {
            this.scene.remove(particle.mesh);
            particle.mesh.geometry.dispose();
            particle.mesh.material.dispose();
        });
        this.particles = [];
    }
}

// Export the class
window.ElectricTrail = ElectricTrail; 