(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{"2gU5":function(e,t,r){"use strict";var a=r("q1tI"),n=r.n(a),i=r("vOnD").c.div.withConfig({displayName:"MainPageRowTemplate__Wrapper",componentId:"edmyx5-0"})(["width:100%;height:100%;position:relative;display:flex;flex-direction:row;"]),o=function(e){var t=e.children,r=e.style;return n.a.createElement(i,{style:r},t)};t.a=Object(a.memo)(o)},BfNy:function(e,t,r){"use strict";var a=r("q1tI"),n=r.n(a),i=r("vOnD"),o=r("3V0p"),l=r("oXGY"),m=i.c.div.withConfig({displayName:"Footer__FooterWrapper",componentId:"sc-11i4h0w-0"})(["display:flex;border-top:1px solid ",";margin-top:5rem;width:100%;height:8rem;align-items:center;justify-content:center;flex-direction:column;span{font-size:1.5rem;}.icon-wrapper{width:9rem;display:flex;justify-content:space-between;flex-direction:row;margin-top:1rem;svg{width:30%;height:1.5rem;cursor:pointer;}}"],o.a.gray[5]);t.a=function(){return n.a.createElement(m,null,n.a.createElement("span",null,"millo's tech blog"),n.a.createElement(l.a,{className:"icon-wrapper"}))}},NgyL:function(e,t,r){"use strict";r.d(t,"c",(function(){return a})),r.d(t,"a",(function(){return n})),r.d(t,"b",(function(){return i})),r.d(t,"d",(function(){return o}));var a=function(e){var t=[];return e.edges.map((function(e){var r=e.node.frontmatter,a={path:e.node.fields.slug,title:r.title,description:r.description,released_at:r.released_at,updated_at:r.updated_at,image:r.image?r.image.childImageSharp.fluid:null,lang:r.lang,category:r.category};t.push(a)})),t},n=function(e,t){return e.filter((function(e){return e.category===t}))};function i(e,t){return e.filter((function(e){return e.lang===t}))}var o=function(e){for(var t=[],r=e.group,a=r.length,n=0;n<a;n++){var i=r[n].nodes[0].frontmatter,o={path:"/series/"+r[n].fieldValue.replace(/ /gi,"-"),title:r[n].fieldValue,image:i.image?i.image.childImageSharp.fluid:null,updated_at:i.released_at,totalCount:r[n].totalCount,lang:i.lang};t.push(o)}return t}},SMwS:function(e,t,r){"use strict";r.r(t);var a,n=r("MUpH"),i=r("q1tI"),o=r.n(i),l=r("BfNy"),m=r("ARf/"),c=r("rniq"),s=r("2gU5"),d=r("lD4s"),g=r("vOnD"),u=(r("RGc2"),Object(g.a)(a||(a=Object(n.a)(['\n    body {\n        background-color: white;\n        font-family: "ELAND", serif;\n    }\n'])))),f=g.c.div.withConfig({displayName:"PostTemplate__PostTemplateWrapper",componentId:"fu5bv9-0"})(['font-family:"ELAND",serif;']),p=function(e){var t=e.children;return o.a.createElement(o.a.Fragment,null,o.a.createElement(u,null),o.a.createElement(f,null,t))},h=r("tP0u"),b=r("3V0p"),v=function(){function e(e,t,r){var a=this;this.targets=Array.from(e.querySelectorAll("a")),this.refs=t,this.sensitivity=r||-10,window.addEventListener("scroll",(function(){return a.onScroll()}))}var t=e.prototype;return t.onScroll=function(){var e=this;this.isOnTopOfDoc(this.refs[0])||this.deactiveateTarget(),this.refs.forEach((function(t){if(e.isOnTopOfDoc(t)){e.deactiveateTarget();var r=e.findTarget(t.id);r&&e.activate(r)}}))},t.isOnTopOfDoc=function(e){return document.documentElement.scrollTop-e.offsetTop>=this.sensitivity},t.deactiveateTarget=function(){var e=this;this.targets.forEach((function(t){return e.deactivate(t)}))},t.findTarget=function(e){return this.targets.filter((function(t){return decodeURIComponent(t.attributes.href.value.replace(/^#/,""))===e}))[0]},t.activate=function(e){e.classList.add("active")},t.deactivate=function(e){e.classList.remove("active")},e}(),w=g.c.div.withConfig({displayName:"PostToC__ToCWrapper",componentId:"sc-1vz6emx-0"})(["transition:0.125s all ease-in;width:20%;padding:0.5rem;padding-right:1rem;padding-left:0;order:1;top:10rem;margin-left:4rem;position:sticky;height:40rem;overflow-y:auto;word-break:break-all;","{display:none;}ul:first-child{padding-left:1rem;border-left:2px solid ",";}ul{list-style:none;margin:0;li{border:none;margin-bottom:4px;p{margin:0;}}}a{text-decoration:none;color:",";font-size:0.9rem;&:hover,&:focus{color:",";}&.active{color:",";transform:scale(1.1);}}& + &{margin-top:4px;}"],h.a.custom(1440),b.a.indigo[4],b.a.gray[4],b.a.indigo[4],b.a.indigo[9]),y=function(e){var t=e.tableOfContents;return Object(i.useEffect)((function(){var e=document.querySelector("#content-container"),t=Array.from(e.querySelectorAll("h1, h2")).filter((function(e){return e.id})),r=document.querySelector("#toc-container");new v(r,t)}),[]),o.a.createElement(w,{id:"toc-container",dangerouslySetInnerHTML:{__html:t}})},x=Object(i.memo)(y),E=r("Wbzz"),k=r("5OSp"),O=r("mLdW"),_=r("4BEc"),N=r("33Fu"),j=r("RW2Z"),C=r("ncNO"),z=g.c.div.withConfig({displayName:"PostSeriesList__Wrapper",componentId:"sc-9otow0-0"})(["position:relative;width:80%;background-color:",";margin-left:auto;margin-right:auto;padding-top:1rem;padding-bottom:1rem;border-radius:10px;word-break:break-all;","{width:100%;}h2{margin-left:1.5rem;margin-right:1.5rem;","{font-size:1.2rem;}}a{text-decoration:none;color:",";&:hover{text-decoration:underline;}}ol{padding-left:3rem;padding-right:1.5rem;","{font-size:0.9rem;}.now-post{color:",";font-weight:bold;}li{margin:0.5rem;color:",";}}.bookmark-img{position:absolute;right:1.5rem;top:-2px;width:2.8rem;height:2.8rem;color:",";","{right:1rem;width:2.2rem;height:2.2rem;}}.footer{display:flex;justify-content:space-between;margin-top:3rem;margin-right:1.5rem;margin-left:1.5rem;.visible-btn{display:flex;cursor:pointer;align-items:center;color:",";span{margin-left:0.3rem;font-size:0.9rem;}}}"],b.a.gray[0],h.a.custom(767),h.a.custom(767),b.a.gray[8],h.a.custom(767),b.a.indigo[5],b.a.gray[6],b.a.indigo[5],h.a.custom(767),b.a.gray[7]),I=function(e){var t=e.series,r=e.seriesList,a=e.nowPostTitle,n=e.lang,i=Object(C.a)(!0),l=i[0],m=i[1];return o.a.createElement(z,null,o.a.createElement(E.a,{to:"/series/"+t.replace(/ /gi,"-")},o.a.createElement("h2",null,t)),o.a.createElement(j.a,{className:"bookmark-img"}),l?o.a.createElement("ol",null,r.map((function(e,t){return a===e.title?o.a.createElement("li",{key:t},o.a.createElement("span",{className:"now-post"},e.title)):o.a.createElement("li",{key:t},o.a.createElement(E.a,{to:""+e.slug},e.title))}))):o.a.createElement("div",null),o.a.createElement("div",{className:"footer"},l?o.a.createElement("div",{className:"visible-btn",onClick:m},o.a.createElement(N.b,null),o.a.createElement("span",null,"ko"===n?"숨기기":"Hide")):o.a.createElement("div",{className:"visible-btn",onClick:m},o.a.createElement(N.a,null),o.a.createElement("span",null,"ko"===n?"목록 보기":"Show list"))))},P=r("NIcq"),T=Object(g.d)(["0%{transform:translateX(0px)}50%{transform:translateX(-8px)}100%{transform:translateX(0px)}"]),L=Object(g.d)(["0%{transform:translateX(0px)}50%{transform:translateX(8px)}100%{transform:translateX(0px)}"]),S=g.c.div.withConfig({displayName:"PrevNextPostItem__Circle",componentId:"u4u2kx-0"})(["width:32px;height:32px;border-radius:16px;display:flex;align-items:center;justify-content:center;border:1px solid ",";font-size:1.5rem;color:",";margin-left:1rem;margin-right:1rem;"],b.a.indigo[5],b.a.indigo[5]),W=Object(g.c)(E.a).withConfig({displayName:"PrevNextPostItem__Wrapper",componentId:"u4u2kx-1"})(["cursor:pointer;background:",";box-shadow:0 0 4px 0 rgba(0,0,0,0.06);width:100%;height:4rem;display:flex;align-items:center;text-decoration:none;"," &:hover{","{animation-duration:0.35s;animation-name:",";animation-fill-mode:forwards;animation-timing-function:ease-out;}}"],b.a.gray[0],(function(e){return e.right&&Object(g.b)(["flex-direction:row-reverse;"])}),S,(function(e){return e.right?L:T})),q=g.c.div.withConfig({displayName:"PrevNextPostItem__Text",componentId:"u4u2kx-2"})(["flex:1;display:flex;flex-direction:column;align-items:",";line-height:1;min-width:0;",";.description{font-size:0.75rem;font-weight:bold;color:",";}h3{",";width:100%;font-size:1.125rem;color:",";line-height:1.15;margin:0;margin-top:0.5rem;","{font-size:1rem;}",";}"],(function(e){return e.right?"flex-end":"flex-start"}),(function(e){return e.right?Object(g.b)(["margin-left:1rem;"]):Object(g.b)(["margin-right:1rem;"])}),b.a.gray[7],(function(e){return e.right?Object(g.b)(["margin-left:1rem;text-align:right;"]):Object(g.b)(["margin-right:1rem;"])}),b.a.gray[7],h.a.small,O.a),A=function(e){var t=e.right,r=e.seriesPost,a=e.lang;if(!r)return null;var n=""+r.slug;return o.a.createElement(W,{right:t,to:n},o.a.createElement(S,null,t?o.a.createElement(P.c,null):o.a.createElement(P.a,null)),o.a.createElement(q,{right:t},o.a.createElement("div",{className:"description"},t?"ko"===a?"다음":"Next":"ko"===a?"이전":"Previous"," ","ko"===a?"포스트":"Post"),o.a.createElement("h3",null,r.title)))},D=g.c.div.withConfig({displayName:"PrevNextPost__Wrapper",componentId:"sc-1i8zxj4-0"})(["width:100%;margin-top:5rem;display:flex;align-items:space-between;justify-content:space-between;margin-left:auto;margin-right:auto;","{flex-direction:column-reverse;}"],Object(h.b)(767)),R=g.c.div.withConfig({displayName:"PrevNextPost__ItemWrapper",componentId:"sc-1i8zxj4-1"})(["width:300px;","{width:100%;& + &{margin-bottom:1.5rem;}}"],Object(h.b)(767)),V=function(e){var t=e.nowPostTitle,r=e.seriesList,a=e.lang,n=r.length,l=Object(i.useCallback)((function(){for(var e=r.length,a=0;a<e;a++)if(r[a].title===t)return a;return 0}),[t,r,n])();return o.a.createElement(D,null,o.a.createElement(R,null,o.a.createElement(A,{seriesPost:l>0?r[l-1]:null,right:!1,lang:a})),o.a.createElement(R,null,o.a.createElement(A,{seriesPost:l<n-1?r[l+1]:null,right:!0,lang:a})))},M=g.c.div.withConfig({displayName:"TagList__TagItemWrapper",componentId:"sc-1ja74mt-0"})(["padding:0.5rem 1rem;background-color:",";color:",";border-radius:0.5rem;margin-right:1rem;margin-bottom:0.5rem;&:hover{}","{font-size:0.8rem;}"],b.a.gray[1],b.a.indigo[8],h.a.custom(1056)),U=Object(i.memo)((function(e){var t=e.tag,r=e.onClick;return o.a.createElement(M,{onClick:function(){return r(t)}},t)})),X=g.c.div.withConfig({displayName:"TagList__TagListWrapper",componentId:"sc-1ja74mt-1"})(["width:100%;display:flex;flex-wrap:wrap;margin-bottom:2rem;"]),F=function(e){var t=e.tags,r=e.onClick;return o.a.createElement(X,null,t.map((function(e,t){return o.a.createElement(U,{tag:e,key:t,onClick:r})})))},B=Object(i.memo)(F),H=g.c.div.withConfig({displayName:"PostViewer__PostViewerWrapper",componentId:"sc-1vcgubz-0"})(["width:60%;margin-left:0;max-width:972px;","{width:80%;}","{width:100%;}.category{text-decoration:none;font-size:1.5rem;color:gray;margin-bottom:0;&:hover{text-decoration:underline;}","{font-size:1rem;}}.title{margin-top:0.5rem;font-size:3rem;","{font-size:2.2rem;}}.date{line-height:0.8;color:gray;","{font-size:0.8rem;}}.adsense-block{width:100%;}"],h.a.custom(1440),h.a.custom(1056),h.a.custom(1056),h.a.custom(1056),h.a.custom(1056)),G=g.c.div.withConfig({displayName:"PostViewer__PostContentWrapper",componentId:"sc-1vcgubz-1"})(["width:100%;margin:0;word-break:break-all;a{color:",";text-decoration:none;&:hover{text-decoration:underline;}}h1{margin-top:3rem;","{margin-top:2rem;font-size:1.8rem;}}h2{margin-top:3rem;","{margin-top:2rem;}}h3{margin-top:2rem;","{margin-top:1rem;}}p{font-size:1.1rem;line-height:1.8;","{font-size:0.9rem;line-height:1.7;}}li{font-size:1.1rem;line-height:2;","{font-size:0.9rem;line-height:1.7;}h4,p{margin:0;font-size:1.1rem;","{font-size:0.9rem;line-height:1.7;}}}pre,code{font-size:1rem;margin-bottom:2rem;","{font-size:0.9rem;margin-bottom:1.5rem;}}pre{border-radius:3px;}img{width:100%;}table{white-space:normal;max-width:100%;border-collapse:collapse;text-align:left;line-height:1.5;border-top:1px solid #ccc;border-bottom:1px solid #ccc;margin:20px 0;}table thead th{min-width:60px;max-width:150px;padding:10px;font-weight:bold;vertical-align:top;color:#fff;background:",";margin:20px 10px;}table tbody th{max-width:150px;padding:10px;}table td{max-width:350px;padding:10px;vertical-align:top;}table tr:nth-child(even){background:",";}th{font-size:0.9rem;","{font-size:0.8rem;}}td{font-size:0.9rem;","{font-size:0.8rem;}}hr{margin-top:3rem;margin-bottom:3rem;","{margin-top:2rem;margin-bottom:2rem;}}blockquote{background-color:",";width:100%;margin:0;padding-top:0.5rem;padding-bottom:0.5rem;border-left:4px solid ",";p{margin-left:2rem;margin-right:2rem;}}"],b.a.indigo[6],h.a.custom(767),h.a.custom(767),h.a.custom(767),h.a.custom(767),h.a.custom(767),h.a.custom(767),h.a.custom(767),b.a.indigo[6],b.a.indigo[0],h.a.custom(767),h.a.custom(767),h.a.custom(767),b.a.gray[0],b.a.indigo[5]),J=function(e){var t=e.post,r=e.series,a=e.seriesList,n=e.lang,l=t.html,m=t.title,c=t.released_at,s=t.updated_at,d=t.category,g=t.tags,u=Object(i.useCallback)((function(e){}),[g]);return o.a.createElement(H,null,d&&o.a.createElement(E.a,{className:"category",to:"ko"===n?"/?category="+d:"/en?category="+d},k.b[d]?o.a.createElement("img",{src:k.b[d].src}):"["+d+"]"),o.a.createElement("h1",{className:"title"},m),o.a.createElement("p",{className:"date"},"ko"===n?"게시: ":"",Object(O.b)(c,n)),s&&o.a.createElement("p",{className:"date"},"ko"===n?"수정: ":"Last edited at ",Object(O.b)(s,n)),g&&o.a.createElement(B,{tags:g,onClick:u}),"none"!==r&&o.a.createElement(I,{series:r,seriesList:a,nowPostTitle:m,lang:n}),o.a.createElement(G,{id:"content-container",dangerouslySetInnerHTML:{__html:l}}),o.a.createElement(_.a,{style:{display:"block",textAlign:"center"},adClient:"ca-pub-3926462216067158",adSlot:"6864119577",adFormat:"fluid",adLayout:"in-article"}),o.a.createElement(V,{nowPostTitle:m,seriesList:a,lang:n}))},Y=r("1Yd/");var Z=g.c.div.withConfig({displayName:"Utterances__Wrapper",componentId:"sc-1m6k9q3-0"})(["width:60%;margin-left:auto;margin-right:auto;","{width:100%;}"],Object(h.b)(1056)),K=o.a.memo((function(e){!function(e){if(null==e)throw new TypeError("Cannot destructure undefined")}(e);var t=Object(i.createRef)();return Object(i.useLayoutEffect)((function(){var e=document.createElement("script"),r={src:"https://utteranc.es/client.js",repo:"millo-L/millo-L.github.io","issue-term":"pathname",label:"comment",theme:"github-light",crossOrigin:"anonymous",async:"true"};Object.entries(r).forEach((function(t){var r=t[0],a=t[1];e.setAttribute(r,a)})),t.current.appendChild(e)}),[]),o.a.createElement(Z,{ref:t})}));K.displayName="Utterances";var Q,$=K,ee=r("NgyL");Object(g.a)(Q||(Q=Object(n.a)(['\n    body {\n        font-family: "ELAND", serif;\n    }\n'])));t.default=function(e){var t=e.data,r=t.markdownRemark,a=t.site,n=t.allMarkdownRemark;if(!(r&&a&&n))return o.a.createElement("div",null);var g=Object(i.useCallback)((function(){var e=n.edges,t=[];return e.map((function(e){var r=e.node,a={title:r.frontmatter.title,lang:r.frontmatter.lang,slug:r.fields.slug};t.push(a)})),t}),[n]);return o.a.createElement(p,null,o.a.createElement(Y.a,{title:r.frontmatter.title,description:r.frontmatter.description,date:r.frontmatter.released_at,url:a.siteMetadata.siteUrl+r.fields.slug,image:r.frontmatter.image.childImageSharp.fluid.src,lang:r.frontmatter.lang}),o.a.createElement(m.a,{lang:r.frontmatter.lang,ko_to:"ko"===r.frontmatter.lang?"#":r.frontmatter.translation,en_to:"en"===r.frontmatter.lang?"#":r.frontmatter.translation}),o.a.createElement(d.a,{style:{marginTop:"2rem"}},o.a.createElement(s.a,{style:{marginBottom:"2rem"}},o.a.createElement(c.a,{style:{marginTop:"0.5rem"},type:"body",categoryVisible:!0,lang:r.frontmatter.lang}),o.a.createElement(J,{post:Object.assign({},r.frontmatter,{html:r.html}),series:r.frontmatter.series,seriesList:Object(ee.b)(g(),r.frontmatter.lang),lang:r.frontmatter.lang}),o.a.createElement(x,{tableOfContents:r.tableOfContents})),o.a.createElement($,null),o.a.createElement(l.a,null)))}}}]);
//# sourceMappingURL=component---src-components-post-post-page-tsx-6e5f2e2730520eae2434.js.map