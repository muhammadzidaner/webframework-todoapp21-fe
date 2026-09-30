'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { authService } from '@/services/authService';
import { todoService } from '@/services/TodoService';
import { Todo } from '@/types/todo';

export default function TodoApp() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth Guard & Fetch Data saat Halaman Dibuka
  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    const loadTodos = async () => {
      try {
        const data = await todoService.getTodos();
        const formatted: Todo[] = data.map((item) => ({
          id: item.id,
          title: item.task,        // backend returns 'task'
          completed: Boolean(item.completed),
          createdAt: new Date().toISOString().split('T')[0],
        }));
        setTodos(formatted);
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        if (status === 401 || status === 403) {
          authService.logout();
          router.replace('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [router]);

  // Handler Tambah Tugas (Create) → Kirim ke API, lalu update state
  const handleAddTodo = async (title: string) => {
    try {
      const newTodo = await todoService.create(title);
      const created: Todo = {
        id: newTodo.id,
        title: newTodo.task,       // backend returns 'task'
        completed: newTodo.completed,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTodos((prev) => [...prev, created]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan!';
      alert(`Gagal menambahkan tugas: ${message}`);
    }
  };

  // Handler Checkbox Toggle Status Completed (Optimistic Update)
  const handleToggleComplete = async (id: number) => {
    const target = todos.find((todo) => todo.id === id);
    if (!target) return;

    const newCompleted = !target.completed;

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );

    try {
      await todoService.updateTodo(id, { is_completed: newCompleted });
    } catch (err) {
      // Rollback jika API gagal
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: target.completed } : t))
      );
      const message = err instanceof Error ? err.message : '';
      alert(`Gagal memperbarui status tugas: ${message}`);
    }
  };

  // Handler Hapus Tugas (Delete) → Optimistic Update
  const handleDelete = async (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await todoService.deleteTodo(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan!';
      alert(`Gagal menghapus tugas: ${message}`);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.replace('/login');
  };

  return (
    <div>
      {/* Jika Todo */}
      {loading ? (
        <div>
          <div className="text-center p-4 text-gray-400 text-sm">
            Memuat data...
          </div>
        </div>
      ) : (
        <div>
          <TodoForm onAddTodo={handleAddTodo} />
          <TodoList
            todos={todos}
            onToggleTodo={handleToggleComplete}
            onDeleteTodo={handleDelete}
          />
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium"
        >
          Logout →
        </button>
      </div>
    </div>
  );
}
