import { createServerClient, type CookieMethodsServer } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

const isSupabaseConfigured =
  SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  SUPABASE_URL !== 'your_supabase_project_url';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // If Supabase is not configured, skip auth entirely and allow all routes
  if (!isSupabaseConfigured) {
    return supabaseResponse;
  }

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
      supabaseResponse = NextResponse.next({ request });
      cookiesToSet.forEach(({ name, value, options }) =>
        supabaseResponse.cookies.set(name, value, options)
      );
    },
  };

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: cookieMethods,
  });

  // getSession() membaca dari cookie — lebih reliable di Edge Runtime.
  // getUser() melakukan network call ke Supabase dan bisa gagal/lambat.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoggedIn = !!session;
  const pathname = request.nextUrl.pathname;

  // Rute yang WAJIB login (hanya checkout).
  // Profile tidak dipaksa redirect: halaman profil membaca sesi sendiri di server
  // dan menampilkan ajakan masuk jika memang belum login. Ini mencegah user yang
  // sudah login tetap dilempar ke /login saat pengecekan sesi di middleware meleset.
  // Cart & orders bisa diakses publik (data dari local state)
  const protectedPaths = ['/checkout'];

  // Rute yang redirect ke home kalau sudah login
  const authOnlyPaths = ['/login', '/register'];

  if (!isLoggedIn && protectedPaths.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Simpan tujuan awal supaya bisa redirect balik setelah login
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && authOnlyPaths.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
