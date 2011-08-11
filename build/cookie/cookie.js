/*
 Cookie v1.0.0
 https://github.com/seajs/dew/tree/master/src/cookie
*/
(function(d){typeof define==="function"?define([],d):d(null,this.Cookie={})})(function(d,c){function g(b,a){return Object.prototype.toString.call(b)==="[object "+a+"]"}function h(b){if(!(g(b,"String")&&b!==""))throw new TypeError("Cookie name must be a non-empty string");}function i(b){return b}c.version="1.0.0";c.get=function(b,a){h(b);g(a,"Function")?a={converter:a}:g(a,"Object")||(a={});var e=a.raw?i:decodeURIComponent,c=a.converter||i,j,f,d=document.cookie;if(g(d,"String")&&(f=d.match(RegExp("(?:^| )"+
b+"(?:(?:=([^;]*))|;|$)"))))j=c(f[1]?e(f[1]):"");return j};c.set=function(b,a,e){h(b);var e=e||{},d=e.expires,c=e.domain,f=e.path;e.raw||(a=encodeURIComponent(String(a)));b=b+"="+a;a=d;typeof a==="number"&&(a=new Date,a.setDate(a.getDate()+d));a instanceof Date&&(b+="; expires="+a.toUTCString());g(c,"String")&&c!==""&&(b+="; domain="+c);g(f,"String")&&f!==""&&(b+="; path="+f);e.secure&&(b+="; secure");return document.cookie=b};c.remove=function(b,a){a=a||{};a.expires=new Date(0);return this.set(b,
"",a)}});
