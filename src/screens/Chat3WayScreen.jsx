import { useState } from 'react';
import { C } from '../constants';

const INIT_MSGS = [
  { from: 'system', text: '🚀 Chat 3 bên đã được tạo tự động. Người bán, Người mua và Shipper có thể trao đổi tại đây.' },
  { from: 'seller', name: 'SX-00127 (Người bán)', text: 'Chào Shipper! Hàng là iPhone 13 Pro, đóng gói kỹ rồi. Địa chỉ lấy: 123 Nguyễn Ái Quốc, Biên Hòa.' },
  { from: 'shipper', name: 'SP-001 (Chị Thu Hương)', text: 'Dạ, mình sẽ qua lấy lúc 18h hôm nay. Người mua vui lòng có mặt để nhận hàng nhé!' },
  { from: 'buyer', name: 'SX-00001 (Người mua)', text: 'Mình ở nhà cả buổi tối. Địa chỉ nhận: 45 Bùi Thị Xuân, Hố Nai. SĐT: 0901234567.' },
];

export default function Chat3WayScreen({ go }) {
  const [msgs, setMsgs] = useState(INIT_MSGS);
  const [input, setInput] = useState('');

  function sendMsg() {
    if (!input.trim()) return;
    setMsgs(m => [...m, { from: 'buyer', name: 'SX-00001 (Bạn)', text: input }]);
    setInput('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'absolute', inset: 0 }}>
      {/* Header */}
      <div style={{ background: C.p, padding: '10px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button onClick={() => go('s-delivery')} style={{ color: '#fff', border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, padding: 4 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Chat 3 bên</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>Đơn hàng • iPhone 13 Pro 256GB</div>
          </div>
        </div>
        {/* 3 người trong phòng */}
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {[
            { tag: 'Người bán', val: 'SX-00127', align: 'left' },
            { tag: 'Shipper',   val: 'SP-001',   align: 'center' },
            { tag: 'Người mua', val: 'SX-00001', align: 'right' },
          ].map((p, i) => (
            <div key={i} style={{ textAlign: p.align }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{p.tag}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{p.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: C.g }}>
        {msgs.map((m, i) => {
          if (m.from === 'system') {
            return (
              <div key={i} style={{ textAlign: 'center', fontSize: 11, color: C.m, background: C.w, border: `1px solid #e8def8`, borderRadius: 10, padding: '8px 12px', marginBottom: 12 }}>
                {m.text}
              </div>
            );
          }
          const isMe = m.from === 'buyer';
          const bubbleBg = {
            seller:  '#e8f0fe',
            shipper: '#fff3e0',
            buyer:   C.p,
          }[m.from];
          const textColor = isMe ? '#fff' : C.t;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', marginBottom: 10, alignItems: isMe ? 'flex-end' : 'flex-start' }}>
              {!isMe && <div style={{ fontSize: 10, color: C.m, marginBottom: 3 }}>{m.name}</div>}
              <div style={{ maxWidth: '78%', padding: '8px 12px', borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 13, lineHeight: 1.4, background: bubbleBg, color: textColor, border: isMe ? 'none' : `1px solid #e8def8` }}>
                {m.text}
              </div>
            </div>
          );
        })}

        {/* Card xác nhận giao hàng */}
        <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 10, margin: '8px 0', border: '1px solid #c8e6c9' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>✅ Xác nhận giao hàng thành công</div>
          <div style={{ fontSize: 11, color: '#388e3c', marginBottom: 8 }}>Người mua nhập mã OTP để xác nhận nhận hàng. Tiền sẽ chuyển cho người bán sau khi xác nhận.</div>
          <input placeholder="Nhập mã OTP 6 số..." style={{ width: '100%', border: `1.5px solid #c8e6c9`, borderRadius: 8, padding: '7px 12px', fontSize: 13, outline: 'none', marginBottom: 6 }} />
          <button style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
            Xác nhận nhận hàng
          </button>
        </div>

        {/* Chấm điểm shipper */}
        <div style={{ background: C.pl, borderRadius: 10, padding: 10, margin: '8px 0', border: `1px solid ${C.b}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.pd, marginBottom: 6 }}>⭐ Đánh giá Shipper (sau khi nhận hàng)</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} style={{ fontSize: 22, cursor: 'pointer' }}>⭐</span>
            ))}
          </div>
          <input placeholder="Nhận xét về shipper..." style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 8, padding: '7px 12px', fontSize: 12, outline: 'none', marginBottom: 6 }} />
          <button style={{ background: C.p, color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
            Gửi đánh giá
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: C.w, borderTop: `1px solid ${C.b}`, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
          style={{ flex: 1, border: `1.5px solid ${C.b}`, borderRadius: 20, padding: '8px 14px', fontSize: 13, outline: 'none' }}
          placeholder="Nhập tin nhắn cho cả 3 người..."
        />
        <button onClick={sendMsg} style={{ background: C.p, color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}>➤</button>
      </div>
    </div>
  );
}
