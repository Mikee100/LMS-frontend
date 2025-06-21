import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaGraduationCap, 
  FaComments, 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaEye,
  FaReply,
  FaShare,
  FaBookmark,
  FaUserFriends,
  FaChalkboardTeacher,
  FaLightbulb,
  FaTrophy,
  FaBell
} from 'react-icons/fa';
import { MdGroups, MdForum } from 'react-icons/md';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { IoMdNotifications } from 'react-icons/io';
import { BsThreeDotsVertical } from 'react-icons/bs';
import axios from 'axios';

const SocialLearningHub = () => {
  const [activeTab, setActiveTab] = useState('study-groups');
  const [studyGroups, setStudyGroups] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data for demonstration
  const mockStudyGroups = [
    {
      _id: '1',
      name: 'Advanced JavaScript Study Group',
      description: 'Deep dive into modern JavaScript concepts, ES6+, and advanced patterns',
      course: { title: 'JavaScript Mastery', thumbnail: 'https://via.placeholder.com/150' },
      creator: { firstName: 'Sarah', lastName: 'Chen', avatar: 'https://via.placeholder.com/40' },
      members: [
        { student: { firstName: 'John', lastName: 'Doe', avatar: 'https://via.placeholder.com/40' } },
        { student: { firstName: 'Emma', lastName: 'Wilson', avatar: 'https://via.placeholder.com/40' } },
        { student: { firstName: 'Mike', lastName: 'Brown', avatar: 'https://via.placeholder.com/40' } }
      ],
      maxMembers: 8,
      memberCount: 4,
      tags: ['JavaScript', 'ES6', 'Advanced'],
      meetingSchedule: { frequency: 'weekly', dayOfWeek: 'wednesday', time: '19:00' },
      stats: { totalDiscussions: 12, totalMeetings: 8 },
      isPrivate: false
    },
    {
      _id: '2',
      name: 'React Fundamentals Group',
      description: 'Learn React from basics to intermediate level with hands-on projects',
      course: { title: 'React Development', thumbnail: 'https://via.placeholder.com/150' },
      creator: { firstName: 'Alex', lastName: 'Johnson', avatar: 'https://via.placeholder.com/40' },
      members: [
        { student: { firstName: 'Lisa', lastName: 'Garcia', avatar: 'https://via.placeholder.com/40' } },
        { student: { firstName: 'David', lastName: 'Lee', avatar: 'https://via.placeholder.com/40' } }
      ],
      maxMembers: 6,
      memberCount: 3,
      tags: ['React', 'Frontend', 'Components'],
      meetingSchedule: { frequency: 'biweekly', dayOfWeek: 'saturday', time: '14:00' },
      stats: { totalDiscussions: 8, totalMeetings: 4 },
      isPrivate: false
    }
  ];

  const mockMentorships = [
    {
      _id: '1',
      mentor: { firstName: 'Dr. Emily', lastName: 'Watson', avatar: 'https://via.placeholder.com/40' },
      mentee: { firstName: 'You', lastName: '', avatar: 'https://via.placeholder.com/40' },
      course: { title: 'Data Science Fundamentals', thumbnail: 'https://via.placeholder.com/150' },
      status: 'active',
      progress: { currentWeek: 3, completedSessions: 6, totalSessions: 12, attendanceRate: 85 },
      nextSession: { scheduledAt: '2024-01-15T20:00:00Z', title: 'Machine Learning Basics' },
      goals: [
        { title: 'Master Python for Data Science', completed: true },
        { title: 'Understand Statistical Analysis', completed: false },
        { title: 'Build First ML Model', completed: false }
      ]
    },
    {
      _id: '2',
      mentor: { firstName: 'Prof. Michael', lastName: 'Chen', avatar: 'https://via.placeholder.com/40' },
      mentee: { firstName: 'You', lastName: '', avatar: 'https://via.placeholder.com/40' },
      course: { title: 'Web Development', thumbnail: 'https://via.placeholder.com/150' },
      status: 'pending',
      progress: { currentWeek: 1, completedSessions: 0, totalSessions: 8, attendanceRate: 0 },
      goals: [
        { title: 'Learn HTML & CSS', completed: false },
        { title: 'Master JavaScript', completed: false },
        { title: 'Build Portfolio Website', completed: false }
      ]
    }
  ];

  const mockForums = [
    {
      _id: '1',
      title: 'General Programming Discussion',
      description: 'Discuss programming concepts, share tips, and ask questions',
      category: 'general',
      creator: { firstName: 'Admin', lastName: '', avatar: 'https://via.placeholder.com/40' },
      stats: { totalTopics: 156, totalReplies: 892, totalViews: 15420 },
      lastActivity: '2024-01-10T15:30:00Z',
      topics: [
        {
          _id: '1',
          title: 'Best practices for code organization',
          author: { firstName: 'John', lastName: 'Smith', avatar: 'https://via.placeholder.com/40' },
          createdAt: '2024-01-10T14:00:00Z',
          views: 245,
          replies: 12,
          likes: 18,
          isPinned: true
        }
      ]
    },
    {
      _id: '2',
      title: 'Career Advice & Job Hunting',
      description: 'Share career tips, interview experiences, and job opportunities',
      category: 'career_advice',
      creator: { firstName: 'Career', lastName: 'Coach', avatar: 'https://via.placeholder.com/40' },
      stats: { totalTopics: 89, totalReplies: 456, totalViews: 8920 },
      lastActivity: '2024-01-09T18:45:00Z',
      topics: [
        {
          _id: '2',
          title: 'How to prepare for technical interviews',
          author: { firstName: 'Sarah', lastName: 'Johnson', avatar: 'https://via.placeholder.com/40' },
          createdAt: '2024-01-09T17:30:00Z',
          views: 189,
          replies: 8,
          likes: 15,
          isPinned: false
        }
      ]
    }
  ];

  useEffect(() => {
    // Load mock data
    setStudyGroups(mockStudyGroups);
    setMentorships(mockMentorships);
    setForums(mockForums);
  }, []);

  const handleCreateNew = (type) => {
    setModalType(type);
    setShowCreateModal(true);
  };

  const handleJoinGroup = async (groupId) => {
    try {
      setLoading(true);
      // API call would go here
      console.log('Joining group:', groupId);
      // Update local state
      setStudyGroups(prev => prev.map(group => 
        group._id === groupId 
          ? { ...group, memberCount: group.memberCount + 1 }
          : group
      ));
    } catch (error) {
      console.error('Error joining group:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentorship = async (mentorId, courseId) => {
    try {
      setLoading(true);
      // API call would go here
      console.log('Requesting mentorship:', { mentorId, courseId });
    } catch (error) {
      console.error('Error requesting mentorship:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStudyGroups = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Study Groups</h3>
        <button
          onClick={() => handleCreateNew('study-group')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus size={14} />
          Create Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyGroups.map((group) => (
          <div key={group._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{group.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <FaUsers size={14} />
                    <span>{group.memberCount}/{group.maxMembers} members</span>
                  </div>
                </div>
                {group.isPrivate && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Private
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {group.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt size={12} />
                  <span>{group.meetingSchedule.frequency}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClock size={12} />
                  <span>{group.meetingSchedule.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {group.members.slice(0, 3).map((member, index) => (
                    <img
                      key={index}
                      src={member.student.avatar}
                      alt={`${member.student.firstName} ${member.student.lastName}`}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                  {group.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                      +{group.members.length - 3}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleJoinGroup(group._id)}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  Join Group
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMentorship = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Mentorship Programs</h3>
        <button
          onClick={() => handleCreateNew('mentorship')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus size={14} />
          Find Mentor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mentorships.map((mentorship) => (
          <div key={mentorship._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="p-6">
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
                    <p className="text-sm text-gray-600">Mentor</p>
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
                <h5 className="font-medium text-gray-800 mb-2">{mentorship.course.title}</h5>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Week {mentorship.progress.currentWeek}</span>
                  <span>{mentorship.progress.completedSessions}/{mentorship.progress.totalSessions} sessions</span>
                  <span>{mentorship.progress.attendanceRate}% attendance</span>
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

              <div className="space-y-2">
                <h6 className="text-sm font-medium text-gray-700">Goals</h6>
                {mentorship.goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className={`w-3 h-3 rounded-full ${
                      goal.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className={goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                      {goal.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderForums = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Discussion Forums</h3>
        <button
          onClick={() => handleCreateNew('forum')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus size={14} />
          Create Forum
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {forums.map((forum) => (
          <div key={forum._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{forum.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{forum.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{forum.stats.totalTopics} topics</span>
                    <span>{forum.stats.totalReplies} replies</span>
                    <span>{forum.stats.totalViews} views</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  forum.category === 'general' ? 'bg-blue-100 text-blue-800' :
                  forum.category === 'career_advice' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {forum.category.replace('_', ' ')}
                </span>
              </div>

              {forum.topics.length > 0 && (
                <div className="space-y-3">
                  <h6 className="text-sm font-medium text-gray-700">Recent Topics</h6>
                  {forum.topics.map((topic) => (
                    <div key={topic._id} className="border-l-4 border-blue-500 pl-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{topic.title}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>by {topic.author.firstName} {topic.author.lastName}</span>
                            <span>{topic.views} views</span>
                            <span>{topic.replies} replies</span>
                          </div>
                        </div>
                        {topic.isPinned && (
                          <FaBookmark className="text-blue-500" size={12} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Last activity: {new Date(forum.lastActivity).toLocaleDateString()}</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    View Forum
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Learning Hub</h1>
          <p className="text-gray-600">Connect, collaborate, and learn together with your peers</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search groups, mentors, or forums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="science">Science</option>
              </select>
              <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <FaFilter size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('study-groups')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'study-groups'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaUsers size={18} />
                <span>Study Groups</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('mentorship')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'mentorship'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaGraduationCap size={18} />
                <span>Mentorship</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('forums')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'forums'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaComments size={18} />
                <span>Forums</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === 'study-groups' && renderStudyGroups()}
          {activeTab === 'mentorship' && renderMentorship()}
          {activeTab === 'forums' && renderForums()}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-600">Active Groups</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaGraduationCap className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Mentorships</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaComments className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-sm text-gray-600">Forums</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaTrophy className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-gray-600">Active Learners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLearningHub;