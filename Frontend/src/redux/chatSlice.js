import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // ... other chat-related state
  onlineUsers: [],
  selectedChat: null,
  messageList: []
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // ... other reducers

    // This replaces the entire list. Used for the 'initialOnlineFriends' event.
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    // NEW REDUCER: Adds a single user to the list if they aren't already there.
    // Used for 'statusUpdate' when status is 'online'.
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },

    // NEW REDUCER: Removes a single user from the list.
    // Used for 'statusUpdate' when status is 'offline'.
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (userId) => userId !== action.payload
      );


    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setMessageList: (state, action) => {
      state.messageList = action.payload;
    }
  },
});

// Export all the actions
export const {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setSelectedChat,
  setMessageList,
  // ... other actions
} = chatSlice.actions;

export default chatSlice.reducer;