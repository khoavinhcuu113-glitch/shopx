import { useState } from 'react';
import { C } from '../constants';
import { Shdr } from '../components/UI';

// Component tạo QR Code giả lập dạng SVG
function QRCode({ value, size = 160, color = '#000' }) {
  // Tạo pattern từ string value để mỗi QR trông khác nhau
  const seed = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand  = (i) => ((seed * (i + 1) * 2654435761) >>> 0) % 100;

  const cells = 21;
  const cell  = size / cells;

  // Finder patterns (3 góc cố định)
  const finder = (row, col) => {
    const inFinder = (r, c, or, oc) => {
      const dr = r - or, dc = c - oc;
      return dr >= 0 && dr < 7 && dc >= 0 && dc < 7 &&
        (dr === 0 || dr === 6 || dc === 0 || dc === 6 ||
         (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
    };
    return inFinder(row, col, 0, 0) ||
           inFinder(row, col, 0, cells - 7) ||
           inFinder(row, col, cells - 7, 0);
  };

  const dots = [];
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const filled = finder(r, c) ? true : rand(r * cells + c) > 45;
      if (filled) {
        dots.push(
          <rect key={`${r}-${c}`}
            x={c * cell} y={r * cell}
            width={cell - 0.5} height={cell - 0.5}
            fill={color} rx={0.5}
          />
        );
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block' }}>
      <rect width={size} height={size} fill="#fff" />
      {dots}
    </svg>
  );
}

// QR Card component
function QRCard({ title, subtitle, value, icon, color, onDownload }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 16, border: '1px solid #e8def8', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t }}>{title}</div>
          <div style={{ fontSize: 11, color: C.m }}>{subtitle}</div>
        </div>
      </div>

      {/* QR Code */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{ padding: 12, background: '#fff', borderRadius: 12, border: `2px solid ${color}`, display: 'inline-block' }}>
          <QRCode value={value} size={140} color={color} />
        </div>
      </div>

      {/* Link text */}
      <div style={{ background: C.pl, borderRadius: 8, padding: '6px 10px', marginBottom: 10, textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: C.m, marginBottom: 2 }}>Link gian hàng:</div>
        <div style={{ fontSize: 11, color: C.p, fontWeight: 600, wordBreak: 'break-all' }}>{value}</div>
      </div>

      {/* Nút tải */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button onClick={onDownload}
          style={{ background: color, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
          📥 Tải QR về
        </button>
        <button onClick={() => navigator.share?.({ url: value, title })}
          style={{ background: C.pl, color: C.p, border: `1px solid ${C.b}`, padding: '8px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
          📤 Chia sẻ link
        </button>
      </div>
    </div>
  );
}

export default function QRScreen({ go, storeId = 'SX-00001' }) {
  const [activeTab, setActiveTab] = useState('store');
  const BASE = 'shopx-azure.vercel.app';

  const qrTypes = [
    {
      key:      'store',
      icon:     '🏪',
      title:    'QR Gian hàng',
      subtitle: 'Dẫn vào toàn bộ gian hàng của bạn',
      value:    `https://${BASE}/store/${storeId}`,
      color:    C.p,
      hint:     'Dán ở cửa hàng, danh thiếp, bao bì sản phẩm',
    },
    {
      key:      'chat',
      icon:     '💬',
      title:    'QR Liên hệ',
      subtitle: 'Khách quét → mở chat với bạn ngay',
      value:    `https://${BASE}/chat/${storeId}`,
      color:    '#2e7d32',
      hint:     'Dán ở bàn thu ngân, quầy hàng, poster',
    },
    {
      key:      'zone',
      icon:     '🏢',
      title:    'QR Nội khu',
      subtitle: 'Dẫn vào cộng đồng nội khu của bạn',
      value:    `https://${BASE}/zone/CX-001`,
      color:    '#1565c0',
      hint:     'Dán ở bảng thông báo chung cư, thang máy',
    },
    {
      key:      'product',
      icon:     '📦',
      title:    'QR Sản phẩm',
      subtitle: 'Dẫn thẳng vào 1 sản phẩm cụ thể',
      value:    `https://${BASE}/product/P-001`,
      color:    '#e65100',
      hint:     'Dán trực tiếp lên sản phẩm hoặc menu',
    },
  ];

  const current = qrTypes.find(q => q.key === activeTab);

  function handleDownload() {
    alert(`📥 Tải QR "${current.title}" về máy!\n\n(Tính năng lưu ảnh sẽ hoạt động khi kết nối database thật)`);
  }

  return (
    <div>
      <Shdr title="QR Code Gian hàng" onBack={() => go('s-account')} />

      {/* Header thông tin */}
      <div style={{ background: C.p, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff' }}>KV</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Khoavinhcuu113</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>{storeId} · 👤 Cá nhân · ✅ Uy tín</div>
          </div>
        </div>
      </div>

      {/* Tabs chọn loại QR */}
      <div style={{ padding: '12px 12px 0' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 8 }}>Chọn loại QR:</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
          {qrTypes.map(q => (
            <button key={q.key} onClick={() => setActiveTab(q.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', borderRadius: 10, border: `1.5px solid ${activeTab === q.key ? q.color : '#e8def8'}`, background: activeTab === q.key ? q.color + '15' : '#fff', cursor: 'pointer' }}>
              <span style={{ fontSize: 16 }}>{q.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: activeTab === q.key ? q.color : C.t }}>{q.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* QR hiện tại */}
      <div style={{ padding: '0 12px' }}>
        {current && (
          <>
            <QRCard
              title={current.title}
              subtitle={current.subtitle}
              value={current.value}
              icon={current.icon}
              color={current.color}
              onDownload={handleDownload}
            />

            {/* Hướng dẫn sử dụng */}
            <div style={{ background: '#e8f5e9', borderRadius: 12, padding: 12, marginBottom: 12, border: '1px solid #c8e6c9' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32', marginBottom: 6 }}>
                💡 Dùng QR này ở đâu?
              </div>
              <div style={{ fontSize: 12, color: '#388e3c' }}>{current.hint}</div>
            </div>

            {/* Hướng dẫn in */}
            <div style={{ background: C.pl, borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 8 }}>
                🖨️ Cách in QR code:
              </div>
              {[
                '1. Bấm "Tải QR về" → lưu ảnh vào điện thoại',
                '2. Gửi ảnh cho tiệm in hoặc in tại nhà',
                '3. In kích thước tối thiểu 3x3cm',
                '4. Dán nơi khách dễ thấy và dễ quét',
                '5. Test lại bằng camera điện thoại',
              ].map((t, i) => (
                <div key={i} style={{ fontSize: 11, color: C.t, marginBottom: 4 }}>{t}</div>
              ))}
            </div>

            {/* Thống kê quét QR */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, border: '1px solid #e8def8' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 10 }}>
                📊 Thống kê QR code
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[
                  { val: '0',  lbl: 'Lượt quét hôm nay', color: C.p },
                  { val: '0',  lbl: 'Lượt quét tháng này', color: '#2e7d32' },
                  { val: '0',  lbl: 'Đơn hàng từ QR', color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} style={{ background: C.pl, borderRadius: 8, padding: '8px 4px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 9, color: C.m, marginTop: 2, lineHeight: 1.2 }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: C.m, marginTop: 8, textAlign: 'center' }}>
                Thống kê sẽ cập nhật sau khi có kết nối database thật
              </div>
            </div>
          </>
        )}
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}
