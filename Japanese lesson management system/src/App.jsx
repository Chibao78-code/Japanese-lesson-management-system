import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AllLessons from "./pages/AllLessons";
import CompletedLessons from "./pages/CompletedLessons";
import IncompleteLessons from "./pages/IncompleteLessons";
import LessonDetail from "./pages/LessonDetail";
import AddLesson from "./pages/AddLesson";
import EditLesson from "./pages/EditLesson";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/se184280 /all-lessons" element={<AllLessons />} />
          <Route
            path="/se184280 /completed-lessons"
            element={<CompletedLessons />}
          />
          <Route
            path="/se184280 /incomplete-lessons"
            element={<IncompleteLessons />}
          />
          <Route path="/se184280 /lessons/:id" element={<LessonDetail />} />
          <Route path="/se184280 /add-lesson" element={<AddLesson />} />
          <Route path="/se184280 /edit-lesson/:id" element={<EditLesson />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
