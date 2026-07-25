import { C } from '../constants';

export default function BottomNav({ active, go, nav, chkLogin }) {
  const items = [
    { id: 'ni-home', icon: '🏠', label: 'Trang chủ', action: () => { go('s-home'); nav('ni-home'); } },
    { id: 'ni-cat',  icon: '⊞',  label: 'Danh mục',  action: () => { go('s-categories'); nav('ni-cat'); } },
    { id: 'ni-post', icon: '➕',  label: 'Đăng tin',  action: () => { chkLogin('s-post'); nav('ni-post'); } },
    { id: 'ni-bell', icon: '🔔', label: 'Thông báo', action: () => { go('s-notif'); nav('ni-bell'); } },
    { id: 'ni-acc',  icon: '👤', label: 'Tài khoản', action: () => { go('s-account'); nav('ni-acc'); } },
  ];
  return (
    <nav style={{ background: C.w, borderTop: `1px solid ${C.b}`, display: 'flex', padding: '6px 0 2px', flexShrink: 0 }}>
      {items.map(it => (
        <button key={it.id} onClick={it.action} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', padding: 4, border: 'none', background: 'none', color: active === it.id ? C.p : C.m }}>
          <span style={{ fontSize: 20 }}>{it.icon}</span>
          <span style={{ fontSize: 10 }}>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
