import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const CourseView = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('Course ID:', id); // Debugging line

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/students/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (loading) return <p>Loading course details...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <p className="text-sm text-gray-500 mb-6">Subject: {course.subject}</p>

      {/* Materials */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Course Materials</h2>
        {course.materials && course.materials.length > 0 ? (
          <ul className="list-disc list-inside space-y-2">
            {course.materials.map((material, index) => (
              <li key={index}>
                <a
                  href={material.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline"
                >
                  {material.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No materials available yet.</p>
        )}
      </div>

      {/* Placeholder for future features */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Activities (Coming Soon)</h2>
        <p className="text-gray-500">Assignments, quizzes, and discussions will appear here.</p>
      </div>
    </div>
  );
};

export default CourseView;
