import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedores.entity';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresResolver } from './proveedores.resolver';
import { MunicipiosModule } from '../municipios/municipios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proveedor]),
    MunicipiosModule,
  ],
  providers: [ProveedoresService, ProveedoresResolver],
  exports: [ProveedoresService],
})
export class ProveedoresModule {}