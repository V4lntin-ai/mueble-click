// app/(auth)/login.tsx
import { View, Text } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <View className="flex-1 bg-primary items-center justify-center px-6">
      <View className="mb-10 items-center">
        <Text className="text-4xl font-bold text-beige mb-2">MuebleClick</Text>
        <Text className="text-beige/80 text-lg text-center">Inicia sesión para continuar</Text>
      </View>

      <Card className="w-full">
        <Text className="text-primary-dark font-bold text-xl mb-6 text-center">
          Simulador de Rol
        </Text>
        
        {/* En el futuro aquí irán los Inputs reales de correo y contraseña */}
        
        <Button 
          label="Entrar como Cliente" 
          variant="primary" 
          className="mb-3"
          onPress={() => login('Cliente')} 
        />
        <Button 
          label="Entrar como Empleado (POS)" 
          variant="secondary" 
          className="mb-3"
          onPress={() => login('Empleado')} 
        />
        <Button 
          label="Entrar como Propietario" 
          variant="ghost" 
          onPress={() => login('Propietario')} 
        />
      </Card>
    </View>
  );
}