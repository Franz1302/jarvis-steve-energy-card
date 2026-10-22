/* JARVIS Steve Energie – eigenständige, grundrisstreue Overlay-Karte.
 * Neue Implementierung anhand der live ausgelesenen JARVIS-Energiekarte 1.2.17.
 * V6.1 Edge-Safe: identische Wege, Werte und Geometrie; weniger teure SVG-Filter bei gleichzeitigen Animationen.
 * HUD-Anordnung aus V3: Haus links oben, PV links unter Panelen,
 * Netz rechts oben, Monats-/Cashflow-Leiste außen unten.
 * Alle HUDs bleiben dynamisch und klickbar, keine HUD-Texte im PNG.
 * Alle 27 Original-Datenfelder sind in der YAML-Konfiguration erhalten.
 * Fehlende / ungeprüfte Quellen niemals auf 0 setzen oder erfinden.
 */
const JARVIS_STEVE_FIELDS = [
  'pv','house','imp','exp','meter','pvDay','gridImportDay','exportDay',
  'houseDay','autonomyDay','selfDay','cost','evn','network','revenue','cash',
  'monthImport','main','sun','monthExport','pvMonth','houseMonth',
  'autonomyMonth','selfMonth','rate','snap','tariff'
];
const JARVIS_STEVE_ROOMS = [
  ['leony','Leony',676,176],
  ['shirly','Shirly',1021,263],
  ['esszimmer','Esszimmer',674,400],
  ['kueche','Küche',613,538],
  ['schlafzimmer','Schlafzimmer',591,685],
  ['abstellraum','Abstellraum',1019,423],
  ['treppenhaus','Treppenhaus',1009,523],
  ['badezimmer','Badezimmer',1012,626],
  ['josey','Josey',982,756],
  ['flur','Flur',833,486],
  ['garten','Garten',1255,715]
];
// V5: 11 EINZELLE Verbindungen je Quelle (22 dynamische Raumleitungen).
// Jeder Pfad beginnt am selben markierten physikalischen Anschlusspunkt.
// Der Garten ist die 11. bereits bestehende Verbraucherzone und KEIN Innenraum.
// Die getrennten PV-/Netz-Wege folgen soweit geometrisch möglich den Fugen
// des gepflasterten Außenbereichs; nur die Flur-Wege laufen innen entlang der Flurfugen.
const JARVIS_STEVE_SOURCES = { pv:[317,330], grid:[1467,403] };
const JARVIS_STEVE_EXTERNAL_ROUTES = {
  "leony": {
    "pv": "M317 330 L348.3 322.9 Q361 320 366.3 308.1 L376.7 284.9 Q382 273 381.9 260 L381.1 190 Q381 177 394 175.9 L428 173.1 Q441 172 454 172 L550 172",
    "grid": "M1467 403 L1382.4 343.1 Q1371 335 1358 329.8 L1283 300.2 Q1270 295 1268.7 281.1 L1251.3 96.9 Q1250 83 1243.8 70.4 L1230.2 42.6 Q1224 30 1210 30 L370 30 Q356 30 356.3 44 L358.7 174 Q359 188 373 187.8 L421 187.2 Q435 187 449 187 L550 187"
  },
  "esszimmer": {
    "pv": "M317 330 L372 329.2 Q385 329 396.8 334.4 L404.2 337.6 Q416 343 429 343 L548 343",
    "grid": "M1467 403 L1381 369.1 Q1368 364 1355.8 357.2 L1285.2 317.8 Q1273 311 1272.2 297 L1260.8 96 Q1260 82 1250.3 71.9 L1224.7 45.1 Q1215 35 1201 35 L364 35 Q350 35 350.1 49 L351.9 347 Q352 361 366 361 L436 361 Q450 361 464 361 L548 361"
  },
  "kueche": {
    "pv": "M317 330 L351.4 354.5 Q362 362 362.2 375 L363.8 486 Q364 499 375.3 505.5 L385.7 511.5 Q397 518 410 518.2 L465 519",
    "grid": "M1467 403 L1385 452.7 Q1373 460 1362.2 468.9 L1290.8 528.1 Q1280 537 1278.4 550.9 L1251.6 777.1 Q1250 791 1239.3 800.1 L1220.7 815.9 Q1210 825 1196 825 L409 825 Q395 825 383 817.8 L349 797.2 Q337 790 337.2 776 L339.8 549 Q340 535 354 534.8 L395 534.2 Q409 534 423 534 L465 534"
  },
  "schlafzimmer": {
    "pv": "M317 330 L344.8 357.8 Q354 367 353.9 380 L352.1 659.3 Q352 672 361.2 680.8 L365.8 685.2 Q375 694 387.7 693.6 L432 692",
    "grid": "M1467 403 L1381.1 468.5 Q1370 477 1360.8 487.6 L1281.2 579.4 Q1272 590 1271.5 604 L1265.5 778 Q1265 792 1254.4 801.1 L1240.6 812.9 Q1230 822 1216 822.1 L410 827.9 Q396 828 385.4 818.9 L354.4 792.3 Q347 786 344.9 776.5 L343.1 768.5 Q341 759 350.7 758.8 L386.1 758.2 Q398 758 409.9 758 L432 758"
  },
  "shirly": {
    "pv": "M317 330 L357.2 294.6 Q367 286 368 273 L380 117 Q381 104 383.3 91.2 L388.7 60.8 Q391 48 404 48 L1146 48 Q1159 48 1168 57.4 L1188 78.6 Q1197 88 1197 101 L1197 146 Q1197 159 1184 159 L1109 159",
    "grid": "M1467 403 L1383.7 347.7 Q1372 340 1361.3 330.9 L1280.7 262.1 Q1270 253 1267.3 239.3 L1254.7 173.7 Q1252 160 1238 160 L1184 160 Q1170 160 1156 159.8 L1109 159"
  },
  "abstellraum": {
    "pv": "M317 330 L359.4 294.4 Q369.4 286 370.5 273 L383.1 117 Q384.2 104 386.4 91.2 L391.2 63.6 Q393.4 50.8 406.4 50.8 L1154 50.8 Q1167 50.8 1176.3 59.9 L1195.7 78.9 Q1205 88 1205 101 L1205 398 Q1205 411 1192 411 L1127 411",
    "grid": "M1467 403 L1385.8 388.5 Q1372 386 1358.2 388.2 L1280.9 400.3 Q1270 402 1260.9 408.3 L1253.1 413.7 Q1244 420 1233 419.2 L1127 411"
  },
  "treppenhaus": {
    "pv": "M317 330 L361.9 294.1 Q372.1 286 373.2 273 L386.7 117 Q387.8 104 389.9 91.2 L394 66.8 Q396.1 54 409.1 54 L1163 54 Q1176 54 1185.7 62.6 L1204.3 79.3 Q1214 88 1214 101 L1214 504 Q1214 517 1201 517 L1132 517",
    "grid": "M1467 403 L1382.6 424.5 Q1369 428 1356.7 434.6 L1286.1 472.5 Q1274 479 1268.4 491.6 L1263.6 502.4 Q1258 515 1244.2 515.2 L1132 517"
  },
  "badezimmer": {
    "pv": "M317 330 L351.5 379.3 Q359 390 358.8 403 L353.2 770 Q353 783 359.9 794 L371.1 812 Q378 823 391 823 L1192 823 Q1205 823 1206.7 810.1 L1228.3 643.9 Q1230 631 1217 631 L1138 631",
    "grid": "M1467 403 L1388.7 440 Q1376 446 1366.2 456 L1287.8 536 Q1278 546 1275.3 559.7 L1264.7 613.3 Q1262 627 1248 627.5 L1138 631"
  },
  "josey": {
    "pv": "M317 330 L352.6 379.5 Q360.2 390 360 403 L355.6 770 Q355.4 783 361.4 794.5 L372 814.8 Q378 826.3 391 826.3 L1198 826.3 Q1211 826.3 1215.5 814.1 L1231.5 770.2 Q1236 758 1223 758 L1158 758",
    "grid": "M1467 403 L1389 449.8 Q1377 457 1366.8 466.6 L1290.2 538.4 Q1280 548 1278.8 561.9 L1263.2 744.1 Q1262 758 1248 758 L1158 758"
  },
  "garten": {
    "pv": "M317 330 L350.6 378.3 Q358 389 357.7 402 L350.3 766 Q350 779 357.8 789.4 L377.2 815.6 Q385 826 398 826 L1285 825 Q1298 825 1309.2 818.4 L1357 790",
    "grid": "M1467 403 L1424.6 482.6 Q1418 495 1416.9 509 L1401.1 705 Q1400 719 1392.7 731 L1357 790"
  },
  "flur": {
    "pv": "M317 330 L363.5 288.6 Q371 282 371.6 272 L381.4 106 Q382 96 386 86.8 L395 66.2 Q399 57 409 57 L867 57 Q877 57 880.5 66.4 L883.5 74.6 Q887 84 887 94 L887 200 Q887 210 877.8 213.8 L862.2 220.2 Q853 224 853 234 L853 484.8 Q853 487 853.8 489 L855 492",
    "grid": "M1467 403 L1367.6 318.1 Q1357 309 1350.8 296.4 L1261.2 114.6 Q1255 102 1250.5 88.7 L1233.5 38.3 Q1229 25 1215 25 L930 25 Q916 25 911.4 38.2 L898.6 74.8 Q894 88 893.5 102 L890.3 201.3 Q890 212 882 219 L875 225 Q867 232 867 242.7 L867 481.3 Q867 486 862.8 488.1 L855 492"
  }
};
const JARVIS_STEVE_WALL_EDGES = {
  "leony": "M558 90 L558 288 L775 288 M558 88 L876 88 M778 285 L778 215",
  "shirly": "M906 91 L906 209 M911 92 L1092 92 L1098 207 M902 225 L902 337 L1108 337",
  "esszimmer": "M557 307 L557 440 M557 305 L774 305 M555 441 L766 441",
  "kueche": "M472 452 L745 452 L745 573 L469 573 L469 455",
  "schlafzimmer": "M441 593 L752 593 L752 803 L441 803 L441 593",
  "abstellraum": "M906 353 L1116 353 L1116 444 L905 444",
  "treppenhaus": "M905 462 L1123 462 L1125 544 L905 544",
  "badezimmer": "M904 557 L1135 557 L1135 667 L904 667",
  "josey": "M783 691 L1149 691 L1149 800 L784 800 L784 691",
  "flur": "M777 228 L777 438 M770 460 L770 656 M892 230 L892 664",
  "garten": "M1297 798 Q1336 807 1362 798"
};
const JARVIS_STEVE_DETAILS = [
  ['cost','Stromkosten brutto'],['evn','Energiekosten'],['network','Netzkosten'],
  ['revenue','PV-Einspeiseertrag'],['cash','Energie-Cashflow'],
  ['monthImport','Netzbezug gesamt'],['main','Netzbezug Hauptzeit'],
  ['sun','Netzbezug Sonnenzeit'],['monthExport','Einspeisung Monat'],
  ['pvMonth','PV-Produktion Monat'],['houseMonth','Hausverbrauch Monat'],
  ['autonomyMonth','Autarkie Monat'],['selfMonth','Eigenverbrauch Monat'],
  ['rate','Einspeisepreis'],['snap','SNAP aktiv'],['tariff','Tarifstatus'],
  ['gridImportDay','Netzbezug heute'],['exportDay','Einspeisung heute'],
  ['pvDay','PV-Produktion heute'],['houseDay','Verbrauch heute'],
  ['autonomyDay','Autarkie heute'],['selfDay','Eigenverbrauch heute']
];
const JARVIS_STEVE_ICONS = {
  sun: '<circle cx="0" cy="0" r="13"/><path d="M0 -29V-21M0 21V29M-29 0H-21M21 0H29M-21 -21L-16 -16M21 21L16 16M-21 21L-16 16M21 -21L16 -16"/>',
  grid: '<path d="M0 -31L-21 31M0 -31L21 31M-14 -7H14M-18 10H18M-22 31H22M-12 -7L16 11M12 -7L-16 11M-17 10L18 31M17 10L-18 31"/>',
  home: '<path d="M-27 -3L0 -28L27 -3M-20 -10V25H-6V3H9V25H20V-10"/>',
  coins: '<ellipse cx="-10" cy="-9" rx="17" ry="6"/><path d="M-27 -9V12Q-10 24 7 12V-9M-27 0Q-10 11 7 0"/><ellipse cx="16" cy="8" rx="14" ry="6"/><path d="M2 8V24Q16 34 30 24V8"/>',
  leaf: '<path d="M25 -26C-22 -21 -29 1 -17 19C5 28 25 4 25 -26ZM-25 27L11 -8"/>',
  cal: '<rect x="-25" y="-20" width="50" height="44" rx="3"/><path d="M-25 -8H25M-13 -27V-15M13 -27V-15M-14 2H14M-14 13H14"/>'
};
class JarvisSteveEnergyCard extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});this._config=null;this._hass=null;this._preview=false;this._showRoomPoints=false;this._lastFocus=null;this._autoRoomCache={};this._registryIdentity=null;this._tariffLocalKey='jarvis_steve_energy_tariffs_v1';this._tariffFeedback='';}
  setConfig(config){
    if(!config || typeof config!=='object')throw new Error('steve-energy-card: YAML-Konfiguration fehlt');
    const e=config.entities||{};
    this._config={...config,entities:Object.fromEntries(JARVIS_STEVE_FIELDS.map(k=>[k,typeof e[k]==='string'&&e[k]?e[k]:null])),rooms:config.rooms||{},flow_threshold_w:Number(config.flow_threshold_w ?? 10),animations:config.animations!==false,grid_sign_verified:config.grid_sign_verified===true,auto_discover_rooms:config.auto_discover_rooms!==false,auto_switch_activity:config.auto_switch_activity!==false,area_map:config.area_map||{},exclude_entities:config.exclude_entities||[],tariff_helpers:{import:config.tariff_helpers?.import||'input_number.steve_bezugstarif_ct',export:config.tariff_helpers?.export||'input_number.steve_einspeisetarif_ct'}};
    if(!Number.isFinite(this._config.flow_threshold_w)||this._config.flow_threshold_w<0)throw new Error('flow_threshold_w muss >= 0 sein');
    // The image is rendered in the SVG coordinate system, not stretched independently on the host.
    this.style.backgroundImage='none';this._render();this._registryIdentity=null;this._syncDiscovery();if(this._hass)this._update();
  }
  set hass(hass){this._hass=hass;this._syncDiscovery();this._update();} get hass(){return this._hass;} getCardSize(){return 1;}
  connectedCallback(){this._clock();this._clockTimer=setInterval(()=>this._clock(),15000);this._visibility=()=>this._pause();document.addEventListener('visibilitychange',this._visibility);this._pause();}
  disconnectedCallback(){clearInterval(this._clockTimer);document.removeEventListener('visibilitychange',this._visibility);}
  _state(key){const id=this._config?.entities[key];return id?this._hass?.states?.[id]:null;}
  _roomStates(key){
    const explicit=this._config?.rooms?.[key]||{power:[],activity:[]};
    if(!this._config?.auto_discover_rooms)return explicit;
    const found=this._autoRoomCache[key]||{power:[],activity:[]};
    const power=[...new Set([...(explicit.power||[]),...found.power])];
    const activity=[...(explicit.activity||[]),...found.activity];
    return {power,activity};
  }
  // Home Assistants eigene Area/Device/Entity-Registries sind die einzige Quelle
  // für automatische Raumzuordnung. Neue Geräte kommen beim nächsten HA-Update dazu.
  _syncDiscovery(){
    const h=this._hass,c=this._config;
    if(!c?.auto_discover_rooms||!h?.areas||!h?.entities||!h?.devices){this._autoRoomCache={};return;}
    if(this._registryIdentity?.areas===h.areas&&this._registryIdentity?.entities===h.entities&&this._registryIdentity?.devices===h.devices)return;
    this._registryIdentity={areas:h.areas,entities:h.entities,devices:h.devices};
    const normalized=t=>String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'');
    const aliases={kueche:['küche','kueche','kitchen'],flur:['flur','gang','hallway'],garten:['garten','outdoor'],treppenhaus:['treppenhaus','stiegenhaus'],esszimmer:['esszimmer','essecke'],schlafzimmer:['schlafzimmer']};
    const roomAreas={};
    for(const [key,label] of JARVIS_STEVE_ROOMS){
      const override=c.area_map?.[key];
      let matched=Object.values(h.areas).find(a=>override&&(a.area_id===override||normalized(a.name)===normalized(override)));
      if(!matched)matched=Object.values(h.areas).find(a=>[key,label,...(aliases[key]||[])].some(t=>normalized(t)===normalized(a.name)||a.aliases?.some(x=>normalized(x)===normalized(t))));
      if(matched)roomAreas[key]=matched.area_id;
    }
    const areaFor=entry=>{
      if(entry.area_id)return entry.area_id;
      let d=h.devices[entry.device_id],depth=0;
      while(d&&depth++<4){if(d.area_id)return d.area_id;d=d.parent_device_id?h.devices[d.parent_device_id]:null;}
      return null;
    };
    const skip=new Set(c.exclude_entities||[]),auto={};
    for(const [key,area] of Object.entries(roomAreas)){
      // Ein Messwert je HA-Gerät verhindert doppelte Zählung von 'power' und 'total_power'.
      const byDevice=new Map(),activity=[],explicit=new Set(c.rooms?.[key]?.power||[]);
      const explicitDevices=new Set([...explicit].map(id=>h.entities[id]?.device_id).filter(Boolean));
      for(const [id,e] of Object.entries(h.entities)){
        if(skip.has(id)||e.disabled_by||e.hidden_by||e.entity_category||areaFor(e)!==area)continue;
        const st=h.states?.[id];if(!st)continue;
        const d=e.device_id||id;
        if(id.startsWith('sensor.')){
          const u=String(st.attributes?.unit_of_measurement||'').toLowerCase();
          const n=Number(st.state);
          const powerUnit=['w','kw'].includes(u);
          const klass=st.attributes?.device_class;
          const likely=klass==='power'||(powerUnit&&/(?:^|_)(?:leistung|power|activepower|wirkleistung)(?:_|$)/i.test(id));
          const aggregate=/(?:^|_)(?:pv|solar|inverter|grid|netz|battery|batterie|gesamt|total|house|home|erzeugung|produktion|einspeisung)(?:_|$)/i.test(id);
          if(!powerUnit||!likely||aggregate||explicit.has(id)||explicitDevices.has(e.device_id))continue;
          const score=(klass==='power'?10:0)+(id.endsWith('_leistung')||id.endsWith('_power')?3:0)-(id.includes('total')?10:0);
          const prev=byDevice.get(d);if(!prev||score>prev.score)byDevice.set(d,{id,score});
        }
      }
      const metered=new Set([...byDevice.keys(),...explicitDevices]);
      if(c.auto_switch_activity){
        for(const [id,e] of Object.entries(h.entities)){
          if(skip.has(id)||e.disabled_by||e.hidden_by||areaFor(e)!==area||metered.has(e.device_id||id))continue;
          if(id.startsWith('light.')||id.startsWith('switch.'))activity.push({entity:id,active:['on']});
        }
      }
      auto[key]={power:[...byDevice.values()].map(x=>x.id),activity};
    }
    this._autoRoomCache=auto;
  }
  _tariffHelpers(){return this._config?.tariff_helpers||{};}
  _localTariffs(){try{return JSON.parse(localStorage.getItem(this._tariffLocalKey)||'{}');}catch{return {};}}
  _tariff(which){
    const id=this._tariffHelpers()[which],raw=id?this._hass?.states?.[id]?.state:null;
    const n=raw==null||['unknown','unavailable',''].includes(String(raw).trim().toLowerCase())?NaN:Number(raw);
    if(Number.isFinite(n)&&n>=0&&n<=200)return n;
    const local=this._localTariffs()[which];return Number.isFinite(local)&&local>=0&&local<=200?local:null;
  }
  _tariffInputs(){
    const a=this.shadowRoot.querySelector('#tariff-import'),b=this.shadowRoot.querySelector('#tariff-export');
    if(!a||!b||!this._config)return;
    const input=this._tariff('import'),output=this._tariff('export');
    if(this.shadowRoot.activeElement!==a)a.value=input===null?'':String(input);
    if(this.shadowRoot.activeElement!==b)b.value=output===null?'':String(output);
    const ready=['import','export'].every(k=>!!this._hass?.states?.[this._tariffHelpers()[k]]);
    const status=this.shadowRoot.querySelector('#tariff-state');
    if(status)status.textContent=this._tariffFeedback||(ready?'Tarife werden für alle HA-Geräte gespeichert.':'Ohne die zwei HA-Zahlenhelfer gelten Eingaben zunächst nur in diesem Browser.');
  }
  async _saveTariffs(){
    const read=id=>{const el=this.shadowRoot.getElementById(id);const str=el?.value?.trim()?.replace(',','.');return str===''?NaN:Number(str);};
    const imp=read('tariff-import'),exp=read('tariff-export');
    if(!Number.isFinite(imp)||!Number.isFinite(exp)||imp<0||exp<0||imp>200||exp>200){this._tariffFeedback='Bitte beide Tarife zwischen 0 und 200 ct/kWh eingeben.';this._tariffInputs();return;}
    const pair={import:imp,export:exp},ready=['import','export'].every(k=>!!this._hass?.states?.[this._tariffHelpers()[k]]);
    try{
      if(ready){for(const k of ['import','export'])await this._hass.callService('input_number','set_value',{entity_id:this._tariffHelpers()[k],value:pair[k]});this._tariffFeedback='Tarife in Home Assistant gespeichert.';}
      else{try{localStorage.setItem(this._tariffLocalKey,JSON.stringify(pair));}catch{throw Error('Speicherung im Browser fehlgeschlagen');}this._tariffFeedback='Lokal gespeichert – für geräteweite Speicherung die zwei Zahlenhelfer anlegen.';}
    }catch(e){this._tariffFeedback='Speichern fehlgeschlagen: '+(e?.message||'Unbekannter Fehler');}
    this._tariffInputs();this._update();
  }
  _computedCosts(){
    const buy=this._tariff('import'),sell=this._tariff('export');
    const imported=this._quantity('monthImport','energy'),exported=this._quantity('monthExport','energy');
    const cost=buy!==null&&imported!==null&&imported>=0?imported*buy/100:null;
    const revenue=sell!==null&&exported!==null&&exported>=0?exported*sell/100:null;
    return {cost,revenue,cash:cost!==null&&revenue!==null?revenue-cost:null,rate:sell};
  }
  _number(key){const s=this._state(key);if(!s||s.state==null||['unknown','unavailable','none',''].includes(String(s.state).toLowerCase().trim()))return null;let n=Number(s.state);return Number.isFinite(n)?n:null;}
  _quantity(key,type){const n=this._number(key);if(n===null)return null;const u=String(this._state(key)?.attributes?.unit_of_measurement||'').trim().toLowerCase();const units=type==='power'?{'w':1,'kw':1000,'mw':1000000}:{'kwh':1,'wh':.001,'mwh':1000};return Object.hasOwn(units,u)?n*units[u]:null;}
  _powerValueForEntity(entity){const st=this._hass?.states?.[entity];if(!st||['unknown','unavailable','none',''].includes(String(st.state).toLowerCase()))return null;const v=Number(st.state);const scale={'w':1,'kw':1000,'mw':1000000}[String(st.attributes?.unit_of_measurement||'').trim().toLowerCase()];return Number.isFinite(v)&&Number.isFinite(scale)&&v>=0?v*scale:null;}
  _roomInfo(key){const r=this._roomStates(key);const ids=Array.isArray(r.power)?r.power:[];const values=ids.map(id=>this._powerValueForEntity(id));const hasAny=values.some(v=>v!==null);const incomplete=values.some(v=>v===null);const sum=hasAny?values.reduce((a,b)=>a+(b||0),0):null;const active=(r.activity||[]).some(ent=>{const s=typeof ent==='string'?{entity:ent,active:['on']}:ent;const cur=String(this._hass?.states?.[s.entity]?.state??'').toLowerCase();return (s.active||['on']).some(v=>String(v).toLowerCase()===cur);});return {watts:sum,partial:incomplete,active:active|| (sum!==null&&sum>this._config.flow_threshold_w),mapped:ids.length};}
  _fmt(v,digits=2){return v===null||!Number.isFinite(v)?'—':v.toLocaleString('de-AT',{minimumFractionDigits:digits,maximumFractionDigits:digits});}
  _power(v){if(v===null)return '—';return Math.abs(v)<1000?this._fmt(v,0)+' W':this._fmt(v/1000,2)+' kW';}
  _money(v,sign=false){return v===null?'—':(sign&&v>0?'+':'')+this._fmt(v,2)+' €';}
  _energy(k,d=1){let n=this._quantity(k,'energy');return n===null?'—':this._fmt(n,d)+' kWh';}
  _percent(k,d=0){let n=this._number(k);return n===null?'—':this._fmt(n,d)+' %';}
  _txt(id,v){const n=this.shadowRoot.getElementById(id);if(n&&n.textContent!==String(v))n.textContent=String(v);}
  _flow(id,active,color,reverse){let el=this.shadowRoot.getElementById(id);if(!el)return;el.style.opacity=active?'1':'0';el.style.display=active?'':'none';el.style.color=color||'#17ddff';el.style.setProperty('--reverse',reverse?'reverse':'normal');}
  _clock(){if(!this._config)return;const now=new Date();let tz=this._hass?.config?.time_zone;try{this._txt('clock',now.toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit',...(tz?{timeZone:tz}:{})}));this._txt('date',now.toLocaleDateString('de-AT',{weekday:'short',day:'2-digit',month:'short',year:'numeric',...(tz?{timeZone:tz}:{})}));}catch{}}
  _pause(){this.toggleAttribute('paused',this._config?.animations===false||(typeof document!=='undefined'&&document.hidden));}
  _rect(x,y,w,h,cls='panel',extra=''){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="13" class="${cls}" ${extra}/>`;}
  _txtSvg(id,x,y,size,text,cls='label',anchor='start'){return `<text id="${id}" x="${x}" y="${y}" font-size="${size}" class="${cls}" text-anchor="${anchor}">${text}</text>`;}
  _icon(name,x,y,size=1,col=''){return `<g class="icon ${col}" transform="translate(${x} ${y}) scale(${size})">${JARVIS_STEVE_ICONS[name]}</g>`;}
  _flowMarkup(id,d,cls=''){
    return `<g id="${id}" class="energy-flow ${cls}" style="opacity:0"><g class="pulse"><path class="halo" d="${d}"/><path class="line" d="${d}"/><path class="dash" d="${d}"/></g></g>`;
  }
  _sourceMarkup(kind){const [x,y]=JARVIS_STEVE_SOURCES[kind];return `<g id="${kind}-flow" class="energy-flow ${kind==='grid'?'grid':'solar'} source" style="opacity:0"><circle class="source-ring" cx="${x}" cy="${y}" r="4"/><circle class="source-core" cx="${x}" cy="${y}" r="2.2"/></g>`;}
  _render(){
    const R=JARVIS_STEVE_ROOMS;
    // 11 room flows per source; no separate main-trunk path remaining.
    let flows=this._sourceMarkup('pv')+this._sourceMarkup('grid');
    let walls='';
    R.forEach(([key],i)=>{
      const route=JARVIS_STEVE_EXTERNAL_ROUTES[key];
      flows+=this._flowMarkup(key+'-flow',route.pv,'room solar',i);
      flows+=this._flowMarkup(key+'-grid-flow',route.grid,'room grid',i+11);
    });
    const hotspots=R.map(([key,name,x,y])=>`<g class="room-hit" data-room="${key}" role="button" tabindex="0" aria-label="${name}: Energiedetails"><circle cx="${x}" cy="${y}" r="21" fill="transparent"/><circle cx="${x}" cy="${y}" r="4" class="room-dot"/></g>`).join('');
    const bgUrl=this._config.background_image===false?'':String(this._config.background_image||'/hacsfiles/jarvis-steve-energy-card/Steve_Energie_Background.png').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    let svg=`<svg viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="JARVIS Energieübersicht Steve"><defs>
    <linearGradient id="glass" x1="0" y1="0" x2=".4" y2="1"><stop stop-color="#031c2c" stop-opacity=".94"/><stop offset="1" stop-color="#00101e" stop-opacity=".89"/></linearGradient>
    </defs>
    ${bgUrl?`<image class="house-bg" x="0" y="0" width="1672" height="941" preserveAspectRatio="none" href="${bgUrl}"/>`:''}
    <g class="routes">${flows}</g><g class="room-hotspots">${hotspots}</g>
    <!-- Originale JARVIS-Marke bleibt als Vektor erhalten, am freien oberen Rand. -->
    <g transform="translate(674 -4) scale(.70)"><g class="logo" stroke="#09d7ff" fill="none" stroke-width="3"><path d="M38 54H59Q65 54 65 47V29M83 54L102 30L122 54M142 30H172Q181 30 178 38Q177 42 169 42H143V54M167 42L180 54M199 30L219 54L239 30M260 29V55M319 30H289Q280 30 280 36Q280 42 289 42H310Q318 42 318 48Q318 54 309 54H280"/></g></g>
    ${this._txtSvg('',691,61,11,'SMART HOME. SMART ENERGY.','spaced')}
    ${this._txtSvg('clock',1295,33,23,'—','clock','end')}${this._txtSvg('date',1295,51,12,'—','label','end')}
    <!-- PV-HUD: links unterhalb der frei bleibenden Photovoltaik-Paneele. -->
    <g transform="translate(-6 333) scale(.89 .84)"><g class="hit" data-key="pv" tabindex="0" role="button" aria-label="PV Leistung anzeigen">${this._rect(35,121,331,239)}
    ${this._icon('sun',88,174,.88)}${this._txtSvg('',139,149,19,'PV ANLAGE')}${this._txtSvg('pv',54,240,43,'—','big')}
    ${this._txtSvg('',58,271,17,'Aktuell')}${this._txtSvg('pv-status',170,271,16,'—','good')}
    <circle id="pv-dot" cx="282" cy="267" r="6" fill="#70808a"/>
    <path class="rule" d="M54 281H347M59 330H221M229 282V348"/>
    ${this._txtSvg('',140,313,14,'Kein Tagesverlauf','muted','middle')}${this._txtSvg('',58,349,12,'06:00')}${this._txtSvg('',123,349,12,'12:00')}${this._txtSvg('',198,349,12,'18:00')}
    ${this._txtSvg('',241,298,14,'Produktion heute')}${this._txtSvg('pv-production-today',241,328,23,'—','big')}</g></g>
    <!-- Netz-HUD oben rechts, oberhalb der physischen Smart-Meter-Box. -->
    <g transform="translate(338 -76) scale(.79 .99)">${this._rect(1334,99,309,255)}
    ${this._icon('grid',1383,152,.95)}${this._txtSvg('',1434,140,19,'NETZ / SMART METER')}
    <path class="rule" d="M1435 154H1615M1359 218H1614M1359 290H1614"/>
    <g class="hit" data-key="imp" tabindex="0" role="button" aria-label="Aktueller Netzbezug"><rect x="1430" y="158" width="193" height="62" fill="transparent"/>${this._txtSvg('',1434,179,17,'Aktueller Bezug')}${this._txtSvg('imp',1434,209,33,'—','big gold')}</g>
    <g class="hit" data-key="exp" tabindex="0" role="button" aria-label="Aktuelle Einspeisung"><rect x="1430" y="222" width="193" height="64" fill="transparent"/>${this._txtSvg('',1434,244,17,'Aktuelle Einspeisung')}${this._txtSvg('exp',1434,278,32,'—','big')}</g>
    ${this._txtSvg('',1360,313,17,'Export heute')}${this._txtSvg('export-day',1606,313,18,'—','big','end')}
    ${this._txtSvg('',1360,338,17,'Status')}<circle id="grid-dot" cx="1516" cy="332" r="6" fill="#70808a"/>${this._txtSvg('grid-status',1530,338,17,'—','good')}</g>
    <!-- Hausverbrauch: eigene echte SVG-Karte am oberen linken Bildrand;
         oberhalb der Solarpaneele und der PV-Karte, ohne Haus oder Technik zu verdecken. -->
    <g class="hit" data-key="house" tabindex="0" role="button" aria-label="Hausverbrauch anzeigen">
      ${this._rect(16,8,326,95)}
      ${this._icon('home',47,38,.64)}
      ${this._txtSvg('',85,30,17,'HAUSVERBRAUCH')}
      ${this._txtSvg('house',37,76,31,'—','big')}
      <path class="rule" d="M152 43V91M244 43V91"/>
      ${this._txtSvg('',163,54,12,'Heute')}
      ${this._txtSvg('house-day',163,78,17,'—','big')}
      ${this._txtSvg('',253,54,12,'Autarkie')}
      <circle cx="263" cy="77" r="10" fill="none" stroke="#41616a" stroke-width="2.5"/>
      <circle id="autarky-ring" cx="263" cy="77" r="10" fill="none" stroke="#7dff82" stroke-width="2.5" transform="rotate(-90 263 77)" stroke-dasharray="0 62.83"/>
      ${this._txtSvg('autarky-day',280,82,18,'—','big')}
    </g>
    <!-- Originale Monats-/Wirtschafts-HUDs: aktiver, klickbarer Vektor-Steg am unteren Bildrand. -->
    <g id="bottom-dock" transform="translate(-6 150) scale(.992 .87)">
    ${this._rect(22,794,1628,107)}<path class="rule" d="M271 812V884M520 812V884M765 812V884M1384 812V884"/><path d="M1026 812V885" stroke="#71ff4b" stroke-width="1.4"/>
    <g class="hit" data-key="monthImport" tabindex="0" role="button">${this._icon('cal',71,845,.82)}${this._txtSvg('',120,820,12,'MONAT')}${this._txtSvg('',120,837,16,'Netzbezug')}${this._txtSvg('monthImport',120,865,27,'—','big')}${this._txtSvg('evn',120,887,18,'—','good')}</g>
    <g class="hit" data-key="monthExport" tabindex="0" role="button">${this._icon('grid',313,845,.82,'gold')}${this._txtSvg('',368,820,12,'MONAT')}${this._txtSvg('',368,837,16,'Einspeisung')}${this._txtSvg('monthExport',368,865,27,'—','big')}${this._txtSvg('export-revenue',368,887,18,'—','good')}</g>
    <g class="hit" data-key="cost" tabindex="0" role="button">${this._icon('coins',578,844,.82,'gold')}${this._txtSvg('',624,820,12,'MONAT')}${this._txtSvg('',624,837,16,'Stromkosten')}${this._txtSvg('cost',624,865,27,'—','big')}${this._txtSvg('effective-rate',624,887,16,'—','good')}</g>
    <g class="hit" data-key="revenue" tabindex="0" role="button">${this._icon('leaf',808,845,.83,'green')}${this._txtSvg('',860,820,12,'MONAT')}${this._txtSvg('',860,837,16,'PV-Ertrag')}${this._txtSvg('',927,837,12,'(Einspeisung)')}${this._txtSvg('revenue',860,865,27,'—','big')}${this._txtSvg('rate',860,887,16,'—','good')}</g>
    <g id="cash-hud" class="hit" data-key="cash" tabindex="0" role="button">${this._rect(1068,798,305,102,'cash-bg')}<rect x="1068" y="798" width="305" height="102" rx="13" class="cash-border"/>${this._icon('coins',1106,842,.79,'green')}${this._txtSvg('',1152,820,12,'WIRTSCHAFT','green')}${this._txtSvg('',1152,837,16,'Energie-Cashflow')}${this._txtSvg('cash',1152,873,38,'—','big green')}${this._txtSvg('',1152,891,15,'Diesen Monat')}</g>
    ${this._icon('leaf',1426,844,.8)}${this._txtSvg('',1473,827,12,'SAUBERE ENERGIE')}${this._txtSvg('self-month',1473,858,31,'—','big')}${this._txtSvg('',1473,874,14,'Eigenversorgung (Monat)')}
    </g>
    <text id="preview-badge" x="837" y="19" class="demo-label" text-anchor="middle" visibility="hidden">NUR FLUSS-VORSCHAU – KEINE MESSWERTE</text>
    </svg>`;
    this.shadowRoot.innerHTML=`<style>
:host{display:block;position:relative;width:100%;height:100%;aspect-ratio:1672/941;background-repeat:no-repeat;color:#63e4ff;font-family:'Arial Narrow','Roboto Condensed',Arial,sans-serif;--cyan:#51e7ff}
*{box-sizing:border-box}svg{width:100%;height:100%;display:block;overflow:hidden}.house-bg{pointer-events:none}svg text{fill:currentColor;font-weight:400;letter-spacing:.13px;pointer-events:none}.big{font-weight:700;filter:drop-shadow(0 0 4px #0ff6)}.label{fill:#9bdfff}.muted{fill:#6794a6}.gold{color:#ffb738}.green{color:#8fff73}.good{fill:#7ceefe}.spaced{letter-spacing:3px;fill:#02d1ff}.clock{letter-spacing:1px}
.panel{fill:url(#glass);stroke:#08d6fc;stroke-width:1.2;filter:drop-shadow(0 0 5px #00bfff55)}.rule{stroke:#077b9d;stroke-width:.8;fill:none}.icon{fill:none;stroke:currentColor;stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 6px currentColor)}.cash-bg{fill:#063025ee;stroke:#69ef87}.cash-border{fill:none;stroke:#69ef87;stroke-width:1.3;filter:drop-shadow(0 0 7px #63fa83)}
/* V6.3: Originale JARVIS-Linienformen und Bewegung, mit statischem weichem Halo ohne SVG-Blur. */
.energy-flow{--duration:2.2s;--reverse:normal;color:#10ddff;pointer-events:none;transition:opacity .4s ease}
.energy-flow.grid{color:#ff4055}
.energy-flow path{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}
.energy-flow .halo{stroke-width:15;opacity:.28;animation:energy-halo 2.2s ease-in-out infinite}
.energy-flow .line{stroke-width:3.8;opacity:.95}
.energy-flow .dash{stroke:#edffff !important;stroke-width:5.2;stroke-dasharray:18 30 4 30;animation:energy-travel var(--duration) linear infinite;animation-direction:var(--reverse)}
.energy-flow .pulse{animation:energy-pulse 2.2s ease-in-out infinite}
.energy-flow .source-ring{fill:none;stroke:currentColor;stroke-width:1.2;opacity:.55}
.energy-flow .source-core{fill:currentColor;opacity:.68}
.room-hit{cursor:pointer}.room-dot{fill:#13c7eb;opacity:0}.room-hit:hover .room-dot,.room-hit:focus .room-dot{opacity:.95;filter:drop-shadow(0 0 10px #7ff)}
.hit{cursor:pointer}.hit:hover .panel,.hit:focus-visible .panel{stroke:#9cf9ff;stroke-width:2.5}.hit:focus-visible,.room-hit:focus-visible{outline:none;filter:drop-shadow(0 0 8px #c4ffff)}.demo-label{font-size:16px;letter-spacing:1.8px;fill:#ffbf6d}
/* Originale JARVIS-Fließ- und Pulszeiten; Halo bleibt zur Edge-Entlastung ungefiltert. */
@keyframes energy-travel{from{stroke-dashoffset:0}to{stroke-dashoffset:-82}}
@keyframes energy-pulse{0%,100%{opacity:.72}50%{opacity:1}}
@keyframes energy-halo{0%,100%{opacity:.22}50%{opacity:.36}}
:host([paused]) .dash,:host([paused]) .pulse,:host([paused]) .halo{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){.energy-flow .dash,.energy-flow .pulse,.energy-flow .halo{animation:none}}.dialog{position:absolute;inset:8% 17%;padding:2.5%;z-index:5;background:#001522f6;border:1px solid #2bdfff;border-radius:12px;box-shadow:0 0 30px #0097d965;color:#b8efff;overflow:auto;font-size:clamp(12px,1.3vw,20px)}.dialog[hidden]{display:none}.dialog h2{font-size:1.2em;letter-spacing:1px;color:#7eeeff;margin:0 3em .6em 0}.dialog button{font:inherit;background:#002733;color:#b8efff;border:1px solid #168aaa;border-radius:5px;cursor:pointer}.dialog .close{position:absolute;right:3%;top:4%;padding:.2em .6em}.details{display:grid;grid-template-columns:1fr auto;gap:0 .8em}.details .label-cell,.details .value-cell{border-bottom:1px solid #16434f;padding:.28em 0}.details .label-cell{background:transparent;border-top:0;border-left:0;border-right:0;text-align:left}.details .value-cell{text-align:right}.footnote{font-size:.75em;color:#84b5c5;line-height:1.45}.tariff-panel{border:1px solid #18546c;border-radius:8px;padding:12px;margin-bottom:15px;background:#002b3b80}.tariff-panel b{font-size:.95em;color:#7ceefe}.tariff-fields{display:flex;flex-wrap:wrap;gap:12px;align-items:end;margin:10px 0}.tariff-fields label{display:flex;flex-direction:column;gap:5px;flex:1 1 135px}.tariff-fields input{width:100%;background:#001725;color:#fff;border:1px solid #298ab1;border-radius:4px;padding:7px;font:inherit}.tariff-fields button{padding:8px!important}.tariff-panel small{display:block;color:#a4c7d4}
/* Kleine Bildschirme: Ansicht bleibt proportional, Dialoge werden eigenständig bedienbar. */
@media (max-width:900px), (orientation:portrait){
  .dialog{inset:8px;padding:14px;font-size:16px;max-height:calc(100% - 16px)}
  .dialog h2{margin:0 48px 14px 0;line-height:1.35}
  .dialog .close{top:8px;right:8px;min-width:42px;min-height:42px;font-size:24px}
  .details{grid-template-columns:minmax(0,1fr) auto;gap:0 10px}
  .details .label-cell{min-height:38px;text-align:left}
  .tariff-fields input{font-size:16px;min-height:42px}
  .tariff-fields button{min-height:42px}
}
</style>${svg}<section class="dialog" role="dialog" aria-modal="true" aria-label="JARVIS Energiedetails" hidden><button class="close" aria-label="Schließen">×</button><h2 id="detail-heading">ENERGIE · MONATSDETAILS</h2><div class="tariff-panel"><b>ENERGIE-TARIFE · ct/kWh</b><div class="tariff-fields"><label>Strombezug <input id="tariff-import" type="number" min="0" max="200" step="0.01" inputmode="decimal" placeholder="ct/kWh"></label><label>PV-Einspeisung <input id="tariff-export" type="number" min="0" max="200" step="0.01" inputmode="decimal" placeholder="ct/kWh"></label><button id="tariff-save" type="button">Tarife speichern</button></div><small id="tariff-state"></small></div><div class="details"></div><p class="footnote">„—“ bedeutet: Sensor fehlt, ist nicht verfügbar oder noch nicht verifiziert. Energiezähler (kWh) sind keine momentanen Leistungswerte (W). Ohne bestätigte Monatszyklen und Tarife werden keine Geld- oder Prozentwerte erfunden.</p></section>`;
    this._bindClicks();this._buildDetails();this._pause();this._clock();
  }
  _buildDetails(){const node=this.shadowRoot.querySelector('.details');node.innerHTML='';for(const [k,label] of JARVIS_STEVE_DETAILS){const b=document.createElement('button');b.className='label-cell';b.dataset.detailKey=k;b.textContent=label;const v=document.createElement('span');v.className='value-cell';v.dataset.detailValue=k;v.textContent='—';node.append(b,v);}}
  _bindClicks(){const sr=this.shadowRoot;sr.addEventListener('click',e=>{if(e.target.closest('#tariff-save')){this._saveTariffs();return;}if(e.target.closest('.close')){this._close();return;}const row=e.target.closest('[data-detail-key]');if(row){this._moreInfo(row.dataset.detailKey);return;}const room=e.target.closest('[data-room]');if(room){this._openRoom(room.dataset.room);return;}const hit=e.target.closest('[data-key]');if(hit){const k=hit.dataset.key;if(k==='cash'||k==='cost')this._openDetails();else this._moreInfo(k);}});
    sr.addEventListener('keydown',e=>{if(e.key==='Escape')this._close();const t=e.target.closest('[data-key],[data-room]');if(t&&(e.key==='Enter'||e.key===' ')){e.preventDefault();t.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
  }
  _openDetails(title){const d=this.shadowRoot.querySelector('.dialog');this._lastFocus=this.shadowRoot.activeElement;this._txt('detail-heading',title||'ENERGIE · MONATSDETAILS');d.hidden=false;this._tariffFeedback='';this._tariffInputs();d.querySelector('.close').focus();}
  _close(){const d=this.shadowRoot.querySelector('.dialog');if(d&&!d.hidden){d.hidden=true;this._lastFocus?.focus?.();}}
  _moreInfo(key){const entity=this._config?.entities?.[key];if(entity){this.dispatchEvent(new CustomEvent('hass-more-info',{bubbles:true,composed:true,detail:{entityId:entity}}));}else{this._openDetails('DATENQUELLE NOCH NICHT VORHANDEN');}}
  _openRoom(key){this._openDetails('RAUMENERGIE · '+(JARVIS_STEVE_ROOMS.find(r=>r[0]===key)?.[1]||key));}
  _update(){if(!this._config||!this.shadowRoot.querySelector('svg'))return;
    const pv=this._quantity('pv','power'),house=this._quantity('house','power');let imp=this._quantity('imp','power'),exp=this._quantity('exp','power');const meter=this._config.grid_sign_verified?this._quantity('meter','power'):null;
    if(meter!==null){if(imp===null)imp=Math.max(0,meter);if(exp===null)exp=Math.max(0,-meter);}
    const net=meter!==null?meter:(imp!==null&&exp!==null?imp-exp:null),th=this._config.flow_threshold_w;
    for(const [id,v] of [['pv',pv],['house',house],['imp',imp],['exp',exp]])this._txt(id,this._power(v));
    const pvDay=this._energy('pvDay',2);this._txt('pv-production-today',pvDay);this._txt('export-day',this._energy('exportDay',2));this._txt('house-day',this._energy('houseDay',2));this._txt('autarky-day',this._percent('autonomyDay'));
    const ring=this.shadowRoot.getElementById('autarky-ring');const a=this._number('autonomyDay');if(ring){const n=a===null?0:Math.min(100,Math.max(0,a));ring.setAttribute('stroke-dasharray',(62.83*n/100).toFixed(2)+' 62.83');ring.style.opacity=a===null?'0':'1';}
    this._txt('pv-status',pv===null?'—':pv>th?'Aktiv':'Inaktiv');this.shadowRoot.getElementById('pv-dot').setAttribute('fill',pv===null?'#70808a':pv>th?'#87ff4d':'#536974');
    const gridColor=net===null?'#70808a':net < -th?'#ffb638':'#ff4055';this._txt('grid-status',net===null?'—':net < -th?'Einspeisung':net > th?'Netzbezug':'Neutral');this.shadowRoot.getElementById('grid-status').style.fill=gridColor;this.shadowRoot.getElementById('grid-dot').setAttribute('fill',gridColor);
    const activePreview=this._preview;
    const pvAvailable=pv!==null&&pv>th;
    const gridAvailable=net!==null&&Math.abs(net)>th;
    // A running room consumer must still have a visual route without a grid
    // power meter. In that case red only means an ASSUMED grid supply:
    // PV > threshold takes priority, and no unmeasured watt value is invented.
    const infos={};for(const [key] of JARVIS_STEVE_ROOMS)infos[key]=this._roomInfo(key);
    const anyActive=Object.values(infos).some(info=>info.active);
    const assumedGrid=net===null&&!pvAvailable&&anyActive;
    this._flow('pv-flow',activePreview||pvAvailable,'#10ddff',false);
    this._flow('grid-flow',activePreview||gridAvailable||assumedGrid,'#ff4055',net!==null&&net < -th);
    const gridSource=this.shadowRoot.getElementById('grid-flow');
    if(gridSource)gridSource.setAttribute('aria-label',assumedGrid?'Netzversorgung nur angenommen – kein Netzleistungswert':'Netzenergie');
    for(const [key] of JARVIS_STEVE_ROOMS){
      const info=infos[key];
      this._flow(key+'-flow',activePreview||(pvAvailable&&info.active),'#10ddff',false);
      this._flow(key+'-grid-flow',activePreview||((gridAvailable||assumedGrid)&&info.active),'#ff4055',net!==null&&net< -th);
    }
    const durations=[['pv-flow',pv],['grid-flow',net===null?null:Math.abs(net)]];
    for(const [key] of JARVIS_STEVE_ROOMS){durations.push([key+'-flow',infos[key].watts],[key+'-grid-flow',infos[key].watts]);}for(const [id,watts] of durations){let el=this.shadowRoot.getElementById(id);if(el){const secs=watts===null?1.6:Math.max(.55,2.1-Math.log10(1+Math.max(0,watts)/100)*.85);el.style.setProperty('--duration',secs.toFixed(2)+'s');}}
    const calc=this._computedCosts();const shown={cost:calc.cost??this._number('cost'),revenue:calc.revenue??this._number('revenue'),cash:calc.cash??this._number('cash')};for(const k of ['monthImport','monthExport'])this._txt(k,this._energy(k));for(const k of ['cost','revenue'])this._txt(k,this._money(shown[k]));this._txt('evn',this._money(this._number('evn')));this._txt('export-revenue',this._money(shown.revenue));
    const c=shown.cost,q=this._quantity('monthImport','energy');this._txt('effective-rate',calc.cost!==null?this._fmt(this._tariff('import')/100,3)+' €/kWh':(c!==null&&q!==null&&q>0?this._fmt(c/q,2)+' €/kWh':'—'));const rate=calc.rate??this._number('rate');this._txt('rate',rate===null?'—':this._fmt(rate/100,3)+' €/kWh');const cash=shown.cash;this._txt('cash',this._money(cash,true));this.shadowRoot.getElementById('cash-hud').style.color=cash===null?'#708b95':cash>0?'#85ff78':cash<0?'#ff5569':'#51e7ff';
    const monthPv=this._state('pvMonth'),monthExport=this._state('monthExport');const aReset=Date.parse(monthPv?.attributes?.last_reset||''),bReset=Date.parse(monthExport?.attributes?.last_reset||'');const aligned=Number.isFinite(aReset)&&Number.isFinite(bReset)&&Math.abs(aReset-bReset)<300000;
    this._txt('self-month',aligned?this._percent('selfMonth'):'—');
    for(const el of this.shadowRoot.querySelectorAll('[data-detail-value]')){const k=el.dataset.detailValue;let value='—';if(['monthImport','main','sun','monthExport','pvMonth','houseMonth','gridImportDay','exportDay','pvDay','houseDay'].includes(k))value=this._energy(k);else if(['autonomyMonth','selfMonth','autonomyDay','selfDay'].includes(k))value=this._percent(k,1);else if(k==='rate')value=rate===null?'—':this._fmt(rate,2)+' ct/kWh';else if(k==='snap')value=this._state(k)?.state==='on'?'Ja':this._state(k)?.state==='off'?'Nein':'—';else if(k==='tariff')value=this._state(k)&&!['unknown','unavailable'].includes(this._state(k).state)?this._state(k).state:'—';else value=this._money(Object.hasOwn(shown,k)?shown[k]:this._number(k),k==='cash');el.textContent=value;}
    for(const [id,max,base] of [['pv',212,43],['house',149,34],['monthImport',145,27],['monthExport',144,27],['cost',133,27],['revenue',146,27],['cash',210,38]]){const el=this.shadowRoot.getElementById(id);if(el){el.setAttribute('font-size',base);try{const w=el.getComputedTextLength();if(w>max)el.setAttribute('font-size',base*max/w);}catch{}}}
    this._clock();
  }
  // Nur für die gesonderte Offline-Vorschau: visualisiert Wege ohne erfundene Leistungswerte.
  showFlowPreview(enabled){this._preview=Boolean(enabled);this.shadowRoot.getElementById('preview-badge').setAttribute('visibility',enabled?'visible':'hidden');this._update();}
}
if(!customElements.get('jarvis-steve-energy-card'))customElements.define('jarvis-steve-energy-card',JarvisSteveEnergyCard);
window.customCards=window.customCards||[];
if(!window.customCards.some(c=>c.type==='jarvis-steve-energy-card'))window.customCards.push({type:'jarvis-steve-energy-card',name:'JARVIS Steve Energie',description:'Eigenständiges SVG-Energieoverlay im Referenzformat 1672×941.'});


