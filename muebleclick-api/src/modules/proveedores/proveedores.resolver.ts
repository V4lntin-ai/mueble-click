import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { Proveedor } from './entities/proveedores.entity';
import { CreateProveedorInput } from './dto/create-proveedores.input';
import { UpdateProveedorInput } from './dto/update-proveedores.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => Proveedor)
export class ProveedoresResolver {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Proveedor], { name: 'proveedores' })
  findAll(): Promise<Proveedor[]> {
    return this.proveedoresService.findAll();
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => Proveedor, { name: 'proveedor' })
  findOne(
    @Args('id_proveedor', { type: () => Int }) id_proveedor: number,
  ): Promise<Proveedor> {
    return this.proveedoresService.findOne(id_proveedor);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Proveedor], { name: 'proveedoresPorTipo' })
  findByTipo(
    @Args('tipo_proveedor') tipo_proveedor: string,
  ): Promise<Proveedor[]> {
    return this.proveedoresService.findByTipo(tipo_proveedor);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Proveedor)
  createProveedor(
    @Args('input') input: CreateProveedorInput,
  ): Promise<Proveedor> {
    return this.proveedoresService.create(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Proveedor)
  updateProveedor(
    @Args('input') input: UpdateProveedorInput,
  ): Promise<Proveedor> {
    return this.proveedoresService.update(input);
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  removeProveedor(
    @Args('id_proveedor', { type: () => Int }) id_proveedor: number,
  ): Promise<boolean> {
    return this.proveedoresService.remove(id_proveedor);
  }
}