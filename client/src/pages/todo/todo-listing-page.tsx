import * as React from "react";
import {
  CheckCircle,
  Circle,
  Search,
  Trash2,
  Pencil,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import CreateTodo from "@/components/todo/create-todo";
import {
  useDeleteTodoMutation,
  useTodoListingQuery,
  useUpdateTodoMutation,
} from "@/redux/api/todo/todo-api-slice";
import { Todo } from "@/common/types";
import { TodoPriority, TodoStatus } from "@/common/enums";
import { RECORDS_PER_PAGE } from "@/common/constants";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function TodoListingPage() {
  const [DeleteTodo] = useDeleteTodoMutation();
  const [UpdateTodo] = useUpdateTodoMutation();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<
    "all" | TodoStatus.DONE | TodoStatus.TODO | TodoStatus.IN_PROGRESS
  >("all");
  const [editingTodo, setEditingTodo] = React.useState<Todo | null>(null);

  const { data: todoListData, error } = useTodoListingQuery(
    {
      page: currentPage,
      limit: RECORDS_PER_PAGE,
      status: filter,
      search: search,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const totalPages =
    todoListData?.totalRecords > 0
      ? Math.ceil(todoListData?.totalRecords / RECORDS_PER_PAGE)
      : 0;

  const handleToggleComplete = async (id: string, status: TodoStatus) => {
    try {
      const newStatus =
        status === TodoStatus.TODO ? TodoStatus.DONE : TodoStatus.TODO;
      const response = await UpdateTodo({ id, status: newStatus }).unwrap();
      if (response?.status) {
        toast({
          title: "Success",
          description: response?.message ?? "Todo updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "error",
        description: error?.message ?? "Something went wrong. Please try again",
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await DeleteTodo({ id }).unwrap();
      if (response?.status) {
        toast({
          title: "Success",
          description: response?.message ?? "Todo deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "error",
        description: error?.message ?? "Something went wrong. Please try again",
      });
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    try {
      const response = await UpdateTodo({
        id: updatedTodo._id,
        name: updatedTodo.name,
        description: updatedTodo.description,
        status: updatedTodo.status,
        priority: updatedTodo.priority,
      }).unwrap();
      if (response.status) {
        toast({
          title: "Success",
          description: response?.message ?? "Todo updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "error",
        description: error?.message ?? "Something went wrong. Please try again",
      });
    }
    setEditingTodo(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Todo List</h1>

      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search todos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select
          value={filter}
          onValueChange={(
            value:
              | "all"
              | TodoStatus.TODO
              | TodoStatus.IN_PROGRESS
              | TodoStatus.DONE
          ) => setFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value={TodoStatus.TODO}>Todo</SelectItem>
            <SelectItem value={TodoStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={TodoStatus.DONE}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CreateTodo />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todoListData?.totalRecords > 0 &&
              todoListData?.records?.map((todo) => (
                <TableRow key={todo?._id}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleToggleComplete(todo._id, todo.status)
                      }
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
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTodo(todo)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Todo</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="title"
                              value={editingTodo?.name}
                              onChange={(e) =>
                                setEditingTodo({
                                  ...editingTodo!,
                                  name: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              value={editingTodo?.description}
                              onChange={(e) =>
                                setEditingTodo({
                                  ...editingTodo!,
                                  description: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right">
                              Priority
                            </Label>
                            <Select
                              value={editingTodo?.priority}
                              onValueChange={(
                                value:
                                  | TodoPriority.HIGH
                                  | TodoPriority.MEDIUM
                                  | TodoPriority.LOW
                              ) =>
                                setEditingTodo({
                                  ...editingTodo!,
                                  priority: value,
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right">
                              Status
                            </Label>
                            <Select
                              value={editingTodo?.status}
                              onValueChange={(
                                value:
                                  | TodoStatus.DONE
                                  | TodoStatus.TODO
                                  | TodoStatus.IN_PROGRESS
                              ) =>
                                setEditingTodo({
                                  ...editingTodo!,
                                  status: value,
                                })
                              }
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={TodoStatus.TODO}>
                                  Todo
                                </SelectItem>
                                <SelectItem value={TodoStatus.IN_PROGRESS}>
                                  In Progress
                                </SelectItem>
                                <SelectItem value={TodoStatus.DONE}>
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleUpdateTodo(editingTodo!)}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTodo(todo?._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          Showing {(currentPage - 1) * RECORDS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * RECORDS_PER_PAGE, todoListData?.totalRecords)}{" "}
          of {todoListData?.totalRecords} todos
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
