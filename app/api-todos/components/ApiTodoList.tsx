'use client';

import React, { useState } from 'react';
import { TodoService } from '@/services/TodoService';
import { Todo } from '@/types/todo';

type ApiTodoListProps = {
  initialTasks: Todo[];
};

export default function ApiTodoList({ initialTasks }: ApiTodoListProps) {
  const [tasks, setTasks] = useState(initialTasks);

  // Implementasi Logika Optimistic Update
  const optimisticToggleTask = async (id: number, currentCompleted: boolean) => {
    const targetStatus = !currentCompleted;

    // 1. Optimistic Update di State Lokal (tampilkan perubahan segera ke UI)
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: targetStatus } : t))
    );

    // 2. Simulasi Update ke DummyJSON via TodoService
    try {
      await TodoService.update(id, { completed: targetStatus });
    } catch (err) {
      console.error('Simulasi update ke API Dummy (DummyJSON) tidak berhasil:', err);
      // Rollback state jika API gagal
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: currentCompleted } : t))
      );
    }
  };

  return (
    <div className="flex-1 w-full">
      {/* Header dan Penanganan Data Kosong (Empty State) */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-70">
        <h2 className="text-lg font-semibold text-dark-70">Daftar Tugas</h2>
        <span className="text-xs bg-surface text-muted px-2.5 py-1 rounded-full font-medium border border-border">
          {tasks.length} tugas
        </span>
      </div>

      {tasks.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <div className="text-4xl">📋</div>
          <p className="text-sm font-medium text-dark-70">Tidak ada tugas</p>
          <p className="text-xs text-muted">
            Belum ada tugas. Tambahkan tugas pertama!
          </p>
        </div>
      )}

      {/* Render Daftar Tugas dengan Styling Dinamis */}
      <ul className="space-y-3">
        {tasks.map((task) => {
          const isCompleted = task.completed;

          return (
            <li
              key={task.id}
              className={`flex items-start justify-between gap-4 p-4 border rounded-xl transition-all duration-200 ${
                isCompleted
                  ? 'bg-success-10 border-success-30'
                  : 'bg-white border-gray-70'
              }`}
            >
              {/* Bagian Kiri: Checkbox + Konten */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  id={`task-${task.id}`}
                  checked={isCompleted}
                  onChange={() => optimisticToggleTask(task.id, isCompleted)}
                  className="mt-0.5 w-4 h-4 rounded-sm cursor-pointer accent-primary-70"
                />
                <div className="flex flex-col gap-1 min-w-0">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-sm font-medium truncate cursor-pointer transition-all ${
                      isCompleted
                        ? 'line-through text-gray-80'
                        : 'text-dark-70'
                    }`}
                  >
                    {task.title}
                  </label>
                  {task.description && (
                    <p className="text-xs text-muted truncate">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Bagian Kanan: Badge Status + Tanggal */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-success-20 text-success-80'
                      : 'bg-surface text-muted'
                  }`}
                >
                  {isCompleted ? 'Selesai' : 'Pending'}
                </span>
                <span className="text-xs text-muted">{task.createdAt}</span>
                {isCompleted && (
                  <span className="text-xs text-success-70 font-medium">
                    ✓ completed
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
