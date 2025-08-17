import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../components/Toast";
import useLessons from "../hooks/useLessons";
import { 
  exportToJSON, 
  exportToCSV, 
  importFromJSON, 
  importFromCSV, 
  getDateString 
} from "../utils/exportImport";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function ImportExport() {
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importType, setImportType] = useState('json');
  const { allLessons, fetchLessons } = useLessons('all');
  const { showToast, ToastComponent } = useToast();
  const navigate = useNavigate();

  const handleExportJSON = () => {
    try {
      exportToJSON(allLessons, `japanese-lessons-${getDateString()}.json`);
      showToast("Đã xuất dữ liệu JSON thành công!", "success");
    } catch (error) {
      showToast("Lỗi khi xuất dữ liệu JSON!", "error");
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(allLessons, `japanese-lessons-${getDateString()}.csv`);
      showToast("Đã xuất dữ liệu CSV thành công!", "success");
    } catch (error) {
      showToast("Lỗi khi xuất dữ liệu CSV!", "error");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImportFile(file);
  };

  const handleImport = async () => {
    if (!importFile) {
      showToast("Vui lòng chọn file để import!", "warning");
      return;
    }

    setIsImporting(true);
    try {
      let lessons;
      
      if (importType === 'json') {
        lessons = await importFromJSON(importFile);
      } else {
        lessons = await importFromCSV(importFile);
      }

      // Import lessons to API
      let successCount = 0;
      let errorCount = 0;

      for (const lesson of lessons) {
        try {
          await axios.post(BASE, lesson);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error('Error importing lesson:', lesson.lessonTitle, error);
        }
      }

      // Refresh data
      await fetchLessons();

      if (errorCount === 0) {
        showToast(`Đã import thành công ${successCount} bài học!`, "success");
      } else {
        showToast(`Import hoàn tất: ${successCount} thành công, ${errorCount} lỗi`, "warning");
      }

      // Reset form
      setImportFile(null);
      setImportType('json');
      document.getElementById('importFile').value = '';

    } catch (error) {
      showToast(`Lỗi import: ${error.message}`, "error");
    } finally {
      setIsImporting(false);
    }
  };

  const generateSampleJSON = () => {
    const sampleData = [
      {
        "lessonTitle": "Hiragana あいうえお - Sample",
        "level": "N5",
        "estimatedTime": 30,
        "content": "Học 5 ký tự Hiragana đầu tiên và cách phát âm",
        "vocabulary": ["あ (a)", "い (i)", "う (u)", "え (e)", "お (o)"],
        "grammar": "Hiragana là bảng chữ cái phiên âm cơ bản của tiếng Nhật",
        "lessonImage": "https://via.placeholder.com/300x200/FFB6C1/000000?text=Sample",
        "isCompleted": false
      }
    ];
    
    exportToJSON(sampleData, 'sample-lesson.json');
    showToast("Đã tạo file mẫu JSON!", "info");
  };

  const generateSampleCSV = () => {
    const sampleData = [
      {
        id: "sample",
        lessonTitle: "Katakana サンプル - Sample",
        level: "N5",
        estimatedTime: 25,
        content: "Bài học mẫu cho Katakana",
        vocabulary: ["サンプル (sample)", "テスト (test)"],
        grammar: "Katakana dùng cho từ ngoại lai",
        lessonImage: "https://via.placeholder.com/300x200/98FB98/000000?text=Sample",
        isCompleted: false
      }
    ];
    
    exportToCSV(sampleData, 'sample-lesson.csv');
    showToast("Đã tạo file mẫu CSV!", "info");
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h2>📁 Import / Export Dữ liệu</h2>
          <p className="text-muted">Quản lý dữ liệu bài học - xuất ra file hoặc nhập từ file</p>
        </div>
      </div>

      {/* Export Section */}
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>📤 Xuất dữ liệu</h4>
            </div>
            <div className="card-body">
              <p>Hiện có <strong>{allLessons.length}</strong> bài học trong hệ thống.</p>
              
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success"
                  onClick={handleExportJSON}
                  disabled={allLessons.length === 0}
                >
                  📋 Xuất JSON ({allLessons.length} bài học)
                </button>
                
                <button 
                  className="btn btn-info"
                  onClick={handleExportCSV}
                  disabled={allLessons.length === 0}
                >
                  📊 Xuất CSV ({allLessons.length} bài học)
                </button>
              </div>
              
              {allLessons.length === 0 && (
                <div className="alert alert-warning mt-3">
                  Không có dữ liệu để xuất. Hãy thêm bài học trước!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Import Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>📥 Nhập dữ liệu</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Chọn định dạng file:</label>
                <select
                  className="form-select"
                  value={importType}
                  onChange={(e) => setImportType(e.target.value)}
                >
                  <option value="json">JSON (.json)</option>
                  <option value="csv">CSV (.csv)</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="importFile" className="form-label">Chọn file:</label>
                <input
                  type="file"
                  className="form-control"
                  id="importFile"
                  accept={importType === 'json' ? '.json' : '.csv'}
                  onChange={handleFileChange}
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleImport}
                  disabled={!importFile || isImporting}
                >
                  {isImporting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Đang import...
                    </>
                  ) : (
                    `📁 Import ${importType.toUpperCase()}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Files Section */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>📋 File mẫu</h5>
            </div>
            <div className="card-body">
              <p>Tải file mẫu để hiểu cấu trúc dữ liệu:</p>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <button
                    className="btn btn-outline-success w-100"
                    onClick={generateSampleJSON}
                  >
                    📄 Tạo file mẫu JSON
                  </button>
                </div>
                <div className="col-md-6 mb-3">
                  <button
                    className="btn btn-outline-info w-100"
                    onClick={generateSampleCSV}
                  >
                    📊 Tạo file mẫu CSV
                  </button>
                </div>
              </div>
              
              <div className="alert alert-info">
                <h6>💡 Lưu ý khi import:</h6>
                <ul className="mb-0">
                  <li><strong>JSON:</strong> Định dạng chính xác, hỗ trợ đầy đủ tất cả trường</li>
                  <li><strong>CSV:</strong> Đơn giản hơn nhưng có thể bị giới hạn với ký tự đặc biệt</li>
                  <li>Các trường bắt buộc: <code>lessonTitle</code></li>
                  <li>File sẽ được thêm vào dữ liệu hiện có (không ghi đè)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastComponent />
    </div>
  );
}
