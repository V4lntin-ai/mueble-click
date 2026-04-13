import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdenesProduccionService } from './ordenes-produccion.service';
import { OrdenProduccion } from './entities/ordenes-produccion.entity';
import { CreateOrdenProduccionInput } from './dto/create-ordenes-produccion.input';
import { UpdateOrdenProduccionInput } from './dto/update-ordenes-produccion.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => OrdenProduccion)
export class OrdenesProduccionResolver {
  constructor(private readonly service: OrdenesProduccionService) {}

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [OrdenProduccion], { name: 'ordenesProduccion' })
  findAll(): Promise<OrdenProduccion[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => OrdenProduccion, { name: 'ordenProduccion' })
  findOne(
    @Args('id_produccion', { type: () => Int }) id_produccion: number,
  ): Promise<OrdenProduccion> {
    return this.service.findOne(id_produccion);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [OrdenProduccion], { name: 'ordenesProduccionPorSucursal' })
  findBySucursal(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<OrdenProduccion[]> {
    return this.service.findBySucursal(id_sucursal);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [OrdenProduccion], { name: 'ordenesProduccionPorEstado' })
  findByEstado(
    @Args('estado') estado: string,
  ): Promise<OrdenProduccion[]> {
    return this.service.findByEstado(estado);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => OrdenProduccion)
  createOrdenProduccion(
    @Args('input') input: CreateOrdenProduccionInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<OrdenProduccion> {
    return this.service.create(input, usuario.id_usuario);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => OrdenProduccion)
  updateEstadoOrdenProduccion(
    @Args('input') input: UpdateOrdenProduccionInput,
  ): Promise<OrdenProduccion> {
    return this.service.updateEstado(input);
  }
}