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

import DeadlinesList from './DeadlinesList';
import CourseFilter from './CourseFilter';
import ScheduleCalendar from './ScheduleCalendar';
import NotificationDropdown from './NotificationDropdown';
import StudentNavBar from './StudentNavBar';


const StudentDashboard = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');


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
    <div>
       <StudentNavBar />
      <div className="min-h-screen bg-gray-50 sm:p-12 ">
       
        <div className="mb-8">
          
          <p className="text-gray-600">Welcome back! Here's your learning overview</p>
        </div>

         
   
        <div className="grid  lg:grid-cols-3 gap-8">
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
             <ScheduleCalendar />
         
            
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;