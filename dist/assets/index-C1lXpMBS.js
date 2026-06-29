(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))r(c);new MutationObserver(c=>{for(const d of c)if(d.type==="childList")for(const f of d.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&r(f)}).observe(document,{childList:!0,subtree:!0});function s(c){const d={};return c.integrity&&(d.integrity=c.integrity),c.referrerPolicy&&(d.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?d.credentials="include":c.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function r(c){if(c.ep)return;c.ep=!0;const d=s(c);fetch(c.href,d)}})();var Ku={exports:{}},fl={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Np;function Sv(){if(Np)return fl;Np=1;var a=Symbol.for("react.transitional.element"),l=Symbol.for("react.fragment");function s(r,c,d){var f=null;if(d!==void 0&&(f=""+d),c.key!==void 0&&(f=""+c.key),"key"in c){d={};for(var m in c)m!=="key"&&(d[m]=c[m])}else d=c;return c=d.ref,{$$typeof:a,type:r,key:f,ref:c!==void 0?c:null,props:d}}return fl.Fragment=l,fl.jsx=s,fl.jsxs=s,fl}var Dp;function Tv(){return Dp||(Dp=1,Ku.exports=Sv()),Ku.exports}var p=Tv(),Ju={exports:{}},ut={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var zp;function jv(){if(zp)return ut;zp=1;var a=Symbol.for("react.transitional.element"),l=Symbol.for("react.portal"),s=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),c=Symbol.for("react.profiler"),d=Symbol.for("react.consumer"),f=Symbol.for("react.context"),m=Symbol.for("react.forward_ref"),y=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),x=Symbol.for("react.lazy"),v=Symbol.for("react.activity"),S=Symbol.iterator;function j(A){return A===null||typeof A!="object"?null:(A=S&&A[S]||A["@@iterator"],typeof A=="function"?A:null)}var M={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},V=Object.assign,N={};function _(A,H,K){this.props=A,this.context=H,this.refs=N,this.updater=K||M}_.prototype.isReactComponent={},_.prototype.setState=function(A,H){if(typeof A!="object"&&typeof A!="function"&&A!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,A,H,"setState")},_.prototype.forceUpdate=function(A){this.updater.enqueueForceUpdate(this,A,"forceUpdate")};function X(){}X.prototype=_.prototype;function B(A,H,K){this.props=A,this.context=H,this.refs=N,this.updater=K||M}var Y=B.prototype=new X;Y.constructor=B,V(Y,_.prototype),Y.isPureReactComponent=!0;var J=Array.isArray;function it(){}var q={H:null,A:null,T:null,S:null},Z=Object.prototype.hasOwnProperty;function nt(A,H,K){var W=K.ref;return{$$typeof:a,type:A,key:H,ref:W!==void 0?W:null,props:K}}function I(A,H){return nt(A.type,H,A.props)}function et(A){return typeof A=="object"&&A!==null&&A.$$typeof===a}function ft(A){var H={"=":"=0",":":"=2"};return"$"+A.replace(/[=:]/g,function(K){return H[K]})}var st=/\/+/g;function mt(A,H){return typeof A=="object"&&A!==null&&A.key!=null?ft(""+A.key):H.toString(36)}function vt(A){switch(A.status){case"fulfilled":return A.value;case"rejected":throw A.reason;default:switch(typeof A.status=="string"?A.then(it,it):(A.status="pending",A.then(function(H){A.status==="pending"&&(A.status="fulfilled",A.value=H)},function(H){A.status==="pending"&&(A.status="rejected",A.reason=H)})),A.status){case"fulfilled":return A.value;case"rejected":throw A.reason}}throw A}function O(A,H,K,W,rt){var pt=typeof A;(pt==="undefined"||pt==="boolean")&&(A=null);var Mt=!1;if(A===null)Mt=!0;else switch(pt){case"bigint":case"string":case"number":Mt=!0;break;case"object":switch(A.$$typeof){case a:case l:Mt=!0;break;case x:return Mt=A._init,O(Mt(A._payload),H,K,W,rt)}}if(Mt)return rt=rt(A),Mt=W===""?"."+mt(A,0):W,J(rt)?(K="",Mt!=null&&(K=Mt.replace(st,"$&/")+"/"),O(rt,H,K,"",function(bi){return bi})):rt!=null&&(et(rt)&&(rt=I(rt,K+(rt.key==null||A&&A.key===rt.key?"":(""+rt.key).replace(st,"$&/")+"/")+Mt)),H.push(rt)),1;Mt=0;var oe=W===""?".":W+":";if(J(A))for(var Gt=0;Gt<A.length;Gt++)W=A[Gt],pt=oe+mt(W,Gt),Mt+=O(W,H,K,pt,rt);else if(Gt=j(A),typeof Gt=="function")for(A=Gt.call(A),Gt=0;!(W=A.next()).done;)W=W.value,pt=oe+mt(W,Gt++),Mt+=O(W,H,K,pt,rt);else if(pt==="object"){if(typeof A.then=="function")return O(vt(A),H,K,W,rt);throw H=String(A),Error("Objects are not valid as a React child (found: "+(H==="[object Object]"?"object with keys {"+Object.keys(A).join(", ")+"}":H)+"). If you meant to render a collection of children, use an array instead.")}return Mt}function Q(A,H,K){if(A==null)return A;var W=[],rt=0;return O(A,W,"","",function(pt){return H.call(K,pt,rt++)}),W}function F(A){if(A._status===-1){var H=A._result;H=H(),H.then(function(K){(A._status===0||A._status===-1)&&(A._status=1,A._result=K)},function(K){(A._status===0||A._status===-1)&&(A._status=2,A._result=K)}),A._status===-1&&(A._status=0,A._result=H)}if(A._status===1)return A._result.default;throw A._result}var ot=typeof reportError=="function"?reportError:function(A){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var H=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof A=="object"&&A!==null&&typeof A.message=="string"?String(A.message):String(A),error:A});if(!window.dispatchEvent(H))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",A);return}console.error(A)},ht={map:Q,forEach:function(A,H,K){Q(A,function(){H.apply(this,arguments)},K)},count:function(A){var H=0;return Q(A,function(){H++}),H},toArray:function(A){return Q(A,function(H){return H})||[]},only:function(A){if(!et(A))throw Error("React.Children.only expected to receive a single React element child.");return A}};return ut.Activity=v,ut.Children=ht,ut.Component=_,ut.Fragment=s,ut.Profiler=c,ut.PureComponent=B,ut.StrictMode=r,ut.Suspense=y,ut.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=q,ut.__COMPILER_RUNTIME={__proto__:null,c:function(A){return q.H.useMemoCache(A)}},ut.cache=function(A){return function(){return A.apply(null,arguments)}},ut.cacheSignal=function(){return null},ut.cloneElement=function(A,H,K){if(A==null)throw Error("The argument must be a React element, but you passed "+A+".");var W=V({},A.props),rt=A.key;if(H!=null)for(pt in H.key!==void 0&&(rt=""+H.key),H)!Z.call(H,pt)||pt==="key"||pt==="__self"||pt==="__source"||pt==="ref"&&H.ref===void 0||(W[pt]=H[pt]);var pt=arguments.length-2;if(pt===1)W.children=K;else if(1<pt){for(var Mt=Array(pt),oe=0;oe<pt;oe++)Mt[oe]=arguments[oe+2];W.children=Mt}return nt(A.type,rt,W)},ut.createContext=function(A){return A={$$typeof:f,_currentValue:A,_currentValue2:A,_threadCount:0,Provider:null,Consumer:null},A.Provider=A,A.Consumer={$$typeof:d,_context:A},A},ut.createElement=function(A,H,K){var W,rt={},pt=null;if(H!=null)for(W in H.key!==void 0&&(pt=""+H.key),H)Z.call(H,W)&&W!=="key"&&W!=="__self"&&W!=="__source"&&(rt[W]=H[W]);var Mt=arguments.length-2;if(Mt===1)rt.children=K;else if(1<Mt){for(var oe=Array(Mt),Gt=0;Gt<Mt;Gt++)oe[Gt]=arguments[Gt+2];rt.children=oe}if(A&&A.defaultProps)for(W in Mt=A.defaultProps,Mt)rt[W]===void 0&&(rt[W]=Mt[W]);return nt(A,pt,rt)},ut.createRef=function(){return{current:null}},ut.forwardRef=function(A){return{$$typeof:m,render:A}},ut.isValidElement=et,ut.lazy=function(A){return{$$typeof:x,_payload:{_status:-1,_result:A},_init:F}},ut.memo=function(A,H){return{$$typeof:g,type:A,compare:H===void 0?null:H}},ut.startTransition=function(A){var H=q.T,K={};q.T=K;try{var W=A(),rt=q.S;rt!==null&&rt(K,W),typeof W=="object"&&W!==null&&typeof W.then=="function"&&W.then(it,ot)}catch(pt){ot(pt)}finally{H!==null&&K.types!==null&&(H.types=K.types),q.T=H}},ut.unstable_useCacheRefresh=function(){return q.H.useCacheRefresh()},ut.use=function(A){return q.H.use(A)},ut.useActionState=function(A,H,K){return q.H.useActionState(A,H,K)},ut.useCallback=function(A,H){return q.H.useCallback(A,H)},ut.useContext=function(A){return q.H.useContext(A)},ut.useDebugValue=function(){},ut.useDeferredValue=function(A,H){return q.H.useDeferredValue(A,H)},ut.useEffect=function(A,H){return q.H.useEffect(A,H)},ut.useEffectEvent=function(A){return q.H.useEffectEvent(A)},ut.useId=function(){return q.H.useId()},ut.useImperativeHandle=function(A,H,K){return q.H.useImperativeHandle(A,H,K)},ut.useInsertionEffect=function(A,H){return q.H.useInsertionEffect(A,H)},ut.useLayoutEffect=function(A,H){return q.H.useLayoutEffect(A,H)},ut.useMemo=function(A,H){return q.H.useMemo(A,H)},ut.useOptimistic=function(A,H){return q.H.useOptimistic(A,H)},ut.useReducer=function(A,H,K){return q.H.useReducer(A,H,K)},ut.useRef=function(A){return q.H.useRef(A)},ut.useState=function(A){return q.H.useState(A)},ut.useSyncExternalStore=function(A,H,K){return q.H.useSyncExternalStore(A,H,K)},ut.useTransition=function(){return q.H.useTransition()},ut.version="19.2.7",ut}var Rp;function Jc(){return Rp||(Rp=1,Ju.exports=jv()),Ju.exports}var C=Jc(),Fu={exports:{}},dl={},Wu={exports:{}},Pu={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Op;function Av(){return Op||(Op=1,(function(a){function l(O,Q){var F=O.length;O.push(Q);t:for(;0<F;){var ot=F-1>>>1,ht=O[ot];if(0<c(ht,Q))O[ot]=Q,O[F]=ht,F=ot;else break t}}function s(O){return O.length===0?null:O[0]}function r(O){if(O.length===0)return null;var Q=O[0],F=O.pop();if(F!==Q){O[0]=F;t:for(var ot=0,ht=O.length,A=ht>>>1;ot<A;){var H=2*(ot+1)-1,K=O[H],W=H+1,rt=O[W];if(0>c(K,F))W<ht&&0>c(rt,K)?(O[ot]=rt,O[W]=F,ot=W):(O[ot]=K,O[H]=F,ot=H);else if(W<ht&&0>c(rt,F))O[ot]=rt,O[W]=F,ot=W;else break t}}return Q}function c(O,Q){var F=O.sortIndex-Q.sortIndex;return F!==0?F:O.id-Q.id}if(a.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var d=performance;a.unstable_now=function(){return d.now()}}else{var f=Date,m=f.now();a.unstable_now=function(){return f.now()-m}}var y=[],g=[],x=1,v=null,S=3,j=!1,M=!1,V=!1,N=!1,_=typeof setTimeout=="function"?setTimeout:null,X=typeof clearTimeout=="function"?clearTimeout:null,B=typeof setImmediate<"u"?setImmediate:null;function Y(O){for(var Q=s(g);Q!==null;){if(Q.callback===null)r(g);else if(Q.startTime<=O)r(g),Q.sortIndex=Q.expirationTime,l(y,Q);else break;Q=s(g)}}function J(O){if(V=!1,Y(O),!M)if(s(y)!==null)M=!0,it||(it=!0,ft());else{var Q=s(g);Q!==null&&vt(J,Q.startTime-O)}}var it=!1,q=-1,Z=5,nt=-1;function I(){return N?!0:!(a.unstable_now()-nt<Z)}function et(){if(N=!1,it){var O=a.unstable_now();nt=O;var Q=!0;try{t:{M=!1,V&&(V=!1,X(q),q=-1),j=!0;var F=S;try{e:{for(Y(O),v=s(y);v!==null&&!(v.expirationTime>O&&I());){var ot=v.callback;if(typeof ot=="function"){v.callback=null,S=v.priorityLevel;var ht=ot(v.expirationTime<=O);if(O=a.unstable_now(),typeof ht=="function"){v.callback=ht,Y(O),Q=!0;break e}v===s(y)&&r(y),Y(O)}else r(y);v=s(y)}if(v!==null)Q=!0;else{var A=s(g);A!==null&&vt(J,A.startTime-O),Q=!1}}break t}finally{v=null,S=F,j=!1}Q=void 0}}finally{Q?ft():it=!1}}}var ft;if(typeof B=="function")ft=function(){B(et)};else if(typeof MessageChannel<"u"){var st=new MessageChannel,mt=st.port2;st.port1.onmessage=et,ft=function(){mt.postMessage(null)}}else ft=function(){_(et,0)};function vt(O,Q){q=_(function(){O(a.unstable_now())},Q)}a.unstable_IdlePriority=5,a.unstable_ImmediatePriority=1,a.unstable_LowPriority=4,a.unstable_NormalPriority=3,a.unstable_Profiling=null,a.unstable_UserBlockingPriority=2,a.unstable_cancelCallback=function(O){O.callback=null},a.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Z=0<O?Math.floor(1e3/O):5},a.unstable_getCurrentPriorityLevel=function(){return S},a.unstable_next=function(O){switch(S){case 1:case 2:case 3:var Q=3;break;default:Q=S}var F=S;S=Q;try{return O()}finally{S=F}},a.unstable_requestPaint=function(){N=!0},a.unstable_runWithPriority=function(O,Q){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var F=S;S=O;try{return Q()}finally{S=F}},a.unstable_scheduleCallback=function(O,Q,F){var ot=a.unstable_now();switch(typeof F=="object"&&F!==null?(F=F.delay,F=typeof F=="number"&&0<F?ot+F:ot):F=ot,O){case 1:var ht=-1;break;case 2:ht=250;break;case 5:ht=1073741823;break;case 4:ht=1e4;break;default:ht=5e3}return ht=F+ht,O={id:x++,callback:Q,priorityLevel:O,startTime:F,expirationTime:ht,sortIndex:-1},F>ot?(O.sortIndex=F,l(g,O),s(y)===null&&O===s(g)&&(V?(X(q),q=-1):V=!0,vt(J,F-ot))):(O.sortIndex=ht,l(y,O),M||j||(M=!0,it||(it=!0,ft()))),O},a.unstable_shouldYield=I,a.unstable_wrapCallback=function(O){var Q=S;return function(){var F=S;S=Q;try{return O.apply(this,arguments)}finally{S=F}}}})(Pu)),Pu}var Vp;function Ev(){return Vp||(Vp=1,Wu.exports=Av()),Wu.exports}var $u={exports:{}},se={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var kp;function Mv(){if(kp)return se;kp=1;var a=Jc();function l(y){var g="https://react.dev/errors/"+y;if(1<arguments.length){g+="?args[]="+encodeURIComponent(arguments[1]);for(var x=2;x<arguments.length;x++)g+="&args[]="+encodeURIComponent(arguments[x])}return"Minified React error #"+y+"; visit "+g+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function s(){}var r={d:{f:s,r:function(){throw Error(l(522))},D:s,C:s,L:s,m:s,X:s,S:s,M:s},p:0,findDOMNode:null},c=Symbol.for("react.portal");function d(y,g,x){var v=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:c,key:v==null?null:""+v,children:y,containerInfo:g,implementation:x}}var f=a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function m(y,g){if(y==="font")return"";if(typeof g=="string")return g==="use-credentials"?g:""}return se.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,se.createPortal=function(y,g){var x=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!g||g.nodeType!==1&&g.nodeType!==9&&g.nodeType!==11)throw Error(l(299));return d(y,g,null,x)},se.flushSync=function(y){var g=f.T,x=r.p;try{if(f.T=null,r.p=2,y)return y()}finally{f.T=g,r.p=x,r.d.f()}},se.preconnect=function(y,g){typeof y=="string"&&(g?(g=g.crossOrigin,g=typeof g=="string"?g==="use-credentials"?g:"":void 0):g=null,r.d.C(y,g))},se.prefetchDNS=function(y){typeof y=="string"&&r.d.D(y)},se.preinit=function(y,g){if(typeof y=="string"&&g&&typeof g.as=="string"){var x=g.as,v=m(x,g.crossOrigin),S=typeof g.integrity=="string"?g.integrity:void 0,j=typeof g.fetchPriority=="string"?g.fetchPriority:void 0;x==="style"?r.d.S(y,typeof g.precedence=="string"?g.precedence:void 0,{crossOrigin:v,integrity:S,fetchPriority:j}):x==="script"&&r.d.X(y,{crossOrigin:v,integrity:S,fetchPriority:j,nonce:typeof g.nonce=="string"?g.nonce:void 0})}},se.preinitModule=function(y,g){if(typeof y=="string")if(typeof g=="object"&&g!==null){if(g.as==null||g.as==="script"){var x=m(g.as,g.crossOrigin);r.d.M(y,{crossOrigin:x,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0})}}else g==null&&r.d.M(y)},se.preload=function(y,g){if(typeof y=="string"&&typeof g=="object"&&g!==null&&typeof g.as=="string"){var x=g.as,v=m(x,g.crossOrigin);r.d.L(y,x,{crossOrigin:v,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,type:typeof g.type=="string"?g.type:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0,referrerPolicy:typeof g.referrerPolicy=="string"?g.referrerPolicy:void 0,imageSrcSet:typeof g.imageSrcSet=="string"?g.imageSrcSet:void 0,imageSizes:typeof g.imageSizes=="string"?g.imageSizes:void 0,media:typeof g.media=="string"?g.media:void 0})}},se.preloadModule=function(y,g){if(typeof y=="string")if(g){var x=m(g.as,g.crossOrigin);r.d.m(y,{as:typeof g.as=="string"&&g.as!=="script"?g.as:void 0,crossOrigin:x,integrity:typeof g.integrity=="string"?g.integrity:void 0})}else r.d.m(y)},se.requestFormReset=function(y){r.d.r(y)},se.unstable_batchedUpdates=function(y,g){return y(g)},se.useFormState=function(y,g,x){return f.H.useFormState(y,g,x)},se.useFormStatus=function(){return f.H.useHostTransitionStatus()},se.version="19.2.7",se}var Bp;function wv(){if(Bp)return $u.exports;Bp=1;function a(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)}catch(l){console.error(l)}}return a(),$u.exports=Mv(),$u.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _p;function Cv(){if(_p)return dl;_p=1;var a=Ev(),l=Jc(),s=wv();function r(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function c(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function d(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,(e.flags&4098)!==0&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function f(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function m(t){if(t.tag===31){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function y(t){if(d(t)!==t)throw Error(r(188))}function g(t){var e=t.alternate;if(!e){if(e=d(t),e===null)throw Error(r(188));return e!==t?null:t}for(var n=t,i=e;;){var o=n.return;if(o===null)break;var u=o.alternate;if(u===null){if(i=o.return,i!==null){n=i;continue}break}if(o.child===u.child){for(u=o.child;u;){if(u===n)return y(o),t;if(u===i)return y(o),e;u=u.sibling}throw Error(r(188))}if(n.return!==i.return)n=o,i=u;else{for(var h=!1,b=o.child;b;){if(b===n){h=!0,n=o,i=u;break}if(b===i){h=!0,i=o,n=u;break}b=b.sibling}if(!h){for(b=u.child;b;){if(b===n){h=!0,n=u,i=o;break}if(b===i){h=!0,i=u,n=o;break}b=b.sibling}if(!h)throw Error(r(189))}}if(n.alternate!==i)throw Error(r(190))}if(n.tag!==3)throw Error(r(188));return n.stateNode.current===n?t:e}function x(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t;for(t=t.child;t!==null;){if(e=x(t),e!==null)return e;t=t.sibling}return null}var v=Object.assign,S=Symbol.for("react.element"),j=Symbol.for("react.transitional.element"),M=Symbol.for("react.portal"),V=Symbol.for("react.fragment"),N=Symbol.for("react.strict_mode"),_=Symbol.for("react.profiler"),X=Symbol.for("react.consumer"),B=Symbol.for("react.context"),Y=Symbol.for("react.forward_ref"),J=Symbol.for("react.suspense"),it=Symbol.for("react.suspense_list"),q=Symbol.for("react.memo"),Z=Symbol.for("react.lazy"),nt=Symbol.for("react.activity"),I=Symbol.for("react.memo_cache_sentinel"),et=Symbol.iterator;function ft(t){return t===null||typeof t!="object"?null:(t=et&&t[et]||t["@@iterator"],typeof t=="function"?t:null)}var st=Symbol.for("react.client.reference");function mt(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===st?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case V:return"Fragment";case _:return"Profiler";case N:return"StrictMode";case J:return"Suspense";case it:return"SuspenseList";case nt:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case M:return"Portal";case B:return t.displayName||"Context";case X:return(t._context.displayName||"Context")+".Consumer";case Y:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case q:return e=t.displayName||null,e!==null?e:mt(t.type)||"Memo";case Z:e=t._payload,t=t._init;try{return mt(t(e))}catch{}}return null}var vt=Array.isArray,O=l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Q=s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,F={pending:!1,data:null,method:null,action:null},ot=[],ht=-1;function A(t){return{current:t}}function H(t){0>ht||(t.current=ot[ht],ot[ht]=null,ht--)}function K(t,e){ht++,ot[ht]=t.current,t.current=e}var W=A(null),rt=A(null),pt=A(null),Mt=A(null);function oe(t,e){switch(K(pt,e),K(rt,t),K(W,null),e.nodeType){case 9:case 11:t=(t=e.documentElement)&&(t=t.namespaceURI)?$m(t):0;break;default:if(t=e.tagName,e=e.namespaceURI)e=$m(e),t=Im(e,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}H(W),K(W,t)}function Gt(){H(W),H(rt),H(pt)}function bi(t){t.memoizedState!==null&&K(Mt,t);var e=W.current,n=Im(e,t.type);e!==n&&(K(rt,t),K(W,n))}function Rl(t){rt.current===t&&(H(W),H(rt)),Mt.current===t&&(H(Mt),ol._currentValue=F)}var No,Cf;function In(t){if(No===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);No=e&&e[1]||"",Cf=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+No+t+Cf}var Do=!1;function zo(t,e){if(!t||Do)return"";Do=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var i={DetermineComponentFrameRoot:function(){try{if(e){var G=function(){throw Error()};if(Object.defineProperty(G.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(G,[])}catch(k){var R=k}Reflect.construct(t,[],G)}else{try{G.call()}catch(k){R=k}t.call(G.prototype)}}else{try{throw Error()}catch(k){R=k}(G=t())&&typeof G.catch=="function"&&G.catch(function(){})}}catch(k){if(k&&R&&typeof k.stack=="string")return[k.stack,R.stack]}return[null,null]}};i.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var o=Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot,"name");o&&o.configurable&&Object.defineProperty(i.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var u=i.DetermineComponentFrameRoot(),h=u[0],b=u[1];if(h&&b){var T=h.split(`
`),z=b.split(`
`);for(o=i=0;i<T.length&&!T[i].includes("DetermineComponentFrameRoot");)i++;for(;o<z.length&&!z[o].includes("DetermineComponentFrameRoot");)o++;if(i===T.length||o===z.length)for(i=T.length-1,o=z.length-1;1<=i&&0<=o&&T[i]!==z[o];)o--;for(;1<=i&&0<=o;i--,o--)if(T[i]!==z[o]){if(i!==1||o!==1)do if(i--,o--,0>o||T[i]!==z[o]){var U=`
`+T[i].replace(" at new "," at ");return t.displayName&&U.includes("<anonymous>")&&(U=U.replace("<anonymous>",t.displayName)),U}while(1<=i&&0<=o);break}}}finally{Do=!1,Error.prepareStackTrace=n}return(n=t?t.displayName||t.name:"")?In(n):""}function $y(t,e){switch(t.tag){case 26:case 27:case 5:return In(t.type);case 16:return In("Lazy");case 13:return t.child!==e&&e!==null?In("Suspense Fallback"):In("Suspense");case 19:return In("SuspenseList");case 0:case 15:return zo(t.type,!1);case 11:return zo(t.type.render,!1);case 1:return zo(t.type,!0);case 31:return In("Activity");default:return""}}function Nf(t){try{var e="",n=null;do e+=$y(t,n),n=t,t=t.return;while(t);return e}catch(i){return`
Error generating stack: `+i.message+`
`+i.stack}}var Ro=Object.prototype.hasOwnProperty,Oo=a.unstable_scheduleCallback,Vo=a.unstable_cancelCallback,Iy=a.unstable_shouldYield,tb=a.unstable_requestPaint,be=a.unstable_now,eb=a.unstable_getCurrentPriorityLevel,Df=a.unstable_ImmediatePriority,zf=a.unstable_UserBlockingPriority,Ol=a.unstable_NormalPriority,nb=a.unstable_LowPriority,Rf=a.unstable_IdlePriority,ab=a.log,ib=a.unstable_setDisableYieldValue,xi=null,xe=null;function Tn(t){if(typeof ab=="function"&&ib(t),xe&&typeof xe.setStrictMode=="function")try{xe.setStrictMode(xi,t)}catch{}}var ve=Math.clz32?Math.clz32:ob,lb=Math.log,sb=Math.LN2;function ob(t){return t>>>=0,t===0?32:31-(lb(t)/sb|0)|0}var Vl=256,kl=262144,Bl=4194304;function ta(t){var e=t&42;if(e!==0)return e;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function _l(t,e,n){var i=t.pendingLanes;if(i===0)return 0;var o=0,u=t.suspendedLanes,h=t.pingedLanes;t=t.warmLanes;var b=i&134217727;return b!==0?(i=b&~u,i!==0?o=ta(i):(h&=b,h!==0?o=ta(h):n||(n=b&~t,n!==0&&(o=ta(n))))):(b=i&~u,b!==0?o=ta(b):h!==0?o=ta(h):n||(n=i&~t,n!==0&&(o=ta(n)))),o===0?0:e!==0&&e!==o&&(e&u)===0&&(u=o&-o,n=e&-e,u>=n||u===32&&(n&4194048)!==0)?e:o}function vi(t,e){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&e)===0}function rb(t,e){switch(t){case 1:case 2:case 4:case 8:case 64:return e+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Of(){var t=Bl;return Bl<<=1,(Bl&62914560)===0&&(Bl=4194304),t}function ko(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Si(t,e){t.pendingLanes|=e,e!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function ub(t,e,n,i,o,u){var h=t.pendingLanes;t.pendingLanes=n,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=n,t.entangledLanes&=n,t.errorRecoveryDisabledLanes&=n,t.shellSuspendCounter=0;var b=t.entanglements,T=t.expirationTimes,z=t.hiddenUpdates;for(n=h&~n;0<n;){var U=31-ve(n),G=1<<U;b[U]=0,T[U]=-1;var R=z[U];if(R!==null)for(z[U]=null,U=0;U<R.length;U++){var k=R[U];k!==null&&(k.lane&=-536870913)}n&=~G}i!==0&&Vf(t,i,0),u!==0&&o===0&&t.tag!==0&&(t.suspendedLanes|=u&~(h&~e))}function Vf(t,e,n){t.pendingLanes|=e,t.suspendedLanes&=~e;var i=31-ve(e);t.entangledLanes|=e,t.entanglements[i]=t.entanglements[i]|1073741824|n&261930}function kf(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-ve(n),o=1<<i;o&e|t[i]&e&&(t[i]|=e),n&=~o}}function Bf(t,e){var n=e&-e;return n=(n&42)!==0?1:Bo(n),(n&(t.suspendedLanes|e))!==0?0:n}function Bo(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function _o(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function _f(){var t=Q.p;return t!==0?t:(t=window.event,t===void 0?32:Tp(t.type))}function Uf(t,e){var n=Q.p;try{return Q.p=t,e()}finally{Q.p=n}}var jn=Math.random().toString(36).slice(2),It="__reactFiber$"+jn,fe="__reactProps$"+jn,Ea="__reactContainer$"+jn,Uo="__reactEvents$"+jn,cb="__reactListeners$"+jn,fb="__reactHandles$"+jn,Lf="__reactResources$"+jn,Ti="__reactMarker$"+jn;function Lo(t){delete t[It],delete t[fe],delete t[Uo],delete t[cb],delete t[fb]}function Ma(t){var e=t[It];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Ea]||n[It]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=sp(t);t!==null;){if(n=t[It])return n;t=sp(t)}return e}t=n,n=t.parentNode}return null}function wa(t){if(t=t[It]||t[Ea]){var e=t.tag;if(e===5||e===6||e===13||e===31||e===26||e===27||e===3)return t}return null}function ji(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t.stateNode;throw Error(r(33))}function Ca(t){var e=t[Lf];return e||(e=t[Lf]={hoistableStyles:new Map,hoistableScripts:new Map}),e}function Pt(t){t[Ti]=!0}var Hf=new Set,Gf={};function ea(t,e){Na(t,e),Na(t+"Capture",e)}function Na(t,e){for(Gf[t]=e,t=0;t<e.length;t++)Hf.add(e[t])}var db=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Yf={},qf={};function hb(t){return Ro.call(qf,t)?!0:Ro.call(Yf,t)?!1:db.test(t)?qf[t]=!0:(Yf[t]=!0,!1)}function Ul(t,e,n){if(hb(e))if(n===null)t.removeAttribute(e);else{switch(typeof n){case"undefined":case"function":case"symbol":t.removeAttribute(e);return;case"boolean":var i=e.toLowerCase().slice(0,5);if(i!=="data-"&&i!=="aria-"){t.removeAttribute(e);return}}t.setAttribute(e,""+n)}}function Ll(t,e,n){if(n===null)t.removeAttribute(e);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(e);return}t.setAttribute(e,""+n)}}function nn(t,e,n,i){if(i===null)t.removeAttribute(n);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttributeNS(e,n,""+i)}}function Ne(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Xf(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function mb(t,e,n){var i=Object.getOwnPropertyDescriptor(t.constructor.prototype,e);if(!t.hasOwnProperty(e)&&typeof i<"u"&&typeof i.get=="function"&&typeof i.set=="function"){var o=i.get,u=i.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return o.call(this)},set:function(h){n=""+h,u.call(this,h)}}),Object.defineProperty(t,e,{enumerable:i.enumerable}),{getValue:function(){return n},setValue:function(h){n=""+h},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Ho(t){if(!t._valueTracker){var e=Xf(t)?"checked":"value";t._valueTracker=mb(t,e,""+t[e])}}function Qf(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=Xf(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Hl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var pb=/[\n"\\]/g;function De(t){return t.replace(pb,function(e){return"\\"+e.charCodeAt(0).toString(16)+" "})}function Go(t,e,n,i,o,u,h,b){t.name="",h!=null&&typeof h!="function"&&typeof h!="symbol"&&typeof h!="boolean"?t.type=h:t.removeAttribute("type"),e!=null?h==="number"?(e===0&&t.value===""||t.value!=e)&&(t.value=""+Ne(e)):t.value!==""+Ne(e)&&(t.value=""+Ne(e)):h!=="submit"&&h!=="reset"||t.removeAttribute("value"),e!=null?Yo(t,h,Ne(e)):n!=null?Yo(t,h,Ne(n)):i!=null&&t.removeAttribute("value"),o==null&&u!=null&&(t.defaultChecked=!!u),o!=null&&(t.checked=o&&typeof o!="function"&&typeof o!="symbol"),b!=null&&typeof b!="function"&&typeof b!="symbol"&&typeof b!="boolean"?t.name=""+Ne(b):t.removeAttribute("name")}function Zf(t,e,n,i,o,u,h,b){if(u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"&&(t.type=u),e!=null||n!=null){if(!(u!=="submit"&&u!=="reset"||e!=null)){Ho(t);return}n=n!=null?""+Ne(n):"",e=e!=null?""+Ne(e):n,b||e===t.value||(t.value=e),t.defaultValue=e}i=i??o,i=typeof i!="function"&&typeof i!="symbol"&&!!i,t.checked=b?t.checked:!!i,t.defaultChecked=!!i,h!=null&&typeof h!="function"&&typeof h!="symbol"&&typeof h!="boolean"&&(t.name=h),Ho(t)}function Yo(t,e,n){e==="number"&&Hl(t.ownerDocument)===t||t.defaultValue===""+n||(t.defaultValue=""+n)}function Da(t,e,n,i){if(t=t.options,e){e={};for(var o=0;o<n.length;o++)e["$"+n[o]]=!0;for(n=0;n<t.length;n++)o=e.hasOwnProperty("$"+t[n].value),t[n].selected!==o&&(t[n].selected=o),o&&i&&(t[n].defaultSelected=!0)}else{for(n=""+Ne(n),e=null,o=0;o<t.length;o++){if(t[o].value===n){t[o].selected=!0,i&&(t[o].defaultSelected=!0);return}e!==null||t[o].disabled||(e=t[o])}e!==null&&(e.selected=!0)}}function Kf(t,e,n){if(e!=null&&(e=""+Ne(e),e!==t.value&&(t.value=e),n==null)){t.defaultValue!==e&&(t.defaultValue=e);return}t.defaultValue=n!=null?""+Ne(n):""}function Jf(t,e,n,i){if(e==null){if(i!=null){if(n!=null)throw Error(r(92));if(vt(i)){if(1<i.length)throw Error(r(93));i=i[0]}n=i}n==null&&(n=""),e=n}n=Ne(e),t.defaultValue=n,i=t.textContent,i===n&&i!==""&&i!==null&&(t.value=i),Ho(t)}function za(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var gb=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Ff(t,e,n){var i=e.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?i?t.setProperty(e,""):e==="float"?t.cssFloat="":t[e]="":i?t.setProperty(e,n):typeof n!="number"||n===0||gb.has(e)?e==="float"?t.cssFloat=n:t[e]=(""+n).trim():t[e]=n+"px"}function Wf(t,e,n){if(e!=null&&typeof e!="object")throw Error(r(62));if(t=t.style,n!=null){for(var i in n)!n.hasOwnProperty(i)||e!=null&&e.hasOwnProperty(i)||(i.indexOf("--")===0?t.setProperty(i,""):i==="float"?t.cssFloat="":t[i]="");for(var o in e)i=e[o],e.hasOwnProperty(o)&&n[o]!==i&&Ff(t,o,i)}else for(var u in e)e.hasOwnProperty(u)&&Ff(t,u,e[u])}function qo(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var yb=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),bb=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Gl(t){return bb.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function an(){}var Xo=null;function Qo(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Ra=null,Oa=null;function Pf(t){var e=wa(t);if(e&&(t=e.stateNode)){var n=t[fe]||null;t:switch(t=e.stateNode,e.type){case"input":if(Go(t,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+De(""+e)+'"][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var o=i[fe]||null;if(!o)throw Error(r(90));Go(i,o.value,o.defaultValue,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name)}}for(e=0;e<n.length;e++)i=n[e],i.form===t.form&&Qf(i)}break t;case"textarea":Kf(t,n.value,n.defaultValue);break t;case"select":e=n.value,e!=null&&Da(t,!!n.multiple,e,!1)}}}var Zo=!1;function $f(t,e,n){if(Zo)return t(e,n);Zo=!0;try{var i=t(e);return i}finally{if(Zo=!1,(Ra!==null||Oa!==null)&&(Cs(),Ra&&(e=Ra,t=Oa,Oa=Ra=null,Pf(e),t)))for(e=0;e<t.length;e++)Pf(t[e])}}function Ai(t,e){var n=t.stateNode;if(n===null)return null;var i=n[fe]||null;if(i===null)return null;n=i[e];t:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break t;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(r(231,e,typeof n));return n}var ln=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ko=!1;if(ln)try{var Ei={};Object.defineProperty(Ei,"passive",{get:function(){Ko=!0}}),window.addEventListener("test",Ei,Ei),window.removeEventListener("test",Ei,Ei)}catch{Ko=!1}var An=null,Jo=null,Yl=null;function If(){if(Yl)return Yl;var t,e=Jo,n=e.length,i,o="value"in An?An.value:An.textContent,u=o.length;for(t=0;t<n&&e[t]===o[t];t++);var h=n-t;for(i=1;i<=h&&e[n-i]===o[u-i];i++);return Yl=o.slice(t,1<i?1-i:void 0)}function ql(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Xl(){return!0}function td(){return!1}function de(t){function e(n,i,o,u,h){this._reactName=n,this._targetInst=o,this.type=i,this.nativeEvent=u,this.target=h,this.currentTarget=null;for(var b in t)t.hasOwnProperty(b)&&(n=t[b],this[b]=n?n(u):u[b]);return this.isDefaultPrevented=(u.defaultPrevented!=null?u.defaultPrevented:u.returnValue===!1)?Xl:td,this.isPropagationStopped=td,this}return v(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Xl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Xl)},persist:function(){},isPersistent:Xl}),e}var na={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ql=de(na),Mi=v({},na,{view:0,detail:0}),xb=de(Mi),Fo,Wo,wi,Zl=v({},Mi,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:$o,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==wi&&(wi&&t.type==="mousemove"?(Fo=t.screenX-wi.screenX,Wo=t.screenY-wi.screenY):Wo=Fo=0,wi=t),Fo)},movementY:function(t){return"movementY"in t?t.movementY:Wo}}),ed=de(Zl),vb=v({},Zl,{dataTransfer:0}),Sb=de(vb),Tb=v({},Mi,{relatedTarget:0}),Po=de(Tb),jb=v({},na,{animationName:0,elapsedTime:0,pseudoElement:0}),Ab=de(jb),Eb=v({},na,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Mb=de(Eb),wb=v({},na,{data:0}),nd=de(wb),Cb={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nb={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Db={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function zb(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=Db[t])?!!e[t]:!1}function $o(){return zb}var Rb=v({},Mi,{key:function(t){if(t.key){var e=Cb[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=ql(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Nb[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:$o,charCode:function(t){return t.type==="keypress"?ql(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?ql(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Ob=de(Rb),Vb=v({},Zl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ad=de(Vb),kb=v({},Mi,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:$o}),Bb=de(kb),_b=v({},na,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ub=de(_b),Lb=v({},Zl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Hb=de(Lb),Gb=v({},na,{newState:0,oldState:0}),Yb=de(Gb),qb=[9,13,27,32],Io=ln&&"CompositionEvent"in window,Ci=null;ln&&"documentMode"in document&&(Ci=document.documentMode);var Xb=ln&&"TextEvent"in window&&!Ci,id=ln&&(!Io||Ci&&8<Ci&&11>=Ci),ld=" ",sd=!1;function od(t,e){switch(t){case"keyup":return qb.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function rd(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Va=!1;function Qb(t,e){switch(t){case"compositionend":return rd(e);case"keypress":return e.which!==32?null:(sd=!0,ld);case"textInput":return t=e.data,t===ld&&sd?null:t;default:return null}}function Zb(t,e){if(Va)return t==="compositionend"||!Io&&od(t,e)?(t=If(),Yl=Jo=An=null,Va=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return id&&e.locale!=="ko"?null:e.data;default:return null}}var Kb={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ud(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!Kb[t.type]:e==="textarea"}function cd(t,e,n,i){Ra?Oa?Oa.push(i):Oa=[i]:Ra=i,e=ks(e,"onChange"),0<e.length&&(n=new Ql("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Ni=null,Di=null;function Jb(t){Zm(t,0)}function Kl(t){var e=ji(t);if(Qf(e))return t}function fd(t,e){if(t==="change")return e}var dd=!1;if(ln){var tr;if(ln){var er="oninput"in document;if(!er){var hd=document.createElement("div");hd.setAttribute("oninput","return;"),er=typeof hd.oninput=="function"}tr=er}else tr=!1;dd=tr&&(!document.documentMode||9<document.documentMode)}function md(){Ni&&(Ni.detachEvent("onpropertychange",pd),Di=Ni=null)}function pd(t){if(t.propertyName==="value"&&Kl(Di)){var e=[];cd(e,Di,t,Qo(t)),$f(Jb,e)}}function Fb(t,e,n){t==="focusin"?(md(),Ni=e,Di=n,Ni.attachEvent("onpropertychange",pd)):t==="focusout"&&md()}function Wb(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Kl(Di)}function Pb(t,e){if(t==="click")return Kl(e)}function $b(t,e){if(t==="input"||t==="change")return Kl(e)}function Ib(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Se=typeof Object.is=="function"?Object.is:Ib;function zi(t,e){if(Se(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var o=n[i];if(!Ro.call(e,o)||!Se(t[o],e[o]))return!1}return!0}function gd(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function yd(t,e){var n=gd(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}t:{for(;n;){if(n.nextSibling){n=n.nextSibling;break t}n=n.parentNode}n=void 0}n=gd(n)}}function bd(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?bd(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function xd(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var e=Hl(t.document);e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Hl(t.document)}return e}function nr(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}var tx=ln&&"documentMode"in document&&11>=document.documentMode,ka=null,ar=null,Ri=null,ir=!1;function vd(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ir||ka==null||ka!==Hl(i)||(i=ka,"selectionStart"in i&&nr(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ri&&zi(Ri,i)||(Ri=i,i=ks(ar,"onSelect"),0<i.length&&(e=new Ql("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=ka)))}function aa(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Ba={animationend:aa("Animation","AnimationEnd"),animationiteration:aa("Animation","AnimationIteration"),animationstart:aa("Animation","AnimationStart"),transitionrun:aa("Transition","TransitionRun"),transitionstart:aa("Transition","TransitionStart"),transitioncancel:aa("Transition","TransitionCancel"),transitionend:aa("Transition","TransitionEnd")},lr={},Sd={};ln&&(Sd=document.createElement("div").style,"AnimationEvent"in window||(delete Ba.animationend.animation,delete Ba.animationiteration.animation,delete Ba.animationstart.animation),"TransitionEvent"in window||delete Ba.transitionend.transition);function ia(t){if(lr[t])return lr[t];if(!Ba[t])return t;var e=Ba[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in Sd)return lr[t]=e[n];return t}var Td=ia("animationend"),jd=ia("animationiteration"),Ad=ia("animationstart"),ex=ia("transitionrun"),nx=ia("transitionstart"),ax=ia("transitioncancel"),Ed=ia("transitionend"),Md=new Map,sr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");sr.push("scrollEnd");function Ge(t,e){Md.set(t,e),ea(e,[t])}var Jl=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},ze=[],_a=0,or=0;function Fl(){for(var t=_a,e=or=_a=0;e<t;){var n=ze[e];ze[e++]=null;var i=ze[e];ze[e++]=null;var o=ze[e];ze[e++]=null;var u=ze[e];if(ze[e++]=null,i!==null&&o!==null){var h=i.pending;h===null?o.next=o:(o.next=h.next,h.next=o),i.pending=o}u!==0&&wd(n,o,u)}}function Wl(t,e,n,i){ze[_a++]=t,ze[_a++]=e,ze[_a++]=n,ze[_a++]=i,or|=i,t.lanes|=i,t=t.alternate,t!==null&&(t.lanes|=i)}function rr(t,e,n,i){return Wl(t,e,n,i),Pl(t)}function la(t,e){return Wl(t,null,null,e),Pl(t)}function wd(t,e,n){t.lanes|=n;var i=t.alternate;i!==null&&(i.lanes|=n);for(var o=!1,u=t.return;u!==null;)u.childLanes|=n,i=u.alternate,i!==null&&(i.childLanes|=n),u.tag===22&&(t=u.stateNode,t===null||t._visibility&1||(o=!0)),t=u,u=u.return;return t.tag===3?(u=t.stateNode,o&&e!==null&&(o=31-ve(n),t=u.hiddenUpdates,i=t[o],i===null?t[o]=[e]:i.push(e),e.lane=n|536870912),u):null}function Pl(t){if(50<tl)throw tl=0,yu=null,Error(r(185));for(var e=t.return;e!==null;)t=e,e=t.return;return t.tag===3?t.stateNode:null}var Ua={};function ix(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Te(t,e,n,i){return new ix(t,e,n,i)}function ur(t){return t=t.prototype,!(!t||!t.isReactComponent)}function sn(t,e){var n=t.alternate;return n===null?(n=Te(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&65011712,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n.refCleanup=t.refCleanup,n}function Cd(t,e){t.flags&=65011714;var n=t.alternate;return n===null?(t.childLanes=0,t.lanes=e,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,t.type=n.type,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t}function $l(t,e,n,i,o,u){var h=0;if(i=t,typeof t=="function")ur(t)&&(h=1);else if(typeof t=="string")h=uv(t,n,W.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(t){case nt:return t=Te(31,n,e,o),t.elementType=nt,t.lanes=u,t;case V:return sa(n.children,o,u,e);case N:h=8,o|=24;break;case _:return t=Te(12,n,e,o|2),t.elementType=_,t.lanes=u,t;case J:return t=Te(13,n,e,o),t.elementType=J,t.lanes=u,t;case it:return t=Te(19,n,e,o),t.elementType=it,t.lanes=u,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case B:h=10;break t;case X:h=9;break t;case Y:h=11;break t;case q:h=14;break t;case Z:h=16,i=null;break t}h=29,n=Error(r(130,t===null?"null":typeof t,"")),i=null}return e=Te(h,n,e,o),e.elementType=t,e.type=i,e.lanes=u,e}function sa(t,e,n,i){return t=Te(7,t,i,e),t.lanes=n,t}function cr(t,e,n){return t=Te(6,t,null,e),t.lanes=n,t}function Nd(t){var e=Te(18,null,null,0);return e.stateNode=t,e}function fr(t,e,n){return e=Te(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}var Dd=new WeakMap;function Re(t,e){if(typeof t=="object"&&t!==null){var n=Dd.get(t);return n!==void 0?n:(e={value:t,source:e,stack:Nf(e)},Dd.set(t,e),e)}return{value:t,source:e,stack:Nf(e)}}var La=[],Ha=0,Il=null,Oi=0,Oe=[],Ve=0,En=null,Ke=1,Je="";function on(t,e){La[Ha++]=Oi,La[Ha++]=Il,Il=t,Oi=e}function zd(t,e,n){Oe[Ve++]=Ke,Oe[Ve++]=Je,Oe[Ve++]=En,En=t;var i=Ke;t=Je;var o=32-ve(i)-1;i&=~(1<<o),n+=1;var u=32-ve(e)+o;if(30<u){var h=o-o%5;u=(i&(1<<h)-1).toString(32),i>>=h,o-=h,Ke=1<<32-ve(e)+o|n<<o|i,Je=u+t}else Ke=1<<u|n<<o|i,Je=t}function dr(t){t.return!==null&&(on(t,1),zd(t,1,0))}function hr(t){for(;t===Il;)Il=La[--Ha],La[Ha]=null,Oi=La[--Ha],La[Ha]=null;for(;t===En;)En=Oe[--Ve],Oe[Ve]=null,Je=Oe[--Ve],Oe[Ve]=null,Ke=Oe[--Ve],Oe[Ve]=null}function Rd(t,e){Oe[Ve++]=Ke,Oe[Ve++]=Je,Oe[Ve++]=En,Ke=e.id,Je=e.overflow,En=t}var te=null,kt=null,St=!1,Mn=null,ke=!1,mr=Error(r(519));function wn(t){var e=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Vi(Re(e,t)),mr}function Od(t){var e=t.stateNode,n=t.type,i=t.memoizedProps;switch(e[It]=t,e[fe]=i,n){case"dialog":yt("cancel",e),yt("close",e);break;case"iframe":case"object":case"embed":yt("load",e);break;case"video":case"audio":for(n=0;n<nl.length;n++)yt(nl[n],e);break;case"source":yt("error",e);break;case"img":case"image":case"link":yt("error",e),yt("load",e);break;case"details":yt("toggle",e);break;case"input":yt("invalid",e),Zf(e,i.value,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name,!0);break;case"select":yt("invalid",e);break;case"textarea":yt("invalid",e),Jf(e,i.value,i.defaultValue,i.children)}n=i.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||e.textContent===""+n||i.suppressHydrationWarning===!0||Wm(e.textContent,n)?(i.popover!=null&&(yt("beforetoggle",e),yt("toggle",e)),i.onScroll!=null&&yt("scroll",e),i.onScrollEnd!=null&&yt("scrollend",e),i.onClick!=null&&(e.onclick=an),e=!0):e=!1,e||wn(t,!0)}function Vd(t){for(te=t.return;te;)switch(te.tag){case 5:case 31:case 13:ke=!1;return;case 27:case 3:ke=!0;return;default:te=te.return}}function Ga(t){if(t!==te)return!1;if(!St)return Vd(t),St=!0,!1;var e=t.tag,n;if((n=e!==3&&e!==27)&&((n=e===5)&&(n=t.type,n=!(n!=="form"&&n!=="button")||Ru(t.type,t.memoizedProps)),n=!n),n&&kt&&wn(t),Vd(t),e===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));kt=lp(t)}else if(e===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));kt=lp(t)}else e===27?(e=kt,Gn(t.type)?(t=_u,_u=null,kt=t):kt=e):kt=te?_e(t.stateNode.nextSibling):null;return!0}function oa(){kt=te=null,St=!1}function pr(){var t=Mn;return t!==null&&(ge===null?ge=t:ge.push.apply(ge,t),Mn=null),t}function Vi(t){Mn===null?Mn=[t]:Mn.push(t)}var gr=A(null),ra=null,rn=null;function Cn(t,e,n){K(gr,e._currentValue),e._currentValue=n}function un(t){t._currentValue=gr.current,H(gr)}function yr(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function br(t,e,n,i){var o=t.child;for(o!==null&&(o.return=t);o!==null;){var u=o.dependencies;if(u!==null){var h=o.child;u=u.firstContext;t:for(;u!==null;){var b=u;u=o;for(var T=0;T<e.length;T++)if(b.context===e[T]){u.lanes|=n,b=u.alternate,b!==null&&(b.lanes|=n),yr(u.return,n,t),i||(h=null);break t}u=b.next}}else if(o.tag===18){if(h=o.return,h===null)throw Error(r(341));h.lanes|=n,u=h.alternate,u!==null&&(u.lanes|=n),yr(h,n,t),h=null}else h=o.child;if(h!==null)h.return=o;else for(h=o;h!==null;){if(h===t){h=null;break}if(o=h.sibling,o!==null){o.return=h.return,h=o;break}h=h.return}o=h}}function Ya(t,e,n,i){t=null;for(var o=e,u=!1;o!==null;){if(!u){if((o.flags&524288)!==0)u=!0;else if((o.flags&262144)!==0)break}if(o.tag===10){var h=o.alternate;if(h===null)throw Error(r(387));if(h=h.memoizedProps,h!==null){var b=o.type;Se(o.pendingProps.value,h.value)||(t!==null?t.push(b):t=[b])}}else if(o===Mt.current){if(h=o.alternate,h===null)throw Error(r(387));h.memoizedState.memoizedState!==o.memoizedState.memoizedState&&(t!==null?t.push(ol):t=[ol])}o=o.return}t!==null&&br(e,t,n,i),e.flags|=262144}function ts(t){for(t=t.firstContext;t!==null;){if(!Se(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function ua(t){ra=t,rn=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function ee(t){return kd(ra,t)}function es(t,e){return ra===null&&ua(t),kd(t,e)}function kd(t,e){var n=e._currentValue;if(e={context:e,memoizedValue:n,next:null},rn===null){if(t===null)throw Error(r(308));rn=e,t.dependencies={lanes:0,firstContext:e},t.flags|=524288}else rn=rn.next=e;return n}var lx=typeof AbortController<"u"?AbortController:function(){var t=[],e=this.signal={aborted:!1,addEventListener:function(n,i){t.push(i)}};this.abort=function(){e.aborted=!0,t.forEach(function(n){return n()})}},sx=a.unstable_scheduleCallback,ox=a.unstable_NormalPriority,Xt={$$typeof:B,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function xr(){return{controller:new lx,data:new Map,refCount:0}}function ki(t){t.refCount--,t.refCount===0&&sx(ox,function(){t.controller.abort()})}var Bi=null,vr=0,qa=0,Xa=null;function rx(t,e){if(Bi===null){var n=Bi=[];vr=0,qa=ju(),Xa={status:"pending",value:void 0,then:function(i){n.push(i)}}}return vr++,e.then(Bd,Bd),e}function Bd(){if(--vr===0&&Bi!==null){Xa!==null&&(Xa.status="fulfilled");var t=Bi;Bi=null,qa=0,Xa=null;for(var e=0;e<t.length;e++)(0,t[e])()}}function ux(t,e){var n=[],i={status:"pending",value:null,reason:null,then:function(o){n.push(o)}};return t.then(function(){i.status="fulfilled",i.value=e;for(var o=0;o<n.length;o++)(0,n[o])(e)},function(o){for(i.status="rejected",i.reason=o,o=0;o<n.length;o++)(0,n[o])(void 0)}),i}var _d=O.S;O.S=function(t,e){vm=be(),typeof e=="object"&&e!==null&&typeof e.then=="function"&&rx(t,e),_d!==null&&_d(t,e)};var ca=A(null);function Sr(){var t=ca.current;return t!==null?t:Rt.pooledCache}function ns(t,e){e===null?K(ca,ca.current):K(ca,e.pool)}function Ud(){var t=Sr();return t===null?null:{parent:Xt._currentValue,pool:t}}var Qa=Error(r(460)),Tr=Error(r(474)),as=Error(r(542)),is={then:function(){}};function Ld(t){return t=t.status,t==="fulfilled"||t==="rejected"}function Hd(t,e,n){switch(n=t[n],n===void 0?t.push(e):n!==e&&(e.then(an,an),e=n),e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,Yd(t),t;default:if(typeof e.status=="string")e.then(an,an);else{if(t=Rt,t!==null&&100<t.shellSuspendCounter)throw Error(r(482));t=e,t.status="pending",t.then(function(i){if(e.status==="pending"){var o=e;o.status="fulfilled",o.value=i}},function(i){if(e.status==="pending"){var o=e;o.status="rejected",o.reason=i}})}switch(e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,Yd(t),t}throw da=e,Qa}}function fa(t){try{var e=t._init;return e(t._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(da=n,Qa):n}}var da=null;function Gd(){if(da===null)throw Error(r(459));var t=da;return da=null,t}function Yd(t){if(t===Qa||t===as)throw Error(r(483))}var Za=null,_i=0;function ls(t){var e=_i;return _i+=1,Za===null&&(Za=[]),Hd(Za,t,e)}function Ui(t,e){e=e.props.ref,t.ref=e!==void 0?e:null}function ss(t,e){throw e.$$typeof===S?Error(r(525)):(t=Object.prototype.toString.call(e),Error(r(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)))}function qd(t){function e(w,E){if(t){var D=w.deletions;D===null?(w.deletions=[E],w.flags|=16):D.push(E)}}function n(w,E){if(!t)return null;for(;E!==null;)e(w,E),E=E.sibling;return null}function i(w){for(var E=new Map;w!==null;)w.key!==null?E.set(w.key,w):E.set(w.index,w),w=w.sibling;return E}function o(w,E){return w=sn(w,E),w.index=0,w.sibling=null,w}function u(w,E,D){return w.index=D,t?(D=w.alternate,D!==null?(D=D.index,D<E?(w.flags|=67108866,E):D):(w.flags|=67108866,E)):(w.flags|=1048576,E)}function h(w){return t&&w.alternate===null&&(w.flags|=67108866),w}function b(w,E,D,L){return E===null||E.tag!==6?(E=cr(D,w.mode,L),E.return=w,E):(E=o(E,D),E.return=w,E)}function T(w,E,D,L){var at=D.type;return at===V?U(w,E,D.props.children,L,D.key):E!==null&&(E.elementType===at||typeof at=="object"&&at!==null&&at.$$typeof===Z&&fa(at)===E.type)?(E=o(E,D.props),Ui(E,D),E.return=w,E):(E=$l(D.type,D.key,D.props,null,w.mode,L),Ui(E,D),E.return=w,E)}function z(w,E,D,L){return E===null||E.tag!==4||E.stateNode.containerInfo!==D.containerInfo||E.stateNode.implementation!==D.implementation?(E=fr(D,w.mode,L),E.return=w,E):(E=o(E,D.children||[]),E.return=w,E)}function U(w,E,D,L,at){return E===null||E.tag!==7?(E=sa(D,w.mode,L,at),E.return=w,E):(E=o(E,D),E.return=w,E)}function G(w,E,D){if(typeof E=="string"&&E!==""||typeof E=="number"||typeof E=="bigint")return E=cr(""+E,w.mode,D),E.return=w,E;if(typeof E=="object"&&E!==null){switch(E.$$typeof){case j:return D=$l(E.type,E.key,E.props,null,w.mode,D),Ui(D,E),D.return=w,D;case M:return E=fr(E,w.mode,D),E.return=w,E;case Z:return E=fa(E),G(w,E,D)}if(vt(E)||ft(E))return E=sa(E,w.mode,D,null),E.return=w,E;if(typeof E.then=="function")return G(w,ls(E),D);if(E.$$typeof===B)return G(w,es(w,E),D);ss(w,E)}return null}function R(w,E,D,L){var at=E!==null?E.key:null;if(typeof D=="string"&&D!==""||typeof D=="number"||typeof D=="bigint")return at!==null?null:b(w,E,""+D,L);if(typeof D=="object"&&D!==null){switch(D.$$typeof){case j:return D.key===at?T(w,E,D,L):null;case M:return D.key===at?z(w,E,D,L):null;case Z:return D=fa(D),R(w,E,D,L)}if(vt(D)||ft(D))return at!==null?null:U(w,E,D,L,null);if(typeof D.then=="function")return R(w,E,ls(D),L);if(D.$$typeof===B)return R(w,E,es(w,D),L);ss(w,D)}return null}function k(w,E,D,L,at){if(typeof L=="string"&&L!==""||typeof L=="number"||typeof L=="bigint")return w=w.get(D)||null,b(E,w,""+L,at);if(typeof L=="object"&&L!==null){switch(L.$$typeof){case j:return w=w.get(L.key===null?D:L.key)||null,T(E,w,L,at);case M:return w=w.get(L.key===null?D:L.key)||null,z(E,w,L,at);case Z:return L=fa(L),k(w,E,D,L,at)}if(vt(L)||ft(L))return w=w.get(D)||null,U(E,w,L,at,null);if(typeof L.then=="function")return k(w,E,D,ls(L),at);if(L.$$typeof===B)return k(w,E,D,es(E,L),at);ss(E,L)}return null}function P(w,E,D,L){for(var at=null,Tt=null,tt=E,dt=E=0,xt=null;tt!==null&&dt<D.length;dt++){tt.index>dt?(xt=tt,tt=null):xt=tt.sibling;var jt=R(w,tt,D[dt],L);if(jt===null){tt===null&&(tt=xt);break}t&&tt&&jt.alternate===null&&e(w,tt),E=u(jt,E,dt),Tt===null?at=jt:Tt.sibling=jt,Tt=jt,tt=xt}if(dt===D.length)return n(w,tt),St&&on(w,dt),at;if(tt===null){for(;dt<D.length;dt++)tt=G(w,D[dt],L),tt!==null&&(E=u(tt,E,dt),Tt===null?at=tt:Tt.sibling=tt,Tt=tt);return St&&on(w,dt),at}for(tt=i(tt);dt<D.length;dt++)xt=k(tt,w,dt,D[dt],L),xt!==null&&(t&&xt.alternate!==null&&tt.delete(xt.key===null?dt:xt.key),E=u(xt,E,dt),Tt===null?at=xt:Tt.sibling=xt,Tt=xt);return t&&tt.forEach(function(Zn){return e(w,Zn)}),St&&on(w,dt),at}function lt(w,E,D,L){if(D==null)throw Error(r(151));for(var at=null,Tt=null,tt=E,dt=E=0,xt=null,jt=D.next();tt!==null&&!jt.done;dt++,jt=D.next()){tt.index>dt?(xt=tt,tt=null):xt=tt.sibling;var Zn=R(w,tt,jt.value,L);if(Zn===null){tt===null&&(tt=xt);break}t&&tt&&Zn.alternate===null&&e(w,tt),E=u(Zn,E,dt),Tt===null?at=Zn:Tt.sibling=Zn,Tt=Zn,tt=xt}if(jt.done)return n(w,tt),St&&on(w,dt),at;if(tt===null){for(;!jt.done;dt++,jt=D.next())jt=G(w,jt.value,L),jt!==null&&(E=u(jt,E,dt),Tt===null?at=jt:Tt.sibling=jt,Tt=jt);return St&&on(w,dt),at}for(tt=i(tt);!jt.done;dt++,jt=D.next())jt=k(tt,w,dt,jt.value,L),jt!==null&&(t&&jt.alternate!==null&&tt.delete(jt.key===null?dt:jt.key),E=u(jt,E,dt),Tt===null?at=jt:Tt.sibling=jt,Tt=jt);return t&&tt.forEach(function(vv){return e(w,vv)}),St&&on(w,dt),at}function zt(w,E,D,L){if(typeof D=="object"&&D!==null&&D.type===V&&D.key===null&&(D=D.props.children),typeof D=="object"&&D!==null){switch(D.$$typeof){case j:t:{for(var at=D.key;E!==null;){if(E.key===at){if(at=D.type,at===V){if(E.tag===7){n(w,E.sibling),L=o(E,D.props.children),L.return=w,w=L;break t}}else if(E.elementType===at||typeof at=="object"&&at!==null&&at.$$typeof===Z&&fa(at)===E.type){n(w,E.sibling),L=o(E,D.props),Ui(L,D),L.return=w,w=L;break t}n(w,E);break}else e(w,E);E=E.sibling}D.type===V?(L=sa(D.props.children,w.mode,L,D.key),L.return=w,w=L):(L=$l(D.type,D.key,D.props,null,w.mode,L),Ui(L,D),L.return=w,w=L)}return h(w);case M:t:{for(at=D.key;E!==null;){if(E.key===at)if(E.tag===4&&E.stateNode.containerInfo===D.containerInfo&&E.stateNode.implementation===D.implementation){n(w,E.sibling),L=o(E,D.children||[]),L.return=w,w=L;break t}else{n(w,E);break}else e(w,E);E=E.sibling}L=fr(D,w.mode,L),L.return=w,w=L}return h(w);case Z:return D=fa(D),zt(w,E,D,L)}if(vt(D))return P(w,E,D,L);if(ft(D)){if(at=ft(D),typeof at!="function")throw Error(r(150));return D=at.call(D),lt(w,E,D,L)}if(typeof D.then=="function")return zt(w,E,ls(D),L);if(D.$$typeof===B)return zt(w,E,es(w,D),L);ss(w,D)}return typeof D=="string"&&D!==""||typeof D=="number"||typeof D=="bigint"?(D=""+D,E!==null&&E.tag===6?(n(w,E.sibling),L=o(E,D),L.return=w,w=L):(n(w,E),L=cr(D,w.mode,L),L.return=w,w=L),h(w)):n(w,E)}return function(w,E,D,L){try{_i=0;var at=zt(w,E,D,L);return Za=null,at}catch(tt){if(tt===Qa||tt===as)throw tt;var Tt=Te(29,tt,null,w.mode);return Tt.lanes=L,Tt.return=w,Tt}finally{}}}var ha=qd(!0),Xd=qd(!1),Nn=!1;function jr(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ar(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function Dn(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function zn(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,(Et&2)!==0){var o=i.pending;return o===null?e.next=e:(e.next=o.next,o.next=e),i.pending=e,e=Pl(t),wd(t,null,n),e}return Wl(t,i,e,n),Pl(t)}function Li(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194048)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,kf(t,n)}}function Er(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var o=null,u=null;if(n=n.firstBaseUpdate,n!==null){do{var h={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};u===null?o=u=h:u=u.next=h,n=n.next}while(n!==null);u===null?o=u=e:u=u.next=e}else o=u=e;n={baseState:i.baseState,firstBaseUpdate:o,lastBaseUpdate:u,shared:i.shared,callbacks:i.callbacks},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}var Mr=!1;function Hi(){if(Mr){var t=Xa;if(t!==null)throw t}}function Gi(t,e,n,i){Mr=!1;var o=t.updateQueue;Nn=!1;var u=o.firstBaseUpdate,h=o.lastBaseUpdate,b=o.shared.pending;if(b!==null){o.shared.pending=null;var T=b,z=T.next;T.next=null,h===null?u=z:h.next=z,h=T;var U=t.alternate;U!==null&&(U=U.updateQueue,b=U.lastBaseUpdate,b!==h&&(b===null?U.firstBaseUpdate=z:b.next=z,U.lastBaseUpdate=T))}if(u!==null){var G=o.baseState;h=0,U=z=T=null,b=u;do{var R=b.lane&-536870913,k=R!==b.lane;if(k?(bt&R)===R:(i&R)===R){R!==0&&R===qa&&(Mr=!0),U!==null&&(U=U.next={lane:0,tag:b.tag,payload:b.payload,callback:null,next:null});t:{var P=t,lt=b;R=e;var zt=n;switch(lt.tag){case 1:if(P=lt.payload,typeof P=="function"){G=P.call(zt,G,R);break t}G=P;break t;case 3:P.flags=P.flags&-65537|128;case 0:if(P=lt.payload,R=typeof P=="function"?P.call(zt,G,R):P,R==null)break t;G=v({},G,R);break t;case 2:Nn=!0}}R=b.callback,R!==null&&(t.flags|=64,k&&(t.flags|=8192),k=o.callbacks,k===null?o.callbacks=[R]:k.push(R))}else k={lane:R,tag:b.tag,payload:b.payload,callback:b.callback,next:null},U===null?(z=U=k,T=G):U=U.next=k,h|=R;if(b=b.next,b===null){if(b=o.shared.pending,b===null)break;k=b,b=k.next,k.next=null,o.lastBaseUpdate=k,o.shared.pending=null}}while(!0);U===null&&(T=G),o.baseState=T,o.firstBaseUpdate=z,o.lastBaseUpdate=U,u===null&&(o.shared.lanes=0),Bn|=h,t.lanes=h,t.memoizedState=G}}function Qd(t,e){if(typeof t!="function")throw Error(r(191,t));t.call(e)}function Zd(t,e){var n=t.callbacks;if(n!==null)for(t.callbacks=null,t=0;t<n.length;t++)Qd(n[t],e)}var Ka=A(null),os=A(0);function Kd(t,e){t=bn,K(os,t),K(Ka,e),bn=t|e.baseLanes}function wr(){K(os,bn),K(Ka,Ka.current)}function Cr(){bn=os.current,H(Ka),H(os)}var je=A(null),Be=null;function Rn(t){var e=t.alternate;K(Yt,Yt.current&1),K(je,t),Be===null&&(e===null||Ka.current!==null||e.memoizedState!==null)&&(Be=t)}function Nr(t){K(Yt,Yt.current),K(je,t),Be===null&&(Be=t)}function Jd(t){t.tag===22?(K(Yt,Yt.current),K(je,t),Be===null&&(Be=t)):On()}function On(){K(Yt,Yt.current),K(je,je.current)}function Ae(t){H(je),Be===t&&(Be=null),H(Yt)}var Yt=A(0);function rs(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||ku(n)||Bu(n)))return e}else if(e.tag===19&&(e.memoizedProps.revealOrder==="forwards"||e.memoizedProps.revealOrder==="backwards"||e.memoizedProps.revealOrder==="unstable_legacy-backwards"||e.memoizedProps.revealOrder==="together")){if((e.flags&128)!==0)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var cn=0,ct=null,Nt=null,Qt=null,us=!1,Ja=!1,ma=!1,cs=0,Yi=0,Fa=null,cx=0;function Ut(){throw Error(r(321))}function Dr(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Se(t[n],e[n]))return!1;return!0}function zr(t,e,n,i,o,u){return cn=u,ct=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,O.H=t===null||t.memoizedState===null?zh:Zr,ma=!1,u=n(i,o),ma=!1,Ja&&(u=Wd(e,n,i,o)),Fd(t),u}function Fd(t){O.H=Qi;var e=Nt!==null&&Nt.next!==null;if(cn=0,Qt=Nt=ct=null,us=!1,Yi=0,Fa=null,e)throw Error(r(300));t===null||Zt||(t=t.dependencies,t!==null&&ts(t)&&(Zt=!0))}function Wd(t,e,n,i){ct=t;var o=0;do{if(Ja&&(Fa=null),Yi=0,Ja=!1,25<=o)throw Error(r(301));if(o+=1,Qt=Nt=null,t.updateQueue!=null){var u=t.updateQueue;u.lastEffect=null,u.events=null,u.stores=null,u.memoCache!=null&&(u.memoCache.index=0)}O.H=Rh,u=e(n,i)}while(Ja);return u}function fx(){var t=O.H,e=t.useState()[0];return e=typeof e.then=="function"?qi(e):e,t=t.useState()[0],(Nt!==null?Nt.memoizedState:null)!==t&&(ct.flags|=1024),e}function Rr(){var t=cs!==0;return cs=0,t}function Or(t,e,n){e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~n}function Vr(t){if(us){for(t=t.memoizedState;t!==null;){var e=t.queue;e!==null&&(e.pending=null),t=t.next}us=!1}cn=0,Qt=Nt=ct=null,Ja=!1,Yi=cs=0,Fa=null}function re(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Qt===null?ct.memoizedState=Qt=t:Qt=Qt.next=t,Qt}function qt(){if(Nt===null){var t=ct.alternate;t=t!==null?t.memoizedState:null}else t=Nt.next;var e=Qt===null?ct.memoizedState:Qt.next;if(e!==null)Qt=e,Nt=t;else{if(t===null)throw ct.alternate===null?Error(r(467)):Error(r(310));Nt=t,t={memoizedState:Nt.memoizedState,baseState:Nt.baseState,baseQueue:Nt.baseQueue,queue:Nt.queue,next:null},Qt===null?ct.memoizedState=Qt=t:Qt=Qt.next=t}return Qt}function fs(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function qi(t){var e=Yi;return Yi+=1,Fa===null&&(Fa=[]),t=Hd(Fa,t,e),e=ct,(Qt===null?e.memoizedState:Qt.next)===null&&(e=e.alternate,O.H=e===null||e.memoizedState===null?zh:Zr),t}function ds(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return qi(t);if(t.$$typeof===B)return ee(t)}throw Error(r(438,String(t)))}function kr(t){var e=null,n=ct.updateQueue;if(n!==null&&(e=n.memoCache),e==null){var i=ct.alternate;i!==null&&(i=i.updateQueue,i!==null&&(i=i.memoCache,i!=null&&(e={data:i.data.map(function(o){return o.slice()}),index:0})))}if(e==null&&(e={data:[],index:0}),n===null&&(n=fs(),ct.updateQueue=n),n.memoCache=e,n=e.data[e.index],n===void 0)for(n=e.data[e.index]=Array(t),i=0;i<t;i++)n[i]=I;return e.index++,n}function fn(t,e){return typeof e=="function"?e(t):e}function hs(t){var e=qt();return Br(e,Nt,t)}function Br(t,e,n){var i=t.queue;if(i===null)throw Error(r(311));i.lastRenderedReducer=n;var o=t.baseQueue,u=i.pending;if(u!==null){if(o!==null){var h=o.next;o.next=u.next,u.next=h}e.baseQueue=o=u,i.pending=null}if(u=t.baseState,o===null)t.memoizedState=u;else{e=o.next;var b=h=null,T=null,z=e,U=!1;do{var G=z.lane&-536870913;if(G!==z.lane?(bt&G)===G:(cn&G)===G){var R=z.revertLane;if(R===0)T!==null&&(T=T.next={lane:0,revertLane:0,gesture:null,action:z.action,hasEagerState:z.hasEagerState,eagerState:z.eagerState,next:null}),G===qa&&(U=!0);else if((cn&R)===R){z=z.next,R===qa&&(U=!0);continue}else G={lane:0,revertLane:z.revertLane,gesture:null,action:z.action,hasEagerState:z.hasEagerState,eagerState:z.eagerState,next:null},T===null?(b=T=G,h=u):T=T.next=G,ct.lanes|=R,Bn|=R;G=z.action,ma&&n(u,G),u=z.hasEagerState?z.eagerState:n(u,G)}else R={lane:G,revertLane:z.revertLane,gesture:z.gesture,action:z.action,hasEagerState:z.hasEagerState,eagerState:z.eagerState,next:null},T===null?(b=T=R,h=u):T=T.next=R,ct.lanes|=G,Bn|=G;z=z.next}while(z!==null&&z!==e);if(T===null?h=u:T.next=b,!Se(u,t.memoizedState)&&(Zt=!0,U&&(n=Xa,n!==null)))throw n;t.memoizedState=u,t.baseState=h,t.baseQueue=T,i.lastRenderedState=u}return o===null&&(i.lanes=0),[t.memoizedState,i.dispatch]}function _r(t){var e=qt(),n=e.queue;if(n===null)throw Error(r(311));n.lastRenderedReducer=t;var i=n.dispatch,o=n.pending,u=e.memoizedState;if(o!==null){n.pending=null;var h=o=o.next;do u=t(u,h.action),h=h.next;while(h!==o);Se(u,e.memoizedState)||(Zt=!0),e.memoizedState=u,e.baseQueue===null&&(e.baseState=u),n.lastRenderedState=u}return[u,i]}function Pd(t,e,n){var i=ct,o=qt(),u=St;if(u){if(n===void 0)throw Error(r(407));n=n()}else n=e();var h=!Se((Nt||o).memoizedState,n);if(h&&(o.memoizedState=n,Zt=!0),o=o.queue,Hr(th.bind(null,i,o,t),[t]),o.getSnapshot!==e||h||Qt!==null&&Qt.memoizedState.tag&1){if(i.flags|=2048,Wa(9,{destroy:void 0},Id.bind(null,i,o,n,e),null),Rt===null)throw Error(r(349));u||(cn&127)!==0||$d(i,e,n)}return n}function $d(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=ct.updateQueue,e===null?(e=fs(),ct.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function Id(t,e,n,i){e.value=n,e.getSnapshot=i,eh(e)&&nh(t)}function th(t,e,n){return n(function(){eh(e)&&nh(t)})}function eh(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Se(t,n)}catch{return!0}}function nh(t){var e=la(t,2);e!==null&&ye(e,t,2)}function Ur(t){var e=re();if(typeof t=="function"){var n=t;if(t=n(),ma){Tn(!0);try{n()}finally{Tn(!1)}}}return e.memoizedState=e.baseState=t,e.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:fn,lastRenderedState:t},e}function ah(t,e,n,i){return t.baseState=n,Br(t,Nt,typeof i=="function"?i:fn)}function dx(t,e,n,i,o){if(gs(t))throw Error(r(485));if(t=e.action,t!==null){var u={payload:o,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(h){u.listeners.push(h)}};O.T!==null?n(!0):u.isTransition=!1,i(u),n=e.pending,n===null?(u.next=e.pending=u,ih(e,u)):(u.next=n.next,e.pending=n.next=u)}}function ih(t,e){var n=e.action,i=e.payload,o=t.state;if(e.isTransition){var u=O.T,h={};O.T=h;try{var b=n(o,i),T=O.S;T!==null&&T(h,b),lh(t,e,b)}catch(z){Lr(t,e,z)}finally{u!==null&&h.types!==null&&(u.types=h.types),O.T=u}}else try{u=n(o,i),lh(t,e,u)}catch(z){Lr(t,e,z)}}function lh(t,e,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(i){sh(t,e,i)},function(i){return Lr(t,e,i)}):sh(t,e,n)}function sh(t,e,n){e.status="fulfilled",e.value=n,oh(e),t.state=n,e=t.pending,e!==null&&(n=e.next,n===e?t.pending=null:(n=n.next,e.next=n,ih(t,n)))}function Lr(t,e,n){var i=t.pending;if(t.pending=null,i!==null){i=i.next;do e.status="rejected",e.reason=n,oh(e),e=e.next;while(e!==i)}t.action=null}function oh(t){t=t.listeners;for(var e=0;e<t.length;e++)(0,t[e])()}function rh(t,e){return e}function uh(t,e){if(St){var n=Rt.formState;if(n!==null){t:{var i=ct;if(St){if(kt){e:{for(var o=kt,u=ke;o.nodeType!==8;){if(!u){o=null;break e}if(o=_e(o.nextSibling),o===null){o=null;break e}}u=o.data,o=u==="F!"||u==="F"?o:null}if(o){kt=_e(o.nextSibling),i=o.data==="F!";break t}}wn(i)}i=!1}i&&(e=n[0])}}return n=re(),n.memoizedState=n.baseState=e,i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:rh,lastRenderedState:e},n.queue=i,n=Ch.bind(null,ct,i),i.dispatch=n,i=Ur(!1),u=Qr.bind(null,ct,!1,i.queue),i=re(),o={state:e,dispatch:null,action:t,pending:null},i.queue=o,n=dx.bind(null,ct,o,u,n),o.dispatch=n,i.memoizedState=t,[e,n,!1]}function ch(t){var e=qt();return fh(e,Nt,t)}function fh(t,e,n){if(e=Br(t,e,rh)[0],t=hs(fn)[0],typeof e=="object"&&e!==null&&typeof e.then=="function")try{var i=qi(e)}catch(h){throw h===Qa?as:h}else i=e;e=qt();var o=e.queue,u=o.dispatch;return n!==e.memoizedState&&(ct.flags|=2048,Wa(9,{destroy:void 0},hx.bind(null,o,n),null)),[i,u,t]}function hx(t,e){t.action=e}function dh(t){var e=qt(),n=Nt;if(n!==null)return fh(e,n,t);qt(),e=e.memoizedState,n=qt();var i=n.queue.dispatch;return n.memoizedState=t,[e,i,!1]}function Wa(t,e,n,i){return t={tag:t,create:n,deps:i,inst:e,next:null},e=ct.updateQueue,e===null&&(e=fs(),ct.updateQueue=e),n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t),t}function hh(){return qt().memoizedState}function ms(t,e,n,i){var o=re();ct.flags|=t,o.memoizedState=Wa(1|e,{destroy:void 0},n,i===void 0?null:i)}function ps(t,e,n,i){var o=qt();i=i===void 0?null:i;var u=o.memoizedState.inst;Nt!==null&&i!==null&&Dr(i,Nt.memoizedState.deps)?o.memoizedState=Wa(e,u,n,i):(ct.flags|=t,o.memoizedState=Wa(1|e,u,n,i))}function mh(t,e){ms(8390656,8,t,e)}function Hr(t,e){ps(2048,8,t,e)}function mx(t){ct.flags|=4;var e=ct.updateQueue;if(e===null)e=fs(),ct.updateQueue=e,e.events=[t];else{var n=e.events;n===null?e.events=[t]:n.push(t)}}function ph(t){var e=qt().memoizedState;return mx({ref:e,nextImpl:t}),function(){if((Et&2)!==0)throw Error(r(440));return e.impl.apply(void 0,arguments)}}function gh(t,e){return ps(4,2,t,e)}function yh(t,e){return ps(4,4,t,e)}function bh(t,e){if(typeof e=="function"){t=t();var n=e(t);return function(){typeof n=="function"?n():e(null)}}if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function xh(t,e,n){n=n!=null?n.concat([t]):null,ps(4,4,bh.bind(null,e,t),n)}function Gr(){}function vh(t,e){var n=qt();e=e===void 0?null:e;var i=n.memoizedState;return e!==null&&Dr(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function Sh(t,e){var n=qt();e=e===void 0?null:e;var i=n.memoizedState;if(e!==null&&Dr(e,i[1]))return i[0];if(i=t(),ma){Tn(!0);try{t()}finally{Tn(!1)}}return n.memoizedState=[i,e],i}function Yr(t,e,n){return n===void 0||(cn&1073741824)!==0&&(bt&261930)===0?t.memoizedState=e:(t.memoizedState=n,t=Tm(),ct.lanes|=t,Bn|=t,n)}function Th(t,e,n,i){return Se(n,e)?n:Ka.current!==null?(t=Yr(t,n,i),Se(t,e)||(Zt=!0),t):(cn&42)===0||(cn&1073741824)!==0&&(bt&261930)===0?(Zt=!0,t.memoizedState=n):(t=Tm(),ct.lanes|=t,Bn|=t,e)}function jh(t,e,n,i,o){var u=Q.p;Q.p=u!==0&&8>u?u:8;var h=O.T,b={};O.T=b,Qr(t,!1,e,n);try{var T=o(),z=O.S;if(z!==null&&z(b,T),T!==null&&typeof T=="object"&&typeof T.then=="function"){var U=ux(T,i);Xi(t,e,U,we(t))}else Xi(t,e,i,we(t))}catch(G){Xi(t,e,{then:function(){},status:"rejected",reason:G},we())}finally{Q.p=u,h!==null&&b.types!==null&&(h.types=b.types),O.T=h}}function px(){}function qr(t,e,n,i){if(t.tag!==5)throw Error(r(476));var o=Ah(t).queue;jh(t,o,e,F,n===null?px:function(){return Eh(t),n(i)})}function Ah(t){var e=t.memoizedState;if(e!==null)return e;e={memoizedState:F,baseState:F,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:fn,lastRenderedState:F},next:null};var n={};return e.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:fn,lastRenderedState:n},next:null},t.memoizedState=e,t=t.alternate,t!==null&&(t.memoizedState=e),e}function Eh(t){var e=Ah(t);e.next===null&&(e=t.alternate.memoizedState),Xi(t,e.next.queue,{},we())}function Xr(){return ee(ol)}function Mh(){return qt().memoizedState}function wh(){return qt().memoizedState}function gx(t){for(var e=t.return;e!==null;){switch(e.tag){case 24:case 3:var n=we();t=Dn(n);var i=zn(e,t,n);i!==null&&(ye(i,e,n),Li(i,e,n)),e={cache:xr()},t.payload=e;return}e=e.return}}function yx(t,e,n){var i=we();n={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},gs(t)?Nh(e,n):(n=rr(t,e,n,i),n!==null&&(ye(n,t,i),Dh(n,e,i)))}function Ch(t,e,n){var i=we();Xi(t,e,n,i)}function Xi(t,e,n,i){var o={lane:i,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(gs(t))Nh(e,o);else{var u=t.alternate;if(t.lanes===0&&(u===null||u.lanes===0)&&(u=e.lastRenderedReducer,u!==null))try{var h=e.lastRenderedState,b=u(h,n);if(o.hasEagerState=!0,o.eagerState=b,Se(b,h))return Wl(t,e,o,0),Rt===null&&Fl(),!1}catch{}finally{}if(n=rr(t,e,o,i),n!==null)return ye(n,t,i),Dh(n,e,i),!0}return!1}function Qr(t,e,n,i){if(i={lane:2,revertLane:ju(),gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null},gs(t)){if(e)throw Error(r(479))}else e=rr(t,n,i,2),e!==null&&ye(e,t,2)}function gs(t){var e=t.alternate;return t===ct||e!==null&&e===ct}function Nh(t,e){Ja=us=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Dh(t,e,n){if((n&4194048)!==0){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,kf(t,n)}}var Qi={readContext:ee,use:ds,useCallback:Ut,useContext:Ut,useEffect:Ut,useImperativeHandle:Ut,useLayoutEffect:Ut,useInsertionEffect:Ut,useMemo:Ut,useReducer:Ut,useRef:Ut,useState:Ut,useDebugValue:Ut,useDeferredValue:Ut,useTransition:Ut,useSyncExternalStore:Ut,useId:Ut,useHostTransitionStatus:Ut,useFormState:Ut,useActionState:Ut,useOptimistic:Ut,useMemoCache:Ut,useCacheRefresh:Ut};Qi.useEffectEvent=Ut;var zh={readContext:ee,use:ds,useCallback:function(t,e){return re().memoizedState=[t,e===void 0?null:e],t},useContext:ee,useEffect:mh,useImperativeHandle:function(t,e,n){n=n!=null?n.concat([t]):null,ms(4194308,4,bh.bind(null,e,t),n)},useLayoutEffect:function(t,e){return ms(4194308,4,t,e)},useInsertionEffect:function(t,e){ms(4,2,t,e)},useMemo:function(t,e){var n=re();e=e===void 0?null:e;var i=t();if(ma){Tn(!0);try{t()}finally{Tn(!1)}}return n.memoizedState=[i,e],i},useReducer:function(t,e,n){var i=re();if(n!==void 0){var o=n(e);if(ma){Tn(!0);try{n(e)}finally{Tn(!1)}}}else o=e;return i.memoizedState=i.baseState=o,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:o},i.queue=t,t=t.dispatch=yx.bind(null,ct,t),[i.memoizedState,t]},useRef:function(t){var e=re();return t={current:t},e.memoizedState=t},useState:function(t){t=Ur(t);var e=t.queue,n=Ch.bind(null,ct,e);return e.dispatch=n,[t.memoizedState,n]},useDebugValue:Gr,useDeferredValue:function(t,e){var n=re();return Yr(n,t,e)},useTransition:function(){var t=Ur(!1);return t=jh.bind(null,ct,t.queue,!0,!1),re().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,e,n){var i=ct,o=re();if(St){if(n===void 0)throw Error(r(407));n=n()}else{if(n=e(),Rt===null)throw Error(r(349));(bt&127)!==0||$d(i,e,n)}o.memoizedState=n;var u={value:n,getSnapshot:e};return o.queue=u,mh(th.bind(null,i,u,t),[t]),i.flags|=2048,Wa(9,{destroy:void 0},Id.bind(null,i,u,n,e),null),n},useId:function(){var t=re(),e=Rt.identifierPrefix;if(St){var n=Je,i=Ke;n=(i&~(1<<32-ve(i)-1)).toString(32)+n,e="_"+e+"R_"+n,n=cs++,0<n&&(e+="H"+n.toString(32)),e+="_"}else n=cx++,e="_"+e+"r_"+n.toString(32)+"_";return t.memoizedState=e},useHostTransitionStatus:Xr,useFormState:uh,useActionState:uh,useOptimistic:function(t){var e=re();e.memoizedState=e.baseState=t;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return e.queue=n,e=Qr.bind(null,ct,!0,n),n.dispatch=e,[t,e]},useMemoCache:kr,useCacheRefresh:function(){return re().memoizedState=gx.bind(null,ct)},useEffectEvent:function(t){var e=re(),n={impl:t};return e.memoizedState=n,function(){if((Et&2)!==0)throw Error(r(440));return n.impl.apply(void 0,arguments)}}},Zr={readContext:ee,use:ds,useCallback:vh,useContext:ee,useEffect:Hr,useImperativeHandle:xh,useInsertionEffect:gh,useLayoutEffect:yh,useMemo:Sh,useReducer:hs,useRef:hh,useState:function(){return hs(fn)},useDebugValue:Gr,useDeferredValue:function(t,e){var n=qt();return Th(n,Nt.memoizedState,t,e)},useTransition:function(){var t=hs(fn)[0],e=qt().memoizedState;return[typeof t=="boolean"?t:qi(t),e]},useSyncExternalStore:Pd,useId:Mh,useHostTransitionStatus:Xr,useFormState:ch,useActionState:ch,useOptimistic:function(t,e){var n=qt();return ah(n,Nt,t,e)},useMemoCache:kr,useCacheRefresh:wh};Zr.useEffectEvent=ph;var Rh={readContext:ee,use:ds,useCallback:vh,useContext:ee,useEffect:Hr,useImperativeHandle:xh,useInsertionEffect:gh,useLayoutEffect:yh,useMemo:Sh,useReducer:_r,useRef:hh,useState:function(){return _r(fn)},useDebugValue:Gr,useDeferredValue:function(t,e){var n=qt();return Nt===null?Yr(n,t,e):Th(n,Nt.memoizedState,t,e)},useTransition:function(){var t=_r(fn)[0],e=qt().memoizedState;return[typeof t=="boolean"?t:qi(t),e]},useSyncExternalStore:Pd,useId:Mh,useHostTransitionStatus:Xr,useFormState:dh,useActionState:dh,useOptimistic:function(t,e){var n=qt();return Nt!==null?ah(n,Nt,t,e):(n.baseState=t,[t,n.queue.dispatch])},useMemoCache:kr,useCacheRefresh:wh};Rh.useEffectEvent=ph;function Kr(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:v({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Jr={enqueueSetState:function(t,e,n){t=t._reactInternals;var i=we(),o=Dn(i);o.payload=e,n!=null&&(o.callback=n),e=zn(t,o,i),e!==null&&(ye(e,t,i),Li(e,t,i))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=we(),o=Dn(i);o.tag=1,o.payload=e,n!=null&&(o.callback=n),e=zn(t,o,i),e!==null&&(ye(e,t,i),Li(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=we(),i=Dn(n);i.tag=2,e!=null&&(i.callback=e),e=zn(t,i,n),e!==null&&(ye(e,t,n),Li(e,t,n))}};function Oh(t,e,n,i,o,u,h){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,u,h):e.prototype&&e.prototype.isPureReactComponent?!zi(n,i)||!zi(o,u):!0}function Vh(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&Jr.enqueueReplaceState(e,e.state,null)}function pa(t,e){var n=e;if("ref"in e){n={};for(var i in e)i!=="ref"&&(n[i]=e[i])}if(t=t.defaultProps){n===e&&(n=v({},n));for(var o in t)n[o]===void 0&&(n[o]=t[o])}return n}function kh(t){Jl(t)}function Bh(t){console.error(t)}function _h(t){Jl(t)}function ys(t,e){try{var n=t.onUncaughtError;n(e.value,{componentStack:e.stack})}catch(i){setTimeout(function(){throw i})}}function Uh(t,e,n){try{var i=t.onCaughtError;i(n.value,{componentStack:n.stack,errorBoundary:e.tag===1?e.stateNode:null})}catch(o){setTimeout(function(){throw o})}}function Fr(t,e,n){return n=Dn(n),n.tag=3,n.payload={element:null},n.callback=function(){ys(t,e)},n}function Lh(t){return t=Dn(t),t.tag=3,t}function Hh(t,e,n,i){var o=n.type.getDerivedStateFromError;if(typeof o=="function"){var u=i.value;t.payload=function(){return o(u)},t.callback=function(){Uh(e,n,i)}}var h=n.stateNode;h!==null&&typeof h.componentDidCatch=="function"&&(t.callback=function(){Uh(e,n,i),typeof o!="function"&&(_n===null?_n=new Set([this]):_n.add(this));var b=i.stack;this.componentDidCatch(i.value,{componentStack:b!==null?b:""})})}function bx(t,e,n,i,o){if(n.flags|=32768,i!==null&&typeof i=="object"&&typeof i.then=="function"){if(e=n.alternate,e!==null&&Ya(e,n,o,!0),n=je.current,n!==null){switch(n.tag){case 31:case 13:return Be===null?Ns():n.alternate===null&&Lt===0&&(Lt=3),n.flags&=-257,n.flags|=65536,n.lanes=o,i===is?n.flags|=16384:(e=n.updateQueue,e===null?n.updateQueue=new Set([i]):e.add(i),vu(t,i,o)),!1;case 22:return n.flags|=65536,i===is?n.flags|=16384:(e=n.updateQueue,e===null?(e={transitions:null,markerInstances:null,retryQueue:new Set([i])},n.updateQueue=e):(n=e.retryQueue,n===null?e.retryQueue=new Set([i]):n.add(i)),vu(t,i,o)),!1}throw Error(r(435,n.tag))}return vu(t,i,o),Ns(),!1}if(St)return e=je.current,e!==null?((e.flags&65536)===0&&(e.flags|=256),e.flags|=65536,e.lanes=o,i!==mr&&(t=Error(r(422),{cause:i}),Vi(Re(t,n)))):(i!==mr&&(e=Error(r(423),{cause:i}),Vi(Re(e,n))),t=t.current.alternate,t.flags|=65536,o&=-o,t.lanes|=o,i=Re(i,n),o=Fr(t.stateNode,i,o),Er(t,o),Lt!==4&&(Lt=2)),!1;var u=Error(r(520),{cause:i});if(u=Re(u,n),Ii===null?Ii=[u]:Ii.push(u),Lt!==4&&(Lt=2),e===null)return!0;i=Re(i,n),n=e;do{switch(n.tag){case 3:return n.flags|=65536,t=o&-o,n.lanes|=t,t=Fr(n.stateNode,i,t),Er(n,t),!1;case 1:if(e=n.type,u=n.stateNode,(n.flags&128)===0&&(typeof e.getDerivedStateFromError=="function"||u!==null&&typeof u.componentDidCatch=="function"&&(_n===null||!_n.has(u))))return n.flags|=65536,o&=-o,n.lanes|=o,o=Lh(o),Hh(o,t,n,i),Er(n,o),!1}n=n.return}while(n!==null);return!1}var Wr=Error(r(461)),Zt=!1;function ne(t,e,n,i){e.child=t===null?Xd(e,null,n,i):ha(e,t.child,n,i)}function Gh(t,e,n,i,o){n=n.render;var u=e.ref;if("ref"in i){var h={};for(var b in i)b!=="ref"&&(h[b]=i[b])}else h=i;return ua(e),i=zr(t,e,n,h,u,o),b=Rr(),t!==null&&!Zt?(Or(t,e,o),dn(t,e,o)):(St&&b&&dr(e),e.flags|=1,ne(t,e,i,o),e.child)}function Yh(t,e,n,i,o){if(t===null){var u=n.type;return typeof u=="function"&&!ur(u)&&u.defaultProps===void 0&&n.compare===null?(e.tag=15,e.type=u,qh(t,e,u,i,o)):(t=$l(n.type,null,i,e,e.mode,o),t.ref=e.ref,t.return=e,e.child=t)}if(u=t.child,!iu(t,o)){var h=u.memoizedProps;if(n=n.compare,n=n!==null?n:zi,n(h,i)&&t.ref===e.ref)return dn(t,e,o)}return e.flags|=1,t=sn(u,i),t.ref=e.ref,t.return=e,e.child=t}function qh(t,e,n,i,o){if(t!==null){var u=t.memoizedProps;if(zi(u,i)&&t.ref===e.ref)if(Zt=!1,e.pendingProps=i=u,iu(t,o))(t.flags&131072)!==0&&(Zt=!0);else return e.lanes=t.lanes,dn(t,e,o)}return Pr(t,e,n,i,o)}function Xh(t,e,n,i){var o=i.children,u=t!==null?t.memoizedState:null;if(t===null&&e.stateNode===null&&(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),i.mode==="hidden"){if((e.flags&128)!==0){if(u=u!==null?u.baseLanes|n:n,t!==null){for(i=e.child=t.child,o=0;i!==null;)o=o|i.lanes|i.childLanes,i=i.sibling;i=o&~u}else i=0,e.child=null;return Qh(t,e,u,n,i)}if((n&536870912)!==0)e.memoizedState={baseLanes:0,cachePool:null},t!==null&&ns(e,u!==null?u.cachePool:null),u!==null?Kd(e,u):wr(),Jd(e);else return i=e.lanes=536870912,Qh(t,e,u!==null?u.baseLanes|n:n,n,i)}else u!==null?(ns(e,u.cachePool),Kd(e,u),On(),e.memoizedState=null):(t!==null&&ns(e,null),wr(),On());return ne(t,e,o,n),e.child}function Zi(t,e){return t!==null&&t.tag===22||e.stateNode!==null||(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),e.sibling}function Qh(t,e,n,i,o){var u=Sr();return u=u===null?null:{parent:Xt._currentValue,pool:u},e.memoizedState={baseLanes:n,cachePool:u},t!==null&&ns(e,null),wr(),Jd(e),t!==null&&Ya(t,e,i,!0),e.childLanes=o,null}function bs(t,e){return e=vs({mode:e.mode,children:e.children},t.mode),e.ref=t.ref,t.child=e,e.return=t,e}function Zh(t,e,n){return ha(e,t.child,null,n),t=bs(e,e.pendingProps),t.flags|=2,Ae(e),e.memoizedState=null,t}function xx(t,e,n){var i=e.pendingProps,o=(e.flags&128)!==0;if(e.flags&=-129,t===null){if(St){if(i.mode==="hidden")return t=bs(e,i),e.lanes=536870912,Zi(null,t);if(Nr(e),(t=kt)?(t=ip(t,ke),t=t!==null&&t.data==="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:En!==null?{id:Ke,overflow:Je}:null,retryLane:536870912,hydrationErrors:null},n=Nd(t),n.return=e,e.child=n,te=e,kt=null)):t=null,t===null)throw wn(e);return e.lanes=536870912,null}return bs(e,i)}var u=t.memoizedState;if(u!==null){var h=u.dehydrated;if(Nr(e),o)if(e.flags&256)e.flags&=-257,e=Zh(t,e,n);else if(e.memoizedState!==null)e.child=t.child,e.flags|=128,e=null;else throw Error(r(558));else if(Zt||Ya(t,e,n,!1),o=(n&t.childLanes)!==0,Zt||o){if(i=Rt,i!==null&&(h=Bf(i,n),h!==0&&h!==u.retryLane))throw u.retryLane=h,la(t,h),ye(i,t,h),Wr;Ns(),e=Zh(t,e,n)}else t=u.treeContext,kt=_e(h.nextSibling),te=e,St=!0,Mn=null,ke=!1,t!==null&&Rd(e,t),e=bs(e,i),e.flags|=4096;return e}return t=sn(t.child,{mode:i.mode,children:i.children}),t.ref=e.ref,e.child=t,t.return=e,t}function xs(t,e){var n=e.ref;if(n===null)t!==null&&t.ref!==null&&(e.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(r(284));(t===null||t.ref!==n)&&(e.flags|=4194816)}}function Pr(t,e,n,i,o){return ua(e),n=zr(t,e,n,i,void 0,o),i=Rr(),t!==null&&!Zt?(Or(t,e,o),dn(t,e,o)):(St&&i&&dr(e),e.flags|=1,ne(t,e,n,o),e.child)}function Kh(t,e,n,i,o,u){return ua(e),e.updateQueue=null,n=Wd(e,i,n,o),Fd(t),i=Rr(),t!==null&&!Zt?(Or(t,e,u),dn(t,e,u)):(St&&i&&dr(e),e.flags|=1,ne(t,e,n,u),e.child)}function Jh(t,e,n,i,o){if(ua(e),e.stateNode===null){var u=Ua,h=n.contextType;typeof h=="object"&&h!==null&&(u=ee(h)),u=new n(i,u),e.memoizedState=u.state!==null&&u.state!==void 0?u.state:null,u.updater=Jr,e.stateNode=u,u._reactInternals=e,u=e.stateNode,u.props=i,u.state=e.memoizedState,u.refs={},jr(e),h=n.contextType,u.context=typeof h=="object"&&h!==null?ee(h):Ua,u.state=e.memoizedState,h=n.getDerivedStateFromProps,typeof h=="function"&&(Kr(e,n,h,i),u.state=e.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof u.getSnapshotBeforeUpdate=="function"||typeof u.UNSAFE_componentWillMount!="function"&&typeof u.componentWillMount!="function"||(h=u.state,typeof u.componentWillMount=="function"&&u.componentWillMount(),typeof u.UNSAFE_componentWillMount=="function"&&u.UNSAFE_componentWillMount(),h!==u.state&&Jr.enqueueReplaceState(u,u.state,null),Gi(e,i,u,o),Hi(),u.state=e.memoizedState),typeof u.componentDidMount=="function"&&(e.flags|=4194308),i=!0}else if(t===null){u=e.stateNode;var b=e.memoizedProps,T=pa(n,b);u.props=T;var z=u.context,U=n.contextType;h=Ua,typeof U=="object"&&U!==null&&(h=ee(U));var G=n.getDerivedStateFromProps;U=typeof G=="function"||typeof u.getSnapshotBeforeUpdate=="function",b=e.pendingProps!==b,U||typeof u.UNSAFE_componentWillReceiveProps!="function"&&typeof u.componentWillReceiveProps!="function"||(b||z!==h)&&Vh(e,u,i,h),Nn=!1;var R=e.memoizedState;u.state=R,Gi(e,i,u,o),Hi(),z=e.memoizedState,b||R!==z||Nn?(typeof G=="function"&&(Kr(e,n,G,i),z=e.memoizedState),(T=Nn||Oh(e,n,T,i,R,z,h))?(U||typeof u.UNSAFE_componentWillMount!="function"&&typeof u.componentWillMount!="function"||(typeof u.componentWillMount=="function"&&u.componentWillMount(),typeof u.UNSAFE_componentWillMount=="function"&&u.UNSAFE_componentWillMount()),typeof u.componentDidMount=="function"&&(e.flags|=4194308)):(typeof u.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=z),u.props=i,u.state=z,u.context=h,i=T):(typeof u.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{u=e.stateNode,Ar(t,e),h=e.memoizedProps,U=pa(n,h),u.props=U,G=e.pendingProps,R=u.context,z=n.contextType,T=Ua,typeof z=="object"&&z!==null&&(T=ee(z)),b=n.getDerivedStateFromProps,(z=typeof b=="function"||typeof u.getSnapshotBeforeUpdate=="function")||typeof u.UNSAFE_componentWillReceiveProps!="function"&&typeof u.componentWillReceiveProps!="function"||(h!==G||R!==T)&&Vh(e,u,i,T),Nn=!1,R=e.memoizedState,u.state=R,Gi(e,i,u,o),Hi();var k=e.memoizedState;h!==G||R!==k||Nn||t!==null&&t.dependencies!==null&&ts(t.dependencies)?(typeof b=="function"&&(Kr(e,n,b,i),k=e.memoizedState),(U=Nn||Oh(e,n,U,i,R,k,T)||t!==null&&t.dependencies!==null&&ts(t.dependencies))?(z||typeof u.UNSAFE_componentWillUpdate!="function"&&typeof u.componentWillUpdate!="function"||(typeof u.componentWillUpdate=="function"&&u.componentWillUpdate(i,k,T),typeof u.UNSAFE_componentWillUpdate=="function"&&u.UNSAFE_componentWillUpdate(i,k,T)),typeof u.componentDidUpdate=="function"&&(e.flags|=4),typeof u.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof u.componentDidUpdate!="function"||h===t.memoizedProps&&R===t.memoizedState||(e.flags|=4),typeof u.getSnapshotBeforeUpdate!="function"||h===t.memoizedProps&&R===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=k),u.props=i,u.state=k,u.context=T,i=U):(typeof u.componentDidUpdate!="function"||h===t.memoizedProps&&R===t.memoizedState||(e.flags|=4),typeof u.getSnapshotBeforeUpdate!="function"||h===t.memoizedProps&&R===t.memoizedState||(e.flags|=1024),i=!1)}return u=i,xs(t,e),i=(e.flags&128)!==0,u||i?(u=e.stateNode,n=i&&typeof n.getDerivedStateFromError!="function"?null:u.render(),e.flags|=1,t!==null&&i?(e.child=ha(e,t.child,null,o),e.child=ha(e,null,n,o)):ne(t,e,n,o),e.memoizedState=u.state,t=e.child):t=dn(t,e,o),t}function Fh(t,e,n,i){return oa(),e.flags|=256,ne(t,e,n,i),e.child}var $r={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Ir(t){return{baseLanes:t,cachePool:Ud()}}function tu(t,e,n){return t=t!==null?t.childLanes&~n:0,e&&(t|=Me),t}function Wh(t,e,n){var i=e.pendingProps,o=!1,u=(e.flags&128)!==0,h;if((h=u)||(h=t!==null&&t.memoizedState===null?!1:(Yt.current&2)!==0),h&&(o=!0,e.flags&=-129),h=(e.flags&32)!==0,e.flags&=-33,t===null){if(St){if(o?Rn(e):On(),(t=kt)?(t=ip(t,ke),t=t!==null&&t.data!=="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:En!==null?{id:Ke,overflow:Je}:null,retryLane:536870912,hydrationErrors:null},n=Nd(t),n.return=e,e.child=n,te=e,kt=null)):t=null,t===null)throw wn(e);return Bu(t)?e.lanes=32:e.lanes=536870912,null}var b=i.children;return i=i.fallback,o?(On(),o=e.mode,b=vs({mode:"hidden",children:b},o),i=sa(i,o,n,null),b.return=e,i.return=e,b.sibling=i,e.child=b,i=e.child,i.memoizedState=Ir(n),i.childLanes=tu(t,h,n),e.memoizedState=$r,Zi(null,i)):(Rn(e),eu(e,b))}var T=t.memoizedState;if(T!==null&&(b=T.dehydrated,b!==null)){if(u)e.flags&256?(Rn(e),e.flags&=-257,e=nu(t,e,n)):e.memoizedState!==null?(On(),e.child=t.child,e.flags|=128,e=null):(On(),b=i.fallback,o=e.mode,i=vs({mode:"visible",children:i.children},o),b=sa(b,o,n,null),b.flags|=2,i.return=e,b.return=e,i.sibling=b,e.child=i,ha(e,t.child,null,n),i=e.child,i.memoizedState=Ir(n),i.childLanes=tu(t,h,n),e.memoizedState=$r,e=Zi(null,i));else if(Rn(e),Bu(b)){if(h=b.nextSibling&&b.nextSibling.dataset,h)var z=h.dgst;h=z,i=Error(r(419)),i.stack="",i.digest=h,Vi({value:i,source:null,stack:null}),e=nu(t,e,n)}else if(Zt||Ya(t,e,n,!1),h=(n&t.childLanes)!==0,Zt||h){if(h=Rt,h!==null&&(i=Bf(h,n),i!==0&&i!==T.retryLane))throw T.retryLane=i,la(t,i),ye(h,t,i),Wr;ku(b)||Ns(),e=nu(t,e,n)}else ku(b)?(e.flags|=192,e.child=t.child,e=null):(t=T.treeContext,kt=_e(b.nextSibling),te=e,St=!0,Mn=null,ke=!1,t!==null&&Rd(e,t),e=eu(e,i.children),e.flags|=4096);return e}return o?(On(),b=i.fallback,o=e.mode,T=t.child,z=T.sibling,i=sn(T,{mode:"hidden",children:i.children}),i.subtreeFlags=T.subtreeFlags&65011712,z!==null?b=sn(z,b):(b=sa(b,o,n,null),b.flags|=2),b.return=e,i.return=e,i.sibling=b,e.child=i,Zi(null,i),i=e.child,b=t.child.memoizedState,b===null?b=Ir(n):(o=b.cachePool,o!==null?(T=Xt._currentValue,o=o.parent!==T?{parent:T,pool:T}:o):o=Ud(),b={baseLanes:b.baseLanes|n,cachePool:o}),i.memoizedState=b,i.childLanes=tu(t,h,n),e.memoizedState=$r,Zi(t.child,i)):(Rn(e),n=t.child,t=n.sibling,n=sn(n,{mode:"visible",children:i.children}),n.return=e,n.sibling=null,t!==null&&(h=e.deletions,h===null?(e.deletions=[t],e.flags|=16):h.push(t)),e.child=n,e.memoizedState=null,n)}function eu(t,e){return e=vs({mode:"visible",children:e},t.mode),e.return=t,t.child=e}function vs(t,e){return t=Te(22,t,null,e),t.lanes=0,t}function nu(t,e,n){return ha(e,t.child,null,n),t=eu(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Ph(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),yr(t.return,e,n)}function au(t,e,n,i,o,u){var h=t.memoizedState;h===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:o,treeForkCount:u}:(h.isBackwards=e,h.rendering=null,h.renderingStartTime=0,h.last=i,h.tail=n,h.tailMode=o,h.treeForkCount=u)}function $h(t,e,n){var i=e.pendingProps,o=i.revealOrder,u=i.tail;i=i.children;var h=Yt.current,b=(h&2)!==0;if(b?(h=h&1|2,e.flags|=128):h&=1,K(Yt,h),ne(t,e,i,n),i=St?Oi:0,!b&&t!==null&&(t.flags&128)!==0)t:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Ph(t,n,e);else if(t.tag===19)Ph(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break t;for(;t.sibling===null;){if(t.return===null||t.return===e)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(o){case"forwards":for(n=e.child,o=null;n!==null;)t=n.alternate,t!==null&&rs(t)===null&&(o=n),n=n.sibling;n=o,n===null?(o=e.child,e.child=null):(o=n.sibling,n.sibling=null),au(e,!1,o,n,u,i);break;case"backwards":case"unstable_legacy-backwards":for(n=null,o=e.child,e.child=null;o!==null;){if(t=o.alternate,t!==null&&rs(t)===null){e.child=o;break}t=o.sibling,o.sibling=n,n=o,o=t}au(e,!0,n,null,u,i);break;case"together":au(e,!1,null,null,void 0,i);break;default:e.memoizedState=null}return e.child}function dn(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Bn|=e.lanes,(n&e.childLanes)===0)if(t!==null){if(Ya(t,e,n,!1),(n&e.childLanes)===0)return null}else return null;if(t!==null&&e.child!==t.child)throw Error(r(153));if(e.child!==null){for(t=e.child,n=sn(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=sn(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function iu(t,e){return(t.lanes&e)!==0?!0:(t=t.dependencies,!!(t!==null&&ts(t)))}function vx(t,e,n){switch(e.tag){case 3:oe(e,e.stateNode.containerInfo),Cn(e,Xt,t.memoizedState.cache),oa();break;case 27:case 5:bi(e);break;case 4:oe(e,e.stateNode.containerInfo);break;case 10:Cn(e,e.type,e.memoizedProps.value);break;case 31:if(e.memoizedState!==null)return e.flags|=128,Nr(e),null;break;case 13:var i=e.memoizedState;if(i!==null)return i.dehydrated!==null?(Rn(e),e.flags|=128,null):(n&e.child.childLanes)!==0?Wh(t,e,n):(Rn(e),t=dn(t,e,n),t!==null?t.sibling:null);Rn(e);break;case 19:var o=(t.flags&128)!==0;if(i=(n&e.childLanes)!==0,i||(Ya(t,e,n,!1),i=(n&e.childLanes)!==0),o){if(i)return $h(t,e,n);e.flags|=128}if(o=e.memoizedState,o!==null&&(o.rendering=null,o.tail=null,o.lastEffect=null),K(Yt,Yt.current),i)break;return null;case 22:return e.lanes=0,Xh(t,e,n,e.pendingProps);case 24:Cn(e,Xt,t.memoizedState.cache)}return dn(t,e,n)}function Ih(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps)Zt=!0;else{if(!iu(t,n)&&(e.flags&128)===0)return Zt=!1,vx(t,e,n);Zt=(t.flags&131072)!==0}else Zt=!1,St&&(e.flags&1048576)!==0&&zd(e,Oi,e.index);switch(e.lanes=0,e.tag){case 16:t:{var i=e.pendingProps;if(t=fa(e.elementType),e.type=t,typeof t=="function")ur(t)?(i=pa(t,i),e.tag=1,e=Jh(null,e,t,i,n)):(e.tag=0,e=Pr(null,e,t,i,n));else{if(t!=null){var o=t.$$typeof;if(o===Y){e.tag=11,e=Gh(null,e,t,i,n);break t}else if(o===q){e.tag=14,e=Yh(null,e,t,i,n);break t}}throw e=mt(t)||t,Error(r(306,e,""))}}return e;case 0:return Pr(t,e,e.type,e.pendingProps,n);case 1:return i=e.type,o=pa(i,e.pendingProps),Jh(t,e,i,o,n);case 3:t:{if(oe(e,e.stateNode.containerInfo),t===null)throw Error(r(387));i=e.pendingProps;var u=e.memoizedState;o=u.element,Ar(t,e),Gi(e,i,null,n);var h=e.memoizedState;if(i=h.cache,Cn(e,Xt,i),i!==u.cache&&br(e,[Xt],n,!0),Hi(),i=h.element,u.isDehydrated)if(u={element:i,isDehydrated:!1,cache:h.cache},e.updateQueue.baseState=u,e.memoizedState=u,e.flags&256){e=Fh(t,e,i,n);break t}else if(i!==o){o=Re(Error(r(424)),e),Vi(o),e=Fh(t,e,i,n);break t}else{switch(t=e.stateNode.containerInfo,t.nodeType){case 9:t=t.body;break;default:t=t.nodeName==="HTML"?t.ownerDocument.body:t}for(kt=_e(t.firstChild),te=e,St=!0,Mn=null,ke=!0,n=Xd(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(oa(),i===o){e=dn(t,e,n);break t}ne(t,e,i,n)}e=e.child}return e;case 26:return xs(t,e),t===null?(n=cp(e.type,null,e.pendingProps,null))?e.memoizedState=n:St||(n=e.type,t=e.pendingProps,i=Bs(pt.current).createElement(n),i[It]=e,i[fe]=t,ae(i,n,t),Pt(i),e.stateNode=i):e.memoizedState=cp(e.type,t.memoizedProps,e.pendingProps,t.memoizedState),null;case 27:return bi(e),t===null&&St&&(i=e.stateNode=op(e.type,e.pendingProps,pt.current),te=e,ke=!0,o=kt,Gn(e.type)?(_u=o,kt=_e(i.firstChild)):kt=o),ne(t,e,e.pendingProps.children,n),xs(t,e),t===null&&(e.flags|=4194304),e.child;case 5:return t===null&&St&&((o=i=kt)&&(i=Wx(i,e.type,e.pendingProps,ke),i!==null?(e.stateNode=i,te=e,kt=_e(i.firstChild),ke=!1,o=!0):o=!1),o||wn(e)),bi(e),o=e.type,u=e.pendingProps,h=t!==null?t.memoizedProps:null,i=u.children,Ru(o,u)?i=null:h!==null&&Ru(o,h)&&(e.flags|=32),e.memoizedState!==null&&(o=zr(t,e,fx,null,null,n),ol._currentValue=o),xs(t,e),ne(t,e,i,n),e.child;case 6:return t===null&&St&&((t=n=kt)&&(n=Px(n,e.pendingProps,ke),n!==null?(e.stateNode=n,te=e,kt=null,t=!0):t=!1),t||wn(e)),null;case 13:return Wh(t,e,n);case 4:return oe(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=ha(e,null,i,n):ne(t,e,i,n),e.child;case 11:return Gh(t,e,e.type,e.pendingProps,n);case 7:return ne(t,e,e.pendingProps,n),e.child;case 8:return ne(t,e,e.pendingProps.children,n),e.child;case 12:return ne(t,e,e.pendingProps.children,n),e.child;case 10:return i=e.pendingProps,Cn(e,e.type,i.value),ne(t,e,i.children,n),e.child;case 9:return o=e.type._context,i=e.pendingProps.children,ua(e),o=ee(o),i=i(o),e.flags|=1,ne(t,e,i,n),e.child;case 14:return Yh(t,e,e.type,e.pendingProps,n);case 15:return qh(t,e,e.type,e.pendingProps,n);case 19:return $h(t,e,n);case 31:return xx(t,e,n);case 22:return Xh(t,e,n,e.pendingProps);case 24:return ua(e),i=ee(Xt),t===null?(o=Sr(),o===null&&(o=Rt,u=xr(),o.pooledCache=u,u.refCount++,u!==null&&(o.pooledCacheLanes|=n),o=u),e.memoizedState={parent:i,cache:o},jr(e),Cn(e,Xt,o)):((t.lanes&n)!==0&&(Ar(t,e),Gi(e,null,null,n),Hi()),o=t.memoizedState,u=e.memoizedState,o.parent!==i?(o={parent:i,cache:i},e.memoizedState=o,e.lanes===0&&(e.memoizedState=e.updateQueue.baseState=o),Cn(e,Xt,i)):(i=u.cache,Cn(e,Xt,i),i!==o.cache&&br(e,[Xt],n,!0))),ne(t,e,e.pendingProps.children,n),e.child;case 29:throw e.pendingProps}throw Error(r(156,e.tag))}function hn(t){t.flags|=4}function lu(t,e,n,i,o){if((e=(t.mode&32)!==0)&&(e=!1),e){if(t.flags|=16777216,(o&335544128)===o)if(t.stateNode.complete)t.flags|=8192;else if(Mm())t.flags|=8192;else throw da=is,Tr}else t.flags&=-16777217}function tm(t,e){if(e.type!=="stylesheet"||(e.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!pp(e))if(Mm())t.flags|=8192;else throw da=is,Tr}function Ss(t,e){e!==null&&(t.flags|=4),t.flags&16384&&(e=t.tag!==22?Of():536870912,t.lanes|=e,ti|=e)}function Ki(t,e){if(!St)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Bt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var o=t.child;o!==null;)n|=o.lanes|o.childLanes,i|=o.subtreeFlags&65011712,i|=o.flags&65011712,o.return=t,o=o.sibling;else for(o=t.child;o!==null;)n|=o.lanes|o.childLanes,i|=o.subtreeFlags,i|=o.flags,o.return=t,o=o.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Sx(t,e,n){var i=e.pendingProps;switch(hr(e),e.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Bt(e),null;case 1:return Bt(e),null;case 3:return n=e.stateNode,i=null,t!==null&&(i=t.memoizedState.cache),e.memoizedState.cache!==i&&(e.flags|=2048),un(Xt),Gt(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(t===null||t.child===null)&&(Ga(e)?hn(e):t===null||t.memoizedState.isDehydrated&&(e.flags&256)===0||(e.flags|=1024,pr())),Bt(e),null;case 26:var o=e.type,u=e.memoizedState;return t===null?(hn(e),u!==null?(Bt(e),tm(e,u)):(Bt(e),lu(e,o,null,i,n))):u?u!==t.memoizedState?(hn(e),Bt(e),tm(e,u)):(Bt(e),e.flags&=-16777217):(t=t.memoizedProps,t!==i&&hn(e),Bt(e),lu(e,o,t,i,n)),null;case 27:if(Rl(e),n=pt.current,o=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==i&&hn(e);else{if(!i){if(e.stateNode===null)throw Error(r(166));return Bt(e),null}t=W.current,Ga(e)?Od(e):(t=op(o,i,n),e.stateNode=t,hn(e))}return Bt(e),null;case 5:if(Rl(e),o=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==i&&hn(e);else{if(!i){if(e.stateNode===null)throw Error(r(166));return Bt(e),null}if(u=W.current,Ga(e))Od(e);else{var h=Bs(pt.current);switch(u){case 1:u=h.createElementNS("http://www.w3.org/2000/svg",o);break;case 2:u=h.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;default:switch(o){case"svg":u=h.createElementNS("http://www.w3.org/2000/svg",o);break;case"math":u=h.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;case"script":u=h.createElement("div"),u.innerHTML="<script><\/script>",u=u.removeChild(u.firstChild);break;case"select":u=typeof i.is=="string"?h.createElement("select",{is:i.is}):h.createElement("select"),i.multiple?u.multiple=!0:i.size&&(u.size=i.size);break;default:u=typeof i.is=="string"?h.createElement(o,{is:i.is}):h.createElement(o)}}u[It]=e,u[fe]=i;t:for(h=e.child;h!==null;){if(h.tag===5||h.tag===6)u.appendChild(h.stateNode);else if(h.tag!==4&&h.tag!==27&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===e)break t;for(;h.sibling===null;){if(h.return===null||h.return===e)break t;h=h.return}h.sibling.return=h.return,h=h.sibling}e.stateNode=u;t:switch(ae(u,o,i),o){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break t;case"img":i=!0;break t;default:i=!1}i&&hn(e)}}return Bt(e),lu(e,e.type,t===null?null:t.memoizedProps,e.pendingProps,n),null;case 6:if(t&&e.stateNode!=null)t.memoizedProps!==i&&hn(e);else{if(typeof i!="string"&&e.stateNode===null)throw Error(r(166));if(t=pt.current,Ga(e)){if(t=e.stateNode,n=e.memoizedProps,i=null,o=te,o!==null)switch(o.tag){case 27:case 5:i=o.memoizedProps}t[It]=e,t=!!(t.nodeValue===n||i!==null&&i.suppressHydrationWarning===!0||Wm(t.nodeValue,n)),t||wn(e,!0)}else t=Bs(t).createTextNode(i),t[It]=e,e.stateNode=t}return Bt(e),null;case 31:if(n=e.memoizedState,t===null||t.memoizedState!==null){if(i=Ga(e),n!==null){if(t===null){if(!i)throw Error(r(318));if(t=e.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(557));t[It]=e}else oa(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;Bt(e),t=!1}else n=pr(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=n),t=!0;if(!t)return e.flags&256?(Ae(e),e):(Ae(e),null);if((e.flags&128)!==0)throw Error(r(558))}return Bt(e),null;case 13:if(i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(o=Ga(e),i!==null&&i.dehydrated!==null){if(t===null){if(!o)throw Error(r(318));if(o=e.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(r(317));o[It]=e}else oa(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;Bt(e),o=!1}else o=pr(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=o),o=!0;if(!o)return e.flags&256?(Ae(e),e):(Ae(e),null)}return Ae(e),(e.flags&128)!==0?(e.lanes=n,e):(n=i!==null,t=t!==null&&t.memoizedState!==null,n&&(i=e.child,o=null,i.alternate!==null&&i.alternate.memoizedState!==null&&i.alternate.memoizedState.cachePool!==null&&(o=i.alternate.memoizedState.cachePool.pool),u=null,i.memoizedState!==null&&i.memoizedState.cachePool!==null&&(u=i.memoizedState.cachePool.pool),u!==o&&(i.flags|=2048)),n!==t&&n&&(e.child.flags|=8192),Ss(e,e.updateQueue),Bt(e),null);case 4:return Gt(),t===null&&wu(e.stateNode.containerInfo),Bt(e),null;case 10:return un(e.type),Bt(e),null;case 19:if(H(Yt),i=e.memoizedState,i===null)return Bt(e),null;if(o=(e.flags&128)!==0,u=i.rendering,u===null)if(o)Ki(i,!1);else{if(Lt!==0||t!==null&&(t.flags&128)!==0)for(t=e.child;t!==null;){if(u=rs(t),u!==null){for(e.flags|=128,Ki(i,!1),t=u.updateQueue,e.updateQueue=t,Ss(e,t),e.subtreeFlags=0,t=n,n=e.child;n!==null;)Cd(n,t),n=n.sibling;return K(Yt,Yt.current&1|2),St&&on(e,i.treeForkCount),e.child}t=t.sibling}i.tail!==null&&be()>Ms&&(e.flags|=128,o=!0,Ki(i,!1),e.lanes=4194304)}else{if(!o)if(t=rs(u),t!==null){if(e.flags|=128,o=!0,t=t.updateQueue,e.updateQueue=t,Ss(e,t),Ki(i,!0),i.tail===null&&i.tailMode==="hidden"&&!u.alternate&&!St)return Bt(e),null}else 2*be()-i.renderingStartTime>Ms&&n!==536870912&&(e.flags|=128,o=!0,Ki(i,!1),e.lanes=4194304);i.isBackwards?(u.sibling=e.child,e.child=u):(t=i.last,t!==null?t.sibling=u:e.child=u,i.last=u)}return i.tail!==null?(t=i.tail,i.rendering=t,i.tail=t.sibling,i.renderingStartTime=be(),t.sibling=null,n=Yt.current,K(Yt,o?n&1|2:n&1),St&&on(e,i.treeForkCount),t):(Bt(e),null);case 22:case 23:return Ae(e),Cr(),i=e.memoizedState!==null,t!==null?t.memoizedState!==null!==i&&(e.flags|=8192):i&&(e.flags|=8192),i?(n&536870912)!==0&&(e.flags&128)===0&&(Bt(e),e.subtreeFlags&6&&(e.flags|=8192)):Bt(e),n=e.updateQueue,n!==null&&Ss(e,n.retryQueue),n=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(n=t.memoizedState.cachePool.pool),i=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(i=e.memoizedState.cachePool.pool),i!==n&&(e.flags|=2048),t!==null&&H(ca),null;case 24:return n=null,t!==null&&(n=t.memoizedState.cache),e.memoizedState.cache!==n&&(e.flags|=2048),un(Xt),Bt(e),null;case 25:return null;case 30:return null}throw Error(r(156,e.tag))}function Tx(t,e){switch(hr(e),e.tag){case 1:return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return un(Xt),Gt(),t=e.flags,(t&65536)!==0&&(t&128)===0?(e.flags=t&-65537|128,e):null;case 26:case 27:case 5:return Rl(e),null;case 31:if(e.memoizedState!==null){if(Ae(e),e.alternate===null)throw Error(r(340));oa()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 13:if(Ae(e),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(r(340));oa()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return H(Yt),null;case 4:return Gt(),null;case 10:return un(e.type),null;case 22:case 23:return Ae(e),Cr(),t!==null&&H(ca),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 24:return un(Xt),null;case 25:return null;default:return null}}function em(t,e){switch(hr(e),e.tag){case 3:un(Xt),Gt();break;case 26:case 27:case 5:Rl(e);break;case 4:Gt();break;case 31:e.memoizedState!==null&&Ae(e);break;case 13:Ae(e);break;case 19:H(Yt);break;case 10:un(e.type);break;case 22:case 23:Ae(e),Cr(),t!==null&&H(ca);break;case 24:un(Xt)}}function Ji(t,e){try{var n=e.updateQueue,i=n!==null?n.lastEffect:null;if(i!==null){var o=i.next;n=o;do{if((n.tag&t)===t){i=void 0;var u=n.create,h=n.inst;i=u(),h.destroy=i}n=n.next}while(n!==o)}}catch(b){Ct(e,e.return,b)}}function Vn(t,e,n){try{var i=e.updateQueue,o=i!==null?i.lastEffect:null;if(o!==null){var u=o.next;i=u;do{if((i.tag&t)===t){var h=i.inst,b=h.destroy;if(b!==void 0){h.destroy=void 0,o=e;var T=n,z=b;try{z()}catch(U){Ct(o,T,U)}}}i=i.next}while(i!==u)}}catch(U){Ct(e,e.return,U)}}function nm(t){var e=t.updateQueue;if(e!==null){var n=t.stateNode;try{Zd(e,n)}catch(i){Ct(t,t.return,i)}}}function am(t,e,n){n.props=pa(t.type,t.memoizedProps),n.state=t.memoizedState;try{n.componentWillUnmount()}catch(i){Ct(t,e,i)}}function Fi(t,e){try{var n=t.ref;if(n!==null){switch(t.tag){case 26:case 27:case 5:var i=t.stateNode;break;case 30:i=t.stateNode;break;default:i=t.stateNode}typeof n=="function"?t.refCleanup=n(i):n.current=i}}catch(o){Ct(t,e,o)}}function Fe(t,e){var n=t.ref,i=t.refCleanup;if(n!==null)if(typeof i=="function")try{i()}catch(o){Ct(t,e,o)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(o){Ct(t,e,o)}else n.current=null}function im(t){var e=t.type,n=t.memoizedProps,i=t.stateNode;try{t:switch(e){case"button":case"input":case"select":case"textarea":n.autoFocus&&i.focus();break t;case"img":n.src?i.src=n.src:n.srcSet&&(i.srcset=n.srcSet)}}catch(o){Ct(t,t.return,o)}}function su(t,e,n){try{var i=t.stateNode;Xx(i,t.type,n,e),i[fe]=e}catch(o){Ct(t,t.return,o)}}function lm(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&Gn(t.type)||t.tag===4}function ou(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||lm(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&Gn(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function ru(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(t,e):(e=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,e.appendChild(t),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=an));else if(i!==4&&(i===27&&Gn(t.type)&&(n=t.stateNode,e=null),t=t.child,t!==null))for(ru(t,e,n),t=t.sibling;t!==null;)ru(t,e,n),t=t.sibling}function Ts(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(i===27&&Gn(t.type)&&(n=t.stateNode),t=t.child,t!==null))for(Ts(t,e,n),t=t.sibling;t!==null;)Ts(t,e,n),t=t.sibling}function sm(t){var e=t.stateNode,n=t.memoizedProps;try{for(var i=t.type,o=e.attributes;o.length;)e.removeAttributeNode(o[0]);ae(e,i,n),e[It]=t,e[fe]=n}catch(u){Ct(t,t.return,u)}}var mn=!1,Kt=!1,uu=!1,om=typeof WeakSet=="function"?WeakSet:Set,$t=null;function jx(t,e){if(t=t.containerInfo,Du=qs,t=xd(t),nr(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else t:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var o=i.anchorOffset,u=i.focusNode;i=i.focusOffset;try{n.nodeType,u.nodeType}catch{n=null;break t}var h=0,b=-1,T=-1,z=0,U=0,G=t,R=null;e:for(;;){for(var k;G!==n||o!==0&&G.nodeType!==3||(b=h+o),G!==u||i!==0&&G.nodeType!==3||(T=h+i),G.nodeType===3&&(h+=G.nodeValue.length),(k=G.firstChild)!==null;)R=G,G=k;for(;;){if(G===t)break e;if(R===n&&++z===o&&(b=h),R===u&&++U===i&&(T=h),(k=G.nextSibling)!==null)break;G=R,R=G.parentNode}G=k}n=b===-1||T===-1?null:{start:b,end:T}}else n=null}n=n||{start:0,end:0}}else n=null;for(zu={focusedElem:t,selectionRange:n},qs=!1,$t=e;$t!==null;)if(e=$t,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,$t=t;else for(;$t!==null;){switch(e=$t,u=e.alternate,t=e.flags,e.tag){case 0:if((t&4)!==0&&(t=e.updateQueue,t=t!==null?t.events:null,t!==null))for(n=0;n<t.length;n++)o=t[n],o.ref.impl=o.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&u!==null){t=void 0,n=e,o=u.memoizedProps,u=u.memoizedState,i=n.stateNode;try{var P=pa(n.type,o);t=i.getSnapshotBeforeUpdate(P,u),i.__reactInternalSnapshotBeforeUpdate=t}catch(lt){Ct(n,n.return,lt)}}break;case 3:if((t&1024)!==0){if(t=e.stateNode.containerInfo,n=t.nodeType,n===9)Vu(t);else if(n===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":Vu(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(r(163))}if(t=e.sibling,t!==null){t.return=e.return,$t=t;break}$t=e.return}}function rm(t,e,n){var i=n.flags;switch(n.tag){case 0:case 11:case 15:gn(t,n),i&4&&Ji(5,n);break;case 1:if(gn(t,n),i&4)if(t=n.stateNode,e===null)try{t.componentDidMount()}catch(h){Ct(n,n.return,h)}else{var o=pa(n.type,e.memoizedProps);e=e.memoizedState;try{t.componentDidUpdate(o,e,t.__reactInternalSnapshotBeforeUpdate)}catch(h){Ct(n,n.return,h)}}i&64&&nm(n),i&512&&Fi(n,n.return);break;case 3:if(gn(t,n),i&64&&(t=n.updateQueue,t!==null)){if(e=null,n.child!==null)switch(n.child.tag){case 27:case 5:e=n.child.stateNode;break;case 1:e=n.child.stateNode}try{Zd(t,e)}catch(h){Ct(n,n.return,h)}}break;case 27:e===null&&i&4&&sm(n);case 26:case 5:gn(t,n),e===null&&i&4&&im(n),i&512&&Fi(n,n.return);break;case 12:gn(t,n);break;case 31:gn(t,n),i&4&&fm(t,n);break;case 13:gn(t,n),i&4&&dm(t,n),i&64&&(t=n.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(n=Rx.bind(null,n),$x(t,n))));break;case 22:if(i=n.memoizedState!==null||mn,!i){e=e!==null&&e.memoizedState!==null||Kt,o=mn;var u=Kt;mn=i,(Kt=e)&&!u?yn(t,n,(n.subtreeFlags&8772)!==0):gn(t,n),mn=o,Kt=u}break;case 30:break;default:gn(t,n)}}function um(t){var e=t.alternate;e!==null&&(t.alternate=null,um(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&Lo(e)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var _t=null,he=!1;function pn(t,e,n){for(n=n.child;n!==null;)cm(t,e,n),n=n.sibling}function cm(t,e,n){if(xe&&typeof xe.onCommitFiberUnmount=="function")try{xe.onCommitFiberUnmount(xi,n)}catch{}switch(n.tag){case 26:Kt||Fe(n,e),pn(t,e,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:Kt||Fe(n,e);var i=_t,o=he;Gn(n.type)&&(_t=n.stateNode,he=!1),pn(t,e,n),il(n.stateNode),_t=i,he=o;break;case 5:Kt||Fe(n,e);case 6:if(i=_t,o=he,_t=null,pn(t,e,n),_t=i,he=o,_t!==null)if(he)try{(_t.nodeType===9?_t.body:_t.nodeName==="HTML"?_t.ownerDocument.body:_t).removeChild(n.stateNode)}catch(u){Ct(n,e,u)}else try{_t.removeChild(n.stateNode)}catch(u){Ct(n,e,u)}break;case 18:_t!==null&&(he?(t=_t,np(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,n.stateNode),ri(t)):np(_t,n.stateNode));break;case 4:i=_t,o=he,_t=n.stateNode.containerInfo,he=!0,pn(t,e,n),_t=i,he=o;break;case 0:case 11:case 14:case 15:Vn(2,n,e),Kt||Vn(4,n,e),pn(t,e,n);break;case 1:Kt||(Fe(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"&&am(n,e,i)),pn(t,e,n);break;case 21:pn(t,e,n);break;case 22:Kt=(i=Kt)||n.memoizedState!==null,pn(t,e,n),Kt=i;break;default:pn(t,e,n)}}function fm(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{ri(t)}catch(n){Ct(e,e.return,n)}}}function dm(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{ri(t)}catch(n){Ct(e,e.return,n)}}function Ax(t){switch(t.tag){case 31:case 13:case 19:var e=t.stateNode;return e===null&&(e=t.stateNode=new om),e;case 22:return t=t.stateNode,e=t._retryCache,e===null&&(e=t._retryCache=new om),e;default:throw Error(r(435,t.tag))}}function js(t,e){var n=Ax(t);e.forEach(function(i){if(!n.has(i)){n.add(i);var o=Ox.bind(null,t,i);i.then(o,o)}})}function me(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var o=n[i],u=t,h=e,b=h;t:for(;b!==null;){switch(b.tag){case 27:if(Gn(b.type)){_t=b.stateNode,he=!1;break t}break;case 5:_t=b.stateNode,he=!1;break t;case 3:case 4:_t=b.stateNode.containerInfo,he=!0;break t}b=b.return}if(_t===null)throw Error(r(160));cm(u,h,o),_t=null,he=!1,u=o.alternate,u!==null&&(u.return=null),o.return=null}if(e.subtreeFlags&13886)for(e=e.child;e!==null;)hm(e,t),e=e.sibling}var Ye=null;function hm(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:me(e,t),pe(t),i&4&&(Vn(3,t,t.return),Ji(3,t),Vn(5,t,t.return));break;case 1:me(e,t),pe(t),i&512&&(Kt||n===null||Fe(n,n.return)),i&64&&mn&&(t=t.updateQueue,t!==null&&(i=t.callbacks,i!==null&&(n=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=n===null?i:n.concat(i))));break;case 26:var o=Ye;if(me(e,t),pe(t),i&512&&(Kt||n===null||Fe(n,n.return)),i&4){var u=n!==null?n.memoizedState:null;if(i=t.memoizedState,n===null)if(i===null)if(t.stateNode===null){t:{i=t.type,n=t.memoizedProps,o=o.ownerDocument||o;e:switch(i){case"title":u=o.getElementsByTagName("title")[0],(!u||u[Ti]||u[It]||u.namespaceURI==="http://www.w3.org/2000/svg"||u.hasAttribute("itemprop"))&&(u=o.createElement(i),o.head.insertBefore(u,o.querySelector("head > title"))),ae(u,i,n),u[It]=t,Pt(u),i=u;break t;case"link":var h=hp("link","href",o).get(i+(n.href||""));if(h){for(var b=0;b<h.length;b++)if(u=h[b],u.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&u.getAttribute("rel")===(n.rel==null?null:n.rel)&&u.getAttribute("title")===(n.title==null?null:n.title)&&u.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){h.splice(b,1);break e}}u=o.createElement(i),ae(u,i,n),o.head.appendChild(u);break;case"meta":if(h=hp("meta","content",o).get(i+(n.content||""))){for(b=0;b<h.length;b++)if(u=h[b],u.getAttribute("content")===(n.content==null?null:""+n.content)&&u.getAttribute("name")===(n.name==null?null:n.name)&&u.getAttribute("property")===(n.property==null?null:n.property)&&u.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&u.getAttribute("charset")===(n.charSet==null?null:n.charSet)){h.splice(b,1);break e}}u=o.createElement(i),ae(u,i,n),o.head.appendChild(u);break;default:throw Error(r(468,i))}u[It]=t,Pt(u),i=u}t.stateNode=i}else mp(o,t.type,t.stateNode);else t.stateNode=dp(o,i,t.memoizedProps);else u!==i?(u===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):u.count--,i===null?mp(o,t.type,t.stateNode):dp(o,i,t.memoizedProps)):i===null&&t.stateNode!==null&&su(t,t.memoizedProps,n.memoizedProps)}break;case 27:me(e,t),pe(t),i&512&&(Kt||n===null||Fe(n,n.return)),n!==null&&i&4&&su(t,t.memoizedProps,n.memoizedProps);break;case 5:if(me(e,t),pe(t),i&512&&(Kt||n===null||Fe(n,n.return)),t.flags&32){o=t.stateNode;try{za(o,"")}catch(P){Ct(t,t.return,P)}}i&4&&t.stateNode!=null&&(o=t.memoizedProps,su(t,o,n!==null?n.memoizedProps:o)),i&1024&&(uu=!0);break;case 6:if(me(e,t),pe(t),i&4){if(t.stateNode===null)throw Error(r(162));i=t.memoizedProps,n=t.stateNode;try{n.nodeValue=i}catch(P){Ct(t,t.return,P)}}break;case 3:if(Ls=null,o=Ye,Ye=_s(e.containerInfo),me(e,t),Ye=o,pe(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{ri(e.containerInfo)}catch(P){Ct(t,t.return,P)}uu&&(uu=!1,mm(t));break;case 4:i=Ye,Ye=_s(t.stateNode.containerInfo),me(e,t),pe(t),Ye=i;break;case 12:me(e,t),pe(t);break;case 31:me(e,t),pe(t),i&4&&(i=t.updateQueue,i!==null&&(t.updateQueue=null,js(t,i)));break;case 13:me(e,t),pe(t),t.child.flags&8192&&t.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(Es=be()),i&4&&(i=t.updateQueue,i!==null&&(t.updateQueue=null,js(t,i)));break;case 22:o=t.memoizedState!==null;var T=n!==null&&n.memoizedState!==null,z=mn,U=Kt;if(mn=z||o,Kt=U||T,me(e,t),Kt=U,mn=z,pe(t),i&8192)t:for(e=t.stateNode,e._visibility=o?e._visibility&-2:e._visibility|1,o&&(n===null||T||mn||Kt||ga(t)),n=null,e=t;;){if(e.tag===5||e.tag===26){if(n===null){T=n=e;try{if(u=T.stateNode,o)h=u.style,typeof h.setProperty=="function"?h.setProperty("display","none","important"):h.display="none";else{b=T.stateNode;var G=T.memoizedProps.style,R=G!=null&&G.hasOwnProperty("display")?G.display:null;b.style.display=R==null||typeof R=="boolean"?"":(""+R).trim()}}catch(P){Ct(T,T.return,P)}}}else if(e.tag===6){if(n===null){T=e;try{T.stateNode.nodeValue=o?"":T.memoizedProps}catch(P){Ct(T,T.return,P)}}}else if(e.tag===18){if(n===null){T=e;try{var k=T.stateNode;o?ap(k,!0):ap(T.stateNode,!1)}catch(P){Ct(T,T.return,P)}}}else if((e.tag!==22&&e.tag!==23||e.memoizedState===null||e===t)&&e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break t;for(;e.sibling===null;){if(e.return===null||e.return===t)break t;n===e&&(n=null),e=e.return}n===e&&(n=null),e.sibling.return=e.return,e=e.sibling}i&4&&(i=t.updateQueue,i!==null&&(n=i.retryQueue,n!==null&&(i.retryQueue=null,js(t,n))));break;case 19:me(e,t),pe(t),i&4&&(i=t.updateQueue,i!==null&&(t.updateQueue=null,js(t,i)));break;case 30:break;case 21:break;default:me(e,t),pe(t)}}function pe(t){var e=t.flags;if(e&2){try{for(var n,i=t.return;i!==null;){if(lm(i)){n=i;break}i=i.return}if(n==null)throw Error(r(160));switch(n.tag){case 27:var o=n.stateNode,u=ou(t);Ts(t,u,o);break;case 5:var h=n.stateNode;n.flags&32&&(za(h,""),n.flags&=-33);var b=ou(t);Ts(t,b,h);break;case 3:case 4:var T=n.stateNode.containerInfo,z=ou(t);ru(t,z,T);break;default:throw Error(r(161))}}catch(U){Ct(t,t.return,U)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function mm(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var e=t;mm(e),e.tag===5&&e.flags&1024&&e.stateNode.reset(),t=t.sibling}}function gn(t,e){if(e.subtreeFlags&8772)for(e=e.child;e!==null;)rm(t,e.alternate,e),e=e.sibling}function ga(t){for(t=t.child;t!==null;){var e=t;switch(e.tag){case 0:case 11:case 14:case 15:Vn(4,e,e.return),ga(e);break;case 1:Fe(e,e.return);var n=e.stateNode;typeof n.componentWillUnmount=="function"&&am(e,e.return,n),ga(e);break;case 27:il(e.stateNode);case 26:case 5:Fe(e,e.return),ga(e);break;case 22:e.memoizedState===null&&ga(e);break;case 30:ga(e);break;default:ga(e)}t=t.sibling}}function yn(t,e,n){for(n=n&&(e.subtreeFlags&8772)!==0,e=e.child;e!==null;){var i=e.alternate,o=t,u=e,h=u.flags;switch(u.tag){case 0:case 11:case 15:yn(o,u,n),Ji(4,u);break;case 1:if(yn(o,u,n),i=u,o=i.stateNode,typeof o.componentDidMount=="function")try{o.componentDidMount()}catch(z){Ct(i,i.return,z)}if(i=u,o=i.updateQueue,o!==null){var b=i.stateNode;try{var T=o.shared.hiddenCallbacks;if(T!==null)for(o.shared.hiddenCallbacks=null,o=0;o<T.length;o++)Qd(T[o],b)}catch(z){Ct(i,i.return,z)}}n&&h&64&&nm(u),Fi(u,u.return);break;case 27:sm(u);case 26:case 5:yn(o,u,n),n&&i===null&&h&4&&im(u),Fi(u,u.return);break;case 12:yn(o,u,n);break;case 31:yn(o,u,n),n&&h&4&&fm(o,u);break;case 13:yn(o,u,n),n&&h&4&&dm(o,u);break;case 22:u.memoizedState===null&&yn(o,u,n),Fi(u,u.return);break;case 30:break;default:yn(o,u,n)}e=e.sibling}}function cu(t,e){var n=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(n=t.memoizedState.cachePool.pool),t=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),t!==n&&(t!=null&&t.refCount++,n!=null&&ki(n))}function fu(t,e){t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&ki(t))}function qe(t,e,n,i){if(e.subtreeFlags&10256)for(e=e.child;e!==null;)pm(t,e,n,i),e=e.sibling}function pm(t,e,n,i){var o=e.flags;switch(e.tag){case 0:case 11:case 15:qe(t,e,n,i),o&2048&&Ji(9,e);break;case 1:qe(t,e,n,i);break;case 3:qe(t,e,n,i),o&2048&&(t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&ki(t)));break;case 12:if(o&2048){qe(t,e,n,i),t=e.stateNode;try{var u=e.memoizedProps,h=u.id,b=u.onPostCommit;typeof b=="function"&&b(h,e.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(T){Ct(e,e.return,T)}}else qe(t,e,n,i);break;case 31:qe(t,e,n,i);break;case 13:qe(t,e,n,i);break;case 23:break;case 22:u=e.stateNode,h=e.alternate,e.memoizedState!==null?u._visibility&2?qe(t,e,n,i):Wi(t,e):u._visibility&2?qe(t,e,n,i):(u._visibility|=2,Pa(t,e,n,i,(e.subtreeFlags&10256)!==0||!1)),o&2048&&cu(h,e);break;case 24:qe(t,e,n,i),o&2048&&fu(e.alternate,e);break;default:qe(t,e,n,i)}}function Pa(t,e,n,i,o){for(o=o&&((e.subtreeFlags&10256)!==0||!1),e=e.child;e!==null;){var u=t,h=e,b=n,T=i,z=h.flags;switch(h.tag){case 0:case 11:case 15:Pa(u,h,b,T,o),Ji(8,h);break;case 23:break;case 22:var U=h.stateNode;h.memoizedState!==null?U._visibility&2?Pa(u,h,b,T,o):Wi(u,h):(U._visibility|=2,Pa(u,h,b,T,o)),o&&z&2048&&cu(h.alternate,h);break;case 24:Pa(u,h,b,T,o),o&&z&2048&&fu(h.alternate,h);break;default:Pa(u,h,b,T,o)}e=e.sibling}}function Wi(t,e){if(e.subtreeFlags&10256)for(e=e.child;e!==null;){var n=t,i=e,o=i.flags;switch(i.tag){case 22:Wi(n,i),o&2048&&cu(i.alternate,i);break;case 24:Wi(n,i),o&2048&&fu(i.alternate,i);break;default:Wi(n,i)}e=e.sibling}}var Pi=8192;function $a(t,e,n){if(t.subtreeFlags&Pi)for(t=t.child;t!==null;)gm(t,e,n),t=t.sibling}function gm(t,e,n){switch(t.tag){case 26:$a(t,e,n),t.flags&Pi&&t.memoizedState!==null&&cv(n,Ye,t.memoizedState,t.memoizedProps);break;case 5:$a(t,e,n);break;case 3:case 4:var i=Ye;Ye=_s(t.stateNode.containerInfo),$a(t,e,n),Ye=i;break;case 22:t.memoizedState===null&&(i=t.alternate,i!==null&&i.memoizedState!==null?(i=Pi,Pi=16777216,$a(t,e,n),Pi=i):$a(t,e,n));break;default:$a(t,e,n)}}function ym(t){var e=t.alternate;if(e!==null&&(t=e.child,t!==null)){e.child=null;do e=t.sibling,t.sibling=null,t=e;while(t!==null)}}function $i(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var n=0;n<e.length;n++){var i=e[n];$t=i,xm(i,t)}ym(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)bm(t),t=t.sibling}function bm(t){switch(t.tag){case 0:case 11:case 15:$i(t),t.flags&2048&&Vn(9,t,t.return);break;case 3:$i(t);break;case 12:$i(t);break;case 22:var e=t.stateNode;t.memoizedState!==null&&e._visibility&2&&(t.return===null||t.return.tag!==13)?(e._visibility&=-3,As(t)):$i(t);break;default:$i(t)}}function As(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var n=0;n<e.length;n++){var i=e[n];$t=i,xm(i,t)}ym(t)}for(t=t.child;t!==null;){switch(e=t,e.tag){case 0:case 11:case 15:Vn(8,e,e.return),As(e);break;case 22:n=e.stateNode,n._visibility&2&&(n._visibility&=-3,As(e));break;default:As(e)}t=t.sibling}}function xm(t,e){for(;$t!==null;){var n=$t;switch(n.tag){case 0:case 11:case 15:Vn(8,n,e);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var i=n.memoizedState.cachePool.pool;i!=null&&i.refCount++}break;case 24:ki(n.memoizedState.cache)}if(i=n.child,i!==null)i.return=n,$t=i;else t:for(n=t;$t!==null;){i=$t;var o=i.sibling,u=i.return;if(um(i),i===n){$t=null;break t}if(o!==null){o.return=u,$t=o;break t}$t=u}}}var Ex={getCacheForType:function(t){var e=ee(Xt),n=e.data.get(t);return n===void 0&&(n=t(),e.data.set(t,n)),n},cacheSignal:function(){return ee(Xt).controller.signal}},Mx=typeof WeakMap=="function"?WeakMap:Map,Et=0,Rt=null,gt=null,bt=0,wt=0,Ee=null,kn=!1,Ia=!1,du=!1,bn=0,Lt=0,Bn=0,ya=0,hu=0,Me=0,ti=0,Ii=null,ge=null,mu=!1,Es=0,vm=0,Ms=1/0,ws=null,_n=null,Ft=0,Un=null,ei=null,xn=0,pu=0,gu=null,Sm=null,tl=0,yu=null;function we(){return(Et&2)!==0&&bt!==0?bt&-bt:O.T!==null?ju():_f()}function Tm(){if(Me===0)if((bt&536870912)===0||St){var t=kl;kl<<=1,(kl&3932160)===0&&(kl=262144),Me=t}else Me=536870912;return t=je.current,t!==null&&(t.flags|=32),Me}function ye(t,e,n){(t===Rt&&(wt===2||wt===9)||t.cancelPendingCommit!==null)&&(ni(t,0),Ln(t,bt,Me,!1)),Si(t,n),((Et&2)===0||t!==Rt)&&(t===Rt&&((Et&2)===0&&(ya|=n),Lt===4&&Ln(t,bt,Me,!1)),We(t))}function jm(t,e,n){if((Et&6)!==0)throw Error(r(327));var i=!n&&(e&127)===0&&(e&t.expiredLanes)===0||vi(t,e),o=i?Nx(t,e):xu(t,e,!0),u=i;do{if(o===0){Ia&&!i&&Ln(t,e,0,!1);break}else{if(n=t.current.alternate,u&&!wx(n)){o=xu(t,e,!1),u=!1;continue}if(o===2){if(u=e,t.errorRecoveryDisabledLanes&u)var h=0;else h=t.pendingLanes&-536870913,h=h!==0?h:h&536870912?536870912:0;if(h!==0){e=h;t:{var b=t;o=Ii;var T=b.current.memoizedState.isDehydrated;if(T&&(ni(b,h).flags|=256),h=xu(b,h,!1),h!==2){if(du&&!T){b.errorRecoveryDisabledLanes|=u,ya|=u,o=4;break t}u=ge,ge=o,u!==null&&(ge===null?ge=u:ge.push.apply(ge,u))}o=h}if(u=!1,o!==2)continue}}if(o===1){ni(t,0),Ln(t,e,0,!0);break}t:{switch(i=t,u=o,u){case 0:case 1:throw Error(r(345));case 4:if((e&4194048)!==e)break;case 6:Ln(i,e,Me,!kn);break t;case 2:ge=null;break;case 3:case 5:break;default:throw Error(r(329))}if((e&62914560)===e&&(o=Es+300-be(),10<o)){if(Ln(i,e,Me,!kn),_l(i,0,!0)!==0)break t;xn=e,i.timeoutHandle=tp(Am.bind(null,i,n,ge,ws,mu,e,Me,ya,ti,kn,u,"Throttled",-0,0),o);break t}Am(i,n,ge,ws,mu,e,Me,ya,ti,kn,u,null,-0,0)}}break}while(!0);We(t)}function Am(t,e,n,i,o,u,h,b,T,z,U,G,R,k){if(t.timeoutHandle=-1,G=e.subtreeFlags,G&8192||(G&16785408)===16785408){G={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:an},gm(e,u,G);var P=(u&62914560)===u?Es-be():(u&4194048)===u?vm-be():0;if(P=fv(G,P),P!==null){xn=u,t.cancelPendingCommit=P(Rm.bind(null,t,e,u,n,i,o,h,b,T,U,G,null,R,k)),Ln(t,u,h,!z);return}}Rm(t,e,u,n,i,o,h,b,T)}function wx(t){for(var e=t;;){var n=e.tag;if((n===0||n===11||n===15)&&e.flags&16384&&(n=e.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var i=0;i<n.length;i++){var o=n[i],u=o.getSnapshot;o=o.value;try{if(!Se(u(),o))return!1}catch{return!1}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Ln(t,e,n,i){e&=~hu,e&=~ya,t.suspendedLanes|=e,t.pingedLanes&=~e,i&&(t.warmLanes|=e),i=t.expirationTimes;for(var o=e;0<o;){var u=31-ve(o),h=1<<u;i[u]=-1,o&=~h}n!==0&&Vf(t,n,e)}function Cs(){return(Et&6)===0?(el(0),!1):!0}function bu(){if(gt!==null){if(wt===0)var t=gt.return;else t=gt,rn=ra=null,Vr(t),Za=null,_i=0,t=gt;for(;t!==null;)em(t.alternate,t),t=t.return;gt=null}}function ni(t,e){var n=t.timeoutHandle;n!==-1&&(t.timeoutHandle=-1,Kx(n)),n=t.cancelPendingCommit,n!==null&&(t.cancelPendingCommit=null,n()),xn=0,bu(),Rt=t,gt=n=sn(t.current,null),bt=e,wt=0,Ee=null,kn=!1,Ia=vi(t,e),du=!1,ti=Me=hu=ya=Bn=Lt=0,ge=Ii=null,mu=!1,(e&8)!==0&&(e|=e&32);var i=t.entangledLanes;if(i!==0)for(t=t.entanglements,i&=e;0<i;){var o=31-ve(i),u=1<<o;e|=t[o],i&=~u}return bn=e,Fl(),n}function Em(t,e){ct=null,O.H=Qi,e===Qa||e===as?(e=Gd(),wt=3):e===Tr?(e=Gd(),wt=4):wt=e===Wr?8:e!==null&&typeof e=="object"&&typeof e.then=="function"?6:1,Ee=e,gt===null&&(Lt=1,ys(t,Re(e,t.current)))}function Mm(){var t=je.current;return t===null?!0:(bt&4194048)===bt?Be===null:(bt&62914560)===bt||(bt&536870912)!==0?t===Be:!1}function wm(){var t=O.H;return O.H=Qi,t===null?Qi:t}function Cm(){var t=O.A;return O.A=Ex,t}function Ns(){Lt=4,kn||(bt&4194048)!==bt&&je.current!==null||(Ia=!0),(Bn&134217727)===0&&(ya&134217727)===0||Rt===null||Ln(Rt,bt,Me,!1)}function xu(t,e,n){var i=Et;Et|=2;var o=wm(),u=Cm();(Rt!==t||bt!==e)&&(ws=null,ni(t,e)),e=!1;var h=Lt;t:do try{if(wt!==0&&gt!==null){var b=gt,T=Ee;switch(wt){case 8:bu(),h=6;break t;case 3:case 2:case 9:case 6:je.current===null&&(e=!0);var z=wt;if(wt=0,Ee=null,ai(t,b,T,z),n&&Ia){h=0;break t}break;default:z=wt,wt=0,Ee=null,ai(t,b,T,z)}}Cx(),h=Lt;break}catch(U){Em(t,U)}while(!0);return e&&t.shellSuspendCounter++,rn=ra=null,Et=i,O.H=o,O.A=u,gt===null&&(Rt=null,bt=0,Fl()),h}function Cx(){for(;gt!==null;)Nm(gt)}function Nx(t,e){var n=Et;Et|=2;var i=wm(),o=Cm();Rt!==t||bt!==e?(ws=null,Ms=be()+500,ni(t,e)):Ia=vi(t,e);t:do try{if(wt!==0&&gt!==null){e=gt;var u=Ee;e:switch(wt){case 1:wt=0,Ee=null,ai(t,e,u,1);break;case 2:case 9:if(Ld(u)){wt=0,Ee=null,Dm(e);break}e=function(){wt!==2&&wt!==9||Rt!==t||(wt=7),We(t)},u.then(e,e);break t;case 3:wt=7;break t;case 4:wt=5;break t;case 7:Ld(u)?(wt=0,Ee=null,Dm(e)):(wt=0,Ee=null,ai(t,e,u,7));break;case 5:var h=null;switch(gt.tag){case 26:h=gt.memoizedState;case 5:case 27:var b=gt;if(h?pp(h):b.stateNode.complete){wt=0,Ee=null;var T=b.sibling;if(T!==null)gt=T;else{var z=b.return;z!==null?(gt=z,Ds(z)):gt=null}break e}}wt=0,Ee=null,ai(t,e,u,5);break;case 6:wt=0,Ee=null,ai(t,e,u,6);break;case 8:bu(),Lt=6;break t;default:throw Error(r(462))}}Dx();break}catch(U){Em(t,U)}while(!0);return rn=ra=null,O.H=i,O.A=o,Et=n,gt!==null?0:(Rt=null,bt=0,Fl(),Lt)}function Dx(){for(;gt!==null&&!Iy();)Nm(gt)}function Nm(t){var e=Ih(t.alternate,t,bn);t.memoizedProps=t.pendingProps,e===null?Ds(t):gt=e}function Dm(t){var e=t,n=e.alternate;switch(e.tag){case 15:case 0:e=Kh(n,e,e.pendingProps,e.type,void 0,bt);break;case 11:e=Kh(n,e,e.pendingProps,e.type.render,e.ref,bt);break;case 5:Vr(e);default:em(n,e),e=gt=Cd(e,bn),e=Ih(n,e,bn)}t.memoizedProps=t.pendingProps,e===null?Ds(t):gt=e}function ai(t,e,n,i){rn=ra=null,Vr(e),Za=null,_i=0;var o=e.return;try{if(bx(t,o,e,n,bt)){Lt=1,ys(t,Re(n,t.current)),gt=null;return}}catch(u){if(o!==null)throw gt=o,u;Lt=1,ys(t,Re(n,t.current)),gt=null;return}e.flags&32768?(St||i===1?t=!0:Ia||(bt&536870912)!==0?t=!1:(kn=t=!0,(i===2||i===9||i===3||i===6)&&(i=je.current,i!==null&&i.tag===13&&(i.flags|=16384))),zm(e,t)):Ds(e)}function Ds(t){var e=t;do{if((e.flags&32768)!==0){zm(e,kn);return}t=e.return;var n=Sx(e.alternate,e,bn);if(n!==null){gt=n;return}if(e=e.sibling,e!==null){gt=e;return}gt=e=t}while(e!==null);Lt===0&&(Lt=5)}function zm(t,e){do{var n=Tx(t.alternate,t);if(n!==null){n.flags&=32767,gt=n;return}if(n=t.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!e&&(t=t.sibling,t!==null)){gt=t;return}gt=t=n}while(t!==null);Lt=6,gt=null}function Rm(t,e,n,i,o,u,h,b,T){t.cancelPendingCommit=null;do zs();while(Ft!==0);if((Et&6)!==0)throw Error(r(327));if(e!==null){if(e===t.current)throw Error(r(177));if(u=e.lanes|e.childLanes,u|=or,ub(t,n,u,h,b,T),t===Rt&&(gt=Rt=null,bt=0),ei=e,Un=t,xn=n,pu=u,gu=o,Sm=i,(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,Vx(Ol,function(){return _m(),null})):(t.callbackNode=null,t.callbackPriority=0),i=(e.flags&13878)!==0,(e.subtreeFlags&13878)!==0||i){i=O.T,O.T=null,o=Q.p,Q.p=2,h=Et,Et|=4;try{jx(t,e,n)}finally{Et=h,Q.p=o,O.T=i}}Ft=1,Om(),Vm(),km()}}function Om(){if(Ft===1){Ft=0;var t=Un,e=ei,n=(e.flags&13878)!==0;if((e.subtreeFlags&13878)!==0||n){n=O.T,O.T=null;var i=Q.p;Q.p=2;var o=Et;Et|=4;try{hm(e,t);var u=zu,h=xd(t.containerInfo),b=u.focusedElem,T=u.selectionRange;if(h!==b&&b&&b.ownerDocument&&bd(b.ownerDocument.documentElement,b)){if(T!==null&&nr(b)){var z=T.start,U=T.end;if(U===void 0&&(U=z),"selectionStart"in b)b.selectionStart=z,b.selectionEnd=Math.min(U,b.value.length);else{var G=b.ownerDocument||document,R=G&&G.defaultView||window;if(R.getSelection){var k=R.getSelection(),P=b.textContent.length,lt=Math.min(T.start,P),zt=T.end===void 0?lt:Math.min(T.end,P);!k.extend&&lt>zt&&(h=zt,zt=lt,lt=h);var w=yd(b,lt),E=yd(b,zt);if(w&&E&&(k.rangeCount!==1||k.anchorNode!==w.node||k.anchorOffset!==w.offset||k.focusNode!==E.node||k.focusOffset!==E.offset)){var D=G.createRange();D.setStart(w.node,w.offset),k.removeAllRanges(),lt>zt?(k.addRange(D),k.extend(E.node,E.offset)):(D.setEnd(E.node,E.offset),k.addRange(D))}}}}for(G=[],k=b;k=k.parentNode;)k.nodeType===1&&G.push({element:k,left:k.scrollLeft,top:k.scrollTop});for(typeof b.focus=="function"&&b.focus(),b=0;b<G.length;b++){var L=G[b];L.element.scrollLeft=L.left,L.element.scrollTop=L.top}}qs=!!Du,zu=Du=null}finally{Et=o,Q.p=i,O.T=n}}t.current=e,Ft=2}}function Vm(){if(Ft===2){Ft=0;var t=Un,e=ei,n=(e.flags&8772)!==0;if((e.subtreeFlags&8772)!==0||n){n=O.T,O.T=null;var i=Q.p;Q.p=2;var o=Et;Et|=4;try{rm(t,e.alternate,e)}finally{Et=o,Q.p=i,O.T=n}}Ft=3}}function km(){if(Ft===4||Ft===3){Ft=0,tb();var t=Un,e=ei,n=xn,i=Sm;(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?Ft=5:(Ft=0,ei=Un=null,Bm(t,t.pendingLanes));var o=t.pendingLanes;if(o===0&&(_n=null),_o(n),e=e.stateNode,xe&&typeof xe.onCommitFiberRoot=="function")try{xe.onCommitFiberRoot(xi,e,void 0,(e.current.flags&128)===128)}catch{}if(i!==null){e=O.T,o=Q.p,Q.p=2,O.T=null;try{for(var u=t.onRecoverableError,h=0;h<i.length;h++){var b=i[h];u(b.value,{componentStack:b.stack})}}finally{O.T=e,Q.p=o}}(xn&3)!==0&&zs(),We(t),o=t.pendingLanes,(n&261930)!==0&&(o&42)!==0?t===yu?tl++:(tl=0,yu=t):tl=0,el(0)}}function Bm(t,e){(t.pooledCacheLanes&=e)===0&&(e=t.pooledCache,e!=null&&(t.pooledCache=null,ki(e)))}function zs(){return Om(),Vm(),km(),_m()}function _m(){if(Ft!==5)return!1;var t=Un,e=pu;pu=0;var n=_o(xn),i=O.T,o=Q.p;try{Q.p=32>n?32:n,O.T=null,n=gu,gu=null;var u=Un,h=xn;if(Ft=0,ei=Un=null,xn=0,(Et&6)!==0)throw Error(r(331));var b=Et;if(Et|=4,bm(u.current),pm(u,u.current,h,n),Et=b,el(0,!1),xe&&typeof xe.onPostCommitFiberRoot=="function")try{xe.onPostCommitFiberRoot(xi,u)}catch{}return!0}finally{Q.p=o,O.T=i,Bm(t,e)}}function Um(t,e,n){e=Re(n,e),e=Fr(t.stateNode,e,2),t=zn(t,e,2),t!==null&&(Si(t,2),We(t))}function Ct(t,e,n){if(t.tag===3)Um(t,t,n);else for(;e!==null;){if(e.tag===3){Um(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(_n===null||!_n.has(i))){t=Re(n,t),n=Lh(2),i=zn(e,n,2),i!==null&&(Hh(n,i,e,t),Si(i,2),We(i));break}}e=e.return}}function vu(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new Mx;var o=new Set;i.set(e,o)}else o=i.get(e),o===void 0&&(o=new Set,i.set(e,o));o.has(n)||(du=!0,o.add(n),t=zx.bind(null,t,e,n),e.then(t,t))}function zx(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),t.pingedLanes|=t.suspendedLanes&n,t.warmLanes&=~n,Rt===t&&(bt&n)===n&&(Lt===4||Lt===3&&(bt&62914560)===bt&&300>be()-Es?(Et&2)===0&&ni(t,0):hu|=n,ti===bt&&(ti=0)),We(t)}function Lm(t,e){e===0&&(e=Of()),t=la(t,e),t!==null&&(Si(t,e),We(t))}function Rx(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),Lm(t,n)}function Ox(t,e){var n=0;switch(t.tag){case 31:case 13:var i=t.stateNode,o=t.memoizedState;o!==null&&(n=o.retryLane);break;case 19:i=t.stateNode;break;case 22:i=t.stateNode._retryCache;break;default:throw Error(r(314))}i!==null&&i.delete(e),Lm(t,n)}function Vx(t,e){return Oo(t,e)}var Rs=null,ii=null,Su=!1,Os=!1,Tu=!1,Hn=0;function We(t){t!==ii&&t.next===null&&(ii===null?Rs=ii=t:ii=ii.next=t),Os=!0,Su||(Su=!0,Bx())}function el(t,e){if(!Tu&&Os){Tu=!0;do for(var n=!1,i=Rs;i!==null;){if(t!==0){var o=i.pendingLanes;if(o===0)var u=0;else{var h=i.suspendedLanes,b=i.pingedLanes;u=(1<<31-ve(42|t)+1)-1,u&=o&~(h&~b),u=u&201326741?u&201326741|1:u?u|2:0}u!==0&&(n=!0,qm(i,u))}else u=bt,u=_l(i,i===Rt?u:0,i.cancelPendingCommit!==null||i.timeoutHandle!==-1),(u&3)===0||vi(i,u)||(n=!0,qm(i,u));i=i.next}while(n);Tu=!1}}function kx(){Hm()}function Hm(){Os=Su=!1;var t=0;Hn!==0&&Zx()&&(t=Hn);for(var e=be(),n=null,i=Rs;i!==null;){var o=i.next,u=Gm(i,e);u===0?(i.next=null,n===null?Rs=o:n.next=o,o===null&&(ii=n)):(n=i,(t!==0||(u&3)!==0)&&(Os=!0)),i=o}Ft!==0&&Ft!==5||el(t),Hn!==0&&(Hn=0)}function Gm(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,o=t.expirationTimes,u=t.pendingLanes&-62914561;0<u;){var h=31-ve(u),b=1<<h,T=o[h];T===-1?((b&n)===0||(b&i)!==0)&&(o[h]=rb(b,e)):T<=e&&(t.expiredLanes|=b),u&=~b}if(e=Rt,n=bt,n=_l(t,t===e?n:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),i=t.callbackNode,n===0||t===e&&(wt===2||wt===9)||t.cancelPendingCommit!==null)return i!==null&&i!==null&&Vo(i),t.callbackNode=null,t.callbackPriority=0;if((n&3)===0||vi(t,n)){if(e=n&-n,e===t.callbackPriority)return e;switch(i!==null&&Vo(i),_o(n)){case 2:case 8:n=zf;break;case 32:n=Ol;break;case 268435456:n=Rf;break;default:n=Ol}return i=Ym.bind(null,t),n=Oo(n,i),t.callbackPriority=e,t.callbackNode=n,e}return i!==null&&i!==null&&Vo(i),t.callbackPriority=2,t.callbackNode=null,2}function Ym(t,e){if(Ft!==0&&Ft!==5)return t.callbackNode=null,t.callbackPriority=0,null;var n=t.callbackNode;if(zs()&&t.callbackNode!==n)return null;var i=bt;return i=_l(t,t===Rt?i:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),i===0?null:(jm(t,i,e),Gm(t,be()),t.callbackNode!=null&&t.callbackNode===n?Ym.bind(null,t):null)}function qm(t,e){if(zs())return null;jm(t,e,!0)}function Bx(){Jx(function(){(Et&6)!==0?Oo(Df,kx):Hm()})}function ju(){if(Hn===0){var t=qa;t===0&&(t=Vl,Vl<<=1,(Vl&261888)===0&&(Vl=256)),Hn=t}return Hn}function Xm(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Gl(""+t)}function Qm(t,e){var n=e.ownerDocument.createElement("input");return n.name=e.name,n.value=e.value,t.id&&n.setAttribute("form",t.id),e.parentNode.insertBefore(n,e),t=new FormData(t),n.parentNode.removeChild(n),t}function _x(t,e,n,i,o){if(e==="submit"&&n&&n.stateNode===o){var u=Xm((o[fe]||null).action),h=i.submitter;h&&(e=(e=h[fe]||null)?Xm(e.formAction):h.getAttribute("formAction"),e!==null&&(u=e,h=null));var b=new Ql("action","action",null,i,o);t.push({event:b,listeners:[{instance:null,listener:function(){if(i.defaultPrevented){if(Hn!==0){var T=h?Qm(o,h):new FormData(o);qr(n,{pending:!0,data:T,method:o.method,action:u},null,T)}}else typeof u=="function"&&(b.preventDefault(),T=h?Qm(o,h):new FormData(o),qr(n,{pending:!0,data:T,method:o.method,action:u},u,T))},currentTarget:o}]})}}for(var Au=0;Au<sr.length;Au++){var Eu=sr[Au],Ux=Eu.toLowerCase(),Lx=Eu[0].toUpperCase()+Eu.slice(1);Ge(Ux,"on"+Lx)}Ge(Td,"onAnimationEnd"),Ge(jd,"onAnimationIteration"),Ge(Ad,"onAnimationStart"),Ge("dblclick","onDoubleClick"),Ge("focusin","onFocus"),Ge("focusout","onBlur"),Ge(ex,"onTransitionRun"),Ge(nx,"onTransitionStart"),Ge(ax,"onTransitionCancel"),Ge(Ed,"onTransitionEnd"),Na("onMouseEnter",["mouseout","mouseover"]),Na("onMouseLeave",["mouseout","mouseover"]),Na("onPointerEnter",["pointerout","pointerover"]),Na("onPointerLeave",["pointerout","pointerover"]),ea("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),ea("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),ea("onBeforeInput",["compositionend","keypress","textInput","paste"]),ea("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),ea("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),ea("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var nl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Hx=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(nl));function Zm(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],o=i.event;i=i.listeners;t:{var u=void 0;if(e)for(var h=i.length-1;0<=h;h--){var b=i[h],T=b.instance,z=b.currentTarget;if(b=b.listener,T!==u&&o.isPropagationStopped())break t;u=b,o.currentTarget=z;try{u(o)}catch(U){Jl(U)}o.currentTarget=null,u=T}else for(h=0;h<i.length;h++){if(b=i[h],T=b.instance,z=b.currentTarget,b=b.listener,T!==u&&o.isPropagationStopped())break t;u=b,o.currentTarget=z;try{u(o)}catch(U){Jl(U)}o.currentTarget=null,u=T}}}}function yt(t,e){var n=e[Uo];n===void 0&&(n=e[Uo]=new Set);var i=t+"__bubble";n.has(i)||(Km(e,t,2,!1),n.add(i))}function Mu(t,e,n){var i=0;e&&(i|=4),Km(n,t,i,e)}var Vs="_reactListening"+Math.random().toString(36).slice(2);function wu(t){if(!t[Vs]){t[Vs]=!0,Hf.forEach(function(n){n!=="selectionchange"&&(Hx.has(n)||Mu(n,!1,t),Mu(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Vs]||(e[Vs]=!0,Mu("selectionchange",!1,e))}}function Km(t,e,n,i){switch(Tp(e)){case 2:var o=mv;break;case 8:o=pv;break;default:o=Yu}n=o.bind(null,e,n,t),o=void 0,!Ko||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(o=!0),i?o!==void 0?t.addEventListener(e,n,{capture:!0,passive:o}):t.addEventListener(e,n,!0):o!==void 0?t.addEventListener(e,n,{passive:o}):t.addEventListener(e,n,!1)}function Cu(t,e,n,i,o){var u=i;if((e&1)===0&&(e&2)===0&&i!==null)t:for(;;){if(i===null)return;var h=i.tag;if(h===3||h===4){var b=i.stateNode.containerInfo;if(b===o)break;if(h===4)for(h=i.return;h!==null;){var T=h.tag;if((T===3||T===4)&&h.stateNode.containerInfo===o)return;h=h.return}for(;b!==null;){if(h=Ma(b),h===null)return;if(T=h.tag,T===5||T===6||T===26||T===27){i=u=h;continue t}b=b.parentNode}}i=i.return}$f(function(){var z=u,U=Qo(n),G=[];t:{var R=Md.get(t);if(R!==void 0){var k=Ql,P=t;switch(t){case"keypress":if(ql(n)===0)break t;case"keydown":case"keyup":k=Ob;break;case"focusin":P="focus",k=Po;break;case"focusout":P="blur",k=Po;break;case"beforeblur":case"afterblur":k=Po;break;case"click":if(n.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":k=ed;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":k=Sb;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":k=Bb;break;case Td:case jd:case Ad:k=Ab;break;case Ed:k=Ub;break;case"scroll":case"scrollend":k=xb;break;case"wheel":k=Hb;break;case"copy":case"cut":case"paste":k=Mb;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":k=ad;break;case"toggle":case"beforetoggle":k=Yb}var lt=(e&4)!==0,zt=!lt&&(t==="scroll"||t==="scrollend"),w=lt?R!==null?R+"Capture":null:R;lt=[];for(var E=z,D;E!==null;){var L=E;if(D=L.stateNode,L=L.tag,L!==5&&L!==26&&L!==27||D===null||w===null||(L=Ai(E,w),L!=null&&lt.push(al(E,L,D))),zt)break;E=E.return}0<lt.length&&(R=new k(R,P,null,n,U),G.push({event:R,listeners:lt}))}}if((e&7)===0){t:{if(R=t==="mouseover"||t==="pointerover",k=t==="mouseout"||t==="pointerout",R&&n!==Xo&&(P=n.relatedTarget||n.fromElement)&&(Ma(P)||P[Ea]))break t;if((k||R)&&(R=U.window===U?U:(R=U.ownerDocument)?R.defaultView||R.parentWindow:window,k?(P=n.relatedTarget||n.toElement,k=z,P=P?Ma(P):null,P!==null&&(zt=d(P),lt=P.tag,P!==zt||lt!==5&&lt!==27&&lt!==6)&&(P=null)):(k=null,P=z),k!==P)){if(lt=ed,L="onMouseLeave",w="onMouseEnter",E="mouse",(t==="pointerout"||t==="pointerover")&&(lt=ad,L="onPointerLeave",w="onPointerEnter",E="pointer"),zt=k==null?R:ji(k),D=P==null?R:ji(P),R=new lt(L,E+"leave",k,n,U),R.target=zt,R.relatedTarget=D,L=null,Ma(U)===z&&(lt=new lt(w,E+"enter",P,n,U),lt.target=D,lt.relatedTarget=zt,L=lt),zt=L,k&&P)e:{for(lt=Gx,w=k,E=P,D=0,L=w;L;L=lt(L))D++;L=0;for(var at=E;at;at=lt(at))L++;for(;0<D-L;)w=lt(w),D--;for(;0<L-D;)E=lt(E),L--;for(;D--;){if(w===E||E!==null&&w===E.alternate){lt=w;break e}w=lt(w),E=lt(E)}lt=null}else lt=null;k!==null&&Jm(G,R,k,lt,!1),P!==null&&zt!==null&&Jm(G,zt,P,lt,!0)}}t:{if(R=z?ji(z):window,k=R.nodeName&&R.nodeName.toLowerCase(),k==="select"||k==="input"&&R.type==="file")var Tt=fd;else if(ud(R))if(dd)Tt=$b;else{Tt=Wb;var tt=Fb}else k=R.nodeName,!k||k.toLowerCase()!=="input"||R.type!=="checkbox"&&R.type!=="radio"?z&&qo(z.elementType)&&(Tt=fd):Tt=Pb;if(Tt&&(Tt=Tt(t,z))){cd(G,Tt,n,U);break t}tt&&tt(t,R,z),t==="focusout"&&z&&R.type==="number"&&z.memoizedProps.value!=null&&Yo(R,"number",R.value)}switch(tt=z?ji(z):window,t){case"focusin":(ud(tt)||tt.contentEditable==="true")&&(ka=tt,ar=z,Ri=null);break;case"focusout":Ri=ar=ka=null;break;case"mousedown":ir=!0;break;case"contextmenu":case"mouseup":case"dragend":ir=!1,vd(G,n,U);break;case"selectionchange":if(tx)break;case"keydown":case"keyup":vd(G,n,U)}var dt;if(Io)t:{switch(t){case"compositionstart":var xt="onCompositionStart";break t;case"compositionend":xt="onCompositionEnd";break t;case"compositionupdate":xt="onCompositionUpdate";break t}xt=void 0}else Va?od(t,n)&&(xt="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(xt="onCompositionStart");xt&&(id&&n.locale!=="ko"&&(Va||xt!=="onCompositionStart"?xt==="onCompositionEnd"&&Va&&(dt=If()):(An=U,Jo="value"in An?An.value:An.textContent,Va=!0)),tt=ks(z,xt),0<tt.length&&(xt=new nd(xt,t,null,n,U),G.push({event:xt,listeners:tt}),dt?xt.data=dt:(dt=rd(n),dt!==null&&(xt.data=dt)))),(dt=Xb?Qb(t,n):Zb(t,n))&&(xt=ks(z,"onBeforeInput"),0<xt.length&&(tt=new nd("onBeforeInput","beforeinput",null,n,U),G.push({event:tt,listeners:xt}),tt.data=dt)),_x(G,t,z,n,U)}Zm(G,e)})}function al(t,e,n){return{instance:t,listener:e,currentTarget:n}}function ks(t,e){for(var n=e+"Capture",i=[];t!==null;){var o=t,u=o.stateNode;if(o=o.tag,o!==5&&o!==26&&o!==27||u===null||(o=Ai(t,n),o!=null&&i.unshift(al(t,o,u)),o=Ai(t,e),o!=null&&i.push(al(t,o,u))),t.tag===3)return i;t=t.return}return[]}function Gx(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function Jm(t,e,n,i,o){for(var u=e._reactName,h=[];n!==null&&n!==i;){var b=n,T=b.alternate,z=b.stateNode;if(b=b.tag,T!==null&&T===i)break;b!==5&&b!==26&&b!==27||z===null||(T=z,o?(z=Ai(n,u),z!=null&&h.unshift(al(n,z,T))):o||(z=Ai(n,u),z!=null&&h.push(al(n,z,T)))),n=n.return}h.length!==0&&t.push({event:e,listeners:h})}var Yx=/\r\n?/g,qx=/\u0000|\uFFFD/g;function Fm(t){return(typeof t=="string"?t:""+t).replace(Yx,`
`).replace(qx,"")}function Wm(t,e){return e=Fm(e),Fm(t)===e}function Dt(t,e,n,i,o,u){switch(n){case"children":typeof i=="string"?e==="body"||e==="textarea"&&i===""||za(t,i):(typeof i=="number"||typeof i=="bigint")&&e!=="body"&&za(t,""+i);break;case"className":Ll(t,"class",i);break;case"tabIndex":Ll(t,"tabindex",i);break;case"dir":case"role":case"viewBox":case"width":case"height":Ll(t,n,i);break;case"style":Wf(t,i,u);break;case"data":if(e!=="object"){Ll(t,"data",i);break}case"src":case"href":if(i===""&&(e!=="a"||n!=="href")){t.removeAttribute(n);break}if(i==null||typeof i=="function"||typeof i=="symbol"||typeof i=="boolean"){t.removeAttribute(n);break}i=Gl(""+i),t.setAttribute(n,i);break;case"action":case"formAction":if(typeof i=="function"){t.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof u=="function"&&(n==="formAction"?(e!=="input"&&Dt(t,e,"name",o.name,o,null),Dt(t,e,"formEncType",o.formEncType,o,null),Dt(t,e,"formMethod",o.formMethod,o,null),Dt(t,e,"formTarget",o.formTarget,o,null)):(Dt(t,e,"encType",o.encType,o,null),Dt(t,e,"method",o.method,o,null),Dt(t,e,"target",o.target,o,null)));if(i==null||typeof i=="symbol"||typeof i=="boolean"){t.removeAttribute(n);break}i=Gl(""+i),t.setAttribute(n,i);break;case"onClick":i!=null&&(t.onclick=an);break;case"onScroll":i!=null&&yt("scroll",t);break;case"onScrollEnd":i!=null&&yt("scrollend",t);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(r(61));if(n=i.__html,n!=null){if(o.children!=null)throw Error(r(60));t.innerHTML=n}}break;case"multiple":t.multiple=i&&typeof i!="function"&&typeof i!="symbol";break;case"muted":t.muted=i&&typeof i!="function"&&typeof i!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(i==null||typeof i=="function"||typeof i=="boolean"||typeof i=="symbol"){t.removeAttribute("xlink:href");break}n=Gl(""+i),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":i!=null&&typeof i!="function"&&typeof i!="symbol"?t.setAttribute(n,""+i):t.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":i&&typeof i!="function"&&typeof i!="symbol"?t.setAttribute(n,""):t.removeAttribute(n);break;case"capture":case"download":i===!0?t.setAttribute(n,""):i!==!1&&i!=null&&typeof i!="function"&&typeof i!="symbol"?t.setAttribute(n,i):t.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":i!=null&&typeof i!="function"&&typeof i!="symbol"&&!isNaN(i)&&1<=i?t.setAttribute(n,i):t.removeAttribute(n);break;case"rowSpan":case"start":i==null||typeof i=="function"||typeof i=="symbol"||isNaN(i)?t.removeAttribute(n):t.setAttribute(n,i);break;case"popover":yt("beforetoggle",t),yt("toggle",t),Ul(t,"popover",i);break;case"xlinkActuate":nn(t,"http://www.w3.org/1999/xlink","xlink:actuate",i);break;case"xlinkArcrole":nn(t,"http://www.w3.org/1999/xlink","xlink:arcrole",i);break;case"xlinkRole":nn(t,"http://www.w3.org/1999/xlink","xlink:role",i);break;case"xlinkShow":nn(t,"http://www.w3.org/1999/xlink","xlink:show",i);break;case"xlinkTitle":nn(t,"http://www.w3.org/1999/xlink","xlink:title",i);break;case"xlinkType":nn(t,"http://www.w3.org/1999/xlink","xlink:type",i);break;case"xmlBase":nn(t,"http://www.w3.org/XML/1998/namespace","xml:base",i);break;case"xmlLang":nn(t,"http://www.w3.org/XML/1998/namespace","xml:lang",i);break;case"xmlSpace":nn(t,"http://www.w3.org/XML/1998/namespace","xml:space",i);break;case"is":Ul(t,"is",i);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=yb.get(n)||n,Ul(t,n,i))}}function Nu(t,e,n,i,o,u){switch(n){case"style":Wf(t,i,u);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(r(61));if(n=i.__html,n!=null){if(o.children!=null)throw Error(r(60));t.innerHTML=n}}break;case"children":typeof i=="string"?za(t,i):(typeof i=="number"||typeof i=="bigint")&&za(t,""+i);break;case"onScroll":i!=null&&yt("scroll",t);break;case"onScrollEnd":i!=null&&yt("scrollend",t);break;case"onClick":i!=null&&(t.onclick=an);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Gf.hasOwnProperty(n))t:{if(n[0]==="o"&&n[1]==="n"&&(o=n.endsWith("Capture"),e=n.slice(2,o?n.length-7:void 0),u=t[fe]||null,u=u!=null?u[n]:null,typeof u=="function"&&t.removeEventListener(e,u,o),typeof i=="function")){typeof u!="function"&&u!==null&&(n in t?t[n]=null:t.hasAttribute(n)&&t.removeAttribute(n)),t.addEventListener(e,i,o);break t}n in t?t[n]=i:i===!0?t.setAttribute(n,""):Ul(t,n,i)}}}function ae(t,e,n){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":yt("error",t),yt("load",t);var i=!1,o=!1,u;for(u in n)if(n.hasOwnProperty(u)){var h=n[u];if(h!=null)switch(u){case"src":i=!0;break;case"srcSet":o=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,e));default:Dt(t,e,u,h,n,null)}}o&&Dt(t,e,"srcSet",n.srcSet,n,null),i&&Dt(t,e,"src",n.src,n,null);return;case"input":yt("invalid",t);var b=u=h=o=null,T=null,z=null;for(i in n)if(n.hasOwnProperty(i)){var U=n[i];if(U!=null)switch(i){case"name":o=U;break;case"type":h=U;break;case"checked":T=U;break;case"defaultChecked":z=U;break;case"value":u=U;break;case"defaultValue":b=U;break;case"children":case"dangerouslySetInnerHTML":if(U!=null)throw Error(r(137,e));break;default:Dt(t,e,i,U,n,null)}}Zf(t,u,b,T,z,h,o,!1);return;case"select":yt("invalid",t),i=h=u=null;for(o in n)if(n.hasOwnProperty(o)&&(b=n[o],b!=null))switch(o){case"value":u=b;break;case"defaultValue":h=b;break;case"multiple":i=b;default:Dt(t,e,o,b,n,null)}e=u,n=h,t.multiple=!!i,e!=null?Da(t,!!i,e,!1):n!=null&&Da(t,!!i,n,!0);return;case"textarea":yt("invalid",t),u=o=i=null;for(h in n)if(n.hasOwnProperty(h)&&(b=n[h],b!=null))switch(h){case"value":i=b;break;case"defaultValue":o=b;break;case"children":u=b;break;case"dangerouslySetInnerHTML":if(b!=null)throw Error(r(91));break;default:Dt(t,e,h,b,n,null)}Jf(t,i,o,u);return;case"option":for(T in n)if(n.hasOwnProperty(T)&&(i=n[T],i!=null))switch(T){case"selected":t.selected=i&&typeof i!="function"&&typeof i!="symbol";break;default:Dt(t,e,T,i,n,null)}return;case"dialog":yt("beforetoggle",t),yt("toggle",t),yt("cancel",t),yt("close",t);break;case"iframe":case"object":yt("load",t);break;case"video":case"audio":for(i=0;i<nl.length;i++)yt(nl[i],t);break;case"image":yt("error",t),yt("load",t);break;case"details":yt("toggle",t);break;case"embed":case"source":case"link":yt("error",t),yt("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(z in n)if(n.hasOwnProperty(z)&&(i=n[z],i!=null))switch(z){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,e));default:Dt(t,e,z,i,n,null)}return;default:if(qo(e)){for(U in n)n.hasOwnProperty(U)&&(i=n[U],i!==void 0&&Nu(t,e,U,i,n,void 0));return}}for(b in n)n.hasOwnProperty(b)&&(i=n[b],i!=null&&Dt(t,e,b,i,n,null))}function Xx(t,e,n,i){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var o=null,u=null,h=null,b=null,T=null,z=null,U=null;for(k in n){var G=n[k];if(n.hasOwnProperty(k)&&G!=null)switch(k){case"checked":break;case"value":break;case"defaultValue":T=G;default:i.hasOwnProperty(k)||Dt(t,e,k,null,i,G)}}for(var R in i){var k=i[R];if(G=n[R],i.hasOwnProperty(R)&&(k!=null||G!=null))switch(R){case"type":u=k;break;case"name":o=k;break;case"checked":z=k;break;case"defaultChecked":U=k;break;case"value":h=k;break;case"defaultValue":b=k;break;case"children":case"dangerouslySetInnerHTML":if(k!=null)throw Error(r(137,e));break;default:k!==G&&Dt(t,e,R,k,i,G)}}Go(t,h,b,T,z,U,u,o);return;case"select":k=h=b=R=null;for(u in n)if(T=n[u],n.hasOwnProperty(u)&&T!=null)switch(u){case"value":break;case"multiple":k=T;default:i.hasOwnProperty(u)||Dt(t,e,u,null,i,T)}for(o in i)if(u=i[o],T=n[o],i.hasOwnProperty(o)&&(u!=null||T!=null))switch(o){case"value":R=u;break;case"defaultValue":b=u;break;case"multiple":h=u;default:u!==T&&Dt(t,e,o,u,i,T)}e=b,n=h,i=k,R!=null?Da(t,!!n,R,!1):!!i!=!!n&&(e!=null?Da(t,!!n,e,!0):Da(t,!!n,n?[]:"",!1));return;case"textarea":k=R=null;for(b in n)if(o=n[b],n.hasOwnProperty(b)&&o!=null&&!i.hasOwnProperty(b))switch(b){case"value":break;case"children":break;default:Dt(t,e,b,null,i,o)}for(h in i)if(o=i[h],u=n[h],i.hasOwnProperty(h)&&(o!=null||u!=null))switch(h){case"value":R=o;break;case"defaultValue":k=o;break;case"children":break;case"dangerouslySetInnerHTML":if(o!=null)throw Error(r(91));break;default:o!==u&&Dt(t,e,h,o,i,u)}Kf(t,R,k);return;case"option":for(var P in n)if(R=n[P],n.hasOwnProperty(P)&&R!=null&&!i.hasOwnProperty(P))switch(P){case"selected":t.selected=!1;break;default:Dt(t,e,P,null,i,R)}for(T in i)if(R=i[T],k=n[T],i.hasOwnProperty(T)&&R!==k&&(R!=null||k!=null))switch(T){case"selected":t.selected=R&&typeof R!="function"&&typeof R!="symbol";break;default:Dt(t,e,T,R,i,k)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var lt in n)R=n[lt],n.hasOwnProperty(lt)&&R!=null&&!i.hasOwnProperty(lt)&&Dt(t,e,lt,null,i,R);for(z in i)if(R=i[z],k=n[z],i.hasOwnProperty(z)&&R!==k&&(R!=null||k!=null))switch(z){case"children":case"dangerouslySetInnerHTML":if(R!=null)throw Error(r(137,e));break;default:Dt(t,e,z,R,i,k)}return;default:if(qo(e)){for(var zt in n)R=n[zt],n.hasOwnProperty(zt)&&R!==void 0&&!i.hasOwnProperty(zt)&&Nu(t,e,zt,void 0,i,R);for(U in i)R=i[U],k=n[U],!i.hasOwnProperty(U)||R===k||R===void 0&&k===void 0||Nu(t,e,U,R,i,k);return}}for(var w in n)R=n[w],n.hasOwnProperty(w)&&R!=null&&!i.hasOwnProperty(w)&&Dt(t,e,w,null,i,R);for(G in i)R=i[G],k=n[G],!i.hasOwnProperty(G)||R===k||R==null&&k==null||Dt(t,e,G,R,i,k)}function Pm(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function Qx(){if(typeof performance.getEntriesByType=="function"){for(var t=0,e=0,n=performance.getEntriesByType("resource"),i=0;i<n.length;i++){var o=n[i],u=o.transferSize,h=o.initiatorType,b=o.duration;if(u&&b&&Pm(h)){for(h=0,b=o.responseEnd,i+=1;i<n.length;i++){var T=n[i],z=T.startTime;if(z>b)break;var U=T.transferSize,G=T.initiatorType;U&&Pm(G)&&(T=T.responseEnd,h+=U*(T<b?1:(b-z)/(T-z)))}if(--i,e+=8*(u+h)/(o.duration/1e3),t++,10<t)break}}if(0<t)return e/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var Du=null,zu=null;function Bs(t){return t.nodeType===9?t:t.ownerDocument}function $m(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Im(t,e){if(t===0)switch(e){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&e==="foreignObject"?0:t}function Ru(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.children=="bigint"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Ou=null;function Zx(){var t=window.event;return t&&t.type==="popstate"?t===Ou?!1:(Ou=t,!0):(Ou=null,!1)}var tp=typeof setTimeout=="function"?setTimeout:void 0,Kx=typeof clearTimeout=="function"?clearTimeout:void 0,ep=typeof Promise=="function"?Promise:void 0,Jx=typeof queueMicrotask=="function"?queueMicrotask:typeof ep<"u"?function(t){return ep.resolve(null).then(t).catch(Fx)}:tp;function Fx(t){setTimeout(function(){throw t})}function Gn(t){return t==="head"}function np(t,e){var n=e,i=0;do{var o=n.nextSibling;if(t.removeChild(n),o&&o.nodeType===8)if(n=o.data,n==="/$"||n==="/&"){if(i===0){t.removeChild(o),ri(e);return}i--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")i++;else if(n==="html")il(t.ownerDocument.documentElement);else if(n==="head"){n=t.ownerDocument.head,il(n);for(var u=n.firstChild;u;){var h=u.nextSibling,b=u.nodeName;u[Ti]||b==="SCRIPT"||b==="STYLE"||b==="LINK"&&u.rel.toLowerCase()==="stylesheet"||n.removeChild(u),u=h}}else n==="body"&&il(t.ownerDocument.body);n=o}while(n);ri(e)}function ap(t,e){var n=t;t=0;do{var i=n.nextSibling;if(n.nodeType===1?e?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(e?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(t===0)break;t--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||t++;n=i}while(n)}function Vu(t){var e=t.firstChild;for(e&&e.nodeType===10&&(e=e.nextSibling);e;){var n=e;switch(e=e.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Vu(n),Lo(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}t.removeChild(n)}}function Wx(t,e,n,i){for(;t.nodeType===1;){var o=n;if(t.nodeName.toLowerCase()!==e.toLowerCase()){if(!i&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(i){if(!t[Ti])switch(e){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(u=t.getAttribute("rel"),u==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(u!==o.rel||t.getAttribute("href")!==(o.href==null||o.href===""?null:o.href)||t.getAttribute("crossorigin")!==(o.crossOrigin==null?null:o.crossOrigin)||t.getAttribute("title")!==(o.title==null?null:o.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(u=t.getAttribute("src"),(u!==(o.src==null?null:o.src)||t.getAttribute("type")!==(o.type==null?null:o.type)||t.getAttribute("crossorigin")!==(o.crossOrigin==null?null:o.crossOrigin))&&u&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(e==="input"&&t.type==="hidden"){var u=o.name==null?null:""+o.name;if(o.type==="hidden"&&t.getAttribute("name")===u)return t}else return t;if(t=_e(t.nextSibling),t===null)break}return null}function Px(t,e,n){if(e==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!n||(t=_e(t.nextSibling),t===null))return null;return t}function ip(t,e){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!e||(t=_e(t.nextSibling),t===null))return null;return t}function ku(t){return t.data==="$?"||t.data==="$~"}function Bu(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function $x(t,e){var n=t.ownerDocument;if(t.data==="$~")t._reactRetry=e;else if(t.data!=="$?"||n.readyState!=="loading")e();else{var i=function(){e(),n.removeEventListener("DOMContentLoaded",i)};n.addEventListener("DOMContentLoaded",i),t._reactRetry=i}}function _e(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?"||e==="$~"||e==="&"||e==="F!"||e==="F")break;if(e==="/$"||e==="/&")return null}}return t}var _u=null;function lp(t){t=t.nextSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"||n==="/&"){if(e===0)return _e(t.nextSibling);e--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||e++}t=t.nextSibling}return null}function sp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(e===0)return t;e--}else n!=="/$"&&n!=="/&"||e++}t=t.previousSibling}return null}function op(t,e,n){switch(e=Bs(n),t){case"html":if(t=e.documentElement,!t)throw Error(r(452));return t;case"head":if(t=e.head,!t)throw Error(r(453));return t;case"body":if(t=e.body,!t)throw Error(r(454));return t;default:throw Error(r(451))}}function il(t){for(var e=t.attributes;e.length;)t.removeAttributeNode(e[0]);Lo(t)}var Ue=new Map,rp=new Set;function _s(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var vn=Q.d;Q.d={f:Ix,r:tv,D:ev,C:nv,L:av,m:iv,X:sv,S:lv,M:ov};function Ix(){var t=vn.f(),e=Cs();return t||e}function tv(t){var e=wa(t);e!==null&&e.tag===5&&e.type==="form"?Eh(e):vn.r(t)}var li=typeof document>"u"?null:document;function up(t,e,n){var i=li;if(i&&typeof e=="string"&&e){var o=De(e);o='link[rel="'+t+'"][href="'+o+'"]',typeof n=="string"&&(o+='[crossorigin="'+n+'"]'),rp.has(o)||(rp.add(o),t={rel:t,crossOrigin:n,href:e},i.querySelector(o)===null&&(e=i.createElement("link"),ae(e,"link",t),Pt(e),i.head.appendChild(e)))}}function ev(t){vn.D(t),up("dns-prefetch",t,null)}function nv(t,e){vn.C(t,e),up("preconnect",t,e)}function av(t,e,n){vn.L(t,e,n);var i=li;if(i&&t&&e){var o='link[rel="preload"][as="'+De(e)+'"]';e==="image"&&n&&n.imageSrcSet?(o+='[imagesrcset="'+De(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(o+='[imagesizes="'+De(n.imageSizes)+'"]')):o+='[href="'+De(t)+'"]';var u=o;switch(e){case"style":u=si(t);break;case"script":u=oi(t)}Ue.has(u)||(t=v({rel:"preload",href:e==="image"&&n&&n.imageSrcSet?void 0:t,as:e},n),Ue.set(u,t),i.querySelector(o)!==null||e==="style"&&i.querySelector(ll(u))||e==="script"&&i.querySelector(sl(u))||(e=i.createElement("link"),ae(e,"link",t),Pt(e),i.head.appendChild(e)))}}function iv(t,e){vn.m(t,e);var n=li;if(n&&t){var i=e&&typeof e.as=="string"?e.as:"script",o='link[rel="modulepreload"][as="'+De(i)+'"][href="'+De(t)+'"]',u=o;switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":u=oi(t)}if(!Ue.has(u)&&(t=v({rel:"modulepreload",href:t},e),Ue.set(u,t),n.querySelector(o)===null)){switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(sl(u)))return}i=n.createElement("link"),ae(i,"link",t),Pt(i),n.head.appendChild(i)}}}function lv(t,e,n){vn.S(t,e,n);var i=li;if(i&&t){var o=Ca(i).hoistableStyles,u=si(t);e=e||"default";var h=o.get(u);if(!h){var b={loading:0,preload:null};if(h=i.querySelector(ll(u)))b.loading=5;else{t=v({rel:"stylesheet",href:t,"data-precedence":e},n),(n=Ue.get(u))&&Uu(t,n);var T=h=i.createElement("link");Pt(T),ae(T,"link",t),T._p=new Promise(function(z,U){T.onload=z,T.onerror=U}),T.addEventListener("load",function(){b.loading|=1}),T.addEventListener("error",function(){b.loading|=2}),b.loading|=4,Us(h,e,i)}h={type:"stylesheet",instance:h,count:1,state:b},o.set(u,h)}}}function sv(t,e){vn.X(t,e);var n=li;if(n&&t){var i=Ca(n).hoistableScripts,o=oi(t),u=i.get(o);u||(u=n.querySelector(sl(o)),u||(t=v({src:t,async:!0},e),(e=Ue.get(o))&&Lu(t,e),u=n.createElement("script"),Pt(u),ae(u,"link",t),n.head.appendChild(u)),u={type:"script",instance:u,count:1,state:null},i.set(o,u))}}function ov(t,e){vn.M(t,e);var n=li;if(n&&t){var i=Ca(n).hoistableScripts,o=oi(t),u=i.get(o);u||(u=n.querySelector(sl(o)),u||(t=v({src:t,async:!0,type:"module"},e),(e=Ue.get(o))&&Lu(t,e),u=n.createElement("script"),Pt(u),ae(u,"link",t),n.head.appendChild(u)),u={type:"script",instance:u,count:1,state:null},i.set(o,u))}}function cp(t,e,n,i){var o=(o=pt.current)?_s(o):null;if(!o)throw Error(r(446));switch(t){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(e=si(n.href),n=Ca(o).hoistableStyles,i=n.get(e),i||(i={type:"style",instance:null,count:0,state:null},n.set(e,i)),i):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){t=si(n.href);var u=Ca(o).hoistableStyles,h=u.get(t);if(h||(o=o.ownerDocument||o,h={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},u.set(t,h),(u=o.querySelector(ll(t)))&&!u._p&&(h.instance=u,h.state.loading=5),Ue.has(t)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},Ue.set(t,n),u||rv(o,t,n,h.state))),e&&i===null)throw Error(r(528,""));return h}if(e&&i!==null)throw Error(r(529,""));return null;case"script":return e=n.async,n=n.src,typeof n=="string"&&e&&typeof e!="function"&&typeof e!="symbol"?(e=oi(n),n=Ca(o).hoistableScripts,i=n.get(e),i||(i={type:"script",instance:null,count:0,state:null},n.set(e,i)),i):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,t))}}function si(t){return'href="'+De(t)+'"'}function ll(t){return'link[rel="stylesheet"]['+t+"]"}function fp(t){return v({},t,{"data-precedence":t.precedence,precedence:null})}function rv(t,e,n,i){t.querySelector('link[rel="preload"][as="style"]['+e+"]")?i.loading=1:(e=t.createElement("link"),i.preload=e,e.addEventListener("load",function(){return i.loading|=1}),e.addEventListener("error",function(){return i.loading|=2}),ae(e,"link",n),Pt(e),t.head.appendChild(e))}function oi(t){return'[src="'+De(t)+'"]'}function sl(t){return"script[async]"+t}function dp(t,e,n){if(e.count++,e.instance===null)switch(e.type){case"style":var i=t.querySelector('style[data-href~="'+De(n.href)+'"]');if(i)return e.instance=i,Pt(i),i;var o=v({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return i=(t.ownerDocument||t).createElement("style"),Pt(i),ae(i,"style",o),Us(i,n.precedence,t),e.instance=i;case"stylesheet":o=si(n.href);var u=t.querySelector(ll(o));if(u)return e.state.loading|=4,e.instance=u,Pt(u),u;i=fp(n),(o=Ue.get(o))&&Uu(i,o),u=(t.ownerDocument||t).createElement("link"),Pt(u);var h=u;return h._p=new Promise(function(b,T){h.onload=b,h.onerror=T}),ae(u,"link",i),e.state.loading|=4,Us(u,n.precedence,t),e.instance=u;case"script":return u=oi(n.src),(o=t.querySelector(sl(u)))?(e.instance=o,Pt(o),o):(i=n,(o=Ue.get(u))&&(i=v({},n),Lu(i,o)),t=t.ownerDocument||t,o=t.createElement("script"),Pt(o),ae(o,"link",i),t.head.appendChild(o),e.instance=o);case"void":return null;default:throw Error(r(443,e.type))}else e.type==="stylesheet"&&(e.state.loading&4)===0&&(i=e.instance,e.state.loading|=4,Us(i,n.precedence,t));return e.instance}function Us(t,e,n){for(var i=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),o=i.length?i[i.length-1]:null,u=o,h=0;h<i.length;h++){var b=i[h];if(b.dataset.precedence===e)u=b;else if(u!==o)break}u?u.parentNode.insertBefore(t,u.nextSibling):(e=n.nodeType===9?n.head:n,e.insertBefore(t,e.firstChild))}function Uu(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.title==null&&(t.title=e.title)}function Lu(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.integrity==null&&(t.integrity=e.integrity)}var Ls=null;function hp(t,e,n){if(Ls===null){var i=new Map,o=Ls=new Map;o.set(n,i)}else o=Ls,i=o.get(n),i||(i=new Map,o.set(n,i));if(i.has(t))return i;for(i.set(t,null),n=n.getElementsByTagName(t),o=0;o<n.length;o++){var u=n[o];if(!(u[Ti]||u[It]||t==="link"&&u.getAttribute("rel")==="stylesheet")&&u.namespaceURI!=="http://www.w3.org/2000/svg"){var h=u.getAttribute(e)||"";h=t+h;var b=i.get(h);b?b.push(u):i.set(h,[u])}}return i}function mp(t,e,n){t=t.ownerDocument||t,t.head.insertBefore(n,e==="title"?t.querySelector("head > title"):null)}function uv(t,e,n){if(n===1||e.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof e.precedence!="string"||typeof e.href!="string"||e.href==="")break;return!0;case"link":if(typeof e.rel!="string"||typeof e.href!="string"||e.href===""||e.onLoad||e.onError)break;switch(e.rel){case"stylesheet":return t=e.disabled,typeof e.precedence=="string"&&t==null;default:return!0}case"script":if(e.async&&typeof e.async!="function"&&typeof e.async!="symbol"&&!e.onLoad&&!e.onError&&e.src&&typeof e.src=="string")return!0}return!1}function pp(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function cv(t,e,n,i){if(n.type==="stylesheet"&&(typeof i.media!="string"||matchMedia(i.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var o=si(i.href),u=e.querySelector(ll(o));if(u){e=u._p,e!==null&&typeof e=="object"&&typeof e.then=="function"&&(t.count++,t=Hs.bind(t),e.then(t,t)),n.state.loading|=4,n.instance=u,Pt(u);return}u=e.ownerDocument||e,i=fp(i),(o=Ue.get(o))&&Uu(i,o),u=u.createElement("link"),Pt(u);var h=u;h._p=new Promise(function(b,T){h.onload=b,h.onerror=T}),ae(u,"link",i),n.instance=u}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(n,e),(e=n.state.preload)&&(n.state.loading&3)===0&&(t.count++,n=Hs.bind(t),e.addEventListener("load",n),e.addEventListener("error",n))}}var Hu=0;function fv(t,e){return t.stylesheets&&t.count===0&&Ys(t,t.stylesheets),0<t.count||0<t.imgCount?function(n){var i=setTimeout(function(){if(t.stylesheets&&Ys(t,t.stylesheets),t.unsuspend){var u=t.unsuspend;t.unsuspend=null,u()}},6e4+e);0<t.imgBytes&&Hu===0&&(Hu=62500*Qx());var o=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&Ys(t,t.stylesheets),t.unsuspend)){var u=t.unsuspend;t.unsuspend=null,u()}},(t.imgBytes>Hu?50:800)+e);return t.unsuspend=n,function(){t.unsuspend=null,clearTimeout(i),clearTimeout(o)}}:null}function Hs(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Ys(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var Gs=null;function Ys(t,e){t.stylesheets=null,t.unsuspend!==null&&(t.count++,Gs=new Map,e.forEach(dv,t),Gs=null,Hs.call(t))}function dv(t,e){if(!(e.state.loading&4)){var n=Gs.get(t);if(n)var i=n.get(null);else{n=new Map,Gs.set(t,n);for(var o=t.querySelectorAll("link[data-precedence],style[data-precedence]"),u=0;u<o.length;u++){var h=o[u];(h.nodeName==="LINK"||h.getAttribute("media")!=="not all")&&(n.set(h.dataset.precedence,h),i=h)}i&&n.set(null,i)}o=e.instance,h=o.getAttribute("data-precedence"),u=n.get(h)||i,u===i&&n.set(null,o),n.set(h,o),this.count++,i=Hs.bind(this),o.addEventListener("load",i),o.addEventListener("error",i),u?u.parentNode.insertBefore(o,u.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(o,t.firstChild)),e.state.loading|=4}}var ol={$$typeof:B,Provider:null,Consumer:null,_currentValue:F,_currentValue2:F,_threadCount:0};function hv(t,e,n,i,o,u,h,b,T){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=ko(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ko(0),this.hiddenUpdates=ko(null),this.identifierPrefix=i,this.onUncaughtError=o,this.onCaughtError=u,this.onRecoverableError=h,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=T,this.incompleteTransitions=new Map}function gp(t,e,n,i,o,u,h,b,T,z,U,G){return t=new hv(t,e,n,h,T,z,U,G,b),e=1,u===!0&&(e|=24),u=Te(3,null,null,e),t.current=u,u.stateNode=t,e=xr(),e.refCount++,t.pooledCache=e,e.refCount++,u.memoizedState={element:i,isDehydrated:n,cache:e},jr(u),t}function yp(t){return t?(t=Ua,t):Ua}function bp(t,e,n,i,o,u){o=yp(o),i.context===null?i.context=o:i.pendingContext=o,i=Dn(e),i.payload={element:n},u=u===void 0?null:u,u!==null&&(i.callback=u),n=zn(t,i,e),n!==null&&(ye(n,t,e),Li(n,t,e))}function xp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Gu(t,e){xp(t,e),(t=t.alternate)&&xp(t,e)}function vp(t){if(t.tag===13||t.tag===31){var e=la(t,67108864);e!==null&&ye(e,t,67108864),Gu(t,67108864)}}function Sp(t){if(t.tag===13||t.tag===31){var e=we();e=Bo(e);var n=la(t,e);n!==null&&ye(n,t,e),Gu(t,e)}}var qs=!0;function mv(t,e,n,i){var o=O.T;O.T=null;var u=Q.p;try{Q.p=2,Yu(t,e,n,i)}finally{Q.p=u,O.T=o}}function pv(t,e,n,i){var o=O.T;O.T=null;var u=Q.p;try{Q.p=8,Yu(t,e,n,i)}finally{Q.p=u,O.T=o}}function Yu(t,e,n,i){if(qs){var o=qu(i);if(o===null)Cu(t,e,i,Xs,n),jp(t,i);else if(yv(o,t,e,n,i))i.stopPropagation();else if(jp(t,i),e&4&&-1<gv.indexOf(t)){for(;o!==null;){var u=wa(o);if(u!==null)switch(u.tag){case 3:if(u=u.stateNode,u.current.memoizedState.isDehydrated){var h=ta(u.pendingLanes);if(h!==0){var b=u;for(b.pendingLanes|=2,b.entangledLanes|=2;h;){var T=1<<31-ve(h);b.entanglements[1]|=T,h&=~T}We(u),(Et&6)===0&&(Ms=be()+500,el(0))}}break;case 31:case 13:b=la(u,2),b!==null&&ye(b,u,2),Cs(),Gu(u,2)}if(u=qu(i),u===null&&Cu(t,e,i,Xs,n),u===o)break;o=u}o!==null&&i.stopPropagation()}else Cu(t,e,i,null,n)}}function qu(t){return t=Qo(t),Xu(t)}var Xs=null;function Xu(t){if(Xs=null,t=Ma(t),t!==null){var e=d(t);if(e===null)t=null;else{var n=e.tag;if(n===13){if(t=f(e),t!==null)return t;t=null}else if(n===31){if(t=m(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null)}}return Xs=t,null}function Tp(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(eb()){case Df:return 2;case zf:return 8;case Ol:case nb:return 32;case Rf:return 268435456;default:return 32}default:return 32}}var Qu=!1,Yn=null,qn=null,Xn=null,rl=new Map,ul=new Map,Qn=[],gv="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function jp(t,e){switch(t){case"focusin":case"focusout":Yn=null;break;case"dragenter":case"dragleave":qn=null;break;case"mouseover":case"mouseout":Xn=null;break;case"pointerover":case"pointerout":rl.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":ul.delete(e.pointerId)}}function cl(t,e,n,i,o,u){return t===null||t.nativeEvent!==u?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:u,targetContainers:[o]},e!==null&&(e=wa(e),e!==null&&vp(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,o!==null&&e.indexOf(o)===-1&&e.push(o),t)}function yv(t,e,n,i,o){switch(e){case"focusin":return Yn=cl(Yn,t,e,n,i,o),!0;case"dragenter":return qn=cl(qn,t,e,n,i,o),!0;case"mouseover":return Xn=cl(Xn,t,e,n,i,o),!0;case"pointerover":var u=o.pointerId;return rl.set(u,cl(rl.get(u)||null,t,e,n,i,o)),!0;case"gotpointercapture":return u=o.pointerId,ul.set(u,cl(ul.get(u)||null,t,e,n,i,o)),!0}return!1}function Ap(t){var e=Ma(t.target);if(e!==null){var n=d(e);if(n!==null){if(e=n.tag,e===13){if(e=f(n),e!==null){t.blockedOn=e,Uf(t.priority,function(){Sp(n)});return}}else if(e===31){if(e=m(n),e!==null){t.blockedOn=e,Uf(t.priority,function(){Sp(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Qs(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=qu(t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Xo=i,n.target.dispatchEvent(i),Xo=null}else return e=wa(n),e!==null&&vp(e),t.blockedOn=n,!1;e.shift()}return!0}function Ep(t,e,n){Qs(t)&&n.delete(e)}function bv(){Qu=!1,Yn!==null&&Qs(Yn)&&(Yn=null),qn!==null&&Qs(qn)&&(qn=null),Xn!==null&&Qs(Xn)&&(Xn=null),rl.forEach(Ep),ul.forEach(Ep)}function Zs(t,e){t.blockedOn===e&&(t.blockedOn=null,Qu||(Qu=!0,a.unstable_scheduleCallback(a.unstable_NormalPriority,bv)))}var Ks=null;function Mp(t){Ks!==t&&(Ks=t,a.unstable_scheduleCallback(a.unstable_NormalPriority,function(){Ks===t&&(Ks=null);for(var e=0;e<t.length;e+=3){var n=t[e],i=t[e+1],o=t[e+2];if(typeof i!="function"){if(Xu(i||n)===null)continue;break}var u=wa(n);u!==null&&(t.splice(e,3),e-=3,qr(u,{pending:!0,data:o,method:n.method,action:i},i,o))}}))}function ri(t){function e(T){return Zs(T,t)}Yn!==null&&Zs(Yn,t),qn!==null&&Zs(qn,t),Xn!==null&&Zs(Xn,t),rl.forEach(e),ul.forEach(e);for(var n=0;n<Qn.length;n++){var i=Qn[n];i.blockedOn===t&&(i.blockedOn=null)}for(;0<Qn.length&&(n=Qn[0],n.blockedOn===null);)Ap(n),n.blockedOn===null&&Qn.shift();if(n=(t.ownerDocument||t).$$reactFormReplay,n!=null)for(i=0;i<n.length;i+=3){var o=n[i],u=n[i+1],h=o[fe]||null;if(typeof u=="function")h||Mp(n);else if(h){var b=null;if(u&&u.hasAttribute("formAction")){if(o=u,h=u[fe]||null)b=h.formAction;else if(Xu(o)!==null)continue}else b=h.action;typeof b=="function"?n[i+1]=b:(n.splice(i,3),i-=3),Mp(n)}}}function wp(){function t(u){u.canIntercept&&u.info==="react-transition"&&u.intercept({handler:function(){return new Promise(function(h){return o=h})},focusReset:"manual",scroll:"manual"})}function e(){o!==null&&(o(),o=null),i||setTimeout(n,20)}function n(){if(!i&&!navigation.transition){var u=navigation.currentEntry;u&&u.url!=null&&navigation.navigate(u.url,{state:u.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var i=!1,o=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",e),navigation.addEventListener("navigateerror",e),setTimeout(n,100),function(){i=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",e),navigation.removeEventListener("navigateerror",e),o!==null&&(o(),o=null)}}}function Zu(t){this._internalRoot=t}Js.prototype.render=Zu.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(r(409));var n=e.current,i=we();bp(n,i,t,e,null,null)},Js.prototype.unmount=Zu.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;bp(t.current,2,null,t,null,null),Cs(),e[Ea]=null}};function Js(t){this._internalRoot=t}Js.prototype.unstable_scheduleHydration=function(t){if(t){var e=_f();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Qn.length&&e!==0&&e<Qn[n].priority;n++);Qn.splice(n,0,t),n===0&&Ap(t)}};var Cp=l.version;if(Cp!=="19.2.7")throw Error(r(527,Cp,"19.2.7"));Q.findDOMNode=function(t){var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(r(188)):(t=Object.keys(t).join(","),Error(r(268,t)));return t=g(e),t=t!==null?x(t):null,t=t===null?null:t.stateNode,t};var xv={bundleType:0,version:"19.2.7",rendererPackageName:"react-dom",currentDispatcherRef:O,reconcilerVersion:"19.2.7"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Fs=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Fs.isDisabled&&Fs.supportsFiber)try{xi=Fs.inject(xv),xe=Fs}catch{}}return dl.createRoot=function(t,e){if(!c(t))throw Error(r(299));var n=!1,i="",o=kh,u=Bh,h=_h;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onUncaughtError!==void 0&&(o=e.onUncaughtError),e.onCaughtError!==void 0&&(u=e.onCaughtError),e.onRecoverableError!==void 0&&(h=e.onRecoverableError)),e=gp(t,1,!1,null,null,n,i,null,o,u,h,wp),t[Ea]=e.current,wu(t),new Zu(e)},dl.hydrateRoot=function(t,e,n){if(!c(t))throw Error(r(299));var i=!1,o="",u=kh,h=Bh,b=_h,T=null;return n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(h=n.onCaughtError),n.onRecoverableError!==void 0&&(b=n.onRecoverableError),n.formState!==void 0&&(T=n.formState)),e=gp(t,1,!0,e,n??null,i,o,T,u,h,b,wp),e.context=yp(null),n=e.current,i=we(),i=Bo(i),o=Dn(i),o.callback=null,zn(n,o,i),n=i,e.current.lanes=n,Si(e,n),We(e),t[Ea]=e.current,wu(t),new Js(e)},dl.version="19.2.7",dl}var Up;function Nv(){if(Up)return Fu.exports;Up=1;function a(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)}catch(l){console.error(l)}}return a(),Fu.exports=Cv(),Fu.exports}var Dv=Nv();const Fc=C.createContext({});function Wc(a){const l=C.useRef(null);return l.current===null&&(l.current=a()),l.current}const zv=typeof window<"u",Pc=zv?C.useLayoutEffect:C.useEffect,Ao=C.createContext(null);function $c(a,l){a.indexOf(l)===-1&&a.push(l)}function fo(a,l){const s=a.indexOf(l);s>-1&&a.splice(s,1)}const en=(a,l,s)=>s>l?l:s<a?a:s;let Ic=()=>{};const Fn={},cg=a=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(a),fg=a=>typeof a=="object"&&a!==null,dg=a=>/^0[^.\s]+$/u.test(a);function hg(a){let l;return()=>(l===void 0&&(l=a()),l)}const He=a=>a,Cl=(...a)=>a.reduce((l,s)=>r=>s(l(r))),jl=(a,l,s)=>{const r=l-a;return r?(s-a)/r:1};class tf{constructor(){this.subscriptions=[]}add(l){return $c(this.subscriptions,l),()=>fo(this.subscriptions,l)}notify(l,s,r){const c=this.subscriptions.length;if(c)if(c===1)this.subscriptions[0](l,s,r);else for(let d=0;d<c;d++){const f=this.subscriptions[d];f&&f(l,s,r)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const Ce=a=>a*1e3,Le=a=>a/1e3,mg=(a,l)=>l?a*(1e3/l):0,pg=(a,l,s)=>(((1-3*s+3*l)*a+(3*s-6*l))*a+3*l)*a,Rv=1e-7,Ov=12;function Vv(a,l,s,r,c){let d,f,m=0;do f=l+(s-l)/2,d=pg(f,r,c)-a,d>0?s=f:l=f;while(Math.abs(d)>Rv&&++m<Ov);return f}function Nl(a,l,s,r){if(a===l&&s===r)return He;const c=d=>Vv(d,0,1,a,s);return d=>d===0||d===1?d:pg(c(d),l,r)}const gg=a=>l=>l<=.5?a(2*l)/2:(2-a(2*(1-l)))/2,yg=a=>l=>1-a(1-l),bg=Nl(.33,1.53,.69,.99),ef=yg(bg),xg=gg(ef),vg=a=>a>=1?1:(a*=2)<1?.5*ef(a):.5*(2-Math.pow(2,-10*(a-1))),nf=a=>1-Math.sin(Math.acos(a)),Sg=yg(nf),Tg=gg(nf),kv=Nl(.42,0,1,1),Bv=Nl(0,0,.58,1),jg=Nl(.42,0,.58,1),_v=a=>Array.isArray(a)&&typeof a[0]!="number",Ag=a=>Array.isArray(a)&&typeof a[0]=="number",Uv={linear:He,easeIn:kv,easeInOut:jg,easeOut:Bv,circIn:nf,circInOut:Tg,circOut:Sg,backIn:ef,backInOut:xg,backOut:bg,anticipate:vg},Lv=a=>typeof a=="string",Lp=a=>{if(Ag(a)){Ic(a.length===4);const[l,s,r,c]=a;return Nl(l,s,r,c)}else if(Lv(a))return Uv[a];return a},Ws=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function Hv(a){let l=new Set,s=new Set,r=!1,c=!1;const d=new WeakSet;let f={delta:0,timestamp:0,isProcessing:!1};function m(g){d.has(g)&&(y.schedule(g),a()),g(f)}const y={schedule:(g,x=!1,v=!1)=>{const j=v&&r?l:s;return x&&d.add(g),j.add(g),g},cancel:g=>{s.delete(g),d.delete(g)},process:g=>{if(f=g,r){c=!0;return}r=!0;const x=l;l=s,s=x,l.forEach(m),l.clear(),r=!1,c&&(c=!1,y.process(g))}};return y}const Gv=40;function Eg(a,l){let s=!1,r=!0;const c={delta:0,timestamp:0,isProcessing:!1},d=()=>s=!0,f=Ws.reduce((B,Y)=>(B[Y]=Hv(d),B),{}),{setup:m,read:y,resolveKeyframes:g,preUpdate:x,update:v,preRender:S,render:j,postRender:M}=f,V=()=>{const B=Fn.useManualTiming,Y=B?c.timestamp:performance.now();s=!1,B||(c.delta=r?1e3/60:Math.max(Math.min(Y-c.timestamp,Gv),1)),c.timestamp=Y,c.isProcessing=!0,m.process(c),y.process(c),g.process(c),x.process(c),v.process(c),S.process(c),j.process(c),M.process(c),c.isProcessing=!1,s&&l&&(r=!1,a(V))},N=()=>{s=!0,r=!0,c.isProcessing||a(V)};return{schedule:Ws.reduce((B,Y)=>{const J=f[Y];return B[Y]=(it,q=!1,Z=!1)=>(s||N(),J.schedule(it,q,Z)),B},{}),cancel:B=>{for(let Y=0;Y<Ws.length;Y++)f[Ws[Y]].cancel(B)},state:c,steps:f}}const{schedule:Vt,cancel:Wn,state:ie,steps:Iu}=Eg(typeof requestAnimationFrame<"u"?requestAnimationFrame:He,!0);let ao;function Yv(){ao=void 0}const ue={now:()=>(ao===void 0&&ue.set(ie.isProcessing||Fn.useManualTiming?ie.timestamp:performance.now()),ao),set:a=>{ao=a,queueMicrotask(Yv)}},Mg=a=>l=>typeof l=="string"&&l.startsWith(a),wg=Mg("--"),qv=Mg("var(--"),af=a=>qv(a)?Xv.test(a.split("/*")[0].trim()):!1,Xv=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function Hp(a){return typeof a!="string"?!1:a.split("/*")[0].includes("var(--")}const pi={test:a=>typeof a=="number",parse:parseFloat,transform:a=>a},Al={...pi,transform:a=>en(0,1,a)},Ps={...pi,default:1},xl=a=>Math.round(a*1e5)/1e5,lf=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function Qv(a){return a==null}const Zv=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,sf=(a,l)=>s=>!!(typeof s=="string"&&Zv.test(s)&&s.startsWith(a)||l&&!Qv(s)&&Object.prototype.hasOwnProperty.call(s,l)),Cg=(a,l,s)=>r=>{if(typeof r!="string")return r;const[c,d,f,m]=r.match(lf);return{[a]:parseFloat(c),[l]:parseFloat(d),[s]:parseFloat(f),alpha:m!==void 0?parseFloat(m):1}},Kv=a=>en(0,255,a),tc={...pi,transform:a=>Math.round(Kv(a))},va={test:sf("rgb","red"),parse:Cg("red","green","blue"),transform:({red:a,green:l,blue:s,alpha:r=1})=>"rgba("+tc.transform(a)+", "+tc.transform(l)+", "+tc.transform(s)+", "+xl(Al.transform(r))+")"};function Jv(a){let l="",s="",r="",c="";return a.length>5?(l=a.substring(1,3),s=a.substring(3,5),r=a.substring(5,7),c=a.substring(7,9)):(l=a.substring(1,2),s=a.substring(2,3),r=a.substring(3,4),c=a.substring(4,5),l+=l,s+=s,r+=r,c+=c),{red:parseInt(l,16),green:parseInt(s,16),blue:parseInt(r,16),alpha:c?parseInt(c,16)/255:1}}const vc={test:sf("#"),parse:Jv,transform:va.transform},Dl=a=>({test:l=>typeof l=="string"&&l.endsWith(a)&&l.split(" ").length===1,parse:parseFloat,transform:l=>`${l}${a}`}),Sn=Dl("deg"),tn=Dl("%"),$=Dl("px"),Fv=Dl("vh"),Wv=Dl("vw"),Gp={...tn,parse:a=>tn.parse(a)/100,transform:a=>tn.transform(a*100)},ci={test:sf("hsl","hue"),parse:Cg("hue","saturation","lightness"),transform:({hue:a,saturation:l,lightness:s,alpha:r=1})=>"hsla("+Math.round(a)+", "+tn.transform(xl(l))+", "+tn.transform(xl(s))+", "+xl(Al.transform(r))+")"},Jt={test:a=>va.test(a)||vc.test(a)||ci.test(a),parse:a=>va.test(a)?va.parse(a):ci.test(a)?ci.parse(a):vc.parse(a),transform:a=>typeof a=="string"?a:a.hasOwnProperty("red")?va.transform(a):ci.transform(a),getAnimatableNone:a=>{const l=Jt.parse(a);return l.alpha=0,Jt.transform(l)}},Pv=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function $v(a){var l,s;return isNaN(a)&&typeof a=="string"&&(((l=a.match(lf))==null?void 0:l.length)||0)+(((s=a.match(Pv))==null?void 0:s.length)||0)>0}const Ng="number",Dg="color",Iv="var",t1="var(",Yp="${}",e1=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function hi(a){const l=a.toString(),s=[],r={color:[],number:[],var:[]},c=[];let d=0;const m=l.replace(e1,y=>(Jt.test(y)?(r.color.push(d),c.push(Dg),s.push(Jt.parse(y))):y.startsWith(t1)?(r.var.push(d),c.push(Iv),s.push(y)):(r.number.push(d),c.push(Ng),s.push(parseFloat(y))),++d,Yp)).split(Yp);return{values:s,split:m,indexes:r,types:c}}function n1(a){return hi(a).values}function zg({split:a,types:l}){const s=a.length;return r=>{let c="";for(let d=0;d<s;d++)if(c+=a[d],r[d]!==void 0){const f=l[d];f===Ng?c+=xl(r[d]):f===Dg?c+=Jt.transform(r[d]):c+=r[d]}return c}}function a1(a){return zg(hi(a))}const i1=a=>typeof a=="number"?0:Jt.test(a)?Jt.getAnimatableNone(a):a,l1=(a,l)=>typeof a=="number"?l!=null&&l.trim().endsWith("/")?a:0:i1(a);function s1(a){const l=hi(a);return zg(l)(l.values.map((r,c)=>l1(r,l.split[c])))}const Ze={test:$v,parse:n1,createTransformer:a1,getAnimatableNone:s1};function ec(a,l,s){return s<0&&(s+=1),s>1&&(s-=1),s<1/6?a+(l-a)*6*s:s<1/2?l:s<2/3?a+(l-a)*(2/3-s)*6:a}function o1({hue:a,saturation:l,lightness:s,alpha:r}){a/=360,l/=100,s/=100;let c=0,d=0,f=0;if(!l)c=d=f=s;else{const m=s<.5?s*(1+l):s+l-s*l,y=2*s-m;c=ec(y,m,a+1/3),d=ec(y,m,a),f=ec(y,m,a-1/3)}return{red:Math.round(c*255),green:Math.round(d*255),blue:Math.round(f*255),alpha:r}}function ho(a,l){return s=>s>0?l:a}const Ot=(a,l,s)=>a+(l-a)*s,nc=(a,l,s)=>{const r=a*a,c=s*(l*l-r)+r;return c<0?0:Math.sqrt(c)},r1=[vc,va,ci],u1=a=>r1.find(l=>l.test(a));function qp(a){const l=u1(a);if(!l)return!1;let s=l.parse(a);return l===ci&&(s=o1(s)),s}const Xp=(a,l)=>{const s=qp(a),r=qp(l);if(!s||!r)return ho(a,l);const c={...s};return d=>(c.red=nc(s.red,r.red,d),c.green=nc(s.green,r.green,d),c.blue=nc(s.blue,r.blue,d),c.alpha=Ot(s.alpha,r.alpha,d),va.transform(c))},Sc=new Set(["none","hidden"]);function c1(a,l){return Sc.has(a)?s=>s<=0?a:l:s=>s>=1?l:a}function f1(a,l){return s=>Ot(a,l,s)}function of(a){return typeof a=="number"?f1:typeof a=="string"?af(a)?ho:Jt.test(a)?Xp:m1:Array.isArray(a)?Rg:typeof a=="object"?Jt.test(a)?Xp:d1:ho}function Rg(a,l){const s=[...a],r=s.length,c=a.map((d,f)=>of(d)(d,l[f]));return d=>{for(let f=0;f<r;f++)s[f]=c[f](d);return s}}function d1(a,l){const s={...a,...l},r={};for(const c in s)a[c]!==void 0&&l[c]!==void 0&&(r[c]=of(a[c])(a[c],l[c]));return c=>{for(const d in r)s[d]=r[d](c);return s}}function h1(a,l){const s=[],r={color:0,var:0,number:0};for(let c=0;c<l.values.length;c++){const d=l.types[c],f=a.indexes[d][r[d]],m=a.values[f]??0;s[c]=m,r[d]++}return s}const m1=(a,l)=>{const s=Ze.createTransformer(l),r=hi(a),c=hi(l);return r.indexes.var.length===c.indexes.var.length&&r.indexes.color.length===c.indexes.color.length&&r.indexes.number.length>=c.indexes.number.length?Sc.has(a)&&!c.values.length||Sc.has(l)&&!r.values.length?c1(a,l):Cl(Rg(h1(r,c),c.values),s):ho(a,l)};function Og(a,l,s){return typeof a=="number"&&typeof l=="number"&&typeof s=="number"?Ot(a,l,s):of(a)(a,l)}const p1=a=>{const l=({timestamp:s})=>a(s);return{start:(s=!0)=>Vt.update(l,s),stop:()=>Wn(l),now:()=>ie.isProcessing?ie.timestamp:ue.now()}},Vg=(a,l,s=10)=>{let r="";const c=Math.max(Math.round(l/s),2);for(let d=0;d<c;d++)r+=Math.round(a(d/(c-1))*1e4)/1e4+", ";return`linear(${r.substring(0,r.length-2)})`},mo=2e4;function rf(a){let l=0;const s=50;let r=a.next(l);for(;!r.done&&l<mo;)l+=s,r=a.next(l);return l>=mo?1/0:l}function g1(a,l=100,s){const r=s({...a,keyframes:[0,l]}),c=Math.min(rf(r),mo);return{type:"keyframes",ease:d=>r.next(c*d).value/l,duration:Le(c)}}const Ht={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function Tc(a,l){return a*Math.sqrt(1-l*l)}const y1=12;function b1(a,l,s){let r=s;for(let c=1;c<y1;c++)r=r-a(r)/l(r);return r}const ac=.001;function x1({duration:a=Ht.duration,bounce:l=Ht.bounce,velocity:s=Ht.velocity,mass:r=Ht.mass}){let c,d,f=1-l;f=en(Ht.minDamping,Ht.maxDamping,f),a=en(Ht.minDuration,Ht.maxDuration,Le(a)),f<1?(c=g=>{const x=g*f,v=x*a,S=x-s,j=Tc(g,f),M=Math.exp(-v);return ac-S/j*M},d=g=>{const v=g*f*a,S=v*s+s,j=Math.pow(f,2)*Math.pow(g,2)*a,M=Math.exp(-v),V=Tc(Math.pow(g,2),f);return(-c(g)+ac>0?-1:1)*((S-j)*M)/V}):(c=g=>{const x=Math.exp(-g*a),v=(g-s)*a+1;return-ac+x*v},d=g=>{const x=Math.exp(-g*a),v=(s-g)*(a*a);return x*v});const m=5/a,y=b1(c,d,m);if(a=Ce(a),isNaN(y))return{stiffness:Ht.stiffness,damping:Ht.damping,duration:a};{const g=Math.pow(y,2)*r;return{stiffness:g,damping:f*2*Math.sqrt(r*g),duration:a}}}const v1=["duration","bounce"],S1=["stiffness","damping","mass"];function Qp(a,l){return l.some(s=>a[s]!==void 0)}function T1(a){let l={velocity:Ht.velocity,stiffness:Ht.stiffness,damping:Ht.damping,mass:Ht.mass,isResolvedFromDuration:!1,...a};if(!Qp(a,S1)&&Qp(a,v1))if(l.velocity=0,a.visualDuration){const s=a.visualDuration,r=2*Math.PI/(s*1.2),c=r*r,d=2*en(.05,1,1-(a.bounce||0))*Math.sqrt(c);l={...l,mass:Ht.mass,stiffness:c,damping:d}}else{const s=x1({...a,velocity:0});l={...l,...s,mass:Ht.mass},l.isResolvedFromDuration=!0}return l}function po(a=Ht.visualDuration,l=Ht.bounce){const s=typeof a!="object"?{visualDuration:a,keyframes:[0,1],bounce:l}:a;let{restSpeed:r,restDelta:c}=s;const d=s.keyframes[0],f=s.keyframes[s.keyframes.length-1],m={done:!1,value:d},{stiffness:y,damping:g,mass:x,duration:v,velocity:S,isResolvedFromDuration:j}=T1({...s,velocity:-Le(s.velocity||0)}),M=S||0,V=g/(2*Math.sqrt(y*x)),N=f-d,_=Le(Math.sqrt(y/x)),X=Math.abs(N)<5;r||(r=X?Ht.restSpeed.granular:Ht.restSpeed.default),c||(c=X?Ht.restDelta.granular:Ht.restDelta.default);let B,Y,J,it,q,Z;if(V<1)J=Tc(_,V),it=(M+V*_*N)/J,B=I=>{const et=Math.exp(-V*_*I);return f-et*(it*Math.sin(J*I)+N*Math.cos(J*I))},q=V*_*it+N*J,Z=V*_*N-it*J,Y=I=>Math.exp(-V*_*I)*(q*Math.sin(J*I)+Z*Math.cos(J*I));else if(V===1){B=et=>f-Math.exp(-_*et)*(N+(M+_*N)*et);const I=M+_*N;Y=et=>Math.exp(-_*et)*(_*I*et-M)}else{const I=_*Math.sqrt(V*V-1);B=mt=>{const vt=Math.exp(-V*_*mt),O=Math.min(I*mt,300);return f-vt*((M+V*_*N)*Math.sinh(O)+I*N*Math.cosh(O))/I};const et=(M+V*_*N)/I,ft=V*_*et-N*I,st=V*_*N-et*I;Y=mt=>{const vt=Math.exp(-V*_*mt),O=Math.min(I*mt,300);return vt*(ft*Math.sinh(O)+st*Math.cosh(O))}}const nt={calculatedDuration:j&&v||null,velocity:I=>Ce(Y(I)),next:I=>{if(!j&&V<1){const ft=Math.exp(-V*_*I),st=Math.sin(J*I),mt=Math.cos(J*I),vt=f-ft*(it*st+N*mt),O=Ce(ft*(q*st+Z*mt));return m.done=Math.abs(O)<=r&&Math.abs(f-vt)<=c,m.value=m.done?f:vt,m}const et=B(I);if(j)m.done=I>=v;else{const ft=Ce(Y(I));m.done=Math.abs(ft)<=r&&Math.abs(f-et)<=c}return m.value=m.done?f:et,m},toString:()=>{const I=Math.min(rf(nt),mo),et=Vg(ft=>nt.next(I*ft).value,I,30);return I+"ms "+et},toTransition:()=>{}};return nt}po.applyToOptions=a=>{const l=g1(a,100,po);return a.ease=l.ease,a.duration=Ce(l.duration),a.type="keyframes",a};const j1=5;function kg(a,l,s){const r=Math.max(l-j1,0);return mg(s-a(r),l-r)}function jc({keyframes:a,velocity:l=0,power:s=.8,timeConstant:r=325,bounceDamping:c=10,bounceStiffness:d=500,modifyTarget:f,min:m,max:y,restDelta:g=.5,restSpeed:x}){const v=a[0],S={done:!1,value:v},j=Z=>m!==void 0&&Z<m||y!==void 0&&Z>y,M=Z=>m===void 0?y:y===void 0||Math.abs(m-Z)<Math.abs(y-Z)?m:y;let V=s*l;const N=v+V,_=f===void 0?N:f(N);_!==N&&(V=_-v);const X=Z=>-V*Math.exp(-Z/r),B=Z=>_+X(Z),Y=Z=>{const nt=X(Z),I=B(Z);S.done=Math.abs(nt)<=g,S.value=S.done?_:I};let J,it;const q=Z=>{j(S.value)&&(J=Z,it=po({keyframes:[S.value,M(S.value)],velocity:kg(B,Z,S.value),damping:c,stiffness:d,restDelta:g,restSpeed:x}))};return q(0),{calculatedDuration:null,next:Z=>{let nt=!1;return!it&&J===void 0&&(nt=!0,Y(Z),q(Z)),J!==void 0&&Z>=J?it.next(Z-J):(!nt&&Y(Z),S)}}}function A1(a,l,s){const r=[],c=s||Fn.mix||Og,d=a.length-1;for(let f=0;f<d;f++){let m=c(a[f],a[f+1]);if(l){const y=Array.isArray(l)?l[f]||He:l;m=Cl(y,m)}r.push(m)}return r}function E1(a,l,{clamp:s=!0,ease:r,mixer:c}={}){const d=a.length;if(Ic(d===l.length),d===1)return()=>l[0];if(d===2&&l[0]===l[1])return()=>l[1];const f=a[0]===a[1];a[0]>a[d-1]&&(a=[...a].reverse(),l=[...l].reverse());const m=A1(l,r,c),y=m.length,g=x=>{if(f&&x<a[0])return l[0];let v=0;if(y>1)for(;v<a.length-2&&!(x<a[v+1]);v++);const S=jl(a[v],a[v+1],x);return m[v](S)};return s?x=>g(en(a[0],a[d-1],x)):g}function M1(a,l){const s=a[a.length-1];for(let r=1;r<=l;r++){const c=jl(0,l,r);a.push(Ot(s,1,c))}}function w1(a){const l=[0];return M1(l,a.length-1),l}function C1(a,l){return a.map(s=>s*l)}function N1(a,l){return a.map(()=>l||jg).splice(0,a.length-1)}function vl({duration:a=300,keyframes:l,times:s,ease:r="easeInOut"}){const c=_v(r)?r.map(Lp):Lp(r),d={done:!1,value:l[0]},f=C1(s&&s.length===l.length?s:w1(l),a),m=E1(f,l,{ease:Array.isArray(c)?c:N1(l,c)});return{calculatedDuration:a,next:y=>(d.value=m(y),d.done=y>=a,d)}}const D1=a=>a!==null;function Eo(a,{repeat:l,repeatType:s="loop"},r,c=1){const d=a.filter(D1),m=c<0||l&&s!=="loop"&&l%2===1?0:d.length-1;return!m||r===void 0?d[m]:r}const z1={decay:jc,inertia:jc,tween:vl,keyframes:vl,spring:po};function Bg(a){typeof a.type=="string"&&(a.type=z1[a.type])}class uf{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(l=>{this.resolve=l})}notifyFinished(){this.resolve()}then(l,s){return this.finished.then(l,s)}}const R1=a=>a/100;class go extends uf{constructor(l){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{var r,c;const{motionValue:s}=this.options;s&&s.updatedAt!==ue.now()&&this.tick(ue.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),(c=(r=this.options).onStop)==null||c.call(r))},this.options=l,this.initAnimation(),this.play(),l.autoplay===!1&&this.pause()}initAnimation(){const{options:l}=this;Bg(l);const{type:s=vl,repeat:r=0,repeatDelay:c=0,repeatType:d,velocity:f=0}=l;let{keyframes:m}=l;const y=s||vl;y!==vl&&typeof m[0]!="number"&&(this.mixKeyframes=Cl(R1,Og(m[0],m[1])),m=[0,100]);const g=y({...l,keyframes:m});d==="mirror"&&(this.mirroredGenerator=y({...l,keyframes:[...m].reverse(),velocity:-f})),g.calculatedDuration===null&&(g.calculatedDuration=rf(g));const{calculatedDuration:x}=g;this.calculatedDuration=x,this.resolvedDuration=x+c,this.totalDuration=this.resolvedDuration*(r+1)-c,this.generator=g}updateTime(l){const s=Math.round(l-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=s}tick(l,s=!1){const{generator:r,totalDuration:c,mixKeyframes:d,mirroredGenerator:f,resolvedDuration:m,calculatedDuration:y}=this;if(this.startTime===null)return r.next(0);const{delay:g=0,keyframes:x,repeat:v,repeatType:S,repeatDelay:j,type:M,onUpdate:V,finalKeyframe:N}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,l):this.speed<0&&(this.startTime=Math.min(l-c/this.speed,this.startTime)),s?this.currentTime=l:this.updateTime(l);const _=this.currentTime-g*(this.playbackSpeed>=0?1:-1),X=this.playbackSpeed>=0?_<0:_>c;this.currentTime=Math.max(_,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=c);let B=this.currentTime,Y=r;if(v){const Z=Math.min(this.currentTime,c)/m;let nt=Math.floor(Z),I=Z%1;!I&&Z>=1&&(I=1),I===1&&nt--,nt=Math.min(nt,v+1),!!(nt%2)&&(S==="reverse"?(I=1-I,j&&(I-=j/m)):S==="mirror"&&(Y=f)),B=en(0,1,I)*m}let J;X?(this.delayState.value=x[0],J=this.delayState):J=Y.next(B),d&&!X&&(J.value=d(J.value));let{done:it}=J;!X&&y!==null&&(it=this.playbackSpeed>=0?this.currentTime>=c:this.currentTime<=0);const q=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&it);return q&&M!==jc&&(J.value=Eo(x,this.options,N,this.speed)),V&&V(J.value),q&&this.finish(),J}then(l,s){return this.finished.then(l,s)}get duration(){return Le(this.calculatedDuration)}get iterationDuration(){const{delay:l=0}=this.options||{};return this.duration+Le(l)}get time(){return Le(this.currentTime)}set time(l){l=Ce(l),this.currentTime=l,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=l:this.driver&&(this.startTime=this.driver.now()-l/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=l,this.tick(l))}getGeneratorVelocity(){const l=this.currentTime;if(l<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(l);const s=this.generator.next(l).value;return kg(r=>this.generator.next(r).value,l,s)}get speed(){return this.playbackSpeed}set speed(l){const s=this.playbackSpeed!==l;s&&this.driver&&this.updateTime(ue.now()),this.playbackSpeed=l,s&&this.driver&&(this.time=Le(this.currentTime))}play(){var c,d;if(this.isStopped)return;const{driver:l=p1,startTime:s}=this.options;this.driver||(this.driver=l(f=>this.tick(f))),(d=(c=this.options).onPlay)==null||d.call(c);const r=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=r):this.holdTime!==null?this.startTime=r-this.holdTime:this.startTime||(this.startTime=s??r),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(ue.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){var l,s;this.notifyFinished(),this.teardown(),this.state="finished",(s=(l=this.options).onComplete)==null||s.call(l)}cancel(){var l,s;this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),(s=(l=this.options).onCancel)==null||s.call(l)}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(l){return this.startTime=0,this.tick(l,!0)}attachTimeline(l){var s;return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),(s=this.driver)==null||s.stop(),l.observe(this)}}function O1(a){for(let l=1;l<a.length;l++)a[l]??(a[l]=a[l-1])}const Sa=a=>a*180/Math.PI,Ac=a=>{const l=Sa(Math.atan2(a[1],a[0]));return Ec(l)},V1={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:a=>(Math.abs(a[0])+Math.abs(a[3]))/2,rotate:Ac,rotateZ:Ac,skewX:a=>Sa(Math.atan(a[1])),skewY:a=>Sa(Math.atan(a[2])),skew:a=>(Math.abs(a[1])+Math.abs(a[2]))/2},Ec=a=>(a=a%360,a<0&&(a+=360),a),Zp=Ac,Kp=a=>Math.sqrt(a[0]*a[0]+a[1]*a[1]),Jp=a=>Math.sqrt(a[4]*a[4]+a[5]*a[5]),k1={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:Kp,scaleY:Jp,scale:a=>(Kp(a)+Jp(a))/2,rotateX:a=>Ec(Sa(Math.atan2(a[6],a[5]))),rotateY:a=>Ec(Sa(Math.atan2(-a[2],a[0]))),rotateZ:Zp,rotate:Zp,skewX:a=>Sa(Math.atan(a[4])),skewY:a=>Sa(Math.atan(a[1])),skew:a=>(Math.abs(a[1])+Math.abs(a[4]))/2};function Mc(a){return a.includes("scale")?1:0}function wc(a,l){if(!a||a==="none")return Mc(l);const s=a.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let r,c;if(s)r=k1,c=s;else{const m=a.match(/^matrix\(([-\d.e\s,]+)\)$/u);r=V1,c=m}if(!c)return Mc(l);const d=r[l],f=c[1].split(",").map(_1);return typeof d=="function"?d(f):f[d]}const B1=(a,l)=>{const{transform:s="none"}=getComputedStyle(a);return wc(s,l)};function _1(a){return parseFloat(a.trim())}const gi=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],yi=new Set([...gi,"pathRotation"]),Fp=a=>a===pi||a===$,U1=new Set(["x","y","z"]),L1=gi.filter(a=>!U1.has(a));function H1(a){const l=[];return L1.forEach(s=>{const r=a.getValue(s);r!==void 0&&(l.push([s,r.get()]),r.set(s.startsWith("scale")?1:0))}),l}const Jn={width:({x:a},{paddingLeft:l="0",paddingRight:s="0",boxSizing:r})=>{const c=a.max-a.min;return r==="border-box"?c:c-parseFloat(l)-parseFloat(s)},height:({y:a},{paddingTop:l="0",paddingBottom:s="0",boxSizing:r})=>{const c=a.max-a.min;return r==="border-box"?c:c-parseFloat(l)-parseFloat(s)},top:(a,{top:l})=>parseFloat(l),left:(a,{left:l})=>parseFloat(l),bottom:({y:a},{top:l})=>parseFloat(l)+(a.max-a.min),right:({x:a},{left:l})=>parseFloat(l)+(a.max-a.min),x:(a,{transform:l})=>wc(l,"x"),y:(a,{transform:l})=>wc(l,"y")};Jn.translateX=Jn.x;Jn.translateY=Jn.y;const ja=new Set;let Cc=!1,Nc=!1,Dc=!1;function _g(){if(Nc){const a=Array.from(ja).filter(r=>r.needsMeasurement),l=new Set(a.map(r=>r.element)),s=new Map;l.forEach(r=>{const c=H1(r);c.length&&(s.set(r,c),r.render())}),a.forEach(r=>r.measureInitialState()),l.forEach(r=>{r.render();const c=s.get(r);c&&c.forEach(([d,f])=>{var m;(m=r.getValue(d))==null||m.set(f)})}),a.forEach(r=>r.measureEndState()),a.forEach(r=>{r.suspendedScrollY!==void 0&&window.scrollTo(0,r.suspendedScrollY)})}Nc=!1,Cc=!1,ja.forEach(a=>a.complete(Dc)),ja.clear()}function Ug(){ja.forEach(a=>{a.readKeyframes(),a.needsMeasurement&&(Nc=!0)})}function G1(){Dc=!0,Ug(),_g(),Dc=!1}class cf{constructor(l,s,r,c,d,f=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...l],this.onComplete=s,this.name=r,this.motionValue=c,this.element=d,this.isAsync=f}scheduleResolve(){this.state="scheduled",this.isAsync?(ja.add(this),Cc||(Cc=!0,Vt.read(Ug),Vt.resolveKeyframes(_g))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:l,name:s,element:r,motionValue:c}=this;if(l[0]===null){const d=c==null?void 0:c.get(),f=l[l.length-1];if(d!==void 0)l[0]=d;else if(r&&s){const m=r.readValue(s,f);m!=null&&(l[0]=m)}l[0]===void 0&&(l[0]=f),c&&d===void 0&&c.set(l[0])}O1(l)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(l=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,l),ja.delete(this)}cancel(){this.state==="scheduled"&&(ja.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const Y1=a=>a.startsWith("--");function Lg(a,l,s){Y1(l)?a.style.setProperty(l,s):a.style[l]=s}const q1={};function Hg(a,l){const s=hg(a);return()=>q1[l]??s()}const X1=Hg(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),Gg=Hg(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),bl=([a,l,s,r])=>`cubic-bezier(${a}, ${l}, ${s}, ${r})`,Wp={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:bl([0,.65,.55,1]),circOut:bl([.55,0,1,.45]),backIn:bl([.31,.01,.66,-.59]),backOut:bl([.33,1.53,.69,.99])};function Yg(a,l){if(a)return typeof a=="function"?Gg()?Vg(a,l):"ease-out":Ag(a)?bl(a):Array.isArray(a)?a.map(s=>Yg(s,l)||Wp.easeOut):Wp[a]}function Q1(a,l,s,{delay:r=0,duration:c=300,repeat:d=0,repeatType:f="loop",ease:m="easeOut",times:y}={},g=void 0){const x={[l]:s};y&&(x.offset=y);const v=Yg(m,c);Array.isArray(v)&&(x.easing=v);const S={delay:r,duration:c,easing:Array.isArray(v)?"linear":v,fill:"both",iterations:d+1,direction:f==="reverse"?"alternate":"normal"};return g&&(S.pseudoElement=g),a.animate(x,S)}function qg(a){return typeof a=="function"&&"applyToOptions"in a}function Z1({type:a,...l}){return qg(a)&&Gg()?a.applyToOptions(l):(l.duration??(l.duration=300),l.ease??(l.ease="easeOut"),l)}class Xg extends uf{constructor(l){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!l)return;const{element:s,name:r,keyframes:c,pseudoElement:d,allowFlatten:f=!1,finalKeyframe:m,onComplete:y}=l;this.isPseudoElement=!!d,this.allowFlatten=f,this.options=l,Ic(typeof l.type!="string");const g=Z1(l);this.animation=Q1(s,r,c,g,d),g.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!d){const x=Eo(c,this.options,m,this.speed);this.updateMotionValue&&this.updateMotionValue(x),Lg(s,r,x),this.animation.cancel()}y==null||y(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){var l,s;(s=(l=this.animation).finish)==null||s.call(l)}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:l}=this;l==="idle"||l==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){var s,r,c;const l=(s=this.options)==null?void 0:s.element;!this.isPseudoElement&&(l!=null&&l.isConnected)&&((c=(r=this.animation).commitStyles)==null||c.call(r))}get duration(){var s,r;const l=((r=(s=this.animation.effect)==null?void 0:s.getComputedTiming)==null?void 0:r.call(s).duration)||0;return Le(Number(l))}get iterationDuration(){const{delay:l=0}=this.options||{};return this.duration+Le(l)}get time(){return Le(Number(this.animation.currentTime)||0)}set time(l){const s=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=Ce(l),s&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(l){l<0&&(this.finishedTime=null),this.animation.playbackRate=l}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(l){this.manualStartTime=this.animation.startTime=l}attachTimeline({timeline:l,rangeStart:s,rangeEnd:r,observe:c}){var d;return this.allowFlatten&&((d=this.animation.effect)==null||d.updateTiming({easing:"linear"})),this.animation.onfinish=null,l&&X1()?(this.animation.timeline=l,s&&(this.animation.rangeStart=s),r&&(this.animation.rangeEnd=r),He):c(this)}}const Qg={anticipate:vg,backInOut:xg,circInOut:Tg};function K1(a){return a in Qg}function J1(a){typeof a.ease=="string"&&K1(a.ease)&&(a.ease=Qg[a.ease])}const ic=10;class F1 extends Xg{constructor(l){J1(l),Bg(l),super(l),l.startTime!==void 0&&l.autoplay!==!1&&(this.startTime=l.startTime),this.options=l}updateMotionValue(l){const{motionValue:s,onUpdate:r,onComplete:c,element:d,...f}=this.options;if(!s)return;if(l!==void 0){s.set(l);return}const m=new go({...f,autoplay:!1}),y=Math.max(ic,ue.now()-this.startTime),g=en(0,ic,y-ic),x=m.sample(y).value,{name:v}=this.options;d&&v&&Lg(d,v,x),s.setWithVelocity(m.sample(Math.max(0,y-g)).value,x,g),m.stop()}}const Pp=(a,l)=>l==="zIndex"?!1:!!(typeof a=="number"||Array.isArray(a)||typeof a=="string"&&(Ze.test(a)||a==="0")&&!a.startsWith("url("));function W1(a){const l=a[0];if(a.length===1)return!0;for(let s=0;s<a.length;s++)if(a[s]!==l)return!0}function P1(a,l,s,r){const c=a[0];if(c===null)return!1;if(l==="display"||l==="visibility")return!0;const d=a[a.length-1],f=Pp(c,l),m=Pp(d,l);return!f||!m?!1:W1(a)||(s==="spring"||qg(s))&&r}function zc(a){a.duration=0,a.type="keyframes"}const Zg=new Set(["opacity","clipPath","filter","transform"]),$1=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function I1(a){for(let l=0;l<a.length;l++)if(typeof a[l]=="string"&&$1.test(a[l]))return!0;return!1}const t2=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),e2=hg(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function n2(a){var v;const{motionValue:l,name:s,repeatDelay:r,repeatType:c,damping:d,type:f,keyframes:m}=a;if(!(((v=l==null?void 0:l.owner)==null?void 0:v.current)instanceof HTMLElement))return!1;const{onUpdate:g,transformTemplate:x}=l.owner.getProps();return e2()&&s&&(Zg.has(s)||t2.has(s)&&I1(m))&&(s!=="transform"||!x)&&!g&&!r&&c!=="mirror"&&d!==0&&f!=="inertia"}const a2=40;class i2 extends uf{constructor({autoplay:l=!0,delay:s=0,type:r="keyframes",repeat:c=0,repeatDelay:d=0,repeatType:f="loop",keyframes:m,name:y,motionValue:g,element:x,...v}){var M;super(),this.stop=()=>{var V,N;this._animation&&(this._animation.stop(),(V=this.stopTimeline)==null||V.call(this)),(N=this.keyframeResolver)==null||N.cancel()},this.createdAt=ue.now();const S={autoplay:l,delay:s,type:r,repeat:c,repeatDelay:d,repeatType:f,name:y,motionValue:g,element:x,...v},j=(x==null?void 0:x.KeyframeResolver)||cf;this.keyframeResolver=new j(m,(V,N,_)=>this.onKeyframesResolved(V,N,S,!_),y,g,x),(M=this.keyframeResolver)==null||M.scheduleResolve()}onKeyframesResolved(l,s,r,c){var _,X;this.keyframeResolver=void 0;const{name:d,type:f,velocity:m,delay:y,isHandoff:g,onUpdate:x}=r;this.resolvedAt=ue.now();let v=!0;P1(l,d,f,m)||(v=!1,(Fn.instantAnimations||!y)&&(x==null||x(Eo(l,r,s))),l[0]=l[l.length-1],zc(r),r.repeat=0);const j={startTime:c?this.resolvedAt?this.resolvedAt-this.createdAt>a2?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:s,...r,keyframes:l},M=v&&!g&&n2(j),V=(X=(_=j.motionValue)==null?void 0:_.owner)==null?void 0:X.current;let N;if(M)try{N=new F1({...j,element:V})}catch{N=new go(j)}else N=new go(j);N.finished.then(()=>{this.notifyFinished()}).catch(He),this.pendingTimeline&&(this.stopTimeline=N.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=N}get finished(){return this._animation?this.animation.finished:this._finished}then(l,s){return this.finished.finally(l).then(()=>{})}get animation(){var l;return this._animation||((l=this.keyframeResolver)==null||l.resume(),G1()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(l){this.animation.time=l}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(l){this.animation.speed=l}get startTime(){return this.animation.startTime}attachTimeline(l){return this._animation?this.stopTimeline=this.animation.attachTimeline(l):this.pendingTimeline=l,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){var l;this._animation&&this.animation.cancel(),(l=this.keyframeResolver)==null||l.cancel()}}function Kg(a,l,s,r=0,c=1){const d=Array.from(a).sort((g,x)=>g.sortNodePosition(x)).indexOf(l),f=a.size,m=(f-1)*r;return typeof s=="function"?s(d,f):c===1?d*r:m-d*r}const $p=30,l2=a=>!isNaN(parseFloat(a));class s2{constructor(l,s={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=r=>{var d;const c=ue.now();if(this.updatedAt!==c&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(r),this.current!==this.prev&&((d=this.events.change)==null||d.notify(this.current),this.dependents))for(const f of this.dependents)f.dirty()},this.hasAnimated=!1,this.setCurrent(l),this.owner=s.owner}setCurrent(l){this.current=l,this.updatedAt=ue.now(),this.canTrackVelocity===null&&l!==void 0&&(this.canTrackVelocity=l2(this.current))}setPrevFrameValue(l=this.current){this.prevFrameValue=l,this.prevUpdatedAt=this.updatedAt}onChange(l){return this.on("change",l)}on(l,s){this.events[l]||(this.events[l]=new tf);const r=this.events[l].add(s);return l==="change"?()=>{r(),Vt.read(()=>{this.events.change.getSize()||this.stop()})}:r}clearListeners(){for(const l in this.events)this.events[l].clear()}attach(l,s){this.passiveEffect=l,this.stopPassiveEffect=s}set(l){this.passiveEffect?this.passiveEffect(l,this.updateAndNotify):this.updateAndNotify(l)}setWithVelocity(l,s,r){this.set(s),this.prev=void 0,this.prevFrameValue=l,this.prevUpdatedAt=this.updatedAt-r}jump(l,s=!0){this.updateAndNotify(l),this.prev=l,this.prevUpdatedAt=this.prevFrameValue=void 0,s&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){var l;(l=this.events.change)==null||l.notify(this.current)}addDependent(l){this.dependents||(this.dependents=new Set),this.dependents.add(l)}removeDependent(l){this.dependents&&this.dependents.delete(l)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const l=ue.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||l-this.updatedAt>$p)return 0;const s=Math.min(this.updatedAt-this.prevUpdatedAt,$p);return mg(parseFloat(this.current)-parseFloat(this.prevFrameValue),s)}start(l){return this.stop(),new Promise(s=>{this.hasAnimated=!0,this.animation=l(s),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){var l,s;(l=this.dependents)==null||l.clear(),(s=this.events.destroy)==null||s.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function mi(a,l){return new s2(a,l)}function Jg(a,l){if(a!=null&&a.inherit&&l){const{inherit:s,...r}=a;return{...l,...r}}return a}function ff(a,l){const s=(a==null?void 0:a[l])??(a==null?void 0:a.default)??a;return s!==a?Jg(s,a):s}const o2={type:"spring",stiffness:500,damping:25,restSpeed:10},r2=a=>({type:"spring",stiffness:550,damping:a===0?2*Math.sqrt(550):30,restSpeed:10}),u2={type:"keyframes",duration:.8},c2={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},f2=(a,{keyframes:l})=>l.length>2?u2:yi.has(a)?a.startsWith("scale")?r2(l[1]):o2:c2,d2=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function h2(a){for(const l in a)if(!d2.has(l))return!0;return!1}const df=(a,l,s,r={},c,d)=>f=>{const m=ff(r,a)||{},y=m.delay||r.delay||0;let{elapsed:g=0}=r;g=g-Ce(y);const x={keyframes:Array.isArray(s)?s:[null,s],ease:"easeOut",velocity:l.getVelocity(),...m,delay:-g,onUpdate:S=>{l.set(S),m.onUpdate&&m.onUpdate(S)},onComplete:()=>{f(),m.onComplete&&m.onComplete()},name:a,motionValue:l,element:d?void 0:c};h2(m)||Object.assign(x,f2(a,x)),x.duration&&(x.duration=Ce(x.duration)),x.repeatDelay&&(x.repeatDelay=Ce(x.repeatDelay)),x.from!==void 0&&(x.keyframes[0]=x.from);let v=!1;if((x.type===!1||x.duration===0&&!x.repeatDelay)&&(zc(x),x.delay===0&&(v=!0)),(Fn.instantAnimations||Fn.skipAnimations||c!=null&&c.shouldSkipAnimations||m.skipAnimations)&&(v=!0,zc(x),x.delay=0),x.allowFlatten=!m.type&&!m.ease,v&&!d&&l.get()!==void 0){const S=Eo(x.keyframes,m);if(S!==void 0){Vt.update(()=>{x.onUpdate(S),x.onComplete()});return}}return m.isSync?new go(x):new i2(x)},m2=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function p2(a){const l=m2.exec(a);if(!l)return[,];const[,s,r,c]=l;return[`--${s??r}`,c]}function Fg(a,l,s=1){const[r,c]=p2(a);if(!r)return;const d=window.getComputedStyle(l).getPropertyValue(r);if(d){const f=d.trim();return cg(f)?parseFloat(f):f}return af(c)?Fg(c,l,s+1):c}function Ip(a){const l=[{},{}];return a==null||a.values.forEach((s,r)=>{l[0][r]=s.get(),l[1][r]=s.getVelocity()}),l}function hf(a,l,s,r){if(typeof l=="function"){const[c,d]=Ip(r);l=l(s!==void 0?s:a.custom,c,d)}if(typeof l=="string"&&(l=a.variants&&a.variants[l]),typeof l=="function"){const[c,d]=Ip(r);l=l(s!==void 0?s:a.custom,c,d)}return l}function Aa(a,l,s){const r=a.getProps();return hf(r,l,s!==void 0?s:r.custom,a)}const Wg=new Set(["width","height","top","left","right","bottom",...gi]),Rc=a=>Array.isArray(a);function g2(a,l,s){a.hasValue(l)?a.getValue(l).set(s):a.addValue(l,mi(s))}function y2(a){return Rc(a)?a[a.length-1]||0:a}function b2(a,l){const s=Aa(a,l);let{transitionEnd:r={},transition:c={},...d}=s||{};d={...d,...r};for(const f in d){const m=y2(d[f]);g2(a,f,m)}}const le=a=>!!(a&&a.getVelocity);function x2(a){return!!(le(a)&&a.add)}function Oc(a,l){const s=a.getValue("willChange");if(x2(s))return s.add(l);if(!s&&Fn.WillChange){const r=new Fn.WillChange("auto");a.addValue("willChange",r),r.add(l)}}function mf(a){return a.replace(/([A-Z])/g,l=>`-${l.toLowerCase()}`)}const v2="framerAppearId",Pg="data-"+mf(v2);function $g(a){return a.props[Pg]}function S2({protectedKeys:a,needsAnimating:l},s){const r=a.hasOwnProperty(s)&&l[s]!==!0;return l[s]=!1,r}function Ig(a,l,{delay:s=0,transitionOverride:r,type:c}={}){let{transition:d,transitionEnd:f,...m}=l;const y=a.getDefaultTransition();d=d?Jg(d,y):y;const g=d==null?void 0:d.reduceMotion,x=d==null?void 0:d.skipAnimations;r&&(d=r);const v=[],S=c&&a.animationState&&a.animationState.getState()[c],j=d==null?void 0:d.path;j&&j.animateVisualElement(a,m,d,s,v);for(const M in m){const V=a.getValue(M,a.latestValues[M]??null),N=m[M];if(N===void 0||S&&S2(S,M))continue;const _={delay:s,...ff(d||{},M)};x&&(_.skipAnimations=!0);const X=V.get();if(X!==void 0&&!V.isAnimating()&&!Array.isArray(N)&&N===X&&!_.velocity){Vt.update(()=>V.set(N));continue}let B=!1;if(window.MotionHandoffAnimation){const it=$g(a);if(it){const q=window.MotionHandoffAnimation(it,M,Vt);q!==null&&(_.startTime=q,B=!0)}}Oc(a,M);const Y=g??a.shouldReduceMotion;V.start(df(M,V,N,Y&&Wg.has(M)?{type:!1}:_,a,B));const J=V.animation;J&&v.push(J)}if(f){const M=()=>Vt.update(()=>{f&&b2(a,f)});v.length?Promise.all(v).then(M):M()}return v}function Vc(a,l,s={}){var y;const r=Aa(a,l,s.type==="exit"?(y=a.presenceContext)==null?void 0:y.custom:void 0);let{transition:c=a.getDefaultTransition()||{}}=r||{};s.transitionOverride&&(c=s.transitionOverride);const d=r?()=>Promise.all(Ig(a,r,s)):()=>Promise.resolve(),f=a.variantChildren&&a.variantChildren.size?(g=0)=>{const{delayChildren:x=0,staggerChildren:v,staggerDirection:S}=c;return T2(a,l,g,x,v,S,s)}:()=>Promise.resolve(),{when:m}=c;if(m){const[g,x]=m==="beforeChildren"?[d,f]:[f,d];return g().then(()=>x())}else return Promise.all([d(),f(s.delay)])}function T2(a,l,s=0,r=0,c=0,d=1,f){const m=[];for(const y of a.variantChildren)y.notify("AnimationStart",l),m.push(Vc(y,l,{...f,delay:s+(typeof r=="function"?0:r)+Kg(a.variantChildren,y,r,c,d)}).then(()=>y.notify("AnimationComplete",l)));return Promise.all(m)}function j2(a,l,s={}){a.notify("AnimationStart",l);let r;if(Array.isArray(l)){const c=l.map(d=>Vc(a,d,s));r=Promise.all(c)}else if(typeof l=="string")r=Vc(a,l,s);else{const c=typeof l=="function"?Aa(a,l,s.custom):l;r=Promise.all(Ig(a,c,s))}return r.then(()=>{a.notify("AnimationComplete",l)})}const A2={test:a=>a==="auto",parse:a=>a},ty=a=>l=>l.test(a),ey=[pi,$,tn,Sn,Wv,Fv,A2],t0=a=>ey.find(ty(a));function E2(a){return typeof a=="number"?a===0:a!==null?a==="none"||a==="0"||dg(a):!0}const M2=new Set(["brightness","contrast","saturate","opacity"]);function w2(a){const[l,s]=a.slice(0,-1).split("(");if(l==="drop-shadow")return a;const[r]=s.match(lf)||[];if(!r)return a;const c=s.replace(r,"");let d=M2.has(l)?1:0;return r!==s&&(d*=100),l+"("+d+c+")"}const C2=/\b([a-z-]*)\(.*?\)/gu,kc={...Ze,getAnimatableNone:a=>{const l=a.match(C2);return l?l.map(w2).join(" "):a}},Bc={...Ze,getAnimatableNone:a=>{const l=Ze.parse(a);return Ze.createTransformer(a)(l.map(r=>typeof r=="number"?0:typeof r=="object"?{...r,alpha:1}:r))}},e0={...pi,transform:Math.round},N2={rotate:Sn,pathRotation:Sn,rotateX:Sn,rotateY:Sn,rotateZ:Sn,scale:Ps,scaleX:Ps,scaleY:Ps,scaleZ:Ps,skew:Sn,skewX:Sn,skewY:Sn,distance:$,translateX:$,translateY:$,translateZ:$,x:$,y:$,z:$,perspective:$,transformPerspective:$,opacity:Al,originX:Gp,originY:Gp,originZ:$},yo={borderWidth:$,borderTopWidth:$,borderRightWidth:$,borderBottomWidth:$,borderLeftWidth:$,borderRadius:$,borderTopLeftRadius:$,borderTopRightRadius:$,borderBottomRightRadius:$,borderBottomLeftRadius:$,width:$,maxWidth:$,height:$,maxHeight:$,top:$,right:$,bottom:$,left:$,inset:$,insetBlock:$,insetBlockStart:$,insetBlockEnd:$,insetInline:$,insetInlineStart:$,insetInlineEnd:$,padding:$,paddingTop:$,paddingRight:$,paddingBottom:$,paddingLeft:$,paddingBlock:$,paddingBlockStart:$,paddingBlockEnd:$,paddingInline:$,paddingInlineStart:$,paddingInlineEnd:$,margin:$,marginTop:$,marginRight:$,marginBottom:$,marginLeft:$,marginBlock:$,marginBlockStart:$,marginBlockEnd:$,marginInline:$,marginInlineStart:$,marginInlineEnd:$,fontSize:$,backgroundPositionX:$,backgroundPositionY:$,...N2,zIndex:e0,fillOpacity:Al,strokeOpacity:Al,numOctaves:e0},D2={...yo,color:Jt,backgroundColor:Jt,outlineColor:Jt,fill:Jt,stroke:Jt,borderColor:Jt,borderTopColor:Jt,borderRightColor:Jt,borderBottomColor:Jt,borderLeftColor:Jt,filter:kc,WebkitFilter:kc,mask:Bc,WebkitMask:Bc},ny=a=>D2[a],z2=new Set([kc,Bc]);function ay(a,l){let s=ny(a);return z2.has(s)||(s=Ze),s.getAnimatableNone?s.getAnimatableNone(l):void 0}const R2=new Set(["auto","none","0"]);function O2(a,l,s){let r=0,c;for(;r<a.length&&!c;){const d=a[r];typeof d=="string"&&!R2.has(d)&&hi(d).values.length&&(c=a[r]),r++}if(c&&s)for(const d of l)a[d]=ay(s,c)}class V2 extends cf{constructor(l,s,r,c,d){super(l,s,r,c,d,!0)}readKeyframes(){const{unresolvedKeyframes:l,element:s,name:r}=this;if(!s||!s.current)return;super.readKeyframes();for(let x=0;x<l.length;x++){let v=l[x];if(typeof v=="string"&&(v=v.trim(),af(v))){const S=Fg(v,s.current);S!==void 0&&(l[x]=S),x===l.length-1&&(this.finalKeyframe=v)}}if(this.resolveNoneKeyframes(),!Wg.has(r)||l.length!==2)return;const[c,d]=l,f=t0(c),m=t0(d),y=Hp(c),g=Hp(d);if(y!==g&&Jn[r]){this.needsMeasurement=!0;return}if(f!==m)if(Fp(f)&&Fp(m))for(let x=0;x<l.length;x++){const v=l[x];typeof v=="string"&&(l[x]=parseFloat(v))}else Jn[r]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:l,name:s}=this,r=[];for(let c=0;c<l.length;c++)(l[c]===null||E2(l[c]))&&r.push(c);r.length&&O2(l,r,s)}measureInitialState(){const{element:l,unresolvedKeyframes:s,name:r}=this;if(!l||!l.current)return;r==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Jn[r](l.measureViewportBox(),window.getComputedStyle(l.current)),s[0]=this.measuredOrigin;const c=s[s.length-1];c!==void 0&&l.getValue(r,c).jump(c,!1)}measureEndState(){var m;const{element:l,name:s,unresolvedKeyframes:r}=this;if(!l||!l.current)return;const c=l.getValue(s);c&&c.jump(this.measuredOrigin,!1);const d=r.length-1,f=r[d];r[d]=Jn[s](l.measureViewportBox(),window.getComputedStyle(l.current)),f!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=f),(m=this.removedTransforms)!=null&&m.length&&this.removedTransforms.forEach(([y,g])=>{l.getValue(y).set(g)}),this.resolveNoneKeyframes()}}function iy(a,l,s){if(a==null)return[];if(a instanceof EventTarget)return[a];if(typeof a=="string"){let r=document;const c=(s==null?void 0:s[a])??r.querySelectorAll(a);return c?Array.from(c):[]}return Array.from(a).filter(r=>r!=null)}const _c=(a,l)=>l&&typeof a=="number"?l.transform(a):a;function io(a){return fg(a)&&"offsetHeight"in a&&!("ownerSVGElement"in a)}const{schedule:pf}=Eg(queueMicrotask,!1),Qe={x:!1,y:!1};function ly(){return Qe.x||Qe.y}function k2(a){return a==="x"||a==="y"?Qe[a]?null:(Qe[a]=!0,()=>{Qe[a]=!1}):Qe.x||Qe.y?null:(Qe.x=Qe.y=!0,()=>{Qe.x=Qe.y=!1})}function sy(a,l){const s=iy(a),r=new AbortController,c={passive:!0,...l,signal:r.signal};return[s,c,()=>r.abort()]}function B2(a){return!(a.pointerType==="touch"||ly())}function _2(a,l,s={}){const[r,c,d]=sy(a,s);return r.forEach(f=>{let m=!1,y=!1,g;const x=()=>{f.removeEventListener("pointerleave",M)},v=N=>{g&&(g(N),g=void 0),x()},S=N=>{m=!1,window.removeEventListener("pointerup",S),window.removeEventListener("pointercancel",S),y&&(y=!1,v(N))},j=()=>{m=!0,window.addEventListener("pointerup",S,c),window.addEventListener("pointercancel",S,c)},M=N=>{if(N.pointerType!=="touch"){if(m){y=!0;return}v(N)}},V=N=>{if(!B2(N))return;y=!1;const _=l(f,N);typeof _=="function"&&(g=_,f.addEventListener("pointerleave",M,c))};f.addEventListener("pointerenter",V,c),f.addEventListener("pointerdown",j,c)}),d}const oy=(a,l)=>l?a===l?!0:oy(a,l.parentElement):!1,gf=a=>a.pointerType==="mouse"?typeof a.button!="number"||a.button<=0:a.isPrimary!==!1,U2=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function L2(a){return U2.has(a.tagName)||a.isContentEditable===!0}const H2=new Set(["INPUT","SELECT","TEXTAREA"]);function G2(a){return H2.has(a.tagName)||a.isContentEditable===!0}const lo=new WeakSet;function n0(a){return l=>{l.key==="Enter"&&a(l)}}function lc(a,l){a.dispatchEvent(new PointerEvent("pointer"+l,{isPrimary:!0,bubbles:!0}))}const Y2=(a,l)=>{const s=a.currentTarget;if(!s)return;const r=n0(()=>{if(lo.has(s))return;lc(s,"down");const c=n0(()=>{lc(s,"up")}),d=()=>lc(s,"cancel");s.addEventListener("keyup",c,l),s.addEventListener("blur",d,l)});s.addEventListener("keydown",r,l),s.addEventListener("blur",()=>s.removeEventListener("keydown",r),l)};function a0(a){return gf(a)&&!ly()}const i0=new WeakSet;function q2(a,l,s={}){const[r,c,d]=sy(a,s),f=m=>{const y=m.currentTarget;if(!a0(m)||i0.has(m))return;lo.add(y),s.stopPropagation&&i0.add(m);const g=l(y,m),x={...c,capture:!0},v=(M,V)=>{window.removeEventListener("pointerup",S,x),window.removeEventListener("pointercancel",j,x),lo.has(y)&&lo.delete(y),a0(M)&&typeof g=="function"&&g(M,{success:V})},S=M=>{v(M,y===window||y===document||s.useGlobalTarget||oy(y,M.target))},j=M=>{v(M,!1)};window.addEventListener("pointerup",S,x),window.addEventListener("pointercancel",j,x)};return r.forEach(m=>{(s.useGlobalTarget?window:m).addEventListener("pointerdown",f,c),io(m)&&(m.addEventListener("focus",g=>Y2(g,c)),!L2(m)&&!m.hasAttribute("tabindex")&&(m.tabIndex=0))}),d}function yf(a){return fg(a)&&"ownerSVGElement"in a}const so=new WeakMap;let Kn;const ry=(a,l,s)=>(r,c)=>c&&c[0]?c[0][a+"Size"]:yf(r)&&"getBBox"in r?r.getBBox()[l]:r[s],X2=ry("inline","width","offsetWidth"),Q2=ry("block","height","offsetHeight");function Z2({target:a,borderBoxSize:l}){var s;(s=so.get(a))==null||s.forEach(r=>{r(a,{get width(){return X2(a,l)},get height(){return Q2(a,l)}})})}function K2(a){a.forEach(Z2)}function J2(){typeof ResizeObserver>"u"||(Kn=new ResizeObserver(K2))}function F2(a,l){Kn||J2();const s=iy(a);return s.forEach(r=>{let c=so.get(r);c||(c=new Set,so.set(r,c)),c.add(l),Kn==null||Kn.observe(r)}),()=>{s.forEach(r=>{const c=so.get(r);c==null||c.delete(l),c!=null&&c.size||Kn==null||Kn.unobserve(r)})}}const oo=new Set;let fi;function W2(){fi=()=>{const a={get width(){return window.innerWidth},get height(){return window.innerHeight}};oo.forEach(l=>l(a))},window.addEventListener("resize",fi)}function P2(a){return oo.add(a),fi||W2(),()=>{oo.delete(a),!oo.size&&typeof fi=="function"&&(window.removeEventListener("resize",fi),fi=void 0)}}function l0(a,l){return typeof a=="function"?P2(a):F2(a,l)}function $2(a){return yf(a)&&a.tagName==="svg"}const I2=[...ey,Jt,Ze],tS=a=>I2.find(ty(a)),s0=()=>({translate:0,scale:1,origin:0,originPoint:0}),di=()=>({x:s0(),y:s0()}),o0=()=>({min:0,max:0}),Wt=()=>({x:o0(),y:o0()}),eS=new WeakMap;function Mo(a){return a!==null&&typeof a=="object"&&typeof a.start=="function"}function El(a){return typeof a=="string"||Array.isArray(a)}const bf=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],xf=["initial",...bf];function wo(a){return Mo(a.animate)||xf.some(l=>El(a[l]))}function uy(a){return!!(wo(a)||a.variants)}function nS(a,l,s){for(const r in l){const c=l[r],d=s[r];if(le(c))a.addValue(r,c);else if(le(d))a.addValue(r,mi(c,{owner:a}));else if(d!==c)if(a.hasValue(r)){const f=a.getValue(r);f.liveStyle===!0?f.jump(c):f.hasAnimated||f.set(c)}else{const f=a.getStaticValue(r);a.addValue(r,mi(f!==void 0?f:c,{owner:a}))}}for(const r in s)l[r]===void 0&&a.removeValue(r);return l}const Uc={current:null},cy={current:!1},aS=typeof window<"u";function iS(){if(cy.current=!0,!!aS)if(window.matchMedia){const a=window.matchMedia("(prefers-reduced-motion)"),l=()=>Uc.current=a.matches;a.addEventListener("change",l),l()}else Uc.current=!1}const r0=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let bo={};function fy(a){bo=a}function lS(){return bo}class sS{scrapeMotionValuesFromProps(l,s,r){return{}}constructor({parent:l,props:s,presenceContext:r,reducedMotionConfig:c,skipAnimations:d,blockInitialAnimation:f,visualState:m},y={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=cf,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const j=ue.now();this.renderScheduledAt<j&&(this.renderScheduledAt=j,Vt.render(this.render,!1,!0))};const{latestValues:g,renderState:x}=m;this.latestValues=g,this.baseTarget={...g},this.initialValues=s.initial?{...g}:{},this.renderState=x,this.parent=l,this.props=s,this.presenceContext=r,this.depth=l?l.depth+1:0,this.reducedMotionConfig=c,this.skipAnimationsConfig=d,this.options=y,this.blockInitialAnimation=!!f,this.isControllingVariants=wo(s),this.isVariantNode=uy(s),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(l&&l.current);const{willChange:v,...S}=this.scrapeMotionValuesFromProps(s,{},this);for(const j in S){const M=S[j];g[j]!==void 0&&le(M)&&M.set(g[j])}}mount(l){var s,r;if(this.hasBeenMounted)for(const c in this.initialValues)(s=this.values.get(c))==null||s.jump(this.initialValues[c]),this.latestValues[c]=this.initialValues[c];this.current=l,eS.set(l,this),this.projection&&!this.projection.instance&&this.projection.mount(l),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((c,d)=>this.bindToMotionValue(d,c)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(cy.current||iS(),this.shouldReduceMotion=Uc.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,(r=this.parent)==null||r.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){var l;this.projection&&this.projection.unmount(),Wn(this.notifyUpdate),Wn(this.render),this.valueSubscriptions.forEach(s=>s()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),(l=this.parent)==null||l.removeChild(this);for(const s in this.events)this.events[s].clear();for(const s in this.features){const r=this.features[s];r&&(r.unmount(),r.isMounted=!1)}this.current=null}addChild(l){this.children.add(l),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(l)}removeChild(l){this.children.delete(l),this.enteringChildren&&this.enteringChildren.delete(l)}bindToMotionValue(l,s){if(this.valueSubscriptions.has(l)&&this.valueSubscriptions.get(l)(),s.accelerate&&Zg.has(l)&&this.current instanceof HTMLElement){const{factory:f,keyframes:m,times:y,ease:g,duration:x}=s.accelerate,v=new Xg({element:this.current,name:l,keyframes:m,times:y,ease:g,duration:Ce(x)}),S=f(v);this.valueSubscriptions.set(l,()=>{S(),v.cancel()});return}const r=yi.has(l);r&&this.onBindTransform&&this.onBindTransform();const c=s.on("change",f=>{this.latestValues[l]=f,this.props.onUpdate&&Vt.preRender(this.notifyUpdate),r&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let d;typeof window<"u"&&window.MotionCheckAppearSync&&(d=window.MotionCheckAppearSync(this,l,s)),this.valueSubscriptions.set(l,()=>{c(),d&&d()})}sortNodePosition(l){return!this.current||!this.sortInstanceNodePosition||this.type!==l.type?0:this.sortInstanceNodePosition(this.current,l.current)}updateFeatures(){let l="animation";for(l in bo){const s=bo[l];if(!s)continue;const{isEnabled:r,Feature:c}=s;if(!this.features[l]&&c&&r(this.props)&&(this.features[l]=new c(this)),this.features[l]){const d=this.features[l];d.isMounted?d.update():(d.mount(),d.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):Wt()}getStaticValue(l){return this.latestValues[l]}setStaticValue(l,s){this.latestValues[l]=s}update(l,s){(l.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=l,this.prevPresenceContext=this.presenceContext,this.presenceContext=s;for(let r=0;r<r0.length;r++){const c=r0[r];this.propEventSubscriptions[c]&&(this.propEventSubscriptions[c](),delete this.propEventSubscriptions[c]);const d="on"+c,f=l[d];f&&(this.propEventSubscriptions[c]=this.on(c,f))}this.prevMotionValues=nS(this,this.scrapeMotionValuesFromProps(l,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(l){return this.props.variants?this.props.variants[l]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(l){const s=this.getClosestVariantNode();if(s)return s.variantChildren&&s.variantChildren.add(l),()=>s.variantChildren.delete(l)}addValue(l,s){const r=this.values.get(l);s!==r&&(r&&this.removeValue(l),this.bindToMotionValue(l,s),this.values.set(l,s),this.latestValues[l]=s.get())}removeValue(l){this.values.delete(l);const s=this.valueSubscriptions.get(l);s&&(s(),this.valueSubscriptions.delete(l)),delete this.latestValues[l],this.removeValueFromRenderState(l,this.renderState)}hasValue(l){return this.values.has(l)}getValue(l,s){if(this.props.values&&this.props.values[l])return this.props.values[l];let r=this.values.get(l);return r===void 0&&s!==void 0&&(r=mi(s===null?void 0:s,{owner:this}),this.addValue(l,r)),r}readValue(l,s){let r=this.latestValues[l]!==void 0||!this.current?this.latestValues[l]:this.getBaseTargetFromProps(this.props,l)??this.readValueFromInstance(this.current,l,this.options);return r!=null&&(typeof r=="string"&&(cg(r)||dg(r))?r=parseFloat(r):!tS(r)&&Ze.test(s)&&(r=ay(l,s)),this.setBaseTarget(l,le(r)?r.get():r)),le(r)?r.get():r}setBaseTarget(l,s){this.baseTarget[l]=s}getBaseTarget(l){var d;const{initial:s}=this.props;let r;if(typeof s=="string"||typeof s=="object"){const f=hf(this.props,s,(d=this.presenceContext)==null?void 0:d.custom);f&&(r=f[l])}if(s&&r!==void 0)return r;const c=this.getBaseTargetFromProps(this.props,l);return c!==void 0&&!le(c)?c:this.initialValues[l]!==void 0&&r===void 0?void 0:this.baseTarget[l]}on(l,s){return this.events[l]||(this.events[l]=new tf),this.events[l].add(s)}notify(l,...s){this.events[l]&&this.events[l].notify(...s)}scheduleRenderMicrotask(){pf.render(this.render)}}class dy extends sS{constructor(){super(...arguments),this.KeyframeResolver=V2}sortInstanceNodePosition(l,s){return l.compareDocumentPosition(s)&2?1:-1}getBaseTargetFromProps(l,s){const r=l.style;return r?r[s]:void 0}removeValueFromRenderState(l,{vars:s,style:r}){delete s[l],delete r[l]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:l}=this.props;le(l)&&(this.childSubscription=l.on("change",s=>{this.current&&(this.current.textContent=`${s}`)}))}}class $n{constructor(l){this.isMounted=!1,this.node=l}update(){}}function hy({top:a,left:l,right:s,bottom:r}){return{x:{min:l,max:s},y:{min:a,max:r}}}function oS({x:a,y:l}){return{top:l.min,right:a.max,bottom:l.max,left:a.min}}function rS(a,l){if(!l)return a;const s=l({x:a.left,y:a.top}),r=l({x:a.right,y:a.bottom});return{top:s.y,left:s.x,bottom:r.y,right:r.x}}function sc(a){return a===void 0||a===1}function Lc({scale:a,scaleX:l,scaleY:s}){return!sc(a)||!sc(l)||!sc(s)}function xa(a){return Lc(a)||my(a)||a.z||a.rotate||a.rotateX||a.rotateY||a.skewX||a.skewY}function my(a){return u0(a.x)||u0(a.y)}function u0(a){return a&&a!=="0%"}function xo(a,l,s){const r=a-s,c=l*r;return s+c}function c0(a,l,s,r,c){return c!==void 0&&(a=xo(a,c,r)),xo(a,s,r)+l}function Hc(a,l=0,s=1,r,c){a.min=c0(a.min,l,s,r,c),a.max=c0(a.max,l,s,r,c)}function py(a,{x:l,y:s}){Hc(a.x,l.translate,l.scale,l.originPoint),Hc(a.y,s.translate,s.scale,s.originPoint)}const f0=.999999999999,d0=1.0000000000001;function uS(a,l,s,r=!1){var m;const c=s.length;if(!c)return;l.x=l.y=1;let d,f;for(let y=0;y<c;y++){d=s[y],f=d.projectionDelta;const{visualElement:g}=d.options;g&&g.props.style&&g.props.style.display==="contents"||(r&&d.options.layoutScroll&&d.scroll&&d!==d.root&&(Ie(a.x,-d.scroll.offset.x),Ie(a.y,-d.scroll.offset.y)),f&&(l.x*=f.x.scale,l.y*=f.y.scale,py(a,f)),r&&xa(d.latestValues)&&ro(a,d.latestValues,(m=d.layout)==null?void 0:m.layoutBox))}l.x<d0&&l.x>f0&&(l.x=1),l.y<d0&&l.y>f0&&(l.y=1)}function Ie(a,l){a.min+=l,a.max+=l}function h0(a,l,s,r,c=.5){const d=Ot(a.min,a.max,c);Hc(a,l,s,d,r)}function m0(a,l){return typeof a=="string"?parseFloat(a)/100*(l.max-l.min):a}function ro(a,l,s){const r=s??a;h0(a.x,m0(l.x,r.x),l.scaleX,l.scale,l.originX),h0(a.y,m0(l.y,r.y),l.scaleY,l.scale,l.originY)}function gy(a,l){return hy(rS(a.getBoundingClientRect(),l))}function cS(a,l,s){const r=gy(a,s),{scroll:c}=l;return c&&(Ie(r.x,c.offset.x),Ie(r.y,c.offset.y)),r}const fS={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},dS=gi.length;function hS(a,l,s){let r="",c=!0;for(let f=0;f<dS;f++){const m=gi[f],y=a[m];if(y===void 0)continue;let g=!0;if(typeof y=="number")g=y===(m.startsWith("scale")?1:0);else{const x=parseFloat(y);g=m.startsWith("scale")?x===1:x===0}if(!g||s){const x=_c(y,yo[m]);if(!g){c=!1;const v=fS[m]||m;r+=`${v}(${x}) `}s&&(l[m]=x)}}const d=a.pathRotation;return d&&(c=!1,r+=`rotate(${_c(d,yo.pathRotation)}) `),r=r.trim(),s?r=s(l,c?"":r):c&&(r="none"),r}function vf(a,l,s){const{style:r,vars:c,transformOrigin:d}=a;let f=!1,m=!1;for(const y in l){const g=l[y];if(yi.has(y)){f=!0;continue}else if(wg(y)){c[y]=g;continue}else{const x=_c(g,yo[y]);y.startsWith("origin")?(m=!0,d[y]=x):r[y]=x}}if(l.transform||(f||s?r.transform=hS(l,a.transform,s):r.transform&&(r.transform="none")),m){const{originX:y="50%",originY:g="50%",originZ:x=0}=d;r.transformOrigin=`${y} ${g} ${x}`}}function yy(a,{style:l,vars:s},r,c){const d=a.style;let f;for(f in l)d[f]=l[f];c==null||c.applyProjectionStyles(d,r);for(f in s)d.setProperty(f,s[f])}function p0(a,l){return l.max===l.min?0:a/(l.max-l.min)*100}const hl={correct:(a,l)=>{if(!l.target)return a;if(typeof a=="string")if($.test(a))a=parseFloat(a);else return a;const s=p0(a,l.target.x),r=p0(a,l.target.y);return`${s}% ${r}%`}},mS={correct:(a,{treeScale:l,projectionDelta:s})=>{const r=a,c=Ze.parse(a);if(c.length>5)return r;const d=Ze.createTransformer(a),f=typeof c[0]!="number"?1:0,m=s.x.scale*l.x,y=s.y.scale*l.y;c[0+f]/=m,c[1+f]/=y;const g=Ot(m,y,.5);return typeof c[2+f]=="number"&&(c[2+f]/=g),typeof c[3+f]=="number"&&(c[3+f]/=g),d(c)}},Gc={borderRadius:{...hl,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:hl,borderTopRightRadius:hl,borderBottomLeftRadius:hl,borderBottomRightRadius:hl,boxShadow:mS};function by(a,{layout:l,layoutId:s}){return yi.has(a)||a.startsWith("origin")||(l||s!==void 0)&&(!!Gc[a]||a==="opacity")}function Sf(a,l,s){var f;const r=a.style,c=l==null?void 0:l.style,d={};if(!r)return d;for(const m in r)(le(r[m])||c&&le(c[m])||by(m,a)||((f=s==null?void 0:s.getValue(m))==null?void 0:f.liveStyle)!==void 0)&&(d[m]=r[m]);return d}function pS(a){return window.getComputedStyle(a)}class gS extends dy{constructor(){super(...arguments),this.type="html",this.renderInstance=yy}readValueFromInstance(l,s){var r;if(yi.has(s))return(r=this.projection)!=null&&r.isProjecting?Mc(s):B1(l,s);{const c=pS(l),d=(wg(s)?c.getPropertyValue(s):c[s])||0;return typeof d=="string"?d.trim():d}}measureInstanceViewportBox(l,{transformPagePoint:s}){return gy(l,s)}build(l,s,r){vf(l,s,r.transformTemplate)}scrapeMotionValuesFromProps(l,s,r){return Sf(l,s,r)}}const yS={offset:"stroke-dashoffset",array:"stroke-dasharray"},bS={offset:"strokeDashoffset",array:"strokeDasharray"};function xS(a,l,s=1,r=0,c=!0){a.pathLength=1;const d=c?yS:bS;a[d.offset]=`${-r}`,a[d.array]=`${l} ${s}`}const vS=["offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function xy(a,{attrX:l,attrY:s,attrScale:r,pathLength:c,pathSpacing:d=1,pathOffset:f=0,...m},y,g,x){if(vf(a,m,g),y){a.style.viewBox&&(a.attrs.viewBox=a.style.viewBox);return}a.attrs=a.style,a.style={};const{attrs:v,style:S}=a;v.transform&&(S.transform=v.transform,delete v.transform),(S.transform||v.transformOrigin)&&(S.transformOrigin=v.transformOrigin??"50% 50%",delete v.transformOrigin),S.transform&&(S.transformBox=(x==null?void 0:x.transformBox)??"fill-box",delete v.transformBox);for(const j of vS)v[j]!==void 0&&(S[j]=v[j],delete v[j]);l!==void 0&&(v.x=l),s!==void 0&&(v.y=s),r!==void 0&&(v.scale=r),c!==void 0&&xS(v,c,d,f,!1)}const vy=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),Sy=a=>typeof a=="string"&&a.toLowerCase()==="svg";function SS(a,l,s,r){yy(a,l,void 0,r);for(const c in l.attrs)a.setAttribute(vy.has(c)?c:mf(c),l.attrs[c])}function Ty(a,l,s){const r=Sf(a,l,s);for(const c in a)if(le(a[c])||le(l[c])){const d=gi.indexOf(c)!==-1?"attr"+c.charAt(0).toUpperCase()+c.substring(1):c;r[d]=a[c]}return r}class TS extends dy{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=Wt}getBaseTargetFromProps(l,s){return l[s]}readValueFromInstance(l,s){if(yi.has(s)){const r=ny(s);return r&&r.default||0}return s=vy.has(s)?s:mf(s),l.getAttribute(s)}scrapeMotionValuesFromProps(l,s,r){return Ty(l,s,r)}build(l,s,r){xy(l,s,this.isSVGTag,r.transformTemplate,r.style)}renderInstance(l,s,r,c){SS(l,s,r,c)}mount(l){this.isSVGTag=Sy(l.tagName),super.mount(l)}}const jS=xf.length;function jy(a){if(!a)return;if(!a.isControllingVariants){const s=a.parent?jy(a.parent)||{}:{};return a.props.initial!==void 0&&(s.initial=a.props.initial),s}const l={};for(let s=0;s<jS;s++){const r=xf[s],c=a.props[r];(El(c)||c===!1)&&(l[r]=c)}return l}function Ay(a,l){if(!Array.isArray(l))return!1;const s=l.length;if(s!==a.length)return!1;for(let r=0;r<s;r++)if(l[r]!==a[r])return!1;return!0}const AS=[...bf].reverse(),ES=bf.length;function MS(a){return l=>Promise.all(l.map(({animation:s,options:r})=>j2(a,s,r)))}function wS(a){let l=MS(a),s=g0(),r=!0,c=!1;const d=g=>(x,v)=>{var j;const S=Aa(a,v,g==="exit"?(j=a.presenceContext)==null?void 0:j.custom:void 0);if(S){const{transition:M,transitionEnd:V,...N}=S;x={...x,...N,...V}}return x};function f(g){l=g(a)}function m(g){const{props:x}=a,v=jy(a.parent)||{},S=[],j=new Set;let M={},V=1/0;for(let _=0;_<ES;_++){const X=AS[_],B=s[X],Y=x[X]!==void 0?x[X]:v[X],J=El(Y),it=X===g?B.isActive:null;it===!1&&(V=_);let q=Y===v[X]&&Y!==x[X]&&J;if(q&&(r||c)&&a.manuallyAnimateOnMount&&(q=!1),B.protectedKeys={...M},!B.isActive&&it===null||!Y&&!B.prevProp||Mo(Y)||typeof Y=="boolean")continue;if(X==="exit"&&B.isActive&&it!==!0){B.prevResolvedValues&&(M={...M,...B.prevResolvedValues});continue}const Z=CS(B.prevProp,Y);let nt=Z||X===g&&B.isActive&&!q&&J||_>V&&J,I=!1;const et=Array.isArray(Y)?Y:[Y];let ft=et.reduce(d(X),{});it===!1&&(ft={});const{prevResolvedValues:st={}}=B,mt={...st,...ft},vt=F=>{nt=!0,j.has(F)&&(I=!0,j.delete(F)),B.needsAnimating[F]=!0;const ot=a.getValue(F);ot&&(ot.liveStyle=!1)};for(const F in mt){const ot=ft[F],ht=st[F];if(M.hasOwnProperty(F))continue;let A=!1;Rc(ot)&&Rc(ht)?A=!Ay(ot,ht)||Z:A=ot!==ht,A?ot!=null?vt(F):j.add(F):ot!==void 0&&j.has(F)?vt(F):B.protectedKeys[F]=!0}B.prevProp=Y,B.prevResolvedValues=ft,B.isActive&&(M={...M,...ft}),(r||c)&&a.blockInitialAnimation&&(nt=!1);const O=q&&Z;nt&&(!O||I)&&S.push(...et.map(F=>{const ot={type:X};if(typeof F=="string"&&(r||c)&&!O&&a.manuallyAnimateOnMount&&a.parent){const{parent:ht}=a,A=Aa(ht,F);if(ht.enteringChildren&&A){const{delayChildren:H}=A.transition||{};ot.delay=Kg(ht.enteringChildren,a,H)}}return{animation:F,options:ot}}))}if(j.size){const _={};if(typeof x.initial!="boolean"){const X=Aa(a,Array.isArray(x.initial)?x.initial[0]:x.initial);X&&X.transition&&(_.transition=X.transition)}j.forEach(X=>{const B=a.getBaseTarget(X),Y=a.getValue(X);Y&&(Y.liveStyle=!0),_[X]=B??null}),S.push({animation:_})}let N=!!S.length;return r&&(x.initial===!1||x.initial===x.animate)&&!a.manuallyAnimateOnMount&&(N=!1),r=!1,c=!1,N?l(S):Promise.resolve()}function y(g,x){var S;if(s[g].isActive===x)return Promise.resolve();(S=a.variantChildren)==null||S.forEach(j=>{var M;return(M=j.animationState)==null?void 0:M.setActive(g,x)}),s[g].isActive=x;const v=m(g);for(const j in s)s[j].protectedKeys={};return v}return{animateChanges:m,setActive:y,setAnimateFunction:f,getState:()=>s,reset:()=>{s=g0(),c=!0}}}function CS(a,l){return typeof l=="string"?l!==a:Array.isArray(l)?!Ay(l,a):!1}function ba(a=!1){return{isActive:a,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function g0(){return{animate:ba(!0),whileInView:ba(),whileHover:ba(),whileTap:ba(),whileDrag:ba(),whileFocus:ba(),exit:ba()}}function Yc(a,l){a.min=l.min,a.max=l.max}function Xe(a,l){Yc(a.x,l.x),Yc(a.y,l.y)}function y0(a,l){a.translate=l.translate,a.scale=l.scale,a.originPoint=l.originPoint,a.origin=l.origin}const Ey=1e-4,NS=1-Ey,DS=1+Ey,My=.01,zS=0-My,RS=0+My;function ce(a){return a.max-a.min}function OS(a,l,s){return Math.abs(a-l)<=s}function b0(a,l,s,r=.5){a.origin=r,a.originPoint=Ot(l.min,l.max,a.origin),a.scale=ce(s)/ce(l),a.translate=Ot(s.min,s.max,a.origin)-a.originPoint,(a.scale>=NS&&a.scale<=DS||isNaN(a.scale))&&(a.scale=1),(a.translate>=zS&&a.translate<=RS||isNaN(a.translate))&&(a.translate=0)}function Sl(a,l,s,r){b0(a.x,l.x,s.x,r?r.originX:void 0),b0(a.y,l.y,s.y,r?r.originY:void 0)}function x0(a,l,s,r=0){const c=r?Ot(s.min,s.max,r):s.min;a.min=c+l.min,a.max=a.min+ce(l)}function VS(a,l,s,r){x0(a.x,l.x,s.x,r==null?void 0:r.x),x0(a.y,l.y,s.y,r==null?void 0:r.y)}function v0(a,l,s,r=0){const c=r?Ot(s.min,s.max,r):s.min;a.min=l.min-c,a.max=a.min+ce(l)}function vo(a,l,s,r){v0(a.x,l.x,s.x,r==null?void 0:r.x),v0(a.y,l.y,s.y,r==null?void 0:r.y)}function S0(a,l,s,r,c){return a-=l,a=xo(a,1/s,r),c!==void 0&&(a=xo(a,1/c,r)),a}function kS(a,l=0,s=1,r=.5,c,d=a,f=a){if(tn.test(l)&&(l=parseFloat(l),l=Ot(f.min,f.max,l/100)-f.min),typeof l!="number")return;let m=Ot(d.min,d.max,r);a===d&&(m-=l),a.min=S0(a.min,l,s,m,c),a.max=S0(a.max,l,s,m,c)}function T0(a,l,[s,r,c],d,f){kS(a,l[s],l[r],l[c],l.scale,d,f)}const BS=["x","scaleX","originX"],_S=["y","scaleY","originY"];function j0(a,l,s,r){T0(a.x,l,BS,s?s.x:void 0,r?r.x:void 0),T0(a.y,l,_S,s?s.y:void 0,r?r.y:void 0)}function A0(a){return a.translate===0&&a.scale===1}function wy(a){return A0(a.x)&&A0(a.y)}function E0(a,l){return a.min===l.min&&a.max===l.max}function US(a,l){return E0(a.x,l.x)&&E0(a.y,l.y)}function M0(a,l){return Math.round(a.min)===Math.round(l.min)&&Math.round(a.max)===Math.round(l.max)}function Cy(a,l){return M0(a.x,l.x)&&M0(a.y,l.y)}function w0(a){return ce(a.x)/ce(a.y)}function C0(a,l){return a.translate===l.translate&&a.scale===l.scale&&a.originPoint===l.originPoint}function $e(a){return[a("x"),a("y")]}function LS(a,l,s){let r="";const c=a.x.translate/l.x,d=a.y.translate/l.y,f=(s==null?void 0:s.z)||0;if((c||d||f)&&(r=`translate3d(${c}px, ${d}px, ${f}px) `),(l.x!==1||l.y!==1)&&(r+=`scale(${1/l.x}, ${1/l.y}) `),s){const{transformPerspective:g,rotate:x,pathRotation:v,rotateX:S,rotateY:j,skewX:M,skewY:V}=s;g&&(r=`perspective(${g}px) ${r}`),x&&(r+=`rotate(${x}deg) `),v&&(r+=`rotate(${v}deg) `),S&&(r+=`rotateX(${S}deg) `),j&&(r+=`rotateY(${j}deg) `),M&&(r+=`skewX(${M}deg) `),V&&(r+=`skewY(${V}deg) `)}const m=a.x.scale*l.x,y=a.y.scale*l.y;return(m!==1||y!==1)&&(r+=`scale(${m}, ${y})`),r||"none"}const Ny=["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"],HS=Ny.length,N0=a=>typeof a=="string"?parseFloat(a):a,D0=a=>typeof a=="number"||$.test(a);function GS(a,l,s,r,c,d){c?(a.opacity=Ot(0,s.opacity??1,YS(r)),a.opacityExit=Ot(l.opacity??1,0,qS(r))):d&&(a.opacity=Ot(l.opacity??1,s.opacity??1,r));for(let f=0;f<HS;f++){const m=Ny[f];let y=z0(l,m),g=z0(s,m);if(y===void 0&&g===void 0)continue;y||(y=0),g||(g=0),y===0||g===0||D0(y)===D0(g)?(a[m]=Math.max(Ot(N0(y),N0(g),r),0),(tn.test(g)||tn.test(y))&&(a[m]+="%")):a[m]=g}(l.rotate||s.rotate)&&(a.rotate=Ot(l.rotate||0,s.rotate||0,r))}function z0(a,l){return a[l]!==void 0?a[l]:a.borderRadius}const YS=Dy(0,.5,Sg),qS=Dy(.5,.95,He);function Dy(a,l,s){return r=>r<a?0:r>l?1:s(jl(a,l,r))}function XS(a,l,s){const r=le(a)?a:mi(a);return r.start(df("",r,l,s)),r.animation}function Ml(a,l,s,r={passive:!0}){return a.addEventListener(l,s,r),()=>a.removeEventListener(l,s,r)}const QS=(a,l)=>a.depth-l.depth;class ZS{constructor(){this.children=[],this.isDirty=!1}add(l){$c(this.children,l),this.isDirty=!0}remove(l){fo(this.children,l),this.isDirty=!0}forEach(l){this.isDirty&&this.children.sort(QS),this.isDirty=!1,this.children.forEach(l)}}function KS(a,l){const s=ue.now(),r=({timestamp:c})=>{const d=c-s;d>=l&&(Wn(r),a(d-l))};return Vt.setup(r,!0),()=>Wn(r)}function uo(a){return le(a)?a.get():a}class JS{constructor(){this.members=[]}add(l){$c(this.members,l);for(let s=this.members.length-1;s>=0;s--){const r=this.members[s];if(r===l||r===this.lead||r===this.prevLead)continue;const c=r.instance;(!c||c.isConnected===!1)&&!r.snapshot&&(fo(this.members,r),r.unmount())}l.scheduleRender()}remove(l){if(fo(this.members,l),l===this.prevLead&&(this.prevLead=void 0),l===this.lead){const s=this.members[this.members.length-1];s&&this.promote(s)}}relegate(l){var s;for(let r=this.members.indexOf(l)-1;r>=0;r--){const c=this.members[r];if(c.isPresent!==!1&&((s=c.instance)==null?void 0:s.isConnected)!==!1)return this.promote(c),!0}return!1}promote(l,s){var c;const r=this.lead;if(l!==r&&(this.prevLead=r,this.lead=l,l.show(),r)){r.updateSnapshot(),l.scheduleRender();const{layoutDependency:d}=r.options,{layoutDependency:f}=l.options;(d===void 0||d!==f)&&(l.resumeFrom=r,s&&(r.preserveOpacity=!0),r.snapshot&&(l.snapshot=r.snapshot,l.snapshot.latestValues=r.animationValues||r.latestValues),(c=l.root)!=null&&c.isUpdating&&(l.isLayoutDirty=!0)),l.options.crossfade===!1&&r.hide()}}exitAnimationComplete(){this.members.forEach(l=>{var s,r,c,d,f;(r=(s=l.options).onExitComplete)==null||r.call(s),(f=(c=l.resumingFrom)==null?void 0:(d=c.options).onExitComplete)==null||f.call(d)})}scheduleRender(){this.members.forEach(l=>l.instance&&l.scheduleRender(!1))}removeLeadSnapshot(){var l;(l=this.lead)!=null&&l.snapshot&&(this.lead.snapshot=void 0)}}const co={hasAnimatedSinceResize:!0,hasEverUpdated:!1},oc=["","X","Y","Z"],FS=1e3;let WS=0;function rc(a,l,s,r){const{latestValues:c}=l;c[a]&&(s[a]=c[a],l.setStaticValue(a,0),r&&(r[a]=0))}function zy(a){if(a.hasCheckedOptimisedAppear=!0,a.root===a)return;const{visualElement:l}=a.options;if(!l)return;const s=$g(l);if(window.MotionHasOptimisedAnimation(s,"transform")){const{layout:c,layoutId:d}=a.options;window.MotionCancelOptimisedAnimation(s,"transform",Vt,!(c||d))}const{parent:r}=a;r&&!r.hasCheckedOptimisedAppear&&zy(r)}function Ry({attachResizeListener:a,defaultParent:l,measureScroll:s,checkIsScrollRoot:r,resetTransform:c}){return class{constructor(f={},m=l==null?void 0:l()){this.id=WS++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(IS),this.nodes.forEach(l5),this.nodes.forEach(s5),this.nodes.forEach(t5)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=f,this.root=m?m.root||m:this,this.path=m?[...m.path,m]:[],this.parent=m,this.depth=m?m.depth+1:0;for(let y=0;y<this.path.length;y++)this.path[y].shouldResetTransform=!0;this.root===this&&(this.nodes=new ZS)}addEventListener(f,m){return this.eventHandlers.has(f)||this.eventHandlers.set(f,new tf),this.eventHandlers.get(f).add(m)}notifyListeners(f,...m){const y=this.eventHandlers.get(f);y&&y.notify(...m)}hasListeners(f){return this.eventHandlers.has(f)}mount(f){if(this.instance)return;this.isSVG=yf(f)&&!$2(f),this.instance=f;const{layoutId:m,layout:y,visualElement:g}=this.options;if(g&&!g.current&&g.mount(f),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(y||m)&&(this.isLayoutDirty=!0),a){let x,v=0;const S=()=>this.root.updateBlockedByResize=!1;Vt.read(()=>{v=window.innerWidth}),a(f,()=>{const j=window.innerWidth;j!==v&&(v=j,this.root.updateBlockedByResize=!0,x&&x(),x=KS(S,250),co.hasAnimatedSinceResize&&(co.hasAnimatedSinceResize=!1,this.nodes.forEach(V0)))})}m&&this.root.registerSharedNode(m,this),this.options.animate!==!1&&g&&(m||y)&&this.addEventListener("didUpdate",({delta:x,hasLayoutChanged:v,hasRelativeLayoutChanged:S,layout:j})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const M=this.options.transition||g.getDefaultTransition()||f5,{onLayoutAnimationStart:V,onLayoutAnimationComplete:N}=g.getProps(),_=!this.targetLayout||!Cy(this.targetLayout,j),X=!v&&S;if(this.options.layoutRoot||this.resumeFrom||X||v&&(_||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const B={...ff(M,"layout"),onPlay:V,onComplete:N};(g.shouldReduceMotion||this.options.layoutRoot)&&(B.delay=0,B.type=!1),this.startAnimation(B),this.setAnimationOrigin(x,X,B.path)}else v||V0(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=j})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const f=this.getStack();f&&f.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),Wn(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(o5),this.animationId++)}getTransformTemplate(){const{visualElement:f}=this.options;return f&&f.getProps().transformTemplate}willUpdate(f=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&zy(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let x=0;x<this.path.length;x++){const v=this.path[x];v.shouldResetTransform=!0,(typeof v.latestValues.x=="string"||typeof v.latestValues.y=="string")&&(v.isLayoutDirty=!0),v.updateScroll("snapshot"),v.options.layoutRoot&&v.willUpdate(!1)}const{layoutId:m,layout:y}=this.options;if(m===void 0&&!y)return;const g=this.getTransformTemplate();this.prevTransformTemplateValue=g?g(this.latestValues,""):void 0,this.updateSnapshot(),f&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const y=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),y&&this.nodes.forEach(n5),this.nodes.forEach(R0);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(O0);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(a5),this.nodes.forEach(i5),this.nodes.forEach(PS),this.nodes.forEach($S)):this.nodes.forEach(O0),this.clearAllSnapshots();const m=ue.now();ie.delta=en(0,1e3/60,m-ie.timestamp),ie.timestamp=m,ie.isProcessing=!0,Iu.update.process(ie),Iu.preRender.process(ie),Iu.render.process(ie),ie.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,pf.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(e5),this.sharedNodes.forEach(r5)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,Vt.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){Vt.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!ce(this.snapshot.measuredBox.x)&&!ce(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let y=0;y<this.path.length;y++)this.path[y].updateScroll();const f=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=Wt()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:m}=this.options;m&&m.notify("LayoutMeasure",this.layout.layoutBox,f?f.layoutBox:void 0)}updateScroll(f="measure"){let m=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===f&&(m=!1),m&&this.instance){const y=r(this.instance);this.scroll={animationId:this.root.animationId,phase:f,isRoot:y,offset:s(this.instance),wasRoot:this.scroll?this.scroll.isRoot:y}}}resetTransform(){if(!c)return;const f=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,m=this.projectionDelta&&!wy(this.projectionDelta),y=this.getTransformTemplate(),g=y?y(this.latestValues,""):void 0,x=g!==this.prevTransformTemplateValue;f&&this.instance&&(m||xa(this.latestValues)||x)&&(c(this.instance,g),this.shouldResetTransform=!1,this.scheduleRender())}measure(f=!0){const m=this.measurePageBox();let y=this.removeElementScroll(m);return f&&(y=this.removeTransform(y)),d5(y),{animationId:this.root.animationId,measuredBox:m,layoutBox:y,latestValues:{},source:this.id}}measurePageBox(){var g;const{visualElement:f}=this.options;if(!f)return Wt();const m=f.measureViewportBox();if(!(((g=this.scroll)==null?void 0:g.wasRoot)||this.path.some(h5))){const{scroll:x}=this.root;x&&(Ie(m.x,x.offset.x),Ie(m.y,x.offset.y))}return m}removeElementScroll(f){var y;const m=Wt();if(Xe(m,f),(y=this.scroll)!=null&&y.wasRoot)return m;for(let g=0;g<this.path.length;g++){const x=this.path[g],{scroll:v,options:S}=x;x!==this.root&&v&&S.layoutScroll&&(v.wasRoot&&Xe(m,f),Ie(m.x,v.offset.x),Ie(m.y,v.offset.y))}return m}applyTransform(f,m=!1,y){var x,v;const g=y||Wt();Xe(g,f);for(let S=0;S<this.path.length;S++){const j=this.path[S];!m&&j.options.layoutScroll&&j.scroll&&j!==j.root&&(Ie(g.x,-j.scroll.offset.x),Ie(g.y,-j.scroll.offset.y)),xa(j.latestValues)&&ro(g,j.latestValues,(x=j.layout)==null?void 0:x.layoutBox)}return xa(this.latestValues)&&ro(g,this.latestValues,(v=this.layout)==null?void 0:v.layoutBox),g}removeTransform(f){var y;const m=Wt();Xe(m,f);for(let g=0;g<this.path.length;g++){const x=this.path[g];if(!xa(x.latestValues))continue;let v;x.instance&&(Lc(x.latestValues)&&x.updateSnapshot(),v=Wt(),Xe(v,x.measurePageBox())),j0(m,x.latestValues,(y=x.snapshot)==null?void 0:y.layoutBox,v)}return xa(this.latestValues)&&j0(m,this.latestValues),m}setTargetDelta(f){this.targetDelta=f,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(f){this.options={...this.options,...f,crossfade:f.crossfade!==void 0?f.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==ie.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(f=!1){var j;const m=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=m.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=m.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=m.isSharedProjectionDirty);const y=!!this.resumingFrom||this!==m;if(!(f||y&&this.isSharedProjectionDirty||this.isProjectionDirty||(j=this.parent)!=null&&j.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:x,layoutId:v}=this.options;if(!this.layout||!(x||v))return;this.resolvedRelativeTargetAt=ie.timestamp;const S=this.getClosestProjectingParent();S&&this.linkedParentVersion!==S.layoutVersion&&!S.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&S&&S.layout?this.createRelativeTarget(S,this.layout.layoutBox,S.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=Wt(),this.targetWithTransforms=Wt()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),VS(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):Xe(this.target,this.layout.layoutBox),py(this.target,this.targetDelta)):Xe(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&S&&!!S.resumingFrom==!!this.resumingFrom&&!S.options.layoutScroll&&S.target&&this.animationProgress!==1?this.createRelativeTarget(S,this.target,S.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||Lc(this.parent.latestValues)||my(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(f,m,y){this.relativeParent=f,this.linkedParentVersion=f.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=Wt(),this.relativeTargetOrigin=Wt(),vo(this.relativeTargetOrigin,m,y,this.options.layoutAnchor||void 0),Xe(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){var M;const f=this.getLead(),m=!!this.resumingFrom||this!==f;let y=!0;if((this.isProjectionDirty||(M=this.parent)!=null&&M.isProjectionDirty)&&(y=!1),m&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(y=!1),this.resolvedRelativeTargetAt===ie.timestamp&&(y=!1),y)return;const{layout:g,layoutId:x}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(g||x))return;Xe(this.layoutCorrected,this.layout.layoutBox);const v=this.treeScale.x,S=this.treeScale.y;uS(this.layoutCorrected,this.treeScale,this.path,m),f.layout&&!f.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(f.target=f.layout.layoutBox,f.targetWithTransforms=Wt());const{target:j}=f;if(!j){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(y0(this.prevProjectionDelta.x,this.projectionDelta.x),y0(this.prevProjectionDelta.y,this.projectionDelta.y)),Sl(this.projectionDelta,this.layoutCorrected,j,this.latestValues),(this.treeScale.x!==v||this.treeScale.y!==S||!C0(this.projectionDelta.x,this.prevProjectionDelta.x)||!C0(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",j))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(f=!0){var m;if((m=this.options.visualElement)==null||m.scheduleRender(),f){const y=this.getStack();y&&y.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=di(),this.projectionDelta=di(),this.projectionDeltaWithTransform=di()}setAnimationOrigin(f,m=!1,y){const g=this.snapshot,x=g?g.latestValues:{},v={...this.latestValues},S=di();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!m;const j=Wt(),M=g?g.source:void 0,V=this.layout?this.layout.source:void 0,N=M!==V,_=this.getStack(),X=!_||_.members.length<=1,B=!!(N&&!X&&this.options.crossfade===!0&&!this.path.some(c5));this.animationProgress=0;let Y;const J=y==null?void 0:y.interpolateProjection(f);this.mixTargetDelta=it=>{const q=it/1e3,Z=J==null?void 0:J(q);Z?(S.x.translate=Z.x,S.x.scale=Ot(f.x.scale,1,q),S.x.origin=f.x.origin,S.x.originPoint=f.x.originPoint,S.y.translate=Z.y,S.y.scale=Ot(f.y.scale,1,q),S.y.origin=f.y.origin,S.y.originPoint=f.y.originPoint):(k0(S.x,f.x,q),k0(S.y,f.y,q)),this.setTargetDelta(S),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(vo(j,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),u5(this.relativeTarget,this.relativeTargetOrigin,j,q),Y&&US(this.relativeTarget,Y)&&(this.isProjectionDirty=!1),Y||(Y=Wt()),Xe(Y,this.relativeTarget)),N&&(this.animationValues=v,GS(v,x,this.latestValues,q,B,X)),Z&&Z.rotate!==void 0&&(this.animationValues||(this.animationValues=v),this.animationValues.pathRotation=Z.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=q},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(f){var m,y,g;this.notifyListeners("animationStart"),(m=this.currentAnimation)==null||m.stop(),(g=(y=this.resumingFrom)==null?void 0:y.currentAnimation)==null||g.stop(),this.pendingAnimation&&(Wn(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=Vt.update(()=>{co.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=mi(0)),this.motionValue.jump(0,!1),this.currentAnimation=XS(this.motionValue,[0,1e3],{...f,velocity:0,isSync:!0,onUpdate:x=>{this.mixTargetDelta(x),f.onUpdate&&f.onUpdate(x)},onComplete:()=>{f.onComplete&&f.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const f=this.getStack();f&&f.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(FS),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const f=this.getLead();let{targetWithTransforms:m,target:y,layout:g,latestValues:x}=f;if(!(!m||!y||!g)){if(this!==f&&this.layout&&g&&Oy(this.options.animationType,this.layout.layoutBox,g.layoutBox)){y=this.target||Wt();const v=ce(this.layout.layoutBox.x);y.x.min=f.target.x.min,y.x.max=y.x.min+v;const S=ce(this.layout.layoutBox.y);y.y.min=f.target.y.min,y.y.max=y.y.min+S}Xe(m,y),ro(m,x),Sl(this.projectionDeltaWithTransform,this.layoutCorrected,m,x)}}registerSharedNode(f,m){this.sharedNodes.has(f)||this.sharedNodes.set(f,new JS),this.sharedNodes.get(f).add(m);const g=m.options.initialPromotionConfig;m.promote({transition:g?g.transition:void 0,preserveFollowOpacity:g&&g.shouldPreserveFollowOpacity?g.shouldPreserveFollowOpacity(m):void 0})}isLead(){const f=this.getStack();return f?f.lead===this:!0}getLead(){var m;const{layoutId:f}=this.options;return f?((m=this.getStack())==null?void 0:m.lead)||this:this}getPrevLead(){var m;const{layoutId:f}=this.options;return f?(m=this.getStack())==null?void 0:m.prevLead:void 0}getStack(){const{layoutId:f}=this.options;if(f)return this.root.sharedNodes.get(f)}promote({needsReset:f,transition:m,preserveFollowOpacity:y}={}){const g=this.getStack();g&&g.promote(this,y),f&&(this.projectionDelta=void 0,this.needsReset=!0),m&&this.setOptions({transition:m})}relegate(){const f=this.getStack();return f?f.relegate(this):!1}resetSkewAndRotation(){const{visualElement:f}=this.options;if(!f)return;let m=!1;const{latestValues:y}=f;if((y.z||y.rotate||y.rotateX||y.rotateY||y.rotateZ||y.skewX||y.skewY)&&(m=!0),!m)return;const g={};y.z&&rc("z",f,g,this.animationValues);for(let x=0;x<oc.length;x++)rc(`rotate${oc[x]}`,f,g,this.animationValues),rc(`skew${oc[x]}`,f,g,this.animationValues);f.render();for(const x in g)f.setStaticValue(x,g[x]),this.animationValues&&(this.animationValues[x]=g[x]);f.scheduleRender()}applyProjectionStyles(f,m){if(!this.instance||this.isSVG)return;if(!this.isVisible){f.visibility="hidden";return}const y=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,f.visibility="",f.opacity="",f.pointerEvents=uo(m==null?void 0:m.pointerEvents)||"",f.transform=y?y(this.latestValues,""):"none";return}const g=this.getLead();if(!this.projectionDelta||!this.layout||!g.target){this.options.layoutId&&(f.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,f.pointerEvents=uo(m==null?void 0:m.pointerEvents)||""),this.hasProjected&&!xa(this.latestValues)&&(f.transform=y?y({},""):"none",this.hasProjected=!1);return}f.visibility="";const x=g.animationValues||g.latestValues;this.applyTransformsToTarget();let v=LS(this.projectionDeltaWithTransform,this.treeScale,x);y&&(v=y(x,v)),f.transform=v;const{x:S,y:j}=this.projectionDelta;f.transformOrigin=`${S.origin*100}% ${j.origin*100}% 0`,g.animationValues?f.opacity=g===this?x.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:x.opacityExit:f.opacity=g===this?x.opacity!==void 0?x.opacity:"":x.opacityExit!==void 0?x.opacityExit:0;for(const M in Gc){if(x[M]===void 0)continue;const{correct:V,applyTo:N,isCSSVariable:_}=Gc[M],X=v==="none"?x[M]:V(x[M],g);if(N){const B=N.length;for(let Y=0;Y<B;Y++)f[N[Y]]=X}else _?this.options.visualElement.renderState.vars[M]=X:f[M]=X}this.options.layoutId&&(f.pointerEvents=g===this?uo(m==null?void 0:m.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(f=>{var m;return(m=f.currentAnimation)==null?void 0:m.stop()}),this.root.nodes.forEach(R0),this.root.sharedNodes.clear()}}}function PS(a){a.updateLayout()}function $S(a){var s;const l=((s=a.resumeFrom)==null?void 0:s.snapshot)||a.snapshot;if(a.isLead()&&a.layout&&l&&a.hasListeners("didUpdate")){const{layoutBox:r,measuredBox:c}=a.layout,{animationType:d}=a.options,f=l.source!==a.layout.source;if(d==="size")$e(v=>{const S=f?l.measuredBox[v]:l.layoutBox[v],j=ce(S);S.min=r[v].min,S.max=S.min+j});else if(d==="x"||d==="y"){const v=d==="x"?"y":"x";Yc(f?l.measuredBox[v]:l.layoutBox[v],r[v])}else Oy(d,l.layoutBox,r)&&$e(v=>{const S=f?l.measuredBox[v]:l.layoutBox[v],j=ce(r[v]);S.max=S.min+j,a.relativeTarget&&!a.currentAnimation&&(a.isProjectionDirty=!0,a.relativeTarget[v].max=a.relativeTarget[v].min+j)});const m=di();Sl(m,r,l.layoutBox);const y=di();f?Sl(y,a.applyTransform(c,!0),l.measuredBox):Sl(y,r,l.layoutBox);const g=!wy(m);let x=!1;if(!a.resumeFrom){const v=a.getClosestProjectingParent();if(v&&!v.resumeFrom){const{snapshot:S,layout:j}=v;if(S&&j){const M=a.options.layoutAnchor||void 0,V=Wt();vo(V,l.layoutBox,S.layoutBox,M);const N=Wt();vo(N,r,j.layoutBox,M),Cy(V,N)||(x=!0),v.options.layoutRoot&&(a.relativeTarget=N,a.relativeTargetOrigin=V,a.relativeParent=v)}}}a.notifyListeners("didUpdate",{layout:r,snapshot:l,delta:y,layoutDelta:m,hasLayoutChanged:g,hasRelativeLayoutChanged:x})}else if(a.isLead()){const{onExitComplete:r}=a.options;r&&r()}a.options.transition=void 0}function IS(a){a.parent&&(a.isProjecting()||(a.isProjectionDirty=a.parent.isProjectionDirty),a.isSharedProjectionDirty||(a.isSharedProjectionDirty=!!(a.isProjectionDirty||a.parent.isProjectionDirty||a.parent.isSharedProjectionDirty)),a.isTransformDirty||(a.isTransformDirty=a.parent.isTransformDirty))}function t5(a){a.isProjectionDirty=a.isSharedProjectionDirty=a.isTransformDirty=!1}function e5(a){a.clearSnapshot()}function R0(a){a.clearMeasurements()}function n5(a){a.isLayoutDirty=!0,a.updateLayout()}function O0(a){a.isLayoutDirty=!1}function a5(a){a.isAnimationBlocked&&a.layout&&!a.isLayoutDirty&&(a.snapshot=a.layout,a.isLayoutDirty=!0)}function i5(a){const{visualElement:l}=a.options;l&&l.getProps().onBeforeLayoutMeasure&&l.notify("BeforeLayoutMeasure"),a.resetTransform()}function V0(a){a.finishAnimation(),a.targetDelta=a.relativeTarget=a.target=void 0,a.isProjectionDirty=!0}function l5(a){a.resolveTargetDelta()}function s5(a){a.calcProjection()}function o5(a){a.resetSkewAndRotation()}function r5(a){a.removeLeadSnapshot()}function k0(a,l,s){a.translate=Ot(l.translate,0,s),a.scale=Ot(l.scale,1,s),a.origin=l.origin,a.originPoint=l.originPoint}function B0(a,l,s,r){a.min=Ot(l.min,s.min,r),a.max=Ot(l.max,s.max,r)}function u5(a,l,s,r){B0(a.x,l.x,s.x,r),B0(a.y,l.y,s.y,r)}function c5(a){return a.animationValues&&a.animationValues.opacityExit!==void 0}const f5={duration:.45,ease:[.4,0,.1,1]},_0=a=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(a),U0=_0("applewebkit/")&&!_0("chrome/")?Math.round:He;function L0(a){a.min=U0(a.min),a.max=U0(a.max)}function d5(a){L0(a.x),L0(a.y)}function Oy(a,l,s){return a==="position"||a==="preserve-aspect"&&!OS(w0(l),w0(s),.2)}function h5(a){var l;return a!==a.root&&((l=a.scroll)==null?void 0:l.wasRoot)}const m5=Ry({attachResizeListener:(a,l)=>Ml(a,"resize",l),measureScroll:()=>{var a,l;return{x:document.documentElement.scrollLeft||((a=document.body)==null?void 0:a.scrollLeft)||0,y:document.documentElement.scrollTop||((l=document.body)==null?void 0:l.scrollTop)||0}},checkIsScrollRoot:()=>!0}),uc={current:void 0},Vy=Ry({measureScroll:a=>({x:a.scrollLeft,y:a.scrollTop}),defaultParent:()=>{if(!uc.current){const a=new m5({});a.mount(window),a.setOptions({layoutScroll:!0}),uc.current=a}return uc.current},resetTransform:(a,l)=>{a.style.transform=l!==void 0?l:"none"},checkIsScrollRoot:a=>window.getComputedStyle(a).position==="fixed"}),Tf=C.createContext({transformPagePoint:a=>a,isStatic:!1,reducedMotion:"never"});function H0(a,l){if(typeof a=="function")return a(l);a!=null&&(a.current=l)}function p5(...a){return l=>{let s=!1;const r=a.map(c=>{const d=H0(c,l);return!s&&typeof d=="function"&&(s=!0),d});if(s)return()=>{for(let c=0;c<r.length;c++){const d=r[c];typeof d=="function"?d():H0(a[c],null)}}}}function g5(...a){return C.useCallback(p5(...a),a)}class y5 extends C.Component{getSnapshotBeforeUpdate(l){const s=this.props.childRef.current;if(io(s)&&l.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const r=s.offsetParent,c=io(r)&&r.offsetWidth||0,d=io(r)&&r.offsetHeight||0,f=getComputedStyle(s),m=this.props.sizeRef.current;m.height=parseFloat(f.height),m.width=parseFloat(f.width),m.top=s.offsetTop,m.left=s.offsetLeft,m.right=c-m.width-m.left,m.bottom=d-m.height-m.top,m.direction=f.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function b5({children:a,isPresent:l,anchorX:s,anchorY:r,root:c,pop:d}){var S;const f=C.useId(),m=C.useRef(null),y=C.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:g}=C.useContext(Tf),x=((S=a.props)==null?void 0:S.ref)??(a==null?void 0:a.ref),v=g5(m,x);return C.useInsertionEffect(()=>{const{width:j,height:M,top:V,left:N,right:_,bottom:X,direction:B}=y.current;if(l||d===!1||!m.current||!j||!M)return;const Y=B==="rtl",J=s==="left"?Y?`right: ${_}`:`left: ${N}`:Y?`left: ${N}`:`right: ${_}`,it=r==="bottom"?`bottom: ${X}`:`top: ${V}`;m.current.dataset.motionPopId=f;const q=document.createElement("style");g&&(q.nonce=g);const Z=c??document.head;return Z.appendChild(q),q.sheet&&q.sheet.insertRule(`
          [data-motion-pop-id="${f}"] {
            position: absolute !important;
            width: ${j}px !important;
            height: ${M}px !important;
            ${J}px !important;
            ${it}px !important;
          }
        `),()=>{var nt;(nt=m.current)==null||nt.removeAttribute("data-motion-pop-id"),Z.contains(q)&&Z.removeChild(q)}},[l]),p.jsx(y5,{isPresent:l,childRef:m,sizeRef:y,pop:d,children:d===!1?a:C.cloneElement(a,{ref:v})})}const x5=({children:a,initial:l,isPresent:s,onExitComplete:r,custom:c,presenceAffectsLayout:d,mode:f,anchorX:m,anchorY:y,root:g})=>{const x=Wc(v5),v=C.useId(),S=C.useRef(s),j=C.useRef(r);Pc(()=>{S.current=s,j.current=r});let M=!0,V=C.useMemo(()=>(M=!1,{id:v,initial:l,isPresent:s,custom:c,onExitComplete:N=>{x.set(N,!0);for(const _ of x.values())if(!_)return;r&&r()},register:N=>(x.set(N,!1),()=>{var _;x.delete(N),!S.current&&!x.size&&((_=j.current)==null||_.call(j))})}),[s,x,r]);return d&&M&&(V={...V}),C.useMemo(()=>{x.forEach((N,_)=>x.set(_,!1))},[s]),C.useEffect(()=>{!s&&!x.size&&r&&r()},[s]),a=p.jsx(b5,{pop:f==="popLayout",isPresent:s,anchorX:m,anchorY:y,root:g,children:a}),p.jsx(Ao.Provider,{value:V,children:a})};function v5(){return new Map}function ky(a=!0){const l=C.useContext(Ao);if(l===null)return[!0,null];const{isPresent:s,onExitComplete:r,register:c}=l,d=C.useId();C.useEffect(()=>{if(a)return c(d)},[a]);const f=C.useCallback(()=>a&&r&&r(d),[d,r,a]);return!s&&r?[!1,f]:[!0]}const $s=a=>a.key||"";function G0(a){const l=[];return C.Children.forEach(a,s=>{C.isValidElement(s)&&l.push(s)}),l}const Pn=({children:a,custom:l,initial:s=!0,onExitComplete:r,presenceAffectsLayout:c=!0,mode:d="sync",propagate:f=!1,anchorX:m="left",anchorY:y="top",root:g})=>{const[x,v]=ky(f),S=C.useMemo(()=>G0(a),[a]),j=f&&!x?[]:S.map($s),M=C.useRef(!0),V=C.useRef(S),N=Wc(()=>new Map),_=C.useRef(new Set),[X,B]=C.useState(S),[Y,J]=C.useState(S);Pc(()=>{M.current=!1,V.current=S;for(let Z=0;Z<Y.length;Z++){const nt=$s(Y[Z]);j.includes(nt)?(N.delete(nt),_.current.delete(nt)):N.get(nt)!==!0&&N.set(nt,!1)}},[Y,j.length,j.join("-")]);const it=[];if(S!==X){let Z=[...S];for(let nt=0;nt<Y.length;nt++){const I=Y[nt],et=$s(I);j.includes(et)||(Z.splice(nt,0,I),it.push(I))}return d==="wait"&&it.length&&(Z=it),J(G0(Z)),B(S),null}const{forceRender:q}=C.useContext(Fc);return p.jsx(p.Fragment,{children:Y.map(Z=>{const nt=$s(Z),I=f&&!x?!1:S===Y||j.includes(nt),et=()=>{if(_.current.has(nt))return;if(N.has(nt))_.current.add(nt),N.set(nt,!0);else return;let ft=!0;N.forEach(st=>{st||(ft=!1)}),ft&&(q==null||q(),J(V.current),f&&(v==null||v()),r&&r())};return p.jsx(x5,{isPresent:I,initial:!M.current||s?void 0:!1,custom:l,presenceAffectsLayout:c,mode:d,root:g,onExitComplete:I?void 0:et,anchorX:m,anchorY:y,children:Z},nt)})})},By=C.createContext({strict:!1}),Y0={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let q0=!1;function S5(){if(q0)return;const a={};for(const l in Y0)a[l]={isEnabled:s=>Y0[l].some(r=>!!s[r])};fy(a),q0=!0}function _y(){return S5(),lS()}function T5(a){const l=_y();for(const s in a)l[s]={...l[s],...a[s]};fy(l)}const j5=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function So(a){return a.startsWith("while")||a.startsWith("drag")&&a!=="draggable"||a.startsWith("layout")||a.startsWith("onTap")||a.startsWith("onPan")||a.startsWith("onLayout")||j5.has(a)}let Uy=a=>!So(a);function A5(a){typeof a=="function"&&(Uy=l=>l.startsWith("on")?!So(l):a(l))}try{A5(require("@emotion/is-prop-valid").default)}catch{}function E5(a,l,s){const r={};for(const c in a)c==="values"&&typeof a.values=="object"||le(a[c])||(Uy(c)||s===!0&&So(c)||!l&&!So(c)||a.draggable&&c.startsWith("onDrag"))&&(r[c]=a[c]);return r}const Co=C.createContext({});function M5(a,l){if(wo(a)){const{initial:s,animate:r}=a;return{initial:s===!1||El(s)?s:void 0,animate:El(r)?r:void 0}}return a.inherit!==!1?l:{}}function w5(a){const{initial:l,animate:s}=M5(a,C.useContext(Co));return C.useMemo(()=>({initial:l,animate:s}),[X0(l),X0(s)])}function X0(a){return Array.isArray(a)?a.join(" "):a}const jf=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function Ly(a,l,s){for(const r in l)!le(l[r])&&!by(r,s)&&(a[r]=l[r])}function C5({transformTemplate:a},l){return C.useMemo(()=>{const s=jf();return vf(s,l,a),Object.assign({},s.vars,s.style)},[l])}function N5(a,l){const s=a.style||{},r={};return Ly(r,s,a),Object.assign(r,C5(a,l)),r}function D5(a,l){const s={},r=N5(a,l);return a.drag&&a.dragListener!==!1&&(s.draggable=!1,r.userSelect=r.WebkitUserSelect=r.WebkitTouchCallout="none",r.touchAction=a.drag===!0?"none":`pan-${a.drag==="x"?"y":"x"}`),a.tabIndex===void 0&&(a.onTap||a.onTapStart||a.whileTap)&&(s.tabIndex=0),s.style=r,s}const Hy=()=>({...jf(),attrs:{}});function z5(a,l,s,r){const c=C.useMemo(()=>{const d=Hy();return xy(d,l,Sy(r),a.transformTemplate,a.style),{...d.attrs,style:{...d.style}}},[l]);if(a.style){const d={};Ly(d,a.style,a),c.style={...d,...c.style}}return c}const R5=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function Af(a){return typeof a!="string"||a.includes("-")?!1:!!(R5.indexOf(a)>-1||/[A-Z]/u.test(a))}function O5(a,l,s,{latestValues:r},c,d=!1,f){const y=(f??Af(a)?z5:D5)(l,r,c,a),g=E5(l,typeof a=="string",d),x=a!==C.Fragment?{...g,...y,ref:s}:{},{children:v}=l,S=C.useMemo(()=>le(v)?v.get():v,[v]);return C.createElement(a,{...x,children:S})}function V5({scrapeMotionValuesFromProps:a,createRenderState:l},s,r,c){return{latestValues:k5(s,r,c,a),renderState:l()}}function k5(a,l,s,r){const c={},d=r(a,{});for(const S in d)c[S]=uo(d[S]);let{initial:f,animate:m}=a;const y=wo(a),g=uy(a);l&&g&&!y&&a.inherit!==!1&&(f===void 0&&(f=l.initial),m===void 0&&(m=l.animate));let x=s?s.initial===!1:!1;x=x||f===!1;const v=x?m:f;if(v&&typeof v!="boolean"&&!Mo(v)){const S=Array.isArray(v)?v:[v];for(let j=0;j<S.length;j++){const M=hf(a,S[j]);if(M){const{transitionEnd:V,transition:N,..._}=M;for(const X in _){let B=_[X];if(Array.isArray(B)){const Y=x?B.length-1:0;B=B[Y]}B!==null&&(c[X]=B)}for(const X in V)c[X]=V[X]}}}return c}const Gy=a=>(l,s)=>{const r=C.useContext(Co),c=C.useContext(Ao),d=()=>V5(a,l,r,c);return s?d():Wc(d)},B5=Gy({scrapeMotionValuesFromProps:Sf,createRenderState:jf}),_5=Gy({scrapeMotionValuesFromProps:Ty,createRenderState:Hy}),U5=Symbol.for("motionComponentSymbol");function L5(a,l,s){const r=C.useRef(s);C.useInsertionEffect(()=>{r.current=s});const c=C.useRef(null);return C.useCallback(d=>{var m;d&&((m=a.onMount)==null||m.call(a,d)),l&&(d?l.mount(d):l.unmount());const f=r.current;if(typeof f=="function")if(d){const y=f(d);typeof y=="function"&&(c.current=y)}else c.current?(c.current(),c.current=null):f(d);else f&&(f.current=d)},[l])}const Yy=C.createContext({});function ui(a){return a&&typeof a=="object"&&Object.prototype.hasOwnProperty.call(a,"current")}function H5(a,l,s,r,c,d){var B,Y;const{visualElement:f}=C.useContext(Co),m=C.useContext(By),y=C.useContext(Ao),g=C.useContext(Tf),x=g.reducedMotion,v=g.skipAnimations,S=C.useRef(null),j=C.useRef(!1);r=r||m.renderer,!S.current&&r&&(S.current=r(a,{visualState:l,parent:f,props:s,presenceContext:y,blockInitialAnimation:y?y.initial===!1:!1,reducedMotionConfig:x,skipAnimations:v,isSVG:d}),j.current&&S.current&&(S.current.manuallyAnimateOnMount=!0));const M=S.current,V=C.useContext(Yy);M&&!M.projection&&c&&(M.type==="html"||M.type==="svg")&&G5(S.current,s,c,V);const N=C.useRef(!1);C.useInsertionEffect(()=>{M&&N.current&&M.update(s,y)});const _=s[Pg],X=C.useRef(!!_&&typeof window<"u"&&!((B=window.MotionHandoffIsComplete)!=null&&B.call(window,_))&&((Y=window.MotionHasOptimisedAnimation)==null?void 0:Y.call(window,_)));return Pc(()=>{j.current=!0,M&&(N.current=!0,window.MotionIsMounted=!0,M.updateFeatures(),M.scheduleRenderMicrotask(),X.current&&M.animationState&&M.animationState.animateChanges())}),C.useEffect(()=>{M&&(!X.current&&M.animationState&&M.animationState.animateChanges(),X.current&&(queueMicrotask(()=>{var J;(J=window.MotionHandoffMarkAsComplete)==null||J.call(window,_)}),X.current=!1),M.enteringChildren=void 0)}),M}function G5(a,l,s,r){const{layoutId:c,layout:d,drag:f,dragConstraints:m,layoutScroll:y,layoutRoot:g,layoutAnchor:x,layoutCrossfade:v}=l;a.projection=new s(a.latestValues,l["data-framer-portal-id"]?void 0:qy(a.parent)),a.projection.setOptions({layoutId:c,layout:d,alwaysMeasureLayout:!!f||m&&ui(m),visualElement:a,animationType:typeof d=="string"?d:"both",initialPromotionConfig:r,crossfade:v,layoutScroll:y,layoutRoot:g,layoutAnchor:x})}function qy(a){if(a)return a.options.allowProjection!==!1?a.projection:qy(a.parent)}function cc(a,{forwardMotionProps:l=!1,type:s}={},r,c){r&&T5(r);const d=s?s==="svg":Af(a),f=d?_5:B5;function m(g,x){let v;const S={...C.useContext(Tf),...g,layoutId:Y5(g)},{isStatic:j}=S,M=w5(g),V=f(g,j);if(!j&&typeof window<"u"){q5();const N=X5(S);v=N.MeasureLayout,M.visualElement=H5(a,V,S,c,N.ProjectionNode,d)}return p.jsxs(Co.Provider,{value:M,children:[v&&M.visualElement?p.jsx(v,{visualElement:M.visualElement,...S}):null,O5(a,g,L5(V,M.visualElement,x),V,j,l,d)]})}m.displayName=`motion.${typeof a=="string"?a:`create(${a.displayName??a.name??""})`}`;const y=C.forwardRef(m);return y[U5]=a,y}function Y5({layoutId:a}){const l=C.useContext(Fc).id;return l&&a!==void 0?l+"-"+a:a}function q5(a,l){C.useContext(By).strict}function X5(a){const l=_y(),{drag:s,layout:r}=l;if(!s&&!r)return{};const c={...s,...r};return{MeasureLayout:s!=null&&s.isEnabled(a)||r!=null&&r.isEnabled(a)?c.MeasureLayout:void 0,ProjectionNode:c.ProjectionNode}}function Q5(a,l){if(typeof Proxy>"u")return cc;const s=new Map,r=(d,f)=>cc(d,f,a,l),c=(d,f)=>r(d,f);return new Proxy(c,{get:(d,f)=>f==="create"?r:(s.has(f)||s.set(f,cc(f,void 0,a,l)),s.get(f))})}const Z5=(a,l)=>l.isSVG??Af(a)?new TS(l):new gS(l,{allowProjection:a!==C.Fragment});class K5 extends $n{constructor(l){super(l),l.animationState||(l.animationState=wS(l))}updateAnimationControlsSubscription(){const{animate:l}=this.node.getProps();Mo(l)&&(this.unmountControls=l.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:l}=this.node.getProps(),{animate:s}=this.node.prevProps||{};l!==s&&this.updateAnimationControlsSubscription()}unmount(){var l;this.node.animationState.reset(),(l=this.unmountControls)==null||l.call(this)}}let J5=0;class F5 extends $n{constructor(){super(...arguments),this.id=J5++,this.isExitComplete=!1}update(){var d;if(!this.node.presenceContext)return;const{isPresent:l,onExitComplete:s}=this.node.presenceContext,{isPresent:r}=this.node.prevPresenceContext||{};if(!this.node.animationState||l===r)return;if(l&&r===!1){if(this.isExitComplete){const{initial:f,custom:m}=this.node.getProps();if(typeof f=="string"||typeof f=="object"&&f!==null&&!Array.isArray(f)){const y=Aa(this.node,f,m);if(y){const{transition:g,transitionEnd:x,...v}=y;for(const S in v)(d=this.node.getValue(S))==null||d.jump(v[S])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const c=this.node.animationState.setActive("exit",!l);s&&!l&&c.then(()=>{this.isExitComplete=!0,s(this.id)})}mount(){const{register:l,onExitComplete:s}=this.node.presenceContext||{};s&&s(this.id),l&&(this.unmount=l(this.id))}unmount(){}}const W5={animation:{Feature:K5},exit:{Feature:F5}};function zl(a){return{point:{x:a.pageX,y:a.pageY}}}const P5=a=>l=>gf(l)&&a(l,zl(l));function Tl(a,l,s,r){return Ml(a,l,P5(s),r)}const Xy=({current:a})=>a?a.ownerDocument.defaultView:null,Q0=(a,l)=>Math.abs(a-l);function $5(a,l){const s=Q0(a.x,l.x),r=Q0(a.y,l.y);return Math.sqrt(s**2+r**2)}const Z0=new Set(["auto","scroll"]);class Qy{constructor(l,s,{transformPagePoint:r,contextWindow:c=window,dragSnapToOrigin:d=!1,distanceThreshold:f=3,element:m}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=M=>{this.handleScroll(M.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=Is(this.lastRawMoveEventInfo,this.transformPagePoint));const M=fc(this.lastMoveEventInfo,this.history),V=this.startEvent!==null,N=$5(M.offset,{x:0,y:0})>=this.distanceThreshold;if(!V&&!N)return;const{point:_}=M,{timestamp:X}=ie;this.history.push({..._,timestamp:X});const{onStart:B,onMove:Y}=this.handlers;V||(B&&B(this.lastMoveEvent,M),this.startEvent=this.lastMoveEvent),Y&&Y(this.lastMoveEvent,M)},this.handlePointerMove=(M,V)=>{this.lastMoveEvent=M,this.lastRawMoveEventInfo=V,this.lastMoveEventInfo=Is(V,this.transformPagePoint),Vt.update(this.updatePoint,!0)},this.handlePointerUp=(M,V)=>{this.end();const{onEnd:N,onSessionEnd:_,resumeAnimation:X}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&X&&X(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const B=fc(M.type==="pointercancel"?this.lastMoveEventInfo:Is(V,this.transformPagePoint),this.history);this.startEvent&&N&&N(M,B),_&&_(M,B)},!gf(l))return;this.dragSnapToOrigin=d,this.handlers=s,this.transformPagePoint=r,this.distanceThreshold=f,this.contextWindow=c||window;const y=zl(l),g=Is(y,this.transformPagePoint),{point:x}=g,{timestamp:v}=ie;this.history=[{...x,timestamp:v}];const{onSessionStart:S}=s;S&&S(l,fc(g,this.history));const j={passive:!0,capture:!0};this.removeListeners=Cl(Tl(this.contextWindow,"pointermove",this.handlePointerMove,j),Tl(this.contextWindow,"pointerup",this.handlePointerUp,j),Tl(this.contextWindow,"pointercancel",this.handlePointerUp,j)),m&&this.startScrollTracking(m)}startScrollTracking(l){let s=l.parentElement;for(;s;){const r=getComputedStyle(s);(Z0.has(r.overflowX)||Z0.has(r.overflowY))&&this.scrollPositions.set(s,{x:s.scrollLeft,y:s.scrollTop}),s=s.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(l){const s=this.scrollPositions.get(l);if(!s)return;const r=l===window,c=r?{x:window.scrollX,y:window.scrollY}:{x:l.scrollLeft,y:l.scrollTop},d={x:c.x-s.x,y:c.y-s.y};d.x===0&&d.y===0||(r?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=d.x,this.lastMoveEventInfo.point.y+=d.y):this.history.length>0&&(this.history[0].x-=d.x,this.history[0].y-=d.y),this.scrollPositions.set(l,c),Vt.update(this.updatePoint,!0))}updateHandlers(l){this.handlers=l}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),Wn(this.updatePoint)}}function Is(a,l){return l?{point:l(a.point)}:a}function K0(a,l){return{x:a.x-l.x,y:a.y-l.y}}function fc({point:a},l){return{point:a,delta:K0(a,Zy(l)),offset:K0(a,I5(l)),velocity:tT(l,.1)}}function I5(a){return a[0]}function Zy(a){return a[a.length-1]}function tT(a,l){if(a.length<2)return{x:0,y:0};let s=a.length-1,r=null;const c=Zy(a);for(;s>=0&&(r=a[s],!(c.timestamp-r.timestamp>Ce(l)));)s--;if(!r)return{x:0,y:0};r===a[0]&&a.length>2&&c.timestamp-r.timestamp>Ce(l)*2&&(r=a[1]);const d=Le(c.timestamp-r.timestamp);if(d===0)return{x:0,y:0};const f={x:(c.x-r.x)/d,y:(c.y-r.y)/d};return f.x===1/0&&(f.x=0),f.y===1/0&&(f.y=0),f}function eT(a,{min:l,max:s},r){return l!==void 0&&a<l?a=r?Ot(l,a,r.min):Math.max(a,l):s!==void 0&&a>s&&(a=r?Ot(s,a,r.max):Math.min(a,s)),a}function J0(a,l,s){return{min:l!==void 0?a.min+l:void 0,max:s!==void 0?a.max+s-(a.max-a.min):void 0}}function nT(a,{top:l,left:s,bottom:r,right:c}){return{x:J0(a.x,s,c),y:J0(a.y,l,r)}}function F0(a,l){let s=l.min-a.min,r=l.max-a.max;return l.max-l.min<a.max-a.min&&([s,r]=[r,s]),{min:s,max:r}}function aT(a,l){return{x:F0(a.x,l.x),y:F0(a.y,l.y)}}function iT(a,l){let s=.5;const r=ce(a),c=ce(l);return c>r?s=jl(l.min,l.max-r,a.min):r>c&&(s=jl(a.min,a.max-c,l.min)),en(0,1,s)}function lT(a,l){const s={};return l.min!==void 0&&(s.min=l.min-a.min),l.max!==void 0&&(s.max=l.max-a.min),s}const qc=.35;function sT(a=qc){return a===!1?a=0:a===!0&&(a=qc),{x:W0(a,"left","right"),y:W0(a,"top","bottom")}}function W0(a,l,s){return{min:P0(a,l),max:P0(a,s)}}function P0(a,l){return typeof a=="number"?a:a[l]||0}const oT=new WeakMap;class rT{constructor(l){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=Wt(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=l}start(l,{snapToCursor:s=!1,distanceThreshold:r}={}){const{presenceContext:c}=this.visualElement;if(c&&c.isPresent===!1)return;const d=v=>{s&&this.snapToCursor(zl(v).point),this.stopAnimation()},f=(v,S)=>{const{drag:j,dragPropagation:M,onDragStart:V}=this.getProps();if(j&&!M&&(this.openDragLock&&this.openDragLock(),this.openDragLock=k2(j),!this.openDragLock))return;this.latestPointerEvent=v,this.latestPanInfo=S,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),$e(_=>{let X=this.getAxisMotionValue(_).get()||0;if(tn.test(X)){const{projection:B}=this.visualElement;if(B&&B.layout){const Y=B.layout.layoutBox[_];Y&&(X=ce(Y)*(parseFloat(X)/100))}}this.originPoint[_]=X}),V&&Vt.update(()=>V(v,S),!1,!0),Oc(this.visualElement,"transform");const{animationState:N}=this.visualElement;N&&N.setActive("whileDrag",!0)},m=(v,S)=>{this.latestPointerEvent=v,this.latestPanInfo=S;const{dragPropagation:j,dragDirectionLock:M,onDirectionLock:V,onDrag:N}=this.getProps();if(!j&&!this.openDragLock)return;const{offset:_}=S;if(M&&this.currentDirection===null){this.currentDirection=cT(_),this.currentDirection!==null&&V&&V(this.currentDirection);return}this.updateAxis("x",S.point,_),this.updateAxis("y",S.point,_),this.visualElement.render(),N&&Vt.update(()=>N(v,S),!1,!0)},y=(v,S)=>{this.latestPointerEvent=v,this.latestPanInfo=S,this.stop(v,S),this.latestPointerEvent=null,this.latestPanInfo=null},g=()=>{const{dragSnapToOrigin:v}=this.getProps();(v||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:x}=this.getProps();this.panSession=new Qy(l,{onSessionStart:d,onStart:f,onMove:m,onSessionEnd:y,resumeAnimation:g},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:x,distanceThreshold:r,contextWindow:Xy(this.visualElement),element:this.visualElement.current})}stop(l,s){const r=l||this.latestPointerEvent,c=s||this.latestPanInfo,d=this.isDragging;if(this.cancel(),!d||!c||!r)return;const{velocity:f}=c;this.startAnimation(f);const{onDragEnd:m}=this.getProps();m&&Vt.postRender(()=>m(r,c))}cancel(){this.isDragging=!1;const{projection:l,animationState:s}=this.visualElement;l&&(l.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:r}=this.getProps();!r&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),s&&s.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(l,s,r){const{drag:c}=this.getProps();if(!r||!to(l,c,this.currentDirection))return;const d=this.getAxisMotionValue(l);let f=this.originPoint[l]+r[l];this.constraints&&this.constraints[l]&&(f=eT(f,this.constraints[l],this.elastic[l])),d.set(f)}resolveConstraints(){var d;const{dragConstraints:l,dragElastic:s}=this.getProps(),r=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(d=this.visualElement.projection)==null?void 0:d.layout,c=this.constraints;l&&ui(l)?this.constraints||(this.constraints=this.resolveRefConstraints()):l&&r?this.constraints=nT(r.layoutBox,l):this.constraints=!1,this.elastic=sT(s),c!==this.constraints&&!ui(l)&&r&&this.constraints&&!this.hasMutatedConstraints&&$e(f=>{this.constraints!==!1&&this.getAxisMotionValue(f)&&(this.constraints[f]=lT(r.layoutBox[f],this.constraints[f]))})}resolveRefConstraints(){const{dragConstraints:l,onMeasureDragConstraints:s}=this.getProps();if(!l||!ui(l))return!1;const r=l.current,{projection:c}=this.visualElement;if(!c||!c.layout)return!1;c.root&&(c.root.scroll=void 0,c.root.updateScroll());const d=cS(r,c.root,this.visualElement.getTransformPagePoint());let f=aT(c.layout.layoutBox,d);if(s){const m=s(oS(f));this.hasMutatedConstraints=!!m,m&&(f=hy(m))}return f}startAnimation(l){const{drag:s,dragMomentum:r,dragElastic:c,dragTransition:d,dragSnapToOrigin:f,onDragTransitionEnd:m}=this.getProps(),y=this.constraints||{},g=$e(x=>{if(!to(x,s,this.currentDirection))return;let v=y&&y[x]||{};(f===!0||f===x)&&(v={min:0,max:0});const S=c?200:1e6,j=c?40:1e7,M={type:"inertia",velocity:r?l[x]:0,bounceStiffness:S,bounceDamping:j,timeConstant:750,restDelta:1,restSpeed:10,...d,...v};return this.startAxisValueAnimation(x,M)});return Promise.all(g).then(m)}startAxisValueAnimation(l,s){const r=this.getAxisMotionValue(l);return Oc(this.visualElement,l),r.start(df(l,r,0,s,this.visualElement,!1))}stopAnimation(){$e(l=>this.getAxisMotionValue(l).stop())}getAxisMotionValue(l){const s=`_drag${l.toUpperCase()}`,c=this.visualElement.getProps()[s];return c||this.visualElement.getValue(l,this.visualElement.latestValues[l]??0)}snapToCursor(l){$e(s=>{const{drag:r}=this.getProps();if(!to(s,r,this.currentDirection))return;const{projection:c}=this.visualElement,d=this.getAxisMotionValue(s);if(c&&c.layout){const{min:f,max:m}=c.layout.layoutBox[s],y=d.get()||0;d.set(l[s]-Ot(f,m,.5)+y)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:l,dragConstraints:s}=this.getProps(),{projection:r}=this.visualElement;if(!ui(s)||!r||!this.constraints)return;this.stopAnimation();const c={x:0,y:0};$e(f=>{const m=this.getAxisMotionValue(f);if(m&&this.constraints!==!1){const y=m.get();c[f]=iT({min:y,max:y},this.constraints[f])}});const{transformTemplate:d}=this.visualElement.getProps();this.visualElement.current.style.transform=d?d({},""):"none",r.root&&r.root.updateScroll(),r.updateLayout(),this.constraints=!1,this.resolveConstraints(),$e(f=>{if(!to(f,l,null))return;const m=this.getAxisMotionValue(f),{min:y,max:g}=this.constraints[f];m.set(Ot(y,g,c[f]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;oT.set(this.visualElement,this);const l=this.visualElement.current,s=Tl(l,"pointerdown",g=>{const{drag:x,dragListener:v=!0}=this.getProps(),S=g.target,j=S!==l&&G2(S);x&&v&&!j&&this.start(g)});let r;const c=()=>{const{dragConstraints:g}=this.getProps();ui(g)&&g.current&&(this.constraints=this.resolveRefConstraints(),r||(r=uT(l,g.current,()=>this.scalePositionWithinConstraints())))},{projection:d}=this.visualElement,f=d.addEventListener("measure",c);d&&!d.layout&&(d.root&&d.root.updateScroll(),d.updateLayout()),Vt.read(c);const m=Ml(window,"resize",()=>this.scalePositionWithinConstraints()),y=d.addEventListener("didUpdate",(({delta:g,hasLayoutChanged:x})=>{this.isDragging&&x&&($e(v=>{const S=this.getAxisMotionValue(v);S&&(this.originPoint[v]+=g[v].translate,S.set(S.get()+g[v].translate))}),this.visualElement.render())}));return()=>{m(),s(),f(),y&&y(),r&&r()}}getProps(){const l=this.visualElement.getProps(),{drag:s=!1,dragDirectionLock:r=!1,dragPropagation:c=!1,dragConstraints:d=!1,dragElastic:f=qc,dragMomentum:m=!0}=l;return{...l,drag:s,dragDirectionLock:r,dragPropagation:c,dragConstraints:d,dragElastic:f,dragMomentum:m}}}function $0(a){let l=!0;return()=>{if(l){l=!1;return}a()}}function uT(a,l,s){const r=l0(a,$0(s)),c=l0(l,$0(s));return()=>{r(),c()}}function to(a,l,s){return(l===!0||l===a)&&(s===null||s===a)}function cT(a,l=10){let s=null;return Math.abs(a.y)>l?s="y":Math.abs(a.x)>l&&(s="x"),s}class fT extends $n{constructor(l){super(l),this.removeGroupControls=He,this.removeListeners=He,this.controls=new rT(l)}mount(){const{dragControls:l}=this.node.getProps();l&&(this.removeGroupControls=l.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||He}update(){const{dragControls:l}=this.node.getProps(),{dragControls:s}=this.node.prevProps||{};l!==s&&(this.removeGroupControls(),l&&(this.removeGroupControls=l.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const dc=a=>(l,s)=>{a&&Vt.update(()=>a(l,s),!1,!0)};class dT extends $n{constructor(){super(...arguments),this.removePointerDownListener=He}onPointerDown(l){this.session=new Qy(l,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:Xy(this.node)})}createPanHandlers(){const{onPanSessionStart:l,onPanStart:s,onPan:r,onPanEnd:c}=this.node.getProps();return{onSessionStart:dc(l),onStart:dc(s),onMove:dc(r),onEnd:(d,f)=>{delete this.session,c&&Vt.postRender(()=>c(d,f))}}}mount(){this.removePointerDownListener=Tl(this.node.current,"pointerdown",l=>this.onPointerDown(l))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let hc=!1;class hT extends C.Component{componentDidMount(){const{visualElement:l,layoutGroup:s,switchLayoutGroup:r,layoutId:c}=this.props,{projection:d}=l;d&&(s.group&&s.group.add(d),r&&r.register&&c&&r.register(d),hc&&d.root.didUpdate(),d.addEventListener("animationComplete",()=>{this.safeToRemove()}),d.setOptions({...d.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),co.hasEverUpdated=!0}getSnapshotBeforeUpdate(l){const{layoutDependency:s,visualElement:r,drag:c,isPresent:d}=this.props,{projection:f}=r;return f&&(f.isPresent=d,l.layoutDependency!==s&&f.setOptions({...f.options,layoutDependency:s}),hc=!0,c||l.layoutDependency!==s||s===void 0||l.isPresent!==d?f.willUpdate():this.safeToRemove(),l.isPresent!==d&&(d?f.promote():f.relegate()||Vt.postRender(()=>{const m=f.getStack();(!m||!m.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:l,layoutAnchor:s}=this.props,{projection:r}=l;r&&(r.options.layoutAnchor=s,r.root.didUpdate(),pf.postRender(()=>{!r.currentAnimation&&r.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:l,layoutGroup:s,switchLayoutGroup:r}=this.props,{projection:c}=l;hc=!0,c&&(c.scheduleCheckAfterUnmount(),s&&s.group&&s.group.remove(c),r&&r.deregister&&r.deregister(c))}safeToRemove(){const{safeToRemove:l}=this.props;l&&l()}render(){return null}}function Ky(a){const[l,s]=ky(),r=C.useContext(Fc);return p.jsx(hT,{...a,layoutGroup:r,switchLayoutGroup:C.useContext(Yy),isPresent:l,safeToRemove:s})}const mT={pan:{Feature:dT},drag:{Feature:fT,ProjectionNode:Vy,MeasureLayout:Ky}};function I0(a,l,s){const{props:r}=a;a.animationState&&r.whileHover&&a.animationState.setActive("whileHover",s==="Start");const c="onHover"+s,d=r[c];d&&Vt.postRender(()=>d(l,zl(l)))}class pT extends $n{mount(){const{current:l}=this.node;l&&(this.unmount=_2(l,(s,r)=>(I0(this.node,r,"Start"),c=>I0(this.node,c,"End"))))}unmount(){}}class gT extends $n{constructor(){super(...arguments),this.isActive=!1}onFocus(){let l=!1;try{l=this.node.current.matches(":focus-visible")}catch{l=!0}!l||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Cl(Ml(this.node.current,"focus",()=>this.onFocus()),Ml(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function tg(a,l,s){const{props:r}=a;if(a.current instanceof HTMLButtonElement&&a.current.disabled)return;a.animationState&&r.whileTap&&a.animationState.setActive("whileTap",s==="Start");const c="onTap"+(s==="End"?"":s),d=r[c];d&&Vt.postRender(()=>d(l,zl(l)))}class yT extends $n{mount(){const{current:l}=this.node;if(!l)return;const{globalTapTarget:s,propagate:r}=this.node.props;this.unmount=q2(l,(c,d)=>(tg(this.node,d,"Start"),(f,{success:m})=>tg(this.node,f,m?"End":"Cancel")),{useGlobalTarget:s,stopPropagation:(r==null?void 0:r.tap)===!1})}unmount(){}}const Xc=new WeakMap,mc=new WeakMap,bT=a=>{const l=Xc.get(a.target);l&&l(a)},xT=a=>{a.forEach(bT)};function vT({root:a,...l}){const s=a||document;mc.has(s)||mc.set(s,{});const r=mc.get(s),c=JSON.stringify(l);return r[c]||(r[c]=new IntersectionObserver(xT,{root:a,...l})),r[c]}function ST(a,l,s){const r=vT(l);return Xc.set(a,s),r.observe(a),()=>{Xc.delete(a),r.unobserve(a)}}const TT={some:0,all:1};class jT extends $n{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){var y;(y=this.stopObserver)==null||y.call(this);const{viewport:l={}}=this.node.getProps(),{root:s,margin:r,amount:c="some",once:d}=l,f={root:s?s.current:void 0,rootMargin:r,threshold:typeof c=="number"?c:TT[c]},m=g=>{const{isIntersecting:x}=g;if(this.isInView===x||(this.isInView=x,d&&!x&&this.hasEnteredView))return;x&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",x);const{onViewportEnter:v,onViewportLeave:S}=this.node.getProps(),j=x?v:S;j&&j(g)};this.stopObserver=ST(this.node.current,f,m)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:l,prevProps:s}=this.node;["amount","margin","root"].some(AT(l,s))&&this.startObserver()}unmount(){var l;(l=this.stopObserver)==null||l.call(this),this.hasEnteredView=!1,this.isInView=!1}}function AT({viewport:a={}},{viewport:l={}}={}){return s=>a[s]!==l[s]}const ET={inView:{Feature:jT},tap:{Feature:yT},focus:{Feature:gT},hover:{Feature:pT}},MT={layout:{ProjectionNode:Vy,MeasureLayout:Ky}},wT={...W5,...ET,...mT,...MT},At=Q5(wT,Z5),Jy=C.createContext(null),Ef=()=>{const a=C.useContext(Jy);if(!a)throw new Error("useTheme must be used within ThemeProvider");return a},CT=()=>{const a=new Date().getHours();return a>=6&&a<18?"day":"night"},NT=({children:a})=>{const[l,s]=C.useState("day");C.useEffect(()=>{const d=localStorage.getItem("theme-mode");s(d==="day"||d==="night"?d:CT())},[]),C.useEffect(()=>{const d=document.documentElement;l==="night"?d.setAttribute("data-theme","night"):d.setAttribute("data-theme","day")},[l]);const r=C.useCallback(()=>{s(d=>{const f=d==="day"?"night":"day";return localStorage.setItem("theme-mode",f),f})},[]),c={mode:l,toggleTheme:r,isDay:l==="day",isNight:l==="night"};return p.jsx(Jy.Provider,{value:c,children:a})},Pe=.3,eg=800,DT=({variant:a="floating"})=>{const{isNight:l}=Ef(),[s,r]=C.useState(!1),c=C.useRef(null),d=C.useRef(null);C.useEffect(()=>{const y=l?"/night-rain.mp3":"/day-forest.mp3";if(c.current&&s){const g=c.current,x=g.volume,v=setInterval(()=>{g.volume>.05?g.volume=Math.max(0,g.volume-x/(eg/50)):(clearInterval(v),g.pause())},50),S=new Audio(y);return S.loop=!0,S.volume=0,c.current=S,S.play().then(()=>{const j=setInterval(()=>{S.volume<Pe-.02?S.volume=Math.min(Pe,S.volume+Pe/(eg/50)):(S.volume=Pe,clearInterval(j))},50)}).catch(()=>{r(!1)}),()=>clearInterval(v)}c.current&&c.current.pause(),c.current=new Audio(y),c.current.loop=!0,c.current.volume=Pe},[l]),C.useEffect(()=>()=>{c.current&&(c.current.pause(),c.current=null),d.current&&clearInterval(d.current)},[]);const f=C.useCallback(()=>{if(c.current)if(s){const y=c.current,g=y.volume,x=setInterval(()=>{y.volume>.02?y.volume=Math.max(0,y.volume-g/10):(clearInterval(x),y.pause(),y.volume=Pe)},40);d.current=x,r(!1)}else c.current.volume=0,c.current.play().then(()=>{const y=c.current;if(!y)return;const g=setInterval(()=>{y.volume<Pe-.02?y.volume=Math.min(Pe,y.volume+Pe/10):(y.volume=Pe,clearInterval(g))},40);d.current=g}).catch(()=>{}),r(!0)},[s]),m=a==="navbar"?`ambient-nav-btn ${s?"ambient-nav-playing":"ambient-nav-muted"}`:`ambient-btn ${s?"ambient-playing":"ambient-muted"}`;return p.jsxs(p.Fragment,{children:[p.jsx("button",{className:m,onClick:f,"aria-label":s?"关闭白噪音":"开启白噪音",title:s?l?"夜雨声":"晨林鸟鸣":"开启白噪音",children:p.jsxs("svg",{width:a==="navbar"?18:22,height:a==="navbar"?18:22,viewBox:"0 0 24 24",fill:"none",children:[p.jsx("path",{d:"M4 14V12C4 7.58 7.58 4 12 4S20 7.58 20 12V14",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),p.jsx("rect",{x:"3",y:"14",width:"3",height:"6",rx:"1.5",fill:"currentColor",opacity:"0.8"}),p.jsx("rect",{x:"18",y:"14",width:"3",height:"6",rx:"1.5",fill:"currentColor",opacity:"0.8"}),s&&p.jsx("path",{d:"M9 17V15M12 18V14M15 17V15",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"})]})}),p.jsx("style",{children:`
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
      `})]})},ng=[{key:"home",label:"首页"},{key:"about",label:"关于我"},{key:"projects",label:"项目集"},{key:"lab",label:"疗愈室"}],zT=({current:a,onNavigate:l,isNight:s,onToggleTheme:r,isFullMode:c})=>{const[d,f]=C.useState(!1),m=c?ng:ng.filter(y=>y.key==="lab");return C.useEffect(()=>{f(!1)},[a]),p.jsxs("nav",{className:"fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12",style:{background:"var(--bg-overlay)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)"},children:[p.jsxs("div",{className:"flex items-center gap-3",children:[p.jsx(DT,{variant:"navbar"}),!c&&p.jsx("span",{style:{fontFamily:'"Noto Serif SC", serif',fontSize:"15px",color:"var(--text)",fontWeight:500,letterSpacing:"0.05em"},children:"森林疗愈室"})]}),p.jsxs("div",{className:"hidden md:flex items-center gap-8",children:[m.map(y=>p.jsx("button",{onClick:()=>l(y.key),className:"nav-link",style:{color:a===y.key?"var(--accent)":"var(--text-soft)",fontWeight:a===y.key?500:400},children:y.label},y.key)),p.jsx("button",{onClick:r,className:"ml-4 px-3 py-1.5 rounded-lg text-sm transition-colors",style:{border:"1px solid var(--border)",color:"var(--text-soft)"},children:s?"日":"夜"})]}),p.jsxs("button",{className:"md:hidden p-2",onClick:()=>f(y=>!y),style:{color:"var(--text)"},"aria-label":"菜单",children:[p.jsx("div",{className:"w-5 h-0.5 mb-1.5",style:{background:"var(--text)"}}),p.jsx("div",{className:"w-5 h-0.5 mb-1.5",style:{background:"var(--text)"}}),p.jsx("div",{className:"w-5 h-0.5",style:{background:"var(--text)"}})]}),d&&p.jsxs("div",{className:"absolute top-16 left-0 right-0 md:hidden flex flex-col py-4 px-6 gap-4",style:{background:"var(--bg-overlay)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)"},children:[m.map(y=>p.jsx("button",{onClick:()=>l(y.key),style:{color:a===y.key?"var(--accent)":"var(--text-soft)",fontWeight:a===y.key?500:400,textAlign:"left"},children:y.label},y.key)),p.jsxs("button",{onClick:r,style:{color:"var(--text-soft)",textAlign:"left"},children:["切换",s?"昼":"夜","模式"]})]}),p.jsx("style",{children:`
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
      `})]})},Mf=[{id:"forest-healing",title:"森林疗愈室",tag:"沉浸式疗愈网页",painPoint:"专为 i 人设计的低能耗回血方案",description:"融合自然白噪音、呼吸引导与感恩日记的沉浸式疗愈网页，依昼夜节律切换森林光影与萤火粒子，为社交耗竭后的你留一处安静的角落。",imageUrl:"/forest-bg.jpg",liveUrl:"https://forest-healing.vercel.app",link:"https://forest-healing.vercel.app",tags:["React","Framer Motion","Web Audio"]},{id:"answer-book",title:"5%答案书",tag:"轻决策小程序",painPoint:"给选择困难症的一颗轻量解药",description:"当你被选项淹没、迟迟无法下决定时，它不替你做主，只递给你一句刚好够用的提示——把纠结的能耗，悄悄降回 5%。",imageUrl:"/project-mindful.jpg",liveUrl:"https://answer-book.vercel.app",link:"https://answer-book.vercel.app",tags:["React","TypeScript","轻交互"]},{id:"breathing-forest",title:"呼吸之森",tag:"正念呼吸引导器",painPoint:"三分钟，按下焦虑的暂停键",description:"以 4-7-8 呼吸法为节律的 SVG 引导器，叶脉随呼吸张合，配合环境音，让紧绷的神经在三个呼吸里慢慢松开。",imageUrl:"/healing-breathing.jpg",liveUrl:"https://breathing-forest.vercel.app",link:"https://breathing-forest.vercel.app",tags:["SVG 动画","CSS Transform","正念"]},{id:"meditation-space",title:"冥想空间",tag:"可定时冥想工具",painPoint:"把五分钟，安静地还给自己",description:"内置四种自然声景与温柔语音提示的冥想计时器。不必专注，只需坐下，让声音替你保管时间。",imageUrl:"/healing-meditation.jpg",liveUrl:"https://meditation-space.vercel.app",link:"https://meditation-space.vercel.app",tags:["Web Audio","SpeechSynthesis","计时器"]},{id:"gratitude-journal",title:"感恩手账",tag:"翻页式情绪日记",painPoint:"每天一句，把无处安放的情绪接住",description:"十二个月封面的翻页式手账，记录每天一件值得感谢的小事。年末翻回，会看见一整年悄悄发着光的自己。",imageUrl:"/healing-gratitude.jpg",liveUrl:"https://gratitude-journal.vercel.app",link:"https://gratitude-journal.vercel.app",tags:["Framer Motion","LocalStorage","日记"]}],To=Mf.length,pc=To+1,ag=600,ig=`data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <pattern id="vein" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
      <path d="M100 10 L100 190 M100 40 Q70 60 50 90 M100 40 Q130 60 150 90 M100 80 Q60 100 40 140 M100 80 Q140 100 160 140 M100 120 Q70 140 55 170 M100 120 Q130 140 145 170" stroke="rgba(122,154,130,0.06)" stroke-width="0.8" fill="none"/>
    </pattern>
  </defs>
  <rect width="200" height="200" fill="url(#vein)"/>
</svg>
`)}`,RT=({size:a=16})=>p.jsxs("svg",{width:a,height:a,viewBox:"0 0 20 20",fill:"none",children:[p.jsx("path",{d:"M10 2C5 2 2 6 2 11c0 4 3 7 8 7 0-5 2-9 8-11-3-3-6-5-8-5z",fill:"rgba(122,154,130,0.6)"}),p.jsx("path",{d:"M6 16C8 12 11 9 15 7",stroke:"rgba(255,255,255,0.4)",strokeWidth:"0.8",strokeLinecap:"round"})]}),OT={enter:a=>({rotateY:a>0?90:-90,opacity:0}),center:{rotateY:0,opacity:1},exit:a=>({rotateY:a>0?-90:90,opacity:0})},VT=()=>p.jsxs("div",{className:"lb-page-content lb-cover",children:[p.jsx("div",{className:"lb-cover-vein"}),p.jsx("div",{className:"lb-cover-frame"}),p.jsxs("div",{className:"lb-cover-inner",children:[p.jsx("div",{className:"lb-cover-leaf",children:p.jsx(RT,{size:42})}),p.jsx("p",{className:"lb-cover-eyebrow",children:"A Leaf Book of Works"}),p.jsx("h1",{className:"lb-cover-title",children:"项目集"}),p.jsx("div",{className:"lb-cover-line"}),p.jsx("p",{className:"lb-cover-author",children:"路俊玲 · 2026"})]}),p.jsx("p",{className:"lb-cover-hint",children:"轻触封面 · 翻开"})]}),kT=({onPick:a})=>p.jsxs("div",{className:"lb-page-content lb-index-page",children:[p.jsx("div",{className:"lb-page-vein"}),p.jsxs("div",{className:"lb-index-grid",children:[p.jsxs("div",{className:"lb-index-left",children:[p.jsx("span",{className:"lb-index-label",children:"CONTENTS"}),p.jsx("h2",{className:"lb-index-title",children:"目录"}),p.jsx("div",{className:"lb-index-deco"}),p.jsxs("p",{className:"lb-index-count",children:["共 ",To," 件作品"]})]}),p.jsx("ul",{className:"lb-index-list",children:Mf.map((l,s)=>p.jsxs("li",{className:"lb-index-item",onClick:a?r=>{r.stopPropagation(),a(s)}:void 0,children:[p.jsx("span",{className:"lb-index-num",children:String(s+1).padStart(2,"0")}),p.jsxs("div",{className:"lb-index-item-text",children:[p.jsx("span",{className:"lb-index-item-title",children:l.title}),p.jsx("span",{className:"lb-index-item-pain",children:l.painPoint})]}),p.jsxs("span",{className:"lb-index-item-page",children:["P.",s+2]})]},l.id))})]})]}),BT=({project:a,index:l})=>p.jsxs("div",{className:"lb-page-content lb-detail-page",children:[p.jsx("div",{className:"lb-page-vein"}),p.jsxs("div",{className:"lb-detail-grid",children:[p.jsxs("div",{className:"lb-detail-text",children:[p.jsxs("span",{className:"lb-detail-num",children:["No. ",String(l+1).padStart(2,"0")]}),p.jsx("h2",{className:"lb-detail-title",children:a.title}),p.jsxs("div",{className:"lb-detail-pain-wrap",children:[p.jsx("span",{className:"lb-detail-pain-bar"}),p.jsx("p",{className:"lb-detail-pain",children:a.painPoint})]}),p.jsx("p",{className:"lb-detail-desc",children:a.description}),a.tags&&a.tags.length>0&&p.jsx("div",{className:"lb-detail-tags",children:a.tags.map(s=>p.jsx("span",{className:"lb-detail-tag",children:s},s))}),p.jsx("a",{className:"lb-detail-link",href:a.liveUrl,target:"_blank",rel:"noopener noreferrer",onClick:s=>s.stopPropagation(),children:"访问作品 ↗"})]}),p.jsxs("a",{className:"lb-detail-visual",href:a.liveUrl,target:"_blank",rel:"noopener noreferrer",onClick:s=>s.stopPropagation(),children:[a.videoUrl?p.jsx("video",{src:a.videoUrl,className:"lb-detail-media",muted:!0,loop:!0,autoPlay:!0,playsInline:!0}):p.jsx("img",{src:a.imageUrl,alt:a.title,className:"lb-detail-media"}),p.jsx("span",{className:"lb-detail-visual-overlay"}),p.jsx("span",{className:"lb-detail-visual-hint",children:"点击访问 ↗"})]})]})]}),_T=({registerOpenBook:a})=>{const[l,s]=C.useState(0),[r,c]=C.useState(0),[d,f]=C.useState(!1),m=C.useRef(0),y=C.useRef(!1),g=C.useRef(null);C.useEffect(()=>{m.current=l},[l]);const x=C.useCallback((B,Y)=>{if(y.current)return;const J=Math.max(0,Math.min(To+1,B));J!==m.current&&(y.current=!0,f(!0),c(Y),s(J),window.setTimeout(()=>{y.current=!1,f(!1)},ag))},[]),v=C.useCallback(()=>{m.current>1&&x(m.current-1,-1)},[x]),S=C.useCallback(()=>{m.current<pc?x(m.current+1,1):m.current===0&&x(1,1)},[x]),j=C.useCallback(()=>{const B=m.current;B===0?x(1,1):B>1&&x(1,-1)},[x]);C.useEffect(()=>{a&&a(j)},[a,j]);const M=B=>{if(m.current===0){x(1,1);return}const J=B.currentTarget.getBoundingClientRect();B.clientX-J.left<J.width/2?v():S()},V=B=>{g.current={x:B.touches[0].clientX,y:B.touches[0].clientY}},N=B=>{if(!g.current)return;const Y=B.changedTouches[0].clientX-g.current.x,J=B.changedTouches[0].clientY-g.current.y;Math.abs(Y)>50&&Math.abs(Y)>Math.abs(J)&&(Y<0?S():v()),g.current=null},_=B=>{if(B===0)return p.jsx(VT,{});if(B===1)return p.jsx(kT,{onPick:J=>x(J+2,1)});const Y=B-2;return Y>=0&&Y<To?p.jsx(BT,{project:Mf[Y],index:Y}):null},X=l===0;return p.jsxs("div",{className:"lb-wrapper",children:[p.jsxs("div",{className:"lb-book-stand",children:[p.jsxs("div",{className:"lb-book",onClick:M,onTouchStart:V,onTouchEnd:N,children:[p.jsx("div",{className:"lb-spine-shadow"}),p.jsxs("div",{className:"lb-pages-container",children:[p.jsx(Pn,{mode:"wait",custom:r,children:p.jsx(At.div,{className:"lb-page",custom:r,variants:OT,initial:"enter",animate:"center",exit:"exit",transition:{duration:ag/1e3,ease:[.4,0,.2,1]},style:{transformOrigin:"left center"},children:_(l)},l)}),d&&p.jsx("div",{className:`lb-flip-shadow ${r>0?"lb-flip-shadow-fwd":"lb-flip-shadow-bwd"}`})]}),!X&&p.jsx("button",{className:"lb-close-btn",onClick:B=>{B.stopPropagation(),x(0,-1)},children:"合上书"})]}),p.jsx("div",{className:"lb-desk-shadow"})]}),!X&&p.jsxs("div",{className:"lb-controls",children:[p.jsx("button",{className:"lb-nav-btn",onClick:B=>{B.stopPropagation(),v()},disabled:l===1,"aria-label":"上一页",children:"←"}),p.jsxs("span",{className:"lb-page-indicator",children:["第 ",p.jsx("span",{className:"lb-page-current",children:l})," / ",pc," 页"]}),p.jsx("button",{className:"lb-nav-btn",onClick:B=>{B.stopPropagation(),S()},disabled:l===pc,"aria-label":"下一页",children:"→"})]}),p.jsx("style",{children:`
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
          background-image: url("${ig}");
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
          background-image: url("${ig}");
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
      `})]})},Fy="gratitude_entries",wl="gratitude_drafts",Qc=["新生","接纳","表达","感恩","身体","小确幸","平静","创造","韧性","放下","连接","回顾"],UT=["新的一年，从写下今天最想开始的改变开始…","今天，我允许自己不完美，接纳此刻的情绪和身体。","情绪不是敌人，今天我选择用文字、绘画或声音表达它。","今天，我感谢谁？哪怕只是一句问候、一个微笑。","身体在告诉我什么？今天我倾听它的信号，给它一杯水、一次拉伸。","今天，哪个微小瞬间让我嘴角上扬？一杯咖啡、一阵风、一句“你来了”。","今天，我为自己创造了一刻宁静——也许是闭眼深呼吸，也许是看云发呆。","今天，我允许自己“无用”地创造——画一笔、写一句、哼一段旋律。","今天，我面对了一个小挑战，我对自己说：“我可以慢慢来。”","今天，我放下了一件小事——也许是旧物、旧想法、旧情绪。","今天，我和谁有了真实的对话？哪怕只是眼神交汇、指尖触碰。","这一年，我感谢自己坚持下来的每一天。明年，我想继续温柔地生长。"],Wy=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],LT=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],Zc=[{key:"sun",label:"晴天"},{key:"cloud",label:"多云"},{key:"rain",label:"雨天"},{key:"moon",label:"夜晚"}],gc=[{key:"joy",dot:"#F4D88A",label:"开心"},{key:"calm",dot:"#A5D6A7",label:"平静"},{key:"cool",dot:"#90CAF9",label:"冷静"},{key:"tender",dot:"#F4A6B8",label:"温柔"},{key:"soulful",dot:"#C5A3D6",label:"感性"},{key:"mellow",dot:"#D9C9B0",label:"平淡"}],lg=({name:a,size:l=16})=>{const s={width:l,height:l,viewBox:"0 0 20 20",fill:"none",stroke:"currentColor",strokeWidth:1.3,strokeLinecap:"round",strokeLinejoin:"round"};return a==="sun"?p.jsxs("svg",{...s,children:[p.jsx("circle",{cx:"10",cy:"10",r:"3.4"}),p.jsx("path",{d:"M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4"})]}):a==="cloud"?p.jsx("svg",{...s,children:p.jsx("path",{d:"M6 14a3 3 0 0 1-.4-5.97 4 4 0 0 1 7.74-.78A2.7 2.7 0 0 1 15.5 14H6Z"})}):a==="rain"?p.jsxs("svg",{...s,children:[p.jsx("path",{d:"M6 11a3 3 0 0 1-.4-5.97 4 4 0 0 1 7.74-.78A2.7 2.7 0 0 1 15.5 11H6Z"}),p.jsx("path",{d:"M7 14.5l-1 2.5M11 14.5l-1 2.5M14 14.5l-1 2.5",opacity:"0.7"})]}):p.jsx("svg",{...s,children:p.jsx("path",{d:"M16 12.5A6.5 6.5 0 1 1 8 3.5a5.2 5.2 0 0 0 8 9Z"})})},Py=({size:a=15})=>p.jsxs("svg",{width:a,height:a,viewBox:"0 0 20 20",fill:"none",stroke:"currentColor",strokeWidth:1.3,strokeLinecap:"round",strokeLinejoin:"round",children:[p.jsx("path",{d:"M4 4.5C4 3.7 4.7 3.5 5.5 3.5H10v13H5.5C4.7 16.5 4 16.3 4 15.5Z"}),p.jsx("path",{d:"M16 4.5C16 3.7 15.3 3.5 14.5 3.5H10v13h4.5c.8 0 1.5-.2 1.5-1Z"})]}),HT=({size:a=14})=>p.jsxs("svg",{width:a,height:a,viewBox:"0 0 20 20",fill:"none",children:[p.jsx("path",{d:"M10 2C5 3 3 7 3 11c0 3.5 3 6.5 7 6.5 0-5 2.5-9 7-11-3-2.5-5.5-4.5-7-4.5Z",fill:"currentColor",opacity:"0.85"}),p.jsx("path",{d:"M5 16c2-4 5-7 9-9",stroke:"rgba(255,255,255,0.5)",strokeWidth:"0.9",strokeLinecap:"round"})]}),jo=()=>{const a=new Date;return`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}-${String(a.getDate()).padStart(2,"0")}`},GT=a=>{const l=a.split("-");return l.length>=2?parseInt(l[1],10):new Date().getMonth()+1},YT=a=>{const[l,s,r]=a.split("-").map(Number),c=new Date(l,s-1,r);return`${l}年${s}月${r}日 ${LT[c.getDay()]}`},wf=a=>a?Zc.some(l=>l.key===a)?a:a.includes("☀")||a.includes("晴")?"sun":a.includes("☁")?"cloud":a.includes("雨")?"rain":a.includes("🌙")||a.includes("夜")?"moon":"sun":"sun",qT=()=>{try{const a=localStorage.getItem(Fy);return a?JSON.parse(a).map(s=>{const r=s.month!=null?s.month:GT(s.date||jo());return{id:s.id||s.date||`${Date.now()}`,date:s.date||jo(),month:r,mood:wf(s.mood),color:s.color||"",content:s.content||s.text||""}}):[]}catch{return[]}},sg=a=>{localStorage.setItem(Fy,JSON.stringify(a))},XT=a=>{try{return JSON.parse(localStorage.getItem(wl)||"{}")[String(a)]||null}catch{return null}},QT=(a,l)=>{try{const s=JSON.parse(localStorage.getItem(wl)||"{}");s[String(a)]=l,localStorage.setItem(wl,JSON.stringify(s))}catch{}},ZT=a=>{try{const l=JSON.parse(localStorage.getItem(wl)||"{}");delete l[String(a)],localStorage.setItem(wl,JSON.stringify(l))}catch{}},yc={enter:a=>({rotateY:a>0?95:-95,opacity:0}),center:{rotateY:0,opacity:1},exit:a=>({rotateY:a>0?-95:95,opacity:0})},KT=()=>p.jsxs("div",{className:"gj-cover-scene","aria-hidden":"true",children:[p.jsx("img",{src:"/gratitude-cover.jpg",alt:"",className:"gj-cover-img",draggable:!1}),p.jsx("div",{className:"gj-cover-veil"}),p.jsx("span",{className:"gj-bokeh gj-bokeh-1"}),p.jsx("span",{className:"gj-bokeh gj-bokeh-2"})]}),JT=({currentMonth:a,monthsWithEntries:l,onOpenMonth:s,onClose:r})=>p.jsxs("div",{className:"gj-page-inner gj-directory",children:[p.jsx("header",{className:"gj-page-head",children:p.jsxs("div",{children:[p.jsx("h3",{className:"gj-page-title",children:"月度篇章"}),p.jsx("p",{className:"gj-page-sub",children:"十二个月，十二种向内的探险"})]})}),p.jsx("div",{className:"gj-grid",children:Array.from({length:12},(c,d)=>{const f=d+1,m=f===a,y=l.has(f);return p.jsxs(At.button,{type:"button",className:`gj-month-card${m?" gj-current":""}`,whileHover:{y:-5,transition:{type:"spring",stiffness:320,damping:22}},whileTap:{scale:.97},onClick:()=>s(f),"aria-label":`${Wy[d]} · ${Qc[d]}`,children:[y&&p.jsx("span",{className:"gj-month-dot"}),m&&p.jsx("span",{className:"gj-month-today",children:"本月"}),p.jsx("span",{className:"gj-month-num",children:f}),p.jsx("span",{className:"gj-month-theme",children:Qc[d]})]},f)})}),p.jsxs("button",{className:"gj-close-book",onClick:r,"aria-label":"合上书",children:[p.jsx(Py,{}),p.jsx("span",{children:"合上书"})]})]}),FT=({selectedMonth:a,today:l,content:s,weather:r,color:c,savedFlash:d,entries:f,onContent:m,onWeather:y,onColor:g,onSave:x,onDelete:v,onBack:S,onClose:j})=>{var V;const M=C.useMemo(()=>f.filter(N=>N.month===a).sort((N,_)=>_.date>N.date?1:-1),[f,a]);return p.jsxs("div",{className:"gj-page-inner gj-diary",children:[p.jsxs("div",{className:"gj-diary-top",children:[p.jsxs("button",{className:"gj-back-dir",onClick:S,"aria-label":"返回目录",children:[p.jsx("span",{"aria-hidden":"true",children:"←"})," 目录"]}),p.jsxs("span",{className:"gj-detail-theme",children:[Wy[a-1]," · ",Qc[a-1]]})]}),p.jsxs("div",{className:"gj-guidance",children:[p.jsx("span",{className:"gj-guidance-mark",children:p.jsx(HT,{size:13})}),p.jsx("p",{className:"gj-guidance-text",children:UT[a-1]})]}),p.jsxs("div",{className:"gj-detail-body",children:[p.jsxs("div",{className:"gj-sidebar",children:[p.jsxs("div",{children:[p.jsx("div",{className:"gj-sidebar-label",children:"日期"}),p.jsx("div",{className:"gj-sidebar-date",children:YT(l)})]}),p.jsxs("div",{children:[p.jsx("div",{className:"gj-sidebar-label",children:"天气"}),p.jsx("div",{className:"gj-weather-picker",children:Zc.map(N=>p.jsx("button",{type:"button",className:`gj-weather-btn${r===N.key?" gj-weather-active":""}`,onClick:()=>y(N.key),title:N.label,"aria-label":N.label,children:p.jsx(lg,{name:N.key,size:17})},N.key))})]}),p.jsxs("div",{children:[p.jsx("div",{className:"gj-sidebar-label",children:"心情"}),p.jsx("div",{className:"gj-mood-picker",children:gc.map(N=>p.jsx("button",{type:"button",className:`gj-mood-dot${c===N.key?" gj-mood-active":""}`,style:{"--gj-dot":N.dot,background:N.dot},onClick:()=>g(c===N.key?"":N.key),title:N.label,"aria-label":N.label,"aria-pressed":c===N.key},N.key))}),p.jsx("p",{className:"gj-mood-hint",children:c?(V=gc.find(N=>N.key===c))==null?void 0:V.label:"轻触一颗，标记此刻"})]})]}),p.jsx("div",{className:"gj-writing",children:p.jsx("textarea",{className:"gj-textarea",value:s,onChange:N=>m(N.target.value),placeholder:"在这里，写下今天的温柔…",spellCheck:!1})})]}),p.jsxs("div",{className:"gj-save-area",children:[p.jsx(Pn,{children:d&&p.jsx(At.span,{className:"gj-save-feedback",initial:{opacity:0,y:6},animate:{opacity:1,y:0},exit:{opacity:0,y:6},transition:{duration:.4},children:"已记录 ✨ 今天的温柔已存入心底。"})}),p.jsx("button",{type:"button",className:`gj-save-btn${d?" gj-saved":""}`,onClick:x,disabled:!s.trim(),children:d?"已保存 ✓":"保存"})]}),M.length>0&&p.jsxs("div",{className:"gj-month-history",children:[p.jsxs("h4",{className:"gj-month-history-title",children:["本月记录 ",p.jsx("span",{className:"gj-month-history-count",children:M.length})]}),p.jsx("div",{className:"gj-month-entry-list",children:M.map(N=>{var X;const _=gc.find(B=>B.key===N.color);return p.jsxs("div",{className:"gj-month-entry",children:[p.jsxs("div",{className:"gj-month-entry-header",children:[p.jsxs("div",{className:"gj-month-entry-date-row",children:[p.jsx("span",{className:"gj-month-entry-date",children:N.date}),p.jsx("span",{className:"gj-month-entry-weather",title:(X=Zc.find(B=>B.key===N.mood))==null?void 0:X.label,children:p.jsx(lg,{name:wf(N.mood),size:14})}),_&&p.jsx("span",{className:"gj-month-entry-color-tag",style:{background:_.dot},title:_.label})]}),p.jsx("button",{className:"gj-month-entry-delete",onClick:()=>v(N.id),"aria-label":"删除",children:"×"})]}),p.jsx("p",{className:"gj-month-entry-text",children:N.content})]},N.id)})})]}),p.jsxs("button",{className:"gj-close-book",onClick:j,"aria-label":"合上书",children:[p.jsx(Py,{}),p.jsx("span",{children:"合上书"})]})]})},WT=()=>{const[a,l]=C.useState("cover"),[s,r]=C.useState(1),[c,d]=C.useState(null),[f,m]=C.useState([]),[y,g]=C.useState(""),[x,v]=C.useState("sun"),[S,j]=C.useState(""),[M,V]=C.useState(!1),N=C.useMemo(()=>jo(),[]),_=C.useMemo(()=>new Date().getMonth()+1,[]);C.useEffect(()=>{m(qT())},[]);const X=C.useMemo(()=>{const st=new Set;return f.forEach(mt=>st.add(mt.month)),st},[f]),B=C.useCallback((st,mt)=>{QT(st,mt)},[]),Y=C.useCallback(st=>{d(st),r(1),l("diary");const mt=XT(st);if(mt)v(mt.weather),j(mt.color),g(mt.content);else{const vt=f.filter(O=>O.month===st).sort((O,Q)=>Q.date>O.date?1:-1)[0];vt?(v(wf(vt.mood)),j(vt.color),g(vt.content)):(v("sun"),j(""),g(""))}},[f]),J=C.useCallback(()=>{r(1),l("directory")},[]),it=C.useCallback(()=>{r(-1),l("cover"),d(null)},[]),q=C.useCallback(()=>{r(-1),l("directory"),d(null)},[]),Z=C.useCallback(st=>{g(st),c!==null&&B(c,{weather:x,color:S,content:st})},[c,x,S,B]),nt=C.useCallback(st=>{v(st),c!==null&&B(c,{weather:st,color:S,content:y})},[c,S,y,B]),I=C.useCallback(st=>{j(st),c!==null&&B(c,{weather:x,color:st,content:y})},[c,x,y,B]),et=C.useCallback(()=>{if(!y.trim()||c===null)return;const st=jo(),mt={id:`${st}-${Date.now()}`,date:st,month:c,mood:x,color:S,content:y.trim()},vt=f.findIndex(Q=>Q.date===st&&Q.month===c);let O;vt>=0?O=f.map((Q,F)=>F===vt?{...mt,id:Q.id}:Q):O=[mt,...f],m(O),sg(O),ZT(c),V(!0),window.setTimeout(()=>V(!1),2e3)},[y,c,x,S,f]),ft=C.useCallback(st=>{const mt=f.filter(vt=>vt.id!==st);m(mt),sg(mt)},[f]);return p.jsxs("div",{className:"gj-root",children:[p.jsx("div",{className:"gj-book-stand",children:p.jsxs("div",{className:"gj-book",children:[p.jsx("div",{className:"gj-spine"}),p.jsxs(Pn,{mode:"wait",custom:s,children:[a==="cover"&&p.jsxs(At.div,{className:"gj-page gj-cover",custom:s,variants:yc,initial:"enter",animate:"center",exit:"exit",transition:{duration:.62,ease:[.4,0,.2,1]},onClick:J,role:"button",tabIndex:0,"aria-label":"翻开感恩日记",onKeyDown:st=>{(st.key==="Enter"||st.key===" ")&&(st.preventDefault(),J())},children:[p.jsx(KT,{}),p.jsx("div",{className:"gj-cover-text-veil","aria-hidden":"true"}),p.jsxs("div",{className:"absolute inset-0 z-[2] flex flex-col items-center justify-center px-10 py-24 text-center md:px-14 md:py-28",children:[p.jsx("h2",{className:"gj-cover-title m-0 font-medium leading-tight tracking-[0.12em] text-[2rem] md:text-[2.75rem] lg:text-[3.25rem]",children:"感恩日记"}),p.jsx("p",{className:"gj-cover-en mt-4 italic font-serif text-gray-500 text-[0.82rem] tracking-[0.18em] md:mt-5 md:text-[0.9rem]",children:"Gratitude Journal"}),p.jsx("p",{className:"gj-cover-sub mt-6 max-w-xs text-[0.8rem] leading-[2.15] tracking-[0.14em] md:mt-8 md:max-w-sm md:text-[0.92rem]",children:"在细碎的日常里，写下属于自己生命的注脚。"}),p.jsx("span",{className:"gj-cover-hint",children:"轻触翻开"})]})]},"cover"),a==="directory"&&p.jsx(At.div,{className:"gj-page gj-page-paper",custom:s,variants:yc,initial:"enter",animate:"center",exit:"exit",transition:{duration:.62,ease:[.4,0,.2,1]},children:p.jsx(JT,{currentMonth:_,monthsWithEntries:X,onOpenMonth:Y,onClose:it})},"directory"),a==="diary"&&c!==null&&p.jsx(At.div,{className:"gj-page gj-page-paper",custom:s,variants:yc,initial:"enter",animate:"center",exit:"exit",transition:{duration:.62,ease:[.4,0,.2,1]},children:p.jsx(FT,{selectedMonth:c,today:N,content:y,weather:x,color:S,savedFlash:M,entries:f,onContent:Z,onWeather:nt,onColor:I,onSave:et,onDelete:ft,onBack:q,onClose:it})},`diary-${c}`)]})]})}),p.jsx("style",{children:`
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
      `})]})},bc=[{id:"anxiety",emoji:"😟",label:"焦虑/压力大",desc:"均匀节奏 · 找回专注",color:"#5B9BD5",modeName:"方形呼吸 · 专注模式",phases:[{name:"inhale",duration:4,label:"吸气",fullLabel:"吸气"},{name:"hold",duration:4,label:"屏息",fullLabel:"屏息"},{name:"exhale",duration:4,label:"呼气",fullLabel:"呼气"},{name:"holdEmpty",duration:4,label:"空肺",fullLabel:"屏息·空肺"}]},{id:"tired",emoji:"😴",label:"疲惫/失眠",desc:"延长呼气 · 深度放松",color:"#7E57C2",modeName:"478 呼吸法",phases:[{name:"inhale",duration:4,label:"吸气",fullLabel:"吸气"},{name:"hold",duration:7,label:"屏息",fullLabel:"屏息"},{name:"exhale",duration:8,label:"呼气",fullLabel:"呼气"}]},{id:"low_energy",emoji:"😫",label:"能量不足",desc:"快速节奏 · 唤醒活力",color:"#FF8A65",modeName:"能量呼吸法",phases:[{name:"inhale",duration:3,label:"吸气",fullLabel:"吸气"},{name:"hold",duration:1,label:"屏息",fullLabel:"屏息"},{name:"exhale",duration:2,label:"呼气",fullLabel:"呼气"}]}],Ta=.76,eo=1.14,Kc=80,og=5,ml=2*Math.PI*Kc,no='"Noto Serif SC", Georgia, "Times New Roman", serif';function PT(a,l){switch(a){case"inhale":return Ta+(eo-Ta)*l;case"hold":return eo;case"exhale":return eo-(eo-Ta)*l;case"holdEmpty":return Ta}}function $T(a,l){switch(a){case"inhale":return l;case"hold":return 1;case"exhale":return 1-l;case"holdEmpty":return 0}}const IT=()=>{const[a,l]=C.useState(bc[0]),[s,r]=C.useState(!1),[c,d]=C.useState(!1),[f,m]=C.useState(0),[y,g]=C.useState(bc[0].phases[0].duration),[x,v]=C.useState(0),S=C.useRef(null),j=C.useRef(null),M=C.useRef(0),V=a.phases,N=V[f],_=C.useRef(V);_.current=V;const X=C.useRef(f);X.current=f,C.useEffect(()=>{g(N.duration)},[N]),C.useEffect(()=>{if(!s)return;const ft=N.duration*1e3,st=N.name,mt=performance.now()-M.current;S.current&&(S.current.style.transition="none"),j.current&&(j.current.style.transition="none");let vt=0,O=-1;const Q=F=>{const ot=F-mt;M.current=ot;const ht=Math.min(ot/ft,1);if(S.current&&(S.current.style.transform=`scale(${PT(st,ht)})`),j.current){const K=$T(st,ht);j.current.style.strokeDashoffset=String(ml*(1-K))}const A=Math.ceil((ft-ot)/1e3),H=Math.max(A,1);if(H!==O&&(O=H,g(H)),ht<1)vt=requestAnimationFrame(Q);else{M.current=0;const K=_.current,W=(X.current+1)%K.length;m(W),W===0&&v(rt=>rt+1)}};return vt=requestAnimationFrame(Q),()=>cancelAnimationFrame(vt)},[s,f,a]);const B=et=>{r(!1),d(!1),l(et),m(0),g(et.phases[0].duration),v(0),M.current=0,S.current&&(S.current.style.transition="transform 0.5s ease",S.current.style.transform=`scale(${Ta})`),j.current&&(j.current.style.transition="stroke-dashoffset 0.5s ease",j.current.style.strokeDashoffset=String(ml))},Y=()=>{s||d(!0),r(et=>!et)},J=()=>{r(!1),d(!1),m(0),g(a.phases[0].duration),v(0),M.current=0,S.current&&(S.current.style.transition="transform 0.6s ease",S.current.style.transform=`scale(${Ta})`),j.current&&(j.current.style.transition="stroke-dashoffset 0.6s ease",j.current.style.strokeDashoffset=String(ml))},it=V.map(et=>et.duration).join("-"),q=!c,Z=s?"暂停":q?"开始":"继续",nt=q?"准备开始":N.fullLabel,I=V.length>3;return p.jsxs("div",{className:"bg-root",children:[p.jsx("style",{children:`
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
          font-family: ${no};
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
          stroke-width: ${og};
          opacity: 0.5;
        }
        .bg-arc-progress {
          fill: none;
          stroke: var(--arc-color, #5B9BD5);
          stroke-width: ${og};
          stroke-linecap: round;
        }

        /* 呼吸光球 */
        .bg-orb {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          will-change: transform;
          transform: scale(${Ta});
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
          font-family: ${no};
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
          font-family: ${no};
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
          font-family: ${no};
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
      `}),p.jsxs("div",{className:"bg-header",children:[p.jsx("p",{className:"bg-title",children:"呼吸引导"}),p.jsx("p",{className:"bg-subtitle",children:"选择你当下的状态，开始调整"})]}),p.jsx("div",{className:"bg-state-bar",children:bc.map(et=>p.jsxs("button",{className:`bg-state-btn${a.id===et.id?" active":""}`,style:{"--state-color":et.color,background:a.id===et.id?et.color:void 0},onClick:()=>B(et),children:[p.jsx("span",{className:"bg-state-emoji",children:et.emoji}),p.jsx("span",{children:et.label})]},et.id))}),p.jsxs("div",{className:"bg-arc-area",style:{"--arc-color":a.color,"--aura-color":`${a.color}40`},children:[p.jsx("div",{className:"bg-aura"}),p.jsxs("svg",{className:"bg-arc-svg",viewBox:"0 0 200 200",children:[p.jsx("circle",{className:"bg-arc-track",cx:"100",cy:"100",r:Kc}),p.jsx("circle",{ref:j,className:"bg-arc-progress",cx:"100",cy:"100",r:Kc,strokeDasharray:ml,style:{strokeDashoffset:ml,stroke:a.color}})]}),p.jsx("div",{ref:S,className:"bg-orb",style:{background:`radial-gradient(circle at center, ${a.color}55 0%, ${a.color}22 45%, ${a.color}00 72%)`}}),p.jsxs("div",{className:"bg-center",children:[p.jsx("p",{className:"bg-countdown",children:y}),p.jsx("p",{className:"bg-phase-label",children:nt})]})]}),p.jsx("div",{className:"bg-rhythm",style:{"--arc-color":a.color,gap:I?"14px":"22px","--sep-pos":I?"-8px":"-15px"},children:V.map((et,ft)=>p.jsxs("div",{className:"bg-rhythm-item",children:[p.jsx("span",{className:`bg-rhythm-dot${c&&f===ft?" active":""}`}),p.jsx("span",{className:`bg-rhythm-text${c&&f===ft?" active":""}`,children:et.label})]},ft))}),p.jsxs("div",{className:"bg-mode-info",children:[p.jsx("p",{className:"bg-mode-name",children:a.modeName}),p.jsx("p",{className:"bg-mode-desc",children:a.desc}),p.jsxs("p",{className:"bg-cycle-count",children:[it," 节奏 · 已完成 ",p.jsx("span",{children:x})," 个循环"]})]}),p.jsxs("div",{className:"bg-controls",style:{"--arc-color":a.color},children:[p.jsx("button",{className:"bg-btn bg-btn-start",onClick:Y,children:Z}),p.jsx("button",{className:"bg-btn bg-btn-reset",onClick:J,children:"重置"})]})]})},t4=[1,3,5,10],xc=[{id:"ocean",icon:"🌊",label:"海浪",sub:"Ocean"},{id:"forest",icon:"🌲",label:"森林",sub:"Forest"},{id:"fire",icon:"🔥",label:"篝火",sub:"Fire"},{id:"music",icon:"🎵",label:"音乐",sub:"Music"}],e4=a=>{const l=Math.floor(a/60),s=a%60;return`${String(l).padStart(2,"0")}:${String(s).padStart(2,"0")}`};let pl=null;function n4(){return pl||(pl=new AudioContext),pl.state==="suspended"&&pl.resume(),pl}function a4(a){const l=n4(),s=l.createGain();s.gain.value=.15,s.connect(l.destination);const r=[s],c=()=>{r.forEach(d=>{try{"stop"in d&&typeof d.stop=="function"&&d.stop()}catch{}try{d.disconnect()}catch{}})};try{switch(a){case"ocean":{const d=l.createOscillator();d.type="sine",d.frequency.value=80;const f=l.createGain();f.gain.value=.6,d.connect(f).connect(s),d.start(),r.push(d,f);const m=l.createOscillator();m.type="sine",m.frequency.value=.15;const y=l.createGain();y.gain.value=.4,m.connect(y).connect(f.gain),m.start(),r.push(m,y);break}case"forest":{for(let y=0;y<3;y++){const g=l.createOscillator();g.type="triangle",g.frequency.value=800+y*400;const x=l.createGain();x.gain.value=.15-y*.03,g.connect(x).connect(s),g.start(),r.push(g,x)}const d=l.createOscillator();d.type="sawtooth",d.frequency.value=120;const f=l.createGain();f.gain.value=.05;const m=l.createBiquadFilter();m.type="bandpass",m.frequency.value=600,m.Q.value=.5,d.connect(f).connect(m).connect(s),d.start(),r.push(d,f,m);break}case"fire":{const d=l.createOscillator();d.type="sawtooth",d.frequency.value=60;const f=l.createBiquadFilter();f.type="lowpass",f.frequency.value=200;const m=l.createGain();m.gain.value=.5,d.connect(f).connect(m).connect(s),d.start(),r.push(d,f,m);const y=l.createOscillator();y.type="square",y.frequency.value=30;const g=l.createGain();g.gain.value=.08,y.connect(g).connect(s),y.start(),r.push(y,g);break}case"music":{const d=[261.63,329.63,392,329.63];let f=0;const m=l.createOscillator();m.type="sine",m.frequency.value=d[0];const y=l.createGain();y.gain.value=.4,m.connect(y).connect(s),m.start(),r.push(m,y);const g=setInterval(()=>{f=(f+1)%d.length,m.frequency.setValueAtTime(d[f],l.currentTime)},1200),x=c;return{stop:()=>{clearInterval(g),x()}}}}}catch{}return{stop:c}}const i4=()=>{var J,it;const[a,l]=C.useState("ocean"),[s,r]=C.useState(5),[c,d]=C.useState(!1),[f,m]=C.useState(0),[y,g]=C.useState(!1),[x,v]=C.useState(!1),[S,j]=C.useState(!1),M=C.useRef(null),V=C.useCallback(()=>{M.current&&(M.current.stop(),M.current=null)},[]);C.useEffect(()=>()=>V(),[V]),C.useEffect(()=>{if(!y)return;const q=setInterval(()=>{m(Z=>{if(Z<=1){clearInterval(q),g(!1),v(!0),V();try{const nt=parseInt(localStorage.getItem("meditation_total")||"0",10);localStorage.setItem("meditation_total",String(nt+s*60))}catch{}return 0}return Z-1})},1e3);return()=>clearInterval(q)},[y,s,V]);const N=()=>{v(!1),m(s*60),g(!0),V(),M.current=a4(a)},_=()=>{g(!1),m(0),v(!1),V()},X=()=>{v(!1),m(0)},B=y&&f>0?1-f/(s*60):x?1:0,Y=2*Math.PI*92;return p.jsxs(p.Fragment,{children:[p.jsxs(At.div,{className:"ms-card",initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.4,ease:"easeOut"},children:[p.jsxs("div",{className:"ms-header",children:[p.jsx("h3",{className:"ms-title",children:"冥想空间"}),p.jsx("p",{className:"ms-subtitle",children:"聆听自然，放空思绪"})]}),p.jsxs(Pn,{mode:"wait",children:[!y&&!x&&p.jsxs(At.div,{className:"ms-setup",initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.3},children:[p.jsx("div",{className:"ms-section-label",children:"选择环境音"}),p.jsxs("div",{className:"ms-sound-grid",children:[xc.map(q=>p.jsxs(At.button,{className:`ms-sound-card ${a===q.id?"ms-sound-active":""}`,onClick:()=>l(q.id),whileHover:{scale:1.04},whileTap:{scale:.97},children:[p.jsx("span",{className:"ms-sound-icon",children:q.icon}),p.jsx("span",{className:"ms-sound-label",children:q.label}),p.jsx("span",{className:"ms-sound-sub",children:q.sub})]},q.id)),p.jsxs(At.button,{className:"ms-sound-card ms-sound-coming",onClick:()=>{j(!0),setTimeout(()=>j(!1),8e3)},whileHover:{scale:1.04},whileTap:{scale:.97},children:[p.jsx("span",{className:"ms-sound-icon",children:"✨"}),p.jsx("span",{className:"ms-sound-label",children:"更多音频"}),p.jsx("span",{className:"ms-sound-sub",children:"Coming Soon"})]})]}),p.jsx("div",{className:"ms-section-label",children:"选择时长"}),p.jsx("div",{className:"ms-duration-pills",children:t4.map(q=>p.jsxs("button",{className:`ms-pill ${s===q?"ms-pill-active":""}`,onClick:()=>r(q),children:[q," min"]},q))}),p.jsxs("div",{className:"ms-toggle-row",children:[p.jsx("span",{className:"ms-toggle-label",children:"语音引导"}),p.jsx("button",{className:`ms-toggle-track ${c?"ms-toggle-on":""}`,onClick:()=>d(q=>!q),"aria-label":"语音引导开关",children:p.jsx(At.span,{className:"ms-toggle-thumb",animate:{x:c?18:2},transition:{type:"spring",stiffness:500,damping:30}})})]}),p.jsx(At.button,{className:"ms-start-btn",onClick:N,whileHover:{scale:1.04},whileTap:{scale:.97},children:c?"开始冥想（带引导）":"开始冥想"})]},"setup"),y&&p.jsxs(At.div,{className:"ms-running",initial:{opacity:0,scale:.96},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.96},transition:{duration:.4},children:[p.jsxs(At.div,{className:"ms-active-sound",initial:{opacity:0},animate:{opacity:1},transition:{delay:.2},children:[(J=xc.find(q=>q.id===a))==null?void 0:J.icon," ",(it=xc.find(q=>q.id===a))==null?void 0:it.label,c?" + 语音引导":""]}),p.jsxs("div",{className:"ms-progress-ring",children:[p.jsxs("svg",{className:"ms-ring-svg",viewBox:"0 0 200 200",children:[p.jsx("circle",{className:"ms-ring-bg",cx:"100",cy:"100",r:"92",fill:"none",strokeWidth:"4"}),p.jsx(At.circle,{className:"ms-ring-fill",cx:"100",cy:"100",r:"92",fill:"none",strokeWidth:"4",strokeLinecap:"round",strokeDasharray:Y,initial:{strokeDashoffset:Y},animate:{strokeDashoffset:Y*(1-B)},transition:{duration:1,ease:"linear"},transform:"rotate(-90 100 100)"})]}),p.jsxs("div",{className:"ms-countdown",children:[p.jsx("span",{className:"ms-time",children:e4(f)}),p.jsx("span",{className:"ms-time-label",children:"剩余"})]})]}),p.jsx(At.button,{className:"ms-end-btn",onClick:_,whileHover:{scale:1.04},whileTap:{scale:.97},children:"结束"})]},"running"),x&&p.jsxs(At.div,{className:"ms-completed",initial:{opacity:0,scale:.85},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.85},transition:{duration:.5,ease:"easeOut"},children:[[0,1,2].map(q=>p.jsx(At.div,{className:"ms-ripple",initial:{scale:0,opacity:.5},animate:{scale:3,opacity:0},transition:{duration:2,ease:"easeOut",delay:q*.5,repeat:1/0,repeatDelay:1}},q)),p.jsx("div",{className:"ms-complete-icon",children:"✨"}),p.jsx("p",{className:"ms-complete-label",children:"冥想完成"}),p.jsxs("p",{className:"ms-complete-duration",children:["本次冥想 ",s," 分钟"]}),p.jsx(At.button,{className:"ms-start-btn",onClick:X,whileHover:{scale:1.04},whileTap:{scale:.97},children:"再来一次"})]},"completed")]}),p.jsx("style",{children:`
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
      `})]}),S&&p.jsx("div",{className:"ms-coming-toast","data-testid":"coming-toast",children:"更多精彩音频正在路上，敬请期待！"})]})},l4=[{id:1,avatar:"🌿",nickname:"访客 A",stars:5,content:"呼吸引导的数字倒计时太有安全感了，焦虑的时候点开很管用。",isSeed:!0},{id:2,avatar:"🍂",nickname:"匿名用户",stars:5,content:"配色很舒服，像真的在森林里一样。",isSeed:!0},{id:3,avatar:"🦌",nickname:"林间漫步者",stars:4,content:"希望能增加自定义呼吸时长的功能。",isSeed:!0},{id:4,avatar:"🌙",nickname:"夜猫子",stars:5,content:"感恩日记的 12 月主题很戳我，坚持写了三天了！",isSeed:!0}],rg=["🍃","🌸","🦋","🍄","🌱","🌷","🐦","🦉"],s4=({count:a})=>p.jsx("span",{className:"mb-stars",children:[1,2,3,4,5].map(l=>p.jsx("span",{className:l<=a?"mb-star-filled":"mb-star-empty",children:"★"},l))}),o4=()=>{const[a,l]=C.useState(l4),[s,r]=C.useState(""),[c,d]=C.useState(""),[f,m]=C.useState(!1),y=g=>{if(g.preventDefault(),!c.trim())return;const x=rg[Math.floor(Math.random()*rg.length)],v={id:Date.now(),avatar:x,nickname:s.trim()||"匿名访客",stars:0,content:c.trim()};l(S=>[v,...S]),d(""),r(""),m(!0),window.setTimeout(()=>m(!1),2500)};return p.jsxs("div",{className:"mb-container",children:[p.jsxs("form",{className:"mb-form",onSubmit:y,children:[p.jsx("h4",{className:"mb-form-title",children:"留下你的感受"}),p.jsx("p",{className:"mb-form-desc",children:"你的只言片语，可能是某个人森林里的一束光。"}),p.jsx("input",{type:"text",className:"mb-input",placeholder:"昵称（可选，留空即匿名）",value:s,onChange:g=>r(g.target.value),maxLength:20}),p.jsx("textarea",{className:"mb-textarea",placeholder:"写下你想说的话…",value:c,onChange:g=>d(g.target.value),maxLength:200,rows:3}),p.jsxs("div",{className:"mb-form-footer",children:[p.jsxs("span",{className:"mb-char-count",children:[c.length,"/200"]}),p.jsx("button",{type:"submit",className:"mb-submit-btn",disabled:!c.trim(),children:"发布留言"})]}),p.jsx(Pn,{children:f&&p.jsx(At.span,{className:"mb-submit-feedback",initial:{opacity:0,y:6},animate:{opacity:1,y:0},exit:{opacity:0,y:6},transition:{duration:.3},children:"已发布 ✨ 感谢你的分享。"})})]}),p.jsxs("div",{className:"mb-reviews-header",children:[p.jsx("h4",{className:"mb-reviews-title",children:"来自访客的留言"}),p.jsxs("span",{className:"mb-reviews-count",children:[a.length," 条"]})]}),p.jsx("div",{className:"mb-reviews-grid",children:p.jsx(Pn,{initial:!1,children:a.map((g,x)=>p.jsxs(At.div,{className:`mb-review-card${g.isSeed?"":" mb-review-user"}`,initial:g.isSeed?{opacity:0,y:16}:{opacity:0,y:-12,scale:.96},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,scale:.95},transition:{duration:.4,delay:g.isSeed?x*.1:0},whileHover:{y:-3,boxShadow:"0 8px 24px -6px rgba(60,80,60,0.15)"},children:[p.jsxs("div",{className:"mb-review-top",children:[p.jsx("div",{className:"mb-review-avatar",children:g.avatar}),p.jsxs("div",{className:"mb-review-info",children:[p.jsxs("span",{className:"mb-review-name",children:[g.nickname,!g.isSeed&&p.jsx("span",{className:"mb-review-tag",children:"新"})]}),g.stars>0&&p.jsx(s4,{count:g.stars})]})]}),p.jsx("p",{className:"mb-review-text",children:g.content})]},g.id))})}),p.jsx("style",{children:`
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
      `})]})},r4=()=>p.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[p.jsx("rect",{x:"3",y:"2",width:"14",height:"16",rx:"2",stroke:"currentColor",strokeWidth:"1.4"}),p.jsx("line",{x1:"3",y1:"6",x2:"17",y2:"6",stroke:"currentColor",strokeWidth:"1.2"}),p.jsx("line",{x1:"6",y1:"10",x2:"14",y2:"10",stroke:"currentColor",strokeWidth:"1",opacity:"0.5"}),p.jsx("line",{x1:"6",y1:"13",x2:"12",y2:"13",stroke:"currentColor",strokeWidth:"1",opacity:"0.5"})]}),u4=()=>p.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[p.jsx("circle",{cx:"10",cy:"10",r:"6",stroke:"currentColor",strokeWidth:"1.4"}),p.jsx("circle",{cx:"10",cy:"10",r:"3",stroke:"currentColor",strokeWidth:"1",opacity:"0.5"})]}),c4=()=>p.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[p.jsx("circle",{cx:"10",cy:"6",r:"2.5",stroke:"currentColor",strokeWidth:"1.4"}),p.jsx("path",{d:"M4 16C4 13 6.5 11 10 11C13.5 11 16 13 16 16",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"}),p.jsx("path",{d:"M6 11L4 8M14 11L16 8",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",opacity:"0.5"})]}),f4=()=>p.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[p.jsx("rect",{x:"3",y:"3",width:"14",height:"12",rx:"2",stroke:"currentColor",strokeWidth:"1.4"}),p.jsx("path",{d:"M7 15V18M13 15V18",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),p.jsx("path",{d:"M6 8H14M6 11H11",stroke:"currentColor",strokeWidth:"1",opacity:"0.5",strokeLinecap:"round"})]}),d4=[{id:"journal",label:"感恩日记",subtitle:"Gratitude Journal",icon:p.jsx(r4,{})},{id:"breathing",label:"呼吸引导",subtitle:"Breathing Guide",icon:p.jsx(u4,{})},{id:"meditation",label:"冥想空间",subtitle:"Meditation Space",icon:p.jsx(c4,{})},{id:"board",label:"留言板",subtitle:"Message Board",icon:p.jsx(f4,{})}],h4=()=>{const[a,l]=C.useState("journal");return p.jsxs("div",{className:"lab-wrapper",children:[p.jsxs("div",{className:"lab-layout",children:[p.jsx("nav",{className:"lab-nav",children:d4.map(s=>p.jsxs("button",{className:`lab-nav-item ${a===s.id?"lab-nav-active":""}`,onClick:()=>l(s.id),children:[p.jsx("span",{className:"lab-nav-icon",children:s.icon}),p.jsxs("span",{className:"lab-nav-text",children:[p.jsx("span",{className:"lab-nav-label",children:s.label}),p.jsx("span",{className:"lab-nav-sub",children:s.subtitle})]}),a===s.id&&p.jsx(At.span,{className:"lab-nav-indicator",layoutId:"lab-nav-indicator",transition:{duration:.3,ease:"easeOut"}})]},s.id))}),p.jsx("div",{className:"lab-content",children:p.jsx(Pn,{mode:"wait",children:p.jsxs(At.div,{className:"lab-content-inner",initial:{opacity:0,x:20},animate:{opacity:1,x:0},exit:{opacity:0,x:-20},transition:{duration:.3,ease:"easeOut"},children:[a==="journal"&&p.jsx(WT,{}),a==="breathing"&&p.jsx(IT,{}),a==="meditation"&&p.jsx(i4,{}),a==="board"&&p.jsx(o4,{})]},a)})})]}),p.jsx("style",{children:`
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
      `})]})},m4=a=>Array.from({length:a},()=>({left:Math.random()*100,delay:Math.random()*8,duration:10+Math.random()*8,size:2+Math.random()*3,drift:(Math.random()-.5)*40})),p4=()=>{const{isNight:a}=Ef(),s=typeof window<"u"&&window.innerWidth<768?4:8,r=C.useMemo(()=>m4(s),[s]);return p.jsxs("div",{className:"dyn-bg","aria-hidden":"true",children:[p.jsx("div",{className:"dyn-layer dyn-layer-base"}),p.jsx("div",{className:"dyn-layer dyn-layer-far"}),p.jsx("div",{className:"dyn-layer dyn-layer-mid"}),p.jsx("div",{className:"dyn-layer dyn-layer-front",children:r.map((c,d)=>p.jsx("span",{className:`dyn-particle ${a?"dyn-firefly":"dyn-dust"}`,style:{left:`${c.left}%`,width:`${c.size}px`,height:`${c.size}px`,animationDelay:`${c.delay}s`,animationDuration:`${c.duration}s`,"--drift":`${c.drift}px`}},d))}),p.jsx("style",{children:`
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
      `})]})},ug=.12,g4=5e3,y4=()=>{const[a,l]=C.useState(!1),[s,r]=C.useState(!1),c=C.useRef({x:0,y:0,rotation:0}),d=C.useRef({x:0,y:0,rotation:0}),f=C.useRef(Date.now()),m=C.useRef(0),y=C.useRef(0),g=C.useRef(null),x=S=>S?!!S.closest('a, button, input, textarea, select, [role="button"], [data-cursor="hover"]'):!1,v=C.useCallback(S=>{d.current={x:S.clientX,y:S.clientY,rotation:0},f.current=Date.now(),l(!0);const j=document.elementFromPoint(S.clientX,S.clientY);r(x(j))},[]);return C.useEffect(()=>{const S=()=>{const j=c.current,M=d.current;if(Date.now()-f.current>g4){y.current+=.015;const B=Math.sin(y.current)*15,Y=Math.cos(y.current*.7)*10;M.x=d.current.x+B,M.y=d.current.y+Y}else y.current=0;j.x+=(M.x-j.x)*ug,j.y+=(M.y-j.y)*ug;const _=M.x-j.x,X=M.y-j.y;(Math.abs(_)>1||Math.abs(X)>1)&&(j.rotation=Math.atan2(X,_)*(180/Math.PI)*.15),g.current&&(g.current.style.transform=`translate3d(${j.x-12}px, ${j.y-12}px, 0) rotate(${j.rotation}deg)`),m.current=requestAnimationFrame(S)};return m.current=requestAnimationFrame(S),()=>cancelAnimationFrame(m.current)},[]),C.useEffect(()=>{if(!(window.innerWidth<768||matchMedia("(pointer: coarse)").matches))return document.addEventListener("mousemove",v),document.addEventListener("mouseleave",()=>l(!1)),()=>{document.removeEventListener("mousemove",v)}},[v]),a?p.jsxs("div",{ref:g,className:"butterfly-cursor","aria-hidden":"true",children:[p.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[p.jsxs("g",{className:`bf-wing bf-wing-left ${s?"bf-fast":""}`,children:[p.jsx("ellipse",{cx:"7",cy:"9",rx:"5",ry:"4.5",fill:"rgba(122,154,130,0.35)",stroke:"rgba(90,74,66,0.4)",strokeWidth:"0.6"}),p.jsx("ellipse",{cx:"7",cy:"15",rx:"3.5",ry:"3",fill:"rgba(122,154,130,0.25)",stroke:"rgba(90,74,66,0.3)",strokeWidth:"0.5"})]}),p.jsxs("g",{className:`bf-wing bf-wing-right ${s?"bf-fast":""}`,children:[p.jsx("ellipse",{cx:"17",cy:"9",rx:"5",ry:"4.5",fill:"rgba(122,154,130,0.35)",stroke:"rgba(90,74,66,0.4)",strokeWidth:"0.6"}),p.jsx("ellipse",{cx:"17",cy:"15",rx:"3.5",ry:"3",fill:"rgba(122,154,130,0.25)",stroke:"rgba(90,74,66,0.3)",strokeWidth:"0.5"})]}),p.jsx("ellipse",{cx:"12",cy:"12",rx:"1",ry:"6",fill:"rgba(90,74,66,0.7)"}),p.jsx("path",{d:"M11 6.5C10.5 5 10 4 9.5 3.5",stroke:"rgba(90,74,66,0.5)",strokeWidth:"0.5",strokeLinecap:"round"}),p.jsx("path",{d:"M13 6.5C13.5 5 14 4 14.5 3.5",stroke:"rgba(90,74,66,0.5)",strokeWidth:"0.5",strokeLinecap:"round"})]}),p.jsx("style",{children:`
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
      `})]}):null},gl={initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-80px"},transition:{duration:.6,ease:"easeOut"}},yl=[{emoji:"📖",name:"阅读",desc:"最近在读《思考，快与慢》，丹尼尔·卡尼曼的经典之作。",detail:"金句摘录：我们对我们所知的东西的信心，远远超过了我们所知的东西。"},{emoji:"📸",name:"摄影",desc:"喜欢用镜头捕捉森林里的光影，记录转瞬即逝的自然之美。",detail:"设备：Sony A7C + 28-60mm，偏爱自然光与胶片色调。"},{emoji:"🎧",name:"音乐/播客",desc:"播客重度用户，最喜欢「声东击西」和「日谈公园」。",detail:"音乐偏好：后摇、古典、氛围电子。最近单曲循环坂本龙一。"},{emoji:"🏃",name:"运动",desc:`每周跑步 3 次，配速 5'30"，享受奔跑时的心流状态。`,detail:"Keep 累计 300+ km，最佳半马 1:58:32。"},{emoji:"🧘",name:"冥想",desc:"每天 10 分钟正念冥想，已坚持 200+ 天。",detail:"使用 Headspace 引导，偏爱身体扫描与呼吸觉察。"},{emoji:"📺",name:"追剧",desc:"剧迷一枚，最近在追《重启人生》和《繁花》。",detail:"品味：日剧 > 韩剧 > 国剧。最爱《深夜食堂》系列。"}],b4=["产品规划","用户研究","需求分析","原型设计","数据分析","AI 应用","项目管理","跨部门协作","竞品分析","增长策略"],x4=()=>{const{isNight:a,toggleTheme:l}=Ef(),[s,r]=C.useState("home"),[c,d]=C.useState(!1),f=C.useRef(null),[m,y]=C.useState(null),g=C.useCallback(S=>{f.current=S},[]);C.useEffect(()=>{const j=new URLSearchParams(window.location.search).get("mode")==="full";d(j),document.title=j?"路俊玲 | AI 产品经理作品集":"森林疗愈室"},[]),C.useEffect(()=>{const S=c?["home","about","projects","lab"]:["home","lab"],j=new IntersectionObserver(M=>{M.forEach(V=>{V.isIntersecting&&r(V.target.id)})},{rootMargin:"-40% 0px -50% 0px"});return S.forEach(M=>{const V=document.getElementById(M);V&&j.observe(V)}),()=>j.disconnect()},[c]);const x=S=>{const j=document.getElementById(S);j&&j.scrollIntoView({behavior:"smooth"})},v=()=>{const S=document.getElementById("projects");S&&(S.scrollIntoView({behavior:"smooth"}),setTimeout(()=>{var j;return(j=f.current)==null?void 0:j.call(f)},800))};return p.jsxs("div",{className:"page-overlay",children:[p.jsx(p4,{}),p.jsx(y4,{}),p.jsx(zT,{current:s,onNavigate:x,isNight:a,onToggleTheme:l,isFullMode:c}),p.jsxs("section",{id:"home",className:"hero-section min-h-screen flex flex-col justify-center px-6 md:px-24 max-w-4xl mx-auto",children:[p.jsx("div",{className:"hero-overlay"}),p.jsx(At.div,{...gl,className:"hero-content",children:c?p.jsxs(p.Fragment,{children:[p.jsx("p",{className:"text-sm mb-4 tracking-widest uppercase",style:{color:"var(--accent)"},children:"AI Product Manager"}),p.jsx("h1",{className:"hero-title text-5xl md:text-6xl mb-6",style:{fontFamily:'"Noto Serif SC", serif'},children:"路俊玲"}),p.jsx("p",{className:"hero-sub text-xl md:text-2xl mb-4",style:{maxWidth:"520px"},children:"Building Human-Centric AI Products"}),p.jsx("p",{className:"hero-body text-base max-w-xl leading-relaxed mb-10",children:"从软件工程的代码世界出发，逐渐走向 AI 产品的舞台。 相信好的产品源自对人的理解——技术是手段，温柔才是底色。"}),p.jsxs("div",{className:"hero-buttons",children:[p.jsx("button",{onClick:()=>x("about"),className:"hero-btn hero-btn-primary",children:"了解更多"}),p.jsx("button",{onClick:v,className:"hero-btn hero-btn-outline",children:"翻阅我的作品 📖"})]})]}):p.jsxs(p.Fragment,{children:[p.jsx("p",{className:"text-sm mb-4 tracking-widest uppercase",style:{color:"var(--accent)"},children:"Forest Healing Room"}),p.jsx("h1",{className:"hero-title text-5xl md:text-6xl mb-6",style:{fontFamily:'"Noto Serif SC", serif'},children:"森林疗愈室"}),p.jsx("p",{className:"hero-sub text-xl md:text-2xl mb-4",style:{maxWidth:"520px"},children:"在这里，每一次呼吸都有人同在"}),p.jsx("p",{className:"hero-body text-base max-w-xl leading-relaxed mb-6",children:"一个安静的角落，为你准备了呼吸引导、冥想空间和感恩日记。"}),p.jsxs("div",{className:"social-proof",children:[p.jsxs("p",{className:"social-proof-main",children:["已陪伴 ",p.jsx("span",{className:"social-proof-num",children:"1000+"})," 位朋友找到平静"]}),p.jsx("p",{className:"social-proof-sub",children:"每一次呼吸，都有人同在。"})]}),p.jsx("div",{className:"hero-buttons",children:p.jsx("button",{onClick:()=>x("lab"),className:"hero-btn hero-btn-primary",children:"进入疗愈室"})})]})}),p.jsx("style",{children:`
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
        `})]}),c&&p.jsxs(p.Fragment,{children:[p.jsxs("section",{id:"about",className:"min-h-screen px-6 md:px-24 max-w-5xl mx-auto py-24",children:[p.jsx(At.div,{...gl,className:"about-module",children:p.jsxs("div",{className:"about-module-inner about-pro",children:[p.jsxs("div",{className:"about-pro-left",children:[p.jsx("h2",{className:"about-section-title",children:"我的专业能力"}),p.jsx("p",{className:"about-pro-intro",children:"专注于 AI 产品落地与人性化设计。从需求洞察到产品上线， 擅长将复杂技术转化为用户可感知的价值。"}),p.jsx("div",{className:"about-edu",children:p.jsxs("div",{className:"about-edu-item",children:[p.jsx("p",{className:"about-edu-school",children:"河南工学院"}),p.jsx("p",{className:"about-edu-detail",children:"本科 · 软件工程"})]})})]}),p.jsxs("div",{className:"about-pro-right",children:[p.jsx("p",{className:"about-label",children:"核心技能"}),p.jsx("div",{className:"about-skill-cloud",children:b4.map(S=>p.jsx(At.span,{className:"about-skill-tag",whileHover:{scale:1.08},transition:{duration:.2},children:S},S))})]})]})}),p.jsxs(At.div,{...gl,className:"about-module",style:{marginTop:48},children:[p.jsx("h3",{className:"about-section-title",style:{marginBottom:20},children:"生活切面"}),p.jsx("div",{className:"about-hobby-grid",children:yl.map((S,j)=>p.jsxs(At.div,{className:"about-hobby-card",whileHover:{y:-4,boxShadow:"0 12px 32px -8px rgba(60,80,60,0.2)"},transition:{duration:.25},onClick:()=>y(j),children:[p.jsx("div",{className:"about-hobby-emoji",children:S.emoji}),p.jsx("div",{className:"about-hobby-label",children:S.name})]},S.name))})]}),p.jsx(Pn,{children:m!==null&&p.jsx(At.div,{className:"about-lightbox-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>y(null),children:p.jsxs(At.div,{className:"about-lightbox",initial:{scale:.92,y:30},animate:{scale:1,y:0},exit:{scale:.92,y:30},transition:{duration:.3,ease:"easeOut"},onClick:S=>S.stopPropagation(),children:[p.jsx("button",{className:"about-lightbox-close",onClick:()=>y(null),children:"×"}),p.jsx("div",{className:"about-lightbox-icon",children:yl[m].emoji}),p.jsx("h3",{className:"about-lightbox-name",children:yl[m].name}),p.jsx("p",{className:"about-lightbox-desc",children:yl[m].desc}),p.jsxs("div",{className:"about-lightbox-detail",children:[p.jsx("p",{className:"about-lightbox-detail-label",children:"更多细节"}),p.jsx("p",{className:"about-lightbox-detail-text",children:yl[m].detail})]})]})})}),p.jsx("style",{children:`
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
        `})]}),p.jsxs("section",{id:"projects",className:"min-h-screen px-6 md:px-24 max-w-5xl mx-auto py-24",children:[p.jsxs(At.div,{...gl,children:[p.jsx("h2",{className:"text-3xl md:text-4xl mb-4",style:{fontFamily:'"Noto Serif SC", serif'},children:"项目集"}),p.jsx("p",{className:"text-base mb-2 max-w-xl",style:{color:"var(--text-soft)"},children:"翻开这本树叶书，每一页都是一段实践的印记。"})]}),p.jsx(_T,{registerOpenBook:g})]})]}),p.jsxs("section",{id:"lab",className:"min-h-screen px-6 md:px-24 max-w-5xl mx-auto py-24",children:[p.jsxs(At.div,{...gl,children:[p.jsx("h2",{className:"text-3xl md:text-4xl mb-4",style:{fontFamily:'"Noto Serif SC", serif'},children:"疗愈室"}),p.jsx("p",{className:"text-base mb-2 max-w-xl",style:{color:"var(--text-soft)"},children:"四个实验性的自我疗愈工具，在快节奏的产品工作中保持内心的平静。"})]}),p.jsx(h4,{})]}),p.jsxs("footer",{className:"py-12 px-6 text-center",style:{borderTop:"1px solid var(--border)"},children:[p.jsx("p",{className:"text-sm",style:{color:"var(--text-soft)"},children:"© 2026 路俊玲 · Building Human-Centric AI Products"}),p.jsx("p",{className:"text-xs mt-2",style:{color:"var(--text-soft)"},children:"junling@example.com"})]})]})},v4=()=>p.jsx(NT,{children:p.jsx(x4,{})});Dv.createRoot(document.getElementById("root")).render(p.jsx(C.StrictMode,{children:p.jsx(v4,{})}));
