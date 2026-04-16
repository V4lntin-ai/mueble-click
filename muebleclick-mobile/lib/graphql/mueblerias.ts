// lib/graphql/mueblerias.ts
import { gql } from '@apollo/client';

export const GET_MIS_MUEBLERIAS = gql`
  query GetMisMueblerias {
    misMueblerias {
      id_muebleria
      nombre_negocio
    }
  }
`;