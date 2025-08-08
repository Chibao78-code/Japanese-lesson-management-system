import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function CompletedLessons() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios.get(`${BASE}`).then((res) => {
      const completed = res.data
        .filter((a) => a.isCompleted === true || a.isCompleted === "true")
        .sort((a, b) => b.id - a.id);
      setLessons(completed);
    });
  }, []);

  return (
    <div className="container py-4">
      <h2>✅ Completed Lessons</h2>
      <div className="list-group mt-3">
        {lessons.map((a) => (
          <Link
            to={`/se184280/lessons/${a.id}`}
            key={a.id}
            className="list-group-item list-group-item-action d-flex align-items-center"
          >
            <img
              src={a.lessonImage}
              alt={a.lessonTitle}
              width="60"
              height="60"
              style={{ objectFit: "cover", borderRadius: "5px" }}
              className="me-3"
            />
            <div>
              <div className="fw-bold">{a.lessonTitle}</div>
              <small className="text-muted">Level: {a.level}</small>
            </div>
          </Link>
        ))}
        {lessons.length === 0 && (
          <p className="text-muted text-center">No completed lessons found.</p>
        )}
      </div>
    </div>
  );
}
