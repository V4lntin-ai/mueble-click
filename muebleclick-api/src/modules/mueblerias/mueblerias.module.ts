import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Muebleria } from './entities/mueblerias.entity';
import { MuebleriaService } from './mueblerias.service';
import { MuebleriaResolver } from './mueblerias.resolver';
import { PropietarioModule } from '../propietario/propietario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Muebleria]),
    PropietarioModule,
  ],
  providers: [MuebleriaService, MuebleriaResolver],
  exports: [MuebleriaService],
})
export class MuebleriaModule {}