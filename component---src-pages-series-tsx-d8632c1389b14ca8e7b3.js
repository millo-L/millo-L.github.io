(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{Hv9S:function(e,t,a){"use strict";a.r(t);var n,r=a("MUpH"),i=a("q1tI"),l=a.n(i),o=a("vOnD"),c=a("Awrt"),s=a("ARf/"),m=a("rniq"),d=a("VsHj"),u=a("4MQu"),p=a("2gU5"),g=a("lD4s"),f=a("DTjW"),b=a("xImv"),h=a("cr+I"),w=a.n(h),v=a("YwZP"),y=a("1Yd/");a("RGc2");Object(o.a)(n||(n=Object(r.a)(['\n    body {\n        font-family: "ELAND", serif;\n    }\n'])));t.default=function(){var e=Object(v.useLocation)(),t=(e.search&&w.a.parse(e.search),Object(i.useState)(1)),a=t[0],n=t[1],r=Object(i.useState)(!0),o=r[0],h=r[1];Object(i.useCallback)((function(e){n(e),h(!(e>0))}),[]);return l.a.createElement(f.a,null,l.a.createElement(y.a,{title:"Series"}),l.a.createElement(s.a,{lang:"ko",ko_to:"#",en_to:"/en/series"}),l.a.createElement(c.a,{page:a,lang:"ko"}),l.a.createElement(g.a,null,l.a.createElement(u.a,{page:a,setUser:!1,lang:"ko"}),l.a.createElement(p.a,null,l.a.createElement(m.a,{type:"body",categoryVisible:o,lang:"ko"}),l.a.createElement(d.a,null,l.a.createElement(b.a,{lang:"ko"})))))}},NgyL:function(e,t,a){"use strict";a.d(t,"c",(function(){return n})),a.d(t,"a",(function(){return r})),a.d(t,"b",(function(){return i})),a.d(t,"d",(function(){return l}));var n=function(e){var t=[];return e.edges.map((function(e){var a=e.node.frontmatter,n={path:e.node.fields.slug,title:a.title,description:a.description,released_at:a.released_at,updated_at:a.updated_at,image:a.image?a.image.childImageSharp.fluid:null,lang:a.lang,category:a.category};t.push(n)})),t},r=function(e,t){return e.filter((function(e){return e.category===t}))};function i(e,t){return e.filter((function(e){return e.lang===t}))}var l=function(e){for(var t=[],a=e.group,n=a.length,r=0;r<n;r++){var i=a[r].nodes[0].frontmatter,l={path:"/series/"+a[r].fieldValue.replace(/ /gi,"-"),title:a[r].fieldValue,image:i.image?i.image.childImageSharp.fluid:null,updated_at:i.released_at,totalCount:a[r].totalCount,lang:i.lang};t.push(l)}return t}},VyIv:function(e,t,a){"use strict";var n=a("q1tI"),r=a.n(n),i=a("vOnD"),l=a("9eSz"),o=a.n(l),c=a("tP0u"),s=i.c.div.withConfig({displayName:"RatioImage__RatioImageBlock",componentId:"zeahpg-0"})(["width:100%;max-height:12.5rem;display:flex;align-items:center;z-index:1;","{max-height:100%;}.ratio-img{position:absolute;top:0;left:0;width:100%;height:100%;max-height:100%;display:block;object-fit:cover;}"],Object(c.b)(767)),m=function(e){e.widthRatio,e.heightRatio;var t=e.fluid,a=e.style;return r.a.createElement(s,{style:a},r.a.createElement(o.a,{className:"ratio-img",fluid:t}))};t.a=Object(n.memo)(m)},xImv:function(e,t,a){"use strict";var n=a("Wbzz"),r=a("q1tI"),i=a.n(r),l=a("NgyL"),o=a("vOnD"),c=a("tP0u"),s=a("4BEc"),m=a("3V0p"),d=a("mLdW"),u=a("VyIv"),p=o.c.div.withConfig({displayName:"SeriesCard__Wrapper",componentId:"sc-283h86-0"})(["width:42rem;background:white;border-radius:4px;box-shadow:0 4px 16px 0 rgba(0,0,0,0.04);transition:0.25s box-shadow ease-in,0.25s transform ease-in;margin:1rem;overflow:hidden;display:flex;flex-direction:column;","{width:calc(50% - 2rem);}","{margin:0;width:100%;& + &{margin-top:1rem;}}&:hover{transform:translateY(-8px);box-shadow:0 12px 20px 0 rgba(0,0,0,0.08);","{transform:none;}}"],Object(c.b)(1919),Object(c.b)(767),Object(c.b)(1024)),g=Object(o.c)(n.a).withConfig({displayName:"SeriesCard__StyledLink",componentId:"sc-283h86-1"})(["display:block;color:inherit;text-decoration:none;"]),f=o.c.div.withConfig({displayName:"SeriesCard__Content",componentId:"sc-283h86-2"})(["padding:1rem;display:flex;flex:1;flex-direction:column;background-color:white;z-index:3;h4{font-size:1rem;margin:0;margin-bottom:0.25rem;line-height:1.5;word-break:break-word;"," color:",";","{white-space:initial;}}.description-wrapper{flex:1;}p{margin:0;word-break:break-word;overflow-wrap:break-word;font-size:0.875rem;line-height:1.5;"," color:",";margin-bottom:1.5rem;}.sub-info{font-size:0.75rem;line-height:1.5;color:",";.separator{margin-left:0.25rem;margin-right:0.25rem;}}"],d.a,m.a.gray[9],Object(c.b)(767),(function(e){return e.clamp&&Object(o.b)(["height:3.9375rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;"])}),m.a.gray[7],m.a.gray[6]),b=function(e){var t=e.series;return i.a.createElement(p,null,t.image&&i.a.createElement(g,{to:""+t.path},i.a.createElement(u.a,{widthRatio:2,heightRatio:1,fluid:t.image,style:{maxHeight:"16rem"}})),i.a.createElement(f,{clamp:!t.image},i.a.createElement(g,{to:""+t.path},i.a.createElement("h4",null,t.title)),i.a.createElement(g,{to:""+t.path},i.a.createElement("div",{className:"sub-info"},i.a.createElement("span",null,t.totalCount,"ko"===t.lang?"개의 포스트":" posts"),i.a.createElement("span",{className:"separator"},"·"),i.a.createElement("span",null,"ko"===t.lang?"마지막 업데이트":"Last edited at"," ",Object(d.b)(t.updated_at,t.lang))))))},h=Object(r.memo)(b),w=o.c.div.withConfig({displayName:"SeriesCardGrid__Wrapper",componentId:"sc-1lv080d-0"})(["display:flex;margin:-1rem;flex-wrap:wrap;","{margin:0;}.adsense-block{width:100%;}"],Object(c.b)(767)),v=function(e){var t=e.seriesList;return i.a.createElement(w,null,i.a.createElement("div",{className:"adsense-block"},i.a.createElement(s.a,{style:{display:"block"},adClient:"ca-pub-3926462216067158",adSlot:"1239423651",adFormat:"auto",fullWidthResponsive:"true"})),t.map((function(e,t){return i.a.createElement(h,{series:e,key:t})})))},y=Object(r.memo)(v),k=function(e){var t=e.lang,a=Object(n.c)("847611873").allMarkdownRemark;return a?i.a.createElement(y,{seriesList:Object(l.b)(Object(l.d)(a),t)}):i.a.createElement("div",null)};t.a=Object(r.memo)(k)}}]);
//# sourceMappingURL=component---src-pages-series-tsx-d8632c1389b14ca8e7b3.js.map