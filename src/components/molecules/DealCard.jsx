import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const DealCard = ({ 
  deal,
  contact,
  onClick,
  onEdit,
  onDelete,
  className = "",
  ...props 
}) => {
  const probabilityColor = (probability) => {
    if (probability >= 80) return "text-success";
    if (probability >= 50) return "text-warning";
    return "text-error";
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(deal);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(deal);
  };

  return (
    <motion.div
      className={cn("deal-card", className)}
      onClick={() => onClick(deal)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium text-gray-900 truncate flex-1">{deal.title}</h3>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={handleEdit}
            className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ApperIcon name="Edit" className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-error transition-colors"
          >
            <ApperIcon name="Trash2" className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Value</span>
          <span className="font-semibold text-gray-900">
            ${deal.value?.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Probability</span>
          <span className={cn("font-medium", probabilityColor(deal.probability))}>
            {deal.probability}%
          </span>
        </div>
        
        {contact && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Contact</span>
            <span className="text-sm text-gray-900 truncate max-w-[120px]">
              {contact.name}
            </span>
          </div>
        )}
        
        {deal.expectedClose && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Expected Close</span>
            <span className="text-sm text-gray-900">
              {format(new Date(deal.expectedClose), "MMM dd")}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DealCard;