import { Link } from "react-router-dom";
import useLessons from "../hooks/useLessons";
import { useToast } from "../components/Toast";
import SearchAndFilterControls from "../components/SearchAndFilterControls";

export default function CompletedLessons() {
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
    resetFilters,
    LEVEL_OPTIONS,
    totalCount,
    filteredCount
  } = useLessons('completed');

  const { showToast, ToastComponent } = useToast();

  if (isLoading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải bài học đã hoàn thành...</p>
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
        <h2>✅ Bài học đã hoàn thành</h2>
        <div className="d-flex gap-2">
          <Link to="/se184280/incomplete-lessons" className="btn btn-outline-warning">
            📝 Chưa hoàn thành
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
        searchPlaceholder="Tìm bài học đã hoàn thành..."
      />

      {/* Lessons Cards */}
      <div className="row">
        {lessons.map((lesson) => (
          <div className="col-md-4 mb-4" key={lesson.id}>
            <div className="card h-100 shadow-sm border-success">
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
                <div className="mt-auto">
                  <p className="card-text mb-2">
                    <span className="badge bg-info me-2">{lesson.level}</span>
                    <span className="text-muted">⏱️ {lesson.estimatedTime} phút</span>
                  </p>
                  <div className="d-flex gap-2">
                    <Link 
                      to={`/se184280/lessons/${lesson.id}`}
                      className="btn btn-success btn-sm flex-fill"
                    >
                      📖 Xem lại
                    </Link>
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
              <div className="card-footer bg-success text-white text-center">
                <small>✅ Đã hoàn thành</small>
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
            <h4>🎯 Chưa hoàn thành bài học nào!</h4>
            <p>Hãy bắt đầu học và hoàn thành một số bài học.</p>
            <Link to="/se184280/incomplete-lessons" className="btn btn-primary mt-3">
              📝 Xem bài học chưa hoàn thành
            </Link>
          </div>
        </div>
      )}

      <ToastComponent />
    </div>
  );
}