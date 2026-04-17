import { gql } from '@apollo/client';

export const GET_COMISIONES = gql`
  query GetComisiones {
    comisiones {
      id_comision
      monto
      fecha
      estado
      empleado {
        id_usuario
        codigo_vendedor
        comision_pct
        usuario { nombre correo }
        sucursal { nombre_sucursal }
      }
      venta {
        id_venta
        total_venta
        fecha_venta
      }
    }
  }
`;

export const GET_COMISIONES_POR_EMPLEADO = gql`
  query GetComisionesPorEmpleado($id_empleado: Int!) {
    comisionesPorEmpleado(id_empleado: $id_empleado) {
      id_comision
      monto
      fecha
      estado
      venta {
        id_venta
        total_venta
        fecha_venta
      }
    }
  }
`;
