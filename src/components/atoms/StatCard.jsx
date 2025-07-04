import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, color = "primary", className = "" }) => {
  const colorClasses = {
    primary: "border-military-600 bg-gradient-to-br from-military-800 to-military-900",
    success: "border-green-500 bg-gradient-to-br from-green-800 to-green-900",
    warning: "border-yellow-500 bg-gradient-to-br from-yellow-800 to-yellow-900",
    danger: "border-red-500 bg-gradient-to-br from-red-800 to-red-900",
    tactical: "border-tactical-600 bg-gradient-to-br from-tactical-800 to-tactical-900"
  };
  
  const iconColors = {
    primary: "text-military-400",
    success: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
    tactical: "text-tactical-400"
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`
        p-4 rounded-lg border-2 backdrop-blur-sm
        ${colorClasses[color]}
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
        {icon && (
          <ApperIcon 
            name={icon} 
            className={`w-8 h-8 ${iconColors[color]}`} 
          />
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;