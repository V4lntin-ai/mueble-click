// components/ui/Button.tsx
import { Pressable, Text, PressableProps, View } from 'react-native';
import { cn } from '../../lib/utils';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  textClassName?: string;
}

export function Button({ 
  label, 
  variant = 'primary', 
  className, 
  textClassName, 
  ...props 
}: ButtonProps) {
  
  const baseClasses = "rounded-xl py-3 px-6 items-center justify-center border border-white/20 transition-all duration-200 active:opacity-70";
  
  const variantClasses = {
    primary: "bg-primary shadow-neo",
    secondary: "bg-brown shadow-neo",
    ghost: "bg-transparent border-0",
  };

  const textClasses = {
    primary: "text-beige font-bold text-lg",
    secondary: "text-beige font-bold text-lg",
    ghost: "text-primary font-bold text-lg",
  };

  return (
    <Pressable 
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      <Text className={cn(textClasses[variant], textClassName)}>
        {label}
      </Text>
    </Pressable>
  );
}