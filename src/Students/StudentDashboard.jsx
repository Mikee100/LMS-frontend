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
import StatsOverview from './StatsOverview';
import DeadlinesList from './DeadlinesList';
import CourseFilter from './CourseFilter';


const StudentDashboard = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    enrolled: 5,
    completed: 2,
    inProgress: 3,
    certificates: 2
  });

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
        const response = await axios.get('http://localhost:5000/api/students/courses', {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your learning overview</p>
        </div>

        <StatsOverview stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecommendedSection courses={recommendedCourses} />
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-0">All Courses</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <SearchBar onSearch={handleSearch} />
                <SortDropdown onSort={handleSort} />
              </div>
            </div>

            <div className="mb-6">
              <CourseFilter 
                filters={filters} 
                activeFilter={activeFilter} 
                onFilterChange={handleFilterChange} 
              />
              <CategoryPills 
                categories={categories} 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory} 
              />
            </div>

            {filteredCourses.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                {filteredCourses.map(course => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <DeadlinesList deadlines={deadlines} />
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Learning Goals</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Complete 5 courses</span>
                    <span className="text-sm text-gray-500">2/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Master 3 skills</span>
                    <span className="text-sm text-gray-500">1/3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Weekly learning (5h)</span>
                    <span className="text-sm text-gray-500">3.5h/5h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Completed "React Fundamentals"</p>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Started "Advanced JavaScript"</p>
                    <p className="text-sm text-gray-500">4 days ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Earned "JavaScript Expert" badge</p>
                    <p className="text-sm text-gray-500">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;