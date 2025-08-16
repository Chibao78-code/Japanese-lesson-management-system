import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        🌸 Japanese lesson management system
      </Link>
      
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <i className="bi bi-house me-1"></i>Trang chủ
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/se184280 /all-lessons">
              <i className="bi bi-book me-1"></i>Tất cả bài học
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/se184280 /completed-lessons">
              <i className="bi bi-check-circle me-1"></i>Đã hoàn thành
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/se184280 /incomplete-lessons">
              <i className="bi bi-clock me-1"></i>Chưa hoàn thành
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/se184280 /add-lesson">
              <i className="bi bi-plus-circle me-1"></i>Thêm bài học
            </Link>
          </li>
        </ul>
        
        <ul className="navbar-nav">
          <li className="nav-item">
            <span className="navbar-text">
              <i className="bi bi-person-circle me-1"></i>
              <strong>Hệ thống quản lý bài học tiếng Nhật</strong>
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
}
