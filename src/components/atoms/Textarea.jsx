import React from "react";
import { cn } from "@/utils/cn";

const Textarea = React.forwardRef(({ 
  className = "", 
  error = false,
  disabled = false,
  rows = 3,
  ...props 
}, ref) => {
  const classes = cn(
    "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none",
    error && "border-error ring-error focus:ring-error",
    disabled && "bg-gray-100 text-gray-500",
    className
  );

  return (
    <textarea
      ref={ref}
      className={classes}
      rows={rows}
      disabled={disabled}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;