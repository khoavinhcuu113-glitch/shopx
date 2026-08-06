import { useState } from 'react';
import { C, NGHES } from '../constants';
import { Shdr, Btn, Btn2, Fg, Fi, Fs, Sechdr, Upbox, VidPlaceholder, Ckrow, Infobox } from '../components/UI';

const STORAGE_KEY = 'sx_shipper_form';
function loadSaved() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; }
}

export default function ShipperRegisterScreen({ go, hasCCCD, hasAgreedTerms }) {
  const [form, setForm] = useState(loadSaved);

  function upd(field, value) {
    setForm(f => {
      const next = { ...f, [field]: value };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }
  function toggleMulti(field, label) {
    setForm(f => {
      const cur = f[field] || {};
      const next = { ...f, [field]: { ...cur, [label]: !cur[label] } };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function goVerifyCCCD() {
    sessionStorage.setItem('sx_kyc_return', 's-shipper-register');
    sessionStorage.setItem('sx_kyc_reason', 'đăng ký hồ sơ Shipper');
    go('s-kyc');
  }

  function goReadTerms() {
    sessionStorage.setItem('sx_terms_agree_mode', 'shipper');
    go('s-terms-shipper');
  }

  function submit() {
    if (!hasCCCD) { alert('Vui lòng xác minh Căn cước trước khi đăng ký hồ sơ Shipper.'); return; }
    if (!hasAgreedTerms) { alert('Vui lòng đọc và đồng ý Quy chế Shipper trước khi đăng ký.'); return; }
    if (!form.ck2 || !form.ck3) {
      alert('Vui lòng tick xác nhận tất cả cam kết trước khi đăng ký.');
      return;
    }
    sessionStorage.removeItem(STORAGE_KEY);
    go('s-shipper-success');
  }

  const goodsOptions = ['📦 Hàng thông thường', '❄️ Hàng tươi sống (có thùng đá)', '🔮 Hàng dễ vỡ (đóng gói kỹ)', '🛋️ Hàng cồng kềnh / nội thất'];
  const timeOptions   = ['🌅 Sáng (6h-12h)', '☀️ Chiều (12h-18h)', '🌙 Tối (18h-22h)', '🕐 Cả ngày linh hoạt', '📅 Cuối tuần'];

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
        <Fg label="Họ và tên đầy đủ" req><Fi placeholder="Đúng theo Căn cước" value={form.hoTen || ''} onChange={e => upd('hoTen', e.target.value)} /></Fg>
        <Fg label="Ngày tháng năm sinh" req><Fi type="date" value={form.ngaySinh || ''} onChange={e => upd('ngaySinh', e.target.value)} /></Fg>
        <Fg label="Số Căn cước" req><Fi placeholder="VD: 079123456789" maxLength={12} value={form.soCanCuoc || ''} onChange={e => upd('soCanCuoc', e.target.value.replace(/\D/g, ''))} /></Fg>
        <Fg label="Giới tính">
          <Fs value={form.gioiTinh || 'Nam'} onChange={e => upd('gioiTinh', e.target.value)}>
            <option>Nam</option><option>Nữ</option><option>Khác</option>
          </Fs>
        </Fg>
        <Fg label="Số điện thoại liên hệ" req><Fi placeholder="0901234567" type="tel" value={form.sdt || ''} onChange={e => upd('sdt', e.target.value)} /></Fg>
        <Fg label="Email liên hệ phụ"><Fi placeholder="VD: example@gmail.com" type="email" value={form.email || ''} onChange={e => upd('email', e.target.value)} /></Fg>
        <Fg label="Nơi thường trú" req>
          <textarea style={{ width: '100%', border: `1.5px solid #d4b8f0`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#1a1a2e', background: '#fff', outline: 'none', resize: 'none' }}
            rows={2} placeholder="VD: 123 Nguyễn Văn A, P. Tân Phong, TP. Biên Hòa, Đồng Nai"
            value={form.thuongTru || ''} onChange={e => upd('thuongTru', e.target.value)} />
        </Fg>
        <Fg label="Nơi tạm trú (nếu khác thường trú)">
          <textarea style={{ width: '100%', border: `1.5px solid #d4b8f0`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#1a1a2e', background: '#fff', outline: 'none', resize: 'none' }}
            rows={2} placeholder="Để trống nếu giống nơi thường trú"
            value={form.tamTru || ''} onChange={e => upd('tamTru', e.target.value)} />
        </Fg>
        <Fg label="Ảnh đại diện (ảnh thật)">
          <div onClick={() => upd('anhDaiDien', true)} style={{ cursor: 'pointer' }}>
            {form.anhDaiDien ? (
              <div style={{ border: '1.5px solid #2e7d32', borderRadius: 12, padding: 14, textAlign: 'center', background: '#e8f5e9' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>✅</div>
                <p style={{ fontSize: 11, color: '#2e7d32', fontWeight: 600 }}>Đã chụp ảnh đại diện</p>
              </div>
            ) : (
              <Upbox icon="📷" text="Chụp ảnh chân dung rõ mặt" />
            )}
          </div>
        </Fg>

        {/* Phần 2 */}
        <Sechdr num="2" title="Phương tiện vận chuyển" />
        <Fg label="Loại phương tiện" req>
          <Fs value={form.phuongTien || ''} onChange={e => upd('phuongTien', e.target.value)}>
            <option value="">-- Chọn phương tiện --</option>
            <option>🏍️ Xe máy (hàng dưới 20kg, nhỏ gọn)</option>
            <option>🚗 Xe ô tô con (hàng 20-50kg)</option>
            <option>🛻 Xe bán tải (hàng 50-200kg)</option>
            <option>🚚 Xe tải nhỏ (hàng cồng kềnh, nội thất)</option>
          </Fs>
        </Fg>
        <Fg label="Biển số xe" req><Fi placeholder="VD: 60A1-12345" value={form.bienSo || ''} onChange={e => upd('bienSo', e.target.value)} /></Fg>
        <Fg label="Ảnh xe">
          <div onClick={() => upd('anhXe', true)} style={{ cursor: 'pointer' }}>
            {form.anhXe ? (
              <div style={{ border: '1.5px solid #2e7d32', borderRadius: 12, padding: 14, textAlign: 'center', background: '#e8f5e9' }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>✅</div>
                <p style={{ fontSize: 11, color: '#2e7d32', fontWeight: 600 }}>Đã chụp ảnh xe</p>
              </div>
            ) : (
              <Upbox icon="🏍️" text="Chụp ảnh xe rõ biển số" />
            )}
          </div>
        </Fg>
        <Fg label="Loại hàng có thể nhận">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {goodsOptions.map((l, i) => {
              const checked = form.loaiHang ? !!form.loaiHang[l] : i === 0;
              return (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <input type="checkbox" checked={checked} onChange={() => toggleMulti('loaiHang', l)} style={{ accentColor: C.p }} /> {l}
                </label>
              );
            })}
          </div>
        </Fg>

        {/* Phần 3 */}
        <Sechdr num="3" title="Khu vực hoạt động" />
        <Fg label="Tỉnh/Thành phố chính" req>
          <Fs value={form.tinhThanh || ''} onChange={e => upd('tinhThanh', e.target.value)}>
            <option value="">-- Chọn tỉnh/thành --</option>
            <option>Đồng Nai</option>
            <option>TP. Hồ Chí Minh</option>
            <option>Bình Dương</option>
          </Fs>
        </Fg>
        <Fg label="Khu vực thường xuyên hoạt động" req>
          <Fs value={form.khuVuc || ''} onChange={e => upd('khuVuc', e.target.value)}>
            <option value="">-- Chọn khu vực --</option>
            <option>Biên Hòa (TP. Biên Hòa cũ)</option>
            <option>Hố Nai (P. Hố Nai cũ)</option>
            <option>Trảng Bom (H. Trảng Bom cũ)</option>
            <option>Long Khánh (TX. Long Khánh cũ)</option>
            <option>Toàn tỉnh Đồng Nai</option>
          </Fs>
        </Fg>
        <Fg label="Bán kính di chuyển tối đa">
          <Fs value={form.banKinh || ''} onChange={e => upd('banKinh', e.target.value)}>
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
          <Fs value={form.mucTrachNhiem || ''} onChange={e => upd('mucTrachNhiem', e.target.value)}>
            <option value="">-- Chọn mức --</option>
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
            {timeOptions.map((l, i) => {
              const checked = form.khungGio ? !!form.khungGio[l] : i === 3;
              return (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <input type="checkbox" checked={checked} onChange={() => toggleMulti('khungGio', l)} style={{ accentColor: C.p }} /> {l}
                </label>
              );
            })}
          </div>
        </Fg>

        {/* Phần 6 — Xác minh danh tính: bắt buộc, không theo ngưỡng như tài khoản mua/bán */}
        <Sechdr num="6" title="Xác minh danh tính (bắt buộc)" />
        <p style={{ fontSize: 12, color: C.m, marginBottom: 12 }}>Khác với tài khoản mua/bán, hồ sơ Shipper bắt buộc xác minh đầy đủ ngay từ đầu để đảm bảo uy tín dịch vụ.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          <div style={{ background: '#f1f8e9', border: '1.5px solid #4caf50', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>✅</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.t }}>Mức 1 — Số điện thoại</div>
              <div style={{ fontSize: 10, color: C.m, marginTop: 1 }}>Đã xác minh qua OTP</div>
            </div>
            <button disabled style={{ fontSize: 11, padding: '5px 10px', borderRadius: 8, border: 'none', fontWeight: 600, background: '#e8f5e9', color: '#2e7d32' }}>Đã xong</button>
          </div>
          <div style={{ background: hasCCCD ? '#f1f8e9' : '#fff', border: `1.5px solid ${hasCCCD ? '#4caf50' : C.b}`, borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: hasCCCD ? '#e8f5e9' : C.pl, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>🪪</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.t }}>Mức 2 — Căn cước</div>
              <div style={{ fontSize: 10, color: C.m, marginTop: 1 }}>Chụp 2 mặt Căn cước — bắt buộc để nhận đơn</div>
            </div>
            <button onClick={goVerifyCCCD} disabled={hasCCCD}
              style={{ fontSize: 11, padding: '5px 10px', borderRadius: 8, border: 'none', cursor: hasCCCD ? 'default' : 'pointer', fontWeight: 600, background: hasCCCD ? '#e8f5e9' : C.p, color: hasCCCD ? '#2e7d32' : '#fff' }}>
              {hasCCCD ? 'Đã xong' : 'Xác minh'}
            </button>
          </div>
        </div>

        {/* Phần 7 — Quy chế chính thức */}
        <Sechdr num="7" title="Quy chế Shipper Cộng đồng" />
        <div style={{ background: hasAgreedTerms ? '#f1f8e9' : C.pl, border: `1.5px solid ${hasAgreedTerms ? '#4caf50' : C.b}`, borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{hasAgreedTerms ? '✅' : '📋'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t }}>{hasAgreedTerms ? 'Đã đọc và đồng ý Quy chế Shipper' : 'Cần đọc và đồng ý Quy chế Shipper'}</div>
            <div style={{ fontSize: 10, color: C.m, marginTop: 1 }}>Quy chế chính thức — Điều khoản đầy đủ, giống nhau cho mọi Shipper</div>
          </div>
          <button onClick={goReadTerms}
            style={{ fontSize: 11, padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, background: hasAgreedTerms ? '#e8f5e9' : C.p, color: hasAgreedTerms ? '#2e7d32' : '#fff' }}>
            {hasAgreedTerms ? 'Xem lại' : 'Đọc & Đồng ý'}
          </button>
        </div>

        <div style={{ background: C.pl, borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 8 }}>Trước khi đăng ký, bạn xác nhận:</div>
          <Ckrow label="Thông tin phương tiện và khu vực hoạt động là trung thực" checked={!!form.ck2} onChange={e => upd('ck2', e.target.checked)} />
          <Ckrow label="Tôi hiểu và chấp nhận mức chịu trách nhiệm tài chính đã khai báo" checked={!!form.ck3} onChange={e => upd('ck3', e.target.checked)} />
        </div>

        <Btn onClick={submit}>➤ Đăng ký làm Shipper</Btn>
        <Btn2 onClick={() => go('s-service')}>💾 Lưu nháp — Điền sau</Btn2>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
