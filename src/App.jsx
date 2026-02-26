import { useState, useCallback } from "react";
const C = {
  bgDark: "#0B1929", bgMid: "#122740", bgCard: "#FFFFFF", bgPage: "#F0F4F8",
  bgSoft: "#E8EFF6", accent: "#0096D6", accentGlow: "#00B4FF",
  green: "#00875A", greenBg: "#E6F4EE", yellow: "#C68A00", yellowBg: "#FFF7E0",
  orange: "#D66B00", orangeBg: "#FFF0E0", red: "#C41E3A", redBg: "#FDE8EC",
  text: "#0B1929", textMid: "#3D5A73", textLight: "#6B8299", textMuted: "#94A7B8",
  border: "#DAE3EC", borderLight: "#EDF1F5", white: "#FFFFFF",
};
const font = "'Segoe UI',-apple-system,BlinkMacSystemFont,sans-serif";
const riskColor = (l) => {
  if (!l) return { color: C.textMuted, bg: C.bgSoft };
  const v = l.toLowerCase();
  if (v.includes("low") || v.includes("neg")) return { color: C.green, bg: C.greenBg };
  if (v.includes("med") || v.includes("mod")) return { color: C.yellow, bg: C.yellowBg };
  if (v.includes("high") || v.includes("sig")) return { color: C.orange, bg: C.orangeBg };
  if (v.includes("sev") || v.includes("crit")) return { color: C.red, bg: C.redBg };
  return { color: C.textMuted, bg: C.bgSoft };
};
const ratingColor = (val) => {
  if (!val || val === "N/A" || val.includes("Not")) return { color: C.textMuted, bg: C.bgSoft };
  const v = val.toUpperCase();
  if (["AAA","AA","LEADER","PLATINUM","GOLD"].some(x => v.includes(x))) return { color: C.green, bg: C.greenBg };
  if (v === "A" || v === "A-" || ["BBB","SILVER","AVERAGE"].some(x => v.includes(x))) return { color: C.yellow, bg: C.yellowBg };
  if (["BB","B","CCC","BRONZE"].some(x => v.includes(x))) return { color: C.orange, bg: C.orangeBg };
  if (["D","F","FAIL","LAGGARD"].some(x => v.includes(x))) return { color: C.red, bg: C.redBg };
  return { color: C.accent, bg: "#E5F4FB" };
};
const callAPI = async (system, userMessage) => {
  const res = await fetch("/api/assess", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system, userMessage }) });
  if (!res.ok) { const err = await res.json().catch(() => ({ error: "HTTP " + res.status })); throw new Error(err.error || "API error " + res.status); }
  return (await res.json()).text;
};
const extractJSON = (text) => {
  const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
  try { return JSON.parse(clean); } catch {}
  let d = 0, s = -1, e = -1;
  for (let i = 0; i < clean.length; i++) {
    if (clean[i] === "{") { if (d === 0) s = i; d++; } else if (clean[i] === "}") { d--; if (d === 0 && s !== -1) { e = i; break; } }
  }
  if (s !== -1 && e !== -1) { const j = clean.substring(s, e + 1); try { return JSON.parse(j); } catch { return JSON.parse(j.replace(/,\s*}/g, "}").replace(/,\s*\]/g, "]")); } }
  throw new Error("No valid data found");
};
const SYS = "You are an expert ESG research analyst. Search thoroughly using multiple specific queries. When a rating or data point is not found in initial results, try searching specifically for it (e.g. search 'Apple MSCI ESG rating' or 'Nike CDP climate score'). For frameworks, assess based on what the company reports even if not explicitly labeled. Always provide substantive detail in every field - never leave descriptions empty. Respond with ONLY valid JSON. No markdown, no backticks, no extra text.";
const Spinner = ({ size = 18 }) => (<div style={{ width: size, height: size, border: "2.5px solid " + C.border, borderTop: "2.5px solid " + C.accent, borderRadius: "50%", animation: "esgspin .8s linear infinite", flexShrink: 0 }} />);
const Badge = ({ value, sub }) => { const { color, bg } = ratingColor(value); return (<div style={{ textAlign: "center", minWidth: 100 }}><div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 5, background: bg, color, fontWeight: 700, fontSize: 16, border: "1.5px solid " + color + "30", letterSpacing: .5 }}>{value || "N/A"}</div>{sub && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, lineHeight: 1.3 }}>{sub}</div>}</div>); };
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg," + C.bgDark + "," + C.bgMid + " 60%,#1a4470)", fontFamily: font }}>
      <style>{"@keyframes esgspin{to{transform:rotate(360deg)}} @keyframes fadein{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}"}</style>
      <div style={{ width: 380, maxWidth: "92vw", animation: "fadein .6s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, margin: "0 auto 18px", background: "linear-gradient(135deg," + C.accent + "," + C.accentGlow + ")", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 24px " + C.accent + "50" }}><span style={{ fontSize: 24, color: C.white, fontWeight: 700 }}>&#9672;</span></div>
          <h1 style={{ color: C.white, fontSize: 24, fontWeight: 300, margin: 0, letterSpacing: 2 }}>ESG RISK AGENT</h1>
          <p style={{ color: C.textMuted, fontSize: 13, marginTop: 6 }}>AI-Powered Sustainability Intelligence</p>
        </div>
        <div style={{ background: C.white, borderRadius: 10, padding: 28, boxShadow: "0 8px 32px rgba(0,0,0,.12)" }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1.5px solid " + C.border, fontSize: 14, marginBottom: 16, boxSizing: "border-box", outline: "none", color: C.text }} />
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Password</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1.5px solid " + C.border, fontSize: 14, marginBottom: 22, boxSizing: "border-box", outline: "none", color: C.text }} />
          <button onClick={onLogin} style={{ width: "100%", padding: "11px 0", borderRadius: 6, border: "none", cursor: "pointer", background: "linear-gradient(135deg," + C.bgMid + "," + C.bgDark + ")", color: C.white, fontSize: 14, fontWeight: 600 }}>Sign In</button>
        </div>
        <p style={{ textAlign: "center", color: C.textMuted, fontSize: 11, marginTop: 18 }}>Powered by Claude AI</p>
      </div>
    </div>
  );
};
const Results = ({ data: d }) => (
  <div style={{ animation: "fadein .5s ease" }}>
    <div style={{ background: C.bgCard, borderRadius: 10, border: "1px solid " + C.border, padding: 22, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
      <div><h2 style={{ fontSize: 21, fontWeight: 700, color: C.text, margin: 0 }}>{d.companyName}</h2><p style={{ fontSize: 13, color: C.textMid, margin: "3px 0 0" }}>{d.industry} &middot; {d.headquarters}</p><p style={{ fontSize: 11, color: C.textMuted, margin: "5px 0 0" }}>Ticker: {d.ticker} &middot; {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p></div>
      <div style={{ textAlign: "center", padding: "10px 20px", borderRadius: 8, background: riskColor(d.overallRisk).bg, border: "2px solid " + riskColor(d.overallRisk).color + "30" }}><div style={{ fontSize: 10, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Overall ESG Risk</div><div style={{ fontSize: 20, fontWeight: 700, color: riskColor(d.overallRisk).color }}>{d.overallRisk}</div></div>
    </div>
    <div style={{ background: C.bgCard, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 18 }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.borderLight }}><h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>External ESG Ratings</h3></div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", padding: "16px 8px" }}>
        {(d.ratings || []).map((r, i) => (<div key={i} style={{ padding: "8px 10px", textAlign: "center" }}><div style={{ fontSize: 10, fontWeight: 700, color: C.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{r.provider}</div><Badge value={r.rating} sub={r.detail} /></div>))}
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
      <div style={{ background: C.bgCard, borderRadius: 10, border: "1px solid " + C.border }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.borderLight }}><h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Framework Alignment</h3></div>
        {(d.frameworks || []).map((f, i) => { const al = f.status && (f.status.toLowerCase().includes("align") || f.status.toLowerCase().includes("compli") || f.status.toLowerCase().includes("full")); const pa = f.status && (f.status.toLowerCase().includes("partial") || f.status.toLowerCase().includes("progress")); const col = al ? C.green : pa ? C.yellow : C.orange; return (<div key={i} style={{ padding: "11px 16px", borderBottom: "1px solid " + C.borderLight, display: "flex", gap: 10 }}><div style={{ width: 22, height: 22, borderRadius: "50%", background: col + "18", color: col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{al ? "\u2713" : pa ? "\u25D0" : "\u25CB"}</div><div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.name} — <span style={{ fontWeight: 400, color: C.textMid }}>{f.status}</span></div>{f.details && <div style={{ fontSize: 11, color: C.textLight, marginTop: 2, lineHeight: 1.4 }}>{f.details}</div>}</div></div>); })}
      </div>
      <div style={{ background: C.bgCard, borderRadius: 10, border: "1px solid " + C.border }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.borderLight }}><h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Risk Breakdown</h3></div>
        {(d.risks || []).map((r, i) => { const rc = riskColor(r.level); return (<div key={i} style={{ padding: "11px 16px", borderBottom: "1px solid " + C.borderLight }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}><span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.category}</span><span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3, background: rc.bg, color: rc.color, textTransform: "uppercase" }}>{r.level}</span></div>{r.description && <div style={{ fontSize: 11, color: C.textLight, lineHeight: 1.4 }}>{r.description}</div>}</div>); })}
      </div>
    </div>
    {d.climate && d.climate.metrics && d.climate.metrics.length > 0 && (<div style={{ background: C.bgCard, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 18 }}><div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.borderLight }}><h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Climate &amp; Environmental Analysis</h3></div><div style={{ padding: 18 }}><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16 }}>{d.climate.metrics.map((m, i) => (<div key={i} style={{ textAlign: "center", padding: 14, background: C.bgSoft, borderRadius: 8 }}><div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{m.value || m.v}</div><div style={{ fontSize: 11, color: C.textLight, marginTop: 3 }}>{m.label || m.l}</div></div>))}</div>{d.climate.summary && <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7, margin: 0 }}>{d.climate.summary}</p>}</div></div>)}
    {d.financialRisk && d.financialRisk.factors && d.financialRisk.factors.length > 0 && (<div style={{ background: C.bgCard, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 18 }}><div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.borderLight }}><h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Financial Risk Implications</h3></div><div style={{ padding: 18 }}>{d.financialRisk.summary && <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.7, margin: "0 0 14px" }}>{d.financialRisk.summary}</p>}<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{d.financialRisk.factors.map((f, i) => { const fc = riskColor(f.level); return (<div key={i} style={{ padding: 12, background: C.bgSoft, borderRadius: 7, borderLeft: "3px solid " + fc.color }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{f.factor}</span><span style={{ fontSize: 10, fontWeight: 700, color: fc.color }}>{f.level}</span></div>{f.desc && <div style={{ fontSize: 11, color: C.textLight, lineHeight: 1.4 }}>{f.desc}</div>}</div>); })}</div></div></div>)}
    {d.executiveSummary && (<div style={{ background: C.bgCard, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 18 }}><div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.borderLight }}><h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Executive Summary</h3></div><div style={{ padding: 18 }}><p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.8, margin: 0, whiteSpace: "pre-line" }}>{d.executiveSummary}</p></div></div>)}
    {d.recommendations && d.recommendations.length > 0 && (<div style={{ background: C.bgCard, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 18 }}><div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.borderLight }}><h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Key Recommendations</h3></div><div style={{ padding: 18 }}>{d.recommendations.map((r, i) => (<div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < d.recommendations.length - 1 ? "1px solid " + C.borderLight : "none" }}><div style={{ width: 26, height: 26, borderRadius: 6, background: C.accent + "15", color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div><div><div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{r.title}</div><div style={{ fontSize: 12, color: C.textLight, lineHeight: 1.5 }}>{r.description}</div></div></div>))}</div></div>)}
    {d.sources && d.sources.length > 0 && (<div style={{ background: C.bgCard, borderRadius: 10, border: "1px solid " + C.border, marginBottom: 18 }}><div style={{ padding: "14px 18px", borderBottom: "1px solid " + C.borderLight }}><h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>Sources</h3></div><div style={{ padding: "10px 18px" }}>{d.sources.map((s, i) => <div key={i} style={{ fontSize: 11, color: C.textMuted, padding: "3px 0" }}>[{i + 1}] {s}</div>)}</div></div>)}
    <div style={{ padding: 14, background: C.bgSoft, borderRadius: 8, fontSize: 11, color: C.textMuted, lineHeight: 1.6, textAlign: "center" }}>AI-generated assessment using publicly available data. Professional due diligence recommended.</div>
  </div>
);
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [ticker, setTicker] = useState("");
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null);
  const updateStep = (idx) => setSteps(prev => prev.map((s, i) => i === idx ? { ...s, done: true } : s));
  const runAssessment = useCallback(async () => {
    const t = ticker.trim().toUpperCase();
    if (!t || loading) return;
    setLoading(true); setAssessment(null); setError(null);
    setSteps([{ text: "Researching " + t + " ESG ratings, frameworks & climate data...", done: false }, { text: "Analyzing risks, generating summary & recommendations...", done: false }]);
    try {
      const r1 = await callAPI(SYS, 'Research ESG data for stock ticker "' + t + '". Do multiple searches to find ALL of the following:\n\n1. COMPANY: Full name, industry sector, headquarters\n2. MSCI ESG RATING: Search "' + t + ' MSCI ESG rating" - look on sustainalytics.com, msci.com, or marketbeat.com. Rating is AAA to CCC.\n3. CDP CLIMATE SCORE: Search "' + t + ' CDP climate score" - score is A to D-\n4. ECOVADIS: Search "' + t + ' EcoVadis score" - may not exist for all companies, note if not found\n5. MOODYS ESG: Search "' + t + ' Moody ESG rating" - check spglobal.com too for S&P ESG score as alternative\n6. SBTi: Search "' + t + ' Science Based Targets" - check sciencebasedtargets.org\n7. FRAMEWORKS: Based on their sustainability report, assess CSRD readiness, GRI alignment, TCFD disclosure, SASB reporting\n8. CLIMATE METRICS: Find Scope 1+2 emissions, renewable energy %, net-zero target year\n\nFor each rating, provide the actual rating/score AND a 1-sentence explanation. If truly not found after searching, explain WHY (e.g. "Company is private and not rated by MSCI").\n\nReturn JSON: {"companyName":"name","ticker":"' + t + '","industry":"sector","hq":"location","msci":{"r":"rating","d":"1 sentence context"},"ecovadis":{"r":"rating or Not Rated","d":"explanation"},"cdp":{"r":"grade","d":"context"},"moodys":{"r":"rating","d":"context"},"sbti":{"r":"status","d":"target details"},"csrd":{"s":"Aligned/Partial/In Progress/Not Applicable","d":"2 sentence explanation"},"gri":{"s":"status","d":"2 sentence explanation"},"tcfd":{"s":"status","d":"2 sentence explanation"},"sasb":{"s":"status","d":"2 sentence explanation"},"m1":{"l":"metric name","v":"value with units"},"m2":{"l":"metric name","v":"value"},"m3":{"l":"metric name","v":"value"},"climateSummary":"Detailed paragraph on climate strategy, targets, and progress"}');
      const d1 = extractJSON(r1);
      updateStep(0);
      await new Promise(r => setTimeout(r, 3000));
      const cn = d1.companyName || t;
      const r2 = await callAPI(SYS, 'You are assessing ESG risks for ' + cn + ' (ticker: ' + t + ').\n\nKnown data: MSCI ' + (d1.msci && d1.msci.r || "N/A") + ', CDP ' + (d1.cdp && d1.cdp.r || "N/A") + ', Industry: ' + (d1.industry || "N/A") + '\n\nSearch for recent ESG controversies, regulatory actions, supply chain issues, and climate commitments for this company.\n\nFor EACH risk category, provide a specific 2-3 sentence explanation citing real issues or strengths:\n- Environmental: emissions performance, pollution incidents, resource use\n- Social: labor practices, supply chain ethics, diversity, data privacy\n- Governance: board independence, executive pay, transparency, accounting\n- Climate Transition: decarbonization progress, stranded asset risk, green revenue\n- Regulatory: antitrust, sanctions, environmental fines, compliance gaps\n\nAlso provide 3 SPECIFIC, ACTIONABLE recommendations (not generic advice).\n\nThe executive summary should be 2-3 substantial paragraphs covering strengths, weaknesses, and outlook.\n\nReturn JSON: {"overallRisk":"Low/Medium/High/Severe","env":{"l":"level","d":"2-3 sentence specific explanation"},"soc":{"l":"level","d":"explanation"},"gov":{"l":"level","d":"explanation"},"climate":{"l":"level","d":"explanation"},"reg":{"l":"level","d":"explanation"},"finSummary":"Paragraph on financial implications of ESG risks","finFactors":[{"f":"factor name","l":"level","d":"1 sentence"},{"f":"factor","l":"level","d":"detail"},{"f":"factor","l":"level","d":"detail"}],"summary":"2-3 paragraph executive summary","recs":[{"t":"specific title","d":"actionable detail"},{"t":"title","d":"detail"},{"t":"title","d":"detail"}],"sources":["Source with year","Source 2","Source 3","Source 4","Source 5"]}');
      const d2 = extractJSON(r2);
      updateStep(1);
      setAssessment({
        companyName: d1.companyName || t, ticker: d1.ticker || t, industry: d1.industry || "N/A", headquarters: d1.hq || "N/A", overallRisk: d2.overallRisk || "Medium",
        ratings: [{ provider: "MSCI", rating: d1.msci && d1.msci.r || "N/A", detail: d1.msci && d1.msci.d || "" }, { provider: "EcoVadis", rating: d1.ecovadis && d1.ecovadis.r || "N/A", detail: d1.ecovadis && d1.ecovadis.d || "" }, { provider: "CDP", rating: d1.cdp && d1.cdp.r || "N/A", detail: d1.cdp && d1.cdp.d || "" }, { provider: "Moody's", rating: d1.moodys && d1.moodys.r || "N/A", detail: d1.moodys && d1.moodys.d || "" }, { provider: "SBTi", rating: d1.sbti && d1.sbti.r || "N/A", detail: d1.sbti && d1.sbti.d || "" }],
        frameworks: [{ name: "CSRD", status: d1.csrd && d1.csrd.s || "N/A", details: d1.csrd && d1.csrd.d || "" }, { name: "GRI Standards", status: d1.gri && d1.gri.s || "N/A", details: d1.gri && d1.gri.d || "" }, { name: "TCFD", status: d1.tcfd && d1.tcfd.s || "N/A", details: d1.tcfd && d1.tcfd.d || "" }, { name: "SASB", status: d1.sasb && d1.sasb.s || "N/A", details: d1.sasb && d1.sasb.d || "" }],
        risks: [{ category: "Environmental", level: d2.env && d2.env.l || "N/A", description: d2.env && d2.env.d || "" }, { category: "Social", level: d2.soc && d2.soc.l || "N/A", description: d2.soc && d2.soc.d || "" }, { category: "Governance", level: d2.gov && d2.gov.l || "N/A", description: d2.gov && d2.gov.d || "" }, { category: "Climate Transition", level: d2.climate && d2.climate.l || "N/A", description: d2.climate && d2.climate.d || "" }, { category: "Regulatory", level: d2.reg && d2.reg.l || "N/A", description: d2.reg && d2.reg.d || "" }],
        climate: { metrics: [d1.m1, d1.m2, d1.m3].filter(function(m) { return m && (m.l || m.label); }), summary: d1.climateSummary || "" },
        financialRisk: { summary: d2.finSummary || "", factors: (d2.finFactors || []).map(function(f) { return { factor: f.f, level: f.l, desc: f.d }; }) },
        executiveSummary: d2.summary || "", recommendations: (d2.recs || []).map(function(r) { return { title: r.t, description: r.d }; }), sources: d2.sources || [],
      });
    } catch (err) { console.error(err); setError(err.message || "Assessment failed."); } finally { setLoading(false); }
  }, [ticker, loading]);
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;
  return (
    <div style={{ minHeight: "100vh", background: C.bgPage, fontFamily: font }}>
      <style>{"@keyframes esgspin{to{transform:rotate(360deg)}} @keyframes fadein{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}"}</style>
      <nav style={{ background: C.bgDark, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg," + C.accent + "," + C.accentGlow + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: C.white, fontWeight: 700 }}>&#9672;</div><span style={{ color: C.white, fontSize: 15, fontWeight: 300, letterSpacing: 1.5 }}>ESG RISK AGENT</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}><span style={{ color: C.textMuted, fontSize: 12 }}>Dashboard</span><div style={{ width: 30, height: 30, borderRadius: "50%", background: C.bgMid, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 12, fontWeight: 600 }}>U</div></div>
      </nav>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ background: "linear-gradient(140deg," + C.bgDark + "," + C.bgMid + ")", borderRadius: 12, padding: "34px 28px", marginBottom: 28, boxShadow: "0 4px 20px rgba(11,25,41,.15)" }}>
          <h2 style={{ color: C.white, fontSize: 20, fontWeight: 300, margin: "0 0 6px", letterSpacing: .5 }}>AI-Powered ESG Risk Assessment</h2>
          <p style={{ color: C.textMuted, fontSize: 13, margin: "0 0 20px" }}>Enter a stock ticker for a comprehensive sustainability risk analysis</p>
          <div style={{ display: "flex", gap: 10 }}>
            <input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} onKeyDown={e => e.key === "Enter" && runAssessment()} placeholder="e.g. AAPL, MSFT, JPM, TSLA..." disabled={loading} style={{ flex: 1, padding: "11px 16px", borderRadius: 7, border: "2px solid " + C.bgMid, fontSize: 15, fontWeight: 600, outline: "none", background: "rgba(255,255,255,.95)", color: C.text, letterSpacing: 1.5, textTransform: "uppercase", boxSizing: "border-box" }} />
            <button onClick={runAssessment} disabled={!ticker.trim() || loading} style={{ padding: "11px 24px", borderRadius: 7, border: "none", background: (!ticker.trim() || loading) ? C.textMuted : "linear-gradient(135deg," + C.accent + "," + C.accentGlow + ")", color: C.white, fontSize: 13, fontWeight: 600, cursor: (!ticker.trim() || loading) ? "not-allowed" : "pointer", whiteSpace: "nowrap", boxShadow: (!ticker.trim() || loading) ? "none" : "0 2px 14px " + C.accent + "40" }}>{loading ? "Analyzing..." : "Run Assessment"}</button>
          </div>
        </div>
        {loading && (<div style={{ background: C.bgCard, borderRadius: 10, border: "1px solid " + C.border, padding: 20, marginBottom: 24, animation: "fadein .3s ease" }}><h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Researching {ticker.trim().toUpperCase()}...</h3>{steps.map((s, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>{s.done ? <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.greenBg, color: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{"\u2713"}</div> : <Spinner />}<span style={{ fontSize: 13, color: s.done ? C.textLight : C.text, fontWeight: s.done ? 400 : 500 }}>{s.text}</span></div>))}<p style={{ fontSize: 11, color: C.textMuted, marginTop: 10 }}>This typically takes 15-30 seconds</p></div>)}
        {assessment && !loading && <Results data={assessment} />}
        {!assessment && !loading && (<div style={{ textAlign: "center", padding: "56px 20px", animation: "fadein .5s ease" }}><div style={{ fontSize: 44, opacity: .25, marginBottom: 14 }}>&#9672;</div><h3 style={{ fontSize: 17, fontWeight: 400, color: C.textMid, margin: "0 0 8px" }}>Enter a stock ticker to begin</h3><p style={{ fontSize: 13, color: C.textLight, maxWidth: 480, margin: "0 auto 20px" }}>The AI agent researches ESG ratings, framework compliance, climate data, risks, and financial implications.</p><div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 7 }}>{["AAPL","MSFT","JPM","TSLA","AMZN","UL","XOM","BLK","NKE","SHEL"].map(t => (<button key={t} onClick={() => setTicker(t)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: C.bgDark + "08", color: C.bgMid, border: "1px solid " + C.bgDark + "15", cursor: "pointer", letterSpacing: .5 }}>{t}</button>))}</div></div>)}
      </div>
      <footer style={{ padding: "18px 28px", background: C.bgDark, marginTop: 36, display: "flex", justifyContent: "space-between" }}><span style={{ color: C.textMuted, fontSize: 11 }}>ESG Risk Agent &copy; 2025</span><span style={{ color: C.textMuted, fontSize: 11 }}>Powered by Claude AI</span></footer>
      {error && (<div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: C.white, padding: "14px 20px", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,.15)", zIndex: 999, display: "flex", alignItems: "center", gap: 14, border: "1px solid " + C.border, maxWidth: "90vw" }}><span style={{ color: C.red, fontSize: 18 }}>&#9888;</span><div style={{ flex: 1, color: C.textMid, fontSize: 12 }}>{error}</div><button onClick={() => { setError(null); runAssessment(); }} style={{ padding: "6px 14px", borderRadius: 5, border: "none", background: C.accent, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Retry</button><button onClick={() => setError(null)} style={{ padding: "6px 10px", borderRadius: 5, border: "1px solid " + C.border, background: "transparent", color: C.textLight, fontSize: 12, cursor: "pointer" }}>{"\u2715"}</button></div>)}
    </div>
  );
}
