import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdenesCompraService } from './ordenes-compra.service';
import { OrdenCompra } from './entities/ordenes-compra.entity';
import { CreateOrdenCompraInput } from './dto/create-ordenes-compra.input';
import { UpdateOrdenCompraInput } from './dto/update-ordenes-compra.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => OrdenCompra)
export class OrdenesCompraResolver {
  constructor(private readonly service: OrdenesCompraService) {}

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [OrdenCompra], { name: 'ordenesCompra' })
  findAll(): Promise<OrdenCompra[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => OrdenCompra, { name: 'ordenCompra' })
  findOne(
    @Args('id_orden', { type: () => Int }) id_orden: number,
  ): Promise<OrdenCompra> {
    return this.service.findOne(id_orden);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [OrdenCompra], { name: 'ordenesCompraPorSucursal' })
  findBySucursal(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<OrdenCompra[]> {
    return this.service.findBySucursal(id_sucursal);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => OrdenCompra)
  createOrdenCompra(
    @Args('input') input: CreateOrdenCompraInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<OrdenCompra> {
    return this.service.create(input, usuario.id_usuario);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => OrdenCompra)
  updateEstadoOrdenCompra(
    @Args('input') input: UpdateOrdenCompraInput,
  ): Promise<OrdenCompra> {
    return this.service.updateEstado(input);
  }
}