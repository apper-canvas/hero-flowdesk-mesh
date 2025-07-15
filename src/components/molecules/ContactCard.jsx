import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const ContactCard = ({ 
  contact,
  onClick,
  onEdit,
  onDelete,
  onComposeEmail,
  isSelected = false,
  onSelectionChange,
  className = "",
  ...props
}) => {
  const statusColors = {
    active: "success",
    inactive: "warning",
    lead: "primary"
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(contact);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(contact);
};

  const handleSelectionChange = (e) => {
    e.stopPropagation();
    onSelectionChange(contact.Id, e.target.checked);
  };

  return (
    <motion.div
      className={cn(
        "card card-hover p-4 cursor-pointer transition-all duration-200",
        isSelected && "ring-2 ring-primary-500 bg-primary-50",
        className
      )}
      onClick={() => onClick(contact)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className="flex items-start justify-between">
        {onSelectionChange && (
          <div className="flex items-center mr-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleSelectionChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
          </div>
        )}
        <div className="flex items-center space-x-3 flex-1">
          <Avatar name={contact.name} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
              <Badge 
                variant={statusColors[contact.status]} 
                size="sm"
              >
                {contact.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 truncate">{contact.email}</p>
            <p className="text-sm text-gray-600 truncate">{contact.company}</p>
            {contact.lastContacted && (
              <p className="text-xs text-gray-500 mt-1">
                Last contacted: {format(new Date(contact.lastContacted), "MMM dd, yyyy")}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleEdit}
            className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-500 hover:text-error transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {contact.tags.map((tag, index) => (
            <Badge key={index} variant="default" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ContactCard;