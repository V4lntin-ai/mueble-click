import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleOrdenCompra } from './entities/detalle-orden-compra.entity';
import { DetalleOrdenCompraService } from './detalle-orden-compra.service';
import { DetalleOrdenCompraResolver } from './detalle-orden-compra.resolver';
import { OrdenesCompraModule } from '../ordenes-compra/ordenes-compra.module';
import { ProductosModule } from '../productos/productos.module';
import { MateriasPrimasModule } from '../materias-primas/materias-primas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetalleOrdenCompra]),
    OrdenesCompraModule,
    ProductosModule,
    MateriasPrimasModule,
  ],
  providers: [DetalleOrdenCompraService, DetalleOrdenCompraResolver],
  exports: [DetalleOrdenCompraService],
})
export class DetalleOrdenCompraModule {}