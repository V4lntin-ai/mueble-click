// lib/graphql/inventario.ts
import { gql } from '@apollo/client';

export const GET_INVENTARIO_POS = gql`
  query GetInventarioPOS($id_sucursal: Int!) {
    inventarioPorSucursal(id_sucursal: $id_sucursal) {
      id_inventario
      cantidad
      producto {
        id_producto
        nombre
        sku
        precio_venta
        imagen_url
      }
    }
  }
`;