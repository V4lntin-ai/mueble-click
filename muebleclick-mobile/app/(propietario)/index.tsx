// app/(propietario)/index.tsx
import { View, Text } from "react-native";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function PropietarioDashboard() {
  const { logout } = useAuth();
  
  return (
    <View className="flex-1 items-center justify-center bg-beige px-6">
      <Text className="text-3xl font-bold text-primary mb-4">POS: Punto de Venta</Text>
      <Text className="text-brown mb-8 text-center">Bienvenido, propietario. Aquí va el inventario y carrito.</Text>
      <Button label="Cerrar Sesión" variant="secondary" onPress={logout} />
    </View>
  );
}