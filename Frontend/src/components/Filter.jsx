import React from "react";

const FilterBar = () => (
  <div className="flex flex-wrap items-center gap-4 bg-gray-800 px-6 py-4 rounded-b-xl text-white shadow-inner">
    <select className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-sm focus:outline-none">
      <option value="">Availability</option>
      <option value="weekends">Weekends</option>
      <option value="evenings">Evenings</option>
    </select>
    <input
      type="text"
      placeholder="Search by skill..."
      className="flex-grow bg-gray-700 px-4 py-2 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none"
    />
    <button className="bg-gradient-to-r from-teal-500 to-green-500 px-4 py-2 rounded-lg text-white font-medium shadow-md hover:opacity-90 transition-all">
      Search
    </button>
  </div>
);
export default FilterBar;
