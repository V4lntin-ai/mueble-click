// components/ui/Input.tsx
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, ...props }: InputProps) {
  return (
    <View className="w-full mb-4">
      {label && <Text className="text-primary-dark font-semibold mb-2 ml-1">{label}</Text>}
      <TextInput
        className={cn(
          "bg-beige rounded-xl px-4 py-3 text-primary-dark font-medium shadow-neo-inset border border-white/30",
          error && "border-red-500/50",
          className
        )}
        placeholderTextColor="#A0522D80" // brown con 50% opacidad
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
}