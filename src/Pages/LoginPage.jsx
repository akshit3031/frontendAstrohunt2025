import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Rocket, User, Lock } from "lucide-react";
import { Link } from "react-router-dom"; // for navigation
import { useAuth } from '../context/AuthContext';

const SpaceBackground = React.lazy(() => import("../components/space-background"));

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      console.log("----------------Data in login---------------",data.user );
      if (data.user.role === 'admin') {
        navigate('/admin');
      }else if(!data.user.team){
        console.log("No team");
        navigate('/teamSelection');
      }
      else {
        navigate('/teamDetails');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
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
              <Rocket className="w-12 h-12 text-purple-500" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-8 text-white">Login to Space Quest</h1>
            <form onSubmit={handleLogin} className="space-y-6">
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
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                </div>
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Launching..." : "Launch Mission"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/forgotPassword" className="text-sm text-purple-400 hover:text-purple-300">
                Forgot password?
              </Link>
            </div>
            <div className="mt-4 text-center">
              <span className="text-white">Don't have an account? </span>
              <Link to="/signup" className="text-purple-400 hover:text-purple-300">
                Sign up
              </Link>
            </div>
          </Card>

        </motion.div>
      
      </div>
    </>
  );
}
