import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductoMateriaPrimaService } from './producto-materia-prima.service';
import { ProductoMateriaPrima } from './entities/producto-materia-prima.entity';
import { CreateProductoMateriaPrimaInput } from './dto/create-producto-materia-prima.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => ProductoMateriaPrima)
export class ProductoMateriaPrimaResolver {
  constructor(private readonly service: ProductoMateriaPrimaService) {}

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ProductoMateriaPrima], { name: 'bomProductos' })
  findAll(): Promise<ProductoMateriaPrima[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ProductoMateriaPrima], { name: 'bomPorProducto' })
  findByProducto(
    @Args('id_producto', { type: () => Int }) id_producto: number,
  ): Promise<ProductoMateriaPrima[]> {
    return this.service.findByProducto(id_producto);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => ProductoMateriaPrima)
  createBom(
    @Args('input') input: CreateProductoMateriaPrimaInput,
  ): Promise<ProductoMateriaPrima> {
    return this.service.create(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  removeBom(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.service.remove(id);
  }
}