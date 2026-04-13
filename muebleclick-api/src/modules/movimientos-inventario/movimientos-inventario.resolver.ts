import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { MovimientoInventario } from './entities/movimientos-inventario.entity';
import { CreateMovimientoInventarioInput } from './dto/create-movimientos-inventario.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => MovimientoInventario)
export class MovimientosInventarioResolver {
  constructor(
    private readonly movimientosService: MovimientosInventarioService,
  ) {}

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [MovimientoInventario], { name: 'movimientosInventario' })
  findAll(): Promise<MovimientoInventario[]> {
    return this.movimientosService.findAll();
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [MovimientoInventario], { name: 'movimientosPorSucursal' })
  findBySucursal(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<MovimientoInventario[]> {
    return this.movimientosService.findBySucursal(id_sucursal);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [MovimientoInventario], { name: 'movimientosPorProducto' })
  findByProducto(
    @Args('id_producto', { type: () => Int }) id_producto: number,
  ): Promise<MovimientoInventario[]> {
    return this.movimientosService.findByProducto(id_producto);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => MovimientoInventario)
  createMovimientoInventario(
    @Args('input') input: CreateMovimientoInventarioInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<MovimientoInventario> {
    return this.movimientosService.create(input, usuario.id_usuario);
  }
}