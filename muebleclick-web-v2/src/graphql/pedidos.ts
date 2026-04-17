import { gql } from '@apollo/client';

export const GET_PEDIDOS = gql`
  query GetPedidos {
    pedidos {
      id_pedido
      fecha_pedido
      tipo_entrega
      estado_pedido
      total
      cliente {
        id_usuario
        usuario { nombre correo }
      }
      direccion {
        calle_numero
        municipio { nombre }
      }
      sucursal_origen {
        nombre_sucursal
      }
    }
  }
`;

export const UPDATE_ESTADO_PEDIDO = gql`
  mutation UpdateEstadoPedido($input: UpdatePedidoInput!) {
    updateEstadoPedido(input: $input) {
      id_pedido
      estado_pedido
    }
  }
`;

export const GET_DETALLE_PEDIDO = gql`
  query GetDetallePedido($id_pedido: Int!) {
    detallePedido(id_pedido: $id_pedido) {
      id_detalle_pedido
      cantidad
      precio_unitario
      subtotal
      producto {
        id_producto
        nombre
        sku
        imagen_url
      }
    }
  }
`;