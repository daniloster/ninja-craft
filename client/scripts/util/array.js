(function(){ 
    var hasNotBeenApplied = true;
    define([], function () {
        if (hasNotBeenApplied) {

            if (!Array.prototype.contains) {
                Array.prototype.contains = function(callback){
                    return this.getIndex(callback) > -1;
                };
            }

            Array.prototype.getIndex = function(callback){
                return this.reduce(function(cur, val, index){
                    if (callback(val, index) && cur === -1) {
                        return index;
                    }
                    return cur;
                }, -1);
            };
            
            if (!Array.prototype.remove) {
                Array.prototype.remove = function(callback){
                    return this.removeAt(this.getIndex(callback));
                };

                Array.prototype.removeAt = function(idx){
                    if (idx > -1 && idx < this.length) {
                        this.splice(idx, 1);
                        return true;
                    }
                    return false;
                };
            }
            // Production steps of ECMA-262, Edition 5, 15.4.4.18
            // Reference: http://es5.github.io/#x15.4.4.18
            if (!Array.prototype.forEach) {
                Array.prototype.forEach = function (callback, thisArg) {
                    var T, k;
                    if (this == null) {
                        throw new TypeError(' this is null or not defined');
                    }
                    var O = Object(this);
                    var len = O.length >>> 0;
                    if (typeof callback !== "function") {
                        throw new TypeError(callback + ' is not a function');
                    }
                    if (arguments.length > 1) {
                        T = thisArg;
                    }
                    k = 0;
                    while (k < len) {
                        var kValue;
                        if (k in O) {
                            kValue = O[k];
                            callback.call(T, kValue, k, O);
                        }
                        k++;
                    }
                };
            }

            if (!Array.prototype.filter) {
                Array.prototype.filter = function (fun/*, thisArg*/) {
                    'use strict';

                    if (this === void 0 || this === null) {
                        throw new TypeError();
                    }
                    var t = Object(this);
                    var len = t.length >>> 0;
                    if (typeof fun !== 'function') {
                        throw new TypeError();
                    }
                    var res = [];
                    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                    for (var i = 0; i < len; i++) {
                        if (i in t) {
                            var val = t[i];
                            if (fun.call(thisArg, val, i, t)) {
                                res.push(val);
                            }
                        }
                    }
                    return res;
                };
            }

            // Production steps of ECMA-262, Edition 5, 15.4.4.14
            // Reference: http://es5.github.io/#x15.4.4.14
            if (!Array.prototype.indexOf) {
                Array.prototype.indexOf = function (searchElement, fromIndex) {
                    var k;
                    if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                    }
                    var O = Object(this);
                    var len = O.length >>> 0;
                    if (len === 0) {
                        return -1;
                    }
                    var n = +fromIndex || 0;
                    if (Math.abs(n) === Infinity) {
                        n = 0;
                    }
                    if (n >= len) {
                        return -1;
                    }
                    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
                    while (k < len) {
                        if (k in O && O[k] === searchElement) {
                            return k;
                        }
                        k++;
                    }
                    return -1;
                };
            }

            // Production steps of ECMA-262, Edition 5, 15.4.4.19
            // Reference: http://es5.github.io/#x15.4.4.19
            if (!Array.prototype.map) {
                Array.prototype.map = function (callback, thisArg) {
                    var T, A, k;
                    if (this == null) {
                        throw new TypeError(' this is null or not defined');
                    }
                    var O = Object(this);
                    var len = O.length >>> 0;
                    if (typeof callback !== 'function') {
                        throw new TypeError(callback + ' is not a function');
                    }
                    if (arguments.length > 1) {
                        T = thisArg;
                    }
                    A = new Array(len);
                    k = 0;
                    while (k < len) {
                        var kValue, mappedValue;
                        if (k in O) {
                            kValue = O[k];
                            mappedValue = callback.call(T, kValue, k, O);
                            A[k] = mappedValue;
                        }
                        k++;
                    }
                    return A;
                };
            }

            // Production steps of ECMA-262, Edition 5, 15.4.4.21
            // Reference: http://es5.github.io/#x15.4.4.21
            if (!Array.prototype.reduce) {
                Array.prototype.reduce = function (callback /*, initialValue*/) {
                    'use strict';
                    if (this == null) {
                        throw new TypeError('Array.prototype.reduce called on null or undefined');
                    }
                    if (typeof callback !== 'function') {
                        throw new TypeError(callback + ' is not a function');
                    }
                    var t = Object(this), len = t.length >>> 0, k = 0, value;
                    if (arguments.length == 2) {
                        value = arguments[1];
                    } else {
                        while (k < len && !k in t) {
                            k++;
                        }
                        if (k >= len) {
                            throw new TypeError('Reduce of empty array with no initial value');
                        }
                        value = t[k++];
                    }
                    for (; k < len; k++) {
                        if (k in t) {
                            value = callback(value, t[k], k, t);
                        }
                    }
                    return value;
                };
            }

            Array.createFinder = (function (prop) {
                return function (arr, val) {
                    var items = arr.filter(function (item) {
                        return item[prop] == val;
                    });
                    return (items.length) ? items[0] : null;
                }
            });

            hasNotBeenApplied = false;
        }
    });
})();