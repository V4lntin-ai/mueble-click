import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoInventario } from './entities/movimientos-inventario.entity';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { MovimientosInventarioResolver } from './movimientos-inventario.resolver';
import { SucursalesModule } from '../sucursales/sucursales.module';
import { ProductosModule } from '../productos/productos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { InventarioModule } from '../inventario/inventario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovimientoInventario]),
    SucursalesModule,
    ProductosModule,
    UsuariosModule,
    InventarioModule,
  ],
  providers: [MovimientosInventarioService, MovimientosInventarioResolver],
  exports: [MovimientosInventarioService],
})
export class MovimientosInventarioModule {}