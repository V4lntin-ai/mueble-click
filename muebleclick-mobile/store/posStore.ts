// store/posStore.ts
import { create } from 'zustand';
import { Alert } from 'react-native';

export interface POSItem {
  id_producto: number;
  nombre: string;
  precio_venta: number;
  cantidad: number;
  stock_disponible: number; // Dato crucial para el vendedor
}

interface POSState {
  items: POSItem[];
  addItem: (producto: any, stockFisico: number) => void;
  decreaseItem: (id_producto: number) => void;
  removeItem: (id_producto: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const usePOSStore = create<POSState>((set, get) => ({
  items: [],
  
  addItem: (producto, stockFisico) => {
    // 1. Validaciones iniciales (fuera del set)
    if (stockFisico <= 0) {
      Alert.alert("Agotado", "No hay stock físico de este producto en la sucursal.");
      return;
    }

    // 2. Revisamos el estado actual
    const currentItems = get().items;
    const existingItem = currentItems.find(item => item.id_producto === producto.id_producto);

    // 3. Validamos límite de stock ANTES de intentar actualizar
    if (existingItem && existingItem.cantidad >= stockFisico) {
      Alert.alert("Límite de Stock", `Solo hay ${stockFisico} unidades disponibles.`);
      return; // Cortamos la ejecución para no sumar
    }

    // 4. Si todo está bien, actualizamos el estado de forma "pura"
    set((state) => {
      if (existingItem) {
        return {
          items: state.items.map(item => 
            item.id_producto === producto.id_producto 
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        };
      }
      
      return {
        items: [...state.items, {
          id_producto: producto.id_producto,
          nombre: producto.nombre,
          precio_venta: producto.precio_venta,
          cantidad: 1,
          stock_disponible: stockFisico
        }]
      };
    });
  },

  decreaseItem: (id_producto) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id_producto === id_producto);
      if (existingItem && existingItem.cantidad > 1) {
        return {
          items: state.items.map(item => 
            item.id_producto === id_producto ? { ...item, cantidad: item.cantidad - 1 } : item
          )
        };
      }
      return { items: state.items.filter(item => item.id_producto !== id_producto) };
    });
  },

  removeItem: (id_producto) => set((state) => ({
    items: state.items.filter(item => item.id_producto !== id_producto)
  })),

  clearCart: () => set({ items: [] }),

  getTotalItems: () => get().items.reduce((total, item) => total + item.cantidad, 0),
  getTotalPrice: () => get().items.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0)
}));