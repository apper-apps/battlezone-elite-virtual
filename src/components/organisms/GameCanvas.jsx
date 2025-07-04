import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Box, Sphere, Plane } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// First Person Controls Component
const FirstPersonControls = ({ gameState, onPlayerMove, onPlayerShoot, enabled = true }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const velocityRef = useRef(new THREE.Vector3());
  const directionRef = useRef(new THREE.Vector3());
  const [moveState, setMoveState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false
  });

  // Handle keyboard input
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
          setMoveState(prev => ({ ...prev, forward: true }));
          break;
        case 'KeyS':
          setMoveState(prev => ({ ...prev, backward: true }));
          break;
        case 'KeyA':
          setMoveState(prev => ({ ...prev, left: true }));
          break;
        case 'KeyD':
          setMoveState(prev => ({ ...prev, right: true }));
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
          setMoveState(prev => ({ ...prev, forward: false }));
          break;
        case 'KeyS':
          setMoveState(prev => ({ ...prev, backward: false }));
          break;
        case 'KeyA':
          setMoveState(prev => ({ ...prev, left: false }));
          break;
        case 'KeyD':
          setMoveState(prev => ({ ...prev, right: false }));
          break;
      }
    };

    const handleClick = (event) => {
      if (event.button === 0) { // Left click
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        
        // Convert 3D direction to target position for shooting
        const targetPos = camera.position.clone().add(direction.multiplyScalar(100));
        onPlayerShoot({ 
          x: targetPos.x, 
          y: targetPos.z, // Use Z as Y for 2D compatibility
          z: targetPos.y
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    gl.domElement.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [camera, gl, onPlayerShoot, enabled]);

  // Movement frame update
  useFrame((state, delta) => {
    if (!enabled || !controlsRef.current) return;

    const velocity = velocityRef.current;
    const direction = directionRef.current;
    
    direction.set(0, 0, 0);

    if (moveState.forward) direction.z -= 1;
    if (moveState.backward) direction.z += 1;
    if (moveState.left) direction.x -= 1;
    if (moveState.right) direction.x += 1;

    direction.normalize();

    const speed = 50; // Units per second
    velocity.copy(direction).multiplyScalar(speed * delta);

    if (velocity.length() > 0) {
      // Update camera position
      camera.position.add(velocity);
      
      // Clamp camera position to bounds
      camera.position.x = Math.max(-375, Math.min(375, camera.position.x));
      camera.position.z = Math.max(-275, Math.min(275, camera.position.z));
      camera.position.y = Math.max(10, Math.min(50, camera.position.y));

      // Notify parent about movement
      onPlayerMove({
        dx: velocity.x,
        dy: velocity.z, // Map Z to Y for 2D compatibility
        dz: velocity.y,
        position: {
          x: camera.position.x,
          y: camera.position.z, // Map Z to Y for 2D compatibility  
          z: camera.position.y
        }
      });
    }
  });

  // Update camera position based on player state
  useEffect(() => {
    if (gameState?.player?.position) {
      const pos = gameState.player.position;
      camera.position.set(
        pos.x || 0,
        (pos.z || 0) + 20, // Raise camera above ground
        pos.y || 0
      );
    }
  }, [gameState?.player?.position, camera]);

  return (
    <PointerLockControls
      ref={controlsRef}
      camera={camera}
      domElement={gl.domElement}
      enabled={enabled}
    />
  );
};

// 3D Game Scene Component
const GameScene = ({ gameState }) => {
  if (!gameState) return null;

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      
      {/* Directional lighting */}
      <directionalLight
        position={[50, 100, 50]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Ground plane */}
      <Plane
        args={[800, 600]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshLambertMaterial color="#1A1F1B" />
      </Plane>

      {/* Terrain blocks */}
      {Array.from({ length: 20 }, (_, x) =>
        Array.from({ length: 15 }, (_, y) => {
          if ((x * 40 + y * 40) % 80 === 0) {
            return (
              <Box
                key={`terrain-${x}-${y}`}
                args={[20, 2, 20]}
                position={[x * 40 - 400, 1, y * 40 - 300]}
                castShadow
                receiveShadow
              >
                <meshLambertMaterial color="#2C4A3D" />
              </Box>
            );
          }
          return null;
        })
      )}

      {/* Zone visualization */}
      {gameState.zone && (
        <mesh
          position={[gameState.zone.center.x - 400, 0.1, gameState.zone.center.y - 300]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[gameState.zone.radius - 5, gameState.zone.radius, 64]} />
          <meshBasicMaterial color="#FF6B35" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Enemies */}
      {gameState.enemies?.filter(enemy => enemy.alive).map(enemy => (
        <Box
          key={enemy.Id}
          args={[12, 20, 12]}
          position={[enemy.position.x - 400, 10, enemy.position.y - 300]}
          castShadow
        >
          <meshLambertMaterial color="#EF5350" />
        </Box>
      ))}

      {/* Bullets */}
      {gameState.bullets?.map((bullet, index) => (
        <Sphere
          key={index}
          args={[1.5]}
          position={[bullet.position.x - 400, 5, bullet.position.y - 300]}
        >
          <meshBasicMaterial color="#FFA726" emissive="#FFA726" emissiveIntensity={0.5} />
        </Sphere>
      ))}

      {/* Pickups */}
      {gameState.pickups?.map(pickup => (
        <Box
          key={pickup.Id}
          args={[8, 8, 8]}
          position={[pickup.position.x - 400, 4, pickup.position.y - 300]}
          castShadow
        >
          <meshLambertMaterial 
            color={pickup.type === 'health' ? '#4CAF50' : pickup.type === 'armor' ? '#2196F3' : '#FFA726'}
            emissive={pickup.type === 'health' ? '#4CAF50' : pickup.type === 'armor' ? '#2196F3' : '#FFA726'}
            emissiveIntensity={0.2}
          />
        </Box>
      ))}
    </>
  );
};

const GameCanvas = ({ 
  gameState, 
  onPlayerMove, 
  onPlayerShoot, 
  onGameUpdate,
  className = "" 
}) => {
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  const handlePointerLockChange = () => {
    setIsPointerLocked(document.pointerLockElement !== null);
  };

  useEffect(() => {
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  return (
    <motion.div 
      className={`relative w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas
        camera={{ 
          position: [0, 20, 0], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        shadows
        className="game-canvas rounded-lg"
        style={{ background: 'linear-gradient(135deg, #0F1410 0%, #1A1F1B 100%)' }}
      >
        <FirstPersonControls
          gameState={gameState}
          onPlayerMove={onPlayerMove}
          onPlayerShoot={onPlayerShoot}
          enabled={true}
        />
        <GameScene gameState={gameState} />
      </Canvas>

      {/* Instructions overlay */}
      {!isPointerLocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
          <div className="text-white text-center">
            <p className="text-xl font-bold mb-2">Click to Play</p>
            <p className="text-sm">WASD to move • Mouse to look • Click to shoot</p>
          </div>
        </div>
      )}

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-6 h-6 border-2 border-tactical-600 rounded-full opacity-80" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-tactical-600 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Zone warning overlay */}
      {gameState?.player && gameState?.zone && (
        (() => {
          const playerPos = gameState.player.position;
          const zoneCenter = gameState.zone.center;
          const distance = Math.sqrt(
            Math.pow((playerPos.x || 0) - zoneCenter.x, 2) +
            Math.pow((playerPos.y || 0) - zoneCenter.y, 2)
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