class ContactService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'app_contact'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } },
          { field: { Name: "last_contacted" } },
          { field: { Name: "created_at" } },
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
        console.error("Error fetching contacts:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } },
          { field: { Name: "last_contacted" } },
          { field: { Name: "created_at" } },
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
        console.error(`Error fetching contact with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async create(contactData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: contactData.Name,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company,
          status: contactData.status,
          Tags: contactData.Tags,
          last_contacted: contactData.last_contacted,
          created_at: contactData.created_at || new Date().toISOString(),
          Owner: contactData.Owner
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
        console.error("Error creating contact:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async update(id, contactData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: contactData.Name,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company,
          status: contactData.status,
          Tags: contactData.Tags,
          last_contacted: contactData.last_contacted,
          created_at: contactData.created_at,
          Owner: contactData.Owner
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
        console.error("Error updating contact:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

  async delete(id) {
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
        console.error("Error deleting contact:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return false
    }
  }

  async bulkUpdate(ids, updateData) {
    try {
      const records = ids.map(id => ({
        Id: id,
        ...updateData
      }))
      
      const params = { records }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.map(result => result.data)
      }
      
      return []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error bulk updating contacts:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }

  async bulkDelete(ids) {
    try {
      const params = {
        RecordIds: ids
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
        }
        
        return successfulDeletions.map(result => result.recordId)
      }
      
      return []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error bulk deleting contacts:", error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return []
    }
  }
}

export const contactService = new ContactService();