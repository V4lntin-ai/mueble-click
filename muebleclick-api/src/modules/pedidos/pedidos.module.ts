import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedidos.entity';
import { PedidosService } from './pedidos.service';
import { PedidosResolver } from './pedidos.resolver';
import { ClienteModule } from '../cliente/cliente.module';
import { DireccionesEnvioModule } from '../direcciones-envio/direcciones-envio.module';
import { SucursalesModule } from '../sucursales/sucursales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido]),
    ClienteModule,
    DireccionesEnvioModule,
    SucursalesModule,
  ],
  providers: [PedidosService, PedidosResolver],
  exports: [PedidosService],
})
export class PedidosModule {}