import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosResolver } from './usuarios.resolver';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    RolesModule,
  ],
  providers: [UsuariosService, UsuariosResolver],
  exports: [UsuariosService],
})
export class UsuariosModule {}