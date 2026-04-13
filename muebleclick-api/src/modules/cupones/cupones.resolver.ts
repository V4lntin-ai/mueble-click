import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CuponesService } from './cupones.service';
import { Cupon } from './entities/cupones.entity';
import { CreateCuponInput } from './dto/create-cupones.input';
import { UpdateCuponInput } from './dto/update-cupones.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => Cupon)
export class CuponesResolver {
  constructor(private readonly service: CuponesService) {}

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Cupon], { name: 'cupones' })
  findAll(): Promise<Cupon[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => Cupon, { name: 'cupon' })
  findOne(
    @Args('id_cupon', { type: () => Int }) id_cupon: number,
  ): Promise<Cupon> {
    return this.service.findOne(id_cupon);
  }

  // Público — cliente valida su cupón en checkout
  @Query(() => Cupon, { name: 'validarCupon' })
  validar(@Args('codigo') codigo: string): Promise<Cupon> {
    return this.service.validar(codigo);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Cupon)
  createCupon(@Args('input') input: CreateCuponInput): Promise<Cupon> {
    return this.service.create(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Cupon)
  updateCupon(@Args('input') input: UpdateCuponInput): Promise<Cupon> {
    return this.service.update(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Cupon)
  toggleActivoCupon(
    @Args('id_cupon', { type: () => Int }) id_cupon: number,
  ): Promise<Cupon> {
    return this.service.toggleActivo(id_cupon);
  }
}