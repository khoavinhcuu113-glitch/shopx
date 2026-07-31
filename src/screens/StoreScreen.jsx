import { useState } from 'react';
import { C } from '../constants';
import { Shdr, Btn, Btn2 } from '../components/UI';

// Dữ liệu mẫu gian hàng
const STORE_DATA = {
  personal: {
    name: 'Chị Lan Handmade',
    type: 'personal',
    typeLabel: '👤 Cá nhân',
    typeBg: C.pl,
    typeColor: C.pd,
    avatar: 'LH',
    avatarBg: '#f59e0b',
    location: 'Hố Nai, Biên Hòa',
    bio: 'Chuyên làm bánh handmade, cơm nhà và dịch vụ nội khu. Giao hàng nhanh trong khu chung cư.',
    verified: ['🪪 Căn cước', '🟣 Pi Network'],
    stats: { orders: 156, rate: 98.7, thumbsUp: 99 },
    products: [
      { icon: '🍞', name: 'Bánh mì thịt nướng', price: '25.000đ', unit: '/ổ', inStock: true },
      { icon: '🍱', name: 'Cơm hộp văn phòng', price: '35.000đ', unit: '/hộp', inStock: true },
      { icon: '🎂', name: 'Bánh bông lan homemade', price: '45.000đ', unit: '/cái', inStock: true },
      { icon: '🧁', name: 'Cupcake sinh nhật (đặt trước)', price: '15.000đ', unit: '/cái', inStock: false },
    ],
    services: [
      { icon: '🧹', name: 'Vệ sinh nhà theo giờ', price: '80.000đ', unit: '/giờ' },
      { icon: '👕', name: 'Giặt ủi theo ký', price: '15.000đ', unit: '/kg' },
      { icon: '🛒', name: 'Mua hộ - đi chợ hộ', price: '20.000đ', unit: '/lần' },
    ],
    reviews: [
      { name: 'SX-00089', text: 'Bánh ngon, giao hàng đúng giờ, đóng gói cẩn thận!', thumb: '👍', time: '2 ngày trước' },
      { name: 'SX-00234', text: 'Cơm hộp ngon như cơm nhà. Sẽ đặt tiếp!', thumb: '👍', time: '5 ngày trước' },
    ],
  },
  business: {
    name: 'Cửa hàng Điện tử Minh Anh',
    type: 'business',
    typeLabel: '🏢 Doanh nghiệp',
    typeBg: '#e3f2fd',
    typeColor: '#1565c0',
    avatar: 'MA',
    avatarBg: '#1565c0',
    location: 'Biên Hòa, Đồng Nai',
    bio: 'Chuyên kinh doanh điện thoại, laptop, phụ kiện chính hãng. Bảo hành 12 tháng. Đổi trả 7 ngày.',
    verified: ['🪪 Căn cước', '🏢 Doanh nghiệp xác minh', '⭐ Giấy phép KD'],
    stats: { orders: 1248, rate: 97.5, thumbsUp: 96.8 },
    products: [
      { icon: '📱', name: 'iPhone 15 Pro 256GB', price: '28.500.000đ', unit: '/máy', inStock: true },
      { icon: '📱', name: 'Samsung S24 Ultra', price: '22.900.000đ', unit: '/máy', inStock: true },
      { icon: '💻', name: 'MacBook Air M2 8GB', price: '26.990.000đ', unit: '/máy', inStock: true },
      { icon: '🎧', name: 'AirPods Pro 2nd Gen', price: '5.490.000đ', unit: '/cái', inStock: true },
      { icon: '⌚', name: 'Apple Watch Series 9', price: '9.990.000đ', unit: '/cái', inStock: false },
    ],
    services: [
      { icon: '🔧', name: 'Sửa chữa điện thoại', price: '50.000đ+', unit: '/lần' },
      { icon: '🔄', name: 'Thu cũ đổi mới', price: 'Thỏa thuận', unit: '' },
    ],
    reviews: [
      { name: 'SX-00412', text: 'Hàng chính hãng, bảo hành đầy đủ. Sẽ ủng hộ tiếp!', thumb: '👍', time: '1 ngày trước' },
      { name: 'SX-00156', text: 'Giao hàng nhanh, máy nguyên seal. Rất hài lòng!', thumb: '👍', time: '3 ngày trước' },
    ],
    adBanner: true, // Có banner quảng cáo
  },
};

export default function StoreScreen({ go, chkLogin, storeType = 'personal' }) {
  const [tab, setTab]     = useState('products');
  const store             = STORE_DATA[storeType];

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', background: C.g }}>
      <Shdr title="Gian hàng" onBack={() => go('s-home')} />

      {/* Banner quảng cáo — chỉ doanh nghiệp */}
      {store.adBanner && (
        <div style={{ background: 'linear-gradient(135deg, #1565c0, #1976d2)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>📢</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Khuyến mãi tháng 7 — Giảm đến 15%</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>Áp dụng cho iPhone 15 Series và MacBook M2</div>
          </div>
          <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '2px 6px', borderRadius: 6, marginLeft: 'auto', flexShrink: 0 }}>Quảng cáo</span>
        </div>
      )}

      {/* Header gian hàng */}
      <div style={{ background: C.w, padding: 14, borderBottom: `1px solid #e8def8` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
          {/* Avatar */}
          <div style={{ width: 60, height: 60, borderRadius: 14, background: store.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
            {store.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.t }}>{store.name}</span>
              <span style={{ fontSize: 10, background: store.typeBg, color: store.typeColor, padding: '2px 8px', borderRadius: 8, fontWeight: 600 }}>
                {store.typeLabel}
              </span>
            </div>
            <div style={{ fontSize: 11, color: C.m, marginBottom: 6 }}>📍 {store.location}</div>
            <div style={{ fontSize: 11, color: C.m, lineHeight: 1.4 }}>{store.bio}</div>
          </div>
        </div>

        {/* Thống kê */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
          {[
            { val: store.stats.orders.toLocaleString('vi-VN'), lbl: 'Lượt bán' },
            { val: `${store.stats.rate}%`,                     lbl: 'Hoàn thành' },
            { val: `${store.stats.thumbsUp}%`,                 lbl: '👍 Hài lòng' },
          ].map((s, i) => (
            <div key={i} style={{ background: C.pl, borderRadius: 8, padding: '6px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.p }}>{s.val}</div>
              <div style={{ fontSize: 9, color: C.m, marginTop: 1 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Badge xác minh */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {store.verified.map((b, i) => (
            <span key={i} style={{ fontSize: 10, background: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: 8, fontWeight: 500, border: '1px solid #c8e6c9' }}>
              {b} ✅
            </span>
          ))}
        </div>

        {/* Nút theo dõi + Chat + QR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <button style={{ background: C.pl, color: C.p, border: `1.5px solid ${C.p}`, padding: 9, borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            🔔 Theo dõi
          </button>
          <button onClick={() => chkLogin('s-chat-buy')}
            style={{ background: C.p, color: '#fff', border: 'none', padding: 9, borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            💬 Nhắn tin
          </button>
          <button onClick={() => go('s-qr')}
            style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', padding: 9, borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            📱 QR Code
          </button>
        </div>
      </div>

      {/* 3 Tab */}
      <div style={{ display: 'flex', background: C.w, borderBottom: `1px solid #e8def8`, position: 'sticky', top: 0, zIndex: 10 }}>
        {[
          { key: 'products', label: `🛍️ Sản phẩm (${store.products.length})` },
          { key: 'services', label: `🔧 Dịch vụ (${store.services.length})` },
          { key: 'reviews',  label: `⭐ Đánh giá` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flex: 1, padding: '10px 4px', border: 'none', background: 'none', fontSize: 11, fontWeight: tab === t.key ? 600 : 400, color: tab === t.key ? C.p : C.m, borderBottom: `2px solid ${tab === t.key ? C.p : 'transparent'}`, cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 12 }}>

        {/* Tab Sản phẩm */}
        {tab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {store.products.map((p, i) => (
              <div key={i} style={{ background: C.w, borderRadius: 12, padding: 12, border: `1px solid ${p.inStock ? '#e8def8' : '#f5f5f5'}`, display: 'flex', alignItems: 'center', gap: 10, opacity: p.inStock ? 1 : 0.6 }}>
                <div style={{ width: 48, height: 48, background: C.pl, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.p }}>{p.price}<span style={{ fontSize: 10, fontWeight: 400, color: C.m }}>{p.unit}</span></div>
                  {!p.inStock && <div style={{ fontSize: 10, color: '#e53935', marginTop: 2 }}>Tạm hết hàng</div>}
                </div>
                <button
                  onClick={() => chkLogin('s-chat-buy')}
                  disabled={!p.inStock}
                  style={{ background: p.inStock ? C.p : '#ccc', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: p.inStock ? 'pointer' : 'default', flexShrink: 0 }}>
                  {p.inStock ? 'Mua' : 'Hết'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab Dịch vụ */}
        {tab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {store.services.map((s, i) => (
              <div key={i} style={{ background: C.w, borderRadius: 12, padding: 12, border: '1px solid #e8def8', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 48, height: 48, background: C.pl, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 2 }}>{s.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.p }}>{s.price}<span style={{ fontSize: 10, fontWeight: 400, color: C.m }}>{s.unit}</span></div>
                </div>
                <button onClick={() => chkLogin('s-chat-worker')}
                  style={{ background: C.p, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                  Đặt
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab Đánh giá */}
        {tab === 'reviews' && (
          <div>
            {/* Tổng quan đánh giá */}
            <div style={{ background: C.w, borderRadius: 12, padding: 12, marginBottom: 10, border: '1px solid #e8def8', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: C.p, marginBottom: 4 }}>{store.stats.thumbsUp}%</div>
              <div style={{ fontSize: 13, color: C.m, marginBottom: 8 }}>👍 Khách hài lòng</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12, color: C.m }}>
                <span>✅ {store.stats.rate}% hoàn thành</span>
                <span>{store.stats.orders.toLocaleString('vi-VN')} lượt</span>
              </div>
            </div>
            {/* Danh sách đánh giá */}
            {store.reviews.map((r, i) => (
              <div key={i} style={{ background: C.w, borderRadius: 12, padding: 12, marginBottom: 8, border: '1px solid #e8def8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, background: C.pl, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: C.p, flexShrink: 0 }}>
                    {r.name.slice(-2)}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.t }}>{r.name}</div>
                    <div style={{ fontSize: 10, color: C.m }}>{r.time}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 18 }}>{r.thumb}</span>
                </div>
                <div style={{ fontSize: 12, color: C.t, lineHeight: 1.4 }}>{r.text}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
