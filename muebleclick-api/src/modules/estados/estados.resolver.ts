import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EstadosService } from './estados.service';
import { Estado } from './entities/estado.entity';
import { CreateEstadoInput } from './dto/create-estado.input';
import { UpdateEstadoInput } from './dto/update-estado.input';

@Resolver(() => Estado)
export class EstadosResolver {
  constructor(private readonly estadosService: EstadosService) {}

  @Query(() => [Estado], { name: 'estados' })
  findAll(): Promise<Estado[]> {
    return this.estadosService.findAll();
  }

  @Query(() => Estado, { name: 'estado' })
  findOne(
    @Args('id_estado', { type: () => Int }) id_estado: number,
  ): Promise<Estado> {
    return this.estadosService.findOne(id_estado);
  }

  @Mutation(() => Estado)
  createEstado(@Args('input') input: CreateEstadoInput): Promise<Estado> {
    return this.estadosService.create(input);
  }

  @Mutation(() => Estado)
  updateEstado(@Args('input') input: UpdateEstadoInput): Promise<Estado> {
    return this.estadosService.update(input);
  }

  @Mutation(() => Boolean)
  removeEstado(
    @Args('id_estado', { type: () => Int }) id_estado: number,
  ): Promise<boolean> {
    return this.estadosService.remove(id_estado);
  }
}