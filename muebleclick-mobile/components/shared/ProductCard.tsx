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
  
  // Lógica mejorada para mostrar stock exacto al vendedor
  const getStockBadge = () => {
    if (stock <= 0) {
      return <Badge label="Agotado" variant="danger" />;
    }
    
    // Si hay poco stock (ej. menos de 5), usamos un color de advertencia
    if (stock <= 5) {
      return <Badge label={`${stock} en stock`} variant="warning" />;
    }

    // Para stock saludable, mostramos el número en verde
    return <Badge label={`${stock} en stock`} variant="success" />;
  };

  return (
    <Card className={cn("flex-row items-center p-3 mb-4", className)}>
      {/* Imagen del producto */}
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
          {/* Aquí se renderiza el número exacto de stock de la sucursal */}
          {getStockBadge()}
        </View>
      </View>

      {/* Botón de Agregar */}
      {onAddPress && (
        <Pressable 
          onPress={onAddPress}
          disabled={stock <= 0} // Deshabilitamos si no hay stock real
          className={cn(
            "ml-3 w-10 h-10 rounded-full items-center justify-center shadow-neo active:opacity-70",
            stock <= 0 ? "bg-gray-300" : "bg-primary"
          )}
        >
          <Plus color="#F5F0E8" size={20} />
        </Pressable>
      )}
    </Card>
  );
}