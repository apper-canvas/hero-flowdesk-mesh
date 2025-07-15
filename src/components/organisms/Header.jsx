import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  title,
  subtitle,
  searchValue,
  onSearchChange,
  onMenuClick,
  actions,
  className = "",
  ...props 
}) => {
  return (
    <div className={cn("bg-white border-b border-gray-200 shadow-sm", className)} {...props}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors lg:hidden"
            >
              <ApperIcon name="Menu" className="w-6 h-6" />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold font-display text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {onSearchChange && (
              <div className="hidden sm:block">
                <SearchBar
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder="Search..."
                  className="w-64"
                />
              </div>
            )}
            
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>
        </div>
        
        {onSearchChange && (
          <div className="mt-4 sm:hidden">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;