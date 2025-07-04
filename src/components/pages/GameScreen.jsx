import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import GameCanvas from "@/components/organisms/GameCanvas";
import GameHUD from "@/components/organisms/GameHUD";
import KillFeed from "@/components/molecules/KillFeed";
import gameService from "@/services/api/gameService";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const GameScreen = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [kills, setKills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  
  // Initialize game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        const initialState = await gameService.initializeGame();
        setGameState(initialState);
        toast.success("Match started! Survive and eliminate enemies!");
      } catch (error) {
        toast.error("Failed to initialize game");
        console.error("Game initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeGame();
  }, []);
  
  // Game loop
  useEffect(() => {
    if (!gameState || isPaused || gameEnded) return;
    
    const gameLoop = setInterval(async () => {
      try {
        const updatedState = await gameService.updateGame(gameState);
        setGameState(updatedState);
        
        // Check for game end conditions
        if (updatedState.gameOver) {
          setGameEnded(true);
          const stats = {
            kills: updatedState.player.kills || 0,
            deaths: updatedState.player.alive ? 0 : 1,
            damage: updatedState.player.damage || 0,
            survivalTime: updatedState.match.duration || 0,
            placement: updatedState.placement || 1,
            totalPlayers: updatedState.totalPlayers || 10
          };
          
          // Store stats for game over screen
          localStorage.setItem('gameStats', JSON.stringify(stats));
          
          setTimeout(() => {
            navigate("/game-over");
          }, 2000);
        }
        
        // Check for new kills
        if (updatedState.newKills && updatedState.newKills.length > 0) {
          setKills(prev => [...prev, ...updatedState.newKills]);
        }
        
      } catch (error) {
        console.error("Game loop error:", error);
      }
    }, 50); // 20 FPS game loop
    
    return () => clearInterval(gameLoop);
  }, [gameState, isPaused, gameEnded, navigate]);
  
  // Handle player movement
  const handlePlayerMove = useCallback(async ({ dx, dy }) => {
    if (!gameState || gameEnded) return;
    
    try {
      const updatedState = await gameService.movePlayer(gameState, dx, dy);
      setGameState(updatedState);
    } catch (error) {
      console.error("Movement error:", error);
    }
  }, [gameState, gameEnded]);
  
  // Handle player shooting
  const handlePlayerShoot = useCallback(async ({ x, y }) => {
    if (!gameState || gameEnded) return;
    
    try {
      const updatedState = await gameService.shootWeapon(gameState, x, y);
      setGameState(updatedState);
      
      // Check for hits and show damage
      if (updatedState.hitTarget) {
        toast.success(`Hit for ${updatedState.damage} damage!`);
      }
    } catch (error) {
      console.error("Shooting error:", error);
    }
  }, [gameState, gameEnded]);
  
  // Handle weapon selection
  const handleWeaponSelect = useCallback(async (weapon) => {
    if (!gameState || gameEnded) return;
    
    try {
      const updatedState = await gameService.selectWeapon(gameState, weapon);
      setGameState(updatedState);
    } catch (error) {
      console.error("Weapon selection error:", error);
    }
  }, [gameState, gameEnded]);
  
  // Handle pause/resume
  const handlePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Handle exit game
  const handleExitGame = () => {
    if (window.confirm("Are you sure you want to exit the match?")) {
      navigate("/");
    }
  };
  
  if (isLoading) {
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
          <p className="text-white text-xl">Loading battlefield...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen bg-background overflow-hidden relative">
      {/* Pause Menu */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="bg-gradient-to-br from-surface to-military-900 p-8 rounded-lg border border-military-600 text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-6">GAME PAUSED</h2>
            <div className="space-y-4">
              <Button onClick={handlePause} size="large" className="w-full">
                Resume Game
              </Button>
              <Button onClick={handleExitGame} variant="secondary" size="large" className="w-full">
                Exit Match
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Game Over Overlay */}
      {gameEnded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm z-40 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-6xl font-display font-bold text-white mb-4">
                {gameState?.player?.alive ? "VICTORY!" : "DEFEATED"}
              </h2>
              <p className="text-gray-400 text-xl">Redirecting to results...</p>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {/* Main Game Area */}
      <div className="flex h-full">
        {/* Game Canvas */}
        <div className="flex-1 flex items-center justify-center p-4">
          <GameCanvas
            gameState={gameState}
            onPlayerMove={handlePlayerMove}
            onPlayerShoot={handlePlayerShoot}
            onGameUpdate={setGameState}
          />
        </div>
      </div>
      
      {/* Game HUD Overlay */}
      <GameHUD
        gameState={gameState}
        onWeaponSelect={handleWeaponSelect}
      />
      
      {/* Kill Feed */}
      <KillFeed kills={kills} />
      
      {/* Pause Button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
        <Button
          onClick={handlePause}
          variant="ghost"
          size="small"
          icon="Pause"
          className="backdrop-blur-sm"
        >
          Pause
        </Button>
      </div>
    </div>
  );
};

export default GameScreen;