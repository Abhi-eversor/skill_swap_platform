import React, { useState } from 'react';
import axios from '../api/apiInstance'; // or just 'axios'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    skillsOffered: '',
    skillsWanted: '',
    availability: '',
    visibility: 'public',
    bio: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { confirmPassword, visibility, ...userData } = form;

      const finalData = {
        ...userData,
        skillsOffered: form.skillsOffered
          ? form.skillsOffered.split(',').map((s) => s.trim())
          : [],
        skillsWanted: form.skillsWanted
          ? form.skillsWanted.split(',').map((s) => s.trim())
          : [],
        availability: form.availability
          ? form.availability.split(',').map((a) => a.trim())
          : [],
        isPublic: visibility === 'public',
      };

      const res = await axios.post('/user/register', finalData);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-400 to-orange-400 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 rounded-2xl shadow-xl p-8 w-full max-w-3xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-pink-700">Register</h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:ring-pink-400"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:ring-pink-400"
            placeholder="example@email.com"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:ring-pink-400"
            placeholder="********"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:ring-pink-400"
            placeholder="********"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:ring-pink-400"
            placeholder="City, Country"
          />
        </div>

        {/* Skills Offered */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-pink-700">Skills Offered</label>
          <input
            type="text"
            name="skillsOffered"
            value={form.skillsOffered}
            onChange={handleChange}
            className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:ring-pink-400"
            placeholder="e.g., Graphic Design, Video Editing"
          />
        </div>

        {/* Skills Wanted */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-blue-700">Skills Wanted</label>
          <input
            type="text"
            name="skillsWanted"
            value={form.skillsWanted}
            onChange={handleChange}
            className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="e.g., JavaScript, Python"
          />
        </div>

        {/* Availability */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-orange-700">Availability</label>
          <input
            type="text"
            name="availability"
            value={form.availability}
            onChange={handleChange}
            className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:ring-orange-400"
            placeholder="e.g., Weekends, Evenings"
          />
        </div>

        {/* Visibility */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Profile Visibility</label>
          <select
            name="visibility"
            value={form.visibility}
            onChange={handleChange}
            className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:ring-pink-300"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-sm font-semibold">Bio or Message</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:ring-pink-400"
            placeholder="Tell others what you're looking for..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-all"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
