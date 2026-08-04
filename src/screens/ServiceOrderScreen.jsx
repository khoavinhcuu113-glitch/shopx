import { useState, useEffect } from 'react';
import { C } from '../constants';
import { Shdr, Btn, Btn2 } from '../components/UI';
import RatingScreen from './RatingScreen';

// Trạng thái đơn dịch vụ
const STATUS = {
  waiting:    { key: 'waiting',    label: '⏳ Chờ thợ đến',      color: '#f59e0b', bg: '#fff8e1' },
  working:    { key: 'working',    label: '🔨 Đang làm việc',     color: '#1976d2', bg: '#e3f2fd' },
  done_worker:{ key: 'done_worker',label: '✅ Thợ báo hoàn thành', color: '#388e3c', bg: '#e8f5e9' },
  completed:  { key: 'completed',  label: '🎉 Hoàn tất',          color: '#2e7d32', bg: '#e8f5e9' },
  disputed:   { key: 'disputed',   label: '⚠️ Đang khiếu nại',    color: '#e53935', bg: '#ffebee' },
};

// Component cảnh báo nhắc nhở
export function ServiceOrderAlert({ hoursElapsed, status }) {
  if (status === 'completed' || status === 'disputed') return null;

  if (status === 'waiting' && hoursElapsed >= 72) {
    return (
      <div style={{ background: '#ffebee', border: '1.5px solid #ef9a9a', borderRadius: 10, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 16 }}>🔴</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#c62828' }}>Đơn quá hạn — Cần xử lý ngay</div>
          <div style={{ fontSize: 11, color: '#e53935' }}>Thợ chưa bắt đầu sau 72h. Admin đã được thông báo.</div>
        </div>
      </div>
    );
  }
  if (status === 'waiting' && hoursElapsed >= 24) {
    return (
      <div style={{ background: '#fff3e0', border: '1px solid #ffe082', borderRadius: 10, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#e65100' }}>Nhắc nhở: Chưa bắt đầu sau 24h</div>
          <div style={{ fontSize: 11, color: '#bf360c' }}>Bấm "Bắt đầu làm việc" nếu bạn đã đến nơi.</div>
        </div>
      </div>
    );
  }
  if (status === 'working' && hoursElapsed >= 48) {
    return (
      <div style={{ background: '#fff3e0', border: '1px solid #ffe082', borderRadius: 10, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#e65100' }}>Nhắc nhở: Chưa cập nhật sau 48h</div>
          <div style={{ fontSize: 11, color: '#bf360c' }}>Bấm "Đã hoàn thành" nếu công việc đã xong.</div>
        </div>
      </div>
    );
  }
  return null;
}

// Màn hình chính theo dõi đơn
export default function ServiceOrderScreen({ go, role = 'worker' }) {
  const [status, setStatus]         = useState('waiting');
  const [hoursElapsed, setHours]    = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [ratingTarget, setRatingTarget] = useState('worker');
  const [rated, setRated]           = useState({ worker: false, hirer: false });
  const [msgs, setMsgs]             = useState([
    { from: 'system', text: '✅ Hai bên đã xác nhận. Đơn dịch vụ bắt đầu.' },
    { from: 'hirer',  name: 'SX-00001 (Người thuê)', text: 'Anh ơi, địa chỉ: 45 Bùi Thị Xuân, Hố Nai. Em đang ở nhà.' },
    { from: 'worker', name: 'SX-00199 (Thợ điện)', text: 'Dạ, mình sẽ đến lúc 14h chiều nay!' },
  ]);
  const [input, setInput]           = useState('');

  // Giả lập đếm giờ (demo)
  function simulateHours(h) { setHours(h); }

  function sendMsg() {
    if (!input.trim()) return;
    const nameMap = { worker: 'SX-00199 (Thợ điện)', hirer: 'SX-00001 (Người thuê)' };
    setMsgs(m => [...m, { from: role, name: nameMap[role], text: input }]);
    setInput('');
  }

  function startWork() {
    setStatus('working');
    setHours(0);
    setMsgs(m => [...m, { from: 'system', text: '🔨 Thợ đã đến và bắt đầu làm việc.' }]);
  }

  function markDone() {
    setStatus('done_worker');
    setMsgs(m => [...m, { from: 'system', text: '✅ Thợ báo đã hoàn thành công việc. Chờ người thuê xác nhận.' }]);
  }

  function confirmDone() {
    setStatus('completed');
    setMsgs(m => [...m, { from: 'system', text: '🎉 Người thuê đã xác nhận hoàn thành! Đơn dịch vụ kết thúc.' }]);
    setTimeout(() => setShowRating(true), 800);
  }

  function reportIssue() {
    setStatus('disputed');
    setMsgs(m => [...m, { from: 'system', text: '⚠️ Đã mở khiếu nại. Admin ShopX sẽ xem xét trong 24h.' }]);
  }

  const st = STATUS[status];

  // Màn đánh giá
  if (showRating) {
    const target = role === 'hirer' ? 'worker' : 'hirer';
    return (
      <div style={{ position: 'absolute', inset: 0, background: C.w, overflow: 'auto' }}>
        <div style={{ background: C.p, padding: '10px 16px' }}>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
            Đánh giá {target === 'worker' ? 'Thợ' : 'Người thuê'}
          </div>
        </div>

        {/* 2 chiều */}
        <div style={{ background: C.pl, padding: '8px 16px', display: 'flex', gap: 8 }}>
          {[
            { key: role === 'hirer' ? 'worker' : 'hirer', label: role === 'hirer' ? '1. Đánh giá Thợ' : '1. Đánh giá Người thuê' },
            { key: role === 'hirer' ? 'hirer' : 'worker',  label: '2. Nhận đánh giá' },
          ].map((s, i) => (
            <div key={s.key} style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 8, background: i === 0 ? C.p : '#e8f5e9', color: i === 0 ? '#fff' : '#2e7d32', fontSize: 12, fontWeight: i === 0 ? 600 : 400 }}>
              {s.label}
            </div>
          ))}
        </div>

        <RatingScreen
          go={go}
          target={role === 'hirer' ? 'worker' : 'seller'}
          onSkip={() => { setShowRating(false); go('s-home'); }}
        />

        <div style={{ padding: '0 16px 16px' }}>
          <button onClick={() => { setShowRating(false); go('s-home'); }}
            style={{ width: '100%', background: 'none', border: 'none', color: C.m, fontSize: 12, cursor: 'pointer' }}>
            Bỏ qua
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
          <button onClick={() => go('s-service')} style={{ color: '#fff', border: 'none', background: 'none', cursor: 'pointer', fontSize: 20 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Đơn dịch vụ — Thợ điện</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>SX-00001 × SX-00199</div>
          </div>
        </div>

        {/* Trạng thái đơn */}
        <div style={{ background: st.bg, borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: st.color }}>{st.label}</span>
          {status !== 'completed' && status !== 'disputed' && (
            <span style={{ fontSize: 10, color: C.m }}>+{hoursElapsed}h</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: C.g }}>

        {/* Thông tin đơn */}
        <div style={{ background: C.w, borderRadius: 12, padding: 12, marginBottom: 10, border: '1px solid #e8def8' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 8 }}>📋 Thông tin đơn dịch vụ</div>
          {[
            { label: 'Dịch vụ',      val: 'Sửa điện phòng ngủ' },
            { label: 'Thợ',          val: 'Anh Văn Nhân (SX-00199)' },
            { label: 'Người thuê',   val: 'SX-00001' },
            { label: 'Địa chỉ',      val: '45 Bùi Thị Xuân, Hố Nai' },
            { label: 'Giá thỏa thuận', val: '150.000đ' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 4 ? '1px solid #f5f0ff' : 'none' }}>
              <span style={{ fontSize: 11, color: C.m }}>{r.label}</span>
              <span style={{ fontSize: 11, color: C.t, fontWeight: 500 }}>{r.val}</span>
            </div>
          ))}
        </div>

        {/* Cảnh báo nhắc nhở */}
        {hoursElapsed > 0 && (
          <div style={{ marginBottom: 10 }}>
            <ServiceOrderAlert hoursElapsed={hoursElapsed} status={status} />
          </div>
        )}

        {/* Demo giả lập giờ */}
        <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: C.m, marginBottom: 6 }}>🧪 Demo — Giả lập thời gian chờ:</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[0, 24, 48, 72].map(h => (
              <button key={h} onClick={() => simulateHours(h)}
                style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: `1px solid ${hoursElapsed === h ? C.p : '#ccc'}`, background: hoursElapsed === h ? C.pl : '#fff', color: hoursElapsed === h ? C.p : C.m, cursor: 'pointer' }}>
                +{h}h
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
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
              <div style={{ maxWidth: '78%', padding: '8px 12px', borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 13, lineHeight: 1.4, background: isMe ? C.p : C.w, color: isMe ? '#fff' : C.t, border: isMe ? 'none' : '1px solid #e8def8' }}>
                {m.text}
              </div>
            </div>
          );
        })}

        {/* Nút hành động theo vai trò + trạng thái */}

        {/* THỢ — Bắt đầu làm việc */}
        {role === 'worker' && status === 'waiting' && (
          <div style={{ background: '#e3f2fd', borderRadius: 10, padding: 12, margin: '8px 0', border: '1px solid #bbdefb' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1565c0', marginBottom: 6 }}>
              🔨 Bạn đã đến nơi?
            </div>
            <div style={{ fontSize: 11, color: '#1976d2', marginBottom: 10 }}>
              Bấm "Bắt đầu làm việc" để thông báo cho người thuê và cập nhật trạng thái đơn.
            </div>
            <Btn onClick={startWork}>🔨 Bắt đầu làm việc</Btn>
            <div style={{ fontSize: 10, color: C.m, marginTop: 6, textAlign: 'center' }}>
              ⚠️ Hệ thống sẽ nhắc nếu bạn chưa cập nhật sau 24h
            </div>
          </div>
        )}

        {/* THỢ — Báo hoàn thành */}
        {role === 'worker' && status === 'working' && (
          <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 12, margin: '8px 0', border: '1px solid #c8e6c9' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32', marginBottom: 6 }}>
              ✅ Công việc đã xong?
            </div>
            <div style={{ fontSize: 11, color: '#388e3c', marginBottom: 10 }}>
              Bấm "Đã hoàn thành" để thông báo cho người thuê xác nhận và nhận đánh giá.
            </div>
            <Btn onClick={markDone}>✅ Đã hoàn thành công việc</Btn>
            <div style={{ fontSize: 10, color: C.m, marginTop: 6, textAlign: 'center' }}>
              ⚠️ Hệ thống sẽ nhắc nếu bạn chưa cập nhật sau 48h
            </div>
          </div>
        )}

        {/* NGƯỜI THUÊ — Xác nhận hoàn thành */}
        {role === 'hirer' && status === 'done_worker' && (
          <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 12, margin: '8px 0', border: '1px solid #c8e6c9' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32', marginBottom: 6 }}>
              🎉 Thợ báo đã hoàn thành
            </div>
            <div style={{ fontSize: 11, color: '#388e3c', marginBottom: 10 }}>
              Kiểm tra kết quả công việc. Nếu OK bấm xác nhận để hoàn tất đơn và đánh giá thợ.
            </div>
            <Btn onClick={confirmDone} style={{ marginBottom: 8 }}>
              ✅ Xác nhận công việc hoàn thành
            </Btn>
            <button onClick={reportIssue}
              style={{ width: '100%', background: '#fff', color: '#e53935', border: '1px solid #ef9a9a', padding: 9, borderRadius: 10, fontSize: 12, cursor: 'pointer' }}>
              ⚠️ Có vấn đề — Mở khiếu nại
            </button>
          </div>
        )}

        {/* NGƯỜI THUÊ — Đang chờ thợ */}
        {role === 'hirer' && (status === 'waiting' || status === 'working') && (
          <div style={{ background: C.pl, borderRadius: 10, padding: 10, margin: '8px 0', border: `1px solid ${C.b}` }}>
            <div style={{ fontSize: 11, color: C.pd }}>
              {status === 'waiting'
                ? '⏳ Đang chờ thợ đến. Hệ thống sẽ thông báo khi thợ bắt đầu làm việc.'
                : '🔨 Thợ đang làm việc. Hệ thống sẽ thông báo khi hoàn thành.'}
            </div>
          </div>
        )}

        {/* Hoàn tất */}
        {status === 'completed' && (
          <div style={{ background: '#e8f5e9', borderRadius: 12, padding: 14, margin: '8px 0', border: '1px solid #c8e6c9', textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#2e7d32', marginBottom: 4 }}>Đơn dịch vụ hoàn tất!</div>
            <div style={{ fontSize: 11, color: '#388e3c', marginBottom: 10 }}>
              Thống kê hoạt động của cả 2 bên đã được cập nhật.
            </div>
            <button onClick={() => setShowRating(true)}
              style={{ background: C.p, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
              ⭐ Đánh giá → nhận 5 SX Points
            </button>
          </div>
        )}

        {/* Đang khiếu nại */}
        {status === 'disputed' && (
          <div style={{ background: '#ffebee', borderRadius: 12, padding: 14, margin: '8px 0', border: '1px solid #ef9a9a' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#c62828', marginBottom: 6 }}>⚠️ Đang xử lý khiếu nại</div>
            <div style={{ fontSize: 11, color: '#e53935', lineHeight: 1.5 }}>
              Admin ShopX đang xem xét. Vui lòng chờ phản hồi trong 24h.<br/>
              Toàn bộ lịch sử chat được lưu làm bằng chứng.
            </div>
          </div>
        )}

        {/* Nút chọn vai trò demo */}
        <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 8, marginTop: 8 }}>
          <div style={{ fontSize: 10, color: C.m, marginBottom: 6 }}>👁️ Demo — Xem theo vai trò:</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ val: 'worker', label: '🔨 Thợ' }, { val: 'hirer', label: '👤 Người thuê' }].map(r => (
              <button key={r.val} onClick={() => go(r.val === 'worker' ? 's-service-order-worker' : 's-service-order-hirer')}
                style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: `1px solid ${role === r.val ? C.p : '#ccc'}`, background: role === r.val ? C.pl : '#fff', color: role === r.val ? C.p : C.m, fontSize: 11, cursor: 'pointer', fontWeight: role === r.val ? 600 : 400 }}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 80 }} />
      </div>

      {/* Footer chat */}
      <div style={{ background: C.w, borderTop: `1px solid ${C.b}`, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()}
          style={{ flex: 1, border: `1.5px solid ${C.b}`, borderRadius: 20, padding: '8px 14px', fontSize: 13, outline: 'none' }}
          placeholder="Nhắn tin..." />
        <button onClick={sendMsg} style={{ background: C.p, color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}>➤</button>
      </div>
    </div>
  );
}
