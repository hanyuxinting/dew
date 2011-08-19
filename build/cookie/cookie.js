/*
 Cookie v1.0.0
 https://github.com/seajs/dew/tree/master/src/cookie
*/
(function(i){typeof define==="function"?define("cookie",[],i):i(null,this.Cookie={})})(function(i,g){function h(b){return typeof b==="string"}function j(b){if(!(h(b)&&b!==""))throw new TypeError("Cookie name must be a non-empty string");}function k(b){return b}g.version="1.0.0";g.get=function(b,a){j(b);var a=typeof a==="function"?{converter:a}:a||{},c=a.converter||k,f,d,e=document.cookie;if(h(e)&&(d=e.match(RegExp("(?:^| )"+b+"(?:(?:=([^;]*))|;|$)"))))f=c(d[1]?d[1]:"");return f};g.set=function(b,
a,c){j(b);var c=c||{},f=c.expires,d=c.domain,e=c.path;c.raw||(a=encodeURIComponent(String(a)));b=b+"="+a;a=f;typeof a==="number"&&(a=new Date,a.setDate(a.getDate()+f));a instanceof Date&&(b+="; expires="+a.toUTCString());h(d)&&d!==""&&(b+="; domain="+d);h(e)&&e!==""&&(b+="; path="+e);c.secure&&(b+="; secure");return document.cookie=b};g.remove=function(b,a){a=a||{};a.expires=new Date(0);return this.set(b,"",a)}});
