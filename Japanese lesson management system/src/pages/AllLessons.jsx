// pages/AllLessons.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function AllLessons() {
  const [lessons, setLessons] = useState([]);

  const fetch = () => {
    axios.get(`${BASE}`).then((res) => {
      const data = res.data.sort((a, b) => b.id - a.id);
      setLessons(data);
    });
  };

  useEffect(fetch, []);

  const handleDelete = (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;
    axios.delete(`${BASE}/${id}`).then(() => {
      alert("Đã xóa!");
      fetch();
    });
  };

  return (
    <div>
      <h2>All Lessons</h2>
      <table className="table table-hover mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Level</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((a) => (
            <tr
              key={a.id}
              onClick={() =>
                (window.location.href = `/se184280 /lessons/${a.id}`)
              }
            >
              <td>{a.id}</td>
              <td>{a.lessonTitle}</td>
              <td>{a.level}</td>
              <td>{a.estimatedTime}</td>
              <td>
                <Link
                  to={`/se184280 /edit-lesson/${a.id}`}
                  className="btn btn-warning btn-sm me-1"
                >
                  Edit
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(a.id);
                  }}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
