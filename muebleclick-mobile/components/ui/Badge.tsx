// components/ui/Badge.tsx
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'default';
  className?: string;
}

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  const variantStyles = {
    // Usamos opacidades (10%) para el fondo y el color sólido para el texto
    success: "bg-[#2D6A4F]/10 border-[#2D6A4F]/20",
    warning: "bg-[#A0522D]/10 border-[#A0522D]/20",
    danger:  "bg-red-500/10 border-red-500/20",
    default: "bg-gray-500/10 border-gray-500/20",
  };

  const textStyles = {
    success: "text-primary",
    warning: "text-brown",
    danger:  "text-red-600",
    default: "text-gray-600",
  };

  return (
    <View className={cn("px-2.5 py-1 rounded-full border", variantStyles[variant], className)}>
      <Text className={cn("text-xs font-bold", textStyles[variant])}>
        {label}
      </Text>
    </View>
  );
}