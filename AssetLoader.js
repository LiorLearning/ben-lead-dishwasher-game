function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
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
export var AssetLoader = /*#__PURE__*/ function() {
    "use strict";
    function AssetLoader() {
        _class_call_check(this, AssetLoader);
        this.assets = {};
        this.assetURLs = {
            'minecraft': 'https://play.rosebud.ai/assets/minecraft.png?Q39E',
            'bow': 'https://play.rosebud.ai/assets/bow and arrow.png?zTlc',
            'sticks': 'https://play.rosebud.ai/assets/sticks.png?pPAL',
            'strings': 'https://play.rosebud.ai/assets/string.gif?LI32',
            'flint': 'https://play.rosebud.ai/assets/flint.png?wYiy',
            'feather': 'https://play.rosebud.ai/assets/feather.png?TRqd',
            'bg_Sandro': 'https://play.rosebud.ai/assets/bg_Sandro.png?DHOp',
            'full body zombie minecraft': 'https://play.rosebud.ai/assets/full body zombie minecraft.png?rfIu',
            'ironOre': 'https://play.rosebud.ai/assets/minecraft-iron-ore-cube-mr3AX6E-600-removebg-preview.png?FUcG',
            'greyCubeBlock': 'https://play.rosebud.ai/assets/grey cube block minecraft.png?ueiM',
            'dave minecraft': 'https://play.rosebud.ai/assets/dave minecraft.png?IPuk',
            'Platform_v2': 'https://play.rosebud.ai/assets/Platform_v2.png?dTgz',
            'piglin': 'https://play.rosebud.ai/assets/Piglin_BE.webp?cOvn',
            'lava pit': 'https://play.rosebud.ai/assets/lava pit.png?KI7k',
            'steve minecraft with golden boots': 'https://rosebud.ai/assets/steve minecraft with golden boots.png?EWhA'
        };
    }
    _create_class(AssetLoader, [
        {
            key: "loadImage",
            value: function loadImage(name, url) {
                var _this = this;
                return new Promise(function(resolve, reject) {
                    var img = new Image();
                    img.onload = function() {
                        _this.assets[name] = img;
                        resolve(img);
                    };
                    img.onerror = function() {
                        console.error("Failed to load image: ".concat(url));
                        reject(new Error("Failed to load image: ".concat(url)));
                    };
                    img.src = url;
                });
            }
        },
        {
            key: "getAsset",
            value: function getAsset(name) {
                return this.assets[name];
            }
        },
        {
            key: "loadAllAssets",
            value: function loadAllAssets() {
                var _this = this;
                return _async_to_generator(function() {
                    var loadPromises, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                loadPromises = Object.entries(_this.assetURLs).map(function(param) {
                                    var _param = _sliced_to_array(param, 2), name = _param[0], url = _param[1];
                                    return _this.loadImage(name, url);
                                });
                                return [
                                    4,
                                    Promise.all(loadPromises)
                                ];
                            case 1:
                                _state.sent();
                                console.log('All assets loaded successfully');
                                return [
                                    2,
                                    true
                                ];
                            case 2:
                                error = _state.sent();
                                console.error('Error loading assets:', error);
                                return [
                                    2,
                                    false
                                ];
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return AssetLoader;
}();
