import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No Data Available", 
  message = "There's nothing to display right now.", 
  actionLabel = "Refresh", 
  onAction = null,
  icon = "Database",
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex flex-col items-center justify-center p-12 text-center
        bg-gradient-to-br from-military-800/30 to-military-900/30 
        border border-military-600/30 rounded-lg backdrop-blur-sm
        ${className}
      `}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <ApperIcon name={icon} className="w-20 h-20 text-military-400 mb-6" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-lg mb-8 max-w-md">{message}</p>
      
      {onAction && (
        <Button
          onClick={onAction}
          variant="secondary"
          size="large"
          icon="RefreshCw"
        >
          {actionLabel}
        </Button>
      )}
      
      {/* Decorative elements */}
      <div className="flex gap-2 mt-8">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-military-600 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Empty;