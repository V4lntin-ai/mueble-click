import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoInventarioMP } from './entities/movimientos-inventario-mp.entity';
import { MovimientosInventarioMPService } from './movimientos-inventario-mp.service';
import { MovimientosInventarioMPResolver } from './movimientos-inventario-mp.resolver';
import { SucursalesModule } from '../sucursales/sucursales.module';
import { MateriasPrimasModule } from '../materias-primas/materias-primas.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { InventarioMPModule } from '../inventario-mp/inventario-mp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovimientoInventarioMP]),
    SucursalesModule,
    MateriasPrimasModule,
    UsuariosModule,
    InventarioMPModule,
  ],
  providers: [MovimientosInventarioMPService, MovimientosInventarioMPResolver],
  exports: [MovimientosInventarioMPService],
})
export class MovimientosInventarioMPModule {}