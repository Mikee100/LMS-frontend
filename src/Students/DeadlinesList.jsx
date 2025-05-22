// components/DeadlinesList.jsx
const DeadlinesList = ({ deadlines }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Deadlines</h2>
      <ul className="space-y-4">
        {deadlines.map((deadline) => (
          <li key={deadline.id} className="flex items-start">
            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
              deadline.priority === 'high' ? 'bg-red-100 text-red-600' :
              deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">{deadline.title}</h3>
              <p className="text-sm text-gray-500">
                Due {deadline.dueDate} • {deadline.course}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeadlinesList;