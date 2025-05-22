import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiFile, FiEye, FiDownload, FiCheckCircle, FiAlertCircle, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import axios from 'axios';

// Components
const CourseHeader = ({ course, enrolled, enrolling, onEnroll }) => {
  return (
    <div className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-indigo-900">{course.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.level === 'Advanced' ? 'bg-red-100 text-red-800' :
            course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {course.level}
          </span>
          <span>•</span>
          <span>{course.subject}</span>
          <span>•</span>
          <span>{course.enrolledStudents || 0} students enrolled</span>
        </div>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{course.description}</p>
        
        {!enrolled ? (
          <button
            onClick={onEnroll}
            disabled={enrolling}
            className={`px-8 py-3 rounded-lg text-white font-medium text-lg transition-all shadow-md hover:shadow-lg ${
              enrolling ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {enrolling ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enrolling...
              </span>
            ) : 'Enroll in Course'}
          </button>
        ) : (
          <div className="flex items-center text-green-600 font-medium text-lg">
            <FiCheckCircle className="mr-2" size={24} />
            <span>You are enrolled in this course</span>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseTopics = ({ topics }) => {
  const [expandedTopic, setExpandedTopic] = useState(null);

  const toggleTopic = (index) => {
    setExpandedTopic(expandedTopic === index ? null : index);
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Course Curriculum</h2>
      <div className="space-y-2">
        {topics?.length > 0 ? (
          topics.map((topic, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleTopic(index)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="font-medium text-lg text-gray-800">
                    Topic {index + 1}: {topic.title}
                  </span>
                </div>
                {expandedTopic === index ? (
                  <FiChevronDown size={20} className="text-gray-600" />
                ) : (
                  <FiChevronRight size={20} className="text-gray-600" />
                )}
              </button>
              
              {expandedTopic === index && (
                <div className="p-4 bg-white border-t">
                  <p className="text-gray-700 mb-4">{topic.description}</p>
                  
                  {topic.materials?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-3">Materials:</h4>
                      <div className="space-y-3">
                        {topic.materials.map((material, matIndex) => (
                          <div
                            key={matIndex}
                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                          >
                            <div className="flex items-center">
                              <FiFile className="text-indigo-600 mr-3" size={18} />
                              <span className="text-gray-800">{material.originalName || material.filename}</span>
                            </div>
                            <button
                              onClick={() => window.open(material.link, '_blank')}
                              className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50"
                              title={material.originalName?.endsWith('.pdf') ? 'View' : 'Download'}
                            >
                              {material.originalName?.endsWith('.pdf') ? (
                                <FiEye size={18} />
                              ) : (
                                <FiDownload size={18} />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No topics available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseDetails = ({ course }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Course Details</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-xl text-indigo-800 mb-4">About This Course</h3>
          <p className="text-gray-700 leading-relaxed">
            {course.longDescription || 'No additional description provided.'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-xl text-indigo-800 mb-4">What You'll Learn</h3>
          <ul className="space-y-3">
            {course.learningOutcomes?.length > 0 ? (
              course.learningOutcomes.map((outcome, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No learning outcomes specified</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const InstructorSection = ({ instructor }) => {
  return (
    <div className="mb-12 bg-indigo-50 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-indigo-900">About the Instructor</h2>
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-2xl font-bold">
          {instructor?.name?.charAt(0) || 'I'}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{instructor?.name || 'Instructor'}</h3>
          <p className="text-gray-600 mb-4">{instructor?.bio || 'No bio available'}</p>
          <div className="flex flex-wrap gap-2">
            {instructor?.expertise?.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-white text-indigo-700 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-12 bg-gray-200 rounded w-40 mt-6"></div>
        
        <div className="mt-12 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-start text-red-500">
        <FiAlertCircle className="mr-2 mt-1" size={20} />
        <div>
          <span className="font-medium">{error}</span>
          <button 
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 block"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CourseView = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  // Fetch course details and enrollment status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        const [courseResponse, enrollmentResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/students/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/enroll/students/status/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!courseResponse.data) {
          throw new Error('Course not found');
        }

        // Transform materials into topics if they have topic information
        let transformedCourse = courseResponse.data;
        if (transformedCourse.materials && transformedCourse.materials.length > 0) {
          // Group materials by topic if they have topic field
          if (transformedCourse.materials.some(m => m.topic)) {
            const topicsMap = {};
            
            transformedCourse.materials.forEach(material => {
              if (!topicsMap[material.topic]) {
                topicsMap[material.topic] = {
                  title: material.topic,
                  description: material.topicDescription || `Materials for ${material.topic}`,
                  materials: []
                };
              }
              topicsMap[material.topic].materials.push(material);
            });
            
            transformedCourse.topics = Object.values(topicsMap);
          } else {
            // If no topics, create a single default topic
            transformedCourse.topics = [{
              title: 'Course Materials',
              description: 'All materials for this course',
              materials: transformedCourse.materials
            }];
          }
        }

        setCourse(transformedCourse);
        setEnrolled(enrollmentResponse.data?.enrolled || false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `http://localhost:5000/api/enroll/students`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.enrolled) {
        setEnrolled(true);
        // Refresh course data
        const courseResponse = await axios.get(
          `http://localhost:5000/api/students/courses/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourse(courseResponse.data);
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      setError(err.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  // Course not found state
  if (!course) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md text-center py-12">
        <p className="text-xl text-gray-500">Course not found</p>
      </div>
    );
  }

  // Main render
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <CourseHeader 
        course={course} 
        enrolled={enrolled} 
        enrolling={enrolling} 
        onEnroll={handleEnroll} 
      />
      
      <div className="max-w-4xl mx-auto">
        {enrolled && course.topics?.length > 0 && (
          <CourseTopics topics={course.topics} />
        )}
        
        <CourseDetails course={course} />
        
        {course.instructor && (
          <InstructorSection instructor={course.instructor} />
        )}
      </div>
    </div>
  );
};

export default CourseView;