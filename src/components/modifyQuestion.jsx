import React, { useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import SpaceBackground from "../components/space-background";
import { MODIFY_QUESTION } from "../constants";
import axios from "axios";

const ModifyQuestion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { levelNum, mongoLevelId } = useParams();

  // Get question data from navigation state
  const questionData = location.state?.questionData;
  console.log("Question Data:", questionData); // Debug log

  const [hints, setHints] = useState("");
  const [hintsList, setHintsList] = useState(
    questionData?.hints?.map(hint => typeof hint === 'object' ? hint.text : hint) || []
  );
  const [image, setImage] = useState(null);
  const [isImageUpdated, setIsImageUpdated] = useState(false);

  // Initialize state with existing question data
  const [formData, setFormData] = useState({
    levelNum: levelNum || "",
    title: questionData?.title || "",
    description: questionData?.description || "",
    correctCode: questionData?.correctCode || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setIsImageUpdated(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("levelNum", formData.levelNum);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("correctCode", formData.correctCode);
      formDataToSend.append("hints", JSON.stringify(hintsList));
      formDataToSend.append("isImageUpdated", isImageUpdated);

      if (isImageUpdated && image) {
        formDataToSend.append("image", image);
      }

      // Log FormData entries
      console.log("Form Data To Send:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.post(
        MODIFY_QUESTION(questionData.id),
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("Response:", response.data);
      alert("Question modified successfully!");

      // Use state parameter to force a refresh
      navigate(`/level/${levelNum}/questions/${mongoLevelId}`, {
        replace: true,
        state: { refresh: true }
      });

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to modify question");
    }
  };

  const handleAddHint = (e) => {
    if (e.key === "Enter" && hints.trim()) {
      e.preventDefault();
      setHintsList([...hintsList, hints.trim()]);
      setHints("");
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <SpaceBackground />
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-[95%] sm:max-w-[85%] md:max-w-2xl p-4 sm:p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <Link
              to={`/level/${levelNum}/questions`}
              className="text-white hover:text-gray-300"
            >
              ← Back to Questions
            </Link>
            <h2 className="text-2xl font-bold text-white">Modify Question</h2>
          </div>

          <div className="space-y-4">
            {/* Level Number */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Level Number</label>
              <input
                type="number"
                name="levelNum"
                value={formData.levelNum}
                disabled
                className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-gray-300/30 rounded-lg text-red-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"

              />
            </div>

            {/* Title */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 sm:h-32 resize-none text-sm sm:text-base"
                required
              />
            </div>

            {/* Add Image field before the hints section */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Update Image</label>
              <div className="space-y-2">
                {questionData?.image && !isImageUpdated && (
                  <div className="mb-2">
                    <p className="text-white text-sm mb-1">Current Image:</p>
                    <img
                      src={`http://localhost:3000/${questionData.image}`}
                      alt="Current"
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-gray-300/30 rounded-lg text-white 
                  file:mr-4 file:py-2 file:px-4 
                  file:rounded-lg file:border-0 
                  file:text-sm file:font-semibold
                  file:text-white file:bg-blue-600 
                  file:hover:bg-blue-700 
                  file:cursor-pointer"
                />
                {image && (
                  <div className="mt-2">
                    <p className="text-white text-sm mb-1">New Image Preview:</p>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Hints */}
            {/* Updated Hints Section */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Hints</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter hint and press Enter"
                  value={hints}
                  onChange={(e) => setHints(e.target.value)}
                  onKeyDown={handleAddHint}
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
                        hint{index + 1}: {typeof hint === 'object' ? hint.text : hint}
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
            {/* Correct Code */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Correct Code</label>
              <input
                type="text"
                name="correctCode"
                value={formData.correctCode}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 bg-white/20 border border-gray-300/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 sm:py-3 px-4 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 ease-in-out text-sm sm:text-base"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyQuestion;
