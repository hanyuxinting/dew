###Overview

Port of Stoyan Stefanov's JavaScript preload() function. More info about
the original implementation here:

http://www.phpied.com/preload-cssjavascript-without-execution/


### Usage

Add prefetch resources via script:

````javascript
Prefetch.add('http://path/to/file');
Prefetch.add(['file1', 'file2']);
````

Then start prefetch at proper time:

````javascript
window.addEventListener('load', function() {
  Prefetch.start();
}, false);
````

This module can also be used as a CommonJS module:

````javascript
define(function(require, exports) {
  var Prefetch = require('prefetch/0.9.0/prefetch');
  Prefetch.add(['file1.js', 'file2.css', 'file3.png']).start();
});
````


### Test Cases

http://seajs.github.com/dew/src/prefetch/test/runner.html