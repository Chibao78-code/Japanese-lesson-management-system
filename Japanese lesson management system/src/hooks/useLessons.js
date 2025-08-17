import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import { useDebounce } from './useDebounce';

const BASE = import.meta.env.VITE_API_BASE_URL;
const LEVEL_OPTIONS = ["All", "N1", "N2", "N3", "N4", "N5"];

export const useLessons = (filter = 'all') => {
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lessons from API
  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(BASE);
      setLessons(response.data);
    } catch (err) {
      setError('Không thể tải dữ liệu bài học');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // Filter lessons based on completion status
  const baseFilteredLessons = useMemo(() => {
    switch (filter) {
      case 'completed':
        return lessons.filter(lesson => 
          lesson.isCompleted === true || lesson.isCompleted === "true"
        );
      case 'incomplete':
      case 'pending': // alias for incomplete - used by Home page
        return lessons.filter(lesson => 
          lesson.isCompleted === false || lesson.isCompleted === "false" ||
          lesson.isCompleted !== true && lesson.isCompleted !== "true"
        );
      default:
        return lessons;
    }
  }, [lessons, filter]);

  // Advanced search function
  const searchInContent = (lesson, term) => {
    const searchLower = term.toLowerCase();
    
    // Search in title
    if (lesson.lessonTitle?.toLowerCase().includes(searchLower)) return true;
    
    // Search in content
    if (lesson.content?.toLowerCase().includes(searchLower)) return true;
    
    // Search in vocabulary (array)
    if (Array.isArray(lesson.vocabulary)) {
      if (lesson.vocabulary.some(word => 
        word?.toLowerCase().includes(searchLower)
      )) return true;
    }
    
    // Search in grammar
    if (lesson.grammar?.toLowerCase().includes(searchLower)) return true;
    
    return false;
  };

  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Apply search, filter, and sort
  const filteredLessons = useMemo(() => {
    let filtered = [...baseFilteredLessons];

    // Apply debounced search
    if (debouncedSearchTerm.trim()) {
      filtered = filtered.filter(lesson => 
        searchInContent(lesson, debouncedSearchTerm.trim())
      );
    }

    // Apply level filter
    if (selectedLevel !== "All") {
      filtered = filtered.filter(lesson => lesson.level === selectedLevel);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;
      case "title":
        filtered.sort((a, b) => 
          a.lessonTitle.localeCompare(b.lessonTitle)
        );
        break;
      case "time":
        filtered.sort((a, b) => a.estimatedTime - b.estimatedTime);
        break;
      default:
        break;
    }

    return filtered;
  }, [baseFilteredLessons, debouncedSearchTerm, selectedLevel, sortBy]);

  // Delete lesson function with useCallback for performance
  const deleteLesson = useCallback(async (id) => {
    try {
      await axios.delete(`${BASE}/${id}`);
      setLessons(prev => prev.filter(lesson => lesson.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  // Update lesson completion status with useCallback
  const toggleLessonCompletion = useCallback(async (id, newStatus) => {
    try {
      await axios.patch(`${BASE}/${id}`, { isCompleted: newStatus });
      setLessons(prev => prev.map(lesson => 
        lesson.id === id ? { ...lesson, isCompleted: newStatus } : lesson
      ));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  // Reset filters with useCallback
  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedLevel("All");
    setSortBy("newest");
  }, []);

  return {
    // Data
    lessons: filteredLessons,
    allLessons: lessons,
    isLoading,
    error,
    
    // Search & Filter states
    searchTerm,
    setSearchTerm,
    selectedLevel,
    setSelectedLevel,
    sortBy,
    setSortBy,
    
    // Actions
    fetchLessons,
    deleteLesson,
    toggleLessonCompletion,
    resetFilters,
    
    // Constants
    LEVEL_OPTIONS,
    
    // Stats
    totalCount: baseFilteredLessons.length,
    filteredCount: filteredLessons.length,
  };
};

export default useLessons;
