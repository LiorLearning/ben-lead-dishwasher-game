export var CANVAS_WIDTH = 800;
export var CANVAS_HEIGHT = 500;
export var GROUND_LEVEL = 375;
export var GRAVITY = 0.7;
// Detect if using touch device for responsive design
export var IS_TOUCH_DEVICE = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
// Platform constants
export var PLATFORM_WIDTH = 250; // Increased from 150 to give more mining space
export var PLATFORM_HEIGHT = 20;
export var PLATFORM_COLOR = '#8B7355'; // Brown for wooden platforms
// Game state constants
export var GAME_STATE = {
    WELCOME: 'welcome',
    PLAYING: 'playing',
    QUIZ: 'quiz',
    CRAFTING: 'crafting',
    GAME_OVER: 'gameOver',
    VICTORY: 'victory'
};
// Resource mining constants
export var RESOURCE_TYPES = [
    'sticks',
    'strings',
    'flint',
    'feather'
];
export var MINING_REQUIRED_CLICKS = 5; // Number of times to press E to complete mining
export var GOLD_BOOTS_COST = 36; // Gold nuggets required to craft golden boots
