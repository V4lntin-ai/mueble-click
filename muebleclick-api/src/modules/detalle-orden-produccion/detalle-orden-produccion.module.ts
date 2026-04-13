import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleOrdenProduccion } from './entities/detalle-orden-produccion.entity';
import { DetalleOrdenProduccionService } from './detalle-orden-produccion.service';
import { DetalleOrdenProduccionResolver } from './detalle-orden-produccion.resolver';
import { OrdenesProduccionModule } from '../ordenes-produccion/ordenes-produccion.module';
import { MateriasPrimasModule } from '../materias-primas/materias-primas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetalleOrdenProduccion]),
    OrdenesProduccionModule,
    MateriasPrimasModule,
  ],
  providers: [DetalleOrdenProduccionService, DetalleOrdenProduccionResolver],
  exports: [DetalleOrdenProduccionService],
})
export class DetalleOrdenProduccionModule {}