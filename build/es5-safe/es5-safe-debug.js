/**
 * @license The safe part of es5-shim v0.9.0
 * https://github.com/seajs/dew/tree/master/src/es5-safe
 */

/**
 * @fileoverview Provides compatibility shims so that legacy JavaScript
 * engines behave as closely as possible to ES5.
 * @author lifesinger@gmail.com (Frank Wang)
 *
 * @see Thanks to:
 *   - http://es5.github.com/
 *   - http://kangax.github.com/es5-compat-table/
 *   - https://github.com/kriskowal/es5-shim
 */

define(function() {

  var OP = Object.prototype;
  var AP = Array.prototype;
  var FP = Function.prototype;


  /*---------------------------------------*
   * Function
   *---------------------------------------*/

  // ES-5 15.3.4.5
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind

  FP.bind = FP.bind || function (that) { // .length is 1
    // 1. Let Target be the this value.
    var target = this;
    var isCallable = typeof target === 'function';

    // 2. If IsCallable(Target) is false, throw a TypeError exception.
    if (!isCallable) {
      throw new TypeError('Bind must be called on a function');
    }

    // 3. Let A be a new (possibly empty) internal list of all of the
    //    argument values provided after thisArg (arg1, arg2 etc), in order.
    var args = AP.slice.call(arguments, 1);

    function F() {
      if (this instanceof F) {
        var self = Object.create(target.prototype);
        target.apply(self, args.concat(AP.slice.call(arguments)));
        return self;
      }
      else {
        return target.call.apply(
            target,
            args.concat(AP.slice.call(arguments))
        );
      }
    }

    F.length = isCallable ? Math.max(target.length - args.length, 0) : 0;
    return F;
  };


  /*---------------------------------------*
   * Object
   *---------------------------------------*/
  // http://ejohn.org/blog/ecmascript-5-objects-and-properties/


  // ES5 15.2.3.5
  // http://stackoverflow.com/questions/3075308/what-modernizer-scripts-exist-for-the-new-ecmascript-5-functions
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
  Object.create || (Object.create = function(proto) {
    if (proto === null) {
      throw new TypeError('null prototype is not supported');
    }
    if (typeof proto !== 'object' || typeof proto !== 'function') {
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
    var hasOwnProperty = OP.hasOwnProperty;
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


});
