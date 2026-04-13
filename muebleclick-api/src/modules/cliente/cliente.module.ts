import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { ClienteService } from './cliente.service';
import { ClienteResolver } from './cliente.resolver';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { MunicipiosModule } from '../municipios/municipios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    UsuariosModule,
    MunicipiosModule,
  ],
  providers: [ClienteService, ClienteResolver],
  exports: [ClienteService],
})
export class ClienteModule {}