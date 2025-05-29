import { useState, useRef, useEffect } from 'react';
import { Menu, X, User, Home, BookOpen, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiBookmark } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // <-- Add this import

const StudentNavBar = () => {
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


  return (
    <div className="relative">
      {/* Top Navbar */}
      <nav className="bg-blue-600 text-white px-4 py-6 flex justify-between items-center shadow-md">
        <button onClick={toggleMenu} className="focus:outline-none">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <div className="ml-auto flex items-center">
          <button
  className="relative focus:outline-none ml-4"
  title="Saved Courses"
  onClick={() => navigate('/bookmarks')}
>
  <FiBookmark className="text-white text-2xl" />
</button>
          
          <button
            className="relative focus:outline-none"
            title="Notifications"
           onClick={() => navigate('/notifications')} 
          >
            <FiBell className="text-white text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        <div className="w-8"></div> {/* Spacer for balance */}
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
                  onClick={() => setMenuOpen(false)}
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
    navigate('/bookmarks');
  }}
>
  <FiBookmark size={20} className="flex-shrink-0" /> 
  <span>Saved Courses</span>
</li>
                
                <li 
                  className="flex items-center gap-3 p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
                  onClick={() => setMenuOpen(false)}
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