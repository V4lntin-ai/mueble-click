import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DetalleOrdenCompraService } from './detalle-orden-compra.service';
import { DetalleOrdenCompra } from './entities/detalle-orden-compra.entity';
import { CreateDetalleOrdenCompraInput } from './dto/create-detalle-orden-compra.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => DetalleOrdenCompra)
export class DetalleOrdenCompraResolver {
  constructor(private readonly service: DetalleOrdenCompraService) {}

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [DetalleOrdenCompra], { name: 'detalleOrdenCompra' })
  findByOrden(
    @Args('id_orden', { type: () => Int }) id_orden: number,
  ): Promise<DetalleOrdenCompra[]> {
    return this.service.findByOrden(id_orden);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => DetalleOrdenCompra)
  createDetalleOrdenCompra(
    @Args('input') input: CreateDetalleOrdenCompraInput,
  ): Promise<DetalleOrdenCompra> {
    return this.service.create(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  removeDetalleOrdenCompra(
    @Args('id_detalle', { type: () => Int }) id_detalle: number,
  ): Promise<boolean> {
    return this.service.remove(id_detalle);
  }
}