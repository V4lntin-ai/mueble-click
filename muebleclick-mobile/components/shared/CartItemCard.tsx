// components/shared/CartItemCard.tsx
import { View, Text, Image, Pressable } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import { CartItem } from '../../store/cartStore';

interface CartItemCardProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItemCard({ item, onIncrease, onDecrease, onRemove }: CartItemCardProps) {
  return (
    <Card className="flex-row items-center p-3 mb-3 bg-white/50">
      <View className="w-16 h-16 bg-beige-dark rounded-xl overflow-hidden mr-3">
        <Image source={{ uri: item.imagen_url }} className="w-full h-full" resizeMode="cover" />
      </View>

      <View className="flex-1 justify-center">
        <Text className="text-primary-dark font-bold text-sm mb-1" numberOfLines={1}>{item.nombre}</Text>
        <Text className="text-primary font-extrabold text-base mb-2">
          ${item.precio_venta.toLocaleString('es-MX')}
        </Text>
        
        {/* Controles de Cantidad Neomórficos */}
        <View className="flex-row items-center space-x-3">
          <Pressable onPress={onDecrease} className="w-8 h-8 bg-beige rounded-full items-center justify-center shadow-neo active:opacity-70">
            <Minus color="#A0522D" size={16} />
          </Pressable>
          
          <Text className="text-primary-dark font-bold text-base w-6 text-center">{item.cantidad}</Text>
          
          <Pressable onPress={onIncrease} className="w-8 h-8 bg-primary rounded-full items-center justify-center shadow-neo active:opacity-70">
            <Plus color="#F5F0E8" size={16} />
          </Pressable>
        </View>
      </View>

      {/* Botón Eliminar */}
      <Pressable onPress={onRemove} className="p-2 ml-2 active:opacity-50">
        <Trash2 color="#ef4444" size={20} />
      </Pressable>
    </Card>
  );
}