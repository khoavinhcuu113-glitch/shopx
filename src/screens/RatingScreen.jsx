import { useState } from 'react';
import { C, getRatingLevel } from '../constants';
import { Btn } from '../components/UI';

// Component badge uy tín dùng chung
export function RatingBadge({ orders, rate, size = 'sm' }) {
  const level = getRatingLevel(orders, rate);
  const isSm = size === 'sm';
  return (
    <span style={{
      fontSize: isSm ? 11 : 13,
      background: level.color + '20',
      color: level.color,
      padding: isSm ? '3px 8px' : '5px 12px',
      borderRadius: 10,
      fontWeight: 600,
      border: `1px solid ${level.color}40`,
    }}>
      {level.label}
    </span>
  );
}

// Component hiển thị thống kê hoạt động
export function RatingStats({ role = 'seller', data }) {
  const statsBySeller = [
    { val: `${data.totalOrders}`,        lbl: 'Lượt dịch vụ',       color: C.p },
    { val: `${data.completionRate}%`,    lbl: 'Hoàn thành',      color: '#2e7d32' },
    { val: `${data.thumbsUp}%`,          lbl: '👍 Tích cực',     color: '#f59e0b' },
    { val: data.responseTime || '< 1h',  lbl: 'Phản hồi',        color: C.pd },
  ];
  const statsByBuyer = [
    { val: `${data.totalOrders}`,        lbl: 'Lượt mua',          color: C.p },
    { val: `${data.receiveRate}%`,       lbl: 'Nhận hàng đúng',  color: '#2e7d32' },
    { val: `${data.thumbsUp}%`,          lbl: '👍 Tích cực',     color: '#f59e0b' },
  ];
  const statsByShipper = [
    { val: `${data.totalOrders}`,        lbl: 'Lượt giao',         color: C.p },
    { val: `${data.onTimeRate}%`,        lbl: 'Đúng giờ',        color: '#2e7d32' },
    { val: `${data.thumbsUp}%`,          lbl: '👍 Tích cực',     color: '#f59e0b' },
  ];
  const statsByKoc = [
    { val: `${data.totalOrders}`,        lbl: 'Hợp đồng',          color: C.p },
    { val: `${data.completionRate}%`,    lbl: 'Hoàn thành',      color: '#2e7d32' },
    { val: `${data.thumbsUp}%`,          lbl: '👍 Tích cực',     color: '#f59e0b' },
    { val: `${data.followers}`,          lbl: 'Follower',        color: C.pd },
  ];
  const stats = role === 'buyer' ? statsByBuyer : role === 'shipper' ? statsByShipper : role === 'koc' ? statsByKoc : statsBySeller;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 6 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: C.pl, borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.val}</div>
          <div style={{ fontSize: 9, color: C.m, marginTop: 2, lineHeight: 1.2 }}>{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}

// Màn hình đánh giá sau giao dịch
export default function RatingScreen({ go, target = 'seller', onSkip, onDone, doneLabel = '🏠 Về trang chủ' }) {
  const [thumb, setThumb]       = useState(null); // 'up' | 'down'
  const [comment, setComment]   = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [points, setPoints]     = useState(0);

  const chatContact = (() => {
    try { return JSON.parse(sessionStorage.getItem('sx_chat_contact') || 'null'); } catch (e) { return null; }
  })();
  const targetInfo = {
    seller:  { name: 'SX-00127 (Người bán)',       icon: '🏷️', role: 'Người bán' },
    shipper: { name: 'SP-001 (Trần Văn Cường)',      icon: '🚚', role: 'Shipper' },
    worker:  chatContact
      ? { name: `${chatContact.name} • ${chatContact.sxId}`, icon: chatContact.needsContentLink ? '🎥' : '🔨', role: chatContact.trade }
      : { name: 'SX-00199 (Thợ điện)',          icon: '🔨', role: 'Thợ' },
    hirer:   { name: 'SX-00001 (Người thuê)',        icon: '👤', role: 'Người thuê' },
  };
  const t = targetInfo[target] || targetInfo.seller;

  function submitRating() {
    if (!thumb) { alert('Vui lòng chọn 👍 hoặc 👎 để đánh giá'); return; }
    setSubmitted(true);
    setPoints(5);
  }

  if (submitted) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>
          {thumb === 'up' ? '🎉' : '📝'}
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.t, marginBottom: 6 }}>
          Cảm ơn đánh giá của bạn!
        </div>
        <div style={{ fontSize: 13, color: C.m, marginBottom: 16 }}>
          Đánh giá của bạn giúp cộng đồng ShopX tin tưởng hơn.
        </div>
        <div style={{ background: '#e8f5e9', borderRadius: 12, padding: 14, marginBottom: 20, display: 'inline-block' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#2e7d32' }}>
            🏆 +{points} SX Points đã được cộng!
          </div>
          <div style={{ fontSize: 11, color: '#388e3c', marginTop: 4 }}>
            Tổng: 1.255 SX Points
          </div>
        </div>
        <Btn onClick={() => onDone ? onDone() : go('s-home')}>{doneLabel}</Btn>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      {/* Header đánh giá */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{t.icon}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.t, marginBottom: 4 }}>
          Đánh giá {t.role}
        </div>
        <div style={{ fontSize: 13, color: C.m }}>{t.name}</div>
      </div>

      {/* Thưởng SX Points */}
      <div style={{ background: '#e8f5e9', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>🏆</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32' }}>Đánh giá ngay → nhận 5 SX Points</div>
          <div style={{ fontSize: 11, color: '#388e3c' }}>Giúp cộng đồng ShopX tin tưởng hơn</div>
        </div>
      </div>

      {/* Nút 👍 / 👎 */}
      <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 10, textAlign: 'center' }}>
        Trải nghiệm của bạn với {t.role} này thế nào?
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <button onClick={() => setThumb('up')} style={{ padding: '16px 12px', borderRadius: 12, border: `2px solid ${thumb === 'up' ? '#2e7d32' : '#e8def8'}`, background: thumb === 'up' ? '#e8f5e9' : C.w, cursor: 'pointer', transition: 'all 0.2s' }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>👍</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: thumb === 'up' ? '#2e7d32' : C.m }}>Tích cực</div>
          <div style={{ fontSize: 11, color: C.m, marginTop: 2 }}>Hài lòng</div>
        </button>
        <button onClick={() => setThumb('down')} style={{ padding: '16px 12px', borderRadius: 12, border: `2px solid ${thumb === 'down' ? '#e53935' : '#e8def8'}`, background: thumb === 'down' ? '#ffebee' : C.w, cursor: 'pointer', transition: 'all 0.2s' }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>👎</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: thumb === 'down' ? '#e53935' : C.m }}>Tiêu cực</div>
          <div style={{ fontSize: 11, color: C.m, marginTop: 2 }}>Không hài lòng</div>
        </button>
      </div>

      {/* Nhận xét tùy chọn */}
      {thumb && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 6 }}>
            Nhận xét thêm (tùy chọn):
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={thumb === 'up'
              ? 'VD: Hàng đúng mô tả, giao hàng nhanh...'
              : 'VD: Hàng không đúng mô tả, shipper trễ hẹn...'}
            rows={3}
            style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, outline: 'none', resize: 'none' }}
          />
        </div>
      )}

      {/* Nút gửi */}
      {thumb && (
        <Btn onClick={submitRating} style={{ marginBottom: 8 }}>
          📤 Gửi đánh giá → nhận 5 SX Points
        </Btn>
      )}

      {/* Nút bỏ qua */}
      <button
        onClick={() => onSkip ? onSkip() : go('s-home')}
        style={{ width: '100%', background: 'none', border: 'none', color: C.m, fontSize: 13, cursor: 'pointer', padding: 8 }}>
        Bỏ qua — không đánh giá
      </button>
    </div>
  );
}
