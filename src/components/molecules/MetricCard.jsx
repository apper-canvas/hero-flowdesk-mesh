import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ 
  title,
  value,
  change,
  changeType = "positive",
  icon,
  className = "",
  ...props 
}) => {
  const changeColor = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-gray-600"
  };

  const changeIcon = {
    positive: "TrendingUp",
    negative: "TrendingDown",
    neutral: "Minus"
  };

  return (
    <motion.div
      className={cn("metric-card", className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold font-display text-gray-900 mb-2">
            {value}
          </p>
          {change && (
            <div className={cn("flex items-center text-sm", changeColor[changeType])}>
              <ApperIcon name={changeIcon[changeType]} className="w-4 h-4 mr-1" />
              <span>{change}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} className="w-6 h-6 text-primary-600" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;