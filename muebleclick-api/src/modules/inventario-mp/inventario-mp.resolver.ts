import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InventarioMPService } from './inventario-mp.service';
import { InventarioMP } from './entities/inventario-mp.entity';
import { CreateInventarioMPInput } from './dto/create-inventario-mp.input';
import { UpdateInventarioMPInput } from './dto/update-inventario-mp.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => InventarioMP)
export class InventarioMPResolver {
  constructor(private readonly inventarioMPService: InventarioMPService) {}

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [InventarioMP], { name: 'inventarioMP' })
  findAll(): Promise<InventarioMP[]> {
    return this.inventarioMPService.findAll();
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [InventarioMP], { name: 'inventarioMPPorSucursal' })
  findBySucursal(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<InventarioMP[]> {
    return this.inventarioMPService.findBySucursal(id_sucursal);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [InventarioMP], { name: 'stockCriticoMP' })
  findStockCritico(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<InventarioMP[]> {
    return this.inventarioMPService.findStockCritico(id_sucursal);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => InventarioMP)
  createInventarioMP(
    @Args('input') input: CreateInventarioMPInput,
  ): Promise<InventarioMP> {
    return this.inventarioMPService.create(input);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => InventarioMP)
  updateInventarioMP(
    @Args('input') input: UpdateInventarioMPInput,
  ): Promise<InventarioMP> {
    return this.inventarioMPService.update(input);
  }
}