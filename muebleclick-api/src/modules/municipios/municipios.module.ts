import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipio } from './entities/municipio.entity';
import { MunicipiosService } from './municipios.service';
import { MunicipiosResolver } from './municipios.resolver';
import { EstadosModule } from '../estados/estados.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Municipio]),
    EstadosModule,
  ],
  providers: [MunicipiosService, MunicipiosResolver],
  exports: [MunicipiosService],
})
export class MunicipiosModule {}