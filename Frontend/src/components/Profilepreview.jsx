import React from "react";
import { Link } from "react-router-dom";

const UserProfilePreview = () => {
  const user = {
    name: "Marc Demo",
    profileImage: "/profile-pic.jpg",
    skillsOffered: ["JavaScript", "Python"],
    skillsWanted: ["Photoshop", "Graphic Design"],
    rating: 4.2,
    feedback: [
      "Great communication!",
      "Knows Python really well!",
      "Would collaborate again.",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-orange-100 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-6 md:p-10 transition-all">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-pink-700">Skill Swap Platform</h2>
          <div className="flex gap-4 items-center">
            <button className="text-gray-700 hover:underline text-sm sm:text-base">Swap Request</button>
            <button className="text-gray-700 hover:underline text-sm sm:text-base">Home</button>
            <img
              src={user.profileImage}
              alt="User"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-orange-400"
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Left Info */}
          <div className="flex-1 space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">{user.name}</h3>

            {/* Skills Offered */}
            <div>
              <p className="text-pink-600 font-semibold mb-1">Skills Offered</p>
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered.map((skill, i) => (
                  <span key={i} className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <p className="text-orange-600 font-semibold mb-1">Skills Wanted</p>
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted.map((skill, i) => (
                  <span key={i} className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Rating and Feedback */}
            <div>
              <p className="text-blue-600 font-semibold mb-1">Rating & Feedback</p>
              <p className="text-yellow-700 font-semibold text-lg mb-2">⭐ {user.rating} / 5</p>
              <ul className="list-disc ml-5 text-gray-700 space-y-1 text-sm">
                {user.feedback.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Profile Pic + Request */}
          <div className="w-full md:w-1/3 text-center space-y-4 mt-6 md:mt-0">
            <img
              src={user.profileImage}
              alt="User"
              className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full border-4 border-pink-300 shadow"
            />


           <Link 
           to='/login/userrequest'
            >
            <button className="bg-gradient-to-r from-cyan-500 to-pink-400 text-white px-6 py-2 rounded-full shadow hover:opacity-90 transition-all font-semibold">
              Request
            </button>
           </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePreview;
