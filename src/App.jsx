import React, { useState } from 'react';
import { C, NGHES, NGANH_LIST, CATEGORIES, FREE_ORDERS_SELLER, calcPlatformFee } from './constants';
import { Shdr, Btn, Btn2, Fg, Fi, Fs, Sechdr, VidPlaceholder, Upbox, Warnbox, Infobox, Avatar, Badge, Ckrow } from './components/UI';
import BottomNav from './components/BottomNav';
import LoginPopup from './components/LoginPopup';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import DeliveryScreen from './screens/DeliveryScreen';
import Chat3WayScreen from './screens/Chat3WayScreen';
import NotifScreen from './screens/NotifScreen';
import ShipperRegisterScreen from './screens/ShipperRegisterScreen';
import ShipperOrdersScreen from './screens/ShipperOrdersScreen';
import { RatingBadge, RatingStats } from './screens/RatingScreen';
import StoreScreen from './screens/StoreScreen';
import QRScreen from './screens/QRScreen';
import TermsScreen, { TermsMenuScreen } from './screens/TermsScreen';
import ServiceOrderScreen, { ServiceOrderAlert } from './screens/ServiceOrderScreen';
import CvRegisterScreen, { CvSuccessScreen, CccdScreen } from './screens/CvRegisterScreen';
import RatingScreen from './screens/RatingScreen';
import { SAMPLE_USER_RATINGS, getRatingLevel } from './constants';
import ShipperCommunityScreen, { ShipperSuccessScreen } from './screens/ShipperScreens';

// ─── CATEGORIES SCREEN ───────────────────────────────────────────────
function CategoriesScreen({ go, nav }) {
  return (
    <div>
      <Shdr title="Tất cả danh mục" onBack={() => { go('s-home'); nav('ni-home'); }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 12 }}>
        {CATEGORIES.map((c, i) => (
          <div key={i} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 14, padding: '14px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={() => i === 3 ? go('s-service') : go('s-prod1')}>
            <div style={{ width: 44, height: 44, background: C.pl, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>{c.icon}</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.t, lineHeight: 1.3 }}>{c.name}</span>
          </div>
        ))}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}

// ─── PRODUCT SCREEN ───────────────────────────────────────────────────
function ProductScreen({ go, chkLogin, type }) {
  const data = {
    p1: { icon: '📱', bg: C.pl, title: 'iPhone 13 Pro 256GB — Sierra Blue', price: '18.500.000đ', cond: 'Như mới (99%)', loc: 'Biên Hòa', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.8 • 34 giao dịch', desc: 'iPhone 13 Pro 256GB Sierra Blue, mua 3/2024, còn BH Apple đến 3/2025. Nguyên zin 100%, pin 89%.', defect: 'Vết xước nhỏ góc trên bên phải khung máy.', count: '1/6 ảnh' },
    p2: { icon: '🏍️', bg: '#e8def8', title: 'Honda SH 125i 2021 — Đen bóng láng', price: '62.000.000đ', cond: 'Đã dùng (còn tốt)', loc: 'Long Khánh', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.9 • 67 giao dịch', desc: 'SH 125i 2021 đen bóng, 12.000km, bảo dưỡng định kỳ, giấy tờ đầy đủ, sang tên ngay.', defect: 'Không có', count: '1/8 ảnh' },
  };
  const p = data[type] || data.p1;
  return (
    <div>
      <Shdr title="Chi tiết sản phẩm" onBack={() => go('s-categories')} />
      <div style={{ background: p.bg, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: 60 }}>
        {p.icon}<span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 10 }}>{p.count}</span>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: C.t, marginBottom: 4 }}>{p.title}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.p, marginBottom: 8 }}>{p.price}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          <span style={{ fontSize: 11, background: C.pl, color: C.pd, padding: '4px 10px', borderRadius: 10 }}>{p.cond}</span>
          <span style={{ fontSize: 11, background: C.pl, color: C.pd, padding: '4px 10px', borderRadius: 10 }}>📍 {p.loc}</span>
        </div>
        <VidPlaceholder title="Clip giới thiệu sản phẩm" desc="Sắp ra mắt — người bán quay clip 15-30s thực tế" />
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initials={p.av} size={40} />
          <div><div style={{ fontSize: 13, fontWeight: 600, color: C.t }}>{p.seller}</div><div style={{ fontSize: 11, color: C.m }}>{p.loc}, Đồng Nai</div><div style={{ fontSize: 11, color: C.p, marginTop: 2 }}>{p.stats}</div><div onClick={() => go('s-store-personal')} style={{ fontSize: 11, color: C.pd, marginTop: 2, cursor: 'pointer', textDecoration: 'underline' }}>🏪 Xem gian hàng</div></div>
        </div>
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 6 }}>Mô tả</h3>
          <p style={{ fontSize: 12, color: C.m, lineHeight: 1.6 }}>{p.desc}</p>
        </div>
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 6 }}>Khuyết điểm</h3>
          <p style={{ fontSize: 12, color: C.m, lineHeight: 1.6 }}>{p.defect}</p>
        </div>
        <Warnbox text="Gặp trực tiếp: ShopX không can thiệp. Dùng giao hàng cộng đồng để được bảo vệ." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <button style={{ background: C.w, color: C.p, border: `1.5px solid ${C.p}`, padding: 11, borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }} onClick={() => chkLogin('s-chat-buy')}>💬 Chat người bán</button>
          <button style={{ background: C.p, color: C.w, border: 'none', padding: 11, borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }} onClick={() => chkLogin('s-delivery')}>🚚 Đặt giao hàng</button>
        </div>
        <button style={{ width: '100%', background: 'none', color: C.m, border: '1px solid #e0d4f7', padding: 8, borderRadius: 10, fontSize: 12, cursor: 'pointer' }}>🚩 Báo cáo tin đăng</button>
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}

// ─── CHAT SCREEN ─────────────────────────────────────────────────────
// ─── SERVICE SCREEN (Fix E: 3 tab mới) ────────────────────────────────
function ServiceScreen({ go, chkLogin }) {
  const [tab, setTab] = useState('cv');
  const [nganh, setNganh] = useState('');
  const workers = [
    {
      av: 'VN', name: 'Anh Trần Văn Nhân', trade: 'Thợ điện dân dụng', exp: '8 năm',
      price: '80.000đ/giờ', orders: 788, completeRate: 98, cancelRate: 2,
      thumbsUp: 98.2, bg: C.p,
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '⭐ Chứng chỉ nghề',  ok: true  },
        { label: '🟣 Pi Network',       ok: false },
      ],
    },
    {
      av: 'TL', name: 'Anh Nguyễn Thanh Long', trade: 'Thợ sửa máy lạnh', exp: '5 năm',
      price: '150.000đ/ca', orders: 234, completeRate: 95, cancelRate: 5,
      thumbsUp: 94.5, bg: C.pm,
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '⭐ Chứng chỉ nghề',  ok: true  },
        { label: '🟣 Pi Network',       ok: false },
      ],
    },
    {
      av: 'TH', name: 'Chị Nguyễn Thu Hương', trade: 'Dọn dẹp vệ sinh nhà', exp: '3 năm',
      price: '200.000đ/lần', orders: 56, completeRate: 100, cancelRate: 0,
      thumbsUp: 100, bg: C.pd,
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '⭐ Chứng chỉ nghề',  ok: false },
        { label: '🟣 Pi Network',       ok: true  },
      ],
    },
    {
      av: 'QH', name: 'Anh Lê Quốc Hùng', trade: 'Thợ sơn & chống thấm', exp: '10 năm',
      price: '400.000đ/ngày', orders: 412, completeRate: 96, cancelRate: 4,
      thumbsUp: 96.8, bg: '#6B2F9E',
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '⭐ Chứng chỉ nghề',  ok: false },
        { label: '🟣 Pi Network',       ok: false },
      ],
    },
  ];
  const jobs = [
    { title: 'Cần thợ sửa máy lạnh tại nhà', desc: 'Máy lạnh Daikin 1.5HP không lạnh, cần vệ sinh và nạp gas.', price: '200.000đ', loc: 'Biên Hòa', icon: '❄️' },
    { title: 'Cần người mua hộ đồ ăn sáng', desc: 'Cần mua hộ 3 phần bánh mì + cà phê, giao tại tầng 8 chung cư Pegasus.', price: '20.000đ + tiền đồ', loc: 'Biên Hòa', icon: '🍖' },
    { title: 'Cần người chăm sóc mẹ tại bệnh viện', desc: 'Mẹ nằm viện Đồng Nai, cần người trông ca tối 18h-6h. 2 ngày/tuần.', price: '250.000đ/ca', loc: 'Biên Hòa', icon: '❤️' },
    { title: 'Cần vệ sinh căn hộ 2PN', desc: 'Vệ sinh toàn bộ căn hộ 65m2, dọn sau sửa chữa. Có sẵn dụng cụ.', price: '300.000đ', loc: 'Hố Nai', icon: '🧹' },
    { title: 'Cần thợ sơn nhà 3 phòng ngủ', desc: 'Sơn lại nội thất ~80m2, có sẵn sơn. Ưu tiên thợ làm cuối tuần.', price: 'Thỏa thuận', loc: 'Trảng Bom', icon: '🏠' },
    { title: 'Cần nhận hàng online hộ', desc: 'Hay đặt hàng online nhưng không có nhà ban ngày. Cần người nhận và giữ hộ.', price: '15.000đ/lần', loc: 'Hố Nai', icon: '📦' },
  ];
  const tabs = [
    { id: 'cv',      label: 'Đăng ký nghề cần việc' },
    { id: 'job',     label: 'Tin tìm thợ' },
    { id: 'shipper', label: 'Đăng ký nhận Shipper' },
  ];
  return (
    <div>
      <Shdr title="Dịch vụ & Việc làm" onBack={() => go('s-home')} />
      {/* 3 tab mới */}
      <div style={{ display: 'flex', background: '#f0ebfa', padding: 4, margin: '10px 12px 6px', borderRadius: 10, gap: 2 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, textAlign: 'center', padding: '7px 4px', borderRadius: 8, fontSize: 10, fontWeight: 500, cursor: 'pointer', border: 'none', background: tab === t.id ? C.w : 'none', color: tab === t.id ? C.p : C.m, lineHeight: 1.2 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1 — Đăng ký nghề cần việc */}
      {tab === 'cv' && (
        <div>
          <div style={{ position: 'relative', margin: '0 12px 10px' }}>
            <select style={{ width: '100%', background: C.w, border: `1.5px solid ${C.p}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: C.t, appearance: 'none', outline: 'none' }} value={nganh} onChange={e => setNganh(e.target.value)}>
              <option value="">-- Tất cả ngành nghề --</option>
              {NGANH_LIST.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: C.p, pointerEvents: 'none' }}>▾</span>
          </div>
          {nganh && (
            <div style={{ margin: '0 12px 10px' }}>
              <select style={{ width: '100%', background: C.pl, border: `1px solid ${C.b}`, borderRadius: 10, padding: '9px 14px', fontSize: 12, color: C.t, appearance: 'none', outline: 'none' }}>
                <option>-- Chọn nghề cụ thể --</option>
                {(NGHES[nganh] || []).map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px 12px' }}>
            {workers.map((w, i) => (
              <div key={i} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: '10px 12px' }}>

                {/* Hàng 1: Avatar + Tên + Giá + Nút */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontSize: 14, fontWeight: 700 }}>{w.av}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.t }}>{w.name}</span>
                      <span style={{ fontSize: 10, background: C.pl, color: C.pd, padding: '1px 6px', borderRadius: 8, flexShrink: 0 }}>
                        {w.orders >= 20 ? '🏅 Pro' : w.orders >= 5 ? '✅ Uy tín' : '🆕 Mới'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: C.m, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {w.trade} • {w.exp} • <span style={{ color: C.p, fontWeight: 600 }}>{w.price}</span>
                    </div>
                  </div>
                  <button onClick={() => chkLogin('s-chat-worker')}
                    style={{ background: C.p, color: '#fff', border: 'none', padding: '7px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                    💬 Liên hệ
                  </button>
                </div>

                {/* Hàng 2: Thống kê hoạt động */}
                <div style={{ fontSize: 11, color: C.m, marginBottom: 6, lineHeight: 1.6 }}>
                  <span style={{ color: C.t, fontWeight: 600 }}>{w.orders.toLocaleString('vi-VN')} lượt</span>
                  {' · '}
                  <span style={{ color: '#2e7d32', fontWeight: 600 }}>{w.completeRate}% hoàn thành</span>
                  {' · '}
                  <span style={{ color: C.pd, fontWeight: 600 }}>👍 {w.thumbsUp}% hài lòng</span>
                </div>

                {/* Hàng 3: Xác minh — ngang gọn */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {w.badges.map((b, j) => {
                    const isPi = b.label.includes('Pi');
                    const bg   = isPi ? '#f3e5f5' : b.ok ? '#e8f5e9' : '#ffebee';
                    const clr  = isPi ? '#6a1b9a' : b.ok ? '#2e7d32' : '#c62828';
                    const bdr  = isPi ? '#ce93d8' : b.ok ? '#c8e6c9' : '#ef9a9a';
                    return (
                      <span key={j} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 8, background: bg, border: `1px solid ${bdr}`, color: clr, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {b.label} {b.ok ? '✅' : '❌'}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '4px 12px 16px' }}>
            <Btn onClick={() => chkLogin('s-cv-register')}>➕ Đăng ký làm thợ / Freelancer</Btn>
          </div>
        </div>
      )}

      {/* Tab 2 — Tin tìm thợ */}
      {tab === 'job' && (
        <div style={{ paddingTop: 4 }}>
          {jobs.map((j, i) => (
            <div key={i} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 14, padding: 14, margin: '0 12px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{j.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.t, paddingRight: 8 }}>{j.title}</span>
                </div>
                <span style={{ fontSize: 10, background: C.pl, color: C.p, padding: '3px 8px', borderRadius: 10, whiteSpace: 'nowrap', flexShrink: 0 }}>Đang tìm</span>
              </div>
              <div style={{ fontSize: 12, color: C.m, marginBottom: 10, lineHeight: 1.5, paddingLeft: 28 }}>{j.desc}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingLeft: 28 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.p }}>{j.price}</span>
                <span style={{ fontSize: 11, color: C.m }}>📍 {j.loc}</span>
                <button style={{ background: C.p, color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }} onClick={() => chkLogin('s-chat-job')}>Nhận việc</button>
              </div>
            </div>
          ))}
          <div style={{ padding: '4px 12px 16px' }}>
            <Btn onClick={() => chkLogin('s-post')}>➕ Đăng tin tìm thợ</Btn>
          </div>
        </div>
      )}

      {/* Tab 3 — Đăng ký nhận Shipper */}
      {tab === 'shipper' && (
        <ShipperCommunityScreen go={go} chkLogin={chkLogin} />
      )}

      <div style={{ height: 80 }} />
    </div>
  );
}

// ─── POST SCREEN (Fix B: nhiều ảnh + Fix D: hình thức bán) ───────────
function PostScreen({ go, chkLogin }) {
  const [method, setMethod] = useState('both');
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [cat, setCat] = useState('');
  const emojis = ['📱','📦','🛋️','👕','🚗','❄️','🔧','🏡'];

  function addPhoto() {
    if (photos.length >= 8) { alert('Tối đa 8 ảnh'); return; }
    setPhotos(p => [...p, emojis[p.length % 8]]);
  }

  function previewPost() { go("s-preview-post"); }

  function submitPost() {
    if (method === 'direct') {
      go('s-direct');
    } else {
      go('s-post-success');
    }
  }

  return (
    <div>
      <Shdr title="Đăng tin bán" onBack={() => go('s-home')} />
      <div style={{ background: '#e8f5e9', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #c8e6c9' }}>
        <Avatar initials="KV" size={28} />
        <div><div style={{ fontSize: 11, fontWeight: 600, color: '#2e7d32' }}>Đăng tin với tư cách: SX-00001
					<div style={{ fontSize: 10, color: '#388e3c' }}>Lê Đăng Khoa (khoavinhcuu113) • Đã xác minh CCCD</div></div>
      </div>
      <div style={{ padding: 12 }}>
        {/* Fix B: Ảnh thêm được nhiều lần */}
        <Fg label="Ảnh sản phẩm" req>
          <div onClick={addPhoto} style={{ border: '2px dashed #c4a8e8', borderRadius: 12, padding: 14, textAlign: 'center', cursor: 'pointer', background: '#faf7ff' }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>📷</div>
            <p style={{ fontSize: 12, color: C.m }}>Bấm để thêm ảnh ({photos.length}/8)</p>
          </div>
          {photos.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 8 }}>
              {photos.map((e, i) => (
                <div key={i} style={{ background: C.pl, borderRadius: 8, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, position: 'relative' }}>
                  {e}
                  <button onClick={() => setPhotos(p => p.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -4, right: -4, background: '#e53935', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}>×</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 10, color: C.m, marginTop: 4 }}>Tối đa 8 ảnh • Ảnh thật của sản phẩm</div>
        </Fg>

        <Fg label="Clip giới thiệu sản phẩm">
          <VidPlaceholder title="Quay clip 15-30 giây" desc="Giới thiệu sản phẩm thực tế — sắp ra mắt" />
        </Fg>
        <Fg label="Tiêu đề" req><Fi value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: iPhone 13 Pro 256GB còn bảo hành" /></Fg>
        <Fg label="Danh mục" req>
          <Fs value={cat} onChange={e => setCat(e.target.value)}>
            <option value="">-- Chọn danh mục --</option>
            {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
          </Fs>
        </Fg>
        <Fg label="Tình trạng" req>
          <Fs><option>-- Chọn --</option><option>Mới (còn nguyên seal)</option><option>Như mới (99%)</option><option>Đã dùng (còn tốt)</option><option>Cần sửa chữa nhỏ</option></Fs>
        </Fg>
        <Fg label="Mô tả chi tiết" req>
          <textarea style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none', resize: 'none' }} rows={3} placeholder="Mô tả tình trạng thực tế..." />
        </Fg>
        <Fg label="Khuyết điểm" req>
          <textarea style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none', resize: 'none' }} rows={2} placeholder="Ghi rõ (nếu không có, ghi 'Không có')" />
        </Fg>
        <Fg label="Giá bán" req><Fi value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="VD: 5.000.000" /></Fg>

        <Fg label="Phương thức giao dịch" req>
          <div style={{ fontSize: 11, color: C.m, marginBottom: 8, background: C.pl, padding: '8px 10px', borderRadius: 8 }}>
            ℹ️ Chọn phương thức để người mua biết trước khi liên hệ. Shipper cụ thể sẽ được chọn trong chat sau khi có người mua.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              {
                val: 'direct',
                label: '🤝 Gặp trực tiếp',
                sub: '(app không can thiệp)',
                desc: 'Người mua và người bán tự gặp mặt thỏa thuận. ShopX không can thiệp vào giao dịch này.',
                color: '#f57f17', bg: '#fff8e1', border: '#ffe082'
              },
              {
                val: 'ship',
                label: '🚚 Giao hàng cộng đồng',
                sub: '(app bảo vệ ship)',
                desc: 'Dùng Shipper ShopX để giao hàng. Chat 3 bên, OTP, ảnh bằng chứng — bảo vệ phần giao hàng.',
                color: C.pd, bg: C.pl, border: C.b
              },
              {
                val: 'full',
                label: '🛡️ Giao dịch toàn phần',
                sub: '(bảo vệ tối đa)',
                desc: 'Tiền hàng giữ trong Escrow, chỉ chuyển cho người bán khi người mua xác nhận nhận hàng bằng OTP.',
                color: '#2e7d32', bg: '#e8f5e9', border: '#c8e6c9',
                disabled: true
              },
            ].map(m => (
              <label key={m.val} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, background: method === m.val ? m.bg : C.w, border: `${method === m.val ? '1.5px' : '1px'} solid ${method === m.val ? m.border : C.b}`, padding: '10px 12px', borderRadius: 10, cursor: m.disabled ? 'default' : 'pointer', opacity: m.disabled ? 0.7 : 1 }}>
                <input type="radio" name="method" checked={method === m.val} onChange={() => !m.disabled && setMethod(m.val)} disabled={m.disabled} style={{ accentColor: C.p, marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: method === m.val ? m.color : C.t }}>{m.label}</span>
                    <span style={{ fontSize: 10, color: C.m }}>{m.sub}</span>
                    {m.disabled && <span style={{ fontSize: 10, background: '#ccc', color: '#666', padding: '2px 6px', borderRadius: 8 }}>Sắp có</span>}
                  </div>
                  <div style={{ fontSize: 11, color: C.m, marginTop: 4, lineHeight: 1.4 }}>{m.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </Fg>

        <Btn onClick={previewPost} style={{ marginBottom: 8 }}>👁️ Xem trước tin đăng</Btn>
        
        <div style={{ height: 80 }} />
      </div>
      </div>
    </div>
  );
}
// ─── DIRECT SCREEN (Fix C: bỏ nút xem tin nhắn) ─────────────────────
function DirectScreen({ go }) {
  return (
    <div>
      <Shdr title="Gặp trực tiếp" onBack={() => go('s-post')} />
      <div style={{ padding: 12, paddingTop: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.t, marginBottom: 8 }}>Tin đăng đã lên ShopX!</div>
        <div style={{ fontSize: 13, color: C.m, marginBottom: 20, lineHeight: 1.6, textAlign: 'left', background: C.pl, padding: 14, borderRadius: 12 }}>
          <strong>Người mua sẽ liên hệ qua chat để thỏa thuận gặp trực tiếp.</strong><br /><br />
          ⚠️ ShopX không can thiệp vào giao dịch trực tiếp. Mọi thỏa thuận do 2 bên tự chịu trách nhiệm.<br /><br />
          💡 Lịch sử chat vẫn được lưu làm bằng chứng nếu có tranh chấp về sau.
        </div>
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 16, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 8 }}>📋 Lời khuyên giao dịch an toàn:</div>
          {['✅ Gặp ở nơi công cộng, ban ngày', '✅ Kiểm tra hàng kỹ trước khi trả tiền', '✅ Chụp ảnh hàng khi giao nhận', '✅ Không chuyển khoản trước khi nhận hàng'].map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: C.m, marginBottom: 4 }}>{t}</div>
          ))}
        </div>
        {/* Fix C: Chỉ có nút Về trang chủ — bỏ nút xem tin nhắn */}
        <Btn onClick={() => go('s-home')}>🏠 Về trang chủ</Btn>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

// ─── XEM TRƯỚC TIN ĐĂNG ──────────────────────────────────────────────
function PreviewPostScreen({ go }) {
  const methodInfo = {
    direct: { label: '🤝 Gặp trực tiếp', sub: '(app không can thiệp)', bg: '#fff8e1', color: '#f57f17' },
    ship:   { label: '🚚 Giao hàng cộng đồng', sub: '(app bảo vệ ship)', bg: C.pl, color: C.pd },
    full:   { label: '🛡️ Giao dịch toàn phần', sub: '(bảo vệ tối đa)', bg: '#e8f5e9', color: '#2e7d32' },
  };

  // Đọc data từ sessionStorage (nếu có) hoặc dùng mẫu
  let postData = { title: 'iPhone 13 Pro 256GB còn bảo hành', price: '5000000', cat: 'Đồ điện tử', method: 'ship', photos: 2 };
  try { const d = sessionStorage.getItem('postData'); if (d) postData = JSON.parse(d); } catch(e) {}

  const m = methodInfo[postData.method] || methodInfo.ship;
  const priceNum = parseInt(postData.price || 0);

  function confirmPost() {
    sessionStorage.removeItem('postData');
    if (postData.method === 'direct') {
      go('s-direct');
    } else {
      go('s-post-success');
    }
  }

  return (
    <div>
      <Shdr title="Xem trước tin đăng" onBack={() => go('s-post')} />

      {/* Banner xem trước */}
      <div style={{ background: '#fff3e0', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #ffe082' }}>
        <span style={{ fontSize: 16 }}>👁️</span>
        <div style={{ fontSize: 12, color: '#e65100' }}>
          Đây là tin đăng trông như thế nào với người mua. Chưa đăng lên — bấm xác nhận bên dưới để đăng.
        </div>
      </div>

      {/* Ảnh giả lập */}
      <div style={{ background: C.pl, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: 60 }}>
        📦
        <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 10 }}>
          {postData.photos}/8 ảnh
        </span>
      </div>

      <div style={{ padding: 12 }}>
        {/* Tiêu đề + giá */}
        <div style={{ fontSize: 16, fontWeight: 600, color: C.t, marginBottom: 4 }}>{postData.title}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.p, marginBottom: 8 }}>
          {priceNum > 0 ? priceNum.toLocaleString('vi-VN') + 'đ' : 'Chưa nhập giá'}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{ fontSize: 11, background: C.pl, color: C.pd, padding: '4px 10px', borderRadius: 10 }}>{postData.cat}</span>
          <span style={{ fontSize: 11, background: C.pl, color: C.pd, padding: '4px 10px', borderRadius: 10 }}>📍 Biên Hòa</span>
        </div>

        {/* Người bán */}
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: C.p, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontSize: 13, fontWeight: 700 }}>KV</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t }}>Khoavinhcuu113</div>
            <div style={{ fontSize: 11, color: C.m }}>Biên Hòa, Đồng Nai • SX-00001</div>
            <div style={{ fontSize: 11, color: C.p, marginTop: 2 }}>⭐ Mới đăng</div>
          </div>
        </div>

        {/* Phương thức */}
        <div style={{ background: m.bg, borderRadius: 10, padding: '10px 12px', marginBottom: 12, border: '1px solid #e8def8' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: m.color }}>
            {m.label} <span style={{ fontWeight: 400, fontSize: 11 }}>{m.sub}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#e8def8', margin: '12px 0' }} />

        {/* Nút hành động */}
        <div style={{ background: '#e8f5e9', borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32', marginBottom: 6 }}>✅ Tin đăng sẵn sàng</div>
          <div style={{ fontSize: 11, color: '#388e3c', marginBottom: 10 }}>
            Bấm "Xác nhận đăng tin" để tin xuất hiện trên ShopX và người mua có thể liên hệ bạn.
          </div>
          <Btn onClick={confirmPost}>🚀 Xác nhận đăng tin</Btn>
        </div>

        <Btn2 onClick={() => go('s-post')}>✏️ Chỉnh sửa lại</Btn2>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

// ─── POST SUCCESS ─────────────────────────────────────────────────────
function PostSuccessScreen({ go }) {
  return (
    <div>
      <Shdr title="Đăng tin thành công" />
      <div style={{ padding: 12, paddingTop: 32, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 36 }}>🎉</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.t, marginBottom: 6 }}>Tin đăng đã lên ShopX!</div>
        <div style={{ fontSize: 13, color: C.m, marginBottom: 20, lineHeight: 1.6 }}>
          Tin của bạn đã xuất hiện trên ShopX. Người mua có thể tìm thấy và liên hệ bạn ngay.
        </div>
        <div style={{ background: C.pl, borderRadius: 12, padding: 14, marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 8 }}>📋 Khi có người mua liên hệ:</div>
          {[
            '💬 Bạn nhận thông báo trong mục Tài khoản',
            '🔔 Bấm vào tin đăng có thông báo → vào chat',
            '🤝 2 bên thỏa thuận giá và hình thức giao',
            '🚚 Nếu dùng ship → người mua chọn Shipper ShopX',
          ].map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: C.t, marginBottom: 6 }}>{t}</div>
          ))}
        </div>
        <Btn onClick={() => go('s-home')}>🏠 Về trang chủ</Btn>
        <Btn2 onClick={() => go('s-post')}>➕ Đăng thêm tin khác</Btn2>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────
function LoginScreen({ go, doLogin }) {
  return (
    <div>
      <Shdr title="Đăng nhập" />
      <div style={{ padding: 12, paddingTop: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: C.p, marginBottom: 6 }}>ShopX</div>
          <div style={{ fontSize: 13, color: C.m }}>Đồng hành - Tiết kiệm - Cùng kiếm tiền</div>
        </div>
        <Fg label="Số điện thoại" req><Fi placeholder="0901234567" type="tel" /></Fg>
        <Fg label="Mật khẩu" req><Fi placeholder="Nhập mật khẩu" type="password" /></Fg>
        <div style={{ textAlign: 'right', marginBottom: 14 }}><span style={{ fontSize: 12, color: C.p, cursor: 'pointer' }}>Quên mật khẩu?</span></div>
        <Btn onClick={doLogin} style={{ marginBottom: 8 }}>Đăng nhập</Btn>
        <Btn2 onClick={doLogin}>🟣 Đăng nhập bằng Pi Network</Btn2>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: C.m }}>
          Chưa có tài khoản? <span style={{ color: C.p, cursor: 'pointer', fontWeight: 600 }} onClick={() => go('s-register')}>Đăng ký ngay</span>
        </div>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

// ─── ACCOUNT SCREEN (Fix A: chỉ hiện khi đã đăng nhập + Fix I: nhật ký tin đăng) ──
function AccountScreen({ go, nav, doLogout }) {
  const [accType, setAccType] = React.useState('personal');
  const listings = [
    { icon: '📱', title: 'iPhone 13 Pro 256GB còn BH', price: '18.500.000đ', date: '26/07/2026', hasMsg: true,  msgCount: 2 },
    { icon: '🏍️', title: 'Honda SH 125i 2021 đen bóng', price: '62.000.000đ', date: '25/07/2026', hasMsg: false, msgCount: 0 },
  ];
  return (
    <div>
      <Shdr title="Tài khoản của tôi" />
      <div style={{ padding: 12 }}>
        {/* Thông tin tài khoản */}
        <div style={{ background: C.w, padding: 12, borderRadius: 12, border: '1px solid #e8def8', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <Avatar initials="KV" size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.t }}>Khoavinhcuu113</div>
              <div style={{ fontSize: 12, color: C.m }}>SX-00001</div>
              <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 2 }}>⭐⭐⭐⭐⭐ 4.8 (34 đánh giá)</div>
            </div>
          </div>

          {/* Toggle Cá nhân / Doanh nghiệp */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.m, marginBottom: 6 }}>Loại tài khoản:</div>
            <div style={{ display: 'flex', background: '#f0ebfa', borderRadius: 10, padding: 3, gap: 3 }}>
              {[
                { val: 'personal', icon: '👤', label: 'Cá nhân' },
                { val: 'business', icon: '🏢', label: 'Doanh nghiệp' },
              ].map(t => (
                <button key={t.val} onClick={() => setAccType(t.val)}
                  style={{ flex: 1, padding: '7px 8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: accType === t.val ? 600 : 400, background: accType === t.val ? C.w : 'none', color: accType === t.val ? C.p : C.m, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
            {accType === 'business' && (
              <div style={{ background: '#e3f2fd', borderRadius: 10, padding: 12, marginTop: 8, border: '1px solid #bbdefb' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1565c0', marginBottom: 8 }}>🏢 Thông tin Doanh nghiệp</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#1565c0', marginBottom: 3 }}>Tên công ty / Cơ sở KD *</div>
                    <input placeholder="VD: Cửa hàng điện tử Minh Anh"
                      style={{ width: '100%', border: '1.5px solid #90caf9', borderRadius: 8, padding: '7px 10px', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#1565c0', marginBottom: 3 }}>Mã số thuế *</div>
                    <input placeholder="VD: 3602123456" maxLength={13}
                      style={{ width: '100%', border: '1.5px solid #90caf9', borderRadius: 8, padding: '7px 10px', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#1565c0', marginBottom: 3 }}>Địa chỉ kinh doanh *</div>
                    <input placeholder="VD: 45 Đồng Khởi, Biên Hòa, Đồng Nai"
                      style={{ width: '100%', border: '1.5px solid #90caf9', borderRadius: 8, padding: '7px 10px', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#1565c0', marginBottom: 3 }}>Ngành hàng chính *</div>
                    <select style={{ width: '100%', border: '1.5px solid #90caf9', borderRadius: 8, padding: '7px 10px', fontSize: 12, outline: 'none', background: '#fff' }}>
                      <option>-- Chọn ngành hàng --</option>
                      <option>Điện thoại & Phụ kiện</option>
                      <option>Máy tính & Laptop</option>
                      <option>Thời trang</option>
                      <option>Thực phẩm & Đồ uống</option>
                      <option>Nội thất & Gia dụng</option>
                      <option>Xe cộ & Phụ tùng</option>
                      <option>Dịch vụ</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#1565c0', marginBottom: 3 }}>Email DN</div>
                      <input placeholder="contact@company.vn" type="email"
                        style={{ width: '100%', border: '1.5px solid #bbdefb', borderRadius: 8, padding: '7px 10px', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#1565c0', marginBottom: 3 }}>Website</div>
                      <input placeholder="shopx.vn/store/..."
                        style={{ width: '100%', border: '1.5px solid #bbdefb', borderRadius: 8, padding: '7px 10px', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ background: '#fff3e0', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#e65100' }}>
                    ℹ️ ShopX xác minh MST qua Cổng ĐKKD quốc gia. Không cần upload giấy phép. Admin xét duyệt trong 24h.
                  </div>
                  <button style={{ background: '#1565c0', color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    📤 Gửi yêu cầu nâng cấp Doanh nghiệp
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Badge xác minh */}
          <div style={{ fontSize: 11, fontWeight: 600, color: C.m, marginBottom: 6 }}>Xác minh danh tính:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 11, background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: 10, fontWeight: 500 }}>✅ SĐT</span>
            <span style={{ fontSize: 11, background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: 10, fontWeight: 500 }}>🪪 Căn cước KYC</span>
            <span style={{ fontSize: 11, background: '#fff3e0', color: '#e65100', padding: '4px 10px', borderRadius: 10, fontWeight: 500 }}>🟣 Pi chưa xác minh</span>
          </div>

          {/* Nút xem gian hàng */}
          <button
            onClick={() => go('s-my-store')}
            style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            🏪 Xem gian hàng {accType === 'business' ? 'Doanh nghiệp' : 'Cá nhân'} của tôi
          </button>
        </div>

        {/* Uy tín — 3 tab: Người bán / Người mua / Shipper */}
        {(() => {
          const [activeTab, setActiveTab] = React.useState('seller');
          const sellerLevel  = getRatingLevel(SAMPLE_USER_RATINGS.seller.totalOrders,  SAMPLE_USER_RATINGS.seller.completionRate);
          const buyerLevel   = getRatingLevel(SAMPLE_USER_RATINGS.buyer.totalOrders,   SAMPLE_USER_RATINGS.buyer.receiveRate);
          const shipperLevel = getRatingLevel(SAMPLE_USER_RATINGS.shipper.totalOrders, SAMPLE_USER_RATINGS.shipper.onTimeRate);
          return (
            <div style={{ background: C.w, borderRadius: 12, border: '1px solid #e8def8', padding: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 8 }}>📊 Thống kê hoạt động</div>
              {/* Tabs */}
              <div style={{ display: 'flex', background: '#f0ebfa', padding: 3, borderRadius: 8, marginBottom: 10, gap: 3 }}>
                {[
                  { key: 'seller',  label: 'Người bán', level: sellerLevel  },
                  { key: 'buyer',   label: 'Người mua', level: buyerLevel   },
                  { key: 'shipper', label: 'Shipper',   level: shipperLevel },
                ].map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    style={{ flex: 1, padding: '6px 4px', borderRadius: 6, border: 'none', fontSize: 10, cursor: 'pointer', fontWeight: activeTab === t.key ? 600 : 400, background: activeTab === t.key ? C.w : 'none', color: activeTab === t.key ? C.p : C.m, lineHeight: 1.3, textAlign: 'center' }}>
                    {t.label}<br/>
                    <span style={{ fontSize: 9 }}>{t.level.label}</span>
                  </button>
                ))}
              </div>

              {/* Nội dung tab */}
              {activeTab === 'seller' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <RatingBadge orders={SAMPLE_USER_RATINGS.seller.totalOrders} rate={SAMPLE_USER_RATINGS.seller.completionRate} size="md" />
                    <div style={{ fontSize: 11, color: C.m }}>
                      Giao dịch {SAMPLE_USER_RATINGS.seller.totalOrders} ({SAMPLE_USER_RATINGS.seller.completionRate}%) · 👍 {SAMPLE_USER_RATINGS.seller.thumbsUp}%
                    </div>
                  </div>
                  <RatingStats role="seller" data={SAMPLE_USER_RATINGS.seller} />
                  {SAMPLE_USER_RATINGS.seller.disputes > 0 && (
                    <div style={{ background: '#fff3e0', borderRadius: 8, padding: '6px 10px', marginTop: 8, fontSize: 11, color: '#e65100' }}>
                      ⚠️ {SAMPLE_USER_RATINGS.seller.disputes} tranh chấp trong 30 ngày qua
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'buyer' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <RatingBadge orders={SAMPLE_USER_RATINGS.buyer.totalOrders} rate={SAMPLE_USER_RATINGS.buyer.receiveRate} size="md" />
                    <div style={{ fontSize: 11, color: C.m }}>
                      Đã mua {SAMPLE_USER_RATINGS.buyer.totalOrders} đơn · 👍 {SAMPLE_USER_RATINGS.buyer.thumbsUp}%
                    </div>
                  </div>
                  <RatingStats role="buyer" data={SAMPLE_USER_RATINGS.buyer} />
                </div>
              )}
              {activeTab === 'shipper' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <RatingBadge orders={SAMPLE_USER_RATINGS.shipper.totalOrders} rate={SAMPLE_USER_RATINGS.shipper.onTimeRate} size="md" />
                    <div style={{ fontSize: 11, color: C.m }}>
                      Đã giao {SAMPLE_USER_RATINGS.shipper.totalOrders} đơn · 👍 {SAMPLE_USER_RATINGS.shipper.thumbsUp}%
                    </div>
                  </div>
                  <RatingStats role="shipper" data={SAMPLE_USER_RATINGS.shipper} />
                </div>
              )}

              {/* Bảng ngưỡng hạng */}
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0ebfa' }}>
                <div style={{ fontSize: 11, color: C.m, marginBottom: 6 }}>Ngưỡng lên hạng:</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { label: '🆕 Mới',    desc: '0-4 đơn' },
                    { label: '✅ Uy tín', desc: '5+ • ≥90%' },
                    { label: '🏅 Pro',    desc: '20+ • ≥95%' },
                  ].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: C.pl, borderRadius: 8, padding: '6px 4px', textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.pd }}>{h.label}</div>
                      <div style={{ fontSize: 9, color: C.m, marginTop: 2 }}>{h.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* SX Points */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[{ val: '1.250', lbl: 'SX Points' }, { val: '96.2%', lbl: '👍 Tích cực', color: '#f59e0b' }].map((st, i) => (
            <div key={i} style={{ background: C.pl, borderRadius: 10, padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: st.color || C.p }}>{st.val}</div>
              <div style={{ fontSize: 10, color: C.m, marginTop: 2 }}>{st.lbl}</div>
            </div>
          ))}
        </div>

        {/* Cảnh báo đơn chưa cập nhật */}
        <div style={{ marginBottom: 10 }}>
          <ServiceOrderAlert hoursElapsed={25} status="waiting" />
        </div>

        {/* Đơn dịch vụ đang chờ */}
        <div style={{ background: C.w, borderRadius: 12, border: '1px solid #e8def8', padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 8 }}>🔨 Đơn dịch vụ đang chạy</div>
          <div style={{ background: '#e3f2fd', borderRadius: 10, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1565c0' }}>Sửa điện phòng ngủ</div>
              <div style={{ fontSize: 11, color: '#1976d2' }}>⏳ Chờ thợ đến • +25h</div>
            </div>
            <button onClick={() => go('s-service-order-hirer')}
              style={{ background: '#1565c0', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
              Xem đơn
            </button>
          </div>
        </div>
        {listings.map((l, i) => (
          <div key={i} style={{ background: C.w, border: `1.5px solid ${l.hasMsg ? C.p : '#e8def8'}`, borderRadius: 12, padding: 12, marginBottom: 8, display: 'flex', gap: 10, cursor: l.hasMsg ? 'pointer' : 'default' }}
            onClick={() => l.hasMsg && go('s-chat-buy')}>
            <div style={{ width: 48, height: 48, background: C.pl, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>{l.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 2 }}>{l.title}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.p, marginBottom: 2 }}>{l.price}</div>
              <div style={{ fontSize: 10, color: C.m }}>Đăng ngày {l.date}</div>
            </div>
            {l.hasMsg ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ background: '#e53935', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{l.msgCount}</div>
                <div style={{ fontSize: 10, color: C.p, fontWeight: 600 }}>Tin nhắn</div>
              </div>
            ) : (
              <div style={{ flexShrink: 0, fontSize: 10, color: C.m, alignSelf: 'center' }}>Chưa có tin</div>
            )}
          </div>
        ))}

        {/* Nhật ký giao dịch */}
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 8, marginTop: 8 }}>🧾 Nhật ký giao dịch</div>
        {[
          { icon: '📱', name: 'iPhone 12 Pro 128GB', date: '15/03/2026 • SX-00089', price: '15.500.000đ', badge: 'Đã nhận' },
          { icon: '🔧', name: 'Sửa điện phòng ngủ',  date: '10/06/2026 • SX-00127', price: '150.000đ',    badge: 'Hoàn thành' },
        ].map((tx, i) => (
          <div key={i} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 8, display: 'flex', gap: 10 }}>
            <div style={{ width: 48, height: 48, background: C.pl, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>{tx.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 2 }}>{tx.name}</div>
              <div style={{ fontSize: 10, color: C.m, marginBottom: 4 }}>{tx.date}</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.p }}>{tx.price}</span>
              <span style={{ fontSize: 10, background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: 8, marginLeft: 6 }}>{tx.badge}</span>
            </div>
          </div>
        ))}

        <Btn2 onClick={() => go('s-qr')} style={{ marginBottom: 8 }}>
          📱 QR Code gian hàng của tôi
        </Btn2>
        <Btn2 onClick={() => { go('s-home'); nav('ni-home'); }} style={{ marginBottom: 8 }}>🛍️ Tiếp tục mua sắm</Btn2>
        <button onClick={() => go('s-terms')} style={{ width: '100%', background: 'none', border: '1px solid #e0d4f7', color: C.m, padding: 10, borderRadius: 10, fontSize: 13, cursor: 'pointer', marginTop: 8 }}>📋 Quy chế & Điều khoản</button>
        <button onClick={doLogout} style={{ width: '100%', background: 'none', border: '1px solid #e0d4f7', color: C.m, padding: 10, borderRadius: 10, fontSize: 13, cursor: 'pointer', marginTop: 8 }}>🚪 Đăng xuất</button>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

// ─── REGISTER + PLEDGE ────────────────────────────────────────────────
function RegisterScreen({ go }) {
  const [role, setRole]       = useState(0);

  return (
    <div>
      <Shdr title="Tạo tài khoản" onBack={() => go('s-login')} />
      <div style={{ padding: 12 }}>

        {/* Vai trò chính */}
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 8 }}>Vai trò chính</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[['🛒','Người mua / bán'],['🚚','Shipper cộng đồng'],['🔨','Thợ / Freelancer'],['👥','Kết hợp nhiều vai trò']].map(([icon,lbl],i) => (
            <div key={i} onClick={() => setRole(i)}
              style={{ background: role===i?C.pl:C.w, border: `2px solid ${role===i?C.p:C.b}`, borderRadius: 12, padding: 12, cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
              <span style={{ fontSize: 12, fontWeight: 500, color: C.t }}>{lbl}</span>
            </div>
          ))}
        </div>

        {/* Thông tin cơ bản */}
        <Fg label="Họ và tên" req><Fi placeholder="Nhập họ và tên đầy đủ" /></Fg>
        <Fg label="Số điện thoại" req><Fi placeholder="0901234567" type="tel" /></Fg>
        <Fg label="Mật khẩu" req><Fi placeholder="Tối thiểu 8 ký tự" type="password" /></Fg>
        <Fg label="Khu vực" req>
          <Fs>
            <option>-- Chọn Tỉnh / Thành phố --</option>
            <option>Đồng Nai</option>
            <option>TP. Hồ Chí Minh</option>
            <option>Bình Dương</option>
          </Fs>
        </Fg>

        <div style={{ background: '#e8f5e9', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#2e7d32', marginBottom: 12 }}>
          ℹ️ Sau khi xác minh CCCD (KYC), bạn có thể nâng cấp lên tài khoản Doanh nghiệp bất cứ lúc nào trong mục Tài khoản.
        </div>

        <Btn onClick={() => go('s-pledge')}>Tiếp theo: Đọc cam kết ➡️</Btn>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

function PledgeScreen({ go, doLogin }) {
  const [ck1, setCk1] = useState(false);
  const [ck2, setCk2] = useState(false);
  return (
    <div>
      <Shdr title="Cam kết sử dụng" onBack={() => go('s-register')} />
      <div style={{ padding: 12 }}>
        <Infobox text="Kéo xuống đọc hết nội dung trước khi bấm Đồng ý." />
        <button onClick={() => go('s-terms')} style={{ background: 'none', border: 'none', color: C.p, fontSize: 12, cursor: 'pointer', textDecoration: 'underline', marginBottom: 8 }}>📋 Xem đầy đủ quy chế theo vai trò</button>
        <div style={{ background: C.pl, border: `1px solid ${C.b}`, borderRadius: 12, padding: 14, fontSize: 12, color: C.t, lineHeight: 1.7, maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: C.pd, marginBottom: 8 }}>CAM KẾT SỬ DỤNG DỊCH VỤ SHOPX</h3>
          <p><strong>Điều 1:</strong> Mô tả trung thực, ảnh thật, giá thật.</p>
          <p><strong>Điều 2:</strong> Không đăng tin giả, không bom hàng, chịu trách nhiệm giao dịch trực tiếp.</p>
          <p><strong>Điều 3:</strong> Chấp nhận ShopX lưu timestamp + IP + SĐT + CCCD, xuất PDF bằng chứng khi tranh chấp.</p>
          <p><strong>Điều 4:</strong> Vi phạm cam kết có thể bị khóa tài khoản vĩnh viễn.</p>
        </div>
        <Ckrow label="Tôi đã đọc hết và đồng ý với toàn bộ cam kết trên" checked={ck1} onChange={e => setCk1(e.target.checked)} />
        <Ckrow label="Tôi hiểu rằng vi phạm cam kết có thể bị khóa tài khoản vĩnh viễn" checked={ck2} onChange={e => setCk2(e.target.checked)} />
        <Btn onClick={() => { if(!ck1||!ck2){alert('Vui lòng tick chọn đồng ý với tất cả cam kết.');return;} doLogin(); }} style={{ marginTop: 8 }}>✅ Xác nhận & Tạo tài khoản</Btn>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────
export default function App() {
  const [screen,     setScreen]     = useState(() => {
    // F5: giữ lại màn hình hiện tại (trừ các màn cần login)
    const saved = sessionStorage.getItem('sx_screen');
    const noSave = ['s-login','s-register','s-pledge'];
    return (saved && !noSave.includes(saved)) ? saved : 's-home';
  });
  const [navActive,  setNavActive]  = useState(() => sessionStorage.getItem('sx_nav') || 'ni-home');
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('sx_login') === '1');
  const [showPopup,  setShowPopup]  = useState(false);
  const [pendingScr, setPendingScr] = useState('');

  const go  = (id) => {
    if (!id) return;
    setScreen(id);
    setShowPopup(false);
    sessionStorage.setItem('sx_screen', id);
  };
  const nav = (id) => {
    setNavActive(id);
    sessionStorage.setItem('sx_nav', id);
  };

  const chkLogin = (target) => {
    if (isLoggedIn) { go(target); }
    else { setPendingScr(target); setShowPopup(true); }
  };

  const doLogin = () => {
    setIsLoggedIn(true);
    setShowPopup(false);
    sessionStorage.setItem('sx_login', '1');
    go(pendingScr && pendingScr !== 's-login' ? pendingScr : 's-home');
    nav('ni-acc');
    setPendingScr('');
  };

  const doLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('sx_login');
    sessionStorage.removeItem('sx_screen');
    go('s-home');
    nav('ni-home');
  };

  // Fix A: Tài khoản chưa đăng nhập → redirect đến màn đăng nhập
  const goAccount = () => {
    if (isLoggedIn) { go('s-account'); nav('ni-acc'); }
    else { setPendingScr('s-account'); go('s-login'); nav('ni-acc'); }
  };

  const renderScreen = () => {
    switch (screen) {
      case 's-home':             return <HomeScreen             go={go} chkLogin={chkLogin} nav={nav} />;
      case 's-categories':       return <CategoriesScreen       go={go} nav={nav} />;
      case 's-prod1':            return <ProductScreen          go={go} chkLogin={chkLogin} type="p1" />;
      case 's-prod2':            return <ProductScreen          go={go} chkLogin={chkLogin} type="p2" />;
      case 's-chat-buy':         return <ChatScreen             go={go} type="buy" />;
      case 's-chat-job':         return <ChatScreen             go={go} type="job" />;
      case 's-chat-worker':      return <ChatScreen             go={go} type="worker" />;
      case 's-chat-3way':        return <Chat3WayScreen         go={go} />;
      case 's-service':          return <ServiceScreen          go={go} chkLogin={chkLogin} />;
      case 's-post':             return <PostScreen             go={go} chkLogin={chkLogin} />;
      case 's-preview-post':    return <PreviewPostScreen     go={go} />;
      case 's-direct':           return <DirectScreen           go={go} />;
      case 's-post-success':     return <PostSuccessScreen      go={go} />;
      case 's-delivery':         return <DeliveryScreen         go={go} chkLogin={chkLogin} />;
      case 's-login':            return <LoginScreen            go={go} doLogin={doLogin} />;
      case 's-account':          return <AccountScreen          go={go} nav={nav} doLogout={doLogout} />;
      case 's-register':         return <RegisterScreen         go={go} />;
      case 's-pledge':           return <PledgeScreen           go={go} doLogin={doLogin} />;
      case 's-notif':            return <NotifScreen            go={go} />;
      case 's-shipper-register': return <ShipperRegisterScreen  go={go} />;
      case 's-shipper-orders':  return <ShipperOrdersScreen  go={go} />;
      case 's-shipper-success':  return <ShipperSuccessScreen   go={go} />;
      case 's-rating':                  return <RatingScreen           go={go} />;
      case 's-terms':           return <TermsMenuScreen go={go} />;
      case 's-terms-buyer':   return <TermsScreen go={go} role="buyer" />;
      case 's-terms-shipper': return <TermsScreen go={go} role="shipper" />;
      case 's-terms-worker':  return <TermsScreen go={go} role="worker" />;
      case 's-terms-business':return <TermsScreen go={go} role="business" />;
      case 's-qr':                   return <QRScreen go={go} />;
      case 's-my-store':             return <StoreScreen go={go} chkLogin={chkLogin} isOwner={true} />;
      case 's-store-personal':       return <StoreScreen go={go} chkLogin={chkLogin} storeType="personal" />;
      case 's-store-business':       return <StoreScreen go={go} chkLogin={chkLogin} storeType="business" />;
      case 's-service-order-worker': return <ServiceOrderScreen go={go} role="worker" />;
      case 's-service-order-hirer':  return <ServiceOrderScreen go={go} role="hirer" />;
      case 's-cv-success':       return <CvSuccessScreen    go={go} />;
      case 's-cccd':             return <CccdScreen         go={go} />;
      case 's-cv-register':      return <CvRegisterScreen   go={go} />;
      default:                   return <HomeScreen             go={go} chkLogin={chkLogin} nav={nav} />;
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', background: C.w, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
          {renderScreen()}
        </div>
      </div>
      {/* Fix A: BottomNav dùng goAccount */}
      <nav style={{ background: C.w, borderTop: `1px solid ${C.b}`, display: 'flex', padding: '6px 0 2px', flexShrink: 0 }}>
        {[
          { id: 'ni-home', icon: '🏠', label: 'Trang chủ', action: () => { go('s-home'); nav('ni-home'); } },
          { id: 'ni-cat',  icon: '⊞',  label: 'Danh mục',  action: () => { go('s-categories'); nav('ni-cat'); } },
          { id: 'ni-post', icon: '➕',  label: 'Đăng tin',  action: () => { chkLogin('s-post'); nav('ni-post'); } },
          { id: 'ni-bell', icon: '🔔', label: 'Thông báo', action: () => { go('s-notif'); nav('ni-bell'); } },
          { id: 'ni-acc',  icon: '👤', label: 'Tài khoản', action: goAccount },
        ].map(it => (
          <button key={it.id} onClick={it.action} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', padding: 4, border: 'none', background: 'none', color: navActive === it.id ? C.p : C.m }}>
            <span style={{ fontSize: 20 }}>{it.icon}</span>
            <span style={{ fontSize: 10 }}>{it.label}</span>
          </button>
        ))}
      </nav>
      {showPopup && (
        <LoginPopup
          onLogin={doLogin}
          onRegister={() => { setShowPopup(false); go('s-register'); }}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
