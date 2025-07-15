import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";

const ContactModal = ({ 
  isOpen,
  onClose,
  contact,
  onSave,
  className = "",
  ...props 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "lead",
    tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        status: contact.status || "lead",
        tags: contact.tags ? contact.tags.join(", ") : ""
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "lead",
        tags: ""
      });
    }
    setErrors({});
  }, [contact, isOpen]);

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
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
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
      const contactData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
      };
      
      let savedContact;
      if (contact) {
        savedContact = await contactService.update(contact.Id, contactData);
        toast.success("Contact updated successfully!");
      } else {
        savedContact = await contactService.create(contactData);
        toast.success("Contact created successfully!");
      }
      
      onSave(savedContact);
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
                {contact ? "Edit Contact" : "Add New Contact"}
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
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              required
              placeholder="Enter contact name"
            />
            
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              required
              placeholder="Enter email address"
            />
            
            <FormField
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={errors.phone}
              placeholder="Enter phone number"
            />
            
            <FormField
              label="Company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              error={errors.company}
              required
              placeholder="Enter company name"
            />
            
            <FormField
              label="Status"
              type="select"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              options={[
                { value: "lead", label: "Lead" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" }
              ]}
              required
            />
            
            <FormField
              label="Tags"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="Enter tags separated by commas"
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
                {contact ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;