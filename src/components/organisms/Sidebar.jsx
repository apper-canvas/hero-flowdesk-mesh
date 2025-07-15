import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { AuthContext } from '../../App';

const Sidebar = ({ className = "", ...props }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Contacts', href: '/contacts', icon: 'Users' },
    { name: 'Deals', href: '/deals', icon: 'Handshake' },
    { name: 'Activities', href: '/activities', icon: 'Activity' },
  ];

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-white border-r border-gray-200", className)} {...props}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-gray-900">FlowDesk</h1>
            <p className="text-xs text-gray-500">CRM Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "nav-item",
                  isActive && "nav-item-active"
                )
              }
            >
              <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        {user && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName?.[0] || user.emailAddress?.[0] || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.emailAddress
                  }
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.accounts?.[0]?.companyName || 'FlowDesk User'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Button
          variant="secondary"
          onClick={handleLogout}
          className="w-full"
          icon="LogOut"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;