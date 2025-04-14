function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
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
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import React from 'react';
export var BootsCraftingPanel = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(BootsCraftingPanel, _React_Component);
    function BootsCraftingPanel(props) {
        _class_call_check(this, BootsCraftingPanel);
        var _this;
        _this = _call_super(this, BootsCraftingPanel, [
            props
        ]);
        _this.state = {
            grid: Array(9).fill(null),
            craftingComplete: false
        };
        _this.completionTimeout = null;
        return _this;
    }
    _create_class(BootsCraftingPanel, [
        {
            key: "componentWillUnmount",
            value: function componentWillUnmount() {
                // Clear any pending completion timeout
                if (this.completionTimeout) {
                    clearTimeout(this.completionTimeout);
                    this.completionTimeout = null;
                }
            }
        },
        {
            key: "handleGridClick",
            value: function handleGridClick(index) {
                var _this = this;
                if (this.state.craftingComplete || this.state.grid[index] !== null) return;
                var newGrid = _to_consumable_array(this.state.grid);
                newGrid[index] = 'goldNugget';
                this.setState({
                    grid: newGrid
                });
                // Check if boots crafting pattern is complete
                var isPatternComplete = newGrid[1] === 'goldNugget' && newGrid[3] === 'goldNugget' && newGrid[4] === 'goldNugget' && newGrid[5] === 'goldNugget' && newGrid[7] === 'goldNugget';
                if (isPatternComplete) {
                    this.setState({
                        craftingComplete: true
                    });
                    this.completionTimeout = setTimeout(function() {
                        var _this_props_onComplete, _this_props, _this_props_onClose, _this_props1;
                        (_this_props_onComplete = (_this_props = _this.props).onComplete) === null || _this_props_onComplete === void 0 ? void 0 : _this_props_onComplete.call(_this_props);
                        (_this_props_onClose = (_this_props1 = _this.props).onClose) === null || _this_props_onClose === void 0 ? void 0 : _this_props_onClose.call(_this_props1);
                    }, 1000);
                }
            }
        },
        {
            key: "renderSlot",
            value: function renderSlot(index) {
                var _this = this;
                var item = this.state.grid[index];
                var isActive = this.state.craftingComplete && item === 'goldNugget';
                return /*#__PURE__*/ _jsxDEV("div", {
                    onClick: function() {
                        return _this.handleGridClick(index);
                    },
                    className: "crafting-slot ".concat(isActive ? 'active' : ''),
                    children: item && /*#__PURE__*/ _jsxDEV("img", {
                        src: "https://play.rosebud.ai/assets/one gold nugget minecraft.png?qQYy",
                        alt: "gold nugget"
                    }, void 0, false, {
                        fileName: "BootsCraftingPanel.js",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this)
                }, index, false, {
                    fileName: "BootsCraftingPanel.js",
                    lineNumber: 48,
                    columnNumber: 7
                }, this);
            }
        },
        {
            key: "render",
            value: function render() {
                var _this = this;
                return /*#__PURE__*/ _jsxDEV("div", {
                    className: "crafting-overlay",
                    children: /*#__PURE__*/ _jsxDEV("div", {
                        className: "crafting-panel",
                        children: [
                            /*#__PURE__*/ _jsxDEV("h2", {
                                children: "Craft Golden Boots"
                            }, void 0, false, {
                                fileName: "BootsCraftingPanel.js",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("p", {
                                children: "Place gold nuggets in the correct pattern"
                            }, void 0, false, {
                                fileName: "BootsCraftingPanel.js",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "crafting-grid",
                                children: [
                                    0,
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ].map(function(i) {
                                    return _this.renderSlot(i);
                                })
                            }, void 0, false, {
                                fileName: "BootsCraftingPanel.js",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV("button", {
                                className: "close-button",
                                onClick: this.props.onClose,
                                children: "Close"
                            }, void 0, false, {
                                fileName: "BootsCraftingPanel.js",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "BootsCraftingPanel.js",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "BootsCraftingPanel.js",
                    lineNumber: 65,
                    columnNumber: 7
                }, this);
            }
        }
    ]);
    return BootsCraftingPanel;
}(React.Component);
