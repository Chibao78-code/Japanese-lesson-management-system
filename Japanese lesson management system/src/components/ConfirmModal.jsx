import { useState } from 'react';
//test 
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận", 
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "danger" // danger, warning, info
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '🚨';
      case 'info':
        return 'ℹ️';
      default:
        return '❓';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      case 'info':
        return 'btn-info';
      default:
        return 'btn-primary';
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {getIcon()} {title}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button 
              type="button" 
              className={`btn ${getButtonClass()}`}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Đang xử lý...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook để sử dụng modal dễ dàng hơn
export const useConfirmModal = () => {
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    type: 'danger'
  });

  const showConfirm = ({ 
    title, 
    message, 
    onConfirm, 
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    type = 'danger'
  }) => {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      type
    });
  };

  const hideConfirm = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const ConfirmModalComponent = () => (
    <ConfirmModal
      isOpen={modal.isOpen}
      onClose={hideConfirm}
      onConfirm={modal.onConfirm}
      title={modal.title}
      message={modal.message}
      confirmText={modal.confirmText}
      cancelText={modal.cancelText}
      type={modal.type}
    />
  );

  return {
    showConfirm,
    hideConfirm,
    ConfirmModalComponent
  };
};

export default ConfirmModal;
