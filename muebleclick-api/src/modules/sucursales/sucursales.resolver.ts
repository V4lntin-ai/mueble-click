import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { Sucursal } from './entities/sucursales.entity';
import { CreateSucursalInput } from './dto/create-sucursales.input';
import { UpdateSucursalInput } from './dto/update-sucursales.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => Sucursal)
export class SucursalesResolver {
  constructor(private readonly sucursalesService: SucursalesService) {}

  // Público
  @Query(() => [Sucursal], { name: 'sucursales' })
  findAll(): Promise<Sucursal[]> {
    return this.sucursalesService.findAll();
  }

  @Query(() => Sucursal, { name: 'sucursal' })
  findOne(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<Sucursal> {
    return this.sucursalesService.findOne(id_sucursal);
  }

  @Query(() => [Sucursal], { name: 'sucursalesPorMuebleria' })
  findByMuebleria(
    @Args('id_muebleria', { type: () => Int }) id_muebleria: number,
  ): Promise<Sucursal[]> {
    return this.sucursalesService.findByMuebleria(id_muebleria);
  }

  @Roles('Propietario', 'Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Sucursal)
  createSucursal(
    @Args('input') input: CreateSucursalInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<Sucursal> {
    return this.sucursalesService.create(input, usuario.id_usuario);
  }

  @Roles('Propietario', 'Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Sucursal)
  updateSucursal(
    @Args('input') input: UpdateSucursalInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<Sucursal> {
    return this.sucursalesService.update(input, usuario.id_usuario);
  }

  @Roles('Propietario', 'Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Sucursal)
  toggleActivoSucursal(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
    @CurrentUser() usuario: Usuario,
  ): Promise<Sucursal> {
    return this.sucursalesService.toggleActivo(id_sucursal, usuario.id_usuario);
  }
}