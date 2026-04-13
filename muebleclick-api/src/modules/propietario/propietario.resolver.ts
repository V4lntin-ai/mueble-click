import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PropietarioService } from './propietario.service';
import { Propietario } from './entities/propietario.entity';
import { CreatePropietarioInput } from './dto/create-propietario.input';
import { UpdatePropietarioInput } from './dto/update-propietario.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => Propietario)
export class PropietarioResolver {
  constructor(private readonly propietarioService: PropietarioService) {}

  // Solo Admin puede ver todos los propietarios
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Propietario], { name: 'propietarios' })
  findAll(): Promise<Propietario[]> {
    return this.propietarioService.findAll();
  }

  // Propietario ve su propio perfil
  @UseGuards(JwtAuthGuard)
  @Query(() => Propietario, { name: 'miPerfilPropietario' })
  miPerfil(@CurrentUser() usuario: Usuario): Promise<Propietario> {
    return this.propietarioService.findOne(usuario.id_usuario);
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => Propietario, { name: 'propietario' })
  findOne(
    @Args('id_usuario', { type: () => Int }) id_usuario: number,
  ): Promise<Propietario> {
    return this.propietarioService.findOne(id_usuario);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Propietario)
  createPropietario(
    @Args('input') input: CreatePropietarioInput,
  ): Promise<Propietario> {
    return this.propietarioService.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Propietario)
  updatePropietario(
    @Args('input') input: UpdatePropietarioInput,
  ): Promise<Propietario> {
    return this.propietarioService.update(input);
  }

  // Solo Admin puede verificar propietarios
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Propietario)
  verificarPropietario(
    @Args('id_usuario', { type: () => Int }) id_usuario: number,
  ): Promise<Propietario> {
    return this.propietarioService.verificar(id_usuario);
  }
}