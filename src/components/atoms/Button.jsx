import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(({ 
  className = "", 
  variant = "primary", 
  size = "md", 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  children,
  ...props 
}, ref) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50"
  };

  const sizes = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg"
  };

  const classes = cn(
    "btn",
    variants[variant],
    sizes[size],
    (disabled || loading) && "opacity-50 cursor-not-allowed",
    className
  );

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
      )}
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;