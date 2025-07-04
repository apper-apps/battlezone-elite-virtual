import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";

const KillFeed = ({ kills, className = "" }) => {
  const [displayKills, setDisplayKills] = useState([]);
  
  useEffect(() => {
    if (kills.length > 0) {
      const latestKill = kills[kills.length - 1];
      setDisplayKills(prev => {
        const newKills = [...prev, { ...latestKill, id: Date.now() }];
        return newKills.slice(-5); // Keep only last 5 kills
      });
      
      // Remove kill after 5 seconds
      setTimeout(() => {
        setDisplayKills(prev => prev.filter(kill => kill.id !== latestKill.id));
      }, 5000);
    }
  }, [kills]);
  
  return (
    <div className={`kill-feed ${className}`}>
      <AnimatePresence>
        {displayKills.map((kill) => (
          <motion.div
            key={kill.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="kill-item"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white font-medium">{kill.killer}</span>
              <ApperIcon name="Crosshair" className="w-4 h-4 text-tactical-400" />
              <span className="text-gray-300">{kill.victim}</span>
              <span className="text-gray-500 text-xs ml-auto">{kill.weapon}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default KillFeed;