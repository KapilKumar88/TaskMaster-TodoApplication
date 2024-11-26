import { CheckCircle, Circle, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUpdateTodoMutation } from "@/redux/api/todo/todo-api-slice";
import { TodoPriority, TodoStatus } from "@/common/enums";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import TodoActions from "@/components/todo/todo-actions";
import { Todo } from "@/common/types";

export default function TodoList({
  todoListData,
}: Readonly<{ todoListData: any }>) {
  const [UpdateTodo] = useUpdateTodoMutation();
  const { toast } = useToast();

  const handleToggleComplete = async (id: string, todoStatus: TodoStatus) => {
    try {
      const response = await UpdateTodo({
        id,
        status:
          todoStatus === TodoStatus.DONE ? TodoStatus.TODO : TodoStatus.DONE,
      }).unwrap();
      if (response?.status) {
        toast({
          title: "Success",
          description: response?.message ?? "Todo updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.message ||
          error?.data.message ||
          "Something went wrong. Please try again",
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Status</TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todoListData?.totalRecords > 0 &&
          todoListData?.records?.map((todo: Todo) => (
            <TableRow key={todo?._id}>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleComplete(todo?._id!, todo?.status)}
                  className="hover:bg-transparent"
                >
                  {todo?.status === TodoStatus.DONE && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {todo?.status === TodoStatus.TODO && (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  {todo?.status === TodoStatus.IN_PROGRESS && (
                    <CircleDot className="h-5 w-5 text-gray-400" />
                  )}
                </Button>
              </TableCell>
              <TableCell
                className={
                  todo?.status === TodoStatus.DONE
                    ? "text-muted-foreground line-through"
                    : ""
                }
              >
                {todo?.name}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                    todo?.priority === TodoPriority.HIGH
                      ? "bg-red-100 text-red-800"
                      : todo?.priority === TodoPriority.MEDIUM
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {todo?.priority?.toUpperCase()}
                </span>
              </TableCell>
              <TableCell>
                {format(
                  new Date(todo?.createdAt ?? new Date()),
                  "dd-MM-yyyy HH:mm"
                )}
              </TableCell>
              <TableCell className="text-right">
                <TodoActions todo={todo} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
