// src/redux/reducers/miscSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isNewGroup: false,
  isAddMember: false,
  isNotification: false,
  isMobileMenuFriend: false,
  isSearch: false,
  isFileMenu: false,
  isDeleteMenu: false,
  isLeaveMenu: false,
  uploadingLoader: false,
  selectedDeleteChat: {
    chatId: "",
    groupChat: false,
  },
};

const miscSlice = createSlice({
  name: 'misc',
  initialState,
  reducers: {
    toggleNewGroup: (state,action) => {
      state.isNewGroup = action.payload;
    },
    toggleAddMember: (state,action) => {
      state.isAddMember = action.payload;
    },
    toggleNotification: (state,action) => {
      state.isNotification = action.payload;
    },
    toggleMobileMenuFriend: (state,action) => {
      state.isMobileMenuFriend = action.payload;
    },
    toggleSearch: (state,action) => {
      state.isSearch = action.payload    
    },
    toggleFileMenu: (state,action) => {
      state.isFileMenu = action.payload;
    },
    toggleDeleteMenu: (state,action) => {
      state.isDeleteMenu = action.payload;
    },
    setUploadingLoader: (state,action) => {
      state.uploadingLoader = action.payload;
    },
    setSelectedDeleteChat: (state,action) => {
      state.selectedDeleteChat = action.payload;
    },
    setLeaveMenu: (state,action) => {
      state.isLeaveMenu = action.payload;
    },
  },
});

export const {
  toggleNewGroup,
  toggleAddMember,
  toggleNotification,
  toggleMobileMenuFriend,
  toggleSearch,
  toggleFileMenu,
  toggleDeleteMenu,
  setUploadingLoader,
  setSelectedDeleteChat,
  setLeaveMenu
} = miscSlice.actions;

export default miscSlice;
