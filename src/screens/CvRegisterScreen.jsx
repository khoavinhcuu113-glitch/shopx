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
            '🪪 Xác minh Căn cước KYC → nhận badge KYC',
            '🔵 Kết nối Pi Network → nhận badge Pi',
            '⭐ Upload chứng chỉ → nhận badge Chứng chỉ',
            '🎬 Sắp có: Quay clip giới thiệu kỹ năng',
          ].map((t, i) => (
            <div key={i} style={{ fontSize: 12, color: i === 3 ? C.p : C.t, marginBottom: 6 }}>{t}</div>
          ))}
        </div>
        <Btn onClick={() => go('s-service')}>Về trang Dịch vụ & Việc làm</Btn>
        <Btn2 onClick={() => go('s-cv-register')}>Hoàn thiện thêm hồ sơ</Btn2>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

export function CccdScreen({ go }) {
  return (
    <div>
      <Shdr title="Xác minh Căn cước KYC" onBack={() => go('s-cv-register')} />
      <div style={{ padding: 12 }}>
        <div style={{ background: '#fff3e0', border: '1px solid #ffe082', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#e65100', marginBottom: 14, display: 'flex', gap: 8 }}>
          🔒 <span>Thông tin Căn cước được mã hóa, chỉ dùng để xác minh danh tính. Không chia sẻ với bên thứ ba trừ yêu cầu pháp lý.</span>
        </div>
        <Fg label="Mặt trước Căn cước" req><Upbox icon="🪪" text="Chụp mặt trước rõ nét, đủ 4 góc" /></Fg>
        <Fg label="Mặt sau Căn cước" req><Upbox icon="🪪" text="Chụp mặt sau rõ nét" /></Fg>
        <Fg label="Ảnh chân dung cầm Căn cước" req><Upbox icon="🤳" text="Mặt người và Căn cước đều rõ trong cùng 1 ảnh" /></Fg>
        <Infobox text="Admin xét duyệt trong 24 giờ. Sau khi duyệt bạn nhận badge 🪪 Căn cước KYC." />
        <Btn onClick={() => go('s-cv-register')}>📤 Gửi xác minh Căn cước</Btn>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

export default function CvRegisterScreen({ go }) {
  const [nganh, setNganh]   = useState('');
  const [ck1, setCk1]       = useState(false);
  const [ck2, setCk2]       = useState(false);
  const [progress, setProgress] = useState(12);

  function submit() {
    if (!ck1 || !ck2) { alert('Vui lòng tick xác nhận trước khi gửi hồ sơ.'); return; }
    go('s-cv-success');
  }

  return (
    <div>
      <Shdr title="Đăng ký làm thợ / Freelancer" onBack={() => go('s-service')} />

      {/* Progress bar */}
      <div style={{ padding: '8px 12px 4px', background: C.w, borderBottom: `1px solid #e8def8` }}>
        <div style={{ background: '#e0d4f7', borderRadius: 10, height: 6, marginBottom: 4 }}>
          <div style={{ background: C.p, borderRadius: 10, height: 6, width: `${progress}%`, transition: 'width 0.3s' }} />
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
        <Fg label="Họ và tên đầy đủ" req><Fi placeholder="Đúng theo Căn cước" onChange={() => setProgress(p => Math.min(p + 2, 100))} /></Fg>
        <Fg label="Số điện thoại liên hệ" req><Fi placeholder="0901234567" type="tel" /></Fg>
        <Fg label="Giới tính">
          <Fs><option>Nam</option><option>Nữ</option><option>Khác</option></Fs>
        </Fg>
        <Fg label="Ảnh đại diện"><Upbox icon="📷" text="Chụp ảnh chân dung rõ mặt" /></Fg>

        {/* PHẦN 2 */}
        <Sechdr num="2" title="Nghề nghiệp & Kỹ năng" />
        <Fg label="Ngành nghề chính" req>
          <div style={{ position: 'relative' }}>
            <Fs value={nganh} onChange={e => { setNganh(e.target.value); setProgress(p => Math.min(p + 5, 100)); }}>
              <option value="">-- Chọn ngành --</option>
              {NGANH_LIST.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
            </Fs>
          </div>
        </Fg>
        {nganh && (
          <Fg label="Nghề cụ thể" req>
            <Fs>
              {(NGHES[nganh] || []).map(n => <option key={n}>{n}</option>)}
            </Fs>
          </Fg>
        )}
        <Fg label="Mô tả kỹ năng" req>
          <textarea style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none', resize: 'none' }}
            rows={3} placeholder="Mô tả cụ thể bạn làm được gì, kinh nghiệm thực tế..." />
        </Fg>
        <Fg label="Số năm kinh nghiệm" req>
          <Fs><option>Dưới 1 năm</option><option>1-3 năm</option><option>3-5 năm</option><option>5-10 năm</option><option>Trên 10 năm</option></Fs>
        </Fg>
        <Fg label="Video giới thiệu bản thân">
          <VidPlaceholder title="Quay clip 15-30 giây" desc="Giới thiệu kỹ năng và công trình thực tế — sắp ra mắt" />
        </Fg>

        {/* PHẦN 3 */}
        <Sechdr num="3" title="Thời gian & Khu vực" />
        <Fg label="Khu vực làm việc chính" req>
          <Fs>
            <option>-- Chọn khu vực --</option>
            <option>Biên Hòa (TP. Biên Hòa cũ), Đồng Nai</option>
            <option>Trảng Bom (H. Trảng Bom cũ), Đồng Nai</option>
            <option>Long Khánh (TX. Long Khánh cũ), Đồng Nai</option>
            <option>Hố Nai (P. Hố Nai cũ), Đồng Nai</option>
            <option>TP. Hồ Chí Minh</option>
            <option>Bình Dương</option>
          </Fs>
        </Fg>
        <Fg label="Bán kính di chuyển">
          <Fs><option>Trong vòng 10km</option><option>Trong vòng 20km</option><option>Trong vòng 50km</option><option>Toàn tỉnh</option></Fs>
        </Fg>
        <Fg label="Loại công việc nhận">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Bán thời gian','Toàn thời gian','Theo yêu cầu','Làm cuối tuần'].map((l, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <input type="checkbox" defaultChecked={[0,2,3].includes(i)} style={{ accentColor: C.p }} /> {l}
              </label>
            ))}
          </div>
        </Fg>

        {/* PHẦN 4 */}
        <Sechdr num="4" title="Mức giá công" />
        <Fg label="Giá theo giờ"><Fi placeholder="VD: 80.000" type="number" /></Fg>
        <Fg label="Giá theo ngày"><Fi placeholder="VD: 500.000" type="number" /></Fg>
        <Fg label="Ghi chú về giá">
          <textarea style={{ width: '100%', border: `1.5px solid ${C.b}`, borderRadius: 10, padding: '9px 12px', fontSize: 13, color: C.t, background: C.w, outline: 'none', resize: 'none' }}
            rows={2} placeholder="VD: Giá chưa bao gồm vật tư, phụ phí đi xa..." />
        </Fg>
        <Fg label="Nhận thanh toán">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Tiền mặt','Chuyển khoản / VietQR','Pi coin (qua ShopX Pay)'].map((l, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <input type="checkbox" defaultChecked={i < 2} style={{ accentColor: C.p }} /> {l}
              </label>
            ))}
          </div>
        </Fg>

        {/* PHẦN 5 */}
        <Sechdr num="5" title="Học vấn & Chứng chỉ" />
        <Fg label="Trình độ học vấn">
          <Fs><option>Trung học cơ sở</option><option>Trung học phổ thông</option><option>Trung cấp nghề</option><option>Cao đẳng</option><option>Đại học</option></Fs>
        </Fg>
        <Fg label="Chứng chỉ nghề"><Fi placeholder="VD: Chứng chỉ kỹ thuật viên điện lạnh hạng 3" /></Fg>
        <Fg label="Upload ảnh chứng chỉ"><Upbox icon="📜" text="Chụp ảnh chứng chỉ rõ nét → được badge ⭐ Chứng chỉ nghề" /></Fg>
        <Fg label="Ảnh công trình đã làm"><Upbox icon="🖼️" text="Upload ảnh thực tế • Tối đa 8 ảnh" /></Fg>

        {/* PHẦN 6 */}
        <Sechdr num="6" title="Lịch sử & Uy tín" />
        <div style={{ background: C.pl, borderRadius: 10, padding: '10px 12px', fontSize: 12, color: C.pd, lineHeight: 1.6, marginBottom: 14 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>ℹ️ Hệ thống tự động cập nhật sau mỗi giao dịch</div>
          {['📊 Số việc hoàn thành', '👍 Tỷ lệ đánh giá tích cực', '📱 Tỷ lệ phản hồi', '🏆 SX Points tích lũy', '🏅 Hạng uy tín: 🆕 Mới / ✅ Uy tín / 🏅 Pro'].map((t, i) => (
            <div key={i}>{t}</div>
          ))}
        </div>

        {/* PHẦN 7 */}
        <Sechdr num="7" title="Xác minh danh tính" />
        <p style={{ fontSize: 12, color: C.m, marginBottom: 12 }}>Xác minh càng nhiều mức → Badge càng cao → Khách tin tưởng hơn</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { done: true,  icon: '✅', lbl: 'Mức 1 — Số điện thoại',         desc: 'Đã xác minh qua OTP khi đăng ký',            btn: 'Đã xong',         btnBg: '#e8f5e9', btnColor: '#2e7d32', action: null },
            { done: false, icon: '🪪', lbl: 'Mức 2 — Căn cước KYC',          desc: 'Chụp 2 mặt + ảnh chân dung cầm Căn cước',    btn: 'Xác minh',        btnBg: C.p,       btnColor: '#fff',    action: () => go('s-cccd') },
            { done: false, icon: '⭐', lbl: 'Mức 3 — Chứng chỉ nghề',        desc: 'Upload chứng chỉ → Admin xác minh 24h',      btn: 'Upload ở Phần 5', btnBg: '#f59e0b', btnColor: '#fff',    action: null },
            { done: false, icon: '🔵', lbl: 'Mức 4 — Pi Network đã xác minh', desc: 'Kết nối tài khoản Pi Network đã KYC',        btn: 'Kết nối Pi',      btnBg: C.p,       btnColor: '#fff',    action: null },
            { done: false, icon: '🟣', lbl: 'Mức 5 — Thanh toán Pi Network',  desc: 'Cho phép nhận thanh toán bằng Pi coin',      btn: 'Sắp có',          btnBg: '#ccc',    btnColor: '#666',    action: null },
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

        {/* PHẦN 8 */}
        <div style={{ marginTop: 16 }} />
        <Sechdr num="8" title="Thống kê & Kết nối Dự án số 3" />
        <div style={{ background: C.pl, borderRadius: 10, padding: '10px 12px', fontSize: 12, color: C.pd, lineHeight: 1.6, marginBottom: 14 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>📊 Hiển thị sau khi bạn bắt đầu nhận việc</div>
          {['📈 Tổng thu nhập qua ShopX', '📋 Số hợp đồng điện tử đã ký'].map((t, i) => <div key={i}>{t}</div>)}
          <div style={{ color: C.p, fontSize: 11, marginTop: 6 }}>🔗 CV có thể hiển thị đồng thời trên Dự án số 3</div>
          <div style={{ marginTop: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <input type="checkbox" style={{ accentColor: C.p }} /> Đồng ý hiển thị hồ sơ trên Dự án số 3
            </label>
          </div>
        </div>

        {/* Xác nhận */}
        <div style={{ background: C.pl, borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.pd, marginBottom: 8 }}>Trước khi đăng ký, bạn xác nhận:</div>
          <Ckrow label="Thông tin kỹ năng là trung thực" checked={ck1} onChange={e => setCk1(e.target.checked)} />
          <Ckrow label="Tôi đồng ý với cam kết Thợ/Freelancer của ShopX" checked={ck2} onChange={e => setCk2(e.target.checked)} />
        </div>

        <Btn onClick={submit}>➤ Đăng ký hồ sơ thợ</Btn>
        <Btn2 onClick={() => go('s-service')}>💾 Lưu nháp — Điền sau</Btn2>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
