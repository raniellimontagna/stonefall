import { type HTMLMotionProps, motion } from 'framer-motion';
import { forwardRef } from 'react';
import { soundManager } from '@/game/SoundManager';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  sound?: boolean; // Enable/disable click sound (default: true)
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', sound = true, onClick, children, ...props },
    ref
  ) => {
    // Stone Age Style Variants
    const variants = {
      primary:
        'bg-wood-main text-stone-100 border-b-4 border-wood-dark hover:bg-wood-light active:border-b-0 active:translate-y-1',
      secondary:
        'bg-stone-600 text-stone-100 border-b-4 border-stone-800 hover:bg-stone-500 active:border-b-0 active:translate-y-1',
      danger:
        'bg-red-700 text-white border-b-4 border-red-900 hover:bg-red-600 active:border-b-0 active:translate-y-1',
      ghost: 'bg-transparent text-stone-300 hover:text-stone-100 hover:bg-stone-800/50',
    };

    const sizes = {
      sm: 'px-3 py-1 text-sm rounded-lg',
      md: 'px-4 py-2 text-base rounded-xl',
      lg: 'px-6 py-3 text-lg rounded-xl',
      icon: 'p-2 rounded-xl aspect-square flex items-center justify-center',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sound) {
        soundManager.play('click');
      }
      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'font-bold transition-colors shadow-lg flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
