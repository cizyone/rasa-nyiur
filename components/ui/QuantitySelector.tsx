'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
  max = 20,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  const sizeClasses = {
    sm: { btn: 'w-7 h-7', text: 'text-sm w-7', icon: 14 },
    md: { btn: 'w-9 h-9', text: 'text-base w-9', icon: 16 },
    lg: { btn: 'w-11 h-11', text: 'text-lg w-10', icon: 18 },
  };
  const s = sizeClasses[size];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className={cn(
          s.btn,
          'rounded-full flex items-center justify-center transition-all duration-150 active:scale-90',
          quantity <= min
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
        )}
      >
        <Minus size={s.icon} strokeWidth={2.5} />
      </button>
      <span className={cn('font-bold text-gray-800 text-center', s.text)}>{quantity}</span>
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className={cn(
          s.btn,
          'rounded-full flex items-center justify-center transition-all duration-150 active:scale-90',
          quantity >= max
            ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-600'
        )}
      >
        <Plus size={s.icon} strokeWidth={2.5} />
      </button>
    </div>
  );
}
