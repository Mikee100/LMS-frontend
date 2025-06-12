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

        const response = await fetch("https://lms-backend-4b82.onrender.com/api/tutors/dashboard", {
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
  {/* Quick Actions */}
  <div className="flex flex-wrap gap-4 mb-6">
    <button onClick={() => navigate('/instructor/create-course')} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 flex items-center">
      <FaBook className="mr-2" /> Create New Course
    </button>
    <button onClick={() => navigate('/instructor/schedule-session')} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 flex items-center">
      <FaCalendarAlt className="mr-2" /> Schedule Session
    </button>
    <button onClick={() => navigate('/instructor/messages')} className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 flex items-center">
      <FaUser className="mr-2" /> Message Students
    </button>
  </div>

  {/* Stats Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard icon={<FaUser className="text-blue-500" />} title="Total Students" value={tutorData?.students?.length || 0} trend="up" />
    <StatCard icon={<FaBook className="text-purple-500" />} title="Active Courses" value={tutorData?.courses?.length || 0} trend="up" />
    <StatCard icon={<FaCalendarAlt className="text-green-500" />} title="Upcoming Sessions" value={tutorData?.upcomingSessions?.length || 0} trend="neutral" />
    <StatCard icon={<FaCalendarAlt className="text-gray-500" />} title="Completed Sessions" value={tutorData?.completedSessions?.length || 0} trend="up" />
    <StatCard icon={<FaUser className="text-yellow-500" />} title="Average Rating" value={tutorData?.averageRating?.toFixed(1) || 'N/A'} trend="neutral" />
    <StatCard icon={<FaBook className="text-green-700" />} title="Total Earnings" value={`$${tutorData?.earnings?.toFixed(2) || '0.00'}`} trend="up" />
  </div>

  {/* Recent Sessions Table */}
  <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold flex items-center">
        <FaCalendarAlt className="mr-2 text-indigo-500" />
        Recent Sessions
      </h3>
    </div>
    {tutorData?.recentSessions?.length > 0 ? (
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tutorData.recentSessions.map((session, idx) => (
            <tr key={idx}>
              <td className="px-6 py-4">{session.studentName}</td>
              <td className="px-6 py-4">{session.courseTitle}</td>
              <td className="px-6 py-4">{new Date(session.date).toLocaleString()}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${session.status === 'completed' ? 'bg-green-100 text-green-700' : session.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                  {session.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button onClick={() => navigate(`/instructor/session/${session.id}`)} className="text-indigo-600 hover:underline text-sm">Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="p-6 text-center text-gray-500">No recent sessions found</div>
    )}
  </div>

  {/* Latest Feedback */}
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <FaUser className="mr-2 text-yellow-500" />
      Latest Feedback
    </h3>
    {tutorData?.latestFeedback?.length > 0 ? (
      <ul className="space-y-4">
        {tutorData.latestFeedback.map((feedback, idx) => (
          <li key={idx} className="border-b pb-2">
            <div className="flex items-center">
              <span className="font-semibold">{feedback.studentName}</span>
              <span className="ml-2 text-yellow-500">{'★'.repeat(feedback.rating)}</span>
            </div>
            <p className="text-gray-700">{feedback.comment}</p>
            <p className="text-xs text-gray-400">{new Date(feedback.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-gray-500">No feedback yet</div>
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