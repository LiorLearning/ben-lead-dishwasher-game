// attack-effects.js - Handles visual effects for attacks

class AttackEffects {
    constructor(scene) {
        this.scene = scene;
        this.effects = [];
        this.screenBounds = 8; // Match the new screen bounds from character controller
        this.trailParticles = []; // Array to store trail particles
        this.dishTrailParticles = []; // Separate array for dish trail particles
        
        // Load textures
        this.textures = {
            trident: new THREE.TextureLoader().load('assets/trident.png'),
            plate: new THREE.TextureLoader().load('assets/plate.png'),
            cup: new THREE.TextureLoader().load('assets/cup.png'),
            glass: new THREE.TextureLoader().load('assets/glass.png')
        };
        
        // Create smoke texture for dish trails
        this.createSmokeTexture();
        
        // Set texture properties
        Object.values(this.textures).forEach(texture => {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
        });
    }

    createSmokeTexture() {
        // Create a canvas for the smoke texture
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Create gradient for smoke effect
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.2, 'rgba(200, 200, 200, 0.6)');
        gradient.addColorStop(0.4, 'rgba(150, 150, 150, 0.4)');
        gradient.addColorStop(0.6, 'rgba(100, 100, 100, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        // Create texture from canvas
        this.textures.smoke = new THREE.CanvasTexture(canvas);
    }

    createFireballTrail(x, y, direction) {
        // Create trail particle material
        const trailMaterial = new THREE.SpriteMaterial({
            map: this.textures.trident,
            color: new THREE.Color(1, 1, 1), // White color
            transparent: true,
            opacity: 0.4,
            blending: THREE.NormalBlending
        });

        // Create trail sprite
        const trailSprite = new THREE.Sprite(trailMaterial);
        trailSprite.position.set(x, y, 0);
        trailSprite.scale.set(0.6, 0.6, 1); // Increased from 0.2 to 0.6 (3x)
        this.scene.add(trailSprite);

        // Add to trail particles array
        this.trailParticles.push({
            mesh: trailSprite,
            lifetime: 0.2, // Shorter lifetime for quick fade
            elapsed: 0,
            startScale: 0.6, // Increased from 0.2 to 0.6 (3x)
            startOpacity: 0.4,
            position: new THREE.Vector2(x, y)
        });
    }

    createDishTrail(x, y, direction) {
        // Create multiple trail particles with slight variations
        for (let i = 0; i < 3; i++) {
            const offsetX = (Math.random() - 0.5) * 0.2;
            const offsetY = (Math.random() - 0.5) * 0.2;
            const size = 0.2 + Math.random() * 0.1;
            
            const trailMaterial = new THREE.SpriteMaterial({
                map: this.textures.smoke,
                color: new THREE.Color(0.5, 0.5, 0.5),
                transparent: true,
                opacity: 0.6,
                blending: THREE.NormalBlending
            });

            const trailSprite = new THREE.Sprite(trailMaterial);
            trailSprite.position.set(x + offsetX, y + offsetY, 0);
            trailSprite.scale.set(size, size, 1);
            this.scene.add(trailSprite);

            this.dishTrailParticles.push({
                mesh: trailSprite,
                lifetime: 0.4, // Shorter lifetime than fireball trail
                elapsed: 0,
                startScale: size,
                startOpacity: 0.6,
                velocity: new THREE.Vector2(
                    (6 + Math.random() * 2) * direction, // Slightly random speed
                    (Math.random() - 0.5) * 0.5 // Small vertical movement
                )
            });
        }
    }

    createPlayerAttackEffect(x, y, direction = 1) {
        // Create trident sprite
        const material = new THREE.SpriteMaterial({
            map: this.textures.trident,
            transparent: true,
            opacity: 1.0,
            rotation: 0, // No rotation needed for trident
            blending: THREE.NormalBlending
        });
        const trident = new THREE.Sprite(material);
        trident.scale.set(2.4, 2.4, 1); // Increased from 0.8 to 2.4 (3x)
        trident.position.set(x, y, 0);
        this.scene.add(trident);
        
        // Add to effects array
        this.effects.push({
            mesh: trident,
            lifetime: 1.0,
            elapsed: 0,
            velocity: new THREE.Vector2(15 * direction, 0), // Slightly faster than fireball
            isFireball: true, // Keep this flag for compatibility
            startX: x,
            rotationSpeed: 0,
            startY: y,
            shouldRotate: false,
            lastTrailTime: 0,
            trailInterval: 0.03 // Create trail more frequently
        });
    }

    createEnemyAttackEffect(x, y, direction = -1) {
        // Check if dishwasher is defeated
        if (window.game && window.game.characterController && 
            window.game.characterController.characters.enemy && 
            window.game.characterController.characters.enemy.isDefeated) {
            return; // Don't create new dish attacks if dishwasher is defeated
        }

        // Randomly select dish type
        const dishTypes = ['plate', 'cup', 'glass'];
        const randomDish = dishTypes[Math.floor(Math.random() * dishTypes.length)];
        
        // Create dish sprite
        const material = new THREE.SpriteMaterial({
            map: this.textures[randomDish],
            transparent: true,
            opacity: 1.0,
            rotation: 0
        });
        const dish = new THREE.Sprite(material);
        dish.scale.set(0.8, 0.8, 1);
        dish.position.set(x, y, 0);
        this.scene.add(dish);
        
        // Add to effects array
        this.effects.push({
            mesh: dish,
            lifetime: 10.0,
            elapsed: 0,
            velocity: new THREE.Vector2(12 * direction, 0),
            isDish: true,
            dishType: randomDish,
            startX: x,
            rotationSpeed: 5.0,
            startY: y,
            lastTrailTime: 0,
            trailInterval: 0.1
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
            lifetime: 0.3,
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
                
                // Create trail for fireball
                if (effect.isFireball) {
                    effect.lastTrailTime += delta;
                    if (effect.lastTrailTime >= effect.trailInterval) {
                        this.createFireballTrail(
                            effect.mesh.position.x - 0.5 * effect.velocity.x * delta,
                            effect.mesh.position.y,
                            effect.velocity.x > 0 ? 1 : -1
                        );
                        effect.lastTrailTime = 0;
                    }
                }
                
                // Create trail for dish
                if (effect.isDish) {
                    effect.lastTrailTime += delta;
                    if (effect.lastTrailTime >= effect.trailInterval) {
                        this.createDishTrail(
                            effect.mesh.position.x - 0.3 * effect.velocity.x * delta,
                            effect.mesh.position.y,
                            effect.velocity.x > 0 ? 1 : -1
                        );
                        effect.lastTrailTime = 0;
                    }
                }
                
                // Apply rotation only if it's a dish
                if (effect.isDish && effect.rotationSpeed) {
                    effect.mesh.material.rotation += effect.rotationSpeed * delta;
                }
                
                // Check if projectile hit screen edge
                if (effect.isFireball) {
                    if (effect.mesh.position.x - effect.startX > this.screenBounds * 2) {
                        this.scene.remove(effect.mesh);
                        this.effects.splice(i, 1);
                        continue;
                    }
                } else if (effect.isDish) {
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
                effect.mesh.material.opacity = 1 - (effect.elapsed / effect.lifetime);
            } else if (effect.isFireball) {
                effect.mesh.material.opacity = 1.0;
            } else {
                effect.mesh.material.opacity = 1 - (effect.elapsed / effect.lifetime);
            }
            
            // Remove if expired (only for non-projectile effects)
            if (!effect.velocity && effect.elapsed >= effect.lifetime) {
                this.scene.remove(effect.mesh);
                this.effects.splice(i, 1);
            }
        }

        // Update and remove expired trail particles
        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            const particle = this.trailParticles[i];
            particle.elapsed += delta;
            
            const progress = particle.elapsed / particle.lifetime;
            particle.mesh.material.opacity = particle.startOpacity * (1 - progress);
            const scale = particle.startScale * (1 - progress);
            particle.mesh.scale.set(scale, scale, 1);
            
            if (particle.elapsed >= particle.lifetime) {
                this.scene.remove(particle.mesh);
                this.trailParticles.splice(i, 1);
            }
        }

        // Update and remove expired dish trail particles
        for (let i = this.dishTrailParticles.length - 1; i >= 0; i--) {
            const particle = this.dishTrailParticles[i];
            particle.elapsed += delta;
            
            // Update position
            particle.mesh.position.x += particle.velocity.x * delta;
            particle.mesh.position.y += particle.velocity.y * delta;
            
            // Update appearance
            const progress = particle.elapsed / particle.lifetime;
            particle.mesh.material.opacity = particle.startOpacity * (1 - progress);
            const scale = particle.startScale * (1 - progress * 0.5); // Shrink more slowly
            particle.mesh.scale.set(scale, scale, 1);
            
            if (particle.elapsed >= particle.lifetime) {
                this.scene.remove(particle.mesh);
                this.dishTrailParticles.splice(i, 1);
            }
        }
    }

    cleanup() {
        // Remove all effects
        for (const effect of this.effects) {
            this.scene.remove(effect.mesh);
        }
        this.effects = [];
        
        // Remove all trail particles
        for (const particle of this.trailParticles) {
            this.scene.remove(particle.mesh);
        }
        this.trailParticles = [];
        
        // Remove all dish trail particles
        for (const particle of this.dishTrailParticles) {
            this.scene.remove(particle.mesh);
        }
        this.dishTrailParticles = [];
    }
}

// Export the class
window.AttackEffects = AttackEffects; 