import { useState } from 'react';
import { C } from '../constants';
import { Shdr } from '../components/UI';

export default function NotifScreen({ go }) {
  const [showConfirmB, setShowConfirmB] = useState(false);
  const [addressB, setAddressB] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  function confirmAddressB() {
    if (!addressB.trim()) { alert('Vui lòng nhập địa chỉ nhận hàng'); return; }
    setConfirmed(true);
    setShowConfirmB(false);
  }

  const notifs = [
    {
      id: 'confirm-b',
      icon: '📦',
      title: 'SX-00127 muốn giao hàng đến bạn',
      desc: 'iPhone 13 Pro 256GB • 18.500.000đ • Người bán tại Biên Hòa',
      time: '30 phút trước',
      action: true,
      actionLabel: confirmed ? '✅ Đã xác nhận địa chỉ' : '📍 Xác nhận địa chỉ nhận hàng',
    },
    {
      id: 'chat',
      icon: '💬',
      title: 'SX-00127 (Thợ điện) đã phản hồi',
      desc: 'Mình có thể qua chiều nay lúc 15h được bạn nhé.',
      time: '3 giờ trước',
      action: false,
    },
    {
      id: 'delivery',
      icon: '✅',
      title: 'Giao hàng cộng đồng hoàn thành',
      desc: 'Shipper SP-001 đã giao iPhone 12 Pro thành công.',
      time: '5 giờ trước',
      action: false,
    },
    {
      id: 'points',
      icon: '🏆',
      title: 'SX Points: Nhận được 20 điểm',
      desc: 'Giao dịch thành công qua ShopX Pay. Tổng: 1.250 SX Points.',
      time: 'Hôm qua 18:30',
      action: false,
    },
  ];

  return (
    <div>
      <Shdr title="Thông báo" onBack={() => go('s-home')} />
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.m, marginBottom: 8 }}>Hôm nay</div>

        {notifs.map((n, i) => (
          <div key={n.id} style={{ background: C.w, borderLeft: `3px solid ${n.action && !confirmed ? C.p : '#e0d4f7'}`, borderRadius: '0 10px 10px 0', padding: '10px 12px', marginBottom: 8, borderTop: '1px solid #e8def8', borderRight: '1px solid #e8def8', borderBottom: '1px solid #e8def8' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: C.m }}>{n.desc}</div>
                <div style={{ fontSize: 10, color: '#bbb', marginTop: 4 }}>{n.time}</div>
              </div>
            </div>
            {n.action && (
              <button
                onClick={() => !confirmed && setShowConfirmB(true)}
                style={{ background: confirmed ? '#e8f5e9' : C.p, color: confirmed ? '#2e7d32' : '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 11, cursor: confirmed ? 'default' : 'pointer', fontWeight: 600, marginTop: 4 }}
              >
                {n.actionLabel}
              </button>
            )}
            {i === 0 && <div style={{ height: 1, background: '#e8def8', margin: '8px 0 0' }} />}
          </div>
        ))}

        {confirmed && (
          <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 10, padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>✅ Địa chỉ đã xác nhận</div>
            <div style={{ fontSize: 12, color: '#388e3c', marginBottom: 8 }}>{addressB}</div>
            <div style={{ fontSize: 11, color: '#4caf50', marginBottom: 8 }}>Hệ thống đang tìm shipper phù hợp tuyến Biên Hòa → Hố Nai...</div>
            <button onClick={() => go('s-delivery')} style={{ background: C.p, color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
              🚚 Xem danh sách shipper
            </button>
          </div>
        )}
      </div>

      {/* Popup xác nhận địa chỉ B */}
      {showConfirmB && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }} onClick={() => setShowConfirmB(false)}>
          <div style={{ background: C.w, borderRadius: '20px 20px 0 0', padding: '24px 20px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: C.t, marginBottom: 6 }}>📍 Xác nhận địa chỉ nhận hàng</h3>
            <div style={{ background: C.pl, borderRadius: 10, padding: 10, marginBottom: 14, fontSize: 12, color: C.pd }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Đơn hàng: iPhone 13 Pro 256GB</div>
              <div>Người bán: SX-00127 • Biên Hòa</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 5, display: 'block' }}>
                Địa chỉ nhận hàng của bạn (Điểm B) <span style={{ color: '#e53935' }}>*</span>
              </label>
              <input
                value={addressB}
                onChange={e => setAddressB(e.target.value)}
                placeholder="VD: 45 Bùi Thị Xuân, Hố Nai, Đồng Nai"
                style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none' }}
              />
            </div>
            <div style={{ fontSize: 11, color: C.m, marginBottom: 14, lineHeight: 1.5 }}>
              ⚠️ Địa chỉ này chỉ hiển thị với Shipper được chọn. Người bán không thấy địa chỉ cụ thể của bạn.
            </div>
            <button onClick={confirmAddressB} style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>
              ✅ Xác nhận địa chỉ nhận hàng
            </button>
            <button onClick={() => setShowConfirmB(false)} style={{ width: '100%', background: 'none', border: 'none', color: C.m, fontSize: 13, cursor: 'pointer', padding: 6 }}>
              Để sau
            </button>
          </div>
        </div>
      )}

      <div style={{ height: 80 }} />
    </div>
  );
}
