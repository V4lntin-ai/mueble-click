import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { InventarioService } from './inventario.service';
import { InventarioResolver } from './inventario.resolver';
import { SucursalesModule } from '../sucursales/sucursales.module';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario]),
    SucursalesModule,
    ProductosModule,
  ],
  providers: [InventarioService, InventarioResolver],
  exports: [InventarioService],
})
export class InventarioModule {}