import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { Empleado } from './entities/empleado.entity';
import { CreateEmpleadoInput } from './dto/create-empleado.input';
import { UpdateEmpleadoInput } from './dto/update-empleado.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => Empleado)
export class EmpleadoResolver {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Empleado], { name: 'empleados' })
  findAll(): Promise<Empleado[]> {
    return this.empleadoService.findAll();
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Empleado], { name: 'empleadosPorSucursal' })
  findBySucursal(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<Empleado[]> {
    return this.empleadoService.findBySucursal(id_sucursal);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Empleado], { name: 'vendedoresPorSucursal' })
  findVendedores(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<Empleado[]> {
    return this.empleadoService.findVendedores(id_sucursal);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Empleado, { name: 'miPerfilEmpleado' })
  miPerfil(@CurrentUser() usuario: Usuario): Promise<Empleado> {
    return this.empleadoService.findOne(usuario.id_usuario);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Empleado)
  createEmpleado(
    @Args('input') input: CreateEmpleadoInput,
  ): Promise<Empleado> {
    return this.empleadoService.create(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Empleado)
  updateEmpleado(
    @Args('input') input: UpdateEmpleadoInput,
  ): Promise<Empleado> {
    return this.empleadoService.update(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Empleado)
  toggleActivoEmpleado(
    @Args('id_usuario', { type: () => Int }) id_usuario: number,
  ): Promise<Empleado> {
    return this.empleadoService.toggleActivo(id_usuario);
  }
}