import { useState, useEffect, useRef } from "react";

const RATES = {
  cooking:    { label: "Cooking & Meal Prep",     icon: "🍳", rate: 150, unit: "meals/day",  max: 6  },
  cleaning:   { label: "House Cleaning",           icon: "🧹", rate: 200, unit: "hours/day",  max: 8  },
  childcare:  { label: "Childcare & Education",    icon: "👶", rate: 300, unit: "hours/day",  max: 10 },
  laundry:    { label: "Laundry & Ironing",        icon: "👕", rate: 100, unit: "hours/day",  max: 4  },
  groceries:  { label: "Grocery & Errands",        icon: "🛒", rate: 150, unit: "trips/week", max: 7  },
  eldercare:  { label: "Elder Care",               icon: "🤱", rate: 300, unit: "hours/day",  max: 8  },
  management: { label: "Household Management",     icon: "📋", rate: 250, unit: "hours/day",  max: 4  },
};

const STORIES = [
  { name: "Priya, 38", city: "Mumbai", family: 5, monthly: 28400, quote: "I worked 14 hours every day for 12 years. Nobody counted it as work." },
  { name: "Kavitha, 52", city: "Chennai", family: 7, monthly: 34200, quote: "My children are doctors and engineers. My contribution? 'Just a housewife.'" },
  { name: "Sunita, 44", city: "Delhi", family: 4, monthly: 21600, quote: "When I asked for pocket money, they said — what do you need it for? You don't work." },
  { name: "Meena, 31", city: "Pune", family: 6, monthly: 31800, quote: "I left my job after marriage. 8 years later I have no savings, no experience on paper, no financial identity." },
];

const FACTS = [
  "India's unpaid domestic work is worth ₹22.7 lakh crore/year — larger than the IT industry",
  "81% of Indian women do unpaid household work. Only 26% of men do.",
  "Indian women spend 7.5 hours/day on unpaid work. Men spend 2.5 hours.",
  "In a 2021 court ruling, Madras HC valued a homemaker's work at ₹3 lakh/month",
  "A live-in cook + housekeeper + nanny in Mumbai costs ₹35,000–₹55,000/month",
  "Only 19% of Indian women have their own bank accounts with independent access",
];

const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");

export default function GrihaLakshmi() {
  const [step, setStep] = useState(0); // 0=intro, 1=calculator, 2=result, 3=pledge
  const [familySize, setFamilySize] = useState(4);
  const [isWorking, setIsWorking] = useState(false);
  const [name, setName] = useState("");
  const [duties, setDuties] = useState({ cooking:3, cleaning:2, childcare:0, laundry:1, groceries:3, eldercare:0, management:1 });
  const [factIdx, setFactIdx] = useState(0);
  const [storyIdx, setStoryIdx] = useState(0);
  const [animVal, setAnimVal] = useState(0);
  const [pledgeAmt, setPledgeAmt] = useState("");
  const [pledgeDone, setPledgeDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t1 = setInterval(() => setFactIdx(i => (i+1) % FACTS.length), 4500);
    const t2 = setInterval(() => setStoryIdx(i => (i+1) % STORIES.length), 6000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  const monthly = Math.round(
    Object.entries(duties).reduce((s, [k, v]) => {
      const r = RATES[k];
      const mult = k === "groceries" ? v * 4 : v * 30;
      const fam  = k === "cooking"   ? familySize / 2 : 1;
      return s + r.rate * mult * fam;
    }, 0) * (isWorking ? 0.45 : 1)
  );
  const annual = monthly * 12;
  const career = annual * 25;

  useEffect(() => {
    if (step === 2) {
      let cur = 0; const step2 = monthly / 50;
      const t = setInterval(() => {
        cur += step2; if (cur >= monthly) { setAnimVal(monthly); clearInterval(t); }
        else setAnimVal(Math.round(cur));
      }, 25);
      return () => clearInterval(t);
    }
  }, [step, monthly]);

  const shareText = `${name ? name + "'s mother" : "A homemaker"} cooks, cleans, and cares for ${familySize} people every single day. Her work is worth ${fmt(monthly)}/month — ${fmt(annual)}/year. She has never been paid a salary in her life.\n\nIt's time India sees what she's worth.\n\n#GrihaLakshmi #UnpaidWork #IndianWomen #HerValueMatters`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareText);
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  const g = s => ({ background: s });
  const gold = "linear-gradient(90deg,#FFD700,#FF9D00)";

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#0f0520 0%,#1a0535 50%,#0f0520 100%)", fontFamily:"Georgia,serif", color:"#fff", padding:"16px" }}>

      {/* Floating background orbs */}
      {[...Array(4)].map((_,i) => (
        <div key={i} style={{ position:"fixed", borderRadius:"50%", background:`radial-gradient(circle,rgba(255,${150+i*20},0,0.06) 0%,transparent 70%)`, width:`${300+i*100}px`, height:`${300+i*100}px`, top:`${i*25}%`, left:`${i*22}%`, pointerEvents:"none", zIndex:0 }} />
      ))}

      <div style={{ maxWidth:"680px", margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign:"center", padding:"28px 0 24px" }}>
          <div style={{ fontSize:"52px", lineHeight:1 }}>🏮</div>
          <h1 style={{ fontSize:"clamp(30px,7vw,48px)", fontWeight:700, background:gold, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:"10px 0 4px" }}>GrihaLakshmi</h1>
          <p style={{ color:"#c084fc", fontSize:"15px", fontStyle:"italic", margin:"0 0 6px" }}>गृह लक्ष्मी — The Wealth of the Home</p>
          <p style={{ color:"#a0a0b8", fontSize:"13px", maxWidth:"440px", margin:"0 auto", lineHeight:1.6 }}>
            India has 250 million homemakers. Their combined work is worth <strong style={{color:"#FFD700", whiteSpace:"nowrap"}}>₹22.7 lakh crore</strong> every year. None of them receive a salary.
          </p>
        </div>

        {/* ── ROTATING FACT ── */}
        <div style={{ background:"rgba(255,165,0,0.08)", border:"1px solid rgba(255,165,0,0.2)", borderRadius:"12px", padding:"12px 18px", marginBottom:"20px", fontSize:"13px", color:"#fbbf24", textAlign:"center", lineHeight:1.5 }}>
          📊 {FACTS[factIdx]}
        </div>

        {/* ── REAL STORY CAROUSEL ── */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"16px", padding:"18px 20px", marginBottom:"24px" }}>
          <div style={{ fontSize:"11px", color:"#888", letterSpacing:"0.1em", marginBottom:"8px", textTransform:"uppercase" }}>Real Story</div>
          <p style={{ fontStyle:"italic", color:"#d4d4e8", fontSize:"14px", lineHeight:1.7, margin:"0 0 10px" }}>
            "{STORIES[storyIdx].quote}"
          </p>
          <div style={{ fontSize:"12px", color:"#FFD700" }}>
            — {STORIES[storyIdx].name}, {STORIES[storyIdx].city} &nbsp;·&nbsp; Family of {STORIES[storyIdx].family} &nbsp;·&nbsp; Unpaid value: <strong>{fmt(STORIES[storyIdx].monthly)}/month</strong>
          </div>
        </div>

        {/* ── STEP INDICATOR ── */}
        <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginBottom:"24px" }}>
          {["Her Profile","Her Work","Her Value","The Pledge"].map((s,i) => (
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:700, background: step >= i ? gold : "rgba(255,255,255,0.08)", color: step >= i ? "#1a0535" : "#666" }}>{i+1}</div>
              <span style={{ fontSize:"10px", color: step >= i ? "#FFD700" : "#555", whiteSpace:"nowrap" }}>{s}</span>
            </div>
          ))}
        </div>

        {/* ══ STEP 0: INTRO / NAME ══ */}
        {step === 0 && (
          <div style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)", borderRadius:"24px", border:"1px solid rgba(255,255,255,0.1)", padding:"28px" }}>
            <h2 style={{ color:"#FFD700", fontSize:"17px", marginTop:0 }}>Who are you calculating for?</h2>
            <p style={{ color:"#a0a0b8", fontSize:"13px", marginTop:0, lineHeight:1.7 }}>This calculator shows the real market value of a homemaker's daily contributions — based on actual rates paid for cooks, housekeepers, childcare workers, and elder care professionals in India.</p>

            <div style={{ marginBottom:"20px" }}>
              <label style={{ color:"#c0c0d8", fontSize:"13px", display:"block", marginBottom:"8px" }}>Her name (optional — makes the report personal)</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Amma, Maa, my wife..." style={{ width:"100%", padding:"12px 14px", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)", color:"#fff", fontSize:"14px", fontFamily:"Georgia,serif", boxSizing:"border-box" }} />
            </div>

            <div style={{ marginBottom:"24px" }}>
              <label style={{ color:"#c0c0d8", fontSize:"13px", display:"block", marginBottom:"10px" }}>How many people does she care for?</label>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                {[2,3,4,5,6,7,8].map(n => (
                  <button key={n} onClick={()=>setFamilySize(n)} style={{ width:"46px", height:"46px", borderRadius:"50%", border:"2px solid", borderColor: familySize===n?"#FFD700":"rgba(255,255,255,0.15)", background: familySize===n?"rgba(255,215,0,0.18)":"transparent", color: familySize===n?"#FFD700":"#777", fontSize:"16px", fontWeight:"bold", cursor:"pointer", transition:"all 0.2s" }}>{n}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:"24px" }}>
              <label style={{ color:"#c0c0d8", fontSize:"13px", display:"block", marginBottom:"10px" }}>Her work situation</label>
              <div style={{ display:"flex", gap:"10px" }}>
                {[{v:false,l:"🏠 Full-time Homemaker"},{v:true,l:"💼 Working + Homemaker"}].map(o=>(
                  <button key={String(o.v)} onClick={()=>setIsWorking(o.v)} style={{ flex:1, padding:"12px 8px", borderRadius:"12px", border:"2px solid", borderColor:isWorking===o.v?"#FF9D00":"rgba(255,255,255,0.12)", background:isWorking===o.v?"rgba(255,157,0,0.12)":"transparent", color:isWorking===o.v?"#FFB84D":"#777", fontSize:"12px", cursor:"pointer", fontFamily:"Georgia,serif" }}>{o.l}</button>
                ))}
              </div>
            </div>

            <button onClick={()=>setStep(1)} style={{ width:"100%", padding:"14px", borderRadius:"14px", border:"none", background:gold, color:"#1a0535", fontSize:"15px", fontWeight:"bold", cursor:"pointer", fontFamily:"Georgia,serif" }}>
              Next: What Does She Do? →
            </button>
          </div>
        )}

        {/* ══ STEP 1: DUTIES ══ */}
        {step === 1 && (
          <div style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)", borderRadius:"24px", border:"1px solid rgba(255,255,255,0.1)", padding:"28px" }}>
            <h2 style={{ color:"#FFD700", fontSize:"17px", marginTop:0, marginBottom:"6px" }}>Her Daily Contributions</h2>
            <p style={{ color:"#888", fontSize:"12px", marginTop:0, marginBottom:"24px" }}>Adjust each slider to match her actual daily routine. Market rates shown are real 2024 figures.</p>

            {Object.entries(RATES).map(([key, info]) => (
              <div key={key} style={{ marginBottom:"22px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px", alignItems:"center" }}>
                  <span style={{ color:"#d0d0e0", fontSize:"13px" }}>{info.icon} {info.label}</span>
                  <span style={{ color:"#FFD700", fontSize:"13px", fontWeight:"bold" }}>
                    {duties[key]} {info.unit} <span style={{color:"#666",fontWeight:"normal",fontSize:"11px"}}>· {fmt(info.rate)}/{info.unit.split('/')[1]}</span>
                  </span>
                </div>
                <input type="range" min="0" max={info.max} value={duties[key]}
                  onChange={e=>setDuties(d=>({...d,[key]:Number(e.target.value)}))}
                  style={{ width:"100%", accentColor:"#FFD700", cursor:"pointer", height:"4px" }} />
                <div style={{ height:"4px", background:`linear-gradient(90deg, rgba(255,215,0,0.6) ${(duties[key]/info.max)*100}%, rgba(255,255,255,0.1) 0%)`, borderRadius:"4px", marginTop:"-4px", pointerEvents:"none" }} />
              </div>
            ))}

            <div style={{ display:"flex", gap:"10px", marginTop:"8px" }}>
              <button onClick={()=>setStep(0)} style={{ flex:0.4, padding:"13px", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.15)", background:"transparent", color:"#888", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"14px" }}>← Back</button>
              <button onClick={()=>{setStep(2);setAnimVal(0);}} style={{ flex:1, padding:"13px", borderRadius:"12px", border:"none", background:gold, color:"#1a0535", fontSize:"15px", fontWeight:"bold", cursor:"pointer", fontFamily:"Georgia,serif", boxShadow:"0 4px 20px rgba(255,157,0,0.4)" }}>
                ✨ Reveal Her True Value
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 2: RESULT ══ */}
        {step === 2 && (
          <div>
            <div style={{ background:"linear-gradient(135deg,rgba(255,157,0,0.12),rgba(255,215,0,0.07))", border:"2px solid rgba(255,215,0,0.35)", borderRadius:"24px", padding:"32px", textAlign:"center", marginBottom:"16px" }}>
              <p style={{ color:"#c084fc", fontSize:"13px", marginTop:0 }}>{name ? `${name}'s monthly contribution` : "Monthly economic contribution"}</p>
              <div style={{ fontSize:"clamp(40px,9vw,60px)", fontWeight:700, background:gold, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:"4px 0" }}>{fmt(animVal)}</div>
              <p style={{ color:"#888", fontSize:"12px", margin:"0 0 24px" }}>per month · unpaid · uncounted · unrecognised</p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginBottom:"24px" }}>
                {[
                  {icon:"📅", label:"Per Year",   val:fmt(annual)},
                  {icon:"🏆", label:"Per Decade",  val:fmt(annual*10)},
                  {icon:"💔", label:"Career Total", val:fmt(career)},
                ].map(c => (
                  <div key={c.label} style={{ background:"rgba(255,255,255,0.05)", borderRadius:"12px", padding:"14px 10px" }}>
                    <div style={{fontSize:"20px"}}>{c.icon}</div>
                    <div style={{color:"#FFD700",fontWeight:"bold",fontSize:"14px",margin:"4px 0"}}>{c.val}</div>
                    <div style={{color:"#666",fontSize:"10px"}}>{c.label}</div>
                  </div>
                ))}
              </div>

              {/* Emotional comparison */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:"14px", padding:"16px", marginBottom:"20px", textAlign:"left" }}>
                <div style={{ fontSize:"12px", color:"#888", marginBottom:"10px", textTransform:"uppercase", letterSpacing:"0.08em" }}>What this work is actually worth</div>
                {[
                  {role:"Full-time cook (Mumbai)", cost:"₹15,000–₹25,000/mo"},
                  {role:"Live-in nanny / childcare", cost:"₹12,000–₹22,000/mo"},
                  {role:"Housekeeper (daily)", cost:"₹8,000–₹15,000/mo"},
                  {role:"Elder care attendant", cost:"₹18,000–₹30,000/mo"},
                ].map(r => (
                  <div key={r.role} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.05)", fontSize:"12px" }}>
                    <span style={{color:"#c0c0d8"}}>{r.role}</span>
                    <span style={{color:"#FFD700",fontWeight:600}}>{r.cost}</span>
                  </div>
                ))}
                <div style={{ marginTop:"12px", fontSize:"13px", color:"#fbbf24", fontStyle:"italic", textAlign:"center" }}>
                  {name||"She"} does all of this. Every day. For free.
                </div>
              </div>

              {/* Shareable caption */}
              <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:"14px", padding:"16px", marginBottom:"16px", fontSize:"13px", color:"#d0d0e0", lineHeight:1.7, textAlign:"left", fontStyle:"italic", border:"1px solid rgba(255,255,255,0.08)" }}>
                <div style={{fontSize:"11px",color:"#888",marginBottom:"8px",fontStyle:"normal",letterSpacing:"0.08em",textTransform:"uppercase"}}>Your shareable caption 📱</div>
                {shareText}
              </div>

              <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
                <button onClick={handleCopy} style={{ flex:1, minWidth:"140px", padding:"12px", borderRadius:"30px", border:"2px solid rgba(255,215,0,0.4)", background:"transparent", color:copied?"#4ade80":"#FFD700", fontSize:"13px", cursor:"pointer", fontFamily:"Georgia,serif", transition:"all 0.3s" }}>
                  {copied ? "✅ Copied!" : "📤 Copy & Share"}
                </button>
                <button onClick={()=>setStep(3)} style={{ flex:1, minWidth:"140px", padding:"12px", borderRadius:"30px", border:"none", background:gold, color:"#1a0535", fontSize:"13px", fontWeight:"bold", cursor:"pointer", fontFamily:"Georgia,serif" }}>
                  💛 Make a Pledge →
                </button>
              </div>
            </div>

            <button onClick={()=>setStep(1)} style={{ width:"100%", padding:"12px", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#666", cursor:"pointer", fontFamily:"Georgia,serif", fontSize:"13px" }}>← Adjust numbers</button>
          </div>
        )}

        {/* ══ STEP 3: PLEDGE ══ */}
        {step === 3 && (
          <div style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)", borderRadius:"24px", border:"1px solid rgba(255,255,255,0.1)", padding:"28px" }}>
            {!pledgeDone ? (
              <>
                <h2 style={{ color:"#FFD700", fontSize:"17px", marginTop:0 }}>💛 The Pledge</h2>
                <p style={{ color:"#d0d0e0", fontSize:"13px", lineHeight:1.7, marginBottom:"20px" }}>
                  You now know what {name||"she"}'s work is worth — <strong style={{color:"#FFD700"}}>{fmt(monthly)}/month</strong>. The pledge isn't about money alone. It's about acknowledgement. A monthly amount — however small — sent to her own account, with a note that says: <em style={{color:"#c084fc"}}>"This is for you. Because your work has value."</em>
                </p>

                <div style={{ marginBottom:"20px" }}>
                  <label style={{ color:"#c0c0d8", fontSize:"13px", display:"block", marginBottom:"8px" }}>How much would you like to send her monthly?</label>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px", marginBottom:"12px" }}>
                    {[2000,5000,10000,15000].map(a=>(
                      <button key={a} onClick={()=>setPledgeAmt(String(a))} style={{ padding:"10px 6px", borderRadius:"10px", border:"2px solid", borderColor:pledgeAmt===String(a)?"#FFD700":"rgba(255,255,255,0.12)", background:pledgeAmt===String(a)?"rgba(255,215,0,0.12)":"transparent", color:pledgeAmt===String(a)?"#FFD700":"#888", fontSize:"13px", cursor:"pointer" }}>₹{(a/1000).toFixed(0)}K</button>
                    ))}
                  </div>
                  <input value={pledgeAmt} onChange={e=>setPledgeAmt(e.target.value)} placeholder="Or enter your own amount..." style={{ width:"100%", padding:"12px 14px", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)", color:"#fff", fontSize:"14px", fontFamily:"Georgia,serif", boxSizing:"border-box" }} />
                  {pledgeAmt && !isNaN(Number(pledgeAmt)) && (
                    <p style={{ color:"#a0a0b8", fontSize:"12px", marginTop:"8px" }}>
                      That's {fmt(Number(pledgeAmt)*12)}/year — {Math.round(Number(pledgeAmt)/monthly*100)}% of her contribution. Every rupee says: <em>"I see your work."</em>
                    </p>
                  )}
                </div>

                <button onClick={()=>setPledgeDone(true)} style={{ width:"100%", padding:"14px", borderRadius:"14px", border:"none", background:gold, color:"#1a0535", fontSize:"15px", fontWeight:"bold", cursor:"pointer", fontFamily:"Georgia,serif", boxShadow:"0 4px 20px rgba(255,157,0,0.4)" }}>
                  💛 I Pledge This
                </button>
              </>
            ) : (
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"52px", marginBottom:"12px" }}>🙏</div>
                <h2 style={{ color:"#FFD700", fontSize:"18px" }}>Your pledge is made.</h2>
                <p style={{ color:"#d0d0e0", fontSize:"13px", lineHeight:1.7, maxWidth:"380px", margin:"0 auto 20px" }}>
                  Share GrihaLakshmi so other families can see what their homemaker is worth. Every share is one more woman who learns her value. 🏮
                </p>
                <button onClick={handleCopy} style={{ padding:"12px 28px", borderRadius:"30px", border:"2px solid rgba(255,215,0,0.4)", background:"transparent", color:"#FFD700", fontSize:"14px", cursor:"pointer", fontFamily:"Georgia,serif" }}>
                  {copied?"✅ Copied!":"📤 Share GrihaLakshmi"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── PITCH FOOTER ── */}
        <div style={{ textAlign:"center", padding:"28px 0 16px", borderTop:"1px solid rgba(255,255,255,0.05)", marginTop:"28px" }}>
          <p style={{ color:"#4a4060", fontSize:"11px", margin:"0 0 4px" }}>Built by Gunjan Deshpande · MS Data Science </p>
          <p style={{ color:"#555", fontSize:"12px", marginTop:"10px" }}>💛 Because every homemaker deserves to know her worth</p>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        input[type=range]{height:4px;-webkit-appearance:none;appearance:none;background:rgba(255,255,255,0.1);border-radius:4px;outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#FFD700;cursor:pointer;box-shadow:0 0 8px rgba(255,215,0,0.5)}
        button:active{transform:scale(0.98)}
      `}</style>
    </div>
  );
}
