'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, ClipboardList, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/orders', label: 'Pesanan', icon: ClipboardList },
  { href: '/profile', label: 'Profil', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 bottom-nav z-40">
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 transition-all duration-150',
                isActive ? 'text-primary' : 'text-neutral-400 hover:text-neutral-600'
              )}
            >
              <div className={cn(
                'w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150',
                isActive && 'bg-primary/10'
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={cn('text-[10px] font-medium', isActive && 'font-bold')}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
