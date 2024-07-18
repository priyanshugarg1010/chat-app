import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import linkReducer from "../slice/linkSlice";
import emailReducer from "../slice/emailSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    link: linkReducer,
    email: emailReducer,
  },
});
