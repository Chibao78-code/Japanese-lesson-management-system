/**
 * Utility functions for exporting and importing lesson data
 */

/**
 * Export lessons to JSON file
 */
export const exportToJSON = (lessons, filename = 'japanese-lessons.json') => {
  const dataStr = JSON.stringify(lessons, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = filename;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

/**
 * Export lessons to CSV file
 */
export const exportToCSV = (lessons, filename = 'japanese-lessons.csv') => {
  const headers = ['ID', 'Title', 'Level', 'Time(min)', 'Content', 'Vocabulary', 'Grammar', 'Completed', 'Image'];
  
  const csvContent = [
    headers.join(','),
    ...lessons.map(lesson => [
      lesson.id,
      `"${lesson.lessonTitle?.replace(/"/g, '""') || ''}"`,
      lesson.level || '',
      lesson.estimatedTime || '',
      `"${lesson.content?.replace(/"/g, '""') || ''}"`,
      `"${Array.isArray(lesson.vocabulary) ? lesson.vocabulary.join('; ') : lesson.vocabulary || ''}"`,
      `"${lesson.grammar?.replace(/"/g, '""') || ''}"`,
      lesson.isCompleted ? 'Yes' : 'No',
      lesson.lessonImage || ''
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Import lessons from JSON file
 */
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Validate data structure
        if (!Array.isArray(data)) {
          throw new Error('File must contain an array of lessons');
        }
        
        // Validate each lesson
        const validatedLessons = data.map((lesson, index) => {
          if (!lesson.lessonTitle) {
            throw new Error(`Lesson at index ${index} missing required field: lessonTitle`);
          }
          
          return {
            lessonTitle: lesson.lessonTitle,
            level: lesson.level || 'N5',
            estimatedTime: parseInt(lesson.estimatedTime) || 30,
            content: lesson.content || '',
            vocabulary: Array.isArray(lesson.vocabulary) ? lesson.vocabulary : 
                       typeof lesson.vocabulary === 'string' ? lesson.vocabulary.split(',').map(v => v.trim()) : [],
            grammar: lesson.grammar || '',
            lessonImage: lesson.lessonImage || 'https://via.placeholder.com/300x200/6c757d/ffffff?text=No+Image',
            isCompleted: Boolean(lesson.isCompleted)
          };
        });
        
        resolve(validatedLessons);
      } catch (error) {
        reject(new Error(`Invalid JSON file: ${error.message}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

/**
 * Import lessons from CSV file
 */
export const importFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('CSV file must have at least a header row and one data row');
        }
        
        // Skip header row
        const dataLines = lines.slice(1);
        
        const lessons = dataLines.map((line, index) => {
          // Simple CSV parsing (doesn't handle all edge cases)
          const values = line.split(',').map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
          
          if (values.length < 9) {
            throw new Error(`Row ${index + 2} has insufficient columns`);
          }
          
          return {
            lessonTitle: values[1] || `Imported Lesson ${index + 1}`,
            level: values[2] || 'N5',
            estimatedTime: parseInt(values[3]) || 30,
            content: values[4] || '',
            vocabulary: values[5] ? values[5].split(';').map(v => v.trim()).filter(v => v) : [],
            grammar: values[6] || '',
            lessonImage: values[8] || 'https://via.placeholder.com/300x200/6c757d/ffffff?text=No+Image',
            isCompleted: values[7]?.toLowerCase() === 'yes'
          };
        });
        
        resolve(lessons);
      } catch (error) {
        reject(new Error(`Invalid CSV file: ${error.message}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

/**
 * Get current date string for filename
 */
export const getDateString = () => {
  return new Date().toISOString().slice(0, 10);
};
