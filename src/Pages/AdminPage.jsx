import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SpaceBackground from "../components/space-background";
import Levels from "./LevelPage";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { LevelStats } from "./AdminDashboard/LevelStats";
import Teams from "./AdminDashboard/Teams";
import axios from "axios";
import { START_GAME, RESET_GAME, FETCH_GAME_STATUS, FINISH_GAME } from "../constants";

const AdminPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('levels'); // 'levels' or 'stats'
  const [gameStatus, setGameStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const fetchGameStatus = async () => {
      try{
        const response = await axios.get(FETCH_GAME_STATUS, {withCredentials: true});
        setGameStatus(response.data.gameDetails.hasGameStarted);
      }
      catch(error){
        console.error("Error fetching game status:", error);
      }
    }
    fetchGameStatus();
  },[]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleStartGame = async () => {
    try {
      setLoading(true);
      const response = await axios.post(START_GAME, {}, { withCredentials: true });
      if (response.data.success) {
        setGameStatus(true);
        
        alert('Game started successfully!');
      }
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game');
    } finally {
      setLoading(false);
    }
  };

  const handleResetGame = async () => {
    if (window.confirm('Are you sure you want to reset the game? This will reset all teams progress.')) {
      try {
        setLoading(true);
        const response = await axios.post(RESET_GAME, {}, { withCredentials: true });
        if (response.data.success) {
          setGameStatus(false);
         
          alert('Game reset successfully!');
        }
      } catch (error) {
        console.error('Error resetting game:', error);
        alert('Failed to reset game');
      } finally {
        setLoading(false);
      }
    }
  };
  const handleFinishGame = async()=>{
    if(window.confirm("Are you sure you want to finish the game? This will end the game for all teams.")){
      try{
        setLoading(true);
        const response = await axios.post(FINISH_GAME, {}, {withCredentials: true});
        if(response.data.success){
          setGameStatus(false);
          alert("Game finished successfully!");
        }
      }
      catch(error){
        console.error("Error finishing game:", error);
        alert("Failed to finish game");
      }
      finally{
        setLoading(false);
      }
    }
  };
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <SpaceBackground />
      </div>
      
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button
              onClick={handleStartGame}
              disabled={loading || gameStatus}
              className="bg-green-600 hover:bg-green-700 text-white px-6 w-full sm:w-auto"
            >
              {loading ? 'Processing...' : gameStatus ? 'Game Running' : 'Start Game'}
            </Button>
            <Button
              onClick={handleResetGame}
              disabled={loading || !gameStatus}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 w-full sm:w-auto"
            >
              {loading ? 'Processing...' : 'Reset Game'}
            </Button>
            <Button
              onClick={handleFinishGame}
              disabled={loading || !gameStatus}
              className="bg-red-600 hover:bg-red-700 text-white px-6 w-full sm:w-auto"
            >
              {loading ? 'Processing...' : 'Finish Game'}
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 w-full sm:w-auto"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="space-x-2 bg-black/20 p-1 rounded-lg inline-block">
            <button
              onClick={() => setActiveTab('levels')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'levels'
                  ? 'bg-purple-500/20 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Manage Levels
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'stats'
                  ? 'bg-purple-500/20 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Level Statistics
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'teams'
                  ? 'bg-purple-500/20 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Teams
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'levels' ? (
            <Levels />
          ) : activeTab === 'stats' ? (
            <LevelStats />
          ) : activeTab === 'teams' ? (
            <Teams />
          ) : null
          
          
          }
        </div>
      </div>
    </div>
  );
};

export default AdminPage;