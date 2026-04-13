import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sucursal } from './entities/sucursales.entity';
import { SucursalesService } from './sucursales.service';
import { SucursalesResolver } from './sucursales.resolver';
import { MuebleriaModule } from '../mueblerias/mueblerias.module';
import { MunicipiosModule } from '../municipios/municipios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sucursal]),
    MuebleriaModule,
    MunicipiosModule,
  ],
  providers: [SucursalesService, SucursalesResolver],
  exports: [SucursalesService],
})
export class SucursalesModule {}