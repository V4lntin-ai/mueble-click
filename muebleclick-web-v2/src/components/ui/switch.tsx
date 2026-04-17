import * as React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, onChange, checked, ...props }, ref) => {
    return (
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          className="sr-only peer"
          onChange={(e) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          {...props}
        />
        <div className={cn(
          'peer h-5 w-9 rounded-full border-2 border-transparent',
          'bg-black/15 transition-all duration-200',
          'peer-checked:bg-gradient-primary',
          'after:content-[""] after:absolute after:top-0.5 after:left-0.5',
          'after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm',
          'after:transition-all after:duration-200',
          'peer-checked:after:translate-x-4',
          className,
        )} />
      </label>
    );
  },
);
Switch.displayName = 'Switch';

export { Switch };
