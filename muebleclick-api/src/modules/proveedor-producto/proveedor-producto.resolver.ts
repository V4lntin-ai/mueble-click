import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProveedorProductoService } from './proveedor-producto.service';
import { ProveedorProducto } from './entities/proveedor-producto.entity';
import { CreateProveedorProductoInput } from './dto/create-proveedor-producto.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => ProveedorProducto)
export class ProveedorProductoResolver {
  constructor(private readonly service: ProveedorProductoService) {}

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ProveedorProducto], { name: 'proveedorProductos' })
  findAll(): Promise<ProveedorProducto[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ProveedorProducto], { name: 'proveedoresPorProducto' })
  findByProducto(
    @Args('id_producto', { type: () => Int }) id_producto: number,
  ): Promise<ProveedorProducto[]> {
    return this.service.findByProducto(id_producto);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ProveedorProducto], { name: 'productosPorProveedor' })
  findByProveedor(
    @Args('id_proveedor', { type: () => Int }) id_proveedor: number,
  ): Promise<ProveedorProducto[]> {
    return this.service.findByProveedor(id_proveedor);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => ProveedorProducto)
  createProveedorProducto(
    @Args('input') input: CreateProveedorProductoInput,
  ): Promise<ProveedorProducto> {
    return this.service.create(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => ProveedorProducto)
  toggleActivoProveedorProducto(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ProveedorProducto> {
    return this.service.toggleActivo(id);
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  removeProveedorProducto(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.service.remove(id);
  }
}