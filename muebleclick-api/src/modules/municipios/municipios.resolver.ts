import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MunicipiosService } from './municipios.service';
import { Municipio } from './entities/municipio.entity';
import { CreateMunicipioInput } from './dto/create-municipio.input';
import { UpdateMunicipioInput } from './dto/update-municipio.input';

@Resolver(() => Municipio)
export class MunicipiosResolver {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Query(() => [Municipio], { name: 'municipios' })
  findAll(): Promise<Municipio[]> {
    return this.municipiosService.findAll();
  }

  @Query(() => [Municipio], { name: 'municipiosPorEstado' })
  findByEstado(
    @Args('id_estado', { type: () => Int }) id_estado: number,
  ): Promise<Municipio[]> {
    return this.municipiosService.findByEstado(id_estado);
  }

  @Query(() => Municipio, { name: 'municipio' })
  findOne(
    @Args('id_municipio', { type: () => Int }) id_municipio: number,
  ): Promise<Municipio> {
    return this.municipiosService.findOne(id_municipio);
  }

  @Mutation(() => Municipio)
  createMunicipio(
    @Args('input') input: CreateMunicipioInput,
  ): Promise<Municipio> {
    return this.municipiosService.create(input);
  }

  @Mutation(() => Municipio)
  updateMunicipio(
    @Args('input') input: UpdateMunicipioInput,
  ): Promise<Municipio> {
    return this.municipiosService.update(input);
  }

  @Mutation(() => Boolean)
  removeMunicipio(
    @Args('id_municipio', { type: () => Int }) id_municipio: number,
  ): Promise<boolean> {
    return this.municipiosService.remove(id_municipio);
  }
}