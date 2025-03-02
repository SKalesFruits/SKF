import { createSlice } from "@reduxjs/toolkit";

interface GeneralState {
  mode: "impex" | "home";
}

const initialState: GeneralState = { mode: "home" };

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = generalSlice.actions;
export default generalSlice.reducer;
