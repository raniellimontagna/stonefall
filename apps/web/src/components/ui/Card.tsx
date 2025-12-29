import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'stone' | 'wood' | 'glass';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'stone', children, ...props }, ref) => {
    const variants = {
      stone: 'bg-stone-800 border-2 border-stone-600 shadow-xl shadow-black/40',
      wood: 'bg-wood-main border-4 border-wood-dark shadow-xl shadow-black/40',
      glass: 'bg-stone-900/80 backdrop-blur-md border border-stone-700/50 shadow-lg',
    };

    return (
      <div ref={ref} className={cn('rounded-2xl p-4', variants[variant], className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
