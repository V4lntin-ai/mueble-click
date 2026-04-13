import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedorProducto } from './entities/proveedor-producto.entity';
import { ProveedorProductoService } from './proveedor-producto.service';
import { ProveedorProductoResolver } from './proveedor-producto.resolver';
import { ProveedoresModule } from '../proveedores/proveedores.module';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProveedorProducto]),
    ProveedoresModule,
    ProductosModule,
  ],
  providers: [ProveedorProductoService, ProveedorProductoResolver],
  exports: [ProveedorProductoService],
})
export class ProveedorProductoModule {}