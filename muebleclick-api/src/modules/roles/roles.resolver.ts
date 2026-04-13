import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Rol } from './entities/rol.entity';
import { CreateRolInput } from './dto/create-rol.input';
import { UpdateRolInput } from './dto/update-rol.input';

@Resolver(() => Rol)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query(() => [Rol], { name: 'roles' })
  findAll(): Promise<Rol[]> {
    return this.rolesService.findAll();
  }

  @Query(() => Rol, { name: 'rol' })
  findOne(@Args('id_rol', { type: () => Int }) id_rol: number): Promise<Rol> {
    return this.rolesService.findOne(id_rol);
  }

  @Mutation(() => Rol)
  createRol(@Args('input') input: CreateRolInput): Promise<Rol> {
    return this.rolesService.create(input);
  }

  @Mutation(() => Rol)
  updateRol(@Args('input') input: UpdateRolInput): Promise<Rol> {
    return this.rolesService.update(input);
  }

  @Mutation(() => Boolean)
  removeRol(
    @Args('id_rol', { type: () => Int }) id_rol: number,
  ): Promise<boolean> {
    return this.rolesService.remove(id_rol);
  }
}