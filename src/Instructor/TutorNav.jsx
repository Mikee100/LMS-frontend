import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaBook,
  FaUsers,
  FaCalendarAlt,
  FaCog,
  FaBars,
  FaArrowLeft
} from 'react-icons/fa';

const TutorNav = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`
          h-screen bg-indigo-800 text-white transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-20'}
          flex flex-col
        `}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-between p-4">
          <h1 className={`text-xl font-bold transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
            Tutor Panel
          </h1>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white text-l focus:outline-none"
            title="Toggle Navigation"
          >
            <FaArrowLeft />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-4 space-y-2">
          <NavItem to="/tutor" icon={<FaHome />} text="Dashboard" isExpanded={isExpanded} />
          <NavItem to="/tutor/courses" icon={<FaBook />} text="My Courses" isExpanded={isExpanded} />
          <NavItem to="/tutor/students" icon={<FaUsers />} text="Students" isExpanded={isExpanded} />
          <NavItem to="/tutor/courses/add" icon={<FaCalendarAlt />} text="Add Course" isExpanded={isExpanded} />
          <NavItem to="/tutor/schedule" icon={<FaCog />} text="Schedules" isExpanded={isExpanded} />
        </nav>
      </div>

      {/* Main content placeholder (optional) */}
      <div className="flex-1 p-4">
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, text, isExpanded }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-3 mx-2 rounded-lg transition-all duration-200 
      ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-600'}`
    }
  >
    <span className="text-lg">{icon}</span>
    <span
      className={`ml-4 transition-opacity duration-300 ${
        isExpanded ? 'opacity-100' : 'opacity-0 hidden'
      }`}
    >
      {text}
    </span>
  </NavLink>
);

export default TutorNav;
