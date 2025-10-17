import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/card';
import { X } from 'lucide-react';
import { FETCH_LEVEL_QUESTION_STATS, RELEASE_HINT } from '../../constants';

export default function QuestionStats({ levelId, levelData, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isCompletionLevel = levelData?.isCompletionLevel;

  useEffect(() => {
    const fetchQuestionStats = async () => {
      // Skip fetching if levelId is null (completion level has no questions)
      if (!levelId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(FETCH_LEVEL_QUESTION_STATS(levelId), {
          withCredentials: true
        });
        if (response.data.success) {
          console.log("Question stats:", response.data);
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching question stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionStats();
    
    // Only set interval if levelId exists
    if (levelId) {
      const interval = setInterval(fetchQuestionStats, 30000);
      return () => clearInterval(interval);
    }
  }, [levelId]);

  const releaseHint = async (questionId, hintId) => {
    try {
      const response = await axios.post(RELEASE_HINT(questionId, hintId), {},{
        withCredentials: true
      });
      if (response.data.success) {
        console.log("Hint released successfully");
        setStats(prevStats => ({
          ...prevStats,
          questionStats: prevStats.questionStats.map(question => 
            question.questionId === questionId
              ? {
                  ...question,
                  hints: question.hints.map(hint =>
                    hint._id === hintId ? { ...hint, flag: true } : hint
                  )
                }
              : question
          )
        }));
      }
    }
    catch(error){
      console.error('Error releasing hint:', error);
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-black/80 border-white/10 p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {isCompletionLevel ? (
              <span className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Completed Teams
              </span>
            ) : (
              `Level ${stats?.levelNumber} Questions`
            )}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-white">Loading...</div>
        ) : isCompletionLevel ? (
          // Show completed teams for completion level
          <div className="space-y-4">
            <p className="text-green-400 text-lg mb-4">
              {levelData?.totalTeams || 0} team(s) have completed all levels
            </p>
            {levelData?.teamNames && levelData.teamNames.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {levelData.teamNames.map((team, index) => (
                  <div 
                    key={team.teamId}
                    className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl text-yellow-500">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆'}
                      </span>
                      <div>
                        <p className="text-white font-semibold text-lg">
                          {team.teamName}
                        </p>
                        <p className="text-green-400 text-sm">
                          Rank #{index + 1}
                        </p>
                      </div>
                    </div>
                    <span className="text-green-400 font-bold">✓ Complete</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                No teams have completed all levels yet
              </div>
            )}
          </div>
        ) : (
          // Show questions for regular levels
          <div className="space-y-4">
            {stats?.questionStats.map((question) => (
              <div 
                key={question.questionId}
                className="bg-white/5 p-4 rounded-lg"
              >
                <h1 className="text-white text-2xl font-bold mb-2">Question ID: {question.questionId}</h1>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {question.title}
                </h3>
                <p className="text-purple-400 mb-3">
                  Currently attempting: {question.currentlyAttempting} teams
                </p>
                {question.attemptingTeams.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">
                      Teams currently on this question:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {question.attemptingTeams.map((team) => (
                        <span 
                          key={team.teamId}
                          className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md text-sm"
                        >
                          {team.teamName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="text-sm text-gray-400 mt-4">
                  <div className="space-y-2">
                    <p className="font-semibold">Hints:</p>
                    {question.hints.map((hint, index) => (
                      <div 
                        key={hint.id} 
                        className="flex items-center justify-between bg-black/20 p-3 rounded-lg"
                      >
                        <div className="flex flex-col">
                          <span className="text-white mb-1">
                            Hint {index + 1}: {hint.text}
                          </span>
                          <span className="text-sm text-gray-400">
                            Status: {hint.flag ? '🟢 Released' : '🔒 Locked'}
                          </span>
                        </div>
                        {!hint.flag && (
                          <button
                            onClick={() => releaseHint(question.questionId, hint._id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Release Hint
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2">Correct Code: <span className="font-mono">{question.correctCode}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}