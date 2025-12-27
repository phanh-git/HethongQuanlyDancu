# Hướng dẫn Sử dụng Hệ thống Quản lý Dân cư

## Mục lục
1. [Đăng nhập](#đăng-nhập)
2. [Tổng quan (Dashboard)](#tổng-quan)
3. [Quản lý Hộ khẩu](#quản-lý-hộ-khẩu)
4. [Quản lý Nhân khẩu](#quản-lý-nhân-khẩu)
5. [Quản lý Tạm trú/Tạm vắng](#quản-lý-tạm-trútạm-vắng)
6. [Quản lý Kiến nghị](#quản-lý-kiến-nghị)
7. [Báo cáo](#báo-cáo)

---

## Đăng nhập

1. Mở trình duyệt và truy cập `http://localhost:3000`
2. Nhập tên đăng nhập và mật khẩu
3. Nhấn nút "Đăng nhập"

**Lưu ý:** Lần đầu sử dụng, cần tạo tài khoản admin qua API (xem README.md)

---

## Tổng quan

Sau khi đăng nhập thành công, bạn sẽ thấy trang Tổng quan với:

### Thẻ Thống kê
- **Tổng số hộ:** Hiển thị tổng số hộ khẩu đang hoạt động
- **Tổng dân số:** Số lượng nhân khẩu hiện tại (không bao gồm người đã qua đời hoặc chuyển đi)
- **Tạm trú:** Số người đang tạm trú
- **Tạm vắng:** Số người đang tạm vắng

### Biểu đồ
- **Phân bố theo độ tuổi:** Biểu đồ tròn hiển thị:
  - Mầm non (< 6 tuổi)
  - Học sinh (6-17 tuổi)
  - Lao động (18-59 tuổi)
  - Nghỉ hưu (≥ 60 tuổi)

- **Phân bố theo giới tính:** Biểu đồ cột hiển thị số lượng nam/nữ

### Cảnh báo
- Danh sách giấy tạm trú sắp hết hạn trong 7 ngày tới (hiển thị với màu đỏ)

---

## Quản lý Hộ khẩu

### Xem danh sách hộ khẩu

1. Nhấn vào menu "Hộ khẩu" ở thanh điều hướng bên trái
2. Danh sách hiển thị các cột:
   - Mã hộ
   - Chủ hộ
   - Số nhà
   - Địa chỉ
   - Số thành viên

### Tìm kiếm hộ khẩu

1. Nhập mã hộ hoặc số nhà vào ô tìm kiếm
2. Kết quả hiển thị tự động

### Thêm hộ khẩu mới

1. Nhấn nút "Thêm hộ khẩu"
2. Nhập thông tin:
   - Chọn chủ hộ (từ danh sách nhân khẩu)
   - Nhập địa chỉ (số nhà, đường, phường, quận, thành phố)
   - Chọn các thành viên
3. Nhấn "Lưu"

**Lưu ý:** 
- Mã hộ sẽ được tự động tạo theo định dạng HK000001, HK000002...
- Chủ hộ phải là một trong các thành viên được chọn

### Xem chi tiết hộ khẩu

1. Nhấn vào biểu tượng "mắt" 👁️ ở cột thao tác
2. Trang chi tiết hiển thị:
   - Thông tin địa chỉ
   - Danh sách nhân khẩu (chủ hộ ở dòng đầu)
   - Lịch sử biến động hộ khẩu

### Tách hộ

1. Vào trang chi tiết hộ khẩu cần tách
2. Nhấn nút "Tách hộ"
3. Chọn các thành viên muốn tách ra
4. Chọn chủ hộ mới
5. Nhập địa chỉ mới
6. Nhấn "Xác nhận"

**Kết quả:**
- Hệ thống tự động tạo hộ khẩu mới với mã hộ mới
- Các thành viên được chuyển sang hộ mới
- Lịch sử tách hộ được ghi nhận ở cả 2 hộ

### Thay đổi chủ hộ

1. Vào trang chỉnh sửa hộ khẩu
2. Chọn chủ hộ mới từ danh sách thành viên
3. Nhấn "Lưu"

**Hệ thống tự động:**
- Cập nhật quan hệ với chủ hộ cũ thành "Khác"
- Cập nhật quan hệ với chủ hộ mới thành "Chủ hộ"
- Ghi lại lịch sử thay đổi

---

## Quản lý Nhân khẩu

### Xem danh sách nhân khẩu

1. Nhấn menu "Nhân khẩu"
2. Danh sách hiển thị:
   - Họ và tên
   - Ngày sinh
   - Giới tính
   - CMND/CCCD
   - Mã hộ khẩu
   - Diện (Thường trú, Tạm trú, Tạm vắng)

### Bộ lọc thông minh

**Tìm kiếm:**
- Nhập tên hoặc số CMND/CCCD vào ô tìm kiếm

**Lọc theo diện:**
- Chọn "Thường trú", "Tạm trú", hoặc "Tạm vắng"

**Lọc theo giới tính:**
- Chọn "Nam" hoặc "Nữ"

### Thêm nhân khẩu mới

#### Trường hợp 1: Trẻ mới sinh

1. Nhấn "Thêm nhân khẩu"
2. Chọn "Mới sinh"
3. Nhập:
   - Họ tên
   - Ngày sinh
   - Giới tính
   - Chọn hộ khẩu
   - Quan hệ với chủ hộ
4. Nhấn "Lưu"

**Hệ thống tự động:**
- Ẩn trường CMND/CCCD
- Ẩn trường nghề nghiệp
- Đặt "Nơi thường trú trước đó" = "Mới sinh"

#### Trường hợp 2: Người từ nơi khác đến

1. Nhấn "Thêm nhân khẩu"
2. Nhập đầy đủ thông tin:
   - Họ tên, bí danh (nếu có)
   - Ngày sinh
   - Giới tính
   - CMND/CCCD, ngày cấp, nơi cấp
   - Quốc tịch, dân tộc, tôn giáo
   - Nguyên quán
   - Nghề nghiệp
   - Trình độ học vấn
   - Hộ khẩu
   - Quan hệ với chủ hộ
   - Nơi thường trú trước đó
   - Ngày đăng ký thường trú
3. Nhấn "Lưu"

### Xem hồ sơ chi tiết

1. Nhấn biểu tượng "mắt" ở cột thao tác
2. Xem đầy đủ thông tin cá nhân

### Cập nhật thông tin

1. Nhấn biểu tượng "bút" ở cột thao tác
2. Chỉnh sửa thông tin cần thiết
3. Nhấn "Lưu"

### Khai tử

1. Vào trang chi tiết nhân khẩu
2. Nhấn "Khai tử"
3. Nhập:
   - Ngày mất
   - Nguyên nhân
4. Nhấn "Xác nhận"

**Kết quả:**
- Nhân khẩu được đánh dấu "Đã qua đời"
- Không còn xuất hiện trong thống kê dân số
- Vẫn lưu trong lịch sử hộ khẩu (dạng gạch chéo)

### Chuyển đi

1. Vào trang chi tiết nhân khẩu
2. Nhấn "Chuyển đi"
3. Nhập:
   - Ngày chuyển
   - Nơi đến
4. Nhấn "Xác nhận"

**Kết quả:**
- Nhân khẩu được đánh dấu "Đã chuyển đi"
- Tự động xóa khỏi danh sách thành viên hộ khẩu
- Ghi lại lịch sử

---

## Quản lý Tạm trú/Tạm vắng

### Đăng ký tạm trú

1. Nhấn menu "Tạm trú/Tạm vắng"
2. Nhấn "Thêm mới"
3. Chọn loại: "Tạm trú"
4. Nhập:
   - Chọn người
   - Ngày bắt đầu
   - Ngày kết thúc
   - Địa chỉ tạm trú
   - Lý do
5. Nhấn "Lưu"

**Hệ thống tự động:**
- Cập nhật trạng thái nhân khẩu thành "Tạm trú"
- Tính toán ngày hết hạn

### Đăng ký tạm vắng

Tương tự tạm trú, nhưng chọn loại "Tạm vắng"

### Cảnh báo hết hạn

**Màu sắc:**
- 🔴 Đỏ: Đã quá hạn
- 🟡 Vàng: Còn 1-7 ngày
- 🟢 Xanh: Còn > 7 ngày

### Gia hạn nhanh

1. Tìm phiếu cần gia hạn
2. Nhấn nút "Gia hạn"
3. Chọn ngày hết hạn mới
4. Nhập lý do gia hạn
5. Nhấn "Xác nhận"

**Hệ thống ghi lại:**
- Ngày hết hạn cũ
- Ngày hết hạn mới
- Lý do gia hạn

---

## Quản lý Kiến nghị

### Tạo phiếu phản ánh

1. Nhấn menu "Kiến nghị"
2. Nhấn "Tạo phiếu"
3. Nhập:
   - Chọn người gửi (có thể chọn nhiều)
   - Phân loại (Môi trường, An ninh, Cơ sở hạ tầng, Xã hội, Khác)
   - Tiêu đề
   - Nội dung chi tiết
   - Mức độ ưu tiên
4. Nhấn "Gửi"

**Hệ thống tự động:**
- Tạo mã phiếu KN000001, KN000002...
- Đặt trạng thái "Tiếp nhận"
- Ghi nhận thời gian

### Gộp kiến nghị trùng lặp

**Tình huống:** 10 người cùng phản ánh "Cống thoát nước hỏng"

1. Tích chọn các phiếu muốn gộp (checkbox)
2. Nhấn nút "Gộp kiến nghị (10)"
3. Hệ thống tự động:
   - Tạo 1 phiếu chính
   - Gộp danh sách 10 người gửi
   - Đánh dấu 9 phiếu còn lại là "Đã gộp"
   - Lưu liên kết giữa các phiếu

### Cập nhật tiến độ

1. Nhấn nút "Cập nhật" trên phiếu
2. Chọn trạng thái mới:
   - Tiếp nhận
   - Đang xử lý
   - Đã giải quyết
   - Từ chối
3. Nhập ghi chú
4. Nếu "Đã giải quyết", nhập kết quả xử lý
5. Nhấn "Lưu"

**Hệ thống ghi lại:**
- Lịch sử thay đổi trạng thái
- Người cập nhật
- Thời gian cập nhật

### Phân công xử lý

1. Vào chi tiết phiếu
2. Nhấn "Phân công"
3. Chọn người xử lý
4. Nhấn "Xác nhận"

---

## Báo cáo

### Xuất danh sách nhân khẩu ra Excel

1. Nhấn menu "Báo cáo"
2. Chọn "Danh sách nhân khẩu"
3. Chọn bộ lọc (nếu cần):
   - Theo độ tuổi (Mầm non, học sinh, lao động, nghỉ hưu)
4. Nhấn "Xuất Excel"
5. File sẽ được tải về tự động

**File Excel bao gồm:**
- Họ và tên
- Ngày sinh
- Tuổi
- Giới tính
- CMND/CCCD
- Mã hộ khẩu
- Địa chỉ

### Báo cáo hàng quý về kiến nghị

1. Chọn "Báo cáo kiến nghị"
2. Chọn năm và quý
3. Nhấn "Xem báo cáo"

**Báo cáo hiển thị:**
- Tổng số kiến nghị
- Số đã giải quyết
- Số đang xử lý
- Tỷ lệ giải quyết
- Phân loại theo danh mục

### Xuất danh sách hộ khẩu

1. Chọn "Danh sách hộ khẩu"
2. Nhấn "Xuất Excel"

**File Excel bao gồm:**
- Mã hộ
- Chủ hộ
- Số nhà
- Địa chỉ đầy đủ
- Số thành viên

---

## Tips & Tricks

### Tìm kiếm nhanh (Live Search)
- Chỉ cần gõ, kết quả hiện ngay không cần nhấn Enter
- Tìm kiếm không phân biệt chữ hoa/thường

### Phân quyền
- **Admin:** Toàn quyền
- **Tổ trưởng/Tổ phó:** Quản lý hộ, nhân khẩu, kiến nghị
- **Cán bộ:** Chỉ xem và cập nhật nhân khẩu

### Responsive
- Có thể sử dụng trên máy tính bảng hoặc điện thoại
- Menu tự động thu gọn trên màn hình nhỏ

### Bảo mật
- Tự động đăng xuất khi hết phiên
- Mật khẩu được mã hóa
- Dữ liệu cá nhân được bảo vệ

---

## Câu hỏi thường gặp (FAQ)

**Q: Làm sao để đổi mật khẩu?**
A: Hiện tại cần liên hệ quản trị viên để đổi mật khẩu.

**Q: Có thể xóa hộ khẩu không?**
A: Không xóa hoàn toàn, chỉ chuyển sang trạng thái "Không hoạt động" để giữ lại lịch sử.

**Q: Giấy tạm trú hết hạn thì sao?**
A: Hệ thống tự động đánh dấu "Đã hết hạn" và hiển thị màu đỏ. Cán bộ cần liên hệ người dân để gia hạn hoặc hủy.

**Q: Có thể khôi phục người đã đánh dấu chuyển đi không?**
A: Có, liên hệ quản trị viên để cập nhật lại trạng thái.

**Q: Làm sao để in báo cáo?**
A: Xuất ra Excel, sau đó dùng Excel để in.

---

## Hỗ trợ

Nếu gặp vấn đề, vui lòng liên hệ:
- Email: support@example.com
- Hotline: 1900-xxxx
