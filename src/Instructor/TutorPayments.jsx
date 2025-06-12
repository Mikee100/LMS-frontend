import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TutorPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/payments/tutor-payments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(response.data);
      } catch (err) {
        setError('Failed to load payments. Please try again later.');
        toast.error('Failed to load payments');
        console.error('Payment fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const student = payment.enrollment?.student || {};
    const searchString = `${student.firstName || ''} ${student.lastName || ''} ${student.email || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'failed':
        return <FiXCircle className="text-red-500" />;
      case 'pending':
        return <FiLoader className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getTotalEarnings = () => {
    return filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0)
      .toFixed(2);
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiXCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm text-red-600 hover:text-red-500 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">Payment History</h2>
            <div className="mt-3 sm:mt-0">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {!loading && (
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="bg-white p-3 rounded-lg shadow-xs border border-gray-200 flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <FiDollarSign size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Earnings</p>
                  <p className="font-semibold">${getTotalEarnings()}</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-xs border border-gray-200 flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                  <FiCheckCircle size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="font-semibold">
                    {filteredPayments.filter(p => p.status === 'completed').length}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-xs border border-gray-200 flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                  <FiClock size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="font-semibold">
                    {filteredPayments.filter(p => p.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <Skeleton height={40} count={5} className="mb-2" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-6 text-center">
              <div className="max-w-md mx-auto py-12">
                <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  {searchTerm ? 'No matching payments found' : 'No payments received yet'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm 
                    ? 'Try adjusting your search query'
                    : 'Payments will appear here when students enroll in your courses'}
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const student = payment.enrollment?.student || {};
                  const paymentDate = payment.updatedAt ? new Date(payment.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A';
                  
                  return (
                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                            {student.firstName?.[0] || 'U'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName || 'Unknown'} {student.lastName || 'Student'}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {student.email || 'Unknown email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {payment.currency.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <span className="ml-2 text-sm capitalize text-gray-900">
                            {payment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {paymentDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredPayments.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-right text-sm text-gray-500">
            Showing <span className="font-medium">{filteredPayments.length}</span> of{' '}
            <span className="font-medium">{payments.length}</span> payments
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorPayments;