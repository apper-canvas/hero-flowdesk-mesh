import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  filters,
  onFilterChange,
  onClearFilters,
  className = "",
  ...props 
}) => {
  const hasActiveFilters = Object.values(filters).some(value => value && value !== "");

  return (
    <div className={cn("flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200", className)} {...props}>
      <div className="flex items-center space-x-2">
        <ApperIcon name="Filter" className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>
      
      <Select
        placeholder="Status"
        value={filters.status || ""}
        onChange={(e) => onFilterChange("status", e.target.value)}
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "lead", label: "Lead" }
        ]}
        className="w-32"
      />
      
      <Select
        placeholder="Last Contacted"
        value={filters.lastContacted || ""}
        onChange={(e) => onFilterChange("lastContacted", e.target.value)}
        options={[
          { value: "today", label: "Today" },
          { value: "week", label: "This Week" },
          { value: "month", label: "This Month" },
          { value: "older", label: "Older" }
        ]}
        className="w-36"
      />
      
      <Select
        placeholder="Deal Stage"
        value={filters.dealStage || ""}
        onChange={(e) => onFilterChange("dealStage", e.target.value)}
        options={[
          { value: "lead", label: "Lead" },
          { value: "qualified", label: "Qualified" },
          { value: "proposal", label: "Proposal" },
          { value: "won", label: "Won" },
          { value: "lost", label: "Lost" }
        ]}
        className="w-32"
      />
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          icon="X"
          className="text-gray-600 hover:text-gray-800"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterBar;