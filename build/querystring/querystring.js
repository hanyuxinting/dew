/*
 QueryString v1.0.0
 https://github.com/seajs/dew/tree/master/src/querystring
*/
define([],function(p,h){function l(a){var d=typeof a;return a==null||d!=="object"&&d!=="function"}h.version="1.0.0";var m=Object.prototype.toString,n=Object.prototype.hasOwnProperty,o=Array.isArray||function(a){return m.call(a)==="[object Array]"},k=String.prototype.trim?function(a){return a==null?"":String.prototype.trim.call(a)}:function(a){return a==null?"":a.toString().replace(/^\s+/,"").replace(/\s+$/,"")};h.escape=encodeURIComponent;h.unescape=function(a){return decodeURIComponent(a.replace(/\+/g,
" "))};h.stringify=function(a,d,f,e){if(!a||!(m.call(a)==="[object Object]"&&"isPrototypeOf"in a))return"";var d=d||"&",f=f||"=",e=e||!1,g=[],c,b,i=h.escape;for(c in a)if(n.call(a,c))if(b=a[c],c=h.escape(c),l(b))g.push(c,f,i(b+""),d);else if(o(b)&&b.length)for(var j=0;j<b.length;j++)l(b[j])&&g.push(c,(e?i("[]"):"")+f,i(b[j]+""),d);else g.push(c,f,d);g.pop();return g.join("")};h.parse=function(a,d,f){var e={};if(typeof a!=="string"||k(a).length===0)return e;for(var a=a.split(d||"&"),f=f||"=",d=h.unescape,
g=0;g<a.length;g++){var c=a[g].split(f),b=d(k(c[0])),c=d(k(c.slice(1).join(f))),i=b.match(/^(\w+)\[\]$/);i&&i[1]&&(b=i[1]);n.call(e,b)?(o(e[b])||(e[b]=[e[b]]),e[b].push(c)):e[b]=i?[c]:c}return e}});
