import SuggestedUsers from "@/components/ui/SuggestedUsers";
import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggestedUsers: [],
    selectedProfile: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestions: (state, action) => {
      state.suggestedUsers = action.payload;
    }
    ,
    setProfile: (state, action) => {
      state.selectedProfile = action.payload;
    }
  }
})
export const { setUser, setSuggestions, setProfile } = authSlice.actions;
export default authSlice.reducer;