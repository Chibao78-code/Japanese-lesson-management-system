import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL;
const LEVEL_OPTIONS = ["All", "N1", "N2", "N3", "N4", "N5"];

export default function CompletedLessons() {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    axios.get(`${BASE}`).then((res) => {
      const completed = res.data
        .filter((a) => a.isCompleted === true || a.isCompleted === "true")
        .sort((a, b) => b.id - a.id);
      setLessons(completed);
      setFilteredLessons(completed);
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
      <h2>✅ Completed Lessons</h2>

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
        <span className="badge bg-success me-2">
          Found {filteredLessons.length} completed lesson(s)
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

      {/* Completed Lessons List */}
      <div className="list-group">
        {filteredLessons.map((lesson) => (
          <Link
            to={`/se184280/lessons/${lesson.id}`}
            key={lesson.id}
            className="list-group-item list-group-item-action d-flex align-items-center hover-shadow"
          >
            <img
              src={lesson.lessonImage}
              alt={lesson.lessonTitle}
              width="60"
              height="60"
              style={{ objectFit: "cover", borderRadius: "8px" }}
              className="me-3"
            />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-bold mb-1">{lesson.lessonTitle}</div>
                  <div>
                    <span className="badge bg-info me-2">{lesson.level}</span>
                    <small className="text-muted">⏱️ {lesson.estimatedTime} min</small>
                  </div>
                </div>
                <span className="badge bg-success">✅ Completed</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results Messages */}
      {filteredLessons.length === 0 && lessons.length > 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <h4>🔍 No completed lessons found</h4>
            <p>Try adjusting your search criteria or filters.</p>
          </div>
        </div>
      )}

      {lessons.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <h4>📋 No completed lessons yet</h4>
            <p>Complete some lessons to see them here!</p>
            <Link to="/se184280/incomplete-lessons" className="btn btn-primary mt-3">
              📝 View Pending Lessons
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
