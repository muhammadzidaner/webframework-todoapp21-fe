'use client';

import React from 'react';
import TodoForm from '@/app/components/TodoForm';
import TodoList from '@/app/components/TodoList';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Todo } from '@/types/todo';

type TodoCachedProps = {
  initialTodos: Todo[];
};

export default function TodoCachedApp({ initialTodos }: TodoCachedProps) {
  // Fungsi Untuk Caching - Gunakan hook ini untuk menyimpan state ke localStorage
  // sehingga data tidak hilang saat halaman di-refresh
  const [todos, setTodos] = useLocalStorage<Todo[]>('TODO_LIST_CACHE', initialTodos);

  // 1. Handler Tambah Tugas
  const handleAddTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description: 'Tugas baru yang tersimpan di localStorage.',
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  // 2. Handler Toggle Checklist
  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 3. Handler Hapus Tugas
  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // 4. Handler Reset ke Data Semula
  const handleResetTodos = () => {
    // Konfirmasi reset agar tidak terhapus terlalu cepat
    if (confirm('Konfirmasi reset data untuk daftar tugas awal?')) {
      setTodos(initialTodos);
    }
  };

  return (
    <div>
      {/* Form Tambah Tugas (dari app/components/TodoForm) */}
      <TodoForm onAddTodo={handleAddTodo} />

      {/* Indikator Status Caching */}
      <div className="flex items-center justify-between mb-4 mt-2 px-3 py-2 rounded-lg bg-surface border border-border">
        <div>
          <span className="flex items-center gap-1.5 text-xs text-muted font-medium">
            <span className="w-2 h-2 rounded-full bg-success-70 animate-pulse" />
            Caching Aktif
          </span>
          <p className="text-xs text-muted mt-0.5">
            Data tersimpan dan tidak akan hilang saat halaman dimuat ulang secara parsial
          </p>
        </div>
        <button
          onClick={handleResetTodos}
          className="text-xs text-danger-70 hover:underline shrink-0 ml-4"
        >
          Reset ke Data Awal
        </button>
      </div>

      {/* List Tugas (Teruskan dari prop app/components/TodoList.tsx) */}
      <TodoList
        todos={todos}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </div>
  );
}
