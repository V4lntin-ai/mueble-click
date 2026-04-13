import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { DetallePedidoService } from './detalle-pedido.service';
import { DetallePedidoResolver } from './detalle-pedido.resolver';
import { PedidosModule } from '../pedidos/pedidos.module';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetallePedido]),
    PedidosModule,
    ProductosModule,
  ],
  providers: [DetallePedidoService, DetallePedidoResolver],
  exports: [DetallePedidoService],
})
export class DetallePedidoModule {}