import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const AmmoCounter = ({ currentAmmo, maxAmmo, ammoType, className = "" }) => {
  const isLowAmmo = currentAmmo <= maxAmmo * 0.2;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ApperIcon 
        name="Zap" 
        className={`w-5 h-5 ${isLowAmmo ? 'text-red-400' : 'text-gray-400'}`} 
      />
      <div className="flex flex-col">
        <motion.span 
          className={`text-lg font-bold ${isLowAmmo ? 'text-red-400' : 'text-white'}`}
          animate={isLowAmmo ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isLowAmmo ? Infinity : 0 }}
        >
          {currentAmmo}
        </motion.span>
        <span className="text-gray-400 text-sm">/{maxAmmo}</span>
      </div>
      <span className="text-gray-500 text-sm uppercase">{ammoType}</span>
    </div>
  );
};

export default AmmoCounter;