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
      <h2>Lesson Detail</h2>
      <p>
        <strong>ID:</strong> {lesson.id}
      </p>
      <p>
        <strong>Name:</strong> {lesson.name}
      </p>
      <p>
        <strong>Status:</strong> {lesson.completed ? "Completed" : "Incomplete"}
      </p>
    </div>
  );
}
