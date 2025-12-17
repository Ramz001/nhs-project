import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  postcode: null,
};

const navigation = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setPostcode(state, action) {
      state.postcode = action.payload;
    },
  },
});

export const { setPostcode } = navigation.actions;

export default navigation.reducer;
