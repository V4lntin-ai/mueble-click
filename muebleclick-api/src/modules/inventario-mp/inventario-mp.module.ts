import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioMP } from './entities/inventario-mp.entity';
import { InventarioMPService } from './inventario-mp.service';
import { InventarioMPResolver } from './inventario-mp.resolver';
import { SucursalesModule } from '../sucursales/sucursales.module';
import { MateriasPrimasModule } from '../materias-primas/materias-primas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventarioMP]),
    SucursalesModule,
    MateriasPrimasModule,
  ],
  providers: [InventarioMPService, InventarioMPResolver],
  exports: [InventarioMPService],
})
export class InventarioMPModule {}