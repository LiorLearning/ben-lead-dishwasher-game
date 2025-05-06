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
        
        // Multiple moving platforms properties
        this.movingPlatforms = [];
        this.platformSpeed = 6;
        this.platformSpawnTimer = 0;
        this.platformSpawnInterval = 5;
        this.platformHeights = [-1, 1, 2]; // Different vertical positions for platforms

        // Background scrolling properties
        this.backgroundSpeed = 5;
        this.backgroundWidth = 20;
        this.backgroundSegments = [];

        // Screen shake properties
        this.isScreenShaking = false;
        this.screenShakeDuration = 0.3; // Duration of screen shake in seconds
        this.screenShakeElapsed = 0;
        this.screenShakeIntensity = 0.2; // Intensity of screen shake
        this.originalCameraPosition = new THREE.Vector3();

        // Red outline effect properties
        this.isRedOutlineActive = false;
        this.redOutlineDuration = 0.5; // Duration of red outline effect
        this.redOutlineElapsed = 0;
        this.setupPostProcessing();
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
                background.position.set(i * this.backgroundWidth, 0, -1); // Position background behind shadows
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

    createMovingPlatform(height) {
        // Load the stone-tower-top texture first to get its dimensions
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('assets/stone-tower-top.png', (texture) => {
            // Calculate aspect ratio of the image
            const imageAspect = texture.image.width / texture.image.height;
            
            // Set desired collision dimensions (1.5x smaller)
            const collisionWidth = 3; // Original width
            const collisionHeight = 0.5; // Original height
            
            // Calculate visual dimensions that maintain aspect ratio
            const visualWidth = collisionWidth;
            const visualHeight = visualWidth / imageAspect;
            
            // Create the platform geometry with visual dimensions
            const platformGeometry = new THREE.PlaneGeometry(visualWidth, visualHeight);
            
            // Create the material
            const platformMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.5,
                depthWrite: false
            });
            
            // Create the platform mesh
            const platform = new THREE.Mesh(platformGeometry, platformMaterial);
            platform.position.set(10, height, -1); // Use provided height
            
            this.scene.add(platform);
            this.movingPlatforms.push(platform);
            
            // Store platform information for collision detection
            this.elevatedPlatforms.push({
                x: platform.position.x,
                y: platform.position.y,
                width: collisionWidth,
                height: collisionHeight
            });
            
            console.log('Created new moving platform at height:', height);
        });
    }

    updateMovingPlatform(delta) {
        // Update all moving platforms
        for (let i = this.movingPlatforms.length - 1; i >= 0; i--) {
            const platform = this.movingPlatforms[i];
            
            // Move platform from right to left
            platform.position.x -= (this.backgroundSpeed + 1) * delta;
            
            // Update platform collision data
            const platformIndex = this.elevatedPlatforms.length - this.movingPlatforms.length + i;
            if (platformIndex >= 0) {
                this.elevatedPlatforms[platformIndex].x = platform.position.x;
            }
            
            // Remove platform when it goes off screen
            if (platform.position.x < -10) {
                this.scene.remove(platform);
                this.movingPlatforms.splice(i, 1);
                this.elevatedPlatforms.splice(platformIndex, 1);
                
                // Notify collectible manager that a platform was removed
                if (window.game && window.game.collectibleManager) {
                    window.game.collectibleManager.platformRemoved();
                }
            }
        }
        
        // Spawn new platforms
        this.platformSpawnTimer += delta;
        if (this.platformSpawnTimer >= this.platformSpawnInterval) {
            // Randomly select a height from the available heights
            const randomHeight = this.platformHeights[Math.floor(Math.random() * this.platformHeights.length)];
            this.createMovingPlatform(randomHeight);
            this.platformSpawnTimer = 0;
        }
    }

    triggerScreenShake() {
        if (!this.isScreenShaking) {
            this.isScreenShaking = true;
            this.screenShakeElapsed = 0;
            this.originalCameraPosition.copy(this.camera.position);
        }
    }

    updateScreenShake(delta) {
        if (this.isScreenShaking) {
            this.screenShakeElapsed += delta;
            
            if (this.screenShakeElapsed >= this.screenShakeDuration) {
                // Reset camera position when shake is complete
                this.camera.position.copy(this.originalCameraPosition);
                this.isScreenShaking = false;
            } else {
                // Calculate shake progress (0 to 1)
                const progress = this.screenShakeElapsed / this.screenShakeDuration;
                // Ease-out effect (1 - progress^2)
                const intensity = this.screenShakeIntensity * (1 - progress * progress);
                
                // Random offset for shake effect
                const offsetX = (Math.random() - 0.5) * intensity;
                const offsetY = (Math.random() - 0.5) * intensity;
                
                // Apply shake offset to camera
                this.camera.position.x = this.originalCameraPosition.x + offsetX;
                this.camera.position.y = this.originalCameraPosition.y + offsetY;
            }
        }
    }

    setupPostProcessing() {
        // Create effect composer
        this.composer = new THREE.EffectComposer(this.renderer);
        
        // Add render pass
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Create red outline shader
        const redOutlineShader = {
            uniforms: {
                tDiffuse: { value: null },
                time: { value: 0 },
                intensity: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float time;
                uniform float intensity;
                varying vec2 vUv;
                
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    
                    // Calculate distance from center
                    vec2 center = vec2(0.5, 0.5);
                    float dist = length(vUv - center);
                    
                    // Create red outline effect
                    float outline = smoothstep(0.4, 0.5, dist) * intensity;
                    vec3 redTint = vec3(1.0, 0.0, 0.0);
                    
                    // Mix original color with red outline
                    color.rgb = mix(color.rgb, redTint, outline);
                    
                    // Add slight pulsing effect
                    float pulse = sin(time * 10.0) * 0.1 + 0.9;
                    color.rgb *= pulse;
                    
                    gl_FragColor = color;
                }
            `
        };
        
        // Add red outline pass
        this.redOutlinePass = new THREE.ShaderPass(redOutlineShader);
        this.redOutlinePass.renderToScreen = true;
        this.composer.addPass(this.redOutlinePass);
    }

    triggerRedOutline() {
        if (!this.isRedOutlineActive) {
            this.isRedOutlineActive = true;
            this.redOutlineElapsed = 0;
        }
    }

    updateRedOutline(delta) {
        if (this.isRedOutlineActive) {
            this.redOutlineElapsed += delta;
            
            if (this.redOutlineElapsed >= this.redOutlineDuration) {
                this.redOutlinePass.uniforms.intensity.value = 0;
                this.isRedOutlineActive = false;
            } else {
                // Calculate intensity with ease-out effect
                const progress = this.redOutlineElapsed / this.redOutlineDuration;
                const intensity = 0.5 * (1 - progress * progress);
                this.redOutlinePass.uniforms.intensity.value = intensity;
                this.redOutlinePass.uniforms.time.value = this.redOutlineElapsed;
            }
        }
    }

    render() {
        this.updateScreenShake(1/60);
        this.updateRedOutline(1/60);
        this.composer.render();
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

    createPlatform(x, y, width, height, isMoving = false) {
        const platform = {
            position: new THREE.Vector2(x, y),
            width: width,
            height: height,
            isMoving: isMoving,
            direction: 1,
            speed: 2,
            mesh: null,
            shadow: null
        };

        // Create platform mesh
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
            color: 0x8B4513,
            side: THREE.DoubleSide
        });
        platform.mesh = new THREE.Mesh(geometry, material);
        platform.mesh.position.set(x, y, 0);
        this.scene.add(platform.mesh);

        // Create platform shadow
        this.createPlatformShadow(platform);

        this.platforms.push(platform);
        return platform;
    }

    createPlatformShadow(platform) {
        const shadowGeometry = new THREE.CircleGeometry(1.5, 32);
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.4,
            depthWrite: false
        });
        platform.shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
        platform.shadow.position.set(platform.position.x, platform.position.y - 0.1, -0.5);
        platform.shadow.rotation.x = -Math.PI / 2;
        this.scene.add(platform.shadow);
    }

    updatePlatformShadow(platform) {
        if (platform.shadow) {
            platform.shadow.position.x = platform.position.x;
            platform.shadow.position.y = platform.position.y - 0.1;
        }
    }

    update(delta) {
        // Update moving platforms
        for (const platform of this.platforms) {
            if (platform.isMoving) {
                // ... existing platform movement code ...
                
                // Update platform shadow
                this.updatePlatformShadow(platform);
            }
        }
    }

    cleanup() {
        // ... existing cleanup code ...
        
        // Remove platform shadows
        for (const platform of this.platforms) {
            if (platform.shadow) {
                this.scene.remove(platform.shadow);
            }
        }
    }
}

// Export the class
window.SceneSetup = SceneSetup;