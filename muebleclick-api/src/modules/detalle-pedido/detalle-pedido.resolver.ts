import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DetallePedidoService } from './detalle-pedido.service';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { CreateDetallePedidoInput } from './dto/create-detalle-pedido.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Resolver(() => DetallePedido)
export class DetallePedidoResolver {
  constructor(private readonly service: DetallePedidoService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [DetallePedido], { name: 'detallePedido' })
  findByPedido(
    @Args('id_pedido', { type: () => Int }) id_pedido: number,
  ): Promise<DetallePedido[]> {
    return this.service.findByPedido(id_pedido);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => DetallePedido)
  createDetallePedido(
    @Args('input') input: CreateDetallePedidoInput,
  ): Promise<DetallePedido> {
    return this.service.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  removeDetallePedido(
    @Args('id_detalle_pedido', { type: () => Int }) id_detalle_pedido: number,
  ): Promise<boolean> {
    return this.service.remove(id_detalle_pedido);
  }
}