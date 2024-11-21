import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const token: string = localStorage.getItem("token") ?? "";
const refreshToken: string = localStorage.getItem("refreshToken") ?? "";

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: token?.length > 0,
  token: token,
  refreshToken: refreshToken,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserAuthDetails: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setUserAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setAuthTokens: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setLoggedOut: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const {
  setUserAuthDetails,
  setUserAuthenticated,
  setAuthTokens,
  setLoggedOut,
} = AuthSlice.actions;

export default AuthSlice.reducer;
