import React, { useState } from "react";
import { Link } from "react-router-dom";
const SendSwapRequest = () => {
  const [formData, setFormData] = useState({
    offeredSkill: "",
    wantedSkill: "",
    message: "",
  });

  const offeredSkills = ["Video Editing", "Excel", "Photoshop"];
  const wantedSkills = ["JavaScript", "Python", "Design Thinking"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Request Sent:\nOffered: ${formData.offeredSkill}\nWanted: ${formData.wantedSkill}\nMessage: ${formData.message}`);
    // You can add API POST call here
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-indigo-100 via-purple-100 to-blue-100 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 md:p-10 space-y-6"
      >
        <h2 className="text-2xl font-bold text-indigo-700 text-center mb-2">
          Send a Swap Request
        </h2>

        {/* Offered Skill */}
        <div>
          <label className="block text-indigo-600 font-semibold mb-1">
            Choose one of your offered skills
          </label>
          <select
            name="offeredSkill"
            value={formData.offeredSkill}
            onChange={handleChange}
            required
            className="w-full border border-indigo-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-300 outline-none"
          >
            <option value="">-- Select --</option>
            {offeredSkills.map((skill, i) => (
              <option key={i} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Wanted Skill */}
        <div>
          <label className="block text-purple-600 font-semibold mb-1">
            Choose one of their wanted skills
          </label>
          <select
            name="wantedSkill"
            value={formData.wantedSkill}
            onChange={handleChange}
            required
            className="w-full border border-purple-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300 outline-none"
          >
            <option value="">-- Select --</option>
            {wantedSkills.map((skill, i) => (
              <option key={i} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-blue-600 font-semibold mb-1">
            Message (optional)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="Say something to the user..."
            className="w-full border border-blue-200 rounded-lg px-4 py-2 resize-none focus:ring-2 focus:ring-blue-300 outline-none"
          />
        </div>

        {/* Submit */}
        <div className="text-center">



         <Link 
         to='/'



         >
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full shadow-md hover:opacity-90 transition-all"
          >
            Submit
          </button>
         
         </Link>   


            

            
            
           

        </div>
      </form>
    </div>
  );
};

export default SendSwapRequest;
