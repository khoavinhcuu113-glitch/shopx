import { C } from '../constants';
import { Avatar } from './UI';

export default function ShipperCard({ shipper, onSelect, rank }) {
  const isPriority = shipper.priority;
  return (
    <div style={{
      background: isPriority ? '#fffbf0' : C.w,
      border: `1px solid ${isPriority ? '#f59e0b' : '#e8def8'}`,
      borderRadius: 12, padding: 12, marginBottom: 8,
      display: 'flex', gap: 10, alignItems: 'center'
    }}>
      {/* Rank số thứ tự */}
      <div style={{ fontSize: 11, fontWeight: 700, color: rank <= 3 ? '#f59e0b' : C.m, width: 16, textAlign: 'center', flexShrink: 0 }}>
        {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}
      </div>

      <Avatar initials={shipper.initials} bg={shipper.color} size={44} />

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.t }}>{shipper.name}</span>
          <span style={{ fontSize: 10, background: isPriority ? '#fff3e0' : C.pl, color: isPriority ? '#e65100' : C.pd, padding: '2px 6px', borderRadius: 8 }}>
            {shipper.badge}
          </span>
        </div>
        <div style={{ fontSize: 11, color: C.m, marginBottom: 4 }}>{shipper.route} • {shipper.time}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#f59e0b' }}>⭐ {shipper.stars}</span>
          <span style={{ fontSize: 10, color: C.m }}>{shipper.orders.toLocaleString('vi-VN')} đơn</span>
          <span style={{ fontSize: 10, background: '#e8f5e9', color: '#2e7d32', padding: '2px 6px', borderRadius: 8 }}>
            ✅ {shipper.rate}% hoàn thành
          </span>
          <span style={{ fontSize: 10, background: C.pl, color: C.p, padding: '2px 6px', borderRadius: 8 }}>
            Chịu TN đến {(shipper.maxValue/1000000).toFixed(0)}tr
          </span>
        </div>
      </div>

      <button onClick={() => onSelect(shipper)} style={{ background: C.p, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontWeight: 600, flexShrink: 0 }}>
        Chọn
      </button>
    </div>
  );
}
