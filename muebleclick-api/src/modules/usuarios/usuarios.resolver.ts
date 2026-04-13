import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioInput } from './dto/create-usuario.input';
import { UpdateUsuarioInput } from './dto/update-usuario.input';

@Resolver(() => Usuario)
export class UsuariosResolver {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Query(() => [Usuario], { name: 'usuarios' })
  findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Query(() => Usuario, { name: 'usuario' })
  findOne(
    @Args('id_usuario', { type: () => Int }) id_usuario: number,
  ): Promise<Usuario> {
    return this.usuariosService.findOne(id_usuario);
  }

  @Mutation(() => Usuario)
  createUsuario(
    @Args('input') input: CreateUsuarioInput,
  ): Promise<Usuario> {
    return this.usuariosService.create(input);
  }

  @Mutation(() => Usuario)
  updateUsuario(
    @Args('input') input: UpdateUsuarioInput,
  ): Promise<Usuario> {
    return this.usuariosService.update(input);
  }

  @Mutation(() => Usuario)
  deactivateUsuario(
    @Args('id_usuario', { type: () => Int }) id_usuario: number,
  ): Promise<Usuario> {
    return this.usuariosService.deactivate(id_usuario);
  }
}