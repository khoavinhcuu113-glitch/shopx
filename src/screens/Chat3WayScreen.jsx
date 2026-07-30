import { useState } from 'react';
import { C } from '../constants';
import RatingScreen from './RatingScreen';

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => onChange(s)}
          style={{ fontSize: 28, cursor: 'pointer', color: s <= value ? '#f59e0b' : '#ddd' }}>★</span>
      ))}
    </div>
  );
}

// ── NGƯỜI MUA ──
function BuyerView({ otpDone, setOtpDone, msgs, setMsgs, setShowRating }) {
  const [otpInput, setOtpInput] = useState('');
  const [showOtp, setShowOtp]   = useState(false);
  const OTP = '482916';

  function confirmOtp() {
    if (otpInput === OTP) {
      setOtpDone(true);
      setMsgs(m => [...m, { from: 'system', text: '✅ Người mua đã xác nhận nhận hàng! Đơn hoàn tất.' }]);
      setTimeout(() => setShowRating(true), 800);
    } else {
      alert('OTP không đúng! Vui lòng kiểm tra lại.');
    }
  }

  if (otpDone) return null;

  return (
    <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 12, margin: '8px 0', border: '1px solid #c8e6c9' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>
        🔐 Mã OTP xác nhận nhận hàng (chỉ bạn thấy)
      </div>
      <div style={{ fontSize: 11, color: '#388e3c', marginBottom: 10 }}>
        Kiểm tra hàng OK → đưa mã này cho Shipper nhập hoặc cho quét QR.
      </div>
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <div style={{ display: 'inline-block', padding: 8, background: '#fff', border: '2px solid #000', borderRadius: 4, marginBottom: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,8px)', gap: 1 }}>
            {[1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,0,1,1,1,0,1,1,0,1,0,1,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1].map((v,i) => (
              <div key={i} style={{ width: 8, height: 8, background: v ? '#000' : '#fff' }} />
            ))}
          </div>
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 8, color: C.p }}>{OTP}</div>
        <div style={{ fontSize: 10, color: '#e53935', marginTop: 4 }}>⚠️ Chỉ đưa mã khi hàng OK</div>
      </div>
      {!showOtp ? (
        <button onClick={() => setShowOtp(true)}
          style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
          📱 Xác nhận đã nhận hàng (nhập OTP)
        </button>
      ) : (
        <div>
          <input value={otpInput} onChange={e => setOtpInput(e.target.value)}
            placeholder="Nhập 6 số OTP..." maxLength={6}
            style={{ width: '100%', border: `1.5px solid ${C.p}`, borderRadius: 8, padding: '9px 12px', fontSize: 18, textAlign: 'center', letterSpacing: 6, outline: 'none', marginBottom: 8 }} />
          <button onClick={confirmOtp}
            style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
            ✅ Xác nhận OTP
          </button>
        </div>
      )}
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #c8e6c9' }}>
        <div style={{ fontSize: 11, color: '#e65100', marginBottom: 6 }}>⚠️ Có vấn đề?</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => setMsgs(m => [...m, { from: 'buyer', name: 'SX-00001 (Bạn)', text: '⚠️ Hàng không đúng mô tả. Đề nghị mở khiếu nại.' }])}
            style={{ background: '#fff3e0', color: '#e65100', border: '1px solid #ffe082', padding: '5px 10px', borderRadius: 8, fontSize: 10, cursor: 'pointer' }}>
            Hàng không đúng mô tả
          </button>
          <button onClick={() => setMsgs(m => [...m, { from: 'buyer', name: 'SX-00001 (Bạn)', text: '⚠️ Hàng bị hư/vỡ khi nhận.' }])}
            style={{ background: '#fff3e0', color: '#e65100', border: '1px solid #ffe082', padding: '5px 10px', borderRadius: 8, fontSize: 10, cursor: 'pointer' }}>
            Hàng bị hư/vỡ
          </button>
        </div>
      </div>
    </div>
  );
}

// ── NGƯỜI BÁN ──
function SellerView({ shipperArrived, msgs, setMsgs }) {
  const [confirmed, setConfirmed] = useState(false);
  if (!shipperArrived) {
    return (
      <div style={{ background: C.pl, borderRadius: 10, padding: 10, margin: '8px 0', border: `1px solid ${C.b}` }}>
        <div style={{ fontSize: 11, color: C.pd }}>
          ⏳ Đang chờ Shipper đến lấy hàng tại điểm A...<br/>
          Khi Shipper đến, bạn sẽ thấy nút xác nhận tại đây.
        </div>
      </div>
    );
  }
  return (
    <div style={{ background: '#fff3e0', borderRadius: 10, padding: 12, margin: '8px 0', border: '1px solid #ffe082' }}>
      {!confirmed ? (
        <>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#e65100', marginBottom: 6 }}>📦 Shipper đã đến lấy hàng tại điểm A</div>
          <div style={{ fontSize: 11, color: '#bf360c', marginBottom: 10 }}>Chụp ảnh kiện hàng và xác nhận giao cho Shipper. Từ lúc này hàng thuộc trách nhiệm Shipper.</div>
          <button onClick={() => { setConfirmed(true); setMsgs(m => [...m, { from: 'system', text: '📦 Người bán đã xác nhận giao hàng cho Shipper. Hàng đang trên đường.' }]); }}
            style={{ width: '100%', background: '#e65100', color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
            📷 Chụp ảnh & Xác nhận giao cho Shipper
          </button>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#2e7d32' }}>✅ Đã xác nhận giao cho Shipper</div>
          <div style={{ fontSize: 11, color: C.m, marginTop: 4 }}>Hàng đang trên đường giao đến người mua</div>
        </div>
      )}
    </div>
  );
}

// ── SHIPPER ──
function ShipperView({ setShipperArrived, shipperArrived, otpDone, msgs, setMsgs }) {
  const [arrived, setArrived]   = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [showOtp, setShowOtp]   = useState(false);
  const OTP = '482916';

  function markArrived() {
    setArrived(true);
    setShipperArrived(true);
    setMsgs(m => [...m, { from: 'shipper', name: 'SP-001 (Chị Thu Hương)', text: '🚚 Tôi đã đến điểm A. Đang chờ người bán xác nhận giao hàng.' }]);
  }

  function confirmDelivery() {
    if (otpInput === OTP) {
      setMsgs(m => [...m, { from: 'system', text: '✅ Shipper đã xác nhận giao hàng thành công bằng OTP!' }]);
    } else {
      alert('OTP không đúng! Yêu cầu người mua cung cấp lại.');
    }
  }

  return (
    <div style={{ background: '#e8f0fe', borderRadius: 10, padding: 12, margin: '8px 0', border: '1px solid #c5d8ff' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#1a237e', marginBottom: 8 }}>🚚 Bảng điều khiển Shipper</div>
      <div style={{ background: '#fff', borderRadius: 8, padding: 8, marginBottom: 10, fontSize: 11, color: C.t }}>
        <div style={{ marginBottom: 2 }}>📍 Lấy: 123 Nguyễn Ái Quốc, Biên Hòa</div>
        <div style={{ marginBottom: 2 }}>📍 Giao: 45 Bùi Thị Xuân, Hố Nai</div>
        <div style={{ color: C.p, fontWeight: 600 }}>💰 Phí ship: Thỏa thuận với người mua</div>
      </div>
      {!arrived ? (
        <button onClick={markArrived}
          style={{ width: '100%', background: '#1a237e', color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
          📍 Tôi đã đến điểm A lấy hàng
        </button>
      ) : !otpDone ? (
        <div>
          <div style={{ fontSize: 11, color: '#1a237e', marginBottom: 8, background: '#e8f0fe', padding: 8, borderRadius: 8 }}>
            ✅ Đã đến điểm A. Chờ người bán xác nhận.<br/>Sau đó giao đến: 45 Bùi Thị Xuân, Hố Nai
          </div>
          {!showOtp ? (
            <button onClick={() => setShowOtp(true)}
              style={{ width: '100%', background: '#1a237e', color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
              📱 Nhập OTP / Quét QR khi giao tại B
            </button>
          ) : (
            <div>
              <div style={{ fontSize: 11, color: C.m, marginBottom: 6 }}>Yêu cầu người mua đưa OTP hoặc cho quét QR:</div>
              <input value={otpInput} onChange={e => setOtpInput(e.target.value)}
                placeholder="Nhập OTP từ người mua..." maxLength={6}
                style={{ width: '100%', border: '1.5px solid #1a237e', borderRadius: 8, padding: '9px 12px', fontSize: 18, textAlign: 'center', letterSpacing: 6, outline: 'none', marginBottom: 8 }} />
              <button onClick={confirmDelivery}
                style={{ width: '100%', background: '#1a237e', color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                ✅ Xác nhận giao hàng
              </button>
            </div>
          )}
          <button onClick={() => setMsgs(m => [...m, { from: 'shipper', name: 'SP-001 (Chị Thu Hương)', text: '⚠️ Tôi đã có mặt tại điểm B, chờ 15 phút, không có người nhận. Đề nghị người mua phản hồi.' }])}
            style={{ width: '100%', background: 'none', border: '1px solid #c5d8ff', color: '#1a237e', padding: 8, borderRadius: 8, fontSize: 11, cursor: 'pointer', marginTop: 6 }}>
            ⚠️ Không có người nhận tại điểm B
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#2e7d32', fontWeight: 600, fontSize: 13 }}>✅ Giao hàng thành công!</div>
      )}
    </div>
  );
}

// ── MAIN ──
export default function Chat3WayScreen({ go }) {
  const [msgs, setMsgs]               = useState([
    { from: 'system',  text: '🚀 Chat 3 bên đã được tạo. Cả 3 bên cùng trao đổi tại đây.' },
    { from: 'seller',  name: 'SX-00127 (Người bán)',      text: 'Chào Shipper! Hàng iPhone 13 Pro đóng gói kỹ rồi. Địa chỉ: 123 Nguyễn Ái Quốc, Biên Hòa.' },
    { from: 'shipper', name: 'SP-001 (Chị Thu Hương)',     text: 'Dạ mình sẽ qua lấy lúc 18h. Người mua vui lòng có mặt tại Hố Nai nhé!' },
    { from: 'buyer',   name: 'SX-00001 (Người mua)',       text: 'Mình ở nhà cả buổi tối. SĐT: 0901234567.' },
  ]);
  const [input, setInput]             = useState('');
  const [role, setRole]               = useState('buyer');
  const [shipperArrived, setShipperArrived] = useState(false);
  const [otpDone, setOtpDone]         = useState(false);
  const [showRating, setShowRating]   = useState(false);
  const [ratingTarget, setRatingTarget] = useState('seller');
  const [ratedSeller, setRatedSeller] = useState(false);
  const [ratedShipper, setRatedShipper] = useState(false);

  function sendMsg() {
    if (!input.trim()) return;
    const nameMap = { buyer: 'SX-00001 (Người mua)', seller: 'SX-00127 (Người bán)', shipper: 'SP-001 (Chị Thu Hương)' };
    setMsgs(m => [...m, { from: role, name: nameMap[role], text: input }]);
    setInput('');
  }

  const bgMap = { seller: '#e8f0fe', shipper: '#fff3e0', buyer: C.p };

  // Sau khi OTP xong → đánh giá seller trước rồi shipper
  function handleRatingDone(target) {
    if (target === 'seller') {
      setRatedSeller(true);
      if (!ratedShipper) {
        setRatingTarget('shipper');
      } else {
        setShowRating(false);
        go('s-home');
      }
    } else {
      setRatedShipper(true);
      setShowRating(false);
      go('s-home');
    }
  }

  // Màn đánh giá
  if (showRating && otpDone) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: C.w, overflow: 'auto' }}>
        <div style={{ background: C.p, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
            Đánh giá {ratingTarget === 'seller' ? 'Người bán' : 'Shipper'}
          </div>
        </div>

        {/* Đánh giá 2 bước: Seller → Shipper */}
        <div style={{ background: C.pl, padding: '8px 16px', display: 'flex', gap: 8 }}>
          {[
            { key: 'seller',  label: '1. Người bán', done: ratedSeller  },
            { key: 'shipper', label: '2. Shipper',    done: ratedShipper },
          ].map((s, i) => (
            <div key={s.key} style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 8, background: ratingTarget === s.key ? C.p : s.done ? '#e8f5e9' : C.w, color: ratingTarget === s.key ? '#fff' : s.done ? '#2e7d32' : C.m, fontSize: 12, fontWeight: ratingTarget === s.key ? 600 : 400 }}>
              {s.done ? '✅ ' : ''}{s.label}
            </div>
          ))}
        </div>

        <RatingScreen
          go={go}
          target={ratingTarget}
          onSkip={() => handleRatingDone(ratingTarget)}
        />

        {/* Override nút về trang chủ để xử lý multi-step */}
        <div style={{ padding: '0 16px 16px' }}>
          <button onClick={() => handleRatingDone(ratingTarget)}
            style={{ width: '100%', background: 'none', border: 'none', color: C.m, fontSize: 12, cursor: 'pointer' }}>
            Bỏ qua — đánh giá sau
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'absolute', inset: 0 }}>
      {/* Header */}
      <div style={{ background: C.p, padding: '10px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button onClick={() => go('s-delivery')} style={{ color: '#fff', border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, padding: 4 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Chat 3 bên</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>iPhone 13 Pro • SX-00127 × SX-00001 × SP-001</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {[{ tag: 'Người bán', val: 'SX-00127' }, { tag: 'Shipper', val: 'SP-001' }, { tag: 'Người mua', val: 'SX-00001' }].map((p, i) => (
            <div key={i} style={{ textAlign: i === 1 ? 'center' : i === 2 ? 'right' : 'left' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{p.tag}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{p.val}</div>
            </div>
          ))}
        </div>
        {/* Chọn vai trò demo */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 8px' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>👁️ Xem theo vai trò (demo):</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ val: 'buyer', label: 'Người mua' }, { val: 'seller', label: 'Người bán' }, { val: 'shipper', label: 'Shipper' }].map(r => (
              <button key={r.val} onClick={() => setRole(r.val)}
                style={{ flex: 1, padding: '4px 6px', borderRadius: 6, border: 'none', fontSize: 10, cursor: 'pointer', fontWeight: role === r.val ? 700 : 400, background: role === r.val ? '#fff' : 'rgba(255,255,255,0.2)', color: role === r.val ? C.p : '#fff' }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: C.g }}>
        {msgs.map((m, i) => {
          if (m.from === 'system') {
            return (
              <div key={i} style={{ textAlign: 'center', fontSize: 11, color: C.m, background: C.w, border: '1px solid #e8def8', borderRadius: 10, padding: '8px 12px', marginBottom: 10 }}>
                {m.text}
              </div>
            );
          }
          const isMe = m.from === role;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', marginBottom: 10, alignItems: isMe ? 'flex-end' : 'flex-start' }}>
              {!isMe && <div style={{ fontSize: 10, color: C.m, marginBottom: 3 }}>{m.name}</div>}
              <div style={{ maxWidth: '78%', padding: '8px 12px', borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 13, lineHeight: 1.4, background: isMe ? C.p : (bgMap[m.from] || C.w), color: isMe ? '#fff' : C.t, border: isMe ? 'none' : '1px solid #e8def8' }}>
                {m.text}
              </div>
            </div>
          );
        })}

        {/* Bảng theo vai trò */}
        {role === 'buyer'   && <BuyerView  otpDone={otpDone} setOtpDone={setOtpDone} msgs={msgs} setMsgs={setMsgs} setShowRating={setShowRating} />}
        {role === 'seller'  && <SellerView shipperArrived={shipperArrived} msgs={msgs} setMsgs={setMsgs} />}
        {role === 'shipper' && <ShipperView setShipperArrived={setShipperArrived} shipperArrived={shipperArrived} otpDone={otpDone} msgs={msgs} setMsgs={setMsgs} />}

        {/* Thông báo đơn hoàn tất */}
        {otpDone && (
          <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 12, margin: '8px 0', border: '1px solid #c8e6c9', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>Giao hàng thành công!</div>
            {role === 'buyer' && (
              <button onClick={() => setShowRating(true)}
                style={{ background: C.p, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600, marginTop: 6 }}>
                ⭐ Đánh giá → nhận 10 SX Points
              </button>
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
    </div>
  );
}
