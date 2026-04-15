// app/(cliente)/_layout.tsx
import { Tabs } from "expo-router";
import { Compass, ShoppingCart, Receipt, User } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { Pressable, View } from "react-native";
import { Badge } from "../../components/ui/Badge";
import { useCartStore } from "../../store/cartStore";

export default function ClienteLayout() {
  const { logout } = useAuth();
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#F5F0E8', // Beige
          borderBottomWidth: 0, // Quitamos el borde para que fluya con el fondo
          elevation: 0, // Sin sombra en Android
          shadowOpacity: 0, // Sin sombra en iOS
        },
        headerTitleStyle: {
          color: '#1B4332',
          fontWeight: '900',
          fontSize: 22,
        },
        headerRight: () => (
          <Pressable onPress={logout} className="mr-4 active:opacity-50">
            <View className="bg-primary/10 px-3 py-1 rounded-full">
              <User color="#2D6A4F" size={20} />
            </View>
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: '#FAF7F2',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#2D6A4F', // Sombra verde oscuro muy sutil
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.05,
          shadowRadius: 15,
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#A0522D', // Acento madera para el cliente
        tabBarInactiveTintColor: '#2D6A4F80', // Verde primary con opacidad
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explorar",
          headerTitle: "MuebleClick", // El logo de la marca en el header
          tabBarIcon: ({ color }) => <Compass size={24} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="carrito"
        options={{
          href: "/(cliente)/carrito", // <-- OBLIGAMOS LA RUTA EXACTA
          title: "Mi Carrito",
          tabBarIcon: ({ color }) => (
            <View>
              <ShoppingCart size={24} color={color} strokeWidth={2.5} />
              {/* Solo mostramos la burbuja roja si hay algo en el carrito */}
              {totalItems > 0 && (
                <View className="absolute -top-1 -right-2 bg-red-500 w-4 h-4 rounded-full items-center justify-center border border-white">
                  <Badge 
                    label={totalItems.toString()} 
                    variant="danger" 
                    className="p-0 border-0 bg-transparent h-full w-full flex items-center justify-center text-[8px] text-white" 
                  />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          href: "/(cliente)/pedidos", // <-- OBLIGAMOS LA RUTA EXACTA
          title: "Mis Pedidos",
          tabBarIcon: ({ color }) => <Receipt size={24} color={color} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}