import { useState } from 'react';
import { C, NGHES, NGANH_LIST } from '../constants';
import { Shdr, Btn, Btn2, Fg, Fi, Fs, Sechdr, VidPlaceholder, Upbox, Ckrow, Infobox } from '../components/UI';

export function CvSuccessScreen({ go }) {
  return (
    <div>
      <Shdr title="Đăng ký thành công" />
      <div style={{ padding: 12, paddingTop: 32, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 36 }}>✅</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.t, marginBottom: 6 }}>Hồ sơ đã được đăng ký!</div>
        <div style={{ fontSize: 13, color: C.m, marginBottom: 24, lineHeight: 1.6 }}>
          Đang chờ Admin xét duyệt trong 24h. Sau khi duyệt sẽ hiển thị trong mục Hồ sơ thợ.
        </div>
        <div style={{ background: C.pl, borderRadius: 12, padding: 14, marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 8 }}>Bước tiếp theo:</div>
          {[
            '⭐ Upload chứng chỉ → nhận badge Chứng chỉ',
            '🎬 Sắp có: Quay clip giới thiệu kỹ năng',
          ].map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: i === 1 ? C.p : C.t, marginBottom: 6 }}>{t}</div>
          ))}
        </div>
        <Btn onClick={() => go('s-service')}>Về trang Dịch vụ & Việc làm</Btn>
        <Btn2 onClick={() => go('s-cv-register')}>Hoàn thiện thêm hồ sơ</Btn2>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

const STORAGE_KEY = 'sx_cv_form';
function loadSaved() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; }
}

export default function CvRegisterScreen({ go, hasCCCD, hasAgreedTerms }) {
  const [form, setForm] = useState(loadSaved);
  const progress = 12 + (form.hoTen ? 2 : 0) + (form.nganh ? 5 : 0);

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
    sessionStorage.setItem('sx_kyc_return', 's-cv-register');
    sessionStorage.setItem('sx_kyc_reason', 'đăng ký hồ sơ Thợ/Người làm tự do');
    go('s-kyc');
  }

  function goReadTerms() {
    sessionStorage.setItem('sx_terms_agree_mode', 'worker');
    go('s-terms-worker');
  }

  function submit() {
    if (!hasCCCD) { alert('Vui lòng xác minh Căn cước trước khi gửi hồ sơ.'); return; }
    if (!hasAgreedTerms) { alert('Vui lòng đọc và đồng ý Quy chế Thợ/Người làm tự do trước khi gửi hồ sơ.'); return; }
    if (!form.ck1) { alert('Vui lòng tick xác nhận trước khi gửi hồ sơ.'); return; }
    sessionStorage.removeItem(STORAGE_KEY);
    go('s-cv-success');
  }

  const nganh = form.nganh || '';
  const jobTypeOptions = ['Bán thời gian', 'Toàn thời gian', 'Theo yêu cầu', 'Làm cuối tuần'];
  const paymentOptions = ['Tiền mặt', 'Chuyển khoản / VietQR'];

  return (
    <div>
      <Shdr title="Đăng ký làm thợ / Người làm tự do" onBack={() => go('s-service')} />

      {/* Progress bar */}
      <div style={{ padding: '8px 12px 4px', background: C.w, borderBottom: `1px solid #e8def8` }}>
        <div style={{ background: '#e0d4f7', borderRadius: 10, height: 6, marginBottom: 4 }}>
          <div style={{ background: C.p, borderRadius: 10, height: 6, width: `${Math.min(progress, 100)}%`, transition: 'width 0.3s' }} />
        </div>
        <div style={{ fontSize: 10, color: C.m, textAlign: 'right' }}>Hoàn thiện hồ sơ để được hiển thị</div>
      </div>

      {/* Tài khoản đang dùng */}
      <div style={{ background: '#e8f5e9', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #c8e6c9' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.p, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontSize: 10, fontWeight: 700 }}>KV</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#2e7d32' }}>Đăng ký với tư cách: SX-00001</div>
          <div style={{ fontSize: 10, color: '#388e3c' }}>Khoavinhcuu113 • Đã xác minh SĐT</div>
        </div>
      </div>

      <div style={{ padding: 12 }}>

        {/* PHẦN 1 */}
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
          <textarea style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none', resize: 'none' }}
            rows={2} placeholder="VD: 123 Nguyễn Văn A, P. Tân Phong, TP. Biên Hòa, Đồng Nai"
            value={form.thuongTru || ''} onChange={e => upd('thuongTru', e.target.value)} />
        </Fg>
        <Fg label="Nơi tạm trú (nếu khác thường trú)">
          <textarea style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none', resize: 'none' }}
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

        {/* PHẦN 2 */}
        <Sechdr num="2" title="Nghề nghiệp & Kỹ năng" />
        <Fg label="Ngành nghề chính" req>
          <div style={{ position: 'relative' }}>
            <Fs value={nganh} onChange={e => upd('nganh', e.target.value)}>
              <option value="">-- Chọn ngành --</option>
              {NGANH_LIST.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
            </Fs>
          </div>
        </Fg>
        {nganh && (
          <Fg label="Nghề cụ thể" req>
            <Fs value={form.ngheCuThe || ''} onChange={e => upd('ngheCuThe', e.target.value)}>
              {(NGHES[nganh] || []).map(n => <option key={n}>{n}</option>)}
            </Fs>
          </Fg>
        )}
        <Fg label="Mô tả kỹ năng" req>
          <textarea style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none', resize: 'none' }}
            rows={3} placeholder="Mô tả cụ thể bạn làm được gì, kinh nghiệm thực tế..."
            value={form.moTaKyNang || ''} onChange={e => upd('moTaKyNang', e.target.value)} />
        </Fg>
        <Fg label="Số năm kinh nghiệm" req>
          <Fs value={form.soNamKN || ''} onChange={e => upd('soNamKN', e.target.value)}>
            <option>Dưới 1 năm</option><option>1-3 năm</option><option>3-5 năm</option><option>5-10 năm</option><option>Trên 10 năm</option>
          </Fs>
        </Fg>
        <Fg label="Video giới thiệu bản thân">
          <VidPlaceholder title="Quay clip 15-30 giây" desc="Giới thiệu kỹ năng và công trình thực tế — sắp ra mắt" />
        </Fg>

        {/* PHẦN 3 */}
        <Sechdr num="3" title="Thời gian & Khu vực" />
        <Fg label="Khu vực làm việc chính" req>
          <Fs value={form.khuVuc || ''} onChange={e => upd('khuVuc', e.target.value)}>
            <option value="">-- Chọn khu vực --</option>
            <option>Biên Hòa (TP. Biên Hòa cũ), Đồng Nai</option>
            <option>Trảng Bom (H. Trảng Bom cũ), Đồng Nai</option>
            <option>Long Khánh (TX. Long Khánh cũ), Đồng Nai</option>
            <option>Hố Nai (P. Hố Nai cũ), Đồng Nai</option>
            <option>TP. Hồ Chí Minh</option>
            <option>Bình Dương</option>
          </Fs>
        </Fg>
        <Fg label="Bán kính di chuyển">
          <Fs value={form.banKinh || ''} onChange={e => upd('banKinh', e.target.value)}>
            <option>Trong vòng 10km</option><option>Trong vòng 20km</option><option>Trong vòng 50km</option><option>Toàn tỉnh</option>
          </Fs>
        </Fg>
        <Fg label="Loại công việc nhận">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {jobTypeOptions.map((l, i) => {
              const checked = form.loaiCongViec ? !!form.loaiCongViec[l] : [0, 2, 3].includes(i);
              return (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <input type="checkbox" checked={checked} onChange={() => toggleMulti('loaiCongViec', l)} style={{ accentColor: C.p }} /> {l}
                </label>
              );
            })}
          </div>
        </Fg>

        {/* PHẦN 4 */}
        <Sechdr num="4" title="Mức giá công" />
        <Fg label="Giá theo giờ"><Fi placeholder="VD: 80.000" type="number" value={form.giaGio || ''} onChange={e => upd('giaGio', e.target.value)} /></Fg>
        <Fg label="Giá theo ngày"><Fi placeholder="VD: 500.000" type="number" value={form.giaNgay || ''} onChange={e => upd('giaNgay', e.target.value)} /></Fg>
        <Fg label="Ghi chú về giá">
          <textarea style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none', resize: 'none' }}
            rows={2} placeholder="VD: Giá chưa bao gồm vật tư, phụ phí đi xa..."
            value={form.ghiChuGia || ''} onChange={e => upd('ghiChuGia', e.target.value)} />
        </Fg>
        <Fg label="Nhận thanh toán">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {paymentOptions.map((l, i) => {
              const checked = form.nhanThanhToan ? !!form.nhanThanhToan[l] : true;
              return (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <input type="checkbox" checked={checked} onChange={() => toggleMulti('nhanThanhToan', l)} style={{ accentColor: C.p }} /> {l}
                </label>
              );
            })}
          </div>
        </Fg>

        {/* PHẦN 5 */}
        <Sechdr num="5" title="Học vấn & Chứng chỉ" />
        <Fg label="Trình độ học vấn">
          <Fs value={form.hocVan || ''} onChange={e => upd('hocVan', e.target.value)}>
            <option>Trung học cơ sở</option><option>Trung học phổ thông</option><option>Trung cấp nghề</option><option>Cao đẳng</option><option>Đại học</option>
          </Fs>
        </Fg>
        <Fg label="Chứng chỉ nghề (không bắt buộc)">
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
              <input type="radio" name="ccStatus" checked={(form.ccStatus || 'none') === 'none'} onChange={() => upd('ccStatus', 'none')} style={{ accentColor: C.p }} />
              Chưa có — bổ sung sau
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
              <input type="radio" name="ccStatus" checked={form.ccStatus === 'has'} onChange={() => upd('ccStatus', 'has')} style={{ accentColor: C.p }} />
              Tôi có, upload ngay
            </label>
          </div>
          {form.ccStatus === 'has' && (
            <>
              <Fi placeholder="VD: Chứng chỉ kỹ thuật viên điện lạnh hạng 3" value={form.chungChi || ''} onChange={e => upd('chungChi', e.target.value)} style={{ marginBottom: 8 }} />
              <div onClick={() => upd('anhChungChi', true)} style={{ cursor: 'pointer' }}>
                {form.anhChungChi ? (
                  <div style={{ border: '1.5px solid #2e7d32', borderRadius: 12, padding: 14, textAlign: 'center', background: '#e8f5e9' }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>✅</div>
                    <p style={{ fontSize: 11, color: '#2e7d32', fontWeight: 600 }}>Đã upload ảnh chứng chỉ</p>
                  </div>
                ) : (
                  <Upbox icon="📜" text="Chụp ảnh chứng chỉ rõ nét → được badge ⭐ Chứng chỉ nghề" />
                )}
              </div>
            </>
          )}
        </Fg>

        <Fg label="Hồ sơ năng lực / Công trình đã làm">
          <div style={{ background: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: 10, padding: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: '#1565c0', lineHeight: 1.6 }}>
              💡 Chưa có ảnh công trình cũng không sao — Hồ sơ năng lực của bạn sẽ <b>tự động xây dựng</b> từ các hợp đồng hoàn thành thật qua ShopX. Không cần tự chứng minh gì cả, khách hàng xác nhận là đủ.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
              <input type="radio" name="ctStatus" checked={(form.ctStatus || 'none') === 'none'} onChange={() => upd('ctStatus', 'none')} style={{ accentColor: C.p }} />
              Chưa có ảnh — để Hồ sơ năng lực tự xây dựng
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
              <input type="radio" name="ctStatus" checked={form.ctStatus === 'has'} onChange={() => upd('ctStatus', 'has')} style={{ accentColor: C.p }} />
              Tôi có sẵn ảnh, muốn thêm ngay
            </label>
          </div>
          {form.ctStatus === 'has' && (
            <div onClick={() => upd('anhCongTrinh', true)} style={{ cursor: 'pointer' }}>
              {form.anhCongTrinh ? (
                <div style={{ border: '1.5px solid #2e7d32', borderRadius: 12, padding: 14, textAlign: 'center', background: '#e8f5e9' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>✅</div>
                  <p style={{ fontSize: 11, color: '#2e7d32', fontWeight: 600 }}>Đã upload ảnh công trình</p>
                </div>
              ) : (
                <Upbox icon="🖼️" text="Upload ảnh thực tế • Tối đa 8 ảnh" />
              )}
            </div>
          )}
        </Fg>

        {/* PHẦN 6 */}
        <Sechdr num="6" title="Lịch sử & Uy tín" />
        <div style={{ background: C.pl, borderRadius: 10, padding: '10px 12px', fontSize: 12, color: C.pd, lineHeight: 1.6, marginBottom: 14 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>ℹ️ Hệ thống tự động cập nhật sau mỗi giao dịch</div>
          {['📊 Số việc hoàn thành', '👍 Tỷ lệ đánh giá tích cực', '📱 Tỷ lệ phản hồi', '🏆 SX Points tích lũy', '🏅 Hạng uy tín: 🆕 Mới / ✅ Uy tín / 🏅 Pro'].map((t, i) => (
            <div key={i}>{t}</div>
          ))}
        </div>

        {/* PHẦN 7 */}
        <Sechdr num="7" title="Xác minh danh tính (bắt buộc)" />
        <p style={{ fontSize: 12, color: C.m, marginBottom: 12 }}>Khác với tài khoản mua/bán, hồ sơ Thợ bắt buộc xác minh đầy đủ ngay từ đầu để đảm bảo minh bạch chất lượng dịch vụ.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { done: true,     icon: '✅', lbl: 'Mức 1 — Số điện thoại', desc: 'Đã xác minh qua OTP khi đăng ký',         btn: 'Đã xong',         btnBg: '#e8f5e9', btnColor: '#2e7d32', action: null },
            { done: hasCCCD,  icon: '🪪', lbl: 'Mức 2 — Căn cước',      desc: 'Chụp 2 mặt Căn cước — bắt buộc để nhận việc', btn: hasCCCD ? 'Đã xong' : 'Xác minh', btnBg: hasCCCD ? '#e8f5e9' : C.p, btnColor: hasCCCD ? '#2e7d32' : '#fff', action: hasCCCD ? null : goVerifyCCCD },
            { done: false,    icon: '⭐', lbl: 'Mức 3 — Chứng chỉ nghề', desc: 'Upload chứng chỉ → Admin xác minh 24h (tùy chọn)', btn: 'Upload ở Phần 5', btnBg: '#f59e0b', btnColor: '#fff', action: null },
          ].map((v, i) => (
            <div key={i} style={{ background: v.done ? '#f1f8e9' : C.w, border: `1.5px solid ${v.done ? '#4caf50' : C.b}`, borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: v.done ? '#e8f5e9' : C.pl, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>{v.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.t }}>{v.lbl}</div>
                <div style={{ fontSize: 10, color: C.m, marginTop: 1 }}>{v.desc}</div>
              </div>
              <button onClick={v.action || undefined}
                style={{ fontSize: 11, padding: '5px 10px', borderRadius: 8, border: 'none', cursor: v.action ? 'pointer' : 'default', fontWeight: 600, background: v.btnBg, color: v.btnColor, flexShrink: 0 }}>
                {v.btn}
              </button>
            </div>
          ))}
        </div>

        {/* PHẦN 7b — Quy chế chính thức */}
        <div style={{ marginTop: 16 }} />
        <Sechdr num="7b" title="Quy chế Thợ / Người làm tự do" />
        <div style={{ background: hasAgreedTerms ? '#f1f8e9' : C.pl, border: `1.5px solid ${hasAgreedTerms ? '#4caf50' : C.b}`, borderRadius: 12, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{hasAgreedTerms ? '✅' : '📋'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.t }}>{hasAgreedTerms ? 'Đã đọc và đồng ý Quy chế Thợ/Người làm tự do' : 'Cần đọc và đồng ý Quy chế Thợ/Người làm tự do'}</div>
            <div style={{ fontSize: 10, color: C.m, marginTop: 1 }}>Quy chế chính thức — Điều khoản đầy đủ, giống nhau cho mọi Thợ/Người làm tự do</div>
          </div>
          <button onClick={goReadTerms}
            style={{ fontSize: 11, padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, background: hasAgreedTerms ? '#e8f5e9' : C.p, color: hasAgreedTerms ? '#2e7d32' : '#fff' }}>
            {hasAgreedTerms ? 'Xem lại' : 'Đọc & Đồng ý'}
          </button>
        </div>

        {/* PHẦN 8 */}
        <div style={{ marginTop: 16 }} />
        <Sechdr num="8" title="Thống kê & Kết nối Dự án số 3" />
        <div style={{ background: C.pl, borderRadius: 10, padding: '10px 12px', fontSize: 12, color: C.pd, lineHeight: 1.6, marginBottom: 14 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>📊 Hiển thị sau khi bạn bắt đầu nhận việc</div>
          {['📈 Tổng thu nhập qua ShopX', '📋 Số hợp đồng điện tử đã ký'].map((t, i) => <div key={i}>{t}</div>)}
          <div style={{ color: C.p, fontSize: 11, marginTop: 6 }}>🔗 CV có thể hiển thị đồng thời trên Dự án số 3</div>
          <div style={{ marginTop: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <input type="checkbox" checked={!!form.duAnSo3} onChange={e => upd('duAnSo3', e.target.checked)} style={{ accentColor: C.p }} /> Đồng ý hiển thị hồ sơ trên Dự án số 3
            </label>
          </div>
        </div>

        {/* Xác nhận */}
        <div style={{ background: C.pl, borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 8 }}>Trước khi đăng ký, bạn xác nhận:</div>
          <Ckrow label="Thông tin kỹ năng là trung thực" checked={!!form.ck1} onChange={e => upd('ck1', e.target.checked)} />
        </div>

        <Btn onClick={submit}>➤ Đăng ký hồ sơ thợ</Btn>
        <Btn2 onClick={() => go('s-service')}>💾 Lưu nháp — Điền sau</Btn2>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
