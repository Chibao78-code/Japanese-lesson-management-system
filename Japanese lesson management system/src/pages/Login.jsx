import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Đăng nhập đơn giản (có thể mở rộng với API thực)
    if (username === "admin" && password === "123456") {
      login({ username, role: "admin" });
    } else if (username === "teacher" && password === "123456") {
      login({ username, role: "teacher" });
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 login-card">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="card-title text-primary fw-bold">
                    🌸 Quản lý bài học tiếng Nhật
                  </h2>
                  <p className="text-muted">Đăng nhập để tiếp tục</p>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      <i className="bi bi-person me-2"></i>Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tên đăng nhập"
                      autoComplete="username"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock me-2"></i>Mật khẩu
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      autoComplete="current-password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Đăng nhập
                  </button>
                </form>

                <hr className="my-4" />

                <div className="text-center">
                  <small className="text-muted">
                    <strong>Tài khoản demo:</strong><br />
                    Admin: admin / 123456<br />
                    Giáo viên: teacher / 123456
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
