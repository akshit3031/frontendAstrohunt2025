import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { KeyRound } from "lucide-react";
import { VERIFY_OTP } from "../constants";
import { useAuth } from '../context/AuthContext'; 

const SpaceBackground = React.lazy(() => import("../components/space-background"));
export default function OTPVerificationPage() {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const { user,setUser } = useAuth(); // Get setUser from auth context

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(
                VERIFY_OTP,
                { otp },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }
            );
            console.log("Response from verifyAndRegister", response.data);
            alert("OTP verified");
            if (response.data.success) {
                // console.log('///////////////////',user);
               // Update the auth context with user data
               setUser(response.data.user);

              
               // Navigate to the appropriate route
               if (response.data.user.role === 'admin') {
                   navigate('/admin');
               }else if(!response.data.user.team){
                    navigate('/teamSelection');
               } 
               else {
                    
                   navigate('/game');
               }
            } else {
                setError(response.data.message || "OTP verification failed");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to verify OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

  

    return (
        <>
         <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
            <React.Suspense fallback={<div>Loading...</div>}>
                <SpaceBackground />
            </React.Suspense>

            <Card className="w-full max-w-md mx-4 bg-black/50 backdrop-blur-xl border-white/20">
                <div className="p-6">
                    <div className="text-center space-y-2 mb-6">
                        <h1 className="text-3xl font-bold text-white">Verify OTP</h1>
                        <p className="text-gray-400">Please enter the OTP sent to your email</p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-white">
                                OTP
                            </Label>
                            <div className="relative">
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter your OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="bg-white/10 border-white/20 text-white pl-10"
                                    required
                                />
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </form>
                    
                </div>
            </Card>
        </div>
        </>
       
    );
}
