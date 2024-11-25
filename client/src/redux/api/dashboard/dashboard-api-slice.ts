import { apiSlice } from "../api-slice";

const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    dashboardStatistics: builder.query({
      query: (payload) => {
        return {
          url: `/dashboard/statistics`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
    recentTasks: builder.query({
      query: (payload) => {
        return {
          url: `/dashboard/recent-tasks`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
    taskCompletionChartData: builder.query({
      query: (payload) => {
        return {
          url: `/dashboard/task-completion-stats`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
    upcomingTask: builder.query({
      query: (payload) => {
        return {
          url: `/dashboard/upcoming-task`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        return response.data;
      },
    }),
  }),
});

export const {
  useDashboardStatisticsQuery,
  useRecentTasksQuery,
  useTaskCompletionChartDataQuery,
  useUpcomingTaskQuery,
} = dashboardApiSlice;
