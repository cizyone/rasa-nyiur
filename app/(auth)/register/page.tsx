'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (!agreedToTerms) {
      setError('Kamu harus menyetujui syarat dan ketentuan terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });
      if (authError) throw authError;
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Pendaftaran gagal';
      setError(
        message.includes('User already registered')
          ? 'Email ini sudah terdaftar. Coba masuk atau gunakan email lain.'
          : message.includes('Password should be at least')
          ? 'Password minimal 6 karakter.'
          : message.includes('invalid email')
          ? 'Format email tidak valid.'
          : !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url'
          ? 'Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.'
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EBF3EE] via-[#F5F6F5] to-[#FEF8EC] flex flex-col">
        <div className="p-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:opacity-80 transition-opacity">
            <ArrowLeft size={18} />
            Kembali
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🌴</div>
            <h1 className="text-2xl font-extrabold text-[#24583F]">Rasa Nyiur</h1>
            <p className="text-sm text-neutral-500 font-medium">Kuliner Khas Manado</p>
          </div>

          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={36} className="text-[#24583F]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil! 🎉</h2>
            <p className="text-sm text-neutral-500 mb-6">
              Cek email kamu untuk verifikasi akun!
              <br />
              <span className="font-semibold text-[#24583F]">{email}</span>
            </p>
            <p className="text-xs text-neutral-400 mb-6">
              Tidak menemukan email? Cek folder spam atau tunggu beberapa menit.
            </p>
            <Link
              href="/login"
              className="w-full bg-[#24583F] text-white font-bold py-3.5 rounded-xl text-sm text-center transition-all duration-150 hover:bg-[#1E4A35] active:scale-95 block"
            >
              Masuk Sekarang
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 className="text-xl font-bold text-gray-900 mb-1">Buat Akun Baru</h2>
          <p className="text-sm text-neutral-500 mb-6">Daftar dan nikmati kuliner Manado terbaik! 🍜</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4 flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#24583F]/30 focus:border-[#24583F] transition-all"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min. 6 karakter)"
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

            {/* Confirm Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Konfirmasi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#24583F]/30 focus:border-[#24583F] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password match indicator */}
            {confirmPassword && (
              <p className={`text-xs font-medium -mt-1 ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                {password === confirmPassword ? '✓ Password cocok' : '✗ Password tidak cocok'}
              </p>
            )}

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    agreedToTerms
                      ? 'bg-[#24583F] border-[#24583F]'
                      : 'bg-white border-gray-300 group-hover:border-[#24583F]'
                  }`}
                >
                  {agreedToTerms && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-neutral-500 leading-relaxed">
                Saya menyetujui{' '}
                <button type="button" className="text-[#24583F] font-semibold hover:underline">
                  Syarat & Ketentuan
                </button>{' '}
                dan{' '}
                <button type="button" className="text-[#24583F] font-semibold hover:underline">
                  Kebijakan Privasi
                </button>{' '}
                Rasa Nyiur.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#24583F] text-white font-bold py-3.5 rounded-xl transition-all duration-150 hover:bg-[#1E4A35] active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Mendaftar...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-neutral-400 font-medium">atau</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-sm text-neutral-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#24583F] font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
