import { motion } from "framer-motion";
import StatCard from "@/components/atoms/StatCard";
import ApperIcon from "@/components/ApperIcon";

const GameStats = ({ stats, className = "" }) => {
  const {
    kills = 0,
    deaths = 0,
    damage = 0,
    survivalTime = 0,
    placement = 0,
    totalPlayers = 0
  } = stats;
  
  const kdr = deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2);
  const survivalMinutes = Math.floor(survivalTime / 60000);
  const survivalSeconds = Math.floor((survivalTime % 60000) / 1000);
  
  return (
    <motion.div 
      className={`grid grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <StatCard
          title="Kills"
          value={kills}
          icon="Target"
          color="success"
        />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <StatCard
          title="Deaths"
          value={deaths}
          icon="Skull"
          color="danger"
        />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <StatCard
          title="K/D Ratio"
          value={kdr}
          icon="TrendingUp"
          color="tactical"
        />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <StatCard
          title="Damage"
          value={damage}
          icon="Zap"
          color="warning"
        />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <StatCard
          title="Survival Time"
          value={`${survivalMinutes}:${survivalSeconds.toString().padStart(2, '0')}`}
          icon="Clock"
          color="primary"
        />
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <StatCard
          title="Placement"
          value={`#${placement}/${totalPlayers}`}
          icon="Award"
          color={placement <= 3 ? "success" : placement <= 10 ? "warning" : "primary"}
        />
      </motion.div>
    </motion.div>
  );
};

export default GameStats;