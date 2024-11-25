import { TodoPriority, TodoStatus } from "./enums";

export type Todo = {
  _id?: string;
  name: string;
  description?: string;
  completedAt?: Date | null;
  status: TodoStatus;
  priority: TodoPriority;
  createdAt?: Date;
};
