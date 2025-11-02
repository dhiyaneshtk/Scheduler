import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import "./CourseSearch.css";

const availableCourses = [
  { id: 1, code: "CS 101", name: "Introduction to Computer Science" },
  { id: 2, code: "CS 201", name: "Data Structures and Algorithms" },
  { id: 3, code: "MATH 301", name: "Linear Algebra" },
  { id: 4, code: "PHYS 101", name: "Physics I" },
  { id: 5, code: "ENG 201", name: "Creative Writing" },
  { id: 6, code: "HIST 101", name: "World History" },
  { id: 7, code: "BIO 101", name: "Introduction to Biology" },
  { id: 8, code: "CHEM 201", name: "Organic Chemistry" },
];

const CourseSearch = ({ selectedCourses, onCourseSelect, onCourseRemove }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = availableCourses.filter(
        (course) =>
          !selectedCourses.find((sc) => sc.id === course.id) &&
          (course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCourses(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, selectedCourses]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCourseSelect = (course) => {
    onCourseSelect(course);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="course-search-container" ref={searchRef}>
      <div className="search-wrapper glass">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Search for courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowSuggestions(true)}
        />
      </div>

      {showSuggestions && filteredCourses.length > 0 && (
        <div className="suggestions-dropdown glass">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="suggestion-item glass-hover"
              onClick={() => handleCourseSelect(course)}
            >
              <span className="course-code">{course.code}</span>
              <span className="course-name">{course.name}</span>
            </div>
          ))}
        </div>
      )}

      {selectedCourses.length > 0 && (
        <div className="selected-courses">
          {selectedCourses.map((course) => (
            <div key={course.id} className="selected-course-chip glass">
              <span className="chip-text">
                {course.code} - {course.name}
              </span>
              <button
                className="chip-remove"
                onClick={() => onCourseRemove(course.id)}
                aria-label="Remove course"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default CourseSearch;
