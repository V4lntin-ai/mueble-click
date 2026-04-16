import { gql } from '@apollo/client';

export const GET_EMPLEADOS_POR_SUCURSAL = gql`
  query GetEmpleadosPorSucursal($id_sucursal: Int!) {
    empleadosPorSucursal(id_sucursal: $id_sucursal) {
      id_usuario
      puesto
      es_vendedor
      activo
      usuario {
        nombre
        correo
      }
    }
  }
`;

export const GET_PERFIL_EMPLEADO = gql`
  query GetPerfilEmpleado {
    miPerfilEmpleado {
      id_usuario
      # Cambiamos id_sucursal por el objeto sucursal para ser más precisos con tu schema
      sucursal {
        id_sucursal
        nombre_sucursal
      }
    }
  }
`;