import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { apiSlice } from "../api/api-slice";

export interface UserProfileState {
  name: string;
  email: string;
  profileImage?: string;
  notificationStatus: NotificationStatus;
}

export interface NotificationStatus {
  emailNotification: boolean;
  pushNotification: boolean;
}

const initialState: UserProfileState = {
  name: "",
  email: "",
  profileImage: "",
  notificationStatus: {
    emailNotification: false,
    pushNotification: false,
  },
};

export const UserProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setAllUserDetails: (state, action: PayloadAction<UserProfileState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profileImage = action.payload.profileImage;
      state.notificationStatus = action.payload.notificationStatus;
    },
    resetUserDetails: (state) => {
      state.name = "";
      state.email = "";
      state.profileImage = "";
      state.notificationStatus = {
        emailNotification: false,
        pushNotification: false,
      };
    },
  },
  // extraReducers: (builder) => {
  //   builder.addMatcher(
  //     apiSlice.endpoints.fetchUserProfile?.matchFulfilled,
  //     (state, { payload }) => {
  //       state.name = payload.name;
  //       state.email = payload.email;
  //       state.profileImage = payload?.profileImage;
  //       state.notificationStatus.emailNotification =
  //         payload?.notification?.emailNotification;
  //       state.notificationStatus.pushNotification =
  //         payload?.notification?.pushNotification;
  //     }
  //   );
  // },
});

export const { setAllUserDetails, resetUserDetails } = UserProfileSlice.actions;

export default UserProfileSlice.reducer;
