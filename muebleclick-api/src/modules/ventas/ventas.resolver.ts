import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { Venta } from './entities/ventas.entity';
import { CreateVentaInput } from './dto/create-ventas.input';
import { UpdateVentaInput } from './dto/update-ventas.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => Venta)
export class VentasResolver {
  constructor(private readonly service: VentasService) {}

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Venta], { name: 'ventas' })
  findAll(): Promise<Venta[]> {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Venta], { name: 'misVentas' })
  misVentas(@CurrentUser() usuario: Usuario): Promise<Venta[]> {
    return this.service.findByCliente(usuario.id_usuario);
  }

  @Roles('Admin', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Venta], { name: 'ventasPorVendedor' })
  findByVendedor(
    @Args('id_vendedor', { type: () => Int }) id_vendedor: number,
  ): Promise<Venta[]> {
    return this.service.findByVendedor(id_vendedor);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Venta)
  createVenta(
    @Args('input') input: CreateVentaInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<Venta> {
    return this.service.create(input, usuario.id_usuario);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Venta)
  updateEstadoVenta(@Args('input') input: UpdateVentaInput): Promise<Venta> {
    return this.service.updateEstado(input);
  }
}