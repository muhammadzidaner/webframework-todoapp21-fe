import React from 'react';
import { getTodos } from '@/lib/todos';
import TodoStateOnlyApp from './components/TodoStateOnlyApp';

export default async function TodoPage() {
  const initialTodos = await getTodos();

  return (
    <main className="min-h-screen p-6 md:p-10 bg-white text-dark-70">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 pb-4 border-b border-gray-70 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-70">Daftar Tugas</h1>
            <p className="text-sm text-muted mt-1">
              {/* Tampilkan Jumlah Menggunakan State Murni (In-Memory) */}
              {initialTodos.length} tugas tersedia
            </p>
          </div>
        </div>

        <TodoStateOnlyApp initialTodos={initialTodos} />
      </div>
    </main>
  );
}
