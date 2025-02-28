import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FETCH_ALL_TEAMS,
  BLOCK_TEAM,
  UNBLOCK_TEAM,
  UP_TEAM_LEVEL,
} from "../../constants";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(FETCH_ALL_TEAMS, {
        withCredentials: true,
      });

      let sortedTeams = response.data.allTeams.map((team) => {
        const totalCompletedQuestions = team.completedQuestions?.length || 0;
        const lastCompletedQuestionTime = team.completedQuestions?.length
          ? Math.max(...team.completedQuestions.map((q) => new Date(q.completedAt).getTime()))
          : 0; // Default to 0 if no completed questions

        return { ...team, totalCompletedQuestions, lastCompletedQuestionTime };
      });

      // Sort teams by the last completed question timestamp (latest first)
      sortedTeams.sort((a, b) => b.lastCompletedQuestionTime - a.lastCompletedQuestionTime);

      setTeams(sortedTeams)
    } catch (error) {
      console.error("Error teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleBlockTeam = async (teamId) => {
    try {
      console.log("Blocking team:", teamId);
      const response = await axios.post(
        BLOCK_TEAM(teamId),
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        alert("Team blocked successfully!");
        fetchTeams();
      }
    } catch (error) {
      console.error("Error blocking team:", error);
      alert("Failed to block team");
    }
  };

  const handleLevelUpTeam = async (teamId) => {
    try {
      const confirmResult = window.confirm("Are you sure you want to level up this team?");
      if (!confirmResult) {
        return;
      }
      const response = await axios.post(
        UP_TEAM_LEVEL(teamId),
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        alert("Team leveled up successfully!");
        fetchTeams(); // Refresh the UI
      }
    } catch (error) {
      console.error("Failed to level up team:", error);
      alert(`Error: ${error.response?.data?.message || "Something went wrong."}`);
    }
  };

  const handleUnblockTeam = async (teamId) => {
    try {
      const response = await axios.post(
        UNBLOCK_TEAM(teamId),
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        alert("Team unblocked successfully!");
        fetchTeams();
      }
    } catch (error) {
      console.error("Error unblocking team:", error);
      alert("Failed to unblock team");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-white font-bold mb-4">All Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card key={team._id} className="p-4 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl text-white mb-1 font-bold">
              {team.teamName} ({team.teamLead?.name})
            </h2>

            <p className="text-gray-300 mb-2">
              Team Level: {team.currentLevel?.level ?? "null"}
            </p>
            <p className="text-gray-300 mb-2">Score: {team.score}</p>
            <p className="text-gray-300 mb-2">
              Completed Questions: {team.totalCompletedQuestions}
            </p>

            {/* Members Section */}
            <div className="mb-4">
              <h3 className="text-lg text-white font-semibold mb-2">
                Members:
              </h3>
              <div className="flex flex-wrap gap-2">
                {team.members.map((member) => (
                  <div
                    key={member._id}
                    className="bg-gray-700 p-2 rounded-lg shadow-md text-white text-sm"
                  >
                    {member.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Block/Unblock Button */}
            <div className="flex justify-end space-x-2">
              {team.blocked ? (
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                  onClick={() => handleUnblockTeam(team._id)}
                >
                  Unblock
                </Button>
              ) : (
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={() => handleBlockTeam(team._id)}
                >
                  Block
                </Button>
              )}
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleLevelUpTeam(team._id)}
              >
                Level Up
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Teams;
