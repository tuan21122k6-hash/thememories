# 🌿 The Core Six — Kỷ Niệm Thanh Xuân

Website lưu giữ những khoảnh khắc, hình ảnh, thước phim và minigame kỷ niệm của nhóm bạn thân **The Core Six**.

---

## ✨ Tính Năng Nổi Bật

- 🔒 **Bảo mật sinh nhật**: Đăng nhập bằng ngày sinh của 6 thành viên để mở khóa giao diện kỷ niệm.
- 📸 **Thư viện hơn 700+ hình ảnh**: Tự động phân loại theo từng thành viên và kho ảnh chung (Our), hỗ trợ xem ảnh sắc nét với Lightbox (xoay góc, lật ảnh).
- 🎬 **Thư viện Video đa phương tiện**: Phát trực tiếp hơn 17 thước phim MP4 kỷ niệm (30 Tết, Tất niên, nhảy cùng cô giáo, vlog dã ngoại...) với bộ lọc danh mục trực quan.
- 🎲 **Kho Minigame gắn kết**:
  - 🐺 **Ma Sói 3 phe**: Tự động chia bài, phân vai theo số lượng người chơi.
  - 🎡 **Vòng quay may mắn**: Tùy chỉnh danh sách, quay số ngẫu nhiên chọn người thực hiện thử thách.
  - 🃏 **Truth or Dare**: Bộ thẻ bài sự thật hoặc thử thách hài hước, gắn kết bạn bè.
- 📖 **Sổ lưu bút**: Gửi lời nhắn, cảm xúc và lưu giữ kỷ niệm.
- 🎨 **Thiết kế Responsive & Favicon hình tròn**: Tối ưu hiển thị hoàn hảo trên Mobile, Tablet, Desktop; favicon hình tròn sắc nét cho mọi thiết bị.

---

## 📁 Cấu Trúc Dự Án

```text
├── index.html              # Trang chủ chính
├── media.html              # Thư viện toàn bộ Ảnh & Video
├── 404.html                # Trang thông báo lỗi 404 thân thiện
├── favicon.ico             # Favicon hình tròn chuẩn đa kích thước
├── .nojekyll               # Bỏ qua Jekyll engine khi deploy trên GitHub Pages
├── .gitignore              # Loại bỏ file tạm hệ điều hành và file rác
├── css/
│   └── a7f3c91e.css        # File định dạng CSS phân tầng tùy chỉnh
├── js/
│   ├── data.js             # Dữ liệu ảnh, video, ngày sinh, sự kiện
│   ├── main.js             # Logic điều hướng, hiển thị, lightbox, filter
│   └── script.a7f3c91e.js  # Logic minigame Ma Sói
├── images/
│   ├── qr_donate.jpg       # Mã QR donate lưu bút
│   └── favicons/           # Bộ icon hình tròn cho từng trang & thiết bị
├── minigame/
│   ├── masoi.html          # Minigame Ma Sói
│   ├── random.html         # Minigame Vòng quay may mắn
│   └── truthordare.html    # Minigame Truth or Dare
└── newmemories/            # Toàn bộ kho ảnh & video kỷ niệm
```

---

## 🚀 Hướng Dẫn Deploy Lên GitHub Pages

Chỉ với 3 bước đơn giản:

1. **Khởi tạo và đẩy code lên GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete The Core Six memories project"
   git branch -M main
   git remote add origin https://github.com/<tên-tài-khoản>/<tên-repo>.git
   git push -u origin main
   ```

2. **Bật GitHub Pages**:
   - Truy cập vào Repository trên GitHub -> chọn tab **Settings**.
   - Tại menu bên trái, chọn **Pages** (mục *Code and automation*).
   - Ở mục **Build and deployment** -> **Branch**:
     - Chọn nhánh: `main`
     - Chọn thư mục: `/(root)`
     - Bấm **Save**.

3. **Truy cập Website**:
   - Sau khoảng 1-2 phút, GitHub sẽ hiển thị đường link trang web của bạn:
   - `https://<tên-tài-khoản>.github.io/<tên-repo>/`
