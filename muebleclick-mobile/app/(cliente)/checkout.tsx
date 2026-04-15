// app/(cliente)/checkout.tsx
import { useState } from "react";
import { View, Text, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@apollo/client";
import { CheckCircle2 } from "lucide-react-native";

import { useCartStore } from "../../store/cartStore";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { CREATE_PEDIDO } from "../../lib/graphql/pedidos";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [ordenCompletada, setOrdenCompletada] = useState(false);

  // Hook de Apollo
  const [crearPedido, { loading }] = useMutation(CREATE_PEDIDO);

  const total = getTotalPrice();

  const handleConfirmarPedido = async () => {
    try {
      // 1. Llamada a NestJS para crear el encabezado del pedido
      // (Asumiendo datos por defecto para el MVP, luego conectarás tus direcciones reales)
      const { data } = await crearPedido({
        variables: {
          input: {
            tipo_entrega: "DOMICILIO",
            // id_direccion: 1, // En un futuro lo sacarás de la selección del usuario
          }
        }
      });

      const idNuevoPedido = data.createPedido.id_pedido;

      clearCart();
      setOrdenCompletada(true);

    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      Alert.alert("Error", "No pudimos procesar tu orden. Intenta de nuevo.");
    }
  };

  // VISTA DE ÉXITO
  if (ordenCompletada) {
    return (
      <View className="flex-1 bg-primary items-center justify-center px-6">
        <View className="bg-white/20 p-6 rounded-full mb-6">
          <CheckCircle2 size={80} color="#F5F0E8" />
        </View>
        <Text className="text-4xl font-black text-beige text-center mb-4">¡Pedido Confirmado!</Text>
        <Text className="text-beige/80 text-center text-lg mb-10">
          Tus muebles están en camino. Nos pondremos en contacto contigo pronto.
        </Text>
        <Button 
          label="Volver al Catálogo" 
          variant="secondary" 
          onPress={() => router.replace('/(cliente)')} 
        />
      </View>
    );
  }

  // VISTA DE RESUMEN DE CHECKOUT
  return (
    <View className="flex-1 bg-beige pt-4">
      <ScrollView className="px-5 mb-24">
        <Text className="text-3xl font-black text-primary-dark mb-6 tracking-tight">Finalizar Compra</Text>

        <Card className="mb-6 p-5 bg-white/60">
          <Text className="font-bold text-primary mb-3 text-lg">Dirección de Entrega</Text>
          <Text className="text-brown font-medium">Av. Estado de México #123</Text>
          <Text className="text-brown/70">Metepec, Estado de México</Text>
          <Text className="text-primary mt-2 text-sm font-bold">Cambiar dirección</Text>
        </Card>

        <Card className="mb-6 p-5 bg-white/60">
          <Text className="font-bold text-primary mb-3 text-lg">Método de Pago</Text>
          <Text className="text-brown font-medium">Tarjeta terminada en •••• 4242</Text>
        </Card>

        <Text className="font-bold text-primary-dark mb-4 text-xl">Resumen ({items.length} artículos)</Text>
        {items.map(item => (
          <View key={item.id_producto} className="flex-row justify-between mb-2">
            <Text className="text-brown flex-1" numberOfLines={1}>{item.cantidad}x {item.nombre}</Text>
            <Text className="font-bold text-primary-dark">${(item.precio_venta * item.cantidad).toLocaleString('es-MX')}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Botón Flotante Inferior */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-surface-light border-t border-primary/10 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-primary-dark">Total a Pagar</Text>
          <Text className="text-2xl font-black text-primary">${total.toLocaleString('es-MX')}</Text>
        </View>
        <Button 
          label={loading ? "Procesando..." : "Confirmar y Pagar"} 
          onPress={handleConfirmarPedido}
          disabled={loading}
          className="py-4 shadow-neo"
        />
      </View>
    </View>
  );
}