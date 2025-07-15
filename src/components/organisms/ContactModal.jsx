import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { contactService } from "@/services/api/contactService";

const ContactModal = ({ 
  isOpen,
  onClose,
  contact,
  onSave,
  viewMode = false,
  onEdit,
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
                {viewMode ? "Contact Details" : (contact ? "Edit Contact" : "Add New Contact")}
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
          </div>
          {viewMode ? (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900 font-medium">{contact?.name || "-"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div>
                    <Badge 
                      variant={contact?.status === 'active' ? 'success' : contact?.status === 'inactive' ? 'warning' : 'primary'}
                      size="sm"
                    >
                      {contact?.status || 'lead'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{contact?.email || "-"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{contact?.phone || "-"}</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <p className="text-gray-900">{contact?.company || "-"}</p>
                </div>
                
                {contact?.tags && contact.tags.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, index) => (
                        <Badge key={index} variant="default" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {contact?.lastContacted && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Contacted</label>
                    <p className="text-gray-900">{format(new Date(contact.lastContacted), "MMM dd, yyyy 'at' h:mm a")}</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Close
                </Button>
                {onEdit && (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => onEdit(contact)}
                    className="flex-1"
                    icon="Edit"
                  >
                    Edit Contact
                  </Button>
                )}
              </div>
            </div>
          ) : (
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
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;