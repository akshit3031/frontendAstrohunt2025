import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/navbar"; // Adjust the path as needed
import { Button } from "../components/ui/button"; // Adjust the path as needed
import { Input } from "../components/ui/input"; // Adjust the path as needed
import { Card } from "../components/ui/card"; // Adjust the path as needed
import { Badge } from "../components/ui/badge"; // Adjust the path as needed
import SpaceBackground from "../components/space-background"; // Adjust the path as needed
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  FETCH_CURRENT_QUESTION,
  SUBMIT_CODE,
  FETCH_LEADERBOARD,
} from "../constants.js";
import { Trophy, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SET_TIMER_FOR_REFRESHING_QUESTION = 300000;
const SET_TIMER_FOR_REFRESHING_LEADERBOARD = 600000;
export default function GamePage() {
  const [hints, setHints] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState("");
  const [questionloading, setquestionLoading] = useState(true);
  const [leaderboardloading, setleaderboardloading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    try {
      console.log("Fetching leaderboard");
      setLeaderboardLoading(true);
      const response = await axios.get(FETCH_LEADERBOARD, {
        withCredentials: true,
      });
      if (response.data.success) {
        setLeaderboard(response.data.leaderboard || []);
        // console.log("LEADERBOARD: ", response.data.leaderboard);
      }
      setLeaderboardLoading(false);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setLeaderboard([]);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of both question and leaderboard
    const fetchInitialData = async () => {
      await Promise.all([fetchQuestion(), fetchLeaderboard()]);
    };

    fetchInitialData();

    // Set up intervals for both fetches
    const questionInterval = setInterval(
      fetchQuestion,
      SET_TIMER_FOR_REFRESHING_QUESTION
    );
    const leaderboardInterval = setInterval(
      fetchLeaderboard,
      SET_TIMER_FOR_REFRESHING_LEADERBOARD
    ); // Update leaderboard every minute

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(questionInterval);
      clearInterval(leaderboardInterval);
    };
  }, []);

  const fetchQuestion = async () => {
    try {
      console.log("Fetching question");
      setquestionLoading(true);
      const response = await axios.get(FETCH_CURRENT_QUESTION, {
        withCredentials: true,
      });
      // console.log("RESPONSE: ", response.data);
      if (response.data.success) {
        // console.log("QUESTION: ", response.data.currQuestion);
        setQuestion(response.data.currQuestion);
        // Set hints from the question data
        setHints(response.data.currQuestion.hints || []);
        setAnswer("");
        setError("");
      }
    } catch (err) {
      console.error("Error fetching question:", err);
      setError(err.response?.data?.message || "Failed to fetch question");
    } finally {
      setquestionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple clicks
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        SUBMIT_CODE,
        {
          questionCode: answer,
          questionId: question._id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Fetch new question after successful submission

        alert("Question submitted successfully!");

        await fetchQuestion();
      }else{
        setError(response?.data?.message || "success false ");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/teamDetails");
  };

  return (
    <>
      <SpaceBackground />
      <NavBar />

      <main className="min-h-screen pt-20 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="container mx-auto max-w-4xl"
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors mb-4 bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Team Details</span>
          </button>

          {/* Question Card */}
          <Card className="backdrop-blur-xl bg-black/30 border-white/10 p-6 space-y-6 mb-6">
            {/* Player Info & Timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold text-white">{user.name}</div>
                <Badge
                  variant="outline"
                  className="text-purple-400 border-purple-400"
                >
                  Level {question?.level.level}
                </Badge>
              </div>
              {/* <div className="text-2xl font-mono text-white">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </div> */}
            </div>

            {/* Question Area */}
            {questionloading ? (
              <div className="text-center text-white">Loading question...</div>
            ) : error ? (
              <div className="text-center text-red-400">{error}</div>
            ) : (
              <>
                <div className="space-y-4">
                  <h2 className="text-xl text-white font-semibold">
                    {question?.title}
                  </h2>
                  <p className="text-lg text-white">{question?.description}</p>
                  {question?.image && (
                    <img
                      src={question.image.url}
                      alt="Question"
                      className="rounded-lg max-w-full"
                    />
                  )}
                </div>

                {/* Hints Section */}
                {hints.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Hints:</h3>
                    <div className="space-y-2">
                      {hints.map((hint, index) => {
                        // Regex to check if hint.text is a URL
                        const isUrl = /^https?:\/\/[^\s]+$/.test(hint.text);

                        return (
                          <div
                            key={index}
                            className="bg-white/5 p-4 rounded-lg break-words overflow-hidden"
                          >
                            {isUrl ? (
                              <a
                                href={hint.text}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline break-words"
                              >
                                {`${index + 1}. `}
                                <span className="inline-block max-w-[90%] truncate">
                                  {hint.text}
                                </span>
                              </a>
                            ) : (
                              <p className="text-purple-300 break-words">
                                {`${index + 1}. ${hint.text}`}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Answer Form */}
                {user.role === "team_leader" && (
                  <form onSubmit={handleSubmit} className="flex gap-4">
                    <Input
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="flex-1 bg-white/10 border-white/20 text-white"
                      placeholder="Enter your answer..."
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting} 
                      className="bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                     {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </form>
                )}
              </>
            )}
          </Card>

          {/* Leaderboard Card */}
          <Card className="backdrop-blur-xl bg-black/30 border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-white">Leaderboard</h2>
            </div>

            {leaderboardLoading ? (
              <div className="text-center text-white py-4">
                Loading leaderboard...
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((team, index) => (
                  <div
                    key={team._id || index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0
                        ? "bg-yellow-500/20"
                        : index === 1
                        ? "bg-gray-400/20"
                        : index === 2
                        ? "bg-orange-700/20"
                        : "bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-lg font-bold ${
                          index === 0
                            ? "text-yellow-500"
                            : index === 1
                            ? "text-gray-400"
                            : index === 2
                            ? "text-orange-700"
                            : "text-white"
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-white font-medium">
                          {team.teamName}
                        </p>
                        <p className="text-sm text-gray-400">
                          Level {team.level}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-400">
                        {Math.round(team.score)} pts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white py-4">No teams found</div>
            )}
          </Card>
        </motion.div>
      </main>
    </>
  );
}
