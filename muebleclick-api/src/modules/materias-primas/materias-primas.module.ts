import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateriaPrima } from './entities/materias-primas.entity';
import { MateriasPrimasService } from './materias-primas.service';
import { MateriasPrimasResolver } from './materias-primas.resolver';
import { ProveedoresModule } from '../proveedores/proveedores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MateriaPrima]),
    ProveedoresModule,
  ],
  providers: [MateriasPrimasService, MateriasPrimasResolver],
  exports: [MateriasPrimasService],
})
export class MateriasPrimasModule {}