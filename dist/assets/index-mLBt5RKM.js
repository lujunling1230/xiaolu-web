(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const u of document.querySelectorAll('link[rel="modulepreload"]'))r(u);new MutationObserver(u=>{for(const f of u)if(f.type==="childList")for(const d of f.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function s(u){const f={};return u.integrity&&(f.integrity=u.integrity),u.referrerPolicy&&(f.referrerPolicy=u.referrerPolicy),u.crossOrigin==="use-credentials"?f.credentials="include":u.crossOrigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function r(u){if(u.ep)return;u.ep=!0;const f=s(u);fetch(u.href,f)}})();var bc={exports:{}},jl={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var p0;function H1(){if(p0)return jl;p0=1;var n=Symbol.for("react.transitional.element"),i=Symbol.for("react.fragment");function s(r,u,f){var d=null;if(f!==void 0&&(d=""+f),u.key!==void 0&&(d=""+u.key),"key"in u){f={};for(var h in u)h!=="key"&&(f[h]=u[h])}else f=u;return u=f.ref,{$$typeof:n,type:r,key:d,ref:u!==void 0?u:null,props:f}}return jl.Fragment=i,jl.jsx=s,jl.jsxs=s,jl}var g0;function G1(){return g0||(g0=1,bc.exports=H1()),bc.exports}var m=G1(),vc={exports:{}},ct={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var y0;function Y1(){if(y0)return ct;y0=1;var n=Symbol.for("react.transitional.element"),i=Symbol.for("react.portal"),s=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),u=Symbol.for("react.profiler"),f=Symbol.for("react.consumer"),d=Symbol.for("react.context"),h=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),x=Symbol.for("react.lazy"),b=Symbol.for("react.activity"),v=Symbol.iterator;function E(N){return N===null||typeof N!="object"?null:(N=v&&N[v]||N["@@iterator"],typeof N=="function"?N:null)}var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},R=Object.assign,T={};function C(N,Y,F){this.props=N,this.context=Y,this.refs=T,this.updater=F||A}C.prototype.isReactComponent={},C.prototype.setState=function(N,Y){if(typeof N!="object"&&typeof N!="function"&&N!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,N,Y,"setState")},C.prototype.forceUpdate=function(N){this.updater.enqueueForceUpdate(this,N,"forceUpdate")};function _(){}_.prototype=C.prototype;function z(N,Y,F){this.props=N,this.context=Y,this.refs=T,this.updater=F||A}var U=z.prototype=new _;U.constructor=z,R(U,C.prototype),U.isPureReactComponent=!0;var K=Array.isArray;function I(){}var X={H:null,A:null,T:null,S:null},Q=Object.prototype.hasOwnProperty;function et(N,Y,F){var $=F.ref;return{$$typeof:n,type:N,key:Y,ref:$!==void 0?$:null,props:F}}function P(N,Y){return et(N.type,Y,N.props)}function at(N){return typeof N=="object"&&N!==null&&N.$$typeof===n}function ft(N){var Y={"=":"=0",":":"=2"};return"$"+N.replace(/[=:]/g,function(F){return Y[F]})}var lt=/\/+/g;function mt(N,Y){return typeof N=="object"&&N!==null&&N.key!=null?ft(""+N.key):Y.toString(36)}function ot(N){switch(N.status){case"fulfilled":return N.value;case"rejected":throw N.reason;default:switch(typeof N.status=="string"?N.then(I,I):(N.status="pending",N.then(function(Y){N.status==="pending"&&(N.status="fulfilled",N.value=Y)},function(Y){N.status==="pending"&&(N.status="rejected",N.reason=Y)})),N.status){case"fulfilled":return N.value;case"rejected":throw N.reason}}throw N}function B(N,Y,F,$,ut){var yt=typeof N;(yt==="undefined"||yt==="boolean")&&(N=null);var At=!1;if(N===null)At=!0;else switch(yt){case"bigint":case"string":case"number":At=!0;break;case"object":switch(N.$$typeof){case n:case i:At=!0;break;case x:return At=N._init,B(At(N._payload),Y,F,$,ut)}}if(At)return ut=ut(N),At=$===""?"."+mt(N,0):$,K(ut)?(F="",At!=null&&(F=At.replace(lt,"$&/")+"/"),B(ut,Y,F,"",function(Mi){return Mi})):ut!=null&&(at(ut)&&(ut=P(ut,F+(ut.key==null||N&&N.key===ut.key?"":(""+ut.key).replace(lt,"$&/")+"/")+At)),Y.push(ut)),1;At=0;var oe=$===""?".":$+":";if(K(N))for(var Yt=0;Yt<N.length;Yt++)$=N[Yt],yt=oe+mt($,Yt),At+=B($,Y,F,yt,ut);else if(Yt=E(N),typeof Yt=="function")for(N=Yt.call(N),Yt=0;!($=N.next()).done;)$=$.value,yt=oe+mt($,Yt++),At+=B($,Y,F,yt,ut);else if(yt==="object"){if(typeof N.then=="function")return B(ot(N),Y,F,$,ut);throw Y=String(N),Error("Objects are not valid as a React child (found: "+(Y==="[object Object]"?"object with keys {"+Object.keys(N).join(", ")+"}":Y)+"). If you meant to render a collection of children, use an array instead.")}return At}function Z(N,Y,F){if(N==null)return N;var $=[],ut=0;return B(N,$,"","",function(yt){return Y.call(F,yt,ut++)}),$}function J(N){if(N._status===-1){var Y=N._result;Y=Y(),Y.then(function(F){(N._status===0||N._status===-1)&&(N._status=1,N._result=F)},function(F){(N._status===0||N._status===-1)&&(N._status=2,N._result=F)}),N._status===-1&&(N._status=0,N._result=Y)}if(N._status===1)return N._result.default;throw N._result}var rt=typeof reportError=="function"?reportError:function(N){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var Y=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof N=="object"&&N!==null&&typeof N.message=="string"?String(N.message):String(N),error:N});if(!window.dispatchEvent(Y))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",N);return}console.error(N)},gt={map:Z,forEach:function(N,Y,F){Z(N,function(){Y.apply(this,arguments)},F)},count:function(N){var Y=0;return Z(N,function(){Y++}),Y},toArray:function(N){return Z(N,function(Y){return Y})||[]},only:function(N){if(!at(N))throw Error("React.Children.only expected to receive a single React element child.");return N}};return ct.Activity=b,ct.Children=gt,ct.Component=C,ct.Fragment=s,ct.Profiler=u,ct.PureComponent=z,ct.StrictMode=r,ct.Suspense=p,ct.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=X,ct.__COMPILER_RUNTIME={__proto__:null,c:function(N){return X.H.useMemoCache(N)}},ct.cache=function(N){return function(){return N.apply(null,arguments)}},ct.cacheSignal=function(){return null},ct.cloneElement=function(N,Y,F){if(N==null)throw Error("The argument must be a React element, but you passed "+N+".");var $=R({},N.props),ut=N.key;if(Y!=null)for(yt in Y.key!==void 0&&(ut=""+Y.key),Y)!Q.call(Y,yt)||yt==="key"||yt==="__self"||yt==="__source"||yt==="ref"&&Y.ref===void 0||($[yt]=Y[yt]);var yt=arguments.length-2;if(yt===1)$.children=F;else if(1<yt){for(var At=Array(yt),oe=0;oe<yt;oe++)At[oe]=arguments[oe+2];$.children=At}return et(N.type,ut,$)},ct.createContext=function(N){return N={$$typeof:d,_currentValue:N,_currentValue2:N,_threadCount:0,Provider:null,Consumer:null},N.Provider=N,N.Consumer={$$typeof:f,_context:N},N},ct.createElement=function(N,Y,F){var $,ut={},yt=null;if(Y!=null)for($ in Y.key!==void 0&&(yt=""+Y.key),Y)Q.call(Y,$)&&$!=="key"&&$!=="__self"&&$!=="__source"&&(ut[$]=Y[$]);var At=arguments.length-2;if(At===1)ut.children=F;else if(1<At){for(var oe=Array(At),Yt=0;Yt<At;Yt++)oe[Yt]=arguments[Yt+2];ut.children=oe}if(N&&N.defaultProps)for($ in At=N.defaultProps,At)ut[$]===void 0&&(ut[$]=At[$]);return et(N,yt,ut)},ct.createRef=function(){return{current:null}},ct.forwardRef=function(N){return{$$typeof:h,render:N}},ct.isValidElement=at,ct.lazy=function(N){return{$$typeof:x,_payload:{_status:-1,_result:N},_init:J}},ct.memo=function(N,Y){return{$$typeof:g,type:N,compare:Y===void 0?null:Y}},ct.startTransition=function(N){var Y=X.T,F={};X.T=F;try{var $=N(),ut=X.S;ut!==null&&ut(F,$),typeof $=="object"&&$!==null&&typeof $.then=="function"&&$.then(I,rt)}catch(yt){rt(yt)}finally{Y!==null&&F.types!==null&&(Y.types=F.types),X.T=Y}},ct.unstable_useCacheRefresh=function(){return X.H.useCacheRefresh()},ct.use=function(N){return X.H.use(N)},ct.useActionState=function(N,Y,F){return X.H.useActionState(N,Y,F)},ct.useCallback=function(N,Y){return X.H.useCallback(N,Y)},ct.useContext=function(N){return X.H.useContext(N)},ct.useDebugValue=function(){},ct.useDeferredValue=function(N,Y){return X.H.useDeferredValue(N,Y)},ct.useEffect=function(N,Y){return X.H.useEffect(N,Y)},ct.useEffectEvent=function(N){return X.H.useEffectEvent(N)},ct.useId=function(){return X.H.useId()},ct.useImperativeHandle=function(N,Y,F){return X.H.useImperativeHandle(N,Y,F)},ct.useInsertionEffect=function(N,Y){return X.H.useInsertionEffect(N,Y)},ct.useLayoutEffect=function(N,Y){return X.H.useLayoutEffect(N,Y)},ct.useMemo=function(N,Y){return X.H.useMemo(N,Y)},ct.useOptimistic=function(N,Y){return X.H.useOptimistic(N,Y)},ct.useReducer=function(N,Y,F){return X.H.useReducer(N,Y,F)},ct.useRef=function(N){return X.H.useRef(N)},ct.useState=function(N){return X.H.useState(N)},ct.useSyncExternalStore=function(N,Y,F){return X.H.useSyncExternalStore(N,Y,F)},ct.useTransition=function(){return X.H.useTransition()},ct.version="19.2.7",ct}var x0;function Af(){return x0||(x0=1,vc.exports=Y1()),vc.exports}var j=Af(),Sc={exports:{}},Tl={},jc={exports:{}},Tc={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var b0;function q1(){return b0||(b0=1,(function(n){function i(B,Z){var J=B.length;B.push(Z);t:for(;0<J;){var rt=J-1>>>1,gt=B[rt];if(0<u(gt,Z))B[rt]=Z,B[J]=gt,J=rt;else break t}}function s(B){return B.length===0?null:B[0]}function r(B){if(B.length===0)return null;var Z=B[0],J=B.pop();if(J!==Z){B[0]=J;t:for(var rt=0,gt=B.length,N=gt>>>1;rt<N;){var Y=2*(rt+1)-1,F=B[Y],$=Y+1,ut=B[$];if(0>u(F,J))$<gt&&0>u(ut,F)?(B[rt]=ut,B[$]=J,rt=$):(B[rt]=F,B[Y]=J,rt=Y);else if($<gt&&0>u(ut,J))B[rt]=ut,B[$]=J,rt=$;else break t}}return Z}function u(B,Z){var J=B.sortIndex-Z.sortIndex;return J!==0?J:B.id-Z.id}if(n.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var f=performance;n.unstable_now=function(){return f.now()}}else{var d=Date,h=d.now();n.unstable_now=function(){return d.now()-h}}var p=[],g=[],x=1,b=null,v=3,E=!1,A=!1,R=!1,T=!1,C=typeof setTimeout=="function"?setTimeout:null,_=typeof clearTimeout=="function"?clearTimeout:null,z=typeof setImmediate<"u"?setImmediate:null;function U(B){for(var Z=s(g);Z!==null;){if(Z.callback===null)r(g);else if(Z.startTime<=B)r(g),Z.sortIndex=Z.expirationTime,i(p,Z);else break;Z=s(g)}}function K(B){if(R=!1,U(B),!A)if(s(p)!==null)A=!0,I||(I=!0,ft());else{var Z=s(g);Z!==null&&ot(K,Z.startTime-B)}}var I=!1,X=-1,Q=5,et=-1;function P(){return T?!0:!(n.unstable_now()-et<Q)}function at(){if(T=!1,I){var B=n.unstable_now();et=B;var Z=!0;try{t:{A=!1,R&&(R=!1,_(X),X=-1),E=!0;var J=v;try{e:{for(U(B),b=s(p);b!==null&&!(b.expirationTime>B&&P());){var rt=b.callback;if(typeof rt=="function"){b.callback=null,v=b.priorityLevel;var gt=rt(b.expirationTime<=B);if(B=n.unstable_now(),typeof gt=="function"){b.callback=gt,U(B),Z=!0;break e}b===s(p)&&r(p),U(B)}else r(p);b=s(p)}if(b!==null)Z=!0;else{var N=s(g);N!==null&&ot(K,N.startTime-B),Z=!1}}break t}finally{b=null,v=J,E=!1}Z=void 0}}finally{Z?ft():I=!1}}}var ft;if(typeof z=="function")ft=function(){z(at)};else if(typeof MessageChannel<"u"){var lt=new MessageChannel,mt=lt.port2;lt.port1.onmessage=at,ft=function(){mt.postMessage(null)}}else ft=function(){C(at,0)};function ot(B,Z){X=C(function(){B(n.unstable_now())},Z)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(B){B.callback=null},n.unstable_forceFrameRate=function(B){0>B||125<B?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Q=0<B?Math.floor(1e3/B):5},n.unstable_getCurrentPriorityLevel=function(){return v},n.unstable_next=function(B){switch(v){case 1:case 2:case 3:var Z=3;break;default:Z=v}var J=v;v=Z;try{return B()}finally{v=J}},n.unstable_requestPaint=function(){T=!0},n.unstable_runWithPriority=function(B,Z){switch(B){case 1:case 2:case 3:case 4:case 5:break;default:B=3}var J=v;v=B;try{return Z()}finally{v=J}},n.unstable_scheduleCallback=function(B,Z,J){var rt=n.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?rt+J:rt):J=rt,B){case 1:var gt=-1;break;case 2:gt=250;break;case 5:gt=1073741823;break;case 4:gt=1e4;break;default:gt=5e3}return gt=J+gt,B={id:x++,callback:Z,priorityLevel:B,startTime:J,expirationTime:gt,sortIndex:-1},J>rt?(B.sortIndex=J,i(g,B),s(p)===null&&B===s(g)&&(R?(_(X),X=-1):R=!0,ot(K,J-rt))):(B.sortIndex=gt,i(p,B),A||E||(A=!0,I||(I=!0,ft()))),B},n.unstable_shouldYield=P,n.unstable_wrapCallback=function(B){var Z=v;return function(){var J=v;v=Z;try{return B.apply(this,arguments)}finally{v=J}}}})(Tc)),Tc}var v0;function X1(){return v0||(v0=1,jc.exports=q1()),jc.exports}var Ec={exports:{}},re={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var S0;function K1(){if(S0)return re;S0=1;var n=Af();function i(p){var g="https://react.dev/errors/"+p;if(1<arguments.length){g+="?args[]="+encodeURIComponent(arguments[1]);for(var x=2;x<arguments.length;x++)g+="&args[]="+encodeURIComponent(arguments[x])}return"Minified React error #"+p+"; visit "+g+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function s(){}var r={d:{f:s,r:function(){throw Error(i(522))},D:s,C:s,L:s,m:s,X:s,S:s,M:s},p:0,findDOMNode:null},u=Symbol.for("react.portal");function f(p,g,x){var b=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:u,key:b==null?null:""+b,children:p,containerInfo:g,implementation:x}}var d=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function h(p,g){if(p==="font")return"";if(typeof g=="string")return g==="use-credentials"?g:""}return re.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,re.createPortal=function(p,g){var x=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!g||g.nodeType!==1&&g.nodeType!==9&&g.nodeType!==11)throw Error(i(299));return f(p,g,null,x)},re.flushSync=function(p){var g=d.T,x=r.p;try{if(d.T=null,r.p=2,p)return p()}finally{d.T=g,r.p=x,r.d.f()}},re.preconnect=function(p,g){typeof p=="string"&&(g?(g=g.crossOrigin,g=typeof g=="string"?g==="use-credentials"?g:"":void 0):g=null,r.d.C(p,g))},re.prefetchDNS=function(p){typeof p=="string"&&r.d.D(p)},re.preinit=function(p,g){if(typeof p=="string"&&g&&typeof g.as=="string"){var x=g.as,b=h(x,g.crossOrigin),v=typeof g.integrity=="string"?g.integrity:void 0,E=typeof g.fetchPriority=="string"?g.fetchPriority:void 0;x==="style"?r.d.S(p,typeof g.precedence=="string"?g.precedence:void 0,{crossOrigin:b,integrity:v,fetchPriority:E}):x==="script"&&r.d.X(p,{crossOrigin:b,integrity:v,fetchPriority:E,nonce:typeof g.nonce=="string"?g.nonce:void 0})}},re.preinitModule=function(p,g){if(typeof p=="string")if(typeof g=="object"&&g!==null){if(g.as==null||g.as==="script"){var x=h(g.as,g.crossOrigin);r.d.M(p,{crossOrigin:x,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0})}}else g==null&&r.d.M(p)},re.preload=function(p,g){if(typeof p=="string"&&typeof g=="object"&&g!==null&&typeof g.as=="string"){var x=g.as,b=h(x,g.crossOrigin);r.d.L(p,x,{crossOrigin:b,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,type:typeof g.type=="string"?g.type:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0,referrerPolicy:typeof g.referrerPolicy=="string"?g.referrerPolicy:void 0,imageSrcSet:typeof g.imageSrcSet=="string"?g.imageSrcSet:void 0,imageSizes:typeof g.imageSizes=="string"?g.imageSizes:void 0,media:typeof g.media=="string"?g.media:void 0})}},re.preloadModule=function(p,g){if(typeof p=="string")if(g){var x=h(g.as,g.crossOrigin);r.d.m(p,{as:typeof g.as=="string"&&g.as!=="script"?g.as:void 0,crossOrigin:x,integrity:typeof g.integrity=="string"?g.integrity:void 0})}else r.d.m(p)},re.requestFormReset=function(p){r.d.r(p)},re.unstable_batchedUpdates=function(p,g){return p(g)},re.useFormState=function(p,g,x){return d.H.useFormState(p,g,x)},re.useFormStatus=function(){return d.H.useHostTransitionStatus()},re.version="19.2.7",re}var j0;function Q1(){if(j0)return Ec.exports;j0=1;function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(i){console.error(i)}}return n(),Ec.exports=K1(),Ec.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var T0;function Z1(){if(T0)return Tl;T0=1;var n=X1(),i=Af(),s=Q1();function r(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)e+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function u(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function f(t){var e=t,a=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,(e.flags&4098)!==0&&(a=e.return),t=e.return;while(t)}return e.tag===3?a:null}function d(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function h(t){if(t.tag===31){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function p(t){if(f(t)!==t)throw Error(r(188))}function g(t){var e=t.alternate;if(!e){if(e=f(t),e===null)throw Error(r(188));return e!==t?null:t}for(var a=t,l=e;;){var o=a.return;if(o===null)break;var c=o.alternate;if(c===null){if(l=o.return,l!==null){a=l;continue}break}if(o.child===c.child){for(c=o.child;c;){if(c===a)return p(o),t;if(c===l)return p(o),e;c=c.sibling}throw Error(r(188))}if(a.return!==l.return)a=o,l=c;else{for(var y=!1,S=o.child;S;){if(S===a){y=!0,a=o,l=c;break}if(S===l){y=!0,l=o,a=c;break}S=S.sibling}if(!y){for(S=c.child;S;){if(S===a){y=!0,a=c,l=o;break}if(S===l){y=!0,l=c,a=o;break}S=S.sibling}if(!y)throw Error(r(189))}}if(a.alternate!==l)throw Error(r(190))}if(a.tag!==3)throw Error(r(188));return a.stateNode.current===a?t:e}function x(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t;for(t=t.child;t!==null;){if(e=x(t),e!==null)return e;t=t.sibling}return null}var b=Object.assign,v=Symbol.for("react.element"),E=Symbol.for("react.transitional.element"),A=Symbol.for("react.portal"),R=Symbol.for("react.fragment"),T=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),_=Symbol.for("react.consumer"),z=Symbol.for("react.context"),U=Symbol.for("react.forward_ref"),K=Symbol.for("react.suspense"),I=Symbol.for("react.suspense_list"),X=Symbol.for("react.memo"),Q=Symbol.for("react.lazy"),et=Symbol.for("react.activity"),P=Symbol.for("react.memo_cache_sentinel"),at=Symbol.iterator;function ft(t){return t===null||typeof t!="object"?null:(t=at&&t[at]||t["@@iterator"],typeof t=="function"?t:null)}var lt=Symbol.for("react.client.reference");function mt(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===lt?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case R:return"Fragment";case C:return"Profiler";case T:return"StrictMode";case K:return"Suspense";case I:return"SuspenseList";case et:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case A:return"Portal";case z:return t.displayName||"Context";case _:return(t._context.displayName||"Context")+".Consumer";case U:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case X:return e=t.displayName||null,e!==null?e:mt(t.type)||"Memo";case Q:e=t._payload,t=t._init;try{return mt(t(e))}catch{}}return null}var ot=Array.isArray,B=i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Z=s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,J={pending:!1,data:null,method:null,action:null},rt=[],gt=-1;function N(t){return{current:t}}function Y(t){0>gt||(t.current=rt[gt],rt[gt]=null,gt--)}function F(t,e){gt++,rt[gt]=t.current,t.current=e}var $=N(null),ut=N(null),yt=N(null),At=N(null);function oe(t,e){switch(F(yt,e),F(ut,t),F($,null),e.nodeType){case 9:case 11:t=(t=e.documentElement)&&(t=t.namespaceURI)?Lp(t):0;break;default:if(t=e.tagName,e=e.namespaceURI)e=Lp(e),t=Up(e,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}Y($),F($,t)}function Yt(){Y($),Y(ut),Y(yt)}function Mi(t){t.memoizedState!==null&&F(At,t);var e=$.current,a=Up(e,t.type);e!==a&&(F(ut,t),F($,a))}function Jl(t){ut.current===t&&(Y($),Y(ut)),At.current===t&&(Y(At),xl._currentValue=J)}var to,md;function sa(t){if(to===void 0)try{throw Error()}catch(a){var e=a.stack.trim().match(/\n( *(at )?)/);to=e&&e[1]||"",md=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+to+t+md}var eo=!1;function no(t,e){if(!t||eo)return"";eo=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(e){var q=function(){throw Error()};if(Object.defineProperty(q.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(q,[])}catch(L){var V=L}Reflect.construct(t,[],q)}else{try{q.call()}catch(L){V=L}t.call(q.prototype)}}else{try{throw Error()}catch(L){V=L}(q=t())&&typeof q.catch=="function"&&q.catch(function(){})}}catch(L){if(L&&V&&typeof L.stack=="string")return[L.stack,V.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var o=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");o&&o.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var c=l.DetermineComponentFrameRoot(),y=c[0],S=c[1];if(y&&S){var w=y.split(`
`),k=S.split(`
`);for(o=l=0;l<w.length&&!w[l].includes("DetermineComponentFrameRoot");)l++;for(;o<k.length&&!k[o].includes("DetermineComponentFrameRoot");)o++;if(l===w.length||o===k.length)for(l=w.length-1,o=k.length-1;1<=l&&0<=o&&w[l]!==k[o];)o--;for(;1<=l&&0<=o;l--,o--)if(w[l]!==k[o]){if(l!==1||o!==1)do if(l--,o--,0>o||w[l]!==k[o]){var H=`
`+w[l].replace(" at new "," at ");return t.displayName&&H.includes("<anonymous>")&&(H=H.replace("<anonymous>",t.displayName)),H}while(1<=l&&0<=o);break}}}finally{eo=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?sa(a):""}function yb(t,e){switch(t.tag){case 26:case 27:case 5:return sa(t.type);case 16:return sa("Lazy");case 13:return t.child!==e&&e!==null?sa("Suspense Fallback"):sa("Suspense");case 19:return sa("SuspenseList");case 0:case 15:return no(t.type,!1);case 11:return no(t.type.render,!1);case 1:return no(t.type,!0);case 31:return sa("Activity");default:return""}}function pd(t){try{var e="",a=null;do e+=yb(t,a),a=t,t=t.return;while(t);return e}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var ao=Object.prototype.hasOwnProperty,io=n.unstable_scheduleCallback,lo=n.unstable_cancelCallback,xb=n.unstable_shouldYield,bb=n.unstable_requestPaint,be=n.unstable_now,vb=n.unstable_getCurrentPriorityLevel,gd=n.unstable_ImmediatePriority,yd=n.unstable_UserBlockingPriority,Pl=n.unstable_NormalPriority,Sb=n.unstable_LowPriority,xd=n.unstable_IdlePriority,jb=n.log,Tb=n.unstable_setDisableYieldValue,Ri=null,ve=null;function Mn(t){if(typeof jb=="function"&&Tb(t),ve&&typeof ve.setStrictMode=="function")try{ve.setStrictMode(Ri,t)}catch{}}var Se=Math.clz32?Math.clz32:Ab,Eb=Math.log,wb=Math.LN2;function Ab(t){return t>>>=0,t===0?32:31-(Eb(t)/wb|0)|0}var $l=256,Wl=262144,Il=4194304;function ra(t){var e=t&42;if(e!==0)return e;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function ts(t,e,a){var l=t.pendingLanes;if(l===0)return 0;var o=0,c=t.suspendedLanes,y=t.pingedLanes;t=t.warmLanes;var S=l&134217727;return S!==0?(l=S&~c,l!==0?o=ra(l):(y&=S,y!==0?o=ra(y):a||(a=S&~t,a!==0&&(o=ra(a))))):(S=l&~c,S!==0?o=ra(S):y!==0?o=ra(y):a||(a=l&~t,a!==0&&(o=ra(a)))),o===0?0:e!==0&&e!==o&&(e&c)===0&&(c=o&-o,a=e&-e,c>=a||c===32&&(a&4194048)!==0)?e:o}function Di(t,e){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&e)===0}function Cb(t,e){switch(t){case 1:case 2:case 4:case 8:case 64:return e+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function bd(){var t=Il;return Il<<=1,(Il&62914560)===0&&(Il=4194304),t}function so(t){for(var e=[],a=0;31>a;a++)e.push(t);return e}function zi(t,e){t.pendingLanes|=e,e!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function Nb(t,e,a,l,o,c){var y=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var S=t.entanglements,w=t.expirationTimes,k=t.hiddenUpdates;for(a=y&~a;0<a;){var H=31-Se(a),q=1<<H;S[H]=0,w[H]=-1;var V=k[H];if(V!==null)for(k[H]=null,H=0;H<V.length;H++){var L=V[H];L!==null&&(L.lane&=-536870913)}a&=~q}l!==0&&vd(t,l,0),c!==0&&o===0&&t.tag!==0&&(t.suspendedLanes|=c&~(y&~e))}function vd(t,e,a){t.pendingLanes|=e,t.suspendedLanes&=~e;var l=31-Se(e);t.entangledLanes|=e,t.entanglements[l]=t.entanglements[l]|1073741824|a&261930}function Sd(t,e){var a=t.entangledLanes|=e;for(t=t.entanglements;a;){var l=31-Se(a),o=1<<l;o&e|t[l]&e&&(t[l]|=e),a&=~o}}function jd(t,e){var a=e&-e;return a=(a&42)!==0?1:ro(a),(a&(t.suspendedLanes|e))!==0?0:a}function ro(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function oo(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function Td(){var t=Z.p;return t!==0?t:(t=window.event,t===void 0?32:o0(t.type))}function Ed(t,e){var a=Z.p;try{return Z.p=t,e()}finally{Z.p=a}}var Rn=Math.random().toString(36).slice(2),te="__reactFiber$"+Rn,de="__reactProps$"+Rn,Oa="__reactContainer$"+Rn,uo="__reactEvents$"+Rn,Mb="__reactListeners$"+Rn,Rb="__reactHandles$"+Rn,wd="__reactResources$"+Rn,Oi="__reactMarker$"+Rn;function co(t){delete t[te],delete t[de],delete t[uo],delete t[Mb],delete t[Rb]}function ka(t){var e=t[te];if(e)return e;for(var a=t.parentNode;a;){if(e=a[Oa]||a[te]){if(a=e.alternate,e.child!==null||a!==null&&a.child!==null)for(t=Qp(t);t!==null;){if(a=t[te])return a;t=Qp(t)}return e}t=a,a=t.parentNode}return null}function Va(t){if(t=t[te]||t[Oa]){var e=t.tag;if(e===5||e===6||e===13||e===31||e===26||e===27||e===3)return t}return null}function ki(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t.stateNode;throw Error(r(33))}function Ba(t){var e=t[wd];return e||(e=t[wd]={hoistableStyles:new Map,hoistableScripts:new Map}),e}function Wt(t){t[Oi]=!0}var Ad=new Set,Cd={};function oa(t,e){_a(t,e),_a(t+"Capture",e)}function _a(t,e){for(Cd[t]=e,t=0;t<e.length;t++)Ad.add(e[t])}var Db=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Nd={},Md={};function zb(t){return ao.call(Md,t)?!0:ao.call(Nd,t)?!1:Db.test(t)?Md[t]=!0:(Nd[t]=!0,!1)}function es(t,e,a){if(zb(e))if(a===null)t.removeAttribute(e);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(e);return;case"boolean":var l=e.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){t.removeAttribute(e);return}}t.setAttribute(e,""+a)}}function ns(t,e,a){if(a===null)t.removeAttribute(e);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(e);return}t.setAttribute(e,""+a)}}function un(t,e,a,l){if(l===null)t.removeAttribute(a);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(e,a,""+l)}}function Re(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Rd(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Ob(t,e,a){var l=Object.getOwnPropertyDescriptor(t.constructor.prototype,e);if(!t.hasOwnProperty(e)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var o=l.get,c=l.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return o.call(this)},set:function(y){a=""+y,c.call(this,y)}}),Object.defineProperty(t,e,{enumerable:l.enumerable}),{getValue:function(){return a},setValue:function(y){a=""+y},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function fo(t){if(!t._valueTracker){var e=Rd(t)?"checked":"value";t._valueTracker=Ob(t,e,""+t[e])}}function Dd(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var a=e.getValue(),l="";return t&&(l=Rd(t)?t.checked?"true":"false":t.value),t=l,t!==a?(e.setValue(t),!0):!1}function as(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var kb=/[\n"\\]/g;function De(t){return t.replace(kb,function(e){return"\\"+e.charCodeAt(0).toString(16)+" "})}function ho(t,e,a,l,o,c,y,S){t.name="",y!=null&&typeof y!="function"&&typeof y!="symbol"&&typeof y!="boolean"?t.type=y:t.removeAttribute("type"),e!=null?y==="number"?(e===0&&t.value===""||t.value!=e)&&(t.value=""+Re(e)):t.value!==""+Re(e)&&(t.value=""+Re(e)):y!=="submit"&&y!=="reset"||t.removeAttribute("value"),e!=null?mo(t,y,Re(e)):a!=null?mo(t,y,Re(a)):l!=null&&t.removeAttribute("value"),o==null&&c!=null&&(t.defaultChecked=!!c),o!=null&&(t.checked=o&&typeof o!="function"&&typeof o!="symbol"),S!=null&&typeof S!="function"&&typeof S!="symbol"&&typeof S!="boolean"?t.name=""+Re(S):t.removeAttribute("name")}function zd(t,e,a,l,o,c,y,S){if(c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(t.type=c),e!=null||a!=null){if(!(c!=="submit"&&c!=="reset"||e!=null)){fo(t);return}a=a!=null?""+Re(a):"",e=e!=null?""+Re(e):a,S||e===t.value||(t.value=e),t.defaultValue=e}l=l??o,l=typeof l!="function"&&typeof l!="symbol"&&!!l,t.checked=S?t.checked:!!l,t.defaultChecked=!!l,y!=null&&typeof y!="function"&&typeof y!="symbol"&&typeof y!="boolean"&&(t.name=y),fo(t)}function mo(t,e,a){e==="number"&&as(t.ownerDocument)===t||t.defaultValue===""+a||(t.defaultValue=""+a)}function La(t,e,a,l){if(t=t.options,e){e={};for(var o=0;o<a.length;o++)e["$"+a[o]]=!0;for(a=0;a<t.length;a++)o=e.hasOwnProperty("$"+t[a].value),t[a].selected!==o&&(t[a].selected=o),o&&l&&(t[a].defaultSelected=!0)}else{for(a=""+Re(a),e=null,o=0;o<t.length;o++){if(t[o].value===a){t[o].selected=!0,l&&(t[o].defaultSelected=!0);return}e!==null||t[o].disabled||(e=t[o])}e!==null&&(e.selected=!0)}}function Od(t,e,a){if(e!=null&&(e=""+Re(e),e!==t.value&&(t.value=e),a==null)){t.defaultValue!==e&&(t.defaultValue=e);return}t.defaultValue=a!=null?""+Re(a):""}function kd(t,e,a,l){if(e==null){if(l!=null){if(a!=null)throw Error(r(92));if(ot(l)){if(1<l.length)throw Error(r(93));l=l[0]}a=l}a==null&&(a=""),e=a}a=Re(e),t.defaultValue=a,l=t.textContent,l===a&&l!==""&&l!==null&&(t.value=l),fo(t)}function Ua(t,e){if(e){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=e;return}}t.textContent=e}var Vb=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Vd(t,e,a){var l=e.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?l?t.setProperty(e,""):e==="float"?t.cssFloat="":t[e]="":l?t.setProperty(e,a):typeof a!="number"||a===0||Vb.has(e)?e==="float"?t.cssFloat=a:t[e]=(""+a).trim():t[e]=a+"px"}function Bd(t,e,a){if(e!=null&&typeof e!="object")throw Error(r(62));if(t=t.style,a!=null){for(var l in a)!a.hasOwnProperty(l)||e!=null&&e.hasOwnProperty(l)||(l.indexOf("--")===0?t.setProperty(l,""):l==="float"?t.cssFloat="":t[l]="");for(var o in e)l=e[o],e.hasOwnProperty(o)&&a[o]!==l&&Vd(t,o,l)}else for(var c in e)e.hasOwnProperty(c)&&Vd(t,c,e[c])}function po(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Bb=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),_b=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function is(t){return _b.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function cn(){}var go=null;function yo(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Ha=null,Ga=null;function _d(t){var e=Va(t);if(e&&(t=e.stateNode)){var a=t[de]||null;t:switch(t=e.stateNode,e.type){case"input":if(ho(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),e=a.name,a.type==="radio"&&e!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+De(""+e)+'"][type="radio"]'),e=0;e<a.length;e++){var l=a[e];if(l!==t&&l.form===t.form){var o=l[de]||null;if(!o)throw Error(r(90));ho(l,o.value,o.defaultValue,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name)}}for(e=0;e<a.length;e++)l=a[e],l.form===t.form&&Dd(l)}break t;case"textarea":Od(t,a.value,a.defaultValue);break t;case"select":e=a.value,e!=null&&La(t,!!a.multiple,e,!1)}}}var xo=!1;function Ld(t,e,a){if(xo)return t(e,a);xo=!0;try{var l=t(e);return l}finally{if(xo=!1,(Ha!==null||Ga!==null)&&(Ks(),Ha&&(e=Ha,t=Ga,Ga=Ha=null,_d(e),t)))for(e=0;e<t.length;e++)_d(t[e])}}function Vi(t,e){var a=t.stateNode;if(a===null)return null;var l=a[de]||null;if(l===null)return null;a=l[e];t:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(t=t.type,l=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!l;break t;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(r(231,e,typeof a));return a}var fn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),bo=!1;if(fn)try{var Bi={};Object.defineProperty(Bi,"passive",{get:function(){bo=!0}}),window.addEventListener("test",Bi,Bi),window.removeEventListener("test",Bi,Bi)}catch{bo=!1}var Dn=null,vo=null,ls=null;function Ud(){if(ls)return ls;var t,e=vo,a=e.length,l,o="value"in Dn?Dn.value:Dn.textContent,c=o.length;for(t=0;t<a&&e[t]===o[t];t++);var y=a-t;for(l=1;l<=y&&e[a-l]===o[c-l];l++);return ls=o.slice(t,1<l?1-l:void 0)}function ss(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function rs(){return!0}function Hd(){return!1}function he(t){function e(a,l,o,c,y){this._reactName=a,this._targetInst=o,this.type=l,this.nativeEvent=c,this.target=y,this.currentTarget=null;for(var S in t)t.hasOwnProperty(S)&&(a=t[S],this[S]=a?a(c):c[S]);return this.isDefaultPrevented=(c.defaultPrevented!=null?c.defaultPrevented:c.returnValue===!1)?rs:Hd,this.isPropagationStopped=Hd,this}return b(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=rs)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=rs)},persist:function(){},isPersistent:rs}),e}var ua={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},os=he(ua),_i=b({},ua,{view:0,detail:0}),Lb=he(_i),So,jo,Li,us=b({},_i,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Eo,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Li&&(Li&&t.type==="mousemove"?(So=t.screenX-Li.screenX,jo=t.screenY-Li.screenY):jo=So=0,Li=t),So)},movementY:function(t){return"movementY"in t?t.movementY:jo}}),Gd=he(us),Ub=b({},us,{dataTransfer:0}),Hb=he(Ub),Gb=b({},_i,{relatedTarget:0}),To=he(Gb),Yb=b({},ua,{animationName:0,elapsedTime:0,pseudoElement:0}),qb=he(Yb),Xb=b({},ua,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Kb=he(Xb),Qb=b({},ua,{data:0}),Yd=he(Qb),Zb={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Fb={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Jb={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pb(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=Jb[t])?!!e[t]:!1}function Eo(){return Pb}var $b=b({},_i,{key:function(t){if(t.key){var e=Zb[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=ss(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Fb[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Eo,charCode:function(t){return t.type==="keypress"?ss(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?ss(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Wb=he($b),Ib=b({},us,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),qd=he(Ib),tv=b({},_i,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Eo}),ev=he(tv),nv=b({},ua,{propertyName:0,elapsedTime:0,pseudoElement:0}),av=he(nv),iv=b({},us,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),lv=he(iv),sv=b({},ua,{newState:0,oldState:0}),rv=he(sv),ov=[9,13,27,32],wo=fn&&"CompositionEvent"in window,Ui=null;fn&&"documentMode"in document&&(Ui=document.documentMode);var uv=fn&&"TextEvent"in window&&!Ui,Xd=fn&&(!wo||Ui&&8<Ui&&11>=Ui),Kd=" ",Qd=!1;function Zd(t,e){switch(t){case"keyup":return ov.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Fd(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Ya=!1;function cv(t,e){switch(t){case"compositionend":return Fd(e);case"keypress":return e.which!==32?null:(Qd=!0,Kd);case"textInput":return t=e.data,t===Kd&&Qd?null:t;default:return null}}function fv(t,e){if(Ya)return t==="compositionend"||!wo&&Zd(t,e)?(t=Ud(),ls=vo=Dn=null,Ya=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Xd&&e.locale!=="ko"?null:e.data;default:return null}}var dv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Jd(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!dv[t.type]:e==="textarea"}function Pd(t,e,a,l){Ha?Ga?Ga.push(l):Ga=[l]:Ha=l,e=Ws(e,"onChange"),0<e.length&&(a=new os("onChange","change",null,a,l),t.push({event:a,listeners:e}))}var Hi=null,Gi=null;function hv(t){zp(t,0)}function cs(t){var e=ki(t);if(Dd(e))return t}function $d(t,e){if(t==="change")return e}var Wd=!1;if(fn){var Ao;if(fn){var Co="oninput"in document;if(!Co){var Id=document.createElement("div");Id.setAttribute("oninput","return;"),Co=typeof Id.oninput=="function"}Ao=Co}else Ao=!1;Wd=Ao&&(!document.documentMode||9<document.documentMode)}function th(){Hi&&(Hi.detachEvent("onpropertychange",eh),Gi=Hi=null)}function eh(t){if(t.propertyName==="value"&&cs(Gi)){var e=[];Pd(e,Gi,t,yo(t)),Ld(hv,e)}}function mv(t,e,a){t==="focusin"?(th(),Hi=e,Gi=a,Hi.attachEvent("onpropertychange",eh)):t==="focusout"&&th()}function pv(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return cs(Gi)}function gv(t,e){if(t==="click")return cs(e)}function yv(t,e){if(t==="input"||t==="change")return cs(e)}function xv(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var je=typeof Object.is=="function"?Object.is:xv;function Yi(t,e){if(je(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var a=Object.keys(t),l=Object.keys(e);if(a.length!==l.length)return!1;for(l=0;l<a.length;l++){var o=a[l];if(!ao.call(e,o)||!je(t[o],e[o]))return!1}return!0}function nh(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function ah(t,e){var a=nh(t);t=0;for(var l;a;){if(a.nodeType===3){if(l=t+a.textContent.length,t<=e&&l>=e)return{node:a,offset:e-t};t=l}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=nh(a)}}function ih(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?ih(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function lh(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var e=as(t.document);e instanceof t.HTMLIFrameElement;){try{var a=typeof e.contentWindow.location.href=="string"}catch{a=!1}if(a)t=e.contentWindow;else break;e=as(t.document)}return e}function No(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}var bv=fn&&"documentMode"in document&&11>=document.documentMode,qa=null,Mo=null,qi=null,Ro=!1;function sh(t,e,a){var l=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Ro||qa==null||qa!==as(l)||(l=qa,"selectionStart"in l&&No(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),qi&&Yi(qi,l)||(qi=l,l=Ws(Mo,"onSelect"),0<l.length&&(e=new os("onSelect","select",null,e,a),t.push({event:e,listeners:l}),e.target=qa)))}function ca(t,e){var a={};return a[t.toLowerCase()]=e.toLowerCase(),a["Webkit"+t]="webkit"+e,a["Moz"+t]="moz"+e,a}var Xa={animationend:ca("Animation","AnimationEnd"),animationiteration:ca("Animation","AnimationIteration"),animationstart:ca("Animation","AnimationStart"),transitionrun:ca("Transition","TransitionRun"),transitionstart:ca("Transition","TransitionStart"),transitioncancel:ca("Transition","TransitionCancel"),transitionend:ca("Transition","TransitionEnd")},Do={},rh={};fn&&(rh=document.createElement("div").style,"AnimationEvent"in window||(delete Xa.animationend.animation,delete Xa.animationiteration.animation,delete Xa.animationstart.animation),"TransitionEvent"in window||delete Xa.transitionend.transition);function fa(t){if(Do[t])return Do[t];if(!Xa[t])return t;var e=Xa[t],a;for(a in e)if(e.hasOwnProperty(a)&&a in rh)return Do[t]=e[a];return t}var oh=fa("animationend"),uh=fa("animationiteration"),ch=fa("animationstart"),vv=fa("transitionrun"),Sv=fa("transitionstart"),jv=fa("transitioncancel"),fh=fa("transitionend"),dh=new Map,zo="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");zo.push("scrollEnd");function qe(t,e){dh.set(t,e),oa(e,[t])}var fs=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},ze=[],Ka=0,Oo=0;function ds(){for(var t=Ka,e=Oo=Ka=0;e<t;){var a=ze[e];ze[e++]=null;var l=ze[e];ze[e++]=null;var o=ze[e];ze[e++]=null;var c=ze[e];if(ze[e++]=null,l!==null&&o!==null){var y=l.pending;y===null?o.next=o:(o.next=y.next,y.next=o),l.pending=o}c!==0&&hh(a,o,c)}}function hs(t,e,a,l){ze[Ka++]=t,ze[Ka++]=e,ze[Ka++]=a,ze[Ka++]=l,Oo|=l,t.lanes|=l,t=t.alternate,t!==null&&(t.lanes|=l)}function ko(t,e,a,l){return hs(t,e,a,l),ms(t)}function da(t,e){return hs(t,null,null,e),ms(t)}function hh(t,e,a){t.lanes|=a;var l=t.alternate;l!==null&&(l.lanes|=a);for(var o=!1,c=t.return;c!==null;)c.childLanes|=a,l=c.alternate,l!==null&&(l.childLanes|=a),c.tag===22&&(t=c.stateNode,t===null||t._visibility&1||(o=!0)),t=c,c=c.return;return t.tag===3?(c=t.stateNode,o&&e!==null&&(o=31-Se(a),t=c.hiddenUpdates,l=t[o],l===null?t[o]=[e]:l.push(e),e.lane=a|536870912),c):null}function ms(t){if(50<fl)throw fl=0,qu=null,Error(r(185));for(var e=t.return;e!==null;)t=e,e=t.return;return t.tag===3?t.stateNode:null}var Qa={};function Tv(t,e,a,l){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Te(t,e,a,l){return new Tv(t,e,a,l)}function Vo(t){return t=t.prototype,!(!t||!t.isReactComponent)}function dn(t,e){var a=t.alternate;return a===null?(a=Te(t.tag,e,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=e,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&65011712,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,e=t.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function mh(t,e){t.flags&=65011714;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=e,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,e=a.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t}function ps(t,e,a,l,o,c){var y=0;if(l=t,typeof t=="function")Vo(t)&&(y=1);else if(typeof t=="string")y=N1(t,a,$.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(t){case et:return t=Te(31,a,e,o),t.elementType=et,t.lanes=c,t;case R:return ha(a.children,o,c,e);case T:y=8,o|=24;break;case C:return t=Te(12,a,e,o|2),t.elementType=C,t.lanes=c,t;case K:return t=Te(13,a,e,o),t.elementType=K,t.lanes=c,t;case I:return t=Te(19,a,e,o),t.elementType=I,t.lanes=c,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case z:y=10;break t;case _:y=9;break t;case U:y=11;break t;case X:y=14;break t;case Q:y=16,l=null;break t}y=29,a=Error(r(130,t===null?"null":typeof t,"")),l=null}return e=Te(y,a,e,o),e.elementType=t,e.type=l,e.lanes=c,e}function ha(t,e,a,l){return t=Te(7,t,l,e),t.lanes=a,t}function Bo(t,e,a){return t=Te(6,t,null,e),t.lanes=a,t}function ph(t){var e=Te(18,null,null,0);return e.stateNode=t,e}function _o(t,e,a){return e=Te(4,t.children!==null?t.children:[],t.key,e),e.lanes=a,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}var gh=new WeakMap;function Oe(t,e){if(typeof t=="object"&&t!==null){var a=gh.get(t);return a!==void 0?a:(e={value:t,source:e,stack:pd(e)},gh.set(t,e),e)}return{value:t,source:e,stack:pd(e)}}var Za=[],Fa=0,gs=null,Xi=0,ke=[],Ve=0,zn=null,Pe=1,$e="";function hn(t,e){Za[Fa++]=Xi,Za[Fa++]=gs,gs=t,Xi=e}function yh(t,e,a){ke[Ve++]=Pe,ke[Ve++]=$e,ke[Ve++]=zn,zn=t;var l=Pe;t=$e;var o=32-Se(l)-1;l&=~(1<<o),a+=1;var c=32-Se(e)+o;if(30<c){var y=o-o%5;c=(l&(1<<y)-1).toString(32),l>>=y,o-=y,Pe=1<<32-Se(e)+o|a<<o|l,$e=c+t}else Pe=1<<c|a<<o|l,$e=t}function Lo(t){t.return!==null&&(hn(t,1),yh(t,1,0))}function Uo(t){for(;t===gs;)gs=Za[--Fa],Za[Fa]=null,Xi=Za[--Fa],Za[Fa]=null;for(;t===zn;)zn=ke[--Ve],ke[Ve]=null,$e=ke[--Ve],ke[Ve]=null,Pe=ke[--Ve],ke[Ve]=null}function xh(t,e){ke[Ve++]=Pe,ke[Ve++]=$e,ke[Ve++]=zn,Pe=e.id,$e=e.overflow,zn=t}var ee=null,Vt=null,jt=!1,On=null,Be=!1,Ho=Error(r(519));function kn(t){var e=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ki(Oe(e,t)),Ho}function bh(t){var e=t.stateNode,a=t.type,l=t.memoizedProps;switch(e[te]=t,e[de]=l,a){case"dialog":bt("cancel",e),bt("close",e);break;case"iframe":case"object":case"embed":bt("load",e);break;case"video":case"audio":for(a=0;a<hl.length;a++)bt(hl[a],e);break;case"source":bt("error",e);break;case"img":case"image":case"link":bt("error",e),bt("load",e);break;case"details":bt("toggle",e);break;case"input":bt("invalid",e),zd(e,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":bt("invalid",e);break;case"textarea":bt("invalid",e),kd(e,l.value,l.defaultValue,l.children)}a=l.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||e.textContent===""+a||l.suppressHydrationWarning===!0||Bp(e.textContent,a)?(l.popover!=null&&(bt("beforetoggle",e),bt("toggle",e)),l.onScroll!=null&&bt("scroll",e),l.onScrollEnd!=null&&bt("scrollend",e),l.onClick!=null&&(e.onclick=cn),e=!0):e=!1,e||kn(t,!0)}function vh(t){for(ee=t.return;ee;)switch(ee.tag){case 5:case 31:case 13:Be=!1;return;case 27:case 3:Be=!0;return;default:ee=ee.return}}function Ja(t){if(t!==ee)return!1;if(!jt)return vh(t),jt=!0,!1;var e=t.tag,a;if((a=e!==3&&e!==27)&&((a=e===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||ic(t.type,t.memoizedProps)),a=!a),a&&Vt&&kn(t),vh(t),e===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));Vt=Kp(t)}else if(e===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));Vt=Kp(t)}else e===27?(e=Vt,Fn(t.type)?(t=uc,uc=null,Vt=t):Vt=e):Vt=ee?Le(t.stateNode.nextSibling):null;return!0}function ma(){Vt=ee=null,jt=!1}function Go(){var t=On;return t!==null&&(ye===null?ye=t:ye.push.apply(ye,t),On=null),t}function Ki(t){On===null?On=[t]:On.push(t)}var Yo=N(null),pa=null,mn=null;function Vn(t,e,a){F(Yo,e._currentValue),e._currentValue=a}function pn(t){t._currentValue=Yo.current,Y(Yo)}function qo(t,e,a){for(;t!==null;){var l=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,l!==null&&(l.childLanes|=e)):l!==null&&(l.childLanes&e)!==e&&(l.childLanes|=e),t===a)break;t=t.return}}function Xo(t,e,a,l){var o=t.child;for(o!==null&&(o.return=t);o!==null;){var c=o.dependencies;if(c!==null){var y=o.child;c=c.firstContext;t:for(;c!==null;){var S=c;c=o;for(var w=0;w<e.length;w++)if(S.context===e[w]){c.lanes|=a,S=c.alternate,S!==null&&(S.lanes|=a),qo(c.return,a,t),l||(y=null);break t}c=S.next}}else if(o.tag===18){if(y=o.return,y===null)throw Error(r(341));y.lanes|=a,c=y.alternate,c!==null&&(c.lanes|=a),qo(y,a,t),y=null}else y=o.child;if(y!==null)y.return=o;else for(y=o;y!==null;){if(y===t){y=null;break}if(o=y.sibling,o!==null){o.return=y.return,y=o;break}y=y.return}o=y}}function Pa(t,e,a,l){t=null;for(var o=e,c=!1;o!==null;){if(!c){if((o.flags&524288)!==0)c=!0;else if((o.flags&262144)!==0)break}if(o.tag===10){var y=o.alternate;if(y===null)throw Error(r(387));if(y=y.memoizedProps,y!==null){var S=o.type;je(o.pendingProps.value,y.value)||(t!==null?t.push(S):t=[S])}}else if(o===At.current){if(y=o.alternate,y===null)throw Error(r(387));y.memoizedState.memoizedState!==o.memoizedState.memoizedState&&(t!==null?t.push(xl):t=[xl])}o=o.return}t!==null&&Xo(e,t,a,l),e.flags|=262144}function ys(t){for(t=t.firstContext;t!==null;){if(!je(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function ga(t){pa=t,mn=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function ne(t){return Sh(pa,t)}function xs(t,e){return pa===null&&ga(t),Sh(t,e)}function Sh(t,e){var a=e._currentValue;if(e={context:e,memoizedValue:a,next:null},mn===null){if(t===null)throw Error(r(308));mn=e,t.dependencies={lanes:0,firstContext:e},t.flags|=524288}else mn=mn.next=e;return a}var Ev=typeof AbortController<"u"?AbortController:function(){var t=[],e=this.signal={aborted:!1,addEventListener:function(a,l){t.push(l)}};this.abort=function(){e.aborted=!0,t.forEach(function(a){return a()})}},wv=n.unstable_scheduleCallback,Av=n.unstable_NormalPriority,Kt={$$typeof:z,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ko(){return{controller:new Ev,data:new Map,refCount:0}}function Qi(t){t.refCount--,t.refCount===0&&wv(Av,function(){t.controller.abort()})}var Zi=null,Qo=0,$a=0,Wa=null;function Cv(t,e){if(Zi===null){var a=Zi=[];Qo=0,$a=Ju(),Wa={status:"pending",value:void 0,then:function(l){a.push(l)}}}return Qo++,e.then(jh,jh),e}function jh(){if(--Qo===0&&Zi!==null){Wa!==null&&(Wa.status="fulfilled");var t=Zi;Zi=null,$a=0,Wa=null;for(var e=0;e<t.length;e++)(0,t[e])()}}function Nv(t,e){var a=[],l={status:"pending",value:null,reason:null,then:function(o){a.push(o)}};return t.then(function(){l.status="fulfilled",l.value=e;for(var o=0;o<a.length;o++)(0,a[o])(e)},function(o){for(l.status="rejected",l.reason=o,o=0;o<a.length;o++)(0,a[o])(void 0)}),l}var Th=B.S;B.S=function(t,e){sp=be(),typeof e=="object"&&e!==null&&typeof e.then=="function"&&Cv(t,e),Th!==null&&Th(t,e)};var ya=N(null);function Zo(){var t=ya.current;return t!==null?t:zt.pooledCache}function bs(t,e){e===null?F(ya,ya.current):F(ya,e.pool)}function Eh(){var t=Zo();return t===null?null:{parent:Kt._currentValue,pool:t}}var Ia=Error(r(460)),Fo=Error(r(474)),vs=Error(r(542)),Ss={then:function(){}};function wh(t){return t=t.status,t==="fulfilled"||t==="rejected"}function Ah(t,e,a){switch(a=t[a],a===void 0?t.push(e):a!==e&&(e.then(cn,cn),e=a),e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,Nh(t),t;default:if(typeof e.status=="string")e.then(cn,cn);else{if(t=zt,t!==null&&100<t.shellSuspendCounter)throw Error(r(482));t=e,t.status="pending",t.then(function(l){if(e.status==="pending"){var o=e;o.status="fulfilled",o.value=l}},function(l){if(e.status==="pending"){var o=e;o.status="rejected",o.reason=l}})}switch(e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,Nh(t),t}throw ba=e,Ia}}function xa(t){try{var e=t._init;return e(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(ba=a,Ia):a}}var ba=null;function Ch(){if(ba===null)throw Error(r(459));var t=ba;return ba=null,t}function Nh(t){if(t===Ia||t===vs)throw Error(r(483))}var ti=null,Fi=0;function js(t){var e=Fi;return Fi+=1,ti===null&&(ti=[]),Ah(ti,t,e)}function Ji(t,e){e=e.props.ref,t.ref=e!==void 0?e:null}function Ts(t,e){throw e.$$typeof===v?Error(r(525)):(t=Object.prototype.toString.call(e),Error(r(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)))}function Mh(t){function e(D,M){if(t){var O=D.deletions;O===null?(D.deletions=[M],D.flags|=16):O.push(M)}}function a(D,M){if(!t)return null;for(;M!==null;)e(D,M),M=M.sibling;return null}function l(D){for(var M=new Map;D!==null;)D.key!==null?M.set(D.key,D):M.set(D.index,D),D=D.sibling;return M}function o(D,M){return D=dn(D,M),D.index=0,D.sibling=null,D}function c(D,M,O){return D.index=O,t?(O=D.alternate,O!==null?(O=O.index,O<M?(D.flags|=67108866,M):O):(D.flags|=67108866,M)):(D.flags|=1048576,M)}function y(D){return t&&D.alternate===null&&(D.flags|=67108866),D}function S(D,M,O,G){return M===null||M.tag!==6?(M=Bo(O,D.mode,G),M.return=D,M):(M=o(M,O),M.return=D,M)}function w(D,M,O,G){var it=O.type;return it===R?H(D,M,O.props.children,G,O.key):M!==null&&(M.elementType===it||typeof it=="object"&&it!==null&&it.$$typeof===Q&&xa(it)===M.type)?(M=o(M,O.props),Ji(M,O),M.return=D,M):(M=ps(O.type,O.key,O.props,null,D.mode,G),Ji(M,O),M.return=D,M)}function k(D,M,O,G){return M===null||M.tag!==4||M.stateNode.containerInfo!==O.containerInfo||M.stateNode.implementation!==O.implementation?(M=_o(O,D.mode,G),M.return=D,M):(M=o(M,O.children||[]),M.return=D,M)}function H(D,M,O,G,it){return M===null||M.tag!==7?(M=ha(O,D.mode,G,it),M.return=D,M):(M=o(M,O),M.return=D,M)}function q(D,M,O){if(typeof M=="string"&&M!==""||typeof M=="number"||typeof M=="bigint")return M=Bo(""+M,D.mode,O),M.return=D,M;if(typeof M=="object"&&M!==null){switch(M.$$typeof){case E:return O=ps(M.type,M.key,M.props,null,D.mode,O),Ji(O,M),O.return=D,O;case A:return M=_o(M,D.mode,O),M.return=D,M;case Q:return M=xa(M),q(D,M,O)}if(ot(M)||ft(M))return M=ha(M,D.mode,O,null),M.return=D,M;if(typeof M.then=="function")return q(D,js(M),O);if(M.$$typeof===z)return q(D,xs(D,M),O);Ts(D,M)}return null}function V(D,M,O,G){var it=M!==null?M.key:null;if(typeof O=="string"&&O!==""||typeof O=="number"||typeof O=="bigint")return it!==null?null:S(D,M,""+O,G);if(typeof O=="object"&&O!==null){switch(O.$$typeof){case E:return O.key===it?w(D,M,O,G):null;case A:return O.key===it?k(D,M,O,G):null;case Q:return O=xa(O),V(D,M,O,G)}if(ot(O)||ft(O))return it!==null?null:H(D,M,O,G,null);if(typeof O.then=="function")return V(D,M,js(O),G);if(O.$$typeof===z)return V(D,M,xs(D,O),G);Ts(D,O)}return null}function L(D,M,O,G,it){if(typeof G=="string"&&G!==""||typeof G=="number"||typeof G=="bigint")return D=D.get(O)||null,S(M,D,""+G,it);if(typeof G=="object"&&G!==null){switch(G.$$typeof){case E:return D=D.get(G.key===null?O:G.key)||null,w(M,D,G,it);case A:return D=D.get(G.key===null?O:G.key)||null,k(M,D,G,it);case Q:return G=xa(G),L(D,M,O,G,it)}if(ot(G)||ft(G))return D=D.get(O)||null,H(M,D,G,it,null);if(typeof G.then=="function")return L(D,M,O,js(G),it);if(G.$$typeof===z)return L(D,M,O,xs(M,G),it);Ts(M,G)}return null}function W(D,M,O,G){for(var it=null,Tt=null,nt=M,ht=M=0,St=null;nt!==null&&ht<O.length;ht++){nt.index>ht?(St=nt,nt=null):St=nt.sibling;var Et=V(D,nt,O[ht],G);if(Et===null){nt===null&&(nt=St);break}t&&nt&&Et.alternate===null&&e(D,nt),M=c(Et,M,ht),Tt===null?it=Et:Tt.sibling=Et,Tt=Et,nt=St}if(ht===O.length)return a(D,nt),jt&&hn(D,ht),it;if(nt===null){for(;ht<O.length;ht++)nt=q(D,O[ht],G),nt!==null&&(M=c(nt,M,ht),Tt===null?it=nt:Tt.sibling=nt,Tt=nt);return jt&&hn(D,ht),it}for(nt=l(nt);ht<O.length;ht++)St=L(nt,D,ht,O[ht],G),St!==null&&(t&&St.alternate!==null&&nt.delete(St.key===null?ht:St.key),M=c(St,M,ht),Tt===null?it=St:Tt.sibling=St,Tt=St);return t&&nt.forEach(function(In){return e(D,In)}),jt&&hn(D,ht),it}function st(D,M,O,G){if(O==null)throw Error(r(151));for(var it=null,Tt=null,nt=M,ht=M=0,St=null,Et=O.next();nt!==null&&!Et.done;ht++,Et=O.next()){nt.index>ht?(St=nt,nt=null):St=nt.sibling;var In=V(D,nt,Et.value,G);if(In===null){nt===null&&(nt=St);break}t&&nt&&In.alternate===null&&e(D,nt),M=c(In,M,ht),Tt===null?it=In:Tt.sibling=In,Tt=In,nt=St}if(Et.done)return a(D,nt),jt&&hn(D,ht),it;if(nt===null){for(;!Et.done;ht++,Et=O.next())Et=q(D,Et.value,G),Et!==null&&(M=c(Et,M,ht),Tt===null?it=Et:Tt.sibling=Et,Tt=Et);return jt&&hn(D,ht),it}for(nt=l(nt);!Et.done;ht++,Et=O.next())Et=L(nt,D,ht,Et.value,G),Et!==null&&(t&&Et.alternate!==null&&nt.delete(Et.key===null?ht:Et.key),M=c(Et,M,ht),Tt===null?it=Et:Tt.sibling=Et,Tt=Et);return t&&nt.forEach(function(U1){return e(D,U1)}),jt&&hn(D,ht),it}function Dt(D,M,O,G){if(typeof O=="object"&&O!==null&&O.type===R&&O.key===null&&(O=O.props.children),typeof O=="object"&&O!==null){switch(O.$$typeof){case E:t:{for(var it=O.key;M!==null;){if(M.key===it){if(it=O.type,it===R){if(M.tag===7){a(D,M.sibling),G=o(M,O.props.children),G.return=D,D=G;break t}}else if(M.elementType===it||typeof it=="object"&&it!==null&&it.$$typeof===Q&&xa(it)===M.type){a(D,M.sibling),G=o(M,O.props),Ji(G,O),G.return=D,D=G;break t}a(D,M);break}else e(D,M);M=M.sibling}O.type===R?(G=ha(O.props.children,D.mode,G,O.key),G.return=D,D=G):(G=ps(O.type,O.key,O.props,null,D.mode,G),Ji(G,O),G.return=D,D=G)}return y(D);case A:t:{for(it=O.key;M!==null;){if(M.key===it)if(M.tag===4&&M.stateNode.containerInfo===O.containerInfo&&M.stateNode.implementation===O.implementation){a(D,M.sibling),G=o(M,O.children||[]),G.return=D,D=G;break t}else{a(D,M);break}else e(D,M);M=M.sibling}G=_o(O,D.mode,G),G.return=D,D=G}return y(D);case Q:return O=xa(O),Dt(D,M,O,G)}if(ot(O))return W(D,M,O,G);if(ft(O)){if(it=ft(O),typeof it!="function")throw Error(r(150));return O=it.call(O),st(D,M,O,G)}if(typeof O.then=="function")return Dt(D,M,js(O),G);if(O.$$typeof===z)return Dt(D,M,xs(D,O),G);Ts(D,O)}return typeof O=="string"&&O!==""||typeof O=="number"||typeof O=="bigint"?(O=""+O,M!==null&&M.tag===6?(a(D,M.sibling),G=o(M,O),G.return=D,D=G):(a(D,M),G=Bo(O,D.mode,G),G.return=D,D=G),y(D)):a(D,M)}return function(D,M,O,G){try{Fi=0;var it=Dt(D,M,O,G);return ti=null,it}catch(nt){if(nt===Ia||nt===vs)throw nt;var Tt=Te(29,nt,null,D.mode);return Tt.lanes=G,Tt.return=D,Tt}finally{}}}var va=Mh(!0),Rh=Mh(!1),Bn=!1;function Jo(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Po(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function _n(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Ln(t,e,a){var l=t.updateQueue;if(l===null)return null;if(l=l.shared,(wt&2)!==0){var o=l.pending;return o===null?e.next=e:(e.next=o.next,o.next=e),l.pending=e,e=ms(t),hh(t,null,a),e}return hs(t,l,e,a),ms(t)}function Pi(t,e,a){if(e=e.updateQueue,e!==null&&(e=e.shared,(a&4194048)!==0)){var l=e.lanes;l&=t.pendingLanes,a|=l,e.lanes=a,Sd(t,a)}}function $o(t,e){var a=t.updateQueue,l=t.alternate;if(l!==null&&(l=l.updateQueue,a===l)){var o=null,c=null;if(a=a.firstBaseUpdate,a!==null){do{var y={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};c===null?o=c=y:c=c.next=y,a=a.next}while(a!==null);c===null?o=c=e:c=c.next=e}else o=c=e;a={baseState:l.baseState,firstBaseUpdate:o,lastBaseUpdate:c,shared:l.shared,callbacks:l.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=e:t.next=e,a.lastBaseUpdate=e}var Wo=!1;function $i(){if(Wo){var t=Wa;if(t!==null)throw t}}function Wi(t,e,a,l){Wo=!1;var o=t.updateQueue;Bn=!1;var c=o.firstBaseUpdate,y=o.lastBaseUpdate,S=o.shared.pending;if(S!==null){o.shared.pending=null;var w=S,k=w.next;w.next=null,y===null?c=k:y.next=k,y=w;var H=t.alternate;H!==null&&(H=H.updateQueue,S=H.lastBaseUpdate,S!==y&&(S===null?H.firstBaseUpdate=k:S.next=k,H.lastBaseUpdate=w))}if(c!==null){var q=o.baseState;y=0,H=k=w=null,S=c;do{var V=S.lane&-536870913,L=V!==S.lane;if(L?(vt&V)===V:(l&V)===V){V!==0&&V===$a&&(Wo=!0),H!==null&&(H=H.next={lane:0,tag:S.tag,payload:S.payload,callback:null,next:null});t:{var W=t,st=S;V=e;var Dt=a;switch(st.tag){case 1:if(W=st.payload,typeof W=="function"){q=W.call(Dt,q,V);break t}q=W;break t;case 3:W.flags=W.flags&-65537|128;case 0:if(W=st.payload,V=typeof W=="function"?W.call(Dt,q,V):W,V==null)break t;q=b({},q,V);break t;case 2:Bn=!0}}V=S.callback,V!==null&&(t.flags|=64,L&&(t.flags|=8192),L=o.callbacks,L===null?o.callbacks=[V]:L.push(V))}else L={lane:V,tag:S.tag,payload:S.payload,callback:S.callback,next:null},H===null?(k=H=L,w=q):H=H.next=L,y|=V;if(S=S.next,S===null){if(S=o.shared.pending,S===null)break;L=S,S=L.next,L.next=null,o.lastBaseUpdate=L,o.shared.pending=null}}while(!0);H===null&&(w=q),o.baseState=w,o.firstBaseUpdate=k,o.lastBaseUpdate=H,c===null&&(o.shared.lanes=0),qn|=y,t.lanes=y,t.memoizedState=q}}function Dh(t,e){if(typeof t!="function")throw Error(r(191,t));t.call(e)}function zh(t,e){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)Dh(a[t],e)}var ei=N(null),Es=N(0);function Oh(t,e){t=En,F(Es,t),F(ei,e),En=t|e.baseLanes}function Io(){F(Es,En),F(ei,ei.current)}function tu(){En=Es.current,Y(ei),Y(Es)}var Ee=N(null),_e=null;function Un(t){var e=t.alternate;F(qt,qt.current&1),F(Ee,t),_e===null&&(e===null||ei.current!==null||e.memoizedState!==null)&&(_e=t)}function eu(t){F(qt,qt.current),F(Ee,t),_e===null&&(_e=t)}function kh(t){t.tag===22?(F(qt,qt.current),F(Ee,t),_e===null&&(_e=t)):Hn()}function Hn(){F(qt,qt.current),F(Ee,Ee.current)}function we(t){Y(Ee),_e===t&&(_e=null),Y(qt)}var qt=N(0);function ws(t){for(var e=t;e!==null;){if(e.tag===13){var a=e.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||rc(a)||oc(a)))return e}else if(e.tag===19&&(e.memoizedProps.revealOrder==="forwards"||e.memoizedProps.revealOrder==="backwards"||e.memoizedProps.revealOrder==="unstable_legacy-backwards"||e.memoizedProps.revealOrder==="together")){if((e.flags&128)!==0)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var gn=0,dt=null,Mt=null,Qt=null,As=!1,ni=!1,Sa=!1,Cs=0,Ii=0,ai=null,Mv=0;function Ut(){throw Error(r(321))}function nu(t,e){if(e===null)return!1;for(var a=0;a<e.length&&a<t.length;a++)if(!je(t[a],e[a]))return!1;return!0}function au(t,e,a,l,o,c){return gn=c,dt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,B.H=t===null||t.memoizedState===null?ym:xu,Sa=!1,c=a(l,o),Sa=!1,ni&&(c=Bh(e,a,l,o)),Vh(t),c}function Vh(t){B.H=nl;var e=Mt!==null&&Mt.next!==null;if(gn=0,Qt=Mt=dt=null,As=!1,Ii=0,ai=null,e)throw Error(r(300));t===null||Zt||(t=t.dependencies,t!==null&&ys(t)&&(Zt=!0))}function Bh(t,e,a,l){dt=t;var o=0;do{if(ni&&(ai=null),Ii=0,ni=!1,25<=o)throw Error(r(301));if(o+=1,Qt=Mt=null,t.updateQueue!=null){var c=t.updateQueue;c.lastEffect=null,c.events=null,c.stores=null,c.memoCache!=null&&(c.memoCache.index=0)}B.H=xm,c=e(a,l)}while(ni);return c}function Rv(){var t=B.H,e=t.useState()[0];return e=typeof e.then=="function"?tl(e):e,t=t.useState()[0],(Mt!==null?Mt.memoizedState:null)!==t&&(dt.flags|=1024),e}function iu(){var t=Cs!==0;return Cs=0,t}function lu(t,e,a){e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~a}function su(t){if(As){for(t=t.memoizedState;t!==null;){var e=t.queue;e!==null&&(e.pending=null),t=t.next}As=!1}gn=0,Qt=Mt=dt=null,ni=!1,Ii=Cs=0,ai=null}function ue(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Qt===null?dt.memoizedState=Qt=t:Qt=Qt.next=t,Qt}function Xt(){if(Mt===null){var t=dt.alternate;t=t!==null?t.memoizedState:null}else t=Mt.next;var e=Qt===null?dt.memoizedState:Qt.next;if(e!==null)Qt=e,Mt=t;else{if(t===null)throw dt.alternate===null?Error(r(467)):Error(r(310));Mt=t,t={memoizedState:Mt.memoizedState,baseState:Mt.baseState,baseQueue:Mt.baseQueue,queue:Mt.queue,next:null},Qt===null?dt.memoizedState=Qt=t:Qt=Qt.next=t}return Qt}function Ns(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function tl(t){var e=Ii;return Ii+=1,ai===null&&(ai=[]),t=Ah(ai,t,e),e=dt,(Qt===null?e.memoizedState:Qt.next)===null&&(e=e.alternate,B.H=e===null||e.memoizedState===null?ym:xu),t}function Ms(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return tl(t);if(t.$$typeof===z)return ne(t)}throw Error(r(438,String(t)))}function ru(t){var e=null,a=dt.updateQueue;if(a!==null&&(e=a.memoCache),e==null){var l=dt.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(e={data:l.data.map(function(o){return o.slice()}),index:0})))}if(e==null&&(e={data:[],index:0}),a===null&&(a=Ns(),dt.updateQueue=a),a.memoCache=e,a=e.data[e.index],a===void 0)for(a=e.data[e.index]=Array(t),l=0;l<t;l++)a[l]=P;return e.index++,a}function yn(t,e){return typeof e=="function"?e(t):e}function Rs(t){var e=Xt();return ou(e,Mt,t)}function ou(t,e,a){var l=t.queue;if(l===null)throw Error(r(311));l.lastRenderedReducer=a;var o=t.baseQueue,c=l.pending;if(c!==null){if(o!==null){var y=o.next;o.next=c.next,c.next=y}e.baseQueue=o=c,l.pending=null}if(c=t.baseState,o===null)t.memoizedState=c;else{e=o.next;var S=y=null,w=null,k=e,H=!1;do{var q=k.lane&-536870913;if(q!==k.lane?(vt&q)===q:(gn&q)===q){var V=k.revertLane;if(V===0)w!==null&&(w=w.next={lane:0,revertLane:0,gesture:null,action:k.action,hasEagerState:k.hasEagerState,eagerState:k.eagerState,next:null}),q===$a&&(H=!0);else if((gn&V)===V){k=k.next,V===$a&&(H=!0);continue}else q={lane:0,revertLane:k.revertLane,gesture:null,action:k.action,hasEagerState:k.hasEagerState,eagerState:k.eagerState,next:null},w===null?(S=w=q,y=c):w=w.next=q,dt.lanes|=V,qn|=V;q=k.action,Sa&&a(c,q),c=k.hasEagerState?k.eagerState:a(c,q)}else V={lane:q,revertLane:k.revertLane,gesture:k.gesture,action:k.action,hasEagerState:k.hasEagerState,eagerState:k.eagerState,next:null},w===null?(S=w=V,y=c):w=w.next=V,dt.lanes|=q,qn|=q;k=k.next}while(k!==null&&k!==e);if(w===null?y=c:w.next=S,!je(c,t.memoizedState)&&(Zt=!0,H&&(a=Wa,a!==null)))throw a;t.memoizedState=c,t.baseState=y,t.baseQueue=w,l.lastRenderedState=c}return o===null&&(l.lanes=0),[t.memoizedState,l.dispatch]}function uu(t){var e=Xt(),a=e.queue;if(a===null)throw Error(r(311));a.lastRenderedReducer=t;var l=a.dispatch,o=a.pending,c=e.memoizedState;if(o!==null){a.pending=null;var y=o=o.next;do c=t(c,y.action),y=y.next;while(y!==o);je(c,e.memoizedState)||(Zt=!0),e.memoizedState=c,e.baseQueue===null&&(e.baseState=c),a.lastRenderedState=c}return[c,l]}function _h(t,e,a){var l=dt,o=Xt(),c=jt;if(c){if(a===void 0)throw Error(r(407));a=a()}else a=e();var y=!je((Mt||o).memoizedState,a);if(y&&(o.memoizedState=a,Zt=!0),o=o.queue,du(Hh.bind(null,l,o,t),[t]),o.getSnapshot!==e||y||Qt!==null&&Qt.memoizedState.tag&1){if(l.flags|=2048,ii(9,{destroy:void 0},Uh.bind(null,l,o,a,e),null),zt===null)throw Error(r(349));c||(gn&127)!==0||Lh(l,e,a)}return a}function Lh(t,e,a){t.flags|=16384,t={getSnapshot:e,value:a},e=dt.updateQueue,e===null?(e=Ns(),dt.updateQueue=e,e.stores=[t]):(a=e.stores,a===null?e.stores=[t]:a.push(t))}function Uh(t,e,a,l){e.value=a,e.getSnapshot=l,Gh(e)&&Yh(t)}function Hh(t,e,a){return a(function(){Gh(e)&&Yh(t)})}function Gh(t){var e=t.getSnapshot;t=t.value;try{var a=e();return!je(t,a)}catch{return!0}}function Yh(t){var e=da(t,2);e!==null&&xe(e,t,2)}function cu(t){var e=ue();if(typeof t=="function"){var a=t;if(t=a(),Sa){Mn(!0);try{a()}finally{Mn(!1)}}}return e.memoizedState=e.baseState=t,e.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:t},e}function qh(t,e,a,l){return t.baseState=a,ou(t,Mt,typeof l=="function"?l:yn)}function Dv(t,e,a,l,o){if(Os(t))throw Error(r(485));if(t=e.action,t!==null){var c={payload:o,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(y){c.listeners.push(y)}};B.T!==null?a(!0):c.isTransition=!1,l(c),a=e.pending,a===null?(c.next=e.pending=c,Xh(e,c)):(c.next=a.next,e.pending=a.next=c)}}function Xh(t,e){var a=e.action,l=e.payload,o=t.state;if(e.isTransition){var c=B.T,y={};B.T=y;try{var S=a(o,l),w=B.S;w!==null&&w(y,S),Kh(t,e,S)}catch(k){fu(t,e,k)}finally{c!==null&&y.types!==null&&(c.types=y.types),B.T=c}}else try{c=a(o,l),Kh(t,e,c)}catch(k){fu(t,e,k)}}function Kh(t,e,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(l){Qh(t,e,l)},function(l){return fu(t,e,l)}):Qh(t,e,a)}function Qh(t,e,a){e.status="fulfilled",e.value=a,Zh(e),t.state=a,e=t.pending,e!==null&&(a=e.next,a===e?t.pending=null:(a=a.next,e.next=a,Xh(t,a)))}function fu(t,e,a){var l=t.pending;if(t.pending=null,l!==null){l=l.next;do e.status="rejected",e.reason=a,Zh(e),e=e.next;while(e!==l)}t.action=null}function Zh(t){t=t.listeners;for(var e=0;e<t.length;e++)(0,t[e])()}function Fh(t,e){return e}function Jh(t,e){if(jt){var a=zt.formState;if(a!==null){t:{var l=dt;if(jt){if(Vt){e:{for(var o=Vt,c=Be;o.nodeType!==8;){if(!c){o=null;break e}if(o=Le(o.nextSibling),o===null){o=null;break e}}c=o.data,o=c==="F!"||c==="F"?o:null}if(o){Vt=Le(o.nextSibling),l=o.data==="F!";break t}}kn(l)}l=!1}l&&(e=a[0])}}return a=ue(),a.memoizedState=a.baseState=e,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Fh,lastRenderedState:e},a.queue=l,a=mm.bind(null,dt,l),l.dispatch=a,l=cu(!1),c=yu.bind(null,dt,!1,l.queue),l=ue(),o={state:e,dispatch:null,action:t,pending:null},l.queue=o,a=Dv.bind(null,dt,o,c,a),o.dispatch=a,l.memoizedState=t,[e,a,!1]}function Ph(t){var e=Xt();return $h(e,Mt,t)}function $h(t,e,a){if(e=ou(t,e,Fh)[0],t=Rs(yn)[0],typeof e=="object"&&e!==null&&typeof e.then=="function")try{var l=tl(e)}catch(y){throw y===Ia?vs:y}else l=e;e=Xt();var o=e.queue,c=o.dispatch;return a!==e.memoizedState&&(dt.flags|=2048,ii(9,{destroy:void 0},zv.bind(null,o,a),null)),[l,c,t]}function zv(t,e){t.action=e}function Wh(t){var e=Xt(),a=Mt;if(a!==null)return $h(e,a,t);Xt(),e=e.memoizedState,a=Xt();var l=a.queue.dispatch;return a.memoizedState=t,[e,l,!1]}function ii(t,e,a,l){return t={tag:t,create:a,deps:l,inst:e,next:null},e=dt.updateQueue,e===null&&(e=Ns(),dt.updateQueue=e),a=e.lastEffect,a===null?e.lastEffect=t.next=t:(l=a.next,a.next=t,t.next=l,e.lastEffect=t),t}function Ih(){return Xt().memoizedState}function Ds(t,e,a,l){var o=ue();dt.flags|=t,o.memoizedState=ii(1|e,{destroy:void 0},a,l===void 0?null:l)}function zs(t,e,a,l){var o=Xt();l=l===void 0?null:l;var c=o.memoizedState.inst;Mt!==null&&l!==null&&nu(l,Mt.memoizedState.deps)?o.memoizedState=ii(e,c,a,l):(dt.flags|=t,o.memoizedState=ii(1|e,c,a,l))}function tm(t,e){Ds(8390656,8,t,e)}function du(t,e){zs(2048,8,t,e)}function Ov(t){dt.flags|=4;var e=dt.updateQueue;if(e===null)e=Ns(),dt.updateQueue=e,e.events=[t];else{var a=e.events;a===null?e.events=[t]:a.push(t)}}function em(t){var e=Xt().memoizedState;return Ov({ref:e,nextImpl:t}),function(){if((wt&2)!==0)throw Error(r(440));return e.impl.apply(void 0,arguments)}}function nm(t,e){return zs(4,2,t,e)}function am(t,e){return zs(4,4,t,e)}function im(t,e){if(typeof e=="function"){t=t();var a=e(t);return function(){typeof a=="function"?a():e(null)}}if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function lm(t,e,a){a=a!=null?a.concat([t]):null,zs(4,4,im.bind(null,e,t),a)}function hu(){}function sm(t,e){var a=Xt();e=e===void 0?null:e;var l=a.memoizedState;return e!==null&&nu(e,l[1])?l[0]:(a.memoizedState=[t,e],t)}function rm(t,e){var a=Xt();e=e===void 0?null:e;var l=a.memoizedState;if(e!==null&&nu(e,l[1]))return l[0];if(l=t(),Sa){Mn(!0);try{t()}finally{Mn(!1)}}return a.memoizedState=[l,e],l}function mu(t,e,a){return a===void 0||(gn&1073741824)!==0&&(vt&261930)===0?t.memoizedState=e:(t.memoizedState=a,t=op(),dt.lanes|=t,qn|=t,a)}function om(t,e,a,l){return je(a,e)?a:ei.current!==null?(t=mu(t,a,l),je(t,e)||(Zt=!0),t):(gn&42)===0||(gn&1073741824)!==0&&(vt&261930)===0?(Zt=!0,t.memoizedState=a):(t=op(),dt.lanes|=t,qn|=t,e)}function um(t,e,a,l,o){var c=Z.p;Z.p=c!==0&&8>c?c:8;var y=B.T,S={};B.T=S,yu(t,!1,e,a);try{var w=o(),k=B.S;if(k!==null&&k(S,w),w!==null&&typeof w=="object"&&typeof w.then=="function"){var H=Nv(w,l);el(t,e,H,Ne(t))}else el(t,e,l,Ne(t))}catch(q){el(t,e,{then:function(){},status:"rejected",reason:q},Ne())}finally{Z.p=c,y!==null&&S.types!==null&&(y.types=S.types),B.T=y}}function kv(){}function pu(t,e,a,l){if(t.tag!==5)throw Error(r(476));var o=cm(t).queue;um(t,o,e,J,a===null?kv:function(){return fm(t),a(l)})}function cm(t){var e=t.memoizedState;if(e!==null)return e;e={memoizedState:J,baseState:J,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:J},next:null};var a={};return e.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:a},next:null},t.memoizedState=e,t=t.alternate,t!==null&&(t.memoizedState=e),e}function fm(t){var e=cm(t);e.next===null&&(e=t.alternate.memoizedState),el(t,e.next.queue,{},Ne())}function gu(){return ne(xl)}function dm(){return Xt().memoizedState}function hm(){return Xt().memoizedState}function Vv(t){for(var e=t.return;e!==null;){switch(e.tag){case 24:case 3:var a=Ne();t=_n(a);var l=Ln(e,t,a);l!==null&&(xe(l,e,a),Pi(l,e,a)),e={cache:Ko()},t.payload=e;return}e=e.return}}function Bv(t,e,a){var l=Ne();a={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Os(t)?pm(e,a):(a=ko(t,e,a,l),a!==null&&(xe(a,t,l),gm(a,e,l)))}function mm(t,e,a){var l=Ne();el(t,e,a,l)}function el(t,e,a,l){var o={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Os(t))pm(e,o);else{var c=t.alternate;if(t.lanes===0&&(c===null||c.lanes===0)&&(c=e.lastRenderedReducer,c!==null))try{var y=e.lastRenderedState,S=c(y,a);if(o.hasEagerState=!0,o.eagerState=S,je(S,y))return hs(t,e,o,0),zt===null&&ds(),!1}catch{}finally{}if(a=ko(t,e,o,l),a!==null)return xe(a,t,l),gm(a,e,l),!0}return!1}function yu(t,e,a,l){if(l={lane:2,revertLane:Ju(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Os(t)){if(e)throw Error(r(479))}else e=ko(t,a,l,2),e!==null&&xe(e,t,2)}function Os(t){var e=t.alternate;return t===dt||e!==null&&e===dt}function pm(t,e){ni=As=!0;var a=t.pending;a===null?e.next=e:(e.next=a.next,a.next=e),t.pending=e}function gm(t,e,a){if((a&4194048)!==0){var l=e.lanes;l&=t.pendingLanes,a|=l,e.lanes=a,Sd(t,a)}}var nl={readContext:ne,use:Ms,useCallback:Ut,useContext:Ut,useEffect:Ut,useImperativeHandle:Ut,useLayoutEffect:Ut,useInsertionEffect:Ut,useMemo:Ut,useReducer:Ut,useRef:Ut,useState:Ut,useDebugValue:Ut,useDeferredValue:Ut,useTransition:Ut,useSyncExternalStore:Ut,useId:Ut,useHostTransitionStatus:Ut,useFormState:Ut,useActionState:Ut,useOptimistic:Ut,useMemoCache:Ut,useCacheRefresh:Ut};nl.useEffectEvent=Ut;var ym={readContext:ne,use:Ms,useCallback:function(t,e){return ue().memoizedState=[t,e===void 0?null:e],t},useContext:ne,useEffect:tm,useImperativeHandle:function(t,e,a){a=a!=null?a.concat([t]):null,Ds(4194308,4,im.bind(null,e,t),a)},useLayoutEffect:function(t,e){return Ds(4194308,4,t,e)},useInsertionEffect:function(t,e){Ds(4,2,t,e)},useMemo:function(t,e){var a=ue();e=e===void 0?null:e;var l=t();if(Sa){Mn(!0);try{t()}finally{Mn(!1)}}return a.memoizedState=[l,e],l},useReducer:function(t,e,a){var l=ue();if(a!==void 0){var o=a(e);if(Sa){Mn(!0);try{a(e)}finally{Mn(!1)}}}else o=e;return l.memoizedState=l.baseState=o,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:o},l.queue=t,t=t.dispatch=Bv.bind(null,dt,t),[l.memoizedState,t]},useRef:function(t){var e=ue();return t={current:t},e.memoizedState=t},useState:function(t){t=cu(t);var e=t.queue,a=mm.bind(null,dt,e);return e.dispatch=a,[t.memoizedState,a]},useDebugValue:hu,useDeferredValue:function(t,e){var a=ue();return mu(a,t,e)},useTransition:function(){var t=cu(!1);return t=um.bind(null,dt,t.queue,!0,!1),ue().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,e,a){var l=dt,o=ue();if(jt){if(a===void 0)throw Error(r(407));a=a()}else{if(a=e(),zt===null)throw Error(r(349));(vt&127)!==0||Lh(l,e,a)}o.memoizedState=a;var c={value:a,getSnapshot:e};return o.queue=c,tm(Hh.bind(null,l,c,t),[t]),l.flags|=2048,ii(9,{destroy:void 0},Uh.bind(null,l,c,a,e),null),a},useId:function(){var t=ue(),e=zt.identifierPrefix;if(jt){var a=$e,l=Pe;a=(l&~(1<<32-Se(l)-1)).toString(32)+a,e="_"+e+"R_"+a,a=Cs++,0<a&&(e+="H"+a.toString(32)),e+="_"}else a=Mv++,e="_"+e+"r_"+a.toString(32)+"_";return t.memoizedState=e},useHostTransitionStatus:gu,useFormState:Jh,useActionState:Jh,useOptimistic:function(t){var e=ue();e.memoizedState=e.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return e.queue=a,e=yu.bind(null,dt,!0,a),a.dispatch=e,[t,e]},useMemoCache:ru,useCacheRefresh:function(){return ue().memoizedState=Vv.bind(null,dt)},useEffectEvent:function(t){var e=ue(),a={impl:t};return e.memoizedState=a,function(){if((wt&2)!==0)throw Error(r(440));return a.impl.apply(void 0,arguments)}}},xu={readContext:ne,use:Ms,useCallback:sm,useContext:ne,useEffect:du,useImperativeHandle:lm,useInsertionEffect:nm,useLayoutEffect:am,useMemo:rm,useReducer:Rs,useRef:Ih,useState:function(){return Rs(yn)},useDebugValue:hu,useDeferredValue:function(t,e){var a=Xt();return om(a,Mt.memoizedState,t,e)},useTransition:function(){var t=Rs(yn)[0],e=Xt().memoizedState;return[typeof t=="boolean"?t:tl(t),e]},useSyncExternalStore:_h,useId:dm,useHostTransitionStatus:gu,useFormState:Ph,useActionState:Ph,useOptimistic:function(t,e){var a=Xt();return qh(a,Mt,t,e)},useMemoCache:ru,useCacheRefresh:hm};xu.useEffectEvent=em;var xm={readContext:ne,use:Ms,useCallback:sm,useContext:ne,useEffect:du,useImperativeHandle:lm,useInsertionEffect:nm,useLayoutEffect:am,useMemo:rm,useReducer:uu,useRef:Ih,useState:function(){return uu(yn)},useDebugValue:hu,useDeferredValue:function(t,e){var a=Xt();return Mt===null?mu(a,t,e):om(a,Mt.memoizedState,t,e)},useTransition:function(){var t=uu(yn)[0],e=Xt().memoizedState;return[typeof t=="boolean"?t:tl(t),e]},useSyncExternalStore:_h,useId:dm,useHostTransitionStatus:gu,useFormState:Wh,useActionState:Wh,useOptimistic:function(t,e){var a=Xt();return Mt!==null?qh(a,Mt,t,e):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:ru,useCacheRefresh:hm};xm.useEffectEvent=em;function bu(t,e,a,l){e=t.memoizedState,a=a(l,e),a=a==null?e:b({},e,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var vu={enqueueSetState:function(t,e,a){t=t._reactInternals;var l=Ne(),o=_n(l);o.payload=e,a!=null&&(o.callback=a),e=Ln(t,o,l),e!==null&&(xe(e,t,l),Pi(e,t,l))},enqueueReplaceState:function(t,e,a){t=t._reactInternals;var l=Ne(),o=_n(l);o.tag=1,o.payload=e,a!=null&&(o.callback=a),e=Ln(t,o,l),e!==null&&(xe(e,t,l),Pi(e,t,l))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var a=Ne(),l=_n(a);l.tag=2,e!=null&&(l.callback=e),e=Ln(t,l,a),e!==null&&(xe(e,t,a),Pi(e,t,a))}};function bm(t,e,a,l,o,c,y){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(l,c,y):e.prototype&&e.prototype.isPureReactComponent?!Yi(a,l)||!Yi(o,c):!0}function vm(t,e,a,l){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(a,l),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(a,l),e.state!==t&&vu.enqueueReplaceState(e,e.state,null)}function ja(t,e){var a=e;if("ref"in e){a={};for(var l in e)l!=="ref"&&(a[l]=e[l])}if(t=t.defaultProps){a===e&&(a=b({},a));for(var o in t)a[o]===void 0&&(a[o]=t[o])}return a}function Sm(t){fs(t)}function jm(t){console.error(t)}function Tm(t){fs(t)}function ks(t,e){try{var a=t.onUncaughtError;a(e.value,{componentStack:e.stack})}catch(l){setTimeout(function(){throw l})}}function Em(t,e,a){try{var l=t.onCaughtError;l(a.value,{componentStack:a.stack,errorBoundary:e.tag===1?e.stateNode:null})}catch(o){setTimeout(function(){throw o})}}function Su(t,e,a){return a=_n(a),a.tag=3,a.payload={element:null},a.callback=function(){ks(t,e)},a}function wm(t){return t=_n(t),t.tag=3,t}function Am(t,e,a,l){var o=a.type.getDerivedStateFromError;if(typeof o=="function"){var c=l.value;t.payload=function(){return o(c)},t.callback=function(){Em(e,a,l)}}var y=a.stateNode;y!==null&&typeof y.componentDidCatch=="function"&&(t.callback=function(){Em(e,a,l),typeof o!="function"&&(Xn===null?Xn=new Set([this]):Xn.add(this));var S=l.stack;this.componentDidCatch(l.value,{componentStack:S!==null?S:""})})}function _v(t,e,a,l,o){if(a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(e=a.alternate,e!==null&&Pa(e,a,o,!0),a=Ee.current,a!==null){switch(a.tag){case 31:case 13:return _e===null?Qs():a.alternate===null&&Ht===0&&(Ht=3),a.flags&=-257,a.flags|=65536,a.lanes=o,l===Ss?a.flags|=16384:(e=a.updateQueue,e===null?a.updateQueue=new Set([l]):e.add(l),Qu(t,l,o)),!1;case 22:return a.flags|=65536,l===Ss?a.flags|=16384:(e=a.updateQueue,e===null?(e={transitions:null,markerInstances:null,retryQueue:new Set([l])},a.updateQueue=e):(a=e.retryQueue,a===null?e.retryQueue=new Set([l]):a.add(l)),Qu(t,l,o)),!1}throw Error(r(435,a.tag))}return Qu(t,l,o),Qs(),!1}if(jt)return e=Ee.current,e!==null?((e.flags&65536)===0&&(e.flags|=256),e.flags|=65536,e.lanes=o,l!==Ho&&(t=Error(r(422),{cause:l}),Ki(Oe(t,a)))):(l!==Ho&&(e=Error(r(423),{cause:l}),Ki(Oe(e,a))),t=t.current.alternate,t.flags|=65536,o&=-o,t.lanes|=o,l=Oe(l,a),o=Su(t.stateNode,l,o),$o(t,o),Ht!==4&&(Ht=2)),!1;var c=Error(r(520),{cause:l});if(c=Oe(c,a),cl===null?cl=[c]:cl.push(c),Ht!==4&&(Ht=2),e===null)return!0;l=Oe(l,a),a=e;do{switch(a.tag){case 3:return a.flags|=65536,t=o&-o,a.lanes|=t,t=Su(a.stateNode,l,t),$o(a,t),!1;case 1:if(e=a.type,c=a.stateNode,(a.flags&128)===0&&(typeof e.getDerivedStateFromError=="function"||c!==null&&typeof c.componentDidCatch=="function"&&(Xn===null||!Xn.has(c))))return a.flags|=65536,o&=-o,a.lanes|=o,o=wm(o),Am(o,t,a,l),$o(a,o),!1}a=a.return}while(a!==null);return!1}var ju=Error(r(461)),Zt=!1;function ae(t,e,a,l){e.child=t===null?Rh(e,null,a,l):va(e,t.child,a,l)}function Cm(t,e,a,l,o){a=a.render;var c=e.ref;if("ref"in l){var y={};for(var S in l)S!=="ref"&&(y[S]=l[S])}else y=l;return ga(e),l=au(t,e,a,y,c,o),S=iu(),t!==null&&!Zt?(lu(t,e,o),xn(t,e,o)):(jt&&S&&Lo(e),e.flags|=1,ae(t,e,l,o),e.child)}function Nm(t,e,a,l,o){if(t===null){var c=a.type;return typeof c=="function"&&!Vo(c)&&c.defaultProps===void 0&&a.compare===null?(e.tag=15,e.type=c,Mm(t,e,c,l,o)):(t=ps(a.type,null,l,e,e.mode,o),t.ref=e.ref,t.return=e,e.child=t)}if(c=t.child,!Ru(t,o)){var y=c.memoizedProps;if(a=a.compare,a=a!==null?a:Yi,a(y,l)&&t.ref===e.ref)return xn(t,e,o)}return e.flags|=1,t=dn(c,l),t.ref=e.ref,t.return=e,e.child=t}function Mm(t,e,a,l,o){if(t!==null){var c=t.memoizedProps;if(Yi(c,l)&&t.ref===e.ref)if(Zt=!1,e.pendingProps=l=c,Ru(t,o))(t.flags&131072)!==0&&(Zt=!0);else return e.lanes=t.lanes,xn(t,e,o)}return Tu(t,e,a,l,o)}function Rm(t,e,a,l){var o=l.children,c=t!==null?t.memoizedState:null;if(t===null&&e.stateNode===null&&(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((e.flags&128)!==0){if(c=c!==null?c.baseLanes|a:a,t!==null){for(l=e.child=t.child,o=0;l!==null;)o=o|l.lanes|l.childLanes,l=l.sibling;l=o&~c}else l=0,e.child=null;return Dm(t,e,c,a,l)}if((a&536870912)!==0)e.memoizedState={baseLanes:0,cachePool:null},t!==null&&bs(e,c!==null?c.cachePool:null),c!==null?Oh(e,c):Io(),kh(e);else return l=e.lanes=536870912,Dm(t,e,c!==null?c.baseLanes|a:a,a,l)}else c!==null?(bs(e,c.cachePool),Oh(e,c),Hn(),e.memoizedState=null):(t!==null&&bs(e,null),Io(),Hn());return ae(t,e,o,a),e.child}function al(t,e){return t!==null&&t.tag===22||e.stateNode!==null||(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),e.sibling}function Dm(t,e,a,l,o){var c=Zo();return c=c===null?null:{parent:Kt._currentValue,pool:c},e.memoizedState={baseLanes:a,cachePool:c},t!==null&&bs(e,null),Io(),kh(e),t!==null&&Pa(t,e,l,!0),e.childLanes=o,null}function Vs(t,e){return e=_s({mode:e.mode,children:e.children},t.mode),e.ref=t.ref,t.child=e,e.return=t,e}function zm(t,e,a){return va(e,t.child,null,a),t=Vs(e,e.pendingProps),t.flags|=2,we(e),e.memoizedState=null,t}function Lv(t,e,a){var l=e.pendingProps,o=(e.flags&128)!==0;if(e.flags&=-129,t===null){if(jt){if(l.mode==="hidden")return t=Vs(e,l),e.lanes=536870912,al(null,t);if(eu(e),(t=Vt)?(t=Xp(t,Be),t=t!==null&&t.data==="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:zn!==null?{id:Pe,overflow:$e}:null,retryLane:536870912,hydrationErrors:null},a=ph(t),a.return=e,e.child=a,ee=e,Vt=null)):t=null,t===null)throw kn(e);return e.lanes=536870912,null}return Vs(e,l)}var c=t.memoizedState;if(c!==null){var y=c.dehydrated;if(eu(e),o)if(e.flags&256)e.flags&=-257,e=zm(t,e,a);else if(e.memoizedState!==null)e.child=t.child,e.flags|=128,e=null;else throw Error(r(558));else if(Zt||Pa(t,e,a,!1),o=(a&t.childLanes)!==0,Zt||o){if(l=zt,l!==null&&(y=jd(l,a),y!==0&&y!==c.retryLane))throw c.retryLane=y,da(t,y),xe(l,t,y),ju;Qs(),e=zm(t,e,a)}else t=c.treeContext,Vt=Le(y.nextSibling),ee=e,jt=!0,On=null,Be=!1,t!==null&&xh(e,t),e=Vs(e,l),e.flags|=4096;return e}return t=dn(t.child,{mode:l.mode,children:l.children}),t.ref=e.ref,e.child=t,t.return=e,t}function Bs(t,e){var a=e.ref;if(a===null)t!==null&&t.ref!==null&&(e.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(r(284));(t===null||t.ref!==a)&&(e.flags|=4194816)}}function Tu(t,e,a,l,o){return ga(e),a=au(t,e,a,l,void 0,o),l=iu(),t!==null&&!Zt?(lu(t,e,o),xn(t,e,o)):(jt&&l&&Lo(e),e.flags|=1,ae(t,e,a,o),e.child)}function Om(t,e,a,l,o,c){return ga(e),e.updateQueue=null,a=Bh(e,l,a,o),Vh(t),l=iu(),t!==null&&!Zt?(lu(t,e,c),xn(t,e,c)):(jt&&l&&Lo(e),e.flags|=1,ae(t,e,a,c),e.child)}function km(t,e,a,l,o){if(ga(e),e.stateNode===null){var c=Qa,y=a.contextType;typeof y=="object"&&y!==null&&(c=ne(y)),c=new a(l,c),e.memoizedState=c.state!==null&&c.state!==void 0?c.state:null,c.updater=vu,e.stateNode=c,c._reactInternals=e,c=e.stateNode,c.props=l,c.state=e.memoizedState,c.refs={},Jo(e),y=a.contextType,c.context=typeof y=="object"&&y!==null?ne(y):Qa,c.state=e.memoizedState,y=a.getDerivedStateFromProps,typeof y=="function"&&(bu(e,a,y,l),c.state=e.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof c.getSnapshotBeforeUpdate=="function"||typeof c.UNSAFE_componentWillMount!="function"&&typeof c.componentWillMount!="function"||(y=c.state,typeof c.componentWillMount=="function"&&c.componentWillMount(),typeof c.UNSAFE_componentWillMount=="function"&&c.UNSAFE_componentWillMount(),y!==c.state&&vu.enqueueReplaceState(c,c.state,null),Wi(e,l,c,o),$i(),c.state=e.memoizedState),typeof c.componentDidMount=="function"&&(e.flags|=4194308),l=!0}else if(t===null){c=e.stateNode;var S=e.memoizedProps,w=ja(a,S);c.props=w;var k=c.context,H=a.contextType;y=Qa,typeof H=="object"&&H!==null&&(y=ne(H));var q=a.getDerivedStateFromProps;H=typeof q=="function"||typeof c.getSnapshotBeforeUpdate=="function",S=e.pendingProps!==S,H||typeof c.UNSAFE_componentWillReceiveProps!="function"&&typeof c.componentWillReceiveProps!="function"||(S||k!==y)&&vm(e,c,l,y),Bn=!1;var V=e.memoizedState;c.state=V,Wi(e,l,c,o),$i(),k=e.memoizedState,S||V!==k||Bn?(typeof q=="function"&&(bu(e,a,q,l),k=e.memoizedState),(w=Bn||bm(e,a,w,l,V,k,y))?(H||typeof c.UNSAFE_componentWillMount!="function"&&typeof c.componentWillMount!="function"||(typeof c.componentWillMount=="function"&&c.componentWillMount(),typeof c.UNSAFE_componentWillMount=="function"&&c.UNSAFE_componentWillMount()),typeof c.componentDidMount=="function"&&(e.flags|=4194308)):(typeof c.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=l,e.memoizedState=k),c.props=l,c.state=k,c.context=y,l=w):(typeof c.componentDidMount=="function"&&(e.flags|=4194308),l=!1)}else{c=e.stateNode,Po(t,e),y=e.memoizedProps,H=ja(a,y),c.props=H,q=e.pendingProps,V=c.context,k=a.contextType,w=Qa,typeof k=="object"&&k!==null&&(w=ne(k)),S=a.getDerivedStateFromProps,(k=typeof S=="function"||typeof c.getSnapshotBeforeUpdate=="function")||typeof c.UNSAFE_componentWillReceiveProps!="function"&&typeof c.componentWillReceiveProps!="function"||(y!==q||V!==w)&&vm(e,c,l,w),Bn=!1,V=e.memoizedState,c.state=V,Wi(e,l,c,o),$i();var L=e.memoizedState;y!==q||V!==L||Bn||t!==null&&t.dependencies!==null&&ys(t.dependencies)?(typeof S=="function"&&(bu(e,a,S,l),L=e.memoizedState),(H=Bn||bm(e,a,H,l,V,L,w)||t!==null&&t.dependencies!==null&&ys(t.dependencies))?(k||typeof c.UNSAFE_componentWillUpdate!="function"&&typeof c.componentWillUpdate!="function"||(typeof c.componentWillUpdate=="function"&&c.componentWillUpdate(l,L,w),typeof c.UNSAFE_componentWillUpdate=="function"&&c.UNSAFE_componentWillUpdate(l,L,w)),typeof c.componentDidUpdate=="function"&&(e.flags|=4),typeof c.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof c.componentDidUpdate!="function"||y===t.memoizedProps&&V===t.memoizedState||(e.flags|=4),typeof c.getSnapshotBeforeUpdate!="function"||y===t.memoizedProps&&V===t.memoizedState||(e.flags|=1024),e.memoizedProps=l,e.memoizedState=L),c.props=l,c.state=L,c.context=w,l=H):(typeof c.componentDidUpdate!="function"||y===t.memoizedProps&&V===t.memoizedState||(e.flags|=4),typeof c.getSnapshotBeforeUpdate!="function"||y===t.memoizedProps&&V===t.memoizedState||(e.flags|=1024),l=!1)}return c=l,Bs(t,e),l=(e.flags&128)!==0,c||l?(c=e.stateNode,a=l&&typeof a.getDerivedStateFromError!="function"?null:c.render(),e.flags|=1,t!==null&&l?(e.child=va(e,t.child,null,o),e.child=va(e,null,a,o)):ae(t,e,a,o),e.memoizedState=c.state,t=e.child):t=xn(t,e,o),t}function Vm(t,e,a,l){return ma(),e.flags|=256,ae(t,e,a,l),e.child}var Eu={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function wu(t){return{baseLanes:t,cachePool:Eh()}}function Au(t,e,a){return t=t!==null?t.childLanes&~a:0,e&&(t|=Ce),t}function Bm(t,e,a){var l=e.pendingProps,o=!1,c=(e.flags&128)!==0,y;if((y=c)||(y=t!==null&&t.memoizedState===null?!1:(qt.current&2)!==0),y&&(o=!0,e.flags&=-129),y=(e.flags&32)!==0,e.flags&=-33,t===null){if(jt){if(o?Un(e):Hn(),(t=Vt)?(t=Xp(t,Be),t=t!==null&&t.data!=="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:zn!==null?{id:Pe,overflow:$e}:null,retryLane:536870912,hydrationErrors:null},a=ph(t),a.return=e,e.child=a,ee=e,Vt=null)):t=null,t===null)throw kn(e);return oc(t)?e.lanes=32:e.lanes=536870912,null}var S=l.children;return l=l.fallback,o?(Hn(),o=e.mode,S=_s({mode:"hidden",children:S},o),l=ha(l,o,a,null),S.return=e,l.return=e,S.sibling=l,e.child=S,l=e.child,l.memoizedState=wu(a),l.childLanes=Au(t,y,a),e.memoizedState=Eu,al(null,l)):(Un(e),Cu(e,S))}var w=t.memoizedState;if(w!==null&&(S=w.dehydrated,S!==null)){if(c)e.flags&256?(Un(e),e.flags&=-257,e=Nu(t,e,a)):e.memoizedState!==null?(Hn(),e.child=t.child,e.flags|=128,e=null):(Hn(),S=l.fallback,o=e.mode,l=_s({mode:"visible",children:l.children},o),S=ha(S,o,a,null),S.flags|=2,l.return=e,S.return=e,l.sibling=S,e.child=l,va(e,t.child,null,a),l=e.child,l.memoizedState=wu(a),l.childLanes=Au(t,y,a),e.memoizedState=Eu,e=al(null,l));else if(Un(e),oc(S)){if(y=S.nextSibling&&S.nextSibling.dataset,y)var k=y.dgst;y=k,l=Error(r(419)),l.stack="",l.digest=y,Ki({value:l,source:null,stack:null}),e=Nu(t,e,a)}else if(Zt||Pa(t,e,a,!1),y=(a&t.childLanes)!==0,Zt||y){if(y=zt,y!==null&&(l=jd(y,a),l!==0&&l!==w.retryLane))throw w.retryLane=l,da(t,l),xe(y,t,l),ju;rc(S)||Qs(),e=Nu(t,e,a)}else rc(S)?(e.flags|=192,e.child=t.child,e=null):(t=w.treeContext,Vt=Le(S.nextSibling),ee=e,jt=!0,On=null,Be=!1,t!==null&&xh(e,t),e=Cu(e,l.children),e.flags|=4096);return e}return o?(Hn(),S=l.fallback,o=e.mode,w=t.child,k=w.sibling,l=dn(w,{mode:"hidden",children:l.children}),l.subtreeFlags=w.subtreeFlags&65011712,k!==null?S=dn(k,S):(S=ha(S,o,a,null),S.flags|=2),S.return=e,l.return=e,l.sibling=S,e.child=l,al(null,l),l=e.child,S=t.child.memoizedState,S===null?S=wu(a):(o=S.cachePool,o!==null?(w=Kt._currentValue,o=o.parent!==w?{parent:w,pool:w}:o):o=Eh(),S={baseLanes:S.baseLanes|a,cachePool:o}),l.memoizedState=S,l.childLanes=Au(t,y,a),e.memoizedState=Eu,al(t.child,l)):(Un(e),a=t.child,t=a.sibling,a=dn(a,{mode:"visible",children:l.children}),a.return=e,a.sibling=null,t!==null&&(y=e.deletions,y===null?(e.deletions=[t],e.flags|=16):y.push(t)),e.child=a,e.memoizedState=null,a)}function Cu(t,e){return e=_s({mode:"visible",children:e},t.mode),e.return=t,t.child=e}function _s(t,e){return t=Te(22,t,null,e),t.lanes=0,t}function Nu(t,e,a){return va(e,t.child,null,a),t=Cu(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function _m(t,e,a){t.lanes|=e;var l=t.alternate;l!==null&&(l.lanes|=e),qo(t.return,e,a)}function Mu(t,e,a,l,o,c){var y=t.memoizedState;y===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:l,tail:a,tailMode:o,treeForkCount:c}:(y.isBackwards=e,y.rendering=null,y.renderingStartTime=0,y.last=l,y.tail=a,y.tailMode=o,y.treeForkCount=c)}function Lm(t,e,a){var l=e.pendingProps,o=l.revealOrder,c=l.tail;l=l.children;var y=qt.current,S=(y&2)!==0;if(S?(y=y&1|2,e.flags|=128):y&=1,F(qt,y),ae(t,e,l,a),l=jt?Xi:0,!S&&t!==null&&(t.flags&128)!==0)t:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&_m(t,a,e);else if(t.tag===19)_m(t,a,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break t;for(;t.sibling===null;){if(t.return===null||t.return===e)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(o){case"forwards":for(a=e.child,o=null;a!==null;)t=a.alternate,t!==null&&ws(t)===null&&(o=a),a=a.sibling;a=o,a===null?(o=e.child,e.child=null):(o=a.sibling,a.sibling=null),Mu(e,!1,o,a,c,l);break;case"backwards":case"unstable_legacy-backwards":for(a=null,o=e.child,e.child=null;o!==null;){if(t=o.alternate,t!==null&&ws(t)===null){e.child=o;break}t=o.sibling,o.sibling=a,a=o,o=t}Mu(e,!0,a,null,c,l);break;case"together":Mu(e,!1,null,null,void 0,l);break;default:e.memoizedState=null}return e.child}function xn(t,e,a){if(t!==null&&(e.dependencies=t.dependencies),qn|=e.lanes,(a&e.childLanes)===0)if(t!==null){if(Pa(t,e,a,!1),(a&e.childLanes)===0)return null}else return null;if(t!==null&&e.child!==t.child)throw Error(r(153));if(e.child!==null){for(t=e.child,a=dn(t,t.pendingProps),e.child=a,a.return=e;t.sibling!==null;)t=t.sibling,a=a.sibling=dn(t,t.pendingProps),a.return=e;a.sibling=null}return e.child}function Ru(t,e){return(t.lanes&e)!==0?!0:(t=t.dependencies,!!(t!==null&&ys(t)))}function Uv(t,e,a){switch(e.tag){case 3:oe(e,e.stateNode.containerInfo),Vn(e,Kt,t.memoizedState.cache),ma();break;case 27:case 5:Mi(e);break;case 4:oe(e,e.stateNode.containerInfo);break;case 10:Vn(e,e.type,e.memoizedProps.value);break;case 31:if(e.memoizedState!==null)return e.flags|=128,eu(e),null;break;case 13:var l=e.memoizedState;if(l!==null)return l.dehydrated!==null?(Un(e),e.flags|=128,null):(a&e.child.childLanes)!==0?Bm(t,e,a):(Un(e),t=xn(t,e,a),t!==null?t.sibling:null);Un(e);break;case 19:var o=(t.flags&128)!==0;if(l=(a&e.childLanes)!==0,l||(Pa(t,e,a,!1),l=(a&e.childLanes)!==0),o){if(l)return Lm(t,e,a);e.flags|=128}if(o=e.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),F(qt,qt.current),l)break;return null;case 22:return e.lanes=0,Rm(t,e,a,e.pendingProps);case 24:Vn(e,Kt,t.memoizedState.cache)}return xn(t,e,a)}function Um(t,e,a){if(t!==null)if(t.memoizedProps!==e.pendingProps)Zt=!0;else{if(!Ru(t,a)&&(e.flags&128)===0)return Zt=!1,Uv(t,e,a);Zt=(t.flags&131072)!==0}else Zt=!1,jt&&(e.flags&1048576)!==0&&yh(e,Xi,e.index);switch(e.lanes=0,e.tag){case 16:t:{var l=e.pendingProps;if(t=xa(e.elementType),e.type=t,typeof t=="function")Vo(t)?(l=ja(t,l),e.tag=1,e=km(null,e,t,l,a)):(e.tag=0,e=Tu(null,e,t,l,a));else{if(t!=null){var o=t.$$typeof;if(o===U){e.tag=11,e=Cm(null,e,t,l,a);break t}else if(o===X){e.tag=14,e=Nm(null,e,t,l,a);break t}}throw e=mt(t)||t,Error(r(306,e,""))}}return e;case 0:return Tu(t,e,e.type,e.pendingProps,a);case 1:return l=e.type,o=ja(l,e.pendingProps),km(t,e,l,o,a);case 3:t:{if(oe(e,e.stateNode.containerInfo),t===null)throw Error(r(387));l=e.pendingProps;var c=e.memoizedState;o=c.element,Po(t,e),Wi(e,l,null,a);var y=e.memoizedState;if(l=y.cache,Vn(e,Kt,l),l!==c.cache&&Xo(e,[Kt],a,!0),$i(),l=y.element,c.isDehydrated)if(c={element:l,isDehydrated:!1,cache:y.cache},e.updateQueue.baseState=c,e.memoizedState=c,e.flags&256){e=Vm(t,e,l,a);break t}else if(l!==o){o=Oe(Error(r(424)),e),Ki(o),e=Vm(t,e,l,a);break t}else{switch(t=e.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(Vt=Le(t.firstChild),ee=e,jt=!0,On=null,Be=!0,a=Rh(e,null,l,a),e.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling}else{if(ma(),l===o){e=xn(t,e,a);break t}ae(t,e,l,a)}e=e.child}return e;case 26:return Bs(t,e),t===null?(a=Pp(e.type,null,e.pendingProps,null))?e.memoizedState=a:jt||(a=e.type,t=e.pendingProps,l=Is(yt.current).createElement(a),l[te]=e,l[de]=t,ie(l,a,t),Wt(l),e.stateNode=l):e.memoizedState=Pp(e.type,t.memoizedProps,e.pendingProps,t.memoizedState),null;case 27:return Mi(e),t===null&&jt&&(l=e.stateNode=Zp(e.type,e.pendingProps,yt.current),ee=e,Be=!0,o=Vt,Fn(e.type)?(uc=o,Vt=Le(l.firstChild)):Vt=o),ae(t,e,e.pendingProps.children,a),Bs(t,e),t===null&&(e.flags|=4194304),e.child;case 5:return t===null&&jt&&((o=l=Vt)&&(l=p1(l,e.type,e.pendingProps,Be),l!==null?(e.stateNode=l,ee=e,Vt=Le(l.firstChild),Be=!1,o=!0):o=!1),o||kn(e)),Mi(e),o=e.type,c=e.pendingProps,y=t!==null?t.memoizedProps:null,l=c.children,ic(o,c)?l=null:y!==null&&ic(o,y)&&(e.flags|=32),e.memoizedState!==null&&(o=au(t,e,Rv,null,null,a),xl._currentValue=o),Bs(t,e),ae(t,e,l,a),e.child;case 6:return t===null&&jt&&((t=a=Vt)&&(a=g1(a,e.pendingProps,Be),a!==null?(e.stateNode=a,ee=e,Vt=null,t=!0):t=!1),t||kn(e)),null;case 13:return Bm(t,e,a);case 4:return oe(e,e.stateNode.containerInfo),l=e.pendingProps,t===null?e.child=va(e,null,l,a):ae(t,e,l,a),e.child;case 11:return Cm(t,e,e.type,e.pendingProps,a);case 7:return ae(t,e,e.pendingProps,a),e.child;case 8:return ae(t,e,e.pendingProps.children,a),e.child;case 12:return ae(t,e,e.pendingProps.children,a),e.child;case 10:return l=e.pendingProps,Vn(e,e.type,l.value),ae(t,e,l.children,a),e.child;case 9:return o=e.type._context,l=e.pendingProps.children,ga(e),o=ne(o),l=l(o),e.flags|=1,ae(t,e,l,a),e.child;case 14:return Nm(t,e,e.type,e.pendingProps,a);case 15:return Mm(t,e,e.type,e.pendingProps,a);case 19:return Lm(t,e,a);case 31:return Lv(t,e,a);case 22:return Rm(t,e,a,e.pendingProps);case 24:return ga(e),l=ne(Kt),t===null?(o=Zo(),o===null&&(o=zt,c=Ko(),o.pooledCache=c,c.refCount++,c!==null&&(o.pooledCacheLanes|=a),o=c),e.memoizedState={parent:l,cache:o},Jo(e),Vn(e,Kt,o)):((t.lanes&a)!==0&&(Po(t,e),Wi(e,null,null,a),$i()),o=t.memoizedState,c=e.memoizedState,o.parent!==l?(o={parent:l,cache:l},e.memoizedState=o,e.lanes===0&&(e.memoizedState=e.updateQueue.baseState=o),Vn(e,Kt,l)):(l=c.cache,Vn(e,Kt,l),l!==o.cache&&Xo(e,[Kt],a,!0))),ae(t,e,e.pendingProps.children,a),e.child;case 29:throw e.pendingProps}throw Error(r(156,e.tag))}function bn(t){t.flags|=4}function Du(t,e,a,l,o){if((e=(t.mode&32)!==0)&&(e=!1),e){if(t.flags|=16777216,(o&335544128)===o)if(t.stateNode.complete)t.flags|=8192;else if(dp())t.flags|=8192;else throw ba=Ss,Fo}else t.flags&=-16777217}function Hm(t,e){if(e.type!=="stylesheet"||(e.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!e0(e))if(dp())t.flags|=8192;else throw ba=Ss,Fo}function Ls(t,e){e!==null&&(t.flags|=4),t.flags&16384&&(e=t.tag!==22?bd():536870912,t.lanes|=e,oi|=e)}function il(t,e){if(!jt)switch(t.tailMode){case"hidden":e=t.tail;for(var a=null;e!==null;)e.alternate!==null&&(a=e),e=e.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var l=null;a!==null;)a.alternate!==null&&(l=a),a=a.sibling;l===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:l.sibling=null}}function Bt(t){var e=t.alternate!==null&&t.alternate.child===t.child,a=0,l=0;if(e)for(var o=t.child;o!==null;)a|=o.lanes|o.childLanes,l|=o.subtreeFlags&65011712,l|=o.flags&65011712,o.return=t,o=o.sibling;else for(o=t.child;o!==null;)a|=o.lanes|o.childLanes,l|=o.subtreeFlags,l|=o.flags,o.return=t,o=o.sibling;return t.subtreeFlags|=l,t.childLanes=a,e}function Hv(t,e,a){var l=e.pendingProps;switch(Uo(e),e.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Bt(e),null;case 1:return Bt(e),null;case 3:return a=e.stateNode,l=null,t!==null&&(l=t.memoizedState.cache),e.memoizedState.cache!==l&&(e.flags|=2048),pn(Kt),Yt(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(Ja(e)?bn(e):t===null||t.memoizedState.isDehydrated&&(e.flags&256)===0||(e.flags|=1024,Go())),Bt(e),null;case 26:var o=e.type,c=e.memoizedState;return t===null?(bn(e),c!==null?(Bt(e),Hm(e,c)):(Bt(e),Du(e,o,null,l,a))):c?c!==t.memoizedState?(bn(e),Bt(e),Hm(e,c)):(Bt(e),e.flags&=-16777217):(t=t.memoizedProps,t!==l&&bn(e),Bt(e),Du(e,o,t,l,a)),null;case 27:if(Jl(e),a=yt.current,o=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==l&&bn(e);else{if(!l){if(e.stateNode===null)throw Error(r(166));return Bt(e),null}t=$.current,Ja(e)?bh(e):(t=Zp(o,l,a),e.stateNode=t,bn(e))}return Bt(e),null;case 5:if(Jl(e),o=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==l&&bn(e);else{if(!l){if(e.stateNode===null)throw Error(r(166));return Bt(e),null}if(c=$.current,Ja(e))bh(e);else{var y=Is(yt.current);switch(c){case 1:c=y.createElementNS("http://www.w3.org/2000/svg",o);break;case 2:c=y.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;default:switch(o){case"svg":c=y.createElementNS("http://www.w3.org/2000/svg",o);break;case"math":c=y.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;case"script":c=y.createElement("div"),c.innerHTML="<script><\/script>",c=c.removeChild(c.firstChild);break;case"select":c=typeof l.is=="string"?y.createElement("select",{is:l.is}):y.createElement("select"),l.multiple?c.multiple=!0:l.size&&(c.size=l.size);break;default:c=typeof l.is=="string"?y.createElement(o,{is:l.is}):y.createElement(o)}}c[te]=e,c[de]=l;t:for(y=e.child;y!==null;){if(y.tag===5||y.tag===6)c.appendChild(y.stateNode);else if(y.tag!==4&&y.tag!==27&&y.child!==null){y.child.return=y,y=y.child;continue}if(y===e)break t;for(;y.sibling===null;){if(y.return===null||y.return===e)break t;y=y.return}y.sibling.return=y.return,y=y.sibling}e.stateNode=c;t:switch(ie(c,o,l),o){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break t;case"img":l=!0;break t;default:l=!1}l&&bn(e)}}return Bt(e),Du(e,e.type,t===null?null:t.memoizedProps,e.pendingProps,a),null;case 6:if(t&&e.stateNode!=null)t.memoizedProps!==l&&bn(e);else{if(typeof l!="string"&&e.stateNode===null)throw Error(r(166));if(t=yt.current,Ja(e)){if(t=e.stateNode,a=e.memoizedProps,l=null,o=ee,o!==null)switch(o.tag){case 27:case 5:l=o.memoizedProps}t[te]=e,t=!!(t.nodeValue===a||l!==null&&l.suppressHydrationWarning===!0||Bp(t.nodeValue,a)),t||kn(e,!0)}else t=Is(t).createTextNode(l),t[te]=e,e.stateNode=t}return Bt(e),null;case 31:if(a=e.memoizedState,t===null||t.memoizedState!==null){if(l=Ja(e),a!==null){if(t===null){if(!l)throw Error(r(318));if(t=e.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(557));t[te]=e}else ma(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;Bt(e),t=!1}else a=Go(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return e.flags&256?(we(e),e):(we(e),null);if((e.flags&128)!==0)throw Error(r(558))}return Bt(e),null;case 13:if(l=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(o=Ja(e),l!==null&&l.dehydrated!==null){if(t===null){if(!o)throw Error(r(318));if(o=e.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(r(317));o[te]=e}else ma(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;Bt(e),o=!1}else o=Go(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=o),o=!0;if(!o)return e.flags&256?(we(e),e):(we(e),null)}return we(e),(e.flags&128)!==0?(e.lanes=a,e):(a=l!==null,t=t!==null&&t.memoizedState!==null,a&&(l=e.child,o=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(o=l.alternate.memoizedState.cachePool.pool),c=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(c=l.memoizedState.cachePool.pool),c!==o&&(l.flags|=2048)),a!==t&&a&&(e.child.flags|=8192),Ls(e,e.updateQueue),Bt(e),null);case 4:return Yt(),t===null&&Iu(e.stateNode.containerInfo),Bt(e),null;case 10:return pn(e.type),Bt(e),null;case 19:if(Y(qt),l=e.memoizedState,l===null)return Bt(e),null;if(o=(e.flags&128)!==0,c=l.rendering,c===null)if(o)il(l,!1);else{if(Ht!==0||t!==null&&(t.flags&128)!==0)for(t=e.child;t!==null;){if(c=ws(t),c!==null){for(e.flags|=128,il(l,!1),t=c.updateQueue,e.updateQueue=t,Ls(e,t),e.subtreeFlags=0,t=a,a=e.child;a!==null;)mh(a,t),a=a.sibling;return F(qt,qt.current&1|2),jt&&hn(e,l.treeForkCount),e.child}t=t.sibling}l.tail!==null&&be()>qs&&(e.flags|=128,o=!0,il(l,!1),e.lanes=4194304)}else{if(!o)if(t=ws(c),t!==null){if(e.flags|=128,o=!0,t=t.updateQueue,e.updateQueue=t,Ls(e,t),il(l,!0),l.tail===null&&l.tailMode==="hidden"&&!c.alternate&&!jt)return Bt(e),null}else 2*be()-l.renderingStartTime>qs&&a!==536870912&&(e.flags|=128,o=!0,il(l,!1),e.lanes=4194304);l.isBackwards?(c.sibling=e.child,e.child=c):(t=l.last,t!==null?t.sibling=c:e.child=c,l.last=c)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=be(),t.sibling=null,a=qt.current,F(qt,o?a&1|2:a&1),jt&&hn(e,l.treeForkCount),t):(Bt(e),null);case 22:case 23:return we(e),tu(),l=e.memoizedState!==null,t!==null?t.memoizedState!==null!==l&&(e.flags|=8192):l&&(e.flags|=8192),l?(a&536870912)!==0&&(e.flags&128)===0&&(Bt(e),e.subtreeFlags&6&&(e.flags|=8192)):Bt(e),a=e.updateQueue,a!==null&&Ls(e,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),l=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(l=e.memoizedState.cachePool.pool),l!==a&&(e.flags|=2048),t!==null&&Y(ya),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),e.memoizedState.cache!==a&&(e.flags|=2048),pn(Kt),Bt(e),null;case 25:return null;case 30:return null}throw Error(r(156,e.tag))}function Gv(t,e){switch(Uo(e),e.tag){case 1:return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return pn(Kt),Yt(),t=e.flags,(t&65536)!==0&&(t&128)===0?(e.flags=t&-65537|128,e):null;case 26:case 27:case 5:return Jl(e),null;case 31:if(e.memoizedState!==null){if(we(e),e.alternate===null)throw Error(r(340));ma()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 13:if(we(e),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(r(340));ma()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return Y(qt),null;case 4:return Yt(),null;case 10:return pn(e.type),null;case 22:case 23:return we(e),tu(),t!==null&&Y(ya),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 24:return pn(Kt),null;case 25:return null;default:return null}}function Gm(t,e){switch(Uo(e),e.tag){case 3:pn(Kt),Yt();break;case 26:case 27:case 5:Jl(e);break;case 4:Yt();break;case 31:e.memoizedState!==null&&we(e);break;case 13:we(e);break;case 19:Y(qt);break;case 10:pn(e.type);break;case 22:case 23:we(e),tu(),t!==null&&Y(ya);break;case 24:pn(Kt)}}function ll(t,e){try{var a=e.updateQueue,l=a!==null?a.lastEffect:null;if(l!==null){var o=l.next;a=o;do{if((a.tag&t)===t){l=void 0;var c=a.create,y=a.inst;l=c(),y.destroy=l}a=a.next}while(a!==o)}}catch(S){Nt(e,e.return,S)}}function Gn(t,e,a){try{var l=e.updateQueue,o=l!==null?l.lastEffect:null;if(o!==null){var c=o.next;l=c;do{if((l.tag&t)===t){var y=l.inst,S=y.destroy;if(S!==void 0){y.destroy=void 0,o=e;var w=a,k=S;try{k()}catch(H){Nt(o,w,H)}}}l=l.next}while(l!==c)}}catch(H){Nt(e,e.return,H)}}function Ym(t){var e=t.updateQueue;if(e!==null){var a=t.stateNode;try{zh(e,a)}catch(l){Nt(t,t.return,l)}}}function qm(t,e,a){a.props=ja(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(l){Nt(t,e,l)}}function sl(t,e){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var l=t.stateNode;break;case 30:l=t.stateNode;break;default:l=t.stateNode}typeof a=="function"?t.refCleanup=a(l):a.current=l}}catch(o){Nt(t,e,o)}}function We(t,e){var a=t.ref,l=t.refCleanup;if(a!==null)if(typeof l=="function")try{l()}catch(o){Nt(t,e,o)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(o){Nt(t,e,o)}else a.current=null}function Xm(t){var e=t.type,a=t.memoizedProps,l=t.stateNode;try{t:switch(e){case"button":case"input":case"select":case"textarea":a.autoFocus&&l.focus();break t;case"img":a.src?l.src=a.src:a.srcSet&&(l.srcset=a.srcSet)}}catch(o){Nt(t,t.return,o)}}function zu(t,e,a){try{var l=t.stateNode;u1(l,t.type,a,e),l[de]=e}catch(o){Nt(t,t.return,o)}}function Km(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&Fn(t.type)||t.tag===4}function Ou(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||Km(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&Fn(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function ku(t,e,a){var l=t.tag;if(l===5||l===6)t=t.stateNode,e?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(t,e):(e=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,e.appendChild(t),a=a._reactRootContainer,a!=null||e.onclick!==null||(e.onclick=cn));else if(l!==4&&(l===27&&Fn(t.type)&&(a=t.stateNode,e=null),t=t.child,t!==null))for(ku(t,e,a),t=t.sibling;t!==null;)ku(t,e,a),t=t.sibling}function Us(t,e,a){var l=t.tag;if(l===5||l===6)t=t.stateNode,e?a.insertBefore(t,e):a.appendChild(t);else if(l!==4&&(l===27&&Fn(t.type)&&(a=t.stateNode),t=t.child,t!==null))for(Us(t,e,a),t=t.sibling;t!==null;)Us(t,e,a),t=t.sibling}function Qm(t){var e=t.stateNode,a=t.memoizedProps;try{for(var l=t.type,o=e.attributes;o.length;)e.removeAttributeNode(o[0]);ie(e,l,a),e[te]=t,e[de]=a}catch(c){Nt(t,t.return,c)}}var vn=!1,Ft=!1,Vu=!1,Zm=typeof WeakSet=="function"?WeakSet:Set,It=null;function Yv(t,e){if(t=t.containerInfo,nc=sr,t=lh(t),No(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else t:{a=(a=t.ownerDocument)&&a.defaultView||window;var l=a.getSelection&&a.getSelection();if(l&&l.rangeCount!==0){a=l.anchorNode;var o=l.anchorOffset,c=l.focusNode;l=l.focusOffset;try{a.nodeType,c.nodeType}catch{a=null;break t}var y=0,S=-1,w=-1,k=0,H=0,q=t,V=null;e:for(;;){for(var L;q!==a||o!==0&&q.nodeType!==3||(S=y+o),q!==c||l!==0&&q.nodeType!==3||(w=y+l),q.nodeType===3&&(y+=q.nodeValue.length),(L=q.firstChild)!==null;)V=q,q=L;for(;;){if(q===t)break e;if(V===a&&++k===o&&(S=y),V===c&&++H===l&&(w=y),(L=q.nextSibling)!==null)break;q=V,V=q.parentNode}q=L}a=S===-1||w===-1?null:{start:S,end:w}}else a=null}a=a||{start:0,end:0}}else a=null;for(ac={focusedElem:t,selectionRange:a},sr=!1,It=e;It!==null;)if(e=It,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,It=t;else for(;It!==null;){switch(e=It,c=e.alternate,t=e.flags,e.tag){case 0:if((t&4)!==0&&(t=e.updateQueue,t=t!==null?t.events:null,t!==null))for(a=0;a<t.length;a++)o=t[a],o.ref.impl=o.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&c!==null){t=void 0,a=e,o=c.memoizedProps,c=c.memoizedState,l=a.stateNode;try{var W=ja(a.type,o);t=l.getSnapshotBeforeUpdate(W,c),l.__reactInternalSnapshotBeforeUpdate=t}catch(st){Nt(a,a.return,st)}}break;case 3:if((t&1024)!==0){if(t=e.stateNode.containerInfo,a=t.nodeType,a===9)sc(t);else if(a===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":sc(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(r(163))}if(t=e.sibling,t!==null){t.return=e.return,It=t;break}It=e.return}}function Fm(t,e,a){var l=a.flags;switch(a.tag){case 0:case 11:case 15:jn(t,a),l&4&&ll(5,a);break;case 1:if(jn(t,a),l&4)if(t=a.stateNode,e===null)try{t.componentDidMount()}catch(y){Nt(a,a.return,y)}else{var o=ja(a.type,e.memoizedProps);e=e.memoizedState;try{t.componentDidUpdate(o,e,t.__reactInternalSnapshotBeforeUpdate)}catch(y){Nt(a,a.return,y)}}l&64&&Ym(a),l&512&&sl(a,a.return);break;case 3:if(jn(t,a),l&64&&(t=a.updateQueue,t!==null)){if(e=null,a.child!==null)switch(a.child.tag){case 27:case 5:e=a.child.stateNode;break;case 1:e=a.child.stateNode}try{zh(t,e)}catch(y){Nt(a,a.return,y)}}break;case 27:e===null&&l&4&&Qm(a);case 26:case 5:jn(t,a),e===null&&l&4&&Xm(a),l&512&&sl(a,a.return);break;case 12:jn(t,a);break;case 31:jn(t,a),l&4&&$m(t,a);break;case 13:jn(t,a),l&4&&Wm(t,a),l&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=$v.bind(null,a),y1(t,a))));break;case 22:if(l=a.memoizedState!==null||vn,!l){e=e!==null&&e.memoizedState!==null||Ft,o=vn;var c=Ft;vn=l,(Ft=e)&&!c?Tn(t,a,(a.subtreeFlags&8772)!==0):jn(t,a),vn=o,Ft=c}break;case 30:break;default:jn(t,a)}}function Jm(t){var e=t.alternate;e!==null&&(t.alternate=null,Jm(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&co(e)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var _t=null,me=!1;function Sn(t,e,a){for(a=a.child;a!==null;)Pm(t,e,a),a=a.sibling}function Pm(t,e,a){if(ve&&typeof ve.onCommitFiberUnmount=="function")try{ve.onCommitFiberUnmount(Ri,a)}catch{}switch(a.tag){case 26:Ft||We(a,e),Sn(t,e,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Ft||We(a,e);var l=_t,o=me;Fn(a.type)&&(_t=a.stateNode,me=!1),Sn(t,e,a),pl(a.stateNode),_t=l,me=o;break;case 5:Ft||We(a,e);case 6:if(l=_t,o=me,_t=null,Sn(t,e,a),_t=l,me=o,_t!==null)if(me)try{(_t.nodeType===9?_t.body:_t.nodeName==="HTML"?_t.ownerDocument.body:_t).removeChild(a.stateNode)}catch(c){Nt(a,e,c)}else try{_t.removeChild(a.stateNode)}catch(c){Nt(a,e,c)}break;case 18:_t!==null&&(me?(t=_t,Yp(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),gi(t)):Yp(_t,a.stateNode));break;case 4:l=_t,o=me,_t=a.stateNode.containerInfo,me=!0,Sn(t,e,a),_t=l,me=o;break;case 0:case 11:case 14:case 15:Gn(2,a,e),Ft||Gn(4,a,e),Sn(t,e,a);break;case 1:Ft||(We(a,e),l=a.stateNode,typeof l.componentWillUnmount=="function"&&qm(a,e,l)),Sn(t,e,a);break;case 21:Sn(t,e,a);break;case 22:Ft=(l=Ft)||a.memoizedState!==null,Sn(t,e,a),Ft=l;break;default:Sn(t,e,a)}}function $m(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{gi(t)}catch(a){Nt(e,e.return,a)}}}function Wm(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{gi(t)}catch(a){Nt(e,e.return,a)}}function qv(t){switch(t.tag){case 31:case 13:case 19:var e=t.stateNode;return e===null&&(e=t.stateNode=new Zm),e;case 22:return t=t.stateNode,e=t._retryCache,e===null&&(e=t._retryCache=new Zm),e;default:throw Error(r(435,t.tag))}}function Hs(t,e){var a=qv(t);e.forEach(function(l){if(!a.has(l)){a.add(l);var o=Wv.bind(null,t,l);l.then(o,o)}})}function pe(t,e){var a=e.deletions;if(a!==null)for(var l=0;l<a.length;l++){var o=a[l],c=t,y=e,S=y;t:for(;S!==null;){switch(S.tag){case 27:if(Fn(S.type)){_t=S.stateNode,me=!1;break t}break;case 5:_t=S.stateNode,me=!1;break t;case 3:case 4:_t=S.stateNode.containerInfo,me=!0;break t}S=S.return}if(_t===null)throw Error(r(160));Pm(c,y,o),_t=null,me=!1,c=o.alternate,c!==null&&(c.return=null),o.return=null}if(e.subtreeFlags&13886)for(e=e.child;e!==null;)Im(e,t),e=e.sibling}var Xe=null;function Im(t,e){var a=t.alternate,l=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:pe(e,t),ge(t),l&4&&(Gn(3,t,t.return),ll(3,t),Gn(5,t,t.return));break;case 1:pe(e,t),ge(t),l&512&&(Ft||a===null||We(a,a.return)),l&64&&vn&&(t=t.updateQueue,t!==null&&(l=t.callbacks,l!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?l:a.concat(l))));break;case 26:var o=Xe;if(pe(e,t),ge(t),l&512&&(Ft||a===null||We(a,a.return)),l&4){var c=a!==null?a.memoizedState:null;if(l=t.memoizedState,a===null)if(l===null)if(t.stateNode===null){t:{l=t.type,a=t.memoizedProps,o=o.ownerDocument||o;e:switch(l){case"title":c=o.getElementsByTagName("title")[0],(!c||c[Oi]||c[te]||c.namespaceURI==="http://www.w3.org/2000/svg"||c.hasAttribute("itemprop"))&&(c=o.createElement(l),o.head.insertBefore(c,o.querySelector("head > title"))),ie(c,l,a),c[te]=t,Wt(c),l=c;break t;case"link":var y=Ip("link","href",o).get(l+(a.href||""));if(y){for(var S=0;S<y.length;S++)if(c=y[S],c.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&c.getAttribute("rel")===(a.rel==null?null:a.rel)&&c.getAttribute("title")===(a.title==null?null:a.title)&&c.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){y.splice(S,1);break e}}c=o.createElement(l),ie(c,l,a),o.head.appendChild(c);break;case"meta":if(y=Ip("meta","content",o).get(l+(a.content||""))){for(S=0;S<y.length;S++)if(c=y[S],c.getAttribute("content")===(a.content==null?null:""+a.content)&&c.getAttribute("name")===(a.name==null?null:a.name)&&c.getAttribute("property")===(a.property==null?null:a.property)&&c.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&c.getAttribute("charset")===(a.charSet==null?null:a.charSet)){y.splice(S,1);break e}}c=o.createElement(l),ie(c,l,a),o.head.appendChild(c);break;default:throw Error(r(468,l))}c[te]=t,Wt(c),l=c}t.stateNode=l}else t0(o,t.type,t.stateNode);else t.stateNode=Wp(o,l,t.memoizedProps);else c!==l?(c===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):c.count--,l===null?t0(o,t.type,t.stateNode):Wp(o,l,t.memoizedProps)):l===null&&t.stateNode!==null&&zu(t,t.memoizedProps,a.memoizedProps)}break;case 27:pe(e,t),ge(t),l&512&&(Ft||a===null||We(a,a.return)),a!==null&&l&4&&zu(t,t.memoizedProps,a.memoizedProps);break;case 5:if(pe(e,t),ge(t),l&512&&(Ft||a===null||We(a,a.return)),t.flags&32){o=t.stateNode;try{Ua(o,"")}catch(W){Nt(t,t.return,W)}}l&4&&t.stateNode!=null&&(o=t.memoizedProps,zu(t,o,a!==null?a.memoizedProps:o)),l&1024&&(Vu=!0);break;case 6:if(pe(e,t),ge(t),l&4){if(t.stateNode===null)throw Error(r(162));l=t.memoizedProps,a=t.stateNode;try{a.nodeValue=l}catch(W){Nt(t,t.return,W)}}break;case 3:if(nr=null,o=Xe,Xe=tr(e.containerInfo),pe(e,t),Xe=o,ge(t),l&4&&a!==null&&a.memoizedState.isDehydrated)try{gi(e.containerInfo)}catch(W){Nt(t,t.return,W)}Vu&&(Vu=!1,tp(t));break;case 4:l=Xe,Xe=tr(t.stateNode.containerInfo),pe(e,t),ge(t),Xe=l;break;case 12:pe(e,t),ge(t);break;case 31:pe(e,t),ge(t),l&4&&(l=t.updateQueue,l!==null&&(t.updateQueue=null,Hs(t,l)));break;case 13:pe(e,t),ge(t),t.child.flags&8192&&t.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Ys=be()),l&4&&(l=t.updateQueue,l!==null&&(t.updateQueue=null,Hs(t,l)));break;case 22:o=t.memoizedState!==null;var w=a!==null&&a.memoizedState!==null,k=vn,H=Ft;if(vn=k||o,Ft=H||w,pe(e,t),Ft=H,vn=k,ge(t),l&8192)t:for(e=t.stateNode,e._visibility=o?e._visibility&-2:e._visibility|1,o&&(a===null||w||vn||Ft||Ta(t)),a=null,e=t;;){if(e.tag===5||e.tag===26){if(a===null){w=a=e;try{if(c=w.stateNode,o)y=c.style,typeof y.setProperty=="function"?y.setProperty("display","none","important"):y.display="none";else{S=w.stateNode;var q=w.memoizedProps.style,V=q!=null&&q.hasOwnProperty("display")?q.display:null;S.style.display=V==null||typeof V=="boolean"?"":(""+V).trim()}}catch(W){Nt(w,w.return,W)}}}else if(e.tag===6){if(a===null){w=e;try{w.stateNode.nodeValue=o?"":w.memoizedProps}catch(W){Nt(w,w.return,W)}}}else if(e.tag===18){if(a===null){w=e;try{var L=w.stateNode;o?qp(L,!0):qp(w.stateNode,!1)}catch(W){Nt(w,w.return,W)}}}else if((e.tag!==22&&e.tag!==23||e.memoizedState===null||e===t)&&e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break t;for(;e.sibling===null;){if(e.return===null||e.return===t)break t;a===e&&(a=null),e=e.return}a===e&&(a=null),e.sibling.return=e.return,e=e.sibling}l&4&&(l=t.updateQueue,l!==null&&(a=l.retryQueue,a!==null&&(l.retryQueue=null,Hs(t,a))));break;case 19:pe(e,t),ge(t),l&4&&(l=t.updateQueue,l!==null&&(t.updateQueue=null,Hs(t,l)));break;case 30:break;case 21:break;default:pe(e,t),ge(t)}}function ge(t){var e=t.flags;if(e&2){try{for(var a,l=t.return;l!==null;){if(Km(l)){a=l;break}l=l.return}if(a==null)throw Error(r(160));switch(a.tag){case 27:var o=a.stateNode,c=Ou(t);Us(t,c,o);break;case 5:var y=a.stateNode;a.flags&32&&(Ua(y,""),a.flags&=-33);var S=Ou(t);Us(t,S,y);break;case 3:case 4:var w=a.stateNode.containerInfo,k=Ou(t);ku(t,k,w);break;default:throw Error(r(161))}}catch(H){Nt(t,t.return,H)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function tp(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var e=t;tp(e),e.tag===5&&e.flags&1024&&e.stateNode.reset(),t=t.sibling}}function jn(t,e){if(e.subtreeFlags&8772)for(e=e.child;e!==null;)Fm(t,e.alternate,e),e=e.sibling}function Ta(t){for(t=t.child;t!==null;){var e=t;switch(e.tag){case 0:case 11:case 14:case 15:Gn(4,e,e.return),Ta(e);break;case 1:We(e,e.return);var a=e.stateNode;typeof a.componentWillUnmount=="function"&&qm(e,e.return,a),Ta(e);break;case 27:pl(e.stateNode);case 26:case 5:We(e,e.return),Ta(e);break;case 22:e.memoizedState===null&&Ta(e);break;case 30:Ta(e);break;default:Ta(e)}t=t.sibling}}function Tn(t,e,a){for(a=a&&(e.subtreeFlags&8772)!==0,e=e.child;e!==null;){var l=e.alternate,o=t,c=e,y=c.flags;switch(c.tag){case 0:case 11:case 15:Tn(o,c,a),ll(4,c);break;case 1:if(Tn(o,c,a),l=c,o=l.stateNode,typeof o.componentDidMount=="function")try{o.componentDidMount()}catch(k){Nt(l,l.return,k)}if(l=c,o=l.updateQueue,o!==null){var S=l.stateNode;try{var w=o.shared.hiddenCallbacks;if(w!==null)for(o.shared.hiddenCallbacks=null,o=0;o<w.length;o++)Dh(w[o],S)}catch(k){Nt(l,l.return,k)}}a&&y&64&&Ym(c),sl(c,c.return);break;case 27:Qm(c);case 26:case 5:Tn(o,c,a),a&&l===null&&y&4&&Xm(c),sl(c,c.return);break;case 12:Tn(o,c,a);break;case 31:Tn(o,c,a),a&&y&4&&$m(o,c);break;case 13:Tn(o,c,a),a&&y&4&&Wm(o,c);break;case 22:c.memoizedState===null&&Tn(o,c,a),sl(c,c.return);break;case 30:break;default:Tn(o,c,a)}e=e.sibling}}function Bu(t,e){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&Qi(a))}function _u(t,e){t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&Qi(t))}function Ke(t,e,a,l){if(e.subtreeFlags&10256)for(e=e.child;e!==null;)ep(t,e,a,l),e=e.sibling}function ep(t,e,a,l){var o=e.flags;switch(e.tag){case 0:case 11:case 15:Ke(t,e,a,l),o&2048&&ll(9,e);break;case 1:Ke(t,e,a,l);break;case 3:Ke(t,e,a,l),o&2048&&(t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&Qi(t)));break;case 12:if(o&2048){Ke(t,e,a,l),t=e.stateNode;try{var c=e.memoizedProps,y=c.id,S=c.onPostCommit;typeof S=="function"&&S(y,e.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(w){Nt(e,e.return,w)}}else Ke(t,e,a,l);break;case 31:Ke(t,e,a,l);break;case 13:Ke(t,e,a,l);break;case 23:break;case 22:c=e.stateNode,y=e.alternate,e.memoizedState!==null?c._visibility&2?Ke(t,e,a,l):rl(t,e):c._visibility&2?Ke(t,e,a,l):(c._visibility|=2,li(t,e,a,l,(e.subtreeFlags&10256)!==0||!1)),o&2048&&Bu(y,e);break;case 24:Ke(t,e,a,l),o&2048&&_u(e.alternate,e);break;default:Ke(t,e,a,l)}}function li(t,e,a,l,o){for(o=o&&((e.subtreeFlags&10256)!==0||!1),e=e.child;e!==null;){var c=t,y=e,S=a,w=l,k=y.flags;switch(y.tag){case 0:case 11:case 15:li(c,y,S,w,o),ll(8,y);break;case 23:break;case 22:var H=y.stateNode;y.memoizedState!==null?H._visibility&2?li(c,y,S,w,o):rl(c,y):(H._visibility|=2,li(c,y,S,w,o)),o&&k&2048&&Bu(y.alternate,y);break;case 24:li(c,y,S,w,o),o&&k&2048&&_u(y.alternate,y);break;default:li(c,y,S,w,o)}e=e.sibling}}function rl(t,e){if(e.subtreeFlags&10256)for(e=e.child;e!==null;){var a=t,l=e,o=l.flags;switch(l.tag){case 22:rl(a,l),o&2048&&Bu(l.alternate,l);break;case 24:rl(a,l),o&2048&&_u(l.alternate,l);break;default:rl(a,l)}e=e.sibling}}var ol=8192;function si(t,e,a){if(t.subtreeFlags&ol)for(t=t.child;t!==null;)np(t,e,a),t=t.sibling}function np(t,e,a){switch(t.tag){case 26:si(t,e,a),t.flags&ol&&t.memoizedState!==null&&M1(a,Xe,t.memoizedState,t.memoizedProps);break;case 5:si(t,e,a);break;case 3:case 4:var l=Xe;Xe=tr(t.stateNode.containerInfo),si(t,e,a),Xe=l;break;case 22:t.memoizedState===null&&(l=t.alternate,l!==null&&l.memoizedState!==null?(l=ol,ol=16777216,si(t,e,a),ol=l):si(t,e,a));break;default:si(t,e,a)}}function ap(t){var e=t.alternate;if(e!==null&&(t=e.child,t!==null)){e.child=null;do e=t.sibling,t.sibling=null,t=e;while(t!==null)}}function ul(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var a=0;a<e.length;a++){var l=e[a];It=l,lp(l,t)}ap(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)ip(t),t=t.sibling}function ip(t){switch(t.tag){case 0:case 11:case 15:ul(t),t.flags&2048&&Gn(9,t,t.return);break;case 3:ul(t);break;case 12:ul(t);break;case 22:var e=t.stateNode;t.memoizedState!==null&&e._visibility&2&&(t.return===null||t.return.tag!==13)?(e._visibility&=-3,Gs(t)):ul(t);break;default:ul(t)}}function Gs(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var a=0;a<e.length;a++){var l=e[a];It=l,lp(l,t)}ap(t)}for(t=t.child;t!==null;){switch(e=t,e.tag){case 0:case 11:case 15:Gn(8,e,e.return),Gs(e);break;case 22:a=e.stateNode,a._visibility&2&&(a._visibility&=-3,Gs(e));break;default:Gs(e)}t=t.sibling}}function lp(t,e){for(;It!==null;){var a=It;switch(a.tag){case 0:case 11:case 15:Gn(8,a,e);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var l=a.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Qi(a.memoizedState.cache)}if(l=a.child,l!==null)l.return=a,It=l;else t:for(a=t;It!==null;){l=It;var o=l.sibling,c=l.return;if(Jm(l),l===a){It=null;break t}if(o!==null){o.return=c,It=o;break t}It=c}}}var Xv={getCacheForType:function(t){var e=ne(Kt),a=e.data.get(t);return a===void 0&&(a=t(),e.data.set(t,a)),a},cacheSignal:function(){return ne(Kt).controller.signal}},Kv=typeof WeakMap=="function"?WeakMap:Map,wt=0,zt=null,xt=null,vt=0,Ct=0,Ae=null,Yn=!1,ri=!1,Lu=!1,En=0,Ht=0,qn=0,Ea=0,Uu=0,Ce=0,oi=0,cl=null,ye=null,Hu=!1,Ys=0,sp=0,qs=1/0,Xs=null,Xn=null,Pt=0,Kn=null,ui=null,wn=0,Gu=0,Yu=null,rp=null,fl=0,qu=null;function Ne(){return(wt&2)!==0&&vt!==0?vt&-vt:B.T!==null?Ju():Td()}function op(){if(Ce===0)if((vt&536870912)===0||jt){var t=Wl;Wl<<=1,(Wl&3932160)===0&&(Wl=262144),Ce=t}else Ce=536870912;return t=Ee.current,t!==null&&(t.flags|=32),Ce}function xe(t,e,a){(t===zt&&(Ct===2||Ct===9)||t.cancelPendingCommit!==null)&&(ci(t,0),Qn(t,vt,Ce,!1)),zi(t,a),((wt&2)===0||t!==zt)&&(t===zt&&((wt&2)===0&&(Ea|=a),Ht===4&&Qn(t,vt,Ce,!1)),Ie(t))}function up(t,e,a){if((wt&6)!==0)throw Error(r(327));var l=!a&&(e&127)===0&&(e&t.expiredLanes)===0||Di(t,e),o=l?Fv(t,e):Ku(t,e,!0),c=l;do{if(o===0){ri&&!l&&Qn(t,e,0,!1);break}else{if(a=t.current.alternate,c&&!Qv(a)){o=Ku(t,e,!1),c=!1;continue}if(o===2){if(c=e,t.errorRecoveryDisabledLanes&c)var y=0;else y=t.pendingLanes&-536870913,y=y!==0?y:y&536870912?536870912:0;if(y!==0){e=y;t:{var S=t;o=cl;var w=S.current.memoizedState.isDehydrated;if(w&&(ci(S,y).flags|=256),y=Ku(S,y,!1),y!==2){if(Lu&&!w){S.errorRecoveryDisabledLanes|=c,Ea|=c,o=4;break t}c=ye,ye=o,c!==null&&(ye===null?ye=c:ye.push.apply(ye,c))}o=y}if(c=!1,o!==2)continue}}if(o===1){ci(t,0),Qn(t,e,0,!0);break}t:{switch(l=t,c=o,c){case 0:case 1:throw Error(r(345));case 4:if((e&4194048)!==e)break;case 6:Qn(l,e,Ce,!Yn);break t;case 2:ye=null;break;case 3:case 5:break;default:throw Error(r(329))}if((e&62914560)===e&&(o=Ys+300-be(),10<o)){if(Qn(l,e,Ce,!Yn),ts(l,0,!0)!==0)break t;wn=e,l.timeoutHandle=Hp(cp.bind(null,l,a,ye,Xs,Hu,e,Ce,Ea,oi,Yn,c,"Throttled",-0,0),o);break t}cp(l,a,ye,Xs,Hu,e,Ce,Ea,oi,Yn,c,null,-0,0)}}break}while(!0);Ie(t)}function cp(t,e,a,l,o,c,y,S,w,k,H,q,V,L){if(t.timeoutHandle=-1,q=e.subtreeFlags,q&8192||(q&16785408)===16785408){q={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:cn},np(e,c,q);var W=(c&62914560)===c?Ys-be():(c&4194048)===c?sp-be():0;if(W=R1(q,W),W!==null){wn=c,t.cancelPendingCommit=W(xp.bind(null,t,e,c,a,l,o,y,S,w,H,q,null,V,L)),Qn(t,c,y,!k);return}}xp(t,e,c,a,l,o,y,S,w)}function Qv(t){for(var e=t;;){var a=e.tag;if((a===0||a===11||a===15)&&e.flags&16384&&(a=e.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var l=0;l<a.length;l++){var o=a[l],c=o.getSnapshot;o=o.value;try{if(!je(c(),o))return!1}catch{return!1}}if(a=e.child,e.subtreeFlags&16384&&a!==null)a.return=e,e=a;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Qn(t,e,a,l){e&=~Uu,e&=~Ea,t.suspendedLanes|=e,t.pingedLanes&=~e,l&&(t.warmLanes|=e),l=t.expirationTimes;for(var o=e;0<o;){var c=31-Se(o),y=1<<c;l[c]=-1,o&=~y}a!==0&&vd(t,a,e)}function Ks(){return(wt&6)===0?(dl(0),!1):!0}function Xu(){if(xt!==null){if(Ct===0)var t=xt.return;else t=xt,mn=pa=null,su(t),ti=null,Fi=0,t=xt;for(;t!==null;)Gm(t.alternate,t),t=t.return;xt=null}}function ci(t,e){var a=t.timeoutHandle;a!==-1&&(t.timeoutHandle=-1,d1(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),wn=0,Xu(),zt=t,xt=a=dn(t.current,null),vt=e,Ct=0,Ae=null,Yn=!1,ri=Di(t,e),Lu=!1,oi=Ce=Uu=Ea=qn=Ht=0,ye=cl=null,Hu=!1,(e&8)!==0&&(e|=e&32);var l=t.entangledLanes;if(l!==0)for(t=t.entanglements,l&=e;0<l;){var o=31-Se(l),c=1<<o;e|=t[o],l&=~c}return En=e,ds(),a}function fp(t,e){dt=null,B.H=nl,e===Ia||e===vs?(e=Ch(),Ct=3):e===Fo?(e=Ch(),Ct=4):Ct=e===ju?8:e!==null&&typeof e=="object"&&typeof e.then=="function"?6:1,Ae=e,xt===null&&(Ht=1,ks(t,Oe(e,t.current)))}function dp(){var t=Ee.current;return t===null?!0:(vt&4194048)===vt?_e===null:(vt&62914560)===vt||(vt&536870912)!==0?t===_e:!1}function hp(){var t=B.H;return B.H=nl,t===null?nl:t}function mp(){var t=B.A;return B.A=Xv,t}function Qs(){Ht=4,Yn||(vt&4194048)!==vt&&Ee.current!==null||(ri=!0),(qn&134217727)===0&&(Ea&134217727)===0||zt===null||Qn(zt,vt,Ce,!1)}function Ku(t,e,a){var l=wt;wt|=2;var o=hp(),c=mp();(zt!==t||vt!==e)&&(Xs=null,ci(t,e)),e=!1;var y=Ht;t:do try{if(Ct!==0&&xt!==null){var S=xt,w=Ae;switch(Ct){case 8:Xu(),y=6;break t;case 3:case 2:case 9:case 6:Ee.current===null&&(e=!0);var k=Ct;if(Ct=0,Ae=null,fi(t,S,w,k),a&&ri){y=0;break t}break;default:k=Ct,Ct=0,Ae=null,fi(t,S,w,k)}}Zv(),y=Ht;break}catch(H){fp(t,H)}while(!0);return e&&t.shellSuspendCounter++,mn=pa=null,wt=l,B.H=o,B.A=c,xt===null&&(zt=null,vt=0,ds()),y}function Zv(){for(;xt!==null;)pp(xt)}function Fv(t,e){var a=wt;wt|=2;var l=hp(),o=mp();zt!==t||vt!==e?(Xs=null,qs=be()+500,ci(t,e)):ri=Di(t,e);t:do try{if(Ct!==0&&xt!==null){e=xt;var c=Ae;e:switch(Ct){case 1:Ct=0,Ae=null,fi(t,e,c,1);break;case 2:case 9:if(wh(c)){Ct=0,Ae=null,gp(e);break}e=function(){Ct!==2&&Ct!==9||zt!==t||(Ct=7),Ie(t)},c.then(e,e);break t;case 3:Ct=7;break t;case 4:Ct=5;break t;case 7:wh(c)?(Ct=0,Ae=null,gp(e)):(Ct=0,Ae=null,fi(t,e,c,7));break;case 5:var y=null;switch(xt.tag){case 26:y=xt.memoizedState;case 5:case 27:var S=xt;if(y?e0(y):S.stateNode.complete){Ct=0,Ae=null;var w=S.sibling;if(w!==null)xt=w;else{var k=S.return;k!==null?(xt=k,Zs(k)):xt=null}break e}}Ct=0,Ae=null,fi(t,e,c,5);break;case 6:Ct=0,Ae=null,fi(t,e,c,6);break;case 8:Xu(),Ht=6;break t;default:throw Error(r(462))}}Jv();break}catch(H){fp(t,H)}while(!0);return mn=pa=null,B.H=l,B.A=o,wt=a,xt!==null?0:(zt=null,vt=0,ds(),Ht)}function Jv(){for(;xt!==null&&!xb();)pp(xt)}function pp(t){var e=Um(t.alternate,t,En);t.memoizedProps=t.pendingProps,e===null?Zs(t):xt=e}function gp(t){var e=t,a=e.alternate;switch(e.tag){case 15:case 0:e=Om(a,e,e.pendingProps,e.type,void 0,vt);break;case 11:e=Om(a,e,e.pendingProps,e.type.render,e.ref,vt);break;case 5:su(e);default:Gm(a,e),e=xt=mh(e,En),e=Um(a,e,En)}t.memoizedProps=t.pendingProps,e===null?Zs(t):xt=e}function fi(t,e,a,l){mn=pa=null,su(e),ti=null,Fi=0;var o=e.return;try{if(_v(t,o,e,a,vt)){Ht=1,ks(t,Oe(a,t.current)),xt=null;return}}catch(c){if(o!==null)throw xt=o,c;Ht=1,ks(t,Oe(a,t.current)),xt=null;return}e.flags&32768?(jt||l===1?t=!0:ri||(vt&536870912)!==0?t=!1:(Yn=t=!0,(l===2||l===9||l===3||l===6)&&(l=Ee.current,l!==null&&l.tag===13&&(l.flags|=16384))),yp(e,t)):Zs(e)}function Zs(t){var e=t;do{if((e.flags&32768)!==0){yp(e,Yn);return}t=e.return;var a=Hv(e.alternate,e,En);if(a!==null){xt=a;return}if(e=e.sibling,e!==null){xt=e;return}xt=e=t}while(e!==null);Ht===0&&(Ht=5)}function yp(t,e){do{var a=Gv(t.alternate,t);if(a!==null){a.flags&=32767,xt=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!e&&(t=t.sibling,t!==null)){xt=t;return}xt=t=a}while(t!==null);Ht=6,xt=null}function xp(t,e,a,l,o,c,y,S,w){t.cancelPendingCommit=null;do Fs();while(Pt!==0);if((wt&6)!==0)throw Error(r(327));if(e!==null){if(e===t.current)throw Error(r(177));if(c=e.lanes|e.childLanes,c|=Oo,Nb(t,a,c,y,S,w),t===zt&&(xt=zt=null,vt=0),ui=e,Kn=t,wn=a,Gu=c,Yu=o,rp=l,(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,Iv(Pl,function(){return Tp(),null})):(t.callbackNode=null,t.callbackPriority=0),l=(e.flags&13878)!==0,(e.subtreeFlags&13878)!==0||l){l=B.T,B.T=null,o=Z.p,Z.p=2,y=wt,wt|=4;try{Yv(t,e,a)}finally{wt=y,Z.p=o,B.T=l}}Pt=1,bp(),vp(),Sp()}}function bp(){if(Pt===1){Pt=0;var t=Kn,e=ui,a=(e.flags&13878)!==0;if((e.subtreeFlags&13878)!==0||a){a=B.T,B.T=null;var l=Z.p;Z.p=2;var o=wt;wt|=4;try{Im(e,t);var c=ac,y=lh(t.containerInfo),S=c.focusedElem,w=c.selectionRange;if(y!==S&&S&&S.ownerDocument&&ih(S.ownerDocument.documentElement,S)){if(w!==null&&No(S)){var k=w.start,H=w.end;if(H===void 0&&(H=k),"selectionStart"in S)S.selectionStart=k,S.selectionEnd=Math.min(H,S.value.length);else{var q=S.ownerDocument||document,V=q&&q.defaultView||window;if(V.getSelection){var L=V.getSelection(),W=S.textContent.length,st=Math.min(w.start,W),Dt=w.end===void 0?st:Math.min(w.end,W);!L.extend&&st>Dt&&(y=Dt,Dt=st,st=y);var D=ah(S,st),M=ah(S,Dt);if(D&&M&&(L.rangeCount!==1||L.anchorNode!==D.node||L.anchorOffset!==D.offset||L.focusNode!==M.node||L.focusOffset!==M.offset)){var O=q.createRange();O.setStart(D.node,D.offset),L.removeAllRanges(),st>Dt?(L.addRange(O),L.extend(M.node,M.offset)):(O.setEnd(M.node,M.offset),L.addRange(O))}}}}for(q=[],L=S;L=L.parentNode;)L.nodeType===1&&q.push({element:L,left:L.scrollLeft,top:L.scrollTop});for(typeof S.focus=="function"&&S.focus(),S=0;S<q.length;S++){var G=q[S];G.element.scrollLeft=G.left,G.element.scrollTop=G.top}}sr=!!nc,ac=nc=null}finally{wt=o,Z.p=l,B.T=a}}t.current=e,Pt=2}}function vp(){if(Pt===2){Pt=0;var t=Kn,e=ui,a=(e.flags&8772)!==0;if((e.subtreeFlags&8772)!==0||a){a=B.T,B.T=null;var l=Z.p;Z.p=2;var o=wt;wt|=4;try{Fm(t,e.alternate,e)}finally{wt=o,Z.p=l,B.T=a}}Pt=3}}function Sp(){if(Pt===4||Pt===3){Pt=0,bb();var t=Kn,e=ui,a=wn,l=rp;(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?Pt=5:(Pt=0,ui=Kn=null,jp(t,t.pendingLanes));var o=t.pendingLanes;if(o===0&&(Xn=null),oo(a),e=e.stateNode,ve&&typeof ve.onCommitFiberRoot=="function")try{ve.onCommitFiberRoot(Ri,e,void 0,(e.current.flags&128)===128)}catch{}if(l!==null){e=B.T,o=Z.p,Z.p=2,B.T=null;try{for(var c=t.onRecoverableError,y=0;y<l.length;y++){var S=l[y];c(S.value,{componentStack:S.stack})}}finally{B.T=e,Z.p=o}}(wn&3)!==0&&Fs(),Ie(t),o=t.pendingLanes,(a&261930)!==0&&(o&42)!==0?t===qu?fl++:(fl=0,qu=t):fl=0,dl(0)}}function jp(t,e){(t.pooledCacheLanes&=e)===0&&(e=t.pooledCache,e!=null&&(t.pooledCache=null,Qi(e)))}function Fs(){return bp(),vp(),Sp(),Tp()}function Tp(){if(Pt!==5)return!1;var t=Kn,e=Gu;Gu=0;var a=oo(wn),l=B.T,o=Z.p;try{Z.p=32>a?32:a,B.T=null,a=Yu,Yu=null;var c=Kn,y=wn;if(Pt=0,ui=Kn=null,wn=0,(wt&6)!==0)throw Error(r(331));var S=wt;if(wt|=4,ip(c.current),ep(c,c.current,y,a),wt=S,dl(0,!1),ve&&typeof ve.onPostCommitFiberRoot=="function")try{ve.onPostCommitFiberRoot(Ri,c)}catch{}return!0}finally{Z.p=o,B.T=l,jp(t,e)}}function Ep(t,e,a){e=Oe(a,e),e=Su(t.stateNode,e,2),t=Ln(t,e,2),t!==null&&(zi(t,2),Ie(t))}function Nt(t,e,a){if(t.tag===3)Ep(t,t,a);else for(;e!==null;){if(e.tag===3){Ep(e,t,a);break}else if(e.tag===1){var l=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Xn===null||!Xn.has(l))){t=Oe(a,t),a=wm(2),l=Ln(e,a,2),l!==null&&(Am(a,l,e,t),zi(l,2),Ie(l));break}}e=e.return}}function Qu(t,e,a){var l=t.pingCache;if(l===null){l=t.pingCache=new Kv;var o=new Set;l.set(e,o)}else o=l.get(e),o===void 0&&(o=new Set,l.set(e,o));o.has(a)||(Lu=!0,o.add(a),t=Pv.bind(null,t,e,a),e.then(t,t))}function Pv(t,e,a){var l=t.pingCache;l!==null&&l.delete(e),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,zt===t&&(vt&a)===a&&(Ht===4||Ht===3&&(vt&62914560)===vt&&300>be()-Ys?(wt&2)===0&&ci(t,0):Uu|=a,oi===vt&&(oi=0)),Ie(t)}function wp(t,e){e===0&&(e=bd()),t=da(t,e),t!==null&&(zi(t,e),Ie(t))}function $v(t){var e=t.memoizedState,a=0;e!==null&&(a=e.retryLane),wp(t,a)}function Wv(t,e){var a=0;switch(t.tag){case 31:case 13:var l=t.stateNode,o=t.memoizedState;o!==null&&(a=o.retryLane);break;case 19:l=t.stateNode;break;case 22:l=t.stateNode._retryCache;break;default:throw Error(r(314))}l!==null&&l.delete(e),wp(t,a)}function Iv(t,e){return io(t,e)}var Js=null,di=null,Zu=!1,Ps=!1,Fu=!1,Zn=0;function Ie(t){t!==di&&t.next===null&&(di===null?Js=di=t:di=di.next=t),Ps=!0,Zu||(Zu=!0,e1())}function dl(t,e){if(!Fu&&Ps){Fu=!0;do for(var a=!1,l=Js;l!==null;){if(t!==0){var o=l.pendingLanes;if(o===0)var c=0;else{var y=l.suspendedLanes,S=l.pingedLanes;c=(1<<31-Se(42|t)+1)-1,c&=o&~(y&~S),c=c&201326741?c&201326741|1:c?c|2:0}c!==0&&(a=!0,Mp(l,c))}else c=vt,c=ts(l,l===zt?c:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(c&3)===0||Di(l,c)||(a=!0,Mp(l,c));l=l.next}while(a);Fu=!1}}function t1(){Ap()}function Ap(){Ps=Zu=!1;var t=0;Zn!==0&&f1()&&(t=Zn);for(var e=be(),a=null,l=Js;l!==null;){var o=l.next,c=Cp(l,e);c===0?(l.next=null,a===null?Js=o:a.next=o,o===null&&(di=a)):(a=l,(t!==0||(c&3)!==0)&&(Ps=!0)),l=o}Pt!==0&&Pt!==5||dl(t),Zn!==0&&(Zn=0)}function Cp(t,e){for(var a=t.suspendedLanes,l=t.pingedLanes,o=t.expirationTimes,c=t.pendingLanes&-62914561;0<c;){var y=31-Se(c),S=1<<y,w=o[y];w===-1?((S&a)===0||(S&l)!==0)&&(o[y]=Cb(S,e)):w<=e&&(t.expiredLanes|=S),c&=~S}if(e=zt,a=vt,a=ts(t,t===e?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),l=t.callbackNode,a===0||t===e&&(Ct===2||Ct===9)||t.cancelPendingCommit!==null)return l!==null&&l!==null&&lo(l),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||Di(t,a)){if(e=a&-a,e===t.callbackPriority)return e;switch(l!==null&&lo(l),oo(a)){case 2:case 8:a=yd;break;case 32:a=Pl;break;case 268435456:a=xd;break;default:a=Pl}return l=Np.bind(null,t),a=io(a,l),t.callbackPriority=e,t.callbackNode=a,e}return l!==null&&l!==null&&lo(l),t.callbackPriority=2,t.callbackNode=null,2}function Np(t,e){if(Pt!==0&&Pt!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(Fs()&&t.callbackNode!==a)return null;var l=vt;return l=ts(t,t===zt?l:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),l===0?null:(up(t,l,e),Cp(t,be()),t.callbackNode!=null&&t.callbackNode===a?Np.bind(null,t):null)}function Mp(t,e){if(Fs())return null;up(t,e,!0)}function e1(){h1(function(){(wt&6)!==0?io(gd,t1):Ap()})}function Ju(){if(Zn===0){var t=$a;t===0&&(t=$l,$l<<=1,($l&261888)===0&&($l=256)),Zn=t}return Zn}function Rp(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:is(""+t)}function Dp(t,e){var a=e.ownerDocument.createElement("input");return a.name=e.name,a.value=e.value,t.id&&a.setAttribute("form",t.id),e.parentNode.insertBefore(a,e),t=new FormData(t),a.parentNode.removeChild(a),t}function n1(t,e,a,l,o){if(e==="submit"&&a&&a.stateNode===o){var c=Rp((o[de]||null).action),y=l.submitter;y&&(e=(e=y[de]||null)?Rp(e.formAction):y.getAttribute("formAction"),e!==null&&(c=e,y=null));var S=new os("action","action",null,l,o);t.push({event:S,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(Zn!==0){var w=y?Dp(o,y):new FormData(o);pu(a,{pending:!0,data:w,method:o.method,action:c},null,w)}}else typeof c=="function"&&(S.preventDefault(),w=y?Dp(o,y):new FormData(o),pu(a,{pending:!0,data:w,method:o.method,action:c},c,w))},currentTarget:o}]})}}for(var Pu=0;Pu<zo.length;Pu++){var $u=zo[Pu],a1=$u.toLowerCase(),i1=$u[0].toUpperCase()+$u.slice(1);qe(a1,"on"+i1)}qe(oh,"onAnimationEnd"),qe(uh,"onAnimationIteration"),qe(ch,"onAnimationStart"),qe("dblclick","onDoubleClick"),qe("focusin","onFocus"),qe("focusout","onBlur"),qe(vv,"onTransitionRun"),qe(Sv,"onTransitionStart"),qe(jv,"onTransitionCancel"),qe(fh,"onTransitionEnd"),_a("onMouseEnter",["mouseout","mouseover"]),_a("onMouseLeave",["mouseout","mouseover"]),_a("onPointerEnter",["pointerout","pointerover"]),_a("onPointerLeave",["pointerout","pointerover"]),oa("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),oa("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),oa("onBeforeInput",["compositionend","keypress","textInput","paste"]),oa("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),oa("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),oa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var hl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),l1=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(hl));function zp(t,e){e=(e&4)!==0;for(var a=0;a<t.length;a++){var l=t[a],o=l.event;l=l.listeners;t:{var c=void 0;if(e)for(var y=l.length-1;0<=y;y--){var S=l[y],w=S.instance,k=S.currentTarget;if(S=S.listener,w!==c&&o.isPropagationStopped())break t;c=S,o.currentTarget=k;try{c(o)}catch(H){fs(H)}o.currentTarget=null,c=w}else for(y=0;y<l.length;y++){if(S=l[y],w=S.instance,k=S.currentTarget,S=S.listener,w!==c&&o.isPropagationStopped())break t;c=S,o.currentTarget=k;try{c(o)}catch(H){fs(H)}o.currentTarget=null,c=w}}}}function bt(t,e){var a=e[uo];a===void 0&&(a=e[uo]=new Set);var l=t+"__bubble";a.has(l)||(Op(e,t,2,!1),a.add(l))}function Wu(t,e,a){var l=0;e&&(l|=4),Op(a,t,l,e)}var $s="_reactListening"+Math.random().toString(36).slice(2);function Iu(t){if(!t[$s]){t[$s]=!0,Ad.forEach(function(a){a!=="selectionchange"&&(l1.has(a)||Wu(a,!1,t),Wu(a,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[$s]||(e[$s]=!0,Wu("selectionchange",!1,e))}}function Op(t,e,a,l){switch(o0(e)){case 2:var o=O1;break;case 8:o=k1;break;default:o=mc}a=o.bind(null,e,a,t),o=void 0,!bo||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(o=!0),l?o!==void 0?t.addEventListener(e,a,{capture:!0,passive:o}):t.addEventListener(e,a,!0):o!==void 0?t.addEventListener(e,a,{passive:o}):t.addEventListener(e,a,!1)}function tc(t,e,a,l,o){var c=l;if((e&1)===0&&(e&2)===0&&l!==null)t:for(;;){if(l===null)return;var y=l.tag;if(y===3||y===4){var S=l.stateNode.containerInfo;if(S===o)break;if(y===4)for(y=l.return;y!==null;){var w=y.tag;if((w===3||w===4)&&y.stateNode.containerInfo===o)return;y=y.return}for(;S!==null;){if(y=ka(S),y===null)return;if(w=y.tag,w===5||w===6||w===26||w===27){l=c=y;continue t}S=S.parentNode}}l=l.return}Ld(function(){var k=c,H=yo(a),q=[];t:{var V=dh.get(t);if(V!==void 0){var L=os,W=t;switch(t){case"keypress":if(ss(a)===0)break t;case"keydown":case"keyup":L=Wb;break;case"focusin":W="focus",L=To;break;case"focusout":W="blur",L=To;break;case"beforeblur":case"afterblur":L=To;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":L=Gd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":L=Hb;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":L=ev;break;case oh:case uh:case ch:L=qb;break;case fh:L=av;break;case"scroll":case"scrollend":L=Lb;break;case"wheel":L=lv;break;case"copy":case"cut":case"paste":L=Kb;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":L=qd;break;case"toggle":case"beforetoggle":L=rv}var st=(e&4)!==0,Dt=!st&&(t==="scroll"||t==="scrollend"),D=st?V!==null?V+"Capture":null:V;st=[];for(var M=k,O;M!==null;){var G=M;if(O=G.stateNode,G=G.tag,G!==5&&G!==26&&G!==27||O===null||D===null||(G=Vi(M,D),G!=null&&st.push(ml(M,G,O))),Dt)break;M=M.return}0<st.length&&(V=new L(V,W,null,a,H),q.push({event:V,listeners:st}))}}if((e&7)===0){t:{if(V=t==="mouseover"||t==="pointerover",L=t==="mouseout"||t==="pointerout",V&&a!==go&&(W=a.relatedTarget||a.fromElement)&&(ka(W)||W[Oa]))break t;if((L||V)&&(V=H.window===H?H:(V=H.ownerDocument)?V.defaultView||V.parentWindow:window,L?(W=a.relatedTarget||a.toElement,L=k,W=W?ka(W):null,W!==null&&(Dt=f(W),st=W.tag,W!==Dt||st!==5&&st!==27&&st!==6)&&(W=null)):(L=null,W=k),L!==W)){if(st=Gd,G="onMouseLeave",D="onMouseEnter",M="mouse",(t==="pointerout"||t==="pointerover")&&(st=qd,G="onPointerLeave",D="onPointerEnter",M="pointer"),Dt=L==null?V:ki(L),O=W==null?V:ki(W),V=new st(G,M+"leave",L,a,H),V.target=Dt,V.relatedTarget=O,G=null,ka(H)===k&&(st=new st(D,M+"enter",W,a,H),st.target=O,st.relatedTarget=Dt,G=st),Dt=G,L&&W)e:{for(st=s1,D=L,M=W,O=0,G=D;G;G=st(G))O++;G=0;for(var it=M;it;it=st(it))G++;for(;0<O-G;)D=st(D),O--;for(;0<G-O;)M=st(M),G--;for(;O--;){if(D===M||M!==null&&D===M.alternate){st=D;break e}D=st(D),M=st(M)}st=null}else st=null;L!==null&&kp(q,V,L,st,!1),W!==null&&Dt!==null&&kp(q,Dt,W,st,!0)}}t:{if(V=k?ki(k):window,L=V.nodeName&&V.nodeName.toLowerCase(),L==="select"||L==="input"&&V.type==="file")var Tt=$d;else if(Jd(V))if(Wd)Tt=yv;else{Tt=pv;var nt=mv}else L=V.nodeName,!L||L.toLowerCase()!=="input"||V.type!=="checkbox"&&V.type!=="radio"?k&&po(k.elementType)&&(Tt=$d):Tt=gv;if(Tt&&(Tt=Tt(t,k))){Pd(q,Tt,a,H);break t}nt&&nt(t,V,k),t==="focusout"&&k&&V.type==="number"&&k.memoizedProps.value!=null&&mo(V,"number",V.value)}switch(nt=k?ki(k):window,t){case"focusin":(Jd(nt)||nt.contentEditable==="true")&&(qa=nt,Mo=k,qi=null);break;case"focusout":qi=Mo=qa=null;break;case"mousedown":Ro=!0;break;case"contextmenu":case"mouseup":case"dragend":Ro=!1,sh(q,a,H);break;case"selectionchange":if(bv)break;case"keydown":case"keyup":sh(q,a,H)}var ht;if(wo)t:{switch(t){case"compositionstart":var St="onCompositionStart";break t;case"compositionend":St="onCompositionEnd";break t;case"compositionupdate":St="onCompositionUpdate";break t}St=void 0}else Ya?Zd(t,a)&&(St="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(St="onCompositionStart");St&&(Xd&&a.locale!=="ko"&&(Ya||St!=="onCompositionStart"?St==="onCompositionEnd"&&Ya&&(ht=Ud()):(Dn=H,vo="value"in Dn?Dn.value:Dn.textContent,Ya=!0)),nt=Ws(k,St),0<nt.length&&(St=new Yd(St,t,null,a,H),q.push({event:St,listeners:nt}),ht?St.data=ht:(ht=Fd(a),ht!==null&&(St.data=ht)))),(ht=uv?cv(t,a):fv(t,a))&&(St=Ws(k,"onBeforeInput"),0<St.length&&(nt=new Yd("onBeforeInput","beforeinput",null,a,H),q.push({event:nt,listeners:St}),nt.data=ht)),n1(q,t,k,a,H)}zp(q,e)})}function ml(t,e,a){return{instance:t,listener:e,currentTarget:a}}function Ws(t,e){for(var a=e+"Capture",l=[];t!==null;){var o=t,c=o.stateNode;if(o=o.tag,o!==5&&o!==26&&o!==27||c===null||(o=Vi(t,a),o!=null&&l.unshift(ml(t,o,c)),o=Vi(t,e),o!=null&&l.push(ml(t,o,c))),t.tag===3)return l;t=t.return}return[]}function s1(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function kp(t,e,a,l,o){for(var c=e._reactName,y=[];a!==null&&a!==l;){var S=a,w=S.alternate,k=S.stateNode;if(S=S.tag,w!==null&&w===l)break;S!==5&&S!==26&&S!==27||k===null||(w=k,o?(k=Vi(a,c),k!=null&&y.unshift(ml(a,k,w))):o||(k=Vi(a,c),k!=null&&y.push(ml(a,k,w)))),a=a.return}y.length!==0&&t.push({event:e,listeners:y})}var r1=/\r\n?/g,o1=/\u0000|\uFFFD/g;function Vp(t){return(typeof t=="string"?t:""+t).replace(r1,`
`).replace(o1,"")}function Bp(t,e){return e=Vp(e),Vp(t)===e}function Rt(t,e,a,l,o,c){switch(a){case"children":typeof l=="string"?e==="body"||e==="textarea"&&l===""||Ua(t,l):(typeof l=="number"||typeof l=="bigint")&&e!=="body"&&Ua(t,""+l);break;case"className":ns(t,"class",l);break;case"tabIndex":ns(t,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":ns(t,a,l);break;case"style":Bd(t,l,c);break;case"data":if(e!=="object"){ns(t,"data",l);break}case"src":case"href":if(l===""&&(e!=="a"||a!=="href")){t.removeAttribute(a);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){t.removeAttribute(a);break}l=is(""+l),t.setAttribute(a,l);break;case"action":case"formAction":if(typeof l=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof c=="function"&&(a==="formAction"?(e!=="input"&&Rt(t,e,"name",o.name,o,null),Rt(t,e,"formEncType",o.formEncType,o,null),Rt(t,e,"formMethod",o.formMethod,o,null),Rt(t,e,"formTarget",o.formTarget,o,null)):(Rt(t,e,"encType",o.encType,o,null),Rt(t,e,"method",o.method,o,null),Rt(t,e,"target",o.target,o,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){t.removeAttribute(a);break}l=is(""+l),t.setAttribute(a,l);break;case"onClick":l!=null&&(t.onclick=cn);break;case"onScroll":l!=null&&bt("scroll",t);break;case"onScrollEnd":l!=null&&bt("scrollend",t);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(r(61));if(a=l.__html,a!=null){if(o.children!=null)throw Error(r(60));t.innerHTML=a}}break;case"multiple":t.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":t.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){t.removeAttribute("xlink:href");break}a=is(""+l),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?t.setAttribute(a,""+l):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":l===!0?t.setAttribute(a,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?t.setAttribute(a,l):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?t.setAttribute(a,l):t.removeAttribute(a);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?t.removeAttribute(a):t.setAttribute(a,l);break;case"popover":bt("beforetoggle",t),bt("toggle",t),es(t,"popover",l);break;case"xlinkActuate":un(t,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":un(t,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":un(t,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":un(t,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":un(t,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":un(t,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":un(t,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":un(t,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":un(t,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":es(t,"is",l);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=Bb.get(a)||a,es(t,a,l))}}function ec(t,e,a,l,o,c){switch(a){case"style":Bd(t,l,c);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(r(61));if(a=l.__html,a!=null){if(o.children!=null)throw Error(r(60));t.innerHTML=a}}break;case"children":typeof l=="string"?Ua(t,l):(typeof l=="number"||typeof l=="bigint")&&Ua(t,""+l);break;case"onScroll":l!=null&&bt("scroll",t);break;case"onScrollEnd":l!=null&&bt("scrollend",t);break;case"onClick":l!=null&&(t.onclick=cn);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Cd.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(o=a.endsWith("Capture"),e=a.slice(2,o?a.length-7:void 0),c=t[de]||null,c=c!=null?c[a]:null,typeof c=="function"&&t.removeEventListener(e,c,o),typeof l=="function")){typeof c!="function"&&c!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(e,l,o);break t}a in t?t[a]=l:l===!0?t.setAttribute(a,""):es(t,a,l)}}}function ie(t,e,a){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":bt("error",t),bt("load",t);var l=!1,o=!1,c;for(c in a)if(a.hasOwnProperty(c)){var y=a[c];if(y!=null)switch(c){case"src":l=!0;break;case"srcSet":o=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,e));default:Rt(t,e,c,y,a,null)}}o&&Rt(t,e,"srcSet",a.srcSet,a,null),l&&Rt(t,e,"src",a.src,a,null);return;case"input":bt("invalid",t);var S=c=y=o=null,w=null,k=null;for(l in a)if(a.hasOwnProperty(l)){var H=a[l];if(H!=null)switch(l){case"name":o=H;break;case"type":y=H;break;case"checked":w=H;break;case"defaultChecked":k=H;break;case"value":c=H;break;case"defaultValue":S=H;break;case"children":case"dangerouslySetInnerHTML":if(H!=null)throw Error(r(137,e));break;default:Rt(t,e,l,H,a,null)}}zd(t,c,S,w,k,y,o,!1);return;case"select":bt("invalid",t),l=y=c=null;for(o in a)if(a.hasOwnProperty(o)&&(S=a[o],S!=null))switch(o){case"value":c=S;break;case"defaultValue":y=S;break;case"multiple":l=S;default:Rt(t,e,o,S,a,null)}e=c,a=y,t.multiple=!!l,e!=null?La(t,!!l,e,!1):a!=null&&La(t,!!l,a,!0);return;case"textarea":bt("invalid",t),c=o=l=null;for(y in a)if(a.hasOwnProperty(y)&&(S=a[y],S!=null))switch(y){case"value":l=S;break;case"defaultValue":o=S;break;case"children":c=S;break;case"dangerouslySetInnerHTML":if(S!=null)throw Error(r(91));break;default:Rt(t,e,y,S,a,null)}kd(t,l,o,c);return;case"option":for(w in a)if(a.hasOwnProperty(w)&&(l=a[w],l!=null))switch(w){case"selected":t.selected=l&&typeof l!="function"&&typeof l!="symbol";break;default:Rt(t,e,w,l,a,null)}return;case"dialog":bt("beforetoggle",t),bt("toggle",t),bt("cancel",t),bt("close",t);break;case"iframe":case"object":bt("load",t);break;case"video":case"audio":for(l=0;l<hl.length;l++)bt(hl[l],t);break;case"image":bt("error",t),bt("load",t);break;case"details":bt("toggle",t);break;case"embed":case"source":case"link":bt("error",t),bt("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(k in a)if(a.hasOwnProperty(k)&&(l=a[k],l!=null))switch(k){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,e));default:Rt(t,e,k,l,a,null)}return;default:if(po(e)){for(H in a)a.hasOwnProperty(H)&&(l=a[H],l!==void 0&&ec(t,e,H,l,a,void 0));return}}for(S in a)a.hasOwnProperty(S)&&(l=a[S],l!=null&&Rt(t,e,S,l,a,null))}function u1(t,e,a,l){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var o=null,c=null,y=null,S=null,w=null,k=null,H=null;for(L in a){var q=a[L];if(a.hasOwnProperty(L)&&q!=null)switch(L){case"checked":break;case"value":break;case"defaultValue":w=q;default:l.hasOwnProperty(L)||Rt(t,e,L,null,l,q)}}for(var V in l){var L=l[V];if(q=a[V],l.hasOwnProperty(V)&&(L!=null||q!=null))switch(V){case"type":c=L;break;case"name":o=L;break;case"checked":k=L;break;case"defaultChecked":H=L;break;case"value":y=L;break;case"defaultValue":S=L;break;case"children":case"dangerouslySetInnerHTML":if(L!=null)throw Error(r(137,e));break;default:L!==q&&Rt(t,e,V,L,l,q)}}ho(t,y,S,w,k,H,c,o);return;case"select":L=y=S=V=null;for(c in a)if(w=a[c],a.hasOwnProperty(c)&&w!=null)switch(c){case"value":break;case"multiple":L=w;default:l.hasOwnProperty(c)||Rt(t,e,c,null,l,w)}for(o in l)if(c=l[o],w=a[o],l.hasOwnProperty(o)&&(c!=null||w!=null))switch(o){case"value":V=c;break;case"defaultValue":S=c;break;case"multiple":y=c;default:c!==w&&Rt(t,e,o,c,l,w)}e=S,a=y,l=L,V!=null?La(t,!!a,V,!1):!!l!=!!a&&(e!=null?La(t,!!a,e,!0):La(t,!!a,a?[]:"",!1));return;case"textarea":L=V=null;for(S in a)if(o=a[S],a.hasOwnProperty(S)&&o!=null&&!l.hasOwnProperty(S))switch(S){case"value":break;case"children":break;default:Rt(t,e,S,null,l,o)}for(y in l)if(o=l[y],c=a[y],l.hasOwnProperty(y)&&(o!=null||c!=null))switch(y){case"value":V=o;break;case"defaultValue":L=o;break;case"children":break;case"dangerouslySetInnerHTML":if(o!=null)throw Error(r(91));break;default:o!==c&&Rt(t,e,y,o,l,c)}Od(t,V,L);return;case"option":for(var W in a)if(V=a[W],a.hasOwnProperty(W)&&V!=null&&!l.hasOwnProperty(W))switch(W){case"selected":t.selected=!1;break;default:Rt(t,e,W,null,l,V)}for(w in l)if(V=l[w],L=a[w],l.hasOwnProperty(w)&&V!==L&&(V!=null||L!=null))switch(w){case"selected":t.selected=V&&typeof V!="function"&&typeof V!="symbol";break;default:Rt(t,e,w,V,l,L)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var st in a)V=a[st],a.hasOwnProperty(st)&&V!=null&&!l.hasOwnProperty(st)&&Rt(t,e,st,null,l,V);for(k in l)if(V=l[k],L=a[k],l.hasOwnProperty(k)&&V!==L&&(V!=null||L!=null))switch(k){case"children":case"dangerouslySetInnerHTML":if(V!=null)throw Error(r(137,e));break;default:Rt(t,e,k,V,l,L)}return;default:if(po(e)){for(var Dt in a)V=a[Dt],a.hasOwnProperty(Dt)&&V!==void 0&&!l.hasOwnProperty(Dt)&&ec(t,e,Dt,void 0,l,V);for(H in l)V=l[H],L=a[H],!l.hasOwnProperty(H)||V===L||V===void 0&&L===void 0||ec(t,e,H,V,l,L);return}}for(var D in a)V=a[D],a.hasOwnProperty(D)&&V!=null&&!l.hasOwnProperty(D)&&Rt(t,e,D,null,l,V);for(q in l)V=l[q],L=a[q],!l.hasOwnProperty(q)||V===L||V==null&&L==null||Rt(t,e,q,V,l,L)}function _p(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function c1(){if(typeof performance.getEntriesByType=="function"){for(var t=0,e=0,a=performance.getEntriesByType("resource"),l=0;l<a.length;l++){var o=a[l],c=o.transferSize,y=o.initiatorType,S=o.duration;if(c&&S&&_p(y)){for(y=0,S=o.responseEnd,l+=1;l<a.length;l++){var w=a[l],k=w.startTime;if(k>S)break;var H=w.transferSize,q=w.initiatorType;H&&_p(q)&&(w=w.responseEnd,y+=H*(w<S?1:(S-k)/(w-k)))}if(--l,e+=8*(c+y)/(o.duration/1e3),t++,10<t)break}}if(0<t)return e/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var nc=null,ac=null;function Is(t){return t.nodeType===9?t:t.ownerDocument}function Lp(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Up(t,e){if(t===0)switch(e){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&e==="foreignObject"?0:t}function ic(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.children=="bigint"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var lc=null;function f1(){var t=window.event;return t&&t.type==="popstate"?t===lc?!1:(lc=t,!0):(lc=null,!1)}var Hp=typeof setTimeout=="function"?setTimeout:void 0,d1=typeof clearTimeout=="function"?clearTimeout:void 0,Gp=typeof Promise=="function"?Promise:void 0,h1=typeof queueMicrotask=="function"?queueMicrotask:typeof Gp<"u"?function(t){return Gp.resolve(null).then(t).catch(m1)}:Hp;function m1(t){setTimeout(function(){throw t})}function Fn(t){return t==="head"}function Yp(t,e){var a=e,l=0;do{var o=a.nextSibling;if(t.removeChild(a),o&&o.nodeType===8)if(a=o.data,a==="/$"||a==="/&"){if(l===0){t.removeChild(o),gi(e);return}l--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")l++;else if(a==="html")pl(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,pl(a);for(var c=a.firstChild;c;){var y=c.nextSibling,S=c.nodeName;c[Oi]||S==="SCRIPT"||S==="STYLE"||S==="LINK"&&c.rel.toLowerCase()==="stylesheet"||a.removeChild(c),c=y}}else a==="body"&&pl(t.ownerDocument.body);a=o}while(a);gi(e)}function qp(t,e){var a=t;t=0;do{var l=a.nextSibling;if(a.nodeType===1?e?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(e?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),l&&l.nodeType===8)if(a=l.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=l}while(a)}function sc(t){var e=t.firstChild;for(e&&e.nodeType===10&&(e=e.nextSibling);e;){var a=e;switch(e=e.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":sc(a),co(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function p1(t,e,a,l){for(;t.nodeType===1;){var o=a;if(t.nodeName.toLowerCase()!==e.toLowerCase()){if(!l&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(l){if(!t[Oi])switch(e){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(c=t.getAttribute("rel"),c==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(c!==o.rel||t.getAttribute("href")!==(o.href==null||o.href===""?null:o.href)||t.getAttribute("crossorigin")!==(o.crossOrigin==null?null:o.crossOrigin)||t.getAttribute("title")!==(o.title==null?null:o.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(c=t.getAttribute("src"),(c!==(o.src==null?null:o.src)||t.getAttribute("type")!==(o.type==null?null:o.type)||t.getAttribute("crossorigin")!==(o.crossOrigin==null?null:o.crossOrigin))&&c&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(e==="input"&&t.type==="hidden"){var c=o.name==null?null:""+o.name;if(o.type==="hidden"&&t.getAttribute("name")===c)return t}else return t;if(t=Le(t.nextSibling),t===null)break}return null}function g1(t,e,a){if(e==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=Le(t.nextSibling),t===null))return null;return t}function Xp(t,e){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!e||(t=Le(t.nextSibling),t===null))return null;return t}function rc(t){return t.data==="$?"||t.data==="$~"}function oc(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function y1(t,e){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=e;else if(t.data!=="$?"||a.readyState!=="loading")e();else{var l=function(){e(),a.removeEventListener("DOMContentLoaded",l)};a.addEventListener("DOMContentLoaded",l),t._reactRetry=l}}function Le(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?"||e==="$~"||e==="&"||e==="F!"||e==="F")break;if(e==="/$"||e==="/&")return null}}return t}var uc=null;function Kp(t){t=t.nextSibling;for(var e=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(e===0)return Le(t.nextSibling);e--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||e++}t=t.nextSibling}return null}function Qp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(e===0)return t;e--}else a!=="/$"&&a!=="/&"||e++}t=t.previousSibling}return null}function Zp(t,e,a){switch(e=Is(a),t){case"html":if(t=e.documentElement,!t)throw Error(r(452));return t;case"head":if(t=e.head,!t)throw Error(r(453));return t;case"body":if(t=e.body,!t)throw Error(r(454));return t;default:throw Error(r(451))}}function pl(t){for(var e=t.attributes;e.length;)t.removeAttributeNode(e[0]);co(t)}var Ue=new Map,Fp=new Set;function tr(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var An=Z.d;Z.d={f:x1,r:b1,D:v1,C:S1,L:j1,m:T1,X:w1,S:E1,M:A1};function x1(){var t=An.f(),e=Ks();return t||e}function b1(t){var e=Va(t);e!==null&&e.tag===5&&e.type==="form"?fm(e):An.r(t)}var hi=typeof document>"u"?null:document;function Jp(t,e,a){var l=hi;if(l&&typeof e=="string"&&e){var o=De(e);o='link[rel="'+t+'"][href="'+o+'"]',typeof a=="string"&&(o+='[crossorigin="'+a+'"]'),Fp.has(o)||(Fp.add(o),t={rel:t,crossOrigin:a,href:e},l.querySelector(o)===null&&(e=l.createElement("link"),ie(e,"link",t),Wt(e),l.head.appendChild(e)))}}function v1(t){An.D(t),Jp("dns-prefetch",t,null)}function S1(t,e){An.C(t,e),Jp("preconnect",t,e)}function j1(t,e,a){An.L(t,e,a);var l=hi;if(l&&t&&e){var o='link[rel="preload"][as="'+De(e)+'"]';e==="image"&&a&&a.imageSrcSet?(o+='[imagesrcset="'+De(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(o+='[imagesizes="'+De(a.imageSizes)+'"]')):o+='[href="'+De(t)+'"]';var c=o;switch(e){case"style":c=mi(t);break;case"script":c=pi(t)}Ue.has(c)||(t=b({rel:"preload",href:e==="image"&&a&&a.imageSrcSet?void 0:t,as:e},a),Ue.set(c,t),l.querySelector(o)!==null||e==="style"&&l.querySelector(gl(c))||e==="script"&&l.querySelector(yl(c))||(e=l.createElement("link"),ie(e,"link",t),Wt(e),l.head.appendChild(e)))}}function T1(t,e){An.m(t,e);var a=hi;if(a&&t){var l=e&&typeof e.as=="string"?e.as:"script",o='link[rel="modulepreload"][as="'+De(l)+'"][href="'+De(t)+'"]',c=o;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":c=pi(t)}if(!Ue.has(c)&&(t=b({rel:"modulepreload",href:t},e),Ue.set(c,t),a.querySelector(o)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(yl(c)))return}l=a.createElement("link"),ie(l,"link",t),Wt(l),a.head.appendChild(l)}}}function E1(t,e,a){An.S(t,e,a);var l=hi;if(l&&t){var o=Ba(l).hoistableStyles,c=mi(t);e=e||"default";var y=o.get(c);if(!y){var S={loading:0,preload:null};if(y=l.querySelector(gl(c)))S.loading=5;else{t=b({rel:"stylesheet",href:t,"data-precedence":e},a),(a=Ue.get(c))&&cc(t,a);var w=y=l.createElement("link");Wt(w),ie(w,"link",t),w._p=new Promise(function(k,H){w.onload=k,w.onerror=H}),w.addEventListener("load",function(){S.loading|=1}),w.addEventListener("error",function(){S.loading|=2}),S.loading|=4,er(y,e,l)}y={type:"stylesheet",instance:y,count:1,state:S},o.set(c,y)}}}function w1(t,e){An.X(t,e);var a=hi;if(a&&t){var l=Ba(a).hoistableScripts,o=pi(t),c=l.get(o);c||(c=a.querySelector(yl(o)),c||(t=b({src:t,async:!0},e),(e=Ue.get(o))&&fc(t,e),c=a.createElement("script"),Wt(c),ie(c,"link",t),a.head.appendChild(c)),c={type:"script",instance:c,count:1,state:null},l.set(o,c))}}function A1(t,e){An.M(t,e);var a=hi;if(a&&t){var l=Ba(a).hoistableScripts,o=pi(t),c=l.get(o);c||(c=a.querySelector(yl(o)),c||(t=b({src:t,async:!0,type:"module"},e),(e=Ue.get(o))&&fc(t,e),c=a.createElement("script"),Wt(c),ie(c,"link",t),a.head.appendChild(c)),c={type:"script",instance:c,count:1,state:null},l.set(o,c))}}function Pp(t,e,a,l){var o=(o=yt.current)?tr(o):null;if(!o)throw Error(r(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(e=mi(a.href),a=Ba(o).hoistableStyles,l=a.get(e),l||(l={type:"style",instance:null,count:0,state:null},a.set(e,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=mi(a.href);var c=Ba(o).hoistableStyles,y=c.get(t);if(y||(o=o.ownerDocument||o,y={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},c.set(t,y),(c=o.querySelector(gl(t)))&&!c._p&&(y.instance=c,y.state.loading=5),Ue.has(t)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ue.set(t,a),c||C1(o,t,a,y.state))),e&&l===null)throw Error(r(528,""));return y}if(e&&l!==null)throw Error(r(529,""));return null;case"script":return e=a.async,a=a.src,typeof a=="string"&&e&&typeof e!="function"&&typeof e!="symbol"?(e=pi(a),a=Ba(o).hoistableScripts,l=a.get(e),l||(l={type:"script",instance:null,count:0,state:null},a.set(e,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,t))}}function mi(t){return'href="'+De(t)+'"'}function gl(t){return'link[rel="stylesheet"]['+t+"]"}function $p(t){return b({},t,{"data-precedence":t.precedence,precedence:null})}function C1(t,e,a,l){t.querySelector('link[rel="preload"][as="style"]['+e+"]")?l.loading=1:(e=t.createElement("link"),l.preload=e,e.addEventListener("load",function(){return l.loading|=1}),e.addEventListener("error",function(){return l.loading|=2}),ie(e,"link",a),Wt(e),t.head.appendChild(e))}function pi(t){return'[src="'+De(t)+'"]'}function yl(t){return"script[async]"+t}function Wp(t,e,a){if(e.count++,e.instance===null)switch(e.type){case"style":var l=t.querySelector('style[data-href~="'+De(a.href)+'"]');if(l)return e.instance=l,Wt(l),l;var o=b({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return l=(t.ownerDocument||t).createElement("style"),Wt(l),ie(l,"style",o),er(l,a.precedence,t),e.instance=l;case"stylesheet":o=mi(a.href);var c=t.querySelector(gl(o));if(c)return e.state.loading|=4,e.instance=c,Wt(c),c;l=$p(a),(o=Ue.get(o))&&cc(l,o),c=(t.ownerDocument||t).createElement("link"),Wt(c);var y=c;return y._p=new Promise(function(S,w){y.onload=S,y.onerror=w}),ie(c,"link",l),e.state.loading|=4,er(c,a.precedence,t),e.instance=c;case"script":return c=pi(a.src),(o=t.querySelector(yl(c)))?(e.instance=o,Wt(o),o):(l=a,(o=Ue.get(c))&&(l=b({},a),fc(l,o)),t=t.ownerDocument||t,o=t.createElement("script"),Wt(o),ie(o,"link",l),t.head.appendChild(o),e.instance=o);case"void":return null;default:throw Error(r(443,e.type))}else e.type==="stylesheet"&&(e.state.loading&4)===0&&(l=e.instance,e.state.loading|=4,er(l,a.precedence,t));return e.instance}function er(t,e,a){for(var l=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),o=l.length?l[l.length-1]:null,c=o,y=0;y<l.length;y++){var S=l[y];if(S.dataset.precedence===e)c=S;else if(c!==o)break}c?c.parentNode.insertBefore(t,c.nextSibling):(e=a.nodeType===9?a.head:a,e.insertBefore(t,e.firstChild))}function cc(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.title==null&&(t.title=e.title)}function fc(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.integrity==null&&(t.integrity=e.integrity)}var nr=null;function Ip(t,e,a){if(nr===null){var l=new Map,o=nr=new Map;o.set(a,l)}else o=nr,l=o.get(a),l||(l=new Map,o.set(a,l));if(l.has(t))return l;for(l.set(t,null),a=a.getElementsByTagName(t),o=0;o<a.length;o++){var c=a[o];if(!(c[Oi]||c[te]||t==="link"&&c.getAttribute("rel")==="stylesheet")&&c.namespaceURI!=="http://www.w3.org/2000/svg"){var y=c.getAttribute(e)||"";y=t+y;var S=l.get(y);S?S.push(c):l.set(y,[c])}}return l}function t0(t,e,a){t=t.ownerDocument||t,t.head.insertBefore(a,e==="title"?t.querySelector("head > title"):null)}function N1(t,e,a){if(a===1||e.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof e.precedence!="string"||typeof e.href!="string"||e.href==="")break;return!0;case"link":if(typeof e.rel!="string"||typeof e.href!="string"||e.href===""||e.onLoad||e.onError)break;switch(e.rel){case"stylesheet":return t=e.disabled,typeof e.precedence=="string"&&t==null;default:return!0}case"script":if(e.async&&typeof e.async!="function"&&typeof e.async!="symbol"&&!e.onLoad&&!e.onError&&e.src&&typeof e.src=="string")return!0}return!1}function e0(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function M1(t,e,a,l){if(a.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var o=mi(l.href),c=e.querySelector(gl(o));if(c){e=c._p,e!==null&&typeof e=="object"&&typeof e.then=="function"&&(t.count++,t=ar.bind(t),e.then(t,t)),a.state.loading|=4,a.instance=c,Wt(c);return}c=e.ownerDocument||e,l=$p(l),(o=Ue.get(o))&&cc(l,o),c=c.createElement("link"),Wt(c);var y=c;y._p=new Promise(function(S,w){y.onload=S,y.onerror=w}),ie(c,"link",l),a.instance=c}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,e),(e=a.state.preload)&&(a.state.loading&3)===0&&(t.count++,a=ar.bind(t),e.addEventListener("load",a),e.addEventListener("error",a))}}var dc=0;function R1(t,e){return t.stylesheets&&t.count===0&&lr(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var l=setTimeout(function(){if(t.stylesheets&&lr(t,t.stylesheets),t.unsuspend){var c=t.unsuspend;t.unsuspend=null,c()}},6e4+e);0<t.imgBytes&&dc===0&&(dc=62500*c1());var o=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&lr(t,t.stylesheets),t.unsuspend)){var c=t.unsuspend;t.unsuspend=null,c()}},(t.imgBytes>dc?50:800)+e);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(l),clearTimeout(o)}}:null}function ar(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)lr(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var ir=null;function lr(t,e){t.stylesheets=null,t.unsuspend!==null&&(t.count++,ir=new Map,e.forEach(D1,t),ir=null,ar.call(t))}function D1(t,e){if(!(e.state.loading&4)){var a=ir.get(t);if(a)var l=a.get(null);else{a=new Map,ir.set(t,a);for(var o=t.querySelectorAll("link[data-precedence],style[data-precedence]"),c=0;c<o.length;c++){var y=o[c];(y.nodeName==="LINK"||y.getAttribute("media")!=="not all")&&(a.set(y.dataset.precedence,y),l=y)}l&&a.set(null,l)}o=e.instance,y=o.getAttribute("data-precedence"),c=a.get(y)||l,c===l&&a.set(null,o),a.set(y,o),this.count++,l=ar.bind(this),o.addEventListener("load",l),o.addEventListener("error",l),c?c.parentNode.insertBefore(o,c.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(o,t.firstChild)),e.state.loading|=4}}var xl={$$typeof:z,Provider:null,Consumer:null,_currentValue:J,_currentValue2:J,_threadCount:0};function z1(t,e,a,l,o,c,y,S,w){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=so(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=so(0),this.hiddenUpdates=so(null),this.identifierPrefix=l,this.onUncaughtError=o,this.onCaughtError=c,this.onRecoverableError=y,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=w,this.incompleteTransitions=new Map}function n0(t,e,a,l,o,c,y,S,w,k,H,q){return t=new z1(t,e,a,y,w,k,H,q,S),e=1,c===!0&&(e|=24),c=Te(3,null,null,e),t.current=c,c.stateNode=t,e=Ko(),e.refCount++,t.pooledCache=e,e.refCount++,c.memoizedState={element:l,isDehydrated:a,cache:e},Jo(c),t}function a0(t){return t?(t=Qa,t):Qa}function i0(t,e,a,l,o,c){o=a0(o),l.context===null?l.context=o:l.pendingContext=o,l=_n(e),l.payload={element:a},c=c===void 0?null:c,c!==null&&(l.callback=c),a=Ln(t,l,e),a!==null&&(xe(a,t,e),Pi(a,t,e))}function l0(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<e?a:e}}function hc(t,e){l0(t,e),(t=t.alternate)&&l0(t,e)}function s0(t){if(t.tag===13||t.tag===31){var e=da(t,67108864);e!==null&&xe(e,t,67108864),hc(t,67108864)}}function r0(t){if(t.tag===13||t.tag===31){var e=Ne();e=ro(e);var a=da(t,e);a!==null&&xe(a,t,e),hc(t,e)}}var sr=!0;function O1(t,e,a,l){var o=B.T;B.T=null;var c=Z.p;try{Z.p=2,mc(t,e,a,l)}finally{Z.p=c,B.T=o}}function k1(t,e,a,l){var o=B.T;B.T=null;var c=Z.p;try{Z.p=8,mc(t,e,a,l)}finally{Z.p=c,B.T=o}}function mc(t,e,a,l){if(sr){var o=pc(l);if(o===null)tc(t,e,l,rr,a),u0(t,l);else if(B1(o,t,e,a,l))l.stopPropagation();else if(u0(t,l),e&4&&-1<V1.indexOf(t)){for(;o!==null;){var c=Va(o);if(c!==null)switch(c.tag){case 3:if(c=c.stateNode,c.current.memoizedState.isDehydrated){var y=ra(c.pendingLanes);if(y!==0){var S=c;for(S.pendingLanes|=2,S.entangledLanes|=2;y;){var w=1<<31-Se(y);S.entanglements[1]|=w,y&=~w}Ie(c),(wt&6)===0&&(qs=be()+500,dl(0))}}break;case 31:case 13:S=da(c,2),S!==null&&xe(S,c,2),Ks(),hc(c,2)}if(c=pc(l),c===null&&tc(t,e,l,rr,a),c===o)break;o=c}o!==null&&l.stopPropagation()}else tc(t,e,l,null,a)}}function pc(t){return t=yo(t),gc(t)}var rr=null;function gc(t){if(rr=null,t=ka(t),t!==null){var e=f(t);if(e===null)t=null;else{var a=e.tag;if(a===13){if(t=d(e),t!==null)return t;t=null}else if(a===31){if(t=h(e),t!==null)return t;t=null}else if(a===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null)}}return rr=t,null}function o0(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(vb()){case gd:return 2;case yd:return 8;case Pl:case Sb:return 32;case xd:return 268435456;default:return 32}default:return 32}}var yc=!1,Jn=null,Pn=null,$n=null,bl=new Map,vl=new Map,Wn=[],V1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function u0(t,e){switch(t){case"focusin":case"focusout":Jn=null;break;case"dragenter":case"dragleave":Pn=null;break;case"mouseover":case"mouseout":$n=null;break;case"pointerover":case"pointerout":bl.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":vl.delete(e.pointerId)}}function Sl(t,e,a,l,o,c){return t===null||t.nativeEvent!==c?(t={blockedOn:e,domEventName:a,eventSystemFlags:l,nativeEvent:c,targetContainers:[o]},e!==null&&(e=Va(e),e!==null&&s0(e)),t):(t.eventSystemFlags|=l,e=t.targetContainers,o!==null&&e.indexOf(o)===-1&&e.push(o),t)}function B1(t,e,a,l,o){switch(e){case"focusin":return Jn=Sl(Jn,t,e,a,l,o),!0;case"dragenter":return Pn=Sl(Pn,t,e,a,l,o),!0;case"mouseover":return $n=Sl($n,t,e,a,l,o),!0;case"pointerover":var c=o.pointerId;return bl.set(c,Sl(bl.get(c)||null,t,e,a,l,o)),!0;case"gotpointercapture":return c=o.pointerId,vl.set(c,Sl(vl.get(c)||null,t,e,a,l,o)),!0}return!1}function c0(t){var e=ka(t.target);if(e!==null){var a=f(e);if(a!==null){if(e=a.tag,e===13){if(e=d(a),e!==null){t.blockedOn=e,Ed(t.priority,function(){r0(a)});return}}else if(e===31){if(e=h(a),e!==null){t.blockedOn=e,Ed(t.priority,function(){r0(a)});return}}else if(e===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function or(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var a=pc(t.nativeEvent);if(a===null){a=t.nativeEvent;var l=new a.constructor(a.type,a);go=l,a.target.dispatchEvent(l),go=null}else return e=Va(a),e!==null&&s0(e),t.blockedOn=a,!1;e.shift()}return!0}function f0(t,e,a){or(t)&&a.delete(e)}function _1(){yc=!1,Jn!==null&&or(Jn)&&(Jn=null),Pn!==null&&or(Pn)&&(Pn=null),$n!==null&&or($n)&&($n=null),bl.forEach(f0),vl.forEach(f0)}function ur(t,e){t.blockedOn===e&&(t.blockedOn=null,yc||(yc=!0,n.unstable_scheduleCallback(n.unstable_NormalPriority,_1)))}var cr=null;function d0(t){cr!==t&&(cr=t,n.unstable_scheduleCallback(n.unstable_NormalPriority,function(){cr===t&&(cr=null);for(var e=0;e<t.length;e+=3){var a=t[e],l=t[e+1],o=t[e+2];if(typeof l!="function"){if(gc(l||a)===null)continue;break}var c=Va(a);c!==null&&(t.splice(e,3),e-=3,pu(c,{pending:!0,data:o,method:a.method,action:l},l,o))}}))}function gi(t){function e(w){return ur(w,t)}Jn!==null&&ur(Jn,t),Pn!==null&&ur(Pn,t),$n!==null&&ur($n,t),bl.forEach(e),vl.forEach(e);for(var a=0;a<Wn.length;a++){var l=Wn[a];l.blockedOn===t&&(l.blockedOn=null)}for(;0<Wn.length&&(a=Wn[0],a.blockedOn===null);)c0(a),a.blockedOn===null&&Wn.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(l=0;l<a.length;l+=3){var o=a[l],c=a[l+1],y=o[de]||null;if(typeof c=="function")y||d0(a);else if(y){var S=null;if(c&&c.hasAttribute("formAction")){if(o=c,y=c[de]||null)S=y.formAction;else if(gc(o)!==null)continue}else S=y.action;typeof S=="function"?a[l+1]=S:(a.splice(l,3),l-=3),d0(a)}}}function h0(){function t(c){c.canIntercept&&c.info==="react-transition"&&c.intercept({handler:function(){return new Promise(function(y){return o=y})},focusReset:"manual",scroll:"manual"})}function e(){o!==null&&(o(),o=null),l||setTimeout(a,20)}function a(){if(!l&&!navigation.transition){var c=navigation.currentEntry;c&&c.url!=null&&navigation.navigate(c.url,{state:c.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,o=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",e),navigation.addEventListener("navigateerror",e),setTimeout(a,100),function(){l=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",e),navigation.removeEventListener("navigateerror",e),o!==null&&(o(),o=null)}}}function xc(t){this._internalRoot=t}fr.prototype.render=xc.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(r(409));var a=e.current,l=Ne();i0(a,l,t,e,null,null)},fr.prototype.unmount=xc.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;i0(t.current,2,null,t,null,null),Ks(),e[Oa]=null}};function fr(t){this._internalRoot=t}fr.prototype.unstable_scheduleHydration=function(t){if(t){var e=Td();t={blockedOn:null,target:t,priority:e};for(var a=0;a<Wn.length&&e!==0&&e<Wn[a].priority;a++);Wn.splice(a,0,t),a===0&&c0(t)}};var m0=i.version;if(m0!=="19.2.7")throw Error(r(527,m0,"19.2.7"));Z.findDOMNode=function(t){var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(r(188)):(t=Object.keys(t).join(","),Error(r(268,t)));return t=g(e),t=t!==null?x(t):null,t=t===null?null:t.stateNode,t};var L1={bundleType:0,version:"19.2.7",rendererPackageName:"react-dom",currentDispatcherRef:B,reconcilerVersion:"19.2.7"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var dr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!dr.isDisabled&&dr.supportsFiber)try{Ri=dr.inject(L1),ve=dr}catch{}}return Tl.createRoot=function(t,e){if(!u(t))throw Error(r(299));var a=!1,l="",o=Sm,c=jm,y=Tm;return e!=null&&(e.unstable_strictMode===!0&&(a=!0),e.identifierPrefix!==void 0&&(l=e.identifierPrefix),e.onUncaughtError!==void 0&&(o=e.onUncaughtError),e.onCaughtError!==void 0&&(c=e.onCaughtError),e.onRecoverableError!==void 0&&(y=e.onRecoverableError)),e=n0(t,1,!1,null,null,a,l,null,o,c,y,h0),t[Oa]=e.current,Iu(t),new xc(e)},Tl.hydrateRoot=function(t,e,a){if(!u(t))throw Error(r(299));var l=!1,o="",c=Sm,y=jm,S=Tm,w=null;return a!=null&&(a.unstable_strictMode===!0&&(l=!0),a.identifierPrefix!==void 0&&(o=a.identifierPrefix),a.onUncaughtError!==void 0&&(c=a.onUncaughtError),a.onCaughtError!==void 0&&(y=a.onCaughtError),a.onRecoverableError!==void 0&&(S=a.onRecoverableError),a.formState!==void 0&&(w=a.formState)),e=n0(t,1,!0,e,a??null,l,o,w,c,y,S,h0),e.context=a0(null),a=e.current,l=Ne(),l=ro(l),o=_n(l),o.callback=null,Ln(a,o,l),a=l,e.current.lanes=a,zi(e,a),Ie(e),t[Oa]=e.current,Iu(t),new fr(e)},Tl.version="19.2.7",Tl}var E0;function F1(){if(E0)return Sc.exports;E0=1;function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(i){console.error(i)}}return n(),Sc.exports=Z1(),Sc.exports}var J1=F1();/**
 * react-router v7.18.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */var Cf=/^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i,sy=/^[\\/]{2}/;function P1(n,i){return i+n.replace(/\\/g,"/")}var w0="popstate";function A0(n){return typeof n=="object"&&n!=null&&"pathname"in n&&"search"in n&&"hash"in n&&"state"in n&&"key"in n}function $1(n={}){function i(r,u){var g;let f=(g=u.state)==null?void 0:g.masked,{pathname:d,search:h,hash:p}=f||r.location;return Jc("",{pathname:d,search:h,hash:p},u.state&&u.state.usr||null,u.state&&u.state.key||"default",f?{pathname:r.location.pathname,search:r.location.search,hash:r.location.hash}:void 0)}function s(r,u){return typeof u=="string"?u:Bl(u)}return I1(i,s,null,n)}function Lt(n,i){if(n===!1||n===null||typeof n>"u")throw new Error(i)}function ln(n,i){if(!n){typeof console<"u"&&console.warn(i);try{throw new Error(i)}catch{}}}function W1(){return Math.random().toString(36).substring(2,10)}function C0(n,i){return{usr:n.state,key:n.key,idx:i,masked:n.mask?{pathname:n.pathname,search:n.search,hash:n.hash}:void 0}}function Jc(n,i,s=null,r,u){return{pathname:typeof n=="string"?n:n.pathname,search:"",hash:"",...typeof i=="string"?Ei(i):i,state:s,key:i&&i.key||r||W1(),mask:u}}function Bl({pathname:n="/",search:i="",hash:s=""}){return i&&i!=="?"&&(n+=i.charAt(0)==="?"?i:"?"+i),s&&s!=="#"&&(n+=s.charAt(0)==="#"?s:"#"+s),n}function Ei(n){let i={};if(n){let s=n.indexOf("#");s>=0&&(i.hash=n.substring(s),n=n.substring(0,s));let r=n.indexOf("?");r>=0&&(i.search=n.substring(r),n=n.substring(0,r)),n&&(i.pathname=n)}return i}function I1(n,i,s,r={}){let{window:u=document.defaultView,v5Compat:f=!1}=r,d=u.history,h="POP",p=null,g=x();g==null&&(g=0,d.replaceState({...d.state,idx:g},""));function x(){return(d.state||{idx:null}).idx}function b(){h="POP";let T=x(),C=T==null?null:T-g;g=T,p&&p({action:h,location:R.location,delta:C})}function v(T,C){h="PUSH";let _=A0(T)?T:Jc(R.location,T,C);g=x()+1;let z=C0(_,g),U=R.createHref(_.mask||_);try{d.pushState(z,"",U)}catch(K){if(K instanceof DOMException&&K.name==="DataCloneError")throw K;u.location.assign(U)}f&&p&&p({action:h,location:R.location,delta:1})}function E(T,C){h="REPLACE";let _=A0(T)?T:Jc(R.location,T,C);g=x();let z=C0(_,g),U=R.createHref(_.mask||_);d.replaceState(z,"",U),f&&p&&p({action:h,location:R.location,delta:0})}function A(T){return t2(u,T)}let R={get action(){return h},get location(){return n(u,d)},listen(T){if(p)throw new Error("A history only accepts one active listener");return u.addEventListener(w0,b),p=T,()=>{u.removeEventListener(w0,b),p=null}},createHref(T){return i(u,T)},createURL:A,encodeLocation(T){let C=A(T);return{pathname:C.pathname,search:C.search,hash:C.hash}},push:v,replace:E,go(T){return d.go(T)}};return R}function t2(n,i,s=!1){let r="http://localhost";n&&(r=n.location.origin!=="null"?n.location.origin:n.location.href),Lt(r,"No window.location.(origin|href) available to create URL");let u=typeof i=="string"?i:Bl(i);return u=u.replace(/ $/,"%20"),!s&&sy.test(u)&&(u=r+u),new URL(u,r)}function ry(n,i,s="/"){return e2(n,i,s,!1)}function e2(n,i,s,r,u){let f=typeof i=="string"?Ei(i):i,d=Nn(f.pathname||"/",s);if(d==null)return null;let h=n2(n),p=null,g=h2(d);for(let x=0;p==null&&x<h.length;++x)p=d2(h[x],g,r);return p}function n2(n){let i=oy(n);return a2(i),i}function oy(n,i=[],s=[],r="",u=!1){let f=(d,h,p=u,g)=>{let x={relativePath:g===void 0?d.path||"":g,caseSensitive:d.caseSensitive===!0,childrenIndex:h,route:d};if(x.relativePath.startsWith("/")){if(!x.relativePath.startsWith(r)&&p)return;Lt(x.relativePath.startsWith(r),`Absolute route path "${x.relativePath}" nested under path "${r}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),x.relativePath=x.relativePath.slice(r.length)}let b=Fe([r,x.relativePath]),v=s.concat(x);d.children&&d.children.length>0&&(Lt(d.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${b}".`),oy(d.children,i,v,b,p)),!(d.path==null&&!d.index)&&i.push({path:b,score:c2(b,d.index),routesMeta:v.map((E,A)=>{let[R,T]=fy(E.relativePath,E.caseSensitive,A===v.length-1);return{...E,matcher:R,compiledParams:T}})})};return n.forEach((d,h)=>{var p;if(d.path===""||!((p=d.path)!=null&&p.includes("?")))f(d,h);else for(let g of uy(d.path))f(d,h,!0,g)}),i}function uy(n){let i=n.split("/");if(i.length===0)return[];let[s,...r]=i,u=s.endsWith("?"),f=s.replace(/\?$/,"");if(r.length===0)return u?[f,""]:[f];let d=uy(r.join("/")),h=[];return h.push(...d.map(p=>p===""?f:[f,p].join("/"))),u&&h.push(...d),h.map(p=>n.startsWith("/")&&p===""?"/":p)}function a2(n){n.sort((i,s)=>i.score!==s.score?s.score-i.score:f2(i.routesMeta.map(r=>r.childrenIndex),s.routesMeta.map(r=>r.childrenIndex)))}var i2=/^:[\w-]+$/,l2=3,s2=2,r2=1,o2=10,u2=-2,N0=n=>n==="*";function c2(n,i){let s=n.split("/"),r=s.length;return s.some(N0)&&(r+=u2),i&&(r+=s2),s.filter(u=>!N0(u)).reduce((u,f)=>u+(i2.test(f)?l2:f===""?r2:o2),r)}function f2(n,i){return n.length===i.length&&n.slice(0,-1).every((r,u)=>r===i[u])?n[n.length-1]-i[i.length-1]:0}function d2(n,i,s=!1){let{routesMeta:r}=n,u={},f="/",d=[];for(let h=0;h<r.length;++h){let p=r[h],g=h===r.length-1,x=f==="/"?i:i.slice(f.length)||"/",b={path:p.relativePath,caseSensitive:p.caseSensitive,end:g},v=p.matcher&&p.compiledParams?cy(b,x,p.matcher,p.compiledParams):zr(b,x),E=p.route;if(!v&&g&&s&&!r[r.length-1].route.index&&(v=zr({path:p.relativePath,caseSensitive:p.caseSensitive,end:!1},x)),!v)return null;Object.assign(u,v.params),d.push({params:u,pathname:Fe([f,v.pathname]),pathnameBase:g2(Fe([f,v.pathnameBase])),route:E}),v.pathnameBase!=="/"&&(f=Fe([f,v.pathnameBase]))}return d}function zr(n,i){typeof n=="string"&&(n={path:n,caseSensitive:!1,end:!0});let[s,r]=fy(n.path,n.caseSensitive,n.end);return cy(n,i,s,r)}function cy(n,i,s,r){let u=i.match(s);if(!u)return null;let f=u[0],d=f.replace(/(.)\/+$/,"$1"),h=u.slice(1);return{params:r.reduce((g,{paramName:x,isOptional:b},v)=>{if(x==="*"){let A=h[v]||"";d=f.slice(0,f.length-A.length).replace(/(.)\/+$/,"$1")}const E=h[v];return b&&!E?g[x]=void 0:g[x]=(E||"").replace(/%2F/g,"/"),g},{}),pathname:f,pathnameBase:d,pattern:n}}function fy(n,i=!1,s=!0){ln(n==="*"||!n.endsWith("*")||n.endsWith("/*"),`Route path "${n}" will be treated as if it were "${n.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${n.replace(/\*$/,"/*")}".`);let r=[],u="^"+n.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(d,h,p,g,x)=>{if(r.push({paramName:h,isOptional:p!=null}),p){let b=x.charAt(g+d.length);return b&&b!=="/"?"/([^\\/]*)":"(?:/([^\\/]*))?"}return"/([^\\/]+)"}).replace(/\/([\w-]+)\?(\/|$)/g,"(/$1)?$2");return n.endsWith("*")?(r.push({paramName:"*"}),u+=n==="*"||n==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):s?u+="\\/*$":n!==""&&n!=="/"&&(u+="(?:(?=\\/|$))"),[new RegExp(u,i?void 0:"i"),r]}function h2(n){try{return n.split("/").map(i=>decodeURIComponent(i).replace(/\//g,"%2F")).join("/")}catch(i){return ln(!1,`The URL path "${n}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${i}).`),n}}function Nn(n,i){if(i==="/")return n;if(!n.toLowerCase().startsWith(i.toLowerCase()))return null;let s=i.endsWith("/")?i.length-1:i.length,r=n.charAt(s);return r&&r!=="/"?null:n.slice(s)||"/"}function m2(n,i="/"){let{pathname:s,search:r="",hash:u=""}=typeof n=="string"?Ei(n):n,f;return s?(s=hy(s),s.startsWith("/")?f=M0(s.substring(1),"/"):f=M0(s,i)):f=i,{pathname:f,search:y2(r),hash:x2(u)}}function M0(n,i){let s=Or(i).split("/");return n.split("/").forEach(u=>{u===".."?s.length>1&&s.pop():u!=="."&&s.push(u)}),s.length>1?s.join("/"):"/"}function wc(n,i,s,r){return`Cannot include a '${n}' character in a manually specified \`to.${i}\` field [${JSON.stringify(r)}].  Please separate it out to the \`to.${s}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function p2(n){return n.filter((i,s)=>s===0||i.route.path&&i.route.path.length>0)}function dy(n){let i=p2(n);return i.map((s,r)=>r===i.length-1?s.pathname:s.pathnameBase)}function Nf(n,i,s,r=!1){let u;typeof n=="string"?u=Ei(n):(u={...n},Lt(!u.pathname||!u.pathname.includes("?"),wc("?","pathname","search",u)),Lt(!u.pathname||!u.pathname.includes("#"),wc("#","pathname","hash",u)),Lt(!u.search||!u.search.includes("#"),wc("#","search","hash",u)));let f=n===""||u.pathname==="",d=f?"/":u.pathname,h;if(d==null)h=s;else{let b=i.length-1;if(!r&&d.startsWith("..")){let v=d.split("/");for(;v[0]==="..";)v.shift(),b-=1;u.pathname=v.join("/")}h=b>=0?i[b]:"/"}let p=m2(u,h),g=d&&d!=="/"&&d.endsWith("/"),x=(f||d===".")&&s.endsWith("/");return!p.pathname.endsWith("/")&&(g||x)&&(p.pathname+="/"),p}var hy=n=>n.replace(/[\\/]{2,}/g,"/"),Fe=n=>hy(n.join("/")),Or=n=>n.replace(/\/+$/,""),g2=n=>Or(n).replace(/^\/*/,"/"),y2=n=>!n||n==="?"?"":n.startsWith("?")?n:"?"+n,x2=n=>!n||n==="#"?"":n.startsWith("#")?n:"#"+n,b2=class{constructor(n,i,s,r=!1){this.status=n,this.statusText=i||"",this.internal=r,s instanceof Error?(this.data=s.toString(),this.error=s):this.data=s}};function v2(n){return n!=null&&typeof n.status=="number"&&typeof n.statusText=="string"&&typeof n.internal=="boolean"&&"data"in n}function S2(n){let i=n.map(s=>s.route.path).filter(Boolean);return Fe(i)||"/"}var my=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";function py(n,i){let s=n;if(typeof s!="string"||!Cf.test(s))return{absoluteURL:void 0,isExternal:!1,to:s};let r=s,u=!1;if(my)try{let f=new URL(window.location.href),d=sy.test(s)?new URL(P1(s,f.protocol)):new URL(s),h=Nn(d.pathname,i);d.origin===f.origin&&h!=null?s=h+d.search+d.hash:u=!0}catch{ln(!1,`<Link to="${s}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}return{absoluteURL:r,isExternal:u,to:s}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");var gy=["POST","PUT","PATCH","DELETE"];new Set(gy);var j2=["GET",...gy];new Set(j2);var T2=["about:","blob:","chrome:","chrome-untrusted:","content:","data:","devtools:","file:","filesystem:","javascript:"];function E2(n){try{return T2.includes(new URL(n).protocol)}catch{return!1}}var wi=j.createContext(null);wi.displayName="DataRouter";var Qr=j.createContext(null);Qr.displayName="DataRouterState";var yy=j.createContext(!1);function w2(){return j.useContext(yy)}var xy=j.createContext({isTransitioning:!1});xy.displayName="ViewTransition";var A2=j.createContext(new Map);A2.displayName="Fetchers";var C2=j.createContext(null);C2.displayName="Await";var Ye=j.createContext(null);Ye.displayName="Navigation";var Yl=j.createContext(null);Yl.displayName="Location";var rn=j.createContext({outlet:null,matches:[],isDataRoute:!1});rn.displayName="Route";var Mf=j.createContext(null);Mf.displayName="RouteError";var by="REACT_ROUTER_ERROR",N2="REDIRECT",M2="ROUTE_ERROR_RESPONSE";function R2(n){if(n.startsWith(`${by}:${N2}:{`))try{let i=JSON.parse(n.slice(28));if(typeof i=="object"&&i&&typeof i.status=="number"&&typeof i.statusText=="string"&&typeof i.location=="string"&&typeof i.reloadDocument=="boolean"&&typeof i.replace=="boolean")return i}catch{}}function D2(n){if(n.startsWith(`${by}:${M2}:{`))try{let i=JSON.parse(n.slice(40));if(typeof i=="object"&&i&&typeof i.status=="number"&&typeof i.statusText=="string")return new b2(i.status,i.statusText,i.data)}catch{}}function z2(n,{relative:i}={}){Lt(ql(),"useHref() may be used only in the context of a <Router> component.");let{basename:s,navigator:r}=j.useContext(Ye),{hash:u,pathname:f,search:d}=Xl(n,{relative:i}),h=f;return s!=="/"&&(h=f==="/"?s:Fe([s,f])),r.createHref({pathname:h,search:d,hash:u})}function ql(){return j.useContext(Yl)!=null}function on(){return Lt(ql(),"useLocation() may be used only in the context of a <Router> component."),j.useContext(Yl).location}var vy="You should call navigate() in a React.useEffect(), not when your component is first rendered.";function Sy(n){j.useContext(Ye).static||j.useLayoutEffect(n)}function Rf(){let{isDataRoute:n}=j.useContext(rn);return n?Q2():O2()}function O2(){Lt(ql(),"useNavigate() may be used only in the context of a <Router> component.");let n=j.useContext(wi),{basename:i,navigator:s}=j.useContext(Ye),{matches:r}=j.useContext(rn),{pathname:u}=on(),f=JSON.stringify(dy(r)),d=j.useRef(!1);return Sy(()=>{d.current=!0}),j.useCallback((p,g={})=>{if(ln(d.current,vy),!d.current)return;if(typeof p=="number"){s.go(p);return}let x=Nf(p,JSON.parse(f),u,g.relative==="path");n==null&&i!=="/"&&(x.pathname=x.pathname==="/"?i:Fe([i,x.pathname])),(g.replace?s.replace:s.push)(x,g.state,g)},[i,s,f,u,n])}j.createContext(null);function k2(){let{matches:n}=j.useContext(rn),i=n[n.length-1];return(i==null?void 0:i.params)??{}}function Xl(n,{relative:i}={}){let{matches:s}=j.useContext(rn),{pathname:r}=on(),u=JSON.stringify(dy(s));return j.useMemo(()=>Nf(n,JSON.parse(u),r,i==="path"),[n,u,r,i])}function V2(n,i){return jy(n,i)}function jy(n,i,s){var T;Lt(ql(),"useRoutes() may be used only in the context of a <Router> component.");let{navigator:r}=j.useContext(Ye),{matches:u}=j.useContext(rn),f=u[u.length-1],d=f?f.params:{},h=f?f.pathname:"/",p=f?f.pathnameBase:"/",g=f&&f.route;{let C=g&&g.path||"";Ey(h,!g||C.endsWith("*")||C.endsWith("*?"),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${h}" (under <Route path="${C}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${C}"> to <Route path="${C==="/"?"*":`${C}/*`}">.`)}let x=on(),b;if(i){let C=typeof i=="string"?Ei(i):i;Lt(p==="/"||((T=C.pathname)==null?void 0:T.startsWith(p)),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${p}" but pathname "${C.pathname}" was given in the \`location\` prop.`),b=C}else b=x;let v=b.pathname||"/",E=v;if(p!=="/"){let C=p.replace(/^\//,"").split("/");E="/"+v.replace(/^\//,"").split("/").slice(C.length).join("/")}let A=s&&s.state.matches.length?s.state.matches.map(C=>Object.assign(C,{route:s.manifest[C.route.id]||C.route})):ry(n,{pathname:E});ln(g||A!=null,`No routes matched location "${b.pathname}${b.search}${b.hash}" `),ln(A==null||A[A.length-1].route.element!==void 0||A[A.length-1].route.Component!==void 0||A[A.length-1].route.lazy!==void 0,`Matched leaf route at location "${b.pathname}${b.search}${b.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let R=H2(A&&A.map(C=>Object.assign({},C,{params:Object.assign({},d,C.params),pathname:Fe([p,r.encodeLocation?r.encodeLocation(C.pathname.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:C.pathname]),pathnameBase:C.pathnameBase==="/"?p:Fe([p,r.encodeLocation?r.encodeLocation(C.pathnameBase.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:C.pathnameBase])})),u,s);return i&&R?j.createElement(Yl.Provider,{value:{location:{pathname:"/",search:"",hash:"",state:null,key:"default",mask:void 0,...b},navigationType:"POP"}},R):R}function B2(){let n=K2(),i=v2(n)?`${n.status} ${n.statusText}`:n instanceof Error?n.message:JSON.stringify(n),s=n instanceof Error?n.stack:null,r="rgba(200,200,200, 0.5)",u={padding:"0.5rem",backgroundColor:r},f={padding:"2px 4px",backgroundColor:r},d=null;return console.error("Error handled by React Router default ErrorBoundary:",n),d=j.createElement(j.Fragment,null,j.createElement("p",null,"💿 Hey developer 👋"),j.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",j.createElement("code",{style:f},"ErrorBoundary")," or"," ",j.createElement("code",{style:f},"errorElement")," prop on your route.")),j.createElement(j.Fragment,null,j.createElement("h2",null,"Unexpected Application Error!"),j.createElement("h3",{style:{fontStyle:"italic"}},i),s?j.createElement("pre",{style:u},s):null,d)}var _2=j.createElement(B2,null),Ty=class extends j.Component{constructor(n){super(n),this.state={location:n.location,revalidation:n.revalidation,error:n.error}}static getDerivedStateFromError(n){return{error:n}}static getDerivedStateFromProps(n,i){return i.location!==n.location||i.revalidation!=="idle"&&n.revalidation==="idle"?{error:n.error,location:n.location,revalidation:n.revalidation}:{error:n.error!==void 0?n.error:i.error,location:i.location,revalidation:n.revalidation||i.revalidation}}componentDidCatch(n,i){this.props.onError?this.props.onError(n,i):console.error("React Router caught the following error during render",n)}render(){let n=this.state.error;if(this.context&&typeof n=="object"&&n&&"digest"in n&&typeof n.digest=="string"){const s=D2(n.digest);s&&(n=s)}let i=n!==void 0?j.createElement(rn.Provider,{value:this.props.routeContext},j.createElement(Mf.Provider,{value:n,children:this.props.component})):this.props.children;return this.context?j.createElement(L2,{error:n},i):i}};Ty.contextType=yy;var Ac=new WeakMap;function L2({children:n,error:i}){let{basename:s}=j.useContext(Ye);if(typeof i=="object"&&i&&"digest"in i&&typeof i.digest=="string"){let r=R2(i.digest);if(r){let u=Ac.get(i);if(u)throw u;let f=py(r.location,s),d=f.absoluteURL||f.to;if(E2(d))throw new Error("Invalid redirect location");if(my&&!Ac.get(i))if(f.isExternal||r.reloadDocument)window.location.href=d;else{const h=Promise.resolve().then(()=>window.__reactRouterDataRouter.navigate(f.to,{replace:r.replace}));throw Ac.set(i,h),h}return j.createElement("meta",{httpEquiv:"refresh",content:`0;url=${d}`})}}return n}function U2({routeContext:n,match:i,children:s}){let r=j.useContext(wi);return r&&r.static&&r.staticContext&&(i.route.errorElement||i.route.ErrorBoundary)&&(r.staticContext._deepestRenderedBoundaryId=i.route.id),j.createElement(rn.Provider,{value:n},s)}function H2(n,i=[],s){let r=s==null?void 0:s.state;if(n==null){if(!r)return null;if(r.errors)n=r.matches;else if(i.length===0&&!r.initialized&&r.matches.length>0)n=r.matches;else return null}let u=n,f=r==null?void 0:r.errors;if(f!=null){let x=u.findIndex(b=>b.route.id&&(f==null?void 0:f[b.route.id])!==void 0);Lt(x>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(f).join(",")}`),u=u.slice(0,Math.min(u.length,x+1))}let d=!1,h=-1;if(s&&r){d=r.renderFallback;for(let x=0;x<u.length;x++){let b=u[x];if((b.route.HydrateFallback||b.route.hydrateFallbackElement)&&(h=x),b.route.id){let{loaderData:v,errors:E}=r,A=b.route.loader&&!v.hasOwnProperty(b.route.id)&&(!E||E[b.route.id]===void 0);if(b.route.lazy||A){s.isStatic&&(d=!0),h>=0?u=u.slice(0,h+1):u=[u[0]];break}}}}let p=s==null?void 0:s.onError,g=r&&p?(x,b)=>{var v,E;p(x,{location:r.location,params:((E=(v=r.matches)==null?void 0:v[0])==null?void 0:E.params)??{},pattern:S2(r.matches),errorInfo:b})}:void 0;return u.reduceRight((x,b,v)=>{let E,A=!1,R=null,T=null;r&&(E=f&&b.route.id?f[b.route.id]:void 0,R=b.route.errorElement||_2,d&&(h<0&&v===0?(Ey("route-fallback",!1,"No `HydrateFallback` element provided to render during initial hydration"),A=!0,T=null):h===v&&(A=!0,T=b.route.hydrateFallbackElement||null)));let C=i.concat(u.slice(0,v+1)),_=()=>{let z;return E?z=R:A?z=T:b.route.Component?z=j.createElement(b.route.Component,null):b.route.element?z=b.route.element:z=x,j.createElement(U2,{match:b,routeContext:{outlet:x,matches:C,isDataRoute:r!=null},children:z})};return r&&(b.route.ErrorBoundary||b.route.errorElement||v===0)?j.createElement(Ty,{location:r.location,revalidation:r.revalidation,component:R,error:E,children:_(),routeContext:{outlet:null,matches:C,isDataRoute:!0},onError:g}):_()},null)}function Df(n){return`${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function G2(n){let i=j.useContext(wi);return Lt(i,Df(n)),i}function Y2(n){let i=j.useContext(Qr);return Lt(i,Df(n)),i}function q2(n){let i=j.useContext(rn);return Lt(i,Df(n)),i}function zf(n){let i=q2(n),s=i.matches[i.matches.length-1];return Lt(s.route.id,`${n} can only be used on routes that contain a unique "id"`),s.route.id}function X2(){return zf("useRouteId")}function K2(){var r;let n=j.useContext(Mf),i=Y2("useRouteError"),s=zf("useRouteError");return n!==void 0?n:(r=i.errors)==null?void 0:r[s]}function Q2(){let{router:n}=G2("useNavigate"),i=zf("useNavigate"),s=j.useRef(!1);return Sy(()=>{s.current=!0}),j.useCallback(async(u,f={})=>{ln(s.current,vy),s.current&&(typeof u=="number"?await n.navigate(u):await n.navigate(u,{fromRouteId:i,...f}))},[n,i])}var R0={};function Ey(n,i,s){!i&&!R0[n]&&(R0[n]=!0,ln(!1,s))}j.memo(Z2);function Z2({routes:n,manifest:i,future:s,state:r,isStatic:u,onError:f}){return jy(n,void 0,{manifest:i,state:r,isStatic:u,onError:f})}function Rl(n){Lt(!1,"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")}function F2({basename:n="/",children:i=null,location:s,navigationType:r="POP",navigator:u,static:f=!1,useTransitions:d}){Lt(!ql(),"You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");let h=n.replace(/^\/*/,"/"),p=j.useMemo(()=>({basename:h,navigator:u,static:f,useTransitions:d,future:{}}),[h,u,f,d]);typeof s=="string"&&(s=Ei(s));let{pathname:g="/",search:x="",hash:b="",state:v=null,key:E="default",mask:A}=s,R=j.useMemo(()=>{let T=Nn(g,h);return T==null?null:{location:{pathname:T,search:x,hash:b,state:v,key:E,mask:A},navigationType:r}},[h,g,x,b,v,E,r,A]);return ln(R!=null,`<Router basename="${h}"> is not able to match the URL "${g}${x}${b}" because it does not start with the basename, so the <Router> won't render anything.`),R==null?null:j.createElement(Ye.Provider,{value:p},j.createElement(Yl.Provider,{children:i,value:R}))}function J2({children:n,location:i}){return V2(Pc(n),i)}function Pc(n,i=[]){let s=[];return j.Children.forEach(n,(r,u)=>{if(!j.isValidElement(r))return;let f=[...i,u];if(r.type===j.Fragment){s.push.apply(s,Pc(r.props.children,f));return}Lt(r.type===Rl,`[${typeof r.type=="string"?r.type:r.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),Lt(!r.props.index||!r.props.children,"An index route cannot have child routes.");let d={id:r.props.id||f.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,middleware:r.props.middleware,loader:r.props.loader,action:r.props.action,hydrateFallbackElement:r.props.hydrateFallbackElement,HydrateFallback:r.props.HydrateFallback,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.hasErrorBoundary===!0||r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(d.children=Pc(r.props.children,f)),s.push(d)}),s}var jr="get",Tr="application/x-www-form-urlencoded";function Zr(n){return typeof HTMLElement<"u"&&n instanceof HTMLElement}function P2(n){return Zr(n)&&n.tagName.toLowerCase()==="button"}function $2(n){return Zr(n)&&n.tagName.toLowerCase()==="form"}function W2(n){return Zr(n)&&n.tagName.toLowerCase()==="input"}function I2(n){return!!(n.metaKey||n.altKey||n.ctrlKey||n.shiftKey)}function tS(n,i){return n.button===0&&(!i||i==="_self")&&!I2(n)}var hr=null;function eS(){if(hr===null)try{new FormData(document.createElement("form"),0),hr=!1}catch{hr=!0}return hr}var nS=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);function Cc(n){return n!=null&&!nS.has(n)?(ln(!1,`"${n}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Tr}"`),null):n}function aS(n,i){let s,r,u,f,d;if($2(n)){let h=n.getAttribute("action");r=h?Nn(h,i):null,s=n.getAttribute("method")||jr,u=Cc(n.getAttribute("enctype"))||Tr,f=new FormData(n)}else if(P2(n)||W2(n)&&(n.type==="submit"||n.type==="image")){let h=n.form;if(h==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let p=n.getAttribute("formaction")||h.getAttribute("action");if(r=p?Nn(p,i):null,s=n.getAttribute("formmethod")||h.getAttribute("method")||jr,u=Cc(n.getAttribute("formenctype"))||Cc(h.getAttribute("enctype"))||Tr,f=new FormData(h,n),!eS()){let{name:g,type:x,value:b}=n;if(x==="image"){let v=g?`${g}.`:"";f.append(`${v}x`,"0"),f.append(`${v}y`,"0")}else g&&f.append(g,b)}}else{if(Zr(n))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');s=jr,r=null,u=Tr,d=n}return f&&u==="text/plain"&&(d=f,f=void 0),{action:r,method:s.toLowerCase(),encType:u,formData:f,body:d}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function Of(n,i){if(n===!1||n===null||typeof n>"u")throw new Error(i)}function wy(n,i,s,r){let u=typeof n=="string"?new URL(n,typeof window>"u"?"server://singlefetch/":window.location.origin):n;return s?u.pathname.endsWith("/")?u.pathname=`${u.pathname}_.${r}`:u.pathname=`${u.pathname}.${r}`:u.pathname==="/"?u.pathname=`_root.${r}`:i&&Nn(u.pathname,i)==="/"?u.pathname=`${Or(i)}/_root.${r}`:u.pathname=`${Or(u.pathname)}.${r}`,u}async function iS(n,i){if(n.id in i)return i[n.id];try{let s=await import(n.module);return i[n.id]=s,s}catch(s){return console.error(`Error loading route module \`${n.module}\`, reloading page...`),console.error(s),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function lS(n){return n==null?!1:n.href==null?n.rel==="preload"&&typeof n.imageSrcSet=="string"&&typeof n.imageSizes=="string":typeof n.rel=="string"&&typeof n.href=="string"}async function sS(n,i,s){let r=await Promise.all(n.map(async u=>{let f=i.routes[u.route.id];if(f){let d=await iS(f,s);return d.links?d.links():[]}return[]}));return cS(r.flat(1).filter(lS).filter(u=>u.rel==="stylesheet"||u.rel==="preload").map(u=>u.rel==="stylesheet"?{...u,rel:"prefetch",as:"style"}:{...u,rel:"prefetch"}))}function D0(n,i,s,r,u,f){let d=(p,g)=>s[g]?p.route.id!==s[g].route.id:!0,h=(p,g)=>{var x;return s[g].pathname!==p.pathname||((x=s[g].route.path)==null?void 0:x.endsWith("*"))&&s[g].params["*"]!==p.params["*"]};return f==="assets"?i.filter((p,g)=>d(p,g)||h(p,g)):f==="data"?i.filter((p,g)=>{var b;let x=r.routes[p.route.id];if(!x||!x.hasLoader)return!1;if(d(p,g)||h(p,g))return!0;if(p.route.shouldRevalidate){let v=p.route.shouldRevalidate({currentUrl:new URL(u.pathname+u.search+u.hash,window.origin),currentParams:((b=s[0])==null?void 0:b.params)||{},nextUrl:new URL(n,window.origin),nextParams:p.params,defaultShouldRevalidate:!0});if(typeof v=="boolean")return v}return!0}):[]}function rS(n,i,{includeHydrateFallback:s}={}){return oS(n.map(r=>{let u=i.routes[r.route.id];if(!u)return[];let f=[u.module];return u.clientActionModule&&(f=f.concat(u.clientActionModule)),u.clientLoaderModule&&(f=f.concat(u.clientLoaderModule)),s&&u.hydrateFallbackModule&&(f=f.concat(u.hydrateFallbackModule)),u.imports&&(f=f.concat(u.imports)),f}).flat(1))}function oS(n){return[...new Set(n)]}function uS(n){let i={},s=Object.keys(n).sort();for(let r of s)i[r]=n[r];return i}function cS(n,i){let s=new Set;return new Set(i),n.reduce((r,u)=>{let f=JSON.stringify(uS(u));return s.has(f)||(s.add(f),r.push({key:f,link:u})),r},[])}function kf(){let n=j.useContext(wi);return Of(n,"You must render this element inside a <DataRouterContext.Provider> element"),n}function fS(){let n=j.useContext(Qr);return Of(n,"You must render this element inside a <DataRouterStateContext.Provider> element"),n}var Vf=j.createContext(void 0);Vf.displayName="FrameworkContext";function Fr(){let n=j.useContext(Vf);return Of(n,"You must render this element inside a <HydratedRouter> element"),n}function dS(n,i){let s=j.useContext(Vf),[r,u]=j.useState(!1),[f,d]=j.useState(!1),{onFocus:h,onBlur:p,onMouseEnter:g,onMouseLeave:x,onTouchStart:b}=i,v=j.useRef(null);j.useEffect(()=>{if(n==="render"&&d(!0),n==="viewport"){let R=C=>{C.forEach(_=>{d(_.isIntersecting)})},T=new IntersectionObserver(R,{threshold:.5});return v.current&&T.observe(v.current),()=>{T.disconnect()}}},[n]),j.useEffect(()=>{if(r){let R=setTimeout(()=>{d(!0)},100);return()=>{clearTimeout(R)}}},[r]);let E=()=>{u(!0)},A=()=>{u(!1),d(!1)};return s?n!=="intent"?[f,v,{}]:[f,v,{onFocus:El(h,E),onBlur:El(p,A),onMouseEnter:El(g,E),onMouseLeave:El(x,A),onTouchStart:El(b,E)}]:[!1,v,{}]}function El(n,i){return s=>{n&&n(s),s.defaultPrevented||i(s)}}function hS({page:n,...i}){let s=w2(),{nonce:r}=Fr(),{router:u}=kf(),f=j.useMemo(()=>ry(u.routes,n,u.basename),[u.routes,n,u.basename]);return f?(i.nonce==null&&r&&(i={...i,nonce:r}),s?j.createElement(pS,{page:n,matches:f,...i}):j.createElement(gS,{page:n,matches:f,...i})):null}function mS(n){let{manifest:i,routeModules:s}=Fr(),[r,u]=j.useState([]);return j.useEffect(()=>{let f=!1;return sS(n,i,s).then(d=>{f||u(d)}),()=>{f=!0}},[n,i,s]),r}function pS({page:n,matches:i,...s}){let r=on(),{future:u}=Fr(),{basename:f}=kf(),d=j.useMemo(()=>{if(n===r.pathname+r.search+r.hash)return[];let h=wy(n,f,u.v8_trailingSlashAwareDataRequests,"rsc"),p=!1,g=[];for(let x of i)typeof x.route.shouldRevalidate=="function"?p=!0:g.push(x.route.id);return p&&g.length>0&&h.searchParams.set("_routes",g.join(",")),[h.pathname+h.search]},[f,u.v8_trailingSlashAwareDataRequests,n,r,i]);return j.createElement(j.Fragment,null,d.map(h=>j.createElement("link",{key:h,rel:"prefetch",as:"fetch",href:h,...s})))}function gS({page:n,matches:i,...s}){let r=on(),{future:u,manifest:f,routeModules:d}=Fr(),{basename:h}=kf(),{loaderData:p,matches:g}=fS(),x=j.useMemo(()=>D0(n,i,g,f,r,"data"),[n,i,g,f,r]),b=j.useMemo(()=>D0(n,i,g,f,r,"assets"),[n,i,g,f,r]),v=j.useMemo(()=>{if(n===r.pathname+r.search+r.hash)return[];let R=new Set,T=!1;if(i.forEach(_=>{var U;let z=f.routes[_.route.id];!z||!z.hasLoader||(!x.some(K=>K.route.id===_.route.id)&&_.route.id in p&&((U=d[_.route.id])!=null&&U.shouldRevalidate)||z.hasClientLoader?T=!0:R.add(_.route.id))}),R.size===0)return[];let C=wy(n,h,u.v8_trailingSlashAwareDataRequests,"data");return T&&R.size>0&&C.searchParams.set("_routes",i.filter(_=>R.has(_.route.id)).map(_=>_.route.id).join(",")),[C.pathname+C.search]},[h,u.v8_trailingSlashAwareDataRequests,p,r,f,x,i,n,d]),E=j.useMemo(()=>rS(b,f),[b,f]),A=mS(b);return j.createElement(j.Fragment,null,v.map(R=>j.createElement("link",{key:R,rel:"prefetch",as:"fetch",href:R,...s})),E.map(R=>j.createElement("link",{key:R,rel:"modulepreload",href:R,...s})),A.map(({key:R,link:T})=>j.createElement("link",{key:R,nonce:s.nonce,...T,crossOrigin:T.crossOrigin??s.crossOrigin})))}function yS(...n){return i=>{n.forEach(s=>{typeof s=="function"?s(i):s!=null&&(s.current=i)})}}var xS=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";try{xS&&(window.__reactRouterVersion="7.18.0")}catch{}function bS({basename:n,children:i,useTransitions:s,window:r}){let u=j.useRef();u.current==null&&(u.current=$1({window:r,v5Compat:!0}));let f=u.current,[d,h]=j.useState({action:f.action,location:f.location}),p=j.useCallback(g=>{s===!1?h(g):j.startTransition(()=>h(g))},[s]);return j.useLayoutEffect(()=>f.listen(p),[f,p]),j.createElement(F2,{basename:n,children:i,location:d.location,navigationType:d.action,navigator:f,useTransitions:s})}var za=j.forwardRef(function({onClick:i,discover:s="render",prefetch:r="none",relative:u,reloadDocument:f,replace:d,mask:h,state:p,target:g,to:x,preventScrollReset:b,viewTransition:v,defaultShouldRevalidate:E,...A},R){let{basename:T,navigator:C,useTransitions:_}=j.useContext(Ye),z=typeof x=="string"&&Cf.test(x),U=py(x,T);x=U.to;let K=z2(x,{relative:u}),I=on(),X=null;if(h){let ot=Nf(h,[],I.mask?I.mask.pathname:"/",!0);T!=="/"&&(ot.pathname=ot.pathname==="/"?T:Fe([T,ot.pathname])),X=C.createHref(ot)}let[Q,et,P]=dS(r,A),at=TS(x,{replace:d,mask:h,state:p,target:g,preventScrollReset:b,relative:u,viewTransition:v,defaultShouldRevalidate:E,useTransitions:_});function ft(ot){i&&i(ot),ot.defaultPrevented||at(ot)}let lt=!(U.isExternal||f),mt=j.createElement("a",{...A,...P,href:(lt?X:void 0)||U.absoluteURL||K,onClick:lt?ft:i,ref:yS(R,et),target:g,"data-discover":!z&&s==="render"?"true":void 0});return Q&&!z?j.createElement(j.Fragment,null,mt,j.createElement(hS,{page:K})):mt});za.displayName="Link";var vS=j.forwardRef(function({"aria-current":i="page",caseSensitive:s=!1,className:r="",end:u=!1,style:f,to:d,viewTransition:h,children:p,...g},x){let b=Xl(d,{relative:g.relative}),v=on(),E=j.useContext(Qr),{navigator:A,basename:R}=j.useContext(Ye),T=E!=null&&NS(b)&&h===!0,C=A.encodeLocation?A.encodeLocation(b).pathname:b.pathname,_=v.pathname,z=E&&E.navigation&&E.navigation.location?E.navigation.location.pathname:null;s||(_=_.toLowerCase(),z=z?z.toLowerCase():null,C=C.toLowerCase()),z&&R&&(z=Nn(z,R)||z);const U=C!=="/"&&C.endsWith("/")?C.length-1:C.length;let K=_===C||!u&&_.startsWith(C)&&_.charAt(U)==="/",I=z!=null&&(z===C||!u&&z.startsWith(C)&&z.charAt(C.length)==="/"),X={isActive:K,isPending:I,isTransitioning:T},Q=K?i:void 0,et;typeof r=="function"?et=r(X):et=[r,K?"active":null,I?"pending":null,T?"transitioning":null].filter(Boolean).join(" ");let P=typeof f=="function"?f(X):f;return j.createElement(za,{...g,"aria-current":Q,className:et,ref:x,style:P,to:d,viewTransition:h},typeof p=="function"?p(X):p)});vS.displayName="NavLink";var SS=j.forwardRef(({discover:n="render",fetcherKey:i,navigate:s,reloadDocument:r,replace:u,state:f,method:d=jr,action:h,onSubmit:p,relative:g,preventScrollReset:x,viewTransition:b,defaultShouldRevalidate:v,...E},A)=>{let{useTransitions:R}=j.useContext(Ye),T=AS(),C=CS(h,{relative:g}),_=d.toLowerCase()==="get"?"get":"post",z=typeof h=="string"&&Cf.test(h),U=K=>{if(p&&p(K),K.defaultPrevented)return;K.preventDefault();let I=K.nativeEvent.submitter,X=(I==null?void 0:I.getAttribute("formmethod"))||d,Q=()=>T(I||K.currentTarget,{fetcherKey:i,method:X,navigate:s,replace:u,state:f,relative:g,preventScrollReset:x,viewTransition:b,defaultShouldRevalidate:v});R&&s!==!1?j.startTransition(()=>Q()):Q()};return j.createElement("form",{ref:A,method:_,action:C,onSubmit:r?p:U,...E,"data-discover":!z&&n==="render"?"true":void 0})});SS.displayName="Form";function jS(n){return`${n} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function Ay(n){let i=j.useContext(wi);return Lt(i,jS(n)),i}function TS(n,{target:i,replace:s,mask:r,state:u,preventScrollReset:f,relative:d,viewTransition:h,defaultShouldRevalidate:p,useTransitions:g}={}){let x=Rf(),b=on(),v=Xl(n,{relative:d});return j.useCallback(E=>{if(tS(E,i)){E.preventDefault();let A=s!==void 0?s:Bl(b)===Bl(v),R=()=>x(n,{replace:A,mask:r,state:u,preventScrollReset:f,relative:d,viewTransition:h,defaultShouldRevalidate:p});g?j.startTransition(()=>R()):R()}},[b,x,v,s,r,u,i,n,f,d,h,p,g])}var ES=0,wS=()=>`__${String(++ES)}__`;function AS(){let{router:n}=Ay("useSubmit"),{basename:i}=j.useContext(Ye),s=X2(),r=n.fetch,u=n.navigate;return j.useCallback(async(f,d={})=>{let{action:h,method:p,encType:g,formData:x,body:b}=aS(f,i);if(d.navigate===!1){let v=d.fetcherKey||wS();await r(v,s,d.action||h,{defaultShouldRevalidate:d.defaultShouldRevalidate,preventScrollReset:d.preventScrollReset,formData:x,body:b,formMethod:d.method||p,formEncType:d.encType||g,flushSync:d.flushSync})}else await u(d.action||h,{defaultShouldRevalidate:d.defaultShouldRevalidate,preventScrollReset:d.preventScrollReset,formData:x,body:b,formMethod:d.method||p,formEncType:d.encType||g,replace:d.replace,state:d.state,fromRouteId:s,flushSync:d.flushSync,viewTransition:d.viewTransition})},[r,u,i,s])}function CS(n,{relative:i}={}){let{basename:s}=j.useContext(Ye),r=j.useContext(rn);Lt(r,"useFormAction must be used inside a RouteContext");let[u]=r.matches.slice(-1),f={...Xl(n||".",{relative:i})},d=on();if(n==null){f.search=d.search;let h=new URLSearchParams(f.search),p=h.getAll("index");if(p.some(x=>x==="")){h.delete("index"),p.filter(b=>b).forEach(b=>h.append("index",b));let x=h.toString();f.search=x?`?${x}`:""}}return(!n||n===".")&&u.route.index&&(f.search=f.search?f.search.replace(/^\?/,"?index&"):"?index"),s!=="/"&&(f.pathname=f.pathname==="/"?s:Fe([s,f.pathname])),Bl(f)}function NS(n,{relative:i}={}){let s=j.useContext(xy);Lt(s!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:r}=Ay("useViewTransitionState"),u=Xl(n,{relative:i});if(!s.isTransitioning)return!1;let f=Nn(s.currentLocation.pathname,r)||s.currentLocation.pathname,d=Nn(s.nextLocation.pathname,r)||s.nextLocation.pathname;return zr(u.pathname,d)!=null||zr(u.pathname,f)!=null}const Bf=j.createContext({});function _f(n){const i=j.useRef(null);return i.current===null&&(i.current=n()),i.current}const MS=typeof window<"u",Lf=MS?j.useLayoutEffect:j.useEffect,Jr=j.createContext(null);function Uf(n,i){n.indexOf(i)===-1&&n.push(i)}function kr(n,i){const s=n.indexOf(i);s>-1&&n.splice(s,1)}const sn=(n,i,s)=>s>i?i:s<n?n:s;let Hf=()=>{};const na={},Cy=n=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(n),Ny=n=>typeof n=="object"&&n!==null,My=n=>/^0[^.\s]+$/u.test(n);function Ry(n){let i;return()=>(i===void 0&&(i=n()),i)}const Ge=n=>n,Kl=(...n)=>n.reduce((i,s)=>r=>s(i(r))),_l=(n,i,s)=>{const r=i-n;return r?(s-n)/r:1};class Gf{constructor(){this.subscriptions=[]}add(i){return Uf(this.subscriptions,i),()=>kr(this.subscriptions,i)}notify(i,s,r){const u=this.subscriptions.length;if(u)if(u===1)this.subscriptions[0](i,s,r);else for(let f=0;f<u;f++){const d=this.subscriptions[f];d&&d(i,s,r)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const Me=n=>n*1e3,He=n=>n/1e3,Dy=(n,i)=>i?n*(1e3/i):0,zy=(n,i,s)=>(((1-3*s+3*i)*n+(3*s-6*i))*n+3*i)*n,RS=1e-7,DS=12;function zS(n,i,s,r,u){let f,d,h=0;do d=i+(s-i)/2,f=zy(d,r,u)-n,f>0?s=d:i=d;while(Math.abs(f)>RS&&++h<DS);return d}function Ql(n,i,s,r){if(n===i&&s===r)return Ge;const u=f=>zS(f,0,1,n,s);return f=>f===0||f===1?f:zy(u(f),i,r)}const Oy=n=>i=>i<=.5?n(2*i)/2:(2-n(2*(1-i)))/2,ky=n=>i=>1-n(1-i),Vy=Ql(.33,1.53,.69,.99),Yf=ky(Vy),By=Oy(Yf),_y=n=>n>=1?1:(n*=2)<1?.5*Yf(n):.5*(2-Math.pow(2,-10*(n-1))),qf=n=>1-Math.sin(Math.acos(n)),Ly=ky(qf),Uy=Oy(qf),OS=Ql(.42,0,1,1),kS=Ql(0,0,.58,1),Hy=Ql(.42,0,.58,1),VS=n=>Array.isArray(n)&&typeof n[0]!="number",Gy=n=>Array.isArray(n)&&typeof n[0]=="number",BS={linear:Ge,easeIn:OS,easeInOut:Hy,easeOut:kS,circIn:qf,circInOut:Uy,circOut:Ly,backIn:Yf,backInOut:By,backOut:Vy,anticipate:_y},_S=n=>typeof n=="string",z0=n=>{if(Gy(n)){Hf(n.length===4);const[i,s,r,u]=n;return Ql(i,s,r,u)}else if(_S(n))return BS[n];return n},mr=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function LS(n){let i=new Set,s=new Set,r=!1,u=!1;const f=new WeakSet;let d={delta:0,timestamp:0,isProcessing:!1};function h(g){f.has(g)&&(p.schedule(g),n()),g(d)}const p={schedule:(g,x=!1,b=!1)=>{const E=b&&r?i:s;return x&&f.add(g),E.add(g),g},cancel:g=>{s.delete(g),f.delete(g)},process:g=>{if(d=g,r){u=!0;return}r=!0;const x=i;i=s,s=x,i.forEach(h),i.clear(),r=!1,u&&(u=!1,p.process(g))}};return p}const US=40;function Yy(n,i){let s=!1,r=!0;const u={delta:0,timestamp:0,isProcessing:!1},f=()=>s=!0,d=mr.reduce((z,U)=>(z[U]=LS(f),z),{}),{setup:h,read:p,resolveKeyframes:g,preUpdate:x,update:b,preRender:v,render:E,postRender:A}=d,R=()=>{const z=na.useManualTiming,U=z?u.timestamp:performance.now();s=!1,z||(u.delta=r?1e3/60:Math.max(Math.min(U-u.timestamp,US),1)),u.timestamp=U,u.isProcessing=!0,h.process(u),p.process(u),g.process(u),x.process(u),b.process(u),v.process(u),E.process(u),A.process(u),u.isProcessing=!1,s&&i&&(r=!1,n(R))},T=()=>{s=!0,r=!0,u.isProcessing||n(R)};return{schedule:mr.reduce((z,U)=>{const K=d[U];return z[U]=(I,X=!1,Q=!1)=>(s||T(),K.schedule(I,X,Q)),z},{}),cancel:z=>{for(let U=0;U<mr.length;U++)d[mr[U]].cancel(z)},state:u,steps:d}}const{schedule:kt,cancel:aa,state:le,steps:Nc}=Yy(typeof requestAnimationFrame<"u"?requestAnimationFrame:Ge,!0);let Er;function HS(){Er=void 0}const ce={now:()=>(Er===void 0&&ce.set(le.isProcessing||na.useManualTiming?le.timestamp:performance.now()),Er),set:n=>{Er=n,queueMicrotask(HS)}},qy=n=>i=>typeof i=="string"&&i.startsWith(n),Xy=qy("--"),GS=qy("var(--"),Xf=n=>GS(n)?YS.test(n.split("/*")[0].trim()):!1,YS=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function O0(n){return typeof n!="string"?!1:n.split("/*")[0].includes("var(--")}const Ai={test:n=>typeof n=="number",parse:parseFloat,transform:n=>n},Ll={...Ai,transform:n=>sn(0,1,n)},pr={...Ai,default:1},zl=n=>Math.round(n*1e5)/1e5,Kf=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function qS(n){return n==null}const XS=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,Qf=(n,i)=>s=>!!(typeof s=="string"&&XS.test(s)&&s.startsWith(n)||i&&!qS(s)&&Object.prototype.hasOwnProperty.call(s,i)),Ky=(n,i,s)=>r=>{if(typeof r!="string")return r;const[u,f,d,h]=r.match(Kf);return{[n]:parseFloat(u),[i]:parseFloat(f),[s]:parseFloat(d),alpha:h!==void 0?parseFloat(h):1}},KS=n=>sn(0,255,n),Mc={...Ai,transform:n=>Math.round(KS(n))},Ca={test:Qf("rgb","red"),parse:Ky("red","green","blue"),transform:({red:n,green:i,blue:s,alpha:r=1})=>"rgba("+Mc.transform(n)+", "+Mc.transform(i)+", "+Mc.transform(s)+", "+zl(Ll.transform(r))+")"};function QS(n){let i="",s="",r="",u="";return n.length>5?(i=n.substring(1,3),s=n.substring(3,5),r=n.substring(5,7),u=n.substring(7,9)):(i=n.substring(1,2),s=n.substring(2,3),r=n.substring(3,4),u=n.substring(4,5),i+=i,s+=s,r+=r,u+=u),{red:parseInt(i,16),green:parseInt(s,16),blue:parseInt(r,16),alpha:u?parseInt(u,16)/255:1}}const $c={test:Qf("#"),parse:QS,transform:Ca.transform},Zl=n=>({test:i=>typeof i=="string"&&i.endsWith(n)&&i.split(" ").length===1,parse:parseFloat,transform:i=>`${i}${n}`}),Cn=Zl("deg"),an=Zl("%"),tt=Zl("px"),ZS=Zl("vh"),FS=Zl("vw"),k0={...an,parse:n=>an.parse(n)/100,transform:n=>an.transform(n*100)},bi={test:Qf("hsl","hue"),parse:Ky("hue","saturation","lightness"),transform:({hue:n,saturation:i,lightness:s,alpha:r=1})=>"hsla("+Math.round(n)+", "+an.transform(zl(i))+", "+an.transform(zl(s))+", "+zl(Ll.transform(r))+")"},Jt={test:n=>Ca.test(n)||$c.test(n)||bi.test(n),parse:n=>Ca.test(n)?Ca.parse(n):bi.test(n)?bi.parse(n):$c.parse(n),transform:n=>typeof n=="string"?n:n.hasOwnProperty("red")?Ca.transform(n):bi.transform(n),getAnimatableNone:n=>{const i=Jt.parse(n);return i.alpha=0,Jt.transform(i)}},JS=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function PS(n){var i,s;return isNaN(n)&&typeof n=="string"&&(((i=n.match(Kf))==null?void 0:i.length)||0)+(((s=n.match(JS))==null?void 0:s.length)||0)>0}const Qy="number",Zy="color",$S="var",WS="var(",V0="${}",IS=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function ji(n){const i=n.toString(),s=[],r={color:[],number:[],var:[]},u=[];let f=0;const h=i.replace(IS,p=>(Jt.test(p)?(r.color.push(f),u.push(Zy),s.push(Jt.parse(p))):p.startsWith(WS)?(r.var.push(f),u.push($S),s.push(p)):(r.number.push(f),u.push(Qy),s.push(parseFloat(p))),++f,V0)).split(V0);return{values:s,split:h,indexes:r,types:u}}function t5(n){return ji(n).values}function Fy({split:n,types:i}){const s=n.length;return r=>{let u="";for(let f=0;f<s;f++)if(u+=n[f],r[f]!==void 0){const d=i[f];d===Qy?u+=zl(r[f]):d===Zy?u+=Jt.transform(r[f]):u+=r[f]}return u}}function e5(n){return Fy(ji(n))}const n5=n=>typeof n=="number"?0:Jt.test(n)?Jt.getAnimatableNone(n):n,a5=(n,i)=>typeof n=="number"?i!=null&&i.trim().endsWith("/")?n:0:n5(n);function i5(n){const i=ji(n);return Fy(i)(i.values.map((r,u)=>a5(r,i.split[u])))}const Je={test:PS,parse:t5,createTransformer:e5,getAnimatableNone:i5};function Rc(n,i,s){return s<0&&(s+=1),s>1&&(s-=1),s<1/6?n+(i-n)*6*s:s<1/2?i:s<2/3?n+(i-n)*(2/3-s)*6:n}function l5({hue:n,saturation:i,lightness:s,alpha:r}){n/=360,i/=100,s/=100;let u=0,f=0,d=0;if(!i)u=f=d=s;else{const h=s<.5?s*(1+i):s+i-s*i,p=2*s-h;u=Rc(p,h,n+1/3),f=Rc(p,h,n),d=Rc(p,h,n-1/3)}return{red:Math.round(u*255),green:Math.round(f*255),blue:Math.round(d*255),alpha:r}}function Vr(n,i){return s=>s>0?i:n}const Ot=(n,i,s)=>n+(i-n)*s,Dc=(n,i,s)=>{const r=n*n,u=s*(i*i-r)+r;return u<0?0:Math.sqrt(u)},s5=[$c,Ca,bi],r5=n=>s5.find(i=>i.test(n));function B0(n){const i=r5(n);if(!i)return!1;let s=i.parse(n);return i===bi&&(s=l5(s)),s}const _0=(n,i)=>{const s=B0(n),r=B0(i);if(!s||!r)return Vr(n,i);const u={...s};return f=>(u.red=Dc(s.red,r.red,f),u.green=Dc(s.green,r.green,f),u.blue=Dc(s.blue,r.blue,f),u.alpha=Ot(s.alpha,r.alpha,f),Ca.transform(u))},Wc=new Set(["none","hidden"]);function o5(n,i){return Wc.has(n)?s=>s<=0?n:i:s=>s>=1?i:n}function u5(n,i){return s=>Ot(n,i,s)}function Zf(n){return typeof n=="number"?u5:typeof n=="string"?Xf(n)?Vr:Jt.test(n)?_0:d5:Array.isArray(n)?Jy:typeof n=="object"?Jt.test(n)?_0:c5:Vr}function Jy(n,i){const s=[...n],r=s.length,u=n.map((f,d)=>Zf(f)(f,i[d]));return f=>{for(let d=0;d<r;d++)s[d]=u[d](f);return s}}function c5(n,i){const s={...n,...i},r={};for(const u in s)n[u]!==void 0&&i[u]!==void 0&&(r[u]=Zf(n[u])(n[u],i[u]));return u=>{for(const f in r)s[f]=r[f](u);return s}}function f5(n,i){const s=[],r={color:0,var:0,number:0};for(let u=0;u<i.values.length;u++){const f=i.types[u],d=n.indexes[f][r[f]],h=n.values[d]??0;s[u]=h,r[f]++}return s}const d5=(n,i)=>{const s=Je.createTransformer(i),r=ji(n),u=ji(i);return r.indexes.var.length===u.indexes.var.length&&r.indexes.color.length===u.indexes.color.length&&r.indexes.number.length>=u.indexes.number.length?Wc.has(n)&&!u.values.length||Wc.has(i)&&!r.values.length?o5(n,i):Kl(Jy(f5(r,u),u.values),s):Vr(n,i)};function Py(n,i,s){return typeof n=="number"&&typeof i=="number"&&typeof s=="number"?Ot(n,i,s):Zf(n)(n,i)}const h5=n=>{const i=({timestamp:s})=>n(s);return{start:(s=!0)=>kt.update(i,s),stop:()=>aa(i),now:()=>le.isProcessing?le.timestamp:ce.now()}},$y=(n,i,s=10)=>{let r="";const u=Math.max(Math.round(i/s),2);for(let f=0;f<u;f++)r+=Math.round(n(f/(u-1))*1e4)/1e4+", ";return`linear(${r.substring(0,r.length-2)})`},Br=2e4;function Ff(n){let i=0;const s=50;let r=n.next(i);for(;!r.done&&i<Br;)i+=s,r=n.next(i);return i>=Br?1/0:i}function m5(n,i=100,s){const r=s({...n,keyframes:[0,i]}),u=Math.min(Ff(r),Br);return{type:"keyframes",ease:f=>r.next(u*f).value/i,duration:He(u)}}const Gt={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function Ic(n,i){return n*Math.sqrt(1-i*i)}const p5=12;function g5(n,i,s){let r=s;for(let u=1;u<p5;u++)r=r-n(r)/i(r);return r}const zc=.001;function y5({duration:n=Gt.duration,bounce:i=Gt.bounce,velocity:s=Gt.velocity,mass:r=Gt.mass}){let u,f,d=1-i;d=sn(Gt.minDamping,Gt.maxDamping,d),n=sn(Gt.minDuration,Gt.maxDuration,He(n)),d<1?(u=g=>{const x=g*d,b=x*n,v=x-s,E=Ic(g,d),A=Math.exp(-b);return zc-v/E*A},f=g=>{const b=g*d*n,v=b*s+s,E=Math.pow(d,2)*Math.pow(g,2)*n,A=Math.exp(-b),R=Ic(Math.pow(g,2),d);return(-u(g)+zc>0?-1:1)*((v-E)*A)/R}):(u=g=>{const x=Math.exp(-g*n),b=(g-s)*n+1;return-zc+x*b},f=g=>{const x=Math.exp(-g*n),b=(s-g)*(n*n);return x*b});const h=5/n,p=g5(u,f,h);if(n=Me(n),isNaN(p))return{stiffness:Gt.stiffness,damping:Gt.damping,duration:n};{const g=Math.pow(p,2)*r;return{stiffness:g,damping:d*2*Math.sqrt(r*g),duration:n}}}const x5=["duration","bounce"],b5=["stiffness","damping","mass"];function L0(n,i){return i.some(s=>n[s]!==void 0)}function v5(n){let i={velocity:Gt.velocity,stiffness:Gt.stiffness,damping:Gt.damping,mass:Gt.mass,isResolvedFromDuration:!1,...n};if(!L0(n,b5)&&L0(n,x5))if(i.velocity=0,n.visualDuration){const s=n.visualDuration,r=2*Math.PI/(s*1.2),u=r*r,f=2*sn(.05,1,1-(n.bounce||0))*Math.sqrt(u);i={...i,mass:Gt.mass,stiffness:u,damping:f}}else{const s=y5({...n,velocity:0});i={...i,...s,mass:Gt.mass},i.isResolvedFromDuration=!0}return i}function _r(n=Gt.visualDuration,i=Gt.bounce){const s=typeof n!="object"?{visualDuration:n,keyframes:[0,1],bounce:i}:n;let{restSpeed:r,restDelta:u}=s;const f=s.keyframes[0],d=s.keyframes[s.keyframes.length-1],h={done:!1,value:f},{stiffness:p,damping:g,mass:x,duration:b,velocity:v,isResolvedFromDuration:E}=v5({...s,velocity:-He(s.velocity||0)}),A=v||0,R=g/(2*Math.sqrt(p*x)),T=d-f,C=He(Math.sqrt(p/x)),_=Math.abs(T)<5;r||(r=_?Gt.restSpeed.granular:Gt.restSpeed.default),u||(u=_?Gt.restDelta.granular:Gt.restDelta.default);let z,U,K,I,X,Q;if(R<1)K=Ic(C,R),I=(A+R*C*T)/K,z=P=>{const at=Math.exp(-R*C*P);return d-at*(I*Math.sin(K*P)+T*Math.cos(K*P))},X=R*C*I+T*K,Q=R*C*T-I*K,U=P=>Math.exp(-R*C*P)*(X*Math.sin(K*P)+Q*Math.cos(K*P));else if(R===1){z=at=>d-Math.exp(-C*at)*(T+(A+C*T)*at);const P=A+C*T;U=at=>Math.exp(-C*at)*(C*P*at-A)}else{const P=C*Math.sqrt(R*R-1);z=mt=>{const ot=Math.exp(-R*C*mt),B=Math.min(P*mt,300);return d-ot*((A+R*C*T)*Math.sinh(B)+P*T*Math.cosh(B))/P};const at=(A+R*C*T)/P,ft=R*C*at-T*P,lt=R*C*T-at*P;U=mt=>{const ot=Math.exp(-R*C*mt),B=Math.min(P*mt,300);return ot*(ft*Math.sinh(B)+lt*Math.cosh(B))}}const et={calculatedDuration:E&&b||null,velocity:P=>Me(U(P)),next:P=>{if(!E&&R<1){const ft=Math.exp(-R*C*P),lt=Math.sin(K*P),mt=Math.cos(K*P),ot=d-ft*(I*lt+T*mt),B=Me(ft*(X*lt+Q*mt));return h.done=Math.abs(B)<=r&&Math.abs(d-ot)<=u,h.value=h.done?d:ot,h}const at=z(P);if(E)h.done=P>=b;else{const ft=Me(U(P));h.done=Math.abs(ft)<=r&&Math.abs(d-at)<=u}return h.value=h.done?d:at,h},toString:()=>{const P=Math.min(Ff(et),Br),at=$y(ft=>et.next(P*ft).value,P,30);return P+"ms "+at},toTransition:()=>{}};return et}_r.applyToOptions=n=>{const i=m5(n,100,_r);return n.ease=i.ease,n.duration=Me(i.duration),n.type="keyframes",n};const S5=5;function Wy(n,i,s){const r=Math.max(i-S5,0);return Dy(s-n(r),i-r)}function tf({keyframes:n,velocity:i=0,power:s=.8,timeConstant:r=325,bounceDamping:u=10,bounceStiffness:f=500,modifyTarget:d,min:h,max:p,restDelta:g=.5,restSpeed:x}){const b=n[0],v={done:!1,value:b},E=Q=>h!==void 0&&Q<h||p!==void 0&&Q>p,A=Q=>h===void 0?p:p===void 0||Math.abs(h-Q)<Math.abs(p-Q)?h:p;let R=s*i;const T=b+R,C=d===void 0?T:d(T);C!==T&&(R=C-b);const _=Q=>-R*Math.exp(-Q/r),z=Q=>C+_(Q),U=Q=>{const et=_(Q),P=z(Q);v.done=Math.abs(et)<=g,v.value=v.done?C:P};let K,I;const X=Q=>{E(v.value)&&(K=Q,I=_r({keyframes:[v.value,A(v.value)],velocity:Wy(z,Q,v.value),damping:u,stiffness:f,restDelta:g,restSpeed:x}))};return X(0),{calculatedDuration:null,next:Q=>{let et=!1;return!I&&K===void 0&&(et=!0,U(Q),X(Q)),K!==void 0&&Q>=K?I.next(Q-K):(!et&&U(Q),v)}}}function j5(n,i,s){const r=[],u=s||na.mix||Py,f=n.length-1;for(let d=0;d<f;d++){let h=u(n[d],n[d+1]);if(i){const p=Array.isArray(i)?i[d]||Ge:i;h=Kl(p,h)}r.push(h)}return r}function T5(n,i,{clamp:s=!0,ease:r,mixer:u}={}){const f=n.length;if(Hf(f===i.length),f===1)return()=>i[0];if(f===2&&i[0]===i[1])return()=>i[1];const d=n[0]===n[1];n[0]>n[f-1]&&(n=[...n].reverse(),i=[...i].reverse());const h=j5(i,r,u),p=h.length,g=x=>{if(d&&x<n[0])return i[0];let b=0;if(p>1)for(;b<n.length-2&&!(x<n[b+1]);b++);const v=_l(n[b],n[b+1],x);return h[b](v)};return s?x=>g(sn(n[0],n[f-1],x)):g}function E5(n,i){const s=n[n.length-1];for(let r=1;r<=i;r++){const u=_l(0,i,r);n.push(Ot(s,1,u))}}function w5(n){const i=[0];return E5(i,n.length-1),i}function A5(n,i){return n.map(s=>s*i)}function C5(n,i){return n.map(()=>i||Hy).splice(0,n.length-1)}function Ol({duration:n=300,keyframes:i,times:s,ease:r="easeInOut"}){const u=VS(r)?r.map(z0):z0(r),f={done:!1,value:i[0]},d=A5(s&&s.length===i.length?s:w5(i),n),h=T5(d,i,{ease:Array.isArray(u)?u:C5(i,u)});return{calculatedDuration:n,next:p=>(f.value=h(p),f.done=p>=n,f)}}const N5=n=>n!==null;function Pr(n,{repeat:i,repeatType:s="loop"},r,u=1){const f=n.filter(N5),h=u<0||i&&s!=="loop"&&i%2===1?0:f.length-1;return!h||r===void 0?f[h]:r}const M5={decay:tf,inertia:tf,tween:Ol,keyframes:Ol,spring:_r};function Iy(n){typeof n.type=="string"&&(n.type=M5[n.type])}class Jf{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(i=>{this.resolve=i})}notifyFinished(){this.resolve()}then(i,s){return this.finished.then(i,s)}}const R5=n=>n/100;class Lr extends Jf{constructor(i){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{var r,u;const{motionValue:s}=this.options;s&&s.updatedAt!==ce.now()&&this.tick(ce.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),(u=(r=this.options).onStop)==null||u.call(r))},this.options=i,this.initAnimation(),this.play(),i.autoplay===!1&&this.pause()}initAnimation(){const{options:i}=this;Iy(i);const{type:s=Ol,repeat:r=0,repeatDelay:u=0,repeatType:f,velocity:d=0}=i;let{keyframes:h}=i;const p=s||Ol;p!==Ol&&typeof h[0]!="number"&&(this.mixKeyframes=Kl(R5,Py(h[0],h[1])),h=[0,100]);const g=p({...i,keyframes:h});f==="mirror"&&(this.mirroredGenerator=p({...i,keyframes:[...h].reverse(),velocity:-d})),g.calculatedDuration===null&&(g.calculatedDuration=Ff(g));const{calculatedDuration:x}=g;this.calculatedDuration=x,this.resolvedDuration=x+u,this.totalDuration=this.resolvedDuration*(r+1)-u,this.generator=g}updateTime(i){const s=Math.round(i-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=s}tick(i,s=!1){const{generator:r,totalDuration:u,mixKeyframes:f,mirroredGenerator:d,resolvedDuration:h,calculatedDuration:p}=this;if(this.startTime===null)return r.next(0);const{delay:g=0,keyframes:x,repeat:b,repeatType:v,repeatDelay:E,type:A,onUpdate:R,finalKeyframe:T}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,i):this.speed<0&&(this.startTime=Math.min(i-u/this.speed,this.startTime)),s?this.currentTime=i:this.updateTime(i);const C=this.currentTime-g*(this.playbackSpeed>=0?1:-1),_=this.playbackSpeed>=0?C<0:C>u;this.currentTime=Math.max(C,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=u);let z=this.currentTime,U=r;if(b){const Q=Math.min(this.currentTime,u)/h;let et=Math.floor(Q),P=Q%1;!P&&Q>=1&&(P=1),P===1&&et--,et=Math.min(et,b+1),!!(et%2)&&(v==="reverse"?(P=1-P,E&&(P-=E/h)):v==="mirror"&&(U=d)),z=sn(0,1,P)*h}let K;_?(this.delayState.value=x[0],K=this.delayState):K=U.next(z),f&&!_&&(K.value=f(K.value));let{done:I}=K;!_&&p!==null&&(I=this.playbackSpeed>=0?this.currentTime>=u:this.currentTime<=0);const X=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&I);return X&&A!==tf&&(K.value=Pr(x,this.options,T,this.speed)),R&&R(K.value),X&&this.finish(),K}then(i,s){return this.finished.then(i,s)}get duration(){return He(this.calculatedDuration)}get iterationDuration(){const{delay:i=0}=this.options||{};return this.duration+He(i)}get time(){return He(this.currentTime)}set time(i){i=Me(i),this.currentTime=i,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=i:this.driver&&(this.startTime=this.driver.now()-i/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=i,this.tick(i))}getGeneratorVelocity(){const i=this.currentTime;if(i<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(i);const s=this.generator.next(i).value;return Wy(r=>this.generator.next(r).value,i,s)}get speed(){return this.playbackSpeed}set speed(i){const s=this.playbackSpeed!==i;s&&this.driver&&this.updateTime(ce.now()),this.playbackSpeed=i,s&&this.driver&&(this.time=He(this.currentTime))}play(){var u,f;if(this.isStopped)return;const{driver:i=h5,startTime:s}=this.options;this.driver||(this.driver=i(d=>this.tick(d))),(f=(u=this.options).onPlay)==null||f.call(u);const r=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=r):this.holdTime!==null?this.startTime=r-this.holdTime:this.startTime||(this.startTime=s??r),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(ce.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){var i,s;this.notifyFinished(),this.teardown(),this.state="finished",(s=(i=this.options).onComplete)==null||s.call(i)}cancel(){var i,s;this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),(s=(i=this.options).onCancel)==null||s.call(i)}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(i){return this.startTime=0,this.tick(i,!0)}attachTimeline(i){var s;return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),(s=this.driver)==null||s.stop(),i.observe(this)}}function D5(n){for(let i=1;i<n.length;i++)n[i]??(n[i]=n[i-1])}const Na=n=>n*180/Math.PI,ef=n=>{const i=Na(Math.atan2(n[1],n[0]));return nf(i)},z5={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:n=>(Math.abs(n[0])+Math.abs(n[3]))/2,rotate:ef,rotateZ:ef,skewX:n=>Na(Math.atan(n[1])),skewY:n=>Na(Math.atan(n[2])),skew:n=>(Math.abs(n[1])+Math.abs(n[2]))/2},nf=n=>(n=n%360,n<0&&(n+=360),n),U0=ef,H0=n=>Math.sqrt(n[0]*n[0]+n[1]*n[1]),G0=n=>Math.sqrt(n[4]*n[4]+n[5]*n[5]),O5={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:H0,scaleY:G0,scale:n=>(H0(n)+G0(n))/2,rotateX:n=>nf(Na(Math.atan2(n[6],n[5]))),rotateY:n=>nf(Na(Math.atan2(-n[2],n[0]))),rotateZ:U0,rotate:U0,skewX:n=>Na(Math.atan(n[4])),skewY:n=>Na(Math.atan(n[1])),skew:n=>(Math.abs(n[1])+Math.abs(n[4]))/2};function af(n){return n.includes("scale")?1:0}function lf(n,i){if(!n||n==="none")return af(i);const s=n.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let r,u;if(s)r=O5,u=s;else{const h=n.match(/^matrix\(([-\d.e\s,]+)\)$/u);r=z5,u=h}if(!u)return af(i);const f=r[i],d=u[1].split(",").map(V5);return typeof f=="function"?f(d):d[f]}const k5=(n,i)=>{const{transform:s="none"}=getComputedStyle(n);return lf(s,i)};function V5(n){return parseFloat(n.trim())}const Ci=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],Ni=new Set([...Ci,"pathRotation"]),Y0=n=>n===Ai||n===tt,B5=new Set(["x","y","z"]),_5=Ci.filter(n=>!B5.has(n));function L5(n){const i=[];return _5.forEach(s=>{const r=n.getValue(s);r!==void 0&&(i.push([s,r.get()]),r.set(s.startsWith("scale")?1:0))}),i}const ea={width:({x:n},{paddingLeft:i="0",paddingRight:s="0",boxSizing:r})=>{const u=n.max-n.min;return r==="border-box"?u:u-parseFloat(i)-parseFloat(s)},height:({y:n},{paddingTop:i="0",paddingBottom:s="0",boxSizing:r})=>{const u=n.max-n.min;return r==="border-box"?u:u-parseFloat(i)-parseFloat(s)},top:(n,{top:i})=>parseFloat(i),left:(n,{left:i})=>parseFloat(i),bottom:({y:n},{top:i})=>parseFloat(i)+(n.max-n.min),right:({x:n},{left:i})=>parseFloat(i)+(n.max-n.min),x:(n,{transform:i})=>lf(i,"x"),y:(n,{transform:i})=>lf(i,"y")};ea.translateX=ea.x;ea.translateY=ea.y;const Ra=new Set;let sf=!1,rf=!1,of=!1;function tx(){if(rf){const n=Array.from(Ra).filter(r=>r.needsMeasurement),i=new Set(n.map(r=>r.element)),s=new Map;i.forEach(r=>{const u=L5(r);u.length&&(s.set(r,u),r.render())}),n.forEach(r=>r.measureInitialState()),i.forEach(r=>{r.render();const u=s.get(r);u&&u.forEach(([f,d])=>{var h;(h=r.getValue(f))==null||h.set(d)})}),n.forEach(r=>r.measureEndState()),n.forEach(r=>{r.suspendedScrollY!==void 0&&window.scrollTo(0,r.suspendedScrollY)})}rf=!1,sf=!1,Ra.forEach(n=>n.complete(of)),Ra.clear()}function ex(){Ra.forEach(n=>{n.readKeyframes(),n.needsMeasurement&&(rf=!0)})}function U5(){of=!0,ex(),tx(),of=!1}class Pf{constructor(i,s,r,u,f,d=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...i],this.onComplete=s,this.name=r,this.motionValue=u,this.element=f,this.isAsync=d}scheduleResolve(){this.state="scheduled",this.isAsync?(Ra.add(this),sf||(sf=!0,kt.read(ex),kt.resolveKeyframes(tx))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:i,name:s,element:r,motionValue:u}=this;if(i[0]===null){const f=u==null?void 0:u.get(),d=i[i.length-1];if(f!==void 0)i[0]=f;else if(r&&s){const h=r.readValue(s,d);h!=null&&(i[0]=h)}i[0]===void 0&&(i[0]=d),u&&f===void 0&&u.set(i[0])}D5(i)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(i=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,i),Ra.delete(this)}cancel(){this.state==="scheduled"&&(Ra.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const H5=n=>n.startsWith("--");function nx(n,i,s){H5(i)?n.style.setProperty(i,s):n.style[i]=s}const G5={};function ax(n,i){const s=Ry(n);return()=>G5[i]??s()}const Y5=ax(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),ix=ax(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),Dl=([n,i,s,r])=>`cubic-bezier(${n}, ${i}, ${s}, ${r})`,q0={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Dl([0,.65,.55,1]),circOut:Dl([.55,0,1,.45]),backIn:Dl([.31,.01,.66,-.59]),backOut:Dl([.33,1.53,.69,.99])};function lx(n,i){if(n)return typeof n=="function"?ix()?$y(n,i):"ease-out":Gy(n)?Dl(n):Array.isArray(n)?n.map(s=>lx(s,i)||q0.easeOut):q0[n]}function q5(n,i,s,{delay:r=0,duration:u=300,repeat:f=0,repeatType:d="loop",ease:h="easeOut",times:p}={},g=void 0){const x={[i]:s};p&&(x.offset=p);const b=lx(h,u);Array.isArray(b)&&(x.easing=b);const v={delay:r,duration:u,easing:Array.isArray(b)?"linear":b,fill:"both",iterations:f+1,direction:d==="reverse"?"alternate":"normal"};return g&&(v.pseudoElement=g),n.animate(x,v)}function sx(n){return typeof n=="function"&&"applyToOptions"in n}function X5({type:n,...i}){return sx(n)&&ix()?n.applyToOptions(i):(i.duration??(i.duration=300),i.ease??(i.ease="easeOut"),i)}class rx extends Jf{constructor(i){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!i)return;const{element:s,name:r,keyframes:u,pseudoElement:f,allowFlatten:d=!1,finalKeyframe:h,onComplete:p}=i;this.isPseudoElement=!!f,this.allowFlatten=d,this.options=i,Hf(typeof i.type!="string");const g=X5(i);this.animation=q5(s,r,u,g,f),g.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!f){const x=Pr(u,this.options,h,this.speed);this.updateMotionValue&&this.updateMotionValue(x),nx(s,r,x),this.animation.cancel()}p==null||p(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){var i,s;(s=(i=this.animation).finish)==null||s.call(i)}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:i}=this;i==="idle"||i==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){var s,r,u;const i=(s=this.options)==null?void 0:s.element;!this.isPseudoElement&&(i!=null&&i.isConnected)&&((u=(r=this.animation).commitStyles)==null||u.call(r))}get duration(){var s,r;const i=((r=(s=this.animation.effect)==null?void 0:s.getComputedTiming)==null?void 0:r.call(s).duration)||0;return He(Number(i))}get iterationDuration(){const{delay:i=0}=this.options||{};return this.duration+He(i)}get time(){return He(Number(this.animation.currentTime)||0)}set time(i){const s=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=Me(i),s&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(i){i<0&&(this.finishedTime=null),this.animation.playbackRate=i}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(i){this.manualStartTime=this.animation.startTime=i}attachTimeline({timeline:i,rangeStart:s,rangeEnd:r,observe:u}){var f;return this.allowFlatten&&((f=this.animation.effect)==null||f.updateTiming({easing:"linear"})),this.animation.onfinish=null,i&&Y5()?(this.animation.timeline=i,s&&(this.animation.rangeStart=s),r&&(this.animation.rangeEnd=r),Ge):u(this)}}const ox={anticipate:_y,backInOut:By,circInOut:Uy};function K5(n){return n in ox}function Q5(n){typeof n.ease=="string"&&K5(n.ease)&&(n.ease=ox[n.ease])}const Oc=10;class Z5 extends rx{constructor(i){Q5(i),Iy(i),super(i),i.startTime!==void 0&&i.autoplay!==!1&&(this.startTime=i.startTime),this.options=i}updateMotionValue(i){const{motionValue:s,onUpdate:r,onComplete:u,element:f,...d}=this.options;if(!s)return;if(i!==void 0){s.set(i);return}const h=new Lr({...d,autoplay:!1}),p=Math.max(Oc,ce.now()-this.startTime),g=sn(0,Oc,p-Oc),x=h.sample(p).value,{name:b}=this.options;f&&b&&nx(f,b,x),s.setWithVelocity(h.sample(Math.max(0,p-g)).value,x,g),h.stop()}}const X0=(n,i)=>i==="zIndex"?!1:!!(typeof n=="number"||Array.isArray(n)||typeof n=="string"&&(Je.test(n)||n==="0")&&!n.startsWith("url("));function F5(n){const i=n[0];if(n.length===1)return!0;for(let s=0;s<n.length;s++)if(n[s]!==i)return!0}function J5(n,i,s,r){const u=n[0];if(u===null)return!1;if(i==="display"||i==="visibility")return!0;const f=n[n.length-1],d=X0(u,i),h=X0(f,i);return!d||!h?!1:F5(n)||(s==="spring"||sx(s))&&r}function uf(n){n.duration=0,n.type="keyframes"}const ux=new Set(["opacity","clipPath","filter","transform"]),P5=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function $5(n){for(let i=0;i<n.length;i++)if(typeof n[i]=="string"&&P5.test(n[i]))return!0;return!1}const W5=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),I5=Ry(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function tj(n){var b;const{motionValue:i,name:s,repeatDelay:r,repeatType:u,damping:f,type:d,keyframes:h}=n;if(!(((b=i==null?void 0:i.owner)==null?void 0:b.current)instanceof HTMLElement))return!1;const{onUpdate:g,transformTemplate:x}=i.owner.getProps();return I5()&&s&&(ux.has(s)||W5.has(s)&&$5(h))&&(s!=="transform"||!x)&&!g&&!r&&u!=="mirror"&&f!==0&&d!=="inertia"}const ej=40;class nj extends Jf{constructor({autoplay:i=!0,delay:s=0,type:r="keyframes",repeat:u=0,repeatDelay:f=0,repeatType:d="loop",keyframes:h,name:p,motionValue:g,element:x,...b}){var A;super(),this.stop=()=>{var R,T;this._animation&&(this._animation.stop(),(R=this.stopTimeline)==null||R.call(this)),(T=this.keyframeResolver)==null||T.cancel()},this.createdAt=ce.now();const v={autoplay:i,delay:s,type:r,repeat:u,repeatDelay:f,repeatType:d,name:p,motionValue:g,element:x,...b},E=(x==null?void 0:x.KeyframeResolver)||Pf;this.keyframeResolver=new E(h,(R,T,C)=>this.onKeyframesResolved(R,T,v,!C),p,g,x),(A=this.keyframeResolver)==null||A.scheduleResolve()}onKeyframesResolved(i,s,r,u){var C,_;this.keyframeResolver=void 0;const{name:f,type:d,velocity:h,delay:p,isHandoff:g,onUpdate:x}=r;this.resolvedAt=ce.now();let b=!0;J5(i,f,d,h)||(b=!1,(na.instantAnimations||!p)&&(x==null||x(Pr(i,r,s))),i[0]=i[i.length-1],uf(r),r.repeat=0);const E={startTime:u?this.resolvedAt?this.resolvedAt-this.createdAt>ej?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:s,...r,keyframes:i},A=b&&!g&&tj(E),R=(_=(C=E.motionValue)==null?void 0:C.owner)==null?void 0:_.current;let T;if(A)try{T=new Z5({...E,element:R})}catch{T=new Lr(E)}else T=new Lr(E);T.finished.then(()=>{this.notifyFinished()}).catch(Ge),this.pendingTimeline&&(this.stopTimeline=T.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=T}get finished(){return this._animation?this.animation.finished:this._finished}then(i,s){return this.finished.finally(i).then(()=>{})}get animation(){var i;return this._animation||((i=this.keyframeResolver)==null||i.resume(),U5()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(i){this.animation.time=i}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(i){this.animation.speed=i}get startTime(){return this.animation.startTime}attachTimeline(i){return this._animation?this.stopTimeline=this.animation.attachTimeline(i):this.pendingTimeline=i,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){var i;this._animation&&this.animation.cancel(),(i=this.keyframeResolver)==null||i.cancel()}}function cx(n,i,s,r=0,u=1){const f=Array.from(n).sort((g,x)=>g.sortNodePosition(x)).indexOf(i),d=n.size,h=(d-1)*r;return typeof s=="function"?s(f,d):u===1?f*r:h-f*r}const K0=30,aj=n=>!isNaN(parseFloat(n));class ij{constructor(i,s={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=r=>{var f;const u=ce.now();if(this.updatedAt!==u&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(r),this.current!==this.prev&&((f=this.events.change)==null||f.notify(this.current),this.dependents))for(const d of this.dependents)d.dirty()},this.hasAnimated=!1,this.setCurrent(i),this.owner=s.owner}setCurrent(i){this.current=i,this.updatedAt=ce.now(),this.canTrackVelocity===null&&i!==void 0&&(this.canTrackVelocity=aj(this.current))}setPrevFrameValue(i=this.current){this.prevFrameValue=i,this.prevUpdatedAt=this.updatedAt}onChange(i){return this.on("change",i)}on(i,s){this.events[i]||(this.events[i]=new Gf);const r=this.events[i].add(s);return i==="change"?()=>{r(),kt.read(()=>{this.events.change.getSize()||this.stop()})}:r}clearListeners(){for(const i in this.events)this.events[i].clear()}attach(i,s){this.passiveEffect=i,this.stopPassiveEffect=s}set(i){this.passiveEffect?this.passiveEffect(i,this.updateAndNotify):this.updateAndNotify(i)}setWithVelocity(i,s,r){this.set(s),this.prev=void 0,this.prevFrameValue=i,this.prevUpdatedAt=this.updatedAt-r}jump(i,s=!0){this.updateAndNotify(i),this.prev=i,this.prevUpdatedAt=this.prevFrameValue=void 0,s&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){var i;(i=this.events.change)==null||i.notify(this.current)}addDependent(i){this.dependents||(this.dependents=new Set),this.dependents.add(i)}removeDependent(i){this.dependents&&this.dependents.delete(i)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const i=ce.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||i-this.updatedAt>K0)return 0;const s=Math.min(this.updatedAt-this.prevUpdatedAt,K0);return Dy(parseFloat(this.current)-parseFloat(this.prevFrameValue),s)}start(i){return this.stop(),new Promise(s=>{this.hasAnimated=!0,this.animation=i(s),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){var i,s;(i=this.dependents)==null||i.clear(),(s=this.events.destroy)==null||s.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function Ti(n,i){return new ij(n,i)}function fx(n,i){if(n!=null&&n.inherit&&i){const{inherit:s,...r}=n;return{...i,...r}}return n}function $f(n,i){const s=(n==null?void 0:n[i])??(n==null?void 0:n.default)??n;return s!==n?fx(s,n):s}const lj={type:"spring",stiffness:500,damping:25,restSpeed:10},sj=n=>({type:"spring",stiffness:550,damping:n===0?2*Math.sqrt(550):30,restSpeed:10}),rj={type:"keyframes",duration:.8},oj={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},uj=(n,{keyframes:i})=>i.length>2?rj:Ni.has(n)?n.startsWith("scale")?sj(i[1]):lj:oj,cj=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function fj(n){for(const i in n)if(!cj.has(i))return!0;return!1}const Wf=(n,i,s,r={},u,f)=>d=>{const h=$f(r,n)||{},p=h.delay||r.delay||0;let{elapsed:g=0}=r;g=g-Me(p);const x={keyframes:Array.isArray(s)?s:[null,s],ease:"easeOut",velocity:i.getVelocity(),...h,delay:-g,onUpdate:v=>{i.set(v),h.onUpdate&&h.onUpdate(v)},onComplete:()=>{d(),h.onComplete&&h.onComplete()},name:n,motionValue:i,element:f?void 0:u};fj(h)||Object.assign(x,uj(n,x)),x.duration&&(x.duration=Me(x.duration)),x.repeatDelay&&(x.repeatDelay=Me(x.repeatDelay)),x.from!==void 0&&(x.keyframes[0]=x.from);let b=!1;if((x.type===!1||x.duration===0&&!x.repeatDelay)&&(uf(x),x.delay===0&&(b=!0)),(na.instantAnimations||na.skipAnimations||u!=null&&u.shouldSkipAnimations||h.skipAnimations)&&(b=!0,uf(x),x.delay=0),x.allowFlatten=!h.type&&!h.ease,b&&!f&&i.get()!==void 0){const v=Pr(x.keyframes,h);if(v!==void 0){kt.update(()=>{x.onUpdate(v),x.onComplete()});return}}return h.isSync?new Lr(x):new nj(x)},dj=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function hj(n){const i=dj.exec(n);if(!i)return[,];const[,s,r,u]=i;return[`--${s??r}`,u]}function dx(n,i,s=1){const[r,u]=hj(n);if(!r)return;const f=window.getComputedStyle(i).getPropertyValue(r);if(f){const d=f.trim();return Cy(d)?parseFloat(d):d}return Xf(u)?dx(u,i,s+1):u}function Q0(n){const i=[{},{}];return n==null||n.values.forEach((s,r)=>{i[0][r]=s.get(),i[1][r]=s.getVelocity()}),i}function If(n,i,s,r){if(typeof i=="function"){const[u,f]=Q0(r);i=i(s!==void 0?s:n.custom,u,f)}if(typeof i=="string"&&(i=n.variants&&n.variants[i]),typeof i=="function"){const[u,f]=Q0(r);i=i(s!==void 0?s:n.custom,u,f)}return i}function Da(n,i,s){const r=n.getProps();return If(r,i,s!==void 0?s:r.custom,n)}const hx=new Set(["width","height","top","left","right","bottom",...Ci]),cf=n=>Array.isArray(n);function mj(n,i,s){n.hasValue(i)?n.getValue(i).set(s):n.addValue(i,Ti(s))}function pj(n){return cf(n)?n[n.length-1]||0:n}function gj(n,i){const s=Da(n,i);let{transitionEnd:r={},transition:u={},...f}=s||{};f={...f,...r};for(const d in f){const h=pj(f[d]);mj(n,d,h)}}const se=n=>!!(n&&n.getVelocity);function yj(n){return!!(se(n)&&n.add)}function ff(n,i){const s=n.getValue("willChange");if(yj(s))return s.add(i);if(!s&&na.WillChange){const r=new na.WillChange("auto");n.addValue("willChange",r),r.add(i)}}function td(n){return n.replace(/([A-Z])/g,i=>`-${i.toLowerCase()}`)}const xj="framerAppearId",mx="data-"+td(xj);function px(n){return n.props[mx]}function bj({protectedKeys:n,needsAnimating:i},s){const r=n.hasOwnProperty(s)&&i[s]!==!0;return i[s]=!1,r}function gx(n,i,{delay:s=0,transitionOverride:r,type:u}={}){let{transition:f,transitionEnd:d,...h}=i;const p=n.getDefaultTransition();f=f?fx(f,p):p;const g=f==null?void 0:f.reduceMotion,x=f==null?void 0:f.skipAnimations;r&&(f=r);const b=[],v=u&&n.animationState&&n.animationState.getState()[u],E=f==null?void 0:f.path;E&&E.animateVisualElement(n,h,f,s,b);for(const A in h){const R=n.getValue(A,n.latestValues[A]??null),T=h[A];if(T===void 0||v&&bj(v,A))continue;const C={delay:s,...$f(f||{},A)};x&&(C.skipAnimations=!0);const _=R.get();if(_!==void 0&&!R.isAnimating()&&!Array.isArray(T)&&T===_&&!C.velocity){kt.update(()=>R.set(T));continue}let z=!1;if(window.MotionHandoffAnimation){const I=px(n);if(I){const X=window.MotionHandoffAnimation(I,A,kt);X!==null&&(C.startTime=X,z=!0)}}ff(n,A);const U=g??n.shouldReduceMotion;R.start(Wf(A,R,T,U&&hx.has(A)?{type:!1}:C,n,z));const K=R.animation;K&&b.push(K)}if(d){const A=()=>kt.update(()=>{d&&gj(n,d)});b.length?Promise.all(b).then(A):A()}return b}function df(n,i,s={}){var p;const r=Da(n,i,s.type==="exit"?(p=n.presenceContext)==null?void 0:p.custom:void 0);let{transition:u=n.getDefaultTransition()||{}}=r||{};s.transitionOverride&&(u=s.transitionOverride);const f=r?()=>Promise.all(gx(n,r,s)):()=>Promise.resolve(),d=n.variantChildren&&n.variantChildren.size?(g=0)=>{const{delayChildren:x=0,staggerChildren:b,staggerDirection:v}=u;return vj(n,i,g,x,b,v,s)}:()=>Promise.resolve(),{when:h}=u;if(h){const[g,x]=h==="beforeChildren"?[f,d]:[d,f];return g().then(()=>x())}else return Promise.all([f(),d(s.delay)])}function vj(n,i,s=0,r=0,u=0,f=1,d){const h=[];for(const p of n.variantChildren)p.notify("AnimationStart",i),h.push(df(p,i,{...d,delay:s+(typeof r=="function"?0:r)+cx(n.variantChildren,p,r,u,f)}).then(()=>p.notify("AnimationComplete",i)));return Promise.all(h)}function Sj(n,i,s={}){n.notify("AnimationStart",i);let r;if(Array.isArray(i)){const u=i.map(f=>df(n,f,s));r=Promise.all(u)}else if(typeof i=="string")r=df(n,i,s);else{const u=typeof i=="function"?Da(n,i,s.custom):i;r=Promise.all(gx(n,u,s))}return r.then(()=>{n.notify("AnimationComplete",i)})}const jj={test:n=>n==="auto",parse:n=>n},yx=n=>i=>i.test(n),xx=[Ai,tt,an,Cn,FS,ZS,jj],Z0=n=>xx.find(yx(n));function Tj(n){return typeof n=="number"?n===0:n!==null?n==="none"||n==="0"||My(n):!0}const Ej=new Set(["brightness","contrast","saturate","opacity"]);function wj(n){const[i,s]=n.slice(0,-1).split("(");if(i==="drop-shadow")return n;const[r]=s.match(Kf)||[];if(!r)return n;const u=s.replace(r,"");let f=Ej.has(i)?1:0;return r!==s&&(f*=100),i+"("+f+u+")"}const Aj=/\b([a-z-]*)\(.*?\)/gu,hf={...Je,getAnimatableNone:n=>{const i=n.match(Aj);return i?i.map(wj).join(" "):n}},mf={...Je,getAnimatableNone:n=>{const i=Je.parse(n);return Je.createTransformer(n)(i.map(r=>typeof r=="number"?0:typeof r=="object"?{...r,alpha:1}:r))}},F0={...Ai,transform:Math.round},Cj={rotate:Cn,pathRotation:Cn,rotateX:Cn,rotateY:Cn,rotateZ:Cn,scale:pr,scaleX:pr,scaleY:pr,scaleZ:pr,skew:Cn,skewX:Cn,skewY:Cn,distance:tt,translateX:tt,translateY:tt,translateZ:tt,x:tt,y:tt,z:tt,perspective:tt,transformPerspective:tt,opacity:Ll,originX:k0,originY:k0,originZ:tt},Ur={borderWidth:tt,borderTopWidth:tt,borderRightWidth:tt,borderBottomWidth:tt,borderLeftWidth:tt,borderRadius:tt,borderTopLeftRadius:tt,borderTopRightRadius:tt,borderBottomRightRadius:tt,borderBottomLeftRadius:tt,width:tt,maxWidth:tt,height:tt,maxHeight:tt,top:tt,right:tt,bottom:tt,left:tt,inset:tt,insetBlock:tt,insetBlockStart:tt,insetBlockEnd:tt,insetInline:tt,insetInlineStart:tt,insetInlineEnd:tt,padding:tt,paddingTop:tt,paddingRight:tt,paddingBottom:tt,paddingLeft:tt,paddingBlock:tt,paddingBlockStart:tt,paddingBlockEnd:tt,paddingInline:tt,paddingInlineStart:tt,paddingInlineEnd:tt,margin:tt,marginTop:tt,marginRight:tt,marginBottom:tt,marginLeft:tt,marginBlock:tt,marginBlockStart:tt,marginBlockEnd:tt,marginInline:tt,marginInlineStart:tt,marginInlineEnd:tt,fontSize:tt,backgroundPositionX:tt,backgroundPositionY:tt,...Cj,zIndex:F0,fillOpacity:Ll,strokeOpacity:Ll,numOctaves:F0},Nj={...Ur,color:Jt,backgroundColor:Jt,outlineColor:Jt,fill:Jt,stroke:Jt,borderColor:Jt,borderTopColor:Jt,borderRightColor:Jt,borderBottomColor:Jt,borderLeftColor:Jt,filter:hf,WebkitFilter:hf,mask:mf,WebkitMask:mf},bx=n=>Nj[n],Mj=new Set([hf,mf]);function vx(n,i){let s=bx(n);return Mj.has(s)||(s=Je),s.getAnimatableNone?s.getAnimatableNone(i):void 0}const Rj=new Set(["auto","none","0"]);function Dj(n,i,s){let r=0,u;for(;r<n.length&&!u;){const f=n[r];typeof f=="string"&&!Rj.has(f)&&ji(f).values.length&&(u=n[r]),r++}if(u&&s)for(const f of i)n[f]=vx(s,u)}class zj extends Pf{constructor(i,s,r,u,f){super(i,s,r,u,f,!0)}readKeyframes(){const{unresolvedKeyframes:i,element:s,name:r}=this;if(!s||!s.current)return;super.readKeyframes();for(let x=0;x<i.length;x++){let b=i[x];if(typeof b=="string"&&(b=b.trim(),Xf(b))){const v=dx(b,s.current);v!==void 0&&(i[x]=v),x===i.length-1&&(this.finalKeyframe=b)}}if(this.resolveNoneKeyframes(),!hx.has(r)||i.length!==2)return;const[u,f]=i,d=Z0(u),h=Z0(f),p=O0(u),g=O0(f);if(p!==g&&ea[r]){this.needsMeasurement=!0;return}if(d!==h)if(Y0(d)&&Y0(h))for(let x=0;x<i.length;x++){const b=i[x];typeof b=="string"&&(i[x]=parseFloat(b))}else ea[r]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:i,name:s}=this,r=[];for(let u=0;u<i.length;u++)(i[u]===null||Tj(i[u]))&&r.push(u);r.length&&Dj(i,r,s)}measureInitialState(){const{element:i,unresolvedKeyframes:s,name:r}=this;if(!i||!i.current)return;r==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=ea[r](i.measureViewportBox(),window.getComputedStyle(i.current)),s[0]=this.measuredOrigin;const u=s[s.length-1];u!==void 0&&i.getValue(r,u).jump(u,!1)}measureEndState(){var h;const{element:i,name:s,unresolvedKeyframes:r}=this;if(!i||!i.current)return;const u=i.getValue(s);u&&u.jump(this.measuredOrigin,!1);const f=r.length-1,d=r[f];r[f]=ea[s](i.measureViewportBox(),window.getComputedStyle(i.current)),d!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=d),(h=this.removedTransforms)!=null&&h.length&&this.removedTransforms.forEach(([p,g])=>{i.getValue(p).set(g)}),this.resolveNoneKeyframes()}}function Sx(n,i,s){if(n==null)return[];if(n instanceof EventTarget)return[n];if(typeof n=="string"){let r=document;const u=(s==null?void 0:s[n])??r.querySelectorAll(n);return u?Array.from(u):[]}return Array.from(n).filter(r=>r!=null)}const pf=(n,i)=>i&&typeof n=="number"?i.transform(n):n;function wr(n){return Ny(n)&&"offsetHeight"in n&&!("ownerSVGElement"in n)}const{schedule:ed}=Yy(queueMicrotask,!1),Ze={x:!1,y:!1};function jx(){return Ze.x||Ze.y}function Oj(n){return n==="x"||n==="y"?Ze[n]?null:(Ze[n]=!0,()=>{Ze[n]=!1}):Ze.x||Ze.y?null:(Ze.x=Ze.y=!0,()=>{Ze.x=Ze.y=!1})}function Tx(n,i){const s=Sx(n),r=new AbortController,u={passive:!0,...i,signal:r.signal};return[s,u,()=>r.abort()]}function kj(n){return!(n.pointerType==="touch"||jx())}function Vj(n,i,s={}){const[r,u,f]=Tx(n,s);return r.forEach(d=>{let h=!1,p=!1,g;const x=()=>{d.removeEventListener("pointerleave",A)},b=T=>{g&&(g(T),g=void 0),x()},v=T=>{h=!1,window.removeEventListener("pointerup",v),window.removeEventListener("pointercancel",v),p&&(p=!1,b(T))},E=()=>{h=!0,window.addEventListener("pointerup",v,u),window.addEventListener("pointercancel",v,u)},A=T=>{if(T.pointerType!=="touch"){if(h){p=!0;return}b(T)}},R=T=>{if(!kj(T))return;p=!1;const C=i(d,T);typeof C=="function"&&(g=C,d.addEventListener("pointerleave",A,u))};d.addEventListener("pointerenter",R,u),d.addEventListener("pointerdown",E,u)}),f}const Ex=(n,i)=>i?n===i?!0:Ex(n,i.parentElement):!1,nd=n=>n.pointerType==="mouse"?typeof n.button!="number"||n.button<=0:n.isPrimary!==!1,Bj=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function _j(n){return Bj.has(n.tagName)||n.isContentEditable===!0}const Lj=new Set(["INPUT","SELECT","TEXTAREA"]);function Uj(n){return Lj.has(n.tagName)||n.isContentEditable===!0}const Ar=new WeakSet;function J0(n){return i=>{i.key==="Enter"&&n(i)}}function kc(n,i){n.dispatchEvent(new PointerEvent("pointer"+i,{isPrimary:!0,bubbles:!0}))}const Hj=(n,i)=>{const s=n.currentTarget;if(!s)return;const r=J0(()=>{if(Ar.has(s))return;kc(s,"down");const u=J0(()=>{kc(s,"up")}),f=()=>kc(s,"cancel");s.addEventListener("keyup",u,i),s.addEventListener("blur",f,i)});s.addEventListener("keydown",r,i),s.addEventListener("blur",()=>s.removeEventListener("keydown",r),i)};function P0(n){return nd(n)&&!jx()}const $0=new WeakSet;function Gj(n,i,s={}){const[r,u,f]=Tx(n,s),d=h=>{const p=h.currentTarget;if(!P0(h)||$0.has(h))return;Ar.add(p),s.stopPropagation&&$0.add(h);const g=i(p,h),x={...u,capture:!0},b=(A,R)=>{window.removeEventListener("pointerup",v,x),window.removeEventListener("pointercancel",E,x),Ar.has(p)&&Ar.delete(p),P0(A)&&typeof g=="function"&&g(A,{success:R})},v=A=>{b(A,p===window||p===document||s.useGlobalTarget||Ex(p,A.target))},E=A=>{b(A,!1)};window.addEventListener("pointerup",v,x),window.addEventListener("pointercancel",E,x)};return r.forEach(h=>{(s.useGlobalTarget?window:h).addEventListener("pointerdown",d,u),wr(h)&&(h.addEventListener("focus",g=>Hj(g,u)),!_j(h)&&!h.hasAttribute("tabindex")&&(h.tabIndex=0))}),f}function ad(n){return Ny(n)&&"ownerSVGElement"in n}const Cr=new WeakMap;let ta;const wx=(n,i,s)=>(r,u)=>u&&u[0]?u[0][n+"Size"]:ad(r)&&"getBBox"in r?r.getBBox()[i]:r[s],Yj=wx("inline","width","offsetWidth"),qj=wx("block","height","offsetHeight");function Xj({target:n,borderBoxSize:i}){var s;(s=Cr.get(n))==null||s.forEach(r=>{r(n,{get width(){return Yj(n,i)},get height(){return qj(n,i)}})})}function Kj(n){n.forEach(Xj)}function Qj(){typeof ResizeObserver>"u"||(ta=new ResizeObserver(Kj))}function Zj(n,i){ta||Qj();const s=Sx(n);return s.forEach(r=>{let u=Cr.get(r);u||(u=new Set,Cr.set(r,u)),u.add(i),ta==null||ta.observe(r)}),()=>{s.forEach(r=>{const u=Cr.get(r);u==null||u.delete(i),u!=null&&u.size||ta==null||ta.unobserve(r)})}}const Nr=new Set;let vi;function Fj(){vi=()=>{const n={get width(){return window.innerWidth},get height(){return window.innerHeight}};Nr.forEach(i=>i(n))},window.addEventListener("resize",vi)}function Jj(n){return Nr.add(n),vi||Fj(),()=>{Nr.delete(n),!Nr.size&&typeof vi=="function"&&(window.removeEventListener("resize",vi),vi=void 0)}}function W0(n,i){return typeof n=="function"?Jj(n):Zj(n,i)}function Pj(n){return ad(n)&&n.tagName==="svg"}const $j=[...xx,Jt,Je],Wj=n=>$j.find(yx(n)),I0=()=>({translate:0,scale:1,origin:0,originPoint:0}),Si=()=>({x:I0(),y:I0()}),tg=()=>({min:0,max:0}),$t=()=>({x:tg(),y:tg()}),Ij=new WeakMap;function $r(n){return n!==null&&typeof n=="object"&&typeof n.start=="function"}function Ul(n){return typeof n=="string"||Array.isArray(n)}const id=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],ld=["initial",...id];function Wr(n){return $r(n.animate)||ld.some(i=>Ul(n[i]))}function Ax(n){return!!(Wr(n)||n.variants)}function tT(n,i,s){for(const r in i){const u=i[r],f=s[r];if(se(u))n.addValue(r,u);else if(se(f))n.addValue(r,Ti(u,{owner:n}));else if(f!==u)if(n.hasValue(r)){const d=n.getValue(r);d.liveStyle===!0?d.jump(u):d.hasAnimated||d.set(u)}else{const d=n.getStaticValue(r);n.addValue(r,Ti(d!==void 0?d:u,{owner:n}))}}for(const r in s)i[r]===void 0&&n.removeValue(r);return i}const gf={current:null},Cx={current:!1},eT=typeof window<"u";function nT(){if(Cx.current=!0,!!eT)if(window.matchMedia){const n=window.matchMedia("(prefers-reduced-motion)"),i=()=>gf.current=n.matches;n.addEventListener("change",i),i()}else gf.current=!1}const eg=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let Hr={};function Nx(n){Hr=n}function aT(){return Hr}class iT{scrapeMotionValuesFromProps(i,s,r){return{}}constructor({parent:i,props:s,presenceContext:r,reducedMotionConfig:u,skipAnimations:f,blockInitialAnimation:d,visualState:h},p={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=Pf,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const E=ce.now();this.renderScheduledAt<E&&(this.renderScheduledAt=E,kt.render(this.render,!1,!0))};const{latestValues:g,renderState:x}=h;this.latestValues=g,this.baseTarget={...g},this.initialValues=s.initial?{...g}:{},this.renderState=x,this.parent=i,this.props=s,this.presenceContext=r,this.depth=i?i.depth+1:0,this.reducedMotionConfig=u,this.skipAnimationsConfig=f,this.options=p,this.blockInitialAnimation=!!d,this.isControllingVariants=Wr(s),this.isVariantNode=Ax(s),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(i&&i.current);const{willChange:b,...v}=this.scrapeMotionValuesFromProps(s,{},this);for(const E in v){const A=v[E];g[E]!==void 0&&se(A)&&A.set(g[E])}}mount(i){var s,r;if(this.hasBeenMounted)for(const u in this.initialValues)(s=this.values.get(u))==null||s.jump(this.initialValues[u]),this.latestValues[u]=this.initialValues[u];this.current=i,Ij.set(i,this),this.projection&&!this.projection.instance&&this.projection.mount(i),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((u,f)=>this.bindToMotionValue(f,u)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(Cx.current||nT(),this.shouldReduceMotion=gf.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,(r=this.parent)==null||r.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){var i;this.projection&&this.projection.unmount(),aa(this.notifyUpdate),aa(this.render),this.valueSubscriptions.forEach(s=>s()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),(i=this.parent)==null||i.removeChild(this);for(const s in this.events)this.events[s].clear();for(const s in this.features){const r=this.features[s];r&&(r.unmount(),r.isMounted=!1)}this.current=null}addChild(i){this.children.add(i),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(i)}removeChild(i){this.children.delete(i),this.enteringChildren&&this.enteringChildren.delete(i)}bindToMotionValue(i,s){if(this.valueSubscriptions.has(i)&&this.valueSubscriptions.get(i)(),s.accelerate&&ux.has(i)&&this.current instanceof HTMLElement){const{factory:d,keyframes:h,times:p,ease:g,duration:x}=s.accelerate,b=new rx({element:this.current,name:i,keyframes:h,times:p,ease:g,duration:Me(x)}),v=d(b);this.valueSubscriptions.set(i,()=>{v(),b.cancel()});return}const r=Ni.has(i);r&&this.onBindTransform&&this.onBindTransform();const u=s.on("change",d=>{this.latestValues[i]=d,this.props.onUpdate&&kt.preRender(this.notifyUpdate),r&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let f;typeof window<"u"&&window.MotionCheckAppearSync&&(f=window.MotionCheckAppearSync(this,i,s)),this.valueSubscriptions.set(i,()=>{u(),f&&f()})}sortNodePosition(i){return!this.current||!this.sortInstanceNodePosition||this.type!==i.type?0:this.sortInstanceNodePosition(this.current,i.current)}updateFeatures(){let i="animation";for(i in Hr){const s=Hr[i];if(!s)continue;const{isEnabled:r,Feature:u}=s;if(!this.features[i]&&u&&r(this.props)&&(this.features[i]=new u(this)),this.features[i]){const f=this.features[i];f.isMounted?f.update():(f.mount(),f.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):$t()}getStaticValue(i){return this.latestValues[i]}setStaticValue(i,s){this.latestValues[i]=s}update(i,s){(i.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=i,this.prevPresenceContext=this.presenceContext,this.presenceContext=s;for(let r=0;r<eg.length;r++){const u=eg[r];this.propEventSubscriptions[u]&&(this.propEventSubscriptions[u](),delete this.propEventSubscriptions[u]);const f="on"+u,d=i[f];d&&(this.propEventSubscriptions[u]=this.on(u,d))}this.prevMotionValues=tT(this,this.scrapeMotionValuesFromProps(i,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(i){return this.props.variants?this.props.variants[i]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(i){const s=this.getClosestVariantNode();if(s)return s.variantChildren&&s.variantChildren.add(i),()=>s.variantChildren.delete(i)}addValue(i,s){const r=this.values.get(i);s!==r&&(r&&this.removeValue(i),this.bindToMotionValue(i,s),this.values.set(i,s),this.latestValues[i]=s.get())}removeValue(i){this.values.delete(i);const s=this.valueSubscriptions.get(i);s&&(s(),this.valueSubscriptions.delete(i)),delete this.latestValues[i],this.removeValueFromRenderState(i,this.renderState)}hasValue(i){return this.values.has(i)}getValue(i,s){if(this.props.values&&this.props.values[i])return this.props.values[i];let r=this.values.get(i);return r===void 0&&s!==void 0&&(r=Ti(s===null?void 0:s,{owner:this}),this.addValue(i,r)),r}readValue(i,s){let r=this.latestValues[i]!==void 0||!this.current?this.latestValues[i]:this.getBaseTargetFromProps(this.props,i)??this.readValueFromInstance(this.current,i,this.options);return r!=null&&(typeof r=="string"&&(Cy(r)||My(r))?r=parseFloat(r):!Wj(r)&&Je.test(s)&&(r=vx(i,s)),this.setBaseTarget(i,se(r)?r.get():r)),se(r)?r.get():r}setBaseTarget(i,s){this.baseTarget[i]=s}getBaseTarget(i){var f;const{initial:s}=this.props;let r;if(typeof s=="string"||typeof s=="object"){const d=If(this.props,s,(f=this.presenceContext)==null?void 0:f.custom);d&&(r=d[i])}if(s&&r!==void 0)return r;const u=this.getBaseTargetFromProps(this.props,i);return u!==void 0&&!se(u)?u:this.initialValues[i]!==void 0&&r===void 0?void 0:this.baseTarget[i]}on(i,s){return this.events[i]||(this.events[i]=new Gf),this.events[i].add(s)}notify(i,...s){this.events[i]&&this.events[i].notify(...s)}scheduleRenderMicrotask(){ed.render(this.render)}}class Mx extends iT{constructor(){super(...arguments),this.KeyframeResolver=zj}sortInstanceNodePosition(i,s){return i.compareDocumentPosition(s)&2?1:-1}getBaseTargetFromProps(i,s){const r=i.style;return r?r[s]:void 0}removeValueFromRenderState(i,{vars:s,style:r}){delete s[i],delete r[i]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:i}=this.props;se(i)&&(this.childSubscription=i.on("change",s=>{this.current&&(this.current.textContent=`${s}`)}))}}class la{constructor(i){this.isMounted=!1,this.node=i}update(){}}function Rx({top:n,left:i,right:s,bottom:r}){return{x:{min:i,max:s},y:{min:n,max:r}}}function lT({x:n,y:i}){return{top:i.min,right:n.max,bottom:i.max,left:n.min}}function sT(n,i){if(!i)return n;const s=i({x:n.left,y:n.top}),r=i({x:n.right,y:n.bottom});return{top:s.y,left:s.x,bottom:r.y,right:r.x}}function Vc(n){return n===void 0||n===1}function yf({scale:n,scaleX:i,scaleY:s}){return!Vc(n)||!Vc(i)||!Vc(s)}function Aa(n){return yf(n)||Dx(n)||n.z||n.rotate||n.rotateX||n.rotateY||n.skewX||n.skewY}function Dx(n){return ng(n.x)||ng(n.y)}function ng(n){return n&&n!=="0%"}function Gr(n,i,s){const r=n-s,u=i*r;return s+u}function ag(n,i,s,r,u){return u!==void 0&&(n=Gr(n,u,r)),Gr(n,s,r)+i}function xf(n,i=0,s=1,r,u){n.min=ag(n.min,i,s,r,u),n.max=ag(n.max,i,s,r,u)}function zx(n,{x:i,y:s}){xf(n.x,i.translate,i.scale,i.originPoint),xf(n.y,s.translate,s.scale,s.originPoint)}const ig=.999999999999,lg=1.0000000000001;function rT(n,i,s,r=!1){var h;const u=s.length;if(!u)return;i.x=i.y=1;let f,d;for(let p=0;p<u;p++){f=s[p],d=f.projectionDelta;const{visualElement:g}=f.options;g&&g.props.style&&g.props.style.display==="contents"||(r&&f.options.layoutScroll&&f.scroll&&f!==f.root&&(nn(n.x,-f.scroll.offset.x),nn(n.y,-f.scroll.offset.y)),d&&(i.x*=d.x.scale,i.y*=d.y.scale,zx(n,d)),r&&Aa(f.latestValues)&&Mr(n,f.latestValues,(h=f.layout)==null?void 0:h.layoutBox))}i.x<lg&&i.x>ig&&(i.x=1),i.y<lg&&i.y>ig&&(i.y=1)}function nn(n,i){n.min+=i,n.max+=i}function sg(n,i,s,r,u=.5){const f=Ot(n.min,n.max,u);xf(n,i,s,f,r)}function rg(n,i){return typeof n=="string"?parseFloat(n)/100*(i.max-i.min):n}function Mr(n,i,s){const r=s??n;sg(n.x,rg(i.x,r.x),i.scaleX,i.scale,i.originX),sg(n.y,rg(i.y,r.y),i.scaleY,i.scale,i.originY)}function Ox(n,i){return Rx(sT(n.getBoundingClientRect(),i))}function oT(n,i,s){const r=Ox(n,s),{scroll:u}=i;return u&&(nn(r.x,u.offset.x),nn(r.y,u.offset.y)),r}const uT={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},cT=Ci.length;function fT(n,i,s){let r="",u=!0;for(let d=0;d<cT;d++){const h=Ci[d],p=n[h];if(p===void 0)continue;let g=!0;if(typeof p=="number")g=p===(h.startsWith("scale")?1:0);else{const x=parseFloat(p);g=h.startsWith("scale")?x===1:x===0}if(!g||s){const x=pf(p,Ur[h]);if(!g){u=!1;const b=uT[h]||h;r+=`${b}(${x}) `}s&&(i[h]=x)}}const f=n.pathRotation;return f&&(u=!1,r+=`rotate(${pf(f,Ur.pathRotation)}) `),r=r.trim(),s?r=s(i,u?"":r):u&&(r="none"),r}function sd(n,i,s){const{style:r,vars:u,transformOrigin:f}=n;let d=!1,h=!1;for(const p in i){const g=i[p];if(Ni.has(p)){d=!0;continue}else if(Xy(p)){u[p]=g;continue}else{const x=pf(g,Ur[p]);p.startsWith("origin")?(h=!0,f[p]=x):r[p]=x}}if(i.transform||(d||s?r.transform=fT(i,n.transform,s):r.transform&&(r.transform="none")),h){const{originX:p="50%",originY:g="50%",originZ:x=0}=f;r.transformOrigin=`${p} ${g} ${x}`}}function kx(n,{style:i,vars:s},r,u){const f=n.style;let d;for(d in i)f[d]=i[d];u==null||u.applyProjectionStyles(f,r);for(d in s)f.setProperty(d,s[d])}function og(n,i){return i.max===i.min?0:n/(i.max-i.min)*100}const wl={correct:(n,i)=>{if(!i.target)return n;if(typeof n=="string")if(tt.test(n))n=parseFloat(n);else return n;const s=og(n,i.target.x),r=og(n,i.target.y);return`${s}% ${r}%`}},dT={correct:(n,{treeScale:i,projectionDelta:s})=>{const r=n,u=Je.parse(n);if(u.length>5)return r;const f=Je.createTransformer(n),d=typeof u[0]!="number"?1:0,h=s.x.scale*i.x,p=s.y.scale*i.y;u[0+d]/=h,u[1+d]/=p;const g=Ot(h,p,.5);return typeof u[2+d]=="number"&&(u[2+d]/=g),typeof u[3+d]=="number"&&(u[3+d]/=g),f(u)}},bf={borderRadius:{...wl,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:wl,borderTopRightRadius:wl,borderBottomLeftRadius:wl,borderBottomRightRadius:wl,boxShadow:dT};function Vx(n,{layout:i,layoutId:s}){return Ni.has(n)||n.startsWith("origin")||(i||s!==void 0)&&(!!bf[n]||n==="opacity")}function rd(n,i,s){var d;const r=n.style,u=i==null?void 0:i.style,f={};if(!r)return f;for(const h in r)(se(r[h])||u&&se(u[h])||Vx(h,n)||((d=s==null?void 0:s.getValue(h))==null?void 0:d.liveStyle)!==void 0)&&(f[h]=r[h]);return f}function hT(n){return window.getComputedStyle(n)}class mT extends Mx{constructor(){super(...arguments),this.type="html",this.renderInstance=kx}readValueFromInstance(i,s){var r;if(Ni.has(s))return(r=this.projection)!=null&&r.isProjecting?af(s):k5(i,s);{const u=hT(i),f=(Xy(s)?u.getPropertyValue(s):u[s])||0;return typeof f=="string"?f.trim():f}}measureInstanceViewportBox(i,{transformPagePoint:s}){return Ox(i,s)}build(i,s,r){sd(i,s,r.transformTemplate)}scrapeMotionValuesFromProps(i,s,r){return rd(i,s,r)}}const pT={offset:"stroke-dashoffset",array:"stroke-dasharray"},gT={offset:"strokeDashoffset",array:"strokeDasharray"};function yT(n,i,s=1,r=0,u=!0){n.pathLength=1;const f=u?pT:gT;n[f.offset]=`${-r}`,n[f.array]=`${i} ${s}`}const xT=["offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function Bx(n,{attrX:i,attrY:s,attrScale:r,pathLength:u,pathSpacing:f=1,pathOffset:d=0,...h},p,g,x){if(sd(n,h,g),p){n.style.viewBox&&(n.attrs.viewBox=n.style.viewBox);return}n.attrs=n.style,n.style={};const{attrs:b,style:v}=n;b.transform&&(v.transform=b.transform,delete b.transform),(v.transform||b.transformOrigin)&&(v.transformOrigin=b.transformOrigin??"50% 50%",delete b.transformOrigin),v.transform&&(v.transformBox=(x==null?void 0:x.transformBox)??"fill-box",delete b.transformBox);for(const E of xT)b[E]!==void 0&&(v[E]=b[E],delete b[E]);i!==void 0&&(b.x=i),s!==void 0&&(b.y=s),r!==void 0&&(b.scale=r),u!==void 0&&yT(b,u,f,d,!1)}const _x=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),Lx=n=>typeof n=="string"&&n.toLowerCase()==="svg";function bT(n,i,s,r){kx(n,i,void 0,r);for(const u in i.attrs)n.setAttribute(_x.has(u)?u:td(u),i.attrs[u])}function Ux(n,i,s){const r=rd(n,i,s);for(const u in n)if(se(n[u])||se(i[u])){const f=Ci.indexOf(u)!==-1?"attr"+u.charAt(0).toUpperCase()+u.substring(1):u;r[f]=n[u]}return r}class vT extends Mx{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=$t}getBaseTargetFromProps(i,s){return i[s]}readValueFromInstance(i,s){if(Ni.has(s)){const r=bx(s);return r&&r.default||0}return s=_x.has(s)?s:td(s),i.getAttribute(s)}scrapeMotionValuesFromProps(i,s,r){return Ux(i,s,r)}build(i,s,r){Bx(i,s,this.isSVGTag,r.transformTemplate,r.style)}renderInstance(i,s,r,u){bT(i,s,r,u)}mount(i){this.isSVGTag=Lx(i.tagName),super.mount(i)}}const ST=ld.length;function Hx(n){if(!n)return;if(!n.isControllingVariants){const s=n.parent?Hx(n.parent)||{}:{};return n.props.initial!==void 0&&(s.initial=n.props.initial),s}const i={};for(let s=0;s<ST;s++){const r=ld[s],u=n.props[r];(Ul(u)||u===!1)&&(i[r]=u)}return i}function Gx(n,i){if(!Array.isArray(i))return!1;const s=i.length;if(s!==n.length)return!1;for(let r=0;r<s;r++)if(i[r]!==n[r])return!1;return!0}const jT=[...id].reverse(),TT=id.length;function ET(n){return i=>Promise.all(i.map(({animation:s,options:r})=>Sj(n,s,r)))}function wT(n){let i=ET(n),s=ug(),r=!0,u=!1;const f=g=>(x,b)=>{var E;const v=Da(n,b,g==="exit"?(E=n.presenceContext)==null?void 0:E.custom:void 0);if(v){const{transition:A,transitionEnd:R,...T}=v;x={...x,...T,...R}}return x};function d(g){i=g(n)}function h(g){const{props:x}=n,b=Hx(n.parent)||{},v=[],E=new Set;let A={},R=1/0;for(let C=0;C<TT;C++){const _=jT[C],z=s[_],U=x[_]!==void 0?x[_]:b[_],K=Ul(U),I=_===g?z.isActive:null;I===!1&&(R=C);let X=U===b[_]&&U!==x[_]&&K;if(X&&(r||u)&&n.manuallyAnimateOnMount&&(X=!1),z.protectedKeys={...A},!z.isActive&&I===null||!U&&!z.prevProp||$r(U)||typeof U=="boolean")continue;if(_==="exit"&&z.isActive&&I!==!0){z.prevResolvedValues&&(A={...A,...z.prevResolvedValues});continue}const Q=AT(z.prevProp,U);let et=Q||_===g&&z.isActive&&!X&&K||C>R&&K,P=!1;const at=Array.isArray(U)?U:[U];let ft=at.reduce(f(_),{});I===!1&&(ft={});const{prevResolvedValues:lt={}}=z,mt={...lt,...ft},ot=J=>{et=!0,E.has(J)&&(P=!0,E.delete(J)),z.needsAnimating[J]=!0;const rt=n.getValue(J);rt&&(rt.liveStyle=!1)};for(const J in mt){const rt=ft[J],gt=lt[J];if(A.hasOwnProperty(J))continue;let N=!1;cf(rt)&&cf(gt)?N=!Gx(rt,gt)||Q:N=rt!==gt,N?rt!=null?ot(J):E.add(J):rt!==void 0&&E.has(J)?ot(J):z.protectedKeys[J]=!0}z.prevProp=U,z.prevResolvedValues=ft,z.isActive&&(A={...A,...ft}),(r||u)&&n.blockInitialAnimation&&(et=!1);const B=X&&Q;et&&(!B||P)&&v.push(...at.map(J=>{const rt={type:_};if(typeof J=="string"&&(r||u)&&!B&&n.manuallyAnimateOnMount&&n.parent){const{parent:gt}=n,N=Da(gt,J);if(gt.enteringChildren&&N){const{delayChildren:Y}=N.transition||{};rt.delay=cx(gt.enteringChildren,n,Y)}}return{animation:J,options:rt}}))}if(E.size){const C={};if(typeof x.initial!="boolean"){const _=Da(n,Array.isArray(x.initial)?x.initial[0]:x.initial);_&&_.transition&&(C.transition=_.transition)}E.forEach(_=>{const z=n.getBaseTarget(_),U=n.getValue(_);U&&(U.liveStyle=!0),C[_]=z??null}),v.push({animation:C})}let T=!!v.length;return r&&(x.initial===!1||x.initial===x.animate)&&!n.manuallyAnimateOnMount&&(T=!1),r=!1,u=!1,T?i(v):Promise.resolve()}function p(g,x){var v;if(s[g].isActive===x)return Promise.resolve();(v=n.variantChildren)==null||v.forEach(E=>{var A;return(A=E.animationState)==null?void 0:A.setActive(g,x)}),s[g].isActive=x;const b=h(g);for(const E in s)s[E].protectedKeys={};return b}return{animateChanges:h,setActive:p,setAnimateFunction:d,getState:()=>s,reset:()=>{s=ug(),u=!0}}}function AT(n,i){return typeof i=="string"?i!==n:Array.isArray(i)?!Gx(i,n):!1}function wa(n=!1){return{isActive:n,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function ug(){return{animate:wa(!0),whileInView:wa(),whileHover:wa(),whileTap:wa(),whileDrag:wa(),whileFocus:wa(),exit:wa()}}function vf(n,i){n.min=i.min,n.max=i.max}function Qe(n,i){vf(n.x,i.x),vf(n.y,i.y)}function cg(n,i){n.translate=i.translate,n.scale=i.scale,n.originPoint=i.originPoint,n.origin=i.origin}const Yx=1e-4,CT=1-Yx,NT=1+Yx,qx=.01,MT=0-qx,RT=0+qx;function fe(n){return n.max-n.min}function DT(n,i,s){return Math.abs(n-i)<=s}function fg(n,i,s,r=.5){n.origin=r,n.originPoint=Ot(i.min,i.max,n.origin),n.scale=fe(s)/fe(i),n.translate=Ot(s.min,s.max,n.origin)-n.originPoint,(n.scale>=CT&&n.scale<=NT||isNaN(n.scale))&&(n.scale=1),(n.translate>=MT&&n.translate<=RT||isNaN(n.translate))&&(n.translate=0)}function kl(n,i,s,r){fg(n.x,i.x,s.x,r?r.originX:void 0),fg(n.y,i.y,s.y,r?r.originY:void 0)}function dg(n,i,s,r=0){const u=r?Ot(s.min,s.max,r):s.min;n.min=u+i.min,n.max=n.min+fe(i)}function zT(n,i,s,r){dg(n.x,i.x,s.x,r==null?void 0:r.x),dg(n.y,i.y,s.y,r==null?void 0:r.y)}function hg(n,i,s,r=0){const u=r?Ot(s.min,s.max,r):s.min;n.min=i.min-u,n.max=n.min+fe(i)}function Yr(n,i,s,r){hg(n.x,i.x,s.x,r==null?void 0:r.x),hg(n.y,i.y,s.y,r==null?void 0:r.y)}function mg(n,i,s,r,u){return n-=i,n=Gr(n,1/s,r),u!==void 0&&(n=Gr(n,1/u,r)),n}function OT(n,i=0,s=1,r=.5,u,f=n,d=n){if(an.test(i)&&(i=parseFloat(i),i=Ot(d.min,d.max,i/100)-d.min),typeof i!="number")return;let h=Ot(f.min,f.max,r);n===f&&(h-=i),n.min=mg(n.min,i,s,h,u),n.max=mg(n.max,i,s,h,u)}function pg(n,i,[s,r,u],f,d){OT(n,i[s],i[r],i[u],i.scale,f,d)}const kT=["x","scaleX","originX"],VT=["y","scaleY","originY"];function gg(n,i,s,r){pg(n.x,i,kT,s?s.x:void 0,r?r.x:void 0),pg(n.y,i,VT,s?s.y:void 0,r?r.y:void 0)}function yg(n){return n.translate===0&&n.scale===1}function Xx(n){return yg(n.x)&&yg(n.y)}function xg(n,i){return n.min===i.min&&n.max===i.max}function BT(n,i){return xg(n.x,i.x)&&xg(n.y,i.y)}function bg(n,i){return Math.round(n.min)===Math.round(i.min)&&Math.round(n.max)===Math.round(i.max)}function Kx(n,i){return bg(n.x,i.x)&&bg(n.y,i.y)}function vg(n){return fe(n.x)/fe(n.y)}function Sg(n,i){return n.translate===i.translate&&n.scale===i.scale&&n.originPoint===i.originPoint}function en(n){return[n("x"),n("y")]}function _T(n,i,s){let r="";const u=n.x.translate/i.x,f=n.y.translate/i.y,d=(s==null?void 0:s.z)||0;if((u||f||d)&&(r=`translate3d(${u}px, ${f}px, ${d}px) `),(i.x!==1||i.y!==1)&&(r+=`scale(${1/i.x}, ${1/i.y}) `),s){const{transformPerspective:g,rotate:x,pathRotation:b,rotateX:v,rotateY:E,skewX:A,skewY:R}=s;g&&(r=`perspective(${g}px) ${r}`),x&&(r+=`rotate(${x}deg) `),b&&(r+=`rotate(${b}deg) `),v&&(r+=`rotateX(${v}deg) `),E&&(r+=`rotateY(${E}deg) `),A&&(r+=`skewX(${A}deg) `),R&&(r+=`skewY(${R}deg) `)}const h=n.x.scale*i.x,p=n.y.scale*i.y;return(h!==1||p!==1)&&(r+=`scale(${h}, ${p})`),r||"none"}const Qx=["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"],LT=Qx.length,jg=n=>typeof n=="string"?parseFloat(n):n,Tg=n=>typeof n=="number"||tt.test(n);function UT(n,i,s,r,u,f){u?(n.opacity=Ot(0,s.opacity??1,HT(r)),n.opacityExit=Ot(i.opacity??1,0,GT(r))):f&&(n.opacity=Ot(i.opacity??1,s.opacity??1,r));for(let d=0;d<LT;d++){const h=Qx[d];let p=Eg(i,h),g=Eg(s,h);if(p===void 0&&g===void 0)continue;p||(p=0),g||(g=0),p===0||g===0||Tg(p)===Tg(g)?(n[h]=Math.max(Ot(jg(p),jg(g),r),0),(an.test(g)||an.test(p))&&(n[h]+="%")):n[h]=g}(i.rotate||s.rotate)&&(n.rotate=Ot(i.rotate||0,s.rotate||0,r))}function Eg(n,i){return n[i]!==void 0?n[i]:n.borderRadius}const HT=Zx(0,.5,Ly),GT=Zx(.5,.95,Ge);function Zx(n,i,s){return r=>r<n?0:r>i?1:s(_l(n,i,r))}function YT(n,i,s){const r=se(n)?n:Ti(n);return r.start(Wf("",r,i,s)),r.animation}function Hl(n,i,s,r={passive:!0}){return n.addEventListener(i,s,r),()=>n.removeEventListener(i,s,r)}const qT=(n,i)=>n.depth-i.depth;class XT{constructor(){this.children=[],this.isDirty=!1}add(i){Uf(this.children,i),this.isDirty=!0}remove(i){kr(this.children,i),this.isDirty=!0}forEach(i){this.isDirty&&this.children.sort(qT),this.isDirty=!1,this.children.forEach(i)}}function KT(n,i){const s=ce.now(),r=({timestamp:u})=>{const f=u-s;f>=i&&(aa(r),n(f-i))};return kt.setup(r,!0),()=>aa(r)}function Rr(n){return se(n)?n.get():n}class QT{constructor(){this.members=[]}add(i){Uf(this.members,i);for(let s=this.members.length-1;s>=0;s--){const r=this.members[s];if(r===i||r===this.lead||r===this.prevLead)continue;const u=r.instance;(!u||u.isConnected===!1)&&!r.snapshot&&(kr(this.members,r),r.unmount())}i.scheduleRender()}remove(i){if(kr(this.members,i),i===this.prevLead&&(this.prevLead=void 0),i===this.lead){const s=this.members[this.members.length-1];s&&this.promote(s)}}relegate(i){var s;for(let r=this.members.indexOf(i)-1;r>=0;r--){const u=this.members[r];if(u.isPresent!==!1&&((s=u.instance)==null?void 0:s.isConnected)!==!1)return this.promote(u),!0}return!1}promote(i,s){var u;const r=this.lead;if(i!==r&&(this.prevLead=r,this.lead=i,i.show(),r)){r.updateSnapshot(),i.scheduleRender();const{layoutDependency:f}=r.options,{layoutDependency:d}=i.options;(f===void 0||f!==d)&&(i.resumeFrom=r,s&&(r.preserveOpacity=!0),r.snapshot&&(i.snapshot=r.snapshot,i.snapshot.latestValues=r.animationValues||r.latestValues),(u=i.root)!=null&&u.isUpdating&&(i.isLayoutDirty=!0)),i.options.crossfade===!1&&r.hide()}}exitAnimationComplete(){this.members.forEach(i=>{var s,r,u,f,d;(r=(s=i.options).onExitComplete)==null||r.call(s),(d=(u=i.resumingFrom)==null?void 0:(f=u.options).onExitComplete)==null||d.call(f)})}scheduleRender(){this.members.forEach(i=>i.instance&&i.scheduleRender(!1))}removeLeadSnapshot(){var i;(i=this.lead)!=null&&i.snapshot&&(this.lead.snapshot=void 0)}}const Dr={hasAnimatedSinceResize:!0,hasEverUpdated:!1},Bc=["","X","Y","Z"],ZT=1e3;let FT=0;function _c(n,i,s,r){const{latestValues:u}=i;u[n]&&(s[n]=u[n],i.setStaticValue(n,0),r&&(r[n]=0))}function Fx(n){if(n.hasCheckedOptimisedAppear=!0,n.root===n)return;const{visualElement:i}=n.options;if(!i)return;const s=px(i);if(window.MotionHasOptimisedAnimation(s,"transform")){const{layout:u,layoutId:f}=n.options;window.MotionCancelOptimisedAnimation(s,"transform",kt,!(u||f))}const{parent:r}=n;r&&!r.hasCheckedOptimisedAppear&&Fx(r)}function Jx({attachResizeListener:n,defaultParent:i,measureScroll:s,checkIsScrollRoot:r,resetTransform:u}){return class{constructor(d={},h=i==null?void 0:i()){this.id=FT++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach($T),this.nodes.forEach(a3),this.nodes.forEach(i3),this.nodes.forEach(WT)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=d,this.root=h?h.root||h:this,this.path=h?[...h.path,h]:[],this.parent=h,this.depth=h?h.depth+1:0;for(let p=0;p<this.path.length;p++)this.path[p].shouldResetTransform=!0;this.root===this&&(this.nodes=new XT)}addEventListener(d,h){return this.eventHandlers.has(d)||this.eventHandlers.set(d,new Gf),this.eventHandlers.get(d).add(h)}notifyListeners(d,...h){const p=this.eventHandlers.get(d);p&&p.notify(...h)}hasListeners(d){return this.eventHandlers.has(d)}mount(d){if(this.instance)return;this.isSVG=ad(d)&&!Pj(d),this.instance=d;const{layoutId:h,layout:p,visualElement:g}=this.options;if(g&&!g.current&&g.mount(d),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(p||h)&&(this.isLayoutDirty=!0),n){let x,b=0;const v=()=>this.root.updateBlockedByResize=!1;kt.read(()=>{b=window.innerWidth}),n(d,()=>{const E=window.innerWidth;E!==b&&(b=E,this.root.updateBlockedByResize=!0,x&&x(),x=KT(v,250),Dr.hasAnimatedSinceResize&&(Dr.hasAnimatedSinceResize=!1,this.nodes.forEach(Cg)))})}h&&this.root.registerSharedNode(h,this),this.options.animate!==!1&&g&&(h||p)&&this.addEventListener("didUpdate",({delta:x,hasLayoutChanged:b,hasRelativeLayoutChanged:v,layout:E})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const A=this.options.transition||g.getDefaultTransition()||u3,{onLayoutAnimationStart:R,onLayoutAnimationComplete:T}=g.getProps(),C=!this.targetLayout||!Kx(this.targetLayout,E),_=!b&&v;if(this.options.layoutRoot||this.resumeFrom||_||b&&(C||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const z={...$f(A,"layout"),onPlay:R,onComplete:T};(g.shouldReduceMotion||this.options.layoutRoot)&&(z.delay=0,z.type=!1),this.startAnimation(z),this.setAnimationOrigin(x,_,z.path)}else b||Cg(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=E})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const d=this.getStack();d&&d.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),aa(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(l3),this.animationId++)}getTransformTemplate(){const{visualElement:d}=this.options;return d&&d.getProps().transformTemplate}willUpdate(d=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&Fx(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let x=0;x<this.path.length;x++){const b=this.path[x];b.shouldResetTransform=!0,(typeof b.latestValues.x=="string"||typeof b.latestValues.y=="string")&&(b.isLayoutDirty=!0),b.updateScroll("snapshot"),b.options.layoutRoot&&b.willUpdate(!1)}const{layoutId:h,layout:p}=this.options;if(h===void 0&&!p)return;const g=this.getTransformTemplate();this.prevTransformTemplateValue=g?g(this.latestValues,""):void 0,this.updateSnapshot(),d&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const p=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),p&&this.nodes.forEach(t3),this.nodes.forEach(wg);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(Ag);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(e3),this.nodes.forEach(n3),this.nodes.forEach(JT),this.nodes.forEach(PT)):this.nodes.forEach(Ag),this.clearAllSnapshots();const h=ce.now();le.delta=sn(0,1e3/60,h-le.timestamp),le.timestamp=h,le.isProcessing=!0,Nc.update.process(le),Nc.preRender.process(le),Nc.render.process(le),le.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,ed.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(IT),this.sharedNodes.forEach(s3)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,kt.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){kt.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!fe(this.snapshot.measuredBox.x)&&!fe(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let p=0;p<this.path.length;p++)this.path[p].updateScroll();const d=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=$t()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:h}=this.options;h&&h.notify("LayoutMeasure",this.layout.layoutBox,d?d.layoutBox:void 0)}updateScroll(d="measure"){let h=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===d&&(h=!1),h&&this.instance){const p=r(this.instance);this.scroll={animationId:this.root.animationId,phase:d,isRoot:p,offset:s(this.instance),wasRoot:this.scroll?this.scroll.isRoot:p}}}resetTransform(){if(!u)return;const d=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,h=this.projectionDelta&&!Xx(this.projectionDelta),p=this.getTransformTemplate(),g=p?p(this.latestValues,""):void 0,x=g!==this.prevTransformTemplateValue;d&&this.instance&&(h||Aa(this.latestValues)||x)&&(u(this.instance,g),this.shouldResetTransform=!1,this.scheduleRender())}measure(d=!0){const h=this.measurePageBox();let p=this.removeElementScroll(h);return d&&(p=this.removeTransform(p)),c3(p),{animationId:this.root.animationId,measuredBox:h,layoutBox:p,latestValues:{},source:this.id}}measurePageBox(){var g;const{visualElement:d}=this.options;if(!d)return $t();const h=d.measureViewportBox();if(!(((g=this.scroll)==null?void 0:g.wasRoot)||this.path.some(f3))){const{scroll:x}=this.root;x&&(nn(h.x,x.offset.x),nn(h.y,x.offset.y))}return h}removeElementScroll(d){var p;const h=$t();if(Qe(h,d),(p=this.scroll)!=null&&p.wasRoot)return h;for(let g=0;g<this.path.length;g++){const x=this.path[g],{scroll:b,options:v}=x;x!==this.root&&b&&v.layoutScroll&&(b.wasRoot&&Qe(h,d),nn(h.x,b.offset.x),nn(h.y,b.offset.y))}return h}applyTransform(d,h=!1,p){var x,b;const g=p||$t();Qe(g,d);for(let v=0;v<this.path.length;v++){const E=this.path[v];!h&&E.options.layoutScroll&&E.scroll&&E!==E.root&&(nn(g.x,-E.scroll.offset.x),nn(g.y,-E.scroll.offset.y)),Aa(E.latestValues)&&Mr(g,E.latestValues,(x=E.layout)==null?void 0:x.layoutBox)}return Aa(this.latestValues)&&Mr(g,this.latestValues,(b=this.layout)==null?void 0:b.layoutBox),g}removeTransform(d){var p;const h=$t();Qe(h,d);for(let g=0;g<this.path.length;g++){const x=this.path[g];if(!Aa(x.latestValues))continue;let b;x.instance&&(yf(x.latestValues)&&x.updateSnapshot(),b=$t(),Qe(b,x.measurePageBox())),gg(h,x.latestValues,(p=x.snapshot)==null?void 0:p.layoutBox,b)}return Aa(this.latestValues)&&gg(h,this.latestValues),h}setTargetDelta(d){this.targetDelta=d,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(d){this.options={...this.options,...d,crossfade:d.crossfade!==void 0?d.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==le.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(d=!1){var E;const h=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=h.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=h.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=h.isSharedProjectionDirty);const p=!!this.resumingFrom||this!==h;if(!(d||p&&this.isSharedProjectionDirty||this.isProjectionDirty||(E=this.parent)!=null&&E.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:x,layoutId:b}=this.options;if(!this.layout||!(x||b))return;this.resolvedRelativeTargetAt=le.timestamp;const v=this.getClosestProjectingParent();v&&this.linkedParentVersion!==v.layoutVersion&&!v.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&v&&v.layout?this.createRelativeTarget(v,this.layout.layoutBox,v.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=$t(),this.targetWithTransforms=$t()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),zT(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):Qe(this.target,this.layout.layoutBox),zx(this.target,this.targetDelta)):Qe(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&v&&!!v.resumingFrom==!!this.resumingFrom&&!v.options.layoutScroll&&v.target&&this.animationProgress!==1?this.createRelativeTarget(v,this.target,v.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||yf(this.parent.latestValues)||Dx(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(d,h,p){this.relativeParent=d,this.linkedParentVersion=d.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=$t(),this.relativeTargetOrigin=$t(),Yr(this.relativeTargetOrigin,h,p,this.options.layoutAnchor||void 0),Qe(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){var A;const d=this.getLead(),h=!!this.resumingFrom||this!==d;let p=!0;if((this.isProjectionDirty||(A=this.parent)!=null&&A.isProjectionDirty)&&(p=!1),h&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(p=!1),this.resolvedRelativeTargetAt===le.timestamp&&(p=!1),p)return;const{layout:g,layoutId:x}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(g||x))return;Qe(this.layoutCorrected,this.layout.layoutBox);const b=this.treeScale.x,v=this.treeScale.y;rT(this.layoutCorrected,this.treeScale,this.path,h),d.layout&&!d.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(d.target=d.layout.layoutBox,d.targetWithTransforms=$t());const{target:E}=d;if(!E){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(cg(this.prevProjectionDelta.x,this.projectionDelta.x),cg(this.prevProjectionDelta.y,this.projectionDelta.y)),kl(this.projectionDelta,this.layoutCorrected,E,this.latestValues),(this.treeScale.x!==b||this.treeScale.y!==v||!Sg(this.projectionDelta.x,this.prevProjectionDelta.x)||!Sg(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",E))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(d=!0){var h;if((h=this.options.visualElement)==null||h.scheduleRender(),d){const p=this.getStack();p&&p.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=Si(),this.projectionDelta=Si(),this.projectionDeltaWithTransform=Si()}setAnimationOrigin(d,h=!1,p){const g=this.snapshot,x=g?g.latestValues:{},b={...this.latestValues},v=Si();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!h;const E=$t(),A=g?g.source:void 0,R=this.layout?this.layout.source:void 0,T=A!==R,C=this.getStack(),_=!C||C.members.length<=1,z=!!(T&&!_&&this.options.crossfade===!0&&!this.path.some(o3));this.animationProgress=0;let U;const K=p==null?void 0:p.interpolateProjection(d);this.mixTargetDelta=I=>{const X=I/1e3,Q=K==null?void 0:K(X);Q?(v.x.translate=Q.x,v.x.scale=Ot(d.x.scale,1,X),v.x.origin=d.x.origin,v.x.originPoint=d.x.originPoint,v.y.translate=Q.y,v.y.scale=Ot(d.y.scale,1,X),v.y.origin=d.y.origin,v.y.originPoint=d.y.originPoint):(Ng(v.x,d.x,X),Ng(v.y,d.y,X)),this.setTargetDelta(v),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(Yr(E,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),r3(this.relativeTarget,this.relativeTargetOrigin,E,X),U&&BT(this.relativeTarget,U)&&(this.isProjectionDirty=!1),U||(U=$t()),Qe(U,this.relativeTarget)),T&&(this.animationValues=b,UT(b,x,this.latestValues,X,z,_)),Q&&Q.rotate!==void 0&&(this.animationValues||(this.animationValues=b),this.animationValues.pathRotation=Q.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=X},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(d){var h,p,g;this.notifyListeners("animationStart"),(h=this.currentAnimation)==null||h.stop(),(g=(p=this.resumingFrom)==null?void 0:p.currentAnimation)==null||g.stop(),this.pendingAnimation&&(aa(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=kt.update(()=>{Dr.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=Ti(0)),this.motionValue.jump(0,!1),this.currentAnimation=YT(this.motionValue,[0,1e3],{...d,velocity:0,isSync:!0,onUpdate:x=>{this.mixTargetDelta(x),d.onUpdate&&d.onUpdate(x)},onComplete:()=>{d.onComplete&&d.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const d=this.getStack();d&&d.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(ZT),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const d=this.getLead();let{targetWithTransforms:h,target:p,layout:g,latestValues:x}=d;if(!(!h||!p||!g)){if(this!==d&&this.layout&&g&&Px(this.options.animationType,this.layout.layoutBox,g.layoutBox)){p=this.target||$t();const b=fe(this.layout.layoutBox.x);p.x.min=d.target.x.min,p.x.max=p.x.min+b;const v=fe(this.layout.layoutBox.y);p.y.min=d.target.y.min,p.y.max=p.y.min+v}Qe(h,p),Mr(h,x),kl(this.projectionDeltaWithTransform,this.layoutCorrected,h,x)}}registerSharedNode(d,h){this.sharedNodes.has(d)||this.sharedNodes.set(d,new QT),this.sharedNodes.get(d).add(h);const g=h.options.initialPromotionConfig;h.promote({transition:g?g.transition:void 0,preserveFollowOpacity:g&&g.shouldPreserveFollowOpacity?g.shouldPreserveFollowOpacity(h):void 0})}isLead(){const d=this.getStack();return d?d.lead===this:!0}getLead(){var h;const{layoutId:d}=this.options;return d?((h=this.getStack())==null?void 0:h.lead)||this:this}getPrevLead(){var h;const{layoutId:d}=this.options;return d?(h=this.getStack())==null?void 0:h.prevLead:void 0}getStack(){const{layoutId:d}=this.options;if(d)return this.root.sharedNodes.get(d)}promote({needsReset:d,transition:h,preserveFollowOpacity:p}={}){const g=this.getStack();g&&g.promote(this,p),d&&(this.projectionDelta=void 0,this.needsReset=!0),h&&this.setOptions({transition:h})}relegate(){const d=this.getStack();return d?d.relegate(this):!1}resetSkewAndRotation(){const{visualElement:d}=this.options;if(!d)return;let h=!1;const{latestValues:p}=d;if((p.z||p.rotate||p.rotateX||p.rotateY||p.rotateZ||p.skewX||p.skewY)&&(h=!0),!h)return;const g={};p.z&&_c("z",d,g,this.animationValues);for(let x=0;x<Bc.length;x++)_c(`rotate${Bc[x]}`,d,g,this.animationValues),_c(`skew${Bc[x]}`,d,g,this.animationValues);d.render();for(const x in g)d.setStaticValue(x,g[x]),this.animationValues&&(this.animationValues[x]=g[x]);d.scheduleRender()}applyProjectionStyles(d,h){if(!this.instance||this.isSVG)return;if(!this.isVisible){d.visibility="hidden";return}const p=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,d.visibility="",d.opacity="",d.pointerEvents=Rr(h==null?void 0:h.pointerEvents)||"",d.transform=p?p(this.latestValues,""):"none";return}const g=this.getLead();if(!this.projectionDelta||!this.layout||!g.target){this.options.layoutId&&(d.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,d.pointerEvents=Rr(h==null?void 0:h.pointerEvents)||""),this.hasProjected&&!Aa(this.latestValues)&&(d.transform=p?p({},""):"none",this.hasProjected=!1);return}d.visibility="";const x=g.animationValues||g.latestValues;this.applyTransformsToTarget();let b=_T(this.projectionDeltaWithTransform,this.treeScale,x);p&&(b=p(x,b)),d.transform=b;const{x:v,y:E}=this.projectionDelta;d.transformOrigin=`${v.origin*100}% ${E.origin*100}% 0`,g.animationValues?d.opacity=g===this?x.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:x.opacityExit:d.opacity=g===this?x.opacity!==void 0?x.opacity:"":x.opacityExit!==void 0?x.opacityExit:0;for(const A in bf){if(x[A]===void 0)continue;const{correct:R,applyTo:T,isCSSVariable:C}=bf[A],_=b==="none"?x[A]:R(x[A],g);if(T){const z=T.length;for(let U=0;U<z;U++)d[T[U]]=_}else C?this.options.visualElement.renderState.vars[A]=_:d[A]=_}this.options.layoutId&&(d.pointerEvents=g===this?Rr(h==null?void 0:h.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(d=>{var h;return(h=d.currentAnimation)==null?void 0:h.stop()}),this.root.nodes.forEach(wg),this.root.sharedNodes.clear()}}}function JT(n){n.updateLayout()}function PT(n){var s;const i=((s=n.resumeFrom)==null?void 0:s.snapshot)||n.snapshot;if(n.isLead()&&n.layout&&i&&n.hasListeners("didUpdate")){const{layoutBox:r,measuredBox:u}=n.layout,{animationType:f}=n.options,d=i.source!==n.layout.source;if(f==="size")en(b=>{const v=d?i.measuredBox[b]:i.layoutBox[b],E=fe(v);v.min=r[b].min,v.max=v.min+E});else if(f==="x"||f==="y"){const b=f==="x"?"y":"x";vf(d?i.measuredBox[b]:i.layoutBox[b],r[b])}else Px(f,i.layoutBox,r)&&en(b=>{const v=d?i.measuredBox[b]:i.layoutBox[b],E=fe(r[b]);v.max=v.min+E,n.relativeTarget&&!n.currentAnimation&&(n.isProjectionDirty=!0,n.relativeTarget[b].max=n.relativeTarget[b].min+E)});const h=Si();kl(h,r,i.layoutBox);const p=Si();d?kl(p,n.applyTransform(u,!0),i.measuredBox):kl(p,r,i.layoutBox);const g=!Xx(h);let x=!1;if(!n.resumeFrom){const b=n.getClosestProjectingParent();if(b&&!b.resumeFrom){const{snapshot:v,layout:E}=b;if(v&&E){const A=n.options.layoutAnchor||void 0,R=$t();Yr(R,i.layoutBox,v.layoutBox,A);const T=$t();Yr(T,r,E.layoutBox,A),Kx(R,T)||(x=!0),b.options.layoutRoot&&(n.relativeTarget=T,n.relativeTargetOrigin=R,n.relativeParent=b)}}}n.notifyListeners("didUpdate",{layout:r,snapshot:i,delta:p,layoutDelta:h,hasLayoutChanged:g,hasRelativeLayoutChanged:x})}else if(n.isLead()){const{onExitComplete:r}=n.options;r&&r()}n.options.transition=void 0}function $T(n){n.parent&&(n.isProjecting()||(n.isProjectionDirty=n.parent.isProjectionDirty),n.isSharedProjectionDirty||(n.isSharedProjectionDirty=!!(n.isProjectionDirty||n.parent.isProjectionDirty||n.parent.isSharedProjectionDirty)),n.isTransformDirty||(n.isTransformDirty=n.parent.isTransformDirty))}function WT(n){n.isProjectionDirty=n.isSharedProjectionDirty=n.isTransformDirty=!1}function IT(n){n.clearSnapshot()}function wg(n){n.clearMeasurements()}function t3(n){n.isLayoutDirty=!0,n.updateLayout()}function Ag(n){n.isLayoutDirty=!1}function e3(n){n.isAnimationBlocked&&n.layout&&!n.isLayoutDirty&&(n.snapshot=n.layout,n.isLayoutDirty=!0)}function n3(n){const{visualElement:i}=n.options;i&&i.getProps().onBeforeLayoutMeasure&&i.notify("BeforeLayoutMeasure"),n.resetTransform()}function Cg(n){n.finishAnimation(),n.targetDelta=n.relativeTarget=n.target=void 0,n.isProjectionDirty=!0}function a3(n){n.resolveTargetDelta()}function i3(n){n.calcProjection()}function l3(n){n.resetSkewAndRotation()}function s3(n){n.removeLeadSnapshot()}function Ng(n,i,s){n.translate=Ot(i.translate,0,s),n.scale=Ot(i.scale,1,s),n.origin=i.origin,n.originPoint=i.originPoint}function Mg(n,i,s,r){n.min=Ot(i.min,s.min,r),n.max=Ot(i.max,s.max,r)}function r3(n,i,s,r){Mg(n.x,i.x,s.x,r),Mg(n.y,i.y,s.y,r)}function o3(n){return n.animationValues&&n.animationValues.opacityExit!==void 0}const u3={duration:.45,ease:[.4,0,.1,1]},Rg=n=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(n),Dg=Rg("applewebkit/")&&!Rg("chrome/")?Math.round:Ge;function zg(n){n.min=Dg(n.min),n.max=Dg(n.max)}function c3(n){zg(n.x),zg(n.y)}function Px(n,i,s){return n==="position"||n==="preserve-aspect"&&!DT(vg(i),vg(s),.2)}function f3(n){var i;return n!==n.root&&((i=n.scroll)==null?void 0:i.wasRoot)}const d3=Jx({attachResizeListener:(n,i)=>Hl(n,"resize",i),measureScroll:()=>{var n,i;return{x:document.documentElement.scrollLeft||((n=document.body)==null?void 0:n.scrollLeft)||0,y:document.documentElement.scrollTop||((i=document.body)==null?void 0:i.scrollTop)||0}},checkIsScrollRoot:()=>!0}),Lc={current:void 0},$x=Jx({measureScroll:n=>({x:n.scrollLeft,y:n.scrollTop}),defaultParent:()=>{if(!Lc.current){const n=new d3({});n.mount(window),n.setOptions({layoutScroll:!0}),Lc.current=n}return Lc.current},resetTransform:(n,i)=>{n.style.transform=i!==void 0?i:"none"},checkIsScrollRoot:n=>window.getComputedStyle(n).position==="fixed"}),od=j.createContext({transformPagePoint:n=>n,isStatic:!1,reducedMotion:"never"});function Og(n,i){if(typeof n=="function")return n(i);n!=null&&(n.current=i)}function h3(...n){return i=>{let s=!1;const r=n.map(u=>{const f=Og(u,i);return!s&&typeof f=="function"&&(s=!0),f});if(s)return()=>{for(let u=0;u<r.length;u++){const f=r[u];typeof f=="function"?f():Og(n[u],null)}}}}function m3(...n){return j.useCallback(h3(...n),n)}class p3 extends j.Component{getSnapshotBeforeUpdate(i){const s=this.props.childRef.current;if(wr(s)&&i.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const r=s.offsetParent,u=wr(r)&&r.offsetWidth||0,f=wr(r)&&r.offsetHeight||0,d=getComputedStyle(s),h=this.props.sizeRef.current;h.height=parseFloat(d.height),h.width=parseFloat(d.width),h.top=s.offsetTop,h.left=s.offsetLeft,h.right=u-h.width-h.left,h.bottom=f-h.height-h.top,h.direction=d.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function g3({children:n,isPresent:i,anchorX:s,anchorY:r,root:u,pop:f}){var v;const d=j.useId(),h=j.useRef(null),p=j.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:g}=j.useContext(od),x=((v=n.props)==null?void 0:v.ref)??(n==null?void 0:n.ref),b=m3(h,x);return j.useInsertionEffect(()=>{const{width:E,height:A,top:R,left:T,right:C,bottom:_,direction:z}=p.current;if(i||f===!1||!h.current||!E||!A)return;const U=z==="rtl",K=s==="left"?U?`right: ${C}`:`left: ${T}`:U?`left: ${T}`:`right: ${C}`,I=r==="bottom"?`bottom: ${_}`:`top: ${R}`;h.current.dataset.motionPopId=d;const X=document.createElement("style");g&&(X.nonce=g);const Q=u??document.head;return Q.appendChild(X),X.sheet&&X.sheet.insertRule(`
          [data-motion-pop-id="${d}"] {
            position: absolute !important;
            width: ${E}px !important;
            height: ${A}px !important;
            ${K}px !important;
            ${I}px !important;
          }
        `),()=>{var et;(et=h.current)==null||et.removeAttribute("data-motion-pop-id"),Q.contains(X)&&Q.removeChild(X)}},[i]),m.jsx(p3,{isPresent:i,childRef:h,sizeRef:p,pop:f,children:f===!1?n:j.cloneElement(n,{ref:b})})}const y3=({children:n,initial:i,isPresent:s,onExitComplete:r,custom:u,presenceAffectsLayout:f,mode:d,anchorX:h,anchorY:p,root:g})=>{const x=_f(x3),b=j.useId(),v=j.useRef(s),E=j.useRef(r);Lf(()=>{v.current=s,E.current=r});let A=!0,R=j.useMemo(()=>(A=!1,{id:b,initial:i,isPresent:s,custom:u,onExitComplete:T=>{x.set(T,!0);for(const C of x.values())if(!C)return;r&&r()},register:T=>(x.set(T,!1),()=>{var C;x.delete(T),!v.current&&!x.size&&((C=E.current)==null||C.call(E))})}),[s,x,r]);return f&&A&&(R={...R}),j.useMemo(()=>{x.forEach((T,C)=>x.set(C,!1))},[s]),j.useEffect(()=>{!s&&!x.size&&r&&r()},[s]),n=m.jsx(g3,{pop:d==="popLayout",isPresent:s,anchorX:h,anchorY:p,root:g,children:n}),m.jsx(Jr.Provider,{value:R,children:n})};function x3(){return new Map}function Wx(n=!0){const i=j.useContext(Jr);if(i===null)return[!0,null];const{isPresent:s,onExitComplete:r,register:u}=i,f=j.useId();j.useEffect(()=>{if(n)return u(f)},[n]);const d=j.useCallback(()=>n&&r&&r(f),[f,r,n]);return!s&&r?[!1,d]:[!0]}const gr=n=>n.key||"";function kg(n){const i=[];return j.Children.forEach(n,s=>{j.isValidElement(s)&&i.push(s)}),i}const ia=({children:n,custom:i,initial:s=!0,onExitComplete:r,presenceAffectsLayout:u=!0,mode:f="sync",propagate:d=!1,anchorX:h="left",anchorY:p="top",root:g})=>{const[x,b]=Wx(d),v=j.useMemo(()=>kg(n),[n]),E=d&&!x?[]:v.map(gr),A=j.useRef(!0),R=j.useRef(v),T=_f(()=>new Map),C=j.useRef(new Set),[_,z]=j.useState(v),[U,K]=j.useState(v);Lf(()=>{A.current=!1,R.current=v;for(let Q=0;Q<U.length;Q++){const et=gr(U[Q]);E.includes(et)?(T.delete(et),C.current.delete(et)):T.get(et)!==!0&&T.set(et,!1)}},[U,E.length,E.join("-")]);const I=[];if(v!==_){let Q=[...v];for(let et=0;et<U.length;et++){const P=U[et],at=gr(P);E.includes(at)||(Q.splice(et,0,P),I.push(P))}return f==="wait"&&I.length&&(Q=I),K(kg(Q)),z(v),null}const{forceRender:X}=j.useContext(Bf);return m.jsx(m.Fragment,{children:U.map(Q=>{const et=gr(Q),P=d&&!x?!1:v===U||E.includes(et),at=()=>{if(C.current.has(et))return;if(T.has(et))C.current.add(et),T.set(et,!0);else return;let ft=!0;T.forEach(lt=>{lt||(ft=!1)}),ft&&(X==null||X(),K(R.current),d&&(b==null||b()),r&&r())};return m.jsx(y3,{isPresent:P,initial:!A.current||s?void 0:!1,custom:i,presenceAffectsLayout:u,mode:f,root:g,onExitComplete:P?void 0:at,anchorX:h,anchorY:p,children:Q},et)})})},Ix=j.createContext({strict:!1}),Vg={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let Bg=!1;function b3(){if(Bg)return;const n={};for(const i in Vg)n[i]={isEnabled:s=>Vg[i].some(r=>!!s[r])};Nx(n),Bg=!0}function tb(){return b3(),aT()}function v3(n){const i=tb();for(const s in n)i[s]={...i[s],...n[s]};Nx(i)}const S3=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function qr(n){return n.startsWith("while")||n.startsWith("drag")&&n!=="draggable"||n.startsWith("layout")||n.startsWith("onTap")||n.startsWith("onPan")||n.startsWith("onLayout")||S3.has(n)}let eb=n=>!qr(n);function j3(n){typeof n=="function"&&(eb=i=>i.startsWith("on")?!qr(i):n(i))}try{j3(require("@emotion/is-prop-valid").default)}catch{}function T3(n,i,s){const r={};for(const u in n)u==="values"&&typeof n.values=="object"||se(n[u])||(eb(u)||s===!0&&qr(u)||!i&&!qr(u)||n.draggable&&u.startsWith("onDrag"))&&(r[u]=n[u]);return r}const Ir=j.createContext({});function E3(n,i){if(Wr(n)){const{initial:s,animate:r}=n;return{initial:s===!1||Ul(s)?s:void 0,animate:Ul(r)?r:void 0}}return n.inherit!==!1?i:{}}function w3(n){const{initial:i,animate:s}=E3(n,j.useContext(Ir));return j.useMemo(()=>({initial:i,animate:s}),[_g(i),_g(s)])}function _g(n){return Array.isArray(n)?n.join(" "):n}const ud=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function nb(n,i,s){for(const r in i)!se(i[r])&&!Vx(r,s)&&(n[r]=i[r])}function A3({transformTemplate:n},i){return j.useMemo(()=>{const s=ud();return sd(s,i,n),Object.assign({},s.vars,s.style)},[i])}function C3(n,i){const s=n.style||{},r={};return nb(r,s,n),Object.assign(r,A3(n,i)),r}function N3(n,i){const s={},r=C3(n,i);return n.drag&&n.dragListener!==!1&&(s.draggable=!1,r.userSelect=r.WebkitUserSelect=r.WebkitTouchCallout="none",r.touchAction=n.drag===!0?"none":`pan-${n.drag==="x"?"y":"x"}`),n.tabIndex===void 0&&(n.onTap||n.onTapStart||n.whileTap)&&(s.tabIndex=0),s.style=r,s}const ab=()=>({...ud(),attrs:{}});function M3(n,i,s,r){const u=j.useMemo(()=>{const f=ab();return Bx(f,i,Lx(r),n.transformTemplate,n.style),{...f.attrs,style:{...f.style}}},[i]);if(n.style){const f={};nb(f,n.style,n),u.style={...f,...u.style}}return u}const R3=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function cd(n){return typeof n!="string"||n.includes("-")?!1:!!(R3.indexOf(n)>-1||/[A-Z]/u.test(n))}function D3(n,i,s,{latestValues:r},u,f=!1,d){const p=(d??cd(n)?M3:N3)(i,r,u,n),g=T3(i,typeof n=="string",f),x=n!==j.Fragment?{...g,...p,ref:s}:{},{children:b}=i,v=j.useMemo(()=>se(b)?b.get():b,[b]);return j.createElement(n,{...x,children:v})}function z3({scrapeMotionValuesFromProps:n,createRenderState:i},s,r,u){return{latestValues:O3(s,r,u,n),renderState:i()}}function O3(n,i,s,r){const u={},f=r(n,{});for(const v in f)u[v]=Rr(f[v]);let{initial:d,animate:h}=n;const p=Wr(n),g=Ax(n);i&&g&&!p&&n.inherit!==!1&&(d===void 0&&(d=i.initial),h===void 0&&(h=i.animate));let x=s?s.initial===!1:!1;x=x||d===!1;const b=x?h:d;if(b&&typeof b!="boolean"&&!$r(b)){const v=Array.isArray(b)?b:[b];for(let E=0;E<v.length;E++){const A=If(n,v[E]);if(A){const{transitionEnd:R,transition:T,...C}=A;for(const _ in C){let z=C[_];if(Array.isArray(z)){const U=x?z.length-1:0;z=z[U]}z!==null&&(u[_]=z)}for(const _ in R)u[_]=R[_]}}}return u}const ib=n=>(i,s)=>{const r=j.useContext(Ir),u=j.useContext(Jr),f=()=>z3(n,i,r,u);return s?f():_f(f)},k3=ib({scrapeMotionValuesFromProps:rd,createRenderState:ud}),V3=ib({scrapeMotionValuesFromProps:Ux,createRenderState:ab}),B3=Symbol.for("motionComponentSymbol");function _3(n,i,s){const r=j.useRef(s);j.useInsertionEffect(()=>{r.current=s});const u=j.useRef(null);return j.useCallback(f=>{var h;f&&((h=n.onMount)==null||h.call(n,f)),i&&(f?i.mount(f):i.unmount());const d=r.current;if(typeof d=="function")if(f){const p=d(f);typeof p=="function"&&(u.current=p)}else u.current?(u.current(),u.current=null):d(f);else d&&(d.current=f)},[i])}const lb=j.createContext({});function xi(n){return n&&typeof n=="object"&&Object.prototype.hasOwnProperty.call(n,"current")}function L3(n,i,s,r,u,f){var z,U;const{visualElement:d}=j.useContext(Ir),h=j.useContext(Ix),p=j.useContext(Jr),g=j.useContext(od),x=g.reducedMotion,b=g.skipAnimations,v=j.useRef(null),E=j.useRef(!1);r=r||h.renderer,!v.current&&r&&(v.current=r(n,{visualState:i,parent:d,props:s,presenceContext:p,blockInitialAnimation:p?p.initial===!1:!1,reducedMotionConfig:x,skipAnimations:b,isSVG:f}),E.current&&v.current&&(v.current.manuallyAnimateOnMount=!0));const A=v.current,R=j.useContext(lb);A&&!A.projection&&u&&(A.type==="html"||A.type==="svg")&&U3(v.current,s,u,R);const T=j.useRef(!1);j.useInsertionEffect(()=>{A&&T.current&&A.update(s,p)});const C=s[mx],_=j.useRef(!!C&&typeof window<"u"&&!((z=window.MotionHandoffIsComplete)!=null&&z.call(window,C))&&((U=window.MotionHasOptimisedAnimation)==null?void 0:U.call(window,C)));return Lf(()=>{E.current=!0,A&&(T.current=!0,window.MotionIsMounted=!0,A.updateFeatures(),A.scheduleRenderMicrotask(),_.current&&A.animationState&&A.animationState.animateChanges())}),j.useEffect(()=>{A&&(!_.current&&A.animationState&&A.animationState.animateChanges(),_.current&&(queueMicrotask(()=>{var K;(K=window.MotionHandoffMarkAsComplete)==null||K.call(window,C)}),_.current=!1),A.enteringChildren=void 0)}),A}function U3(n,i,s,r){const{layoutId:u,layout:f,drag:d,dragConstraints:h,layoutScroll:p,layoutRoot:g,layoutAnchor:x,layoutCrossfade:b}=i;n.projection=new s(n.latestValues,i["data-framer-portal-id"]?void 0:sb(n.parent)),n.projection.setOptions({layoutId:u,layout:f,alwaysMeasureLayout:!!d||h&&xi(h),visualElement:n,animationType:typeof f=="string"?f:"both",initialPromotionConfig:r,crossfade:b,layoutScroll:p,layoutRoot:g,layoutAnchor:x})}function sb(n){if(n)return n.options.allowProjection!==!1?n.projection:sb(n.parent)}function Uc(n,{forwardMotionProps:i=!1,type:s}={},r,u){r&&v3(r);const f=s?s==="svg":cd(n),d=f?V3:k3;function h(g,x){let b;const v={...j.useContext(od),...g,layoutId:H3(g)},{isStatic:E}=v,A=w3(g),R=d(g,E);if(!E&&typeof window<"u"){G3();const T=Y3(v);b=T.MeasureLayout,A.visualElement=L3(n,R,v,u,T.ProjectionNode,f)}return m.jsxs(Ir.Provider,{value:A,children:[b&&A.visualElement?m.jsx(b,{visualElement:A.visualElement,...v}):null,D3(n,g,_3(R,A.visualElement,x),R,E,i,f)]})}h.displayName=`motion.${typeof n=="string"?n:`create(${n.displayName??n.name??""})`}`;const p=j.forwardRef(h);return p[B3]=n,p}function H3({layoutId:n}){const i=j.useContext(Bf).id;return i&&n!==void 0?i+"-"+n:n}function G3(n,i){j.useContext(Ix).strict}function Y3(n){const i=tb(),{drag:s,layout:r}=i;if(!s&&!r)return{};const u={...s,...r};return{MeasureLayout:s!=null&&s.isEnabled(n)||r!=null&&r.isEnabled(n)?u.MeasureLayout:void 0,ProjectionNode:u.ProjectionNode}}function q3(n,i){if(typeof Proxy>"u")return Uc;const s=new Map,r=(f,d)=>Uc(f,d,n,i),u=(f,d)=>r(f,d);return new Proxy(u,{get:(f,d)=>d==="create"?r:(s.has(d)||s.set(d,Uc(d,void 0,n,i)),s.get(d))})}const X3=(n,i)=>i.isSVG??cd(n)?new vT(i):new mT(i,{allowProjection:n!==j.Fragment});class K3 extends la{constructor(i){super(i),i.animationState||(i.animationState=wT(i))}updateAnimationControlsSubscription(){const{animate:i}=this.node.getProps();$r(i)&&(this.unmountControls=i.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:i}=this.node.getProps(),{animate:s}=this.node.prevProps||{};i!==s&&this.updateAnimationControlsSubscription()}unmount(){var i;this.node.animationState.reset(),(i=this.unmountControls)==null||i.call(this)}}let Q3=0;class Z3 extends la{constructor(){super(...arguments),this.id=Q3++,this.isExitComplete=!1}update(){var f;if(!this.node.presenceContext)return;const{isPresent:i,onExitComplete:s}=this.node.presenceContext,{isPresent:r}=this.node.prevPresenceContext||{};if(!this.node.animationState||i===r)return;if(i&&r===!1){if(this.isExitComplete){const{initial:d,custom:h}=this.node.getProps();if(typeof d=="string"||typeof d=="object"&&d!==null&&!Array.isArray(d)){const p=Da(this.node,d,h);if(p){const{transition:g,transitionEnd:x,...b}=p;for(const v in b)(f=this.node.getValue(v))==null||f.jump(b[v])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const u=this.node.animationState.setActive("exit",!i);s&&!i&&u.then(()=>{this.isExitComplete=!0,s(this.id)})}mount(){const{register:i,onExitComplete:s}=this.node.presenceContext||{};s&&s(this.id),i&&(this.unmount=i(this.id))}unmount(){}}const F3={animation:{Feature:K3},exit:{Feature:Z3}};function Fl(n){return{point:{x:n.pageX,y:n.pageY}}}const J3=n=>i=>nd(i)&&n(i,Fl(i));function Vl(n,i,s,r){return Hl(n,i,J3(s),r)}const rb=({current:n})=>n?n.ownerDocument.defaultView:null,Lg=(n,i)=>Math.abs(n-i);function P3(n,i){const s=Lg(n.x,i.x),r=Lg(n.y,i.y);return Math.sqrt(s**2+r**2)}const Ug=new Set(["auto","scroll"]);class ob{constructor(i,s,{transformPagePoint:r,contextWindow:u=window,dragSnapToOrigin:f=!1,distanceThreshold:d=3,element:h}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=A=>{this.handleScroll(A.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=yr(this.lastRawMoveEventInfo,this.transformPagePoint));const A=Hc(this.lastMoveEventInfo,this.history),R=this.startEvent!==null,T=P3(A.offset,{x:0,y:0})>=this.distanceThreshold;if(!R&&!T)return;const{point:C}=A,{timestamp:_}=le;this.history.push({...C,timestamp:_});const{onStart:z,onMove:U}=this.handlers;R||(z&&z(this.lastMoveEvent,A),this.startEvent=this.lastMoveEvent),U&&U(this.lastMoveEvent,A)},this.handlePointerMove=(A,R)=>{this.lastMoveEvent=A,this.lastRawMoveEventInfo=R,this.lastMoveEventInfo=yr(R,this.transformPagePoint),kt.update(this.updatePoint,!0)},this.handlePointerUp=(A,R)=>{this.end();const{onEnd:T,onSessionEnd:C,resumeAnimation:_}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&_&&_(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const z=Hc(A.type==="pointercancel"?this.lastMoveEventInfo:yr(R,this.transformPagePoint),this.history);this.startEvent&&T&&T(A,z),C&&C(A,z)},!nd(i))return;this.dragSnapToOrigin=f,this.handlers=s,this.transformPagePoint=r,this.distanceThreshold=d,this.contextWindow=u||window;const p=Fl(i),g=yr(p,this.transformPagePoint),{point:x}=g,{timestamp:b}=le;this.history=[{...x,timestamp:b}];const{onSessionStart:v}=s;v&&v(i,Hc(g,this.history));const E={passive:!0,capture:!0};this.removeListeners=Kl(Vl(this.contextWindow,"pointermove",this.handlePointerMove,E),Vl(this.contextWindow,"pointerup",this.handlePointerUp,E),Vl(this.contextWindow,"pointercancel",this.handlePointerUp,E)),h&&this.startScrollTracking(h)}startScrollTracking(i){let s=i.parentElement;for(;s;){const r=getComputedStyle(s);(Ug.has(r.overflowX)||Ug.has(r.overflowY))&&this.scrollPositions.set(s,{x:s.scrollLeft,y:s.scrollTop}),s=s.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(i){const s=this.scrollPositions.get(i);if(!s)return;const r=i===window,u=r?{x:window.scrollX,y:window.scrollY}:{x:i.scrollLeft,y:i.scrollTop},f={x:u.x-s.x,y:u.y-s.y};f.x===0&&f.y===0||(r?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=f.x,this.lastMoveEventInfo.point.y+=f.y):this.history.length>0&&(this.history[0].x-=f.x,this.history[0].y-=f.y),this.scrollPositions.set(i,u),kt.update(this.updatePoint,!0))}updateHandlers(i){this.handlers=i}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),aa(this.updatePoint)}}function yr(n,i){return i?{point:i(n.point)}:n}function Hg(n,i){return{x:n.x-i.x,y:n.y-i.y}}function Hc({point:n},i){return{point:n,delta:Hg(n,ub(i)),offset:Hg(n,$3(i)),velocity:W3(i,.1)}}function $3(n){return n[0]}function ub(n){return n[n.length-1]}function W3(n,i){if(n.length<2)return{x:0,y:0};let s=n.length-1,r=null;const u=ub(n);for(;s>=0&&(r=n[s],!(u.timestamp-r.timestamp>Me(i)));)s--;if(!r)return{x:0,y:0};r===n[0]&&n.length>2&&u.timestamp-r.timestamp>Me(i)*2&&(r=n[1]);const f=He(u.timestamp-r.timestamp);if(f===0)return{x:0,y:0};const d={x:(u.x-r.x)/f,y:(u.y-r.y)/f};return d.x===1/0&&(d.x=0),d.y===1/0&&(d.y=0),d}function I3(n,{min:i,max:s},r){return i!==void 0&&n<i?n=r?Ot(i,n,r.min):Math.max(n,i):s!==void 0&&n>s&&(n=r?Ot(s,n,r.max):Math.min(n,s)),n}function Gg(n,i,s){return{min:i!==void 0?n.min+i:void 0,max:s!==void 0?n.max+s-(n.max-n.min):void 0}}function tE(n,{top:i,left:s,bottom:r,right:u}){return{x:Gg(n.x,s,u),y:Gg(n.y,i,r)}}function Yg(n,i){let s=i.min-n.min,r=i.max-n.max;return i.max-i.min<n.max-n.min&&([s,r]=[r,s]),{min:s,max:r}}function eE(n,i){return{x:Yg(n.x,i.x),y:Yg(n.y,i.y)}}function nE(n,i){let s=.5;const r=fe(n),u=fe(i);return u>r?s=_l(i.min,i.max-r,n.min):r>u&&(s=_l(n.min,n.max-u,i.min)),sn(0,1,s)}function aE(n,i){const s={};return i.min!==void 0&&(s.min=i.min-n.min),i.max!==void 0&&(s.max=i.max-n.min),s}const Sf=.35;function iE(n=Sf){return n===!1?n=0:n===!0&&(n=Sf),{x:qg(n,"left","right"),y:qg(n,"top","bottom")}}function qg(n,i,s){return{min:Xg(n,i),max:Xg(n,s)}}function Xg(n,i){return typeof n=="number"?n:n[i]||0}const lE=new WeakMap;class sE{constructor(i){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=$t(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=i}start(i,{snapToCursor:s=!1,distanceThreshold:r}={}){const{presenceContext:u}=this.visualElement;if(u&&u.isPresent===!1)return;const f=b=>{s&&this.snapToCursor(Fl(b).point),this.stopAnimation()},d=(b,v)=>{const{drag:E,dragPropagation:A,onDragStart:R}=this.getProps();if(E&&!A&&(this.openDragLock&&this.openDragLock(),this.openDragLock=Oj(E),!this.openDragLock))return;this.latestPointerEvent=b,this.latestPanInfo=v,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),en(C=>{let _=this.getAxisMotionValue(C).get()||0;if(an.test(_)){const{projection:z}=this.visualElement;if(z&&z.layout){const U=z.layout.layoutBox[C];U&&(_=fe(U)*(parseFloat(_)/100))}}this.originPoint[C]=_}),R&&kt.update(()=>R(b,v),!1,!0),ff(this.visualElement,"transform");const{animationState:T}=this.visualElement;T&&T.setActive("whileDrag",!0)},h=(b,v)=>{this.latestPointerEvent=b,this.latestPanInfo=v;const{dragPropagation:E,dragDirectionLock:A,onDirectionLock:R,onDrag:T}=this.getProps();if(!E&&!this.openDragLock)return;const{offset:C}=v;if(A&&this.currentDirection===null){this.currentDirection=oE(C),this.currentDirection!==null&&R&&R(this.currentDirection);return}this.updateAxis("x",v.point,C),this.updateAxis("y",v.point,C),this.visualElement.render(),T&&kt.update(()=>T(b,v),!1,!0)},p=(b,v)=>{this.latestPointerEvent=b,this.latestPanInfo=v,this.stop(b,v),this.latestPointerEvent=null,this.latestPanInfo=null},g=()=>{const{dragSnapToOrigin:b}=this.getProps();(b||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:x}=this.getProps();this.panSession=new ob(i,{onSessionStart:f,onStart:d,onMove:h,onSessionEnd:p,resumeAnimation:g},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:x,distanceThreshold:r,contextWindow:rb(this.visualElement),element:this.visualElement.current})}stop(i,s){const r=i||this.latestPointerEvent,u=s||this.latestPanInfo,f=this.isDragging;if(this.cancel(),!f||!u||!r)return;const{velocity:d}=u;this.startAnimation(d);const{onDragEnd:h}=this.getProps();h&&kt.postRender(()=>h(r,u))}cancel(){this.isDragging=!1;const{projection:i,animationState:s}=this.visualElement;i&&(i.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:r}=this.getProps();!r&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),s&&s.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(i,s,r){const{drag:u}=this.getProps();if(!r||!xr(i,u,this.currentDirection))return;const f=this.getAxisMotionValue(i);let d=this.originPoint[i]+r[i];this.constraints&&this.constraints[i]&&(d=I3(d,this.constraints[i],this.elastic[i])),f.set(d)}resolveConstraints(){var f;const{dragConstraints:i,dragElastic:s}=this.getProps(),r=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(f=this.visualElement.projection)==null?void 0:f.layout,u=this.constraints;i&&xi(i)?this.constraints||(this.constraints=this.resolveRefConstraints()):i&&r?this.constraints=tE(r.layoutBox,i):this.constraints=!1,this.elastic=iE(s),u!==this.constraints&&!xi(i)&&r&&this.constraints&&!this.hasMutatedConstraints&&en(d=>{this.constraints!==!1&&this.getAxisMotionValue(d)&&(this.constraints[d]=aE(r.layoutBox[d],this.constraints[d]))})}resolveRefConstraints(){const{dragConstraints:i,onMeasureDragConstraints:s}=this.getProps();if(!i||!xi(i))return!1;const r=i.current,{projection:u}=this.visualElement;if(!u||!u.layout)return!1;u.root&&(u.root.scroll=void 0,u.root.updateScroll());const f=oT(r,u.root,this.visualElement.getTransformPagePoint());let d=eE(u.layout.layoutBox,f);if(s){const h=s(lT(d));this.hasMutatedConstraints=!!h,h&&(d=Rx(h))}return d}startAnimation(i){const{drag:s,dragMomentum:r,dragElastic:u,dragTransition:f,dragSnapToOrigin:d,onDragTransitionEnd:h}=this.getProps(),p=this.constraints||{},g=en(x=>{if(!xr(x,s,this.currentDirection))return;let b=p&&p[x]||{};(d===!0||d===x)&&(b={min:0,max:0});const v=u?200:1e6,E=u?40:1e7,A={type:"inertia",velocity:r?i[x]:0,bounceStiffness:v,bounceDamping:E,timeConstant:750,restDelta:1,restSpeed:10,...f,...b};return this.startAxisValueAnimation(x,A)});return Promise.all(g).then(h)}startAxisValueAnimation(i,s){const r=this.getAxisMotionValue(i);return ff(this.visualElement,i),r.start(Wf(i,r,0,s,this.visualElement,!1))}stopAnimation(){en(i=>this.getAxisMotionValue(i).stop())}getAxisMotionValue(i){const s=`_drag${i.toUpperCase()}`,u=this.visualElement.getProps()[s];return u||this.visualElement.getValue(i,this.visualElement.latestValues[i]??0)}snapToCursor(i){en(s=>{const{drag:r}=this.getProps();if(!xr(s,r,this.currentDirection))return;const{projection:u}=this.visualElement,f=this.getAxisMotionValue(s);if(u&&u.layout){const{min:d,max:h}=u.layout.layoutBox[s],p=f.get()||0;f.set(i[s]-Ot(d,h,.5)+p)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:i,dragConstraints:s}=this.getProps(),{projection:r}=this.visualElement;if(!xi(s)||!r||!this.constraints)return;this.stopAnimation();const u={x:0,y:0};en(d=>{const h=this.getAxisMotionValue(d);if(h&&this.constraints!==!1){const p=h.get();u[d]=nE({min:p,max:p},this.constraints[d])}});const{transformTemplate:f}=this.visualElement.getProps();this.visualElement.current.style.transform=f?f({},""):"none",r.root&&r.root.updateScroll(),r.updateLayout(),this.constraints=!1,this.resolveConstraints(),en(d=>{if(!xr(d,i,null))return;const h=this.getAxisMotionValue(d),{min:p,max:g}=this.constraints[d];h.set(Ot(p,g,u[d]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;lE.set(this.visualElement,this);const i=this.visualElement.current,s=Vl(i,"pointerdown",g=>{const{drag:x,dragListener:b=!0}=this.getProps(),v=g.target,E=v!==i&&Uj(v);x&&b&&!E&&this.start(g)});let r;const u=()=>{const{dragConstraints:g}=this.getProps();xi(g)&&g.current&&(this.constraints=this.resolveRefConstraints(),r||(r=rE(i,g.current,()=>this.scalePositionWithinConstraints())))},{projection:f}=this.visualElement,d=f.addEventListener("measure",u);f&&!f.layout&&(f.root&&f.root.updateScroll(),f.updateLayout()),kt.read(u);const h=Hl(window,"resize",()=>this.scalePositionWithinConstraints()),p=f.addEventListener("didUpdate",(({delta:g,hasLayoutChanged:x})=>{this.isDragging&&x&&(en(b=>{const v=this.getAxisMotionValue(b);v&&(this.originPoint[b]+=g[b].translate,v.set(v.get()+g[b].translate))}),this.visualElement.render())}));return()=>{h(),s(),d(),p&&p(),r&&r()}}getProps(){const i=this.visualElement.getProps(),{drag:s=!1,dragDirectionLock:r=!1,dragPropagation:u=!1,dragConstraints:f=!1,dragElastic:d=Sf,dragMomentum:h=!0}=i;return{...i,drag:s,dragDirectionLock:r,dragPropagation:u,dragConstraints:f,dragElastic:d,dragMomentum:h}}}function Kg(n){let i=!0;return()=>{if(i){i=!1;return}n()}}function rE(n,i,s){const r=W0(n,Kg(s)),u=W0(i,Kg(s));return()=>{r(),u()}}function xr(n,i,s){return(i===!0||i===n)&&(s===null||s===n)}function oE(n,i=10){let s=null;return Math.abs(n.y)>i?s="y":Math.abs(n.x)>i&&(s="x"),s}class uE extends la{constructor(i){super(i),this.removeGroupControls=Ge,this.removeListeners=Ge,this.controls=new sE(i)}mount(){const{dragControls:i}=this.node.getProps();i&&(this.removeGroupControls=i.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Ge}update(){const{dragControls:i}=this.node.getProps(),{dragControls:s}=this.node.prevProps||{};i!==s&&(this.removeGroupControls(),i&&(this.removeGroupControls=i.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const Gc=n=>(i,s)=>{n&&kt.update(()=>n(i,s),!1,!0)};class cE extends la{constructor(){super(...arguments),this.removePointerDownListener=Ge}onPointerDown(i){this.session=new ob(i,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:rb(this.node)})}createPanHandlers(){const{onPanSessionStart:i,onPanStart:s,onPan:r,onPanEnd:u}=this.node.getProps();return{onSessionStart:Gc(i),onStart:Gc(s),onMove:Gc(r),onEnd:(f,d)=>{delete this.session,u&&kt.postRender(()=>u(f,d))}}}mount(){this.removePointerDownListener=Vl(this.node.current,"pointerdown",i=>this.onPointerDown(i))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let Yc=!1;class fE extends j.Component{componentDidMount(){const{visualElement:i,layoutGroup:s,switchLayoutGroup:r,layoutId:u}=this.props,{projection:f}=i;f&&(s.group&&s.group.add(f),r&&r.register&&u&&r.register(f),Yc&&f.root.didUpdate(),f.addEventListener("animationComplete",()=>{this.safeToRemove()}),f.setOptions({...f.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),Dr.hasEverUpdated=!0}getSnapshotBeforeUpdate(i){const{layoutDependency:s,visualElement:r,drag:u,isPresent:f}=this.props,{projection:d}=r;return d&&(d.isPresent=f,i.layoutDependency!==s&&d.setOptions({...d.options,layoutDependency:s}),Yc=!0,u||i.layoutDependency!==s||s===void 0||i.isPresent!==f?d.willUpdate():this.safeToRemove(),i.isPresent!==f&&(f?d.promote():d.relegate()||kt.postRender(()=>{const h=d.getStack();(!h||!h.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:i,layoutAnchor:s}=this.props,{projection:r}=i;r&&(r.options.layoutAnchor=s,r.root.didUpdate(),ed.postRender(()=>{!r.currentAnimation&&r.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:i,layoutGroup:s,switchLayoutGroup:r}=this.props,{projection:u}=i;Yc=!0,u&&(u.scheduleCheckAfterUnmount(),s&&s.group&&s.group.remove(u),r&&r.deregister&&r.deregister(u))}safeToRemove(){const{safeToRemove:i}=this.props;i&&i()}render(){return null}}function cb(n){const[i,s]=Wx(),r=j.useContext(Bf);return m.jsx(fE,{...n,layoutGroup:r,switchLayoutGroup:j.useContext(lb),isPresent:i,safeToRemove:s})}const dE={pan:{Feature:cE},drag:{Feature:uE,ProjectionNode:$x,MeasureLayout:cb}};function Qg(n,i,s){const{props:r}=n;n.animationState&&r.whileHover&&n.animationState.setActive("whileHover",s==="Start");const u="onHover"+s,f=r[u];f&&kt.postRender(()=>f(i,Fl(i)))}class hE extends la{mount(){const{current:i}=this.node;i&&(this.unmount=Vj(i,(s,r)=>(Qg(this.node,r,"Start"),u=>Qg(this.node,u,"End"))))}unmount(){}}class mE extends la{constructor(){super(...arguments),this.isActive=!1}onFocus(){let i=!1;try{i=this.node.current.matches(":focus-visible")}catch{i=!0}!i||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Kl(Hl(this.node.current,"focus",()=>this.onFocus()),Hl(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function Zg(n,i,s){const{props:r}=n;if(n.current instanceof HTMLButtonElement&&n.current.disabled)return;n.animationState&&r.whileTap&&n.animationState.setActive("whileTap",s==="Start");const u="onTap"+(s==="End"?"":s),f=r[u];f&&kt.postRender(()=>f(i,Fl(i)))}class pE extends la{mount(){const{current:i}=this.node;if(!i)return;const{globalTapTarget:s,propagate:r}=this.node.props;this.unmount=Gj(i,(u,f)=>(Zg(this.node,f,"Start"),(d,{success:h})=>Zg(this.node,d,h?"End":"Cancel")),{useGlobalTarget:s,stopPropagation:(r==null?void 0:r.tap)===!1})}unmount(){}}const jf=new WeakMap,qc=new WeakMap,gE=n=>{const i=jf.get(n.target);i&&i(n)},yE=n=>{n.forEach(gE)};function xE({root:n,...i}){const s=n||document;qc.has(s)||qc.set(s,{});const r=qc.get(s),u=JSON.stringify(i);return r[u]||(r[u]=new IntersectionObserver(yE,{root:n,...i})),r[u]}function bE(n,i,s){const r=xE(i);return jf.set(n,s),r.observe(n),()=>{jf.delete(n),r.unobserve(n)}}const vE={some:0,all:1};class SE extends la{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){var p;(p=this.stopObserver)==null||p.call(this);const{viewport:i={}}=this.node.getProps(),{root:s,margin:r,amount:u="some",once:f}=i,d={root:s?s.current:void 0,rootMargin:r,threshold:typeof u=="number"?u:vE[u]},h=g=>{const{isIntersecting:x}=g;if(this.isInView===x||(this.isInView=x,f&&!x&&this.hasEnteredView))return;x&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",x);const{onViewportEnter:b,onViewportLeave:v}=this.node.getProps(),E=x?b:v;E&&E(g)};this.stopObserver=bE(this.node.current,d,h)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:i,prevProps:s}=this.node;["amount","margin","root"].some(jE(i,s))&&this.startObserver()}unmount(){var i;(i=this.stopObserver)==null||i.call(this),this.hasEnteredView=!1,this.isInView=!1}}function jE({viewport:n={}},{viewport:i={}}={}){return s=>n[s]!==i[s]}const TE={inView:{Feature:SE},tap:{Feature:pE},focus:{Feature:mE},hover:{Feature:hE}},EE={layout:{ProjectionNode:$x,MeasureLayout:cb}},wE={...F3,...TE,...dE,...EE},pt=q3(wE,X3),fb=j.createContext(null),fd=()=>{const n=j.useContext(fb);if(!n)throw new Error("useTheme must be used within ThemeProvider");return n},AE=()=>{const n=new Date().getHours();return n>=6&&n<18?"day":"night"},CE=({children:n})=>{const[i,s]=j.useState("day");j.useEffect(()=>{const f=localStorage.getItem("theme-mode");s(f==="day"||f==="night"?f:AE())},[]),j.useEffect(()=>{const f=document.documentElement;i==="night"?f.setAttribute("data-theme","night"):f.setAttribute("data-theme","day")},[i]);const r=j.useCallback(()=>{s(f=>{const d=f==="day"?"night":"day";return localStorage.setItem("theme-mode",d),d})},[]),u={mode:i,toggleTheme:r,isDay:i==="day",isNight:i==="night"};return m.jsx(fb.Provider,{value:u,children:n})},tn=.3,Fg=800,NE=({variant:n="floating"})=>{const{isNight:i}=fd(),[s,r]=j.useState(!1),u=j.useRef(null),f=j.useRef(null);j.useEffect(()=>{const p=i?"/night-rain.mp3":"/day-forest.mp3";if(u.current&&s){const g=u.current,x=g.volume,b=setInterval(()=>{g.volume>.05?g.volume=Math.max(0,g.volume-x/(Fg/50)):(clearInterval(b),g.pause())},50),v=new Audio(p);return v.loop=!0,v.volume=0,u.current=v,v.play().then(()=>{const E=setInterval(()=>{v.volume<tn-.02?v.volume=Math.min(tn,v.volume+tn/(Fg/50)):(v.volume=tn,clearInterval(E))},50)}).catch(()=>{r(!1)}),()=>clearInterval(b)}u.current&&u.current.pause(),u.current=new Audio(p),u.current.loop=!0,u.current.volume=tn},[i]),j.useEffect(()=>()=>{u.current&&(u.current.pause(),u.current=null),f.current&&clearInterval(f.current)},[]);const d=j.useCallback(()=>{if(u.current)if(s){const p=u.current,g=p.volume,x=setInterval(()=>{p.volume>.02?p.volume=Math.max(0,p.volume-g/10):(clearInterval(x),p.pause(),p.volume=tn)},40);f.current=x,r(!1)}else u.current.volume=0,u.current.play().then(()=>{const p=u.current;if(!p)return;const g=setInterval(()=>{p.volume<tn-.02?p.volume=Math.min(tn,p.volume+tn/10):(p.volume=tn,clearInterval(g))},40);f.current=g}).catch(()=>{}),r(!0)},[s]),h=n==="navbar"?`ambient-nav-btn ${s?"ambient-nav-playing":"ambient-nav-muted"}`:`ambient-btn ${s?"ambient-playing":"ambient-muted"}`;return m.jsxs(m.Fragment,{children:[m.jsx("button",{className:h,onClick:d,"aria-label":s?"关闭白噪音":"开启白噪音",title:s?i?"夜雨声":"晨林鸟鸣":"开启白噪音",children:m.jsxs("svg",{width:n==="navbar"?18:22,height:n==="navbar"?18:22,viewBox:"0 0 24 24",fill:"none",children:[m.jsx("path",{d:"M4 14V12C4 7.58 7.58 4 12 4S20 7.58 20 12V14",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),m.jsx("rect",{x:"3",y:"14",width:"3",height:"6",rx:"1.5",fill:"currentColor",opacity:"0.8"}),m.jsx("rect",{x:"18",y:"14",width:"3",height:"6",rx:"1.5",fill:"currentColor",opacity:"0.8"}),s&&m.jsx("path",{d:"M9 17V15M12 18V14M15 17V15",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"})]})}),m.jsx("style",{children:`
        /* ===== 浮动模式（默认，右下角） ===== */
        .ambient-btn {
          position: fixed;
          right: 24px;
          bottom: 72px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--card-bg);
          color: var(--text-soft);
          cursor: pointer;
          opacity: 0.4;
          z-index: 50;
          box-shadow: 0 2px 12px -4px rgba(0,0,0,0.1);
          transition: opacity 0.3s ease, transform 0.3s ease, color 0.3s ease;
        }
        .ambient-btn:hover {
          opacity: 1;
          transform: translateY(-2px);
          color: var(--accent);
          box-shadow: 0 6px 20px -6px rgba(122, 154, 130, 0.3);
        }
        .ambient-playing {
          opacity: 0.7;
          color: var(--accent);
          animation: ambient-pulse 2.5s ease-in-out infinite;
        }
        .ambient-playing:hover {
          opacity: 1;
        }
        .ambient-muted {
          opacity: 0.4;
        }
        @keyframes ambient-pulse {
          0%, 100% { box-shadow: 0 2px 12px -4px rgba(122, 154, 130, 0.2); }
          50% { box-shadow: 0 2px 20px -2px rgba(122, 154, 130, 0.4); }
        }

        /* ===== 导航栏内联模式 ===== */
        .ambient-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-soft);
          cursor: pointer;
          transition: color 0.25s ease, border-color 0.25s ease, opacity 0.25s ease;
        }
        .ambient-nav-btn:hover {
          color: var(--accent);
          border-color: var(--accent);
        }
        .ambient-nav-playing {
          color: var(--accent);
          border-color: rgba(122, 154, 130, 0.4);
        }
        .ambient-nav-muted {
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .ambient-btn {
            right: 16px;
            bottom: 64px;
            width: 36px;
            height: 36px;
          }
        }
      `})]})},Jg=[{key:"home",label:"首页"},{key:"about",label:"关于我"},{key:"projects",label:"项目集"},{key:"lab",label:"疗愈室"}],ME=({current:n,onNavigate:i,isNight:s,onToggleTheme:r,isFullMode:u})=>{const[f,d]=j.useState(!1),h=u?Jg:Jg.filter(p=>p.key==="lab");return j.useEffect(()=>{d(!1)},[n]),m.jsxs("nav",{className:"fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12",style:{background:"var(--bg-overlay)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)"},children:[m.jsxs("div",{className:"flex items-center gap-3",children:[m.jsx(NE,{variant:"navbar"}),!u&&m.jsx("span",{style:{fontFamily:'"Noto Serif SC", serif',fontSize:"15px",color:"var(--text)",fontWeight:500,letterSpacing:"0.05em"},children:"森林疗愈室"})]}),m.jsxs("div",{className:"hidden md:flex items-center gap-8",children:[h.map(p=>m.jsx("button",{onClick:()=>i(p.key),className:"nav-link",style:{color:n===p.key?"var(--accent)":"var(--text-soft)",fontWeight:n===p.key?500:400},children:p.label},p.key)),m.jsx(za,{to:"/toolbox",className:"nav-link",style:{color:"var(--text-soft)"},children:"妙妙工具箱"}),m.jsx("button",{onClick:r,className:"ml-4 px-3 py-1.5 rounded-lg text-sm transition-colors",style:{border:"1px solid var(--border)",color:"var(--text-soft)"},children:s?"日":"夜"})]}),m.jsxs("button",{className:"md:hidden p-2",onClick:()=>d(p=>!p),style:{color:"var(--text)"},"aria-label":"菜单",children:[m.jsx("div",{className:"w-5 h-0.5 mb-1.5",style:{background:"var(--text)"}}),m.jsx("div",{className:"w-5 h-0.5 mb-1.5",style:{background:"var(--text)"}}),m.jsx("div",{className:"w-5 h-0.5",style:{background:"var(--text)"}})]}),f&&m.jsxs("div",{className:"absolute top-16 left-0 right-0 md:hidden flex flex-col py-4 px-6 gap-4",style:{background:"var(--bg-overlay)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)"},children:[h.map(p=>m.jsx("button",{onClick:()=>i(p.key),style:{color:n===p.key?"var(--accent)":"var(--text-soft)",fontWeight:n===p.key?500:400,textAlign:"left"},children:p.label},p.key)),m.jsx(za,{to:"/toolbox",onClick:()=>d(!1),style:{color:"var(--text-soft)",textAlign:"left"},children:"妙妙工具箱"}),m.jsxs("button",{onClick:r,style:{color:"var(--text-soft)",textAlign:"left"},children:["切换",s?"昼":"夜","模式"]})]}),m.jsx("style",{children:`
        .nav-link {
          position: relative;
          padding-bottom: 4px;
          font-size: 15px;
          transition: color 0.25s ease;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 1.5px;
          background: var(--accent);
          transition: width 0.3s ease;
        }
        .nav-link:hover {
          color: var(--accent) !important;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      `})]})},dd=[{id:"forest-healing",title:"森林疗愈室",tag:"沉浸式疗愈网页",painPoint:"专为 i 人设计的低能耗回血方案",description:"融合自然白噪音、呼吸引导与感恩日记的沉浸式疗愈网页，依昼夜节律切换森林光影与萤火粒子，为社交耗竭后的你留一处安静的角落。",imageUrl:"/forest-bg.jpg",liveUrl:"https://forest-healing.vercel.app",link:"https://forest-healing.vercel.app",tags:["React","Framer Motion","Web Audio"]},{id:"answer-book",title:"5%答案书",tag:"轻决策小程序",painPoint:"给选择困难症的一颗轻量解药",description:"当你被选项淹没、迟迟无法下决定时，它不替你做主，只递给你一句刚好够用的提示——把纠结的能耗，悄悄降回 5%。",imageUrl:"/project-mindful.jpg",liveUrl:"https://answer-book.vercel.app",link:"https://answer-book.vercel.app",tags:["React","TypeScript","轻交互"]},{id:"breathing-forest",title:"呼吸之森",tag:"正念呼吸引导器",painPoint:"三分钟，按下焦虑的暂停键",description:"以 4-7-8 呼吸法为节律的 SVG 引导器，叶脉随呼吸张合，配合环境音，让紧绷的神经在三个呼吸里慢慢松开。",imageUrl:"/healing-breathing.jpg",liveUrl:"https://breathing-forest.vercel.app",link:"https://breathing-forest.vercel.app",tags:["SVG 动画","CSS Transform","正念"]},{id:"meditation-space",title:"冥想空间",tag:"可定时冥想工具",painPoint:"把五分钟，安静地还给自己",description:"内置四种自然声景与温柔语音提示的冥想计时器。不必专注，只需坐下，让声音替你保管时间。",imageUrl:"/healing-meditation.jpg",liveUrl:"https://meditation-space.vercel.app",link:"https://meditation-space.vercel.app",tags:["Web Audio","SpeechSynthesis","计时器"]},{id:"gratitude-journal",title:"感恩手账",tag:"翻页式情绪日记",painPoint:"每天一句，把无处安放的情绪接住",description:"十二个月封面的翻页式手账，记录每天一件值得感谢的小事。年末翻回，会看见一整年悄悄发着光的自己。",imageUrl:"/healing-gratitude.jpg",liveUrl:"https://gratitude-journal.vercel.app",link:"https://gratitude-journal.vercel.app",tags:["Framer Motion","LocalStorage","日记"]}],Xr=dd.length,Xc=Xr+1,Pg=600,$g=`data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <pattern id="vein" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
      <path d="M100 10 L100 190 M100 40 Q70 60 50 90 M100 40 Q130 60 150 90 M100 80 Q60 100 40 140 M100 80 Q140 100 160 140 M100 120 Q70 140 55 170 M100 120 Q130 140 145 170" stroke="rgba(122,154,130,0.06)" stroke-width="0.8" fill="none"/>
    </pattern>
  </defs>
  <rect width="200" height="200" fill="url(#vein)"/>
</svg>
`)}`,RE=({size:n=16})=>m.jsxs("svg",{width:n,height:n,viewBox:"0 0 20 20",fill:"none",children:[m.jsx("path",{d:"M10 2C5 2 2 6 2 11c0 4 3 7 8 7 0-5 2-9 8-11-3-3-6-5-8-5z",fill:"rgba(122,154,130,0.6)"}),m.jsx("path",{d:"M6 16C8 12 11 9 15 7",stroke:"rgba(255,255,255,0.4)",strokeWidth:"0.8",strokeLinecap:"round"})]}),DE={enter:n=>({rotateY:n>0?90:-90,opacity:0}),center:{rotateY:0,opacity:1},exit:n=>({rotateY:n>0?-90:90,opacity:0})},zE=()=>m.jsxs("div",{className:"lb-page-content lb-cover",children:[m.jsx("div",{className:"lb-cover-vein"}),m.jsx("div",{className:"lb-cover-frame"}),m.jsxs("div",{className:"lb-cover-inner",children:[m.jsx("div",{className:"lb-cover-leaf",children:m.jsx(RE,{size:42})}),m.jsx("p",{className:"lb-cover-eyebrow",children:"A Leaf Book of Works"}),m.jsx("h1",{className:"lb-cover-title",children:"项目集"}),m.jsx("div",{className:"lb-cover-line"}),m.jsx("p",{className:"lb-cover-author",children:"路俊玲 · 2026"})]}),m.jsx("p",{className:"lb-cover-hint",children:"轻触封面 · 翻开"})]}),OE=({onPick:n})=>m.jsxs("div",{className:"lb-page-content lb-index-page",children:[m.jsx("div",{className:"lb-page-vein"}),m.jsxs("div",{className:"lb-index-grid",children:[m.jsxs("div",{className:"lb-index-left",children:[m.jsx("span",{className:"lb-index-label",children:"CONTENTS"}),m.jsx("h2",{className:"lb-index-title",children:"目录"}),m.jsx("div",{className:"lb-index-deco"}),m.jsxs("p",{className:"lb-index-count",children:["共 ",Xr," 件作品"]})]}),m.jsx("ul",{className:"lb-index-list",children:dd.map((i,s)=>m.jsxs("li",{className:"lb-index-item",onClick:n?r=>{r.stopPropagation(),n(s)}:void 0,children:[m.jsx("span",{className:"lb-index-num",children:String(s+1).padStart(2,"0")}),m.jsxs("div",{className:"lb-index-item-text",children:[m.jsx("span",{className:"lb-index-item-title",children:i.title}),m.jsx("span",{className:"lb-index-item-pain",children:i.painPoint})]}),m.jsxs("span",{className:"lb-index-item-page",children:["P.",s+2]})]},i.id))})]})]}),kE=({project:n,index:i})=>m.jsxs("div",{className:"lb-page-content lb-detail-page",children:[m.jsx("div",{className:"lb-page-vein"}),m.jsxs("div",{className:"lb-detail-grid",children:[m.jsxs("div",{className:"lb-detail-text",children:[m.jsxs("span",{className:"lb-detail-num",children:["No. ",String(i+1).padStart(2,"0")]}),m.jsx("h2",{className:"lb-detail-title",children:n.title}),m.jsxs("div",{className:"lb-detail-pain-wrap",children:[m.jsx("span",{className:"lb-detail-pain-bar"}),m.jsx("p",{className:"lb-detail-pain",children:n.painPoint})]}),m.jsx("p",{className:"lb-detail-desc",children:n.description}),n.tags&&n.tags.length>0&&m.jsx("div",{className:"lb-detail-tags",children:n.tags.map(s=>m.jsx("span",{className:"lb-detail-tag",children:s},s))}),m.jsx("a",{className:"lb-detail-link",href:n.liveUrl,target:"_blank",rel:"noopener noreferrer",onClick:s=>s.stopPropagation(),children:"访问作品 ↗"})]}),m.jsxs("a",{className:"lb-detail-visual",href:n.liveUrl,target:"_blank",rel:"noopener noreferrer",onClick:s=>s.stopPropagation(),children:[n.videoUrl?m.jsx("video",{src:n.videoUrl,className:"lb-detail-media",muted:!0,loop:!0,autoPlay:!0,playsInline:!0}):m.jsx("img",{src:n.imageUrl,alt:n.title,className:"lb-detail-media"}),m.jsx("span",{className:"lb-detail-visual-overlay"}),m.jsx("span",{className:"lb-detail-visual-hint",children:"点击访问 ↗"})]})]})]}),VE=({registerOpenBook:n})=>{const[i,s]=j.useState(0),[r,u]=j.useState(0),[f,d]=j.useState(!1),h=j.useRef(0),p=j.useRef(!1),g=j.useRef(null);j.useEffect(()=>{h.current=i},[i]);const x=j.useCallback((z,U)=>{if(p.current)return;const K=Math.max(0,Math.min(Xr+1,z));K!==h.current&&(p.current=!0,d(!0),u(U),s(K),window.setTimeout(()=>{p.current=!1,d(!1)},Pg))},[]),b=j.useCallback(()=>{h.current>1&&x(h.current-1,-1)},[x]),v=j.useCallback(()=>{h.current<Xc?x(h.current+1,1):h.current===0&&x(1,1)},[x]),E=j.useCallback(()=>{const z=h.current;z===0?x(1,1):z>1&&x(1,-1)},[x]);j.useEffect(()=>{n&&n(E)},[n,E]);const A=z=>{if(h.current===0){x(1,1);return}const K=z.currentTarget.getBoundingClientRect();z.clientX-K.left<K.width/2?b():v()},R=z=>{g.current={x:z.touches[0].clientX,y:z.touches[0].clientY}},T=z=>{if(!g.current)return;const U=z.changedTouches[0].clientX-g.current.x,K=z.changedTouches[0].clientY-g.current.y;Math.abs(U)>50&&Math.abs(U)>Math.abs(K)&&(U<0?v():b()),g.current=null},C=z=>{if(z===0)return m.jsx(zE,{});if(z===1)return m.jsx(OE,{onPick:K=>x(K+2,1)});const U=z-2;return U>=0&&U<Xr?m.jsx(kE,{project:dd[U],index:U}):null},_=i===0;return m.jsxs("div",{className:"lb-wrapper",children:[m.jsxs("div",{className:"lb-book-stand",children:[m.jsxs("div",{className:"lb-book",onClick:A,onTouchStart:R,onTouchEnd:T,children:[m.jsx("div",{className:"lb-spine-shadow"}),m.jsxs("div",{className:"lb-pages-container",children:[m.jsx(ia,{mode:"wait",custom:r,children:m.jsx(pt.div,{className:"lb-page",custom:r,variants:DE,initial:"enter",animate:"center",exit:"exit",transition:{duration:Pg/1e3,ease:[.4,0,.2,1]},style:{transformOrigin:"left center"},children:C(i)},i)}),f&&m.jsx("div",{className:`lb-flip-shadow ${r>0?"lb-flip-shadow-fwd":"lb-flip-shadow-bwd"}`})]}),!_&&m.jsx("button",{className:"lb-close-btn",onClick:z=>{z.stopPropagation(),x(0,-1)},children:"合上书"})]}),m.jsx("div",{className:"lb-desk-shadow"})]}),!_&&m.jsxs("div",{className:"lb-controls",children:[m.jsx("button",{className:"lb-nav-btn",onClick:z=>{z.stopPropagation(),b()},disabled:i===1,"aria-label":"上一页",children:"←"}),m.jsxs("span",{className:"lb-page-indicator",children:["第 ",m.jsx("span",{className:"lb-page-current",children:i})," / ",Xc," 页"]}),m.jsx("button",{className:"lb-nav-btn",onClick:z=>{z.stopPropagation(),v()},disabled:i===Xc,"aria-label":"下一页",children:"→"})]}),m.jsx("style",{children:`
        .lb-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          margin-top: 32px;
        }

        /* ===== 书容器 + 木桌投影 ===== */
        .lb-book-stand {
          position: relative;
          perspective: 1800px;
        }
        .lb-book {
          position: relative;
          width: 420px;
          height: 594px;
          max-width: 90vw;
          max-height: 75vh;
          border-radius: 4px 12px 12px 4px;
          overflow: hidden;
          cursor: pointer;
          box-shadow:
            0 2px 8px -2px rgba(0,0,0,0.15),
            0 12px 40px -8px rgba(60, 50, 40, 0.25),
            inset 4px 0 12px -4px rgba(0,0,0,0.1);
          background: var(--lb-page-bg, #F5F0E4);
          transition: background 0.6s ease;
        }

        /* 主题变量 */
        :root[data-theme="day"] .lb-book {
          --lb-page-bg: #F5F0E4;
          --lb-vein-color: rgba(122, 154, 130, 0.06);
          --lb-text: #3d3d3d;
          --lb-text-soft: #6b6b6b;
        }
        :root[data-theme="night"] .lb-book {
          --lb-page-bg: #2A3028;
          --lb-vein-color: rgba(157, 184, 165, 0.05);
          --lb-text: #e2e8f0;
          --lb-text-soft: #a0aec0;
        }

        /* 桌面投影 */
        .lb-desk-shadow {
          width: 380px;
          max-width: 85vw;
          height: 20px;
          margin: 0 auto;
          background: radial-gradient(ellipse, rgba(60,50,40,0.15) 0%, transparent 70%);
          border-radius: 50%;
        }

        /* 书脊阴影 */
        .lb-spine-shadow {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 12px;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.12) 0%,
            rgba(0,0,0,0.04) 50%,
            transparent 100%
          );
          z-index: 6;
          pointer-events: none;
        }

        /* 页面容器 */
        .lb-pages-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }
        .lb-page {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* 翻页阴影 */
        .lb-flip-shadow {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          animation: lb-shadow-fade 0.55s ease-out forwards;
        }
        .lb-flip-shadow-fwd {
          background: linear-gradient(to left, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.04) 35%, transparent 60%);
        }
        .lb-flip-shadow-bwd {
          background: linear-gradient(to right, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.04) 35%, transparent 60%);
        }
        @keyframes lb-shadow-fade {
          0% { opacity: 0.95; }
          60% { opacity: 0.5; }
          100% { opacity: 0; }
        }

        /* ===== 页面内容通用 ===== */
        .lb-page-content {
          position: relative;
          width: 100%;
          height: 100%;
          background: var(--lb-page-bg);
          overflow: hidden;
        }
        .lb-page-vein {
          position: absolute;
          inset: 0;
          background-image: url("${$g}");
          background-repeat: repeat;
          opacity: 0.7;
          pointer-events: none;
          z-index: 0;
        }

        /* ===== 封面 ===== */
        .lb-cover {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #E8E0D0 0%, #F0EAD8 50%, #E8E0D0 100%);
        }
        :root[data-theme="night"] .lb-cover {
          background: linear-gradient(135deg, #1E2820 0%, #2A3328 50%, #1E2820 100%);
        }
        .lb-cover-vein {
          position: absolute;
          inset: 0;
          background-image: url("${$g}");
          opacity: 0.5;
          z-index: 0;
        }
        .lb-cover-frame {
          position: absolute;
          inset: 22px;
          border: 1px solid rgba(184, 140, 106, 0.3);
          border-radius: 3px;
          box-shadow: inset 0 0 0 6px transparent, inset 0 0 0 7px rgba(184, 140, 106, 0.12);
          pointer-events: none;
          z-index: 1;
        }
        .lb-cover-inner {
          position: relative;
          text-align: center;
          z-index: 2;
        }
        .lb-cover-leaf {
          display: flex;
          justify-content: center;
          margin-bottom: 18px;
          opacity: 0.85;
        }
        .lb-cover-eyebrow {
          font-size: 11px;
          color: var(--lb-text-soft);
          letter-spacing: 0.28em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .lb-cover-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 40px;
          font-weight: 700;
          color: var(--lb-text);
          margin: 0 0 18px;
          letter-spacing: 0.16em;
        }
        .lb-cover-line {
          width: 44px;
          height: 1px;
          background: var(--lb-text-soft);
          margin: 0 auto 16px;
          opacity: 0.4;
        }
        .lb-cover-author {
          font-size: 14px;
          color: var(--lb-text-soft);
          font-family: "Noto Serif SC", Georgia, serif;
          letter-spacing: 0.05em;
        }
        .lb-cover-hint {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          letter-spacing: 0.24em;
          color: var(--lb-text-soft);
          opacity: 0.5;
          z-index: 2;
          animation: lb-hint-pulse 3.2s ease-in-out infinite;
        }
        @keyframes lb-hint-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.75; }
        }

        /* ===== 目录页 ===== */
        .lb-index-page { display: flex; }
        .lb-index-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 0.82fr 1.18fr;
          gap: 24px;
          width: 100%;
          height: 100%;
          padding: 48px 40px;
        }
        .lb-index-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid rgba(184, 140, 106, 0.15);
          padding-right: 20px;
        }
        .lb-index-label {
          font-size: 10px;
          letter-spacing: 0.3em;
          color: var(--lb-text-soft);
          opacity: 0.7;
          margin-bottom: 10px;
        }
        .lb-index-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 38px;
          font-weight: 700;
          color: var(--lb-text);
          letter-spacing: 0.1em;
          margin: 0;
        }
        .lb-index-deco {
          width: 28px;
          height: 1px;
          background: var(--accent);
          opacity: 0.6;
          margin: 18px 0;
        }
        .lb-index-count {
          font-size: 12px;
          color: var(--lb-text-soft);
          letter-spacing: 0.05em;
        }
        .lb-index-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }
        .lb-index-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 11px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.28s ease, background 0.28s ease;
        }
        .lb-index-item:hover {
          transform: translateX(4px);
          background: rgba(184, 140, 106, 0.07);
        }
        .lb-index-num {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          color: var(--accent);
          opacity: 0.7;
          font-variant-numeric: tabular-nums;
          min-width: 22px;
        }
        .lb-index-item-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }
        .lb-index-item-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--lb-text);
        }
        .lb-index-item-pain {
          font-size: 11px;
          color: var(--lb-text-soft);
          opacity: 0.85;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lb-index-item-page {
          font-size: 11px;
          color: var(--lb-text-soft);
          opacity: 0.55;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.05em;
        }

        /* ===== 详情页（左右分栏） ===== */
        .lb-detail-page { display: flex; }
        .lb-detail-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          width: 100%;
          height: 100%;
        }
        .lb-detail-text {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          padding: 44px 30px 56px;
          border-right: 1px solid rgba(184, 140, 106, 0.14);
          overflow-y: auto;
          scrollbar-width: none;
        }
        .lb-detail-text::-webkit-scrollbar { display: none; }
        .lb-detail-num {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--accent);
          opacity: 0.8;
          margin-bottom: 14px;
          font-variant-numeric: tabular-nums;
        }
        .lb-detail-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 27px;
          font-weight: 700;
          color: var(--lb-text);
          line-height: 1.25;
          margin: 0 0 18px;
          letter-spacing: 0.02em;
        }
        .lb-detail-pain-wrap {
          display: flex;
          align-items: stretch;
          gap: 12px;
          margin-bottom: 18px;
        }
        .lb-detail-pain-bar {
          width: 3px;
          border-radius: 2px;
          background: var(--accent);
          flex-shrink: 0;
          opacity: 0.8;
        }
        .lb-detail-pain {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--accent);
          line-height: 1.55;
          margin: 0;
        }
        .lb-detail-desc {
          font-size: 13px;
          line-height: 1.85;
          color: var(--lb-text-soft);
          margin: 0 0 18px;
        }
        .lb-detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 18px;
        }
        .lb-detail-tag {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 6px;
          background: rgba(184, 140, 106, 0.1);
          color: var(--lb-text-soft);
        }
        .lb-detail-link {
          margin-top: auto;
          align-self: flex-start;
          font-size: 13px;
          color: var(--accent);
          font-weight: 500;
          text-decoration: none;
          padding: 7px 0;
          border-bottom: 1px solid rgba(184, 140, 106, 0.3);
          transition: border-color 0.25s ease;
        }
        .lb-detail-link:hover { border-color: var(--accent); }

        /* 右栏 视觉区 */
        .lb-detail-visual {
          position: relative;
          z-index: 2;
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #1a1f1a;
        }
        .lb-detail-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .lb-detail-visual:hover .lb-detail-media { transform: scale(1.03); }
        .lb-detail-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .lb-detail-visual:hover .lb-detail-visual-overlay { opacity: 1; }
        .lb-detail-visual-hint {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 4px 11px;
          font-size: 11px;
          border-radius: 999px;
          background: rgba(0,0,0,0.45);
          color: #fff;
          backdrop-filter: blur(4px);
          letter-spacing: 0.05em;
          opacity: 0.85;
        }

        /* ===== 合上书按钮 ===== */
        .lb-close-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          z-index: 20;
          padding: 7px 16px;
          font-size: 12px;
          font-family: "Noto Sans SC", sans-serif;
          color: var(--lb-text-soft);
          background: rgba(245, 240, 228, 0.7);
          border: 1px solid rgba(184, 140, 106, 0.25);
          border-radius: 999px;
          cursor: pointer;
          backdrop-filter: blur(6px);
          transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }
        :root[data-theme="night"] .lb-close-btn {
          background: rgba(42, 48, 40, 0.7);
        }
        .lb-close-btn:hover {
          color: var(--accent);
          border-color: var(--accent);
          transform: translateY(-1px);
        }

        /* ===== 底部控制 ===== */
        .lb-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .lb-nav-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 50%;
          background: var(--card-bg);
          color: var(--text-soft);
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .lb-nav-btn:hover:not(:disabled) {
          border-color: var(--accent);
          color: var(--accent);
          transform: scale(1.06);
        }
        .lb-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .lb-page-indicator {
          font-size: 13px;
          color: var(--text-soft);
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.05em;
        }
        .lb-page-current {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px;
          color: var(--accent);
          font-weight: 600;
        }

        /* ===== 移动端 ===== */
        @media (max-width: 768px) {
          .lb-book {
            width: 300px;
            height: 424px;
            max-height: 68vh;
          }
          .lb-index-grid { padding: 30px 20px; gap: 14px; grid-template-columns: 0.7fr 1.3fr; }
          .lb-index-title { font-size: 26px; }
          .lb-index-item { padding: 7px 8px; gap: 8px; }
          .lb-index-item-title { font-size: 13px; }
          .lb-index-item-pain { font-size: 10px; }
          .lb-cover-title { font-size: 30px; }
          /* 详情：移动端改为上下分栏 */
          .lb-detail-grid { grid-template-columns: 1fr; grid-template-rows: 1.15fr 0.85fr; }
          .lb-detail-text {
            padding: 24px 20px 16px;
            border-right: none;
            border-bottom: 1px solid rgba(184, 140, 106, 0.14);
          }
          .lb-detail-title { font-size: 20px; margin-bottom: 12px; }
          .lb-detail-pain { font-size: 13px; }
          .lb-detail-desc { font-size: 12px; line-height: 1.7; margin-bottom: 12px; }
          .lb-detail-tags { margin-bottom: 12px; }
          .lb-detail-link { font-size: 12px; }
          .lb-close-btn { bottom: 12px; right: 12px; padding: 6px 12px; font-size: 11px; }
        }
      `})]})},db="gratitude_entries",Gl="gratitude_drafts",Tf=["新生","接纳","表达","感恩","身体","小确幸","平静","创造","韧性","放下","连接","回顾"],BE=["新的一年，从写下今天最想开始的改变开始…","今天，我允许自己不完美，接纳此刻的情绪和身体。","情绪不是敌人，今天我选择用文字、绘画或声音表达它。","今天，我感谢谁？哪怕只是一句问候、一个微笑。","身体在告诉我什么？今天我倾听它的信号，给它一杯水、一次拉伸。","今天，哪个微小瞬间让我嘴角上扬？一杯咖啡、一阵风、一句“你来了”。","今天，我为自己创造了一刻宁静——也许是闭眼深呼吸，也许是看云发呆。","今天，我允许自己“无用”地创造——画一笔、写一句、哼一段旋律。","今天，我面对了一个小挑战，我对自己说：“我可以慢慢来。”","今天，我放下了一件小事——也许是旧物、旧想法、旧情绪。","今天，我和谁有了真实的对话？哪怕只是眼神交汇、指尖触碰。","这一年，我感谢自己坚持下来的每一天。明年，我想继续温柔地生长。"],hb=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],_E=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],Ef=[{key:"sun",label:"晴天"},{key:"cloud",label:"多云"},{key:"rain",label:"雨天"},{key:"moon",label:"夜晚"}],Kc=[{key:"joy",dot:"#F4D88A",label:"开心"},{key:"calm",dot:"#A5D6A7",label:"平静"},{key:"cool",dot:"#90CAF9",label:"冷静"},{key:"tender",dot:"#F4A6B8",label:"温柔"},{key:"soulful",dot:"#C5A3D6",label:"感性"},{key:"mellow",dot:"#D9C9B0",label:"平淡"}],Wg=({name:n,size:i=16})=>{const s={width:i,height:i,viewBox:"0 0 20 20",fill:"none",stroke:"currentColor",strokeWidth:1.3,strokeLinecap:"round",strokeLinejoin:"round"};return n==="sun"?m.jsxs("svg",{...s,children:[m.jsx("circle",{cx:"10",cy:"10",r:"3.4"}),m.jsx("path",{d:"M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4"})]}):n==="cloud"?m.jsx("svg",{...s,children:m.jsx("path",{d:"M6 14a3 3 0 0 1-.4-5.97 4 4 0 0 1 7.74-.78A2.7 2.7 0 0 1 15.5 14H6Z"})}):n==="rain"?m.jsxs("svg",{...s,children:[m.jsx("path",{d:"M6 11a3 3 0 0 1-.4-5.97 4 4 0 0 1 7.74-.78A2.7 2.7 0 0 1 15.5 11H6Z"}),m.jsx("path",{d:"M7 14.5l-1 2.5M11 14.5l-1 2.5M14 14.5l-1 2.5",opacity:"0.7"})]}):m.jsx("svg",{...s,children:m.jsx("path",{d:"M16 12.5A6.5 6.5 0 1 1 8 3.5a5.2 5.2 0 0 0 8 9Z"})})},mb=({size:n=15})=>m.jsxs("svg",{width:n,height:n,viewBox:"0 0 20 20",fill:"none",stroke:"currentColor",strokeWidth:1.3,strokeLinecap:"round",strokeLinejoin:"round",children:[m.jsx("path",{d:"M4 4.5C4 3.7 4.7 3.5 5.5 3.5H10v13H5.5C4.7 16.5 4 16.3 4 15.5Z"}),m.jsx("path",{d:"M16 4.5C16 3.7 15.3 3.5 14.5 3.5H10v13h4.5c.8 0 1.5-.2 1.5-1Z"})]}),LE=({size:n=14})=>m.jsxs("svg",{width:n,height:n,viewBox:"0 0 20 20",fill:"none",children:[m.jsx("path",{d:"M10 2C5 3 3 7 3 11c0 3.5 3 6.5 7 6.5 0-5 2.5-9 7-11-3-2.5-5.5-4.5-7-4.5Z",fill:"currentColor",opacity:"0.85"}),m.jsx("path",{d:"M5 16c2-4 5-7 9-9",stroke:"rgba(255,255,255,0.5)",strokeWidth:"0.9",strokeLinecap:"round"})]}),Kr=()=>{const n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`},UE=n=>{const i=n.split("-");return i.length>=2?parseInt(i[1],10):new Date().getMonth()+1},HE=n=>{const[i,s,r]=n.split("-").map(Number),u=new Date(i,s-1,r);return`${i}年${s}月${r}日 ${_E[u.getDay()]}`},hd=n=>n?Ef.some(i=>i.key===n)?n:n.includes("☀")||n.includes("晴")?"sun":n.includes("☁")?"cloud":n.includes("雨")?"rain":n.includes("🌙")||n.includes("夜")?"moon":"sun":"sun",GE=()=>{try{const n=localStorage.getItem(db);return n?JSON.parse(n).map(s=>{const r=s.month!=null?s.month:UE(s.date||Kr());return{id:s.id||s.date||`${Date.now()}`,date:s.date||Kr(),month:r,mood:hd(s.mood),color:s.color||"",content:s.content||s.text||""}}):[]}catch{return[]}},Ig=n=>{localStorage.setItem(db,JSON.stringify(n))},YE=n=>{try{return JSON.parse(localStorage.getItem(Gl)||"{}")[String(n)]||null}catch{return null}},qE=(n,i)=>{try{const s=JSON.parse(localStorage.getItem(Gl)||"{}");s[String(n)]=i,localStorage.setItem(Gl,JSON.stringify(s))}catch{}},XE=n=>{try{const i=JSON.parse(localStorage.getItem(Gl)||"{}");delete i[String(n)],localStorage.setItem(Gl,JSON.stringify(i))}catch{}},Qc={enter:n=>({rotateY:n>0?95:-95,opacity:0}),center:{rotateY:0,opacity:1},exit:n=>({rotateY:n>0?-95:95,opacity:0})},KE=()=>m.jsxs("div",{className:"gj-cover-scene","aria-hidden":"true",children:[m.jsx("img",{src:"/gratitude-cover.jpg",alt:"",className:"gj-cover-img",draggable:!1}),m.jsx("div",{className:"gj-cover-veil"}),m.jsx("span",{className:"gj-bokeh gj-bokeh-1"}),m.jsx("span",{className:"gj-bokeh gj-bokeh-2"})]}),QE=({currentMonth:n,monthsWithEntries:i,onOpenMonth:s,onClose:r})=>m.jsxs("div",{className:"gj-page-inner gj-directory",children:[m.jsx("header",{className:"gj-page-head",children:m.jsxs("div",{children:[m.jsx("h3",{className:"gj-page-title",children:"月度篇章"}),m.jsx("p",{className:"gj-page-sub",children:"十二个月，十二种向内的探险"})]})}),m.jsx("div",{className:"gj-grid",children:Array.from({length:12},(u,f)=>{const d=f+1,h=d===n,p=i.has(d);return m.jsxs(pt.button,{type:"button",className:`gj-month-card${h?" gj-current":""}`,whileHover:{y:-5,transition:{type:"spring",stiffness:320,damping:22}},whileTap:{scale:.97},onClick:()=>s(d),"aria-label":`${hb[f]} · ${Tf[f]}`,children:[p&&m.jsx("span",{className:"gj-month-dot"}),h&&m.jsx("span",{className:"gj-month-today",children:"本月"}),m.jsx("span",{className:"gj-month-num",children:d}),m.jsx("span",{className:"gj-month-theme",children:Tf[f]})]},d)})}),m.jsxs("button",{className:"gj-close-book",onClick:r,"aria-label":"合上书",children:[m.jsx(mb,{}),m.jsx("span",{children:"合上书"})]})]}),ZE=({selectedMonth:n,today:i,content:s,weather:r,color:u,savedFlash:f,entries:d,onContent:h,onWeather:p,onColor:g,onSave:x,onDelete:b,onBack:v,onClose:E})=>{var R;const A=j.useMemo(()=>d.filter(T=>T.month===n).sort((T,C)=>C.date>T.date?1:-1),[d,n]);return m.jsxs("div",{className:"gj-page-inner gj-diary",children:[m.jsxs("div",{className:"gj-diary-top",children:[m.jsxs("button",{className:"gj-back-dir",onClick:v,"aria-label":"返回目录",children:[m.jsx("span",{"aria-hidden":"true",children:"←"})," 目录"]}),m.jsxs("span",{className:"gj-detail-theme",children:[hb[n-1]," · ",Tf[n-1]]})]}),m.jsxs("div",{className:"gj-guidance",children:[m.jsx("span",{className:"gj-guidance-mark",children:m.jsx(LE,{size:13})}),m.jsx("p",{className:"gj-guidance-text",children:BE[n-1]})]}),m.jsxs("div",{className:"gj-detail-body",children:[m.jsxs("div",{className:"gj-sidebar",children:[m.jsxs("div",{children:[m.jsx("div",{className:"gj-sidebar-label",children:"日期"}),m.jsx("div",{className:"gj-sidebar-date",children:HE(i)})]}),m.jsxs("div",{children:[m.jsx("div",{className:"gj-sidebar-label",children:"天气"}),m.jsx("div",{className:"gj-weather-picker",children:Ef.map(T=>m.jsx("button",{type:"button",className:`gj-weather-btn${r===T.key?" gj-weather-active":""}`,onClick:()=>p(T.key),title:T.label,"aria-label":T.label,children:m.jsx(Wg,{name:T.key,size:17})},T.key))})]}),m.jsxs("div",{children:[m.jsx("div",{className:"gj-sidebar-label",children:"心情"}),m.jsx("div",{className:"gj-mood-picker",children:Kc.map(T=>m.jsx("button",{type:"button",className:`gj-mood-dot${u===T.key?" gj-mood-active":""}`,style:{"--gj-dot":T.dot,background:T.dot},onClick:()=>g(u===T.key?"":T.key),title:T.label,"aria-label":T.label,"aria-pressed":u===T.key},T.key))}),m.jsx("p",{className:"gj-mood-hint",children:u?(R=Kc.find(T=>T.key===u))==null?void 0:R.label:"轻触一颗，标记此刻"})]})]}),m.jsx("div",{className:"gj-writing",children:m.jsx("textarea",{className:"gj-textarea",value:s,onChange:T=>h(T.target.value),placeholder:"在这里，写下今天的温柔…",spellCheck:!1})})]}),m.jsxs("div",{className:"gj-save-area",children:[m.jsx(ia,{children:f&&m.jsx(pt.span,{className:"gj-save-feedback",initial:{opacity:0,y:6},animate:{opacity:1,y:0},exit:{opacity:0,y:6},transition:{duration:.4},children:"已记录 ✨ 今天的温柔已存入心底。"})}),m.jsx("button",{type:"button",className:`gj-save-btn${f?" gj-saved":""}`,onClick:x,disabled:!s.trim(),children:f?"已保存 ✓":"保存"})]}),A.length>0&&m.jsxs("div",{className:"gj-month-history",children:[m.jsxs("h4",{className:"gj-month-history-title",children:["本月记录 ",m.jsx("span",{className:"gj-month-history-count",children:A.length})]}),m.jsx("div",{className:"gj-month-entry-list",children:A.map(T=>{var _;const C=Kc.find(z=>z.key===T.color);return m.jsxs("div",{className:"gj-month-entry",children:[m.jsxs("div",{className:"gj-month-entry-header",children:[m.jsxs("div",{className:"gj-month-entry-date-row",children:[m.jsx("span",{className:"gj-month-entry-date",children:T.date}),m.jsx("span",{className:"gj-month-entry-weather",title:(_=Ef.find(z=>z.key===T.mood))==null?void 0:_.label,children:m.jsx(Wg,{name:hd(T.mood),size:14})}),C&&m.jsx("span",{className:"gj-month-entry-color-tag",style:{background:C.dot},title:C.label})]}),m.jsx("button",{className:"gj-month-entry-delete",onClick:()=>b(T.id),"aria-label":"删除",children:"×"})]}),m.jsx("p",{className:"gj-month-entry-text",children:T.content})]},T.id)})})]}),m.jsxs("button",{className:"gj-close-book",onClick:E,"aria-label":"合上书",children:[m.jsx(mb,{}),m.jsx("span",{children:"合上书"})]})]})},FE=()=>{const[n,i]=j.useState("cover"),[s,r]=j.useState(1),[u,f]=j.useState(null),[d,h]=j.useState([]),[p,g]=j.useState(""),[x,b]=j.useState("sun"),[v,E]=j.useState(""),[A,R]=j.useState(!1),T=j.useMemo(()=>Kr(),[]),C=j.useMemo(()=>new Date().getMonth()+1,[]);j.useEffect(()=>{h(GE())},[]);const _=j.useMemo(()=>{const lt=new Set;return d.forEach(mt=>lt.add(mt.month)),lt},[d]),z=j.useCallback((lt,mt)=>{qE(lt,mt)},[]),U=j.useCallback(lt=>{f(lt),r(1),i("diary");const mt=YE(lt);if(mt)b(mt.weather),E(mt.color),g(mt.content);else{const ot=d.filter(B=>B.month===lt).sort((B,Z)=>Z.date>B.date?1:-1)[0];ot?(b(hd(ot.mood)),E(ot.color),g(ot.content)):(b("sun"),E(""),g(""))}},[d]),K=j.useCallback(()=>{r(1),i("directory")},[]),I=j.useCallback(()=>{r(-1),i("cover"),f(null)},[]),X=j.useCallback(()=>{r(-1),i("directory"),f(null)},[]),Q=j.useCallback(lt=>{g(lt),u!==null&&z(u,{weather:x,color:v,content:lt})},[u,x,v,z]),et=j.useCallback(lt=>{b(lt),u!==null&&z(u,{weather:lt,color:v,content:p})},[u,v,p,z]),P=j.useCallback(lt=>{E(lt),u!==null&&z(u,{weather:x,color:lt,content:p})},[u,x,p,z]),at=j.useCallback(()=>{if(!p.trim()||u===null)return;const lt=Kr(),mt={id:`${lt}-${Date.now()}`,date:lt,month:u,mood:x,color:v,content:p.trim()},ot=d.findIndex(Z=>Z.date===lt&&Z.month===u);let B;ot>=0?B=d.map((Z,J)=>J===ot?{...mt,id:Z.id}:Z):B=[mt,...d],h(B),Ig(B),XE(u),R(!0),window.setTimeout(()=>R(!1),2e3)},[p,u,x,v,d]),ft=j.useCallback(lt=>{const mt=d.filter(ot=>ot.id!==lt);h(mt),Ig(mt)},[d]);return m.jsxs("div",{className:"gj-root",children:[m.jsx("div",{className:"gj-book-stand",children:m.jsxs("div",{className:"gj-book",children:[m.jsx("div",{className:"gj-spine"}),m.jsxs(ia,{mode:"wait",custom:s,children:[n==="cover"&&m.jsxs(pt.div,{className:"gj-page gj-cover",custom:s,variants:Qc,initial:"enter",animate:"center",exit:"exit",transition:{duration:.62,ease:[.4,0,.2,1]},onClick:K,role:"button",tabIndex:0,"aria-label":"翻开感恩日记",onKeyDown:lt=>{(lt.key==="Enter"||lt.key===" ")&&(lt.preventDefault(),K())},children:[m.jsx(KE,{}),m.jsx("div",{className:"gj-cover-text-veil","aria-hidden":"true"}),m.jsxs("div",{className:"absolute inset-0 z-[2] flex flex-col items-center justify-center px-10 py-24 text-center md:px-14 md:py-28",children:[m.jsx("h2",{className:"gj-cover-title m-0 font-medium leading-tight tracking-[0.12em] text-[2rem] md:text-[2.75rem] lg:text-[3.25rem]",children:"感恩日记"}),m.jsx("p",{className:"gj-cover-en mt-4 italic font-serif text-gray-500 text-[0.82rem] tracking-[0.18em] md:mt-5 md:text-[0.9rem]",children:"Gratitude Journal"}),m.jsx("p",{className:"gj-cover-sub mt-6 max-w-xs text-[0.8rem] leading-[2.15] tracking-[0.14em] md:mt-8 md:max-w-sm md:text-[0.92rem]",children:"在细碎的日常里，写下属于自己生命的注脚。"}),m.jsx("span",{className:"gj-cover-hint",children:"轻触翻开"})]})]},"cover"),n==="directory"&&m.jsx(pt.div,{className:"gj-page gj-page-paper",custom:s,variants:Qc,initial:"enter",animate:"center",exit:"exit",transition:{duration:.62,ease:[.4,0,.2,1]},children:m.jsx(QE,{currentMonth:C,monthsWithEntries:_,onOpenMonth:U,onClose:I})},"directory"),n==="diary"&&u!==null&&m.jsx(pt.div,{className:"gj-page gj-page-paper",custom:s,variants:Qc,initial:"enter",animate:"center",exit:"exit",transition:{duration:.62,ease:[.4,0,.2,1]},children:m.jsx(ZE,{selectedMonth:u,today:T,content:p,weather:x,color:v,savedFlash:A,entries:d,onContent:Q,onWeather:et,onColor:P,onSave:at,onDelete:ft,onBack:X,onClose:I})},`diary-${u}`)]})]})}),m.jsx("style",{children:`
        /* ===== 根容器 ===== */
        .gj-root {
          position: relative;
          width: 100%;
        }
        .gj-book-stand {
          perspective: 1800px;
          perspective-origin: center 40%;
        }
        .gj-book {
          position: relative;
          min-height: 560px;
          transform-style: preserve-3d;
        }

        /* 书脊（左侧装订阴影） */
        .gj-spine {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 10px;
          z-index: 6;
          pointer-events: none;
          background: linear-gradient(to right, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.04) 55%, transparent 100%);
          border-radius: 14px 0 0 14px;
        }

        /* ===== 页面通用（翻书 3D） ===== */
        .gj-page {
          position: relative;
          width: 100%;
          min-height: 560px;
          border-radius: 6px 16px 16px 6px;
          transform-origin: left center;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          overflow: hidden;
        }

        /* 内页纸张（暖白 / 奶油）—— 水彩晕染 + 纸张质感
           不再用纯色平铺，而是叠加多层极淡水彩色斑，
           模拟森林光晕透入纸面的温润感，同时保留可读性 */
        .gj-page-paper {
          background-color: #F6EFE0;
          background-image:
            /* 左上 · 淡绿水彩（森林气息） */
            radial-gradient(ellipse 62% 52% at 18% 14%, rgba(150,180,150,0.11) 0%, transparent 62%),
            /* 右下 · 暖赭水彩（阳光余温） */
            radial-gradient(ellipse 56% 46% at 86% 88%, rgba(202,172,122,0.12) 0%, transparent 60%),
            /* 中部 · 淡米晕染（统一纸调） */
            radial-gradient(ellipse 72% 62% at 50% 52%, rgba(246,238,218,0.55) 0%, transparent 72%);
          box-shadow:
            0 1px 2px rgba(120,100,50,0.06),
            0 5px 14px -3px rgba(120,100,50,0.10),
            0 20px 50px -14px rgba(120,100,50,0.22),
            inset 0 0 70px rgba(255,250,235,0.45);
        }
        [data-theme="night"] .gj-page-paper {
          background-color: #232A24;
          background-image:
            radial-gradient(ellipse 62% 52% at 18% 14%, rgba(120,150,128,0.10) 0%, transparent 62%),
            radial-gradient(ellipse 56% 46% at 86% 88%, rgba(90,110,100,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 72% 62% at 50% 52%, rgba(40,52,44,0.5) 0%, transparent 72%);
          box-shadow:
            0 1px 2px rgba(0,0,0,0.3),
            0 5px 14px -3px rgba(0,0,0,0.35),
            0 20px 50px -14px rgba(0,0,0,0.55),
            inset 0 0 70px rgba(0,0,0,0.2);
        }
        /* 纸张纹理：横线 + 细腻纤维噪点（手造纸质感） */
        .gj-page-paper::before {
          content: "";
          position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(
              transparent, transparent 31px,
              rgba(180,160,120,0.085) 31px, rgba(180,160,120,0.085) 32px
            ),
            radial-gradient(circle at 30% 40%, rgba(120,100,60,0.022) 0.5px, transparent 1px),
            radial-gradient(circle at 70% 60%, rgba(120,100,60,0.018) 0.5px, transparent 1px);
          background-size: auto, 6px 6px, 9px 9px;
          pointer-events: none;
          z-index: 0;
        }
        [data-theme="night"] .gj-page-paper::before {
          background-image:
            repeating-linear-gradient(
              transparent, transparent 31px,
              rgba(140,160,140,0.07) 31px, rgba(140,160,140,0.07) 32px
            ),
            radial-gradient(circle at 30% 40%, rgba(200,210,200,0.016) 0.5px, transparent 1px),
            radial-gradient(circle at 70% 60%, rgba(200,210,200,0.014) 0.5px, transparent 1px);
          background-size: auto, 6px 6px, 9px 9px;
        }

        .gj-page-inner {
          position: relative;
          z-index: 1;
          padding: 36px 36px 80px 40px;
          min-height: 560px;
        }

        /* ===== 封面 ===== */
        .gj-cover {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: #FAF4E8;
          /* 外发光：暗色背景下让封面像一张发光的卡片 */
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.25),
            0 0 28px 4px rgba(255,250,240,0.18),
            0 12px 40px -8px rgba(0,0,0,0.25);
        }
        [data-theme="night"] .gj-cover {
          background: #1C2520;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.18),
            0 0 36px 6px rgba(255,250,240,0.14),
            0 16px 48px -8px rgba(0,0,0,0.5);
        }

        .gj-cover-scene {
          position: absolute; inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        /* 水彩封面图：填满封面，亮度提升，呈发光卡片感 */
        .gj-cover-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(1.08) saturate(0.92) contrast(0.96);
          will-change: transform, opacity;
        }
        [data-theme="night"] .gj-cover-img {
          filter: brightness(1.05) saturate(0.88) contrast(0.94);
        }

        /* 柔光遮罩：中心微亮 + 边缘渐隐，统一纸调并保证文字可读 */
        .gj-cover-veil {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 55% at 50% 45%, rgba(250,244,232,0.35) 0%, rgba(250,244,232,0) 65%),
            linear-gradient(to bottom, rgba(250,244,232,0.12) 0%, rgba(250,244,232,0) 30%, rgba(250,244,232,0) 70%, rgba(250,244,232,0.15) 100%);
        }
        [data-theme="night"] .gj-cover-veil {
          background:
            radial-gradient(ellipse 70% 55% at 50% 45%, rgba(28,37,32,0.3) 0%, rgba(28,37,32,0) 65%),
            linear-gradient(to bottom, rgba(28,37,32,0.15) 0%, rgba(28,37,32,0) 30%, rgba(28,37,32,0) 70%, rgba(28,37,32,0.2) 100%);
        }

        /* 极淡光斑（点缀边缘留白，保留呼吸感） */
        .gj-bokeh {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,248,214,0.7) 0%, rgba(255,248,214,0) 70%);
          filter: blur(1px);
          will-change: transform, opacity;
        }
        .gj-bokeh-1 { width: 48px; height: 48px; left: 14%; top: 18%; animation: gj-drift1 12s ease-in-out infinite; }
        .gj-bokeh-2 { width: 36px; height: 36px; right: 16%; bottom: 22%; animation: gj-drift2 14s ease-in-out infinite; }
        [data-theme="night"] .gj-bokeh {
          background: radial-gradient(circle, rgba(200,230,180,0.55) 0%, rgba(200,230,180,0) 70%);
        }

        @keyframes gj-drift1 {
          0%,100% { transform: translate(0,0); opacity: 0.35; }
          50% { transform: translate(16px,-20px); opacity: 0.7; }
        }
        @keyframes gj-drift2 {
          0%,100% { transform: translate(0,0); opacity: 0.3; }
          50% { transform: translate(-14px,16px); opacity: 0.65; }
        }

        /* 封面文字（颜色/字体；尺寸/字重/间距由 Tailwind 控制） */
        /* 文字背后的渐变压暗层：让中文标题在花丛图片上清晰可读 */
        .gj-cover-text-veil {
          position: absolute; inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse 60% 40% at 50% 42%, rgba(250,244,232,0.55) 0%, rgba(250,244,232,0) 70%);
          pointer-events: none;
        }
        [data-theme="night"] .gj-cover-text-veil {
          background:
            radial-gradient(ellipse 60% 40% at 50% 42%, rgba(20,28,24,0.5) 0%, rgba(20,28,24,0) 70%);
        }
        .gj-cover-title {
          font-family: "Noto Serif SC", Georgia, serif;
          color: #36533F;
          text-shadow: 0 2px 16px rgba(255,255,255,0.6), 0 0 24px rgba(255,250,240,0.3);
        }
        [data-theme="night"] .gj-cover-title {
          color: #E8F0E4;
          text-shadow: 0 2px 16px rgba(0,0,0,0.6), 0 0 24px rgba(200,230,180,0.15);
        }
        .gj-cover-sub {
          color: #9A958C;
        }
        [data-theme="night"] .gj-cover-sub { color: #9DB0A4; }
        .gj-cover-en {
          color: #9CA3AF;
          font-family: Georgia, "Times New Roman", serif;
        }
        [data-theme="night"] .gj-cover-en { color: #9CA3AF; }
        .gj-cover-hint {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: rgba(122,154,130,0.8);
          animation: gj-hint 2.6s ease-in-out infinite;
          white-space: nowrap;
        }
        [data-theme="night"] .gj-cover-hint { color: rgba(157,184,164,0.7); }
        @keyframes gj-hint {
          0%,100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }

        /* ===== 目录页 ===== */
        .gj-page-head { margin-bottom: 26px; }
        .gj-page-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 24px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 6px;
          letter-spacing: 0.06em;
        }
        .gj-page-sub {
          font-family: Georgia, serif;
          font-size: 13px;
          font-style: italic;
          color: var(--text-soft);
          margin: 0;
          line-height: 1.95;
          letter-spacing: 0.04em;
        }

        .gj-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 640px) {
          .gj-grid { grid-template-columns: repeat(3, 1fr); gap: 11px; }
        }

        .gj-month-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 22px 10px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.42);
          border: 1.5px solid rgba(180,160,120,0.22);
          cursor: pointer;
          transition: border-color 0.28s, box-shadow 0.28s, background 0.28s;
          overflow: visible;
        }
        [data-theme="night"] .gj-month-card {
          background: rgba(255,255,255,0.04);
          border-color: rgba(140,160,140,0.18);
        }
        .gj-month-card:hover {
          border-color: rgba(122,154,130,0.5);
          box-shadow: 0 8px 24px -6px rgba(60,80,60,0.18);
        }
        .gj-month-card.gj-current {
          border-color: rgba(122,154,130,0.7);
          background: rgba(122,154,130,0.1);
          box-shadow: 0 0 18px 2px rgba(122,154,130,0.22);
        }
        .gj-month-num {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 30px;
          font-weight: 700;
          color: var(--text);
          line-height: 1;
          margin-bottom: 8px;
        }
        .gj-current .gj-month-num { color: var(--accent); }
        .gj-month-theme {
          font-size: 12px;
          color: var(--text-soft);
          letter-spacing: 0.08em;
        }
        .gj-month-dot {
          position: absolute;
          top: 9px; right: 9px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px 1px rgba(122,154,130,0.5);
        }
        .gj-month-today {
          position: absolute;
          top: 8px; left: 8px;
          font-size: 9px;
          letter-spacing: 0.1em;
          padding: 1px 6px;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
        }

        /* ===== 日记页 ===== */
        .gj-diary-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .gj-back-dir {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          font-size: 12px;
          font-family: inherit;
          color: var(--text-soft);
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 999px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .gj-back-dir:hover {
          color: var(--accent);
          border-color: var(--accent);
          background: rgba(122,154,130,0.06);
        }
        .gj-detail-theme {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--accent);
          padding: 5px 16px;
          border-radius: 999px;
          background: rgba(122,154,130,0.1);
        }

        /* 引导语 */
        .gj-guidance {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px 16px 14px 18px;
          margin-bottom: 22px;
          border-radius: 12px;
          background: rgba(122,154,130,0.07);
          border-left: 3px solid var(--accent);
        }
        .gj-guidance-mark {
          color: var(--accent);
          margin-top: 2px;
          flex-shrink: 0;
        }
        .gj-guidance-text {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 14px;
          font-style: italic;
          line-height: 1.7;
          color: var(--text);
          margin: 0;
          letter-spacing: 0.02em;
        }

        /* 左右两栏 */
        .gj-detail-body {
          display: flex;
          gap: 26px;
        }
        @media (max-width: 640px) {
          .gj-detail-body { flex-direction: column; gap: 18px; }
        }
        .gj-sidebar {
          flex: 0 0 150px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        @media (max-width: 640px) {
          .gj-sidebar { flex: none; flex-direction: row; flex-wrap: wrap; gap: 16px; }
        }
        .gj-sidebar-label {
          font-size: 10px;
          color: var(--text-soft);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 7px;
        }
        .gj-sidebar-date {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.6;
        }

        /* 天气选择器 */
        .gj-weather-picker { display: flex; gap: 6px; }
        .gj-weather-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid transparent;
          border-radius: 10px;
          background: rgba(255,255,255,0.5);
          color: var(--text-soft);
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s, color 0.2s, background 0.2s;
        }
        [data-theme="night"] .gj-weather-btn { background: rgba(255,255,255,0.06); }
        .gj-weather-btn:hover { transform: scale(1.12); color: var(--accent); }
        .gj-weather-btn.gj-weather-active {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(122,154,130,0.14);
        }

        /* 心情色环 */
        .gj-mood-picker { display: flex; gap: 9px; flex-wrap: wrap; }
        .gj-mood-dot {
          width: 26px; height: 26px;
          border-radius: 50%;
          border: 3px solid transparent;
          cursor: pointer;
          padding: 0;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
        }
        .gj-mood-dot:hover { transform: scale(1.15); }
        .gj-mood-dot.gj-mood-active {
          transform: scale(1.35);
          border-color: #fff;
          box-shadow: 0 0 0 2px rgba(122,154,130,0.35), 0 0 14px 2px var(--gj-dot);
        }
        .gj-mood-hint {
          font-size: 11px;
          color: var(--text-soft);
          margin: 8px 0 0;
          letter-spacing: 0.04em;
          min-height: 14px;
        }

        /* 书写区 */
        .gj-writing { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .gj-textarea {
          width: 100%;
          min-height: 240px;
          border: none;
          border-radius: 12px;
          padding: 16px 18px;
          font-size: 15px;
          font-family: Georgia, "Noto Serif SC", serif;
          line-height: 1.9;
          color: var(--text);
          background: rgba(255,255,255,0.5);
          resize: vertical;
          outline: none;
          transition: box-shadow 0.3s;
        }
        [data-theme="night"] .gj-textarea { background: rgba(255,255,255,0.05); }
        .gj-textarea:focus { box-shadow: 0 0 0 3px rgba(122,154,130,0.16); }
        .gj-textarea::placeholder { color: var(--text-soft); opacity: 0.5; font-style: italic; }

        /* 保存区 */
        .gj-save-area {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 14px;
          margin-top: 20px;
          min-height: 44px;
        }
        .gj-save-feedback {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 12px;
          font-style: italic;
          color: var(--accent);
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .gj-save-btn {
          padding: 10px 30px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          border: none;
          border-radius: 6px;
          background: #FFF3C4;
          color: #5D4E37;
          cursor: pointer;
          box-shadow: 2px 3px 8px -2px rgba(0,0,0,0.14);
          transform: rotate(-2deg);
          transition: transform 0.2s, box-shadow 0.2s, background 0.3s, color 0.3s;
        }
        [data-theme="night"] .gj-save-btn {
          background: #3D3A2E;
          color: #E2D8C0;
          box-shadow: 2px 3px 8px -2px rgba(0,0,0,0.4);
        }
        .gj-save-btn:hover:not(:disabled) {
          transform: rotate(-1deg) translateY(-2px);
          box-shadow: 3px 5px 14px -2px rgba(0,0,0,0.2);
        }
        .gj-save-btn.gj-saved { background: #C8E6C9; color: #2E7D32; }
        [data-theme="night"] .gj-save-btn.gj-saved { background: #2D3A2E; color: #A5D6A7; }
        .gj-save-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: rotate(-2deg); }

        /* 历史记录 */
        .gj-month-history { margin-top: 26px; }
        .gj-month-history-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 12px;
          display: flex; align-items: center; gap: 8px;
        }
        .gj-month-history-count {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(122,154,130,0.14);
          color: var(--accent);
          font-weight: 400;
        }
        .gj-month-entry-list { display: flex; flex-direction: column; gap: 8px; }
        .gj-month-entry {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.45);
          border: 1px solid var(--border);
          transition: border-color 0.2s;
        }
        [data-theme="night"] .gj-month-entry { background: rgba(255,255,255,0.04); }
        .gj-month-entry:hover { border-color: rgba(122,154,130,0.35); }
        .gj-month-entry-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 5px;
        }
        .gj-month-entry-date-row { display: flex; align-items: center; gap: 8px; }
        .gj-month-entry-date { font-size: 12px; color: var(--accent); font-weight: 500; }
        .gj-month-entry-weather { color: var(--text-soft); display: inline-flex; }
        .gj-month-entry-color-tag { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .gj-month-entry-delete {
          width: 22px; height: 22px;
          border: none; background: transparent;
          color: var(--text-soft); font-size: 18px;
          cursor: pointer; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, color 0.2s; opacity: 0;
        }
        .gj-month-entry:hover .gj-month-entry-delete { opacity: 1; }
        .gj-month-entry-delete:hover { background: rgba(217,119,87,0.12); color: #d97757; }
        .gj-month-entry-text {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 13px; line-height: 1.75;
          color: var(--text-soft); margin: 0;
          white-space: pre-wrap; word-break: break-word;
        }

        /* ===== 合上书按钮（内页右下角固定） ===== */
        .gj-close-book {
          position: absolute;
          right: 24px; bottom: 22px;
          z-index: 5;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 12px;
          font-family: inherit;
          letter-spacing: 0.06em;
          color: var(--text-soft);
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(180,160,120,0.3);
          border-radius: 999px;
          cursor: pointer;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          transition: color 0.22s, border-color 0.22s, background 0.22s, transform 0.22s;
        }
        [data-theme="night"] .gj-close-book {
          background: rgba(30,41,59,0.6);
          border-color: rgba(140,160,140,0.25);
        }
        .gj-close-book:hover {
          color: var(--accent);
          border-color: var(--accent);
          background: rgba(122,154,130,0.1);
          transform: translateY(-2px);
        }

        /* ===== 响应式 ===== */
        @media (max-width: 640px) {
          .gj-book { min-height: 520px; }
          .gj-page { min-height: 520px; }
          .gj-page-inner { padding: 26px 22px 76px 26px; }
          .gj-month-entry-delete { opacity: 1; }
          .gj-close-book { right: 16px; bottom: 16px; padding: 7px 13px; }
          /* 移动端降低动效幅度 */
          .gj-bokeh { animation-duration: 16s; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gj-bokeh, .gj-cover-hint { animation: none; }
        }
      `})]})},Zc=[{id:"anxiety",emoji:"😟",label:"焦虑/压力大",desc:"均匀节奏 · 找回专注",color:"#5B9BD5",modeName:"方形呼吸 · 专注模式",phases:[{name:"inhale",duration:4,label:"吸气",fullLabel:"吸气"},{name:"hold",duration:4,label:"屏息",fullLabel:"屏息"},{name:"exhale",duration:4,label:"呼气",fullLabel:"呼气"},{name:"holdEmpty",duration:4,label:"空肺",fullLabel:"屏息·空肺"}]},{id:"tired",emoji:"😴",label:"疲惫/失眠",desc:"延长呼气 · 深度放松",color:"#7E57C2",modeName:"478 呼吸法",phases:[{name:"inhale",duration:4,label:"吸气",fullLabel:"吸气"},{name:"hold",duration:7,label:"屏息",fullLabel:"屏息"},{name:"exhale",duration:8,label:"呼气",fullLabel:"呼气"}]},{id:"low_energy",emoji:"😫",label:"能量不足",desc:"快速节奏 · 唤醒活力",color:"#FF8A65",modeName:"能量呼吸法",phases:[{name:"inhale",duration:3,label:"吸气",fullLabel:"吸气"},{name:"hold",duration:1,label:"屏息",fullLabel:"屏息"},{name:"exhale",duration:2,label:"呼气",fullLabel:"呼气"}]}],Ma=.76,br=1.14,wf=80,ty=5,Al=2*Math.PI*wf,vr='"Noto Serif SC", Georgia, "Times New Roman", serif';function JE(n,i){switch(n){case"inhale":return Ma+(br-Ma)*i;case"hold":return br;case"exhale":return br-(br-Ma)*i;case"holdEmpty":return Ma}}function PE(n,i){switch(n){case"inhale":return i;case"hold":return 1;case"exhale":return 1-i;case"holdEmpty":return 0}}const $E=()=>{const[n,i]=j.useState(Zc[0]),[s,r]=j.useState(!1),[u,f]=j.useState(!1),[d,h]=j.useState(0),[p,g]=j.useState(Zc[0].phases[0].duration),[x,b]=j.useState(0),v=j.useRef(null),E=j.useRef(null),A=j.useRef(0),R=n.phases,T=R[d],C=j.useRef(R);C.current=R;const _=j.useRef(d);_.current=d,j.useEffect(()=>{g(T.duration)},[T]),j.useEffect(()=>{if(!s)return;const ft=T.duration*1e3,lt=T.name,mt=performance.now()-A.current;v.current&&(v.current.style.transition="none"),E.current&&(E.current.style.transition="none");let ot=0,B=-1;const Z=J=>{const rt=J-mt;A.current=rt;const gt=Math.min(rt/ft,1);if(v.current&&(v.current.style.transform=`scale(${JE(lt,gt)})`),E.current){const F=PE(lt,gt);E.current.style.strokeDashoffset=String(Al*(1-F))}const N=Math.ceil((ft-rt)/1e3),Y=Math.max(N,1);if(Y!==B&&(B=Y,g(Y)),gt<1)ot=requestAnimationFrame(Z);else{A.current=0;const F=C.current,$=(_.current+1)%F.length;h($),$===0&&b(ut=>ut+1)}};return ot=requestAnimationFrame(Z),()=>cancelAnimationFrame(ot)},[s,d,n]);const z=at=>{r(!1),f(!1),i(at),h(0),g(at.phases[0].duration),b(0),A.current=0,v.current&&(v.current.style.transition="transform 0.5s ease",v.current.style.transform=`scale(${Ma})`),E.current&&(E.current.style.transition="stroke-dashoffset 0.5s ease",E.current.style.strokeDashoffset=String(Al))},U=()=>{s||f(!0),r(at=>!at)},K=()=>{r(!1),f(!1),h(0),g(n.phases[0].duration),b(0),A.current=0,v.current&&(v.current.style.transition="transform 0.6s ease",v.current.style.transform=`scale(${Ma})`),E.current&&(E.current.style.transition="stroke-dashoffset 0.6s ease",E.current.style.strokeDashoffset=String(Al))},I=R.map(at=>at.duration).join("-"),X=!u,Q=s?"暂停":X?"开始":"继续",et=X?"准备开始":T.fullLabel,P=R.length>3;return m.jsxs("div",{className:"bg-root",children:[m.jsx("style",{children:`
        /* ===== 根容器 ===== */
        .bg-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          padding: 24px 16px 8px;
          font-family: "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--text);
        }

        /* ===== 标题 ===== */
        .bg-header { text-align: center; }
        .bg-title {
          font-family: ${vr};
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 6px;
          letter-spacing: 0.06em;
        }
        .bg-subtitle {
          font-size: 12.5px;
          color: var(--text-soft);
          margin: 0;
          letter-spacing: 0.02em;
        }

        /* ===== 情绪选择按钮 ===== */
        .bg-state-bar {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .bg-state-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 15px;
          border-radius: 999px;
          border: 1.5px solid var(--border);
          background: var(--card-bg);
          color: var(--text-soft);
          font-size: 13px;
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s ease, background 0.25s ease,
                      color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .bg-state-btn:hover { transform: scale(1.04); }
        .bg-state-btn.active {
          border-color: transparent;
          color: #fff;
          box-shadow: 0 3px 12px -3px var(--state-color, #5B9BD5);
        }
        .bg-state-emoji { font-size: 15px; line-height: 1; }

        /* ===== 呼吸圆环区域 ===== */
        .bg-arc-area {
          position: relative;
          width: 230px;
          height: 230px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 4px 0;
        }

        /* 外圈柔光（氛围） */
        .bg-aura {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle, var(--aura-color, transparent) 0%, transparent 65%);
          opacity: ${s?.35:.12};
          transition: opacity 0.6s ease, background 0.5s ease;
          pointer-events: none;
        }

        /* SVG 圆弧 */
        .bg-arc-svg {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          transform: rotate(-90deg);
          opacity: ${s?1:.5};
          transition: opacity 0.5s ease;
        }
        .bg-arc-track {
          fill: none;
          stroke: var(--border);
          stroke-width: ${ty};
          opacity: 0.5;
        }
        .bg-arc-progress {
          fill: none;
          stroke: var(--arc-color, #5B9BD5);
          stroke-width: ${ty};
          stroke-linecap: round;
        }

        /* 呼吸光球 */
        .bg-orb {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          will-change: transform;
          transform: scale(${Ma});
        }

        /* 中心文字 */
        .bg-center {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          pointer-events: none;
        }
        .bg-countdown {
          font-family: ${vr};
          font-size: 52px;
          font-weight: 600;
          line-height: 1;
          color: var(--text);
          margin: 0;
          text-shadow: 0 1px 12px rgba(255,255,255,0.35);
          transition: opacity 0.3s ease;
        }
        [data-theme="night"] .bg-countdown {
          text-shadow: 0 1px 12px rgba(0,0,0,0.4);
        }
        .bg-phase-label {
          font-size: 13px;
          color: var(--text-soft);
          margin: 8px 0 0;
          letter-spacing: 0.1em;
        }

        /* ===== 节奏指示器 ===== */
        .bg-rhythm {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bg-rhythm-item {
          display: flex;
          align-items: center;
          gap: 7px;
          position: relative;
        }
        .bg-rhythm-item:not(:last-child)::after {
          content: "";
          position: absolute;
          right: var(--sep-pos, -15px);
          width: 3px; height: 3px;
          border-radius: 50%;
          background: var(--border);
          opacity: 0.7;
        }
        .bg-rhythm-dot {
          width: 9px; height: 9px;
          border-radius: 50%;
          background: var(--border);
          transition: background 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease;
        }
        .bg-rhythm-dot.active {
          background: var(--arc-color, #5B9BD5);
          transform: scale(1.45);
          box-shadow: 0 0 10px 1px var(--arc-color, #5B9BD5);
        }
        .bg-rhythm-text {
          font-size: 12px;
          color: var(--text-soft);
          transition: color 0.35s ease;
          white-space: nowrap;
        }
        .bg-rhythm-text.active { color: var(--text); font-weight: 500; }

        /* ===== 模式信息 ===== */
        .bg-mode-info { text-align: center; }
        .bg-mode-name {
          font-family: ${vr};
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          margin: 0;
        }
        .bg-mode-desc {
          font-size: 11px;
          color: var(--text-soft);
          margin: 3px 0 0;
          letter-spacing: 0.04em;
          opacity: 0.8;
        }
        .bg-cycle-count {
          font-size: 12px;
          color: var(--text-soft);
          margin: 6px 0 0;
        }
        .bg-cycle-count span {
          color: var(--arc-color, #5B9BD5);
          font-weight: 600;
          font-family: ${vr};
        }

        /* ===== 控制按钮 ===== */
        .bg-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .bg-btn {
          padding: 10px 32px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.25s ease, box-shadow 0.25s ease;
        }
        .bg-btn:hover { transform: scale(1.04); }
        .bg-btn:active { transform: scale(0.97); }
        .bg-btn-start {
          background: var(--arc-color, #4CAF50);
          color: #fff;
          box-shadow: 0 3px 14px -3px var(--arc-color, rgba(76,175,80,0.5));
        }
        .bg-btn-reset {
          background: transparent;
          color: var(--text-soft);
          border: 1px solid var(--border);
        }
        .bg-btn-reset:hover { background: rgba(0,0,0,0.04); }
        [data-theme="night"] .bg-btn-reset:hover { background: rgba(255,255,255,0.05); }

        /* ===== 响应式 ===== */
        @media (max-width: 480px) {
          .bg-arc-area { width: 200px; height: 200px; }
          .bg-orb { width: 130px; height: 130px; }
          .bg-countdown { font-size: 44px; }
          .bg-state-btn { padding: 6px 12px; font-size: 12px; }
          .bg-btn { padding: 9px 26px; font-size: 13px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bg-aura { transition: none; }
        }
      `}),m.jsxs("div",{className:"bg-header",children:[m.jsx("p",{className:"bg-title",children:"呼吸引导"}),m.jsx("p",{className:"bg-subtitle",children:"选择你当下的状态，开始调整"})]}),m.jsx("div",{className:"bg-state-bar",children:Zc.map(at=>m.jsxs("button",{className:`bg-state-btn${n.id===at.id?" active":""}`,style:{"--state-color":at.color,background:n.id===at.id?at.color:void 0},onClick:()=>z(at),children:[m.jsx("span",{className:"bg-state-emoji",children:at.emoji}),m.jsx("span",{children:at.label})]},at.id))}),m.jsxs("div",{className:"bg-arc-area",style:{"--arc-color":n.color,"--aura-color":`${n.color}40`},children:[m.jsx("div",{className:"bg-aura"}),m.jsxs("svg",{className:"bg-arc-svg",viewBox:"0 0 200 200",children:[m.jsx("circle",{className:"bg-arc-track",cx:"100",cy:"100",r:wf}),m.jsx("circle",{ref:E,className:"bg-arc-progress",cx:"100",cy:"100",r:wf,strokeDasharray:Al,style:{strokeDashoffset:Al,stroke:n.color}})]}),m.jsx("div",{ref:v,className:"bg-orb",style:{background:`radial-gradient(circle at center, ${n.color}55 0%, ${n.color}22 45%, ${n.color}00 72%)`}}),m.jsxs("div",{className:"bg-center",children:[m.jsx("p",{className:"bg-countdown",children:p}),m.jsx("p",{className:"bg-phase-label",children:et})]})]}),m.jsx("div",{className:"bg-rhythm",style:{"--arc-color":n.color,gap:P?"14px":"22px","--sep-pos":P?"-8px":"-15px"},children:R.map((at,ft)=>m.jsxs("div",{className:"bg-rhythm-item",children:[m.jsx("span",{className:`bg-rhythm-dot${u&&d===ft?" active":""}`}),m.jsx("span",{className:`bg-rhythm-text${u&&d===ft?" active":""}`,children:at.label})]},ft))}),m.jsxs("div",{className:"bg-mode-info",children:[m.jsx("p",{className:"bg-mode-name",children:n.modeName}),m.jsx("p",{className:"bg-mode-desc",children:n.desc}),m.jsxs("p",{className:"bg-cycle-count",children:[I," 节奏 · 已完成 ",m.jsx("span",{children:x})," 个循环"]})]}),m.jsxs("div",{className:"bg-controls",style:{"--arc-color":n.color},children:[m.jsx("button",{className:"bg-btn bg-btn-start",onClick:U,children:Q}),m.jsx("button",{className:"bg-btn bg-btn-reset",onClick:K,children:"重置"})]})]})},WE=[1,3,5,10],Fc=[{id:"ocean",icon:"🌊",label:"海浪",sub:"Ocean"},{id:"forest",icon:"🌲",label:"森林",sub:"Forest"},{id:"fire",icon:"🔥",label:"篝火",sub:"Fire"},{id:"music",icon:"🎵",label:"音乐",sub:"Music"}],IE=n=>{const i=Math.floor(n/60),s=n%60;return`${String(i).padStart(2,"0")}:${String(s).padStart(2,"0")}`};let Cl=null;function t4(){return Cl||(Cl=new AudioContext),Cl.state==="suspended"&&Cl.resume(),Cl}function e4(n){const i=t4(),s=i.createGain();s.gain.value=.15,s.connect(i.destination);const r=[s],u=()=>{r.forEach(f=>{try{"stop"in f&&typeof f.stop=="function"&&f.stop()}catch{}try{f.disconnect()}catch{}})};try{switch(n){case"ocean":{const f=i.createOscillator();f.type="sine",f.frequency.value=80;const d=i.createGain();d.gain.value=.6,f.connect(d).connect(s),f.start(),r.push(f,d);const h=i.createOscillator();h.type="sine",h.frequency.value=.15;const p=i.createGain();p.gain.value=.4,h.connect(p).connect(d.gain),h.start(),r.push(h,p);break}case"forest":{for(let p=0;p<3;p++){const g=i.createOscillator();g.type="triangle",g.frequency.value=800+p*400;const x=i.createGain();x.gain.value=.15-p*.03,g.connect(x).connect(s),g.start(),r.push(g,x)}const f=i.createOscillator();f.type="sawtooth",f.frequency.value=120;const d=i.createGain();d.gain.value=.05;const h=i.createBiquadFilter();h.type="bandpass",h.frequency.value=600,h.Q.value=.5,f.connect(d).connect(h).connect(s),f.start(),r.push(f,d,h);break}case"fire":{const f=i.createOscillator();f.type="sawtooth",f.frequency.value=60;const d=i.createBiquadFilter();d.type="lowpass",d.frequency.value=200;const h=i.createGain();h.gain.value=.5,f.connect(d).connect(h).connect(s),f.start(),r.push(f,d,h);const p=i.createOscillator();p.type="square",p.frequency.value=30;const g=i.createGain();g.gain.value=.08,p.connect(g).connect(s),p.start(),r.push(p,g);break}case"music":{const f=[261.63,329.63,392,329.63];let d=0;const h=i.createOscillator();h.type="sine",h.frequency.value=f[0];const p=i.createGain();p.gain.value=.4,h.connect(p).connect(s),h.start(),r.push(h,p);const g=setInterval(()=>{d=(d+1)%f.length,h.frequency.setValueAtTime(f[d],i.currentTime)},1200),x=u;return{stop:()=>{clearInterval(g),x()}}}}}catch{}return{stop:u}}const n4=()=>{var K,I;const[n,i]=j.useState("ocean"),[s,r]=j.useState(5),[u,f]=j.useState(!1),[d,h]=j.useState(0),[p,g]=j.useState(!1),[x,b]=j.useState(!1),[v,E]=j.useState(!1),A=j.useRef(null),R=j.useCallback(()=>{A.current&&(A.current.stop(),A.current=null)},[]);j.useEffect(()=>()=>R(),[R]),j.useEffect(()=>{if(!p)return;const X=setInterval(()=>{h(Q=>{if(Q<=1){clearInterval(X),g(!1),b(!0),R();try{const et=parseInt(localStorage.getItem("meditation_total")||"0",10);localStorage.setItem("meditation_total",String(et+s*60))}catch{}return 0}return Q-1})},1e3);return()=>clearInterval(X)},[p,s,R]);const T=()=>{b(!1),h(s*60),g(!0),R(),A.current=e4(n)},C=()=>{g(!1),h(0),b(!1),R()},_=()=>{b(!1),h(0)},z=p&&d>0?1-d/(s*60):x?1:0,U=2*Math.PI*92;return m.jsxs(m.Fragment,{children:[m.jsxs(pt.div,{className:"ms-card",initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.4,ease:"easeOut"},children:[m.jsxs("div",{className:"ms-header",children:[m.jsx("h3",{className:"ms-title",children:"冥想空间"}),m.jsx("p",{className:"ms-subtitle",children:"聆听自然，放空思绪"})]}),m.jsxs(ia,{mode:"wait",children:[!p&&!x&&m.jsxs(pt.div,{className:"ms-setup",initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.3},children:[m.jsx("div",{className:"ms-section-label",children:"选择环境音"}),m.jsxs("div",{className:"ms-sound-grid",children:[Fc.map(X=>m.jsxs(pt.button,{className:`ms-sound-card ${n===X.id?"ms-sound-active":""}`,onClick:()=>i(X.id),whileHover:{scale:1.04},whileTap:{scale:.97},children:[m.jsx("span",{className:"ms-sound-icon",children:X.icon}),m.jsx("span",{className:"ms-sound-label",children:X.label}),m.jsx("span",{className:"ms-sound-sub",children:X.sub})]},X.id)),m.jsxs(pt.button,{className:"ms-sound-card ms-sound-coming",onClick:()=>{E(!0),setTimeout(()=>E(!1),8e3)},whileHover:{scale:1.04},whileTap:{scale:.97},children:[m.jsx("span",{className:"ms-sound-icon",children:"✨"}),m.jsx("span",{className:"ms-sound-label",children:"更多音频"}),m.jsx("span",{className:"ms-sound-sub",children:"Coming Soon"})]})]}),m.jsx("div",{className:"ms-section-label",children:"选择时长"}),m.jsx("div",{className:"ms-duration-pills",children:WE.map(X=>m.jsxs("button",{className:`ms-pill ${s===X?"ms-pill-active":""}`,onClick:()=>r(X),children:[X," min"]},X))}),m.jsxs("div",{className:"ms-toggle-row",children:[m.jsx("span",{className:"ms-toggle-label",children:"语音引导"}),m.jsx("button",{className:`ms-toggle-track ${u?"ms-toggle-on":""}`,onClick:()=>f(X=>!X),"aria-label":"语音引导开关",children:m.jsx(pt.span,{className:"ms-toggle-thumb",animate:{x:u?18:2},transition:{type:"spring",stiffness:500,damping:30}})})]}),m.jsx(pt.button,{className:"ms-start-btn",onClick:T,whileHover:{scale:1.04},whileTap:{scale:.97},children:u?"开始冥想（带引导）":"开始冥想"})]},"setup"),p&&m.jsxs(pt.div,{className:"ms-running",initial:{opacity:0,scale:.96},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.96},transition:{duration:.4},children:[m.jsxs(pt.div,{className:"ms-active-sound",initial:{opacity:0},animate:{opacity:1},transition:{delay:.2},children:[(K=Fc.find(X=>X.id===n))==null?void 0:K.icon," ",(I=Fc.find(X=>X.id===n))==null?void 0:I.label,u?" + 语音引导":""]}),m.jsxs("div",{className:"ms-progress-ring",children:[m.jsxs("svg",{className:"ms-ring-svg",viewBox:"0 0 200 200",children:[m.jsx("circle",{className:"ms-ring-bg",cx:"100",cy:"100",r:"92",fill:"none",strokeWidth:"4"}),m.jsx(pt.circle,{className:"ms-ring-fill",cx:"100",cy:"100",r:"92",fill:"none",strokeWidth:"4",strokeLinecap:"round",strokeDasharray:U,initial:{strokeDashoffset:U},animate:{strokeDashoffset:U*(1-z)},transition:{duration:1,ease:"linear"},transform:"rotate(-90 100 100)"})]}),m.jsxs("div",{className:"ms-countdown",children:[m.jsx("span",{className:"ms-time",children:IE(d)}),m.jsx("span",{className:"ms-time-label",children:"剩余"})]})]}),m.jsx(pt.button,{className:"ms-end-btn",onClick:C,whileHover:{scale:1.04},whileTap:{scale:.97},children:"结束"})]},"running"),x&&m.jsxs(pt.div,{className:"ms-completed",initial:{opacity:0,scale:.85},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.85},transition:{duration:.5,ease:"easeOut"},children:[[0,1,2].map(X=>m.jsx(pt.div,{className:"ms-ripple",initial:{scale:0,opacity:.5},animate:{scale:3,opacity:0},transition:{duration:2,ease:"easeOut",delay:X*.5,repeat:1/0,repeatDelay:1}},X)),m.jsx("div",{className:"ms-complete-icon",children:"✨"}),m.jsx("p",{className:"ms-complete-label",children:"冥想完成"}),m.jsxs("p",{className:"ms-complete-duration",children:["本次冥想 ",s," 分钟"]}),m.jsx(pt.button,{className:"ms-start-btn",onClick:_,whileHover:{scale:1.04},whileTap:{scale:.97},children:"再来一次"})]},"completed")]}),m.jsx("style",{children:`
        /* ── 卡片容器 ── */
        .ms-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          padding: 28px 24px 32px;
          max-width: 480px;
          margin: 0 auto;
        }

        /* ── 标题 ── */
        .ms-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .ms-title {
          font-family: "Noto Serif SC", Georgia, "Times New Roman", serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 4px;
        }
        .ms-subtitle {
          font-size: 12px;
          color: var(--text-soft);
          margin: 0;
        }

        /* ── 设置阶段 ── */
        .ms-setup {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .ms-section-label {
          font-size: 13px;
          color: var(--text-soft);
          margin: 0;
          align-self: flex-start;
        }

        /* ── 环境音网格 ── */
        .ms-sound-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          width: 100%;
        }
        .ms-sound-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px 6px 10px;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .ms-sound-card:hover {
          border-color: var(--accent);
        }
        .ms-sound-active {
          border-color: var(--accent) !important;
          background: rgba(122, 154, 130, 0.1) !important;
        }
        [data-theme="night"] .ms-sound-card {
          background: rgba(255,255,255,0.03);
        }
        [data-theme="night"] .ms-sound-active {
          background: rgba(157, 184, 165, 0.15) !important;
        }
        .ms-sound-icon {
          font-size: 24px;
          line-height: 1;
        }
        .ms-sound-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
        }
        .ms-sound-sub {
          font-size: 10px;
          color: var(--text-soft);
        }

        /* ── 时长 pill ── */
        .ms-duration-pills {
          display: flex;
          gap: 10px;
          width: 100%;
        }
        .ms-pill {
          flex: 1;
          padding: 8px 0;
          font-size: 13px;
          text-align: center;
          border: 1.5px solid var(--border);
          border-radius: 999px;
          background: transparent;
          color: var(--text-soft);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ms-pill:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        .ms-pill-active {
          background: var(--accent) !important;
          color: #fff !important;
          border-color: var(--accent) !important;
        }

        /* ── Toggle 开关 ── */
        .ms-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .ms-toggle-label {
          font-size: 13px;
          color: var(--text-soft);
        }
        .ms-toggle-track {
          position: relative;
          width: 40px;
          height: 22px;
          border-radius: 999px;
          border: none;
          background: #ccc;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s;
        }
        .ms-toggle-on {
          background: var(--accent) !important;
        }
        .ms-toggle-thumb {
          position: absolute;
          top: 2px;
          left: 0;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.18);
        }

        /* ── 开始按钮 ── */
        .ms-start-btn {
          padding: 12px 40px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          cursor: pointer;
          margin-top: 4px;
        }
        .ms-start-btn:hover {
          background: var(--accent-hover);
        }

        /* ── 冥想进行中 ── */
        .ms-running {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .ms-active-sound {
          font-size: 13px;
          color: var(--text-soft);
        }
        .ms-progress-ring {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ms-ring-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .ms-ring-bg {
          stroke: var(--border);
        }
        .ms-ring-fill {
          stroke: var(--accent);
        }
        .ms-countdown {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          z-index: 1;
        }
        .ms-time {
          font-family: "Noto Serif SC", Georgia, "Times New Roman", serif;
          font-size: 36px;
          font-weight: 600;
          color: var(--text);
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.05em;
        }
        .ms-time-label {
          font-size: 12px;
          color: var(--text-soft);
        }
        .ms-end-btn {
          padding: 8px 28px;
          font-size: 13px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: transparent;
          color: var(--text-soft);
          cursor: pointer;
        }
        .ms-end-btn:hover {
          background: rgba(0,0,0,0.04);
        }
        [data-theme="night"] .ms-end-btn:hover {
          background: rgba(255,255,255,0.05);
        }

        /* ── 完成阶段 ── */
        .ms-completed {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          position: relative;
          padding: 30px 0 10px;
        }
        .ms-ripple {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(122, 154, 130, 0.25);
          top: 18px;
          pointer-events: none;
        }
        [data-theme="night"] .ms-ripple {
          background: rgba(157, 184, 165, 0.2);
        }
        .ms-complete-icon {
          font-size: 48px;
          position: relative;
          z-index: 1;
        }
        .ms-complete-label {
          font-family: "Noto Serif SC", Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--text);
          margin: 8px 0 0;
          position: relative;
          z-index: 1;
        }
        .ms-complete-duration {
          font-size: 13px;
          color: var(--text-soft);
          margin: 0 0 16px;
          position: relative;
          z-index: 1;
        }

        /* ── 响应式 ── */
        @media (max-width: 480px) {
          .ms-card {
            padding: 20px 16px 24px;
          }
          .ms-sound-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .ms-duration-pills {
            gap: 8px;
          }
          .ms-pill {
            padding: 7px 0;
            font-size: 12px;
          }
        }

        /* Coming Soon 占位卡样式 */
        .ms-sound-coming {
          border-style: dashed;
          opacity: 0.65;
        }
        .ms-sound-coming:hover {
          opacity: 1;
        }

        /* Coming Soon Toast */
        .ms-coming-toast {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 24px;
          border-radius: 999px;
          background: var(--text);
          color: var(--card-bg);
          font-size: 13px;
          z-index: 300;
          box-shadow: 0 8px 32px -4px rgba(0,0,0,0.2);
        }
      `})]}),v&&m.jsx("div",{className:"ms-coming-toast","data-testid":"coming-toast",children:"更多精彩音频正在路上，敬请期待！"})]})},a4=[{id:1,avatar:"🌿",nickname:"访客 A",stars:5,content:"呼吸引导的数字倒计时太有安全感了，焦虑的时候点开很管用。",isSeed:!0},{id:2,avatar:"🍂",nickname:"匿名用户",stars:5,content:"配色很舒服，像真的在森林里一样。",isSeed:!0},{id:3,avatar:"🦌",nickname:"林间漫步者",stars:4,content:"希望能增加自定义呼吸时长的功能。",isSeed:!0},{id:4,avatar:"🌙",nickname:"夜猫子",stars:5,content:"感恩日记的 12 月主题很戳我，坚持写了三天了！",isSeed:!0}],ey=["🍃","🌸","🦋","🍄","🌱","🌷","🐦","🦉"],i4=({count:n})=>m.jsx("span",{className:"mb-stars",children:[1,2,3,4,5].map(i=>m.jsx("span",{className:i<=n?"mb-star-filled":"mb-star-empty",children:"★"},i))}),l4=()=>{const[n,i]=j.useState(a4),[s,r]=j.useState(""),[u,f]=j.useState(""),[d,h]=j.useState(!1),p=g=>{if(g.preventDefault(),!u.trim())return;const x=ey[Math.floor(Math.random()*ey.length)],b={id:Date.now(),avatar:x,nickname:s.trim()||"匿名访客",stars:0,content:u.trim()};i(v=>[b,...v]),f(""),r(""),h(!0),window.setTimeout(()=>h(!1),2500)};return m.jsxs("div",{className:"mb-container",children:[m.jsxs("form",{className:"mb-form",onSubmit:p,children:[m.jsx("h4",{className:"mb-form-title",children:"留下你的感受"}),m.jsx("p",{className:"mb-form-desc",children:"你的只言片语，可能是某个人森林里的一束光。"}),m.jsx("input",{type:"text",className:"mb-input",placeholder:"昵称（可选，留空即匿名）",value:s,onChange:g=>r(g.target.value),maxLength:20}),m.jsx("textarea",{className:"mb-textarea",placeholder:"写下你想说的话…",value:u,onChange:g=>f(g.target.value),maxLength:200,rows:3}),m.jsxs("div",{className:"mb-form-footer",children:[m.jsxs("span",{className:"mb-char-count",children:[u.length,"/200"]}),m.jsx("button",{type:"submit",className:"mb-submit-btn",disabled:!u.trim(),children:"发布留言"})]}),m.jsx(ia,{children:d&&m.jsx(pt.span,{className:"mb-submit-feedback",initial:{opacity:0,y:6},animate:{opacity:1,y:0},exit:{opacity:0,y:6},transition:{duration:.3},children:"已发布 ✨ 感谢你的分享。"})})]}),m.jsxs("div",{className:"mb-reviews-header",children:[m.jsx("h4",{className:"mb-reviews-title",children:"来自访客的留言"}),m.jsxs("span",{className:"mb-reviews-count",children:[n.length," 条"]})]}),m.jsx("div",{className:"mb-reviews-grid",children:m.jsx(ia,{initial:!1,children:n.map((g,x)=>m.jsxs(pt.div,{className:`mb-review-card${g.isSeed?"":" mb-review-user"}`,initial:g.isSeed?{opacity:0,y:16}:{opacity:0,y:-12,scale:.96},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,scale:.95},transition:{duration:.4,delay:g.isSeed?x*.1:0},whileHover:{y:-3,boxShadow:"0 8px 24px -6px rgba(60,80,60,0.15)"},children:[m.jsxs("div",{className:"mb-review-top",children:[m.jsx("div",{className:"mb-review-avatar",children:g.avatar}),m.jsxs("div",{className:"mb-review-info",children:[m.jsxs("span",{className:"mb-review-name",children:[g.nickname,!g.isSeed&&m.jsx("span",{className:"mb-review-tag",children:"新"})]}),g.stars>0&&m.jsx(i4,{count:g.stars})]})]}),m.jsx("p",{className:"mb-review-text",children:g.content})]},g.id))})}),m.jsx("style",{children:`
        .mb-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ===== 留言表单 ===== */
        .mb-form {
          padding: 24px;
          border-radius: 16px;
          background: rgba(122, 154, 130, 0.05);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        [data-theme="night"] .mb-form {
          background: rgba(255, 255, 255, 0.03);
        }
        .mb-form-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }
        .mb-form-desc {
          font-size: 12px;
          color: var(--text-soft);
          margin: 0 0 4px;
          line-height: 1.6;
        }
        .mb-input {
          width: 100%;
          padding: 10px 14px;
          font-size: 13px;
          font-family: inherit;
          color: var(--text);
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          box-sizing: border-box;
        }
        .mb-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(122, 154, 130, 0.12);
        }
        .mb-input::placeholder {
          color: var(--text-soft);
          opacity: 0.5;
        }
        .mb-textarea {
          width: 100%;
          min-height: 80px;
          padding: 12px 14px;
          font-size: 14px;
          font-family: Georgia, "Noto Serif SC", serif;
          line-height: 1.7;
          color: var(--text);
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          resize: vertical;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          box-sizing: border-box;
        }
        .mb-textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(122, 154, 130, 0.12);
        }
        .mb-textarea::placeholder {
          color: var(--text-soft);
          opacity: 0.5;
          font-style: italic;
        }
        .mb-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mb-char-count {
          font-size: 11px;
          color: var(--text-soft);
          opacity: 0.6;
        }
        .mb-submit-btn {
          padding: 9px 24px;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          border: none;
          border-radius: 8px;
          background: var(--accent);
          color: #fff;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          box-shadow: 0 3px 12px -3px rgba(122, 154, 130, 0.4);
        }
        .mb-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px -3px rgba(122, 154, 130, 0.5);
        }
        .mb-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .mb-submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .mb-submit-feedback {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 12px;
          font-style: italic;
          color: var(--accent);
          align-self: flex-end;
        }

        /* ===== 留言列表 ===== */
        .mb-reviews-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mb-reviews-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }
        .mb-reviews-count {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(122, 154, 130, 0.12);
          color: var(--accent);
        }

        /* 评价卡片网格 */
        .mb-reviews-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .mb-review-card {
          padding: 16px;
          border-radius: 12px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          cursor: default;
          transition: box-shadow 0.25s ease;
        }
        /* 用户留言卡片：左侧加一条强调色边 */
        .mb-review-user {
          border-left: 3px solid var(--accent);
        }
        .mb-review-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .mb-review-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          background: rgba(122, 154, 130, 0.08);
          flex-shrink: 0;
        }
        .mb-review-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mb-review-name {
          font-size: 13px;
          font-weight: 500;
          color: var(--text);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .mb-review-tag {
          font-size: 9px;
          padding: 1px 6px;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          letter-spacing: 0.05em;
        }
        .mb-stars {
          display: flex;
          gap: 1px;
          font-size: 11px;
        }
        .mb-star-filled {
          color: #f5a623;
        }
        .mb-star-empty {
          color: var(--border);
        }
        .mb-review-text {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-soft);
          margin: 0;
        }

        @media (max-width: 640px) {
          .mb-reviews-grid {
            grid-template-columns: 1fr;
          }
        }
      `})]})},s4=()=>m.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[m.jsx("rect",{x:"3",y:"2",width:"14",height:"16",rx:"2",stroke:"currentColor",strokeWidth:"1.4"}),m.jsx("line",{x1:"3",y1:"6",x2:"17",y2:"6",stroke:"currentColor",strokeWidth:"1.2"}),m.jsx("line",{x1:"6",y1:"10",x2:"14",y2:"10",stroke:"currentColor",strokeWidth:"1",opacity:"0.5"}),m.jsx("line",{x1:"6",y1:"13",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1",opacity:"0.5"})]}),r4=()=>m.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[m.jsx("circle",{cx:"10",cy:"10",r:"6",stroke:"currentColor",strokeWidth:"1.4"}),m.jsx("circle",{cx:"10",cy:"10",r:"3",stroke:"currentColor",strokeWidth:"1",opacity:"0.5"})]}),o4=()=>m.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[m.jsx("circle",{cx:"10",cy:"6",r:"2.5",stroke:"currentColor",strokeWidth:"1.4"}),m.jsx("path",{d:"M4 16C4 13 6.5 11 10 11C13.5 11 16 13 16 16",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"}),m.jsx("path",{d:"M6 11L4 8M14 11L16 8",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",opacity:"0.5"})]}),u4=()=>m.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[m.jsx("rect",{x:"3",y:"3",width:"14",height:"12",rx:"2",stroke:"currentColor",strokeWidth:"1.4"}),m.jsx("path",{d:"M7 15V18M13 15V18",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),m.jsx("path",{d:"M6 8H14M6 11H11",stroke:"currentColor",strokeWidth:"1",opacity:"0.5",strokeLinecap:"round"})]}),c4=[{id:"journal",label:"感恩日记",subtitle:"Gratitude Journal",icon:m.jsx(s4,{})},{id:"breathing",label:"呼吸引导",subtitle:"Breathing Guide",icon:m.jsx(r4,{})},{id:"meditation",label:"冥想空间",subtitle:"Meditation Space",icon:m.jsx(o4,{})},{id:"board",label:"留言板",subtitle:"Message Board",icon:m.jsx(u4,{})}],f4=()=>{const[n,i]=j.useState("journal");return m.jsxs("div",{className:"lab-wrapper",children:[m.jsxs("div",{className:"lab-layout",children:[m.jsx("nav",{className:"lab-nav",children:c4.map(s=>m.jsxs("button",{className:`lab-nav-item ${n===s.id?"lab-nav-active":""}`,onClick:()=>i(s.id),children:[m.jsx("span",{className:"lab-nav-icon",children:s.icon}),m.jsxs("span",{className:"lab-nav-text",children:[m.jsx("span",{className:"lab-nav-label",children:s.label}),m.jsx("span",{className:"lab-nav-sub",children:s.subtitle})]}),n===s.id&&m.jsx(pt.span,{className:"lab-nav-indicator",layoutId:"lab-nav-indicator",transition:{duration:.3,ease:"easeOut"}})]},s.id))}),m.jsx("div",{className:"lab-content",children:m.jsx(ia,{mode:"wait",children:m.jsxs(pt.div,{className:"lab-content-inner",initial:{opacity:0,x:20},animate:{opacity:1,x:0},exit:{opacity:0,x:-20},transition:{duration:.3,ease:"easeOut"},children:[n==="journal"&&m.jsx(FE,{}),n==="breathing"&&m.jsx($E,{}),n==="meditation"&&m.jsx(n4,{}),n==="board"&&m.jsx(l4,{})]},n)})})]}),m.jsx("style",{children:`
        .lab-wrapper {
          margin-top: 32px;
        }

        /* ===== 布局：左侧导航 + 右侧内容 ===== */
        .lab-layout {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 32px;
          align-items: start;
        }

        /* ===== 左侧导航 ===== */
        .lab-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: sticky;
          top: 88px;
        }
        .lab-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 14px 16px;
          border: none;
          border-radius: 12px;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.25s ease, color 0.25s ease;
          color: var(--text-soft);
        }
        .lab-nav-item:hover {
          background: rgba(122, 154, 130, 0.06);
          color: var(--text);
        }
        .lab-nav-active {
          background: rgba(122, 154, 130, 0.1);
          color: var(--accent);
        }
        .lab-nav-active:hover {
          background: rgba(122, 154, 130, 0.12);
          color: var(--accent);
        }
        .lab-nav-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 60%;
          background: var(--accent);
          border-radius: 0 3px 3px 0;
        }
        .lab-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          opacity: 0.7;
          transition: opacity 0.25s ease;
        }
        .lab-nav-active .lab-nav-icon {
          opacity: 1;
        }
        .lab-nav-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .lab-nav-label {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px;
          font-weight: 500;
        }
        .lab-nav-sub {
          font-size: 10px;
          opacity: 0.5;
          letter-spacing: 0.05em;
        }

        /* ===== 右侧内容区 ===== */
        .lab-content {
          min-height: 400px;
          padding: 32px;
          border-radius: 16px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          box-shadow: 0 4px 24px -8px rgba(60, 80, 60, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .lab-content-inner {
          width: 100%;
        }

        /* ===== 响应式：移动端横向 Tab ===== */
        @media (max-width: 768px) {
          .lab-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .lab-nav {
            position: static;
            flex-direction: row;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px;
          }
          .lab-nav-item {
            flex-shrink: 0;
            padding: 10px 16px;
          }
          .lab-nav-indicator {
            left: 50%;
            top: auto;
            bottom: 0;
            transform: translateX(-50%);
            width: 60%;
            height: 3px;
            border-radius: 3px 3px 0 0;
          }
          .lab-nav-sub {
            display: none;
          }
          .lab-content {
            padding: 20px;
          }
        }
      `})]})},d4=n=>Array.from({length:n},()=>({left:Math.random()*100,delay:Math.random()*8,duration:10+Math.random()*8,size:2+Math.random()*3,drift:(Math.random()-.5)*40})),h4=()=>{const{isNight:n}=fd(),s=typeof window<"u"&&window.innerWidth<768?4:8,r=j.useMemo(()=>d4(s),[s]);return m.jsxs("div",{className:"dyn-bg","aria-hidden":"true",children:[m.jsx("div",{className:"dyn-layer dyn-layer-base"}),m.jsx("div",{className:"dyn-layer dyn-layer-far"}),m.jsx("div",{className:"dyn-layer dyn-layer-mid"}),m.jsx("div",{className:"dyn-layer dyn-layer-front",children:r.map((u,f)=>m.jsx("span",{className:`dyn-particle ${n?"dyn-firefly":"dyn-dust"}`,style:{left:`${u.left}%`,width:`${u.size}px`,height:`${u.size}px`,animationDelay:`${u.delay}s`,animationDuration:`${u.duration}s`,"--drift":`${u.drift}px`}},f))}),m.jsx("style",{children:`
        .dyn-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        /* ===== 基础背景图 — 12s 呼吸 ===== */
        .dyn-layer-base {
          background: url("/forest-bg.jpg") center center / cover no-repeat;
          animation: dyn-breathe 12s ease-in-out infinite;
        }

        /* ===== 远景：极慢漂移 ===== */
        .dyn-layer-far {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(122, 154, 130, 0.03) 50%,
            transparent 100%
          );
          animation: dyn-drift 30s ease-in-out infinite alternate;
        }

        /* ===== 中景：轻微旋转 ===== */
        .dyn-layer-mid {
          background: radial-gradient(
            ellipse at 30% 60%,
            rgba(122, 154, 130, 0.04) 0%,
            transparent 60%
          );
          animation: dyn-sway 5s ease-in-out infinite alternate;
        }

        .dyn-layer {
          position: absolute;
          inset: -10px;
        }

        /* ===== 前景粒子 ===== */
        .dyn-layer-front {
          position: absolute;
          inset: 0;
        }
        .dyn-particle {
          position: absolute;
          top: -10px;
          border-radius: 50%;
          animation-name: dyn-fall;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        /* 浅色：金色光尘 */
        .dyn-dust {
          background: rgba(218, 165, 32, 0.5);
          box-shadow: 0 0 4px rgba(218, 165, 32, 0.3);
        }
        /* 深色：绿色萤火虫 */
        .dyn-firefly {
          background: rgba(157, 184, 165, 0.7);
          box-shadow: 0 0 6px rgba(157, 184, 165, 0.5), 0 0 12px rgba(157, 184, 165, 0.2);
          animation-name: dyn-fall, dyn-glow;
        }

        /* ===== 关键帧 ===== */
        @keyframes dyn-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        @keyframes dyn-drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(6px); }
        }
        @keyframes dyn-sway {
          0% { transform: rotate(-0.4deg); }
          100% { transform: rotate(0.4deg); }
        }
        @keyframes dyn-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% {
            transform: translateY(100vh) translateX(var(--drift, 0px)) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes dyn-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @media (max-width: 768px) {
          .dyn-layer-mid {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .dyn-layer-base,
          .dyn-layer-far,
          .dyn-layer-mid,
          .dyn-particle {
            animation: none !important;
          }
        }
      `})]})},ny=.12,m4=5e3,p4=()=>{const[n,i]=j.useState(!1),[s,r]=j.useState(!1),u=j.useRef({x:0,y:0,rotation:0}),f=j.useRef({x:0,y:0,rotation:0}),d=j.useRef(Date.now()),h=j.useRef(0),p=j.useRef(0),g=j.useRef(null),x=v=>v?!!v.closest('a, button, input, textarea, select, [role="button"], [data-cursor="hover"]'):!1,b=j.useCallback(v=>{f.current={x:v.clientX,y:v.clientY,rotation:0},d.current=Date.now(),i(!0);const E=document.elementFromPoint(v.clientX,v.clientY);r(x(E))},[]);return j.useEffect(()=>{const v=()=>{const E=u.current,A=f.current;if(Date.now()-d.current>m4){p.current+=.015;const z=Math.sin(p.current)*15,U=Math.cos(p.current*.7)*10;A.x=f.current.x+z,A.y=f.current.y+U}else p.current=0;E.x+=(A.x-E.x)*ny,E.y+=(A.y-E.y)*ny;const C=A.x-E.x,_=A.y-E.y;(Math.abs(C)>1||Math.abs(_)>1)&&(E.rotation=Math.atan2(_,C)*(180/Math.PI)*.15),g.current&&(g.current.style.transform=`translate3d(${E.x-12}px, ${E.y-12}px, 0) rotate(${E.rotation}deg)`),h.current=requestAnimationFrame(v)};return h.current=requestAnimationFrame(v),()=>cancelAnimationFrame(h.current)},[]),j.useEffect(()=>{if(!(window.innerWidth<768||matchMedia("(pointer: coarse)").matches))return document.addEventListener("mousemove",b),document.addEventListener("mouseleave",()=>i(!1)),()=>{document.removeEventListener("mousemove",b)}},[b]),n?m.jsxs("div",{ref:g,className:"butterfly-cursor","aria-hidden":"true",children:[m.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[m.jsxs("g",{className:`bf-wing bf-wing-left ${s?"bf-fast":""}`,children:[m.jsx("ellipse",{cx:"7",cy:"9",rx:"5",ry:"4.5",fill:"rgba(122,154,130,0.35)",stroke:"rgba(90,74,66,0.4)",strokeWidth:"0.6"}),m.jsx("ellipse",{cx:"7",cy:"15",rx:"3.5",ry:"3",fill:"rgba(122,154,130,0.25)",stroke:"rgba(90,74,66,0.3)",strokeWidth:"0.5"})]}),m.jsxs("g",{className:`bf-wing bf-wing-right ${s?"bf-fast":""}`,children:[m.jsx("ellipse",{cx:"17",cy:"9",rx:"5",ry:"4.5",fill:"rgba(122,154,130,0.35)",stroke:"rgba(90,74,66,0.4)",strokeWidth:"0.6"}),m.jsx("ellipse",{cx:"17",cy:"15",rx:"3.5",ry:"3",fill:"rgba(122,154,130,0.25)",stroke:"rgba(90,74,66,0.3)",strokeWidth:"0.5"})]}),m.jsx("ellipse",{cx:"12",cy:"12",rx:"1",ry:"6",fill:"rgba(90,74,66,0.7)"}),m.jsx("path",{d:"M11 6.5C10.5 5 10 4 9.5 3.5",stroke:"rgba(90,74,66,0.5)",strokeWidth:"0.5",strokeLinecap:"round"}),m.jsx("path",{d:"M13 6.5C13.5 5 14 4 14.5 3.5",stroke:"rgba(90,74,66,0.5)",strokeWidth:"0.5",strokeLinecap:"round"})]}),m.jsx("style",{children:`
        .butterfly-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 24px;
          height: 24px;
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
        }
        .bf-wing {
          transform-origin: 12px 12px;
          transform-box: fill-box;
        }
        .bf-wing-left {
          animation: bf-flap-left 0.6s ease-in-out infinite;
        }
        .bf-wing-right {
          animation: bf-flap-right 0.6s ease-in-out infinite;
        }
        .bf-fast.bf-wing-left {
          animation-duration: 0.2s;
        }
        .bf-fast.bf-wing-right {
          animation-duration: 0.2s;
        }
        @keyframes bf-flap-left {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.3); }
        }
        @keyframes bf-flap-right {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.3); }
        }
        @media (max-width: 768px) {
          .butterfly-cursor {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bf-wing-left,
          .bf-wing-right {
            animation: none;
          }
        }
      `})]}):null},Nl={initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-80px"},transition:{duration:.6,ease:"easeOut"}},Ml=[{emoji:"📖",name:"阅读",desc:"最近在读《思考，快与慢》，丹尼尔·卡尼曼的经典之作。",detail:"金句摘录：我们对我们所知的东西的信心，远远超过了我们所知的东西。"},{emoji:"📸",name:"摄影",desc:"喜欢用镜头捕捉森林里的光影，记录转瞬即逝的自然之美。",detail:"设备：Sony A7C + 28-60mm，偏爱自然光与胶片色调。"},{emoji:"🎧",name:"音乐/播客",desc:"播客重度用户，最喜欢「声东击西」和「日谈公园」。",detail:"音乐偏好：后摇、古典、氛围电子。最近单曲循环坂本龙一。"},{emoji:"🏃",name:"运动",desc:`每周跑步 3 次，配速 5'30"，享受奔跑时的心流状态。`,detail:"Keep 累计 300+ km，最佳半马 1:58:32。"},{emoji:"🧘",name:"冥想",desc:"每天 10 分钟正念冥想，已坚持 200+ 天。",detail:"使用 Headspace 引导，偏爱身体扫描与呼吸觉察。"},{emoji:"📺",name:"追剧",desc:"剧迷一枚，最近在追《重启人生》和《繁花》。",detail:"品味：日剧 > 韩剧 > 国剧。最爱《深夜食堂》系列。"}],g4=["产品规划","用户研究","需求分析","原型设计","数据分析","AI 应用","项目管理","跨部门协作","竞品分析","增长策略"],y4=()=>{const{isNight:n,toggleTheme:i}=fd(),[s,r]=j.useState("home"),[u,f]=j.useState(!1),d=j.useRef(null),[h,p]=j.useState(null),g=j.useCallback(v=>{d.current=v},[]);j.useEffect(()=>{const E=new URLSearchParams(window.location.search).get("mode")==="full";f(E),document.title=E?"路俊玲 | AI 产品经理作品集":"森林疗愈室"},[]),j.useEffect(()=>{const v=u?["home","about","projects","lab"]:["home","lab"],E=new IntersectionObserver(A=>{A.forEach(R=>{R.isIntersecting&&r(R.target.id)})},{rootMargin:"-40% 0px -50% 0px"});return v.forEach(A=>{const R=document.getElementById(A);R&&E.observe(R)}),()=>E.disconnect()},[u]);const x=v=>{const E=document.getElementById(v);E&&E.scrollIntoView({behavior:"smooth"})},b=()=>{const v=document.getElementById("projects");v&&(v.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{var E;return(E=d.current)==null?void 0:E.call(d)},800))};return m.jsxs("div",{className:"page-overlay",children:[m.jsx(h4,{}),m.jsx(p4,{}),m.jsx(ME,{current:s,onNavigate:x,isNight:n,onToggleTheme:i,isFullMode:u}),m.jsxs("section",{id:"home",className:"hero-section min-h-screen flex flex-col justify-center px-6 md:px-24 max-w-4xl mx-auto",children:[m.jsx("div",{className:"hero-overlay"}),m.jsx(pt.div,{...Nl,className:"hero-content",children:u?m.jsxs(m.Fragment,{children:[m.jsx("p",{className:"text-sm mb-4 tracking-widest uppercase",style:{color:"var(--accent)"},children:"AI Product Manager"}),m.jsx("h1",{className:"hero-title text-5xl md:text-6xl mb-6",style:{fontFamily:'"Noto Serif SC", serif'},children:"路俊玲"}),m.jsx("p",{className:"hero-sub text-xl md:text-2xl mb-4",style:{maxWidth:"520px"},children:"Building Human-Centric AI Products"}),m.jsx("p",{className:"hero-body text-base max-w-xl leading-relaxed mb-10",children:"从软件工程的代码世界出发，逐渐走向 AI 产品的舞台。 相信好的产品源自对人的理解——技术是手段，温柔才是底色。"}),m.jsxs("div",{className:"hero-buttons",children:[m.jsx("button",{onClick:()=>x("about"),className:"hero-btn hero-btn-primary",children:"了解更多"}),m.jsx("button",{onClick:b,className:"hero-btn hero-btn-outline",children:"翻阅我的作品 📖"})]})]}):m.jsxs(m.Fragment,{children:[m.jsx("p",{className:"text-sm mb-4 tracking-widest uppercase",style:{color:"var(--accent)"},children:"Forest Healing Room"}),m.jsx("h1",{className:"hero-title text-5xl md:text-6xl mb-6",style:{fontFamily:'"Noto Serif SC", serif'},children:"森林疗愈室"}),m.jsx("p",{className:"hero-sub text-xl md:text-2xl mb-4",style:{maxWidth:"520px"},children:"在这里，每一次呼吸都有人同在"}),m.jsx("p",{className:"hero-body text-base max-w-xl leading-relaxed mb-6",children:"一个安静的角落，为你准备了呼吸引导、冥想空间和感恩日记。"}),m.jsxs("div",{className:"social-proof",children:[m.jsxs("p",{className:"social-proof-main",children:["已陪伴 ",m.jsx("span",{className:"social-proof-num",children:"1000+"})," 位朋友找到平静"]}),m.jsx("p",{className:"social-proof-sub",children:"每一次呼吸，都有人同在。"})]}),m.jsx("div",{className:"hero-buttons",children:m.jsx("button",{onClick:()=>x("lab"),className:"hero-btn hero-btn-primary",children:"进入疗愈室"})})]})}),m.jsx("style",{children:`
          .hero-section { position: relative; }
          .hero-overlay {
            position: absolute; inset: 0; z-index: 0; pointer-events: none;
            background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 100%);
            border-radius: 16px;
          }
          [data-theme="night"] .hero-overlay {
            background: linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.75) 100%);
          }
          .hero-content { position: relative; z-index: 1; }
          .hero-title {
            color: #ffffff;
            text-shadow: 0 2px 8px rgba(0,0,0,0.7), 0 0 24px rgba(0,0,0,0.4);
          }
          .hero-sub, .hero-body {
            color: #ffffff;
            text-shadow: 0 2px 8px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.5);
          }
          .hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; }
          .hero-btn {
            padding: 12px 28px; font-size: 14px; font-weight: 500; border-radius: 10px;
            border: none; cursor: pointer;
            transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          }
          .hero-btn:hover { transform: translateY(-2px); }
          .hero-btn-primary {
            background: var(--accent); color: #fff;
            box-shadow: 0 4px 16px -4px rgba(122,154,130,0.4);
          }
          .hero-btn-primary:hover { background: var(--accent-hover); box-shadow: 0 8px 24px -4px rgba(122,154,130,0.5); }
          .hero-btn-outline {
            background: rgba(255,255,255,0.2); color: #fff;
            border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(4px);
            box-shadow: 0 2px 12px -4px rgba(0,0,0,0.2);
          }
          .hero-btn-outline:hover { background: rgba(255,255,255,0.3); border-color: var(--accent); }
          /* 社交认同 */
          .social-proof {
            margin-bottom: 24px; padding: 14px 20px; border-radius: 12px;
            background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15);
            backdrop-filter: blur(8px);
            display: inline-block;
          }
          .social-proof-main {
            font-size: 14px; color: #fff; margin: 0 0 4px;
          }
          .social-proof-num {
            font-family: "Noto Serif SC", serif; font-weight: 600;
            color: #C8E6C9; font-size: 16px;
          }
          .social-proof-sub {
            font-size: 12px; color: rgba(255,255,255,0.7); margin: 0;
          }
        `})]}),u&&m.jsxs(m.Fragment,{children:[m.jsxs("section",{id:"about",className:"min-h-screen px-6 md:px-24 max-w-5xl mx-auto py-24",children:[m.jsx(pt.div,{...Nl,className:"about-module",children:m.jsxs("div",{className:"about-module-inner about-pro",children:[m.jsxs("div",{className:"about-pro-left",children:[m.jsx("h2",{className:"about-section-title",children:"我的专业能力"}),m.jsx("p",{className:"about-pro-intro",children:"专注于 AI 产品落地与人性化设计。从需求洞察到产品上线， 擅长将复杂技术转化为用户可感知的价值。"}),m.jsx("div",{className:"about-edu",children:m.jsxs("div",{className:"about-edu-item",children:[m.jsx("p",{className:"about-edu-school",children:"河南工学院"}),m.jsx("p",{className:"about-edu-detail",children:"本科 · 软件工程"})]})})]}),m.jsxs("div",{className:"about-pro-right",children:[m.jsx("p",{className:"about-label",children:"核心技能"}),m.jsx("div",{className:"about-skill-cloud",children:g4.map(v=>m.jsx(pt.span,{className:"about-skill-tag",whileHover:{scale:1.08},transition:{duration:.2},children:v},v))})]})]})}),m.jsxs(pt.div,{...Nl,className:"about-module",style:{marginTop:48},children:[m.jsx("h3",{className:"about-section-title",style:{marginBottom:20},children:"生活切面"}),m.jsx("div",{className:"about-hobby-grid",children:Ml.map((v,E)=>m.jsxs(pt.div,{className:"about-hobby-card",whileHover:{y:-4,boxShadow:"0 12px 32px -8px rgba(60,80,60,0.2)"},transition:{duration:.25},onClick:()=>p(E),children:[m.jsx("div",{className:"about-hobby-emoji",children:v.emoji}),m.jsx("div",{className:"about-hobby-label",children:v.name})]},v.name))})]}),m.jsx(ia,{children:h!==null&&m.jsx(pt.div,{className:"about-lightbox-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>p(null),children:m.jsxs(pt.div,{className:"about-lightbox",initial:{scale:.92,y:30},animate:{scale:1,y:0},exit:{scale:.92,y:30},transition:{duration:.3,ease:"easeOut"},onClick:v=>v.stopPropagation(),children:[m.jsx("button",{className:"about-lightbox-close",onClick:()=>p(null),children:"×"}),m.jsx("div",{className:"about-lightbox-icon",children:Ml[h].emoji}),m.jsx("h3",{className:"about-lightbox-name",children:Ml[h].name}),m.jsx("p",{className:"about-lightbox-desc",children:Ml[h].desc}),m.jsxs("div",{className:"about-lightbox-detail",children:[m.jsx("p",{className:"about-lightbox-detail-label",children:"更多细节"}),m.jsx("p",{className:"about-lightbox-detail-text",children:Ml[h].detail})]})]})})}),m.jsx("style",{children:`
          .about-module-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .about-section-title {
            font-family: "Noto Serif SC", Georgia, serif;
            font-size: 28px; font-weight: 600; color: var(--text);
            margin-bottom: 20px; letter-spacing: 0.02em;
          }
          .about-pro-intro { font-size: 15px; line-height: 1.8; color: var(--text-soft); margin-bottom: 24px; }
          .about-edu { display: flex; flex-direction: column; gap: 12px; }
          .about-edu-item { padding-left: 16px; border-left: 2px solid var(--border); }
          .about-edu-school { font-size: 15px; font-weight: 500; color: var(--text); margin: 0 0 2px; }
          .about-edu-detail { font-size: 13px; color: var(--text-soft); margin: 0; }
          .about-label { font-size: 13px; color: var(--text-soft); margin-bottom: 12px; letter-spacing: 0.05em; }
          .about-skill-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
          .about-skill-tag {
            padding: 6px 16px; font-size: 13px; border-radius: 999px;
            background: rgba(122,154,130,0.1); color: var(--accent);
            cursor: default; transition: transform 0.2s ease;
          }
          /* 爱好网格 */
          .about-hobby-grid {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
          }
          .about-hobby-card {
            position: relative; padding: 32px 16px; border-radius: 16px;
            background: var(--card-bg); border: 1px solid var(--border);
            text-align: center; cursor: pointer;
            box-shadow: 0 4px 16px -6px rgba(60,80,60,0.08);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
            overflow: hidden;
          }
          .about-hobby-card::after {
            content: ""; position: absolute; inset: 0;
            background: linear-gradient(to top, rgba(122,154,130,0.06) 0%, transparent 60%);
            pointer-events: none;
          }
          .about-hobby-emoji { font-size: 32px; margin-bottom: 10px; position: relative; z-index: 1; }
          .about-hobby-label {
            font-family: "Noto Serif SC", Georgia, serif;
            font-size: 14px; font-weight: 500; color: var(--text);
            position: relative; z-index: 1;
          }
          /* 灯箱 */
          .about-lightbox-overlay {
            position: fixed; inset: 0; z-index: 200; display: flex;
            align-items: center; justify-content: center; padding: 24px;
            background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          }
          .about-lightbox {
            position: relative; width: 100%; max-width: 480px; padding: 36px;
            border-radius: 20px; background: var(--card-bg);
            border: 1px solid var(--border);
            box-shadow: 0 24px 64px -16px rgba(0,0,0,0.3); text-align: center;
          }
          .about-lightbox-close {
            position: absolute; top: 14px; right: 14px; width: 32px; height: 32px;
            border: none; border-radius: 50%; background: rgba(255,255,255,0.9);
            color: var(--text-soft); font-size: 18px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: background 0.2s ease;
          }
          .about-lightbox-close:hover { background: #fff; }
          .about-lightbox-icon { font-size: 48px; margin-bottom: 16px; }
          .about-lightbox-name {
            font-family: "Noto Serif SC", Georgia, serif;
            font-size: 22px; font-weight: 600; color: var(--text); margin-bottom: 12px;
          }
          .about-lightbox-desc {
            font-size: 14px; line-height: 1.7; color: var(--text-soft); margin-bottom: 20px;
          }
          .about-lightbox-detail {
            padding: 16px; border-radius: 12px;
            background: rgba(122,154,130,0.06); text-align: left;
          }
          .about-lightbox-detail-label {
            font-size: 11px; color: var(--accent); letter-spacing: 0.1em;
            text-transform: uppercase; margin-bottom: 6px;
          }
          .about-lightbox-detail-text { font-size: 13px; line-height: 1.7; color: var(--text-soft); margin: 0; }

          @media (max-width: 768px) {
            .about-module-inner { grid-template-columns: 1fr; gap: 24px; }
            .about-hobby-grid { grid-template-columns: repeat(2, 1fr); }
            .about-section-title { font-size: 24px; }
          }
        `})]}),m.jsxs("section",{id:"projects",className:"min-h-screen px-6 md:px-24 max-w-5xl mx-auto py-24",children:[m.jsxs(pt.div,{...Nl,children:[m.jsx("h2",{className:"text-3xl md:text-4xl mb-4",style:{fontFamily:'"Noto Serif SC", serif'},children:"项目集"}),m.jsx("p",{className:"text-base mb-2 max-w-xl",style:{color:"var(--text-soft)"},children:"翻开这本树叶书，每一页都是一段实践的印记。"})]}),m.jsx(VE,{registerOpenBook:g})]})]}),m.jsxs("section",{id:"lab",className:"min-h-screen px-6 md:px-24 max-w-5xl mx-auto py-24",children:[m.jsxs(pt.div,{...Nl,children:[m.jsx("h2",{className:"text-3xl md:text-4xl mb-4",style:{fontFamily:'"Noto Serif SC", serif'},children:"疗愈室"}),m.jsx("p",{className:"text-base mb-2 max-w-xl",style:{color:"var(--text-soft)"},children:"四个实验性的自我疗愈工具，在快节奏的产品工作中保持内心的平静。"})]}),m.jsx(f4,{})]}),m.jsxs("footer",{className:"py-12 px-6 text-center",style:{borderTop:"1px solid var(--border)"},children:[m.jsx("p",{className:"text-sm",style:{color:"var(--text-soft)"},children:"© 2026 路俊玲 · Building Human-Centric AI Products"}),m.jsx("p",{className:"text-xs mt-2",style:{color:"var(--text-soft)"},children:"junling@example.com"})]})]})},x4=()=>m.jsx(CE,{children:m.jsx(y4,{})}),b4=[{dimension:"身",title:"森林疗愈室",value:"生理调节"},{dimension:"心",title:"5% 答案书 + 回血清单",value:"情绪修复"},{dimension:"行",title:"通关清单",value:"执行力"},{dimension:"知",title:"妙妙工具箱",value:"认知与求知欲"},{dimension:"游",title:"漫游指南",value:"探索与规划"},{dimension:"术",title:"万能百事通",value:"效率与工具"},{dimension:"管",title:"物资管家",value:"资源管理与反"},{dimension:"感",title:"解压馆",value:"触觉发泄"},{dimension:"魂",title:"时光博物馆",value:"自我认知"}],ay=[{bg:"rgba(122,154,130,0.14)",fg:"#5d8a6a"},{bg:"rgba(196,143,143,0.16)",fg:"#b06a6a"},{bg:"rgba(196,163,107,0.16)",fg:"#a8814a"},{bg:"rgba(120,138,168,0.16)",fg:"#5f76a0"},{bg:"rgba(106,158,150,0.16)",fg:"#4d8a82"},{bg:"rgba(150,135,178,0.16)",fg:"#7e6aa3"},{bg:"rgba(178,150,106,0.16)",fg:"#9a7d4a"},{bg:"rgba(196,138,118,0.16)",fg:"#b06f55"},{bg:"rgba(150,120,150,0.16)",fg:"#8a5f8a"}],v4=()=>{const n=Rf(),i=s=>{if(s==="物资管家"){n("/toolbox/inventory");return}n(`/toolbox/${encodeURIComponent(s)}`)};return m.jsxs("div",{className:"toolbox-page",children:[m.jsxs("header",{className:"toolbox-topbar",children:[m.jsx(za,{to:"/",className:"toolbox-back",children:"← 森林疗愈室"}),m.jsx("span",{className:"toolbox-topbar-meta",children:"数字造物场"})]}),m.jsxs("section",{className:"toolbox-hero",children:[m.jsx(pt.p,{className:"toolbox-eyebrow",initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.5},children:"Miaomiao Toolbox"}),m.jsx(pt.h1,{className:"toolbox-title",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6,delay:.05},children:"妙妙工具箱"}),m.jsx(pt.p,{className:"toolbox-subtitle",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6,delay:.12},children:"我的第一个数字造物场 · 覆盖生活的 9 个维度"})]}),m.jsx("section",{className:"toolbox-grid",children:b4.map((s,r)=>{const u=ay[r]??ay[0];return m.jsxs(pt.button,{type:"button",className:"tool-card",initial:{opacity:0,y:22},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-40px"},transition:{duration:.5,delay:r%3*.08+Math.floor(r/3)*.05,ease:"easeOut"},whileHover:{y:-6},onClick:()=>i(s.title),"aria-label":`打开 ${s.title}`,children:[m.jsx("span",{className:"tool-card-no",children:String(r+1).padStart(2,"0")}),m.jsx("span",{className:"tool-card-dimension",style:{background:u.bg,color:u.fg},children:s.dimension}),m.jsx("span",{className:"tool-card-title",children:s.title}),m.jsx("span",{className:"tool-card-value",children:s.value})]},s.title)})}),m.jsxs("footer",{className:"toolbox-foot",children:[m.jsx("span",{children:"九个维度，一座造物场"}),m.jsx("span",{className:"toolbox-foot-dot",children:"·"}),m.jsx("span",{children:"持续生长中"})]})]})},S4=()=>{const{title:n}=k2(),i=Rf(),s=n||"未知作品";return m.jsxs("div",{className:"toolbox-page",children:[m.jsxs("header",{className:"toolbox-topbar",children:[m.jsx("button",{className:"toolbox-back",onClick:()=>i(-1),children:"← 返回"}),m.jsx("span",{className:"toolbox-topbar-meta",children:"造物详情"})]}),m.jsxs("section",{className:"detail-hero",children:[m.jsx(pt.p,{className:"toolbox-eyebrow",initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.5},children:"Miaomiao Toolbox"}),m.jsx(pt.h1,{className:"toolbox-title",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6,delay:.05},children:s}),m.jsxs(pt.div,{className:"detail-status",initial:{opacity:0},animate:{opacity:1},transition:{duration:.6,delay:.2},children:[m.jsx("span",{className:"detail-status-dot"}),"正在建造中"]})]}),m.jsxs(pt.section,{className:"detail-card",initial:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{duration:.6,delay:.25},children:[m.jsxs("p",{className:"detail-placeholder-text",children:["这里将是「",s,"」的专属空间。维度的内容正在一笔一笔手写中，敬请期待。"]}),m.jsx(za,{to:"/toolbox",className:"detail-back-link",children:"← 回到工具箱"})]})]})},j4=["瓶","盒","袋"],T4=["冰箱","浴室","储物间"],pb="inventory_items",gb=30;function yi(...n){return n.filter(Boolean).join(" ")}function E4(){return typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,8)}`}function w4(){try{const n=localStorage.getItem(pb);if(!n)return[];const i=JSON.parse(n);return Array.isArray(i)?i:[]}catch{return[]}}function Sr(n,i){const s=new Date(`${n}T00:00:00`);return Number.isNaN(s.getTime())?1/0:Math.round((s.getTime()-i.getTime())/864e5)}function iy(n){return n<0?"expired":n<=gb?"expiring":"sufficient"}function ly(n){return n<0?`已过期 ${Math.abs(n)} 天`:n===0?"今天到期":`还剩 ${n} 天`}const A4=[{key:"expired",label:"已过期",dot:"bg-red-400",active:"bg-red-50 border-red-300 text-red-600",idle:"bg-white border-gray-200 text-gray-600 hover:border-red-200"},{key:"expiring",label:"临期 · 30 天内",dot:"bg-amber-400",active:"bg-amber-50 border-amber-300 text-amber-700",idle:"bg-white border-gray-200 text-gray-600 hover:border-amber-200"},{key:"sufficient",label:"库存充足",dot:"bg-emerald-400",active:"bg-emerald-50 border-emerald-300 text-emerald-700",idle:"bg-white border-gray-200 text-gray-600 hover:border-emerald-200"}],C4=()=>{const[n,i]=j.useState(()=>w4()),[s,r]=j.useState("all"),[u,f]=j.useState(new Set),[d,h]=j.useState({name:"",count:1,unit:"瓶",expiryDate:"",location:"冰箱"});j.useEffect(()=>{try{localStorage.setItem(pb,JSON.stringify(n))}catch{}},[n]);const p=j.useMemo(()=>{const T=new Date;return T.setHours(0,0,0,0),T},[]),g=j.useMemo(()=>{let T=0,C=0,_=0;return n.forEach(z=>{const U=iy(Sr(z.expiryDate,p));U==="expired"?T++:U==="expiring"?C++:_++}),{expired:T,expiring:C,sufficient:_}},[n,p]),x=j.useMemo(()=>s==="all"?n:n.filter(T=>iy(Sr(T.expiryDate,p))===s),[n,s,p]),b=j.useMemo(()=>n.length===0?null:[...n].sort((T,C)=>T.expiryDate.localeCompare(C.expiryDate))[0],[n]),v=d.name.trim().length>0&&d.count>=1&&d.expiryDate.length>0,E=()=>{if(!v)return;const T={id:E4(),name:d.name.trim(),count:d.count,unit:d.unit,expiryDate:d.expiryDate,location:d.location};i(C=>[T,...C]),h(C=>({...C,name:""}))},A=T=>{f(C=>new Set(C).add(T)),window.setTimeout(()=>{i(C=>C.filter(_=>_.id!==T)),f(C=>{const _=new Set(C);return _.delete(T),_})},300)},R=b?Sr(b.expiryDate,p):1/0;return m.jsxs("div",{className:"inventory-page min-h-screen bg-gray-50 text-gray-800",children:[m.jsx("header",{className:"border-b border-gray-200 bg-white",children:m.jsxs("div",{className:"mx-auto flex max-w-6xl items-center justify-between px-6 py-4",children:[m.jsx(za,{to:"/toolbox",className:"text-sm text-gray-500 transition-colors hover:text-[#5d8a6a]",children:"← 妙妙工具箱"}),m.jsxs("div",{className:"flex items-center gap-2",children:[m.jsx("span",{className:"h-2 w-2 rounded-full bg-[#5d8a6a]"}),m.jsx("span",{className:"text-xs uppercase tracking-[0.2em] text-gray-400",children:"Inventory Prophet"})]})]})}),m.jsxs("div",{className:"mx-auto max-w-6xl px-6 pb-6 pt-8",children:[m.jsx("h1",{className:"text-2xl font-semibold text-gray-900",children:"物资管家"}),m.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"资源管理与反浪费 · 把每一件物品用在它最好的时候"})]}),m.jsxs("div",{className:"mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-[340px_1fr] lg:items-start",children:[m.jsxs("aside",{className:"space-y-6 lg:sticky lg:top-6",children:[m.jsxs("section",{className:"rounded-xl border border-gray-200 bg-white p-5",children:[m.jsxs("h2",{className:"mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700",children:[m.jsx("span",{className:"h-1 w-4 rounded-full bg-[#5d8a6a]"}),"入库登记"]}),m.jsxs("div",{className:"space-y-3",children:[m.jsxs("div",{children:[m.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"物品名称"}),m.jsx("input",{type:"text",value:d.name,placeholder:"如：洗衣液",onChange:T=>h(C=>({...C,name:T.target.value})),className:"w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30"})]}),m.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[m.jsxs("div",{children:[m.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"数量"}),m.jsx("input",{type:"number",min:1,value:d.count,onChange:T=>h(C=>({...C,count:Math.max(1,Number(T.target.value)||1)})),className:"w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30"})]}),m.jsxs("div",{children:[m.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"单位"}),m.jsx("select",{value:d.unit,onChange:T=>h(C=>({...C,unit:T.target.value})),className:"w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30",children:j4.map(T=>m.jsx("option",{value:T,children:T},T))})]})]}),m.jsxs("div",{children:[m.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"到期日"}),m.jsx("input",{type:"date",value:d.expiryDate,onChange:T=>h(C=>({...C,expiryDate:T.target.value})),className:"w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30"})]}),m.jsxs("div",{children:[m.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"存放位置"}),m.jsx("select",{value:d.location,onChange:T=>h(C=>({...C,location:T.target.value})),className:"w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30",children:T4.map(T=>m.jsx("option",{value:T,children:T},T))})]}),m.jsx("button",{type:"button",onClick:E,disabled:!v,className:"w-full rounded-lg bg-[#5d8a6a] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4d7a5a] disabled:cursor-not-allowed disabled:opacity-50",children:"确认入库"})]})]}),m.jsxs("section",{className:"rounded-xl border border-gray-200 bg-white p-5",children:[m.jsxs("h2",{className:"mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700",children:[m.jsx("span",{className:"h-1 w-4 rounded-full bg-amber-400"}),"今日消耗建议"]}),b?m.jsxs("div",{children:[m.jsxs("p",{className:"text-sm leading-relaxed text-gray-600",children:["您的「",m.jsx("span",{className:"font-medium text-gray-900",children:b.name}),"」",ly(R),"，建议今天使用！"]}),m.jsx("button",{type:"button",onClick:()=>A(b.id),className:"mt-3 text-sm font-medium text-red-500 transition-colors hover:text-red-600",children:"标记已用完"})]}):m.jsx("p",{className:"text-sm text-gray-400",children:"暂无物品。先在上方入库，我来帮你规划。"})]})]}),m.jsxs("main",{className:"min-w-0 space-y-6",children:[m.jsxs("section",{className:"flex flex-wrap items-center gap-3",children:[A4.map(T=>{const C=g[T.key],_=s===T.key;return m.jsxs("button",{type:"button",onClick:()=>r(z=>z===T.key?"all":T.key),className:yi("flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",_?T.active:T.idle),children:[m.jsx("span",{className:yi("h-2 w-2 rounded-full",T.dot)}),T.label,m.jsx("span",{className:"font-semibold",children:C})]},T.key)}),s!=="all"&&m.jsx("button",{type:"button",onClick:()=>r("all"),className:"self-center text-xs text-gray-400 transition-colors hover:text-gray-600",children:"显示全部"})]}),m.jsxs("section",{className:"overflow-hidden rounded-xl border border-gray-200 bg-white",children:[m.jsxs("div",{className:"flex items-center justify-between border-b border-gray-100 px-5 py-3",children:[m.jsx("h2",{className:"text-sm font-semibold text-gray-700",children:"库存列表"}),m.jsxs("span",{className:"text-xs text-gray-400",children:["共 ",x.length," 件"]})]}),x.length===0?m.jsx("div",{className:"py-16 text-center",children:m.jsx("p",{className:"text-sm text-gray-400",children:n.length===0?"还没有任何物品，去左侧入库吧。":"当前筛选下没有物品。"})}):m.jsx("div",{className:"overflow-x-auto",children:m.jsxs("table",{className:"w-full border-collapse text-sm",children:[m.jsx("thead",{children:m.jsxs("tr",{className:"border-b border-gray-100 text-left text-xs text-gray-400",children:[m.jsx("th",{className:"px-5 py-3 font-medium",children:"物品"}),m.jsx("th",{className:"px-5 py-3 font-medium",children:"数量"}),m.jsx("th",{className:"px-5 py-3 font-medium",children:"到期日"}),m.jsx("th",{className:"px-5 py-3 font-medium",children:"存放位置"}),m.jsx("th",{className:"px-5 py-3 text-right font-medium",children:"操作"})]})}),m.jsx("tbody",{children:x.map(T=>{const C=Sr(T.expiryDate,p),_=C<0,z=C>=0&&C<=gb;return m.jsxs("tr",{className:yi("border-b border-gray-50 transition-opacity duration-300",u.has(T.id)&&"opacity-0"),children:[m.jsx("td",{className:yi("border-l-4 px-5 py-3",_?"border-l-red-400":z?"border-l-amber-300":"border-l-transparent"),children:m.jsx("span",{className:yi("font-medium",_?"text-red-600":"text-gray-800"),children:T.name})}),m.jsxs("td",{className:"px-5 py-3 text-gray-600",children:[T.count," ",T.unit]}),m.jsxs("td",{className:"px-5 py-3",children:[m.jsx("span",{className:yi(_?"text-red-500":z?"text-amber-600":"text-gray-600"),children:T.expiryDate}),m.jsxs("span",{className:"ml-2 text-xs text-gray-400",children:["(",ly(C),")"]})]}),m.jsx("td",{className:"px-5 py-3 text-gray-600",children:T.location}),m.jsx("td",{className:"px-5 py-3 text-right",children:m.jsx("button",{type:"button",onClick:()=>A(T.id),className:"text-xs text-gray-400 transition-colors hover:text-red-500",children:"删除"})})]},T.id)})})]})})]})]})]})]})},N4=()=>{const{pathname:n}=on();return j.useEffect(()=>{window.scrollTo(0,0)},[n]),null};J1.createRoot(document.getElementById("root")).render(m.jsx(j.StrictMode,{children:m.jsxs(bS,{children:[m.jsx(N4,{}),m.jsxs(J2,{children:[m.jsx(Rl,{path:"/",element:m.jsx(x4,{})}),m.jsx(Rl,{path:"/toolbox",element:m.jsx(v4,{})}),m.jsx(Rl,{path:"/toolbox/inventory",element:m.jsx(C4,{})}),m.jsx(Rl,{path:"/toolbox/:title",element:m.jsx(S4,{})})]})]})}));
