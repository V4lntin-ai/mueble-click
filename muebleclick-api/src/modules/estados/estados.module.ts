import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estado } from './entities/estado.entity';
import { EstadosService } from './estados.service';
import { EstadosResolver } from './estados.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Estado])],
  providers: [EstadosService, EstadosResolver],
  exports: [EstadosService],
})
export class EstadosModule {}