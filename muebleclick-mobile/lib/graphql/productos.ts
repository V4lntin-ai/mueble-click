// lib/graphql/productos.ts
import { gql } from '@apollo/client';

export const GET_PRODUCTOS = gql`
  query GetProductos {
    productos {
      id_producto
      nombre
      sku
      precio_venta
      imagen_url
      categoria
    }
  }
`;