import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Button = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "medium", 
  disabled = false,
  icon = null,
  className = "",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "btn-primary focus:ring-tactical-600",
    secondary: "btn-secondary focus:ring-military-600",
    danger: "bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500",
    ghost: "bg-transparent border-2 border-military-600 text-military-100 hover:bg-military-700 hover:border-military-500 focus:ring-military-500"
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-sm rounded-md",
    medium: "px-4 py-2 text-base rounded-md",
    large: "px-6 py-3 text-lg rounded-lg"
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <ApperIcon name={icon} className="w-5 h-5 mr-2" />}
      {children}
    </motion.button>
  );
};

export default Button;