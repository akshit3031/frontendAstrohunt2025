import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Mail } from 'lucide-react';
import { INTITATE_FORGOT_PASSWORD } from '../constants'
import { useNavigate } from 'react-router-dom';

const SpaceBackground = React.lazy(() => import("../components/space-background"));

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(INTITATE_FORGOT_PASSWORD, { email }, { withCredentials: true });
            setMessage(response.data.message);

            if (!response.data.success) {
                console.log("Error occured in response");
                console.log(response.data.error);
            }
            else {
                navigate('/setNewPassword');
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
                            <Mail className="w-12 h-12 text-purple-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-center mb-8 text-white">Forgot Password</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="commander@spacequest.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-white/10 border-white/20 text-white pl-10"
                                        required
                                    />
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                                </div>
                            </div>
                            {message && <p className="text-green-500 text-sm">{message}</p>}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            >
                                Submit
                            </Button>
                        </form>
                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-sm text-purple-400 hover:text-purple-300">
                                Back to Login
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;