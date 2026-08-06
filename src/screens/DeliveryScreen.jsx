import { useState } from 'react';
import { C, SAMPLE_SHIPPERS, PAYMENT_MODE, calcPlatformFee } from '../constants';
import { Shdr, Infobox } from '../components/UI';
import ShipperCard from '../components/ShipperCard';
import TrackingSteps from '../components/TrackingSteps';

export default function DeliveryScreen({ go, chkLogin, orderValue = 18500000, hasCCCD = true, buyCount = 0, incrementBuyCount = () => {} }) {
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const platformFee = calcPlatformFee(orderValue);

  function handleSelectShipper(shipper) {
    setSelectedShipper(shipper);
    setShowConfirm(true);
  }

  function handleInviteShipper() {
    if (buyCount >= 2 && !hasCCCD) {
      sessionStorage.setItem('sx_kyc_return', 's-delivery');
      sessionStorage.setItem('sx_kyc_reason', 'tiếp tục mua hàng (đã dùng hết 2 đơn miễn phí)');
      go('s-kyc');
      return;
    }
    incrementBuyCount();
    // Trigger tạo chat 3 bên
    go('s-chat-3way');
  }

  return (
    <div>
      <Shdr title="Giao hàng cộng đồng" onBack={() => go('s-post')} />
      <div style={{ padding: 12 }}>

        {/* Bản đồ minh họa */}
        <div style={{ background: C.pl, borderRadius: 12, height: 130, position: 'relative', overflow: 'hidden', border: `1px solid ${C.b}`, marginBottom: 10 }}>
          <div style={{ position: 'absolute', top: '50%', left: '8%', right: '8%', height: 3, background: C.p, borderRadius: 2, transform: 'translateY(-50%)' }} />
          {['8%','33%','60%'].map((l,i) => (
            <div key={i} style={{ position: 'absolute', width: 12, height: 12, background: C.p, borderRadius: '50%', border: '2px solid #fff', top: '50%', left: l, transform: 'translateY(-50%)' }} />
          ))}
          <div style={{ position: 'absolute', width: 12, height: 12, background: C.p, borderRadius: '50%', border: '2px solid #fff', top: '50%', right: '8%', transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', fontSize: 9, fontWeight: 600, color: C.pd, top: '20%', left: '3%' }}>Người bán<br/>Biên Hòa</div>
          <div style={{ position: 'absolute', fontSize: 9, fontWeight: 600, color: C.pd, top: '20%', right: '1%', textAlign: 'right' }}>Người mua<br/>Hố Nai</div>
          <div style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 10, color: C.pd, fontWeight: 600 }}>📍 8km • ⏱️ ~20 phút</div>
          <div style={{ position: 'absolute', bottom: 8, right: 10, fontSize: 9, color: C.m }}>OpenStreetMap (sắp tích hợp)</div>
        </div>

        {/* Tracking */}
        <TrackingSteps activeStep={2} />

        {/* So sánh phí — không nêu tên đối thủ */}
        <div style={{ background: C.w, border: `1.5px solid #e0d4f7`, borderRadius: 12, padding: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.t, marginBottom: 8 }}>💰 So sánh phí giao hàng (8km nội khu)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f0ebfa' }}>
            <span style={{ fontSize: 12, color: C.m }}>Dịch vụ giao hàng thương mại</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>~20.000 – 25.000đ</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.p }}>🚚 ShopX Community <span style={{ fontSize: 10, background: C.pl, color: C.p, padding: '1px 6px', borderRadius: 8 }}>Tiết kiệm hơn</span></span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.p }}>14.000đ</span>
          </div>
          <div style={{ fontSize: 10, color: C.m, marginTop: 6 }}>* Giá tham khảo thị trường. ShopX Community là dịch vụ giao hàng cộng đồng do người dùng thực hiện.</div>
        </div>

        {/* Phí nền tảng ShopX */}
        <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 10, padding: '10px 12px', fontSize: 12, marginBottom: 12 }}>
          <div style={{ fontWeight: 600, color: '#2e7d32', marginBottom: 4 }}>📋 Phí nền tảng ShopX</div>
          <div style={{ color: '#388e3c' }}>Đơn {orderValue.toLocaleString('vi-VN')}đ → Phí: <strong>{platformFee.toLocaleString('vi-VN')}đ</strong></div>
          <div style={{ fontSize: 10, color: '#4caf50', marginTop: 2 }}>Thu sau khi giao hàng thành công</div>
        </div>

        {/* Danh sách shipper TOP 10 */}
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 4 }}>
          🚚 Shipper tuyến Biên Hòa → Hố Nai
          <span style={{ fontSize: 11, color: C.m, fontWeight: 400, marginLeft: 6 }}>TOP {SAMPLE_SHIPPERS.length}</span>
        </div>
        <div style={{ fontSize: 11, color: C.m, marginBottom: 10 }}>
          Xếp theo: cấp độ → tỷ lệ hoàn thành → đánh giá
        </div>

        {SAMPLE_SHIPPERS.map((shipper, i) => (
          <ShipperCard
            key={shipper.id}
            shipper={shipper}
            rank={i + 1}
            onSelect={handleSelectShipper}
          />
        ))}

        {/* Bảo hiểm hàng hóa */}
        <div style={{ background: C.pl, border: `1px solid ${C.b}`, borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 4 }}>🛡️ Bảo hiểm hàng hóa</div>
          <div style={{ fontSize: 11, color: C.m, marginBottom: 6 }}>
            Đơn {orderValue.toLocaleString('vi-VN')}đ → Phí bảo hiểm: <strong>20.000đ</strong> (qua PTI/MIC)
          </div>
          <button style={{ background: '#ccc', color: '#888', border: 'none', padding: '7px 14px', borderRadius: 8, fontSize: 11, cursor: 'not-allowed', fontWeight: 600 }}>
            🛡️ Mua bảo hiểm hàng hóa — Sắp có
          </button>
        </div>

        {/* Escrow disabled */}
        <Infobox
          icon="⚖️"
          text="Tính năng thanh toán Escrow đang hoàn thiện pháp lý (giấy phép NHNN). Vui lòng tự thỏa thuận thanh toán với shipper khi nhận hàng."
          color="#e65100"
          bg="#fff3e0"
        />
        <button style={{ width: '100%', background: '#ccc', color: '#888', border: 'none', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'not-allowed', marginBottom: 16 }}>
          🔒 Thanh toán Escrow — Sắp có
        </button>
      </div>

      {/* Popup xác nhận chọn shipper */}
      {showConfirm && selectedShipper && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }} onClick={() => setShowConfirm(false)}>
          <div style={{ background: C.w, borderRadius: '20px 20px 0 0', padding: '24px 20px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: C.t, marginBottom: 8 }}>
              Mời {selectedShipper.name} vào đơn?
            </h3>
            <div style={{ background: C.pl, borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 12, color: C.pd }}>
              <div style={{ marginBottom: 4 }}>⭐ {selectedShipper.badge} • {selectedShipper.stars} sao</div>
              <div style={{ marginBottom: 4 }}>✅ {selectedShipper.rate}% hoàn thành • {selectedShipper.orders.toLocaleString('vi-VN')} đơn</div>
              <div>💰 Chịu trách nhiệm đến {(selectedShipper.maxValue/1000000).toFixed(0)}tr đồng</div>
            </div>
            <div style={{ fontSize: 12, color: C.m, marginBottom: 16, lineHeight: 1.6 }}>
              Shipper sẽ nhận thông báo và xác nhận nhận đơn. Sau khi đồng ý, chat 3 bên sẽ được mở tự động.
            </div>
            <button onClick={handleInviteShipper} style={{ width: '100%', background: C.p, color: '#fff', border: 'none', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>
              🚚 Mời shipper vào đơn
            </button>
            <button onClick={() => setShowConfirm(false)} style={{ width: '100%', background: 'none', border: `1px solid ${C.b}`, color: C.m, padding: 10, borderRadius: 12, fontSize: 13, cursor: 'pointer' }}>
              Chọn shipper khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
