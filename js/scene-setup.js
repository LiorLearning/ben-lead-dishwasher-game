// scene-setup.js - Handles the Three.js scene, camera, and rendering

class SceneSetup {
    constructor() {
        this.scene = new THREE.Scene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLighting();
        this.setupResizeHandler();
        
        // Array to store all elevated platforms
        this.elevatedPlatforms = [];
        
        // Moving platform properties
        this.movingPlatform = null;
        this.platformSpeed = 6; // Increased from 4 to 6 units per second
        this.platformSpawnTimer = 0;
        this.platformSpawnInterval = 5; // seconds

        // Background scrolling properties
        this.backgroundSpeed = 5; // Increased from 4 to 5 units per second
        this.backgroundWidth = 20; // Width of one background segment
        this.backgroundSegments = [];
    }

    setupCamera() {
        // Orthographic camera for 2D-style gameplay
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 10;
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB); // Sky blue fallback color
        document.body.appendChild(this.renderer.domElement);
    }

    setupLighting() {
        // Ambient light for overall scene brightness
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        
        // Directional light to simulate sunlight
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            const aspect = window.innerWidth / window.innerHeight;
            const frustumSize = 10;
            
            this.camera.left = frustumSize * aspect / -2;
            this.camera.right = frustumSize * aspect / 2;
            this.camera.top = frustumSize / 2;
            this.camera.bottom = frustumSize / -2;
            
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    setBackground(textureUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(textureUrl, (texture) => {
            // Create two background segments for seamless scrolling
            for (let i = 0; i < 2; i++) {
                const bgGeometry = new THREE.PlaneGeometry(this.backgroundWidth, 10);
                const bgMaterial = new THREE.MeshBasicMaterial({ 
                    map: texture,
                    depthWrite: false
                });
                
                const background = new THREE.Mesh(bgGeometry, bgMaterial);
                background.position.set(i * this.backgroundWidth, 0, -10);
                this.scene.add(background);
                this.backgroundSegments.push(background);
            }
        });
    }

    updateBackground(delta) {
        // Move all background segments
        this.backgroundSegments.forEach(segment => {
            segment.position.x -= this.backgroundSpeed * delta;
        });

        // Check if first segment is completely off screen
        if (this.backgroundSegments[0].position.x <= -this.backgroundWidth) {
            // Move first segment to the end
            const firstSegment = this.backgroundSegments.shift();
            firstSegment.position.x = this.backgroundSegments[0].position.x + this.backgroundWidth;
            this.backgroundSegments.push(firstSegment);
        }
    }

    createMainPlatform(textureUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(textureUrl, (texture) => {
            // Calculate dimensions to maintain aspect ratio and fit screen width
            const imageAspect = texture.image.width / texture.image.height;
            const screenAspect = window.innerWidth / window.innerHeight;
            const targetWidth = 10 * screenAspect; // Screen width in world units
            const targetHeight = targetWidth / imageAspect;
            
            const platformGeometry = new THREE.PlaneGeometry(targetWidth, targetHeight);
            const platformMaterial = new THREE.MeshBasicMaterial({ 
                map: texture,
                transparent: true,
                alphaTest: 0.5,
                depthWrite: false
            });
            
            const platform = new THREE.Mesh(platformGeometry, platformMaterial);
            // Position the platform so its bottom edge aligns with screen bottom
            platform.position.y = -5 + (targetHeight / 2); // -5 is bottom of screen, add half height to center
            platform.position.z = -1;
            this.scene.add(platform);
        });
    }

    createElevatedPlatform(x, y) {
        // Create a stone-like platform using a box geometry
        const platformWidth = 3;
        const platformHeight = 0.5;
        const platformDepth = 1;
        
        // Create the main platform geometry
        const platformGeometry = new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth);
        
        // Create a stone-like material
        const platformMaterial = new THREE.MeshPhongMaterial({
            color: 0x888888,
            shininess: 30,
            specular: 0x111111,
            flatShading: true
        });
        
        // Create the platform mesh
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(x, y, 0);
        
        // Add some stone-like details
        const detailGeometry = new THREE.BoxGeometry(platformWidth * 0.1, platformHeight * 0.8, platformDepth * 0.8);
        const detailMaterial = new THREE.MeshPhongMaterial({
            color: 0x666666,
            shininess: 20,
            specular: 0x111111,
            flatShading: true
        });
        
        // Add some random stone details
        for (let i = 0; i < 3; i++) {
            const detail = new THREE.Mesh(detailGeometry, detailMaterial);
            const offsetX = (Math.random() - 0.5) * platformWidth * 0.6;
            const offsetY = -platformHeight * 0.1;
            detail.position.set(offsetX, offsetY, 0);
            platform.add(detail);
        }
        
        this.scene.add(platform);
        
        // Store platform information for collision detection
        this.elevatedPlatforms.push({
            x: x,
            y: y,
            width: platformWidth,
            height: platformHeight
        });
    }

    createMovingPlatform() {
        // Create a stone-like platform using a box geometry
        const platformWidth = 3;
        const platformHeight = 0.5;
        const platformDepth = 1;
        
        // Create the main platform geometry
        const platformGeometry = new THREE.BoxGeometry(platformWidth, platformHeight, platformDepth);
        
        // Create a stone-like material
        const platformMaterial = new THREE.MeshPhongMaterial({
            color: 0x888888,
            shininess: 30,
            specular: 0x111111,
            flatShading: true
        });
        
        // Create the platform mesh
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.set(10, 0, 0); // Start from right side
        
        // Add some stone-like details
        const detailGeometry = new THREE.BoxGeometry(platformWidth * 0.1, platformHeight * 0.8, platformDepth * 0.8);
        const detailMaterial = new THREE.MeshPhongMaterial({
            color: 0x666666,
            shininess: 20,
            specular: 0x111111,
            flatShading: true
        });
        
        // Add some random stone details
        for (let i = 0; i < 3; i++) {
            const detail = new THREE.Mesh(detailGeometry, detailMaterial);
            const offsetX = (Math.random() - 0.5) * platformWidth * 0.6;
            const offsetY = -platformHeight * 0.1;
            detail.position.set(offsetX, offsetY, 0);
            platform.add(detail);
        }
        
        this.scene.add(platform);
        this.movingPlatform = platform;
        
        // Store platform information for collision detection
        this.elevatedPlatforms.push({
            x: platform.position.x,
            y: platform.position.y,
            width: platformWidth,
            height: platformHeight
        });
        
        console.log('Created new moving platform. Total platforms:', this.elevatedPlatforms.length);
    }

    updateMovingPlatform(delta) {
        if (this.movingPlatform) {
            // Move platform from right to left at slightly faster speed than background
            this.movingPlatform.position.x -= (this.backgroundSpeed + 1) * delta;
            
            // Update platform collision data
            const platformIndex = this.elevatedPlatforms.length - 1;
            if (platformIndex >= 0) {
                this.elevatedPlatforms[platformIndex].x = this.movingPlatform.position.x;
            }
            
            // Remove platform when it goes off screen
            if (this.movingPlatform.position.x < -10) {
                this.scene.remove(this.movingPlatform);
                this.movingPlatform = null;
                this.elevatedPlatforms.pop();
                
                // Notify collectible manager that a platform was removed
                if (window.game && window.game.collectibleManager) {
                    window.game.collectibleManager.platformRemoved();
                }
            }
        } else {
            // Spawn new platform every 5 seconds
            this.platformSpawnTimer += delta;
            if (this.platformSpawnTimer >= this.platformSpawnInterval) {
                this.createMovingPlatform();
                this.platformSpawnTimer = 0;
            }
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    isOnPlatform(x, y, width) {
        // Check if position is on the main platform
        if (y <= -2.5 && y >= -3.5) {
            return true;
        }
        return false;
    }

    getPlatformYAt(x, y, width, velocityY) {
        // Check each elevated platform
        for (const platform of this.elevatedPlatforms) {
            // Check if we're within the platform's width
            if (Math.abs(x - platform.x) < (platform.width + width)/2) {
                // Only return platform height if:
                // 1. Player is above the platform
                // 2. Player is falling (negative velocity)
                // 3. Player is close enough to the platform's top
                const platformTop = platform.y + platform.height/2;
                if (y > platformTop && velocityY < 0 && y - platformTop < 1.0) {
                    return platformTop;
                }
            }
        }
        
        // If not on any elevated platform, return the ground level
        return -3;
    }
}

// Export the class
window.SceneSetup = SceneSetup;