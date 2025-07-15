import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.activities];
  }

  async getById(id) {
    await this.delay();
    const activity = this.activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  }

  async create(activityData) {
    await this.delay();
    const newActivity = {
      ...activityData,
      Id: Math.max(...this.activities.map(a => a.Id)) + 1,
      timestamp: new Date().toISOString()
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await this.delay();
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    const updatedActivity = {
      ...this.activities[index],
      ...activityData,
      Id: parseInt(id)
    };
    
    this.activities[index] = updatedActivity;
    return { ...updatedActivity };
  }

  async delete(id) {
    await this.delay();
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    this.activities.splice(index, 1);
    return { success: true };
  }
}

export const activityService = new ActivityService();