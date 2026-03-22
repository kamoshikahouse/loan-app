import { useState } from "react";

// ── 計算ヘルパー ──────────────────────────────────────────────────────────────
function calcMonthly(p, r, n) {
  var pm = r / 1200, mo = n * 12;
  if (pm === 0) return (p * 10000) / mo;
  return (p * 10000 * pm * Math.pow(1 + pm, mo)) / (Math.pow(1 + pm, mo) - 1);
}
function calcTakeHome(inc) {
  var t = 0;
  if (inc <= 195) t = inc * 0.05;
  else if (inc <= 330) t = 9.75 + (inc - 195) * 0.10;
  else if (inc <= 695) t = 23.25 + (inc - 330) * 0.20;
  else if (inc <= 900) t = 96.25 + (inc - 695) * 0.23;
  else if (inc <= 1800) t = 143.4 + (inc - 900) * 0.33;
  else t = 440.4 + (inc - 1800) * 0.40;
  return Math.round(inc - t - inc * 0.145);
}
function calcBalance(loan, r, term, months) {
  var pm = r / 1200, pmt = calcMonthly(loan, r, term);
  if (pm === 0) return Math.max(0, loan * 10000 - pmt * months);
  return Math.max(0, loan * 10000 * Math.pow(1 + pm, months) - pmt * (Math.pow(1 + pm, months) - 1) / pm);
}
var R = function(n, d) { d = d === undefined ? 1 : d; return Math.round(n * Math.pow(10, d)) / Math.pow(10, d); };

// ── デザイントークン ──────────────────────────────────────────────────────────
// Luxury Minimal: 純白・極細・大きな数字・鮮やかなアクセント
var D = {
  bg:      "#FFFFFF",
  surface: "#FAFAFA",
  canvas:  "#F5F5F7",
  ink:     "#1D1D1F",
  inkMd:   "#3D3D3F",
  inkLt:   "#6E6E73",
  inkXl:   "#AEAEB2",
  border:  "rgba(0,0,0,0.08)",
  borderMd:"rgba(0,0,0,0.14)",
  accent:  "#0A84FF",
  accentBg:"#EBF4FF",
  emerald: "#00C7B1",
  emeraldBg:"#E6FBF9",
  amber:   "#FF9F0A",
  amberBg: "#FFF6E6",
  rose:    "#FF3B30",
  roseBg:  "#FFF0EF",
  violet:  "#5E5CE6",
  violetBg:"#F0F0FF",
  gold:    "#F5A623",
  r:       16,
  rSm:     10,
  rXl:     24,
};

// ── グローバルスタイル ─────────────────────────────────────────────────────────
function GS() {
  var css = [
    "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');",
    "*{box-sizing:border-box;margin:0;padding:0}",
    "html,body{font-family:'Inter','Noto Sans JP',sans-serif;background:#F5F5F7;color:#1D1D1F;-webkit-font-smoothing:antialiased;letter-spacing:-0.01em}",
    "input,select,button,textarea{font-family:inherit;letter-spacing:-0.01em}",
    "input[type=number]:focus,select:focus{outline:none;border-color:#0A84FF;box-shadow:0 0 0 3px rgba(10,132,255,0.15)}",
    "::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(0,0,0,.12);border-radius:2px}",
    "@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}",
    "@keyframes dp{0%,80%,100%{transform:scale(.5);opacity:.3}40%{transform:scale(1);opacity:1}}",
    ".ani{animation:fadeIn .35s cubic-bezier(.25,.46,.45,.94) both}",
    "input[type=range]{-webkit-appearance:none;height:2px;background:rgba(0,0,0,.12);border-radius:1px;cursor:pointer;width:100%}",
    "input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#0A84FF;cursor:pointer;box-shadow:0 1px 4px rgba(10,132,255,.4)}",
    "input[type=range]:focus{outline:none}",
  ].join("\n");
  return <style>{css}</style>;
}

// ── 共通UIコンポーネント ──────────────────────────────────────────────────────
function Card(props) {
  var base = {
    background: D.bg,
    border: "1px solid " + D.border,
    borderRadius: D.r,
    padding: "28px 28px",
    marginBottom: 16,
  };
  return <div style={Object.assign({}, base, props.style || {})}>{props.children}</div>;
}

function SectionLabel(props) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: D.inkXl, marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid " + D.border }}>
      {props.children}
    </div>
  );
}

function FieldLabel(props) {
  return <div style={{ fontSize: 12, fontWeight: 500, color: D.inkLt, marginBottom: 7, letterSpacing: "0.01em" }}>{props.children}</div>;
}

function FR(props) {
  return <div style={{ marginBottom: 18 }}><FieldLabel>{props.label}</FieldLabel>{props.children}</div>;
}

function Inp(props) {
  return (
    <input
      value={props.value}
      onChange={props.onChange}
      type={props.type || "number"}
      step={props.step}
      max={props.max}
      placeholder={props.placeholder}
      style={{
        width: "100%",
        padding: "11px 14px",
        border: "1px solid " + D.border,
        borderRadius: D.rSm,
        fontSize: 15,
        color: D.ink,
        background: D.surface,
        transition: "border-color .15s, box-shadow .15s",
      }}
    />
  );
}

function Sel(props) {
  return (
    <select
      value={props.value}
      onChange={props.onChange}
      style={{
        width: "100%",
        padding: "11px 14px",
        border: "1px solid " + D.border,
        borderRadius: D.rSm,
        fontSize: 15,
        color: D.ink,
        background: D.surface,
        cursor: "pointer",
      }}
    >
      {props.children}
    </select>
  );
}

function Btn(props) {
  var base = {
    width: "100%",
    padding: "14px",
    background: props.disabled ? D.inkXl : D.ink,
    color: "#fff",
    border: "none",
    borderRadius: D.rSm,
    fontSize: 15,
    fontWeight: 600,
    cursor: props.disabled ? "not-allowed" : "pointer",
    letterSpacing: "-0.01em",
    marginTop: props.mt || 0,
    transition: "background .15s, transform .1s",
  };
  return <button onClick={props.onClick} disabled={props.disabled} style={Object.assign({}, base, props.style || {})}>{props.children}</button>;
}

function GhostBtn(props) {
  return (
    <button onClick={props.onClick} style={{ flex: 1, padding: "12px", border: "1px solid " + D.border, borderRadius: D.rSm, background: "transparent", fontSize: 14, color: D.inkMd, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}>
      {props.children}
    </button>
  );
}

function Tag(props) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: props.bg || D.accentBg, color: props.color || D.accent, letterSpacing: "0.02em" }}>
      {props.children}
    </span>
  );
}

function BigNumber(props) {
  return (
    <div style={{ background: D.surface, borderRadius: D.r, padding: "20px 22px", border: "1px solid " + D.border }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: D.inkXl, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{props.label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: props.color || D.ink, letterSpacing: "-0.03em", lineHeight: 1 }}>{props.value}</div>
      {props.sub && <div style={{ fontSize: 12, color: D.inkLt, marginTop: 6 }}>{props.sub}</div>}
    </div>
  );
}

function AlertBox(props) {
  var colors = {
    ok:   [D.emeraldBg, D.emerald, "✓"],
    warn: [D.amberBg,   D.amber,   "△"],
    ng:   [D.roseBg,    D.rose,    "✕"],
    info: [D.accentBg,  D.accent,  "i"],
  };
  var c = colors[props.type] || colors.info;
  return (
    <div style={{ display: "flex", gap: 12, padding: "14px 16px", borderRadius: D.rSm, background: c[0], marginBottom: 8 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: c[1], flexShrink: 0, marginTop: 1 }}>{c[2]}</span>
      <span style={{ fontSize: 13, color: D.inkMd, lineHeight: 1.65 }}>{props.text}</span>
    </div>
  );
}

function Tip(props) {
  return (
    <div style={{ background: D.surface, border: "1px solid " + D.border, borderRadius: D.rSm, padding: "16px 18px", marginTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: D.inkLt, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>{props.icon} {props.title}</div>
      <div style={{ fontSize: 13, color: D.inkMd, lineHeight: 1.75 }}>{props.children || props.text}</div>
    </div>
  );
}

function Disc(props) {
  return <div style={{ fontSize: 11, color: D.inkXl, marginTop: 16, lineHeight: 1.7 }}>{"※ " + props.text}</div>;
}

function SliderField(props) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <FieldLabel>{props.label}</FieldLabel>
        <span style={{ fontSize: 20, fontWeight: 700, color: D.ink, letterSpacing: "-0.03em" }}>{props.display !== undefined ? props.display : props.value}</span>
      </div>
      <input
        type="range" min={props.min} max={props.max} step={props.step}
        value={props.value}
        onChange={function(e) { props.onChange(parseFloat(e.target.value)); }}
      />
    </div>
  );
}

function ToggleGroup(props) {
  return (
    <div style={{ display: "flex", gap: 0, background: D.surface, borderRadius: D.rSm, border: "1px solid " + D.border, padding: 3, marginBottom: 22 }}>
      {props.options.map(function(opt) {
        var active = props.value === opt[0];
        return (
          <button key={opt[0]} onClick={function() { props.onChange(opt[0]); }}
            style={{ flex: 1, padding: "9px 0", border: "none", borderRadius: 8, background: active ? D.bg : "transparent", color: active ? D.ink : D.inkLt, fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", boxShadow: active ? "0 1px 3px rgba(0,0,0,.1)" : "none" }}>
            {opt[1]}
          </button>
        );
      })}
    </div>
  );
}

function BarChart(props) {
  var max = props.max || 100;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: D.inkLt, marginBottom: 8 }}>
        <span>{props.label}</span>
        <span style={{ fontWeight: 600, color: D.ink }}>{props.valueLabel}</span>
      </div>
      <div style={{ height: 6, background: D.canvas, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: Math.min(100, props.value / max * 100) + "%", background: props.color || D.accent, borderRadius: 3, transition: "width .4s" }} />
      </div>
    </div>
  );
}

function StackedBar(props) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: D.inkLt, marginBottom: 8 }}>
        <span>手取り月収</span>
        <span style={{ fontWeight: 600, color: D.ink }}>{props.total}万円</span>
      </div>
      <div style={{ height: 8, background: D.canvas, borderRadius: 4, overflow: "hidden", display: "flex" }}>
        <div style={{ width: props.loanPct + "%", background: D.ink, transition: "width .4s" }} />
        <div style={{ width: props.expPct + "%", background: D.inkXl, transition: "width .4s" }} />
        <div style={{ flex: 1, background: props.rem >= 0 ? D.emerald : D.rose, opacity: 0.7 }} />
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 11, color: D.inkLt }}>
        <span><span style={{ color: D.ink }}>●</span> ローン {props.loanM}万</span>
        <span><span style={{ color: D.inkXl }}>●</span> 生活費 {props.expTotal}万</span>
        <span style={{ fontWeight: 600, color: props.rem >= 0 ? D.emerald : D.rose }}><span>●</span> 残 {props.rem}万</span>
      </div>
    </div>
  );
}

// ── 生活費項目 ────────────────────────────────────────────────────────────────
var EXP_ITEMS = [
  { key: "food",  label: "食費",        icon: "🍚", bench: function(m) { return m <= 1 ? 3 : m <= 2 ? 5 : m <= 3 ? 6.5 : 8; } },
  { key: "util",  label: "水道光熱費",   icon: "💡", bench: function() { return 2; } },
  { key: "comms", label: "通信費",       icon: "📱", bench: function(m) { return m <= 1 ? 0.8 : 1.5; } },
  { key: "car",   label: "車関連",       icon: "🚗", bench: function() { return 3; } },
  { key: "ins",   label: "保険料",       icon: "🏥", bench: function(m, a) { return a < 40 ? 1.5 : 2.5; } },
  { key: "edu",   label: "教育費",       icon: "📚", bench: function(m, a, c) { return c * 2; } },
  { key: "fun",   label: "娯楽・外食",   icon: "🎉", bench: function(m) { return m <= 1 ? 2 : 3; } },
  { key: "daily", label: "日用品・被服", icon: "🛍", bench: function(m) { return m <= 1 ? 1 : 2; } },
  { key: "med",   label: "医療費",       icon: "💊", bench: function(m, a) { return a > 50 ? 1.5 : 0.5; } },
  { key: "save",  label: "貯蓄・積立",   icon: "💰", bench: function(m, a, c, inc) { return R(inc * 10 / 12 / 100, 1); } },
  { key: "other", label: "その他",       icon: "📦", bench: function() { return 1; } },
];

var AI_SYS = "あなたは住宅ローンと家計管理の専門家です。ユーザーの家計データを分析し、具体的なアドバイスを日本語で提供してください。全体評価（◎○△×）、費目別コメント（数字入りで）、借入額の妥当性、安全な借入上限、将来のリスク、次のアクション3つを含めてください。率直かつ寄り添うトーンで。";

// ── ヒーロー ──────────────────────────────────────────────────────────────────
function Hero(props) {
  var features = [
    ["📊","審査"],["🏠","生活費"],["🔄","金利比較"],
    ["💨","繰り上げ"],["💴","諸費用"],["🔮","将来リスク"],
    ["📋","必要書類"],["👫","ペアローン"],["📖","用語集"],["📅","手続き"],
  ];
  return (
    <div style={{ minHeight: "100vh", background: D.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 32px", textAlign: "center" }}>
      <div style={{ maxWidth: 540 }}>
        <div style={{ display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 32, padding: "6px 16px", border: "1px solid rgba(255,255,255,.15)", borderRadius: 20 }}>
          住まいのお金診断
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 20 }}>
          本当に払える<br />
          <span style={{ color: D.gold }}>住宅ローン</span>を、<br />
          数字で知る。
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,.5)", lineHeight: 1.9, marginBottom: 56, fontWeight: 300 }}>
          返済比率から老後資金まで。住宅ローンで<br />気になること10項目をひとつのツールに。
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 52 }}>
          {features.map(function(f) {
            return (
              <div key={f[0]} style={{ padding: "14px 6px", background: "rgba(255,255,255,.05)", borderRadius: D.rSm, border: "1px solid rgba(255,255,255,.07)" }}>
                <div style={{ fontSize: 18, marginBottom: 5 }}>{f[0]}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)", letterSpacing: "0.02em" }}>{f[1]}</div>
              </div>
            );
          })}
        </div>
        <button onClick={props.onStart} style={{ padding: "18px 56px", background: "#fff", color: D.ink, border: "none", borderRadius: 50, fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.02em" }}>
          無料ではじめる
        </button>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.2)", marginTop: 16 }}>登録不要 · 個人情報不要 · 完全無料</div>
      </div>
    </div>
  );
}

// ── APIモーダル ───────────────────────────────────────────────────────────────
function ApiModal(props) {
  var stored = "";
  try { stored = localStorage.getItem("lp_key") || ""; } catch(e) {}
  var s = useState(stored);
  var val = s[0], setVal = s[1];
  function save() {
    if (!val.trim()) return;
    try { localStorage.setItem("lp_key", val.trim()); } catch(e) {}
    props.onSave(val.trim());
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
      <div style={{ background: D.bg, borderRadius: D.r, padding: 36, maxWidth: 440, width: "100%", border: "1px solid " + D.border }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: D.ink, marginBottom: 8, letterSpacing: "-0.03em" }}>APIキーを設定する</div>
        <p style={{ fontSize: 14, color: D.inkLt, lineHeight: 1.75, marginBottom: 20 }}>Anthropic APIキーを設定すると、家計データをAIが詳しく分析してアドバイスをくれます。</p>
        <div style={{ background: D.accentBg, borderRadius: D.rSm, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: D.accent, lineHeight: 1.65 }}>
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: D.accent, fontWeight: 600 }}>console.anthropic.com</a> でAPIキーを取得できます。1回の利用は数円程度です。
        </div>
        <FieldLabel>APIキー（sk-ant-...）</FieldLabel>
        <input type="password" value={val} onChange={function(e) { setVal(e.target.value); }} placeholder="sk-ant-api03-..." style={{ width: "100%", padding: "12px 14px", border: "1px solid " + D.border, borderRadius: D.rSm, fontSize: 14, background: D.surface, color: D.ink, marginBottom: 16 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <GhostBtn onClick={props.onClose}>キャンセル</GhostBtn>
          <Btn onClick={save} disabled={!val.trim()} style={{ flex: 2, marginTop: 0 }}>保存して使う</Btn>
        </div>
        <div style={{ fontSize: 11, color: D.inkXl, marginTop: 14, lineHeight: 1.65 }}>※ APIキーはAnthropicとの通信にのみ使用します。開発者はキーを受信しません。</div>
      </div>
    </div>
  );
}

// ── 1. 審査シミュレーション ────────────────────────────────────────────────────
function SimPanel() {
  var s1 = useState({ type:"emp",inc:500,age:35,tenure:5,bizyr:5,loan:3500,term:35,rate:0.5,prop:4000,debtpy:0,credit:"clean",health:"ok",biz:"good" });
  var f = s1[0], setF = s1[1];
  var s2 = useState(null); var res = s2[0], setRes = s2[1];
  function upd(k,v) { setF(function(p){var o=Object.assign({},p);o[k]=v;return o;}); }

  function run() {
    var tp=f.type,inc=f.inc,age=f.age,tenure=f.tenure,bizyr=f.bizyr,loan=f.loan,term=f.term,rate=f.rate,prop=f.prop,debtpy=f.debtpy,credit=f.credit,health=f.health,biz=f.biz;
    var monthly=calcMonthly(loan,rate,term);
    var ratio=inc>0?((monthly*12/10000+debtpy)/inc)*100:999;
    var thr=inc<400?30:35, ltv=prop>0?loan/prop*100:0, compAge=age+term;
    var score=100, issues=[];
    function push(t,m){issues.push({t:t,m:m});}
    if(ratio>thr+5){score-=40;push("ng","返済比率 "+ratio.toFixed(1)+"% — 基準"+thr+"%を大幅超過。借入額の見直しか頭金の増額を検討してください。");}
    else if(ratio>thr){score-=20;push("warn","返済比率 "+ratio.toFixed(1)+"% — 基準"+thr+"%をやや超えています。条件次第で通過の可能性もあります。");}
    else push("ok","返済比率 "+ratio.toFixed(1)+"% — 基準内（"+thr+"%以内）で問題ありません。");
    if(compAge>80){score-=20;push("warn","完済時 "+compAge+"歳 — 多くの銀行で80歳以下が目安。返済期間の短縮を検討ください。");}
    else push("ok","完済時 "+compAge+"歳 — 問題ありません。");
    if(tp==="emp"||tp==="part"){
      if(tenure<1){score-=30;push("ng","勤続"+tenure+"年 — 1年未満は多くの銀行で審査困難です。");}
      else if(tenure<3){score-=10;push("warn","勤続"+tenure+"年 — 3年以上が望ましいとされています。");}
      else push("ok","勤続"+tenure+"年 — 問題ありません。");
      if(tp==="part"){score-=15;push("warn","非正規雇用の場合、審査でより厳しく見られる傾向があります。");}
    }
    if(tp==="self"||tp==="corp"){
      if(bizyr<3){score-=25;push("warn","業歴"+bizyr+"年 — 3年以上の業歴と確定申告3期分が一般的に必要です。");}
      else push("ok","業歴"+bizyr+"年 — 問題ありません。");
      if(tp==="corp"){
        if(biz==="bad"){score-=30;push("ng","法人が赤字・債務超過の場合、審査に大きく影響します。");}
        else if(biz==="mixed"){score-=10;push("warn","法人の業績が安定しないと審査上マイナスになる場合があります。");}
        else push("ok","法人財務3期連続黒字 — 問題ありません。");
      }
    }
    if(credit==="active"){score-=50;push("ng","現在延滞中の場合、審査は通りません。まず完済・信用回復が必要です。");}
    else if(credit==="settled"){score-=40;push("ng","債務整理歴は5〜10年登録されます。登録期間中は審査は難しい状況です。");}
    else if(credit==="late"){score-=15;push("warn","過去の延滞履歴は審査に影響することがあります。");}
    else push("ok","信用情報：問題ありません。");
    if(health==="ng"){score-=30;push("warn","ワイド団信やフラット35（団信任意）もご検討ください。");}
    else if(health==="warn"){score-=10;push("warn","持病がある場合は正確な告知が必要です。");}
    else push("ok","健康状態：問題ありません。");
    if(ltv>100){score-=15;push("warn","LTV "+ltv.toFixed(0)+"% — 物件価格を超える借入です。頭金を増やすと有利になります。");}
    else if(ltv>90)push("info","LTV "+ltv.toFixed(0)+"% — やや高め。保証料や金利に影響する場合があります。");
    else if(prop>0)push("ok","LTV "+ltv.toFixed(0)+"% — 問題ありません。");
    var vd;
    if(score>=75)vd={cls:"ok",icon:"◎",title:"審査通過の可能性が高い条件です",sub:"主要な指標は基準内に収まっています。金融機関への相談を進めてみましょう。"};
    else if(score>=50)vd={cls:"warn",icon:"△",title:"確認・改善が必要な点があります",sub:"条件によっては通過の可能性があります。専門家への相談をおすすめします。"};
    else vd={cls:"ng",icon:"✕",title:"現状のままでは難しい可能性があります",sub:"複数の課題があります。改善できる点から取り組み、専門家にご相談ください。"};
    setRes({vd:vd,issues:issues,monthly:monthly,ratio:ratio,thr:thr,compAge:compAge,ltv:ltv,term:term,rate:rate});
  }
  var vColors={ok:[D.emeraldBg,D.emerald],warn:[D.amberBg,D.amber],ng:[D.roseBg,D.rose]};
  var isSC=f.type==="self"||f.type==="corp";
  return (
    <div style={{display:"grid",gridTemplateColumns:"400px 1fr",gap:20,alignItems:"start"}}>
      <div>
        <Card>
          <SectionLabel>申込者の情報</SectionLabel>
          <FR label="属性"><Sel value={f.type} onChange={function(e){upd("type",e.target.value);}}>
            <option value="emp">会社員（正社員）</option><option value="part">会社員（非正規）</option>
            <option value="self">個人事業主</option><option value="corp">法人代表者・役員</option>
          </Sel></FR>
          <FR label="年収（万円）"><Inp value={f.inc} onChange={function(e){upd("inc",parseFloat(e.target.value)||0);}}/></FR>
          <FR label="年齢"><Inp value={f.age} onChange={function(e){upd("age",parseFloat(e.target.value)||0);}}/></FR>
          <FR label="勤続年数（年）"><Inp value={f.tenure} onChange={function(e){upd("tenure",parseFloat(e.target.value)||0);}} step={0.5}/></FR>
          {isSC && <FR label="業歴（年）"><Inp value={f.bizyr} onChange={function(e){upd("bizyr",parseFloat(e.target.value)||0);}}/></FR>}
        </Card>
        <Card>
          <SectionLabel>借入・物件の条件</SectionLabel>
          <FR label="借入希望額（万円）"><Inp value={f.loan} onChange={function(e){upd("loan",parseFloat(e.target.value)||0);}}/></FR>
          <FR label="返済期間（年）"><Inp value={f.term} onChange={function(e){upd("term",parseFloat(e.target.value)||35);}} max={35}/></FR>
          <FR label="金利（%）"><Inp value={f.rate} onChange={function(e){upd("rate",parseFloat(e.target.value)||0);}} step={0.1}/></FR>
          <FR label="物件価格（万円）"><Inp value={f.prop} onChange={function(e){upd("prop",parseFloat(e.target.value)||0);}}/></FR>
          <FR label="他の借入の年間返済額（万円）"><Inp value={f.debtpy} onChange={function(e){upd("debtpy",parseFloat(e.target.value)||0);}}/></FR>
        </Card>
        <Card>
          <SectionLabel>信用・健康情報</SectionLabel>
          <FR label="過去の信用履歴"><Sel value={f.credit} onChange={function(e){upd("credit",e.target.value);}}>
            <option value="clean">問題なし</option><option value="late">過去に延滞あり（完済済）</option>
            <option value="active">現在延滞中</option><option value="settled">債務整理の経験あり</option>
          </Sel></FR>
          <FR label="健康状態（団信用）"><Sel value={f.health} onChange={function(e){upd("health",e.target.value);}}>
            <option value="ok">問題なし</option><option value="warn">持病あり（治療中など）</option><option value="ng">重篤な持病あり</option>
          </Sel></FR>
          {f.type==="corp" && <FR label="法人の財務状況"><Sel value={f.biz} onChange={function(e){upd("biz",e.target.value);}}>
            <option value="good">3期連続黒字</option><option value="mixed">黒字・赤字の混在</option><option value="bad">赤字または債務超過</option>
          </Sel></FR>}
          <Btn onClick={run} mt={8}>シミュレーションを実行する</Btn>
        </Card>
      </div>
      <div>
        {!res ? (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:320,background:D.bg,borderRadius:D.r,border:"1px solid "+D.border}}>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:D.inkXl}}>左のフォームに入力して実行してください</div>
          </div>
        ) : (
          <div className="ani">
            <div style={{background:vColors[res.vd.cls][0],borderRadius:D.r,padding:"28px 32px",marginBottom:16,border:"1px solid "+vColors[res.vd.cls][1]+"40"}}>
              <div style={{fontSize:13,fontWeight:600,color:vColors[res.vd.cls][1],letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10}}>{res.vd.icon} 診断結果</div>
              <div style={{fontSize:22,fontWeight:700,color:D.ink,letterSpacing:"-0.03em",marginBottom:6}}>{res.vd.title}</div>
              <div style={{fontSize:14,color:D.inkLt,lineHeight:1.6}}>{res.vd.sub}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <BigNumber label="返済比率" value={res.ratio.toFixed(1)+"%"} sub={"目安 "+res.thr+"%以内"} color={res.ratio>res.thr?(res.ratio>res.thr+5?D.rose:D.amber):D.emerald}/>
              <BigNumber label="月返済額（概算）" value={Math.round(res.monthly/1000).toLocaleString()+"千円"} sub={"金利"+res.rate+"%・"+res.term+"年"} color={D.ink}/>
              <BigNumber label="完済時年齢" value={res.compAge+"歳"} sub="目安 80歳以下" color={res.compAge>80?D.amber:D.emerald}/>
              <BigNumber label="LTV（融資比率）" value={res.ltv.toFixed(0)+"%"} sub="物件価格に対して" color={res.ltv>100?D.rose:res.ltv>90?D.amber:D.emerald}/>
            </div>
            <Card>
              <SectionLabel>診断の詳細</SectionLabel>
              {res.issues.map(function(iss,i){return <AlertBox key={i} type={iss.t} text={iss.m}/>;} )}
              <Disc text="一般的な基準による参考値です。実際の審査結果は金融機関によって異なります。"/>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 2. 生活費診断 ─────────────────────────────────────────────────────────────
function LifePanel() {
  var s0=useState(1); var step=s0[0],setStep=s0[1];
  var s1=useState({income:500,age:35,members:2,children:0,loan:3500,term:35,rate:0.5}); var basic=s1[0],setBasic=s1[1];
  var s2=useState(function(){var d={};EXP_ITEMS.forEach(function(it){d[it.key]="";});return d;}); var exp=s2[0],setExp=s2[1];
  var s3=useState(false); var showApi=s3[0],setShowApi=s3[1];
  var s4=useState(function(){try{return localStorage.getItem("lp_key")||"";}catch(e){return "";}}); var apiKey=s4[0],setApiKey=s4[1];
  var s5=useState(""); var aiText=s5[0],setAiText=s5[1];
  var s6=useState(false); var aiLoading=s6[0],setAiLoading=s6[1];
  function sb(k,v){setBasic(function(p){var o=Object.assign({},p);o[k]=v;return o;});}
  function se(k,v){setExp(function(p){var o=Object.assign({},p);o[k]=v;return o;});}
  var th=calcTakeHome(basic.income), mTH=R(th/12);
  var loanM=R(calcMonthly(basic.loan,basic.rate,basic.term)/10000);
  var totExp=EXP_ITEMS.reduce(function(a,it){return a+(parseFloat(exp[it.key])||0);},0);
  var rem=R(mTH-loanM-totExp);
  var lPct=Math.min(100,(loanM/mTH)*100), ePct=Math.min(100,Math.max(0,(totExp/mTH)*100));
  var rColor=rem>=5?D.emerald:rem>=0?D.amber:D.rose;
  var safeMax=(function(){
    var sm=Math.min(mTH*0.30,Math.max(0,(mTH-totExp)*0.6));
    if(sm<=0)return 0;
    var r=basic.rate/1200,mo=basic.term*12;
    return r===0?R(sm*mo/10000,0):R(sm*(Math.pow(1+r,mo)-1)/(r*Math.pow(1+r,mo))/10000,0);
  })();
  function evalExp(item){
    var val=parseFloat(exp[item.key])||0; if(!val)return null;
    var bench=item.bench(basic.members,basic.age,basic.children,basic.income);
    if(!bench||bench===0)return null;
    var ratio=val/bench;
    if(ratio>1.4)return{label:"多すぎ",color:D.rose,bg:D.roseBg,bench:bench};
    if(ratio>1.15)return{label:"やや多め",color:D.amber,bg:D.amberBg,bench:bench};
    if(ratio<0.6&&bench>0.5)return{label:"少なめ",color:D.accent,bg:D.accentBg,bench:bench};
    return{label:"適正",color:D.emerald,bg:D.emeraldBg,bench:bench};
  }
  function localAdvice(){
    var a=[];
    EXP_ITEMS.forEach(function(item){
      var val=parseFloat(exp[item.key])||0; if(!val)return;
      var ev=evalExp(item); if(!ev)return;
      if(ev.label==="多すぎ")a.push({ic:"⚠",t:item.label+"が目安より "+R(val-ev.bench)+"万円/月 多め。年間 "+R((val-ev.bench)*12,0)+"万円 の節約余地があります。"});
      else if(ev.label==="やや多め")a.push({ic:"💡",t:item.label+"をわずかに見直すと年間 "+R((val-ev.bench)*12,0)+"万円 程度の節約ができます。"});
    });
    if(rem<0)a.unshift({ic:"⚠",t:"現状の生活費だと毎月 "+Math.abs(rem)+"万円 の赤字になります。借入額の見直しか生活費の削減が必要です。"});
    else if(rem<3)a.unshift({ic:"⚠",t:"残額 "+rem+"万円/月 は緊急資金の積立がほぼできない水準です。"});
    else if(rem>=5)a.unshift({ic:"✓",t:"毎月 "+rem+"万円 の余裕があります。この条件での返済は現実的な水準です。"});
    if(basic.loan>safeMax&&safeMax>0)a.push({ic:"↓",t:"安全な借入上限は約 "+safeMax+"万円。希望額より "+R(basic.loan-safeMax,0)+"万円 多く、見直しをおすすめします。"});
    if(basic.children>0)a.push({ic:"🎓",t:"お子さんの教育費（大学進学で500〜1,000万円）が今後発生します。"});
    if(a.length===0)a.push({ic:"✓",t:"現状の生活費と借入条件のバランスは問題ありません。"});
    return a;
  }
  function runAI(){
    setAiLoading(true); setAiText("");
    var details=EXP_ITEMS.map(function(it){
      var val=parseFloat(exp[it.key])||0;
      var bench=it.bench(basic.members,basic.age,basic.children,basic.income);
      var ev=evalExp(it);
      return it.label+"："+(val||"未入力")+"万円/月（目安"+bench+"万円 / "+(ev?ev.label:"未入力")+"）";
    }).join("\n");
    var prompt="年収"+basic.income+"万円 / "+basic.age+"歳 / 家族"+basic.members+"人（子"+basic.children+"人）\n手取り月収："+mTH+"万円 / 借入希望："+basic.loan+"万円 / "+basic.term+"年 / 金利"+basic.rate+"%\n月返済額："+loanM+"万円\n\n【生活費】\n"+details+"\n\n生活費合計："+R(totExp)+"万円/月 / 残額："+rem+"万円/月 / 安全借入上限目安："+safeMax+"万円";
    fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,system:AI_SYS,messages:[{role:"user",content:prompt}]})})
    .then(function(res){return res.json();}).then(function(d){if(d.error)throw new Error(d.error.message||"API Error");setAiText(d.content?d.content.map(function(b){return b.text||"";}).join(""):"");}).catch(function(e){setAiText("エラー："+e.message);}).finally(function(){setAiLoading(false);});
  }
  function StepDot(p){
    return(
      <div style={{display:"flex",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:step>p.n?"pointer":"default"}} onClick={function(){if(step>p.n)setStep(p.n);}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:step>=p.n?D.ink:D.canvas,color:step>=p.n?"#fff":D.inkXl,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>
            {step>p.n?"✓":p.n}
          </div>
          <span style={{fontSize:13,fontWeight:step===p.n?600:400,color:step===p.n?D.ink:D.inkXl}}>{p.label}</span>
        </div>
        {p.n<3&&<div style={{width:40,height:1,background:step>p.n?D.ink:D.border,margin:"0 12px"}}/>}
      </div>
    );
  }
  return(
    <div>
      {showApi&&<ApiModal onSave={function(k){setApiKey(k);setShowApi(false);}} onClose={function(){setShowApi(false);}}/>}
      <div style={{display:"flex",alignItems:"center",marginBottom:36}}>
        <StepDot n={1} label="基本情報"/>
        <StepDot n={2} label="生活費"/>
        <StepDot n={3} label="診断結果"/>
      </div>
      {step===1&&(
        <div className="ani" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <Card><SectionLabel>あなたの情報</SectionLabel>
            <FR label="年収（万円）"><Inp value={basic.income} onChange={function(e){sb("income",parseFloat(e.target.value)||0);}}/></FR>
            <FR label="年齢"><Inp value={basic.age} onChange={function(e){sb("age",parseFloat(e.target.value)||0);}}/></FR>
            <FR label="家族の人数"><Sel value={basic.members} onChange={function(e){sb("members",parseInt(e.target.value));}}>
              <option value={1}>1人（おひとり様）</option><option value={2}>2人（夫婦など）</option>
              <option value={3}>3人</option><option value={4}>4人</option><option value={5}>5人以上</option>
            </Sel></FR>
            <FR label="うち子供の人数"><Sel value={basic.children} onChange={function(e){sb("children",parseInt(e.target.value));}}>
              <option value={0}>0人</option><option value={1}>1人</option><option value={2}>2人</option><option value={3}>3人</option><option value={4}>4人以上</option>
            </Sel></FR>
          </Card>
          <Card><SectionLabel>借入希望の条件</SectionLabel>
            <FR label="借入希望額（万円）"><Inp value={basic.loan} onChange={function(e){sb("loan",parseFloat(e.target.value)||0);}}/></FR>
            <FR label="返済期間（年）"><Inp value={basic.term} onChange={function(e){sb("term",parseFloat(e.target.value)||35);}} max={35}/></FR>
            <FR label="金利（%）"><Inp value={basic.rate} onChange={function(e){sb("rate",parseFloat(e.target.value)||0.5);}} step={0.1}/></FR>
            <div style={{background:D.canvas,borderRadius:D.r,padding:"20px 24px",marginTop:8}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:D.inkXl,marginBottom:16}}>プレビュー</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                {[["手取り月収",mTH+"万円"],["月返済額",loanM+"万円"],["返済後残額",R(mTH-loanM)+"万円"],["完済時年齢",(basic.age+basic.term)+"歳"]].map(function(it){
                  return(<div key={it[0]}><div style={{fontSize:11,color:D.inkXl,marginBottom:4}}>{it[0]}</div><div style={{fontSize:20,fontWeight:700,color:D.ink,letterSpacing:"-0.03em"}}>{it[1]}</div></div>);
                })}
              </div>
            </div>
            <Btn onClick={function(){setStep(2);}} mt={20}>次へ — 生活費を入力する</Btn>
          </Card>
        </div>
      )}
      {step===2&&(
        <div className="ani" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <Card><SectionLabel>月間の生活費</SectionLabel>
            <div style={{fontSize:13,color:D.inkLt,marginBottom:20,lineHeight:1.7}}>現在の毎月の支出を入力してください。空欄でも診断できますが、入力が多いほど精度が上がります。</div>
            {EXP_ITEMS.map(function(item){
              var ev=evalExp(item);
              var bench=item.bench(basic.members,basic.age,basic.children,basic.income);
              return(
                <div key={item.key} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <label style={{fontSize:14,color:D.inkMd,fontWeight:500}}>{item.icon} {item.label}</label>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:11,color:D.inkXl}}>目安 {bench>0?bench:"—"}万円</span>
                      {ev&&<Tag bg={ev.bg} color={ev.color}>{ev.label}</Tag>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <Inp value={exp[item.key]} onChange={function(e){se(item.key,e.target.value);}} step={0.1} placeholder={bench>0?String(bench):"0"}/>
                    <span style={{fontSize:12,color:D.inkXl,flexShrink:0}}>万円/月</span>
                  </div>
                </div>
              );
            })}
          </Card>
          <div>
            <Card>
              <SectionLabel>収支のリアルタイム確認</SectionLabel>
              <StackedBar total={mTH} loanM={loanM} expTotal={R(totExp)} rem={rem} loanPct={lPct} expPct={ePct}/>
              <div style={{marginTop:24,padding:"20px 22px",background:D.canvas,borderRadius:D.r}}>
                <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:D.inkXl,marginBottom:8}}>ローン＋生活費後の残額</div>
                <div style={{fontSize:40,fontWeight:700,color:rColor,letterSpacing:"-0.04em",lineHeight:1}}>{rem}<span style={{fontSize:16,fontWeight:400,color:D.inkLt,marginLeft:4}}>万円/月</span></div>
                <div style={{fontSize:13,color:rColor,marginTop:8}}>{rem>=10?"十分な余裕があります":rem>=5?"やや余裕がある水準です":rem>=0?"貯蓄・緊急資金が不足しがちです":"収支がマイナスになっています"}</div>
              </div>
              {safeMax>0&&(
                <div style={{marginTop:16,padding:"16px 20px",background:D.accentBg,borderRadius:D.r}}>
                  <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:D.accent,marginBottom:6}}>生活費を考慮した安全な借入上限</div>
                  <div style={{fontSize:28,fontWeight:700,color:D.ink,letterSpacing:"-0.03em"}}>{safeMax.toLocaleString()}<span style={{fontSize:14,fontWeight:400,color:D.inkLt,marginLeft:4}}>万円</span></div>
                  {basic.loan>safeMax&&<div style={{fontSize:12,color:D.rose,marginTop:6,fontWeight:600}}>希望額が {R(basic.loan-safeMax,0)}万円 多い状態です</div>}
                </div>
              )}
              <div style={{display:"flex",gap:10,marginTop:20}}>
                <GhostBtn onClick={function(){setStep(1);}}>← 戻る</GhostBtn>
                <Btn onClick={function(){setStep(3);}} style={{flex:2,marginTop:0}}>診断結果を見る</Btn>
              </div>
            </Card>
          </div>
        </div>
      )}
      {step===3&&(function(){
        var advices=localAdvice();
        return(
          <div className="ani" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <div>
              <Card>
                <SectionLabel>家計診断サマリー</SectionLabel>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
                  {[["手取り月収",mTH+"万円",D.ink],["月ローン返済",loanM+"万円",D.ink],["生活費合計",R(totExp)+"万円",D.inkMd],["月間残額",rem+"万円",rColor]].map(function(it){
                    return(<div key={it[0]} style={{background:D.canvas,borderRadius:D.rSm,padding:"18px 20px"}}><div style={{fontSize:11,color:D.inkXl,marginBottom:6,fontWeight:500,letterSpacing:"0.03em"}}>{it[0]}</div><div style={{fontSize:22,fontWeight:700,color:it[2],letterSpacing:"-0.03em"}}>{it[1]}</div></div>);
                  })}
                </div>
                <StackedBar total={mTH} loanM={loanM} expTotal={R(totExp)} rem={rem} loanPct={lPct} expPct={ePct}/>
              </Card>
              <Card>
                <SectionLabel>費目別評価</SectionLabel>
                {EXP_ITEMS.map(function(item){
                  var val=parseFloat(exp[item.key])||0; if(!val)return null;
                  var ev=evalExp(item); if(!ev)return null;
                  return(
                    <div key={item.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid "+D.border}}>
                      <div style={{display:"flex",gap:12,alignItems:"center"}}>
                        <span style={{fontSize:18}}>{item.icon}</span>
                        <div><div style={{fontSize:14,fontWeight:500,color:D.inkMd}}>{item.label}</div><div style={{fontSize:11,color:D.inkXl,marginTop:2}}>目安 {ev.bench}万円/月</div></div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:16,fontWeight:700,color:ev.color,letterSpacing:"-0.02em"}}>{val}万円</div>
                        <Tag bg={ev.bg} color={ev.color}>{ev.label}</Tag>
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
            <div>
              <Card>
                <SectionLabel>診断アドバイス</SectionLabel>
                <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
                  {advices.map(function(a,i){
                    return(
                      <div key={i} style={{display:"flex",gap:14,padding:"16px 18px",background:D.canvas,borderRadius:D.rSm,fontSize:14,lineHeight:1.7}}>
                        <span style={{fontSize:16,flexShrink:0}}>{a.ic}</span>
                        <span style={{color:D.inkMd}}>{a.t}</span>
                      </div>
                    );
                  })}
                </div>
                <Tip icon="" title="次のステップ">
                  {["銀行・信用金庫の住宅ローン相談窓口に行く","FP（ファイナンシャルプランナー）に家計全体を相談する","複数の金融機関で事前審査（仮審査）を比較する"].map(function(t,i){
                    return <div key={i} style={{display:"flex",gap:10,marginBottom:8}}><span style={{color:D.accent,fontWeight:600,flexShrink:0}}>{i+1}.</span><span>{t}</span></div>;
                  })}
                </Tip>
              </Card>
              <Card>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <SectionLabel style={{marginBottom:0,paddingBottom:0,borderBottom:"none"}}>AIによる詳細アドバイス</SectionLabel>
                  {apiKey&&<Tag bg={D.emeraldBg} color={D.emerald}>APIキー設定済</Tag>}
                </div>
                <div style={{borderBottom:"1px solid "+D.border,marginBottom:20,marginTop:12}}/>
                {!apiKey?(
                  <div style={{textAlign:"center",padding:"28px 16px"}}>
                    <div style={{fontSize:36,marginBottom:16}}>🤖</div>
                    <div style={{fontSize:16,fontWeight:700,color:D.ink,marginBottom:8,letterSpacing:"-0.02em"}}>AIがさらに詳しく分析します</div>
                    <div style={{fontSize:14,color:D.inkLt,lineHeight:1.75,marginBottom:24}}>APIキーを設定すると、費目ごとの具体的な改善提案や将来のリスクをAIが詳しく教えてくれます。</div>
                    <Btn onClick={function(){setShowApi(true);}} style={{width:"auto",padding:"12px 28px",marginTop:0,display:"inline-block"}}>APIキーを設定する</Btn>
                  </div>
                ):(
                  <div>
                    {aiLoading?(
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"40px 0"}}>
                        <div style={{display:"flex",gap:6}}>{[0,1,2].map(function(i){return <div key={i} style={{width:8,height:8,borderRadius:"50%",background:D.accent,animation:"dp 1.2s "+(i*.2)+"s infinite ease-in-out"}}/>;})}</div>
                        <div style={{fontSize:13,color:D.inkXl}}>AIが家計データを分析しています…</div>
                      </div>
                    ):aiText?(
                      <div style={{fontSize:14,lineHeight:1.85,color:D.inkMd,whiteSpace:"pre-wrap"}}>{aiText}</div>
                    ):(
                      <div style={{textAlign:"center",padding:"20px 0"}}>
                        <Btn onClick={runAI} style={{width:"auto",padding:"12px 28px",marginTop:0,display:"inline-block"}}>AIで詳細診断を実行する</Btn>
                      </div>
                    )}
                    {aiText&&(
                      <div style={{display:"flex",gap:10,marginTop:20}}>
                        <GhostBtn onClick={function(){setShowApi(true);}}>APIキーを変更</GhostBtn>
                        <Btn onClick={runAI} disabled={aiLoading} style={{flex:1,marginTop:0}}>再診断</Btn>
                      </div>
                    )}
                    <Disc text="AIアドバイスは参考情報です。実際の借入判断は専門家にご相談ください。"/>
                  </div>
                )}
              </Card>
              <div style={{display:"flex",gap:10}}>
                <GhostBtn onClick={function(){setStep(2);}}>← 生活費を修正</GhostBtn>
                <GhostBtn onClick={function(){setStep(1);setExp(function(){var d={};EXP_ITEMS.forEach(function(it){d[it.key]="";});return d;});setAiText("");}}>最初からやり直す</GhostBtn>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── 3. 変動 vs 固定 ───────────────────────────────────────────────────────────
function RatePanel() {
  var s1=useState({loan:3500,term:35,varRate:0.5,fixRate:1.8,changeYear:5,varAfter:2.0});
  var f=s1[0],setF=s1[1];
  var s2=useState(null); var res=s2[0],setRes=s2[1];
  function upd(k,v){setF(function(p){var o=Object.assign({},p);o[k]=v;return o;});}
  function run(){
    var loan=f.loan,term=f.term,varRate=f.varRate,fixRate=f.fixRate,changeYear=f.changeYear,varAfter=f.varAfter;
    var fixM=calcMonthly(loan,fixRate,term),fixTotal=fixM*term*12/10000,fixInterest=fixTotal-loan;
    var varBalance=loan*10000,varInterest=0,phase1=changeYear*12;
    for(var m=1;m<=term*12;m++){
      var r=(m<=phase1?varRate:varAfter)/1200,remMo=term*12-m+1;
      var pmt=r===0?varBalance/remMo:varBalance*r*Math.pow(1+r,remMo)/(Math.pow(1+r,remMo)-1);
      var interest=varBalance*r; varInterest+=interest; varBalance=Math.max(0,varBalance-(pmt-interest));
    }
    var varTotalInterest=varInterest/10000,varTotal=loan+varTotalInterest,diff=fixTotal-varTotal;
    var chartData=[];
    for(var yr=0;yr<=term;yr+=5){
      var mo=yr*12,fixBal=calcBalance(loan,fixRate,term,mo),vb=loan*10000;
      for(var mm=1;mm<=mo;mm++){
        var rr=(mm<=phase1?varRate:varAfter)/1200,rm=term*12-mm+1;
        var pp=rr===0?vb/rm:vb*rr*Math.pow(1+rr,rm)/(Math.pow(1+rr,rm)-1);
        var ii=vb*rr; vb=Math.max(0,vb-(pp-ii));
      }
      chartData.push({yr:yr,fix:Math.max(0,Math.round(fixBal/10000)),varV:Math.round(vb/10000)});
    }
    setRes({fixM:fixM,fixTotal:fixTotal,fixInterest:fixInterest,varTotalInterest:varTotalInterest,varTotal:varTotal,diff:diff,chartData:chartData});
  }
  return(
    <div style={{display:"grid",gridTemplateColumns:"400px 1fr",gap:20,alignItems:"start"}}>
      <Card>
        <SectionLabel>条件を設定する</SectionLabel>
        <FR label="借入額（万円）"><Inp value={f.loan} onChange={function(e){upd("loan",parseFloat(e.target.value)||0);}}/></FR>
        <FR label="返済期間（年）"><Inp value={f.term} onChange={function(e){upd("term",parseInt(e.target.value)||35);}} max={35}/></FR>
        <div style={{borderTop:"1px solid "+D.border,paddingTop:20,marginTop:4,marginBottom:4}}>
          <div style={{fontSize:12,fontWeight:600,color:D.inkLt,marginBottom:18,letterSpacing:"0.04em",textTransform:"uppercase"}}>変動金利</div>
          <SliderField label="当初の変動金利" min={0.1} max={3} step={0.1} value={f.varRate} onChange={function(v){upd("varRate",v);}} display={f.varRate+"%"}/>
          <SliderField label="金利が上がるまでの年数" min={1} max={30} step={1} value={f.changeYear} onChange={function(v){upd("changeYear",v);}} display={f.changeYear+"年後"}/>
          <SliderField label="上昇後の金利" min={0.1} max={5} step={0.1} value={f.varAfter} onChange={function(v){upd("varAfter",v);}} display={f.varAfter+"%"}/>
        </div>
        <div style={{borderTop:"1px solid "+D.border,paddingTop:20,marginTop:4}}>
          <div style={{fontSize:12,fontWeight:600,color:D.inkLt,marginBottom:18,letterSpacing:"0.04em",textTransform:"uppercase"}}>固定金利</div>
          <SliderField label="全期間固定金利" min={0.5} max={4} step={0.1} value={f.fixRate} onChange={function(v){upd("fixRate",v);}} display={f.fixRate+"%"}/>
        </div>
        <Btn onClick={run} mt={8}>比較シミュレーションを実行する</Btn>
      </Card>
      <div>
        {!res?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:280,background:D.bg,borderRadius:D.r,border:"1px solid "+D.border}}>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:D.inkXl}}>左でスライダーを動かして実行してください</div>
          </div>
        ):(
          <div className="ani">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              {[{label:"変動（"+f.varRate+"%→"+f.varAfter+"%）",m:Math.round(calcMonthly(f.loan,f.varRate,f.term)/1000),total:R(res.varTotal,0),interest:R(res.varTotalInterest,0),color:D.accent},{label:"固定（"+f.fixRate+"%）",m:Math.round(res.fixM/1000),total:R(res.fixTotal,0),interest:R(res.fixInterest,0),color:D.ink}].map(function(d){
                return(
                  <div key={d.label} style={{background:D.bg,border:"1px solid "+D.border,borderRadius:D.r,padding:"24px 26px"}}>
                    <div style={{fontSize:11,fontWeight:600,color:d.color,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:20}}>{d.label}</div>
                    <div style={{marginBottom:16}}><div style={{fontSize:11,color:D.inkXl,marginBottom:4}}>当初月返済額</div><div style={{fontSize:28,fontWeight:700,color:D.ink,letterSpacing:"-0.03em"}}>{d.m}千円</div></div>
                    <div style={{marginBottom:10}}><div style={{fontSize:11,color:D.inkXl,marginBottom:4}}>総返済額</div><div style={{fontSize:20,fontWeight:700,color:D.ink,letterSpacing:"-0.02em"}}>{d.total.toLocaleString()}万円</div></div>
                    <div><div style={{fontSize:11,color:D.inkXl,marginBottom:4}}>うち利息</div><div style={{fontSize:16,fontWeight:600,color:D.inkMd}}>{d.interest.toLocaleString()}万円</div></div>
                  </div>
                );
              })}
            </div>
            <Card>
              <div style={{padding:"20px 22px",background:res.diff>0?D.emeraldBg:D.roseBg,borderRadius:D.rSm,marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:600,color:res.diff>0?D.emerald:D.rose,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>{res.diff>0?"変動の方が総支払いが少ない":"変動の方が総支払いが多い"}（このシナリオの場合）</div>
                <div style={{fontSize:32,fontWeight:700,color:D.ink,letterSpacing:"-0.04em"}}>{Math.abs(R(res.diff,0)).toLocaleString()}<span style={{fontSize:15,fontWeight:400,color:D.inkLt,marginLeft:6}}>万円の差</span></div>
              </div>
              <SectionLabel>年別残債の推移</SectionLabel>
              {res.chartData.map(function(d){
                return(
                  <div key={d.yr} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:D.inkLt,marginBottom:6}}><span>{d.yr}年後</span><span>変動 {d.varV.toLocaleString()}万 / 固定 {d.fix.toLocaleString()}万</span></div>
                    <div style={{height:6,background:D.canvas,borderRadius:3,overflow:"hidden",display:"flex",flexDirection:"column",gap:2}}>
                      <div style={{height:"47%",background:D.accent,width:Math.min(100,d.varV/f.loan*100)+"%",borderRadius:2}}/>
                      <div style={{height:"47%",background:D.ink,width:Math.min(100,d.fix/f.loan*100)+"%",borderRadius:2}}/>
                    </div>
                  </div>
                );
              })}
              <div style={{display:"flex",gap:16,fontSize:11,color:D.inkLt,marginTop:8}}>
                <span><span style={{color:D.accent}}>●</span> 変動</span>
                <span><span style={{color:D.ink}}>●</span> 固定</span>
              </div>
              <Tip icon="" title="選び方のポイント" text="変動：低金利時は月々の負担が軽い。金利上昇リスクあり。繰り上げ返済を積極的に行える人向け。固定：返済額が変わらず将来の計画を立てやすい。金利が低い時期に固定すると長期的にお得になることも。"/>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 4. 繰り上げ返済 ───────────────────────────────────────────────────────────
function PrepayPanel() {
  var s1=useState({loan:3500,term:35,rate:0.5,extraM:3,lump:100,lumpYear:5}); var f=s1[0],setF=s1[1];
  var s2=useState("extra"); var mode=s2[0],setMode=s2[1];
  function upd(k,v){setF(function(p){var o=Object.assign({},p);o[k]=v;return o;});}
  function calcPrepay(extraM,lumpSums){
    var r=f.rate/1200,balance=f.loan*10000,month=0,totalInterest=0,normalPmt=calcMonthly(f.loan,f.rate,f.term);
    while(balance>0&&month<f.term*12){
      month++;
      if(lumpSums){for(var i=0;i<lumpSums.length;i++){if(lumpSums[i].month===month){balance=Math.max(0,balance-lumpSums[i].amount*10000);break;}}}
      if(balance<=0)break;
      var interest=balance*r; totalInterest+=interest;
      balance=Math.max(0,balance+interest-Math.min(normalPmt+extraM*10000,balance+interest));
    }
    return{months:month,totalInterest:totalInterest/10000};
  }
  var base=calcPrepay(0,[]);
  var withP=mode==="extra"?calcPrepay(f.extraM,[]):calcPrepay(0,[{month:f.lumpYear*12,amount:f.lump}]);
  var savedMonths=base.months-withP.months,savedYears=Math.floor(savedMonths/12),savedMo=savedMonths%12;
  var savedInterest=base.totalInterest-withP.totalInterest;
  return(
    <div style={{display:"grid",gridTemplateColumns:"400px 1fr",gap:20,alignItems:"start"}}>
      <Card>
        <SectionLabel>条件を設定する</SectionLabel>
        <FR label="借入額（万円）"><Inp value={f.loan} onChange={function(e){upd("loan",parseFloat(e.target.value)||0);}}/></FR>
        <FR label="返済期間（年）"><Inp value={f.term} onChange={function(e){upd("term",parseInt(e.target.value)||35);}} max={35}/></FR>
        <SliderField label="金利（%）" min={0.1} max={4} step={0.1} value={f.rate} onChange={function(v){upd("rate",v);}} display={f.rate+"%"}/>
        <ToggleGroup value={mode} onChange={setMode} options={[["extra","毎月積み増し型"],["lump","ボーナス一括型"]]}/>
        {mode==="extra"?(
          <SliderField label="月々の追加返済額" min={0.5} max={20} step={0.5} value={f.extraM} onChange={function(v){upd("extraM",v);}} display={f.extraM+"万円/月"}/>
        ):(
          <div>
            <SliderField label="一括返済の金額" min={10} max={500} step={10} value={f.lump} onChange={function(v){upd("lump",v);}} display={f.lump+"万円"}/>
            <SliderField label="返済するタイミング" min={1} max={f.term-1} step={1} value={f.lumpYear} onChange={function(v){upd("lumpYear",v);}} display={f.lumpYear+"年後"}/>
          </div>
        )}
      </Card>
      <div className="ani">
        <div style={{background:savedInterest>0?D.emeraldBg:D.canvas,borderRadius:D.r,padding:"28px 32px",marginBottom:16,border:"1px solid "+(savedInterest>0?D.emerald+"40":D.border)}}>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:savedInterest>0?D.emerald:D.inkXl,marginBottom:16}}>{mode==="extra"?"毎月 "+f.extraM+"万円 の追加返済をすると…":f.lumpYear+"年後に "+f.lump+"万円 一括返済すると…"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div><div style={{fontSize:11,color:D.inkXl,marginBottom:6}}>早く完済できる</div><div style={{fontSize:32,fontWeight:700,color:D.ink,letterSpacing:"-0.04em"}}>{(savedYears>0||savedMo>0)?((savedYears>0?savedYears+"年":"")+( savedMo>0?savedMo+"ヶ月":"")):"変化なし"}</div></div>
            <div><div style={{fontSize:11,color:D.inkXl,marginBottom:6}}>利息の節約</div><div style={{fontSize:32,fontWeight:700,color:savedInterest>0?D.emerald:D.inkXl,letterSpacing:"-0.04em"}}>{savedInterest>0?R(savedInterest,0).toLocaleString()+"万円":"-"}</div></div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <BigNumber label="繰り上げ前の完済時期" value={Math.floor(base.months/12)+"年"+base.months%12+"ヶ月"} color={D.inkMd}/>
          <BigNumber label="繰り上げ後の完済時期" value={Math.floor(withP.months/12)+"年"+withP.months%12+"ヶ月"} color={D.ink}/>
        </div>
        <Card>
          <SectionLabel>総利息の比較</SectionLabel>
          {[{l:"繰り上げなし",v:base.totalInterest,c:D.rose},{l:"繰り上げあり",v:withP.totalInterest,c:D.emerald}].map(function(d){
            return(
              <div key={d.l} style={{marginBottom:16}}>
                <BarChart label={d.l} valueLabel={R(d.v,0)+"万円"} value={d.v} max={base.totalInterest} color={d.c}/>
              </div>
            );
          })}
          <Tip icon="" title="繰り上げ返済のコツ" text="「期間短縮型」（完済を早める）と「返済額軽減型」（月々を減らす）があります。利息の節約効果が大きいのは期間短縮型。変動金利の方は金利上昇に備えて元本を減らしておくのが効果的です。"/>
        </Card>
      </div>
    </div>
  );
}

// ── 5. 諸費用計算 ─────────────────────────────────────────────────────────────
function CostPanel() {
  var s1=useState({price:4000,loan:3500,type:"new"}); var f=s1[0],setF=s1[1];
  function upd(k,v){setF(function(p){var o=Object.assign({},p);o[k]=v;return o;});}
  var price=f.price,loan=f.loan,isNew=f.type==="new";
  var broker=isNew?0:R((price*30000/1000)*1.03/10,1);
  var registration=R(loan*0.004,1),ownerReg=isNew?R(price*0.0015,1):R(price*0.003,1);
  var acquisition=isNew?0:R(price*0.03,1),guarantee=R(loan*0.002,1);
  var fire=isNew?25:20,judicial=R(loan*0.0003+price*0.0003+8,1),stamp=loan>=5000?6:loan>=1000?2:1;
  var moving=10,other=10;
  var total=R(broker+registration+ownerReg+acquisition+guarantee+fire+judicial+stamp+moving+other,0);
  var items=[
    {l:"仲介手数料",v:broker,n:"新築は不要",show:true},{l:"登録免許税（抵当権設定）",v:registration,n:"借入額×0.4%",show:true},
    {l:"登録免許税（所有権"+(isNew?"保存":"移転")+"）",v:ownerReg,n:isNew?"建物評価×0.15%":"評価×0.2〜0.3%",show:true},
    {l:"不動産取得税",v:acquisition,n:"評価×3%（中古）",show:!isNew},
    {l:"ローン保証料",v:guarantee,n:"借入額×0.2%前後",show:true},{l:"火災保険・地震保険",v:fire,n:"構造・地域・補償による",show:true},
    {l:"司法書士費用",v:judicial,n:"登記手続きの報酬（目安）",show:true},{l:"印紙税",v:stamp,n:"ローン・売買契約書に貼付",show:true},
    {l:"引越し費用",v:moving,n:"時期・距離・荷物量による",show:true},{l:"雑費（水道加入・鍵交換等）",v:other,n:"",show:true},
  ].filter(function(i){return i.show;});
  return(
    <div style={{display:"grid",gridTemplateColumns:"400px 1fr",gap:20,alignItems:"start"}}>
      <Card><SectionLabel>物件・借入情報</SectionLabel>
        <FR label="物件価格（万円）"><Inp value={f.price} onChange={function(e){upd("price",parseFloat(e.target.value)||0);}}/></FR>
        <FR label="借入額（万円）"><Inp value={f.loan} onChange={function(e){upd("loan",parseFloat(e.target.value)||0);}}/></FR>
        <FR label="物件の種類"><Sel value={f.type} onChange={function(e){upd("type",e.target.value);}}>
          <option value="new">新築（マンション・戸建て）</option><option value="used">中古（マンション・戸建て）</option>
        </Sel></FR>
        <div style={{background:D.roseBg,borderRadius:D.r,padding:"20px 24px",marginTop:8,border:"1px solid "+D.rose+"30"}}>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:D.rose,marginBottom:8}}>諸費用の合計目安</div>
          <div style={{fontSize:40,fontWeight:700,color:D.ink,letterSpacing:"-0.04em"}}>{total.toLocaleString()}<span style={{fontSize:16,fontWeight:400,color:D.inkLt,marginLeft:6}}>万円</span></div>
          <div style={{fontSize:13,color:D.inkLt,marginTop:8}}>頭金とは別に現金で準備が必要です</div>
        </div>
      </Card>
      <Card><SectionLabel>諸費用の内訳</SectionLabel>
        {items.map(function(item){
          return(
            <div key={item.l} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"14px 0",borderBottom:"1px solid "+D.border}}>
              <div><div style={{fontSize:14,fontWeight:500,color:D.inkMd}}>{item.l}</div>{item.n&&<div style={{fontSize:11,color:D.inkXl,marginTop:3}}>{item.n}</div>}</div>
              <div style={{fontSize:16,fontWeight:700,color:item.v>0?D.ink:D.inkXl,flexShrink:0,marginLeft:16,letterSpacing:"-0.02em"}}>{item.v>0?item.v+"万円":"—"}</div>
            </div>
          );
        })}
        <Disc text="上記はあくまで目安です。金融機関・物件・エリアにより大きく異なります。必ず不動産会社・銀行にご確認ください。"/>
      </Card>
    </div>
  );
}

// ── 6. 将来リスク ─────────────────────────────────────────────────────────────
function FuturePanel() {
  var s0=useState("rateShock"); var mode=s0[0],setMode=s0[1];
  var s1=useState({loan:3500,term:35,currentRate:0.5,shockRate:3.0,shockYear:10}); var rf=s1[0],setRf=s1[1];
  var s2=useState({income:500,age:35,loan:3500,term:35,rate:0.5,retireAge:65,retireSaving:500,monthSave:5}); var retF=s2[0],setRetF=s2[1];
  var s3=useState({income:500,loan:3500,term:35,rate:0.5,dropYear:3,dropIncome:300,hasBaby:"true"}); var dropF=s3[0],setDropF=s3[1];
  function updRf(k,v){setRf(function(p){var o=Object.assign({},p);o[k]=v;return o;});}
  function updRet(k,v){setRetF(function(p){var o=Object.assign({},p);o[k]=v;return o;});}
  function updDrop(k,v){setDropF(function(p){var o=Object.assign({},p);o[k]=v;return o;});}
  var normalM=calcMonthly(rf.loan,rf.currentRate,rf.term);
  var balAtShock=calcBalance(rf.loan,rf.currentRate,rf.term,rf.shockYear*12);
  var newTermM=rf.term*12-rf.shockYear*12;
  var shockMNew=newTermM>0?(rf.shockRate/1200>0?balAtShock*(rf.shockRate/1200)*Math.pow(1+rf.shockRate/1200,newTermM)/(Math.pow(1+rf.shockRate/1200,newTermM)-1):balAtShock/newTermM):0;
  var diffMNew=shockMNew-normalM;
  var retireYears=retF.retireAge-retF.age,loanAtRetire=calcBalance(retF.loan,retF.rate,retF.term,retireYears*12);
  var savingAtRetire=retF.retireSaving+retF.monthSave*retireYears*12,surplus=savingAtRetire-loanAtRetire/10000;
  var dropM=calcMonthly(dropF.loan,dropF.rate,dropF.term)/10000,dropTH=R(calcTakeHome(dropF.dropIncome)/12),remDrop=R(dropTH-dropM);
  var modeOptions=[["rateShock","金利上昇ショック"],["retire","老後資金との両立"],["incomeDrop","収入減少シミュレーション"]];
  return(
    <div>
      <ToggleGroup value={mode} onChange={setMode} options={modeOptions}/>
      {mode==="rateShock"&&(
        <div className="ani" style={{display:"grid",gridTemplateColumns:"400px 1fr",gap:20}}>
          <Card><SectionLabel>金利上昇ショック診断</SectionLabel>
            <FR label="借入額（万円）"><Inp value={rf.loan} onChange={function(e){updRf("loan",parseFloat(e.target.value)||0);}}/></FR>
            <FR label="返済期間（年）"><Inp value={rf.term} onChange={function(e){updRf("term",parseInt(e.target.value)||35);}} max={35}/></FR>
            <SliderField label="現在の変動金利" min={0.1} max={3} step={0.1} value={rf.currentRate} onChange={function(v){updRf("currentRate",v);}} display={rf.currentRate+"%"}/>
            <SliderField label="上昇後の金利" min={0.5} max={6} step={0.1} value={rf.shockRate} onChange={function(v){updRf("shockRate",v);}} display={rf.shockRate+"%"}/>
            <SliderField label="金利が上昇するタイミング" min={1} max={rf.term-1} step={1} value={rf.shockYear} onChange={function(v){updRf("shockYear",v);}} display={rf.shockYear+"年後"}/>
          </Card>
          <div>
            <div style={{background:diffMNew>50000?D.roseBg:diffMNew>20000?D.amberBg:D.emeraldBg,borderRadius:D.r,padding:"28px 32px",marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:diffMNew>50000?D.rose:diffMNew>20000?D.amber:D.emerald,marginBottom:16}}>シミュレーション結果</div>
              <div style={{fontSize:13,color:D.inkMd,lineHeight:1.75}}>{"金利が"+rf.currentRate+"%から"+rf.shockRate+"%に上昇した場合、"+rf.shockYear+"年後以降の月返済額は毎月約"+Math.round(diffMNew/1000)+"千円増加します。年間では約"+Math.round(diffMNew*12/10000)+"万円の負担増です。"}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <BigNumber label="現在の月返済額" value={Math.round(normalM/1000)+"千円"} sub={"金利"+rf.currentRate+"%"} color={D.ink}/>
              <BigNumber label="上昇後の月返済額" value={Math.round(shockMNew/1000)+"千円"} sub={"金利"+rf.shockRate+"%（"+rf.shockYear+"年後から）"} color={D.rose}/>
              <BigNumber label="月々の増加額" value={"+"+Math.round(diffMNew/1000)+"千円"} sub="毎月の負担増" color={diffMNew>30000?D.rose:D.amber}/>
              <BigNumber label={rf.shockYear+"年後の残債"} value={Math.round(balAtShock/10000).toLocaleString()+"万円"} sub="この残債に高金利が適用される" color={D.inkMd}/>
            </div>
            <Tip icon="" title="対策のポイント" text="①繰り上げ返済で元本を減らしておく　②固定金利への切り替えを検討する　③変動金利が上昇しても払える返済額かを今のうちに確認しておく"/>
          </div>
        </div>
      )}
      {mode==="retire"&&(
        <div className="ani" style={{display:"grid",gridTemplateColumns:"400px 1fr",gap:20}}>
          <Card><SectionLabel>老後資金との両立計算</SectionLabel>
            <FR label="年収（万円）"><Inp value={retF.income} onChange={function(e){updRet("income",parseFloat(e.target.value)||0);}}/></FR>
            <FR label="現在の年齢"><Inp value={retF.age} onChange={function(e){updRet("age",parseInt(e.target.value)||35);}}/></FR>
            <FR label="借入額（万円）"><Inp value={retF.loan} onChange={function(e){updRet("loan",parseFloat(e.target.value)||0);}}/></FR>
            <FR label="返済期間（年）"><Inp value={retF.term} onChange={function(e){updRet("term",parseInt(e.target.value)||35);}} max={35}/></FR>
            <FR label="金利（%）"><Inp value={retF.rate} onChange={function(e){updRet("rate",parseFloat(e.target.value)||0.5);}} step={0.1}/></FR>
            <SliderField label="想定退職年齢" min={55} max={70} step={1} value={retF.retireAge} onChange={function(v){updRet("retireAge",v);}} display={retF.retireAge+"歳"}/>
            <FR label="現在の貯蓄残高（万円）"><Inp value={retF.retireSaving} onChange={function(e){updRet("retireSaving",parseFloat(e.target.value)||0);}}/></FR>
            <SliderField label="月々の貯蓄額" min={0} max={30} step={0.5} value={retF.monthSave} onChange={function(v){updRet("monthSave",v);}} display={retF.monthSave+"万円/月"}/>
          </Card>
          <div>
            <div style={{background:surplus>=500?D.emeraldBg:surplus>=0?D.amberBg:D.roseBg,borderRadius:D.r,padding:"28px 32px",marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:surplus>=500?D.emerald:surplus>=0?D.amber:D.rose,marginBottom:16}}>{retF.retireAge+"歳時点の診断"}</div>
              <div style={{fontSize:13,color:D.inkMd,lineHeight:1.75}}>{retF.retireAge+"歳時点で残債約"+Math.round(loanAtRetire/10000).toLocaleString()+"万円に対し、貯蓄は約"+Math.round(savingAtRetire).toLocaleString()+"万円の見込みです。"+(surplus<0?"約"+Math.round(Math.abs(surplus)).toLocaleString()+"万円不足するため、月々の貯蓄額の増加か、借入額の見直しを検討してください。":"差引で約"+Math.round(surplus).toLocaleString()+"万円の余裕があります。")}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <BigNumber label={retF.retireAge+"歳時点の残債"} value={Math.round(loanAtRetire/10000).toLocaleString()+"万円"} color={loanAtRetire>0?D.rose:D.emerald}/>
              <BigNumber label={retF.retireAge+"歳時点の貯蓄"} value={Math.round(savingAtRetire).toLocaleString()+"万円"} color={D.ink}/>
              <BigNumber label="余剰/不足" value={(surplus>=0?"+":"")+Math.round(surplus).toLocaleString()+"万円"} color={surplus>=0?D.emerald:D.rose}/>
              <BigNumber label="月返済額（概算）" value={Math.round(calcMonthly(retF.loan,retF.rate,retF.term)/1000)+"千円"} color={D.inkMd}/>
            </div>
            <Tip icon="" title="老後資金の目安" text="夫婦2人の老後（65〜90歳）に必要な生活費は総額5,000〜8,000万円とされています。公的年金との差額を貯蓄・退職金で補う計画が重要です。"/>
          </div>
        </div>
      )}
      {mode==="incomeDrop"&&(
        <div className="ani" style={{display:"grid",gridTemplateColumns:"400px 1fr",gap:20}}>
          <Card><SectionLabel>収入減少シミュレーション</SectionLabel>
            <FR label="現在の年収（万円）"><Inp value={dropF.income} onChange={function(e){updDrop("income",parseFloat(e.target.value)||0);}}/></FR>
            <FR label="借入額（万円）"><Inp value={dropF.loan} onChange={function(e){updDrop("loan",parseFloat(e.target.value)||0);}}/></FR>
            <FR label="返済期間（年）"><Inp value={dropF.term} onChange={function(e){updDrop("term",parseInt(e.target.value)||35);}} max={35}/></FR>
            <SliderField label="金利（%）" min={0.1} max={4} step={0.1} value={dropF.rate} onChange={function(v){updDrop("rate",v);}} display={dropF.rate+"%"}/>
            <div style={{borderTop:"1px solid "+D.border,paddingTop:20,marginTop:4}}>
              <div style={{fontSize:12,fontWeight:600,color:D.inkLt,marginBottom:16,letterSpacing:"0.04em",textTransform:"uppercase"}}>収入が減った場合を想定</div>
              <FR label="収入減の期間"><Sel value={dropF.dropYear} onChange={function(e){updDrop("dropYear",parseInt(e.target.value));}}>
                <option value={1}>1年間（育休など）</option><option value={2}>2年間</option><option value={3}>3年間（転職・療養など）</option><option value={5}>5年間</option>
              </Sel></FR>
              <FR label="その間の年収（万円）"><Inp value={dropF.dropIncome} onChange={function(e){updDrop("dropIncome",parseFloat(e.target.value)||0);}}/></FR>
              <FR label="育休・産休の予定"><Sel value={dropF.hasBaby} onChange={function(e){updDrop("hasBaby",e.target.value);}}>
                <option value="true">あり（配偶者含む）</option><option value="false">なし</option>
              </Sel></FR>
            </div>
          </Card>
          <div>
            <div style={{background:remDrop>=5?D.emeraldBg:remDrop>=0?D.amberBg:D.roseBg,borderRadius:D.r,padding:"28px 32px",marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:remDrop>=5?D.emerald:remDrop>=0?D.amber:D.rose,marginBottom:16}}>収入減少時の診断</div>
              <div style={{fontSize:13,color:D.inkMd,lineHeight:1.75}}>{"年収が"+dropF.dropIncome+"万円に下がった場合、月々の手取りは約"+dropTH+"万円となり、ローン返済後の残額は"+remDrop+"万円/月になります。"}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              <BigNumber label="通常時の月返済額" value={Math.round(calcMonthly(dropF.loan,dropF.rate,dropF.term)/1000)+"千円"} color={D.ink}/>
              <BigNumber label="収入減時の手取り月収" value={dropTH+"万円"} color={D.inkMd}/>
              <BigNumber label="収入減時の残額" value={remDrop+"万円/月"} color={remDrop>=5?D.emerald:remDrop>=0?D.amber:D.rose}/>
              <BigNumber label="返済比率（収入減時）" value={R(dropM*12/dropF.dropIncome*100)+"%"} color={dropM*12/dropF.dropIncome*100>40?D.rose:D.amber}/>
            </div>
            {dropF.hasBaby!=="false"&&(
              <div style={{background:D.violetBg,borderRadius:D.r,padding:"18px 22px",border:"1px solid "+D.violet+"30",marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase",color:D.violet,marginBottom:8}}>育休・産休の場合の注意点</div>
                <div style={{fontSize:13,color:D.inkMd,lineHeight:1.75}}>育児休業給付金は通常賃金の約67%（180日目以降50%）です。社会保険料は免除されますが、住民税は引き続き支払いが必要です。育休前に半年分以上の生活資金を確保しておくことをおすすめします。</div>
              </div>
            )}
            <Tip icon="" title="備えのポイント" text="①生活費3〜6ヶ月分の緊急資金を別途確保する　②収入保障保険への加入を検討する　③繰り上げ返済より緊急資金の確保を優先する"/>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 7. 必要書類 ───────────────────────────────────────────────────────────────
var DOCS={
  emp:{label:"会社員",cats:[
    {name:"本人確認",items:["運転免許証またはマイナンバーカード（両面コピー）","住民票（発行3ヶ月以内・家族全員記載）","印鑑証明書（発行3ヶ月以内）"]},
    {name:"収入証明",items:["源泉徴収票（直近2年分）","給与明細（直近3ヶ月分）","健康保険証（勤務先・資格取得日確認用）"]},
    {name:"物件関係",items:["売買契約書（写し）","重要事項説明書（写し）","建物の登記事項証明書","建築確認済証・検査済証"]},
    {name:"その他",items:["ローン申込書（金融機関所定書式）","団体信用生命保険申込書・告知書","他社借入の返済明細書（ある場合）"]},
  ]},
  self:{label:"個人事業主",cats:[
    {name:"本人確認",items:["運転免許証またはマイナンバーカード（両面コピー）","住民票（発行3ヶ月以内）","印鑑証明書（発行3ヶ月以内）"]},
    {name:"収入証明（重要）",items:["確定申告書3期分（第一表・第二表）","青色申告決算書（損益計算書・貸借対照表）または収支内訳書","納税証明書（その1・その2）（発行3ヶ月以内）","国民健康保険料の納付確認書類"]},
    {name:"事業確認",items:["開業届のコピー（税務署受付印あり）","事業の実態がわかる資料（契約書・請求書等）"]},
    {name:"物件・その他",items:["売買契約書（写し）","重要事項説明書（写し）","建物の登記事項証明書","ローン申込書・団信申込書"]},
  ]},
  corp:{label:"法人代表者",cats:[
    {name:"本人確認",items:["運転免許証またはマイナンバーカード（両面コピー）","住民票（発行3ヶ月以内）","印鑑証明書（発行3ヶ月以内、個人・法人両方）"]},
    {name:"個人収入証明",items:["確定申告書3期分（役員報酬の源泉徴収票も含む）","納税証明書（その1・その2）"]},
    {name:"法人財務書類（重要）",items:["法人決算書3期分（貸借対照表・損益計算書）","法人税申告書（別表一・別表四）3期分","法人の借入金一覧・返済明細","法人の登記事項証明書（発行3ヶ月以内）"]},
    {name:"物件・その他",items:["売買契約書（写し）","重要事項説明書（写し）","建物の登記事項証明書","ローン申込書・団信申込書"]},
  ]},
};
function DocsPanel(){
  var s1=useState("emp"); var type=s1[0],setType=s1[1];
  var s2=useState({}); var checked=s2[0],setChecked=s2[1];
  var data=DOCS[type],allKeys=[];
  data.cats.forEach(function(c,ci){c.items.forEach(function(item,ii){allKeys.push(type+"-"+ci+"-"+ii);});});
  var done=allKeys.filter(function(k){return checked[k];}).length;
  var pct=allKeys.length>0?Math.round(done/allKeys.length*100):0;
  function toggle(k){setChecked(function(p){var o=Object.assign({},p);o[k]=!o[k];return o;});}
  function reset(){setChecked(function(p){var n=Object.assign({},p);allKeys.forEach(function(k){delete n[k];});return n;});}
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:28,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:0,background:D.canvas,borderRadius:D.rSm,border:"1px solid "+D.border,padding:3}}>
          {Object.keys(DOCS).map(function(k){
            var active=type===k;
            return <button key={k} onClick={function(){setType(k);}} style={{padding:"9px 18px",border:"none",borderRadius:8,background:active?D.bg:"transparent",color:active?D.ink:D.inkLt,fontSize:13,fontWeight:active?600:400,cursor:"pointer",fontFamily:"inherit",boxShadow:active?"0 1px 3px rgba(0,0,0,.1)":"none"}}>{DOCS[k].label}</button>;
          })}
        </div>
        <div style={{flex:1,minWidth:140,height:2,background:D.canvas,borderRadius:1,overflow:"hidden"}}>
          <div style={{width:pct+"%",height:"100%",background:D.accent,borderRadius:1,transition:"width .3s"}}/>
        </div>
        <span style={{fontSize:12,color:D.inkXl}}>{done}/{allKeys.length} ({pct}%)</span>
        <button onClick={reset} style={{fontSize:12,color:D.inkXl,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"}}>リセット</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {data.cats.map(function(cat,ci){
          return(
            <Card key={ci}>
              <SectionLabel>{cat.name}</SectionLabel>
              {cat.items.map(function(item,ii){
                var k=type+"-"+ci+"-"+ii;
                return(
                  <div key={ii} onClick={function(){toggle(k);}} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"12px 0",borderBottom:ii<cat.items.length-1?"1px solid "+D.border:"none",cursor:"pointer"}}>
                    <div style={{width:18,height:18,border:"1.5px solid "+(checked[k]?D.accent:D.border),borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2,background:checked[k]?D.accent:"transparent",transition:"all .15s"}}>
                      {checked[k]&&<svg width="9" height="7" viewBox="0 0 9 7"><path d="M1 3.5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div style={{fontSize:14,color:checked[k]?D.inkXl:D.inkMd,lineHeight:1.55,textDecoration:checked[k]?"line-through":"none"}}>{item}</div>
                  </div>
                );
              })}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── 8. ペアローン ─────────────────────────────────────────────────────────────
function PairPanel(){
  var s1=useState(500); var income1=s1[0],setI1=s1[1];
  var s2=useState(400); var income2=s2[0],setI2=s2[1];
  var s3=useState(5000); var loan=s3[0],setLoan=s3[1];
  var s4=useState(35); var term=s4[0],setTerm=s4[1];
  var s5=useState(0.5); var rate=s5[0],setRate=s5[1];
  var loanM=calcMonthly(loan,rate,term);
  var ratio1=income1>0?(loanM/2*12/10000/income1)*100:0;
  var ratio2=income2>0?(loanM/2*12/10000/income2)*100:0;
  var ratioJoint=(income1+income2)>0?(loanM*12/10000/(income1+income2))*100:0;
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card>
          <SectionLabel>ペアローン</SectionLabel>
          {["2人がそれぞれ別々にローン契約","2本分の諸費用・手続きが発生","2人ともが団信に加入できる","それぞれの借入額で住宅ローン控除を適用"].map(function(p,i){
            return <div key={i} style={{display:"flex",gap:10,fontSize:14,color:D.inkMd,marginBottom:10}}><span style={{color:D.accent,fontWeight:700,flexShrink:0}}>✓</span><span>{p}</span></div>;
          })}
          <div style={{background:D.roseBg,borderRadius:D.rSm,padding:"12px 16px",marginTop:12,border:"1px solid "+D.rose+"30"}}>
            <div style={{fontSize:11,fontWeight:600,color:D.rose,marginBottom:6,letterSpacing:"0.04em",textTransform:"uppercase"}}>主なリスク</div>
            <div style={{fontSize:13,color:D.inkMd,lineHeight:1.65}}>離婚時に2本のローンが残り、処理が複雑。どちらかが死亡しても自分の分の返済は続く。</div>
          </div>
        </Card>
        <Card>
          <SectionLabel>収入合算（連帯債務）</SectionLabel>
          {["1本のローン契約（主債務者＋連帯債務者）","手続きが1本分でシンプル","主債務者のみ団信加入が基本（フラット35等は除く）","控除は主債務者のみが基本"].map(function(p,i){
            return <div key={i} style={{display:"flex",gap:10,fontSize:14,color:D.inkMd,marginBottom:10}}><span style={{color:D.emerald,fontWeight:700,flexShrink:0}}>✓</span><span>{p}</span></div>;
          })}
          <div style={{background:D.roseBg,borderRadius:D.rSm,padding:"12px 16px",marginTop:12,border:"1px solid "+D.rose+"30"}}>
            <div style={{fontSize:11,fontWeight:600,color:D.rose,marginBottom:6,letterSpacing:"0.04em",textTransform:"uppercase"}}>主なリスク</div>
            <div style={{fontSize:13,color:D.inkMd,lineHeight:1.65}}>連帯債務者（副収入側）は団信に入れない場合が多い。片方が亡くなっても返済義務は残る。</div>
          </div>
        </Card>
      </div>
      <Card>
        <SectionLabel>返済比率シミュレーション</SectionLabel>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:20}}>
          <FR label="申込者1の年収（万円）"><Inp value={income1} onChange={function(e){setI1(parseFloat(e.target.value)||0);}}/></FR>
          <FR label="申込者2の年収（万円）"><Inp value={income2} onChange={function(e){setI2(parseFloat(e.target.value)||0);}}/></FR>
          <FR label="借入総額（万円）"><Inp value={loan} onChange={function(e){setLoan(parseFloat(e.target.value)||0);}}/></FR>
        </div>
        <SliderField label="金利（%）" min={0.1} max={4} step={0.1} value={rate} onChange={function(v){setRate(v);}} display={rate+"%"}/>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[{label:"ペアローン（2等分）",maxR:Math.max(ratio1,ratio2),note:"申込者1: "+ratio1.toFixed(1)+"%　申込者2: "+ratio2.toFixed(1)+"%"},{label:"収入合算（合算年収で計算）",maxR:ratioJoint,note:"合算年収 "+(income1+income2)+"万円に対して "+ratioJoint.toFixed(1)+"%"}].map(function(d){
            var barColor=d.maxR>35?D.rose:d.maxR>30?D.amber:D.emerald;
            return(
              <div key={d.label} style={{padding:"16px 20px",background:D.canvas,borderRadius:D.r}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <span style={{fontSize:13,fontWeight:500,color:D.ink}}>{d.label}</span>
                  <span style={{fontSize:14,fontWeight:700,color:barColor,letterSpacing:"-0.02em"}}>{d.note}</span>
                </div>
                <div style={{height:4,background:D.border,borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:Math.min(100,d.maxR/50*100)+"%",background:barColor,borderRadius:2,transition:"width .4s"}}/>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── 9. 用語集 ─────────────────────────────────────────────────────────────────
var WORDS=[
  {w:"返済比率",r:"へんさいひりつ",cat:"審査",exp:"年収に対する年間返済額の割合。「年間返済額÷年収×100」で計算。金融機関によって異なるが一般的に年収400万円未満で30%以内、400万円以上で35%以内が目安。他社借入の返済も含めて計算する。"},
  {w:"団体信用生命保険（団信）",r:"だんしん",cat:"保険",exp:"住宅ローン契約者が死亡または高度障害状態になった場合に、ローン残高を肩代わりしてくれる保険。多くの銀行系ローンでは加入が必須。フラット35では任意加入。持病がある場合は引受不可になる場合も。「ワイド団信」は加入条件が緩和された商品。"},
  {w:"LTV（融資比率）",r:"エルティーブイ",cat:"審査",exp:"Loan to Valueの略。「借入額÷物件価格×100」で計算。LTVが高いほど担保割れのリスクが高まるため審査上不利になる場合がある。LTV80%以下が一般的に好ましい水準とされる。"},
  {w:"フラット35",r:"フラットさんじゅうご",cat:"商品",exp:"住宅金融支援機構と金融機関が提携した全期間固定金利の住宅ローン。最長35年間金利が変わらない。自営業者・法人代表者でも直近2年の所得証明で申込可能。団信は任意加入のため、健康面で通常の団信に入れない方の選択肢にも。省エネ基準を満たす物件はフラット35Sで金利優遇あり。"},
  {w:"元利均等返済",r:"がんりきんとうへんさい",cat:"返済",exp:"毎月の返済額（元金＋利息）が一定の返済方式。返済計画が立てやすく、多くの住宅ローンで採用されている。返済当初は利息の割合が多く、徐々に元金の割合が増えていく。"},
  {w:"元金均等返済",r:"がんきんきんとうへんさい",cat:"返済",exp:"毎月の元金返済額が一定の返済方式。当初の返済額は元利均等より高いが、元金の減りが早いため総支払利息が少なくなる。返済開始時の月々の負担が大きいため利用者は少ない。"},
  {w:"保証料",r:"ほしょうりょう",cat:"費用",exp:"金融機関が保証会社に支払う費用で、借入者が負担する。延滞した場合に保証会社が代わりに返済し、後から借入者に請求される仕組み。一括前払い型（借入額の約2%）と金利上乗せ型（約0.2%上乗せ）がある。"},
  {w:"抵当権",r:"ていとうけん",cat:"法律",exp:"金融機関が住宅ローンの担保として不動産に設定する権利。返済が滞った場合、金融機関はこの権利を使って不動産を競売にかけてローン残高を回収できる。ローンを完済したら抵当権抹消登記が必要。"},
  {w:"繰り上げ返済",r:"くりあげへんさい",cat:"返済",exp:"毎月の返済額とは別に、まとまったお金を返済すること。元金が減るため将来の利息が減り、「期間短縮型」と「返済額軽減型」の2種類がある。期間短縮型の方が利息の節約効果が大きい。"},
  {w:"住宅ローン控除",r:"じゅうたくローンこうじょ",cat:"税制",exp:"年末のローン残高の0.7%を最長13年間（新築）所得税から控除できる制度。省エネ等級によって借入限度額が異なる（ZEH水準：4,500万円、省エネ基準：4,000万円、その他：2,000万円）。入居した年の翌年に確定申告が必要。"},
  {w:"仲介手数料",r:"ちゅうかいてすうりょう",cat:"費用",exp:"不動産仲介会社に支払う成功報酬。上限は「物件価格×3%＋6万円＋消費税」。新築物件を売主から直接買う場合は不要なことが多い。支払いは売買契約時と引渡し時に半額ずつが一般的。"},
  {w:"重要事項説明書",r:"じゅうようじこうせつめいしょ",cat:"手続き",exp:"宅地建物取引士が売買契約前に購入者に対して読み聞かせる書類。物件の状況・権利関係・法令上の制限・取引条件などが記載されている。事前に入手して熟読することを強くおすすめ。"},
  {w:"事前審査（仮審査）",r:"じぜんしんさ",cat:"審査",exp:"本審査前の与信確認。年収・借入額・物件などの基本情報をもとに通過可能性を事前に確認する。複数の金融機関に同時申込みして比較することが一般的。信用情報に照会履歴が残る。"},
  {w:"ローン特約",r:"ローンとくやく",cat:"契約",exp:"住宅ローンの審査に通らなかった場合に、売買契約を白紙に戻せる特約。手付金も返還される。売買契約書に必ず記載されていることを確認すること。"},
];
var CATC={審査:D.accent,保険:D.emerald,商品:D.ink,費用:D.rose,法律:D.amber,返済:D.emerald,税制:D.violet,手続き:D.gold,契約:D.amber};
function WordsPanel(){
  var s1=useState("all"); var filter=s1[0],setFilter=s1[1];
  var s2=useState(""); var search=s2[0],setSearch=s2[1];
  var cats=[]; WORDS.forEach(function(w){if(cats.indexOf(w.cat)===-1)cats.push(w.cat);});
  var filtered=WORDS.filter(function(w){
    return(filter==="all"||w.cat===filter)&&(!search||w.w.indexOf(search)!==-1||w.r.indexOf(search)!==-1||w.exp.indexOf(search)!==-1);
  });
  return(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative"}}>
          <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="用語を検索…" style={{padding:"10px 16px 10px 40px",border:"1px solid "+D.border,borderRadius:D.rSm,fontSize:14,background:D.surface,color:D.ink,width:220}}/>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:14,color:D.inkXl}}>🔍</span>
        </div>
        <button onClick={function(){setFilter("all");setSearch("");}} style={{padding:"8px 16px",border:"1px solid "+(filter==="all"&&!search?D.ink:D.border),borderRadius:D.rSm,background:filter==="all"&&!search?D.ink:"transparent",color:filter==="all"&&!search?"#fff":D.inkLt,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>すべて</button>
        {cats.map(function(c){
          return <button key={c} onClick={function(){setFilter(c);setSearch("");}} style={{padding:"8px 16px",border:"1px solid "+(filter===c?D.ink:D.border),borderRadius:D.rSm,background:filter===c?D.ink:"transparent",color:filter===c?"#fff":D.inkLt,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>{c}</button>;
        })}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {filtered.map(function(w,i){
          var cc=CATC[w.cat]||D.ink;
          return(
            <Card key={i} style={{marginBottom:0}}>
              <div style={{marginBottom:12}}>
                <span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,background:cc+"15",color:cc,letterSpacing:"0.04em",textTransform:"uppercase"}}>{w.cat}</span>
              </div>
              <div style={{fontSize:18,fontWeight:700,color:D.ink,marginBottom:2,letterSpacing:"-0.03em"}}>{w.w}</div>
              <div style={{fontSize:11,color:D.inkXl,marginBottom:14,letterSpacing:"0.01em"}}>{"（"+w.r+"）"}</div>
              <div style={{fontSize:14,color:D.inkMd,lineHeight:1.8}}>{w.exp}</div>
            </Card>
          );
        })}
        {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:60,color:D.inkXl,fontSize:14}}>{"「"+search+"」に一致する用語が見つかりませんでした"}</div>}
      </div>
    </div>
  );
}

// ── 10. 手続きの流れ ──────────────────────────────────────────────────────────
var FLOW=[
  {phase:"物件探し・検討",steps:[
    {icon:"🔍",title:"情報収集・エリア選定",dur:"〜数ヶ月",detail:"SUUMOやアットホームで物件情報を収集。希望エリアの相場を把握する。",pts:["希望条件（広さ・駅距離・予算）を書き出す","家族全員でエリア・生活環境を話し合う","学区・保育園・病院情報も合わせて確認"],caution:""},
    {icon:"💰",title:"予算・借入可能額を把握",dur:"1〜2週間",detail:"年収・生活費・将来の計画をもとに、無理なく払える借入額を把握する。",pts:["このツールで審査シミュレーション・生活費診断を活用","金融機関やFPに相談","諸費用（物件価格の5〜10%）も別途用意が必要"],caution:"借入可能額≠無理なく返せる額。生活費診断でしっかり確認を。"},
    {icon:"🏠",title:"物件見学・絞り込み",dur:"1〜3ヶ月",detail:"複数の物件を見学し、条件に合ったものに絞り込む。",pts:["同じ物件に複数回・昼夜・雨の日に行くのがおすすめ","周辺環境（スーパー・病院・保育園）も確認"],caution:""},
  ]},
  {phase:"申込・審査",steps:[
    {icon:"📋",title:"購入申込み",dur:"1〜3日",detail:"気に入った物件に申込書を提出。",pts:["申込みは購入の意思表示であり契約ではない","申込金（1〜10万円）を求められる場合あり。購入しない場合は原則返金"],caution:""},
    {icon:"🏦",title:"住宅ローンの事前審査（仮審査）",dur:"3日〜1週間",detail:"金融機関に事前審査を申し込む。本審査前の与信確認。複数行への申込みが可能。",pts:["複数の金融機関に同時申込みして比較するのが一般的","必要書類：本人確認書類・収入証明書・物件資料"],caution:"信用情報に照会履歴が残るが、審査には影響しない。"},
    {icon:"📝",title:"売買契約",dur:"1〜2日",detail:"売買契約書に署名・捺印し、手付金を支払う。重要事項説明書の読み合わせが必須。",pts:["重要事項説明書は事前に入手して熟読する","手付金は通常物件価格の5〜10%","ローン特約：審査否決時に契約解除・手付金返還が可能"],caution:"契約後の解約は手付金放棄となる。ローン特約の内容を必ず確認。"},
    {icon:"✅",title:"住宅ローン本審査",dur:"1〜2週間",detail:"売買契約後、本審査を申し込む。",pts:["必要書類：印鑑証明書・住民票・物件関係書類","健康状態の告知（団信）が必要。持病がある場合は正確に告知"],caution:"事前審査を通過しても本審査で否決されることがある。"},
  ]},
  {phase:"契約・引渡し",steps:[
    {icon:"📁",title:"金銭消費貸借契約（ローン契約）",dur:"1日",detail:"金融機関と正式にローン契約を締結する。",pts:["抵当権設定書類に署名","司法書士が同席することが多い"],caution:""},
    {icon:"🔑",title:"引渡し・決済",dur:"1日",detail:"残金の支払いと鍵の引渡しが同日に行われる。",pts:["残金（物件価格 − 手付金）をローンで支払い","固定資産税の日割り精算あり"],caution:"火災保険の加入は引渡し前日までに手続きを完了させること。"},
    {icon:"📊",title:"確定申告（住宅ローン控除）",dur:"引渡しの翌年",detail:"住宅ローン控除を受けるため、入居翌年に確定申告が必要（会社員も初年度は自分で申告）。",pts:["2年目以降は年末調整で対応可能","e-Taxで自宅から申告可能"],caution:"確定申告を忘れると控除を受けられない。入居翌年の2〜3月に必ず実施。"},
  ]},
];
function FlowPanel(){
  var s1=useState(null); var openStep=s1[0],setOpenStep=s1[1];
  var stepNum=0;
  return(
    <div>
      {FLOW.map(function(phase,pi){
        return(
          <div key={pi} style={{marginBottom:40}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:D.inkXl,whiteSpace:"nowrap"}}>{phase.phase}</div>
              <div style={{flex:1,height:1,background:D.border}}/>
            </div>
            {phase.steps.map(function(step,si){
              stepNum++;
              var key=pi+"-"+si;
              var open=openStep===key;
              return(
                <div key={si} style={{marginBottom:8,border:"1px solid "+(open?D.borderMd:D.border),borderRadius:D.r,overflow:"hidden",transition:"border-color .2s",background:D.bg}}>
                  <div onClick={function(){setOpenStep(open?null:key);}} style={{display:"flex",alignItems:"center",gap:16,padding:"20px 24px",cursor:"pointer"}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:D.canvas,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{step.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:15,fontWeight:600,color:D.ink,letterSpacing:"-0.01em"}}>{step.title}</div>
                      <div style={{fontSize:11,color:D.inkXl,marginTop:3,letterSpacing:"0.01em"}}>目安期間：{step.dur}</div>
                    </div>
                    <div style={{fontSize:12,color:D.inkXl,transition:"transform .2s",transform:open?"rotate(180deg)":"none"}}>▼</div>
                  </div>
                  {open&&(
                    <div style={{padding:"0 24px 24px",borderTop:"1px solid "+D.border}}>
                      <div style={{fontSize:14,color:D.inkMd,lineHeight:1.8,paddingTop:18,marginBottom:16}}>{step.detail}</div>
                      <div style={{marginBottom:step.caution?16:0}}>
                        {step.pts.map(function(p,i){
                          return <div key={i} style={{display:"flex",gap:12,fontSize:13,color:D.inkMd,marginBottom:8,alignItems:"flex-start"}}><span style={{color:D.accent,fontWeight:700,flexShrink:0}}>✓</span><span>{p}</span></div>;
                        })}
                      </div>
                      {step.caution&&(
                        <div style={{background:D.amberBg,borderRadius:D.rSm,padding:"12px 16px",display:"flex",gap:12,alignItems:"flex-start",border:"1px solid "+D.amber+"30"}}>
                          <span style={{fontSize:14,flexShrink:0}}>⚠️</span>
                          <div style={{fontSize:13,color:D.inkMd,lineHeight:1.65}}>{step.caution}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── アプリ本体 ────────────────────────────────────────────────────────────────
var TABS=[
  {id:"sim",    label:"審査"},
  {id:"life",   label:"生活費診断"},
  {id:"rate",   label:"変動 vs 固定"},
  {id:"prepay", label:"繰り上げ返済"},
  {id:"cost",   label:"諸費用"},
  {id:"future", label:"将来リスク"},
  {id:"docs",   label:"必要書類"},
  {id:"pair",   label:"ペアローン"},
  {id:"words",  label:"用語集"},
  {id:"flow",   label:"手続きの流れ"},
];
var TAB_LABELS={
  sim:"審査シミュレーション",life:"生活費診断",rate:"変動 vs 固定 比較",
  prepay:"繰り上げ返済",cost:"諸費用計算",future:"将来リスク",
  docs:"必要書類チェックリスト",pair:"ペアローン解説",words:"用語集",flow:"手続きの流れ",
};

export default function App() {
  var s1=useState(false); var started=s1[0],setStarted=s1[1];
  var s2=useState("sim"); var tab=s2[0],setTab=s2[1];
  if(!started){
    return <div><GS/><Hero onStart={function(){setStarted(true);}}/></div>;
  }
  var panels={
    sim:<SimPanel/>,life:<LifePanel/>,rate:<RatePanel/>,
    prepay:<PrepayPanel/>,cost:<CostPanel/>,future:<FuturePanel/>,
    docs:<DocsPanel/>,pair:<PairPanel/>,words:<WordsPanel/>,flow:<FlowPanel/>,
  };
  return(
    <div style={{minHeight:"100vh",background:D.canvas}}>
      <GS/>
      {/* ヘッダー */}
      <div style={{background:D.bg,borderBottom:"1px solid "+D.border,position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 32px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
            <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={function(){setStarted(false);}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:D.accent}}/>
              <span style={{fontSize:14,fontWeight:700,color:D.ink,letterSpacing:"-0.03em"}}>住まいのお金診断</span>
            </div>
            <div style={{display:"flex",gap:0,overflowX:"auto"}}>
              {TABS.map(function(t){
                var active=tab===t.id;
                return(
                  <button key={t.id} onClick={function(){setTab(t.id);}}
                    style={{padding:"0 14px",height:56,border:"none",borderBottom:active?"2px solid "+D.ink:"2px solid transparent",background:"transparent",fontSize:12,fontWeight:active?600:400,color:active?D.ink:D.inkXl,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",letterSpacing:"-0.01em",transition:"color .15s"}}>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* コンテンツ */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 32px 100px"}}>
        <div style={{marginBottom:36}}>
          <h2 style={{fontSize:28,fontWeight:700,color:D.ink,letterSpacing:"-0.04em",marginBottom:6}}>{TAB_LABELS[tab]}</h2>
          <div style={{width:32,height:2,background:D.accent,borderRadius:1}}/>
        </div>
        {panels[tab]}
      </div>
      {/* フッター */}
      <div style={{background:D.bg,borderTop:"1px solid "+D.border,padding:"32px",textAlign:"center"}}>
        <div style={{fontSize:12,color:D.inkXl,lineHeight:1.9,maxWidth:560,margin:"0 auto"}}>
          本ツールの計算結果・情報は一般的な目安であり、金融機関の審査結果を保証するものではありません。<br/>
          実際の借入・審査については、金融機関または専門家にご相談ください。
        </div>
      </div>
    </div>
  );
}
