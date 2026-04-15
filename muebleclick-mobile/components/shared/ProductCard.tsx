// components/shared/ProductCard.tsx
import { View, Text, Image, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  name: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
  onAddPress?: () => void;
  className?: string;
}

export function ProductCard({ 
  name, 
  sku, 
  price, 
  stock, 
  imageUrl, 
  onAddPress,
  className 
}: ProductCardProps) {
  
  // Lógica simple de presentación de inventario
  const getStockBadge = () => {
    if (stock <= 0) return <Badge label="Agotado" variant="danger" />;
    if (stock <= 3) return <Badge label={`Solo ${stock} ud.`} variant="warning" />;
    return <Badge label="Disponible" variant="success" />;
  };

  return (
    <Card className={cn("flex-row items-center p-3 mb-4", className)}>
      {/* Imagen del producto con fallback a un fondo beige oscuro */}
      <View className="w-20 h-20 bg-beige-dark rounded-xl overflow-hidden mr-4 shadow-neo-inset">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center bg-brown/10">
            <Text className="text-brown/40 font-bold text-xs">IMG</Text>
          </View>
        )}
      </View>

      {/* Información del Producto */}
      <View className="flex-1 justify-center">
        <Text className="text-primary-dark font-bold text-base mb-1" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-brown/70 text-xs mb-2">SKU: {sku}</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-primary font-extrabold text-lg">
            ${price.toLocaleString('es-MX')}
          </Text>
          {getStockBadge()}
        </View>
      </View>

      {/* Botón de Agregar (Ideal para el POS y Carrito) */}
      {onAddPress && (
        <Pressable 
          onPress={onAddPress}
          className="ml-3 w-10 h-10 bg-primary rounded-full items-center justify-center shadow-neo active:opacity-70"
        >
          <Plus color="#F5F0E8" size={20} />
        </Pressable>
      )}
    </Card>
  );
}