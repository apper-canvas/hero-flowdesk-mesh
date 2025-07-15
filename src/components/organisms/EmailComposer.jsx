import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import { emailService } from "@/services/api/emailService";

const EmailComposer = ({ 
  isOpen, 
  onClose, 
  contact = null, 
  deal = null,
  onSent = null 
}) => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
    templateId: ""
  });
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      populateRecipient();
    }
  }, [isOpen, contact, deal]);

  const loadTemplates = async () => {
    try {
      const templatesData = await emailService.getTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error("Failed to load email templates");
    }
  };

  const populateRecipient = () => {
    if (contact) {
      setFormData(prev => ({
to: contact.email || "",
        subject: `Follow-up: ${contact.Name || contact.name}`,
        body: ""
      }));
    } else if (deal) {
    } else if (deal) {
      setFormData(prev => ({
        ...prev,
        to: deal.contactEmail || "",
        subject: `Regarding: ${deal.title}`,
        body: ""
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateSelect = async (templateId) => {
    if (!templateId) {
      setSelectedTemplate(null);
      return;
    }

    try {
      const template = templates.find(t => t.Id === parseInt(templateId));
      if (template) {
        setSelectedTemplate(template);
        
        // Apply template with dynamic data
        const processedTemplate = await emailService.applyTemplate(templateId, {
          contact,
          deal,
          user: { name: "Sales Team" } // Mock user data
        });

        setFormData(prev => ({
          ...prev,
          templateId,
          subject: processedTemplate.subject,
          body: processedTemplate.body
        }));
      }
    } catch (error) {
      console.error("Error applying template:", error);
      toast.error("Failed to apply template");
    }
  };

  const handleSend = async () => {
    if (!formData.to || !formData.subject || !formData.body) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSending(true);
    
    try {
      const emailData = {
        ...formData,
        contactId: contact?.Id || null,
        dealId: deal?.Id || null,
        templateId: selectedTemplate?.Id || null
      };

      await emailService.sendEmail(emailData);
      
      toast.success("Email sent successfully!");
      
      if (onSent) {
        onSent({
          ...emailData,
          sentAt: new Date().toISOString()
        });
      }
      
      handleClose();
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setFormData({
      to: "",
      subject: "",
      body: "",
      templateId: ""
    });
    setSelectedTemplate(null);
    onClose();
  };

  const templateOptions = templates.map(template => ({
    value: template.Id.toString(),
    label: template.name
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Mail" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Compose Email
              </h2>
              <p className="text-sm text-gray-600">
{contact ? `To: ${contact.Name || contact.name}` : deal ? `Regarding: ${deal.title}` : "New Email"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form className="space-y-6">
            {/* Template Selection */}
            <FormField
              label="Email Template"
              type="select"
              value={formData.templateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              options={[
                { value: "", label: "Select a template (optional)" },
                ...templateOptions
              ]}
              placeholder="Choose a template to get started"
            />

            {/* Template Preview */}
            {selectedTemplate && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <ApperIcon name="Info" className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Template Applied: {selectedTemplate.name}
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  {selectedTemplate.description}
                </p>
              </div>
            )}

            {/* Recipient */}
            <FormField
              label="To"
              type="email"
              value={formData.to}
              onChange={(e) => handleInputChange("to", e.target.value)}
              placeholder="recipient@example.com"
              required
              icon="Mail"
            />

            {/* Subject */}
            <FormField
              label="Subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="Email subject"
              required
            />

            {/* Body */}
            <FormField
              label="Message"
              type="textarea"
              value={formData.body}
              onChange={(e) => handleInputChange("body", e.target.value)}
              placeholder="Write your message here..."
              rows={12}
              required
            />
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Paperclip" className="w-4 h-4" />
            <span>Attachments coming soon</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={sending || !formData.to || !formData.subject || !formData.body}
              icon={sending ? "Loader2" : "Send"}
              className={sending ? "animate-spin" : ""}
            >
              {sending ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailComposer;