import { gql } from '@apollo/client';

export const GET_SUCURSALES_POR_MUEBLERIA = gql`
  query GetSucursalesPorMuebleria($id_muebleria: Int!) {
    sucursalesPorMuebleria(id_muebleria: $id_muebleria) {
      id_sucursal
      nombre_sucursal
    }
  }
`;