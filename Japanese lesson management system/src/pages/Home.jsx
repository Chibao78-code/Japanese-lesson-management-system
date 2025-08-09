// pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL;
const LEVEL_OPTIONS = ["All", "N1", "N2", "N3", "N4", "N5"];

export default function Home() {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    axios.get(`${BASE}`).then((res) => {
      const pendingLessons = res.data.filter(
        (lesson) =>
          lesson.isCompleted === false || lesson.isCompleted === "false"
      );
      setLessons(pendingLessons);
      setFilteredLessons(pendingLessons);
    });
  }, []);

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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📚 Pending Lessons</h2>
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
          Found {filteredLessons.length} pending lesson(s)
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

      {/* Lessons Cards */}
      <div className="row">
        {filteredLessons.map((lesson) => (
          <div className="col-md-4 mb-4" key={lesson.id}>
            <div className="card h-100 shadow-sm">
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
                    <span className="text-muted">⏱️ {lesson.estimatedTime} min</span>
                  </p>
                  <Link 
                    to={`/se184280/lessons/${lesson.id}`}
                    className="btn btn-primary btn-sm w-100"
                  >
                    📖 Start Learning
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Messages */}
      {filteredLessons.length === 0 && lessons.length > 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <h4>🔍 No pending lessons found</h4>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        </div>
      )}

      {lessons.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <h4>🎯 All caught up!</h4>
            <p>You have no pending lessons. Great job!</p>
            <Link to="/se184280/add-lesson" className="btn btn-success mt-3">
              📝 Add New Lesson
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
