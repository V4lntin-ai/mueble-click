// app/(propietario)/equipo.tsx
import { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { useQuery } from "@apollo/client";
import { Store, MapPin, UserCheck, UserX, UserPlus, Mail } from "lucide-react-native";

import { GET_MIS_MUEBLERIAS } from "../../lib/graphql/mueblerias";
import { GET_SUCURSALES_POR_MUEBLERIA } from "../../lib/graphql/sucursales";
import { GET_EMPLEADOS_POR_SUCURSAL } from "../../lib/graphql/empleados";
import { Card } from "../../components/ui/Card";

export default function EquipoScreen() {
  // Estados de navegación jerárquica
  const [muebleriaActiva, setMuebleriaActiva] = useState<number | null>(null);
  const [sucursalActiva, setSucursalActiva] = useState<number | null>(null);

  // 1. Traemos los negocios
  const { data: dataMueblerias, loading: cargandoMueblerias } = useQuery(GET_MIS_MUEBLERIAS);
  
  // 2. Traemos sucursales (Solo si hay mueblería activa)
  const { data: dataSucursales, loading: cargandoSucursales } = useQuery(GET_SUCURSALES_POR_MUEBLERIA, {
    variables: { id_muebleria: muebleriaActiva },
    skip: !muebleriaActiva,
  });

  // 3. Traemos empleados (Solo si hay sucursal activa)
  const { data: dataEmpleados, loading: cargandoEmpleados } = useQuery(GET_EMPLEADOS_POR_SUCURSAL, {
    variables: { id_sucursal: sucursalActiva },
    skip: !sucursalActiva,
    fetchPolicy: 'cache-and-network'
  });

  // Auto-seleccionar primer negocio
  useEffect(() => {
    if (dataMueblerias?.misMueblerias?.length > 0 && !muebleriaActiva) {
      setMuebleriaActiva(dataMueblerias.misMueblerias[0].id_muebleria);
    }
  }, [dataMueblerias]);

  // Auto-seleccionar primera sucursal cuando cambia el negocio
  useEffect(() => {
    if (dataSucursales?.sucursalesPorMuebleria?.length > 0) {
      setSucursalActiva(dataSucursales.sucursalesPorMuebleria[0].id_sucursal);
    } else {
      setSucursalActiva(null);
    }
  }, [dataSucursales]);

  return (
    <View className="flex-1 bg-beige">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-black text-primary-dark tracking-tight">Mi Equipo</Text>
          <Pressable className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
            <UserPlus color="#2D6A4F" size={20} />
          </Pressable>
        </View>

        {/* NIVEL 1: SELECTOR DE MUEBLERÍA */}
        {cargandoMueblerias ? <ActivityIndicator color="#2D6A4F" className="mb-4 self-start" /> : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3 h-12">
            {dataMueblerias?.misMueblerias?.map((negocio: any) => (
              <Pressable
                key={negocio.id_muebleria}
                onPress={() => setMuebleriaActiva(negocio.id_muebleria)}
                className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
                  muebleriaActiva === negocio.id_muebleria ? 'bg-primary border-primary' : 'bg-white/50 border-primary/20'
                }`}
              >
                <Store color={muebleriaActiva === negocio.id_muebleria ? '#F5F0E8' : '#2D6A4F'} size={16} className="mr-2" />
                <Text className={`font-bold text-sm ${muebleriaActiva === negocio.id_muebleria ? 'text-beige' : 'text-primary'}`}>
                  {negocio.nombre_negocio}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* NIVEL 2: SELECTOR DE SUCURSAL */}
        {cargandoSucursales && <ActivityIndicator color="#A0522D" className="mb-4 self-start" />}
        {!cargandoSucursales && dataSucursales?.sucursalesPorMuebleria && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 h-10">
            {dataSucursales.sucursalesPorMuebleria.map((sucursal: any) => (
              <Pressable
                key={sucursal.id_sucursal}
                onPress={() => setSucursalActiva(sucursal.id_sucursal)}
                className={`flex-row items-center px-3 py-1.5 rounded-full mr-2 border ${
                  sucursalActiva === sucursal.id_sucursal ? 'bg-brown border-brown' : 'bg-transparent border-brown/30'
                }`}
              >
                <MapPin color={sucursalActiva === sucursal.id_sucursal ? '#F5F0E8' : '#A0522D'} size={14} className="mr-1" />
                <Text className={`font-bold text-xs ${sucursalActiva === sucursal.id_sucursal ? 'text-beige' : 'text-brown'}`}>
                  {sucursal.nombre_sucursal}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* NIVEL 3: LISTA DE EMPLEADOS */}
        <Text className="text-brown font-medium mb-3">
          {dataEmpleados?.empleadosPorSucursal?.length || 0} miembros en esta ubicación
        </Text>

        {cargandoEmpleados && <ActivityIndicator size="large" color="#2D6A4F" className="mt-5" />}

        {!cargandoEmpleados && dataEmpleados?.empleadosPorSucursal.map((empleado: any) => (
          <Card key={empleado.id_usuario} className="p-4 mb-3 bg-white/60 flex-row items-center">
            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${empleado.activo ? 'bg-primary/10' : 'bg-red-500/10'}`}>
              {empleado.activo ? <UserCheck color="#2D6A4F" size={24} /> : <UserX color="#ef4444" size={24} />}
            </View>
            <View className="flex-1">
              <Text className="text-primary-dark font-black text-base">{empleado.usuario.nombre}</Text>
              <Text className="text-primary font-bold text-xs mb-1">{empleado.puesto} {empleado.es_vendedor && '• Vendedor'}</Text>
              <View className="flex-row items-center">
                <Mail color="#A0522D" size={12} className="mr-1" />
                <Text className="text-brown/80 text-xs">{empleado.usuario.correo}</Text>
              </View>
            </View>
            <View>
              {empleado.activo ? (
                <View className="bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                  <Text className="text-green-600 font-bold text-[10px] uppercase">Activo</Text>
                </View>
              ) : (
                <View className="bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">
                  <Text className="text-red-600 font-bold text-[10px] uppercase">Baja</Text>
                </View>
              )}
            </View>
          </Card>
        ))}

        {/* Estado vacío por si una sucursal no tiene empleados */}
        {!cargandoEmpleados && dataEmpleados?.empleadosPorSucursal?.length === 0 && (
          <View className="items-center py-10 bg-white/40 rounded-2xl border-0 shadow-neo-inset mt-4">
             <Text className="text-brown/60 text-base font-medium">No hay empleados registrados aquí.</Text>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}