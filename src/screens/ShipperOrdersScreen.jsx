import { useState } from 'react';
import { C } from '../constants';
import { Shdr, Btn } from '../components/UI';

// Danh sách đơn hàng cần shipper nhận
const PENDING_ORDERS = [
  {
    id: 'ORD-001',
    item: 'iPhone 13 Pro 256GB',
    icon: '📱',
    from: 'Biên Hòa (123 Nguyễn Ái Quốc)',
    to: 'Hố Nai (45 Bùi Thị Xuân)',
    distance: '8km',
    value: '18.500.000đ',
    type: '📱 Đồ điện tử',
    posted: '5 phút trước',
    urgent: true,
  },
  {
    id: 'ORD-002',
    item: 'Máy lạnh Daikin 1.5HP',
    icon: '❄️',
    from: 'Trảng Bom (56 Lý Thường Kiệt)',
    to: 'Biên Hòa (78 Đồng Khởi)',
    distance: '15km',
    value: '5.800.000đ',
    type: '❄️ Điện lạnh',
    posted: '12 phút trước',
    urgent: false,
  },
  {
    id: 'ORD-003',
    item: 'Xe đạp Trek FX3',
    icon: '🚲',
    from: 'Long Khánh (34 Trần Phú)',
    to: 'Hố Nai (12 Lê Lợi)',
    distance: '22km',
    value: '8.200.000đ',
    type: '🎮 Giải trí & Thể thao',
    posted: '20 phút trước',
    urgent: false,
  },
];

export default function ShipperOrdersScreen({ go }) {
  const [orders, setOrders]   = useState(PENDING_ORDERS);
  const [accepted, setAccepted] = useState(null);
  const [declined, setDeclined] = useState([]);

  function acceptOrder(order) {
    setAccepted(order);
    setOrders(o => o.filter(x => x.id !== order.id));
  }

  function declineOrder(orderId) {
    setDeclined(d => [...d, orderId]);
    setOrders(o => o.filter(x => x.id !== orderId));
  }

  return (
    <div>
      <Shdr title="Đơn hàng cần Shipper" onBack={() => go('s-service')} />

      <div style={{ padding: 12 }}>

        {/* Đơn đã nhận */}
        {accepted && (
          <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2e7d32', marginBottom: 8 }}>
              🚚 Bạn đã nhận đơn này!
            </div>
            <div style={{ fontSize: 12, color: C.t, marginBottom: 4 }}>
              <span style={{ fontSize: 20, marginRight: 6 }}>{accepted.icon}</span>
              {accepted.item}
            </div>
            <div style={{ fontSize: 11, color: C.m, marginBottom: 4 }}>
              📍 Lấy: {accepted.from}
            </div>
            <div style={{ fontSize: 11, color: C.m, marginBottom: 8 }}>
              📍 Giao: {accepted.to}
            </div>
            <div style={{ background: '#fff', borderRadius: 8, padding: 8, marginBottom: 10, fontSize: 11 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: C.m }}>Khoảng cách</span>
                <span style={{ fontWeight: 600 }}>{accepted.distance}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: C.m }}>Giá trị hàng</span>
                <span style={{ fontWeight: 600, color: C.p }}>{accepted.value}</span>
              </div>
            </div>
            <div style={{ background: C.pl, borderRadius: 8, padding: 8, fontSize: 11, color: C.pd, marginBottom: 10 }}>
              🔐 OTP sẽ được tạo và gửi đến người mua.<br/>
              Khi giao hàng thành công, yêu cầu người mua cung cấp OTP hoặc cho quét QR.
            </div>
            <button onClick={() => go('s-chat-3way')}
              style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 11, borderRadius: 10, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
              💬 Vào chat 3 bên với người bán & người mua
            </button>
          </div>
        )}

        {/* Danh sách đơn chờ */}
        {orders.length > 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 4 }}>
              📋 Đơn hàng đang chờ Shipper
            </div>
            <div style={{ fontSize: 11, color: C.m, marginBottom: 12 }}>
              Hệ thống đề xuất theo tuyến đường & uy tín của bạn
            </div>

            {orders.map((order, i) => (
              <div key={order.id} style={{ background: C.w, border: `1.5px solid ${order.urgent ? C.p : '#e8def8'}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                {order.urgent && (
                  <div style={{ background: C.p, color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 10, display: 'inline-block', marginBottom: 8 }}>
                    ⚡ Ưu tiên cao
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, background: C.pl, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {order.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 2 }}>{order.item}</div>
                    <div style={{ fontSize: 10, color: C.m }}>{order.type} • Đăng {order.posted}</div>
                  </div>
                </div>

                <div style={{ background: '#f8f5ff', borderRadius: 8, padding: 10, marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 14 }}>🟢</span>
                    <div>
                      <div style={{ fontSize: 10, color: C.m }}>Lấy hàng tại</div>
                      <div style={{ fontSize: 12, color: C.t }}>{order.from}</div>
                    </div>
                  </div>
                  <div style={{ width: 2, height: 12, background: C.p, marginLeft: 7, marginBottom: 6 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>🔴</span>
                    <div>
                      <div style={{ fontSize: 10, color: C.m }}>Giao đến</div>
                      <div style={{ fontSize: 12, color: C.t }}>{order.to}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.p }}>{order.distance}</div>
                    <div style={{ fontSize: 10, color: C.m }}>Khoảng cách</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.t }}>{order.value}</div>
                    <div style={{ fontSize: 10, color: C.m }}>Giá trị hàng</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#2e7d32' }}>Tự định</div>
                    <div style={{ fontSize: 10, color: C.m }}>Phí ship</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button onClick={() => declineOrder(order.id)}
                    style={{ background: '#fff', color: '#e53935', border: '1.5px solid #e53935', padding: 10, borderRadius: 10, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                    ✕ Từ chối
                  </button>
                  <button onClick={() => acceptOrder(order)}
                    style={{ background: C.p, color: '#fff', border: 'none', padding: 10, borderRadius: 10, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                    ✓ Nhận đơn
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Không còn đơn */}
        {orders.length === 0 && !accepted && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: C.m }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Chưa có đơn hàng mới</div>
            <div style={{ fontSize: 12 }}>Hệ thống sẽ thông báo khi có đơn phù hợp với tuyến của bạn</div>
          </div>
        )}

        {declined.length > 0 && (
          <div style={{ background: '#fff3e0', borderRadius: 10, padding: 10, marginTop: 8, fontSize: 11, color: '#e65100' }}>
            ⚠️ Bạn đã từ chối {declined.length} đơn. Từ chối nhiều lần sẽ bị trừ điểm tín nhiệm.
          </div>
        )}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
