import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ChatBox({ tutorId, tutorName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/messages/conversation/${tutorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    };
    fetchMessages();
  }, [tutorId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setSending(true);
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/api/messages/student/send/direct', {
      tutorId,
      content: input
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setInput('');
    // Refetch messages after sending
    const res = await axios.get(`http://localhost:5000/api/messages/conversation/${tutorId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMessages(res.data);
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[400px] border rounded shadow bg-white">
      <div className="p-2 border-b font-semibold">{tutorName}</div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50">
        {messages.map(msg => (
          <div
            key={msg._id}
            className={`max-w-xs px-3 py-2 rounded-lg ${
              msg.sender === tutorId
                ? 'bg-blue-100 self-start'
                : 'bg-green-100 self-end ml-auto'
            }`}
          >
            {msg.content}
            <div className="text-xs text-gray-400 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          disabled={sending}
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded"
          onClick={sendMessage}
          disabled={sending}
        >
          Send
        </button>
      </div>
    </div>
  );
}