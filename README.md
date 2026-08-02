# Better Than Yesterday (BTY) 🚀
> *"Tốt hơn 1% mỗi ngày - Kỷ luật là tự do."*

Better Than Yesterday là một ứng dụng dashboard cá nhân giúp bạn rèn luyện kỷ luật bản thân, theo dõi thói quen, quản lý công việc, ghi chú thông minh và áp dụng quy tắc 6 hũ tài chính để tự do tài chính. Dự án được phát triển bằng Next.js (App Router), Tailwind CSS, Prisma (PostgreSQL) và Supabase.

---

## 🌟 Tính năng chính

### 1. Quản lý Thói quen (Habit Tracker) & Quỹ Tích luỹ (Savings Vault)
* Theo dõi thói quen: Thêm, sửa, xóa thói quen với các nhóm thói quen như Vệ sinh buổi sáng, Sức khỏe, Học tập, Side Hustle...
* Phần thưởng tích lũy (Savings Vault): Mỗi khi bạn hoàn thành một thói quen tốt, một lượng tiền ảo tương ứng (VNĐ) sẽ được tích lũy vào kho quỹ ảo để ghi nhận nỗ lực kỷ luật.

### 2. Biểu đồ nỗ lực Heatmap (GitHub Activity Heatmap)
* Biểu đồ nhiệt (Heatmap) thiết kế chuẩn GitHub thể hiện tần suất và điểm nỗ lực rèn luyện của bạn trong suốt 52 tuần qua (364 ngày).
* Thống kê chuỗi ngày liên tục (streak) tốt nhất và chuỗi hiện tại để giữ lửa động lực.

### 3. Sổ Nhật ký & Ảnh minh chứng (Daily Logs & Photo Gallery)
* Mood Tracker: Ghi nhận tâm trạng mỗi ngày (Tuyệt vời, Tốt, Bình thường, Mệt mỏi) kèm ghi chú ngắn.
* Proof Image: Tải ảnh minh chứng thói quen mỗi ngày (như ảnh chạy bộ, ảnh đọc sách, ảnh học code) trực tiếp lên Supabase Storage.

### 4. Quản lý Tài chính cá nhân (Quy tắc 6 Hũ tài chính)
* Quản lý Thu nhập: Nhập lương và các nguồn thu nhập phụ hàng tháng để phân bổ tự động.
* Mô hình 6 Hũ tài chính: Tự động chia tiền theo tỷ lệ phần trăm được cấu hình sẵn cho các quỹ:
  * Tiết kiệm & Dự phòng (`SAVINGS`)
  * Đầu tư Cổ phiếu / Chứng khoán (`STOCKS`)
  * Đầu tư Kinh doanh / Side Hustle (`BUSINESS`)
  * Quỹ Du lịch & Trải nghiệm (`TRAVEL`)
  * Chi tiêu Tự do & Thiết yếu (`FREE_SPEND`)
* Giao dịch: Ghi nhận nạp tiền vào quỹ (`IN`) hoặc rút chi tiêu (`OUT`).
* Sổ ghi chép phụ: Mỗi hũ tài chính đi kèm một Notebook riêng để lưu trữ ghi chép, kế hoạch chi tiêu cụ thể.

### 5. Quản lý Task việc cần làm (Todo List)
* Thêm, xóa và đánh dấu hoàn thành công việc nhanh trong ngày.
* Phân cấp độ ưu tiên nhiệm vụ (Cao, Trung bình, Thấp) để tập trung xử lý.

### 6. Trình ghi chú Rich Notes
* Soạn thảo ghi chú phong phú với tiêu đề (H1, H2, H3), danh sách gạch đầu dòng, bảng biểu.
* Tính năng ghim (`pin`) các ghi chú quan trọng lên đầu danh sách.

---

## 🛠️ Công nghệ sử dụng

* Core: [Next.js 14](https://nextjs.org/) (App Router), React 18, TypeScript.
* Database & ORM: [Prisma ORM](https://www.prisma.io/) với cơ sở dữ liệu PostgreSQL (chạy trên Supabase / Local).
* Storage: [Supabase Storage SDK](https://supabase.com/) dùng để tải lên hình ảnh minh chứng hàng ngày.
* Styling & UI: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons), [Framer Motion](https://www.framer.com/motion/) (Animation), [Canvas Confetti](https://github.com/catdad/canvas-confetti).
* Date processing: [date-fns](https://date-fns.org/).

---

## 🔑 Tài khoản Đăng nhập mặc định

Hệ thống sử dụng cơ chế kiểm tra quyền truy cập thông qua LocalStorage và Cookie bảo mật:

* Tài khoản (Username): `xu4ns0n`
* Mật khẩu (Password): `Sondeptrai123@k`

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

### 1. Yêu cầu hệ thống
* Node.js phiên bản >= 18.0.0
* Một cơ sở dữ liệu PostgreSQL hoạt động (ví dụ: Supabase PostgreSQL)

### 2. Cài đặt các thư viện phụ thuộc
Di chuyển vào thư mục dự án và chạy lệnh sau để cài đặt các package cần thiết:
```bash
npm install
```

### 3. Cấu hình Biến môi trường
Tạo file `.env` hoặc `.env.local` ở thư mục gốc của dự án với nội dung cấu hình sau:
```env
# URL kết nối cơ sở dữ liệu PostgreSQL (Transaction)
DATABASE_URL="your-postgresql-database-url"

# URL kết nối trực tiếp đến PostgreSQL (Session)
DIRECT_URL="your-postgresql-direct-url"

# API kết nối dịch vụ Supabase để lưu trữ ảnh
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Tạo cấu trúc bảng cơ sở dữ liệu (Database Setup)
Chạy lệnh Prisma để đẩy cấu trúc schema vào cơ sở dữ liệu của bạn:
```bash
# Đồng bộ schema lên database
npx prisma db push

# Tạo Prisma Client
npx prisma generate
```

### 5. Seeding dữ liệu mẫu (Khuyến nghị)
Chạy các script mẫu để tạo trước 5 Hũ tài chính mặc định và cấu hình thu nhập ban đầu:
```bash
# Seed dữ liệu tài chính mặc định
npx ts-node scripts/seed-finance.ts
```

### 6. Khởi chạy Server Phát triển
Bắt đầu dự án tại local:
```bash
npm run dev
```
Mở trình duyệt và truy cập địa chỉ http://localhost:3000 để bắt đầu hành trình cải thiện bản thân tốt hơn mỗi ngày!

---

## 📁 Cấu trúc thư mục dự án

```text
├── prisma/
│   └── schema.prisma        # Định nghĩa các model cơ sở dữ liệu (Habit, Finance, Note, Todo...)
├── scripts/
│   ├── seed-finance.ts      # Script seed dữ liệu hũ tài chính mặc định
│   └── clear-db.ts          # Script dọn dẹp cơ sở dữ liệu
├── src/
│   ├── app/                 # Next.js App Router (Các trang & REST API Route handler)
│   │   ├── api/             # API Endpoints (/api/habits, /api/finance, /api/logs...)
│   │   ├── login/           # Trang Đăng nhập
│   │   ├── tai-chinh/       # Module Quản lý 6 Hũ tài chính
│   │   └── page.tsx         # Trang chủ Dashboard quản lý kỷ luật
│   ├── components/          # Các Component UI React (Heatmap, Todo, HabitCard, Savings...)
│   └── lib/                 # Khởi tạo DB client và Supabase Storage Client
```

---
Chúc bạn rèn luyện kỷ luật thành công và đạt được mục tiêu tốt hơn ngày hôm qua! 🌟
