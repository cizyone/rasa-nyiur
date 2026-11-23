'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Tetap arahkan ke beranda meskipun sign-out gagal (mis. offline)
    } finally {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors disabled:opacity-60"
    >
      <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
        <LogOut size={16} className="text-red-500" />
      </span>
      <span className="flex-1 text-left text-sm font-medium text-red-500">
        {loading ? 'Keluar...' : 'Keluar'}
      </span>
      <ChevronRight size={16} className="text-gray-300 shrink-0" />
    </button>
  );
}
