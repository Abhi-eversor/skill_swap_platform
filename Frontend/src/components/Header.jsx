import React from "react";

const Header = () => (
  <header className="flex justify-between items-center bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-800 px-6 py-4 rounded-t-2xl shadow-md text-white">
    <h1 className="text-2xl font-bold tracking-wide">Skill Swap Platform</h1>
    <div className="flex items-center gap-6">
      <button className="border-b-2 border-white font-medium text-sm pb-1 hover:text-gray-200 transition-all">
        Swap Request
      </button>
      <img
        src="/profile-pic.jpg"
        alt="Profile"
        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
      />
    </div>
  </header>
);
export default Header;
