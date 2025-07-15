import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  label, 
  type = "input", 
  error, 
  required = false, 
  className = "",
  ...props 
}) => {
  const renderField = () => {
    switch (type) {
      case "select":
        return <Select error={!!error} {...props} />;
      case "textarea":
        return <Textarea error={!!error} {...props} />;
      default:
        return <Input type={type} error={!!error} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-accent-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;