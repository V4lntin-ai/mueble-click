// app/_layout.tsx
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator, LogBox } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import "./global.css";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../lib/apollo";

LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
  '"shadow*" style props are deprecated',
]);

function RootLayoutNav() {
  const { role, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // ¿En qué grupo estamos actualmente?
    const inAuthGroup = segments[0] === '(auth)';
    const currentGroup = segments[0];

    if (!role && !inAuthGroup) {
      // Si no hay rol y no está en login, mándalo al login
      router.replace('/(auth)/login');
    } else if (role) {
      // MAGIA AQUÍ: Solo redirige si el usuario está FUERA de su grupo permitido.
      // Así respetamos la navegación interna (las pestañas).
      if (role === 'Cliente' && currentGroup !== '(cliente)') {
        router.replace('/(cliente)');
      } 
      else if (role === 'Empleado' && currentGroup !== '(empleado)') {
        router.replace('/(empleado)');
      } 
      else if (role === 'Propietario' && currentGroup !== '(propietario)') {
        router.replace('/(propietario)');
      }
    }
  }, [role, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-beige">
        <ActivityIndicator size="large" color="#2D6A4F" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ApolloProvider>
  );
}