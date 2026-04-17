import { gql } from '@apollo/client';

export const GET_SUCURSALES = gql`
  query GetSucursales {
    sucursales {
      id_sucursal
      nombre_sucursal
      calle_numero
      telefono
      horario
      activo
      creado_en
      municipio {
        nombre
        estado { nombre }
      }
      muebleria {
        id_muebleria
        nombre_negocio
      }
    }
  }
`;

export const GET_SUCURSALES_POR_MUEBLERIA = gql`
  query GetSucursalesPorMuebleria($id_muebleria: Int!) {
    sucursalesPorMuebleria(id_muebleria: $id_muebleria) {
      id_sucursal
      nombre_sucursal
      activo
    }
  }
`;

export const CREATE_SUCURSAL = gql`
  mutation CreateSucursal($input: CreateSucursalInput!) {
    createSucursal(input: $input) {
      id_sucursal
      nombre_sucursal
      activo
    }
  }
`;

export const UPDATE_SUCURSAL = gql`
  mutation UpdateSucursal($input: UpdateSucursalInput!) {
    updateSucursal(input: $input) {
      id_sucursal
      nombre_sucursal
      activo
    }
  }
`;

export const TOGGLE_ACTIVO_SUCURSAL = gql`
  mutation ToggleActivoSucursal($id_sucursal: Int!) {
    toggleActivoSucursal(id_sucursal: $id_sucursal) {
      id_sucursal
      activo
    }
  }
`;