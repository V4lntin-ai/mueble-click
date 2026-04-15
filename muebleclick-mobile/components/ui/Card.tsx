// components/ui/Card.tsx
import { View, ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

interface CardProps extends ViewProps {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <View 
      className={cn(
        "bg-beige rounded-2xl p-4 shadow-neo border border-white/40",
        className
      )} 
      {...props}
    >
      {children}
    </View>
  );
}