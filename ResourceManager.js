function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
import { FloatingText } from './FloatingText.js';
export var ResourceManager = /*#__PURE__*/ function() {
    "use strict";
    function ResourceManager(game) {
        _class_call_check(this, ResourceManager);
        this.game = game;
        this.resources = {
            wood: 5,
            metal: 3,
            blueFlame: 2
        };
        // Crafting requirements for mighty spear
        this.craftingRequirements = {
            mightySpear: {
                wood: 5,
                metal: 3,
                blueFlame: 2
            }
        };
        // For tracking highlighted resources in UI
        this.highlightedResource = null;
        this.highlightTimer = 0;
        this.highlightDuration = 1000;
    }
    _create_class(ResourceManager, [
        {
            key: "update",
            value: function update(deltaTime) {
                // Update highlight timer
                if (this.highlightedResource && this.highlightTimer > 0) {
                    this.highlightTimer -= deltaTime;
                    if (this.highlightTimer <= 0) {
                        this.highlightedResource = null;
                    }
                }
            }
        },
        {
            key: "getResources",
            value: function getResources() {
                return this.resources;
            }
        },
        {
            key: "addResource",
            value: function addResource(type, amount) {
                if (this.resources[type] !== undefined) {
                    this.resources[type] += amount;
                    this.highlightResource(type);
                    return true;
                }
                return false;
            }
        },
        {
            key: "removeResource",
            value: function removeResource(type, amount) {
                if (!this.resources.hasOwnProperty(type)) {
                    console.warn("Resource type ".concat(type, " doesn't exist"));
                    return false;
                }
                if (this.resources[type] < amount) {
                    console.warn("Not enough ".concat(type, " to remove ").concat(amount));
                    return false;
                }
                this.resources[type] -= amount;
                // Create floating text animation for resource loss
                var text = "-".concat(amount, " ").concat(type, "!");
                var playerX = this.game.player.x;
                var playerY = this.game.player.y - 40;
                this.game.floatingTexts.push(new FloatingText(text, playerX, playerY));
                // Update crafting panel
                if (this.game.craftingPanel) {
                    this.game.craftingPanel.updateResources(this.resources);
                }
                return true;
            }
        },
        {
            key: "highlightResource",
            value: function highlightResource(type) {
                this.highlightedResource = type;
                this.highlightTimer = this.highlightDuration;
                // Also notify crafting panel about the highlight
                if (this.game.craftingPanel) {
                    this.game.craftingPanel.highlightResource(type);
                }
            }
        },
        {
            key: "getHighlightedResource",
            value: function getHighlightedResource() {
                if (this.highlightTimer > 0) {
                    return {
                        type: this.highlightedResource,
                        progress: this.highlightTimer / this.highlightDuration
                    };
                }
                return null;
            }
        },
        {
            key: "hasResources",
            value: function hasResources(type, amount) {
                return this.resources[type] >= amount;
            }
        },
        {
            key: "hasResourcesForCrafting",
            value: function hasResourcesForCrafting(itemType) {
                var requirements = this.craftingRequirements[itemType];
                if (!requirements) {
                    return false;
                }
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = Object.entries(requirements)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var _step_value = _sliced_to_array(_step.value, 2), resourceType = _step_value[0], amount = _step_value[1];
                        if (this.resources[resourceType] < amount) {
                            return false;
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
                return true;
            }
        },
        {
            key: "checkCraftingAvailability",
            value: function checkCraftingAvailability(itemType) {
                if (this.hasResourcesForCrafting(itemType)) {
                    // When bow is craftable
                    if (itemType === 'bow' && this.resources.sticks >= 10 && this.resources.strings >= 5 && this.resources.flint >= 5 && this.resources.feather >= 5) {
                        console.log("Bow can be crafted!");
                        return true;
                    }
                }
                return false;
            }
        },
        {
            key: "craftItem",
            value: function craftItem(itemType) {
                if (!this.hasResourcesForCrafting(itemType)) {
                    return false;
                }
                var requirements = this.craftingRequirements[itemType];
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Deduct resources
                    for(var _iterator = Object.entries(requirements)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var _step_value = _sliced_to_array(_step.value, 2), resourceType = _step_value[0], amount = _step_value[1];
                        this.resources[resourceType] -= amount;
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
                // Update crafting panel
                if (this.game.craftingPanel) {
                    this.game.craftingPanel.updateResources(this.resources);
                }
                return true;
            }
        },
        {
            key: "getResourceColor",
            value: function getResourceColor(type) {
                var resourceColors = {
                    wood: '#8B4513',    // Brown
                    metal: '#A9A9A9',   // Gray
                    blueFlame: '#00BFFF' // Deep Sky Blue
                };
                return resourceColors[type] || 'white';
            }
        },
        {
            key: "getResourceRequirements",
            value: function getResourceRequirements(itemType) {
                return this.craftingRequirements[itemType] || null;
            }
        }
    ]);
    return ResourceManager;
}();
