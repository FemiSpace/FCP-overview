export const YEARS = [2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040]

export const MILESTONES: Record<number,string> = {
  2026:'M0·M1 Seed', 2027:'M2·M3·M1b', 2028:'M4 Instit.',
  2030:'M4b P2', 2032:'P1 Ops', 2034:'P2 Ops',
}

export interface UnitInput {
  id: string; label: string; unit: string
  bear: number; base: number; bull: number
  note: string; confirmed: boolean
  source?: string; sourceUrl?: string
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
  assumptions: {param:string; value:string; source:string; url?:string}[]
}

export const STREAMS: Stream[] = [
  {
    id:'arbitrage', name:'Energy arbitrage (ERCOT grid)', dot:'#534AB7',
    level:'ProjectCo', type:'revenue', status:'in-model', operatingStart:2032,
    description:'Grid turbines pump water up using cheap off-peak electricity, then discharge and sell at peak ERCOT prices. Revenue = volume cycled × net price spread after round-trip efficiency loss. Largest modelled stream — most sensitive to ERCOT price assumptions which must be validated with actual dispatch modelling before presenting to investors.',
    formula:'Revenue ($000s) = Grid_MW × Alloc% × Cycles/day × Duration(hrs) × RT_Efficiency × Availability × 365 × NetSpread($/MWh) ÷ 1,000',
    inputs:[
      {id:'grid_mw',    label:'Grid turbine capacity',             unit:'MW',     bear:250,  base:600,  bull:600,
       note:'Superfecta CONFIRMED: 2 × 300 MW bidirectional at 345 kV',
       confirmed:true, source:'Superfecta docs — Roger Caldwell March 2026'},
      {id:'alloc_arb',  label:'% capacity allocated to arbitrage', unit:'%',      bear:0.55, base:0.70, bull:0.80,
       note:'Balance reserved for ancillary services + peak firming. FCP internal assumption.',
       confirmed:false, source:'FCP internal assumption — not externally validated'},
      {id:'cycles',     label:'Charge/discharge cycles per day',   unit:'cycles', bear:1.0,  base:1.5,  bull:2.0,
       note:'RESEARCHED Modo Energy 2024: ERCOT Top-Bottom 1hr spreads averaged $98/MWh — a 61% drop from 2023. Battery saturation compressing short-duration spreads. 24-hr UPHES has structural advantage but realistic cycles depend on ERCOT dispatch modelling.',
       confirmed:false,
       source:'Modo Energy: ERCOT power prices 2024 — energy arbitrage & ancillary services',
       sourceUrl:'https://modoenergy.com/research/ercot-power-prices-2024-energy-arbitrage-ancillary-services-hub-load-zone-west-north-south-houston-panhandle'},
      {id:'duration',   label:'Storage duration per cycle',        unit:'hrs',    bear:12,   base:24,   bull:24,
       note:'Phase 1 CONFIRMED: 24 hrs at 700m head depth',
       confirmed:true, source:'Superfecta memo — Roger Caldwell March 2026'},
      {id:'rt_eff',     label:'Round-trip efficiency',             unit:'%',      bear:0.78, base:0.80, bull:0.82,
       note:'Industry standard for pumped hydro. NREL ATB 2023 uses 80% for PSH base case.',
       confirmed:false,
       source:'NREL Annual Technology Baseline 2023 — Pumped Storage Hydropower',
       sourceUrl:'https://atb.nrel.gov/electricity/2023/pumped_storage_hydropower'},
      {id:'avail',      label:'Plant availability factor',         unit:'%',      bear:0.79, base:0.83, bull:0.90,
       note:'RESEARCHED. DOE Hydropower Market Report 2023: actual US hydro availability was stable at 79% (small units), 83% (medium), 78% (large) from 2019-2021. New plant with modern controls may achieve higher — flagged as upside. 95% original was unsourced.',
       confirmed:false,
       source:'DOE US Hydropower Market Report 2023 — Hydropower availability factors 2019-2021',
       sourceUrl:'https://www.energy.gov/eere/water/hydropower-market-reports'},
      {id:'sell_price', label:'Peak sell price (ERCOT 2032 est.)', unit:'$/MWh',  bear:55,   base:75,   bull:120,
       note:'RESEARCHED. ERCOT 2024 annual average: $26/MWh (Modo Energy). EIA 2025 forecast: $27-34/MWh average. Summer on-peak July-Aug 2025 forwards: $110-165/MWh (S&P Global). $75/MWh base for 2032 assumes moderate recovery from data center load growth. $88 original was not based on any source.',
       confirmed:false,
       source:'S&P Global: Texas summer power prices 2025; EIA STEO Jan 2025; Modo Energy ERCOT 2024 review',
       sourceUrl:'https://www.spglobal.com/energy/en/news-research/latest-news/electric-power/042325-outlook-2025-texas-summer-power-prices-may-top-2024-levels-on-weather-strong-gas'},
      {id:'buy_price',  label:'Off-peak buy price (ERCOT 2032 est.)', unit:'$/MWh', bear:15, base:28,   bull:35,
       note:'RESEARCHED. EIA projects ERCOT avg $27-34/MWh for 2025. Off-peak solar suppression hours can go near zero but average pumping window is $15-28/MWh. $20 original was too low — not based on any source.',
       confirmed:false,
       source:'EIA Short-Term Energy Outlook Jan 2025; Modo Energy ERCOT 2024 annual review',
       sourceUrl:'https://www.eia.gov/todayinenergy/detail.php?id=64384'},
    ],
    outputs:[
      {label:'Annual arbitrage volume',  formula:'Grid MW × Alloc% × Cycles × Duration × RT_Eff × Avail × 365 ÷ 1,000', unit:'GWh/yr',
       bearVal:'2,045', baseVal:'4,194', bullVal:'6,324',
       note:'RESEARCHED — cycles/day  1.5 base'},
      {label:'Net spread per MWh',       formula:'Sell price − (Buy price ÷ RT_Efficiency)',                                unit:'$/MWh',
       bearVal:'$36',   baseVal:'$40',   bullVal:'$96',
       note:'RESEARCHED: = $75 − ($28 ÷ 0.80) at base.'},
      {label:'GROSS ARBITRAGE REVENUE',  formula:'Volume GWh × Net Spread × 1,000',                                         unit:'$000s',
       bearVal:'$73,620', baseVal:'$167,760', bullVal:'$607,104',
       note:' Needs full ERCOT dispatch model to validate.'},
    ],
    assumptions:[
      {param:'⚠ CRITICAL FLAG',
       value:'This stream requires a full ERCOT nodal dispatch model before presenting to TJ Rogers. The simplified formula cannot capture actual price shape, curtailment, or dispatch optimisation.',
       source:'Recommendation based on Modo Energy and E3 ERCOT 2024 market analysis',
       url:'https://www.ethree.com/wp-content/uploads/2024/12/E3-2024-ERCOT-Market-Update.pdf'},
      {param:'ERCOT 2024 annual avg price',
       value:'$26/MWh real-time (down 46% from $48/MWh in 2023). Day-ahead: $28/MWh. Solar + battery build drove the decline.',
       source:'Modo Energy: How did ERCOT power prices evolve in 2024?',
       url:'https://modoenergy.com/research/en/ercot-power-prices-2024-energy-arbitrage-ancillary-services-hub-load-zone-west-north-south-houston-panhandle'},
      {param:'ERCOT summer forward prices 2025',
       value:'July-August on-peak forwards: $110-165/MWh (S&P Global, April 2025). Annual EIA average forecast: $27-34/MWh.',
       source:'S&P Global: Outlook 2025 Texas summer power prices',
       url:'https://www.spglobal.com/energy/en/news-research/latest-news/electric-power/042325-outlook-2025-texas-summer-power-prices-may-top-2024-levels-on-weather-strong-gas'},
      {param:'UPHES 24-hr duration advantage',
       value:'4-hr batteries dominate ERCOT short-duration arbitrage. 24-hr UPHES captures price windows unavailable to batteries — moat grows as battery saturation compresses 4-hr spreads.',
       source:'E3 2024 ERCOT Market Update — storage revenue analysis',
       url:'https://www.ethree.com/wp-content/uploads/2024/12/E3-2024-ERCOT-Market-Update.pdf'},
      {param:'Data center load growth',
       value:'Texas AI data center demand growing rapidly. 13 TWh added 2019-2023. Stargate 15 GW supercomputer underway in Texas. Expected to tighten peak supply and support higher peak prices by 2032.',
       source:'Data Center Market Outlook 2030 — LeanRS',
       url:'https://www.leanrs.com/insights/global-data-center-market-outlook-2030'},
    ]
  },

  {
    id:'dc_ppa', name:'AI data center PPA (dedicated turbine)', dot:'#3B6D11',
    level:'ProjectCo', type:'revenue', status:'no-contract', operatingStart:2032,
    description:'A dedicated 130 MW discharge-only turbine supplies a co-located AI data center via a private 34.5 kV power line — fully isolated from ERCOT. The data center pays a long-term PPA for certified 24/7 firm clean power. FCP delivers a fundamentally superior product vs hybrid renewable PPAs: firm, dispatchable, physically isolated, zero grid risk, zero transmission cost.',
    formula:'Revenue ($000s) = DC_MW × Load_Factor × 8,760 hrs × PPA_Rate($/MWh) ÷ 1,000',
    inputs:[
      {id:'dc_mw',    label:'DC turbine capacity',              unit:'MW',    bear:100, base:130, bull:130,
       note:'Superfecta CONFIRMED: 130 MW dedicated discharge-only turbine',
       confirmed:true, source:'Superfecta docs — Roger Caldwell March 2026'},
      {id:'dc_lf',   label:'Data center load factor',          unit:'%',     bear:0.75, base:0.85, bull:0.95,
       note:'AI GPU training + inference clusters run at very high utilisation 24/7.',
       confirmed:false, source:'FCP assumption — consistent with hyperscaler GPU cluster profiles'},
      {id:'ppa_rate',label:'PPA rate — certified 24/7 clean',  unit:'$/MWh', bear:70,  base:85,   bull:110,
       note:'RESEARCHED. ERCOT wholesale avg ~$30/MWh + green reliability premium $40-48/MWh (McKinsey/LDES 2022) = $70-78/MWh floor for 24/7 CFE from hybrid systems. Hybrid 24/7 PPA costs >$200/MWh (McKinsey 2022). FCP\'s firm hydro at $85/MWh is dramatically cheaper and genuinely dispatchable — defensible base.',
       confirmed:false,
       source:'McKinsey: How hyperscalers are fueling the race for 24/7 clean power (Dec 2024); LeanRS Data Center Market Outlook 2030',
       sourceUrl:'https://www.mckinsey.com/industries/electric-power-and-natural-gas/our-insights/how-hyperscalers-are-fueling-the-race-for-24-7-clean-power'},
      {id:'ppa_esc', label:'PPA annual price escalator',       unit:'%/yr',  bear:0.01, base:0.02, bull:0.03,
       note:'CPI-linked escalation is standard in long-term US energy PPAs.',
       confirmed:false, source:'Standard US energy PPA structure'},
      {id:'ppa_term',label:'PPA contract term',                unit:'years', bear:10,  base:15,   bull:20,
       note:'15-20yr terms common for hyperscaler clean energy deals.',
       confirmed:false,
       source:'S&P Global: Hyperscaler procurement to shape US power investment Dec 2025',
       sourceUrl:'https://www.spglobal.com/sustainable1/en/insights/special-editorial/hyperscaler-procurement-to-shape-us-power-investment'},
    ],
    outputs:[
      {label:'Annual DC energy delivered', formula:'DC MW × Load Factor × 8,760 ÷ 1,000',  unit:'GWh/yr',
       bearVal:'657',    baseVal:'965',    bullVal:'1,082', note:'130 MW × 85% LF × 8,760 hrs at base'},
      {label:'DC PPA REVENUE',             formula:'Energy GWh × PPA Rate × 1,000',          unit:'$000s',
       bearVal:'$46,005', baseVal:'$82,025', bullVal:'$119,020', note:'CORRECTED from $70,737 — base now uses $85/MWh × 965 GWh'},
      {label:'PPA vs hybrid 24/7 PPA cost',formula:'Hybrid 24/7 PPA benchmark',              unit:'comparison',
       bearVal:'>$200/MWh', baseVal:'FCP: $85/MWh', bullVal:'Saving: ~$115/MWh', note:'FCP significantly undercuts current 24/7 clean alternatives'},
    ],
    assumptions:[
      {param:'🔴 CONTRACT STATUS',
       value:'NOT SIGNED — zero revenue without signed agreement. Most important pending commercial item.',
       source:'Roger Caldwell call — meetings underway with DC real estate contacts'},
      {param:'24/7 CFE green reliability premium',
       value:'"Green Reliability Premium" for 24/7 CFE is $40/MWh above wholesale today (2025), projected to rise to $48/MWh post-2026 as IRA tax incentives expire.',
       source:'Data Center Market Outlook 2030 — LeanRS 2025',
       url:'https://www.leanrs.com/insights/global-data-center-market-outlook-2030'},
      {param:'Hybrid 24/7 PPA benchmark cost',
       value:'McKinsey/LDES Council 2022: 24/7 green PPA using wind + solar + Li-ion hybrid costs >$200/MWh in most regions. FCP\'s $85/MWh firm hydro is dramatically cheaper and genuinely dispatchable.',
       source:'McKinsey: How hyperscalers are fueling the race for 24/7 clean power',
       url:'https://www.mckinsey.com/industries/electric-power-and-natural-gas/our-insights/how-hyperscalers-are-fueling-the-race-for-24-7-clean-power'},
      {param:'US hyperscaler clean energy demand',
       value:'US data centers contracted >80 GW of clean energy as of end-2025 (S&P Global). Big 4 hyperscalers spending $345B capex in 2025. 24/7 CFE is becoming non-negotiable for Scope 2 commitments.',
       source:'S&P Global Sustainable1: Hyperscaler procurement Dec 2025',
       url:'https://www.spglobal.com/sustainable1/en/insights/special-editorial/hyperscaler-procurement-to-shape-us-power-investment'},
    ]
  },

  {
    id:'ancillary', name:'Ancillary services + black start (ERCOT)', dot:'#534AB7',
    level:'ProjectCo', type:'revenue', status:'in-model', operatingStart:2032,
    description:'ERCOT pays storage assets a capacity payment to keep reserved MW available for grid frequency response. UPHES earns a premium over batteries due to physical inertia from spinning turbines — batteries cannot replicate this. Black start is a separate exclusive ERCOT programme paying certified assets to restart the Texas grid from a complete blackout.',
    formula:'AS Revenue = AS_MW × Price($/MW/hr) × Hours × (1 + Inertia_Premium)\nBlack Start = Total_Grid_MW × Black_Start_Rate($/MW/yr)',
    inputs:[
      {id:'as_alloc',    label:'% grid capacity reserved for AS',   unit:'%',       bear:0.15, base:0.25, bull:0.30,
       note:'Reserved MW not available for arbitrage simultaneously.', confirmed:false, source:'FCP internal assumption'},
      {id:'as_price',    label:'AS clearing price (ERCOT blended)',  unit:'$/MW/hr', bear:2.5,  base:4.5,  bull:6.5,
       note:'RESEARCHED. ECRS averaged $4.74/MW/hr in Jul-Aug 2024 — down 29% YoY (Modo Energy Aug 2024). Blended ECRS + Non-Spin + RRS. Declining trend as battery fleet expands in ERCOT.',
       confirmed:false,
       source:'Modo Energy: How has the ECRS market evolved since its launch? Aug 2024',
       sourceUrl:'https://modoenergy.com/research/ercot-battery-energy-storage-systems-ecrs-ancillary-services-2024-revenues-capacity-allocation-strategy-cycles-saturation'},
      {id:'as_hrs',      label:'Hours cleared per year',             unit:'hrs/yr',  bear:5000, base:7000, bull:8200,
       note:'~80% of year at base. ERCOT procures AS continuously — clearing varies by season and conditions.',
       confirmed:false,
       source:'Potomac Economics ERCOT Monthly Market Report 2024',
       sourceUrl:'https://www.potomaceconomics.com/wp-content/uploads/2025/07/2025-06_Nodal_Monthly_Report.pdf'},
      {id:'inertia_prem',label:'Inertia premium vs inverter-based',  unit:'%',       bear:0.05, base:0.10, bull:0.20,
       note:'UPHES spinning mass provides physical inertia — inverter-based batteries respond via software only. ERCOT explicitly notes hydro provides full frequency response within 20 seconds.',
       confirmed:false,
       source:'ERCOT Ancillary Services Study Sept 2024',
       sourceUrl:'https://www.ercot.com/files/docs/2024/10/07/ERCOT-Ancillary-Services-Study-Final-White-Paper.pdf'},
      {id:'bs_rate',     label:'Black start standby rate (per unit)', unit:'$/hr',   bear:50,   base:70,   bull:100,
       note:'CORRECTED STRUCTURE. ERCOT pays black start resources a competitive hourly standby cost ($/hr per unit) — NOT $/MW/yr. Wikipedia cites $70/hr as an example bid. Units are paid as bid at 85% assumed availability. At $70/hr × 8,760hrs × 85% availability = ~$520K/yr per certified unit regardless of MW capacity.',
       confirmed:false,
       source:'Wikipedia: Black start — ERCOT competitive procurement structure',
       sourceUrl:'https://en.wikipedia.org/wiki/Black_start'},
    ],
    outputs:[
      {label:'AS capacity allocated',         formula:'Grid MW × AS Alloc%',                             unit:'MW',
       bearVal:'90',     baseVal:'150',    bullVal:'180',    note:'= 600 MW × 25%'},
      {label:'Total ancillary services rev',  formula:'AS MW × Price × Hours × (1+Inertia) ÷ 1,000',    unit:'$000s',
       bearVal:'$1,890', baseVal:'$5,198', bullVal:'$11,466', note:'CORRECTED — AS price reduced from $5 to $4.5/MW/hr base'},
      {label:'Black start revenue',           formula:'Total Grid MW × Black Start Rate',                 unit:'$000s',
       bearVal:'$3,000', baseVal:'$6,000', bullVal:'$9,000',  note:'= 600 MW × $10/MW/yr'},
      {label:'TOTAL ANCILLARY + BLACK START', formula:'AS Revenue + Black Start',                         unit:'$000s',
       bearVal:'$2,262', baseVal:'$5,718', bullVal:'$12,211', note:'CORRECTED — black start restructured to ERCOT actual $/hr/unit format; AS price corrected to $4.5/MW/hr base'},
    ],
    assumptions:[
      {param:'ECRS price 2024 actual',
       value:'ECRS averaged $4.74/MW/hr in Jul-Aug 2024 — 29% lower than other AS products. E3: BESS earned ~$127/kW-year from all revenue streams in 2024, down from prior estimates of $475/kW-year.',
       source:'Modo Energy: ERCOT ECRS market evolution Aug 2024',
       url:'https://modoenergy.com/research/ercot-battery-energy-storage-systems-ecrs-ancillary-services-2024-revenues-capacity-allocation-strategy-cycles-saturation'},
      {param:'AS price compression trend',
       value:'AS prices declining structurally as ERCOT battery fleet expands. E3 2024: this is structural, not cyclical. Bear case: 40-50% compression from 2024 levels by 2032.',
       source:'E3 2024 ERCOT Market Update',
       url:'https://www.ethree.com/wp-content/uploads/2024/12/E3-2024-ERCOT-Market-Update.pdf'},
      {param:'UPHES inertia moat — sourced',
       value:'ERCOT Sept 2024 AS Study: hydro resources provide RRS in synchronous condenser mode — "full response when frequency is below 59.80 Hz within 20 seconds." Batteries cannot replicate this physical property.',
       source:'ERCOT Ancillary Services Study Sept 2024',
       url:'https://www.ercot.com/files/docs/2024/10/07/ERCOT-Ancillary-Services-Study-Final-White-Paper.pdf'},
    ]
  },

  {
    id:'peak', name:'Peak load firming', dot:'#534AB7',
    level:'ProjectCo', type:'revenue', status:'in-model', operatingStart:2032,
    description:'Discharge during absolute highest-price hours — summer weekday 5-9pm when solar drops and demand peaks simultaneously. Small MW allocation targeted at premium pricing windows only. DTAI optimises dispatch timing.',
    formula:'Revenue = Peak_MW × Peak_Price($/MWh) × Peak_Hours_per_Year',
    inputs:[
      {id:'pk_alloc', label:'% grid capacity for peak firming', unit:'%',     bear:0.03, base:0.05, bull:0.08,
       note:'Small allocation — targeted at absolute price-spike hours only.',
       confirmed:false, source:'FCP internal assumption'},
      {id:'pk_price', label:'Peak dispatch price (ERCOT)',      unit:'$/MWh', bear:80,   base:120,  bull:180,
       note:'RESEARCHED. S&P Global April 2025: ERCOT Jul-Aug on-peak forward curves at $110-165/MWh for 2025. $120/MWh base for 2032 is reasonable given data center load growth expected to tighten summer peaks.',
       confirmed:false,
       source:'S&P Global: Texas summer power prices 2025 outlook, April 2025',
       sourceUrl:'https://www.spglobal.com/energy/en/news-research/latest-news/electric-power/042325-outlook-2025-texas-summer-power-prices-may-top-2024-levels-on-weather-strong-gas'},
      {id:'pk_hrs',  label:'Peak load firming hours/year',     unit:'hrs',   bear:200,  base:300,  bull:450,
       note:'Target absolute peak windows only — summer afternoon and evening ramp hours.',
       confirmed:false, source:'FCP internal assumption'},
    ],
    outputs:[
      {label:'Peak MW allocated',    formula:'Grid MW × Peak Alloc%',           unit:'MW',
       bearVal:'18',   baseVal:'30',    bullVal:'48',   note:''},
      {label:'PEAK FIRMING REVENUE', formula:'Peak MW × Price × Hours ÷ 1,000', unit:'$000s',
       bearVal:'$432', baseVal:'$1,080', bullVal:'$3,888', note:'CORRECTED — base price raised to $120/MWh (sourced)'},
    ],
    assumptions:[
      {param:'Summer peak price basis',
       value:'S&P Global April 2025: ERCOT on-peak Jul forward ~$110/MWh, Aug above $167/MWh. $120/MWh base for 2032 assumes moderate recovery above 2025 forwards driven by data center load growth in Texas.',
       source:'S&P Global: Texas summer power prices 2025',
       url:'https://www.spglobal.com/energy/en/news-research/latest-news/electric-power/042325-outlook-2025-texas-summer-power-prices-may-top-2024-levels-on-weather-strong-gas'},
    ]
  },

  {
    id:'produced_water', name:'Produced water intake fee', dot:'#0F6E56',
    level:'ProjectCo', type:'revenue', status:'zeroed', operatingStart:2028,
    description:'Permian Basin O&G operators produce 20-22M barrels/day of contaminated water as an unavoidable extraction byproduct. They currently pay $0.50-2.00/barrel to dispose of it. FCP accepts it as the UPHES reservoir fluid. Economics: either FCP earns a tipping fee (income) or receives water at low/zero cost (vs costly aquifer rights). All currently zeroed — pending Lok Home confirmation.',
    formula:'Net Revenue ($000s) = (Tipping_Fee/bbl − Processing_Cost/bbl) × Volume(bbl/day) × 365 ÷ 1,000',
    inputs:[
      {id:'pw_vol',      label:'Daily PW volume accepted',        unit:'bbl/day', bear:50000,  base:200000, bull:500000,
       note:'Small fraction of 20-22M bbl/day available in Permian Basin.',
       confirmed:false, source:'Superfecta memo — Roger Caldwell March 2026'},
      {id:'tipping_fee', label:'Tipping fee from O&G ($/bbl)',   unit:'$/bbl',   bear:0.00,  base:0.00,  bull:0.50,
       note:'ZEROED — TBD from Lok Home. O&G pays $0.50-2.00/bbl currently to dispose. This is the critical gap.',
       confirmed:false, source:'PENDING — Lok Home + Roger PW contacts'},
      {id:'pw_proc',     label:'PW processing cost ($/bbl)',      unit:'$/bbl',   bear:0.30,  base:0.00,  bull:0.00,
       note:'ZEROED — TBD from engineering team. Must reduce TDS to PRT-compatible levels before reservoir injection.',
       confirmed:false, source:'PENDING — engineering team'},
    ],
    outputs:[
      {label:'Net economics per barrel', formula:'Tipping fee − Processing cost',  unit:'$/bbl',
       bearVal:'($0.30)', baseVal:'$0.00', bullVal:'+$0.50', note:'Bear = net cost. Bull = net income.'},
      {label:'Annual gross tipping fee', formula:'Volume × Fee × 365 ÷ 1,000',    unit:'$000s',
       bearVal:'$0',     baseVal:'$0',    bullVal:'$91,250', note:'Bull: 500K bbl × $0.50 × 365 — illustrative only'},
      {label:'ANNUAL NET REVENUE',       formula:'Gross fee − Processing cost',     unit:'$000s',
       bearVal:'($5,475)', baseVal:'$0',  bullVal:'$91,250', note:'ALL ZEROS — pending Lok Home'},
    ],
    assumptions:[
      {param:'🔴 CRITICAL GAP',
       value:'Tipping fee $/bbl TBD — key to model accuracy. If $0.25 net on 200K bbl/day = $18M/yr. Must confirm with Lok Home before model is defensible.',
       source:'FCP internal — data needed from Lok Home and Roger PW contacts'},
      {param:'Permian Basin PW volumes',
       value:'20-22M barrels/day produced water today, projected 32M bbl/day by 2035. 14,000+ miles of dedicated PW pipeline infrastructure.',
       source:'Superfecta memo — Roger Caldwell March 2026'},
      {param:'O&G current disposal cost',
       value:'$0.50-2.00/barrel to pump PW into injection wells. Disposal capacity running short. Regulatory pressure increasing due to induced seismicity.',
       source:'Superfecta memo — FCP analysis March 2026'},
    ]
  },

  {
    id:'aggregate', name:'Rock / aggregate byproduct', dot:'#854F0B',
    level:'ProjectCo', type:'revenue', status:'pending', operatingStart:2028,
    description:'TBM excavation to create the lower reservoir tunnels produces crushed rock that must be removed — unavoidable byproduct. 13.5M tonnes at 18 GWH confirmed in Superfecta deck. Near-zero marginal cost once TBM is at depth. Permian Basin road-building demand is strong. Rail proximity is a site selection criterion. Currently zeroed — pricing TBD from Jill Shackelford.',
    formula:'Net Revenue = (Sale_Price/tonne − Transport_Cost/tonne) × Volume (million tonnes)',
    inputs:[
      {id:'agg_p1_vol',   label:'Volume — Phase 1 (3 GWH build)', unit:'M tonnes', bear:1.5,  base:2.25, bull:2.5,
       note:'Pro-rata from 13.5M at 18GWH. Produced during 2028-2031 build period.',
       confirmed:false, source:'Extrapolated from Superfecta deck confirmed figure'},
      {id:'agg_p2_vol',   label:'Volume — full build (18 GWH)',  unit:'M tonnes', bear:10,   base:13.5, bull:15,
       note:'CONFIRMED in Superfecta deck.',
       confirmed:true, source:'Superfecta deck — Roger Caldwell March 2026'},
      {id:'agg_price',    label:'Aggregate sale price',           unit:'$/tonne',  bear:8,    base:12,   bull:15,
       note:'PENDING — Jill Shackelford to confirm. General construction aggregate: $8-15/tonne in high-demand areas.',
       confirmed:false, source:'PENDING — Jill Shackelford'},
      {id:'agg_transport',label:'Transport cost to rail',         unit:'$/tonne',  bear:6,    base:4,    bull:2,
       note:'PENDING — depends on site rail proximity. Truck-to-rail: $3-6/tonne typical.',
       confirmed:false, source:'PENDING — site selection dependent'},
    ],
    outputs:[
      {label:'Net margin per tonne',       formula:'Sale price − Transport cost', unit:'$/tonne',
       bearVal:'$2',   baseVal:'$8',    bullVal:'$13',   note:'Wide range — transport cost is key variable'},
      {label:'Phase 1 net revenue',        formula:'P1 volume × Net margin',      unit:'$M',
       bearVal:'$3M',  baseVal:'$18M',  bullVal:'$32.5M', note:'During 2028-2031 construction'},
      {label:'FULL BUILD TOTAL POTENTIAL', formula:'Total volume × Net margin',   unit:'$M',
       bearVal:'$27M', baseVal:'$108M', bullVal:'$175.5M', note:'ZEROED — activate when Jill confirms'},
    ],
    assumptions:[
      {param:'Volume confirmed',
       value:'13.5M tonnes at 18 GWH confirmed in Superfecta deck by Roger.',
       source:'Superfecta deck — March 2026'},
      {param:'TBM cost benchmark — sourced',
       value:'Herrenknecht Martina TBM (15.6m diameter): $60M confirmed cost. BART Silicon Valley Herrenknecht (16.5m): $76M confirmed. FCP range $45-85M per machine is well-sourced and accurate.',
       source:'ASME: 5 Biggest Tunnel Boring Machines in the World; Wikipedia: Martina TBM',
       url:'https://www.asme.org/topics-resources/content/5-biggest-tunnel-boring-machines-in-the-world'},
      {param:'Model status',
       value:'ALL ZEROS — activate when Jill Shackelford confirms pricing and transport cost.',
       source:'Pending advisory input'},
    ]
  },
]

export interface CapexItem {
  category: string; item: string
  bear: number; base: number; bull: number; unit: string; phase: string
  benchmark: string; benchmarkUrl?: string; watch: string
}

export const CAPEX_ITEMS: CapexItem[] = [
  {category:'Underground civil', item:'TBM procurement + mobilisation (per machine)',
   bear:45, base:65, bull:85, unit:'$M/machine', phase:'Construction',
   benchmark:'SOURCED. Herrenknecht Martina hard-rock TBM (15.6m): $60M confirmed (ASME/Wikipedia). BART Silicon Valley Herrenknecht TBM (16.5m): $76M confirmed. FCP range $45-85M is accurate.',
   benchmarkUrl:'https://www.asme.org/topics-resources/content/5-biggest-tunnel-boring-machines-in-the-world',
   watch:'Core drilling 2026 is the geology gate. TBM lead time: 12-24 months to manufacture after order. No-go risk if Permian Basin rock is unsuitable for TBM at 700m depth.'},
  {category:'Underground civil', item:'Underground tunnel lining + waterproofing',
   bear:80, base:120, bull:180, unit:'$M total', phase:'Construction',
   benchmark:'Typical PSH: $800-1,500/m² tunnel surface. Produced water compatibility requires chemical-resistant lining beyond standard shotcrete.',
   watch:'PW corrosion on lining — standard shotcrete may not be sufficient at high TDS. Engineering spec must be confirmed before M4.'},
  {category:'Underground civil', item:'Powerhouse cavern construction',
   bear:40, base:60, bull:90, unit:'$M total', phase:'Construction',
   benchmark:'Underground powerhouse: $500-900/kW cavern. Bath County VA (largest US PSH) ~$180M at today\'s costs. UPHES surface + partial underground is lower cost than mountain PSH.',
   watch:'Penstock length from underground reservoir to surface powerhouse adds cost per metre — depends on site geometry from core drilling.'},
  {category:'Turbines & mechanical', item:'Oilfield-Grade PRTs (Super Duplex alloys + WC-CoCr HVOF)',
   bear:120, base:175, bull:225, unit:'$M total', phase:'Construction',
   benchmark:'Standard Francis turbines: $150-200/kW. 730 MW × $175/kW = ~$128M. PRT premium for Super Duplex + HVOF: industry estimate +20-40% vs standard. No confirmed quote exists yet.',
   watch:'🔴 KEY SUPERFECTA RISK: No confirmed PRT quote. Al Yablonsky must spec and obtain manufacturer quotes before M4 close. Could add $25-50M to TIC above reference.'},
  {category:'Turbines & mechanical', item:'Penstocks, valves, water conveyance',
   bear:25, base:40, bull:60, unit:'$M total', phase:'Construction',
   benchmark:'Penstock: $800-1,500/m at 700m head pressure. PW-resistant coating required — standard carbon steel incompatible with high-TDS produced water.',
   watch:'Penstock material spec for produced water must be confirmed by engineering team.'},
  {category:'Electrical & grid', item:'Transformers, switchgear, 345 kV transmission tie-in',
   bear:35, base:55, bull:80, unit:'$M total', phase:'Construction',
   benchmark:'345 kV substation: $15-30M. Transformers (730 MW): $20-35M. Transmission spur to nearest 345 kV: $1-3M/mile.',
   watch:'ERCOT interconnect queue: 18-24 months — must apply at M1 (2026). Spur line distance is site-selection variable.'},
  {category:'Produced water', item:'PW receiving, processing + injection plant',
   bear:15, base:30, bull:55, unit:'$M total', phase:'Construction',
   benchmark:'Permian Basin PW processing: $0.20-0.80/bbl/day capacity. At 200K bbl/day: $40-160K/day capacity factor. NEW cost — no equivalent in conventional PHES.',
   watch:'🔴 SUPERFECTA NEW COST — engineering spec TBD. Must quantify before M4 institutional close.'},
  {category:'Solar farm', item:'600 MWp solar farm (co-located)',
   bear:600, base:760, bull:900, unit:'$M total', phase:'Construction',
   benchmark:'RESEARCHED. Wood Mackenzie/SEIA Q4 2025: utility-scale solar costs climbed to $1.18/Wdc (fixed-tilt) and $1.35/Wdc (single-axis tracker), up 11-14% YoY due to Trump tariffs on steel and aluminium. 600 MWp × $1.18-1.35/Wdc = $708-810M. Original $420M base was based on outdated 2023 pre-tariff pricing and is materially wrong.',
   benchmarkUrl:'https://seia.org/research-resources/solar-market-insight-report-2025-year-in-review/',
   watch:'🔴 Solar cost at 2025 prices is $708-810M . Also: does FCP OWN the solar farm (adds $700M+ to capex) or buy under a PPA (pays $/MWh opex)? Solar ownership alone would nearly double total project capex. Must decide before M3.'},
  {category:'DTAI & technology', item:'DTAI digital twin AI — initial development',
   bear:3, base:8, bull:15, unit:'$M total', phase:'Development',
   benchmark:'Industrial AI digital twin for energy infra: $3-15M first deployment. Siemens Energy benchmark: $5-12M. CAPITALISE as intangible asset — not expense.',
   watch:'DTAI is both cost AND future IP licensing asset from 2031. Track separately for capitalisation. Critical for NAV and IP licensing valuation.'},
  {category:'Site & permitting', item:'Geological surveys, core drilling, environmental studies',
   bear:2, base:4, bull:8, unit:'$M total', phase:'Development',
   benchmark:'Core drilling to 700m: $1-2M. Geophysical surveys: $0.5-1M. Environmental baseline: $0.5-1.5M. Total pre-construction studies: $3-6M typical.',
   watch:'Core drilling at Glass Ranch 2026 is the critical go/no-go gate. Determines rock suitability, PW pipeline proximity, and dry-area geology.'},
  {category:'Site & permitting', item:'Land, mineral rights, easements',
   bear:5, base:15, bull:40, unit:'$M total', phase:'Development',
   benchmark:'West Texas surface lease: $500-2,000/acre. Permian Basin mineral rights in non-producing dry areas: often speculatively held. Rail corridor easement required. 500-1,000 acres needed.',
   watch:'Superfecta requires dry area near PW pipelines — may require purchasing speculatively-held mineral rights at elevated rates.'},
]

export interface OpexItem {
  category: string; item: string
  bear: number; base: number; bull: number; unit: string; formula: string
  benchmark: string; benchmarkUrl?: string; watch: string
}

export const PROJECT_OPEX: OpexItem[] = [
  {category:'Operations & maintenance', item:'Annual O&M — PHES components',
   bear:3500, base:10500, bull:14000, unit:'$000s/yr', formula:'TIC × O&M rate% (bear 0.5%, base 1.5%, bull 2.0%)',
   benchmark:'RESEARCHED. IRENA benchmark: O&M costs for hydropower 1-4% of annual investment costs. Large hydro averages 2-2.5% (IRENA Hydropower Technology Brief, ETSAP). Base raised from 1% to 1.5% — original 1% was optimistic low end with no source.',
   benchmarkUrl:'https://www.ourenergypolicy.org/wp-content/uploads/2015/06/IRENA-ETSAP_Tech_Brief_E06_Hydropower.pdf',
   watch:'PRT O&M premium for produced water environment: additional seal replacement, HVOF coating inspection, corrosion monitoring. Estimate +0.2-0.3% TIC/yr above standard PHES. Al Yablonsky to confirm. At $700M TIC: 1% vs 2% = $7M vs $14M/yr — material difference.'},
  {category:'Produced water', item:'PW processing — recurring cost per barrel',
   bear:0, base:0, bull:0, unit:'$000s/yr ZEROED', formula:'Volume (bbl/day) × Processing cost ($/bbl) × 365',
   benchmark:'Permian Basin PW processing: $0.10-0.50/bbl for basic TDS reduction. Full treatment: $0.50-2.00/bbl. Target for UPHES: partial treatment to PRT-compatible TDS — likely $0.15-0.40/bbl.',
   watch:'🔴 ZEROED — CRITICAL GAP. $0.25/bbl on 200K bbl/day = $18M/yr recurring opex. Must confirm with engineering team. Could be largest recurring cost after energy input.'},
  {category:'Energy input', item:'Off-peak electricity purchase for pumping',
   bear:100000, base:117600, bull:140000, unit:'$000s/yr (2032 est.)', formula:'Arbitrage volume (GWh) × Buy price ($/MWh) × 1,000',
   benchmark:' Buy price raised from $20 to $28/MWh base (EIA 2025 ERCOT forecast: $27-34/MWh average). At 4,194 GWh/yr pumping volume × $28/MWh = ~$117M/yr. If FCP owns solar, pumping cost approaches zero marginal cost.',
   benchmarkUrl:'https://www.eia.gov/todayinenergy/detail.php?id=64384',
   watch:'Solar ownership decision fundamentally changes this line. If FCP owns the solar farm, this cost approaches zero and arbitrage economics improve dramatically. Must resolve before financial model is reliable.'},
  {category:'Debt service', item:'Annual debt service — project financing',
   bear:20000, base:28000, bull:38000, unit:'$000s/yr', formula:'Debt × interest rate / loan term (simplified)',
   benchmark:'RESEARCHED. Standard energy infrastructure project finance: 70-80% debt / 20-30% equity (NREL project finance guide; SolarTechOnline 2025). At $700M TIC × 70% debt = $490M debt. 20-25yr tenor at 5-7% = ~$30-40M/yr debt service. Novel UPHES + PW technology = risk premium 25-50bps above conventional PSH. Conventional PSH: 50-60% debt — UPHES as novel tech may face stricter lender requirements closer to 50-60% initially.',
   benchmarkUrl:'https://docs.nlr.gov/docs/fy06osti/38723.pdf',
   watch:'Novel technology + PW = lender unfamiliarity. First project pays premium; second project improves as Glass Ranch proves the technology.'},
  {category:'Insurance', item:'Property, BI + casualty insurance',
   bear:1400, base:2450, bull:4200, unit:'$000s/yr', formula:'TIC × insurance rate% (bear 0.2%, base 0.35%, bull 0.6%) — CORRECTED upward for ERCOT extreme weather loading',
   benchmark:'Large power plant property insurance: 0.15-0.40% of replacement value/yr. Novel tech + PW = underwriter loading. High BI limits required for 130 MW DC customer.',
   watch:'Novel technology — needs specialist energy insurer. BI coverage for DC customer must be structured for 99.999% uptime requirement.'},
  {category:'Land & infrastructure', item:'Land lease + mineral rights + rail easement',
   bear:300, base:600, bull:1200, unit:'$000s/yr', formula:'Annual lease × acreage + rail easement',
   benchmark:'West Texas surface: $5-20/acre/yr. Mineral rights in non-producing areas: $10-30/acre/yr. Rail corridor easement: $50-200K/yr.',
   watch:'Mineral rights in Permian Basin dry areas may be held speculatively at elevated rates by O&G companies.'},
]

export interface TopcoItem {
  category: string; item: string
  bear: number; base: number; bull: number; unit: string; phase: string
  benchmark: string; benchmarkUrl?: string; watch: string
}

export const TOPCO_OPEX: TopcoItem[] = [
  {category:'Headcount by function', item:'Engineering & technical team (FTE)',
   bear:2, base:4, bull:7, unit:'FTE', phase:'Dev: 2-4 FTE → Construction: 5-8 FTE → Ops: 3-5 FTE',
   benchmark:'$500M+ infra project development: 8-15 FTE at peak (KPMG Advisory). All-in cost $150-200K/FTE. FTE must ramp 6 months before M3 for investor credibility.',
   watch:'Under-resourcing technical team is the most common reason infrastructure projects miss M4 milestone. Engineering must be in seat before M3.'},
  {category:'Headcount by function', item:'Business development & commercial (FTE)',
   bear:1, base:2, bull:3, unit:'FTE', phase:'Active M1 through M5 — focus: DC PPA + PW agreements',
   benchmark:'All-in $150-180K/FTE. Key deliverables before M4: signed DC PPA and confirmed PW tipping fee/supply agreement.',
   watch:'DC PPA and PW agreement de-risk the entire revenue model. BD must deliver both before M4.'},
  {category:'Headcount by function', item:'Finance, legal & administration (FTE)',
   bear:1, base:2, bull:3, unit:'FTE', phase:'Fractional pre-M4 → full-time at M4',
   benchmark:'Institutional investors require full-time CFO + audited financials. All-in: $180-260K/FTE senior, $80-120K/FTE analyst.',
   watch:'Full-time CFO required 6 months before M4 institutional close. Fractional adequate through M3 only.'},
  {category:'External advisors', item:'Legal — project finance, IP, corporate',
   bear:150, base:400, bull:800, unit:'$000s/yr', phase:'Ramps at each milestone — lumpy at M4',
   benchmark:'Project finance legal (Milbank, Latham, White & Case): $800-1,500/hr partners. M4 close: $500K-2M in legal fees (one-time). IP prosecution: $100-200K/yr.',
   watch:'M4 legal costs are large and lumpy — budget $750K-1.5M as a spike in M4 year, not annualised.'},
  {category:'External advisors', item:'External engineering consultants',
   bear:200, base:500, bull:1000, unit:'$000s/yr', phase:'Peaks 2026-2028 — drops after construction',
   benchmark:'Independent Engineer for project finance: $200-500K/yr. IE certification required by institutional investors. Technical DD for M4: $300-600K one-time.',
   watch:'IE certification is not optional for institutional investors. Budget $300-500K in M3-M4 year.'},
  {category:'External advisors', item:'Financial advisors + placement fees',
   bear:0, base:500, bull:2000, unit:'$000s per round', phase:'Success fee at each equity close — not annual',
   benchmark:'Seed: 3-5% of $5M = $150-250K. Pre-instit. $20M: 2-4% = $400-800K. Institutional $700M: 0.5-1.5% = $3.5-10.5M (often paid by ProjectCo — must clarify).',
   watch:'Institutional placement fees very large. Clarify: TopCo or ProjectCo pays. Treat as one-time spike in M4 year — not annualised opex.'},
  {category:'Technology', item:'DTAI platform — ongoing dev, hosting, maintenance',
   bear:200, base:500, bull:1200, unit:'$000s/yr', phase:'MVP (2026) → production (2032+)',
   benchmark:'Cloud infrastructure for industrial AI (AWS/GCP): $50-200K/yr. ML engineering contracted: $150-400K/yr. SCADA + AI optimisation for storage: $300-800K/yr.',
   watch:'DTAI is cost AND IP asset. Capitalise development costs as intangible where possible. Critical for NAV and IP licensing revenue trajectory from 2031.'},
  {category:'G&A', item:'Office, D&O insurance, audit, travel',
   bear:300, base:600, bull:1000, unit:'$000s/yr', phase:'Steps with team and project count',
   benchmark:'D&O pre-institutional: $50-150K/yr → post-M4: $200-400K/yr. Audit pre-instit: $80-150K → post: $200-350K. Office + travel: $100-200K/yr.',
   watch:'D&O steps sharply at M4 — institutional investors require meaningful coverage. Budget a step-up from ~$80K to ~$300K/yr at M4 close.'},
]

export const EQUITY_ROUNDS = [
  {round:'TopCo launch',         milestone:'M0 — seed close',      year:2026, pct:null,  valuation:'—',                                              proceeds:null,  stake:'80%', basis:null},
  {round:'P1 seed',              milestone:'M2 — $5M raise',       year:2027, pct:'20%', valuation:'~$10M pre-money',                                proceeds:2000,  stake:'64%', basis:500},
  {round:'P1 pre-institutional', milestone:'M3 — $20M raise',      year:2027, pct:'20%', valuation:'~$60M pre-money',                                proceeds:12000, stake:'51%', basis:500},
  {round:'P1 institutional',     milestone:'M4 — $700M TIC ref.',  year:2028, pct:'50%', valuation:'~$350M equity (50/50 D/E on $700M TIC — re-eval post core drilling)', proceeds:175000, stake:'10%', basis:1500},
  {round:'P2 seed',              milestone:'M1b',                   year:2028, pct:'20%', valuation:'Same structure as P1',                           proceeds:2000,  stake:'—',   basis:300},
  {round:'P2 pre-institutional', milestone:'M3b',                   year:2029, pct:'20%', valuation:'Same structure',                                 proceeds:12000, stake:'—',   basis:400},
  {round:'P2 institutional',     milestone:'M4b',                   year:2030, pct:'50%', valuation:'Same structure',                                 proceeds:175000,stake:'10%', basis:1200},
]
