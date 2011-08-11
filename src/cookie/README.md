## Cookie


This module provides utilities for dealing with cookies.
It provides the following methods:


### Cookie.get(name, options)

Gets the cookie value for the given name.

Example:

````javascript
// setup
document.cookie = 'foo=1&bar=2';

Cookie.get('foo');
// returns '1'

Cookie.get('bar', function(s) { return parseInt(s); } );
// returns 2
````


### Cookie.set(name, value, options)

Sets a cookie with a given name and value.

Example:

````javascript
Cookie.set('foo', 3);

Cookie.set('bar', 4, {
  domain: 'example.com',
  path: '/',
  expires: 30
});
````


### Cookie.remove(name, options)

Removes a cookie from the machine.

Example:

````javascript
Cookie.remove('foo');

Cookie.remove('bar', {
  domain: 'example.com',
  path: '/'
});
````


### Test Cases

http://seajs.github.com/dew/src/cookie/test/runner.html
