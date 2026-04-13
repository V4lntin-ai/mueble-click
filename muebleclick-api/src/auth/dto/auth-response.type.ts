import { ObjectType, Field } from '@nestjs/graphql';
import { Usuario } from '../../modules/usuarios/entities/usuario.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token!: string;

  @Field()
  refresh_token!: string;

  @Field(() => Usuario)
  usuario!: Usuario;
}