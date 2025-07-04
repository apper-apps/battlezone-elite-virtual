import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const GameCanvas = ({ 
  gameState, 
  onPlayerMove, 
  onPlayerShoot, 
  onGameUpdate,
  className = "" 
}) => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef();
  
  // Game constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const PLAYER_SIZE = 12;
  const BULLET_SIZE = 3;
  const ENEMY_SIZE = 12;
  
  // Handle mouse movement for aiming
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    };
    
    const handleClick = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onPlayerShoot({ x, y });
    };
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('click', handleClick);
      
      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleClick);
      };
    }
  }, [onPlayerShoot]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const moveSpeed = 3;
      let dx = 0, dy = 0;
      
      switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          dy = -moveSpeed;
          break;
        case 's':
        case 'arrowdown':
          dy = moveSpeed;
          break;
        case 'a':
        case 'arrowleft':
          dx = -moveSpeed;
          break;
        case 'd':
        case 'arrowright':
          dx = moveSpeed;
          break;
      }
      
      if (dx !== 0 || dy !== 0) {
        onPlayerMove({ dx, dy });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayerMove]);
  
  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#0F1410';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw terrain pattern
      ctx.fillStyle = '#1A1F1B';
      for (let x = 0; x < CANVAS_WIDTH; x += 40) {
        for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
          if ((x + y) % 80 === 0) {
            ctx.fillRect(x, y, 20, 20);
          }
        }
      }
      
      // Draw zone circle
      if (gameState.zone) {
        ctx.strokeStyle = '#FF6B35';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(
          gameState.zone.center.x, 
          gameState.zone.center.y, 
          gameState.zone.radius, 
          0, 
          2 * Math.PI
        );
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Draw enemies
      if (gameState.enemies) {
        gameState.enemies.forEach(enemy => {
          if (enemy.alive) {
            ctx.fillStyle = '#EF5350';
            ctx.fillRect(
              enemy.position.x - ENEMY_SIZE/2,
              enemy.position.y - ENEMY_SIZE/2,
              ENEMY_SIZE,
              ENEMY_SIZE
            );
            
            // Enemy health bar
            const healthWidth = (enemy.health / 100) * ENEMY_SIZE;
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(
              enemy.position.x - ENEMY_SIZE/2,
              enemy.position.y - ENEMY_SIZE/2 - 8,
              healthWidth,
              3
            );
          }
        });
      }
      
      // Draw player
      if (gameState.player && gameState.player.alive) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(
          gameState.player.position.x - PLAYER_SIZE/2,
          gameState.player.position.y - PLAYER_SIZE/2,
          PLAYER_SIZE,
          PLAYER_SIZE
        );
        
        // Player direction indicator
        const angle = Math.atan2(
          mousePosition.y - gameState.player.position.y,
          mousePosition.x - gameState.player.position.x
        );
        
        ctx.strokeStyle = '#66BB6A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gameState.player.position.x, gameState.player.position.y);
        ctx.lineTo(
          gameState.player.position.x + Math.cos(angle) * 20,
          gameState.player.position.y + Math.sin(angle) * 20
        );
        ctx.stroke();
      }
      
      // Draw bullets
      if (gameState.bullets) {
        ctx.fillStyle = '#FFA726';
        gameState.bullets.forEach(bullet => {
          ctx.fillRect(
            bullet.position.x - BULLET_SIZE/2,
            bullet.position.y - BULLET_SIZE/2,
            BULLET_SIZE,
            BULLET_SIZE
          );
        });
      }
      
      // Draw pickups
      if (gameState.pickups) {
        gameState.pickups.forEach(pickup => {
          ctx.fillStyle = pickup.type === 'health' ? '#4CAF50' : '#2196F3';
          ctx.fillRect(
            pickup.position.x - 8,
            pickup.position.y - 8,
            16,
            16
          );
          
          // Pickup glow effect
          ctx.shadowColor = pickup.type === 'health' ? '#4CAF50' : '#2196F3';
          ctx.shadowBlur = 10;
          ctx.fillRect(
            pickup.position.x - 6,
            pickup.position.y - 6,
            12,
            12
          );
          ctx.shadowBlur = 0;
        });
      }
      
      animationFrameRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, mousePosition]);
  
  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas rounded-lg cursor-crosshair"
      />
      
      {/* Crosshair */}
      <div 
        className="crosshair"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />
      
      {/* Zone warning overlay */}
      {gameState.player && gameState.zone && (
        (() => {
          const distance = Math.sqrt(
            Math.pow(gameState.player.position.x - gameState.zone.center.x, 2) +
            Math.pow(gameState.player.position.y - gameState.zone.center.y, 2)
          );
          const isOutsideZone = distance > gameState.zone.radius;
          
          return isOutsideZone ? (
            <div className="absolute inset-0 zone-warning rounded-lg pointer-events-none flex items-center justify-center">
              <div className="text-white text-2xl font-bold text-center">
                <div>GET TO THE ZONE!</div>
                <div className="text-lg">Taking damage...</div>
              </div>
            </div>
          ) : null;
        })()
      )}
    </motion.div>
  );
};

export default GameCanvas;