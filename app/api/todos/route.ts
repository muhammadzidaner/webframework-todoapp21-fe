import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/todos-api';
import { Todo } from '@/types/todo';

// ─── GET /api/todos ─────────────────────────────────────────────────────────
// Mengambil semua daftar tugas dengan dukungan paginasi (limit & skip)
export async function GET(request: NextRequest) {
  try {
    // Setup Penanganan Parameter Paginasi
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const skipParam = searchParams.get('skip');
    const limit = parseInt(limitParam ?? '10', 10);
    const skip = parseInt(skipParam ?? '0', 10);

    // Eksekusi dan bangun data dari Business Logic Layer
    const result = await getTasks();
    const totalPages = Math.ceil(result.total / limit);

    // Terapkan paginasi secara manual
    const paginatedTodos = result.todos.slice(skip, skip + limit);

    return NextResponse.json(
      {
        data: paginatedTodos,
        meta: {
          total: result.total,
          limit,
          skip,
          totalPages,
          hasNext: skip + limit < result.total,
          label: result.label,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[GET /api/todos] Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// ─── POST /api/todos ────────────────────────────────────────────────────────
// Simulasi penambahan todo baru (data tidak persisten ke API eksternal)
export async function POST(request: NextRequest) {
  try {
    // Susun Endpoint POST dan Validasi Payload Dasar
    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Field "title" wajib diisi dan harus berupa string.' },
        { status: 400 }
      );
    }

    // Pembentukan Data (Simulasi) dan Pengiriman Respons
    const todo: Todo = {
      id: Date.now(),
      title: title.trim(),
      description: 'Todo baru hasil tambah lewat API Route.',
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({ data: todo }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/todos] Error:', err);
    return NextResponse.json(
      { error: 'Gagal membuat todo baru. Periksa payload yang dikirim.' },
      { status: 500 }
    );
  }
}
