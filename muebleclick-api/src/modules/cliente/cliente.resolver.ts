import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteInput } from './dto/create-cliente.input';
import { UpdateClienteInput } from './dto/update-cliente.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => Cliente)
export class ClienteResolver {
  constructor(private readonly clienteService: ClienteService) {}

  @Roles('Admin', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Cliente], { name: 'clientes' })
  findAll(): Promise<Cliente[]> {
    return this.clienteService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Cliente, { name: 'miPerfilCliente' })
  miPerfil(@CurrentUser() usuario: Usuario): Promise<Cliente> {
    return this.clienteService.findOne(usuario.id_usuario);
  }

  @Roles('Admin', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => Cliente, { name: 'cliente' })
  findOne(
    @Args('id_usuario', { type: () => Int }) id_usuario: number,
  ): Promise<Cliente> {
    return this.clienteService.findOne(id_usuario);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Cliente)
  createCliente(
    @Args('input') input: CreateClienteInput,
  ): Promise<Cliente> {
    return this.clienteService.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Cliente)
  updateCliente(
    @Args('input') input: UpdateClienteInput,
  ): Promise<Cliente> {
    return this.clienteService.update(input);
  }

  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Cliente)
  sumarPuntos(
    @Args('id_usuario', { type: () => Int }) id_usuario: number,
    @Args('puntos', { type: () => Int }) puntos: number,
  ): Promise<Cliente> {
    return this.clienteService.sumarPuntos(id_usuario, puntos);
  }
}