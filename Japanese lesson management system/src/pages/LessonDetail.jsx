import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../components/Toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/${id}`);
        setLesson(response.data);
        setError(null);
      } catch (err) {
        setError("Không thể tải bài học. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleToggleCompletion = async () => {
    try {
      const newStatus = !(lesson.isCompleted === true || lesson.isCompleted === "true");
      await axios.patch(`${BASE_URL}/${lesson.id}`, { isCompleted: newStatus });
      setLesson(prev => ({ ...prev, isCompleted: newStatus }));
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi cập nhật trạng thái bài học", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải bài học...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger text-center">
          <h4>❌ Lỗi</h4>
          <p>{error}</p>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-secondary"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning text-center">
          <h4>📚 Không tìm thấy bài học</h4>
          <p>Bài học với ID {id} không tồn tại.</p>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-secondary"
          >
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-10 mx-auto">
          {/* Header Card */}
          <div className="card shadow-lg mb-4">
            <div className="card-header text-white" style={{background: "linear-gradient(45deg, #4285f4, #34a853)"}}>
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">📚 Chi tiết bài học</h2>
                <span className={`badge ${lesson.isCompleted === true || lesson.isCompleted === "true" ? "bg-success" : "bg-warning text-dark"} fs-6`}>
                  {lesson.isCompleted === true || lesson.isCompleted === "true" ? "✅ Đã hoàn thành" : "📝 Chưa hoàn thành"}
                </span>
              </div>
            </div>
            
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <img
                    src={lesson.lessonImage}
                    alt={lesson.lessonTitle}
                    className="img-fluid rounded shadow"
                    style={{ width: "100%", height: "250px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-8">
                  <h3 className="text-primary mb-3">{lesson.lessonTitle}</h3>
                  
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="bg-light p-3 rounded">
                        <strong>📊 Cấp độ:</strong>
                        <br />
                        <span className="badge bg-info ms-3 mt-1">{lesson.level}</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="bg-light p-3 rounded">
                        <strong>⏱️ Thời gian học:</strong>
                        <br />
                        <span className="text-primary ms-3">{lesson.estimatedTime} phút</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="row g-4">
            {/* Lesson Content */}
            {lesson.content && (
              <div className="col-lg-6">
                <div className="card h-100 shadow">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">📖 Nội dung bài học</h5>
                  </div>
                  <div className="card-body">
                    <p className="card-text">{lesson.content}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Vocabulary */}
            {lesson.vocabulary && lesson.vocabulary.length > 0 && (
              <div className="col-lg-6">
                <div className="card h-100 shadow">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">📝 Từ vựng</h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-2">
                      {lesson.vocabulary.map((word, index) => (
                        <div key={index} className="col-auto">
                          <span className="badge bg-light text-dark border fs-6 p-2">{word}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grammar */}
            {lesson.grammar && (
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header bg-warning text-dark">
                    <h5 className="mb-0">📚 Ngữ pháp</h5>
                  </div>
                  <div className="card-body">
                    <p className="card-text">{lesson.grammar}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="card mt-4 shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <button 
                  onClick={() => window.history.back()} 
                  className="btn btn-secondary"
                >
                  ← Quay lại
                </button>
                
                <div className="d-flex gap-2">
                  <a 
                    href={`/se184280/edit-lesson/${lesson.id}`} 
                    className="btn btn-warning"
                  >
                    ✏️ Chỉnh sửa
                  </a>
                  <button 
                    onClick={handleToggleCompletion}
                    className={`btn ${lesson.isCompleted === true || lesson.isCompleted === "true" ? "btn-outline-warning" : "btn-success"}`}
                  >
                    {lesson.isCompleted === true || lesson.isCompleted === "true" 
                      ? "📝 Đánh dấu chưa hoàn thành" 
                      : "✅ Đánh dấu hoàn thành"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastComponent />
    </div>
  );
}