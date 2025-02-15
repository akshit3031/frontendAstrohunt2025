import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/card';
import { FETCH_LEVEL_STATS,FETCH_LEADERBOARD } from '../../constants';
import QuestionStats from './QuestionStats';
import { Trophy,ArrowLeft } from 'lucide-react';
export function LevelStats() {
  const [levelStats, setLevelStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  const SET_TIMER_FOR_REFRESHING_STATS = 300000;
  const SET_TIMER_FOR_REFRESHING_LEADERBOARD = 600000;

  const fetchStats = async () => {
    try {
      const response = await axios.get(FETCH_LEVEL_STATS, {
        withCredentials: true
      });
      if (response.data.success) {
        setLevelStats(response.data.levelStats);
      }
    } catch (error) {
      console.error('Error fetching level stats:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchLeaderboard = async () => {
    try{
      console.log("Fetching leaderboard");
      setLeaderboardLoading(true);
      const response = await axios.get(FETCH_LEADERBOARD, {
        withCredentials: true
      });
      if(response.data.success){
        setLeaderboard(response.data.leaderboard || []);
        console.log("LEADERBOARD: ", response.data.leaderboard);
      }
      setLeaderboardLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLeaderboard([]);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
          fetchStats(),
          fetchLeaderboard()
      ]);
  };

  fetchInitialData();

  // Set up intervals for both fetches
  const statsInterval = setInterval(fetchStats, SET_TIMER_FOR_REFRESHING_STATS);
  const leaderboardInterval = setInterval(fetchLeaderboard, SET_TIMER_FOR_REFRESHING_LEADERBOARD); // Update leaderboard every minute

  return () => {
    clearInterval(statsInterval);
    clearInterval(leaderboardInterval);
};

    
  }, []);

  return (
    <div className="space-y-6">

      
       {/* Leaderboard Card */}
          <Card className="backdrop-blur-xl bg-black/30 border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-white">Leaderboard</h2>
            </div>

            {leaderboardLoading ? (
              <div className="text-center text-white py-4">Loading leaderboard...</div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-4">
                {leaderboard.map((team, index) => (
                  <div
                    key={team._id || index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0 ? 'bg-yellow-500/20' :
                      index === 1 ? 'bg-gray-400/20' :
                      index === 2 ? 'bg-orange-700/20' :
                      'bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        index === 2 ? 'text-orange-700' :
                        'text-white'
                      }`}>
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
                        {team.score} pts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white py-4">No teams found</div>
            )}
          </Card>
          <h2 className="text-2xl font-bold text-white">Level Statistics</h2>
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {levelStats.map((level) => (
            <Card 
              key={level.levelId}
              className="bg-black/30 border-white/10 p-6 hover:bg-black/40 transition-colors cursor-pointer"
              onClick={() => setSelectedLevel(level.levelId)}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Level {level.levelNumber}
              </h3>
              <div className="space-y-2">
                <p className="text-purple-400">
                  Teams in this level: {level.totalTeams}
                </p>
                <p className="text-gray-400">
                  Total questions: {level.totalQuestions}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedLevel && (
        <QuestionStats 
          levelId={selectedLevel} 
          onClose={() => setSelectedLevel(null)} 
        />
      )}
    </div>
  );
}
