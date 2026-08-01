import { useState } from 'react';
import { C } from '../constants';
import { Shdr, Btn } from '../components/UI';

// Nội dung quy chế theo vai trò
const TERMS = {
  buyer: {
    title: 'Quy chế Người mua / Người bán',
    icon: '🛒',
    color: C.p,
    version: 'v1.1',
    sections: [
      {
        title: '1. Định nghĩa',
        content: 'ShopX là nền tảng kết nối người mua và người bán. ShopX KHÔNG phải người bán hàng và không chịu trách nhiệm về chất lượng sản phẩm của người bán. ShopX chỉ hỗ trợ giải quyết tranh chấp bằng bằng chứng đã lưu.',
      },
      {
        title: '2. Quyền lợi người bán',
        content: '✅ Đăng tin miễn phí trong giới hạn ban đầu\n✅ Tạo gian hàng cá nhân/doanh nghiệp\n✅ QR Code gian hàng riêng\n✅ AI hỗ trợ viết mô tả sản phẩm\n✅ Được bảo vệ khi người mua bom hàng\n✅ Hệ thống uy tín: 🆕 Mới / ✅ Uy tín / 🏅 Pro',
      },
      {
        title: '3. Nghĩa vụ người bán',
        content: '→ Mô tả trung thực, ảnh thật, giá rõ ràng\n→ Ghi rõ khuyết điểm nếu có\n→ Phản hồi tin nhắn trong 24 giờ\n→ Không tự ý thay đổi sản phẩm sau khi xác nhận đơn\n→ Đóng gói cẩn thận khi dùng Shipper ShopX',
      },
      {
        title: '4. Quyền lợi người mua',
        content: '✅ Xem sản phẩm không cần đăng nhập\n✅ OTP bảo vệ quyền xác nhận nhận hàng\n✅ Được bảo vệ khi hàng sai mô tả\n✅ ShopX cung cấp tài liệu làm bằng chứng pháp lý',
      },
      {
        title: '5. Nghĩa vụ người mua',
        content: '→ Chỉ đặt mua khi thực sự có nhu cầu\n→ Không bom hàng (đặt rồi không nhận)\n→ Có mặt đúng giờ tại điểm nhận\n→ Chỉ cung cấp OTP khi đã kiểm tra hàng OK\n→ Đánh giá trung thực sau giao dịch',
      },
      {
        title: '6. Hành vi bị cấm',
        content: 'Người bán KHÔNG được:\n❌ Đăng tin sản phẩm giả/nhái\n❌ Dùng ảnh không có phép\n❌ Đăng giá thấp rồi tăng giá\n❌ Tự đánh giá bằng tài khoản ảo\n\nNgười mua KHÔNG được:\n❌ Bom hàng nhiều lần\n❌ Ép giảm giá sau khi đã chốt\n❌ Đánh giá tiêu cực sai sự thật',
      },
      {
        title: '7. Xử lý vi phạm',
        content: 'Mức 1: Cảnh báo\nMức 2: Hạn chế tính năng 7 ngày\nMức 3: Khóa tài khoản 30 ngày\nMức 4: Khóa vĩnh viễn\n\nBom hàng:\n→ 3 lần: cảnh báo đỏ\n→ 5 lần: khóa vĩnh viễn',
      },
      {
        title: '8. Bảo mật dữ liệu',
        content: 'ShopX thu thập: Họ tên, SĐT, CCCD, địa chỉ, lịch sử giao dịch.\n\nMục đích: Xác minh danh tính, vận hành dịch vụ, giải quyết tranh chấp.\n\nKhông chia sẻ với bên thứ 3 vì mục đích thương mại.\n\nCăn cứ: Nghị định 13/2023/NĐ-CP',
      },
      {
        title: '9. Trách nhiệm thuế',
        content: 'Người bán tự chịu trách nhiệm kê khai và nộp thuế khi doanh thu vượt 100 triệu đồng/năm. ShopX không chịu trách nhiệm về nghĩa vụ thuế của người bán.\n\nCăn cứ: Thông tư 40/2021/TT-BTC',
      },
      {
        title: '10. Giới hạn trách nhiệm ShopX',
        content: 'ShopX không chịu trách nhiệm về chất lượng sản phẩm người bán, tổn thất gián tiếp, hành vi của Shipper cộng đồng.\n\nTrách nhiệm tối đa không vượt phí nền tảng đã thu trong 3 tháng gần nhất.\n\nCăn cứ: Điều 622-623 BLDS 2015',
      },
    ],
    pledges: [
      'Tôi đã đọc và đồng ý toàn bộ Quy chế Người mua/bán ShopX v1.1',
      'Thông tin tôi cung cấp là trung thực',
      'Tôi đồng ý ShopX thu thập và xử lý dữ liệu cá nhân theo Chính sách Bảo mật',
      'Tôi tự chịu trách nhiệm về nghĩa vụ thuế từ hoạt động kinh doanh trên ShopX',
      'Tôi xác nhận ảnh/nội dung đăng lên là của tôi hoặc tôi có quyền sử dụng',
      'Tôi đủ 18 tuổi và có đầy đủ năng lực hành vi dân sự',
    ],
  },

  shipper: {
    title: 'Quy chế Shipper Cộng đồng',
    icon: '🚚',
    color: '#2e7d32',
    version: 'v1.1',
    sections: [
      {
        title: '1. Định nghĩa',
        content: 'Shipper cộng đồng ShopX là cá nhân tự nguyện nhận và giao hàng hộ. KHÔNG phải nhân viên ShopX. Là cá nhân độc lập, tự định giá ship, tự chọn đơn hàng.',
      },
      {
        title: '2. Quyền lợi Shipper',
        content: '✅ Tự định giá phí ship\n✅ Miễn phí nền tảng cho đơn đầu tiên\n✅ Nhận tiền trực tiếp từ người mua\n✅ Hệ thống cấp bậc: 🥉→🥈→🥇→💎→⭐\n✅ ShopX lưu bằng chứng bảo vệ pháp lý\n✅ Quyền giữ hàng hợp lệ khi OTP chưa nhập',
      },
      {
        title: '3. Quy trình OTP',
        content: '→ OTP tạo khi Shipper nhận đơn\n→ OTP mất khi Shipper hủy đơn\n→ OTP chưa nhập = Hàng chưa giao thành công\n→ Shipper xác nhận: Nhập 6 số hoặc Quét QR\n→ OTP là bằng chứng pháp lý quan trọng nhất',
      },
      {
        title: '4. Thời gian phản hồi',
        content: '→ Sau khi nhận đơn: 60 phút phải phản hồi\n→ Quá 60 phút: Bị trừ điểm + người mua/bán đổi Shipper\n→ Chờ 15 phút tại điểm B nếu không có người nhận\n→ Báo ngay trong chat 3 bên khi có sự cố',
      },
      {
        title: '5. Thời hạn khiếu nại',
        content: '→ Hàng hư/sai: Báo trong 2h sau khi nhận\n→ Phí ship tranh chấp: Trong 24h sau hoàn tất\n→ Hoàn trả hàng thất bại: Trong 4h\n→ Sau thời hạn: Mặc định giao dịch OK\n\nCăn cứ: Điều 318 Luật Thương mại 2005',
      },
      {
        title: '6. Giới hạn hàng hóa',
        content: '🏍️ Xe máy: dưới 20kg, 50x50x50cm\n🚗 Ô tô con: dưới 50kg\n🛻 Xe bán tải: dưới 200kg\n\nShipper có quyền từ chối hàng vượt giới hạn mà không bị trừ điểm.',
      },
      {
        title: '7. Shipper KHÔNG thu tiền hàng',
        content: 'Giai đoạn 1: Shipper CHỈ thu phí ship. KHÔNG thu tiền hàng hộ người bán.\n\nVi phạm lần 1: Cảnh báo nghiêm trọng\nVi phạm lần 2: Khóa vĩnh viễn + báo công an\n\nCăn cứ: Nghị định 101/2012/NĐ-CP',
      },
      {
        title: '8. Trách nhiệm tài chính',
        content: 'Shipper bồi thường theo mức đã khai báo khi đăng ký.\n\nXác định lỗi bằng ảnh:\n→ Kiện hàng nguyên vẹn + hàng hư bên trong = Lỗi người bán\n→ Kiện hàng móp/rách bên ngoài = Lỗi Shipper',
      },
      {
        title: '9. Shipper nội khu',
        content: '→ Chỉ nhận đơn trong khu vực đã đăng ký\n→ Tin tìm Shipper nội khu tự xóa sau 24h\n→ Ghép tối đa 3 đơn cùng tuyến\n→ OTP riêng cho từng đơn',
      },
    ],
    pledges: [
      'Tôi đã đọc và đồng ý toàn bộ Quy chế Shipper Cộng đồng ShopX v1.1',
      'Thông tin phương tiện và khu vực hoạt động là trung thực',
      'Phương tiện của tôi có đầy đủ giấy tờ hợp lệ theo pháp luật',
      'Tôi hiểu và chấp nhận mức chịu trách nhiệm tài chính đã khai báo',
      'Tôi xác nhận KHÔNG thu tiền hàng hộ người bán trong giai đoạn 1',
      'Tôi hiểu tôi là cá nhân tự do, không phải nhân viên ShopX',
      'Tôi cam kết không gian lận OTP, không chiếm đoạt hàng hóa',
    ],
  },

  worker: {
    title: 'Quy chế Thợ / Freelancer',
    icon: '🔨',
    color: '#e65100',
    version: 'v1.0',
    sections: [
      {
        title: '1. Quan hệ pháp lý',
        content: 'Thợ/Freelancer ShopX là CÁ NHÂN TỰ DO. Quan hệ với ShopX là HỢP ĐỒNG DỊCH VỤ (Điều 513 BLDS 2015), KHÔNG phải hợp đồng lao động. ShopX chỉ là nền tảng kết nối.',
      },
      {
        title: '2. Quyền lợi',
        content: '✅ Tự định giá công theo kỹ năng\n✅ Nhận tiền trực tiếp từ người thuê\n✅ Hồ sơ CV chuyên nghiệp trên ShopX\n✅ Hệ thống uy tín: 🆕 Mới / ✅ Uy tín / 🏅 Pro\n✅ Chat lưu bằng chứng pháp lý\n✅ Xác nhận hoàn thành 2 chiều',
      },
      {
        title: '3. Quy trình làm việc',
        content: 'Bước 1: Xác nhận nhận việc\nBước 2: Bấm "Bắt đầu làm việc" khi đến nơi\nBước 3: Bấm "Đã hoàn thành" khi xong\nBước 4: Người thuê xác nhận → Đánh giá 2 chiều\n\nBẮT BUỘC cập nhật đúng thứ tự!',
      },
      {
        title: '4. Hệ thống nhắc nhở',
        content: '+24h chưa bắt đầu → ⚠️ Nhắc lần 1\n+48h chưa hoàn thành → ⚠️ Nhắc lần 2\n+72h vẫn chưa → 🔴 Cảnh báo đỏ + Admin xử lý\n\nQUÊN CẬP NHẬT ≠ BỊ PHẠT NGAY\nAdmin hỗ trợ giải quyết trước',
      },
      {
        title: '5. Thanh toán',
        content: '→ Thỏa thuận giá TRƯỚC khi làm\n→ Thỏa thuận trong chat ShopX = có giá trị pháp lý\n→ Không được tự ý tính thêm sau khi đã chốt\n→ Phát sinh thêm: Phải thỏa thuận trong chat\n→ Tự chịu thuế TNCN nếu vượt 100tr/năm',
      },
      {
        title: '6. Chất lượng và bảo hành',
        content: '→ Làm đúng như đã mô tả trong hồ sơ\n→ Bảo hành theo cam kết riêng (nếu có)\n→ ShopX không đảm bảo bảo hành thay thợ\n→ Tai nạn lao động: Thợ tự chịu trách nhiệm\n→ Khuyến khích mua bảo hiểm tai nạn cá nhân',
      },
      {
        title: '7. Tranh chấp',
        content: '→ Chất lượng: Khiếu nại trong 24h sau xác nhận\n→ Thanh toán: Khiếu nại trong 48h\n→ Người thuê hủy sau khi thợ đến: Thợ được phí đi lại\n→ Thợ hủy sau khi nhận: Không nhận thù lao + bị ghi vi phạm',
      },
    ],
    pledges: [
      'Kỹ năng và kinh nghiệm trong hồ sơ là trung thực',
      'Tôi hiểu mối quan hệ với ShopX là hợp đồng dịch vụ, không phải lao động',
      'Tôi cam kết cập nhật trạng thái đơn dịch vụ đúng quy trình',
      'Tôi tự chịu trách nhiệm về chất lượng công việc và an toàn lao động',
      'Tôi tự chịu trách nhiệm về nghĩa vụ thuế TNCN của mình',
      'Tôi đồng ý ShopX lưu lịch sử chat làm bằng chứng tranh chấp',
    ],
  },

  business: {
    title: 'Quy chế Doanh nghiệp',
    icon: '🏢',
    color: '#1565c0',
    version: 'v1.0',
    sections: [
      {
        title: '1. Phân loại doanh nghiệp',
        content: 'Loại 1 — Hộ kinh doanh cá thể: Có GCNĐK hộ KD + MST\nLoại 2 — Doanh nghiệp: Công ty TNHH/CP + MST\nLoại 3 — Chưa đăng ký: Hoạt động như cá nhân, không có badge Doanh nghiệp, không được quảng cáo',
      },
      {
        title: '2. Điều kiện badge 🏢 Xác minh',
        content: '→ Tài khoản ShopX đã KYC Căn cước\n→ Giấy phép KD hợp lệ\n→ Mã số thuế còn hiệu lực\n→ Admin ShopX xác minh trong 48h\n\nSo với Shopee Mall: Không yêu cầu doanh số tối thiểu (Shopee yêu cầu 30 đơn/tháng)',
      },
      {
        title: '3. Quyền lợi',
        content: '✅ Badge 🏢 Doanh nghiệp xác minh\n✅ Gian hàng 3 tab: Sản phẩm/Dịch vụ/Đánh giá\n✅ AI tạo gian hàng từ mô tả\n✅ QR Code 4 loại\n✅ Thống kê sản phẩm được quan tâm\n✅ Banner quảng cáo (giai đoạn 2)',
      },
      {
        title: '4. Nghĩa vụ pháp lý',
        content: '→ Duy trì Giấy phép KD còn hiệu lực\n→ Xuất hóa đơn VAT khi khách yêu cầu\n→ Thực hiện đầy đủ: Thuế GTGT + Thuế TNDN\n→ Hàng hóa có nguồn gốc rõ ràng\n\nCăn cứ: TT 40/2021, NĐ 91/2022, Luật Quảng cáo 2012',
      },
      {
        title: '5. Quy định quảng cáo',
        content: 'Chỉ DN CÓ gian hàng ShopX mới được quảng cáo.\nBadge "Quảng cáo" luôn hiển thị rõ.\n\nCẤM:\n❌ Thông tin sai sự thật\n❌ Bôi nhọ đối thủ theo tên\n❌ Cam kết không có căn cứ\n\nCăn cứ: Luật Quảng cáo 2012',
      },
      {
        title: '6. Trách nhiệm sản phẩm',
        content: 'DN chịu hoàn toàn:\n→ Chất lượng sản phẩm/dịch vụ\n→ Bảo hành theo cam kết\n→ An toàn sản phẩm theo pháp luật\n\nShopX không chịu:\n→ Chất lượng sản phẩm DN\n→ Tranh chấp tiêu dùng\n(chỉ cung cấp bằng chứng chat)',
      },
      {
        title: '7. Phí nền tảng',
        content: 'Giai đoạn 1:\n→ Đăng ký gian hàng: Miễn phí\n→ Phí/đơn: 2.000 - 15.000đ tùy giá trị\n→ AI tạo gian hàng: Miễn phí (giới hạn)\n→ QR Code: Miễn phí\n\nGiai đoạn 2:\n→ Gói Doanh nghiệp Pro (xác định sau)\n→ Phí quảng cáo CPM/CPC',
      },
    ],
    pledges: [
      'Thông tin doanh nghiệp tôi cung cấp là trung thực và hợp lệ theo pháp luật',
      'Tôi cam kết duy trì Giấy phép KD còn hiệu lực trong suốt thời gian hoạt động',
      'Sản phẩm/dịch vụ tôi đăng có nguồn gốc rõ ràng, đúng pháp luật',
      'Tôi tự chịu trách nhiệm về chất lượng, bảo hành và nghĩa vụ thuế',
      'Tôi không dùng thông tin khách hàng ShopX cho mục đích ngoài giao dịch',
      'Nội dung quảng cáo do tôi hoàn toàn chịu trách nhiệm theo Luật Quảng cáo 2012',
      'Tôi đã đọc và đồng ý toàn bộ Quy chế Doanh nghiệp ShopX v1.0',
    ],
  },
};

// Màn hình hiển thị quy chế
export default function TermsScreen({ go, role = 'buyer', onAgree, showAgree = false }) {
  const [expanded, setExpanded] = useState(null);
  const [agreed, setAgreed]     = useState({});
  const [reading, setReading]   = useState(false);

  const t = TERMS[role] || TERMS.buyer;
  const allAgreed = t.pledges.every((_, i) => agreed[i]);

  function toggleSection(i) {
    setExpanded(expanded === i ? null : i);
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', background: C.g }}>
      <Shdr title={t.title} onBack={() => go('s-register')} />

      {/* Header */}
      <div style={{ background: t.color, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>{t.icon}</span>
          <div>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{t.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>
              Phiên bản {t.version} · Áp dụng theo pháp luật Việt Nam
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 12 }}>

        {/* Lưu ý đọc kỹ */}
        <div style={{ background: '#fff3e0', borderRadius: 10, padding: '10px 12px', marginBottom: 12, border: '1px solid #ffe082', display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
          <div style={{ fontSize: 12, color: '#e65100', lineHeight: 1.5 }}>
            Vui lòng đọc kỹ toàn bộ quy chế trước khi tick chọn đồng ý. Việc tick chọn đồng ý có giá trị pháp lý tương đương chữ ký điện tử.
          </div>
        </div>

        {/* Các điều khoản accordion */}
        {t.sections.map((s, i) => (
          <div key={i} style={{ background: C.w, borderRadius: 10, marginBottom: 8, border: '1px solid #e8def8', overflow: 'hidden' }}>
            <button onClick={() => toggleSection(i)}
              style={{ width: '100%', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.t }}>{s.title}</span>
              <span style={{ fontSize: 16, color: C.m, flexShrink: 0, marginLeft: 8 }}>
                {expanded === i ? '▲' : '▼'}
              </span>
            </button>
            {expanded === i && (
              <div style={{ padding: '0 14px 12px', fontSize: 12, color: C.m, lineHeight: 1.7, whiteSpace: 'pre-line', borderTop: '1px solid #f5f0ff' }}>
                {s.content}
              </div>
            )}
          </div>
        ))}

        {/* Cam kết tick chọn */}
        {showAgree && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 10 }}>
              ✍️ Xác nhận đồng ý:
            </div>
            <div style={{ background: C.pl, borderRadius: 12, padding: 14, marginBottom: 14 }}>
              {t.pledges.map((p, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!agreed[i]} onChange={e => setAgreed(a => ({ ...a, [i]: e.target.checked }))}
                    style={{ accentColor: t.color, marginTop: 2, flexShrink: 0, width: 16, height: 16 }} />
                  <span style={{ fontSize: 12, color: C.t, lineHeight: 1.5 }}>{p}</span>
                </label>
              ))}
            </div>

            <Btn onClick={() => allAgreed && onAgree?.()}
              style={{ background: allAgreed ? t.color : '#ccc', cursor: allAgreed ? 'pointer' : 'default' }}>
              {allAgreed ? '✅ Xác nhận đồng ý — Tiếp tục' : `Vui lòng tick đủ ${t.pledges.length} mục`}
            </Btn>
          </div>
        )}

        {/* Nút xem và quay lại (khi không cần agree) */}
        {!showAgree && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={() => go('s-register')}
              style={{ background: 'none', border: 'none', color: C.p, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
              ← Quay lại đăng ký
            </button>
          </div>
        )}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}

// Màn hình chọn quy chế để xem
export function TermsMenuScreen({ go }) {
  const items = [
    { role: 'buyer',    icon: '🛒', label: 'Người mua / Người bán', color: C.p },
    { role: 'shipper',  icon: '🚚', label: 'Shipper Cộng đồng',     color: '#2e7d32' },
    { role: 'worker',   icon: '🔨', label: 'Thợ / Freelancer',       color: '#e65100' },
    { role: 'business', icon: '🏢', label: 'Doanh nghiệp',           color: '#1565c0' },
  ];
  return (
    <div>
      <Shdr title="Quy chế & Điều khoản" onBack={() => go('s-account')} />
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 12, color: C.m, marginBottom: 14, lineHeight: 1.5 }}>
          Tất cả quy chế áp dụng theo pháp luật Việt Nam hiện hành. Bấm vào từng mục để đọc chi tiết.
        </div>
        {items.map((item, i) => (
          <button key={i} onClick={() => go(`s-terms-${item.role}`)}
            style={{ width: '100%', background: C.w, border: '1px solid #e8def8', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: item.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: C.m }}>
                {TERMS[item.role].version} · {TERMS[item.role].sections.length} điều khoản
              </div>
            </div>
            <span style={{ fontSize: 18, color: C.m }}>›</span>
          </button>
        ))}

        <div style={{ background: C.pl, borderRadius: 10, padding: '10px 12px', marginTop: 8 }}>
          <div style={{ fontSize: 11, color: C.pd, lineHeight: 1.6 }}>
            📋 ShopX có quyền cập nhật quy chế với thông báo trước 7 ngày. Tiếp tục sử dụng sau khi cập nhật = đồng ý với quy chế mới.
          </div>
        </div>
        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
