import"./base-bflHmD82.js";import{E as v}from"./el-button-4r8E0DMI.js";import{d as k,R as m,m as p,z as S,s as b,a as r,b as s,e as w,w as C,g as i,F as D,r as N,j as T,S as V,o as l,f as z,x as E,t as f,a7 as I,a8 as j}from"./index-DpTwNufQ.js";import{d as B}from"./dayjs.min-L5X7G0Fc.js";import{u as L}from"./pyRunner-BGu6GbCt.js";import{_ as O}from"./plugin-vueexport-helper-DlAUqK2U.js";import"./index-Xv_KeUan.js";import"./commonjsHelpers-Cpj98o6Y.js";import"https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";const F=o=>(I("data-v-d25abaa1"),o=o(),j(),o),H={class:"flex flex-col flex-1"},M={class:"flex mb-2 items-center justify-end"},P={key:0,class:"log"},A=F(()=>s("h4",null,"输出",-1)),J=["datetime"],R=k({__name:"index",setup(o){const{runPythonAsync:_}=L({stdout:e=>{a.push({t:Date.now(),text:e,type:"normal"})},stderr:e=>{a.push({t:Date.now(),text:e,type:"error"})}});m.defineTheme("darkTheme",{base:"vs-dark",inherit:!0,rules:[{token:"",background:"#141414"}],colors:{"editor.background":"#141414"}}),m.setTheme("darkTheme");let t;const d=p(),h=async()=>{var e;t&&((e=t.dispose)==null||e.call(t)),d.value&&(t=m.create(d.value,{value:`print(1 + 2)
1 + 1`,language:"python",theme:V().value?"darkTheme":"vs",foldingStrategy:"indentation",selectOnLineNumbers:!0,roundedSelection:!1,readOnly:!1,cursorStyle:"line",automaticLayout:!0,glyphMargin:!1,fontSize:15}))},a=S([]),c=p(!1),y=()=>{a.length=0,c.value=!0;const e=t.getValue();_(e).then(u=>{u&&a.push({t:Date.now(),text:u,type:"normal"})}).finally(()=>{c.value=!1})};return b(async()=>{h()}),(e,u)=>{const x=v;return l(),r("div",H,[s("div",M,[w(x,{type:"primary",size:"small",loading:i(c),onClick:y},{default:C(()=>[z("运行")]),_:1},8,["loading"])]),s("div",{ref_key:"editorContainer",ref:d,class:"flex flex-1 h-0"},null,512),i(a).length?(l(),r("div",P,[A,s("ul",null,[(l(!0),r(D,null,N(i(a),(n,g)=>(l(),r("li",{key:g,class:E(n.type)},[s("time",{datetime:new Date(n.t).toJSON()},f(i(B)(n.t).format("HH:mm:ss")),9,J),s("code",null,f(n.text),1)],2))),128))])])):T("",!0)])}}}),$=O(R,[["__scopeId","data-v-d25abaa1"]]);export{$ as default};