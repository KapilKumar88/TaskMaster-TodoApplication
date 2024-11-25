import apiConfig from "@/config/app.config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuthTokens, setLoggedOut } from "../features/auth-slice";
import { resetUserDetails } from "../features/user-profile-slice";
import { persistor } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: apiConfig.API_BASE_URL,
  prepareHeaders(headers, api) {
    const authToken = api.getState();
    headers.set("Accept", "application/json");
    headers.set("Authorization", "Bearer " + authToken?.auth.token);
    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = api.getState()?.auth.refreshToken;
    const refreshResult = await baseQuery(
      {
        url: "/refreshToken",
        method: "POST",
        body: {
          token: refreshToken,
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      localStorage.setItem("token", refreshResult.data.data.token);
      api.dispatch(
        setAuthTokens({ token: refreshResult.data.data.token, refreshToken })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      localStorage.clear();
      // if (persistor) {
      //   await persistor.purge();
      // }
      api.dispatch(resetUserDetails());
      api.dispatch(setLoggedOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Todo", "UserProfile"],
  endpoints: () => ({}),
});
