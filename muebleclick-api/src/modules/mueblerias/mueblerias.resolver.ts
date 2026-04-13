import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MuebleriaService } from './mueblerias.service';
import { Muebleria } from './entities/mueblerias.entity';
import { CreateMuebleriaInput } from './dto/create-mueblerias.input';
import { UpdateMuebleriaInput } from './dto/update-mueblerias.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => Muebleria)
export class MuebleriaResolver {
  constructor(private readonly muebleriaService: MuebleriaService) {}

  // Público — clientes pueden ver el catálogo de mueblerías
  @Query(() => [Muebleria], { name: 'mueblerias' })
  findAll(): Promise<Muebleria[]> {
    return this.muebleriaService.findAll();
  }

  @Query(() => Muebleria, { name: 'muebleria' })
  findOne(
    @Args('id_muebleria', { type: () => Int }) id_muebleria: number,
  ): Promise<Muebleria> {
    return this.muebleriaService.findOne(id_muebleria);
  }

  // Propietario ve solo sus mueblerías
  @UseGuards(JwtAuthGuard)
  @Query(() => [Muebleria], { name: 'misMueblerias' })
  misMueblerias(@CurrentUser() usuario: Usuario): Promise<Muebleria[]> {
    return this.muebleriaService.findByPropietario(usuario.id_usuario);
  }

  @Roles('Propietario', 'Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Muebleria)
  createMuebleria(
    @Args('input') input: CreateMuebleriaInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<Muebleria> {
    return this.muebleriaService.create(input, usuario.id_usuario);
  }

  @Roles('Propietario', 'Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Muebleria)
  updateMuebleria(
    @Args('input') input: UpdateMuebleriaInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<Muebleria> {
    return this.muebleriaService.update(input, usuario.id_usuario);
  }

  @Roles('Propietario', 'Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  removeMuebleria(
    @Args('id_muebleria', { type: () => Int }) id_muebleria: number,
    @CurrentUser() usuario: Usuario,
  ): Promise<boolean> {
    return this.muebleriaService.remove(id_muebleria, usuario.id_usuario);
  }
}