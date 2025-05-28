import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  FiFile, FiEye, FiDownload, FiCheckCircle, 
  FiAlertCircle, FiChevronRight, FiChevronDown,
  FiPlay, FiClock, FiBookOpen, FiLock, FiUnlock,
  FiDollarSign, FiShoppingCart, FiStar
} from 'react-icons/fi';
import axios from 'axios';

// Components
const CourseHeader = ({ course, enrolled, enrolling, onEnroll }) => {
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!course) return;

    const fetchEnrolledStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/courses/${course._id}/enrollments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEnrolledStudents(response.data);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError('Failed to load enrolled students');
      }
    };
    fetchEnrolledStudents();
  }, [course?._id]);

  const totalPremiumSections = course?.sections?.filter(s => s.isLocked && !s.isFree).length || 0;
  const coursePrice = course?.isFree ? 0 : course?.price || 0;

  return (
    <div className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100 rounded-full opacity-20 transform -translate-x-24 translate-y-24"></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-indigo-900">{course.title}</h1>
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.level === 'advanced' ? 'bg-red-100 text-red-800' :
            course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {course.level}
          </span>
          <span>•</span>
          <span>{course.subject}</span>
          <span>•</span>
          <span>{enrolledStudents.length || 0} students enrolled</span>
          {course.rating && (
            <>
              <span>•</span>
              <span className="flex items-center">
                <FiStar className="mr-1 text-yellow-500" />
                {course.rating.toFixed(1)}
              </span>
            </>
          )}
        </div>
        
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{course.description}</p>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {totalPremiumSections > 0 && !course.isFree && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-600">
                  Includes {totalPremiumSections} premium {totalPremiumSections === 1 ? 'section' : 'sections'}
                </span>
              </div>
            )}
            
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
                ) : coursePrice > 0 ? (
                  <span className="flex items-center">
                    <FiShoppingCart className="mr-2" />
                    Enroll for ${coursePrice}
                  </span>
                ) : (
                  'Enroll for Free'
                )}
              </button>
            ) : (
              <div className="flex items-center text-green-600 font-medium text-lg">
                <FiCheckCircle className="mr-2" size={24} />
                <span>You are enrolled in this course</span>
              </div>
            )}
          </div>
          
          {coursePrice > 0 && !enrolled && (
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <FiDollarSign className="text-green-500 mr-2" />
              <span className="font-medium text-gray-800">${coursePrice}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionItem = ({ section, isEnrolled, onUnlockSection }) => {
  const [expanded, setExpanded] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Ensure we properly check for locked status and free status
  const isLocked = section.isLocked && !section.isFree && !isEnrolled;
  const sectionPrice = section.price || 0;

  const handleUnlock = async () => {
    try {
      setUnlocking(true);
      await onUnlockSection(section._id, sectionPrice);
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden mb-4 ${
      isLocked ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
    }`}>
      <button
        onClick={() => !isLocked && setExpanded(!expanded)}
        className={`w-full flex justify-between items-center p-4 transition-colors ${
          isLocked ? 'bg-yellow-50 hover:bg-yellow-100 cursor-pointer' : 'bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center">
          {isLocked && (
            <FiLock className="mr-3 text-yellow-600 flex-shrink-0" />
          )}
          <span className={`font-medium text-lg ${
            isLocked ? 'text-yellow-800' : 'text-gray-800'
          }`}>
            {section.title}
          </span>
          {section.description && (
            <span className="ml-3 text-gray-500 text-sm hidden md:inline">
              {section.description}
            </span>
          )}
        </div>
        <div className="flex items-center">
          {isLocked ? (
            <span className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              <FiDollarSign className="mr-1" /> ${sectionPrice}
            </span>
          ) : (
            <>
              <span className="text-sm text-gray-500 mr-4 hidden sm:inline-flex items-center">
                <FiPlay className="mr-1" /> {section.lectures?.length || 0} lectures
              </span>
              <span className="text-sm text-gray-500 mr-4 hidden sm:inline-flex items-center">
                <FiFile className="mr-1" /> {section.materials?.length || 0} resources
              </span>
              {expanded ? (
                <FiChevronDown size={20} className="text-gray-600" />
              ) : (
                <FiChevronRight size={20} className="text-gray-600" />
              )}
            </>
          )}
        </div>
      </button>
      
      {isLocked ? (
        <div className="p-4 bg-white border-t border-yellow-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Premium Content</h4>
              <p className="text-sm text-gray-600">
                This section contains premium content. Unlock it to access all lectures and materials.
              </p>
            </div>
            <button
              onClick={handleUnlock}
              disabled={unlocking}
              className={`px-6 py-2 rounded-lg text-white font-medium ${
                unlocking ? 'bg-yellow-500' : 'bg-yellow-600 hover:bg-yellow-700'
              } whitespace-nowrap min-w-[120px] text-center`}
            >
              {unlocking ? 'Processing...' : `Unlock for $${sectionPrice}`}
            </button>
          </div>
        </div>
      ) : expanded && (
        <div className="p-4 bg-white border-t">
          {section.description && (
            <p className="text-gray-700 mb-4">{section.description}</p>
          )}
          
          {/* Section Materials */}
          {isEnrolled && section.materials?.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <FiFile className="mr-2" /> Section Resources
              </h4>
              <div className="space-y-3">
                {section.materials.map((material, matIndex) => (
                  <MaterialItem key={`section-mat-${matIndex}`} material={material} />
                ))}
              </div>
            </div>
          )}
          
          {/* Lectures */}
          {section.lectures?.length > 0 ? (
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <FiPlay className="mr-2" /> Lectures
              </h4>
              <div className="space-y-4">
                {section.lectures.map((lecture, lectureIndex) => (
                  <LectureItem 
                    key={`lecture-${lectureIndex}`} 
                    lecture={lecture} 
                    isEnrolled={isEnrolled}
                    lectureNumber={lectureIndex + 1}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-2">No lectures added yet</p>
          )}
        </div>
      )}
    </div>
  );
};

const LectureItem = ({ lecture, isEnrolled, lectureNumber }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center p-3 bg-blue-50 hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center">
          <span className="font-medium text-gray-800">
            Lecture {lectureNumber}: {lecture.title}
          </span>
        </div>
        {expanded ? (
          <FiChevronDown size={18} className="text-gray-600" />
        ) : (
          <FiChevronRight size={18} className="text-gray-600" />
        )}
      </button>
      
      {expanded && (
        <div className="p-4 bg-white border-t">
          {lecture.description && (
            <p className="text-gray-700 mb-4">{lecture.description}</p>
          )}
          
          {/* Video Content */}
          {lecture.videoUrl && isEnrolled && (
            <div className="mb-4">
              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                <iframe
                  src={lecture.videoUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={lecture.title}
                ></iframe>
              </div>
            </div>
          )}
          
          {/* Lecture Materials */}
          {isEnrolled && lecture.materials?.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-800 mb-2 flex items-center text-sm">
                <FiFile className="mr-2" /> Lecture Resources
              </h5>
              <div className="space-y-2">
                {lecture.materials.map((material, matIndex) => (
                  <MaterialItem key={`lecture-mat-${matIndex}`} material={material} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MaterialItem = ({ material }) => {
  const isPDF = material.originalName?.endsWith('.pdf') || material.filename?.endsWith('.pdf');
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center min-w-0">
        <FiFile className={`mr-3 ${isPDF ? 'text-red-500' : 'text-indigo-600'}`} size={18} />
        <div className="min-w-0">
          <span className="text-gray-800 block truncate" title={material.originalName || material.filename}>
            {material.originalName || material.filename}
          </span>
          <span className="text-xs text-gray-500">
            {material.contentType} • {Math.round((material.size || 0) / 1024)}KB
          </span>
        </div>
      </div>
      <button
        onClick={() => window.open(material.link, '_blank')}
        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 flex-shrink-0"
        title={isPDF ? 'View' : 'Download'}
      >
        {isPDF ? <FiEye size={18} /> : <FiDownload size={18} />}
      </button>
    </div>
  );
};

const CourseCurriculum = ({ course, isEnrolled, onUnlockSection }) => {
  const totalSections = course.sections?.length || 0;
  const totalLectures = course.sections?.reduce((sum, section) => sum + (section.lectures?.length || 0), 0) || 0;
  const totalMaterials = course.sections?.reduce((sum, section) => {
    return sum + 
      (section.materials?.length || 0) + 
      (section.lectures?.reduce((lecSum, lecture) => lecSum + (lecture.materials?.length || 0), 0) || 0);
  }, 0) || 0;
  
  const premiumSections = course.sections?.filter(s => s.isLocked && !s.isFree) || [];
  const freeSections = course.sections?.filter(s => !s.isLocked || s.isFree) || [];

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Course Curriculum</h2>
        <div className="flex space-x-4 text-sm text-gray-600">
          <span className="flex items-center">
            <FiBookOpen className="mr-1" /> {totalSections} sections
          </span>
          <span className="flex items-center">
            <FiPlay className="mr-1" /> {totalLectures} lectures
          </span>
          <span className="flex items-center">
            <FiFile className="mr-1" /> {totalMaterials} resources
          </span>
          {premiumSections.length > 0 && (
            <span className="flex items-center text-yellow-600">
              <FiLock className="mr-1" /> {premiumSections.length} premium
            </span>
          )}
        </div>
      </div>
      
      {course.sections?.length > 0 ? (
        <div className="space-y-4">
          {/* Free sections first */}
          {freeSections.map((section, index) => (
            <SectionItem 
              key={`section-${index}`} 
              section={section} 
              isEnrolled={isEnrolled}
              onUnlockSection={onUnlockSection}
            />
          ))}
          
          {/* Premium sections */}
          {premiumSections.map((section, index) => (
            <SectionItem 
              key={`premium-section-${index}`} 
              section={section} 
              isEnrolled={isEnrolled}
              onUnlockSection={onUnlockSection}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p>No curriculum available yet.</p>
        </div>
      )}
    </div>
  );
};

const CourseDetails = ({ course }) => {
  const premiumSections = course.sections?.filter(s => s.isLocked && !s.isFree) || [];
  const coursePrice = course.isFree ? 0 : course.price || 0;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Course Details</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-xl text-indigo-800 mb-4 flex items-center">
            <FiBookOpen className="mr-2" /> About This Course
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {course.description || 'No additional description provided.'}
          </p>
          
          {premiumSections.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <FiLock className="mr-2 text-yellow-600" /> Premium Content
              </h4>
              <p className="text-sm text-gray-600">
                This course contains {premiumSections.length} premium {premiumSections.length === 1 ? 'section' : 'sections'} 
                {coursePrice > 0 ? ' included with your enrollment.' : ' available for free.'}
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-xl text-indigo-800 mb-4 flex items-center">
            <FiClock className="mr-2" /> Course Structure
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2 mt-1">•</span>
              <span className="text-gray-700">
                <span className="font-medium">{course.sections?.length || 0} Sections</span> covering key topics
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2 mt-1">•</span>
              <span className="text-gray-700">
                <span className="font-medium">
                  {course.sections?.reduce((sum, section) => sum + (section.lectures?.length || 0), 0) || 0} Lectures
                </span> with detailed explanations
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-500 mr-2 mt-1">•</span>
              <span className="text-gray-700">
                <span className="font-medium">
                  {course.sections?.reduce((sum, section) => sum + (section.materials?.length || 0), 0) || 0} Resources
                </span> for additional learning
              </span>
            </li>
            {premiumSections.length > 0 && (
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2 mt-1">•</span>
                <span className="text-gray-700">
                  <span className="font-medium">{premiumSections.length} Premium sections</span> with exclusive content
                </span>
              </li>
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
  const [unlockingSection, setUnlockingSection] = useState(false);
  const [error, setError] = useState(null);

  const [progress, setProgress] = useState({ completedLectures: [] });



  useEffect(() => {
  const fetchProgress = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:5000/api/progress/${course._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProgress(res.data || { completedLectures: [] });
  };
  fetchProgress();
}, [course._id]);


const totalLectures = course.sections?.reduce(
  (sum, section) => sum + (section.lectures?.length || 0), 0
);
const completedLectures = progress.completedLectures?.length || 0;
const progressPercent = totalLectures > 0
  ? Math.round((completedLectures / totalLectures) * 100)
  : 0;

  const markLectureComplete = async (lectureId) => {
  const token = localStorage.getItem('token');
  await axios.post('http://localhost:5000/api/progress/complete', {
    courseId: course._id,
    lectureId
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // Refetch progress
  const res = await axios.get(`http://localhost:5000/api/progress/${course._id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  setProgress(res.data || { completedLectures: [] });
};
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

        setCourse(courseResponse.data);
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

  const handleUnlockSection = async (sectionId, price) => {
    try {
      setUnlockingSection(true);
      const token = localStorage.getItem('token');
      
      // In a real app, this would process payment for the section
      // For demo purposes, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark as enrolled (in a real app, you'd only unlock the specific section)
      setEnrolled(true);
      
      // Refresh course data
      const courseResponse = await axios.get(
        `http://localhost:5000/api/students/courses/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse(courseResponse.data);
      
      // Show success message
      setError(null);
    } catch (err) {
      console.error('Unlock error:', err);
      setError(err.response?.data?.message || 'Failed to unlock section');
    } finally {
      setUnlockingSection(false);
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
        <CourseDetails course={course} />
        
        {course.sections && (
          <CourseCurriculum 
            course={course} 
            isEnrolled={enrolled}
            onUnlockSection={handleUnlockSection}
          />
        )}
        
        {course.tutor && (
          <InstructorSection instructor={course.tutor} />
        )}
      </div>
    </div>
  );
};

export default CourseView;