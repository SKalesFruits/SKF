import { configureStore } from "@reduxjs/toolkit";
import generalReducer from "../features/general.slice"; // Example slice

export const store = configureStore({
  reducer: {
    general: generalReducer, // Add reducers here
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
