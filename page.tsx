'use client'
import { useState } from 'react'
import { STREAMS, CAPEX_ITEMS, PROJECT_OPEX, TOPCO_OPEX, EQUITY_ROUNDS, Stream } from './data'

type View = 'streams'|'costs'|'equity'|'notes'
type Scenario = 'bear'|'base'|'bull'

const STATUS_META: Record<string,{label:string;bg:string;color:string}> = {
  'confirmed':   {label:'Confirmed',      bg:'#EAF3DE', color:'#27500A'},
  'in-model':    {label:'In model',       bg:'#E6F1FB', color:'#0C447C'},
  'no-contract': {label:'No contract yet',bg:'#FFF3CD', color:'#854F0B'},
  'pending':     {label:'Pending input',  bg:'#FFF3CD', color:'#854F0B'},
  'zeroed':      {label:'Zeroed — TBD',   bg:'#FCEBEB', color:'#791F1F'},
}

const TYPE_BADGE: Record<string,{bg:string;color:string}> = {
  'STEP':      {bg:'#FFF3CD',  color:'#854F0B'},
  'MILESTONE': {bg:'#E0F7FA',  color:'#085041'},
  'PCT_OF':    {bg:'#F3E5F5',  color:'#4A148C'},
  'CAGR':      {bg:'#E8F5E9',  color:'#1B5E20'},
}

function CostsView({scenario}: {scenario: 'bear'|'base'|'bull'}) {
  const [section, setSection] = useState<'capex'|'opex'|'topco'>('capex')
  const val = (item: {bear:number;base:number;bull:number}) => {
    const v = scenario==='bear'?item.bear:scenario==='bull'?item.bull:item.base
    return v===0 ? <span style={{color:'#CCC'}}>—</span> : <span style={{color:'#185FA5',fontWeight:600}}>{v.toLocaleString()}</span>
  }
  return (
    <div style={{padding:'24px',maxWidth:1200,margin:'0 auto'}}>
      <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginBottom:6}}>
        <h2 style={{fontSize:16,fontWeight:700,margin:0}}>Cost structure — benchmarked assumptions</h2>
        <span style={{fontSize:12,color:'#888'}}>Values shown for {scenario} scenario · $000s unless noted</span>
      </div>
      <p style={{fontSize:13,color:'#666',marginBottom:16}}>All cost assumptions include industry benchmarks and key watch items. Green badge = confirmed from source documents. Each line includes what to watch and why it matters for model accuracy.</p>

      <div style={{display:'flex',gap:4,marginBottom:20}}>
        {([['capex','Project CAPEX (TIC)'],['opex','Project OPEX (post-ops)'],['topco','TopCo management costs']] as ['capex'|'opex'|'topco', string][]).map(([s,label])=>(
          <button key={s} onClick={()=>setSection(s)} style={{
            padding:'6px 14px',fontSize:12,border:'0.5px solid',borderRadius:6,cursor:'pointer',
            background: section===s?'#0D1B2A':'#fff',
            borderColor: section===s?'#0D1B2A':'#E5E5E0',
            color: section===s?'#EBF3FB':'#444',
            fontWeight: section===s?600:400,
          }}>{label}</button>
        ))}
      </div>

      {section==='capex' && (
        <div>
          <div style={{background:'#FFF3CD',borderRadius:8,padding:'10px 14px',marginBottom:16,fontSize:12,color:'#633806'}}>
            <strong>Note on TIC ($700M reference):</strong> This is the reference figure from the pitch deck. It will be re-evaluated after core drilling results (2026), and again after PRT engineering spec from Al Yablonsky is confirmed. Solar farm ($420M) may be financed separately. Do not treat $700M as fixed.
          </div>
          {Object.entries(
            CAPEX_ITEMS.reduce((acc,item) => { (acc[item.category]=acc[item.category]||[]).push(item); return acc }, {} as Record<string,typeof CAPEX_ITEMS>)
          ).map(([cat, items]) => (
            <div key={cat} style={{marginBottom:24}}>
              <div style={{fontSize:11,fontWeight:700,color:'#0D1B2A',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,paddingBottom:4,borderBottom:'2px solid #0D1B2A'}}>{cat}</div>
              {items.map((item,i)=>(
                <div key={i} style={{border:'0.5px solid #E5E5E0',borderRadius:8,padding:'14px',marginBottom:10,background: i%2===0?'#FAFAF8':'#fff'}}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:10}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{item.item}</div>
                      <span style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:item.phase==='Development'?'#E0F7FA':item.phase==='Both'?'#EEEDFE':'#FFF3CD',color:item.phase==='Development'?'#085041':item.phase==='Both'?'#3C3489':'#854F0B',marginRight:6}}>{item.phase}</span>
                      <span style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:'#F1EFE8',color:'#5F5E5A'}}>{item.unit}</span>
                    </div>
                    <div style={{display:'flex',gap:12,flexShrink:0}}>
                      {(['bear','base','bull'] as const).map(s=>(
                        <div key={s} style={{textAlign:'center',minWidth:56}}>
                          <div style={{fontSize:9,color:'#888',marginBottom:2,textTransform:'uppercase'}}>{s}</div>
                          <div style={{fontSize:14,fontWeight:700,color:s==='bear'?'#A32D2D':s==='bull'?'#3B6D11':'#185FA5',background:scenario===s?(s==='bear'?'#FFF0F0':s==='bull'?'#F0FBF0':'#EBF3FB'):'transparent',borderRadius:6,padding:'4px 8px'}}>{item[s]===0?'TBD':item[s].toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    <div style={{background:'#F8F8F5',borderRadius:6,padding:'8px 10px'}}>
                      <div style={{fontSize:10,fontWeight:600,color:'#888',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Benchmark</div>
                      <div style={{fontSize:11,color:'#444',lineHeight:1.5}}>{item.benchmark}</div>
                    </div>
                    <div style={{background:'#FFF8E7',borderRadius:6,padding:'8px 10px',border:'0.5px solid #EF9F27'}}>
                      <div style={{fontSize:10,fontWeight:600,color:'#854F0B',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Watch item</div>
                      <div style={{fontSize:11,color:'#633806',lineHeight:1.5}}>{item.watch}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {section==='opex' && (
        <div>
          <div style={{background:'#E6F1FB',borderRadius:8,padding:'10px 14px',marginBottom:16,fontSize:12,color:'#0C447C'}}>
            <strong>ProjectCo recurring costs</strong> — these costs are incurred at the ProjectCo level (the plant entity) and directly reduce project net income, which in turn drives TopCo dividend income and facility ops mgmt fee.
          </div>
          {PROJECT_OPEX.map((item,i)=>(
            <div key={i} style={{border:'0.5px solid #E5E5E0',borderRadius:8,padding:'14px',marginBottom:12,background: i%2===0?'#FAFAF8':'#fff'}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:10}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>{item.item}</div>
                  <div style={{fontSize:11,color:'#666',fontStyle:'italic',marginBottom:4}}>{item.formula}</div>
                  <span style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:'#F1EFE8',color:'#5F5E5A'}}>{item.category}</span>
                  <span style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:'#EBF3FB',color:'#185FA5',marginLeft:6}}>{item.unit}</span>
                </div>
                <div style={{display:'flex',gap:12,flexShrink:0}}>
                  {(['bear','base','bull'] as const).map(s=>(
                    <div key={s} style={{textAlign:'center',minWidth:72}}>
                      <div style={{fontSize:9,color:'#888',marginBottom:2,textTransform:'uppercase'}}>{s}</div>
                      <div style={{fontSize:13,fontWeight:700,color:s==='bear'?'#A32D2D':s==='bull'?'#3B6D11':'#185FA5',background:scenario===s?(s==='bear'?'#FFF0F0':s==='bull'?'#F0FBF0':'#EBF3FB'):'transparent',borderRadius:6,padding:'4px 8px'}}>{item[s]===0?'TBD':item[s].toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div style={{background:'#F8F8F5',borderRadius:6,padding:'8px 10px'}}>
                  <div style={{fontSize:10,fontWeight:600,color:'#888',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Benchmark</div>
                  <div style={{fontSize:11,color:'#444',lineHeight:1.5}}>{item.benchmark}</div>
                </div>
                <div style={{background:'#FFF8E7',borderRadius:6,padding:'8px 10px',border:'0.5px solid #EF9F27'}}>
                  <div style={{fontSize:10,fontWeight:600,color:'#854F0B',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Watch item</div>
                  <div style={{fontSize:11,color:'#633806',lineHeight:1.5}}>{item.watch}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {section==='topco' && (
        <div>
          <div style={{background:'#EAF3DE',borderRadius:8,padding:'10px 14px',marginBottom:16,fontSize:12,color:'#27500A'}}>
            <strong>TopCo (FCP corporation) costs</strong> — what the management company spends to develop, build and operate the project pipeline. Headcount shown as FTE count by function, not individual names or salaries.
          </div>
          {TOPCO_OPEX.map((item,i)=>(
            <div key={i} style={{border:'0.5px solid #E5E5E0',borderRadius:8,padding:'14px',marginBottom:12,background: i%2===0?'#FAFAF8':'#fff'}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:10}}>
                <div style={{flex:1}}>
                  <span style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:'#EEEDFE',color:'#3C3489',fontWeight:600,marginBottom:6,display:'inline-block'}}>{item.category}</span>
                  <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>{item.item}</div>
                  <div style={{fontSize:11,color:'#666',fontStyle:'italic'}}>{item.phase}</div>
                </div>
                <div style={{display:'flex',gap:12,flexShrink:0}}>
                  {(['bear','base','bull'] as const).map(s=>(
                    <div key={s} style={{textAlign:'center',minWidth:60}}>
                      <div style={{fontSize:9,color:'#888',marginBottom:2,textTransform:'uppercase'}}>{s}</div>
                      <div style={{fontSize:13,fontWeight:700,color:s==='bear'?'#A32D2D':s==='bull'?'#3B6D11':'#185FA5',background:scenario===s?(s==='bear'?'#FFF0F0':s==='bull'?'#F0FBF0':'#EBF3FB'):'transparent',borderRadius:6,padding:'4px 8px'}}>{item[s]===0?'TBD':item[s].toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div style={{background:'#F8F8F5',borderRadius:6,padding:'8px 10px'}}>
                  <div style={{fontSize:10,fontWeight:600,color:'#888',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Benchmark</div>
                  <div style={{fontSize:11,color:'#444',lineHeight:1.5}}>{item.benchmark}</div>
                </div>
                <div style={{background:'#FFF8E7',borderRadius:6,padding:'8px 10px',border:'0.5px solid #EF9F27'}}>
                  <div style={{fontSize:10,fontWeight:600,color:'#854F0B',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>Watch item</div>
                  <div style={{fontSize:11,color:'#633806',lineHeight:1.5}}>{item.watch}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


export default function Page() {
  const [view, setView]         = useState<View>('streams')
  const [scenario, setScenario] = useState<Scenario>('base')
  const [activeStream, setActiveStream] = useState<Stream>(STREAMS[0])

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",color:'#1A1A1A',minHeight:'100vh',background:'#FAFAF8'}}>

      {/* HEADER */}
      <div style={{background:'#0D1B2A',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{background:'#1F3A5C',border:'0.5px solid #2E5B8E',borderRadius:8,padding:'6px 12px',fontWeight:700,fontSize:16,color:'#EBF3FB',letterSpacing:'0.05em'}}>FCP</div>
          <div>
            <div style={{color:'#EBF3FB',fontWeight:600,fontSize:15}}>Firm Clean Power Corporation</div>
            <div style={{color:'#6B90B8',fontSize:11}}>UPHES Superfecta — Business Model &amp; Unit Economics · Confidential · March 2026</div>
          </div>
        </div>
        <div style={{display:'flex',gap:6}}>
          {(['bear','base','bull'] as Scenario[]).map(s => (
            <button key={s} onClick={()=>setScenario(s)} style={{
              padding:'5px 14px',fontSize:12,borderRadius:16,border:'0.5px solid',cursor:'pointer',
              background: scenario===s ? (s==='bear'?'#FCEBEB':s==='bull'?'#E8F5E9':'#E6F1FB') : 'transparent',
              borderColor: scenario===s ? (s==='bear'?'#A32D2D':s==='bull'?'#3B6D11':'#185FA5') : '#2E5B8E',
              color: scenario===s ? (s==='bear'?'#791F1F':s==='bull'?'#27500A':'#0C447C') : '#6B90B8',
              fontWeight: scenario===s ? 600 : 400,
            }}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* NAV */}
      <div style={{background:'#fff',borderBottom:'0.5px solid #E5E5E0',padding:'0 24px',display:'flex',gap:0}}>
        {([['streams','Revenue streams'],['costs','Costs'],['equity','Equity waterfall'],['notes','Key gaps']] as [View,string][]).map(([v,label]) => (
          <button key={v} onClick={()=>setView(v)} style={{
            padding:'12px 18px',fontSize:13,border:'none',cursor:'pointer',background:'transparent',
            borderBottom: view===v ? '2px solid #0D1B2A' : '2px solid transparent',
            color: view===v ? '#0D1B2A' : '#888',
            fontWeight: view===v ? 600 : 400,
          }}>{label}</button>
        ))}
      </div>

      {/* REVENUE STREAMS VIEW */}
      {view==='streams' && (
        <div style={{display:'grid',gridTemplateColumns:'280px 1fr',minHeight:'calc(100vh - 100px)'}}>

          {/* LEFT: stream list */}
          <div style={{background:'#fff',borderRight:'0.5px solid #E5E5E0',overflowY:'auto'}}>
            <div style={{padding:'12px 14px',fontSize:10,fontWeight:600,color:'#888',textTransform:'uppercase',letterSpacing:'0.08em',borderBottom:'0.5px solid #E5E5E0'}}>ProjectCo revenue</div>
            {STREAMS.filter(s=>s.level==='ProjectCo').map(s => {
              const sm = STATUS_META[s.status]
              return (
                <div key={s.id} onClick={()=>setActiveStream(s)} style={{
                  padding:'12px 14px',cursor:'pointer',borderBottom:'0.5px solid #F0F0EA',
                  background: activeStream.id===s.id ? '#F4F9FE' : 'transparent',
                  borderLeft: activeStream.id===s.id ? `3px solid ${s.dot}` : '3px solid transparent',
                }}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:s.dot,flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:600,color:'#1A1A1A'}}>{s.name}</span>
                  </div>
                  <span style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:sm.bg,color:sm.color}}>{sm.label}</span>
                </div>
              )
            })}
            <div style={{padding:'12px 14px',fontSize:10,fontWeight:600,color:'#888',textTransform:'uppercase',letterSpacing:'0.08em',borderBottom:'0.5px solid #E5E5E0',borderTop:'0.5px solid #E5E5E0'}}>TopCo revenue</div>
            {STREAMS.filter(s=>s.level==='TopCo').map(s => {
              const sm = STATUS_META[s.status]
              return (
                <div key={s.id} onClick={()=>setActiveStream(s)} style={{
                  padding:'12px 14px',cursor:'pointer',borderBottom:'0.5px solid #F0F0EA',
                  background: activeStream.id===s.id ? '#F4F9FE' : 'transparent',
                  borderLeft: activeStream.id===s.id ? `3px solid ${s.dot}` : '3px solid transparent',
                }}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:s.dot,flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:600,color:'#1A1A1A'}}>{s.name}</span>
                  </div>
                  <span style={{fontSize:10,padding:'2px 7px',borderRadius:10,background:sm.bg,color:sm.color}}>{sm.label}</span>
                </div>
              )
            })}
          </div>

          {/* RIGHT: stream detail */}
          <div style={{overflowY:'auto',padding:'24px'}}>
            {/* Stream header */}
            <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:16}}>
              <div style={{width:12,height:12,borderRadius:'50%',background:activeStream.dot,marginTop:4,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:6}}>
                  <h2 style={{fontSize:18,fontWeight:700,margin:0}}>{activeStream.name}</h2>
                  <span style={{
                    fontSize:10,padding:'2px 8px',borderRadius:10,fontWeight:600,
                    background: STATUS_META[activeStream.status].bg,
                    color: STATUS_META[activeStream.status].color
                  }}>{STATUS_META[activeStream.status].label}</span>
                  <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:'#F1EFE8',color:'#5F5E5A'}}>{activeStream.level}</span>
                </div>
                <p style={{fontSize:13,color:'#555',lineHeight:1.6,margin:0}}>{activeStream.description}</p>
              </div>
            </div>

            {/* Formula */}
            <div style={{background:'#0D1B2A',borderRadius:8,padding:'10px 14px',marginBottom:20}}>
              <div style={{fontSize:10,color:'#6B90B8',marginBottom:4,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>Key formula</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'#B5D4F4',whiteSpace:'pre-wrap',lineHeight:1.6}}>{activeStream.formula}</div>
            </div>

            {/* INPUTS TABLE */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:600,color:'#888',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Input assumptions — {scenario} scenario highlighted</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead>
                  <tr style={{background:'#F8F8F5'}}>
                    <th style={{padding:'7px 10px',textAlign:'left',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#555',fontSize:11}}>Parameter</th>
                    <th style={{padding:'7px 10px',textAlign:'left',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#555',fontSize:11}}>Unit</th>
                    <th style={{padding:'7px 8px',textAlign:'right',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#A32D2D',fontSize:11}}>Bear</th>
                    <th style={{padding:'7px 8px',textAlign:'right',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#185FA5',fontSize:11,background:'#F4F9FE'}}>Base</th>
                    <th style={{padding:'7px 8px',textAlign:'right',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#3B6D11',fontSize:11}}>Bull</th>
                    <th style={{padding:'7px 10px',textAlign:'left',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#555',fontSize:11}}>Source / note</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStream.inputs.map((inp,i) => {
                    const fmt = (v:number) => {
                      if(inp.unit==='%'||inp.unit==='%/yr') return (v*100).toFixed(1)+'%'
                      if(inp.unit==='$/MWh'||inp.unit==='$/MW/hr'||inp.unit==='$/MW/yr'||inp.unit==='$/bbl'||inp.unit==='$/tonne') return '$'+v.toLocaleString()
                      return v.toLocaleString()
                    }
                    return (
                      <tr key={i} style={{borderBottom:'0.5px solid #F0F0EA'}}>
                        <td style={{padding:'7px 10px',fontWeight:500}}>
                          {inp.label}
                          {inp.confirmed && <span style={{marginLeft:6,fontSize:9,padding:'1px 5px',borderRadius:8,background:'#E8F5E9',color:'#1B5E20',fontWeight:600}}>CONFIRMED</span>}
                        </td>
                        <td style={{padding:'7px 10px',color:'#888',fontSize:11}}>{inp.unit}</td>
                        <td style={{padding:'7px 8px',textAlign:'right',color:'#A32D2D',fontWeight: scenario==='bear'?700:400, background: scenario==='bear'?'#FFF5F5':'transparent'}}>{fmt(inp.bear)}</td>
                        <td style={{padding:'7px 8px',textAlign:'right',color:'#185FA5',fontWeight: scenario==='base'?700:400, background:'#F4F9FE'}}>{fmt(inp.base)}</td>
                        <td style={{padding:'7px 8px',textAlign:'right',color:'#3B6D11',fontWeight: scenario==='bull'?700:400, background: scenario==='bull'?'#F4FBF0':'transparent'}}>{fmt(inp.bull)}</td>
                        <td style={{padding:'7px 10px',color:'#888',fontSize:11,fontStyle:'italic'}}>{inp.note}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* OUTPUTS TABLE */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:600,color:'#888',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Output / derived unit economics</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead>
                  <tr style={{background:'#F8F8F5'}}>
                    <th style={{padding:'7px 10px',textAlign:'left',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#555',fontSize:11}}>Output metric</th>
                    <th style={{padding:'7px 10px',textAlign:'left',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#555',fontSize:11,width:'30%'}}>Formula (simplified)</th>
                    <th style={{padding:'7px 8px',textAlign:'right',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#A32D2D',fontSize:11}}>Bear</th>
                    <th style={{padding:'7px 8px',textAlign:'right',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#185FA5',fontSize:11,background:'#F4F9FE'}}>Base</th>
                    <th style={{padding:'7px 8px',textAlign:'right',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#3B6D11',fontSize:11}}>Bull</th>
                    <th style={{padding:'7px 8px',textAlign:'left',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#555',fontSize:11}}>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStream.outputs.map((out,i) => (
                    <tr key={i} style={{borderBottom:'0.5px solid #F0F0EA', background: i===activeStream.outputs.length-1?'#F4F9FE':'transparent'}}>
                      <td style={{padding:'7px 10px',fontWeight: i===activeStream.outputs.length-1?700:500}}>{out.label}</td>
                      <td style={{padding:'7px 10px',color:'#888',fontSize:11,fontStyle:'italic'}}>{out.formula}</td>
                      <td style={{padding:'7px 8px',textAlign:'right',color:'#A32D2D',fontWeight: scenario==='bear'?700:400}}>{out.bearVal}</td>
                      <td style={{padding:'7px 8px',textAlign:'right',color:'#185FA5',fontWeight:600,background:'#EBF3FB'}}>{out.baseVal}</td>
                      <td style={{padding:'7px 8px',textAlign:'right',color:'#3B6D11',fontWeight: scenario==='bull'?700:400}}>{out.bullVal}</td>
                      <td style={{padding:'7px 8px',color:'#888',fontSize:11}}>{out.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ASSUMPTIONS */}
            <div>
              <div style={{fontSize:11,fontWeight:600,color:'#888',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Assumptions, sources &amp; risks</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <tbody>
                  {activeStream.assumptions.map((a,i) => (
                    <tr key={i} style={{borderBottom:'0.5px solid #F0F0EA'}}>
                      <td style={{padding:'7px 10px',fontWeight:600,width:'22%',color:'#444'}}>{a.param}</td>
                      <td style={{padding:'7px 10px',color: a.param.includes('CRITICAL')||a.param.includes('FLAG')||a.param.includes('STATUS')?'#A32D2D':'#333', fontWeight: a.param.includes('CRITICAL')||a.param.includes('STATUS')?600:400}}>{a.value}</td>
                      <td style={{padding:'7px 10px',color:'#888',fontSize:11,fontStyle:'italic'}}>{a.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* COSTS VIEW */}
      {view==='costs' && (
        <CostsView scenario={scenario}/>
      )}

      {/* EQUITY VIEW */}
      {view==='equity' && (
        <div style={{padding:'24px',maxWidth:1100,margin:'0 auto'}}>
          <h2 style={{fontSize:16,fontWeight:700,marginBottom:4}}>Equity waterfall — confirmed by Roger Caldwell on call</h2>
          <p style={{fontSize:13,color:'#666',marginBottom:20}}>TopCo starts at 80% and sells down through three tranches per project. Retained 10% earns perpetual dividends post-operations. Gain on disposal = proceeds minus cost basis per tranche (non-operating P&L item).</p>

          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,marginBottom:24}}>
            <thead>
              <tr style={{background:'#0D1B2A'}}>
                {['Round','Milestone','Year','% Sold','Valuation basis','Proceeds ($000s)','Stake after','TopCo cost basis'].map((h,i)=>(
                  <th key={i} style={{padding:'7px 10px',color:'#EBF3FB',fontWeight:600,fontSize:11,textAlign:i>1&&i<7?'right':'left'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EQUITY_ROUNDS.map((r,i)=>(
                <tr key={i} style={{borderBottom:'0.5px solid #F0F0EA',background: (i===3||i===6)?'#F4F9FE': i%2===0?'#FAFAF8':'#fff',fontWeight:(i===3||i===6)?600:400}}>
                  <td style={{padding:'7px 10px',fontWeight:600}}>{r.round}</td>
                  <td style={{padding:'7px 10px',color:'#888',fontSize:11,fontStyle:'italic'}}>{r.milestone}</td>
                  <td style={{padding:'7px 10px',textAlign:'right'}}>{r.year}</td>
                  <td style={{padding:'7px 10px',textAlign:'right'}}>{r.pct??'—'}</td>
                  <td style={{padding:'7px 10px',color:'#666',fontSize:11}}>{r.valuation}</td>
                  <td style={{padding:'7px 10px',textAlign:'right',color:r.proceeds?'#0F6E56':'#CCC',fontWeight:r.proceeds?600:400}}>{r.proceeds?r.proceeds.toLocaleString():'—'}</td>
                  <td style={{padding:'7px 10px',textAlign:'right',fontWeight:600}}>{r.stake}</td>
                  <td style={{padding:'7px 10px',textAlign:'right',color:r.basis?'#A32D2D':'#CCC'}}>{r.basis?`(${r.basis.toLocaleString()})`:'—'}</td>
                </tr>
              ))}
              <tr style={{fontWeight:700,background:'#0D1B2A'}}>
                <td colSpan={5} style={{padding:'7px 10px',color:'#EBF3FB'}}>TOTAL P1 + P2 PROCEEDS</td>
                <td style={{padding:'7px 10px',textAlign:'right',color:'#9FE1CB'}}>378,000</td>
                <td style={{padding:'7px 10px'}}/>
                <td style={{padding:'7px 10px',textAlign:'right',color:'#F0997B'}}>(4,400)</td>
              </tr>
            </tbody>
          </table>

          <div style={{background:'#fff',border:'0.5px solid #E5E5E0',borderRadius:8,padding:'16px',marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:600,color:'#888',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:10}}>Gain on disposal — P1 institutional tranche example</div>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <tbody>
                {[
                  ['Proceeds received','$175,000','50% equity sold at M4 institutional close'],
                  ['Less: cost basis of tranche','($1,500)','TopCo cash invested attributable to 50% stake'],
                  ['= GAIN ON DISPOSAL (non-operating P&L)','$173,500','Hits P&L below EBIT · Cash hits CF Investing'],
                ].map(([label,val,note],i)=>(
                  <tr key={i} style={{borderBottom:'0.5px solid #F0F0EA',background:i===2?'#F4F9FE':'transparent'}}>
                    <td style={{padding:'7px 10px',fontWeight:i===2?700:500}}>{label}</td>
                    <td style={{padding:'7px 10px',textAlign:'right',fontWeight:700,color:i===2?'#0F6E56':i===1?'#A32D2D':'#185FA5'}}>{val}</td>
                    <td style={{padding:'7px 10px',color:'#888',fontSize:11,fontStyle:'italic'}}>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{background:'#EBF3FB',borderRadius:8,padding:'14px 16px'}}>
            <div style={{fontSize:12,fontWeight:600,color:'#0C447C',marginBottom:6}}>Dividend income from retained 10%</div>
            <p style={{fontSize:12,color:'#185FA5',margin:0,lineHeight:1.6}}>P1 project net income (2032 est.): $257M × 10% = <strong>$25.7M/yr dividend income</strong> to TopCo. Shown as non-operating income on P&L and investing cash inflow on CF statement. Grows at 3%/yr with ERCOT energy price growth. Roger: <em>"residual 10% amount left that we&apos;re getting dividends on… generational money."</em></p>
          </div>
        </div>
      )}

      {/* KEY GAPS VIEW */}
      {view==='notes' && (
        <div style={{padding:'24px',maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontSize:16,fontWeight:700,marginBottom:4}}>Key gaps — required before TJ Rogers meeting</h2>
          <p style={{fontSize:13,color:'#666',marginBottom:20}}>Items currently zeroed or flagged as placeholder in the financial model. Each needs confirmation from named advisors.</p>

          {[
            {priority:'CRITICAL',color:'#A32D2D',bg:'#FCEBEB',items:[
              {what:'PW tipping fee or supply cost ($/barrel)',owner:'Lok Home + Roger PW contacts',why:'New revenue stream OR cost offset — material to P&L either direction'},
              {what:'PRT turbine capex premium vs standard hydroelectric',owner:'Al Yablonsky / engineering',why:'Affects TIC above $700M reference — changes institutional financing amount'},
              {what:'PW processing cost ($/barrel before reservoir injection)',owner:'Engineering team',why:'Recurring Opex driver once plant operational'},
              {what:'AI data center offtake agreement — signed contract',owner:'Roger (DC contacts)',why:'$70M/yr PPA revenue is zeroed risk without signed contract'},
            ]},
            {priority:'HIGH',color:'#854F0B',bg:'#FFF3CD',items:[
              {what:'Glass Ranch site vs new Superfecta criteria',owner:'Lok Home + landowner',why:'PW pipeline proximity + dry area + rail access + 345kV — Glass Ranch may not qualify'},
              {what:'Aggregate sale price $/tonne + transport to rail',owner:'Jill Shackelford',why:'$67-135M gross potential currently zeroed in model'},
              {what:'Arbitrage revenue validation',owner:'Roger + Al Yablonsky + ERCOT data',why:'$352M gross arbitrage appears high — needs stress test vs real ERCOT dispatch data'},
            ]},
            {priority:'MEDIUM',color:'#0C447C',bg:'#E6F1FB',items:[
              {what:'P2 site-specific assumptions',owner:'Roger',why:'All P2 figures currently mirror P1 — placeholder until P2 site confirmed'},
              {what:'TopCo Series A timing and amount',owner:'Roger',why:'No figures given for TopCo equity raise — currently only $2M seed modelled'},
              {what:'Operations mgmt fee rate confirmation',owner:'Roger',why:'2% rate is industry assumption — needs confirmation in project agreements'},
            ]},
          ].map((section,si)=>(
            <div key={si} style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,color:section.color,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>{section.priority} priority</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead>
                  <tr style={{background:'#F8F8F5'}}>
                    <th style={{padding:'7px 10px',textAlign:'left',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#555',fontSize:11}}>Item needed</th>
                    <th style={{padding:'7px 10px',textAlign:'left',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#555',fontSize:11}}>Owner</th>
                    <th style={{padding:'7px 10px',textAlign:'left',fontWeight:600,borderBottom:'0.5px solid #E5E5E0',color:'#555',fontSize:11}}>Why it matters</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item,i)=>(
                    <tr key={i} style={{borderBottom:'0.5px solid #F0F0EA'}}>
                      <td style={{padding:'7px 10px',fontWeight:600}}>{item.what}</td>
                      <td style={{padding:'7px 10px'}}><span style={{fontSize:11,padding:'2px 8px',borderRadius:10,background:section.bg,color:section.color,fontWeight:600}}>{item.owner}</span></td>
                      <td style={{padding:'7px 10px',color:'#666',fontSize:12}}>{item.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
