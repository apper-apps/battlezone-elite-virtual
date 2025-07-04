import { motion } from "framer-motion";

const HealthBar = ({ current, max, type = "health", className = "" }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  const barClasses = {
    health: "health-bar",
    armor: "armor-bar",
    zone: "bg-gradient-to-r from-tactical-600 to-tactical-500"
  };
  
  const textColors = {
    health: "text-green-400",
    armor: "text-blue-400",
    zone: "text-tactical-400"
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-medium ${textColors[type]} capitalize`}>
          {type}
        </span>
        <span className={`text-sm font-bold ${textColors[type]}`}>
          {current}/{max}
        </span>
      </div>
      <div className="bar-container h-3">
        <motion.div
          className={`${barClasses[type]} h-full`}
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default HealthBar;