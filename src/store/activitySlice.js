import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activities: [],
  lastUpdated: null,
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivities: (state, action) => {
      state.activities = action.payload;
      state.lastUpdated = Date.now();
    },
    addActivity: (state, action) => {
      // Add new activity to the beginning of the array
      state.activities.unshift(action.payload);
      // Keep only the most recent 50 activities to prevent memory issues
      if (state.activities.length > 50) {
        state.activities = state.activities.slice(0, 50);
      }
      state.lastUpdated = Date.now();
    },
    clearActivities: (state) => {
      state.activities = [];
      state.lastUpdated = null;
    },
  },
});

export const { setActivities, addActivity, clearActivities } = activitySlice.actions;
export default activitySlice.reducer;