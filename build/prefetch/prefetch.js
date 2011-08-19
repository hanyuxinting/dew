/*
 Prefetch v0.9.0
 https://github.com/seajs/dew/tree/master/src/prefetch
*/
(function(b){typeof define==="function"?define([],b):b(null,this.Prefetch={})})(function(b,a){a.version="0.9.0";var d=[];a.add=function(c){d=d.concat(c);return a};a.start=function(){for(var c=d,a=0,b=c.length;a<b;a++)if(f)(new Image).src=c[a];else{var e=document.createElement("object");e.data=c[a];e.width=e.height=0;document.body.appendChild(e)}d=[]};var f=navigator.appName.indexOf("Microsoft")===0});
