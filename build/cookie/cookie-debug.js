/**
 * @license Cookie v1.0.0
 * https://github.com/seajs/dew/tree/master/src/cookie
 */

/**
 * @fileoverview This module provides utilities for dealing with cookies.
 * @author lifesinger@gmail.com (Frank Wang)
 *
 * @see Thanks to:
 *   - http://www.nczonline.net/blog/2009/05/05/http-cookies-explained/
 *   - http://developer.yahoo.com/yui/3/cookie/
 *   - https://github.com/kissyteam/kissy/blob/master/src/cookie/
 */

(function(factory) {

  if (typeof define === 'function') {
    define([], factory);
  } else {
    factory(null, (this['Cookie'] = {}));
  }

})(function(require, exports) {

  exports.version = '1.0.0';


  /**
   * Returns the cookie value for the given name.
   *
   * @param {String} name The name of the cookie to retrieve.
   *
   * @param {Function|Object} options (Optional) An object containing one or
   *     more cookie options: raw (true/false) and converter (a function).
   *     The converter function is run on the value before returning it. The
   *     function is not used if the cookie doesn't exist. The function can be
   *     passed instead of the options object for conveniently. When raw is
   *     set to true, the cookie value is not URI decoded.
   *
   * @return {*} If no converter is specified, returns a string or undefined if
   *     the cookie doesn't exist. If the converter is specified, returns the
   *     value returned from the converter.
   */
  exports.get = function(name, options) {
    validateCookieName(name);

    if (typeof options === 'function') {
      options = { converter: options };
    }
    else {
      options = options || {};
    }

    var decode = (1 || options['raw']) ? nop : decodeURIComponent;
    var converter = options.converter || nop;

    var ret, m, text = document.cookie;
    if (isString(text) && (m =
        text.match(new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)')))) {
      ret = converter(m[1] ? decode(m[1]) : '');
    }

    return ret;
  };


  /**
   * Sets a cookie with a given name and value.
   *
   * @param {string} name The name of the cookie to set.
   *
   * @param {*} value The value to set for the cookie.
   *
   * @param {Object} options (Optional) An object containing one or more
   *     cookie options: path (a string), domain (a string),
   *     expires (number or a Date object), secure (true/false),
   *     and raw (true/false). Setting raw to true indicates that the cookie
   *     should not be URI encoded before being set.
   *
   * @return {string} The created cookie string.
   */
  exports.set = function(name, value, options) {
    validateCookieName(name);

    options = options || {};
    var expires = options['expires'];
    var domain = options['domain'];
    var path = options['path'];

    if (!options['raw']) {
      value = encodeURIComponent(String(value));
    }

    var text = name + '=' + value;

    // expires
    var date = expires;
    if (typeof date === 'number') {
      date = new Date();
      date.setDate(date.getDate() + expires);
    }
    if (date instanceof Date) {
      text += '; expires=' + date.toUTCString();
    }

    // domain
    if (isNonEmptyString(domain)) {
      text += '; domain=' + domain;
    }

    // path
    if (isNonEmptyString(path)) {
      text += '; path=' + path;
    }

    // secure
    if (options['secure']) {
      text += '; secure';
    }

    document.cookie = text;
    return text;
  };


  /**
   * Removes a cookie from the machine by setting its expiration date to
   * sometime in the past.
   *
   * @param {string} name The name of the cookie to remove.
   *
   * @param {Object} options (Optional) An object containing one or more
   *     cookie options: path (a string), domain (a string),
   *     and secure (true/false). The expires option will be overwritten
   *     by the method.
   *
   * @return {string} The created cookie string.
   */
  exports.remove = function(name, options) {
    options = options || {};
    options['expires'] = new Date(0);
    return this.set(name, '', options);
  };


  // Helpers
  function isString(o) {
    return typeof o === 'string';
  }

  function isNonEmptyString(s) {
    return isString(s) && s !== '';
  }

  function validateCookieName(name) {
    if (!isNonEmptyString(name)) {
      throw new TypeError('Cookie name must be a non-empty string');
    }
  }

  function nop(s) {
    return s;
  }

});
