import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transferencia } from './entities/transferencias.entity';
import { TransferenciasService } from './transferencias.service';
import { TransferenciasResolver } from './transferencias.resolver';
import { SucursalesModule } from '../sucursales/sucursales.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transferencia]),
    SucursalesModule,
    UsuariosModule,
  ],
  providers: [TransferenciasService, TransferenciasResolver],
  exports: [TransferenciasService],
})
export class TransferenciasModule {}