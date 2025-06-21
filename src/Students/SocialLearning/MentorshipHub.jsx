import React, { useState, useEffect } from 'react';
import { 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaClock, 
  FaStar, 
  FaPlus, 
  FaVideo,
  FaMessage,
  FaCheckCircle,
  FaTimesCircle,
  FaUserGraduate
} from 'react-icons/fa';
import { MdSchedule, MdEvent } from 'react-icons/md';

const MentorshipHub = () => {
  const [activeMentorships, setActiveMentorships] = useState([]);
  const [availableMentors, setAvailableMentors] = useState([]);
  const [activeTab, setActiveTab] = useState('my-mentorships');

  // Mock data
  const mockMentorships = [
    {
      _id: '1',
      mentor: { firstName: 'Dr. Emily', lastName: 'Watson', avatar: 'https://via.placeholder.com/40' },
      course: { title: 'Data Science Fundamentals' },
      status: 'active',
      progress: { currentWeek: 3, completedSessions: 6, totalSessions: 12 },
      nextSession: { scheduledAt: '2024-01-15T20:00:00Z', title: 'Machine Learning Basics' },
      goals: [
        { title: 'Master Python for Data Science', completed: true },
        { title: 'Understand Statistical Analysis', completed: false },
        { title: 'Build First ML Model', completed: false }
      ]
    }
  ];

  const mockMentors = [
    {
      _id: '1',
      firstName: 'Dr. Emily',
      lastName: 'Watson',
      avatar: 'https://via.placeholder.com/40',
      expertise: 'Data Science, Machine Learning',
      rating: 4.8,
      totalMentees: 12,
      course: 'Data Science Fundamentals',
      availability: 'Mon, Wed, Fri 6-8 PM'
    },
    {
      _id: '2',
      firstName: 'Prof. Michael',
      lastName: 'Chen',
      avatar: 'https://via.placeholder.com/40',
      expertise: 'Web Development, React',
      rating: 4.9,
      totalMentees: 8,
      course: 'Web Development',
      availability: 'Tue, Thu 7-9 PM'
    }
  ];

  useEffect(() => {
    setActiveMentorships(mockMentorships);
    setAvailableMentors(mockMentors);
  }, []);

  const handleRequestMentorship = (mentorId) => {
    console.log('Requesting mentorship from:', mentorId);
    // API call would go here
  };

  const handleScheduleSession = (mentorshipId) => {
    console.log('Scheduling session for:', mentorshipId);
    // API call would go here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Hub</h1>
          <p className="text-gray-600">Connect with experienced mentors and accelerate your learning</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('my-mentorships')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'my-mentorships'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaGraduationCap size={18} />
                <span>My Mentorships</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('find-mentors')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'find-mentors'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaUserGraduate size={18} />
                <span>Find Mentors</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === 'my-mentorships' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Active Mentorships</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <FaPlus size={14} />
                  Find New Mentor
                </button>
              </div>

              {activeMentorships.length === 0 ? (
                <div className="text-center py-12">
                  <FaGraduationCap className="mx-auto text-gray-400" size={48} />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No active mentorships</h3>
                  <p className="mt-2 text-gray-600">Start by finding a mentor who can help you achieve your learning goals.</p>
                  <button
                    onClick={() => setActiveTab('find-mentors')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Find Mentors
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeMentorships.map((mentorship) => (
                    <div key={mentorship._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={mentorship.mentor.avatar}
                            alt={`${mentorship.mentor.firstName} ${mentorship.mentor.lastName}`}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {mentorship.mentor.firstName} {mentorship.mentor.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">{mentorship.course.title}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          mentorship.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {mentorship.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{mentorship.progress.completedSessions}/{mentorship.progress.totalSessions} sessions</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${(mentorship.progress.completedSessions / mentorship.progress.totalSessions) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {mentorship.nextSession && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                          <div className="flex items-center gap-2 text-sm text-blue-800 mb-1">
                            <FaCalendarAlt size={12} />
                            <span>Next Session</span>
                          </div>
                          <p className="text-sm font-medium text-blue-900">{mentorship.nextSession.title}</p>
                          <p className="text-xs text-blue-700">
                            {new Date(mentorship.nextSession.scheduledAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2 mb-4">
                        <h6 className="text-sm font-medium text-gray-700">Goals</h6>
                        {mentorship.goals.map((goal, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {goal.completed ? (
                              <FaCheckCircle className="text-green-500" size={14} />
                            ) : (
                              <FaTimesCircle className="text-gray-300" size={14} />
                            )}
                            <span className={goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                              {goal.title}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleScheduleSession(mentorship._id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Schedule Session
                        </button>
                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
                          <FaMessage size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'find-mentors' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Available Mentors</h3>
                <div className="flex gap-2">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>All Courses</option>
                    <option>Data Science</option>
                    <option>Web Development</option>
                    <option>Design</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>All Ratings</option>
                    <option>4.5+ Stars</option>
                    <option>4.0+ Stars</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableMentors.map((mentor) => (
                  <div key={mentor._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={mentor.avatar}
                        alt={`${mentor.firstName} ${mentor.lastName}`}
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {mentor.firstName} {mentor.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">{mentor.expertise}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <FaStar className="text-yellow-400" size={14} />
                          <span className="text-sm text-gray-600">{mentor.rating}</span>
                          <span className="text-sm text-gray-500">({mentor.totalMentees} mentees)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <h6 className="text-sm font-medium text-gray-700">Course</h6>
                        <p className="text-sm text-gray-600">{mentor.course}</p>
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-gray-700">Availability</h6>
                        <p className="text-sm text-gray-600">{mentor.availability}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRequestMentorship(mentor._id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Request Mentorship
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaGraduationCap className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeMentorships.length}</p>
                <p className="text-sm text-gray-600">Active Mentorships</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaVideo className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaStar className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaCheckCircle className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Goals Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipHub; 