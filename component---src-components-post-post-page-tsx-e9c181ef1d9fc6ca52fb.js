(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"2gU5":function(e,t,n){"use strict";var i=n("q1tI"),o=n.n(i),r=n("vOnD").c.div.withConfig({displayName:"MainPageRowTemplate__Wrapper",componentId:"edmyx5-0"})(["width:100%;height:100%;position:relative;display:flex;flex-direction:row;"]);t.a=function(e){var t=e.children,n=e.style;return o.a.createElement(r,{style:n},t)}},"4M6O":function(e,t,n){"use strict";var i=n("TqRt");t.__esModule=!0,t.insertScript=function(e,t,n){var i=window.document.createElement("script");return i.async=!0,i.src=e,i.id=t,n.appendChild(i),i},t.removeScript=function(e,t){var n=window.document.getElementById(e);n&&t.removeChild(n)},t.debounce=function(e,t,n){var i;return function(){var o=this,r=arguments,a=function(){i=null,n||e.apply(o,r)},s=n&&!i;window.clearTimeout(i),i=setTimeout(a,t),s&&e.apply(o,r)}},t.isReactElement=a,t.shallowComparison=function e(t,n){var i,r=new Set(Object.keys(t).concat(Object.keys(n)));return 0!==(i=[]).concat.apply(i,(0,o.default)(r)).filter((function(i){if("object"==typeof t[i]){if(e(t[i],n[i]))return!0}else if(t[i]!==n[i]&&!a(t[i]))return!0})).length};var o=i(n("RIqP")),r=i(n("q1tI"));function a(e){return!!r.default.isValidElement(e)||!!Array.isArray(e)&&e.some((function(e){return r.default.isValidElement(e)}))}},BfNy:function(e,t,n){"use strict";var i=n("q1tI"),o=n.n(i),r=n("vOnD"),a=n("3V0p"),s=n("oXGY"),c=r.c.div.withConfig({displayName:"Footer__FooterWrapper",componentId:"sc-11i4h0w-0"})(["display:flex;border-top:1px solid ",";margin-top:5rem;width:100%;height:8rem;align-items:center;justify-content:center;flex-direction:column;span{font-size:1.5rem;}.icon-wrapper{width:9rem;display:flex;justify-content:space-between;flex-direction:row;margin-top:1rem;svg{width:30%;height:1.5rem;cursor:pointer;}}"],a.a.gray[5]);t.a=function(){return o.a.createElement(c,null,o.a.createElement("span",null,"millo's tech blog"),o.a.createElement(s.a,{className:"icon-wrapper"}))}},ORnI:function(e,t,n){"use strict";var i=n("TqRt");t.__esModule=!0,t.default=void 0;var o=i(n("VUT9"));t.Disqus=o.default;var r=i(n("qASQ"));t.CommentCount=r.default;var a=i(n("vAJ3"));t.CommentEmbed=a.default;var s=o.default;t.default=s},SMwS:function(e,t,n){"use strict";n.r(t);var i,o=n("q1tI"),r=n.n(o),a=n("BfNy"),s=n("ARf/"),c=n("rniq"),l=n("2gU5"),d=n("lD4s"),u=n("MUpH"),m=n("vOnD"),f=(n("RGc2"),Object(m.a)(i||(i=Object(u.a)(['\n    body {\n        background-color: white;\n        font-family: "ELAND", serif;\n    }\n'])))),p=m.c.div.withConfig({displayName:"PostTemplate__PostTemplateWrapper",componentId:"fu5bv9-0"})(['font-family:"ELAND",serif;']),h=function(e){var t=e.children;return r.a.createElement(r.a.Fragment,null,r.a.createElement(f,null),r.a.createElement(p,null,t))},g=n("tP0u"),w=n("3V0p"),v=function(){function e(e,t,n){var i=this;this.targets=Array.from(e.querySelectorAll("a")),this.refs=t,this.sensitivity=n||-10,window.addEventListener("scroll",(function(){return i.onScroll()}))}var t=e.prototype;return t.onScroll=function(){var e=this;this.isOnTopOfDoc(this.refs[0])||this.deactiveateTarget(),this.refs.forEach((function(t){if(e.isOnTopOfDoc(t)){e.deactiveateTarget();var n=e.findTarget(t.id);n&&e.activate(n)}}))},t.isOnTopOfDoc=function(e){return document.documentElement.scrollTop-e.offsetTop>=this.sensitivity},t.deactiveateTarget=function(){var e=this;this.targets.forEach((function(t){return e.deactivate(t)}))},t.findTarget=function(e){return this.targets.filter((function(t){return decodeURIComponent(t.attributes.href.value.replace(/^#/,""))===e}))[0]},t.activate=function(e){e.classList.add("active")},t.deactivate=function(e){e.classList.remove("active")},e}(),y=m.c.div.withConfig({displayName:"PostToC__ToCWrapper",componentId:"sc-1vz6emx-0"})(["transition:0.125s all ease-in;width:20%;padding:0.5rem;padding-right:1rem;padding-left:0;order:1;top:10rem;margin-left:4rem;position:sticky;height:30rem;overflow-y:auto;word-break:break-all;","{display:none;}ul:first-child{padding-left:1rem;border-left:2px solid ",";}ul{list-style:none;margin:0;li{border:none;margin-bottom:4px;p{margin:0;}}}a{text-decoration:none;color:",";font-size:1rem;&:hover,&:focus{color:",";}&.active{color:",";transform:scale(1.1);}}& + &{margin-top:4px;}"],g.a.custom(1440),w.a.indigo[4],w.a.gray[4],w.a.indigo[4],w.a.indigo[9]),b=function(e){var t=e.tableOfContents;return Object(o.useEffect)((function(){var e=document.querySelector("#content-container"),t=Array.from(e.querySelectorAll("h1, h2")).filter((function(e){return e.id})),n=document.querySelector("#toc-container");new v(n,t)}),[]),r.a.createElement(y,{id:"toc-container",dangerouslySetInnerHTML:{__html:t}})},E=n("Wbzz"),I=n("5OSp"),_=n("mLdW"),C=m.c.div.withConfig({displayName:"TagList__TagItemWrapper",componentId:"sc-1ja74mt-0"})(["padding:0.5rem 1rem;background-color:",";color:",";border-radius:0.5rem;margin-right:1rem;margin-bottom:0.5rem;&:hover{}","{font-size:0.8rem;}"],w.a.gray[1],w.a.indigo[8],g.a.custom(1056)),q=Object(o.memo)((function(e){var t=e.tag,n=e.onClick;return r.a.createElement(C,{onClick:function(){return n(t)}},t)})),S=m.c.div.withConfig({displayName:"TagList__TagListWrapper",componentId:"sc-1ja74mt-1"})(["width:100%;display:flex;flex-wrap:wrap;margin-bottom:4rem;"]),T=function(e){var t=e.tags,n=e.onClick;return r.a.createElement(S,null,t.map((function(e,t){return r.a.createElement(q,{tag:e,key:t,onClick:n})})))},O=Object(o.memo)(T),D=m.c.div.withConfig({displayName:"PostViewer__PostViewerWrapper",componentId:"sc-1vcgubz-0"})(["width:60%;margin-left:0;","{width:80%;}","{width:100%;}.category{text-decoration:none;font-size:1.5rem;color:gray;margin-bottom:0;&:hover{text-decoration:underline;}","{font-size:1rem;}}.title{margin-top:0.5rem;font-size:3rem;","{font-size:2.2rem;}}.date{line-height:0.8;color:gray;","{font-size:0.8rem;}}"],g.a.custom(1440),g.a.custom(1056),g.a.custom(1056),g.a.custom(1056),g.a.custom(1056)),N=m.c.div.withConfig({displayName:"PostViewer__PostContentWrapper",componentId:"sc-1vcgubz-1"})(["width:100%;margin:0;word-break:break-all;a{color:",";text-decoration:none;&:hover{text-decoration:underline;}}h1{margin-top:3rem;","{margin-top:2rem;font-size:1.8rem;}}h2{margin-top:0rem;}h3{margin-top:3rem;","{margin-top:2rem;}}p{font-size:1.2rem;line-height:1.8;","{font-size:1.05rem;line-height:1.7;}}li{font-size:1.2rem;line-height:2;","{font-size:1.05rem;line-height:1.7;}h4,p{margin:0;font-size:1.2rem;","{font-size:1.05rem;line-height:1.7;}}}pre,code{font-size:1.1rem;","{font-size:1rem;}}img{width:100%;}"],w.a.indigo[6],g.a.custom(767),g.a.custom(767),g.a.custom(767),g.a.custom(767),g.a.custom(767),g.a.custom(767)),k=function(e){var t=e.post,n=t.html,i=t.title,a=t.released_at,s=t.updated_at,c=t.category,l=t.tags,d=Object(o.useCallback)((function(e){}),[l]);return r.a.createElement(D,null,c&&r.a.createElement(E.a,{className:"category",to:"/?category="+c},I.b[c]?r.a.createElement("img",{src:I.b[c].src}):[{category:c}]),r.a.createElement("h1",{className:"title"},i),r.a.createElement("p",{className:"date"},"게시: ",Object(_.b)(a)),s&&r.a.createElement("p",{className:"date"},"수정: ",Object(_.b)(s)),l&&r.a.createElement(O,{tags:l,onClick:d}),r.a.createElement(N,{id:"content-container",dangerouslySetInnerHTML:{__html:n}}))},x=n("ORnI"),U=m.c.div.withConfig({displayName:"PostComment__Wrapper",componentId:"sc-1e9l69y-0"})(["width:60%;margin-left:auto;margin-right:auto;","{width:100%;}"],Object(g.b)(1056)),j=function(e){var t=e.id,n=e.title,i=e.path;return r.a.createElement(U,null,r.a.createElement(x.Disqus,{config:{url:"https://millo-l.github.io"+i,identifier:t,title:n}}))};t.default=function(e){var t=e.data.markdownRemark;return t?r.a.createElement(h,null,r.a.createElement(s.a,null),r.a.createElement(d.a,{style:{marginTop:"2rem"}},r.a.createElement(l.a,{style:{marginBottom:"5rem"}},r.a.createElement(c.a,{style:{marginTop:"0.5rem"},type:"body",categoryVisible:!0}),r.a.createElement(k,{post:Object.assign({},t.frontmatter,{html:t.html})}),r.a.createElement(b,{tableOfContents:t.tableOfContents})),r.a.createElement(j,{title:t.frontmatter.title,id:t.id,path:t.frontmatter.path}),r.a.createElement(a.a,null))):r.a.createElement("div",null)}},VUT9:function(e,t,n){"use strict";var i=n("TqRt");t.__esModule=!0,t.default=void 0;var o=i(n("pVnL")),r=i(n("8OQS")),a=i(n("VbXa")),s=i(n("q1tI")),c=i(n("17x9")),l=n("4M6O"),d=function(e){function t(t){var n;return(n=e.call(this,t)||this).shortname="millo-l",n.embedUrl="https://"+n.shortname+".disqus.com/embed.js",n}(0,a.default)(t,e);var n=t.prototype;return n.componentDidMount=function(){this.loadInstance()},n.shouldComponentUpdate=function(e){return this.props!==e&&(0,l.shallowComparison)(this.props,e)},n.componentDidUpdate=function(){this.loadInstance()},n.componentWillUnmount=function(){this.cleanInstance()},n.getDisqusConfig=function(e){return function(){this.page.identifier=e.identifier,this.page.url=e.url,this.page.title=e.title,this.page.remote_auth_s3=e.remoteAuthS3,this.page.api_key=e.apiKey,this.language=e.language}},n.loadInstance=function(){"undefined"!=typeof window&&window.document&&(window.disqus_config=this.getDisqusConfig(this.props.config),window.document.getElementById("dsq-embed-scr")?this.reloadInstance():(0,l.insertScript)(this.embedUrl,"dsq-embed-scr",window.document.body))},n.reloadInstance=function(){window&&window.DISQUS&&window.DISQUS.reset({reload:!0})},n.cleanInstance=function(){(0,l.removeScript)("dsq-embed-scr",window.document.body);try{delete window.DISQUS}catch(n){window.DISQUS=void 0}var e=window.document.getElementById("disqus_thread");if(e)for(;e.hasChildNodes();)e.removeChild(e.firstChild);if(window.document.querySelector('[id^="dsq-app"]')){var t=window.document.getElementById(window.document.querySelector('[id^="dsq-app"]').id);t.parentNode.removeChild(t)}},n.render=function(){var e=this.props,t=(e.config,(0,r.default)(e,["config"]));return s.default.createElement("div",(0,o.default)({id:"disqus_thread"},t,{__self:this,__source:{fileName:"/Users/brettstevenson/Desktop/Folder/gatsby-plugin-workspace/gatsby-plugin-disqus/src/components/Disqus.jsx",lineNumber:86,columnNumber:7}}))},t}(s.default.Component);t.default=d,d.propTypes={config:c.default.shape({identifier:c.default.string,title:c.default.string,url:c.default.string,language:c.default.string,remoteAuthS3:c.default.string,apiKey:c.default.string})}},qASQ:function(e,t,n){"use strict";var i=n("TqRt");t.__esModule=!0,t.default=void 0;var o=i(n("pVnL")),r=i(n("8OQS")),a=i(n("VbXa")),s=i(n("q1tI")),c=i(n("17x9")),l=n("4M6O"),d=(0,l.debounce)((function(){window.DISQUSWIDGETS&&window.DISQUSWIDGETS.getCount({reset:!0})}),300,!1),u=function(e){function t(t){var n;return(n=e.call(this,t)||this).shortname="millo-l",n}(0,a.default)(t,e);var n=t.prototype;return n.componentDidMount=function(){this.loadInstance()},n.shouldComponentUpdate=function(e){return this.props!==e&&(0,l.shallowComparison)(this.props,e)},n.componentDidUpdate=function(){this.loadInstance()},n.componentWillUnmount=function(){this.cleanInstance()},n.loadInstance=function(){window.document.getElementById("dsq-count-scr")?d():(0,l.insertScript)("https://"+this.shortname+".disqus.com/count.js","dsq-count-scr",window.document.body)},n.cleanInstance=function(){(0,l.removeScript)("dsq-count-scr",window.document.body),window.DISQUSWIDGETS=void 0},n.render=function(){var e=this.props,t=e.config,n=e.placeholder,i=(0,r.default)(e,["config","placeholder"]);return s.default.createElement("span",(0,o.default)({className:"disqus-comment-count","data-disqus-identifier":t.identifier,"data-disqus-url":t.url},i,{__self:this,__source:{fileName:"/Users/brettstevenson/Desktop/Folder/gatsby-plugin-workspace/gatsby-plugin-disqus/src/components/CommentCount.jsx",lineNumber:53,columnNumber:7}}),n)},t}(s.default.Component);t.default=u,u.defaultProps={placeholder:"..."},u.propTypes={config:c.default.shape({identifier:c.default.string,title:c.default.string,url:c.default.string}),placeholder:c.default.string}},vAJ3:function(e,t,n){"use strict";var i=n("TqRt");t.__esModule=!0,t.default=void 0;var o=i(n("VbXa")),r=i(n("q1tI")),a=i(n("17x9")),s=function(e){function t(){return e.apply(this,arguments)||this}(0,o.default)(t,e);var n=t.prototype;return n.getSrc=function(){return"https://embed.disqus.com/p/"+Number(this.props.commentId).toString(36)+"?p="+(this.props.showParentComment?"1":"0")+"&m="+(this.props.showMedia?"1":"0")},n.render=function(){return r.default.createElement("iframe",{src:this.getSrc(),width:this.props.width,height:this.props.height,seamless:"seamless",scrolling:"no",frameBorder:"0",__self:this,__source:{fileName:"/Users/brettstevenson/Desktop/Folder/gatsby-plugin-workspace/gatsby-plugin-disqus/src/components/CommentEmbed.jsx",lineNumber:17,columnNumber:13}})},t}(r.default.Component);t.default=s,s.defaultProps={width:420,height:320,showMedia:!0,showParentComment:!0},s.propTypes={commentId:a.default.string.isRequired,width:a.default.number,height:a.default.number,showMedia:a.default.bool,showParentComment:a.default.bool}}}]);
//# sourceMappingURL=component---src-components-post-post-page-tsx-e9c181ef1d9fc6ca52fb.js.map