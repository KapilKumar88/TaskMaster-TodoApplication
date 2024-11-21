import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useRecentTasksQuery } from "@/redux/api/dashboard/dashboard-api-slice";
import { Todo } from "@/common/types";
import { TodoStatus } from "@/common/enums";

export default function RecentTask() {
  const { data: recentTasks } = useRecentTasksQuery({});
  return (
    <Card className="col-span-full lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
        <CardDescription>You have {recentTasks?.length} tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTasks?.map((task: Todo) => (
            <div key={task?._id} className="flex items-center">
              <CheckCircle
                className={`mr-2 h-4 w-4 ${
                  task.status === TodoStatus.DONE
                    ? "text-green-500"
                    : "text-gray-300"
                }`}
              />
              <span
                className={
                  task.status === TodoStatus.DONE
                    ? "line-through text-muted-foreground"
                    : ""
                }
              >
                {task?.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
