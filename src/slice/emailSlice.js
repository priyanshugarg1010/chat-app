import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  emailId: null,
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    setEmailId(state, action) {
      state.emailId = action.payload;
    },
  },
});

export const { setEmailId } = emailSlice.actions;

export default emailSlice.reducer;
