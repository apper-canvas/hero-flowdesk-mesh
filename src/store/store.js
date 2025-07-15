import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import activityReducer from './activitySlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    activity: activityReducer,
  },
})