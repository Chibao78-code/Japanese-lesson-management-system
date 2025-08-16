import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useToast } from "../components/Toast";

const BASE = import.meta.env.VITE_API_BASE_URL;
const LEVEL_OPTIONS = ["N1", "N2", "N3", "N4", "N5"];

export default function EditLesson() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const nav = useNavigate();
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(`${BASE}/${id}`);
        const lesson = response.data;
        setData({
          lessonTitle: lesson.lessonTitle,
          lessonImage: lesson.lessonImage,
          level: lesson.level,
          estimatedTime: lesson.estimatedTime?.toString(),
          content: lesson.content || "",
          vocabulary: Array.isArray(lesson.vocabulary) 
            ? lesson.vocabulary.join(', ') 
            : lesson.vocabulary || "",
          grammar: lesson.grammar || "",
          isCompleted: lesson.isCompleted === true || lesson.isCompleted === "true",
        });
        setImagePreview(lesson.lessonImage);
      } catch (err) {
        console.error(err);
        showToast("Lỗi khi tải dữ liệu bài học", "error");
        nav(-1);
      }
    };

    fetchLesson();
  }, [id, nav]);

  const validate = () => {
    const e = {};
    
    // Lesson title validation
    if (!data.lessonTitle.trim()) {
      e.lessonTitle = "Tên bài học là bắt buộc";
    } else if (data.lessonTitle.trim().length < 10) {
      e.lessonTitle = "Tên bài học phải có ít nhất 10 ký tự";
    }

    // Image URL validation
    if (!data.lessonImage.trim()) {
      e.lessonImage = "URL hình ảnh là bắt buộc";
    } else {
      try {
        new URL(data.lessonImage.trim());
      } catch {
        e.lessonImage = "URL hình ảnh không hợp lệ";
      }
    }

    // Level validation
    if (!data.level) e.level = "Cấp độ là bắt buộc";

    // Estimated time validation
    if (!data.estimatedTime.trim()) {
      e.estimatedTime = "Thời gian học là bắt buộc";
    } else if (isNaN(+data.estimatedTime) || +data.estimatedTime <= 0 || +data.estimatedTime > 300) {
      e.estimatedTime = "Thời gian học phải từ 1-300 phút";
    }

    // Content validation
    if (!data.content.trim()) {
      e.content = "Nội dung bài học là bắt buộc";
    } else if (data.content.trim().length < 20) {
      e.content = "Nội dung bài học phải có ít nhất 20 ký tự";
    }

    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    // Update image preview
    if (name === "lessonImage" && value.trim()) {
      try {
        new URL(value.trim());
        setImagePreview(value.trim());
      } catch {
        setImagePreview("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Process vocabulary (convert comma-separated string to array)
      const vocabularyArray = data.vocabulary.trim() 
        ? data.vocabulary.split(',').map(word => word.trim()).filter(word => word)
        : [];

      await axios.put(`${BASE}/${id}`, {
        ...data,
        vocabulary: vocabularyArray,
        isCompleted: !!data.isCompleted,
        estimatedTime: +data.estimatedTime,
      });
      
      showToast("Cập nhật bài học thành công!", "success");
      setTimeout(() => nav("/se184280/all-lessons"), 1500);
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi cập nhật bài học. Vui lòng thử lại!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải dữ liệu bài học...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-warning text-dark">
              <h2 className="mb-0">✏️ Chỉnh sửa bài học</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                  {/* Left Column */}
                  <div className="col-md-6">
                    {/* Lesson Title */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        📚 Tên bài học <span className="text-danger">*</span>
                      </label>
                      <input
                        name="lessonTitle"
                        type="text"
                        className={`form-control ${errors.lessonTitle ? 'is-invalid' : ''}`}
                        value={data.lessonTitle}
                        onChange={handleChange}
                        placeholder="VD: Hiragana cơ bản - あいうえお"
                      />
                      {errors.lessonTitle && (
                        <div className="invalid-feedback">{errors.lessonTitle}</div>
                      )}
                    </div>

                    {/* Level & Time */}
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">
                            📊 Cấp độ <span className="text-danger">*</span>
                          </label>
                          <select
                            name="level"
                            className={`form-select ${errors.level ? 'is-invalid' : ''}`}
                            value={data.level}
                            onChange={handleChange}
                          >
                            {LEVEL_OPTIONS.map((l) => (
                              <option key={l} value={l}>
                                {l}
                              </option>
                            ))}
                          </select>
                          {errors.level && <div className="invalid-feedback">{errors.level}</div>}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">
                            ⏱️ Thời gian (phút) <span className="text-danger">*</span>
                          </label>
                          <input
                            name="estimatedTime"
                            type="number"
                            min="1"
                            max="300"
                            className={`form-control ${errors.estimatedTime ? 'is-invalid' : ''}`}
                            value={data.estimatedTime}
                            onChange={handleChange}
                            placeholder="30"
                          />
                          {errors.estimatedTime && (
                            <div className="invalid-feedback">{errors.estimatedTime}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        📖 Nội dung bài học <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="content"
                        rows="4"
                        className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                        value={data.content}
                        onChange={handleChange}
                        placeholder="Mô tả chi tiết nội dung sẽ học trong bài..."
                      />
                      {errors.content && (
                        <div className="invalid-feedback">{errors.content}</div>
                      )}
                    </div>

                    {/* Vocabulary */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">📝 Từ vựng</label>
                      <textarea
                        name="vocabulary"
                        rows="3"
                        className="form-control"
                        value={data.vocabulary}
                        onChange={handleChange}
                        placeholder="Nhập từ vựng, phân cách bằng dấu phẩy. VD: あ, い, う, え, お"
                      />
                      <div className="form-text">
                        Nhập các từ vựng phân cách bằng dấu phẩy
                      </div>
                    </div>

                    {/* Grammar */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">📚 Ngữ pháp</label>
                      <textarea
                        name="grammar"
                        rows="3"
                        className="form-control"
                        value={data.grammar}
                        onChange={handleChange}
                        placeholder="Mô tả ngữ pháp chính trong bài học..."
                      />
                    </div>

                    {/* Completion Status */}
                    <div className="form-check mb-3">
                      <input
                        name="isCompleted"
                        type="checkbox"
                        className="form-check-input"
                        checked={data.isCompleted}
                        onChange={handleChange}
                        id="chkCompleted"
                      />
                      <label className="form-check-label fw-bold" htmlFor="chkCompleted">
                        ✅ Đánh dấu đã hoàn thành
                      </label>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-md-6">
                    {/* Image URL */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        🖼️ URL hình ảnh <span className="text-danger">*</span>
                      </label>
                      <input
                        name="lessonImage"
                        type="url"
                        className={`form-control ${errors.lessonImage ? 'is-invalid' : ''}`}
                        value={data.lessonImage}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                      />
                      {errors.lessonImage && (
                        <div className="invalid-feedback">{errors.lessonImage}</div>
                      )}
                    </div>

                    {/* Image Preview */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">👁️ Xem trước hình ảnh</label>
                      <div className="border rounded p-3 text-center" style={{ minHeight: "200px" }}>
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                            onError={() => setImagePreview("")}
                          />
                        ) : (
                          <div className="text-muted d-flex align-items-center justify-content-center h-100">
                            <div>
                              <i className="bi bi-image" style={{ fontSize: "3rem" }}></i>
                              <p className="mt-2">Nhập URL hình ảnh để xem trước</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex justify-content-between pt-3 border-top">
                  <button 
                    type="button"
                    onClick={() => nav(-1)}
                    className="btn btn-secondary"
                    disabled={isLoading}
                  >
                    ← Quay lại
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-warning"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Đang cập nhật...
                      </>
                    ) : (
                      "✏️ Cập nhật bài học"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastComponent />
    </div>
  );
}