import React from 'react';

const SearchAndFilterControls = ({
  searchTerm,
  setSearchTerm,
  selectedLevel,
  setSelectedLevel,
  sortBy,
  setSortBy,
  resetFilters,
  LEVEL_OPTIONS,
  totalCount,
  filteredCount,
  searchPlaceholder = "Tìm kiếm theo tên, nội dung, từ vựng..."
}) => {
  return (
    <>
      {/* Search and Filter Controls */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <label className="form-label">🔍 Tìm kiếm nâng cao:</label>
          <input
            type="text"
            className="form-control"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="form-text">
            Tìm kiếm trong tiêu đề, nội dung, từ vựng và ngữ pháp
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">📊 Lọc theo cấp độ:</label>
          <select
            className="form-select"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            {LEVEL_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">🔄 Sắp xếp theo:</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="title">Tên A-Z</option>
            <option value="time">Thời gian (Ngắn → Dài)</option>
          </select>
        </div>
        <div className="col-md-2 mb-3 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={resetFilters}
          >
            🔄 Đặt lại
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-3">
        <span className="badge bg-info me-2">
          Hiển thị {filteredCount} / {totalCount} bài học
        </span>
        {searchTerm && (
          <span className="badge bg-secondary me-2">
            Tìm kiếm: "{searchTerm}"
          </span>
        )}
        {selectedLevel !== "All" && (
          <span className="badge bg-primary me-2">
            Cấp độ: {selectedLevel}
          </span>
        )}
      </div>
    </>
  );
};

export default SearchAndFilterControls;
