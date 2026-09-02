import { apiClient } from './api';
import { Todo } from '@/types/todo';
import type {
  DummyJsonTodo,
  DummyJsonTodosResponse,
  CreateTodoPayload,
  UpdateTodoPayload,
} from '@/types/api-todo';

// Helper: mapping dari format DummyJSON → format internal Todo
function mapDummyJsonToTodo(item: DummyJsonTodo): Todo {
  return {
    id: item.id,
    title: item.todo,
    description: `Tugas dari pengguna #${item.userId}`,
    completed: item.completed,
    createdAt: new Date().toISOString().split('T')[0],
  };
}

// TodoService: semua operasi CRUD ke DummyJSON API
export const TodoService = {
  // GET semua todos (limit 10, dengan Next.js ISR caching 60 detik)
  getAll: async (): Promise<Todo[]> => {
    const res = await apiClient<DummyJsonTodosResponse>('/todos?limit=10', {
      next: { revalidate: 60 },
    });
    return res.todos.map(mapDummyJsonToTodo);
  },

  // GET satu todo berdasarkan ID
  getById: async (id: number): Promise<Todo> => {
    const item = await apiClient<DummyJsonTodo>(`/todos/${id}`, {
      next: { revalidate: 60 },
    });
    return mapDummyJsonToTodo(item);
  },

  // POST tambah todo baru
  create: async (payload: CreateTodoPayload): Promise<Todo> => {
    const item = await apiClient<DummyJsonTodo>('/todos/add', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapDummyJsonToTodo(item);
  },

  // PUT update todo
  update: async (id: number, payload: UpdateTodoPayload): Promise<Todo> => {
    const item = await apiClient<DummyJsonTodo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapDummyJsonToTodo(item);
  },

  // DELETE hapus todo
  delete: async (id: number): Promise<Todo> => {
    const item = await apiClient<DummyJsonTodo>(`/todos/${id}`, {
      method: 'DELETE',
    });
    return mapDummyJsonToTodo(item);
  },
};
