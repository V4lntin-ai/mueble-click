import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReservasStockService } from './reservas-stock.service';
import { ReservaStock } from './entities/reservas-stock.entity';
import { CreateReservaStockInput } from './dto/create-reservas-stock.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => ReservaStock)
export class ReservasStockResolver {
  constructor(private readonly service: ReservasStockService) {}

  @Roles('Admin', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ReservaStock], { name: 'reservasStock' })
  findAll(): Promise<ReservaStock[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ReservaStock], { name: 'reservasPorPedido' })
  findByPedido(
    @Args('id_pedido', { type: () => Int }) id_pedido: number,
  ): Promise<ReservaStock[]> {
    return this.service.findByPedido(id_pedido);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ReservaStock)
  createReservaStock(
    @Args('input') input: CreateReservaStockInput,
  ): Promise<ReservaStock> {
    return this.service.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  liberarReservaStock(
    @Args('id_reserva', { type: () => Int }) id_reserva: number,
  ): Promise<boolean> {
    return this.service.liberar(id_reserva);
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Int)
  limpiarReservasExpiradas(): Promise<number> {
    return this.service.limpiarExpiradas();
  }
}