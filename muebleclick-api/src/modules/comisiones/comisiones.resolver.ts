import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ComisionesService } from './comisiones.service';
import { Comision } from './entities/comisiones.entity';
import { CreateComisionInput } from './dto/create-comisiones.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => Comision)
export class ComisionesResolver {
  constructor(private readonly service: ComisionesService) {}

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Comision], { name: 'comisiones' })
  findAll(): Promise<Comision[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Comision], { name: 'comisionesPorVendedor' })
  findByVendedor(
    @Args('id_vendedor', { type: () => Int }) id_vendedor: number,
  ): Promise<Comision[]> {
    return this.service.findByVendedor(id_vendedor);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Comision], { name: 'misComisiones' })
  misComisiones(@CurrentUser() usuario: Usuario): Promise<Comision[]> {
    return this.service.findByVendedor(usuario.id_usuario);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Comision], { name: 'misComisionesPendientes' })
  misComisionesPendientes(
    @CurrentUser() usuario: Usuario,
  ): Promise<Comision[]> {
    return this.service.findPendientesByVendedor(usuario.id_usuario);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Comision)
  createComision(
    @Args('input') input: CreateComisionInput,
  ): Promise<Comision> {
    return this.service.create(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Comision)
  marcarComisionPagada(
    @Args('id_comision', { type: () => Int }) id_comision: number,
  ): Promise<Comision> {
    return this.service.marcarPagada(id_comision);
  }
}