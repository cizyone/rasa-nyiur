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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes — only enforce when Supabase is configured
  const protectedPaths = ['/profile', '/orders', '/checkout', '/cart'];
  const authPaths = ['/login', '/register'];
  const pathname = request.nextUrl.pathname;

  if (!user && protectedPaths.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && authPaths.some((path) => pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
