import { gql } from '@apollo/client';

export const GET_USUARIOS = gql`
  query GetUsuarios {
    usuarios {
      id_usuario
      nombre
      correo
      activo
      fecha_registro
      rol {
        id_rol
        nombre
      }
    }
  }
`;

export const UPDATE_USUARIO = gql`
  mutation UpdateUsuario($input: UpdateUsuarioInput!) {
    updateUsuario(input: $input) {
      id_usuario
      nombre
      correo
      activo
    }
  }
`;

export const DEACTIVATE_USUARIO = gql`
  mutation DeactivateUsuario($id_usuario: Int!) {
    deactivateUsuario(id_usuario: $id_usuario) {
      id_usuario
      activo
    }
  }
`;

export const GET_ROLES = gql`
  query GetRoles {
    roles {
      id_rol
      nombre
    }
  }
`;