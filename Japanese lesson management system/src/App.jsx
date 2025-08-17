import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AllLessons from "./pages/AllLessons";
import CompletedLessons from "./pages/CompletedLessons";
import IncompleteLessons from "./pages/IncompleteLessons";
import LessonDetail from "./pages/LessonDetail";
import AddLesson from "./pages/AddLesson";
import EditLesson from "./pages/EditLesson";
import ImportExport from "./pages/ImportExport";
import KeyboardShortcutsHelp from "./components/KeyboardShortcutsHelp";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";

function App() {
  const { shortcuts } = useKeyboardShortcuts();

  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/se184280/dashboard" element={<Dashboard />} />
          <Route path="/se184280/pending-lessons" element={<Home />} />
          <Route path="/se184280/all-lessons" element={<AllLessons />} />
          <Route
            path="/se184280/completed-lessons"
            element={<CompletedLessons />}
          />
          <Route
            path="/se184280/incomplete-lessons"
            element={<IncompleteLessons />}
          />
          <Route path="/se184280/lessons/:id" element={<LessonDetail />} />
          <Route path="/se184280/add-lesson" element={<AddLesson />} />
          <Route path="/se184280/edit-lesson/:id" element={<EditLesson />} />
          <Route path="/se184280/import-export" element={<ImportExport />} />
        </Routes>
      </div>
      <KeyboardShortcutsHelp shortcuts={shortcuts} />
    </Router>
  );
}

export default App;
