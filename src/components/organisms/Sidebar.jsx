import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className = "" }) => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: "BarChart3" },
    { path: "/contacts", label: "Contacts", icon: "Users" },
    { path: "/deals", label: "Deals", icon: "DollarSign" },
    { path: "/activities", label: "Activities", icon: "Activity" }
  ];

  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 shadow-sm", className)}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            FlowDesk
          </h1>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "nav-item",
                  isActive && "nav-item-active"
                )
              }
            >
              <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;