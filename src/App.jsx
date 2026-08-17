import React, { useState } from 'react';
import { C, NGHES, NGANH_LIST, CATEGORIES, FREE_ORDERS_SELLER, calcPlatformFee } from './constants';
import { Shdr, Btn, Btn2, Fg, Fi, Fs, Sechdr, VidPlaceholder, Upbox, Warnbox, Infobox, Avatar, Badge, Ckrow, MaskedField } from './components/UI';
import BottomNav from './components/BottomNav';
import LoginPopup from './components/LoginPopup';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import DeliveryScreen from './screens/DeliveryScreen';
import Chat3WayScreen from './screens/Chat3WayScreen';
import NotifScreen from './screens/NotifScreen';
import ShipperRegisterScreen from './screens/ShipperRegisterScreen';
import ShipperOrdersScreen, { PENDING_ORDERS } from './screens/ShipperOrdersScreen';
import { RatingStats } from './screens/RatingScreen';
import StoreScreen from './screens/StoreScreen';
import QRScreen from './screens/QRScreen';
import TermsScreen, { TermsMenuScreen } from './screens/TermsScreen';
import ServiceOrderScreen, { ServiceOrderAlert } from './screens/ServiceOrderScreen';
import CvRegisterScreen, { CvSuccessScreen } from './screens/CvRegisterScreen';
import RatingScreen from './screens/RatingScreen';
import { SAMPLE_USER_RATINGS, getRatingLevel } from './constants';
import ShipperCommunityScreen, { ShipperSuccessScreen } from './screens/ShipperScreens';

// ─── CATEGORIES SCREEN ───────────────────────────────────────────────
// Ánh xạ đúng từng danh mục (theo thứ tự CATEGORIES trong constants.js) tới màn tương ứng.
// 3 danh mục dịch vụ (nội khu, chăm sóc người thân, vệ sinh) dẫn vào Dịch vụ & Việc làm, không tạo sản phẩm giả.
const CATEGORY_ROUTES = [
  's-prod3',   // Bất động sản
  's-prod2',   // Xe cộ
  's-prod1',   // Đồ điện tử
  's-service', // Dịch vụ & Việc làm
  's-service', // Dịch vụ làm thuê bán thời gian
  's-service', // Chăm sóc người thân
  's-service', // Vệ sinh & Giặt ủi
  's-prod4',   // Thú cưng
  's-prod5',   // Đồ ăn & Thực phẩm
  's-prod6',   // Tủ lạnh, máy lạnh, máy giặt
  's-prod7',   // Đồ gia dụng & Nội thất
  's-prod8',   // Mẹ và bé
  's-prod9',   // Thời trang & Đồ dùng cá nhân
  's-prod10',  // Giải trí & Thể thao
  's-prod11',  // Văn phòng & Nông nghiệp
];
// Nhóm sản phẩm dùng tên cat con chi tiết hơn (VD: gian hàng Minh Anh) — cần khớp về đúng 1 danh mục chính thức khi lọc/gợi ý
const CATEGORY_SUBCATS = {
  'Đồ điện tử': ['Đồ điện tử', 'Điện thoại', 'Laptop', 'Phụ kiện', 'Đồng hồ'],
};
// Tìm đúng "nhóm chính thức" mà 1 tên danh mục bất kỳ (kể cả tên nhóm con) thuộc về — để so khớp đối xứng 2 chiều
function getCategoryGroup(cat) {
  if (CATEGORY_SUBCATS[cat]) return cat; // chính nó đã là nhóm chính thức
  for (const [official, subs] of Object.entries(CATEGORY_SUBCATS)) {
    if (subs.includes(cat)) return official;
  }
  return cat; // không thuộc nhóm đặc biệt nào, coi như tự nó là 1 nhóm
}
function matchesCategory(catA, catB) {
  return getCategoryGroup(catA) === getCategoryGroup(catB);
}
function CategoriesScreen({ go, nav }) {
  // Tách 2 nhóm dựa trên chính CATEGORY_ROUTES đã có — route 's-service' = Dịch vụ, còn lại = Sản phẩm
  const productItems = CATEGORIES.map((c, i) => ({ ...c, route: CATEGORY_ROUTES[i] })).filter(c => c.route !== 's-service');
  const serviceItems = CATEGORIES.map((c, i) => ({ ...c, route: CATEGORY_ROUTES[i] })).filter(c => c.route === 's-service');
  // Tên danh mục dịch vụ → đúng mã ngành trong NGANH_LIST, để bấm vào là lọc sẵn luôn, không phải chọn lại
  const CATEGORY_TO_NGANH = {
    'Dịch vụ làm thuê bán thời gian': 'noikhu',
    'Chăm sóc người thân': 'chamsoc',
    'Vệ sinh & Giặt ủi': 'vesinhgiatre',
  };

  function renderGrid(items, iconBg) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map((c, i) => (
          <div key={i} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 14, padding: '14px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={() => {
              if (c.route === 's-service') {
                sessionStorage.setItem('sx_service_initial_tab', 'cv');
                if (CATEGORY_TO_NGANH[c.name]) sessionStorage.setItem('sx_service_initial_nganh', CATEGORY_TO_NGANH[c.name]);
                else sessionStorage.removeItem('sx_service_initial_nganh');
                go('s-service');
              } else {
                sessionStorage.setItem('sx_listing_filter_cat', c.name);
                go('s-all-listings');
              }
            }}>
            <div style={{ width: 44, height: 44, background: iconBg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>{c.icon}</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.t, lineHeight: 1.3 }}>{c.name}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <Shdr title="Tất cả danh mục" onBack={() => { go('s-home'); nav('ni-home'); }} />
      <div style={{ padding: 12 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 15 }}>🛍️</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.t }}>Sản phẩm</span>
          <span style={{ fontSize: 11, color: C.m }}>({productItems.length} danh mục)</span>
        </div>
        {renderGrid(productItems, C.pl)}

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '20px 0 10px' }}>
          <span style={{ fontSize: 15 }}>🔧</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.t }}>Dịch vụ</span>
          <span style={{ fontSize: 11, color: C.m }}>({serviceItems.length} danh mục)</span>
        </div>
        {renderGrid(serviceItems, '#e3f2fd')}

      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}

// ─── DỮ LIỆU SẢN PHẨM DÙNG CHUNG (ProductScreen + AllListingsScreen) ──
// ─── BÁO CÁO TIN ĐĂNG — lưu lại để theo dõi ở màn "Báo cáo của tôi" ──
function getReports() {
  try { return JSON.parse(sessionStorage.getItem('sx_reports') || '[]'); } catch (e) { return []; }
}
function saveReport(report) {
  const reports = getReports();
  reports.unshift({ id: `RP-${Date.now().toString().slice(-6)}`, time: new Date().toLocaleString('vi-VN'), status: 'pending', ...report });
  sessionStorage.setItem('sx_reports', JSON.stringify(reports));
}

// ─── GIỎ HÀNG — hàm dùng chung, lưu qua sessionStorage, giới hạn 30 sản phẩm ──
function getCart() {
  try { return JSON.parse(sessionStorage.getItem('sx_cart') || '[]'); } catch (e) { return []; }
}
function saveCart(cart) {
  sessionStorage.setItem('sx_cart', JSON.stringify(cart));
}
function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(c => c.productId === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    if (cart.length >= 30) { alert('Giỏ hàng đã đầy (tối đa 30 sản phẩm khác nhau).'); return false; }
    cart.push({ productId, qty: 1 });
  }
  saveCart(cart);
  // Demo: nếu sản phẩm đang có Chiến dịch KOL đang chạy, cộng thêm 1 lượt "Thêm giỏ hàng" cho đúng KOL đó (chỉ trong phiên demo này)
  const p = PRODUCT_DATA[productId];
  if (p) {
    const kolLive = (() => { try { return JSON.parse(sessionStorage.getItem('sx_kol_live_carts') || '{}'); } catch (e) { return {}; } })();
    KOL_PRODUCT_LINKS.forEach(link => {
      if (link.productId === productId) {
        kolLive[link.contractId] = (kolLive[link.contractId] || 0) + 1;
      }
    });
    sessionStorage.setItem('sx_kol_live_carts', JSON.stringify(kolLive));
  }
  return true;
}
// Đối chiếu gần đúng tên sản phẩm trong hợp đồng KOL với danh mục sản phẩm thật — chỉ nối khi khớp
const KOL_PRODUCT_LINKS = [
  { contractId: 'c1', productId: 'p7' },
  { contractId: 'c2', productId: 'p6' },
  { contractId: 'c3', productId: 'p10' },
  { contractId: 'c4', productId: 'p1' },
];

// Follower theo mã SX — PHẢI khớp đúng số ghi trong badge hồ sơ CV (ServiceScreen.workers) để không lệch 2 nguồn
const KOL_FOLLOWERS_BY_ID = { 'SX-00203': 12500, 'SX-00204': 15000, 'SX-00205': 3500, 'SX-00206': 600 };
function kolLabel(kolId) {
  const f = KOL_FOLLOWERS_BY_ID[kolId] || 0;
  return f >= 1000 ? 'KOL' : 'KOC';
}
function fmtFollowers(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;
}

const PRODUCT_DATA = {
    p1:  { icon: '📱', imgs: ['📱','📦','🔌','🔋','📸','✅'], bg: C.pl, title: 'iPhone 13 Pro 256GB — Sierra Blue', price: '18.500.000đ', cond: 'Như mới (99%)', loc: 'Biên Hòa', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.8 • 34 giao dịch', desc: 'iPhone 13 Pro 256GB Sierra Blue, mua 3/2024, còn BH Apple đến 3/2025. Nguyên zin 100%, pin 89%.', defect: 'Vết xước nhỏ góc trên bên phải khung máy.', count: '1/6 ảnh', cat: 'Đồ điện tử', shippable: true, hasVideo: true },
    p2:  { icon: '🏍️', imgs: ['🏍️','🔑','🪪','📋','🛞','⛽','🔧','✅'], bg: '#e8def8', title: 'Honda SH 125i 2021 — Đen bóng láng', price: '62.000.000đ', cond: 'Đã dùng (còn tốt)', loc: 'Long Khánh', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.9 • 67 giao dịch', desc: 'SH 125i 2021 đen bóng, 12.000km, bảo dưỡng định kỳ, giấy tờ đầy đủ, sang tên ngay.', defect: 'Không có', count: '1/8 ảnh', cat: 'Xe cộ', shippable: true },
    p3:  { icon: '🏢', imgs: ['🏢','🛏️','🚪','🚽','🅿️'], bg: '#e0f2f1', title: 'Phòng trọ có gác lửng, gần KCN Biên Hòa 2', price: '2.500.000đ/tháng', cond: 'Đang cho thuê', loc: 'Biên Hòa', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.7 • 12 giao dịch', desc: 'Phòng 25m², có gác lửng, WC riêng, chỗ để xe, gần KCN Biên Hòa 2, an ninh khu vực tốt.', defect: 'Không có', count: '1/5 ảnh', cat: 'Bất động sản', shippable: false },
    p4:  { icon: '🐾', imgs: ['🐾','🐕','💉','📋'], bg: '#fff3e0', title: 'Chó Poodle Tiny 2 tháng tuổi, đã tiêm phòng', price: '4.500.000đ', cond: 'Khỏe mạnh, đã tiêm phòng', loc: 'Biên Hòa', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.8 • 9 giao dịch', desc: 'Poodle Tiny lông xoăn màu socola, 2 tháng tuổi, đã tiêm phòng mũi 1, có sổ khám thú y.', defect: 'Không có', count: '1/4 ảnh', cat: 'Thú cưng', shippable: true },
    p5:  { icon: '🍖', imgs: ['🍖','📦','🎁'], bg: '#fce4ec', title: 'Bánh Trung Thu thủ công thập cẩm hộp 4 cái', price: '180.000đ', cond: 'Mới làm trong ngày', loc: 'Hố Nai', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.9 • 56 giao dịch', desc: 'Bánh trung thu thập cẩm nhà làm, không chất bảo quản, đặt trước 1 ngày.', defect: 'Không có', count: '1/3 ảnh', cat: 'Đồ ăn & Thực phẩm', shippable: true },
    p6:  { icon: '❄️', imgs: ['❄️','🚪','🔌','📏','✅'], bg: '#e3f2fd', title: 'Tủ lạnh Samsung Inverter 236L', price: '4.200.000đ', cond: 'Đã dùng (còn tốt 90%)', loc: 'Biên Hòa', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.7 • 21 giao dịch', desc: 'Tủ lạnh Samsung Inverter 236L, 2 cánh, làm lạnh tốt, tiết kiệm điện, dùng 2 năm.', defect: 'Trầy nhẹ mặt trước.', count: '1/5 ảnh', cat: 'Tủ lạnh, máy lạnh, máy giặt', shippable: true },
    p7:  { icon: '🛋️', imgs: ['🛋️','🪑','📏','🎨','✅','📦'], bg: '#f3e5f5', title: 'Bàn ăn gỗ sồi 6 ghế', price: '3.500.000đ', cond: 'Như mới (95%)', loc: 'Trảng Bom', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.8 • 15 giao dịch', desc: 'Bàn ăn gỗ sồi tự nhiên, kèm 6 ghế bọc nệm, phong cách hiện đại, không mối mọt.', defect: 'Không có', count: '1/6 ảnh', cat: 'Đồ gia dụng & Nội thất', shippable: true },
    p8:  { icon: '👶', imgs: ['👶','🛞','☂️','✅'], bg: '#e8f5e9', title: 'Xe đẩy em bé Fatboy gấp gọn', price: '1.800.000đ', cond: 'Đã dùng (còn tốt 85%)', loc: 'Biên Hòa', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.9 • 18 giao dịch', desc: 'Xe đẩy Fatboy gấp gọn 1 tay, có mái che, giỏ đựng đồ rộng, phù hợp bé 0-3 tuổi.', defect: 'Bánh sau hơi mòn.', count: '1/4 ảnh', cat: 'Mẹ và bé', shippable: true },
    p9:  { icon: '👕', imgs: ['👕','🎀','🔒','✅','📦'], bg: '#fff8e1', title: 'Túi xách da thật hàng hiệu', price: '850.000đ', cond: 'Như mới (98%)', loc: 'Biên Hòa', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.8 • 27 giao dịch', desc: 'Túi xách da bò thật, khóa kim loại chắc chắn, ít sử dụng, còn nguyên hộp.', defect: 'Không có', count: '1/5 ảnh', cat: 'Thời trang & Đồ dùng cá nhân', shippable: true },
    p10: { icon: '🚲', imgs: ['🚲','⚙️','🛞','🔧','📏','✅'], bg: '#e0f7fa', title: 'Xe đạp Trek FX3 2022', price: '8.200.000đ', cond: 'Đã dùng (còn tốt 90%)', loc: 'Trảng Bom', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.9 • 11 giao dịch', desc: 'Xe đạp Trek FX3 2022, khung nhôm nhẹ, phù hợp đi làm/tập thể dục, bảo dưỡng định kỳ.', defect: 'Không có', count: '1/6 ảnh', cat: 'Giải trí & Thể thao', shippable: true },
    p11: { icon: '🚜', imgs: ['🚜','🔌','📄','✅'], bg: '#efebe9', title: 'Máy in Canon LBP2900 còn mới', price: '1.200.000đ', cond: 'Như mới (95%)', loc: 'Biên Hòa', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.7 • 8 giao dịch', desc: 'Máy in Canon LBP2900, in laser đen trắng, tốc độ nhanh, còn hộp mực gần đầy.', defect: 'Không có', count: '1/4 ảnh', cat: 'Văn phòng & Nông nghiệp', shippable: true },
    p12: { icon: '📱', imgs: ['📱','📦','🔌','🔋','📸','✅'], bg: C.pl, title: 'iPhone 15 Pro 256GB', price: '28.500.000đ', cond: 'Mới 100%, nguyên seal', loc: 'Biên Hòa', av: 'MA', seller: 'Cửa hàng Điện tử Minh Anh', stats: '⭐ 4.9 • 1.248 giao dịch', desc: 'iPhone 15 Pro 256GB chính hãng VN/A, nguyên seal, bảo hành 12 tháng tại cửa hàng.', defect: 'Không có', count: '1/6 ảnh', cat: 'Điện thoại', shippable: true, storeRoute: 's-store-business' },
    p13: { icon: '📱', imgs: ['📱','📦','🔌','🔋','📸','✅'], bg: C.pl, title: 'Samsung S24 Ultra 256GB', price: '22.900.000đ', cond: 'Mới 100%, nguyên seal', loc: 'Biên Hòa', av: 'MA', seller: 'Cửa hàng Điện tử Minh Anh', stats: '⭐ 4.9 • 1.248 giao dịch', desc: 'Samsung S24 Ultra 256GB chính hãng, nguyên seal, bảo hành 12 tháng tại cửa hàng.', defect: 'Không có', count: '1/6 ảnh', cat: 'Điện thoại', shippable: true, storeRoute: 's-store-business' },
    p14: { icon: '💻', imgs: ['💻','📦','🔌','⌨️','✅'], bg: '#e3f2fd', title: 'MacBook Air M2 8GB/256GB', price: '26.990.000đ', cond: 'Mới 100%, nguyên seal', loc: 'Biên Hòa', av: 'MA', seller: 'Cửa hàng Điện tử Minh Anh', stats: '⭐ 4.9 • 1.248 giao dịch', desc: 'MacBook Air M2 8GB/256GB chính hãng, nguyên seal, bảo hành 12 tháng tại cửa hàng.', defect: 'Không có', count: '1/5 ảnh', cat: 'Laptop', shippable: true, storeRoute: 's-store-business' },
    p15: { icon: '🎧', imgs: ['🎧','📦','🔋','✅'], bg: '#f3e5f5', title: 'AirPods Pro 2nd Gen', price: '5.490.000đ', cond: 'Mới 100%, nguyên seal', loc: 'Biên Hòa', av: 'MA', seller: 'Cửa hàng Điện tử Minh Anh', stats: '⭐ 4.9 • 1.248 giao dịch', desc: 'AirPods Pro thế hệ 2 chính hãng, nguyên seal, bảo hành 12 tháng tại cửa hàng.', defect: 'Không có', count: '1/4 ảnh', cat: 'Phụ kiện', shippable: true, storeRoute: 's-store-business' },
    p16: { icon: '⌚', imgs: ['⌚','📦','🔋','✅'], bg: '#fff8e1', title: 'Apple Watch Series 9', price: '9.990.000đ', cond: 'Mới 100%, nguyên seal', loc: 'Biên Hòa', av: 'MA', seller: 'Cửa hàng Điện tử Minh Anh', stats: '⭐ 4.9 • 1.248 giao dịch', desc: 'Apple Watch Series 9 chính hãng, nguyên seal, bảo hành 12 tháng tại cửa hàng.', defect: 'Tạm hết hàng, có thể đặt trước.', count: '1/4 ảnh', cat: 'Đồng hồ', shippable: false, storeRoute: 's-store-business' },
    p17: { icon: '🎧', imgs: ['🎧','📦','🔋'], bg: '#e8f5e9', title: 'Tai nghe Bluetooth JBL Tune 510BT', price: '890.000đ', cond: 'Đã dùng (còn tốt)', loc: 'Biên Hòa', av: 'TT', seller: 'Anh Trần Minh Tuấn', stats: '⭐ 4.8 • 34 giao dịch', desc: 'Tai nghe chụp tai không dây, tương thích mọi hệ điều hành (Android/iOS), pin 40h, dùng 6 tháng còn bảo hành.', defect: 'Đệm tai hơi mòn nhẹ.', count: '1/3 ảnh', cat: 'Phụ kiện', shippable: true, storeRoute: 's-store-personal' },
};

// ─── TẤT CẢ TIN ĐĂNG — danh sách phẳng toàn bộ sản phẩm ───────────────
function AllListingsScreen({ go }) {
  const filterCat = sessionStorage.getItem('sx_listing_filter_cat') || '';
  sessionStorage.removeItem('sx_listing_filter_cat');
  const items = Object.entries(PRODUCT_DATA).filter(([, p]) => !filterCat || matchesCategory(p.cat, filterCat));
  return (
    <div>
      <Shdr title={filterCat ? `${filterCat} (${items.length})` : `Tất cả tin đăng (${items.length})`} onBack={() => go('s-home')} />
      {items.length === 0 && (
        <div style={{ padding: 30, textAlign: 'center', color: C.m, fontSize: 12 }}>Chưa có tin đăng nào trong danh mục này.</div>
      )}
      <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map(([id, p]) => (
          <div key={id} onClick={() => { sessionStorage.setItem('sx_product_return', 's-all-listings'); go(`s-prod${id.slice(1)}`); }}
            style={{ background: C.w, borderRadius: 12, overflow: 'hidden', border: '1px solid #e8def8', cursor: 'pointer' }}>
            <div style={{ width: '100%', height: 80, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{p.icon}</div>
            <div style={{ padding: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: C.t, marginBottom: 2, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.p, marginBottom: 2 }}>{p.price}</div>
              <div style={{ fontSize: 10, color: C.m }}>📍 {p.loc} · {p.seller}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}

// ─── PRODUCT SCREEN ───────────────────────────────────────────────────
// ─── TÌM KIẾM SẢN PHẨM ─────────────────────────────────────────────
// Chuẩn hóa bỏ dấu tiếng Việt để tìm kiếm không phân biệt có dấu/không dấu
function removeAccents(str) {
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

// ─── GIỎ HÀNG — nhóm theo người bán, tự tách đơn khi đặt hàng (đúng chuẩn Shopee) ──
function CartScreen({ go }) {
  const [cart, setCartState] = useState(getCart());
  const returnTo = sessionStorage.getItem('sx_cart_return') || 's-home';

  function updateQty(productId, delta) {
    const next = cart.map(c => c.productId === productId ? { ...c, qty: Math.max(1, c.qty + delta) } : c);
    setCartState(next);
    saveCart(next);
  }
  function removeItem(productId) {
    const next = cart.filter(c => c.productId !== productId);
    setCartState(next);
    saveCart(next);
  }

  const items = cart.map(c => ({ ...c, p: PRODUCT_DATA[c.productId] })).filter(i => i.p);
  // Nhóm theo người bán — đúng logic Shopee: mỗi người bán tách thành 1 đơn giao riêng
  const groups = {};
  items.forEach(i => {
    if (!groups[i.p.seller]) groups[i.p.seller] = { seller: i.p.seller, items: [], subtotal: 0 };
    const price = parseInt(i.p.price.replace(/\D/g, '')) || 0;
    groups[i.p.seller].items.push(i);
    groups[i.p.seller].subtotal += price * i.qty;
  });
  const groupList = Object.values(groups);
  const grandTotal = groupList.reduce((s, g) => s + g.subtotal, 0);
  const fmt = n => n.toLocaleString('vi-VN') + 'đ';

  function checkout() {
    if (groupList.length === 0) return;
    // Lưu danh sách đơn cần tách để màn xác nhận xử lý tiếp
    sessionStorage.setItem('sx_checkout_groups', JSON.stringify(groupList.map(g => ({
      seller: g.seller,
      subtotal: g.subtotal,
      titles: g.items.map(i => `${i.p.title} x${i.qty}`),
      icon: g.items[0].p.icon,
    }))));
    go('s-checkout-split');
  }

  if (items.length === 0) {
    return (
      <div>
        <Shdr title="Giỏ hàng" onBack={() => go(returnTo)} />
        <div style={{ padding: 30, textAlign: 'center', color: C.m }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🛒</div>
          <div style={{ fontSize: 13 }}>Giỏ hàng đang trống</div>
          <Btn onClick={() => go('s-categories')} style={{ marginTop: 16 }}>Bắt đầu mua sắm</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Shdr title={`Giỏ hàng (${items.reduce((s, i) => s + i.qty, 0)}/30)`} onBack={() => go(returnTo)} />
      <div style={{ padding: 12 }}>
        {groupList.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.pd, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              🏪 {g.seller} <span style={{ fontSize: 10, color: C.m, fontWeight: 400 }}>(1 đơn giao riêng)</span>
            </div>
            {g.items.map(i => (
              <div key={i.productId} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 10, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 48, height: 48, background: i.p.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{i.p.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.t, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.p.title}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.p }}>{i.p.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => updateQty(i.productId, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${C.b}`, background: '#fff', cursor: 'pointer', fontSize: 14 }}>−</button>
                  <span style={{ fontSize: 12, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{i.qty}</span>
                  <button onClick={() => updateQty(i.productId, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${C.b}`, background: '#fff', cursor: 'pointer', fontSize: 14 }}>+</button>
                </div>
                <button onClick={() => removeItem(i.productId)} style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>🗑️</button>
              </div>
            ))}
            <div style={{ textAlign: 'right', fontSize: 11, color: C.m }}>Tạm tính: <span style={{ fontWeight: 700, color: C.t }}>{fmt(g.subtotal)}</span></div>
          </div>
        ))}

        {groupList.length > 1 && (
          <Infobox text={`Giỏ hàng có ${groupList.length} người bán khác nhau → sẽ tự động tách thành ${groupList.length} đơn giao riêng biệt khi đặt hàng.`} />
        )}

        <div style={{ background: C.pl, borderRadius: 12, padding: 14, marginTop: 10, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.t }}>Tổng cộng ({groupList.length} đơn)</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.p }}>{fmt(grandTotal)}</span>
          </div>
        </div>

        <Btn onClick={checkout}>➤ Đặt hàng</Btn>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

// ─── XÁC NHẬN TÁCH ĐƠN — hiện rõ giỏ hàng tách thành mấy đơn giao riêng ──
function CheckoutSplitScreen({ go }) {
  const groups = (() => {
    try { return JSON.parse(sessionStorage.getItem('sx_checkout_groups') || '[]'); } catch (e) { return []; }
  })();
  const fmt = n => n.toLocaleString('vi-VN') + 'đ';

  function startGroupDelivery(g, idx) {
    // Xóa đúng phần đã xử lý khỏi giỏ hàng thật (theo đúng người bán này)
    const cart = getCart();
    const remaining = cart.filter(c => {
      const p = PRODUCT_DATA[c.productId];
      return !(p && p.seller === g.seller);
    });
    saveCart(remaining);
    sessionStorage.setItem('sx_order_product', JSON.stringify({ title: g.titles.join(', '), price: fmt(g.subtotal), seller: g.seller, icon: g.icon }));
    sessionStorage.setItem('sx_product_return', 's-checkout-split');
    // Cập nhật lại hàng đợi các đơn còn lại
    const rest = groups.filter((_, i) => i !== idx);
    sessionStorage.setItem('sx_checkout_groups', JSON.stringify(rest));
    go('s-delivery');
  }

  if (groups.length === 0) {
    return (
      <div>
        <Shdr title="Đặt hàng" onBack={() => go('s-cart')} />
        <div style={{ padding: 30, textAlign: 'center', color: C.m, fontSize: 13 }}>Không còn đơn nào cần xử lý.</div>
        <div style={{ padding: 12 }}><Btn onClick={() => go('s-home')}>Về trang chủ</Btn></div>
      </div>
    );
  }

  return (
    <div>
      <Shdr title={`Đặt hàng — ${groups.length} đơn cần xử lý`} onBack={() => go('s-cart')} />
      <div style={{ padding: 12 }}>
        <Infobox text="Mỗi người bán là 1 đơn giao riêng biệt (đúng chuẩn Shopee/Lazada) — vì mỗi người đóng gói ở 1 địa điểm khác nhau, không thể gộp chung 1 chuyến giao." />
        {groups.map((g, i) => (
          <div key={i} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.pd, marginBottom: 6 }}>🏪 Đơn {i + 1}: {g.seller}</div>
            <div style={{ fontSize: 11, color: C.m, marginBottom: 6 }}>{g.titles.join(', ')}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.p, marginBottom: 10 }}>{fmt(g.subtotal)}</div>
            <Btn onClick={() => startGroupDelivery(g, i)}>🚚 Bắt đầu đơn này ({i + 1}/{groups.length})</Btn>
          </div>
        ))}
        <div style={{ fontSize: 10, color: C.m, textAlign: 'center', marginTop: 4 }}>
          Xử lý xong 1 đơn sẽ tự động quay lại đây để tiếp tục đơn kế tiếp.
        </div>
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}

function SearchScreen({ go }) {
  const [q, setQ] = useState('');
  const items = Object.entries(PRODUCT_DATA);
  const query = removeAccents(q.trim().toLowerCase());
  const results = query
    ? items.filter(([, p]) =>
        removeAccents(p.title.toLowerCase()).includes(query) ||
        removeAccents(p.cat.toLowerCase()).includes(query) ||
        removeAccents(p.seller.toLowerCase()).includes(query))
    : [];

  return (
    <div>
      <div style={{ background: C.p, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => go('s-home')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', padding: 4 }}>←</button>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>🔍</span>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm sản phẩm, danh mục, người bán..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 13 }} />
          {q && (
            <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: 14 }}>✕</button>
          )}
        </div>
      </div>

      <div style={{ padding: 12 }}>
        {!query && (
          <div style={{ textAlign: 'center', color: C.m, fontSize: 12, padding: '30px 0' }}>
            Gõ tên sản phẩm, danh mục hoặc người bán để tìm kiếm
          </div>
        )}
        {query && results.length === 0 && (
          <div style={{ textAlign: 'center', color: C.m, fontSize: 12, padding: '30px 0' }}>
            😕 Không tìm thấy kết quả nào cho "{q}"
          </div>
        )}
        {query && results.length > 0 && (
          <>
            <div style={{ fontSize: 11, color: C.m, marginBottom: 8 }}>Tìm thấy {results.length} kết quả</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {results.map(([id, p]) => (
                <div key={id} onClick={() => { sessionStorage.setItem('sx_product_return', 's-search'); go(`s-prod${id.slice(1)}`); }}
                  style={{ background: C.w, borderRadius: 12, overflow: 'hidden', border: '1px solid #e8def8', cursor: 'pointer' }}>
                  <div style={{ width: '100%', height: 80, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{p.icon}</div>
                  <div style={{ padding: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: C.t, marginBottom: 2, lineHeight: 1.3 }}>{p.title}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.p, marginBottom: 2 }}>{p.price}</div>
                    <div style={{ fontSize: 10, color: C.m }}>📍 {p.loc} · {p.cat}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}

function ProductScreen({ go, chkLogin, type }) {
  const [showReport, setShowReport] = useState(false);
  const [showProtection, setShowProtection] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportNote, setReportNote] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [mediaMode, setMediaMode] = useState('photo'); // photo | video
  const [infoTab, setInfoTab] = useState('desc');
  const [touchStartX, setTouchStartX] = useState(null);
  const data = PRODUCT_DATA;
  const p = data[type] || data.p1;
  return (
    <div>
      <Shdr title="Chi tiết sản phẩm" onBack={() => go(sessionStorage.getItem('sx_product_return') || 's-categories')}>
        <button onClick={() => setShowReport(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: 16 }}>🚩</span>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>Báo cáo</span>
        </button>
        <button onClick={() => { sessionStorage.setItem('sx_cart_return', `s-prod${type.slice(1)}`); go('s-cart'); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '2px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: 16, position: 'relative' }}>
            🛒{(() => { const n = getCart().reduce((s, c) => s + c.qty, 0); return n > 0 ? <span style={{ position: 'absolute', top: -4, right: -6, background: '#e53935', color: '#fff', borderRadius: '50%', width: 13, height: 13, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n > 9 ? '9+' : n}</span> : null; })()}
          </span>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>Giỏ hàng</span>
        </button>
      </Shdr>
      <div
        onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={e => {
          if (touchStartX === null || mediaMode !== 'photo') return;
          const dx = e.changedTouches[0].clientX - touchStartX;
          const imgs = p.imgs || [p.icon];
          if (dx < -40) setImgIdx(i => Math.min(i + 1, imgs.length - 1));   // vuốt trái -> ảnh sau
          if (dx > 40)  setImgIdx(i => Math.max(i - 1, 0));                  // vuốt phải -> ảnh trước
          setTouchStartX(null);
        }}
        style={{ background: mediaMode === 'photo' ? p.bg : 'linear-gradient(135deg,#1a1a2e,#16213e)', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: 60, overflow: 'hidden' }}>

        {p.hasVideo && (
          <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 5, display: 'flex', gap: 4, background: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 3 }}>
            <button onClick={() => setMediaMode('photo')} style={{ border: 'none', borderRadius: 16, padding: '4px 10px', fontSize: 10, fontWeight: 600, cursor: 'pointer', background: mediaMode === 'photo' ? '#fff' : 'transparent', color: mediaMode === 'photo' ? C.p : '#fff' }}>📷 Ảnh</button>
            <button onClick={() => setMediaMode('video')} style={{ border: 'none', borderRadius: 16, padding: '4px 10px', fontSize: 10, fontWeight: 600, cursor: 'pointer', background: mediaMode === 'video' ? '#fff' : 'transparent', color: mediaMode === 'video' ? C.p : '#fff' }}>🎬 Video</button>
          </div>
        )}

        {mediaMode === 'photo' ? (
          <>
            {(p.imgs || [p.icon])[imgIdx]}
            <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 10 }}>{imgIdx + 1}/{(p.imgs || [p.icon]).length} ảnh</span>
            {(p.imgs || [p.icon]).length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => Math.max(i - 1, 0))} disabled={imgIdx === 0}
                  style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.35)', color: '#fff', fontSize: 16, cursor: imgIdx === 0 ? 'default' : 'pointer', opacity: imgIdx === 0 ? 0.3 : 1 }}>‹</button>
                <button onClick={() => setImgIdx(i => Math.min(i + 1, (p.imgs || [p.icon]).length - 1))} disabled={imgIdx === (p.imgs || [p.icon]).length - 1}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.35)', color: '#fff', fontSize: 16, cursor: imgIdx === (p.imgs || [p.icon]).length - 1 ? 'default' : 'pointer', opacity: imgIdx === (p.imgs || [p.icon]).length - 1 ? 0.3 : 1 }}>›</button>
                <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
                  {(p.imgs || [p.icon]).map((_, i) => (
                    <div key={i} onClick={() => setImgIdx(i)}
                      style={{ width: i === imgIdx ? 14 : 6, height: 6, borderRadius: 3, background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'width 0.2s' }} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 50, height: 50, background: C.p, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: 20 }}>▶️</div>
            <div style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>Clip giới thiệu sản phẩm</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>15-30 giây · người bán tự quay</div>
          </div>
        )}
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.t, marginBottom: 4 }}>{p.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.p }}>{p.price}</span>
          <span style={{ fontSize: 11, background: C.pl, color: C.pd, padding: '3px 9px', borderRadius: 10 }}>{p.cond}</span>
          <span style={{ fontSize: 11, color: C.m }}>📍 {p.loc}</span>
        </div>
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initials={p.av} size={40} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {p.seller.replace(/^(Anh|Chị)\s+/, '')}
            </div>
            <div style={{ fontSize: 11, color: C.m, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📍 {p.loc}</div>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: C.p, fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap' }}>{p.stats}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => { sessionStorage.setItem('sx_cart_return', `s-prod${type.slice(1)}`); go('s-cart'); }}
                style={{ position: 'relative', background: C.pl, border: 'none', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                🛒{(() => { const n = getCart().reduce((s, c) => s + c.qty, 0); return n > 0 ? <span style={{ position: 'absolute', top: -3, right: -3, background: '#e53935', color: '#fff', borderRadius: '50%', width: 13, height: 13, fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n > 9 ? '9+' : n}</span> : null; })()}
              </button>
              <button onClick={() => go(p.storeRoute || 's-store-personal')}
                style={{ fontSize: 11, color: C.pd, background: C.pl, border: 'none', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
                🏪 Xem gian hàng
              </button>
            </div>
          </div>
        </div>
        {(() => {
          // Danh sách tab — thêm tab mới sau này (VD: Thông số, Chính sách đổi trả...) chỉ cần thêm 1 dòng vào đây
          const infoTabs = [
            { key: 'desc',   label: 'Mô tả',        content: p.desc },
            { key: 'defect', label: 'Khuyết điểm',  content: p.defect },
          ];
          const active = infoTabs.find(t => t.key === infoTab) || infoTabs[0];
          return (
            <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, marginBottom: 10, overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #e8def8' }}>
                {infoTabs.map(t => (
                  <button key={t.key} onClick={() => setInfoTab(t.key)}
                    style={{ flex: 1, padding: '10px 8px', border: 'none', background: infoTab === t.key ? C.pl : 'transparent', color: infoTab === t.key ? C.pd : C.m, fontSize: 12, fontWeight: infoTab === t.key ? 700 : 500, cursor: 'pointer', borderBottom: infoTab === t.key ? `2px solid ${C.p}` : '2px solid transparent' }}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div style={{ padding: 12 }}>
                <p style={{ fontSize: 12, color: C.m, lineHeight: 1.6, margin: 0 }}>{active.content}</p>
              </div>
            </div>
          );
        })()}
        <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 11, color: '#f57f17' }}>Gặp trực tiếp: ShopX không can thiệp. Dùng giao hàng cộng đồng để được bảo vệ.</span>{' '}
              <span onClick={() => setShowProtection(v => !v)} style={{ fontSize: 11, color: '#e65100', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', whiteSpace: 'nowrap' }}>
                {showProtection ? 'Ẩn bớt ‹' : 'Xem chi tiết ›'}
              </span>
            </div>
          </div>
          {showProtection && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #ffe082' }}>
              {[
                'Shipper đã xác minh Căn cước (KYC), không phải người lạ bất kỳ',
                'OTP xác nhận 2 đầu — chỉ giao/nhận đúng khi có mã, tránh nhầm người',
                'Chat 3 bên minh bạch — mọi trao đổi đều lưu lại, không ai giấu ai',
                'Có ảnh bằng chứng khi giao/nhận, khi từ chối nhận hàng',
                'Có cơ chế hoàn trả trong 15 ngày nếu hàng lỗi/sai mô tả',
                'Có nơi khiếu nại nếu xảy ra tranh chấp',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11, color: '#795500', marginBottom: 4, alignItems: 'flex-start' }}>
                  <span style={{ color: '#2e7d32', flexShrink: 0 }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thanh hành động — gộp 1 hàng duy nhất: Giỏ hàng (icon) / Chat / Đặt giao hàng */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10, marginBottom: 8 }}>
          {p.shippable && (
            <button onClick={() => { if (addToCart(type)) alert('✅ Đã thêm vào giỏ hàng!'); }}
              style={{ flexShrink: 0, width: 44, background: '#fff3e0', color: '#e65100', border: '1.5px dashed #ffb74d', borderRadius: 10, fontSize: 18, cursor: 'pointer' }}>
              🛒
            </button>
          )}
          <button style={{ flex: 1, background: C.w, color: C.p, border: `1.5px solid ${C.p}`, padding: 11, borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }} onClick={() => chkLogin('s-chat-buy')}>💬 Chat</button>
          {p.shippable ? (
            <button style={{ flex: 2, background: C.p, color: C.w, border: 'none', padding: 11, borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              onClick={() => { sessionStorage.setItem('sx_order_product', JSON.stringify({ title: p.title, price: p.price, seller: p.seller, icon: p.icon })); chkLogin('s-delivery'); }}>
              🚚 Đặt giao hàng
            </button>
          ) : (
            <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: C.m, textAlign: 'center' }}>
              💡 Cần xem trực tiếp
            </div>
          )}
        </div>
      </div>

      {/* Sản phẩm liên quan — cùng danh mục, từ NGƯỜI BÁN KHÁC (đã có nút Xem gian hàng cho cùng người bán rồi) */}
      {(() => {
        const related = Object.entries(PRODUCT_DATA)
          .filter(([id, rp]) => id !== type && rp.seller !== p.seller && matchesCategory(rp.cat, p.cat))
          .slice(0, 4);
        if (related.length === 0) return null;
        return (
          <div style={{ padding: '0 12px 12px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 8 }}>🔎 Sản phẩm liên quan</div>
            <div style={{ fontSize: 10, color: C.m, marginBottom: 8 }}>Cùng loại, từ người bán khác — để so sánh</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {related.map(([id, rp]) => (
                <div key={id} onClick={() => { sessionStorage.setItem('sx_product_return', `s-prod${type.slice(1)}`); go(`s-prod${id.slice(1)}`); }}
                  style={{ background: C.w, borderRadius: 10, overflow: 'hidden', border: '1px solid #e8def8', cursor: 'pointer' }}>
                  <div style={{ width: '100%', height: 64, background: rp.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{rp.icon}</div>
                  <div style={{ padding: 7 }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: C.t, marginBottom: 2, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rp.title}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.p, marginBottom: 2 }}>{rp.price}</div>
                    <div style={{ fontSize: 9, color: C.m, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rp.seller}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
      <div style={{ height: 80 }} />

      {showReport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 50 }}
          onClick={() => !reportSent && setShowReport(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.w, borderRadius: '18px 18px 0 0', padding: 16, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            {!reportSent ? (
              <>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.t, marginBottom: 4 }}>🚩 Báo cáo tin đăng</div>
                <div style={{ fontSize: 11, color: C.m, marginBottom: 12 }}>Cho ShopX biết vấn đề với tin đăng này. Thời gian xem xét: Hàng giả/Lừa đảo 3-7 ngày làm việc; Nội dung vi phạm xử lý nhanh hơn.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {['Hàng giả, hàng nhái', 'Lừa đảo / Không giao hàng', 'Nội dung vi phạm quy định / Lý do khác'].map(r => (
                    <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.t, cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: reportReason === r ? C.pl : 'transparent', border: `1px solid ${reportReason === r ? C.b : '#eee'}` }}>
                      <input type="radio" name="reportReason" checked={reportReason === r} onChange={() => setReportReason(r)} style={{ accentColor: C.p }} />
                      {r}
                    </label>
                  ))}
                </div>
                <Fg label="Mô tả cụ thể (bắt buộc)" req={true}>
                  <textarea value={reportNote} onChange={e => setReportNote(e.target.value)}
                    style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none', resize: 'none' }}
                    rows={3} placeholder="Chi tiết vấn đề bạn gặp phải — càng cụ thể càng giúp Admin xử lý nhanh (VD: khác biệt so với hàng chính hãng, không có tem/hộp...)." />
                </Fg>
                <div style={{ background: '#fff3e0', border: '1px solid #ffe082', borderRadius: 10, padding: '8px 10px', marginTop: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 10, color: '#e65100', lineHeight: 1.5 }}>
                    ⚠️ Báo cáo cần có căn cứ cụ thể. Báo cáo sai sự thật hoặc lợi dụng để cạnh tranh không lành mạnh có thể bị xử lý theo đúng quy định (áp dụng cho chính tài khoản gửi báo cáo).
                  </div>
                </div>
                <Btn onClick={() => {
                  if (!reportReason) { alert('Vui lòng chọn lý do báo cáo.'); return; }
                  if (!reportNote.trim()) { alert('Vui lòng mô tả cụ thể để Admin xác định đúng vấn đề.'); return; }
                  saveReport({ productTitle: p.title, reason: reportReason, note: reportNote });
                  setReportSent(true);
                }} style={{ marginTop: 4 }}>
                  Gửi báo cáo
                </Btn>
                <Btn2 onClick={() => setShowReport(false)}>Hủy</Btn2>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.t, marginBottom: 6 }}>Đã gửi báo cáo</div>
                <div style={{ fontSize: 12, color: C.m, marginBottom: 4 }}>
                  {reportReason === 'Nội dung vi phạm quy định / Lý do khác' ? 'Admin ShopX sẽ xem xét trong vòng 24 giờ.' : 'Admin ShopX sẽ xem xét trong 3-7 ngày làm việc.'}
                </div>
                <div style={{ fontSize: 11, color: C.m, marginBottom: 16 }}>Cảm ơn bạn đã giúp ShopX an toàn hơn. Xem trạng thái tại "Báo cáo của tôi" trong Tài khoản.</div>
                <Btn onClick={() => { setShowReport(false); setReportSent(false); setReportReason(''); setReportNote(''); }}>Đóng</Btn>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHAT SCREEN ─────────────────────────────────────────────────────
// ─── SERVICE SCREEN (Fix E: 3 tab mới) ────────────────────────────────
// ─── HỒ SƠ CV ĐẦY ĐỦ — xem chi tiết Thợ/Shipper/KOL-KOC ──────────────
// Tích màu gọn — thay chữ dài "Đã xác minh Căn cước KYC" bằng 1 icon nhỏ, giống Facebook/Pi Network
function getVerifyBadge(w, hasCCCD) {
  if (!hasCCCD) return null; // chưa xác minh gì thì không hiện tích
  if (w.disputed) return { color: '#e53935', title: 'Đang có tranh chấp/cảnh báo' };
  if (w.orders >= 20) return { color: '#2e7d32', title: 'Đã xác minh Căn cước • Uy tín cao (20+ đơn hoàn thành)' };
  return { color: '#1976d2', title: 'Đã xác minh Căn cước' };
}

function WorkerProfileScreen({ go }) {
  const w = (() => {
    try { return JSON.parse(sessionStorage.getItem('sx_view_profile') || 'null'); } catch (e) { return null; }
  })();
  const returnTo = sessionStorage.getItem('sx_profile_return') || 's-service';
  if (!w) return (
    <div>
      <Shdr title="Hồ sơ" onBack={() => go(returnTo)} />
      <div style={{ padding: 20, textAlign: 'center', color: C.m, fontSize: 13 }}>Không tìm thấy hồ sơ.</div>
    </div>
  );
  const tier = w.orders >= 20 ? '🏅 Chuyên nghiệp' : w.orders >= 5 ? '✅ Uy tín' : '🆕 Mới';
  const hasCCCD = (w.badges || []).some(b => b.label.includes('Căn cước') && b.ok);
  const verifyBadge = getVerifyBadge(w, hasCCCD);

  return (
    <div>
      <Shdr title="Hồ sơ đầy đủ" onBack={() => go(returnTo)} />
      <div style={{ padding: 12 }}>

        {/* Header hồ sơ */}
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 14, padding: 14, marginBottom: 12, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#fff', fontSize: 22, fontWeight: 700 }}>{w.av}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.t }}>{w.name}</span>
            {verifyBadge && (
              <span title={verifyBadge.title} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 17, height: 17, borderRadius: '50%', background: verifyBadge.color, color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: C.m, marginBottom: 6 }}>{w.trade ? `${w.trade} • ${w.exp} kinh nghiệm` : `Shipper cộng đồng • ${w.route || ''}`}</div>
          <span style={{ fontSize: 11, background: C.pl, color: C.pd, padding: '3px 10px', borderRadius: 10, fontWeight: 600 }}>{tier}</span>
        </div>

        {/* Thống kê hoạt động */}
        <Sechdr num="📊" title="Thống kê hoạt động" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[
            { val: w.orders, lbl: 'Đơn hoàn thành' },
            { val: `${w.completeRate ?? w.rate}%`, lbl: 'Tỷ lệ hoàn thành' },
            w.stars ? { val: `⭐ ${w.stars}`, lbl: 'Đánh giá sao' } : { val: `${w.thumbsUp}%`, lbl: 'Đánh giá tích cực' },
          ].map((s, i) => (
            <div key={i} style={{ background: C.pl, borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.p }}>{s.val}</div>
              <div style={{ fontSize: 9, color: C.m, marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Xác minh danh tính — ẩn hoàn toàn dữ liệu nhạy cảm, chỉ hiện trạng thái */}
        <Sechdr num="🔒" title="Xác minh danh tính" />
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 6 }}>
          {[
            { lbl: 'Số Căn cước', val: hasCCCD ? '•••• •••• ••••' : 'Chưa xác minh', ok: hasCCCD },
            { lbl: 'Số điện thoại', val: '••• ••• ••••', ok: true },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i === 0 ? '1px solid #f5f0ff' : 'none' }}>
              <span style={{ fontSize: 12, color: C.m }}>{r.lbl}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.t, letterSpacing: 1 }}>{r.val} {r.ok && <span style={{ color: '#2e7d32' }}>✓</span>}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: C.m, marginBottom: 16 }}>🔒 Dữ liệu Căn cước/SĐT được ẩn — chỉ hiện trạng thái đã xác minh, không hiển thị số thật cho người xem khác.</div>

        {/* Huy hiệu */}
        <Sechdr num="🏅" title="Huy hiệu" />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {(w.badges || []).map((b, i) => (
            <span key={i} style={{ fontSize: 11, padding: '5px 10px', borderRadius: 10, background: b.ok ? '#e8f5e9' : '#ffebee', border: `1px solid ${b.ok ? '#c8e6c9' : '#ef9a9a'}`, color: b.ok ? '#2e7d32' : '#c62828', fontWeight: 600 }}>
              {b.label} {b.ok ? '✅' : '❌'}
            </span>
          ))}
        </div>

        {/* Portfolio — hiện đúng hợp đồng thật đã ghi nhận qua ShopX (nếu có) */}
        <Sechdr num="🖼️" title="Portfolio / Công trình đã làm" />
        {(() => {
          const myContracts = CONTRACTS_DATA.filter(c => c.kolId === w.id);
          if (myContracts.length === 0) {
            return (
              <div style={{ background: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: 10, padding: 12, marginBottom: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>📋</div>
                <div style={{ fontSize: 11, color: '#1565c0', lineHeight: 1.6 }}>
                  Chưa có hợp đồng nào hoàn thành qua ShopX để tự động cập nhật Portfolio.<br/>
                  Portfolio sẽ tự xây dựng sau mỗi đơn hoàn thành + được người thuê xác nhận.
                </div>
              </div>
            );
          }
          return (
            <div style={{ marginBottom: 16 }}>
              {myContracts.map((c, i) => (
                <div key={i} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 10, padding: 10, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 20, flexShrink: 0 }}>{c.platform.split(' ')[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.t }}>{c.product}</div>
                    <div style={{ fontSize: 10, color: C.m }}>{c.completed}/{c.orders} đơn hoàn thành {c.reviews > 0 && `• ⭐ ${c.avgRating} (${c.reviews})`}</div>
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 10, color: C.m, textAlign: 'center', marginTop: 4 }}>
                📊 Dữ liệu tự động ghi nhận từ Chiến dịch KOL đang chạy qua ShopX
              </div>
            </div>
          );
        })()}

        {w.trade && (
          <button onClick={() => {
            sessionStorage.setItem('sx_chat_contact', JSON.stringify({ name: w.name, trade: w.trade, exp: w.exp, price: w.price, sxId: w.id, needsAddress: w.needsAddress, needsContentLink: w.needsContentLink }));
            go('s-chat-worker');
          }} style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 12, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            💬 Liên hệ {w.name}
          </button>
        )}
        {!w.trade && (
          <button onClick={() => go(returnTo)} style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 12, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            ← Quay lại chọn Shipper
          </button>
        )}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

const WORKERS_DATA = [
    {
      av: 'VN', id: 'SX-00199', name: 'Anh Trần Văn Nhân', trade: 'Thợ điện dân dụng', nganh: 'nha', exp: '8 năm', needsAddress: true, needsContentLink: false,
      price: '80.000đ/giờ', orders: 788, completeRate: 98, cancelRate: 2,
      thumbsUp: 98.2, bg: C.p,
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '⭐ Chứng chỉ nghề',  ok: true  },
      ],
    },
    {
      av: 'TL', id: 'SX-00201', name: 'Anh Nguyễn Thanh Long', trade: 'Thợ sửa máy lạnh', nganh: 'dien', exp: '5 năm', needsAddress: true, needsContentLink: false,
      price: '150.000đ/ca', orders: 234, completeRate: 95, cancelRate: 5,
      thumbsUp: 94.5, bg: C.pm,
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '⭐ Chứng chỉ nghề',  ok: true  },
      ],
    },
    {
      av: 'TH', id: 'SX-00198', name: 'Chị Nguyễn Thu Hương', trade: 'Dọn dẹp vệ sinh nhà', nganh: 'nha2', exp: '3 năm', needsAddress: true, needsContentLink: false,
      price: '200.000đ/lần', orders: 56, completeRate: 100, cancelRate: 0,
      thumbsUp: 100, bg: C.pd,
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '⭐ Chứng chỉ nghề',  ok: false },
      ],
    },
    {
      av: 'QH', id: 'SX-00202', name: 'Anh Lê Quốc Hùng', trade: 'Thợ sơn tường', nganh: 'nha', exp: '10 năm', needsAddress: true, needsContentLink: false,
      price: '400.000đ/ngày', orders: 412, completeRate: 96, cancelRate: 4,
      thumbsUp: 96.8, bg: '#6B2F9E',
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '⭐ Chứng chỉ nghề',  ok: false },
      ],
    },
    {
      av: 'TL2', id: 'SX-00207', name: 'Chị Nguyễn Thị Lan', trade: 'Mua hộ - đi chợ hộ', nganh: 'noikhu', exp: '6 tháng', needsAddress: true, needsContentLink: false,
      price: '30.000đ/lần', orders: 24, completeRate: 100, cancelRate: 0,
      thumbsUp: 99.0, bg: '#00897b', toaNha: 'Chung cư Sky View, Tòa B — Biên Hòa',
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
      ],
    },
    {
      av: 'VH', id: 'SX-00208', name: 'Anh Phạm Văn Hòa', trade: 'Giao hàng nội khu - nội tòa nhà', nganh: 'noikhu', exp: '1 năm', needsAddress: true, needsContentLink: false,
      price: '15.000đ/lần', orders: 89, completeRate: 97, cancelRate: 3,
      thumbsUp: 97.5, bg: '#00897b', toaNha: 'Chung cư Green Valley — Trảng Bom',
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
      ],
    },
    {
      av: 'KV', id: 'SX-00001', name: 'Khoavinhcuu113', trade: 'KOL/KOC quảng bá sản phẩm', nganh: 'dam', exp: '3 tháng', needsAddress: false, needsContentLink: true,
      price: '200.000đ/bài', orders: 5, completeRate: 100, cancelRate: 0, followers: 800,
      thumbsUp: 100, bg: '#7B2FBE',
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '📷 800 followers',   ok: true },
      ],
    },
    {
      av: 'MT', id: 'SX-00203', name: 'Chị Đặng Minh Thư', trade: 'KOL/KOC quảng bá sản phẩm', nganh: 'dam', exp: '2 năm', needsAddress: false, needsContentLink: true,
      price: '500.000đ/bài', orders: 47, completeRate: 97, cancelRate: 3, followers: 12500,
      thumbsUp: 97.5, bg: '#ad1457',
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '📷 12.500 followers', ok: true },
      ],
    },
    {
      av: 'TH', id: 'SX-00204', name: 'Chị Thu Hương', trade: 'KOL/KOC quảng bá sản phẩm', nganh: 'dam', exp: '3 năm', needsAddress: false, needsContentLink: true,
      price: '580.000đ/bài', orders: 16, completeRate: 88, cancelRate: 12, followers: 15000,
      thumbsUp: 96.8, bg: '#e91e63',
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '📷 15.000 followers', ok: true },
      ],
    },
    {
      av: 'AT', id: 'SX-00205', name: 'Anh Minh Tuấn', trade: 'KOL/KOC quảng bá sản phẩm', nganh: 'dam', exp: '1 năm', needsAddress: false, needsContentLink: true,
      price: '320.000đ/bài', orders: 18, completeRate: 94, cancelRate: 6, followers: 3500,
      thumbsUp: 95.0, bg: '#5e35b1',
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '📷 3.500 followers', ok: true },
      ],
    },
    {
      av: 'BG', id: 'SX-00206', name: 'Bé Gạo Vlog', trade: 'KOL/KOC quảng bá sản phẩm', nganh: 'dam', exp: '4 tháng', needsAddress: false, needsContentLink: true,
      price: '180.000đ/bài', orders: 2, completeRate: 50, cancelRate: 0, followers: 600,
      thumbsUp: 88.0, bg: '#fb8c00',
      badges: [
        { label: '🪪 Căn cước KYC',    ok: true  },
        { label: '📷 600 followers',   ok: true },
      ],
    },
  ];

function ServiceScreen({ go, chkLogin }) {
  const [tab, setTab] = useState(() => {
    const initial = sessionStorage.getItem('sx_service_initial_tab');
    sessionStorage.removeItem('sx_service_initial_tab');
    return initial || 'cv';
  });
  const [mainTab, setMainTab] = useState(tab === 'job' ? 'congviec' : 'dichvu');
  const [nganh, setNganh] = useState(() => {
    const initial = sessionStorage.getItem('sx_service_initial_nganh') || '';
    sessionStorage.removeItem('sx_service_initial_nganh');
    return initial;
  });
  const [ngheCuThe, setNgheCuThe] = useState('');
  const [khuVucSearch, setKhuVucSearch] = useState('');
  const workers = WORKERS_DATA;

  const jobs = [
    { title: 'Cần thợ sửa máy lạnh tại nhà', desc: 'Máy lạnh Daikin 1.5HP không lạnh, cần vệ sinh và nạp gas.', price: '200.000đ', loc: 'Biên Hòa', icon: '❄️' },
    { title: 'Cần người mua hộ đồ ăn sáng', desc: 'Cần mua hộ 3 phần bánh mì + cà phê, giao tại tầng 8 chung cư Pegasus.', price: '20.000đ + tiền đồ', loc: 'Biên Hòa', icon: '🍖' },
    { title: 'Cần người chăm sóc mẹ tại bệnh viện', desc: 'Mẹ nằm viện Đồng Nai, cần người trông ca tối 18h-6h. 2 ngày/tuần.', price: '250.000đ/ca', loc: 'Biên Hòa', icon: '❤️' },
    { title: 'Cần vệ sinh căn hộ 2PN', desc: 'Vệ sinh toàn bộ căn hộ 65m2, dọn sau sửa chữa. Có sẵn dụng cụ.', price: '300.000đ', loc: 'Hố Nai', icon: '🧹' },
    { title: 'Cần thợ sơn nhà 3 phòng ngủ', desc: 'Sơn lại nội thất ~80m2, có sẵn sơn. Ưu tiên thợ làm cuối tuần.', price: 'Thỏa thuận', loc: 'Trảng Bom', icon: '🏠' },
    { title: 'Cần nhận hàng online hộ', desc: 'Hay đặt hàng online nhưng không có nhà ban ngày. Cần người nhận và giữ hộ.', price: '15.000đ/lần', loc: 'Hố Nai', icon: '📦' },
  ];
  // Tin cần việc / Đăng ký Shipper / Nhận quảng cáo — đều thuộc bên CUNG ("Tìm dịch vụ"), khác "Tin tìm thợ" (bên CẦU)
  const subTabs = [
    { id: 'cv',      label: 'Tin cần việc' },
    { id: 'shipper', label: 'Đăng ký nhận Shipper' },
    { id: 'kol',     label: 'Nhận quảng cáo (KOC/KOL)' },
  ];
  function goRegisterKol() {
    sessionStorage.setItem('sx_cv_form', JSON.stringify({ nganh: 'dam', ngheCuThe: 'KOL/KOC quảng bá sản phẩm' }));
    chkLogin('s-cv-register');
  }
  return (
    <div>
      <Shdr title="Dịch vụ & Việc làm" onBack={() => go('s-home')} />
      {/* Tầng 1 — Cung (Tìm dịch vụ) / Cầu (Tìm công việc) */}
      <div style={{ display: 'flex', background: '#f0ebfa', padding: 4, margin: '10px 12px 6px', borderRadius: 10, gap: 2 }}>
        {[
          { id: 'dichvu',   label: '🔧 Tìm dịch vụ' },
          { id: 'congviec', label: '💼 Tìm công việc' },
        ].map(t => (
          <button key={t.id} onClick={() => { setMainTab(t.id); setTab(t.id === 'congviec' ? 'job' : 'cv'); }}
            style={{ flex: 1, textAlign: 'center', padding: '9px 4px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', background: mainTab === t.id ? C.w : 'none', color: mainTab === t.id ? C.p : C.m }}>
            {t.label}
          </button>
        ))}
      </div>
      {/* Tầng 2 — chỉ hiện khi "Tìm dịch vụ" (3 mục: Tin cần việc / Shipper / Quảng cáo) */}
      {mainTab === 'dichvu' && (
        <div style={{ display: 'flex', margin: '0 12px 6px', gap: 2 }}>
          {subTabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, textAlign: 'center', padding: '7px 4px', borderRadius: 8, fontSize: 10, fontWeight: 500, cursor: 'pointer', border: `1px solid ${tab === t.id ? C.p : '#e8def8'}`, background: tab === t.id ? C.pl : 'none', color: tab === t.id ? C.pd : C.m, lineHeight: 1.2 }}>
              {t.label}
            </button>
          ))}
        </div>
      )}
      {/* Tab 1 — Đăng ký nghề cần việc */}
      {tab === 'cv' && (
        <div>
          <div style={{ position: 'relative', margin: '0 12px 10px' }}>
            <select style={{ width: '100%', background: C.w, border: `1.5px solid ${C.p}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: C.t, appearance: 'none', outline: 'none' }} value={nganh} onChange={e => { setNganh(e.target.value); setNgheCuThe(''); }}>
              <option value="">-- Tất cả ngành nghề --</option>
              {NGANH_LIST.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: C.p, pointerEvents: 'none' }}>▾</span>
          </div>
          {nganh && (
            <div style={{ margin: '0 12px 10px' }}>
              <select style={{ width: '100%', background: C.pl, border: `1px solid ${C.b}`, borderRadius: 10, padding: '9px 14px', fontSize: 12, color: C.t, appearance: 'none', outline: 'none' }} value={ngheCuThe} onChange={e => setNgheCuThe(e.target.value)}>
                <option value="">-- Chọn nghề cụ thể --</option>
                {(NGHES[nganh] || []).map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          )}
          {nganh === 'noikhu' && (
            <div style={{ margin: '0 12px 10px' }}>
              <input value={khuVucSearch} onChange={e => setKhuVucSearch(e.target.value)}
                placeholder="🔍 Tìm theo chung cư/tòa nhà/khu vực..."
                style={{ width: '100%', border: `1px solid ${C.b}`, borderRadius: 10, padding: '9px 14px', fontSize: 12, color: C.t, outline: 'none', boxSizing: 'border-box' }} />
              <div style={{ fontSize: 10, color: C.m, marginTop: 4 }}>💡 Nhập đúng tên chung cư/khu vực bạn cần để tìm người ở gần nhất</div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 12px 12px' }}>
            {workers.filter(w => (!nganh || w.nganh === nganh) && (!ngheCuThe || w.trade === ngheCuThe) && (nganh !== 'noikhu' || !khuVucSearch.trim() || (w.toaNha || '').toLowerCase().includes(khuVucSearch.trim().toLowerCase()))).map((w, i) => (
              <div key={i} onClick={() => { sessionStorage.setItem('sx_view_profile', JSON.stringify(w)); sessionStorage.setItem('sx_profile_return', 's-service'); go('s-worker-profile'); }}
                style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: '10px 12px', cursor: 'pointer' }}>

                {/* Hàng 1: Avatar + Tên + Giá + Nút */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontSize: 14, fontWeight: 700 }}>{w.av}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.t }}>{w.name}</span>
                      {(() => {
                        const hasCCCD = (w.badges || []).some(b => b.label.includes('Căn cước') && b.ok);
                        const vb = getVerifyBadge(w, hasCCCD);
                        return vb ? <span title={vb.title} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 14, height: 14, borderRadius: '50%', background: vb.color, color: '#fff', fontSize: 9, lineHeight: 1, flexShrink: 0 }}>✓</span> : null;
                      })()}
                      <span style={{ fontSize: 10, background: C.pl, color: C.pd, padding: '1px 6px', borderRadius: 8, flexShrink: 0 }}>
                        {w.orders >= 20 ? '🏅 Chuyên nghiệp' : w.orders >= 5 ? '✅ Uy tín' : '🆕 Mới'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: C.m, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {w.trade} • {w.exp} • <span style={{ color: C.p, fontWeight: 600 }}>{w.price}</span>
                    </div>
                    {w.toaNha && (
                      <div style={{ fontSize: 10, color: '#00897b', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📍 {w.toaNha}</div>
                    )}
                  </div>
                  <button onClick={e => { e.stopPropagation(); sessionStorage.setItem('sx_chat_contact', JSON.stringify({ name: w.name, trade: w.trade, exp: w.exp, price: w.price, sxId: w.id, needsAddress: w.needsAddress, needsContentLink: w.needsContentLink })); chkLogin('s-chat-worker'); }}
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
            <Btn onClick={() => chkLogin('s-cv-register')}>➕ Đăng ký làm thợ / Người làm tự do</Btn>
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

      {/* Tab 4 — KOL/KOC */}
      {tab === 'kol' && (
        <div style={{ padding: '0 12px 12px' }}>
          <div style={{ background: '#fce4ec', border: '1px solid #f8bbd0', borderRadius: 12, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#880e4f', lineHeight: 1.6, marginBottom: 10 }}>
              🎥 Quảng bá sản phẩm qua TikTok, Facebook, Instagram, YouTube — nhận thù lao theo bài đăng, video hoặc buổi live. Không cần thiết bị đặc biệt, dùng chính kênh mạng xã hội bạn đang có.
            </div>
            <button onClick={goRegisterKol}
              style={{ width: '100%', background: '#ad1457', color: '#fff', border: 'none', padding: 11, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              ➕ Đăng ký làm KOL/KOC
            </button>
          </div>

          <Sechdr num="🌟" title="Hồ sơ KOL/KOC đã có" />
          {workers.filter(w => w.trade === 'KOL/KOC quảng bá sản phẩm').map((w, i) => (
            <div key={i} onClick={() => { sessionStorage.setItem('sx_view_profile', JSON.stringify(w)); sessionStorage.setItem('sx_profile_return', 's-service'); go('s-worker-profile'); }}
              style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: '10px 12px', marginBottom: 8, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontSize: 14, fontWeight: 700 }}>{w.av}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.t }}>{w.name}</span>
                    <span style={{ fontSize: 10, background: C.pl, color: C.pd, padding: '1px 6px', borderRadius: 8, flexShrink: 0 }}>
                      {w.orders >= 20 ? '🏅 Chuyên nghiệp' : w.orders >= 5 ? '✅ Uy tín' : '🆕 Mới'}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: C.m }}>{w.exp} kinh nghiệm • <span style={{ color: C.p, fontWeight: 600 }}>{w.price}</span></div>
                </div>
                <button onClick={e => { e.stopPropagation(); sessionStorage.setItem('sx_chat_contact', JSON.stringify({ name: w.name, trade: w.trade, exp: w.exp, price: w.price, sxId: w.id, needsAddress: w.needsAddress, needsContentLink: w.needsContentLink })); chkLogin('s-chat-worker'); }}
                  style={{ background: '#ad1457', color: '#fff', border: 'none', padding: '7px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                  💬 Liên hệ
                </button>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {w.badges.map((b, j) => (
                  <span key={j} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 8, background: b.ok ? '#e8f5e9' : '#ffebee', border: `1px solid ${b.ok ? '#c8e6c9' : '#ef9a9a'}`, color: b.ok ? '#2e7d32' : '#c62828', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {b.label} {b.ok ? '✅' : '❌'}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div style={{ fontSize: 11, color: C.m, textAlign: 'center', marginTop: 4 }}>
            💡 Muốn mời KOL/KOC quảng bá 1 sản phẩm cụ thể? Vào đúng trang sản phẩm đó trong gian hàng của bạn.
          </div>
        </div>
      )}

      <div style={{ height: 80 }} />
    </div>
  );
}

// ─── POST SCREEN (Fix B: nhiều ảnh + Fix D: hình thức bán) ───────────
function PostScreen({ go, chkLogin, hasCCCD }) {
  const saved = (() => { try { return JSON.parse(sessionStorage.getItem('postData') || '{}'); } catch(e) { return {}; } })();
  const [method, setMethod] = useState(saved.method || 'ship');
  const [photos, setPhotos] = useState(saved.photos ? Array.from({ length: saved.photos }, (_, i) => ['📱','📦','🛋️','👕','🚗','❄️','🔧','🏡'][i % 8]) : []);
  const [hasVideo, setHasVideo] = useState(saved.hasVideo || false);
  const [title, setTitle] = useState(saved.title || '');
  const [price, setPrice] = useState(saved.price || '');
  const [cat, setCat] = useState(saved.cat || '');
  const [condition, setCondition] = useState(saved.condition || '');
  // Trường riêng cho Bất động sản — khác hẳn "Tình trạng" hàng hóa thường (theo đúng chuẩn Chợ Tốt)
  const [reType, setReType] = useState(saved.reType || '');
  const [dienTich, setDienTich] = useState(saved.dienTich || '');
  const [phapLy, setPhapLy] = useState(saved.phapLy || '');
  const [huongNha, setHuongNha] = useState(saved.huongNha || '');
  const [soPhong, setSoPhong] = useState(saved.soPhong || '');
  const [noiThat, setNoiThat] = useState(saved.noiThat || '');
  const isRealEstate = cat === 'Bất động sản';
  const emojis = ['📱','📦','🛋️','👕','🚗','❄️','🔧','🏡'];

  function addPhoto() {
    if (photos.length >= 8) { alert('Tối đa 8 ảnh'); return; }
    setPhotos(p => [...p, emojis[p.length % 8]]);
  }

  function previewPost() {
    if (!title.trim())        { alert('Vui lòng nhập Tiêu đề.'); return; }
    if (!cat)                 { alert('Vui lòng chọn Danh mục.'); return; }
    if (!price || Number(price) <= 0) { alert('Vui lòng nhập Giá bán hợp lệ.'); return; }
    if (photos.length === 0)  { alert('Vui lòng thêm ít nhất 1 ảnh sản phẩm.'); return; }
    if (isRealEstate) {
      if (!reType)   { alert('Vui lòng chọn Loại giao dịch.'); return; }
      if (!dienTich) { alert('Vui lòng nhập Diện tích.'); return; }
      if (!phapLy)   { alert('Vui lòng chọn Pháp lý.'); return; }
      if (!soPhong)  { alert('Vui lòng nhập Số phòng ngủ.'); return; }
    } else {
      if (!condition) { alert('Vui lòng chọn Tình trạng.'); return; }
    }
    sessionStorage.setItem('postData', JSON.stringify({ title, price, cat, method, photos: photos.length, hasVideo, condition, reType, dienTich, phapLy, huongNha, soPhong, noiThat }));
    go('s-preview-post');
  }

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
      <div style={{ background: '#e8f5e9', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #c8e6c9' }}>
        <Avatar initials="KV" size={22} />
        <div style={{ fontSize: 11, color: '#2e7d32', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Đăng với tư cách <b>Lê Đăng Khoa</b> · SX-00001{hasCCCD ? ' · 🪪 Đã xác minh' : ''}
        </div>
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
          {!hasVideo ? (
            <div onClick={() => setHasVideo(true)} style={{ border: `2px dashed ${C.p}`, borderRadius: 12, padding: 14, textAlign: 'center', cursor: 'pointer', background: '#faf7ff' }}>
              <div style={{ fontSize: 26, marginBottom: 4 }}>🎬</div>
              <p style={{ fontSize: 12, color: C.m }}>Bấm để quay/tải clip giới thiệu (15-30 giây)</p>
            </div>
          ) : (
            <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 12, border: `1.5px solid ${C.p}` }}>
              <div style={{ width: 44, height: 44, background: C.p, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>▶️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Clip đã chọn</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Sẵn sàng đăng cùng tin</div>
              </div>
              <button onClick={() => setHasVideo(false)} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>×</button>
            </div>
          )}
          <div style={{ fontSize: 10, color: C.m, marginTop: 4 }}>Không bắt buộc • Tăng độ tin cậy tin đăng rõ rệt</div>
        </Fg>
        <Fg label="Tiêu đề" req><Fi value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: iPhone 13 Pro 256GB còn bảo hành" /></Fg>
        <Fg label="Danh mục" req>
          <Fs value={cat} onChange={e => setCat(e.target.value)}>
            <option value="">-- Chọn danh mục --</option>
            <optgroup label="🛍️ Sản phẩm">
              {CATEGORIES.filter((c, i) => CATEGORY_ROUTES[i] !== 's-service').map(c => <option key={c.name}>{c.name}</option>)}
            </optgroup>
            <optgroup label="🔧 Dịch vụ">
              {CATEGORIES.filter((c, i) => CATEGORY_ROUTES[i] === 's-service').map(c => <option key={c.name}>{c.name}</option>)}
            </optgroup>
          </Fs>
        </Fg>
        {isRealEstate ? (
          <>
            <Fg label="Loại giao dịch" req>
              <Fs value={reType} onChange={e => setReType(e.target.value)}>
                <option value="">-- Chọn --</option><option>Bán</option><option>Cho thuê</option>
              </Fs>
            </Fg>
            <Fg label="Diện tích (m²)" req><Fi value={dienTich} onChange={e => setDienTich(e.target.value)} type="number" placeholder="VD: 65" /></Fg>
            <Fg label="Pháp lý" req>
              <Fs value={phapLy} onChange={e => setPhapLy(e.target.value)}>
                <option value="">-- Chọn --</option><option>Sổ đỏ/Sổ hồng</option><option>Hợp đồng mua bán</option><option>Giấy tờ viết tay</option><option>Đang chờ sổ</option>
              </Fs>
            </Fg>
            <Fg label="Hướng nhà">
              <Fs value={huongNha} onChange={e => setHuongNha(e.target.value)}>
                <option value="">-- Chọn --</option><option>Đông</option><option>Tây</option><option>Nam</option><option>Bắc</option><option>Đông Nam</option><option>Đông Bắc</option><option>Tây Nam</option><option>Tây Bắc</option>
              </Fs>
            </Fg>
            <Fg label="Số phòng ngủ" req><Fi value={soPhong} onChange={e => setSoPhong(e.target.value)} type="number" placeholder="VD: 2" /></Fg>
            <Fg label="Nội thất">
              <Fs value={noiThat} onChange={e => setNoiThat(e.target.value)}>
                <option value="">-- Chọn --</option><option>Đầy đủ nội thất</option><option>Nội thất cơ bản</option><option>Nhà trống, không nội thất</option>
              </Fs>
            </Fg>
          </>
        ) : (
          <Fg label="Tình trạng" req>
            <Fs value={condition} onChange={e => setCondition(e.target.value)}>
              <option value="">-- Chọn --</option><option>Mới (còn nguyên seal)</option><option>Như mới (99%)</option><option>Đã dùng (còn tốt)</option><option>Cần sửa chữa nhỏ</option>
            </Fs>
          </Fg>
        )}
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
  );
}
// ─── DIRECT SCREEN (Fix C: bỏ nút xem tin nhắn) ─────────────────────
// ─── CHẶN BỔ SUNG SĐT khi cần thực hiện hành động quan trọng (đăng tin, nhận đơn...) ───
function PhoneGateScreen({ go, onVerified, backTo, actionLabel }) {
  const [step, setStep]       = useState('phone'); // phone | otp
  const [phone, setPhone]     = useState('');
  const [otp, setOtp]         = useState('');
  const [sending, setSending] = useState(false);

  function sendOtp() {
    if (phone.replace(/\D/g, '').length < 9) { alert('Vui lòng nhập đúng số điện thoại.'); return; }
    setSending(true);
    setTimeout(() => { setSending(false); setStep('otp'); }, 800);
  }
  function verifyOtp() {
    if (otp.replace(/\D/g, '').length !== 6) { alert('Vui lòng nhập đủ 6 số OTP.'); return; }
    onVerified();
  }

  return (
    <div>
      <Shdr title="Cần bổ sung số điện thoại" onBack={() => go('s-home')} />
      <div style={{ padding: 12 }}>
        <Infobox icon="🔒" text={`Để ${actionLabel || 'tiếp tục'}, ShopX cần xác minh số điện thoại nhằm đảm bảo trách nhiệm giao dịch giữa các bên.`} bg="#fff3e0" color="#e65100" />

        {step === 'phone' && (
          <>
            <Fg label="Số điện thoại" req>
              <Fi placeholder="0901234567" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </Fg>
            <Btn onClick={sendOtp} disabled={sending}>{sending ? 'Đang gửi mã...' : '📩 Gửi mã OTP xác thực'}</Btn>
          </>
        )}

        {step === 'otp' && (
          <>
            <Fg label={`Nhập mã OTP đã gửi tới ${phone}`} req>
              <Fi placeholder="6 số" maxLength={6} inputMode="numeric" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
            </Fg>
            <Btn onClick={verifyOtp}>✅ Xác nhận & Tiếp tục</Btn>
            <Btn2 onClick={() => setStep('phone')}>⬅️ Đổi số điện thoại</Btn2>
          </>
        )}
      </div>
    </div>
  );
}

// ─── CHIẾN DỊCH KOL — theo dõi hiệu quả cho Doanh nghiệp ────────────
// ─── CHIẾN DỊCH KOL — 3 cấp dữ liệu: Hợp đồng (gốc) → gộp theo KOL / theo Sản phẩm ──
// Dữ liệu hợp đồng KOL gốc — cấp module để dùng chung với WorkerProfileScreen (hiện đúng hợp đồng thật trong Portfolio)
// Đơn hàng của tôi — demo, phản ánh đủ các trạng thái đã xây trong Chat3WayScreen
const ORDERS_DATA = [
  { id: 'DH-001', product: 'Bàn ăn gỗ sồi 6 ghế', icon: '🪑', role: 'seller', counterpart: 'Chị Thu Hương (KOL)', type: 'return', status: 'pending', reason: 'Hàng không đúng mô tả', hoursLeft: 46,
    timeline: ['12/08 09:15 — Người mua nhận hàng qua OTP', '13/08 14:20 — Người mua gửi yêu cầu hoàn trả kèm ảnh', 'Đang chờ bạn phản hồi (còn 46h trước khi tự động duyệt)'] },
  { id: 'DH-002', product: 'Bàn ăn gỗ sồi 6 ghế', icon: '🪑', role: 'seller', counterpart: 'Chị Thu Hương (KOL)', type: 'return', status: 'auto_approved', reason: 'Quá hạn phản hồi 72h',
    timeline: ['08/08 10:00 — Người mua nhận hàng qua OTP', '09/08 08:30 — Người mua gửi yêu cầu hoàn trả', '12/08 08:30 — Quá 72h không phản hồi → hệ thống tự động duyệt'] },
  { id: 'DH-003', product: 'Bàn ăn gỗ sồi 6 ghế', icon: '🪑', role: 'seller', counterpart: 'Chị Thu Hương (KOL)', type: 'cancel', status: 'cancelled', reason: 'Hủy trước khi giao — không phát sinh phí',
    timeline: ['05/08 16:00 — Đặt hàng', '05/08 16:40 — Người mua hủy trước khi Shipper nhận hàng'] },
  { id: 'DH-004', product: 'Tủ lạnh Samsung Inverter 236L', icon: '❄️', role: 'seller', counterpart: 'Chị Thu Hương (KOL)', type: 'normal', status: 'shipping',
    timeline: ['14/08 09:00 — Đặt hàng', '14/08 10:15 — Shipper đã nhận hàng, đang giao'] },
  { id: 'DH-005', product: 'iPhone 13 Pro 256GB', icon: '📱', role: 'seller', counterpart: 'Bé Gạo Vlog (KOC)', type: 'normal', status: 'completed',
    timeline: ['01/08 08:00 — Đặt hàng', '01/08 15:30 — Giao thành công, đã đánh giá'] },
  { id: 'DH-006', product: 'iPhone 12 Pro 128GB', icon: '📱', role: 'buyer', counterpart: 'SX-00089', type: 'normal', status: 'completed', date: '15/03/2026',
    timeline: ['15/03 09:00 — Đặt hàng', '15/03 14:20 — Đã nhận hàng qua OTP'] },
  { id: 'DH-007', product: 'Honda SH 125i 2021', icon: '🏍️', role: 'seller', counterpart: 'SX-00234', type: 'normal', status: 'completed', date: '02/05/2026',
    timeline: ['02/05 10:00 — Đặt hàng', '02/05 16:00 — Đã giao thành công'] },
  { id: 'DH-008', product: 'Samsung S23 256GB', icon: '📱', role: 'buyer', counterpart: 'SX-00312', type: 'normal', status: 'completed', date: '22/02/2026',
    timeline: ['22/02 08:30 — Đặt hàng', '22/02 13:10 — Đã nhận hàng qua OTP'] },
];
function getResolvedOrders() {
  try { return JSON.parse(sessionStorage.getItem('sx_orders_resolved') || '[]'); } catch (e) { return []; }
}
function markOrderResolved(id) {
  const list = getResolvedOrders();
  if (!list.includes(id)) { list.push(id); sessionStorage.setItem('sx_orders_resolved', JSON.stringify(list)); }
}

// Đơn "có vấn đề" (cần chú ý) — dùng chung cho tab lọc và banner Chiến dịch KOL
function isIssueOrder(o) { return o.type === 'return' || o.type === 'cancel'; }

// Hoạt động lao động — gộp 2 chiều CÙNG bản chất "lao động" (khác hàng hóa): THUÊ người (Dịch vụ & Việc làm) và NHẬN việc (Shipper)
const LABOR_HIRING_ACTIVE = [
  { id: 'LD-001', title: 'Sửa điện phòng ngủ', icon: '🔧', status: 'waiting', hoursElapsed: 25 },
];
const LABOR_HIRING_HISTORY = [
  { id: 'LD-002', title: 'Sửa điện phòng ngủ', icon: '🔧', price: '150.000đ', date: '10/06/2026', badge: 'Hoàn thành' },
  { id: 'LD-003', title: 'Dọn dẹp nhà theo giờ', icon: '🧹', price: '120.000đ', date: '18/04/2026', badge: 'Hoàn thành' },
];

// Tin đăng của tôi — module-level để dùng chung giữa AccountScreen (đếm tóm tắt) và MyListingsScreen (danh sách đầy đủ)
const LISTINGS_DATA = [
  { icon: '📱', title: 'iPhone 13 Pro 256GB còn BH', price: '18.500.000đ', date: '26/07/2026', hasMsg: true,  msgCount: 2 },
  { icon: '🏍️', title: 'Honda SH 125i 2021 đen bóng', price: '62.000.000đ', date: '25/07/2026', hasMsg: false, msgCount: 0 },
];

// Màn tổng — 3 tab ngang hàng (Tin đăng/Đơn hàng/Lao động), thay cho 3 màn riêng biệt trước đó
function ListingsContent({ go }) {
  return (
    <div style={{ padding: 12 }}>
      {LISTINGS_DATA.map((l, i) => (
        <div key={i} style={{ background: '#e8f5e9', border: `1.5px solid ${l.hasMsg ? '#2e7d32' : '#c8e6c9'}`, borderRadius: 12, padding: 10, marginBottom: 8, display: 'flex', gap: 10, cursor: l.hasMsg ? 'pointer' : 'default' }}
          onClick={() => l.hasMsg && go('s-chat-buy-mine')}>
          <div style={{ width: 44, height: 44, background: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>{l.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 2 }}>{l.title}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2e7d32', marginBottom: 2 }}>{l.price}</div>
            <div style={{ fontSize: 10, color: C.m }}>Đăng ngày {l.date}</div>
          </div>
          {l.hasMsg ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ background: '#e53935', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, marginBottom: 3 }}>{l.msgCount}</div>
              <div style={{ fontSize: 9, color: '#2e7d32', fontWeight: 600 }}>Tin nhắn</div>
            </div>
          ) : (
            <div style={{ flexShrink: 0, fontSize: 10, color: C.m, alignSelf: 'center' }}>Chưa có tin</div>
          )}
        </div>
      ))}
    </div>
  );
}

function LaborContent({ go }) {
  return (
    <div style={{ padding: 12 }}>
      <Infobox text="Gộp chung mọi hoạt động LAO ĐỘNG (thuê người làm việc / nhận việc làm) — khác với 'Đơn hàng của tôi' chỉ dành cho mua bán HÀNG HÓA." />

      {/* KHỐI TRÊN — Đang thuê người làm (Dịch vụ & Việc làm) */}
      <Sechdr num="🔼" title="Đang thuê người làm" />
      {LABOR_HIRING_ACTIVE.map(l => (
        <div key={l.id} style={{ background: '#efebe9', border: '1px solid #d7ccc8', borderRadius: 12, padding: 10, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#4e342e' }}>{l.icon} {l.title}</div>
              <div style={{ fontSize: 11, color: '#6d4c41' }}>⏳ Chờ thợ đến • +{l.hoursElapsed}h</div>
            </div>
            <button onClick={() => { sessionStorage.setItem('sx_service_return', 's-account'); sessionStorage.setItem('sx_activity_initial_tab', 'labor'); go('s-service-order-hirer'); }}
              style={{ background: '#5d4037', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
              Xem đơn
            </button>
          </div>
        </div>
      ))}
      {LABOR_HIRING_HISTORY.map(l => (
        <div key={l.id} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 10, padding: 8, marginBottom: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, background: C.pl, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>{l.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.t }}>{l.title}</div>
            <div style={{ fontSize: 9, color: C.m }}>{l.date}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.p }}>{l.price}</div>
            <div style={{ fontSize: 9, background: '#e8f5e9', color: '#2e7d32', padding: '1px 6px', borderRadius: 8 }}>{l.badge}</div>
          </div>
        </div>
      ))}

      <div style={{ height: 14 }} />

      {/* KHỐI DƯỚI — Đang nhận việc làm (Shipper) */}
      <Sechdr num="🔽" title="Đang nhận việc làm (Shipper)" />
      <div onClick={() => { sessionStorage.setItem('sx_shipper_orders_return', 's-account'); sessionStorage.setItem('sx_activity_initial_tab', 'labor'); go('s-shipper-orders'); }}
        style={{ background: '#e8f0fe', border: '1px solid #c5d8ff', borderRadius: 12, padding: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>🚚</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1a237e' }}>{PENDING_ORDERS.length} đơn giao hàng đang chờ nhận</div>
          <div style={{ fontSize: 10, color: '#3949ab' }}>Xem, nhận hoặc từ chối đơn</div>
        </div>
        <span style={{ fontSize: 16, color: '#1a237e' }}>›</span>
      </div>
    </div>
  );
}

function OrdersContent({ go }) {
  const initialTab = sessionStorage.getItem('sx_orders_initial_tab') || 'all';
  sessionStorage.removeItem('sx_orders_initial_tab');
  const [tab, setTab] = useState(initialTab);
  const [expandedId, setExpandedId] = useState(null);
  const [, forceRender] = useState(0); // ép render lại sau khi đổi trạng thái đã xử lý
  const resolved = getResolvedOrders();

  const tabs = [
    { id: 'all',      label: 'Tất cả' },
    { id: 'shipping', label: 'Đang giao' },
    { id: 'issue',     label: 'Vấn đề' },
    { id: 'resolved', label: 'Đã xử lý' },
  ];
  const filtered = ORDERS_DATA.filter(o => {
    const isResolved = resolved.includes(o.id);
    if (tab === 'all') return true;
    if (tab === 'shipping') return o.status === 'shipping';
    if (tab === 'issue') return isIssueOrder(o) && !isResolved;
    if (tab === 'resolved') return isResolved;
    return true;
  });
  const issueCount = ORDERS_DATA.filter(o => isIssueOrder(o) && !resolved.includes(o.id)).length;

  const statusInfo = {
    pending:       { label: 'Chờ người bán', bg: '#fff3e0', color: '#e65100' },
    auto_approved: { label: 'Đã duyệt (tự động)', bg: '#e8f5e9', color: '#2e7d32' },
    cancelled:     { label: 'Đã hủy', bg: '#ffebee', color: '#c62828' },
    shipping:      { label: 'Đang giao', bg: '#e3f2fd', color: '#1565c0' },
    completed:     { label: 'Hoàn thành', bg: '#e8f5e9', color: '#2e7d32' },
  };

  return (
    <>
      <div style={{ padding: 12 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: `1px solid ${tab === t.id ? C.p : C.b}`, background: tab === t.id ? C.p : C.w, color: tab === t.id ? '#fff' : C.m, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>
              {t.label}{t.id === 'issue' && issueCount > 0 ? ` (${issueCount})` : ''}
            </button>
          ))}
        </div>
        <div style={{ marginBottom: 10 }}>
          <button onClick={() => go('s-order-report')}
            style={{ width: '100%', background: C.pl, color: C.pd, border: 'none', padding: 9, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            📊 Xem báo cáo tổng hợp
          </button>
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: C.m, fontSize: 12, padding: '30px 0' }}>Không có đơn nào ở mục này.</div>
        )}

        {filtered.map(o => {
          const si = statusInfo[o.status];
          const isResolved = resolved.includes(o.id);
          const expanded = expandedId === o.id;
          return (
            <div key={o.id} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 10, marginBottom: 8 }}>
              <div onClick={() => setExpandedId(expanded ? null : o.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, background: C.pl, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{o.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.t, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.product}</div>
                  <div style={{ fontSize: 10, color: C.m }}>{o.counterpart}</div>
                </div>
                <span style={{ fontSize: 9, background: isResolved ? '#e8f5e9' : si.bg, color: isResolved ? '#2e7d32' : si.color, padding: '3px 8px', borderRadius: 8, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {isResolved ? '✅ Đã xử lý' : si.label}
                </span>
              </div>
              {expanded && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f0ebfa' }}>
                  {o.reason && <div style={{ fontSize: 11, color: C.m, marginBottom: 6 }}>Lý do: {o.reason}</div>}
                  {o.hoursLeft && !isResolved && (
                    <div style={{ fontSize: 10, color: '#e65100', marginBottom: 6 }}>⏳ Còn {o.hoursLeft}h trước khi tự động duyệt</div>
                  )}
                  <div style={{ marginBottom: 8 }}>
                    {o.timeline.map((t, i) => (
                      <div key={i} style={{ fontSize: 10, color: C.m, marginBottom: 3 }}>• {t}</div>
                    ))}
                  </div>
                  {isIssueOrder(o) && !isResolved && (
                    <button onClick={() => { markOrderResolved(o.id); forceRender(n => n + 1); }}
                      style={{ width: '100%', background: '#2e7d32', color: '#fff', border: 'none', padding: 8, borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      ✅ Hoàn thành xử lý
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ height: 80 }} />
    </>
  );
}

function OrderReportScreen({ go }) {
  const resolved = getResolvedOrders();
  const issues = ORDERS_DATA.filter(isIssueOrder);
  const resolvedIssues = issues.filter(o => resolved.includes(o.id));
  const pendingIssues = issues.filter(o => !resolved.includes(o.id));
  const byType = {
    return: ORDERS_DATA.filter(o => o.type === 'return').length,
    cancel: ORDERS_DATA.filter(o => o.type === 'cancel').length,
  };
  return (
    <div>
      <Shdr title="📊 Báo cáo đơn hàng" onBack={() => { sessionStorage.setItem('sx_activity_initial_tab', 'orders'); go('s-account'); }} />
      <div style={{ padding: 12 }}>
        <Infobox text="Tổng hợp từ toàn bộ đơn hàng có vấn đề — dùng để theo dõi hiệu quả xử lý và báo cáo khi cần." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { val: issues.length, lbl: 'Tổng đơn vấn đề', color: C.p },
            { val: resolvedIssues.length, lbl: 'Đã xử lý', color: '#2e7d32' },
            { val: pendingIssues.length, lbl: 'Còn chờ', color: '#e65100' },
          ].map((s, i) => (
            <div key={i} style={{ background: C.pl, borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 9, color: C.m, marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 8 }}>Phân loại theo nguyên nhân</div>
          {[{ lbl: '↩️ Hoàn trả', val: byType.return }, { lbl: '❌ Hủy đơn', val: byType.cancel }].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0', borderBottom: i === 0 ? '1px solid #f0ebfa' : 'none' }}>
              <span style={{ color: C.m }}>{r.lbl}</span><span style={{ fontWeight: 600, color: C.t }}>{r.val}</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 10, padding: '10px 12px', fontSize: 11, color: '#795500', lineHeight: 1.5 }}>
          💡 Muốn nhận báo cáo này tự động qua email hàng tháng? Tính năng đang được phát triển, sẽ có trong bản cập nhật sau.
        </div>
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}

const CONTRACTS_DATA = [
  { id: 'c1', kolId: 'SX-00204', kol: 'Chị Thu Hương', platform: '🎵 TikTok', product: 'Bàn ăn gỗ sồi 6 ghế', productId: 'p7', price: 3500000, link: 'shopx.vn/s/kol-a8f3x2',
    clicks: 342, views: 280, carts: 45, orders: 12, completed: 10, cancelled: 1, returned: 1, reviews: 9, avgRating: 4.8 },
  { id: 'c2', kolId: 'SX-00204', kol: 'Chị Thu Hương', platform: '🎵 TikTok', product: 'Tủ lạnh Samsung Inverter 236L', productId: 'p6', price: 4200000, link: 'shopx.vn/s/kol-a8f3x2-2',
    clicks: 120, views: 95, carts: 15, orders: 4, completed: 4, cancelled: 0, returned: 0, reviews: 3, avgRating: 4.7 },
  { id: 'c3', kolId: 'SX-00205', kol: 'Anh Minh Tuấn', platform: '📷 Instagram', product: 'Xe đạp Trek FX3 2022', productId: 'p10', price: 8200000, link: 'shopx.vn/s/kol-b91k7p',
    clicks: 156, views: 120, carts: 18, orders: 3, completed: 3, cancelled: 0, returned: 0, reviews: 3, avgRating: 5.0 },
  { id: 'c4', kolId: 'SX-00206', kol: 'Bé Gạo Vlog', platform: '▶️ YouTube', product: 'iPhone 13 Pro 256GB — Sierra Blue', productId: 'p1', price: 18500000, link: 'shopx.vn/s/kol-c4m2q8',
    clicks: 89, views: 70, carts: 8, orders: 1, completed: 0, cancelled: 0, returned: 1, reviews: 0, avgRating: 0 },
];

function KolCampaignScreen({ go }) {
  // Cấp GỐC: mỗi dòng = 1 Hợp đồng = đúng 1 KOL + đúng 1 Sản phẩm (1 KOL có thể có nhiều hợp đồng, nhiều sản phẩm)
  const kolLiveCarts = (() => { try { return JSON.parse(sessionStorage.getItem('sx_kol_live_carts') || '{}'); } catch (e) { return {}; } })();
  const contracts = CONTRACTS_DATA.map(c => {
    const liveAdd = kolLiveCarts[c.id] || 0;
    const carts = c.carts + liveAdd;
    return { ...c, carts, liveAdd, revenueGross: c.orders * c.price, revenueNet: c.completed * c.price, fee: c.completed * calcPlatformFee(c.price), cvr: c.orders / c.clicks * 100, badRate: c.orders ? (c.cancelled + c.returned) / c.orders * 100 : 0 };
  });

  const [tab, setTab] = useState('kol'); // kol | product | contract
  const fmt = n => n.toLocaleString('vi-VN') + 'đ';

  // Gộp theo KOL
  const byKol = {};
  contracts.forEach(c => {
    if (!byKol[c.kol]) byKol[c.kol] = { name: c.kol, kolId: c.kolId, platform: c.platform, items: [], clicks: 0, views: 0, carts: 0, orders: 0, completed: 0, cancelled: 0, returned: 0, revenueGross: 0, revenueNet: 0, fee: 0 };
    const k = byKol[c.kol];
    k.items.push(c); k.clicks += c.clicks; k.views += c.views; k.carts += c.carts; k.orders += c.orders;
    k.completed += c.completed; k.cancelled += c.cancelled; k.returned += c.returned; k.revenueGross += c.revenueGross; k.revenueNet += c.revenueNet; k.fee += c.fee;
  });
  const kolList = Object.values(byKol).map(k => ({ ...k, cvr: k.orders / k.clicks * 100, netReceived: k.revenueNet - k.fee }))
    .sort((a, b) => b.cvr - a.cvr); // tự sắp KOL hiệu quả nhất lên đầu

  // Gộp theo Sản phẩm
  const byProduct = {};
  contracts.forEach(c => {
    if (!byProduct[c.product]) byProduct[c.product] = { name: c.product, kols: new Set(), clicks: 0, views: 0, carts: 0, orders: 0, completed: 0, cancelled: 0, returned: 0, revenueGross: 0, revenueNet: 0 };
    const p = byProduct[c.product];
    p.kols.add(c.kol); p.clicks += c.clicks; p.views += c.views; p.carts += c.carts; p.orders += c.orders;
    p.completed += c.completed; p.cancelled += c.cancelled; p.returned += c.returned; p.revenueGross += c.revenueGross; p.revenueNet += c.revenueNet;
  });
  const productList = Object.values(byProduct).map(p => ({ ...p, kolCount: p.kols.size, cvr: p.orders / p.clicks * 100 }))
    .sort((a, b) => b.orders - a.orders); // sản phẩm bán chạy nhất lên đầu

  const total = contracts.reduce((s, c) => ({
    clicks: s.clicks + c.clicks, views: s.views + c.views, carts: s.carts + c.carts, orders: s.orders + c.orders,
    completed: s.completed + c.completed, cancelled: s.cancelled + c.cancelled, returned: s.returned + c.returned,
    revenueGross: s.revenueGross + c.revenueGross, revenueNet: s.revenueNet + c.revenueNet, fee: s.fee + c.fee,
  }), { clicks: 0, views: 0, carts: 0, orders: 0, completed: 0, cancelled: 0, returned: 0, revenueGross: 0, revenueNet: 0, fee: 0 });
  const cvr = (total.orders / total.clicks * 100).toFixed(1);
  const badRateTotal = total.orders ? ((total.cancelled + total.returned) / total.orders * 100).toFixed(1) : '0.0';
  const netReceived = total.revenueNet - total.fee;

  const tabs = [
    { id: 'kol', label: '👤 Theo KOL' },
    { id: 'product', label: '📦 Theo Sản phẩm' },
    { id: 'contract', label: '📄 Từng hợp đồng' },
  ];

  return (
    <div>
      <Shdr title="Chiến dịch KOL" onBack={() => go('s-account')} />
      <div style={{ padding: 12 }}>
        <Infobox text="Đơn hàng được tự động gắn đúng KOL + đúng sản phẩm khi khách mua trong vòng 7 ngày sau khi bấm link — không cần bạn tự đối chiếu." />

        {/* Phễu chuyển đổi tổng */}
        <Sechdr num="🔻" title="Phễu chuyển đổi (toàn bộ chiến dịch)" />
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 14 }}>
          {[
            { lbl: 'Lượt bấm link', val: total.clicks },
            { lbl: 'Xem sản phẩm', val: total.views },
            { lbl: 'Thêm giỏ hàng / Lưu', val: total.carts },
            { lbl: 'Đặt hàng', val: total.orders },
            { lbl: 'Giao thành công', val: total.completed },
          ].map((r, i) => {
            const pct = (r.val / total.clicks) * 100;
            return (
              <div key={i} style={{ marginBottom: i < 4 ? 8 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: C.m }}>{r.lbl}</span>
                  <span style={{ fontWeight: 600, color: C.t }}>{r.val} <span style={{ color: C.m, fontWeight: 400 }}>({pct.toFixed(1)}%)</span></span>
                </div>
                <div style={{ background: '#f0ebfa', borderRadius: 6, height: 6 }}>
                  <div style={{ background: i === 4 ? '#2e7d32' : C.p, borderRadius: 6, height: 6, width: `${Math.max(pct, 2)}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Chỉ số tổng quan */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
          {[
            { val: total.clicks, lbl: 'Lượt bấm link', color: C.p },
            { val: total.orders, lbl: 'Đơn phát sinh', color: '#2e7d32' },
            { val: `${cvr}%`, lbl: 'Tỷ lệ chuyển đổi', color: '#e65100' },
          ].map((s, i) => (
            <div key={i} style={{ background: C.pl, borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 9, color: C.m, marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Cảnh báo rủi ro hủy/hoàn trả — dẫn thẳng vào Đơn hàng của tôi, lọc sẵn tab Vấn đề */}
        <div onClick={() => { sessionStorage.setItem('sx_orders_initial_tab', 'issue'); sessionStorage.setItem('sx_activity_initial_tab', 'orders'); go('s-account'); }}
          style={{ background: badRateTotal > 15 ? '#ffebee' : '#fff8e1', border: `1px solid ${badRateTotal > 15 ? '#ef9a9a' : '#ffe082'}`, borderRadius: 10, padding: '8px 12px', marginBottom: 14, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: badRateTotal > 15 ? '#c62828' : '#e65100' }}>⚠️ Tỷ lệ hủy/hoàn trả chung</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: badRateTotal > 15 ? '#c62828' : '#e65100' }}>{badRateTotal}% ({total.cancelled} hủy, {total.returned} hoàn trả)</span>
          </div>
          <div style={{ fontSize: 10, color: badRateTotal > 15 ? '#c62828' : '#e65100', textAlign: 'right', marginTop: 4, fontWeight: 600, textDecoration: 'underline' }}>Xem chi tiết & xử lý ›</div>
        </div>

        {/* Doanh thu — 3 tầng: tạm tính / thực / thực về tay */}
        <Sechdr num="💰" title="Doanh thu" />
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 6 }}>
          {[
            { lbl: 'Doanh thu tạm tính', sub: 'gồm cả đơn chưa chắc thành công', val: total.revenueGross, color: C.t },
            { lbl: 'Doanh thu thực', sub: 'chỉ tính đơn đã giao thành công', val: total.revenueNet, color: '#2e7d32' },
            { lbl: 'Phí nền tảng ShopX', sub: 'theo bậc giá trị từng đơn', val: -total.fee, color: '#c62828' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0', borderBottom: i < 2 ? '1px solid #f5f0ff' : 'none' }}>
              <div>
                <div style={{ fontSize: 12, color: C.t }}>{r.lbl}</div>
                <div style={{ fontSize: 9, color: C.m }}>{r.sub}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.val < 0 ? '-' : ''}{fmt(Math.abs(r.val))}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, marginTop: 4, borderTop: `2px solid ${C.pl}` }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.t }}>Số tiền thực về tay bạn</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#2e7d32' }}>{fmt(netReceived)}</span>
          </div>
        </div>
        <div style={{ fontSize: 10, color: C.m, marginBottom: 16, lineHeight: 1.5 }}>
          🔜 Chưa gồm nghĩa vụ thuế (bạn tự kê khai theo quy định hiện hành). Khi ShopX kích hoạt thanh toán trong app, báo cáo sẽ tự động bổ sung khấu trừ thuế GTGT/TNCN theo đúng Nghị định 117/2025.
        </div>

        {/* Tabs xem theo góc độ khác nhau */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: `1px solid ${tab === t.id ? C.p : C.b}`, background: tab === t.id ? C.p : C.w, color: tab === t.id ? '#fff' : C.m, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: Theo KOL */}
        {tab === 'kol' && kolList.map((k, i) => (
          <div key={i} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span onClick={() => {
                      const w = WORKERS_DATA.find(w => w.id === k.kolId);
                      if (w) { sessionStorage.setItem('sx_view_profile', JSON.stringify(w)); sessionStorage.setItem('sx_profile_return', 's-kol-campaign'); go('s-worker-profile'); }
                    }}
                    style={{ fontSize: 13, fontWeight: 600, color: C.pd, cursor: 'pointer', textDecoration: 'underline' }}>{k.name}</span>
                  <span style={{ fontSize: 9, background: kolLabel(k.kolId) === 'KOL' ? '#e3f2fd' : '#fce4ec', color: kolLabel(k.kolId) === 'KOL' ? '#1565c0' : '#ad1457', padding: '2px 6px', borderRadius: 8, fontWeight: 700 }}>
                    {kolLabel(k.kolId)} · {fmtFollowers(KOL_FOLLOWERS_BY_ID[k.kolId] || 0)} follower
                  </span>
                  {i === 0 && <span style={{ fontSize: 9, background: '#fff3e0', color: '#e65100', padding: '2px 6px', borderRadius: 8, fontWeight: 700 }}>🏆 Hiệu quả nhất</span>}
                </div>
                <div style={{ fontSize: 11, color: C.m }}>{k.platform} · {k.items.length} hợp đồng ({k.items.map(it => it.product).join(', ')})</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#2e7d32' }}>{fmt(k.netReceived)}</div>
                <div style={{ fontSize: 9, color: C.m }}>thực về tay</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginBottom: 8, textAlign: 'center' }}>
              {[{ v: k.clicks, l: 'Bấm' }, { v: k.views, l: 'Xem' }, { v: k.carts, l: 'Giỏ hàng' }, { v: k.orders, l: 'Đặt' }, { v: k.completed, l: 'Thành công' }].map((s, j) => (
                <div key={j} style={{ background: C.pl, borderRadius: 6, padding: '4px 2px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.p }}>{s.v}</div>
                  <div style={{ fontSize: 8, color: C.m }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, background: '#e3f2fd', color: '#1565c0', padding: '3px 8px', borderRadius: 8, fontWeight: 600 }}>📈 {k.cvr.toFixed(1)}% chuyển đổi</span>
              {(k.cancelled + k.returned) > 0 && (
                <span style={{ fontSize: 10, background: '#fff3e0', color: '#e65100', padding: '3px 8px', borderRadius: 8, fontWeight: 600 }}>⚠️ {k.cancelled} hủy · {k.returned} hoàn trả</span>
              )}
            </div>
          </div>
        ))}

        {/* TAB: Theo Sản phẩm */}
        {tab === 'product' && productList.map((p, i) => (
          <div key={i} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.t }}>{p.name}</span>
                  {i === 0 && <span style={{ fontSize: 9, background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: 8, fontWeight: 700 }}>🔥 Bán chạy nhất</span>}
                </div>
                <div style={{ fontSize: 11, color: C.m }}>Đang được {p.kolCount} KOL quảng bá</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#2e7d32' }}>{fmt(p.revenueNet)}</div>
                <div style={{ fontSize: 9, color: C.m }}>{p.completed}/{p.orders} đơn thành công</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, textAlign: 'center' }}>
              {[{ v: p.clicks, l: 'Bấm' }, { v: p.views, l: 'Xem' }, { v: p.carts, l: 'Giỏ hàng' }, { v: p.orders, l: 'Đặt' }, { v: p.completed, l: 'Thành công' }].map((s, j) => (
                <div key={j} style={{ background: C.pl, borderRadius: 6, padding: '4px 2px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.p }}>{s.v}</div>
                  <div style={{ fontSize: 8, color: C.m }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* TAB: Từng hợp đồng (cấp gốc, chi tiết nhất) */}
        {tab === 'contract' && contracts.map((c, i) => (
          <div key={i} style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: 12, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span onClick={() => {
                      const w = WORKERS_DATA.find(w => w.id === c.kolId);
                      if (w) { sessionStorage.setItem('sx_view_profile', JSON.stringify(w)); sessionStorage.setItem('sx_profile_return', 's-kol-campaign'); go('s-worker-profile'); }
                    }}
                    style={{ fontSize: 13, fontWeight: 600, color: C.pd, cursor: 'pointer', textDecoration: 'underline' }}>{c.kol}</span>
                  <span style={{ fontSize: 9, background: kolLabel(c.kolId) === 'KOL' ? '#e3f2fd' : '#fce4ec', color: kolLabel(c.kolId) === 'KOL' ? '#1565c0' : '#ad1457', padding: '2px 6px', borderRadius: 8, fontWeight: 700 }}>
                    {kolLabel(c.kolId)}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: C.m }}>
                  {c.platform} ·{' '}
                  <span onClick={() => { sessionStorage.setItem('sx_product_return', 's-kol-campaign'); go(`s-prod${c.productId.slice(1)}`); }}
                    style={{ color: C.pd, cursor: 'pointer', textDecoration: 'underline' }}>{c.product}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#2e7d32' }}>{fmt(c.revenueNet)}</div>
                <div style={{ fontSize: 9, color: C.m }}>{c.completed}/{c.orders} đơn thành công</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: C.pd, marginBottom: 8, wordBreak: 'break-all' }}>🔗 {c.link}</div>
            {c.liveAdd > 0 && (
              <div style={{ fontSize: 10, color: '#e53935', marginBottom: 6, fontWeight: 600 }}>🔴 Vừa cập nhật sống: +{c.liveAdd} giỏ hàng (bạn vừa bấm "Thêm vào giỏ" trong phiên demo này)</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginBottom: 6, textAlign: 'center' }}>
              {[{ v: c.clicks, l: 'Bấm' }, { v: c.views, l: 'Xem' }, { v: c.carts, l: 'Giỏ hàng' }, { v: c.orders, l: 'Đặt' }, { v: c.completed, l: 'Thành công' }].map((s, j) => (
                <div key={j} style={{ background: C.pl, borderRadius: 6, padding: '4px 2px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.p }}>{s.v}</div>
                  <div style={{ fontSize: 8, color: C.m }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, background: '#e3f2fd', color: '#1565c0', padding: '3px 8px', borderRadius: 8, fontWeight: 600 }}>📈 {c.cvr.toFixed(1)}% chuyển đổi</span>
              {c.reviews > 0 && <span style={{ fontSize: 10, background: '#fff8e1', color: '#e65100', padding: '3px 8px', borderRadius: 8, fontWeight: 600 }}>⭐ {c.avgRating} ({c.reviews})</span>}
              {(c.cancelled + c.returned) > 0 && <span style={{ fontSize: 10, background: c.badRate > 15 ? '#ffebee' : '#fff3e0', color: c.badRate > 15 ? '#c62828' : '#e65100', padding: '3px 8px', borderRadius: 8, fontWeight: 600 }}>⚠️ {c.cancelled} hủy · {c.returned} hoàn trả</span>}
            </div>
          </div>
        ))}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}


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
function PreviewPostScreen({ go, hasCCCD }) {
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
    if (priceNum >= 500000 && !hasCCCD) {
      sessionStorage.setItem('sx_kyc_return', 's-preview-post');
      sessionStorage.setItem('sx_kyc_reason', 'đăng tin giá trị cao (từ 500.000đ)');
      go('s-kyc');
      return;
    }
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
function AccountScreen({ go, nav, doLogout, hasCCCD, isShipper }) {
  const [accType, setAccType] = React.useState('personal'); // personal | business (đã nâng cấp)
  const [showUpgrade, setShowUpgrade] = React.useState(false);
  const [avatarImg, setAvatarImg] = React.useState(null); // ảnh thật đọc từ máy — chỉ tồn tại trong phiên, chưa lưu vĩnh viễn
  const businessInfo = { name: 'CTY TNHH MTV ABC', mst: '000000001-ABC', address: '123 KP Nhị Hòa, P. Trấn Biên, TP. Đồng Nai' };

  function pickAvatar(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Vui lòng chọn đúng file ảnh.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Ảnh quá lớn — vui lòng chọn ảnh dưới 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = ev => setAvatarImg(ev.target.result); // data URL — trình duyệt tự đọc, không upload đâu cả
    reader.readAsDataURL(file);
  }

  function approveUpgrade() {
    setAccType('business');
    setShowUpgrade(false);
  }

  return (
    <div>
      <Shdr title="Tài khoản của tôi" />
      <div style={{ padding: 12 }}>

        {/* 1. HỒ SƠ — gọn, 1 dòng rating + badge icon nhỏ */}
        <div style={{ background: C.w, padding: 12, borderRadius: 12, border: '1px solid #e8def8', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
              <input type="file" accept="image/*" onChange={pickAvatar} style={{ display: 'none' }} />
              {avatarImg ? (
                <img src={avatarImg} alt="Ảnh đại diện" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <Avatar initials="KV" size={48} />
              )}
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: C.p, border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>📷</div>
            </label>
            <div style={{ flex: 1, minWidth: 0 }}>
              {accType === 'business' && (
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1565c0' }}>🏢 {businessInfo.name}</div>
              )}
              <div style={{ fontSize: accType === 'business' ? 12 : 15, fontWeight: accType === 'business' ? 400 : 600, color: accType === 'business' ? C.m : C.t }}>Khoavinhcuu113</div>
              <div style={{ fontSize: 11, color: C.m, display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                <span>SX-00001</span>
                <span style={{ color: '#f59e0b' }}>⭐ 4.8 (34)</span>
                {hasCCCD && (
                  <span title="Đã xác minh đầy đủ: Số điện thoại + Căn cước"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 15, height: 15, borderRadius: '50%', background: '#1976d2', color: '#fff', fontSize: 9, lineHeight: 1 }}>✓</span>
                )}
              </div>
            </div>
          </div>

          {accType === 'business' && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0ebfa', fontSize: 11, color: C.m }}>
              <div>MST: {businessInfo.mst} · {businessInfo.address}</div>
              <div style={{ marginTop: 4, color: '#9e9e9e', fontSize: 10 }}>
                🔒 Hồ sơ đầy đủ chỉ Admin và bạn (chủ tài khoản) xem/sửa được
              </div>
            </div>
          )}
        </div>

        {accType === 'business' && (
          <div onClick={() => go('s-service')}
            style={{ background: '#fce4ec', border: '1px solid #f8bbd0', borderRadius: 12, padding: '10px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 18 }}>🎥</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#ad1457' }}>Tìm KOL/KOC quảng bá sản phẩm</div>
              <div style={{ fontSize: 10, color: '#c2185b' }}>Xem hồ sơ người quảng bá đã có sẵn trong Dịch vụ & Việc làm</div>
            </div>
            <span style={{ fontSize: 16, color: '#ad1457' }}>›</span>
          </div>
        )}
        {accType === 'business' && (
          <div onClick={() => go('s-kol-campaign')}
            style={{ background: '#fce4ec', border: '1px solid #f8bbd0', borderRadius: 12, padding: '10px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 18 }}>📊</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#ad1457' }}>Chiến dịch KOL đang chạy</div>
              <div style={{ fontSize: 10, color: '#c2185b' }}>Theo dõi lượt bấm link, đơn hàng, doanh thu từng KOL</div>
            </div>
            <span style={{ fontSize: 16, color: '#ad1457' }}>›</span>
          </div>
        )}
        {/* Banner gợi ý xác minh CCCD sớm — tự nguyện, giọng lợi ích */}
        {!hasCCCD && (
          <div onClick={() => { sessionStorage.setItem('sx_kyc_return', 's-account'); sessionStorage.setItem('sx_kyc_reason', 'mở khóa toàn bộ quyền lợi tài khoản'); go('s-kyc'); }}
            style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 12, padding: '10px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 18 }}>🎁</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32' }}>Xác minh danh tính ngay để nhận quyền lợi</div>
              <div style={{ fontSize: 10, color: '#388e3c' }}>+50 SX Points · Huy hiệu uy tín · Ưu tiên hiển thị · Đăng tin không giới hạn</div>
            </div>
            <span style={{ fontSize: 16, color: '#2e7d32' }}>›</span>
          </div>
        )}

        {/* 2. LOẠI TÀI KHOẢN — banner nâng cấp (chỉ hiện khi còn cá nhân) */}
        {accType === 'personal' && !showUpgrade && (
          <div onClick={() => setShowUpgrade(true)}
            style={{ background: '#e8f0fe', border: '1px solid #c5d8ff', borderRadius: 12, padding: '10px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <span style={{ fontSize: 18 }}>🏢</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a237e' }}>Nâng cấp lên Doanh nghiệp</div>
              <div style={{ fontSize: 10, color: '#1565c0' }}>Quảng cáo · Ưu tiên hiển thị · Huy hiệu xác minh</div>
            </div>
            <span style={{ fontSize: 16, color: '#1565c0' }}>›</span>
          </div>
        )}

        {showUpgrade && (
          <div style={{ background: '#e3f2fd', borderRadius: 12, padding: 12, marginBottom: 8, border: '1px solid #bbdefb' }}>
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
              <div style={{ background: '#fff3e0', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: '#e65100' }}>
                ℹ️ ShopX xác minh MST qua Cổng ĐKKD quốc gia. Không cần upload giấy phép. Admin xét duyệt trong 24h.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowUpgrade(false)} style={{ flex: 1, background: 'none', color: '#1565c0', border: '1px solid #90caf9', padding: 9, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  Hủy
                </button>
                <button onClick={approveUpgrade} style={{ flex: 2, background: '#1565c0', color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  📤 Gửi yêu cầu nâng cấp
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. GIAN HÀNG */}
        <button
          onClick={() => go('s-my-store')}
          style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          🏪 Xem gian hàng {accType === 'business' ? 'Doanh nghiệp' : 'Cá nhân'} của tôi
        </button>

        {/* 4. THỐNG KÊ HOẠT ĐỘNG — dùng lại RatingStats có sẵn, đồng bộ với cả app */}
        {(() => {
          const [activeTab, setActiveTab] = React.useState('seller');
          const isKoc = WORKERS_DATA.some(w => w.id === 'SX-00001');
          const sellerLevel  = getRatingLevel(SAMPLE_USER_RATINGS.seller.totalOrders,  SAMPLE_USER_RATINGS.seller.completionRate);
          const buyerLevel   = getRatingLevel(SAMPLE_USER_RATINGS.buyer.totalOrders,   SAMPLE_USER_RATINGS.buyer.receiveRate);
          const shipperLevel = getRatingLevel(SAMPLE_USER_RATINGS.shipper.totalOrders, SAMPLE_USER_RATINGS.shipper.onTimeRate);
          const kocLevel     = getRatingLevel(SAMPLE_USER_RATINGS.koc.totalOrders,     SAMPLE_USER_RATINGS.koc.completionRate);
          const dataMap = { seller: SAMPLE_USER_RATINGS.seller, buyer: SAMPLE_USER_RATINGS.buyer, shipper: SAMPLE_USER_RATINGS.shipper, koc: SAMPLE_USER_RATINGS.koc };
          const d = dataMap[activeTab];
          const tabs = [
            { key: 'seller',  label: 'Bán',     level: sellerLevel  },
            { key: 'buyer',   label: 'Mua',     level: buyerLevel   },
          ];
          if (isShipper) tabs.push({ key: 'shipper', label: 'Shipper', level: shipperLevel });
          if (isKoc) tabs.push({ key: 'koc', label: 'KOC/KOL', level: kocLevel });
          return (
            <div style={{ background: C.w, borderRadius: 12, border: '1px solid #e8def8', padding: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 6 }}>📊 Thống kê hoạt động</div>
              <div style={{ display: 'flex', background: '#f0ebfa', padding: 2, borderRadius: 8, marginBottom: 8, gap: 2 }}>
                {tabs.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    style={{ flex: 1, padding: '4px 4px', borderRadius: 6, border: 'none', fontSize: 10, cursor: 'pointer', fontWeight: activeTab === t.key ? 600 : 400, background: activeTab === t.key ? C.w : 'none', color: activeTab === t.key ? C.p : C.m }}>
                    {t.label} · {t.level.label}
                  </button>
                ))}
              </div>
              <RatingStats role={activeTab} data={d} />
              {activeTab === 'seller' && d.disputes > 0 && (
                <div style={{ fontSize: 10, color: '#e65100', marginTop: 6 }}>⚠️ {d.disputes} tranh chấp</div>
              )}
            </div>
          );
        })()}

        {/* SX Points — thẻ đơn, đầy chiều rộng (không còn trùng lặp Tích cực) */}
        <div style={{ background: C.pl, borderRadius: 10, padding: 10, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: C.m }}>💎 SX Points tích lũy</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: C.p }}>1.250</span>
        </div>

        {/* 3 TAB NGANG HÀNG — Tin đăng / Đơn hàng / Lao động — NẰM NGAY TRONG TÀI KHOẢN, không điều hướng ra màn khác */}
        {(() => {
          const [subTab, setSubTab] = React.useState(() => sessionStorage.getItem('sx_activity_initial_tab') || 'listings');
          React.useEffect(() => { sessionStorage.removeItem('sx_activity_initial_tab'); }, []);
          const resolved = getResolvedOrders();
          const issueCount = ORDERS_DATA.filter(o => isIssueOrder(o) && !resolved.includes(o.id)).length;
          const subTabs = [
            { id: 'listings', label: '📋 Tin đăng' },
            { id: 'orders',   label: '📦 Đơn hàng', count: issueCount },
            { id: 'labor',    label: '🔧 Lao động' },
          ];
          return (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', background: '#f0ebfa', padding: 2, borderRadius: 8, gap: 2, marginBottom: 10 }}>
                {subTabs.map(t => (
                  <button key={t.id} onClick={() => setSubTab(t.id)}
                    style={{ flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', background: subTab === t.id ? C.w : 'none', color: subTab === t.id ? C.p : C.m }}>
                    {t.label}{t.count > 0 ? ` (${t.count})` : ''}
                  </button>
                ))}
              </div>
              {subTab === 'listings' && <ListingsContent go={go} />}
              {subTab === 'orders'   && <OrdersContent go={go} />}
              {subTab === 'labor'    && <LaborContent go={go} />}
            </div>
          );
        })()}

        {/* GIỎ HÀNG CỦA TÔI — giữ riêng, không gộp tab (đường dẫn tắt đơn lẻ) */}
        <div onClick={() => { sessionStorage.setItem('sx_cart_return', 's-account'); go('s-cart'); }}
          style={{ background: '#fff3e0', border: '1px solid #ffe082', borderRadius: 12, padding: '10px 12px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <span style={{ fontSize: 18 }}>🛒</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e65100' }}>Giỏ hàng của tôi</div>
            <div style={{ fontSize: 10, color: '#bf360c' }}>
              {(() => { try { const n = JSON.parse(sessionStorage.getItem('sx_cart') || '[]').reduce((s, c) => s + c.qty, 0); return n > 0 ? `${n} sản phẩm đang chờ đặt hàng` : 'Chưa có sản phẩm nào'; } catch (e) { return 'Chưa có sản phẩm nào'; } })()}
            </div>
          </div>
          <span style={{ fontSize: 16, color: '#e65100' }}>›</span>
        </div>

        {/* 7. CÀI ĐẶT — gọn, danh sách hàng mỏng */}
        <div style={{ background: C.w, border: '1px solid #e8def8', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
          {[
            { icon: '📱', label: 'QR Code gian hàng của tôi', action: () => go('s-qr') },
            { icon: '📋', label: 'Quy chế & Điều khoản',      action: () => go('s-terms') },
          ].map((it, i) => (
            <div key={i} onClick={it.action}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', cursor: 'pointer', borderBottom: i === 0 ? '1px solid #f0ebfa' : 'none' }}>
              <span style={{ fontSize: 15 }}>{it.icon}</span>
              <span style={{ flex: 1, fontSize: 12, color: C.t }}>{it.label}</span>
              <span style={{ color: C.m, fontSize: 13 }}>›</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { go('s-home'); nav('ni-home'); }}
            style={{ flex: 1, background: 'none', border: '1px solid #e0d4f7', color: C.m, padding: 9, borderRadius: 10, fontSize: 12, cursor: 'pointer' }}>
            🛍️ Tiếp tục mua sắm
          </button>
          <button onClick={doLogout}
            style={{ flex: 1, background: 'none', border: '1px solid #e0d4f7', color: C.m, padding: 9, borderRadius: 10, fontSize: 12, cursor: 'pointer' }}>
            🚪 Đăng xuất
          </button>
        </div>

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

// ─── REGISTER + PLEDGE ────────────────────────────────────────────────
// Demo: mô phỏng kết quả OCR đọc được từ CCCD sau khi chụp — thực tế sẽ là API OCR thật (VNPT eKYC/FPT.AI...)
const OCR_MOCK = { name: 'Lê Đăng Khoa', dob: '15/08/1995', address: 'KP Nhị Hòa, P. Trấn Biên, TP. Đồng Nai' };

function KYCScreen({ go, onComplete, backTo, actionLabel }) {
  const [frontDone, setFrontDone] = useState(false);
  const [backDone, setBackDone]   = useState(false);
  const [cccd, setCccd]           = useState('');
  const [phone] = useState('0901234567'); // demo: SĐT đã có sẵn của tài khoản
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const canConfirm = frontDone && backDone && cccd.replace(/\D/g, '').length === 12;

  function handleConfirm() {
    if (!canConfirm) { alert('Vui lòng chụp đủ 2 mặt Căn cước và nhập đúng 12 số Căn cước.'); return; }
    setConfirmed(true);
  }

  function handleFinish() {
    setProcessing(true);
    setTimeout(() => { onComplete(); }, 1200);
  }

  return (
    <div>
      <Shdr title="Xác minh danh tính" onBack={() => go(backTo || 's-home')} />
      <div style={{ padding: 12 }}>
        <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 12, padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#2e7d32', marginBottom: 6 }}>
            🎁 Xác minh danh tính để mở khóa{actionLabel ? ` — ${actionLabel}` : ''}:
          </div>
          <div style={{ fontSize: 11, color: '#388e3c', lineHeight: 1.8 }}>
            🏅 Badge "Người bán uy tín" trên gian hàng<br/>
            📈 Ưu tiên hiển thị khi khách tìm kiếm<br/>
            🎯 +50 SX Points ngay khi xác minh xong<br/>
            🛡️ Quyền lợi được bảo vệ
          </div>
        </div>
        <Infobox text="Dữ liệu Căn cước được ẩn, đảm bảo an toàn cho dữ liệu cá nhân của bạn." />
        <div onClick={() => go('s-terms-privacy')} style={{ fontSize: 11, color: C.pd, textDecoration: 'underline', cursor: 'pointer', marginBottom: 10 }}>
          Xem quyền dữ liệu cá nhân của bạn →
        </div>

        {!confirmed && (
          <>
            <Sechdr num="1" title="Chụp ảnh Căn cước (tự nguyện)" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              <div onClick={() => setFrontDone(true)} style={{ cursor: 'pointer' }}>
                {frontDone ? (
                  <div style={{ border: `1.5px solid #2e7d32`, borderRadius: 12, padding: 14, textAlign: 'center', background: '#e8f5e9' }}>
                    <div style={{ fontSize: 26, marginBottom: 4 }}>✅</div>
                    <p style={{ fontSize: 11, color: '#2e7d32', fontWeight: 600 }}>Mặt trước đã chụp</p>
                  </div>
                ) : (
                  <Upbox icon="🪪" text="Chụp mặt trước Căn cước" />
                )}
              </div>
              <div onClick={() => setBackDone(true)} style={{ cursor: 'pointer' }}>
                {backDone ? (
                  <div style={{ border: `1.5px solid #2e7d32`, borderRadius: 12, padding: 14, textAlign: 'center', background: '#e8f5e9' }}>
                    <div style={{ fontSize: 26, marginBottom: 4 }}>✅</div>
                    <p style={{ fontSize: 11, color: '#2e7d32', fontWeight: 600 }}>Mặt sau đã chụp</p>
                  </div>
                ) : (
                  <Upbox icon="🪪" text="Chụp mặt sau Căn cước" />
                )}
              </div>
            </div>

            {frontDone && (
              <div style={{ background: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: 10, padding: 10, marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1565c0', marginBottom: 6 }}>📄 Đã đọc được từ Căn cước (OCR tự động):</div>
                <div style={{ fontSize: 11, color: '#1976d2', lineHeight: 1.6 }}>
                  Họ tên: <b>{OCR_MOCK.name}</b><br/>
                  Ngày sinh: <b>{OCR_MOCK.dob}</b><br/>
                  Thường trú: <b>{OCR_MOCK.address}</b>
                </div>
                <div style={{ fontSize: 10, color: '#e65100', marginTop: 6 }}>
                  ⚠️ Thông tin này sẽ tự động thay thế phần bạn tự khai lúc đăng ký (nếu có khác biệt) — không cần chỉnh sửa gì thêm.
                </div>
              </div>
            )}

            <Sechdr num="2" title="Nhập số Căn cước" />
            <Fg label="Số Căn cước (12 số)" req>
              <Fi placeholder="VD: 079123456789" maxLength={12} inputMode="numeric"
                value={cccd} onChange={e => setCccd(e.target.value.replace(/\D/g, ''))} />
            </Fg>

            <Btn onClick={handleConfirm} disabled={!canConfirm} style={{ marginTop: 4 }}>
              Tiếp theo: Xem lại thông tin ➡️
            </Btn>
            <div style={{ height: 40 }} />
          </>
        )}

        {confirmed && !processing && (
          <>
            <Sechdr num="3" title="Xem lại thông tin trước khi hoàn tất" />
            <div style={{ fontSize: 11, color: C.m, marginBottom: 8 }}>Theo Căn cước xác minh: <b style={{ color: C.t }}>{OCR_MOCK.name}</b> · {OCR_MOCK.dob}</div>
            <MaskedField label="Số điện thoại" value={phone} keepStart={3} keepEnd={2} />
            <MaskedField label="Số Căn cước" value={cccd} keepStart={3} keepEnd={3} />
            <MaskedField label="Địa chỉ thường trú" value={OCR_MOCK.address} keepStart={0} keepEnd={0} />
            <Infobox icon="🔒" text="Chỉ bạn và Admin ShopX xem được thông tin đầy đủ. Người khác chỉ thấy tên/mã SX." bg="#fff3e0" color="#e65100" />
            <Btn onClick={handleFinish} style={{ marginTop: 4 }}>✅ Xác nhận & Hoàn tất đăng ký</Btn>
            <Btn2 onClick={() => setConfirmed(false)}>⬅️ Quay lại chỉnh sửa</Btn2>
            <div style={{ height: 40 }} />
          </>
        )}

        {processing && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
            <div style={{ fontSize: 13, color: C.m }}>Đang xác minh danh tính...</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Demo: mock 1 hồ sơ "đã tồn tại" để minh họa luồng — thực tế sẽ là API kiểm tra DB thật
const MOCK_EXISTING_PROFILES = [
  { phone: '0901234567', name: 'Nguyễn Văn A', missing: ['Khu vực'] },
];

function RegisterScreen({ go }) {
  const [method, setMethod]         = useState(null);   // 'phone' | 'email'
  const [step, setStep]             = useState('method'); // method | phone | email | otp | form
  const [phone, setPhone]           = useState('');
  const [email, setEmail]           = useState('');
  const [otp, setOtp]               = useState('');
  const [existing, setExisting]     = useState(null); // hồ sơ cũ tìm thấy sau khi xác thực OTP (null nếu là user mới)
  const [sending, setSending]       = useState(false);

  function chooseMethod(m) {
    setMethod(m);
    sessionStorage.setItem('sx_register_method', m);
    setStep(m === 'phone' ? 'phone' : 'email');
  }

  function sendOtp() {
    if (phone.replace(/\D/g, '').length < 9) { alert('Vui lòng nhập đúng số điện thoại.'); return; }
    setSending(true);
    setTimeout(() => { setSending(false); setStep('otp'); }, 800);
  }

  function verifyOtp() {
    if (otp.replace(/\D/g, '').length !== 6) { alert('Vui lòng nhập đủ 6 số OTP.'); return; }
    // Quan trọng: luôn xác thực OTP TRƯỚC, chỉ sau khi đúng OTP mới được biết có hồ sơ cũ hay không
    // → tránh lộ thông tin "SĐT này đã có tài khoản" cho người không sở hữu SĐT đó (account enumeration)
    const found = MOCK_EXISTING_PROFILES.find(p => p.phone === phone.replace(/\D/g, ''));
    setExisting(found || null);
    setStep('form');
  }

  function submitEmail() {
    if (!email.includes('@')) { alert('Vui lòng nhập đúng định dạng email.'); return; }
    setExisting(null); // demo: luôn coi là tài khoản mới khi đăng ký bằng email
    setStep('form');
  }

  return (
    <div>
      <Shdr title="Tạo tài khoản" onBack={() => go('s-login')} />
      <div style={{ padding: 12 }}>

        {step === 'method' && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 8 }}>Chọn cách đăng ký</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
              <div onClick={() => chooseMethod('phone')} style={{ background: C.w, border: `2px solid ${C.b}`, borderRadius: 12, padding: 16, cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>📱</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.t }}>Số điện thoại</span>
              </div>
              <div onClick={() => chooseMethod('email')} style={{ background: C.w, border: `2px solid ${C.b}`, borderRadius: 12, padding: 16, cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>✉️</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.t }}>Email</span>
              </div>
            </div>
          </>
        )}

        {step === 'email' && (
          <>
            <Fg label="Địa chỉ Email" req>
              <Fi placeholder="ban@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </Fg>
            <Btn onClick={submitEmail}>Tiếp tục ➡️</Btn>
            <Btn2 onClick={() => setStep('method')}>⬅️ Chọn cách khác</Btn2>
          </>
        )}

        {step === 'phone' && (
          <>
            <Fg label="Số điện thoại" req>
              <Fi placeholder="0901234567" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </Fg>
            <Infobox text="Số điện thoại mới → đăng ký bình thường như dưới đây. Nếu số này đã từng đăng ký trước đó → hệ thống tự giúp bạn tiếp tục từ hồ sơ cũ, không cần nhập lại." />
            <Btn onClick={sendOtp} disabled={sending}>{sending ? 'Đang gửi mã...' : '📩 Gửi mã OTP xác thực'}</Btn>
            <Btn2 onClick={() => setStep('method')}>⬅️ Chọn cách khác</Btn2>
          </>
        )}

        {step === 'otp' && (
          <>
            <Fg label={`Nhập mã OTP đã gửi tới ${phone}`} req>
              <Fi placeholder="6 số" maxLength={6} inputMode="numeric" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
            </Fg>
            <Btn onClick={verifyOtp}>Xác nhận OTP ➡️</Btn>
            <Btn2 onClick={() => setStep('phone')}>⬅️ Đổi số điện thoại</Btn2>
          </>
        )}

        {step === 'form' && existing && (
          <>
            <div style={{ background: '#e8f0fe', border: '1px solid #c5d8ff', borderRadius: 10, padding: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1565c0', marginBottom: 4 }}>👋 Chào mừng trở lại, {existing.name}!</div>
              <div style={{ fontSize: 12, color: '#1976d2' }}>Hồ sơ của bạn đã có sẵn — chỉ cần bổ sung phần còn thiếu để tiếp tục, không phải nhập lại từ đầu.</div>
            </div>
            {existing.missing.includes('Khu vực') && (
              <Fg label="Khu vực" req>
                <Fs>
                  <option>-- Chọn Tỉnh / Thành phố --</option>
                  <option>Đồng Nai</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Bình Dương</option>
                </Fs>
              </Fg>
            )}
            <Btn onClick={() => go('s-pledge')}>Tiếp tục: Đọc cam kết ➡️</Btn>
          </>
        )}

        {step === 'form' && !existing && (
          <>
            <Fg label="Họ và tên (tự khai, sẽ đối chiếu khi xác minh Căn cước)" req><Fi placeholder="Nhập họ và tên" /></Fg>
            <Fg label="Ngày sinh" req><Fi placeholder="dd/mm/yyyy" type="date" /></Fg>
            <Fg label="Mật khẩu" req><Fi placeholder="Tối thiểu 8 ký tự" type="password" /></Fg>
            <Fg label="Hoạt động bạn quan tâm" req>
              <Fs>
                <option>-- Chọn hoạt động --</option>
                <option>🛒 Mua sắm</option>
                <option>💰 Bán hàng</option>
                <option>🔍 Tìm việc / Nhận việc</option>
                <option>🔧 Cung cấp dịch vụ</option>
              </Fs>
            </Fg>

            <div style={{ background: '#e8f5e9', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#2e7d32', marginBottom: 12 }}>
              ℹ️ Tài khoản mặc định có thể đăng tin mua/bán ngay. Muốn làm <b>Thợ</b> (nộp CV) hoặc <b>Shipper cộng đồng</b>, đăng ký riêng trong mục Dịch vụ &amp; Việc làm bất cứ lúc nào. Sau khi xác minh danh tính (Căn cước), có thể nâng cấp lên tài khoản Doanh nghiệp trong mục Tài khoản.
            </div>

            <Btn onClick={() => go('s-pledge')}>Tiếp theo: Đọc cam kết ➡️</Btn>
          </>
        )}

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
          <p><strong>Điều 3:</strong> Chấp nhận ShopX lưu timestamp + IP + SĐT + Căn cước, xuất PDF bằng chứng khi tranh chấp.</p>
          <p><strong>Điều 4:</strong> Vi phạm cam kết có thể bị khóa tài khoản vĩnh viễn.</p>
        </div>
        <Ckrow label="Tôi đã đọc hết và đồng ý với toàn bộ cam kết trên" checked={ck1} onChange={e => setCk1(e.target.checked)} />
        <Ckrow label="Tôi hiểu rằng vi phạm cam kết có thể bị khóa tài khoản vĩnh viễn" checked={ck2} onChange={e => setCk2(e.target.checked)} />
        <Btn onClick={() => { if(!ck1||!ck2){alert('Vui lòng tick chọn đồng ý với tất cả cam kết.');return;} doLogin(); }} style={{ marginTop: 8 }}>✅ Đồng ý — Hoàn tất đăng ký ➡️</Btn>
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
    const noSave = ['s-login','s-register','s-pledge','s-kyc'];
    return (saved && !noSave.includes(saved)) ? saved : 's-home';
  });
  const [navActive,  setNavActive]  = useState(() => sessionStorage.getItem('sx_nav') || 'ni-home');
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('sx_login') === '1');
  const [hasPhone,   setHasPhone]   = useState(() => sessionStorage.getItem('sx_hasphone') !== '0');
  const [hasCCCD,    setHasCCCD]    = useState(() => sessionStorage.getItem('sx_hascccd') === '1');
  const [hasAgreedShipperTerms, setHasAgreedShipperTerms] = useState(() => sessionStorage.getItem('sx_agreed_shipper') !== '0');
  const [hasAgreedWorkerTerms,  setHasAgreedWorkerTerms]  = useState(() => sessionStorage.getItem('sx_agreed_worker') === '1');
  const [buyCount,   setBuyCount]   = useState(() => parseInt(sessionStorage.getItem('sx_buycount') || '0'));
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
    const viaEmailOnly = sessionStorage.getItem('sx_register_method') === 'email';
    setIsLoggedIn(true);
    setHasPhone(!viaEmailOnly);
    sessionStorage.setItem('sx_hasphone', viaEmailOnly ? '0' : '1');
    setShowPopup(false);
    sessionStorage.setItem('sx_login', '1');
    go(pendingScr && pendingScr !== 's-login' ? pendingScr : 's-home');
    nav('ni-acc');
    setPendingScr('');
  };

  const verifyPhoneGate = () => {
    setHasPhone(true);
    sessionStorage.setItem('sx_hasphone', '1');
  };

  const verifyCCCDGate = () => {
    setHasCCCD(true);
    sessionStorage.setItem('sx_hascccd', '1');
    const returnTo = sessionStorage.getItem('sx_kyc_return') || 's-home';
    sessionStorage.removeItem('sx_kyc_return');
    go(returnTo);
  };

  const incrementBuyCount = () => {
    const next = buyCount + 1;
    setBuyCount(next);
    sessionStorage.setItem('sx_buycount', String(next));
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
      case 's-home':             return <HomeScreen             go={go} chkLogin={chkLogin} nav={nav} isLoggedIn={isLoggedIn} />;;
      case 's-categories':       return <CategoriesScreen       go={go} nav={nav} />;
      case 's-all-listings':     return <AllListingsScreen      go={go} />;
      case 's-search':           return <SearchScreen           go={go} />;
      case 's-cart':             return <CartScreen             go={go} />;
      case 's-checkout-split':   return <CheckoutSplitScreen    go={go} />;
      case 's-prod1':            return <ProductScreen          key="p1" go={go} chkLogin={chkLogin} type="p1" />;
      case 's-prod2':            return <ProductScreen          key="p2" go={go} chkLogin={chkLogin} type="p2" />;
      case 's-prod3':            return <ProductScreen          key="p3" go={go} chkLogin={chkLogin} type="p3" />;
      case 's-prod4':            return <ProductScreen          key="p4" go={go} chkLogin={chkLogin} type="p4" />;
      case 's-prod5':            return <ProductScreen          key="p5" go={go} chkLogin={chkLogin} type="p5" />;
      case 's-prod6':            return <ProductScreen          key="p6" go={go} chkLogin={chkLogin} type="p6" />;
      case 's-prod7':            return <ProductScreen          key="p7" go={go} chkLogin={chkLogin} type="p7" />;
      case 's-prod8':            return <ProductScreen          key="p8" go={go} chkLogin={chkLogin} type="p8" />;
      case 's-prod9':            return <ProductScreen          key="p9" go={go} chkLogin={chkLogin} type="p9" />;
      case 's-prod10':           return <ProductScreen          key="p10" go={go} chkLogin={chkLogin} type="p10" />;
      case 's-prod11':           return <ProductScreen          key="p11" go={go} chkLogin={chkLogin} type="p11" />;
      case 's-prod12':           return <ProductScreen          key="p12" go={go} chkLogin={chkLogin} type="p12" />;
      case 's-prod13':           return <ProductScreen          key="p13" go={go} chkLogin={chkLogin} type="p13" />;
      case 's-prod14':           return <ProductScreen          key="p14" go={go} chkLogin={chkLogin} type="p14" />;
      case 's-prod15':           return <ProductScreen          key="p15" go={go} chkLogin={chkLogin} type="p15" />;
      case 's-prod16':           return <ProductScreen          key="p16" go={go} chkLogin={chkLogin} type="p16" />;
      case 's-chat-buy':         return <ChatScreen             go={go} type="buy" returnTo={sessionStorage.getItem('sx_product_return') || 's-home'} />;
      case 's-chat-buy-mine':    return <ChatScreen             go={go} type="buy-mine" returnTo="s-account" />;
      case 's-chat-job':         return <ChatScreen             go={go} type="job" />;
      case 's-chat-worker':      return <ChatScreen             go={go} type="worker" />;
      case 's-chat-3way':        return <Chat3WayScreen         go={go} />;
      case 's-service':          return <ServiceScreen          go={go} chkLogin={chkLogin} />;
      case 's-worker-profile':   return <WorkerProfileScreen    go={go} />;
      case 's-post':             return hasPhone
                                     ? <PostScreen             go={go} chkLogin={chkLogin} hasCCCD={hasCCCD} />
                                     : <PhoneGateScreen go={go} onVerified={verifyPhoneGate} actionLabel="đăng tin bán" />;
      case 's-preview-post':    return <PreviewPostScreen     go={go} hasCCCD={hasCCCD} />;
      case 's-direct':           return <DirectScreen           go={go} />;
      case 's-post-success':     return <PostSuccessScreen      go={go} />;
      case 's-delivery':         return <DeliveryScreen         go={go} chkLogin={chkLogin} hasCCCD={hasCCCD} buyCount={buyCount} incrementBuyCount={incrementBuyCount} />;
      case 's-login':            return <LoginScreen            go={go} doLogin={doLogin} />;
      case 's-account':          return <AccountScreen          go={go} nav={nav} doLogout={doLogout} hasCCCD={hasCCCD} isShipper={hasAgreedShipperTerms} />;
      case 's-register':         return <RegisterScreen         go={go} />;
      case 's-pledge':           return <PledgeScreen           go={go} doLogin={doLogin} />;
      case 's-kyc':               return <KYCScreen              go={go} onComplete={verifyCCCDGate} backTo={sessionStorage.getItem('sx_kyc_return') || 's-home'} actionLabel={sessionStorage.getItem('sx_kyc_reason') || 'tiếp tục'} />;
      case 's-notif':            return <NotifScreen            go={go} />;
      case 's-shipper-register': return <ShipperRegisterScreen  go={go} hasCCCD={hasCCCD} hasAgreedTerms={hasAgreedShipperTerms} />;
      case 's-shipper-orders':  return <ShipperOrdersScreen  go={go} />;
      case 's-shipper-success':  return <ShipperSuccessScreen   go={go} />;
      case 's-rating':                  return <RatingScreen           go={go} />;
      case 's-terms':           return <TermsMenuScreen go={go} />;
      case 's-terms-buyer':   return <TermsScreen go={go} role="buyer" />;
      case 's-terms-shipper': return <TermsScreen go={go} role="shipper"
                                   showAgree={sessionStorage.getItem('sx_terms_agree_mode') === 'shipper'}
                                   onAgree={() => { setHasAgreedShipperTerms(true); sessionStorage.setItem('sx_agreed_shipper', '1'); sessionStorage.removeItem('sx_terms_agree_mode'); go('s-shipper-register'); }} />;
      case 's-terms-worker':  return <TermsScreen go={go} role="worker"
                                   showAgree={sessionStorage.getItem('sx_terms_agree_mode') === 'worker'}
                                   onAgree={() => { setHasAgreedWorkerTerms(true); sessionStorage.setItem('sx_agreed_worker', '1'); sessionStorage.removeItem('sx_terms_agree_mode'); go('s-cv-register'); }} />;
      case 's-terms-business':return <TermsScreen go={go} role="business" />;
      case 's-terms-privacy': return <TermsScreen go={go} role="privacy" />;
      case 's-qr':                   return <QRScreen go={go} />;
      case 's-my-store':             return <StoreScreen go={go} chkLogin={chkLogin} isOwner={true} hasCCCD={hasCCCD} />;
      case 's-store-personal':       return <StoreScreen go={go} chkLogin={chkLogin} storeType="personal" />;
      case 's-store-business':       return <StoreScreen go={go} chkLogin={chkLogin} storeType="business" />;
      case 's-service-order-worker': return <ServiceOrderScreen go={go} role="worker" />;
      case 's-service-order-hirer':  return <ServiceOrderScreen go={go} role="hirer" />;
      case 's-cv-register':      return <CvRegisterScreen   go={go} hasCCCD={hasCCCD} hasAgreedTerms={hasAgreedWorkerTerms} />;
      case 's-cv-success':       return <CvSuccessScreen    go={go} />;
      case 's-kol-campaign':      return <KolCampaignScreen      go={go} />;
      case 's-order-report':      return <OrderReportScreen      go={go} />;
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
