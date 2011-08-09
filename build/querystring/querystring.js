/*
 QueryString v1.0.0
 https://github.com/seajs/dew/tree/master/src/querystring
*/
define([],function(o,h){h.version="1.0.0";var l=Object.prototype.toString,m=Object.prototype.hasOwnProperty,n=Array.isArray||function(a){return l.call(a)==="[object Array]"},k=String.prototype.trim?function(a){return a==null?"":String.prototype.trim.call(a)}:function(a){return a==null?"":a.toString().replace(/^\s+/,"").replace(/\s+$/,"")};h.escape=encodeURIComponent;h.unescape=function(a){return decodeURIComponent(a.replace(/\+/g," "))};h.stringify=function(a,e,f,d){if(!a||!(l.call(a)==="[object Object]"&&
"isPrototypeOf"in a))return"";var e=e||"&",f=f||"=",d=d||!1,g=[],c,b,i=h.escape;for(c in a)if(m.call(a,c))if(b=a[c],c=h.escape(c),b!==Object(b))g.push(c,f,i(b+""),e);else if(n(b)&&b.length)for(var j=0;j<b.length;j++)b[j]!==Object(b[j])&&g.push(c,(d?i("[]"):"")+f,i(b[j]+""),e);else g.push(c,f,e);g.pop();return g.join("")};h.parse=function(a,e,f){var d={};if(typeof a!=="string"||k(a).length===0)return d;for(var a=a.split(e||"&"),f=f||"=",e=h.unescape,g=0;g<a.length;g++){var c=a[g].split(f),b=e(k(c[0])),
c=e(k(c.slice(1).join(f))),i=b.match(/^(\w+)\[\]$/);i&&i[1]&&(b=i[1]);m.call(d,b)?(n(d[b])||(d[b]=[d[b]]),d[b].push(c)):d[b]=i?[c]:c}return d}});
