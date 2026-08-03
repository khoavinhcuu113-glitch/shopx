import { useState } from 'react';
import { C } from '../constants';
import { Shdr, Btn, Btn2 } from '../components/UI';

// ─── DỮ LIỆU MẪU ─────────────────────────────────────────────────────

// Gian hàng CỦA TÔI — SX-00001 Khoavinhcuu113
const MY_STORE = {
  id: 'SX-00001',
  name: 'Khoavinhcuu113',
  type: 'personal',
  typeLabel: '👤 Cá nhân',
  avatar: 'KV',
  avatarBg: C.p,
  location: 'Biên Hòa, Đồng Nai',
  bio: 'Bán đồ cũ còn tốt, cơm hộp văn phòng và nhận sửa điện dân dụng tại nhà khu vực Biên Hòa.',
  verified: ['✅ SĐT', '🪪 Căn cước KYC'],
  stats: { orders: 34, rate: 97, thumbsUp: 98.2 },
  hasCV: true, // Có đăng ký CV thợ điện

  products: [
    { id: 'p1', icon: '📱', name: 'iPhone 13 Pro 256GB còn BH', price: '18.500.000đ', cat: 'Đồ điện tử', loc: 'Biên Hòa', status: 'selling' },
    { id: 'p2', icon: '🏍️', name: 'Honda SH 125i 2021 đen bóng', price: '62.000.000đ', cat: 'Xe cộ', loc: 'Biên Hòa', status: 'selling' },
    { id: 'p3', icon: '❄️', name: 'Máy lạnh Daikin 1.5HP Inverter', price: '5.800.000đ', cat: 'Điện lạnh', loc: 'Biên Hòa', status: 'selling' },
    { id: 'p4', icon: '🛋️', name: 'Sofa góc L màu xám còn mới 80%', price: '3.200.000đ', cat: 'Nội thất', loc: 'Biên Hòa', status: 'selling' },
    { id: 'p5', icon: '🍱', name: 'Cơm hộp văn phòng đặt trước', price: '35.000đ', cat: 'Đồ ăn', loc: 'Hố Nai', status: 'selling' },
  ],
  services: [
    { id: 's1', icon: '🔧', name: 'Sửa điện dân dụng tại nhà', price: '80.000đ/giờ', cat: 'Thợ điện' },
    { id: 's2', icon: '💡', name: 'Lắp đặt đèn chiếu sáng', price: '150.000đ/lần', cat: 'Thợ điện' },
  ],
  reviews: [
    { from: 'SX-00089', text: 'Máy lạnh còn tốt, đúng mô tả. Giao hàng nhanh!', thumb: '👍', time: '2 ngày trước', product: 'Máy lạnh Daikin' },
    { from: 'SX-00234', text: 'Sửa điện xong ngay trong ngày, giá hợp lý.', thumb: '👍', time: '5 ngày trước', product: 'Dịch vụ sửa điện' },
    { from: 'SX-00412', text: 'Cơm ngon như cơm nhà, sẽ đặt tiếp!', thumb: '👍', time: '1 tuần trước', product: 'Cơm hộp' },
  ],
};

// Gian hàng NGƯỜI KHÁC — BIZ-0001 Cửa hàng Minh Anh
const OTHER_STORE = {
  id: 'BIZ-0001',
  name: 'Cửa hàng Điện tử Minh Anh',
  type: 'business',
  typeLabel: '🏢 Doanh nghiệp',
  avatar: 'MA',
  avatarBg: '#1565c0',
  location: 'Biên Hòa, Đồng Nai',
  bio: 'Chuyên iPhone, Samsung, laptop chính hãng. Bảo hành 12 tháng. Đổi trả 7 ngày.',
  verified: ['✅ SĐT', '🪪 Căn cước KYC', '🏢 Doanh nghiệp xác minh'],
  stats: { orders: 1248, rate: 97.5, thumbsUp: 96.8 },
  hasCV: false,
  adBanner: true,

  products: [
    { id: 'p1', icon: '📱', name: 'iPhone 15 Pro 256GB', price: '28.500.000đ', cat: 'Điện thoại', loc: 'Biên Hòa', status: 'selling' },
    { id: 'p2', icon: '📱', name: 'Samsung S24 Ultra 256GB', price: '22.900.000đ', cat: 'Điện thoại', loc: 'Biên Hòa', status: 'selling' },
    { id: 'p3', icon: '💻', name: 'MacBook Air M2 8GB/256GB', price: '26.990.000đ', cat: 'Laptop', loc: 'Biên Hòa', status: 'selling' },
    { id: 'p4', icon: '🎧', name: 'AirPods Pro 2nd Gen', price: '5.490.000đ', cat: 'Phụ kiện', loc: 'Biên Hòa', status: 'selling' },
    { id: 'p5', icon: '⌚', name: 'Apple Watch Series 9', price: '9.990.000đ', cat: 'Đồng hồ', loc: 'Biên Hòa', status: 'out' },
  ],
  services: [], // Không có CV thợ → ẩn tab Dịch vụ

  reviews: [
    { from: 'SX-00412', text: 'Hàng chính hãng, bảo hành đầy đủ!', thumb: '👍', time: '1 ngày trước', product: 'iPhone 15 Pro' },
    { from: 'SX-00156', text: 'Giao hàng nhanh, máy nguyên seal.', thumb: '👍', time: '3 ngày trước', product: 'MacBook Air M2' },
  ],
};

// ─── STORE SCREEN ─────────────────────────────────────────────────────
export default function StoreScreen({ go, chkLogin, storeType = 'personal', isOwner = false }) {
  const store = isOwner
    ? MY_STORE
    : storeType === 'business' ? OTHER_STORE : MY_STORE;

  // Tab chỉ hiện khi có nội dung
  const tabs = [
    { key: 'products', label: `🛍️ Sản phẩm (${store.products.length})`, show: store.products.length > 0 },
    { key: 'services', label: `🔧 Dịch vụ (${store.services.length})`, show: store.hasCV && store.services.length > 0 },
    { key: 'reviews',  label: `⭐ Đánh giá (${store.reviews.length})`, show: true },
  ].filter(t => t.show);

  const [tab, setTab] = useState(tabs[0]?.key || 'products');

  // Kiểm tra người dùng đã mua chưa (demo)
  const purchasedFrom = ['SX-00001']; // SX-00001 là tao đã mua từ cửa hàng này

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', background: C.g }}>

      {/* Header */}
      <div style={{ background: store.type === 'business' ? '#1565c0' : C.p, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => isOwner ? go('s-account') : go('s-prod1')}
          style={{ color: '#fff', border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, padding: 4 }}>←</button>
        <div style={{ flex: 1, color: '#fff', fontSize: 14, fontWeight: 600 }}>
          {isOwner
            ? store.type === 'business' ? 'Gian hàng Doanh nghiệp' : 'Gian hàng của tôi'
            : 'Gian hàng'}
        </div>
        {isOwner && (
          <button onClick={() => go('s-qr')}
            style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.5)', background: 'none', padding: '5px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer' }}>
            📱 QR
          </button>
        )}
      </div>

      {/* Banner quảng cáo — chỉ doanh nghiệp */}
      {store.adBanner && (
        <div style={{ background: 'linear-gradient(135deg,#1565c0,#1976d2)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>📢</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Khuyến mãi tháng 8 — Giảm đến 15%</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>iPhone 15 Series và MacBook M2</div>
          </div>
          <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '2px 6px', borderRadius: 6 }}>Quảng cáo</span>
        </div>
      )}

      {/* Thông tin gian hàng */}
      <div style={{ background: C.w, padding: 14, borderBottom: `1px solid #e8def8` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: store.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
            {store.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.t }}>{store.name}</span>
              <span style={{ fontSize: 10, background: C.pl, color: C.pd, padding: '2px 8px', borderRadius: 8 }}>{store.typeLabel}</span>
            </div>
            <div style={{ fontSize: 11, color: C.m, marginBottom: 4 }}>📍 {store.location}</div>
            <div style={{ fontSize: 11, color: C.m, lineHeight: 1.4 }}>{store.bio}</div>
          </div>
        </div>

        {/* Thống kê */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 10 }}>
          {[
            { val: store.stats.orders.toLocaleString('vi-VN'), lbl: 'Lượt bán' },
            { val: `${store.stats.rate}%`, lbl: 'Hoàn thành' },
            { val: `${store.stats.thumbsUp}%`, lbl: '👍 Hài lòng' },
          ].map((s, i) => (
            <div key={i} style={{ background: C.pl, borderRadius: 8, padding: '6px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.p }}>{s.val}</div>
              <div style={{ fontSize: 9, color: C.m, marginTop: 1 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Thông tin doanh nghiệp — chỉ hiện khi là DN */}
        {store.type === 'business' && (
          <div style={{ background: '#e3f2fd', borderRadius: 10, padding: '10px 12px', marginBottom: 10, border: '1px solid #bbdefb' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1565c0', marginBottom: 6 }}>🏢 Thông tin doanh nghiệp</div>
            {[
              { label: 'Ngành nghề', val: 'Kinh doanh điện thoại, laptop, phụ kiện' },
              { label: 'Địa chỉ KD',  val: '45 Đồng Khởi, Biên Hòa, Đồng Nai' },
              { label: 'Mã số thuế',  val: '3602123456' },
              { label: 'Giờ mở cửa', val: '8:00 - 21:00 (Thứ 2 - Chủ nhật)' },
              { label: 'Chính sách', val: 'Bảo hành 12 tháng • Đổi trả 7 ngày' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, padding: '3px 0', borderBottom: i < 4 ? '1px solid #bbdefb' : 'none' }}>
                <span style={{ fontSize: 11, color: '#1976d2', width: 84, flexShrink: 0 }}>{r.label}:</span>
                <span style={{ fontSize: 11, color: '#0d47a1', fontWeight: 500 }}>{r.val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Badge xác minh */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {store.verified.map((b, i) => (
            <span key={i} style={{ fontSize: 10, background: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: 8, fontWeight: 500, border: '1px solid #c8e6c9' }}>
              {b}
            </span>
          ))}
        </div>

        {/* Nút hành động — KHÁC nhau giữa của tôi và người khác */}
        {isOwner ? (
          // CỦA TÔI: Thêm SP / Chỉnh sửa / QR
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button onClick={() => go('s-post')}
              style={{ background: C.p, color: '#fff', border: 'none', padding: 9, borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              ➕ Thêm sản phẩm
            </button>
            <button onClick={() => go('s-qr')}
              style={{ background: C.pl, color: C.p, border: `1px solid ${C.b}`, padding: 9, borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              📱 QR Code của tôi
            </button>
          </div>
        ) : (
          // NGƯỜI KHÁC: Theo dõi / Nhắn tin / QR chia sẻ
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <button style={{ background: C.pl, color: C.p, border: `1px solid ${C.b}`, padding: 9, borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              🔔 Theo dõi
            </button>
            <button onClick={() => chkLogin('s-chat-buy')}
              style={{ background: C.p, color: '#fff', border: 'none', padding: 9, borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              💬 Nhắn tin
            </button>
            <button style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', padding: 9, borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              📱 Chia sẻ
            </button>
          </div>
        )}
      </div>

      {/* Tabs — chỉ hiện tab có nội dung */}
      <div style={{ display: 'flex', background: C.w, borderBottom: `1px solid #e8def8`, position: 'sticky', top: 0, zIndex: 10 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flex: 1, padding: '10px 4px', border: 'none', background: 'none', fontSize: 11, fontWeight: tab === t.key ? 600 : 400, color: tab === t.key ? C.p : C.m, borderBottom: `2px solid ${tab === t.key ? C.p : 'transparent'}`, cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 12 }}>

        {/* Tab Sản phẩm */}
        {tab === 'products' && (
          <div>
            {store.products.length === 0 ? (
              // Gian hàng trống
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏪</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.t, marginBottom: 8 }}>Chưa có sản phẩm nào</div>
                <div style={{ fontSize: 12, color: C.m, marginBottom: 20 }}>Đăng tin bán để khách hàng thấy sản phẩm của bạn</div>
                {isOwner && <Btn onClick={() => go('s-post')}>➕ Đăng tin ngay</Btn>}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {store.products.map((p, i) => (
                  <div key={p.id} style={{ background: C.w, borderRadius: 12, padding: 12, border: `1px solid ${p.status === 'out' ? '#f5f5f5' : '#e8def8'}`, display: 'flex', alignItems: 'center', gap: 10, opacity: p.status === 'out' ? 0.6 : 1 }}>
                    <div style={{ width: 48, height: 48, background: C.pl, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                      {p.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 2 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: C.m, marginBottom: 2 }}>{p.cat} • 📍 {p.loc}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.p }}>{p.price}</div>
                      {p.status === 'out' && <div style={{ fontSize: 10, color: '#e53935' }}>Tạm hết hàng</div>}
                    </div>
                    {isOwner ? (
                      // Chủ gian hàng: nút chỉnh sửa
                      <button style={{ background: C.pl, color: C.p, border: `1px solid ${C.b}`, padding: '6px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>
                        ✏️ Sửa
                      </button>
                    ) : (
                      // Khách: nút mua
                      <button
                        onClick={() => p.status !== 'out' && chkLogin('s-chat-buy')}
                        disabled={p.status === 'out'}
                        style={{ background: p.status === 'out' ? '#ccc' : C.p, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: p.status === 'out' ? 'default' : 'pointer', flexShrink: 0 }}>
                        {p.status === 'out' ? 'Hết' : 'Mua'}
                      </button>
                    )}
                  </div>
                ))}
                {isOwner && (
                  <button onClick={() => go('s-post')}
                    style={{ width: '100%', background: '#e8f5e9', color: '#2e7d32', border: '1.5px dashed #c8e6c9', padding: 12, borderRadius: 12, fontSize: 13, cursor: 'pointer', marginTop: 4 }}>
                    ➕ Thêm sản phẩm mới
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab Dịch vụ — chỉ hiện khi có CV */}
        {tab === 'services' && store.hasCV && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Tiêu đề dịch vụ của ai */}
            <div style={{ background: C.pl, borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: store.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {store.avatar}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.t }}>{store.name}</div>
                <div style={{ fontSize: 10, color: C.m }}>Đang cung cấp {store.services.length} dịch vụ • {store.location}</div>
              </div>
            </div>

            {store.services.map((s, i) => (
              <div key={s.id} style={{ background: C.w, borderRadius: 12, padding: 12, border: '1px solid #e8def8', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 48, height: 48, background: C.pl, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 2 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: C.m, marginBottom: 2 }}>{s.cat} • {store.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.p }}>{s.price}</div>
                </div>
                {isOwner ? (
                  <button onClick={() => go('s-cv-register')}
                    style={{ background: C.pl, color: C.p, border: `1px solid ${C.b}`, padding: '6px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer' }}>
                    ✏️ Sửa CV
                  </button>
                ) : (
                  <button onClick={() => chkLogin('s-chat-worker')}
                    style={{ background: C.p, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    Đặt
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab Đánh giá */}
        {tab === 'reviews' && (
          <div>
            {/* Tổng quan */}
            <div style={{ background: C.w, borderRadius: 12, padding: 12, marginBottom: 10, border: '1px solid #e8def8', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: C.p }}>{store.stats.thumbsUp}%</div>
              <div style={{ fontSize: 12, color: C.m, marginBottom: 6 }}>👍 Khách hài lòng</div>
              <div style={{ fontSize: 11, color: C.m }}>
                {store.stats.orders.toLocaleString('vi-VN')} lượt bán • {store.stats.rate}% hoàn thành
              </div>
            </div>

            {/* Danh sách đánh giá */}
            {store.reviews.map((r, i) => (
              <div key={i} style={{ background: C.w, borderRadius: 12, padding: 12, marginBottom: 8, border: '1px solid #e8def8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, background: C.pl, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: C.p, flexShrink: 0 }}>
                    {r.from.slice(-2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.t }}>{r.from}</div>
                    <div style={{ fontSize: 10, color: C.m }}>{r.product} • {r.time}</div>
                  </div>
                  <span style={{ fontSize: 18 }}>{r.thumb}</span>
                </div>
                <div style={{ fontSize: 12, color: C.t, lineHeight: 1.4 }}>{r.text}</div>
              </div>
            ))}

            {/* Nút đánh giá — chỉ khi đã mua */}
            {!isOwner && (
              <div style={{ marginTop: 8 }}>
                {purchasedFrom.includes('SX-00001') ? (
                  <button onClick={() => chkLogin('s-rating')}
                    style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 11, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    ⭐ Đánh giá gian hàng này → nhận 5 SX Points
                  </button>
                ) : (
                  <div style={{ background: '#f5f5f5', borderRadius: 10, padding: '10px 12px', textAlign: 'center', fontSize: 12, color: C.m }}>
                    ⚠️ Bạn chưa từng giao dịch với gian hàng này.<br/>Chỉ người đã mua mới được đánh giá.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
