import { Link } from "react-router-dom";
import useLessons from "../hooks/useLessons";
import { useToast } from "../components/Toast";
import { useConfirmModal } from "../components/ConfirmModal";
import SearchAndFilterControls from "../components/SearchAndFilterControls";

export default function AllLessons() {
  const {
    lessons,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedLevel,
    setSelectedLevel,
    sortBy,
    setSortBy,
    deleteLesson,
    resetFilters,
    LEVEL_OPTIONS,
    totalCount,
    filteredCount
  } = useLessons('all');

  const { ToastComponent } = useToast();
  const { showConfirm, ConfirmModalComponent } = useConfirmModal();

  const handleDelete = (lesson) => {
    showConfirm({
      title: "Xóa bài học",
      message: `Bạn có chắc chắn muốn xóa bài học "${lesson.lessonTitle}"? Hành động này không thể hoàn tác.`,
      confirmText: "🗑️ Xóa",
      cancelText: "Hủy",
      type: "danger",
      onConfirm: () => deleteLesson(lesson.id)
    });
  };

  if (isLoading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải danh sách bài học...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center">
          <h4>❌ Lỗi tải dữ liệu</h4>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📚 Tất cả bài học</h2>
        <Link to="/se184280/add-lesson" className="btn btn-success">
          ➕ Thêm bài học
        </Link>
      </div>

      <SearchAndFilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        sortBy={sortBy}
        setSortBy={setSortBy}
        resetFilters={resetFilters}
        LEVEL_OPTIONS={LEVEL_OPTIONS}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />

      {/* Lessons Table */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Cấp độ</th>
              <th>Thời gian (phút)</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr
                key={lesson.id}
                onClick={() =>
                  (window.location.href = `/se184280/lessons/${lesson.id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <td>{lesson.id}</td>
                <td>
                  <strong>{lesson.lessonTitle}</strong>
                </td>
                <td>
                  <span className="badge bg-info">{lesson.level}</span>
                </td>
                <td>{lesson.estimatedTime}</td>
                <td>
                  <span
                    className={`badge ${
                      lesson.isCompleted === true || lesson.isCompleted === "true"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {lesson.isCompleted === true || lesson.isCompleted === "true"
                      ? "✅ Đã hoàn thành"
                      : "📝 Chưa hoàn thành"}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <Link
                      to={`/se184280/edit-lesson/${lesson.id}`}
                      className="btn btn-warning btn-sm"
                      onClick={(e) => e.stopPropagation()}
                      title="Chỉnh sửa"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(lesson);
                      }}
                      className="btn btn-danger btn-sm"
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results Message */}
      {filteredCount === 0 && totalCount > 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <h4>🔍 Không tìm thấy bài học nào</h4>
            <p>Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc.</p>
            <button onClick={resetFilters} className="btn btn-outline-primary">
              🔄 Đặt lại bộ lọc
            </button>
          </div>
        </div>
      )}

      {totalCount === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <h4>📚 Chưa có bài học nào</h4>
            <p>Hãy bắt đầu bằng cách thêm bài học đầu tiên!</p>
            <Link to="/se184280/add-lesson" className="btn btn-success mt-3">
              ➕ Thêm bài học đầu tiên
            </Link>
          </div>
        </div>
      )}

      <ToastComponent />
      <ConfirmModalComponent />
    </div>
  );
}