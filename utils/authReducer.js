import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  guilds: [],
  selectedGuild: null,
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserGuilds: (state, action) => {
      state.guilds = action.payload;
    },
    resetState: (state) => {
      state.guilds = [];
      state.selectedGuild = null
    },
    selectGuild: (state, action) => {
      state.selectedGuild = action.payload;
    },
  },
});

export const { updateUserGuilds, resetState, selectGuild } =
  authReducer.actions;
export default authReducer.reducer;
