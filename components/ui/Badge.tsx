import { cn } from '@/lib/utils';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'dark';
  className?: string;
}

const variantStyles = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary-700',
  tertiary: 'bg-tertiary/20 text-amber-700',
  danger: 'bg-red-50 text-red-600',
  dark: 'bg-primary text-white',
};

const BADGE_ICONS: Record<string, string> = {
  'Best Seller': '🔥',
  'Chef Recommended': '👨‍🍳',
  'Ciri Khas Minahasa': '🌴',
  'Fan Favorite': '❤️',
  'Signature Dish': '⭐',
  'Non-Halal': '🚫',
  'Eksotis Manado': '🌊',
};

export default function Badge({ label, variant = 'primary', className }: BadgeProps) {
  const icon = BADGE_ICONS[label];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap',
        variantStyles[variant],
        className
      )}
    >
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}
