import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, Users, UserPlus, Rocket } from 'lucide-react';
import axios from 'axios';
import { JOIN_TEAM, CREATE_TEAM } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TeamSelectionModal({ isOpen, onClose }) {
    const [mode, setMode] = useState(null); // 'join' or 'create'
    const [teamCode, setTeamCode] = useState('');
    const [teamName, setTeamName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user,setUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'join') {
                const joinResponse = await axios.post(JOIN_TEAM, { teamCode }, {
                    withCredentials: true
                });
                if (joinResponse.data.success) {
                    console.log("--------------Data in joinResponse.data------- ",joinResponse.data );
                        
                    setUser({
                        ...user,
                        team:joinResponse.data.team._id
                    });
                    console.log("--------------Data in createResponse.data.user------- ",user );
                    navigate('/teamDetails');
                }
            } else if (mode === 'create') {
                const createResponse = await axios.post(CREATE_TEAM, { teamName }, {
                    withCredentials: true
                });
                if (createResponse.data.success) {
                    setUser({
                        ...user,
                        role: "team_leader",
                        team:createResponse.data.team._id
                    });
                    console.log("----------------Data in createeRespons---------------",createResponse );
                    navigate('/teamDetails');
                }
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Something went wrong';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-black/80 border border-white/10 rounded-lg p-6 w-full max-w-md"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Join Your Crew</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {!mode ? (
                    // Initial selection screen
                    <div className="space-y-4">
                        <Button
                            onClick={() => setMode('join')}
                            className="w-full h-24 bg-purple-600/20 hover:bg-purple-600/30 border-2 border-purple-500/50 text-white flex items-center justify-center gap-3 text-lg"
                        >
                            <Users size={24} />
                            Join Existing Team
                        </Button>
                        <Button
                            onClick={() => setMode('create')}
                            className="w-full h-24 bg-blue-600/20 hover:bg-blue-600/30 border-2 border-blue-500/50 text-white flex items-center justify-center gap-3 text-lg"
                        >
                            <UserPlus size={24} />
                            Create New Team
                        </Button>
                    </div>
                ) : (
                    // Form for either joining or creating team
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-4"
                            >
                                {mode === 'join' ? (
                                    <div className="space-y-2">
                                        <label className="text-white text-sm">Enter Team Code</label>
                                        <Input
                                            value={teamCode}
                                            onChange={(e) => setTeamCode(e.target.value)}
                                            placeholder="Enter the team code"
                                            className="bg-white/10 border-white/20 text-white"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-white text-sm">Team Name</label>
                                        <Input
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            placeholder="Enter your team name"
                                            className="bg-white/10 border-white/20 text-white"
                                            required
                                        />
                                    </div>
                                )}

                                {error && (
                                    <p className="text-red-400 text-sm">{error}</p>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        onClick={() => setMode(null)}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <Rocket className="animate-bounce" />
                                                Processing...
                                            </span>
                                        ) : (
                                            'Confirm'
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
