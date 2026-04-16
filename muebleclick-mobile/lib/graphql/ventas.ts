// lib/graphql/ventas.ts
import { gql } from '@apollo/client';

export const CREATE_VENTA = gql`
  mutation CreateVenta($input: CreateVentaInput!) {
    createVenta(input: $input) {
      id_venta
      total_venta
    }
  }
`;

export const CREATE_DETALLE_VENTA = gql`
  mutation CreateDetalleVenta($input: CreateDetalleVentaInput!) {
    createDetalleVenta(input: $input) {
      id_detalle_venta
      subtotal
    }
  }
`;