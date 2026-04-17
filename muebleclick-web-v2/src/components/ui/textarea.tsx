import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[80px] w-full rounded-xl border border-[var(--color-border)]',
      'bg-white px-3 py-2 text-sm text-[var(--color-foreground)]',
      'placeholder:text-[var(--color-muted-foreground)]',
      'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 focus:border-[var(--color-accent)]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-200 resize-none',
      className,
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
