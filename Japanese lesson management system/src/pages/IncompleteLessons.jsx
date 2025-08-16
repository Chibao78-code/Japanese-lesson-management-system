import { Link } from "react-router-dom";
import useLessons from "../hooks/useLessons";
import { useToast } from "../components/Toast";
import SearchAndFilterControls from "../components/SearchAndFilterControls";

export default function IncompleteLessons() {
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
    toggleLessonCompletion,
    resetFilters,
    LEVEL_OPTIONS,
    totalCount,
    filteredCount
  } = useLessons('incomplete');

  const { showToast, ToastComponent } = useToast();

  const handleMarkComplete = async (lesson) => {
    const success = await toggleLessonCompletion(lesson.id, true);
    if (success) {
      showToast("Đã đánh dấu hoàn thành!", "success");
    } else {
      showToast("Lỗi khi cập nhật trạng thái!", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải bài học chưa hoàn thành...</p>
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
        <h2>📝 Bài học chưa hoàn thành</h2>
        <div className="d-flex gap-2">
          <Link to="/se184280/completed-lessons" className="btn btn-outline-success">
            ✅ Đã hoàn thành
          </Link>
          <Link to="/se184280/add-lesson" className="btn btn-success">
            ➕ Thêm bài học
          </Link>
        </div>
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
        searchPlaceholder="Tìm bài học cần hoàn thành..."
      />

      {/* Lessons Cards */}
      <div className="row">
        {lessons.map((lesson) => (
          <div className="col-md-4 mb-4" key={lesson.id}>
            <div className="card h-100 shadow-sm border-warning">
              <Link to={`/se184280/lessons/${lesson.id}`}>
                <img
                  src={lesson.lessonImage}
                  className="card-img-top"
                  alt={lesson.lessonTitle}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              </Link>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{lesson.lessonTitle}</h5>
                
                {/* Quick Preview */}
                {lesson.content && (
                  <p className="card-text text-muted small">
                    {lesson.content.length > 80 
                      ? `${lesson.content.substring(0, 80)}...` 
                      : lesson.content}
                  </p>
                )}
                
                <div className="mt-auto">
                  <p className="card-text mb-2">
                    <span className="badge bg-info me-2">{lesson.level}</span>
                    <span className="text-muted">⏱️ {lesson.estimatedTime} phút</span>
                  </p>
                  
                  {/* Vocabulary Preview */}
                  {lesson.vocabulary && Array.isArray(lesson.vocabulary) && lesson.vocabulary.length > 0 && (
                    <div className="mb-2">
                      <div className="text-muted small">Từ vựng:</div>
                      <div>
                        {lesson.vocabulary.slice(0, 3).map((word, index) => (
                          <span key={index} className="badge bg-light text-dark me-1 small">
                            {word}
                          </span>
                        ))}
                        {lesson.vocabulary.length > 3 && (
                          <span className="text-muted small">+{lesson.vocabulary.length - 3} từ khác</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="d-flex gap-2">
                    <Link 
                      to={`/se184280/lessons/${lesson.id}`}
                      className="btn btn-primary btn-sm flex-fill"
                    >
                      📖 Bắt đầu học
                    </Link>
                    <button 
                      onClick={() => handleMarkComplete(lesson)}
                      className="btn btn-success btn-sm"
                      title="Đánh dấu hoàn thành"
                    >
                      ✅
                    </button>
                    <Link 
                      to={`/se184280/edit-lesson/${lesson.id}`}
                      className="btn btn-outline-warning btn-sm"
                      title="Chỉnh sửa"
                    >
                      ✏️
                    </Link>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-warning text-dark text-center">
                <small>📝 Chưa hoàn thành</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Messages */}
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
            <h4>🎉 Tuyệt vời! Đã hoàn thành hết rồi!</h4>
            <p>Bạn đã hoàn thành tất cả bài học. Hãy thêm bài học mới để tiếp tục học tập.</p>
            <Link to="/se184280/add-lesson" className="btn btn-success mt-3">
              ➕ Thêm bài học mới
            </Link>
          </div>
        </div>
      )}

      <ToastComponent />
    </div>
  );
}