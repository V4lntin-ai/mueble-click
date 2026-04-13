import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { DetalleVentaService } from './detalle-venta.service';
import { DetalleVentaResolver } from './detalle-venta.resolver';
import { VentasModule } from '../ventas/ventas.module';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetalleVenta]),
    VentasModule,
    ProductosModule,
  ],
  providers: [DetalleVentaService, DetalleVentaResolver],
  exports: [DetalleVentaService],
})
export class DetalleVentaModule {}