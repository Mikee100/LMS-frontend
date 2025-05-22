// components/SortDropdown.jsx
import React, { useState } from 'react';
const SortDropdown = ({ onSort }) => {
  const [sortBy, setSortBy] = useState('recent');

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSort(value);
  };

  return (
    <div className="mb-6">
      <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort by:</label>
      <select
        id="sort"
        value={sortBy}
        onChange={handleSortChange}
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
      >
        <option value="recent">Most Recent</option>
        <option value="popular">Most Popular</option>
        <option value="rating">Highest Rated</option>
        <option value="duration">Duration</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
};

export default SortDropdown;