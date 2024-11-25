import { Trash2, Pencil, Loader } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TodoPriority, TodoStatus } from "@/common/enums";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "@/redux/api/todo/todo-api-slice";
import { useState } from "react";
import { Todo } from "@/common/types";
import { useToast } from "@/hooks/use-toast";

export default function TodoActions({ todo }: Readonly<{ todo: Todo }>) {
  const [UpdateTodo, { isLoading: updateLoadingState }] =
    useUpdateTodoMutation();
  const [DeleteTodo, { isLoading: deleteLoadingState }] =
    useDeleteTodoMutation();
  const { toast } = useToast();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(todo);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);

  const handleDeleteTodo = async () => {
    try {
      const response = await DeleteTodo({ id: todo._id }).unwrap();
      toast({
        title: "Success",
        description: response?.message ?? "Todo deleted successfully",
      });
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

  const handleUpdateTodo = async () => {
    try {
      const response = await UpdateTodo({
        id: editingTodo?._id,
        name: editingTodo?.name,
        description: editingTodo?.description,
        status: editingTodo?.status,
        priority: editingTodo?.priority,
      }).unwrap();

      toast({
        title: "Success",
        description: response?.message ?? "Todo updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.message ||
          error?.data.message ||
          "Something went wrong. Please try again",
      });
    }
    setOpenUpdateDialog(false);
  };

  return (
    <>
      <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" disabled={updateLoadingState}>
            {updateLoadingState && <Loader className="h-4 w-4 animate-spin" />}
            {!updateLoadingState && <Pencil className="h-4 w-4" />}
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
                  <SelectItem value={TodoStatus.TODO}>Todo</SelectItem>
                  <SelectItem value={TodoStatus.IN_PROGRESS}>
                    In Progress
                  </SelectItem>
                  <SelectItem value={TodoStatus.DONE}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpdateTodo}>
              {updateLoadingState ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="icon" onClick={handleDeleteTodo}>
        {!deleteLoadingState && <Trash2 className="h-4 w-4" />}
        {deleteLoadingState && <Loader className="h-4 w-4 animate-spin" />}
      </Button>
    </>
  );
}
