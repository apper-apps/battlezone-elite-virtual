import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null, 
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        flex flex-col items-center justify-center p-8 text-center
        bg-gradient-to-br from-red-900/20 to-red-800/20 
        border border-red-500/30 rounded-lg backdrop-blur-sm
        ${className}
      `}
    >
      <ApperIcon name="AlertTriangle" className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">Mission Failed</h3>
      <p className="text-red-400 text-lg mb-6 max-w-md">{message}</p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="danger"
          size="large"
          icon="RotateCcw"
        >
          Retry Mission
        </Button>
      )}
    </motion.div>
  );
};

export default Error;