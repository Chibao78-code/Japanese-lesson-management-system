import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        FER202
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/se184280 /all-lessons">
              All Lessons
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/se184280 /completed-lessons">
              Completed Lessons
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/se184280 /incomplete-lessons">
              Incomplete Lessons
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/se184280 /add-lesson">
              Add Lesson
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
