"use strict";!function(){function t(e,o){function i(t,e){return function(){return t.apply(e,arguments)}}var r;if(o=o||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=o.touchBoundary||10,this.layer=e,this.tapDelay=o.tapDelay||200,this.tapTimeout=o.tapTimeout||700,!t.notNeeded(e)){for(var a=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],c=0,s=a.length;c<s;c++)this[a[c]]=i(this[a[c]],this);n&&(e.addEventListener("mouseover",this.onMouse,!0),e.addEventListener("mousedown",this.onMouse,!0),e.addEventListener("mouseup",this.onMouse,!0)),e.addEventListener("click",this.onClick,!0),e.addEventListener("touchstart",this.onTouchStart,!1),e.addEventListener("touchmove",this.onTouchMove,!1),e.addEventListener("touchend",this.onTouchEnd,!1),e.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(e.removeEventListener=function(t,n,o){var i=Node.prototype.removeEventListener;"click"===t?i.call(e,t,n.hijacked||n,o):i.call(e,t,n,o)},e.addEventListener=function(t,n,o){var i=Node.prototype.addEventListener;"click"===t?i.call(e,t,n.hijacked||(n.hijacked=function(t){t.propagationStopped||n(t)}),o):i.call(e,t,n,o)}),"function"==typeof e.onclick&&(r=e.onclick,e.addEventListener("click",function(t){r(t)},!1),e.onclick=null)}}var e=navigator.userAgent.indexOf("Windows Phone")>=0,n=navigator.userAgent.indexOf("Android")>0&&!e,o=/iP(ad|hone|od)/.test(navigator.userAgent)&&!e,i=o&&/OS 4_\d(_\d)?/.test(navigator.userAgent),r=o&&/OS [6-7]_\d/.test(navigator.userAgent),a=navigator.userAgent.indexOf("BB10")>0,c=!1;t.prototype.needsClick=function(t){for(var e=t;e&&"BODY"!==e.tagName.toUpperCase();){if("LABEL"===e.tagName.toUpperCase()&&(c=!0,/\bneedsclick\b/.test(e.className)))return!0;e=e.parentNode}switch(t.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(t.disabled)return!0;break;case"input":if(o&&"file"===t.type||t.disabled)return!0;break;case"label":case"iframe":case"video":return!0}return/\bneedsclick\b/.test(t.className)},t.prototype.needsFocus=function(t){switch(t.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!n;case"input":switch(t.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!t.disabled&&!t.readOnly;default:return/\bneedsfocus\b/.test(t.className)}},t.prototype.sendClick=function(t,e){var n,o;document.activeElement&&document.activeElement!==t&&document.activeElement.blur(),o=e.changedTouches[0],(n=document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(t),!0,!0,window,1,o.screenX,o.screenY,o.clientX,o.clientY,!1,!1,!1,!1,0,null),n.forwardedTouchEvent=!0,t.dispatchEvent(n)},t.prototype.determineEventType=function(t){return n&&"select"===t.tagName.toLowerCase()?"mousedown":"click"},t.prototype.focus=function(t){var e;o&&t.setSelectionRange&&-1===["date","time","month","number","email"].indexOf(t.type)?(e=t.value.length,t.setSelectionRange(e,e)):t.focus()},t.prototype.updateScrollParent=function(t){var e,n;if(!(e=t.fastClickScrollParent)||!e.contains(t)){n=t;do{if(n.scrollHeight>n.offsetHeight){e=n,t.fastClickScrollParent=n;break}n=n.parentElement}while(n)}e&&(e.fastClickLastScrollTop=e.scrollTop)},t.prototype.getTargetElementFromEventTarget=function(t){return t.nodeType===Node.TEXT_NODE?t.parentNode:t},t.prototype.onTouchStart=function(t){var e,n,r;if(t.targetTouches.length>1)return!0;if(e=this.getTargetElementFromEventTarget(t.target),n=t.targetTouches[0],o){if((r=window.getSelection()).rangeCount&&!r.isCollapsed)return!0;if(!i){if(n.identifier&&n.identifier===this.lastTouchIdentifier)return t.preventDefault(),!1;this.lastTouchIdentifier=n.identifier,this.updateScrollParent(e)}}return this.trackingClick=!0,this.trackingClickStart=t.timeStamp,this.targetElement=e,this.touchStartX=n.pageX,this.touchStartY=n.pageY,t.timeStamp-this.lastClickTime<this.tapDelay&&t.preventDefault(),!0},t.prototype.touchHasMoved=function(t){var e=t.changedTouches[0],n=this.touchBoundary;return Math.abs(e.pageX-this.touchStartX)>n||Math.abs(e.pageY-this.touchStartY)>n},t.prototype.onTouchMove=function(t){return!this.trackingClick||((this.targetElement!==this.getTargetElementFromEventTarget(t.target)||this.touchHasMoved(t))&&(this.trackingClick=!1,this.targetElement=null),!0)},t.prototype.findControl=function(t){return void 0!==t.control?t.control:t.htmlFor?document.getElementById(t.htmlFor):t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},t.prototype.onTouchEnd=function(t){var e,a,c,s,u,l=this.targetElement;if(!this.trackingClick)return!0;if(t.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(t.timeStamp-this.trackingClickStart>this.tapTimeout)return!0;if(-1!==["date","time","month"].indexOf(t.target.type))return!1;if(this.cancelNextClick=!1,this.lastClickTime=t.timeStamp,a=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,r&&(u=t.changedTouches[0],(l=document.elementFromPoint(u.pageX-window.pageXOffset,u.pageY-window.pageYOffset)||l).fastClickScrollParent=this.targetElement.fastClickScrollParent),"label"===(c=l.tagName.toLowerCase())){if(e=this.findControl(l)){if(this.focus(l),n)return!1;l=e}}else if(this.needsFocus(l))return t.timeStamp-a>100||o&&window.top!==window&&"input"===c?(this.targetElement=null,!1):(this.focus(l),this.sendClick(l,t),o&&"select"===c||(this.targetElement=null,t.preventDefault()),!1);return!(!o||i||!(s=l.fastClickScrollParent)||s.fastClickLastScrollTop===s.scrollTop)||(this.needsClick(l)||(t.preventDefault(),this.sendClick(l,t)),!1)},t.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},t.prototype.onMouse=function(t){return!this.targetElement||(!!t.forwardedTouchEvent||(!t.cancelable||(!(!this.needsClick(this.targetElement)||this.cancelNextClick)||(t.stopImmediatePropagation?t.stopImmediatePropagation():t.propagationStopped=!0,t.stopPropagation(),c||t.preventDefault(),!1))))},t.prototype.onClick=function(t){var e;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===t.target.type&&0===t.detail||((e=this.onMouse(t))||(this.targetElement=null),e)},t.prototype.destroy=function(){var t=this.layer;n&&(t.removeEventListener("mouseover",this.onMouse,!0),t.removeEventListener("mousedown",this.onMouse,!0),t.removeEventListener("mouseup",this.onMouse,!0)),t.removeEventListener("click",this.onClick,!0),t.removeEventListener("touchstart",this.onTouchStart,!1),t.removeEventListener("touchmove",this.onTouchMove,!1),t.removeEventListener("touchend",this.onTouchEnd,!1),t.removeEventListener("touchcancel",this.onTouchCancel,!1)},t.notNeeded=function(t){var e,o,i;if(void 0===window.ontouchstart)return!0;if(o=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!n)return!0;if(e=document.querySelector("meta[name=viewport]")){if(-1!==e.content.indexOf("user-scalable=no"))return!0;if(o>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(a&&(i=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1]>=10&&i[2]>=3&&(e=document.querySelector("meta[name=viewport]"))){if(-1!==e.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===t.style.msTouchAction||"manipulation"===t.style.touchAction||(!!(+(/Firefox\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]>=27&&(e=document.querySelector("meta[name=viewport]"))&&(-1!==e.content.indexOf("user-scalable=no")||document.documentElement.scrollWidth<=window.outerWidth))||"none"===t.style.touchAction||"manipulation"===t.style.touchAction)},t.attach=function(e,n){return new t(e,n)},window.FastClick=t}();
"use strict";!function(n){n.fn.animationEnd=function(n){function t(e){if(e.target===this)for(n.call(this,e),o=0;o<i.length;o++)r.off(i[o],t)}var o,i=["webkitAnimationEnd","animationEnd"],r=this;if(n)for(o=0;o<i.length;o++)r.on(i[o],t);return this},n.fn.transitionEnd=function(n){function t(e){if(e.target===this)for(n.call(this,e),o=0;o<i.length;o++)r.off(i[o],t)}var o,i=["webkitTransitionEnd","transitionend","oTransitionEnd","MSTransitionEnd","msTransitionEnd"],r=this;if(n)for(o=0;o<i.length;o++)r.on(i[o],t);return this},n.support={touch:!!("ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch)},n.touchEvents={start:n.support.touch?"touchstart":"mousedown",move:n.support.touch?"touchmove":"mousemove",end:n.support.touch?"touchend":"mouseup"},n.getTouchPosition=function(n){return"touchstart"===(n=n.originalEvent||n).type||"touchmove"===n.type||"touchend"===n.type?{x:n.targetTouches[0].pageX,y:n.targetTouches[0].pageY}:{x:n.pageX,y:n.pageY}},n.fn.scrollHeight=function(){return this[0].scrollHeight},n.fn.transform=function(n){for(var t=0;t<this.length;t++){var o=this[t].style;o.webkitTransform=o.MsTransform=o.msTransform=o.MozTransform=o.OTransform=o.transform=n}return this},n.fn.transition=function(n){"string"!=typeof n&&(n+="ms");for(var t=0;t<this.length;t++){var o=this[t].style;o.webkitTransitionDuration=o.MsTransitionDuration=o.msTransitionDuration=o.MozTransitionDuration=o.OTransitionDuration=o.transitionDuration=n}return this},n.getTranslate=function(n,t){var o,i,r,e;return void 0===t&&(t="x"),r=window.getComputedStyle(n,null),window.WebKitCSSMatrix?e=new WebKitCSSMatrix("none"===r.webkitTransform?"":r.webkitTransform):o=(e=r.MozTransform||r.OTransform||r.MsTransform||r.msTransform||r.transform||r.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,")).toString().split(","),"x"===t&&(i=window.WebKitCSSMatrix?e.m41:16===o.length?parseFloat(o[12]):parseFloat(o[4])),"y"===t&&(i=window.WebKitCSSMatrix?e.m42:16===o.length?parseFloat(o[13]):parseFloat(o[5])),i||0},n.requestAnimationFrame=function(n){return window.requestAnimationFrame?window.requestAnimationFrame(n):window.webkitRequestAnimationFrame?window.webkitRequestAnimationFrame(n):window.mozRequestAnimationFrame?window.mozRequestAnimationFrame(n):window.setTimeout(n,1e3/60)},n.cancelAnimationFrame=function(n){return window.cancelAnimationFrame?window.cancelAnimationFrame(n):window.webkitCancelAnimationFrame?window.webkitCancelAnimationFrame(n):window.mozCancelAnimationFrame?window.mozCancelAnimationFrame(n):window.clearTimeout(n)},n.fn.join=function(n){return this.toArray().join(n)}}($);
"use strict";$,FastClick.attach(document.body);