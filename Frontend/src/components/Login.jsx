import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/apiInstance"; // or use 'axios' directly

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/user/login", form);

      // Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful");

      // Navigate to user profile
      navigate("/userprofile");

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-orange-100 to-pink-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-pink-700">Skill Swap Platform</h2>
          <Link
            to="/"
            className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-medium shadow hover:opacity-90 transition-all"
          >
            Home
          </Link>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 font-medium">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-orange-400 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:opacity-90 transition-all"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline text-sm"
          >
            Forgot username/password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
