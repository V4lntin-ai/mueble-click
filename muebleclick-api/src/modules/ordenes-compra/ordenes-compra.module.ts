import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenCompra } from './entities/ordenes-compra.entity';
import { OrdenesCompraService } from './ordenes-compra.service';
import { OrdenesCompraResolver } from './ordenes-compra.resolver';
import { ProveedoresModule } from '../proveedores/proveedores.module';
import { SucursalesModule } from '../sucursales/sucursales.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenCompra]),
    ProveedoresModule,
    SucursalesModule,
    UsuariosModule,
  ],
  providers: [OrdenesCompraService, OrdenesCompraResolver],
  exports: [OrdenesCompraService],
})
export class OrdenesCompraModule {}