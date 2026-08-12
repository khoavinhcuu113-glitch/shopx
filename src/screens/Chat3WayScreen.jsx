import { useState } from 'react';
import { C } from '../constants';
import RatingScreen from './RatingScreen';

// 4 lý do từ chối nhận hàng — mỗi lý do gắn đúng 1 bên chịu trách nhiệm
const REFUSE_REASONS = [
  { id: 'r1', label: 'Tôi đổi ý, không muốn mua nữa', fault: 'buyer' },
  { id: 'r2', label: 'Không liên lạc được / không có mặt', fault: 'buyer' },
  { id: 'r3', label: 'Hàng không đúng mô tả / hư hỏng khi tới', fault: 'seller' },
  { id: 'r4', label: 'Giao sai địa chỉ / Shipper thái độ không tốt', fault: 'shipper' },
];
const FAULT_INFO = {
  buyer:   { label: 'Người mua', color: '#c62828', feeNote: 'Người mua vẫn phải trả phí công tối thiểu cho Shipper (đã tới nơi, mất công đi).' },
  seller:  { label: 'Người bán', color: '#e65100', feeNote: 'Shipper không có lỗi, được trả phí công đầy đủ. Người bán tự xử lý tiếp với người mua.' },
  shipper: { label: 'Shipper',   color: '#1565c0', feeNote: 'Shipper không được tính phí công do lỗi thuộc về Shipper.' },
};

// Lý do hoàn trả SAU KHI đã nhận hàng — trong 15 ngày, bắt buộc ảnh bằng chứng (theo đúng mô hình TikTok Shop)
const RETURN_REASONS = [
  { id: 'rt1', label: 'Hàng không đúng mô tả/hình ảnh đăng tin' },
  { id: 'rt2', label: 'Hàng bị lỗi/hư hỏng (không phải do vận chuyển)' },
  { id: 'rt3', label: 'Thiếu phụ kiện/không đúng số lượng đã đặt' },
  { id: 'rt4', label: 'Hàng giả, hàng nhái' },
];
const RETURN_WINDOW_DAYS = 15;   // hạn nộp yêu cầu hoàn trả sau khi nhận hàng
const SELLER_RESPONSE_HOURS = 72; // hạn người bán phản hồi trước khi tự động duyệt

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
function BuyerView({ otpDone, setOtpDone, msgs, setMsgs, setShowRating, orderStatus, startRefuse }) {
  const [otpInput, setOtpInput] = useState('');
  const [showOtp, setShowOtp]   = useState(false);
  const [choiceMade, setChoiceMade] = useState(false); // đã chọn "vẫn nhận" chưa
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

  if (otpDone || orderStatus === 'refused' || orderStatus === 'cancelled') return null;

  // Bước chọn đầu tiên khi Shipper vừa tới: Vẫn nhận / Từ chối
  if (!choiceMade) {
    return (
      <div style={{ background: '#fff3e0', borderRadius: 10, padding: 12, margin: '8px 0', border: '1.5px solid #ffb74d' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#e65100', marginBottom: 8 }}>
          🚪 Shipper đã tới nơi giao hàng. Bạn muốn làm gì?
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => setChoiceMade(true)}
            style={{ background: C.p, color: '#fff', border: 'none', padding: 10, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
            📝 Vẫn nhận hàng, khiếu nại sau (nếu có vấn đề)
          </button>
          <button onClick={startRefuse}
            style={{ background: '#fff', color: '#c62828', border: '1.5px solid #ef9a9a', padding: 10, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
            ❌ Từ chối nhận, trả hàng lại
          </button>
        </div>
      </div>
    );
  }

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
        <div style={{ fontSize: 11, color: '#e65100', marginBottom: 6 }}>⚠️ Có vấn đề nhưng vẫn muốn nhận hàng?</div>
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

// Khối chọn lý do từ chối — dùng chung cho cả người mua bấm và người bán/shipper xem lại
function RefuseReasonPicker({ onConfirm }) {
  const [reasonId, setReasonId] = useState('');
  return (
    <div style={{ background: '#ffebee', borderRadius: 10, padding: 12, margin: '8px 0', border: '1.5px solid #ef9a9a' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#c62828', marginBottom: 8 }}>❌ Chọn lý do từ chối nhận hàng</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
        {REFUSE_REASONS.map(r => (
          <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.t, cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: reasonId === r.id ? '#fff' : 'transparent', border: `1px solid ${reasonId === r.id ? '#ef9a9a' : '#f5c6c6'}` }}>
            <input type="radio" name="refuseReason" checked={reasonId === r.id} onChange={() => setReasonId(r.id)} style={{ accentColor: '#c62828' }} />
            {r.label}
          </label>
        ))}
      </div>
      <button onClick={() => { if (!reasonId) { alert('Vui lòng chọn lý do trước khi xác nhận.'); return; } onConfirm(REFUSE_REASONS.find(r => r.id === reasonId)); }}
        style={{ width: '100%', background: '#c62828', color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
        Xác nhận lý do
      </button>
    </div>
  );
}

// Yêu cầu hoàn trả SAU KHI đã nhận hàng — bắt buộc lý do + ảnh bằng chứng (khác Từ chối tại cửa)
function ReturnRequestPanel({ onSubmit, onCancel }) {
  const [reasonId, setReasonId] = useState('');
  const [note, setNote] = useState('');
  const [photoAdded, setPhotoAdded] = useState(false);
  return (
    <div style={{ background: '#fff3e0', borderRadius: 10, padding: 12, margin: '8px 0', border: '1.5px solid #ffb74d' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#e65100', marginBottom: 4 }}>↩️ Yêu cầu hoàn trả hàng</div>
      <div style={{ fontSize: 10, color: '#bf360c', marginBottom: 8 }}>Trong vòng {RETURN_WINDOW_DAYS} ngày kể từ khi nhận hàng. Cần lý do + ảnh bằng chứng cụ thể.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
        {RETURN_REASONS.map(r => (
          <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.t, cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: reasonId === r.id ? '#fff' : 'transparent', border: `1px solid ${reasonId === r.id ? '#ffb74d' : '#ffe0b2'}` }}>
            <input type="radio" name="returnReason" checked={reasonId === r.id} onChange={() => setReasonId(r.id)} style={{ accentColor: '#e65100' }} />
            {r.label}
          </label>
        ))}
      </div>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Mô tả cụ thể vấn đề (bắt buộc)..."
        style={{ width: '100%', border: '1.5px solid #ffb74d', borderRadius: 8, padding: '8px 10px', fontSize: 12, marginBottom: 8, resize: 'none', boxSizing: 'border-box' }} rows={2} />
      {!photoAdded ? (
        <div onClick={() => setPhotoAdded(true)} style={{ border: '2px dashed #e65100', borderRadius: 8, padding: 10, textAlign: 'center', cursor: 'pointer', marginBottom: 10, background: '#fff' }}>
          <div style={{ fontSize: 20 }}>📷</div>
          <div style={{ fontSize: 11, color: '#e65100' }}>Bấm để đính kèm ảnh bằng chứng (bắt buộc)</div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #ffb74d', borderRadius: 8, padding: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>🖼️</span>
          <span style={{ fontSize: 11, color: C.t, flex: 1 }}>Đã đính kèm 1 ảnh</span>
          <button onClick={() => setPhotoAdded(false)} style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: 12 }}>Xóa</button>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCancel} style={{ flex: 1, background: 'none', border: '1px solid #ffb74d', color: '#e65100', padding: 9, borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Hủy</button>
        <button onClick={() => {
            if (!reasonId) { alert('Vui lòng chọn lý do.'); return; }
            if (!note.trim()) { alert('Vui lòng mô tả cụ thể vấn đề.'); return; }
            if (!photoAdded) { alert('Bắt buộc đính kèm ảnh bằng chứng.'); return; }
            onSubmit({ reason: RETURN_REASONS.find(r => r.id === reasonId), note });
          }}
          style={{ flex: 2, background: '#e65100', color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          Gửi yêu cầu hoàn trả
        </button>
      </div>
    </div>
  );
}

// ── NGƯỜI BÁN ──
function SellerView({ shipperArrived, msgs, setMsgs, orderStatus, canCancel, onCancel }) {
  const [confirmed, setConfirmed] = useState(false);
  if (orderStatus === 'refused' || orderStatus === 'cancelled') return null;

  if (!shipperArrived) {
    return (
      <div style={{ background: C.pl, borderRadius: 10, padding: 10, margin: '8px 0', border: `1px solid ${C.b}` }}>
        <div style={{ fontSize: 11, color: C.pd, marginBottom: canCancel ? 10 : 0 }}>
          ⏳ Đang chờ Shipper đến lấy hàng tại điểm A...<br/>
          Khi Shipper đến, bạn sẽ thấy nút xác nhận tại đây.
        </div>
        {canCancel && (
          <button onClick={onCancel}
            style={{ width: '100%', background: '#fff', color: '#c62828', border: '1px solid #ef9a9a', padding: 8, borderRadius: 8, fontSize: 11, cursor: 'pointer' }}>
            ❌ Hủy đơn (chưa giao cho Shipper, hủy tự do)
          </button>
        )}
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
          <div style={{ fontSize: 11, color: C.m, marginTop: 4 }}>Hàng đang trên đường giao đến người mua — không thể hủy đơn ở bước này nữa.</div>
        </div>
      )}
    </div>
  );
}

// ── SHIPPER ──
function ShipperView({ setShipperArrived, shipperArrived, otpDone, setOtpDone, msgs, setMsgs, orderStatus, refuseReason, refusePhotoTaken, onTakeRefusePhoto }) {
  const [arrived, setArrived]   = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [showOtp, setShowOtp]   = useState(false);
  const OTP = '482916';

  function markArrived() {
    setArrived(true);
    setShipperArrived(true);
    setMsgs(m => [...m, { from: 'shipper', name: 'SP-001 (Trần Văn Cường)', text: '🚚 Tôi đã đến điểm A. Đang chờ người bán xác nhận giao hàng.' }]);
  }

  function confirmDelivery() {
    if (otpInput === OTP) {
      setOtpDone(true);
      setMsgs(m => [...m, { from: 'system', text: '✅ Shipper đã xác nhận giao hàng thành công bằng OTP!' }]);
    } else {
      alert('OTP không đúng! Yêu cầu người mua cung cấp lại.');
    }
  }

  // Người mua vừa từ chối — Shipper phải chụp ảnh bằng chứng
  if (orderStatus === 'refusing') {
    return (
      <div style={{ background: '#ffebee', borderRadius: 10, padding: 12, margin: '8px 0', border: '1.5px solid #ef9a9a' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#c62828', marginBottom: 6 }}>⚠️ Người mua từ chối nhận hàng</div>
        <div style={{ fontSize: 11, color: '#e53935', marginBottom: 10 }}>
          {refuseReason ? `Lý do: ${refuseReason.label}` : 'Đang chờ người mua chọn lý do...'}
        </div>
        {refuseReason && !refusePhotoTaken && (
          <button onClick={onTakeRefusePhoto}
            style={{ width: '100%', background: '#c62828', color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
            📷 Chụp ảnh bằng chứng từ chối (bắt buộc)
          </button>
        )}
      </div>
    );
  }
  if (orderStatus === 'refused') {
    const fault = FAULT_INFO[refuseReason.fault];
    return (
      <div style={{ background: '#ffebee', borderRadius: 10, padding: 12, margin: '8px 0', border: '1.5px solid #ef9a9a', textAlign: 'center' }}>
        <div style={{ fontSize: 24, marginBottom: 4 }}>📦↩️</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#c62828' }}>Đang mang hàng quay về người bán</div>
      </div>
    );
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
          <button onClick={() => setMsgs(m => [...m, { from: 'shipper', name: 'SP-001 (Trần Văn Cường)', text: '⚠️ Tôi đã có mặt tại điểm B, chờ 15 phút, không có người nhận. Đề nghị người mua phản hồi.' }])}
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
  const product = (() => {
    try { return JSON.parse(sessionStorage.getItem('sx_order_product') || 'null'); } catch (e) { return null; }
  })();
  const productTitle = product ? product.title : 'iPhone 13 Pro';

  const [msgs, setMsgs]               = useState([
    { from: 'system',  text: '🚀 Chat 3 bên đã được tạo. Cả 3 bên cùng trao đổi tại đây.' },
    { from: 'seller',  name: 'Anh Trần Minh Tuấn • SX-00127 (Người bán)',  text: `Chào Shipper! Hàng ${productTitle} đóng gói kỹ rồi. Địa chỉ: 123 Nguyễn Ái Quốc, Biên Hòa.` },
    { from: 'shipper', name: 'Trần Văn Cường • SP-001 (Shipper)',             text: 'Dạ mình sẽ qua lấy lúc 18h. Người mua vui lòng có mặt tại Hố Nai nhé!' },
    { from: 'buyer',   name: 'Nguyễn Văn Bình • SX-00234 (Người mua)',       text: 'Mình ở nhà cả buổi tối. SĐT: 0901234567.' },
  ]);
  const [input, setInput]             = useState('');
  const [role, setRole]               = useState('buyer');
  const [shipperArrived, setShipperArrived] = useState(false);
  const [otpDone, setOtpDone]         = useState(false);
  const [showRating, setShowRating]   = useState(false);
  const [ratingTarget, setRatingTarget] = useState('seller');
  const [ratedSeller, setRatedSeller] = useState(false);
  const [ratedShipper, setRatedShipper] = useState(false);

  // Trạng thái đơn: active | cancelled (hủy trước khi giao) | refusing (người mua vừa từ chối, chờ Shipper chụp ảnh) | refused (đã hoàn tất từ chối)
  const [orderStatus, setOrderStatus] = useState('active');
  const [refuseReason, setRefuseReason] = useState(null);
  const [refusePhotoTaken, setRefusePhotoTaken] = useState(false);
  const [showReasonPicker, setShowReasonPicker] = useState(false);

  // Luồng Hoàn trả SAU KHI đã nhận hàng — độc lập với luồng Từ chối tại cửa ở trên
  const [showReturnPanel, setShowReturnPanel] = useState(false);
  const [returnStatus, setReturnStatus] = useState(null); // null | 'pending' | 'approved' | 'auto_approved' | 'rejected'
  const [returnInfo, setReturnInfo] = useState(null);      // { reason, note }
  const [returnHours, setReturnHours] = useState(0);        // giờ giả lập chờ người bán phản hồi (demo)

  function sendMsg() {
    if (!input.trim()) return;
    const nameMap = { buyer: 'Nguyễn Văn Bình • SX-00234', seller: 'Anh Trần Minh Tuấn • SX-00127', shipper: 'Trần Văn Cường • SP-001' };
    setMsgs(m => [...m, { from: role, name: nameMap[role], text: input }]);
    setInput('');
  }

  // Giai đoạn 1 — Hủy tự do trước khi Shipper nhận hàng từ người bán
  function cancelOrder() {
    setOrderStatus('cancelled');
    setMsgs(m => [...m, { from: 'system', text: '❌ Đơn hàng đã được hủy trước khi Shipper nhận hàng. Không phát sinh chi phí.' }]);
  }

  // Giai đoạn 3 — Người mua bấm "Từ chối nhận"
  function startRefuse() {
    setOrderStatus('refusing');
    setShowReasonPicker(true);
    setMsgs(m => [...m, { from: 'system', text: '⚠️ Người mua từ chối nhận hàng tại điểm giao. Đang chờ chọn lý do.' }]);
  }
  function confirmRefuseReason(reason) {
    setRefuseReason(reason);
    setShowReasonPicker(false);
    setMsgs(m => [...m, { from: 'buyer', name: 'SX-00001 (Bạn)', text: `❌ Từ chối nhận hàng — Lý do: ${reason.label}` }]);
  }
  function takeRefusePhoto() {
    setRefusePhotoTaken(true);
    setOrderStatus('refused');
    setMsgs(m => [...m, { from: 'system', text: '📷 Shipper đã chụp ảnh bằng chứng. Đơn chuyển trạng thái: Từ chối nhận — Đang hoàn về người bán.' }]);
  }

  // Giai đoạn 4 — Hoàn trả sau khi đã nhận hàng
  function submitReturnRequest(info) {
    setReturnInfo(info);
    setReturnStatus('pending');
    setReturnHours(0);
    setShowReturnPanel(false);
    setMsgs(m => [...m, { from: 'buyer', name: 'SX-00001 (Bạn)', text: `↩️ Yêu cầu hoàn trả — Lý do: ${info.reason.label}. ${info.note}` }]);
  }
  function sellerRespondReturn(approve) {
    setReturnStatus(approve ? 'approved' : 'rejected');
    setMsgs(m => [...m, { from: 'system', text: approve ? '✅ Người bán đã đồng ý hoàn trả. Vui lòng gửi hàng về theo hướng dẫn.' : '❌ Người bán từ chối yêu cầu hoàn trả. Có thể liên hệ ShopX nếu không đồng ý.' }]);
  }
  function simulateReturnHours(h) {
    setReturnHours(h);
    if (h >= SELLER_RESPONSE_HOURS && returnStatus === 'pending') {
      setReturnStatus('auto_approved');
      setMsgs(m => [...m, { from: 'system', text: `⏰ Người bán không phản hồi trong ${SELLER_RESPONSE_HOURS} giờ. Hệ thống TỰ ĐỘNG DUYỆT yêu cầu hoàn trả để bảo vệ người mua.` }]);
    }
  }

  const bgMap = { seller: '#e8f0fe', shipper: '#fff3e0', buyer: C.p };
  const canCancel = orderStatus === 'active' && !shipperArrived;

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
          onDone={() => handleRatingDone(ratingTarget)}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'absolute', inset: 0 }}>
      {/* Header */}
      <div style={{ background: C.p, padding: '10px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <button onClick={() => go(sessionStorage.getItem('sx_3way_return') || 's-delivery')} style={{ color: '#fff', border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, padding: 4 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Chat 3 bên</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>{productTitle} • Người bán: SX-00127 × Người mua: SX-00234 × Shipper: SP-001</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {[{ tag: 'Người bán', val: 'Anh Tuấn SX-00127' }, { tag: 'Shipper', val: 'A.Cường SP-001' }, { tag: 'Người mua', val: 'A.Bình SX-00234' }].map((p, i) => (
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

      {/* Trạng thái đơn nổi bật nếu không phải active bình thường */}
      {orderStatus !== 'active' && (
        <div style={{
          background: orderStatus === 'cancelled' ? '#f5f5f5' : '#ffebee',
          borderBottom: `1px solid ${orderStatus === 'cancelled' ? '#ddd' : '#ef9a9a'}`,
          padding: '8px 16px', textAlign: 'center'
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: orderStatus === 'cancelled' ? '#616161' : '#c62828' }}>
            {orderStatus === 'cancelled' && '❌ Đơn đã hủy'}
            {orderStatus === 'refusing' && '⚠️ Đang xử lý từ chối nhận hàng...'}
            {orderStatus === 'refused' && '⚠️ Từ chối nhận — Đang hoàn về người bán'}
          </span>
        </div>
      )}

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
        {role === 'buyer'   && <BuyerView  otpDone={otpDone} setOtpDone={setOtpDone} msgs={msgs} setMsgs={setMsgs} setShowRating={setShowRating} orderStatus={orderStatus} startRefuse={startRefuse} />}
        {role === 'seller'  && <SellerView shipperArrived={shipperArrived} msgs={msgs} setMsgs={setMsgs} orderStatus={orderStatus} canCancel={canCancel} onCancel={cancelOrder} />}
        {role === 'shipper' && <ShipperView setShipperArrived={setShipperArrived} shipperArrived={shipperArrived} otpDone={otpDone} setOtpDone={setOtpDone} msgs={msgs} setMsgs={setMsgs} orderStatus={orderStatus} refuseReason={refuseReason} refusePhotoTaken={refusePhotoTaken} onTakeRefusePhoto={takeRefusePhoto} />}

        {/* Người mua chọn lý do từ chối — hiện cho mọi vai trò xem cùng lúc (đúng bản chất chat chung) */}
        {showReasonPicker && role === 'buyer' && <RefuseReasonPicker onConfirm={confirmRefuseReason} />}

        {/* Kết quả cuối cùng khi đã từ chối xong — hiện bảng phân loại lỗi */}
        {orderStatus === 'refused' && refuseReason && (
          <div style={{ background: '#fff', borderRadius: 10, padding: 12, margin: '8px 0', border: `1.5px solid ${FAULT_INFO[refuseReason.fault].color}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 6 }}>📋 Kết quả xử lý</div>
            <div style={{ fontSize: 11, color: C.m, marginBottom: 4 }}>Lý do: {refuseReason.label}</div>
            <div style={{ fontSize: 11, marginBottom: 6 }}>
              Bên chịu trách nhiệm: <span style={{ fontWeight: 700, color: FAULT_INFO[refuseReason.fault].color }}>{FAULT_INFO[refuseReason.fault].label}</span>
            </div>
            <div style={{ fontSize: 11, color: C.m, lineHeight: 1.5 }}>{FAULT_INFO[refuseReason.fault].feeNote}</div>
          </div>
        )}

        {/* Thông báo đơn hoàn tất */}
        {otpDone && !returnStatus && (
          <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 12, margin: '8px 0', border: '1px solid #c8e6c9', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>Giao hàng thành công!</div>
            {role === 'buyer' && !showReturnPanel && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                <button onClick={() => setShowRating(true)}
                  style={{ background: C.p, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                  ⭐ Hài lòng, đánh giá ngay → nhận 5 SX Points
                </button>
                <button onClick={() => setShowReturnPanel(true)}
                  style={{ background: 'none', color: '#e65100', border: '1px solid #ffb74d', padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                  ↩️ Có vấn đề, muốn hoàn trả hàng
                </button>
              </div>
            )}
          </div>
        )}

        {/* Panel gửi yêu cầu hoàn trả */}
        {role === 'buyer' && showReturnPanel && !returnStatus && (
          <ReturnRequestPanel onSubmit={submitReturnRequest} onCancel={() => setShowReturnPanel(false)} />
        )}

        {/* Đang chờ người bán phản hồi — NGƯỜI MUA xem */}
        {role === 'buyer' && returnStatus === 'pending' && (
          <div style={{ background: '#fff3e0', borderRadius: 10, padding: 12, margin: '8px 0', border: '1.5px solid #ffb74d' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e65100', marginBottom: 4 }}>⏳ Đang chờ người bán phản hồi</div>
            <div style={{ fontSize: 11, color: '#bf360c', marginBottom: 8 }}>
              Đã gửi yêu cầu: {returnInfo.reason.label}. Người bán có {SELLER_RESPONSE_HOURS}h để phản hồi — quá hạn hệ thống tự động duyệt.
            </div>
            <div style={{ fontSize: 10, color: C.m, marginBottom: 4 }}>🧪 Demo — giả lập thời gian chờ:</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 24, 48, 72].map(h => (
                <button key={h} onClick={() => simulateReturnHours(h)}
                  style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: `1px solid ${returnHours === h ? '#e65100' : '#ccc'}`, background: returnHours === h ? '#ffe0b2' : '#fff', color: returnHours === h ? '#e65100' : C.m, cursor: 'pointer' }}>
                  +{h}h
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Đang chờ phản hồi — NGƯỜI BÁN xem, có nút duyệt/từ chối */}
        {role === 'seller' && returnStatus === 'pending' && (
          <div style={{ background: '#fff3e0', borderRadius: 10, padding: 12, margin: '8px 0', border: '1.5px solid #ffb74d' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e65100', marginBottom: 4 }}>↩️ Người mua yêu cầu hoàn trả</div>
            <div style={{ fontSize: 11, color: '#bf360c', marginBottom: 10 }}>
              Lý do: {returnInfo.reason.label}<br/>Mô tả: {returnInfo.note}<br/>📷 Đã có ảnh bằng chứng đính kèm
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => sellerRespondReturn(true)}
                style={{ flex: 1, background: '#2e7d32', color: '#fff', border: 'none', padding: 9, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                ✅ Đồng ý hoàn trả
              </button>
              <button onClick={() => sellerRespondReturn(false)}
                style={{ flex: 1, background: '#fff', color: '#c62828', border: '1px solid #ef9a9a', padding: 9, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                ❌ Từ chối
              </button>
            </div>
            <div style={{ fontSize: 10, color: '#e65100', marginTop: 8, textAlign: 'center' }}>⚠️ Không phản hồi trong {SELLER_RESPONSE_HOURS}h sẽ tự động được duyệt</div>
          </div>
        )}

        {/* Kết quả cuối cùng — hiện cho cả 2 vai trò */}
        {(returnStatus === 'approved' || returnStatus === 'auto_approved') && (
          <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 12, margin: '8px 0', border: '1.5px solid #a5d6a7' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>
              ✅ Hoàn trả đã được duyệt {returnStatus === 'auto_approved' ? '(tự động do quá hạn phản hồi)' : ''}
            </div>
            <div style={{ fontSize: 11, color: '#388e3c' }}>
              Vui lòng gửi hàng về cho người bán. ShopX ghi nhận kết quả này — việc hoàn tiền thực hiện trực tiếp giữa 2 bên (chưa qua giữ tiền ShopX).
            </div>
          </div>
        )}
        {returnStatus === 'rejected' && (
          <div style={{ background: '#ffebee', borderRadius: 10, padding: 12, margin: '8px 0', border: '1.5px solid #ef9a9a' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#c62828', marginBottom: 4 }}>❌ Người bán từ chối yêu cầu hoàn trả</div>
            <div style={{ fontSize: 11, color: '#e53935' }}>Không đồng ý với kết quả? Có thể liên hệ ShopX hỗ trợ xem xét thêm (dựa trên bằng chứng đã nộp).</div>
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
