(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{"1A6O":function(e,t,a){"use strict";a.r(t);var n,r=a("MUpH"),i=a("q1tI"),o=a.n(i),l=a("NgyL"),s=a("vOnD"),d=a("tP0u"),m=a("3V0p"),c=a("mLdW"),g=a("VyIv"),p=a("Wbzz"),u=s.c.div.withConfig({displayName:"SeriesPost__Wrapper",componentId:"i23o6y-0"})(["width:100%;background:white;border-radius:4px;box-shadow:0 4px 16px 0 rgba(0,0,0,0.04);transition:0.25s box-shadow ease-in,0.25s transform ease-in;margin-top:2rem;overflow:hidden;display:flex;flex-direction:column;&:hover{transform:translateY(-8px);box-shadow:0 12px 20px 0 rgba(0,0,0,0.08);","{transform:none;}}h2{margin-left:1rem;margin-top:1.5rem;","{font-size:1.3rem;}}img{border-top:1px solid ",";}"],Object(d.b)(1024),d.a.custom(1056),m.a.gray[2]),f=s.c.div.withConfig({displayName:"SeriesPost__Content",componentId:"i23o6y-1"})(["padding:1rem;display:flex;flex:1;flex-direction:column;h4{font-size:1rem;margin:0;margin-bottom:0.25rem;line-height:1.5;word-break:break-word;"," color:",";","{white-space:initial;}}.description-wrapper{flex:1;}p{margin:0;word-break:break-word;overflow-wrap:break-word;font-size:0.875rem;line-height:1.5;color:",";margin-bottom:1.5rem;}.sub-info{font-size:0.75rem;line-height:1.5;color:",";}"],c.a,m.a.gray[9],Object(d.b)(767),m.a.gray[7],m.a.gray[6]),h=Object(s.c)(p.a).withConfig({displayName:"SeriesPost__StyledLink",componentId:"i23o6y-2"})(["display:block;color:inherit;text-decoration:none;"]),b=function(e){var t=e.post,a=e.index;return o.a.createElement(u,null,o.a.createElement(h,{to:""+t.path},o.a.createElement("h2",null,a+1,". ",t.title)),t.image&&o.a.createElement(h,{to:""+t.path},o.a.createElement(g.a,{widthRatio:2,heightRatio:1,fluid:t.image,style:{maxHeight:"100%"}})),o.a.createElement(f,null,o.a.createElement(h,{to:""+t.path},o.a.createElement("div",{className:"description-wrapper"},o.a.createElement("p",null,t.description.replace(/&#x3A;/g,":"),150===t.description.length&&"..."))),o.a.createElement(h,{to:""+t.path},o.a.createElement("div",{className:"sub-info"},o.a.createElement("span",null,Object(c.b)(t.released_at,t.lang)),t.updated_at&&o.a.createElement(o.a.Fragment,null,o.a.createElement("br",null),o.a.createElement("span",null,"ko"===t.lang?"수정: ":"Last edited at ",Object(c.b)(t.updated_at,t.lang)))))))},w=Object(i.memo)(b),y=s.c.div.withConfig({displayName:"SeriesPostList__Wrapper",componentId:"sc-17k9ls6-0"})(["display:flex;margin:-1rem;width:40%;flex-wrap:wrap;margin-left:auto;margin-right:auto;margin-top:3rem;","{width:50%;}","{width:100%;}","{margin:0;}.series-header{width:100%;border-bottom:1px solid ",";h1{","{font-size:1.4rem;}}h3{width:3.4rem;color:",";border-bottom:4px solid ",";","{font-size:1rem;border-bottom:3px solid ",";width:3rem;}}}"],Object(d.b)(1440),Object(d.b)(1056),Object(d.b)(767),m.a.gray[3],d.a.custom(1056),m.a.indigo[7],m.a.indigo[7],d.a.custom(1056),m.a.indigo[7]),v=function(e){var t=e.posts,a=e.series,n=e.lang;return o.a.createElement(y,null,o.a.createElement("div",{className:"series-header"},o.a.createElement("h3",null,"ko"===n?"시리즈":"Series"),o.a.createElement("h1",null,a)),t.map((function(e,t){return o.a.createElement(w,{post:e,index:t,key:t})})))},E=Object(i.memo)(v),x=a("DTjW"),_=a("ARf/"),j=a("lD4s"),O=a("BfNy"),k=a("1Yd/");a("RGc2");Object(s.a)(n||(n=Object(r.a)(['\n    body {\n        font-family: "ELAND", serif;\n    }\n'])));var I=function(e){var t,a=e.data,n=a.allMarkdownRemark,r=a.site;return n&&r?o.a.createElement(x.a,null,o.a.createElement(k.a,{title:n.edges[0].node.frontmatter.series,url:r.siteMetadata.siteUrl+"/"+n.edges[0].node.frontmatter.series.replace(/ /gi,"-"),lang:n.edges[0].node.frontmatter.lang,date:n.edges[0].node.frontmatter.released_at,image:n.edges[0].node.frontmatter.image.childImageSharp.fluid.src,description:(t=n.edges[0].node.frontmatter.series,"WebRTC 이론부터 실전까지"===t?"WebRTC의 이론을 먼저 공부하고 이론을 기반으로 구현을 해보자.":"WebRTC theory to practice"===t?"Let's study the theory of WebRTC first and implement it based on theory.":void 0)}),o.a.createElement(_.a,{lang:n.edges[0].node.frontmatter.lang,ko_to:"ko"===n.edges[0].node.frontmatter.lang?"#":"none"!==n.edges[0].node.frontmatter.translation_series?"/series"+n.edges[0].node.frontmatter.translation_series:"#",en_to:"en"===n.edges[0].node.frontmatter.lang?"#":"none"!==n.edges[0].node.frontmatter.translation_series?"/series"+n.edges[0].node.frontmatter.translation_series:"#"}),o.a.createElement(j.a,null,o.a.createElement(E,{posts:Object(l.b)(Object(l.c)(n),n.edges[0].node.frontmatter.lang),series:n.edges[0].node.frontmatter.series,lang:n.edges[0].node.frontmatter.lang}),o.a.createElement(O.a,null))):o.a.createElement("div",null)};t.default=Object(i.memo)(I)},BfNy:function(e,t,a){"use strict";var n=a("q1tI"),r=a.n(n),i=a("vOnD"),o=a("3V0p"),l=a("oXGY"),s=i.c.div.withConfig({displayName:"Footer__FooterWrapper",componentId:"sc-11i4h0w-0"})(["display:flex;border-top:1px solid ",";margin-top:5rem;width:100%;height:8rem;align-items:center;justify-content:center;flex-direction:column;span{font-size:1.5rem;}.icon-wrapper{width:9rem;display:flex;justify-content:space-between;flex-direction:row;margin-top:1rem;svg{width:30%;height:1.5rem;cursor:pointer;}}"],o.a.gray[5]);t.a=function(){return r.a.createElement(s,null,r.a.createElement("span",null,"millo's tech blog"),r.a.createElement(l.a,{className:"icon-wrapper"}))}},DTjW:function(e,t,a){"use strict";var n,r=a("MUpH"),i=a("q1tI"),o=a.n(i),l=a("vOnD"),s=a("3V0p"),d=(a("RGc2"),Object(l.a)(n||(n=Object(r.a)(["\n    body {\n        background: ",';\n        font-family: "ELAND", serif;\n    }\n'])),s.a.gray[0]));var m=l.c.div.withConfig({displayName:"MainTemplate__Wrapper",componentId:"sc-18rja6p-0"})([""]);t.a=function(e){var t=e.children;return o.a.createElement(o.a.Fragment,null,o.a.createElement(d,null),o.a.createElement(m,null,t))}},NgyL:function(e,t,a){"use strict";a.d(t,"c",(function(){return n})),a.d(t,"a",(function(){return r})),a.d(t,"b",(function(){return i})),a.d(t,"d",(function(){return o}));var n=function(e){var t=[];return e.edges.map((function(e){var a=e.node.frontmatter,n={path:e.node.fields.slug,title:a.title,description:a.description,released_at:a.released_at,updated_at:a.updated_at,image:a.image?a.image.childImageSharp.fluid:null,lang:a.lang,category:a.category};t.push(n)})),t},r=function(e,t){return e.filter((function(e){return e.category===t}))};function i(e,t){return e.filter((function(e){return e.lang===t}))}var o=function(e){for(var t=[],a=e.group,n=a.length,r=0;r<n;r++){var i=a[r].nodes[0].frontmatter,o={path:"/series/"+a[r].fieldValue.replace(/ /gi,"-"),title:a[r].fieldValue,image:i.image?i.image.childImageSharp.fluid:null,updated_at:i.released_at,totalCount:a[r].totalCount,lang:i.lang};t.push(o)}return t}},VyIv:function(e,t,a){"use strict";var n=a("q1tI"),r=a.n(n),i=a("vOnD"),o=a("9eSz"),l=a.n(o),s=a("tP0u"),d=i.c.div.withConfig({displayName:"RatioImage__RatioImageBlock",componentId:"zeahpg-0"})(["width:100%;max-height:12.5rem;display:flex;align-items:center;z-index:1;","{max-height:100%;}.ratio-img{position:absolute;top:0;left:0;width:100%;height:100%;max-height:100%;display:block;object-fit:cover;}"],Object(s.b)(767)),m=function(e){e.widthRatio,e.heightRatio;var t=e.fluid,a=e.style;return r.a.createElement(d,{style:a},r.a.createElement(l.a,{className:"ratio-img",fluid:t}))};t.a=Object(n.memo)(m)}}]);
//# sourceMappingURL=component---src-components-series-series-post-list-page-tsx-f074949e72486c43f366.js.map