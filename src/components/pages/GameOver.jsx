import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import GameStats from "@/components/organisms/GameStats";
import ApperIcon from "@/components/ApperIcon";

const GameOver = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const gameStats = localStorage.getItem('gameStats');
    if (gameStats) {
      setStats(JSON.parse(gameStats));
    } else {
      // Default stats if none found
      setStats({
        kills: 0,
        deaths: 1,
        damage: 0,
        survivalTime: 0,
        placement: 10,
        totalPlayers: 10
      });
    }
  }, []);
  
  const handlePlayAgain = () => {
    localStorage.removeItem('gameStats');
    navigate("/game");
  };
  
  const handleMainMenu = () => {
    localStorage.removeItem('gameStats');
    navigate("/");
  };
  
  if (!stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <ApperIcon name="Loader2" className="w-16 h-16 text-tactical-500 mx-auto" />
          </motion.div>
          <p className="text-white text-xl">Loading results...</p>
        </div>
      </div>
    );
  }
  
  const isVictory = stats.placement === 1;
  const isTopTen = stats.placement <= 10;
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-military-900" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-military-600 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Result Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <ApperIcon 
              name={isVictory ? "Crown" : "Skull"} 
              className={`w-16 h-16 ${isVictory ? 'text-yellow-500' : 'text-red-500'}`} 
            />
            <div>
              <h1 className={`text-6xl font-display font-bold mb-2 ${
                isVictory 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent'
              }`}>
                {isVictory ? "VICTORY!" : "DEFEATED"}
              </h1>
              <p className={`text-2xl font-display ${
                isVictory ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {isVictory ? "CHICKEN DINNER!" : `#${stats.placement} OF ${stats.totalPlayers}`}
              </p>
            </div>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center"
          >
            <div className={`inline-block px-6 py-3 rounded-full border-2 ${
              isVictory 
                ? 'border-yellow-500 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20' 
                : isTopTen 
                  ? 'border-blue-500 bg-gradient-to-r from-blue-500/20 to-blue-600/20'
                  : 'border-red-500 bg-gradient-to-r from-red-500/20 to-red-600/20'
            }`}>
              <span className={`text-xl font-bold ${
                isVictory ? 'text-yellow-400' : isTopTen ? 'text-blue-400' : 'text-red-400'
              }`}>
                {isVictory ? "WINNER" : isTopTen ? "TOP 10" : "ELIMINATED"}
              </span>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Game Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl mb-8"
        >
          <div className="bg-gradient-to-br from-surface/80 to-military-900/80 backdrop-blur-sm rounded-lg border border-military-600/50 p-6">
            <h2 className="text-2xl font-display font-bold text-white mb-6 text-center">
              MATCH STATISTICS
            </h2>
            <GameStats stats={stats} />
          </div>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        >
          <Button
            onClick={handlePlayAgain}
            size="large"
            className="flex-1 text-lg py-4"
            icon="RotateCcw"
          >
            Play Again
          </Button>
          
          <Button
            onClick={handleMainMenu}
            variant="secondary"
            size="large"
            className="flex-1 text-lg py-4"
            icon="Home"
          >
            Main Menu
          </Button>
        </motion.div>
        
        {/* Performance Feedback */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 text-center max-w-md"
        >
          <p className="text-gray-400 text-sm">
            {isVictory 
              ? "Outstanding performance! You dominated the battlefield and claimed victory!"
              : stats.kills > 5 
                ? "Excellent combat skills! You eliminated multiple enemies before falling."
                : stats.placement <= 5
                  ? "Great survival instincts! You made it to the final circle."
                  : "Keep practicing! Every match is a learning opportunity."
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default GameOver;