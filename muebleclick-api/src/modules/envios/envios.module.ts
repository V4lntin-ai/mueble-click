import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Envio } from './entities/envios.entity';
import { EnviosService } from './envios.service';
import { EnviosResolver } from './envios.resolver';
import { VentasModule } from '../ventas/ventas.module';
import { PaqueteriasModule } from '../paqueterias/paqueterias.module';
import { DireccionesEnvioModule } from '../direcciones-envio/direcciones-envio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Envio]),
    VentasModule,
    PaqueteriasModule,
    DireccionesEnvioModule,
  ],
  providers: [EnviosService, EnviosResolver],
  exports: [EnviosService],
})
export class EnviosModule {}