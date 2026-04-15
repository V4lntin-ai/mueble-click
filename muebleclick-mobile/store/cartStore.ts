// store/cartStore.ts
import { create } from 'zustand';

export interface CartItem {
  id_producto: number;
  nombre: string;
  precio_venta: number;
  imagen_url: string;
  cantidad: number;
}

interface CartState {
  items: CartItem[];
  addItem: (producto: any) => void;
  decreaseItem: (id_producto: number) => void; 
  removeItem: (id_producto: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (producto) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id_producto === producto.id_producto);
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
          imagen_url: producto.imagen_url,
          cantidad: 1
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
            item.id_producto === id_producto 
              ? { ...item, cantidad: item.cantidad - 1 }
              : item
          )
        };
      }
      // Si la cantidad es 1 y lo resta, lo eliminamos
      return {
        items: state.items.filter(item => item.id_producto !== id_producto)
      };
    });
  },

  removeItem: (id_producto) => {
    set((state) => ({
      items: state.items.filter(item => item.id_producto !== id_producto)
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => get().items.reduce((total, item) => total + item.cantidad, 0),
  getTotalPrice: () => get().items.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0)
}));