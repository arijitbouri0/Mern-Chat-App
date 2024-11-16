// src/redux/reducers/miscSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getOrSaveFromStorage } from '../../lib/features';
import { NEW_MESSAGE_ALERT } from '../../constants/event';

const initialState = {
  notificationCounts: 0,
  newMessagesAlert: getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, get: true }) || [
    {
      chatId: "",
      count: 0
    }
  ]
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    incrementNotification: (state) => {
      state.notificationCounts += 1;
    },
    resetNotification: (state) => {
      state.notificationCounts = 0;
    },
    setMessagesAlert: (state, action) => {
      const index = state.newMessagesAlert.findIndex(
        (item) => item.chatId === action.payload.chatId)
      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId: action.payload.chatId,
          count: 1,
        })
      }
    },
    removeMessagesAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (item) => item.chatId !== action.payload
      )
    }

  },
});

export const {
  incrementNotification,
  resetNotification,
  setMessagesAlert,
  removeMessagesAlert,
} = chatSlice.actions;

export default chatSlice;
