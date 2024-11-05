import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },

    // Other user
    updateOtherUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateOtherUserSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    updateOtherUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteOtherUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteOtherUserSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    deleteOtherUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signoutSuccess,
  updateOtherUserStart,
  updateOtherUserSuccess,
  updateOtherUserFailure,
  deleteOtherUserStart,
  deleteOtherUserSuccess,
  deleteOtherUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
