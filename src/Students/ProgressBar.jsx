// components/ProgressBar.jsx
const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-indigo-600 h-2.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

// Then add to CourseCard for enrolled courses:
{isEnrolled && (
  <div className="mt-3">
    <div className="flex justify-between text-xs text-gray-500 mb-1">
      <span>Progress</span>
      <span>{progress}%</span>
    </div>
    <ProgressBar progress={progress} />
  </div>
)}

export default ProgressBar;