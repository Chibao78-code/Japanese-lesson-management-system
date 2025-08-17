import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 */
export const useKeyboardShortcuts = () => {

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only trigger if no input/textarea is focused and no modifier keys except Ctrl
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
      );

      if (isInputFocused) return;

      // Ctrl/Cmd + key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'h':
            event.preventDefault();
            window.location.href = '/';
            break;
          case 'p':
            event.preventDefault();
            window.location.href = '/se184280/pending-lessons';
            break;
          case 'a':
            event.preventDefault();
            window.location.href = '/se184280/all-lessons';
            break;
          case 'c':
            event.preventDefault();
            window.location.href = '/se184280/completed-lessons';
            break;
          case 'i':
            event.preventDefault();
            window.location.href = '/se184280/incomplete-lessons';
            break;
          case 'n':
            event.preventDefault();
            window.location.href = '/se184280/add-lesson';
            break;
          default:
            break;
        }
        return;
      }

      // Single key shortcuts
      switch (event.key) {
        case '/':
          event.preventDefault();
          // Focus search input if exists
          const searchInput = document.querySelector('input[placeholder*="Tìm kiếm"]');
          if (searchInput) {
            searchInput.focus();
          }
          break;
        case 'Escape':
          // Clear focus from any input
          if (activeElement) {
            activeElement.blur();
          }
          break;
        default:
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Return shortcuts info for help display
  return {
    shortcuts: [
      { key: 'Ctrl+H', description: 'Dashboard' },
      { key: 'Ctrl+P', description: 'Bài học chờ' },
      { key: 'Ctrl+A', description: 'Tất cả bài học' },
      { key: 'Ctrl+C', description: 'Bài học đã hoàn thành' },
      { key: 'Ctrl+I', description: 'Bài học chưa hoàn thành' },
      { key: 'Ctrl+N', description: 'Thêm bài học mới' },
      { key: '/', description: 'Tìm kiếm' },
      { key: 'Esc', description: 'Hủy focus' },
    ]
  };
};

export default useKeyboardShortcuts;
