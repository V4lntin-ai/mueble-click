import { gql } from '@apollo/client';

export const GET_MIS_MUEBLERIAS = gql`
  query GetMisMueblerias {
    misMueblerias {
      id_muebleria
      nombre_negocio
      razon_social
      rfc
      direccion_principal
      telefono
      creado_en
      propietario {
        id_usuario
        usuario { nombre correo }
        verificado
      }
      sucursales {
        id_sucursal
        nombre_sucursal
        activo
      }
    }
  }
`;

export const GET_ALL_MUEBLERIAS = gql`
  query GetAllMueblerias {
    mueblerias {
      id_muebleria
      nombre_negocio
      razon_social
      rfc
      direccion_principal
      telefono
      creado_en
      propietario {
        id_usuario
        usuario { nombre correo }
        verificado
      }
      sucursales {
        id_sucursal
        nombre_sucursal
        activo
      }
    }
  }
`;

export const CREATE_MUEBLERIA = gql`
  mutation CreateMuebleria($input: CreateMuebleriaInput!) {
    createMuebleria(input: $input) {
      id_muebleria
      nombre_negocio
      razon_social
      rfc
      direccion_principal
      telefono
    }
  }
`;

export const UPDATE_MUEBLERIA = gql`
  mutation UpdateMuebleria($input: UpdateMuebleriaInput!) {
    updateMuebleria(input: $input) {
      id_muebleria
      nombre_negocio
      razon_social
      rfc
      direccion_principal
      telefono
    }
  }
`;