import React from 'react';
import { FiCalendar, FiAlertCircle } from 'react-icons/fi';

const priorityColors = {
  high: 'text-red-600 bg-red-100',
  medium: 'text-yellow-600 bg-yellow-100',
  low: 'text-green-600 bg-green-100',
};

const UpcomingAssignments = ({ assignments }) => {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FiAlertCircle className="mr-2 text-indigo-600" /> Upcoming Assignments
        </h3>
        <p className="text-gray-500">No upcoming assignments.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FiCalendar className="mr-2 text-indigo-600" /> Upcoming Assignments
      </h3>
      <ul className="space-y-3">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
            <div>
              <p className="font-medium text-gray-900">{assignment.title}</p>
              <p className="text-sm text-gray-600">{assignment.course}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[assignment.priority] || 'text-gray-600 bg-gray-100'}`}>
                {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
              </span>
              <span className="text-sm text-gray-500">{assignment.dueDate}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingAssignments;
