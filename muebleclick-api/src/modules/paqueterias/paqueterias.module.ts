import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paqueteria } from './entities/paqueterias.entity';
import { PaqueteriasService } from './paqueterias.service';
import { PaqueteriasResolver } from './paqueterias.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Paqueteria])],
  providers: [PaqueteriasService, PaqueteriasResolver],
  exports: [PaqueteriasService],
})
export class PaqueteriasModule {}