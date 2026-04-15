import { gql } from '@apollo/client';

export const GET_INVENTARIO_POR_SUCURSAL = gql`
  query GetInventarioPorSucursal($id_sucursal: Int!) {
    inventarioPorSucursal(id_sucursal: $id_sucursal) {
      id_inventario
      cantidad
      reservado
      stock_min
      stock_max
      ultimo_movimiento
      producto {
        id_producto
        nombre
        sku
        categoria
        precio_venta
        imagen_url
      }
    }
  }
`;

export const GET_STOCK_CRITICO = gql`
  query GetStockCritico($id_sucursal: Int!) {
    stockCritico(id_sucursal: $id_sucursal) {
      id_inventario
      cantidad
      stock_min
      producto {
        nombre
        sku
      }
    }
  }
`;

export const CREATE_INVENTARIO = gql`
  mutation CreateInventario($input: CreateInventarioInput!) {
    createInventario(input: $input) {
      id_inventario
      cantidad
      stock_min
      stock_max
    }
  }
`;

export const UPDATE_INVENTARIO = gql`
  mutation UpdateInventario($input: UpdateInventarioInput!) {
    updateInventario(input: $input) {
      id_inventario
      cantidad
      stock_min
      stock_max
    }
  }
`;

export const CREATE_MOVIMIENTO_INVENTARIO = gql`
  mutation CreateMovimientoInventario($input: CreateMovimientoInventarioInput!) {
    createMovimientoInventario(input: $input) {
      id_movimiento
      tipo
      cantidad
      fecha
    }
  }
`;