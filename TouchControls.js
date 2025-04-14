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
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
var TouchControls = /*#__PURE__*/ function() {
    "use strict";
    function TouchControls(game) {
        _class_call_check(this, TouchControls);
        this.game = game;
        this.buttonSize = 60;
        this.buttonPadding = 20;
        this.alpha = 0.6;
        // Define button positions
        this.leftButton = {
            x: this.buttonPadding,
            y: CANVAS_HEIGHT - this.buttonPadding - this.buttonSize,
            width: this.buttonSize,
            height: this.buttonSize,
            action: 'left'
        };
        this.rightButton = {
            x: this.buttonPadding * 2 + this.buttonSize,
            y: CANVAS_HEIGHT - this.buttonPadding - this.buttonSize,
            width: this.buttonSize,
            height: this.buttonSize,
            action: 'right'
        };
        this.jumpButton = {
            x: this.buttonPadding * 3 + this.buttonSize * 2,
            y: CANVAS_HEIGHT - this.buttonPadding - this.buttonSize,
            width: this.buttonSize,
            height: this.buttonSize,
            action: 'jump'
        };
        this.collectButton = {
            x: this.buttonPadding * 4 + this.buttonSize * 3,
            y: CANVAS_HEIGHT - this.buttonPadding - this.buttonSize,
            width: this.buttonSize,
            height: this.buttonSize,
            action: 'collect'
        };
        this.buttons = [
            this.leftButton,
            this.rightButton,
            this.jumpButton,
            this.collectButton
        ];
        this.activeButtons = new Set();
        this.touchIds = new Map();
        this.setupListeners();
        this.isMobile = this.detectMobile();
    }
    _create_class(TouchControls, [
        {
            key: "detectMobile",
            value: function detectMobile() {
                // Simple mobile detection
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 800;
            }
        },
        {
            key: "setupListeners",
            value: function setupListeners() {
                // Add touch event listeners
                this.game.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
                this.game.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
                this.game.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
                this.game.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
            }
        },
        {
            key: "handleTouchStart",
            value: function handleTouchStart(event) {
                event.preventDefault();
                var rect = this.game.canvas.getBoundingClientRect();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = event.changedTouches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var touch = _step.value;
                        var x = (touch.clientX - rect.left) * (this.game.canvas.width / rect.width);
                        var y = (touch.clientY - rect.top) * (this.game.canvas.height / rect.height);
                        var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                        try {
                            for(var _iterator1 = this.buttons[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                var button = _step1.value;
                                if (this.isPointInButton(x, y, button)) {
                                    this.activeButtons.add(button.action);
                                    this.touchIds.set(touch.identifier, button.action);
                                    this.executeButtonAction(button.action, true);
                                    break;
                                }
                            }
                        } catch (err) {
                            _didIteratorError1 = true;
                            _iteratorError1 = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                    _iterator1.return();
                                }
                            } finally{
                                if (_didIteratorError1) {
                                    throw _iteratorError1;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "handleTouchMove",
            value: function handleTouchMove(event) {
                event.preventDefault();
                var rect = this.game.canvas.getBoundingClientRect();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = event.changedTouches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var touch = _step.value;
                        if (this.touchIds.has(touch.identifier)) {
                            var prevAction = this.touchIds.get(touch.identifier);
                            var x = (touch.clientX - rect.left) * (this.game.canvas.width / rect.width);
                            var y = (touch.clientY - rect.top) * (this.game.canvas.height / rect.height);
                            // Check if touch moved to a different button
                            var foundNewButton = false;
                            var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                            try {
                                for(var _iterator1 = this.buttons[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                    var button = _step1.value;
                                    if (this.isPointInButton(x, y, button)) {
                                        if (prevAction !== button.action) {
                                            // Stop previous action
                                            this.activeButtons.delete(prevAction);
                                            this.executeButtonAction(prevAction, false);
                                            // Start new action
                                            this.activeButtons.add(button.action);
                                            this.touchIds.set(touch.identifier, button.action);
                                            this.executeButtonAction(button.action, true);
                                        }
                                        foundNewButton = true;
                                        break;
                                    }
                                }
                            } catch (err) {
                                _didIteratorError1 = true;
                                _iteratorError1 = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                        _iterator1.return();
                                    }
                                } finally{
                                    if (_didIteratorError1) {
                                        throw _iteratorError1;
                                    }
                                }
                            }
                            // If touch moved outside all buttons
                            if (!foundNewButton) {
                                this.activeButtons.delete(prevAction);
                                this.touchIds.delete(touch.identifier);
                                this.executeButtonAction(prevAction, false);
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "handleTouchEnd",
            value: function handleTouchEnd(event) {
                event.preventDefault();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = event.changedTouches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var touch = _step.value;
                        if (this.touchIds.has(touch.identifier)) {
                            var action = this.touchIds.get(touch.identifier);
                            this.activeButtons.delete(action);
                            this.touchIds.delete(touch.identifier);
                            this.executeButtonAction(action, false);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "isPointInButton",
            value: function isPointInButton(x, y, button) {
                return x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height;
            }
        },
        {
            key: "executeButtonAction",
            value: function executeButtonAction(action, isActive) {
                var player = this.game.player;
                switch(action){
                    case 'left':
                        if (isActive) player.moveLeft();
                        else if (!this.activeButtons.has('right')) player.stop();
                        break;
                    case 'right':
                        if (isActive) player.moveRight();
                        else if (!this.activeButtons.has('left')) player.stop();
                        break;
                    case 'jump':
                        if (isActive) player.jump();
                        break;
                    case 'collect':
                        if (isActive) this.game.tryCollectResource();
                        break;
                }
            }
        },
        {
            key: "update",
            value: function update() {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Continuously apply active button actions
                    for(var _iterator = this.activeButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var action = _step.value;
                        if (action === 'left' || action === 'right' || action === 'jump') {
                            // Movement controls need to be applied continuously
                            this.executeButtonAction(action, true);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "render",
            value: function render(ctx) {
                if (!this.isMobile) return; // Only show controls on mobile
                ctx.save();
                ctx.globalAlpha = this.alpha;
                // Background for controls (semi-transparent)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fillRect(0, CANVAS_HEIGHT - this.buttonSize - this.buttonPadding * 2, CANVAS_WIDTH, this.buttonSize + this.buttonPadding * 2);
                // Draw directional controls (left and right buttons)
                for(var _i = 0, _iter = [
                    this.leftButton,
                    this.rightButton
                ]; _i < _iter.length; _i++){
                    var button = _iter[_i];
                    var isActive = this.activeButtons.has(button.action);
                    // Draw button background
                    ctx.fillStyle = isActive ? '#4a6ea9' : '#5D9CEC';
                    ctx.fillRect(button.x, button.y, button.width, button.height);
                    // Draw arrow
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    if (button.action === 'left') {
                        var arrowSize = this.buttonSize * 0.4;
                        var centerX = button.x + button.width / 2;
                        var centerY = button.y + button.height / 2;
                        ctx.moveTo(centerX + arrowSize / 2, centerY - arrowSize / 2);
                        ctx.lineTo(centerX - arrowSize / 2, centerY);
                        ctx.lineTo(centerX + arrowSize / 2, centerY + arrowSize / 2);
                    } else {
                        var arrowSize1 = this.buttonSize * 0.4;
                        var centerX1 = button.x + button.width / 2;
                        var centerY1 = button.y + button.height / 2;
                        ctx.moveTo(centerX1 - arrowSize1 / 2, centerY1 - arrowSize1 / 2);
                        ctx.lineTo(centerX1 + arrowSize1 / 2, centerY1);
                        ctx.lineTo(centerX1 - arrowSize1 / 2, centerY1 + arrowSize1 / 2);
                    }
                    ctx.fill();
                }
                // Draw jump button
                ctx.fillStyle = this.activeButtons.has('jump') ? '#4a8865' : '#4CAF50';
                ctx.fillRect(this.jumpButton.x, this.jumpButton.y, this.jumpButton.width, this.jumpButton.height);
                ctx.fillStyle = 'white';
                ctx.beginPath();
                var jumpX = this.jumpButton.x + this.jumpButton.width / 2;
                var jumpY = this.jumpButton.y + this.jumpButton.height / 2;
                var arrowSize2 = this.buttonSize * 0.4;
                ctx.moveTo(jumpX - arrowSize2 / 2, jumpY + arrowSize2 / 4);
                ctx.lineTo(jumpX, jumpY - arrowSize2 / 2);
                ctx.lineTo(jumpX + arrowSize2 / 2, jumpY + arrowSize2 / 4);
                ctx.fill();
                // Draw collect button
                ctx.fillStyle = this.activeButtons.has('collect') ? '#b44a4a' : '#FF5252';
                ctx.fillRect(this.collectButton.x, this.collectButton.y, this.collectButton.width, this.collectButton.height);
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '20px Arial';
                ctx.fillText('E', this.collectButton.x + this.collectButton.width / 2, this.collectButton.y + this.collectButton.height / 2 + 2);
                ctx.restore();
            }
        }
    ]);
    return TouchControls;
}();
export { TouchControls as default };
