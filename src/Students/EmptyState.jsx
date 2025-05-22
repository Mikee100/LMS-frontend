import { Link } from 'react-router-dom';

const EmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
      <p className="text-gray-600 mb-6">Check back later for new course offerings</p>
      <Link 
        to="/" 
        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default EmptyState;