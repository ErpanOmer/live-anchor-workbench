(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{1191:function(e,n,t){"use strict";t.r(n);var r=t(837),o=t(787),a=t(16),i=t(0),c=t.n(i),s=t(44),d=t.n(s),u=t(9),p=t(12),l=t(26),b=t(32),f=t(586),g=t(185),m=t(782),_=(t(429),t(3124),-1),O=-1,I=document.createElement("div");I.className="app-container",document.body.appendChild(I),d.a.render(c.a.createElement((function(){var e=Object(i.useState)(void 0),n=e[0],t=e[1],s=Object(i.useState)(void 0),d=s[0],I=s[1],E=Object(i.useState)(void 0),v=E[0],h=E[1],y=Object(o.a)();return Object(i.useEffect)((function(){a.ipcRenderer.once(p.b.WINDOW_ONMOUNT_ARGS,(function(e,n){if(l.a.info(p.b.WINDOW_ONMOUNT_ARGS,JSON.stringify(n)),n){O=n.webContentId,_=n.pageData.parentWindowId,h(n.pageData.activeTab);var r=n.pageData.liveDetail;I(r),Object(m.c)(r.topic).then((function(){y()})),Object(f.c)([u.k.LIVE_REWARD],n.pageData.userId).then((function(e){t(e)})),a.ipcRenderer.send(p.b.SEND_TO_WINDOW_BY_ID,{targetId:_,fromId:O,event:p.b.EVENT_OPEN_REWARD_PAGE,payload:{}})}})),a.ipcRenderer.on(p.b.MINIMIZE_CURRENT_WINDOW,(function(){a.ipcRenderer.send(p.b.SEND_TO_WINDOW_BY_ID,{targetId:_,fromId:O,event:p.b.EVENT_CLOSE_REWARD_PAGE,payload:{}})})),a.ipcRenderer.on(p.b.RESTORE_CURRENT_WINDOW,(function(){a.ipcRenderer.send(p.b.SEND_TO_WINDOW_BY_ID,{targetId:_,fromId:O,event:p.b.EVENT_OPEN_REWARD_PAGE,payload:{}})})),Object(g.b)(""),Object(b.d)(),window.onbeforeunload=function(){a.ipcRenderer.send(p.b.SEND_TO_WINDOW_BY_ID,{targetId:_,fromId:O,event:p.b.EVENT_CLOSE_REWARD_PAGE,payload:{}})}}),[]),c.a.createElement("div",{className:"home-container"},n&&!!d&&c.a.createElement(r.MicroModule,{key:d.id,sandbox:!0,inModule:!0,pmInstance:m.d,topicId:d.topic,liveId:d.id,activeTab:v,wrapperStyle:{height:"100%"},moduleInfo:n[u.k.LIVE_REWARD]}))}),null),I)},20:function(e,n,t){"use strict";t.d(n,"c",(function(){return c})),t.d(n,"a",(function(){return s})),t.d(n,"b",(function(){return d}));var r=t(26),o=t(250),a=t.n(o);function i(e){return function(e){return null!=e}(e)?e.toString():""}function c(e,n){return i(e)===i(n)}function s(e){return a.a.pad2(e)}function d(e){var n=void 0;try{e&&(n=JSON.parse(e))}catch(e){r.a.error(e)}return n}},213:function(e,n,t){"use strict";var r=t(9),o=t(12),a=t(16),i=t(20),c=function(){return(c=Object.assign||function(e){for(var n,t=1,r=arguments.length;t<r;t++)for(var o in n=arguments[t])Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);return e}).apply(this,arguments)};n.a=function(e){var n=c(c({},e),{timestamp:Date.now()});return new Promise((function(e){a.ipcRenderer.send(o.b.SHOW_CONFIRM,{confirmData:n});var t=function(c,s){var d,u,p;s.event===o.b.HIDE_CONFIRM&&(a.ipcRenderer.off(o.b.MESSAGE_FROM_OTHER_WINDOW,t),console.log(o.b.HIDE_CONFIRM+":"+JSON.stringify(s.payload)),n.timestamp===(null===(d=s.payload)||void 0===d?void 0:d.timestamp)?Object(i.c)(null===(u=s.payload)||void 0===u?void 0:u.confirm,r.a.confirm)?e(r.a.confirm):Object(i.c)(null===(p=s.payload)||void 0===p?void 0:p.confirm,r.a.cancel)?e(r.a.cancel):e(r.a.close):e(r.a.close))};a.ipcRenderer.on(o.b.MESSAGE_FROM_OTHER_WINDOW,t)}))}},3124:function(e,n,t){var r=t(42),o=t(3125);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var a={insert:"head",singleton:!1};r(o,a);e.exports=o.locals||{}},3125:function(e,n,t){(n=t(43)(!1)).push([e.i,".titlebar {\n  background-color: #2e2e35 !important;\n  border: 2px solid #4b4b4b;\n  border-bottom: 0;\n  z-index: 1 !important;\n}\n.app-container {\n  border: none;\n}\n.home-container {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  background-color: #2e2e35;\n  border: 2px solid #4b4b4b;\n  border-top: none;\n}\n.home-container .live-gift-module {\n  height: 100%;\n}\n.page {\n  border-radius: 18px;\n  overflow: hidden;\n}\n.page-empty {\n  text-align: center;\n}\n.page-actions {\n  z-index: 11;\n  position: absolute;\n  right: 14px;\n  bottom: 80px;\n  width: 40px;\n}\n.page-action {\n  width: 30px !important;\n  height: 30px;\n  overflow: hidden;\n  border-radius: 40px;\n  background-color: #000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n}\n.page .tabbar .tab,\n.page .alpw-username-text,\n.page .alpw-username-nick,\n.page .alpw-reward-time,\n.page .alpw-reward-content,\n.page .list-item-header-info-nick-text,\n.page .list-item-header-time,\n.page .list-item-content {\n  font-size: var(--text-scale);\n}\n.page .alpw-footer {\n  height: var(--text-scale) !important;\n}\n.page .alpw-footer .alpw-btn {\n  font-size: var(--text-scale);\n  line-height: 1em;\n}\n.page .alpw-reward-status-0 {\n  height: 100%;\n}\n",""]),e.exports=n},32:function(e,n,t){"use strict";t.d(n,"a",(function(){return g})),t.d(n,"b",(function(){return m})),t.d(n,"d",(function(){return _}));var r,o=t(447),a=t.n(o),i=t(16),c=t(36),s=t(213),d=t(20),u=t(5),p=t(12),l=t(26),b=function(e,n,t,r){return new(t||(t=Promise))((function(o,a){function i(e){try{s(r.next(e))}catch(e){a(e)}}function c(e){try{s(r.throw(e))}catch(e){a(e)}}function s(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,c)}s((r=r.apply(e,n||[])).next())}))},f=function(e,n){var t,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(a){return function(c){return function(a){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=n.call(e,i)}catch(e){a=[6,e],r=0}finally{t=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}};!function(e){e[e.DAILY=1]="DAILY",e[e.PRE=2]="PRE",e[e.PRODUCTION=3]="PRODUCTION"}(r||(r={}));c.c?r.PRODUCTION:r.PRE;var g=a.a.instanceInRenderer;g.config=g.getOriginMTop().config,g.setConfig({urlFilters:{urls:["*://*.taobao.com/*"]},domainFilterFn:function(e){return/taobao.com$/.test(e)},saveHttpOnlyCookie:!0,mockHost:"".concat(Object(c.b)()?"pre-":"","liveplatform.taobao.com")}),g.getOriginMTop().config.subDomain=Object(c.b)()?"wapa":"m",n.c={isLogin:function(){return g.getOriginLogin().isLogin()},request:function(e){var n,t=this;return e.appKey=c.d?u.v:u.D,e.appVersion=u.g,e.needLogin=null===(n=e.needLogin)||void 0===n||n,g.request(e).then((function(e){return e.data})).catch((function(n){return b(t,void 0,void 0,(function(){var t;return f(this,(function(r){switch(r.label){case 0:return l.a.info("mtop request","".concat(JSON.stringify(e),", ").concat(JSON.stringify(n))),t=(t=n&&n.ret?n.ret[0]:"").split("::").slice(1).join(""),Object(d.c)(e.needLogin,!0)&&(t.includes("Session过期")||t.includes("Session失效"))?(t="当前登录状态已失效，请点击确定后重新登录，该操作不会中断直播流程。Tips：建议使用独立子账号登录主播工作台",Object(d.c)(u.G.get(u.u.LOGIN),!0)?[3,2]:(l.a.info("login window is not exist"),u.G.set(u.u.LOGIN,!0),[4,Object(s.a)({content:"当前登录状态已失效，请点击确定后重新登录，该操作不会中断直播流程。",subContent:"Tips：建议使用独立子账号登录主播工作台",subContentStyle:"dialog-subcontent-style",okText:"确定"})])):[3,2];case 1:r.sent(),setTimeout((function(){i.ipcRenderer.send(p.b.LOGIN,{})}),1e3),r.label=2;case 2:throw t}}))}))}))}};var m=function(){setInterval((function(){try{window.AWSC={use:function(){},configFYEx:function(){}};var e=window.baxiaCommon;document.querySelector("#pagePanelComment")&&e&&e.init({checkApiPath:function(e){return e.includes("mtop.taobao.iliad")||e.includes("mtop.taobao.dreamweb")||e.includes("mtop.mediaplatform")||e.includes("mtop.taobao.mediaplatform")||e.includes("mtop.acp.taopai")||e.includes("powermsg")},paramsType:["et"]})}catch(e){l.a.info(e)}}),1)},_=function(){window.lib.mtop=g,window.lib.mtop.config.subDomain=Object(c.b)()?"wapa":"m",setInterval((function(){try{window.lib.mtop=g,window.lib.mtop.config.subDomain=Object(c.b)()?"wapa":"m"}catch(e){console.log(e)}}),1)}},429:function(e,n,t){var r=t(42),o=t(439);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var a={insert:"head",singleton:!1};r(o,a);e.exports=o.locals||{}},439:function(e,n,t){var r=t(43),o=t(440),a=t(441);n=r(!1);var i=o(a);n.push([e.i,"html,\nbody,\nmain {\n  background-color: unset !important;\n  font-size: 12px;\n  font-family: PingFangSC-Regular;\n}\n.app-container {\n  position: absolute;\n  width: 100%;\n  height: calc(100vh - 30px);\n  overflow: auto;\n  border-top: none;\n  margin-top: 30px;\n  border: 2px solid #4b4b4b;\n  border-bottom-left-radius: 2px;\n  border-top: 0;\n  border-bottom-right-radius: 2px;\n}\n.titlebar .window-controls-container {\n  position: absolute !important;\n  right: 0;\n}\n.titlebar {\n  position: fixed !important;\n  background-color: #000000;\n  overflow: hidden;\n  border: 2px solid #4b4b4b;\n  border-top-left-radius: 2px;\n  border-bottom: 0;\n  border-top-right-radius: 2px;\n}\n.container-after-titlebar {\n  inset: 0px 0px 0px !important;\n  background-color: #000000;\n}\n.titlebar-icon {\n  height: 26px;\n  width: 26px;\n  cursor: pointer;\n}\n.titlebar-version {\n  margin-left: 20px;\n  position: absolute;\n}\n.titlebar-logo {\n  width: 200px;\n}\n.titlebar-button {\n  padding: 0px 10px;\n  cursor: pointer;\n  line-height: 18px !important;\n  border-radius: 30px;\n  height: 18px;\n  border-width: 0;\n  margin: 8px !important;\n  background-color: #ff0040;\n  color: white;\n  font-size: 12px;\n}\n.ant-btn,\n.ant-tabs {\n  user-select: none;\n}\n.ant-message {\n  margin-top: 30px;\n}\n.ant-select-dropdown {\n  z-index: 9999999;\n  -webkit-app-region: no-drag;\n}\n::-webkit-scrollbar {\n  width: 6px;\n  height: 6px;\n}\n::-webkit-scrollbar-thumb {\n  background: #4d4d4d;\n  border-radius: 6px;\n}\ninput:focus + .ant-radio-inner,\n.ant-switch-checked:focus {\n  box-shadow: none;\n}\n@font-face {\n  font-family: 'clockicons';\n  src: url("+i+");\n}\n.ant-popover-content .ant-popover-inner {\n  border-radius: 8px !important;\n}\n.ant-popover-content .ant-popover-message-title {\n  font-size: 14px !important;\n}\n.ant-popover-content .ant-popover-message > .anticon {\n  top: 9px !important;\n}\n.ant-popover-content .ant-popover-buttons {\n  font-size: 14px !important;\n}\n.ant-popover-content .ant-popover-buttons .ant-btn {\n  border-radius: 20px !important;\n  margin-left: 16px !important;\n  padding: 2px 14px !important;\n}\n",""]),e.exports=n},441:function(e,n,t){e.exports=t.p+"d92d0a48412fbd015293a9c81c39376d.woff2"},540:function(e,n,t){"use strict";t.d(n,"c",(function(){return d})),t.d(n,"a",(function(){return u})),t.d(n,"b",(function(){return p}));var r=t(18),o=t.n(r),a=t(46),i=t.n(a),c=t(5),s=function(e,n,t){if(t||2===arguments.length)for(var r,o=0,a=n.length;o<a;o++)!r&&o in n||(r||(r=Array.prototype.slice.call(n,0,o)),r[o]=n[o]);return e.concat(r||Array.prototype.slice.call(n))},d=function(e){try{var n=new URL(e).pathname;return o.a.join.apply(o.a,s([c.b],n.split("/"),!1))}catch(e){return}},u=function(e){var n=d(e);return!(!n||i.a.existsSync(n))},p=function(e){var n=e.replace(c.b,"");return o.a.parse(n.replaceAll("\\\\","/")).dir}},586:function(e,n,t){"use strict";t.d(n,"c",(function(){return i})),t.d(n,"b",(function(){return c})),t.d(n,"a",(function(){return s})),t.d(n,"f",(function(){return d})),t.d(n,"d",(function(){return u})),t.d(n,"e",(function(){return p}));var r=t(36),o=t(32),a=function(e,n,t){if(t||2===arguments.length)for(var r,o=0,a=n.length;o<a;o++)!r&&o in n||(r||(r=Array.prototype.slice.call(n,0,o)),r[o]=n[o]);return e.concat(r||Array.prototype.slice.call(n))};function i(e,n){var t="37862f3ef4b94d84925ffda7759d2260",i=Object(r.b)();return i&&(t="f767ee006135484d961e398b5c575146"),new Promise((function(r,c){o.c.request({api:"mtop.taobao.mt.data.get",v:"1.0",data:{uuid:t}}).then((function(t){var o={},s=[];try{Object.prototype.hasOwnProperty.call(t,"grey-users")&&(s=t["grey-users"]),e.forEach((function(e){if(Object.prototype.hasOwnProperty.call(t,e)){var r=t[e],c=r.version,d=r.greyVersion,u=r.greyUsers,p=r.versionPlaceholder,l=r.envPlaceholder,b=r.runtime,f=r.url,g=[],m=a(a([],s,!0),u,!0).includes(n.toString())?d:c,_=i?"dev.":"";f.forEach((function(e){for(var n=e;n.includes(p);)n=n.replace(p,m);for(;n.includes(l);)n=n.replace(l,_);g.push(n)})),o[e]={name:e,url:g,runtime:b}}else console.error("[Fatal Error] Couldn't load configuration for module \"".concat(e,'".'))}))}catch(e){c(e)}r(o)})).catch(c)}))}function c(){return o.c.request({api:"mtop.taobao.dreamweb.common.permission.get",v:"1.0",data:{needParams:"abStreamEnabled",queryMain:!1}})}function s(){return o.c.request({api:"mtop.taobao.dreamweb.common.permission.get",v:"1.0",data:{needParams:"openBlurAI,openMeixingMeizhuangControl",queryMain:!1}})}function d(){return o.c.request({api:"mtop.taobao.dreamweb.common.permission.get",v:"1.0",data:{needParams:"openRaceSnapshot",queryMain:!1}})}function u(){return o.c.request({api:"mtop.taobao.dreamweb.common.permission.get",v:"1.0",data:{needParams:"openPerformanceDetect,openMemryLimitDetect",queryMain:!1}})}function p(){return o.c.request({api:"mtop.taobao.dreamweb.common.permission.get",v:"1.0",data:{needParams:"openPreloadStreamingWindow",queryMain:!1}})}},777:function(e,n,t){"use strict";t.d(n,"a",(function(){return i})),t.d(n,"b",(function(){return c}));t(461);var r=t(32),o=function(e,n,t,r){return new(t||(t=Promise))((function(o,a){function i(e){try{s(r.next(e))}catch(e){a(e)}}function c(e){try{s(r.throw(e))}catch(e){a(e)}}function s(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(i,c)}s((r=r.apply(e,n||[])).next())}))},a=function(e,n){var t,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function c(a){return function(c){return function(a){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=n.call(e,i)}catch(e){a=[6,e],r=0}finally{t=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,c])}}},i=function(){return r.c.request({api:"mtop.user.getUserSimple",v:"1.0",data:{},ecode:0,needLogin:!1,LoginRequest:!1}).catch((function(e){return e}))},c=function(e){return o(void 0,void 0,void 0,(function(){return a(this,(function(n){switch(n.label){case 0:return[4,r.c.request({api:"mtop.taobao.mtntaiadmin.anchor.pc.log.upload.status.update",v:"1.0",data:e})];case 1:return[2,n.sent()]}}))}))}},782:function(e,n,t){"use strict";t.d(n,"d",(function(){return r})),t.d(n,"a",(function(){return o})),t.d(n,"b",(function(){return O})),t.d(n,"c",(function(){return I}));var r,o,a=t(867),i=t(5),c=t(540),s=t(9),d=t(12),u=t(32),p=t(16),l=t(168),b=t.n(l),f=t(777),g=t(20),m="",_=function(){return new Promise((function(e,n){u.c.request({api:"mtop.taobao.dreamweb.anchor.h5token",v:"1.0",data:{appKey:"H5_25278248"}}).then((function(n){e(n.result)})).catch((function(e){n(e)}))}))},O=b.a.once((function(e){var n=new a.a({topic:"ANCHOR-TOTAL-77c3a392-9757-4dd1-983f-ae990a14b2e5",namespace:1,bizTag:"tb",appKey:"H5_25278248",mode:3,mtop:u.a,debug:!1,getToken:_,accsExtParams:{reconnect:!1}});n.on("ready",(function(){n.subscribe(),o=n,n.on("p2pMessage",(function(n){switch(n.msgHeader.subType){case s.h.GLOBAL_ANCHOR_TOTAL:console.log("[PowerMsg]message",n.msgHeader.subType,JSON.stringify(n)),e[s.h.GLOBAL_ANCHOR_TOTAL](n.msgData)}}))}))})),I=function(e){return new Promise((function(n,t){if(r)return e!==m&&function(e){r&&(m=e,r.resubscribe(e))}(e),void n(r);if(!e)return console.error("topicId获取失败"),void t();m=e;var o=new a.a({topic:e,namespace:1,bizTag:"tb",appKey:"H5_25278248",mode:3,mtop:u.a,debug:!1,getToken:_,accsExtParams:{reconnect:!1}});o.on("ready",(function(){o.subscribe(),r=o,o.on("p2pMessage",E),o.on("bizInfo",E),n(o)}))}))},E=function(e){var n,t,r=i.G.get(i.u.STEAMING_WIN_ID),o=i.G.get(i.u.CURRENT_LIVE_DETAIL);switch(e.msgHeader.subType){case s.h.STOPPED:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e)),p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_PM_LIVE_STOPPED,payload:{}});break;case s.h.HOT_STREM_MAIN_STOPPED:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e)),p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_PM_LIVE_HOTSTREM_MAIN_STOPPED,payload:{}});break;case s.h.UPLOAD_LOG:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e)),p.ipcRenderer.send(d.b.UPLOAD_SDK_LOG,{}),p.ipcRenderer.once(d.b.UPLOAD_SDK_LOG_DONE,(function(n,t){var r=e.msgData;Object(f.b)({taskId:r.taskId,deviceId:r.deviceId,ip:r.ip,loginUserId:(null==o?void 0:o.accountId)||"",liveId:null==o?void 0:o.id,ossUrl:t.url,status:1,extendInfo:t.url?"Success":"UploadThread return false."})}));break;case s.h.LOW_QUALITY_NOTICE:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e)),p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_PM_LIVE_LOW_QUALITY_NOTICE,payload:e});break;case s.h.MAIN_SUPPOT_DOWN_GRADE:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e));break;case s.h.SHORT_VIDEO_UPDATE:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e));var a=null===(n=e.msgHeader.extParams)||void 0===n?void 0:n.isAdd;Object(g.c)(a,!1)?p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_PM_LIVE_HIDE_TIMEPOINT,payload:e}):Object(g.c)(a,!0)&&p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_PM_LIVE_SHOW_TIMEPOINT,payload:e});break;case s.h.RACE_SNAPSOT:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e)),p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_PM_LIVE_RACE_SNAPSHOT,payload:e});break;case s.h.STOP_SHORT_VIDEO:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e)),p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_PM_LIVE_HIDE_TIMEPOINT,payload:e});break;case s.h.P2P_RACE_ROOMINFO:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e));break;case s.h.STUDIO_VIOLATION:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e)),p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_PM_LIVE_VIOLATION,payload:e});break;case s.h.SAFE_CALL:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e)),p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_PM_LIVE_SAFE_CALL,payload:e});break;case s.h.FORBIDDEN_WINDOW:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e)),p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_PM_LIVE_FORBIDDEN,payload:e});break;case s.h.ERROR_CORRECTION:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e)),p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_PM_LIVE_ERROR_CORRECTION,payload:e});break;case s.h.AIINFORMCARD:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e));var u=e.msgData;p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_INFOCARD_DATA,payload:{info:u}});break;case s.h.NEW_BCLINKMIC_MSG:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e)),p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.EVENT_FANS_LINKMIC_REQUEST,payload:{info:e.msgData}});break;case s.h.INTERACTIVE_MATERIAL:console.log("[PowerMsg]message",e.msgHeader.subType,JSON.stringify(e));var l=e.msgData;if(Object(g.c)(l.anchorId,null==o?void 0:o.accountId)&&Object(g.c)(l.liveId,null==o?void 0:o.id)){var b=l.pcMaterialList[0];if(Object(g.c)(l.steps[0],"load"))Object(c.a)(b)&&p.ipcRenderer.send(d.b.START_DOWNLOAD_FILE,{url:b});else if(Object(g.c)(l.steps[0],"show")){var m=(null!==(t=i.F.get(i.u.DOWNLOADER_FILE_MAP))&&void 0!==t?t:{})[b];!m&&Object(c.a)(b)?(p.ipcRenderer.send(d.b.START_DOWNLOAD_FILE,{url:b}),i.F.onDidChange(i.u.DOWNLOADER_FILE_MAP,(function(e,n){!e[b]||n&&n[b]||p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.CREATE_DISPOSABLE_MEDIA_SOURCE,payload:{url:e[b],name:"排位赛氛围"}})}))):p.ipcRenderer.send(d.b.SEND_TO_WINDOW_BY_ID,{targetId:r,fromId:r,event:d.b.CREATE_DISPOSABLE_MEDIA_SOURCE,payload:{url:m,name:"排位赛氛围"}})}}}}}}]);