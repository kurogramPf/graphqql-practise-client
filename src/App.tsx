import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, PlusCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

const GET_TODOS = gql`
  query {
    getTodos {
      id
      title
      completed
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($title: String!) {
    addTodo(title: $title) {
      id
      title
      completed
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $completed: Boolean!) {
    updateTodo(id: $id, completed: $completed) {
      id
      title
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
      title
      completed
    }
  }
`;

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

function App() {
  // const todos = [
  //   { id: "1", title: "GraphQLを学ぶ", completed: false },
  //   { id: "2", title: "Reactを学ぶ", completed: false },
  // ] as Todo[];

  // useQuery()GraphQLのクエリを実行とloading状態を取得できる
  const { loading, data } = useQuery(GET_TODOS, {
    fetchPolicy: "network-only",
  });
  const todos = data ? data.getTodos : [];

  // GraphQLのクエリを実行 データの追加
  const [addTodo] = useMutation(ADD_TODO);
  const [title, setTitle] = useState("");
  const handleAddTodo = async () => {
    await addTodo({
      // variablesはmutation addTodoの引数に渡すもの
      // {title}は{title： tilte}の省略記述
      variables: { title },
      // addTodoが成功したら、もう一度GET_TODOSを実行する
      refetchQueries: [{ query: GET_TODOS }],
    });

    setTitle("");
  };

  // GraphQLのクエリを実行 データの更新
  const [updateTodo] = useMutation(UPDATE_TODO);
  const handleUpdateTodo = async (id: string, completed: boolean) => {
    await updateTodo({
      variables: { id, completed: !completed },
      refetchQueries: [{ query: GET_TODOS }],
    });
  };

  const [deleteTodo] = useMutation(DELETE_TODO);
  const handleRemoveTodo = async (id: string) => {
    await deleteTodo({
      variables: { id },
      refetchQueries: [{ query: GET_TODOS }],
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-mint-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-teal-400 to-emerald-500 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">To-Do List</h1>
          </div>
          <div className="p-6">
            <div className="flex mb-4">
              <Input
                type="text"
                placeholder="タスクを追加"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-grow mr-2 bg-teal-50 border-teal-200 focus:ring-2 focus:ring-teal-300 focus:border-transparent"
              />
              <Button
                onClick={handleAddTodo}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <PlusCircle className="w-5 h-5" />
              </Button>
            </div>
            <AnimatePresence>
              {todos.map((todo: Todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -100 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center mb-4  p-4 rounded-lg shadow-sm ${
                    todo.completed ? "bg-mint-100" : "bg-white"
                  }`}
                >
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    // onCheckedChangeはチェックボックスの状態が変わったときに呼ばれる
                    onCheckedChange={() =>
                      handleUpdateTodo(todo.id, todo.completed)
                    }
                    className="mr-3 border-teal-400 text-teal-500"
                  />
                  <Label
                    htmlFor={`todo-${todo.id}`}
                    className={`flex-grow text-lg cursor-pointer ${
                      todo.completed
                        ? "line-through text-teal-600"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </Label>
                  {todo.completed && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-500 ml-2" />
                      <Button
                        onClick={() => handleRemoveTodo(todo.id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 h-auto"
                      >
                        削除
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {todos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-teal-600 mt-6"
              >
                タスクがありません
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default App;
