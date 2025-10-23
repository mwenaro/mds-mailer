export interface Todo {
  _id?: string;
  title: string;
  completed?: boolean;
  createdAt?: string;
}

export type NewTodo = Omit<Todo, "_id" | "createdAt">;
