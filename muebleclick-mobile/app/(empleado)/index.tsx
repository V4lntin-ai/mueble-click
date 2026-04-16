// app/(empleado)/index.tsx
import { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable, Modal, Alert } from "react-native";
import { useQuery, useApolloClient } from "@apollo/client";
import { ShoppingCart, CheckCircle2, Wallet, CreditCard, Store, AlertCircle } from "lucide-react-native";

import { Input } from "../../components/ui/Input";
import { ProductCard } from "../../components/shared/ProductCard";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

import { GET_INVENTARIO_POS } from "../../lib/graphql/inventario";
import { GET_PERFIL_EMPLEADO } from "../../lib/graphql/empleados";
import { CREATE_VENTA, CREATE_DETALLE_VENTA } from "../../lib/graphql/ventas";
import { usePOSStore } from "../../store/posStore";

export default function POSScreen() {
  const client = useApolloClient();
  const { items, addItem, getTotalItems, getTotalPrice, clearCart } = usePOSStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [metodoPago, setMetodoPago] = useState<'Efectivo' | 'Tarjeta'>('Efectivo');
  const [ventaExitosa, setVentaExitosa] = useState(false);
  const [procesando, setProcesando] = useState(false);

  // 1. Obtener perfil (Sin variables, consulta directa)
  const { data: perfilData, loading: loadingPerfil, error: errorPerfil } = useQuery(GET_PERFIL_EMPLEADO);

  // Extraemos los IDs de forma segura
  const idUsuarioActual = perfilData?.miPerfilEmpleado?.id_usuario;
  const idSucursalActual = perfilData?.miPerfilEmpleado?.sucursal?.id_sucursal;
  const nombreSucursalActual = perfilData?.miPerfilEmpleado?.sucursal?.nombre_sucursal;

  // 2. Obtener inventario (SOLO si ya tenemos el idSucursal)
  const { data: invData, loading: loadingInv, error: errorInv, refetch } = useQuery(GET_INVENTARIO_POS, {
    variables: { id_sucursal: idSucursalActual },
    skip: !idSucursalActual, // 🛡️ EVITA EL ERROR 400: No dispara la query si el ID es nulo
    fetchPolicy: 'cache-and-network',
  });

  const handleProcesarPago = async () => {
    if (items.length === 0 || !idUsuarioActual) return;
    setProcesando(true);

    try {
      const { data: ventaRes } = await client.mutate({
        mutation: CREATE_VENTA,
        variables: {
          input: {
            id_metodo_pago: metodoPago === 'Efectivo' ? 1 : 2,
            id_vendedor: idUsuarioActual,
          }
        }
      });

      const idVenta = ventaRes.createVenta.id_venta;

      for (const item of items) {
        await client.mutate({
          mutation: CREATE_DETALLE_VENTA,
          variables: {
            input: {
              id_venta: idVenta,
              id_producto: item.id_producto,
              cantidad: item.cantidad
            }
          }
        });
      }

      setVentaExitosa(true);
      if (refetch) refetch();

      setTimeout(() => {
        clearCart();
        setVentaExitosa(false);
        setModalVisible(false);
      }, 2000);

    } catch (err: any) {
      console.error("Error en el proceso de venta:", err);
      Alert.alert("Error", err.message);
    } finally {
      setProcesando(false);
    }
  };

  // Filtrado local
  const inventarioFiltrado = invData?.inventarioPorSucursal.filter((item: any) => {
    const query = searchQuery.toLowerCase();
    return item.producto.nombre.toLowerCase().includes(query) || 
           item.producto.sku?.toLowerCase().includes(query);
  }) || [];

  // --- MANEJO DE ESTADOS DE CARGA Y ERROR ---
  if (loadingPerfil) {
    return (
      <View className="flex-1 justify-center items-center bg-beige">
        <ActivityIndicator size="large" color="#2D6A4F" />
        <Text className="text-primary mt-4 font-bold uppercase tracking-widest">Sincronizando Perfil...</Text>
      </View>
    );
  }

  if (errorPerfil || (errorInv && !invData)) {
    return (
      <View className="flex-1 justify-center items-center bg-beige px-10">
        <AlertCircle size={48} color="#ef4444" />
        <Text className="text-red-600 font-black text-xl mt-4 text-center">Error de Conexión</Text>
        <Text className="text-brown text-center mt-2">{errorPerfil?.message || errorInv?.message}</Text>
        <Button label="Reintentar" className="mt-6 w-full" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-beige">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Banner de Sucursal Activa */}
        <Card className="bg-primary/10 border-primary/20 p-4 mb-6 flex-row items-center">
          <Store color="#2D6A4F" size={20} className="mr-3" />
          <View>
            <Text className="text-primary-dark font-black text-lg">{nombreSucursalActual || 'Sucursal Desconocida'}</Text>
            <Text className="text-brown text-[10px] font-bold uppercase tracking-tighter">Terminal de Venta Activa</Text>
          </View>
        </Card>

        <Input 
          placeholder="Buscar mueble o SKU..." 
          className="bg-white/60 mb-6" 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {loadingInv && <ActivityIndicator color="#2D6A4F" className="mb-6" />}

        {inventarioFiltrado.map((item: any) => (
          <ProductCard
            key={item.id_inventario}
            name={item.producto.nombre}
            sku={item.producto.sku}
            price={item.producto.precio_venta}
            stock={item.cantidad} 
            imageUrl={item.producto.imagen_url}
            onAddPress={() => addItem(item.producto, item.cantidad)}
          />
        ))}

        <View className="h-40" />
      </ScrollView>

      {/* PANEL DE CARRITO */}
      {items.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-primary-dark px-6 py-5 rounded-t-3xl shadow-2xl flex-row justify-between items-center">
          <View className="flex-row items-center">
             <View className="bg-beige/10 p-3 rounded-full mr-3">
                <ShoppingCart color="#F5F0E8" size={22} />
             </View>
             <View>
                <Text className="text-beige/60 text-[10px] font-bold uppercase">Total a pagar</Text>
                <Text className="text-beige text-2xl font-black">${getTotalPrice().toLocaleString('es-MX')}</Text>
             </View>
          </View>
          <Button label="Cobrar" variant="secondary" className="px-8 py-3" onPress={() => setModalVisible(true)} />
        </View>
      )}

      {/* MODAL DE COBRO */}
      <Modal animationType="slide" transparent visible={isModalVisible}>
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-beige w-full rounded-t-[40px] p-8 shadow-neo-inset">
            {!ventaExitosa ? (
              <>
                <View className="flex-row justify-between items-center mb-8">
                  <Text className="text-2xl font-black text-primary-dark">Finalizar Venta</Text>
                  <Pressable onPress={() => setModalVisible(false)} className="bg-white/80 p-2 rounded-full shadow-sm">
                    <Text className="text-primary font-bold px-1">✕</Text>
                  </Pressable>
                </View>

                <View className="items-center mb-10">
                   <Text className="text-brown font-bold text-xs uppercase tracking-widest mb-1">Monto Total</Text>
                   <Text className="text-6xl font-black text-primary">${getTotalPrice().toLocaleString('es-MX')}</Text>
                </View>

                <View className="flex-row space-x-4 mb-10">
                  <Pressable 
                    onPress={() => setMetodoPago('Efectivo')} 
                    className={`flex-1 p-6 rounded-2xl border-2 items-center ${metodoPago === 'Efectivo' ? 'bg-primary border-primary' : 'bg-white/40 border-transparent'}`}
                  >
                    <Wallet color={metodoPago === 'Efectivo' ? '#F5F0E8' : '#2D6A4F'} size={32} />
                    <Text className={`font-black mt-3 ${metodoPago === 'Efectivo' ? 'text-beige' : 'text-primary'}`}>EFECTIVO</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => setMetodoPago('Tarjeta')} 
                    className={`flex-1 p-6 rounded-2xl border-2 items-center ${metodoPago === 'Tarjeta' ? 'bg-primary border-primary' : 'bg-white/40 border-transparent'}`}
                  >
                    <CreditCard color={metodoPago === 'Tarjeta' ? '#F5F0E8' : '#2D6A4F'} size={32} />
                    <Text className={`font-black mt-3 ${metodoPago === 'Tarjeta' ? 'text-beige' : 'text-primary'}`}>TARJETA</Text>
                  </Pressable>
                </View>

                <Button 
                  label={procesando ? "Sincronizando..." : `Confirmar Pago (${getTotalItems()} ítems)`} 
                  onPress={handleProcesarPago} 
                  disabled={procesando} 
                  className="py-5 shadow-neo" 
                />
              </>
            ) : (
              <View className="items-center py-12">
                <View className="bg-green-100 p-6 rounded-full mb-6">
                  <CheckCircle2 size={80} color="#2D6A4F" />
                </View>
                <Text className="text-3xl font-black text-primary-dark text-center">¡Venta Exitosa!</Text>
                <Text className="text-brown font-medium mt-2 text-center px-10">
                  El inventario de {nombreSucursalActual} ha sido actualizado correctamente.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}