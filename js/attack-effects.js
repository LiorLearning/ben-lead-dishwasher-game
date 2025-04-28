// attack-effects.js - Handles visual effects for attacks

class AttackEffects {
    constructor(scene) {
        this.scene = scene;
        this.effects = [];
        this.screenBounds = 8; // Match the new screen bounds from character controller
    }

    createPlayerAttackEffect(x, y, direction = 1) {
        // Create a fire projectile
        const geometry = new THREE.CircleGeometry(0.2, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff4500, // Orange-red fire color
            transparent: true,
            opacity: 0.8
        });
        const fireball = new THREE.Mesh(geometry, material);
        fireball.position.set(x, y, 0);
        this.scene.add(fireball);
        
        // Add to effects array
        this.effects.push({
            mesh: fireball,
            lifetime: 1.0, // 1 second
            elapsed: 0,
            velocity: new THREE.Vector2(12 * direction, 0), // Increased from 8 to 12
            isFireball: true,
            startX: x // Store starting position
        });
    }

    createEnemyAttackEffect(x, y, direction = -1) {
        // Create a dish projectile with outline
        const dishGeometry = new THREE.CircleGeometry(0.2, 16);
        const dishMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const dish = new THREE.Mesh(dishGeometry, dishMaterial);
        
        // Create outline
        const outlineGeometry = new THREE.RingGeometry(0.19, 0.2, 16);
        const outlineMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
        
        // Group dish and outline
        const dishGroup = new THREE.Group();
        dishGroup.add(dish);
        dishGroup.add(outline);
        dishGroup.position.set(x, y, 0);
        this.scene.add(dishGroup);
        
        // Add to effects array
        this.effects.push({
            mesh: dishGroup,
            lifetime: 10.0, // Long lifetime to ensure it reaches screen edge
            elapsed: 0,
            velocity: new THREE.Vector2(12 * direction, 0), // Increased from 8 to 12
            isDish: true,
            startX: x // Store starting position
        });
    }

    createDamageEffect(x, y) {
        // Create a damage flash effect
        const geometry = new THREE.CircleGeometry(0.5, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.6
        });
        const damageFlash = new THREE.Mesh(geometry, material);
        damageFlash.position.set(x, y, 0);
        this.scene.add(damageFlash);
        
        // Add to effects array
        this.effects.push({
            mesh: damageFlash,
            lifetime: 0.3, // 300ms
            elapsed: 0,
            scaleDown: true
        });
    }

    update(delta) {
        // Update and remove expired effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            effect.elapsed += delta;
            
            // Update position if it's a projectile
            if (effect.velocity) {
                effect.mesh.position.x += effect.velocity.x * delta;
                effect.mesh.position.y += effect.velocity.y * delta;
                
                // Check if projectile hit screen edge
                if (effect.isFireball) {
                    // Fireball (player attack) - remove when it goes too far right
                    if (effect.mesh.position.x - effect.startX > this.screenBounds * 2) {
                        this.scene.remove(effect.mesh);
                        this.effects.splice(i, 1);
                        continue;
                    }
                } else if (effect.isDish) {
                    // Dish (enemy attack) - remove when it hits left edge
                    if (effect.mesh.position.x < -this.screenBounds) {
                        this.scene.remove(effect.mesh);
                        this.effects.splice(i, 1);
                        continue;
                    }
                }
            }
            
            // Scale down damage effect
            if (effect.scaleDown) {
                const scale = 1 - (effect.elapsed / effect.lifetime);
                effect.mesh.scale.set(scale, scale, 1);
            }
            
            // Fade out
            if (effect.isDish) {
                // Only fade the dish, not the outline
                effect.mesh.children[0].material.opacity = 1 - (effect.elapsed / effect.lifetime);
            } else {
                effect.mesh.material.opacity = 1 - (effect.elapsed / effect.lifetime);
            }
            
            // Remove if expired (only for non-projectile effects)
            if (!effect.velocity && effect.elapsed >= effect.lifetime) {
                this.scene.remove(effect.mesh);
                this.effects.splice(i, 1);
            }
        }
    }

    cleanup() {
        // Remove all effects
        for (const effect of this.effects) {
            this.scene.remove(effect.mesh);
        }
        this.effects = [];
    }
}

// Export the class
window.AttackEffects = AttackEffects; 