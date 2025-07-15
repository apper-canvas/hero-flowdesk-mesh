import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className = "", 
  variant = "default", 
  size = "md",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    accent: "bg-accent-100 text-accent-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  const classes = cn(
    "inline-flex items-center rounded-full font-medium",
    variants[variant],
    sizes[size],
    className
  );

  return (
    <span ref={ref} className={classes} {...props}>
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;