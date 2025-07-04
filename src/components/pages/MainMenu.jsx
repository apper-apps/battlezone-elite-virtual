import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const MainMenu = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStartGame = async () => {
    setIsLoading(true);
    // Simulate match finding
    await new Promise(resolve => setTimeout(resolve, 2000));
    navigate("/game");
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-military-900" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-military-600 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <ApperIcon name="Crosshair" className="w-16 h-16 text-tactical-500" />
            <div>
              <h1 className="text-6xl font-display font-bold bg-gradient-to-r from-tactical-500 to-tactical-600 bg-clip-text text-transparent">
                BATTLEZONE
              </h1>
              <p className="text-2xl font-display text-military-400 tracking-wider">
                ELITE
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Survive. Dominate. Become the last soldier standing in intense tactical combat.
          </p>
        </motion.div>
        
        {/* Menu Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 w-full max-w-sm"
        >
          <Button
            onClick={handleStartGame}
            disabled={isLoading}
            size="large"
            className="w-full text-xl py-4"
            icon={isLoading ? "Loader2" : "Play"}
          >
            {isLoading ? "Finding Match..." : "START BATTLE"}
          </Button>
          
          <Button
            variant="secondary"
            size="large"
            className="w-full text-lg py-3"
            icon="Settings"
          >
            Settings
          </Button>
          
          <Button
            variant="ghost"
            size="large"
            className="w-full text-lg py-3"
            icon="HelpCircle"
          >
            How to Play
          </Button>
        </motion.div>
        
        {/* Loading Animation */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ApperIcon name="Loader2" className="w-8 h-8 text-tactical-500" />
              </motion.div>
              <span className="text-gray-300">Preparing battlefield...</span>
            </div>
            <div className="w-64 h-2 bg-military-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-tactical-500 to-tactical-600"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              />
            </div>
          </motion.div>
        )}
        
        {/* Game Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
        >
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-military-800/50 to-military-900/50 backdrop-blur-sm border border-military-600/30">
            <ApperIcon name="Target" className="w-12 h-12 text-tactical-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Tactical Combat</h3>
            <p className="text-gray-400">Realistic weapon mechanics with authentic ballistics and recoil patterns</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-military-800/50 to-military-900/50 backdrop-blur-sm border border-military-600/30">
            <ApperIcon name="MapPin" className="w-12 h-12 text-tactical-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Dynamic Zone</h3>
            <p className="text-gray-400">Shrinking battlefield forces intense encounters and strategic positioning</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-gradient-to-br from-military-800/50 to-military-900/50 backdrop-blur-sm border border-military-600/30">
            <ApperIcon name="Users" className="w-12 h-12 text-tactical-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Last Man Standing</h3>
            <p className="text-gray-400">Compete against skilled AI opponents in intense survival matches</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MainMenu;