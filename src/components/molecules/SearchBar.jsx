import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
  ...props 
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange({ target: { value: "" } });
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        icon="Search"
        className="pr-10"
        {...props}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;