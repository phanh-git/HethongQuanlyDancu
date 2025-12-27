"# Hệ thống Quản lý Dân cư

Hệ thống quản lý dân cư chuyên nghiệp với kiến trúc ERP thu nhỏ, sử dụng Node.js (Backend) và React (Frontend).

> 🚀 **Quick Start:** Xem [QUICKSTART.md](./QUICKSTART.md) để bắt đầu trong 5 phút!

## 🌟 Tính năng chính

### 1. Dashboard (Tổng quan)
- Thống kê nhanh: Tổng số hộ, dân số, tạm trú, tạm vắng
- Biểu đồ phân bố theo độ tuổi và giới tính
- Thông báo giấy tạm trú sắp hết hạn

### 2. Quản lý Hộ khẩu
- Danh sách hộ khẩu với tìm kiếm và phân trang
- Chi tiết hộ khẩu với lịch sử biến động
- Chức năng tách hộ tự động
- Thay đổi chủ hộ

### 3. Quản lý Nhân khẩu
- Bộ lọc thông minh theo diện (thường trú, tạm trú, tạm vắng)
- Form nhập liệu thông minh (tự động ẩn/hiện trường cho trẻ mới sinh)
- Quản lý khai tử và chuyển đi
- Hồ sơ điện tử chi tiết

### 4. Quản lý Tạm trú/Tạm vắng
- Theo dõi ngày hết hạn với cảnh báo màu sắc
- Chức năng gia hạn nhanh
- Tự động cập nhật trạng thái

### 5. Quản lý Phản ánh & Kiến nghị
- Hệ thống ticketing chuyên nghiệp
- Gộp kiến nghị trùng lặp
- Theo dõi tiến độ xử lý
- Phân công công việc

### 6. Báo cáo & Xuất dữ liệu
- Xuất Excel danh sách nhân khẩu theo độ tuổi
- Báo cáo hàng quý về kiến nghị
- Thống kê tổng hợp

## 🚀 Công nghệ sử dụng

### Backend
- Node.js & Express.js
- PostgreSQL với Sequelize
- JWT Authentication
- ExcelJS cho xuất báo cáo

### Frontend
- React 18
- Material-UI (MUI)
- Recharts cho biểu đồ
- React Router DOM
- Axios

## 📋 Yêu cầu hệ thống

- Node.js >= 16.x
- PostgreSQL >= 12.x
- npm hoặc yarn

## 🔧 Cài đặt

> 💡 **Cách nhanh nhất:** Chạy `./setup.sh` (Linux/Mac) hoặc `setup.bat` (Windows)

### 1. Clone repository

```bash
git clone https://github.com/phanh-git/HethongQuanlyDancu.git
cd HethongQuanlyDancu
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin của bạn:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=population_management
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Cài đặt Frontend

```bash
cd ../frontend
npm install
```

### 4. Khởi động PostgreSQL

```bash
# Start PostgreSQL service
# Linux: sudo service postgresql start
# Mac: brew services start postgresql
# Windows: Start PostgreSQL from Services
```

### 5. Chạy ứng dụng

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Mở trình duyệt và truy cập: `http://localhost:3000`

### 6. Seed dữ liệu mẫu (Tùy chọn)

```bash
cd backend
npm run seed
```

Lệnh này tạo tài khoản admin và dữ liệu mẫu:
- Username: `admin` / Password: `admin123`
- Username: `leader` / Password: `leader123`

## 📚 Tài liệu

## 📚 Tài liệu

- [🚀 Quick Start Guide](./QUICKSTART.md) - Bắt đầu nhanh trong 5 phút
- [📖 User Guide](./USER_GUIDE.md) - Hướng dẫn sử dụng chi tiết (Tiếng Việt)
- [📊 API Documentation](./API_DOCS.md) - Tài liệu API đầy đủ

## 👤 Tài khoản mặc định

Sau khi chạy `npm run seed`, sử dụng tài khoản:

## 👤 Tài khoản mặc định

Sau khi chạy `npm run seed`, sử dụng tài khoản:

**Admin:**
```
Username: admin
Password: admin123
```

**Team Leader:**
```
Username: leader
Password: leader123
```

## 📁 Cấu trúc thư mục

```
HethongQuanlyDancu/
├── backend/
│   ├── config/          # Cấu hình database
│   ├── controllers/     # Controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Middleware (auth, etc.)
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Pages
│   │   ├── services/    # API services
│   │   ├── context/     # Context providers
│   │   └── App.jsx      # Main app
│   └── index.html
└── README.md
```

## 🎨 Theme màu sắc

Hệ thống sử dụng theme màu xanh dương chủ đạo:
- Primary: `#0066CC`
- Light: `#3399FF`
- Dark: `#0052A3`
- Secondary: `#66B2FF`

## 🔐 Phân quyền

- **Admin**: Toàn quyền
- **Team Leader**: Quản lý hộ khẩu, nhân khẩu, kiến nghị
- **Deputy Leader**: Tương tự Team Leader
- **Staff**: Chỉ xem và cập nhật nhân khẩu

## 📱 Responsive Design

Giao diện được thiết kế responsive, tương thích với:
- Desktop
- Tablet
- Mobile

## 🔒 Bảo mật

- JWT Authentication
- Password hashing với bcrypt
- Role-based access control
- Helmet.js cho HTTP headers security

## 📊 API Documentation

Chi tiết xem tại [API_DOCS.md](./API_DOCS.md)

**Các endpoint chính:**
- `POST /api/auth/login` - Đăng nhập
- `GET /api/dashboard/stats` - Thống kê tổng quan
- `GET /api/households` - Danh sách hộ khẩu
- `GET /api/population` - Danh sách nhân khẩu
- `GET /api/complaints` - Danh sách kiến nghị
- `GET /api/reports/*` - Các loại báo cáo

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo Pull Request.

## 📝 License

MIT License

## 🎯 Roadmap

- [ ] Tích hợp SMS/Email notification
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Export PDF reports
- [ ] QR code cho hộ khẩu
- [ ] Tích hợp eKYC " 
