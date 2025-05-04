import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ role }) => {
  const token = localStorage.getItem(`${role}Token`);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;