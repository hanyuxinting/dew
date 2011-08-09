## ES5 Safe Shims

This module provides compatibility shims so that legacy JavaScript engines
behave as closely as possible to ES5.

It provides the following methods:

    Function.prototype.bind
    Object.create
    Object.keys
    Array.isArray
    Array.prototype.forEach
    Array.prototype.map
    Array.prototype.filter
    Array.prototype.every
    Array.prototype.some
    Array.prototype.reduce
    Array.prototype.reduceRight
    Array.prototype.indexOf
    Array.prototype.lastIndexOf
    String.prototype.trim
    Date.now
    Date.parse (for ISO parsing)
    Date.prototype.toISOString
    Date.prototype.toJSON

Please refer to [MDN](https://developer.mozilla.org/En/JavaScript/ECMAScript_5_support_in_Mozilla) for detail usages.

Comparing to [kriskowal/es5-shim](https://github.com/kriskowal/es5-shim) module,
this module only contains the safe parts of ES5 shims, and it is more robust
and elegant for old browsers.

Any feedback is welcome!


## Thanks to

1. http://es5.github.com/
1. http://kangax.github.com/es5-compat-table/
1. https://github.com/kriskowal/es5-shim


## Copyright

`es5-safe.js` is released under the MIT license.
