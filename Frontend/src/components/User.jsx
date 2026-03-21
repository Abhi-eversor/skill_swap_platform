import React from "react";


const User = ({ user }) => (
  <div className="bg-gray-800 text-2xl p-6 mb-6 shadow-md hover:shadow-lg transition-all text-white">
    <div className="flex gap-5 items-center">
      <div className="w-16 h-16 bg-gray-600 rounded-full flex justify-center items-center text-xs text-gray-300 shadow-inner">
        Profile<br />Photo
      </div>
      <div className="flex-grow ">
        <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
        <div>
          <p className="text-green-300 text-sm mb-1">Skills Offered:</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {user.skillsOffered.map((skill, index) => (
              <span
                key={index}
                className="bg-green-600 text-white text-sm px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-blue-300 text-sm mb-1">Skills Wanted:</p>
          <div className="flex flex-wrap gap-2 mb-1">
            {user.skillsWanted.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-300">Rating: <span className="font-medium">{user.rating}/5</span></p>
        </div>
      </div>
      <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow font-semibold transition-all">
        Request
      </button>
    </div>
  </div>
);

export default User;
