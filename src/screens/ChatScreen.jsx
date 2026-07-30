import { useState } from 'react';
import { C } from '../constants';
import { SAMPLE_SHIPPERS } from '../constants';

export default function ChatScreen({ go, type }) {
  const [step, setStep]           = useState('chat'); // chat | addr | map | shippers | invited
  const [address, setAddress]     = useState('');
  const [addrConfirmed, setAddrConfirmed] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [input, setInput]         = useState('');
  const [msgs, setMsgs]           = useState(getInitMsgs(type));

  function getInitMsgs(t) {
    if (t === 'buy') return [
      { me: false, from: 'SX-00127 (Người bán)', text: 'Xin chào! Bạn quan tâm đến iPhone 13 Pro của mình ạ?', time: '10:30' },
      { me: true,  text: 'Dạ, máy còn bảo hành không anh? Ship về Hố Nai được không?', time: '10:31' },
      { me: false, from: 'SX-00127 (Người bán)', text: 'Còn BH Apple đến 3/2025. Ship được, dùng giao hàng ShopX cho an toàn nhé!', time: '10:32' },
    ];
    if (t === 'job') return [
      { me: false, from: 'SX-00089', text: 'Chào anh/chị, máy lạnh nhà mình không lạnh, cần vệ sinh và nạp gas.', time: '14:05' },
      { me: true,  text: 'Dạ chào bạn! Mình chuyên sửa máy lạnh 5 năm KN. Cho mình địa chỉ nhé!', time: '14:07' },
    ];
    return [
      { me: true,  text: 'Chào anh, nhà mình bị mất điện 1 phòng ngủ. Anh có thể đến xem không?', time: '09:15' },
      { me: false, from: 'SX-00127 (Thợ điện)', text: 'Chào bạn! Có thể do cầu dao phụ hỏng. Bạn ở khu vực nào?', time: '09:17' },
    ];
  }

  const cfgMap = {
    buy:    { title: 'Chat với người bán', sub: 'iPhone 13 Pro 256GB', t1: 'Người mua (bạn)', v1: 'SX-00001', t2: 'Người bán', v2: 'SX-00127', ctxBg: '#e8f0fe', ctxBorder: '#c5d8ff', ctxColor: '#1a237e', ctxTitle: '🛒 Mua bán — iPhone 13 Pro 256GB', ctxDesc: 'Giá: 18.500.000đ • Người bán tại Biên Hòa' },
    job:    { title: 'Trao đổi công việc', sub: 'Tin tìm thợ • Sửa máy lạnh', t1: 'Thợ nhận việc (bạn)', v1: 'SX-00001', t2: 'Người đăng việc', v2: 'SX-00089', ctxBg: '#fff3e0', ctxBorder: '#ffe0b2', ctxColor: '#e65100', ctxTitle: '🔧 Tin tìm thợ — Sửa máy lạnh', ctxDesc: 'Ngân sách: 200.000đ • Biên Hòa' },
    worker: { title: 'Liên hệ thợ', sub: 'Hồ sơ thợ • Thợ điện', t1: 'Người cần thợ (bạn)', v1: 'SX-00001', t2: 'Thợ điện', v2: 'SX-00127', ctxBg: '#f3e5f5', ctxBorder: '#d1c4e9', ctxColor: '#4a148c', ctxTitle: '✅ Liên hệ từ Hồ sơ thợ', ctxDesc: 'Anh Văn Nhân • 8 năm KN • 80.000đ/giờ' },
  };
  const c = cfgMap[type] || cfgMap.buy;

  function sendMsg() {
    if (!input.trim()) return;
    setMsgs(m => [...m, { me: true, text: input, time: 'Vừa xong' }]);
    setInput('');
  }

  function confirmAddr() {
    if (!address.trim()) { alert('Vui lòng nhập địa chỉ nhận hàng'); return; }
    setAddrConfirmed(true);
    setStep('map');
  }

  function chooseShipper(s) {
    setSelectedShipper(s);
    setShowInvite(true);
  }

  function inviteShipper() {
    setShowInvite(false);
    setStep('invited');
    setMsgs(m => [...m, {
      me: true,
      text: `✅ Đã mời ${selectedShipper.name} vào đơn. Hệ thống đang chờ Shipper xác nhận...`,
      time: 'Vừa xong'
    }]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'absolute', inset: 0 }}>

      {/* Header */}
      <div style={{ background: C.p, padding: '10px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button onClick={() => go('s-service')} style={{ color: '#fff', border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, padding: 4 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{c.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>{c.sub}</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 10px', display: 'flex', justifyContent: 'space-between' }}>
          <div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{c.t1}</div><div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{c.v1}</div></div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>↔</span>
          <div style={{ textAlign: 'right' }}><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{c.t2}</div><div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{c.v2}</div></div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: C.g }}>

        {/* Context */}
        <div style={{ background: c.ctxBg, border: `1px solid ${c.ctxBorder}`, borderRadius: 10, padding: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: c.ctxColor, marginBottom: 4 }}>{c.ctxTitle}</div>
          <div style={{ fontSize: 11, color: c.ctxColor }}>{c.ctxDesc}</div>
          <div style={{ fontSize: 10, color: c.ctxColor, marginTop: 4 }}>🛡️ ShopX ghi lại cuộc trò chuyện làm bằng chứng pháp lý.</div>
        </div>

        {/* Messages */}
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', marginBottom: 10, alignItems: m.me ? 'flex-end' : 'flex-start' }}>
            {!m.me && <div style={{ fontSize: 10, color: C.m, marginBottom: 3 }}>{m.from}</div>}
            <div style={{ maxWidth: '78%', padding: '8px 12px', borderRadius: m.me ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 13, lineHeight: 1.4, background: m.me ? C.p : C.w, color: m.me ? '#fff' : C.t, border: m.me ? 'none' : '1px solid #e8def8' }}>
              {m.text}
            </div>
            <div style={{ fontSize: 10, color: C.m, marginTop: 3 }}>{m.time}</div>
          </div>
        ))}

        {/* Chọn hình thức — chỉ hiện trong chat mua bán */}
        {type === 'buy' && step === 'chat' && (
          <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 10, margin: '8px 0', border: '1px solid #c8e6c9' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>🤝 Chốt hình thức giao dịch</div>
            <div style={{ fontSize: 11, color: '#388e3c', marginBottom: 10 }}>2 bên đã thỏa thuận xong. Chọn hình thức tiếp theo:</div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              <button onClick={() => { setMsgs(m => [...m, { me: true, text: '🤝 Tôi chọn gặp trực tiếp. Chúng ta tự thỏa thuận nhé!', time: 'Vừa xong' }]); setStep('direct'); }}
                style={{ background: '#fff', color: C.t, border: '1px solid #ccc', padding: '8px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>
                🤝 Gặp trực tiếp — Tự thỏa thuận
              </button>
              <button onClick={() => setStep('addr')}
                style={{ background: C.p, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600, textAlign: 'left' }}>
                🚚 Dùng Shipper ShopX — Nhập địa chỉ nhận hàng
              </button>
            </div>
          </div>
        )}

        {/* Nút thuê thợ — chỉ hiện trong chat tìm thợ */}
        {type === 'worker' && step === 'chat' && (
          <div style={{ background: '#f3e5f5', borderRadius: 10, padding: 10, margin: '8px 0', border: '1px solid #d1c4e9' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4a148c', marginBottom: 4 }}>
              🔨 Chốt thuê thợ
            </div>
            <div style={{ fontSize: 11, color: '#6a1b9a', marginBottom: 10, lineHeight: 1.5 }}>
              2 bên đã thỏa thuận xong. Xác nhận thuê thợ này?
            </div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              <button
                onClick={() => {
                  setMsgs(m => [...m, { me: true, text: '✅ Tôi xác nhận thuê anh/chị. Hẹn gặp theo thời gian đã thỏa thuận!', time: 'Vừa xong' }]);
                  setStep('hired');
                }}
                style={{ background: '#4a148c', color: '#fff', border: 'none', padding: '9px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600, textAlign: 'left' }}>
                ✅ Xác nhận thuê thợ này
              </button>
              <button
                onClick={() => go('s-service')}
                style={{ background: '#fff', color: '#4a148c', border: '1px solid #d1c4e9', padding: '8px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>
                🔍 Tìm thợ khác
              </button>
            </div>
          </div>
        )}

        {/* Đã xác nhận thuê thợ */}
        {type === 'worker' && step === 'hired' && (
          <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 12, margin: '8px 0', border: '1px solid #c8e6c9', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>
              Đã xác nhận thuê thợ!
            </div>
            <div style={{ fontSize: 11, color: '#388e3c', lineHeight: 1.5 }}>
              ShopX đã ghi nhận thỏa thuận này. Lịch sử chat được lưu làm bằng chứng pháp lý nếu cần.
            </div>
          </div>
        )}

        {/* Nút nhận việc — chỉ hiện trong chat tin tìm thợ (thợ xem) */}
        {type === 'job' && step === 'chat' && (
          <div style={{ background: '#fff3e0', borderRadius: 10, padding: 10, margin: '8px 0', border: '1px solid #ffe082' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#e65100', marginBottom: 4 }}>
              🔧 Chốt nhận việc
            </div>
            <div style={{ fontSize: 11, color: '#bf360c', marginBottom: 10, lineHeight: 1.5 }}>
              2 bên đã thỏa thuận xong. Xác nhận nhận việc này?
            </div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              <button
                onClick={() => {
                  setMsgs(m => [...m, { me: true, text: '✅ Tôi xác nhận nhận việc này. Sẽ có mặt đúng giờ theo thỏa thuận!', time: 'Vừa xong' }]);
                  setStep('accepted');
                }}
                style={{ background: '#e65100', color: '#fff', border: 'none', padding: '9px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600, textAlign: 'left' }}>
                ✅ Xác nhận nhận việc này
              </button>
              <button
                onClick={() => go('s-service')}
                style={{ background: '#fff', color: '#e65100', border: '1px solid #ffe082', padding: '8px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>
                🔍 Quay lại tìm việc khác
              </button>
            </div>
          </div>
        )}

        {/* Đã xác nhận nhận việc */}
        {type === 'job' && step === 'accepted' && (
          <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 12, margin: '8px 0', border: '1px solid #c8e6c9', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>
              Đã xác nhận nhận việc!
            </div>
            <div style={{ fontSize: 11, color: '#388e3c', lineHeight: 1.5 }}>
              ShopX đã ghi nhận thỏa thuận. Lịch sử chat được lưu làm bằng chứng pháp lý nếu cần.
            </div>
          </div>
        )}

        {/* Gặp trực tiếp */}
        {step === 'direct' && (
          <div style={{ background: '#fff8e1', borderRadius: 10, padding: 10, border: '1px solid #ffe082' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#f57f17', marginBottom: 4 }}>🤝 Giao dịch trực tiếp</div>
            <div style={{ fontSize: 11, color: '#e65100', lineHeight: 1.5 }}>
              ShopX không can thiệp vào giao dịch này. Lịch sử chat được lưu làm bằng chứng nếu có tranh chấp.
            </div>
          </div>
        )}

        {/* Nhập địa chỉ B */}
        {step === 'addr' && (
          <div style={{ background: C.pl, borderRadius: 12, padding: 14, border: `1.5px solid ${C.p}`, margin: '8px 0' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.pd, marginBottom: 6 }}>📍 Nhập địa chỉ nhận hàng của bạn</div>
            <div style={{ fontSize: 11, color: C.m, marginBottom: 10, lineHeight: 1.5 }}>
              Hệ thống dùng địa chỉ này để tính khoảng cách A→B và tìm Shipper phù hợp.
              Địa chỉ chỉ hiển thị với Shipper được chọn.
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: C.pd, marginBottom: 4, fontWeight: 600 }}>Điểm A (Người bán):</div>
              <div style={{ background: '#fff', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: C.t, border: `1px solid ${C.b}` }}>
                📍 123 Nguyễn Ái Quốc, Biên Hòa, Đồng Nai
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: C.pd, marginBottom: 4, fontWeight: 600 }}>Điểm B (Địa chỉ nhận của bạn): <span style={{ color: '#e53935' }}>*</span></div>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="VD: 45 Bùi Thị Xuân, Hố Nai, Biên Hòa"
                style={{ width: '100%', border: `1.5px solid ${C.p}`, borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none' }}
              />
            </div>
            <button onClick={confirmAddr}
              style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 11, borderRadius: 10, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
              ✅ Xác nhận địa chỉ nhận hàng
            </button>
          </div>
        )}

        {/* Bản đồ A→B + Danh sách Shipper */}
        {(step === 'map' || step === 'shippers' || step === 'invited') && (
          <div>
            {/* Bản đồ giả lập */}
            <div style={{ background: C.pl, borderRadius: 12, padding: 12, border: `1px solid ${C.b}`, marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 8 }}>🗺️ Tuyến đường giao hàng</div>
              <div style={{ background: '#fff', borderRadius: 10, height: 100, position: 'relative', overflow: 'hidden', border: `1px solid ${C.b}`, marginBottom: 8 }}>
                <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: 3, background: C.p, borderRadius: 2, transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', width: 12, height: 12, background: '#2e7d32', borderRadius: '50%', border: '2px solid #fff', top: '50%', left: '10%', transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', width: 12, height: 12, background: '#e53935', borderRadius: '50%', border: '2px solid #fff', top: '50%', right: '10%', transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', fontSize: 9, color: '#2e7d32', fontWeight: 600, top: '20%', left: '6%' }}>A<br/>Biên Hòa</div>
                <div style={{ position: 'absolute', fontSize: 9, color: '#e53935', fontWeight: 600, top: '20%', right: '3%', textAlign: 'right' }}>B<br/>Hố Nai</div>
                <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: C.pd, fontWeight: 600, whiteSpace: 'nowrap' }}>~8km • ~20 phút</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <div><span style={{ color: C.m }}>Điểm A: </span><span style={{ color: C.t, fontWeight: 500 }}>Biên Hòa</span></div>
                <div><span style={{ color: C.m }}>Điểm B: </span><span style={{ color: C.t, fontWeight: 500 }}>{address.split(',')[0]}</span></div>
              </div>
              <div style={{ fontSize: 9, color: C.m, marginTop: 4, textAlign: 'center' }}>
                OpenStreetMap — Sắp tích hợp bản đồ thật
              </div>
            </div>

            {/* Thông báo đã đăng tin tìm shipper */}
            <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 10, border: '1px solid #c8e6c9', marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>
                ✅ Hệ thống đã tạo tin tìm Shipper
              </div>
              <div style={{ fontSize: 11, color: '#388e3c', lineHeight: 1.5 }}>
                → Tin đăng lên mục "Đơn hàng cần Shipper"<br/>
                → Thông báo gửi đến Shipper phù hợp tuyến<br/>
                → Bạn cũng có thể chọn Shipper bên dưới
              </div>
            </div>

            {/* Danh sách Shipper */}
            {step !== 'invited' && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 8 }}>
                  🚚 Chọn Shipper tuyến Biên Hòa → Hố Nai
                </div>
                {SAMPLE_SHIPPERS.map((s, i) => (
                  <div key={s.id} style={{ background: C.w, border: `1px solid ${s.priority ? '#f59e0b' : '#e8def8'}`, borderRadius: 12, padding: 12, marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{s.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.t }}>{s.name}</span>
                        <span style={{ fontSize: 10, background: s.priority ? '#fff3e0' : C.pl, color: s.priority ? '#e65100' : C.pd, padding: '2px 6px', borderRadius: 8 }}>{s.badge}</span>
                      </div>
                      <div style={{ fontSize: 11, color: C.m, marginBottom: 4 }}>{s.route} • {s.time}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: '#f59e0b' }}>⭐ {s.stars}</span>
                        <span style={{ fontSize: 10, color: C.m }}>{s.orders.toLocaleString('vi-VN')} đơn</span>
                        <span style={{ fontSize: 10, background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: 8 }}>✅ {s.rate}%</span>
                      </div>
                    </div>
                    <button onClick={() => chooseShipper(s)}
                      style={{ background: C.p, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>
                      Chọn
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Đã mời Shipper */}
            {step === 'invited' && selectedShipper && (
              <div style={{ background: C.pl, borderRadius: 12, padding: 14, border: `1.5px solid ${C.p}`, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.pd, marginBottom: 6 }}>
                  Đã mời {selectedShipper.name}
                </div>
                <div style={{ fontSize: 11, color: C.m, marginBottom: 12, lineHeight: 1.5 }}>
                  Đang chờ Shipper xác nhận nhận đơn.<br/>
                  Khi Shipper đồng ý, chat 3 bên sẽ tự động mở.<br/>
                  Nếu sau 60 phút không phản hồi, bạn có thể chọn Shipper khác.
                </div>
                <button onClick={() => go('s-chat-3way')}
                  style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 11, borderRadius: 10, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  💬 Vào chat 3 bên (demo)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: C.w, borderTop: `1px solid ${C.b}`, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()}
          style={{ flex: 1, border: `1.5px solid ${C.b}`, borderRadius: 20, padding: '8px 14px', fontSize: 13, outline: 'none' }}
          placeholder="Nhập tin nhắn..." />
        <button onClick={sendMsg} style={{ background: C.p, color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}>➤</button>
      </div>

      {/* Popup xác nhận mời Shipper */}
      {showInvite && selectedShipper && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }} onClick={() => setShowInvite(false)}>
          <div style={{ background: C.w, borderRadius: '20px 20px 0 0', padding: '24px 20px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: C.t, marginBottom: 8 }}>
              Mời {selectedShipper.name} vào đơn?
            </h3>
            <div style={{ background: C.pl, borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 12, color: C.pd }}>
              <div style={{ marginBottom: 4 }}>⭐ {selectedShipper.badge} • {selectedShipper.stars} sao</div>
              <div style={{ marginBottom: 4 }}>✅ {selectedShipper.rate}% hoàn thành • {selectedShipper.orders.toLocaleString('vi-VN')} đơn</div>
              <div style={{ marginBottom: 4 }}>💰 Chịu trách nhiệm đến {(selectedShipper.maxValue/1000000).toFixed(0)}tr đồng</div>
              <div>📍 Tuyến: Biên Hòa → {address.split(',')[0] || 'Hố Nai'} (~8km)</div>
            </div>
            <div style={{ fontSize: 12, color: C.m, marginBottom: 14, lineHeight: 1.6, background: '#e8f5e9', padding: 10, borderRadius: 8 }}>
              ℹ️ Sau khi Shipper đồng ý:<br/>
              → Hệ thống tạo OTP gửi về điện thoại bạn<br/>
              → Chat 3 bên tự động mở<br/>
              → Tin tìm Shipper tự xóa
            </div>
            <button onClick={inviteShipper}
              style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>
              🚚 Mời {selectedShipper.name} vào đơn
            </button>
            <button onClick={() => setShowInvite(false)}
              style={{ width: '100%', background: 'none', border: `1px solid ${C.b}`, color: C.m, padding: 10, borderRadius: 12, fontSize: 13, cursor: 'pointer' }}>
              Chọn Shipper khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
