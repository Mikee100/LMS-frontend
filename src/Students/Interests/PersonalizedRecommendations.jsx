import React, { useEffect, useState, useMemo } from 'react';
import CourseCard from '../CourseCard';
import axios from 'axios';

const PersonalizedRecommendations = ({ availableCourses, courseProgress }) => {
  const [studentInterests, setStudentInterests] = useState([]);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/students/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudentInterests(res.data.interests || []);
      } catch {
        setStudentInterests([]);
      }
    };
    fetchStudentProfile();
  }, []);

  const recommendations = useMemo(() => (
    availableCourses.filter(course =>
      studentInterests.some(interest =>
        Array.isArray(course.subjects) &&
        course.subjects.some(subject =>
          subject.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(subject.toLowerCase())
        )
      ) &&
      !(courseProgress[course._id] > 0)
    ).slice(0, 4)
  ), [availableCourses, studentInterests, courseProgress]);

  if (!availableCourses.length || !studentInterests.length) {
    return <div>Loading recommendations...</div>;
  }

  if (recommendations.length === 0) {
    return <div className="mb-10 text-gray-500">No personalized recommendations found. Try exploring all courses!</div>;
  }

  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-indigo-800 mb-4">Recommended for You</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {recommendations.map(course => (
          <CourseCard
            key={course._id}
            course={course}
            progressCount={courseProgress[course._id] || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;