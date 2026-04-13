import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CreateDetalleVentaInput } from './dto/create-detalle-venta.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Resolver(() => DetalleVenta)
export class DetalleVentaResolver {
  constructor(private readonly service: DetalleVentaService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [DetalleVenta], { name: 'detalleVenta' })
  findByVenta(
    @Args('id_venta', { type: () => Int }) id_venta: number,
  ): Promise<DetalleVenta[]> {
    return this.service.findByVenta(id_venta);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => DetalleVenta)
  createDetalleVenta(
    @Args('input') input: CreateDetalleVentaInput,
  ): Promise<DetalleVenta> {
    return this.service.create(input);
  }
}