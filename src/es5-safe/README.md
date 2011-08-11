## ES5 Safe Shims

This module provides compatibility shims so that legacy JavaScript engines
behave as closely as possible to ES5.

It provides the following methods:

````
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
````

Please refer to [MDN](https://developer.mozilla.org/En/JavaScript/ECMAScript_5_support_in_Mozilla) for detail usages.

Comparing to [kriskowal/es5-shim](https://github.com/kriskowal/es5-shim) module,
this module only contains the safe parts of ES5 shims, and it is more robust
and elegant for old browsers.


## Test Cases

http://seajs.github.com/dew/src/es5-safe/test/runner.html


## Thanks to

1. http://es5.github.com/
1. http://kangax.github.com/es5-compat-table/
1. https://github.com/kriskowal/es5-shim
1. http://perfectionkills.com/extending-built-in-native-objects-evil-or-not/
1. https://gist.github.com/1120592
1. https://code.google.com/p/v8/

## Copyright

`es5-safe.js` is released under the MIT license.
