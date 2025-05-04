import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaChalkboardTeacher, 
  FaCalendarAlt, 
  FaBook, 
  FaUser, 
  FaSignOutAlt, 
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';
import axios from 'axios';

export default function TutorDashboard() {
  const navigate = useNavigate();
  const [tutorData, setTutorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found");
          return;
        }

        const response = await fetch("http://localhost:5000/api/tutors/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch tutor data");

        const data = await response.json();
        setTutorData(data);
      } catch (error) {
        console.error("Dashboard error:", error);
        setError(error.message); // Capture the error message
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchDashboardData();
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <FaExclamationTriangle className="text-3xl mr-2" />
            <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Retry
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <FaChalkboardTeacher className="text-2xl mr-2" />
            <h1 className="text-xl md:text-2xl font-bold">
              {tutorData?.firstName || 'Tutor'}'s Dashboard
            </h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded text-sm md:text-base"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        {/* Profile Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Welcome, {tutorData?.firstName} {tutorData?.lastName}
              </h2>
              <p className="text-indigo-600">{tutorData?.email}</p>
              {tutorData?.bio && (
                <p className="mt-3 text-gray-600">{tutorData.bio}</p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full inline-block">
                {tutorData?.expertise?.join(', ') || 'No subjects specified'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={<FaUser className="text-blue-500" />}
            title="Students"
            value={tutorData?.students?.length || 0}
            trend="up"
          />
          <StatCard 
            icon={<FaCalendarAlt className="text-green-500" />}
            title="Upcoming Sessions"
            value={tutorData?.upcomingSessions?.length || 0}
            trend="neutral"
          />
          <StatCard 
            icon={<FaBook className="text-purple-500" />}
            title="Courses"
            value={tutorData?.expertise?.length || 0}
            trend="up"
          />
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-500" />
              Recent Activity
            </h3>
          </div>
          {tutorData?.recentActivity?.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {tutorData.recentActivity.map((activity, index) => (
                <li key={index} className="p-4 hover:bg-gray-50">
                  <p className="text-gray-800">{activity.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No recent activity found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// StatCard Component
function StatCard({ icon, title, value, trend }) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-start">
      <div className="p-3 rounded-full bg-opacity-20 bg-gray-200 mr-4">
        {React.cloneElement(icon, { className: `text-xl ${icon.props.className}` })}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 flex items-center ${trendColors[trend]}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} 
            <span className="ml-1">This week</span>
          </p>
        )}
      </div>
    </div>
  );
}