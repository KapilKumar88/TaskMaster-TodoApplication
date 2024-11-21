import { CheckCircle, ListTodo, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStatisticsQuery } from "@/redux/api/dashboard/dashboard-api-slice";
export default function TaskStats() {
  const { data: dashboardStatistics } = useDashboardStatisticsQuery({});
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dashboardStatistics?.totalTask?.count ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {dashboardStatistics?.totalTask?.diffFromLastWeek === 0 && ""}
            {dashboardStatistics?.totalTask?.diffFromLastWeek > 0 && "+"}
            {dashboardStatistics?.totalTask?.diffFromLastWeek < 0 && "-"}
            {Math.abs(dashboardStatistics?.totalTask?.diffFromLastWeek) ??
              0}{" "}
            from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dashboardStatistics?.completedTask?.count ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {dashboardStatistics?.completedTask?.diffFromLastWeek === 0 && ""}
            {dashboardStatistics?.completedTask?.diffFromLastWeek > 0 && "+"}
            {dashboardStatistics?.completedTask?.diffFromLastWeek < 0 && "-"}
            {Math.abs(
              dashboardStatistics?.completedTask?.diffFromLastWeek || 0
            ) ?? 0}{" "}
            from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <PlusCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {" "}
            {dashboardStatistics?.pendingTask?.count ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {dashboardStatistics?.pendingTask?.diffFromLastWeek === 0 && ""}
            {dashboardStatistics?.pendingTask?.diffFromLastWeek > 0 && "+"}
            {dashboardStatistics?.pendingTask?.diffFromLastWeek < 0 && "-"}
            {Math.abs(
              dashboardStatistics?.pendingTask?.diffFromLastWeek || 0
            ) ?? 0}{" "}
            from last week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dashboardStatistics?.completionRate?.count ?? 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            {dashboardStatistics?.completionRate?.diffFromLastWeek === 0 && ""}
            {dashboardStatistics?.completionRate?.diffFromLastWeek > 0 && "+"}
            {dashboardStatistics?.completionRate?.diffFromLastWeek < 0 && "-"}
            {Math.abs(
              dashboardStatistics?.completionRate?.diffFromLastWeek || 0
            ) ?? 0}{" "}
            % from last week
          </p>
        </CardContent>
      </Card>
    </>
  );
}
