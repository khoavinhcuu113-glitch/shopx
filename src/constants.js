// ================================================================
// SHOPX CONSTANTS — Tất cả biến quan trọng tập trung tại đây
// Chỉ cần đổi file này, không cần sửa code chỗ khác
// ================================================================

// --- NGƯỠNG MIỄN PHÍ (chờ kế hoạch kinh doanh chốt) ---
// Đổi thành 500 khi ra mắt chính thức
export const FREE_ORDERS_SELLER = 5;

// Đổi thành 1000 khi ra mắt chính thức
export const FREE_ORDERS_SHIPPER = 5;

// --- THANH TOÁN (bật khi có giấy phép NHNN) ---
export const PAYMENT_MODE = false; // false = chưa kích hoạt Escrow

// --- PHÍ NỀN TẢNG SHOPX (thu từ người bán) ---
export const PLATFORM_FEE = {
  under500k: 2000,   // Đơn dưới 500.000đ → 2.000đ
  under5m:   5000,   // Đơn 500k - 5tr    → 5.000đ
  under20m:  10000,  // Đơn 5tr - 20tr    → 10.000đ
  above20m:  15000,  // Đơn trên 20tr     → 15.000đ
};

// Tính phí nền tảng theo giá trị đơn
export function calcPlatformFee(orderValue) {
  if (orderValue < 500000)  return PLATFORM_FEE.under500k;
  if (orderValue < 5000000) return PLATFORM_FEE.under5m;
  if (orderValue < 20000000) return PLATFORM_FEE.under20m;
  return PLATFORM_FEE.above20m;
}

// --- PHÍ BẢO HIỂM HÀNG HÓA (đại lý PTI/MIC - giai đoạn 2) ---
export const INSURANCE_FEE = {
  under1m:  5000,   // Đơn dưới 1tr  → 5.000đ
  under5m:  10000,  // Đơn 1tr - 5tr → 10.000đ
  above5m:  20000,  // Đơn trên 5tr  → 20.000đ
};
export const INSURANCE_MODE = false; // false = chưa kích hoạt

// --- CẤP ĐỘ SHIPPER ---
export const SHIPPER_LEVELS = {
  dong:      { label: '🥉 Đồng',       min: 0,    max: 49,   rate: 80 },
  bac:       { label: '🥈 Bạc',        min: 50,   max: 199,  rate: 85 },
  vang:      { label: '🥇 Vàng',       min: 200,  max: 499,  rate: 90 },
  kimCuong:  { label: '💎 Kim Cương',  min: 500,  max: 999,  rate: 95 },
  saoVang:   { label: '⭐ Sao Vàng',   min: 1000, max: null, rate: 98 },
  cup:       { label: '🏆 Cúp',        min: null, max: null, rate: 99 }, // giải thưởng cuối năm
};

export function getShipperLevel(totalOrders) {
  if (totalOrders >= 1000) return SHIPPER_LEVELS.saoVang;
  if (totalOrders >= 500)  return SHIPPER_LEVELS.kimCuong;
  if (totalOrders >= 200)  return SHIPPER_LEVELS.vang;
  if (totalOrders >= 50)   return SHIPPER_LEVELS.bac;
  return SHIPPER_LEVELS.dong;
}

// --- MÀU SẮC GIAO DIỆN ---
export const C = {
  p:  '#7B2FBE',
  pd: '#5A1F8A',
  pl: '#EDE7F6',
  pm: '#9C4FD4',
  t:  '#1a1a2e',
  m:  '#6b6b8a',
  w:  '#fff',
  b:  '#d4b8f0',
  g:  '#f8f5ff',
};

// --- NGÀNH NGHỀ & DANH MỤC ---
export const NGHES = {
  nha:  ['Thợ điện dân dụng','Thợ điện công nghiệp','Thợ nước - ống nước','Thợ máy bơm','Thợ xây - tô trát','Thợ lát gạch','Thợ sơn tường','Thợ chống thấm','Thợ mộc','Thợ làm cửa','Thợ hàn sắt - inox','Thợ trần thạch cao'],
  dien: ['Thợ lắp đặt máy lạnh','Thợ sửa máy lạnh','Thợ vệ sinh máy lạnh','Thợ sửa tủ lạnh','Thợ sửa máy giặt','Thợ sửa tivi','Thợ sửa điện thoại','Thợ sửa laptop','Thợ sửa thiết bị gia dụng'],
  xe:   ['Thợ sửa xe máy','Thợ sửa ô tô','Thợ rửa xe máy','Thợ rửa ô tô','Thợ sơn xe','Thợ đồng - nắn xe'],
  nha2: ['Dọn dẹp vệ sinh nhà','Dọn dẹp sau xây dựng','Giặt ủi quần áo','Giúp việc nhà','Chăm sóc người già','Trông trẻ theo giờ'],
  van:  ['Chuyển nhà trọn gói','Vận chuyển hàng hóa','Bốc xếp hàng hóa','Giao hàng theo chuyến','Xe ôm - đưa đón'],
  dep:  ['Cắt tóc nam tại nhà','Cắt tóc nữ tại nhà','Nail - làm móng','Trang điểm sự kiện','Massage thư giãn','Chăm sóc da tại nhà'],
  gd:   ['Gia sư Toán - Lý - Hóa','Gia sư Văn - Sử - Địa','Dạy tiếng Anh','Dạy tiếng Trung - Nhật','Dạy đàn - nhạc cụ','Dạy vẽ - mỹ thuật','Dạy kỹ năng sống'],
  cn:   ['Cài đặt phần mềm','Lắp đặt camera','Thiết kế đồ họa','Chụp ảnh sản phẩm','Kế toán theo giờ','Đánh máy - soạn thảo'],
  dam:  ['Chăm sóc cá cảnh - hồ thủy sinh','Chăm sóc chim cảnh','Trồng & chăm sóc cây cảnh','Tạo dáng bon sai','Chăm sóc thú cưng','Nấu ăn - làm bánh theo đặt','Thêu - móc len','Quay video - dựng phim ngắn','KOL/KOC quảng bá sản phẩm'],

  // DANH MỤC MỚI — Dịch vụ làm thuê bán thời gian
  noikhu: [
    'Mua hộ - đi chợ hộ',
    'Nhận hàng online hộ',
    'Chạy việc vặt - đặt đồ ăn hộ',
    'Giao cơm nhà - đồ ăn tự nấu',
    'Bán ăn vặt nội khu',
    'Giao hàng nội khu - nội tòa nhà',
  ],
  chamsoc: [
    'Chăm sóc người cao tuổi tại nhà',
    'Chăm sóc bệnh nhân tại bệnh viện',
    'Trông người nhà thay ca',
    'Hỗ trợ phục hồi chức năng',
    'Đưa đón người cao tuổi - bệnh nhân',
    'Chăm sóc sau sinh - ở cữ',
    'Trông trẻ sơ sinh',
  ],
  vesinhgiatre: [
    'Vệ sinh nhà theo giờ',
    'Vệ sinh căn hộ chung cư',
    'Vệ sinh văn phòng',
    'Giặt ủi theo ký',
    'Giặt chăn màn - rèm cửa',
    'Dọn kho - dọn nhà sau chuyển',
    'Vệ sinh nhà bếp chuyên sâu',
  ],
};

export const NGANH_LIST = [
  { value: 'nha',         label: '🏠 Nhà ở & Công trình' },
  { value: 'dien',        label: '❄️ Điện lạnh & Thiết bị' },
  { value: 'xe',          label: '🚗 Xe cộ' },
  { value: 'nha2',        label: '🌿 Dịch vụ tại nhà' },
  { value: 'van',         label: '🚚 Vận chuyển & Lao động' },
  { value: 'dep',         label: '💇 Làm đẹp & Chăm sóc' },
  { value: 'gd',          label: '📚 Giáo dục & Đào tạo' },
  { value: 'cn',          label: '💻 Công nghệ & Văn phòng' },
  { value: 'dam',         label: '🌟 Kỹ năng & Đam mê bán thời gian' },
  // Ngành mới — Nội khu & Gia đình
  { value: 'noikhu',      label: '🏢 Dịch vụ làm thuê bán thời gian' },
  { value: 'chamsoc',     label: '❤️ Chăm sóc người thân & Y tế' },
  { value: 'vesinhgiatre',label: '🧹 Vệ sinh & Giặt ủi theo giờ' },
];

export const CATEGORIES = [
  { icon: '🏢', name: 'Bất động sản' },
  { icon: '🚗', name: 'Xe cộ' },
  { icon: '📱', name: 'Đồ điện tử' },
  { icon: '🔧', name: 'Dịch vụ & Việc làm' },
  { icon: '🏢', name: 'Dịch vụ làm thuê bán thời gian' },
  { icon: '❤️', name: 'Chăm sóc người thân' },
  { icon: '🧹', name: 'Vệ sinh & Giặt ủi' },
  { icon: '🐾', name: 'Thú cưng' },
  { icon: '🍖', name: 'Đồ ăn & Thực phẩm' },
  { icon: '❄️', name: 'Tủ lạnh, máy lạnh, máy giặt' },
  { icon: '🛋️', name: 'Đồ gia dụng & Nội thất' },
  { icon: '👶', name: 'Mẹ và bé' },
  { icon: '👕', name: 'Thời trang & Đồ dùng cá nhân' },
  { icon: '🎮', name: 'Giải trí & Thể thao' },
  { icon: '🚜', name: 'Văn phòng & Nông nghiệp' },
];

// --- DỮ LIỆU MẪU SHIPPER ---
export const SAMPLE_SHIPPERS = [
  {
    id: 'SP-100', initials: 'KV', name: 'Khoavinhcuu113',
    level: 'vang', badge: '🥇 Vàng',
    orders: 47, rate: 96.8, stars: 4.8,
    route: 'Biên Hòa ↔ Trấn Biên', time: 'Linh hoạt',
    maxValue: 20000000, color: '#7B2FBE', priority: false,
  },
  {
    id: 'SP-101', initials: 'TH', name: 'Chị Thu Hương',
    level: 'saoVang', badge: '⭐ Sao Vàng',
    orders: 1250, rate: 98.5, stars: 4.9,
    route: 'Biên Hòa ↔ Hố Nai', time: '18h00 hôm nay',
    maxValue: 50000000, color: '#f59e0b', priority: true,
  },
  {
    id: 'SP-002', initials: 'MV', name: 'Anh Minh Vũ',
    level: 'kimCuong', badge: '💎 Kim Cương',
    orders: 678, rate: 97.2, stars: 4.9,
    route: 'Biên Hòa ↔ Hố Nai', time: 'Linh hoạt',
    maxValue: 30000000, color: '#2e7d32', priority: false,
  },
  {
    id: 'SP-003', initials: 'PL', name: 'Anh Phước Long',
    level: 'vang', badge: '🥇 Vàng',
    orders: 312, rate: 95.8, stars: 4.8,
    route: 'Biên Hòa ↔ Hố Nai', time: 'Sáng sớm',
    maxValue: 20000000, color: '#7B2FBE', priority: false,
  },
  {
    id: 'SP-004', initials: 'NL', name: 'Anh Ngọc Linh',
    level: 'bac', badge: '🥈 Bạc',
    orders: 89, rate: 91.0, stars: 4.6,
    route: 'Biên Hòa ↔ Hố Nai', time: 'Chiều tối',
    maxValue: 10000000, color: '#9C4FD4', priority: false,
  },
  {
    id: 'SP-005', initials: 'HT', name: 'Chị Hồng Thắm',
    level: 'dong', badge: '🥉 Đồng',
    orders: 23, rate: 85.0, stars: 4.4,
    route: 'Biên Hòa ↔ Hố Nai', time: 'Cuối tuần',
    maxValue: 5000000, color: '#6b6b8a', priority: false,
  },
];

// ─── HỆ THỐNG UY TÍN (RATING) ────────────────────────────────────────
export const RATING_LEVELS = {
  moi:   { min: 0,  max: 4,    label: '🆕 Mới',    minRate: 0,  color: '#9e9e9e' },
  uyTin: { min: 5,  max: 19,   label: '✅ Uy tín', minRate: 90, color: '#2e7d32' },
  pro:   { min: 20, max: null, label: '🏅 Chuyên nghiệp',    minRate: 95, color: '#f59e0b' },
};

export function getRatingLevel(totalOrders, completionRate) {
  if (totalOrders >= 20 && completionRate >= 95) return RATING_LEVELS.pro;
  if (totalOrders >= 5  && completionRate >= 90) return RATING_LEVELS.uyTin;
  return RATING_LEVELS.moi;
}

// Dữ liệu mẫu uy tín người dùng
export const SAMPLE_USER_RATINGS = {
  seller: {
    totalOrders: 34, completionRate: 97, thumbsUp: 96.2,
    responseTime: '< 30 phút', disputes: 1,
  },
  buyer: {
    totalOrders: 28, receiveRate: 98.5, thumbsUp: 95.0,
  },
  shipper: {
    totalOrders: 156, onTimeRate: 96.8, thumbsUp: 97.5,
  },
  koc: {
    totalOrders: 5, completionRate: 100, thumbsUp: 100, followers: 800,
  },
};

// ─── NHÂN VẬT DEMO ────────────────────────────────────────────────────
export const DEMO_USERS = {
  // Tài khoản đang đăng nhập (người dùng)
  me: {
    id: 'SX-00001', name: 'Lê Đăng Khoa', username: 'khoavinhcuu113',
    initials: 'LK', bg: '#7c3aed', loc: 'Biên Hòa, Đồng Nai',
  },

  // Người bán hàng hóa
  sellers: [
    { id: 'SX-00089', name: 'Chị Nguyễn Thu Lan',  initials: 'NL', bg: '#f59e0b', loc: 'Hố Nai, Biên Hòa' },
    { id: 'SX-00127', name: 'Anh Trần Minh Tuấn',  initials: 'TT', bg: '#2e7d32', loc: 'Trảng Bom, Đồng Nai' },
    { id: 'BIZ-0001', name: 'Cửa hàng Điện tử Minh Anh', initials: 'MA', bg: '#1565c0', loc: 'Biên Hòa' },
  ],

  // Người mua
  buyers: [
    { id: 'SX-00234', name: 'Nguyễn Văn Bình',     initials: 'NB', bg: '#0891b2' },
    { id: 'SX-00412', name: 'Trần Thị Mỹ Hạnh',    initials: 'MH', bg: '#db2777' },
    { id: 'SX-00156', name: 'Lê Hoàng Nam',         initials: 'HN', bg: '#7c3aed' },
  ],

  // Shipper
  shippers: [
    { id: 'SP-001', name: 'Trần Văn Cường',  initials: 'VC', bg: '#059669', vehicle: 'Honda Wave 🏍️' },
    { id: 'SP-002', name: 'Nguyễn Thành Long', initials: 'TL', bg: '#0284c7', vehicle: 'Exciter 🏍️' },
    { id: 'SP-003', name: 'Phạm Văn Hùng',   initials: 'VH', bg: '#7c2d12', vehicle: 'Toyota Vios 🚗' },
  ],

  // Thợ / Người làm tự do
  workers: [
    { id: 'SX-00199', name: 'Anh Trần Văn Nhân',      initials: 'VN', bg: '#7c3aed', trade: 'Thợ điện dân dụng', exp: '8 năm',  price: '80.000đ/giờ',    orders: 788, rate: 98,  thumbsUp: 98.2 },
    { id: 'SX-00143', name: 'Anh Nguyễn Thanh Long',  initials: 'TL', bg: '#0891b2', trade: 'Thợ sửa máy lạnh',  exp: '5 năm',  price: '150.000đ/ca',    orders: 234, rate: 95,  thumbsUp: 94.5 },
    { id: 'SX-00198', name: 'Chị Nguyễn Thu Hương',   initials: 'TH', bg: '#db2777', trade: 'Dọn dẹp vệ sinh',   exp: '3 năm',  price: '80.000đ/giờ',    orders: 156, rate: 100, thumbsUp: 99.1 },
    { id: 'SX-00215', name: 'Anh Lê Quốc Hùng',       initials: 'QH', bg: '#6B2F9E', trade: 'Thợ sơn & chống thấm', exp: '10 năm', price: '400.000đ/ngày', orders: 412, rate: 96,  thumbsUp: 96.8 },
  ],
};
