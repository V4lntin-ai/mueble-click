import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EnviosService } from './envios.service';
import { Envio } from './entities/envios.entity';
import { CreateEnvioInput } from './dto/create-envios.input';
import { UpdateEnvioInput } from './dto/update-envios.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => Envio)
export class EnviosResolver {
  constructor(private readonly service: EnviosService) {}

  @Roles('Admin', 'Propietario', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [Envio], { name: 'envios' })
  findAll(): Promise<Envio[]> {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Envio, { name: 'envioDeVenta', nullable: true })
  findByVenta(
    @Args('id_venta', { type: () => Int }) id_venta: number,
  ): Promise<Envio | null> {
    return this.service.findByVenta(id_venta);
  }

  @Roles('Admin', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Envio)
  createEnvio(@Args('input') input: CreateEnvioInput): Promise<Envio> {
    return this.service.create(input);
  }

  @Roles('Admin', 'Empleado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Envio)
  updateEstadoEnvio(@Args('input') input: UpdateEnvioInput): Promise<Envio> {
    return this.service.updateEstado(input);
  }
}