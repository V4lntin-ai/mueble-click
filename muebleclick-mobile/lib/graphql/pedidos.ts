// lib/graphql/pedidos.ts
import { gql } from '@apollo/client';

// Nota Arquitectónica: Basado en tu schema.gql para CreatePedidoInput
export const CREATE_PEDIDO = gql`
  mutation CreatePedido($input: CreatePedidoInput!) {
    createPedido(input: $input) {
      id_pedido
      estado_pedido
      total
      fecha_pedido
    }
  }
`;

// Si tu backend requiere insertar los detalles uno por uno después de crear el pedido principal:
export const CREATE_DETALLE_PEDIDO = gql`
  mutation CreateDetallePedido($input: CreateDetallePedidoInput!) {
    createDetallePedido(input: $input) {
      id_detalle_pedido
      subtotal
    }
  }
`;