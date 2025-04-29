// audio-manager.js - Handles game audio including music and sound effects

class AudioManager {
    constructor() {
        // Initialize audio context
        this.audioContext = null;
        this.sounds = {};
        this.music = {};
        this.currentBgm = null;
        this.isMuted = false;
        
        // Initialize audio once user has interacted with the page
        this.setupAudioContext();
        
        // console.log('AudioManager initialized');
    }
    
    setupAudioContext() {
        try {
            // Create audio context
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Load game sounds
            this.loadSounds();
            
            // Setup volume controls
            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.connect(this.audioContext.destination);
            this.masterGainNode.gain.value = 0.7; // Default volume at 70%
            
        } catch (error) {
            console.error('Web Audio API is not supported in this browser:', error);
        }
    }
    
    loadSounds() {
        // Load sound effects
        this.loadSound('collect', 'assets/audio/collect.mp3');
        this.loadSound('jump', 'assets/audio/jump.mp3');
        this.loadSound('hit', 'assets/audio/hit.mp3');
        
        // Load background music
        this.loadMusic('bgm', 'assets/audio/bgm.mp3');
    }
    
    loadSound(name, url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load sound: ${name}`);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.sounds[name] = audioBuffer;
                // console.log(`Sound loaded: ${name}`);
            })
            .catch(error => {
                console.error(`Error loading sound ${name}:`, error);
            });
    }
    
    loadMusic(name, url) {
        // Create audio element for background music
        const audio = new Audio();
        audio.src = url;
        audio.loop = true;
        
        // Store music without connecting nodes yet
        this.music[name] = {
            element: audio,
            connected: false,
            source: null,
            gainNode: null
        };
        
        // console.log(`Music loaded: ${name}`);
    }
    
    playSound(name) {
        if (this.isMuted || !this.audioContext || !this.sounds[name]) return;
        
        try {
            // Create sound source
            const source = this.audioContext.createBufferSource();
            source.buffer = this.sounds[name];
            
            // Connect to master volume
            source.connect(this.masterGainNode);
            
            // Play the sound
            source.start(0);
        } catch (error) {
            console.error(`Error playing sound ${name}:`, error);
        }
    }
    
    playVictorySound() {
        // Use hit sound instead
        // this.playSound('hit');
    }
    
    playDefeatSound() {
        // Use hit sound instead
        // this.playSound('hit');
    }
    
    playMusic(name) {
        if (!this.music[name]) {
            console.warn(`Music not found: ${name}`);
            return;
        }
        
        // Stop current music if playing
        this.stopMusic();
        
        try {
            // Resume audio context if suspended
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            // Connect audio nodes if not already connected
            if (!this.music[name].connected && this.audioContext && this.audioContext.state !== 'closed') {
                try {
                    // Create a gain node for this music track
                    const gainNode = this.audioContext.createGain();
                    gainNode.gain.value = 0.5; // Set music volume slightly lower than effects
                    
                    // Create media element source
                    const source = this.audioContext.createMediaElementSource(this.music[name].element);
                    
                    // Connect source -> gain -> master
                    source.connect(gainNode);
                    gainNode.connect(this.masterGainNode);
                    
                    // Store references
                    this.music[name].source = source;
                    this.music[name].gainNode = gainNode;
                    this.music[name].connected = true;
                } catch (error) {
                    console.error(`Error setting up audio nodes for ${name}:`, error);
                    // If we fail to connect, we'll just play the audio directly
                }
            }
            
            // Play the music
            this.music[name].element.play().catch(error => {
                console.error(`Error playing music ${name}:`, error);
            });
            
            this.currentBgm = name;
        } catch (error) {
            console.error(`Error playing music ${name}:`, error);
        }
    }
    
    stopMusic() {
        if (this.currentBgm && this.music[this.currentBgm]) {
            this.music[this.currentBgm].element.pause();
            this.music[this.currentBgm].element.currentTime = 0;
            this.currentBgm = null;
        }
    }
    
    setMasterVolume(volume) {
        if (this.masterGainNode) {
            // Clamp volume between 0 and 1
            volume = Math.max(0, Math.min(1, volume));
            this.masterGainNode.gain.value = volume;
        }
    }
    
    setMusicVolume(volume) {
        // Set volume for all music tracks
        for (const key in this.music) {
            if (this.music[key].gainNode) {
                volume = Math.max(0, Math.min(1, volume));
                this.music[key].gainNode.gain.value = volume;
            } else {
                this.music[key].element.volume = volume;
            }
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.masterGainNode) {
            this.masterGainNode.gain.value = this.isMuted ? 0 : 0.7;
        }
        
        return this.isMuted;
    }
    
    cleanup() {
        // Stop all sounds and music
        this.stopMusic();
        
        // Close audio context
        if (this.audioContext) {
            this.audioContext.close().catch(error => {
                console.error('Error closing audio context:', error);
            });
        }
    }
} 