(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{E6GP:function(e,t,a){"use strict";var r=a("Wbzz"),n=a("q1tI"),i=a.n(n),l=a("NgyL"),o=a("vOnD"),c=a("tP0u"),m=a("4BEc"),d=a("3V0p"),s=a("mLdW"),p=a("VyIv"),u=o.c.div.withConfig({displayName:"PostCard__Wrapper",componentId:"sc-1rmjhp2-0"})(["width:20rem;background:white;border-radius:4px;box-shadow:0 4px 16px 0 rgba(0,0,0,0.04);transition:0.25s box-shadow ease-in,0.25s transform ease-in;margin:1rem;overflow:hidden;display:flex;flex-direction:column;","{width:calc(33% - 1.8125rem);}","{width:calc(33% - 1.9rem);}","{width:calc(50% - 2rem);}","{margin:0;width:100%;& + &{margin-top:1rem;}}&:hover{transform:translateY(-8px);box-shadow:0 12px 20px 0 rgba(0,0,0,0.08);","{transform:none;}}"],Object(c.b)(1919),Object(c.b)(1440),Object(c.b)(1056),Object(c.b)(767),Object(c.b)(1024)),b=Object(o.c)(r.a).withConfig({displayName:"PostCard__StyledLink",componentId:"sc-1rmjhp2-1"})(["display:block;color:inherit;text-decoration:none;"]),g=o.c.div.withConfig({displayName:"PostCard__Content",componentId:"sc-1rmjhp2-2"})(["padding:1rem;display:flex;flex:1;flex-direction:column;background-color:white;z-index:3;h4{font-size:1rem;margin:0;margin-bottom:0.25rem;line-height:1.5;word-break:break-word;"," color:",";","{white-space:initial;}}.description-wrapper{flex:1;}p{margin:0;word-break:break-word;overflow-wrap:break-word;font-size:0.875rem;line-height:1.5;"," color:",";margin-bottom:1.5rem;}.sub-info{font-size:0.75rem;line-height:1.5;color:",";}"],s.a,d.a.gray[9],Object(c.b)(767),(function(e){return e.clamp&&Object(o.b)(["height:3.9375rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;"])}),d.a.gray[7],d.a.gray[6]),h=function(e){var t=e.post;return i.a.createElement(u,null,t.image&&i.a.createElement(b,{to:""+t.path},i.a.createElement(p.a,{widthRatio:2,heightRatio:1,fluid:t.image})),i.a.createElement(g,{clamp:!t.image},i.a.createElement(b,{to:""+t.path},i.a.createElement("h4",null,t.title),i.a.createElement("div",{className:"description-wrapper"},i.a.createElement("p",null,t.description.replace(/&#x3A;/g,":"),150===t.description.length&&"..."))),i.a.createElement(b,{to:""+t.path},i.a.createElement("div",{className:"sub-info"},i.a.createElement("span",null,Object(s.b)(t.released_at,t.lang)),t.updated_at&&i.a.createElement(i.a.Fragment,null,i.a.createElement("br",null),i.a.createElement("span",null,"ko"===t.lang?"수정: ":"Last edited at"," ",Object(s.b)(t.updated_at,t.lang)))))))},f=Object(n.memo)(h),w=o.c.div.withConfig({displayName:"PostCardGrid__Wrapper",componentId:"sc-1gs2gbh-0"})(["display:flex;margin:-1rem;flex-wrap:wrap;","{margin:0;}.adsense-block{width:100%;}"],Object(c.b)(767)),y=function(e){var t=e.posts;return i.a.createElement(w,null,i.a.createElement("div",{className:"adsense-block"},i.a.createElement(m.a,{style:{display:"block"},adClient:"ca-pub-3926462216067158",adSlot:"5178668661",adFormat:"auto",fullWidthResponsive:"true"})),i.a.createElement(m.a,{style:{display:"block"},adClient:"ca-pub-3926462216067158",adSlot:"2564307139",adFormat:"fluid",adLayout:"-6o+ci+43-j+3"}),i.a.createElement(m.a,{style:{display:"block"},adClient:"ca-pub-3926462216067158",adSlot:"2707777362",adFormat:"fluid",adLayout:"7b+db+1c+f+3o"}),t.map((function(e,t){return i.a.createElement(f,{post:e,key:t})})))},v=Object(n.memo)(y),E=a("cr+I"),k=a.n(E),x=a("YwZP"),j=function(e){var t=e.lang,a=Object(x.useLocation)(),n=a.search&&k.a.parse(a.search),o=Object(r.c)("590453294");if(!o.allMarkdownRemark)return i.a.createElement("div",null);var c=o.allMarkdownRemark;return i.a.createElement(v,{posts:n.category?Object(l.a)(Object(l.b)(Object(l.c)(c),t),n.category):Object(l.b)(Object(l.c)(c),t)})};t.a=Object(n.memo)(j)},Hv9S:function(e,t,a){"use strict";a.r(t);var r,n=a("MUpH"),i=a("q1tI"),l=a.n(i),o=a("vOnD"),c=a("Awrt"),m=a("ARf/"),d=a("rniq"),s=a("VsHj"),p=a("4MQu"),u=a("2gU5"),b=a("lD4s"),g=a("DTjW"),h=(a("E6GP"),a("xImv")),f=a("cr+I"),w=a.n(f),y=a("YwZP"),v=a("1Yd/");a("RGc2"),a("4BEc");Object(o.a)(r||(r=Object(n.a)(['\n    body {\n        font-family: "ELAND", serif;\n    }\n'])));t.default=function(){var e=Object(y.useLocation)(),t=(e.search&&w.a.parse(e.search),Object(i.useState)(1)),a=t[0],r=t[1],n=Object(i.useState)(!0),o=n[0],f=n[1];Object(i.useCallback)((function(e){r(e),f(!(e>0))}),[]);return l.a.createElement(g.a,null,l.a.createElement(v.a,{title:"Series"}),l.a.createElement(m.a,{lang:"ko",ko_to:"#",en_to:"/en/series"}),l.a.createElement(c.a,{page:a,lang:"ko"}),l.a.createElement(b.a,null,l.a.createElement(p.a,{page:a,setUser:!1,lang:"ko"}),l.a.createElement(u.a,null,l.a.createElement(d.a,{type:"body",categoryVisible:o,lang:"ko"}),l.a.createElement(s.a,null,l.a.createElement(h.a,{lang:"ko"})))))}},NgyL:function(e,t,a){"use strict";a.d(t,"c",(function(){return r})),a.d(t,"a",(function(){return n})),a.d(t,"b",(function(){return i})),a.d(t,"d",(function(){return l}));var r=function(e){var t=[];return e.edges.map((function(e){var a=e.node.frontmatter,r={path:e.node.fields.slug,title:a.title,description:a.description,released_at:a.released_at,updated_at:a.updated_at,image:a.image?a.image.childImageSharp.fluid:null,lang:a.lang,category:a.category};t.push(r)})),t},n=function(e,t){return e.filter((function(e){return e.category===t}))};function i(e,t){return e.filter((function(e){return e.lang===t}))}var l=function(e){for(var t=[],a=e.group,r=a.length,n=0;n<r;n++){var i=a[n].nodes[0].frontmatter,l={path:"/series/"+a[n].fieldValue.replace(/ /gi,"-"),title:a[n].fieldValue,image:i.image?i.image.childImageSharp.fluid:null,updated_at:i.released_at,totalCount:a[n].totalCount,lang:i.lang};t.push(l)}return t}},VyIv:function(e,t,a){"use strict";var r=a("q1tI"),n=a.n(r),i=a("vOnD"),l=a("9eSz"),o=a.n(l),c=a("tP0u"),m=i.c.div.withConfig({displayName:"RatioImage__RatioImageBlock",componentId:"zeahpg-0"})(["width:100%;max-height:12.5rem;display:flex;align-items:center;z-index:1;","{max-height:100%;}.ratio-img{position:absolute;top:0;left:0;width:100%;height:100%;max-height:100%;display:block;object-fit:cover;}"],Object(c.b)(767)),d=function(e){e.widthRatio,e.heightRatio;var t=e.fluid,a=e.style;return n.a.createElement(m,{style:a},n.a.createElement(o.a,{className:"ratio-img",fluid:t}))};t.a=Object(r.memo)(d)},xImv:function(e,t,a){"use strict";var r=a("Wbzz"),n=a("q1tI"),i=a.n(n),l=a("NgyL"),o=a("vOnD"),c=a("tP0u"),m=a("4BEc"),d=a("3V0p"),s=a("mLdW"),p=a("VyIv"),u=o.c.div.withConfig({displayName:"SeriesCard__Wrapper",componentId:"sc-283h86-0"})(["width:42rem;background:white;border-radius:4px;box-shadow:0 4px 16px 0 rgba(0,0,0,0.04);transition:0.25s box-shadow ease-in,0.25s transform ease-in;margin:1rem;overflow:hidden;display:flex;flex-direction:column;","{width:calc(50% - 2rem);}","{margin:0;width:100%;& + &{margin-top:1rem;}}&:hover{transform:translateY(-8px);box-shadow:0 12px 20px 0 rgba(0,0,0,0.08);","{transform:none;}}"],Object(c.b)(1919),Object(c.b)(767),Object(c.b)(1024)),b=Object(o.c)(r.a).withConfig({displayName:"SeriesCard__StyledLink",componentId:"sc-283h86-1"})(["display:block;color:inherit;text-decoration:none;"]),g=o.c.div.withConfig({displayName:"SeriesCard__Content",componentId:"sc-283h86-2"})(["padding:1rem;display:flex;flex:1;flex-direction:column;background-color:white;z-index:3;h4{font-size:1rem;margin:0;margin-bottom:0.25rem;line-height:1.5;word-break:break-word;"," color:",";","{white-space:initial;}}.description-wrapper{flex:1;}p{margin:0;word-break:break-word;overflow-wrap:break-word;font-size:0.875rem;line-height:1.5;"," color:",";margin-bottom:1.5rem;}.sub-info{font-size:0.75rem;line-height:1.5;color:",";.separator{margin-left:0.25rem;margin-right:0.25rem;}}"],s.a,d.a.gray[9],Object(c.b)(767),(function(e){return e.clamp&&Object(o.b)(["height:3.9375rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;"])}),d.a.gray[7],d.a.gray[6]),h=function(e){var t=e.series;return i.a.createElement(u,null,t.image&&i.a.createElement(b,{to:""+t.path},i.a.createElement(p.a,{widthRatio:2,heightRatio:1,fluid:t.image,style:{maxHeight:"16rem"}})),i.a.createElement(g,{clamp:!t.image},i.a.createElement(b,{to:""+t.path},i.a.createElement("h4",null,t.title)),i.a.createElement(b,{to:""+t.path},i.a.createElement("div",{className:"sub-info"},i.a.createElement("span",null,t.totalCount,"ko"===t.lang?"개의 포스트":" posts"),i.a.createElement("span",{className:"separator"},"·"),i.a.createElement("span",null,"ko"===t.lang?"마지막 업데이트":"Last edited at"," ",Object(s.b)(t.updated_at,t.lang))))))},f=Object(n.memo)(h),w=o.c.div.withConfig({displayName:"SeriesCardGrid__Wrapper",componentId:"sc-1lv080d-0"})(["display:flex;margin:-1rem;flex-wrap:wrap;","{margin:0;}.adsense-block{width:100%;}"],Object(c.b)(767)),y=function(e){var t=e.seriesList;return i.a.createElement(w,null,i.a.createElement("div",{className:"adsense-block"},i.a.createElement(m.a,{style:{display:"block"},adClient:"ca-pub-3926462216067158",adSlot:"1239423651",adFormat:"auto",fullWidthResponsive:"true"})),t.map((function(e,t){return i.a.createElement(f,{series:e,key:t})})))},v=Object(n.memo)(y),E=function(e){var t=e.lang,a=Object(r.c)("847611873").allMarkdownRemark;return a?i.a.createElement(v,{seriesList:Object(l.b)(Object(l.d)(a),t)}):i.a.createElement("div",null)};t.a=Object(n.memo)(E)}}]);
//# sourceMappingURL=component---src-pages-series-tsx-7c30be13d692269e2014.js.map