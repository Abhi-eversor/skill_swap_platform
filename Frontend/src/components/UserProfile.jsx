import React, { useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "Shriyam Chaudhary",
    location: "Delhi, India",
    skillsOffered: ["Graphic Design", "Video Editing", "Photoshop"],
    skillsWanted: ["Python", "JavaScript", "Manager"],
    availability: "Weekends",
    isPublic: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-orange-600 py-10 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-gray-300 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-bold text-pink-700">Skill Swap Platform</div>
          <div className="flex items-center gap-4">
            <button className="text-green-600 font-semibold hover:underline">Save</button>
            <button className="text-red-600 font-semibold hover:underline">Discard</button>
            <button className="text-gray-700 hover:underline">Swap Request</button>
            <button className="text-gray-700 hover:underline">Home</button>
            <img
              src="/profile-pic.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-pink-400"
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className="grid md:grid-cols-2 ">
          {/* Left Side */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                value={user.name}
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Location</label>
              <input
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                value={user.location}
                readOnly
              />
            </div>
            <div>
              <label className="block text-pink-600 font-semibold">Skills Offered</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skillsOffered.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-orange-600 font-semibold">Availability</label>
              <input
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                value={user.availability}
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Profile Visibility</label>
              <input
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
                value={user.isPublic ? "Public" : "Private"}
                readOnly
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            <div className="text-center">
              <img
                src="/profile-pic.jpg"
                alt="User"
                className="w-32 h-32 rounded-full mx-auto border-4 border-orange-300 shadow"
              />
              <button className="mt-3 text-sm text-blue-600 hover:underline">
                Add/Edit Photo
              </button>
            </div>
            <div>
              <label className="block text-blue-700 font-semibold">Skills Wanted</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skillsWanted.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Bio or Message</label>
              <input
                type="text"
                placeholder="Looking for people to teach Python!"
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
