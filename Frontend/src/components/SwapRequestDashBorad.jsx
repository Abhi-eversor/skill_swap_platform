import React, { useState } from "react";

const SwapRequestDashboard = () => {
  const [filter, setFilter] = useState("Pending");

  const requests = [
    {
      id: 1,
      name: "Marc Demo",
      profileImage: "/profile1.jpg",
      offered: ["JavaScript"],
      wanted: ["Photoshop"],
      rating: 3.9,
      status: "Pending",
    },
    {
      id: 2,
      name: "Jane Smith",
      profileImage: "/profile2.jpg",
      offered: ["Excel"],
      wanted: ["Python"],
      rating: 4.1,
      status: "Rejected",
    },
  ];

  const filtered = requests.filter((req) => req.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">Skill Swap Platform</h2>
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-indigo-600 font-medium">Home</button>
          <img
            src="/profile1.jpg"
            alt="User Profile"
            className="w-10 h-10 rounded-full border-2 border-indigo-400"
          />
        </div>
      </div>

      {/* Filter + Search */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <select
          className="px-4 py-2 border rounded-md text-sm bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-300"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Accepted">Accepted</option>
        </select>
        <input
          type="text"
          placeholder="Search by name or skill"
          className="px-4 py-2 border rounded-md text-sm w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      {/* Requests */}
      <div className="max-w-6xl mx-auto grid gap-6">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No {filter} requests found.</p>
        ) : (
          filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white shadow-md rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <img
                  src={req.profileImage}
                  alt={req.name}
                  className="w-14 h-14 rounded-full border-2 border-purple-300"
                />
                <div>
                  <h3 className="text-lg font-semibold text-indigo-800">{req.name}</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Skills Offered:</strong>{" "}
                    {req.offered.map((s) => (
                      <span key={s} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 mx-1 rounded-full text-xs">
                        {s}
                      </span>
                    ))}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Skills Wanted:</strong>{" "}
                    {req.wanted.map((s) => (
                      <span key={s} className="bg-purple-100 text-purple-700 px-2 py-0.5 mx-1 rounded-full text-xs">
                        {s}
                      </span>
                    ))}
                  </p>
                  <p className="text-sm text-yellow-700 mt-1 font-medium">⭐ {req.rating} / 5</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                {req.status === "Pending" ? (
                  <>
                    <button className="bg-green-500 text-white px-4 py-1 rounded-full hover:bg-green-600 text-sm">
                      Accept
                    </button>
                    <button className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600 text-sm">
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`font-semibold text-sm ${
                      req.status === "Rejected" ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center gap-2">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            className="w-8 h-8 rounded-full text-sm bg-indigo-100 hover:bg-indigo-300 text-indigo-800"
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SwapRequestDashboard;
