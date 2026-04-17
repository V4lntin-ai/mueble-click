import { gql } from '@apollo/client';

export const GET_PRODUCTOS = gql`
  query GetProductos {
    productos {
      id_producto
      sku
      nombre
      descripcion
      categoria
      precio_venta
      peso_kg
      tipo_producto
      imagen_url
      muebleria {
        id_muebleria
        nombre_negocio
      }
    }
  }
`;

export const GET_PRODUCTOS_POR_MUEBLERIA = gql`
  query GetProductosPorMuebleria($id_muebleria: Int!) {
    productosPorMuebleria(id_muebleria: $id_muebleria) {
      id_producto
      sku
      nombre
      descripcion
      categoria
      precio_venta
      peso_kg
      tipo_producto
      imagen_url
      muebleria {
        id_muebleria
        nombre_negocio
      }
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
      categoria
    }
  }
`;

export const UPDATE_PRODUCTO = gql`
  mutation UpdateProducto($input: UpdateProductoInput!) {
    updateProducto(input: $input) {
      id_producto
      nombre
      sku
      precio_venta
      categoria
    }
  }
`;

export const REMOVE_PRODUCTO = gql`
  mutation RemoveProducto($id_producto: Int!) {
    removeProducto(id_producto: $id_producto)
  }
`;