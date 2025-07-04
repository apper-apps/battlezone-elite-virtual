import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const WeaponSelector = ({ weapons, selectedWeapon, onWeaponSelect, className = "" }) => {
  const weaponIcons = {
    pistol: "Zap",
    rifle: "Crosshair",
    shotgun: "Target",
    sniper: "Scope"
  };
  
  return (
    <div className={`flex gap-2 ${className}`}>
      {weapons.map((weapon, index) => (
        <motion.button
          key={weapon.type}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onWeaponSelect(weapon)}
          className={`
            weapon-slot w-12 h-12 rounded-lg flex items-center justify-center
            ${selectedWeapon?.type === weapon.type ? 'active' : ''}
          `}
        >
          <ApperIcon 
            name={weaponIcons[weapon.type] || "Crosshair"} 
            className="w-6 h-6 text-gray-300"
          />
          <span className="absolute -top-1 -right-1 bg-military-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {index + 1}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default WeaponSelector;