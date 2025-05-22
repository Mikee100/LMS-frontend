import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FiCalendar, FiClock, FiBook, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const localizer = momentLocalizer(moment);

function TutorSchedulePage() {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    start: '',
    end: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/courses/my/courses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      toast.error('Failed to load courses');
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/schedule', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      const formatted = data.map(event => ({
        id: event._id,
        title: `${event.title}`,
        courseTitle: event.course?.title,
        description: event.description,
        start: new Date(event.start),
        end: new Date(event.end),
        courseId: event.course?._id
      }));
      setEvents(formatted);
    } catch (err) {
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSchedule();
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to schedule class');
      
      toast.success('Class scheduled successfully!');
      await fetchSchedule();
      setFormData({ 
        courseId: '', 
        title: '', 
        description: '', 
        start: '', 
        end: '' 
      });
    } catch (err) {
      console.error(err.message);
      toast.error('Error scheduling class');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/schedule/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete event');
      
      toast.success('Event deleted successfully');
      await fetchSchedule();
      setShowModal(false);
    } catch (err) {
      console.error(err.message);
      toast.error('Error deleting event');
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Schedule Form */}
        <div className="bg-white rounded-xl shadow-md p-6 flex-1">
          <div className="flex items-center mb-6">
            <FiCalendar className="text-indigo-600 mr-2 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Schedule a New Class</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a course</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Introduction to React"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  name="start"
                  value={formData.start}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  name="end"
                  value={formData.end}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add class details..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPlus className="mr-2" />
              Schedule Class
            </button>
          </form>
        </div>

        {/* Upcoming Classes Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 w-full md:w-80">
          <div className="flex items-center mb-6">
            <FiClock className="text-indigo-600 mr-2 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Classes</h2>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No upcoming classes scheduled</p>
          ) : (
            <div className="space-y-4">
              {events
                .filter(event => new Date(event.start) > new Date())
                .sort((a, b) => new Date(a.start) - new Date(b.start))
                .slice(0, 3)
                .map(event => (
                  <div 
                    key={event.id} 
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleEventSelect(event)}
                  >
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.courseTitle}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {moment(event.start).format('MMM D, h:mm A')} - {moment(event.end).format('h:mm A')}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center mb-6">
          <FiBook className="text-indigo-600 mr-2 text-xl" />
          <h2 className="text-2xl font-bold text-gray-800">Your Teaching Schedule</h2>
        </div>
        
        {loading ? (
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        ) : (
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleEventSelect}
              eventPropGetter={(event) => {
                const backgroundColor = new Date(event.start) < new Date() ? '#9CA3AF' : '#4F46E5';
                return { style: { backgroundColor, color: 'white', border: 'none' } };
              }}
            />
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedEvent.courseTitle && (
                  <div>
                    <p className="text-sm text-gray-500">Course</p>
                    <p className="font-medium">{selectedEvent.courseTitle}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Start</p>
                    <p className="font-medium">
                      {moment(selectedEvent.start).format('MMM D, YYYY h:mm A')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End</p>
                    <p className="font-medium">
                      {moment(selectedEvent.end).format('MMM D, YYYY h:mm A')}
                    </p>
                  </div>
                </div>
                
                {selectedEvent.description && (
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      courseId: selectedEvent.courseId,
                      title: selectedEvent.title,
                      description: selectedEvent.description,
                      start: moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm'),
                      end: moment(selectedEvent.end).format('YYYY-MM-DDTHH:mm')
                    });
                    setShowModal(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <FiEdit2 className="mr-2" />
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TutorSchedulePage;