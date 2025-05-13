class AudioManager {
    constructor() {
        // Create audio elements
        this.bgm = new Audio('assets/audio/bgm.mp3');
        this.attackSound = new Audio('assets/audio/roar.mp3');
        this.dishHitSound = new Audio('assets/audio/dish.mp3');
        this.answerSound = new Audio('assets/audio/answer.mp3');
        this.wrongSound = new Audio('assets/audio/wrong.mp3');
        this.buttonSound = new Audio('assets/audio/button.mp3');
        this.explosionSound = new Audio('assets/audio/explosion.mp3');
        this.portalSound = new Audio('assets/audio/portal.mp3');
        this.showerSound = new Audio('assets/audio/shower.mp3');
        this.shieldSound = new Audio('assets/audio/shield.mp3');

        // Set BGM to loop
        this.bgm.loop = true;

        // Set volume levels
        this.bgm.volume = 0.5; // Background music at 50% volume
        this.attackSound.volume = 0.7;
        this.dishHitSound.volume = 0.7;
        this.answerSound.volume = 0.7;
        this.wrongSound.volume = 0.7;
        this.buttonSound.volume = 0.7;
        this.explosionSound.volume = 0.7;
        this.portalSound.volume = 0.7;
        this.showerSound.volume = 0.7;
        this.shieldSound.volume = 0.7;
        
        // Track mute state
        this.isMuted = false;
        
        // Wait for audio to be loaded
        this.isLoaded = false;
        this.bgmLoaded = false;
        
        // Preload BGM with explicit loading
        this.bgm.preload = 'auto';
        this.bgm.load();
        
        // Wait for BGM to be fully loaded
        this.bgm.oncanplaythrough = () => {
            console.log('BGM fully loaded and ready to play');
            this.bgmLoaded = true;
        };

        // Preload all sound effects
        const soundEffects = [
            { name: 'attack', sound: this.attackSound },
            { name: 'dish hit', sound: this.dishHitSound },
            { name: 'answer', sound: this.answerSound },
            { name: 'wrong', sound: this.wrongSound },
            { name: 'button', sound: this.buttonSound },
            { name: 'explosion', sound: this.explosionSound },
            { name: 'portal', sound: this.portalSound },
            { name: 'shower', sound: this.showerSound },
            { name: 'shield', sound: this.shieldSound }
        ];
        
        // Load other sounds with explicit preloading
        Promise.all(soundEffects.map(({ name, sound }) => {
            sound.preload = 'auto';
            sound.load();
            
            return new Promise((resolve, reject) => {
                sound.oncanplaythrough = () => {
                    console.log(`${name} sound loaded`);
                    resolve();
                };
                sound.onerror = (error) => {
                    console.error(`Error loading ${name} sound:`, error);
                    reject(new Error(`Failed to load ${name} sound`));
                };
            });
        })).then(() => {
            console.log('All sound effects loaded successfully');
            this.isLoaded = true;
        }).catch(error => {
            console.error('Error loading sound effects:', error);
            // Continue even if some sounds fail to load
            this.isLoaded = true;
        });
    }

    // Wait for BGM to be fully loaded
    async waitForBGMLoad() {
        if (this.bgmLoaded) {
            return true;
        }
        
        return new Promise((resolve) => {
            const checkLoaded = () => {
                if (this.bgmLoaded) {
                    resolve(true);
                } else {
                    setTimeout(checkLoaded, 100);
                }
            };
            checkLoaded();
        });
    }

    playBGM() {
        if (!this.bgmLoaded) {
            console.log('BGM not loaded yet, waiting...');
            return;
        }

        console.log('Attempting to play BGM...');
        console.log('BGM element state:', {
            readyState: this.bgm.readyState,
            error: this.bgm.error,
            src: this.bgm.src,
            volume: this.bgm.volume,
            muted: this.bgm.muted
        });

        // Try to play the BGM
        const playPromise = this.bgm.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('BGM started playing');
            }).catch(error => {
                console.error('Error playing BGM:', error);
                // Try to play again after a short delay
                setTimeout(() => {
                    this.bgm.play().catch(e => {
                        console.error('Second attempt to play BGM failed:', e);
                    });
                }, 1000);
            });
        }
    }

    stopBGM() {
        this.bgm.pause();
        this.bgm.currentTime = 0;
    }

    playAttackSound() {
        if (!this.isLoaded) return;
        this.attackSound.currentTime = 0;
        this.attackSound.play().catch(error => {
            console.error('Error playing attack sound:', error);
        });
    }

    playDishHitSound() {
        if (!this.isLoaded) return;
        this.dishHitSound.currentTime = 0;
        this.dishHitSound.play().catch(error => {
            console.error('Error playing dish hit sound:', error);
        });
    }

    playAnswerSound() {
        if (!this.isLoaded) return;
        this.answerSound.currentTime = 0;
        this.answerSound.play().catch(error => {
            console.error('Error playing answer sound:', error);
        });
    }

    playWrongSound() {
        if (!this.isLoaded) return;
        this.wrongSound.currentTime = 0;
        this.wrongSound.play().catch(error => {
            console.error('Error playing wrong sound:', error);
        });
    }

    playButtonSound() {
        if (!this.isLoaded) return;
        this.buttonSound.currentTime = 0;
        this.buttonSound.play().catch(error => {
            console.error('Error playing button sound:', error);
        });
    }

    playExplosionSound() {
        if (!this.isLoaded) return;
        this.explosionSound.currentTime = 0;
        this.explosionSound.play().catch(error => {
            console.error('Error playing explosion sound:', error);
        });
    }

    playPortalSound() {
        if (!this.isLoaded) return;
        this.portalSound.currentTime = 0;
        this.portalSound.play().catch(error => {
            console.error('Error playing portal sound:', error);
        });
    }

    playShowerSound() {
        if (!this.isLoaded) return;
        this.showerSound.currentTime = 0;
        this.showerSound.loop = true; // Enable looping
        this.showerSound.play().catch(error => {
            console.error('Error playing shower sound:', error);
        });
    }

    stopShowerSound() {
        if (!this.isLoaded) return;
        this.showerSound.pause();
        this.showerSound.currentTime = 0;
        this.showerSound.loop = false; // Disable looping
    }

    playShieldSound() {
        if (!this.isLoaded) return;
        this.shieldSound.currentTime = 0;
        this.shieldSound.play().catch(error => {
            console.error('Error playing shield sound:', error);
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        // Get all audio elements
        const allSounds = [
            this.bgm,
            this.attackSound,
            this.dishHitSound,
            this.answerSound,
            this.wrongSound,
            this.buttonSound,
            this.explosionSound,
            this.portalSound,
            this.showerSound,
            this.shieldSound
        ];
        
        // Toggle mute state for all sounds
        allSounds.forEach(sound => {
            sound.muted = this.isMuted;
        });
        
        // If unmuting and BGM was playing, resume it
        if (!this.isMuted && this.bgmLoaded) {
            this.playBGM();
        }
        
        return this.isMuted;
    }
} 