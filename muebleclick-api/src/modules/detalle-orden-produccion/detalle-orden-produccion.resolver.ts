import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DetalleOrdenProduccionService } from './detalle-orden-produccion.service';
import { DetalleOrdenProduccion } from './entities/detalle-orden-produccion.entity';
import { CreateDetalleOrdenProduccionInput } from './dto/create-detalle-orden-produccion.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => DetalleOrdenProduccion)
export class DetalleOrdenProduccionResolver {
  constructor(private readonly service: DetalleOrdenProduccionService) {}

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [DetalleOrdenProduccion], { name: 'detalleOrdenProduccion' })
  findByOrden(
    @Args('id_produccion', { type: () => Int }) id_produccion: number,
  ): Promise<DetalleOrdenProduccion[]> {
    return this.service.findByOrden(id_produccion);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => DetalleOrdenProduccion)
  createDetalleOrdenProduccion(
    @Args('input') input: CreateDetalleOrdenProduccionInput,
  ): Promise<DetalleOrdenProduccion> {
    return this.service.create(input);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => DetalleOrdenProduccion)
  registrarConsumoMP(
    @Args('id_detalle', { type: () => Int }) id_detalle: number,
    @Args('cantidad_consumida', { type: () => Float }) cantidad_consumida: number,
  ): Promise<DetalleOrdenProduccion> {
    return this.service.registrarConsumo(id_detalle, cantidad_consumida);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  removeDetalleOrdenProduccion(
    @Args('id_detalle', { type: () => Int }) id_detalle: number,
  ): Promise<boolean> {
    return this.service.remove(id_detalle);
  }
}