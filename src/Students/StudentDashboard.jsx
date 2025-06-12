import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from './CourseCard';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';
import CategoryPills from './CategoryPills';
import RecommendedSection from './RecommendedSection';
import CourseFilter from './CourseFilter';
import ScheduleCalendar from './ScheduleCalendar';

import StudentNavBar from './StudentNavBar';
import { useNavigate } from 'react-router-dom';
import PersonalizedRecommendations from './Interests/PersonalizedRecommendations';
import { FiBook, FiCalendar, FiClock, FiAward, FiSearch, FiFilter, FiChevronRight } from 'react-icons/fi';

const StudentDashboard = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
const [courseProgress, setCourseProgress] = useState({});
const [recentActivity, setRecentActivity] = useState([]);




const [bookmarkedCourses, setBookmarkedCourses] = useState(() => {
  const saved = localStorage.getItem('bookmarkedCourses');
  return saved ? JSON.parse(saved) : [];
});


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

    const navigate = useNavigate();
  const handleNotificationClick = () => {
  navigate('/notifications');
  }
  
  useEffect(() => {
  const fetchActivity = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('https://lms-backend-4b82.onrender.com/api/activity/recent', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentActivity(res.data);
    } catch (err) {
      setRecentActivity([]);
    }
  };
  fetchActivity();
}, []);

  useEffect(() => {
  const fetchAllProgress = async () => {
    const token = localStorage.getItem('token');
    const progressMap = {};
    await Promise.all(
      availableCourses.map(async (course) => {
        try {
          const res = await axios.get(`https://lms-backend-4b82.onrender.com/api/progress/${course._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          progressMap[course._id] = res.data?.completedLectures?.length || 0;
        } catch {
          progressMap[course._id] = 0;
        }
      })
    );
    setCourseProgress(progressMap);
  };

  if (availableCourses.length > 0) {
    fetchAllProgress();
  }
}, [availableCourses]);


  const filters = [
    { id: 'all', label: 'All Courses' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'free', label: 'Free Courses' },
  ];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'programming', name: 'Programming' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'marketing', name: 'Marketing' },
  ];

  const deadlines = [
    {
      id: 1,
      title: 'Final Project Submission',
      course: 'Advanced React',
      dueDate: 'May 25, 2023',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Week 3 Quiz',
      course: 'Data Structures',
      dueDate: 'May 18, 2023',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Peer Review',
      course: 'UI/UX Design',
      dueDate: 'May 20, 2023',
      priority: 'low'
    }
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://lms-backend-4b82.onrender.com/api/students/courses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Add mock data for demonstration
        const coursesWithMockData = response.data.map(course => ({
          ...course,
          isNew: Math.random() > 0.7,
          duration: `${Math.floor(Math.random() * 6) + 2} weeks`,
          price: Math.random() > 0.3 ? Math.floor(Math.random() * 200) + 20 : 0,
          rating: (Math.random() * 2 + 3).toFixed(1),
          students: Math.floor(Math.random() * 500)
        }));
        
        setAvailableCourses(coursesWithMockData);
        setFilteredCourses(coursesWithMockData);
      } catch (err) {
        console.error('Failed to fetch courses', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourses();
  }, []);
 

  useEffect(() => {
    let result = [...availableCourses];
    
    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(course => 
        course.subject?.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Apply level/free filter
    if (activeFilter === 'free') {
      result = result.filter(course => !course.price || course.price === 0);
    } else if (activeFilter !== 'all') {
      result = result.filter(course => 
        course.level?.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query) ||
        course.subject.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        result.sort((a, b) => b.students - a.students);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        result.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    setFilteredCourses(result);
  }, [activeCategory, activeFilter, searchQuery, sortBy, availableCourses]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (sortOption) => {
    setSortBy(sortOption);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  const recommendedCourses = [...availableCourses]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  const startedCourses = availableCourses.filter(
  course => (courseProgress[course._id] || 0) > 0
);

const getNextLecture = (course, completedLectures = []) => {
  for (const section of course.sections || []) {
    for (const lecture of section.lectures || []) {
      if (!completedLectures.includes(lecture._id)) {
        return { section, lecture };
      }
    }
  }
  return null; // All lectures completed
};

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Modern Navbar */}
      <StudentNavBar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, <span className="text-indigo-600">Student!</span></h1>
          <p className="text-gray-500 mt-2">Keep up the great work! You’ve completed <span className="font-semibold text-indigo-600">12 lectures</span> this week.</p>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar (Calendar & Activity) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                <FiAward className="mr-2 text-indigo-500" /> 
                Your Progress
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Courses Enrolled</span>
                  <span className="font-semibold text-indigo-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lectures Completed</span>
                  <span className="font-semibold text-indigo-600">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hours Learned</span>
                  <span className="font-semibold text-indigo-600">16.5</span>
                </div>
              </div>
            </div>

            {/* Schedule Calendar */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                <FiCalendar className="mr-2 text-indigo-500" /> 
                Upcoming Schedule
              </h3>
              <ScheduleCalendar />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                <FiClock className="mr-2 text-indigo-500" /> 
                Recent Activity
              </h3>
              {recentActivity.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No recent activity yet.
                </div>
              ) : (
                <ul className="space-y-3">
                  {recentActivity.slice(0, 4).map((activity, idx) => (
                    <li key={idx} className="flex items-start pb-2 border-b border-gray-100 last:border-0">
                      <div className={`p-1.5 rounded-full mr-3 ${activity.type === 'lecture_completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                        {activity.type === 'lecture_completed' ? (
                          <FiBook size={14} />
                        ) : (
                          <FiAward size={14} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          {activity.type === 'lecture_completed' ? (
                            <>Completed <span className="font-medium">{activity.lecture?.title}</span></>
                          ) : (
                            <>Earned achievement in <span className="font-medium">{activity.course?.title}</span></>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {recentActivity.length > 4 && (
                <button 
                  onClick={() => navigate('/activity')}
                  className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  View all activity <FiChevronRight className="ml-1" />
                </button>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Personalized Recommendations */}
            <PersonalizedRecommendations 
              availableCourses={availableCourses} 
              courseProgress={courseProgress} 
            />

            {/* Continue Learning Section */}
            {startedCourses.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
                  <button 
                    onClick={() => navigate('/my-courses')}
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    View all <FiChevronRight className="ml-1" />
                  </button>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {startedCourses.slice(0, 4).map(course => {
                    const completed = courseProgress[course._id]?.completedLectures || [];
                    const next = getNextLecture(course, completed);
                    if (!next) return null;

                    return (
                      <div key={course._id} className="group bg-gray-50 hover:bg-indigo-50 transition-colors rounded-lg p-5 border border-gray-200">
                        <div className="flex items-start mb-4">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-2 mr-4">
                            <FiBook className="text-indigo-600" size={20} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 group-hover:text-indigo-700">{course.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">Next: {next.lecture.title}</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.round((completed.length / (course.sections?.reduce((acc, section) => acc + (section.lectures?.length || 0), 0) || 1)) * 100)}%` 
                            }}
                          />
                        </div>
                        <button
                          onClick={() => navigate(`/courses/${course._id}?section=${next.section._id}&lecture=${next.lecture._id}`)}
                          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Continue Course
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Courses Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Explore Courses</h2>
                  <p className="text-gray-500 text-sm mt-1">Find your next learning opportunity</p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="duration">Shortest Duration</option>
                  </select>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === category.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Course Grid */}
              {filteredCourses.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {filteredCourses.map(course => (
                    <CourseCard
                      key={course._id}
                      course={course}
                      progressCount={courseProgress[course._id] || 0}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default StudentDashboard;