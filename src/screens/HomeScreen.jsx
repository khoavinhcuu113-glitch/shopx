import { C, CATEGORIES } from '../constants';

export default function HomeScreen({ go, chkLogin, nav }) {
  const listings = [
    { icon: '📱', title: 'iPhone 13 Pro 256GB còn BH',    price: '18.500.000đ', loc: 'Biên Hòa',  scr: 's-prod1' },
    { icon: '🏍️', title: 'Honda SH 125i 2021 đen bóng',  price: '62.000.000đ', loc: 'Long Khánh', scr: 's-prod2' },
    { icon: '❄️', title: 'Tủ lạnh Samsung Inverter 236L', price: '4.200.000đ',  loc: 'Biên Hòa',   scr: 's-prod6' },
    { icon: '🚲', title: 'Xe đạp Trek FX3 2022',           price: '8.200.000đ', loc: 'Trảng Bom', scr: 's-prod10' },
  ];
  return (
    <div>
      {/* Header */}
      <div style={{ background: C.p, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>ShopX</div>
        <div onClick={() => go('s-search')} style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>🔍 Tìm kiếm sản phẩm...</span>
        </div>
        <button onClick={() => { go('s-notif'); nav('ni-bell'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 4, fontSize: 18 }}>
          🔔<span style={{ position: 'absolute', top: 0, right: 0, background: '#e53935', color: '#fff', borderRadius: '50%', width: 14, height: 14, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
        </button>
      </div>

      {/* Hero */}
      <div style={{ background: C.p, padding: 16 }}>
        <h1 style={{ color: '#fff', fontSize: 17, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>Đồng hành - Tiết kiệm<br />Cùng kiếm tiền</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 10 }}>Chợ đồ cũ trực tuyến nhộn nhịp nhất của người Việt • shopx.pi</p>
        <button onClick={() => chkLogin('s-post')} style={{ background: '#fff', color: C.p, border: 'none', padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📝 Đăng tin ngay</button>
      </div>

      {/* 3 nút */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '14px 12px 8px' }}>
        {[
          { icon: '🏷️', label: 'Đăng tin bán',   action: () => chkLogin('s-post') },
          { icon: '🔧', label: 'Tìm dịch vụ',    action: () => { go('s-service'); nav('ni-cat'); } },
          { icon: '💼', label: 'Tìm công việc',  action: () => { go('s-service'); nav('ni-cat'); } },
        ].map((b, i) => (
          <button key={i} onClick={b.action} style={{ background: C.w, border: `1.5px solid ${C.b}`, borderRadius: 14, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', width: '100%' }}>
            <span style={{ fontSize: 22 }}>{b.icon}</span>
            <span style={{ fontSize: 10, color: C.t, fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>{b.label}</span>
          </button>
        ))}
      </div>

      {/* Danh mục */}
      <div style={{ padding: '0 12px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0 8px' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.t }}>Khám phá danh mục</h2>
          <span style={{ fontSize: 12, color: C.p, cursor: 'pointer' }} onClick={() => { go('s-categories'); nav('ni-cat'); }}>Xem tất cả</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {CATEGORIES.slice(0, 8).map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              onClick={() => i === 3 ? go('s-service') : go('s-categories')}>
              <div style={{ width: 52, height: 52, background: C.w, border: `1px solid #e0d4f7`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{c.icon}</div>
              <span style={{ fontSize: 9, color: C.m, textAlign: 'center', lineHeight: 1.2 }}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tin đăng */}
      <div style={{ padding: '0 12px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0 8px' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: C.t }}>Tin đăng mới nhất</h2>
          <span style={{ fontSize: 12, color: C.p, cursor: 'pointer' }} onClick={() => go('s-all-listings')}>Xem tất cả</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {listings.map((l, i) => (
            <div key={i} style={{ background: C.w, borderRadius: 12, overflow: 'hidden', border: `1px solid #e8def8`, cursor: 'pointer' }} onClick={() => { sessionStorage.setItem('sx_product_return', 's-home'); go(l.scr); }}>
              <div style={{ width: '100%', height: 80, background: C.pl, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{l.icon}</div>
              <div style={{ padding: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: C.t, marginBottom: 2, lineHeight: 1.3 }}>{l.title}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.p, marginBottom: 2 }}>{l.price}</div>
                <div style={{ fontSize: 10, color: C.m }}>📍 {l.loc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}
