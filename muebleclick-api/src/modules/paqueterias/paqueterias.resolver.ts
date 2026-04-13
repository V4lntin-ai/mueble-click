import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaqueteriasService } from './paqueterias.service';
import { Paqueteria } from './entities/paqueterias.entity';
import { CreatePaqueteriaInput } from './dto/create-paqueterias.input';
import { UpdatePaqueteriaInput } from './dto/update-paqueterias.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => Paqueteria)
export class PaqueteriasResolver {
  constructor(private readonly service: PaqueteriasService) {}

  @Query(() => [Paqueteria], { name: 'paqueterias' })
  findAll(): Promise<Paqueteria[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Paqueteria)
  createPaqueteria(
    @Args('input') input: CreatePaqueteriaInput,
  ): Promise<Paqueteria> {
    return this.service.create(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Paqueteria)
  updatePaqueteria(
    @Args('input') input: UpdatePaqueteriaInput,
  ): Promise<Paqueteria> {
    return this.service.update(input);
  }
}