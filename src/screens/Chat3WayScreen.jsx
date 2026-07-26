import { useState } from 'react';
import { C } from '../constants';

const INIT_MSGS = [
  { from: 'system', text: '🚀 Chat 3 bên đã được tạo. Người bán, Người mua và Shipper có thể trao đổi tại đây.' },
  { from: 'seller', name: 'SX-00127 (Người bán)', text: 'Chào Shipper! Hàng là iPhone 13 Pro, đóng gói kỹ rồi. Địa chỉ lấy: 123 Nguyễn Ái Quốc, Biên Hòa.' },
  { from: 'shipper', name: 'SP-001 (Chị Thu Hương)', text: 'Dạ, mình sẽ qua lấy lúc 18h hôm nay. Người mua vui lòng có mặt để nhận hàng nhé!' },
  { from: 'buyer', name: 'SX-00001 (Người mua)', text: 'Mình ở nhà cả buổi tối. Địa chỉ nhận: 45 Bùi Thị Xuân, Hố Nai. SĐT: 0901234567.' },
];

// Component đánh giá sao
function StarRating({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          onClick={() => onChange(s)}
          style={{ fontSize: 28, cursor: 'pointer', color: s <= value ? '#f59e0b' : '#ddd', transition: 'color 0.2s' }}
        >★</span>
      ))}
    </div>
  );
}

export default function Chat3WayScreen({ go }) {
  const [msgs, setMsgs]           = useState(INIT_MSGS);
  const [input, setInput]         = useState('');
  const [stars, setStars]         = useState(0);
  const [review, setReview]       = useState('');
  const [reviewed, setReviewed]   = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [sellerConfirmed, setSellerConfirmed] = useState(false);
  const [showOtp, setShowOtp]     = useState(false);
  const [otpInput, setOtpInput]   = useState('');
  const [otpDone, setOtpDone]     = useState(false);
  const OTP_CODE = '482916';

  function sendMsg() {
    if (!input.trim()) return;
    setMsgs(m => [...m, { from: 'buyer', name: 'SX-00001 (Bạn)', text: input }]);
    setInput('');
  }

  function submitReview() {
    if (stars === 0) { alert('Vui lòng chọn số sao đánh giá'); return; }
    setReviewed(true);
  }

  function confirmOtp() {
    if (otpInput === OTP_CODE) {
      setOtpDone(true);
      setMsgs(m => [...m, { from: 'system', text: '✅ OTP xác nhận thành công! Đơn hàng hoàn tất. Cảm ơn bạn đã sử dụng ShopX!' }]);
    } else {
      alert('OTP không đúng! Vui lòng kiểm tra lại.');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'absolute', inset: 0 }}>

      {/* Header */}
      <div style={{ background: C.p, padding: '10px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button onClick={() => go('s-delivery')} style={{ color: '#fff', border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, padding: 4 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Chat 3 bên</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>iPhone 13 Pro 256GB • SX-00127 × SX-00001 × SP-001</div>
          </div>
        </div>
        {/* 3 người */}
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 10px', display: 'flex', justifyContent: 'space-between' }}>
          {[
            { tag: 'Người bán', val: 'SX-00127' },
            { tag: 'Shipper',   val: 'SP-001' },
            { tag: 'Người mua', val: 'SX-00001' },
          ].map((p, i) => (
            <div key={i} style={{ textAlign: i === 1 ? 'center' : i === 2 ? 'right' : 'left' }}>
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
          const bgMap = { seller: '#e8f0fe', shipper: '#fff3e0', buyer: C.p };
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', marginBottom: 10, alignItems: isMe ? 'flex-end' : 'flex-start' }}>
              {!isMe && <div style={{ fontSize: 10, color: C.m, marginBottom: 3 }}>{m.name}</div>}
              <div style={{ maxWidth: '78%', padding: '8px 12px', borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 13, lineHeight: 1.4, background: bgMap[m.from], color: isMe ? '#fff' : C.t, border: isMe ? 'none' : `1px solid #e8def8` }}>
                {m.text}
              </div>
            </div>
          );
        })}

        {/* Người bán xác nhận giao cho shipper */}
        {!sellerConfirmed && (
          <div style={{ background: '#fff3e0', borderRadius: 10, padding: 10, margin: '8px 0', border: '1px solid #ffe082' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#e65100', marginBottom: 4 }}>📦 Người bán xác nhận giao hàng cho Shipper</div>
            <div style={{ fontSize: 11, color: '#bf360c', marginBottom: 8 }}>Shipper đã đến lấy hàng tại điểm A. Người bán xác nhận và chụp ảnh kiện hàng.</div>
            <button onClick={() => { setSellerConfirmed(true); setMsgs(m => [...m, { from: 'system', text: '📦 Người bán đã xác nhận giao hàng cho Shipper. Hàng đang trên đường giao đến bạn.' }]); }}
              style={{ background: '#e65100', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
              ✅ Xác nhận đã giao cho Shipper
            </button>
          </div>
        )}

        {/* OTP + QR người mua */}
        {sellerConfirmed && !otpDone && (
          <div style={{ background: C.pl, borderRadius: 10, padding: 12, margin: '8px 0', border: `1.5px solid ${C.p}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 8 }}>🔐 Mã OTP xác nhận nhận hàng của bạn</div>

            {/* QR Code giả lập */}
            <div style={{ background: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, textAlign: 'center', border: `1px solid ${C.b}` }}>
              <div style={{ fontSize: 10, color: C.m, marginBottom: 6 }}>Quét QR hoặc đọc mã cho Shipper</div>
              {/* QR giả lập bằng grid */}
              <div style={{ display: 'inline-block', padding: 8, background: '#fff', border: '2px solid #000', borderRadius: 4, marginBottom: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,10px)', gap: 1 }}>
                  {[1,1,1,1,1,1,1, 1,0,0,0,0,0,1, 1,0,1,1,1,0,1, 1,0,1,0,1,0,1, 1,0,1,1,1,0,1, 1,0,0,0,0,0,1, 1,1,1,1,1,1,1].map((v,i) => (
                    <div key={i} style={{ width: 10, height: 10, background: v ? '#000' : '#fff' }} />
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 6, color: C.p, marginBottom: 4 }}>{OTP_CODE}</div>
              <div style={{ fontSize: 10, color: '#e53935' }}>⚠️ Chỉ đưa mã này khi đã kiểm tra hàng OK</div>
            </div>

            {/* Nhập OTP */}
            {!showOtp ? (
              <button onClick={() => setShowOtp(true)} style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: '9px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                📱 Nhập OTP để xác nhận nhận hàng
              </button>
            ) : (
              <div>
                <input
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value)}
                  placeholder="Nhập 6 số OTP..."
                  maxLength={6}
                  style={{ width: '100%', border: `1.5px solid ${C.p}`, borderRadius: 8, padding: '9px 12px', fontSize: 16, textAlign: 'center', letterSpacing: 4, outline: 'none', marginBottom: 8 }}
                />
                <button onClick={confirmOtp} style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: '9px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                  ✅ Xác nhận OTP
                </button>
              </div>
            )}
          </div>
        )}

        {/* Đơn hoàn tất */}
        {otpDone && (
          <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 12, margin: '8px 0', border: '1px solid #c8e6c9', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>Giao hàng thành công!</div>
            <div style={{ fontSize: 11, color: '#388e3c' }}>Cảm ơn bạn đã sử dụng ShopX Community Ship</div>
          </div>
        )}

        {/* Đánh giá Shipper */}
        {otpDone && (
          <div style={{ background: C.w, borderRadius: 12, padding: 14, margin: '8px 0', border: `1px solid #e8def8` }}>
            {!reviewed ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 4 }}>⭐ Đánh giá Shipper</div>
                <div style={{ fontSize: 11, color: C.m, marginBottom: 10 }}>Chị Thu Hương • SP-001 • Đơn hàng vừa hoàn tất</div>
                <StarRating value={stars} onChange={setStars} />
                {stars > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <textarea
                      value={review}
                      onChange={e => setReview(e.target.value)}
                      placeholder="Nhận xét về Shipper (không bắt buộc)..."
                      rows={3}
                      style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 8, padding: '9px 12px', fontSize: 12, outline: 'none', resize: 'none', marginBottom: 8 }}
                    />
                    <button onClick={submitReview} style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: '9px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                      📤 Gửi đánh giá
                    </button>
                  </div>
                )}
                <button onClick={() => setReviewed(true)} style={{ width: '100%', background: 'none', border: 'none', color: C.m, fontSize: 11, cursor: 'pointer', marginTop: 6, padding: 4 }}>
                  Bỏ qua — không đánh giá
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 8 }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#2e7d32', marginBottom: 2 }}>Đã đánh giá thành công!</div>
                <div style={{ fontSize: 11, color: C.m }}>Cảm ơn bạn đã đóng góp cho cộng đồng ShopX</div>
                {stars > 0 && <div style={{ fontSize: 20, marginTop: 6 }}>{'★'.repeat(stars)}{'☆'.repeat(5-stars)}</div>}
              </div>
            )}
          </div>
        )}

        {/* Báo cáo vấn đề */}
        {sellerConfirmed && !otpDone && (
          <div style={{ background: '#fff3e0', borderRadius: 10, padding: 10, margin: '8px 0', border: '1px solid #ffe082' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#e65100', marginBottom: 6 }}>⚠️ Có vấn đề với đơn hàng?</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => setMsgs(m => [...m, { from: 'buyer', name: 'SX-00001 (Bạn)', text: '⚠️ Tôi từ chối nhận hàng vì hàng không đúng mô tả. Đề nghị mở khiếu nại.' }])}
                style={{ background: '#e65100', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer' }}>
                Hàng không đúng mô tả
              </button>
              <button onClick={() => setMsgs(m => [...m, { from: 'buyer', name: 'SX-00001 (Bạn)', text: '⚠️ Hàng bị hư/vỡ khi nhận. Đề nghị mở khiếu nại.' }])}
                style={{ background: '#e65100', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer' }}>
                Hàng bị hư/vỡ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer chat */}
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
