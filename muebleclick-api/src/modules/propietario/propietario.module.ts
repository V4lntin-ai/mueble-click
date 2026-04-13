import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Propietario } from './entities/propietario.entity';
import { PropietarioService } from './propietario.service';
import { PropietarioResolver } from './propietario.resolver';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Propietario]),
    UsuariosModule,
  ],
  providers: [PropietarioService, PropietarioResolver],
  exports: [PropietarioService],
})
export class PropietarioModule {}