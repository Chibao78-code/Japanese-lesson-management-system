# 📚 Japanese Lesson Management System

Hệ thống quản lý bài học tiếng Nhật được xây dựng với React + Vite. Ứng dụng cho phép quản lý và theo dõi tiến độ học tập các bài học tiếng Nhật.

## ✨ Tính năng

- 🏠 **Trang chủ**: Hiển thị bài học đang chờ học
- 📖 **Quản lý bài học**: Thêm, sửa, xóa bài học
- ✅ **Theo dõi tiến độ**: Đánh dấu bài học đã hoàn thành/chưa hoàn thành
- 🔍 **Tìm kiếm & lọc**: Tìm kiếm theo từ khóa, lọc theo cấp độ N1-N5
- 📊 **Sắp xếp**: Theo ngày tạo, tiêu đề, thời gian học
- ⌨️ **Phím tắt**: Điều hướng nhanh bằng keyboard
- 📱 **Responsive**: Hỗ trợ đầy đủ trên mobile và desktop

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn

### Các bước cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd japanese-lesson-management-system
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Cấu hình environment**
- File `.env` đã được thiết lập với MockAPI
- Có thể thay đổi `VITE_API_BASE_URL` trong file `.env` nếu cần

4. **Chạy ứng dụng**
```bash
# Development mode
npm run dev

# Build production
npm run build

# Preview production build  
npm run preview

# Lint code
npm run lint
```

5. **Truy cập ứng dụng**
- Development: http://localhost:5173
- Hoặc theo URL được hiển thị trong terminal

## 🎯 Cách sử dụng

### Phím tắt
- `Ctrl+H`: Trang chủ
- `Ctrl+A`: Tất cả bài học  
- `Ctrl+C`: Bài học đã hoàn thành
- `Ctrl+I`: Bài học chưa hoàn thành
- `Ctrl+N`: Thêm bài học mới
- `/`: Focus vào ô tìm kiếm
- `Esc`: Hủy focus

### Quản lý bài học
1. **Thêm bài học**: Nhấn "➕ Thêm bài học" hoặc `Ctrl+N`
2. **Chỉnh sửa**: Nhấn biểu tượng ✏️ trên bài học
3. **Xóa**: Nhấn biểu tượng 🗑️ và xác nhận
4. **Đánh dấu hoàn thành**: Nhấn ✅ trên bài học

### Tìm kiếm & Lọc
- **Tìm kiếm**: Nhập từ khóa vào ô tìm kiếm (hỗ trợ tìm trong tiêu đề, nội dung, từ vựng, ngữ pháp)
- **Lọc theo cấp độ**: Chọn N1, N2, N3, N4, N5 hoặc "All"
- **Sắp xếp**: Theo mới nhất, cũ nhất, tiêu đề, thời gian học

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19, React Router DOM 7
- **Build Tool**: Vite 7  
- **UI Framework**: Bootstrap 5.3
- **HTTP Client**: Axios
- **Linting**: ESLint 9
- **Backend**: MockAPI (cloud database)

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Các component tái sử dụng
│   ├── ConfirmModal.jsx
│   ├── KeyboardShortcutsHelp.jsx
│   ├── Navbar.jsx
│   ├── SearchAndFilterControls.jsx
│   └── Toast.jsx
├── hooks/               # Custom React hooks
│   ├── useDebounce.js
│   ├── useKeyboardShortcuts.js
│   └── useLessons.js
├── pages/               # Các trang chính
│   ├── AddLesson.jsx
│   ├── AllLessons.jsx
│   ├── CompletedLessons.jsx
│   ├── EditLesson.jsx
│   ├── Home.jsx
│   ├── IncompleteLessons.jsx
│   └── LessonDetail.jsx
├── App.jsx              # Component gốc
└── main.jsx             # Entry point
```

## 🔧 API Endpoints

Ứng dụng sử dụng MockAPI với các endpoints:

- `GET /lessons` - Lấy danh sách tất cả bài học
- `GET /lessons/:id` - Lấy chi tiết bài học
- `POST /lessons` - Tạo bài học mới
- `PUT /lessons/:id` - Cập nhật bài học
- `PATCH /lessons/:id` - Cập nhật một phần bài học  
- `DELETE /lessons/:id` - Xóa bài học

## 🐛 Các sửa chữa đã thực hiện

### Vấn đề đã sửa:
1. ✅ **Routing**: Sửa route "/" để sử dụng Home.jsx thay vì AllLessons.jsx
2. ✅ **Filter logic**: Thống nhất logic filter 'pending' và 'incomplete' 
3. ✅ **API variables**: Chuẩn hóa tên biến API từ `BASE_URL` thành `BASE`
4. ✅ **Error handling**: Cải thiện xử lý lỗi với messages cụ thể hơn
5. ✅ **Image fallback**: Thêm fallback image khi load lỗi
6. ✅ **Data validation**: Thêm validation cho API response

### Cải tiến thêm:
- Performance optimization với React.memo và useCallback
- Debounce search để giảm API calls
- Loading states tốt hơn
- Responsive design hoàn thiện
- Keyboard shortcuts toàn diện

## 📝 Lưu ý

- Dữ liệu được lưu trữ trên MockAPI (cloud)
- Ứng dụng hỗ trợ đầy đủ tiếng Việt
- Thiết kế responsive, tương thích mobile
- Code đã được optimize cho performance

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

MIT License