// SignupPage.js

import React, { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Rocket, User, Lock, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { REGISTER } from "../constants";

// Dynamically import SpaceBackground using React.lazy
const SpaceBackground = React.lazy(() => import("../components/space-background"));

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleRollNumberChange = (e) => {
    const rollNo = e.target.value;
    setRollNumber(rollNo);
    setEmail(rollNo+"@nitkkr.ac.in");
  };

  // Email validation function
  const validateEmail = (email) => {
    const nitkkrDomain = /@nitkkr\.ac\.in$/;
    if (!nitkkrDomain.test(email)) {
      setEmailError("Please use your NIT KKR email (@nitkkr.ac.in)");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateEmail(email)) {
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      const userData = {
        name: username,

        email,
        password,
        rollNo: rollNumber,
        phoneNo:phoneNumber
      };

      const response = await axios.post(
        REGISTER,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      if(response.data.otpSent){
        navigate("/verify-otp");
      }

      if (response.data.success) {
        navigate("/teamSelection");
      } else {
        setError(response.data.message || "Signup failed");
      }

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Suspense fallback={<div>Loading background...</div>}>
        <SpaceBackground />
      </Suspense>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
          <Card className="backdrop-blur-xl bg-black/30 border-white/10 p-8">
            <div className="flex justify-center mb-8">
              <Rocket className="w-12 h-12 text-purple-500" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-8 text-white">Join Space Quest</h1>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    placeholder="cosmic_explorer"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/10 border-white/20 text-white pl-10"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNumber" className="text-white">
                  Roll Number
                </Label>
                <div className="relative">
                  <Input
                    id="rollNumber"
                    type="number"
                    placeholder="12345678"
                    value={rollNumber}
                    onChange={handleRollNumberChange}
                    className="bg-white/10 border-white/20 text-white pl-10"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white">
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="phoneNumber"
                    type="tel"
                    pattern="[0-9]{10}"
                    placeholder="1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-white/10 border-white/20 text-white pl-10"
                    required
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="commander@nitkkr.ac.in"
                    value={email}
                    disabled
                    
                    className="bg-white/10 border-white/20 text-white pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                </div>
                {emailError && <p className="text-yellow-500 text-sm">{emailError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Preparing for Launch..." : "Launch into Space"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <span className="text-white">Already have an account? </span>
              <Link to="/login" className="text-purple-400 hover:text-purple-300">
                Log in
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
