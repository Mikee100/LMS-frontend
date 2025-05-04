import { useState } from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('enrolled');

  // Placeholder data
  const stats = [
    { title: 'Enrolled Courses', value: '12', color: 'indigo' },
    { title: 'Courses in Progress', value: '5', color: 'blue' },
    { title: 'Completed Courses', value: '7', color: 'green' }
  ];

  const enrolledCourses = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts and design patterns',
      progress: 0.65,
      completed: false,
      thumbnail: 'https://source.unsplash.com/random/400x300/?react'
    },
    {
      id: 2,
      title: 'Node.js Microservices',
      description: 'Build scalable microservices architecture with Node.js',
      progress: 0.9,
      completed: false,
      thumbnail: 'https://source.unsplash.com/random/400x300/?nodejs'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of great user interface design',
      progress: 1,
      completed: true,
      thumbnail: 'https://source.unsplash.com/random/400x300/?design'
    }
  ];

  const availableCourses = [
    {
      id: 4,
      title: 'Machine Learning Basics',
      description: 'Introduction to ML concepts with Python',
      level: 'Intermediate',
      subject: 'Data Science',
      thumbnail: 'https://source.unsplash.com/random/400x300/?machinelearning'
    },
    {
      id: 5,
      title: 'DevOps with Docker & Kubernetes',
      description: 'Containerization and orchestration for modern apps',
      level: 'Advanced',
      subject: 'DevOps',
      thumbnail: 'https://source.unsplash.com/random/400x300/?devops'
    },
    {
      id: 6,
      title: 'Mobile App Development with Flutter',
      description: 'Build cross-platform apps with Flutter framework',
      level: 'Beginner',
      subject: 'Mobile Development',
      thumbnail: 'https://source.unsplash.com/random/400x300/?flutter'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      date: '2023-05-15',
      progress: 65,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Node.js Microservices',
      date: '2023-05-10',
      progress: 90,
      status: 'Active'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      date: '2023-04-28',
      progress: 100,
      status: 'Completed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium">JS</span>
              </div>
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back, John!</h2>
          <p className="opacity-90">Continue your learning journey. You have 3 courses in progress.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`bg-white rounded-xl shadow p-6 border-t-4 border-${stat.color}-500`}>
              <h3 className="text-lg font-medium text-gray-900">{stat.title}</h3>
              <p className={`text-3xl font-bold text-${stat.color}-600 mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'enrolled'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Courses
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'available'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available Courses
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'enrolled' ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {course.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(course.progress * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${Math.round(course.progress * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <Link
                        to="#"
                        className="w-full block text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        {course.completed ? 'Review Course' : 'Continue'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableCourses.map(course => (
                  <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                          {course.level}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{course.description}</p>
                      <p className="text-sm text-gray-500 mb-4">{course.subject}</p>
                      <div className="flex justify-between items-center">
                        <Link
                          to="#"
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          View Details
                        </Link>
                        <button
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded"
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentActivity.map(activity => (
              <li key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <span className="text-indigo-600 font-medium">
                        {activity.title.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">
                        Last accessed: {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.status}
                    </span>
                    <div className="w-24">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{activity.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full" 
                          style={{ width: `${activity.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;