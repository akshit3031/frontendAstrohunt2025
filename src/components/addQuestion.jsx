import React from "react";
import { useParams } from "react-router-dom";
import SpaceBackground from "./space-background";
import { useState } from "react";
import { ADD_QUESTION } from "../constants";
import axios from "axios";
export default function AddQuestion() {
  // levelNum, title, description, hints, correctCode, image
  const { levelNum } = useParams();
  console.log("levelNum", levelNum);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hints, setHints] = useState("");
  const [hintsList, setHintsList] = useState([]);
  const [correctCode, setCorrectCode] = useState("");
  const [image, setImage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("levelNum", levelNum);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("hints", JSON.stringify(hintsList));
      formData.append("correctCode", correctCode);
      formData.append("questionImage", image);

      console.log("Form Data Contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await axios.post(ADD_QUESTION, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log("RESPONSE", response.data);

      // clear form after successful submission
      setTitle("");
      setDescription("");
      setHints("");
      setHintsList([]);
      setCorrectCode("");
      setImage(null);
      alert("Question added successfully");
    } catch (error) {
      console.error("Error adding question:", error.response?.data || error.message);
      alert("Failed to add question. Please try again.");
    }
  };

  return (
    <div>
      {/* <SpaceBackground /> */}
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-[95%] sm:max-w-[85%] md:max-w-2xl p-4 sm:p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 sm:mb-6 md:mb-8">
            Add New Question
          </h2>

          <div className="space-y-4">
            {/* Level Number Input */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Level:</label>
              <input
                type="number"
                value={levelNum}
                disabled
                className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-gray-300/30 rounded-lg text-red-500
                    placeholder-gray-400 focus:outline-none cursor-not-allowed opacity-70"
              />
            </div>

            {/* Title Input */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Title</label>
              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Description Input */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Description</label>
              <textarea
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 sm:h-32 resize-none text-sm sm:text-base"
              />
            </div>

            {/* Hints Input */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Hints</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter hint and press Enter"
                  value={hints}
                  onChange={(e) => setHints(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && hints.trim()) {
                      e.preventDefault();
                      setHintsList([...hintsList, hints.trim()]);
                      setHints("");
                    }
                  }}
                  className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                {/* Display added hints */}
                <div className="flex flex-wrap gap-2">
                  {hintsList.map((hint, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-600/50 px-3 py-1 rounded-lg"
                    >
                      <span className="text-white text-sm">
                        hint{index + 1}: {hint}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setHintsList(hintsList.filter((_, i) => i !== index))
                        }
                        className="ml-2 text-white hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Correct Code Input */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Correct Code</label>
              <input
                type="text"
                placeholder="Enter correct code"
                value={correctCode}
                onChange={(e) => setCorrectCode(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 
                file:text-sm file:font-semibold
                file:text-white file:bg-blue-600 
                file:hover:bg-blue-700 
                file:cursor-pointer
                text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 sm:py-3 px-4 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 ease-in-out text-sm sm:text-base"
          >
            Add Question
          </button>
        </form>
      </div>
    </div>
  );
}
