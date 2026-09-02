// Tipe data mentah dari DummyJSON API (sebelum di-mapping)
export interface DummyJsonTodo {
  id: number;
  todo: string;       // DummyJSON menggunakan 'todo', bukan 'title'
  completed: boolean;
  userId: number;
}

// Tipe respons list dari DummyJSON API
export interface DummyJsonTodosResponse {
  todos: DummyJsonTodo[];
  total: number;
  skip: number;
  limit: number;
}

// Payload untuk membuat Todo baru (POST)
export interface CreateTodoPayload {
  todo: string;
  completed: boolean;
  userId: number;
}

// Payload untuk mengupdate Todo (PUT)
export interface UpdateTodoPayload {
  todo?: string;
  completed?: boolean;
}
