import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

interface IconProps extends Omit<ComponentProps<'img'>, 'size'> {
  name?: string; // For custom assets in /assets/icons/
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Icon({ name, size = 'md', className, ...props }: IconProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  if (name) {
    return (
      <img
        src={`/assets/icons/${name}.png`}
        alt={name}
        className={cn('pixel-art', sizes[size], className)}
        {...props}
      />
    );
  }

  return null;
}
