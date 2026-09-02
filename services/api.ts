// Base URL untuk DummyJSON API
export const API_BASE_URL = 'https://dummyjson.com';

// Custom Error Class untuk menangani error HTTP secara terstruktur
export class ApiError extends Error {
  status: number;
  statusText: string;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = message;
    this.data = data;
  }
}

// Generic API Client - fondasi semua request HTTP ke DummyJSON
// Mendukung penerapan Caching Next.js melalui opsi fetch
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    // Disekusi Request HTTP dengan Penerapan Caching Next.js
    // next.revalidate mengontrol berapa detik cache berlaku (ISR)
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      // Passing Data untuk Penanganan Error (Catch)
      const errorData = await response.json().catch(() => null);
      throw new ApiError(response.statusText, response.status, errorData);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    // Teruskan ApiError langsung, bungkus error lain
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      `Terjadi error koneksi ke server API: ${(error as Error).message}`,
      0,
      error
    );
  }
}
