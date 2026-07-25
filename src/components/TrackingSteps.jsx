import { C } from '../constants';

const STEPS = [
  { label: 'Tin đăng được đăng lên',              time: 'Hôm nay 09:30' },
  { label: 'Người mua xác nhận địa chỉ nhận',     time: 'Hôm nay 09:45' },
  { label: 'Shipper đang trên đường lấy hàng',    time: 'Hôm nay 10:00' },
  { label: 'Đang giao đến người mua',              time: 'Chờ cập nhật'  },
  { label: 'Người mua xác nhận nhận hàng (OTP)',  time: 'Chờ cập nhật'  },
];

export default function TrackingSteps({ activeStep = 2 }) {
  return (
    <div style={{ background: C.w, border: `1px solid #e8def8`, borderRadius: 12, padding: 12, marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 10 }}>📦 Trạng thái đơn hàng</div>
      {STEPS.map((step, i) => {
        const done   = i < activeStep;
        const active = i === activeStep;
        const wait   = i > activeStep;
        return (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 11,
              flexShrink: 0, marginTop: 1,
              background: done ? '#e8f5e9' : active ? C.p : '#f5f5f5',
              color: done ? '#2e7d32' : active ? '#fff' : '#aaa',
            }}>
              {done ? '✓' : active ? '🚚' : '○'}
            </div>
            <div>
              <div style={{ fontSize: 12, color: wait ? C.m : C.t, fontWeight: active ? 600 : 400, ...(active ? { color: C.p } : {}) }}>
                {step.label}
              </div>
              <div style={{ fontSize: 10, color: C.m, marginTop: 2 }}>{step.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
