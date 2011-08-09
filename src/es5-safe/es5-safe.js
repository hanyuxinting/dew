/**
 * @license The safe part of es5-shim v0.9.0
 * https://github.com/seajs/dew/tree/master/src/es5-safe
 */

/**
 * @fileoverview Provides compatibility shims so that legacy JavaScript
 * engines behave as closely as possible to ES5.
 *
 * @author lifesinger@gmail.com (Frank Wang)
 *
 * @see Thanks to:
 *   - http://es5.github.com/
 *   - http://kangax.github.com/es5-compat-table/
 *   - https://github.com/kriskowal/es5-shim
 */

(function(factory) {

  if (typeof define === 'function') {
    define([], factory);
  } else {
    factory();
  }

})(function() {

  var OP = Object.prototype;
  var AP = Array.prototype;
  var FP = Function.prototype;
  var hasOwnProperty = OP.hasOwnProperty;
  var slice = AP.slice;


  /*---------------------------------------*
   * Function
   *---------------------------------------*/

  // ES-5 15.3.4.5
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
  FP.bind || (FP.bind = function (that) {
    var target = this;

    // If IsCallable(func) is false, throw a TypeError exception.
    if (typeof target !== 'function') {
      throw new TypeError('Bind must be called on a function');
    }

    var boundArgs = slice.call(arguments, 1);

    function bound() {
      return target.apply(
          this instanceof bound ? this : that,
          boundArgs.concat(slice.call(arguments)));
    }

    bound.prototype = Object.create(target.prototype);

    // NOTICE: The function.length can not be changed.
    //bound.length = Math.max(target.length - boundArgs.length, 0);

    return bound;
  });


  /*---------------------------------------*
   * Object
   *---------------------------------------*/
  // http://ejohn.org/blog/ecmascript-5-objects-and-properties/

  // ES5 15.2.3.5
  // http://stackoverflow.com/questions/3075308/what-modernizer-scripts-exist-for-the-new-ecmascript-5-functions
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
  Object.create || (Object.create = function (proto) {
    if (proto === null) {
      throw new TypeError('null prototype is not supported');
    }
    if (typeof proto !== 'object' && typeof proto !== 'function') {
      throw new TypeError(proto + ' not an object or null');
    }
    if (arguments.length > 1) {
      throw Error('The second parameter is not supported');
    }

    /** @constructor */
    function F() {
    }
    F.prototype = proto;
    return new F();
  });


  // ES5 15.2.3.14
  // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
  // https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute
  // http://msdn.microsoft.com/en-us/library/adebfyya(v=vs.94).aspx
  Object.keys || (Object.keys = (function () {
    var hasDontEnumBug = !{toString:''}.propertyIsEnumerable('toString');
    var DontEnums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ];
    var DontEnumsLength = DontEnums.length;

    return function (o) {
      if (o !== Object(o)) {
        throw new TypeError(o + ' is not an object');
      }

      var result = [];

      for (var name in o) {
        if (hasOwnProperty.call(o, name)) {
          result.push(name);
        }
      }

      if (hasDontEnumBug) {
        for (var i = 0; i < DontEnumsLength; i++) {
          if (hasOwnProperty.call(o, DontEnums[i]))
            result.push(DontEnums[i]);
        }
      }

      return result;
    };
    
  })());


  /*---------------------------------------*
   * Array
   *---------------------------------------*/

  // ES5 15.4.3.2
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
  Array.isArray || (Array.isArray = function (obj) {
    return OP.toString.call(obj) === '[object Array]';
  });


  // ES5 15.4.4.18
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
  AP.forEach || (AP.forEach = function (callback, thisArg) {
    var len = +this.length;
    for (var i = 0; i < len; i++) {
      if (i in this) {
        callback.call(thisArg, this[i], i, this);
      }
    }
  });


// ES5 15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
  if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
      var len = +this.length;
      if (typeof fun !== "function")
        throw new TypeError();

      var res = new Array(len);
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in this)
          res[i] = fun.call(thisp, this[i], i, this);
      }

      return res;
    };
  }

// ES5 15.4.4.20
  if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(block /*, thisp */) {
      var values = [];
      var thisp = arguments[1];
      for (var i = 0; i < this.length; i++)
        if (block.call(thisp, this[i]))
          values.push(this[i]);
      return values;
    };
  }

// ES5 15.4.4.16
  if (!Array.prototype.every) {
    Array.prototype.every = function every(block /*, thisp */) {
      var thisp = arguments[1];
      for (var i = 0; i < this.length; i++)
        if (!block.call(thisp, this[i]))
          return false;
      return true;
    };
  }

// ES5 15.4.4.17
  if (!Array.prototype.some) {
    Array.prototype.some = function some(block /*, thisp */) {
      var thisp = arguments[1];
      for (var i = 0; i < this.length; i++)
        if (block.call(thisp, this[i]))
          return true;
      return false;
    };
  }

// ES5 15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
  if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
      var len = +this.length;
      // Whether to include (... || fun instanceof RegExp)
      // in the following expression to trap cases where
      // the provided function was actually a regular
      // expression literal, which in V8 and
      // JavaScriptCore is a typeof "function".  Only in
      // V8 are regular expression literals permitted as
      // reduce parameters, so it is desirable in the
      // general case for the shim to match the more
      // strict and common behavior of rejecting regular
      // expressions.  However, the only case where the
      // shim is applied is IE's Trident (and perhaps very
      // old revisions of other engines).  In Trident,
      // regular expressions are a typeof "object", so the
      // following guard alone is sufficient.
      if (typeof fun !== "function")
        throw new TypeError();

      // no value to return if no initial value and an empty array
      if (len === 0 && arguments.length === 1)
        throw new TypeError();

      var i = 0;
      if (arguments.length >= 2) {
        var rv = arguments[1];
      } else {
        do {
          if (i in this) {
            rv = this[i++];
            break;
          }

          // if array contains no values, no initial value to return
          if (++i >= len)
            throw new TypeError();
        } while (true);
      }

      for (; i < len; i++) {
        if (i in this)
          rv = fun.call(null, rv, this[i], i, this);
      }

      return rv;
    };
  }


// ES5 15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
  if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
      var len = +this.length;
      if (typeof fun !== "function")
        throw new TypeError();

      // no value to return if no initial value, empty array
      if (len === 0 && arguments.length === 1)
        throw new TypeError();

      var rv, i = len - 1;
      if (arguments.length >= 2) {
        rv = arguments[1];
      } else {
        do {
          if (i in this) {
            rv = this[i--];
            break;
          }

          // if array contains no values, no initial value to return
          if (--i < 0)
            throw new TypeError();
        } while (true);
      }

      for (; i >= 0; i--) {
        if (i in this)
          rv = fun.call(null, rv, this[i], i, this);
      }

      return rv;
    };
  }

// ES5 15.4.4.14
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function indexOf(value /*, fromIndex */) {
      var length = this.length;
      if (!length)
        return -1;
      var i = arguments[1] || 0;
      if (i >= length)
        return -1;
      if (i < 0)
        i += length;
      for (; i < length; i++) {
        if (!(i in this))
          continue;
        if (value === this[i])
          return i;
      }
      return -1;
    };
  }

// ES5 15.4.4.15
  if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function lastIndexOf(value /*, fromIndex */) {
      var length = this.length;
      if (!length)
        return -1;
      var i = arguments[1] || length;
      if (i < 0)
        i += length;
      i = Math.min(i, length - 1);
      for (; i >= 0; i--) {
        if (!(i in this))
          continue;
        if (value === this[i])
          return i;
      }
      return -1;
    };
  }


});
