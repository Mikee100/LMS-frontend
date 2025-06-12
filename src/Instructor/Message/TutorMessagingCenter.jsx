import React, { useState, useEffect } from 'react';
import { FiSend, FiPlus, FiChevronDown, FiSearch, FiMessageSquare, FiUsers, FiBell } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const TABS = [
  { key: 'announcements', label: 'Announcements', icon: <FiBell className="mr-2" /> },
  { key: 'direct', label: 'Direct', icon: <FiMessageSquare className="mr-2" /> },
  { key: 'group', label: 'Group', icon: <FiUsers className="mr-2" /> }
];

export default function TutorMessagingCenter() {
  const [activeTab, setActiveTab] = useState('announcements');
  const [inbox, setInbox] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessagePanel, setShowNewMessagePanel] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch students and courses for composing messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/tutors/all/students', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/courses/my/courses', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setStudents(studentsRes.data.students || []);
        setCourses(coursesRes.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, [token]);

  // Fetch inbox/messages based on tab
  useEffect(() => {
    const fetchMessages = async () => {
         const typeMap = {
      announcements: 'announcement',
      direct: 'direct',
      group: 'group'
    };
    const messageType = typeMap[activeTab] || activeTab;
    const baseUrl = 'http://localhost:5000/api/messages/inbox';
    const url = `${baseUrl}?type=${messageType}`;

      setLoading(true);
      try {
        const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        setInbox(res.data.messages || []);
        if (res.data.messages?.length) {
          setSelectedConversation(res.data.messages[0]);
        }
      } catch (error) {
        setInbox([]);
        setSelectedConversation(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [activeTab, token]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      let endpoint = 'direct';
      if (activeTab === 'announcements') endpoint = 'announcement';
      else if (activeTab === 'group') endpoint = 'group';

      await axios.post(`http://localhost:5000/api/messages/send/${endpoint}`, {
        recipients: selectedRecipients,
        content: messageContent,
        ...(activeTab === 'announcements' && { course: selectedCourse })
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessageContent('');
      setShowNewMessagePanel(false);
      setSelectedRecipients([]);
    } catch (error) {
      console.error('Message send error:', error);
    }
  };

  // Filter messages based on search term
const filteredInbox = inbox.filter(msg => {
  if (activeTab === 'announcements') {
    return msg.course && msg.course.title &&
      msg.course.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
  return (msg.senderName && msg.senderName.toLowerCase().includes(searchTerm.toLowerCase())) ||
         (msg.content && msg.content.toLowerCase().includes(searchTerm.toLowerCase()));
});

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 md:w-20 bg-indigo-700 flex flex-col items-center py-4">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`p-3 rounded-lg mb-4 ${activeTab === tab.key ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-600'}`}
            title={tab.label}
          >
            {React.cloneElement(tab.icon, { className: 'text-xl' })}
          </button>
        ))}
      </div>

      {/* Conversations List */}
      <div className="w-full md:w-80 border-r bg-white">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {TABS.find(t => t.key === activeTab)?.label}
            </h2>
            <button
              onClick={() => setShowNewMessagePanel(true)}
              className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              title="New Message"
            >
              <FiPlus />
            </button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search messages..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="divide-y">
            {filteredInbox.map(msg => (
              <li
                key={msg._id}
                onClick={() => setSelectedConversation(msg)}
                className={`p-4 cursor-pointer ${selectedConversation?._id === msg._id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900 truncate">
                    {activeTab === 'announcements' ? msg.course?.title : msg.senderName}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {msg.content.slice(0, 60)}...
                </p>
                {msg.unreadCount > 0 && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-indigo-600 text-white rounded-full">
                    {msg.unreadCount}
                  </span>
                )}
              </li>
            ))}
            {filteredInbox.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No messages found
              </div>
            )}
          </ul>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">
                  {activeTab === 'announcements' ? 
                    selectedConversation.course?.title : 
                    selectedConversation.senderName}
                </h3>
                {activeTab === 'announcements' && (
                  <p className="text-sm text-gray-500">
                    Announcement for {selectedConversation.recipients?.length || 0} students
                  </p>
                )}
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <FiChevronDown />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {selectedConversation.thread?.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.senderId === 'me' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.senderId === 'me' ? 'text-indigo-200' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center"
              >
                <input
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message..."
                />
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors"
                  type="submit"
                >
                  <FiSend />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                <FiMessageSquare className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No conversation selected</h3>
              <p className="text-gray-500">
                Select a conversation from the list or create a new message
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Message Panel */}
      <AnimatePresence>
        {showNewMessagePanel && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-white z-10 shadow-xl md:w-96 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Message</h2>
              <button
                onClick={() => {
                  setShowNewMessagePanel(false);
                  setSelectedRecipients([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            {activeTab === 'announcements' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedCourse?._id || ''}
                  onChange={(e) => {
                    const course = courses.find(c => c._id === e.target.value);
                    setSelectedCourse(course);
                  }}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {activeTab === 'direct' ? 'Recipient' : 'Recipients'}
              </label>
              <select
                multiple={activeTab !== 'direct'}
                className="w-full border rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedRecipients}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions);
                  setSelectedRecipients(options.map(opt => opt.value));
                }}
              >
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Write your message here..."
              />
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!messageContent.trim() || 
                (activeTab === 'announcements' && !selectedCourse) || 
                selectedRecipients.length === 0}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
            >
              Send Message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}