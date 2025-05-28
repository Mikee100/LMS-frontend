import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiAlertCircle, FiMessageSquare, FiCheck, FiSend } from 'react-icons/fi';
import ChatBox from './ChatBox';

export default function StudentNotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // notification id
  const [replyContent, setReplyContent] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const [showChatBox, setShowChatBox] = useState(false);
  const [chatTutorId, setChatTutorId] = useState(null);
  const [chatTutorName, setChatTutorName] = useState('');

    const handleOpenChat = (notification) => {
    setChatTutorId(notification.sender);
    setChatTutorName(notification.senderName || 'Tutor'); // Use senderName if available
    setShowChatBox(true);
  };
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      alert('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/notifications/mark-all-read', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      alert('Failed to mark all as read');
    }
  };

  // Send reply to tutor
  const handleReply = async (notification) => {
    if (!replyContent.trim()) return;
    setSendingReply(true);
    try {
      const token = localStorage.getItem('token');
      // Send as a direct message to the tutor
      await axios.post('http://localhost:5000/api/messages/student/send/direct', {
        tutorId: notification.sender, // tutor's id
        content: replyContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReplyContent('');
      setReplyingTo(null);
      alert('Reply sent!');
    } catch (err) {
      alert('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

 return (
  <div className="max-w-2xl mx-auto p-6">
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Your Notifications</h2>
        <button
          onClick={markAllAsRead}
          className="text-sm text-indigo-600 hover:text-indigo-800"
          disabled={notifications.every(n => n.read)}
        >
          Mark all as read
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          <ul>
            {notifications.map(notification => (
              <li
                key={notification._id}
                className={`border-b ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="p-4 flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    {notification.type === 'alert' ? (
                      <FiAlertCircle className={`text-lg ${!notification.read ? 'text-yellow-500' : 'text-gray-400'}`} />
                    ) : (
                      <FiMessageSquare className={`text-lg ${!notification.read ? 'text-blue-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {/* Show Open Chat button if notification has a sender (tutor) */}
                    {notification.sender && (
                      <button
                        className="text-xs text-indigo-600 hover:underline mt-1"
                        onClick={() => {
                          setChatTutorId(notification.sender);
                          setChatTutorName(notification.senderName || 'Tutor');
                          setShowChatBox(true);
                        }}
                      >
                        Open Chat
                      </button>
                    )}
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      title="Mark as read"
                    >
                      <FiCheck />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    {/* Show ChatBox if a tutor is selected */}
    {showChatBox && chatTutorId && (
      <div className="mt-6">
        <ChatBox tutorId={chatTutorId} tutorName={chatTutorName} />
        <button
          className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
          onClick={() => setShowChatBox(false)}
        >
          Close Chat
        </button>
      </div>
    )}
  </div>
);
}