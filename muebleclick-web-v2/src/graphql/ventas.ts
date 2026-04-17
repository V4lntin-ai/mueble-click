import { gql } from '@apollo/client';

export const GET_VENTAS = gql`
  query GetVentas {
    ventas {
      id_venta
      fecha_venta
      sub_total
      descuento
      total_venta
      comision
      estado_venta
      cliente {
        usuario { nombre correo }
      }
      metodo_pago { tipo_pago }
      cupon { codigo descuento_porcentaje }
      vendedor {
        usuario { nombre }
        codigo_vendedor
      }
      pedido { id_pedido }
    }
  }
`;

export const GET_DETALLE_VENTA = gql`
  query GetDetalleVenta($id_venta: Int!) {
    detalleVenta(id_venta: $id_venta) {
      id_detalle_venta
      cantidad
      precio_unitario
      subtotal
      producto {
        nombre
        sku
        imagen_url
      }
    }
  }
`;