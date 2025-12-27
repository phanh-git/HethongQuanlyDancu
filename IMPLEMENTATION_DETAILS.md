# Tổng Quan Cập Nhật Hệ Thống

## Các Thay Đổi Database

### 1. Cập nhật model User
- **ID**: Đổi từ UUID sang INTEGER với auto_increment
- **Thêm trường mới**:
  - `citizenIdentificationCard` (Số CCCD): STRING, unique, độ dài 9-12 ký tự
  - `dateOfBirth` (Ngày sinh): DATEONLY
- **Thêm role mới**: 'citizen' (người dân)
- **Dữ liệu mẫu**: Đã thêm 4 tài khoản citizen (citizen1-4, mật khẩu: citizen123)

### 2. Model ComplaintCategory (Mới)
Tạo bảng mới để quản lý danh mục phản ánh với 6 loại mặc định:
1. Hạ tầng - đô thị
2. Vệ sinh môi trường
3. An ninh - Trật tự
4. Hành chính - chính sách
5. Trật tự xây dựng
6. Đời sống xã hội

### 3. Cập nhật model Complaint
- **ID**: Đổi sang INTEGER với auto_increment
- **Cập nhật trạng thái** (status enum):
  - `submitted`: Đã phản ánh
  - `acknowledged`: Đã tiếp nhận phản ảnh
  - `forwarded`: Đang gửi lên cấp trên
  - `answered`: Đã nhận được câu trả lời
- **Thay đổi cấu trúc**:
  - Bỏ `submittedBy` (array)
  - Thêm `submitterName`: Tên người phản ánh
  - Thêm `submitterPhone`: Số điện thoại
  - Thêm `submitterAddress`: Địa chỉ
  - Thêm `submissionDate`: Ngày phản ánh
  - Thêm `categoryId`: Tham chiếu đến ComplaintCategory

### 4. Cập nhật các model khác
- Household, Population, TemporaryResidence: Đổi ID sang INTEGER

## Tính Năng Mới - Frontend

### 1. Trang Đăng Ký (/register)
**Đường dẫn**: http://localhost:3000/register

**Các trường nhập liệu**:
- Họ và tên (bắt buộc)
- Ngày sinh (bắt buộc)
- Số CCCD (bắt buộc, 9-12 ký tự)
- Email (bắt buộc)
- Số điện thoại
- Tên đăng nhập (bắt buộc)
- Mật khẩu (bắt buộc, tối thiểu 6 ký tự)
- Xác nhận mật khẩu (bắt buộc)
- **Xác thực CAPTCHA** (Google reCAPTCHA v2)

**Lưu ý**: 
- Người dùng đăng ký sẽ có role mặc định là 'citizen'
- Sau khi đăng ký thành công, sẽ tự động chuyển về trang đăng nhập

### 2. Trang Gửi Phản Ánh/Kiến Nghị (/complaints/new)
**Đường dẫn**: http://localhost:3000/complaints/new

**Đặc điểm**:
- Công khai, không cần đăng nhập
- Người dân có thể gửi phản ánh trực tiếp đến tổ trưởng

**Các trường nhập liệu**:
- Họ và tên người phản ánh (bắt buộc)
- Số điện thoại
- Địa chỉ
- Ngày phản ánh (bắt buộc, mặc định là ngày hiện tại)
- Phân loại (bắt buộc, chọn từ dropdown)
- Tiêu đề (bắt buộc)
- Nội dung phản ánh (bắt buộc)
- **Xác thực CAPTCHA** (Google reCAPTCHA v2)

**Trạng thái ban đầu**: Tự động set là "Đã phản ánh" (submitted)

### 3. Cập nhật Trang Quản Lý Phản Ánh (/complaints)
**Cải tiến**:
- Hiển thị các trạng thái mới
- Tổ trưởng có thể cập nhật trạng thái thành:
  - Đã tiếp nhận
  - Đã gửi lên cấp trên
  - Đã có câu trả lời
- Chức năng gộp các phản ánh giống nhau vẫn hoạt động
- Hiển thị tên danh mục phản ánh từ ComplaintCategory

## Cấu Hình

### Backend
Không cần thay đổi cấu hình, sử dụng database PostgreSQL như cũ.

### Frontend - Google reCAPTCHA
Tạo file `.env` trong thư mục `frontend/` với nội dung:

```
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

**Lưu ý**: 
- Đã sử dụng test key mặc định: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- Để production, cần đăng ký site key tại: https://www.google.com/recaptcha/admin

## Cách Chạy Hệ Thống

### 1. Khởi tạo Database
```bash
cd backend
npm install
node seed.js
```

### 2. Chạy Backend
```bash
cd backend
npm start
```

### 3. Chạy Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tài Khoản Mẫu

### Admin
- Username: `admin`
- Password: `admin123`

### Tổ trưởng
- Username: `leader`
- Password: `leader123`

### Người dân (Citizens)
- Username: `citizen1` đến `citizen4`
- Password: `citizen123`

## API Endpoints Mới

### GET /api/complaints/categories
Lấy danh sách các danh mục phản ánh (public, không cần authentication)

**Response**:
```json
[
  {
    "id": 1,
    "name": "Hạ tầng - đô thị",
    "description": "Phản ánh về cơ sở hạ tầng và đô thị",
    "isActive": true
  },
  ...
]
```

### POST /api/complaints
Tạo phản ánh mới (public, không cần authentication)

**Request Body**:
```json
{
  "submitterName": "Nguyễn Văn A",
  "submitterPhone": "0901234567",
  "submitterAddress": "123 Nguyễn Trãi, Q1",
  "submissionDate": "2024-01-01",
  "categoryId": 1,
  "title": "Tiêu đề phản ánh",
  "description": "Nội dung chi tiết..."
}
```

### POST /api/auth/register
Đăng ký tài khoản mới (public)

**Request Body**:
```json
{
  "fullName": "Nguyễn Văn A",
  "dateOfBirth": "1990-01-01",
  "citizenIdentificationCard": "012345678901",
  "username": "nguyenvana",
  "password": "password123",
  "email": "example@email.com",
  "phone": "0901234567"
}
```

## Lưu Ý Quan Trọng

1. **Migration Database**: Do thay đổi cấu trúc ID từ UUID sang INTEGER, cần chạy lại seed.js để tạo database mới
2. **CAPTCHA**: Hiện tại đang sử dụng test key (chỉ trong development mode), trong môi trường production cần đăng ký key riêng
3. **Security**: 
   - Route /api/complaints (POST) đã được mở public để người dân có thể gửi phản ánh mà không cần đăng nhập
   - **Khuyến nghị**: Nên thêm rate limiting middleware cho route này trong production để tránh spam
   - CAPTCHA đã được tích hợp để giảm thiểu spam từ bot
4. **Seeding**: Database đã có 3 phản ánh mẫu với các trạng thái khác nhau để test
