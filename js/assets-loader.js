// assets-loader.js - Handles loading and managing game assets

class AssetsLoader {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.assets = {
            textures: {},
            sprites: {}
        };
        this.loadingPromises = [];
    }

    // Load a texture with a specified name
    loadTexture(name, url) {
        const promise = new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                (texture) => {
                    this.assets.textures[name] = texture;
                    resolve(texture);
                },
                undefined, // onProgress callback not supported
                (error) => {
                    console.error(`Error loading texture ${name}:`, error);
                    reject(error);
                }
            );
        });
        
        this.loadingPromises.push(promise);
        return promise;
    }

    // Create a sprite from a loaded texture
    createSprite(name, textureName, width, height) {
        if (!this.assets.textures[textureName]) {
            console.error(`Texture ${textureName} not found`);
            return null;
        }

        const texture = this.assets.textures[textureName];
        // Calculate height based on original image aspect ratio
        const imageAspect = texture.image.width / texture.image.height;
        const calculatedHeight = width / imageAspect;

        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });

        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(width, calculatedHeight, 1);
        
        this.assets.sprites[name] = sprite;
        return sprite;
    }

    // Load all required game assets
    loadGameAssets() {
        // Load background texture
        this.loadTexture('background', 'assets/looping-background.png');
        
        // Load ground/platform textures
        this.loadTexture('towerPlatform', 'assets/stone-tower-top.png');
        
        // Load character textures
        this.loadTexture('tiger', 'assets/tiger-hero.png');
        this.loadTexture('dishwasher', 'assets/dishwasher-villain.png');
        
        // Load collectible textures
        this.loadTexture('fireOrb', 'assets/fire-orb.png');
        
        // Return a promise that resolves when all assets are loaded
        return Promise.all(this.loadingPromises).then(() => {
            console.log('All assets loaded successfully');
            return true;
        }).catch(error => {
            console.error('Error loading assets:', error);
            throw error;
        });
    }

    // Preload all assets at once and report progress
    preloadAll(onProgress) {
        let loaded = 0;
        const total = this.loadingPromises.length;
        
        // Create a new set of promises that report progress
        const progressPromises = this.loadingPromises.map(promise => {
            return promise.then(() => {
                loaded++;
                if (onProgress) {
                    onProgress(loaded / total);
                }
            });
        });
        
        return Promise.all(progressPromises);
    }
}

// Export the class
window.AssetsLoader = AssetsLoader;