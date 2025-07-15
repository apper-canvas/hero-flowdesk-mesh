class DealService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'deal'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "probability" } },
          { field: { Name: "expected_close" } },
          { field: { Name: "Tags" } },
          { field: { Name: "created_at" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { 
            field: { Name: "Owner" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "contact_id" },
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
        console.error("Error fetching deals:", error?.response?.data?.message)
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
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "probability" } },
          { field: { Name: "expected_close" } },
          { field: { Name: "Tags" } },
          { field: { Name: "created_at" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } },
          { 
            field: { Name: "Owner" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "contact_id" },
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
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message)
      } else {
        console.error(error.message)
      }
      return null
    }
  }

async create(dealData) {
    try {
      // Filter to include only Updateable fields
      const filteredData = {
        Name: dealData.title || dealData.Name,
        title: dealData.title,
        value: parseFloat(dealData.value),
        stage: dealData.stage,
        contact_id: parseInt(dealData.contactId || dealData.contact_id),
        probability: parseFloat(dealData.probability),
        expected_close: dealData.expectedClose || dealData.expected_close
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
          throw new Error(failedRecords[0].message || 'Failed to create deal');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating deal:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating deal:", error.message);
        throw error;
      }
    }
  }

  async update(id, dealData) {
    try {
      // Filter to include only Updateable fields
      const filteredData = {
        Id: parseInt(id),
        Name: dealData.title || dealData.Name,
        title: dealData.title,
        value: parseFloat(dealData.value),
        stage: dealData.stage,
        contact_id: parseInt(dealData.contactId || dealData.contact_id),
        probability: parseFloat(dealData.probability),
        expected_close: dealData.expectedClose || dealData.expected_close
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
          throw new Error(failedRecords[0].message || 'Failed to update deal');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating deal:", error.message);
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
          throw new Error(failedRecords[0].message || 'Failed to delete deal');
        }
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting deal:", error.message);
        throw error;
      }
    }
  }

  async updateStage(id, stage) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          stage: stage
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update deal stage');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal stage:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating deal stage:", error.message);
        throw error;
      }
    }
  }

  // Get total revenue from won deals using aggregation
  async getRevenue() {
    try {
      const params = {
        aggregators: [
          {
            id: "totalRevenue",
            fields: [
              {
                field: { Name: "value" },
                Function: "Sum"
              }
            ],
            where: [
              {
                FieldName: "stage",
                Operator: "EqualTo",
                Values: ["won"]
              }
            ]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return 0;
      }

      // Extract revenue from aggregator results
      const revenueAggregator = response.aggregators?.find(agg => agg.id === "totalRevenue");
      return revenueAggregator?.value || 0;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching revenue:", error?.response?.data?.message);
      } else {
        console.error("Error fetching revenue:", error.message);
      }
      return 0;
    }
  }

  // Get conversion metrics using aggregation
  async getConversionMetrics() {
    try {
      const params = {
        aggregators: [
          {
            id: "totalDeals",
            fields: [
              {
                field: { Name: "Name" },
                Function: "Count"
              }
            ]
          },
          {
            id: "wonDeals",
            fields: [
              {
                field: { Name: "Name" },
                Function: "Count"
              }
            ],
            where: [
              {
                FieldName: "stage",
                Operator: "EqualTo",
                Values: ["won"]
              }
            ]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return { totalDeals: 0, wonDeals: 0, conversionRate: 0 };
      }

      // Extract metrics from aggregator results
      const totalDealsAgg = response.aggregators?.find(agg => agg.id === "totalDeals");
      const wonDealsAgg = response.aggregators?.find(agg => agg.id === "wonDeals");
      
      const totalDeals = totalDealsAgg?.value || 0;
      const wonDeals = wonDealsAgg?.value || 0;
      const conversionRate = totalDeals > 0 ? ((wonDeals / totalDeals) * 100) : 0;

      return {
        totalDeals,
        wonDeals,
        conversionRate: parseFloat(conversionRate.toFixed(1))
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching conversion metrics:", error?.response?.data?.message);
      } else {
        console.error("Error fetching conversion metrics:", error.message);
      }
      return { totalDeals: 0, wonDeals: 0, conversionRate: 0 };
    }
  }
}

export const dealService = new DealService();