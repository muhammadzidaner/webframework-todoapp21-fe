import { TodoService } from '@/services/TodoService';
import { Todo } from '@/types/todo';

// ─── Formatter / Data Adapter ────────────────────────────────────────────────
// Fungsi mapper untuk memastikan setiap field Todo terformat dengan benar
// sebelum dikirim ke komponen UI.
function mapRawTodo(todo: Todo): Todo {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    createdAt: todo.createdAt,
  };
}

// ─── Ambil Semua Daftar Tugas (getTasks) ────────────────────────────────────
export async function getTasks(): Promise<{
  todos: Todo[];
  total: number;
  label: string;
}> {
  try {
    const raw = await TodoService.getAll();
    const todos = raw.map(mapRawTodo);

    return {
      todos,
      total: todos.length,
      label: `${todos.length} tugas ditemukan`,
    };
  } catch (error) {
    console.error('[lib/todos-api] Error mengambil semua tugas:', error);
    return {
      todos: [],
      total: 0,
      label: 'Gagal mengambil data tugas',
    };
  }
}

// ─── Ambil Satu Tugas Spesifik (getTaskById) ────────────────────────────────
export async function getTaskById(id: string | number): Promise<Todo> {
  try {
    const todo = await TodoService.getById(Number(id));
    return mapRawTodo(todo);
  } catch (error) {
    console.error(`[lib/todos-api] Error mengambil todo ID ${id}:`, error);
    throw new Error(
      `Todo ID ${id} tidak ditemukan atau terjadi kesalahan saat mengambil data.`
    );
  }
}

// ─── Utilitas Statistik Data (getTaskStats) ─────────────────────────────────
export function getTaskStats(todos: Todo[]): {
  total: number;
  completed: number;
  pending: number;
  completedPercentage: number;
} {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const completedPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completedPercentage,
  };
}
