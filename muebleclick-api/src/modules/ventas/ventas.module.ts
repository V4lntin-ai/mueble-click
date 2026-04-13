import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/ventas.entity';
import { VentasService } from './ventas.service';
import { VentasResolver } from './ventas.resolver';
import { ClienteModule } from '../cliente/cliente.module';
import { PedidosModule } from '../pedidos/pedidos.module';
import { MetodoPagoModule } from '../metodo-pago/metodo-pago.module';
import { CuponesModule } from '../cupones/cupones.module';
import { EmpleadoModule } from '../empleado/empleado.module';
import { DetallePedidoModule } from '../detalle-pedido/detalle-pedido.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta]),
    ClienteModule,
    PedidosModule,
    MetodoPagoModule,
    CuponesModule,
    EmpleadoModule,
    DetallePedidoModule,
  ],
  providers: [VentasService, VentasResolver],
  exports: [VentasService],
})
export class VentasModule {}