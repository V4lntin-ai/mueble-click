import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MovimientosInventarioMPService } from './movimientos-inventario-mp.service';
import { MovimientoInventarioMP } from './entities/movimientos-inventario-mp.entity';
import { CreateMovimientoInventarioMPInput } from './dto/create-movimientos-inventario-mp.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => MovimientoInventarioMP)
export class MovimientosInventarioMPResolver {
  constructor(private readonly service: MovimientosInventarioMPService) {}

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [MovimientoInventarioMP], { name: 'movimientosInventarioMP' })
  findAll(): Promise<MovimientoInventarioMP[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [MovimientoInventarioMP], { name: 'movimientosMPPorSucursal' })
  findBySucursal(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<MovimientoInventarioMP[]> {
    return this.service.findBySucursal(id_sucursal);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [MovimientoInventarioMP], { name: 'movimientosMPPorMateria' })
  findByMateria(
    @Args('id_materia', { type: () => Int }) id_materia: number,
  ): Promise<MovimientoInventarioMP[]> {
    return this.service.findByMateria(id_materia);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => MovimientoInventarioMP)
  createMovimientoInventarioMP(
    @Args('input') input: CreateMovimientoInventarioMPInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<MovimientoInventarioMP> {
    return this.service.create(input, usuario.id_usuario);
  }
}