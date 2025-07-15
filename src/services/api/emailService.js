class EmailService {
  constructor() {
    // Initialize ApperClient for database operations
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'email_template';
    this.sentEmails = []; // Keep sent emails in memory for this session
  }

  async getTemplates() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "subject" } },
          { field: { Name: "body" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching email templates:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching email templates:", error.message);
        throw error;
      }
    }
  }

  async getTemplateById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "subject" } },
          { field: { Name: "body" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching email template with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching email template with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async applyTemplate(templateId, data = {}) {
    try {
      const template = await this.getTemplateById(templateId);
      
      // Replace placeholders with actual data
      let processedSubject = template.subject;
      let processedBody = template.body;

      // Contact placeholders
      if (data.contact) {
        const contactName = data.contact.Name || data.contact.name || "";
        const contactCompany = data.contact.company || "";
        const contactEmail = data.contact.email || "";

        processedSubject = processedSubject.replace(/\{contact\.name\}/g, contactName);
        processedSubject = processedSubject.replace(/\{contact\.company\}/g, contactCompany);
        
        processedBody = processedBody.replace(/\{contact\.name\}/g, contactName);
        processedBody = processedBody.replace(/\{contact\.company\}/g, contactCompany);
        processedBody = processedBody.replace(/\{contact\.email\}/g, contactEmail);
      }

      // Deal placeholders
      if (data.deal) {
        const dealTitle = data.deal.title || "";
        const dealValue = data.deal.value || "";
        const dealStage = data.deal.stage || "";

        processedSubject = processedSubject.replace(/\{deal\.title\}/g, dealTitle);
        processedSubject = processedSubject.replace(/\{deal\.value\}/g, dealValue);
        
        processedBody = processedBody.replace(/\{deal\.title\}/g, dealTitle);
        processedBody = processedBody.replace(/\{deal\.value\}/g, dealValue);
        processedBody = processedBody.replace(/\{deal\.stage\}/g, dealStage);
      }

      // User placeholders
      if (data.user) {
        const userName = data.user.name || "";
        processedSubject = processedSubject.replace(/\{user\.name\}/g, userName);
        processedBody = processedBody.replace(/\{user\.name\}/g, userName);
      }

      return {
        subject: processedSubject,
        body: processedBody
      };
    } catch (error) {
      console.error("Error applying email template:", error.message);
      throw error;
    }
  }

  async sendEmail(emailData) {
    try {
      // Simulate email sending with delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const emailRecord = {
        Id: this.sentEmails.length + 1,
        ...emailData,
        sentAt: new Date().toISOString(),
        status: "sent"
      };

      this.sentEmails.push(emailRecord);
      return { ...emailRecord };
    } catch (error) {
      console.error("Error sending email:", error.message);
      throw error;
    }
  }

  async getSentEmails() {
    try {
      // Return sent emails from memory
      await new Promise(resolve => setTimeout(resolve, 200));
      return [...this.sentEmails];
    } catch (error) {
      console.error("Error fetching sent emails:", error.message);
      throw error;
    }
  }

  async getEmailById(id) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const email = this.sentEmails.find(e => e.Id === parseInt(id));
      if (!email) {
        throw new Error("Email not found");
      }
      return { ...email };
    } catch (error) {
      console.error(`Error fetching email with ID ${id}:`, error.message);
      throw error;
    }
  }
}

export const emailService = new EmailService();