import React, { useState } from "react";
import {Link , useNavigate} from 'react-router-dom';

const dummyProfiles = [
  {
    id: 1,
    name: "Marc Demo",
    public: true,
    photo: "/profile1.jpg",
    offered: ["JavaScript", "Python"],
    wanted: ["Photoshop", "Graphic Designer"],
    rating: 3.9,
  },
  {
    id: 2,
    name: "Michell",
    public: true,
    photo: "/profile2.jpg",
    offered: ["JavaScript", "Python"],
    wanted: ["Photoshop", "Graphic Designer"],
    rating: 2.5,
  },
  {
    id: 3,
    name: "Joe Wills",
    public: true,
    photo: "/profile3.jpg",
    offered: ["JavaScript", "Python"],
    wanted: ["Photoshop", "Graphic Designer"],
    rating: 4.0,
  },
];


const HomePage = () => {
  const [availability, setAvailability] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const handleRequest = (profile) => {
  //   if (!isLoggedIn) {
  //     alert("Please log in to request a skill swap.");
  //   } else {
  //     console.log("Requesting swap with:", profile.name);
  //   }
  // };

  const filteredProfiles = dummyProfiles.filter((profile) =>
    profile.public &&
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-rose-50 to-orange-100 min-h-screen p-4 sm:p-8">
      {/* Header */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-pink-700">Skill Swap Platform</h1>
        <div className="flex items-center gap-4">
          {/* {isLoggedIn ? (
            <img src="/profile1.jpg" className="w-10 h-10 rounded-full border" alt="Profile" />
          ) : (
            <button
              className="bg-pink-600 text-white px-4 py-1 rounded-md text-sm"
              onClick={() => setIsLoggedIn(true)}
            >
              Login
            </button>
          )} */}

          <Link
          to='/login'
          >
          <button className="bg-pink-600 text-white px-4 py-1 rounded-md text-sm">LOGIN</button>
          </Link>


          
          <Link
          to='/register'
          >
          <button className="bg-pink-600 text-white px-4 py-1 rounded-md text-sm">Register</button>
          </Link>


       
          



        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <select
          className="px-4 py-2 border rounded-md bg-white text-sm text-gray-700 shadow-sm"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="All">Availability</option>
          <option value="Weekends">Weekends</option>
          <option value="Evenings">Evenings</option>
        </select>
        <input
          type="text"
          placeholder="Search by name or skill"
          className="flex-1 px-4 py-2 border rounded-md text-sm shadow-sm focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 text-sm">
          Search
        </button>
      </div>

      {/* User Cards */}
      <div className="max-w-6xl mx-auto space-y-6">
        {filteredProfiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
          >
            <div className="flex gap-4 items-center">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-14 h-14 rounded-full border-2 border-pink-400"
              />
              <div>
                <h3 className="text-lg font-semibold text-pink-700">{profile.name}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Skills Offered:</strong>{" "}
                  {profile.offered.map((skill) => (
                    <span
                      key={skill}
                      className="bg-pink-100 text-pink-800 text-xs font-medium px-2 py-0.5 rounded-full mx-1"
                    >
                      {skill}
                    </span>
                  ))}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Skills Wanted:</strong>{" "}
                  {profile.wanted.map((skill) => (
                    <span
                      key={skill}
                      className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full mx-1"
                    >
                      {skill}
                    </span>
                  ))}
                </p>
                <p className="text-sm text-yellow-600 font-medium mt-1">⭐ {profile.rating}/5</p>
              </div>
            </div>
            {/* <button
              onClick={() => handleRequest(profile)}
              className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm mt-4 sm:mt-0 hover:bg-pink-700"
            >
              Request
            </button> */}


            <Link 
            to='/login/user'
            >
            <button className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm mt-4 sm:mt-0 hover:bg-pink-700">Request</button>
            </Link>







          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="max-w-6xl mx-auto mt-10 flex justify-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <button
            key={num}
            className="w-8 h-8 rounded-full bg-white text-pink-600 border border-pink-300 hover:bg-pink-100"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
