// app/(cliente)/carrito.tsx
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ShoppingCart } from "lucide-react-native";
import { useCartStore } from "../../store/cartStore";
import { CartItemCard } from "../../components/shared/CartItemCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function CarritoScreen() {

  const router = useRouter();

  const { items, addItem, decreaseItem, removeItem, clearCart, getTotalPrice } = useCartStore();

  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-beige px-6">
        <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-6">
          <ShoppingCart size={40} color="#2D6A4F" />
        </View>
        <Text className="text-2xl font-bold text-primary mb-2 text-center">Tu carrito está vacío</Text>
        <Text className="text-brown text-center mb-8">Parece que aún no has encontrado el mueble perfecto para tu espacio.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-beige">
      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-end mb-4 px-1">
          <Text className="text-2xl font-bold text-primary-dark tracking-tight">Tus Artículos</Text>
          <Text onPress={clearCart} className="text-red-500 font-medium text-sm active:opacity-50">Vaciar carrito</Text>
        </View>

        {/* Lista de Productos */}
        {items.map((item) => (
          <CartItemCard
            key={item.id_producto}
            item={item}
            onIncrease={() => addItem(item)}
            onDecrease={() => decreaseItem(item.id_producto)}
            onRemove={() => removeItem(item.id_producto)}
          />
        ))}
        
        <View className="h-6" />
      </ScrollView>

      {/* Resumen Fijo en la parte inferior */}
      <Card className="rounded-t-3xl rounded-b-none border-b-0 shadow-[0_-10px_20px_rgba(45,106,79,0.1)] px-6 pt-6 pb-8 bg-surface-light">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-brown font-medium">Subtotal</Text>
          <Text className="text-primary-dark font-bold">${total.toLocaleString('es-MX')}</Text>
        </View>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-brown font-medium">Envío</Text>
          <Text className="text-primary-dark font-bold">Por calcular</Text>
        </View>
        
        <View className="h-[1px] bg-primary/10 w-full mb-4" />
        
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-primary-dark">Total</Text>
          <Text className="text-2xl font-black text-primary">${total.toLocaleString('es-MX')}</Text>
        </View>

        <Button 
          label="Proceder al Pago" 
          onPress={() => router.push("/(cliente)/checkout")}
          className="w-full py-4 shadow-neo"
          textClassName="text-lg"
        />
      </Card>
    </View>
  );
}