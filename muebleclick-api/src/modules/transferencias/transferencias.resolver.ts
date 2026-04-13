import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransferenciasService } from './transferencias.service';
import { Transferencia } from './entities/transferencias.entity';
import { CreateTransferenciaInput } from './dto/create-transferencias.input';
import { UpdateTransferenciaInput } from './dto/update-transferencias.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Resolver(() => Transferencia)
export class TransferenciasResolver {
  constructor(private readonly service: TransferenciasService) {}

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Transferencia], { name: 'transferencias' })
  findAll(): Promise<Transferencia[]> {
    return this.service.findAll();
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => Transferencia, { name: 'transferencia' })
  findOne(
    @Args('id_transferencia', { type: () => Int }) id_transferencia: number,
  ): Promise<Transferencia> {
    return this.service.findOne(id_transferencia);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Transferencia], { name: 'transferenciasPorOrigen' })
  findByOrigen(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<Transferencia[]> {
    return this.service.findByOrigen(id_sucursal);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Transferencia], { name: 'transferenciasPorDestino' })
  findByDestino(
    @Args('id_sucursal', { type: () => Int }) id_sucursal: number,
  ): Promise<Transferencia[]> {
    return this.service.findByDestino(id_sucursal);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Transferencia)
  createTransferencia(
    @Args('input') input: CreateTransferenciaInput,
    @CurrentUser() usuario: Usuario,
  ): Promise<Transferencia> {
    return this.service.create(input, usuario.id_usuario);
  }

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Transferencia)
  updateEstadoTransferencia(
    @Args('input') input: UpdateTransferenciaInput,
  ): Promise<Transferencia> {
    return this.service.updateEstado(input);
  }
}