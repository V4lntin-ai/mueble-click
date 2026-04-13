import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProveedorMateriaPrimaService } from './proveedor-materia-prima.service';
import { ProveedorMateriaPrima } from './entities/proveedor-materia-prima.entity';
import { CreateProveedorMateriaPrimaInput } from './dto/create-proveedor-materia-prima.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => ProveedorMateriaPrima)
export class ProveedorMateriaPrimaResolver {
  constructor(private readonly service: ProveedorMateriaPrimaService) {}

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ProveedorMateriaPrima], { name: 'proveedorMateriasPrimas' })
  findAll(): Promise<ProveedorMateriaPrima[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [ProveedorMateriaPrima], { name: 'proveedoresPorMateria' })
  findByMateria(
    @Args('id_materia', { type: () => Int }) id_materia: number,
  ): Promise<ProveedorMateriaPrima[]> {
    return this.service.findByMateria(id_materia);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => ProveedorMateriaPrima)
  createProveedorMateriaPrima(
    @Args('input') input: CreateProveedorMateriaPrimaInput,
  ): Promise<ProveedorMateriaPrima> {
    return this.service.create(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => ProveedorMateriaPrima)
  toggleActivoProveedorMateriaPrima(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ProveedorMateriaPrima> {
    return this.service.toggleActivo(id);
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  removeProveedorMateriaPrima(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.service.remove(id);
  }
}