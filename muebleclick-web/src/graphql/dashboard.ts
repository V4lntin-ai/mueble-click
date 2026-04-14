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
    }
    pedidos {
      id_pedido
      estado_pedido
      fecha_pedido
      total
    }
    productos {
      id_producto
      nombre
      categoria
      precio_venta
    }
  }
`;

export const GET_DASHBOARD_ADMIN = gql`
  query GetDashboardAdmin {
    mueblerias {
      id_muebleria
      nombre_negocio
    }
    usuarios {
      id_usuario
      nombre
      fecha_registro
      activo
      rol {
        nombre
      }
    }
    ventas {
      id_venta
      total_venta
      fecha_venta
      estado_venta
    }
    pedidos {
      id_pedido
      estado_pedido
      total
    }
  }
`;