// MaterialItem.js
import React from 'react';
import { FiFile, FiEye, FiDownload, FiX } from 'react-icons/fi';

const MaterialItem = ({ 
  material, 
  onRemove, 
  onView, 
  isLectureMaterial = false 
}) => {
  const isPDF = (material.originalName || material.filename || '').endsWith('.pdf');
  const displayName = material.name || material.originalName || material.filename;

  return (
    <li className={`flex items-center justify-between ${isLectureMaterial ? 'bg-gray-50 p-2' : 'bg-white p-3'} rounded-lg`}>
      <div className="flex items-center truncate">
        <FiFile className={`${isLectureMaterial ? 'text-indigo-500' : 'text-indigo-600'} mr-2 flex-shrink-0`} size={isLectureMaterial ? 14 : 16} />
        <span className={`${isLectureMaterial ? 'text-xs' : 'text-sm'} truncate`} title={displayName}>
          {displayName}
        </span>
      </div>
     
      <div className="flex space-x-2 ml-2">
        {material.filename && (
          <button
          type="button"
            onClick={onView}
            className={`p-1 ${isLectureMaterial ? 'text-indigo-500 hover:text-indigo-700' : 'text-indigo-600 hover:text-indigo-800'}`}
            title={isPDF ? "View" : "Download"}
          >
            {isPDF ? (
              <FiEye size={isLectureMaterial ? 14 : 16} />
            ) : (
              <FiDownload size={isLectureMaterial ? 14 : 16} />
            )}
          </button>
        )}
        <button
        type='button'
          onClick={onRemove}
          className={`p-1 ${isLectureMaterial ? 'text-red-400 hover:text-red-600' : 'text-red-500 hover:text-red-700'}`}
          title="Remove"
        >
          <FiX size={isLectureMaterial ? 14 : 16} />
        </button>
      </div>
    </li>
  );
};

export default MaterialItem;