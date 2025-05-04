import { Outlet } from 'react-router-dom';
import TutorNav from './TutorNav';

const TutorLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <TutorNav />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TutorLayout;