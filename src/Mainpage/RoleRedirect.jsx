import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RoleRedirect = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      navigate('/admin');
    } else if (currentUser?.role === 'tutor') {
      navigate('/tutor');
    } else {
      navigate('/'); // Default redirect
    }
  }, [currentUser, navigate]);

  return <div>Redirecting...</div>;
};

export default RoleRedirect;