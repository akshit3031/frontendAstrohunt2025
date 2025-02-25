import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Lock, Key } from 'lucide-react';
import { SET_NEW_PASSWORD } from '../constants';

const SpaceBackground = React.lazy(() => import("../components/space-background"));

const SetNewPasswordPage = () => {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        try {
            const response = await axios.post(SET_NEW_PASSWORD, { otp, newPassword }, { withCredentials: true });
            setMessage(response.data.message);
            if (response.data.success) {
                navigate('/login');
            }
            else {
                console.log("ERROR:", response.data.error);
            }
        } catch (error) {
            setMessage(error.response.data.message || 'An error occurred');
        }
    };

    return (
        <>
            <React.Suspense fallback={<div>Loading...</div>}>
                <SpaceBackground />
            </React.Suspense>
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
                    <Card className="backdrop-blur-xl bg-black/30 border-white/10 p-8">
                        <div className="flex justify-center mb-8">
                            <Lock className="w-12 h-12 text-purple-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-center mb-8 text-white">Set New Password</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-white">
                                    OTP
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="bg-white/10 border-white/20 text-white pl-10"
                                        required
                                    />
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-white">
                                    New Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="bg-white/10 border-white/20 text-white pl-10"
                                        required
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-white">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="bg-white/10 border-white/20 text-white pl-10"
                                        required
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                                </div>
                            </div>
                            {message && <p className="text-red-500 text-sm">{message}</p>}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            >Submit</Button>
                        </form>
                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-sm text-purple-400 hover:text-purple-300">
                                Back to Login
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            </div >
        </>
    );
};

export default SetNewPasswordPage;