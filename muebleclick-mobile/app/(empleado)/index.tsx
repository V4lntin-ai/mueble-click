// app/(empleado)/index.tsx
import { View, Text, ScrollView } from "react-native";
import { Input } from "../../components/ui/Input";
import { ProductCard } from "../../components/shared/ProductCard";

// Simulamos los datos que vendrán de NestJS (Tabla Productos + Inventario)
const MOCK_INVENTARIO = [
  { id: '1', name: 'Silla Comedor Oslo', sku: 'SIL-OSL-01', price: 1250, stock: 15 },
  { id: '2', name: 'Mesa de Centro Nogal', sku: 'MES-NOG-05', price: 3400, stock: 2 },
  { id: '3', name: 'Sofá Modular 3 Plazas', sku: 'SOF-MOD-03', price: 8900, stock: 0 },
  { id: '4', name: 'Lámpara de Pie Nórdica', sku: 'LAM-NOR-01', price: 850, stock: 8 },
];

export default function POSScreen() {
  return (
    <ScrollView className="flex-1 bg-beige px-4 pt-4">
      {/* Buscador Neomórfico */}
      <Input 
        placeholder="Buscar producto por nombre o SKU..." 
        className="bg-white/50 mb-6" 
      />
      
      <View className="flex-row justify-between items-end mb-4 px-1">
        <Text className="text-xl font-bold text-primary">Catálogo Rápido</Text>
        <Text className="text-brown text-sm font-medium">{MOCK_INVENTARIO.length} resultados</Text>
      </View>

      {/* Renderizado de la lista */}
      {MOCK_INVENTARIO.map((item) => (
        <ProductCard
          key={item.id}
          name={item.name}
          sku={item.sku}
          price={item.price}
          stock={item.stock}
          onAddPress={() => console.log(`Agregado ${item.name} al carrito POS`)}
        />
      ))}
      
      {/* Espaciado inferior para que el último item no quede tapado por la Tab Bar */}
      <View className="h-10" />
    </ScrollView>
  );
}