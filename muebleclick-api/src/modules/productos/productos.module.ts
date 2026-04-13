import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/productos.entity';
import { ProductosService } from './productos.service';
import { ProductosResolver } from './productos.resolver';
import { MuebleriaModule } from '../mueblerias/mueblerias.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    MuebleriaModule,
  ],
  providers: [ProductosService, ProductosResolver],
  exports: [ProductosService],
})
export class ProductosModule {}