import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Users, Copy, Check, Rocket } from 'lucide-react';
import SpaceBackground from '../components/space-background';
import axios from 'axios';
import { GET_TEAM_DETAILS, GET_GAME_DETAILS } from '../constants';

import NavBar from '../components/navbar';
export default function TeamDetailsPage() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    const [teamDetails, setTeamDetails] = useState([]);
    const [hasGameStarted, setHasGameStarted] = useState(false);



    const fetchTeamDetails = async () => {
        try {
            const response = await axios.get(GET_TEAM_DETAILS(user.team), {
                withCredentials: true
            });
            if (response.data.success) {
                setTeamDetails(response.data.team);
            }
        } catch (error) {
            console.error('Error fetching team details:', error);
        }
    };

    const fetchHasGameStarted = async () => {
        try {
            const response = await axios.get(GET_GAME_DETAILS, {
                withCredentials: true
            });
            
            if (response.data.success && response.data.gameDetails) {
                setHasGameStarted(response.data.gameDetails.hasGameStarted || true);
            }
        } catch (error) {
            console.error("Error fetching game details:", error);
        }
    };

    // Single useEffect at the top level
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchTeamDetails(),
                    fetchHasGameStarted()
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array is fine since we only want to fetch once on mount

    const handleCopyCode = () => {
        navigator.clipboard.writeText(teamDetails.team_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const startGame = async () => {
        navigate('/game');
    };

    if (loading) {
        return <div>Loading team details...</div>;
    }
    


    return (
        <>
            <SpaceBackground />
            <NavBar />
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="backdrop-blur-xl bg-black/30 border-white/10 p-8 w-full max-w-2xl">
                    <div className="space-y-8">
                        {/* Team Header */}
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-white">
                                {teamDetails.teamName}
                            </h1>
                            <p className="text-white/60">
                                {user.role === 'team_leader' ? 'You are the Team Leader' : 'You are a Team Member'}
                            </p>
                        </div>

                        {/* Team Code Section (Only visible to team leader) */}
                        {user.role === 'team_leader' && (
                            <div className="bg-purple-900/30 rounded-lg p-6 space-y-3">
                                <h2 className="text-xl font-semibold text-white">Team Code</h2>
                                <div className="flex items-center justify-between bg-black/30 p-4 rounded-md">
                                    <code className="text-xl font-mono text-purple-300">
                                        {teamDetails.team_code}
                                    </code>
                                    <Button
                                        onClick={handleCopyCode}
                                        variant="ghost"
                                        className="hover:bg-purple-500/20"
                                    >
                                        {copied ? (
                                            <Check className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-purple-400" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-sm text-white/60">
                                    Share this code with your teammates to let them join your team.
                                </p>
                            </div>
                        )}

                        {/* Team Members List */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Team Members
                            </h2>
                            <div className="grid gap-3 text-white">
                                {teamDetails.members.map((member) => (
                                    <div
                                        key={member._id}
                                        className="flex items-center justify-between bg-white/5 p-4 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                {member.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{member.name}</p>
                                                <p className="text-white/60 text-sm">{member.email}</p>
                                            </div>
                                        </div>
                                        {member.role === 'team_leader' && (
                                            <span className="text-xs text-purple-400 font-medium px-2 py-1 bg-purple-400/10 rounded-full">
                                                Leader
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Start Game Button Section */}
                        <div className="space-y-4">
                            <Button
                                onClick={startGame}
                                disabled={!hasGameStarted}
                                className={`w-full py-6 text-lg ${hasGameStarted
                                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                        : "bg-gray-600 cursor-not-allowed opacity-50"
                                    }`}
                            >
                                <Rocket className="w-6 h-6 mr-2" />
                                Start Mission
                            </Button>

                            {/* Game Status Message */}
                            {!hasGameStarted && (
                                <div className="text-center">
                                    <p className="text-yellow-400 text-sm">
                                        ⚠️ The game has not started yet. Please wait for the admin to start the game.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
}
