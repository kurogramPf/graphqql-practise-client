import { Button } from "./components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./components/ui/label";
import { Checkbox } from "./components/ui/checkbox";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

function App() {
  const todos = [
    { id: "1", title: "GraphQLを学ぶ", completed: false },
    { id: "2", title: "Reactを学ぶ", completed: false },
  ] as Todo[];

  return (
    <div>
      <h1>ToDo List</h1>
      <input type="text" placeholder="ToDoを追加してください。" />
      <Button className={cn("bg-blue-500 text-white")}>追加</Button>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={cn("flex", todo.completed && "line-through")}
          >
            <Label htmlFor={`item_${todo.id}`}>
              <Checkbox checked={todo.completed} id={`item_${todo.id}`} />
              {todo.title}
            </Label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
