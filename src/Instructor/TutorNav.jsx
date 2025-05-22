import { NavLink } from 'react-router-dom';
import { FaHome, FaBook, FaUsers, FaCalendarAlt, FaCog } from 'react-icons/fa';

const TutorNav = () => {
  return (
    <nav className="w-64 bg-indigo-800 text-white p-4 hidden md:block">
      <div className="space-y-1">
        <NavLink 
          to="/tutor" 
          className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-600'}`}
        >
          <FaHome className="mr-3" />
          Dashboard
        </NavLink>
        
        <NavLink 
          to="/tutor/courses" 
          className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-600'}`}
        >
          <FaBook className="mr-3" />
          My Courses
        </NavLink>
        
        <NavLink 
          to="/tutor/students" 
          className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-600'}`}
        >
          <FaUsers className="mr-3" />
          Students
        </NavLink>
        
        <NavLink 
          to="/tutor/courses/add" 
          className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-600'}`}
        >
          <FaCalendarAlt className="mr-3" />
          Add Course
        </NavLink>
        
        <NavLink 
          to="/tutor/schedule" 
          className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-600'}`}
        >
          <FaCog className="mr-3" />
          Schedules
        </NavLink>
      </div>
    </nav>
  );
};

export default TutorNav;