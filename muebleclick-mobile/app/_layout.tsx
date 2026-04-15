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

    // ¿En qué grupo estamos intentando entrar?
    const inAuthGroup = segments[0] === '(auth)';

    if (!role && !inAuthGroup) {
      // Si no hay rol y no está en auth, mándalo al login
      router.replace('/(auth)/login');
    } else if (role) {
      // Si ya tiene rol, envíalo a su stack específico
      if (role === 'Cliente') router.replace('/(cliente)');
      else if (role === 'Empleado') router.replace('/(empleado)');
      else if (role === 'Propietario') router.replace('/(propietario)');
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