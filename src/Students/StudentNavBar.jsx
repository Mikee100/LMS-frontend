import { useState, useRef, useEffect } from 'react';
import { Menu, X, User, Home, BookOpen, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiBookmark, FiAward } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // <-- Add this import

const StudentNavBar = ({student}) => {

  console.log("StudentNavBar component rendered with student:", student);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate(); // <-- Add this line

  const toggleMenu = () => setMenuOpen(!menuOpen);


    useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const notifications = await res.json();
        setUnreadCount(notifications.filter(n => !n.read).length);
      } catch (err) {
        setUnreadCount(0);
      }
    };
    fetchUnread();
  }, []);



  // Close menu when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleStudentProfile = () => {
    navigate('/studentprofile');
  };
  return (
    <div className="relative">
      {/* Top Navbar */}
 <nav className="bg-white border-b border-blue-100 px-4 py-3 flex items-center shadow-sm fixed top-0 left-0 w-full z-50">
  {/* Hamburger Menu - always at far left */}
  <button
    onClick={toggleMenu}
    className="rounded-full p-2 hover:bg-blue-50 transition focus:outline-none mr-3"
    title="Menu"
  >
    {menuOpen ? <X size={28} /> : <Menu size={28} />}
  </button>
  {/* Logo and App Name */}
  <div className="flex items-center gap-2">
    <img src="https://th.bing.com/th/id/OIP.cKmLA9BIXU1cBa8rDkIrIAHaFJ?cb=iwp2&rs=1&pid=ImgDetMain" alt="Logo" className="h-8 w-8 rounded-full" />
    <span className="text-blue-700 font-bold text-lg tracking-tight">LMS</span>
  </div>
  {/* Spacer */}
  <div className="flex-1" />
  {/* Right Side Icons */}
  <div className="flex items-center gap-2">
    <button
      className="relative rounded-full p-2 hover:bg-blue-50 transition"
      title="Saved Courses"
      onClick={() => navigate('/bookmarks')}
    >
      <FiBookmark className="text-blue-600 text-xl" />
    </button>
    <button
      className="relative rounded-full p-2 hover:bg-blue-50 transition"
      title="Notifications"
      onClick={() => navigate('/notifications')}
    >
      <FiBell className="text-blue-600 text-xl" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
          {unreadCount}
        </span>
      )}
    </button>
    <button
      onClick={handleLogout}
      className="rounded-full p-2 hover:bg-blue-50 transition"
      title="Logout"
    >
      <LogOut className="text-blue-600 text-xl" />
    </button>
    <div
          className="ml-4 cursor-pointer"
          onClick={() => navigate("/studentprofile")}
          title="View Profile"
        >
          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 flex items-center justify-center bg-gray-100"
          >
            <img
              src={
                student?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  (student?.firstName || "") + " " + (student?.lastName || "")
                )}&background=random`
              }
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
  </div>
</nav>

      {/* Slide-in Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Menu */}
            <motion.div 
              ref={menuRef}
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="text-blue-600 font-semibold text-lg">Menu</div>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <X size={24} />
                </button>
              </div>
              
              <ul className="p-4 space-y-4">
                <li 
                  className="flex items-center gap-3 p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Home size={20} className="flex-shrink-0" /> 
                  <span>Home</span>
                </li>
                <li 
                  className="flex items-center gap-3 p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
                  onClick={handleStudentProfile}
                >
                  <User size={20} className="flex-shrink-0" /> 
                  <span>Profile</span>
                </li>
                <li 
                  className="flex items-center gap-3 p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <BookOpen size={20} className="flex-shrink-0" /> 
                  <span>Courses</span>
                </li>
                <li 
                  className="flex items-center gap-3 p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/gamification');
                  }}
                >
                  <FiAward size={20} className="flex-shrink-0" /> 
                  <span>Achievements</span>
                </li>
                <li 
  className="flex items-center gap-3 p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
  onClick={() => {
    setMenuOpen(false);
    navigate('/bookmarks');
  }}
>
  <FiBookmark size={20} className="flex-shrink-0" /> 
  <span>Saved Courses</span>
</li>
                
                <li 
                  className="flex items-center gap-3 p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={20} className="flex-shrink-0" /> 
                  <span>Logout</span>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentNavBar;