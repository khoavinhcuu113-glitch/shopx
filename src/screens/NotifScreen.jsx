import { useState } from 'react';
import { C } from '../constants';
import { Shdr, Btn } from '../components/UI';

export default function NotifScreen({ go }) {
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [address, setAddress]           = useState('');
  const [addrConfirmed, setAddrConfirmed] = useState(false);
  const [showFindShipper, setShowFindShipper] = useState(false);
  const [shipperFound, setShipperFound]   = useState(false);
  const [countdown, setCountdown]         = useState(60);

  function confirmAddr() {
    if (!address.trim()) { alert('Vui lòng nhập địa chỉ nhận hàng'); return; }
    setAddrConfirmed(true);
    setShowAddrForm(false);
  }

  function findShipper() {
    setShowFindShipper(true);
    let c = 60;
    const timer = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 45) {
        clearInterval(timer);
        setShipperFound(true);
      }
    }, 100); // nhanh hơn để demo
  }

  const notifs = [
    {
      id: 'need-addr',
      icon: '📦',
      title: 'SX-00127 muốn giao hàng đến bạn',
      desc: 'iPhone 13 Pro 256GB • 18.500.000đ • Biên Hòa',
      time: '30 phút trước',
      type: 'ship',
      needAction: true,
    },
    {
      id: 'buyer-contact',
      icon: '💬',
      title: 'Có người quan tâm tin đăng của bạn',
      desc: 'SX-00089 hỏi về: iPhone 13 Pro 256GB còn BH',
      time: '1 giờ trước',
      type: 'seller',
      needAction: true,
      badge: 2,
    },
    {
      id: 'service-done',
      icon: '🔨',
      title: 'Thợ báo đã hoàn thành công việc',
      desc: 'Anh Văn Nhân • Sửa điện phòng ngủ • Chờ bạn xác nhận',
      time: '2 giờ trước',
      type: 'service',
      needAction: true,
    },
    {
      id: 'chat',
      icon: '💬',
      title: 'SX-00199 (Thợ điện) đã phản hồi',
      desc: 'Mình có thể qua chiều nay lúc 15h được bạn nhé.',
      time: '3 giờ trước',
      type: 'chat',
      needAction: false,
    },
    {
      id: 'review-remind',
      icon: '⭐',
      title: 'Nhắc đánh giá — nhận 5 SX Points',
      desc: 'Đơn hàng iPhone 12 Pro đã hoàn tất. Đánh giá người bán để nhận điểm thưởng.',
      time: '4 giờ trước',
      type: 'review',
      needAction: false,
    },
    {
      id: 'done',
      icon: '✅',
      title: 'Giao hàng hoàn thành',
      desc: 'Shipper SP-001 đã giao iPhone 12 Pro thành công.',
      time: '5 giờ trước',
      type: 'done',
      needAction: false,
    },
    {
      id: 'points',
      icon: '🏆',
      title: 'SX Points: Nhận được 20 điểm',
      desc: 'Giao dịch thành công. Tổng: 1.250 SX Points.',
      time: 'Hôm qua 18:30',
      type: 'points',
      needAction: false,
    },
  ];

  return (
    <div>
      <Shdr title="Thông báo" onBack={() => go('s-home')} />
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.m, marginBottom: 8 }}>Hôm nay</div>

        {notifs.map((n, i) => (
          <div key={n.id} style={{ background: C.w, borderLeft: `3px solid ${n.needAction ? C.p : '#e0d4f7'}`, borderRadius: '0 10px 10px 0', padding: '10px 12px', marginBottom: 8, borderTop: '1px solid #e8def8', borderRight: '1px solid #e8def8', borderBottom: '1px solid #e8def8' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: C.m }}>{n.desc}</div>
                <div style={{ fontSize: 10, color: '#bbb', marginTop: 4 }}>{n.time}</div>
              </div>
            </div>

            {/* Action cho đơn cần xác nhận địa chỉ */}
            {n.type === 'ship' && !addrConfirmed && (
              <button onClick={() => setShowAddrForm(true)} style={{ background: C.p, color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600, marginTop: 4 }}>
                📍 Nhập địa chỉ nhận hàng
              </button>
            )}

            {/* Action người bán có tin nhắn mới */}
            {n.type === 'seller' && (
              <button onClick={() => go('s-chat-buy')}
                style={{ background: C.p, color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600, marginTop: 4 }}>
                💬 Xem tin nhắn ({n.badge} mới)
              </button>
            )}

            {/* Action nhắc đánh giá */}
            {n.type === 'review' && (
              <button onClick={() => go('s-rating')}
                style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600, marginTop: 4 }}>
                ⭐ Đánh giá ngay → +5 SX Points
              </button>
            )}

            {/* Action đơn dịch vụ thợ hoàn thành */}
            {n.type === 'service' && (
              <button onClick={() => { sessionStorage.setItem('sx_service_return', 's-notif'); go('s-service-order-hirer'); }}
                style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600, marginTop: 4 }}>
                ✅ Xác nhận hoàn thành
              </button>
            )}

            {/* Đã xác nhận địa chỉ */}
            {n.needAction && addrConfirmed && !showFindShipper && (
              <div style={{ marginTop: 8 }}>
                <div style={{ background: '#e8f5e9', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#2e7d32', marginBottom: 8 }}>
                  ✅ Địa chỉ nhận: <strong>{address}</strong>
                </div>
                <button onClick={findShipper} style={{ background: C.p, color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                  🚚 Tìm Shipper ShopX
                </button>
              </div>
            )}

            {/* Đang tìm shipper */}
            {n.needAction && showFindShipper && !shipperFound && (
              <div style={{ background: C.pl, borderRadius: 8, padding: 10, marginTop: 8, border: `1px solid ${C.b}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 6 }}>🔍 Đang tìm Shipper phù hợp...</div>
                <div style={{ fontSize: 11, color: C.m, marginBottom: 8 }}>
                  Tuyến: Biên Hòa → {address.split(',')[0]}<br/>
                  Hệ thống đề xuất shipper theo thứ tự uy tín
                </div>
                {/* Progress bar */}
                <div style={{ background: '#e0d4f7', borderRadius: 10, height: 6, marginBottom: 6 }}>
                  <div style={{ background: C.p, borderRadius: 10, height: 6, width: `${((60-countdown)/60)*100}%`, transition: 'width 0.1s' }} />
                </div>
                <div style={{ fontSize: 10, color: C.m }}>⏱️ {countdown} giây... Chờ Shipper phản hồi</div>
              </div>
            )}

            {/* Shipper đã nhận đơn → Hiện OTP */}
            {n.needAction && shipperFound && (
              <div style={{ marginTop: 8 }}>
                <div style={{ background: '#e8f5e9', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#2e7d32', marginBottom: 8 }}>
                  🚚 <strong>Trần Văn Cường (SP-001)</strong> đã nhận đơn!<br/>
                  Shipper đang trên đường đến lấy hàng tại Biên Hòa.
                </div>

                {/* OTP + QR */}
                <div style={{ background: C.pl, border: `1.5px solid ${C.p}`, borderRadius: 10, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 8 }}>
                    🔐 Mã OTP xác nhận nhận hàng
                  </div>
                  {/* QR giả lập */}
                  <div style={{ display: 'inline-block', padding: 8, background: '#fff', border: '2px solid #000', borderRadius: 4, marginBottom: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,8px)', gap: 1 }}>
                      {[1,1,1,1,1,1,1, 1,0,0,0,0,0,1, 1,0,1,1,1,0,1, 1,0,1,0,1,0,1, 1,0,1,1,1,0,1, 1,0,0,0,0,0,1, 1,1,1,1,1,1,1].map((v,i) => (
                        <div key={i} style={{ width: 8, height: 8, background: v ? '#000' : '#fff' }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 8, color: C.p, marginBottom: 4 }}>482916</div>
                  <div style={{ fontSize: 10, color: '#e53935', marginBottom: 10 }}>
                    ⚠️ Chỉ đưa mã này khi đã kiểm tra hàng OK
                  </div>
                  <div style={{ fontSize: 11, color: C.m }}>
                    Shipper sẽ quét QR hoặc nhập mã này<br/>
                    để xác nhận giao hàng thành công
                  </div>
                </div>

                <button onClick={() => { sessionStorage.setItem('sx_3way_return', 's-notif'); go('s-chat-3way'); }} style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 10, borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600, marginTop: 8 }}>
                  💬 Vào chat 3 bên
                </button>
              </div>
            )}

            {i === 0 && <div style={{ height: 1, background: '#e8def8', margin: '8px 0 0' }} />}
          </div>
        ))}
      </div>

      {/* Popup nhập địa chỉ B */}
      {showAddrForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }} onClick={() => setShowAddrForm(false)}>
          <div style={{ background: C.w, borderRadius: '20px 20px 0 0', padding: '24px 20px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: C.t, marginBottom: 6 }}>📍 Nhập địa chỉ nhận hàng</h3>
            <div style={{ background: C.pl, borderRadius: 10, padding: 10, marginBottom: 14, fontSize: 12, color: C.pd }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Đơn hàng: iPhone 13 Pro 256GB</div>
              <div>Người bán: SX-00127 • Biên Hòa</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 5, display: 'block' }}>
                Địa chỉ nhận hàng của bạn (Điểm B) <span style={{ color: '#e53935' }}>*</span>
              </label>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="VD: 45 Bùi Thị Xuân, Hố Nai, Biên Hòa"
                style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none' }}
              />
            </div>
            <div style={{ fontSize: 11, color: C.m, marginBottom: 14, lineHeight: 1.5 }}>
              ⚠️ Địa chỉ chỉ hiển thị với Shipper được chọn.<br/>
              Hệ thống dùng địa chỉ này để tính khoảng cách và tìm Shipper phù hợp.
            </div>
            <button onClick={confirmAddr} style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>
              ✅ Xác nhận địa chỉ nhận hàng
            </button>
            <button onClick={() => setShowAddrForm(false)} style={{ width: '100%', background: 'none', border: 'none', color: C.m, fontSize: 13, cursor: 'pointer', padding: 6 }}>
              Để sau
            </button>
          </div>
        </div>
      )}

      <div style={{ height: 80 }} />
    </div>
  );
}
