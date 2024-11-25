import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateTodo from "@/components/todo/create-todo";
import { useTodoListingQuery } from "@/redux/api/todo/todo-api-slice";
import { TodoStatus } from "@/common/enums";
import { RECORDS_PER_PAGE } from "@/common/constants";
import TodoList from "@/components/todo/todo-list";

export default function TodoPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<
    "all" | TodoStatus.DONE | TodoStatus.TODO | TodoStatus.IN_PROGRESS
  >("all");
  const { data: todoListData } = useTodoListingQuery(
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
        <TodoList todoListData={todoListData} />
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
