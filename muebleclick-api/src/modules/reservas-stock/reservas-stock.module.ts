import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaStock } from './entities/reservas-stock.entity';
import { ReservasStockService } from './reservas-stock.service';
import { ReservasStockResolver } from './reservas-stock.resolver';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservaStock]),
    ProductosModule,
  ],
  providers: [ReservasStockService, ReservasStockResolver],
  exports: [ReservasStockService],
})
export class ReservasStockModule {}