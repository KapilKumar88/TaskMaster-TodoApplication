import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { useCreateTodoMutation } from "@/redux/api/todo/todo-api-slice";
import { useToast } from "@/hooks/use-toast";
import { Todo } from "@/common/types";
import { TodoPriority, TodoStatus } from "@/common/enums";

export default function CreateTodo() {
  const [CreateTodo] = useCreateTodoMutation();
  const [newTodo, setNewTodo] = useState<string>("");
  const { toast } = useToast();

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newTodo.trim()) {
        const newTodoItem: Todo = {
          name: newTodo.trim(),
          description: newTodo.trim(),
          status: TodoStatus.TODO,
          priority: TodoPriority.LOW,
        };
        const response = await CreateTodo(newTodoItem).unwrap();
        toast({
          title: "Success",
          description: response?.message ?? "Todo added successfully",
        });
        setNewTodo("");
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
    <form onSubmit={handleAddTodo} className="mb-6 flex space-x-2">
      <Input
        type="text"
        placeholder="Add a new todo..."
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        className="flex-1"
      />
      <Button type="submit">
        <Plus className="mr-2 h-4 w-4" /> Add Todo
      </Button>
    </form>
  );
}
