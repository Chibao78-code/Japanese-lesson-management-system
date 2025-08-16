import { useState } from 'react';

const KeyboardShortcutsHelp = ({ shortcuts = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        className="btn btn-outline-info btn-sm position-fixed"
        style={{ bottom: '20px', right: '20px', zIndex: 1040 }}
        onClick={() => setIsOpen(true)}
        title="Keyboard Shortcuts"
      >
        ⌨️
      </button>
    );
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">⌨️ Phím tắt</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setIsOpen(false)}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="col-12 mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-dark font-monospace">
                      {shortcut.key}
                    </span>
                    <span className="text-muted">
                      {shortcut.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <div className="text-muted small">
              💡 Phím tắt chỉ hoạt động khi không có input nào được focus
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
