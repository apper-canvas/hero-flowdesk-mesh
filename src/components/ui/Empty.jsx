import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Database",
  title = "No data found",
  description = "Get started by adding your first item.",
  actionLabel = "Add New",
  onAction,
  className = ""
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary btn-md inline-flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </motion.div>
  );
};

export default Empty;