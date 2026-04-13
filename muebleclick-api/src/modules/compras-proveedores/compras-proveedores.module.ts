import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompraProveedor } from './entities/compras-proveedores.entity';
import { ComprasProveedoresService } from './compras-proveedores.service';
import { ComprasProveedoresResolver } from './compras-proveedores.resolver';
import { ProveedoresModule } from '../proveedores/proveedores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompraProveedor]),
    ProveedoresModule,
  ],
  providers: [ComprasProveedoresService, ComprasProveedoresResolver],
  exports: [ComprasProveedoresService],
})
export class ComprasProveedoresModule {}