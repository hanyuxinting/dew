/*
 Cookie v1.0.0
 https://github.com/seajs/dew/tree/master/src/cookie
*/
(function(g){typeof define==="function"?define([],g):g(null,this.Cookie={})})(function(g,d){function i(b){return typeof b==="string"}function m(b){if(!(i(b)&&b!==""))throw new TypeError("Cookie name must be a non-empty string");}function n(b){return b}d.version="1.0.1";var k=decodeURIComponent,o=encodeURIComponent;d.get=function(b,a){m(b);var a=typeof a==="function"?{converter:a}:a||{},c=document.cookie,l=!a.raw,f={};if(i(c)&&c.length>0)for(var l=l?k:n,c=c.split(/;\s/g),e,d,j,h=0,g=c.length;h<g;h++){j=
c[h].match(/([^=]+)=/i);if(j instanceof Array)try{e=k(j[1]),d=l(c[h].substring(j[1].length+1))}catch(o){}else e=k(c[h]),d="";e&&(f[e]=d)}return(a.converter||n)(f[b])};d.set=function(b,a,c){m(b);var c=c||{},d=c.expires,f=c.domain,e=c.path;c.raw||(a=o(String(a)));b=b+"="+a;a=d;typeof a==="number"&&(a=new Date,a.setDate(a.getDate()+d));a instanceof Date&&(b+="; expires="+a.toUTCString());i(f)&&f!==""&&(b+="; domain="+f);i(e)&&e!==""&&(b+="; path="+e);c.secure&&(b+="; secure");return document.cookie=
b};d.remove=function(b,a){a=a||{};a.expires=new Date(0);return this.set(b,"",a)}});
