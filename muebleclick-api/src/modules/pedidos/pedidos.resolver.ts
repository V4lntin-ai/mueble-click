import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { Pedido } from './entities/pedidos.entity';
import { CreatePedidoInput } from './dto/create-pedidos.input';
import { UpdatePedidoInput } from './dto/update-pedidos.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => Pedido)
export class PedidosResolver {
  constructor(private readonly service: PedidosService) {}

  @Roles('Admin', 'Empleado', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Pedido], { name: 'pedidos' })
  findAll(): Promise<Pedido[]> {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Pedido], { name: 'misPedidos' })
  misPedidos(@CurrentUser() usuario: Usuario): Promise<Pedido[]> {
    return this.service.findByCliente(usuario.id_usuario);
  }

  @Roles('Admin', 'Empleado', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Pedido], { name: 'pedidosPorSucursal' })
  findBySucursal(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<Pedido[]> {
    return this.service.findBySucursal(id_sucursal);
  }

  @Roles('Admin', 'Empleado', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Pedido], { name: 'pedidosPorEstado' })
  findByEstado(@Args('estado') estado: string): Promise<Pedido[]> {
    return this.service.findByEstado(estado);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Pedido, { name: 'pedido' })
  findOne(
    @Args('id_pedido', { type: () => Int }) id_pedido: number,
  ): Promise<Pedido> {
    return this.service.findOne(id_pedido);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Pedido)
  createPedido(
    @Args('input') input: CreatePedidoInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<Pedido> {
    return this.service.create(input, usuario.id_usuario);
  }

  @Roles('Admin', 'Empleado', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Pedido)
  updateEstadoPedido(
    @Args('input') input: UpdatePedidoInput,
  ): Promise<Pedido> {
    return this.service.updateEstado(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Pedido)
  cancelarPedido(
    @Args('id_pedido', { type: () => Int }) id_pedido: number,
    @CurrentUser() usuario: Usuario,
  ): Promise<Pedido> {
    return this.service.cancelar(id_pedido, usuario.id_usuario);
  }
}