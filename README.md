# ShopX — Đồng hành · Tiết kiệm · Cùng kiếm tiền

## Cấu trúc project

```
shopx/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          ← Entry point
    ├── App.jsx           ← Routing chính
    ├── constants.js      ← Tất cả biến quan trọng (đổi ở đây)
    ├── screens/          ← Mỗi màn hình 1 file
    └── components/       ← Components dùng chung
```

## Biến quan trọng trong constants.js

```js
FREE_ORDERS_SELLER  = 5     // Đổi khi có kế hoạch kinh doanh
FREE_ORDERS_SHIPPER = 5     // Đổi khi có kế hoạch kinh doanh
PAYMENT_MODE        = false  // Bật khi có giấy phép NHNN
INSURANCE_MODE      = false  // Bật khi ký hợp đồng PTI/MIC
```

## Deploy lên Vercel (làm 1 lần duy nhất)

### Bước 1: Tạo repo GitHub
1. Vào github.com → New repository → Đặt tên "shopx"
2. Giải nén file shopx.zip vào máy
3. Mở Terminal / Command Prompt trong thư mục shopx
4. Chạy lần lượt:
```bash
git init
git add .
git commit -m "ShopX v1.0 — init"
git remote add origin https://github.com/khoavinhcuu113-glitch/shopx.git
git push -u origin main
```

### Bước 2: Kết nối Vercel
1. Vào vercel.com → Add New Project
2. Import từ GitHub → chọn repo "shopx"
3. Framework: Vite (tự detect)
4. Bấm Deploy → chờ 1-2 phút

### Bước 3: Mỗi lần cập nhật tính năng mới
Claude sẽ gửi file cụ thể cần thay.
Mày chỉ cần:
1. Copy file đó vào đúng thư mục
2. Chạy:
```bash
git add .
git commit -m "Cập nhật tính năng X"
git push
```
3. Vercel tự động deploy — không cần làm gì thêm

## Chạy thử local (không bắt buộc)
```bash
npm install
npm run dev
```
Mở trình duyệt: http://localhost:5173

## Giai đoạn tiếp theo
- [ ] Kết nối Supabase (auth + database + realtime chat)
- [ ] Upload ảnh thật (Supabase Storage)
- [ ] Tích hợp OpenStreetMap + Leaflet.js
- [ ] VietQR thanh toán phí nền tảng
- [ ] Bảo hiểm PTI/MIC (sau khi ký hợp đồng đại lý)
- [ ] Escrow (sau khi có giấy phép NHNN)
