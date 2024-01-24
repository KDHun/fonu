import { createSlice } from "@reduxjs/toolkit";

const initialState = { phonenumber: "" };

export const phonenumberSlice = createSlice({
  name: "phonenumber",
  initialState,
  reducers: {
    setPhonenumber: (state, action) => {
      state.phonenumber = action.payload;
    },
    addPhonenumberChar: (state, action) => {
      state.phonenumber += action.payload;
    },
    deletePhonenumberChar: (state, action) => {
      state.phonenumber = state.phonenumber.slice(0, -1);
    },
    clearPhonenumber: (state, action) => {
      state.phonenumber = "";
    },
  },
});

export const { setPhonenumber, addPhonenumberChar, deletePhonenumberChar, clearPhonenumber } =
  phonenumberSlice.actions;

export default phonenumberSlice.reducer;
