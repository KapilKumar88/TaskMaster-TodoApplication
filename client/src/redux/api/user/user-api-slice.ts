import { apiSlice } from "../api-slice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUserProfile: builder.query({
      query: (payload) => {
        return {
          url: `/user-profile`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        return response.data;
      },
      providesTags: ["UserProfile"],
    }),
    updateUserProfile: builder.mutation({
      query: (body) => ({
        url: `/update-profile`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

export const { useFetchUserProfileQuery, useUpdateUserProfileMutation } =
  userApiSlice;
