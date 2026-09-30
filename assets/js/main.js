/* ═══════════════════════════════════════════════════
   Han Yu Tian Cheng Biotech — Interactions
   ═══════════════════════════════════════════════════ */
(function(){
'use strict';

const $  = (s,c)=> (c||document).querySelector(s);
const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v,a,b)=> Math.min(b,Math.max(a,v));

/* ─────────── DATA ─────────── */
const CMP = [
  { key:'conv', color:'#7C93AC',
    name:{zh:'常規急速冷凍', en:'Conventional Quick Freezing'},
    cells:[
      {zh:'長',   en:'Long',   c:'r'},
      {zh:'短',   en:'Short',  c:'r'},
      {zh:'一般', en:'Fair',   c:'n'},
      {zh:'大',   en:'High',   c:'r'},
      {zh:'較高', en:'Higher', c:'y'},
      {zh:'嚴重', en:'Severe', c:'r'}
    ],
    score:[2,2,3,1,2,1] },
  { key:'cas', color:'#8FB8D8',
    name:{zh:'CAS 冷凍', en:'CAS Freezing'},
    cells:[
      {zh:'長',   en:'Long',        c:'r'},
      {zh:'長',   en:'Long',        c:'g'},
      {zh:'好',   en:'Good',        c:'g'},
      {zh:'大',   en:'High',        c:'r'},
      {zh:'極高', en:'Very High',   c:'r'},
      {zh:'嚴重', en:'Severe',      c:'r'}
    ],
    score:[2,5,4,1,1,1] },
  { key:'ln2', color:'#6FF2D6',
    name:{zh:'液態氮冷凍', en:'Liquid Nitrogen'},
    cells:[
      {zh:'短',   en:'Short',      c:'g'},
      {zh:'長',   en:'Long',       c:'g'},
      {zh:'好',   en:'Good',       c:'g'},
      {zh:'大',   en:'High',       c:'r'},
      {zh:'極高', en:'Very High',  c:'r'},
      {zh:'無',   en:'None',       c:'g'}
    ],
    score:[5,4,4,1,1,5] },
  { key:'slrf', color:'#E8C88A', hero:true,
    name:{zh:'超導極速液態冷凍', en:'Superconductive Rapid Freezing'},
    cells:[
      {zh:'短',   en:'Short',   c:'g'},
      {zh:'長',   en:'Long',    c:'g'},
      {zh:'好',   en:'Good',    c:'g'},
      {zh:'小',   en:'Low',     c:'g'},
      {zh:'低',   en:'Low',     c:'g'},
      {zh:'無',   en:'None',    c:'g'}
    ],
    score:[5,5,5,5,5,5] }
];

const AXES = [
  {zh:'凍結速度', en:'Freeze Speed'},
  {zh:'保鮮時間', en:'Shelf Life'},
  {zh:'產品品質', en:'Quality'},
  {zh:'能源效率', en:'Energy'},
  {zh:'成本效益', en:'Cost'},
  {zh:'環境友善', en:'Eco'}
];

const ADV = [
  { zh:{t:'食品安全優勢', d:'低溫殺菌消毒'}, en:{t:'Food Safety', d:'Low-temperature sterilization & disinfection'}, n:'01',
    ico:'<path d="M16 3l11 4.5v7.2c0 6.4-4.6 11.4-11 13.3-6.4-1.9-11-6.9-11-13.3V7.5L16 3z" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M10.5 16.2l4 4 7-7.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' },
  { zh:{t:'運輸成本優勢', d:'冷凍成品運輸，可長距離長時間運送'}, en:{t:'Logistics Cost', d:'Frozen goods shipped over long distances and durations'}, n:'02',
    ico:'<path d="M3 20h18M5 20V9l9-5 9 5v11" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/><path d="M10 20v-6h6v6" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M12 4.6V2.8M8.4 6.3L7 4.9M15.6 6.3L17 4.9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none"/>' },
  { zh:{t:'冷凍品質優勢', d:'冷凍速度快、產品品質高、電費成本低'}, en:{t:'Freezing Quality', d:'High speed, premium quality, low electricity cost'}, n:'03',
    ico:'<path d="M13.5 2.5L5 14h6l-1.5 9.5L21 12h-6.5l-1-9.5z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/>' },
  { zh:{t:'生產機動性優勢', d:'機組可移動至產地組裝，降低設廠成本'}, en:{t:'Production Mobility', d:'Units relocate & assemble on-site, cutting plant setup cost'}, n:'04',
    ico:'<path d="M16 3l9 5.2v9.6L16 23l-9-5.2V8.2L16 3z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/><path d="M16 3v20M7 8.2l9 5.2M25 8.2l-9 5.2" stroke="currentColor" stroke-width="1.1" fill="none" opacity=".65"/>' },
  { zh:{t:'原料成本優勢', d:'原料低價時進貨保存，高價時出貨'}, en:{t:'Raw Material Cost', d:'Buy & store when prices are low, sell when high'}, n:'05',
    ico:'<path d="M4 20.5L10 13l4.5 3.5L22 6" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 6H22v4.5" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 24h20" stroke="currentColor" stroke-width="1.2" fill="none" opacity=".5"/>' },
  { zh:{t:'產品儲存優勢', d:'以冷凍庫保存，節省空間、降低成本'}, en:{t:'Storage Efficiency', d:'Freezer storage saves space and reduces cost'}, n:'06',
    ico:'<path d="M4 9.5L16 3l12 6.5V23H4V9.5z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/><path d="M10 23v-8h8v8M10 15h8" stroke="currentColor" stroke-width="1.2" fill="none"/>' }
];

const MKT = [
  { zh:{t:'鮮乳抗凍儲存', d:'全球唯一冷凍鮮乳還原技術，保存期延長數十倍', v:'百億', u:'美金以上'},
    en:{t:'Fresh Milk Cryo-Storage', d:"World's only frozen fresh-milk restoration tech, shelf life extended dozens of times", v:'10B+', u:'USD'}, w:46 },
  { zh:{t:'畜牧業抗凍飼料', d:'防止寒害，大幅降低生鮮物流成本', v:'千億', u:'美金以上'},
    en:{t:'Livestock Antifreeze Feed', d:'Prevents cold damage, slashes fresh logistics cost', v:'100B+', u:'USD'}, w:94 },
  { zh:{t:'養殖漁業抗凍飼料', d:'防寒害，提升冷凍產品價值', v:'千億', u:'美金以上'},
    en:{t:'Aquaculture Antifreeze Feed', d:'Prevents cold damage, raises frozen product value', v:'100B+', u:'USD'}, w:94 },
  { zh:{t:'生物科技抗凍', d:'疫苗／臍帶血保存，大幅降低冷凍與物流成本', v:'百億', u:'美金以上'},
    en:{t:'Biotech Cryo-Preservation', d:'Vaccine / cord-blood storage, cuts freezing & logistics cost', v:'10B+', u:'USD'}, w:46 },
  { zh:{t:'生食／熟食食品加工', d:'提升冷凍產品價值，降低生鮮物流成本', v:'千億', u:'美金以上'},
    en:{t:'Raw & Cooked Food Processing', d:'Raises frozen product value, lowers fresh logistics cost', v:'100B+', u:'USD'}, w:94 }
];

const FLOW = [
  { zh:{t:'接受訂單', d:'確認客戶產品規格、產量與交期，排定凍儲產能與抗凍蛋白用量。'},
    en:{t:'Order Received', d:'Confirm product specs, volume and lead time; schedule freezing capacity and antifreeze protein dosage.'} },
  { zh:{t:'浸漬抗凍保鮮液', d:'將原料浸漬於 SR 專利抗凍蛋白（DP-AFPs）保鮮液，使小分子抗凍成分深入細胞。'},
    en:{t:'Antifreeze Immersion', d:'Immerse raw material in patented DP-AFPs solution so small molecules penetrate the cells.'} },
  { zh:{t:'入盤抗凍保鮮', d:'依產品形狀入盤定位，確保冷凍液均勻包覆、受冷一致。'},
    en:{t:'Tray Loading', d:'Position products on trays for uniform cryo-fluid coverage and even cooling.'} },
  { zh:{t:'冷凍品脫盤', d:'以 SLRF 超導液態系統於 -30°C 至 -35°C 急速凍結後脫盤，冰晶極小化、細胞完整。'},
    en:{t:'Demolding', d:'Rapid freeze at -30°C to -35°C via SLRF, then demold: minimal ice crystals, intact cells.'} },
  { zh:{t:'保鮮裝箱', d:'低溫環境下進行保鮮包裝裝箱，標示批號與凍儲日期，全程可追溯。'},
    en:{t:'Freshness Packaging', d:'Pack in low-temp environment with batch & storage-date labelling, fully traceable.'} },
  { zh:{t:'冷凍倉儲託管', d:'進入冷凍庫託管儲存，可配合客戶跨季節調節供需、等待最佳售價時點。'},
    en:{t:'Cold Storage Escrow', d:'Store in managed freezers, letting clients balance supply across seasons for best pricing.'} },
  { zh:{t:'市場議價出貨', d:'依市場行情議價後出貨，實現「低價進、高價出」的價值套利。'},
    en:{t:'Market Pricing & Delivery', d:'Price against market conditions and ship — capturing buy-low, sell-high value arbitrage.'} }
];

/* ─────────── I18N ─────────── */
const I18N = {
  zh:{
    'pre.label':'CAT 細胞抗凍技術 · 初始化',
    'brand.name':'瀚宇天成生技','brand.en':'Han Yu Tian Cheng Biotech',
    'nav.home':'首頁','nav.about':'關於我們','nav.tech':'核心技術','nav.compare':'技術比較',
    'nav.advantage':'六大優勢','nav.market':'市場應用','nav.client':'客戶合作','nav.flow':'交易流程',
    'nav.contact':'聯絡我們','nav.cta':'洽詢合作',
    'hero.eyebrow':'食品保存技術 · 營運企劃書',
    'hero.t1':'超導液態極速冷凍','hero.t2':'抗凍蛋白冷凍液',
    'hero.sub':'以 CAT 細胞抗凍技術重新定義冷凍保鮮 —— 節省能源、降低成本、延長鮮度，把冷凍鮮美的漁獲、肉品與水果行銷至世界各地。',
    'hero.cta1':'探索核心技術','hero.cta2':'成為合作夥伴',
    'hero.s1':'年冷凍技術深耕','hero.s2':'液體熱傳導率<br>（對比空氣）','hero.s3':'年商品化測試','hero.s4':'超導冷凍液工作溫度',
    'hero.scroll':'向下探索',
    'tick.1':'SLRF 超導液態抗凍系統','tick.2':'SR 專利抗凍蛋白 DP-AFPs','tick.3':'全球唯一一體化冷鏈解決方案',
    'tick.4':'德國發明專利 2016','tick.5':'零污染 · 低能耗 · 低成本',
    'sim.title':'即時凍結模擬','sim.legacy':'傳統冷凍','sim.cat':'CAT 抗凍技術',
    'sim.crystal':'冰晶尺寸','sim.integrity':'細胞完整度','sim.drip':'解凍失水率',
    'about.t':'公司簡介','about.desc':'民國 108 年 10 月成立，深耕生物抗凍保鮮冷凍技術，以十年商品測試與國家級專利為基礎，打造從產地到餐桌的凍鮮供應鏈。',
    'about.p1t':'公司成立','about.p1d':'民國 108 年 10 月成立，深耕生物抗凍保鮮冷凍技術。',
    'about.p2t':'技術團隊','about.p2d':'總經理林谷峻深耕冷凍技術逾 15 年；2011 年研發成功抗凍蛋白萃取技術，2016 年取得德國發明專利。',
    'about.p3t':'商品化實績','about.p3d':'十年商品測試，2020 年與台灣鮮乳（中華民國農會）簽約設廠，冬季收購鮮乳冷凍，2021 年夏季上市。',
    'about.p3tag':'總經理親自把關產線與抗凍蛋白製程品質',
    'tl.1t':'抗凍蛋白萃取技術研發成功','tl.1d':'成功自生物體萃取抗凍蛋白，奠定 CAT 細胞抗凍技術基礎。',
    'tl.2t':'取得德國發明專利','tl.2d':'抗凍蛋白技術獲國際專利肯定，技術布局邁向全球。','tl.2n':'民國 108 年 10 月',
    'tl.3t':'瀚宇天成生技正式成立','tl.3d':'公司成立，專注生物抗凍保鮮冷凍技術之研發與商業化。',
    'tl.4t':'與台灣鮮乳（中華民國農會）簽約設廠','tl.4d':'冬季收購鮮乳進行冷凍儲存，建立亞洲指標性凍鮮鮮乳產線。',
    'tl.5t':'冷凍鮮乳夏季正式上市','tl.5d':'驗證「冬季收購、夏季上市」的跨季節供需調節商業模式。',
    'tech.t':'核心技術','tech.desc':'新一代生物抗凍保鮮冷凍技術，全面提升保鮮冷凍水準，節省能源、降低成本並延長食物新鮮度，將冷凍鮮美的漁獲、肉品與水果行銷至世界各地。',
    'tech.tab1':'超導液態抗凍系統','tech.tab2':'SR 專利抗凍蛋白','tech.tab3':'一體化解決方案',
    'tech.t1h':'以 -30°C 至 -35°C 酒精混合冷凍液為媒介',
    'tech.t1p':'液體熱傳導率為空氣的 20 倍，能在最短時間通過最大冰晶生成區，抑制冰晶形成、避免細胞膜破壞。',
    'tech.t1l1':'液體熱傳導率達空氣 20 倍','tech.t1l2':'最短時間穿越最大冰晶生成區','tech.t1l3':'完整保存細胞膜結構不被破壞','tech.t1k':'熱傳導率<br>vs 空氣',
    'tech.t2h':'特殊碳水化合物組成的抗凍保鮮液',
    'tech.t2p':'分子量小、易入細胞，形成保護膜並提高細胞抗凍能力，抑制冰晶生長、防止解凍後脫水與變質。',
    'tech.t2l1':'分子量小，可深入細胞內部','tech.t2l2':'於細胞表面形成保護膜','tech.t2l3':'有效防止解凍後脫水與變質',
    'tech.t3h':'全球唯一的一體化凍鮮解決方案',
    'tech.t3p':'從動物養殖防凍、產品耐凍、急速冷凍設備冷凍液，到儲存運輸，提供端到端的完整技術與設備輸出。',
    'tech.c1':'養殖防凍','tech.c2':'產品耐凍','tech.c3':'急速冷凍','tech.c4':'儲存運輸',
    'cmp.t':'技術比較','cmp.desc':'超導液態極速冷凍對比傳統冷凍方式，在保鮮時間與產品品質皆優，同時擁有低能耗、低成本、零污染的綜合優勢。',
    'cmp.th0':'冷凍方式','cmp.th1':'凍結時間','cmp.th2':'保鮮時間','cmp.th3':'產品品質','cmp.th4':'能耗','cmp.th5':'成本','cmp.th6':'環境污染',
    'cmp.note':'點擊表中任一列，可在左側雷達圖中聚焦該冷凍技術之綜合表現。',
    'adv.t':'超導液態極速冷凍 · 六大優勢',
    'mkt.t':'應用領域與目標市場','mkt.desc':'從鮮乳、畜牧、養殖到生醫保存與食品加工，CAT 技術切入的每一條賽道，都是百億至千億美金等級的全球市場。',
    'mkt.total':'合計可服務市場產值','mkt.totalv':'數千億','mkt.totalu':'美金以上',
    'cli.t':'主要客戶與合作進度','cli.flagtag':'旗艦戰略項目',
    'cli.f1':'印尼海洋暨漁業部（KKP）主導的國家戰略計畫，規劃於全印尼沿海地區建設數千座漁村',
    'cli.f2':'每村配置碼頭、冷凍倉儲（cold storage）、製冰廠等基礎設施',
    'cli.f3':'瀚宇天成鎖定此波國家級冷鏈基礎建設浪潮，推動抗凍蛋白技術與冷凍設備導入合作，目前正與資本市場對接中',
    'cli.fCountry':'印尼 · 全國沿海','cli.fMinistry':'海洋暨漁業部主導','cli.fStage':'對接中','cli.fStageD':'資本市場與技術導入',
    'cli.done':'已合作','cli.doneEn':'Track Record','cli.talk':'洽談中','cli.talkEn':'In Discussion',
    'cli.d1t':'台農鮮乳廠（中華民國農會）','cli.d1d':'冬季鮮乳冷凍，夏季解凍上市',
    'cli.d2t':'菲律賓馬尼拉經濟文化辦事處','cli.d2d':'納入國家冷鏈發展計畫',
    'cli.d3t':'枝仔冰城','cli.d3d':'珍珠冰棒、芒果冰代工（HACCP 認證）',
    'cli.p1t':'3M','cli.p1d':'挪威鮭魚整廠冷凍技術輸出',
    'cli.p2t':'日本住友商社','cli.p2d':'香蕉冷凍技術輸出與設廠',
    'cli.p3t':'雙匯肉品','cli.p3d':'豬肉鮮凍與活體抗凍技術',
    'flow.t':'產品交易流程','flow.desc':'接受訂單 → 加工冷凍 → 凍儲出貨，全程掌控品質與交期。點擊任一節點查看工序說明。',
    'cta.t':'共創共享','cta.p':'感謝您的聆聽，期盼與您共同攜手 —— 讓冷凍鮮美的漁獲、肉品與水果，從產地走向世界每一張餐桌。',
    'cta.comp':'公司名稱','cta.compv':'瀚宇天成生技股份有限公司 ∕ 浩瀚天成生技股份有限公司',
    'cta.tech':'核心技術','cta.techv':'CAT 細胞抗凍技術 · SLRF 超導液態抗凍系統 · DP-AFPs',
    'cta.scope':'合作範圍','cta.scopev':'整廠技術輸出 · 抗凍蛋白供應 · 冷鏈設備建置',
    'f.name':'姓名 / 公司','f.namePh':'請輸入您的姓名或公司名稱','f.errName':'請填寫姓名或公司名稱',
    'f.mail':'電子郵件','f.mailPh':'name@company.com','f.errMail':'請填寫有效的電子郵件',
    'f.type':'合作類型','f.c1':'整廠技術輸出','f.c2':'抗凍蛋白供應','f.c3':'冷鏈設備建置','f.c4':'經銷代理','f.c5':'其他',
    'f.msg':'需求說明','f.msgPh':'請簡述您的產品、產能與需求時程','f.send':'送出合作洽詢',
    'f.ok':'已送出！我們將於兩個工作天內與您聯繫。',
    'ft.name':'瀚宇天成生技股份有限公司','ft.name2':'浩瀚天成生技股份有限公司',
    'ft.slogan':'超導液態極速冷凍 × 抗凍蛋白冷凍液 · 全球唯一一體化凍鮮解決方案',
    'ft.nav':'網站導覽','ft.top':'回到頂端'
  },
  en:{
    'pre.label':'CAT Cells Antifreeze Technology · Booting',
    'brand.name':'HYTC Biotech','brand.en':'Han Yu Tian Cheng Biotech',
    'nav.home':'Home','nav.about':'About','nav.tech':'Technology','nav.compare':'Comparison',
    'nav.advantage':'Advantages','nav.market':'Markets','nav.client':'Clients','nav.flow':'Workflow',
    'nav.contact':'Contact','nav.cta':'Partner With Us',
    'hero.eyebrow':'Food Preservation Technology · Business Plan',
    'hero.t1':'Supercooled Liquid','hero.t2':'Rapid Freezing × AFP',
    'hero.sub':'Redefining frozen freshness with CAT Cells Antifreeze Technology — saving energy, cutting cost, extending freshness, and delivering ocean-fresh seafood, meat and fruit to the world.',
    'hero.cta1':'Explore Technology','hero.cta2':'Become a Partner',
    'hero.s1':'Years in freezing technology','hero.s2':'Thermal conductivity<br>vs air','hero.s3':'Years of product testing','hero.s4':'Cryo-fluid operating temperature',
    'hero.scroll':'Scroll to explore',
    'tick.1':'SLRF Supercooled Liquid Antifreeze System','tick.2':'SR Patented Antifreeze Protein DP-AFPs',
    'tick.3':"World's only integrated cold-chain solution",'tick.4':'German Invention Patent 2016',
    'tick.5':'Zero pollution · Low energy · Low cost',
    'sim.title':'Live Freezing Simulation','sim.legacy':'Conventional','sim.cat':'CAT Technology',
    'sim.crystal':'Ice Crystal Size','sim.integrity':'Cell Integrity','sim.drip':'Thaw Drip Loss',
    'about.t':'Company Overview','about.desc':'Founded in October 2019 and rooted in bio-antifreeze preservation technology, we build a farm-to-table frozen-fresh supply chain on a decade of product testing and an internationally granted patent.',
    'about.p1t':'Founded','about.p1d':'Established in October 2019, dedicated to bio-antifreeze preservation and freezing technology.',
    'about.p2t':'Technical Team','about.p2d':'General Manager Ku-Chun Lin brings over 15 years in freezing technology; the antifreeze protein extraction technology succeeded in 2011 and earned a German invention patent in 2016.',
    'about.p3t':'Commercial Track Record','about.p3d':'After ten years of product testing, the company signed a plant agreement with Taiwan Fresh Milk (National Farmers\' Association) in 2020 — buying and freezing milk in winter, launching it in summer 2021.',
    'about.p3tag':'The GM personally oversees the production line and AFP process quality',
    'tl.1t':'Antifreeze Protein Extraction Succeeded','tl.1d':'Antifreeze protein successfully extracted from living organisms, laying the foundation of CAT technology.',
    'tl.2t':'German Invention Patent Granted','tl.2d':'International patent recognition propels the technology onto the global stage.','tl.2n':'October 2019',
    'tl.3t':'HYTC Biotech Officially Founded','tl.3d':'Company established, focused on R&D and commercialisation of bio-antifreeze preservation.',
    'tl.4t':'Plant Agreement with Taiwan Fresh Milk','tl.4d':'Winter milk purchased and frozen for storage, building a benchmark frozen-fresh milk line in Asia.',
    'tl.5t':'Frozen Fresh Milk Launched in Summer','tl.5d':'Validating the cross-seasonal supply model: buy in winter, sell in summer.',
    'tech.t':'Core','tech.desc':'A new generation of bio-antifreeze preservation and freezing technology that raises the bar on preservation — saving energy, cutting cost and extending freshness, so ocean-fresh seafood, meat and fruit can reach the world.',
    'tech.tab1':'SLRF Antifreeze System','tech.tab2':'SR Patented AFP','tech.tab3':'Integrated Solution',
    'tech.t1h':'An alcohol-blended cryo-fluid medium at -30°C to -35°C',
    'tech.t1p':'Liquid thermal conductivity is 20× that of air, crossing the maximum ice-crystal formation zone in the shortest time — suppressing crystal growth and preventing cell-membrane damage.',
    'tech.t1l1':'20× thermal conductivity vs air','tech.t1l2':'Fastest pass through the ice-crystal zone','tech.t1l3':'Cell membrane structure fully preserved','tech.t1k':'Conductivity<br>vs air',
    'tech.t2h':'An antifreeze preservation fluid built from specialised carbohydrates',
    'tech.t2p':'Small molecular weight and easily absorbed into cells, forming a protective film that raises antifreeze capacity, suppresses ice growth and prevents dehydration and spoilage after thawing.',
    'tech.t2l1':'Small molecules penetrate deep into cells','tech.t2l2':'Forms a protective film on the cell surface','tech.t2l3':'Prevents post-thaw dehydration and spoilage',
    'tech.t3h':"The world's only integrated frozen-fresh solution",
    'tech.t3p':'From livestock antifreeze and product frost-resistance to cryo-fluid for rapid-freezing equipment and storage & transport — complete end-to-end technology and equipment delivery.',
    'tech.c1':'Livestock','tech.c2':'Frost-Resistant','tech.c3':'Rapid Freeze','tech.c4':'Storage & Transit',
    'cmp.t':'Technology Comparison','cmp.desc':'Supercooled rapid liquid freezing outperforms conventional methods on shelf life and product quality, while combining low energy use, low cost and zero pollution.',
    'cmp.th0':'Freezing Method','cmp.th1':'Freeze Time','cmp.th2':'Shelf Life','cmp.th3':'Quality','cmp.th4':'Energy','cmp.th5':'Cost','cmp.th6':'Pollution',
    'cmp.note':'Click any row to focus that technology\'s overall performance in the radar chart on the left.',
    'adv.t':'Supercooled Rapid Freezing · Six Key Advantages',
    'mkt.t':'Applications & Target Markets','mkt.desc':'From fresh milk, livestock and aquaculture to biomedical preservation and food processing — every track CAT enters is a hundred-billion to trillion-dollar global market.',
    'mkt.total':'Total addressable market value','mkt.totalv':'Hundreds of billions','mkt.totalu':'USD and beyond',
    'cli.t':'Key Clients & Pipeline','cli.flagtag':'Flagship Strategic Project',
    'cli.f1':'A national strategic programme led by Indonesia\'s Ministry of Marine Affairs and Fisheries (KKP), planning thousands of fishing villages across the entire Indonesian coastline',
    'cli.f2':'Each village is equipped with a pier, cold storage facilities and ice plants',
    'cli.f3':'HYTC is riding this national cold-chain infrastructure wave, driving adoption of antifreeze protein technology and freezing equipment — currently engaging capital markets',
    'cli.fCountry':'Indonesia · National coastline','cli.fMinistry':'Led by Ministry of Marine Affairs','cli.fStage':'Engaging','cli.fStageD':'Capital markets & tech onboarding',
    'cli.done':'Delivered','cli.doneEn':'Track Record','cli.talk':'In Discussion','cli.talkEn':'Pipeline',
    'cli.d1t':'Tai-Nung Fresh Milk (National Farmers\' Association)','cli.d1d':'Winter milk frozen, thawed and launched in summer',
    'cli.d2t':'Manila Economic and Cultural Office','cli.d2d':'Included in the national cold-chain development plan',
    'cli.d3t':'Chi-Chi Ice City','cli.d3d':'Tapioca & mango ice-bar OEM (HACCP certified)',
    'cli.p1t':'3M','cli.p1d':'Full-plant freezing technology export for Norwegian salmon',
    'cli.p2t':'Sumitomo Corporation','cli.p2d':'Banana freezing technology export & plant setup',
    'cli.p3t':'Shuanghui Meat','cli.p3d':'Pork fresh-freezing & live-animal antifreeze technology',
    'flow.t':'Product Workflow','flow.desc':'Order received → processing & freezing → frozen storage & shipping, with quality and lead time controlled throughout. Click any node for details.',
    'cta.t':'Co-Create, Co-Share','cta.p':'Thank you for listening — we look forward to working with you to bring ocean-fresh seafood, meat and fruit from the source to every table in the world.',
    'cta.comp':'Company','cta.compv':'Han Yu Tian Cheng Biotech Co., Ltd.',
    'cta.tech':'Core Technology','cta.techv':'CAT Cells Antifreeze Technology · SLRF System · DP-AFPs',
    'cta.scope':'Partnership Scope','cta.scopev':'Full-plant tech export · AFP supply · Cold-chain build-out',
    'f.name':'Name / Company','f.namePh':'Your name or company name','f.errName':'Please enter your name or company',
    'f.mail':'Email','f.mailPh':'name@company.com','f.errMail':'Please enter a valid email address',
    'f.type':'Partnership Type','f.c1':'Full-plant tech export','f.c2':'AFP supply','f.c3':'Cold-chain build-out','f.c4':'Distribution','f.c5':'Other',
    'f.msg':'Requirements','f.msgPh':'Briefly describe your product, capacity and timeline','f.send':'Send Partnership Enquiry',
    'f.ok':'Sent! We will get back to you within two business days.',
    'ft.name':'Han Yu Tian Cheng Biotech Co., Ltd.','ft.name2':'Hao Han Tian Cheng Biotech Co., Ltd.',
    'ft.slogan':'Supercooled Liquid Rapid Freezing × Antifreeze Protein Fluid · The world\'s only integrated frozen-fresh solution',
    'ft.nav':'Site Map','ft.top':'Back to top'
  }
};
let LANG = 'zh';
const T = k => (I18N[LANG] && I18N[LANG][k]) || I18N.zh[k] || k;

function applyI18N(){
  document.documentElement.lang = LANG==='zh' ? 'zh-Hant' : 'en';
  $$('[data-i18n]').forEach(e=>{ e.innerHTML = T(e.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(e=>{ e.placeholder = T(e.dataset.i18nPh); });
  $('#langOn').textContent = LANG==='zh'?'繁':'EN';
  $('#langOff').textContent = LANG==='zh'?'EN':'繁';
  $('#langOn2').textContent = $('#langOn').textContent;
  $('#langOff2').textContent = $('#langOff').textContent;
  buildTable(); renderRadar(); buildAdv(); buildMarket(); buildFlow();
}

/* ─────────── PRELOADER ─────────── */
function preloader(){
  const fill=$('#preFill'), num=$('#preNum'), pre=$('#preloader');
  if(REDUCED){ pre.classList.add('out'); setTimeout(()=>pre.remove(),700); return; }
  let p=0;
  const t=setInterval(()=>{
    p += Math.random()*13+6;
    if(p>=100){ p=100; clearInterval(t);
      setTimeout(()=>{ pre.classList.add('out'); setTimeout(()=>pre.remove(),800); },260);
    }
    fill.style.width = p+'%';
    num.textContent = Math.round(p);
  },90);
}

/* ─────────── CURSOR ─────────── */
function cursor(){
  if(window.matchMedia('(hover:none)').matches || window.innerWidth<900) return;
  const c=$('#cursor');
  document.addEventListener('mousemove',e=>{
    c.classList.add('on');
    c.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  });
  document.addEventListener('mouseleave',()=>c.classList.remove('on'));
  $$('a,button,.cli-card,.mkt,.fstep,.lg,.pillar').forEach(el=>{
    el.addEventListener('mouseenter',()=>c.classList.add('grow'));
    el.addEventListener('mouseleave',()=>c.classList.remove('grow'));
  });
}

/* ─────────── HEADER / SCROLL ─────────── */
function header(){
  const hdr=$('#hdr'), bar=$('#scrollBar');
  const onScroll=()=>{
    hdr.classList.toggle('stuck', window.scrollY>40);
    const h=document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h>0 ? (window.scrollY/h*100) : 0)+'%';
  };
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
}
function navActive(){
  const secs=$$('section[id]');
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        const id=e.target.id;
        $$('.nav-a').forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+id));
      }
    });
  },{rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(s=>io.observe(s));
}
function mobileNav(){
  const b=$('#burger'), m=$('#mnav');
  b.addEventListener('click',()=>{
    const on=b.classList.toggle('on');
    m.classList.toggle('on',on);
    document.body.classList.toggle('lock',on);
  });
  $$('.mnav-list a').forEach(a=>a.addEventListener('click',()=>{
    b.classList.remove('on'); m.classList.remove('on'); document.body.classList.remove('lock');
  }));
}

/* ─────────── REVEAL + COUNTERS ─────────── */
function reveal(){
  $$('.reveal').forEach(e=>{
    const d=e.dataset.d||0; e.style.transitionDelay = d+'ms';
  });
  const io=new IntersectionObserver((es,o)=>{
    es.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); countUp(e.target); o.unobserve(e.target); }
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  $$('.reveal').forEach(e=>io.observe(e));
}
function countUp(scope){
  $$('.num',scope).forEach(el=>{
    if(el.dataset.done) return; el.dataset.done='1';
    const to=parseFloat(el.dataset.to||0), suf=el.dataset.suffix||'';
    if(REDUCED){ el.innerHTML = to+suf; return; }
    const dur=1500, t0=performance.now();
    const step=now=>{
      const k=clamp((now-t0)/dur,0,1);
      const e=1-Math.pow(1-k,3);
      el.innerHTML = Math.round(to*e)+suf;
      if(k<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ─────────── TICKER ─────────── */
function ticker(){
  const t=$('#ticker'); if(!t) return;
  t.innerHTML += t.innerHTML;
}

/* ─────────── HERO CANVAS SIM ─────────── */
function heroSim(){
  const cv=$('#heroCanvas'); if(!cv) return;
  const ctx=cv.getContext('2d');
  let W=0,H=0,dpr=1,mobile=false;
  let mode='legacy', p=0, last=0;
  const CYCLE=8000;

  let mols=[], seeds=[], afps=[], cell=null, nuc=[];

  function size(){
    const r=cv.getBoundingClientRect();
    mobile = window.innerWidth<760;
    dpr = Math.min(window.devicePixelRatio||1, mobile?1.6:2);
    W=r.width; H=r.height;
    cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    build();
  }
  function build(){
    const n = clamp(Math.round(W*H/15000), 50, mobile?70:150);
    mols = Array.from({length:n},()=>({
      x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22,
      r:Math.random()*1.5+.6, a:Math.random()*.5+.2
    }));
    const cr = Math.min(W,H)*0.13;
    cell = { x:W*0.5, y:H*0.52, r:cr };
    const sc = mobile?3:5;
    seeds = Array.from({length:sc},(_,i)=>({
      a: (i/sc)*Math.PI*2 + Math.random(),
      d: Math.min(W,H)*0.30 + Math.random()*Math.min(W,H)*0.14,
      rot: Math.random()*Math.PI
    }));
    afps = Array.from({length:mobile?22:44},(_,i)=>({
      o:(i/(mobile?22:44))*Math.PI*2, sp:.35+Math.random()*.5, rr:.9+Math.random()*.28
    }));
    nuc = Array.from({length:mobile?8:16},()=>({
      a:Math.random()*Math.PI*2, d:Math.random()*.62, r:Math.random()*2+1.2
    }));
  }

  function crystal(x,y,s,rot,alpha,col){
    if(s<2) return;
    const path=new Path2D();
    for(let k=0;k<6;k++){
      const a=k*Math.PI/3, ca=Math.cos(a), sa=Math.sin(a);
      const tx=(px,py)=>[px*ca-py*sa, px*sa+py*ca];
      const p0=tx(0,0), p1=tx(s,0);
      path.moveTo(p0[0],p0[1]); path.lineTo(p1[0],p1[1]);
      for(let j=1;j<=4;j++){
        const f=j/5, bx=s*f, bl=s*(1-f)*0.62;
        if(bl<2) continue;
        const a1=tx(bx,0), b1=tx(bx+bl*0.78,-bl*0.62), b2=tx(bx+bl*0.78, bl*0.62);
        path.moveTo(a1[0],a1[1]); path.lineTo(b1[0],b1[1]);
        path.moveTo(a1[0],a1[1]); path.lineTo(b2[0],b2[1]);
      }
    }
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
    ctx.strokeStyle=col; ctx.globalAlpha=alpha; ctx.lineCap='round';
    ctx.lineWidth=Math.max(.7, s*0.035);
    ctx.stroke(path);
    ctx.restore();
  }

  function draw(now){
    if(!last) last=now;
    const dt=now-last; last=now;
    p += dt/CYCLE; if(p>1) p-=1;
    const ease = 1-Math.pow(1-clamp(p/0.82,0,1),2.2);

    ctx.clearRect(0,0,W,H);

    /* molecules */
    ctx.lineWidth=.6;
    for(let i=0;i<mols.length;i++){
      const m=mols[i];
      m.x+=m.vx; m.y+=m.vy;
      if(m.x<-10)m.x=W+10; if(m.x>W+10)m.x=-10;
      if(m.y<-10)m.y=H+10; if(m.y>H+10)m.y=-10;
    }
    for(let i=0;i<mols.length;i++){
      const a=mols[i];
      for(let j=i+1;j<mols.length;j++){
        const b=mols[j], dx=a.x-b.x, dy=a.y-b.y, d2=dx*dx+dy*dy;
        if(d2<11000){
          const al=(1-d2/11000)*0.16;
          ctx.strokeStyle=`rgba(111,242,214,${al})`;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    mols.forEach(m=>{
      ctx.fillStyle=`rgba(180,236,255,${m.a})`;
      ctx.beginPath(); ctx.arc(m.x,m.y,m.r,0,6.283); ctx.fill();
    });

    /* crystals */
    const big = mode==='legacy';
    seeds.forEach((s,i)=>{
      const sx = cell.x + Math.cos(s.a)*s.d;
      const sy = cell.y + Math.sin(s.a)*s.d*0.72;
      const max = big ? Math.min(W,H)*0.10 : Math.min(W,H)*0.017;
      const sz = max*ease;
      const col = big ? 'rgba(190,225,255,.85)' : 'rgba(111,242,214,.8)';
      ctx.shadowBlur = big?16:8; ctx.shadowColor = big?'rgba(160,215,255,.7)':'rgba(111,242,214,.6)';
      crystal(sx,sy,sz,s.rot, .30+ease*.62, col);
      ctx.shadowBlur=0;
    });

    /* AFP shield */
    if(!big){
      const t=now/1000;
      afps.forEach(a=>{
        a.o += a.sp*0.006;
        const rr = cell.r*(1.08 + 0.14*Math.sin(t*1.4+a.o)) * a.rr;
        const x = cell.x + Math.cos(a.o)*rr, y = cell.y + Math.sin(a.o)*rr*0.92;
        ctx.fillStyle='rgba(232,200,138,.95)';
        ctx.shadowBlur=10; ctx.shadowColor='rgba(232,200,138,.9)';
        ctx.beginPath(); ctx.arc(x,y,2.1,0,6.283); ctx.fill();
        ctx.shadowBlur=0;
      });
      ctx.strokeStyle=`rgba(232,200,138,${.18+.14*Math.sin(t*1.6)})`;
      ctx.lineWidth=1;
      ctx.beginPath();
      for(let k=0;k<6;k++){
        const a=k*Math.PI/3 + t*0.12;
        const x=cell.x+Math.cos(a)*cell.r*1.20, y=cell.y+Math.sin(a)*cell.r*1.20;
        k?ctx.lineTo(x,y):ctx.moveTo(x,y);
      }
      ctx.closePath(); ctx.stroke();
    }

    /* cell */
    const integ = big ? 100-58*ease : 100-4*ease;
    const mix = clamp(integ/100,0,1);
    const rr = Math.round(255*(1-mix)) + 40;
    const gg = Math.round(120+140*mix);
    const bb = Math.round(140+90*mix);
    const stroke = `rgba(${rr},${gg},${bb},.9)`;

    const g=ctx.createRadialGradient(cell.x,cell.y,cell.r*0.15,cell.x,cell.y,cell.r);
    g.addColorStop(0, big?`rgba(255,140,150,${.05+.08*ease})`:'rgba(111,242,214,.10)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cell.x,cell.y,cell.r,0,6.283); ctx.fill();

    ctx.strokeStyle=stroke; ctx.lineWidth=1.4;
    ctx.shadowBlur=18; ctx.shadowColor= stroke;
    ctx.beginPath(); ctx.arc(cell.x,cell.y,cell.r,0,6.283); ctx.stroke();
    ctx.shadowBlur=0;

    /* cracks when damaged */
    if(big && ease>0.25){
      ctx.strokeStyle=`rgba(255,107,122,${(ease-0.25)*1.1})`;
      ctx.lineWidth=1;
      for(let k=0;k<7;k++){
        const a=k*Math.PI*2/7 + 0.4;
        ctx.beginPath();
        ctx.moveTo(cell.x+Math.cos(a)*cell.r, cell.y+Math.sin(a)*cell.r);
        ctx.lineTo(cell.x+Math.cos(a+0.12)*cell.r*(1-ease*0.55), cell.y+Math.sin(a+0.12)*cell.r*(1-ease*0.55));
        ctx.stroke();
      }
    }

    /* nucleus dots */
    nuc.forEach(n=>{
      const dd = cell.r*n.d*(1 + (big? ease*0.35 : 0));
      const x=cell.x+Math.cos(n.a)*dd, y=cell.y+Math.sin(n.a)*dd;
      ctx.fillStyle = big?`rgba(255,190,190,${.55-ease*.3})`:'rgba(190,245,255,.6)';
      ctx.beginPath(); ctx.arc(x,y,n.r,0,6.283); ctx.fill();
    });

    /* meters */
    const crystalV = big ? 8+84*ease : 8+6*ease;
    const integV   = big ? 100-58*ease : 100-4*ease;
    const dripV    = big ? 2+26*ease : 2+1*ease;
    setMeter('#mCrystal','#bCrystal', crystalV.toFixed(0)+' µm', crystalV);
    setMeter('#mCell','#bCell', integV.toFixed(0)+' %', integV);
    setMeter('#mDrip','#bDrip', dripV.toFixed(1)+' %', Math.min(100, dripV/30*100));

    requestAnimationFrame(draw);
  }
  function setMeter(ns,bs,txt,w){
    const n=$(ns), b=$(bs); if(!n||!b) return;
    if(n.textContent!==txt) n.textContent=txt;
    b.style.width = w.toFixed(1)+'%';
  }

  /* mode toggle */
  const seg=$('#seg'), slider=$('#segSlider');
  function moveSlider(){
    const act=$('.seg-b.active',seg);
    if(!act) return;
    slider.style.left = act.offsetLeft+'px';
    slider.style.width = act.offsetWidth+'px';
  }
  $$('.seg-b',seg).forEach(b=>{
    b.addEventListener('click',()=>{
      $$('.seg-b',seg).forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      mode=b.dataset.mode; p=0;
      seg.dataset.mode=mode;
      moveSlider();
    });
  });
  window.addEventListener('resize',()=>{ moveSlider(); });

  if(REDUCED){
    size(); p=0.9; draw(performance.now());
  }else{
    const ro=new ResizeObserver(()=>size());
    ro.observe(cv); size();
    requestAnimationFrame(draw);
  }
  setTimeout(moveSlider,60);
  window.addEventListener('load',moveSlider);
}

/* ─────────── TABS ─────────── */
function tabs(){
  const bar=$('#tabsBar'), ink=$('#tabsInk');
  function move(){
    const a=$('.tab-b.active',bar); if(!a) return;
    ink.style.left=a.offsetLeft+'px'; ink.style.width=a.offsetWidth+'px';
  }
  $$('.tab-b',bar).forEach(b=>{
    b.addEventListener('click',()=>{
      $$('.tab-b',bar).forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); move();
      const i=b.dataset.tab;
      $$('.tab-p').forEach(p=>p.classList.toggle('active', p.dataset.p===i));
    });
  });
  window.addEventListener('resize',move);
  setTimeout(move,60); window.addEventListener('load',move);
}

/* ─────────── RADAR ─────────── */
let rFocus=null; const rOff=new Set();
function renderRadar(){
  const svg=$('#radar'); if(!svg) return;
  svg.innerHTML='';
  const NS='http://www.w3.org/2000/svg';
  const E=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e;};
  const C=180, R=112, N=AXES.length;
  const pt=(i,r)=>{
    const a=-Math.PI/2 + i*2*Math.PI/N;
    return [C+Math.cos(a)*r, C+Math.sin(a)*r];
  };
  const poly=r=>AXES.map((_,i)=>pt(i,r).map(v=>v.toFixed(1)).join(',')).join(' ');

  /* rings */
  for(let k=5;k>=1;k--){
    svg.appendChild(E('polygon',{points:poly(R*k/5),fill:'none',
      stroke:'rgba(125,190,230,'+(k===5?0.26:0.12)+')','stroke-width':.8}));
  }
  /* axes */
  AXES.forEach((_,i)=>{
    const [x,y]=pt(i,R);
    svg.appendChild(E('line',{x1:C,y1:C,x2:x,y2:y,stroke:'rgba(125,190,230,.14)','stroke-width':.8}));
  });
  /* labels */
  AXES.forEach((ax,i)=>{
    const [x,y]=pt(i,R+30);
    const an = x>C+3?'start':(x<C-3?'end':'middle');
    const t=E('text',{x:x.toFixed(1),y:(y+3.5).toFixed(1),'text-anchor':an,
      fill:'#8CA6BF','font-size':'10.5','font-family':"'PingFang TC','Noto Sans CJK TC','Outfit',sans-serif"});
    t.textContent=LANG==='zh'?ax.zh:ax.en;
    svg.appendChild(t);
    const [mx,my]=pt(i,R*4/5);
    const d=E('circle',{cx:mx.toFixed(1),cy:my.toFixed(1),r:1.1,fill:'rgba(125,190,230,.3)'});
    svg.appendChild(d);
  });

  /* series */
  CMP.forEach((s,si)=>{
    const g=E('g',{});
    const pts=s.score.map((v,i)=>pt(i,R*v/5).map(n=>n.toFixed(1)).join(',')).join(' ');
    const op = rFocus!==null ? (rFocus===si?1:.12) : (rOff.has(s.key)?.10:(s.hero?.95:.72));
    g.setAttribute('opacity',op);
    g.style.transition='opacity .45s ease, transform .9s cubic-bezier(.22,.8,.28,1)';
    g.style.transformOrigin='180px 180px';
    g.style.transform='scale(0)';
    const area=E('polygon',{points:pts,fill:s.color,'fill-opacity':s.hero?.22:.10,
      stroke:s.color,'stroke-width':s.hero?2:1.3,'stroke-linejoin':'round'});
    if(s.hero){ area.setAttribute('filter','url(#glow)'); }
    g.appendChild(area);
    s.score.forEach((v,i)=>{
      const [x,y]=pt(i,R*v/5);
      g.appendChild(E('circle',{cx:x.toFixed(1),cy:y.toFixed(1),r:s.hero?3:2.2,fill:s.color}));
    });
    svg.appendChild(g);
    requestAnimationFrame(()=>setTimeout(()=>{g.style.transform='scale(1)';}, 60+si*110));
  });

  /* defs glow */
  const defs=document.createElementNS(NS,'defs');
  defs.innerHTML='<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">'+
    '<feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  svg.insertBefore(defs, svg.firstChild);

  /* legend */
  const lg=$('#legend'); lg.innerHTML='';
  CMP.forEach((s,si)=>{
    const b=document.createElement('button');
    b.className='lg'+(rOff.has(s.key)?' off':'')+(rFocus===si?' focus':'');
    b.style.color=s.color;
    b.innerHTML='<i></i><span style="color:#8CA6BF">'+(LANG==='zh'?s.name.zh:s.name.en)+'</span>';
    b.addEventListener('click',()=>{
      if(rOff.has(s.key)) rOff.delete(s.key); else rOff.add(s.key);
      rFocus=null; renderRadar();
    });
    b.addEventListener('mouseenter',()=>{ if(rFocus===null){ rFocus=si; paint(); } });
    b.addEventListener('mouseleave',()=>{ if(rFocus===si){ rFocus=null; paint(); } });
    lg.appendChild(b);
  });
  function paint(){
    const gs=svg.querySelectorAll('g');
    gs.forEach((g,i)=>{
      const s=CMP[i];
      g.setAttribute('opacity', rFocus!==null ? (rFocus===i?1:.12) : (rOff.has(s.key)?.10:(s.hero?.95:.72)));
    });
  }
}

/* ─────────── TABLE ─────────── */
function buildTable(){
  const tb=$('#tblBody'); if(!tb) return;
  tb.innerHTML='';
  CMP.forEach((s,si)=>{
    const tr=document.createElement('tr');
    if(s.hero) tr.className='hero-row';
    tr.innerHTML = '<td>'+(LANG==='zh'?s.name.zh:s.name.en)+'</td>' +
      s.cells.map(c=>'<td><span class="sw '+c.c+'">'+(LANG==='zh'?c.zh:c.en)+'</span></td>').join('');
    tr.addEventListener('click',()=>{
      rFocus = (rFocus===si) ? null : si;
      rOff.clear();
      $$('#tblBody tr').forEach(r=>r.classList.remove('sel'));
      if(rFocus!==null) tr.classList.add('sel');
      renderRadar();
    });
    tb.appendChild(tr);
  });
}

/* ─────────── ADVANTAGES ─────────── */
function buildAdv(){
  const g=$('#advGrid'); if(!g) return;
  g.innerHTML='';
  ADV.forEach((a,i)=>{
    const d=document.createElement('article');
    d.className='adv reveal'; d.dataset.d = i*80;
    d.innerHTML =
      '<span class="adv-n">'+a.n+' / 06</span>'+
      '<div class="adv-ico"><svg viewBox="0 0 32 32" fill="none">'+a.ico+'</svg></div>'+
      '<h3>'+(LANG==='zh'?a.zh.t:a.en.t)+'</h3>'+
      '<p>'+(LANG==='zh'?a.zh.d:a.en.d)+'</p>'+
      '<i class="adv-bar"></i>';
    g.appendChild(d);
    // pointer glow
    d.addEventListener('pointermove',e=>{
      const r=d.getBoundingClientRect();
      d.style.setProperty('--mx',(e.clientX-r.left)+'px');
      d.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
  });
  observeReveal(g);
}

/* ─────────── MARKET ─────────── */
function buildMarket(){
  const l=$('#mktList'); if(!l) return;
  l.innerHTML='';
  MKT.forEach((m,i)=>{
    const d=document.createElement('div');
    d.className='mkt reveal'; d.dataset.d=i*70;
    d.innerHTML =
      '<span class="mkt-n">0'+(i+1)+'</span>'+
      '<div class="mkt-main"><h3>'+(LANG==='zh'?m.zh.t:m.en.t)+'</h3><p>'+(LANG==='zh'?m.zh.d:m.en.d)+'</p></div>'+
      '<div class="mkt-val"><b>'+(LANG==='zh'?m.zh.v:m.en.v)+'</b><span>'+(LANG==='zh'?m.zh.u:m.en.u)+'</span></div>'+
      '<div class="mkt-bar"><i data-w="'+m.w+'"></i></div>';
    l.appendChild(d);
  });
  observeReveal(l, els=>{
    els.forEach(e=>{ const b=$('.mkt-bar i',e); if(b) setTimeout(()=>{ b.style.width=b.dataset.w+'%'; },200); });
  });
}

/* ─────────── FLOW ─────────── */
let fIdx=0, fTimer=null;
function buildFlow(){
  const s=$('#flowSteps'); if(!s) return;
  s.innerHTML='';
  FLOW.forEach((f,i)=>{
    const b=document.createElement('button');
    b.className='fstep'+(i===0?' on':''); b.type='button';
    b.innerHTML='<span class="fstep-d">0'+(i+1)+'</span><span class="fstep-t">'+(LANG==='zh'?f.zh.t:f.en.t)+'</span>';
    b.addEventListener('click',()=>setFlow(i,true));
    s.appendChild(b);
  });
  setFlow(0);
}
function setFlow(i,stop){
  const steps=$$('.fstep'); if(!steps.length) return;
  fIdx=(i+steps.length)%steps.length;
  steps.forEach((s,k)=>{
    s.classList.toggle('on', k===fIdx);
    s.classList.toggle('done', k<fIdx);
  });
  const f=FLOW[fIdx];
  $('#fpN').textContent='0'+(fIdx+1);
  $('#fpT').textContent = LANG==='zh'?f.zh.t:f.en.t;
  $('#fpD').textContent = LANG==='zh'?f.zh.d:f.en.d;
  const fill=$('#flowFill'); if(fill) fill.style.width = ((fIdx+1)/steps.length*100)+'%';
  if(stop) stopPlay();
}
function stopPlay(){
  if(fTimer){ clearInterval(fTimer); fTimer=null; $('#fpPlay').classList.remove('on'); }
}

/* ─────────── FORM ─────────── */
function form(){
  const f=$('#ctaForm'); if(!f) return;
  $$('.chip').forEach(c=>c.addEventListener('click',()=>{
    $$('.chip').forEach(x=>x.classList.remove('active')); c.classList.add('active');
  }));
  f.addEventListener('submit',e=>{
    e.preventDefault();
    const n=$('#fName'), m=$('#fMail');
    let ok=true;
    if(!n.value.trim()){ n.closest('.fld').classList.add('bad'); ok=false; }
    else n.closest('.fld').classList.remove('bad');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim())){ m.closest('.fld').classList.add('bad'); ok=false; }
    else m.closest('.fld').classList.remove('bad');
    if(!ok) return;
    const btn=$('#fSubmit');
    btn.disabled=true; btn.style.opacity=.6;
    setTimeout(()=>{
      $('#fOk').classList.add('on');
      btn.disabled=false; btn.style.opacity=1;
      f.reset();
    },700);
  });
  [$('#fName'),$('#fMail')].forEach(el=>el.addEventListener('input',()=>el.closest('.fld').classList.remove('bad')));
}

/* ─────────── MISC ─────────── */
function observeReveal(scope, extra){
  const io=new IntersectionObserver((es,o)=>{
    const hit=[];
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); hit.push(e.target); o.unobserve(e.target); } });
    if(hit.length && extra) extra(hit);
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  $$('.reveal',scope).forEach(e=>{
    e.style.transitionDelay=(e.dataset.d||0)+'ms';
    io.observe(e);
  });
}
function misc(){
  $('#yr').textContent = new Date().getFullYear();
  $('#toTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:REDUCED?'auto':'smooth'}));
  $('#fpPrev').addEventListener('click',()=>setFlow(fIdx-1,true));
  $('#fpNext').addEventListener('click',()=>setFlow(fIdx+1,true));
  $('#fpPlay').addEventListener('click',function(){
    if(fTimer){ stopPlay(); return; }
    this.classList.add('on');
    fTimer=setInterval(()=>setFlow(fIdx+1),2600);
  });
  const lang=()=>{ LANG = LANG==='zh'?'en':'zh'; applyI18N(); };
  $('#langBtn').addEventListener('click',lang);
  $('#langBtn2').addEventListener('click',lang);

  /* magnetic buttons */
  if(!window.matchMedia('(hover:none)').matches){
    $$('.magnetic').forEach(b=>{
      b.addEventListener('pointermove',e=>{
        const r=b.getBoundingClientRect();
        b.style.transform=`translate(${(e.clientX-(r.left+r.width/2))*.16}px,${(e.clientY-(r.top+r.height/2))*.22}px)`;
      });
      b.addEventListener('pointerleave',()=>{ b.style.transform=''; });
    });
  }
  /* smooth anchor with header offset */
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href');
      if(id==='#'||id.length<2) return;
      const t=$(id); if(!t) return;
      e.preventDefault();
      const y=t.getBoundingClientRect().top + window.scrollY - (window.innerWidth>1180?70:56);
      window.scrollTo({top:y,behavior:REDUCED?'auto':'smooth'});
    });
  });
}

/* ─────────── INIT ─────────── */
document.addEventListener('DOMContentLoaded',()=>{
  applyI18N();
  preloader(); cursor(); header(); navActive(); mobileNav();
  reveal(); ticker(); heroSim(); tabs(); buildFlow(); form(); misc();
  const tl=$('#tlFill');
  if(tl){
    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{ if(e.isIntersecting){ tl.style.transition='height 1.8s cubic-bezier(.22,.8,.28,1)'; tl.style.height='100%'; } });
    },{threshold:.2});
    io.observe(tl.parentElement);
  }
});
})();
