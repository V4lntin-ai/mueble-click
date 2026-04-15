// app/(cliente)/index.tsx
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useQuery } from "@apollo/client";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { ProductCard } from "../../components/shared/ProductCard";
import { Button } from "../../components/ui/Button";
import { GET_PRODUCTOS } from "../../lib/graphql/productos";
import { useCartStore } from "../../store/cartStore";

export default function ExplorarScreen() {
  const { data, loading, error } = useQuery(GET_PRODUCTOS);
  // Extraemos la función addItem de Zustand
  const addItem = useCartStore((state) => state.addItem);

  return (
    <ScrollView className="flex-1 bg-beige px-5 pt-2" showsVerticalScrollIndicator={false}>
      
      {/* Buscador Neomórfico */}
      <Input 
        placeholder="Encuentra tu mueble ideal..." 
        className="bg-white/60 mb-6" 
      />

      {/* Hero Banner (Promoción) */}
      <Card className="bg-primary border-0 shadow-neo mb-8 p-6 items-start">
        <View className="bg-white/20 px-3 py-1 rounded-full mb-3 border border-white/30">
          <Text className="text-beige font-bold text-xs">COLECCIÓN PRIMAVERA</Text>
        </View>
        <Text className="text-2xl font-black text-beige mb-2 tracking-tight">
          Renueva tu sala de estar
        </Text>
        <Text className="text-beige/80 mb-4 font-medium">
          Hasta 20% de descuento en sofás modulares seleccionados.
        </Text>
        <Button label="Ver Colección" variant="secondary" className="py-2 px-4 rounded-lg" textClassName="text-sm" />
      </Card>

      {/* Título de Sección */}
      <View className="flex-row justify-between items-end mb-4 px-1">
        <Text className="text-2xl font-bold text-primary-dark tracking-tight">Destacados</Text>
        <Text className="text-brown text-sm font-bold">Ver todos</Text>
      </View>

      {/* Estados de Carga y Error */}
      {loading && (
        <View className="py-10 items-center justify-center">
          <ActivityIndicator size="large" color="#2D6A4F" />
          <Text className="text-primary mt-2 font-medium">Cargando catálogo...</Text>
        </View>
      )}

      {error && (
        <Card className="bg-red-500/10 border-red-500/30 items-center py-6">
          <Text className="text-red-600 font-bold">Error al cargar los muebles.</Text>
          <Text className="text-red-500/80 text-xs mt-1">{error.message}</Text>
        </Card>
      )}

      {/* Renderizado Dinámico desde PostgreSQL */}
      {data?.productos.map((producto: any) => (
        <ProductCard
          key={producto.id_producto}
          name={producto.nombre}
          sku={producto.sku || 'N/A'}
          price={producto.precio_venta}
          stock={10} 
          imageUrl={producto.imagen_url || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300&q=80'}
          // AQUÍ ES LA MAGIA: Pasamos el objeto entero a Zustand
          onAddPress={() => addItem(producto)} 
        />
      ))}
      
      {/* Espaciado para que el último elemento no quede detrás de la barra inferior */}
      <View className="h-10" />
    </ScrollView>
  );
}