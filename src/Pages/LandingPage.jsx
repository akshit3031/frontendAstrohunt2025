// pages/LandingPage.js
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import SpaceBackground from "../components/space-background"; // Adjust the import path as necessary

function LandingPage() {
  return (
    <>
      <SpaceBackground />

      <main className="relative min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <motion.h1
            className="text-6xl font-bold text-white"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Treasure Hunt
          </motion.h1>
          <motion.p
            className="text-xl text-white/80 max-w-md mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Embark on an intergalactic treasure hunt, solving cosmic puzzles and uncovering hidden riches across the
            universe
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link to="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Your Journey
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 p-6 backdrop-blur-xl bg-black/30 border border-white/10 rounded-lg max-w-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Event Details</h2>
          <div className="text-white/80 space-y-2 text-left">
            <p>🚀 Navigate through star systems in search of treasure</p>
            <p>💫 Solve cosmic riddles to unlock secret vaults</p>
            <p>🏆 Compete with space pirates on the galactic leaderboard</p>
            <p>🎮 Track your interstellar loot in real-time</p>
          </div>
        </motion.div>
      </main>
    </>
  );
}

export default LandingPage;
