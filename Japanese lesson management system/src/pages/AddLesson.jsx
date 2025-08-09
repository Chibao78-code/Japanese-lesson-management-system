
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL;
const LEVEL_OPTIONS = ["N1", "N2", "N3", "N4", "N5"];

export default function AddLesson() {
  const [data, setData] = useState({
    lessonTitle: "",
    lessonImage: "",
    level: "N5",
    estimatedTime: "",
    isCompleted: false,
  });
  const [errors, setErrors] = useState({});
  const nav = useNavigate();

  const validate = () => {
    const e = {};
    if (!/\w+\s+\w+/.test(data.lessonTitle.trim()))
      e.lessonTitle = "Must contain at least two words";
    try {
      new URL(data.lessonImage.trim());
    } catch {
      e.lessonImage = "Invalid URL";
    }
    if (!data.level) e.level = "Required";
    if (isNaN(+data.estimatedTime) || +data.estimatedTime <= 0)
      e.estimatedTime = "Must be a positive number";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) return setErrors(e2);

    try {
      await axios.post(`${BASE}`, {
        ...data,
        isCompleted: !!data.isCompleted,
        estimatedTime: +data.estimatedTime,
      });
      alert("Added successfully!");
      nav("/se184280 /all-lessons");
    } catch (err) {
      console.error(err);
      alert("Error submitting!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Lesson</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* lessonTitle */}
        <div className="mb-3">
          <label className="form-label">Lesson Title</label>
          <input
            name="lessonTitle"
            type="text"
            className="form-control"
            value={data.lessonTitle}
            onChange={handleChange}
          />
          {errors.lessonTitle && (
            <div className="text-danger">{errors.lessonTitle}</div>
          )}
        </div>
        {/* lessonImage */}
        <div className="mb-3">
          <label className="form-label">Lesson Image URL</label>
          <input
            name="lessonImage"
            type="text"
            className="form-control"
            value={data.lessonImage}
            onChange={handleChange}
          />
          {errors.lessonImage && (
            <div className="text-danger">{errors.lessonImage}</div>
          )}
        </div>
        {/* level */}
        <div className="mb-3">
          <label className="form-label">Level</label>
          <select
            name="level"
            className="form-select"
            value={data.level}
            onChange={handleChange}
          >
            {LEVEL_OPTIONS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          {errors.level && <div className="text-danger">{errors.level}</div>}
        </div>
        {/* estimatedTime */}
        <div className="mb-3">
          <label className="form-label">Estimated Time (minutes)</label>
          <input
            name="estimatedTime"
            type="number"
            className="form-control"
            value={data.estimatedTime}
            onChange={handleChange}
          />
          {errors.estimatedTime && (
            <div className="text-danger">{errors.estimatedTime}</div>
          )}
        </div>
        {/* isCompleted */}
        <div className="form-check mb-3">
          <input
            name="isCompleted"
            type="checkbox"
            className="form-check-input"
            checked={data.isCompleted}
            onChange={handleChange}
            id="chkCompleted"
          />
          <label className="form-check-label" htmlFor="chkCompleted">
            Completed
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Lesson
        </button>
      </form>
    </div>
  );
}
