import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  linkId: null,
};

const linkSlice = createSlice({
  name: "link",
  initialState,
  reducers: {
    setLinkId(state, action) {
      state.linkId = action.payload;
    },
  },
});

export const { setLinkId } = linkSlice.actions;

export default linkSlice.reducer;
