import React from 'react';
import TodoCachedApp from './components/TodoCachedApp';
import { getTodos } from '@/lib/todos';

// Komponen ini adalah halaman yang berjalan penuh async.
// Karena file ini tidak menggunakan direktif 'use client', komponen ini
// berjalan murni di server (Server Component).
// Fungsi getTodos() mengambil data tugas sebelum halaman dikirim ke browser pengguna.
export default async function CachedTodoPage() {
  const initialTodos = await getTodos();

  return (
    <main className="min-h-screen p-6 md:p-10 bg-white text-dark-70">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 pb-4 border-b border-gray-70 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-70">Daftar Tugas</h1>
            <p className="text-sm text-muted mt-1">
              Dengan Caching (localStorage)
            </p>
          </div>

          {/* Indikator Caching: Menggunakan localStorage dari sisi client */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-success-70 bg-success-10 px-3 py-1.5 rounded-full border border-success-30 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-success-70 animate-pulse" />
            localStorage aktif
          </div>
        </div>

        {/* Panggil komponen TodoCachedApp dan masukkan variabel initialTodos sebagai props */}
        <TodoCachedApp initialTodos={initialTodos} />
      </div>
    </main>
  );
}
