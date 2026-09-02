import React from 'react';
import ApiTodoList from './components/ApiTodoList';
import { getTasks } from '@/lib/todos-api';

export default async function ApiTodosPage() {
  const { todos: initialTasks, total, label } = await getTasks();

  return (
    <main className="min-h-screen p-6 md:p-10 bg-white text-dark-70">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 pb-4 border-b border-gray-70 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-70">Daftar Tugas</h1>
            <p className="text-sm text-muted mt-1">
              Data dari DummyJSON API · {label}
            </p>
          </div>

          {/* Badge indikator sumber data */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-accent bg-primary-10 px-3 py-1.5 rounded-full border border-primary-30 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Fetch API Aktif
          </div>
        </div>

        <ApiTodoList initialTasks={initialTasks} />
      </div>
    </main>
  );
}
