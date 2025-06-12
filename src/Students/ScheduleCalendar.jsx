import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiClock, FiBook, FiUser, FiPlus } from 'react-icons/fi';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';

const ScheduleCalendar = () => {
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


   const token = localStorage.getItem('token');
  if (!token) {
  console.error("No token found. User might not be logged in.");
  setError("User not authenticated");
  setLoading(false);
  return;
}


  useEffect(() => {
    const fetchScheduledClasses = async () => {
      try {
       
       // In ScheduleCalendar.js, update the fetch call:
const response = await axios.get('http://localhost:5000/api/schedule/student', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});;
        setScheduledClasses(response.data);
      } catch (err) {
        console.error('Error fetching scheduled classes:', err);
        setError('Failed to load scheduled classes');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledClasses();
  }, []);

  const getDateStatus = (date) => {
    const parsedDate = parseISO(date);
    if (isToday(parsedDate)) return 'Today';
    if (isTomorrow(parsedDate)) return 'Tomorrow';
    return format(parsedDate, 'MMM dd, yyyy');
  };

  const getTimeRange = (start, end) => {
    return `${format(parseISO(start), 'h:mm a')} - ${format(parseISO(end), 'h:mm a')}`;
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <FiCalendar className="mr-2" /> Class Schedule
        </h2>
        <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm">
          <FiPlus className="mr-1" /> Add Class
        </button>
      </div>

      {scheduledClasses.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p>No classes scheduled yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledClasses.map((classItem) => (
            <div key={classItem._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{classItem.title}</h3>
                  {classItem.course && (
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <FiBook className="mr-1" /> {classItem.course.title}
                    </p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  isToday(parseISO(classItem.start)) 
                    ? 'bg-blue-100 text-blue-800' 
                    : isTomorrow(parseISO(classItem.start))
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {getDateStatus(classItem.start)}
                </span>
              </div>
              
              <div className="mt-3 flex items-center text-sm text-gray-600">
                <FiClock className="mr-1" />
                <span>{getTimeRange(classItem.start, classItem.end)}</span>
              </div>
              
              {classItem.description && (
                <p className="mt-2 text-sm text-gray-600">{classItem.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;