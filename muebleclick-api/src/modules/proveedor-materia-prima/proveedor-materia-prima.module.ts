import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedorMateriaPrima } from './entities/proveedor-materia-prima.entity';
import { ProveedorMateriaPrimaService } from './proveedor-materia-prima.service';
import { ProveedorMateriaPrimaResolver } from './proveedor-materia-prima.resolver';
import { ProveedoresModule } from '../proveedores/proveedores.module';
import { MateriasPrimasModule } from '../materias-primas/materias-primas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProveedorMateriaPrima]),
    ProveedoresModule,
    MateriasPrimasModule,
  ],
  providers: [ProveedorMateriaPrimaService, ProveedorMateriaPrimaResolver],
  exports: [ProveedorMateriaPrimaService],
})
export class ProveedorMateriaPrimaModule {}