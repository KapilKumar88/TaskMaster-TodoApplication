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
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

export const { useFetchUserProfileQuery, useUpdateUserProfileMutation } =
  userApiSlice;
