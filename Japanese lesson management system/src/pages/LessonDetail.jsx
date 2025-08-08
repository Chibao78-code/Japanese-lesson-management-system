import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/${id}`).then((res) => setLesson(res.data));
  }, [id]);

  if (!lesson) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">📚 Lesson Detail</h2>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <img
                    src={lesson.lessonImage}
                    alt={lesson.lessonTitle}
                    className="img-fluid rounded shadow-sm"
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-8">
                  <h3 className="text-primary">{lesson.lessonTitle}</h3>
                  
                  <div className="mb-3">
                    <span className={`badge ${lesson.isCompleted === true || lesson.isCompleted === "true" ? "bg-success" : "bg-warning text-dark"} fs-6`}>
                      {lesson.isCompleted === true || lesson.isCompleted === "true" ? "✅ Completed" : "📝 Incomplete"}
                    </span>
                  </div>

                  <div className="row mb-2">
                    <div className="col-sm-4">
                      <strong>ID:</strong>
                    </div>
                    <div className="col-sm-8">
                      {lesson.id}
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-sm-4">
                      <strong>Level:</strong>
                    </div>
                    <div className="col-sm-8">
                      <span className="badge bg-info">{lesson.level}</span>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-sm-4">
                      <strong>Estimated Time:</strong>
                    </div>
                    <div className="col-sm-8">
                      ⏱️ {lesson.estimatedTime} minutes
                    </div>
                  </div>

                  {lesson.description && (
                    <div className="row mb-2">
                      <div className="col-sm-4">
                        <strong>Description:</strong>
                      </div>
                      <div className="col-sm-8">
                        {lesson.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <button 
                  onClick={() => window.history.back()} 
                  className="btn btn-secondary"
                >
                  ← Back
                </button>
                <div>
                  <a 
                    href={`/se184280/edit-lesson/${lesson.id}`} 
                    className="btn btn-warning me-2"
                  >
                    ✏️ Edit Lesson
                  </a>
                  <button 
                    onClick={() => {
                      // Toggle completion status
                      const newStatus = !(lesson.isCompleted === true || lesson.isCompleted === "true");
                      axios.patch(`${BASE_URL}/${lesson.id}`, { isCompleted: newStatus })
                        .then(() => {
                          window.location.reload();
                        });
                    }}
                    className={`btn ${lesson.isCompleted === true || lesson.isCompleted === "true" ? "btn-warning" : "btn-success"}`}
                  >
                    {lesson.isCompleted === true || lesson.isCompleted === "true" ? "📝 Mark as Incomplete" : "✅ Mark as Complete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
