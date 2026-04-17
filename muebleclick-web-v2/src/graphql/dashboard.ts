import { gql } from '@apollo/client';

export const GET_DASHBOARD_PROPIETARIO = gql`
  query GetDashboardPropietario {
    misMueblerias {
      id_muebleria
      nombre_negocio
      sucursales {
        id_sucursal
        nombre_sucursal
        activo
      }
    }
    ventas {
      id_venta
      total_venta
      fecha_venta
      estado_venta
      comision
      cliente { usuario { nombre } }
      vendedor { usuario { nombre } codigo_vendedor }
    }
    pedidos {
      id_pedido
      estado_pedido
      fecha_pedido
      total
      tipo_entrega
      cliente { usuario { nombre correo } }
    }
    productos {
      id_producto
      nombre
      categoria
      precio_venta
      tipo_producto
    }
    empleados {
      id_usuario
      puesto
      activo
      es_vendedor
      usuario { nombre }
    }
  }
`;

export const GET_DASHBOARD_ADMIN = gql`
  query GetDashboardAdmin {
    mueblerias {
      id_muebleria
      nombre_negocio
      sucursales { id_sucursal activo }
    }
    usuarios {
      id_usuario
      nombre
      fecha_registro
      activo
      rol { nombre }
    }
    ventas {
      id_venta
      total_venta
      fecha_venta
      estado_venta
      comision
    }
    pedidos {
      id_pedido
      estado_pedido
      total
      fecha_pedido
    }
    empleados {
      id_usuario
      activo
      es_vendedor
    }
  }
`;
