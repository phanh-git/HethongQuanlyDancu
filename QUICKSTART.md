# Quick Start Guide - Hệ thống Quản lý Dân cư

## Bắt đầu nhanh trong 5 phút

### Bước 1: Cài đặt dependencies

**Linux/Mac:**
```bash
./setup.sh
```

**Windows:**
```
setup.bat
```

Hoặc cài đặt thủ công:
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Bước 2: Cấu hình môi trường

Tạo file `.env` từ template:
```bash
cd backend
cp .env.example .env
```

Chỉnh sửa `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/population_management
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Bước 3: Khởi động MongoDB

**Linux/Mac:**
```bash
mongod
```

**Windows:**
```
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

Hoặc dùng MongoDB Compass/Atlas

### Bước 4: Seed dữ liệu mẫu (Tùy chọn)

```bash
cd backend
npm run seed
```

Lệnh này sẽ tạo:
- ✅ 2 tài khoản (admin, leader)
- ✅ 2 hộ khẩu mẫu
- ✅ 5 nhân khẩu
- ✅ 2 kiến nghị

**Tài khoản đăng nhập:**
- Admin: `username: admin / password: admin123`
- Leader: `username: leader / password: leader123`

### Bước 5: Khởi động ứng dụng

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

### Bước 6: Truy cập ứng dụng

Mở trình duyệt và vào:
```
http://localhost:3000
```

Đăng nhập với:
- Username: `admin`
- Password: `admin123`

---

## Cấu trúc nhanh

```
HethongQuanlyDancu/
├── backend/          # Node.js + Express API
├── frontend/         # React UI
├── README.md         # Tài liệu chính
├── USER_GUIDE.md     # Hướng dẫn sử dụng
├── API_DOCS.md       # API documentation
└── setup.sh/bat      # Script cài đặt
```

---

## Các lệnh thường dùng

### Backend
```bash
npm run dev      # Chạy development mode
npm start        # Chạy production mode
npm run seed     # Seed dữ liệu mẫu
```

### Frontend
```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run preview  # Preview production build
```

---

## Troubleshooting

### MongoDB không kết nối được

**Kiểm tra:**
```bash
# Kiểm tra MongoDB có chạy không
ps aux | grep mongod

# Hoặc trên Windows
tasklist | findstr mongod
```

**Giải pháp:**
- Đảm bảo MongoDB đang chạy
- Kiểm tra MONGODB_URI trong .env
- Thử kết nối qua MongoDB Compass

### Port 3000 hoặc 5000 đã được sử dụng

**Giải pháp:**
```bash
# Tìm process đang dùng port
lsof -i :3000
lsof -i :5000

# Hoặc đổi port trong:
# - frontend/vite.config.js (port 3000)
# - backend/.env (PORT=5000)
```

### Lỗi "Cannot find module"

**Giải pháp:**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Frontend không gọi được API

**Kiểm tra:**
1. Backend có đang chạy không?
2. CORS đã được cấu hình chưa? (Đã có trong code)
3. Proxy trong vite.config.js đúng chưa?

---

## Tính năng chính

✅ **Dashboard:** Thống kê tổng quan, biểu đồ  
✅ **Hộ khẩu:** Quản lý, tách hộ, lịch sử  
✅ **Nhân khẩu:** Thêm/sửa/xóa, bộ lọc thông minh  
✅ **Tạm trú/vắng:** Theo dõi, cảnh báo hết hạn  
✅ **Kiến nghị:** Ticketing system, gộp phiếu  
✅ **Báo cáo:** Xuất Excel, thống kê  

---

## Security

🔒 JWT Authentication  
🔒 Role-based access control  
🔒 Password hashing  
🔒 Protected API routes  

---

## Next Steps

1. ✅ Đăng nhập vào hệ thống
2. 📊 Xem Dashboard
3. 🏠 Thêm hộ khẩu mới
4. 👤 Thêm nhân khẩu
5. 📝 Tạo kiến nghị
6. 📈 Xem báo cáo

Chi tiết xem [USER_GUIDE.md](./USER_GUIDE.md)

---

## Support

📧 Email: support@example.com  
📖 Docs: [README.md](./README.md)  
🐛 Issues: [GitHub Issues](https://github.com/phanh-git/HethongQuanlyDancu/issues)

---

## License

MIT License - Free to use and modify
