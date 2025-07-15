import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.contacts];
  }

  async getById(id) {
    await this.delay();
    const contact = this.contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  }

  async create(contactData) {
    await this.delay();
    const newContact = {
      ...contactData,
      Id: Math.max(...this.contacts.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString(),
      lastContacted: null
    };
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await this.delay();
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    const updatedContact = {
      ...this.contacts[index],
      ...contactData,
      Id: parseInt(id)
    };
    
    this.contacts[index] = updatedContact;
    return { ...updatedContact };
  }

  async delete(id) {
    await this.delay();
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts.splice(index, 1);
    return { success: true };
  }
}

export const contactService = new ContactService();