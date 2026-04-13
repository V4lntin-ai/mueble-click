import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ComprasProveedoresService } from './compras-proveedores.service';
import { CompraProveedor } from './entities/compras-proveedores.entity';
import { CreateCompraProveedorInput } from './dto/create-compras-proveedores.input';
import { UpdateCompraProveedorInput } from './dto/update-compras-proveedores.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => CompraProveedor)
export class ComprasProveedoresResolver {
  constructor(private readonly service: ComprasProveedoresService) {}

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [CompraProveedor], { name: 'comprasProveedores' })
  findAll(): Promise<CompraProveedor[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [CompraProveedor], { name: 'comprasPorProveedor' })
  findByProveedor(
    @Args('id_proveedor', { type: () => Int }) id_proveedor: number,
  ): Promise<CompraProveedor[]> {
    return this.service.findByProveedor(id_proveedor);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => CompraProveedor)
  createCompraProveedor(
    @Args('input') input: CreateCompraProveedorInput,
  ): Promise<CompraProveedor> {
    return this.service.create(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => CompraProveedor)
  updateCompraProveedor(
    @Args('input') input: UpdateCompraProveedorInput,
  ): Promise<CompraProveedor> {
    return this.service.update(input);
  }
}