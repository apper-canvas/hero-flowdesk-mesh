import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { addActivity } from "@/store/activitySlice";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { contactService } from "@/services/api/contactService";
import { activityService } from "@/services/api/activityService";
import { dealService } from "@/services/api/dealService";

const DealModal = ({ 
  isOpen,
  onClose,
  deal,
  onSave,
  className = "",
  ...props 
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    stage: "lead",
    contactId: "",
    probability: "",
    expectedClose: ""
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        value: deal.value || "",
        stage: deal.stage || "lead",
        contactId: deal.contactId || "",
        probability: deal.probability || "",
        expectedClose: deal.expectedClose ? new Date(deal.expectedClose).toISOString().split("T")[0] : ""
      });
    } else {
      setFormData({
        title: "",
        value: "",
        stage: "lead",
        contactId: "",
        probability: "",
        expectedClose: ""
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (error) {
      console.error("Error loading contacts:", error);
      toast.error("Failed to load contacts");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = "Value must be a positive number";
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }
    
    if (!formData.probability || parseFloat(formData.probability) < 0 || parseFloat(formData.probability) > 100) {
      newErrors.probability = "Probability must be between 0 and 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseFloat(formData.probability),
        expectedClose: formData.expectedClose ? new Date(formData.expectedClose).toISOString() : null
      };
      
      let savedDeal;
      let activityType;
      if (deal) {
        savedDeal = await dealService.update(deal.Id, dealData);
        toast.success("Deal updated successfully!");
        activityType = "note";
      } else {
        savedDeal = await dealService.create(dealData);
        toast.success("Deal created successfully!");
        activityType = "note";
      }
      
      // Create activity record for this action
      try {
        const activityData = {
          type: activityType,
          description: deal 
            ? `Updated deal: ${dealData.title} (${dealData.stage})`
            : `Created new deal: ${dealData.title} (${dealData.stage})`,
          timestamp: new Date().toISOString(),
          contactId: dealData.contactId,
          dealId: savedDeal.Id
        };
        
        const newActivity = await activityService.create(activityData);
        
        // Add to Redux store for immediate dashboard update
        if (newActivity) {
          dispatch(addActivity(newActivity));
}
        
        // Dispatch global event for dashboard refresh
        window.dispatchEvent(new window.CustomEvent('activityCreated', { 
          detail: { activity: newActivity, deal: savedDeal } 
        }));
      } catch (activityError) {
        console.error("Error creating activity:", activityError);
        // Don't fail the main operation if activity creation fails
      }
      
      onSave(savedDeal);
      onClose();
// Dispatch global data change event
      window.dispatchEvent(new window.CustomEvent('dataChanged'));
    } catch (error) {
      console.error("Error saving deal:", error);
      toast.error("Failed to save deal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

const contactOptions = contacts.map(contact => ({
    value: contact.Id.toString(),
    label: `${contact.Name || contact.name} (${contact.company})`
  }));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          className={cn("bg-white rounded-lg shadow-xl w-full max-w-md", className)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          <div className="gradient-header rounded-t-lg p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display">
                {deal ? "Edit Deal" : "Add New Deal"}
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={errors.title}
              required
              placeholder="Enter deal title"
            />
            
            <FormField
              label="Value"
              type="number"
              value={formData.value}
              onChange={(e) => handleInputChange("value", e.target.value)}
              error={errors.value}
              required
              placeholder="Enter deal value"
            />
            
            <FormField
              label="Stage"
              type="select"
              value={formData.stage}
              onChange={(e) => handleInputChange("stage", e.target.value)}
              options={[
                { value: "lead", label: "Lead" },
                { value: "qualified", label: "Qualified" },
                { value: "proposal", label: "Proposal" },
                { value: "won", label: "Won" },
                { value: "lost", label: "Lost" }
              ]}
              required
            />
            
            <FormField
              label="Contact"
              type="select"
              value={formData.contactId}
              onChange={(e) => handleInputChange("contactId", e.target.value)}
              options={contactOptions}
              error={errors.contactId}
              required
              placeholder="Select a contact"
            />
            
            <FormField
              label="Probability (%)"
              type="number"
              value={formData.probability}
              onChange={(e) => handleInputChange("probability", e.target.value)}
              error={errors.probability}
              required
              placeholder="Enter probability (0-100)"
              min="0"
              max="100"
            />
            
            <FormField
              label="Expected Close Date"
              type="date"
              value={formData.expectedClose}
              onChange={(e) => handleInputChange("expectedClose", e.target.value)}
            />
            
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                loading={loading}
              >
                {deal ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DealModal;