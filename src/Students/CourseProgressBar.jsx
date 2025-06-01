import { motion } from 'framer-motion';

const CourseProgressBar = ({ percent }) => (
  <div className="fixed top-0 left-0 w-full z-50 bg-indigo-100 shadow">
    <div className="max-w-6xl mx-auto px-4 py-2 flex items-center">
      <span className="text-sm font-medium text-indigo-700 mr-4">
        Course Progress: {percent}%
      </span>
      <div className="flex-1 h-2 bg-indigo-200 rounded-full overflow-hidden">
        <motion.div
          className="h-2 bg-green-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7 }}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  </div>
);

export default CourseProgressBar;