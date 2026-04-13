import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comision } from './entities/comisiones.entity';
import { ComisionesService } from './comisiones.service';
import { ComisionesResolver } from './comisiones.resolver';
import { VentasModule } from '../ventas/ventas.module';
import { EmpleadoModule } from '../empleado/empleado.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comision]),
    VentasModule,
    EmpleadoModule,
  ],
  providers: [ComisionesService, ComisionesResolver],
  exports: [ComisionesService],
})
export class ComisionesModule {}