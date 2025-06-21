import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPlus, 
  FaComment,
  FaHeart,
  FaShare,
  FaBookmark,
  FaEllipsisH,
  FaVideo,
  FaFileAlt,
  FaLink,
  FaStar
} from 'react-icons/fa';
import { MdGroups, MdSchedule, MdEvent } from 'react-icons/md';
import { BiMessageRoundedDetail } from 'react-icons/bi';

const StudyGroupDetail = ({ groupId }) => {
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [newResource, setNewResource] = useState({ title: '', type: 'document', url: '', description: '' });
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);

  // Mock data for demonstration
  const mockGroup = {
    _id: groupId,
    name: 'Advanced JavaScript Study Group',
    description: 'Deep dive into modern JavaScript concepts, ES6+, and advanced patterns. We focus on practical applications and real-world projects.',
    course: { 
      title: 'JavaScript Mastery', 
      thumbnail: 'https://via.placeholder.com/150',
      instructor: 'Dr. Sarah Chen'
    },
    creator: { 
      firstName: 'Sarah', 
      lastName: 'Chen', 
      avatar: 'https://via.placeholder.com/40',
      role: 'leader'
    },
    members: [
      { 
        student: { firstName: 'John', lastName: 'Doe', avatar: 'https://via.placeholder.com/40' },
        role: 'moderator',
        joinedAt: '2024-01-01'
      },
      { 
        student: { firstName: 'Emma', lastName: 'Wilson', avatar: 'https://via.placeholder.com/40' },
        role: 'member',
        joinedAt: '2024-01-05'
      },
      { 
        student: { firstName: 'Mike', lastName: 'Brown', avatar: 'https://via.placeholder.com/40' },
        role: 'member',
        joinedAt: '2024-01-10'
      },
      { 
        student: { firstName: 'Lisa', lastName: 'Garcia', avatar: 'https://via.placeholder.com/40' },
        role: 'member',
        joinedAt: '2024-01-15'
      }
    ],
    maxMembers: 8,
    memberCount: 5,
    tags: ['JavaScript', 'ES6', 'Advanced', 'Web Development'],
    meetingSchedule: { 
      frequency: 'weekly', 
      dayOfWeek: 'wednesday', 
      time: '19:00',
      timezone: 'UTC-5'
    },
    stats: { 
      totalDiscussions: 12, 
      totalMeetings: 8,
      totalResources: 15,
      averageParticipation: 85
    },
    discussions: [
      {
        _id: '1',
        title: 'Understanding Promises and Async/Await',
        content: 'Let\'s discuss the differences between Promises and Async/Await patterns. What are your experiences with error handling?',
        author: { firstName: 'John', lastName: 'Doe', avatar: 'https://via.placeholder.com/40' },
        createdAt: '2024-01-10T14:00:00Z',
        likes: 8,
        replies: [
          {
            content: 'I find async/await much more readable than promise chains. The error handling is also cleaner with try/catch.',
            author: { firstName: 'Emma', lastName: 'Wilson', avatar: 'https://via.placeholder.com/40' },
            createdAt: '2024-01-10T15:30:00Z',
            likes: 3
          }
        ]
      },
      {
        _id: '2',
        title: 'Best practices for ES6 modules',
        content: 'What are your favorite ES6 module patterns? Let\'s share some tips and tricks.',
        author: { firstName: 'Sarah', lastName: 'Chen', avatar: 'https://via.placeholder.com/40' },
        createdAt: '2024-01-08T10:00:00Z',
        likes: 12,
        replies: []
      }
    ],
    resources: [
      {
        _id: '1',
        title: 'JavaScript ES6+ Cheat Sheet',
        type: 'document',
        url: '#',
        description: 'Comprehensive guide to ES6+ features',
        uploadedBy: { firstName: 'Sarah', lastName: 'Chen' },
        uploadedAt: '2024-01-05T12:00:00Z'
      },
      {
        _id: '2',
        title: 'Async JavaScript Deep Dive',
        type: 'video',
        url: '#',
        description: 'Video tutorial on async programming patterns',
        uploadedBy: { firstName: 'John', lastName: 'Doe' },
        uploadedAt: '2024-01-03T16:00:00Z'
      }
    ],
    activities: [
      {
        _id: '1',
        type: 'meeting',
        title: 'Weekly Study Session',
        description: 'Review of ES6 modules and async programming',
        scheduledAt: '2024-01-17T19:00:00Z',
        duration: 60,
        participants: 4
      },
      {
        _id: '2',
        type: 'assignment',
        title: 'Build a Promise-based API wrapper',
        description: 'Create a utility class for handling API calls with promises',
        scheduledAt: '2024-01-20T23:59:00Z',
        participants: 3
      }
    ],
    isPrivate: false
  };

  useEffect(() => {
    // Simulate API call
    setGroup(mockGroup);
  }, [groupId]);

  const handleAddDiscussion = () => {
    if (newDiscussion.title && newDiscussion.content) {
      const discussion = {
        _id: Date.now().toString(),
        ...newDiscussion,
        author: { firstName: 'You', lastName: '', avatar: 'https://via.placeholder.com/40' },
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: []
      };
      setGroup(prev => ({
        ...prev,
        discussions: [discussion, ...prev.discussions],
        stats: { ...prev.stats, totalDiscussions: prev.stats.totalDiscussions + 1 }
      }));
      setNewDiscussion({ title: '', content: '' });
      setShowDiscussionModal(false);
    }
  };

  const handleAddResource = () => {
    if (newResource.title && newResource.url) {
      const resource = {
        _id: Date.now().toString(),
        ...newResource,
        uploadedBy: { firstName: 'You', lastName: '' },
        uploadedAt: new Date().toISOString()
      };
      setGroup(prev => ({
        ...prev,
        resources: [resource, ...prev.resources],
        stats: { ...prev.stats, totalResources: prev.stats.totalResources + 1 }
      }));
      setNewResource({ title: '', type: 'document', url: '', description: '' });
      setShowResourceModal(false);
    }
  };

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                {group.isPrivate && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                    Private
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg mb-4">{group.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FaUsers size={16} />
                  <span>{group.memberCount}/{group.maxMembers} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt size={16} />
                  <span>{group.meetingSchedule.frequency} meetings</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock size={16} />
                  <span>{group.meetingSchedule.time} {group.meetingSchedule.timezone}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <FaPlus size={14} />
                Invite
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                <FaEllipsisH size={14} />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {group.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: MdGroups },
              { id: 'discussions', label: 'Discussions', icon: BiMessageRoundedDetail },
              { id: 'resources', label: 'Resources', icon: FaFileAlt },
              { id: 'activities', label: 'Activities', icon: MdSchedule },
              { id: 'members', label: 'Members', icon: FaUsers }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <FaComment className="text-blue-600" size={20} />
                    <h3 className="font-semibold text-gray-800">Discussions</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{group.stats.totalDiscussions}</p>
                  <p className="text-sm text-gray-600">Active conversations</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <MdEvent className="text-green-600" size={20} />
                    <h3 className="font-semibold text-gray-800">Meetings</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{group.stats.totalMeetings}</p>
                  <p className="text-sm text-gray-600">Completed sessions</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <FaFileAlt className="text-purple-600" size={20} />
                    <h3 className="font-semibold text-gray-800">Resources</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{group.stats.totalResources}</p>
                  <p className="text-sm text-gray-600">Shared materials</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Discussions</h3>
                  <div className="space-y-3">
                    {group.discussions.slice(0, 3).map((discussion) => (
                      <div key={discussion._id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <h4 className="font-medium text-gray-800">{discussion.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>by {discussion.author.firstName} {discussion.author.lastName}</span>
                          <span>{discussion.likes} likes</span>
                          <span>{discussion.replies.length} replies</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Activities</h3>
                  <div className="space-y-3">
                    {group.activities.slice(0, 3).map((activity) => (
                      <div key={activity._id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {activity.type === 'meeting' ? (
                            <FaVideo className="text-blue-600" size={14} />
                          ) : (
                            <FaFileAlt className="text-green-600" size={14} />
                          )}
                          <h4 className="font-medium text-gray-800">{activity.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{new Date(activity.scheduledAt).toLocaleDateString()}</span>
                          <span>{activity.participants} participants</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'discussions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Discussions</h3>
                <button
                  onClick={() => setShowDiscussionModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaPlus size={14} />
                  New Discussion
                </button>
              </div>

              <div className="space-y-6">
                {group.discussions.map((discussion) => (
                  <div key={discussion._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={discussion.author.avatar}
                          alt={`${discussion.author.firstName} ${discussion.author.lastName}`}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">{discussion.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>by {discussion.author.firstName} {discussion.author.lastName}</span>
                            <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaEllipsisH size={16} />
                      </button>
                    </div>

                    <p className="text-gray-700 mb-4">{discussion.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                          <FaHeart size={14} />
                          <span>{discussion.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                          <BiMessageRoundedDetail size={16} />
                          <span>{discussion.replies.length} replies</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                          <FaShare size={14} />
                          <span>Share</span>
                        </button>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaBookmark size={14} />
                      </button>
                    </div>

                    {discussion.replies.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h5 className="font-medium text-gray-800 mb-3">Replies</h5>
                        <div className="space-y-3">
                          {discussion.replies.map((reply, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <img
                                src={reply.author.avatar}
                                alt={`${reply.author.firstName} ${reply.author.lastName}`}
                                className="w-8 h-8 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-800">
                                    {reply.author.firstName} {reply.author.lastName}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-700">{reply.content}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm">
                                    <FaHeart size={12} />
                                    <span>{reply.likes}</span>
                                  </button>
                                  <button className="text-gray-500 hover:text-blue-600 text-sm">Reply</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Resources</h3>
                <button
                  onClick={() => setShowResourceModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaPlus size={14} />
                  Add Resource
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.resources.map((resource) => (
                  <div key={resource._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {resource.type === 'video' ? (
                          <FaVideo className="text-red-600" size={16} />
                        ) : resource.type === 'link' ? (
                          <FaLink className="text-blue-600" size={16} />
                        ) : (
                          <FaFileAlt className="text-green-600" size={16} />
                        )}
                        <span className="text-xs text-gray-500 uppercase">{resource.type}</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaEllipsisH size={14} />
                      </button>
                    </div>

                    <h4 className="font-medium text-gray-800 mb-2">{resource.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>by {resource.uploadedBy.firstName} {resource.uploadedBy.lastName}</span>
                      <span>{new Date(resource.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Activities</h3>
              <div className="space-y-4">
                {group.activities.map((activity) => (
                  <div key={activity._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {activity.type === 'meeting' ? (
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <FaVideo className="text-blue-600" size={20} />
                          </div>
                        ) : (
                          <div className="p-3 bg-green-100 rounded-lg">
                            <FaFileAlt className="text-green-600" size={20} />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                          <p className="text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        new Date(activity.scheduledAt) > new Date() 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {new Date(activity.scheduledAt) > new Date() ? 'Upcoming' : 'Completed'}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt size={14} />
                        <span>{new Date(activity.scheduledAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock size={14} />
                        <span>{activity.duration || 'No duration'} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers size={14} />
                        <span>{activity.participants} participants</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.members.map((member, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={member.student.avatar}
                        alt={`${member.student.firstName} ${member.student.lastName}`}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {member.student.firstName} {member.student.lastName}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          member.role === 'leader' ? 'bg-purple-100 text-purple-800' :
                          member.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discussion Modal */}
      {showDiscussionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">New Discussion</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Discussion title"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Discussion content"
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddDiscussion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Create Discussion
              </button>
              <button
                onClick={() => setShowDiscussionModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Resource</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Resource title"
                value={newResource.title}
                onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={newResource.type}
                onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="document">Document</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
              </select>
              <input
                type="url"
                placeholder="Resource URL"
                value={newResource.url}
                onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Resource description"
                value={newResource.description}
                onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddResource}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Resource
              </button>
              <button
                onClick={() => setShowResourceModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroupDetail; 