import { NextRequest, NextResponse } from 'next/server';
import { getTaskById } from '@/lib/todos-api';

// Definisikan Tipe Parameter Dinamis (RouteContext)
type RouteContext = {
  params: Promise<{ id: string }>;
};

// ─── GET /api/todos/[id] ─────────────────────────────────────────────────────
// Mengambil detail satu tugas spesifik berdasarkan ID
export async function GET(request: NextRequest, context: RouteContext) {
  // Ekstrak Parameter ID dari URL
  const { id } = await context.params;

  try {
    // Ambil Data dan Tangani Kesalahan Tidak Ditemukan (404)
    const todo = await getTaskById(id);

    if (!todo) {
      return NextResponse.json(
        { error: `Todo dengan ID ${id} tidak ditemukan.` },
        { status: 404 }
      );
    }

    // Susun dan Kirim Respons Sukses (200)
    return NextResponse.json(
      {
        data: todo,
        meta: { id },
      },
      { status: 200 }
    );
  } catch (error) {
    // Tangani Error Server (500)
    console.error(`[GET /api/todos/${id}] Error:`, error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat mengambil detail todo.' },
      { status: 500 }
    );
  }
}
