// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface Rol {
  id_rol: number;
  nombre: string;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  activo?: boolean;
  fecha_registro?: string;
  rol: Rol;
}

export interface AuthUser {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: { nombre: string };
}

// ─── Business Entities ────────────────────────────────────────────────────────
export interface Municipio {
  id_municipio?: number;
  nombre: string;
  estado?: { nombre: string };
}

export interface Sucursal {
  id_sucursal: number;
  nombre_sucursal: string;
  calle_numero?: string;
  telefono?: string;
  horario?: Record<string, string>;
  activo: boolean;
  creado_en?: string;
  municipio?: Municipio;
  muebleria?: { id_muebleria: number; nombre_negocio: string };
}

export interface Muebleria {
  id_muebleria: number;
  nombre_negocio: string;
  razon_social?: string;
  rfc?: string;
  direccion_principal?: string;
  telefono?: string;
  creado_en?: string;
  propietario?: {
    id_usuario: number;
    verificado?: boolean;
    usuario?: { nombre: string; correo: string };
  };
  sucursales?: Sucursal[];
}

export interface Producto {
  id_producto: number;
  sku: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  precio_venta: number;
  peso_kg?: number;
  volumen_m3?: number;
  tipo_producto?: string;
  imagen_url?: string;
  creado_en?: string;
  actualizado_en?: string;
  muebleria?: { id_muebleria: number; nombre_negocio: string };
}

export interface Empleado {
  id_usuario: number;
  puesto?: string;
  fecha_ingreso?: string;
  activo: boolean;
  es_vendedor: boolean;
  codigo_vendedor?: string;
  comision_pct?: number;
  usuario?: { id_usuario: number; nombre: string; correo: string; activo?: boolean };
  sucursal?: {
    id_sucursal: number;
    nombre_sucursal: string;
    muebleria?: { nombre_negocio: string };
  };
}

export interface Inventario {
  id_inventario: number;
  cantidad: number;
  reservado: number;
  stock_min: number;
  stock_max: number;
  ultimo_movimiento?: string;
  producto?: Producto;
  sucursal?: { id_sucursal: number; nombre_sucursal: string };
}

export interface Cliente {
  id_usuario: number;
  usuario?: { nombre: string; correo: string };
}

export interface DireccionEnvio {
  id_direccion?: number;
  calle_numero?: string;
  municipio?: Municipio;
}

export type EstadoPedido = 'Pendiente' | 'Confirmado' | 'Enviado' | 'Entregado' | 'Cancelado';
export type EstadoVenta = 'Completada' | 'Reembolsada' | 'Cancelada';
export type TipoEntrega = 'Envio' | 'Recoleccion';

export interface DetallePedido {
  id_detalle_pedido: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto;
}

export interface Pedido {
  id_pedido: number;
  fecha_pedido: string;
  tipo_entrega?: TipoEntrega;
  estado_pedido: EstadoPedido;
  total: number;
  cliente?: Cliente;
  direccion?: DireccionEnvio;
  sucursal_origen?: { nombre_sucursal: string };
  detalles?: DetallePedido[];
}

export interface MetodoPago {
  id_metodo?: number;
  tipo_pago: string;
}

export interface Cupon {
  id_cupon?: number;
  codigo: string;
  descuento_porcentaje?: number;
}

export interface DetalleVenta {
  id_detalle_venta: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto;
}

export interface Venta {
  id_venta: number;
  fecha_venta: string;
  sub_total?: number;
  descuento?: number;
  total_venta: number;
  comision?: number;
  estado_venta: EstadoVenta;
  cliente?: Cliente;
  metodo_pago?: MetodoPago;
  cupon?: Cupon;
  vendedor?: Empleado;
  pedido?: { id_pedido: number };
  detalles?: DetalleVenta[];
}

export interface Comision {
  id_comision: number;
  monto: number;
  fecha: string;
  estado?: string;
  empleado?: Empleado;
  venta?: { id_venta: number; total_venta: number };
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
export type ColorVariant = 'green' | 'gold' | 'blue' | 'red' | 'orange' | 'purple' | 'gray';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}
