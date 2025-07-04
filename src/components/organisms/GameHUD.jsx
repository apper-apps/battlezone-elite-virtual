import { motion } from "framer-motion";
import HealthBar from "@/components/atoms/HealthBar";
import WeaponSelector from "@/components/molecules/WeaponSelector";
import AmmoCounter from "@/components/molecules/AmmoCounter";
import ApperIcon from "@/components/ApperIcon";

const GameHUD = ({ 
  gameState, 
  onWeaponSelect, 
  className = "" 
}) => {
  const { player, zone, match } = gameState;
  
  if (!player) return null;
  
  const playersAlive = match?.players?.filter(p => p.alive).length || 0;
  const zoneTimeLeft = zone?.shrinkTime || 0;
  
  return (
    <motion.div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Players Alive */}
        <div className="hud-panel rounded-lg p-3 pointer-events-auto">
          <div className="flex items-center gap-2">
            <ApperIcon name="Users" className="w-5 h-5 text-tactical-400" />
            <span className="text-white font-bold text-lg">{playersAlive}</span>
            <span className="text-gray-400 text-sm">ALIVE</span>
          </div>
        </div>
        
        {/* Zone Timer */}
        <div className="hud-panel rounded-lg p-3 pointer-events-auto">
          <div className="flex items-center gap-2">
            <ApperIcon name="Clock" className="w-5 h-5 text-tactical-400" />
            <span className="text-white font-bold text-lg">
              {Math.ceil(zoneTimeLeft / 1000)}s
            </span>
            <span className="text-gray-400 text-sm">ZONE</span>
          </div>
        </div>
        
        {/* Match Timer */}
        <div className="hud-panel rounded-lg p-3 pointer-events-auto">
          <div className="flex items-center gap-2">
            <ApperIcon name="Timer" className="w-5 h-5 text-tactical-400" />
            <span className="text-white font-bold text-lg">
              {Math.floor((match?.duration || 0) / 60000)}:
              {String(Math.floor(((match?.duration || 0) % 60000) / 1000)).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
      
      {/* Bottom Left HUD */}
      <div className="absolute bottom-4 left-4 space-y-3">
        {/* Health and Armor */}
        <div className="hud-panel rounded-lg p-4 pointer-events-auto min-w-[200px]">
          <HealthBar 
            current={player.health} 
            max={100} 
            type="health"
            className="mb-2"
          />
          <HealthBar 
            current={player.armor} 
            max={100} 
            type="armor"
          />
        </div>
        
        {/* Weapon Selector */}
        <div className="hud-panel rounded-lg p-3 pointer-events-auto">
          <WeaponSelector
            weapons={player.weapons || []}
            selectedWeapon={player.currentWeapon}
            onWeaponSelect={onWeaponSelect}
          />
        </div>
      </div>
      
      {/* Bottom Right HUD */}
      <div className="absolute bottom-4 right-4 space-y-3">
        {/* Ammo Counter */}
        <div className="hud-panel rounded-lg p-4 pointer-events-auto">
          <AmmoCounter
            currentAmmo={player.currentAmmo || 0}
            maxAmmo={player.maxAmmo || 30}
            ammoType={player.currentWeapon?.ammoType || "5.56"}
          />
        </div>
        
        {/* Kills */}
        <div className="hud-panel rounded-lg p-3 pointer-events-auto">
          <div className="flex items-center gap-2">
            <ApperIcon name="Target" className="w-5 h-5 text-tactical-400" />
            <span className="text-white font-bold text-lg">{player.kills || 0}</span>
            <span className="text-gray-400 text-sm">KILLS</span>
          </div>
        </div>
      </div>
      
      {/* Minimap */}
      <div className="absolute top-4 right-4 w-32 h-32 minimap pointer-events-auto">
        <div className="relative w-full h-full">
          {/* Zone circle on minimap */}
          {zone && (
            <div 
              className="absolute zone-circle"
              style={{
                left: `${(zone.center.x / 800) * 100}%`,
                top: `${(zone.center.y / 600) * 100}%`,
                width: `${(zone.radius / 400) * 100}%`,
                height: `${(zone.radius / 300) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}
          
          {/* Player dot */}
          <div 
            className="absolute player-dot w-2 h-2"
            style={{
              left: `${(player.position.x / 800) * 100}%`,
              top: `${(player.position.y / 600) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
          
          {/* Enemy dots */}
          {match?.players?.filter(p => p.alive && p.id !== player.id).map(enemy => (
            <div 
              key={enemy.id}
              className="absolute enemy-dot w-1.5 h-1.5"
              style={{
                left: `${(enemy.position.x / 800) * 100}%`,
                top: `${(enemy.position.y / 600) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GameHUD;