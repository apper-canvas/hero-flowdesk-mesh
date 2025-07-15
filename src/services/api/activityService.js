class ActivityService {
  constructor() {
    // Initialize ApperClient for database operations
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'app_Activity';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "deal_id" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
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
        console.error("Error fetching activities:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching activities:", error.message);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "contact_id" } },
          { field: { Name: "deal_id" } }
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
        console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching activity with ID ${id}:`, error.message);
        throw error;
      }
    }
  }

  async create(activityData) {
    try {
      // Filter to include only Updateable fields
      const filteredData = {
        Name: activityData.description || activityData.Name || `${activityData.type} Activity`,
        type: activityData.type,
        description: activityData.description,
        timestamp: activityData.timestamp || new Date().toISOString(),
        contact_id: activityData.contactId ? parseInt(activityData.contactId) : null,
        deal_id: activityData.dealId ? parseInt(activityData.dealId) : null
      };

      const params = {
        records: [filteredData]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create activity');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating activity:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating activity:", error.message);
        throw error;
      }
    }
  }

  async update(id, activityData) {
    try {
      // Filter to include only Updateable fields
      const filteredData = {
        Id: parseInt(id),
        Name: activityData.description || activityData.Name || `${activityData.type} Activity`,
        type: activityData.type,
        description: activityData.description,
        timestamp: activityData.timestamp,
        contact_id: activityData.contactId ? parseInt(activityData.contactId) : null,
        deal_id: activityData.dealId ? parseInt(activityData.dealId) : null
      };

      const params = {
        records: [filteredData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update activity');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating activity:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating activity:", error.message);
        throw error;
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete activity');
        }
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting activity:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting activity:", error.message);
        throw error;
      }
    }
  }
}

export const activityService = new ActivityService();