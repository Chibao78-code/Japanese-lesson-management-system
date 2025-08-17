import { useMemo } from "react";
import { Link } from "react-router-dom";
import useLessons from "../hooks/useLessons";

export default function Dashboard() {
  const { allLessons, isLoading } = useLessons('all');

  const stats = useMemo(() => {
    if (!allLessons.length) return null;

    const completed = allLessons.filter(lesson => 
      lesson.isCompleted === true || lesson.isCompleted === "true"
    ).length;
    const total = allLessons.length;
    const completionRate = Math.round((completed / total) * 100);

    // Stats by level
    const levelStats = allLessons.reduce((acc, lesson) => {
      const level = lesson.level || 'Unknown';
      if (!acc[level]) acc[level] = { total: 0, completed: 0 };
      acc[level].total++;
      if (lesson.isCompleted === true || lesson.isCompleted === "true") {
        acc[level].completed++;
      }
      return acc;
    }, {});

    // Total study time
    const totalTime = allLessons.reduce((sum, lesson) => 
      sum + (parseInt(lesson.estimatedTime) || 0), 0
    );

    const completedTime = allLessons
      .filter(lesson => lesson.isCompleted === true || lesson.isCompleted === "true")
      .reduce((sum, lesson) => sum + (parseInt(lesson.estimatedTime) || 0), 0);

    return {
      total,
      completed,
      incomplete: total - completed,
      completionRate,
      levelStats,
      totalTime,
      completedTime,
      remainingTime: totalTime - completedTime
    };
  }, [allLessons]);

  if (isLoading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <h3>📚 Chào mừng đến với hệ thống học tiếng Nhật!</h3>
          <p>Hãy bắt đầu bằng cách thêm bài học đầu tiên</p>
          <Link to="/se184280/add-lesson" className="btn btn-success">
            ➕ Thêm bài học đầu tiên
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2>📊 Dashboard - Tổng quan học tập</h2>
          <p className="text-muted">Theo dõi tiến độ và thống kê học tập của bạn</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body text-center">
              <h4 className="card-title">📚 {stats.total}</h4>
              <p className="card-text">Tổng số bài học</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body text-center">
              <h4 className="card-title">✅ {stats.completed}</h4>
              <p className="card-text">Đã hoàn thành</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body text-center">
              <h4 className="card-title">📝 {stats.incomplete}</h4>
              <p className="card-text">Chưa hoàn thành</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body text-center">
              <h4 className="card-title">🎯 {stats.completionRate}%</h4>
              <p className="card-text">Tỷ lệ hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">📈 Tiến độ tổng thể</h5>
              <div className="progress mb-2" style={{ height: "25px" }}>
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: `${stats.completionRate}%` }}
                  aria-valuenow={stats.completionRate}
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  {stats.completionRate}%
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <small className="text-muted">
                  {stats.completed} / {stats.total} bài học
                </small>
                <small className="text-muted">
                  {stats.completedTime} / {stats.totalTime} phút
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Statistics */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">📊 Thống kê theo cấp độ</h5>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Cấp độ</th>
                      <th>Tổng</th>
                      <th>Hoàn thành</th>
                      <th>Còn lại</th>
                      <th>Tiến độ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.levelStats).map(([level, data]) => {
                      const percentage = Math.round((data.completed / data.total) * 100);
                      return (
                        <tr key={level}>
                          <td><span className="badge bg-info">{level}</span></td>
                          <td>{data.total}</td>
                          <td>{data.completed}</td>
                          <td>{data.total - data.completed}</td>
                          <td>
                            <div className="progress" style={{ height: "15px" }}>
                              <div 
                                className="progress-bar bg-success" 
                                style={{ width: `${percentage}%` }}
                              >
                                {percentage}%
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">⏱️ Thời gian học</h5>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Đã học:</span>
                  <strong>{stats.completedTime} phút</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Còn lại:</span>
                  <span>{stats.remainingTime} phút</span>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                  <span>Tổng:</span>
                  <strong>{stats.totalTime} phút</strong>
                </div>
              </div>
              
              <h6>🎯 Mục tiêu hôm nay</h6>
              <div className="alert alert-info small">
                Hãy hoàn thành ít nhất 1 bài học để duy trì streak!
              </div>
              
              <div className="d-grid gap-2">
                <Link to="/se184280/incomplete-lessons" className="btn btn-primary btn-sm">
                  📚 Tiếp tục học
                </Link>
                <Link to="/se184280/add-lesson" className="btn btn-outline-success btn-sm">
                  ➕ Thêm bài mới
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">🚀 Hành động nhanh</h5>
              <div className="row">
                <div className="col-md-3 mb-2">
                  <Link to="/se184280/incomplete-lessons" className="btn btn-outline-warning w-100">
                    📝 Bài chưa học ({stats.incomplete})
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/se184280/completed-lessons" className="btn btn-outline-success w-100">
                    ✅ Đã hoàn thành ({stats.completed})
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/se184280/all-lessons" className="btn btn-outline-primary w-100">
                    📚 Tất cả bài học ({stats.total})
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/se184280/add-lesson" className="btn btn-success w-100">
                    ➕ Thêm bài học
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
