// app/(propietario)/_layout.tsx
import { Tabs } from "expo-router";
import { LayoutDashboard, PackageSearch, Users, LogOut } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { Pressable, View } from "react-native";

export default function PropietarioLayout() {
  const { logout } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#F5F0E8', // Beige
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: { color: '#1B4332', fontWeight: '900', fontSize: 22 },
        headerRight: () => (
          <Pressable onPress={logout} className="mr-4 active:opacity-50">
            <View className="bg-red-500/10 px-3 py-1 rounded-full flex-row items-center">
              <LogOut color="#ef4444" size={16} className="mr-1" />
            </View>
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: '#FAF7F2',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#2D6A4F',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.05,
          shadowRadius: 15,
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#A0522D', // Acento madera
        tabBarInactiveTintColor: '#2D6A4F80',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerTitle: "MuebleClick CEO",
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="inventario"
        options={{
          title: "Inventario",
          tabBarIcon: ({ color }) => <PackageSearch size={24} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="equipo"
        options={{
          title: "Equipo",
          tabBarIcon: ({ color }) => <Users size={24} color={color} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}