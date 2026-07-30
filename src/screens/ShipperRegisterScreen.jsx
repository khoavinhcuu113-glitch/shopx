import { useState } from 'react';
import { C, NGHES } from '../constants';
import { Shdr, Btn, Btn2, Fg, Fi, Fs, Sechdr, Upbox, VidPlaceholder, Ckrow, Infobox } from '../components/UI';

export default function ShipperRegisterScreen({ go }) {
  const [ck1, setCk1] = useState(false);
  const [ck2, setCk2] = useState(false);
  const [ck3, setCk3] = useState(false);

  function submit() {
    if (!ck1 || !ck2 || !ck3) {
      alert('Vui lòng tick xác nhận tất cả cam kết trước khi đăng ký.');
      return;
    }
    go('s-shipper-success');
  }

  return (
    <div>
      <Shdr title="Đăng ký làm Shipper" onBack={() => go('s-service')} />
      <div style={{ background: '#e8f5e9', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #c8e6c9' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.p, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>KV</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#2e7d32' }}>Đăng ký với tư cách: SX-00001</div>
          <div style={{ fontSize: 10, color: '#388e3c' }}>Khoavinhcuu113 • Đã xác minh SĐT</div>
        </div>
      </div>

      <div style={{ padding: 12 }}>

        {/* Phần 1 */}
        <Sechdr num="1" title="Thông tin cá nhân" />
        <Fg label="Họ và tên đầy đủ" req><Fi placeholder="Đúng theo Căn cước công dân" /></Fg>
        <Fg label="Ngày tháng năm sinh" req><Fi type="date" /></Fg>
        <Fg label="Số Căn cước công dân" req><Fi placeholder="VD: 079123456789" maxLength={12} /></Fg>
        <Fg label="Giới tính">
          <Fs><option>Nam</option><option>Nữ</option><option>Khác</option></Fs>
        </Fg>
        <Fg label="Số điện thoại liên hệ" req><Fi placeholder="0901234567" type="tel" /></Fg>
        <Fg label="Email liên hệ phụ"><Fi placeholder="VD: example@gmail.com" type="email" /></Fg>
        <Fg label="Nơi thường trú" req>
          <textarea style={{ width: '100%', border: `1.5px solid #d4b8f0`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#1a1a2e', background: '#fff', outline: 'none', resize: 'none' }}
            rows={2} placeholder="VD: 123 Nguyễn Văn A, P. Tân Phong, TP. Biên Hòa, Đồng Nai" />
        </Fg>
        <Fg label="Nơi tạm trú (nếu khác thường trú)">
          <textarea style={{ width: '100%', border: `1.5px solid #d4b8f0`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#1a1a2e', background: '#fff', outline: 'none', resize: 'none' }}
            rows={2} placeholder="Để trống nếu giống nơi thường trú" />
        </Fg>
        <Fg label="Ảnh đại diện"><Upbox icon="📷" text="Chụp ảnh chân dung rõ mặt" /></Fg>

        {/* Phần 2 */}
        <Sechdr num="2" title="Phương tiện vận chuyển" />
        <Fg label="Loại phương tiện" req>
          <Fs>
            <option value="">-- Chọn phương tiện --</option>
            <option>🏍️ Xe máy (hàng dưới 20kg, nhỏ gọn)</option>
            <option>🚗 Xe ô tô con (hàng 20-50kg)</option>
            <option>🛻 Xe bán tải (hàng 50-200kg)</option>
            <option>🚚 Xe tải nhỏ (hàng cồng kềnh, nội thất)</option>
          </Fs>
        </Fg>
        <Fg label="Biển số xe" req><Fi placeholder="VD: 60A1-12345" /></Fg>
        <Fg label="Ảnh xe"><Upbox icon="🏍️" text="Chụp ảnh xe rõ biển số" /></Fg>
        <Fg label="Loại hàng có thể nhận">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['📦 Hàng thông thường','❄️ Hàng tươi sống (có thùng đá)','🔮 Hàng dễ vỡ (đóng gói kỹ)','🛋️ Hàng cồng kềnh / nội thất'].map((l, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <input type="checkbox" defaultChecked={i === 0} style={{ accentColor: C.p }} /> {l}
              </label>
            ))}
          </div>
        </Fg>

        {/* Phần 3 */}
        <Sechdr num="3" title="Khu vực hoạt động" />
        <Fg label="Tỉnh/Thành phố chính" req>
          <Fs>
            <option>-- Chọn tỉnh/thành --</option>
            <option>Đồng Nai</option>
            <option>TP. Hồ Chí Minh</option>
            <option>Bình Dương</option>
          </Fs>
        </Fg>
        <Fg label="Khu vực thường xuyên hoạt động" req>
          <Fs>
            <option>-- Chọn khu vực --</option>
            <option>Biên Hòa (TP. Biên Hòa cũ)</option>
            <option>Hố Nai (P. Hố Nai cũ)</option>
            <option>Trảng Bom (H. Trảng Bom cũ)</option>
            <option>Long Khánh (TX. Long Khánh cũ)</option>
            <option>Toàn tỉnh Đồng Nai</option>
          </Fs>
        </Fg>
        <Fg label="Bán kính di chuyển tối đa">
          <Fs>
            <option>Trong vòng 10km</option>
            <option>Trong vòng 20km</option>
            <option>Trong vòng 50km</option>
            <option>Không giới hạn</option>
          </Fs>
        </Fg>

        {/* Phần 4 */}
        <Sechdr num="4" title="Mức chịu trách nhiệm tài chính" />
        <Infobox text="Hệ thống dùng con số này để lọc đơn phù hợp. Đơn hàng có giá trị cao hơn mức này sẽ không hiển thị với bạn." />
        <Fg label="Tôi cam kết chịu trách nhiệm tối đa" req>
          <Fs>
            <option>-- Chọn mức --</option>
            <option>Dưới 1.000.000đ</option>
            <option>1.000.000đ - 5.000.000đ</option>
            <option>5.000.000đ - 10.000.000đ</option>
            <option>10.000.000đ - 20.000.000đ</option>
            <option>Trên 20.000.000đ</option>
          </Fs>
        </Fg>
        <div style={{ background: '#fff3e0', border: '1px solid #ffe082', borderRadius: 10, padding: '10px 12px', fontSize: 11, color: '#e65100', marginBottom: 14, display: 'flex', gap: 8 }}>
          ⚠️ <span>Nếu hàng bị mất hoặc hư do lỗi của shipper, bạn phải bồi thường theo mức đã cam kết. ShopX sẽ hỗ trợ giải quyết tranh chấp.</span>
        </div>

        {/* Phần 5 */}
        <Sechdr num="5" title="Thời gian hoạt động" />
        <Fg label="Khung giờ nhận đơn">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['🌅 Sáng (6h-12h)','☀️ Chiều (12h-18h)','🌙 Tối (18h-22h)','🕐 Cả ngày linh hoạt','📅 Cuối tuần'].map((l, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <input type="checkbox" defaultChecked={i === 3} style={{ accentColor: C.p }} /> {l}
              </label>
            ))}
          </div>
        </Fg>

        {/* Phần 6 */}
        <Sechdr num="6" title="Xác minh danh tính" />
        <p style={{ fontSize: 12, color: C.m, marginBottom: 12 }}>Xác minh càng nhiều → Được đề xuất đơn ưu tiên hơn</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { done: true,  icon: '✅', lbl: 'Mức 1 — Số điện thoại', desc: 'Đã xác minh qua OTP', btn: 'Đã xong', ok: true },
            { done: false, icon: '🪪', lbl: 'Mức 2 — CCCD',          desc: 'Chụp 2 mặt + ảnh cầm CCCD', btn: 'Xác minh', ok: false },
            { done: false, icon: '🟣', lbl: 'Mức 3 — Pi Network đã xác minh', desc: 'Kết nối tài khoản Pi Network đã KYC — tăng uy tín', btn: 'Kết nối Pi', ok: false },
            { done: false, icon: '🟣', lbl: 'Mức 4 — Thanh toán Pi Network', desc: 'Cho phép nhận thanh toán bằng Pi coin — sắp có khi Pi mainnet ổn định', btn: 'Sắp có', ok: null },
          ].map((v, i) => (
            <div key={i} style={{ background: v.done ? '#f1f8e9' : '#fff', border: `1.5px solid ${v.done ? '#4caf50' : C.b}`, borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: v.done ? '#e8f5e9' : C.pl, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>{v.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.t }}>{v.lbl}</div>
                <div style={{ fontSize: 10, color: C.m, marginTop: 1 }}>{v.desc}</div>
              </div>
              <button style={{ fontSize: 11, padding: '5px 10px', borderRadius: 8, border: 'none', cursor: v.ok === null ? 'not-allowed' : 'pointer', fontWeight: 600, background: v.done ? '#e8f5e9' : v.ok === null ? '#ccc' : C.p, color: v.done ? '#2e7d32' : v.ok === null ? '#888' : '#fff' }}>
                {v.btn}
              </button>
            </div>
          ))}
        </div>

        {/* Phần 7 — Cam kết */}
        <div style={{ marginTop: 16 }} />
        <Sechdr num="7" title="Cam kết Shipper ShopX" />
        <div style={{ background: C.pl, border: `1px solid ${C.b}`, borderRadius: 12, padding: 14, fontSize: 12, color: C.t, lineHeight: 1.7, maxHeight: 220, overflowY: 'auto', marginBottom: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: C.pd, marginBottom: 8 }}>CAM KẾT SHIPPER CỘNG ĐỒNG SHOPX</h3>
          <p><strong>Điều 1 — Nghĩa vụ giao hàng:</strong> Giao hàng đúng hẹn, đúng địa chỉ, bảo quản hàng cẩn thận trong suốt quá trình vận chuyển.</p>
          <p><strong>Điều 2 — Chụp ảnh bằng chứng:</strong> Chụp ảnh hàng hóa khi lấy tại điểm A và khi giao tại điểm B. Ảnh tự động lưu làm bằng chứng pháp lý.</p>
          <p><strong>Điều 3 — Không tự ý mở hàng:</strong> Không được kiểm tra, mở, hoặc thay đổi nội dung hàng hóa trong quá trình vận chuyển.</p>
          <p><strong>Điều 4 — Trách nhiệm tài chính:</strong> Nếu hàng bị mất hoặc hư do lỗi của shipper, phải bồi thường theo mức đã cam kết khi đăng ký.</p>
          <p><strong>Điều 5 — Từ chối đơn:</strong> Từ chối đơn hàng nhiều lần sẽ bị trừ điểm tín nhiệm và giảm thứ hạng hiển thị.</p>
          <p><strong>Điều 6 — Phí nền tảng:</strong> Miễn phí {5} đơn đầu tiên. Từ đơn thứ {6} trở đi, ShopX thu phí nền tảng theo giá trị đơn hàng.</p>
          <p><strong>Điều 7 — Vi phạm nghiêm trọng:</strong> Gian lận, lấy hàng không giao, hoặc vi phạm pháp luật sẽ bị khóa tài khoản vĩnh viễn và cung cấp thông tin cho cơ quan chức năng.</p>
        </div>

        <div style={{ background: C.pl, borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 8 }}>Trước khi đăng ký, bạn xác nhận:</div>
          <Ckrow label="Tôi đã đọc và đồng ý toàn bộ cam kết Shipper ShopX" checked={ck1} onChange={e => setCk1(e.target.checked)} />
          <Ckrow label="Thông tin phương tiện và khu vực hoạt động là trung thực" checked={ck2} onChange={e => setCk2(e.target.checked)} />
          <Ckrow label="Tôi hiểu và chấp nhận mức chịu trách nhiệm tài chính đã khai báo" checked={ck3} onChange={e => setCk3(e.target.checked)} />
        </div>

        <Btn onClick={submit}>➤ Đăng ký làm Shipper</Btn>
        <Btn2 onClick={() => go('s-service')}>💾 Lưu nháp — Điền sau</Btn2>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
