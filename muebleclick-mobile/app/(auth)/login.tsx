// app/(auth)/login.tsx
import { useState } from "react";
import { View, Text, Alert } from "react-native";
import { useMutation } from "@apollo/client";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LOGIN_MUTATION } from "../../lib/graphql/auth";

export default function LoginScreen() {
  const { login } = useAuth();
  
  // Estado local para los inputs
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  // Hook de Apollo para ejecutar la mutación
  const [ejecutarLogin, { loading }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña.");
      return;
    }

    try {
      const response = await ejecutarLogin({
        variables: {
          input: { correo, password }
        }
      });

      const { access_token, usuario } = response.data.login;
      const rolDelBackend = usuario.rol.nombre; 
      
      console.log("Rol exacto recibido de la BD:", rolDelBackend); 

      const rolNormalizado = rolDelBackend.trim().charAt(0).toUpperCase() + rolDelBackend.trim().slice(1).toLowerCase();

      await login(access_token, rolNormalizado as any);
      
    // 👇 ESTA ES LA LLAVE QUE FALTABA
    } catch (error: any) {
      console.error("Error de login:", error);
      Alert.alert("Error de Acceso", "Credenciales inválidas.");
    }
  };

  return (
    <View className="flex-1 bg-primary items-center justify-center px-6">
      <View className="mb-10 items-center">
        <Text className="text-4xl font-bold text-beige mb-2">MuebleClick</Text>
        <Text className="text-beige/80 text-lg text-center">Inicia sesión para continuar</Text>
      </View>

      <Card className="w-full pt-8 pb-6 px-6">
        <Input 
          label="Correo Electrónico" 
          placeholder="usuario@muebleclick.com" 
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />
        
        <Input 
          label="Contraseña" 
          placeholder="••••••••" 
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <View className="mt-6">
          <Button 
            label={loading ? "Iniciando..." : "Ingresar"} 
            variant="primary" 
            onPress={handleLogin}
            disabled={loading}
          />
        </View>
      </Card>
    </View>
  );
}