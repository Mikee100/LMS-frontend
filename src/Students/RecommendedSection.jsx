// components/RecommendedSection.jsx
import React from 'react';
import CourseCard from './CourseCard';

const RecommendedSection = ({ courses }) => {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended For You</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {courses.map(course => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedSection;