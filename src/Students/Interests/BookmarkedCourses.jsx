import React, { useEffect, useState } from 'react';
import CourseCard from '../CourseCard';

const BookmarkedCoursesPage = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [bookmarkedCourses, setBookmarkedCourses] = useState(() => {
    const saved = localStorage.getItem('bookmarkedCourses');
    return saved ? JSON.parse(saved) : [];
  });
  const [courseProgress, setCourseProgress] = useState({});

  useEffect(() => {
    // Fetch courses from your API
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses');
        const data = await res.json();
        setAvailableCourses(data);
      } catch (err) {
        setAvailableCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const toggleBookmark = (courseId) => {
  setBookmarkedCourses(prev => {
    let updated;
    if (prev.includes(courseId)) {
      updated = prev.filter(id => id !== courseId);
    } else {
      updated = [...prev, courseId];
    }
    localStorage.setItem('bookmarkedCourses', JSON.stringify(updated));
    return updated;
  });
};
  const savedCourses = availableCourses.filter(course => bookmarkedCourses.includes(course._id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Courses</h1>
      {savedCourses.length === 0 ? (
        <div className="text-gray-500">You have no saved courses yet.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedCourses.map(course => (
          <CourseCard
  key={course._id}
  course={course}
  progressCount={courseProgress[course._id] || 0}
  isBookmarked={bookmarkedCourses.includes(course._id)}
  onBookmark={() => toggleBookmark(course._id)}
/>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedCoursesPage;