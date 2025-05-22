// components/StatsOverview.jsx
const StatsOverview = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">Enrolled Courses</h3>
        <p className="text-2xl font-bold text-gray-900">{stats.enrolled}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">Completed</h3>
        <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
        <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">Certificates</h3>
        <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
      </div>
    </div>
  );
};

export default StatsOverview;