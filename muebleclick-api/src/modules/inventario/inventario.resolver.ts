import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioInput } from './dto/create-inventario.input';
import { UpdateInventarioInput } from './dto/update-inventario.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => Inventario)
export class InventarioResolver {
  constructor(private readonly inventarioService: InventarioService) {}

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Inventario], { name: 'inventarios' })
  findAll(): Promise<Inventario[]> {
    return this.inventarioService.findAll();
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Inventario], { name: 'inventarioPorSucursal' })
  findBySucursal(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<Inventario[]> {
    return this.inventarioService.findBySucursal(id_sucursal);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Inventario], { name: 'stockCritico' })
  findStockCritico(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<Inventario[]> {
    return this.inventarioService.findStockCritico(id_sucursal);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Inventario)
  createInventario(
    @Args('input') input: CreateInventarioInput,
  ): Promise<Inventario> {
    return this.inventarioService.create(input);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Inventario)
  updateInventario(
    @Args('input') input: UpdateInventarioInput,
  ): Promise<Inventario> {
    return this.inventarioService.update(input);
  }
}