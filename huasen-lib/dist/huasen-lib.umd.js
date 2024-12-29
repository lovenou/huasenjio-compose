(function(c,f){typeof exports=="object"&&typeof module<"u"?f(exports,require("crypto"),require("constants")):typeof define=="function"&&define.amd?define(["exports","crypto","constants"],f):(c=typeof globalThis<"u"?globalThis:c||self,f(c.huasenLib={},c.crypto,c.constants))})(this,function(c,f,b){"use strict";const p=b.RSA_PKCS1_PADDING;function d(e,t,r,n,i){return f.publicEncrypt({key:t,padding:i||p},Buffer.from(e,r)).toString(n)}function h(e,t,r,n,i){return f.publicDecrypt({key:t,padding:i||p},Buffer.from(e,r)).toString(n)}function y(e,t,r,n,i){return f.privateEncrypt({key:t,padding:p},Buffer.from(e,r)).toString(n)}function g(e,t,r,n,i){return f.privateDecrypt({key:t,padding:p},Buffer.from(e,r)).toString(n)}function S(e,t,r,n){let i=0,u=[];for(;r[i*n];){let s=i*n,l=(i+1)*n;u.push(r.slice(s,l)),i++}let a=[];for(let s=0;s<u.length;s++){let l=e==="public"?d(u[s],t,"utf8","hex",p):y(u[s],t,"utf8","hex");a.push(l)}return a.join(":hs:")}function E(e,t,r){return r.split(":hs:").reduce((i,u)=>{let a=e==="public"?h(u,t,"hex","utf8",p):g(u,t,"hex","utf8");return i+a},"")}function A(){const e="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";let t="";const r=e.length;for(let n=0;n<16;n++)t+=e.charAt(Math.floor(Math.random()*r));return t}function D(){return[A(),A()]}function T(e,t){t=t;let r=[],n=f.createDecipheriv("aes-128-cbc",t[0],t[1]);return n.setAutoPadding(!0),r.push(n.update(e,"base64","utf8")),r.push(n.final("utf8")),r.join("")}function j(e,t){t=t||aesSecret;let r=[],n=f.createCipheriv("aes-128-cbc",t[0],t[1]);return n.setAutoPadding(!0),r.push(n.update(e,"utf8","base64")),r.push(n.final("base64")),r.join("")}let m={minLength:function(e,t,r){if(e&&e.length<t)return r},maxLength:function(e,t,r){if(e&&e.length>t)return r},isNonEmpty:function(e,t){if(e==="")return t},isInteger:function(e,t){if(e!==""&&!/^[0-9]+$/.test(e))return t},isPassword:function(e,t){if(e!==""&&!/(^\w+$)/.test(e))return t},isName:function(e,t){if(e!==""&&!/^[\u4E00-\u9FA5\uf900-\ufa2d0-9a-zA-Z]+$/.test(e))return t},isUrl:function(e,t){if(e!==""&&!/^((https?:\/\/)|(www\.))((([0-9]{1,3}\.){3}[0-9]{1,3})|localhost|(([a-zA-Z0-9\\-]+\.)+[a-zA-Z0-9]+)|(\[[0-9a-fA-F:]+\]))/.test(e))return t},isColor:function(e,t){if(e!==""&&!/^(#([0-9A-Fa-f]{3}){1,2}|rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)|rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(0(\.\d+)?|1(\.0+)?)\))$/.test(e))return t},isIp:function(e,t){if(e!==""&&!/^(localhost|([0-9]{1,3}\.){3}[0-9]{1,3})$/.test(e))return t},isEmail:function(e,t){if(e!==""&&!/^[A-Za-z0-9]+([-._][A-Za-z0-9]+)*@[A-Za-z0-9]+(-[A-Za-z0-9]+)*(\.[A-Za-z]{2,6}|[A-Za-z]{2,4}\.[A-Za-z]{2,3})$/.test(e))return t},isJSONObject:function(e,t){try{if(e==="")return;let r=JSON.parse(e);if(!(Object.prototype.toString.call(r)==="[object Object]"))return t}catch{return t}},isJSONArray:function(e,t){try{if(e==="")return;let r=JSON.parse(e);if(!(Object.prototype.toString.call(r)==="[object Array]"))return t}catch{return t}}};class o{constructor(){this.caches=[]}add(t,r){r.map(n=>{let i=n.strategy.split(/:|：/),u=i.shift();i.unshift(t),i.push(n.errMsg),this.caches.push(()=>m[u].apply(this,i))})}start(){for(let t of this.caches){let r=t();if(r)return r}}verify(t){this.clear();for(let r of t){let n=new o;n.add(r.value,r.rules);let i=n.start();if(i)return i}}getElementFormValidator(t){let r=t.map(i=>{let u=i.split("::");return{strategy:u[0],errMsg:u[1]}}),n=this;return function(i,u,a){let s=n.verify([{rules:r,value:u}]);s?a(new Error(s)):a()}}clear(){this.caches=[]}}c.Validator=o,c.decrypt=T,c.encrypt=j,c.getAESSecret=D,c.privateDecrypt=g,c.privateEncrypt=y,c.publicDecrypt=h,c.publicEncrypt=d,c.rsaDecryptLong=E,c.rsaEncryptLong=S,c.strategies=m,Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});