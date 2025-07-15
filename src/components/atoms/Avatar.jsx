import React from "react";
import { cn } from "@/utils/cn";

const Avatar = React.forwardRef(({ 
  className = "", 
  size = "md",
  src,
  alt,
  name,
  ...props 
}, ref) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl"
  };

  const classes = cn(
    "flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium",
    sizes[size],
    className
  );

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div ref={ref} className={classes} {...props}>
      {src ? (
        <img 
          src={src} 
          alt={alt || name || "Avatar"} 
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;