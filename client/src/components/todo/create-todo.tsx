import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { useCreateTodoMutation } from "@/redux/api/todo/todo-api-slice";
import { useToast } from "@/hooks/use-toast";

type Todo = {
  name: string;
  description: string;
  status: "in-progress" | "done" | "todo";
  //   priority: "low" | "medium" | "high";
};

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
          status: "todo",
        };
        const response = await CreateTodo(newTodoItem).unwrap();
        toast({
          title: "Success",
          description: response?.message ?? "Todo added successfully",
        });
        setNewTodo("");
      }
    } catch (error) {
      toast({
        title: "error",
        description: error?.message ?? "Something went wrong. Please try again",
      })
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
