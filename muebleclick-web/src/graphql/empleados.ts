import { gql } from '@apollo/client';

export const GET_EMPLEADOS = gql`
  query GetEmpleados {
    empleados {
      id_usuario
      puesto
      fecha_ingreso
      activo
      es_vendedor
      codigo_vendedor
      comision_pct
      usuario {
        id_usuario
        nombre
        correo
        activo
      }
      sucursal {
        id_sucursal
        nombre_sucursal
        muebleria {
          nombre_negocio
        }
      }
    }
  }
`;

export const GET_EMPLEADOS_POR_SUCURSAL = gql`
  query GetEmpleadosPorSucursal($id_sucursal: Int!) {
    empleadosPorSucursal(id_sucursal: $id_sucursal) {
      id_usuario
      puesto
      fecha_ingreso
      activo
      es_vendedor
      codigo_vendedor
      comision_pct
      usuario {
        id_usuario
        nombre
        correo
      }
      sucursal {
        id_sucursal
        nombre_sucursal
      }
    }
  }
`;

export const CREATE_EMPLEADO = gql`
  mutation CreateEmpleado($input: CreateEmpleadoInput!) {
    createEmpleado(input: $input) {
      id_usuario
      puesto
      es_vendedor
      comision_pct
    }
  }
`;

export const UPDATE_EMPLEADO = gql`
  mutation UpdateEmpleado($input: UpdateEmpleadoInput!) {
    updateEmpleado(input: $input) {
      id_usuario
      puesto
      es_vendedor
      comision_pct
      activo
    }
  }
`;

export const TOGGLE_ACTIVO_EMPLEADO = gql`
  mutation ToggleActivoEmpleado($id_usuario: Int!) {
    toggleActivoEmpleado(id_usuario: $id_usuario) {
      id_usuario
      activo
    }
  }
`;