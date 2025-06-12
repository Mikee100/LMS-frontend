import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiBarChart2, FiClock } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://lms-backend-4b82.onrender.com/api/courses/my/courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const processedCourses = response.data.map(course => {
          if (course.thumbnail?.data) {
            const base64String = btoa(
              String.fromCharCode(...new Uint8Array(course.thumbnail.data.data || course.thumbnail.data))
            );
            return { 
              ...course, 
              thumbnailBase64: `data:image/jpeg;base64,${base64String}`,
              duration: course.duration || 'Not specified',
              students: course.students || 0
            };
          }
          return {
            ...course,
            duration: course.duration || 'Not specified',
            students: course.students || 0
          };
        });

        setCourses(processedCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://lms-backend-4b82.onrender.com/api/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(courses.filter(course => course._id !== courseId));
      } catch (err) {
        console.error('Error deleting course:', err);
        alert('Failed to delete course. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-2 text-gray-600">
            Manage and organize your teaching materials
          </p>
        </div>
        <Link
          to="/tutor/courses/add"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          New Course
        </Link>
      </div>

      {error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <Skeleton height={160} />
              <div className="p-4">
                <Skeleton count={3} />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <FiBook className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No courses yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new course.
          </p>
          <div className="mt-6">
            <Link
              to="/tutor/courses/add"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              New Course
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                {course.thumbnailBase64 ? (
                  <img
                    src={course.thumbnailBase64}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <FiBook className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded">
                  {course.level}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mt-3">
                  <FiBarChart2 className="mr-1.5 h-4 w-4 text-gray-400" />
                  <span className="mr-4">{course.students} students</span>
                  <FiClock className="mr-1.5 h-4 w-4 text-gray-400" />
                  <span>{course.duration}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                  <Link
                    to={`/tutor/courses/edit/${course._id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiEdit2 className="-ml-1 mr-1.5 h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiTrash2 className="-ml-1 mr-1.5 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;