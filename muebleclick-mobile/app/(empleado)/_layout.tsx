// app/(empleado)/_layout.tsx
import { Tabs } from "expo-router";
import { Store, Package, Archive, Wallet } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { Pressable, View } from "react-native";

export default function EmpleadoLayout() {
  const { logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: true, // Mostramos el header nativo superior
        headerStyle: {
          backgroundColor: '#F5F0E8', // Nuestro color 'beige'
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.5)',
        },
        headerTitleStyle: {
          color: '#1B4332', // 'primary-dark'
          fontWeight: 'bold',
        },
        // Botón de salir en el header para todas las vistas del empleado
        headerRight: () => (
          <Pressable onPress={logout} className="mr-4 active:opacity-50">
            <View className="bg-brown/10 px-3 py-1 rounded-full">
              <Store color="#A0522D" size={20} />
            </View>
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: '#FAF7F2', // surface-light
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#A0522D', // Sombra suave neomórfica
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#2D6A4F', // primary
        tabBarInactiveTintColor: '#A0522D', // brown con opacidad nativa
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "POS",
          tabBarIcon: ({ color }) => <Store size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventario"
        options={{
          title: "Inventario",
          tabBarIcon: ({ color }) => <Archive size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mis-ventas"
        options={{
          title: "Mis Ventas",
          tabBarIcon: ({ color }) => <Wallet size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}