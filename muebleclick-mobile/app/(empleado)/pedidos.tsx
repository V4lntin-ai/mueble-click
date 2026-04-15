// app/(empleado)/pedidos.tsx
import { View, Text } from "react-native";

export default function PedidosEnLineaScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-beige">
      <Text className="text-xl font-bold text-primary">Pedidos para esta Sucursal</Text>
    </View>
  );
}