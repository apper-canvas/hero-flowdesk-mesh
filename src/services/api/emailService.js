import emailTemplatesData from "@/services/mockData/emailTemplates.json";

class EmailService {
  constructor() {
    this.templates = [...emailTemplatesData];
    this.sentEmails = [];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getTemplates() {
    await this.delay();
    return [...this.templates];
  }

  async getTemplateById(id) {
    await this.delay();
    const template = this.templates.find(t => t.Id === parseInt(id));
    if (!template) {
      throw new Error("Template not found");
    }
    return { ...template };
  }

  async applyTemplate(templateId, data = {}) {
    await this.delay();
    const template = await this.getTemplateById(templateId);
    
    // Replace placeholders with actual data
    let processedSubject = template.subject;
    let processedBody = template.body;

    // Contact placeholders
    if (data.contact) {
      processedSubject = processedSubject.replace(/\{contact\.name\}/g, data.contact.name || "");
      processedSubject = processedSubject.replace(/\{contact\.company\}/g, data.contact.company || "");
      
      processedBody = processedBody.replace(/\{contact\.name\}/g, data.contact.name || "");
      processedBody = processedBody.replace(/\{contact\.company\}/g, data.contact.company || "");
      processedBody = processedBody.replace(/\{contact\.email\}/g, data.contact.email || "");
    }

    // Deal placeholders
    if (data.deal) {
      processedSubject = processedSubject.replace(/\{deal\.title\}/g, data.deal.title || "");
      processedSubject = processedSubject.replace(/\{deal\.value\}/g, data.deal.value || "");
      
      processedBody = processedBody.replace(/\{deal\.title\}/g, data.deal.title || "");
      processedBody = processedBody.replace(/\{deal\.value\}/g, data.deal.value || "");
      processedBody = processedBody.replace(/\{deal\.stage\}/g, data.deal.stage || "");
    }

    // User placeholders
    if (data.user) {
      processedSubject = processedSubject.replace(/\{user\.name\}/g, data.user.name || "");
      processedBody = processedBody.replace(/\{user\.name\}/g, data.user.name || "");
    }

    return {
      subject: processedSubject,
      body: processedBody
    };
  }

  async sendEmail(emailData) {
    await this.delay(500); // Simulate network delay
    
    const emailRecord = {
      Id: this.sentEmails.length + 1,
      ...emailData,
      sentAt: new Date().toISOString(),
      status: "sent"
    };

    this.sentEmails.push(emailRecord);
    return { ...emailRecord };
  }

  async getSentEmails() {
    await this.delay();
    return [...this.sentEmails];
  }

  async getEmailById(id) {
    await this.delay();
    const email = this.sentEmails.find(e => e.Id === parseInt(id));
    if (!email) {
      throw new Error("Email not found");
    }
    return { ...email };
  }
}

export const emailService = new EmailService();