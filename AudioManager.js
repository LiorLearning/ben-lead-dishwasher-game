function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
export var AudioManager = /*#__PURE__*/ function() {
    "use strict";
    function AudioManager() {
        _class_call_check(this, AudioManager);
        this.sounds = {};
        this.isMuted = false;
        this.audioContext = null;
        this.backgroundMusic = null;
    }
    _create_class(AudioManager, [
        {
            key: "loadAllSounds",
            value: function loadAllSounds() {
                var _this = this;
                return _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        try {
                            // Create the audio context only when needed
                            _this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                            // Generate and store simple sound effects
                            _this.sounds['hurt'] = _this.generateSimpleSound(0.3, 'hurt');
                            _this.sounds['jump'] = _this.generateSimpleSound(0.2, 'jump');
                            _this.sounds['collect'] = _this.generateSimpleSound(0.2, 'collect');
                            _this.sounds['throw'] = _this.generateSimpleSound(0.2, 'throw');
                            
                            // Load background music
                            _this.backgroundMusic = new Audio('./assets/background-music.mp3');
                            _this.backgroundMusic.loop = true;
                            _this.backgroundMusic.volume = 0.5;
                            
                            console.log('All sounds loaded successfully');
                            return [
                                2,
                                true
                            ];
                        } catch (error) {
                            console.error('Error loading sounds:', error);
                            return [
                                2,
                                false
                            ];
                        }
                        return [
                            2
                        ];
                    });
                })();
            }
        },
        {
            // Generate a simple sound effect based on type
            key: "generateSimpleSound",
            value: function generateSimpleSound(duration, type) {
                // Create audio element
                var audio = new Audio();
                // Generate different oscillator patterns based on sound type
                var oscillator = this.audioContext.createOscillator();
                var gainNode = this.audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                // Configure oscillator based on sound type
                switch(type){
                    case 'hurt':
                        oscillator.type = 'sawtooth';
                        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                        oscillator.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + duration);
                        break;
                    case 'jump':
                        oscillator.type = 'sine';
                        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                        oscillator.frequency.linearRampToValueAtTime(900, this.audioContext.currentTime + duration);
                        break;
                    case 'collect':
                        oscillator.type = 'sine';
                        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                        oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + duration / 2);
                        oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + duration);
                        break;
                    case 'throw':
                        oscillator.type = 'square';
                        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                        oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + duration);
                        break;
                }
                // Configure gain (volume envelope)
                gainNode.gain.setValueAtTime(0.7, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
                // Start and stop the oscillator
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + duration);
                // Create an empty audio element as a placeholder
                // We'll play the actual sound via the AudioContext API
                return audio;
            }
        },
        {
            key: "play",
            value: function play(name) {
                var volume = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1.0;
                if (this.isMuted || !this.sounds[name]) return;
                try {
                    // Generate and play the sound on demand
                    var type = name;
                    var duration = name === 'hurt' ? 0.3 : 0.2;
                    // Create fresh nodes for each playback
                    var oscillator = this.audioContext.createOscillator();
                    var gainNode = this.audioContext.createGain();
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    // Apply volume adjustment
                    gainNode.gain.value = volume * 0.7;
                    // Configure oscillator based on sound type
                    switch(type){
                        case 'hurt':
                            oscillator.type = 'sawtooth';
                            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                            oscillator.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + duration);
                            break;
                        case 'jump':
                            oscillator.type = 'sine';
                            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                            oscillator.frequency.linearRampToValueAtTime(900, this.audioContext.currentTime + duration);
                            break;
                        case 'collect':
                            oscillator.type = 'sine';
                            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                            oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + duration / 2);
                            oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + duration);
                            break;
                    }
                    // Apply envelope
                    gainNode.gain.setValueAtTime(volume * 0.7, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
                    // Play the sound
                    oscillator.start();
                    oscillator.stop(this.audioContext.currentTime + duration);
                } catch (err) {
                    console.warn("Error playing sound ".concat(name, ":"), err);
                }
            }
        },
        {
            key: "mute",
            value: function mute() {
                this.isMuted = true;
                if (this.backgroundMusic) {
                    this.backgroundMusic.pause();
                }
            }
        },
        {
            key: "unmute",
            value: function unmute() {
                this.isMuted = false;
                if (this.backgroundMusic) {
                    this.backgroundMusic.play();
                }
            }
        },
        {
            key: "toggleMute",
            value: function toggleMute() {
                this.isMuted = !this.isMuted;
                if (this.backgroundMusic) {
                    if (this.isMuted) {
                        this.backgroundMusic.pause();
                    } else {
                        this.backgroundMusic.play();
                    }
                }
                return this.isMuted;
            }
        },
        {
            key: "startBackgroundMusic",
            value: function startBackgroundMusic() {
                if (this.backgroundMusic && !this.isMuted) {
                    this.backgroundMusic.play();
                }
            }
        }
    ]);
    return AudioManager;
}();
