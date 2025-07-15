import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const ActivityItem = ({ 
  activity,
  contact,
  deal,
  showContact = true,
  showDeal = true,
  className = "",
  ...props 
}) => {
  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Calendar",
      note: "FileText",
      task: "CheckSquare"
    };
    return icons[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colors = {
      call: "text-blue-600",
      email: "text-green-600",
      meeting: "text-purple-600",
      note: "text-gray-600",
      task: "text-orange-600"
    };
    return colors[type] || "text-gray-600";
  };

  return (
    <motion.div
      className={cn("flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className={cn("w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center", getActivityColor(activity.type))}>
        <ApperIcon name={getActivityIcon(activity.type)} className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-900 capitalize">
            {activity.type}
          </p>
          <span className="text-xs text-gray-500">
            {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' HH:mm")}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
        
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          {showContact && contact && (
            <div className="flex items-center space-x-1">
              <ApperIcon name="User" className="w-3 h-3" />
              <span>{contact.name}</span>
            </div>
          )}
          {showDeal && deal && (
            <div className="flex items-center space-x-1">
              <ApperIcon name="DollarSign" className="w-3 h-3" />
              <span>{deal.title}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityItem;