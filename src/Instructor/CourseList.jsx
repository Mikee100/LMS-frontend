import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/courses/my/courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Convert binary thumbnail data to base64
        const processedCourses = response.data.map(course => {
          if (course.thumbnail?.data) {
            const base64String = btoa(
              String.fromCharCode(...new Uint8Array(course.thumbnail.data.data || course.thumbnail.data))
            );
            return { ...course, thumbnailBase64: `data:image/jpeg;base64,${base64String}` };
          }
          return course;
        });

        setCourses(processedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Link 
          to="/tutor/courses/add" 
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add New Course
        </Link>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <div key={course._id} className="bg-white p-4 rounded-lg shadow">
              {course.thumbnailBase64 && (
                <img
                  src={course.thumbnailBase64}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-gray-600 mt-1">{course.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Subject:</strong> {course.subject}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Level:</strong> {course.level}
              </p>
              <div className="mt-4 flex space-x-4">
                <Link 
                  to={`/tutor/courses/edit/${course._id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </Link>
                <button className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
