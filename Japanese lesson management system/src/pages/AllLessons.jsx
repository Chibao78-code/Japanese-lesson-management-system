// pages/AllLessons.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL;
const LEVEL_OPTIONS = ["All", "N1", "N2", "N3", "N4", "N5"];

export default function AllLessons() {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const fetch = () => {
    axios.get(`${BASE}`).then((res) => {
      const data = res.data.sort((a, b) => b.id - a.id);
      setLessons(data);
      setFilteredLessons(data);
    });
  };

  useEffect(fetch, []);

  // Filter and search effect
  useEffect(() => {
    let filtered = lessons;

    // Filter by search term (lesson title)
    if (searchTerm.trim()) {
      filtered = filtered.filter((lesson) =>
        lesson.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by level
    if (selectedLevel !== "All") {
      filtered = filtered.filter((lesson) => lesson.level === selectedLevel);
    }

    // Sort lessons
    if (sortBy === "newest") {
      filtered = filtered.sort((a, b) => b.id - a.id);
    } else if (sortBy === "oldest") {
      filtered = filtered.sort((a, b) => a.id - b.id);
    } else if (sortBy === "title") {
      filtered = filtered.sort((a, b) => 
        a.lessonTitle.localeCompare(b.lessonTitle)
      );
    } else if (sortBy === "time") {
      filtered = filtered.sort((a, b) => a.estimatedTime - b.estimatedTime);
    }

    setFilteredLessons(filtered);
  }, [lessons, searchTerm, selectedLevel, sortBy]);

  const handleDelete = (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;
    axios.delete(`${BASE}/${id}`).then(() => {
      alert("Đã xóa!");
      fetch();
    });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📚 All Lessons</h2>
        <Link to="/se184280/add-lesson" className="btn btn-success">
          + Add Lesson
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <label className="form-label">🔍 Search by title:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter lesson title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">📊 Filter by level:</label>
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
          <label className="form-label">🔄 Sort by:</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="time">Duration (Short to Long)</option>
          </select>
        </div>
        <div className="col-md-2 mb-3 d-flex align-items-end">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setSearchTerm("");
              setSelectedLevel("All");
              setSortBy("newest");
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-3">
        <span className="badge bg-info me-2">
          Found {filteredLessons.length} lesson(s)
        </span>
        {searchTerm && (
          <span className="badge bg-secondary me-2">
            Search: "{searchTerm}"
          </span>
        )}
        {selectedLevel !== "All" && (
          <span className="badge bg-primary me-2">
            Level: {selectedLevel}
          </span>
        )}
      </div>

      {/* Lessons Table */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Level</th>
              <th>Time (min)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLessons.map((lesson) => (
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
                      ? "✅ Completed"
                      : "📝 Incomplete"}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/se184280/edit-lesson/${lesson.id}`}
                    className="btn btn-warning btn-sm me-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(lesson.id);
                    }}
                    className="btn btn-danger btn-sm"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results Message */}
      {filteredLessons.length === 0 && lessons.length > 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <h4>🔍 No lessons found</h4>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        </div>
      )}

      {lessons.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <h4>📚 No lessons available</h4>
            <p>Start by adding your first lesson!</p>
          </div>
        </div>
      )}
    </div>
  );
}
