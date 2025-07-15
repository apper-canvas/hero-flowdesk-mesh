class EmailService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'email_template'
  }

  async getTemplates() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "body" } },
          { field: { Name: "category" } },
          { field: { Name: "description" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { 
            field: { Name: "Owner" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching email templates:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getTemplateById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "subject" } },
          { field: { Name: "body" } },
          { field: { Name: "category" } },
          { field: { Name: "description" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { 
            field: { Name: "Owner" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching email template with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async createTemplate(templateData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: templateData.Name,
          subject: templateData.subject,
          body: templateData.body,
          category: templateData.category,
          description: templateData.description,
          Tags: templateData.Tags,
          Owner: templateData.Owner
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating email template:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async updateTemplate(id, templateData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: templateData.Name,
          subject: templateData.subject,
          body: templateData.body,
          category: templateData.category,
          description: templateData.description,
          Tags: templateData.Tags,
          Owner: templateData.Owner
        }]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null
      }
      
      return null
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating email template:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async deleteTemplate(id) {
    try {
      const params = {
        RecordIds: [id]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting email template:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }

  async sendEmail(emailData) {
    try {
      // Simulate email sending functionality
      // In a real implementation, this would integrate with an email service
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      await delay(500)
      
      return {
        success: true,
        messageId: `msg_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error sending email:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return {
        success: false,
        error: error.message
      }
    }
  }
async applyTemplate(template, data) {
    try {
      let processedSubject = template.subject || "";
      let processedBody = template.body || "";

      // Contact placeholders
      if (data.contact) {
        const contactName = data.contact.name || "";
        const contactEmail = data.contact.email || "";
        const contactPhone = data.contact.phone || "";
        const contactCompany = data.contact.company || "";

        processedSubject = processedSubject.replace(/\{contact\.name\}/g, contactName);
        processedSubject = processedSubject.replace(/\{contact\.email\}/g, contactEmail);
        processedSubject = processedSubject.replace(/\{contact\.company\}/g, contactCompany);
        
        processedBody = processedBody.replace(/\{contact\.name\}/g, contactName);
        processedBody = processedBody.replace(/\{contact\.email\}/g, contactEmail);
        processedBody = processedBody.replace(/\{contact\.phone\}/g, contactPhone);
        processedBody = processedBody.replace(/\{contact\.company\}/g, contactCompany);
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
}

export const emailService = new EmailService();