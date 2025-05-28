// SectionLockControl.js
import React from 'react';
import { FiLock, FiUnlock, FiDollarSign } from 'react-icons/fi';

const SectionLockControl = ({ 
  isLocked, 
  price, 
  onToggleLock, 
  onPriceChange,
  isFree,
  onToggleFree
}) => {
  return (
    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={onToggleLock}
        className={`flex items-center px-3 py-2 rounded-md ${isLocked ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
      >
        {isLocked ? (
          <>
            <FiLock className="mr-2" />
            Locked
          </>
        ) : (
          <>
            <FiUnlock className="mr-2" />
            Unlocked
          </>
        )}
      </button>

      <div className="flex items-center space-x-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isFree}
            onChange={onToggleFree}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Free</span>
        </label>
      </div>

      {!isFree && (
        <div className="flex items-center">
          <span className="text-gray-700 mr-2">Price:</span>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={onPriceChange}
              disabled={isFree}
              className="block w-24 pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionLockControl;