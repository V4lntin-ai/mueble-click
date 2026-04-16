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

export const CREATE_PRODUCTO = gql`
  mutation CreateProducto($input: CreateProductoInput!) {
    createProducto(input: $input) {
      id_producto
      nombre
      sku
      precio_venta
    }
  }
`;

export const GET_PRODUCTOS_POR_MUEBLERIA = gql`
  query GetProductosPorMuebleria($id_muebleria: Int!) {
    productosPorMuebleria(id_muebleria: $id_muebleria) {
      id_producto
      nombre
      sku
      precio_venta
    }
  }
`;