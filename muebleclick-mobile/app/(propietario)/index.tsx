// app/(propietario)/index.tsx
import { View, Text, ScrollView } from "react-native";
import { TrendingUp, AlertTriangle, Package, DollarSign } from "lucide-react-native";
import { Card } from "../../components/ui/Card";

export default function DashboardScreen() {
  // En el futuro, estos datos vendrán de NestJS
  const mockData = {
    ventasHoy: 32500,
    pedidosPendientes: 12,
    productosBajoStock: 3,
    sucursalTop: "Sucursal Cuauhtémoc"
  };

  return (
    <ScrollView className="flex-1 bg-beige px-5 pt-4" showsVerticalScrollIndicator={false}>
      
      <Text className="text-3xl font-black text-primary-dark mb-1 tracking-tight">Hola, María</Text>
      <Text className="text-brown mb-6 font-medium">Aquí está el resumen de tu negocio hoy.</Text>

      {/* Hero Card: Ventas del Día */}
      <Card className="bg-primary border-0 shadow-neo mb-6 p-6">
        <View className="flex-row justify-between items-center mb-4">
          <View className="bg-white/20 p-2 rounded-xl">
            <DollarSign color="#F5F0E8" size={24} />
          </View>
          <View className="flex-row items-center bg-green-500/20 px-2 py-1 rounded-full">
            <TrendingUp color="#4ade80" size={14} className="mr-1" />
            <Text className="text-green-400 font-bold text-xs">+15% vs ayer</Text>
          </View>
        </View>
        <Text className="text-beige/80 font-medium mb-1 uppercase tracking-wider text-xs">Ingresos del Día</Text>
        <Text className="text-5xl font-black text-beige tracking-tighter">
          ${mockData.ventasHoy.toLocaleString('es-MX')}
        </Text>
      </Card>

      {/* Grid de KPIs Secundarios */}
      <View className="flex-row space-x-4 mb-6">
        {/* KPI 1 */}
        <Card className="flex-1 p-4 bg-white/60 shadow-neo-inset items-center justify-center">
          <View className="bg-primary/10 p-3 rounded-full mb-2">
            <Package color="#2D6A4F" size={24} />
          </View>
          <Text className="text-2xl font-black text-primary-dark">{mockData.pedidosPendientes}</Text>
          <Text className="text-brown text-xs font-bold text-center">Pedidos en Línea</Text>
        </Card>

        {/* KPI 2 */}
        <Card className="flex-1 p-4 bg-white/60 shadow-neo-inset items-center justify-center border border-red-500/20">
          <View className="bg-red-500/10 p-3 rounded-full mb-2">
            <AlertTriangle color="#ef4444" size={24} />
          </View>
          <Text className="text-2xl font-black text-red-600">{mockData.productosBajoStock}</Text>
          <Text className="text-red-600/80 text-xs font-bold text-center">Bajo Stock</Text>
        </Card>
      </View>

      {/* Sección de Alertas (Mock) */}
      <Text className="text-xl font-bold text-primary-dark mb-4 tracking-tight">Atención Requerida</Text>
      
      <Card className="p-4 mb-3 bg-white/50 flex-row items-center">
        <View className="w-2 h-full bg-red-500 rounded-full mr-3 absolute left-0 top-4 bottom-4" />
        <View className="ml-4 flex-1">
          <Text className="text-primary-dark font-bold text-sm">Silla Ejecutiva Ergonómica</Text>
          <Text className="text-brown text-xs mt-1">Sucursal Miguel Hidalgo • Queda 1 unidad</Text>
        </View>
        <Text className="text-red-500 font-bold text-xs bg-red-500/10 px-2 py-1 rounded-md">Crítico</Text>
      </Card>

      <Card className="p-4 mb-3 bg-white/50 flex-row items-center">
        <View className="w-2 h-full bg-yellow-500 rounded-full mr-3 absolute left-0 top-4 bottom-4" />
        <View className="ml-4 flex-1">
          <Text className="text-primary-dark font-bold text-sm">Librero Modular 5 Niveles</Text>
          <Text className="text-brown text-xs mt-1">Showroom San Pedro • Quedan 2 unidades</Text>
        </View>
        <Text className="text-yellow-600 font-bold text-xs bg-yellow-500/10 px-2 py-1 rounded-md">Revisar</Text>
      </Card>

      <View className="h-10" />
    </ScrollView>
  );
}