import { Link } from 'react-router-dom';
import { FiBookmark } from 'react-icons/fi';
const CourseCard = ({ course, progressCount, isBookmarked, onBookmark = () => {} }) => {
  
   const totalLectures = course.sections?.reduce(
    (sum, section) => sum + (section.lectures?.length || 0), 0
  ) || 0;
  const progressPercent = totalLectures > 0
    ? Math.round((progressCount / totalLectures) * 100)
    : 0;
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      {/* Image with badges */}
      
      <div className="relative aspect-video bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
       <button
  className={`absolute top-3 right-3 z-10 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-indigo-400 ${isBookmarked ? 'text-yellow-400' : 'text-gray-300'}`}
  onClick={e => {
    e.stopPropagation();
    onBookmark();
  }}
  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this course'}
>
  <FiBookmark size={22} />
</button>
        <img 
          src={course.thumbnail || 'https://source.unsplash.com/random/600x400/?education,learning'} 
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            course.level === 'Advanced' ? 'bg-red-100 text-red-800' :
            course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {course.level || 'Beginner'}
          </span>
          {course.isNew && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              New
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 leading-tight">
          {course.title}
        </h3>
        
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>
        
        {/* Subject */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
         <div className="flex flex-wrap gap-2 mb-2">
  {(course.subjects || []).map(subject => (
    <span key={subject} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-medium">
      {subject}
    </span>
  ))}
</div>
        </div>
        {progressPercent > 0 && (
  <div className="mt-2">
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs text-indigo-700">Progress</span>
      <span className="text-xs text-gray-600">{progressPercent}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-indigo-600 h-2 rounded-full transition-all"
        style={{ width: `${progressPercent}%` }}
      ></div>
    </div>
  </div>
)}
        
        {/* Meta info (duration and price) */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{course.duration || '4 weeks'}</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {course.price ? `$${course.price}` : 'Free'}
          </span>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between items-center mt-4 gap-3">
          <Link 
            to={`/courses/${course._id}`} 
            className="flex-1 text-center px-4 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50"
          >
            View Details
          </Link>
          <button className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;