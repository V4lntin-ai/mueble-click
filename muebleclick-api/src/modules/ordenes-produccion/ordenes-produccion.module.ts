import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenProduccion } from './entities/ordenes-produccion.entity';
import { OrdenesProduccionService } from './ordenes-produccion.service';
import { OrdenesProduccionResolver } from './ordenes-produccion.resolver';
import { ProductosModule } from '../productos/productos.module';
import { SucursalesModule } from '../sucursales/sucursales.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenProduccion]),
    ProductosModule,
    SucursalesModule,
    UsuariosModule,
  ],
  providers: [OrdenesProduccionService, OrdenesProduccionResolver],
  exports: [OrdenesProduccionService],
})
export class OrdenesProduccionModule {}