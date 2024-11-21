import { apiSlice } from "../api-slice";

const todoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTodo: builder.mutation({
      query: (payload) => ({
        url: "/task/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Todo"],
    }),
    updateTodo: builder.mutation({
      query: (payload) => {
        return {
          url: `/task/update/${payload.id}`,
          method: "PUT",
          body: payload,
        };
      },
      invalidatesTags: ["Todo"],
    }),
    deleteTodo: builder.mutation({
      query: (payload) => {
        return {
          url: `/task/delete/${payload.id}`,
          method: "DELETE",
          body: payload,
        };
      },
      invalidatesTags: ["Todo"],
    }),
    todoListing: builder.query({
      query: (payload) => {
        let params = `page=${payload.page}&limit=${payload.limit}`;
        if (payload?.search?.length > 0) {
          params += `&search=${payload.search}`;
        }

        if (payload?.status !== "all") {
          params += `&status=${payload.status}`;
        }

        return {
          url: `/task/list?${params}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        return response.data;
      },
      providesTags: (result, error, arg) => {
        if (result) {
          const todoIds = result?.records?.map(
            (todo: { _id: string }) => todo._id
          );
          return [
            ...todoIds.map((id: string) => ({ type: "Todo", id } as const)),
            { type: "Todo", id: "LIST" } as const,
          ];
        }
        return [];
      },
    }),
  }),
});

export const {
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useTodoListingQuery,
} = todoApiSlice;
