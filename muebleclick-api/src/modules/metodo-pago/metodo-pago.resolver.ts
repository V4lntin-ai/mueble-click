import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MetodoPagoService } from './metodo-pago.service';
import { MetodoPago } from './entities/metodo-pago.entity';
import { CreateMetodoPagoInput } from './dto/create-metodo-pago.input';
import { UpdateMetodoPagoInput } from './dto/update-metodo-pago.input';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Resolver(() => MetodoPago)
export class MetodoPagoResolver {
  constructor(private readonly service: MetodoPagoService) {}

  // Público — cliente ve métodos disponibles
  @Query(() => [MetodoPago], { name: 'metodosPago' })
  findAll(): Promise<MetodoPago[]> {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MetodoPago)
  createMetodoPago(
    @Args('input') input: CreateMetodoPagoInput,
  ): Promise<MetodoPago> {
    return this.service.create(input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MetodoPago)
  updateMetodoPago(
    @Args('input') input: UpdateMetodoPagoInput,
  ): Promise<MetodoPago> {
    return this.service.update(input);
  }
}