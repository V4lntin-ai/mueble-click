import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DireccionEnvio } from './entities/direcciones-envio.entity';
import { DireccionesEnvioService } from './direcciones-envio.service';
import { DireccionesEnvioResolver } from './direcciones-envio.resolver';
import { ClienteModule } from '../cliente/cliente.module';
import { MunicipiosModule } from '../municipios/municipios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DireccionEnvio]),
    ClienteModule,
    MunicipiosModule,
  ],
  providers: [DireccionesEnvioService, DireccionesEnvioResolver],
  exports: [DireccionesEnvioService],
})
export class DireccionesEnvioModule {}