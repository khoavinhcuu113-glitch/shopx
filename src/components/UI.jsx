import { C } from '../constants';

export function Shdr({ title, onBack, children }) {
  return (
    <div style={{ background: C.p, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 10, flexShrink: 0 }}>
      {onBack && <button onClick={onBack} style={{ color: '#fff', border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, padding: 4 }}>←</button>}
      <span style={{ color: '#fff', fontSize: 15, fontWeight: 600, flex: 1 }}>{title}</span>
      {children}
    </div>
  );
}

export function Btn({ children, onClick, style = {}, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: '100%', background: disabled ? '#ccc' : C.p, color: disabled ? '#888' : '#fff', border: 'none', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      {children}
    </button>
  );
}

export function Btn2({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{ width: '100%', background: C.w, color: C.p, border: `1.5px solid ${C.p}`, padding: 11, borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8, ...style }}>
      {children}
    </button>
  );
}

export function Fg({ label, req, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 5, display: 'block' }}>
        {label}{req && <span style={{ color: '#e53935', marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export function Fi({ ...props }) {
  return <input style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none' }} {...props} />;
}

export function Fs({ children, ...props }) {
  return <select style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, appearance: 'none', outline: 'none' }} {...props}>{children}</select>;
}

export function Sechdr({ num, title }) {
  return (
    <div style={{ background: C.p, color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 12px', borderRadius: 10, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ background: 'rgba(255,255,255,0.25)', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{num}</div>
      {title}
    </div>
  );
}

export function VidPlaceholder({ title, desc }) {
  return (
    <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', borderRadius: 12, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, border: `1.5px dashed ${C.p}` }}>
      <div style={{ width: 44, height: 44, background: C.p, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>▶️</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{desc}</div>
      </div>
      <span style={{ fontSize: 10, background: 'rgba(123,47,190,0.4)', color: C.pl, padding: '3px 8px', borderRadius: 20, border: `1px solid ${C.p}`, whiteSpace: 'nowrap', flexShrink: 0 }}>Sắp có</span>
    </div>
  );
}

export function Upbox({ icon, text }) {
  return (
    <div style={{ border: '2px dashed #c4a8e8', borderRadius: 12, padding: 14, textAlign: 'center', cursor: 'pointer', background: '#faf7ff' }}>
      <div style={{ fontSize: 26, marginBottom: 4 }}>{icon}</div>
      <p style={{ fontSize: 12, color: C.m }}>{text}</p>
    </div>
  );
}

export function Warnbox({ text }) {
  return (
    <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 10, padding: '10px 12px', fontSize: 11, color: '#f57f17', display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
      <span style={{ flexShrink: 0 }}>⚠️</span><span>{text}</span>
    </div>
  );
}

export function Infobox({ icon = 'ℹ️', text, color = C.pd, bg = C.pl }) {
  return (
    <div style={{ background: bg, borderRadius: 10, padding: '10px 12px', fontSize: 12, color, marginBottom: 10, display: 'flex', gap: 8 }}>
      <span style={{ flexShrink: 0 }}>{icon}</span><span>{text}</span>
    </div>
  );
}

export function Avatar({ initials, size = 44, bg = C.p, fontSize = 14 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontSize, fontWeight: 700 }}>
      {initials}
    </div>
  );
}

export function Badge({ label, type = 'default' }) {
  const styles = {
    ok:      { background: '#e8f5e9', color: '#2e7d32' },
    pend:    { background: '#fff3e0', color: '#e65100' },
    lock:    { background: '#f5f0ff', color: C.p },
    default: { background: C.pl,     color: C.pd },
  };
  const st = styles[type] || styles.default;
  return <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, fontWeight: 500, ...st }}>{label}</span>;
}

export function Ckrow({ label, ...props }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 6, cursor: 'pointer' }}>
      <input type="checkbox" style={{ accentColor: C.p }} {...props} /> {label}
    </label>
  );
}
