import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoMateriaPrima } from './entities/producto-materia-prima.entity';
import { ProductoMateriaPrimaService } from './producto-materia-prima.service';
import { ProductoMateriaPrimaResolver } from './producto-materia-prima.resolver';
import { ProductosModule } from '../productos/productos.module';
import { MateriasPrimasModule } from '../materias-primas/materias-primas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductoMateriaPrima]),
    ProductosModule,
    MateriasPrimasModule,
  ],
  providers: [ProductoMateriaPrimaService, ProductoMateriaPrimaResolver],
  exports: [ProductoMateriaPrimaService],
})
export class ProductoMateriaPrimaModule {}