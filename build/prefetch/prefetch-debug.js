/**
 * @license Prefetch v0.9.0
 * https://github.com/seajs/dew/tree/master/src/prefetch
 */

/**
 * @fileoverview This module can preload images, CSS and JavaScript files
 * without executing them.
 *
 * @author lifesinger@gmail.com (Frank Wang)
 *
 * @see Thanks to:
 *   - http://www.phpied.com/preload-cssjavascript-without-execution/
 *   - http://yuilibrary.com/gallery/show/preload
 */

(function(factory) {

  if (typeof define === 'function') {
    define([], factory);
  } else {
    factory(null, (this['Prefetch'] = {}));
  }

})(function(require, exports) {

  exports.version = '0.9.0';

  var urls = [];


  /**
   * Adds a resource or An array of resources to prefetch.
   * @param {string|Array.<string>} url Resource links.
   */
  exports['add'] = function(url) {
    urls = urls.concat(url);
    return exports;
  };


  /**
   * Starts prefetching.
   */
  exports['start'] = function() {
    prefetch(urls);
    urls = [];
  };


  // IE6-9
  var isIE = navigator.appName.indexOf('Microsoft') === 0;

  function prefetch(urls) {
    for (var i = 0, len = urls.length; i < len; i++) {
      if (isIE) {
        new Image().src = urls[i];
      }
      else {
        var o = document.createElement('object');
        o['data'] = urls[i];
        o['width'] = o['height'] = 0;
        document.body.appendChild(o);
      }
    }
  }

});
