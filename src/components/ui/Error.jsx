import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-gradient-to-r from-error/10 to-error/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary btn-md inline-flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </motion.div>
  );
};

export default Error;