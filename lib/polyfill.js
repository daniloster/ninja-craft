(function(m){

// All credits for "nexorabletash/polyfill"

// Composited file - DO NOT EDIT
//----------------------------------------------------------------------
//
// ECMAScript 5 Polyfills
//
//----------------------------------------------------------------------

//----------------------------------------------------------------------
// ES5 15.2 Object Objects
//----------------------------------------------------------------------

//
// ES5 15.2.3 Properties of the Object Constructor
//

// ES5 15.2.3.2 Object.getPrototypeOf ( O )
// From http://ejohn.org/blog/objectgetprototypeof/
// NOTE: won't work for typical function T() {}; T.prototype = {}; new T; case
// since the constructor property is destroyed.
if (!Object.getPrototypeOf) {
  Object.getPrototypeOf = function (o) {
    if (o !== Object(o)) { throw TypeError("Object.getPrototypeOf called on non-object"); }
    return o.__proto__ || o.constructor.prototype || Object.prototype;
  };
}

//    // ES5 15.2.3.3 Object.getOwnPropertyDescriptor ( O, P )
//    if (typeof Object.getOwnPropertyDescriptor !== "function") {
//        Object.getOwnPropertyDescriptor = function (o, name) {
//            if (o !== Object(o)) { throw TypeError(); }
//            if (o.hasOwnProperty(name)) {
//                return {
//                    value: o[name],
//                    enumerable: true,
//                    writable: true,
//                    configurable: true
//                };
//            }
//        };
//    }

// ES5 15.2.3.4 Object.getOwnPropertyNames ( O )
if (typeof Object.getOwnPropertyNames !== "function") {
  Object.getOwnPropertyNames = function (o) {
    if (o !== Object(o)) { throw TypeError("Object.getOwnPropertyNames called on non-object"); }
    var props = [], p;
    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o, p)) {
        props.push(p);
      }
    }
    return props;
  };
}

// ES5 15.2.3.5 Object.create ( O [, Properties] )
if (typeof Object.create !== "function") {
  Object.create = function (prototype, properties) {
    if (typeof prototype !== "object") { throw TypeError(); }
    function Ctor() {}
    Ctor.prototype = prototype;
    var o = new Ctor();
    if (prototype) { o.constructor = Ctor; }
    if (properties !== undefined) {
      if (properties !== Object(properties)) { throw TypeError(); }
      Object.defineProperties(o, properties);
    }
    return o;
  };
}

// ES 15.2.3.6 Object.defineProperty ( O, P, Attributes )
// Partial support for most common case - getters, setters, and values
(function() {
  if (!Object.defineProperty ||
      !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (e) { return false; } } ())) {
    var orig = Object.defineProperty;
    Object.defineProperty = function (o, prop, desc) {
      // In IE8 try built-in implementation for defining properties on DOM prototypes.
      if (orig) { try { return orig(o, prop, desc); } catch (e) {} }

      if (o !== Object(o)) { throw TypeError("Object.defineProperty called on non-object"); }
      if (Object.prototype.__defineGetter__ && ('get' in desc)) {
        Object.prototype.__defineGetter__.call(o, prop, desc.get);
      }
      if (Object.prototype.__defineSetter__ && ('set' in desc)) {
        Object.prototype.__defineSetter__.call(o, prop, desc.set);
      }
      if ('value' in desc) {
        o[prop] = desc.value;
      }
      return o;
    };
  }
}());

// ES 15.2.3.7 Object.defineProperties ( O, Properties )
if (typeof Object.defineProperties !== "function") {
  Object.defineProperties = function (o, properties) {
    if (o !== Object(o)) { throw TypeError("Object.defineProperties called on non-object"); }
    var name;
    for (name in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, name)) {
        Object.defineProperty(o, name, properties[name]);
      }
    }
    return o;
  };
}


// ES5 15.2.3.14 Object.keys ( O )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = function (o) {
    if (o !== Object(o)) { throw TypeError('Object.keys called on non-object'); }
    var ret = [], p;
    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o, p)) {
        ret.push(p);
      }
    }
    return ret;
  };
}

//----------------------------------------------------------------------
// ES5 15.3 Function Objects
//----------------------------------------------------------------------

//
// ES5 15.3.4 Properties of the Function Prototype Object
//

// ES5 15.3.4.5 Function.prototype.bind ( thisArg [, arg1 [, arg2, ... ]] )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (o) {
    if (typeof this !== 'function') { throw TypeError("Bind must be called on a function"); }
    var slice = [].slice,
        args = slice.call(arguments, 1),
        self = this,
        bound = function () {
          return self.apply(this instanceof nop ? this : o,
                            args.concat(slice.call(arguments)));
        };

    function nop() {}
    nop.prototype = self.prototype;
    bound.prototype = new nop();
    return bound;
  };
}


//----------------------------------------------------------------------
// ES5 15.4 Array Objects
//----------------------------------------------------------------------

//
// ES5 15.4.3 Properties of the Array Constructor
//


// ES5 15.4.3.2 Array.isArray ( arg )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
Array.isArray = Array.isArray || function (o) { return Boolean(o && Object.prototype.toString.call(Object(o)) === '[object Array]'); };

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError("Array.from requires an array-like object - not null or undefined");
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else      
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

//
// ES5 15.4.4 Properties of the Array Prototype Object
//

// ES5 15.4.4.14 Array.prototype.indexOf ( searchElement [ , fromIndex ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) { return -1; }

    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (isNaN(n)) {
        n = 0;
      } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }

    if (n >= len) { return -1; }

    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

// ES5 15.4.4.15 Array.prototype.lastIndexOf ( searchElement [ , fromIndex ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf) {
  Array.prototype.lastIndexOf = function (searchElement /*, fromIndex*/) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) { return -1; }

    var n = len;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n !== n) {
        n = 0;
      } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }

    var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);

    for (; k >= 0; k--) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

// ES5 15.4.4.16 Array.prototype.every ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
  Array.prototype.every = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t && !fun.call(thisp, t[i], i, t)) {
        return false;
      }
    }

    return true;
  };
}

// ES5 15.4.4.17 Array.prototype.some ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
  Array.prototype.some = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t && fun.call(thisp, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}

// ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        fun.call(thisp, t[i], i, t);
      }
    }
  };
}


// ES5 15.4.4.19 Array.prototype.map ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Map
if (!Array.prototype.map) {
  Array.prototype.map = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var res = []; res.length = len;
    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        res[i] = fun.call(thisp, t[i], i, t);
      }
    }

    return res;
  };
}

// ES5 15.4.4.20 Array.prototype.filter ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Filter
if (!Array.prototype.filter) {
  Array.prototype.filter = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var res = [];
    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}


// ES5 15.4.4.21 Array.prototype.reduce ( callbackfn [ , initialValue ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (fun /*, initialValue */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    // no value to return if no initial value and an empty array
    if (len === 0 && arguments.length === 1) { throw TypeError(); }

    var k = 0;
    var accumulator;
    if (arguments.length >= 2) {
      accumulator = arguments[1];
    } else {
      do {
        if (k in t) {
          accumulator = t[k++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++k >= len) { throw TypeError(); }
      }
      while (true);
    }

    while (k < len) {
      if (k in t) {
        accumulator = fun.call(undefined, accumulator, t[k], k, t);
      }
      k++;
    }

    return accumulator;
  };
}


// ES5 15.4.4.22 Array.prototype.reduceRight ( callbackfn [, initialValue ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/ReduceRight
if (!Array.prototype.reduceRight) {
  Array.prototype.reduceRight = function (callbackfn /*, initialValue */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof callbackfn !== "function") { throw TypeError(); }

    // no value to return if no initial value, empty array
    if (len === 0 && arguments.length === 1) { throw TypeError(); }

    var k = len - 1;
    var accumulator;
    if (arguments.length >= 2) {
      accumulator = arguments[1];
    } else {
      do {
        if (k in this) {
          accumulator = this[k--];
          break;
        }

        // if array contains no values, no initial value to return
        if (--k < 0) { throw TypeError(); }
      }
      while (true);
    }

    while (k >= 0) {
      if (k in t) {
        accumulator = callbackfn.call(undefined, accumulator, t[k], k, t);
      }
      k--;
    }

    return accumulator;
  };
}


//----------------------------------------------------------------------
// ES5 15.5 String Objects
//----------------------------------------------------------------------

//
// ES5 15.5.4 Properties of the String Prototype Object
//


// ES5 15.5.4.20 String.prototype.trim()
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return String(this).replace(/^\s+/, '').replace(/\s+$/, '');
  };
}



//----------------------------------------------------------------------
// ES5 15.9 Date Objects
//----------------------------------------------------------------------


//
// ES 15.9.4 Properties of the Date Constructor
//

// ES5 15.9.4.4 Date.now ( )
// From https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Date/now
if (!Date.now) {
  Date.now = function now() {
    return Number(new Date());
  };
}


//
// ES5 15.9.5 Properties of the Date Prototype Object
//

// ES5 15.9.4.43 Date.prototype.toISOString ( )
// Inspired by http://www.json.org/json2.js
if (!Date.prototype.toISOString) {
  Date.prototype.toISOString = function () {
    function pad2(n) { return ('00' + n).slice(-2); }
    function pad3(n) { return ('000' + n).slice(-3); }

    return this.getUTCFullYear() + '-' +
      pad2(this.getUTCMonth() + 1) + '-' +
      pad2(this.getUTCDate()) + 'T' +
      pad2(this.getUTCHours()) + ':' +
      pad2(this.getUTCMinutes()) + ':' +
      pad2(this.getUTCSeconds()) + '.' +
      pad3(this.getUTCMilliseconds()) + 'Z';
  };
}
//----------------------------------------------------------------------
//
// Browser Polyfills
//
// This assumes ES5 or ES3 + es5.js
// (polyfill.js is es5.js + web.js for convenience)
//
//----------------------------------------------------------------------

(function(global) {
  if (!('window' in global && 'document' in global))
    return;

  //----------------------------------------------------------------------
  //
  // HTML - https://html.spec.whatwg.org
  //
  //----------------------------------------------------------------------

  // document.head attribute
  // Needed for: IE8-
  document.head = document.head || document.getElementsByTagName('head')[0];

  // Ensure correct parsing of newish elements ("shiv")
  // Needed for: IE8-
  [
    'abbr', 'article', 'aside', 'audio', 'bdi', 'canvas', 'data', 'datalist',
    'details', 'dialog', 'figcaption', 'figure', 'footer', 'header', 'hgroup',
    'main', 'mark', 'meter', 'nav', 'output', 'picture', 'progress', 'section',
    'summary', 'template', 'time', 'video'].forEach(function(tag) {
     document.createElement(tag);
   });

  // HTMLElement.dataset
  // Needed for: IE10-
  if (!('dataset' in document.createElement('span')) &&
      'Element' in global && Element.prototype && Object.defineProperty) {
    Object.defineProperty(Element.prototype, 'dataset', { get: function() {
      var result = Object.create(null);
      for (var i = 0; i < this.attributes.length; ++i) {
        var attr = this.attributes[i];
        if (attr.specified && attr.name.substring(0, 5) === 'data-') {
          (function(element, name) {
            result[name] = element.getAttribute('data-' + name); // Read-only, for IE8-
            Object.defineProperty(result, name, {
              get: function() {
                return element.getAttribute('data-' + name);
              },
              set: function(value) {
                element.setAttribute('data-' + name, value);
              }});
          }(this, attr.name.substring(5)));
        }
      }
      return result;
    }});
  }

  // Base64 utility methods
  // Needed for: IE9-
  (function() {
    if ('atob' in global && 'btoa' in global)
      return;

    var B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    function atob(input) {
      input = String(input);
      var position = 0,
          output = [],
          buffer = 0, bits = 0, n;

      input = input.replace(/\s/g, '');
      if ((input.length % 4) === 0) { input = input.replace(/=+$/, ''); }
      if ((input.length % 4) === 1) { throw Error("InvalidCharacterError"); }
      if (/[^+/0-9A-Za-z]/.test(input)) { throw Error("InvalidCharacterError"); }

      while (position < input.length) {
        n = B64_ALPHABET.indexOf(input.charAt(position));
        buffer = (buffer << 6) | n;
        bits += 6;

        if (bits === 24) {
          output.push(String.fromCharCode((buffer >> 16) & 0xFF));
          output.push(String.fromCharCode((buffer >>  8) & 0xFF));
          output.push(String.fromCharCode(buffer & 0xFF));
          bits = 0;
          buffer = 0;
        }
        position += 1;
      }

      if (bits === 12) {
        buffer = buffer >> 4;
        output.push(String.fromCharCode(buffer & 0xFF));
      } else if (bits === 18) {
        buffer = buffer >> 2;
        output.push(String.fromCharCode((buffer >> 8) & 0xFF));
        output.push(String.fromCharCode(buffer & 0xFF));
      }

      return output.join('');
    };

    function btoa(input) {
      input = String(input);
      var position = 0,
          out = [],
          o1, o2, o3,
          e1, e2, e3, e4;

      if (/[^\x00-\xFF]/.test(input)) { throw Error("InvalidCharacterError"); }

      while (position < input.length) {
        o1 = input.charCodeAt(position++);
        o2 = input.charCodeAt(position++);
        o3 = input.charCodeAt(position++);

        // 111111 112222 222233 333333
        e1 = o1 >> 2;
        e2 = ((o1 & 0x3) << 4) | (o2 >> 4);
        e3 = ((o2 & 0xf) << 2) | (o3 >> 6);
        e4 = o3 & 0x3f;

        if (position === input.length + 2) {
          e3 = 64;
          e4 = 64;
        }
        else if (position === input.length + 1) {
          e4 = 64;
        }

        out.push(B64_ALPHABET.charAt(e1),
                 B64_ALPHABET.charAt(e2),
                 B64_ALPHABET.charAt(e3),
                 B64_ALPHABET.charAt(e4));
      }

      return out.join('');
    };

    global.atob = atob;
    global.btoa = btoa;
  }());

  //----------------------------------------------------------------------
  //
  // DOM - https://dom.spec.whatwg.org/
  //
  //----------------------------------------------------------------------

  // Document.querySelectorAll method
  // http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
  // Needed for: IE7-
  if (!document.querySelectorAll) {
    document.querySelectorAll = function(selectors) {
      var style = document.createElement('style'), elements = [], element;
      document.documentElement.firstChild.appendChild(style);
      document._qsa = [];

      style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
      window.scrollBy(0, 0);
      style.parentNode.removeChild(style);

      while (document._qsa.length) {
        element = document._qsa.shift();
        element.style.removeAttribute('x-qsa');
        elements.push(element);
      }
      document._qsa = null;
      return elements;
    };
  }

  // Document.querySelector method
  // Needed for: IE7-
  if (!document.querySelector) {
    document.querySelector = function(selectors) {
      var elements = document.querySelectorAll(selectors);
      return (elements.length) ? elements[0] : null;
    };
  }

  // Document.getElementsByClassName method
  // Needed for: IE8-
  if (!document.getElementsByClassName) {
    document.getElementsByClassName = function(classNames) {
      classNames = String(classNames).replace(/^|\s+/g, '.');
      return document.querySelectorAll(classNames);
    };
  }

  // Node interface constants
  // Needed for: IE8-
  global.Node = global.Node || function() { throw TypeError("Illegal constructor"); };
  Node.ELEMENT_NODE = 1;
  Node.ATTRIBUTE_NODE = 2;
  Node.TEXT_NODE = 3;
  Node.CDATA_SECTION_NODE = 4;
  Node.ENTITY_REFERENCE_NODE = 5;
  Node.ENTITY_NODE = 6;
  Node.PROCESSING_INSTRUCTION_NODE = 7;
  Node.COMMENT_NODE = 8;
  Node.DOCUMENT_NODE = 9;
  Node.DOCUMENT_TYPE_NODE = 10;
  Node.DOCUMENT_FRAGMENT_NODE = 11;
  Node.NOTATION_NODE = 12;

  // DOMException constants
  // Needed for: IE8-
  global.DOMException = global.DOMException || function() { throw TypeError("Illegal constructor"); };
  DOMException.INDEX_SIZE_ERR = 1;
  DOMException.DOMSTRING_SIZE_ERR = 2;
  DOMException.HIERARCHY_REQUEST_ERR = 3;
  DOMException.WRONG_DOCUMENT_ERR = 4;
  DOMException.INVALID_CHARACTER_ERR = 5;
  DOMException.NO_DATA_ALLOWED_ERR = 6;
  DOMException.NO_MODIFICATION_ALLOWED_ERR = 7;
  DOMException.NOT_FOUND_ERR = 8;
  DOMException.NOT_SUPPORTED_ERR = 9;
  DOMException.INUSE_ATTRIBUTE_ERR = 10;
  DOMException.INVALID_STATE_ERR = 11;
  DOMException.SYNTAX_ERR = 12;
  DOMException.INVALID_MODIFICATION_ERR = 13;
  DOMException.NAMESPACE_ERR = 14;
  DOMException.INVALID_ACCESS_ERR = 15;

  // Event and EventTargets interfaces
  // Needed for: IE8
  (function(){
    if (!('Element' in global) || Element.prototype.addEventListener || !Object.defineProperty)
      return;

    // interface Event

    // PhaseType (const unsigned short)
    Event.CAPTURING_PHASE = 1;
    Event.AT_TARGET       = 2;
    Event.BUBBLING_PHASE  = 3;

    Object.defineProperties(Event.prototype, {
      CAPTURING_PHASE: { get: function() { return 1; } },
      AT_TARGET:       { get: function() { return 2; } },
      BUBBLING_PHASE:   { get: function() { return 3; } },
      target: {
        get: function() {
          return this.srcElement;
        }},
      currentTarget: {
        get: function() {
          return this._currentTarget;
        }},
      eventPhase: {
        get: function() {
          return (this.srcElement === this.currentTarget) ? Event.AT_TARGET : Event.BUBBLING_PHASE;
        }},
      bubbles: {
        get: function() {
          switch (this.type) {
            // Mouse
          case 'click':
          case 'dblclick':
          case 'mousedown':
          case 'mouseup':
          case 'mouseover':
          case 'mousemove':
          case 'mouseout':
          case 'mousewheel':
            // Keyboard
          case 'keydown':
          case 'keypress':
          case 'keyup':
            // Frame/Object
          case 'resize':
          case 'scroll':
            // Form
          case 'select':
          case 'change':
          case 'submit':
          case 'reset':
            return true;
          }
          return false;
        }},
      cancelable: {
        get: function() {
          switch (this.type) {
            // Mouse
          case 'click':
          case 'dblclick':
          case 'mousedown':
          case 'mouseup':
          case 'mouseover':
          case 'mouseout':
          case 'mousewheel':
            // Keyboard
          case 'keydown':
          case 'keypress':
          case 'keyup':
            // Form
          case 'submit':
            return true;
          }
          return false;
        }},
      timeStamp: {
        get: function() {
          return this._timeStamp;
        }},
      stopPropagation: {
        value: function() {
          this.cancelBubble = true;
        }},
      preventDefault: {
        value: function() {
          this.returnValue = false;
        }},
      defaultPrevented: {
        get: function() {
          return this.returnValue === false;
        }}
    });

    // interface EventTarget

    function addEventListener(type, listener, useCapture) {
      if (typeof listener !== 'function') return;
      if (type === 'DOMContentLoaded') type = 'load';
      var target = this;
      var f = function(e) {
        e._timeStamp = Date.now();
        e._currentTarget = target;
        listener.call(this, e);
        e._currentTarget = null;
      };
      this['_' + type + listener] = f;
      this.attachEvent('on' + type, f);
    }

    function removeEventListener(type, listener, useCapture) {
      if (typeof listener !== 'function') return;
      if (type === 'DOMContentLoaded') type = 'load';
      var f = this['_' + type + listener];
      if (f) {
        this.detachEvent('on' + type, f);
        this['_' + type + listener] = null;
      }
    }

    [Window, HTMLDocument, Element].forEach(function(o) {
      o.prototype.addEventListener = addEventListener;
      o.prototype.removeEventListener = removeEventListener;
    });
  }());

  // Shim for DOM Events for IE7-
  // http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
  // Use addEvent(object, event, handler) instead of object.addEventListener(event, handler)
  window.addEvent = function(obj, type, fn) {
    if (obj.addEventListener) {
      obj.addEventListener(type, fn, false);
    } else if (obj.attachEvent) {
      obj["e" + type + fn] = fn;
      obj[type + fn] = function() {
        var e = window.event;
        e.currentTarget = obj;
        e.preventDefault = function() { e.returnValue = false; };
        e.stopPropagation = function() { e.cancelBubble = true; };
        e.target = e.srcElement;
        e.timeStamp = Date.now();
        obj["e" + type + fn].call(this, e);
      };
      obj.attachEvent("on" + type, obj[type + fn]);
    }
  };

  window.removeEvent = function(obj, type, fn) {
    if (obj.removeEventListener) {
      obj.removeEventListener(type, fn, false);
    } else if (obj.detachEvent) {
      obj.detachEvent("on" + type, obj[type + fn]);
      obj[type + fn] = null;
      obj["e" + type + fn] = null;
    }
  };

  // DOMTokenList interface and Element.classList / Element.relList
  // Needed for: IE9-
  // Use getClassList(elem) instead of elem.classList() if IE7- support is needed
  // Use getRelList(elem) instead of elem.relList() if IE7- support is needed
  (function() {
    function DOMTokenListShim(o, p) {
      function split(s) { return s.length ? s.split(/\s+/g) : []; }

      // NOTE: This does not exactly match the spec.
      function removeTokenFromString(token, string) {
        var tokens = split(string),
            index = tokens.indexOf(token);
        if (index !== -1) {
          tokens.splice(index, 1);
        }
        return tokens.join(' ');
      }

      Object.defineProperties(
        this,
        {
          length: {
            get: function() { return split(o[p]).length; }
          },

          item: {
            value: function(idx) {
              var tokens = split(o[p]);
              return 0 <= idx && idx < tokens.length ? tokens[idx] : null;
            }
          },

          contains: {
            value: function(token) {
              token = String(token);
              if (token.length === 0) { throw SyntaxError(); }
              if (/\s/.test(token)) { throw Error("InvalidCharacterError"); }
              var tokens = split(o[p]);

              return tokens.indexOf(token) !== -1;
            }
          },

          add: {
            value: function(/*tokens...*/) {
              var tokens = Array.prototype.slice.call(arguments).map(String);
              if (tokens.some(function(token) { return token.length === 0; })) {
                throw SyntaxError();
              }
              if (tokens.some(function(token) { return (/\s/).test(token); })) {
                throw Error("InvalidCharacterError");
              }

              try {
                var underlying_string = o[p];
                var token_list = split(underlying_string);
                tokens = tokens.filter(function(token) { return token_list.indexOf(token) === -1; });
                if (tokens.length === 0) {
                  return;
                }
                if (underlying_string.length !== 0 && !(/\s$/).test(underlying_string)) {
                  underlying_string += ' ';
                }
                underlying_string += tokens.join(' ');
                o[p] = underlying_string;
              } finally {
                var length = split(o[p]).length;
                if (this.length !== length) { this.length = length; }
              }
            }
          },

          remove: {
            value: function(/*tokens...*/) {
              var tokens = Array.prototype.slice.call(arguments).map(String);
              if (tokens.some(function(token) { return token.length === 0; })) {
                throw SyntaxError();
              }
              if (tokens.some(function(token) { return (/\s/).test(token); })) {
                throw Error("InvalidCharacterError");
              }

              try {
                var underlying_string = o[p];
                tokens.forEach(function(token) {
                  underlying_string = removeTokenFromString(token, underlying_string);
                });
                o[p] = underlying_string;
              } finally {
                var length = split(o[p]).length;
                if (this.length !== length) { this.length = length; }
              }
            }
          },

          toggle: {
            value: function(token, force) {
              try {
                token = String(token);
                if (token.length === 0) { throw SyntaxError(); }
                if (/\s/.test(token)) { throw Error("InvalidCharacterError"); }
                var tokens = split(o[p]),
                    index = tokens.indexOf(token);

                if (index !== -1 && (!force || force === (void 0))) {
                  o[p] = removeTokenFromString(token, o[p]);
                  return false;
                }
                if (index !== -1 && force) {
                  return true;
                }
                var underlying_string = o[p];
                if (underlying_string.length !== 0 && !/\s$/.test(underlying_string)) {
                  underlying_string += ' ';
                }
                underlying_string += token;
                o[p] = underlying_string;
                return true;
              } finally {
                var length = split(o[p]).length;
                if (this.length !== length) { this.length = length; }
              }
            }
          },

          toString: {
            value: function() {
              return o[p];
            }
          }
        });
      if (!('length' in this)) {
        // In case getters are not supported
        this.length = split(o[p]).length;
      } else {
        // If they are, shim in index getters (up to 100)
        for (var i = 0; i < 100; ++i) {
          Object.defineProperty(this, String(i), {
            get: (function(n) { return function() { return this.item(n); }; }(i))
          });
        }
      }
    }

    function addToElementPrototype(p, f) {
      if ('Element' in global && Element.prototype && Object.defineProperty) {
        Object.defineProperty(Element.prototype, p, { get: f });
      }
    }

    // HTML - https://html.spec.whatwg.org
    // Element.classList
    if ('classList' in document.createElement('span')) {
      window.getClassList = function(elem) { return elem.classList; };
    } else {
      window.getClassList = function(elem) { return new DOMTokenListShim(elem, 'className'); };
      addToElementPrototype('classList', function() { return new DOMTokenListShim(this, 'className'); } );
    }

    // HTML - https://html.spec.whatwg.org
    // HTMLAnchorElement.relList
    // HTMLLinkElement.relList
    if ('relList' in document.createElement('link')) {
      window.getRelList = function(elem) { return elem.relList; };
    } else {
      window.getRelList = function(elem) { return new DOMTokenListShim(elem, 'rel'); };
      addToElementPrototype('relList', function() { return new DOMTokenListShim(this, 'rel'); } );
    }
  }());

  //----------------------------------------------------------------------
  //
  // XMLHttpRequest - https://xhr.spec.whatwg.org
  //
  //----------------------------------------------------------------------

  // XMLHttpRequest interface
  // Needed for: IE7-
  global.XMLHttpRequest = global.XMLHttpRequest || function() {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (_) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (_) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (_) { }
    throw Error("This browser does not support XMLHttpRequest.");
  };

  // XMLHttpRequest interface constants
  // Needed for IE8-
  XMLHttpRequest.UNSENT = 0;
  XMLHttpRequest.OPENED = 1;
  XMLHttpRequest.HEADERS_RECEIVED = 2;
  XMLHttpRequest.LOADING = 3;
  XMLHttpRequest.DONE = 4;

  // FormData interface
  // Needed for: IE9-
  (function() {
    if ('FormData' in global)
      return;

    function FormData(form) {
      this._data = [];
      if (!form) return;
      for (var i = 0; i < form.elements.length; ++i) {
        var element = form.elements[i];
        if (element.name !== '')
          this.append(element.name, element.value);
      }
    }

    FormData.prototype = {
      append: function(name, value /*, filename */) {
        if ('Blob' in global && value instanceof global.Blob)
          throw TypeError("Blob not supported");
        name = String(name);
        this._data.push([name, value]);
      },

      toString: function() {
        return this._data.map(function(pair) {
          return encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]);
        }).join('&');
      }
    };

    global.FormData = FormData;
    var send = global.XMLHttpRequest.prototype.send;
    global.XMLHttpRequest.prototype.send = function(body) {
      if (body instanceof FormData) {
        this.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        arguments[0] = body.toString();
      }
      return send.apply(this, arguments);
    };
  }());

  //----------------------------------------------------------------------
  //
  // Other
  //
  //----------------------------------------------------------------------

  // requestAnimationFrame
  // http://www.w3.org/TR/animation-timing/
  // Needed for: IE9-
  (function() {
    if ('requestAnimationFrame' in global)
      return;

    var TARGET_FPS = 60,
        requests = Object.create(null),
        raf_handle = 0,
        timeout_handle = -1;

    function isVisible(element) {
      return element.offsetWidth > 0 && element.offsetHeight > 0;
    }

    function onFrameTimer() {
      var cur_requests = requests;
      requests = Object.create(null);
      timeout_handle = -1;
      Object.keys(cur_requests).forEach(function(id) {
        var request = cur_requests[id];
        if (!request.element || isVisible(request.element))
          request.callback(Date.now());
      });
    }

    function requestAnimationFrame(callback, element) {
      var cb_handle = ++raf_handle;
      requests[cb_handle] = {callback: callback, element: element};
      if (timeout_handle === -1)
        timeout_handle = global.setTimeout(onFrameTimer, 1000 / TARGET_FPS);
      return cb_handle;
    }

    function cancelAnimationFrame(handle) {
      delete requests[handle];
      if (Object.keys(requests).length === 0) {
        global.clearTimeout(timeout_handle);
        timeout_handle = -1;
      }
    }

    global.requestAnimationFrame = requestAnimationFrame;
    global.cancelAnimationFrame = cancelAnimationFrame;
  }());

  // CSSOM View Module - http://dev.w3.org/csswg/cssom-view/
  // Fix for IE8-'s Element.getBoundingClientRect()
  if ('TextRectangle' in this && !('width' in TextRectangle.prototype)) {
    Object.defineProperties(TextRectangle.prototype, {
      'width': { get: function() { return this.right - this.left; } },
      'height': { get: function() { return this.bottom - this.top; } }
    });
  }

  // setImmediate
  // https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
  // (Not widely adopted.)
  (function() {
    if ('setImmediate' in global)
      return;

    function setImmediate(callback/*, args*/) {
      var params = [].slice.call(arguments, 1);
      return global.setTimeout(function() {
        callback.apply(null, params);
      }, 0);
    }

    function clearImmediate(handle) {
      global.clearTimeout(handle);
    }

    global.setImmediate = setImmediate;
    global.clearImmediate = clearImmediate;
  }());

}(this));
//----------------------------------------------------------------------
//
// Non-standard JavaScript (Mozilla) functions
//
//----------------------------------------------------------------------

(function () {
  // JavaScript 1.8.1
  String.prototype.trimLeft = String.prototype.trimLeft || function () {
    return String(this).replace(/^\s+/, '');
  };

  // JavaScript 1.8.1
  String.prototype.trimRight = String.prototype.trimRight || function () {
    return String(this).replace(/\s+$/, '');
  };

  // JavaScript 1.?
  var ESCAPES = {
    //'\x00': '\\0', Special case in FF3.6, removed by FF10
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"' : '\\"',
    '\\': '\\\\'
  };
  String.prototype.quote = String.prototype.quote || function() {
    return '"' + String(this).replace(/[\x00-\x1F"\\\x7F-\uFFFF]/g, function(c) {
      if (Object.prototype.hasOwnProperty.call(ESCAPES, c))
        return ESCAPES[c];
      var cc = c.charCodeAt(0);
      if (cc <= 0xFF)
        return '\\x' + ('00' + cc.toString(16).toUpperCase()).slice(-2);
      return '\\u' + ('0000' + cc.toString(16).toUpperCase()).slice(-4);
    }) + '"';
  };
}());

})(module);