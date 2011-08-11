## QueryString

This module provides utilities for dealing with query strings.
It provides the following methods:


### QueryString.stringify(obj, sep='&', eq='=', arrayKey=false)

Serialize an object to a query string.
Optionally override the default separator and assignment characters.

Example:

````javascript
QueryString.stringify({foo: 'bar'})
// returns 'foo=bar'

QueryString.stringify({foo: 'bar', baz: 'john', baz: 'bob'}, ';', ':')
// returns 'foo:bar;baz:john;baz:john'

QueryString.stringify({bar: 'john', bar: 'bob'}, null, null, true)
// returns 'bar%5B%5D=john&bar%5B%5D=bob'
````


### QueryString.parse(str, sep='&', eq='=')

Deserialize a query string to an object.
Optionally override the default separator and assignment characters.

Example:

````javascript
QueryString.parse('a=b&b=c')
// returns { a: 'b', b: 'c' }
````


### QueryString.escape

The escape function used by `QueryString.stringify`,
provided so that it could be overridden if necessary.


### QueryString.unescape

The unescape function used by `QueryString.parse`,
provided so that it could be overridden if necessary.


## Copyright

querystring.js is released under the MIT license.
