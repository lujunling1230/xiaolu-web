(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))l(c);new MutationObserver(c=>{for(const f of c)if(f.type==="childList")for(const p of f.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&l(p)}).observe(document,{childList:!0,subtree:!0});function o(c){const f={};return c.integrity&&(f.integrity=c.integrity),c.referrerPolicy&&(f.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?f.credentials="include":c.crossOrigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function l(c){if(c.ep)return;c.ep=!0;const f=o(c);fetch(c.href,f)}})();var $u={exports:{}},Yr={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var eg;function $2(){if(eg)return Yr;eg=1;var a=Symbol.for("react.transitional.element"),i=Symbol.for("react.fragment");function o(l,c,f){var p=null;if(f!==void 0&&(p=""+f),c.key!==void 0&&(p=""+c.key),"key"in c){f={};for(var m in c)m!=="key"&&(f[m]=c[m])}else f=c;return c=f.ref,{$$typeof:a,type:l,key:p,ref:c!==void 0?c:null,props:f}}return Yr.Fragment=i,Yr.jsx=o,Yr.jsxs=o,Yr}var tg;function Z2(){return tg||(tg=1,$u.exports=$2()),$u.exports}var s=Z2(),Zu={exports:{}},he={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ag;function Q2(){if(ag)return he;ag=1;var a=Symbol.for("react.transitional.element"),i=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),l=Symbol.for("react.strict_mode"),c=Symbol.for("react.profiler"),f=Symbol.for("react.consumer"),p=Symbol.for("react.context"),m=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),b=Symbol.for("react.lazy"),y=Symbol.for("react.activity"),x=Symbol.iterator;function w(D){return D===null||typeof D!="object"?null:(D=x&&D[x]||D["@@iterator"],typeof D=="function"?D:null)}var S={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},N=Object.assign,C={};function T(D,$,ae){this.props=D,this.context=$,this.refs=C,this.updater=ae||S}T.prototype.isReactComponent={},T.prototype.setState=function(D,$){if(typeof D!="object"&&typeof D!="function"&&D!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,D,$,"setState")},T.prototype.forceUpdate=function(D){this.updater.enqueueForceUpdate(this,D,"forceUpdate")};function z(){}z.prototype=T.prototype;function E(D,$,ae){this.props=D,this.context=$,this.refs=C,this.updater=ae||S}var A=E.prototype=new z;A.constructor=E,N(A,T.prototype),A.isPureReactComponent=!0;var R=Array.isArray;function B(){}var _={H:null,A:null,T:null,S:null},W=Object.prototype.hasOwnProperty;function ne(D,$,ae){var re=ae.ref;return{$$typeof:a,type:D,key:$,ref:re!==void 0?re:null,props:ae}}function H(D,$){return ne(D.type,$,D.props)}function F(D){return typeof D=="object"&&D!==null&&D.$$typeof===a}function Q(D){var $={"=":"=0",":":"=2"};return"$"+D.replace(/[=:]/g,function(ae){return $[ae]})}var K=/\/+/g;function te(D,$){return typeof D=="object"&&D!==null&&D.key!=null?Q(""+D.key):$.toString(36)}function le(D){switch(D.status){case"fulfilled":return D.value;case"rejected":throw D.reason;default:switch(typeof D.status=="string"?D.then(B,B):(D.status="pending",D.then(function($){D.status==="pending"&&(D.status="fulfilled",D.value=$)},function($){D.status==="pending"&&(D.status="rejected",D.reason=$)})),D.status){case"fulfilled":return D.value;case"rejected":throw D.reason}}throw D}function q(D,$,ae,re,pe){var be=typeof D;(be==="undefined"||be==="boolean")&&(D=null);var ze=!1;if(D===null)ze=!0;else switch(be){case"bigint":case"string":case"number":ze=!0;break;case"object":switch(D.$$typeof){case a:case i:ze=!0;break;case b:return ze=D._init,q(ze(D._payload),$,ae,re,pe)}}if(ze)return pe=pe(D),ze=re===""?"."+te(D,0):re,R(pe)?(ae="",ze!=null&&(ae=ze.replace(K,"$&/")+"/"),q(pe,$,ae,"",function(Qi){return Qi})):pe!=null&&(F(pe)&&(pe=H(pe,ae+(pe.key==null||D&&D.key===pe.key?"":(""+pe.key).replace(K,"$&/")+"/")+ze)),$.push(pe)),1;ze=0;var mt=re===""?".":re+":";if(R(D))for(var Ie=0;Ie<D.length;Ie++)re=D[Ie],be=mt+te(re,Ie),ze+=q(re,$,ae,be,pe);else if(Ie=w(D),typeof Ie=="function")for(D=Ie.call(D),Ie=0;!(re=D.next()).done;)re=re.value,be=mt+te(re,Ie++),ze+=q(re,$,ae,be,pe);else if(be==="object"){if(typeof D.then=="function")return q(le(D),$,ae,re,pe);throw $=String(D),Error("Objects are not valid as a React child (found: "+($==="[object Object]"?"object with keys {"+Object.keys(D).join(", ")+"}":$)+"). If you meant to render a collection of children, use an array instead.")}return ze}function ee(D,$,ae){if(D==null)return D;var re=[],pe=0;return q(D,re,"","",function(be){return $.call(ae,be,pe++)}),re}function ie(D){if(D._status===-1){var $=D._result;$=$(),$.then(function(ae){(D._status===0||D._status===-1)&&(D._status=1,D._result=ae)},function(ae){(D._status===0||D._status===-1)&&(D._status=2,D._result=ae)}),D._status===-1&&(D._status=0,D._result=$)}if(D._status===1)return D._result.default;throw D._result}var fe=typeof reportError=="function"?reportError:function(D){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var $=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof D=="object"&&D!==null&&typeof D.message=="string"?String(D.message):String(D),error:D});if(!window.dispatchEvent($))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",D);return}console.error(D)},ye={map:ee,forEach:function(D,$,ae){ee(D,function(){$.apply(this,arguments)},ae)},count:function(D){var $=0;return ee(D,function(){$++}),$},toArray:function(D){return ee(D,function($){return $})||[]},only:function(D){if(!F(D))throw Error("React.Children.only expected to receive a single React element child.");return D}};return he.Activity=y,he.Children=ye,he.Component=T,he.Fragment=o,he.Profiler=c,he.PureComponent=E,he.StrictMode=l,he.Suspense=h,he.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=_,he.__COMPILER_RUNTIME={__proto__:null,c:function(D){return _.H.useMemoCache(D)}},he.cache=function(D){return function(){return D.apply(null,arguments)}},he.cacheSignal=function(){return null},he.cloneElement=function(D,$,ae){if(D==null)throw Error("The argument must be a React element, but you passed "+D+".");var re=N({},D.props),pe=D.key;if($!=null)for(be in $.key!==void 0&&(pe=""+$.key),$)!W.call($,be)||be==="key"||be==="__self"||be==="__source"||be==="ref"&&$.ref===void 0||(re[be]=$[be]);var be=arguments.length-2;if(be===1)re.children=ae;else if(1<be){for(var ze=Array(be),mt=0;mt<be;mt++)ze[mt]=arguments[mt+2];re.children=ze}return ne(D.type,pe,re)},he.createContext=function(D){return D={$$typeof:p,_currentValue:D,_currentValue2:D,_threadCount:0,Provider:null,Consumer:null},D.Provider=D,D.Consumer={$$typeof:f,_context:D},D},he.createElement=function(D,$,ae){var re,pe={},be=null;if($!=null)for(re in $.key!==void 0&&(be=""+$.key),$)W.call($,re)&&re!=="key"&&re!=="__self"&&re!=="__source"&&(pe[re]=$[re]);var ze=arguments.length-2;if(ze===1)pe.children=ae;else if(1<ze){for(var mt=Array(ze),Ie=0;Ie<ze;Ie++)mt[Ie]=arguments[Ie+2];pe.children=mt}if(D&&D.defaultProps)for(re in ze=D.defaultProps,ze)pe[re]===void 0&&(pe[re]=ze[re]);return ne(D,be,pe)},he.createRef=function(){return{current:null}},he.forwardRef=function(D){return{$$typeof:m,render:D}},he.isValidElement=F,he.lazy=function(D){return{$$typeof:b,_payload:{_status:-1,_result:D},_init:ie}},he.memo=function(D,$){return{$$typeof:g,type:D,compare:$===void 0?null:$}},he.startTransition=function(D){var $=_.T,ae={};_.T=ae;try{var re=D(),pe=_.S;pe!==null&&pe(ae,re),typeof re=="object"&&re!==null&&typeof re.then=="function"&&re.then(B,fe)}catch(be){fe(be)}finally{$!==null&&ae.types!==null&&($.types=ae.types),_.T=$}},he.unstable_useCacheRefresh=function(){return _.H.useCacheRefresh()},he.use=function(D){return _.H.use(D)},he.useActionState=function(D,$,ae){return _.H.useActionState(D,$,ae)},he.useCallback=function(D,$){return _.H.useCallback(D,$)},he.useContext=function(D){return _.H.useContext(D)},he.useDebugValue=function(){},he.useDeferredValue=function(D,$){return _.H.useDeferredValue(D,$)},he.useEffect=function(D,$){return _.H.useEffect(D,$)},he.useEffectEvent=function(D){return _.H.useEffectEvent(D)},he.useId=function(){return _.H.useId()},he.useImperativeHandle=function(D,$,ae){return _.H.useImperativeHandle(D,$,ae)},he.useInsertionEffect=function(D,$){return _.H.useInsertionEffect(D,$)},he.useLayoutEffect=function(D,$){return _.H.useLayoutEffect(D,$)},he.useMemo=function(D,$){return _.H.useMemo(D,$)},he.useOptimistic=function(D,$){return _.H.useOptimistic(D,$)},he.useReducer=function(D,$,ae){return _.H.useReducer(D,$,ae)},he.useRef=function(D){return _.H.useRef(D)},he.useState=function(D){return _.H.useState(D)},he.useSyncExternalStore=function(D,$,ae){return _.H.useSyncExternalStore(D,$,ae)},he.useTransition=function(){return _.H.useTransition()},he.version="19.2.7",he}var ng;function pf(){return ng||(ng=1,Zu.exports=Q2()),Zu.exports}var j=pf(),Qu={exports:{}},Fr={},Ku={exports:{}},Wu={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ig;function K2(){return ig||(ig=1,(function(a){function i(q,ee){var ie=q.length;q.push(ee);e:for(;0<ie;){var fe=ie-1>>>1,ye=q[fe];if(0<c(ye,ee))q[fe]=ee,q[ie]=ye,ie=fe;else break e}}function o(q){return q.length===0?null:q[0]}function l(q){if(q.length===0)return null;var ee=q[0],ie=q.pop();if(ie!==ee){q[0]=ie;e:for(var fe=0,ye=q.length,D=ye>>>1;fe<D;){var $=2*(fe+1)-1,ae=q[$],re=$+1,pe=q[re];if(0>c(ae,ie))re<ye&&0>c(pe,ae)?(q[fe]=pe,q[re]=ie,fe=re):(q[fe]=ae,q[$]=ie,fe=$);else if(re<ye&&0>c(pe,ie))q[fe]=pe,q[re]=ie,fe=re;else break e}}return ee}function c(q,ee){var ie=q.sortIndex-ee.sortIndex;return ie!==0?ie:q.id-ee.id}if(a.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var f=performance;a.unstable_now=function(){return f.now()}}else{var p=Date,m=p.now();a.unstable_now=function(){return p.now()-m}}var h=[],g=[],b=1,y=null,x=3,w=!1,S=!1,N=!1,C=!1,T=typeof setTimeout=="function"?setTimeout:null,z=typeof clearTimeout=="function"?clearTimeout:null,E=typeof setImmediate<"u"?setImmediate:null;function A(q){for(var ee=o(g);ee!==null;){if(ee.callback===null)l(g);else if(ee.startTime<=q)l(g),ee.sortIndex=ee.expirationTime,i(h,ee);else break;ee=o(g)}}function R(q){if(N=!1,A(q),!S)if(o(h)!==null)S=!0,B||(B=!0,Q());else{var ee=o(g);ee!==null&&le(R,ee.startTime-q)}}var B=!1,_=-1,W=5,ne=-1;function H(){return C?!0:!(a.unstable_now()-ne<W)}function F(){if(C=!1,B){var q=a.unstable_now();ne=q;var ee=!0;try{e:{S=!1,N&&(N=!1,z(_),_=-1),w=!0;var ie=x;try{t:{for(A(q),y=o(h);y!==null&&!(y.expirationTime>q&&H());){var fe=y.callback;if(typeof fe=="function"){y.callback=null,x=y.priorityLevel;var ye=fe(y.expirationTime<=q);if(q=a.unstable_now(),typeof ye=="function"){y.callback=ye,A(q),ee=!0;break t}y===o(h)&&l(h),A(q)}else l(h);y=o(h)}if(y!==null)ee=!0;else{var D=o(g);D!==null&&le(R,D.startTime-q),ee=!1}}break e}finally{y=null,x=ie,w=!1}ee=void 0}}finally{ee?Q():B=!1}}}var Q;if(typeof E=="function")Q=function(){E(F)};else if(typeof MessageChannel<"u"){var K=new MessageChannel,te=K.port2;K.port1.onmessage=F,Q=function(){te.postMessage(null)}}else Q=function(){T(F,0)};function le(q,ee){_=T(function(){q(a.unstable_now())},ee)}a.unstable_IdlePriority=5,a.unstable_ImmediatePriority=1,a.unstable_LowPriority=4,a.unstable_NormalPriority=3,a.unstable_Profiling=null,a.unstable_UserBlockingPriority=2,a.unstable_cancelCallback=function(q){q.callback=null},a.unstable_forceFrameRate=function(q){0>q||125<q?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):W=0<q?Math.floor(1e3/q):5},a.unstable_getCurrentPriorityLevel=function(){return x},a.unstable_next=function(q){switch(x){case 1:case 2:case 3:var ee=3;break;default:ee=x}var ie=x;x=ee;try{return q()}finally{x=ie}},a.unstable_requestPaint=function(){C=!0},a.unstable_runWithPriority=function(q,ee){switch(q){case 1:case 2:case 3:case 4:case 5:break;default:q=3}var ie=x;x=q;try{return ee()}finally{x=ie}},a.unstable_scheduleCallback=function(q,ee,ie){var fe=a.unstable_now();switch(typeof ie=="object"&&ie!==null?(ie=ie.delay,ie=typeof ie=="number"&&0<ie?fe+ie:fe):ie=fe,q){case 1:var ye=-1;break;case 2:ye=250;break;case 5:ye=1073741823;break;case 4:ye=1e4;break;default:ye=5e3}return ye=ie+ye,q={id:b++,callback:ee,priorityLevel:q,startTime:ie,expirationTime:ye,sortIndex:-1},ie>fe?(q.sortIndex=ie,i(g,q),o(h)===null&&q===o(g)&&(N?(z(_),_=-1):N=!0,le(R,ie-fe))):(q.sortIndex=ye,i(h,q),S||w||(S=!0,B||(B=!0,Q()))),q},a.unstable_shouldYield=H,a.unstable_wrapCallback=function(q){var ee=x;return function(){var ie=x;x=ee;try{return q.apply(this,arguments)}finally{x=ie}}}})(Wu)),Wu}var rg;function W2(){return rg||(rg=1,Ku.exports=K2()),Ku.exports}var Ju={exports:{}},pt={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var sg;function J2(){if(sg)return pt;sg=1;var a=pf();function i(h){var g="https://react.dev/errors/"+h;if(1<arguments.length){g+="?args[]="+encodeURIComponent(arguments[1]);for(var b=2;b<arguments.length;b++)g+="&args[]="+encodeURIComponent(arguments[b])}return"Minified React error #"+h+"; visit "+g+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function o(){}var l={d:{f:o,r:function(){throw Error(i(522))},D:o,C:o,L:o,m:o,X:o,S:o,M:o},p:0,findDOMNode:null},c=Symbol.for("react.portal");function f(h,g,b){var y=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:c,key:y==null?null:""+y,children:h,containerInfo:g,implementation:b}}var p=a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function m(h,g){if(h==="font")return"";if(typeof g=="string")return g==="use-credentials"?g:""}return pt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=l,pt.createPortal=function(h,g){var b=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!g||g.nodeType!==1&&g.nodeType!==9&&g.nodeType!==11)throw Error(i(299));return f(h,g,null,b)},pt.flushSync=function(h){var g=p.T,b=l.p;try{if(p.T=null,l.p=2,h)return h()}finally{p.T=g,l.p=b,l.d.f()}},pt.preconnect=function(h,g){typeof h=="string"&&(g?(g=g.crossOrigin,g=typeof g=="string"?g==="use-credentials"?g:"":void 0):g=null,l.d.C(h,g))},pt.prefetchDNS=function(h){typeof h=="string"&&l.d.D(h)},pt.preinit=function(h,g){if(typeof h=="string"&&g&&typeof g.as=="string"){var b=g.as,y=m(b,g.crossOrigin),x=typeof g.integrity=="string"?g.integrity:void 0,w=typeof g.fetchPriority=="string"?g.fetchPriority:void 0;b==="style"?l.d.S(h,typeof g.precedence=="string"?g.precedence:void 0,{crossOrigin:y,integrity:x,fetchPriority:w}):b==="script"&&l.d.X(h,{crossOrigin:y,integrity:x,fetchPriority:w,nonce:typeof g.nonce=="string"?g.nonce:void 0})}},pt.preinitModule=function(h,g){if(typeof h=="string")if(typeof g=="object"&&g!==null){if(g.as==null||g.as==="script"){var b=m(g.as,g.crossOrigin);l.d.M(h,{crossOrigin:b,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0})}}else g==null&&l.d.M(h)},pt.preload=function(h,g){if(typeof h=="string"&&typeof g=="object"&&g!==null&&typeof g.as=="string"){var b=g.as,y=m(b,g.crossOrigin);l.d.L(h,b,{crossOrigin:y,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,type:typeof g.type=="string"?g.type:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0,referrerPolicy:typeof g.referrerPolicy=="string"?g.referrerPolicy:void 0,imageSrcSet:typeof g.imageSrcSet=="string"?g.imageSrcSet:void 0,imageSizes:typeof g.imageSizes=="string"?g.imageSizes:void 0,media:typeof g.media=="string"?g.media:void 0})}},pt.preloadModule=function(h,g){if(typeof h=="string")if(g){var b=m(g.as,g.crossOrigin);l.d.m(h,{as:typeof g.as=="string"&&g.as!=="script"?g.as:void 0,crossOrigin:b,integrity:typeof g.integrity=="string"?g.integrity:void 0})}else l.d.m(h)},pt.requestFormReset=function(h){l.d.r(h)},pt.unstable_batchedUpdates=function(h,g){return h(g)},pt.useFormState=function(h,g,b){return p.H.useFormState(h,g,b)},pt.useFormStatus=function(){return p.H.useHostTransitionStatus()},pt.version="19.2.7",pt}var og;function e5(){if(og)return Ju.exports;og=1;function a(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)}catch(i){console.error(i)}}return a(),Ju.exports=J2(),Ju.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var lg;function t5(){if(lg)return Fr;lg=1;var a=W2(),i=pf(),o=e5();function l(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function c(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function f(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function p(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function m(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function h(e){if(f(e)!==e)throw Error(l(188))}function g(e){var t=e.alternate;if(!t){if(t=f(e),t===null)throw Error(l(188));return t!==e?null:e}for(var n=e,r=t;;){var u=n.return;if(u===null)break;var d=u.alternate;if(d===null){if(r=u.return,r!==null){n=r;continue}break}if(u.child===d.child){for(d=u.child;d;){if(d===n)return h(u),e;if(d===r)return h(u),t;d=d.sibling}throw Error(l(188))}if(n.return!==r.return)n=u,r=d;else{for(var v=!1,k=u.child;k;){if(k===n){v=!0,n=u,r=d;break}if(k===r){v=!0,r=u,n=d;break}k=k.sibling}if(!v){for(k=d.child;k;){if(k===n){v=!0,n=d,r=u;break}if(k===r){v=!0,r=d,n=u;break}k=k.sibling}if(!v)throw Error(l(189))}}if(n.alternate!==r)throw Error(l(190))}if(n.tag!==3)throw Error(l(188));return n.stateNode.current===n?e:t}function b(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=b(e),t!==null)return t;e=e.sibling}return null}var y=Object.assign,x=Symbol.for("react.element"),w=Symbol.for("react.transitional.element"),S=Symbol.for("react.portal"),N=Symbol.for("react.fragment"),C=Symbol.for("react.strict_mode"),T=Symbol.for("react.profiler"),z=Symbol.for("react.consumer"),E=Symbol.for("react.context"),A=Symbol.for("react.forward_ref"),R=Symbol.for("react.suspense"),B=Symbol.for("react.suspense_list"),_=Symbol.for("react.memo"),W=Symbol.for("react.lazy"),ne=Symbol.for("react.activity"),H=Symbol.for("react.memo_cache_sentinel"),F=Symbol.iterator;function Q(e){return e===null||typeof e!="object"?null:(e=F&&e[F]||e["@@iterator"],typeof e=="function"?e:null)}var K=Symbol.for("react.client.reference");function te(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===K?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case N:return"Fragment";case T:return"Profiler";case C:return"StrictMode";case R:return"Suspense";case B:return"SuspenseList";case ne:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case S:return"Portal";case E:return e.displayName||"Context";case z:return(e._context.displayName||"Context")+".Consumer";case A:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case _:return t=e.displayName||null,t!==null?t:te(e.type)||"Memo";case W:t=e._payload,e=e._init;try{return te(e(t))}catch{}}return null}var le=Array.isArray,q=i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ee=o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ie={pending:!1,data:null,method:null,action:null},fe=[],ye=-1;function D(e){return{current:e}}function $(e){0>ye||(e.current=fe[ye],fe[ye]=null,ye--)}function ae(e,t){ye++,fe[ye]=e.current,e.current=t}var re=D(null),pe=D(null),be=D(null),ze=D(null);function mt(e,t){switch(ae(be,t),ae(pe,e),ae(re,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?wm(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=wm(t),e=km(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}$(re),ae(re,e)}function Ie(){$(re),$(pe),$(be)}function Qi(e){e.memoizedState!==null&&ae(ze,e);var t=re.current,n=km(t,e.type);t!==n&&(ae(pe,e),ae(re,n))}function ms(e){pe.current===e&&($(re),$(pe)),ze.current===e&&($(ze),_r._currentValue=ie)}var Ml,Jf;function jn(e){if(Ml===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);Ml=t&&t[1]||"",Jf=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ml+e+Jf}var Al=!1;function Rl(e,t){if(!e||Al)return"";Al=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var Z=function(){throw Error()};if(Object.defineProperty(Z.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(Z,[])}catch(Y){var G=Y}Reflect.construct(e,[],Z)}else{try{Z.call()}catch(Y){G=Y}e.call(Z.prototype)}}else{try{throw Error()}catch(Y){G=Y}(Z=e())&&typeof Z.catch=="function"&&Z.catch(function(){})}}catch(Y){if(Y&&G&&typeof Y.stack=="string")return[Y.stack,G.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var d=r.DetermineComponentFrameRoot(),v=d[0],k=d[1];if(v&&k){var M=v.split(`
`),V=k.split(`
`);for(u=r=0;r<M.length&&!M[r].includes("DetermineComponentFrameRoot");)r++;for(;u<V.length&&!V[u].includes("DetermineComponentFrameRoot");)u++;if(r===M.length||u===V.length)for(r=M.length-1,u=V.length-1;1<=r&&0<=u&&M[r]!==V[u];)u--;for(;1<=r&&0<=u;r--,u--)if(M[r]!==V[u]){if(r!==1||u!==1)do if(r--,u--,0>u||M[r]!==V[u]){var I=`
`+M[r].replace(" at new "," at ");return e.displayName&&I.includes("<anonymous>")&&(I=I.replace("<anonymous>",e.displayName)),I}while(1<=r&&0<=u);break}}}finally{Al=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?jn(n):""}function N1(e,t){switch(e.tag){case 26:case 27:case 5:return jn(e.type);case 16:return jn("Lazy");case 13:return e.child!==t&&t!==null?jn("Suspense Fallback"):jn("Suspense");case 19:return jn("SuspenseList");case 0:case 15:return Rl(e.type,!1);case 11:return Rl(e.type.render,!1);case 1:return Rl(e.type,!0);case 31:return jn("Activity");default:return""}}function ep(e){try{var t="",n=null;do t+=N1(e,n),n=e,e=e.return;while(e);return t}catch(r){return`
Error generating stack: `+r.message+`
`+r.stack}}var Dl=Object.prototype.hasOwnProperty,Ol=a.unstable_scheduleCallback,Ll=a.unstable_cancelCallback,C1=a.unstable_shouldYield,T1=a.unstable_requestPaint,Tt=a.unstable_now,E1=a.unstable_getCurrentPriorityLevel,tp=a.unstable_ImmediatePriority,ap=a.unstable_UserBlockingPriority,gs=a.unstable_NormalPriority,z1=a.unstable_LowPriority,np=a.unstable_IdlePriority,M1=a.log,A1=a.unstable_setDisableYieldValue,Ki=null,Et=null;function Ha(e){if(typeof M1=="function"&&A1(e),Et&&typeof Et.setStrictMode=="function")try{Et.setStrictMode(Ki,e)}catch{}}var zt=Math.clz32?Math.clz32:O1,R1=Math.log,D1=Math.LN2;function O1(e){return e>>>=0,e===0?32:31-(R1(e)/D1|0)|0}var xs=256,ys=262144,bs=4194304;function Sn(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function vs(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var u=0,d=e.suspendedLanes,v=e.pingedLanes;e=e.warmLanes;var k=r&134217727;return k!==0?(r=k&~d,r!==0?u=Sn(r):(v&=k,v!==0?u=Sn(v):n||(n=k&~e,n!==0&&(u=Sn(n))))):(k=r&~d,k!==0?u=Sn(k):v!==0?u=Sn(v):n||(n=r&~e,n!==0&&(u=Sn(n)))),u===0?0:t!==0&&t!==u&&(t&d)===0&&(d=u&-u,n=t&-t,d>=n||d===32&&(n&4194048)!==0)?t:u}function Wi(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function L1(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ip(){var e=bs;return bs<<=1,(bs&62914560)===0&&(bs=4194304),e}function Bl(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Ji(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function B1(e,t,n,r,u,d){var v=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var k=e.entanglements,M=e.expirationTimes,V=e.hiddenUpdates;for(n=v&~n;0<n;){var I=31-zt(n),Z=1<<I;k[I]=0,M[I]=-1;var G=V[I];if(G!==null)for(V[I]=null,I=0;I<G.length;I++){var Y=G[I];Y!==null&&(Y.lane&=-536870913)}n&=~Z}r!==0&&rp(e,r,0),d!==0&&u===0&&e.tag!==0&&(e.suspendedLanes|=d&~(v&~t))}function rp(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-zt(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function sp(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-zt(n),u=1<<r;u&t|e[r]&t&&(e[r]|=t),n&=~u}}function op(e,t){var n=t&-t;return n=(n&42)!==0?1:Ul(n),(n&(e.suspendedLanes|t))!==0?0:n}function Ul(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Vl(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function lp(){var e=ee.p;return e!==0?e:(e=window.event,e===void 0?32:Pm(e.type))}function cp(e,t){var n=ee.p;try{return ee.p=e,t()}finally{ee.p=n}}var Ga=Math.random().toString(36).slice(2),st="__reactFiber$"+Ga,bt="__reactProps$"+Ga,Zn="__reactContainer$"+Ga,_l="__reactEvents$"+Ga,U1="__reactListeners$"+Ga,V1="__reactHandles$"+Ga,up="__reactResources$"+Ga,er="__reactMarker$"+Ga;function ql(e){delete e[st],delete e[bt],delete e[_l],delete e[U1],delete e[V1]}function Qn(e){var t=e[st];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Zn]||n[st]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Am(e);e!==null;){if(n=e[st])return n;e=Am(e)}return t}e=n,n=e.parentNode}return null}function Kn(e){if(e=e[st]||e[Zn]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function tr(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(l(33))}function Wn(e){var t=e[up];return t||(t=e[up]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function tt(e){e[er]=!0}var dp=new Set,fp={};function wn(e,t){Jn(e,t),Jn(e+"Capture",t)}function Jn(e,t){for(fp[e]=t,e=0;e<t.length;e++)dp.add(t[e])}var _1=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),pp={},hp={};function q1(e){return Dl.call(hp,e)?!0:Dl.call(pp,e)?!1:_1.test(e)?hp[e]=!0:(pp[e]=!0,!1)}function js(e,t,n){if(q1(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var r=t.toLowerCase().slice(0,5);if(r!=="data-"&&r!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function Ss(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function va(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+r)}}function Vt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function mp(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function H1(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var u=r.get,d=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return u.call(this)},set:function(v){n=""+v,d.call(this,v)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(v){n=""+v},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Hl(e){if(!e._valueTracker){var t=mp(e)?"checked":"value";e._valueTracker=H1(e,t,""+e[t])}}function gp(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=mp(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function ws(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var G1=/[\n"\\]/g;function _t(e){return e.replace(G1,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Gl(e,t,n,r,u,d,v,k){e.name="",v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"?e.type=v:e.removeAttribute("type"),t!=null?v==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Vt(t)):e.value!==""+Vt(t)&&(e.value=""+Vt(t)):v!=="submit"&&v!=="reset"||e.removeAttribute("value"),t!=null?Yl(e,v,Vt(t)):n!=null?Yl(e,v,Vt(n)):r!=null&&e.removeAttribute("value"),u==null&&d!=null&&(e.defaultChecked=!!d),u!=null&&(e.checked=u&&typeof u!="function"&&typeof u!="symbol"),k!=null&&typeof k!="function"&&typeof k!="symbol"&&typeof k!="boolean"?e.name=""+Vt(k):e.removeAttribute("name")}function xp(e,t,n,r,u,d,v,k){if(d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"&&(e.type=d),t!=null||n!=null){if(!(d!=="submit"&&d!=="reset"||t!=null)){Hl(e);return}n=n!=null?""+Vt(n):"",t=t!=null?""+Vt(t):n,k||t===e.value||(e.value=t),e.defaultValue=t}r=r??u,r=typeof r!="function"&&typeof r!="symbol"&&!!r,e.checked=k?e.checked:!!r,e.defaultChecked=!!r,v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"&&(e.name=v),Hl(e)}function Yl(e,t,n){t==="number"&&ws(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function ei(e,t,n,r){if(e=e.options,t){t={};for(var u=0;u<n.length;u++)t["$"+n[u]]=!0;for(n=0;n<e.length;n++)u=t.hasOwnProperty("$"+e[n].value),e[n].selected!==u&&(e[n].selected=u),u&&r&&(e[n].defaultSelected=!0)}else{for(n=""+Vt(n),t=null,u=0;u<e.length;u++){if(e[u].value===n){e[u].selected=!0,r&&(e[u].defaultSelected=!0);return}t!==null||e[u].disabled||(t=e[u])}t!==null&&(t.selected=!0)}}function yp(e,t,n){if(t!=null&&(t=""+Vt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+Vt(n):""}function bp(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(l(92));if(le(r)){if(1<r.length)throw Error(l(93));r=r[0]}n=r}n==null&&(n=""),t=n}n=Vt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==""&&r!==null&&(e.value=r),Hl(e)}function ti(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Y1=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function vp(e,t,n){var r=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?r?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":r?e.setProperty(t,n):typeof n!="number"||n===0||Y1.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function jp(e,t,n){if(t!=null&&typeof t!="object")throw Error(l(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf("--")===0?e.setProperty(r,""):r==="float"?e.cssFloat="":e[r]="");for(var u in t)r=t[u],t.hasOwnProperty(u)&&n[u]!==r&&vp(e,u,r)}else for(var d in t)t.hasOwnProperty(d)&&vp(e,d,t[d])}function Fl(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var F1=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),I1=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function ks(e){return I1.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function ja(){}var Il=null;function Xl(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var ai=null,ni=null;function Sp(e){var t=Kn(e);if(t&&(e=t.stateNode)){var n=e[bt]||null;e:switch(e=t.stateNode,t.type){case"input":if(Gl(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+_t(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var u=r[bt]||null;if(!u)throw Error(l(90));Gl(r,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&gp(r)}break e;case"textarea":yp(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&ei(e,!!n.multiple,t,!1)}}}var Pl=!1;function wp(e,t,n){if(Pl)return e(t,n);Pl=!0;try{var r=e(t);return r}finally{if(Pl=!1,(ai!==null||ni!==null)&&(fo(),ai&&(t=ai,e=ni,ni=ai=null,Sp(t),e)))for(t=0;t<e.length;t++)Sp(e[t])}}function ar(e,t){var n=e.stateNode;if(n===null)return null;var r=n[bt]||null;if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(l(231,t,typeof n));return n}var Sa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),$l=!1;if(Sa)try{var nr={};Object.defineProperty(nr,"passive",{get:function(){$l=!0}}),window.addEventListener("test",nr,nr),window.removeEventListener("test",nr,nr)}catch{$l=!1}var Ya=null,Zl=null,Ns=null;function kp(){if(Ns)return Ns;var e,t=Zl,n=t.length,r,u="value"in Ya?Ya.value:Ya.textContent,d=u.length;for(e=0;e<n&&t[e]===u[e];e++);var v=n-e;for(r=1;r<=v&&t[n-r]===u[d-r];r++);return Ns=u.slice(e,1<r?1-r:void 0)}function Cs(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ts(){return!0}function Np(){return!1}function vt(e){function t(n,r,u,d,v){this._reactName=n,this._targetInst=u,this.type=r,this.nativeEvent=d,this.target=v,this.currentTarget=null;for(var k in e)e.hasOwnProperty(k)&&(n=e[k],this[k]=n?n(d):d[k]);return this.isDefaultPrevented=(d.defaultPrevented!=null?d.defaultPrevented:d.returnValue===!1)?Ts:Np,this.isPropagationStopped=Np,this}return y(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ts)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ts)},persist:function(){},isPersistent:Ts}),t}var kn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Es=vt(kn),ir=y({},kn,{view:0,detail:0}),X1=vt(ir),Ql,Kl,rr,zs=y({},ir,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Jl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==rr&&(rr&&e.type==="mousemove"?(Ql=e.screenX-rr.screenX,Kl=e.screenY-rr.screenY):Kl=Ql=0,rr=e),Ql)},movementY:function(e){return"movementY"in e?e.movementY:Kl}}),Cp=vt(zs),P1=y({},zs,{dataTransfer:0}),$1=vt(P1),Z1=y({},ir,{relatedTarget:0}),Wl=vt(Z1),Q1=y({},kn,{animationName:0,elapsedTime:0,pseudoElement:0}),K1=vt(Q1),W1=y({},kn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),J1=vt(W1),ev=y({},kn,{data:0}),Tp=vt(ev),tv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},av={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},nv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function iv(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=nv[e])?!!t[e]:!1}function Jl(){return iv}var rv=y({},ir,{key:function(e){if(e.key){var t=tv[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Cs(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?av[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Jl,charCode:function(e){return e.type==="keypress"?Cs(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Cs(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),sv=vt(rv),ov=y({},zs,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Ep=vt(ov),lv=y({},ir,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Jl}),cv=vt(lv),uv=y({},kn,{propertyName:0,elapsedTime:0,pseudoElement:0}),dv=vt(uv),fv=y({},zs,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),pv=vt(fv),hv=y({},kn,{newState:0,oldState:0}),mv=vt(hv),gv=[9,13,27,32],ec=Sa&&"CompositionEvent"in window,sr=null;Sa&&"documentMode"in document&&(sr=document.documentMode);var xv=Sa&&"TextEvent"in window&&!sr,zp=Sa&&(!ec||sr&&8<sr&&11>=sr),Mp=" ",Ap=!1;function Rp(e,t){switch(e){case"keyup":return gv.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Dp(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var ii=!1;function yv(e,t){switch(e){case"compositionend":return Dp(t);case"keypress":return t.which!==32?null:(Ap=!0,Mp);case"textInput":return e=t.data,e===Mp&&Ap?null:e;default:return null}}function bv(e,t){if(ii)return e==="compositionend"||!ec&&Rp(e,t)?(e=kp(),Ns=Zl=Ya=null,ii=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return zp&&t.locale!=="ko"?null:t.data;default:return null}}var vv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Op(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!vv[e.type]:t==="textarea"}function Lp(e,t,n,r){ai?ni?ni.push(r):ni=[r]:ai=r,t=bo(t,"onChange"),0<t.length&&(n=new Es("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var or=null,lr=null;function jv(e){xm(e,0)}function Ms(e){var t=tr(e);if(gp(t))return e}function Bp(e,t){if(e==="change")return t}var Up=!1;if(Sa){var tc;if(Sa){var ac="oninput"in document;if(!ac){var Vp=document.createElement("div");Vp.setAttribute("oninput","return;"),ac=typeof Vp.oninput=="function"}tc=ac}else tc=!1;Up=tc&&(!document.documentMode||9<document.documentMode)}function _p(){or&&(or.detachEvent("onpropertychange",qp),lr=or=null)}function qp(e){if(e.propertyName==="value"&&Ms(lr)){var t=[];Lp(t,lr,e,Xl(e)),wp(jv,t)}}function Sv(e,t,n){e==="focusin"?(_p(),or=t,lr=n,or.attachEvent("onpropertychange",qp)):e==="focusout"&&_p()}function wv(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ms(lr)}function kv(e,t){if(e==="click")return Ms(t)}function Nv(e,t){if(e==="input"||e==="change")return Ms(t)}function Cv(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Mt=typeof Object.is=="function"?Object.is:Cv;function cr(e,t){if(Mt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var u=n[r];if(!Dl.call(t,u)||!Mt(e[u],t[u]))return!1}return!0}function Hp(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Gp(e,t){var n=Hp(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Hp(n)}}function Yp(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Yp(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Fp(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=ws(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=ws(e.document)}return t}function nc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Tv=Sa&&"documentMode"in document&&11>=document.documentMode,ri=null,ic=null,ur=null,rc=!1;function Ip(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;rc||ri==null||ri!==ws(r)||(r=ri,"selectionStart"in r&&nc(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),ur&&cr(ur,r)||(ur=r,r=bo(ic,"onSelect"),0<r.length&&(t=new Es("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=ri)))}function Nn(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var si={animationend:Nn("Animation","AnimationEnd"),animationiteration:Nn("Animation","AnimationIteration"),animationstart:Nn("Animation","AnimationStart"),transitionrun:Nn("Transition","TransitionRun"),transitionstart:Nn("Transition","TransitionStart"),transitioncancel:Nn("Transition","TransitionCancel"),transitionend:Nn("Transition","TransitionEnd")},sc={},Xp={};Sa&&(Xp=document.createElement("div").style,"AnimationEvent"in window||(delete si.animationend.animation,delete si.animationiteration.animation,delete si.animationstart.animation),"TransitionEvent"in window||delete si.transitionend.transition);function Cn(e){if(sc[e])return sc[e];if(!si[e])return e;var t=si[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Xp)return sc[e]=t[n];return e}var Pp=Cn("animationend"),$p=Cn("animationiteration"),Zp=Cn("animationstart"),Ev=Cn("transitionrun"),zv=Cn("transitionstart"),Mv=Cn("transitioncancel"),Qp=Cn("transitionend"),Kp=new Map,oc="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");oc.push("scrollEnd");function ta(e,t){Kp.set(e,t),wn(t,[e])}var As=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},qt=[],oi=0,lc=0;function Rs(){for(var e=oi,t=lc=oi=0;t<e;){var n=qt[t];qt[t++]=null;var r=qt[t];qt[t++]=null;var u=qt[t];qt[t++]=null;var d=qt[t];if(qt[t++]=null,r!==null&&u!==null){var v=r.pending;v===null?u.next=u:(u.next=v.next,v.next=u),r.pending=u}d!==0&&Wp(n,u,d)}}function Ds(e,t,n,r){qt[oi++]=e,qt[oi++]=t,qt[oi++]=n,qt[oi++]=r,lc|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function cc(e,t,n,r){return Ds(e,t,n,r),Os(e)}function Tn(e,t){return Ds(e,null,null,t),Os(e)}function Wp(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var u=!1,d=e.return;d!==null;)d.childLanes|=n,r=d.alternate,r!==null&&(r.childLanes|=n),d.tag===22&&(e=d.stateNode,e===null||e._visibility&1||(u=!0)),e=d,d=d.return;return e.tag===3?(d=e.stateNode,u&&t!==null&&(u=31-zt(n),e=d.hiddenUpdates,r=e[u],r===null?e[u]=[t]:r.push(t),t.lane=n|536870912),d):null}function Os(e){if(50<Rr)throw Rr=0,yu=null,Error(l(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var li={};function Av(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function At(e,t,n,r){return new Av(e,t,n,r)}function uc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function wa(e,t){var n=e.alternate;return n===null?(n=At(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Jp(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Ls(e,t,n,r,u,d){var v=0;if(r=e,typeof e=="function")uc(e)&&(v=1);else if(typeof e=="string")v=B2(e,n,re.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case ne:return e=At(31,n,t,u),e.elementType=ne,e.lanes=d,e;case N:return En(n.children,u,d,t);case C:v=8,u|=24;break;case T:return e=At(12,n,t,u|2),e.elementType=T,e.lanes=d,e;case R:return e=At(13,n,t,u),e.elementType=R,e.lanes=d,e;case B:return e=At(19,n,t,u),e.elementType=B,e.lanes=d,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case E:v=10;break e;case z:v=9;break e;case A:v=11;break e;case _:v=14;break e;case W:v=16,r=null;break e}v=29,n=Error(l(130,e===null?"null":typeof e,"")),r=null}return t=At(v,n,t,u),t.elementType=e,t.type=r,t.lanes=d,t}function En(e,t,n,r){return e=At(7,e,r,t),e.lanes=n,e}function dc(e,t,n){return e=At(6,e,null,t),e.lanes=n,e}function e0(e){var t=At(18,null,null,0);return t.stateNode=e,t}function fc(e,t,n){return t=At(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var t0=new WeakMap;function Ht(e,t){if(typeof e=="object"&&e!==null){var n=t0.get(e);return n!==void 0?n:(t={value:e,source:t,stack:ep(t)},t0.set(e,t),t)}return{value:e,source:t,stack:ep(t)}}var ci=[],ui=0,Bs=null,dr=0,Gt=[],Yt=0,Fa=null,ua=1,da="";function ka(e,t){ci[ui++]=dr,ci[ui++]=Bs,Bs=e,dr=t}function a0(e,t,n){Gt[Yt++]=ua,Gt[Yt++]=da,Gt[Yt++]=Fa,Fa=e;var r=ua;e=da;var u=32-zt(r)-1;r&=~(1<<u),n+=1;var d=32-zt(t)+u;if(30<d){var v=u-u%5;d=(r&(1<<v)-1).toString(32),r>>=v,u-=v,ua=1<<32-zt(t)+u|n<<u|r,da=d+e}else ua=1<<d|n<<u|r,da=e}function pc(e){e.return!==null&&(ka(e,1),a0(e,1,0))}function hc(e){for(;e===Bs;)Bs=ci[--ui],ci[ui]=null,dr=ci[--ui],ci[ui]=null;for(;e===Fa;)Fa=Gt[--Yt],Gt[Yt]=null,da=Gt[--Yt],Gt[Yt]=null,ua=Gt[--Yt],Gt[Yt]=null}function n0(e,t){Gt[Yt++]=ua,Gt[Yt++]=da,Gt[Yt++]=Fa,ua=t.id,da=t.overflow,Fa=e}var ot=null,Ve=null,ke=!1,Ia=null,Ft=!1,mc=Error(l(519));function Xa(e){var t=Error(l(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw fr(Ht(t,e)),mc}function i0(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[st]=e,t[bt]=r,n){case"dialog":je("cancel",t),je("close",t);break;case"iframe":case"object":case"embed":je("load",t);break;case"video":case"audio":for(n=0;n<Or.length;n++)je(Or[n],t);break;case"source":je("error",t);break;case"img":case"image":case"link":je("error",t),je("load",t);break;case"details":je("toggle",t);break;case"input":je("invalid",t),xp(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case"select":je("invalid",t);break;case"textarea":je("invalid",t),bp(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||r.suppressHydrationWarning===!0||jm(t.textContent,n)?(r.popover!=null&&(je("beforetoggle",t),je("toggle",t)),r.onScroll!=null&&je("scroll",t),r.onScrollEnd!=null&&je("scrollend",t),r.onClick!=null&&(t.onclick=ja),t=!0):t=!1,t||Xa(e,!0)}function r0(e){for(ot=e.return;ot;)switch(ot.tag){case 5:case 31:case 13:Ft=!1;return;case 27:case 3:Ft=!0;return;default:ot=ot.return}}function di(e){if(e!==ot)return!1;if(!ke)return r0(e),ke=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||Du(e.type,e.memoizedProps)),n=!n),n&&Ve&&Xa(e),r0(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(l(317));Ve=Mm(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(l(317));Ve=Mm(e)}else t===27?(t=Ve,on(e.type)?(e=Vu,Vu=null,Ve=e):Ve=t):Ve=ot?Xt(e.stateNode.nextSibling):null;return!0}function zn(){Ve=ot=null,ke=!1}function gc(){var e=Ia;return e!==null&&(kt===null?kt=e:kt.push.apply(kt,e),Ia=null),e}function fr(e){Ia===null?Ia=[e]:Ia.push(e)}var xc=D(null),Mn=null,Na=null;function Pa(e,t,n){ae(xc,t._currentValue),t._currentValue=n}function Ca(e){e._currentValue=xc.current,$(xc)}function yc(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function bc(e,t,n,r){var u=e.child;for(u!==null&&(u.return=e);u!==null;){var d=u.dependencies;if(d!==null){var v=u.child;d=d.firstContext;e:for(;d!==null;){var k=d;d=u;for(var M=0;M<t.length;M++)if(k.context===t[M]){d.lanes|=n,k=d.alternate,k!==null&&(k.lanes|=n),yc(d.return,n,e),r||(v=null);break e}d=k.next}}else if(u.tag===18){if(v=u.return,v===null)throw Error(l(341));v.lanes|=n,d=v.alternate,d!==null&&(d.lanes|=n),yc(v,n,e),v=null}else v=u.child;if(v!==null)v.return=u;else for(v=u;v!==null;){if(v===e){v=null;break}if(u=v.sibling,u!==null){u.return=v.return,v=u;break}v=v.return}u=v}}function fi(e,t,n,r){e=null;for(var u=t,d=!1;u!==null;){if(!d){if((u.flags&524288)!==0)d=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var v=u.alternate;if(v===null)throw Error(l(387));if(v=v.memoizedProps,v!==null){var k=u.type;Mt(u.pendingProps.value,v.value)||(e!==null?e.push(k):e=[k])}}else if(u===ze.current){if(v=u.alternate,v===null)throw Error(l(387));v.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(e!==null?e.push(_r):e=[_r])}u=u.return}e!==null&&bc(t,e,n,r),t.flags|=262144}function Us(e){for(e=e.firstContext;e!==null;){if(!Mt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function An(e){Mn=e,Na=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function lt(e){return s0(Mn,e)}function Vs(e,t){return Mn===null&&An(e),s0(e,t)}function s0(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Na===null){if(e===null)throw Error(l(308));Na=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Na=Na.next=t;return n}var Rv=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,r){e.push(r)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},Dv=a.unstable_scheduleCallback,Ov=a.unstable_NormalPriority,$e={$$typeof:E,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function vc(){return{controller:new Rv,data:new Map,refCount:0}}function pr(e){e.refCount--,e.refCount===0&&Dv(Ov,function(){e.controller.abort()})}var hr=null,jc=0,pi=0,hi=null;function Lv(e,t){if(hr===null){var n=hr=[];jc=0,pi=ku(),hi={status:"pending",value:void 0,then:function(r){n.push(r)}}}return jc++,t.then(o0,o0),t}function o0(){if(--jc===0&&hr!==null){hi!==null&&(hi.status="fulfilled");var e=hr;hr=null,pi=0,hi=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Bv(e,t){var n=[],r={status:"pending",value:null,reason:null,then:function(u){n.push(u)}};return e.then(function(){r.status="fulfilled",r.value=t;for(var u=0;u<n.length;u++)(0,n[u])(t)},function(u){for(r.status="rejected",r.reason=u,u=0;u<n.length;u++)(0,n[u])(void 0)}),r}var l0=q.S;q.S=function(e,t){Ih=Tt(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Lv(e,t),l0!==null&&l0(e,t)};var Rn=D(null);function Sc(){var e=Rn.current;return e!==null?e:Le.pooledCache}function _s(e,t){t===null?ae(Rn,Rn.current):ae(Rn,t.pool)}function c0(){var e=Sc();return e===null?null:{parent:$e._currentValue,pool:e}}var mi=Error(l(460)),wc=Error(l(474)),qs=Error(l(542)),Hs={then:function(){}};function u0(e){return e=e.status,e==="fulfilled"||e==="rejected"}function d0(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(ja,ja),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,p0(e),e;default:if(typeof t.status=="string")t.then(ja,ja);else{if(e=Le,e!==null&&100<e.shellSuspendCounter)throw Error(l(482));e=t,e.status="pending",e.then(function(r){if(t.status==="pending"){var u=t;u.status="fulfilled",u.value=r}},function(r){if(t.status==="pending"){var u=t;u.status="rejected",u.reason=r}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,p0(e),e}throw On=t,mi}}function Dn(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(On=n,mi):n}}var On=null;function f0(){if(On===null)throw Error(l(459));var e=On;return On=null,e}function p0(e){if(e===mi||e===qs)throw Error(l(483))}var gi=null,mr=0;function Gs(e){var t=mr;return mr+=1,gi===null&&(gi=[]),d0(gi,e,t)}function gr(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Ys(e,t){throw t.$$typeof===x?Error(l(525)):(e=Object.prototype.toString.call(t),Error(l(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function h0(e){function t(L,O){if(e){var U=L.deletions;U===null?(L.deletions=[O],L.flags|=16):U.push(O)}}function n(L,O){if(!e)return null;for(;O!==null;)t(L,O),O=O.sibling;return null}function r(L){for(var O=new Map;L!==null;)L.key!==null?O.set(L.key,L):O.set(L.index,L),L=L.sibling;return O}function u(L,O){return L=wa(L,O),L.index=0,L.sibling=null,L}function d(L,O,U){return L.index=U,e?(U=L.alternate,U!==null?(U=U.index,U<O?(L.flags|=67108866,O):U):(L.flags|=67108866,O)):(L.flags|=1048576,O)}function v(L){return e&&L.alternate===null&&(L.flags|=67108866),L}function k(L,O,U,P){return O===null||O.tag!==6?(O=dc(U,L.mode,P),O.return=L,O):(O=u(O,U),O.return=L,O)}function M(L,O,U,P){var ue=U.type;return ue===N?I(L,O,U.props.children,P,U.key):O!==null&&(O.elementType===ue||typeof ue=="object"&&ue!==null&&ue.$$typeof===W&&Dn(ue)===O.type)?(O=u(O,U.props),gr(O,U),O.return=L,O):(O=Ls(U.type,U.key,U.props,null,L.mode,P),gr(O,U),O.return=L,O)}function V(L,O,U,P){return O===null||O.tag!==4||O.stateNode.containerInfo!==U.containerInfo||O.stateNode.implementation!==U.implementation?(O=fc(U,L.mode,P),O.return=L,O):(O=u(O,U.children||[]),O.return=L,O)}function I(L,O,U,P,ue){return O===null||O.tag!==7?(O=En(U,L.mode,P,ue),O.return=L,O):(O=u(O,U),O.return=L,O)}function Z(L,O,U){if(typeof O=="string"&&O!==""||typeof O=="number"||typeof O=="bigint")return O=dc(""+O,L.mode,U),O.return=L,O;if(typeof O=="object"&&O!==null){switch(O.$$typeof){case w:return U=Ls(O.type,O.key,O.props,null,L.mode,U),gr(U,O),U.return=L,U;case S:return O=fc(O,L.mode,U),O.return=L,O;case W:return O=Dn(O),Z(L,O,U)}if(le(O)||Q(O))return O=En(O,L.mode,U,null),O.return=L,O;if(typeof O.then=="function")return Z(L,Gs(O),U);if(O.$$typeof===E)return Z(L,Vs(L,O),U);Ys(L,O)}return null}function G(L,O,U,P){var ue=O!==null?O.key:null;if(typeof U=="string"&&U!==""||typeof U=="number"||typeof U=="bigint")return ue!==null?null:k(L,O,""+U,P);if(typeof U=="object"&&U!==null){switch(U.$$typeof){case w:return U.key===ue?M(L,O,U,P):null;case S:return U.key===ue?V(L,O,U,P):null;case W:return U=Dn(U),G(L,O,U,P)}if(le(U)||Q(U))return ue!==null?null:I(L,O,U,P,null);if(typeof U.then=="function")return G(L,O,Gs(U),P);if(U.$$typeof===E)return G(L,O,Vs(L,U),P);Ys(L,U)}return null}function Y(L,O,U,P,ue){if(typeof P=="string"&&P!==""||typeof P=="number"||typeof P=="bigint")return L=L.get(U)||null,k(O,L,""+P,ue);if(typeof P=="object"&&P!==null){switch(P.$$typeof){case w:return L=L.get(P.key===null?U:P.key)||null,M(O,L,P,ue);case S:return L=L.get(P.key===null?U:P.key)||null,V(O,L,P,ue);case W:return P=Dn(P),Y(L,O,U,P,ue)}if(le(P)||Q(P))return L=L.get(U)||null,I(O,L,P,ue,null);if(typeof P.then=="function")return Y(L,O,U,Gs(P),ue);if(P.$$typeof===E)return Y(L,O,U,Vs(O,P),ue);Ys(O,P)}return null}function se(L,O,U,P){for(var ue=null,Ce=null,ce=O,ge=O=0,we=null;ce!==null&&ge<U.length;ge++){ce.index>ge?(we=ce,ce=null):we=ce.sibling;var Te=G(L,ce,U[ge],P);if(Te===null){ce===null&&(ce=we);break}e&&ce&&Te.alternate===null&&t(L,ce),O=d(Te,O,ge),Ce===null?ue=Te:Ce.sibling=Te,Ce=Te,ce=we}if(ge===U.length)return n(L,ce),ke&&ka(L,ge),ue;if(ce===null){for(;ge<U.length;ge++)ce=Z(L,U[ge],P),ce!==null&&(O=d(ce,O,ge),Ce===null?ue=ce:Ce.sibling=ce,Ce=ce);return ke&&ka(L,ge),ue}for(ce=r(ce);ge<U.length;ge++)we=Y(ce,L,ge,U[ge],P),we!==null&&(e&&we.alternate!==null&&ce.delete(we.key===null?ge:we.key),O=d(we,O,ge),Ce===null?ue=we:Ce.sibling=we,Ce=we);return e&&ce.forEach(function(fn){return t(L,fn)}),ke&&ka(L,ge),ue}function de(L,O,U,P){if(U==null)throw Error(l(151));for(var ue=null,Ce=null,ce=O,ge=O=0,we=null,Te=U.next();ce!==null&&!Te.done;ge++,Te=U.next()){ce.index>ge?(we=ce,ce=null):we=ce.sibling;var fn=G(L,ce,Te.value,P);if(fn===null){ce===null&&(ce=we);break}e&&ce&&fn.alternate===null&&t(L,ce),O=d(fn,O,ge),Ce===null?ue=fn:Ce.sibling=fn,Ce=fn,ce=we}if(Te.done)return n(L,ce),ke&&ka(L,ge),ue;if(ce===null){for(;!Te.done;ge++,Te=U.next())Te=Z(L,Te.value,P),Te!==null&&(O=d(Te,O,ge),Ce===null?ue=Te:Ce.sibling=Te,Ce=Te);return ke&&ka(L,ge),ue}for(ce=r(ce);!Te.done;ge++,Te=U.next())Te=Y(ce,L,ge,Te.value,P),Te!==null&&(e&&Te.alternate!==null&&ce.delete(Te.key===null?ge:Te.key),O=d(Te,O,ge),Ce===null?ue=Te:Ce.sibling=Te,Ce=Te);return e&&ce.forEach(function(P2){return t(L,P2)}),ke&&ka(L,ge),ue}function Oe(L,O,U,P){if(typeof U=="object"&&U!==null&&U.type===N&&U.key===null&&(U=U.props.children),typeof U=="object"&&U!==null){switch(U.$$typeof){case w:e:{for(var ue=U.key;O!==null;){if(O.key===ue){if(ue=U.type,ue===N){if(O.tag===7){n(L,O.sibling),P=u(O,U.props.children),P.return=L,L=P;break e}}else if(O.elementType===ue||typeof ue=="object"&&ue!==null&&ue.$$typeof===W&&Dn(ue)===O.type){n(L,O.sibling),P=u(O,U.props),gr(P,U),P.return=L,L=P;break e}n(L,O);break}else t(L,O);O=O.sibling}U.type===N?(P=En(U.props.children,L.mode,P,U.key),P.return=L,L=P):(P=Ls(U.type,U.key,U.props,null,L.mode,P),gr(P,U),P.return=L,L=P)}return v(L);case S:e:{for(ue=U.key;O!==null;){if(O.key===ue)if(O.tag===4&&O.stateNode.containerInfo===U.containerInfo&&O.stateNode.implementation===U.implementation){n(L,O.sibling),P=u(O,U.children||[]),P.return=L,L=P;break e}else{n(L,O);break}else t(L,O);O=O.sibling}P=fc(U,L.mode,P),P.return=L,L=P}return v(L);case W:return U=Dn(U),Oe(L,O,U,P)}if(le(U))return se(L,O,U,P);if(Q(U)){if(ue=Q(U),typeof ue!="function")throw Error(l(150));return U=ue.call(U),de(L,O,U,P)}if(typeof U.then=="function")return Oe(L,O,Gs(U),P);if(U.$$typeof===E)return Oe(L,O,Vs(L,U),P);Ys(L,U)}return typeof U=="string"&&U!==""||typeof U=="number"||typeof U=="bigint"?(U=""+U,O!==null&&O.tag===6?(n(L,O.sibling),P=u(O,U),P.return=L,L=P):(n(L,O),P=dc(U,L.mode,P),P.return=L,L=P),v(L)):n(L,O)}return function(L,O,U,P){try{mr=0;var ue=Oe(L,O,U,P);return gi=null,ue}catch(ce){if(ce===mi||ce===qs)throw ce;var Ce=At(29,ce,null,L.mode);return Ce.lanes=P,Ce.return=L,Ce}finally{}}}var Ln=h0(!0),m0=h0(!1),$a=!1;function kc(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Nc(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Za(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Qa(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(Ee&2)!==0){var u=r.pending;return u===null?t.next=t:(t.next=u.next,u.next=t),r.pending=t,t=Os(e),Wp(e,null,n),t}return Ds(e,r,t,n),Os(e)}function xr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,sp(e,n)}}function Cc(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var u=null,d=null;if(n=n.firstBaseUpdate,n!==null){do{var v={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};d===null?u=d=v:d=d.next=v,n=n.next}while(n!==null);d===null?u=d=t:d=d.next=t}else u=d=t;n={baseState:r.baseState,firstBaseUpdate:u,lastBaseUpdate:d,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Tc=!1;function yr(){if(Tc){var e=hi;if(e!==null)throw e}}function br(e,t,n,r){Tc=!1;var u=e.updateQueue;$a=!1;var d=u.firstBaseUpdate,v=u.lastBaseUpdate,k=u.shared.pending;if(k!==null){u.shared.pending=null;var M=k,V=M.next;M.next=null,v===null?d=V:v.next=V,v=M;var I=e.alternate;I!==null&&(I=I.updateQueue,k=I.lastBaseUpdate,k!==v&&(k===null?I.firstBaseUpdate=V:k.next=V,I.lastBaseUpdate=M))}if(d!==null){var Z=u.baseState;v=0,I=V=M=null,k=d;do{var G=k.lane&-536870913,Y=G!==k.lane;if(Y?(Se&G)===G:(r&G)===G){G!==0&&G===pi&&(Tc=!0),I!==null&&(I=I.next={lane:0,tag:k.tag,payload:k.payload,callback:null,next:null});e:{var se=e,de=k;G=t;var Oe=n;switch(de.tag){case 1:if(se=de.payload,typeof se=="function"){Z=se.call(Oe,Z,G);break e}Z=se;break e;case 3:se.flags=se.flags&-65537|128;case 0:if(se=de.payload,G=typeof se=="function"?se.call(Oe,Z,G):se,G==null)break e;Z=y({},Z,G);break e;case 2:$a=!0}}G=k.callback,G!==null&&(e.flags|=64,Y&&(e.flags|=8192),Y=u.callbacks,Y===null?u.callbacks=[G]:Y.push(G))}else Y={lane:G,tag:k.tag,payload:k.payload,callback:k.callback,next:null},I===null?(V=I=Y,M=Z):I=I.next=Y,v|=G;if(k=k.next,k===null){if(k=u.shared.pending,k===null)break;Y=k,k=Y.next,Y.next=null,u.lastBaseUpdate=Y,u.shared.pending=null}}while(!0);I===null&&(M=Z),u.baseState=M,u.firstBaseUpdate=V,u.lastBaseUpdate=I,d===null&&(u.shared.lanes=0),tn|=v,e.lanes=v,e.memoizedState=Z}}function g0(e,t){if(typeof e!="function")throw Error(l(191,e));e.call(t)}function x0(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)g0(n[e],t)}var xi=D(null),Fs=D(0);function y0(e,t){e=La,ae(Fs,e),ae(xi,t),La=e|t.baseLanes}function Ec(){ae(Fs,La),ae(xi,xi.current)}function zc(){La=Fs.current,$(xi),$(Fs)}var Rt=D(null),It=null;function Ka(e){var t=e.alternate;ae(Xe,Xe.current&1),ae(Rt,e),It===null&&(t===null||xi.current!==null||t.memoizedState!==null)&&(It=e)}function Mc(e){ae(Xe,Xe.current),ae(Rt,e),It===null&&(It=e)}function b0(e){e.tag===22?(ae(Xe,Xe.current),ae(Rt,e),It===null&&(It=e)):Wa()}function Wa(){ae(Xe,Xe.current),ae(Rt,Rt.current)}function Dt(e){$(Rt),It===e&&(It=null),$(Xe)}var Xe=D(0);function Is(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Bu(n)||Uu(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ta=0,me=null,Re=null,Ze=null,Xs=!1,yi=!1,Bn=!1,Ps=0,vr=0,bi=null,Uv=0;function Ge(){throw Error(l(321))}function Ac(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Mt(e[n],t[n]))return!1;return!0}function Rc(e,t,n,r,u,d){return Ta=d,me=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,q.H=e===null||e.memoizedState===null?ah:Pc,Bn=!1,d=n(r,u),Bn=!1,yi&&(d=j0(t,n,r,u)),v0(e),d}function v0(e){q.H=wr;var t=Re!==null&&Re.next!==null;if(Ta=0,Ze=Re=me=null,Xs=!1,vr=0,bi=null,t)throw Error(l(300));e===null||Qe||(e=e.dependencies,e!==null&&Us(e)&&(Qe=!0))}function j0(e,t,n,r){me=e;var u=0;do{if(yi&&(bi=null),vr=0,yi=!1,25<=u)throw Error(l(301));if(u+=1,Ze=Re=null,e.updateQueue!=null){var d=e.updateQueue;d.lastEffect=null,d.events=null,d.stores=null,d.memoCache!=null&&(d.memoCache.index=0)}q.H=nh,d=t(n,r)}while(yi);return d}function Vv(){var e=q.H,t=e.useState()[0];return t=typeof t.then=="function"?jr(t):t,e=e.useState()[0],(Re!==null?Re.memoizedState:null)!==e&&(me.flags|=1024),t}function Dc(){var e=Ps!==0;return Ps=0,e}function Oc(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Lc(e){if(Xs){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Xs=!1}Ta=0,Ze=Re=me=null,yi=!1,vr=Ps=0,bi=null}function gt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ze===null?me.memoizedState=Ze=e:Ze=Ze.next=e,Ze}function Pe(){if(Re===null){var e=me.alternate;e=e!==null?e.memoizedState:null}else e=Re.next;var t=Ze===null?me.memoizedState:Ze.next;if(t!==null)Ze=t,Re=e;else{if(e===null)throw me.alternate===null?Error(l(467)):Error(l(310));Re=e,e={memoizedState:Re.memoizedState,baseState:Re.baseState,baseQueue:Re.baseQueue,queue:Re.queue,next:null},Ze===null?me.memoizedState=Ze=e:Ze=Ze.next=e}return Ze}function $s(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function jr(e){var t=vr;return vr+=1,bi===null&&(bi=[]),e=d0(bi,e,t),t=me,(Ze===null?t.memoizedState:Ze.next)===null&&(t=t.alternate,q.H=t===null||t.memoizedState===null?ah:Pc),e}function Zs(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return jr(e);if(e.$$typeof===E)return lt(e)}throw Error(l(438,String(e)))}function Bc(e){var t=null,n=me.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=me.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(u){return u.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=$s(),me.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=H;return t.index++,n}function Ea(e,t){return typeof t=="function"?t(e):t}function Qs(e){var t=Pe();return Uc(t,Re,e)}function Uc(e,t,n){var r=e.queue;if(r===null)throw Error(l(311));r.lastRenderedReducer=n;var u=e.baseQueue,d=r.pending;if(d!==null){if(u!==null){var v=u.next;u.next=d.next,d.next=v}t.baseQueue=u=d,r.pending=null}if(d=e.baseState,u===null)e.memoizedState=d;else{t=u.next;var k=v=null,M=null,V=t,I=!1;do{var Z=V.lane&-536870913;if(Z!==V.lane?(Se&Z)===Z:(Ta&Z)===Z){var G=V.revertLane;if(G===0)M!==null&&(M=M.next={lane:0,revertLane:0,gesture:null,action:V.action,hasEagerState:V.hasEagerState,eagerState:V.eagerState,next:null}),Z===pi&&(I=!0);else if((Ta&G)===G){V=V.next,G===pi&&(I=!0);continue}else Z={lane:0,revertLane:V.revertLane,gesture:null,action:V.action,hasEagerState:V.hasEagerState,eagerState:V.eagerState,next:null},M===null?(k=M=Z,v=d):M=M.next=Z,me.lanes|=G,tn|=G;Z=V.action,Bn&&n(d,Z),d=V.hasEagerState?V.eagerState:n(d,Z)}else G={lane:Z,revertLane:V.revertLane,gesture:V.gesture,action:V.action,hasEagerState:V.hasEagerState,eagerState:V.eagerState,next:null},M===null?(k=M=G,v=d):M=M.next=G,me.lanes|=Z,tn|=Z;V=V.next}while(V!==null&&V!==t);if(M===null?v=d:M.next=k,!Mt(d,e.memoizedState)&&(Qe=!0,I&&(n=hi,n!==null)))throw n;e.memoizedState=d,e.baseState=v,e.baseQueue=M,r.lastRenderedState=d}return u===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Vc(e){var t=Pe(),n=t.queue;if(n===null)throw Error(l(311));n.lastRenderedReducer=e;var r=n.dispatch,u=n.pending,d=t.memoizedState;if(u!==null){n.pending=null;var v=u=u.next;do d=e(d,v.action),v=v.next;while(v!==u);Mt(d,t.memoizedState)||(Qe=!0),t.memoizedState=d,t.baseQueue===null&&(t.baseState=d),n.lastRenderedState=d}return[d,r]}function S0(e,t,n){var r=me,u=Pe(),d=ke;if(d){if(n===void 0)throw Error(l(407));n=n()}else n=t();var v=!Mt((Re||u).memoizedState,n);if(v&&(u.memoizedState=n,Qe=!0),u=u.queue,Hc(N0.bind(null,r,u,e),[e]),u.getSnapshot!==t||v||Ze!==null&&Ze.memoizedState.tag&1){if(r.flags|=2048,vi(9,{destroy:void 0},k0.bind(null,r,u,n,t),null),Le===null)throw Error(l(349));d||(Ta&127)!==0||w0(r,t,n)}return n}function w0(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=me.updateQueue,t===null?(t=$s(),me.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function k0(e,t,n,r){t.value=n,t.getSnapshot=r,C0(t)&&T0(e)}function N0(e,t,n){return n(function(){C0(t)&&T0(e)})}function C0(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Mt(e,n)}catch{return!0}}function T0(e){var t=Tn(e,2);t!==null&&Nt(t,e,2)}function _c(e){var t=gt();if(typeof e=="function"){var n=e;if(e=n(),Bn){Ha(!0);try{n()}finally{Ha(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ea,lastRenderedState:e},t}function E0(e,t,n,r){return e.baseState=n,Uc(e,Re,typeof r=="function"?r:Ea)}function _v(e,t,n,r,u){if(Js(e))throw Error(l(485));if(e=t.action,e!==null){var d={payload:u,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(v){d.listeners.push(v)}};q.T!==null?n(!0):d.isTransition=!1,r(d),n=t.pending,n===null?(d.next=t.pending=d,z0(t,d)):(d.next=n.next,t.pending=n.next=d)}}function z0(e,t){var n=t.action,r=t.payload,u=e.state;if(t.isTransition){var d=q.T,v={};q.T=v;try{var k=n(u,r),M=q.S;M!==null&&M(v,k),M0(e,t,k)}catch(V){qc(e,t,V)}finally{d!==null&&v.types!==null&&(d.types=v.types),q.T=d}}else try{d=n(u,r),M0(e,t,d)}catch(V){qc(e,t,V)}}function M0(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(r){A0(e,t,r)},function(r){return qc(e,t,r)}):A0(e,t,n)}function A0(e,t,n){t.status="fulfilled",t.value=n,R0(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,z0(e,n)))}function qc(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status="rejected",t.reason=n,R0(t),t=t.next;while(t!==r)}e.action=null}function R0(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function D0(e,t){return t}function O0(e,t){if(ke){var n=Le.formState;if(n!==null){e:{var r=me;if(ke){if(Ve){t:{for(var u=Ve,d=Ft;u.nodeType!==8;){if(!d){u=null;break t}if(u=Xt(u.nextSibling),u===null){u=null;break t}}d=u.data,u=d==="F!"||d==="F"?u:null}if(u){Ve=Xt(u.nextSibling),r=u.data==="F!";break e}}Xa(r)}r=!1}r&&(t=n[0])}}return n=gt(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:D0,lastRenderedState:t},n.queue=r,n=J0.bind(null,me,r),r.dispatch=n,r=_c(!1),d=Xc.bind(null,me,!1,r.queue),r=gt(),u={state:t,dispatch:null,action:e,pending:null},r.queue=u,n=_v.bind(null,me,u,d,n),u.dispatch=n,r.memoizedState=e,[t,n,!1]}function L0(e){var t=Pe();return B0(t,Re,e)}function B0(e,t,n){if(t=Uc(e,t,D0)[0],e=Qs(Ea)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var r=jr(t)}catch(v){throw v===mi?qs:v}else r=t;t=Pe();var u=t.queue,d=u.dispatch;return n!==t.memoizedState&&(me.flags|=2048,vi(9,{destroy:void 0},qv.bind(null,u,n),null)),[r,d,e]}function qv(e,t){e.action=t}function U0(e){var t=Pe(),n=Re;if(n!==null)return B0(t,n,e);Pe(),t=t.memoizedState,n=Pe();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function vi(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=me.updateQueue,t===null&&(t=$s(),me.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function V0(){return Pe().memoizedState}function Ks(e,t,n,r){var u=gt();me.flags|=e,u.memoizedState=vi(1|t,{destroy:void 0},n,r===void 0?null:r)}function Ws(e,t,n,r){var u=Pe();r=r===void 0?null:r;var d=u.memoizedState.inst;Re!==null&&r!==null&&Ac(r,Re.memoizedState.deps)?u.memoizedState=vi(t,d,n,r):(me.flags|=e,u.memoizedState=vi(1|t,d,n,r))}function _0(e,t){Ks(8390656,8,e,t)}function Hc(e,t){Ws(2048,8,e,t)}function Hv(e){me.flags|=4;var t=me.updateQueue;if(t===null)t=$s(),me.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function q0(e){var t=Pe().memoizedState;return Hv({ref:t,nextImpl:e}),function(){if((Ee&2)!==0)throw Error(l(440));return t.impl.apply(void 0,arguments)}}function H0(e,t){return Ws(4,2,e,t)}function G0(e,t){return Ws(4,4,e,t)}function Y0(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function F0(e,t,n){n=n!=null?n.concat([e]):null,Ws(4,4,Y0.bind(null,t,e),n)}function Gc(){}function I0(e,t){var n=Pe();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Ac(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function X0(e,t){var n=Pe();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Ac(t,r[1]))return r[0];if(r=e(),Bn){Ha(!0);try{e()}finally{Ha(!1)}}return n.memoizedState=[r,t],r}function Yc(e,t,n){return n===void 0||(Ta&1073741824)!==0&&(Se&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=Ph(),me.lanes|=e,tn|=e,n)}function P0(e,t,n,r){return Mt(n,t)?n:xi.current!==null?(e=Yc(e,n,r),Mt(e,t)||(Qe=!0),e):(Ta&42)===0||(Ta&1073741824)!==0&&(Se&261930)===0?(Qe=!0,e.memoizedState=n):(e=Ph(),me.lanes|=e,tn|=e,t)}function $0(e,t,n,r,u){var d=ee.p;ee.p=d!==0&&8>d?d:8;var v=q.T,k={};q.T=k,Xc(e,!1,t,n);try{var M=u(),V=q.S;if(V!==null&&V(k,M),M!==null&&typeof M=="object"&&typeof M.then=="function"){var I=Bv(M,r);Sr(e,t,I,Bt(e))}else Sr(e,t,r,Bt(e))}catch(Z){Sr(e,t,{then:function(){},status:"rejected",reason:Z},Bt())}finally{ee.p=d,v!==null&&k.types!==null&&(v.types=k.types),q.T=v}}function Gv(){}function Fc(e,t,n,r){if(e.tag!==5)throw Error(l(476));var u=Z0(e).queue;$0(e,u,t,ie,n===null?Gv:function(){return Q0(e),n(r)})}function Z0(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:ie,baseState:ie,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ea,lastRenderedState:ie},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ea,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Q0(e){var t=Z0(e);t.next===null&&(t=e.alternate.memoizedState),Sr(e,t.next.queue,{},Bt())}function Ic(){return lt(_r)}function K0(){return Pe().memoizedState}function W0(){return Pe().memoizedState}function Yv(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=Bt();e=Za(n);var r=Qa(t,e,n);r!==null&&(Nt(r,t,n),xr(r,t,n)),t={cache:vc()},e.payload=t;return}t=t.return}}function Fv(e,t,n){var r=Bt();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Js(e)?eh(t,n):(n=cc(e,t,n,r),n!==null&&(Nt(n,e,r),th(n,t,r)))}function J0(e,t,n){var r=Bt();Sr(e,t,n,r)}function Sr(e,t,n,r){var u={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Js(e))eh(t,u);else{var d=e.alternate;if(e.lanes===0&&(d===null||d.lanes===0)&&(d=t.lastRenderedReducer,d!==null))try{var v=t.lastRenderedState,k=d(v,n);if(u.hasEagerState=!0,u.eagerState=k,Mt(k,v))return Ds(e,t,u,0),Le===null&&Rs(),!1}catch{}finally{}if(n=cc(e,t,u,r),n!==null)return Nt(n,e,r),th(n,t,r),!0}return!1}function Xc(e,t,n,r){if(r={lane:2,revertLane:ku(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Js(e)){if(t)throw Error(l(479))}else t=cc(e,n,r,2),t!==null&&Nt(t,e,2)}function Js(e){var t=e.alternate;return e===me||t!==null&&t===me}function eh(e,t){yi=Xs=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function th(e,t,n){if((n&4194048)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,sp(e,n)}}var wr={readContext:lt,use:Zs,useCallback:Ge,useContext:Ge,useEffect:Ge,useImperativeHandle:Ge,useLayoutEffect:Ge,useInsertionEffect:Ge,useMemo:Ge,useReducer:Ge,useRef:Ge,useState:Ge,useDebugValue:Ge,useDeferredValue:Ge,useTransition:Ge,useSyncExternalStore:Ge,useId:Ge,useHostTransitionStatus:Ge,useFormState:Ge,useActionState:Ge,useOptimistic:Ge,useMemoCache:Ge,useCacheRefresh:Ge};wr.useEffectEvent=Ge;var ah={readContext:lt,use:Zs,useCallback:function(e,t){return gt().memoizedState=[e,t===void 0?null:t],e},useContext:lt,useEffect:_0,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,Ks(4194308,4,Y0.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Ks(4194308,4,e,t)},useInsertionEffect:function(e,t){Ks(4,2,e,t)},useMemo:function(e,t){var n=gt();t=t===void 0?null:t;var r=e();if(Bn){Ha(!0);try{e()}finally{Ha(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=gt();if(n!==void 0){var u=n(t);if(Bn){Ha(!0);try{n(t)}finally{Ha(!1)}}}else u=t;return r.memoizedState=r.baseState=u,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:u},r.queue=e,e=e.dispatch=Fv.bind(null,me,e),[r.memoizedState,e]},useRef:function(e){var t=gt();return e={current:e},t.memoizedState=e},useState:function(e){e=_c(e);var t=e.queue,n=J0.bind(null,me,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Gc,useDeferredValue:function(e,t){var n=gt();return Yc(n,e,t)},useTransition:function(){var e=_c(!1);return e=$0.bind(null,me,e.queue,!0,!1),gt().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=me,u=gt();if(ke){if(n===void 0)throw Error(l(407));n=n()}else{if(n=t(),Le===null)throw Error(l(349));(Se&127)!==0||w0(r,t,n)}u.memoizedState=n;var d={value:n,getSnapshot:t};return u.queue=d,_0(N0.bind(null,r,d,e),[e]),r.flags|=2048,vi(9,{destroy:void 0},k0.bind(null,r,d,n,t),null),n},useId:function(){var e=gt(),t=Le.identifierPrefix;if(ke){var n=da,r=ua;n=(r&~(1<<32-zt(r)-1)).toString(32)+n,t="_"+t+"R_"+n,n=Ps++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=Uv++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Ic,useFormState:O0,useActionState:O0,useOptimistic:function(e){var t=gt();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Xc.bind(null,me,!0,n),n.dispatch=t,[e,t]},useMemoCache:Bc,useCacheRefresh:function(){return gt().memoizedState=Yv.bind(null,me)},useEffectEvent:function(e){var t=gt(),n={impl:e};return t.memoizedState=n,function(){if((Ee&2)!==0)throw Error(l(440));return n.impl.apply(void 0,arguments)}}},Pc={readContext:lt,use:Zs,useCallback:I0,useContext:lt,useEffect:Hc,useImperativeHandle:F0,useInsertionEffect:H0,useLayoutEffect:G0,useMemo:X0,useReducer:Qs,useRef:V0,useState:function(){return Qs(Ea)},useDebugValue:Gc,useDeferredValue:function(e,t){var n=Pe();return P0(n,Re.memoizedState,e,t)},useTransition:function(){var e=Qs(Ea)[0],t=Pe().memoizedState;return[typeof e=="boolean"?e:jr(e),t]},useSyncExternalStore:S0,useId:K0,useHostTransitionStatus:Ic,useFormState:L0,useActionState:L0,useOptimistic:function(e,t){var n=Pe();return E0(n,Re,e,t)},useMemoCache:Bc,useCacheRefresh:W0};Pc.useEffectEvent=q0;var nh={readContext:lt,use:Zs,useCallback:I0,useContext:lt,useEffect:Hc,useImperativeHandle:F0,useInsertionEffect:H0,useLayoutEffect:G0,useMemo:X0,useReducer:Vc,useRef:V0,useState:function(){return Vc(Ea)},useDebugValue:Gc,useDeferredValue:function(e,t){var n=Pe();return Re===null?Yc(n,e,t):P0(n,Re.memoizedState,e,t)},useTransition:function(){var e=Vc(Ea)[0],t=Pe().memoizedState;return[typeof e=="boolean"?e:jr(e),t]},useSyncExternalStore:S0,useId:K0,useHostTransitionStatus:Ic,useFormState:U0,useActionState:U0,useOptimistic:function(e,t){var n=Pe();return Re!==null?E0(n,Re,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:Bc,useCacheRefresh:W0};nh.useEffectEvent=q0;function $c(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:y({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Zc={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=Bt(),u=Za(r);u.payload=t,n!=null&&(u.callback=n),t=Qa(e,u,r),t!==null&&(Nt(t,e,r),xr(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=Bt(),u=Za(r);u.tag=1,u.payload=t,n!=null&&(u.callback=n),t=Qa(e,u,r),t!==null&&(Nt(t,e,r),xr(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Bt(),r=Za(n);r.tag=2,t!=null&&(r.callback=t),t=Qa(e,r,n),t!==null&&(Nt(t,e,n),xr(t,e,n))}};function ih(e,t,n,r,u,d,v){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,d,v):t.prototype&&t.prototype.isPureReactComponent?!cr(n,r)||!cr(u,d):!0}function rh(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Zc.enqueueReplaceState(t,t.state,null)}function Un(e,t){var n=t;if("ref"in t){n={};for(var r in t)r!=="ref"&&(n[r]=t[r])}if(e=e.defaultProps){n===t&&(n=y({},n));for(var u in e)n[u]===void 0&&(n[u]=e[u])}return n}function sh(e){As(e)}function oh(e){console.error(e)}function lh(e){As(e)}function eo(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(r){setTimeout(function(){throw r})}}function ch(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function Qc(e,t,n){return n=Za(n),n.tag=3,n.payload={element:null},n.callback=function(){eo(e,t)},n}function uh(e){return e=Za(e),e.tag=3,e}function dh(e,t,n,r){var u=n.type.getDerivedStateFromError;if(typeof u=="function"){var d=r.value;e.payload=function(){return u(d)},e.callback=function(){ch(t,n,r)}}var v=n.stateNode;v!==null&&typeof v.componentDidCatch=="function"&&(e.callback=function(){ch(t,n,r),typeof u!="function"&&(an===null?an=new Set([this]):an.add(this));var k=r.stack;this.componentDidCatch(r.value,{componentStack:k!==null?k:""})})}function Iv(e,t,n,r,u){if(n.flags|=32768,r!==null&&typeof r=="object"&&typeof r.then=="function"){if(t=n.alternate,t!==null&&fi(t,n,u,!0),n=Rt.current,n!==null){switch(n.tag){case 31:case 13:return It===null?po():n.alternate===null&&Ye===0&&(Ye=3),n.flags&=-257,n.flags|=65536,n.lanes=u,r===Hs?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),ju(e,r,u)),!1;case 22:return n.flags|=65536,r===Hs?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),ju(e,r,u)),!1}throw Error(l(435,n.tag))}return ju(e,r,u),po(),!1}if(ke)return t=Rt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=u,r!==mc&&(e=Error(l(422),{cause:r}),fr(Ht(e,n)))):(r!==mc&&(t=Error(l(423),{cause:r}),fr(Ht(t,n))),e=e.current.alternate,e.flags|=65536,u&=-u,e.lanes|=u,r=Ht(r,n),u=Qc(e.stateNode,r,u),Cc(e,u),Ye!==4&&(Ye=2)),!1;var d=Error(l(520),{cause:r});if(d=Ht(d,n),Ar===null?Ar=[d]:Ar.push(d),Ye!==4&&(Ye=2),t===null)return!0;r=Ht(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=u&-u,n.lanes|=e,e=Qc(n.stateNode,r,e),Cc(n,e),!1;case 1:if(t=n.type,d=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||d!==null&&typeof d.componentDidCatch=="function"&&(an===null||!an.has(d))))return n.flags|=65536,u&=-u,n.lanes|=u,u=uh(u),dh(u,e,n,r),Cc(n,u),!1}n=n.return}while(n!==null);return!1}var Kc=Error(l(461)),Qe=!1;function ct(e,t,n,r){t.child=e===null?m0(t,null,n,r):Ln(t,e.child,n,r)}function fh(e,t,n,r,u){n=n.render;var d=t.ref;if("ref"in r){var v={};for(var k in r)k!=="ref"&&(v[k]=r[k])}else v=r;return An(t),r=Rc(e,t,n,v,d,u),k=Dc(),e!==null&&!Qe?(Oc(e,t,u),za(e,t,u)):(ke&&k&&pc(t),t.flags|=1,ct(e,t,r,u),t.child)}function ph(e,t,n,r,u){if(e===null){var d=n.type;return typeof d=="function"&&!uc(d)&&d.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=d,hh(e,t,d,r,u)):(e=Ls(n.type,null,r,t,t.mode,u),e.ref=t.ref,e.return=t,t.child=e)}if(d=e.child,!ru(e,u)){var v=d.memoizedProps;if(n=n.compare,n=n!==null?n:cr,n(v,r)&&e.ref===t.ref)return za(e,t,u)}return t.flags|=1,e=wa(d,r),e.ref=t.ref,e.return=t,t.child=e}function hh(e,t,n,r,u){if(e!==null){var d=e.memoizedProps;if(cr(d,r)&&e.ref===t.ref)if(Qe=!1,t.pendingProps=r=d,ru(e,u))(e.flags&131072)!==0&&(Qe=!0);else return t.lanes=e.lanes,za(e,t,u)}return Wc(e,t,n,r,u)}function mh(e,t,n,r){var u=r.children,d=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode==="hidden"){if((t.flags&128)!==0){if(d=d!==null?d.baseLanes|n:n,e!==null){for(r=t.child=e.child,u=0;r!==null;)u=u|r.lanes|r.childLanes,r=r.sibling;r=u&~d}else r=0,t.child=null;return gh(e,t,d,n,r)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&_s(t,d!==null?d.cachePool:null),d!==null?y0(t,d):Ec(),b0(t);else return r=t.lanes=536870912,gh(e,t,d!==null?d.baseLanes|n:n,n,r)}else d!==null?(_s(t,d.cachePool),y0(t,d),Wa(),t.memoizedState=null):(e!==null&&_s(t,null),Ec(),Wa());return ct(e,t,u,n),t.child}function kr(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function gh(e,t,n,r,u){var d=Sc();return d=d===null?null:{parent:$e._currentValue,pool:d},t.memoizedState={baseLanes:n,cachePool:d},e!==null&&_s(t,null),Ec(),b0(t),e!==null&&fi(e,t,r,!0),t.childLanes=u,null}function to(e,t){return t=no({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function xh(e,t,n){return Ln(t,e.child,null,n),e=to(t,t.pendingProps),e.flags|=2,Dt(t),t.memoizedState=null,e}function Xv(e,t,n){var r=t.pendingProps,u=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(ke){if(r.mode==="hidden")return e=to(t,r),t.lanes=536870912,kr(null,e);if(Mc(t),(e=Ve)?(e=zm(e,Ft),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Fa!==null?{id:ua,overflow:da}:null,retryLane:536870912,hydrationErrors:null},n=e0(e),n.return=t,t.child=n,ot=t,Ve=null)):e=null,e===null)throw Xa(t);return t.lanes=536870912,null}return to(t,r)}var d=e.memoizedState;if(d!==null){var v=d.dehydrated;if(Mc(t),u)if(t.flags&256)t.flags&=-257,t=xh(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(l(558));else if(Qe||fi(e,t,n,!1),u=(n&e.childLanes)!==0,Qe||u){if(r=Le,r!==null&&(v=op(r,n),v!==0&&v!==d.retryLane))throw d.retryLane=v,Tn(e,v),Nt(r,e,v),Kc;po(),t=xh(e,t,n)}else e=d.treeContext,Ve=Xt(v.nextSibling),ot=t,ke=!0,Ia=null,Ft=!1,e!==null&&n0(t,e),t=to(t,r),t.flags|=4096;return t}return e=wa(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function ao(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(l(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Wc(e,t,n,r,u){return An(t),n=Rc(e,t,n,r,void 0,u),r=Dc(),e!==null&&!Qe?(Oc(e,t,u),za(e,t,u)):(ke&&r&&pc(t),t.flags|=1,ct(e,t,n,u),t.child)}function yh(e,t,n,r,u,d){return An(t),t.updateQueue=null,n=j0(t,r,n,u),v0(e),r=Dc(),e!==null&&!Qe?(Oc(e,t,d),za(e,t,d)):(ke&&r&&pc(t),t.flags|=1,ct(e,t,n,d),t.child)}function bh(e,t,n,r,u){if(An(t),t.stateNode===null){var d=li,v=n.contextType;typeof v=="object"&&v!==null&&(d=lt(v)),d=new n(r,d),t.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,d.updater=Zc,t.stateNode=d,d._reactInternals=t,d=t.stateNode,d.props=r,d.state=t.memoizedState,d.refs={},kc(t),v=n.contextType,d.context=typeof v=="object"&&v!==null?lt(v):li,d.state=t.memoizedState,v=n.getDerivedStateFromProps,typeof v=="function"&&($c(t,n,v,r),d.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(v=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),v!==d.state&&Zc.enqueueReplaceState(d,d.state,null),br(t,r,d,u),yr(),d.state=t.memoizedState),typeof d.componentDidMount=="function"&&(t.flags|=4194308),r=!0}else if(e===null){d=t.stateNode;var k=t.memoizedProps,M=Un(n,k);d.props=M;var V=d.context,I=n.contextType;v=li,typeof I=="object"&&I!==null&&(v=lt(I));var Z=n.getDerivedStateFromProps;I=typeof Z=="function"||typeof d.getSnapshotBeforeUpdate=="function",k=t.pendingProps!==k,I||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(k||V!==v)&&rh(t,d,r,v),$a=!1;var G=t.memoizedState;d.state=G,br(t,r,d,u),yr(),V=t.memoizedState,k||G!==V||$a?(typeof Z=="function"&&($c(t,n,Z,r),V=t.memoizedState),(M=$a||ih(t,n,M,r,G,V,v))?(I||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount()),typeof d.componentDidMount=="function"&&(t.flags|=4194308)):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=V),d.props=r,d.state=V,d.context=v,r=M):(typeof d.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{d=t.stateNode,Nc(e,t),v=t.memoizedProps,I=Un(n,v),d.props=I,Z=t.pendingProps,G=d.context,V=n.contextType,M=li,typeof V=="object"&&V!==null&&(M=lt(V)),k=n.getDerivedStateFromProps,(V=typeof k=="function"||typeof d.getSnapshotBeforeUpdate=="function")||typeof d.UNSAFE_componentWillReceiveProps!="function"&&typeof d.componentWillReceiveProps!="function"||(v!==Z||G!==M)&&rh(t,d,r,M),$a=!1,G=t.memoizedState,d.state=G,br(t,r,d,u),yr();var Y=t.memoizedState;v!==Z||G!==Y||$a||e!==null&&e.dependencies!==null&&Us(e.dependencies)?(typeof k=="function"&&($c(t,n,k,r),Y=t.memoizedState),(I=$a||ih(t,n,I,r,G,Y,M)||e!==null&&e.dependencies!==null&&Us(e.dependencies))?(V||typeof d.UNSAFE_componentWillUpdate!="function"&&typeof d.componentWillUpdate!="function"||(typeof d.componentWillUpdate=="function"&&d.componentWillUpdate(r,Y,M),typeof d.UNSAFE_componentWillUpdate=="function"&&d.UNSAFE_componentWillUpdate(r,Y,M)),typeof d.componentDidUpdate=="function"&&(t.flags|=4),typeof d.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof d.componentDidUpdate!="function"||v===e.memoizedProps&&G===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||v===e.memoizedProps&&G===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=Y),d.props=r,d.state=Y,d.context=M,r=I):(typeof d.componentDidUpdate!="function"||v===e.memoizedProps&&G===e.memoizedState||(t.flags|=4),typeof d.getSnapshotBeforeUpdate!="function"||v===e.memoizedProps&&G===e.memoizedState||(t.flags|=1024),r=!1)}return d=r,ao(e,t),r=(t.flags&128)!==0,d||r?(d=t.stateNode,n=r&&typeof n.getDerivedStateFromError!="function"?null:d.render(),t.flags|=1,e!==null&&r?(t.child=Ln(t,e.child,null,u),t.child=Ln(t,null,n,u)):ct(e,t,n,u),t.memoizedState=d.state,e=t.child):e=za(e,t,u),e}function vh(e,t,n,r){return zn(),t.flags|=256,ct(e,t,n,r),t.child}var Jc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function eu(e){return{baseLanes:e,cachePool:c0()}}function tu(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Lt),e}function jh(e,t,n){var r=t.pendingProps,u=!1,d=(t.flags&128)!==0,v;if((v=d)||(v=e!==null&&e.memoizedState===null?!1:(Xe.current&2)!==0),v&&(u=!0,t.flags&=-129),v=(t.flags&32)!==0,t.flags&=-33,e===null){if(ke){if(u?Ka(t):Wa(),(e=Ve)?(e=zm(e,Ft),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Fa!==null?{id:ua,overflow:da}:null,retryLane:536870912,hydrationErrors:null},n=e0(e),n.return=t,t.child=n,ot=t,Ve=null)):e=null,e===null)throw Xa(t);return Uu(e)?t.lanes=32:t.lanes=536870912,null}var k=r.children;return r=r.fallback,u?(Wa(),u=t.mode,k=no({mode:"hidden",children:k},u),r=En(r,u,n,null),k.return=t,r.return=t,k.sibling=r,t.child=k,r=t.child,r.memoizedState=eu(n),r.childLanes=tu(e,v,n),t.memoizedState=Jc,kr(null,r)):(Ka(t),au(t,k))}var M=e.memoizedState;if(M!==null&&(k=M.dehydrated,k!==null)){if(d)t.flags&256?(Ka(t),t.flags&=-257,t=nu(e,t,n)):t.memoizedState!==null?(Wa(),t.child=e.child,t.flags|=128,t=null):(Wa(),k=r.fallback,u=t.mode,r=no({mode:"visible",children:r.children},u),k=En(k,u,n,null),k.flags|=2,r.return=t,k.return=t,r.sibling=k,t.child=r,Ln(t,e.child,null,n),r=t.child,r.memoizedState=eu(n),r.childLanes=tu(e,v,n),t.memoizedState=Jc,t=kr(null,r));else if(Ka(t),Uu(k)){if(v=k.nextSibling&&k.nextSibling.dataset,v)var V=v.dgst;v=V,r=Error(l(419)),r.stack="",r.digest=v,fr({value:r,source:null,stack:null}),t=nu(e,t,n)}else if(Qe||fi(e,t,n,!1),v=(n&e.childLanes)!==0,Qe||v){if(v=Le,v!==null&&(r=op(v,n),r!==0&&r!==M.retryLane))throw M.retryLane=r,Tn(e,r),Nt(v,e,r),Kc;Bu(k)||po(),t=nu(e,t,n)}else Bu(k)?(t.flags|=192,t.child=e.child,t=null):(e=M.treeContext,Ve=Xt(k.nextSibling),ot=t,ke=!0,Ia=null,Ft=!1,e!==null&&n0(t,e),t=au(t,r.children),t.flags|=4096);return t}return u?(Wa(),k=r.fallback,u=t.mode,M=e.child,V=M.sibling,r=wa(M,{mode:"hidden",children:r.children}),r.subtreeFlags=M.subtreeFlags&65011712,V!==null?k=wa(V,k):(k=En(k,u,n,null),k.flags|=2),k.return=t,r.return=t,r.sibling=k,t.child=r,kr(null,r),r=t.child,k=e.child.memoizedState,k===null?k=eu(n):(u=k.cachePool,u!==null?(M=$e._currentValue,u=u.parent!==M?{parent:M,pool:M}:u):u=c0(),k={baseLanes:k.baseLanes|n,cachePool:u}),r.memoizedState=k,r.childLanes=tu(e,v,n),t.memoizedState=Jc,kr(e.child,r)):(Ka(t),n=e.child,e=n.sibling,n=wa(n,{mode:"visible",children:r.children}),n.return=t,n.sibling=null,e!==null&&(v=t.deletions,v===null?(t.deletions=[e],t.flags|=16):v.push(e)),t.child=n,t.memoizedState=null,n)}function au(e,t){return t=no({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function no(e,t){return e=At(22,e,null,t),e.lanes=0,e}function nu(e,t,n){return Ln(t,e.child,null,n),e=au(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Sh(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),yc(e.return,t,n)}function iu(e,t,n,r,u,d){var v=e.memoizedState;v===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:u,treeForkCount:d}:(v.isBackwards=t,v.rendering=null,v.renderingStartTime=0,v.last=r,v.tail=n,v.tailMode=u,v.treeForkCount=d)}function wh(e,t,n){var r=t.pendingProps,u=r.revealOrder,d=r.tail;r=r.children;var v=Xe.current,k=(v&2)!==0;if(k?(v=v&1|2,t.flags|=128):v&=1,ae(Xe,v),ct(e,t,r,n),r=ke?dr:0,!k&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Sh(e,n,t);else if(e.tag===19)Sh(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(u){case"forwards":for(n=t.child,u=null;n!==null;)e=n.alternate,e!==null&&Is(e)===null&&(u=n),n=n.sibling;n=u,n===null?(u=t.child,t.child=null):(u=n.sibling,n.sibling=null),iu(t,!1,u,n,d,r);break;case"backwards":case"unstable_legacy-backwards":for(n=null,u=t.child,t.child=null;u!==null;){if(e=u.alternate,e!==null&&Is(e)===null){t.child=u;break}e=u.sibling,u.sibling=n,n=u,u=e}iu(t,!0,n,null,d,r);break;case"together":iu(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function za(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),tn|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(fi(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(l(153));if(t.child!==null){for(e=t.child,n=wa(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=wa(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function ru(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Us(e)))}function Pv(e,t,n){switch(t.tag){case 3:mt(t,t.stateNode.containerInfo),Pa(t,$e,e.memoizedState.cache),zn();break;case 27:case 5:Qi(t);break;case 4:mt(t,t.stateNode.containerInfo);break;case 10:Pa(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Mc(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated!==null?(Ka(t),t.flags|=128,null):(n&t.child.childLanes)!==0?jh(e,t,n):(Ka(t),e=za(e,t,n),e!==null?e.sibling:null);Ka(t);break;case 19:var u=(e.flags&128)!==0;if(r=(n&t.childLanes)!==0,r||(fi(e,t,n,!1),r=(n&t.childLanes)!==0),u){if(r)return wh(e,t,n);t.flags|=128}if(u=t.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),ae(Xe,Xe.current),r)break;return null;case 22:return t.lanes=0,mh(e,t,n,t.pendingProps);case 24:Pa(t,$e,e.memoizedState.cache)}return za(e,t,n)}function kh(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)Qe=!0;else{if(!ru(e,n)&&(t.flags&128)===0)return Qe=!1,Pv(e,t,n);Qe=(e.flags&131072)!==0}else Qe=!1,ke&&(t.flags&1048576)!==0&&a0(t,dr,t.index);switch(t.lanes=0,t.tag){case 16:e:{var r=t.pendingProps;if(e=Dn(t.elementType),t.type=e,typeof e=="function")uc(e)?(r=Un(e,r),t.tag=1,t=bh(null,t,e,r,n)):(t.tag=0,t=Wc(null,t,e,r,n));else{if(e!=null){var u=e.$$typeof;if(u===A){t.tag=11,t=fh(null,t,e,r,n);break e}else if(u===_){t.tag=14,t=ph(null,t,e,r,n);break e}}throw t=te(e)||e,Error(l(306,t,""))}}return t;case 0:return Wc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,u=Un(r,t.pendingProps),bh(e,t,r,u,n);case 3:e:{if(mt(t,t.stateNode.containerInfo),e===null)throw Error(l(387));r=t.pendingProps;var d=t.memoizedState;u=d.element,Nc(e,t),br(t,r,null,n);var v=t.memoizedState;if(r=v.cache,Pa(t,$e,r),r!==d.cache&&bc(t,[$e],n,!0),yr(),r=v.element,d.isDehydrated)if(d={element:r,isDehydrated:!1,cache:v.cache},t.updateQueue.baseState=d,t.memoizedState=d,t.flags&256){t=vh(e,t,r,n);break e}else if(r!==u){u=Ht(Error(l(424)),t),fr(u),t=vh(e,t,r,n);break e}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName==="HTML"?e.ownerDocument.body:e}for(Ve=Xt(e.firstChild),ot=t,ke=!0,Ia=null,Ft=!0,n=m0(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(zn(),r===u){t=za(e,t,n);break e}ct(e,t,r,n)}t=t.child}return t;case 26:return ao(e,t),e===null?(n=Lm(t.type,null,t.pendingProps,null))?t.memoizedState=n:ke||(n=t.type,e=t.pendingProps,r=vo(be.current).createElement(n),r[st]=t,r[bt]=e,ut(r,n,e),tt(r),t.stateNode=r):t.memoizedState=Lm(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Qi(t),e===null&&ke&&(r=t.stateNode=Rm(t.type,t.pendingProps,be.current),ot=t,Ft=!0,u=Ve,on(t.type)?(Vu=u,Ve=Xt(r.firstChild)):Ve=u),ct(e,t,t.pendingProps.children,n),ao(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&ke&&((u=r=Ve)&&(r=w2(r,t.type,t.pendingProps,Ft),r!==null?(t.stateNode=r,ot=t,Ve=Xt(r.firstChild),Ft=!1,u=!0):u=!1),u||Xa(t)),Qi(t),u=t.type,d=t.pendingProps,v=e!==null?e.memoizedProps:null,r=d.children,Du(u,d)?r=null:v!==null&&Du(u,v)&&(t.flags|=32),t.memoizedState!==null&&(u=Rc(e,t,Vv,null,null,n),_r._currentValue=u),ao(e,t),ct(e,t,r,n),t.child;case 6:return e===null&&ke&&((e=n=Ve)&&(n=k2(n,t.pendingProps,Ft),n!==null?(t.stateNode=n,ot=t,Ve=null,e=!0):e=!1),e||Xa(t)),null;case 13:return jh(e,t,n);case 4:return mt(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Ln(t,null,r,n):ct(e,t,r,n),t.child;case 11:return fh(e,t,t.type,t.pendingProps,n);case 7:return ct(e,t,t.pendingProps,n),t.child;case 8:return ct(e,t,t.pendingProps.children,n),t.child;case 12:return ct(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,Pa(t,t.type,r.value),ct(e,t,r.children,n),t.child;case 9:return u=t.type._context,r=t.pendingProps.children,An(t),u=lt(u),r=r(u),t.flags|=1,ct(e,t,r,n),t.child;case 14:return ph(e,t,t.type,t.pendingProps,n);case 15:return hh(e,t,t.type,t.pendingProps,n);case 19:return wh(e,t,n);case 31:return Xv(e,t,n);case 22:return mh(e,t,n,t.pendingProps);case 24:return An(t),r=lt($e),e===null?(u=Sc(),u===null&&(u=Le,d=vc(),u.pooledCache=d,d.refCount++,d!==null&&(u.pooledCacheLanes|=n),u=d),t.memoizedState={parent:r,cache:u},kc(t),Pa(t,$e,u)):((e.lanes&n)!==0&&(Nc(e,t),br(t,null,null,n),yr()),u=e.memoizedState,d=t.memoizedState,u.parent!==r?(u={parent:r,cache:r},t.memoizedState=u,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=u),Pa(t,$e,r)):(r=d.cache,Pa(t,$e,r),r!==u.cache&&bc(t,[$e],n,!0))),ct(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(l(156,t.tag))}function Ma(e){e.flags|=4}function su(e,t,n,r,u){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(u&335544128)===u)if(e.stateNode.complete)e.flags|=8192;else if(Kh())e.flags|=8192;else throw On=Hs,wc}else e.flags&=-16777217}function Nh(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!qm(t))if(Kh())e.flags|=8192;else throw On=Hs,wc}function io(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?ip():536870912,e.lanes|=t,ki|=t)}function Nr(e,t){if(!ke)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function _e(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var u=e.child;u!==null;)n|=u.lanes|u.childLanes,r|=u.subtreeFlags&65011712,r|=u.flags&65011712,u.return=e,u=u.sibling;else for(u=e.child;u!==null;)n|=u.lanes|u.childLanes,r|=u.subtreeFlags,r|=u.flags,u.return=e,u=u.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function $v(e,t,n){var r=t.pendingProps;switch(hc(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return _e(t),null;case 1:return _e(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),Ca($e),Ie(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(di(t)?Ma(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,gc())),_e(t),null;case 26:var u=t.type,d=t.memoizedState;return e===null?(Ma(t),d!==null?(_e(t),Nh(t,d)):(_e(t),su(t,u,null,r,n))):d?d!==e.memoizedState?(Ma(t),_e(t),Nh(t,d)):(_e(t),t.flags&=-16777217):(e=e.memoizedProps,e!==r&&Ma(t),_e(t),su(t,u,e,r,n)),null;case 27:if(ms(t),n=be.current,u=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Ma(t);else{if(!r){if(t.stateNode===null)throw Error(l(166));return _e(t),null}e=re.current,di(t)?i0(t):(e=Rm(u,r,n),t.stateNode=e,Ma(t))}return _e(t),null;case 5:if(ms(t),u=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&Ma(t);else{if(!r){if(t.stateNode===null)throw Error(l(166));return _e(t),null}if(d=re.current,di(t))i0(t);else{var v=vo(be.current);switch(d){case 1:d=v.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:d=v.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":d=v.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":d=v.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":d=v.createElement("div"),d.innerHTML="<script><\/script>",d=d.removeChild(d.firstChild);break;case"select":d=typeof r.is=="string"?v.createElement("select",{is:r.is}):v.createElement("select"),r.multiple?d.multiple=!0:r.size&&(d.size=r.size);break;default:d=typeof r.is=="string"?v.createElement(u,{is:r.is}):v.createElement(u)}}d[st]=t,d[bt]=r;e:for(v=t.child;v!==null;){if(v.tag===5||v.tag===6)d.appendChild(v.stateNode);else if(v.tag!==4&&v.tag!==27&&v.child!==null){v.child.return=v,v=v.child;continue}if(v===t)break e;for(;v.sibling===null;){if(v.return===null||v.return===t)break e;v=v.return}v.sibling.return=v.return,v=v.sibling}t.stateNode=d;e:switch(ut(d,u,r),u){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}r&&Ma(t)}}return _e(t),su(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&Ma(t);else{if(typeof r!="string"&&t.stateNode===null)throw Error(l(166));if(e=be.current,di(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,u=ot,u!==null)switch(u.tag){case 27:case 5:r=u.memoizedProps}e[st]=t,e=!!(e.nodeValue===n||r!==null&&r.suppressHydrationWarning===!0||jm(e.nodeValue,n)),e||Xa(t,!0)}else e=vo(e).createTextNode(r),e[st]=t,t.stateNode=e}return _e(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=di(t),n!==null){if(e===null){if(!r)throw Error(l(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(l(557));e[st]=t}else zn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;_e(t),e=!1}else n=gc(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Dt(t),t):(Dt(t),null);if((t.flags&128)!==0)throw Error(l(558))}return _e(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(u=di(t),r!==null&&r.dehydrated!==null){if(e===null){if(!u)throw Error(l(318));if(u=t.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(l(317));u[st]=t}else zn(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;_e(t),u=!1}else u=gc(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=u),u=!0;if(!u)return t.flags&256?(Dt(t),t):(Dt(t),null)}return Dt(t),(t.flags&128)!==0?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,u=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(u=r.alternate.memoizedState.cachePool.pool),d=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(d=r.memoizedState.cachePool.pool),d!==u&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),io(t,t.updateQueue),_e(t),null);case 4:return Ie(),e===null&&Eu(t.stateNode.containerInfo),_e(t),null;case 10:return Ca(t.type),_e(t),null;case 19:if($(Xe),r=t.memoizedState,r===null)return _e(t),null;if(u=(t.flags&128)!==0,d=r.rendering,d===null)if(u)Nr(r,!1);else{if(Ye!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(d=Is(e),d!==null){for(t.flags|=128,Nr(r,!1),e=d.updateQueue,t.updateQueue=e,io(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Jp(n,e),n=n.sibling;return ae(Xe,Xe.current&1|2),ke&&ka(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Tt()>co&&(t.flags|=128,u=!0,Nr(r,!1),t.lanes=4194304)}else{if(!u)if(e=Is(d),e!==null){if(t.flags|=128,u=!0,e=e.updateQueue,t.updateQueue=e,io(t,e),Nr(r,!0),r.tail===null&&r.tailMode==="hidden"&&!d.alternate&&!ke)return _e(t),null}else 2*Tt()-r.renderingStartTime>co&&n!==536870912&&(t.flags|=128,u=!0,Nr(r,!1),t.lanes=4194304);r.isBackwards?(d.sibling=t.child,t.child=d):(e=r.last,e!==null?e.sibling=d:t.child=d,r.last=d)}return r.tail!==null?(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Tt(),e.sibling=null,n=Xe.current,ae(Xe,u?n&1|2:n&1),ke&&ka(t,r.treeForkCount),e):(_e(t),null);case 22:case 23:return Dt(t),zc(),r=t.memoizedState!==null,e!==null?e.memoizedState!==null!==r&&(t.flags|=8192):r&&(t.flags|=8192),r?(n&536870912)!==0&&(t.flags&128)===0&&(_e(t),t.subtreeFlags&6&&(t.flags|=8192)):_e(t),n=t.updateQueue,n!==null&&io(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&$(Rn),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),Ca($e),_e(t),null;case 25:return null;case 30:return null}throw Error(l(156,t.tag))}function Zv(e,t){switch(hc(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Ca($e),Ie(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return ms(t),null;case 31:if(t.memoizedState!==null){if(Dt(t),t.alternate===null)throw Error(l(340));zn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Dt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(l(340));zn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return $(Xe),null;case 4:return Ie(),null;case 10:return Ca(t.type),null;case 22:case 23:return Dt(t),zc(),e!==null&&$(Rn),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Ca($e),null;case 25:return null;default:return null}}function Ch(e,t){switch(hc(t),t.tag){case 3:Ca($e),Ie();break;case 26:case 27:case 5:ms(t);break;case 4:Ie();break;case 31:t.memoizedState!==null&&Dt(t);break;case 13:Dt(t);break;case 19:$(Xe);break;case 10:Ca(t.type);break;case 22:case 23:Dt(t),zc(),e!==null&&$(Rn);break;case 24:Ca($e)}}function Cr(e,t){try{var n=t.updateQueue,r=n!==null?n.lastEffect:null;if(r!==null){var u=r.next;n=u;do{if((n.tag&e)===e){r=void 0;var d=n.create,v=n.inst;r=d(),v.destroy=r}n=n.next}while(n!==u)}}catch(k){Ae(t,t.return,k)}}function Ja(e,t,n){try{var r=t.updateQueue,u=r!==null?r.lastEffect:null;if(u!==null){var d=u.next;r=d;do{if((r.tag&e)===e){var v=r.inst,k=v.destroy;if(k!==void 0){v.destroy=void 0,u=t;var M=n,V=k;try{V()}catch(I){Ae(u,M,I)}}}r=r.next}while(r!==d)}}catch(I){Ae(t,t.return,I)}}function Th(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{x0(t,n)}catch(r){Ae(e,e.return,r)}}}function Eh(e,t,n){n.props=Un(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(r){Ae(e,t,r)}}function Tr(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n=="function"?e.refCleanup=n(r):n.current=r}}catch(u){Ae(e,t,u)}}function fa(e,t){var n=e.ref,r=e.refCleanup;if(n!==null)if(typeof r=="function")try{r()}catch(u){Ae(e,t,u)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(u){Ae(e,t,u)}else n.current=null}function zh(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&r.focus();break e;case"img":n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(u){Ae(e,e.return,u)}}function ou(e,t,n){try{var r=e.stateNode;x2(r,e.type,n,t),r[bt]=t}catch(u){Ae(e,e.return,u)}}function Mh(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&on(e.type)||e.tag===4}function lu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Mh(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&on(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function cu(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=ja));else if(r!==4&&(r===27&&on(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(cu(e,t,n),e=e.sibling;e!==null;)cu(e,t,n),e=e.sibling}function ro(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&on(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(ro(e,t,n),e=e.sibling;e!==null;)ro(e,t,n),e=e.sibling}function Ah(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,u=t.attributes;u.length;)t.removeAttributeNode(u[0]);ut(t,r,n),t[st]=e,t[bt]=n}catch(d){Ae(e,e.return,d)}}var Aa=!1,Ke=!1,uu=!1,Rh=typeof WeakSet=="function"?WeakSet:Set,at=null;function Qv(e,t){if(e=e.containerInfo,Au=To,e=Fp(e),nc(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var u=r.anchorOffset,d=r.focusNode;r=r.focusOffset;try{n.nodeType,d.nodeType}catch{n=null;break e}var v=0,k=-1,M=-1,V=0,I=0,Z=e,G=null;t:for(;;){for(var Y;Z!==n||u!==0&&Z.nodeType!==3||(k=v+u),Z!==d||r!==0&&Z.nodeType!==3||(M=v+r),Z.nodeType===3&&(v+=Z.nodeValue.length),(Y=Z.firstChild)!==null;)G=Z,Z=Y;for(;;){if(Z===e)break t;if(G===n&&++V===u&&(k=v),G===d&&++I===r&&(M=v),(Y=Z.nextSibling)!==null)break;Z=G,G=Z.parentNode}Z=Y}n=k===-1||M===-1?null:{start:k,end:M}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ru={focusedElem:e,selectionRange:n},To=!1,at=t;at!==null;)if(t=at,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,at=e;else for(;at!==null;){switch(t=at,d=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)u=e[n],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&d!==null){e=void 0,n=t,u=d.memoizedProps,d=d.memoizedState,r=n.stateNode;try{var se=Un(n.type,u);e=r.getSnapshotBeforeUpdate(se,d),r.__reactInternalSnapshotBeforeUpdate=e}catch(de){Ae(n,n.return,de)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)Lu(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Lu(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(l(163))}if(e=t.sibling,e!==null){e.return=t.return,at=e;break}at=t.return}}function Dh(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:Da(e,n),r&4&&Cr(5,n);break;case 1:if(Da(e,n),r&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(v){Ae(n,n.return,v)}else{var u=Un(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(u,t,e.__reactInternalSnapshotBeforeUpdate)}catch(v){Ae(n,n.return,v)}}r&64&&Th(n),r&512&&Tr(n,n.return);break;case 3:if(Da(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{x0(e,t)}catch(v){Ae(n,n.return,v)}}break;case 27:t===null&&r&4&&Ah(n);case 26:case 5:Da(e,n),t===null&&r&4&&zh(n),r&512&&Tr(n,n.return);break;case 12:Da(e,n);break;case 31:Da(e,n),r&4&&Bh(e,n);break;case 13:Da(e,n),r&4&&Uh(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=r2.bind(null,n),N2(e,n))));break;case 22:if(r=n.memoizedState!==null||Aa,!r){t=t!==null&&t.memoizedState!==null||Ke,u=Aa;var d=Ke;Aa=r,(Ke=t)&&!d?Oa(e,n,(n.subtreeFlags&8772)!==0):Da(e,n),Aa=u,Ke=d}break;case 30:break;default:Da(e,n)}}function Oh(e){var t=e.alternate;t!==null&&(e.alternate=null,Oh(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&ql(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var qe=null,jt=!1;function Ra(e,t,n){for(n=n.child;n!==null;)Lh(e,t,n),n=n.sibling}function Lh(e,t,n){if(Et&&typeof Et.onCommitFiberUnmount=="function")try{Et.onCommitFiberUnmount(Ki,n)}catch{}switch(n.tag){case 26:Ke||fa(n,t),Ra(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:Ke||fa(n,t);var r=qe,u=jt;on(n.type)&&(qe=n.stateNode,jt=!1),Ra(e,t,n),Br(n.stateNode),qe=r,jt=u;break;case 5:Ke||fa(n,t);case 6:if(r=qe,u=jt,qe=null,Ra(e,t,n),qe=r,jt=u,qe!==null)if(jt)try{(qe.nodeType===9?qe.body:qe.nodeName==="HTML"?qe.ownerDocument.body:qe).removeChild(n.stateNode)}catch(d){Ae(n,t,d)}else try{qe.removeChild(n.stateNode)}catch(d){Ae(n,t,d)}break;case 18:qe!==null&&(jt?(e=qe,Tm(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),Ri(e)):Tm(qe,n.stateNode));break;case 4:r=qe,u=jt,qe=n.stateNode.containerInfo,jt=!0,Ra(e,t,n),qe=r,jt=u;break;case 0:case 11:case 14:case 15:Ja(2,n,t),Ke||Ja(4,n,t),Ra(e,t,n);break;case 1:Ke||(fa(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"&&Eh(n,t,r)),Ra(e,t,n);break;case 21:Ra(e,t,n);break;case 22:Ke=(r=Ke)||n.memoizedState!==null,Ra(e,t,n),Ke=r;break;default:Ra(e,t,n)}}function Bh(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Ri(e)}catch(n){Ae(t,t.return,n)}}}function Uh(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Ri(e)}catch(n){Ae(t,t.return,n)}}function Kv(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Rh),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Rh),t;default:throw Error(l(435,e.tag))}}function so(e,t){var n=Kv(e);t.forEach(function(r){if(!n.has(r)){n.add(r);var u=s2.bind(null,e,r);r.then(u,u)}})}function St(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var u=n[r],d=e,v=t,k=v;e:for(;k!==null;){switch(k.tag){case 27:if(on(k.type)){qe=k.stateNode,jt=!1;break e}break;case 5:qe=k.stateNode,jt=!1;break e;case 3:case 4:qe=k.stateNode.containerInfo,jt=!0;break e}k=k.return}if(qe===null)throw Error(l(160));Lh(d,v,u),qe=null,jt=!1,d=u.alternate,d!==null&&(d.return=null),u.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Vh(t,e),t=t.sibling}var aa=null;function Vh(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:St(t,e),wt(e),r&4&&(Ja(3,e,e.return),Cr(3,e),Ja(5,e,e.return));break;case 1:St(t,e),wt(e),r&512&&(Ke||n===null||fa(n,n.return)),r&64&&Aa&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var u=aa;if(St(t,e),wt(e),r&512&&(Ke||n===null||fa(n,n.return)),r&4){var d=n!==null?n.memoizedState:null;if(r=e.memoizedState,n===null)if(r===null)if(e.stateNode===null){e:{r=e.type,n=e.memoizedProps,u=u.ownerDocument||u;t:switch(r){case"title":d=u.getElementsByTagName("title")[0],(!d||d[er]||d[st]||d.namespaceURI==="http://www.w3.org/2000/svg"||d.hasAttribute("itemprop"))&&(d=u.createElement(r),u.head.insertBefore(d,u.querySelector("head > title"))),ut(d,r,n),d[st]=e,tt(d),r=d;break e;case"link":var v=Vm("link","href",u).get(r+(n.href||""));if(v){for(var k=0;k<v.length;k++)if(d=v[k],d.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&d.getAttribute("rel")===(n.rel==null?null:n.rel)&&d.getAttribute("title")===(n.title==null?null:n.title)&&d.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){v.splice(k,1);break t}}d=u.createElement(r),ut(d,r,n),u.head.appendChild(d);break;case"meta":if(v=Vm("meta","content",u).get(r+(n.content||""))){for(k=0;k<v.length;k++)if(d=v[k],d.getAttribute("content")===(n.content==null?null:""+n.content)&&d.getAttribute("name")===(n.name==null?null:n.name)&&d.getAttribute("property")===(n.property==null?null:n.property)&&d.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&d.getAttribute("charset")===(n.charSet==null?null:n.charSet)){v.splice(k,1);break t}}d=u.createElement(r),ut(d,r,n),u.head.appendChild(d);break;default:throw Error(l(468,r))}d[st]=e,tt(d),r=d}e.stateNode=r}else _m(u,e.type,e.stateNode);else e.stateNode=Um(u,r,e.memoizedProps);else d!==r?(d===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):d.count--,r===null?_m(u,e.type,e.stateNode):Um(u,r,e.memoizedProps)):r===null&&e.stateNode!==null&&ou(e,e.memoizedProps,n.memoizedProps)}break;case 27:St(t,e),wt(e),r&512&&(Ke||n===null||fa(n,n.return)),n!==null&&r&4&&ou(e,e.memoizedProps,n.memoizedProps);break;case 5:if(St(t,e),wt(e),r&512&&(Ke||n===null||fa(n,n.return)),e.flags&32){u=e.stateNode;try{ti(u,"")}catch(se){Ae(e,e.return,se)}}r&4&&e.stateNode!=null&&(u=e.memoizedProps,ou(e,u,n!==null?n.memoizedProps:u)),r&1024&&(uu=!0);break;case 6:if(St(t,e),wt(e),r&4){if(e.stateNode===null)throw Error(l(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(se){Ae(e,e.return,se)}}break;case 3:if(wo=null,u=aa,aa=jo(t.containerInfo),St(t,e),aa=u,wt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Ri(t.containerInfo)}catch(se){Ae(e,e.return,se)}uu&&(uu=!1,_h(e));break;case 4:r=aa,aa=jo(e.stateNode.containerInfo),St(t,e),wt(e),aa=r;break;case 12:St(t,e),wt(e);break;case 31:St(t,e),wt(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,so(e,r)));break;case 13:St(t,e),wt(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(lo=Tt()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,so(e,r)));break;case 22:u=e.memoizedState!==null;var M=n!==null&&n.memoizedState!==null,V=Aa,I=Ke;if(Aa=V||u,Ke=I||M,St(t,e),Ke=I,Aa=V,wt(e),r&8192)e:for(t=e.stateNode,t._visibility=u?t._visibility&-2:t._visibility|1,u&&(n===null||M||Aa||Ke||Vn(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){M=n=t;try{if(d=M.stateNode,u)v=d.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none";else{k=M.stateNode;var Z=M.memoizedProps.style,G=Z!=null&&Z.hasOwnProperty("display")?Z.display:null;k.style.display=G==null||typeof G=="boolean"?"":(""+G).trim()}}catch(se){Ae(M,M.return,se)}}}else if(t.tag===6){if(n===null){M=t;try{M.stateNode.nodeValue=u?"":M.memoizedProps}catch(se){Ae(M,M.return,se)}}}else if(t.tag===18){if(n===null){M=t;try{var Y=M.stateNode;u?Em(Y,!0):Em(M.stateNode,!1)}catch(se){Ae(M,M.return,se)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,so(e,n))));break;case 19:St(t,e),wt(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,so(e,r)));break;case 30:break;case 21:break;default:St(t,e),wt(e)}}function wt(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Mh(r)){n=r;break}r=r.return}if(n==null)throw Error(l(160));switch(n.tag){case 27:var u=n.stateNode,d=lu(e);ro(e,d,u);break;case 5:var v=n.stateNode;n.flags&32&&(ti(v,""),n.flags&=-33);var k=lu(e);ro(e,k,v);break;case 3:case 4:var M=n.stateNode.containerInfo,V=lu(e);cu(e,V,M);break;default:throw Error(l(161))}}catch(I){Ae(e,e.return,I)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function _h(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;_h(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Da(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Dh(e,t.alternate,t),t=t.sibling}function Vn(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Ja(4,t,t.return),Vn(t);break;case 1:fa(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&Eh(t,t.return,n),Vn(t);break;case 27:Br(t.stateNode);case 26:case 5:fa(t,t.return),Vn(t);break;case 22:t.memoizedState===null&&Vn(t);break;case 30:Vn(t);break;default:Vn(t)}e=e.sibling}}function Oa(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var r=t.alternate,u=e,d=t,v=d.flags;switch(d.tag){case 0:case 11:case 15:Oa(u,d,n),Cr(4,d);break;case 1:if(Oa(u,d,n),r=d,u=r.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(V){Ae(r,r.return,V)}if(r=d,u=r.updateQueue,u!==null){var k=r.stateNode;try{var M=u.shared.hiddenCallbacks;if(M!==null)for(u.shared.hiddenCallbacks=null,u=0;u<M.length;u++)g0(M[u],k)}catch(V){Ae(r,r.return,V)}}n&&v&64&&Th(d),Tr(d,d.return);break;case 27:Ah(d);case 26:case 5:Oa(u,d,n),n&&r===null&&v&4&&zh(d),Tr(d,d.return);break;case 12:Oa(u,d,n);break;case 31:Oa(u,d,n),n&&v&4&&Bh(u,d);break;case 13:Oa(u,d,n),n&&v&4&&Uh(u,d);break;case 22:d.memoizedState===null&&Oa(u,d,n),Tr(d,d.return);break;case 30:break;default:Oa(u,d,n)}t=t.sibling}}function du(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&pr(n))}function fu(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&pr(e))}function na(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)qh(e,t,n,r),t=t.sibling}function qh(e,t,n,r){var u=t.flags;switch(t.tag){case 0:case 11:case 15:na(e,t,n,r),u&2048&&Cr(9,t);break;case 1:na(e,t,n,r);break;case 3:na(e,t,n,r),u&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&pr(e)));break;case 12:if(u&2048){na(e,t,n,r),e=t.stateNode;try{var d=t.memoizedProps,v=d.id,k=d.onPostCommit;typeof k=="function"&&k(v,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(M){Ae(t,t.return,M)}}else na(e,t,n,r);break;case 31:na(e,t,n,r);break;case 13:na(e,t,n,r);break;case 23:break;case 22:d=t.stateNode,v=t.alternate,t.memoizedState!==null?d._visibility&2?na(e,t,n,r):Er(e,t):d._visibility&2?na(e,t,n,r):(d._visibility|=2,ji(e,t,n,r,(t.subtreeFlags&10256)!==0||!1)),u&2048&&du(v,t);break;case 24:na(e,t,n,r),u&2048&&fu(t.alternate,t);break;default:na(e,t,n,r)}}function ji(e,t,n,r,u){for(u=u&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var d=e,v=t,k=n,M=r,V=v.flags;switch(v.tag){case 0:case 11:case 15:ji(d,v,k,M,u),Cr(8,v);break;case 23:break;case 22:var I=v.stateNode;v.memoizedState!==null?I._visibility&2?ji(d,v,k,M,u):Er(d,v):(I._visibility|=2,ji(d,v,k,M,u)),u&&V&2048&&du(v.alternate,v);break;case 24:ji(d,v,k,M,u),u&&V&2048&&fu(v.alternate,v);break;default:ji(d,v,k,M,u)}t=t.sibling}}function Er(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,u=r.flags;switch(r.tag){case 22:Er(n,r),u&2048&&du(r.alternate,r);break;case 24:Er(n,r),u&2048&&fu(r.alternate,r);break;default:Er(n,r)}t=t.sibling}}var zr=8192;function Si(e,t,n){if(e.subtreeFlags&zr)for(e=e.child;e!==null;)Hh(e,t,n),e=e.sibling}function Hh(e,t,n){switch(e.tag){case 26:Si(e,t,n),e.flags&zr&&e.memoizedState!==null&&U2(n,aa,e.memoizedState,e.memoizedProps);break;case 5:Si(e,t,n);break;case 3:case 4:var r=aa;aa=jo(e.stateNode.containerInfo),Si(e,t,n),aa=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=zr,zr=16777216,Si(e,t,n),zr=r):Si(e,t,n));break;default:Si(e,t,n)}}function Gh(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Mr(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];at=r,Fh(r,e)}Gh(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Yh(e),e=e.sibling}function Yh(e){switch(e.tag){case 0:case 11:case 15:Mr(e),e.flags&2048&&Ja(9,e,e.return);break;case 3:Mr(e);break;case 12:Mr(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,oo(e)):Mr(e);break;default:Mr(e)}}function oo(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];at=r,Fh(r,e)}Gh(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Ja(8,t,t.return),oo(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,oo(t));break;default:oo(t)}e=e.sibling}}function Fh(e,t){for(;at!==null;){var n=at;switch(n.tag){case 0:case 11:case 15:Ja(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:pr(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,at=r;else e:for(n=e;at!==null;){r=at;var u=r.sibling,d=r.return;if(Oh(r),r===n){at=null;break e}if(u!==null){u.return=d,at=u;break e}at=d}}}var Wv={getCacheForType:function(e){var t=lt($e),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return lt($e).controller.signal}},Jv=typeof WeakMap=="function"?WeakMap:Map,Ee=0,Le=null,ve=null,Se=0,Me=0,Ot=null,en=!1,wi=!1,pu=!1,La=0,Ye=0,tn=0,_n=0,hu=0,Lt=0,ki=0,Ar=null,kt=null,mu=!1,lo=0,Ih=0,co=1/0,uo=null,an=null,Je=0,nn=null,Ni=null,Ba=0,gu=0,xu=null,Xh=null,Rr=0,yu=null;function Bt(){return(Ee&2)!==0&&Se!==0?Se&-Se:q.T!==null?ku():lp()}function Ph(){if(Lt===0)if((Se&536870912)===0||ke){var e=ys;ys<<=1,(ys&3932160)===0&&(ys=262144),Lt=e}else Lt=536870912;return e=Rt.current,e!==null&&(e.flags|=32),Lt}function Nt(e,t,n){(e===Le&&(Me===2||Me===9)||e.cancelPendingCommit!==null)&&(Ci(e,0),rn(e,Se,Lt,!1)),Ji(e,n),((Ee&2)===0||e!==Le)&&(e===Le&&((Ee&2)===0&&(_n|=n),Ye===4&&rn(e,Se,Lt,!1)),pa(e))}function $h(e,t,n){if((Ee&6)!==0)throw Error(l(327));var r=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Wi(e,t),u=r?a2(e,t):vu(e,t,!0),d=r;do{if(u===0){wi&&!r&&rn(e,t,0,!1);break}else{if(n=e.current.alternate,d&&!e2(n)){u=vu(e,t,!1),d=!1;continue}if(u===2){if(d=t,e.errorRecoveryDisabledLanes&d)var v=0;else v=e.pendingLanes&-536870913,v=v!==0?v:v&536870912?536870912:0;if(v!==0){t=v;e:{var k=e;u=Ar;var M=k.current.memoizedState.isDehydrated;if(M&&(Ci(k,v).flags|=256),v=vu(k,v,!1),v!==2){if(pu&&!M){k.errorRecoveryDisabledLanes|=d,_n|=d,u=4;break e}d=kt,kt=u,d!==null&&(kt===null?kt=d:kt.push.apply(kt,d))}u=v}if(d=!1,u!==2)continue}}if(u===1){Ci(e,0),rn(e,t,0,!0);break}e:{switch(r=e,d=u,d){case 0:case 1:throw Error(l(345));case 4:if((t&4194048)!==t)break;case 6:rn(r,t,Lt,!en);break e;case 2:kt=null;break;case 3:case 5:break;default:throw Error(l(329))}if((t&62914560)===t&&(u=lo+300-Tt(),10<u)){if(rn(r,t,Lt,!en),vs(r,0,!0)!==0)break e;Ba=t,r.timeoutHandle=Nm(Zh.bind(null,r,n,kt,uo,mu,t,Lt,_n,ki,en,d,"Throttled",-0,0),u);break e}Zh(r,n,kt,uo,mu,t,Lt,_n,ki,en,d,null,-0,0)}}break}while(!0);pa(e)}function Zh(e,t,n,r,u,d,v,k,M,V,I,Z,G,Y){if(e.timeoutHandle=-1,Z=t.subtreeFlags,Z&8192||(Z&16785408)===16785408){Z={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:ja},Hh(t,d,Z);var se=(d&62914560)===d?lo-Tt():(d&4194048)===d?Ih-Tt():0;if(se=V2(Z,se),se!==null){Ba=d,e.cancelPendingCommit=se(nm.bind(null,e,t,d,n,r,u,v,k,M,I,Z,null,G,Y)),rn(e,d,v,!V);return}}nm(e,t,d,n,r,u,v,k,M)}function e2(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var u=n[r],d=u.getSnapshot;u=u.value;try{if(!Mt(d(),u))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function rn(e,t,n,r){t&=~hu,t&=~_n,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var u=t;0<u;){var d=31-zt(u),v=1<<d;r[d]=-1,u&=~v}n!==0&&rp(e,n,t)}function fo(){return(Ee&6)===0?(Dr(0),!1):!0}function bu(){if(ve!==null){if(Me===0)var e=ve.return;else e=ve,Na=Mn=null,Lc(e),gi=null,mr=0,e=ve;for(;e!==null;)Ch(e.alternate,e),e=e.return;ve=null}}function Ci(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,v2(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Ba=0,bu(),Le=e,ve=n=wa(e.current,null),Se=t,Me=0,Ot=null,en=!1,wi=Wi(e,t),pu=!1,ki=Lt=hu=_n=tn=Ye=0,kt=Ar=null,mu=!1,(t&8)!==0&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var u=31-zt(r),d=1<<u;t|=e[u],r&=~d}return La=t,Rs(),n}function Qh(e,t){me=null,q.H=wr,t===mi||t===qs?(t=f0(),Me=3):t===wc?(t=f0(),Me=4):Me=t===Kc?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Ot=t,ve===null&&(Ye=1,eo(e,Ht(t,e.current)))}function Kh(){var e=Rt.current;return e===null?!0:(Se&4194048)===Se?It===null:(Se&62914560)===Se||(Se&536870912)!==0?e===It:!1}function Wh(){var e=q.H;return q.H=wr,e===null?wr:e}function Jh(){var e=q.A;return q.A=Wv,e}function po(){Ye=4,en||(Se&4194048)!==Se&&Rt.current!==null||(wi=!0),(tn&134217727)===0&&(_n&134217727)===0||Le===null||rn(Le,Se,Lt,!1)}function vu(e,t,n){var r=Ee;Ee|=2;var u=Wh(),d=Jh();(Le!==e||Se!==t)&&(uo=null,Ci(e,t)),t=!1;var v=Ye;e:do try{if(Me!==0&&ve!==null){var k=ve,M=Ot;switch(Me){case 8:bu(),v=6;break e;case 3:case 2:case 9:case 6:Rt.current===null&&(t=!0);var V=Me;if(Me=0,Ot=null,Ti(e,k,M,V),n&&wi){v=0;break e}break;default:V=Me,Me=0,Ot=null,Ti(e,k,M,V)}}t2(),v=Ye;break}catch(I){Qh(e,I)}while(!0);return t&&e.shellSuspendCounter++,Na=Mn=null,Ee=r,q.H=u,q.A=d,ve===null&&(Le=null,Se=0,Rs()),v}function t2(){for(;ve!==null;)em(ve)}function a2(e,t){var n=Ee;Ee|=2;var r=Wh(),u=Jh();Le!==e||Se!==t?(uo=null,co=Tt()+500,Ci(e,t)):wi=Wi(e,t);e:do try{if(Me!==0&&ve!==null){t=ve;var d=Ot;t:switch(Me){case 1:Me=0,Ot=null,Ti(e,t,d,1);break;case 2:case 9:if(u0(d)){Me=0,Ot=null,tm(t);break}t=function(){Me!==2&&Me!==9||Le!==e||(Me=7),pa(e)},d.then(t,t);break e;case 3:Me=7;break e;case 4:Me=5;break e;case 7:u0(d)?(Me=0,Ot=null,tm(t)):(Me=0,Ot=null,Ti(e,t,d,7));break;case 5:var v=null;switch(ve.tag){case 26:v=ve.memoizedState;case 5:case 27:var k=ve;if(v?qm(v):k.stateNode.complete){Me=0,Ot=null;var M=k.sibling;if(M!==null)ve=M;else{var V=k.return;V!==null?(ve=V,ho(V)):ve=null}break t}}Me=0,Ot=null,Ti(e,t,d,5);break;case 6:Me=0,Ot=null,Ti(e,t,d,6);break;case 8:bu(),Ye=6;break e;default:throw Error(l(462))}}n2();break}catch(I){Qh(e,I)}while(!0);return Na=Mn=null,q.H=r,q.A=u,Ee=n,ve!==null?0:(Le=null,Se=0,Rs(),Ye)}function n2(){for(;ve!==null&&!C1();)em(ve)}function em(e){var t=kh(e.alternate,e,La);e.memoizedProps=e.pendingProps,t===null?ho(e):ve=t}function tm(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=yh(n,t,t.pendingProps,t.type,void 0,Se);break;case 11:t=yh(n,t,t.pendingProps,t.type.render,t.ref,Se);break;case 5:Lc(t);default:Ch(n,t),t=ve=Jp(t,La),t=kh(n,t,La)}e.memoizedProps=e.pendingProps,t===null?ho(e):ve=t}function Ti(e,t,n,r){Na=Mn=null,Lc(t),gi=null,mr=0;var u=t.return;try{if(Iv(e,u,t,n,Se)){Ye=1,eo(e,Ht(n,e.current)),ve=null;return}}catch(d){if(u!==null)throw ve=u,d;Ye=1,eo(e,Ht(n,e.current)),ve=null;return}t.flags&32768?(ke||r===1?e=!0:wi||(Se&536870912)!==0?e=!1:(en=e=!0,(r===2||r===9||r===3||r===6)&&(r=Rt.current,r!==null&&r.tag===13&&(r.flags|=16384))),am(t,e)):ho(t)}function ho(e){var t=e;do{if((t.flags&32768)!==0){am(t,en);return}e=t.return;var n=$v(t.alternate,t,La);if(n!==null){ve=n;return}if(t=t.sibling,t!==null){ve=t;return}ve=t=e}while(t!==null);Ye===0&&(Ye=5)}function am(e,t){do{var n=Zv(e.alternate,e);if(n!==null){n.flags&=32767,ve=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){ve=e;return}ve=e=n}while(e!==null);Ye=6,ve=null}function nm(e,t,n,r,u,d,v,k,M){e.cancelPendingCommit=null;do mo();while(Je!==0);if((Ee&6)!==0)throw Error(l(327));if(t!==null){if(t===e.current)throw Error(l(177));if(d=t.lanes|t.childLanes,d|=lc,B1(e,n,d,v,k,M),e===Le&&(ve=Le=null,Se=0),Ni=t,nn=e,Ba=n,gu=d,xu=u,Xh=r,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,o2(gs,function(){return lm(),null})):(e.callbackNode=null,e.callbackPriority=0),r=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||r){r=q.T,q.T=null,u=ee.p,ee.p=2,v=Ee,Ee|=4;try{Qv(e,t,n)}finally{Ee=v,ee.p=u,q.T=r}}Je=1,im(),rm(),sm()}}function im(){if(Je===1){Je=0;var e=nn,t=Ni,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=q.T,q.T=null;var r=ee.p;ee.p=2;var u=Ee;Ee|=4;try{Vh(t,e);var d=Ru,v=Fp(e.containerInfo),k=d.focusedElem,M=d.selectionRange;if(v!==k&&k&&k.ownerDocument&&Yp(k.ownerDocument.documentElement,k)){if(M!==null&&nc(k)){var V=M.start,I=M.end;if(I===void 0&&(I=V),"selectionStart"in k)k.selectionStart=V,k.selectionEnd=Math.min(I,k.value.length);else{var Z=k.ownerDocument||document,G=Z&&Z.defaultView||window;if(G.getSelection){var Y=G.getSelection(),se=k.textContent.length,de=Math.min(M.start,se),Oe=M.end===void 0?de:Math.min(M.end,se);!Y.extend&&de>Oe&&(v=Oe,Oe=de,de=v);var L=Gp(k,de),O=Gp(k,Oe);if(L&&O&&(Y.rangeCount!==1||Y.anchorNode!==L.node||Y.anchorOffset!==L.offset||Y.focusNode!==O.node||Y.focusOffset!==O.offset)){var U=Z.createRange();U.setStart(L.node,L.offset),Y.removeAllRanges(),de>Oe?(Y.addRange(U),Y.extend(O.node,O.offset)):(U.setEnd(O.node,O.offset),Y.addRange(U))}}}}for(Z=[],Y=k;Y=Y.parentNode;)Y.nodeType===1&&Z.push({element:Y,left:Y.scrollLeft,top:Y.scrollTop});for(typeof k.focus=="function"&&k.focus(),k=0;k<Z.length;k++){var P=Z[k];P.element.scrollLeft=P.left,P.element.scrollTop=P.top}}To=!!Au,Ru=Au=null}finally{Ee=u,ee.p=r,q.T=n}}e.current=t,Je=2}}function rm(){if(Je===2){Je=0;var e=nn,t=Ni,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=q.T,q.T=null;var r=ee.p;ee.p=2;var u=Ee;Ee|=4;try{Dh(e,t.alternate,t)}finally{Ee=u,ee.p=r,q.T=n}}Je=3}}function sm(){if(Je===4||Je===3){Je=0,T1();var e=nn,t=Ni,n=Ba,r=Xh;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?Je=5:(Je=0,Ni=nn=null,om(e,e.pendingLanes));var u=e.pendingLanes;if(u===0&&(an=null),Vl(n),t=t.stateNode,Et&&typeof Et.onCommitFiberRoot=="function")try{Et.onCommitFiberRoot(Ki,t,void 0,(t.current.flags&128)===128)}catch{}if(r!==null){t=q.T,u=ee.p,ee.p=2,q.T=null;try{for(var d=e.onRecoverableError,v=0;v<r.length;v++){var k=r[v];d(k.value,{componentStack:k.stack})}}finally{q.T=t,ee.p=u}}(Ba&3)!==0&&mo(),pa(e),u=e.pendingLanes,(n&261930)!==0&&(u&42)!==0?e===yu?Rr++:(Rr=0,yu=e):Rr=0,Dr(0)}}function om(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,pr(t)))}function mo(){return im(),rm(),sm(),lm()}function lm(){if(Je!==5)return!1;var e=nn,t=gu;gu=0;var n=Vl(Ba),r=q.T,u=ee.p;try{ee.p=32>n?32:n,q.T=null,n=xu,xu=null;var d=nn,v=Ba;if(Je=0,Ni=nn=null,Ba=0,(Ee&6)!==0)throw Error(l(331));var k=Ee;if(Ee|=4,Yh(d.current),qh(d,d.current,v,n),Ee=k,Dr(0,!1),Et&&typeof Et.onPostCommitFiberRoot=="function")try{Et.onPostCommitFiberRoot(Ki,d)}catch{}return!0}finally{ee.p=u,q.T=r,om(e,t)}}function cm(e,t,n){t=Ht(n,t),t=Qc(e.stateNode,t,2),e=Qa(e,t,2),e!==null&&(Ji(e,2),pa(e))}function Ae(e,t,n){if(e.tag===3)cm(e,e,n);else for(;t!==null;){if(t.tag===3){cm(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(an===null||!an.has(r))){e=Ht(n,e),n=uh(2),r=Qa(t,n,2),r!==null&&(dh(n,r,t,e),Ji(r,2),pa(r));break}}t=t.return}}function ju(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Jv;var u=new Set;r.set(t,u)}else u=r.get(t),u===void 0&&(u=new Set,r.set(t,u));u.has(n)||(pu=!0,u.add(n),e=i2.bind(null,e,t,n),t.then(e,e))}function i2(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,Le===e&&(Se&n)===n&&(Ye===4||Ye===3&&(Se&62914560)===Se&&300>Tt()-lo?(Ee&2)===0&&Ci(e,0):hu|=n,ki===Se&&(ki=0)),pa(e)}function um(e,t){t===0&&(t=ip()),e=Tn(e,t),e!==null&&(Ji(e,t),pa(e))}function r2(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),um(e,n)}function s2(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,u=e.memoizedState;u!==null&&(n=u.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(l(314))}r!==null&&r.delete(t),um(e,n)}function o2(e,t){return Ol(e,t)}var go=null,Ei=null,Su=!1,xo=!1,wu=!1,sn=0;function pa(e){e!==Ei&&e.next===null&&(Ei===null?go=Ei=e:Ei=Ei.next=e),xo=!0,Su||(Su=!0,c2())}function Dr(e,t){if(!wu&&xo){wu=!0;do for(var n=!1,r=go;r!==null;){if(e!==0){var u=r.pendingLanes;if(u===0)var d=0;else{var v=r.suspendedLanes,k=r.pingedLanes;d=(1<<31-zt(42|e)+1)-1,d&=u&~(v&~k),d=d&201326741?d&201326741|1:d?d|2:0}d!==0&&(n=!0,hm(r,d))}else d=Se,d=vs(r,r===Le?d:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),(d&3)===0||Wi(r,d)||(n=!0,hm(r,d));r=r.next}while(n);wu=!1}}function l2(){dm()}function dm(){xo=Su=!1;var e=0;sn!==0&&b2()&&(e=sn);for(var t=Tt(),n=null,r=go;r!==null;){var u=r.next,d=fm(r,t);d===0?(r.next=null,n===null?go=u:n.next=u,u===null&&(Ei=n)):(n=r,(e!==0||(d&3)!==0)&&(xo=!0)),r=u}Je!==0&&Je!==5||Dr(e),sn!==0&&(sn=0)}function fm(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,u=e.expirationTimes,d=e.pendingLanes&-62914561;0<d;){var v=31-zt(d),k=1<<v,M=u[v];M===-1?((k&n)===0||(k&r)!==0)&&(u[v]=L1(k,t)):M<=t&&(e.expiredLanes|=k),d&=~k}if(t=Le,n=Se,n=vs(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(Me===2||Me===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Ll(r),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Wi(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Ll(r),Vl(n)){case 2:case 8:n=ap;break;case 32:n=gs;break;case 268435456:n=np;break;default:n=gs}return r=pm.bind(null,e),n=Ol(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Ll(r),e.callbackPriority=2,e.callbackNode=null,2}function pm(e,t){if(Je!==0&&Je!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(mo()&&e.callbackNode!==n)return null;var r=Se;return r=vs(e,e===Le?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:($h(e,r,t),fm(e,Tt()),e.callbackNode!=null&&e.callbackNode===n?pm.bind(null,e):null)}function hm(e,t){if(mo())return null;$h(e,t,!0)}function c2(){j2(function(){(Ee&6)!==0?Ol(tp,l2):dm()})}function ku(){if(sn===0){var e=pi;e===0&&(e=xs,xs<<=1,(xs&261888)===0&&(xs=256)),sn=e}return sn}function mm(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:ks(""+e)}function gm(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function u2(e,t,n,r,u){if(t==="submit"&&n&&n.stateNode===u){var d=mm((u[bt]||null).action),v=r.submitter;v&&(t=(t=v[bt]||null)?mm(t.formAction):v.getAttribute("formAction"),t!==null&&(d=t,v=null));var k=new Es("action","action",null,r,u);e.push({event:k,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(sn!==0){var M=v?gm(u,v):new FormData(u);Fc(n,{pending:!0,data:M,method:u.method,action:d},null,M)}}else typeof d=="function"&&(k.preventDefault(),M=v?gm(u,v):new FormData(u),Fc(n,{pending:!0,data:M,method:u.method,action:d},d,M))},currentTarget:u}]})}}for(var Nu=0;Nu<oc.length;Nu++){var Cu=oc[Nu],d2=Cu.toLowerCase(),f2=Cu[0].toUpperCase()+Cu.slice(1);ta(d2,"on"+f2)}ta(Pp,"onAnimationEnd"),ta($p,"onAnimationIteration"),ta(Zp,"onAnimationStart"),ta("dblclick","onDoubleClick"),ta("focusin","onFocus"),ta("focusout","onBlur"),ta(Ev,"onTransitionRun"),ta(zv,"onTransitionStart"),ta(Mv,"onTransitionCancel"),ta(Qp,"onTransitionEnd"),Jn("onMouseEnter",["mouseout","mouseover"]),Jn("onMouseLeave",["mouseout","mouseover"]),Jn("onPointerEnter",["pointerout","pointerover"]),Jn("onPointerLeave",["pointerout","pointerover"]),wn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),wn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),wn("onBeforeInput",["compositionend","keypress","textInput","paste"]),wn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),wn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),wn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Or="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),p2=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Or));function xm(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],u=r.event;r=r.listeners;e:{var d=void 0;if(t)for(var v=r.length-1;0<=v;v--){var k=r[v],M=k.instance,V=k.currentTarget;if(k=k.listener,M!==d&&u.isPropagationStopped())break e;d=k,u.currentTarget=V;try{d(u)}catch(I){As(I)}u.currentTarget=null,d=M}else for(v=0;v<r.length;v++){if(k=r[v],M=k.instance,V=k.currentTarget,k=k.listener,M!==d&&u.isPropagationStopped())break e;d=k,u.currentTarget=V;try{d(u)}catch(I){As(I)}u.currentTarget=null,d=M}}}}function je(e,t){var n=t[_l];n===void 0&&(n=t[_l]=new Set);var r=e+"__bubble";n.has(r)||(ym(t,e,2,!1),n.add(r))}function Tu(e,t,n){var r=0;t&&(r|=4),ym(n,e,r,t)}var yo="_reactListening"+Math.random().toString(36).slice(2);function Eu(e){if(!e[yo]){e[yo]=!0,dp.forEach(function(n){n!=="selectionchange"&&(p2.has(n)||Tu(n,!1,e),Tu(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[yo]||(t[yo]=!0,Tu("selectionchange",!1,t))}}function ym(e,t,n,r){switch(Pm(t)){case 2:var u=H2;break;case 8:u=G2;break;default:u=Yu}n=u.bind(null,t,n,e),u=void 0,!$l||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(u=!0),r?u!==void 0?e.addEventListener(t,n,{capture:!0,passive:u}):e.addEventListener(t,n,!0):u!==void 0?e.addEventListener(t,n,{passive:u}):e.addEventListener(t,n,!1)}function zu(e,t,n,r,u){var d=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var v=r.tag;if(v===3||v===4){var k=r.stateNode.containerInfo;if(k===u)break;if(v===4)for(v=r.return;v!==null;){var M=v.tag;if((M===3||M===4)&&v.stateNode.containerInfo===u)return;v=v.return}for(;k!==null;){if(v=Qn(k),v===null)return;if(M=v.tag,M===5||M===6||M===26||M===27){r=d=v;continue e}k=k.parentNode}}r=r.return}wp(function(){var V=d,I=Xl(n),Z=[];e:{var G=Kp.get(e);if(G!==void 0){var Y=Es,se=e;switch(e){case"keypress":if(Cs(n)===0)break e;case"keydown":case"keyup":Y=sv;break;case"focusin":se="focus",Y=Wl;break;case"focusout":se="blur",Y=Wl;break;case"beforeblur":case"afterblur":Y=Wl;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Y=Cp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Y=$1;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Y=cv;break;case Pp:case $p:case Zp:Y=K1;break;case Qp:Y=dv;break;case"scroll":case"scrollend":Y=X1;break;case"wheel":Y=pv;break;case"copy":case"cut":case"paste":Y=J1;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Y=Ep;break;case"toggle":case"beforetoggle":Y=mv}var de=(t&4)!==0,Oe=!de&&(e==="scroll"||e==="scrollend"),L=de?G!==null?G+"Capture":null:G;de=[];for(var O=V,U;O!==null;){var P=O;if(U=P.stateNode,P=P.tag,P!==5&&P!==26&&P!==27||U===null||L===null||(P=ar(O,L),P!=null&&de.push(Lr(O,P,U))),Oe)break;O=O.return}0<de.length&&(G=new Y(G,se,null,n,I),Z.push({event:G,listeners:de}))}}if((t&7)===0){e:{if(G=e==="mouseover"||e==="pointerover",Y=e==="mouseout"||e==="pointerout",G&&n!==Il&&(se=n.relatedTarget||n.fromElement)&&(Qn(se)||se[Zn]))break e;if((Y||G)&&(G=I.window===I?I:(G=I.ownerDocument)?G.defaultView||G.parentWindow:window,Y?(se=n.relatedTarget||n.toElement,Y=V,se=se?Qn(se):null,se!==null&&(Oe=f(se),de=se.tag,se!==Oe||de!==5&&de!==27&&de!==6)&&(se=null)):(Y=null,se=V),Y!==se)){if(de=Cp,P="onMouseLeave",L="onMouseEnter",O="mouse",(e==="pointerout"||e==="pointerover")&&(de=Ep,P="onPointerLeave",L="onPointerEnter",O="pointer"),Oe=Y==null?G:tr(Y),U=se==null?G:tr(se),G=new de(P,O+"leave",Y,n,I),G.target=Oe,G.relatedTarget=U,P=null,Qn(I)===V&&(de=new de(L,O+"enter",se,n,I),de.target=U,de.relatedTarget=Oe,P=de),Oe=P,Y&&se)t:{for(de=h2,L=Y,O=se,U=0,P=L;P;P=de(P))U++;P=0;for(var ue=O;ue;ue=de(ue))P++;for(;0<U-P;)L=de(L),U--;for(;0<P-U;)O=de(O),P--;for(;U--;){if(L===O||O!==null&&L===O.alternate){de=L;break t}L=de(L),O=de(O)}de=null}else de=null;Y!==null&&bm(Z,G,Y,de,!1),se!==null&&Oe!==null&&bm(Z,Oe,se,de,!0)}}e:{if(G=V?tr(V):window,Y=G.nodeName&&G.nodeName.toLowerCase(),Y==="select"||Y==="input"&&G.type==="file")var Ce=Bp;else if(Op(G))if(Up)Ce=Nv;else{Ce=wv;var ce=Sv}else Y=G.nodeName,!Y||Y.toLowerCase()!=="input"||G.type!=="checkbox"&&G.type!=="radio"?V&&Fl(V.elementType)&&(Ce=Bp):Ce=kv;if(Ce&&(Ce=Ce(e,V))){Lp(Z,Ce,n,I);break e}ce&&ce(e,G,V),e==="focusout"&&V&&G.type==="number"&&V.memoizedProps.value!=null&&Yl(G,"number",G.value)}switch(ce=V?tr(V):window,e){case"focusin":(Op(ce)||ce.contentEditable==="true")&&(ri=ce,ic=V,ur=null);break;case"focusout":ur=ic=ri=null;break;case"mousedown":rc=!0;break;case"contextmenu":case"mouseup":case"dragend":rc=!1,Ip(Z,n,I);break;case"selectionchange":if(Tv)break;case"keydown":case"keyup":Ip(Z,n,I)}var ge;if(ec)e:{switch(e){case"compositionstart":var we="onCompositionStart";break e;case"compositionend":we="onCompositionEnd";break e;case"compositionupdate":we="onCompositionUpdate";break e}we=void 0}else ii?Rp(e,n)&&(we="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(we="onCompositionStart");we&&(zp&&n.locale!=="ko"&&(ii||we!=="onCompositionStart"?we==="onCompositionEnd"&&ii&&(ge=kp()):(Ya=I,Zl="value"in Ya?Ya.value:Ya.textContent,ii=!0)),ce=bo(V,we),0<ce.length&&(we=new Tp(we,e,null,n,I),Z.push({event:we,listeners:ce}),ge?we.data=ge:(ge=Dp(n),ge!==null&&(we.data=ge)))),(ge=xv?yv(e,n):bv(e,n))&&(we=bo(V,"onBeforeInput"),0<we.length&&(ce=new Tp("onBeforeInput","beforeinput",null,n,I),Z.push({event:ce,listeners:we}),ce.data=ge)),u2(Z,e,V,n,I)}xm(Z,t)})}function Lr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function bo(e,t){for(var n=t+"Capture",r=[];e!==null;){var u=e,d=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||d===null||(u=ar(e,n),u!=null&&r.unshift(Lr(e,u,d)),u=ar(e,t),u!=null&&r.push(Lr(e,u,d))),e.tag===3)return r;e=e.return}return[]}function h2(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function bm(e,t,n,r,u){for(var d=t._reactName,v=[];n!==null&&n!==r;){var k=n,M=k.alternate,V=k.stateNode;if(k=k.tag,M!==null&&M===r)break;k!==5&&k!==26&&k!==27||V===null||(M=V,u?(V=ar(n,d),V!=null&&v.unshift(Lr(n,V,M))):u||(V=ar(n,d),V!=null&&v.push(Lr(n,V,M)))),n=n.return}v.length!==0&&e.push({event:t,listeners:v})}var m2=/\r\n?/g,g2=/\u0000|\uFFFD/g;function vm(e){return(typeof e=="string"?e:""+e).replace(m2,`
`).replace(g2,"")}function jm(e,t){return t=vm(t),vm(e)===t}function De(e,t,n,r,u,d){switch(n){case"children":typeof r=="string"?t==="body"||t==="textarea"&&r===""||ti(e,r):(typeof r=="number"||typeof r=="bigint")&&t!=="body"&&ti(e,""+r);break;case"className":Ss(e,"class",r);break;case"tabIndex":Ss(e,"tabindex",r);break;case"dir":case"role":case"viewBox":case"width":case"height":Ss(e,n,r);break;case"style":jp(e,r,d);break;case"data":if(t!=="object"){Ss(e,"data",r);break}case"src":case"href":if(r===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(r==null||typeof r=="function"||typeof r=="symbol"||typeof r=="boolean"){e.removeAttribute(n);break}r=ks(""+r),e.setAttribute(n,r);break;case"action":case"formAction":if(typeof r=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof d=="function"&&(n==="formAction"?(t!=="input"&&De(e,t,"name",u.name,u,null),De(e,t,"formEncType",u.formEncType,u,null),De(e,t,"formMethod",u.formMethod,u,null),De(e,t,"formTarget",u.formTarget,u,null)):(De(e,t,"encType",u.encType,u,null),De(e,t,"method",u.method,u,null),De(e,t,"target",u.target,u,null)));if(r==null||typeof r=="symbol"||typeof r=="boolean"){e.removeAttribute(n);break}r=ks(""+r),e.setAttribute(n,r);break;case"onClick":r!=null&&(e.onclick=ja);break;case"onScroll":r!=null&&je("scroll",e);break;case"onScrollEnd":r!=null&&je("scrollend",e);break;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(l(61));if(n=r.__html,n!=null){if(u.children!=null)throw Error(l(60));e.innerHTML=n}}break;case"multiple":e.multiple=r&&typeof r!="function"&&typeof r!="symbol";break;case"muted":e.muted=r&&typeof r!="function"&&typeof r!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(r==null||typeof r=="function"||typeof r=="boolean"||typeof r=="symbol"){e.removeAttribute("xlink:href");break}n=ks(""+r),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":r!=null&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(n,""+r):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":r&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":r===!0?e.setAttribute(n,""):r!==!1&&r!=null&&typeof r!="function"&&typeof r!="symbol"?e.setAttribute(n,r):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":r!=null&&typeof r!="function"&&typeof r!="symbol"&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case"rowSpan":case"start":r==null||typeof r=="function"||typeof r=="symbol"||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case"popover":je("beforetoggle",e),je("toggle",e),js(e,"popover",r);break;case"xlinkActuate":va(e,"http://www.w3.org/1999/xlink","xlink:actuate",r);break;case"xlinkArcrole":va(e,"http://www.w3.org/1999/xlink","xlink:arcrole",r);break;case"xlinkRole":va(e,"http://www.w3.org/1999/xlink","xlink:role",r);break;case"xlinkShow":va(e,"http://www.w3.org/1999/xlink","xlink:show",r);break;case"xlinkTitle":va(e,"http://www.w3.org/1999/xlink","xlink:title",r);break;case"xlinkType":va(e,"http://www.w3.org/1999/xlink","xlink:type",r);break;case"xmlBase":va(e,"http://www.w3.org/XML/1998/namespace","xml:base",r);break;case"xmlLang":va(e,"http://www.w3.org/XML/1998/namespace","xml:lang",r);break;case"xmlSpace":va(e,"http://www.w3.org/XML/1998/namespace","xml:space",r);break;case"is":js(e,"is",r);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=F1.get(n)||n,js(e,n,r))}}function Mu(e,t,n,r,u,d){switch(n){case"style":jp(e,r,d);break;case"dangerouslySetInnerHTML":if(r!=null){if(typeof r!="object"||!("__html"in r))throw Error(l(61));if(n=r.__html,n!=null){if(u.children!=null)throw Error(l(60));e.innerHTML=n}}break;case"children":typeof r=="string"?ti(e,r):(typeof r=="number"||typeof r=="bigint")&&ti(e,""+r);break;case"onScroll":r!=null&&je("scroll",e);break;case"onScrollEnd":r!=null&&je("scrollend",e);break;case"onClick":r!=null&&(e.onclick=ja);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!fp.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(u=n.endsWith("Capture"),t=n.slice(2,u?n.length-7:void 0),d=e[bt]||null,d=d!=null?d[n]:null,typeof d=="function"&&e.removeEventListener(t,d,u),typeof r=="function")){typeof d!="function"&&d!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,u);break e}n in e?e[n]=r:r===!0?e.setAttribute(n,""):js(e,n,r)}}}function ut(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":je("error",e),je("load",e);var r=!1,u=!1,d;for(d in n)if(n.hasOwnProperty(d)){var v=n[d];if(v!=null)switch(d){case"src":r=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(l(137,t));default:De(e,t,d,v,n,null)}}u&&De(e,t,"srcSet",n.srcSet,n,null),r&&De(e,t,"src",n.src,n,null);return;case"input":je("invalid",e);var k=d=v=u=null,M=null,V=null;for(r in n)if(n.hasOwnProperty(r)){var I=n[r];if(I!=null)switch(r){case"name":u=I;break;case"type":v=I;break;case"checked":M=I;break;case"defaultChecked":V=I;break;case"value":d=I;break;case"defaultValue":k=I;break;case"children":case"dangerouslySetInnerHTML":if(I!=null)throw Error(l(137,t));break;default:De(e,t,r,I,n,null)}}xp(e,d,k,M,V,v,u,!1);return;case"select":je("invalid",e),r=v=d=null;for(u in n)if(n.hasOwnProperty(u)&&(k=n[u],k!=null))switch(u){case"value":d=k;break;case"defaultValue":v=k;break;case"multiple":r=k;default:De(e,t,u,k,n,null)}t=d,n=v,e.multiple=!!r,t!=null?ei(e,!!r,t,!1):n!=null&&ei(e,!!r,n,!0);return;case"textarea":je("invalid",e),d=u=r=null;for(v in n)if(n.hasOwnProperty(v)&&(k=n[v],k!=null))switch(v){case"value":r=k;break;case"defaultValue":u=k;break;case"children":d=k;break;case"dangerouslySetInnerHTML":if(k!=null)throw Error(l(91));break;default:De(e,t,v,k,n,null)}bp(e,r,u,d);return;case"option":for(M in n)if(n.hasOwnProperty(M)&&(r=n[M],r!=null))switch(M){case"selected":e.selected=r&&typeof r!="function"&&typeof r!="symbol";break;default:De(e,t,M,r,n,null)}return;case"dialog":je("beforetoggle",e),je("toggle",e),je("cancel",e),je("close",e);break;case"iframe":case"object":je("load",e);break;case"video":case"audio":for(r=0;r<Or.length;r++)je(Or[r],e);break;case"image":je("error",e),je("load",e);break;case"details":je("toggle",e);break;case"embed":case"source":case"link":je("error",e),je("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(V in n)if(n.hasOwnProperty(V)&&(r=n[V],r!=null))switch(V){case"children":case"dangerouslySetInnerHTML":throw Error(l(137,t));default:De(e,t,V,r,n,null)}return;default:if(Fl(t)){for(I in n)n.hasOwnProperty(I)&&(r=n[I],r!==void 0&&Mu(e,t,I,r,n,void 0));return}}for(k in n)n.hasOwnProperty(k)&&(r=n[k],r!=null&&De(e,t,k,r,n,null))}function x2(e,t,n,r){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,d=null,v=null,k=null,M=null,V=null,I=null;for(Y in n){var Z=n[Y];if(n.hasOwnProperty(Y)&&Z!=null)switch(Y){case"checked":break;case"value":break;case"defaultValue":M=Z;default:r.hasOwnProperty(Y)||De(e,t,Y,null,r,Z)}}for(var G in r){var Y=r[G];if(Z=n[G],r.hasOwnProperty(G)&&(Y!=null||Z!=null))switch(G){case"type":d=Y;break;case"name":u=Y;break;case"checked":V=Y;break;case"defaultChecked":I=Y;break;case"value":v=Y;break;case"defaultValue":k=Y;break;case"children":case"dangerouslySetInnerHTML":if(Y!=null)throw Error(l(137,t));break;default:Y!==Z&&De(e,t,G,Y,r,Z)}}Gl(e,v,k,M,V,I,d,u);return;case"select":Y=v=k=G=null;for(d in n)if(M=n[d],n.hasOwnProperty(d)&&M!=null)switch(d){case"value":break;case"multiple":Y=M;default:r.hasOwnProperty(d)||De(e,t,d,null,r,M)}for(u in r)if(d=r[u],M=n[u],r.hasOwnProperty(u)&&(d!=null||M!=null))switch(u){case"value":G=d;break;case"defaultValue":k=d;break;case"multiple":v=d;default:d!==M&&De(e,t,u,d,r,M)}t=k,n=v,r=Y,G!=null?ei(e,!!n,G,!1):!!r!=!!n&&(t!=null?ei(e,!!n,t,!0):ei(e,!!n,n?[]:"",!1));return;case"textarea":Y=G=null;for(k in n)if(u=n[k],n.hasOwnProperty(k)&&u!=null&&!r.hasOwnProperty(k))switch(k){case"value":break;case"children":break;default:De(e,t,k,null,r,u)}for(v in r)if(u=r[v],d=n[v],r.hasOwnProperty(v)&&(u!=null||d!=null))switch(v){case"value":G=u;break;case"defaultValue":Y=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(l(91));break;default:u!==d&&De(e,t,v,u,r,d)}yp(e,G,Y);return;case"option":for(var se in n)if(G=n[se],n.hasOwnProperty(se)&&G!=null&&!r.hasOwnProperty(se))switch(se){case"selected":e.selected=!1;break;default:De(e,t,se,null,r,G)}for(M in r)if(G=r[M],Y=n[M],r.hasOwnProperty(M)&&G!==Y&&(G!=null||Y!=null))switch(M){case"selected":e.selected=G&&typeof G!="function"&&typeof G!="symbol";break;default:De(e,t,M,G,r,Y)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var de in n)G=n[de],n.hasOwnProperty(de)&&G!=null&&!r.hasOwnProperty(de)&&De(e,t,de,null,r,G);for(V in r)if(G=r[V],Y=n[V],r.hasOwnProperty(V)&&G!==Y&&(G!=null||Y!=null))switch(V){case"children":case"dangerouslySetInnerHTML":if(G!=null)throw Error(l(137,t));break;default:De(e,t,V,G,r,Y)}return;default:if(Fl(t)){for(var Oe in n)G=n[Oe],n.hasOwnProperty(Oe)&&G!==void 0&&!r.hasOwnProperty(Oe)&&Mu(e,t,Oe,void 0,r,G);for(I in r)G=r[I],Y=n[I],!r.hasOwnProperty(I)||G===Y||G===void 0&&Y===void 0||Mu(e,t,I,G,r,Y);return}}for(var L in n)G=n[L],n.hasOwnProperty(L)&&G!=null&&!r.hasOwnProperty(L)&&De(e,t,L,null,r,G);for(Z in r)G=r[Z],Y=n[Z],!r.hasOwnProperty(Z)||G===Y||G==null&&Y==null||De(e,t,Z,G,r,Y)}function Sm(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function y2(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),r=0;r<n.length;r++){var u=n[r],d=u.transferSize,v=u.initiatorType,k=u.duration;if(d&&k&&Sm(v)){for(v=0,k=u.responseEnd,r+=1;r<n.length;r++){var M=n[r],V=M.startTime;if(V>k)break;var I=M.transferSize,Z=M.initiatorType;I&&Sm(Z)&&(M=M.responseEnd,v+=I*(M<k?1:(k-V)/(M-V)))}if(--r,t+=8*(d+v)/(u.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Au=null,Ru=null;function vo(e){return e.nodeType===9?e:e.ownerDocument}function wm(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function km(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Du(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ou=null;function b2(){var e=window.event;return e&&e.type==="popstate"?e===Ou?!1:(Ou=e,!0):(Ou=null,!1)}var Nm=typeof setTimeout=="function"?setTimeout:void 0,v2=typeof clearTimeout=="function"?clearTimeout:void 0,Cm=typeof Promise=="function"?Promise:void 0,j2=typeof queueMicrotask=="function"?queueMicrotask:typeof Cm<"u"?function(e){return Cm.resolve(null).then(e).catch(S2)}:Nm;function S2(e){setTimeout(function(){throw e})}function on(e){return e==="head"}function Tm(e,t){var n=t,r=0;do{var u=n.nextSibling;if(e.removeChild(n),u&&u.nodeType===8)if(n=u.data,n==="/$"||n==="/&"){if(r===0){e.removeChild(u),Ri(t);return}r--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")r++;else if(n==="html")Br(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,Br(n);for(var d=n.firstChild;d;){var v=d.nextSibling,k=d.nodeName;d[er]||k==="SCRIPT"||k==="STYLE"||k==="LINK"&&d.rel.toLowerCase()==="stylesheet"||n.removeChild(d),d=v}}else n==="body"&&Br(e.ownerDocument.body);n=u}while(n);Ri(t)}function Em(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=r}while(n)}function Lu(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Lu(n),ql(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function w2(e,t,n,r){for(;e.nodeType===1;){var u=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(r){if(!e[er])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(d=e.getAttribute("rel"),d==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(d!==u.rel||e.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||e.getAttribute("title")!==(u.title==null?null:u.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(d=e.getAttribute("src"),(d!==(u.src==null?null:u.src)||e.getAttribute("type")!==(u.type==null?null:u.type)||e.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&d&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var d=u.name==null?null:""+u.name;if(u.type==="hidden"&&e.getAttribute("name")===d)return e}else return e;if(e=Xt(e.nextSibling),e===null)break}return null}function k2(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Xt(e.nextSibling),e===null))return null;return e}function zm(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Xt(e.nextSibling),e===null))return null;return e}function Bu(e){return e.data==="$?"||e.data==="$~"}function Uu(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function N2(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var r=function(){t(),n.removeEventListener("DOMContentLoaded",r)};n.addEventListener("DOMContentLoaded",r),e._reactRetry=r}}function Xt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Vu=null;function Mm(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return Xt(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function Am(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function Rm(e,t,n){switch(t=vo(n),e){case"html":if(e=t.documentElement,!e)throw Error(l(452));return e;case"head":if(e=t.head,!e)throw Error(l(453));return e;case"body":if(e=t.body,!e)throw Error(l(454));return e;default:throw Error(l(451))}}function Br(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);ql(e)}var Pt=new Map,Dm=new Set;function jo(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Ua=ee.d;ee.d={f:C2,r:T2,D:E2,C:z2,L:M2,m:A2,X:D2,S:R2,M:O2};function C2(){var e=Ua.f(),t=fo();return e||t}function T2(e){var t=Kn(e);t!==null&&t.tag===5&&t.type==="form"?Q0(t):Ua.r(e)}var zi=typeof document>"u"?null:document;function Om(e,t,n){var r=zi;if(r&&typeof t=="string"&&t){var u=_t(t);u='link[rel="'+e+'"][href="'+u+'"]',typeof n=="string"&&(u+='[crossorigin="'+n+'"]'),Dm.has(u)||(Dm.add(u),e={rel:e,crossOrigin:n,href:t},r.querySelector(u)===null&&(t=r.createElement("link"),ut(t,"link",e),tt(t),r.head.appendChild(t)))}}function E2(e){Ua.D(e),Om("dns-prefetch",e,null)}function z2(e,t){Ua.C(e,t),Om("preconnect",e,t)}function M2(e,t,n){Ua.L(e,t,n);var r=zi;if(r&&e&&t){var u='link[rel="preload"][as="'+_t(t)+'"]';t==="image"&&n&&n.imageSrcSet?(u+='[imagesrcset="'+_t(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(u+='[imagesizes="'+_t(n.imageSizes)+'"]')):u+='[href="'+_t(e)+'"]';var d=u;switch(t){case"style":d=Mi(e);break;case"script":d=Ai(e)}Pt.has(d)||(e=y({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),Pt.set(d,e),r.querySelector(u)!==null||t==="style"&&r.querySelector(Ur(d))||t==="script"&&r.querySelector(Vr(d))||(t=r.createElement("link"),ut(t,"link",e),tt(t),r.head.appendChild(t)))}}function A2(e,t){Ua.m(e,t);var n=zi;if(n&&e){var r=t&&typeof t.as=="string"?t.as:"script",u='link[rel="modulepreload"][as="'+_t(r)+'"][href="'+_t(e)+'"]',d=u;switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":d=Ai(e)}if(!Pt.has(d)&&(e=y({rel:"modulepreload",href:e},t),Pt.set(d,e),n.querySelector(u)===null)){switch(r){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(Vr(d)))return}r=n.createElement("link"),ut(r,"link",e),tt(r),n.head.appendChild(r)}}}function R2(e,t,n){Ua.S(e,t,n);var r=zi;if(r&&e){var u=Wn(r).hoistableStyles,d=Mi(e);t=t||"default";var v=u.get(d);if(!v){var k={loading:0,preload:null};if(v=r.querySelector(Ur(d)))k.loading=5;else{e=y({rel:"stylesheet",href:e,"data-precedence":t},n),(n=Pt.get(d))&&_u(e,n);var M=v=r.createElement("link");tt(M),ut(M,"link",e),M._p=new Promise(function(V,I){M.onload=V,M.onerror=I}),M.addEventListener("load",function(){k.loading|=1}),M.addEventListener("error",function(){k.loading|=2}),k.loading|=4,So(v,t,r)}v={type:"stylesheet",instance:v,count:1,state:k},u.set(d,v)}}}function D2(e,t){Ua.X(e,t);var n=zi;if(n&&e){var r=Wn(n).hoistableScripts,u=Ai(e),d=r.get(u);d||(d=n.querySelector(Vr(u)),d||(e=y({src:e,async:!0},t),(t=Pt.get(u))&&qu(e,t),d=n.createElement("script"),tt(d),ut(d,"link",e),n.head.appendChild(d)),d={type:"script",instance:d,count:1,state:null},r.set(u,d))}}function O2(e,t){Ua.M(e,t);var n=zi;if(n&&e){var r=Wn(n).hoistableScripts,u=Ai(e),d=r.get(u);d||(d=n.querySelector(Vr(u)),d||(e=y({src:e,async:!0,type:"module"},t),(t=Pt.get(u))&&qu(e,t),d=n.createElement("script"),tt(d),ut(d,"link",e),n.head.appendChild(d)),d={type:"script",instance:d,count:1,state:null},r.set(u,d))}}function Lm(e,t,n,r){var u=(u=be.current)?jo(u):null;if(!u)throw Error(l(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=Mi(n.href),n=Wn(u).hoistableStyles,r=n.get(t),r||(r={type:"style",instance:null,count:0,state:null},n.set(t,r)),r):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=Mi(n.href);var d=Wn(u).hoistableStyles,v=d.get(e);if(v||(u=u.ownerDocument||u,v={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},d.set(e,v),(d=u.querySelector(Ur(e)))&&!d._p&&(v.instance=d,v.state.loading=5),Pt.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},Pt.set(e,n),d||L2(u,e,n,v.state))),t&&r===null)throw Error(l(528,""));return v}if(t&&r!==null)throw Error(l(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=Ai(n),n=Wn(u).hoistableScripts,r=n.get(t),r||(r={type:"script",instance:null,count:0,state:null},n.set(t,r)),r):{type:"void",instance:null,count:0,state:null};default:throw Error(l(444,e))}}function Mi(e){return'href="'+_t(e)+'"'}function Ur(e){return'link[rel="stylesheet"]['+e+"]"}function Bm(e){return y({},e,{"data-precedence":e.precedence,precedence:null})}function L2(e,t,n,r){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?r.loading=1:(t=e.createElement("link"),r.preload=t,t.addEventListener("load",function(){return r.loading|=1}),t.addEventListener("error",function(){return r.loading|=2}),ut(t,"link",n),tt(t),e.head.appendChild(t))}function Ai(e){return'[src="'+_t(e)+'"]'}function Vr(e){return"script[async]"+e}function Um(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var r=e.querySelector('style[data-href~="'+_t(n.href)+'"]');if(r)return t.instance=r,tt(r),r;var u=y({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement("style"),tt(r),ut(r,"style",u),So(r,n.precedence,e),t.instance=r;case"stylesheet":u=Mi(n.href);var d=e.querySelector(Ur(u));if(d)return t.state.loading|=4,t.instance=d,tt(d),d;r=Bm(n),(u=Pt.get(u))&&_u(r,u),d=(e.ownerDocument||e).createElement("link"),tt(d);var v=d;return v._p=new Promise(function(k,M){v.onload=k,v.onerror=M}),ut(d,"link",r),t.state.loading|=4,So(d,n.precedence,e),t.instance=d;case"script":return d=Ai(n.src),(u=e.querySelector(Vr(d)))?(t.instance=u,tt(u),u):(r=n,(u=Pt.get(d))&&(r=y({},n),qu(r,u)),e=e.ownerDocument||e,u=e.createElement("script"),tt(u),ut(u,"link",r),e.head.appendChild(u),t.instance=u);case"void":return null;default:throw Error(l(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(r=t.instance,t.state.loading|=4,So(r,n.precedence,e));return t.instance}function So(e,t,n){for(var r=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=r.length?r[r.length-1]:null,d=u,v=0;v<r.length;v++){var k=r[v];if(k.dataset.precedence===t)d=k;else if(d!==u)break}d?d.parentNode.insertBefore(e,d.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function _u(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function qu(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var wo=null;function Vm(e,t,n){if(wo===null){var r=new Map,u=wo=new Map;u.set(n,r)}else u=wo,r=u.get(n),r||(r=new Map,u.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),u=0;u<n.length;u++){var d=n[u];if(!(d[er]||d[st]||e==="link"&&d.getAttribute("rel")==="stylesheet")&&d.namespaceURI!=="http://www.w3.org/2000/svg"){var v=d.getAttribute(t)||"";v=e+v;var k=r.get(v);k?k.push(d):r.set(v,[d])}}return r}function _m(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function B2(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;switch(t.rel){case"stylesheet":return e=t.disabled,typeof t.precedence=="string"&&e==null;default:return!0}case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function qm(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function U2(e,t,n,r){if(n.type==="stylesheet"&&(typeof r.media!="string"||matchMedia(r.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var u=Mi(r.href),d=t.querySelector(Ur(u));if(d){t=d._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=ko.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=d,tt(d);return}d=t.ownerDocument||t,r=Bm(r),(u=Pt.get(u))&&_u(r,u),d=d.createElement("link"),tt(d);var v=d;v._p=new Promise(function(k,M){v.onload=k,v.onerror=M}),ut(d,"link",r),n.instance=d}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=ko.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var Hu=0;function V2(e,t){return e.stylesheets&&e.count===0&&Co(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&Co(e,e.stylesheets),e.unsuspend){var d=e.unsuspend;e.unsuspend=null,d()}},6e4+t);0<e.imgBytes&&Hu===0&&(Hu=62500*y2());var u=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Co(e,e.stylesheets),e.unsuspend)){var d=e.unsuspend;e.unsuspend=null,d()}},(e.imgBytes>Hu?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(u)}}:null}function ko(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Co(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var No=null;function Co(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,No=new Map,t.forEach(_2,e),No=null,ko.call(e))}function _2(e,t){if(!(t.state.loading&4)){var n=No.get(e);if(n)var r=n.get(null);else{n=new Map,No.set(e,n);for(var u=e.querySelectorAll("link[data-precedence],style[data-precedence]"),d=0;d<u.length;d++){var v=u[d];(v.nodeName==="LINK"||v.getAttribute("media")!=="not all")&&(n.set(v.dataset.precedence,v),r=v)}r&&n.set(null,r)}u=t.instance,v=u.getAttribute("data-precedence"),d=n.get(v)||r,d===r&&n.set(null,u),n.set(v,u),this.count++,r=ko.bind(this),u.addEventListener("load",r),u.addEventListener("error",r),d?d.parentNode.insertBefore(u,d.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(u,e.firstChild)),t.state.loading|=4}}var _r={$$typeof:E,Provider:null,Consumer:null,_currentValue:ie,_currentValue2:ie,_threadCount:0};function q2(e,t,n,r,u,d,v,k,M){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Bl(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Bl(0),this.hiddenUpdates=Bl(null),this.identifierPrefix=r,this.onUncaughtError=u,this.onCaughtError=d,this.onRecoverableError=v,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=M,this.incompleteTransitions=new Map}function Hm(e,t,n,r,u,d,v,k,M,V,I,Z){return e=new q2(e,t,n,v,M,V,I,Z,k),t=1,d===!0&&(t|=24),d=At(3,null,null,t),e.current=d,d.stateNode=e,t=vc(),t.refCount++,e.pooledCache=t,t.refCount++,d.memoizedState={element:r,isDehydrated:n,cache:t},kc(d),e}function Gm(e){return e?(e=li,e):li}function Ym(e,t,n,r,u,d){u=Gm(u),r.context===null?r.context=u:r.pendingContext=u,r=Za(t),r.payload={element:n},d=d===void 0?null:d,d!==null&&(r.callback=d),n=Qa(e,r,t),n!==null&&(Nt(n,e,t),xr(n,e,t))}function Fm(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Gu(e,t){Fm(e,t),(e=e.alternate)&&Fm(e,t)}function Im(e){if(e.tag===13||e.tag===31){var t=Tn(e,67108864);t!==null&&Nt(t,e,67108864),Gu(e,67108864)}}function Xm(e){if(e.tag===13||e.tag===31){var t=Bt();t=Ul(t);var n=Tn(e,t);n!==null&&Nt(n,e,t),Gu(e,t)}}var To=!0;function H2(e,t,n,r){var u=q.T;q.T=null;var d=ee.p;try{ee.p=2,Yu(e,t,n,r)}finally{ee.p=d,q.T=u}}function G2(e,t,n,r){var u=q.T;q.T=null;var d=ee.p;try{ee.p=8,Yu(e,t,n,r)}finally{ee.p=d,q.T=u}}function Yu(e,t,n,r){if(To){var u=Fu(r);if(u===null)zu(e,t,r,Eo,n),$m(e,r);else if(F2(u,e,t,n,r))r.stopPropagation();else if($m(e,r),t&4&&-1<Y2.indexOf(e)){for(;u!==null;){var d=Kn(u);if(d!==null)switch(d.tag){case 3:if(d=d.stateNode,d.current.memoizedState.isDehydrated){var v=Sn(d.pendingLanes);if(v!==0){var k=d;for(k.pendingLanes|=2,k.entangledLanes|=2;v;){var M=1<<31-zt(v);k.entanglements[1]|=M,v&=~M}pa(d),(Ee&6)===0&&(co=Tt()+500,Dr(0))}}break;case 31:case 13:k=Tn(d,2),k!==null&&Nt(k,d,2),fo(),Gu(d,2)}if(d=Fu(r),d===null&&zu(e,t,r,Eo,n),d===u)break;u=d}u!==null&&r.stopPropagation()}else zu(e,t,r,null,n)}}function Fu(e){return e=Xl(e),Iu(e)}var Eo=null;function Iu(e){if(Eo=null,e=Qn(e),e!==null){var t=f(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=p(t),e!==null)return e;e=null}else if(n===31){if(e=m(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Eo=e,null}function Pm(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(E1()){case tp:return 2;case ap:return 8;case gs:case z1:return 32;case np:return 268435456;default:return 32}default:return 32}}var Xu=!1,ln=null,cn=null,un=null,qr=new Map,Hr=new Map,dn=[],Y2="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function $m(e,t){switch(e){case"focusin":case"focusout":ln=null;break;case"dragenter":case"dragleave":cn=null;break;case"mouseover":case"mouseout":un=null;break;case"pointerover":case"pointerout":qr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Hr.delete(t.pointerId)}}function Gr(e,t,n,r,u,d){return e===null||e.nativeEvent!==d?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:d,targetContainers:[u]},t!==null&&(t=Kn(t),t!==null&&Im(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,u!==null&&t.indexOf(u)===-1&&t.push(u),e)}function F2(e,t,n,r,u){switch(t){case"focusin":return ln=Gr(ln,e,t,n,r,u),!0;case"dragenter":return cn=Gr(cn,e,t,n,r,u),!0;case"mouseover":return un=Gr(un,e,t,n,r,u),!0;case"pointerover":var d=u.pointerId;return qr.set(d,Gr(qr.get(d)||null,e,t,n,r,u)),!0;case"gotpointercapture":return d=u.pointerId,Hr.set(d,Gr(Hr.get(d)||null,e,t,n,r,u)),!0}return!1}function Zm(e){var t=Qn(e.target);if(t!==null){var n=f(t);if(n!==null){if(t=n.tag,t===13){if(t=p(n),t!==null){e.blockedOn=t,cp(e.priority,function(){Xm(n)});return}}else if(t===31){if(t=m(n),t!==null){e.blockedOn=t,cp(e.priority,function(){Xm(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function zo(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Fu(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Il=r,n.target.dispatchEvent(r),Il=null}else return t=Kn(n),t!==null&&Im(t),e.blockedOn=n,!1;t.shift()}return!0}function Qm(e,t,n){zo(e)&&n.delete(t)}function I2(){Xu=!1,ln!==null&&zo(ln)&&(ln=null),cn!==null&&zo(cn)&&(cn=null),un!==null&&zo(un)&&(un=null),qr.forEach(Qm),Hr.forEach(Qm)}function Mo(e,t){e.blockedOn===t&&(e.blockedOn=null,Xu||(Xu=!0,a.unstable_scheduleCallback(a.unstable_NormalPriority,I2)))}var Ao=null;function Km(e){Ao!==e&&(Ao=e,a.unstable_scheduleCallback(a.unstable_NormalPriority,function(){Ao===e&&(Ao=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],u=e[t+2];if(typeof r!="function"){if(Iu(r||n)===null)continue;break}var d=Kn(n);d!==null&&(e.splice(t,3),t-=3,Fc(d,{pending:!0,data:u,method:n.method,action:r},r,u))}}))}function Ri(e){function t(M){return Mo(M,e)}ln!==null&&Mo(ln,e),cn!==null&&Mo(cn,e),un!==null&&Mo(un,e),qr.forEach(t),Hr.forEach(t);for(var n=0;n<dn.length;n++){var r=dn[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<dn.length&&(n=dn[0],n.blockedOn===null);)Zm(n),n.blockedOn===null&&dn.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var u=n[r],d=n[r+1],v=u[bt]||null;if(typeof d=="function")v||Km(n);else if(v){var k=null;if(d&&d.hasAttribute("formAction")){if(u=d,v=d[bt]||null)k=v.formAction;else if(Iu(u)!==null)continue}else k=v.action;typeof k=="function"?n[r+1]=k:(n.splice(r,3),r-=3),Km(n)}}}function Wm(){function e(d){d.canIntercept&&d.info==="react-transition"&&d.intercept({handler:function(){return new Promise(function(v){return u=v})},focusReset:"manual",scroll:"manual"})}function t(){u!==null&&(u(),u=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var d=navigation.currentEntry;d&&d.url!=null&&navigation.navigate(d.url,{state:d.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var r=!1,u=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),u!==null&&(u(),u=null)}}}function Pu(e){this._internalRoot=e}Ro.prototype.render=Pu.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(l(409));var n=t.current,r=Bt();Ym(n,r,e,t,null,null)},Ro.prototype.unmount=Pu.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Ym(e.current,2,null,e,null,null),fo(),t[Zn]=null}};function Ro(e){this._internalRoot=e}Ro.prototype.unstable_scheduleHydration=function(e){if(e){var t=lp();e={blockedOn:null,target:e,priority:t};for(var n=0;n<dn.length&&t!==0&&t<dn[n].priority;n++);dn.splice(n,0,e),n===0&&Zm(e)}};var Jm=i.version;if(Jm!=="19.2.7")throw Error(l(527,Jm,"19.2.7"));ee.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(l(188)):(e=Object.keys(e).join(","),Error(l(268,e)));return e=g(t),e=e!==null?b(e):null,e=e===null?null:e.stateNode,e};var X2={bundleType:0,version:"19.2.7",rendererPackageName:"react-dom",currentDispatcherRef:q,reconcilerVersion:"19.2.7"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Do=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Do.isDisabled&&Do.supportsFiber)try{Ki=Do.inject(X2),Et=Do}catch{}}return Fr.createRoot=function(e,t){if(!c(e))throw Error(l(299));var n=!1,r="",u=sh,d=oh,v=lh;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(u=t.onUncaughtError),t.onCaughtError!==void 0&&(d=t.onCaughtError),t.onRecoverableError!==void 0&&(v=t.onRecoverableError)),t=Hm(e,1,!1,null,null,n,r,null,u,d,v,Wm),e[Zn]=t.current,Eu(e),new Pu(t)},Fr.hydrateRoot=function(e,t,n){if(!c(e))throw Error(l(299));var r=!1,u="",d=sh,v=oh,k=lh,M=null;return n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(u=n.identifierPrefix),n.onUncaughtError!==void 0&&(d=n.onUncaughtError),n.onCaughtError!==void 0&&(v=n.onCaughtError),n.onRecoverableError!==void 0&&(k=n.onRecoverableError),n.formState!==void 0&&(M=n.formState)),t=Hm(e,1,!0,t,n??null,r,u,M,d,v,k,Wm),t.context=Gm(null),n=t.current,r=Bt(),r=Ul(r),u=Za(r),u.callback=null,Qa(n,u,r),n=r,t.current.lanes=n,Ji(t,n),pa(t),e[Zn]=t.current,Eu(e),new Ro(t)},Fr.version="19.2.7",Fr}var cg;function a5(){if(cg)return Qu.exports;cg=1;function a(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)}catch(i){console.error(i)}}return a(),Qu.exports=t5(),Qu.exports}var n5=a5();/**
 * react-router v7.18.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */var hf=/^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i,iy=/^[\\/]{2}/;function i5(a,i){return i+a.replace(/\\/g,"/")}var ug="popstate";function dg(a){return typeof a=="object"&&a!=null&&"pathname"in a&&"search"in a&&"hash"in a&&"state"in a&&"key"in a}function r5(a={}){function i(l,c){var g;let f=(g=c.state)==null?void 0:g.masked,{pathname:p,search:m,hash:h}=f||l.location;return Ld("",{pathname:p,search:m,hash:h},c.state&&c.state.usr||null,c.state&&c.state.key||"default",f?{pathname:l.location.pathname,search:l.location.search,hash:l.location.hash}:void 0)}function o(l,c){return typeof c=="string"?c:ts(c)}return o5(i,o,null,a)}function He(a,i){if(a===!1||a===null||typeof a>"u")throw new Error(i)}function la(a,i){if(!a){typeof console<"u"&&console.warn(i);try{throw new Error(i)}catch{}}}function s5(){return Math.random().toString(36).substring(2,10)}function fg(a,i){return{usr:a.state,key:a.key,idx:i,masked:a.mask?{pathname:a.pathname,search:a.search,hash:a.hash}:void 0}}function Ld(a,i,o=null,l,c){return{pathname:typeof a=="string"?a:a.pathname,search:"",hash:"",...typeof i=="string"?_i(i):i,state:o,key:i&&i.key||l||s5(),mask:c}}function ts({pathname:a="/",search:i="",hash:o=""}){return i&&i!=="?"&&(a+=i.charAt(0)==="?"?i:"?"+i),o&&o!=="#"&&(a+=o.charAt(0)==="#"?o:"#"+o),a}function _i(a){let i={};if(a){let o=a.indexOf("#");o>=0&&(i.hash=a.substring(o),a=a.substring(0,o));let l=a.indexOf("?");l>=0&&(i.search=a.substring(l),a=a.substring(0,l)),a&&(i.pathname=a)}return i}function o5(a,i,o,l={}){let{window:c=document.defaultView,v5Compat:f=!1}=l,p=c.history,m="POP",h=null,g=b();g==null&&(g=0,p.replaceState({...p.state,idx:g},""));function b(){return(p.state||{idx:null}).idx}function y(){m="POP";let C=b(),T=C==null?null:C-g;g=C,h&&h({action:m,location:N.location,delta:T})}function x(C,T){m="PUSH";let z=dg(C)?C:Ld(N.location,C,T);g=b()+1;let E=fg(z,g),A=N.createHref(z.mask||z);try{p.pushState(E,"",A)}catch(R){if(R instanceof DOMException&&R.name==="DataCloneError")throw R;c.location.assign(A)}f&&h&&h({action:m,location:N.location,delta:1})}function w(C,T){m="REPLACE";let z=dg(C)?C:Ld(N.location,C,T);g=b();let E=fg(z,g),A=N.createHref(z.mask||z);p.replaceState(E,"",A),f&&h&&h({action:m,location:N.location,delta:0})}function S(C){return l5(c,C)}let N={get action(){return m},get location(){return a(c,p)},listen(C){if(h)throw new Error("A history only accepts one active listener");return c.addEventListener(ug,y),h=C,()=>{c.removeEventListener(ug,y),h=null}},createHref(C){return i(c,C)},createURL:S,encodeLocation(C){let T=S(C);return{pathname:T.pathname,search:T.search,hash:T.hash}},push:x,replace:w,go(C){return p.go(C)}};return N}function l5(a,i,o=!1){let l="http://localhost";a&&(l=a.location.origin!=="null"?a.location.origin:a.location.href),He(l,"No window.location.(origin|href) available to create URL");let c=typeof i=="string"?i:ts(i);return c=c.replace(/ $/,"%20"),!o&&iy.test(c)&&(c=l+c),new URL(c,l)}function ry(a,i,o="/"){return c5(a,i,o,!1)}function c5(a,i,o,l,c){let f=typeof i=="string"?_i(i):i,p=_a(f.pathname||"/",o);if(p==null)return null;let m=u5(a),h=null,g=j5(p);for(let b=0;h==null&&b<m.length;++b)h=v5(m[b],g,l);return h}function u5(a){let i=sy(a);return d5(i),i}function sy(a,i=[],o=[],l="",c=!1){let f=(p,m,h=c,g)=>{let b={relativePath:g===void 0?p.path||"":g,caseSensitive:p.caseSensitive===!0,childrenIndex:m,route:p};if(b.relativePath.startsWith("/")){if(!b.relativePath.startsWith(l)&&h)return;He(b.relativePath.startsWith(l),`Absolute route path "${b.relativePath}" nested under path "${l}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),b.relativePath=b.relativePath.slice(l.length)}let y=sa([l,b.relativePath]),x=o.concat(b);p.children&&p.children.length>0&&(He(p.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${y}".`),sy(p.children,i,x,y,h)),!(p.path==null&&!p.index)&&i.push({path:y,score:y5(y,p.index),routesMeta:x.map((w,S)=>{let[N,C]=cy(w.relativePath,w.caseSensitive,S===x.length-1);return{...w,matcher:N,compiledParams:C}})})};return a.forEach((p,m)=>{var h;if(p.path===""||!((h=p.path)!=null&&h.includes("?")))f(p,m);else for(let g of oy(p.path))f(p,m,!0,g)}),i}function oy(a){let i=a.split("/");if(i.length===0)return[];let[o,...l]=i,c=o.endsWith("?"),f=o.replace(/\?$/,"");if(l.length===0)return c?[f,""]:[f];let p=oy(l.join("/")),m=[];return m.push(...p.map(h=>h===""?f:[f,h].join("/"))),c&&m.push(...p),m.map(h=>a.startsWith("/")&&h===""?"/":h)}function d5(a){a.sort((i,o)=>i.score!==o.score?o.score-i.score:b5(i.routesMeta.map(l=>l.childrenIndex),o.routesMeta.map(l=>l.childrenIndex)))}var f5=/^:[\w-]+$/,p5=3,h5=2,m5=1,g5=10,x5=-2,pg=a=>a==="*";function y5(a,i){let o=a.split("/"),l=o.length;return o.some(pg)&&(l+=x5),i&&(l+=h5),o.filter(c=>!pg(c)).reduce((c,f)=>c+(f5.test(f)?p5:f===""?m5:g5),l)}function b5(a,i){return a.length===i.length&&a.slice(0,-1).every((l,c)=>l===i[c])?a[a.length-1]-i[i.length-1]:0}function v5(a,i,o=!1){let{routesMeta:l}=a,c={},f="/",p=[];for(let m=0;m<l.length;++m){let h=l[m],g=m===l.length-1,b=f==="/"?i:i.slice(f.length)||"/",y={path:h.relativePath,caseSensitive:h.caseSensitive,end:g},x=h.matcher&&h.compiledParams?ly(y,b,h.matcher,h.compiledParams):rl(y,b),w=h.route;if(!x&&g&&o&&!l[l.length-1].route.index&&(x=rl({path:h.relativePath,caseSensitive:h.caseSensitive,end:!1},b)),!x)return null;Object.assign(c,x.params),p.push({params:c,pathname:sa([f,x.pathname]),pathnameBase:k5(sa([f,x.pathnameBase])),route:w}),x.pathnameBase!=="/"&&(f=sa([f,x.pathnameBase]))}return p}function rl(a,i){typeof a=="string"&&(a={path:a,caseSensitive:!1,end:!0});let[o,l]=cy(a.path,a.caseSensitive,a.end);return ly(a,i,o,l)}function ly(a,i,o,l){let c=i.match(o);if(!c)return null;let f=c[0],p=f.replace(/(.)\/+$/,"$1"),m=c.slice(1);return{params:l.reduce((g,{paramName:b,isOptional:y},x)=>{if(b==="*"){let S=m[x]||"";p=f.slice(0,f.length-S.length).replace(/(.)\/+$/,"$1")}const w=m[x];return y&&!w?g[b]=void 0:g[b]=(w||"").replace(/%2F/g,"/"),g},{}),pathname:f,pathnameBase:p,pattern:a}}function cy(a,i=!1,o=!0){la(a==="*"||!a.endsWith("*")||a.endsWith("/*"),`Route path "${a}" will be treated as if it were "${a.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${a.replace(/\*$/,"/*")}".`);let l=[],c="^"+a.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(p,m,h,g,b)=>{if(l.push({paramName:m,isOptional:h!=null}),h){let y=b.charAt(g+p.length);return y&&y!=="/"?"/([^\\/]*)":"(?:/([^\\/]*))?"}return"/([^\\/]+)"}).replace(/\/([\w-]+)\?(\/|$)/g,"(/$1)?$2");return a.endsWith("*")?(l.push({paramName:"*"}),c+=a==="*"||a==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):o?c+="\\/*$":a!==""&&a!=="/"&&(c+="(?:(?=\\/|$))"),[new RegExp(c,i?void 0:"i"),l]}function j5(a){try{return a.split("/").map(i=>decodeURIComponent(i).replace(/\//g,"%2F")).join("/")}catch(i){return la(!1,`The URL path "${a}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${i}).`),a}}function _a(a,i){if(i==="/")return a;if(!a.toLowerCase().startsWith(i.toLowerCase()))return null;let o=i.endsWith("/")?i.length-1:i.length,l=a.charAt(o);return l&&l!=="/"?null:a.slice(o)||"/"}function S5(a,i="/"){let{pathname:o,search:l="",hash:c=""}=typeof a=="string"?_i(a):a,f;return o?(o=dy(o),o.startsWith("/")?f=hg(o.substring(1),"/"):f=hg(o,i)):f=i,{pathname:f,search:N5(l),hash:C5(c)}}function hg(a,i){let o=sl(i).split("/");return a.split("/").forEach(c=>{c===".."?o.length>1&&o.pop():c!=="."&&o.push(c)}),o.length>1?o.join("/"):"/"}function ed(a,i,o,l){return`Cannot include a '${a}' character in a manually specified \`to.${i}\` field [${JSON.stringify(l)}].  Please separate it out to the \`to.${o}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function w5(a){return a.filter((i,o)=>o===0||i.route.path&&i.route.path.length>0)}function uy(a){let i=w5(a);return i.map((o,l)=>l===i.length-1?o.pathname:o.pathnameBase)}function mf(a,i,o,l=!1){let c;typeof a=="string"?c=_i(a):(c={...a},He(!c.pathname||!c.pathname.includes("?"),ed("?","pathname","search",c)),He(!c.pathname||!c.pathname.includes("#"),ed("#","pathname","hash",c)),He(!c.search||!c.search.includes("#"),ed("#","search","hash",c)));let f=a===""||c.pathname==="",p=f?"/":c.pathname,m;if(p==null)m=o;else{let y=i.length-1;if(!l&&p.startsWith("..")){let x=p.split("/");for(;x[0]==="..";)x.shift(),y-=1;c.pathname=x.join("/")}m=y>=0?i[y]:"/"}let h=S5(c,m),g=p&&p!=="/"&&p.endsWith("/"),b=(f||p===".")&&o.endsWith("/");return!h.pathname.endsWith("/")&&(g||b)&&(h.pathname+="/"),h}var dy=a=>a.replace(/[\\/]{2,}/g,"/"),sa=a=>dy(a.join("/")),sl=a=>a.replace(/\/+$/,""),k5=a=>sl(a).replace(/^\/*/,"/"),N5=a=>!a||a==="?"?"":a.startsWith("?")?a:"?"+a,C5=a=>!a||a==="#"?"":a.startsWith("#")?a:"#"+a,T5=class{constructor(a,i,o,l=!1){this.status=a,this.statusText=i||"",this.internal=l,o instanceof Error?(this.data=o.toString(),this.error=o):this.data=o}};function E5(a){return a!=null&&typeof a.status=="number"&&typeof a.statusText=="string"&&typeof a.internal=="boolean"&&"data"in a}function z5(a){let i=a.map(o=>o.route.path).filter(Boolean);return sa(i)||"/"}var fy=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";function py(a,i){let o=a;if(typeof o!="string"||!hf.test(o))return{absoluteURL:void 0,isExternal:!1,to:o};let l=o,c=!1;if(fy)try{let f=new URL(window.location.href),p=iy.test(o)?new URL(i5(o,f.protocol)):new URL(o),m=_a(p.pathname,i);p.origin===f.origin&&m!=null?o=m+p.search+p.hash:c=!0}catch{la(!1,`<Link to="${o}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}return{absoluteURL:l,isExternal:c,to:o}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");var hy=["POST","PUT","PATCH","DELETE"];new Set(hy);var M5=["GET",...hy];new Set(M5);var A5=["about:","blob:","chrome:","chrome-untrusted:","content:","data:","devtools:","file:","filesystem:","javascript:"];function R5(a){try{return A5.includes(new URL(a).protocol)}catch{return!1}}var qi=j.createContext(null);qi.displayName="DataRouter";var vl=j.createContext(null);vl.displayName="DataRouterState";var my=j.createContext(!1);function D5(){return j.useContext(my)}var gy=j.createContext({isTransitioning:!1});gy.displayName="ViewTransition";var O5=j.createContext(new Map);O5.displayName="Fetchers";var L5=j.createContext(null);L5.displayName="Await";var ea=j.createContext(null);ea.displayName="Navigation";var os=j.createContext(null);os.displayName="Location";var ba=j.createContext({outlet:null,matches:[],isDataRoute:!1});ba.displayName="Route";var gf=j.createContext(null);gf.displayName="RouteError";var xy="REACT_ROUTER_ERROR",B5="REDIRECT",U5="ROUTE_ERROR_RESPONSE";function V5(a){if(a.startsWith(`${xy}:${B5}:{`))try{let i=JSON.parse(a.slice(28));if(typeof i=="object"&&i&&typeof i.status=="number"&&typeof i.statusText=="string"&&typeof i.location=="string"&&typeof i.reloadDocument=="boolean"&&typeof i.replace=="boolean")return i}catch{}}function _5(a){if(a.startsWith(`${xy}:${U5}:{`))try{let i=JSON.parse(a.slice(40));if(typeof i=="object"&&i&&typeof i.status=="number"&&typeof i.statusText=="string")return new T5(i.status,i.statusText,i.data)}catch{}}function q5(a,{relative:i}={}){He(ls(),"useHref() may be used only in the context of a <Router> component.");let{basename:o,navigator:l}=j.useContext(ea),{hash:c,pathname:f,search:p}=us(a,{relative:i}),m=f;return o!=="/"&&(m=f==="/"?o:sa([o,f])),l.createHref({pathname:m,search:p,hash:c})}function ls(){return j.useContext(os)!=null}function ca(){return He(ls(),"useLocation() may be used only in the context of a <Router> component."),j.useContext(os).location}var yy="You should call navigate() in a React.useEffect(), not when your component is first rendered.";function by(a){j.useContext(ea).static||j.useLayoutEffect(a)}function cs(){let{isDataRoute:a}=j.useContext(ba);return a?e4():H5()}function H5(){He(ls(),"useNavigate() may be used only in the context of a <Router> component.");let a=j.useContext(qi),{basename:i,navigator:o}=j.useContext(ea),{matches:l}=j.useContext(ba),{pathname:c}=ca(),f=JSON.stringify(uy(l)),p=j.useRef(!1);return by(()=>{p.current=!0}),j.useCallback((h,g={})=>{if(la(p.current,yy),!p.current)return;if(typeof h=="number"){o.go(h);return}let b=mf(h,JSON.parse(f),c,g.relative==="path");a==null&&i!=="/"&&(b.pathname=b.pathname==="/"?i:sa([i,b.pathname])),(g.replace?o.replace:o.push)(b,g.state,g)},[i,o,f,c,a])}j.createContext(null);function G5(){let{matches:a}=j.useContext(ba),i=a[a.length-1];return(i==null?void 0:i.params)??{}}function us(a,{relative:i}={}){let{matches:o}=j.useContext(ba),{pathname:l}=ca(),c=JSON.stringify(uy(o));return j.useMemo(()=>mf(a,JSON.parse(c),l,i==="path"),[a,c,l,i])}function Y5(a,i){return vy(a,i)}function vy(a,i,o){var C;He(ls(),"useRoutes() may be used only in the context of a <Router> component.");let{navigator:l}=j.useContext(ea),{matches:c}=j.useContext(ba),f=c[c.length-1],p=f?f.params:{},m=f?f.pathname:"/",h=f?f.pathnameBase:"/",g=f&&f.route;{let T=g&&g.path||"";Sy(m,!g||T.endsWith("*")||T.endsWith("*?"),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${m}" (under <Route path="${T}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${T}"> to <Route path="${T==="/"?"*":`${T}/*`}">.`)}let b=ca(),y;if(i){let T=typeof i=="string"?_i(i):i;He(h==="/"||((C=T.pathname)==null?void 0:C.startsWith(h)),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${h}" but pathname "${T.pathname}" was given in the \`location\` prop.`),y=T}else y=b;let x=y.pathname||"/",w=x;if(h!=="/"){let T=h.replace(/^\//,"").split("/");w="/"+x.replace(/^\//,"").split("/").slice(T.length).join("/")}let S=o&&o.state.matches.length?o.state.matches.map(T=>Object.assign(T,{route:o.manifest[T.route.id]||T.route})):ry(a,{pathname:w});la(g||S!=null,`No routes matched location "${y.pathname}${y.search}${y.hash}" `),la(S==null||S[S.length-1].route.element!==void 0||S[S.length-1].route.Component!==void 0||S[S.length-1].route.lazy!==void 0,`Matched leaf route at location "${y.pathname}${y.search}${y.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let N=$5(S&&S.map(T=>Object.assign({},T,{params:Object.assign({},p,T.params),pathname:sa([h,l.encodeLocation?l.encodeLocation(T.pathname.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:T.pathname]),pathnameBase:T.pathnameBase==="/"?h:sa([h,l.encodeLocation?l.encodeLocation(T.pathnameBase.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:T.pathnameBase])})),c,o);return i&&N?j.createElement(os.Provider,{value:{location:{pathname:"/",search:"",hash:"",state:null,key:"default",mask:void 0,...y},navigationType:"POP"}},N):N}function F5(){let a=J5(),i=E5(a)?`${a.status} ${a.statusText}`:a instanceof Error?a.message:JSON.stringify(a),o=a instanceof Error?a.stack:null,l="rgba(200,200,200, 0.5)",c={padding:"0.5rem",backgroundColor:l},f={padding:"2px 4px",backgroundColor:l},p=null;return console.error("Error handled by React Router default ErrorBoundary:",a),p=j.createElement(j.Fragment,null,j.createElement("p",null,"💿 Hey developer 👋"),j.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",j.createElement("code",{style:f},"ErrorBoundary")," or"," ",j.createElement("code",{style:f},"errorElement")," prop on your route.")),j.createElement(j.Fragment,null,j.createElement("h2",null,"Unexpected Application Error!"),j.createElement("h3",{style:{fontStyle:"italic"}},i),o?j.createElement("pre",{style:c},o):null,p)}var I5=j.createElement(F5,null),jy=class extends j.Component{constructor(a){super(a),this.state={location:a.location,revalidation:a.revalidation,error:a.error}}static getDerivedStateFromError(a){return{error:a}}static getDerivedStateFromProps(a,i){return i.location!==a.location||i.revalidation!=="idle"&&a.revalidation==="idle"?{error:a.error,location:a.location,revalidation:a.revalidation}:{error:a.error!==void 0?a.error:i.error,location:i.location,revalidation:a.revalidation||i.revalidation}}componentDidCatch(a,i){this.props.onError?this.props.onError(a,i):console.error("React Router caught the following error during render",a)}render(){let a=this.state.error;if(this.context&&typeof a=="object"&&a&&"digest"in a&&typeof a.digest=="string"){const o=_5(a.digest);o&&(a=o)}let i=a!==void 0?j.createElement(ba.Provider,{value:this.props.routeContext},j.createElement(gf.Provider,{value:a,children:this.props.component})):this.props.children;return this.context?j.createElement(X5,{error:a},i):i}};jy.contextType=my;var td=new WeakMap;function X5({children:a,error:i}){let{basename:o}=j.useContext(ea);if(typeof i=="object"&&i&&"digest"in i&&typeof i.digest=="string"){let l=V5(i.digest);if(l){let c=td.get(i);if(c)throw c;let f=py(l.location,o),p=f.absoluteURL||f.to;if(R5(p))throw new Error("Invalid redirect location");if(fy&&!td.get(i))if(f.isExternal||l.reloadDocument)window.location.href=p;else{const m=Promise.resolve().then(()=>window.__reactRouterDataRouter.navigate(f.to,{replace:l.replace}));throw td.set(i,m),m}return j.createElement("meta",{httpEquiv:"refresh",content:`0;url=${p}`})}}return a}function P5({routeContext:a,match:i,children:o}){let l=j.useContext(qi);return l&&l.static&&l.staticContext&&(i.route.errorElement||i.route.ErrorBoundary)&&(l.staticContext._deepestRenderedBoundaryId=i.route.id),j.createElement(ba.Provider,{value:a},o)}function $5(a,i=[],o){let l=o==null?void 0:o.state;if(a==null){if(!l)return null;if(l.errors)a=l.matches;else if(i.length===0&&!l.initialized&&l.matches.length>0)a=l.matches;else return null}let c=a,f=l==null?void 0:l.errors;if(f!=null){let b=c.findIndex(y=>y.route.id&&(f==null?void 0:f[y.route.id])!==void 0);He(b>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(f).join(",")}`),c=c.slice(0,Math.min(c.length,b+1))}let p=!1,m=-1;if(o&&l){p=l.renderFallback;for(let b=0;b<c.length;b++){let y=c[b];if((y.route.HydrateFallback||y.route.hydrateFallbackElement)&&(m=b),y.route.id){let{loaderData:x,errors:w}=l,S=y.route.loader&&!x.hasOwnProperty(y.route.id)&&(!w||w[y.route.id]===void 0);if(y.route.lazy||S){o.isStatic&&(p=!0),m>=0?c=c.slice(0,m+1):c=[c[0]];break}}}}let h=o==null?void 0:o.onError,g=l&&h?(b,y)=>{var x,w;h(b,{location:l.location,params:((w=(x=l.matches)==null?void 0:x[0])==null?void 0:w.params)??{},pattern:z5(l.matches),errorInfo:y})}:void 0;return c.reduceRight((b,y,x)=>{let w,S=!1,N=null,C=null;l&&(w=f&&y.route.id?f[y.route.id]:void 0,N=y.route.errorElement||I5,p&&(m<0&&x===0?(Sy("route-fallback",!1,"No `HydrateFallback` element provided to render during initial hydration"),S=!0,C=null):m===x&&(S=!0,C=y.route.hydrateFallbackElement||null)));let T=i.concat(c.slice(0,x+1)),z=()=>{let E;return w?E=N:S?E=C:y.route.Component?E=j.createElement(y.route.Component,null):y.route.element?E=y.route.element:E=b,j.createElement(P5,{match:y,routeContext:{outlet:b,matches:T,isDataRoute:l!=null},children:E})};return l&&(y.route.ErrorBoundary||y.route.errorElement||x===0)?j.createElement(jy,{location:l.location,revalidation:l.revalidation,component:N,error:w,children:z(),routeContext:{outlet:null,matches:T,isDataRoute:!0},onError:g}):z()},null)}function xf(a){return`${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function Z5(a){let i=j.useContext(qi);return He(i,xf(a)),i}function Q5(a){let i=j.useContext(vl);return He(i,xf(a)),i}function K5(a){let i=j.useContext(ba);return He(i,xf(a)),i}function yf(a){let i=K5(a),o=i.matches[i.matches.length-1];return He(o.route.id,`${a} can only be used on routes that contain a unique "id"`),o.route.id}function W5(){return yf("useRouteId")}function J5(){var l;let a=j.useContext(gf),i=Q5("useRouteError"),o=yf("useRouteError");return a!==void 0?a:(l=i.errors)==null?void 0:l[o]}function e4(){let{router:a}=Z5("useNavigate"),i=yf("useNavigate"),o=j.useRef(!1);return by(()=>{o.current=!0}),j.useCallback(async(c,f={})=>{la(o.current,yy),o.current&&(typeof c=="number"?await a.navigate(c):await a.navigate(c,{fromRouteId:i,...f}))},[a,i])}var mg={};function Sy(a,i,o){!i&&!mg[a]&&(mg[a]=!0,la(!1,o))}j.memo(t4);function t4({routes:a,manifest:i,future:o,state:l,isStatic:c,onError:f}){return vy(a,void 0,{manifest:i,state:l,isStatic:c,onError:f})}function nt(a){He(!1,"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")}function a4({basename:a="/",children:i=null,location:o,navigationType:l="POP",navigator:c,static:f=!1,useTransitions:p}){He(!ls(),"You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");let m=a.replace(/^\/*/,"/"),h=j.useMemo(()=>({basename:m,navigator:c,static:f,useTransitions:p,future:{}}),[m,c,f,p]);typeof o=="string"&&(o=_i(o));let{pathname:g="/",search:b="",hash:y="",state:x=null,key:w="default",mask:S}=o,N=j.useMemo(()=>{let C=_a(g,m);return C==null?null:{location:{pathname:C,search:b,hash:y,state:x,key:w,mask:S},navigationType:l}},[m,g,b,y,x,w,l,S]);return la(N!=null,`<Router basename="${m}"> is not able to match the URL "${g}${b}${y}" because it does not start with the basename, so the <Router> won't render anything.`),N==null?null:j.createElement(ea.Provider,{value:h},j.createElement(os.Provider,{children:i,value:N}))}function n4({children:a,location:i}){return Y5(Bd(a),i)}function Bd(a,i=[]){let o=[];return j.Children.forEach(a,(l,c)=>{if(!j.isValidElement(l))return;let f=[...i,c];if(l.type===j.Fragment){o.push.apply(o,Bd(l.props.children,f));return}He(l.type===nt,`[${typeof l.type=="string"?l.type:l.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),He(!l.props.index||!l.props.children,"An index route cannot have child routes.");let p={id:l.props.id||f.join("-"),caseSensitive:l.props.caseSensitive,element:l.props.element,Component:l.props.Component,index:l.props.index,path:l.props.path,middleware:l.props.middleware,loader:l.props.loader,action:l.props.action,hydrateFallbackElement:l.props.hydrateFallbackElement,HydrateFallback:l.props.HydrateFallback,errorElement:l.props.errorElement,ErrorBoundary:l.props.ErrorBoundary,hasErrorBoundary:l.props.hasErrorBoundary===!0||l.props.ErrorBoundary!=null||l.props.errorElement!=null,shouldRevalidate:l.props.shouldRevalidate,handle:l.props.handle,lazy:l.props.lazy};l.props.children&&(p.children=Bd(l.props.children,f)),o.push(p)}),o}var Po="get",$o="application/x-www-form-urlencoded";function jl(a){return typeof HTMLElement<"u"&&a instanceof HTMLElement}function i4(a){return jl(a)&&a.tagName.toLowerCase()==="button"}function r4(a){return jl(a)&&a.tagName.toLowerCase()==="form"}function s4(a){return jl(a)&&a.tagName.toLowerCase()==="input"}function o4(a){return!!(a.metaKey||a.altKey||a.ctrlKey||a.shiftKey)}function l4(a,i){return a.button===0&&(!i||i==="_self")&&!o4(a)}function Ud(a=""){return new URLSearchParams(typeof a=="string"||Array.isArray(a)||a instanceof URLSearchParams?a:Object.keys(a).reduce((i,o)=>{let l=a[o];return i.concat(Array.isArray(l)?l.map(c=>[o,c]):[[o,l]])},[]))}function c4(a,i){let o=Ud(a);return i&&i.forEach((l,c)=>{o.has(c)||i.getAll(c).forEach(f=>{o.append(c,f)})}),o}var Oo=null;function u4(){if(Oo===null)try{new FormData(document.createElement("form"),0),Oo=!1}catch{Oo=!0}return Oo}var d4=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);function ad(a){return a!=null&&!d4.has(a)?(la(!1,`"${a}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${$o}"`),null):a}function f4(a,i){let o,l,c,f,p;if(r4(a)){let m=a.getAttribute("action");l=m?_a(m,i):null,o=a.getAttribute("method")||Po,c=ad(a.getAttribute("enctype"))||$o,f=new FormData(a)}else if(i4(a)||s4(a)&&(a.type==="submit"||a.type==="image")){let m=a.form;if(m==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let h=a.getAttribute("formaction")||m.getAttribute("action");if(l=h?_a(h,i):null,o=a.getAttribute("formmethod")||m.getAttribute("method")||Po,c=ad(a.getAttribute("formenctype"))||ad(m.getAttribute("enctype"))||$o,f=new FormData(m,a),!u4()){let{name:g,type:b,value:y}=a;if(b==="image"){let x=g?`${g}.`:"";f.append(`${x}x`,"0"),f.append(`${x}y`,"0")}else g&&f.append(g,y)}}else{if(jl(a))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');o=Po,l=null,c=$o,p=a}return f&&c==="text/plain"&&(p=f,f=void 0),{action:l,method:o.toLowerCase(),encType:c,formData:f,body:p}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function bf(a,i){if(a===!1||a===null||typeof a>"u")throw new Error(i)}function wy(a,i,o,l){let c=typeof a=="string"?new URL(a,typeof window>"u"?"server://singlefetch/":window.location.origin):a;return o?c.pathname.endsWith("/")?c.pathname=`${c.pathname}_.${l}`:c.pathname=`${c.pathname}.${l}`:c.pathname==="/"?c.pathname=`_root.${l}`:i&&_a(c.pathname,i)==="/"?c.pathname=`${sl(i)}/_root.${l}`:c.pathname=`${sl(c.pathname)}.${l}`,c}async function p4(a,i){if(a.id in i)return i[a.id];try{let o=await import(a.module);return i[a.id]=o,o}catch(o){return console.error(`Error loading route module \`${a.module}\`, reloading page...`),console.error(o),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function h4(a){return a==null?!1:a.href==null?a.rel==="preload"&&typeof a.imageSrcSet=="string"&&typeof a.imageSizes=="string":typeof a.rel=="string"&&typeof a.href=="string"}async function m4(a,i,o){let l=await Promise.all(a.map(async c=>{let f=i.routes[c.route.id];if(f){let p=await p4(f,o);return p.links?p.links():[]}return[]}));return b4(l.flat(1).filter(h4).filter(c=>c.rel==="stylesheet"||c.rel==="preload").map(c=>c.rel==="stylesheet"?{...c,rel:"prefetch",as:"style"}:{...c,rel:"prefetch"}))}function gg(a,i,o,l,c,f){let p=(h,g)=>o[g]?h.route.id!==o[g].route.id:!0,m=(h,g)=>{var b;return o[g].pathname!==h.pathname||((b=o[g].route.path)==null?void 0:b.endsWith("*"))&&o[g].params["*"]!==h.params["*"]};return f==="assets"?i.filter((h,g)=>p(h,g)||m(h,g)):f==="data"?i.filter((h,g)=>{var y;let b=l.routes[h.route.id];if(!b||!b.hasLoader)return!1;if(p(h,g)||m(h,g))return!0;if(h.route.shouldRevalidate){let x=h.route.shouldRevalidate({currentUrl:new URL(c.pathname+c.search+c.hash,window.origin),currentParams:((y=o[0])==null?void 0:y.params)||{},nextUrl:new URL(a,window.origin),nextParams:h.params,defaultShouldRevalidate:!0});if(typeof x=="boolean")return x}return!0}):[]}function g4(a,i,{includeHydrateFallback:o}={}){return x4(a.map(l=>{let c=i.routes[l.route.id];if(!c)return[];let f=[c.module];return c.clientActionModule&&(f=f.concat(c.clientActionModule)),c.clientLoaderModule&&(f=f.concat(c.clientLoaderModule)),o&&c.hydrateFallbackModule&&(f=f.concat(c.hydrateFallbackModule)),c.imports&&(f=f.concat(c.imports)),f}).flat(1))}function x4(a){return[...new Set(a)]}function y4(a){let i={},o=Object.keys(a).sort();for(let l of o)i[l]=a[l];return i}function b4(a,i){let o=new Set;return new Set(i),a.reduce((l,c)=>{let f=JSON.stringify(y4(c));return o.has(f)||(o.add(f),l.push({key:f,link:c})),l},[])}function vf(){let a=j.useContext(qi);return bf(a,"You must render this element inside a <DataRouterContext.Provider> element"),a}function v4(){let a=j.useContext(vl);return bf(a,"You must render this element inside a <DataRouterStateContext.Provider> element"),a}var jf=j.createContext(void 0);jf.displayName="FrameworkContext";function Sl(){let a=j.useContext(jf);return bf(a,"You must render this element inside a <HydratedRouter> element"),a}function j4(a,i){let o=j.useContext(jf),[l,c]=j.useState(!1),[f,p]=j.useState(!1),{onFocus:m,onBlur:h,onMouseEnter:g,onMouseLeave:b,onTouchStart:y}=i,x=j.useRef(null);j.useEffect(()=>{if(a==="render"&&p(!0),a==="viewport"){let N=T=>{T.forEach(z=>{p(z.isIntersecting)})},C=new IntersectionObserver(N,{threshold:.5});return x.current&&C.observe(x.current),()=>{C.disconnect()}}},[a]),j.useEffect(()=>{if(l){let N=setTimeout(()=>{p(!0)},100);return()=>{clearTimeout(N)}}},[l]);let w=()=>{c(!0)},S=()=>{c(!1),p(!1)};return o?a!=="intent"?[f,x,{}]:[f,x,{onFocus:Ir(m,w),onBlur:Ir(h,S),onMouseEnter:Ir(g,w),onMouseLeave:Ir(b,S),onTouchStart:Ir(y,w)}]:[!1,x,{}]}function Ir(a,i){return o=>{a&&a(o),o.defaultPrevented||i(o)}}function S4({page:a,...i}){let o=D5(),{nonce:l}=Sl(),{router:c}=vf(),f=j.useMemo(()=>ry(c.routes,a,c.basename),[c.routes,a,c.basename]);return f?(i.nonce==null&&l&&(i={...i,nonce:l}),o?j.createElement(k4,{page:a,matches:f,...i}):j.createElement(N4,{page:a,matches:f,...i})):null}function w4(a){let{manifest:i,routeModules:o}=Sl(),[l,c]=j.useState([]);return j.useEffect(()=>{let f=!1;return m4(a,i,o).then(p=>{f||c(p)}),()=>{f=!0}},[a,i,o]),l}function k4({page:a,matches:i,...o}){let l=ca(),{future:c}=Sl(),{basename:f}=vf(),p=j.useMemo(()=>{if(a===l.pathname+l.search+l.hash)return[];let m=wy(a,f,c.v8_trailingSlashAwareDataRequests,"rsc"),h=!1,g=[];for(let b of i)typeof b.route.shouldRevalidate=="function"?h=!0:g.push(b.route.id);return h&&g.length>0&&m.searchParams.set("_routes",g.join(",")),[m.pathname+m.search]},[f,c.v8_trailingSlashAwareDataRequests,a,l,i]);return j.createElement(j.Fragment,null,p.map(m=>j.createElement("link",{key:m,rel:"prefetch",as:"fetch",href:m,...o})))}function N4({page:a,matches:i,...o}){let l=ca(),{future:c,manifest:f,routeModules:p}=Sl(),{basename:m}=vf(),{loaderData:h,matches:g}=v4(),b=j.useMemo(()=>gg(a,i,g,f,l,"data"),[a,i,g,f,l]),y=j.useMemo(()=>gg(a,i,g,f,l,"assets"),[a,i,g,f,l]),x=j.useMemo(()=>{if(a===l.pathname+l.search+l.hash)return[];let N=new Set,C=!1;if(i.forEach(z=>{var A;let E=f.routes[z.route.id];!E||!E.hasLoader||(!b.some(R=>R.route.id===z.route.id)&&z.route.id in h&&((A=p[z.route.id])!=null&&A.shouldRevalidate)||E.hasClientLoader?C=!0:N.add(z.route.id))}),N.size===0)return[];let T=wy(a,m,c.v8_trailingSlashAwareDataRequests,"data");return C&&N.size>0&&T.searchParams.set("_routes",i.filter(z=>N.has(z.route.id)).map(z=>z.route.id).join(",")),[T.pathname+T.search]},[m,c.v8_trailingSlashAwareDataRequests,h,l,f,b,i,a,p]),w=j.useMemo(()=>g4(y,f),[y,f]),S=w4(y);return j.createElement(j.Fragment,null,x.map(N=>j.createElement("link",{key:N,rel:"prefetch",as:"fetch",href:N,...o})),w.map(N=>j.createElement("link",{key:N,rel:"modulepreload",href:N,...o})),S.map(({key:N,link:C})=>j.createElement("link",{key:N,nonce:o.nonce,...C,crossOrigin:C.crossOrigin??o.crossOrigin})))}function C4(...a){return i=>{a.forEach(o=>{typeof o=="function"?o(i):o!=null&&(o.current=i)})}}var T4=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";try{T4&&(window.__reactRouterVersion="7.18.0")}catch{}function E4({basename:a,children:i,useTransitions:o,window:l}){let c=j.useRef();c.current==null&&(c.current=r5({window:l,v5Compat:!0}));let f=c.current,[p,m]=j.useState({action:f.action,location:f.location}),h=j.useCallback(g=>{o===!1?m(g):j.startTransition(()=>m(g))},[o]);return j.useLayoutEffect(()=>f.listen(h),[f,h]),j.createElement(a4,{basename:a,children:i,location:p.location,navigationType:p.action,navigator:f,useTransitions:o})}var rt=j.forwardRef(function({onClick:i,discover:o="render",prefetch:l="none",relative:c,reloadDocument:f,replace:p,mask:m,state:h,target:g,to:b,preventScrollReset:y,viewTransition:x,defaultShouldRevalidate:w,...S},N){let{basename:C,navigator:T,useTransitions:z}=j.useContext(ea),E=typeof b=="string"&&hf.test(b),A=py(b,C);b=A.to;let R=q5(b,{relative:c}),B=ca(),_=null;if(m){let le=mf(m,[],B.mask?B.mask.pathname:"/",!0);C!=="/"&&(le.pathname=le.pathname==="/"?C:sa([C,le.pathname])),_=T.createHref(le)}let[W,ne,H]=j4(l,S),F=R4(b,{replace:p,mask:m,state:h,target:g,preventScrollReset:y,relative:c,viewTransition:x,defaultShouldRevalidate:w,useTransitions:z});function Q(le){i&&i(le),le.defaultPrevented||F(le)}let K=!(A.isExternal||f),te=j.createElement("a",{...S,...H,href:(K?_:void 0)||A.absoluteURL||R,onClick:K?Q:i,ref:C4(N,ne),target:g,"data-discover":!E&&o==="render"?"true":void 0});return W&&!E?j.createElement(j.Fragment,null,te,j.createElement(S4,{page:R})):te});rt.displayName="Link";var z4=j.forwardRef(function({"aria-current":i="page",caseSensitive:o=!1,className:l="",end:c=!1,style:f,to:p,viewTransition:m,children:h,...g},b){let y=us(p,{relative:g.relative}),x=ca(),w=j.useContext(vl),{navigator:S,basename:N}=j.useContext(ea),C=w!=null&&U4(y)&&m===!0,T=S.encodeLocation?S.encodeLocation(y).pathname:y.pathname,z=x.pathname,E=w&&w.navigation&&w.navigation.location?w.navigation.location.pathname:null;o||(z=z.toLowerCase(),E=E?E.toLowerCase():null,T=T.toLowerCase()),E&&N&&(E=_a(E,N)||E);const A=T!=="/"&&T.endsWith("/")?T.length-1:T.length;let R=z===T||!c&&z.startsWith(T)&&z.charAt(A)==="/",B=E!=null&&(E===T||!c&&E.startsWith(T)&&E.charAt(T.length)==="/"),_={isActive:R,isPending:B,isTransitioning:C},W=R?i:void 0,ne;typeof l=="function"?ne=l(_):ne=[l,R?"active":null,B?"pending":null,C?"transitioning":null].filter(Boolean).join(" ");let H=typeof f=="function"?f(_):f;return j.createElement(rt,{...g,"aria-current":W,className:ne,ref:b,style:H,to:p,viewTransition:m},typeof h=="function"?h(_):h)});z4.displayName="NavLink";var M4=j.forwardRef(({discover:a="render",fetcherKey:i,navigate:o,reloadDocument:l,replace:c,state:f,method:p=Po,action:m,onSubmit:h,relative:g,preventScrollReset:b,viewTransition:y,defaultShouldRevalidate:x,...w},S)=>{let{useTransitions:N}=j.useContext(ea),C=L4(),T=B4(m,{relative:g}),z=p.toLowerCase()==="get"?"get":"post",E=typeof m=="string"&&hf.test(m),A=R=>{if(h&&h(R),R.defaultPrevented)return;R.preventDefault();let B=R.nativeEvent.submitter,_=(B==null?void 0:B.getAttribute("formmethod"))||p,W=()=>C(B||R.currentTarget,{fetcherKey:i,method:_,navigate:o,replace:c,state:f,relative:g,preventScrollReset:b,viewTransition:y,defaultShouldRevalidate:x});N&&o!==!1?j.startTransition(()=>W()):W()};return j.createElement("form",{ref:S,method:z,action:T,onSubmit:l?h:A,...w,"data-discover":!E&&a==="render"?"true":void 0})});M4.displayName="Form";function A4(a){return`${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function ky(a){let i=j.useContext(qi);return He(i,A4(a)),i}function R4(a,{target:i,replace:o,mask:l,state:c,preventScrollReset:f,relative:p,viewTransition:m,defaultShouldRevalidate:h,useTransitions:g}={}){let b=cs(),y=ca(),x=us(a,{relative:p});return j.useCallback(w=>{if(l4(w,i)){w.preventDefault();let S=o!==void 0?o:ts(y)===ts(x),N=()=>b(a,{replace:S,mask:l,state:c,preventScrollReset:f,relative:p,viewTransition:m,defaultShouldRevalidate:h});g?j.startTransition(()=>N()):N()}},[y,b,x,o,l,c,i,a,f,p,m,h,g])}function wl(a){la(typeof URLSearchParams<"u","You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.");let i=j.useRef(Ud(a)),o=j.useRef(!1),l=ca(),c=j.useMemo(()=>c4(l.search,o.current?null:i.current),[l.search]),f=cs(),p=j.useCallback((m,h)=>{const g=Ud(typeof m=="function"?m(new URLSearchParams(c)):m);o.current=!0,f("?"+g,h)},[f,c]);return[c,p]}var D4=0,O4=()=>`__${String(++D4)}__`;function L4(){let{router:a}=ky("useSubmit"),{basename:i}=j.useContext(ea),o=W5(),l=a.fetch,c=a.navigate;return j.useCallback(async(f,p={})=>{let{action:m,method:h,encType:g,formData:b,body:y}=f4(f,i);if(p.navigate===!1){let x=p.fetcherKey||O4();await l(x,o,p.action||m,{defaultShouldRevalidate:p.defaultShouldRevalidate,preventScrollReset:p.preventScrollReset,formData:b,body:y,formMethod:p.method||h,formEncType:p.encType||g,flushSync:p.flushSync})}else await c(p.action||m,{defaultShouldRevalidate:p.defaultShouldRevalidate,preventScrollReset:p.preventScrollReset,formData:b,body:y,formMethod:p.method||h,formEncType:p.encType||g,replace:p.replace,state:p.state,fromRouteId:o,flushSync:p.flushSync,viewTransition:p.viewTransition})},[l,c,i,o])}function B4(a,{relative:i}={}){let{basename:o}=j.useContext(ea),l=j.useContext(ba);He(l,"useFormAction must be used inside a RouteContext");let[c]=l.matches.slice(-1),f={...us(a||".",{relative:i})},p=ca();if(a==null){f.search=p.search;let m=new URLSearchParams(f.search),h=m.getAll("index");if(h.some(b=>b==="")){m.delete("index"),h.filter(y=>y).forEach(y=>m.append("index",y));let b=m.toString();f.search=b?`?${b}`:""}}return(!a||a===".")&&c.route.index&&(f.search=f.search?f.search.replace(/^\?/,"?index&"):"?index"),o!=="/"&&(f.pathname=f.pathname==="/"?o:sa([o,f.pathname])),ts(f)}function U4(a,{relative:i}={}){let o=j.useContext(gy);He(o!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:l}=ky("useViewTransitionState"),c=us(a,{relative:i});if(!o.isTransitioning)return!1;let f=_a(o.currentLocation.pathname,l)||o.currentLocation.pathname,p=_a(o.nextLocation.pathname,l)||o.nextLocation.pathname;return rl(c.pathname,p)!=null||rl(c.pathname,f)!=null}const Sf=j.createContext({});function wf(a){const i=j.useRef(null);return i.current===null&&(i.current=a()),i.current}const V4=typeof window<"u",kf=V4?j.useLayoutEffect:j.useEffect,kl=j.createContext(null);function Nf(a,i){a.indexOf(i)===-1&&a.push(i)}function ol(a,i){const o=a.indexOf(i);o>-1&&a.splice(o,1)}const ya=(a,i,o)=>o>i?i:o<a?a:o;let Cf=()=>{};const yn={},Ny=a=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(a),Cy=a=>typeof a=="object"&&a!==null,Ty=a=>/^0[^.\s]+$/u.test(a);function Ey(a){let i;return()=>(i===void 0&&(i=a()),i)}const Wt=a=>a,ds=(...a)=>a.reduce((i,o)=>l=>o(i(l))),as=(a,i,o)=>{const l=i-a;return l?(o-a)/l:1};class Tf{constructor(){this.subscriptions=[]}add(i){return Nf(this.subscriptions,i),()=>ol(this.subscriptions,i)}notify(i,o,l){const c=this.subscriptions.length;if(c)if(c===1)this.subscriptions[0](i,o,l);else for(let f=0;f<c;f++){const p=this.subscriptions[f];p&&p(i,o,l)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const Ut=a=>a*1e3,Qt=a=>a/1e3,zy=(a,i)=>i?a*(1e3/i):0,My=(a,i,o)=>(((1-3*o+3*i)*a+(3*o-6*i))*a+3*i)*a,_4=1e-7,q4=12;function H4(a,i,o,l,c){let f,p,m=0;do p=i+(o-i)/2,f=My(p,l,c)-a,f>0?o=p:i=p;while(Math.abs(f)>_4&&++m<q4);return p}function fs(a,i,o,l){if(a===i&&o===l)return Wt;const c=f=>H4(f,0,1,a,o);return f=>f===0||f===1?f:My(c(f),i,l)}const Ay=a=>i=>i<=.5?a(2*i)/2:(2-a(2*(1-i)))/2,Ry=a=>i=>1-a(1-i),Dy=fs(.33,1.53,.69,.99),Ef=Ry(Dy),Oy=Ay(Ef),Ly=a=>a>=1?1:(a*=2)<1?.5*Ef(a):.5*(2-Math.pow(2,-10*(a-1))),zf=a=>1-Math.sin(Math.acos(a)),By=Ry(zf),Uy=Ay(zf),G4=fs(.42,0,1,1),Y4=fs(0,0,.58,1),Vy=fs(.42,0,.58,1),F4=a=>Array.isArray(a)&&typeof a[0]!="number",_y=a=>Array.isArray(a)&&typeof a[0]=="number",I4={linear:Wt,easeIn:G4,easeInOut:Vy,easeOut:Y4,circIn:zf,circInOut:Uy,circOut:By,backIn:Ef,backInOut:Oy,backOut:Dy,anticipate:Ly},X4=a=>typeof a=="string",xg=a=>{if(_y(a)){Cf(a.length===4);const[i,o,l,c]=a;return fs(i,o,l,c)}else if(X4(a))return I4[a];return a},Lo=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function P4(a){let i=new Set,o=new Set,l=!1,c=!1;const f=new WeakSet;let p={delta:0,timestamp:0,isProcessing:!1};function m(g){f.has(g)&&(h.schedule(g),a()),g(p)}const h={schedule:(g,b=!1,y=!1)=>{const w=y&&l?i:o;return b&&f.add(g),w.add(g),g},cancel:g=>{o.delete(g),f.delete(g)},process:g=>{if(p=g,l){c=!0;return}l=!0;const b=i;i=o,o=b,i.forEach(m),i.clear(),l=!1,c&&(c=!1,h.process(g))}};return h}const $4=40;function qy(a,i){let o=!1,l=!0;const c={delta:0,timestamp:0,isProcessing:!1},f=()=>o=!0,p=Lo.reduce((E,A)=>(E[A]=P4(f),E),{}),{setup:m,read:h,resolveKeyframes:g,preUpdate:b,update:y,preRender:x,render:w,postRender:S}=p,N=()=>{const E=yn.useManualTiming,A=E?c.timestamp:performance.now();o=!1,E||(c.delta=l?1e3/60:Math.max(Math.min(A-c.timestamp,$4),1)),c.timestamp=A,c.isProcessing=!0,m.process(c),h.process(c),g.process(c),b.process(c),y.process(c),x.process(c),w.process(c),S.process(c),c.isProcessing=!1,o&&i&&(l=!1,a(N))},C=()=>{o=!0,l=!0,c.isProcessing||a(N)};return{schedule:Lo.reduce((E,A)=>{const R=p[A];return E[A]=(B,_=!1,W=!1)=>(o||C(),R.schedule(B,_,W)),E},{}),cancel:E=>{for(let A=0;A<Lo.length;A++)p[Lo[A]].cancel(E)},state:c,steps:p}}const{schedule:Ue,cancel:bn,state:dt,steps:nd}=qy(typeof requestAnimationFrame<"u"?requestAnimationFrame:Wt,!0);let Zo;function Z4(){Zo=void 0}const xt={now:()=>(Zo===void 0&&xt.set(dt.isProcessing||yn.useManualTiming?dt.timestamp:performance.now()),Zo),set:a=>{Zo=a,queueMicrotask(Z4)}},Hy=a=>i=>typeof i=="string"&&i.startsWith(a),Gy=Hy("--"),Q4=Hy("var(--"),Mf=a=>Q4(a)?K4.test(a.split("/*")[0].trim()):!1,K4=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function yg(a){return typeof a!="string"?!1:a.split("/*")[0].includes("var(--")}const Hi={test:a=>typeof a=="number",parse:parseFloat,transform:a=>a},ns={...Hi,transform:a=>ya(0,1,a)},Bo={...Hi,default:1},Kr=a=>Math.round(a*1e5)/1e5,Af=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function W4(a){return a==null}const J4=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,Rf=(a,i)=>o=>!!(typeof o=="string"&&J4.test(o)&&o.startsWith(a)||i&&!W4(o)&&Object.prototype.hasOwnProperty.call(o,i)),Yy=(a,i,o)=>l=>{if(typeof l!="string")return l;const[c,f,p,m]=l.match(Af);return{[a]:parseFloat(c),[i]:parseFloat(f),[o]:parseFloat(p),alpha:m!==void 0?parseFloat(m):1}},ej=a=>ya(0,255,a),id={...Hi,transform:a=>Math.round(ej(a))},Fn={test:Rf("rgb","red"),parse:Yy("red","green","blue"),transform:({red:a,green:i,blue:o,alpha:l=1})=>"rgba("+id.transform(a)+", "+id.transform(i)+", "+id.transform(o)+", "+Kr(ns.transform(l))+")"};function tj(a){let i="",o="",l="",c="";return a.length>5?(i=a.substring(1,3),o=a.substring(3,5),l=a.substring(5,7),c=a.substring(7,9)):(i=a.substring(1,2),o=a.substring(2,3),l=a.substring(3,4),c=a.substring(4,5),i+=i,o+=o,l+=l,c+=c),{red:parseInt(i,16),green:parseInt(o,16),blue:parseInt(l,16),alpha:c?parseInt(c,16)/255:1}}const Vd={test:Rf("#"),parse:tj,transform:Fn.transform},ps=a=>({test:i=>typeof i=="string"&&i.endsWith(a)&&i.split(" ").length===1,parse:parseFloat,transform:i=>`${i}${a}`}),Va=ps("deg"),xa=ps("%"),oe=ps("px"),aj=ps("vh"),nj=ps("vw"),bg={...xa,parse:a=>xa.parse(a)/100,transform:a=>xa.transform(a*100)},Oi={test:Rf("hsl","hue"),parse:Yy("hue","saturation","lightness"),transform:({hue:a,saturation:i,lightness:o,alpha:l=1})=>"hsla("+Math.round(a)+", "+xa.transform(Kr(i))+", "+xa.transform(Kr(o))+", "+Kr(ns.transform(l))+")"},We={test:a=>Fn.test(a)||Vd.test(a)||Oi.test(a),parse:a=>Fn.test(a)?Fn.parse(a):Oi.test(a)?Oi.parse(a):Vd.parse(a),transform:a=>typeof a=="string"?a:a.hasOwnProperty("red")?Fn.transform(a):Oi.transform(a),getAnimatableNone:a=>{const i=We.parse(a);return i.alpha=0,We.transform(i)}},ij=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function rj(a){var i,o;return isNaN(a)&&typeof a=="string"&&(((i=a.match(Af))==null?void 0:i.length)||0)+(((o=a.match(ij))==null?void 0:o.length)||0)>0}const Fy="number",Iy="color",sj="var",oj="var(",vg="${}",lj=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function Ui(a){const i=a.toString(),o=[],l={color:[],number:[],var:[]},c=[];let f=0;const m=i.replace(lj,h=>(We.test(h)?(l.color.push(f),c.push(Iy),o.push(We.parse(h))):h.startsWith(oj)?(l.var.push(f),c.push(sj),o.push(h)):(l.number.push(f),c.push(Fy),o.push(parseFloat(h))),++f,vg)).split(vg);return{values:o,split:m,indexes:l,types:c}}function cj(a){return Ui(a).values}function Xy({split:a,types:i}){const o=a.length;return l=>{let c="";for(let f=0;f<o;f++)if(c+=a[f],l[f]!==void 0){const p=i[f];p===Fy?c+=Kr(l[f]):p===Iy?c+=We.transform(l[f]):c+=l[f]}return c}}function uj(a){return Xy(Ui(a))}const dj=a=>typeof a=="number"?0:We.test(a)?We.getAnimatableNone(a):a,fj=(a,i)=>typeof a=="number"?i!=null&&i.trim().endsWith("/")?a:0:dj(a);function pj(a){const i=Ui(a);return Xy(i)(i.values.map((l,c)=>fj(l,i.split[c])))}const oa={test:rj,parse:cj,createTransformer:uj,getAnimatableNone:pj};function rd(a,i,o){return o<0&&(o+=1),o>1&&(o-=1),o<1/6?a+(i-a)*6*o:o<1/2?i:o<2/3?a+(i-a)*(2/3-o)*6:a}function hj({hue:a,saturation:i,lightness:o,alpha:l}){a/=360,i/=100,o/=100;let c=0,f=0,p=0;if(!i)c=f=p=o;else{const m=o<.5?o*(1+i):o+i-o*i,h=2*o-m;c=rd(h,m,a+1/3),f=rd(h,m,a),p=rd(h,m,a-1/3)}return{red:Math.round(c*255),green:Math.round(f*255),blue:Math.round(p*255),alpha:l}}function ll(a,i){return o=>o>0?i:a}const Be=(a,i,o)=>a+(i-a)*o,sd=(a,i,o)=>{const l=a*a,c=o*(i*i-l)+l;return c<0?0:Math.sqrt(c)},mj=[Vd,Fn,Oi],gj=a=>mj.find(i=>i.test(a));function jg(a){const i=gj(a);if(!i)return!1;let o=i.parse(a);return i===Oi&&(o=hj(o)),o}const Sg=(a,i)=>{const o=jg(a),l=jg(i);if(!o||!l)return ll(a,i);const c={...o};return f=>(c.red=sd(o.red,l.red,f),c.green=sd(o.green,l.green,f),c.blue=sd(o.blue,l.blue,f),c.alpha=Be(o.alpha,l.alpha,f),Fn.transform(c))},_d=new Set(["none","hidden"]);function xj(a,i){return _d.has(a)?o=>o<=0?a:i:o=>o>=1?i:a}function yj(a,i){return o=>Be(a,i,o)}function Df(a){return typeof a=="number"?yj:typeof a=="string"?Mf(a)?ll:We.test(a)?Sg:jj:Array.isArray(a)?Py:typeof a=="object"?We.test(a)?Sg:bj:ll}function Py(a,i){const o=[...a],l=o.length,c=a.map((f,p)=>Df(f)(f,i[p]));return f=>{for(let p=0;p<l;p++)o[p]=c[p](f);return o}}function bj(a,i){const o={...a,...i},l={};for(const c in o)a[c]!==void 0&&i[c]!==void 0&&(l[c]=Df(a[c])(a[c],i[c]));return c=>{for(const f in l)o[f]=l[f](c);return o}}function vj(a,i){const o=[],l={color:0,var:0,number:0};for(let c=0;c<i.values.length;c++){const f=i.types[c],p=a.indexes[f][l[f]],m=a.values[p]??0;o[c]=m,l[f]++}return o}const jj=(a,i)=>{const o=oa.createTransformer(i),l=Ui(a),c=Ui(i);return l.indexes.var.length===c.indexes.var.length&&l.indexes.color.length===c.indexes.color.length&&l.indexes.number.length>=c.indexes.number.length?_d.has(a)&&!c.values.length||_d.has(i)&&!l.values.length?xj(a,i):ds(Py(vj(l,c),c.values),o):ll(a,i)};function $y(a,i,o){return typeof a=="number"&&typeof i=="number"&&typeof o=="number"?Be(a,i,o):Df(a)(a,i)}const Sj=a=>{const i=({timestamp:o})=>a(o);return{start:(o=!0)=>Ue.update(i,o),stop:()=>bn(i),now:()=>dt.isProcessing?dt.timestamp:xt.now()}},Zy=(a,i,o=10)=>{let l="";const c=Math.max(Math.round(i/o),2);for(let f=0;f<c;f++)l+=Math.round(a(f/(c-1))*1e4)/1e4+", ";return`linear(${l.substring(0,l.length-2)})`},cl=2e4;function Of(a){let i=0;const o=50;let l=a.next(i);for(;!l.done&&i<cl;)i+=o,l=a.next(i);return i>=cl?1/0:i}function wj(a,i=100,o){const l=o({...a,keyframes:[0,i]}),c=Math.min(Of(l),cl);return{type:"keyframes",ease:f=>l.next(c*f).value/i,duration:Qt(c)}}const Fe={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function qd(a,i){return a*Math.sqrt(1-i*i)}const kj=12;function Nj(a,i,o){let l=o;for(let c=1;c<kj;c++)l=l-a(l)/i(l);return l}const od=.001;function Cj({duration:a=Fe.duration,bounce:i=Fe.bounce,velocity:o=Fe.velocity,mass:l=Fe.mass}){let c,f,p=1-i;p=ya(Fe.minDamping,Fe.maxDamping,p),a=ya(Fe.minDuration,Fe.maxDuration,Qt(a)),p<1?(c=g=>{const b=g*p,y=b*a,x=b-o,w=qd(g,p),S=Math.exp(-y);return od-x/w*S},f=g=>{const y=g*p*a,x=y*o+o,w=Math.pow(p,2)*Math.pow(g,2)*a,S=Math.exp(-y),N=qd(Math.pow(g,2),p);return(-c(g)+od>0?-1:1)*((x-w)*S)/N}):(c=g=>{const b=Math.exp(-g*a),y=(g-o)*a+1;return-od+b*y},f=g=>{const b=Math.exp(-g*a),y=(o-g)*(a*a);return b*y});const m=5/a,h=Nj(c,f,m);if(a=Ut(a),isNaN(h))return{stiffness:Fe.stiffness,damping:Fe.damping,duration:a};{const g=Math.pow(h,2)*l;return{stiffness:g,damping:p*2*Math.sqrt(l*g),duration:a}}}const Tj=["duration","bounce"],Ej=["stiffness","damping","mass"];function wg(a,i){return i.some(o=>a[o]!==void 0)}function zj(a){let i={velocity:Fe.velocity,stiffness:Fe.stiffness,damping:Fe.damping,mass:Fe.mass,isResolvedFromDuration:!1,...a};if(!wg(a,Ej)&&wg(a,Tj))if(i.velocity=0,a.visualDuration){const o=a.visualDuration,l=2*Math.PI/(o*1.2),c=l*l,f=2*ya(.05,1,1-(a.bounce||0))*Math.sqrt(c);i={...i,mass:Fe.mass,stiffness:c,damping:f}}else{const o=Cj({...a,velocity:0});i={...i,...o,mass:Fe.mass},i.isResolvedFromDuration=!0}return i}function ul(a=Fe.visualDuration,i=Fe.bounce){const o=typeof a!="object"?{visualDuration:a,keyframes:[0,1],bounce:i}:a;let{restSpeed:l,restDelta:c}=o;const f=o.keyframes[0],p=o.keyframes[o.keyframes.length-1],m={done:!1,value:f},{stiffness:h,damping:g,mass:b,duration:y,velocity:x,isResolvedFromDuration:w}=zj({...o,velocity:-Qt(o.velocity||0)}),S=x||0,N=g/(2*Math.sqrt(h*b)),C=p-f,T=Qt(Math.sqrt(h/b)),z=Math.abs(C)<5;l||(l=z?Fe.restSpeed.granular:Fe.restSpeed.default),c||(c=z?Fe.restDelta.granular:Fe.restDelta.default);let E,A,R,B,_,W;if(N<1)R=qd(T,N),B=(S+N*T*C)/R,E=H=>{const F=Math.exp(-N*T*H);return p-F*(B*Math.sin(R*H)+C*Math.cos(R*H))},_=N*T*B+C*R,W=N*T*C-B*R,A=H=>Math.exp(-N*T*H)*(_*Math.sin(R*H)+W*Math.cos(R*H));else if(N===1){E=F=>p-Math.exp(-T*F)*(C+(S+T*C)*F);const H=S+T*C;A=F=>Math.exp(-T*F)*(T*H*F-S)}else{const H=T*Math.sqrt(N*N-1);E=te=>{const le=Math.exp(-N*T*te),q=Math.min(H*te,300);return p-le*((S+N*T*C)*Math.sinh(q)+H*C*Math.cosh(q))/H};const F=(S+N*T*C)/H,Q=N*T*F-C*H,K=N*T*C-F*H;A=te=>{const le=Math.exp(-N*T*te),q=Math.min(H*te,300);return le*(Q*Math.sinh(q)+K*Math.cosh(q))}}const ne={calculatedDuration:w&&y||null,velocity:H=>Ut(A(H)),next:H=>{if(!w&&N<1){const Q=Math.exp(-N*T*H),K=Math.sin(R*H),te=Math.cos(R*H),le=p-Q*(B*K+C*te),q=Ut(Q*(_*K+W*te));return m.done=Math.abs(q)<=l&&Math.abs(p-le)<=c,m.value=m.done?p:le,m}const F=E(H);if(w)m.done=H>=y;else{const Q=Ut(A(H));m.done=Math.abs(Q)<=l&&Math.abs(p-F)<=c}return m.value=m.done?p:F,m},toString:()=>{const H=Math.min(Of(ne),cl),F=Zy(Q=>ne.next(H*Q).value,H,30);return H+"ms "+F},toTransition:()=>{}};return ne}ul.applyToOptions=a=>{const i=wj(a,100,ul);return a.ease=i.ease,a.duration=Ut(i.duration),a.type="keyframes",a};const Mj=5;function Qy(a,i,o){const l=Math.max(i-Mj,0);return zy(o-a(l),i-l)}function Hd({keyframes:a,velocity:i=0,power:o=.8,timeConstant:l=325,bounceDamping:c=10,bounceStiffness:f=500,modifyTarget:p,min:m,max:h,restDelta:g=.5,restSpeed:b}){const y=a[0],x={done:!1,value:y},w=W=>m!==void 0&&W<m||h!==void 0&&W>h,S=W=>m===void 0?h:h===void 0||Math.abs(m-W)<Math.abs(h-W)?m:h;let N=o*i;const C=y+N,T=p===void 0?C:p(C);T!==C&&(N=T-y);const z=W=>-N*Math.exp(-W/l),E=W=>T+z(W),A=W=>{const ne=z(W),H=E(W);x.done=Math.abs(ne)<=g,x.value=x.done?T:H};let R,B;const _=W=>{w(x.value)&&(R=W,B=ul({keyframes:[x.value,S(x.value)],velocity:Qy(E,W,x.value),damping:c,stiffness:f,restDelta:g,restSpeed:b}))};return _(0),{calculatedDuration:null,next:W=>{let ne=!1;return!B&&R===void 0&&(ne=!0,A(W),_(W)),R!==void 0&&W>=R?B.next(W-R):(!ne&&A(W),x)}}}function Aj(a,i,o){const l=[],c=o||yn.mix||$y,f=a.length-1;for(let p=0;p<f;p++){let m=c(a[p],a[p+1]);if(i){const h=Array.isArray(i)?i[p]||Wt:i;m=ds(h,m)}l.push(m)}return l}function Rj(a,i,{clamp:o=!0,ease:l,mixer:c}={}){const f=a.length;if(Cf(f===i.length),f===1)return()=>i[0];if(f===2&&i[0]===i[1])return()=>i[1];const p=a[0]===a[1];a[0]>a[f-1]&&(a=[...a].reverse(),i=[...i].reverse());const m=Aj(i,l,c),h=m.length,g=b=>{if(p&&b<a[0])return i[0];let y=0;if(h>1)for(;y<a.length-2&&!(b<a[y+1]);y++);const x=as(a[y],a[y+1],b);return m[y](x)};return o?b=>g(ya(a[0],a[f-1],b)):g}function Dj(a,i){const o=a[a.length-1];for(let l=1;l<=i;l++){const c=as(0,i,l);a.push(Be(o,1,c))}}function Oj(a){const i=[0];return Dj(i,a.length-1),i}function Lj(a,i){return a.map(o=>o*i)}function Bj(a,i){return a.map(()=>i||Vy).splice(0,a.length-1)}function Wr({duration:a=300,keyframes:i,times:o,ease:l="easeInOut"}){const c=F4(l)?l.map(xg):xg(l),f={done:!1,value:i[0]},p=Lj(o&&o.length===i.length?o:Oj(i),a),m=Rj(p,i,{ease:Array.isArray(c)?c:Bj(i,c)});return{calculatedDuration:a,next:h=>(f.value=m(h),f.done=h>=a,f)}}const Uj=a=>a!==null;function Nl(a,{repeat:i,repeatType:o="loop"},l,c=1){const f=a.filter(Uj),m=c<0||i&&o!=="loop"&&i%2===1?0:f.length-1;return!m||l===void 0?f[m]:l}const Vj={decay:Hd,inertia:Hd,tween:Wr,keyframes:Wr,spring:ul};function Ky(a){typeof a.type=="string"&&(a.type=Vj[a.type])}class Lf{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(i=>{this.resolve=i})}notifyFinished(){this.resolve()}then(i,o){return this.finished.then(i,o)}}const _j=a=>a/100;class dl extends Lf{constructor(i){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{var l,c;const{motionValue:o}=this.options;o&&o.updatedAt!==xt.now()&&this.tick(xt.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),(c=(l=this.options).onStop)==null||c.call(l))},this.options=i,this.initAnimation(),this.play(),i.autoplay===!1&&this.pause()}initAnimation(){const{options:i}=this;Ky(i);const{type:o=Wr,repeat:l=0,repeatDelay:c=0,repeatType:f,velocity:p=0}=i;let{keyframes:m}=i;const h=o||Wr;h!==Wr&&typeof m[0]!="number"&&(this.mixKeyframes=ds(_j,$y(m[0],m[1])),m=[0,100]);const g=h({...i,keyframes:m});f==="mirror"&&(this.mirroredGenerator=h({...i,keyframes:[...m].reverse(),velocity:-p})),g.calculatedDuration===null&&(g.calculatedDuration=Of(g));const{calculatedDuration:b}=g;this.calculatedDuration=b,this.resolvedDuration=b+c,this.totalDuration=this.resolvedDuration*(l+1)-c,this.generator=g}updateTime(i){const o=Math.round(i-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=o}tick(i,o=!1){const{generator:l,totalDuration:c,mixKeyframes:f,mirroredGenerator:p,resolvedDuration:m,calculatedDuration:h}=this;if(this.startTime===null)return l.next(0);const{delay:g=0,keyframes:b,repeat:y,repeatType:x,repeatDelay:w,type:S,onUpdate:N,finalKeyframe:C}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,i):this.speed<0&&(this.startTime=Math.min(i-c/this.speed,this.startTime)),o?this.currentTime=i:this.updateTime(i);const T=this.currentTime-g*(this.playbackSpeed>=0?1:-1),z=this.playbackSpeed>=0?T<0:T>c;this.currentTime=Math.max(T,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=c);let E=this.currentTime,A=l;if(y){const W=Math.min(this.currentTime,c)/m;let ne=Math.floor(W),H=W%1;!H&&W>=1&&(H=1),H===1&&ne--,ne=Math.min(ne,y+1),!!(ne%2)&&(x==="reverse"?(H=1-H,w&&(H-=w/m)):x==="mirror"&&(A=p)),E=ya(0,1,H)*m}let R;z?(this.delayState.value=b[0],R=this.delayState):R=A.next(E),f&&!z&&(R.value=f(R.value));let{done:B}=R;!z&&h!==null&&(B=this.playbackSpeed>=0?this.currentTime>=c:this.currentTime<=0);const _=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&B);return _&&S!==Hd&&(R.value=Nl(b,this.options,C,this.speed)),N&&N(R.value),_&&this.finish(),R}then(i,o){return this.finished.then(i,o)}get duration(){return Qt(this.calculatedDuration)}get iterationDuration(){const{delay:i=0}=this.options||{};return this.duration+Qt(i)}get time(){return Qt(this.currentTime)}set time(i){i=Ut(i),this.currentTime=i,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=i:this.driver&&(this.startTime=this.driver.now()-i/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=i,this.tick(i))}getGeneratorVelocity(){const i=this.currentTime;if(i<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(i);const o=this.generator.next(i).value;return Qy(l=>this.generator.next(l).value,i,o)}get speed(){return this.playbackSpeed}set speed(i){const o=this.playbackSpeed!==i;o&&this.driver&&this.updateTime(xt.now()),this.playbackSpeed=i,o&&this.driver&&(this.time=Qt(this.currentTime))}play(){var c,f;if(this.isStopped)return;const{driver:i=Sj,startTime:o}=this.options;this.driver||(this.driver=i(p=>this.tick(p))),(f=(c=this.options).onPlay)==null||f.call(c);const l=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=l):this.holdTime!==null?this.startTime=l-this.holdTime:this.startTime||(this.startTime=o??l),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(xt.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){var i,o;this.notifyFinished(),this.teardown(),this.state="finished",(o=(i=this.options).onComplete)==null||o.call(i)}cancel(){var i,o;this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),(o=(i=this.options).onCancel)==null||o.call(i)}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(i){return this.startTime=0,this.tick(i,!0)}attachTimeline(i){var o;return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),(o=this.driver)==null||o.stop(),i.observe(this)}}function qj(a){for(let i=1;i<a.length;i++)a[i]??(a[i]=a[i-1])}const In=a=>a*180/Math.PI,Gd=a=>{const i=In(Math.atan2(a[1],a[0]));return Yd(i)},Hj={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:a=>(Math.abs(a[0])+Math.abs(a[3]))/2,rotate:Gd,rotateZ:Gd,skewX:a=>In(Math.atan(a[1])),skewY:a=>In(Math.atan(a[2])),skew:a=>(Math.abs(a[1])+Math.abs(a[2]))/2},Yd=a=>(a=a%360,a<0&&(a+=360),a),kg=Gd,Ng=a=>Math.sqrt(a[0]*a[0]+a[1]*a[1]),Cg=a=>Math.sqrt(a[4]*a[4]+a[5]*a[5]),Gj={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:Ng,scaleY:Cg,scale:a=>(Ng(a)+Cg(a))/2,rotateX:a=>Yd(In(Math.atan2(a[6],a[5]))),rotateY:a=>Yd(In(Math.atan2(-a[2],a[0]))),rotateZ:kg,rotate:kg,skewX:a=>In(Math.atan(a[4])),skewY:a=>In(Math.atan(a[1])),skew:a=>(Math.abs(a[1])+Math.abs(a[4]))/2};function Fd(a){return a.includes("scale")?1:0}function Id(a,i){if(!a||a==="none")return Fd(i);const o=a.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let l,c;if(o)l=Gj,c=o;else{const m=a.match(/^matrix\(([-\d.e\s,]+)\)$/u);l=Hj,c=m}if(!c)return Fd(i);const f=l[i],p=c[1].split(",").map(Fj);return typeof f=="function"?f(p):p[f]}const Yj=(a,i)=>{const{transform:o="none"}=getComputedStyle(a);return Id(o,i)};function Fj(a){return parseFloat(a.trim())}const Gi=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],Yi=new Set([...Gi,"pathRotation"]),Tg=a=>a===Hi||a===oe,Ij=new Set(["x","y","z"]),Xj=Gi.filter(a=>!Ij.has(a));function Pj(a){const i=[];return Xj.forEach(o=>{const l=a.getValue(o);l!==void 0&&(i.push([o,l.get()]),l.set(o.startsWith("scale")?1:0))}),i}const gn={width:({x:a},{paddingLeft:i="0",paddingRight:o="0",boxSizing:l})=>{const c=a.max-a.min;return l==="border-box"?c:c-parseFloat(i)-parseFloat(o)},height:({y:a},{paddingTop:i="0",paddingBottom:o="0",boxSizing:l})=>{const c=a.max-a.min;return l==="border-box"?c:c-parseFloat(i)-parseFloat(o)},top:(a,{top:i})=>parseFloat(i),left:(a,{left:i})=>parseFloat(i),bottom:({y:a},{top:i})=>parseFloat(i)+(a.max-a.min),right:({x:a},{left:i})=>parseFloat(i)+(a.max-a.min),x:(a,{transform:i})=>Id(i,"x"),y:(a,{transform:i})=>Id(i,"y")};gn.translateX=gn.x;gn.translateY=gn.y;const Pn=new Set;let Xd=!1,Pd=!1,$d=!1;function Wy(){if(Pd){const a=Array.from(Pn).filter(l=>l.needsMeasurement),i=new Set(a.map(l=>l.element)),o=new Map;i.forEach(l=>{const c=Pj(l);c.length&&(o.set(l,c),l.render())}),a.forEach(l=>l.measureInitialState()),i.forEach(l=>{l.render();const c=o.get(l);c&&c.forEach(([f,p])=>{var m;(m=l.getValue(f))==null||m.set(p)})}),a.forEach(l=>l.measureEndState()),a.forEach(l=>{l.suspendedScrollY!==void 0&&window.scrollTo(0,l.suspendedScrollY)})}Pd=!1,Xd=!1,Pn.forEach(a=>a.complete($d)),Pn.clear()}function Jy(){Pn.forEach(a=>{a.readKeyframes(),a.needsMeasurement&&(Pd=!0)})}function $j(){$d=!0,Jy(),Wy(),$d=!1}class Bf{constructor(i,o,l,c,f,p=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...i],this.onComplete=o,this.name=l,this.motionValue=c,this.element=f,this.isAsync=p}scheduleResolve(){this.state="scheduled",this.isAsync?(Pn.add(this),Xd||(Xd=!0,Ue.read(Jy),Ue.resolveKeyframes(Wy))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:i,name:o,element:l,motionValue:c}=this;if(i[0]===null){const f=c==null?void 0:c.get(),p=i[i.length-1];if(f!==void 0)i[0]=f;else if(l&&o){const m=l.readValue(o,p);m!=null&&(i[0]=m)}i[0]===void 0&&(i[0]=p),c&&f===void 0&&c.set(i[0])}qj(i)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(i=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,i),Pn.delete(this)}cancel(){this.state==="scheduled"&&(Pn.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const Zj=a=>a.startsWith("--");function eb(a,i,o){Zj(i)?a.style.setProperty(i,o):a.style[i]=o}const Qj={};function tb(a,i){const o=Ey(a);return()=>Qj[i]??o()}const Kj=tb(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),ab=tb(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),Zr=([a,i,o,l])=>`cubic-bezier(${a}, ${i}, ${o}, ${l})`,Eg={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Zr([0,.65,.55,1]),circOut:Zr([.55,0,1,.45]),backIn:Zr([.31,.01,.66,-.59]),backOut:Zr([.33,1.53,.69,.99])};function nb(a,i){if(a)return typeof a=="function"?ab()?Zy(a,i):"ease-out":_y(a)?Zr(a):Array.isArray(a)?a.map(o=>nb(o,i)||Eg.easeOut):Eg[a]}function Wj(a,i,o,{delay:l=0,duration:c=300,repeat:f=0,repeatType:p="loop",ease:m="easeOut",times:h}={},g=void 0){const b={[i]:o};h&&(b.offset=h);const y=nb(m,c);Array.isArray(y)&&(b.easing=y);const x={delay:l,duration:c,easing:Array.isArray(y)?"linear":y,fill:"both",iterations:f+1,direction:p==="reverse"?"alternate":"normal"};return g&&(x.pseudoElement=g),a.animate(b,x)}function ib(a){return typeof a=="function"&&"applyToOptions"in a}function Jj({type:a,...i}){return ib(a)&&ab()?a.applyToOptions(i):(i.duration??(i.duration=300),i.ease??(i.ease="easeOut"),i)}class rb extends Lf{constructor(i){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!i)return;const{element:o,name:l,keyframes:c,pseudoElement:f,allowFlatten:p=!1,finalKeyframe:m,onComplete:h}=i;this.isPseudoElement=!!f,this.allowFlatten=p,this.options=i,Cf(typeof i.type!="string");const g=Jj(i);this.animation=Wj(o,l,c,g,f),g.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!f){const b=Nl(c,this.options,m,this.speed);this.updateMotionValue&&this.updateMotionValue(b),eb(o,l,b),this.animation.cancel()}h==null||h(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){var i,o;(o=(i=this.animation).finish)==null||o.call(i)}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:i}=this;i==="idle"||i==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){var o,l,c;const i=(o=this.options)==null?void 0:o.element;!this.isPseudoElement&&(i!=null&&i.isConnected)&&((c=(l=this.animation).commitStyles)==null||c.call(l))}get duration(){var o,l;const i=((l=(o=this.animation.effect)==null?void 0:o.getComputedTiming)==null?void 0:l.call(o).duration)||0;return Qt(Number(i))}get iterationDuration(){const{delay:i=0}=this.options||{};return this.duration+Qt(i)}get time(){return Qt(Number(this.animation.currentTime)||0)}set time(i){const o=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=Ut(i),o&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(i){i<0&&(this.finishedTime=null),this.animation.playbackRate=i}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(i){this.manualStartTime=this.animation.startTime=i}attachTimeline({timeline:i,rangeStart:o,rangeEnd:l,observe:c}){var f;return this.allowFlatten&&((f=this.animation.effect)==null||f.updateTiming({easing:"linear"})),this.animation.onfinish=null,i&&Kj()?(this.animation.timeline=i,o&&(this.animation.rangeStart=o),l&&(this.animation.rangeEnd=l),Wt):c(this)}}const sb={anticipate:Ly,backInOut:Oy,circInOut:Uy};function eS(a){return a in sb}function tS(a){typeof a.ease=="string"&&eS(a.ease)&&(a.ease=sb[a.ease])}const ld=10;class aS extends rb{constructor(i){tS(i),Ky(i),super(i),i.startTime!==void 0&&i.autoplay!==!1&&(this.startTime=i.startTime),this.options=i}updateMotionValue(i){const{motionValue:o,onUpdate:l,onComplete:c,element:f,...p}=this.options;if(!o)return;if(i!==void 0){o.set(i);return}const m=new dl({...p,autoplay:!1}),h=Math.max(ld,xt.now()-this.startTime),g=ya(0,ld,h-ld),b=m.sample(h).value,{name:y}=this.options;f&&y&&eb(f,y,b),o.setWithVelocity(m.sample(Math.max(0,h-g)).value,b,g),m.stop()}}const zg=(a,i)=>i==="zIndex"?!1:!!(typeof a=="number"||Array.isArray(a)||typeof a=="string"&&(oa.test(a)||a==="0")&&!a.startsWith("url("));function nS(a){const i=a[0];if(a.length===1)return!0;for(let o=0;o<a.length;o++)if(a[o]!==i)return!0}function iS(a,i,o,l){const c=a[0];if(c===null)return!1;if(i==="display"||i==="visibility")return!0;const f=a[a.length-1],p=zg(c,i),m=zg(f,i);return!p||!m?!1:nS(a)||(o==="spring"||ib(o))&&l}function Zd(a){a.duration=0,a.type="keyframes"}const ob=new Set(["opacity","clipPath","filter","transform"]),rS=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function sS(a){for(let i=0;i<a.length;i++)if(typeof a[i]=="string"&&rS.test(a[i]))return!0;return!1}const oS=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),lS=Ey(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function cS(a){var y;const{motionValue:i,name:o,repeatDelay:l,repeatType:c,damping:f,type:p,keyframes:m}=a;if(!(((y=i==null?void 0:i.owner)==null?void 0:y.current)instanceof HTMLElement))return!1;const{onUpdate:g,transformTemplate:b}=i.owner.getProps();return lS()&&o&&(ob.has(o)||oS.has(o)&&sS(m))&&(o!=="transform"||!b)&&!g&&!l&&c!=="mirror"&&f!==0&&p!=="inertia"}const uS=40;class dS extends Lf{constructor({autoplay:i=!0,delay:o=0,type:l="keyframes",repeat:c=0,repeatDelay:f=0,repeatType:p="loop",keyframes:m,name:h,motionValue:g,element:b,...y}){var S;super(),this.stop=()=>{var N,C;this._animation&&(this._animation.stop(),(N=this.stopTimeline)==null||N.call(this)),(C=this.keyframeResolver)==null||C.cancel()},this.createdAt=xt.now();const x={autoplay:i,delay:o,type:l,repeat:c,repeatDelay:f,repeatType:p,name:h,motionValue:g,element:b,...y},w=(b==null?void 0:b.KeyframeResolver)||Bf;this.keyframeResolver=new w(m,(N,C,T)=>this.onKeyframesResolved(N,C,x,!T),h,g,b),(S=this.keyframeResolver)==null||S.scheduleResolve()}onKeyframesResolved(i,o,l,c){var T,z;this.keyframeResolver=void 0;const{name:f,type:p,velocity:m,delay:h,isHandoff:g,onUpdate:b}=l;this.resolvedAt=xt.now();let y=!0;iS(i,f,p,m)||(y=!1,(yn.instantAnimations||!h)&&(b==null||b(Nl(i,l,o))),i[0]=i[i.length-1],Zd(l),l.repeat=0);const w={startTime:c?this.resolvedAt?this.resolvedAt-this.createdAt>uS?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:o,...l,keyframes:i},S=y&&!g&&cS(w),N=(z=(T=w.motionValue)==null?void 0:T.owner)==null?void 0:z.current;let C;if(S)try{C=new aS({...w,element:N})}catch{C=new dl(w)}else C=new dl(w);C.finished.then(()=>{this.notifyFinished()}).catch(Wt),this.pendingTimeline&&(this.stopTimeline=C.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=C}get finished(){return this._animation?this.animation.finished:this._finished}then(i,o){return this.finished.finally(i).then(()=>{})}get animation(){var i;return this._animation||((i=this.keyframeResolver)==null||i.resume(),$j()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(i){this.animation.time=i}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(i){this.animation.speed=i}get startTime(){return this.animation.startTime}attachTimeline(i){return this._animation?this.stopTimeline=this.animation.attachTimeline(i):this.pendingTimeline=i,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){var i;this._animation&&this.animation.cancel(),(i=this.keyframeResolver)==null||i.cancel()}}function lb(a,i,o,l=0,c=1){const f=Array.from(a).sort((g,b)=>g.sortNodePosition(b)).indexOf(i),p=a.size,m=(p-1)*l;return typeof o=="function"?o(f,p):c===1?f*l:m-f*l}const Mg=30,fS=a=>!isNaN(parseFloat(a));class pS{constructor(i,o={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=l=>{var f;const c=xt.now();if(this.updatedAt!==c&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(l),this.current!==this.prev&&((f=this.events.change)==null||f.notify(this.current),this.dependents))for(const p of this.dependents)p.dirty()},this.hasAnimated=!1,this.setCurrent(i),this.owner=o.owner}setCurrent(i){this.current=i,this.updatedAt=xt.now(),this.canTrackVelocity===null&&i!==void 0&&(this.canTrackVelocity=fS(this.current))}setPrevFrameValue(i=this.current){this.prevFrameValue=i,this.prevUpdatedAt=this.updatedAt}onChange(i){return this.on("change",i)}on(i,o){this.events[i]||(this.events[i]=new Tf);const l=this.events[i].add(o);return i==="change"?()=>{l(),Ue.read(()=>{this.events.change.getSize()||this.stop()})}:l}clearListeners(){for(const i in this.events)this.events[i].clear()}attach(i,o){this.passiveEffect=i,this.stopPassiveEffect=o}set(i){this.passiveEffect?this.passiveEffect(i,this.updateAndNotify):this.updateAndNotify(i)}setWithVelocity(i,o,l){this.set(o),this.prev=void 0,this.prevFrameValue=i,this.prevUpdatedAt=this.updatedAt-l}jump(i,o=!0){this.updateAndNotify(i),this.prev=i,this.prevUpdatedAt=this.prevFrameValue=void 0,o&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){var i;(i=this.events.change)==null||i.notify(this.current)}addDependent(i){this.dependents||(this.dependents=new Set),this.dependents.add(i)}removeDependent(i){this.dependents&&this.dependents.delete(i)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const i=xt.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||i-this.updatedAt>Mg)return 0;const o=Math.min(this.updatedAt-this.prevUpdatedAt,Mg);return zy(parseFloat(this.current)-parseFloat(this.prevFrameValue),o)}start(i){return this.stop(),new Promise(o=>{this.hasAnimated=!0,this.animation=i(o),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){var i,o;(i=this.dependents)==null||i.clear(),(o=this.events.destroy)==null||o.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function Vi(a,i){return new pS(a,i)}function cb(a,i){if(a!=null&&a.inherit&&i){const{inherit:o,...l}=a;return{...i,...l}}return a}function Uf(a,i){const o=(a==null?void 0:a[i])??(a==null?void 0:a.default)??a;return o!==a?cb(o,a):o}const hS={type:"spring",stiffness:500,damping:25,restSpeed:10},mS=a=>({type:"spring",stiffness:550,damping:a===0?2*Math.sqrt(550):30,restSpeed:10}),gS={type:"keyframes",duration:.8},xS={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},yS=(a,{keyframes:i})=>i.length>2?gS:Yi.has(a)?a.startsWith("scale")?mS(i[1]):hS:xS,bS=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function vS(a){for(const i in a)if(!bS.has(i))return!0;return!1}const Vf=(a,i,o,l={},c,f)=>p=>{const m=Uf(l,a)||{},h=m.delay||l.delay||0;let{elapsed:g=0}=l;g=g-Ut(h);const b={keyframes:Array.isArray(o)?o:[null,o],ease:"easeOut",velocity:i.getVelocity(),...m,delay:-g,onUpdate:x=>{i.set(x),m.onUpdate&&m.onUpdate(x)},onComplete:()=>{p(),m.onComplete&&m.onComplete()},name:a,motionValue:i,element:f?void 0:c};vS(m)||Object.assign(b,yS(a,b)),b.duration&&(b.duration=Ut(b.duration)),b.repeatDelay&&(b.repeatDelay=Ut(b.repeatDelay)),b.from!==void 0&&(b.keyframes[0]=b.from);let y=!1;if((b.type===!1||b.duration===0&&!b.repeatDelay)&&(Zd(b),b.delay===0&&(y=!0)),(yn.instantAnimations||yn.skipAnimations||c!=null&&c.shouldSkipAnimations||m.skipAnimations)&&(y=!0,Zd(b),b.delay=0),b.allowFlatten=!m.type&&!m.ease,y&&!f&&i.get()!==void 0){const x=Nl(b.keyframes,m);if(x!==void 0){Ue.update(()=>{b.onUpdate(x),b.onComplete()});return}}return m.isSync?new dl(b):new dS(b)},jS=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function SS(a){const i=jS.exec(a);if(!i)return[,];const[,o,l,c]=i;return[`--${o??l}`,c]}function ub(a,i,o=1){const[l,c]=SS(a);if(!l)return;const f=window.getComputedStyle(i).getPropertyValue(l);if(f){const p=f.trim();return Ny(p)?parseFloat(p):p}return Mf(c)?ub(c,i,o+1):c}function Ag(a){const i=[{},{}];return a==null||a.values.forEach((o,l)=>{i[0][l]=o.get(),i[1][l]=o.getVelocity()}),i}function _f(a,i,o,l){if(typeof i=="function"){const[c,f]=Ag(l);i=i(o!==void 0?o:a.custom,c,f)}if(typeof i=="string"&&(i=a.variants&&a.variants[i]),typeof i=="function"){const[c,f]=Ag(l);i=i(o!==void 0?o:a.custom,c,f)}return i}function $n(a,i,o){const l=a.getProps();return _f(l,i,o!==void 0?o:l.custom,a)}const db=new Set(["width","height","top","left","right","bottom",...Gi]),Qd=a=>Array.isArray(a);function wS(a,i,o){a.hasValue(i)?a.getValue(i).set(o):a.addValue(i,Vi(o))}function kS(a){return Qd(a)?a[a.length-1]||0:a}function NS(a,i){const o=$n(a,i);let{transitionEnd:l={},transition:c={},...f}=o||{};f={...f,...l};for(const p in f){const m=kS(f[p]);wS(a,p,m)}}const ft=a=>!!(a&&a.getVelocity);function CS(a){return!!(ft(a)&&a.add)}function Kd(a,i){const o=a.getValue("willChange");if(CS(o))return o.add(i);if(!o&&yn.WillChange){const l=new yn.WillChange("auto");a.addValue("willChange",l),l.add(i)}}function qf(a){return a.replace(/([A-Z])/g,i=>`-${i.toLowerCase()}`)}const TS="framerAppearId",fb="data-"+qf(TS);function pb(a){return a.props[fb]}function ES({protectedKeys:a,needsAnimating:i},o){const l=a.hasOwnProperty(o)&&i[o]!==!0;return i[o]=!1,l}function hb(a,i,{delay:o=0,transitionOverride:l,type:c}={}){let{transition:f,transitionEnd:p,...m}=i;const h=a.getDefaultTransition();f=f?cb(f,h):h;const g=f==null?void 0:f.reduceMotion,b=f==null?void 0:f.skipAnimations;l&&(f=l);const y=[],x=c&&a.animationState&&a.animationState.getState()[c],w=f==null?void 0:f.path;w&&w.animateVisualElement(a,m,f,o,y);for(const S in m){const N=a.getValue(S,a.latestValues[S]??null),C=m[S];if(C===void 0||x&&ES(x,S))continue;const T={delay:o,...Uf(f||{},S)};b&&(T.skipAnimations=!0);const z=N.get();if(z!==void 0&&!N.isAnimating()&&!Array.isArray(C)&&C===z&&!T.velocity){Ue.update(()=>N.set(C));continue}let E=!1;if(window.MotionHandoffAnimation){const B=pb(a);if(B){const _=window.MotionHandoffAnimation(B,S,Ue);_!==null&&(T.startTime=_,E=!0)}}Kd(a,S);const A=g??a.shouldReduceMotion;N.start(Vf(S,N,C,A&&db.has(S)?{type:!1}:T,a,E));const R=N.animation;R&&y.push(R)}if(p){const S=()=>Ue.update(()=>{p&&NS(a,p)});y.length?Promise.all(y).then(S):S()}return y}function Wd(a,i,o={}){var h;const l=$n(a,i,o.type==="exit"?(h=a.presenceContext)==null?void 0:h.custom:void 0);let{transition:c=a.getDefaultTransition()||{}}=l||{};o.transitionOverride&&(c=o.transitionOverride);const f=l?()=>Promise.all(hb(a,l,o)):()=>Promise.resolve(),p=a.variantChildren&&a.variantChildren.size?(g=0)=>{const{delayChildren:b=0,staggerChildren:y,staggerDirection:x}=c;return zS(a,i,g,b,y,x,o)}:()=>Promise.resolve(),{when:m}=c;if(m){const[g,b]=m==="beforeChildren"?[f,p]:[p,f];return g().then(()=>b())}else return Promise.all([f(),p(o.delay)])}function zS(a,i,o=0,l=0,c=0,f=1,p){const m=[];for(const h of a.variantChildren)h.notify("AnimationStart",i),m.push(Wd(h,i,{...p,delay:o+(typeof l=="function"?0:l)+lb(a.variantChildren,h,l,c,f)}).then(()=>h.notify("AnimationComplete",i)));return Promise.all(m)}function MS(a,i,o={}){a.notify("AnimationStart",i);let l;if(Array.isArray(i)){const c=i.map(f=>Wd(a,f,o));l=Promise.all(c)}else if(typeof i=="string")l=Wd(a,i,o);else{const c=typeof i=="function"?$n(a,i,o.custom):i;l=Promise.all(hb(a,c,o))}return l.then(()=>{a.notify("AnimationComplete",i)})}const AS={test:a=>a==="auto",parse:a=>a},mb=a=>i=>i.test(a),gb=[Hi,oe,xa,Va,nj,aj,AS],Rg=a=>gb.find(mb(a));function RS(a){return typeof a=="number"?a===0:a!==null?a==="none"||a==="0"||Ty(a):!0}const DS=new Set(["brightness","contrast","saturate","opacity"]);function OS(a){const[i,o]=a.slice(0,-1).split("(");if(i==="drop-shadow")return a;const[l]=o.match(Af)||[];if(!l)return a;const c=o.replace(l,"");let f=DS.has(i)?1:0;return l!==o&&(f*=100),i+"("+f+c+")"}const LS=/\b([a-z-]*)\(.*?\)/gu,Jd={...oa,getAnimatableNone:a=>{const i=a.match(LS);return i?i.map(OS).join(" "):a}},ef={...oa,getAnimatableNone:a=>{const i=oa.parse(a);return oa.createTransformer(a)(i.map(l=>typeof l=="number"?0:typeof l=="object"?{...l,alpha:1}:l))}},Dg={...Hi,transform:Math.round},BS={rotate:Va,pathRotation:Va,rotateX:Va,rotateY:Va,rotateZ:Va,scale:Bo,scaleX:Bo,scaleY:Bo,scaleZ:Bo,skew:Va,skewX:Va,skewY:Va,distance:oe,translateX:oe,translateY:oe,translateZ:oe,x:oe,y:oe,z:oe,perspective:oe,transformPerspective:oe,opacity:ns,originX:bg,originY:bg,originZ:oe},fl={borderWidth:oe,borderTopWidth:oe,borderRightWidth:oe,borderBottomWidth:oe,borderLeftWidth:oe,borderRadius:oe,borderTopLeftRadius:oe,borderTopRightRadius:oe,borderBottomRightRadius:oe,borderBottomLeftRadius:oe,width:oe,maxWidth:oe,height:oe,maxHeight:oe,top:oe,right:oe,bottom:oe,left:oe,inset:oe,insetBlock:oe,insetBlockStart:oe,insetBlockEnd:oe,insetInline:oe,insetInlineStart:oe,insetInlineEnd:oe,padding:oe,paddingTop:oe,paddingRight:oe,paddingBottom:oe,paddingLeft:oe,paddingBlock:oe,paddingBlockStart:oe,paddingBlockEnd:oe,paddingInline:oe,paddingInlineStart:oe,paddingInlineEnd:oe,margin:oe,marginTop:oe,marginRight:oe,marginBottom:oe,marginLeft:oe,marginBlock:oe,marginBlockStart:oe,marginBlockEnd:oe,marginInline:oe,marginInlineStart:oe,marginInlineEnd:oe,fontSize:oe,backgroundPositionX:oe,backgroundPositionY:oe,...BS,zIndex:Dg,fillOpacity:ns,strokeOpacity:ns,numOctaves:Dg},US={...fl,color:We,backgroundColor:We,outlineColor:We,fill:We,stroke:We,borderColor:We,borderTopColor:We,borderRightColor:We,borderBottomColor:We,borderLeftColor:We,filter:Jd,WebkitFilter:Jd,mask:ef,WebkitMask:ef},xb=a=>US[a],VS=new Set([Jd,ef]);function yb(a,i){let o=xb(a);return VS.has(o)||(o=oa),o.getAnimatableNone?o.getAnimatableNone(i):void 0}const _S=new Set(["auto","none","0"]);function qS(a,i,o){let l=0,c;for(;l<a.length&&!c;){const f=a[l];typeof f=="string"&&!_S.has(f)&&Ui(f).values.length&&(c=a[l]),l++}if(c&&o)for(const f of i)a[f]=yb(o,c)}class HS extends Bf{constructor(i,o,l,c,f){super(i,o,l,c,f,!0)}readKeyframes(){const{unresolvedKeyframes:i,element:o,name:l}=this;if(!o||!o.current)return;super.readKeyframes();for(let b=0;b<i.length;b++){let y=i[b];if(typeof y=="string"&&(y=y.trim(),Mf(y))){const x=ub(y,o.current);x!==void 0&&(i[b]=x),b===i.length-1&&(this.finalKeyframe=y)}}if(this.resolveNoneKeyframes(),!db.has(l)||i.length!==2)return;const[c,f]=i,p=Rg(c),m=Rg(f),h=yg(c),g=yg(f);if(h!==g&&gn[l]){this.needsMeasurement=!0;return}if(p!==m)if(Tg(p)&&Tg(m))for(let b=0;b<i.length;b++){const y=i[b];typeof y=="string"&&(i[b]=parseFloat(y))}else gn[l]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:i,name:o}=this,l=[];for(let c=0;c<i.length;c++)(i[c]===null||RS(i[c]))&&l.push(c);l.length&&qS(i,l,o)}measureInitialState(){const{element:i,unresolvedKeyframes:o,name:l}=this;if(!i||!i.current)return;l==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=gn[l](i.measureViewportBox(),window.getComputedStyle(i.current)),o[0]=this.measuredOrigin;const c=o[o.length-1];c!==void 0&&i.getValue(l,c).jump(c,!1)}measureEndState(){var m;const{element:i,name:o,unresolvedKeyframes:l}=this;if(!i||!i.current)return;const c=i.getValue(o);c&&c.jump(this.measuredOrigin,!1);const f=l.length-1,p=l[f];l[f]=gn[o](i.measureViewportBox(),window.getComputedStyle(i.current)),p!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=p),(m=this.removedTransforms)!=null&&m.length&&this.removedTransforms.forEach(([h,g])=>{i.getValue(h).set(g)}),this.resolveNoneKeyframes()}}function bb(a,i,o){if(a==null)return[];if(a instanceof EventTarget)return[a];if(typeof a=="string"){let l=document;const c=(o==null?void 0:o[a])??l.querySelectorAll(a);return c?Array.from(c):[]}return Array.from(a).filter(l=>l!=null)}const tf=(a,i)=>i&&typeof a=="number"?i.transform(a):a;function Qo(a){return Cy(a)&&"offsetHeight"in a&&!("ownerSVGElement"in a)}const{schedule:Hf}=qy(queueMicrotask,!1),ra={x:!1,y:!1};function vb(){return ra.x||ra.y}function GS(a){return a==="x"||a==="y"?ra[a]?null:(ra[a]=!0,()=>{ra[a]=!1}):ra.x||ra.y?null:(ra.x=ra.y=!0,()=>{ra.x=ra.y=!1})}function jb(a,i){const o=bb(a),l=new AbortController,c={passive:!0,...i,signal:l.signal};return[o,c,()=>l.abort()]}function YS(a){return!(a.pointerType==="touch"||vb())}function FS(a,i,o={}){const[l,c,f]=jb(a,o);return l.forEach(p=>{let m=!1,h=!1,g;const b=()=>{p.removeEventListener("pointerleave",S)},y=C=>{g&&(g(C),g=void 0),b()},x=C=>{m=!1,window.removeEventListener("pointerup",x),window.removeEventListener("pointercancel",x),h&&(h=!1,y(C))},w=()=>{m=!0,window.addEventListener("pointerup",x,c),window.addEventListener("pointercancel",x,c)},S=C=>{if(C.pointerType!=="touch"){if(m){h=!0;return}y(C)}},N=C=>{if(!YS(C))return;h=!1;const T=i(p,C);typeof T=="function"&&(g=T,p.addEventListener("pointerleave",S,c))};p.addEventListener("pointerenter",N,c),p.addEventListener("pointerdown",w,c)}),f}const Sb=(a,i)=>i?a===i?!0:Sb(a,i.parentElement):!1,Gf=a=>a.pointerType==="mouse"?typeof a.button!="number"||a.button<=0:a.isPrimary!==!1,IS=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function XS(a){return IS.has(a.tagName)||a.isContentEditable===!0}const PS=new Set(["INPUT","SELECT","TEXTAREA"]);function $S(a){return PS.has(a.tagName)||a.isContentEditable===!0}const Ko=new WeakSet;function Og(a){return i=>{i.key==="Enter"&&a(i)}}function cd(a,i){a.dispatchEvent(new PointerEvent("pointer"+i,{isPrimary:!0,bubbles:!0}))}const ZS=(a,i)=>{const o=a.currentTarget;if(!o)return;const l=Og(()=>{if(Ko.has(o))return;cd(o,"down");const c=Og(()=>{cd(o,"up")}),f=()=>cd(o,"cancel");o.addEventListener("keyup",c,i),o.addEventListener("blur",f,i)});o.addEventListener("keydown",l,i),o.addEventListener("blur",()=>o.removeEventListener("keydown",l),i)};function Lg(a){return Gf(a)&&!vb()}const Bg=new WeakSet;function QS(a,i,o={}){const[l,c,f]=jb(a,o),p=m=>{const h=m.currentTarget;if(!Lg(m)||Bg.has(m))return;Ko.add(h),o.stopPropagation&&Bg.add(m);const g=i(h,m),b={...c,capture:!0},y=(S,N)=>{window.removeEventListener("pointerup",x,b),window.removeEventListener("pointercancel",w,b),Ko.has(h)&&Ko.delete(h),Lg(S)&&typeof g=="function"&&g(S,{success:N})},x=S=>{y(S,h===window||h===document||o.useGlobalTarget||Sb(h,S.target))},w=S=>{y(S,!1)};window.addEventListener("pointerup",x,b),window.addEventListener("pointercancel",w,b)};return l.forEach(m=>{(o.useGlobalTarget?window:m).addEventListener("pointerdown",p,c),Qo(m)&&(m.addEventListener("focus",g=>ZS(g,c)),!XS(m)&&!m.hasAttribute("tabindex")&&(m.tabIndex=0))}),f}function Yf(a){return Cy(a)&&"ownerSVGElement"in a}const Wo=new WeakMap;let hn;const wb=(a,i,o)=>(l,c)=>c&&c[0]?c[0][a+"Size"]:Yf(l)&&"getBBox"in l?l.getBBox()[i]:l[o],KS=wb("inline","width","offsetWidth"),WS=wb("block","height","offsetHeight");function JS({target:a,borderBoxSize:i}){var o;(o=Wo.get(a))==null||o.forEach(l=>{l(a,{get width(){return KS(a,i)},get height(){return WS(a,i)}})})}function ew(a){a.forEach(JS)}function tw(){typeof ResizeObserver>"u"||(hn=new ResizeObserver(ew))}function aw(a,i){hn||tw();const o=bb(a);return o.forEach(l=>{let c=Wo.get(l);c||(c=new Set,Wo.set(l,c)),c.add(i),hn==null||hn.observe(l)}),()=>{o.forEach(l=>{const c=Wo.get(l);c==null||c.delete(i),c!=null&&c.size||hn==null||hn.unobserve(l)})}}const Jo=new Set;let Li;function nw(){Li=()=>{const a={get width(){return window.innerWidth},get height(){return window.innerHeight}};Jo.forEach(i=>i(a))},window.addEventListener("resize",Li)}function iw(a){return Jo.add(a),Li||nw(),()=>{Jo.delete(a),!Jo.size&&typeof Li=="function"&&(window.removeEventListener("resize",Li),Li=void 0)}}function Ug(a,i){return typeof a=="function"?iw(a):aw(a,i)}function rw(a){return Yf(a)&&a.tagName==="svg"}const sw=[...gb,We,oa],ow=a=>sw.find(mb(a)),Vg=()=>({translate:0,scale:1,origin:0,originPoint:0}),Bi=()=>({x:Vg(),y:Vg()}),_g=()=>({min:0,max:0}),et=()=>({x:_g(),y:_g()}),lw=new WeakMap;function Cl(a){return a!==null&&typeof a=="object"&&typeof a.start=="function"}function is(a){return typeof a=="string"||Array.isArray(a)}const Ff=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],If=["initial",...Ff];function Tl(a){return Cl(a.animate)||If.some(i=>is(a[i]))}function kb(a){return!!(Tl(a)||a.variants)}function cw(a,i,o){for(const l in i){const c=i[l],f=o[l];if(ft(c))a.addValue(l,c);else if(ft(f))a.addValue(l,Vi(c,{owner:a}));else if(f!==c)if(a.hasValue(l)){const p=a.getValue(l);p.liveStyle===!0?p.jump(c):p.hasAnimated||p.set(c)}else{const p=a.getStaticValue(l);a.addValue(l,Vi(p!==void 0?p:c,{owner:a}))}}for(const l in o)i[l]===void 0&&a.removeValue(l);return i}const af={current:null},Nb={current:!1},uw=typeof window<"u";function dw(){if(Nb.current=!0,!!uw)if(window.matchMedia){const a=window.matchMedia("(prefers-reduced-motion)"),i=()=>af.current=a.matches;a.addEventListener("change",i),i()}else af.current=!1}const qg=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let pl={};function Cb(a){pl=a}function fw(){return pl}class pw{scrapeMotionValuesFromProps(i,o,l){return{}}constructor({parent:i,props:o,presenceContext:l,reducedMotionConfig:c,skipAnimations:f,blockInitialAnimation:p,visualState:m},h={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=Bf,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const w=xt.now();this.renderScheduledAt<w&&(this.renderScheduledAt=w,Ue.render(this.render,!1,!0))};const{latestValues:g,renderState:b}=m;this.latestValues=g,this.baseTarget={...g},this.initialValues=o.initial?{...g}:{},this.renderState=b,this.parent=i,this.props=o,this.presenceContext=l,this.depth=i?i.depth+1:0,this.reducedMotionConfig=c,this.skipAnimationsConfig=f,this.options=h,this.blockInitialAnimation=!!p,this.isControllingVariants=Tl(o),this.isVariantNode=kb(o),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(i&&i.current);const{willChange:y,...x}=this.scrapeMotionValuesFromProps(o,{},this);for(const w in x){const S=x[w];g[w]!==void 0&&ft(S)&&S.set(g[w])}}mount(i){var o,l;if(this.hasBeenMounted)for(const c in this.initialValues)(o=this.values.get(c))==null||o.jump(this.initialValues[c]),this.latestValues[c]=this.initialValues[c];this.current=i,lw.set(i,this),this.projection&&!this.projection.instance&&this.projection.mount(i),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((c,f)=>this.bindToMotionValue(f,c)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(Nb.current||dw(),this.shouldReduceMotion=af.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,(l=this.parent)==null||l.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){var i;this.projection&&this.projection.unmount(),bn(this.notifyUpdate),bn(this.render),this.valueSubscriptions.forEach(o=>o()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),(i=this.parent)==null||i.removeChild(this);for(const o in this.events)this.events[o].clear();for(const o in this.features){const l=this.features[o];l&&(l.unmount(),l.isMounted=!1)}this.current=null}addChild(i){this.children.add(i),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(i)}removeChild(i){this.children.delete(i),this.enteringChildren&&this.enteringChildren.delete(i)}bindToMotionValue(i,o){if(this.valueSubscriptions.has(i)&&this.valueSubscriptions.get(i)(),o.accelerate&&ob.has(i)&&this.current instanceof HTMLElement){const{factory:p,keyframes:m,times:h,ease:g,duration:b}=o.accelerate,y=new rb({element:this.current,name:i,keyframes:m,times:h,ease:g,duration:Ut(b)}),x=p(y);this.valueSubscriptions.set(i,()=>{x(),y.cancel()});return}const l=Yi.has(i);l&&this.onBindTransform&&this.onBindTransform();const c=o.on("change",p=>{this.latestValues[i]=p,this.props.onUpdate&&Ue.preRender(this.notifyUpdate),l&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let f;typeof window<"u"&&window.MotionCheckAppearSync&&(f=window.MotionCheckAppearSync(this,i,o)),this.valueSubscriptions.set(i,()=>{c(),f&&f()})}sortNodePosition(i){return!this.current||!this.sortInstanceNodePosition||this.type!==i.type?0:this.sortInstanceNodePosition(this.current,i.current)}updateFeatures(){let i="animation";for(i in pl){const o=pl[i];if(!o)continue;const{isEnabled:l,Feature:c}=o;if(!this.features[i]&&c&&l(this.props)&&(this.features[i]=new c(this)),this.features[i]){const f=this.features[i];f.isMounted?f.update():(f.mount(),f.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):et()}getStaticValue(i){return this.latestValues[i]}setStaticValue(i,o){this.latestValues[i]=o}update(i,o){(i.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=i,this.prevPresenceContext=this.presenceContext,this.presenceContext=o;for(let l=0;l<qg.length;l++){const c=qg[l];this.propEventSubscriptions[c]&&(this.propEventSubscriptions[c](),delete this.propEventSubscriptions[c]);const f="on"+c,p=i[f];p&&(this.propEventSubscriptions[c]=this.on(c,p))}this.prevMotionValues=cw(this,this.scrapeMotionValuesFromProps(i,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(i){return this.props.variants?this.props.variants[i]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(i){const o=this.getClosestVariantNode();if(o)return o.variantChildren&&o.variantChildren.add(i),()=>o.variantChildren.delete(i)}addValue(i,o){const l=this.values.get(i);o!==l&&(l&&this.removeValue(i),this.bindToMotionValue(i,o),this.values.set(i,o),this.latestValues[i]=o.get())}removeValue(i){this.values.delete(i);const o=this.valueSubscriptions.get(i);o&&(o(),this.valueSubscriptions.delete(i)),delete this.latestValues[i],this.removeValueFromRenderState(i,this.renderState)}hasValue(i){return this.values.has(i)}getValue(i,o){if(this.props.values&&this.props.values[i])return this.props.values[i];let l=this.values.get(i);return l===void 0&&o!==void 0&&(l=Vi(o===null?void 0:o,{owner:this}),this.addValue(i,l)),l}readValue(i,o){let l=this.latestValues[i]!==void 0||!this.current?this.latestValues[i]:this.getBaseTargetFromProps(this.props,i)??this.readValueFromInstance(this.current,i,this.options);return l!=null&&(typeof l=="string"&&(Ny(l)||Ty(l))?l=parseFloat(l):!ow(l)&&oa.test(o)&&(l=yb(i,o)),this.setBaseTarget(i,ft(l)?l.get():l)),ft(l)?l.get():l}setBaseTarget(i,o){this.baseTarget[i]=o}getBaseTarget(i){var f;const{initial:o}=this.props;let l;if(typeof o=="string"||typeof o=="object"){const p=_f(this.props,o,(f=this.presenceContext)==null?void 0:f.custom);p&&(l=p[i])}if(o&&l!==void 0)return l;const c=this.getBaseTargetFromProps(this.props,i);return c!==void 0&&!ft(c)?c:this.initialValues[i]!==void 0&&l===void 0?void 0:this.baseTarget[i]}on(i,o){return this.events[i]||(this.events[i]=new Tf),this.events[i].add(o)}notify(i,...o){this.events[i]&&this.events[i].notify(...o)}scheduleRenderMicrotask(){Hf.render(this.render)}}class Tb extends pw{constructor(){super(...arguments),this.KeyframeResolver=HS}sortInstanceNodePosition(i,o){return i.compareDocumentPosition(o)&2?1:-1}getBaseTargetFromProps(i,o){const l=i.style;return l?l[o]:void 0}removeValueFromRenderState(i,{vars:o,style:l}){delete o[i],delete l[i]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:i}=this.props;ft(i)&&(this.childSubscription=i.on("change",o=>{this.current&&(this.current.textContent=`${o}`)}))}}class vn{constructor(i){this.isMounted=!1,this.node=i}update(){}}function Eb({top:a,left:i,right:o,bottom:l}){return{x:{min:i,max:o},y:{min:a,max:l}}}function hw({x:a,y:i}){return{top:i.min,right:a.max,bottom:i.max,left:a.min}}function mw(a,i){if(!i)return a;const o=i({x:a.left,y:a.top}),l=i({x:a.right,y:a.bottom});return{top:o.y,left:o.x,bottom:l.y,right:l.x}}function ud(a){return a===void 0||a===1}function nf({scale:a,scaleX:i,scaleY:o}){return!ud(a)||!ud(i)||!ud(o)}function Gn(a){return nf(a)||zb(a)||a.z||a.rotate||a.rotateX||a.rotateY||a.skewX||a.skewY}function zb(a){return Hg(a.x)||Hg(a.y)}function Hg(a){return a&&a!=="0%"}function hl(a,i,o){const l=a-o,c=i*l;return o+c}function Gg(a,i,o,l,c){return c!==void 0&&(a=hl(a,c,l)),hl(a,o,l)+i}function rf(a,i=0,o=1,l,c){a.min=Gg(a.min,i,o,l,c),a.max=Gg(a.max,i,o,l,c)}function Mb(a,{x:i,y:o}){rf(a.x,i.translate,i.scale,i.originPoint),rf(a.y,o.translate,o.scale,o.originPoint)}const Yg=.999999999999,Fg=1.0000000000001;function gw(a,i,o,l=!1){var m;const c=o.length;if(!c)return;i.x=i.y=1;let f,p;for(let h=0;h<c;h++){f=o[h],p=f.projectionDelta;const{visualElement:g}=f.options;g&&g.props.style&&g.props.style.display==="contents"||(l&&f.options.layoutScroll&&f.scroll&&f!==f.root&&(ga(a.x,-f.scroll.offset.x),ga(a.y,-f.scroll.offset.y)),p&&(i.x*=p.x.scale,i.y*=p.y.scale,Mb(a,p)),l&&Gn(f.latestValues)&&el(a,f.latestValues,(m=f.layout)==null?void 0:m.layoutBox))}i.x<Fg&&i.x>Yg&&(i.x=1),i.y<Fg&&i.y>Yg&&(i.y=1)}function ga(a,i){a.min+=i,a.max+=i}function Ig(a,i,o,l,c=.5){const f=Be(a.min,a.max,c);rf(a,i,o,f,l)}function Xg(a,i){return typeof a=="string"?parseFloat(a)/100*(i.max-i.min):a}function el(a,i,o){const l=o??a;Ig(a.x,Xg(i.x,l.x),i.scaleX,i.scale,i.originX),Ig(a.y,Xg(i.y,l.y),i.scaleY,i.scale,i.originY)}function Ab(a,i){return Eb(mw(a.getBoundingClientRect(),i))}function xw(a,i,o){const l=Ab(a,o),{scroll:c}=i;return c&&(ga(l.x,c.offset.x),ga(l.y,c.offset.y)),l}const yw={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},bw=Gi.length;function vw(a,i,o){let l="",c=!0;for(let p=0;p<bw;p++){const m=Gi[p],h=a[m];if(h===void 0)continue;let g=!0;if(typeof h=="number")g=h===(m.startsWith("scale")?1:0);else{const b=parseFloat(h);g=m.startsWith("scale")?b===1:b===0}if(!g||o){const b=tf(h,fl[m]);if(!g){c=!1;const y=yw[m]||m;l+=`${y}(${b}) `}o&&(i[m]=b)}}const f=a.pathRotation;return f&&(c=!1,l+=`rotate(${tf(f,fl.pathRotation)}) `),l=l.trim(),o?l=o(i,c?"":l):c&&(l="none"),l}function Xf(a,i,o){const{style:l,vars:c,transformOrigin:f}=a;let p=!1,m=!1;for(const h in i){const g=i[h];if(Yi.has(h)){p=!0;continue}else if(Gy(h)){c[h]=g;continue}else{const b=tf(g,fl[h]);h.startsWith("origin")?(m=!0,f[h]=b):l[h]=b}}if(i.transform||(p||o?l.transform=vw(i,a.transform,o):l.transform&&(l.transform="none")),m){const{originX:h="50%",originY:g="50%",originZ:b=0}=f;l.transformOrigin=`${h} ${g} ${b}`}}function Rb(a,{style:i,vars:o},l,c){const f=a.style;let p;for(p in i)f[p]=i[p];c==null||c.applyProjectionStyles(f,l);for(p in o)f.setProperty(p,o[p])}function Pg(a,i){return i.max===i.min?0:a/(i.max-i.min)*100}const Xr={correct:(a,i)=>{if(!i.target)return a;if(typeof a=="string")if(oe.test(a))a=parseFloat(a);else return a;const o=Pg(a,i.target.x),l=Pg(a,i.target.y);return`${o}% ${l}%`}},jw={correct:(a,{treeScale:i,projectionDelta:o})=>{const l=a,c=oa.parse(a);if(c.length>5)return l;const f=oa.createTransformer(a),p=typeof c[0]!="number"?1:0,m=o.x.scale*i.x,h=o.y.scale*i.y;c[0+p]/=m,c[1+p]/=h;const g=Be(m,h,.5);return typeof c[2+p]=="number"&&(c[2+p]/=g),typeof c[3+p]=="number"&&(c[3+p]/=g),f(c)}},sf={borderRadius:{...Xr,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:Xr,borderTopRightRadius:Xr,borderBottomLeftRadius:Xr,borderBottomRightRadius:Xr,boxShadow:jw};function Db(a,{layout:i,layoutId:o}){return Yi.has(a)||a.startsWith("origin")||(i||o!==void 0)&&(!!sf[a]||a==="opacity")}function Pf(a,i,o){var p;const l=a.style,c=i==null?void 0:i.style,f={};if(!l)return f;for(const m in l)(ft(l[m])||c&&ft(c[m])||Db(m,a)||((p=o==null?void 0:o.getValue(m))==null?void 0:p.liveStyle)!==void 0)&&(f[m]=l[m]);return f}function Sw(a){return window.getComputedStyle(a)}class ww extends Tb{constructor(){super(...arguments),this.type="html",this.renderInstance=Rb}readValueFromInstance(i,o){var l;if(Yi.has(o))return(l=this.projection)!=null&&l.isProjecting?Fd(o):Yj(i,o);{const c=Sw(i),f=(Gy(o)?c.getPropertyValue(o):c[o])||0;return typeof f=="string"?f.trim():f}}measureInstanceViewportBox(i,{transformPagePoint:o}){return Ab(i,o)}build(i,o,l){Xf(i,o,l.transformTemplate)}scrapeMotionValuesFromProps(i,o,l){return Pf(i,o,l)}}const kw={offset:"stroke-dashoffset",array:"stroke-dasharray"},Nw={offset:"strokeDashoffset",array:"strokeDasharray"};function Cw(a,i,o=1,l=0,c=!0){a.pathLength=1;const f=c?kw:Nw;a[f.offset]=`${-l}`,a[f.array]=`${i} ${o}`}const Tw=["offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function Ob(a,{attrX:i,attrY:o,attrScale:l,pathLength:c,pathSpacing:f=1,pathOffset:p=0,...m},h,g,b){if(Xf(a,m,g),h){a.style.viewBox&&(a.attrs.viewBox=a.style.viewBox);return}a.attrs=a.style,a.style={};const{attrs:y,style:x}=a;y.transform&&(x.transform=y.transform,delete y.transform),(x.transform||y.transformOrigin)&&(x.transformOrigin=y.transformOrigin??"50% 50%",delete y.transformOrigin),x.transform&&(x.transformBox=(b==null?void 0:b.transformBox)??"fill-box",delete y.transformBox);for(const w of Tw)y[w]!==void 0&&(x[w]=y[w],delete y[w]);i!==void 0&&(y.x=i),o!==void 0&&(y.y=o),l!==void 0&&(y.scale=l),c!==void 0&&Cw(y,c,f,p,!1)}const Lb=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),Bb=a=>typeof a=="string"&&a.toLowerCase()==="svg";function Ew(a,i,o,l){Rb(a,i,void 0,l);for(const c in i.attrs)a.setAttribute(Lb.has(c)?c:qf(c),i.attrs[c])}function Ub(a,i,o){const l=Pf(a,i,o);for(const c in a)if(ft(a[c])||ft(i[c])){const f=Gi.indexOf(c)!==-1?"attr"+c.charAt(0).toUpperCase()+c.substring(1):c;l[f]=a[c]}return l}class zw extends Tb{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=et}getBaseTargetFromProps(i,o){return i[o]}readValueFromInstance(i,o){if(Yi.has(o)){const l=xb(o);return l&&l.default||0}return o=Lb.has(o)?o:qf(o),i.getAttribute(o)}scrapeMotionValuesFromProps(i,o,l){return Ub(i,o,l)}build(i,o,l){Ob(i,o,this.isSVGTag,l.transformTemplate,l.style)}renderInstance(i,o,l,c){Ew(i,o,l,c)}mount(i){this.isSVGTag=Bb(i.tagName),super.mount(i)}}const Mw=If.length;function Vb(a){if(!a)return;if(!a.isControllingVariants){const o=a.parent?Vb(a.parent)||{}:{};return a.props.initial!==void 0&&(o.initial=a.props.initial),o}const i={};for(let o=0;o<Mw;o++){const l=If[o],c=a.props[l];(is(c)||c===!1)&&(i[l]=c)}return i}function _b(a,i){if(!Array.isArray(i))return!1;const o=i.length;if(o!==a.length)return!1;for(let l=0;l<o;l++)if(i[l]!==a[l])return!1;return!0}const Aw=[...Ff].reverse(),Rw=Ff.length;function Dw(a){return i=>Promise.all(i.map(({animation:o,options:l})=>MS(a,o,l)))}function Ow(a){let i=Dw(a),o=$g(),l=!0,c=!1;const f=g=>(b,y)=>{var w;const x=$n(a,y,g==="exit"?(w=a.presenceContext)==null?void 0:w.custom:void 0);if(x){const{transition:S,transitionEnd:N,...C}=x;b={...b,...C,...N}}return b};function p(g){i=g(a)}function m(g){const{props:b}=a,y=Vb(a.parent)||{},x=[],w=new Set;let S={},N=1/0;for(let T=0;T<Rw;T++){const z=Aw[T],E=o[z],A=b[z]!==void 0?b[z]:y[z],R=is(A),B=z===g?E.isActive:null;B===!1&&(N=T);let _=A===y[z]&&A!==b[z]&&R;if(_&&(l||c)&&a.manuallyAnimateOnMount&&(_=!1),E.protectedKeys={...S},!E.isActive&&B===null||!A&&!E.prevProp||Cl(A)||typeof A=="boolean")continue;if(z==="exit"&&E.isActive&&B!==!0){E.prevResolvedValues&&(S={...S,...E.prevResolvedValues});continue}const W=Lw(E.prevProp,A);let ne=W||z===g&&E.isActive&&!_&&R||T>N&&R,H=!1;const F=Array.isArray(A)?A:[A];let Q=F.reduce(f(z),{});B===!1&&(Q={});const{prevResolvedValues:K={}}=E,te={...K,...Q},le=ie=>{ne=!0,w.has(ie)&&(H=!0,w.delete(ie)),E.needsAnimating[ie]=!0;const fe=a.getValue(ie);fe&&(fe.liveStyle=!1)};for(const ie in te){const fe=Q[ie],ye=K[ie];if(S.hasOwnProperty(ie))continue;let D=!1;Qd(fe)&&Qd(ye)?D=!_b(fe,ye)||W:D=fe!==ye,D?fe!=null?le(ie):w.add(ie):fe!==void 0&&w.has(ie)?le(ie):E.protectedKeys[ie]=!0}E.prevProp=A,E.prevResolvedValues=Q,E.isActive&&(S={...S,...Q}),(l||c)&&a.blockInitialAnimation&&(ne=!1);const q=_&&W;ne&&(!q||H)&&x.push(...F.map(ie=>{const fe={type:z};if(typeof ie=="string"&&(l||c)&&!q&&a.manuallyAnimateOnMount&&a.parent){const{parent:ye}=a,D=$n(ye,ie);if(ye.enteringChildren&&D){const{delayChildren:$}=D.transition||{};fe.delay=lb(ye.enteringChildren,a,$)}}return{animation:ie,options:fe}}))}if(w.size){const T={};if(typeof b.initial!="boolean"){const z=$n(a,Array.isArray(b.initial)?b.initial[0]:b.initial);z&&z.transition&&(T.transition=z.transition)}w.forEach(z=>{const E=a.getBaseTarget(z),A=a.getValue(z);A&&(A.liveStyle=!0),T[z]=E??null}),x.push({animation:T})}let C=!!x.length;return l&&(b.initial===!1||b.initial===b.animate)&&!a.manuallyAnimateOnMount&&(C=!1),l=!1,c=!1,C?i(x):Promise.resolve()}function h(g,b){var x;if(o[g].isActive===b)return Promise.resolve();(x=a.variantChildren)==null||x.forEach(w=>{var S;return(S=w.animationState)==null?void 0:S.setActive(g,b)}),o[g].isActive=b;const y=m(g);for(const w in o)o[w].protectedKeys={};return y}return{animateChanges:m,setActive:h,setAnimateFunction:p,getState:()=>o,reset:()=>{o=$g(),c=!0}}}function Lw(a,i){return typeof i=="string"?i!==a:Array.isArray(i)?!_b(i,a):!1}function qn(a=!1){return{isActive:a,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function $g(){return{animate:qn(!0),whileInView:qn(),whileHover:qn(),whileTap:qn(),whileDrag:qn(),whileFocus:qn(),exit:qn()}}function of(a,i){a.min=i.min,a.max=i.max}function ia(a,i){of(a.x,i.x),of(a.y,i.y)}function Zg(a,i){a.translate=i.translate,a.scale=i.scale,a.originPoint=i.originPoint,a.origin=i.origin}const qb=1e-4,Bw=1-qb,Uw=1+qb,Hb=.01,Vw=0-Hb,_w=0+Hb;function yt(a){return a.max-a.min}function qw(a,i,o){return Math.abs(a-i)<=o}function Qg(a,i,o,l=.5){a.origin=l,a.originPoint=Be(i.min,i.max,a.origin),a.scale=yt(o)/yt(i),a.translate=Be(o.min,o.max,a.origin)-a.originPoint,(a.scale>=Bw&&a.scale<=Uw||isNaN(a.scale))&&(a.scale=1),(a.translate>=Vw&&a.translate<=_w||isNaN(a.translate))&&(a.translate=0)}function Jr(a,i,o,l){Qg(a.x,i.x,o.x,l?l.originX:void 0),Qg(a.y,i.y,o.y,l?l.originY:void 0)}function Kg(a,i,o,l=0){const c=l?Be(o.min,o.max,l):o.min;a.min=c+i.min,a.max=a.min+yt(i)}function Hw(a,i,o,l){Kg(a.x,i.x,o.x,l==null?void 0:l.x),Kg(a.y,i.y,o.y,l==null?void 0:l.y)}function Wg(a,i,o,l=0){const c=l?Be(o.min,o.max,l):o.min;a.min=i.min-c,a.max=a.min+yt(i)}function ml(a,i,o,l){Wg(a.x,i.x,o.x,l==null?void 0:l.x),Wg(a.y,i.y,o.y,l==null?void 0:l.y)}function Jg(a,i,o,l,c){return a-=i,a=hl(a,1/o,l),c!==void 0&&(a=hl(a,1/c,l)),a}function Gw(a,i=0,o=1,l=.5,c,f=a,p=a){if(xa.test(i)&&(i=parseFloat(i),i=Be(p.min,p.max,i/100)-p.min),typeof i!="number")return;let m=Be(f.min,f.max,l);a===f&&(m-=i),a.min=Jg(a.min,i,o,m,c),a.max=Jg(a.max,i,o,m,c)}function ex(a,i,[o,l,c],f,p){Gw(a,i[o],i[l],i[c],i.scale,f,p)}const Yw=["x","scaleX","originX"],Fw=["y","scaleY","originY"];function tx(a,i,o,l){ex(a.x,i,Yw,o?o.x:void 0,l?l.x:void 0),ex(a.y,i,Fw,o?o.y:void 0,l?l.y:void 0)}function ax(a){return a.translate===0&&a.scale===1}function Gb(a){return ax(a.x)&&ax(a.y)}function nx(a,i){return a.min===i.min&&a.max===i.max}function Iw(a,i){return nx(a.x,i.x)&&nx(a.y,i.y)}function ix(a,i){return Math.round(a.min)===Math.round(i.min)&&Math.round(a.max)===Math.round(i.max)}function Yb(a,i){return ix(a.x,i.x)&&ix(a.y,i.y)}function rx(a){return yt(a.x)/yt(a.y)}function sx(a,i){return a.translate===i.translate&&a.scale===i.scale&&a.originPoint===i.originPoint}function ma(a){return[a("x"),a("y")]}function Xw(a,i,o){let l="";const c=a.x.translate/i.x,f=a.y.translate/i.y,p=(o==null?void 0:o.z)||0;if((c||f||p)&&(l=`translate3d(${c}px, ${f}px, ${p}px) `),(i.x!==1||i.y!==1)&&(l+=`scale(${1/i.x}, ${1/i.y}) `),o){const{transformPerspective:g,rotate:b,pathRotation:y,rotateX:x,rotateY:w,skewX:S,skewY:N}=o;g&&(l=`perspective(${g}px) ${l}`),b&&(l+=`rotate(${b}deg) `),y&&(l+=`rotate(${y}deg) `),x&&(l+=`rotateX(${x}deg) `),w&&(l+=`rotateY(${w}deg) `),S&&(l+=`skewX(${S}deg) `),N&&(l+=`skewY(${N}deg) `)}const m=a.x.scale*i.x,h=a.y.scale*i.y;return(m!==1||h!==1)&&(l+=`scale(${m}, ${h})`),l||"none"}const Fb=["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"],Pw=Fb.length,ox=a=>typeof a=="string"?parseFloat(a):a,lx=a=>typeof a=="number"||oe.test(a);function $w(a,i,o,l,c,f){c?(a.opacity=Be(0,o.opacity??1,Zw(l)),a.opacityExit=Be(i.opacity??1,0,Qw(l))):f&&(a.opacity=Be(i.opacity??1,o.opacity??1,l));for(let p=0;p<Pw;p++){const m=Fb[p];let h=cx(i,m),g=cx(o,m);if(h===void 0&&g===void 0)continue;h||(h=0),g||(g=0),h===0||g===0||lx(h)===lx(g)?(a[m]=Math.max(Be(ox(h),ox(g),l),0),(xa.test(g)||xa.test(h))&&(a[m]+="%")):a[m]=g}(i.rotate||o.rotate)&&(a.rotate=Be(i.rotate||0,o.rotate||0,l))}function cx(a,i){return a[i]!==void 0?a[i]:a.borderRadius}const Zw=Ib(0,.5,By),Qw=Ib(.5,.95,Wt);function Ib(a,i,o){return l=>l<a?0:l>i?1:o(as(a,i,l))}function Kw(a,i,o){const l=ft(a)?a:Vi(a);return l.start(Vf("",l,i,o)),l.animation}function rs(a,i,o,l={passive:!0}){return a.addEventListener(i,o,l),()=>a.removeEventListener(i,o,l)}const Ww=(a,i)=>a.depth-i.depth;class Jw{constructor(){this.children=[],this.isDirty=!1}add(i){Nf(this.children,i),this.isDirty=!0}remove(i){ol(this.children,i),this.isDirty=!0}forEach(i){this.isDirty&&this.children.sort(Ww),this.isDirty=!1,this.children.forEach(i)}}function e3(a,i){const o=xt.now(),l=({timestamp:c})=>{const f=c-o;f>=i&&(bn(l),a(f-i))};return Ue.setup(l,!0),()=>bn(l)}function tl(a){return ft(a)?a.get():a}class t3{constructor(){this.members=[]}add(i){Nf(this.members,i);for(let o=this.members.length-1;o>=0;o--){const l=this.members[o];if(l===i||l===this.lead||l===this.prevLead)continue;const c=l.instance;(!c||c.isConnected===!1)&&!l.snapshot&&(ol(this.members,l),l.unmount())}i.scheduleRender()}remove(i){if(ol(this.members,i),i===this.prevLead&&(this.prevLead=void 0),i===this.lead){const o=this.members[this.members.length-1];o&&this.promote(o)}}relegate(i){var o;for(let l=this.members.indexOf(i)-1;l>=0;l--){const c=this.members[l];if(c.isPresent!==!1&&((o=c.instance)==null?void 0:o.isConnected)!==!1)return this.promote(c),!0}return!1}promote(i,o){var c;const l=this.lead;if(i!==l&&(this.prevLead=l,this.lead=i,i.show(),l)){l.updateSnapshot(),i.scheduleRender();const{layoutDependency:f}=l.options,{layoutDependency:p}=i.options;(f===void 0||f!==p)&&(i.resumeFrom=l,o&&(l.preserveOpacity=!0),l.snapshot&&(i.snapshot=l.snapshot,i.snapshot.latestValues=l.animationValues||l.latestValues),(c=i.root)!=null&&c.isUpdating&&(i.isLayoutDirty=!0)),i.options.crossfade===!1&&l.hide()}}exitAnimationComplete(){this.members.forEach(i=>{var o,l,c,f,p;(l=(o=i.options).onExitComplete)==null||l.call(o),(p=(c=i.resumingFrom)==null?void 0:(f=c.options).onExitComplete)==null||p.call(f)})}scheduleRender(){this.members.forEach(i=>i.instance&&i.scheduleRender(!1))}removeLeadSnapshot(){var i;(i=this.lead)!=null&&i.snapshot&&(this.lead.snapshot=void 0)}}const al={hasAnimatedSinceResize:!0,hasEverUpdated:!1},dd=["","X","Y","Z"],a3=1e3;let n3=0;function fd(a,i,o,l){const{latestValues:c}=i;c[a]&&(o[a]=c[a],i.setStaticValue(a,0),l&&(l[a]=0))}function Xb(a){if(a.hasCheckedOptimisedAppear=!0,a.root===a)return;const{visualElement:i}=a.options;if(!i)return;const o=pb(i);if(window.MotionHasOptimisedAnimation(o,"transform")){const{layout:c,layoutId:f}=a.options;window.MotionCancelOptimisedAnimation(o,"transform",Ue,!(c||f))}const{parent:l}=a;l&&!l.hasCheckedOptimisedAppear&&Xb(l)}function Pb({attachResizeListener:a,defaultParent:i,measureScroll:o,checkIsScrollRoot:l,resetTransform:c}){return class{constructor(p={},m=i==null?void 0:i()){this.id=n3++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(s3),this.nodes.forEach(f3),this.nodes.forEach(p3),this.nodes.forEach(o3)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=p,this.root=m?m.root||m:this,this.path=m?[...m.path,m]:[],this.parent=m,this.depth=m?m.depth+1:0;for(let h=0;h<this.path.length;h++)this.path[h].shouldResetTransform=!0;this.root===this&&(this.nodes=new Jw)}addEventListener(p,m){return this.eventHandlers.has(p)||this.eventHandlers.set(p,new Tf),this.eventHandlers.get(p).add(m)}notifyListeners(p,...m){const h=this.eventHandlers.get(p);h&&h.notify(...m)}hasListeners(p){return this.eventHandlers.has(p)}mount(p){if(this.instance)return;this.isSVG=Yf(p)&&!rw(p),this.instance=p;const{layoutId:m,layout:h,visualElement:g}=this.options;if(g&&!g.current&&g.mount(p),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(h||m)&&(this.isLayoutDirty=!0),a){let b,y=0;const x=()=>this.root.updateBlockedByResize=!1;Ue.read(()=>{y=window.innerWidth}),a(p,()=>{const w=window.innerWidth;w!==y&&(y=w,this.root.updateBlockedByResize=!0,b&&b(),b=e3(x,250),al.hasAnimatedSinceResize&&(al.hasAnimatedSinceResize=!1,this.nodes.forEach(fx)))})}m&&this.root.registerSharedNode(m,this),this.options.animate!==!1&&g&&(m||h)&&this.addEventListener("didUpdate",({delta:b,hasLayoutChanged:y,hasRelativeLayoutChanged:x,layout:w})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const S=this.options.transition||g.getDefaultTransition()||y3,{onLayoutAnimationStart:N,onLayoutAnimationComplete:C}=g.getProps(),T=!this.targetLayout||!Yb(this.targetLayout,w),z=!y&&x;if(this.options.layoutRoot||this.resumeFrom||z||y&&(T||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const E={...Uf(S,"layout"),onPlay:N,onComplete:C};(g.shouldReduceMotion||this.options.layoutRoot)&&(E.delay=0,E.type=!1),this.startAnimation(E),this.setAnimationOrigin(b,z,E.path)}else y||fx(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=w})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const p=this.getStack();p&&p.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),bn(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(h3),this.animationId++)}getTransformTemplate(){const{visualElement:p}=this.options;return p&&p.getProps().transformTemplate}willUpdate(p=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&Xb(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let b=0;b<this.path.length;b++){const y=this.path[b];y.shouldResetTransform=!0,(typeof y.latestValues.x=="string"||typeof y.latestValues.y=="string")&&(y.isLayoutDirty=!0),y.updateScroll("snapshot"),y.options.layoutRoot&&y.willUpdate(!1)}const{layoutId:m,layout:h}=this.options;if(m===void 0&&!h)return;const g=this.getTransformTemplate();this.prevTransformTemplateValue=g?g(this.latestValues,""):void 0,this.updateSnapshot(),p&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const h=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),h&&this.nodes.forEach(c3),this.nodes.forEach(ux);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(dx);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(u3),this.nodes.forEach(d3),this.nodes.forEach(i3),this.nodes.forEach(r3)):this.nodes.forEach(dx),this.clearAllSnapshots();const m=xt.now();dt.delta=ya(0,1e3/60,m-dt.timestamp),dt.timestamp=m,dt.isProcessing=!0,nd.update.process(dt),nd.preRender.process(dt),nd.render.process(dt),dt.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Hf.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(l3),this.sharedNodes.forEach(m3)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,Ue.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){Ue.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!yt(this.snapshot.measuredBox.x)&&!yt(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let h=0;h<this.path.length;h++)this.path[h].updateScroll();const p=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=et()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:m}=this.options;m&&m.notify("LayoutMeasure",this.layout.layoutBox,p?p.layoutBox:void 0)}updateScroll(p="measure"){let m=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===p&&(m=!1),m&&this.instance){const h=l(this.instance);this.scroll={animationId:this.root.animationId,phase:p,isRoot:h,offset:o(this.instance),wasRoot:this.scroll?this.scroll.isRoot:h}}}resetTransform(){if(!c)return;const p=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,m=this.projectionDelta&&!Gb(this.projectionDelta),h=this.getTransformTemplate(),g=h?h(this.latestValues,""):void 0,b=g!==this.prevTransformTemplateValue;p&&this.instance&&(m||Gn(this.latestValues)||b)&&(c(this.instance,g),this.shouldResetTransform=!1,this.scheduleRender())}measure(p=!0){const m=this.measurePageBox();let h=this.removeElementScroll(m);return p&&(h=this.removeTransform(h)),b3(h),{animationId:this.root.animationId,measuredBox:m,layoutBox:h,latestValues:{},source:this.id}}measurePageBox(){var g;const{visualElement:p}=this.options;if(!p)return et();const m=p.measureViewportBox();if(!(((g=this.scroll)==null?void 0:g.wasRoot)||this.path.some(v3))){const{scroll:b}=this.root;b&&(ga(m.x,b.offset.x),ga(m.y,b.offset.y))}return m}removeElementScroll(p){var h;const m=et();if(ia(m,p),(h=this.scroll)!=null&&h.wasRoot)return m;for(let g=0;g<this.path.length;g++){const b=this.path[g],{scroll:y,options:x}=b;b!==this.root&&y&&x.layoutScroll&&(y.wasRoot&&ia(m,p),ga(m.x,y.offset.x),ga(m.y,y.offset.y))}return m}applyTransform(p,m=!1,h){var b,y;const g=h||et();ia(g,p);for(let x=0;x<this.path.length;x++){const w=this.path[x];!m&&w.options.layoutScroll&&w.scroll&&w!==w.root&&(ga(g.x,-w.scroll.offset.x),ga(g.y,-w.scroll.offset.y)),Gn(w.latestValues)&&el(g,w.latestValues,(b=w.layout)==null?void 0:b.layoutBox)}return Gn(this.latestValues)&&el(g,this.latestValues,(y=this.layout)==null?void 0:y.layoutBox),g}removeTransform(p){var h;const m=et();ia(m,p);for(let g=0;g<this.path.length;g++){const b=this.path[g];if(!Gn(b.latestValues))continue;let y;b.instance&&(nf(b.latestValues)&&b.updateSnapshot(),y=et(),ia(y,b.measurePageBox())),tx(m,b.latestValues,(h=b.snapshot)==null?void 0:h.layoutBox,y)}return Gn(this.latestValues)&&tx(m,this.latestValues),m}setTargetDelta(p){this.targetDelta=p,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(p){this.options={...this.options,...p,crossfade:p.crossfade!==void 0?p.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==dt.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(p=!1){var w;const m=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=m.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=m.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=m.isSharedProjectionDirty);const h=!!this.resumingFrom||this!==m;if(!(p||h&&this.isSharedProjectionDirty||this.isProjectionDirty||(w=this.parent)!=null&&w.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:b,layoutId:y}=this.options;if(!this.layout||!(b||y))return;this.resolvedRelativeTargetAt=dt.timestamp;const x=this.getClosestProjectingParent();x&&this.linkedParentVersion!==x.layoutVersion&&!x.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&x&&x.layout?this.createRelativeTarget(x,this.layout.layoutBox,x.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=et(),this.targetWithTransforms=et()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),Hw(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):ia(this.target,this.layout.layoutBox),Mb(this.target,this.targetDelta)):ia(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&x&&!!x.resumingFrom==!!this.resumingFrom&&!x.options.layoutScroll&&x.target&&this.animationProgress!==1?this.createRelativeTarget(x,this.target,x.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||nf(this.parent.latestValues)||zb(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(p,m,h){this.relativeParent=p,this.linkedParentVersion=p.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=et(),this.relativeTargetOrigin=et(),ml(this.relativeTargetOrigin,m,h,this.options.layoutAnchor||void 0),ia(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){var S;const p=this.getLead(),m=!!this.resumingFrom||this!==p;let h=!0;if((this.isProjectionDirty||(S=this.parent)!=null&&S.isProjectionDirty)&&(h=!1),m&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(h=!1),this.resolvedRelativeTargetAt===dt.timestamp&&(h=!1),h)return;const{layout:g,layoutId:b}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(g||b))return;ia(this.layoutCorrected,this.layout.layoutBox);const y=this.treeScale.x,x=this.treeScale.y;gw(this.layoutCorrected,this.treeScale,this.path,m),p.layout&&!p.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(p.target=p.layout.layoutBox,p.targetWithTransforms=et());const{target:w}=p;if(!w){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(Zg(this.prevProjectionDelta.x,this.projectionDelta.x),Zg(this.prevProjectionDelta.y,this.projectionDelta.y)),Jr(this.projectionDelta,this.layoutCorrected,w,this.latestValues),(this.treeScale.x!==y||this.treeScale.y!==x||!sx(this.projectionDelta.x,this.prevProjectionDelta.x)||!sx(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",w))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(p=!0){var m;if((m=this.options.visualElement)==null||m.scheduleRender(),p){const h=this.getStack();h&&h.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=Bi(),this.projectionDelta=Bi(),this.projectionDeltaWithTransform=Bi()}setAnimationOrigin(p,m=!1,h){const g=this.snapshot,b=g?g.latestValues:{},y={...this.latestValues},x=Bi();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!m;const w=et(),S=g?g.source:void 0,N=this.layout?this.layout.source:void 0,C=S!==N,T=this.getStack(),z=!T||T.members.length<=1,E=!!(C&&!z&&this.options.crossfade===!0&&!this.path.some(x3));this.animationProgress=0;let A;const R=h==null?void 0:h.interpolateProjection(p);this.mixTargetDelta=B=>{const _=B/1e3,W=R==null?void 0:R(_);W?(x.x.translate=W.x,x.x.scale=Be(p.x.scale,1,_),x.x.origin=p.x.origin,x.x.originPoint=p.x.originPoint,x.y.translate=W.y,x.y.scale=Be(p.y.scale,1,_),x.y.origin=p.y.origin,x.y.originPoint=p.y.originPoint):(px(x.x,p.x,_),px(x.y,p.y,_)),this.setTargetDelta(x),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(ml(w,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),g3(this.relativeTarget,this.relativeTargetOrigin,w,_),A&&Iw(this.relativeTarget,A)&&(this.isProjectionDirty=!1),A||(A=et()),ia(A,this.relativeTarget)),C&&(this.animationValues=y,$w(y,b,this.latestValues,_,E,z)),W&&W.rotate!==void 0&&(this.animationValues||(this.animationValues=y),this.animationValues.pathRotation=W.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=_},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(p){var m,h,g;this.notifyListeners("animationStart"),(m=this.currentAnimation)==null||m.stop(),(g=(h=this.resumingFrom)==null?void 0:h.currentAnimation)==null||g.stop(),this.pendingAnimation&&(bn(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=Ue.update(()=>{al.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=Vi(0)),this.motionValue.jump(0,!1),this.currentAnimation=Kw(this.motionValue,[0,1e3],{...p,velocity:0,isSync:!0,onUpdate:b=>{this.mixTargetDelta(b),p.onUpdate&&p.onUpdate(b)},onComplete:()=>{p.onComplete&&p.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const p=this.getStack();p&&p.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(a3),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const p=this.getLead();let{targetWithTransforms:m,target:h,layout:g,latestValues:b}=p;if(!(!m||!h||!g)){if(this!==p&&this.layout&&g&&$b(this.options.animationType,this.layout.layoutBox,g.layoutBox)){h=this.target||et();const y=yt(this.layout.layoutBox.x);h.x.min=p.target.x.min,h.x.max=h.x.min+y;const x=yt(this.layout.layoutBox.y);h.y.min=p.target.y.min,h.y.max=h.y.min+x}ia(m,h),el(m,b),Jr(this.projectionDeltaWithTransform,this.layoutCorrected,m,b)}}registerSharedNode(p,m){this.sharedNodes.has(p)||this.sharedNodes.set(p,new t3),this.sharedNodes.get(p).add(m);const g=m.options.initialPromotionConfig;m.promote({transition:g?g.transition:void 0,preserveFollowOpacity:g&&g.shouldPreserveFollowOpacity?g.shouldPreserveFollowOpacity(m):void 0})}isLead(){const p=this.getStack();return p?p.lead===this:!0}getLead(){var m;const{layoutId:p}=this.options;return p?((m=this.getStack())==null?void 0:m.lead)||this:this}getPrevLead(){var m;const{layoutId:p}=this.options;return p?(m=this.getStack())==null?void 0:m.prevLead:void 0}getStack(){const{layoutId:p}=this.options;if(p)return this.root.sharedNodes.get(p)}promote({needsReset:p,transition:m,preserveFollowOpacity:h}={}){const g=this.getStack();g&&g.promote(this,h),p&&(this.projectionDelta=void 0,this.needsReset=!0),m&&this.setOptions({transition:m})}relegate(){const p=this.getStack();return p?p.relegate(this):!1}resetSkewAndRotation(){const{visualElement:p}=this.options;if(!p)return;let m=!1;const{latestValues:h}=p;if((h.z||h.rotate||h.rotateX||h.rotateY||h.rotateZ||h.skewX||h.skewY)&&(m=!0),!m)return;const g={};h.z&&fd("z",p,g,this.animationValues);for(let b=0;b<dd.length;b++)fd(`rotate${dd[b]}`,p,g,this.animationValues),fd(`skew${dd[b]}`,p,g,this.animationValues);p.render();for(const b in g)p.setStaticValue(b,g[b]),this.animationValues&&(this.animationValues[b]=g[b]);p.scheduleRender()}applyProjectionStyles(p,m){if(!this.instance||this.isSVG)return;if(!this.isVisible){p.visibility="hidden";return}const h=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,p.visibility="",p.opacity="",p.pointerEvents=tl(m==null?void 0:m.pointerEvents)||"",p.transform=h?h(this.latestValues,""):"none";return}const g=this.getLead();if(!this.projectionDelta||!this.layout||!g.target){this.options.layoutId&&(p.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,p.pointerEvents=tl(m==null?void 0:m.pointerEvents)||""),this.hasProjected&&!Gn(this.latestValues)&&(p.transform=h?h({},""):"none",this.hasProjected=!1);return}p.visibility="";const b=g.animationValues||g.latestValues;this.applyTransformsToTarget();let y=Xw(this.projectionDeltaWithTransform,this.treeScale,b);h&&(y=h(b,y)),p.transform=y;const{x,y:w}=this.projectionDelta;p.transformOrigin=`${x.origin*100}% ${w.origin*100}% 0`,g.animationValues?p.opacity=g===this?b.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:b.opacityExit:p.opacity=g===this?b.opacity!==void 0?b.opacity:"":b.opacityExit!==void 0?b.opacityExit:0;for(const S in sf){if(b[S]===void 0)continue;const{correct:N,applyTo:C,isCSSVariable:T}=sf[S],z=y==="none"?b[S]:N(b[S],g);if(C){const E=C.length;for(let A=0;A<E;A++)p[C[A]]=z}else T?this.options.visualElement.renderState.vars[S]=z:p[S]=z}this.options.layoutId&&(p.pointerEvents=g===this?tl(m==null?void 0:m.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(p=>{var m;return(m=p.currentAnimation)==null?void 0:m.stop()}),this.root.nodes.forEach(ux),this.root.sharedNodes.clear()}}}function i3(a){a.updateLayout()}function r3(a){var o;const i=((o=a.resumeFrom)==null?void 0:o.snapshot)||a.snapshot;if(a.isLead()&&a.layout&&i&&a.hasListeners("didUpdate")){const{layoutBox:l,measuredBox:c}=a.layout,{animationType:f}=a.options,p=i.source!==a.layout.source;if(f==="size")ma(y=>{const x=p?i.measuredBox[y]:i.layoutBox[y],w=yt(x);x.min=l[y].min,x.max=x.min+w});else if(f==="x"||f==="y"){const y=f==="x"?"y":"x";of(p?i.measuredBox[y]:i.layoutBox[y],l[y])}else $b(f,i.layoutBox,l)&&ma(y=>{const x=p?i.measuredBox[y]:i.layoutBox[y],w=yt(l[y]);x.max=x.min+w,a.relativeTarget&&!a.currentAnimation&&(a.isProjectionDirty=!0,a.relativeTarget[y].max=a.relativeTarget[y].min+w)});const m=Bi();Jr(m,l,i.layoutBox);const h=Bi();p?Jr(h,a.applyTransform(c,!0),i.measuredBox):Jr(h,l,i.layoutBox);const g=!Gb(m);let b=!1;if(!a.resumeFrom){const y=a.getClosestProjectingParent();if(y&&!y.resumeFrom){const{snapshot:x,layout:w}=y;if(x&&w){const S=a.options.layoutAnchor||void 0,N=et();ml(N,i.layoutBox,x.layoutBox,S);const C=et();ml(C,l,w.layoutBox,S),Yb(N,C)||(b=!0),y.options.layoutRoot&&(a.relativeTarget=C,a.relativeTargetOrigin=N,a.relativeParent=y)}}}a.notifyListeners("didUpdate",{layout:l,snapshot:i,delta:h,layoutDelta:m,hasLayoutChanged:g,hasRelativeLayoutChanged:b})}else if(a.isLead()){const{onExitComplete:l}=a.options;l&&l()}a.options.transition=void 0}function s3(a){a.parent&&(a.isProjecting()||(a.isProjectionDirty=a.parent.isProjectionDirty),a.isSharedProjectionDirty||(a.isSharedProjectionDirty=!!(a.isProjectionDirty||a.parent.isProjectionDirty||a.parent.isSharedProjectionDirty)),a.isTransformDirty||(a.isTransformDirty=a.parent.isTransformDirty))}function o3(a){a.isProjectionDirty=a.isSharedProjectionDirty=a.isTransformDirty=!1}function l3(a){a.clearSnapshot()}function ux(a){a.clearMeasurements()}function c3(a){a.isLayoutDirty=!0,a.updateLayout()}function dx(a){a.isLayoutDirty=!1}function u3(a){a.isAnimationBlocked&&a.layout&&!a.isLayoutDirty&&(a.snapshot=a.layout,a.isLayoutDirty=!0)}function d3(a){const{visualElement:i}=a.options;i&&i.getProps().onBeforeLayoutMeasure&&i.notify("BeforeLayoutMeasure"),a.resetTransform()}function fx(a){a.finishAnimation(),a.targetDelta=a.relativeTarget=a.target=void 0,a.isProjectionDirty=!0}function f3(a){a.resolveTargetDelta()}function p3(a){a.calcProjection()}function h3(a){a.resetSkewAndRotation()}function m3(a){a.removeLeadSnapshot()}function px(a,i,o){a.translate=Be(i.translate,0,o),a.scale=Be(i.scale,1,o),a.origin=i.origin,a.originPoint=i.originPoint}function hx(a,i,o,l){a.min=Be(i.min,o.min,l),a.max=Be(i.max,o.max,l)}function g3(a,i,o,l){hx(a.x,i.x,o.x,l),hx(a.y,i.y,o.y,l)}function x3(a){return a.animationValues&&a.animationValues.opacityExit!==void 0}const y3={duration:.45,ease:[.4,0,.1,1]},mx=a=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(a),gx=mx("applewebkit/")&&!mx("chrome/")?Math.round:Wt;function xx(a){a.min=gx(a.min),a.max=gx(a.max)}function b3(a){xx(a.x),xx(a.y)}function $b(a,i,o){return a==="position"||a==="preserve-aspect"&&!qw(rx(i),rx(o),.2)}function v3(a){var i;return a!==a.root&&((i=a.scroll)==null?void 0:i.wasRoot)}const j3=Pb({attachResizeListener:(a,i)=>rs(a,"resize",i),measureScroll:()=>{var a,i;return{x:document.documentElement.scrollLeft||((a=document.body)==null?void 0:a.scrollLeft)||0,y:document.documentElement.scrollTop||((i=document.body)==null?void 0:i.scrollTop)||0}},checkIsScrollRoot:()=>!0}),pd={current:void 0},Zb=Pb({measureScroll:a=>({x:a.scrollLeft,y:a.scrollTop}),defaultParent:()=>{if(!pd.current){const a=new j3({});a.mount(window),a.setOptions({layoutScroll:!0}),pd.current=a}return pd.current},resetTransform:(a,i)=>{a.style.transform=i!==void 0?i:"none"},checkIsScrollRoot:a=>window.getComputedStyle(a).position==="fixed"}),$f=j.createContext({transformPagePoint:a=>a,isStatic:!1,reducedMotion:"never"});function yx(a,i){if(typeof a=="function")return a(i);a!=null&&(a.current=i)}function S3(...a){return i=>{let o=!1;const l=a.map(c=>{const f=yx(c,i);return!o&&typeof f=="function"&&(o=!0),f});if(o)return()=>{for(let c=0;c<l.length;c++){const f=l[c];typeof f=="function"?f():yx(a[c],null)}}}}function w3(...a){return j.useCallback(S3(...a),a)}class k3 extends j.Component{getSnapshotBeforeUpdate(i){const o=this.props.childRef.current;if(Qo(o)&&i.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const l=o.offsetParent,c=Qo(l)&&l.offsetWidth||0,f=Qo(l)&&l.offsetHeight||0,p=getComputedStyle(o),m=this.props.sizeRef.current;m.height=parseFloat(p.height),m.width=parseFloat(p.width),m.top=o.offsetTop,m.left=o.offsetLeft,m.right=c-m.width-m.left,m.bottom=f-m.height-m.top,m.direction=p.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function N3({children:a,isPresent:i,anchorX:o,anchorY:l,root:c,pop:f}){var x;const p=j.useId(),m=j.useRef(null),h=j.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:g}=j.useContext($f),b=((x=a.props)==null?void 0:x.ref)??(a==null?void 0:a.ref),y=w3(m,b);return j.useInsertionEffect(()=>{const{width:w,height:S,top:N,left:C,right:T,bottom:z,direction:E}=h.current;if(i||f===!1||!m.current||!w||!S)return;const A=E==="rtl",R=o==="left"?A?`right: ${T}`:`left: ${C}`:A?`left: ${C}`:`right: ${T}`,B=l==="bottom"?`bottom: ${z}`:`top: ${N}`;m.current.dataset.motionPopId=p;const _=document.createElement("style");g&&(_.nonce=g);const W=c??document.head;return W.appendChild(_),_.sheet&&_.sheet.insertRule(`
          [data-motion-pop-id="${p}"] {
            position: absolute !important;
            width: ${w}px !important;
            height: ${S}px !important;
            ${R}px !important;
            ${B}px !important;
          }
        `),()=>{var ne;(ne=m.current)==null||ne.removeAttribute("data-motion-pop-id"),W.contains(_)&&W.removeChild(_)}},[i]),s.jsx(k3,{isPresent:i,childRef:m,sizeRef:h,pop:f,children:f===!1?a:j.cloneElement(a,{ref:y})})}const C3=({children:a,initial:i,isPresent:o,onExitComplete:l,custom:c,presenceAffectsLayout:f,mode:p,anchorX:m,anchorY:h,root:g})=>{const b=wf(T3),y=j.useId(),x=j.useRef(o),w=j.useRef(l);kf(()=>{x.current=o,w.current=l});let S=!0,N=j.useMemo(()=>(S=!1,{id:y,initial:i,isPresent:o,custom:c,onExitComplete:C=>{b.set(C,!0);for(const T of b.values())if(!T)return;l&&l()},register:C=>(b.set(C,!1),()=>{var T;b.delete(C),!x.current&&!b.size&&((T=w.current)==null||T.call(w))})}),[o,b,l]);return f&&S&&(N={...N}),j.useMemo(()=>{b.forEach((C,T)=>b.set(T,!1))},[o]),j.useEffect(()=>{!o&&!b.size&&l&&l()},[o]),a=s.jsx(N3,{pop:p==="popLayout",isPresent:o,anchorX:m,anchorY:h,root:g,children:a}),s.jsx(kl.Provider,{value:N,children:a})};function T3(){return new Map}function Qb(a=!0){const i=j.useContext(kl);if(i===null)return[!0,null];const{isPresent:o,onExitComplete:l,register:c}=i,f=j.useId();j.useEffect(()=>{if(a)return c(f)},[a]);const p=j.useCallback(()=>a&&l&&l(f),[f,l,a]);return!o&&l?[!1,p]:[!0]}const Uo=a=>a.key||"";function bx(a){const i=[];return j.Children.forEach(a,o=>{j.isValidElement(o)&&i.push(o)}),i}const Ne=({children:a,custom:i,initial:o=!0,onExitComplete:l,presenceAffectsLayout:c=!0,mode:f="sync",propagate:p=!1,anchorX:m="left",anchorY:h="top",root:g})=>{const[b,y]=Qb(p),x=j.useMemo(()=>bx(a),[a]),w=p&&!b?[]:x.map(Uo),S=j.useRef(!0),N=j.useRef(x),C=wf(()=>new Map),T=j.useRef(new Set),[z,E]=j.useState(x),[A,R]=j.useState(x);kf(()=>{S.current=!1,N.current=x;for(let W=0;W<A.length;W++){const ne=Uo(A[W]);w.includes(ne)?(C.delete(ne),T.current.delete(ne)):C.get(ne)!==!0&&C.set(ne,!1)}},[A,w.length,w.join("-")]);const B=[];if(x!==z){let W=[...x];for(let ne=0;ne<A.length;ne++){const H=A[ne],F=Uo(H);w.includes(F)||(W.splice(ne,0,H),B.push(H))}return f==="wait"&&B.length&&(W=B),R(bx(W)),E(x),null}const{forceRender:_}=j.useContext(Sf);return s.jsx(s.Fragment,{children:A.map(W=>{const ne=Uo(W),H=p&&!b?!1:x===A||w.includes(ne),F=()=>{if(T.current.has(ne))return;if(C.has(ne))T.current.add(ne),C.set(ne,!0);else return;let Q=!0;C.forEach(K=>{K||(Q=!1)}),Q&&(_==null||_(),R(N.current),p&&(y==null||y()),l&&l())};return s.jsx(C3,{isPresent:H,initial:!S.current||o?void 0:!1,custom:i,presenceAffectsLayout:c,mode:f,root:g,onExitComplete:H?void 0:F,anchorX:m,anchorY:h,children:W},ne)})})},Kb=j.createContext({strict:!1}),vx={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let jx=!1;function E3(){if(jx)return;const a={};for(const i in vx)a[i]={isEnabled:o=>vx[i].some(l=>!!o[l])};Cb(a),jx=!0}function Wb(){return E3(),fw()}function z3(a){const i=Wb();for(const o in a)i[o]={...i[o],...a[o]};Cb(i)}const M3=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function gl(a){return a.startsWith("while")||a.startsWith("drag")&&a!=="draggable"||a.startsWith("layout")||a.startsWith("onTap")||a.startsWith("onPan")||a.startsWith("onLayout")||M3.has(a)}let Jb=a=>!gl(a);function A3(a){typeof a=="function"&&(Jb=i=>i.startsWith("on")?!gl(i):a(i))}try{A3(require("@emotion/is-prop-valid").default)}catch{}function R3(a,i,o){const l={};for(const c in a)c==="values"&&typeof a.values=="object"||ft(a[c])||(Jb(c)||o===!0&&gl(c)||!i&&!gl(c)||a.draggable&&c.startsWith("onDrag"))&&(l[c]=a[c]);return l}const El=j.createContext({});function D3(a,i){if(Tl(a)){const{initial:o,animate:l}=a;return{initial:o===!1||is(o)?o:void 0,animate:is(l)?l:void 0}}return a.inherit!==!1?i:{}}function O3(a){const{initial:i,animate:o}=D3(a,j.useContext(El));return j.useMemo(()=>({initial:i,animate:o}),[Sx(i),Sx(o)])}function Sx(a){return Array.isArray(a)?a.join(" "):a}const Zf=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function e1(a,i,o){for(const l in i)!ft(i[l])&&!Db(l,o)&&(a[l]=i[l])}function L3({transformTemplate:a},i){return j.useMemo(()=>{const o=Zf();return Xf(o,i,a),Object.assign({},o.vars,o.style)},[i])}function B3(a,i){const o=a.style||{},l={};return e1(l,o,a),Object.assign(l,L3(a,i)),l}function U3(a,i){const o={},l=B3(a,i);return a.drag&&a.dragListener!==!1&&(o.draggable=!1,l.userSelect=l.WebkitUserSelect=l.WebkitTouchCallout="none",l.touchAction=a.drag===!0?"none":`pan-${a.drag==="x"?"y":"x"}`),a.tabIndex===void 0&&(a.onTap||a.onTapStart||a.whileTap)&&(o.tabIndex=0),o.style=l,o}const t1=()=>({...Zf(),attrs:{}});function V3(a,i,o,l){const c=j.useMemo(()=>{const f=t1();return Ob(f,i,Bb(l),a.transformTemplate,a.style),{...f.attrs,style:{...f.style}}},[i]);if(a.style){const f={};e1(f,a.style,a),c.style={...f,...c.style}}return c}const _3=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function Qf(a){return typeof a!="string"||a.includes("-")?!1:!!(_3.indexOf(a)>-1||/[A-Z]/u.test(a))}function q3(a,i,o,{latestValues:l},c,f=!1,p){const h=(p??Qf(a)?V3:U3)(i,l,c,a),g=R3(i,typeof a=="string",f),b=a!==j.Fragment?{...g,...h,ref:o}:{},{children:y}=i,x=j.useMemo(()=>ft(y)?y.get():y,[y]);return j.createElement(a,{...b,children:x})}function H3({scrapeMotionValuesFromProps:a,createRenderState:i},o,l,c){return{latestValues:G3(o,l,c,a),renderState:i()}}function G3(a,i,o,l){const c={},f=l(a,{});for(const x in f)c[x]=tl(f[x]);let{initial:p,animate:m}=a;const h=Tl(a),g=kb(a);i&&g&&!h&&a.inherit!==!1&&(p===void 0&&(p=i.initial),m===void 0&&(m=i.animate));let b=o?o.initial===!1:!1;b=b||p===!1;const y=b?m:p;if(y&&typeof y!="boolean"&&!Cl(y)){const x=Array.isArray(y)?y:[y];for(let w=0;w<x.length;w++){const S=_f(a,x[w]);if(S){const{transitionEnd:N,transition:C,...T}=S;for(const z in T){let E=T[z];if(Array.isArray(E)){const A=b?E.length-1:0;E=E[A]}E!==null&&(c[z]=E)}for(const z in N)c[z]=N[z]}}}return c}const a1=a=>(i,o)=>{const l=j.useContext(El),c=j.useContext(kl),f=()=>H3(a,i,l,c);return o?f():wf(f)},Y3=a1({scrapeMotionValuesFromProps:Pf,createRenderState:Zf}),F3=a1({scrapeMotionValuesFromProps:Ub,createRenderState:t1}),I3=Symbol.for("motionComponentSymbol");function X3(a,i,o){const l=j.useRef(o);j.useInsertionEffect(()=>{l.current=o});const c=j.useRef(null);return j.useCallback(f=>{var m;f&&((m=a.onMount)==null||m.call(a,f)),i&&(f?i.mount(f):i.unmount());const p=l.current;if(typeof p=="function")if(f){const h=p(f);typeof h=="function"&&(c.current=h)}else c.current?(c.current(),c.current=null):p(f);else p&&(p.current=f)},[i])}const n1=j.createContext({});function Di(a){return a&&typeof a=="object"&&Object.prototype.hasOwnProperty.call(a,"current")}function P3(a,i,o,l,c,f){var E,A;const{visualElement:p}=j.useContext(El),m=j.useContext(Kb),h=j.useContext(kl),g=j.useContext($f),b=g.reducedMotion,y=g.skipAnimations,x=j.useRef(null),w=j.useRef(!1);l=l||m.renderer,!x.current&&l&&(x.current=l(a,{visualState:i,parent:p,props:o,presenceContext:h,blockInitialAnimation:h?h.initial===!1:!1,reducedMotionConfig:b,skipAnimations:y,isSVG:f}),w.current&&x.current&&(x.current.manuallyAnimateOnMount=!0));const S=x.current,N=j.useContext(n1);S&&!S.projection&&c&&(S.type==="html"||S.type==="svg")&&$3(x.current,o,c,N);const C=j.useRef(!1);j.useInsertionEffect(()=>{S&&C.current&&S.update(o,h)});const T=o[fb],z=j.useRef(!!T&&typeof window<"u"&&!((E=window.MotionHandoffIsComplete)!=null&&E.call(window,T))&&((A=window.MotionHasOptimisedAnimation)==null?void 0:A.call(window,T)));return kf(()=>{w.current=!0,S&&(C.current=!0,window.MotionIsMounted=!0,S.updateFeatures(),S.scheduleRenderMicrotask(),z.current&&S.animationState&&S.animationState.animateChanges())}),j.useEffect(()=>{S&&(!z.current&&S.animationState&&S.animationState.animateChanges(),z.current&&(queueMicrotask(()=>{var R;(R=window.MotionHandoffMarkAsComplete)==null||R.call(window,T)}),z.current=!1),S.enteringChildren=void 0)}),S}function $3(a,i,o,l){const{layoutId:c,layout:f,drag:p,dragConstraints:m,layoutScroll:h,layoutRoot:g,layoutAnchor:b,layoutCrossfade:y}=i;a.projection=new o(a.latestValues,i["data-framer-portal-id"]?void 0:i1(a.parent)),a.projection.setOptions({layoutId:c,layout:f,alwaysMeasureLayout:!!p||m&&Di(m),visualElement:a,animationType:typeof f=="string"?f:"both",initialPromotionConfig:l,crossfade:y,layoutScroll:h,layoutRoot:g,layoutAnchor:b})}function i1(a){if(a)return a.options.allowProjection!==!1?a.projection:i1(a.parent)}function hd(a,{forwardMotionProps:i=!1,type:o}={},l,c){l&&z3(l);const f=o?o==="svg":Qf(a),p=f?F3:Y3;function m(g,b){let y;const x={...j.useContext($f),...g,layoutId:Z3(g)},{isStatic:w}=x,S=O3(g),N=p(g,w);if(!w&&typeof window<"u"){Q3();const C=K3(x);y=C.MeasureLayout,S.visualElement=P3(a,N,x,c,C.ProjectionNode,f)}return s.jsxs(El.Provider,{value:S,children:[y&&S.visualElement?s.jsx(y,{visualElement:S.visualElement,...x}):null,q3(a,g,X3(N,S.visualElement,b),N,w,i,f)]})}m.displayName=`motion.${typeof a=="string"?a:`create(${a.displayName??a.name??""})`}`;const h=j.forwardRef(m);return h[I3]=a,h}function Z3({layoutId:a}){const i=j.useContext(Sf).id;return i&&a!==void 0?i+"-"+a:a}function Q3(a,i){j.useContext(Kb).strict}function K3(a){const i=Wb(),{drag:o,layout:l}=i;if(!o&&!l)return{};const c={...o,...l};return{MeasureLayout:o!=null&&o.isEnabled(a)||l!=null&&l.isEnabled(a)?c.MeasureLayout:void 0,ProjectionNode:c.ProjectionNode}}function W3(a,i){if(typeof Proxy>"u")return hd;const o=new Map,l=(f,p)=>hd(f,p,a,i),c=(f,p)=>l(f,p);return new Proxy(c,{get:(f,p)=>p==="create"?l:(o.has(p)||o.set(p,hd(p,void 0,a,i)),o.get(p))})}const J3=(a,i)=>i.isSVG??Qf(a)?new zw(i):new ww(i,{allowProjection:a!==j.Fragment});class e6 extends vn{constructor(i){super(i),i.animationState||(i.animationState=Ow(i))}updateAnimationControlsSubscription(){const{animate:i}=this.node.getProps();Cl(i)&&(this.unmountControls=i.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:i}=this.node.getProps(),{animate:o}=this.node.prevProps||{};i!==o&&this.updateAnimationControlsSubscription()}unmount(){var i;this.node.animationState.reset(),(i=this.unmountControls)==null||i.call(this)}}let t6=0;class a6 extends vn{constructor(){super(...arguments),this.id=t6++,this.isExitComplete=!1}update(){var f;if(!this.node.presenceContext)return;const{isPresent:i,onExitComplete:o}=this.node.presenceContext,{isPresent:l}=this.node.prevPresenceContext||{};if(!this.node.animationState||i===l)return;if(i&&l===!1){if(this.isExitComplete){const{initial:p,custom:m}=this.node.getProps();if(typeof p=="string"||typeof p=="object"&&p!==null&&!Array.isArray(p)){const h=$n(this.node,p,m);if(h){const{transition:g,transitionEnd:b,...y}=h;for(const x in y)(f=this.node.getValue(x))==null||f.jump(y[x])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const c=this.node.animationState.setActive("exit",!i);o&&!i&&c.then(()=>{this.isExitComplete=!0,o(this.id)})}mount(){const{register:i,onExitComplete:o}=this.node.presenceContext||{};o&&o(this.id),i&&(this.unmount=i(this.id))}unmount(){}}const n6={animation:{Feature:e6},exit:{Feature:a6}};function hs(a){return{point:{x:a.pageX,y:a.pageY}}}const i6=a=>i=>Gf(i)&&a(i,hs(i));function es(a,i,o,l){return rs(a,i,i6(o),l)}const r1=({current:a})=>a?a.ownerDocument.defaultView:null,wx=(a,i)=>Math.abs(a-i);function r6(a,i){const o=wx(a.x,i.x),l=wx(a.y,i.y);return Math.sqrt(o**2+l**2)}const kx=new Set(["auto","scroll"]);class s1{constructor(i,o,{transformPagePoint:l,contextWindow:c=window,dragSnapToOrigin:f=!1,distanceThreshold:p=3,element:m}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=S=>{this.handleScroll(S.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=Vo(this.lastRawMoveEventInfo,this.transformPagePoint));const S=md(this.lastMoveEventInfo,this.history),N=this.startEvent!==null,C=r6(S.offset,{x:0,y:0})>=this.distanceThreshold;if(!N&&!C)return;const{point:T}=S,{timestamp:z}=dt;this.history.push({...T,timestamp:z});const{onStart:E,onMove:A}=this.handlers;N||(E&&E(this.lastMoveEvent,S),this.startEvent=this.lastMoveEvent),A&&A(this.lastMoveEvent,S)},this.handlePointerMove=(S,N)=>{this.lastMoveEvent=S,this.lastRawMoveEventInfo=N,this.lastMoveEventInfo=Vo(N,this.transformPagePoint),Ue.update(this.updatePoint,!0)},this.handlePointerUp=(S,N)=>{this.end();const{onEnd:C,onSessionEnd:T,resumeAnimation:z}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&z&&z(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const E=md(S.type==="pointercancel"?this.lastMoveEventInfo:Vo(N,this.transformPagePoint),this.history);this.startEvent&&C&&C(S,E),T&&T(S,E)},!Gf(i))return;this.dragSnapToOrigin=f,this.handlers=o,this.transformPagePoint=l,this.distanceThreshold=p,this.contextWindow=c||window;const h=hs(i),g=Vo(h,this.transformPagePoint),{point:b}=g,{timestamp:y}=dt;this.history=[{...b,timestamp:y}];const{onSessionStart:x}=o;x&&x(i,md(g,this.history));const w={passive:!0,capture:!0};this.removeListeners=ds(es(this.contextWindow,"pointermove",this.handlePointerMove,w),es(this.contextWindow,"pointerup",this.handlePointerUp,w),es(this.contextWindow,"pointercancel",this.handlePointerUp,w)),m&&this.startScrollTracking(m)}startScrollTracking(i){let o=i.parentElement;for(;o;){const l=getComputedStyle(o);(kx.has(l.overflowX)||kx.has(l.overflowY))&&this.scrollPositions.set(o,{x:o.scrollLeft,y:o.scrollTop}),o=o.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(i){const o=this.scrollPositions.get(i);if(!o)return;const l=i===window,c=l?{x:window.scrollX,y:window.scrollY}:{x:i.scrollLeft,y:i.scrollTop},f={x:c.x-o.x,y:c.y-o.y};f.x===0&&f.y===0||(l?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=f.x,this.lastMoveEventInfo.point.y+=f.y):this.history.length>0&&(this.history[0].x-=f.x,this.history[0].y-=f.y),this.scrollPositions.set(i,c),Ue.update(this.updatePoint,!0))}updateHandlers(i){this.handlers=i}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),bn(this.updatePoint)}}function Vo(a,i){return i?{point:i(a.point)}:a}function Nx(a,i){return{x:a.x-i.x,y:a.y-i.y}}function md({point:a},i){return{point:a,delta:Nx(a,o1(i)),offset:Nx(a,s6(i)),velocity:o6(i,.1)}}function s6(a){return a[0]}function o1(a){return a[a.length-1]}function o6(a,i){if(a.length<2)return{x:0,y:0};let o=a.length-1,l=null;const c=o1(a);for(;o>=0&&(l=a[o],!(c.timestamp-l.timestamp>Ut(i)));)o--;if(!l)return{x:0,y:0};l===a[0]&&a.length>2&&c.timestamp-l.timestamp>Ut(i)*2&&(l=a[1]);const f=Qt(c.timestamp-l.timestamp);if(f===0)return{x:0,y:0};const p={x:(c.x-l.x)/f,y:(c.y-l.y)/f};return p.x===1/0&&(p.x=0),p.y===1/0&&(p.y=0),p}function l6(a,{min:i,max:o},l){return i!==void 0&&a<i?a=l?Be(i,a,l.min):Math.max(a,i):o!==void 0&&a>o&&(a=l?Be(o,a,l.max):Math.min(a,o)),a}function Cx(a,i,o){return{min:i!==void 0?a.min+i:void 0,max:o!==void 0?a.max+o-(a.max-a.min):void 0}}function c6(a,{top:i,left:o,bottom:l,right:c}){return{x:Cx(a.x,o,c),y:Cx(a.y,i,l)}}function Tx(a,i){let o=i.min-a.min,l=i.max-a.max;return i.max-i.min<a.max-a.min&&([o,l]=[l,o]),{min:o,max:l}}function u6(a,i){return{x:Tx(a.x,i.x),y:Tx(a.y,i.y)}}function d6(a,i){let o=.5;const l=yt(a),c=yt(i);return c>l?o=as(i.min,i.max-l,a.min):l>c&&(o=as(a.min,a.max-c,i.min)),ya(0,1,o)}function f6(a,i){const o={};return i.min!==void 0&&(o.min=i.min-a.min),i.max!==void 0&&(o.max=i.max-a.min),o}const lf=.35;function p6(a=lf){return a===!1?a=0:a===!0&&(a=lf),{x:Ex(a,"left","right"),y:Ex(a,"top","bottom")}}function Ex(a,i,o){return{min:zx(a,i),max:zx(a,o)}}function zx(a,i){return typeof a=="number"?a:a[i]||0}const h6=new WeakMap;class m6{constructor(i){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=et(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=i}start(i,{snapToCursor:o=!1,distanceThreshold:l}={}){const{presenceContext:c}=this.visualElement;if(c&&c.isPresent===!1)return;const f=y=>{o&&this.snapToCursor(hs(y).point),this.stopAnimation()},p=(y,x)=>{const{drag:w,dragPropagation:S,onDragStart:N}=this.getProps();if(w&&!S&&(this.openDragLock&&this.openDragLock(),this.openDragLock=GS(w),!this.openDragLock))return;this.latestPointerEvent=y,this.latestPanInfo=x,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),ma(T=>{let z=this.getAxisMotionValue(T).get()||0;if(xa.test(z)){const{projection:E}=this.visualElement;if(E&&E.layout){const A=E.layout.layoutBox[T];A&&(z=yt(A)*(parseFloat(z)/100))}}this.originPoint[T]=z}),N&&Ue.update(()=>N(y,x),!1,!0),Kd(this.visualElement,"transform");const{animationState:C}=this.visualElement;C&&C.setActive("whileDrag",!0)},m=(y,x)=>{this.latestPointerEvent=y,this.latestPanInfo=x;const{dragPropagation:w,dragDirectionLock:S,onDirectionLock:N,onDrag:C}=this.getProps();if(!w&&!this.openDragLock)return;const{offset:T}=x;if(S&&this.currentDirection===null){this.currentDirection=x6(T),this.currentDirection!==null&&N&&N(this.currentDirection);return}this.updateAxis("x",x.point,T),this.updateAxis("y",x.point,T),this.visualElement.render(),C&&Ue.update(()=>C(y,x),!1,!0)},h=(y,x)=>{this.latestPointerEvent=y,this.latestPanInfo=x,this.stop(y,x),this.latestPointerEvent=null,this.latestPanInfo=null},g=()=>{const{dragSnapToOrigin:y}=this.getProps();(y||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:b}=this.getProps();this.panSession=new s1(i,{onSessionStart:f,onStart:p,onMove:m,onSessionEnd:h,resumeAnimation:g},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:b,distanceThreshold:l,contextWindow:r1(this.visualElement),element:this.visualElement.current})}stop(i,o){const l=i||this.latestPointerEvent,c=o||this.latestPanInfo,f=this.isDragging;if(this.cancel(),!f||!c||!l)return;const{velocity:p}=c;this.startAnimation(p);const{onDragEnd:m}=this.getProps();m&&Ue.postRender(()=>m(l,c))}cancel(){this.isDragging=!1;const{projection:i,animationState:o}=this.visualElement;i&&(i.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:l}=this.getProps();!l&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),o&&o.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(i,o,l){const{drag:c}=this.getProps();if(!l||!_o(i,c,this.currentDirection))return;const f=this.getAxisMotionValue(i);let p=this.originPoint[i]+l[i];this.constraints&&this.constraints[i]&&(p=l6(p,this.constraints[i],this.elastic[i])),f.set(p)}resolveConstraints(){var f;const{dragConstraints:i,dragElastic:o}=this.getProps(),l=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(f=this.visualElement.projection)==null?void 0:f.layout,c=this.constraints;i&&Di(i)?this.constraints||(this.constraints=this.resolveRefConstraints()):i&&l?this.constraints=c6(l.layoutBox,i):this.constraints=!1,this.elastic=p6(o),c!==this.constraints&&!Di(i)&&l&&this.constraints&&!this.hasMutatedConstraints&&ma(p=>{this.constraints!==!1&&this.getAxisMotionValue(p)&&(this.constraints[p]=f6(l.layoutBox[p],this.constraints[p]))})}resolveRefConstraints(){const{dragConstraints:i,onMeasureDragConstraints:o}=this.getProps();if(!i||!Di(i))return!1;const l=i.current,{projection:c}=this.visualElement;if(!c||!c.layout)return!1;c.root&&(c.root.scroll=void 0,c.root.updateScroll());const f=xw(l,c.root,this.visualElement.getTransformPagePoint());let p=u6(c.layout.layoutBox,f);if(o){const m=o(hw(p));this.hasMutatedConstraints=!!m,m&&(p=Eb(m))}return p}startAnimation(i){const{drag:o,dragMomentum:l,dragElastic:c,dragTransition:f,dragSnapToOrigin:p,onDragTransitionEnd:m}=this.getProps(),h=this.constraints||{},g=ma(b=>{if(!_o(b,o,this.currentDirection))return;let y=h&&h[b]||{};(p===!0||p===b)&&(y={min:0,max:0});const x=c?200:1e6,w=c?40:1e7,S={type:"inertia",velocity:l?i[b]:0,bounceStiffness:x,bounceDamping:w,timeConstant:750,restDelta:1,restSpeed:10,...f,...y};return this.startAxisValueAnimation(b,S)});return Promise.all(g).then(m)}startAxisValueAnimation(i,o){const l=this.getAxisMotionValue(i);return Kd(this.visualElement,i),l.start(Vf(i,l,0,o,this.visualElement,!1))}stopAnimation(){ma(i=>this.getAxisMotionValue(i).stop())}getAxisMotionValue(i){const o=`_drag${i.toUpperCase()}`,c=this.visualElement.getProps()[o];return c||this.visualElement.getValue(i,this.visualElement.latestValues[i]??0)}snapToCursor(i){ma(o=>{const{drag:l}=this.getProps();if(!_o(o,l,this.currentDirection))return;const{projection:c}=this.visualElement,f=this.getAxisMotionValue(o);if(c&&c.layout){const{min:p,max:m}=c.layout.layoutBox[o],h=f.get()||0;f.set(i[o]-Be(p,m,.5)+h)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:i,dragConstraints:o}=this.getProps(),{projection:l}=this.visualElement;if(!Di(o)||!l||!this.constraints)return;this.stopAnimation();const c={x:0,y:0};ma(p=>{const m=this.getAxisMotionValue(p);if(m&&this.constraints!==!1){const h=m.get();c[p]=d6({min:h,max:h},this.constraints[p])}});const{transformTemplate:f}=this.visualElement.getProps();this.visualElement.current.style.transform=f?f({},""):"none",l.root&&l.root.updateScroll(),l.updateLayout(),this.constraints=!1,this.resolveConstraints(),ma(p=>{if(!_o(p,i,null))return;const m=this.getAxisMotionValue(p),{min:h,max:g}=this.constraints[p];m.set(Be(h,g,c[p]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;h6.set(this.visualElement,this);const i=this.visualElement.current,o=es(i,"pointerdown",g=>{const{drag:b,dragListener:y=!0}=this.getProps(),x=g.target,w=x!==i&&$S(x);b&&y&&!w&&this.start(g)});let l;const c=()=>{const{dragConstraints:g}=this.getProps();Di(g)&&g.current&&(this.constraints=this.resolveRefConstraints(),l||(l=g6(i,g.current,()=>this.scalePositionWithinConstraints())))},{projection:f}=this.visualElement,p=f.addEventListener("measure",c);f&&!f.layout&&(f.root&&f.root.updateScroll(),f.updateLayout()),Ue.read(c);const m=rs(window,"resize",()=>this.scalePositionWithinConstraints()),h=f.addEventListener("didUpdate",(({delta:g,hasLayoutChanged:b})=>{this.isDragging&&b&&(ma(y=>{const x=this.getAxisMotionValue(y);x&&(this.originPoint[y]+=g[y].translate,x.set(x.get()+g[y].translate))}),this.visualElement.render())}));return()=>{m(),o(),p(),h&&h(),l&&l()}}getProps(){const i=this.visualElement.getProps(),{drag:o=!1,dragDirectionLock:l=!1,dragPropagation:c=!1,dragConstraints:f=!1,dragElastic:p=lf,dragMomentum:m=!0}=i;return{...i,drag:o,dragDirectionLock:l,dragPropagation:c,dragConstraints:f,dragElastic:p,dragMomentum:m}}}function Mx(a){let i=!0;return()=>{if(i){i=!1;return}a()}}function g6(a,i,o){const l=Ug(a,Mx(o)),c=Ug(i,Mx(o));return()=>{l(),c()}}function _o(a,i,o){return(i===!0||i===a)&&(o===null||o===a)}function x6(a,i=10){let o=null;return Math.abs(a.y)>i?o="y":Math.abs(a.x)>i&&(o="x"),o}class y6 extends vn{constructor(i){super(i),this.removeGroupControls=Wt,this.removeListeners=Wt,this.controls=new m6(i)}mount(){const{dragControls:i}=this.node.getProps();i&&(this.removeGroupControls=i.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Wt}update(){const{dragControls:i}=this.node.getProps(),{dragControls:o}=this.node.prevProps||{};i!==o&&(this.removeGroupControls(),i&&(this.removeGroupControls=i.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const gd=a=>(i,o)=>{a&&Ue.update(()=>a(i,o),!1,!0)};class b6 extends vn{constructor(){super(...arguments),this.removePointerDownListener=Wt}onPointerDown(i){this.session=new s1(i,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:r1(this.node)})}createPanHandlers(){const{onPanSessionStart:i,onPanStart:o,onPan:l,onPanEnd:c}=this.node.getProps();return{onSessionStart:gd(i),onStart:gd(o),onMove:gd(l),onEnd:(f,p)=>{delete this.session,c&&Ue.postRender(()=>c(f,p))}}}mount(){this.removePointerDownListener=es(this.node.current,"pointerdown",i=>this.onPointerDown(i))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let xd=!1;class v6 extends j.Component{componentDidMount(){const{visualElement:i,layoutGroup:o,switchLayoutGroup:l,layoutId:c}=this.props,{projection:f}=i;f&&(o.group&&o.group.add(f),l&&l.register&&c&&l.register(f),xd&&f.root.didUpdate(),f.addEventListener("animationComplete",()=>{this.safeToRemove()}),f.setOptions({...f.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),al.hasEverUpdated=!0}getSnapshotBeforeUpdate(i){const{layoutDependency:o,visualElement:l,drag:c,isPresent:f}=this.props,{projection:p}=l;return p&&(p.isPresent=f,i.layoutDependency!==o&&p.setOptions({...p.options,layoutDependency:o}),xd=!0,c||i.layoutDependency!==o||o===void 0||i.isPresent!==f?p.willUpdate():this.safeToRemove(),i.isPresent!==f&&(f?p.promote():p.relegate()||Ue.postRender(()=>{const m=p.getStack();(!m||!m.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:i,layoutAnchor:o}=this.props,{projection:l}=i;l&&(l.options.layoutAnchor=o,l.root.didUpdate(),Hf.postRender(()=>{!l.currentAnimation&&l.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:i,layoutGroup:o,switchLayoutGroup:l}=this.props,{projection:c}=i;xd=!0,c&&(c.scheduleCheckAfterUnmount(),o&&o.group&&o.group.remove(c),l&&l.deregister&&l.deregister(c))}safeToRemove(){const{safeToRemove:i}=this.props;i&&i()}render(){return null}}function l1(a){const[i,o]=Qb(),l=j.useContext(Sf);return s.jsx(v6,{...a,layoutGroup:l,switchLayoutGroup:j.useContext(n1),isPresent:i,safeToRemove:o})}const j6={pan:{Feature:b6},drag:{Feature:y6,ProjectionNode:Zb,MeasureLayout:l1}};function Ax(a,i,o){const{props:l}=a;a.animationState&&l.whileHover&&a.animationState.setActive("whileHover",o==="Start");const c="onHover"+o,f=l[c];f&&Ue.postRender(()=>f(i,hs(i)))}class S6 extends vn{mount(){const{current:i}=this.node;i&&(this.unmount=FS(i,(o,l)=>(Ax(this.node,l,"Start"),c=>Ax(this.node,c,"End"))))}unmount(){}}class w6 extends vn{constructor(){super(...arguments),this.isActive=!1}onFocus(){let i=!1;try{i=this.node.current.matches(":focus-visible")}catch{i=!0}!i||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=ds(rs(this.node.current,"focus",()=>this.onFocus()),rs(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function Rx(a,i,o){const{props:l}=a;if(a.current instanceof HTMLButtonElement&&a.current.disabled)return;a.animationState&&l.whileTap&&a.animationState.setActive("whileTap",o==="Start");const c="onTap"+(o==="End"?"":o),f=l[c];f&&Ue.postRender(()=>f(i,hs(i)))}class k6 extends vn{mount(){const{current:i}=this.node;if(!i)return;const{globalTapTarget:o,propagate:l}=this.node.props;this.unmount=QS(i,(c,f)=>(Rx(this.node,f,"Start"),(p,{success:m})=>Rx(this.node,p,m?"End":"Cancel")),{useGlobalTarget:o,stopPropagation:(l==null?void 0:l.tap)===!1})}unmount(){}}const cf=new WeakMap,yd=new WeakMap,N6=a=>{const i=cf.get(a.target);i&&i(a)},C6=a=>{a.forEach(N6)};function T6({root:a,...i}){const o=a||document;yd.has(o)||yd.set(o,{});const l=yd.get(o),c=JSON.stringify(i);return l[c]||(l[c]=new IntersectionObserver(C6,{root:a,...i})),l[c]}function E6(a,i,o){const l=T6(i);return cf.set(a,o),l.observe(a),()=>{cf.delete(a),l.unobserve(a)}}const z6={some:0,all:1};class M6 extends vn{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){var h;(h=this.stopObserver)==null||h.call(this);const{viewport:i={}}=this.node.getProps(),{root:o,margin:l,amount:c="some",once:f}=i,p={root:o?o.current:void 0,rootMargin:l,threshold:typeof c=="number"?c:z6[c]},m=g=>{const{isIntersecting:b}=g;if(this.isInView===b||(this.isInView=b,f&&!b&&this.hasEnteredView))return;b&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",b);const{onViewportEnter:y,onViewportLeave:x}=this.node.getProps(),w=b?y:x;w&&w(g)};this.stopObserver=E6(this.node.current,p,m)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:i,prevProps:o}=this.node;["amount","margin","root"].some(A6(i,o))&&this.startObserver()}unmount(){var i;(i=this.stopObserver)==null||i.call(this),this.hasEnteredView=!1,this.isInView=!1}}function A6({viewport:a={}},{viewport:i={}}={}){return o=>a[o]!==i[o]}const R6={inView:{Feature:M6},tap:{Feature:k6},focus:{Feature:w6},hover:{Feature:S6}},D6={layout:{ProjectionNode:Zb,MeasureLayout:l1}},O6={...n6,...R6,...j6,...D6},X=W3(O6,J3),c1=j.createContext(null),Kf=()=>{const a=j.useContext(c1);if(!a)throw new Error("useTheme must be used within ThemeProvider");return a},L6=()=>{const a=new Date().getHours();return a>=6&&a<18?"day":"night"},B6=({children:a})=>{const[i,o]=j.useState("day");j.useEffect(()=>{const f=localStorage.getItem("theme-mode");o(f==="day"||f==="night"?f:L6())},[]),j.useEffect(()=>{const f=document.documentElement;i==="night"?f.setAttribute("data-theme","night"):f.setAttribute("data-theme","day")},[i]);const l=j.useCallback(()=>{o(f=>{const p=f==="day"?"night":"day";return localStorage.setItem("theme-mode",p),p})},[]),c={mode:i,toggleTheme:l,isDay:i==="day",isNight:i==="night"};return s.jsx(c1.Provider,{value:c,children:a})},ha=.3,Dx=800,U6=({variant:a="floating"})=>{const{isNight:i}=Kf(),[o,l]=j.useState(!1),c=j.useRef(null),f=j.useRef(null);j.useEffect(()=>{const h=i?"/night-rain.mp3":"/day-forest.mp3";if(c.current&&o){const g=c.current,b=g.volume,y=setInterval(()=>{g.volume>.05?g.volume=Math.max(0,g.volume-b/(Dx/50)):(clearInterval(y),g.pause())},50),x=new Audio(h);return x.loop=!0,x.volume=0,c.current=x,x.play().then(()=>{const w=setInterval(()=>{x.volume<ha-.02?x.volume=Math.min(ha,x.volume+ha/(Dx/50)):(x.volume=ha,clearInterval(w))},50)}).catch(()=>{l(!1)}),()=>clearInterval(y)}c.current&&c.current.pause(),c.current=new Audio(h),c.current.loop=!0,c.current.volume=ha},[i]),j.useEffect(()=>()=>{c.current&&(c.current.pause(),c.current=null),f.current&&clearInterval(f.current)},[]);const p=j.useCallback(()=>{if(c.current)if(o){const h=c.current,g=h.volume,b=setInterval(()=>{h.volume>.02?h.volume=Math.max(0,h.volume-g/10):(clearInterval(b),h.pause(),h.volume=ha)},40);f.current=b,l(!1)}else c.current.volume=0,c.current.play().then(()=>{const h=c.current;if(!h)return;const g=setInterval(()=>{h.volume<ha-.02?h.volume=Math.min(ha,h.volume+ha/10):(h.volume=ha,clearInterval(g))},40);f.current=g}).catch(()=>{}),l(!0)},[o]),m=a==="navbar"?`ambient-nav-btn ${o?"ambient-nav-playing":"ambient-nav-muted"}`:`ambient-btn ${o?"ambient-playing":"ambient-muted"}`;return s.jsxs(s.Fragment,{children:[s.jsx("button",{className:m,onClick:p,"aria-label":o?"关闭白噪音":"开启白噪音",title:o?i?"夜雨声":"晨林鸟鸣":"开启白噪音",children:s.jsxs("svg",{width:a==="navbar"?18:22,height:a==="navbar"?18:22,viewBox:"0 0 24 24",fill:"none",children:[s.jsx("path",{d:"M4 14V12C4 7.58 7.58 4 12 4S20 7.58 20 12V14",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),s.jsx("rect",{x:"3",y:"14",width:"3",height:"6",rx:"1.5",fill:"currentColor",opacity:"0.8"}),s.jsx("rect",{x:"18",y:"14",width:"3",height:"6",rx:"1.5",fill:"currentColor",opacity:"0.8"}),o&&s.jsx("path",{d:"M9 17V15M12 18V14M15 17V15",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"})]})}),s.jsx("style",{children:`
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
      `})]})},V6=({current:a,onNavigate:i,isNight:o,onToggleTheme:l,isFullMode:c})=>{const[f,p]=j.useState(!1),m=c?[{key:"home",label:"首页",href:null},{key:"about",label:"关于我",href:null},{key:"projects",label:"项目集",href:null},{key:"lab",label:"疗愈室",href:"/healing"},{key:"mickey",label:"妙妙工具箱",href:"/mickey"},{key:"film",label:"第七卷胶片",href:"/film"}]:[{key:"lab",label:"疗愈室",href:"/healing"},{key:"film",label:"第七卷胶片",href:"/film"}];return j.useEffect(()=>{p(!1)},[a]),s.jsxs("nav",{className:"fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12",style:{background:"var(--bg-overlay)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)"},children:[s.jsxs("div",{className:"flex items-center gap-3",children:[s.jsx(U6,{variant:"navbar"}),!c&&s.jsx("span",{style:{fontFamily:'"Noto Serif SC", serif',fontSize:"15px",color:"var(--text)",fontWeight:500,letterSpacing:"0.05em"},children:"森林疗愈室"})]}),s.jsxs("div",{className:"hidden md:flex items-center gap-8",children:[m.map(h=>h.href?s.jsx(rt,{to:h.href,className:"nav-link",style:{color:"var(--text-soft)"},children:h.label},h.key):s.jsx("button",{onClick:()=>i(h.key),className:"nav-link",style:{color:a===h.key?"var(--accent)":"var(--text-soft)",fontWeight:a===h.key?500:400},children:h.label},h.key)),s.jsx("button",{onClick:l,className:"ml-4 px-3 py-1.5 rounded-lg text-sm transition-colors",style:{border:"1px solid var(--border)",color:"var(--text-soft)"},children:o?"日":"夜"})]}),s.jsxs("button",{className:"md:hidden p-2",onClick:()=>p(h=>!h),style:{color:"var(--text)"},"aria-label":"菜单",children:[s.jsx("div",{className:"w-5 h-0.5 mb-1.5",style:{background:"var(--text)"}}),s.jsx("div",{className:"w-5 h-0.5 mb-1.5",style:{background:"var(--text)"}}),s.jsx("div",{className:"w-5 h-0.5",style:{background:"var(--text)"}})]}),f&&s.jsxs("div",{className:"absolute top-16 left-0 right-0 md:hidden flex flex-col py-4 px-6 gap-4",style:{background:"var(--bg-overlay)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)"},children:[m.map(h=>h.href?s.jsx(rt,{to:h.href,onClick:()=>p(!1),style:{color:"var(--text-soft)"},children:h.label},h.key):s.jsx("button",{onClick:()=>{i(h.key),p(!1)},style:{color:a===h.key?"var(--accent)":"var(--text-soft)",fontWeight:a===h.key?500:400,textAlign:"left"},children:h.label},h.key)),s.jsxs("button",{onClick:l,style:{color:"var(--text-soft)",textAlign:"left"},children:["切换",o?"昼":"夜","模式"]})]}),s.jsx("style",{children:`
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
      `})]})},mn=[{id:"forest-healing",title:"森林疗愈室",tag:"沉浸式疗愈网页",painPoint:"专为 i 人设计的低能耗回血方案",description:"融合自然白噪音、呼吸引导与感恩日记的沉浸式疗愈网页，依昼夜节律切换森林光影与萤火粒子，为社交耗竭后的你留一处安静的角落。",imageUrl:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop",liveUrl:"https://xiaolu-web.vercel.app/",link:"https://xiaolu-web.vercel.app/",tags:["React","Framer Motion","Web Audio"]},{id:"system-tuning",title:"系统调频",tag:"认知调频工具",painPoint:"校准频率，让信号重新清晰",description:"基于李松蔚《5%的改变》的认知调频工具。以收音机调频为隐喻：描述困扰 → 旋钮扫频 → 信号清晰 → 输出 5% 微改变。与解忧杂货铺形成情绪/认知双轨。",imageUrl:"https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop",liveUrl:"https://xiaolu-web.vercel.app/toolbox/answer",link:"https://xiaolu-web.vercel.app/toolbox/answer",tags:["React","Web Audio","认知行为"]},{id:"quest-log",title:"通关清单",tag:"游戏化 To-Do",painPoint:"把人生变成一场 RPG",description:"游戏化任务清单，支持智能任务拆解（5分钟倒计时 / 60点低难度 / 直接挑战），完成时有粒子爆炸与经验值增长动画，把启动阻力降到最低。",imageUrl:"https://images.unsplash.com/photo-1612404730960-5c71577fca11?w=800&h=600&fit=crop",liveUrl:"https://xiaolu-web.vercel.app/toolbox/quests",link:"https://xiaolu-web.vercel.app/toolbox/quests",tags:["React","Framer Motion","游戏化"]},{id:"inventory",title:"物资管家",tag:"库存管理应用",painPoint:"库存与保质期，一目了然",description:"SaaS 风格的库存管理应用，左侧表单右侧列表，支持分类统计、保质期预警与删除动画，数据持久化于 localStorage，生活物资尽在掌握。",imageUrl:"https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop",liveUrl:"https://xiaolu-web.vercel.app/toolbox/inventory",link:"https://xiaolu-web.vercel.app/toolbox/inventory",tags:["React","TypeScript","LocalStorage"]},{id:"advice-shop",title:"解忧杂货铺",tag:"治愈系问答空间",painPoint:"总有一句话，能解开你的心结",description:"烛光摇曳的信纸式问答空间，写下烦恼，选择心灵/脑洞/工作/情感分类，一封回信缓缓升起。情绪轨治愈，与系统调频的认知轨互补。",imageUrl:"https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop",liveUrl:"https://xiaolu-web.vercel.app/toolbox/advice",link:"https://xiaolu-web.vercel.app/toolbox/advice",tags:["React","Framer Motion","情感化交互"]},{id:"travel-guide",title:"漫游指南",tag:"旅行足迹与攻略",painPoint:"走过的路，看过的云",description:"胶片质感的旅行足迹记录，简化版中国地图按省份着色，横向城市卡片滚动浏览，点击展开吃住玩攻略详情，把每一次出发都收进胶卷。",imageUrl:"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",liveUrl:"https://xiaolu-web.vercel.app/toolbox/travel",link:"https://xiaolu-web.vercel.app/toolbox/travel",tags:["SVG","Framer Motion","胶片美学"]},{id:"recharge-list",title:"回血清单",tag:"i 人低能耗回血",painPoint:"允许一切崩塌，只做一件极小的事",description:"拍立得式 3D 翻转卡片随机抽取低能耗小事，瀑布流展示全部任务，点击「今天做了」记录每周能量值，社交耗竭后用最小动作回血。",imageUrl:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",liveUrl:"https://xiaolu-web.vercel.app/toolbox/recharge",link:"https://xiaolu-web.vercel.app/toolbox/recharge",tags:["3D Transform","Framer Motion","LocalStorage"]},{id:"stress-relief",title:"解压馆",tag:"交互式解压游戏",painPoint:"允许一切崩塌",description:"三款解压游戏集合：无限捏泡泡（SVG 网格爆裂）、禅意切割（拖拽切片动画）、重力涂鸦（Canvas 物理重力绘画），马龙配色，60fps 纯 CSS/Canvas 实现。",imageUrl:"https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=800&h=600&fit=crop",liveUrl:"https://xiaolu-web.vercel.app/toolbox/games",link:"https://xiaolu-web.vercel.app/toolbox/games",tags:["Canvas","SVG","Web Audio"]},{id:"memory-museum",title:"时光博物馆",tag:"双展厅回忆录",painPoint:"每一步都算数",description:"复古胶片质感博物馆，时代回响厅横向时间轴陈列怀旧藏品，荣耀之路厅纵向时间轴展示成就里程碑，点击展品进入灯箱放大，尘埃粒子缓缓飘落。",imageUrl:"https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop",liveUrl:"https://xiaolu-web.vercel.app/toolbox/memories",link:"https://xiaolu-web.vercel.app/toolbox/memories",tags:["Framer Motion","Lightbox","复古胶片"]},{id:"life-slices",title:"第七卷胶片",tag:"胶卷音乐馆",painPoint:"一卷胶片，六个画面",description:"暗房感胶卷布局，6 个生活片段以画框交错排列在胶卷两侧。点击「音乐/播客」进入枯木生歌子页：黑胶唱片旋转、嫩芽生长、音符飘动，收藏夹式氛围展示。",imageUrl:"https://images.unsplash.com/photo-1483412468200-72182a8a3232?w=800&h=600&fit=crop",liveUrl:"https://xiaolu-web.vercel.app/life",link:"https://xiaolu-web.vercel.app/life",tags:["Framer Motion","Web Audio","胶卷美学"]}],Ox=650,_6=100,q6=["/forest","/toolbox/answer","/toolbox/quests","/toolbox/supplies","/toolbox/advice","/toolbox/travel","/toolbox/recharge","/toolbox/games","/toolbox/memories"],Lx=`data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <pattern id="vein" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
      <path d="M100 10 L100 190 M100 40 Q70 60 50 90 M100 40 Q130 60 150 90 M100 80 Q60 100 40 140 M100 80 Q140 100 160 140 M100 120 Q70 140 55 170 M100 120 Q130 140 145 170" stroke="rgba(122,154,130,0.06)" stroke-width="0.8" fill="none"/>
    </pattern>
  </defs>
  <rect width="200" height="200" fill="url(#vein)"/>
</svg>
`)}`,H6=({size:a=16})=>s.jsxs("svg",{width:a,height:a,viewBox:"0 0 20 20",fill:"none",children:[s.jsx("path",{d:"M10 2C5 2 2 6 2 11c0 4 3 7 8 7 0-5 2-9 8-11-3-3-6-5-8-5z",fill:"rgba(122,154,130,0.6)"}),s.jsx("path",{d:"M6 16C8 12 11 9 15 7",stroke:"rgba(255,255,255,0.4)",strokeWidth:"0.8",strokeLinecap:"round"})]}),G6=["在这里，你可以暂时停止思考，只管呼吸。","当风暴来临，试着调整帆的角度，而不是对抗风。","即使是巨树，也是从一颗种子开始生长的。","照顾好根须，树木才能安然度过冬天。","把心事折成纸船，顺着溪流漂走吧。","森林里没有错误的路，只有不同的风景。","苔藓不需要阳光也能生长，微小亦是生命力。","落叶腐烂是为了滋养新的土壤，崩塌也是。","年轮记录了每一段风雨，它们都是勋章。"],u1=(a,i)=>a==="cover"?1:a==="toc"?2:a==="quote"?3+i*2:a==="preview"?4+i*2:1,Y6={enter:a=>({x:a>0?"100%":"-100%",rotateY:a>0?35:-35,opacity:0}),center:{x:0,rotateY:0,opacity:1},exit:a=>({x:a>0?"-100%":"100%",rotateY:a>0?-35:35,opacity:0})},zl=({current:a})=>s.jsxs("span",{className:"lb-page-number",children:[String(a).padStart(3,"0")," ",s.jsx("span",{className:"lb-page-number-slash",children:"/"})," ",_6]}),F6=()=>s.jsxs("div",{className:"lb-page-content lb-cover",children:[s.jsx("div",{className:"lb-cover-vein"}),s.jsx("div",{className:"lb-cover-frame"}),s.jsxs("div",{className:"lb-cover-inner",children:[s.jsx("div",{className:"lb-cover-leaf",children:s.jsx(H6,{size:48})}),s.jsx("p",{className:"lb-cover-eyebrow",children:"A Leaf Book of Works"}),s.jsx("h1",{className:"lb-cover-title",children:"LeafBook"}),s.jsx("div",{className:"lb-cover-line"}),s.jsx("p",{className:"lb-cover-subtitle",children:"一个关于秩序、疗愈与生长的目录。"}),s.jsx("p",{className:"lb-cover-author",children:"路俊玲 · 2026"})]}),s.jsx("p",{className:"lb-cover-hint",children:"轻触封面 · 翻开"}),s.jsx(zl,{current:1})]}),I6=({onPick:a})=>s.jsxs("div",{className:"lb-page-content lb-index-page",children:[s.jsx("div",{className:"lb-page-vein"}),s.jsxs("div",{className:"lb-catalog-container",children:[s.jsxs("div",{className:"lb-catalog-header",children:[s.jsx("span",{className:"lb-index-label",children:"CONTENTS"}),s.jsx("h2",{className:"lb-index-title",children:"目录"}),s.jsx("div",{className:"lb-index-deco"}),s.jsxs("p",{className:"lb-index-count",children:["共 ",mn.length," 件作品 · 上下滚动浏览"]})]}),s.jsx("ul",{className:"lb-catalog-list",children:mn.map((i,o)=>s.jsxs("li",{className:"lb-catalog-item",onClick:l=>{l.stopPropagation(),a(o)},children:[s.jsx("span",{className:"lb-catalog-num",children:String(o+1).padStart(2,"0")}),s.jsxs("div",{className:"lb-catalog-item-text",children:[s.jsx("span",{className:"lb-catalog-item-title",children:i.title}),s.jsx("span",{className:"lb-catalog-item-pain",children:i.painPoint})]}),s.jsx("span",{className:"lb-catalog-arrow",children:"→"})]},i.id))}),s.jsx("p",{className:"lb-catalog-foot",children:"点击任一作品 · 翻到卷首语"})]}),s.jsx(zl,{current:2})]}),X6=({project:a,index:i})=>s.jsxs("div",{className:"lb-page-content lb-quote-page",children:[s.jsx("div",{className:"lb-page-vein"}),s.jsxs("div",{className:"lb-quote-wrap",children:[s.jsx("span",{className:"lb-quote-mark",children:'"'}),s.jsx(X.p,{className:"lb-quote-text",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.8,delay:.2,ease:"easeOut"},children:G6[i]??"每一页都是新的开始。"}),s.jsx("span",{className:"lb-quote-mark lb-quote-mark-end",children:'"'}),s.jsxs("p",{className:"lb-quote-attribution",children:["— ",a.title]})]}),s.jsx(X.p,{className:"lb-quote-continue",initial:{opacity:0},animate:{opacity:1},transition:{delay:1,duration:.6},children:"点击继续 · 翻到作品"}),s.jsx(zl,{current:u1("quote",i)})]}),P6=({project:a,index:i,onNext:o,onJump:l})=>s.jsxs("div",{className:"lb-page-content lb-preview-page",children:[s.jsx("div",{className:"lb-page-vein"}),s.jsxs("div",{className:"lb-preview-grid",children:[s.jsxs("div",{className:"lb-preview-text",children:[s.jsxs("span",{className:"lb-preview-num",children:["No. ",String(i+1).padStart(2,"0")," / ",String(mn.length).padStart(2,"0")]}),s.jsx("h2",{className:"lb-preview-title",children:a.title}),s.jsxs("div",{className:"lb-preview-pain-wrap",children:[s.jsx("span",{className:"lb-preview-pain-bar"}),s.jsx("p",{className:"lb-preview-pain",children:a.painPoint})]}),s.jsx("p",{className:"lb-preview-desc",children:a.description}),a.tags&&a.tags.length>0&&s.jsx("div",{className:"lb-preview-tags",children:a.tags.map(c=>s.jsx("span",{className:"lb-preview-tag",children:c},c))}),s.jsx("button",{className:"lb-preview-visit",onClick:c=>{c.stopPropagation(),l()},children:"打开作品 ↗"})]}),s.jsxs("a",{className:"lb-preview-visual",href:a.liveUrl,target:"_blank",rel:"noopener noreferrer",onClick:c=>{c.stopPropagation(),l()},children:[s.jsx("img",{src:a.imageUrl,alt:a.title,className:"lb-preview-media"}),s.jsx("span",{className:"lb-preview-visual-overlay"}),s.jsx("span",{className:"lb-preview-visual-hint",children:"点击访问 ↗"})]})]}),s.jsx("button",{className:"lb-preview-next-btn",onClick:c=>{c.stopPropagation(),o()},children:"下一页 →"}),s.jsx(zl,{current:u1("preview",i)})]}),$6=({registerOpenBook:a,flipTriggerRef:i,autoFlipDelay:o})=>{const[l,c]=j.useState("cover"),[f,p]=j.useState(0),[m,h]=j.useState(0),[g,b]=j.useState(!1),y=j.useRef("cover"),x=j.useRef(0),w=j.useRef(!1),S=j.useRef(null);j.useEffect(()=>{y.current=l},[l]),j.useEffect(()=>{x.current=m},[m]);const N=j.useCallback((F,Q,K)=>{w.current||(w.current=!0,b(!0),p(Q),(K==null?void 0:K.index)!==void 0&&h(K.index),c(F),window.setTimeout(()=>{w.current=!1,b(!1)},Ox))},[]),C=j.useCallback(()=>{const F=y.current;if(F==="cover")N("toc",1);else if(F==="quote")N("preview",1);else if(F==="preview"){const Q=(x.current+1)%mn.length;N("quote",1,{index:Q})}},[N]),T=j.useCallback(()=>{const F=y.current;F==="toc"?N("cover",-1):F==="quote"?N("toc",-1):F==="preview"&&N("quote",-1)},[N]),z=j.useCallback(F=>{N("quote",1,{index:F})},[N]),E=j.useCallback(()=>{const F=q6[x.current]??"/";window.open(F,"_blank","noopener,noreferrer")},[]),A=j.useCallback(()=>{const F=(x.current+1)%mn.length;N("quote",1,{index:F})},[N]),R=j.useCallback(()=>{y.current==="cover"?N("toc",1):y.current!=="toc"&&N("toc",-1)},[N]);j.useEffect(()=>{a&&a(R)},[a,R]),j.useEffect(()=>{i&&(i.current=R)},[i,R]),j.useEffect(()=>{if(o!==void 0){const F=setTimeout(()=>{R()},o);return()=>clearTimeout(F)}},[o,R]);const B=F=>{const Q=y.current;if(Q==="cover"){N("toc",1);return}if(Q==="quote"||Q==="preview"){const te=F.currentTarget.getBoundingClientRect();F.clientX-te.left<te.width/2?T():C();return}const K=F.currentTarget.getBoundingClientRect();F.clientX-K.left<K.width/2&&T()},_=F=>{S.current={x:F.touches[0].clientX,y:F.touches[0].clientY}},W=F=>{if(!S.current)return;const Q=F.changedTouches[0].clientX-S.current.x,K=F.changedTouches[0].clientY-S.current.y;if(Math.abs(Q)>50&&Math.abs(Q)>Math.abs(K))Q<0?C():T();else if(Math.abs(Q)<10&&Math.abs(K)<10){const te=y.current;te==="cover"?N("toc",1):te==="quote"&&N("preview",1)}S.current=null},ne=()=>l==="cover"?s.jsx(F6,{}):l==="toc"?s.jsx(I6,{onPick:z}):l==="quote"?s.jsx(X6,{project:mn[m],index:m}):l==="preview"?s.jsx(P6,{project:mn[m],index:m,onNext:A,onJump:E}):null,H=l==="cover";return s.jsxs("div",{className:"lb-wrapper",children:[s.jsxs("div",{className:"lb-book-stand",children:[s.jsxs("div",{className:"lb-book",onClick:B,onTouchStart:_,onTouchEnd:W,children:[s.jsx("div",{className:"lb-spine-shadow"}),s.jsxs("div",{className:"lb-pages-container",children:[s.jsx(Ne,{mode:"wait",custom:f,children:s.jsx(X.div,{className:"lb-page",custom:f,variants:Y6,initial:"enter",animate:"center",exit:"exit",transition:{duration:Ox/1e3,ease:[.4,0,.2,1]},style:{transformOrigin:"left center",transformStyle:"preserve-3d"},children:ne()},`${l}-${m}`)}),g&&s.jsx("div",{className:`lb-flip-shadow ${f>0?"lb-flip-shadow-fwd":"lb-flip-shadow-bwd"}`})]}),!H&&s.jsx("button",{className:"lb-close-btn",onClick:F=>{F.stopPropagation(),N("cover",-1)},children:"合上书"})]}),s.jsx("div",{className:"lb-desk-shadow"})]}),!H&&s.jsxs("div",{className:"lb-controls",children:[s.jsxs("span",{className:"lb-view-label",children:[l==="toc"&&"目录",l==="quote"&&"卷首语",l==="preview"&&`作品预览 · ${m+1} / ${mn.length}`]}),s.jsxs("span",{className:"lb-controls-hint",children:[l==="toc"&&"上下滚动浏览 · 点击作品进入 · 左侧返回封皮",l==="quote"&&"点击右半翻到作品 · 左侧返回目录",l==="preview"&&"点击截图打开作品 · 下一页翻到下一篇金句"]})]}),s.jsx("style",{children:`
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
          perspective: 2000px;
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
          left: 0; top: 0; bottom: 0;
          width: 12px;
          background: linear-gradient(to right, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 50%, transparent 100%);
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
          animation: lb-shadow-fade 0.6s ease-out forwards;
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
          background-image: url("${Lx}");
          background-repeat: repeat;
          opacity: 0.7;
          pointer-events: none;
          z-index: 0;
        }

        /* ===== 页码（右下角，所有页面统一） ===== */
        .lb-page-number {
          position: absolute;
          bottom: 14px;
          right: 18px;
          z-index: 15;
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 11px;
          color: var(--lb-text-soft);
          opacity: 0.5;
          letter-spacing: 0.1em;
          font-variant-numeric: tabular-nums;
          pointer-events: none;
        }
        .lb-page-number-slash {
          opacity: 0.5;
          margin: 0 1px;
        }

        /* ===== 封皮 ===== */
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
          background-image: url("${Lx}");
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
        .lb-cover-subtitle {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px;
          color: var(--lb-text-soft);
          margin: 0 0 24px;
          letter-spacing: 0.06em;
          line-height: 1.6;
        }
        .lb-cover-author {
          font-size: 13px;
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

        /* ===== 目录页（长滚动） ===== */
        .lb-index-page { display: flex; }
        .lb-catalog-container {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          scroll-behavior: smooth;
          padding: 40px 36px 60px;
          scrollbar-width: thin;
          scrollbar-color: rgba(184, 140, 106, 0.3) transparent;
        }
        .lb-catalog-container::-webkit-scrollbar { width: 4px; }
        .lb-catalog-container::-webkit-scrollbar-thumb {
          background: rgba(184, 140, 106, 0.3);
          border-radius: 2px;
        }
        .lb-catalog-container::-webkit-scrollbar-track { background: transparent; }

        .lb-catalog-header {
          text-align: center;
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(184, 140, 106, 0.15);
        }
        .lb-index-label {
          font-size: 10px;
          letter-spacing: 0.3em;
          color: var(--lb-text-soft);
          opacity: 0.7;
          margin-bottom: 10px;
          display: block;
        }
        .lb-index-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 36px;
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
          margin: 14px auto;
        }
        .lb-index-count {
          font-size: 12px;
          color: var(--lb-text-soft);
          letter-spacing: 0.05em;
          margin: 0;
        }
        .lb-catalog-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .lb-catalog-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.28s ease, background 0.28s ease, box-shadow 0.28s ease;
          border: 1px solid transparent;
        }
        .lb-catalog-item:hover {
          transform: translateX(6px);
          background: rgba(184, 140, 106, 0.08);
          border-color: rgba(184, 140, 106, 0.2);
          box-shadow: 0 4px 16px -8px rgba(184, 140, 106, 0.25);
        }
        .lb-catalog-item:active {
          transform: translateX(6px) scale(0.99);
        }
        .lb-catalog-num {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px;
          color: var(--accent);
          opacity: 0.7;
          font-variant-numeric: tabular-nums;
          min-width: 24px;
        }
        .lb-catalog-item-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
          min-width: 0;
        }
        .lb-catalog-item-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--lb-text);
        }
        .lb-catalog-item-pain {
          font-size: 11px;
          color: var(--lb-text-soft);
          opacity: 0.85;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lb-catalog-arrow {
          font-size: 14px;
          color: var(--lb-text-soft);
          opacity: 0.5;
          transition: transform 0.28s ease, opacity 0.28s ease, color 0.28s ease;
        }
        .lb-catalog-item:hover .lb-catalog-arrow {
          transform: translateX(4px);
          opacity: 1;
          color: var(--accent);
        }
        .lb-catalog-foot {
          text-align: center;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: var(--lb-text-soft);
          opacity: 0.45;
          margin-top: 24px;
        }

        /* ===== 金句页 ===== */
        .lb-quote-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 50px 44px;
        }
        .lb-quote-wrap {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 320px;
        }
        .lb-quote-mark {
          font-family: Georgia, "Noto Serif SC", serif;
          font-size: 64px;
          line-height: 0.6;
          color: var(--accent);
          opacity: 0.25;
          display: block;
          margin-bottom: 8px;
        }
        .lb-quote-mark-end {
          margin-top: 12px;
          margin-bottom: 0;
        }
        .lb-quote-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--lb-text);
          line-height: 1.85;
          letter-spacing: 0.06em;
          margin: 0;
        }
        .lb-quote-attribution {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          color: var(--lb-text-soft);
          letter-spacing: 0.1em;
          margin: 18px 0 0;
        }
        .lb-quote-continue {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          letter-spacing: 0.22em;
          color: var(--lb-text-soft);
          opacity: 0.5;
          z-index: 2;
          animation: lb-hint-pulse 2.8s ease-in-out infinite;
        }

        /* ===== 作品预览页（左右分栏） ===== */
        .lb-preview-page { display: flex; }
        .lb-preview-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          width: 100%;
          height: 100%;
        }
        .lb-preview-text {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          padding: 44px 28px 60px;
          border-right: 1px solid rgba(184, 140, 106, 0.14);
          overflow-y: auto;
          scrollbar-width: none;
        }
        .lb-preview-text::-webkit-scrollbar { display: none; }
        .lb-preview-num {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--accent);
          opacity: 0.8;
          margin-bottom: 14px;
          font-variant-numeric: tabular-nums;
        }
        .lb-preview-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 26px;
          font-weight: 700;
          color: var(--lb-text);
          line-height: 1.25;
          margin: 0 0 16px;
          letter-spacing: 0.02em;
        }
        .lb-preview-pain-wrap {
          display: flex;
          align-items: stretch;
          gap: 12px;
          margin-bottom: 16px;
        }
        .lb-preview-pain-bar {
          width: 3px;
          border-radius: 2px;
          background: var(--accent);
          flex-shrink: 0;
          opacity: 0.8;
        }
        .lb-preview-pain {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px;
          font-weight: 600;
          color: var(--accent);
          line-height: 1.55;
          margin: 0;
        }
        .lb-preview-desc {
          font-size: 12px;
          line-height: 1.8;
          color: var(--lb-text-soft);
          margin: 0 0 16px;
        }
        .lb-preview-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }
        .lb-preview-tag {
          font-size: 10px;
          padding: 3px 9px;
          border-radius: 6px;
          background: rgba(184, 140, 106, 0.1);
          color: var(--lb-text-soft);
        }
        .lb-preview-visit {
          margin-top: auto;
          align-self: flex-start;
          font-size: 12px;
          color: var(--accent);
          font-weight: 500;
          padding: 7px 16px;
          border: 1px solid rgba(184, 140, 106, 0.3);
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          font-family: "Noto Sans SC", sans-serif;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .lb-preview-visit:hover {
          border-color: var(--accent);
          background: rgba(184, 140, 106, 0.08);
        }

        /* 右栏 截图 */
        .lb-preview-visual {
          position: relative;
          z-index: 2;
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #1a1f1a;
          cursor: pointer;
        }
        .lb-preview-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .lb-preview-visual:hover .lb-preview-media { transform: scale(1.04); }
        .lb-preview-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .lb-preview-visual:hover .lb-preview-visual-overlay { opacity: 1; }
        .lb-preview-visual-hint {
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

        /* 预览页「下一页」按钮（右下角悬浮） */
        .lb-preview-next-btn {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          padding: 8px 22px;
          font-size: 13px;
          font-family: "Noto Sans SC", sans-serif;
          color: var(--accent);
          font-weight: 500;
          background: rgba(245, 240, 228, 0.85);
          border: 1px solid rgba(184, 140, 106, 0.35);
          border-radius: 999px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          letter-spacing: 0.05em;
          box-shadow: 0 4px 16px -6px rgba(0,0,0,0.15);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        :root[data-theme="night"] .lb-preview-next-btn {
          background: rgba(42, 48, 40, 0.85);
        }
        .lb-preview-next-btn:hover {
          transform: translateX(-50%) translateY(-2px);
          box-shadow: 0 6px 20px -6px rgba(184, 140, 106, 0.35);
          background: rgba(184, 140, 106, 0.12);
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

        /* 预览页时合上书按钮上移，避开下一页按钮 */
        .lb-preview-page ~ .lb-close-btn,
        .lb-book:has(.lb-preview-page) .lb-close-btn {
          bottom: auto;
          top: 16px;
        }

        /* ===== 底部控制 ===== */
        .lb-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .lb-view-label {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px;
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 0.08em;
        }
        .lb-controls-hint {
          font-size: 11px;
          color: var(--text-soft);
          letter-spacing: 0.05em;
          opacity: 0.7;
        }

        /* ===== 移动端 ===== */
        @media (max-width: 768px) {
          .lb-book {
            width: 300px;
            height: 424px;
            max-height: 68vh;
          }
          .lb-catalog-container { padding: 28px 20px 50px; }
          .lb-index-title { font-size: 26px; }
          .lb-catalog-item { padding: 10px 12px; gap: 10px; }
          .lb-catalog-item-title { font-size: 14px; }
          .lb-catalog-item-pain { font-size: 10px; }
          .lb-catalog-num { font-size: 12px; min-width: 20px; }
          .lb-cover-title { font-size: 30px; }
          .lb-cover-subtitle { font-size: 12px; }
          /* 金句页 */
          .lb-quote-page { padding: 36px 28px; }
          .lb-quote-text { font-size: 17px; line-height: 1.75; }
          .lb-quote-mark { font-size: 48px; }
          /* 预览页：移动端改为上下分栏 */
          .lb-preview-grid { grid-template-columns: 1fr; grid-template-rows: 1.2fr 0.8fr; }
          .lb-preview-text {
            padding: 24px 18px 14px;
            border-right: none;
            border-bottom: 1px solid rgba(184, 140, 106, 0.14);
          }
          .lb-preview-title { font-size: 19px; margin-bottom: 10px; }
          .lb-preview-pain { font-size: 12px; }
          .lb-preview-desc { font-size: 11px; line-height: 1.65; margin-bottom: 10px; }
          .lb-preview-tags { margin-bottom: 10px; }
          .lb-preview-visit { font-size: 11px; padding: 6px 12px; }
          /* 按钮 */
          .lb-close-btn { bottom: 12px; right: 12px; padding: 6px 12px; font-size: 11px; }
          .lb-preview-next-btn { padding: 6px 16px; font-size: 12px; }
          .lb-page-number { font-size: 10px; bottom: 10px; right: 14px; }
        }
      `})]})},Z6=a=>Array.from({length:a},()=>({left:Math.random()*100,delay:Math.random()*8,duration:10+Math.random()*8,size:2+Math.random()*3,drift:(Math.random()-.5)*40})),Q6=()=>{const{isNight:a}=Kf(),o=typeof window<"u"&&window.innerWidth<768?4:8,l=j.useMemo(()=>Z6(o),[o]);return s.jsxs("div",{className:"dyn-bg","aria-hidden":"true",children:[s.jsx("div",{className:"dyn-layer dyn-layer-base"}),s.jsx("div",{className:"dyn-layer dyn-layer-far"}),s.jsx("div",{className:"dyn-layer dyn-layer-mid"}),s.jsx("div",{className:"dyn-layer dyn-layer-front",children:l.map((c,f)=>s.jsx("span",{className:`dyn-particle ${a?"dyn-firefly":"dyn-dust"}`,style:{left:`${c.left}%`,width:`${c.size}px`,height:`${c.size}px`,animationDelay:`${c.delay}s`,animationDuration:`${c.duration}s`,"--drift":`${c.drift}px`}},f))}),s.jsx("style",{children:`
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
      `})]})},Bx=.12,K6=5e3,W6=()=>{const[a,i]=j.useState(!1),[o,l]=j.useState(!1),c=j.useRef({x:0,y:0,rotation:0}),f=j.useRef({x:0,y:0,rotation:0}),p=j.useRef(Date.now()),m=j.useRef(0),h=j.useRef(0),g=j.useRef(null),b=x=>x?!!x.closest('a, button, input, textarea, select, [role="button"], [data-cursor="hover"]'):!1,y=j.useCallback(x=>{f.current={x:x.clientX,y:x.clientY,rotation:0},p.current=Date.now(),i(!0);const w=document.elementFromPoint(x.clientX,x.clientY);l(b(w))},[]);return j.useEffect(()=>{const x=()=>{const w=c.current,S=f.current;if(Date.now()-p.current>K6){h.current+=.015;const E=Math.sin(h.current)*15,A=Math.cos(h.current*.7)*10;S.x=f.current.x+E,S.y=f.current.y+A}else h.current=0;w.x+=(S.x-w.x)*Bx,w.y+=(S.y-w.y)*Bx;const T=S.x-w.x,z=S.y-w.y;(Math.abs(T)>1||Math.abs(z)>1)&&(w.rotation=Math.atan2(z,T)*(180/Math.PI)*.15),g.current&&(g.current.style.transform=`translate3d(${w.x-12}px, ${w.y-12}px, 0) rotate(${w.rotation}deg)`),m.current=requestAnimationFrame(x)};return m.current=requestAnimationFrame(x),()=>cancelAnimationFrame(m.current)},[]),j.useEffect(()=>{if(!(window.innerWidth<768||matchMedia("(pointer: coarse)").matches))return document.addEventListener("mousemove",y),document.addEventListener("mouseleave",()=>i(!1)),()=>{document.removeEventListener("mousemove",y)}},[y]),a?s.jsxs("div",{ref:g,className:"butterfly-cursor","aria-hidden":"true",children:[s.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[s.jsxs("g",{className:`bf-wing bf-wing-left ${o?"bf-fast":""}`,children:[s.jsx("ellipse",{cx:"7",cy:"9",rx:"5",ry:"4.5",fill:"rgba(122,154,130,0.35)",stroke:"rgba(90,74,66,0.4)",strokeWidth:"0.6"}),s.jsx("ellipse",{cx:"7",cy:"15",rx:"3.5",ry:"3",fill:"rgba(122,154,130,0.25)",stroke:"rgba(90,74,66,0.3)",strokeWidth:"0.5"})]}),s.jsxs("g",{className:`bf-wing bf-wing-right ${o?"bf-fast":""}`,children:[s.jsx("ellipse",{cx:"17",cy:"9",rx:"5",ry:"4.5",fill:"rgba(122,154,130,0.35)",stroke:"rgba(90,74,66,0.4)",strokeWidth:"0.6"}),s.jsx("ellipse",{cx:"17",cy:"15",rx:"3.5",ry:"3",fill:"rgba(122,154,130,0.25)",stroke:"rgba(90,74,66,0.3)",strokeWidth:"0.5"})]}),s.jsx("ellipse",{cx:"12",cy:"12",rx:"1",ry:"6",fill:"rgba(90,74,66,0.7)"}),s.jsx("path",{d:"M11 6.5C10.5 5 10 4 9.5 3.5",stroke:"rgba(90,74,66,0.5)",strokeWidth:"0.5",strokeLinecap:"round"}),s.jsx("path",{d:"M13 6.5C13.5 5 14 4 14.5 3.5",stroke:"rgba(90,74,66,0.5)",strokeWidth:"0.5",strokeLinecap:"round"})]}),s.jsx("style",{children:`
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
      `})]}):null},Hn={initial:{opacity:0,y:28},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-60px"},transition:{duration:.7,ease:"easeOut"}},J6=["产品规划","用户研究","需求分析","原型设计","数据分析","AI 应用","项目管理","跨部门协作","竞品分析","增长策略"],e8=()=>{const{isNight:a,toggleTheme:i}=Kf(),[o,l]=j.useState("home"),[c,f]=j.useState(!0),[p,m]=j.useState(!1),h=j.useRef(null);j.useEffect(()=>{const x=new URLSearchParams(window.location.search).get("mode")==="pure";f(!x),document.title=x?"森林疗愈室":"路俊玲 | AI 产品经理作品集"},[]),j.useEffect(()=>{const y=()=>m(window.scrollY>40);return window.addEventListener("scroll",y,{passive:!0}),()=>window.removeEventListener("scroll",y)},[]),j.useEffect(()=>{const y=window.location.hash.replace("#","");if(!y)return;const x=setTimeout(()=>{const w=document.getElementById(y);w&&w.scrollIntoView({behavior:"smooth"})},300);return()=>clearTimeout(x)},[c]),j.useEffect(()=>{const y=c?["home","about","projects"]:["home"],x=new IntersectionObserver(w=>{w.forEach(S=>{S.isIntersecting&&l(S.target.id)})},{rootMargin:"-40% 0px -50% 0px"});return y.forEach(w=>{const S=document.getElementById(w);S&&x.observe(S)}),()=>x.disconnect()},[c]);const g=y=>{const x=document.getElementById(y);x&&x.scrollIntoView({behavior:"smooth"}),y==="projects"&&setTimeout(()=>{h.current&&h.current()},700)},b=y=>{h.current=y};return s.jsxs("div",{className:"po-root",children:[s.jsx(Q6,{}),s.jsx(W6,{}),s.jsx("div",{className:`po-nav-wrap ${p?"po-nav-scrolled":""}`,children:s.jsx(V6,{current:o,onNavigate:g,isNight:a,onToggleTheme:i,isFullMode:c})}),s.jsx("section",{id:"home",className:"po-hero",children:s.jsx(X.div,{className:"po-hero-inner",initial:{opacity:0,y:32},animate:{opacity:1,y:0},transition:{duration:1,ease:"easeOut"},children:c?s.jsxs(s.Fragment,{children:[s.jsx("p",{className:"po-eyebrow",children:"PRODUCT MANAGER"}),s.jsx("h1",{className:"po-name",children:"路俊玲"}),s.jsx("p",{className:"po-tagline",children:"Building Human-Centric AI Products"}),s.jsx("p",{className:"po-bio",children:"从软件工程的代码底座出发，走向 AI 产品的舞台。 在真实场景中洞察需求，把技术能力转化为可触达用户的原型与产品—— 相信好的产品源自对人的理解，技术是手段，温柔才是底色。"}),s.jsxs("div",{className:"po-hero-btns",children:[s.jsx("button",{onClick:()=>g("about"),className:"po-btn po-btn-primary",children:"了解更多"}),s.jsx("button",{onClick:()=>g("projects"),className:"po-btn po-btn-ghost",children:"翻阅我的作品 📖"})]})]}):s.jsxs(s.Fragment,{children:[s.jsx("p",{className:"po-eyebrow",style:{color:"var(--accent)"},children:"Forest Healing Room"}),s.jsx("h1",{className:"po-name",children:"森林疗愈室"}),s.jsx("p",{className:"po-tagline",children:"在这里，每一次呼吸都有人同在"}),s.jsx("p",{className:"po-bio",children:"一个安静的角落，为你准备了呼吸引导、冥想空间和感恩日记。"}),s.jsx("div",{className:"po-hero-btns",children:s.jsx("button",{onClick:()=>g("lab"),className:"po-btn po-btn-primary",children:"进入疗愈室"})})]})})}),c&&s.jsxs(s.Fragment,{children:[s.jsx("section",{id:"about",className:"po-section",children:s.jsxs("div",{className:"po-section-inner",children:[s.jsx(X.h2,{...Hn,className:"po-section-heading",children:"关于我"}),s.jsxs("div",{className:"po-about-left",children:[s.jsxs(X.div,{...Hn,className:"po-text-block",children:[s.jsx("h3",{className:"po-block-title",children:"我的专业能力"}),s.jsx("p",{className:"po-block-body",children:"专注于 AI 产品落地与人性化设计。从需求洞察到产品上线， 擅长将复杂技术转化为用户可感知的价值。"}),s.jsx("p",{className:"po-block-meta",children:"AI Product Manager · 3 年+ 经验"})]}),s.jsxs(X.div,{...Hn,className:"po-text-block",children:[s.jsx("h3",{className:"po-block-title",children:"核心技能"}),s.jsx("div",{className:"po-skill-cloud",children:J6.map(y=>s.jsx("span",{className:"po-skill-tag",children:y},y))})]})]}),s.jsxs("div",{className:"po-about-right",children:[s.jsxs(X.div,{...Hn,className:"po-text-block",children:[s.jsx("h3",{className:"po-block-title",children:"教育背景"}),s.jsxs("div",{className:"po-edu-item",children:[s.jsx("span",{className:"po-edu-school",children:"河南工学院"}),s.jsx("span",{className:"po-edu-degree",children:"本科 · 软件工程"})]})]}),s.jsxs(X.div,{...Hn,className:"po-text-block",children:[s.jsx("blockquote",{className:"po-quote",children:'"这是我的第一个数字造物场。"'}),s.jsx("p",{className:"po-block-body",children:"过去习惯于在文档里定义需求和逻辑；现在，想用代码和 AI 去直接构建解决方案。"}),s.jsx("p",{className:"po-block-body",children:"我相信，最好的产品不是功能的堆砌，而是对真实痛点的温柔回应。"})]})]})]})}),s.jsx("section",{id:"projects",className:"po-section po-section-last",children:s.jsxs("div",{className:"po-section-inner",children:[s.jsx(X.h2,{...Hn,className:"po-section-heading",children:"项目集"}),s.jsxs(X.div,{...Hn,className:"po-leafbook-wrap",children:[s.jsx("p",{className:"po-leafbook-sub",children:"翻开这本树叶书，每一页都是一段实践的印记。"}),s.jsx($6,{registerOpenBook:b})]})]})})]}),s.jsxs("footer",{className:"po-footer",children:[s.jsx("p",{children:"© 2026 路俊玲 · Building Human-Centric AI Products"}),s.jsx("p",{children:"junling@example.com"})]}),s.jsx("style",{children:`
        /* ===== 全局根 ===== */
        .po-root {
          position: relative; min-height: 100vh;
        }

        /* 导航栏 */
        .po-nav-wrap {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background 0.3s ease;
        }
        .po-nav-scrolled .fixed {
          background: rgba(239, 242, 232, 0.8) !important;
          backdrop-filter: blur(16px) !important;
          -webkit-backdrop-filter: blur(16px) !important;
        }
        [data-theme="night"] .po-nav-scrolled .fixed {
          background: rgba(28, 30, 26, 0.82) !important;
        }

        /* ===== Hero 首屏 ===== */
        .po-hero {
          position: relative;
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .po-hero::after {
          content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.04) 30%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0.22) 100%);
        }

        /* 漂浮文字块（无卡片边框，无底部遮罩） */
        .po-hero-inner {
          position: relative; z-index: 2;
          max-width: 680px; width: calc(100% - 48px);
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }

        .po-eyebrow {
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(200,220,200,0.88); margin: 0 0 14px; font-weight: 500;
        }
        .po-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(52px, 10vw, 80px); font-weight: 700;
          color: #fff; margin: 0 0 16px; line-height: 1.05;
          letter-spacing: 0.04em;
          text-shadow: 0 4px 20px rgba(0,0,0,0.35);
        }
        .po-tagline {
          font-size: clamp(15px, 2.5vw, 18px);
          color: rgba(255,255,255,0.85); margin: 0 0 28px;
          font-weight: 400; letter-spacing: 0.04em;
          text-shadow: 0 2px 12px rgba(0,0,0,0.35);
        }
        .po-bio {
          font-size: 14px; line-height: 2.2; color: rgba(255,255,255,0.72);
          margin: 0 0 40px; max-width: 560px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.35);
          letter-spacing: 0.02em;
        }
        .po-hero-btns { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; }

        /* ===== 幽灵按钮 ===== */
        .po-btn {
          padding: 11px 28px; font-size: 14px; font-weight: 500;
          border-radius: 999px; cursor: pointer;
          transition: all 0.3s ease; font-family: inherit;
          letter-spacing: 0.03em;
        }
        .po-btn-primary {
          border: none;
          background: var(--accent); color: #fff;
          box-shadow: 0 4px 16px -4px rgba(122,154,130,0.45);
        }
        .po-btn-primary:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px -4px rgba(122,154,130,0.55);
        }
        .po-btn-ghost {
          border: 1.5px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.88);
          backdrop-filter: blur(8px);
        }
        .po-btn-ghost:hover {
          border-color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.18);
          transform: translateY(-2px);
        }

        /* ===== 各模块通用 ===== */
        .po-section {
          padding: 120px 0;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .po-section-last { border-bottom: 1px solid rgba(255,255,255,0.08); }
        .po-section-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 48px;
        }
        .po-section-heading {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(28px, 4vw, 36px); font-weight: 600;
          color: #4a4038; margin: 0 0 80px;
          letter-spacing: 0.06em;
          text-shadow: 0 1px 4px rgba(255,255,255,0.5);
        }

        /* ===== 关于我：纯文字左右布局 ===== */
        .po-about-left {
          display: flex; flex-direction: column; gap: 48px;
          margin-bottom: 60px;
        }
        .po-about-right {
          display: flex; flex-direction: column; gap: 48px;
        }
        @media (min-width: 768px) {
          .po-section-inner > .po-about-left,
          .po-section-inner > .po-about-right {
            flex-direction: row; gap: 80px;
          }
          .po-about-left > * { flex: 1; }
          .po-about-right > * { flex: 1; }
        }

        /* 漂浮文字块：半透明浅色背景 + 内边距 */
        .po-text-block {
          position: relative;
          padding: 28px 24px;
          background: rgba(255, 252, 245, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .po-text-block::after {
          display: none;
        }

        /* 标题：浅米色，更强阴影 */
        .po-block-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(17px, 2.2vw, 20px); font-weight: 600;
          color: #4a4038; margin: 0 0 14px;
          letter-spacing: 0.04em;
          text-shadow: 0 1px 4px rgba(255,255,255,0.6);
        }
        /* 正文：深灰白，更强阴影 */
        .po-block-body {
          font-size: 13px; line-height: 2; color: #5a5248;
          margin: 0 0 8px;
          text-shadow: 0 1px 3px rgba(255,255,255,0.5);
          letter-spacing: 0.02em;
        }
        .po-block-meta {
          font-size: 12px; color: #7a9a6a; margin: 0;
          letter-spacing: 0.05em;
        }
        .po-edu-item {
          display: flex; flex-direction: column; gap: 4px;
          padding-left: 16px;
          border-left: 2px solid rgba(122,154,130,0.5);
        }
        .po-edu-school { font-size: 15px; font-weight: 500; color: #4a4038; }
        .po-edu-degree { font-size: 13px; color: #7a7268; }

        /* 技能标签 */
        .po-skill-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
        .po-skill-tag {
          padding: 6px 14px; font-size: 13px;
          border-radius: 999px;
          background: rgba(122,154,130,0.15);
          border: 1px solid rgba(122,154,130,0.3);
          color: #5a7a5a;
          cursor: default;
          text-shadow: 0 1px 3px rgba(255,255,255,0.6);
        }

        /* 宣言引言：数字造物场 — 背景水印风格 */
        .po-quote {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(20px, 2.5vw, 26px); font-weight: 700;
          color: #6a8a6a; margin: 0 0 16px;
          line-height: 1.45; letter-spacing: 0.03em;
          opacity: 0.75;
          text-shadow: 0 2px 8px rgba(255,255,255,0.7);
        }

        /* ===== 项目集 ===== */
        .po-leafbook-wrap {
          margin-bottom: 80px;
          margin-top: -16px;
          display: flex; flex-direction: column; align-items: center; gap: 28px;
        }
        .po-leafbook-sub {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 14px; color: #7a7268;
          margin: 0; text-shadow: 0 1px 4px rgba(255,255,255,0.5);
          letter-spacing: 0.03em;
        }
        .po-mickey-wrap {
          display: flex; flex-direction: column; align-items: center;
          gap: 16px; text-align: center;
          padding-bottom: 32px;
          position: relative;
        }
        .po-mickey-wrap::after {
          display: none;
        }
        .po-mickey-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(20px, 3vw, 26px); font-weight: 600;
          color: #4a4038; margin: 0;
          letter-spacing: 0.05em;
          text-shadow: 0 1px 4px rgba(255,255,255,0.6);
        }

        /* 幽灵按钮：投影 + hover变色 */
        .po-btn-ghost {
          border: 1.5px solid rgba(122,154,130,0.4);
          background: rgba(255,255,255,0.15);
          color: #6a8a6a;
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .po-btn-ghost:hover {
          border-color: rgba(122,154,130,0.7);
          background: rgba(122,154,130,0.18);
          color: #4a6a4a;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        /* 页脚 */
        .po-footer {
          padding: 40px 24px; text-align: center;
        }
        .po-footer p { margin: 0; font-size: 13px; color: rgba(255,255,255,0.3); }
        .po-footer p + p { margin-top: 4px; }

        /* ===== 响应式 ===== */
        @media (max-width: 768px) {
          .po-section { padding: 80px 0; }
          .po-section-inner { padding: 0 24px; }
          .po-section-heading { margin-bottom: 48px; }
          .po-about-left { gap: 32px; margin-bottom: 40px; }
          .po-about-right { gap: 32px; }
          .po-leafbook-wrap { margin-bottom: 60px; }
          .po-text-block { padding: 20px 18px; }
        }
      `})]})},Ux=()=>s.jsx(B6,{children:s.jsx(e8,{})}),t8=[{dimension:"身",title:"森林疗愈室",value:"生理调节"},{dimension:"心",title:"系统调频 + 回血清单",value:"情绪修复"},{dimension:"行",title:"通关清单",value:"执行力"},{dimension:"知",title:"妙妙工具箱",value:"认知与求知欲"},{dimension:"游",title:"漫游指南",value:"探索与规划"},{dimension:"术",title:"万能百事通",value:"效率与工具"},{dimension:"管",title:"物资管家",value:"资源管理与反"},{dimension:"感",title:"解压馆",value:"触觉发泄"},{dimension:"魂",title:"时光博物馆",value:"自我认知"}],Vx=[{bg:"rgba(122,154,130,0.14)",fg:"#5d8a6a"},{bg:"rgba(196,143,143,0.16)",fg:"#b06a6a"},{bg:"rgba(196,163,107,0.16)",fg:"#a8814a"},{bg:"rgba(120,138,168,0.16)",fg:"#5f76a0"},{bg:"rgba(106,158,150,0.16)",fg:"#4d8a82"},{bg:"rgba(150,135,178,0.16)",fg:"#7e6aa3"},{bg:"rgba(178,150,106,0.16)",fg:"#9a7d4a"},{bg:"rgba(196,138,118,0.16)",fg:"#b06f55"},{bg:"rgba(150,120,150,0.16)",fg:"#8a5f8a"}],a8=()=>{const a=cs(),[i]=wl(),o=i.get("from")==="full",l=o?"/?mode=full":"/",c=o?"?from=full":"",f=p=>{if(p==="森林疗愈室"){a(`/healing${c}`);return}if(p==="物资管家"){a(`/toolbox/inventory${c}`);return}if(p==="万能百事通"){a(`/toolbox/advice${c}`);return}a(`/toolbox/${encodeURIComponent(p)}${c}`)};return s.jsxs("div",{className:"toolbox-page",children:[s.jsxs("header",{className:"toolbox-topbar",children:[s.jsx(rt,{to:l,className:"toolbox-back",children:"← 回到妙妙工具箱"}),s.jsx("span",{className:"toolbox-topbar-meta",children:"数字造物场"})]}),s.jsxs("section",{className:"toolbox-hero",children:[s.jsx(X.p,{className:"toolbox-eyebrow",initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.5},children:"Miaomiao Toolbox"}),s.jsx(X.h1,{className:"toolbox-title",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6,delay:.05},children:"妙妙工具箱"}),s.jsx(X.p,{className:"toolbox-subtitle",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6,delay:.12},children:"我的第一个数字造物场 · 覆盖生活的 9 个维度"})]}),s.jsx("section",{className:"toolbox-grid",children:t8.map((p,m)=>{const h=Vx[m]??Vx[0];return s.jsxs(X.button,{type:"button",className:"tool-card",initial:{opacity:0,y:22},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-40px"},transition:{duration:.5,delay:m%3*.08+Math.floor(m/3)*.05,ease:"easeOut"},whileHover:{y:-6},onClick:()=>f(p.title),"aria-label":`打开 ${p.title}`,children:[s.jsx("span",{className:"tool-card-no",children:String(m+1).padStart(2,"0")}),s.jsx("span",{className:"tool-card-dimension",style:{background:h.bg,color:h.fg},children:p.dimension}),s.jsx("span",{className:"tool-card-title",children:p.title}),s.jsx("span",{className:"tool-card-value",children:p.value})]},p.title)})}),s.jsxs("footer",{className:"toolbox-foot",children:[s.jsx("span",{children:"九个维度，一座造物场"}),s.jsx("span",{className:"toolbox-foot-dot",children:"·"}),s.jsx("span",{children:"持续生长中"})]})]})},n8=()=>{const{title:a}=G5(),i=cs(),o=a||"未知作品",[l]=wl(),c=l.get("from")==="full"?"?from=full":"";return s.jsxs("div",{className:"toolbox-page",children:[s.jsxs("header",{className:"toolbox-topbar",children:[s.jsx("button",{className:"toolbox-back",onClick:()=>i(-1),children:"← 回到妙妙工具箱"}),s.jsx("span",{className:"toolbox-topbar-meta",children:"造物详情"})]}),s.jsxs("section",{className:"detail-hero",children:[s.jsx(X.p,{className:"toolbox-eyebrow",initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.5},children:"Miaomiao Toolbox"}),s.jsx(X.h1,{className:"toolbox-title",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6,delay:.05},children:o}),s.jsxs(X.div,{className:"detail-status",initial:{opacity:0},animate:{opacity:1},transition:{duration:.6,delay:.2},children:[s.jsx("span",{className:"detail-status-dot"}),"正在建造中"]})]}),s.jsxs(X.section,{className:"detail-card",initial:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{duration:.6,delay:.25},children:[s.jsxs("p",{className:"detail-placeholder-text",children:["这里将是「",o,"」的专属空间。维度的内容正在一笔一笔手写中，敬请期待。"]}),s.jsx(rt,{to:`/toolbox${c}`,className:"detail-back-link",children:"← 回到工具箱"})]})]})},d1=["瓶","盒","袋","罐","箱","个","支"],f1=["冰箱","浴室","储物间","厨房","客厅","卧室"],p1="inventory_items",i8=30;function qo(...a){return a.filter(Boolean).join(" ")}function r8(){return typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,8)}`}function s8(){try{const a=localStorage.getItem(p1);if(!a)return[];const i=JSON.parse(a);return Array.isArray(i)?i:[]}catch{return[]}}function Ho(a,i){const o=new Date(`${a}T00:00:00`);return Number.isNaN(o.getTime())?1/0:Math.round((o.getTime()-i.getTime())/864e5)}function _x(a){return a<0?"expired":a<=i8?"expiring":"sufficient"}function o8(a){return a<0?`已过期 ${Math.abs(a)} 天`:a===0?"今天到期":`还剩 ${a} 天`}function l8(a){return a<=0?"expired":a<=30?"warning":"safe"}const c8={expired:"#E53935",warning:"#FF9800",safe:"#81C784"},u8=[{key:"expired",label:"已过期",emoji:"🔴",dot:"bg-red-400",active:"bg-red-50 border-red-300 text-red-600",idle:"bg-white border-gray-200 text-gray-600 hover:border-red-200"},{key:"expiring",label:"临期·30天内",emoji:"🟠",dot:"bg-amber-400",active:"bg-amber-50 border-amber-300 text-amber-700",idle:"bg-white border-gray-200 text-gray-600 hover:border-amber-200"},{key:"sufficient",label:"库存充足",emoji:"🟢",dot:"bg-emerald-400",active:"bg-emerald-50 border-emerald-300 text-emerald-700",idle:"bg-white border-gray-200 text-gray-600 hover:border-emerald-200"}],d8=({item:a,onSave:i,onClose:o})=>{const[l,c]=j.useState({name:a.name,count:a.count,unit:a.unit,expiryDate:a.expiryDate,location:a.location}),f=l.name.trim().length>0&&l.count>=1&&l.expiryDate.length>0,p=()=>{f&&i({...a,name:l.name.trim(),count:l.count,unit:l.unit,expiryDate:l.expiryDate,location:l.location})};return s.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4",onClick:o,children:s.jsxs("div",{className:"w-full max-w-md rounded-2xl bg-white p-6 shadow-xl",onClick:m=>m.stopPropagation(),children:[s.jsx("h3",{className:"mb-4 text-lg font-semibold text-gray-800",children:"编辑物品"}),s.jsxs("div",{className:"space-y-4",children:[s.jsxs("div",{children:[s.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"物品名称"}),s.jsx("input",{type:"text",value:l.name,onChange:m=>c(h=>({...h,name:m.target.value})),className:"w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"})]}),s.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[s.jsxs("div",{children:[s.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"数量"}),s.jsx("input",{type:"number",min:1,value:l.count,onChange:m=>c(h=>({...h,count:Math.max(1,Number(m.target.value)||1)})),className:"w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"})]}),s.jsxs("div",{children:[s.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"单位"}),s.jsx("select",{value:l.unit,onChange:m=>c(h=>({...h,unit:m.target.value})),className:"w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]",children:d1.map(m=>s.jsx("option",{value:m,children:m},m))})]})]}),s.jsxs("div",{children:[s.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"到期日"}),s.jsx("input",{type:"date",value:l.expiryDate,onChange:m=>c(h=>({...h,expiryDate:m.target.value})),className:"w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]"})]}),s.jsxs("div",{children:[s.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"存放位置"}),s.jsx("select",{value:l.location,onChange:m=>c(h=>({...h,location:m.target.value})),className:"w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a]",children:f1.map(m=>s.jsx("option",{value:m,children:m},m))})]})]}),s.jsxs("div",{className:"mt-6 flex gap-3",children:[s.jsx("button",{onClick:o,className:"flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50",children:"取消"}),s.jsx("button",{onClick:p,disabled:!f,className:"flex-1 rounded-lg bg-[#5d8a6a] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4d7a5a] disabled:cursor-not-allowed disabled:opacity-50",children:"保存修改"})]})]})})},qx=()=>{const[a,i]=j.useState(()=>s8()),[o,l]=j.useState("all"),[c,f]=j.useState(new Set),[p,m]=j.useState(null),[h]=wl(),g=h.get("from")==="full"?"?from=full":"",[b,y]=j.useState({name:"",count:1,unit:"瓶",expiryDate:"",location:"冰箱"});j.useEffect(()=>{try{localStorage.setItem(p1,JSON.stringify(a))}catch{}},[a]);const x=j.useMemo(()=>{const R=new Date;return R.setHours(0,0,0,0),R},[]),w=j.useMemo(()=>{let R=0,B=0,_=0;return a.forEach(W=>{const ne=_x(Ho(W.expiryDate,x));ne==="expired"?R++:ne==="expiring"?B++:_++}),{expired:R,expiring:B,sufficient:_}},[a,x]),S=j.useMemo(()=>o==="all"?a:a.filter(R=>_x(Ho(R.expiryDate,x))===o),[a,o,x]),N=j.useMemo(()=>a.length===0?null:[...a].sort((R,B)=>R.expiryDate.localeCompare(B.expiryDate))[0],[a]),C=b.name.trim().length>0&&b.count>=1&&b.expiryDate.length>0,T=()=>{if(!C)return;const R={id:r8(),name:b.name.trim(),count:b.count,unit:b.unit,expiryDate:b.expiryDate,location:b.location};i(B=>[R,...B]),y(B=>({...B,name:""}))},z=R=>{i(B=>B.map(_=>_.id===R.id?R:_)),m(null)},E=R=>{f(B=>new Set(B).add(R)),window.setTimeout(()=>{i(B=>B.filter(_=>_.id!==R)),f(B=>{const _=new Set(B);return _.delete(R),_})},300)},A=N?Ho(N.expiryDate,x):1/0;return s.jsxs("div",{className:"inventory-page min-h-screen bg-gray-50 text-gray-800",children:[p&&s.jsx(d8,{item:p,onSave:z,onClose:()=>m(null)}),s.jsx("header",{className:"border-b border-gray-200 bg-white",children:s.jsxs("div",{className:"mx-auto flex max-w-6xl items-center justify-between px-6 py-4",children:[s.jsx(rt,{to:`/mickey${g}`,className:"text-sm text-gray-500 transition-colors hover:text-[#5d8a6a]",children:"← 妙妙工具箱"}),s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("span",{className:"h-2 w-2 rounded-full bg-[#5d8a6a]"}),s.jsx("span",{className:"text-xs uppercase tracking-[0.2em] text-gray-400",children:"Inventory Prophet"})]})]})}),s.jsxs("div",{className:"mx-auto max-w-6xl px-6 pb-6 pt-8",children:[s.jsx("h1",{className:"text-2xl font-semibold text-gray-900",children:"物资管家"}),s.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"资源管理与反浪费 · 把每一件物品用在它最好的时候"})]}),s.jsxs("div",{className:"mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-[340px_1fr] lg:items-start",children:[s.jsxs("aside",{className:"space-y-6 lg:sticky lg:top-6",children:[s.jsxs("section",{className:"rounded-xl border border-gray-200 bg-white p-5",children:[s.jsxs("h2",{className:"mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700",children:[s.jsx("span",{className:"h-1 w-4 rounded-full bg-[#5d8a6a]"}),"入库登记"]}),s.jsxs("div",{className:"space-y-3",children:[s.jsxs("div",{children:[s.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"物品名称"}),s.jsx("input",{type:"text",value:b.name,placeholder:"如：洗衣液",onChange:R=>y(B=>({...B,name:R.target.value})),className:"w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30"})]}),s.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[s.jsxs("div",{children:[s.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"数量"}),s.jsx("input",{type:"number",min:1,value:b.count,onChange:R=>y(B=>({...B,count:Math.max(1,Number(R.target.value)||1)})),className:"w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30"})]}),s.jsxs("div",{children:[s.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"单位"}),s.jsx("select",{value:b.unit,onChange:R=>y(B=>({...B,unit:R.target.value})),className:"w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30",children:d1.map(R=>s.jsx("option",{value:R,children:R},R))})]})]}),s.jsxs("div",{children:[s.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"到期日"}),s.jsx("input",{type:"date",value:b.expiryDate,onChange:R=>y(B=>({...B,expiryDate:R.target.value})),className:"w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30"})]}),s.jsxs("div",{children:[s.jsx("label",{className:"mb-1 block text-xs text-gray-500",children:"存放位置"}),s.jsx("select",{value:b.location,onChange:R=>y(B=>({...B,location:R.target.value})),className:"w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#5d8a6a] focus:ring-1 focus:ring-[#5d8a6a]/30",children:f1.map(R=>s.jsx("option",{value:R,children:R},R))})]}),s.jsx("button",{type:"button",onClick:T,disabled:!C,className:"w-full rounded-lg bg-[#5d8a6a] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4d7a5a] disabled:cursor-not-allowed disabled:opacity-50",children:"确认入库"})]})]}),s.jsxs("section",{className:"rounded-xl border border-gray-200 bg-white p-5",children:[s.jsxs("h2",{className:"mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700",children:[s.jsx("span",{className:"h-1 w-4 rounded-full bg-amber-400"}),"赏味期限"]}),N?(()=>{const R=A<=30;return s.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"12px 0"},children:[s.jsxs("p",{style:{fontSize:12,fontWeight:500,textAlign:"center",background:"rgba(255,255,255,0.6)",borderRadius:20,padding:"6px 14px",color:R?"#D46B4D":"#557C55"},children:[R?"🔥":"🍃"," ",R?"赏味期限将至，宜趁鲜启用。":"余量丰盈，且容它静候时光。"]}),s.jsxs("p",{style:{fontSize:13,color:"#6B7280",textAlign:"center"},children:[N.name," · ",N.count,N.unit]}),s.jsx("button",{type:"button",onClick:()=>E(N.id),style:{fontSize:12,fontWeight:500,padding:"6px 18px",border:`1.5px solid ${R?"#D46B4D":"#557C55"}`,borderRadius:999,background:"transparent",color:R?"#D46B4D":"#557C55",cursor:"pointer",transition:"all 0.2s"},children:R?"立即消耗":"留着以后"})]})})():s.jsx("p",{className:"text-sm text-gray-400",children:"暂无物品。先在上方入库，我来帮你规划。"})]})]}),s.jsxs("main",{className:"min-w-0 space-y-6",children:[s.jsxs("section",{className:"flex flex-wrap items-center gap-3",children:[u8.map(R=>{const B=w[R.key],_=o===R.key;return s.jsxs("button",{type:"button",onClick:()=>l(W=>W===R.key?"all":R.key),className:qo("flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",_?R.active:R.idle),children:[s.jsx("span",{className:qo("h-2 w-2 rounded-full",R.dot)}),s.jsx("span",{children:R.emoji}),R.label,s.jsx("span",{className:"font-semibold",children:B})]},R.key)}),o!=="all"&&s.jsx("button",{type:"button",onClick:()=>l("all"),className:"self-center text-xs text-gray-400 transition-colors hover:text-gray-600",children:"显示全部"})]}),s.jsxs("section",{className:"overflow-hidden rounded-xl border border-gray-200 bg-white",children:[s.jsxs("div",{className:"flex items-center justify-between border-b border-gray-100 px-5 py-3",children:[s.jsx("h2",{className:"text-sm font-semibold text-gray-700",children:"库存列表"}),s.jsxs("span",{className:"text-xs text-gray-400",children:["共 ",S.length," 件"]})]}),S.length===0?s.jsx("div",{className:"py-16 text-center",children:s.jsx("p",{className:"text-sm text-gray-400",children:a.length===0?"还没有任何物品，去左侧入库吧。":"当前筛选下没有物品。"})}):s.jsx("div",{className:"overflow-x-auto",children:s.jsxs("table",{className:"w-full border-collapse text-sm",children:[s.jsx("thead",{children:s.jsxs("tr",{className:"border-b border-gray-100 text-left text-xs text-gray-400",children:[s.jsx("th",{className:"px-5 py-3 font-medium",children:"物品"}),s.jsx("th",{className:"px-5 py-3 font-medium",children:"数量"}),s.jsx("th",{className:"px-5 py-3 font-medium",children:"到期日"}),s.jsx("th",{className:"px-5 py-3 font-medium",children:"存放位置"}),s.jsx("th",{className:"px-5 py-3 text-right font-medium",children:"操作"})]})}),s.jsx("tbody",{children:S.map(R=>{const B=Ho(R.expiryDate,x),_=l8(B),W=c8[_];return s.jsxs("tr",{className:qo("border-b border-gray-50 transition-opacity duration-300 stock-item",c.has(R.id)&&"opacity-0"),style:{borderLeft:`4px solid ${W}`},children:[s.jsx("td",{className:"px-5 py-3",children:s.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[s.jsx("span",{className:qo("font-medium",_==="expired"?"text-red-600":"text-gray-800"),children:R.name}),_==="expired"&&s.jsx("span",{style:{fontSize:10,padding:"2px 6px",borderRadius:999,background:"rgba(229,57,53,0.1)",color:"#E53935",fontWeight:500},children:"已过期"})]})}),s.jsxs("td",{className:"px-5 py-3 text-gray-600",children:[R.count," ",R.unit]}),s.jsxs("td",{className:"px-5 py-3",children:[s.jsx("span",{style:{color:W,fontWeight:500},children:R.expiryDate}),s.jsxs("span",{className:"ml-2 text-xs text-gray-400",children:["(",o8(B),")"]})]}),s.jsx("td",{className:"px-5 py-3 text-gray-600",children:R.location}),s.jsxs("td",{className:"px-5 py-3 text-right",children:[s.jsx("button",{type:"button",onClick:()=>m(R),className:"mr-3 text-xs text-gray-400 transition-colors hover:text-[#5d8a6a]",children:"编辑"}),s.jsx("button",{type:"button",onClick:()=>E(R.id),className:"text-xs text-gray-400 transition-colors hover:text-red-500",children:"删除"})]})]},R.id)})})]})})]})]})]})]})},f8={脑洞:{name:"小波",emoji:"🎲"},心灵:{name:"浪矢爷爷",emoji:"💌"},工作:{name:"敦也",emoji:"💼"},情感:{name:"晴美",emoji:"🌸"}},p8=[{key:"心灵",emoji:"🌿",label:"心灵"},{key:"脑洞",emoji:"🧠",label:"脑洞"},{key:"工作",emoji:"💼",label:"工作"},{key:"情感",emoji:"❤️",label:"情感"}],h8={心灵:["你不需要时时刻刻都坚强。允许自己偶尔脆弱，那才是完整的你。","现在的迷茫，只是因为你正在生长。树在扎根时，地面上是看不出变化的。","你已经在很努力地生活了，这份努力本身，就值得被肯定。","累的时候，就停下来抱抱自己。你不是机器，你是会呼吸的生命。"],脑洞:["那些天马行空的想法，不是胡思乱想，是你独特的感知世界的方式。","脑洞大的人，往往看见了别人看不见的可能性。别收起你的好奇心。","如果全世界都很正常，那该多无聊。谢谢你的不一样。"],工作:["努力了没有结果，不代表努力没有意义。它只是换了一种方式，存在你身上。","你可以慢一点。马拉松不是冲刺，找到自己的节奏比追上别人更重要。","先完成，再完美。你已经迈出了最难的第一步——开始。","工作的意义不是证明自己，而是照顾自己。别本末倒置了。"],情感:["被理解是幸运，不被理解是常态。但请相信，总有人愿意倾听你。","你值得被温柔对待。如果暂时还没遇到，请先温柔地对待自己。","关系的尽头不是失败，是你们互相教会了彼此一些东西，然后各自上路。","想念一个人的时候，不必压抑。情绪需要出口，而不是锁。"]},m8=["谢谢你愿意把心里的疑惑写下来。能说出来，本身就是一种勇敢。","我没办法给你标准答案，但我想告诉你：你的感受是真实的，是合理的。","慢慢来，答案不是想出来的，是走着走着，自己浮现的。"];function g8(a,i){const o=i?h8[i]:m8,l=a.length+i.charCodeAt(0);return o[l%o.length]}const bd={brain:"脑洞",heart:"心灵",work:"工作",emotion:"情感"},Hx={brain:"小波",heart:"浪矢爷爷",work:"敦也",emotion:"晴美"},x8=()=>{const[a,i]=j.useState(""),[o,l]=j.useState(null),[c,f]=j.useState(null),[p,m]=j.useState(!1),[h,g]=j.useState(null),[b,y]=j.useState(null),x=j.useRef(null),w=async()=>{var z,E;if(!a.trim())return;(z=x.current)==null||z.abort();const N=new AbortController;x.current=N;const C={脑洞:"brain",心灵:"heart",工作:"work",情感:"emotion"};let T;if(o)T=C[o]||"heart";else{const A=a.toLowerCase();A.includes("焦虑")||A.includes("迷茫")||A.includes("难过")||A.includes("伤心")||A.includes("孤独")||A.includes("害怕")?T="heart":A.includes("工作")||A.includes("老板")||A.includes("效率")||A.includes("项目")||A.includes("加班")||A.includes("面试")?T="work":A.includes("想法")||A.includes("脑洞")||A.includes("奇怪")||A.includes("有趣")||A.includes("如果")||A.includes("为什么")?T="brain":T="emotion",y(T),l(bd[T]||"心灵")}g(`${((E=f8[bd[T]||"心灵"])==null?void 0:E.emoji)||""} ${Hx[T]||"浪矢爷爷"}`);{m(!0);const A=bd[T]||"心灵";window.setTimeout(()=>{f(g8(a,A)),m(!1)},900);return}},S=j.useMemo(()=>["夜安，旅人。","嘿，我在听。","别急，慢慢说。"][a.length%3],[a.length]);return s.jsxs("div",{className:"advice-page",children:[s.jsxs("header",{className:"advice-topbar",children:[s.jsx(rt,{to:"/mickey",className:"advice-back",children:"← 回到妙妙工具箱"}),s.jsx("span",{className:"advice-topbar-meta",children:"The Advice Shop"})]}),s.jsxs("section",{className:"advice-hero",children:[s.jsx(X.div,{className:"advice-lantern",animate:{y:[0,-6,0]},transition:{duration:3,repeat:1/0,ease:"easeInOut"},children:"🕯️"}),s.jsx(X.h1,{className:"advice-title",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6},children:"解忧杂货铺"}),s.jsx(X.p,{className:"advice-subtitle",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6,delay:.12},children:"总有一句话，能解开你的心结。"})]}),s.jsxs(X.section,{className:"advice-letter",initial:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{duration:.6,delay:.2},children:[s.jsx("p",{className:"advice-letter-greeting",children:S}),s.jsx("textarea",{className:"advice-input",placeholder:"写下你的疑惑…（比如：为什么努力了还是没结果？）",value:a,rows:4,onChange:N=>i(N.target.value),onKeyDown:N=>{N.key==="Enter"&&(N.metaKey||N.ctrlKey)&&w()}}),s.jsx("div",{className:"advice-tags",children:p8.map(N=>s.jsxs("button",{type:"button",className:o===N.key?"advice-tag advice-tag-active":"advice-tag",onClick:()=>{l(C=>C===N.key?null:N.key),f(null),g(null)},children:[s.jsx("span",{children:N.emoji}),N.label]},N.key))}),s.jsx("button",{type:"button",className:"advice-submit",onClick:w,disabled:!a.trim()||p,children:p?"正在写信…":"投递信件 ✉"})]}),s.jsx(Ne,{children:p&&s.jsxs(X.div,{className:"advice-reply-loading",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:[s.jsx(X.span,{className:"advice-quill",animate:{rotate:[-3,3,-3]},transition:{duration:1.2,repeat:1/0},children:"✒️"}),s.jsx("span",{className:"advice-reply-loading-text",children:"杂货店老板正在回信…"})]})}),s.jsx(Ne,{children:c&&!p&&s.jsxs(X.section,{className:"advice-reply",initial:{opacity:0,y:40},animate:{opacity:1,y:0},exit:{opacity:0,y:20},transition:{duration:.7,ease:"easeOut"},children:[s.jsx("div",{className:"advice-reply-stamp",children:"已送达"}),s.jsx("p",{className:"advice-reply-greeting",children:"亲爱的旅人："}),b&&s.jsxs("p",{className:"advice-reply-detect",children:["自动分类 → ",Hx[b]||b]}),h&&s.jsxs("p",{className:"advice-reply-role",children:[h," 回信"]}),s.jsx("p",{className:"advice-reply-text",children:c}),s.jsx("p",{className:"advice-reply-sign",children:"—— 杂货店老板 · 灯下"}),s.jsx("button",{type:"button",className:"advice-again",onClick:()=>{f(null),i("")},children:"再写一封"})]})}),s.jsx("style",{children:`
        .advice-page,
        .advice-page * { cursor: auto; }
        .advice-page button,
        .advice-page a { cursor: pointer; }
        .advice-page textarea { cursor: text; }

        .advice-page {
          min-height: 100vh;
          color: #4a4036;
          background-color: #faf6ee;
          background-image:
            radial-gradient(120% 60% at 50% -5%, rgba(255, 220, 160, 0.25) 0%, rgba(255, 220, 160, 0) 50%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 80px;
        }

        /* 顶部 */
        .advice-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 680px; margin: 0 auto; padding: 26px 4px 0;
        }
        .advice-back {
          font-size: 14px; color: #9a8a72; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .advice-back:hover { color: #c8924a; transform: translateX(-3px); }
        .advice-topbar-meta {
          font-size: 11px; color: #b8aa92; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 标题区 */
        .advice-hero {
          max-width: 680px; margin: 0 auto; padding: 48px 4px 36px; text-align: center;
        }
        .advice-lantern { font-size: 40px; margin-bottom: 16px; filter: drop-shadow(0 0 12px rgba(255, 168, 76, 0.5)); }
        .advice-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(28px, 4.5vw, 38px); font-weight: 600;
          color: #5a4632; margin: 0 0 12px; letter-spacing: 0.06em;
        }
        .advice-subtitle { font-size: 15px; color: #9a8a72; margin: 0; letter-spacing: 0.05em; }

        /* 信纸 */
        .advice-letter {
          max-width: 680px; margin: 0 auto; padding: 36px 36px 32px;
          background: #fffdf6;
          border: 1px solid #ece2cf;
          border-radius: 14px;
          box-shadow: 0 12px 40px -16px rgba(120, 90, 40, 0.18),
                      0 1px 3px rgba(120, 90, 40, 0.06);
          background-image: repeating-linear-gradient(
            transparent, transparent 31px, rgba(180, 150, 100, 0.12) 32px
          );
        }
        .advice-letter-greeting {
          font-family: "Noto Serif SC", serif; font-size: 15px; color: #b89968;
          margin: 0 0 16px; letter-spacing: 0.05em;
        }
        .advice-input {
          width: 100%; border: none; resize: none; outline: none;
          background: transparent; font-family: inherit;
          font-size: 16px; line-height: 32px; color: #4a4036;
          letter-spacing: 0.02em;
        }
        .advice-input::placeholder { color: #c9bda8; }

        /* 标签 */
        .advice-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
        .advice-tag {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 14px; border-radius: 999px;
          font-size: 13px; color: #9a8a72;
          background: rgba(200, 146, 74, 0.06);
          border: 1px solid #ece2cf;
          transition: all 0.25s ease;
        }
        .advice-tag:hover { border-color: #c8924a; color: #c8924a; }
        .advice-tag-active {
          background: rgba(200, 146, 74, 0.15);
          border-color: #c8924a; color: #b07832; font-weight: 500;
        }

        /* 投递按钮 */
        .advice-submit {
          display: block; width: 100%; margin-top: 24px;
          padding: 12px; border: none; border-radius: 10px;
          font-size: 15px; font-family: inherit; letter-spacing: 0.08em;
          color: #fff;
          background: linear-gradient(135deg, #c8924a, #b07832);
          box-shadow: 0 6px 20px -6px rgba(176, 120, 50, 0.5);
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }
        .advice-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 26px -6px rgba(176, 120, 50, 0.6);
        }
        .advice-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* 回信加载 */
        .advice-reply-loading {
          max-width: 680px; margin: 28px auto 0; text-align: center;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .advice-quill { font-size: 22px; display: inline-block; }
        .advice-reply-loading-text { font-size: 14px; color: #b89968; letter-spacing: 0.05em; }

        /* 回信卡片 */
        .advice-reply {
          position: relative; max-width: 680px; margin: 28px auto 0;
          padding: 36px 36px 32px;
          background: #fffaf0;
          border: 1px solid #ecd9b8;
          border-radius: 14px;
          box-shadow: 0 16px 48px -20px rgba(120, 90, 40, 0.25);
        }
        .advice-reply-stamp {
          position: absolute; top: 20px; right: 24px;
          padding: 4px 12px; border: 1.5px solid #c8924a; border-radius: 4px;
          font-size: 11px; color: #c8924a; letter-spacing: 0.15em;
          transform: rotate(8deg); opacity: 0.8;
        }
        .advice-reply-greeting {
          font-family: "Noto Serif SC", serif; font-size: 15px; color: #b89968;
          margin: 0 0 14px;
        }
        .advice-reply-role {
          font-size: 13px; color: #c8924a; margin: 0 0 16px;
          font-style: italic; letter-spacing: 0.05em;
        }
        .advice-reply-detect {
          font-size: 11px; color: #a89070; margin: 0 0 6px;
          letter-spacing: 0.04em;
        }
        .advice-reply-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 17px; line-height: 2; color: #4a4036;
          margin: 0 0 20px; letter-spacing: 0.03em;
        }
        .advice-reply-sign {
          font-size: 13px; color: #b89968; text-align: right; margin: 0 0 24px;
          font-style: italic;
        }
        .advice-again {
          display: block; margin: 0 auto; padding: 8px 24px;
          border: 1px solid #ecd9b8; border-radius: 999px;
          background: transparent; font-size: 13px; font-family: inherit;
          color: #b07832; letter-spacing: 0.05em;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .advice-again:hover { background: rgba(200, 146, 74, 0.08); border-color: #c8924a; }

        @media (max-width: 520px) {
          .advice-letter, .advice-reply { padding: 28px 22px 26px; }
          .advice-reply-stamp { top: 14px; right: 16px; }
        }
      `})]})},h1="quest_log_data",Go=100,y8={easy:5,normal:60,hard:100},b8={easy:"先做 5 分钟",normal:"只要 60 分",hard:"直接挑战"},Gx={easy:"#4CAF50",normal:"#FFC107",hard:"#F44336"};function nl(...a){return a.filter(Boolean).join(" ")}function v8(){return typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,8)}`}function j8(){try{const a=localStorage.getItem(h1);if(!a)return vd;const i=JSON.parse(a);return Array.isArray(i)?i:vd}catch{return vd}}function S8(){try{const a=localStorage.getItem("quest_log_xp");return a?Math.max(0,Number(a)||0):0}catch{return 0}}const vd=[{id:"q1",text:"读完 10 页书",difficulty:"easy",completed:!1},{id:"q2",text:"搞定周报初稿",difficulty:"hard",completed:!1},{id:"q3",text:"喝一杯水",difficulty:"easy",completed:!0}];let jd=null;const w8=()=>{try{if(!jd){const o=window.AudioContext||window.webkitAudioContext;jd=new o}const a=jd,i=a.currentTime;[{f:988,t:0},{f:1319,t:.08}].forEach(({f:o,t:l})=>{const c=a.createOscillator(),f=a.createGain();c.type="square",c.frequency.value=o,f.gain.setValueAtTime(.18,i+l),f.gain.exponentialRampToValueAtTime(1e-4,i+l+.18),c.connect(f),f.connect(a.destination),c.start(i+l),c.stop(i+l+.18)})}catch{}},Yx=["#f472b6","#60a5fa","#fde047","#34d399","#c084fc"],k8=({xp:a})=>{const i=Math.floor(a/Go)+1,o=a%Go,l=o/Go*100;return s.jsxs("div",{className:"quest-xp-wrap",children:[s.jsxs("div",{className:"quest-xp-head",children:[s.jsxs("span",{className:"quest-level-badge",children:["Lv.",i]}),s.jsxs("span",{className:"quest-xp-text",children:[o," / ",Go," XP"]})]}),s.jsx("div",{className:"quest-xp-track",children:s.jsx(X.div,{className:"quest-xp-fill",initial:!1,animate:{width:`${l}%`},transition:{type:"spring",stiffness:120,damping:14}})})]})},N8=({quest:a,onSave:i,onClose:o})=>{const[l,c]=j.useState(a.text),[f,p]=j.useState(a.difficulty),m=l.trim().length>0,h=()=>{m&&i({...a,text:l.trim(),difficulty:f})};return s.jsx(X.div,{className:"quest-modal-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:o,children:s.jsxs(X.div,{className:"quest-modal quest-edit-modal",initial:{scale:.85,y:30},animate:{scale:1,y:0},exit:{scale:.85,y:30},transition:{type:"spring",stiffness:200,damping:18},onClick:g=>g.stopPropagation(),children:[s.jsx("h3",{className:"quest-modal-title",children:"编辑任务"}),s.jsxs("div",{className:"quest-edit-form",children:[s.jsxs("div",{className:"quest-edit-field",children:[s.jsx("label",{className:"quest-edit-label",children:"任务描述"}),s.jsx("input",{type:"text",value:l,onChange:g=>c(g.target.value),className:"quest-edit-input",placeholder:"输入任务内容...",autoFocus:!0})]}),s.jsxs("div",{className:"quest-edit-field",children:[s.jsx("label",{className:"quest-edit-label",children:"挑战等级"}),s.jsxs("div",{className:"quest-edit-difficulty",children:[s.jsxs("button",{type:"button",className:nl("quest-edit-diff-btn",f==="easy"&&"quest-edit-diff-btn-active"),style:f==="easy"?{borderColor:"#4CAF50",background:"#1B2A22",boxShadow:"0 0 8px #4CAF50",color:"#fff"}:{borderColor:"#4CAF50",background:"transparent",color:"#9ca3af"},onClick:()=>p("easy"),children:[s.jsx("span",{className:"quest-edit-diff-icon",children:"🕒"}),s.jsx("span",{className:"quest-edit-diff-label",children:"先做 5 分钟"}),s.jsx("span",{className:"quest-edit-diff-xp",style:{color:"#4CAF50"},children:"+5分"})]}),s.jsxs("button",{type:"button",className:nl("quest-edit-diff-btn",f==="normal"&&"quest-edit-diff-btn-active"),style:f==="normal"?{borderColor:"#FFC107",background:"#1F2A33",boxShadow:"0 0 8px #FFC107",color:"#fff"}:{borderColor:"#FFC107",background:"transparent",color:"#9ca3af"},onClick:()=>p("normal"),children:[s.jsx("span",{className:"quest-edit-diff-icon",children:"🎯"}),s.jsx("span",{className:"quest-edit-diff-label",children:"只要 60 分"}),s.jsx("span",{className:"quest-edit-diff-xp",style:{color:"#FFC107"},children:"+60分"})]}),s.jsxs("button",{type:"button",className:nl("quest-edit-diff-btn",f==="hard"&&"quest-edit-diff-btn-active"),style:f==="hard"?{borderColor:"#F44336",background:"#2A2222",boxShadow:"0 0 8px #F44336",color:"#fff"}:{borderColor:"#F44336",background:"transparent",color:"#9ca3af"},onClick:()=>p("hard"),children:[s.jsx("span",{className:"quest-edit-diff-icon",children:"⚔️"}),s.jsx("span",{className:"quest-edit-diff-label",children:"直接挑战"}),s.jsx("span",{className:"quest-edit-diff-xp",style:{color:"#F44336"},children:"+100分"})]})]})]})]}),s.jsxs("div",{className:"quest-edit-actions",children:[s.jsx("button",{className:"quest-edit-cancel",onClick:o,children:"取消"}),s.jsx("button",{className:"quest-edit-save",onClick:h,disabled:!m,children:"保存"})]})]})})},C8=({quest:a,onComplete:i,onDelete:o,onEdit:l})=>{const[c,f]=j.useState([]),[p,m]=j.useState(!1),[h,g]=j.useState(a.countdown);j.useEffect(()=>{if(a.completed||h===void 0)return;if(h<=0){i(a.id);return}const S=window.setTimeout(()=>g(N=>(N??1)-1),1e3);return()=>window.clearTimeout(S)},[h,a.completed,a.id,i]);const b=()=>{w8();const S=Array.from({length:14},(N,C)=>({id:C,dx:(Math.random()-.5)*180,dy:(Math.random()-.5)*160-40,color:Yx[C%Yx.length]}));f(S),m(!0),window.setTimeout(()=>i(a.id),600)},y=h!==void 0&&!a.completed,x=h!==void 0?Math.floor(h/60):0,w=h!==void 0?h%60:0;return s.jsxs(X.li,{className:nl("quest-item",a.completed&&"quest-item-done"),layout:!0,exit:{opacity:0,x:60,scale:.8,transition:{duration:.35}},children:[s.jsx(Ne,{children:c.map(S=>s.jsx(X.span,{className:"quest-particle",style:{background:S.color},initial:{opacity:1,x:0,y:0,scale:1},animate:{opacity:0,x:S.dx,y:S.dy,scale:.2},transition:{duration:.6,ease:"easeOut"}},S.id))}),s.jsx("span",{className:"quest-diff-tag",style:{color:Gx[a.difficulty],borderColor:Gx[a.difficulty]},children:b8[a.difficulty]}),s.jsxs("span",{className:"quest-text",children:[a.text,y&&s.jsxs("span",{className:"quest-countdown",children:[String(x).padStart(2,"0"),":",String(w).padStart(2,"0")]})]}),s.jsxs("div",{className:"quest-actions",children:[!a.completed&&s.jsx("button",{type:"button",className:"quest-btn-complete",onClick:b,disabled:p,children:"完成"}),!a.completed&&s.jsx("button",{type:"button",className:"quest-btn-edit",onClick:()=>l(a),title:"编辑任务",children:"✏️"}),s.jsx("button",{type:"button",className:"quest-btn-del",onClick:()=>o(a.id),title:"删除任务",children:"🗑️"})]})]})},T8=({text:a,onPick:i})=>s.jsx(X.div,{className:"quest-modal-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>i("direct"),children:s.jsxs(X.div,{className:"quest-modal",initial:{scale:.85,y:30},animate:{scale:1,y:0},exit:{scale:.85,y:30},transition:{type:"spring",stiffness:200,damping:18},onClick:o=>o.stopPropagation(),children:[s.jsx("p",{className:"quest-modal-title",children:"这个任务看起来有点难"}),s.jsxs("p",{className:"quest-modal-sub",children:["「",a,"」"]}),s.jsx("p",{className:"quest-modal-ask",children:"要不要拆解一下？"}),s.jsxs("div",{className:"quest-modal-options",children:[s.jsxs("button",{className:"quest-modal-opt quest-modal-opt-easy",onClick:()=>i("five"),children:[s.jsx("span",{className:"quest-modal-opt-icon",children:"⏱️"}),s.jsxs("div",{className:"quest-modal-opt-content",children:[s.jsx("span",{className:"quest-modal-opt-label",children:"先做 5 分钟"}),s.jsx("span",{className:"quest-modal-opt-desc",children:"倒计时自动完成"})]}),s.jsx("span",{className:"quest-modal-opt-xp quest-modal-opt-xp-green",children:"+5分"})]}),s.jsxs("button",{className:"quest-modal-opt quest-modal-opt-normal",onClick:()=>i("pass"),children:[s.jsx("span",{className:"quest-modal-opt-icon",children:"🎯"}),s.jsxs("div",{className:"quest-modal-opt-content",children:[s.jsx("span",{className:"quest-modal-opt-label",children:"只要 60 分"}),s.jsx("span",{className:"quest-modal-opt-desc",children:"标为及格线，低难度"})]}),s.jsx("span",{className:"quest-modal-opt-xp quest-modal-opt-xp-gold",children:"+60分"})]}),s.jsxs("button",{className:"quest-modal-opt quest-modal-opt-hard",onClick:()=>i("direct"),children:[s.jsx("span",{className:"quest-modal-opt-icon",children:"⚔️"}),s.jsxs("div",{className:"quest-modal-opt-content",children:[s.jsx("span",{className:"quest-modal-opt-label",children:"直接挑战"}),s.jsx("span",{className:"quest-modal-opt-desc",children:"满分完成，原样添加"})]}),s.jsx("span",{className:"quest-modal-opt-xp quest-modal-opt-xp-orange",children:"+100分"})]})]})]})}),E8=()=>{const[a,i]=j.useState(()=>j8()),[o,l]=j.useState(()=>S8()),[c,f]=j.useState(""),[p,m]=j.useState(null),[h,g]=j.useState(null);j.useEffect(()=>{try{localStorage.setItem(h1,JSON.stringify(a))}catch{}},[a]),j.useEffect(()=>{try{localStorage.setItem("quest_log_xp",String(o))}catch{}},[o]);const b=C=>{i(T=>{const z=T.find(E=>E.id===C);return z&&!z.completed&&l(E=>E+y8[z.difficulty]),T.filter(E=>E.id!==C)})},y=C=>{i(T=>T.filter(z=>z.id!==C))},x=C=>{i(T=>T.map(z=>z.id===C.id?C:z)),g(null)},w=()=>{const C=c.trim();C&&(f(""),m(C))},S=C=>{if(!p)return;const T={id:v8(),text:p,difficulty:"hard",completed:!1};C==="five"?(T.difficulty="easy",T.countdown=300,T.text=`${p}（5分钟挑战）`):C==="pass"&&(T.difficulty="normal",T.text=`${p}（及格线）`),i(z=>[T,...z]),m(null)},N=j.useMemo(()=>{const C=a.filter(z=>z.completed).length,T=a.length-C;return{done:C,active:T,total:a.length}},[a]);return s.jsxs("div",{className:"quest-page",children:[s.jsxs("header",{className:"quest-topbar",children:[s.jsx(rt,{to:"/mickey",className:"quest-back",children:"← 回到妙妙工具箱"}),s.jsx("span",{className:"quest-topbar-meta",children:"Quest Log"})]}),s.jsxs("section",{className:"quest-status",children:[s.jsx(k8,{xp:o}),s.jsxs("div",{className:"quest-stats-pills",children:[s.jsxs("span",{className:"quest-pill",children:["⚔️ 进行中 ",N.active]}),s.jsxs("span",{className:"quest-pill quest-pill-done",children:["✓ 已通关 ",N.done]})]})]}),s.jsxs("div",{className:"quest-title-area",children:[s.jsx("h1",{className:"quest-title",children:"通关清单"}),s.jsx("p",{className:"quest-subtitle",children:"把人生变成一场 RPG。"})]}),s.jsx("section",{className:"quest-list-section",children:a.length===0?s.jsxs("div",{className:"quest-empty",children:[s.jsx("span",{className:"quest-empty-icon",children:"🎮"}),s.jsx("p",{children:"还没有任务，输入一个开启冒险吧！"})]}):s.jsx("ul",{className:"quest-list",children:s.jsx(Ne,{children:a.map(C=>s.jsx(C8,{quest:C,onComplete:b,onDelete:y,onEdit:g},C.id))})})}),s.jsxs("div",{className:"quest-input-bar",children:[s.jsx("input",{className:"quest-input",type:"text",placeholder:"输入新任务，按回车开始冒险…",value:c,onChange:C=>f(C.target.value),onKeyDown:C=>{C.key==="Enter"&&w()}}),s.jsx("button",{type:"button",className:"quest-add-btn",onClick:w,disabled:!c.trim(),children:"添加"})]}),s.jsx(Ne,{children:p&&s.jsx(T8,{text:p,onPick:S})}),s.jsx(Ne,{children:h&&s.jsx(N8,{quest:h,onSave:x,onClose:()=>g(null)})}),s.jsx("style",{children:`
        .quest-page,
        .quest-page * { cursor: auto; }
        .quest-page button,
        .quest-page a { cursor: pointer; }
        .quest-page input { cursor: text; }

        .quest-page {
          min-height: 100vh;
          color: #f3f4f6;
          background:
            radial-gradient(120% 80% at 50% -10%, #1f2937 0%, #111827 50%, #0b0f1a 100%);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 20px 120px;
        }

        /* 顶部 */
        .quest-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 720px; margin: 0 auto; padding: 22px 4px 0;
        }
        .quest-back {
          font-size: 14px; color: #9ca3af; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .quest-back:hover { color: #fde047; transform: translateX(-3px); }
        .quest-topbar-meta {
          font-size: 11px; color: #4b5563; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 玩家状态 */
        .quest-status {
          max-width: 720px; margin: 0 auto; padding: 32px 4px 0;
        }
        .quest-xp-wrap { margin-bottom: 14px; }
        .quest-xp-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 8px;
        }
        .quest-level-badge {
          font-weight: 700; font-size: 15px; color: #fde047;
          padding: 2px 10px; border-radius: 6px;
          background: rgba(253, 224, 71, 0.12);
          border: 1px solid rgba(253, 224, 71, 0.3);
        }
        .quest-xp-text { font-size: 12px; color: #9ca3af; letter-spacing: 0.05em; }
        .quest-xp-track {
          height: 10px; border-radius: 999px; overflow: hidden;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.06);
        }
        .quest-xp-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #f472b6, #fde047, #34d399);
          box-shadow: 0 0 12px rgba(253, 224, 71, 0.5);
        }
        .quest-stats-pills { display: flex; gap: 10px; }
        .quest-pill {
          font-size: 12px; color: #d1d5db; padding: 4px 12px; border-radius: 999px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
        }
        .quest-pill-done { color: #34d399; border-color: rgba(52, 211, 153, 0.3); }

        /* 标题 */
        .quest-title-area { max-width: 720px; margin: 0 auto; padding: 28px 4px 20px; }
        .quest-title {
          font-size: 26px; font-weight: 800; color: #fff; margin: 0 0 6px;
          letter-spacing: 0.04em;
        }
        .quest-subtitle { font-size: 13px; color: #9ca3af; margin: 0; }

        /* 任务列表 */
        .quest-list-section { max-width: 720px; margin: 0 auto; }
        .quest-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .quest-item {
          position: relative; display: flex; align-items: center; gap: 12px;
          padding: 14px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: background 0.2s ease;
        }
        .quest-item:hover { background: rgba(255,255,255,0.07); }
        .quest-item-done { opacity: 0.5; }

        .quest-diff-tag {
          flex-shrink: 0; font-size: 11px; font-weight: 600;
          padding: 2px 8px; border-radius: 6px; border: 1px solid;
          background: rgba(0,0,0,0.2);
        }
        .quest-text { flex: 1; font-size: 14px; color: #f3f4f6; }
        .quest-countdown {
          margin-left: 8px; font-variant-numeric: tabular-nums;
          color: #fde047; font-weight: 700;
        }
        .quest-actions { display: flex; gap: 8px; flex-shrink: 0; align-items: center; }
        .quest-btn-complete {
          font-size: 13px; font-weight: 600; color: #059669;
          padding: 5px 14px; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #34d399, #10b981);
          color: #06281f;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .quest-btn-complete:hover:not(:disabled) {
          transform: scale(1.08); box-shadow: 0 0 14px rgba(52, 211, 153, 0.6);
        }
        .quest-btn-complete:disabled { opacity: 0.5; }
        .quest-btn-edit {
          font-size: 13px; background: none; border: none;
          padding: 5px 6px; transition: transform 0.2s ease, opacity 0.2s;
          opacity: 0.6;
        }
        .quest-btn-edit:hover { opacity: 1; transform: scale(1.15); }
        .quest-btn-del {
          font-size: 13px; background: none; border: none;
          padding: 5px 6px; transition: color 0.2s ease, opacity 0.2s;
          opacity: 0.5;
        }
        .quest-btn-del:hover { color: #f87171; opacity: 1; }

        /* 粒子 */
        .quest-particle {
          position: absolute; left: 50%; top: 50%;
          width: 8px; height: 8px; border-radius: 50%;
          pointer-events: none; z-index: 10;
        }

        /* 空状态 */
        .quest-empty {
          text-align: center; padding: 48px 0; color: #6b7280;
        }
        .quest-empty-icon { font-size: 40px; display: block; margin-bottom: 12px; }

        /* 输入栏（固定底部） */
        .quest-input-bar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
          display: flex; gap: 10px; padding: 14px 20px;
          max-width: 720px; margin: 0 auto;
          background: rgba(17, 24, 39, 0.85);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .quest-input {
          flex: 1; padding: 11px 16px; border-radius: 10px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; font-size: 14px; font-family: inherit; outline: none;
          transition: border-color 0.2s ease;
        }
        .quest-input::placeholder { color: #6b7280; }
        .quest-input:focus { border-color: #fde047; }
        .quest-add-btn {
          padding: 11px 22px; border-radius: 10px; border: none;
          font-size: 14px; font-weight: 600; font-family: inherit;
          color: #06281f;
          background: linear-gradient(135deg, #fde047, #f59e0b);
          transition: transform 0.15s ease, opacity 0.2s ease;
        }
        .quest-add-btn:hover:not(:disabled) { transform: scale(1.05); }
        .quest-add-btn:disabled { opacity: 0.4; }

        /* Modal */
        .quest-modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
        }
        .quest-modal {
          width: 100%; max-width: 420px; padding: 28px 26px;
          border-radius: 18px;
          background: linear-gradient(160deg, #1f2937, #111827);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 24px 64px -16px rgba(0,0,0,0.6);
        }
        .quest-modal-title { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 6px; }
        .quest-modal-sub { font-size: 14px; color: #fde047; margin: 0 0 4px; }
        .quest-modal-ask { font-size: 13px; color: #9ca3af; margin: 0 0 20px; }

        /* 智能拆解选项 - 游戏化风险收益标签 */
        .quest-modal-options { display: flex; flex-direction: column; gap: 12px; }
        .quest-modal-opt {
          display: flex; align-items: center; gap: 14px; text-align: left;
          padding: 16px 16px 16px 14px; border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); transition: all 0.2s ease;
        }
        .quest-modal-opt:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          transform: translateX(4px);
        }
        .quest-modal-opt-easy:hover { border-color: rgba(76, 175, 80, 0.5); }
        .quest-modal-opt-normal:hover { border-color: rgba(255, 193, 7, 0.5); }
        .quest-modal-opt-hard:hover { border-color: rgba(255, 87, 34, 0.5); }

        .quest-modal-opt-icon { font-size: 24px; flex-shrink: 0; }
        .quest-modal-opt-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .quest-modal-opt-label { font-size: 15px; font-weight: 600; color: #f3f4f6; }
        .quest-modal-opt-desc { font-size: 11px; color: #9ca3af; }

        /* XP 标签 - 右侧居中 */
        .quest-modal-opt-xp {
          flex-shrink: 0; font-size: 12px; font-weight: 700;
          padding: 4px 10px; border-radius: 4px;
          letter-spacing: 0.02em;
        }
        .quest-modal-opt-xp-green {
          background: rgba(76, 175, 80, 0.2); color: #4CAF50;
          border: 1px solid rgba(76, 175, 80, 0.4);
        }
        .quest-modal-opt-xp-gold {
          background: rgba(255, 193, 7, 0.2); color: #FFC107;
          border: 1px solid rgba(255, 193, 7, 0.4);
        }
        .quest-modal-opt-xp-orange {
          background: rgba(244, 67, 54, 0.2); color: #F44336;
          border: 1px solid rgba(244, 67, 54, 0.4);
        }

        /* 编辑 Modal */
        .quest-edit-modal { max-width: 480px; }
        .quest-edit-form { display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px; }
        .quest-edit-field { display: flex; flex-direction: column; gap: 8px; }
        .quest-edit-label { font-size: 12px; color: #9ca3af; font-weight: 500; letter-spacing: 0.05em; }
        .quest-edit-input {
          padding: 12px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          color: #fff; font-size: 14px; font-family: inherit; outline: none;
          transition: border-color 0.2s ease;
        }
        .quest-edit-input:focus { border-color: #fde047; }
        .quest-edit-input::placeholder { color: #6b7280; }
        .quest-edit-difficulty { display: flex; gap: 10px; }
        .quest-edit-diff-btn {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 16px 8px; border-radius: 12px; border: 1.5px solid;
          font-size: 12px; transition: all 0.25s ease; cursor: pointer;
        }
        .quest-edit-diff-icon { font-size: 24px; line-height: 1; }
        .quest-edit-diff-label { font-weight: 600; font-size: 14px; }
        .quest-edit-diff-xp { font-size: 13px; font-weight: 700; }
        .quest-edit-actions { display: flex; gap: 10px; }
        .quest-edit-cancel {
          flex: 1; padding: 11px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12);
          background: transparent; color: #9ca3af; font-size: 14px; font-family: inherit;
          cursor: pointer; transition: all 0.2s ease;
        }
        .quest-edit-cancel:hover { background: rgba(255,255,255,0.05); color: #f3f4f6; }
        .quest-edit-save {
          flex: 1; padding: 11px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #fde047, #f59e0b); color: #06281f;
          font-size: 14px; font-weight: 600; font-family: inherit;
          cursor: pointer; transition: all 0.2s ease;
        }
        .quest-edit-save:hover:not(:disabled) { transform: scale(1.02); }
        .quest-edit-save:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 480px) {
          .quest-modal-opt-desc { display: none; }
          .quest-modal-opt-xp { font-size: 11px; padding: 3px 8px; }
          .quest-edit-difficulty { flex-direction: column; }
        }
      `})]})},Fx=["✉️","📚","🎧","🚶","🍪","💍","🏛️","🍢","🛒","💆","🧺","☕","🎁","🏪","🚌","🚲","🎭","🐱","🎡","📷","🎬","💅","💄","🏊","🌄","📹","📦","🦒","🐦","🎨","🎵","📹","📧","📝","🍽️","🥗","🛏️","🧸","👁️","✏️","💧","🛍️","👗","🛁","🪴","📰","🍜","🧖","🥜","🌧️","焙","📸","🌊","📅","👕","🍳","☀️","🔮","🧩","🎞️","🌬️","🏮","🔨","🐶","🚍","💪","🪑","💇","😴","🤲","外卖","🤔","晚餐","🖼️","🛁","🏚️","☕","🌸","🍦","🎤","🥬","📞","📸","🚪","📷","🚿","😂","🎲","🪟","☀️","📺","☕","✍️","📚","🗓️","🪟","🎶","💅","🎰","☁️"],z8=["去吃一顿自助小火锅：手机打开一部综艺，想吃多久就吃多久","去书店沉浸式看一本喜欢的书：一口气看完一本感兴趣的书，和夕阳一起回家","写一张明信片给3年后的自己：把你的期待和烦恼都告诉长大的自己吧","随机选择陌生的街道散步30分钟：可以随机式citywalk，感觉很有趣呢","做小饼干或者小蛋糕：diy一个专属于你的小甜品～","做一个手工，比如戒指、陶艺、手机壳：把自己的名字刻上去！","去博物馆或者美术馆：陶冶一下身心，感受博物馆的美","去小吃街，把想吃的都吃一次：把没吃过的统统买下！","逛超市、零食店：五花八门的小东西会让人很有幸福感","做个足疗：犒劳一下辛苦的自己吧","带上美食去公园野餐感受阳光的沐浴，享受美味的食物","找家咖啡店写一篇随笔：戴上耳机进入自己的世界，写些最近的感受～","给家人和朋友挑选小礼物：买些小巧可爱的东西送给朋友，她们一定很喜欢！","探一家有趣的小店：苍蝇馆子或者高分小店都很纠结呢","随机坐一辆公交车随机下车：看一看不一样的风景，探索城市中陌生的角落","去湖边骑单车：戴上耳机，迎着晚风，很幸福哒","去看一场音乐剧：新奇而提升品位的美妙体验","猫咖撸猫撸狗：平淡的生活需要可爱的猫猫狗狗治愈呀","坐摩天轮：在最高处看城市的感觉很奇妙吧","找一个窗边，拍下过路的人们：形形色色的人，看看他们的状态有什么不同呢","看一场电影：挑选一部最感兴趣的电影，说走就走！","做一个美甲：换个新的美甲换个心情","画一个新的妆容出门：尝试一个没试过的妆容，反正谁都不认识你！","一个人去游泳：泡在水里，好舒服！","早起去爬山看日出：一个人感受日出的浪漫，带给自己希望","拍一条vlog：记录多彩的一天","拆一个盲盒：生活中很需要未知和惊喜，拆盲盒是一个很不错的选择！","去动物园喂小动物：让可爱的小动物给生活带来一些生机","去公园喂一次鸽子或流浪猫，感受生命带来的治愈瞬间","画填色画：成就感和耐心 up up！","外放喜欢的歌曲：享受一下属于自己的时光","看一部纪录片：每周都可以看一部做一个积累","取消订阅邮件：烦心事通通都走开","列购物清单：买一些自己喜欢的东西","规划下周菜单：提前可以准备食材","制作水果沙拉：补充一下维生素","换一床舒适四件套：整个人都会心情舒畅","用橡皮泥捏造型：休闲时间可以娱乐一下","做眼保健操：每天都可以做的保护眼睛的","修一下眉毛：让轮廓更好看","清晨喝一杯温开水：利于肠道健康","上网逛喜欢的店铺：可以加购到购物车","挑一套新衣服：下次出门的时候可以穿哦","给宠物洗澡：可以有更多时间给自己","打理一下阳台植物：让植物们更加赏心悦目","到书店翻翻杂志：悠闲时光来一个","探索本地的美食街：可以吃到自己喜欢的小吃","给自己做个小美容：比如敷个面膜","准备小袋干果当零食：边看剧边吃","坐在雨天的窗边看书：听着雨声很惬意","烤曲奇饼干送给朋友：提升幸福感","学习新的摄影技巧：可以给自己拍照","独自去海边散步：听听海浪的声音","为新的一周制定计划：做时间的主人","把旧衣物分类处理：断舍离","看看小视频学新菜：每周可以自己换换口味","享受阳光午后小憩：午休或者做喜欢的事","花时间思考未来目标：憧憬一下未来","尝试拼接一幅拼图：很有成就感","拍摄一组静物摄影：提升自己的技术","在有风的傍晚骑行：感受一下大自然的力量","为家增添气氛元素：可以买一些小装饰","DIY一件日常用品：日常生活中也可以用到的","和小猫小狗说说话：培养感情","随机坐公交车漫游：看看城市的街角","学习新的健身动作：提升自己的整体体态","重新安排生活空间：合理布局房间结构","尝试一个新的发型：从头开始","睡个长长的午觉：保持充足的睡眠","体验一次全身按摩：放松一下紧绷的状态","点平时舍不得的外卖：偶尔犒劳一下自己","进行一次自我反思：总结","享用一顿丰盛晚餐：可以跟家人一起","换个好看的壁纸：感觉像换了一个新手机","泡个舒服的热水澡：解乏","去旧货市场淘小玩意儿：买点自己喜欢的","尝试做一杯手冲咖啡或特调饮品，享受香气在空气里弥漫的过程","闻洗过衣服的香味：可以挑选自己喜欢的味道","品尝新口味的冰淇淋：吃到美食会很开心","一个人去KTV唱歌：可以不用担心五音不全","去市场挑新鲜的蔬菜：烹饪一道新鲜的食物","和朋友打电话聊琐事：分享一下不错的最近","穿上喜欢的衣服拍照：80岁回忆录","退出无用的微信群聊：一片清闲","随意翻手机里的旧照片：回忆过去","边洗澡边听播客：非常不错的体验","看一期搞笑综艺：治愈放松","玩一些简单的桌游：可以锻炼脑部","擦干净房间里的窗户：房间整体整洁提升","坐在阳台上晒太阳：惬意","看一部动画短片：可以吃着自己点的外卖","慢慢品尝一杯咖啡：享受片刻时光","抄写喜欢文案的句子","整理书架上的书籍","思考规划下一个月","打开窗户呼吸新鲜空气","学习一首爱听的新歌","做一次美甲","买一张彩票","躺在草地上或公园长椅上，单纯地发呆、看云，彻底放空大脑"],m1=z8.map((a,i)=>({id:i+1,text:a,icon:Fx[i%Fx.length]})),Ix=`data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
  <path d="M0 60 L60 60 L70 60 L75 30 L80 90 L85 45 L90 60 L150 60 L160 60 L165 35 L170 85 L175 50 L180 60 L240 60 L250 60 L255 25 L260 95 L265 40 L270 60 L330 60 L340 60 L345 30 L350 90 L355 45 L360 60 L400 60"
    stroke="rgba(160,150,140,0.06)" stroke-width="1" fill="none"/>
</svg>
`)}`,g1="recharge_count",x1="recharge_done_ids";function M8(){try{const a=localStorage.getItem(g1);return a?Math.max(0,Number(a)||0):0}catch{return 0}}function A8(){try{const a=localStorage.getItem(x1);return a?new Set(JSON.parse(a)):new Set}catch{return new Set}}function R8(){try{const a=Number(localStorage.getItem("recharge_count_ts")||0);if(!a)return!1;const i=new Date,o=new Date(a),l=i.getDay()||7,c=new Date(i);return c.setHours(0,0,0,0),c.setDate(i.getDate()-(l-1)),o>=c}catch{return!1}}function D8(){return R8()?M8():0}let Sd=null;const O8=()=>{try{if(!Sd){const f=window.AudioContext||window.webkitAudioContext;Sd=new f}const a=Sd,i=a.currentTime,o=a.createOscillator(),l=a.createGain(),c=a.createBiquadFilter();c.type="bandpass",c.frequency.value=2e3,c.Q.value=5,o.type="sawtooth",o.frequency.setValueAtTime(800,i),o.frequency.exponentialRampToValueAtTime(400,i+.1),l.gain.setValueAtTime(0,i),l.gain.linearRampToValueAtTime(.04,i+.01),l.gain.exponentialRampToValueAtTime(.001,i+.15),o.connect(c),c.connect(l),l.connect(a.destination),o.start(i),o.stop(i+.15)}catch{}},L8=({node:a,index:i,done:o,onToggle:l})=>{const[c,f]=j.useState(!1),[p,m]=j.useState(!1),h=()=>{o||(O8(),f(!0),setTimeout(()=>f(!1),800)),l(a.id)},g=j.useMemo(()=>Array.from({length:8},(b,y)=>({angle:y/8*Math.PI*2,distance:30+Math.random()*20,size:3+Math.random()*3,delay:Math.random()*.1})),[]);return s.jsxs(X.div,{className:`energy-node ${o?"charged":""} ${p?"hovered":""}`,initial:{opacity:0,x:-20},whileInView:{opacity:1,x:0},viewport:{once:!0,margin:"-20px"},transition:{duration:.35,delay:Math.min(i*.015,.3),ease:"easeOut"},children:[i<m1.length-1&&s.jsx("div",{className:`energy-line ${o?"active":""}`,children:s.jsx("span",{className:"energy-line-dot"})}),s.jsxs("button",{className:"energy-capsule",onClick:h,onMouseEnter:()=>m(!0),onMouseLeave:()=>m(!1),children:[s.jsx("span",{className:"energy-icon",children:a.icon}),s.jsx("span",{className:"energy-text",children:a.text}),s.jsxs("span",{className:`energy-battery ${o?"filled":""}`,children:[s.jsx("span",{className:"energy-battery-cap"}),s.jsx("span",{className:"energy-battery-body",children:s.jsx("span",{className:"energy-battery-fill"})})]}),s.jsx(Ne,{children:c&&s.jsx("div",{className:"energy-burst",children:g.map((b,y)=>s.jsx(X.span,{className:"energy-particle",style:{width:b.size,height:b.size},initial:{x:0,y:0,opacity:1,scale:1},animate:{x:Math.cos(b.angle)*b.distance,y:Math.sin(b.angle)*b.distance,opacity:0,scale:0},transition:{duration:.6,delay:b.delay,ease:"easeOut"}},y))})})]})]})},B8=({onClose:a})=>s.jsx(X.div,{className:"hidden-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:a,children:s.jsxs(X.div,{className:"hidden-popup",initial:{scale:.9,y:20},animate:{scale:1,y:0},exit:{scale:.9,y:20},transition:{type:"spring",stiffness:280,damping:24},onClick:i=>i.stopPropagation(),children:[s.jsx("button",{className:"hidden-close",onClick:a,children:"×"}),s.jsx("h2",{className:"hidden-title",children:"第101个电源"}),s.jsx("p",{className:"hidden-text",children:"允许自己永远充不满电。"}),s.jsx("div",{className:"hidden-deco"})]})}),U8=({state:a})=>s.jsxs("svg",{viewBox:"0 0 100 100",width:"56",height:"56",fill:"none",className:`station-cat cat-${a}`,children:[s.jsx("ellipse",{cx:"50",cy:"70",rx:"26",ry:"18",fill:"#fff",stroke:"#5a4a3a",strokeWidth:"1.5",opacity:"0.8"}),s.jsx("circle",{cx:"50",cy:"40",r:"18",fill:"#fff",stroke:"#5a4a3a",strokeWidth:"1.5",opacity:"0.8"}),s.jsx("path",{d:"M36 30 L30 16 L42 26 Z",fill:"#fff",stroke:"#5a4a3a",strokeWidth:"1.5"}),s.jsx("path",{d:"M64 30 L70 16 L58 26 Z",fill:"#fff",stroke:"#5a4a3a",strokeWidth:"1.5"}),s.jsx("path",{d:"M38 27 L35 21 L40 25 Z",fill:"#f0c8c0"}),s.jsx("path",{d:"M62 27 L65 21 L60 25 Z",fill:"#f0c8c0"}),a==="stare"?s.jsxs("g",{className:"cat-eyes-open",children:[s.jsx("circle",{cx:"43",cy:"38",r:"2.5",fill:"#3a6a8a"}),s.jsx("circle",{cx:"57",cy:"38",r:"2.5",fill:"#3a6a8a"}),s.jsx("circle",{cx:"43.5",cy:"37",r:"0.7",fill:"#fff"}),s.jsx("circle",{cx:"57.5",cy:"37",r:"0.7",fill:"#fff"})]}):s.jsxs("g",{children:[s.jsx("path",{d:"M40 38 Q43 41 46 38",stroke:"#5a4a3a",strokeWidth:"1.5",fill:"none",strokeLinecap:"round"}),s.jsx("path",{d:"M54 38 Q57 41 60 38",stroke:"#5a4a3a",strokeWidth:"1.5",fill:"none",strokeLinecap:"round"})]}),a==="yawn"?s.jsx("ellipse",{cx:"50",cy:"48",rx:"4",ry:"5",fill:"#c87878",stroke:"#5a4a3a",strokeWidth:"1"}):s.jsx("path",{d:"M50 44 Q46 48 44 46 M50 44 Q54 48 56 46",stroke:"#5a4a3a",strokeWidth:"1",fill:"none",strokeLinecap:"round"}),s.jsx("path",{d:"M48 42 L50 44 L52 42 Z",fill:"#e0a090"}),s.jsx("line",{x1:"32",y1:"42",x2:"40",y2:"43",stroke:"#5a4a3a",strokeWidth:"0.6"}),s.jsx("line",{x1:"68",y1:"42",x2:"60",y2:"43",stroke:"#5a4a3a",strokeWidth:"0.6"}),s.jsx("path",{d:"M74 68 Q88 58 84 44",stroke:"#5a4a3a",strokeWidth:"2",fill:"none",strokeLinecap:"round",opacity:"0.8"}),a==="sleep"&&s.jsx("text",{x:"72",y:"20",fontSize:"9",fill:"#a09a7a",fontFamily:"serif",fontStyle:"italic",children:"z"})]}),V8=()=>{const[a,i]=j.useState(A8),[o,l]=j.useState(D8),[c,f]=j.useState(0),[p,m]=j.useState(!1),[h,g]=j.useState("sleep"),b=j.useRef(!1),y=j.useRef(null),x=j.useCallback(S=>{i(N=>{const C=new Set(N);C.has(S)?C.delete(S):(C.add(S),l(T=>{const z=T+1;try{localStorage.setItem(g1,String(z)),localStorage.setItem("recharge_count_ts",String(Date.now()))}catch{}return z}),f(T=>T+1));try{localStorage.setItem(x1,JSON.stringify([...C]))}catch{}return C})},[]);j.useEffect(()=>{const S=y.current;if(!S)return;S.classList.add("ecg-pulse");const N=setTimeout(()=>S.classList.remove("ecg-pulse"),1200);return()=>clearTimeout(N)},[]);const w=()=>{m(!0),b.current||(b.current=!0,g("stare"),setTimeout(()=>g("yawn"),2e3),setTimeout(()=>g("sleep"),3500))};return s.jsxs("div",{className:"recharge-page",ref:y,children:[s.jsxs("header",{className:"recharge-topbar",children:[s.jsx(rt,{to:"/mickey",className:"recharge-back",children:"← 回到妙妙工具箱"}),s.jsx("span",{className:"recharge-topbar-meta",children:"Recharge Station"})]}),s.jsxs("section",{className:"recharge-hero",children:[s.jsx(X.h1,{className:"recharge-title",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.7,ease:"easeOut"},children:"今日充能计划"}),s.jsx(X.p,{className:"recharge-subtitle",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.7,delay:.15,ease:"easeOut"},children:"每天拔掉一根消耗能量的线，接入一件滋养自己的小事。"})]}),s.jsxs("section",{className:"energy-flow",children:[m1.map((S,N)=>s.jsx(L8,{node:S,index:N,done:a.has(S.id),onToggle:x},S.id)),s.jsxs("div",{className:"hidden-node-zone",children:[s.jsx("button",{className:`hidden-node ${p?"found":""}`,onClick:w,"aria-label":"隐藏电源"}),s.jsx("div",{className:"station-cat-wrap",children:s.jsx(U8,{state:h})})]}),s.jsx("p",{className:"circuit-hint",children:"电路末端还有一个预留接口……"})]}),s.jsxs(X.div,{className:"recharge-counter",initial:{scale:.9,opacity:.7},animate:{scale:1,opacity:1},transition:{type:"spring",stiffness:200,damping:14},children:[s.jsx("span",{className:"recharge-counter-emoji",children:"⚡️"}),s.jsxs("span",{className:"recharge-counter-text",children:["本周已回血 ",s.jsx("b",{children:o})," 次"]})]},c),s.jsx(Ne,{children:p&&s.jsx(B8,{onClose:()=>m(!1)})}),s.jsx("style",{children:`
        .recharge-page, .recharge-page * { cursor: auto; }
        .recharge-page a, .recharge-page button { cursor: pointer; }

        .recharge-page {
          min-height: 100vh;
          color: #5a5048;
          background-color: #FDFBF7;
          background-image: url(${Ix});
          background-size: 400px 120px;
          background-repeat: repeat;
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 100px;
          position: relative;
        }
        /* 心电图加载跳动 */
        .recharge-page.ecg-pulse::before {
          content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: url(${Ix});
          background-size: 400px 120px;
          animation: ecg-flash 1.2s ease-out;
        }
        @keyframes ecg-flash {
          0% { opacity: 0; }
          20% { opacity: 0.4; }
          100% { opacity: 0; }
        }

        /* 顶部 */
        .recharge-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 720px; margin: 0 auto; padding: 24px 4px 0;
          position: relative; z-index: 2;
        }
        .recharge-back {
          font-size: 14px; color: #9a8a7e; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .recharge-back:hover { color: #c8924a; transform: translateX(-3px); }
        .recharge-topbar-meta {
          font-size: 11px; color: #b8aa9a; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 标题区 */
        .recharge-hero {
          max-width: 720px; margin: 0 auto; padding: 36px 4px 24px; text-align: center;
          position: relative; z-index: 2;
        }
        .recharge-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(26px, 4.5vw, 36px); font-weight: 700;
          color: #3a3a3a; margin: 0 0 10px; letter-spacing: 0.06em;
        }
        .recharge-subtitle {
          font-size: 14px; color: #9a8a7e; margin: 0; letter-spacing: 0.04em; line-height: 1.6;
        }

        /* ===== 能量节点流 ===== */
        .energy-flow {
          max-width: 680px; margin: 0 auto; padding: 8px 4px 0;
          position: relative; z-index: 2;
        }

        .energy-node {
          position: relative; padding: 4px 0;
        }

        /* 连接线 */
        .energy-line {
          position: absolute; left: 28px; top: 100%; width: 2px; height: 8px;
          background: linear-gradient(180deg, rgba(180,170,160,0.2), rgba(180,170,160,0.05));
          overflow: hidden; z-index: 0;
        }
        .energy-line.active {
          background: linear-gradient(180deg, rgba(100,220,120,0.5), rgba(100,220,120,0.15));
        }
        .energy-line-dot {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 3px; height: 3px; border-radius: 50%;
          background: rgba(180,170,160,0.3);
        }
        .energy-node.hovered .energy-line-dot {
          background: rgba(200,180,100,0.6);
          animation: flow-down 1s linear infinite;
        }
        .energy-line.active .energy-line-dot {
          background: rgba(100,220,120,0.8);
          animation: flow-down 0.8s linear infinite;
        }
        @keyframes flow-down {
          0% { top: -3px; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 8px; opacity: 0; }
        }

        /* 节点胶囊 */
        .energy-capsule {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 11px 14px;
          border: 1px solid rgba(180,170,160,0.15);
          border-radius: 12px; background: rgba(255,253,248,0.6);
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
          transition: all 0.3s ease;
          font-family: inherit; text-align: left;
        }
        .energy-node.hovered .energy-capsule {
          border-color: rgba(220,160,80,0.3);
          background: rgba(255,253,248,0.85);
          box-shadow: 0 4px 16px -6px rgba(220,160,80,0.15);
        }
        .energy-node.charged .energy-capsule {
          border-color: rgba(100,220,120,0.35);
          background: rgba(240,255,242,0.7);
          box-shadow: 0 2px 12px -4px rgba(100,220,120,0.15);
        }

        .energy-icon {
          flex-shrink: 0; width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: #8a7a6e;
          filter: grayscale(0.4);
          transition: filter 0.3s ease;
        }
        .energy-node.charged .energy-icon { filter: grayscale(0); }

        .energy-text {
          flex: 1; font-size: 13px; color: #6b5e50; line-height: 1.5;
          letter-spacing: 0.01em;
          transition: color 0.3s ease;
        }
        .energy-node.charged .energy-text { color: #4a8a5a; }

        /* 电池 */
        .energy-battery {
          flex-shrink: 0; display: flex; align-items: center; gap: 1px;
          position: relative;
        }
        .energy-battery-cap {
          width: 2px; height: 8px; border-radius: 0 1px 1px 0;
          background: rgba(180,170,160,0.3);
        }
        .energy-battery-body {
          width: 22px; height: 12px; border-radius: 3px;
          border: 1.5px solid rgba(180,170,160,0.35);
          position: relative; overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .energy-battery-fill {
          position: absolute; inset: 1px; border-radius: 1px;
          width: 0; transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .energy-battery.filled .energy-battery-body {
          border-color: rgba(100,220,120,0.6);
        }
        .energy-battery.filled .energy-battery-fill {
          width: calc(100% - 2px);
          background: linear-gradient(90deg, #6adc6a, #4cba4c);
          box-shadow: 0 0 6px rgba(100,220,120,0.6);
        }

        /* 粒子爆发 */
        .energy-burst {
          position: absolute; top: 50%; right: 40px; transform: translateY(-50%);
          pointer-events: none; z-index: 5;
        }
        .energy-particle {
          position: absolute; border-radius: 50%;
          background: #6adc6a;
          box-shadow: 0 0 4px rgba(100,220,120,0.8);
        }

        /* ===== 第101个隐藏电源 ===== */
        .hidden-node-zone {
          position: relative; display: flex; align-items: center; justify-content: center;
          gap: 16px; padding: 32px 0 20px; margin-top: 8px;
        }
        .hidden-node {
          width: 6px; height: 6px; border-radius: 50%;
          border: none; padding: 0;
          background: rgba(120,130,140,0.15);
          transition: all 0.4s ease;
          position: relative;
        }
        .hidden-node:hover {
          background: rgba(255,255,255,0.7);
          box-shadow: 0 0 8px 2px rgba(255,255,255,0.4);
        }
        .hidden-node.found {
          background: rgba(255,255,255,0.5);
          box-shadow: 0 0 6px 1px rgba(255,255,255,0.3);
        }

        /* 小猫 */
        .station-cat-wrap {
          position: absolute; right: 10%; bottom: -8px;
          animation: cat-breathe 3s ease-in-out infinite;
        }
        @keyframes cat-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .station-cat { overflow: visible; }
        .cat-stare { animation: cat-stare-shake 0.3s ease-in-out 3; }
        @keyframes cat-stare-shake {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(1px); }
        }

        /* 底部暗示 */
        .circuit-hint {
          text-align: center; font-size: 11px; color: #5a5048;
          opacity: 0.25; letter-spacing: 0.1em; margin: 20px 0 0;
        }

        /* ===== 能量计数 ===== */
        .recharge-counter {
          position: fixed; bottom: 24px; right: 24px; z-index: 40;
          display: flex; align-items: center; gap: 8px;
          padding: 10px 18px; border-radius: 999px;
          background: rgba(255,253,248,0.7);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(180,170,160,0.2);
          box-shadow: 0 8px 24px -10px rgba(120,100,80,0.2);
        }
        .recharge-counter-emoji { font-size: 14px; }
        .recharge-counter-text { font-size: 13px; color: #6b5e50; letter-spacing: 0.03em; }
        .recharge-counter-text b { color: #4cba4c; font-size: 15px; }

        /* ===== 第101弹窗 ===== */
        .hidden-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 24px;
          background: rgba(20,20,20,0.4); backdrop-filter: blur(8px);
        }
        .hidden-popup {
          position: relative; max-width: 320px; width: 100%; padding: 36px 28px;
          border-radius: 18px; text-align: center;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.25);
          box-shadow: 0 24px 64px -16px rgba(0,0,0,0.3);
        }
        .hidden-close {
          position: absolute; top: 12px; right: 14px;
          width: 28px; height: 28px; border: none; border-radius: 50%;
          background: rgba(255,255,255,0.15); color: #fff; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
        }
        .hidden-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 24px; font-weight: 700; color: #fff;
          margin: 0 0 12px; letter-spacing: 0.08em;
          text-shadow: 0 0 16px rgba(255,255,255,0.4);
        }
        .hidden-text {
          font-size: 14px; color: rgba(255,255,255,0.65); margin: 0 0 20px;
          line-height: 1.7; letter-spacing: 0.04em;
        }
        .hidden-deco {
          width: 40px; height: 2px; margin: 0 auto;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        }

        /* ===== 移动端 ===== */
        @media (max-width: 640px) {
          .recharge-page { padding: 0 16px 80px; }
          .energy-capsule { padding: 10px 12px; gap: 8px; }
          .energy-icon { width: 24px; font-size: 14px; }
          .energy-text { font-size: 12px; }
          .energy-battery-body { width: 18px; height: 10px; }
          .station-cat-wrap { right: 5%; }
          .recharge-counter { bottom: 16px; right: 16px; padding: 8px 14px; }
        }
      `})]})},pn={bgms:"museum_bgms",tvs:"museum_tvs",nets:"museum_nets",honors:"museum_honors"};function Xx(){return typeof crypto<"u"&&"randomUUID"in crypto?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,8)}`}function Yo(a,i){try{const o=localStorage.getItem(a);if(!o)return i;const l=JSON.parse(o);if(!Array.isArray(l))return i;let c=!1;const f=l.map(p=>{const m=i.find(h=>h.id===p.id);return m&&!p.imageUrl&&m.imageUrl?(c=!0,{...p,imageUrl:m.imageUrl}):p});return c&&Qr(a,f),f}catch{return i}}function Qr(a,i){try{localStorage.setItem(a,JSON.stringify(i))}catch{}}const _8=[{id:"bgm-2002",year:"2002",title:"刀郎《2002年的第一场雪》",description:"当年大街小巷都在放的歌，是刻在 DNA 里的旋律。",imageUrl:"/images/bgm-2002-daolang.jpg"},{id:"bgm-2003",year:"2003",title:"周杰伦《稻香》",description:'前奏的蟋蟀声一响，就仿佛回到了那个无忧无虑的夏天，相信"回家吧，回到最初的美好"。',imageUrl:"/images/bgm-2003-jay.jpg"},{id:"bgm-2004",year:"2004",title:"S.H.E《中国话》",description:'"全世界都在学中国话"，这首歌的旋律一响，三个女孩的身影就浮现在眼前。',imageUrl:"/images/bgm-2004-she.jpg"},{id:"bgm-2005",year:"2005",title:"王心凌《那年夏天宁静的海》",description:"甜心教主的歌，总是伴随着偶像剧里又傻又可爱的画面，唱进很多人的心里。",imageUrl:"/images/bgm-2005-cyndi.jpg"},{id:"bgm-2006a",year:"2006",title:"孙燕姿《我怀念的》",description:"每次听到，都会有不一样的感悟，是争吵后想要爱你的冲动，还是无话不说的从前？",imageUrl:"/images/bgm-2006-stefanie.jpg"},{id:"bgm-2006b",year:"2006",title:"沈建祥《形容》",description:"像是那灰色天空中的小雨，下下停停，不动声色淋湿土地。有些情绪不必言说，全在眼神与长发里，那是青春最细腻的注脚。",imageUrl:"/images/bgm-2006b-shenjianxiang.jpg"},{id:"bgm-2007",year:"2007",title:"梁静茹《崇拜》",description:'经典的"梁式情歌"，打动了多少年轻女孩的心，纯粹又悲伤。',imageUrl:"/images/bgm-2007-fishleong.jpg"},{id:"bgm-2008",year:"2008",title:"五月天《倔强》",description:'"我和我最后的倔强，握紧双手绝对不放"，是青春里最热血的口号。',imageUrl:"/images/bgm-2008-mayday.jpg"},{id:"bgm-2011a",year:"2011",title:"陈奕迅《十年》",description:"一首歌的时间，仿佛经历了一场漫长的告别，教会我们成长。",imageUrl:"/images/bgm-2011a-eason.jpg"},{id:"bgm-2011b",year:"2011",title:"林宥嘉《想自由》",description:"就像被困住的野兽，在摩天大楼里渴求自由。一路嗅着追着美梦，哪怕跌得再重，也不觉得痛，只觉得空。",imageUrl:"/images/bgm-2011b-yoga.jpg"},{id:"bgm-2015",year:"2015",title:"陈楚生《那个远方》",description:"萦绕着发烫的梦想，就奋不顾身撑起手掌。那个叫做流浪的远方，到不了也念念不忘，是青春里最倔强的冲锋号。",imageUrl:"/images/bgm-2015-chenchusheng.jpg"},{id:"bgm-2022",year:"2022",title:"吴宇恒《失重旅行》",description:"关掉无用的思考，摆脱手机的烦扰。在月光与微风中摇啊摇，这是一场没有重力、也没有束缚的都市夜游。",imageUrl:"/images/bgm-2022-wuyuheng.jpg"}],q8=[{id:"tv-1999",year:"1999",title:"《还珠格格》（重播巅峰）",description:'每年寒暑假的必备经典，小燕子的古灵精怪和"当"的歌声，是几代人的共同记忆。',imageUrl:"/images/tv-1999-huanzhugege.jpg"},{id:"tv-2005a",year:"2005",title:"《家有儿女》",description:"刘星、夏雪、夏雨一家的欢乐日常，是童年最温暖的背景音。",imageUrl:"/images/tv-2005-jiayouernv.jpg"},{id:"tv-2005b",year:"2005",title:"《仙剑奇侠传》",description:"李逍遥和赵灵儿的仙侠梦，配上《杀破狼》和《六月的雨》，是无数人的意难平。",imageUrl:"/images/tv-2005-xianjian.jpg"},{id:"tv-2005c",year:"2005",title:"《恶作剧之吻》",description:"袁湘琴和江直树的故事，让每个女孩都幻想过自己的白马王子。",imageUrl:"/images/tv-2005c-kiss.jpg"},{id:"tv-2006",year:"2006",title:"《武林外传》",description:"同福客栈的屋顶，藏着江湖最柔软的角落。一群不靠谱的人，说着最扎心的话，成了我们青春里最治愈的避风港。",imageUrl:"/images/tv-2006-wulin.jpg"},{id:"tv-2010",year:"2010",title:"《新三国演义》",description:"烽火连天的不仅是赤壁的火，还有那些英雄辈出的梦。桃园结义的酒，至今还在历史的风烟里温热。",imageUrl:"/images/tv-2010-sanguo.jpg"},{id:"tv-2013",year:"2013",title:"《咱们结婚吧》",description:"大龄未婚的焦虑，被一碗热汤和一句'咱们结婚吧'悄悄融化。爱情或许会迟到，但绝不会缺席。",imageUrl:"/images/tv-2013-marry.jpg"},{id:"tv-2014",year:"2014",title:"《来自星星的你》",description:'引爆全民追剧热潮的韩剧，都敏俊和千颂伊让"我好像爱上你了"成了流行语。',imageUrl:"/images/tv-2014-star.jpg"},{id:"tv-2016",year:"2016",title:"《欢乐颂》",description:"五个女孩，五种颜色，在城市的钢筋水泥里互相取暖。原来孤独的灵魂，也能找到共振的频率。",imageUrl:"/images/tv-2016-ode.jpg"},{id:"tv-2019",year:"2019",title:"《都挺好》",description:"原生家庭的刺，扎在每个成年人心里。苏家的故事，是一面镜子，照见我们自己与亲情的复杂和解。",imageUrl:"/images/tv-2019-doujiahao.jpg"},{id:"tv-2022",year:"2022",title:"《人世间》",description:"五十年光阴流转，周家三代人的悲欢离合，就是一部中国老百姓的史诗。最平凡的烟火，往往最动人。",imageUrl:"/images/tv-2022-renshijian.jpg"},{id:"tv-2025",year:"2025",title:"《生万物》",description:"从泥土里长出的希望，是乡村振兴最美的画卷。杨幂的转型，让我们看到了女性在时代浪潮中的坚韧与温柔。",imageUrl:"/images/tv-2025-shengwanwu.jpg"}],H8=[{id:"net-2",year:"2004-2008",title:"Flash 小游戏",description:'键盘是船，浏览器是海，我们在"黄金矿工"里淘金，在"地铁跑酷"里逃亡。那些被定义为"摸鱼"的时光，其实是青春偷偷埋下的彩蛋。',imageUrl:"/images/net-2005-goldminer.jpg"},{id:"net-3",year:"2009-2012",title:"贴吧与论坛",description:'为了追星，在贴吧里疯狂刷帖，看同人文，分享资源，是第一批"网友"聚集地。',imageUrl:"/images/net-2009-tieba.jpg"}],G8=[{id:"honor-1",year:"2021",title:"国家励志奖学金",description:"2021-2022 学年获得国家励志奖学金，是对努力学习的最好回报。",imageUrl:"",reflection:"努力不会被辜负，它只是在等一个合适的时机开花。"},{id:"honor-2",year:"2022",title:"优秀志愿者",description:"获得优秀志愿者荣誉证书，用行动温暖他人。",imageUrl:"",reflection:"奉献的每一份力量，都算数。"},{id:"honor-3",year:"2023",title:"数据库管理系统职业技能等级证书",description:"获得数据库管理系统职业技能等级证书，掌握数据核心技术。",imageUrl:"",reflection:"每项技能的积累，都是未来最扎实的底气。"},{id:"honor-4",year:"2024",title:"网络与信息安全管理员职业技能等级证书",description:"获得网络与信息安全管理员职业技能等级证书，守护网络安全。",imageUrl:"",reflection:"技术越深入，越明白责任有多重。"},{id:"honor-5",year:"2025",title:"英语四级证书",description:"通过大学英语四级考试（CET-4），语言能力迈上新台阶。",imageUrl:"",reflection:"语言是通向更大世界的桥梁。"}],Ct="#b08d57",xe="#8B6B4F",ht="#6B5A4A",$t="#5c4033",Zt="#8B7355",Y8="#D2691E",qa="#C0392B",Px="#8B4513",xl=({message:a,onConfirm:i,onCancel:o})=>s.jsx(X.div,{style:{position:"fixed",inset:0,zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(20,12,10,0.85)",backdropFilter:"blur(8px)"},initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:o,children:s.jsxs(X.div,{style:{background:"#f9f5f0",border:`1px solid ${xe}40`,borderRadius:12,padding:"28px 32px",maxWidth:380,width:"90%",boxShadow:"0 4px 16px rgba(92,64,51,0.15)"},initial:{scale:.9,y:20},animate:{scale:1,y:0},exit:{scale:.9,y:20},transition:{type:"spring",stiffness:200,damping:20},onClick:l=>l.stopPropagation(),children:[s.jsx("p",{style:{fontFamily:"Noto Serif SC, serif",fontSize:15,color:$t,margin:"0 0 24px",lineHeight:1.7,textAlign:"center"},children:a}),s.jsxs("div",{style:{display:"flex",gap:12},children:[s.jsx("button",{onClick:o,style:{flex:1,padding:"10px 16px",border:`1px solid ${xe}40`,borderRadius:8,background:"transparent",color:ht,fontSize:14,cursor:"pointer",transition:"all 0.2s",fontFamily:"Noto Serif SC, serif"},onMouseEnter:l=>{l.currentTarget.style.background=`${xe}15`},onMouseLeave:l=>{l.currentTarget.style.background="transparent"},children:"取消"}),s.jsx("button",{onClick:i,style:{flex:1,padding:"10px 16px",border:"none",borderRadius:8,background:qa,color:"#fff",fontSize:14,cursor:"pointer",transition:"all 0.2s",fontFamily:"Noto Serif SC, serif"},onMouseEnter:l=>{l.currentTarget.style.background="#a02020"},onMouseLeave:l=>{l.currentTarget.style.background=qa},children:"确定删除"})]})]})}),F8=({link:a,onClose:i})=>{var l;const o=j.useRef(null);return s.jsxs(X.div,{initial:{opacity:0,y:-10,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:-10,scale:.95},style:{position:"absolute",top:-70,right:0,zIndex:50,width:200,height:70,background:"rgba(255,255,255,0.95)",borderRadius:8,boxShadow:"0 4px 20px rgba(92,64,51,0.2), 0 0 0 1px rgba(139,107,79,0.2)",overflow:"hidden",backdropFilter:"blur(8px)"},children:[s.jsx("button",{onClick:i,style:{position:"absolute",top:4,right:4,zIndex:51,width:20,height:20,border:"none",borderRadius:"50%",background:`${xe}30`,color:xe,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:"×"}),a.includes("music.163.com")||a.includes("y.qq.com")||a.includes("spotify")||a.includes("song")?s.jsx("iframe",{ref:o,src:`https://music.163.com/outchain/player?type=2&id=${((l=a.match(/\d+/))==null?void 0:l[0])||""}&auto=0&height=66`,width:200,height:70,style:{border:"none",display:"block"}}):s.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:4},children:[s.jsx("span",{style:{fontSize:24},children:"🎵"}),s.jsx("a",{href:a,target:"_blank",rel:"noopener noreferrer",style:{fontSize:11,color:Zt,fontFamily:"Noto Serif SC, serif"},children:"在浏览器打开"})]})]})},I8=({mode:a,initialData:i,onSubmit:o,onClose:l,sectionTitle:c,emoji:f})=>{const m={"🎵":{title:"🎧 耳机里的青春 BGM",desc:"那年夏天循环播放的旋律，是刻在DNA里的歌。",imgIcon:"🎵"},"📺":{title:"📺 电视里的乌托邦",desc:"全家围坐追过的经典剧集，是童年最暖的光。",imgIcon:"📺"},"📱":{title:"🌐 网络初现时的印记",desc:"拨号上网时的第一个网页，是探索世界的起点。",imgIcon:"🌐"}}[f]||{title:c,desc:"写下你的回忆...",imgIcon:"🖼️"},[h,g]=j.useState((i==null?void 0:i.year)||""),[b,y]=j.useState((i==null?void 0:i.title)||""),[x,w]=j.useState((i==null?void 0:i.description)||""),[S,N]=j.useState((i==null?void 0:i.musicLink)||""),[C,T]=j.useState((i==null?void 0:i.imageUrl)||""),z=j.useRef(null),E=h.trim()&&b.trim()&&x.trim(),A=B=>{var ne;const _=(ne=B.target.files)==null?void 0:ne[0];if(!_)return;if(_.size>2*1024*1024){alert("图片大小不能超过 2MB");return}if(!["image/jpeg","image/png","image/jpg"].includes(_.type)){alert("只支持 JPG/PNG 格式");return}const W=new FileReader;W.onload=H=>{var Q;const F=(Q=H.target)==null?void 0:Q.result;T(F)},W.readAsDataURL(_)},R=()=>{E&&o({year:h.trim(),title:b.trim(),description:x.trim(),musicLink:S.trim()||void 0,imageUrl:C||void 0})};return s.jsx(X.div,{style:{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(20,12,10,0.85)",backdropFilter:"blur(8px)",padding:24},initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:l,children:s.jsxs(X.div,{style:{background:"#f9f5f0",border:`1px solid ${xe}30`,borderRadius:12,padding:"28px 24px",maxWidth:480,width:"100%",boxShadow:"0 2px 8px rgba(92,64,51,0.1)"},initial:{scale:.9,y:24},animate:{scale:1,y:0},exit:{scale:.9,y:24},transition:{type:"spring",stiffness:200,damping:20},onClick:B=>B.stopPropagation(),children:[s.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20},children:s.jsx("h3",{style:{fontFamily:"Noto Serif SC, serif",fontSize:17,fontWeight:600,color:$t,margin:0},children:m.title})}),s.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:14},children:[s.jsxs("div",{children:[s.jsx("label",{style:{display:"block",fontSize:12,color:ht,marginBottom:5,fontFamily:"Noto Serif SC, serif"},children:"📅 年份"}),s.jsx("input",{type:"text",value:h,onChange:B=>g(B.target.value),placeholder:"例如：2005 或 2005-2010",style:{width:"100%",padding:"10px 12px",border:`1px solid ${xe}30`,borderRadius:6,background:"#fffef8",fontSize:14,color:$t,outline:"none",fontFamily:"Courier New, monospace",transition:"border-color 0.2s"},onFocus:B=>{B.target.style.borderColor=xe},onBlur:B=>{B.target.style.borderColor=`${xe}30`}})]}),s.jsxs("div",{children:[s.jsx("label",{style:{display:"block",fontSize:12,color:ht,marginBottom:5,fontFamily:"Noto Serif SC, serif"},children:"📌 标题"}),s.jsx("input",{type:"text",value:b,onChange:B=>y(B.target.value),placeholder:"例如：周杰伦《晴天》",style:{width:"100%",padding:"10px 12px",border:`1px solid ${xe}30`,borderRadius:6,background:"#fffef8",fontSize:14,color:$t,outline:"none",fontFamily:"Noto Serif SC, serif",transition:"border-color 0.2s"},onFocus:B=>{B.target.style.borderColor=xe},onBlur:B=>{B.target.style.borderColor=`${xe}30`}})]}),s.jsxs("div",{children:[s.jsx("label",{style:{display:"block",fontSize:12,color:ht,marginBottom:5,fontFamily:"Noto Serif SC, serif"},children:"💬 文案描述"}),s.jsx("textarea",{value:x,onChange:B=>w(B.target.value),placeholder:m.desc,rows:3,style:{width:"100%",padding:"10px 12px",border:`1px solid ${xe}30`,borderRadius:6,background:"#fffef8",fontSize:14,color:$t,outline:"none",fontFamily:"Noto Serif SC, serif",lineHeight:1.7,resize:"vertical",transition:"border-color 0.2s"},onFocus:B=>{B.target.style.borderColor=xe},onBlur:B=>{B.target.style.borderColor=`${xe}30`}})]}),s.jsxs("div",{children:[s.jsx("label",{style:{display:"block",fontSize:12,color:ht,marginBottom:5,fontFamily:"Noto Serif SC, serif"},children:"🎵 音乐链接（选填）"}),s.jsx("input",{type:"text",value:S,onChange:B=>N(B.target.value),placeholder:"网易云/QQ音乐/Spotify 链接",style:{width:"100%",padding:"10px 12px",border:`1px solid ${xe}30`,borderRadius:6,background:"#fffef8",fontSize:14,color:$t,outline:"none",fontFamily:"monospace",transition:"border-color 0.2s"},onFocus:B=>{B.target.style.borderColor=xe},onBlur:B=>{B.target.style.borderColor=`${xe}30`}})]}),s.jsxs("div",{children:[s.jsx("label",{style:{display:"block",fontSize:12,color:ht,marginBottom:5,fontFamily:"Noto Serif SC, serif"},children:"🖼️ 图片（选填，JPG/PNG ≤2MB）"}),s.jsx("input",{ref:z,type:"file",accept:"image/jpeg,image/png,image/jpg",onChange:A,style:{display:"none"}}),s.jsx("div",{className:"modal-image-preview",onClick:()=>{var B;return(B=z.current)==null?void 0:B.click()},style:{width:"100%",height:160,borderRadius:8,border:`2px dashed ${Zt}`,background:"#f5f0e5",overflow:"hidden",cursor:"pointer",position:"relative",transition:"border-color 0.2s, box-shadow 0.2s"},onMouseEnter:B=>{C&&(B.currentTarget.style.boxShadow=`0 0 0 2px ${Zt}40`)},onMouseLeave:B=>{B.currentTarget.style.boxShadow="none"},children:C?s.jsxs(s.Fragment,{children:[s.jsx("img",{src:C,alt:"预览",style:{width:"100%",height:"100%",objectFit:"cover"}}),s.jsx("div",{className:"modal-image-preview-hover",children:"点击更换图片"})]}):s.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:8},children:[s.jsx("span",{style:{fontSize:32,opacity:.5},children:m.imgIcon}),s.jsx("span",{style:{fontSize:13,color:ht,fontFamily:"Noto Serif SC, serif"},children:"+ 上传图片"})]})}),C&&s.jsx("button",{onClick:()=>T(""),style:{marginTop:6,padding:"2px 8px",border:"none",borderRadius:4,background:`${qa}15`,color:qa,fontSize:11,cursor:"pointer",fontFamily:"Noto Serif SC, serif"},children:"移除图片"})]})]}),s.jsxs("div",{style:{display:"flex",gap:10,marginTop:20},children:[s.jsx("button",{onClick:l,style:{flex:1,padding:"10px 14px",border:`1px solid ${xe}30`,borderRadius:8,background:"transparent",color:ht,fontSize:14,cursor:"pointer",transition:"all 0.2s",fontFamily:"Noto Serif SC, serif"},onMouseEnter:B=>{B.currentTarget.style.background=`${xe}10`},onMouseLeave:B=>{B.currentTarget.style.background="transparent"},children:"取消"}),s.jsx("button",{onClick:R,disabled:!E,style:{flex:1,padding:"10px 14px",border:"none",borderRadius:8,background:E?xe:`${xe}50`,color:"#fff",fontSize:14,cursor:E?"pointer":"not-allowed",transition:"all 0.2s",fontFamily:"Noto Serif SC, serif"},onMouseEnter:B=>{E&&(B.currentTarget.style.background="#7a5c3f")},onMouseLeave:B=>{E&&(B.currentTarget.style.background=xe)},children:a==="add"?"添加":"保存"})]})]})})},X8=({mode:a,initialData:i,onSubmit:o,onClose:l})=>{const[c,f]=j.useState((i==null?void 0:i.year)||""),[p,m]=j.useState((i==null?void 0:i.title)||""),[h,g]=j.useState((i==null?void 0:i.description)||""),[b,y]=j.useState((i==null?void 0:i.imageUrl)||""),[x,w]=j.useState((i==null?void 0:i.reflection)||""),[S,N]=j.useState((i==null?void 0:i.imageUrl)||""),C=j.useRef(null),T=c.trim()&&p.trim()&&h.trim(),z=A=>{var _;const R=(_=A.target.files)==null?void 0:_[0];if(!R)return;if(R.size>2*1024*1024){alert("图片大小不能超过 2MB");return}if(!["image/jpeg","image/png","image/jpg"].includes(R.type)){alert("只支持 JPG/PNG 格式");return}const B=new FileReader;B.onload=W=>{var H;const ne=(H=W.target)==null?void 0:H.result;N(ne),y(ne)},B.readAsDataURL(R)},E=()=>{T&&o({year:c.trim(),title:p.trim(),description:h.trim(),imageUrl:b.trim()||S,reflection:x.trim()})};return s.jsx(X.div,{style:{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(20,12,10,0.85)",backdropFilter:"blur(8px)",padding:24},initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:l,children:s.jsxs(X.div,{style:{background:"#f9f5f0",border:`1px solid ${xe}30`,borderRadius:12,padding:"28px 24px",maxWidth:520,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 4px 16px rgba(92,64,51,0.15)"},initial:{scale:.9,y:24},animate:{scale:1,y:0},exit:{scale:.9,y:24},transition:{type:"spring",stiffness:200,damping:20},onClick:A=>A.stopPropagation(),children:[s.jsx("h3",{style:{fontFamily:"Noto Serif SC, serif",fontSize:18,fontWeight:700,color:$t,margin:"0 0 20px"},children:a==="add"?"🏆 添加荣耀时刻":"🏆 编辑荣耀时刻"}),s.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:14},children:[s.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12},children:[s.jsxs("div",{children:[s.jsx("label",{style:{display:"block",fontSize:12,color:ht,marginBottom:5,fontFamily:"Courier New, monospace",letterSpacing:"0.05em"},children:"年份"}),s.jsx("input",{type:"text",value:c,onChange:A=>f(A.target.value),placeholder:"2024",style:{width:"100%",padding:"10px 12px",border:`1px solid ${xe}30`,borderRadius:6,background:"#fffef8",fontSize:14,color:$t,outline:"none",fontFamily:"Courier New, monospace"}})]}),s.jsxs("div",{children:[s.jsx("label",{style:{display:"block",fontSize:12,color:ht,marginBottom:5,fontFamily:"Noto Serif SC, serif"},children:"🏆 成就名称"}),s.jsx("input",{type:"text",value:p,onChange:A=>m(A.target.value),placeholder:"首个马拉松完赛",style:{width:"100%",padding:"10px 12px",border:`1px solid ${xe}30`,borderRadius:6,background:"#fffef8",fontSize:14,color:$t,outline:"none",fontFamily:"Noto Serif SC, serif"}})]})]}),s.jsxs("div",{children:[s.jsx("label",{style:{display:"block",fontSize:12,color:ht,marginBottom:5,fontFamily:"Noto Serif SC, serif"},children:"📝 成就描述"}),s.jsx("textarea",{value:h,onChange:A=>g(A.target.value),placeholder:"描述这段经历...",rows:3,style:{width:"100%",padding:"10px 12px",border:`1px solid ${xe}30`,borderRadius:6,background:"#fffef8",fontSize:14,color:$t,outline:"none",fontFamily:"Noto Serif SC, serif",lineHeight:1.7,resize:"vertical"}})]}),s.jsxs("div",{children:[s.jsx("label",{style:{display:"block",fontSize:12,color:ht,marginBottom:5,fontFamily:"Noto Serif SC, serif"},children:"💭 感悟反思（选填）"}),s.jsx("textarea",{value:x,onChange:A=>w(A.target.value),placeholder:"写下你的感悟...",rows:2,style:{width:"100%",padding:"10px 12px",border:`1px solid ${xe}30`,borderRadius:6,background:"#fffef8",fontSize:14,color:$t,outline:"none",fontFamily:"Noto Serif SC, serif",lineHeight:1.7,resize:"vertical",fontStyle:"italic"}})]}),s.jsxs("div",{children:[s.jsx("label",{style:{display:"block",fontSize:12,color:ht,marginBottom:5,fontFamily:"Noto Serif SC, serif"},children:"🖼️ 图片上传（JPG/PNG ≤2MB，4:3）"}),s.jsx("input",{ref:C,type:"file",accept:"image/jpeg,image/png,image/jpg",onChange:z,style:{display:"none"}}),s.jsx("button",{onClick:()=>{var A;return(A=C.current)==null?void 0:A.click()},style:{padding:"8px 14px",border:`1px dashed ${xe}40`,borderRadius:6,background:"transparent",color:Zt,fontSize:13,cursor:"pointer",fontFamily:"Noto Serif SC, serif",transition:"all 0.2s"},onMouseEnter:A=>{A.currentTarget.style.background=`${xe}10`},onMouseLeave:A=>{A.currentTarget.style.background="transparent"},children:"+ 上传图片"}),S&&s.jsxs("div",{style:{marginTop:10},children:[s.jsx("img",{src:S,alt:"预览",style:{width:160,height:120,objectFit:"cover",borderRadius:6,border:`1px solid ${xe}30`}}),s.jsx("button",{onClick:()=>{N(""),y("")},style:{marginLeft:8,padding:"2px 8px",border:"none",borderRadius:4,background:`${qa}20`,color:qa,fontSize:11,cursor:"pointer"},children:"移除"})]})]})]}),s.jsxs("div",{style:{display:"flex",gap:10,marginTop:20},children:[s.jsx("button",{onClick:l,style:{flex:1,padding:"10px 14px",border:`1px solid ${xe}30`,borderRadius:8,background:"transparent",color:ht,fontSize:14,cursor:"pointer",fontFamily:"Noto Serif SC, serif"},children:"取消"}),s.jsx("button",{onClick:E,disabled:!T,style:{flex:1,padding:"10px 14px",border:"none",borderRadius:8,background:T?Ct:`${Ct}80`,color:"#fff",fontSize:14,cursor:T?"pointer":"not-allowed",fontFamily:"Noto Serif SC, serif"},children:a==="add"?"添加":"保存"})]})]})})},P8="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2Y1ZjBlNSIgcnJ4PSIxMCIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjI4IiBmaWxsPSIjZTZlNmU2Ii8+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMTYiIGZpbGw9IiNlOGU4ZTgiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI4IiBmaWxsPSIjZDRhZjM3Ii8+PGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNCIgZmlsbD0iI2Y1ZjBlNSIvPjxwYXRoIGQ9Ik00MCA0MGwzMiAtMzIiIHN0cm9rZT0iI2Q0YWYzNyIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+PC9zdmc+",$8="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB4PSI4IiB5PSIxMCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjQ2IiBmaWxsPSIjZTZlNmU2IiByeD0iNCIvPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjM0IiBmaWxsPSIjZDZkOGQ4IiByeD0iMiIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iNjQiIHI9IjgiIGZpbGw9IiNkNGFmMzciLz48bGluZSB4MT0iNDAiIHkxPSI2NSIgeDI9IjQwIiB5Mj0iNzUiIHN0cm9rZT0iI2Q0YWYzNyIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+",Z8="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB4PSIyNCIgeT0iOCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjY0IiBmaWxsPSIjZTZlNmU2IiByeD0iNCIvPjxyZWN0IHg9IjI4IiB5PSIxNiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjQwIiBmaWxsPSIjZDZkOGQ4IiByeD0iMiIvPjxiaW5kIGN4PSI0MCIgY3k9IjU4IiByPSIzIiBmaWxsPSIjZDRhZjM3Ii8+PC9zdmc+";function Q8(a){return a==="🎵"?P8:a==="📺"?$8:Z8}const y1=({src:a,title:i,onClose:o,onDelete:l})=>s.jsx(X.div,{style:{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(20,12,10,0.92)",backdropFilter:"blur(8px)"},initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:o,children:s.jsxs(X.div,{style:{background:"#f9f5f0",border:`2px solid ${xe}60`,borderRadius:12,padding:24,maxWidth:420,width:"90%",boxShadow:"0 8px 32px rgba(92,64,51,0.3)"},initial:{scale:.85,y:20},animate:{scale:1,y:0},exit:{scale:.85,y:20},transition:{type:"spring",stiffness:200,damping:20},onClick:c=>c.stopPropagation(),children:[s.jsx("p",{style:{fontFamily:"Noto Serif SC, serif",fontSize:13,color:ht,margin:"0 0 12px",textAlign:"center"},children:i}),s.jsx("img",{src:a,alt:i,style:{width:"100%",maxHeight:300,objectFit:"contain",borderRadius:8,border:`2px solid ${Zt}`,filter:"sepia(0.15) contrast(1.05)"}}),s.jsxs("div",{style:{display:"flex",gap:10,marginTop:16},children:[s.jsx("button",{onClick:o,style:{flex:1,padding:"8px 14px",border:`1px solid ${xe}40`,borderRadius:8,background:"transparent",color:ht,fontSize:13,cursor:"pointer",fontFamily:"Noto Serif SC, serif"},children:"关闭"}),l&&s.jsx("button",{onClick:()=>{l(),o()},style:{flex:1,padding:"8px 14px",border:"none",borderRadius:8,background:qa,color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"Noto Serif SC, serif"},children:"删除图片"})]})]})}),K8=({card:a,emoji:i,onEdit:o,onDelete:l,onImageUpload:c,onImageDelete:f})=>{const[p,m]=j.useState(!1),[h,g]=j.useState(!1),[b,y]=j.useState(!1),[x,w]=j.useState(!1),[S,N]=j.useState(!1),[C,T]=j.useState(null),[z,E]=j.useState(!1),A=j.useRef(null),R=!!a.imageUrl,B=Q=>{if(!Q)return;if(Q.size>2*1024*1024){alert("图片大小不能超过 2MB");return}if(!["image/jpeg","image/png","image/jpg"].includes(Q.type)){alert("只支持 JPG/PNG 格式");return}N(!0);const K=new FileReader;K.onload=te=>{var q;const le=(q=te.target)==null?void 0:q.result;N(!1),c==null||c(a.id,le)},K.onerror=()=>{N(!1),alert("图片上传失败，请重试")},K.readAsDataURL(Q)},_=Q=>{var te;const K=(te=Q.target.files)==null?void 0:te[0];K&&B(K),Q.target.value=""},W=Q=>{var te;Q.preventDefault(),w(!1);const K=(te=Q.dataTransfer.files)==null?void 0:te[0];K&&B(K)},ne=Q=>{Q.preventDefault(),w(!0)},H=()=>w(!1),F=()=>{E(!1),f==null||f(a.id)};return s.jsxs(X.div,{className:"vintage-card",style:{position:"relative",border:x?"2px dashed #D4AF37":void 0,boxShadow:x?"0 0 16px rgba(212,175,55,0.5)":void 0,transition:"border 0.2s, box-shadow 0.2s",overflow:"hidden"},whileHover:{y:-4,rotate:.3},onHoverStart:()=>m(!0),onHoverEnd:()=>{b||m(!1)},onDragOver:ne,onDragLeave:H,onDrop:W,children:[s.jsxs("div",{className:"vintage-card-hero",onClick:()=>{var Q;R?T(a.imageUrl):(Q=A.current)==null||Q.click()},style:{cursor:"pointer"},children:[R&&s.jsx("img",{src:a.imageUrl,alt:a.title,className:"vintage-card-hero-img"}),!R&&s.jsx("div",{className:"vintage-card-hero-placeholder",children:s.jsx("img",{src:Q8(i),alt:"placeholder",style:{width:60,height:60,objectFit:"contain"}})}),S&&s.jsx("div",{className:"vintage-card-hero-loading",children:s.jsx("span",{className:"vintage-spin",children:"🎵"})}),x&&s.jsxs("div",{className:"vintage-card-hero-drag",children:[s.jsx("span",{children:"🖼️"}),s.jsx("span",{style:{fontSize:12,marginTop:4},children:"放置上传"})]}),s.jsx("div",{className:"vintage-card-hero-gradient"}),s.jsx("div",{className:"vintage-year-stamp-overlay",children:a.year}),R&&s.jsx("div",{className:"vintage-card-hero-badge",title:"点击预览",children:"🔍"}),!R&&!S&&s.jsx("div",{className:"vintage-card-hero-upload-hint",children:"点击上传图片"})]}),s.jsx(Ne,{children:p&&s.jsxs(X.div,{initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.8},style:{position:"absolute",top:8,right:8,zIndex:20,display:"flex",gap:5},children:[s.jsx("button",{onClick:Q=>{Q.stopPropagation(),o(a)},className:"museum-edit-btn",title:"编辑",children:"✏️"}),s.jsx("button",{onClick:Q=>{Q.stopPropagation(),y(!0)},className:"museum-delete-btn",title:"删除",children:"🗑️"}),s.jsx("button",{onClick:Q=>{var K;Q.stopPropagation(),(K=A.current)==null||K.click()},className:"museum-upload-btn",title:"上传图片",style:{background:S?`${Zt}80`:void 0},children:S?"⏳":"🖼️"})]})}),s.jsx(Ne,{children:b&&s.jsx(xl,{message:"确定删除？不可恢复。",onConfirm:()=>{l(a.id),y(!1),m(!1)},onCancel:()=>y(!1)})}),s.jsx(Ne,{children:h&&a.musicLink&&s.jsx(F8,{link:a.musicLink,onClose:()=>g(!1)})}),s.jsxs(Ne,{children:[C&&s.jsx(y1,{src:C,title:a.title,onClose:()=>T(null),onDelete:R?()=>{E(!0)}:void 0}),z&&s.jsx(xl,{message:"确定删除图片？",onConfirm:F,onCancel:()=>E(!1)})]}),s.jsxs("div",{className:"vintage-card-body",children:[s.jsx("h4",{className:"vintage-card-title",children:a.title}),s.jsx("div",{className:"vintage-card-divider"}),s.jsx("p",{className:"vintage-card-quote",children:a.description})]}),s.jsx("input",{ref:A,type:"file",accept:"image/jpeg,image/png,image/jpg",onChange:_,style:{display:"none"}})]})},wd=({title:a,emoji:i,cards:o,onAdd:l,onEdit:c,onDelete:f,onImageUpload:p,onImageDelete:m})=>s.jsxs("div",{className:"vintage-section",children:[s.jsxs("div",{className:"vintage-section-header",children:[s.jsx("span",{className:"vintage-section-emoji",children:i}),s.jsx("h3",{className:"vintage-section-title",children:a}),s.jsx("button",{onClick:()=>l({year:"",title:"",description:""}),className:"museum-add-btn",children:"+ 添加"})]}),s.jsx("div",{className:"vintage-gallery-scroll",children:s.jsx("div",{className:"vintage-gallery-track",children:s.jsx(Ne,{mode:"popLayout",children:o.map(h=>s.jsx(X.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,scale:.8},transition:{duration:.3},children:s.jsx(K8,{card:h,emoji:i,onEdit:c,onDelete:f,onImageUpload:p,onImageDelete:m})},h.id))})})})]}),W8=({item:a,onEdit:i,onDelete:o,onImageUpload:l,onImageDelete:c})=>{const[f,p]=j.useState(!1),[m,h]=j.useState(!1),[g,b]=j.useState(!1),[y,x]=j.useState(null),[w,S]=j.useState(!1),N=j.useRef(null),C=E=>{if(!E)return;if(E.size>2*1024*1024){alert("图片大小不能超过 2MB");return}if(!["image/jpeg","image/png","image/jpg"].includes(E.type)){alert("只支持 JPG/PNG 格式");return}b(!0);const A=new FileReader;A.onload=R=>{var _;const B=(_=R.target)==null?void 0:_.result;b(!1),l==null||l(a.id,B)},A.onerror=()=>{b(!1),alert("图片上传失败，请重试")},A.readAsDataURL(E)},T=E=>{var R;const A=(R=E.target.files)==null?void 0:R[0];A&&C(A),E.target.value=""},z=()=>{S(!1),c==null||c(a.id)};return s.jsxs(s.Fragment,{children:[s.jsxs(X.div,{className:"museum-honor-card museum-honor-card-enhanced",initial:{opacity:0,x:-20},whileInView:{opacity:1,x:0},viewport:{once:!0,margin:"-40px"},whileHover:{x:4},transition:{duration:.4},onHoverStart:()=>p(!0),onHoverEnd:()=>{m||p(!1)},children:[s.jsx(Ne,{children:f&&s.jsxs(X.div,{initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.8},style:{position:"absolute",top:8,right:8,zIndex:20,display:"flex",gap:6},children:[s.jsx("button",{onClick:E=>{E.stopPropagation(),i(a)},className:"honor-edit-btn",title:"编辑",children:"✏️"}),s.jsx("button",{onClick:E=>{E.stopPropagation(),h(!0)},className:"honor-delete-btn",title:"删除",children:"🗑️"}),s.jsx("button",{onClick:E=>{var A;E.stopPropagation(),(A=N.current)==null||A.click()},className:"honor-upload-btn",title:"上传图片",style:{background:g?`${Zt}80`:void 0},children:g?"⏳":"🖼️"})]})}),s.jsx(Ne,{children:m&&s.jsx(xl,{message:"确定删除这条记录？不可恢复。",onConfirm:()=>{o(a.id),h(!1),p(!1)},onCancel:()=>h(!1)})}),s.jsxs(Ne,{children:[y&&s.jsx(y1,{src:y,title:a.title,onClose:()=>x(null),onDelete:()=>{S(!0)}}),w&&s.jsx(xl,{message:"确定删除图片？",onConfirm:z,onCancel:()=>S(!1)})]}),s.jsx("div",{style:{flexShrink:0,alignSelf:"flex-start",paddingTop:16,paddingLeft:16},children:a.imageUrl?s.jsx(X.img,{src:a.imageUrl,alt:a.title,className:"honor-card-img",onClick:E=>{E.stopPropagation(),x(a.imageUrl)},whileHover:{scale:1.05},transition:{type:"spring",stiffness:300},style:{cursor:"pointer"}}):s.jsx("div",{className:"honor-card-placeholder",children:"🏆"})}),s.jsxs("div",{className:"museum-honor-body",children:[s.jsx("h3",{className:"museum-card-title",children:a.title}),s.jsx("p",{className:"museum-card-desc",children:a.description}),a.reflection&&s.jsxs("p",{className:"museum-honor-reflection",children:[s.jsx("span",{className:"museum-reflection-mark",children:'"'}),a.reflection]}),s.jsx("span",{className:"museum-card-zoom-hint",children:"🏆 荣耀时刻"})]})]}),s.jsx("input",{ref:N,type:"file",accept:"image/jpeg,image/png,image/jpg",onChange:T,style:{display:"none"}})]})},J8=()=>{const a=j.useMemo(()=>Array.from({length:18},()=>({left:Math.random()*100,delay:Math.random()*12,duration:Math.random()*10+14,size:Math.random()*3+1.5,drift:(Math.random()-.5)*60})),[]);return s.jsx("div",{className:"museum-dust-layer","aria-hidden":"true",children:a.map((i,o)=>s.jsx(X.span,{className:"museum-dust",style:{left:`${i.left}%`,width:i.size,height:i.size},initial:{y:-20,opacity:0},animate:{y:"110vh",opacity:[0,.6,.6,0],x:i.drift},transition:{duration:i.duration,delay:i.delay,repeat:1/0,ease:"linear"}},o))})},ek=({onClick:a})=>s.jsx(X.button,{onClick:a,style:{position:"fixed",bottom:32,right:32,zIndex:100,width:56,height:56,borderRadius:"50%",border:"none",background:`linear-gradient(135deg, ${Ct} 0%, #c9a66b 100%)`,color:"#fff",fontSize:24,cursor:"pointer",boxShadow:"0 6px 24px rgba(176,141,87,0.4), 0 2px 8px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center"},whileHover:{scale:1.1},whileTap:{scale:.95},initial:{opacity:0,y:20},animate:{opacity:1,y:0},title:"添加荣耀时刻",children:"+"}),tk=()=>{const[a,i]=j.useState(()=>Yo(pn.bgms,_8)),[o,l]=j.useState(()=>Yo(pn.tvs,q8)),[c,f]=j.useState(()=>Yo(pn.nets,H8)),[p,m]=j.useState(()=>Yo(pn.honors,G8)),h=j.useMemo(()=>[...a].sort((H,F)=>(parseInt(H.year)||0)-(parseInt(F.year)||0)),[a]),g=j.useMemo(()=>[...o].sort((H,F)=>(parseInt(H.year)||0)-(parseInt(F.year)||0)),[o]),b=j.useMemo(()=>[...c].sort((H,F)=>(parseInt(H.year)||0)-(parseInt(F.year)||0)),[c]),y=j.useMemo(()=>{const H=[...p].sort((F,Q)=>(parseInt(Q.year)||0)-(parseInt(F.year)||0));return console.log("[荣耀之路] 排序后年份:",H.map(F=>F.year)),H},[p]),[x,w]=j.useState(null),[S,N]=j.useState(null);j.useEffect(()=>{Qr(pn.bgms,a)},[a]),j.useEffect(()=>{Qr(pn.tvs,o)},[o]),j.useEffect(()=>{Qr(pn.nets,c)},[c]),j.useEffect(()=>{Qr(pn.honors,p)},[p]),j.useEffect(()=>(x||S?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[x,S]);const C=H=>{if(!x)return;const{section:F,mode:Q,data:K}=x;if(Q==="add"){const te={id:Xx(),...H};F==="bgm"?i(le=>[te,...le]):F==="tv"?l(le=>[te,...le]):f(le=>[te,...le])}else if(Q==="edit"&&K){const te={...K,...H};F==="bgm"?i(le=>le.map(q=>q.id===te.id?te:q)):F==="tv"?l(le=>le.map(q=>q.id===te.id?te:q)):f(le=>le.map(q=>q.id===te.id?te:q))}w(null)},T=(H,F)=>{F==="bgm"?i(Q=>Q.filter(K=>K.id!==H)):F==="tv"?l(Q=>Q.filter(K=>K.id!==H)):f(Q=>Q.filter(K=>K.id!==H))},z=H=>{if(!S)return;const{mode:F,data:Q}=S;if(F==="add"){const K={id:Xx(),...H};m(te=>[...te,K])}else if(F==="edit"&&Q){const K={...Q,...H};m(te=>te.map(le=>le.id===K.id?K:le))}N(null)},E=H=>{m(F=>F.filter(Q=>Q.id!==H))},A=(H,F)=>{m(Q=>Q.map(K=>K.id===H?{...K,imageUrl:F}:K))},R=H=>{m(F=>F.map(Q=>Q.id===H?{...Q,imageUrl:""}:Q))},B=(H,F,Q)=>{Q==="bgm"?i(K=>K.map(te=>te.id===H?{...te,imageUrl:F}:te)):Q==="tv"?l(K=>K.map(te=>te.id===H?{...te,imageUrl:F}:te)):f(K=>K.map(te=>te.id===H?{...te,imageUrl:F}:te))},_=(H,F)=>{F==="bgm"?i(Q=>Q.map(K=>K.id===H?{...K,imageUrl:void 0}:K)):F==="tv"?l(Q=>Q.map(K=>K.id===H?{...K,imageUrl:void 0}:K)):f(Q=>Q.map(K=>K.id===H?{...K,imageUrl:void 0}:K))},W=H=>H==="bgm"?"🎵 耳机里的青春 BGM":H==="tv"?"📺 电视里的乌托邦":"📱 网络初现时的印记",ne=H=>H==="bgm"?"🎵":H==="tv"?"📺":"📱";return s.jsxs("div",{className:"museum-page",children:[s.jsx(J8,{}),s.jsxs("header",{className:"museum-topbar",children:[s.jsx(rt,{to:"/mickey",className:"museum-back",children:"← 回到妙妙工具箱"}),s.jsx("span",{className:"museum-topbar-meta",children:"Museum of Memories"})]}),s.jsxs("section",{className:"museum-hero",children:[s.jsx(X.h1,{className:"museum-hero-title",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.7},children:"时光博物馆"}),s.jsx(X.p,{className:"museum-hero-sub",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.7,delay:.15},children:"每一步都算数。"})]}),s.jsxs("section",{className:"museum-hall museum-era-section",children:[s.jsxs("div",{className:"museum-hall-head",children:[s.jsx("span",{className:"museum-hall-roman",children:"I"}),s.jsxs("div",{children:[s.jsx("h2",{className:"museum-hall-title",children:"时代回响"}),s.jsx("p",{className:"museum-hall-sub",children:"那些年，我们一起追过的流行。"})]})]}),s.jsx(wd,{title:"耳机里的青春 BGM",emoji:"🎵",cards:h,onAdd:H=>w({mode:"add",section:"bgm",data:{...H,id:"",year:H.year||String(new Date().getFullYear())}}),onEdit:H=>w({mode:"edit",section:"bgm",data:H}),onDelete:H=>T(H,"bgm"),onImageUpload:(H,F)=>B(H,F,"bgm"),onImageDelete:H=>_(H,"bgm")}),s.jsx(wd,{title:"电视里的乌托邦",emoji:"📺",cards:g,onAdd:H=>w({mode:"add",section:"tv",data:{...H,id:"",year:H.year||String(new Date().getFullYear())}}),onEdit:H=>w({mode:"edit",section:"tv",data:H}),onDelete:H=>T(H,"tv"),onImageUpload:(H,F)=>B(H,F,"tv"),onImageDelete:H=>_(H,"tv")}),s.jsx(wd,{title:"网络初现时的印记",emoji:"📱",cards:b,onAdd:H=>w({mode:"add",section:"net",data:{...H,id:"",year:H.year||String(new Date().getFullYear())}}),onEdit:H=>w({mode:"edit",section:"net",data:H}),onDelete:H=>T(H,"net"),onImageUpload:(H,F)=>B(H,F,"net"),onImageDelete:H=>_(H,"net")})]}),s.jsxs("section",{className:"museum-hall",children:[s.jsxs("div",{className:"museum-hall-head",children:[s.jsx("span",{className:"museum-hall-roman",children:"II"}),s.jsxs("div",{children:[s.jsx("h2",{className:"museum-hall-title",children:"荣耀之路"}),s.jsx("p",{className:"museum-hall-sub",children:"每一步都算数。"})]})]}),s.jsxs("div",{className:"museum-timeline-v",children:[y.map((H,F)=>s.jsxs(X.div,{className:"museum-honor-row",layout:!0,initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-10,scale:.95},transition:{duration:.3,delay:F*.05},children:[s.jsxs("div",{className:"museum-honor-node",children:[s.jsx("span",{className:"museum-honor-dot"}),s.jsx("span",{className:"museum-honor-year",children:H.year})]}),s.jsx(W8,{item:H,onEdit:Q=>N({mode:"edit",data:Q}),onDelete:E,onImageUpload:A,onImageDelete:R})]},H.id)),s.jsxs("div",{className:"museum-timeline-start",children:[s.jsx("span",{className:"museum-honor-dot museum-honor-dot-start"}),s.jsx("span",{className:"museum-timeline-start-label",children:"🏁 起点"})]})]})]}),s.jsx("footer",{className:"museum-foot",children:s.jsx("span",{children:"时光不语，静待花开。"})}),s.jsx(ek,{onClick:()=>N({mode:"add"})}),s.jsx(Ne,{children:x&&s.jsx(I8,{mode:x.mode,initialData:x.data,onSubmit:C,onClose:()=>w(null),sectionTitle:W(x.section),emoji:ne(x.section)})}),s.jsx(Ne,{children:S&&s.jsx(X8,{mode:S.mode,initialData:S.data,onSubmit:z,onClose:()=>N(null)})}),s.jsx("style",{children:`
        .museum-page,
        .museum-page * { cursor: auto; }
        .museum-page a,
        .museum-page button,
        .museum-page .museum-card-collection,
        .museum-page .museum-honor-card { cursor: pointer; }

        .museum-page { position: relative; min-height: 100vh; overflow: hidden; color: #e8dcc8; background: radial-gradient(120% 80% at 50% 0%, #4a3a2e 0%, #3d2c2e 45%, #2a1f20 100%); font-family: "Noto Sans SC", system-ui, sans-serif; padding: 0 24px 120px; }

        /* 尘埃粒子 */
        .museum-dust-layer { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .museum-dust { position: absolute; top: 0; border-radius: 50%; background: ${Ct}; opacity: 0; }

        /* 顶部 */
        .museum-topbar { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; max-width: 960px; margin: 0 auto; padding: 26px 4px 0; }
        .museum-back { font-size: 14px; color: #a89580; text-decoration: none; letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease; }
        .museum-back:hover { color: ${Ct}; transform: translateX(-3px); }
        .museum-topbar-meta { font-size: 11px; color: #6b5a4a; letter-spacing: 0.28em; text-transform: uppercase; }

        /* 标题区 */
        .museum-hero { position: relative; z-index: 2; max-width: 960px; margin: 0 auto; padding: 56px 4px 48px; text-align: center; }
        .museum-hero-title { font-family: "Noto Serif SC", Georgia, serif; font-size: clamp(34px, 5.5vw, 54px); font-weight: 700; color: ${Ct}; margin: 0 0 14px; letter-spacing: 0.06em; text-shadow: 0 0 30px rgba(176,141,87,0.3); }
        .museum-hero-sub { font-size: 16px; color: #b8a890; margin: 0; letter-spacing: 0.12em; font-style: italic; }

        /* 展厅 */
        .museum-hall { position: relative; z-index: 2; max-width: 960px; margin: 0 auto 72px; }
        .museum-hall-head { display: flex; align-items: center; gap: 18px; margin-bottom: 36px; padding-bottom: 18px; border-bottom: 1px solid rgba(176,141,87,0.25); }
        .museum-hall-roman { font-family: "Noto Serif SC", Georgia, serif; font-size: 38px; font-weight: 700; color: ${Ct}; opacity: 0.7; line-height: 1; }
        .museum-hall-title { font-family: "Noto Serif SC", Georgia, serif; font-size: 26px; font-weight: 700; color: ${Ct}; margin: 0 0 4px; }
        .museum-hall-sub { font-size: 13px; color: #9a8a78; margin: 0; font-style: italic; }

        /* ====== 复古报纸风格 ====== */
        .museum-era-section { background: none; }
        .vintage-section { margin-bottom: 48px; }
        .vintage-section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px dashed rgba(139,109,79,0.4); }
        .vintage-section-emoji { font-size: 24px; filter: grayscale(0.3); }
        .vintage-section-title { font-family: "Noto Serif SC", Georgia, serif; font-size: 18px; font-weight: 600; color: ${xe}; margin: 0; letter-spacing: 0.08em; }

        /* 添加按钮 */
        .museum-add-btn {
          margin-left: auto; padding: 6px 14px; border: 1px dashed ${xe}60;
          border-radius: 20px; background: transparent; color: ${xe};
          font-size: 12px; cursor: pointer; font-family: "Noto Serif SC", serif;
          transition: all 0.2s; display: flex; align-items: center; gap: 4px;
        }
        .museum-add-btn:hover { background: ${xe}15; border-style: solid; }

        /* 横向滑动 */
        .vintage-gallery-scroll { overflow-x: auto; padding-bottom: 16px; scrollbar-width: thin; scrollbar-color: ${xe} transparent; }
        .vintage-gallery-scroll::-webkit-scrollbar { height: 6px; }
        .vintage-gallery-scroll::-webkit-scrollbar-thumb { background: rgba(139,109,79,0.4); border-radius: 3px; }
        .vintage-gallery-track { display: flex; gap: 20px; padding: 8px 4px; }

        /* 时代回响卡片（杂志风：图片50% + 文字50%） */
        .vintage-card {
          position: relative; flex-shrink: 0; width: 280px;
          height: 320px; /* 固定高度：160px 图片 + 160px 文字 */
          background: #FAF8F3;
          border: 1px solid #D7CCC8; border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s ease; overflow: hidden;
          display: flex; flex-direction: column;
        }

        /* 图片区域（50% = 160px） */
        .vintage-card-hero { position: relative; width: 100%; height: 160px; flex-shrink: 0; overflow: hidden; border-radius: 12px 12px 0 0; }
        .vintage-card-hero-img { width: 100%; height: 100%; object-fit: cover; filter: sepia(0.1) contrast(1.02) brightness(0.98); transition: transform 0.3s ease; }
        .vintage-card-hero:hover .vintage-card-hero-img { transform: scale(1.04); }
        .vintage-card-hero-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #F5EDD8 0%, #E8D8C0 100%); background-image: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,107,79,0.04) 3px, rgba(139,107,79,0.04) 6px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(139,107,79,0.04) 3px, rgba(139,107,79,0.04) 6px); display: flex; align-items: center; justify-content: center; }
        .vintage-card-hero-loading { position: absolute; inset: 0; background: rgba(250,248,243,0.9); display: flex; align-items: center; justify-content: center; }
        .vintage-card-hero-drag { position: absolute; inset: 0; background: rgba(212,175,55,0.15); border: 3px dashed #D4AF37; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px; color: #6B5A4A; font-family: "Noto Serif SC, serif"; }
        .vintage-card-hero-gradient { position: absolute; left: 0; right: 0; bottom: 0; height: 50%; background: linear-gradient(to bottom, transparent 0%, rgba(62,39,35,0.5) 100%); pointer-events: none; }
        .vintage-card-hero-badge { position: absolute; top: 8px; right: 8px; z-index: 5; width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border: 1px solid rgba(139,107,79,0.3); font-size: 12px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
        .vintage-card-hero:hover .vintage-card-hero-badge { opacity: 1; }
        .vintage-card-hero-upload-hint { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 5; font-size: 11px; color: rgba(250,248,243,0.9); font-family: "Noto Serif SC, serif"; text-shadow: 0 1px 3px rgba(0,0,0,0.4); white-space: nowrap; }

        /* 年份邮票标签（浮在图片左上角） */
        .vintage-year-stamp-overlay { position: absolute; top: 8px; left: 8px; z-index: 5; padding: 4px 8px; background: #8B7355; color: #fff; font-family: "Courier New", monospace; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; border-radius: 2px; box-shadow: 2px 2px 0 rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.15); transform: rotate(-3deg); }

        /* 文字区域（紧凑杂志排版） */
        .vintage-card-body {
          height: 160px; padding: 12px 16px 12px;
          flex-shrink: 0; display: flex; flex-direction: column;
        }
        .vintage-card-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px; font-weight: 600; color: #3E2723;
          margin: 0 0 6px; line-height: 1.4;
          flex-shrink: 0;
        }
        /* 标题下方分隔线 */
        .vintage-card-divider {
          width: 60px; height: 1px; background: #E0D6D0;
          margin: 0 0 8px; flex-shrink: 0;
        }
        .vintage-card-desc {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px; line-height: 1.5; color: #5D4037;
          margin: 0; flex: 1; overflow: hidden;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        /* 引用（带前缀符号） */
        .vintage-card-quote {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px; line-height: 1.5; color: #795548;
          margin: 6px 0 0; font-style: italic; flex-shrink: 0;
        }
        .vintage-card-quote::before { content: "❝ "; }
        .vintage-card-quote::after { content: " ❞"; }

        /* 编辑/删除/上传按钮 */
        .museum-edit-btn, .museum-delete-btn {
          width: 26px; height: 26px; border: none; border-radius: 50%;
          font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25); transition: all 0.2s ease;
        }
        .museum-edit-btn { background: ${Zt}; color: #fff; }
        .museum-edit-btn:hover { background: ${Y8}; transform: scale(1.1); }
        .museum-delete-btn { background: ${Px}; color: #fff; }
        .museum-delete-btn:hover { background: ${qa}; animation: shake 0.3s ease-in-out; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px) rotate(-5deg); } 75% { transform: translateX(2px) rotate(5deg); } }

        /* 上传按钮 */
        .museum-upload-btn {
          width: 26px; height: 26px; border: none; border-radius: 50%;
          font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25); transition: all 0.2s ease;
          background: ${Zt}; color: #fff;
        }
        .museum-upload-btn:hover { background: ${xe}; transform: scale(1.1); }

        /* 上传中旋转动画 */
        .vintage-spin {
          font-size: 28px; display: inline-block;
          animation: vintage-spin 1s linear infinite;
        }
        @keyframes vintage-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* 弹窗大图预览 hover */
        .modal-image-preview-hover { position: absolute; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; color: #fff; font-family: "Noto Serif SC, serif"; font-size: 14px; opacity: 0; transition: opacity 0.2s; }
        .modal-image-preview:hover .modal-image-preview-hover { opacity: 1; }

        /* 垂直时间轴 */
        .museum-timeline-v { position: relative; padding-left: 8px; }
        .museum-timeline-v::before { content: ""; position: absolute; left: 21px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(to bottom, ${Ct}, rgba(176,141,87,0.2)); }
        .museum-honor-row { position: relative; display: flex; gap: 28px; margin-bottom: 36px; }
        .museum-honor-node { flex-shrink: 0; width: 44px; display: flex; flex-direction: column; align-items: center; padding-top: 18px; z-index: 1; }
        .museum-honor-dot { width: 14px; height: 14px; border-radius: 50%; background: ${Ct}; border: 3px solid #3d2c2e; box-shadow: 0 0 12px rgba(176,141,87,0.6); }
        .museum-honor-year { margin-top: 8px; font-family: "Courier New", monospace; font-size: 12px; font-weight: 700; color: ${Ct}; }
        .museum-honor-card { position: relative; flex: 1; display: flex; gap: 20px; background: #f5edd6; border: 1px solid rgba(176,141,87,0.5); border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px -12px rgba(0,0,0,0.6); transition: transform 0.3s ease, box-shadow 0.3s ease; }

        /* 荣耀编辑/删除按钮 */
        .honor-edit-btn, .honor-delete-btn {
          width: 28px; height: 28px; border: none; border-radius: 50%;
          font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.2s ease;
        }
        .honor-edit-btn { background: ${$t}; color: #fff; }
        .honor-edit-btn:hover { transform: scale(1.1); }
        .honor-delete-btn { background: ${Px}; color: #fff; }
        .honor-delete-btn:hover { background: ${qa}; animation: shake 0.3s ease-in-out; }

        /* 荣耀上传按钮 */
        .honor-upload-btn {
          width: 28px; height: 28px; border: none; border-radius: 50%;
          font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.2s ease;
          background: ${Zt}; color: #fff;
        }
        .honor-upload-btn:hover { background: ${xe}; transform: scale(1.1); }

        /* 荣耀卡片图片（48x48 圆角） */
        .honor-card-img {
          width: 48px; height: 48px; object-fit: cover; border-radius: 8px;
          border: 2px solid ${Zt};
          background: #f5f0e5;
          filter: sepia(0.1) contrast(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .honor-card-placeholder {
          width: 48px; height: 48px; border-radius: 8px;
          background: rgba(245,240,229,0.9); border: 2px dashed ${Zt}60;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }

        /* 起点标注 */
        .museum-timeline-start {
          display: flex; align-items: center; gap: 10px;
          margin-top: 8px; padding-left: 0;
        }
        .museum-honor-dot-start {
          width: 10px; height: 10px; background: ${Ct}; opacity: 0.5;
          box-shadow: none;
        }
        .museum-timeline-start-label {
          font-family: "Noto Serif SC", serif; font-size: 12px;
          color: rgba(176,141,87,0.5); font-style: italic; letter-spacing: 0.08em;
        }

        .museum-honor-img { width: 160px; flex-shrink: 0; height: auto; }
        .museum-honor-img .museum-film-img { height: 100%; min-height: 140px; }
        .museum-honor-body { padding: 18px 20px; flex: 1; }
        .museum-card-title { font-family: "Noto Serif SC", Georgia, serif; font-size: 16px; font-weight: 700; color: #3d2c2e; margin: 0 0 6px; }
        .museum-card-desc { font-size: 12px; line-height: 1.7; color: #6b5a4a; margin: 0; }
        .museum-honor-reflection { margin: 10px 0 0; padding-left: 14px; border-left: 2px solid ${Ct}; font-size: 13px; line-height: 1.8; color: #8a6a4a; font-style: italic; }
        .museum-reflection-mark { font-family: "Noto Serif SC", Georgia, serif; font-size: 22px; color: ${Ct}; margin-right: 2px; line-height: 0; }
        .museum-card-zoom-hint { position: absolute; bottom: 10px; right: 10px; z-index: 2; font-size: 11px; color: #8a7a64; opacity: 0; transition: opacity 0.3s ease; }
        .museum-honor-card:hover .museum-card-zoom-hint { opacity: 0.9; }

        /* 胶片显影 */
        .museum-film-wrap { position: relative; overflow: hidden; background: #2a1f20; }
        .museum-film-placeholder { position: absolute; inset: 0; background: linear-gradient(110deg, #2a1f20 30%, #3d2c2e 50%, #2a1f20 70%); background-size: 200% 100%; animation: museum-shimmer 1.5s infinite; }
        @keyframes museum-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .museum-film-img { display: block; width: 100%; height: 100%; object-fit: cover; }

        /* 页脚 */
        .museum-foot { position: relative; z-index: 2; max-width: 960px; margin: 0 auto; padding-top: 32px; text-align: center; font-size: 13px; color: #6b5a4a; font-style: italic; letter-spacing: 0.08em; }

        /* 移动端 */
        @media (max-width: 640px) {
          .vintage-card { width: 100%; max-width: 320px; height: 320px; }
          .vintage-card-hero { height: 160px; }
          .vintage-card-body { height: 160px; padding: 12px; }
          .vintage-section-header { gap: 10px; }
          .vintage-section-title { font-size: 16px; }
          .museum-honor-card { flex-direction: column; }
          .museum-honor-img { width: 100%; height: 160px; }
          .museum-honor-img .museum-film-img { min-height: 160px; }
        }
      `})]})},Kt=["#ffb6c1","#b6d5e8","#b8e0d2","#d4c5e2","#f5e1b8","#f6c6c6"];let kd=null;const ak=()=>{if(!kd){const a=window.AudioContext||window.webkitAudioContext;kd=new a}return kd},nk=()=>{try{const a=ak(),i=a.currentTime,o=a.createOscillator(),l=a.createGain();o.type="sine",o.frequency.setValueAtTime(720,i),o.frequency.exponentialRampToValueAtTime(220,i+.08),l.gain.setValueAtTime(.18,i),l.gain.exponentialRampToValueAtTime(1e-4,i+.1),o.connect(l),l.connect(a.destination),o.start(i),o.stop(i+.1)}catch{}},il=6,b1=6,xn=14,Yn=44,ik=()=>{const a=[];for(let i=0;i<b1;i++)for(let o=0;o<il;o++)a.push({id:i*il+o,cx:o*(Yn+xn)+Yn/2+xn,cy:i*(Yn+xn)+Yn/2+xn,r:Yn/2-2,color:Kt[(i*il+o)%Kt.length],popped:!1});return a},rk=()=>{const[a,i]=j.useState(ik),[o,l]=j.useState([]),c=j.useRef(0),f=h=>{nk();const g=Array.from({length:6},()=>({id:c.current++,x:h.cx,y:h.cy,dx:(Math.random()-.5)*70,dy:(Math.random()-.5)*70-10,color:Kt[Math.floor(Math.random()*Kt.length)]}));l(b=>[...b,...g]),i(b=>b.map(y=>y.id===h.id?{...y,popped:!0}:y)),window.setTimeout(()=>{i(b=>b.map(y=>y.id===h.id?{...y,popped:!1,color:Kt[Math.floor(Math.random()*Kt.length)]}:y))},600),window.setTimeout(()=>{l(b=>b.filter(y=>!g.some(x=>x.id===y.id)))},700)},p=il*(Yn+xn)+xn,m=b1*(Yn+xn)+xn;return s.jsxs("div",{className:"sr-game-stage",children:[s.jsxs("svg",{width:p,height:m,className:"sr-pop-svg",children:[a.map(h=>s.jsx(X.circle,{cx:h.cx,cy:h.cy,r:h.r,fill:h.color,initial:!1,animate:{scale:h.popped?0:1,opacity:h.popped?0:1},transition:{duration:.25,ease:"easeOut"},style:{transformOrigin:`${h.cx}px ${h.cy}px`,cursor:"pointer"},onClick:()=>!h.popped&&f(h)},h.id)),o.map(h=>s.jsx(X.text,{x:h.x,y:h.y,fontSize:16,fill:h.color,initial:{opacity:1,x:0,y:0,scale:1},animate:{opacity:0,x:h.dx,y:h.dy,scale:.3,rotate:180},transition:{duration:.6,ease:"easeOut"},children:"✦"},h.id))]}),s.jsx("p",{className:"sr-game-tip",children:"点点看，永远捏不完。"})]})},sk=()=>Array.from({length:5},(a,i)=>({id:i,x:40+i%3*120+i%2*20,y:50+Math.floor(i/3)*130+i%2*30,w:90+i%2*20,h:70,color:Kt[i%Kt.length],cut:null})),ok=()=>{const a=j.useRef(null),[i,o]=j.useState(sk),[l,c]=j.useState([]),f=j.useRef(!1),p=j.useRef(0),m=S=>{const N=a.current.getBoundingClientRect();return{x:S.clientX-N.left,y:S.clientY-N.top}},h=S=>{f.current=!0,c([m(S)])},g=S=>{f.current&&c(N=>[...N,m(S)])},b=()=>{if(!f.current)return;f.current=!1;const S=l;if(S.length<2){c([]);return}o(N=>N.map(C=>{if(C.cut)return C;const T=S.filter(A=>A.x>=C.x&&A.x<=C.x+C.w&&A.y>=C.y&&A.y<=C.y+C.h);if(T.length<2)return C;const z=T[0],E=T[T.length-1];return{...C,cut:{rx1:z.x-C.x,ry1:z.y-C.y,rx2:E.x-C.x,ry2:E.y-C.y,key:p.current++}}})),c([])},y=S=>{o(N=>N.map(C=>C.id===S?{...C,cut:null,x:40+Math.random()*260,y:50+Math.random()*180,color:Kt[Math.floor(Math.random()*Kt.length)]}:C))},x=S=>`polygon(0% 0%, 100% 0%, ${S.cut.rx2}px ${S.cut.ry2}px, ${S.cut.rx1}px ${S.cut.ry1}px)`,w=S=>`polygon(${S.cut.rx1}px ${S.cut.ry1}px, ${S.cut.rx2}px ${S.cut.ry2}px, 100% 100%, 0% 100%)`;return s.jsxs("div",{className:"sr-game-stage sr-zencut",ref:a,style:{touchAction:"none"},onPointerDown:h,onPointerMove:g,onPointerUp:b,onPointerLeave:b,children:[s.jsxs("div",{className:"sr-zencut-area",children:[i.map(S=>S.cut?s.jsxs("div",{style:{position:"absolute",left:S.x,top:S.y,width:S.w,height:S.h},children:[s.jsx(X.div,{style:{position:"absolute",inset:0,background:S.color,borderRadius:16,clipPath:x(S)},initial:{x:0,y:0,rotate:0,opacity:1},animate:{x:-6,y:-50,rotate:-14,opacity:0},transition:{duration:.7,ease:"easeIn"},onAnimationComplete:()=>y(S.id)}),s.jsx(X.div,{style:{position:"absolute",inset:0,background:S.color,borderRadius:16,clipPath:w(S)},initial:{x:0,y:0,rotate:0,opacity:1},animate:{x:8,y:80,rotate:18,opacity:0},transition:{duration:.7,ease:"easeIn"}})]},S.id):s.jsx(X.div,{style:{position:"absolute",left:S.x,top:S.y,width:S.w,height:S.h,background:S.color,borderRadius:16,boxShadow:"0 8px 20px -8px rgba(0,0,0,0.15), inset 0 -6px 12px rgba(255,255,255,0.3)"},animate:{y:[0,-4,0]},transition:{duration:3+S.id*.3,repeat:1/0,ease:"easeInOut"}},S.id)),l.length>1&&s.jsx("svg",{className:"sr-cut-line",style:{position:"absolute",inset:0,pointerEvents:"none"},children:s.jsx("polyline",{points:l.map(S=>`${S.x},${S.y}`).join(" "),fill:"none",stroke:"#fff",strokeWidth:3,strokeLinecap:"round",strokeLinejoin:"round",opacity:.85})})]}),s.jsx("p",{className:"sr-game-tip",children:"拖动划线，切开它们。"})]})},lk=()=>{const a=j.useRef(null),i=j.useRef([]),o=j.useRef(!1),l=j.useRef(null),c=j.useRef(0),f=j.useRef({w:0,h:0}),p=j.useRef([]),m=()=>{const S=a.current,N=window.devicePixelRatio||1,C=S.getBoundingClientRect();f.current={w:C.width,h:C.height},S.width=C.width*N,S.height=C.height*N,S.getContext("2d").setTransform(N,0,0,N,0,0);const z=Math.ceil(C.width/8);p.current=new Array(z).fill(C.height)};j.useEffect(()=>{m();const S=()=>m();window.addEventListener("resize",S);const N=()=>{const{w:C,h:T}=f.current,z=a.current.getContext("2d");z.clearRect(0,0,C,T);const E=.35,A=i.current;for(const R of A){if(!R.settled){R.vy+=E,R.x+=R.vx,R.y+=R.vy;const B=Math.max(0,Math.min(p.current.length-1,Math.floor(R.x/8)));if(R.y+R.r>=p.current[B]){R.y=p.current[B]-R.r,R.vy=0,R.vx=0,R.settled=!0;for(let _=Math.max(0,B-1);_<=Math.min(p.current.length-1,B+1);_++)p.current[_]=Math.max(0,Math.min(p.current[_],R.y-R.r))}(R.x<-20||R.x>C+20)&&(R.settled=!0)}z.beginPath(),z.arc(R.x,R.y,R.r,0,Math.PI*2),z.fillStyle=R.color,z.fill()}c.current=requestAnimationFrame(N)};return c.current=requestAnimationFrame(N),()=>{window.removeEventListener("resize",S),cancelAnimationFrame(c.current)}},[]);const h=S=>{const N=a.current.getBoundingClientRect();return{x:S.clientX-N.left,y:S.clientY-N.top}},g=S=>{o.current=!0,l.current=h(S),x(l.current)},b=S=>{if(!o.current)return;const N=h(S),C=l.current,T=N.x-C.x,z=N.y-C.y,E=Math.hypot(T,z),A=Math.max(1,Math.floor(E/4));for(let R=1;R<=A;R++)x({x:C.x+T*R/A,y:C.y+z*R/A});l.current=N},y=()=>{o.current=!1,l.current=null},x=S=>{i.current.push({x:S.x,y:S.y,vx:0,vy:0,r:4+Math.random()*3,color:Kt[Math.floor(Math.random()*Kt.length)],settled:!1}),i.current.length>600&&i.current.splice(0,100)},w=()=>{i.current=[];const{h:S}=f.current;p.current=new Array(Math.ceil(f.current.w/8)).fill(S)};return s.jsxs("div",{className:"sr-game-stage sr-doodle",children:[s.jsx("canvas",{ref:a,className:"sr-doodle-canvas",style:{touchAction:"none"},onPointerDown:g,onPointerMove:b,onPointerUp:y,onPointerLeave:y}),s.jsx("button",{className:"sr-trash",onClick:w,"aria-label":"清空画布",children:"🗑"}),s.jsx("p",{className:"sr-game-tip",children:"画几笔，看它们落下。"})]})},ck=[{key:"pop",name:"无限捏泡泡",desc:"永远捏不完的满足。",icon:"🫧",gradient:"linear-gradient(135deg, #ffd6e0, #b6d5e8)"},{key:"cut",name:"禅意切割",desc:"一刀两半，万物可裂。",icon:"🔪",gradient:"linear-gradient(135deg, #b8e0d2, #d4c5e2)"},{key:"doodle",name:"重力涂鸦",desc:"画下的都会落下。",icon:"✏️",gradient:"linear-gradient(135deg, #f5e1b8, #ffb6c1)"}],uk=()=>{const[a,i]=j.useState(null);return s.jsxs("div",{className:"sr-page",children:[s.jsxs("header",{className:"sr-topbar",children:[s.jsx(rt,{to:"/mickey",className:"sr-back",children:"← 回到妙妙工具箱"}),s.jsx("span",{className:"sr-topbar-meta",children:"Stress Relief Room"})]}),s.jsxs("section",{className:"sr-hero",children:[s.jsx(X.h1,{className:"sr-title",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6},children:"解压馆"}),s.jsx(X.p,{className:"sr-subtitle",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6,delay:.12},children:"允许一切崩塌。"})]}),s.jsx("section",{className:"sr-content",children:s.jsx(Ne,{mode:"wait",children:a===null?s.jsx(X.div,{className:"sr-cards",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:ck.map(o=>s.jsxs(X.button,{className:"sr-card",onClick:()=>i(o.key),whileHover:{y:-6},initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.4},children:[s.jsx("div",{className:"sr-card-icon",style:{background:o.gradient},children:o.icon}),s.jsx("h3",{className:"sr-card-name",children:o.name}),s.jsx("p",{className:"sr-card-desc",children:o.desc}),s.jsx("span",{className:"sr-card-play",children:"开始 →"})]},o.key))},"cards"):s.jsxs(X.div,{className:"sr-game-view",initial:{opacity:0,scale:.96},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.96},children:[s.jsx("button",{className:"sr-game-back",onClick:()=>i(null),children:"← 换一个"}),a==="pop"&&s.jsx(rk,{}),a==="cut"&&s.jsx(ok,{}),a==="doodle"&&s.jsx(lk,{})]},"game")})}),s.jsx("style",{children:`
        .sr-page,
        .sr-page * { cursor: auto; }
        .sr-page a, .sr-page button { cursor: pointer; }

        .sr-page {
          min-height: 100vh;
          color: #5a4a52;
          background:
            radial-gradient(120% 80% at 50% 0%, #fdf6f8 0%, #f7f3f5 50%, #f0eaef 100%);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 80px;
        }

        /* 顶部 */
        .sr-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 860px; margin: 0 auto; padding: 24px 4px 0;
        }
        .sr-back {
          font-size: 14px; color: #9a8a92; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .sr-back:hover { color: #d48a9a; transform: translateX(-3px); }
        .sr-topbar-meta {
          font-size: 11px; color: #b8a8b0; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 标题区 */
        .sr-hero {
          max-width: 860px; margin: 0 auto; padding: 44px 4px 32px; text-align: center;
        }
        .sr-title {
          font-size: clamp(30px, 5vw, 44px); font-weight: 800; color: #6b5560;
          margin: 0 0 10px; letter-spacing: 0.06em;
        }
        .sr-subtitle {
          font-size: 15px; color: #a898a0; margin: 0; letter-spacing: 0.08em;
        }

        /* 内容区 */
        .sr-content { max-width: 860px; margin: 0 auto; }

        /* 卡片列表（横向滚动，移动端纵向） */
        .sr-cards {
          display: flex; gap: 20px; padding: 8px 4px;
          overflow-x: auto; scrollbar-width: thin;
        }
        .sr-cards::-webkit-scrollbar { height: 6px; }
        .sr-cards::-webkit-scrollbar-thumb { background: rgba(180,140,160,0.3); border-radius: 3px; }
        @media (max-width: 640px) {
          .sr-cards { flex-direction: column; }
        }

        .sr-card {
          flex-shrink: 0; width: 240px; text-align: left; padding: 28px 24px;
          background: #fff; border: 1px solid #ece4e8; border-radius: 18px;
          box-shadow: 0 10px 30px -14px rgba(150,120,140,0.2);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .sr-card:hover {
          border-color: rgba(212,138,154,0.4);
          box-shadow: 0 18px 40px -14px rgba(150,120,140,0.3);
        }
        @media (max-width: 640px) { .sr-card { width: 100%; } }
        .sr-card-icon {
          width: 56px; height: 56px; border-radius: 16px; display: flex;
          align-items: center; justify-content: center; font-size: 28px; margin-bottom: 18px;
          box-shadow: inset 0 -4px 10px rgba(255,255,255,0.4);
        }
        .sr-card-name { font-size: 17px; font-weight: 700; color: #5a4a52; margin: 0 0 6px; }
        .sr-card-desc { font-size: 13px; color: #a898a0; margin: 0 0 16px; line-height: 1.6; }
        .sr-card-play { font-size: 13px; color: #d48a9a; font-weight: 600; letter-spacing: 0.04em; }

        /* 游戏视图 */
        .sr-game-view { position: relative; padding: 8px 4px; }
        .sr-game-back {
          font-size: 13px; color: #9a8a92; background: none; border: none;
          padding: 0 0 16px; font-family: inherit; transition: color 0.2s ease;
        }
        .sr-game-back:hover { color: #d48a9a; }

        .sr-game-stage {
          display: flex; flex-direction: column; align-items: center;
          background: #fff; border: 1px solid #ece4e8; border-radius: 18px;
          padding: 32px 24px; min-height: 420px;
          box-shadow: 0 10px 30px -14px rgba(150,120,140,0.15);
        }
        .sr-game-tip { margin: 20px 0 0; font-size: 13px; color: #b8a8b0; letter-spacing: 0.05em; }
        .sr-pop-svg { max-width: 100%; }

        /* 禅意切割 */
        .sr-zencut { align-items: stretch; }
        .sr-zencut-area {
          position: relative; width: 100%; height: 360px; border-radius: 14px;
          background: linear-gradient(160deg, #f7f3f5, #efe9ee);
          overflow: hidden;
        }
        .sr-cut-line { width: 100%; height: 100%; }

        /* 重力涂鸦 */
        .sr-doodle { padding: 0; overflow: hidden; position: relative; }
        .sr-doodle-canvas { display: block; width: 100%; height: 420px; border-radius: 18px; }
        .sr-trash {
          position: absolute; bottom: 56px; right: 20px; z-index: 5;
          width: 44px; height: 44px; border-radius: 50%; border: none;
          background: #fff; font-size: 18px; box-shadow: 0 4px 14px -4px rgba(0,0,0,0.2);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .sr-trash:hover { transform: scale(1.1); background: #fff5f7; }
      `})]})},Nd=[{id:1,name:"大理",province:"云南",slogan:"风花雪月的慢生活",imageUrl:"https://images.unsplash.com/photo-1531219573917-2ca59e96bc0e?w=800&h=600&fit=crop",days:5,play:[{name:"洱海骑行",rating:5},{name:"苍山索道",rating:4},{name:"喜洲古镇",rating:4}],eat:[{name:"石锅鱼",price:"¥120/人",signature:"洱海弓鱼"},{name:"烤乳扇",price:"¥10/份"}],stay:"古城里的白族小院，推窗见苍山。",tips:"环洱海建议租电动车，防晒很重要。古城晚上很热闹，但清晨最安静。"},{id:2,name:"成都",province:"四川",slogan:"一座来了就不想走的城",imageUrl:"https://images.unsplash.com/photo-1593696954577-ab3d39317b97?w=800&h=600&fit=crop",days:4,play:[{name:"大熊猫繁育基地",rating:5},{name:"宽窄巷子",rating:4},{name:"杜甫草堂",rating:4}],eat:[{name:"小龙坎火锅",price:"¥90/人",signature:"牛油锅底"},{name:"陈麻婆豆腐",price:"¥40/人"}],stay:"春熙路附近，交通方便，夜宵下楼就有。",tips:"熊猫基地一定要早去！8点前到能看到活跃的熊猫。茶馆发呆是必修课。"},{id:3,name:"苏州",province:"江苏",slogan:"小桥流水人家的江南梦",imageUrl:"https://images.unsplash.com/photo-1599779019475-d5c9e7c2c1f0?w=800&h=600&fit=crop",days:3,play:[{name:"拙政园",rating:5},{name:"平江路",rating:4},{name:"虎丘",rating:4}],eat:[{name:"松鹤楼",price:"¥150/人",signature:"松鼠桂鱼"},{name:"哑巴生煎",price:"¥25/人"}],stay:"平江路民宿，推门就是水巷。",tips:"园林建议错峰，工作日早晨人最少。评弹博物馆值得去，免费且安静。"},{id:4,name:"厦门",province:"福建",slogan:"海风里藏着文艺的味道",imageUrl:"https://images.unsplash.com/photo-1528219089975-1c5b2c2c3c1f?w=800&h=600&fit=crop",days:4,play:[{name:"鼓浪屿",rating:5},{name:"曾厝垵",rating:4},{name:"环岛路骑行",rating:5}],eat:[{name:"沙茶面",price:"¥25/人"},{name:"海蛎煎",price:"¥30/人"}],stay:"曾厝垵的文艺客栈，离海步行 5 分钟。",tips:"鼓浪屿船票提前买！岛上没有车，穿好走的鞋。日落去日光岩。"},{id:5,name:"西安",province:"陕西",slogan:"一眼千年，长安如故",imageUrl:"https://images.unsplash.com/photo-1591851658485-c5f6c6b7e0e8?w=800&h=600&fit=crop",days:5,play:[{name:"秦始皇兵马俑",rating:5},{name:"大唐不夜城",rating:5},{name:"城墙骑行",rating:4}],eat:[{name:"回民街老孙家",price:"¥60/人",signature:"羊肉泡馍"},{name:"肉夹馍",price:"¥12/个"}],stay:"钟楼附近，夜景绝美，去哪都方便。",tips:"兵马俑请讲解员！不然就是看泥人。城墙骑行选傍晚，不晒还凉快。"},{id:6,name:"杭州",province:"浙江",slogan:"山寺月中寻桂子",imageUrl:"https://images.unsplash.com/photo-1591868050309-7d2b1e2f6c1a?w=800&h=600&fit=crop",days:4,play:[{name:"西湖泛舟",rating:5},{name:"灵隐寺",rating:5},{name:"龙井村采茶",rating:4}],eat:[{name:"楼外楼",price:"¥200/人",signature:"西湖醋鱼"},{name:"知味观小笼",price:"¥35/人"}],stay:"西湖边民宿，清晨湖边散步没人打扰。",tips:"西湖别只逛断桥！苏堤人少景美。秋天满陇桂雨的香气会记住一辈子。"}],$x=[{name:"黑龙江",x:330,y:20,w:50,h:35,visited:!1,count:0},{name:"吉林",x:315,y:58,w:38,h:28,visited:!1,count:0},{name:"辽宁",x:300,y:90,w:42,h:28,visited:!1,count:0},{name:"内蒙古",x:200,y:30,w:110,h:35,visited:!1,count:0},{name:"北京",x:270,y:75,w:22,h:18,visited:!0,count:3},{name:"河北",x:255,y:95,w:48,h:32,visited:!0,count:2},{name:"山西",x:225,y:100,w:30,h:35,visited:!1,count:0},{name:"新疆",x:60,y:45,w:90,h:55,visited:!1,count:0},{name:"甘肃",x:150,y:80,w:48,h:50,visited:!1,count:0},{name:"陕西",x:200,y:110,w:32,h:40,visited:!0,count:1},{name:"青海",x:100,y:130,w:55,h:38,visited:!1,count:0},{name:"西藏",x:40,y:160,w:80,h:60,visited:!1,count:0},{name:"四川",x:165,y:160,w:50,h:48,visited:!0,count:1},{name:"重庆",x:215,y:175,w:22,h:25,visited:!1,count:0},{name:"云南",x:130,y:220,w:48,h:42,visited:!0,count:1},{name:"贵州",x:185,y:210,w:30,h:30,visited:!1,count:0},{name:"湖北",x:225,y:150,w:38,h:32,visited:!1,count:0},{name:"河南",x:230,y:120,w:36,h:28,visited:!1,count:0},{name:"山东",x:275,y:115,w:42,h:28,visited:!1,count:0},{name:"江苏",x:275,y:150,w:36,h:28,visited:!0,count:1},{name:"安徽",x:255,y:150,w:24,h:32,visited:!1,count:0},{name:"浙江",x:285,y:182,w:32,h:28,visited:!0,count:1},{name:"上海",x:305,y:168,w:16,h:16,visited:!0,count:5},{name:"江西",x:260,y:200,w:32,h:32,visited:!1,count:0},{name:"湖南",x:220,y:195,w:34,h:32,visited:!1,count:0},{name:"福建",x:285,y:215,w:32,h:35,visited:!0,count:1},{name:"广东",x:250,y:235,w:42,h:30,visited:!1,count:0},{name:"广西",x:205,y:235,w:38,h:30,visited:!1,count:0},{name:"海南",x:230,y:275,w:28,h:18,visited:!1,count:0}],dk=360,fk=310,Zx="#5d8a6a",Qx="#e8e2d4",pk=()=>{const[a,i]=j.useState(null),[o,l]=j.useState({x:0,y:0}),[c,f]=j.useState(null),p=j.useMemo(()=>{const h=$x.filter(y=>y.visited).length,g=Nd.length,b=Nd.reduce((y,x)=>y+x.days,0);return{visitedProvinces:h,totalCities:g,totalDays:b}},[]);j.useEffect(()=>{if(c)return document.body.style.overflow="hidden",()=>{document.body.style.overflow=""}},[c]);const m=(h,g)=>{i(h);const b=g.currentTarget.closest("svg").getBoundingClientRect();l({x:g.clientX-b.left,y:g.clientY-b.top})};return s.jsxs("div",{className:"travel-page",children:[s.jsxs("header",{className:"travel-hero",children:[s.jsx("div",{className:"travel-hero-bg"}),s.jsx("div",{className:"travel-hero-grain"}),s.jsxs("div",{className:"travel-hero-content",children:[s.jsx(rt,{to:"/mickey",className:"travel-back",children:"← 回到妙妙工具箱"}),s.jsx(X.h1,{className:"travel-hero-title",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.8},children:"漫游指南"}),s.jsx(X.p,{className:"travel-hero-sub",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.8,delay:.15},children:"走过的路，看过的云。"}),s.jsx("span",{className:"travel-hero-meta",children:"Travel Log"})]})]}),s.jsxs("section",{className:"travel-section",children:[s.jsxs("div",{className:"travel-section-head",children:[s.jsx("span",{className:"travel-stamp",children:"足迹"}),s.jsx("h2",{className:"travel-section-title",children:"走过的土地"})]}),s.jsxs("div",{className:"travel-map-wrap",children:[s.jsx("svg",{viewBox:`0 0 ${dk} ${fk}`,className:"travel-map",onMouseLeave:()=>i(null),children:$x.map(h=>s.jsxs("g",{children:[s.jsx("rect",{x:h.x,y:h.y,width:h.w,height:h.h,rx:5,fill:h.visited?Zx:Qx,stroke:h.visited?"#4d7a5a":"#d4ccbe",strokeWidth:.6,opacity:(a==null?void 0:a.name)===h.name?1:h.visited?.85:.6,style:{cursor:"pointer",transition:"opacity 0.2s ease"},onMouseEnter:g=>m(h,g),onMouseMove:g=>m(h,g)}),s.jsx("text",{x:h.x+h.w/2,y:h.y+h.h/2+3,textAnchor:"middle",fontSize:h.name.length>2?6.5:7.5,fill:h.visited?"#fff":"#a89e8e",style:{pointerEvents:"none",userSelect:"none"},children:h.name})]},h.name))}),a&&s.jsx("div",{className:"travel-tooltip",style:{left:o.x,top:o.y},children:a.visited?s.jsxs("span",{children:[a.name,"：去过 ",a.count," 次"]}):s.jsxs("span",{children:[a.name,"：还没去过"]})}),s.jsxs("div",{className:"travel-legend",children:[s.jsxs("span",{className:"travel-legend-item",children:[s.jsx("span",{className:"travel-legend-dot",style:{background:Zx}}),"已去过"]}),s.jsxs("span",{className:"travel-legend-item",children:[s.jsx("span",{className:"travel-legend-dot",style:{background:Qx}}),"待探索"]})]})]}),s.jsxs("div",{className:"travel-stats",children:[s.jsxs("div",{className:"travel-stat-pill",children:[s.jsx("span",{className:"travel-stat-emoji",children:"📍"}),s.jsx("span",{className:"travel-stat-num",children:p.visitedProvinces}),s.jsx("span",{className:"travel-stat-label",children:"省"})]}),s.jsxs("div",{className:"travel-stat-pill",children:[s.jsx("span",{className:"travel-stat-emoji",children:"🏙️"}),s.jsx("span",{className:"travel-stat-num",children:p.totalCities}),s.jsx("span",{className:"travel-stat-label",children:"城"})]}),s.jsxs("div",{className:"travel-stat-pill",children:[s.jsx("span",{className:"travel-stat-emoji",children:"📅"}),s.jsx("span",{className:"travel-stat-num",children:p.totalDays}),s.jsx("span",{className:"travel-stat-label",children:"天"})]})]})]}),s.jsxs("section",{className:"travel-section",children:[s.jsxs("div",{className:"travel-section-head",children:[s.jsx("span",{className:"travel-stamp",children:"攻略"}),s.jsx("h2",{className:"travel-section-title",children:"城市记忆"})]}),s.jsx("div",{className:"travel-cards-scroll",children:s.jsx("div",{className:"travel-cards-track",children:Nd.map((h,g)=>s.jsxs(X.button,{className:"travel-city-card",onClick:()=>f(h),initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-30px"},transition:{duration:.5,delay:g*.08},whileHover:{y:-6},children:[s.jsxs("div",{className:"travel-card-img-wrap",children:[s.jsx("img",{src:h.imageUrl,alt:h.name,loading:"lazy"}),s.jsx("div",{className:"travel-card-tape"}),s.jsxs("span",{className:"travel-card-days",children:[h.days,"天"]})]}),s.jsxs("div",{className:"travel-card-body",children:[s.jsx("h3",{className:"travel-card-name",children:h.name}),s.jsx("p",{className:"travel-card-slogan",children:h.slogan}),s.jsx("span",{className:"travel-card-province",children:h.province})]}),s.jsx("span",{className:"travel-card-cta",children:"查看攻略 →"})]},h.id))})})]}),s.jsx("footer",{className:"travel-foot",children:s.jsx("span",{children:"走过的路都算数，看过的云都不散。"})}),s.jsx(Ne,{children:c&&s.jsx(X.div,{className:"travel-modal-overlay",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>f(null),children:s.jsxs(X.div,{className:"travel-modal",initial:{scale:.92,y:30},animate:{scale:1,y:0},exit:{scale:.92,y:30},transition:{type:"spring",stiffness:180,damping:20},onClick:h=>h.stopPropagation(),children:[s.jsx("button",{className:"travel-modal-close",onClick:()=>f(null),"aria-label":"关闭",children:"×"}),s.jsxs("div",{className:"travel-modal-cover",children:[s.jsx("img",{src:c.imageUrl,alt:c.name}),s.jsx("div",{className:"travel-modal-cover-tint"}),s.jsxs("div",{className:"travel-modal-cover-text",children:[s.jsx("h3",{className:"travel-modal-name",children:c.name}),s.jsx("p",{className:"travel-modal-slogan",children:c.slogan})]})]}),s.jsxs("div",{className:"travel-modal-body",children:[s.jsxs("div",{className:"travel-modal-section",children:[s.jsx("h4",{className:"travel-modal-h4",children:"🎯 玩"}),s.jsx("ul",{className:"travel-modal-list",children:c.play.map(h=>s.jsxs("li",{className:"travel-modal-list-item",children:[s.jsx("span",{children:h.name}),s.jsxs("span",{className:"travel-modal-rating",children:["★".repeat(h.rating),s.jsx("span",{className:"travel-modal-rating-empty",children:"★".repeat(5-h.rating)})]})]},h.name))})]}),s.jsxs("div",{className:"travel-modal-section",children:[s.jsx("h4",{className:"travel-modal-h4",children:"🍜 吃"}),s.jsx("ul",{className:"travel-modal-list",children:c.eat.map(h=>s.jsxs("li",{className:"travel-modal-list-item",children:[s.jsxs("span",{children:[h.name,h.signature&&s.jsxs("em",{className:"travel-modal-signature",children:[" · ",h.signature]})]}),s.jsx("span",{className:"travel-modal-price",children:h.price})]},h.name))})]}),s.jsxs("div",{className:"travel-modal-section",children:[s.jsx("h4",{className:"travel-modal-h4",children:"🛏️ 住"}),s.jsx("p",{className:"travel-modal-text",children:c.stay})]}),s.jsxs("div",{className:"travel-modal-section travel-modal-tips",children:[s.jsx("h4",{className:"travel-modal-h4",children:"💡 Tips"}),s.jsx("p",{className:"travel-modal-text",children:c.tips})]})]})]})})}),s.jsx("style",{children:`
        .travel-page,
        .travel-page * { cursor: auto; }
        .travel-page a, .travel-page button { cursor: pointer; }

        .travel-page {
          min-height: 100vh; color: #4a4036;
          background: #faf6ee;
          font-family: "Noto Sans SC", system-ui, sans-serif;
        }

        /* Hero */
        .travel-hero {
          position: relative; height: 52vh; min-height: 360px;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .travel-hero-bg {
          position: absolute; inset: 0;
          background: url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=900&fit=crop") center/cover;
          filter: blur(3px) brightness(0.7);
          transform: scale(1.05);
        }
        .travel-hero-grain {
          position: absolute; inset: 0; opacity: 0.08; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .travel-hero-content { position: relative; z-index: 2; text-align: center; }
        .travel-back {
          position: absolute; top: 16px; left: 16px;
          font-size: 14px; color: rgba(255,255,255,0.8); text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease;
        }
        .travel-back:hover { color: #fff; }
        .travel-hero-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(36px, 6vw, 56px); font-weight: 700; color: #fff;
          margin: 0 0 12px; letter-spacing: 0.1em;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }
        .travel-hero-sub {
          font-size: 16px; color: rgba(255,255,255,0.85); margin: 0;
          letter-spacing: 0.12em; font-style: italic;
        }
        .travel-hero-meta {
          display: block; margin-top: 16px; font-size: 11px;
          color: rgba(255,255,255,0.5); letter-spacing: 0.3em; text-transform: uppercase;
        }

        /* Section */
        .travel-section { max-width: 960px; margin: 0 auto; padding: 56px 24px; }
        .travel-section-head { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; }
        .travel-stamp {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 3px 14px; border: 2px solid #b07832; border-radius: 4px;
          font-size: 13px; font-weight: 700; color: #b07832;
          transform: rotate(-3deg); opacity: 0.8;
        }
        .travel-section-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 26px; font-weight: 700; color: #5d8a6a; margin: 0;
        }

        /* 地图 */
        .travel-map-wrap {
          position: relative; background: #fffdf6;
          border: 1px solid #ece4d4; border-radius: 14px;
          padding: 24px; box-shadow: 0 10px 30px -14px rgba(120,100,60,0.15);
        }
        .travel-map { display: block; width: 100%; max-width: 520px; height: auto; margin: 0 auto; }
        .travel-tooltip {
          position: absolute; z-index: 10; pointer-events: none;
          padding: 6px 12px; border-radius: 6px;
          background: rgba(74,64,54,0.92); color: #fff; font-size: 12px;
          white-space: nowrap; transform: translate(-50%, -130%);
          box-shadow: 0 4px 14px -4px rgba(0,0,0,0.3);
        }
        .travel-legend {
          display: flex; justify-content: center; gap: 24px; margin-top: 16px;
        }
        .travel-legend-item {
          display: flex; align-items: center; gap: 6px; font-size: 13px; color: #9a8a7e;
        }
        .travel-legend-dot { width: 12px; height: 12px; border-radius: 3px; }

        /* 数据看板 */
        .travel-stats {
          display: flex; justify-content: center; gap: 16px; margin-top: 28px;
        }
        .travel-stat-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 20px; border-radius: 999px;
          background: #fff; border: 1px solid #ece4d4;
          box-shadow: 0 4px 14px -6px rgba(120,100,60,0.12);
        }
        .travel-stat-emoji { font-size: 16px; }
        .travel-stat-num { font-size: 20px; font-weight: 700; color: #5d8a6a; }
        .travel-stat-label { font-size: 13px; color: #9a8a7e; }

        /* 城市卡片横向滚动 */
        .travel-cards-scroll {
          overflow-x: auto; scrollbar-width: thin; scrollbar-color: #c8924a transparent;
          -webkit-overflow-scrolling: touch;
        }
        .travel-cards-scroll::-webkit-scrollbar { height: 6px; }
        .travel-cards-scroll::-webkit-scrollbar-thumb { background: rgba(200,146,74,0.3); border-radius: 3px; }
        .travel-cards-track {
          display: flex; gap: 20px; padding: 8px 4px 20px;
          scroll-snap-type: x mandatory;
        }
        .travel-city-card {
          flex-shrink: 0; width: 280px; scroll-snap-align: start;
          background: #fff; border: 1px solid #ece4d4; border-radius: 12px;
          overflow: hidden; text-align: left; padding: 0;
          box-shadow: 0 10px 28px -12px rgba(120,100,60,0.18);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .travel-city-card:hover {
          border-color: rgba(93,138,106,0.4);
          box-shadow: 0 18px 40px -12px rgba(120,100,60,0.28);
        }
        @media (max-width: 640px) { .travel-city-card { width: 85vw; } }
        .travel-card-img-wrap { position: relative; height: 180px; overflow: hidden; }
        .travel-card-img-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: sepia(0.1) saturate(0.9);
        }
        .travel-card-tape {
          position: absolute; top: -8px; left: 50%; transform: translateX(-50%) rotate(-2deg);
          width: 70px; height: 22px; background: rgba(255,235,180,0.7);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .travel-card-days {
          position: absolute; bottom: 8px; right: 8px;
          padding: 2px 10px; border-radius: 999px;
          font-size: 12px; color: #fff; background: rgba(93,138,106,0.85);
        }
        .travel-card-body { padding: 16px 18px 8px; }
        .travel-card-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 20px; font-weight: 700; color: #4a4036; margin: 0 0 4px;
        }
        .travel-card-slogan { font-size: 13px; color: #8a7a6e; margin: 0 0 8px; }
        .travel-card-province {
          font-size: 11px; color: #b07832; letter-spacing: 0.1em;
        }
        .travel-card-cta {
          display: block; padding: 12px 18px 16px; font-size: 13px;
          color: #5d8a6a; font-weight: 600; letter-spacing: 0.03em;
        }

        /* 页脚 */
        .travel-foot {
          text-align: center; padding: 32px 24px 56px;
          font-size: 13px; color: #b8aa9a; font-style: italic; letter-spacing: 0.06em;
        }

        /* Modal */
        .travel-modal-overlay {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 20px;
          background: rgba(40,32,24,0.7); backdrop-filter: blur(6px);
        }
        .travel-modal {
          position: relative; width: 100%; max-width: 500px;
          background: #fffdf6; border-radius: 14px; overflow: hidden;
          box-shadow: 0 30px 80px -20px rgba(0,0,0,0.5);
          max-height: 90vh; overflow-y: auto;
        }
        .travel-modal-close {
          position: absolute; top: 12px; right: 14px; z-index: 5;
          width: 34px; height: 34px; border: none; border-radius: 50%;
          background: rgba(255,255,255,0.85); color: #4a4036; font-size: 22px;
          display: flex; align-items: center; justify-content: center;
        }
        .travel-modal-close:hover { background: #fff; }
        .travel-modal-cover { position: relative; height: 200px; overflow: hidden; }
        .travel-modal-cover img {
          width: 100%; height: 100%; object-fit: cover;
          filter: sepia(0.1) brightness(0.85);
        }
        .travel-modal-cover-tint {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.5));
        }
        .travel-modal-cover-text {
          position: absolute; bottom: 20px; left: 24px; right: 24px;
        }
        .travel-modal-name {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 4px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }
        .travel-modal-slogan { font-size: 14px; color: rgba(255,255,255,0.9); margin: 0; font-style: italic; }
        .travel-modal-body { padding: 24px; }
        .travel-modal-section { margin-bottom: 24px; }
        .travel-modal-h4 {
          font-size: 16px; font-weight: 700; color: #5d8a6a; margin: 0 0 12px;
        }
        .travel-modal-list { list-style: none; margin: 0; padding: 0; }
        .travel-modal-list-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 0; border-bottom: 1px dashed #ece4d4; font-size: 14px; color: #4a4036;
        }
        .travel-modal-rating { color: #f5a623; font-size: 13px; letter-spacing: 1px; }
        .travel-modal-rating-empty { color: #ddd4c6; }
        .travel-modal-signature { font-style: normal; color: #b07832; font-size: 12px; }
        .travel-modal-price { color: #8a7a6e; font-size: 13px; }
        .travel-modal-text { font-size: 14px; line-height: 1.8; color: #6b5e50; margin: 0; }
        .travel-modal-tips {
          padding: 16px; border-radius: 8px; background: rgba(176,120,50,0.06);
          border-left: 3px solid #c8924a;
        }
        .travel-modal-tips .travel-modal-text { font-size: 13px; }

        @media (max-width: 640px) {
          .travel-modal-cover { height: 160px; }
          .travel-modal-body { padding: 20px; }
        }
      `})]})},Cd=[{freq:"FM 88.6",signal:"不必想清楚再开始。先把任务拆到「5 分钟就能做完」的那一格，只做这一格，其余暂时断电。"},{freq:"FM 92.1",signal:"焦虑的噪音来自「全部」。试着今天只完成 5%——写一行字、读一页书。5% 也是改变，且它会被身体记住。"},{freq:"FM 95.8",signal:"拖延不是懒，是启动电阻太大。降低电压：告诉自己「只做两分钟」，两分钟后允许自己停下。往往停不下来。"},{freq:"FM 98.3",signal:"把「我必须搞定」调频成「我先试一次」。允许结果不完美，允许这一版只是草稿。草稿存在，就是信号。"},{freq:"FM 103.7",signal:"困扰反复出现，说明旧频段卡住了。今天做一件和平时相反的小事：换个路线、换只手刷牙。5% 的扰动，会松动惯性。"},{freq:"FM 106.5",signal:"不必对抗情绪，只需给它一个出口。写下「我现在感到___」，填一个词。命名本身，就是把噪音调小一档。"}];let Td=null;const v1=()=>{if(!Td){const a=window.AudioContext||window.webkitAudioContext;Td=new a}return Td},hk=()=>{try{const a=v1(),i=a.currentTime,o=a.createBuffer(1,a.sampleRate*.8,a.sampleRate),l=o.getChannelData(0);for(let m=0;m<l.length;m++)l[m]=Math.random()*2-1;const c=a.createBufferSource();c.buffer=o;const f=a.createBiquadFilter();f.type="bandpass",f.Q.value=4,f.frequency.setValueAtTime(600,i),f.frequency.linearRampToValueAtTime(2400,i+.5),f.frequency.linearRampToValueAtTime(900,i+.75);const p=a.createGain();p.gain.setValueAtTime(.12,i),p.gain.linearRampToValueAtTime(.04,i+.6),p.gain.exponentialRampToValueAtTime(1e-4,i+.8),c.connect(f),f.connect(p),p.connect(a.destination),c.start(i),c.stop(i+.8)}catch{}},mk=()=>{try{const a=v1(),i=a.currentTime,o=a.createOscillator(),l=a.createGain();o.type="sine",o.frequency.setValueAtTime(1046,i),l.gain.setValueAtTime(.2,i),l.gain.exponentialRampToValueAtTime(1e-4,i+.5),o.connect(l),l.connect(a.destination),o.start(i),o.stop(i+.5)}catch{}},gk=()=>{const[a,i]=j.useState(""),[o,l]=j.useState("idle"),[c,f]=j.useState(null),p=()=>{const g=a.trim();g&&(hk(),l("tuning"),f(null),window.setTimeout(()=>{const b=Cd[(g.length+Math.floor(Math.random()*Cd.length))%Cd.length];f(b),l("clear"),mk()},1200))},m=()=>{l("idle"),f(null),i("")},h=j.useMemo(()=>o==="tuning"?720:o==="clear"?135:0,[o]);return s.jsxs("div",{className:"tune-page",children:[s.jsxs("header",{className:"tune-topbar",children:[s.jsx(rt,{to:"/mickey",className:"tune-back",children:"← 回到妙妙工具箱"}),s.jsx("span",{className:"tune-topbar-meta",children:"System Tuning"})]}),s.jsxs("section",{className:"tune-hero",children:[s.jsxs(X.div,{className:"tune-knob-wrap",initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},transition:{duration:.7},children:[s.jsx(X.div,{className:"tune-knob",animate:{rotate:h},transition:{duration:o==="tuning"?1.2:.5,ease:"easeInOut"},children:s.jsx("span",{className:"tune-knob-indicator"})}),s.jsx("div",{className:"tune-knob-ticks",children:Array.from({length:12}).map((g,b)=>s.jsx("span",{className:"tune-tick",style:{transform:`rotate(${b*30}deg)`}},b))})]}),s.jsx(X.h1,{className:"tune-title",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6},children:"系统调频"}),s.jsx(X.p,{className:"tune-subtitle",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6,delay:.12},children:"校准频率，让信号重新清晰。"})]}),s.jsxs(X.section,{className:"tune-console",initial:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{duration:.6,delay:.2},children:[s.jsxs("div",{className:"tune-console-screen",children:[s.jsxs("div",{className:"tune-screen-top",children:[s.jsxs("span",{className:"tune-screen-label",children:[o==="idle"&&"● 待机",o==="tuning"&&"◉ 调频中…",o==="clear"&&"✦ 信号清晰"]}),c&&s.jsx("span",{className:"tune-screen-freq",children:c.freq})]}),s.jsx("textarea",{className:"tune-input",placeholder:"当前信号不稳定，描述你的困扰…",value:a,rows:3,onChange:g=>i(g.target.value),onKeyDown:g=>{g.key==="Enter"&&(g.metaKey||g.ctrlKey)&&p()},disabled:o==="tuning"})]}),s.jsx("button",{type:"button",className:"tune-btn",onClick:p,disabled:!a.trim()||o==="tuning",children:o==="tuning"?"正在调频…":"开始调频"})]}),s.jsx(Ne,{children:o==="tuning"&&s.jsx(X.div,{className:"tune-static",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:s.jsx("span",{className:"tune-static-text",children:"沙沙沙… 正在搜索清晰频段"})})}),s.jsx(Ne,{children:o==="clear"&&c&&s.jsxs(X.section,{className:"tune-signal",initial:{opacity:0,y:36},animate:{opacity:1,y:0},exit:{opacity:0,y:20},transition:{duration:.7,ease:"easeOut"},children:[s.jsxs("div",{className:"tune-signal-head",children:[s.jsx("span",{className:"tune-signal-badge",children:"5% 微改变"}),s.jsx("span",{className:"tune-signal-freq",children:c.freq})]}),s.jsx("p",{className:"tune-signal-text",children:c.signal}),s.jsx("p",{className:"tune-signal-note",children:"不必改变 100%，只需今天的 5%。信号会被身体记住。"}),s.jsx("button",{type:"button",className:"tune-again",onClick:m,children:"重新调频"})]})}),s.jsxs("section",{className:"tune-dual",children:[s.jsx("span",{className:"tune-dual-line"}),s.jsxs("p",{className:"tune-dual-text",children:["情绪找",s.jsx("span",{className:"tune-dual-link",children:"解忧杂货铺"}),"，认知找",s.jsx("span",{className:"tune-dual-self",children:"系统调频"}),"。"]}),s.jsx("span",{className:"tune-dual-line"})]}),s.jsx("style",{children:`
        .tune-page,
        .tune-page * { cursor: auto; }
        .tune-page a, .tune-page button { cursor: pointer; }
        .tune-page textarea { cursor: text; }

        .tune-page {
          min-height: 100vh;
          color: #e8e4dc;
          background:
            radial-gradient(120% 80% at 50% 0%, #2a2620 0%, #1c1916 50%, #14110f 100%);
          font-family: "Noto Sans SC", system-ui, sans-serif;
          padding: 0 24px 80px;
        }

        /* 顶部 */
        .tune-topbar {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 640px; margin: 0 auto; padding: 24px 4px 0;
        }
        .tune-back {
          font-size: 14px; color: #8a8478; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease, transform 0.25s ease;
        }
        .tune-back:hover { color: #d4a85a; transform: translateX(-3px); }
        .tune-topbar-meta {
          font-size: 11px; color: #5a5448; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* 标题区 + 旋钮 */
        .tune-hero {
          max-width: 640px; margin: 0 auto; padding: 40px 4px 28px; text-align: center;
        }
        .tune-knob-wrap {
          position: relative; width: 96px; height: 96px; margin: 0 auto 22px;
        }
        .tune-knob {
          position: relative; width: 72px; height: 72px; border-radius: 50%;
          margin: 12px auto;
          background: radial-gradient(circle at 35% 30%, #6a6258, #3a342c 70%, #2a241e);
          box-shadow: 0 6px 18px -4px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1);
        }
        .tune-knob-indicator {
          position: absolute; top: 6px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 16px; border-radius: 2px;
          background: #d4a85a; box-shadow: 0 0 8px rgba(212,168,90,0.6);
        }
        .tune-knob-ticks {
          position: absolute; inset: 0; pointer-events: none;
        }
        .tune-tick {
          position: absolute; top: 0; left: 50%; width: 2px; height: 6px;
          margin-left: -1px; background: #5a5448; transform-origin: 50% 48px;
        }
        .tune-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(28px, 4.5vw, 38px); font-weight: 600;
          color: #e8e4dc; margin: 0 0 10px; letter-spacing: 0.08em;
        }
        .tune-subtitle {
          font-size: 15px; color: #9a9488; margin: 0; letter-spacing: 0.06em;
        }

        /* 控制台 */
        .tune-console {
          max-width: 640px; margin: 0 auto; padding: 28px;
          background: linear-gradient(160deg, #2a2620, #1f1c18);
          border: 1px solid #3a342c; border-radius: 16px;
          box-shadow: 0 14px 40px -16px rgba(0,0,0,0.6);
        }
        .tune-console-screen {
          background: #14110f; border: 1px solid #2a241e; border-radius: 10px;
          padding: 16px; margin-bottom: 18px;
        }
        .tune-screen-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .tune-screen-label {
          font-size: 12px; color: #d4a85a; letter-spacing: 0.1em;
          font-family: "Courier New", monospace;
        }
        .tune-screen-freq {
          font-size: 13px; color: #6a9a7a; font-family: "Courier New", monospace;
          letter-spacing: 0.08em;
        }
        .tune-input {
          width: 100%; border: none; resize: none; outline: none;
          background: transparent; font-family: inherit;
          font-size: 15px; line-height: 1.8; color: #d8d4cc;
        }
        .tune-input::placeholder { color: #5a5448; }
        .tune-input:disabled { opacity: 0.6; }

        .tune-btn {
          display: block; width: 100%; padding: 13px; border: none; border-radius: 10px;
          font-size: 15px; font-family: inherit; font-weight: 600; letter-spacing: 0.08em;
          color: #1c1916;
          background: linear-gradient(135deg, #d4a85a, #b88838);
          box-shadow: 0 6px 20px -6px rgba(212,168,90,0.4);
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .tune-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .tune-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* 调频中 */
        .tune-static { max-width: 640px; margin: 22px auto 0; text-align: center; }
        .tune-static-text {
          font-size: 13px; color: #8a8478; letter-spacing: 0.1em;
          font-family: "Courier New", monospace;
          animation: tune-blink 1s steps(2) infinite;
        }
        @keyframes tune-blink { 50% { opacity: 0.4; } }

        /* 信号结果 */
        .tune-signal {
          position: relative; max-width: 640px; margin: 22px auto 0;
          padding: 28px;
          background: linear-gradient(160deg, #1f2a24, #1a2420);
          border: 1px solid #3a4a40; border-radius: 16px;
          box-shadow: 0 16px 48px -20px rgba(106,154,122,0.3);
        }
        .tune-signal-head {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;
        }
        .tune-signal-badge {
          padding: 4px 12px; border-radius: 6px;
          font-size: 12px; font-weight: 700; color: #6a9a7a;
          background: rgba(106,154,122,0.12); border: 1px solid rgba(106,154,122,0.3);
          letter-spacing: 0.05em;
        }
        .tune-signal-freq {
          font-size: 13px; color: #d4a85a; font-family: "Courier New", monospace;
        }
        .tune-signal-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 17px; line-height: 2; color: #e0dcd2; margin: 0 0 18px;
          letter-spacing: 0.02em;
        }
        .tune-signal-note {
          font-size: 13px; color: #6a9a7a; margin: 0 0 22px; font-style: italic;
        }
        .tune-again {
          display: block; margin: 0 auto; padding: 9px 24px;
          border: 1px solid #3a4a40; border-radius: 999px;
          background: transparent; font-size: 13px; font-family: inherit;
          color: #9ac48a; letter-spacing: 0.05em;
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .tune-again:hover { background: rgba(106,154,122,0.08); border-color: #6a9a7a; }

        /* 双轨说明 */
        .tune-dual {
          max-width: 640px; margin: 56px auto 0;
          display: flex; align-items: center; gap: 16px;
        }
        .tune-dual-line { flex: 1; height: 1px; background: #2a241e; }
        .tune-dual-text {
          font-size: 13px; color: #6a6258; margin: 0; white-space: nowrap;
          letter-spacing: 0.04em;
        }
        .tune-dual-link { color: #c89868; }
        .tune-dual-self { color: #6a9a7a; }

        @media (max-width: 520px) {
          .tune-console, .tune-signal { padding: 22px 18px; }
          .tune-dual { display: none; }
        }
      `})]})},it={reading:"lf_reading",photos:"lf_photos",tracks:"lf_tracks",sports:"lf_sports",meditations:"lf_meditations",dramas:"lf_dramas"},xk=[{id:"1",title:"百年孤独",author:"加西亚·马尔克斯",cover:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop",quote:"生命从来不曾离开孤独而独立存在。",date:"2024.09 · 重读"},{id:"2",title:"小王子",author:"安托万·德·圣-埃克苏佩里",cover:"https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=280&fit=crop",quote:"真正重要的东西，用眼睛是看不见的。",date:"2024.06 · 初读"},{id:"3",title:"瓦尔登湖",author:"亨利·梭罗",cover:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=280&fit=crop",quote:"我步入丛林，因为我希望生活得有意义。",date:"2024.03 · 初读"},{id:"4",title:"被讨厌的勇气",author:"岸见一郎 / 古贺史健",cover:"https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=280&fit=crop",quote:"自由就是被别人讨厌。",date:"2023.11 · 初读"},{id:"5",title:"当下的力量",author:"埃克哈特·托利",cover:"https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200&h=280&fit=crop",quote:"臣服不是妥协，而是接受当下的存在。",date:"2023.08 · 初读"},{id:"6",title:"设计心理学",author:"唐·诺曼",cover:"https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=280&fit=crop",quote:"设计不是关于物品的外观，而是关于物品如何运作。",date:"2023.05 · 初读"}],yk=[{id:"1",src:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",title:"山间晨雾",date:"2025.03",desc:"凌晨五点的山间，空气里都是安静的味道"},{id:"2",src:"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",title:"星空与雪",date:"2025.01",desc:"零下十五度的等待，换来这一刻的永恒"},{id:"3",src:"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800",title:"日出金山",date:"2024.12",desc:"太阳出来的那一刻，世界都安静了"},{id:"4",src:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",title:"湖边倒影",date:"2024.10",desc:"水面是世界的另一面"},{id:"5",src:"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800",title:"草原尽头",date:"2024.08",desc:"走到草原的尽头，才发现起点在心里"}],bk=[{id:"1",title:"乐队的夏天 · S3E01",type:"播客",date:"2025.04 · 通勤",cover:"🎸"},{id:"2",title:"贝多芬：月光奏鸣曲",type:"音乐",date:"2025.04 · 夜晚",cover:"🎹"},{id:"3",title:"随机波动 · 那些消失的书店",type:"播客",date:"2025.03 · 睡前",cover:"📻"},{id:"4",title:"落日飞车 · My Jinji",type:"音乐",date:"2025.03 · 黄昏",cover:"🌅"},{id:"5",title:"得意事务所 · 创业者的故事",type:"播客",date:"2025.02 · 通勤",cover:"🎙️"},{id:"6",title:"久石让 · 天空之城",type:"音乐",date:"2025.01 · 工作",cover:"🏰"}],vk=[{id:"1",icon:"🏃",name:"晨跑 5km",date:"2025.04.15",time:"06:30",note:"风很温柔，脚步很轻"},{id:"2",icon:"🧘",name:"正念瑜伽 30min",date:"2025.04.12",time:"20:00",note:"呼吸比思考更重要"},{id:"3",icon:"💪",name:"力量训练 45min",date:"2025.04.10",time:"19:00",note:"流汗的感觉很踏实"},{id:"4",icon:"🏃",name:"夜跑 3km",date:"2025.04.08",time:"21:30",note:"路灯下的影子很孤独也很自由"},{id:"5",icon:"🧘",name:"睡前拉伸 15min",date:"2025.04.05",time:"22:00",note:"身体放松了，心也安静下来"},{id:"6",icon:"🚴",name:"骑行 12km",date:"2025.04.02",time:"08:00",note:"穿过城市的早晨"}],jk=[{id:"1",theme:"正念呼吸",duration:"15分钟",date:"2025.04.15",insight:"平静不是没有波澜，而是学会与波澜共处。"},{id:"2",theme:"身体扫描",duration:"20分钟",date:"2025.04.10",insight:"每一个细胞都在呼吸。身体比我以为的更聪明。"},{id:"3",theme:"慈心禅",duration:"10分钟",date:"2025.04.05",insight:"对自己温柔，是一切温柔的开始。"},{id:"4",theme:"呼吸锚定",duration:"12分钟",date:"2025.03.28",insight:"焦虑来时，只是看着它来，不评判，它就会走。"},{id:"5",theme:"开放觉知",duration:"18分钟",date:"2025.03.20",insight:"世界很吵，但我的内心可以很静。"}],Sk=[{id:"1",title:"重启人生",season:"S1E3",date:"2025.03 · 周末",cover:"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=400&fit=crop",quote:"人生没有白走的路，每一步都算数。"},{id:"2",title:"我的解放日志",season:"S1E8",date:"2025.02 · 深夜",cover:"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=400&fit=crop",quote:"如果今天能够稍微不一样，明天会不会也跟着不一样？"},{id:"3",title:"俗女养成记",season:"S2E4",date:"2025.01 · 周末",cover:"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&h=400&fit=crop",quote:"你是从什么时候开始，不再相信努力有用的？"},{id:"4",title:"漫长的季节",season:"S1E10",date:"2024.12 · 深夜",cover:"https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=400&fit=crop",quote:"这个秋天，好像比往常都长。"},{id:"5",title:"去有风的地方",season:"S1E6",date:"2024.11 · 周末",cover:"https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=400&fit=crop",quote:"慢下来，也是一种前进。"},{id:"6",title:"春夜",season:"S1E2",date:"2024.10 · 深夜",cover:"https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=400&fit=crop",quote:"有些相遇注定要发生，在恰当的时候。"}];function Fi(a,i){try{const o=localStorage.getItem(a);if(!o)return i;const l=JSON.parse(o);return Array.isArray(l)?l:i}catch{return i}}function Jt(a,i){try{localStorage.setItem(a,JSON.stringify(i))}catch{}}function Ii(){return Date.now().toString(36)+Math.random().toString(36).slice(2)}function Kx(a){return new Promise((i,o)=>{const l=new FileReader;l.onload=()=>i(l.result),l.onerror=o,l.readAsDataURL(a)})}const wk=({message:a,onDone:i})=>(j.useEffect(()=>{const o=setTimeout(i,2500);return()=>clearTimeout(o)},[i]),s.jsxs("div",{style:{position:"fixed",bottom:32,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:`${J.grayGreen}ee`,color:"#fff",padding:"12px 28px",borderRadius:999,fontSize:14,fontWeight:500,backdropFilter:"blur(16px)",boxShadow:`0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px ${J.woodBorder}`,animation:"lf-toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1)",letterSpacing:"0.03em"},children:[a,s.jsx("style",{children:"@keyframes lf-toast-in { from { opacity:0; transform: translateX(-50%) translateY(20px) scale(0.9); } to { opacity:1; transform: translateX(-50%) translateY(0) scale(1); } }"})]})),Xi=({message:a,onConfirm:i,onCancel:o})=>s.jsxs("div",{style:{position:"fixed",inset:0,zIndex:9998,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24},onClick:o,children:[s.jsxs("div",{style:{background:J.cream,borderRadius:20,padding:"28px 28px 24px",maxWidth:320,width:"100%",textAlign:"center",border:`1px solid ${J.woodBorder}`,boxShadow:"0 20px 60px rgba(0,0,0,0.18)",animation:"lf-slideup 0.3s ease"},onClick:l=>l.stopPropagation(),children:[s.jsx("p",{style:{fontFamily:"Noto Serif SC, serif",fontSize:16,color:J.text,margin:"0 0 20px",lineHeight:1.6},children:a}),s.jsxs("div",{style:{display:"flex",gap:12,justifyContent:"center"},children:[s.jsx("button",{onClick:o,style:{flex:1,padding:"10px 0",border:`1.5px solid ${J.woodBorder}`,borderRadius:999,background:"transparent",color:J.textLight,cursor:"pointer",fontSize:14,transition:"all 0.2s"},onMouseEnter:l=>{l.currentTarget.style.background=J.woodLight},onMouseLeave:l=>{l.currentTarget.style.background="transparent"},children:"取消"}),s.jsx("button",{onClick:i,style:{flex:1,padding:"10px 0",border:"none",borderRadius:999,background:"#D46B4D",color:"#fff",cursor:"pointer",fontSize:14,transition:"all 0.2s"},onMouseEnter:l=>{l.currentTarget.style.transform="translateY(-1px)"},onMouseLeave:l=>{l.currentTarget.style.transform="translateY(0)"},children:"确认删除"})]})]}),s.jsx("style",{children:"@keyframes lf-slideup { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }"})]}),kk={reading:[{key:"cover",label:"书籍封面",type:"file",isFile:!0,required:!0},{key:"title",label:"书名",placeholder:"如：百年孤独",required:!0},{key:"author",label:"作者",placeholder:"如：加西亚·马尔克斯"},{key:"quote",label:"喜欢的句子",placeholder:"如：生命从来不曾离开孤独而独立存在。",isTextarea:!0},{key:"date",label:"阅读时间",type:"date"}],photo:[{key:"photos",label:"照片（可多选）",type:"file",isFile:!0,required:!0},{key:"date",label:"拍摄时间",type:"date",icon:"📅"},{key:"desc",label:"地点 / 描述",placeholder:"如：凌晨五点的山间，空气里都是安静的味道",isTextarea:!0,icon:"📍"}],music:[{key:"cover",label:"封面图",type:"file",isFile:!0},{key:"title",label:"标题",placeholder:"如：落日飞车 · My Jinji",required:!0},{key:"type",label:"类型",type:"select",options:["音乐","播客"],required:!0},{key:"date",label:"收听时间",type:"date"},{key:"note",label:"备注",placeholder:"如：通勤 · 睡前 · 黄昏",isTextarea:!0}],sport:[{key:"icon",label:"运动类型",type:"select",options:["🏃 跑步","🧘 瑜伽","💪 健身","🚴 骑行","🏊 游泳","⚽ 球类"],required:!0},{key:"name",label:"运动名称",placeholder:"如：晨跑 5km",required:!0},{key:"date",label:"日期",type:"date",required:!0},{key:"time",label:"时间",type:"time"},{key:"note",label:"感受",placeholder:"如：风很温柔，脚步很轻",isTextarea:!0}],meditation:[{key:"theme",label:"冥想主题",placeholder:"如：正念呼吸",required:!0},{key:"duration",label:"时长",placeholder:"如：15分钟",required:!0},{key:"date",label:"日期",type:"date",required:!0},{key:"insight",label:"感悟",placeholder:"如：平静不是没有波澜，而是学会与波澜共处。",isTextarea:!0}],drama:[{key:"cover",label:"剧集封面",type:"file",isFile:!0},{key:"title",label:"剧名",placeholder:"如：重启人生",required:!0},{key:"season",label:"季数/集数",placeholder:"如：S1E3"},{key:"date",label:"观看时间",type:"date"},{key:"quote",label:"一句话评价",placeholder:"如：人生没有白走的路，每一步都算数。",isTextarea:!0}]},Nk={reading:"添加书籍",photo:"添加照片",music:"添加音乐/播客",sport:"添加运动记录",meditation:"添加冥想记录",drama:"添加追剧记录"},Pi=({moduleType:a,onSubmit:i,onClose:o})=>{const l=kk[a],[c,f]=j.useState({}),[p,m]=j.useState({}),[h,g]=j.useState({}),b=async(x,w)=>{if(!w||w.length===0)return;const S=x==="photos";try{if(S){const N=await Promise.all(Array.from(w).map(C=>Kx(C)));m(C=>({...C,[x]:N}))}else{const N=await Kx(w[0]);m(C=>({...C,[x]:[N]}))}}catch{}},y=()=>{const x={};if(l.forEach(w=>{var S;w.required&&!c[w.key]&&((S=p[w.key])==null?void 0:S.length)===0&&(x[w.key]="此项为必填")}),Object.keys(x).length>0){g(x);return}g({}),i(c,p)};return s.jsxs("div",{style:{position:"fixed",inset:0,zIndex:210,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"lf-fadein 0.3s ease"},onClick:o,children:[s.jsxs("div",{style:{background:J.cream,borderRadius:24,padding:"32px 28px 28px",maxWidth:480,width:"100%",maxHeight:"88vh",overflowY:"auto",border:`1px solid ${J.woodBorder}`,boxShadow:"0 24px 64px rgba(0,0,0,0.15)",animation:"lf-slideup 0.35s ease"},onClick:x=>x.stopPropagation(),children:[s.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24},children:[s.jsx("h3",{style:{fontFamily:"Noto Serif SC, serif",fontSize:20,fontWeight:600,color:J.text,margin:0,letterSpacing:"0.04em"},children:Nk[a]}),s.jsx("button",{onClick:o,style:{width:36,height:36,border:"none",borderRadius:"50%",background:J.woodLight,color:J.textLight,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"},onMouseEnter:x=>{x.currentTarget.style.background=J.woodBorder},onMouseLeave:x=>{x.currentTarget.style.background=J.woodLight},children:"×"})]}),s.jsx("div",{style:{display:"flex",flexDirection:"column",gap:20},children:l.map(x=>{var w,S;return s.jsxs("div",{children:[a==="photo"&&x.key==="desc"&&s.jsx("div",{style:{height:16}}),s.jsxs("div",{style:{display:"flex",alignItems:"flex-start",gap:12},children:[x.icon&&s.jsx("span",{style:{fontSize:18,marginTop:10,flexShrink:0,opacity:.7},children:x.icon}),s.jsxs("div",{style:{flex:1},children:[s.jsxs("label",{style:{display:"block",fontSize:12,color:J.textLight,marginBottom:8,fontWeight:500,letterSpacing:"0.05em"},children:[x.label," ",x.required&&s.jsx("span",{style:{color:"#D46B4D"},children:"*"})]}),x.isFile?s.jsx("div",{children:s.jsxs("label",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:`2px dashed ${h[x.key]?"#D46B4D":J.woodBorder}`,borderRadius:16,padding:"24px 16px",cursor:"pointer",background:J.grayGreenLight,transition:"all 0.25s"},children:[(w=p[x.key])!=null&&w.length?x.key==="photos"?s.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"},children:p[x.key].map((N,C)=>s.jsx("img",{src:N,alt:"",style:{width:64,height:64,objectFit:"cover",borderRadius:10,boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}},C))}):s.jsx("img",{src:p[x.key][0],alt:"",style:{width:80,height:110,objectFit:"cover",borderRadius:10,boxShadow:"0 4px 12px rgba(0,0,0,0.12)"}}):s.jsxs(s.Fragment,{children:[s.jsx("span",{style:{fontSize:32,marginBottom:10},children:"📷"}),s.jsxs("span",{style:{fontSize:13,color:J.textLight,fontFamily:"Noto Serif SC, serif"},children:["点击上传",x.label]}),x.key==="photos"&&s.jsx("span",{style:{fontSize:11,color:J.textMuted,marginTop:4},children:"可同时选择多张"})]}),s.jsx("input",{type:"file",accept:"image/*",multiple:x.key==="photos",onChange:N=>b(x.key,N.target.files),style:{display:"none"}})]})}):x.isTextarea?s.jsx("textarea",{value:c[x.key]||"",onChange:N=>f(C=>({...C,[x.key]:N.target.value})),placeholder:x.placeholder,rows:3,style:{width:"100%",boxSizing:"border-box",padding:"10px 0",border:"none",borderBottom:`2px solid ${h[x.key]?"#D46B4D":J.woodBorder}`,background:"transparent",color:J.text,fontSize:14,resize:"none",outline:"none",fontFamily:"Noto Serif SC, serif",lineHeight:1.8,transition:"border-color 0.2s"}}):x.type==="select"?s.jsxs("select",{value:c[x.key]||"",onChange:N=>f(C=>({...C,[x.key]:N.target.value})),style:{width:"100%",boxSizing:"border-box",padding:"10px 0",border:"none",borderBottom:`2px solid ${h[x.key]?"#D46B4D":J.woodBorder}`,background:"transparent",color:J.text,fontSize:14,outline:"none",fontFamily:"inherit",appearance:"none",cursor:"pointer",transition:"border-color 0.2s"},children:[s.jsx("option",{value:"",children:"请选择"}),(S=x.options)==null?void 0:S.map(N=>s.jsx("option",{value:N,children:N},N))]}):s.jsx("input",{type:x.type||"text",value:c[x.key]||"",onChange:N=>f(C=>({...C,[x.key]:N.target.value})),placeholder:x.placeholder,style:{width:"100%",boxSizing:"border-box",padding:"10px 0",border:"none",borderBottom:`2px solid ${h[x.key]?"#D46B4D":J.woodBorder}`,background:"transparent",color:J.text,fontSize:14,outline:"none",fontFamily:"Noto Serif SC, serif",transition:"border-color 0.2s"}}),h[x.key]&&s.jsx("p",{style:{fontSize:11,color:"#D46B4D",margin:"6px 0 0"},children:h[x.key]})]})]})]},x.key)})}),s.jsx("button",{onClick:y,style:{width:"100%",marginTop:28,padding:"14px 0",border:"none",borderRadius:16,background:J.grayGreen,color:"#fff",fontSize:15,fontWeight:500,cursor:"pointer",fontFamily:"Noto Serif SC, serif",letterSpacing:"0.06em",transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:"0 4px 16px rgba(141,154,139,0.3)"},onMouseEnter:x=>{x.currentTarget.style.transform="translateY(-2px)",x.currentTarget.style.boxShadow="0 8px 24px rgba(141,154,139,0.4)"},onMouseLeave:x=>{x.currentTarget.style.transform="translateY(0)",x.currentTarget.style.boxShadow="0 4px 16px rgba(141,154,139,0.3)"},children:"确认上传 ✨"})]}),s.jsx("style",{children:`
        @keyframes lf-fadein { from { opacity:0; } to { opacity:1; } }
        @keyframes lf-slideup { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `})]})},$i=({emoji:a,text:i})=>s.jsxs("div",{style:{textAlign:"center",padding:"40px 16px"},children:[s.jsx("div",{style:{fontSize:52,marginBottom:16,opacity:.5},children:a}),s.jsx("p",{style:{fontSize:13,color:J.textMuted,margin:0,lineHeight:1.8,fontFamily:"Noto Serif SC, serif"},children:i||"还没记录呢，点击右下角 + 号开始吧"})]}),J={wood:"#C4A77D",woodLight:"rgba(196,167,125,0.15)",woodBorder:"rgba(196,167,125,0.3)",grayGreen:"#8D9A8B",grayGreenLight:"rgba(141,154,139,0.12)",cream:"#FAF9F6",creamDark:"#F5F3EE",text:"#4A4038",textLight:"#8A7A6A",textMuted:"#B0A090",accent:"#6A8A6A"},Zi=({children:a,onClose:i,showFab:o,fabOnClick:l,fabColor:c})=>s.jsxs(s.Fragment,{children:[s.jsx("div",{style:{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"lfm-fadein 0.35s ease"},onClick:i,children:s.jsx("div",{style:{position:"relative",width:"100%",maxWidth:720,maxHeight:"85vh",background:J.cream,borderRadius:24,border:`1px solid ${J.woodBorder}`,boxShadow:"0 24px 64px rgba(0,0,0,0.15)",padding:"32px 28px",overflowY:"auto",color:J.text,animation:"lfm-slideup 0.35s ease"},onClick:f=>f.stopPropagation(),children:a})}),o&&l&&s.jsx("button",{onClick:l,title:"添加记录",style:{position:"fixed",bottom:32,right:32,zIndex:210,width:60,height:60,border:"none",borderRadius:"50%",background:c||J.grayGreen,color:"#fff",fontSize:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 28px rgba(141,154,139,0.4)",transition:"transform 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.2s",animation:"lf-fab-appear 0.5s cubic-bezier(0.34,1.56,0.64,1)"},onMouseEnter:f=>{f.currentTarget.style.transform="scale(1.1) rotate(90deg)"},onMouseLeave:f=>{f.currentTarget.style.transform="scale(1) rotate(0deg)"},children:"+"}),s.jsx("style",{children:`
      @keyframes lfm-fadein { from { opacity: 0; } to { opacity: 1; } }
      @keyframes lfm-slideup { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes lf-fab-appear { from { opacity:0; transform:scale(0.6); } to { opacity:1; transform:scale(1); } }
      @keyframes vinyl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes note-float { 0% { opacity: 0.8; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-60px) scale(0.5); } }
      @keyframes branch-extend { from { width: 0; opacity: 0; } to { width: 60px; opacity: 1; } }
      @keyframes branch-retract { from { width: 60px; opacity: 1; } to { width: 0; opacity: 0; } }
    `})]}),j1=({onClick:a})=>s.jsx("button",{onClick:i=>{i.stopPropagation(),a()},title:"删除",style:{position:"absolute",top:6,right:6,width:22,height:22,border:"none",borderRadius:"50%",background:"rgba(0,0,0,0.18)",color:"rgba(255,255,255,0.85)",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity 0.2s, background 0.2s"},onMouseEnter:i=>{i.currentTarget.style.background="rgba(180,80,80,0.6)",i.currentTarget.style.opacity="1"},onMouseLeave:i=>{i.currentTarget.style.background="rgba(0,0,0,0.18)",i.currentTarget.style.opacity="0"},children:"×"}),Ck=({onClose:a,onUpload:i})=>{const[o,l]=j.useState(()=>Fi(it.reading,xk)),[c,f]=j.useState(null),[p,m]=j.useState(null),[h,g]=j.useState(!1),b=y=>{const x=o.filter(w=>w.id!==y);l(x),Jt(it.reading,x),m(null)};return s.jsxs(s.Fragment,{children:[s.jsxs(Zi,{onClose:a,showFab:!0,fabOnClick:()=>g(!0),children:[s.jsx("button",{style:{position:"absolute",top:16,right:16,width:32,height:32,border:"none",borderRadius:"50%",background:"rgba(0,0,0,0.06)",color:"#888",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},onClick:a,children:"×"}),s.jsx("h3",{style:{fontFamily:"Noto Serif SC, serif",fontSize:20,fontWeight:600,color:"#4a4038",margin:"0 0 20px",textAlign:"center",letterSpacing:"0.04em"},children:"📖 我的书架"}),c?s.jsxs("div",{style:{textAlign:"center",animation:"lfm-fadein 0.3s"},children:[s.jsx("img",{src:c.cover,alt:c.title,style:{width:160,height:224,objectFit:"cover",borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",margin:"0 auto 16px"}}),s.jsx("h4",{style:{fontFamily:"Noto Serif SC, serif",fontSize:18,color:"#4a4038",margin:"0 0 4px"},children:c.title}),s.jsxs("p",{style:{fontSize:13,color:"#8a7a6a",margin:"0 0 12px"},children:["· ",c.author]}),s.jsxs("blockquote",{style:{fontFamily:"Noto Serif SC, serif",fontSize:14,color:"#6a8a6a",borderLeft:"3px solid #6a8a6a",paddingLeft:12,margin:"0 0 12px",fontStyle:"italic"},children:['"',c.quote,'"']}),s.jsx("p",{style:{fontSize:12,color:"#b0a090",margin:"0 0 16px"},children:c.date}),s.jsx("button",{onClick:()=>f(null),style:{padding:"8px 20px",border:"1.5px solid #6a8a6a",borderRadius:999,background:"transparent",color:"#6a8a6a",cursor:"pointer",fontSize:13},children:"← 返回书架"})]}):o.length===0?s.jsx($i,{emoji:"📚"}):s.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:12},children:o.map(y=>s.jsxs("div",{style:{position:"relative",cursor:"pointer",textAlign:"center",transition:"transform 0.2s"},onClick:()=>f(y),onMouseEnter:x=>x.currentTarget.style.transform="translateY(-4px)",onMouseLeave:x=>x.currentTarget.style.transform="translateY(0)",children:[s.jsx(j1,{onClick:()=>m(y.id)}),s.jsx("img",{src:y.cover,alt:y.title,style:{width:"100%",height:160,objectFit:"cover",borderRadius:8,boxShadow:"0 2px 8px rgba(0,0,0,0.1)",marginBottom:8}}),s.jsx("p",{style:{fontSize:12,color:"#5a5248",margin:0,fontWeight:500},children:y.title}),s.jsx("p",{style:{fontSize:11,color:"#b0a090",margin:"2px 0 0"},children:y.author})]},y.id))}),p&&s.jsx(Xi,{message:"确定要删除这本书吗？",onConfirm:()=>b(p),onCancel:()=>m(null)})]}),h&&s.jsx(Pi,{moduleType:"reading",onSubmit:(y,x)=>{var N;const S=[{id:Ii(),title:y.title,author:y.author||"",cover:((N=x.cover)==null?void 0:N[0])||"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop",quote:y.quote||"",date:y.date||""},...o];l(S),Jt(it.reading,S),g(!1),i()},onClose:()=>g(!1)})]})},Tk=({onClose:a,onUpload:i})=>{const[o,l]=j.useState(()=>Fi(it.photos,yk)),[c,f]=j.useState(0),[p,m]=j.useState(!1),[h,g]=j.useState(null);o.length>0&&c>=o.length&&f(0);const b=o[c]||null,y=x=>{const w=o.filter(S=>S.id!==x);l(w),Jt(it.photos,w),g(null)};return s.jsxs(s.Fragment,{children:[s.jsxs(Zi,{onClose:a,showFab:!0,fabOnClick:()=>m(!0),fabColor:J.wood,children:[s.jsx("button",{style:{position:"absolute",top:16,right:16,width:36,height:36,border:"none",borderRadius:"50%",background:J.woodLight,color:J.textLight,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"},onClick:a,onMouseEnter:x=>{x.currentTarget.style.background=J.woodBorder},onMouseLeave:x=>{x.currentTarget.style.background=J.woodLight},children:"×"}),s.jsx("h3",{style:{fontFamily:"Noto Serif SC, serif",fontSize:22,fontWeight:600,color:J.text,margin:"0 0 24px",textAlign:"center",letterSpacing:"0.06em"},children:"📷 我的摄影集"}),o.length===0?s.jsx($i,{emoji:"📷"}):s.jsxs(s.Fragment,{children:[s.jsx("div",{style:{position:"relative",borderRadius:16,overflow:"hidden",background:J.creamDark,marginBottom:24,boxShadow:"0 12px 48px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)"},children:b&&s.jsxs(s.Fragment,{children:[s.jsxs("div",{style:{position:"relative"},children:[s.jsx("img",{src:b.src,alt:b.title,style:{width:"100%",height:340,objectFit:"cover",display:"block"}}),s.jsx(j1,{onClick:()=>g(b.id)})]}),s.jsxs("div",{style:{position:"absolute",bottom:0,left:0,right:0,padding:"32px 20px 16px",background:"linear-gradient(transparent, rgba(0,0,0,0.6))"},children:[s.jsx("p",{style:{color:"#fff",fontSize:16,margin:0,fontWeight:500,fontFamily:"Noto Serif SC, serif"},children:b.title}),s.jsxs("p",{style:{color:"rgba(255,255,255,0.65)",fontSize:12,margin:"6px 0 0",letterSpacing:"0.02em"},children:[b.date," · ",b.desc]})]}),s.jsx("button",{onClick:()=>f(x=>(x-1+o.length)%o.length),style:{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.2)",backdropFilter:"blur(8px)",color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"},onMouseEnter:x=>{x.currentTarget.style.background="rgba(255,255,255,0.35)"},onMouseLeave:x=>{x.currentTarget.style.background="rgba(255,255,255,0.2)"},children:"‹"}),s.jsx("button",{onClick:()=>f(x=>(x+1)%o.length),style:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",width:40,height:40,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.2)",backdropFilter:"blur(8px)",color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"},onMouseEnter:x=>{x.currentTarget.style.background="rgba(255,255,255,0.35)"},onMouseLeave:x=>{x.currentTarget.style.background="rgba(255,255,255,0.2)"},children:"›"}),s.jsx("div",{style:{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6},children:o.map((x,w)=>s.jsx("span",{style:{width:w===c?20:8,height:8,borderRadius:4,background:w===c?"#fff":"rgba(255,255,255,0.4)",transition:"all 0.3s"}},w))})]})}),s.jsxs("div",{style:{display:"flex",alignItems:"flex-end",gap:10,padding:"0 4px",overflowX:"auto",paddingBottom:8},children:[o.map((x,w)=>s.jsx("div",{style:{flexShrink:0,cursor:"pointer",borderRadius:10,overflow:"hidden",border:w===c?`3px solid ${J.grayGreen}`:"3px solid transparent",transform:w===c?"translateY(-8px)":w===(c-1+o.length)%o.length||w===(c+1)%o.length?"translateY(-3px)":"translateY(0)",boxShadow:w===c?"0 8px 24px rgba(0,0,0,0.2)":"0 2px 8px rgba(0,0,0,0.1)",transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",opacity:Math.abs(w-c)>2?.5:1},onClick:()=>f(w),children:s.jsx("img",{src:x.src,alt:x.title,style:{width:72,height:54,objectFit:"cover",display:"block"}})},x.id)),s.jsx("div",{style:{flexShrink:0,width:72,height:54,borderRadius:10,border:`2px dashed ${J.woodBorder}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:J.woodLight,transition:"all 0.2s"},onClick:()=>m(!0),onMouseEnter:x=>{x.currentTarget.style.borderColor=J.grayGreen,x.currentTarget.style.background=J.grayGreenLight},onMouseLeave:x=>{x.currentTarget.style.borderColor=J.woodBorder,x.currentTarget.style.background=J.woodLight},children:s.jsx("span",{style:{fontSize:24,color:J.textLight},children:"+"})})]})]}),h&&s.jsx(Xi,{message:"确定要删除这张照片吗？",onConfirm:()=>y(h),onCancel:()=>g(null)})]}),p&&s.jsx(Pi,{moduleType:"photo",onSubmit:(x,w)=>{const N=[...(w.photos||[]).map((C,T)=>{var z,E;return{id:Ii(),src:C,title:((E=(z=x.desc)==null?void 0:z.split("·")[0])==null?void 0:E.trim())||`照片 ${T+1}`,date:x.date||new Date().toISOString().slice(0,7),desc:x.desc||""}}),...o];l(N),Jt(it.photos,N),m(!1),i()},onClose:()=>m(!1)})]})},Ek=({onClose:a,onUpload:i})=>{const[o,l]=j.useState(()=>Fi(it.tracks,bk)),[c,f]=j.useState(null),[p,m]=j.useState(0),[h,g]=j.useState(!1),[b,y]=j.useState(null),[x,w]=j.useState(!1),S=j.useRef(void 0);j.useEffect(()=>(c?S.current=setInterval(()=>{m(E=>E>=100?(S.current&&clearInterval(S.current),f(null),w(!1),0):E+1)},300):S.current&&clearInterval(S.current),()=>{S.current&&clearInterval(S.current)}),[c]);const N=E=>{c===E?(f(null),w(!1),m(0)):(f(E),w(!0))},C=E=>{const A=o.filter(R=>R.id!==E);l(A),Jt(it.tracks,A),y(null)},T=["♪","♫","♬","🎵"],z=o.find(E=>E.id===c);return s.jsxs(s.Fragment,{children:[s.jsxs(Zi,{onClose:a,showFab:!0,fabOnClick:()=>g(!0),fabColor:J.wood,children:[s.jsx("button",{style:{position:"absolute",top:16,right:16,width:36,height:36,border:"none",borderRadius:"50%",background:J.woodLight,color:J.textLight,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"},onClick:a,onMouseEnter:E=>{E.currentTarget.style.background=J.woodBorder},onMouseLeave:E=>{E.currentTarget.style.background=J.woodLight},children:"×"}),s.jsx("h3",{style:{fontFamily:"Noto Serif SC, serif",fontSize:22,fontWeight:600,color:J.text,margin:"0 0 24px",textAlign:"center",letterSpacing:"0.06em"},children:"🎧 我的收听清单"}),z?s.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 0 8px"},children:[s.jsxs("div",{style:{position:"relative",width:200,height:200,marginBottom:24,display:"flex",alignItems:"center",justifyContent:"center"},children:[x&&T.slice(0,4).map((E,A)=>s.jsx("span",{style:{position:"absolute",fontSize:20,color:J.accent,animation:`note-float ${2+A*.3}s ease-out infinite`,animationDelay:`${A*.5}s`,top:`${20+A*15}%`,right:`${10+A*5}%`,opacity:0},children:E},A)),s.jsx("div",{style:{position:"absolute",left:c?-60:-10,top:"50%",transform:"translateY(-50%)",width:c?70:0,height:3,background:`linear-gradient(90deg, ${J.accent}, ${J.wood})`,borderRadius:2,transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)",overflow:"hidden",zIndex:1},children:s.jsx("div",{style:{position:"absolute",right:-6,top:-5,width:14,height:14,background:J.accent,borderRadius:"50% 0 50% 50%",transform:"rotate(-45deg)"}})}),s.jsxs("div",{style:{width:160,height:160,borderRadius:"50%",background:"linear-gradient(135deg, #3a3028 0%, #4a4038 20%, #3a3028 40%, #4a4038 60%, #3a3028 80%, #4a4038 100%)",boxShadow:`0 12px 40px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.08), ${c?"0 0 24px rgba(106,138,106,0.4)":"none"}`,display:"flex",alignItems:"center",justifyContent:"center",animation:c?"vinyl-spin 5s linear infinite":"none",transition:"box-shadow 0.5s ease",position:"relative",overflow:"hidden"},children:[s.jsx("div",{style:{position:"absolute",width:"100%",height:"100%",borderRadius:"50%",background:"repeating-radial-gradient(circle at center, transparent 0px, transparent 1px, rgba(255,255,255,0.015) 1px, rgba(255,255,255,0.015) 2px)"}}),[40,55,70,85,100,115].map(E=>s.jsx("div",{style:{position:"absolute",width:E,height:E,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.03)"}},E)),s.jsxs("div",{style:{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg, ${J.wood} 0%, #D4B896 50%, ${J.wood} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)",zIndex:2},children:[s.jsx("div",{style:{width:8,height:8,borderRadius:"50%",background:"rgba(0,0,0,0.7)",boxShadow:"inset 0 1px 2px rgba(255,255,255,0.1)"}}),s.jsx("span",{style:{fontSize:16,position:"absolute"},children:z.cover})]})]})]}),s.jsx("h4",{style:{fontFamily:"Noto Serif SC, serif",fontSize:18,color:J.text,margin:"0 0 4px",textAlign:"center"},children:z.title}),s.jsxs("p",{style:{fontSize:13,color:J.textLight,margin:"0 0 20px"},children:[z.type," · ",z.date]}),s.jsx("div",{style:{width:"100%",maxWidth:300,marginBottom:16},children:s.jsx("div",{style:{height:4,background:J.woodLight,borderRadius:2},children:s.jsx("div",{style:{height:"100%",width:`${p}%`,background:`linear-gradient(90deg, ${J.grayGreen}, ${J.accent})`,borderRadius:2,transition:"width 0.3s"}})})}),s.jsxs("div",{style:{display:"flex",gap:16},children:[s.jsx("button",{onClick:()=>N(z.id),style:{padding:"12px 28px",border:`2px solid ${J.woodBorder}`,borderRadius:16,background:"transparent",color:J.text,cursor:"pointer",fontSize:14,fontFamily:"Noto Serif SC, serif",transition:"all 0.25s"},onMouseEnter:E=>{E.currentTarget.style.background=J.woodLight},onMouseLeave:E=>{E.currentTarget.style.background="transparent"},children:"暂停"}),s.jsx("button",{onClick:()=>m(E=>Math.min(E+10,99)),style:{padding:"12px 28px",border:"none",borderRadius:16,background:J.grayGreen,color:"#fff",cursor:"pointer",fontSize:14,fontFamily:"Noto Serif SC, serif",transition:"all 0.25s"},onMouseEnter:E=>{E.currentTarget.style.transform="translateY(-2px)",E.currentTarget.style.boxShadow="0 6px 20px rgba(141,154,139,0.4)"},onMouseLeave:E=>{E.currentTarget.style.transform="translateY(0)",E.currentTarget.style.boxShadow="none"},children:"快进 ▶▶"})]})]}):o.length===0?s.jsx($i,{emoji:"🎧"}):s.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:14},children:o.map(E=>s.jsxs("div",{style:{position:"relative",cursor:"pointer",display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:16,background:`linear-gradient(135deg, ${J.creamDark} 0%, ${J.cream} 50%, ${J.creamDark} 100%)`,border:`1px solid ${J.woodBorder}`,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.8)",transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)"},onClick:()=>N(E.id),onMouseEnter:A=>{A.currentTarget.style.transform="translateY(-4px)",A.currentTarget.style.boxShadow=`0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px ${J.woodBorder}`},onMouseLeave:A=>{A.currentTarget.style.transform="translateY(0)",A.currentTarget.style.boxShadow="none"},children:[s.jsx("button",{onClick:A=>{A.stopPropagation(),y(E.id)},style:{position:"absolute",top:6,right:6,width:20,height:20,border:"none",borderRadius:"50%",background:"rgba(0,0,0,0.08)",color:"rgba(0,0,0,0.3)",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity 0.2s"},onMouseEnter:A=>{A.currentTarget.style.opacity="1"},onMouseLeave:A=>{A.currentTarget.style.opacity="0"},children:"×"}),s.jsxs("div",{style:{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg, #4a4038 0%, #3a3028 40%, #4a4038 60%, #2a2018 100%)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.2)",flexShrink:0,position:"relative"},children:[s.jsx("div",{style:{position:"absolute",width:"100%",height:"100%",borderRadius:"50%",background:"repeating-conic-gradient(from 0deg, rgba(255,255,255,0.02) 0deg 3deg, transparent 3deg 6deg)"}}),s.jsx("div",{style:{width:14,height:14,borderRadius:"50%",background:`linear-gradient(135deg, ${J.wood} 0%, #D4B896 100%)`,boxShadow:"inset 0 1px 3px rgba(0,0,0,0.5)"}}),s.jsx("span",{style:{fontSize:16,position:"absolute",zIndex:1},children:E.cover})]}),s.jsxs("div",{children:[s.jsx("p",{style:{fontSize:13,color:J.text,margin:0,fontWeight:500,fontFamily:"Noto Serif SC, serif"},children:E.title}),s.jsxs("p",{style:{fontSize:11,color:J.textMuted,margin:"4px 0 0"},children:[E.type," · ",E.date]})]})]},E.id))}),b&&s.jsx(Xi,{message:"确定要删除这条记录吗？",onConfirm:()=>C(b),onCancel:()=>y(null)})]}),h&&s.jsx(Pi,{moduleType:"music",onSubmit:(E,A)=>{var _;const B=[{id:Ii(),title:E.title,type:((_=E.type)==null?void 0:_.replace(/[^音乐播客]/g,""))||"音乐",date:E.date||"",cover:"🎵"},...o];l(B),Jt(it.tracks,B),g(!1),i()},onClose:()=>g(!1)})]})},zk=({onClose:a,onUpload:i})=>{const[o,l]=j.useState(()=>Fi(it.sports,vk)),[c,f]=j.useState(!1),[p,m]=j.useState(null),[h,g]=j.useState(null),b=z=>{const E=o.filter(A=>A.id!==z);l(E),Jt(it.sports,E),m(null)},y=o.filter(z=>z.icon==="🏃").length,x=o.reduce((z,E)=>{const A=E.name.match(/(\d+)km/);return z+(A?parseInt(A[1]):0)},0),w=o.reduce((z,E)=>{const A=E.name.match(/(\d+)min/);return z+(A?parseInt(A[1]):0)},0),S=z=>/轻|柔|慢|静|舒服|温柔|自在|peaceful/.test(z)?"😊":/夜|月|星空|晚/.test(z)?"🌙":/热|燃|力量|汗水|挑战|突破/.test(z)?"🔥":/林|山|自然|风|呼吸/.test(z)?"🍃":/快|自由|飞|爽/.test(z)?"✨":"🌿",C=[0,1,2,3,4,5,6].map(z=>{const E=new Date;return E.setDate(E.getDate()-(6-z)),E.toISOString().slice(0,10)}).map(z=>o.filter(E=>E.date===z).length),T=Math.max(...C,1);return s.jsxs(s.Fragment,{children:[s.jsx("style",{children:`
        @keyframes sport-wave-grow { from { transform: scaleY(0); opacity: 0; } to { transform: scaleY(1); opacity: 1; } }
        @keyframes sport-card-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sport-stat-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}),s.jsxs(Zi,{onClose:a,showFab:!0,fabOnClick:()=>f(!0),children:[s.jsx("button",{style:{position:"absolute",top:16,right:16,width:36,height:36,border:"none",borderRadius:"50%",background:J.woodLight,color:J.textLight,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"},onClick:a,onMouseEnter:z=>{z.currentTarget.style.background=J.woodBorder},onMouseLeave:z=>{z.currentTarget.style.background=J.woodLight},children:"×"}),s.jsx("h3",{style:{fontFamily:"Noto Serif SC, serif",fontSize:22,fontWeight:600,color:J.text,margin:"0 0 28px",textAlign:"center",letterSpacing:"0.06em"},children:"🏃 运动疗愈日记"}),s.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:16,marginBottom:28,animation:"sport-stat-in 0.5s ease"},children:[s.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:4},children:[s.jsx("span",{style:{fontFamily:"DIN Alternate, Arial, sans-serif",fontSize:52,fontWeight:700,color:J.text,lineHeight:1,letterSpacing:"-0.02em"},children:y||4}),s.jsx("span",{style:{fontSize:11,color:J.textMuted,letterSpacing:"0.15em",textTransform:"uppercase"},children:"次运动"})]}),s.jsxs("div",{style:{display:"flex",gap:32},children:[s.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[s.jsx("span",{style:{fontSize:16},children:"🏃‍♂️"}),s.jsxs("span",{style:{fontFamily:"DIN Alternate, Arial, sans-serif",fontSize:18,fontWeight:600,color:J.textLight},children:[x||23,s.jsx("span",{style:{fontSize:12,fontWeight:400,marginLeft:2},children:"km"})]})]}),s.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6},children:[s.jsx("span",{style:{fontSize:16},children:"⏱️"}),s.jsx("span",{style:{fontFamily:"DIN Alternate, Arial, sans-serif",fontSize:18,fontWeight:600,color:J.textLight},children:w>0?`${Math.floor(w/60)}h${w%60}m`:"3h12m"})]})]})]}),s.jsxs("div",{style:{marginBottom:28,animation:"sport-wave-grow 0.6s ease 0.2s both",transformOrigin:"bottom"},children:[s.jsxs("div",{style:{display:"flex",alignItems:"flex-end",gap:6,height:56,padding:"0 8px",position:"relative"},children:[s.jsx("div",{style:{position:"absolute",bottom:0,left:0,right:0,height:3,background:`linear-gradient(90deg, ${J.grayGreen}22, ${J.grayGreen}44)`,borderRadius:2}}),C.map((z,E)=>{const A=z>0?Math.max(12,z/T*48):0,R=E===C.length-1;return s.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4},children:[s.jsx("div",{style:{width:"100%",height:A,borderRadius:"4px 4px 0 0",background:z===0?"transparent":R?`linear-gradient(180deg, #B8A8D4 0%, ${J.accent} 100%)`:"linear-gradient(180deg, rgba(141,154,139,0.7) 0%, rgba(141,154,139,0.3) 100%)",transition:"height 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",boxShadow:R?"0 0 12px rgba(184,168,212,0.5)":"none"}}),R&&s.jsx("div",{style:{width:6,height:6,borderRadius:"50%",background:"#B8A8D4",boxShadow:"0 0 6px rgba(184,168,212,0.8)"}})]},E)})]}),s.jsx("div",{style:{display:"flex",gap:6,padding:"0 8px",marginTop:4},children:["一","二","三","四","五","六","日"].map((z,E)=>s.jsx("span",{style:{flex:1,textAlign:"center",fontSize:9,color:E===6?J.grayGreen:J.textMuted,fontWeight:E===6?600:400},children:z},E))})]}),o.length===0?s.jsx($i,{emoji:"🏃",text:"还没有运动记录，开始你的第一次吧"}):s.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12},children:o.map((z,E)=>s.jsxs("div",{style:{position:"relative",display:"flex",alignItems:"center",gap:14,padding:"16px 18px 16px 16px",borderRadius:16,background:h===z.id?"#F0EFED":"#F8F8F8",boxShadow:h===z.id?`0 8px 28px rgba(0,0,0,0.1), 0 0 0 1px ${J.woodBorder}`:"0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",animation:`sport-card-in 0.4s ease ${.3+E*.06}s both`,cursor:"default"},onMouseEnter:()=>g(z.id),onMouseLeave:()=>g(null),children:[s.jsx("button",{onClick:()=>m(z.id),style:{position:"absolute",top:8,right:8,width:20,height:20,border:"none",borderRadius:"50%",background:"rgba(0,0,0,0.06)",color:"rgba(0,0,0,0.3)",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:h===z.id?1:0,transition:"opacity 0.2s"},children:"×"}),s.jsx("div",{style:{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg, ${J.grayGreen}22, ${J.grayGreen}11)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:s.jsx("span",{style:{fontSize:24},children:z.icon})}),s.jsxs("div",{style:{flex:1,minWidth:0},children:[s.jsxs("div",{style:{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:8,marginBottom:6},children:[s.jsx("p",{style:{fontFamily:"Noto Serif SC, serif",fontSize:15,fontWeight:600,color:J.text,margin:0,lineHeight:1.3},children:z.name}),s.jsxs("span",{style:{fontSize:10,color:J.textMuted,whiteSpace:"nowrap",flexShrink:0},children:[z.date," · ",z.time]})]}),z.note&&s.jsxs("p",{style:{fontFamily:"Noto Serif SC, serif",fontSize:12,color:"#666",margin:0,fontStyle:"italic",lineHeight:1.7,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:['"',z.note,'"']})]}),s.jsx("div",{style:{width:28,height:28,borderRadius:"50%",background:`${J.grayGreen}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16},children:S(z.note)})]},z.id))}),p&&s.jsx(Xi,{message:"确定要删除这条运动记录吗？",onConfirm:()=>b(p),onCancel:()=>m(null)})]}),c&&s.jsx(Pi,{moduleType:"sport",onSubmit:(z,E)=>{var B;const R=[{id:Ii(),icon:((B=z.icon)==null?void 0:B.split(" ")[0])||"🏃",name:z.name||"运动",date:z.date||new Date().toISOString().slice(0,10),time:z.time||"",note:z.note||""},...o];l(R),Jt(it.sports,R),f(!1),i()},onClose:()=>f(!1)})]})},Mk=({onClose:a,onUpload:i})=>{const[o,l]=j.useState(()=>Fi(it.meditations,jk)),[c,f]=j.useState(!1),[p,m]=j.useState(0),[h,g]=j.useState(!1),[b,y]=j.useState(null),x=j.useRef(void 0);j.useEffect(()=>(c?x.current=setInterval(()=>{m(S=>S>=100?(x.current&&clearInterval(x.current),f(!1),0):S+1)},500):x.current&&clearInterval(x.current),()=>{x.current&&clearInterval(x.current)}),[c]);const w=S=>{const N=o.filter(C=>C.id!==S);l(N),Jt(it.meditations,N),y(null)};return s.jsxs(s.Fragment,{children:[s.jsxs(Zi,{onClose:a,showFab:!0,fabOnClick:()=>g(!0),children:[s.jsx("button",{style:{position:"absolute",top:16,right:16,width:32,height:32,border:"none",borderRadius:"50%",background:"rgba(0,0,0,0.06)",color:"#888",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},onClick:a,children:"×"}),s.jsx("h3",{style:{fontFamily:"Noto Serif SC, serif",fontSize:20,fontWeight:600,color:"#4a4038",margin:"0 0 20px",textAlign:"center",letterSpacing:"0.04em"},children:"🧘 我的冥想日记"}),s.jsxs("div",{style:{padding:"20px",borderRadius:16,background:"rgba(122,154,130,0.08)",textAlign:"center",marginBottom:20},children:[s.jsx("p",{style:{fontFamily:"Noto Serif SC, serif",fontSize:16,color:"#4a4038",margin:"0 0 8px"},children:"正念呼引导"}),s.jsx("p",{style:{fontSize:13,color:"#8a7a6a",margin:"0 0 16px"},children:"15分钟 · 此刻可开始"}),s.jsx("div",{style:{height:4,background:"rgba(0,0,0,0.06)",borderRadius:2,marginBottom:12},children:s.jsx("div",{style:{height:"100%",width:`${p}%`,background:"#6a8a6a",borderRadius:2,transition:"width 0.5s"}})}),s.jsx("button",{onClick:()=>f(!c),style:{padding:"10px 28px",border:"none",borderRadius:999,background:"#6a8a6a",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:500},children:c?"⏸ 暂停":"▶ 开始冥想"})]}),o.length===0?s.jsx($i,{emoji:"🧘"}):s.jsx("div",{style:{display:"flex",flexDirection:"column",gap:10},children:o.map(S=>s.jsxs("div",{style:{position:"relative",padding:"14px 16px",borderRadius:12,background:"rgba(255,255,255,0.6)",borderLeft:"3px solid #6a8a6a"},children:[s.jsx("button",{onClick:()=>y(S.id),style:{position:"absolute",top:8,right:8,width:18,height:18,border:"none",borderRadius:"50%",background:"rgba(0,0,0,0.06)",color:"rgba(0,0,0,0.3)",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity 0.2s"},onMouseEnter:N=>{N.currentTarget.style.opacity="1"},onMouseLeave:N=>{N.currentTarget.style.opacity="0"},children:"×"}),s.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6},children:[s.jsx("p",{style:{fontSize:14,fontWeight:600,color:"#4a4038",margin:0},children:S.theme}),s.jsxs("span",{style:{fontSize:11,color:"#b0a090"},children:[S.duration," · ",S.date]})]}),s.jsxs("p",{style:{fontSize:12,color:"#7a7268",margin:0,fontStyle:"italic",lineHeight:1.6},children:['"',S.insight,'"']})]},S.id))}),b&&s.jsx(Xi,{message:"确定要删除这条冥想记录吗？",onConfirm:()=>w(b),onCancel:()=>y(null)})]}),h&&s.jsx(Pi,{moduleType:"meditation",onSubmit:(S,N)=>{const T=[{id:Ii(),theme:S.theme||"正念呼吸",duration:S.duration||"15分钟",date:S.date||new Date().toISOString().slice(0,10),insight:S.insight||""},...o];l(T),Jt(it.meditations,T),g(!1),i()},onClose:()=>g(!1)})]})},Ak=({onClose:a,onUpload:i})=>{const[o,l]=j.useState(()=>Fi(it.dramas,Sk)),[c,f]=j.useState(null),[p,m]=j.useState(!1),[h,g]=j.useState(null),b=y=>{const x=o.filter(w=>w.id!==y);l(x),Jt(it.dramas,x),g(null)};return s.jsxs(s.Fragment,{children:[s.jsxs(Zi,{onClose:a,showFab:!0,fabOnClick:()=>m(!0),children:[s.jsx("button",{style:{position:"absolute",top:16,right:16,width:32,height:32,border:"none",borderRadius:"50%",background:"rgba(0,0,0,0.06)",color:"#888",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},onClick:a,children:"×"}),s.jsx("h3",{style:{fontFamily:"Noto Serif SC, serif",fontSize:20,fontWeight:600,color:"#4a4038",margin:"0 0 20px",textAlign:"center",letterSpacing:"0.04em"},children:"📺 我的追剧记录"}),c?s.jsxs("div",{style:{textAlign:"center",animation:"lfm-fadein 0.3s"},children:[s.jsx("img",{src:c.cover,alt:c.title,style:{width:200,height:260,objectFit:"cover",borderRadius:10,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",margin:"0 auto 16px"}}),s.jsx("h4",{style:{fontFamily:"Noto Serif SC, serif",fontSize:18,color:"#4a4038",margin:"0 0 4px"},children:c.title}),s.jsxs("p",{style:{fontSize:12,color:"#b0a090",margin:"0 0 12px"},children:[c.season," · ",c.date]}),s.jsxs("blockquote",{style:{fontFamily:"Noto Serif SC, serif",fontSize:14,color:"#6a8a6a",borderLeft:"3px solid #6a8a6a",paddingLeft:12,margin:"0 0 16px",fontStyle:"italic"},children:['"',c.quote,'"']}),s.jsx("button",{onClick:()=>f(null),style:{padding:"8px 20px",border:"1.5px solid #6a8a6a",borderRadius:999,background:"transparent",color:"#6a8a6a",cursor:"pointer",fontSize:13},children:"← 返回列表"})]}):o.length===0?s.jsx($i,{emoji:"📺"}):s.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:12},children:o.map(y=>s.jsxs("div",{style:{position:"relative",cursor:"pointer",borderRadius:10,overflow:"hidden",background:"rgba(0,0,0,0.04)",transition:"transform 0.2s"},onClick:()=>f(y),onMouseEnter:x=>x.currentTarget.style.transform="translateY(-4px)",onMouseLeave:x=>x.currentTarget.style.transform="translateY(0)",children:[s.jsx("button",{onClick:x=>{x.stopPropagation(),g(y.id)},style:{position:"absolute",top:6,right:6,width:22,height:22,border:"none",borderRadius:"50%",background:"rgba(0,0,0,0.25)",color:"rgba(255,255,255,0.85)",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2,opacity:0,transition:"opacity 0.2s"},onMouseEnter:x=>{x.currentTarget.style.opacity="1"},onMouseLeave:x=>{x.currentTarget.style.opacity="0"},children:"×"}),s.jsx("img",{src:y.cover,alt:y.title,style:{width:"100%",height:140,objectFit:"cover",display:"block"}}),s.jsxs("div",{style:{padding:"10px 12px"},children:[s.jsx("p",{style:{fontSize:13,fontWeight:600,color:"#4a4038",margin:"0 0 2px"},children:y.title}),s.jsxs("p",{style:{fontSize:11,color:"#b0a090",margin:0},children:[y.season," · ",y.date]})]})]},y.id))}),h&&s.jsx(Xi,{message:"确定要删除这条追剧记录吗？",onConfirm:()=>b(h),onCancel:()=>g(null)})]}),p&&s.jsx(Pi,{moduleType:"drama",onSubmit:(y,x)=>{var N;const S=[{id:Ii(),title:y.title,season:y.season||"",date:y.date||"",cover:((N=x.cover)==null?void 0:N[0])||"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=400&fit=crop",quote:y.quote||""},...o];l(S),Jt(it.dramas,S),m(!1),i()},onClose:()=>m(!1)})]})},Fo=[{id:"reading",emoji:"📖",name:"阅读",tint:"#DDD0B8"},{id:"photo",emoji:"📷",name:"摄影",tint:"#C8D8C0"},{id:"music",emoji:"🎧",name:"音乐/播客",tint:"#DCC8C0"},{id:"sport",emoji:"🏃",name:"运动",tint:"#D8C8A8"},{id:"meditation",emoji:"🧘",name:"冥想",tint:"#C0D0CC"},{id:"drama",emoji:"📺",name:"追剧",tint:"#D0C8C0"}],Rk=({onOpen:a})=>{const i=j.useRef(null),[o,l]=j.useState(0),[c,f]=j.useState(!1),p=j.useRef(0),m=j.useRef(0),h=130,g=8,b=Fo.length*(h+g)+g,y=Math.min(0,-(b-680)),x=(T,z,E)=>Math.max(z,Math.min(E,T)),w=T=>Math.round(T/(h+g))*(h+g);j.useEffect(()=>{if(!c)return;const T=E=>{const A=x(m.current+E.clientX-p.current,y,0);l(A),i.current&&(i.current.style.transition="none",i.current.style.transform=`translateX(${A}px)`)},z=E=>{f(!1);const A=x(w(x(m.current+E.clientX-p.current,y,0)),y,0);l(A),i.current&&(i.current.style.transition="transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",i.current.style.transform=`translateX(${A}px)`)};return window.addEventListener("mousemove",T),window.addEventListener("mouseup",z),()=>{window.removeEventListener("mousemove",T),window.removeEventListener("mouseup",z)}},[c,y]);const S=T=>{f(!0),p.current=T.clientX,m.current=o},N=T=>{f(!0),p.current=T.touches[0].clientX,m.current=o};j.useEffect(()=>{if(!c)return;const T=E=>{E.preventDefault();const A=x(m.current+E.touches[0].clientX-p.current,y,0);l(A),i.current&&(i.current.style.transition="none",i.current.style.transform=`translateX(${A}px)`)},z=()=>{f(!1);const E=x(w(o),y,0);l(E),i.current&&(i.current.style.transition="transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",i.current.style.transform=`translateX(${E}px)`)};return window.addEventListener("touchmove",T,{passive:!1}),window.addEventListener("touchend",z),()=>{window.removeEventListener("touchmove",T),window.removeEventListener("touchend",z)}},[c,o,y]);const C=T=>{const z=x(o+(T==="right"?-138:h+g),y,0);l(z),i.current&&(i.current.style.transition="transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",i.current.style.transform=`translateX(${z}px)`)};return s.jsxs(s.Fragment,{children:[s.jsxs("div",{style:{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:6},children:[s.jsxs("div",{style:{position:"relative",width:74,height:74,borderRadius:"50%",background:"radial-gradient(circle at 40% 35%, #f8f4ec, #e8dcc8 60%, #d8c8b0)",boxShadow:"0 4px 12px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.6)",display:"flex",alignItems:"center",justifyContent:"center"},children:[[0,1,2,3,4].map(T=>s.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:`${74-T*13}px`,height:`${74-T*13}px`,borderRadius:"50%",border:"1px solid rgba(180,160,120,0.25)"}},T)),s.jsx("div",{style:{width:10,height:10,borderRadius:"50%",background:"#8a7a6a",position:"relative",zIndex:1}})]}),s.jsx("div",{style:{fontSize:7,letterSpacing:"0.15em",color:"#b0a090",textTransform:"uppercase"},children:"KODAK 200"})]}),s.jsx("div",{style:{flex:1,overflow:"hidden",padding:"8px 0",cursor:c?"grabbing":"grab"},children:s.jsxs("div",{ref:i,onMouseDown:S,onTouchStart:N,style:{display:"flex",flexDirection:"column",transition:"transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)"},children:[s.jsx("div",{style:{display:"flex",gap:6,padding:"0 4px",marginBottom:6},children:Fo.map(()=>s.jsx("span",{style:{display:"block",flexShrink:0,width:10,height:8,borderRadius:2,background:"rgba(180,160,130,0.35)",border:"1px solid rgba(160,140,110,0.25)"}},Math.random()))}),s.jsx("div",{style:{display:"flex",gap:8,padding:"0 4px"},children:Fo.map(T=>s.jsxs("div",{onClick:()=>a(T.id),style:{position:"relative",flexShrink:0,width:120,height:90,borderRadius:12,background:T.tint,boxShadow:"0 4px 12px rgba(0,0,0,0.08)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,overflow:"hidden",cursor:"pointer",transition:"transform 0.2s ease, box-shadow 0.2s ease"},onMouseEnter:z=>{z.currentTarget.style.transform="translateY(-4px) scale(1.04)",z.currentTarget.style.boxShadow="0 8px 20px rgba(0,0,0,0.14)"},onMouseLeave:z=>{z.currentTarget.style.transform="translateY(0) scale(1)",z.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"},children:[s.jsx("span",{style:{fontSize:28,filter:"sepia(0.08) contrast(0.95)"},children:T.emoji}),s.jsx("span",{style:{fontSize:12,color:"rgba(60,50,40,0.75)",fontWeight:500,letterSpacing:"0.05em"},children:T.name})]},T.name))}),s.jsx("div",{style:{display:"flex",gap:6,padding:"0 4px",marginTop:6},children:Fo.map(()=>s.jsx("span",{style:{display:"block",flexShrink:0,width:10,height:8,borderRadius:2,background:"rgba(180,160,130,0.35)",border:"1px solid rgba(160,140,110,0.25)"}},Math.random()))})]})}),s.jsxs("div",{style:{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center"},children:[s.jsxs("div",{style:{position:"relative",width:74,height:74,borderRadius:"50%",background:"radial-gradient(circle at 40% 35%, #f8f4ec, #e8dcc8 60%, #d8c8b0)",boxShadow:"0 4px 12px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.6)",display:"flex",alignItems:"center",justifyContent:"center"},children:[[0,1,2,3,4].map(T=>s.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:`${74-T*13}px`,height:`${74-T*13}px`,borderRadius:"50%",border:"1px solid rgba(180,160,120,0.25)"}},T)),s.jsx("div",{style:{width:10,height:10,borderRadius:"50%",background:"#8a7a6a",position:"relative",zIndex:1}})]}),s.jsx("div",{style:{width:40,height:45,marginTop:8,animation:"lf3-cat-breathe 3s ease-in-out infinite"},children:s.jsxs("svg",{viewBox:"0 0 80 60",fill:"none",children:[s.jsx("ellipse",{cx:"40",cy:"45",rx:"30",ry:"12",fill:"#e8e0d0",opacity:"0.95"}),s.jsx("circle",{cx:"40",cy:"30",r:"18",fill:"#e8e0d0"}),s.jsx("path",{d:"M24 18 L28 30 L36 24 Z",fill:"#e8e0d0"}),s.jsx("path",{d:"M56 18 L52 30 L44 24 Z",fill:"#e8e0d0"}),s.jsx("ellipse",{cx:"34",cy:"28",rx:"4",ry:"3",fill:"#4a5a3a",opacity:"0.7"}),s.jsx("ellipse",{cx:"46",cy:"28",rx:"4",ry:"3",fill:"#4a5a3a",opacity:"0.7"}),s.jsx("circle",{cx:"33",cy:"27",r:"1.5",fill:"#fff",opacity:"0.8"}),s.jsx("circle",{cx:"45",cy:"27",r:"1.5",fill:"#fff",opacity:"0.8"}),s.jsx("ellipse",{cx:"40",cy:"33",rx:"2.5",ry:"1.5",fill:"#d4a0a0",opacity:"0.7"}),s.jsx("path",{d:"M37 36 Q40 38 43 36",stroke:"#8a7a6a",strokeWidth:"1",fill:"none",opacity:"0.5"})]})})]}),s.jsx("button",{onClick:()=>C("left"),style:{position:"absolute",top:"50%",left:-16,transform:"translateY(-50%)",zIndex:10,width:30,height:30,border:"1.5px solid rgba(150,130,100,0.3)",borderRadius:"50%",background:"rgba(255,252,244,0.88)",color:"#8a7a6a",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"},children:"‹"}),s.jsx("button",{onClick:()=>C("right"),style:{position:"absolute",top:"50%",right:-16,transform:"translateY(-50%)",zIndex:10,width:30,height:30,border:"1.5px solid rgba(150,130,100,0.3)",borderRadius:"50%",background:"rgba(255,252,244,0.88)",color:"#8a7a6a",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"},children:"›"}),s.jsx("style",{children:"@keyframes lf3-cat-breathe { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }"})]})},Dk=()=>{const a=cs(),[i,o]=j.useState(1),[l,c]=j.useState(null),[f,p]=j.useState(null);j.useEffect(()=>{const w=setTimeout(()=>{try{const S=new(window.AudioContext||window.webkitAudioContext),N=S.createOscillator(),C=S.createGain();N.connect(C),C.connect(S.destination),N.frequency.value=320,C.gain.value=.06,N.start(),N.stop(S.currentTime+.4)}catch{}},400);return()=>clearTimeout(w)},[]);const m=j.useRef(null);m.current=l,j.useEffect(()=>{const w=S=>{S.key==="Escape"&&(m.current?c(null):a("/"))};return window.addEventListener("keydown",w),()=>window.removeEventListener("keydown",w)},[a]);const h=()=>{c(null)},g=()=>o(w=>w===0?1:0),b=w=>{p(w)},x=l?{reading:Ck,photo:Tk,music:Ek,sport:zk,meditation:Mk,drama:Ak}[l]:null;return s.jsxs("div",{style:{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"},children:[s.jsx("div",{style:{position:"fixed",inset:0,zIndex:0,background:"linear-gradient(160deg, #F5EFE0 0%, #EDE4CC 40%, #E8DCC4 70%, #E0D4BC 100%)"}}),s.jsx("div",{style:{position:"fixed",inset:0,zIndex:1,pointerEvents:"none",backgroundImage:"/healing-forest.jpg",backgroundSize:"cover",backgroundPosition:"center",opacity:.1,filter:"blur(10px) saturate(0.6)"}}),s.jsx("button",{onClick:()=>a("/"),style:{position:"fixed",top:20,right:24,zIndex:20,width:42,height:42,border:"none",borderRadius:"50%",background:"rgba(255,255,255,0.85)",backdropFilter:"blur(10px)",boxShadow:"0 4px 16px -4px rgba(0,0,0,0.1)",color:"#7a6a5a",cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.25s ease, color 0.25s ease"},onMouseEnter:w=>{w.currentTarget.style.transform="rotate(90deg)",w.currentTarget.style.color="#c4877a"},onMouseLeave:w=>{w.currentTarget.style.transform="rotate(0deg)",w.currentTarget.style.color="#7a6a5a"},children:"×"}),s.jsx("button",{onClick:g,style:{position:"fixed",top:72,right:24,zIndex:20,width:36,height:36,border:"none",borderRadius:"50%",background:"rgba(255,255,255,0.7)",backdropFilter:"blur(8px)",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"},children:i===0?"🔇":"🔊"}),s.jsxs("svg",{style:{position:"fixed",top:20,left:0,width:100,height:140,zIndex:2,pointerEvents:"none"},viewBox:"0 0 100 140",fill:"none",children:[s.jsx("path",{d:"M10 140 Q20 110 25 90 Q30 70 35 55 Q40 40 45 30",stroke:"#9aaa8a",strokeWidth:"2",strokeLinecap:"round",fill:"none",opacity:"0.45"}),s.jsx("path",{d:"M25 90 Q15 75 12 65",stroke:"#9aaa8a",strokeWidth:"1.5",strokeLinecap:"round",fill:"none",opacity:"0.35"}),s.jsx("circle",{cx:"12",cy:"62",r:"3.5",fill:"#aab898",opacity:"0.5"}),s.jsx("circle",{cx:"18",cy:"72",r:"2.5",fill:"#aab898",opacity:"0.4"}),s.jsx("circle",{cx:"35",cy:"55",r:"3",fill:"#aab898",opacity:"0.5"}),s.jsx("path",{d:"M35 55 Q45 45 52 42",stroke:"#9aaa8a",strokeWidth:"1.5",strokeLinecap:"round",fill:"none",opacity:"0.35"}),s.jsx("circle",{cx:"52",cy:"40",r:"3.5",fill:"#aab898",opacity:"0.5"}),s.jsx("circle",{cx:"45",cy:"30",r:"2.5",fill:"#aab898",opacity:"0.4"})]}),s.jsxs("div",{style:{position:"relative",zIndex:5,display:"flex",flexDirection:"column",alignItems:"center",gap:28,width:"100%",maxWidth:900,padding:"60px 24px 40px"},children:[s.jsxs("div",{style:{textAlign:"center"},children:[s.jsx("h1",{style:{fontFamily:"Noto Serif SC, Georgia, serif",fontSize:"clamp(28px, 5vw, 40px)",fontWeight:700,color:"#4a4a3a",margin:"0 0 16px",letterSpacing:"0.08em"},children:"生活放映中 🎞"}),s.jsx("div",{style:{fontFamily:"Noto Serif SC, Georgia, serif",lineHeight:1.7},children:["如果把人生比作一整卷胶片：","前六卷都在寻找光，却忘了自己是光。","现在，终于轮到第七卷登场啦！","这里装着我私藏的六个快乐碎片。","别客气，随便点开看看——","是我为自己预留的补光时刻。✨"].map((w,S)=>s.jsx("p",{style:{fontSize:13.5,color:"#7a6a5a",margin:0,letterSpacing:"0.02em"},children:w},S))})]}),s.jsx("div",{style:{position:"relative",display:"flex",alignItems:"center",width:"100%",maxWidth:760},children:s.jsx(Rk,{onOpen:c})}),s.jsx("p",{style:{fontSize:12,color:"rgba(120,110,100,0.5)",margin:0,letterSpacing:"0.06em"},children:"← 点击模块探索内容 · 拖动胶卷滚动 →"})]}),x&&s.jsx(x,{onClose:h,onUpload:()=>b("已记录这一刻 ✨")}),f&&s.jsx(wk,{message:f,onDone:()=>p(null)}),s.jsx("style",{children:`
        @media (max-width: 600px) {
          .lf3-content { padding: 40px 12px 32px !important; gap: 20px !important; }
          .lf3-film-wrap { max-width: 100% !important; }
        }
      `})]})},S1="gratitude_entries",ss="gratitude_drafts",uf=["新生","接纳","表达","感恩","身体","小确幸","平静","创造","韧性","放下","连接","回顾"],Ok=["新的一年，从写下今天最想开始的改变开始…","今天，我允许自己不完美，接纳此刻的情绪和身体。","情绪不是敌人，今天我选择用文字、绘画或声音表达它。","今天，我感谢谁？哪怕只是一句问候、一个微笑。","身体在告诉我什么？今天我倾听它的信号，给它一杯水、一次拉伸。","今天，哪个微小瞬间让我嘴角上扬？一杯咖啡、一阵风、一句“你来了”。","今天，我为自己创造了一刻宁静——也许是闭眼深呼吸，也许是看云发呆。","今天，我允许自己“无用”地创造——画一笔、写一句、哼一段旋律。","今天，我面对了一个小挑战，我对自己说：“我可以慢慢来。”","今天，我放下了一件小事——也许是旧物、旧想法、旧情绪。","今天，我和谁有了真实的对话？哪怕只是眼神交汇、指尖触碰。","这一年，我感谢自己坚持下来的每一天。明年，我想继续温柔地生长。"],w1=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],Lk=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],df=[{key:"sun",label:"晴天"},{key:"cloud",label:"多云"},{key:"rain",label:"雨天"},{key:"moon",label:"夜晚"}],Ed=[{key:"joy",dot:"#F4D88A",label:"开心"},{key:"calm",dot:"#A5D6A7",label:"平静"},{key:"cool",dot:"#90CAF9",label:"冷静"},{key:"tender",dot:"#F4A6B8",label:"温柔"},{key:"soulful",dot:"#C5A3D6",label:"感性"},{key:"mellow",dot:"#D9C9B0",label:"平淡"}],Wx=({name:a,size:i=16})=>{const o={width:i,height:i,viewBox:"0 0 20 20",fill:"none",stroke:"currentColor",strokeWidth:1.3,strokeLinecap:"round",strokeLinejoin:"round"};return a==="sun"?s.jsxs("svg",{...o,children:[s.jsx("circle",{cx:"10",cy:"10",r:"3.4"}),s.jsx("path",{d:"M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4"})]}):a==="cloud"?s.jsx("svg",{...o,children:s.jsx("path",{d:"M6 14a3 3 0 0 1-.4-5.97 4 4 0 0 1 7.74-.78A2.7 2.7 0 0 1 15.5 14H6Z"})}):a==="rain"?s.jsxs("svg",{...o,children:[s.jsx("path",{d:"M6 11a3 3 0 0 1-.4-5.97 4 4 0 0 1 7.74-.78A2.7 2.7 0 0 1 15.5 11H6Z"}),s.jsx("path",{d:"M7 14.5l-1 2.5M11 14.5l-1 2.5M14 14.5l-1 2.5",opacity:"0.7"})]}):s.jsx("svg",{...o,children:s.jsx("path",{d:"M16 12.5A6.5 6.5 0 1 1 8 3.5a5.2 5.2 0 0 0 8 9Z"})})},k1=({size:a=15})=>s.jsxs("svg",{width:a,height:a,viewBox:"0 0 20 20",fill:"none",stroke:"currentColor",strokeWidth:1.3,strokeLinecap:"round",strokeLinejoin:"round",children:[s.jsx("path",{d:"M4 4.5C4 3.7 4.7 3.5 5.5 3.5H10v13H5.5C4.7 16.5 4 16.3 4 15.5Z"}),s.jsx("path",{d:"M16 4.5C16 3.7 15.3 3.5 14.5 3.5H10v13h4.5c.8 0 1.5-.2 1.5-1Z"})]}),Bk=({size:a=14})=>s.jsxs("svg",{width:a,height:a,viewBox:"0 0 20 20",fill:"none",children:[s.jsx("path",{d:"M10 2C5 3 3 7 3 11c0 3.5 3 6.5 7 6.5 0-5 2.5-9 7-11-3-2.5-5.5-4.5-7-4.5Z",fill:"currentColor",opacity:"0.85"}),s.jsx("path",{d:"M5 16c2-4 5-7 9-9",stroke:"rgba(255,255,255,0.5)",strokeWidth:"0.9",strokeLinecap:"round"})]}),yl=()=>{const a=new Date;return`${a.getFullYear()}-${String(a.getMonth()+1).padStart(2,"0")}-${String(a.getDate()).padStart(2,"0")}`},Uk=a=>{const i=a.split("-");return i.length>=2?parseInt(i[1],10):new Date().getMonth()+1},Vk=a=>{const[i,o,l]=a.split("-").map(Number),c=new Date(i,o-1,l);return`${i}年${o}月${l}日 ${Lk[c.getDay()]}`},Wf=a=>a?df.some(i=>i.key===a)?a:a.includes("☀")||a.includes("晴")?"sun":a.includes("☁")?"cloud":a.includes("雨")?"rain":a.includes("🌙")||a.includes("夜")?"moon":"sun":"sun",_k=()=>{try{const a=localStorage.getItem(S1);return a?JSON.parse(a).map(o=>{const l=o.month!=null?o.month:Uk(o.date||yl());return{id:o.id||o.date||`${Date.now()}`,date:o.date||yl(),month:l,mood:Wf(o.mood),color:o.color||"",content:o.content||o.text||""}}):[]}catch{return[]}},Jx=a=>{localStorage.setItem(S1,JSON.stringify(a))},qk=a=>{try{return JSON.parse(localStorage.getItem(ss)||"{}")[String(a)]||null}catch{return null}},Hk=(a,i)=>{try{const o=JSON.parse(localStorage.getItem(ss)||"{}");o[String(a)]=i,localStorage.setItem(ss,JSON.stringify(o))}catch{}},Gk=a=>{try{const i=JSON.parse(localStorage.getItem(ss)||"{}");delete i[String(a)],localStorage.setItem(ss,JSON.stringify(i))}catch{}},zd={enter:a=>({rotateY:a>0?95:-95,opacity:0}),center:{rotateY:0,opacity:1},exit:a=>({rotateY:a>0?-95:95,opacity:0})},Yk=()=>s.jsxs("div",{className:"gj-cover-scene","aria-hidden":"true",children:[s.jsx("img",{src:"/gratitude-cover.jpg",alt:"",className:"gj-cover-img",draggable:!1}),s.jsx("div",{className:"gj-cover-veil"}),s.jsx("span",{className:"gj-bokeh gj-bokeh-1"}),s.jsx("span",{className:"gj-bokeh gj-bokeh-2"})]}),Fk=({currentMonth:a,monthsWithEntries:i,onOpenMonth:o,onClose:l})=>s.jsxs("div",{className:"gj-page-inner gj-directory",children:[s.jsx("header",{className:"gj-page-head",children:s.jsxs("div",{children:[s.jsx("h3",{className:"gj-page-title",children:"月度篇章"}),s.jsx("p",{className:"gj-page-sub",children:"十二个月，十二种向内的探险"})]})}),s.jsx("div",{className:"gj-grid",children:Array.from({length:12},(c,f)=>{const p=f+1,m=p===a,h=i.has(p);return s.jsxs(X.button,{type:"button",className:`gj-month-card${m?" gj-current":""}`,whileHover:{y:-5,transition:{type:"spring",stiffness:320,damping:22}},whileTap:{scale:.97},onClick:()=>o(p),"aria-label":`${w1[f]} · ${uf[f]}`,children:[h&&s.jsx("span",{className:"gj-month-dot"}),m&&s.jsx("span",{className:"gj-month-today",children:"本月"}),s.jsx("span",{className:"gj-month-num",children:p}),s.jsx("span",{className:"gj-month-theme",children:uf[f]})]},p)})}),s.jsxs("button",{className:"gj-close-book",onClick:l,"aria-label":"合上书",children:[s.jsx(k1,{}),s.jsx("span",{children:"合上书"})]})]}),Ik=({selectedMonth:a,today:i,content:o,weather:l,color:c,savedFlash:f,entries:p,onContent:m,onWeather:h,onColor:g,onSave:b,onDelete:y,onBack:x,onClose:w})=>{var N;const S=j.useMemo(()=>p.filter(C=>C.month===a).sort((C,T)=>T.date>C.date?1:-1),[p,a]);return s.jsxs("div",{className:"gj-page-inner gj-diary",children:[s.jsxs("div",{className:"gj-diary-top",children:[s.jsxs("button",{className:"gj-back-dir",onClick:x,"aria-label":"返回目录",children:[s.jsx("span",{"aria-hidden":"true",children:"←"})," 目录"]}),s.jsxs("span",{className:"gj-detail-theme",children:[w1[a-1]," · ",uf[a-1]]})]}),s.jsxs("div",{className:"gj-guidance",children:[s.jsx("span",{className:"gj-guidance-mark",children:s.jsx(Bk,{size:13})}),s.jsx("p",{className:"gj-guidance-text",children:Ok[a-1]})]}),s.jsxs("div",{className:"gj-detail-body",children:[s.jsxs("div",{className:"gj-sidebar",children:[s.jsxs("div",{children:[s.jsx("div",{className:"gj-sidebar-label",children:"日期"}),s.jsx("div",{className:"gj-sidebar-date",children:Vk(i)})]}),s.jsxs("div",{children:[s.jsx("div",{className:"gj-sidebar-label",children:"天气"}),s.jsx("div",{className:"gj-weather-picker",children:df.map(C=>s.jsx("button",{type:"button",className:`gj-weather-btn${l===C.key?" gj-weather-active":""}`,onClick:()=>h(C.key),title:C.label,"aria-label":C.label,children:s.jsx(Wx,{name:C.key,size:17})},C.key))})]}),s.jsxs("div",{children:[s.jsx("div",{className:"gj-sidebar-label",children:"心情"}),s.jsx("div",{className:"gj-mood-picker",children:Ed.map(C=>s.jsx("button",{type:"button",className:`gj-mood-dot${c===C.key?" gj-mood-active":""}`,style:{"--gj-dot":C.dot,background:C.dot},onClick:()=>g(c===C.key?"":C.key),title:C.label,"aria-label":C.label,"aria-pressed":c===C.key},C.key))}),s.jsx("p",{className:"gj-mood-hint",children:c?(N=Ed.find(C=>C.key===c))==null?void 0:N.label:"轻触一颗，标记此刻"})]})]}),s.jsx("div",{className:"gj-writing",children:s.jsx("textarea",{className:"gj-textarea",value:o,onChange:C=>m(C.target.value),placeholder:"在这里，写下今天的温柔…",spellCheck:!1})})]}),s.jsxs("div",{className:"gj-save-area",children:[s.jsx(Ne,{children:f&&s.jsx(X.span,{className:"gj-save-feedback",initial:{opacity:0,y:6},animate:{opacity:1,y:0},exit:{opacity:0,y:6},transition:{duration:.4},children:"已记录 ✨ 今天的温柔已存入心底。"})}),s.jsx("button",{type:"button",className:`gj-save-btn${f?" gj-saved":""}`,onClick:b,disabled:!o.trim(),children:f?"已保存 ✓":"保存"})]}),S.length>0&&s.jsxs("div",{className:"gj-month-history",children:[s.jsxs("h4",{className:"gj-month-history-title",children:["本月记录 ",s.jsx("span",{className:"gj-month-history-count",children:S.length})]}),s.jsx("div",{className:"gj-month-entry-list",children:S.map(C=>{var z;const T=Ed.find(E=>E.key===C.color);return s.jsxs("div",{className:"gj-month-entry",children:[s.jsxs("div",{className:"gj-month-entry-header",children:[s.jsxs("div",{className:"gj-month-entry-date-row",children:[s.jsx("span",{className:"gj-month-entry-date",children:C.date}),s.jsx("span",{className:"gj-month-entry-weather",title:(z=df.find(E=>E.key===C.mood))==null?void 0:z.label,children:s.jsx(Wx,{name:Wf(C.mood),size:14})}),T&&s.jsx("span",{className:"gj-month-entry-color-tag",style:{background:T.dot},title:T.label})]}),s.jsx("button",{className:"gj-month-entry-delete",onClick:()=>y(C.id),"aria-label":"删除",children:"×"})]}),s.jsx("p",{className:"gj-month-entry-text",children:C.content})]},C.id)})})]}),s.jsxs("button",{className:"gj-close-book",onClick:w,"aria-label":"合上书",children:[s.jsx(k1,{}),s.jsx("span",{children:"合上书"})]})]})},Xk=()=>{const[a,i]=j.useState("cover"),[o,l]=j.useState(1),[c,f]=j.useState(null),[p,m]=j.useState([]),[h,g]=j.useState(""),[b,y]=j.useState("sun"),[x,w]=j.useState(""),[S,N]=j.useState(!1),C=j.useMemo(()=>yl(),[]),T=j.useMemo(()=>new Date().getMonth()+1,[]);j.useEffect(()=>{m(_k())},[]);const z=j.useMemo(()=>{const K=new Set;return p.forEach(te=>K.add(te.month)),K},[p]),E=j.useCallback((K,te)=>{Hk(K,te)},[]),A=j.useCallback(K=>{f(K),l(1),i("diary");const te=qk(K);if(te)y(te.weather),w(te.color),g(te.content);else{const le=p.filter(q=>q.month===K).sort((q,ee)=>ee.date>q.date?1:-1)[0];le?(y(Wf(le.mood)),w(le.color),g(le.content)):(y("sun"),w(""),g(""))}},[p]),R=j.useCallback(()=>{l(1),i("directory")},[]),B=j.useCallback(()=>{l(-1),i("cover"),f(null)},[]),_=j.useCallback(()=>{l(-1),i("directory"),f(null)},[]),W=j.useCallback(K=>{g(K),c!==null&&E(c,{weather:b,color:x,content:K})},[c,b,x,E]),ne=j.useCallback(K=>{y(K),c!==null&&E(c,{weather:K,color:x,content:h})},[c,x,h,E]),H=j.useCallback(K=>{w(K),c!==null&&E(c,{weather:b,color:K,content:h})},[c,b,h,E]),F=j.useCallback(()=>{if(!h.trim()||c===null)return;const K=yl(),te={id:`${K}-${Date.now()}`,date:K,month:c,mood:b,color:x,content:h.trim()},le=p.findIndex(ee=>ee.date===K&&ee.month===c);let q;le>=0?q=p.map((ee,ie)=>ie===le?{...te,id:ee.id}:ee):q=[te,...p],m(q),Jx(q),Gk(c),N(!0),window.setTimeout(()=>N(!1),2e3)},[h,c,b,x,p]),Q=j.useCallback(K=>{const te=p.filter(le=>le.id!==K);m(te),Jx(te)},[p]);return s.jsxs("div",{className:"gj-root",children:[s.jsx("div",{className:"gj-book-stand",children:s.jsxs("div",{className:"gj-book",children:[s.jsx("div",{className:"gj-spine"}),s.jsxs(Ne,{mode:"wait",custom:o,children:[a==="cover"&&s.jsxs(X.div,{className:"gj-page gj-cover",custom:o,variants:zd,initial:"enter",animate:"center",exit:"exit",transition:{duration:.62,ease:[.4,0,.2,1]},onClick:R,role:"button",tabIndex:0,"aria-label":"翻开感恩日记",onKeyDown:K=>{(K.key==="Enter"||K.key===" ")&&(K.preventDefault(),R())},children:[s.jsx(Yk,{}),s.jsx("div",{className:"gj-cover-text-veil","aria-hidden":"true"}),s.jsxs("div",{className:"absolute inset-0 z-[2] flex flex-col items-center justify-center px-10 py-24 text-center md:px-14 md:py-28",children:[s.jsx("h2",{className:"gj-cover-title m-0 font-medium leading-tight tracking-[0.12em] text-[2rem] md:text-[2.75rem] lg:text-[3.25rem]",children:"感恩日记"}),s.jsx("p",{className:"gj-cover-en mt-4 italic font-serif text-gray-500 text-[0.82rem] tracking-[0.18em] md:mt-5 md:text-[0.9rem]",children:"Gratitude Journal"}),s.jsx("p",{className:"gj-cover-sub mt-6 max-w-xs text-[0.8rem] leading-[2.15] tracking-[0.14em] md:mt-8 md:max-w-sm md:text-[0.92rem]",children:"在细碎的日常里，写下属于自己生命的注脚。"}),s.jsx("span",{className:"gj-cover-hint",children:"轻触翻开"})]})]},"cover"),a==="directory"&&s.jsx(X.div,{className:"gj-page gj-page-paper",custom:o,variants:zd,initial:"enter",animate:"center",exit:"exit",transition:{duration:.62,ease:[.4,0,.2,1]},children:s.jsx(Fk,{currentMonth:T,monthsWithEntries:z,onOpenMonth:A,onClose:B})},"directory"),a==="diary"&&c!==null&&s.jsx(X.div,{className:"gj-page gj-page-paper",custom:o,variants:zd,initial:"enter",animate:"center",exit:"exit",transition:{duration:.62,ease:[.4,0,.2,1]},children:s.jsx(Ik,{selectedMonth:c,today:C,content:h,weather:b,color:x,savedFlash:S,entries:p,onContent:W,onWeather:ne,onColor:H,onSave:F,onDelete:Q,onBack:_,onClose:B})},`diary-${c}`)]})]})}),s.jsx("style",{children:`
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
      `})]})},Md=[{id:"anxiety",emoji:"😟",label:"焦虑/压力大",desc:"均匀节奏 · 找回专注",color:"#5B9BD5",modeName:"方形呼吸 · 专注模式",phases:[{name:"inhale",duration:4,label:"吸气",fullLabel:"吸气"},{name:"hold",duration:4,label:"屏息",fullLabel:"屏息"},{name:"exhale",duration:4,label:"呼气",fullLabel:"呼气"},{name:"holdEmpty",duration:4,label:"空肺",fullLabel:"屏息·空肺"}]},{id:"tired",emoji:"😴",label:"疲惫/失眠",desc:"延长呼气 · 深度放松",color:"#7E57C2",modeName:"478 呼吸法",phases:[{name:"inhale",duration:4,label:"吸气",fullLabel:"吸气"},{name:"hold",duration:7,label:"屏息",fullLabel:"屏息"},{name:"exhale",duration:8,label:"呼气",fullLabel:"呼气"}]},{id:"low_energy",emoji:"😫",label:"能量不足",desc:"快速节奏 · 唤醒活力",color:"#FF8A65",modeName:"能量呼吸法",phases:[{name:"inhale",duration:3,label:"吸气",fullLabel:"吸气"},{name:"hold",duration:1,label:"屏息",fullLabel:"屏息"},{name:"exhale",duration:2,label:"呼气",fullLabel:"呼气"}]}],Xn=.76,Io=1.14,ff=80,ey=5,Pr=2*Math.PI*ff,Xo='"Noto Serif SC", Georgia, "Times New Roman", serif';function Pk(a,i){switch(a){case"inhale":return Xn+(Io-Xn)*i;case"hold":return Io;case"exhale":return Io-(Io-Xn)*i;case"holdEmpty":return Xn}}function $k(a,i){switch(a){case"inhale":return i;case"hold":return 1;case"exhale":return 1-i;case"holdEmpty":return 0}}const Zk=()=>{const[a,i]=j.useState(Md[0]),[o,l]=j.useState(!1),[c,f]=j.useState(!1),[p,m]=j.useState(0),[h,g]=j.useState(Md[0].phases[0].duration),[b,y]=j.useState(0),x=j.useRef(null),w=j.useRef(null),S=j.useRef(0),N=a.phases,C=N[p],T=j.useRef(N);T.current=N;const z=j.useRef(p);z.current=p,j.useEffect(()=>{g(C.duration)},[C]),j.useEffect(()=>{if(!o)return;const Q=C.duration*1e3,K=C.name,te=performance.now()-S.current;x.current&&(x.current.style.transition="none"),w.current&&(w.current.style.transition="none");let le=0,q=-1;const ee=ie=>{const fe=ie-te;S.current=fe;const ye=Math.min(fe/Q,1);if(x.current&&(x.current.style.transform=`scale(${Pk(K,ye)})`),w.current){const ae=$k(K,ye);w.current.style.strokeDashoffset=String(Pr*(1-ae))}const D=Math.ceil((Q-fe)/1e3),$=Math.max(D,1);if($!==q&&(q=$,g($)),ye<1)le=requestAnimationFrame(ee);else{S.current=0;const ae=T.current,re=(z.current+1)%ae.length;m(re),re===0&&y(pe=>pe+1)}};return le=requestAnimationFrame(ee),()=>cancelAnimationFrame(le)},[o,p,a]);const E=F=>{l(!1),f(!1),i(F),m(0),g(F.phases[0].duration),y(0),S.current=0,x.current&&(x.current.style.transition="transform 0.5s ease",x.current.style.transform=`scale(${Xn})`),w.current&&(w.current.style.transition="stroke-dashoffset 0.5s ease",w.current.style.strokeDashoffset=String(Pr))},A=()=>{o||f(!0),l(F=>!F)},R=()=>{l(!1),f(!1),m(0),g(a.phases[0].duration),y(0),S.current=0,x.current&&(x.current.style.transition="transform 0.6s ease",x.current.style.transform=`scale(${Xn})`),w.current&&(w.current.style.transition="stroke-dashoffset 0.6s ease",w.current.style.strokeDashoffset=String(Pr))},B=N.map(F=>F.duration).join("-"),_=!c,W=o?"暂停":_?"开始":"继续",ne=_?"准备开始":C.fullLabel,H=N.length>3;return s.jsxs("div",{className:"bg-root",children:[s.jsx("style",{children:`
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
          font-family: ${Xo};
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
          opacity: ${o?.35:.12};
          transition: opacity 0.6s ease, background 0.5s ease;
          pointer-events: none;
        }

        /* SVG 圆弧 */
        .bg-arc-svg {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          transform: rotate(-90deg);
          opacity: ${o?1:.5};
          transition: opacity 0.5s ease;
        }
        .bg-arc-track {
          fill: none;
          stroke: var(--border);
          stroke-width: ${ey};
          opacity: 0.5;
        }
        .bg-arc-progress {
          fill: none;
          stroke: var(--arc-color, #5B9BD5);
          stroke-width: ${ey};
          stroke-linecap: round;
        }

        /* 呼吸光球 */
        .bg-orb {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          will-change: transform;
          transform: scale(${Xn});
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
          font-family: ${Xo};
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
          font-family: ${Xo};
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
          font-family: ${Xo};
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
      `}),s.jsxs("div",{className:"bg-header",children:[s.jsx("p",{className:"bg-title",children:"呼吸引导"}),s.jsx("p",{className:"bg-subtitle",children:"选择你当下的状态，开始调整"})]}),s.jsx("div",{className:"bg-state-bar",children:Md.map(F=>s.jsxs("button",{className:`bg-state-btn${a.id===F.id?" active":""}`,style:{"--state-color":F.color,background:a.id===F.id?F.color:void 0},onClick:()=>E(F),children:[s.jsx("span",{className:"bg-state-emoji",children:F.emoji}),s.jsx("span",{children:F.label})]},F.id))}),s.jsxs("div",{className:"bg-arc-area",style:{"--arc-color":a.color,"--aura-color":`${a.color}40`},children:[s.jsx("div",{className:"bg-aura"}),s.jsxs("svg",{className:"bg-arc-svg",viewBox:"0 0 200 200",children:[s.jsx("circle",{className:"bg-arc-track",cx:"100",cy:"100",r:ff}),s.jsx("circle",{ref:w,className:"bg-arc-progress",cx:"100",cy:"100",r:ff,strokeDasharray:Pr,style:{strokeDashoffset:Pr,stroke:a.color}})]}),s.jsx("div",{ref:x,className:"bg-orb",style:{background:`radial-gradient(circle at center, ${a.color}55 0%, ${a.color}22 45%, ${a.color}00 72%)`}}),s.jsxs("div",{className:"bg-center",children:[s.jsx("p",{className:"bg-countdown",children:h}),s.jsx("p",{className:"bg-phase-label",children:ne})]})]}),s.jsx("div",{className:"bg-rhythm",style:{"--arc-color":a.color,gap:H?"14px":"22px","--sep-pos":H?"-8px":"-15px"},children:N.map((F,Q)=>s.jsxs("div",{className:"bg-rhythm-item",children:[s.jsx("span",{className:`bg-rhythm-dot${c&&p===Q?" active":""}`}),s.jsx("span",{className:`bg-rhythm-text${c&&p===Q?" active":""}`,children:F.label})]},Q))}),s.jsxs("div",{className:"bg-mode-info",children:[s.jsx("p",{className:"bg-mode-name",children:a.modeName}),s.jsx("p",{className:"bg-mode-desc",children:a.desc}),s.jsxs("p",{className:"bg-cycle-count",children:[B," 节奏 · 已完成 ",s.jsx("span",{children:b})," 个循环"]})]}),s.jsxs("div",{className:"bg-controls",style:{"--arc-color":a.color},children:[s.jsx("button",{className:"bg-btn bg-btn-start",onClick:A,children:W}),s.jsx("button",{className:"bg-btn bg-btn-reset",onClick:R,children:"重置"})]})]})},Qk=[1,3,5,10],Ad=[{id:"ocean",icon:"🌊",label:"海浪",sub:"Ocean"},{id:"forest",icon:"🌲",label:"森林",sub:"Forest"},{id:"fire",icon:"🔥",label:"篝火",sub:"Fire"},{id:"music",icon:"🎵",label:"音乐",sub:"Music"}],Kk=a=>{const i=Math.floor(a/60),o=a%60;return`${String(i).padStart(2,"0")}:${String(o).padStart(2,"0")}`};let $r=null;function Wk(){return $r||($r=new AudioContext),$r.state==="suspended"&&$r.resume(),$r}function Jk(a){const i=Wk(),o=i.createGain();o.gain.value=.15,o.connect(i.destination);const l=[o],c=()=>{l.forEach(f=>{try{"stop"in f&&typeof f.stop=="function"&&f.stop()}catch{}try{f.disconnect()}catch{}})};try{switch(a){case"ocean":{const f=i.createOscillator();f.type="sine",f.frequency.value=80;const p=i.createGain();p.gain.value=.6,f.connect(p).connect(o),f.start(),l.push(f,p);const m=i.createOscillator();m.type="sine",m.frequency.value=.15;const h=i.createGain();h.gain.value=.4,m.connect(h).connect(p.gain),m.start(),l.push(m,h);break}case"forest":{for(let h=0;h<3;h++){const g=i.createOscillator();g.type="triangle",g.frequency.value=800+h*400;const b=i.createGain();b.gain.value=.15-h*.03,g.connect(b).connect(o),g.start(),l.push(g,b)}const f=i.createOscillator();f.type="sawtooth",f.frequency.value=120;const p=i.createGain();p.gain.value=.05;const m=i.createBiquadFilter();m.type="bandpass",m.frequency.value=600,m.Q.value=.5,f.connect(p).connect(m).connect(o),f.start(),l.push(f,p,m);break}case"fire":{const f=i.createOscillator();f.type="sawtooth",f.frequency.value=60;const p=i.createBiquadFilter();p.type="lowpass",p.frequency.value=200;const m=i.createGain();m.gain.value=.5,f.connect(p).connect(m).connect(o),f.start(),l.push(f,p,m);const h=i.createOscillator();h.type="square",h.frequency.value=30;const g=i.createGain();g.gain.value=.08,h.connect(g).connect(o),h.start(),l.push(h,g);break}case"music":{const f=[261.63,329.63,392,329.63];let p=0;const m=i.createOscillator();m.type="sine",m.frequency.value=f[0];const h=i.createGain();h.gain.value=.4,m.connect(h).connect(o),m.start(),l.push(m,h);const g=setInterval(()=>{p=(p+1)%f.length,m.frequency.setValueAtTime(f[p],i.currentTime)},1200),b=c;return{stop:()=>{clearInterval(g),b()}}}}}catch{}return{stop:c}}const eN=()=>{var R,B;const[a,i]=j.useState("ocean"),[o,l]=j.useState(5),[c,f]=j.useState(!1),[p,m]=j.useState(0),[h,g]=j.useState(!1),[b,y]=j.useState(!1),[x,w]=j.useState(!1),S=j.useRef(null),N=j.useCallback(()=>{S.current&&(S.current.stop(),S.current=null)},[]);j.useEffect(()=>()=>N(),[N]),j.useEffect(()=>{if(!h)return;const _=setInterval(()=>{m(W=>{if(W<=1){clearInterval(_),g(!1),y(!0),N();try{const ne=parseInt(localStorage.getItem("meditation_total")||"0",10);localStorage.setItem("meditation_total",String(ne+o*60))}catch{}return 0}return W-1})},1e3);return()=>clearInterval(_)},[h,o,N]);const C=()=>{y(!1),m(o*60),g(!0),N(),S.current=Jk(a)},T=()=>{g(!1),m(0),y(!1),N()},z=()=>{y(!1),m(0)},E=h&&p>0?1-p/(o*60):b?1:0,A=2*Math.PI*92;return s.jsxs(s.Fragment,{children:[s.jsxs(X.div,{className:"ms-card",initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.4,ease:"easeOut"},children:[s.jsxs("div",{className:"ms-header",children:[s.jsx("h3",{className:"ms-title",children:"冥想空间"}),s.jsx("p",{className:"ms-subtitle",children:"聆听自然，放空思绪"})]}),s.jsxs(Ne,{mode:"wait",children:[!h&&!b&&s.jsxs(X.div,{className:"ms-setup",initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.3},children:[s.jsx("div",{className:"ms-section-label",children:"选择环境音"}),s.jsxs("div",{className:"ms-sound-grid",children:[Ad.map(_=>s.jsxs(X.button,{className:`ms-sound-card ${a===_.id?"ms-sound-active":""}`,onClick:()=>i(_.id),whileHover:{scale:1.04},whileTap:{scale:.97},children:[s.jsx("span",{className:"ms-sound-icon",children:_.icon}),s.jsx("span",{className:"ms-sound-label",children:_.label}),s.jsx("span",{className:"ms-sound-sub",children:_.sub})]},_.id)),s.jsxs(X.button,{className:"ms-sound-card ms-sound-coming",onClick:()=>{w(!0),setTimeout(()=>w(!1),8e3)},whileHover:{scale:1.04},whileTap:{scale:.97},children:[s.jsx("span",{className:"ms-sound-icon",children:"✨"}),s.jsx("span",{className:"ms-sound-label",children:"更多音频"}),s.jsx("span",{className:"ms-sound-sub",children:"Coming Soon"})]})]}),s.jsx("div",{className:"ms-section-label",children:"选择时长"}),s.jsx("div",{className:"ms-duration-pills",children:Qk.map(_=>s.jsxs("button",{className:`ms-pill ${o===_?"ms-pill-active":""}`,onClick:()=>l(_),children:[_," min"]},_))}),s.jsxs("div",{className:"ms-toggle-row",children:[s.jsx("span",{className:"ms-toggle-label",children:"语音引导"}),s.jsx("button",{className:`ms-toggle-track ${c?"ms-toggle-on":""}`,onClick:()=>f(_=>!_),"aria-label":"语音引导开关",children:s.jsx(X.span,{className:"ms-toggle-thumb",animate:{x:c?18:2},transition:{type:"spring",stiffness:500,damping:30}})})]}),s.jsx(X.button,{className:"ms-start-btn",onClick:C,whileHover:{scale:1.04},whileTap:{scale:.97},children:c?"开始冥想（带引导）":"开始冥想"})]},"setup"),h&&s.jsxs(X.div,{className:"ms-running",initial:{opacity:0,scale:.96},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.96},transition:{duration:.4},children:[s.jsxs(X.div,{className:"ms-active-sound",initial:{opacity:0},animate:{opacity:1},transition:{delay:.2},children:[(R=Ad.find(_=>_.id===a))==null?void 0:R.icon," ",(B=Ad.find(_=>_.id===a))==null?void 0:B.label,c?" + 语音引导":""]}),s.jsxs("div",{className:"ms-progress-ring",children:[s.jsxs("svg",{className:"ms-ring-svg",viewBox:"0 0 200 200",children:[s.jsx("circle",{className:"ms-ring-bg",cx:"100",cy:"100",r:"92",fill:"none",strokeWidth:"4"}),s.jsx(X.circle,{className:"ms-ring-fill",cx:"100",cy:"100",r:"92",fill:"none",strokeWidth:"4",strokeLinecap:"round",strokeDasharray:A,initial:{strokeDashoffset:A},animate:{strokeDashoffset:A*(1-E)},transition:{duration:1,ease:"linear"},transform:"rotate(-90 100 100)"})]}),s.jsxs("div",{className:"ms-countdown",children:[s.jsx("span",{className:"ms-time",children:Kk(p)}),s.jsx("span",{className:"ms-time-label",children:"剩余"})]})]}),s.jsx(X.button,{className:"ms-end-btn",onClick:T,whileHover:{scale:1.04},whileTap:{scale:.97},children:"结束"})]},"running"),b&&s.jsxs(X.div,{className:"ms-completed",initial:{opacity:0,scale:.85},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.85},transition:{duration:.5,ease:"easeOut"},children:[[0,1,2].map(_=>s.jsx(X.div,{className:"ms-ripple",initial:{scale:0,opacity:.5},animate:{scale:3,opacity:0},transition:{duration:2,ease:"easeOut",delay:_*.5,repeat:1/0,repeatDelay:1}},_)),s.jsx("div",{className:"ms-complete-icon",children:"✨"}),s.jsx("p",{className:"ms-complete-label",children:"冥想完成"}),s.jsxs("p",{className:"ms-complete-duration",children:["本次冥想 ",o," 分钟"]}),s.jsx(X.button,{className:"ms-start-btn",onClick:z,whileHover:{scale:1.04},whileTap:{scale:.97},children:"再来一次"})]},"completed")]}),s.jsx("style",{children:`
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
      `})]}),x&&s.jsx("div",{className:"ms-coming-toast","data-testid":"coming-toast",children:"更多精彩音频正在路上，敬请期待！"})]})},tN=[{id:1,avatar:"🌿",nickname:"访客 A",stars:5,content:"呼吸引导的数字倒计时太有安全感了，焦虑的时候点开很管用。",isSeed:!0},{id:2,avatar:"🍂",nickname:"匿名用户",stars:5,content:"配色很舒服，像真的在森林里一样。",isSeed:!0},{id:3,avatar:"🦌",nickname:"林间漫步者",stars:4,content:"希望能增加自定义呼吸时长的功能。",isSeed:!0},{id:4,avatar:"🌙",nickname:"夜猫子",stars:5,content:"感恩日记的 12 月主题很戳我，坚持写了三天了！",isSeed:!0}],ty=["🍃","🌸","🦋","🍄","🌱","🌷","🐦","🦉"],aN=({count:a})=>s.jsx("span",{className:"mb-stars",children:[1,2,3,4,5].map(i=>s.jsx("span",{className:i<=a?"mb-star-filled":"mb-star-empty",children:"★"},i))}),nN=()=>{const[a,i]=j.useState(tN),[o,l]=j.useState(""),[c,f]=j.useState(""),[p,m]=j.useState(!1),h=g=>{if(g.preventDefault(),!c.trim())return;const b=ty[Math.floor(Math.random()*ty.length)],y={id:Date.now(),avatar:b,nickname:o.trim()||"匿名访客",stars:0,content:c.trim()};i(x=>[y,...x]),f(""),l(""),m(!0),window.setTimeout(()=>m(!1),2500)};return s.jsxs("div",{className:"mb-container",children:[s.jsxs("form",{className:"mb-form",onSubmit:h,children:[s.jsx("h4",{className:"mb-form-title",children:"留下你的感受"}),s.jsx("p",{className:"mb-form-desc",children:"你的只言片语，可能是某个人森林里的一束光。"}),s.jsx("input",{type:"text",className:"mb-input",placeholder:"昵称（可选，留空即匿名）",value:o,onChange:g=>l(g.target.value),maxLength:20}),s.jsx("textarea",{className:"mb-textarea",placeholder:"写下你想说的话…",value:c,onChange:g=>f(g.target.value),maxLength:200,rows:3}),s.jsxs("div",{className:"mb-form-footer",children:[s.jsxs("span",{className:"mb-char-count",children:[c.length,"/200"]}),s.jsx("button",{type:"submit",className:"mb-submit-btn",disabled:!c.trim(),children:"发布留言"})]}),s.jsx(Ne,{children:p&&s.jsx(X.span,{className:"mb-submit-feedback",initial:{opacity:0,y:6},animate:{opacity:1,y:0},exit:{opacity:0,y:6},transition:{duration:.3},children:"已发布 ✨ 感谢你的分享。"})})]}),s.jsxs("div",{className:"mb-reviews-header",children:[s.jsx("h4",{className:"mb-reviews-title",children:"来自访客的留言"}),s.jsxs("span",{className:"mb-reviews-count",children:[a.length," 条"]})]}),s.jsx("div",{className:"mb-reviews-grid",children:s.jsx(Ne,{initial:!1,children:a.map((g,b)=>s.jsxs(X.div,{className:`mb-review-card${g.isSeed?"":" mb-review-user"}`,initial:g.isSeed?{opacity:0,y:16}:{opacity:0,y:-12,scale:.96},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,scale:.95},transition:{duration:.4,delay:g.isSeed?b*.1:0},whileHover:{y:-3,boxShadow:"0 8px 24px -6px rgba(60,80,60,0.15)"},children:[s.jsxs("div",{className:"mb-review-top",children:[s.jsx("div",{className:"mb-review-avatar",children:g.avatar}),s.jsxs("div",{className:"mb-review-info",children:[s.jsxs("span",{className:"mb-review-name",children:[g.nickname,!g.isSeed&&s.jsx("span",{className:"mb-review-tag",children:"新"})]}),g.stars>0&&s.jsx(aN,{count:g.stars})]})]}),s.jsx("p",{className:"mb-review-text",children:g.content})]},g.id))})}),s.jsx("style",{children:`
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
      `})]})},iN=()=>s.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 20 20",fill:"none",children:[s.jsx("path",{d:"M4 3h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",stroke:"currentColor",strokeWidth:"1.4"}),s.jsx("path",{d:"M13 3v4M9 3v4M4 9h12M4 13h8",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"})]}),rN=()=>s.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 20 20",fill:"none",children:[s.jsx("circle",{cx:"10",cy:"10",r:"6",stroke:"currentColor",strokeWidth:"1.4"}),s.jsx("circle",{cx:"10",cy:"10",r:"3",stroke:"currentColor",strokeWidth:"1",opacity:"0.5"})]}),sN=()=>s.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 20 20",fill:"none",children:[s.jsx("circle",{cx:"10",cy:"6",r:"2.5",stroke:"currentColor",strokeWidth:"1.4"}),s.jsx("path",{d:"M4 16C4 13 6.5 11 10 11C13.5 11 16 13 16 16",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"}),s.jsx("path",{d:"M6 11L4 8M14 11L16 8",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round",opacity:"0.5"})]}),oN=()=>s.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 20 20",fill:"none",children:[s.jsx("rect",{x:"3",y:"3",width:"14",height:"12",rx:"2",stroke:"currentColor",strokeWidth:"1.4"}),s.jsx("path",{d:"M7 15V18M13 15V18",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),s.jsx("path",{d:"M6 8H14M6 11H11",stroke:"currentColor",strokeWidth:"1",opacity:"0.5",strokeLinecap:"round"})]}),ay=[{id:"journal",label:"感恩日记",subtitle:"Gratitude Journal",icon:s.jsx(iN,{})},{id:"breathing",label:"呼吸引导",subtitle:"Breathing Guide",icon:s.jsx(rN,{})},{id:"meditation",label:"冥想空间",subtitle:"Meditation Space",icon:s.jsx(sN,{})},{id:"board",label:"留言板",subtitle:"Message Board",icon:s.jsx(oN,{})}],lN=()=>s.jsxs("div",{className:"hl-welcome",children:[s.jsx("div",{className:"hl-welcome-icon",children:"🌿"}),s.jsx("h3",{className:"hl-welcome-title",children:"欢迎来到疗愈室"}),s.jsx("p",{className:"hl-welcome-sub",children:"哦~土豆，选一个工具，开始今天的疗愈吧。"}),s.jsxs("div",{className:"hl-welcome-hint",children:[s.jsx("span",{children:"左侧任选一项"}),s.jsx("span",{className:"hl-welcome-arrow",children:"→"})]})]}),cN=()=>{const[a,i]=j.useState("welcome"),[o,l]=j.useState(!1),c=()=>{switch(a){case"journal":return s.jsx(Xk,{});case"breathing":return s.jsx(Zk,{});case"meditation":return s.jsx(eN,{});case"board":return s.jsx(nN,{});default:return s.jsx(lN,{})}},f=p=>{i(p),l(!1)};return s.jsxs("div",{className:"hr-root",children:[s.jsx("div",{className:"hr-bg"}),s.jsx("div",{className:"hr-leaf hr-leaf-1"}),s.jsx("div",{className:"hr-leaf hr-leaf-2"}),s.jsx("div",{className:"hr-leaf hr-leaf-3"}),s.jsxs("aside",{className:"hl-sidebar",children:[s.jsx(rt,{to:"/",className:"hl-back",children:"← 回到主站"}),s.jsx("div",{className:"hl-sidebar-title",children:"疗愈室"}),s.jsx("nav",{className:"hl-nav",children:ay.map(p=>s.jsxs("button",{className:`hl-nav-item ${a===p.id?"hl-nav-active":""}`,onClick:()=>f(p.id),children:[a===p.id&&s.jsx(X.span,{className:"hl-nav-bar",layoutId:"hl-nav-bar",transition:{duration:.3,ease:"easeOut"}}),s.jsx("span",{className:"hl-nav-icon",children:p.icon}),s.jsxs("span",{className:"hl-nav-text",children:[s.jsx("span",{className:"hl-nav-label",children:p.label}),s.jsx("span",{className:"hl-nav-sub",children:p.subtitle})]})]},p.id))}),s.jsx("p",{className:"hl-sidebar-quote",children:"「平静是内心的力量」"})]}),s.jsxs("div",{className:"hl-mobile-header",children:[s.jsx(rt,{to:"/",className:"hl-mobile-back",children:"← 主站"}),s.jsx("span",{className:"hl-mobile-title",children:"疗愈室"}),s.jsx("button",{className:"hl-mobile-menu-btn",onClick:()=>l(!o),children:o?"×":"☰"})]}),s.jsx(Ne,{children:o&&s.jsx(X.div,{className:"hl-mobile-nav",initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.25},children:ay.map(p=>s.jsxs("button",{className:`hl-mobile-nav-item ${a===p.id?"hl-mobile-nav-active":""}`,onClick:()=>f(p.id),children:[s.jsx("span",{className:"hl-nav-icon",children:p.icon}),p.label]},p.id))})}),s.jsx("main",{className:"hl-main",children:s.jsx("div",{className:"hl-card-wrap",children:s.jsx(Ne,{mode:"wait",children:s.jsx(X.div,{className:"hl-card",initial:{opacity:0,y:12},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.35,ease:"easeOut"},children:c()},a)})})}),s.jsx("style",{children:`
        /* ===== 根容器 ===== */
        .hr-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          overflow: hidden;
        }

        /* ===== 森林背景 ===== */
        .hr-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-image: url('/healing-forest.jpg');
          background-size: cover;
          background-position: center;
          filter: brightness(0.88) saturate(0.9);
        }

        /* ===== 渐变暗角 ===== */
        .hr-root::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0.15) 0%,
            rgba(0,0,0,0.08) 30%,
            rgba(0,0,0,0.25) 70%,
            rgba(0,0,0,0.4) 100%
          );
          pointer-events: none;
        }

        /* ===== 微风树叶动效 ===== */
        @keyframes hrSway1 {
          0%, 100% { transform: scale(1.04) rotate(-1.2deg); }
          50% { transform: scale(1.06) rotate(1.2deg) translateY(-3px); }
        }
        @keyframes hrSway2 {
          0%, 100% { transform: scale(1.02) rotate(0.8deg); }
          50% { transform: scale(1.04) rotate(-1.5deg) translateY(-4px); }
        }
        @keyframes hrSway3 {
          0%, 100% { transform: scale(1.03) rotate(-0.6deg); }
          50% { transform: scale(1.05) rotate(1deg) translateX(2px) translateY(-2px); }
        }

        .hr-leaf {
          position: fixed;
          z-index: 1;
          pointer-events: none;
          background-image: url('/healing-forest.jpg');
          background-size: cover;
          background-repeat: no-repeat;
          filter: brightness(0.65) saturate(0.8);
        }
        .hr-leaf-1 {
          top: -5%; right: -5%;
          width: 55%; height: 55%;
          background-position: right top;
          opacity: 0.45;
          transform-origin: 80% 20%;
          animation: hrSway1 5.5s ease-in-out infinite;
        }
        .hr-leaf-2 {
          bottom: -8%; left: -6%;
          width: 50%; height: 50%;
          background-position: left bottom;
          background-size: 120% 120%;
          opacity: 0.35;
          transform-origin: 20% 80%;
          animation: hrSway2 6.8s ease-in-out infinite;
          animation-delay: -2s;
        }
        .hr-leaf-3 {
          top: -10%; left: 30%;
          width: 45%; height: 45%;
          background-position: center top;
          opacity: 0.28;
          transform-origin: 50% 100%;
          animation: hrSway3 4.8s ease-in-out infinite;
          animation-delay: -1.2s;
        }

        /* ===== 左侧导航栏 ===== */
        .hl-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 10;
          width: 220px;
          display: flex;
          flex-direction: column;
          padding: 28px 16px 24px;
          background: rgba(10, 20, 10, 0.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* 回到主站 */
        .hl-back {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          margin-bottom: 24px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: all 0.25s ease;
          width: fit-content;
        }
        .hl-back:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          transform: translateX(-2px);
        }

        /* 标题 */
        .hl-sidebar-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 20px;
          padding-left: 12px;
          letter-spacing: 0.08em;
        }

        /* 导航列表 */
        .hl-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .hl-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 12px 12px 16px;
          border: none;
          border-radius: 10px;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.25s ease, color 0.25s ease;
          color: rgba(255, 255, 255, 0.65);
          overflow: hidden;
        }
        .hl-nav-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.9);
        }
        .hl-nav-active {
          background: rgba(122, 154, 130, 0.2) !important;
          color: rgba(200, 230, 200, 0.95) !important;
        }
        .hl-nav-active:hover {
          background: rgba(122, 154, 130, 0.25) !important;
        }

        /* 左侧竖线指示器 */
        .hl-nav-bar {
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 3px;
          background: rgba(160, 200, 160, 0.8);
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 8px rgba(160, 200, 160, 0.5);
        }

        .hl-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          opacity: 0.75;
        }
        .hl-nav-active .hl-nav-icon { opacity: 1; }

        .hl-nav-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .hl-nav-label {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.3;
        }
        .hl-nav-sub {
          font-size: 9px;
          opacity: 0.55;
          letter-spacing: 0.04em;
        }

        /* 底部语 */
        .hl-sidebar-quote {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.35);
          text-align: center;
          margin-top: 16px;
          letter-spacing: 0.06em;
        }

        /* ===== 右侧主内容区 ===== */
        .hl-main {
          position: relative;
          z-index: 5;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px 48px;
          margin-left: 220px;
          min-height: 100vh;
        }

        .hl-card-wrap {
          width: 100%;
          max-width: 700px;
        }

        .hl-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 36px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18);
          color: rgba(255, 255, 255, 0.92);
        }

        /* ===== 欢迎卡片 ===== */
        .hl-welcome {
          text-align: center;
          padding: 24px 16px;
        }
        .hl-welcome-icon {
          font-size: 56px;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }
        .hl-welcome-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 24px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.92);
          margin: 0 0 14px;
        }
        .hl-welcome-sub {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.65);
          margin: 0 0 24px;
          line-height: 1.7;
        }
        .hl-welcome-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.06em;
        }
        .hl-welcome-arrow {
          animation: hrArrowBounce 1.5s ease-in-out infinite;
        }
        @keyframes hrArrowBounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }

        /* ===== 移动端顶部栏 ===== */
        .hl-mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 20;
          height: 56px;
          padding: 0 16px;
          background: rgba(10, 20, 10, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          align-items: center;
          justify-content: space-between;
        }
        .hl-mobile-back {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          padding: 6px 0;
        }
        .hl-mobile-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
        }
        .hl-mobile-menu-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          color: rgba(255,255,255,0.8);
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ===== 移动端下拉导航 ===== */
        .hl-mobile-nav {
          display: none;
          position: fixed;
          top: 56px;
          left: 0;
          right: 0;
          z-index: 19;
          background: rgba(10, 20, 10, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 8px 16px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          flex-wrap: wrap;
          gap: 6px;
        }
        .hl-mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hl-mobile-nav-active {
          background: rgba(122, 154, 130, 0.25);
          border-color: rgba(160, 200, 160, 0.4);
          color: rgba(200, 230, 200, 0.95);
        }

        /* ===== 响应式 ===== */
        @media (max-width: 768px) {
          .hl-sidebar { display: none; }
          .hl-mobile-header { display: flex; }
          .hl-mobile-nav { display: flex; }
          .hl-main {
            margin-left: 0;
            padding: 72px 16px 32px;
            align-items: flex-start;
          }
          .hl-card-wrap { max-width: 100%; }
          .hl-card { padding: 24px 20px; border-radius: 16px; }
          .hr-leaf { display: none; }
        }
      `})]})},Rd=[{id:1,title:"《随机波动》",type:"播客",desc:"三位女性主义者的思想碰撞，关于时代、技术与身体。",cover:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",accent:"#c4856a"},{id:2,title:"《无人知晓》",type:"播客",desc:"在不确定的时代，和那些勇敢的人聊聊「不知道」。",cover:"https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=200&h=200&fit=crop",accent:"#7a9a82"},{id:3,title:"《Before Sunset》",type:"音乐",desc:"日落前的吉他呢喃，适合一个人散步时听。",cover:"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",accent:"#a8814a"},{id:4,title:"《文化有限》",type:"播客",desc:"三本书三个观点，读书从未如此轻盈。",cover:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop",accent:"#8a7a9a"},{id:5,title:"《River Flows in You》",type:"音乐",desc:"Yiruma 的钢琴，像溪水流过鹅卵石。",cover:"https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=200&h=200&fit=crop",accent:"#5f76a0"}];let Dd=null,bl=[];const uN=()=>{try{if(!Dd){const c=window.AudioContext||window.webkitAudioContext;Dd=new c}const a=Dd;a.state==="suspended"&&a.resume();const i=a.currentTime,o=[523.25,587.33,659.25,783.99,880,783.99,659.25,587.33],l=.6;o.forEach((c,f)=>{const p=a.createOscillator(),m=a.createGain();p.type="sine",p.frequency.value=c;const h=i+f*l;m.gain.setValueAtTime(0,h),m.gain.linearRampToValueAtTime(.12,h+.08),m.gain.exponentialRampToValueAtTime(1e-4,h+l),p.connect(m),m.connect(a.destination),p.start(h),p.stop(h+l),bl.push({osc:p,gain:m})}),setTimeout(()=>{bl=[]},o.length*l*1e3+500)}catch{}},ny=()=>{bl.forEach(({osc:a})=>{try{a.stop()}catch{}}),bl=[]},dN=()=>s.jsxs("svg",{viewBox:"0 0 24 24",width:"20",height:"20",fill:"none","aria-hidden":"true",children:[s.jsx("path",{d:"M9 17V5l8-2v12",stroke:"#b08d57",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),s.jsx("circle",{cx:"7",cy:"17",r:"2.5",fill:"#b08d57"}),s.jsx("circle",{cx:"15",cy:"15",r:"2.5",fill:"#b08d57"})]}),fN=()=>{const[a]=wl(),o=a.get("from")==="full"?"/life?from=full":"/mickey",[l,c]=j.useState(!1),[f,p]=j.useState(!1),[m,h]=j.useState(!1),[g,b]=j.useState(null),[y,x]=j.useState(null),w=j.useCallback(()=>{f?(ny(),p(!1),c(!1)):(uN(),p(!0),c(!0))},[f]),S=j.useCallback(()=>{const N=Rd[Math.floor(Math.random()*Rd.length)];x(N),h(!0)},[]);return j.useEffect(()=>()=>ny(),[]),s.jsxs("div",{className:"mp-page",children:[s.jsx("style",{children:'.mp-page, .mp-page * { cursor: auto; } .mp-page button, .mp-page a, .mp-page [role="button"] { cursor: pointer; }'}),s.jsxs("header",{className:"mp-topbar",children:[s.jsx(rt,{to:o,className:"mp-back",children:"← 回到妙妙工具箱"}),s.jsx("span",{className:"mp-topbar-meta",children:"Withered Wood Sings"})]}),s.jsxs("section",{className:"mp-hero",children:[s.jsx("div",{className:"mp-notes",children:[0,1,2,3,4].map(N=>s.jsx(X.div,{className:"mp-note",style:{left:`${20+N*15}%`,top:`${10+N%3*20}%`},animate:g===N?{y:[0,-8,0],rotate:[0,10,-10,0]}:{y:[0,-6,0],opacity:[.3,.7,.3]},transition:{duration:g===N?.4:3+N*.5,repeat:1/0,ease:"easeInOut"},onMouseEnter:()=>b(N),onMouseLeave:()=>b(null),children:s.jsx(dN,{})},N))}),s.jsxs(X.div,{className:"mp-vinyl-wrap",initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},transition:{duration:.8,ease:"easeOut"},children:[s.jsxs("button",{className:`mp-vinyl ${l?"mp-vinyl-spinning":""}`,onClick:w,"aria-label":f?"停止音乐":"播放音乐",children:[s.jsx("span",{className:"mp-vinyl-grooves"}),s.jsx("span",{className:"mp-vinyl-grooves mp-vinyl-grooves-2"}),s.jsx("span",{className:"mp-vinyl-label",children:s.jsx("span",{className:"mp-vinyl-label-text",children:"枯木生歌"})}),s.jsx("span",{className:"mp-vinyl-hole"})]}),s.jsx(X.div,{className:"mp-sprout",initial:{scaleY:0,opacity:0},animate:{scaleY:l?1:.3,opacity:l?1:.4},transition:{duration:1,ease:"easeOut"},children:s.jsxs("svg",{viewBox:"0 0 40 80",width:"32",height:"64",fill:"none",children:[s.jsx("path",{d:"M20 80 Q22 50 20 30 Q18 20 20 10",stroke:"#7a9a6a",strokeWidth:"2",strokeLinecap:"round"}),s.jsx("path",{d:"M20 40 Q10 35 6 28 Q12 32 20 40",fill:"#8aaa7a"}),s.jsx("path",{d:"M20 28 Q30 23 34 16 Q28 20 20 28",fill:"#9aba8a"}),s.jsx("ellipse",{cx:"20",cy:"8",rx:"4",ry:"6",fill:"#a8ca8a"})]})})]}),s.jsx(X.h1,{className:"mp-title",initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.7,delay:.3},children:"枯木生歌"}),s.jsx(X.p,{className:"mp-tagline",initial:{opacity:0},animate:{opacity:1},transition:{delay:.6,duration:.6},children:"大地的诗歌从未消亡。"}),s.jsx(X.p,{className:"mp-hint",initial:{opacity:0},animate:{opacity:.6},transition:{delay:1,duration:.6},children:f?"♪ 正在播放 · 再次点击停止":"点击黑胶 · 听枯木唱歌"})]}),s.jsxs("section",{className:"mp-tracks",children:[s.jsx(X.h2,{className:"mp-section-title",initial:{opacity:0,y:16},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.5},children:"收藏夹"}),s.jsx("div",{className:"mp-track-grid",children:Rd.map((N,C)=>s.jsxs(X.article,{className:"mp-card",initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,margin:"-40px"},transition:{duration:.5,delay:C%3*.08},whileHover:{y:-6},style:{"--card-accent":N.accent},children:[s.jsxs("div",{className:"mp-card-cover-wrap",children:[s.jsx("img",{src:N.cover,alt:N.title,className:"mp-card-cover",loading:"lazy"}),s.jsx("span",{className:"mp-card-type",children:N.type})]}),s.jsxs("div",{className:"mp-card-body",children:[s.jsx("h3",{className:"mp-card-title",children:N.title}),s.jsx("p",{className:"mp-card-desc",children:N.desc})]}),s.jsx("span",{className:"mp-card-accent-bar"})]},N.id))})]}),s.jsx("button",{className:"mp-surprise-btn",onClick:S,children:"🎲 播放今日推荐"}),s.jsx(Ne,{children:m&&y&&s.jsx(X.div,{className:"mp-surprise-modal",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>h(!1),children:s.jsxs(X.div,{className:"mp-surprise-card",initial:{scale:.8,y:30},animate:{scale:1,y:0},exit:{scale:.8,y:30},transition:{type:"spring",stiffness:300,damping:25},onClick:N=>N.stopPropagation(),children:[s.jsx("p",{className:"mp-surprise-label",children:"今日推荐"}),s.jsx("img",{src:y.cover,alt:y.title,className:"mp-surprise-cover"}),s.jsx("h3",{className:"mp-surprise-title",children:y.title}),s.jsx("p",{className:"mp-surprise-desc",children:y.desc}),s.jsx("button",{className:"mp-surprise-play",onClick:()=>{f||w(),h(!1)},children:"♪ 播放"})]})})}),s.jsxs("footer",{className:"mp-foot",children:[s.jsx("span",{children:"这不是播放器，是收藏夹"}),s.jsx("span",{className:"mp-foot-dot",children:"·"}),s.jsx("span",{children:"一个人的精神角落"})]}),s.jsx("style",{children:`
        /* ===== 基础 ===== */
        .mp-page {
          position: relative;
          min-height: 100vh;
          background: #FFF8F5;
          color: #3a3a3a;
          font-family: "Noto Sans SC", system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
        }

        /* ===== 顶部返回条 ===== */
        .mp-topbar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 28px;
          background: rgba(255, 248, 245, 0.8);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .mp-back {
          font-size: 13px; color: #888; text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.25s ease;
        }
        .mp-back:hover { color: #b08d57; }
        .mp-topbar-meta {
          font-size: 10px; color: #bbb; letter-spacing: 0.28em; text-transform: uppercase;
        }

        /* ===== 主视觉 ===== */
        .mp-hero {
          position: relative;
          text-align: center;
          padding: 60px 20px 50px;
          overflow: hidden;
        }

        /* 飘动音符 */
        .mp-notes {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
        }
        .mp-note {
          position: absolute; pointer-events: auto;
          opacity: 0.4;
        }

        /* 黑胶唱片 */
        .mp-vinyl-wrap {
          position: relative;
          display: inline-flex; flex-direction: column; align-items: center;
          margin-bottom: 24px; z-index: 1;
        }
        .mp-vinyl {
          position: relative;
          width: 180px; height: 180px; border-radius: 50%;
          border: none; padding: 0;
          background: radial-gradient(circle at 50% 50%, #2a2a2a 0%, #1a1a1a 30%, #0d0d0d 100%);
          box-shadow: 0 12px 36px -8px rgba(0,0,0,0.3),
                      0 0 0 1px rgba(0,0,0,0.1),
                      inset 0 0 20px rgba(0,0,0,0.4);
          transition: transform 0.3s ease;
        }
        .mp-vinyl:hover { transform: scale(1.03); }
        .mp-vinyl-spinning {
          animation: mp-vinyl-rotate 6s linear infinite;
        }
        @keyframes mp-vinyl-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* 唱片纹路 */
        .mp-vinyl-grooves {
          position: absolute; inset: 10px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .mp-vinyl-grooves-2 {
          inset: 20px;
          border: 1px solid rgba(255,255,255,0.03);
        }

        /* 中心标签 */
        .mp-vinyl-label {
          position: absolute;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 70px; height: 70px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #c4856a, #a06550);
          display: flex; align-items: center; justify-content: center;
          box-shadow: inset 0 0 8px rgba(0,0,0,0.2);
        }
        .mp-vinyl-label-text {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 10px; color: #fff8f0;
          letter-spacing: 0.1em; opacity: 0.9;
        }

        /* 中心孔 */
        .mp-vinyl-hole {
          position: absolute;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 8px; height: 8px; border-radius: 50%;
          background: #FFF8F5;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.2);
        }

        /* 嫩芽 */
        .mp-sprout {
          position: absolute;
          top: -30px; left: 50%; transform: translateX(-50%);
          transform-origin: bottom center;
          z-index: 2;
          pointer-events: none;
        }

        /* 标题 */
        .mp-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: clamp(32px, 5vw, 44px); font-weight: 700;
          color: #4a3a30; margin: 0 0 12px; letter-spacing: 0.12em;
          position: relative; z-index: 1;
        }
        .mp-tagline {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 15px; color: #8a7a6a; margin: 0 0 10px;
          letter-spacing: 0.06em; position: relative; z-index: 1;
        }
        .mp-hint {
          font-size: 12px; color: #b09a8a; margin: 0;
          letter-spacing: 0.04em; position: relative; z-index: 1;
        }

        /* ===== 收藏夹卡片 ===== */
        .mp-tracks {
          max-width: 960px; margin: 0 auto;
          padding: 20px 24px 60px;
        }
        .mp-section-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 22px; font-weight: 600; color: #5a4a3a;
          text-align: center; margin: 0 0 32px;
          letter-spacing: 0.1em;
        }
        .mp-track-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .mp-card {
          position: relative;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 4px 16px -6px rgba(0,0,0,0.08);
          transition: box-shadow 0.3s ease;
        }
        .mp-card:hover {
          box-shadow: 0 8px 28px -8px rgba(0,0,0,0.12);
        }
        .mp-card-cover-wrap {
          position: relative; width: 100%; aspect-ratio: 16/10;
          overflow: hidden; background: #f0ebe5;
        }
        .mp-card-cover {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.5s ease;
        }
        .mp-card:hover .mp-card-cover { transform: scale(1.05); }
        .mp-card-type {
          position: absolute; top: 10px; left: 10px;
          padding: 3px 10px; font-size: 10px; border-radius: 999px;
          background: rgba(255,255,255,0.9); color: var(--card-accent, #888);
          backdrop-filter: blur(4px); letter-spacing: 0.06em;
        }
        .mp-card-body { padding: 16px 18px 20px; }
        .mp-card-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 16px; font-weight: 600; color: #4a3a30;
          margin: 0 0 8px; letter-spacing: 0.02em;
        }
        .mp-card-desc {
          font-size: 12px; line-height: 1.7; color: #8a7a6a; margin: 0;
        }
        .mp-card-accent-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: var(--card-accent, #b08d57);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s ease;
        }
        .mp-card:hover .mp-card-accent-bar { transform: scaleX(1); }

        /* ===== 彩蛋按钮 ===== */
        .mp-surprise-btn {
          position: fixed; bottom: 24px; right: 24px; z-index: 40;
          padding: 10px 20px; font-size: 13px;
          font-family: "Noto Sans SC", sans-serif;
          color: #fff; background: #4a3a30; border: none; border-radius: 999px;
          cursor: pointer; letter-spacing: 0.04em;
          box-shadow: 0 6px 20px -4px rgba(74,58,48,0.4);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .mp-surprise-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px -4px rgba(74,58,48,0.5);
        }

        /* ===== 推荐弹窗 ===== */
        .mp-surprise-modal {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          padding: 20px;
        }
        .mp-surprise-card {
          background: #fff; border-radius: 20px; padding: 28px;
          max-width: 320px; text-align: center;
          box-shadow: 0 20px 60px -10px rgba(0,0,0,0.3);
        }
        .mp-surprise-label {
          font-size: 11px; color: #b08d57; letter-spacing: 0.2em;
          text-transform: uppercase; margin: 0 0 16px;
        }
        .mp-surprise-cover {
          width: 120px; height: 120px; border-radius: 50%; object-fit: cover;
          margin: 0 auto 16px; display: block;
          box-shadow: 0 8px 24px -6px rgba(0,0,0,0.2);
        }
        .mp-surprise-title {
          font-family: "Noto Serif SC", Georgia, serif;
          font-size: 18px; font-weight: 600; color: #4a3a30;
          margin: 0 0 8px;
        }
        .mp-surprise-desc {
          font-size: 12px; color: #8a7a6a; line-height: 1.6; margin: 0 0 20px;
        }
        .mp-surprise-play {
          padding: 10px 28px; font-size: 13px;
          color: #fff; background: #4a3a30; border: none; border-radius: 999px;
          cursor: pointer; letter-spacing: 0.06em;
          transition: transform 0.2s ease;
        }
        .mp-surprise-play:hover { transform: scale(1.05); }

        /* ===== 页脚 ===== */
        .mp-foot {
          text-align: center; padding: 24px;
          font-size: 11px; color: #b0a090; letter-spacing: 0.08em;
        }
        .mp-foot-dot { margin: 0 8px; opacity: 0.5; }

        /* ===== 移动端 ===== */
        @media (max-width: 768px) {
          .mp-vinyl { width: 140px; height: 140px; }
          .mp-vinyl-label { width: 54px; height: 54px; }
          .mp-vinyl-label-text { font-size: 8px; }
          .mp-track-grid { grid-template-columns: 1fr; }
          .mp-surprise-btn { bottom: 16px; right: 16px; padding: 8px 16px; font-size: 12px; }
        }
      `})]})},pN=()=>s.jsxs("svg",{viewBox:"0 0 48 48",width:"34",height:"34","aria-hidden":"true",children:[s.jsx("path",{d:"M24 41C24 41 5 29 5 17C5 11 10 6 16.5 6C20 6 22.5 8 24 10.5C25.5 8 28 6 31.5 6C38 6 43 11 43 17C43 29 24 41 24 41Z",fill:"#e05563"}),s.jsx("path",{d:"M16.5 7.5C12.5 7.5 9 10.8 9 14.8",stroke:"#fff",strokeWidth:"1",strokeOpacity:"0.3",strokeLinecap:"round",fill:"none"}),s.jsx("line",{x1:"24",y1:"8.5",x2:"24",y2:"34",stroke:"#9c3340",strokeWidth:"0.9",strokeOpacity:"0.55"}),s.jsxs("g",{stroke:"#ffd86b",strokeWidth:"1.7",strokeLinecap:"round",filter:"url(#mending-glow)",children:[s.jsx("line",{x1:"20",y1:"11",x2:"28",y2:"11"}),s.jsx("line",{x1:"19",y1:"16",x2:"29",y2:"16"}),s.jsx("line",{x1:"20",y1:"21",x2:"28",y2:"21"}),s.jsx("line",{x1:"19",y1:"26",x2:"29",y2:"26"}),s.jsx("line",{x1:"20",y1:"31",x2:"28",y2:"31"})]}),s.jsxs("g",{fill:"#ffe6a0",children:[s.jsx("circle",{cx:"20",cy:"11",r:"0.9"}),s.jsx("circle",{cx:"28",cy:"11",r:"0.9"}),s.jsx("circle",{cx:"19",cy:"16",r:"0.9"}),s.jsx("circle",{cx:"29",cy:"16",r:"0.9"}),s.jsx("circle",{cx:"20",cy:"21",r:"0.9"}),s.jsx("circle",{cx:"28",cy:"21",r:"0.9"}),s.jsx("circle",{cx:"19",cy:"26",r:"0.9"}),s.jsx("circle",{cx:"29",cy:"26",r:"0.9"}),s.jsx("circle",{cx:"20",cy:"31",r:"0.9"}),s.jsx("circle",{cx:"28",cy:"31",r:"0.9"})]}),s.jsx("defs",{children:s.jsxs("filter",{id:"mending-glow",x:"-20%",y:"-20%",width:"140%",height:"140%",children:[s.jsx("feGaussianBlur",{stdDeviation:"0.7",result:"b"}),s.jsxs("feMerge",{children:[s.jsx("feMergeNode",{in:"b"}),s.jsx("feMergeNode",{in:"SourceGraphic"})]})]})})]}),hN=[{name:"森林疗愈室",slogan:"调节呼吸与情绪",icon:"🌲",url:"/healing",glow:!0,hoverHint:"深呼吸"},{name:"系统调频",slogan:"校准频率，让信号重新清晰。",icon:"📻",url:"/toolbox/answer",glow:!0,hoverHint:"调一下频"},{name:"通关清单",slogan:"把人生变成一场 RPG。",icon:"🎯",url:"/toolbox/quests",glow:!0,hoverHint:"命中目标！"},{name:"物资管家",slogan:"库存与保质期管理",icon:"🏠",url:"/toolbox/supplies",glow:!0,hoverHint:"清点一下"},{name:"解忧杂货铺",slogan:"总有一句话，能解开你的心结。",icon:"🕯️",url:"/toolbox/advice",glow:!0,hoverHint:"进来坐坐？"},{name:"漫游指南",slogan:"走过的路，看过的云。",icon:"🗺️",url:"/toolbox/travel",glow:!0,hoverHint:"出发吧"},{name:"回血清单",slogan:"允许一切崩塌，只做一件极小的事。",icon:"🔋",url:"/toolbox/recharge",glow:!0,hoverHint:"充一会儿电"},{name:"解压馆",slogan:"允许一切崩塌。",icon:s.jsx(pN,{}),url:"/toolbox/games",glow:!0,hoverHint:"捏碎它"},{name:"时光博物馆",slogan:"每一步都算数。",icon:"🏆",url:"/toolbox/memories",glow:!0,hoverHint:"珍贵藏品"}];let Od=null;const mN=()=>{try{if(!Od){const o=window.AudioContext||window.webkitAudioContext;Od=new o}const a=Od,i=a.currentTime;[880,1320].forEach((o,l)=>{const c=a.createOscillator(),f=a.createGain();c.type="sine",c.frequency.value=o,f.gain.setValueAtTime(l===0?.25:.12,i),f.gain.exponentialRampToValueAtTime(1e-4,i+.4),c.connect(f),f.connect(a.destination),c.start(i),c.stop(i+.4)})}catch{}},gN=({tool:a,index:i})=>{const[o,l]=j.useState(!1),[c,f]=j.useState(!1),p=j.useRef(null),m=()=>{o||(mN(),l(!0),p.current=window.setTimeout(()=>{window.open(a.url,"_blank","noopener,noreferrer")},300),window.setTimeout(()=>l(!1),750))};return s.jsxs(X.div,{className:"mickey-tool-wrap",initial:{opacity:0,y:24,scale:.9},whileInView:{opacity:1,y:0,scale:1},viewport:{once:!0,margin:"-30px"},transition:{duration:.45,delay:i%2*.07+Math.floor(i/2)*.05,ease:"easeOut"},children:[s.jsxs(X.button,{type:"button",className:a.glow?"mickey-btn mickey-btn-glow":"mickey-btn",onClick:m,whileHover:{y:-8,scale:a.glow?1.05:1},animate:o?{scale:1.5}:{scale:1},transition:{duration:o?.25:.4,ease:"easeOut"},"aria-label":`打开 ${a.name}`,onMouseEnter:()=>f(!0),onMouseLeave:()=>f(!1),children:[s.jsx("span",{className:"mickey-silhouette","aria-hidden":"true"}),s.jsx(Ne,{children:o&&s.jsx(X.span,{className:"mickey-ripple",initial:{scale:.8,opacity:.85},animate:{scale:2.6,opacity:0},exit:{opacity:0},transition:{duration:.7,ease:"easeOut"}})}),s.jsx("span",{className:"mickey-icon",children:a.icon})]}),s.jsx(Ne,{children:a.hoverHint&&c&&s.jsx(X.span,{className:"mickey-hover-hint",initial:{opacity:0,y:6},animate:{opacity:1,y:0},exit:{opacity:0,y:6},transition:{duration:.25},children:a.hoverHint})}),s.jsxs("div",{className:"mickey-tool-text",children:[s.jsx("p",{className:"mickey-tool-name",children:a.name}),s.jsx("p",{className:"mickey-tool-slogan",children:a.slogan})]})]})},xN=()=>{const a=j.useMemo(()=>Array.from({length:70},()=>({top:Math.random()*100,left:Math.random()*100,size:Math.random()*2+1,delay:Math.random()*4,duration:Math.random()*2.5+1.8})),[]);return s.jsxs("div",{className:"mickey-page",children:[s.jsx("div",{className:"mickey-stars","aria-hidden":"true",children:a.map((i,o)=>s.jsx("span",{className:"mickey-star",style:{top:`${i.top}%`,left:`${i.left}%`,width:`${i.size}px`,height:`${i.size}px`,animationDelay:`${i.delay}s`,animationDuration:`${i.duration}s`}},o))}),s.jsx("div",{className:"mickey-moon","aria-hidden":"true"}),s.jsx(rt,{to:"/?mode=full",className:"mickey-exit","aria-label":"回到主站",children:"← 回到主站 ✨"}),s.jsxs("section",{className:"mickey-hero",children:[s.jsx(X.h1,{className:"mickey-title",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.6},children:"妙妙工具箱"}),s.jsx(X.p,{className:"mickey-subtitle",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{duration:.6,delay:.15},children:"哦~ 土豆！请选择你的工具。"})]}),s.jsx("section",{className:"mickey-grid",children:hN.map((i,o)=>s.jsx(gN,{tool:i,index:o},i.name))}),s.jsx("footer",{className:"mickey-foot",children:s.jsx("span",{children:"叮 ~ 魔法已就绪"})}),s.jsx("style",{children:`
        .mickey-page, .mickey-page * { cursor: auto; }
        .mickey-page button, .mickey-page a, .mickey-page [role="button"] { cursor: pointer; }

        .mickey-page {
          position: relative; min-height: 100vh; overflow: hidden;
          color: #f5f7ff;
          background: radial-gradient(120% 80% at 50% -10%, #1a2550 0%, #0a1024 45%, #050816 100%);
          font-family: "Noto Sans SC", system-ui, -apple-system, sans-serif;
          padding: 0 24px 80px;
        }

        /* 星辰 */
        .mickey-stars { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .mickey-star {
          position: absolute; border-radius: 50%; background: #fff;
          opacity: 0.7; animation: mickey-twinkle linear infinite;
        }
        @keyframes mickey-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }

        /* 月亮 */
        .mickey-moon {
          position: absolute; top: 8%; right: 8%; z-index: 0;
          width: 90px; height: 90px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fffdf0, #f4e8b8 60%, #d9c789 100%);
          box-shadow: 0 0 50px rgba(244, 232, 184, 0.35), 0 0 100px rgba(244, 232, 184, 0.15);
          opacity: 0.85;
        }

        /* 退出按钮 —— 魔法道具胶囊 */
        .mickey-exit {
          position: fixed; top: 20px; left: 20px; z-index: 50;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 22px; border-radius: 999px;
          font-size: 13px; color: #ffffff; text-decoration: none;
          letter-spacing: 0.05em; font-weight: 500;
          background: rgba(20, 16, 40, 0.55);
          -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 216, 107, 0.35);
          box-shadow: 0 4px 18px -6px rgba(0, 0, 0, 0.5), 0 0 14px rgba(255, 216, 107, 0.15);
          transition: background 0.28s ease, color 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, transform 0.28s ease;
        }
        .mickey-exit:hover {
          background: rgba(60, 44, 20, 0.65);
          color: #fff;
          border-color: rgba(255, 216, 107, 0.7);
          box-shadow: 0 6px 22px -6px rgba(255, 168, 76, 0.4), 0 0 24px rgba(255, 216, 107, 0.3);
          transform: translateX(-2px);
        }

        /* 标题区 */
        .mickey-hero {
          position: relative; z-index: 2;
          max-width: 640px; margin: 0 auto; padding: 56px 4px 44px; text-align: center;
        }
        .mickey-title {
          font-family: "Noto Sans SC", system-ui, sans-serif;
          font-size: clamp(34px, 5.5vw, 52px); font-weight: 700;
          color: #fff; margin: 0 0 14px; letter-spacing: 0.08em;
          text-shadow: 0 0 24px rgba(255, 216, 107, 0.35);
        }
        .mickey-subtitle {
          font-size: 16px; color: #d0daf5; margin: 0; letter-spacing: 0.06em;
        }

        /* 工具网格 — 4-4-1 布局，每排4个，第9个落在第一列（解忧杂货铺正下方） */
        .mickey-grid {
          position: relative; z-index: 2;
          max-width: 820px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 36px 20px;
          padding: 8px 4px 0;
        }
        /* 时光博物馆：位于解忧杂货铺正下方（第三行第一列） */
        .mickey-tool-wrap:last-child {
          grid-column: 1;
        }
        @media (min-width: 768px) {
          .mickey-grid { max-width: 880px; gap: 44px 32px; }
        }

        .mickey-tool-wrap { display: flex; flex-direction: column; align-items: center; }

        /* 圆形按钮 */
        .mickey-btn {
          position: relative;
          width: 96px; height: 96px; border-radius: 50%;
          border: none; padding: 0;
          background: rgba(8, 12, 28, 0.55);
          box-shadow: 0 8px 24px -8px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255, 216, 107, 0.18);
          display: flex; align-items: center; justify-content: center;
          overflow: visible; isolation: isolate;
          transition: box-shadow 0.3s ease;
        }
        .mickey-btn:hover {
          box-shadow: 0 14px 30px -8px rgba(255, 216, 107, 0.35), inset 0 0 0 1px rgba(255, 216, 107, 0.4);
        }

        /* 暖光工具：暖橙光晕 */
        .mickey-btn-glow {
          background: rgba(40, 24, 8, 0.55);
          box-shadow: 0 8px 24px -6px rgba(255, 168, 76, 0.45), 0 0 22px rgba(255, 168, 76, 0.25), inset 0 0 0 1px rgba(255, 200, 120, 0.3);
          animation: mickey-glow-pulse 2.5s ease-in-out infinite;
        }
        @keyframes mickey-glow-pulse {
          0%, 100% { box-shadow: 0 8px 24px -6px rgba(255, 168, 76, 0.45), 0 0 22px rgba(255, 168, 76, 0.25), inset 0 0 0 1px rgba(255, 200, 120, 0.3); }
          50% { box-shadow: 0 8px 24px -6px rgba(255, 168, 76, 0.6), 0 0 34px rgba(255, 168, 76, 0.4), inset 0 0 0 1px rgba(255, 200, 120, 0.5); }
        }
        .mickey-btn-glow:hover {
          box-shadow: 0 14px 34px -6px rgba(255, 168, 76, 0.7), 0 0 44px rgba(255, 168, 76, 0.5), inset 0 0 0 1px rgba(255, 216, 107, 0.6);
        }

        .mickey-hover-hint {
          position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
          white-space: nowrap; font-size: 12px; color: #ffd49a;
          letter-spacing: 0.05em; pointer-events: none;
          text-shadow: 0 0 8px rgba(255, 168, 76, 0.5);
        }

        /* 米奇头剪影水印 */
        .mickey-silhouette {
          position: absolute; inset: 0; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='64' r='26' fill='%23000'/%3E%3Ccircle cx='28' cy='34' r='15' fill='%23000'/%3E%3Ccircle cx='72' cy='34' r='15' fill='%23000'/%3E%3C/svg%3E");
          background-size: 78% 78%; background-position: center 58%; background-repeat: no-repeat;
          opacity: 0.28; pointer-events: none;
        }

        .mickey-ripple {
          position: absolute; inset: 0; z-index: 1;
          border-radius: 50%; border: 2px solid #ffd86b; pointer-events: none;
        }

        .mickey-icon {
          position: relative; z-index: 2; font-size: 36px; line-height: 1;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
        }

        /* 文字 */
        .mickey-tool-text { margin-top: 14px; text-align: center; }
        .mickey-tool-name {
          font-size: 14px; font-weight: 600; color: #e8edff; margin: 0 0 3px;
          letter-spacing: 0.03em;
        }
        .mickey-tool-slogan {
          font-size: 12px; color: #b0bdd9; margin: 0; letter-spacing: 0.02em;
        }

        /* 页脚 */
        .mickey-foot {
          position: relative; z-index: 2;
          max-width: 640px; margin: 0 auto; padding: 56px 4px 0;
          text-align: center; font-size: 13px; color: #8a98c0; letter-spacing: 0.08em;
        }

        @media (max-width: 480px) {
          .mickey-btn { width: 80px; height: 80px; }
          .mickey-icon { font-size: 30px; }
          .mickey-moon { width: 64px; height: 64px; top: 5%; right: 5%; }
          .mickey-grid { grid-template-columns: repeat(3, 1fr); gap: 28px 14px; }
        }
      `})]})},yN=()=>{const{pathname:a}=ca();return j.useEffect(()=>{window.scrollTo(0,0)},[a]),null};n5.createRoot(document.getElementById("root")).render(s.jsx(j.StrictMode,{children:s.jsxs(E4,{children:[s.jsx(yN,{}),s.jsxs(n4,{children:[s.jsx(nt,{path:"/",element:s.jsx(Ux,{})}),s.jsx(nt,{path:"/forest",element:s.jsx(Ux,{})}),s.jsx(nt,{path:"/healing",element:s.jsx(cN,{})}),s.jsx(nt,{path:"/mickey",element:s.jsx(xN,{})}),s.jsx(nt,{path:"/film",element:s.jsx(Dk,{})}),s.jsx(nt,{path:"/music",element:s.jsx(fN,{})}),s.jsx(nt,{path:"/toolbox",element:s.jsx(a8,{})}),s.jsx(nt,{path:"/toolbox/inventory",element:s.jsx(qx,{})}),s.jsx(nt,{path:"/toolbox/supplies",element:s.jsx(qx,{})}),s.jsx(nt,{path:"/toolbox/advice",element:s.jsx(x8,{})}),s.jsx(nt,{path:"/toolbox/quests",element:s.jsx(E8,{})}),s.jsx(nt,{path:"/toolbox/memories",element:s.jsx(tk,{})}),s.jsx(nt,{path:"/toolbox/games",element:s.jsx(uk,{})}),s.jsx(nt,{path:"/toolbox/recharge",element:s.jsx(V8,{})}),s.jsx(nt,{path:"/toolbox/travel",element:s.jsx(pk,{})}),s.jsx(nt,{path:"/toolbox/answer",element:s.jsx(gk,{})}),s.jsx(nt,{path:"/toolbox/:title",element:s.jsx(n8,{})})]})]})}));
