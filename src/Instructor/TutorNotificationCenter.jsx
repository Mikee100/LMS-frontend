import { useState, useEffect } from 'react';
import { FiSend, FiUsers, FiMessageSquare, FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import { format } from 'date-fns';

const TutorNotificationCenter = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
 const [sentMessages, setSentMessages] = useState([]);
const [loadingSent, setLoadingSent] = useState(true);
const [errorSent, setErrorSent] = useState(null);

  const [enrolledStudents, setEnrolledStudents] = useState([]);

  // Fetch tutor's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://lms-backend-4b82.onrender.com/api/courses/my/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      }
    };
    fetchCourses();
  }, []);

  // Fetch enrolled students when course is selected
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchEnrolledStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://lms-backend-4b82.onrender.com/api/courses/${selectedCourse}/enrollments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEnrolledStudents(response.data);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError('Failed to load enrolled students');
      }
    };
    fetchEnrolledStudents();
  }, [selectedCourse]);

 

  // Fetch sent messages
useEffect(() => {
  const fetchSentMessages = async () => {
    try {
      setLoadingSent(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://lms-backend-4b82.onrender.com/api/notifications/sent', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSentMessages(response.data);
      setErrorSent(null);
    } catch (err) {
      console.error('Error fetching sent messages:', err);
      setErrorSent('Failed to load sent notifications.');
    } finally {
      setLoadingSent(false);
    }
  };

  fetchSentMessages();
}, []);

 const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!selectedCourse || !message.trim()) return;

  try {
    setSending(true);
    setError(null);

    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user')); // assuming tutor info is stored as 'user'
    const tutorId = userData?.id;

    if (!tutorId) throw new Error('Tutor ID not found');

    await Promise.all(
      enrolledStudents.map(student =>
        axios.post(
          'https://lms-backend-4b82.onrender.com/api/notifications/send',
          {
            user: student._id,            // recipient
            sender: tutorId,              // sender (tutor)
            course: selectedCourse,
            message,
            type: 'tutor-message'
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      )
    );

    setSuccess(true);
    setMessage('');
    setTimeout(() => setSuccess(false), 3000);

    const newMessage = {
      course: courses.find(c => c._id === selectedCourse),
      message,
      createdAt: new Date().toISOString(),
      recipients: enrolledStudents.length
    };
    setSentMessages(prev => [newMessage, ...prev]);

  } catch (err) {
    console.error('Send message error:', err);
    setError(err.response?.data?.error || err.message || 'Failed to send message');
  } finally {
    setSending(false);
  }
};



  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-700 text-white p-6">
          <h1 className="text-2xl font-bold flex items-center">
            <FiMessageSquare className="mr-3" />
            Notification Center
          </h1>
          <p className="mt-2 opacity-90">
            Communicate with your students through notifications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column - Message Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiSend className="mr-2" />
                Send New Notification
              </h2>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Course
                  </label>
                  <select
                    value={selectedCourse || ''}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Choose a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCourse && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-blue-800">
                      <FiUsers className="mr-2" />
                      <span>
                        This will be sent to {enrolledStudents.length} enrolled student{enrolledStudents.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    rows="5"
                    placeholder="Type your notification message here..."
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sending || !selectedCourse}
                    className={`px-6 py-2 rounded-lg text-white font-medium flex items-center ${
                      sending || !selectedCourse
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {sending ? (
                      'Sending...'
                    ) : (
                      <>
                        <FiSend className="mr-2" />
                        Send Notification
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex items-center text-red-700">
                      <FiAlertCircle className="mr-2" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {loadingSent ? (
  <div className="text-center py-8 text-gray-500">Loading notifications...</div>
) : errorSent ? (
  <div className="text-center py-8 text-red-500">{errorSent}</div>
) : sentMessages.length === 0 ? (
  <div className="text-center py-8 text-gray-400">
    <FiClock className="mx-auto mb-2 text-2xl" />
    <p>No notifications sent yet</p>
  </div>
) : (
  <div className="space-y-4">
    {sentMessages.map((msg, index) => (
      <div
        key={index}
        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">
              {msg.course?.title || 'Course'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <FiUsers className="mr-1" />
          Sent to {msg.recipients} student{msg.recipients !== 1 ? 's' : ''}
        </div>
      </div>
    ))}
  </div>
)}

              </form>
            </div>
          </div>

          {/* Right Column - Sent Messages */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FiClock className="mr-2" />
                Sent Notifications
              </h2>

              {sentMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No notifications sent yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentMessages.map((msg, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {msg.course?.title || 'Course'}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 flex items-center">
                        <FiUsers className="mr-1" />
                        Sent to {msg.recipients} student{msg.recipients !== 1 ? 's' : ''}
                      </div>
                    </div>
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

export default TutorNotificationCenter;