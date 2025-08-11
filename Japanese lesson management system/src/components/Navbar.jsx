import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

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
          <li className="nav-item dropdown">
            <span className="navbar-text me-3">
              <i className="bi bi-person-circle me-1"></i>
              Xin chào, <strong>{user?.username}</strong>
            </span>
          </li>
          <li className="nav-item">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
