// app/(propietario)/inventario.tsx
import { useState, useEffect } from "react";
import { View, Text, ScrollView, Modal, Pressable, ActivityIndicator, Alert } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { Plus, Edit3, Trash2, Package, Store } from "lucide-react-native";

import { GET_PRODUCTOS_POR_MUEBLERIA, CREATE_PRODUCTO } from "../../lib/graphql/productos";
import { GET_MIS_MUEBLERIAS } from "../../lib/graphql/mueblerias"; 
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function InventarioGlobalScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  
  // El filtro global de la pantalla
  const [muebleriaActiva, setMuebleriaActiva] = useState<number | null>(null);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '', sku: '', precio_venta: '', categoria: 'Sala'
  });

  // 1. Traemos las mueblerías de la dueña
  const { data: dataMueblerias, loading: cargandoMueblerias } = useQuery(GET_MIS_MUEBLERIAS);
  
  // 2. Traemos SOLO los productos de la mueblería seleccionada (Hacemos skip si aún no hay una activa)
  const { data: dataProductos, loading: cargandoProductos, refetch } = useQuery(GET_PRODUCTOS_POR_MUEBLERIA, {
    variables: { id_muebleria: muebleriaActiva },
    skip: !muebleriaActiva, 
    fetchPolicy: 'cache-and-network'
  });
  
  // Autoseleccionar la primera mueblería al entrar
  useEffect(() => {
    if (dataMueblerias?.misMueblerias?.length > 0 && !muebleriaActiva) {
      setMuebleriaActiva(dataMueblerias.misMueblerias[0].id_muebleria);
    }
  }, [dataMueblerias]);

  const [crearProducto, { loading: guardando }] = useMutation(CREATE_PRODUCTO, {
    onCompleted: () => {
      setModalVisible(false);
      setNuevoProducto({ nombre: '', sku: '', precio_venta: '', categoria: 'Sala' });
      refetch();
      Alert.alert("Éxito", "Producto registrado correctamente.");
    },
    onError: (err) => Alert.alert("Error del servidor", err.message)
  });

  const handleGuardar = () => {
    if (!muebleriaActiva || !nuevoProducto.nombre || !nuevoProducto.precio_venta) {
      Alert.alert("Error", "Faltan datos obligatorios.");
      return;
    }
    crearProducto({
      variables: {
        input: {
          id_muebleria: muebleriaActiva, // Usamos la mueblería global seleccionada
          nombre: nuevoProducto.nombre,
          sku: nuevoProducto.sku,
          precio_venta: parseFloat(nuevoProducto.precio_venta),
          categoria: nuevoProducto.categoria,
          descripcion: "Descripción pendiente",
          unidad_medida: "pieza",
          peso_kg: 10, volumen_m3: 0.5, tipo_producto: "producto_final"
        }
      }
    });
  };

  return (
    <View className="flex-1 bg-beige">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-black text-primary-dark tracking-tight">Catálogo Global</Text>
          <Pressable 
            onPress={() => setModalVisible(true)}
            className="w-12 h-12 bg-primary rounded-full items-center justify-center shadow-neo active:opacity-70"
          >
            <Plus color="#F5F0E8" size={24} />
          </Pressable>
        </View>

        {/* SELECTOR DE MUEBLERÍA GLOBAL */}
        {cargandoMueblerias ? <ActivityIndicator color="#2D6A4F" className="mb-4 self-start" /> : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 h-12">
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

        <Text className="text-brown font-medium mb-4">
          {dataProductos?.productosPorMuebleria?.length || 0} productos en esta mueblería
        </Text>

        {cargandoProductos && <ActivityIndicator size="large" color="#2D6A4F" className="mt-5" />}

        {/* LISTA FILTRADA */}
        {!cargandoProductos && dataProductos?.productosPorMuebleria.map((item: any) => (
          <Card key={item.id_producto} className="flex-row items-center p-3 mb-3 bg-white/60">
            <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center mr-3">
              <Package color="#2D6A4F" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-primary-dark font-bold text-sm" numberOfLines={1}>{item.nombre}</Text>
              <Text className="text-brown/70 text-xs font-bold mb-1">SKU: {item.sku || 'N/A'}</Text>
              <Text className="text-primary font-black">${item.precio_venta.toLocaleString('es-MX')}</Text>
            </View>
            <View className="flex-row space-x-2">
              <Pressable className="p-2"><Edit3 color="#A0522D" size={18} /></Pressable>
              <Pressable className="p-2"><Trash2 color="#ef4444" size={18} /></Pressable>
            </View>
          </Card>
        ))}
        <View className="h-20" />
      </ScrollView>

      {/* MODAL SIMPLIFICADO */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-beige w-full h-[70%] rounded-t-3xl p-6 shadow-neo-inset">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-primary-dark">Nuevo Producto</Text>
              <Pressable onPress={() => setModalVisible(false)} className="p-2 bg-white/50 rounded-full">
                <Text className="text-primary font-bold">X</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Le recordamos al usuario en dónde está guardando */}
              <View className="bg-primary/10 p-3 rounded-xl mb-6 flex-row items-center">
                <Store color="#2D6A4F" size={18} className="mr-2" />
                <Text className="text-primary-dark font-bold flex-1">
                  Se agregará a: {dataMueblerias?.misMueblerias?.find((m: any) => m.id_muebleria === muebleriaActiva)?.nombre_negocio}
                </Text>
              </View>

              <Text className="text-brown font-bold text-sm mb-2 ml-1">Nombre del Mueble</Text>
              <Input placeholder="Ej. Sofá Minimalista" value={nuevoProducto.nombre} onChangeText={(t) => setNuevoProducto({...nuevoProducto, nombre: t})} className="bg-white/70 mb-4" />

              <Text className="text-brown font-bold text-sm mb-2 ml-1">Código SKU</Text>
              <Input placeholder="Ej. SOF-MIN-003" value={nuevoProducto.sku} onChangeText={(t) => setNuevoProducto({...nuevoProducto, sku: t})} className="bg-white/70 mb-4" autoCapitalize="characters" />

              <View className="flex-row space-x-4 mb-8">
                <View className="flex-1">
                  <Text className="text-brown font-bold text-sm mb-2 ml-1">Precio ($)</Text>
                  <Input placeholder="0.00" value={nuevoProducto.precio_venta} onChangeText={(t) => setNuevoProducto({...nuevoProducto, precio_venta: t})} keyboardType="numeric" className="bg-white/70" />
                </View>
                <View className="flex-1">
                  <Text className="text-brown font-bold text-sm mb-2 ml-1">Categoría</Text>
                  <Input placeholder="Ej. Sala" value={nuevoProducto.categoria} onChangeText={(t) => setNuevoProducto({...nuevoProducto, categoria: t})} className="bg-white/70" />
                </View>
              </View>

              <Button label={guardando ? "Guardando..." : "Guardar Producto"} onPress={handleGuardar} disabled={guardando} className="py-4 shadow-neo" />
              <View className="h-10" />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}