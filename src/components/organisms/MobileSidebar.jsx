import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const MobileSidebar = ({ isOpen, onClose, className = "" }) => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: "BarChart3" },
    { path: "/contacts", label: "Contacts", icon: "Users" },
    { path: "/deals", label: "Deals", icon: "DollarSign" },
    { path: "/activities", label: "Activities", icon: "Activity" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            className={cn("fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 lg:hidden", className)}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Zap" className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    FlowDesk
                  </h1>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;