/*
 The safe part of es5-shim v0.9.0
 https://github.com/seajs/dew/tree/master/src/es5-safe
*/
define(function(){var i=Object.prototype,f=Array.prototype,h=Function.prototype;h.bind=h.bind||function(a){function d(){if(this instanceof d){var a=Object.create(b.prototype);b.apply(a,c.concat(f.slice.call(arguments)));return a}else return b.call.apply(b,c.concat(f.slice.call(arguments)))}var b=this,g=typeof b==="function";if(!g)throw new TypeError("Bind must be called on a function");var c=f.slice.call(arguments,1);d.length=g?Math.max(b.length-c.length,0):0;return d};Object.create||(Object.create=
function(a){function d(){}if(a===null)throw new TypeError("null prototype is not supported");if(typeof a!=="object"||typeof a!=="function")throw new TypeError(a+" not an object or null");if(arguments.length>1)throw Error("The second parameter is not supported");d.prototype=a;return new d});Object.keys||(Object.keys=function(){var a=i.hasOwnProperty,d=!{toString:""}.propertyIsEnumerable("toString"),b="toString,toLocaleString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,constructor".split(","),
g=b.length;return function(c){if(c!==Object(c))throw new TypeError(c+" is not an object");var f=[],e;for(e in c)a.call(c,e)&&f.push(e);if(d)for(e=0;e<g;e++)a.call(c,b[e])&&f.push(b[e]);return f}}())});
