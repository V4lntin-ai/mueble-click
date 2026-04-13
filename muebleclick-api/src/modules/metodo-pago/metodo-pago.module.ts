import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodoPago } from './entities/metodo-pago.entity';
import { MetodoPagoService } from './metodo-pago.service';
import { MetodoPagoResolver } from './metodo-pago.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([MetodoPago])],
  providers: [MetodoPagoService, MetodoPagoResolver],
  exports: [MetodoPagoService],
})
export class MetodoPagoModule {}