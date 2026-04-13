import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MateriasPrimasService } from './materias-primas.service';
import { MateriaPrima } from './entities/materias-primas.entity';
import { CreateMateriaPrimaInput } from './dto/create-materias-primas.input';
import { UpdateMateriaPrimaInput } from './dto/update-materias-primas.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => MateriaPrima)
export class MateriasPrimasResolver {
  constructor(private readonly materiasPrimasService: MateriasPrimasService) {}

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [MateriaPrima], { name: 'materiasPrimas' })
  findAll(): Promise<MateriaPrima[]> {
    return this.materiasPrimasService.findAll();
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => MateriaPrima, { name: 'materiaPrima' })
  findOne(
    @Args('id_materia', { type: () => Int }) id_materia: number,
  ): Promise<MateriaPrima> {
    return this.materiasPrimasService.findOne(id_materia);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [MateriaPrima], { name: 'buscarMateriasPrimas' })
  search(@Args('termino') termino: string): Promise<MateriaPrima[]> {
    return this.materiasPrimasService.search(termino);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => MateriaPrima)
  createMateriaPrima(
    @Args('input') input: CreateMateriaPrimaInput,
  ): Promise<MateriaPrima> {
    return this.materiasPrimasService.create(input);
  }

  @Roles('Admin', 'Propietario')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => MateriaPrima)
  updateMateriaPrima(
    @Args('input') input: UpdateMateriaPrimaInput,
  ): Promise<MateriaPrima> {
    return this.materiasPrimasService.update(input);
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  removeMateriaPrima(
    @Args('id_materia', { type: () => Int }) id_materia: number,
  ): Promise<boolean> {
    return this.materiasPrimasService.remove(id_materia);
  }
}