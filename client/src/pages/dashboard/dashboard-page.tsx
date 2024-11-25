import RecentTask from "@/components/dashboard/recent-task";
import TaskCompletionStats from "@/components/dashboard/task-completion-stats";
import TaskStats from "@/components/dashboard/task-stats";

export default function DashboardPage() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TaskStats />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <TaskCompletionStats />
        <RecentTask />
      </div>
    </>
  );
}
