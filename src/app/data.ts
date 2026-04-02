export const YEARS = [2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040]

export const MILESTONES: Record<number,string> = {
  2026:'M0·M1 Seed', 2027:'M2·M3·M1b', 2028:'M4 Instit.',
  2030:'M4b P2', 2032:'P1 Ops', 2034:'P2 Ops',
}

export interface UnitInput {
  id: string; label: string; unit: string
  bear: number; base: number; bull: number
  note: string; confirmed: boolean
}

export interface UnitOutput {
  label: string; formula: string; unit: string
  bearVal: string; baseVal: string; bullVal: string; note: string
}

export interface Stream {
  id: string; name: string; dot: string
  level: 'ProjectCo'|'TopCo'; type: 'revenue'|'cost'|'control'
  status: 'confirmed'|'in-model'|'no-contract'|'pending'|'zeroed'
  description: string; formula: string
  inputs: UnitInput[]; outputs: UnitOutput[]
  operatingStart: number
  assumptions: {param:string; value:string; source:string}[]
}

export const STREAMS: Stream[] = [
  {
    id:'arbitrage', name:'Energy arbitrage (ERCOT grid)', dot:'#534AB7',
    level:'ProjectCo', type:'revenue', status:'in-model', operatingStart:2032,
    description:'Grid turbines pump water up using cheap surplus solar or overnight wind, then discharge and sell at evening peak prices. ERCOT West zone provides the highest spreads due to solar curtailment. Revenue is the volume of energy cycled multiplied by the net price spread after round-trip efficiency loss.',
    formula:'Revenue ($000s) = Grid MW × Alloc% × Cycles/day × Duration(hrs) × RT_Efficiency × Availability × 365days × NetSpread($/MWh) ÷ 1,000',
    inputs:[
      {id:'grid_mw',     label:'Grid turbine capacity',           unit:'MW',     bear:250,   base:600,    bull:600,   note:'Superfecta CONFIRMED: 2 × 300 MW bidirectional at 345 kV', confirmed:true},
      {id:'alloc_arb',   label:'% capacity allocated to arbitrage',unit:'%',     bear:0.55,  base:0.70,   bull:0.80,  note:'Remaining goes to ancillary services + peak firming', confirmed:false},
      {id:'cycles',      label:'Charge/discharge cycles per day', unit:'cycles', bear:1.5,   base:2.0,    bull:2.5,   note:'Depends on ERCOT price shape — NEEDS STRESS TEST vs real data', confirmed:false},
      {id:'duration',    label:'Storage duration per cycle',      unit:'hrs',    bear:12,    base:24,     bull:24,    note:'Phase 1 CONFIRMED: 24 hrs at 700 m head depth', confirmed:true},
      {id:'rt_eff',      label:'Round-trip efficiency',           unit:'%',      bear:0.78,  base:0.80,   bull:0.82,  note:'Industry standard for pumped hydro storage', confirmed:false},
      {id:'avail',       label:'Plant availability factor',       unit:'%',      bear:0.92,  base:0.95,   bull:0.97,  note:'Annual uptime target excluding planned maintenance windows', confirmed:false},
      {id:'sell_price',  label:'Peak sell price (ERCOT 2032)',    unit:'$/MWh',  bear:70,    base:88,     bull:115,   note:'ERCOT West evening peak. Escalates ~2%/yr to $104 by 2040 base.', confirmed:false},
      {id:'buy_price',   label:'Off-peak buy price (ERCOT 2032)', unit:'$/MWh',  bear:12,    base:20,     bull:25,    note:'Solar suppression hours. Can go negative. Average used here.', confirmed:false},
    ],
    outputs:[
      {label:'Annual arb volume',    formula:'Grid MW × Alloc% × Cycles × Duration × RT_Eff × Avail × 365 ÷ 1,000', unit:'GWh/yr', bearVal:'3,071', baseVal:'5,592', bullVal:'7,488', note:'GWh of energy cycled per year'},
      {label:'Net spread per MWh',   formula:'Sell price − (Buy price ÷ RT_Efficiency)',                               unit:'$/MWh',  bearVal:'$54',   baseVal:'$63',   bullVal:'$84',   note:'= $88 − ($20 ÷ 0.80) at base 2032'},
      {label:'Gross arb revenue',    formula:'Volume GWh × Net Spread × 1,000',                                        unit:'$000s',  bearVal:'$165,834', baseVal:'$352,320', bullVal:'$629,392', note:'BASE IS HIGH — needs ERCOT cycle validation'},
    ],
    assumptions:[
      {param:'Revenue flag',          value:'$352M BASE APPEARS HIGH — needs stress test', source:'Recommend Roger + Al Yablonsky review vs actual ERCOT dispatch data'},
      {param:'Sell price 2032-2040',  value:'$88→$104/MWh base (+2%/yr)',                  source:'Model assumption — re-eval semi-annually'},
      {param:'Buy price 2032-2040',   value:'$20→$24/MWh base (+2%/yr)',                   source:'Model assumption'},
      {param:'Bear: spread compression', value:'Spreads fall as more batteries enter ERCOT', source:'Modo Energy: ECRS cleared prices fell 29% in 2024'},
      {param:'UPHES advantage',       value:'24-hr duration protects vs 4-hr batteries',    source:'Long-duration storage retains spread advantage'},
    ],
  },
  {
    id:'dc_ppa', name:'AI data center PPA (dedicated turbine)', dot:'#3B6D11',
    level:'ProjectCo', type:'revenue', status:'no-contract', operatingStart:2032,
    description:'A dedicated 130 MW discharge-only turbine supplies a co-located AI data center via a private 34.5 kV power line — electrically isolated from ERCOT. The data center pays a long-term PPA at premium rates for certified 24/7 uninterruptible clean power. Premium justified by: zero grid risk, zero transmission cost, 100% clean certification every hour for Scope 2 reporting.',
    formula:'Revenue ($000s) = DC Turbine MW × Load Factor × 8,760 hrs × PPA Rate ($/MWh) ÷ 1,000',
    inputs:[
      {id:'dc_mw',     label:'DC turbine capacity',              unit:'MW',    bear:100,   base:130,    bull:130,   note:'Superfecta CONFIRMED: 130 MW dedicated discharge-only turbine', confirmed:true},
      {id:'dc_lf',     label:'Data center load factor',          unit:'%',     bear:0.75,  base:0.85,   bull:0.95,  note:'Consistent AI training + inference workload assumption', confirmed:false},
      {id:'ppa_rate',  label:'PPA rate — certified 24/7 clean',  unit:'$/MWh', bear:75,    base:95,     bull:120,   note:'Premium over grid: ~2-3× wholesale. NO CONTRACT SIGNED.', confirmed:false},
      {id:'ppa_esc',   label:'PPA annual price escalator',       unit:'%/yr',  bear:0.01,  base:0.02,   bull:0.03,  note:'CPI-linked escalation typical in long-term energy PPAs', confirmed:false},
      {id:'ppa_term',  label:'PPA contract term',                unit:'years', bear:10,    base:15,     bull:20,    note:'Long-term contracted revenue — stability is the premium', confirmed:false},
    ],
    outputs:[
      {label:'Annual DC energy delivered',    formula:'DC MW × Load Factor × 8,760 hrs ÷ 1,000', unit:'GWh/yr', bearVal:'657',    baseVal:'745',     bullVal:'1,082',  note:'GWh/yr delivered to data center'},
      {label:'Annual PPA revenue',            formula:'Energy GWh × PPA Rate × 1,000',             unit:'$000s',  bearVal:'$49,275', baseVal:'$70,737', bullVal:'$129,828', note:'= 745 GWh × $95/MWh at base 2032'},
      {label:'Revenue per MW of DC turbine',  formula:'Annual revenue ÷ DC turbine MW',            unit:'$/MW/yr',bearVal:'$493K',  baseVal:'$544K',   bullVal:'$999K',  note:'Efficiency benchmark'},
      {label:'PPA premium vs grid wholesale', formula:'PPA rate ÷ avg ERCOT wholesale (~$40/MWh)', unit:'× multiple', bearVal:'1.9×', baseVal:'2.4×',  bullVal:'3.0×',   note:'Justified by isolation + clean cert'},
    ],
    assumptions:[
      {param:'CONTRACT STATUS',  value:'NOT SIGNED — HIGHEST COMMERCIAL RISK', source:'Roger in meetings with DC real estate contacts. Zero revenue without signed contract.'},
      {param:'Target customer',  value:'Large hyperscaler or co-location operator', source:'Roger call — meetings underway'},
      {param:'Clean certification', value:'24/7 Matched CFE — 100% every hour', source:'Required for corporate Scope 2 net-zero commitments'},
      {param:'Harmonic isolation', value:'Full — dedicated turbine eliminates grid distortion risk', source:'AI data center memo — key differentiator'},
      {param:'PPA rate 2032→2040', value:'$95→$112/MWh base (+2%/yr)',          source:'Model assumption'},
    ],
  },
  {
    id:'ancillary', name:'Ancillary services + black start (ERCOT)', dot:'#534AB7',
    level:'ProjectCo', type:'revenue', status:'in-model', operatingStart:2032,
    description:'ERCOT pays storage assets a capacity payment to keep MW reserved and available for grid frequency response and emergency contingency. You earn the payment whether dispatched or not. UPHES earns a 10% inertia premium over batteries because its spinning hydro turbines provide physical grid inertia that inverter-based batteries cannot replicate. Black start is a separate exclusive ERCOT programme paying capability fees to assets certified to restart the Texas grid from a complete blackout.',
    formula:'AS Revenue = AS_MW × AS_Price($/MW/hr) × Hours_Cleared × (1 + Inertia_Premium)\nBlack Start = Total_Grid_MW × Black_Start_Rate($/MW/yr)',
    inputs:[
      {id:'as_alloc',    label:'% grid capacity reserved for AS',  unit:'%',      bear:0.15, base:0.25,  bull:0.30, note:'Reserved MW not available for arbitrage simultaneously', confirmed:false},
      {id:'as_price',    label:'AS clearing price (ERCOT blended)', unit:'$/MW/hr',bear:3.0,  base:5.0,   bull:7.0,  note:'ECRS/Non-Spin/Responsive Reserve blended. DECLINING TREND.', confirmed:false},
      {id:'as_hrs',      label:'Hours cleared per year',            unit:'hrs/yr', bear:5500, base:7000,  bull:8200, note:'~80% of year at base. Dispatched by ERCOT as needed.', confirmed:false},
      {id:'inertia_prem',label:'Inertia premium vs inverter-based', unit:'%',      bear:0.05, base:0.10,  bull:0.20, note:'Spinning mass advantage. ERCOT recognises and pays for this.', confirmed:false},
      {id:'bs_rate',     label:'Black start capability rate',       unit:'$/MW/yr',bear:5,    base:10,    bull:15,   note:'Annual ERCOT payment per MW of certified black start capacity', confirmed:false},
    ],
    outputs:[
      {label:'AS capacity allocated',           formula:'Grid MW × AS Alloc%',                                    unit:'MW',    bearVal:'90',     baseVal:'150',    bullVal:'180',    note:'MW reserved for ancillary'},
      {label:'Base AS revenue (pre-premium)',   formula:'AS MW × AS Price × Hours ÷ 1,000',                       unit:'$000s', bearVal:'$2,475', baseVal:'$5,250', bullVal:'$10,332', note:'Before inertia premium'},
      {label:'Inertia premium value',           formula:'Base AS × Inertia Premium%',                             unit:'$000s', bearVal:'$124',   baseVal:'$525',   bullVal:'$2,066', note:'UPHES spinning mass advantage'},
      {label:'Total ancillary services revenue',formula:'Base + Inertia Premium',                                  unit:'$000s', bearVal:'$2,599', baseVal:'$5,775', bullVal:'$12,398', note:'Combined AS revenue'},
      {label:'Black start revenue',             formula:'Total Grid MW × Black Start Rate',                        unit:'$000s', bearVal:'$3,000', baseVal:'$6,000', bullVal:'$9,000', note:'= 600 MW × $10/MW/yr base'},
      {label:'TOTAL: ancillary + black start',  formula:'AS Total + Black Start',                                  unit:'$000s', bearVal:'$5,599', baseVal:'$11,775', bullVal:'$21,398', note:'Combined stream'},
    ],
    assumptions:[
      {param:'AS price trend',       value:'DECLINING: ECRS fell 29% in 2024',    source:'ERCOT market data — battery fleet expanding'},
      {param:'Bear case',            value:'Prices compress 40% by 2036',          source:'Continued ERCOT battery buildout'},
      {param:'Inertia moat',         value:'Physical spinning mass — cannot be replicated by batteries', source:'Industry analysis'},
      {param:'Black start exclusivity', value:'Small number of ERCOT-certified assets — exclusive', source:'ERCOT black start programme'},
    ],
  },
  {
    id:'peak', name:'Peak load firming', dot:'#534AB7',
    level:'ProjectCo', type:'revenue', status:'in-model', operatingStart:2032,
    description:'Discharge during the absolute highest-price hours — typically 5-9pm on summer weekdays when grid demand peaks and solar output falls simultaneously. Priced at spot market peak rates substantially above the daily average. Small MW allocation but premium pricing.',
    formula:'Revenue = Peak_MW × Peak_Price($/MWh) × Peak_Hours_per_Year',
    inputs:[
      {id:'pk_alloc', label:'% grid capacity for peak firming', unit:'%',     bear:0.03, base:0.05,  bull:0.08, note:'Small allocation — targeted at highest-value hours only', confirmed:false},
      {id:'pk_price', label:'Peak dispatch price (ERCOT)',      unit:'$/MWh', bear:100,  base:130,   bull:200,  note:'5-9pm summer peak. Escalates ~2.5%/yr to $154 by 2040 base.', confirmed:false},
      {id:'pk_hrs',   label:'Peak load firming hours/year',     unit:'hrs',   bear:200,  base:300,   bull:450,  note:'Target absolute peak hours — select highest-price dispatch windows', confirmed:false},
    ],
    outputs:[
      {label:'Peak MW allocated',      formula:'Grid MW × Peak Alloc%',              unit:'MW',    bearVal:'18',     baseVal:'30',     bullVal:'48',     note:''},
      {label:'Peak firming revenue',   formula:'Peak MW × Price × Hours ÷ 1,000',    unit:'$000s', bearVal:'$540',   baseVal:'$1,170', bullVal:'$4,320', note:'2032 base: 30MW × $130 × 300 hrs'},
      {label:'Revenue per peak hour',  formula:'Peak MW × Price ÷ 1,000',            unit:'$000s/hr', bearVal:'$1.8', baseVal:'$3.9', bullVal:'$9.6',  note:'Hourly value when dispatched'},
    ],
    assumptions:[
      {param:'Price escalation', value:'$130(2032) → $154(2040) base (+2.5%/yr)', source:'Model assumption'},
      {param:'Logic',            value:'Small MW share at very high prices — portfolio optimisation', source:'DTAI manages dispatch timing'},
    ],
  },
  {
    id:'produced_water', name:'Produced water intake fee', dot:'#0F6E56',
    level:'ProjectCo', type:'revenue', status:'zeroed', operatingStart:2028,
    description:'Permian Basin O&G operators produce 20-22 million barrels/day of contaminated water as an unavoidable extraction byproduct. They currently pay $0.50-2.00/barrel to dispose of it in injection wells — and disposal capacity is running short. FCP accepts produced water as the UPHES reservoir fluid. Revenue model: either FCP earns a tipping fee per barrel (income) OR receives water at low/zero cost (replaces expensive aquifer water rights). Both directions are better than the original aquifer model. Economics currently zeroed — CRITICAL GAP.',
    formula:'Net Revenue ($000s) = (Tipping Fee/bbl − Processing Cost/bbl) × Volume(bbl/day) × 365 ÷ 1,000',
    inputs:[
      {id:'pw_vol',       label:'Daily PW volume accepted',              unit:'bbl/day', bear:50000,  base:200000, bull:500000, note:'Tiny fraction of 20-22M bbl/day available. Scalable.', confirmed:false},
      {id:'tipping_fee',  label:'Tipping fee from O&G operators',        unit:'$/bbl',   bear:0.00,   base:0.00,   bull:0.50,   note:'ZEROED — PENDING LOK HOME. O&G currently pays $0.50-2.00 to dispose.', confirmed:false},
      {id:'pw_proc_cost', label:'PW processing cost before injection',   unit:'$/bbl',   bear:0.30,   base:0.00,   bull:0.00,   note:'ZEROED — PENDING ENGINEERING. Must reduce TDS for turbine compatibility.', confirmed:false},
    ],
    outputs:[
      {label:'Net economics per barrel', formula:'Tipping fee − Processing cost',                 unit:'$/bbl',  bearVal:'($0.30)', baseVal:'$0.00', bullVal:'+$0.50', note:'Bear = net cost. Bull = net income.'},
      {label:'Annual gross tipping fee', formula:'Volume × Fee × 365 ÷ 1,000',                   unit:'$000s',  bearVal:'$0',      baseVal:'$0',    bullVal:'$91,250', note:'Bull: 500K bbl × $0.50 × 365 = $91M/yr'},
      {label:'Annual processing cost',   formula:'Volume × Proc cost × 365 ÷ 1,000',             unit:'$000s',  bearVal:'($5,475)',baseVal:'$0',    bullVal:'$0',     note:'Bear: 50K bbl × $0.30 × 365 = $5.5M'},
      {label:'Annual NET revenue',       formula:'Gross tipping fee − Processing cost',            unit:'$000s',  bearVal:'($5,475)',baseVal:'$0',    bullVal:'$91,250', note:'ALL ZEROS IN MODEL — pending Lok Home'},
    ],
    assumptions:[
      {param:'CRITICAL GAP',       value:'Tipping fee rate TBD — key to model accuracy', source:'Lok Home + Roger PW processing contacts'},
      {param:'Processing cost',    value:'TBD from engineering team', source:'TDS reduction to turbine-compatible levels required'},
      {param:'Permian Basin supply', value:'20-22M bbl/day available · 14,000+ miles pipeline', source:'Superfecta memo — confirmed'},
      {param:'O&G disposal cost',  value:'$0.50-2.00/bbl current',   source:'Industry benchmark — FCP target should undercut'},
      {param:'Bull case illustration', value:'500K bbl/day × $0.50 net = $91M/yr', source:'Illustrative only — activate when Lok Home confirms'},
    ],
  },
  {
    id:'aggregate', name:'Rock / aggregate byproduct', dot:'#854F0B',
    level:'ProjectCo', type:'revenue', status:'pending', operatingStart:2028,
    description:'Every metre the TBM drills to create the lower reservoir tunnels produces crushed rock that must come to the surface — it cannot be left underground. The rock arrives in aggregate-sized pieces. Once the TBM is at depth, the marginal cost of producing this aggregate is near zero — the machine is running anyway for the reservoir. 13.5 million tonnes at 18 GWH is confirmed in the Superfecta deck. Permian Basin has intense demand. Rail proximity is a site selection criterion.',
    formula:'Net Revenue = (Sale Price/tonne − Transport Cost/tonne) × Volume (million tonnes)',
    inputs:[
      {id:'agg_vol_p1',    label:'Volume — Phase 1 (3 GWH build)',   unit:'M tonnes', bear:1.5,  base:2.25, bull:2.5,  note:'Pro-rata from 13.5M at 18GWH. Generated during 2028-2031 build.', confirmed:false},
      {id:'agg_vol_total', label:'Volume — full Phase 2 (18 GWH)',   unit:'M tonnes', bear:10,   base:13.5, bull:15,   note:'CONFIRMED in Superfecta deck', confirmed:true},
      {id:'agg_price',     label:'Aggregate sale price (market)',     unit:'$/tonne',  bear:8,    base:12,   bull:15,   note:'Permian Basin aggregate market — PENDING Jill Shackelford', confirmed:false},
      {id:'agg_transport', label:'Transport cost to rail / market',   unit:'$/tonne',  bear:6,    base:4,    bull:2,    note:'Depends on rail proximity — key site selection criterion', confirmed:false},
    ],
    outputs:[
      {label:'Net margin per tonne',       formula:'Sale price − Transport cost',               unit:'$/tonne',  bearVal:'$2',    baseVal:'$8',    bullVal:'$13',    note:'Wider range than typical — transport is key variable'},
      {label:'Phase 1 gross revenue',      formula:'P1 volume × Sale price',                    unit:'$M gross', bearVal:'$12M',  baseVal:'$27M',  bullVal:'$37.5M', note:'During construction phase 2028-2031'},
      {label:'Phase 1 net revenue',        formula:'P1 volume × Net margin',                    unit:'$M net',   bearVal:'$3M',   baseVal:'$18M',  bullVal:'$32.5M', note:'Near-zero production cost'},
      {label:'Full build total potential', formula:'13.5M tonnes × Net margin',                 unit:'$M net',   bearVal:'$27M',  baseVal:'$108M', bullVal:'$175.5M', note:'Over full Phase 2 build period'},
    ],
    assumptions:[
      {param:'Volume confirmed',  value:'13.5M tonnes at 18 GWH',        source:'Superfecta deck — confirmed by Roger'},
      {param:'Price PENDING',     value:'$8-15/tonne — Jill Shackelford', source:'PENDING advisory input'},
      {param:'Transport PENDING', value:'$3-6/tonne to rail',             source:'PENDING — depends on site selection'},
      {param:'Model status',      value:'ZEROED until Jill confirms',     source:'Activate inputs when confirmed'},
      {param:'Strategic note',    value:'Offsets tunnelling capex — TBM runs regardless', source:'Zero marginal cost argument'},
    ],
  },
]

// ─── PROJECT CAPEX (part of $700M TIC) ────────────────────────────────────────
export interface CapexItem {
  category: string
  item: string
  bear: number; base: number; bull: number
  unit: string
  phase: 'Development'|'Construction'|'Both'
  benchmark: string
  watch: string
}

export const CAPEX_ITEMS: CapexItem[] = [
  {
    category:'Underground civil',
    item:'TBM procurement + mobilisation (per machine)',
    bear:45, base:65, bull:85,
    unit:'$M/machine',
    phase:'Construction',
    benchmark:'Herrenknecht hard-rock TBM: $15-25M purchase. Mob/demob + tooling adds 2-3×. Crossrail (London) averaged $60M/TBM all-in. Texas geology TBD.',
    watch:'Geology surprise risk — TBM performance in unknown Permian Basin rock. Core drilling 2026 is critical gate before committing.',
  },
  {
    category:'Underground civil',
    item:'Underground tunnel lining + waterproofing',
    bear:80, base:120, bull:180,
    unit:'$M total',
    phase:'Construction',
    benchmark:'Typical PSH: $800-1,500/m² of tunnel surface. At 700m depth and 1.75Mm³ reservoir volume — significant civil works. PW compatibility requires additional chemical-resistant lining.',
    watch:'Produced water corrosion risk on tunnel lining — standard shotcrete may not be sufficient at high TDS. Engineering specification needed.',
  },
  {
    category:'Underground civil',
    item:'Powerhouse cavern construction',
    bear:40, base:60, bull:90,
    unit:'$M total',
    phase:'Construction',
    benchmark:'Underground powerhouse: $500-900/kW for cavern excavation + fit-out. Comparable PSH projects (Bath County VA: $60M powerhouse 1985 = ~$180M today). Flat-ground surface powerhouse is cheaper.',
    watch:'UPHES uses surface + partial underground powerhouse — lower than mountain PSH but penstock length adds cost.',
  },
  {
    category:'Turbines & mechanical',
    item:'Oilfield-Grade Power Recovery Turbines (PRTs)',
    bear:120, base:175, bull:220,
    unit:'$M total (730 MW combined)',
    phase:'Construction',
    benchmark:'Standard Francis turbines: $150-200/kW installed. UPHES base: 730 MW × $175/kW = ~$128M. PRT premium (Super Duplex alloys + Tungsten Carbide HVOF coating): estimated +20-40% vs standard. Benchmark TBD from Al Yablonsky.',
    watch:'KEY SUPERFECTA CAPEX RISK — no confirmed PRT quote yet. Al Yablonsky must provide spec and cost before institutional financing. Could add $25-50M to TIC.',
  },
  {
    category:'Turbines & mechanical',
    item:'Penstocks, valves, water conveyance',
    bear:25, base:40, bull:60,
    unit:'$M total',
    phase:'Construction',
    benchmark:'Penstock: $800-1,500/m depending on diameter and pressure rating. At 700m head, high-pressure specs required. PW-resistant coating adds cost vs potable water.',
    watch:'Penstock material spec for produced water — standard carbon steel not compatible with high-TDS PW. Corrosion-resistant lining required.',
  },
  {
    category:'Electrical & grid',
    item:'Transformers, switchgear, 345kV transmission tie-in',
    bear:35, base:55, bull:80,
    unit:'$M total',
    phase:'Construction',
    benchmark:'345kV substation: $15-30M. Transformers (730 MW): $20-35M. Transmission line spur to nearest 345kV line: $1-3M/mile. Distance to grid is a site-selection variable.',
    watch:'Grid interconnect queue — ERCOT interconnect queue is 18-24 months minimum. Must apply at M1. Spur line distance adds $/mile that depends on final site selection.',
  },
  {
    category:'Produced water',
    item:'PW receiving, processing + injection plant',
    bear:15, base:30, bull:55,
    unit:'$M total',
    phase:'Construction',
    benchmark:'Permian Basin PW processing plant: $0.20-0.80/bbl/day capacity. At 200K bbl/day capacity = $40-160K/day × cost factor. Comparable produced water reuse facilities: $20-50M for this scale. NEW cost vs original aquifer design.',
    watch:'SUPERFECTA NEW COST — no equivalent in original UPHES design. Processing must reduce TDS below PRT turbine tolerance. Spec TBD from engineering team + Lok Home.',
  },
  {
    category:'Solar farm',
    item:'600 MWp solar farm (co-located)',
    bear:320, base:420, bull:510,
    unit:'$M total',
    phase:'Construction',
    benchmark:'US utility solar 2024: $0.60-0.85/W installed (Wood Mackenzie, SEIA Q3 2024). 600 MWp × $0.70/W base = $420M. Note: typically SEPARATE from UPHES TIC — may be financed independently or via PPA.',
    watch:'Solar vs PPA decision — if FCP owns the solar farm, this adds $420M to the balance sheet. If a solar developer builds it under a PPA, FCP pays $/MWh for energy instead. Dramatically changes capex structure. Decision needed.',
  },
  {
    category:'DTAI & technology',
    item:'DTAI digital twin AI platform — initial development',
    bear:3, base:8, bull:15,
    unit:'$M total',
    phase:'Development',
    benchmark:'Industrial AI/digital twin platform for energy infra: $3-15M development for first deployment. Comparable SCADA + optimization systems for storage: $2-8M. Benchmark: Siemens Energy digital twin projects $5-12M. This is FCP IP — amortised as intangible asset.',
    watch:'DTAI is both a cost AND a future IP licensing asset. Development should be capitalised as intangible, not expensed. Material to balance sheet NAV and future licensing revenue trajectory.',
  },
  {
    category:'Site & permitting',
    item:'Geological surveys, core drilling, site studies',
    bear:2, base:4, bull:8,
    unit:'$M total',
    phase:'Development',
    benchmark:'Core drilling program for 700m depth: $1-2M. Geophysical surveys: $0.5-1M. Hydrogeological study: $0.3-0.8M. Environmental baseline: $0.5-1.5M. Total pre-construction studies: $3-6M typical for this project scale.',
    watch:'Glass Ranch core drilling 2026 is the critical gate event — results determine whether site is viable under Superfecta criteria (PW proximity, dry area, TBM rock compatibility). No-go risk is real.',
  },
  {
    category:'Site & permitting',
    item:'Land acquisition / mineral rights / easements',
    bear:5, base:15, bull:40,
    unit:'$M total',
    phase:'Development',
    benchmark:'West Texas land: $500-2,000/acre surface rights. UPHES needs ~500-1,000 acres. Mineral rights in Permian Basin: significantly more expensive — must avoid active O&G producing zones. Rail corridor easement for aggregate adds cost.',
    watch:'Superfecta site criteria shift means avoiding active O&G mineral rights (expensive + TBM conflict) while staying near PW pipelines. "Dry area" sweet spot in Permian Basin must be identified and secured.',
  },
]

// ─── PROJECT OPERATING COSTS (post-construction, recurring) ───────────────────
export interface OpexItem {
  category: string
  item: string
  bear: number; base: number; bull: number
  unit: string
  formula: string
  benchmark: string
  watch: string
}

export const PROJECT_OPEX: OpexItem[] = [
  {
    category:'Operations & maintenance',
    item:'Annual O&M — standard PHES components',
    bear:3500, base:7000, bull:11000,
    unit:'$000s/yr',
    formula:'TIC × O&M rate% (bear: 0.5%, base: 1.0%, bull: 1.5%)',
    benchmark:'PHES industry O&M benchmark: 0.5-1.0% of TIC/yr (IRENA 2023, BloombergNEF PSH report). At $700M TIC: $3.5-7M/yr. Long-duration storage O&M is substantially lower than batteries (no degradation, no chemistry).',
    watch:'PRT turbines add O&M premium vs standard hydro — seal replacement, HVOF coating inspection, corrosion monitoring in PW environment. Estimate +0.2-0.3% TIC/yr. Al Yablonsky to confirm.',
  },
  {
    category:'Operations & maintenance',
    item:'PW processing — recurring cost per barrel',
    bear:0, base:0, bull:0,
    unit:'$000s/yr (zeroed)',
    formula:'Volume (bbl/day) × Processing cost ($/bbl) × 365',
    benchmark:'Permian Basin PW processing: $0.10-0.50/bbl for basic treatment (softening, TDS reduction). Full treatment to near-potable: $0.50-2.00/bbl. Target spec for UPHES: partial treatment only — reduce to PRT-compatible TDS. Likely $0.15-0.40/bbl.',
    watch:'ZEROED — critical gap. If processing costs $0.25/bbl on 200K bbl/day = $18M/yr recurring opex. Must be confirmed before financial model is defensible. Source: engineering team + Lok Home.',
  },
  {
    category:'Energy input',
    item:'Off-peak electricity purchase for pumping',
    bear:111848, base:111848, bull:111848,
    unit:'$000s/yr (2032)',
    formula:'Arbitrage volume (GWh) × Buy price ($/MWh) × 1,000 — already in P1 Revenue Model',
    benchmark:'ERCOT West off-peak (solar suppression): $0-25/MWh. Annual pumping energy cost at base: 5,592 GWh × $20/MWh = $111.8M/yr. This is the largest single recurring cost — directly linked to ERCOT solar curtailment pricing.',
    watch:'If solar is FCP-owned the pumping energy is near-zero marginal cost — fundamentally changes economics. Key: is FCP the solar owner or a PPA buyer? Decision needed.',
  },
  {
    category:'Debt service',
    item:'Annual debt service — project financing',
    bear:20000, base:25000, bull:35000,
    unit:'$000s/yr',
    formula:'Debt principal × Interest rate / loan term (simplified straight-line)',
    benchmark:'Infrastructure project finance: 50-60% debt typical. At $700M TIC, ~$350-420M debt. 20-25yr tenor at 5-7% = ~$25-35M/yr debt service. Comparable US pumped hydro finance: Bath County refinancing at 5.8% (2019). UPHES may face premium vs established technology.',
    watch:'Lenders unfamiliar with UPHES + produced water = technology risk premium on debt. First project likely 25-50bps above comparable conventional PSH. Second project will be better. DTAI/UPHES track record is the key to reducing this premium.',
  },
  {
    category:'Insurance',
    item:'Property, casualty + business interruption insurance',
    bear:1400, base:2100, bull:3500,
    unit:'$000s/yr',
    formula:'TIC × Insurance rate% (bear: 0.2%, base: 0.3%, bull: 0.5%)',
    benchmark:'Large power plant property insurance: 0.15-0.40% of replacement value/yr. At $700M TIC: $1.05-2.8M/yr. UPHES + PW = novel risk profile — insurers may apply loading. Business interruption for 130MW DC customer requires high BI limits.',
    watch:'New technology premium — underwriters will have limited comparable data. First plant likely pays 20-30% premium vs established PHES. Needs specialist energy insurer (Marsh, AON, Willis Towers Watson).',
  },
  {
    category:'Land & infrastructure',
    item:'Land lease / mineral rights / rail easement',
    bear:300, base:600, bull:1200,
    unit:'$000s/yr',
    formula:'Annual lease rate × acreage + rail corridor easement',
    benchmark:'West Texas surface lease: $5-20/acre/yr. At 800 acres: $4-16K/yr surface. Mineral rights lease for non-producing areas: $10-30/acre/yr. Rail corridor easement: $50-200K/yr. Rail spur maintenance sharing agreement: variable.',
    watch:'Mineral rights in Permian Basin — even "dry areas" may have speculative mineral rights held by O&G companies. Negotiating access without triggering high O&G lease comparables requires careful structuring.',
  },
  {
    category:'Aggregate logistics',
    item:'Rail logistics for aggregate shipping',
    bear:0, base:0, bull:0,
    unit:'$000s/yr (zeroed)',
    formula:'Volume (tonnes) × Transport rate ($/tonne)',
    benchmark:'Rail bulk freight West Texas: $15-40/tonne for 200-500 mile haul. Short-haul truck to rail head: $3-6/tonne. If site near Class 1 rail (UP or BNSF), loading facility cost: $2-5M capex, minimal opex. Currently zeroed — activate with Jill Shackelford input.',
    watch:'Rail access is now a site selection criterion post-Superfecta. Sites without rail access within 10 miles make aggregate economics marginal.',
  },
]

// ─── TOPCO OPEX (FCP management company costs) ────────────────────────────────
export interface TopcoOpexItem {
  category: string
  item: string
  bear: number; base: number; bull: number
  unit: string
  phase: string
  benchmark: string
  watch: string
}

export const TOPCO_OPEX: TopcoOpexItem[] = [
  {
    category:'Headcount by function',
    item:'Engineering & technical team (FTE count)',
    bear:2, base:4, bull:7,
    unit:'FTE',
    phase:'Dev: 2-4 FTE → Construction: 5-8 FTE → Ops: 3-5 FTE',
    benchmark:'$500M+ infra project development: 8-15 FTE typical at peak (KPMG Infrastructure Advisory benchmark). UPHES complexity warrants higher technical headcount than standard PSH. Avg all-in cost $150-200K/FTE incl. benefits.',
    watch:'FTE ramps sharply 6 months before M3 (pre-institutional) — investors require technical team credibility. Under-resourcing here is the most common reason infrastructure development misses milestones.',
  },
  {
    category:'Headcount by function',
    item:'Business development & commercial (FTE)',
    bear:1, base:2, bull:3,
    unit:'FTE',
    phase:'Dev: 1-2 FTE → Active from M1 through M5',
    benchmark:'Landowner, offtake, investor, O&G and data center origination. Typical $150-180K/FTE all-in. Key deliverable: signed data center PPA and PW supply/tipping fee agreement before M4.',
    watch:'Data center PPA and PW agreement are the two contracts that de-risk the entire revenue model. These must be BD\'s primary focus from M1.',
  },
  {
    category:'Headcount by function',
    item:'Finance, legal & administration (FTE)',
    bear:1, base:2, bull:3,
    unit:'FTE',
    phase:'Fractional pre-M4 → full-time at M4',
    benchmark:'Typical split: fractional CFO + part-time legal pre-institutional close. Full-time CFO + in-house counsel required by institutional investors. Controller + finance analyst added at M5. All-in: $180-260K/FTE senior, $80-120K/FTE analyst.',
    watch:'Institutional investors (M4) require audited financials and full-time senior finance. Fractional CFO adequate through M3 only.',
  },
  {
    category:'External advisors',
    item:'Legal — project finance, IP, corporate',
    bear:150, base:350, bull:700,
    unit:'$000s/yr',
    phase:'Ramps at each funding milestone',
    benchmark:'Project finance legal (Milbank, Latham, White & Case): $800-1,500/hr partners. M4 institutional close typically $500K-2M in legal fees. Ongoing corporate: $150-300K/yr. IP filing + prosecution: $100-200K/yr. Permian Basin mineral rights: specialist Texas land counsel.',
    watch:'M4 institutional close legal costs are large and lumpy — budget $750K-1.5M in the year of close, not an annualised run-rate.',
  },
  {
    category:'External advisors',
    item:'External engineering consultants',
    bear:200, base:500, bull:1000,
    unit:'$000s/yr',
    phase:'Peaks in development phase (2026-2028)',
    benchmark:'Independent engineer for project finance: $200-500K/yr. Technical due diligence for institutional: $300-600K one-time. Underground engineering specialists: $250-600/hr. Peaks at 90% engineering phase (M3) and institutional due diligence (M4). Sharply drops post-construction.',
    watch:'Institutional investors require an Independent Engineer certification — not optional. Budget $300-500K for IE engagement in M3-M4 year.',
  },
  {
    category:'External advisors',
    item:'Financial advisors + investment banking (M&A/placement)',
    bear:0, base:500, bull:1500,
    unit:'$000s per round',
    phase:'Fee at each equity closing (not annual)',
    benchmark:'Placement agent for $5M seed: 3-5% = $150-250K. Pre-institutional $20M: 2-4% = $400-800K. Institutional $700M: 0.5-1.5% = $3.5-10.5M (but typically structured as success fee to ProjectCo). Forecastr fees separate.',
    watch:'Institutional placement fees are very large — $3.5-10M at M4. Must clarify whether advisory fees paid by TopCo or ProjectCo. This dramatically affects TopCo cash flow model.',
  },
  {
    category:'Technology',
    item:'DTAI platform — ongoing dev, hosting, maintenance',
    bear:200, base:500, bull:1200,
    unit:'$000s/yr',
    phase:'Grows from MVP (2026) to production (2032+)',
    benchmark:'Cloud infrastructure for industrial AI: $50-200K/yr AWS/GCP. ML engineering team (if contracted): $150-400K/yr. Real-time SCADA + AI platform licensing for comparable assets: $300-800K/yr. Internal dev: capitalise as intangible where possible.',
    watch:'DTAI is both a cost center AND the IP asset that generates licensing revenue from 2031. Development costs should be tracked separately and capitalised as intangible — critical for NAV calculation and future IP licensing valuation.',
  },
  {
    category:'G&A',
    item:'Office, insurance, audit, travel (all-in G&A)',
    bear:300, base:550, bull:900,
    unit:'$000s/yr',
    phase:'Grows with team and project count',
    benchmark:'D&O insurance for early-stage infra: $50-150K/yr pre-institutional; $200-400K/yr post-institutional (higher limits required). Audit: $80-150K/yr pre-instit.; $200-350K/yr post. Travel for Permian Basin site visits, ERCOT, investor meetings: $60-120K/yr. Office/co-working: $30-80K/yr.',
    watch:'D&O insurance steps sharply at M4 — institutional investors require meaningful D&O coverage. Budget a step-up from ~$80K to ~$300K/yr at institutional close.',
  },
]

export const EQUITY_ROUNDS = [
  {round:'TopCo launch',          milestone:'M0 — seed',       year:2026, pct:null,  valuation:'—',                                 proceeds:null,  stake:'80%', basis:null},
  {round:'P1 seed',               milestone:'M2 — $5M raise',  year:2027, pct:'20%', valuation:'~$10M pre-money',                   proceeds:2000,  stake:'64%', basis:500},
  {round:'P1 pre-institutional',  milestone:'M3 — $20M raise', year:2027, pct:'20%', valuation:'~$60M pre-money',                   proceeds:12000, stake:'51%', basis:500},
  {round:'P1 institutional',      milestone:'M4 — $700M TIC',  year:2028, pct:'50%', valuation:'~$350M equity (50/50 D/E on $700M TIC)', proceeds:175000,stake:'10%', basis:1500},
  {round:'P2 seed',               milestone:'M1b',              year:2028, pct:'20%', valuation:'Same structure as P1',              proceeds:2000,  stake:'—',   basis:300},
  {round:'P2 pre-institutional',  milestone:'M3b',              year:2029, pct:'20%', valuation:'Same structure',                    proceeds:12000, stake:'—',   basis:400},
  {round:'P2 institutional',      milestone:'M4b',              year:2030, pct:'50%', valuation:'Same structure',                    proceeds:175000,stake:'10%', basis:1200},
]
