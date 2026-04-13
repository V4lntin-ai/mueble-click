import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { Producto } from './entities/productos.entity';
import { CreateProductoInput } from './dto/create-productos.input';
import { UpdateProductoInput } from './dto/update-productos.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => Producto)
export class ProductosResolver {
  constructor(private readonly productosService: ProductosService) {}

  // Público — marketplace
  @Query(() => [Producto], { name: 'productos' })
  findAll(): Promise<Producto[]> {
    return this.productosService.findAll();
  }

  @Query(() => Producto, { name: 'producto' })
  findOne(
    @Args('id_producto', { type: () => Int }) id_producto: number,
  ): Promise<Producto> {
    return this.productosService.findOne(id_producto);
  }

  @Query(() => [Producto], { name: 'productosPorMuebleria' })
  findByMuebleria(
    @Args('id_muebleria', { type: () => Int }) id_muebleria: number,
  ): Promise<Producto[]> {
    return this.productosService.findByMuebleria(id_muebleria);
  }

  @Query(() => [Producto], { name: 'productosPorCategoria' })
  findByCategoria(
    @Args('categoria') categoria: string,
  ): Promise<Producto[]> {
    return this.productosService.findByCategoria(categoria);
  }

  @Query(() => [Producto], { name: 'buscarProductos' })
  search(@Args('termino') termino: string): Promise<Producto[]> {
    return this.productosService.search(termino);
  }

  @Roles('Propietario', 'Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Producto)
  createProducto(
    @Args('input') input: CreateProductoInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<Producto> {
    return this.productosService.create(input, usuario.id_usuario);
  }

  @Roles('Propietario', 'Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Producto)
  updateProducto(
    @Args('input') input: UpdateProductoInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<Producto> {
    return this.productosService.update(input, usuario.id_usuario);
  }

  @Roles('Propietario', 'Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  removeProducto(
    @Args('id_producto', { type: () => Int }) id_producto: number,
    @CurrentUser() usuario: Usuario,
  ): Promise<boolean> {
    return this.productosService.remove(id_producto, usuario.id_usuario);
  }
}