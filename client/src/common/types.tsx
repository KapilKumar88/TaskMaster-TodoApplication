export type Todo = {
  id: string;
  name: string;
  completed: boolean;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
};
