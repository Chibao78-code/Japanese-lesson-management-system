// pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios.get(`${BASE}`).then((res) => {
      const pendingLessons = res.data.filter(
        (lesson) =>
          lesson.isCompleted === false || lesson.isCompleted === "false"
      );
      setLessons(pendingLessons);
    });
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📚 Pending Lessons</h2>
        <Link to="/se184280 /lessons/create" className="btn btn-success">
          + Add Lesson
        </Link>
      </div>

      <div className="row">
        {lessons.map((lesson) => (
          <div className="col-md-4 mb-4" key={lesson.id}>
            <div className="card h-100 shadow-sm">
              <Link to={`/se184280 /lessons/${lesson.id}`}>
                <img
                  src={lesson.lessonImage}
                  className="card-img-top"
                  alt={lesson.lessonTitle}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{lesson.lessonTitle}</h5>
                <p className="card-text">📘 Level: {lesson.level}</p>
                <p className="card-text">⏱️ Time: {lesson.estimatedTime} min</p>
              </div>
            </div>
          </div>
        ))}
        {lessons.length === 0 && (
          <p className="text-muted text-center">No pending lessons found.</p>
        )}
      </div>
    </div>
  );
}
