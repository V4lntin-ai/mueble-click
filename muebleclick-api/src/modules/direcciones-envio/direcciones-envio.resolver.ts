import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DireccionesEnvioService } from './direcciones-envio.service';
import { DireccionEnvio } from './entities/direcciones-envio.entity';
import { CreateDireccionEnvioInput } from './dto/create-direcciones-envio.input';
import { UpdateDireccionEnvioInput } from './dto/update-direcciones-envio.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => DireccionEnvio)
export class DireccionesEnvioResolver {
  constructor(private readonly service: DireccionesEnvioService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [DireccionEnvio], { name: 'misDirecciones' })
  findByCliente(@CurrentUser() usuario: Usuario): Promise<DireccionEnvio[]> {
    return this.service.findByCliente(usuario.id_usuario);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => DireccionEnvio)
  createDireccionEnvio(
    @Args('input') input: CreateDireccionEnvioInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<DireccionEnvio> {
    return this.service.create(input, usuario.id_usuario);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => DireccionEnvio)
  updateDireccionEnvio(
    @Args('input') input: UpdateDireccionEnvioInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<DireccionEnvio> {
    return this.service.update(input, usuario.id_usuario);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  removeDireccionEnvio(
    @Args('id_direccion', { type: () => Int }) id_direccion: number,
    @CurrentUser() usuario: Usuario,
  ): Promise<boolean> {
    return this.service.remove(id_direccion, usuario.id_usuario);
  }
}