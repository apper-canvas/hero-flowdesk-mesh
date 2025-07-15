import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = React.forwardRef(({ 
  className = "", 
  type = "text",
  icon,
  iconPosition = "left",
  error = false,
  disabled = false,
  ...props 
}, ref) => {
  const classes = cn(
    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
    icon && iconPosition === "left" && "pl-10",
    icon && iconPosition === "right" && "pr-10",
    error && "border-error ring-error focus:ring-error",
    disabled && "bg-gray-100 text-gray-500",
    className
  );

  return (
    <div className="relative">
      {icon && iconPosition === "left" && (
        <ApperIcon 
          name={icon} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" 
        />
      )}
      <input
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        {...props}
      />
      {icon && iconPosition === "right" && (
        <ApperIcon 
          name={icon} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" 
        />
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;