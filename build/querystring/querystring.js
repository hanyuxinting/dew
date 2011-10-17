/*
 QueryString v1.0.0
 https://github.com/seajs/dew/tree/master/src/querystring
*/
(function(k){typeof define==="function"?define("querystring",[],k):k(null,this.QueryString={})})(function(k,h){h.version="1.0.0";var m=Object.prototype.toString,n=Object.prototype.hasOwnProperty,o=Array.isArray||function(a){return m.call(a)==="[object Array]"},l=String.prototype.trim?function(a){return a==null?"":String.prototype.trim.call(a)}:function(a){return a==null?"":a.toString().replace(/^\s+/,"").replace(/\s+$/,"")};h.escape=encodeURIComponent;h.unescape=function(a){return decodeURIComponent(a.replace(/\+/g,
" "))};h.stringify=function(a,e,f,d){if(!a||!(m.call(a)==="[object Object]"&&"isPrototypeOf"in a))return"";var e=e||"&",f=f||"=",d=d||false,g=[],c,b,i=h.escape;for(c in a)if(n.call(a,c))if(b=a[c],c=h.escape(c),b!==Object(b))g.push(c,f,i(b+""),e);else if(o(b)&&b.length)for(var j=0;j<b.length;j++)b[j]!==Object(b[j])&&g.push(c,(d?i("[]"):"")+f,i(b[j]+""),e);else g.push(c,f,e);g.pop();return g.join("")};h.parse=function(a,e,f){var d={};if(typeof a!=="string"||l(a).length===0)return d;for(var a=a.split(e||
"&"),f=f||"=",e=h.unescape,g=0;g<a.length;g++){var c=a[g].split(f),b=e(l(c[0])),c=e(l(c.slice(1).join(f))),i=b.match(/^(\w+)\[\]$/);i&&i[1]&&(b=i[1]);n.call(d,b)?(o(d[b])||(d[b]=[d[b]]),d[b].push(c)):d[b]=i?[c]:c}return d}});
