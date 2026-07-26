import { C, SAMPLE_SHIPPERS } from '../constants';
import { Shdr, Btn, Avatar } from '../components/UI';
import ShipperCard from './../../src/components/ShipperCard';

export default function ShipperCommunityScreen({ go, chkLogin }) {
  return (
    <div>
      <Shdr title="Đăng ký nhận Shipper" onBack={() => go('s-service')} />

      {/* Banner giới thiệu */}
      <div style={{ background: C.p, padding: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>🚚 Trở thành Shipper ShopX</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 12, lineHeight: 1.5 }}>
          Biến thời gian rảnh thành thu nhập thực tế. Giao hàng theo tuyến đường quen thuộc của bạn.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { icon: '💰', label: 'Tự định giá ship' },
            { icon: '🕐', label: 'Thời gian linh hoạt' },
            { icon: '📍', label: 'Tuyến đường quen' },
          ].map((b, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{b.icon}</div>
              <div style={{ fontSize: 10, color: '#fff', lineHeight: 1.2 }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 12 }}>
        {/* Quyền lợi */}
        <div style={{ background: '#fff', border: `1px solid #e8def8`, borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 10 }}>🎁 Quyền lợi Shipper ShopX</div>
          {[
            { icon: '🆓', text: `Miễn phí hoàn toàn cho ${5} đơn đầu tiên` },
            { icon: '⭐', text: 'Tích lũy điểm lên cấp Đồng → Bạc → Vàng → Kim Cương → Sao Vàng' },
            { icon: '📊', text: 'Được đề xuất đơn ưu tiên theo uy tín' },
            { icon: '🛡️', text: 'ShopX hỗ trợ giải quyết tranh chấp' },
            { icon: '💬', text: 'Chat 3 bên với người bán và người mua' },
            { icon: '🏆', text: 'Giải thưởng Cúp cuối năm cho shipper xuất sắc' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{b.icon}</span>
              <span style={{ fontSize: 12, color: C.m, lineHeight: 1.4 }}>{b.text}</span>
            </div>
          ))}
        </div>

        {/* Cấp độ */}
        <div style={{ background: '#fff', border: `1px solid #e8def8`, borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 10 }}>🏅 Hệ thống cấp độ</div>
          {[
            { badge: '🥉 Đồng',       range: '0 - 49 đơn',       color: '#cd7f32' },
            { badge: '🥈 Bạc',        range: '50 - 199 đơn',     color: '#aaa' },
            { badge: '🥇 Vàng',       range: '200 - 499 đơn',    color: '#f59e0b' },
            { badge: '💎 Kim Cương',  range: '500 - 999 đơn',    color: '#60a5fa' },
            { badge: '⭐ Sao Vàng',   range: '1000+ đơn',        color: C.p },
            { badge: '🏆 Cúp',        range: 'Giải thưởng cuối năm', color: '#e53935' },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 5 ? '1px solid #f5f0ff' : 'none' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: c.color }}>{c.badge}</span>
              <span style={{ fontSize: 11, color: C.m }}>{c.range}</span>
            </div>
          ))}
        </div>

        {/* Shipper đang hoạt động */}
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 8 }}>
          👥 Shipper đang hoạt động
        </div>
        {SAMPLE_SHIPPERS.slice(0, 3).map((s, i) => (
          <div key={s.id} style={{ background: '#fff', border: `1px solid #e8def8`, borderRadius: 12, padding: 12, marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
            <Avatar initials={s.initials} bg={s.color} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 2 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: C.m, marginBottom: 4 }}>{s.route}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: '#f59e0b' }}>⭐ {s.stars}</span>
                <span style={{ fontSize: 10, color: C.m }}>{s.orders.toLocaleString('vi-VN')} đơn</span>
                <span style={{ fontSize: 10, background: C.pl, color: C.p, padding: '2px 6px', borderRadius: 8 }}>{s.badge}</span>
              </div>
            </div>
          </div>
        ))}

        <Btn onClick={() => chkLogin('s-shipper-register')} style={{ marginTop: 8 }}>
          🚚 Đăng ký làm Shipper ngay
        </Btn>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

export function ShipperSuccessScreen({ go }) {
  return (
    <div>
      <Shdr title="Đăng ký thành công" />
      <div style={{ padding: 12, paddingTop: 32, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 36 }}>🚚</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.t, marginBottom: 6 }}>Hồ sơ Shipper đã được đăng ký!</div>
        <div style={{ fontSize: 13, color: C.m, marginBottom: 24, lineHeight: 1.6 }}>
          Đang chờ Admin xét duyệt trong 24h. Sau khi duyệt bạn sẽ nhận được đơn hàng.
        </div>
        <div style={{ background: C.pl, borderRadius: 12, padding: 14, marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 8 }}>Bước tiếp theo:</div>
          {[
            '🪪 Xác minh CCCD → được đề xuất đơn ưu tiên',
            '🔵 Kết nối Pi KYC → nhận badge Pi',
            '📦 Nhận đơn đầu tiên → bắt đầu tích lũy điểm',
            '⭐ Tích lũy đủ → lên cấp Sao Vàng',
          ].map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: C.t, marginBottom: 6 }}>{t}</div>
          ))}
        </div>
        <Btn onClick={() => go('s-service')}>Về trang Dịch vụ & Việc làm</Btn>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
