'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login gagal';
      setError(
        message.includes('Invalid login credentials')
          ? 'Email atau password salah. Coba lagi.'
          : message.includes('Email not confirmed')
          ? 'Email belum diverifikasi. Cek inbox kamu.'
          : !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url'
          ? 'Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.'
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBF3EE] via-[#F5F6F5] to-[#FEF8EC] flex flex-col">
      {/* Back button */}
      <div className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:opacity-80 transition-opacity">
          <ArrowLeft size={18} />
          Kembali
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌴</div>
          <h1 className="text-2xl font-extrabold text-[#24583F]">Rasa Nyiur</h1>
          <p className="text-sm text-neutral-500 font-medium">Kuliner Khas Manado</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Masuk ke Akun</h2>
          <p className="text-sm text-neutral-500 mb-6">Selamat datang kembali, Foodies! 👋</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4 flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                placeholder="Email kamu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#24583F]/30 focus:border-[#24583F] transition-all"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#24583F]/30 focus:border-[#24583F] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="text-right">
              <button type="button" className="text-xs text-[#24583F] font-medium hover:underline">Lupa Password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#24583F] text-white font-bold py-3.5 rounded-xl transition-all duration-150 hover:bg-[#1E4A35] active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Masuk...</>
              ) : 'Masuk'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-neutral-400 font-medium">atau</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-sm text-neutral-500">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#24583F] font-bold hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
