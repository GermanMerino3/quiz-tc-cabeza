let idx = 0, slice = 0, score = 0, ayudaUsada = false; const reviewed = new Set();
const ayudasPedidas = new Set();
const $ = (id) => document.getElementById(id);
const norm = (s) => (s||"").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\/.\- ]/g," ").replace(/\s+/g," ").trim();
const num = (s) => ((s||"").match(/[\d.,]+/g)||[]).map(x=>x.replace(",",".")).join(" ");
function matchPatologia(user, list){ const u = norm(user); if(!u) return false; return list.some(a=>{ a=norm(a); return u===a||(u.length>3&&a.length>3&&(u.includes(a)||a.includes(u))); }); }
function matchCampo(user, expected){
  if(expected==="—") return ["—","-","no aplica","n/a","na","sin contraste","no"].includes(norm(user)) || norm(user)==="";
  const u=norm(user), e=norm(expected);
  if(!u) return false;
  if(u===e) return true;
  const un=num(u), en=num(e);
  if(un && en && un===en) return true;
  if(e.includes("-") && un && e.split("-").map(num).includes(un)) return true;
  if(e.includes("/") && u.includes("/")){
    const es=e.split("/").map(s=>num(s)).sort().join("/"), us=u.split("/").map(s=>num(s)).sort().join("/");
    if(es&&es===us) return true;
  }
  if(e.length>4 && (u.includes(e)||e.includes(u))) return true;
  if(e.includes("alta resolucion") && (u.includes("oseo")||u.includes("hueso")||u.includes("alta resolucion"))) return true;
  if((e.includes("estandar")||e.includes("standard")) && (u.includes("estandar")||u.includes("standard")||u.includes("blando")||u.includes("std")||u.includes("b30"))) return true;
  if(u==="si"&&e.startsWith("si")) return true;
  if(u==="no"&&e==="no") return true;
  return false;
}
function protocoloBase(key){ return ({ "senos-con":"senos","facial-con":"facial","oido-con":"oido" })[key] || key; }
function setImg(){
  const c=CASES[idx];
  // Un solo corte representativo por caso (no mezclar pacientes distintos)
  const list=[c.images[0]];
  slice=0;
  const img=$("caseImg"); $("imgErr").hidden=true;
  img.onerror=()=>{ // fallback a Special:FilePath si falla el directo
    if(!img.dataset.fb){ img.dataset.fb="1"; img.src=FALLBACK(c.fallback); }
    else $("imgErr").hidden=false;
  };
  img.dataset.fb=""; img.src=list[slice];
  const r=$("sliceRange"); r.max=Math.max(0,list.length-1); r.value=slice;
  $("sliceLabel").textContent=`${slice+1} / ${list.length}`;
  document.querySelector(".slice-bar").style.display = list.length<=1 ? "none" : "flex";
}
function render(){
  const c=CASES[idx]; slice=0; setImg();
  $("caseTitle").textContent=c.titulo; $("caseId").textContent="???";
  $("credit").textContent="Wikimedia Commons CC BY-SA";
  $("studyBox").hidden=true;
  ayudaUsada=false; $("btnAyuda").disabled=false; $("ayudaBox").hidden=true; $("ayudaBox").textContent="";
  $("clinicaTxt").textContent=(typeof CLINICA!=="undefined"&&CLINICA[c.id])?CLINICA[c.id]:"Sin antecedentes registrados.";
  $("counter").textContent=`Caso ${idx+1} / ${CASES.length}`;
  $("bar").style.width=((idx+1)/CASES.length*100)+"%";
  ["inPatologia","f-espesor","f-filtro","f-tiempoRot","f-colimacion","f-scan","f-fov","f-ventana","f-matriz","f-kv","f-mas","f-centraje","f-escanograma","f-posicion","f-limites","f-velocidad","f-volumen","f-delay","f-via"].forEach(id=>{$(id).value="";$(id).classList.remove("ok","bad");});
  $("selProtocolo").value=""; $("f-contraste").value="";
  $("selProtocolo").classList.remove("ok","bad");$("f-contraste").classList.remove("ok","bad");
  document.querySelectorAll(".fb").forEach(d=>{d.textContent="";d.className="fb";});
  $("summary").textContent="";
}
function setFb(inputId,fbId,ok,esperado,puesto){
  const inp=$(inputId), fb=$(fbId);
  inp.classList.remove("ok","bad"); fb.classList.remove("ok","bad");
  if(ok){inp.classList.add("ok");fb.classList.add("ok");fb.textContent="✓ Correcto";return true;}
  inp.classList.add("bad");fb.classList.add("bad");
  fb.textContent=`✗ Esperado: ${esperado} | Colocado: ${puesto||"(vacío)"}`;return false;
}
function check(){
  const c=CASES[idx], P=PROTOCOLOS[c.protocoloKey];
  let ok=0, total=0;
  total++; if(setFb("inPatologia","fb-patologia",matchPatologia($("inPatologia").value,c.patologia),c.patologia[0],$("inPatologia").value))ok++;
  const sel=$("selProtocolo").value;
  const protOk = sel && (sel===c.protocoloKey || sel===protocoloBase(c.protocoloKey));
  const expLabel = P.label; total++;
  if(setFb("selProtocolo","fb-protocolo",!!protOk,expLabel,$("selProtocolo").selectedOptions[0]?.text))ok++;
  const F=[["f-espesor","fb-espesor",P.espesor],["f-filtro","fb-filtro",P.filtro],["f-tiempoRot","fb-tiempoRot",P.tiempoRot],["f-colimacion","fb-colimacion",P.colimacion],["f-scan","fb-scan",P.scan],["f-fov","fb-fov",P.fov],["f-ventana","fb-ventana",P.ventana],["f-matriz","fb-matriz",P.matriz],["f-kv","fb-kv",P.kv],["f-mas","fb-mas",P.mas],["f-centraje","fb-centraje",P.centraje],["f-escanograma","fb-escanograma",P.escanograma],["f-posicion","fb-posicion",P.posicion],["f-limites","fb-limites",P.limites],["f-contraste","fb-contraste",P.contraste],["f-velocidad","fb-velocidad",P.velocidad],["f-volumen","fb-volumen",P.volumen],["f-delay","fb-delay",P.delay],["f-via","fb-via",P.via]];
  for(const [i,f,e] of F){total++; if(setFb(i,f,matchCampo($(i).value,e),e,$(i).value))ok++;}
  $("summary").innerHTML=`<b>${ok}/${total} correctas (${Math.round(ok/total*100)}%)</b> · Patología: <b>${c.patologia[0]}</b> · Protocolo: <b>${P.label}</b>${ayudaUsada?" · <i>Ayuda usada</i>":""}`;
  $("caseId").textContent=c.id; $("credit").textContent=c.credito;
  $("studyBox").hidden=false; $("radioLink").href=c.link; $("radioLink").textContent=`abrir referencia ${c.id}`;
  if(!reviewed.has(c.id)){reviewed.add(c.id);$("done").textContent=reviewed.size;}
  score+=ok; $("score").textContent=score;
}
$("btnCheck").onclick=check;
$("btnAyuda").onclick=()=>{
  const c=CASES[idx];
  ayudaUsada=true; ayudasPedidas.add(c.id);
  const b=$("ayudaBox"); b.hidden=false;
  b.textContent=`Ayuda: la patología de este caso es “${c.patologia[0]}”. Escríbela en la pregunta 1 si quieres validar ese campo.`;
  $("btnAyuda").disabled=true;
};
$("btnNext").onclick=()=>{idx=(idx+1)%CASES.length;render();};
$("btnPrev").onclick=()=>{idx=(idx-1+CASES.length)%CASES.length;render();};
$("btnRandom").onclick=()=>{idx=Math.floor(Math.random()*CASES.length);render();};
$("slicePrev").onclick=()=>{slice--;setImg();};
$("sliceNext").onclick=()=>{slice++;setImg();};
$("sliceRange").oninput=(e)=>{slice=parseInt(e.target.value,10);setImg();};
$("imgWrap").addEventListener("wheel",(e)=>{e.preventDefault(); slice+=e.deltaY>0?1:-1; setImg();},{passive:false});
$("imgWrap").addEventListener("click",(e)=>{ if(e.target.id!=="btnRetry") e.currentTarget.classList.toggle("zoom"); });
$("btnRetry").onclick=()=>setImg();
render();
