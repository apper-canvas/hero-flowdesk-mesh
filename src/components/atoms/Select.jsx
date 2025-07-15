import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = React.forwardRef(({ 
  className = "", 
  options = [],
  placeholder = "Select an option",
  error = false,
  disabled = false,
  ...props 
}, ref) => {
  const classes = cn(
    "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
    error && "border-error ring-error focus:ring-error",
    disabled && "bg-gray-100 text-gray-500",
    className
  );

  return (
    <div className="relative">
      <select
        ref={ref}
        className={classes}
        disabled={disabled}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" 
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;